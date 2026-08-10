/* eslint-disable no-unused-vars */
/**
 * Worker chấm bài Python: chạy CPython thật đã biên dịch sang WebAssembly (Pyodide),
 * không phải "giả lập cú pháp" — lỗi, ngoại lệ, thứ tự thực thi đều đúng như Python thật.
 *
 * Worker này được TÁI SỬ DỤNG giữa các lần bấm "Chạy" (xem runner.js) vì tải Pyodide
 * (~vài MB qua CDN) tốn vài giây; chỉ trả tốn phí đó một lần cho mỗi phiên làm việc.
 * Nếu một bài bị timeout (vòng lặp vô hạn), runner.js sẽ terminate() và lần chạy kế
 * tiếp sẽ tự tạo lại worker + tải lại Pyodide.
 */

const PYODIDE_BASE = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';

/** Driver Python: nạp một lần, sau đó chỉ GỌI HÀM __neetcode_run cho mỗi lượt chấm.
 *  Nhận toàn bộ đầu vào qua tham số (không nội suy chuỗi) để tránh lỗi escape ký tự. */
const DRIVER_SRC = `
import json, time, math, builtins, collections, traceback

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildList(arr):
    head = ListNode(0)
    cur = head
    for v in (arr or []):
        cur.next = ListNode(v)
        cur = cur.next
    return head.next

def listToArray(node, limit=10000):
    out = []
    n = node
    guard = 0
    while n and guard < limit:
        out.append(n.val)
        n = n.next
        guard += 1
    if guard >= limit:
        raise Exception('Danh sách bị lặp vòng (cycle) hoặc quá dài')
    return out

def buildCycleList(arr, pos):
    head = buildList(arr)
    if head and pos >= 0:
        tail = head
        while tail.next:
            tail = tail.next
        target = head
        k = 0
        while k < pos:
            target = target.next
            k += 1
        tail.next = target
    return head

def buildTree(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    q = [root]
    i = 1
    while q and i < len(arr):
        node = q.pop(0)
        if i < len(arr):
            v = arr[i]; i += 1
            if v is not None:
                node.left = TreeNode(v)
                q.append(node.left)
        if i < len(arr):
            v = arr[i]; i += 1
            if v is not None:
                node.right = TreeNode(v)
                q.append(node.right)
    return root

def treeToArray(root):
    if not root:
        return []
    out = []
    q = [root]
    while q:
        n = q.pop(0)
        if n is None:
            out.append(None)
            continue
        out.append(n.val)
        q.append(n.left)
        q.append(n.right)
    while out and out[-1] is None:
        out.pop()
    return out

def __neetcode_repr(v):
    """Mô tả các giá trị json.dumps không xử lý được — set và deque là hai thứ
    người học dùng suốt trong bài thuật toán."""
    try:
        if isinstance(v, (set, frozenset)):
            if not v:
                return 'set()'
            return 'set{' + ', '.join(str(x) for x in sorted(v, key=str)) + '}'
        if isinstance(v, collections.deque):
            return list(v)
        if callable(v):
            return '<hàm ' + getattr(v, '__name__', 'ẩn danh') + '>'
        return str(v)
    except Exception:
        return '<không hiển thị được>'

def __neetcode_preview(value, max_len=260):
    try:
        s = json.dumps(value, default=__neetcode_repr, ensure_ascii=False)
    except Exception:
        s = str(value)
    # __neetcode_repr trả về chuỗi -> json bọc thêm dấu nháy. Bỏ nháy đó đi
    # (giá trị gốc không phải chuỗi thì không có lý gì hiện dấu nháy).
    if not isinstance(value, str) and len(s) >= 2 and s[0] == '"' and s[-1] == '"':
        s = s[1:-1].replace('\\\\"', '"')
    return s if len(s) <= max_len else s[:max_len] + ' …'

def __neetcode_error_line(exc):
    """Số dòng trong code NGƯỜI HỌC gây ra lỗi (exec dùng filename '<string>')."""
    try:
        lineno = getattr(exc, 'lineno', None)
        frames = traceback.extract_tb(exc.__traceback__)
        for frame in reversed(frames):
            if frame.filename == '<string>':
                return frame.lineno
        return lineno
    except Exception:
        return None

# ---------- Theo dõi biến: hàm trace() dành cho người học ----------
__NEETCODE_TRACE_CAP = 200
__neetcode_trace_rows = []
__neetcode_trace_calls = [0]

def __neetcode_trace_reset():
    del __neetcode_trace_rows[:]
    __neetcode_trace_calls[0] = 0

def __neetcode_trace(*args, **kwargs):
    """trace(i=i, l=l, r=r)  ·  trace('sau khi dịch', l=l, r=r)  ·  trace({'i': i})"""
    __neetcode_trace_calls[0] += 1
    if len(__neetcode_trace_rows) >= __NEETCODE_TRACE_CAP:
        return
    label = None
    values = {}
    positional = []
    for a in args:
        if isinstance(a, str) and label is None and not values:
            label = a
        elif isinstance(a, dict):
            values.update(a)
        else:
            positional.append(a)
    values.update(kwargs)
    if not values and positional:
        if len(positional) == 1:
            values = {'giá trị': positional[0]}
        else:
            for idx, v in enumerate(positional):
                values['giá trị ' + str(idx + 1)] = v
    __neetcode_trace_rows.append({
        'label': label,
        'values': {str(k): __neetcode_preview(v, 60) for k, v in values.items()},
    })

def __neetcode_take_trace():
    if not __neetcode_trace_rows:
        return None
    return {
        'rows': list(__neetcode_trace_rows),
        'total': __neetcode_trace_calls[0],
        'truncated': __neetcode_trace_calls[0] > len(__neetcode_trace_rows),
    }

def __neetcode_deep_equal(a, b):
    if isinstance(a, bool) or isinstance(b, bool):
        return a is b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        try:
            if math.isnan(a) and math.isnan(b):
                return True
        except TypeError:
            pass
        return abs(a - b) < 1e-9
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        if len(a) != len(b):
            return False
        return all(__neetcode_deep_equal(x, y) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict):
        if set(a.keys()) != set(b.keys()):
            return False
        return all(__neetcode_deep_equal(a[k], b[k]) for k in a)
    return a == b

def __neetcode_make_callable(src, user_globals, name):
    """Chấp nhận cả lambda biểu thức (ưu tiên) lẫn 'def NAME(...): ...' nhiều dòng
    (dùng cho harness/checker phức tạp không viết gọn thành một biểu thức được, ví dụ MinStack)."""
    if not src:
        return None
    try:
        return eval(src, user_globals)
    except SyntaxError:
        ns = dict(user_globals)
        exec(src, ns)
        return ns[name]

def __neetcode_run(code, entry, tests_json, harness_src, checker_src):
    logs = []
    real_print = builtins.print

    def fake_print(*args, **kwargs):
        if len(logs) < 40:
            logs.append(' '.join(str(a) for a in args))
    builtins.print = fake_print

    try:
        user_globals = {
            'ListNode': ListNode,
            'TreeNode': TreeNode,
            'buildList': buildList,
            'listToArray': listToArray,
            'buildCycleList': buildCycleList,
            'buildTree': buildTree,
            'treeToArray': treeToArray,
            'trace': __neetcode_trace,
        }
        try:
            exec(code, user_globals)
        except Exception as e:
            return json.dumps({
                'ok': False, 'phase': 'compile', 'error': f'{type(e).__name__}: {e}',
                'logs': list(logs), 'errorLine': __neetcode_error_line(e),
            })
        setup_logs = list(logs)
        del logs[:]

        fn = user_globals.get(entry)
        if not callable(fn):
            return json.dumps({
                'ok': False, 'phase': 'compile',
                'error': f'Không tìm thấy hàm "{entry}". Hãy giữ nguyên tên hàm trong khung code mẫu.',
                'logs': setup_logs,
            })

        try:
            harness = __neetcode_make_callable(harness_src, user_globals, 'harness') or (lambda f, args, t: f(*args))
            checker = __neetcode_make_callable(checker_src, user_globals, 'checker')
        except Exception as e:
            return json.dumps({'ok': False, 'phase': 'harness', 'error': f'{type(e).__name__}: {e}', 'logs': setup_logs})

        try:
            tests = json.loads(tests_json)
        except Exception as e:
            return json.dumps({'ok': False, 'phase': 'harness', 'error': f'Dữ liệu test lỗi: {e}', 'logs': setup_logs})

        results = []
        t0 = time.perf_counter()
        for i, t in enumerate(tests):
            hidden = bool(t.get('hidden'))
            scratch = bool(t.get('scratch'))
            try:
                args = json.loads(json.dumps(t.get('args')))
            except Exception:
                args = t.get('args')

            # log & trace của MỖI test được giữ riêng, không trộn vào nhau
            del logs[:]
            __neetcode_trace_reset()

            start = time.perf_counter()
            try:
                got = harness(fn, args, t)
                ms = (time.perf_counter() - start) * 1000
                expected = t.get('expected')
                if scratch:
                    # "Chạy thử": không có đáp án để so, chỉ hiện giá trị trả về
                    pass_ = True
                else:
                    pass_ = bool(checker(got, expected, t.get('args'))) if checker else __neetcode_deep_equal(got, expected)
                results.append({
                    'i': i, 'name': t.get('name'), 'hidden': hidden, 'scratch': scratch, 'pass': pass_,
                    'ms': round(ms, 2),
                    'args': None if hidden else __neetcode_preview(t.get('args')),
                    'expected': None if (hidden or scratch) else __neetcode_preview(expected),
                    'got': None if hidden else __neetcode_preview(got),
                    'logs': list(logs), 'trace': __neetcode_take_trace(),
                })
            except Exception as e:
                results.append({
                    'i': i, 'name': t.get('name'), 'hidden': hidden, 'scratch': scratch, 'pass': False,
                    'ms': round((time.perf_counter() - start) * 1000, 2),
                    'args': None if hidden else __neetcode_preview(t.get('args')),
                    'expected': None if (hidden or scratch) else __neetcode_preview(t.get('expected')),
                    'got': None, 'error': f'{type(e).__name__}: {e}',
                    'errorLine': __neetcode_error_line(e),
                    'logs': list(logs), 'trace': __neetcode_take_trace(),
                })
        total_ms = (time.perf_counter() - t0) * 1000
        return json.dumps({'ok': True, 'results': results, 'totalMs': round(total_ms, 2), 'logs': setup_logs})
    finally:
        builtins.print = real_print
`;

let pyodidePromise = null;
let runTestsFn = null;

async function getRunner() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const { loadPyodide } = await import(/* webpackIgnore: true */ `${PYODIDE_BASE}pyodide.mjs`);
      const pyodide = await loadPyodide({ indexURL: PYODIDE_BASE });
      pyodide.runPython(DRIVER_SRC);
      runTestsFn = pyodide.globals.get('__neetcode_run');
      return pyodide;
    })();
  }
  await pyodidePromise;
  return runTestsFn;
}

self.onmessage = async (e) => {
  const { code, entry, tests, harnessSrc, checkerSrc } = e.data;
  try {
    const run = await getRunner();
    const resultJson = run(code, entry, JSON.stringify(tests), harnessSrc || null, checkerSrc || null);
    self.postMessage(JSON.parse(resultJson));
  } catch (err) {
    self.postMessage({
      ok: false, phase: 'runtime',
      error: `${err?.name || 'Error'}: ${err?.message || String(err)}`,
      results: [], logs: [],
    });
  }
};
