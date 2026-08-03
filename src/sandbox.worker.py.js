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
import json, time, math, builtins

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

def __neetcode_preview(value, max_len=260):
    try:
        s = json.dumps(value, default=str, ensure_ascii=False)
    except Exception:
        s = str(value)
    return s if len(s) <= max_len else s[:max_len] + ' …'

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
        if len(logs) < 60:
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
        }
        try:
            exec(code, user_globals)
        except Exception as e:
            return json.dumps({'ok': False, 'phase': 'compile', 'error': f'{type(e).__name__}: {e}', 'logs': logs})

        fn = user_globals.get(entry)
        if not callable(fn):
            return json.dumps({
                'ok': False, 'phase': 'compile',
                'error': f'Không tìm thấy hàm "{entry}". Hãy giữ nguyên tên hàm trong khung code mẫu.',
                'logs': logs,
            })

        try:
            harness = __neetcode_make_callable(harness_src, user_globals, 'harness') or (lambda f, args, t: f(*args))
            checker = __neetcode_make_callable(checker_src, user_globals, 'checker')
        except Exception as e:
            return json.dumps({'ok': False, 'phase': 'harness', 'error': f'{type(e).__name__}: {e}', 'logs': logs})

        try:
            tests = json.loads(tests_json)
        except Exception as e:
            return json.dumps({'ok': False, 'phase': 'harness', 'error': f'Dữ liệu test lỗi: {e}', 'logs': logs})

        results = []
        t0 = time.perf_counter()
        for i, t in enumerate(tests):
            hidden = bool(t.get('hidden'))
            try:
                args = json.loads(json.dumps(t.get('args')))
            except Exception:
                args = t.get('args')
            start = time.perf_counter()
            try:
                got = harness(fn, args, t)
                ms = (time.perf_counter() - start) * 1000
                expected = t.get('expected')
                pass_ = bool(checker(got, expected, t.get('args'))) if checker else __neetcode_deep_equal(got, expected)
                results.append({
                    'i': i, 'name': t.get('name'), 'hidden': hidden, 'pass': pass_,
                    'ms': round(ms, 2),
                    'args': None if hidden else __neetcode_preview(t.get('args')),
                    'expected': None if hidden else __neetcode_preview(expected),
                    'got': None if hidden else __neetcode_preview(got),
                })
            except Exception as e:
                results.append({
                    'i': i, 'name': t.get('name'), 'hidden': hidden, 'pass': False,
                    'ms': round((time.perf_counter() - start) * 1000, 2),
                    'args': None if hidden else __neetcode_preview(t.get('args')),
                    'expected': None if hidden else __neetcode_preview(t.get('expected')),
                    'got': None, 'error': f'{type(e).__name__}: {e}',
                })
        total_ms = (time.perf_counter() - t0) * 1000
        return json.dumps({'ok': True, 'results': results, 'totalMs': round(total_ms, 2), 'logs': logs})
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
