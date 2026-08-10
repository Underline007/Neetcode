/**
 * Từ điển gợi ý cú pháp cho trình soạn thảo bài tập.
 *
 * Ưu tiên Python: danh sách Python bao phủ từ khoá, hàm dựng sẵn, thư viện chuẩn hay dùng
 * trong thuật toán (collections, heapq, bisect, itertools, functools), phương thức của
 * list/dict/str/set và các mẫu code (snippet) thường gặp. JavaScript có bộ rút gọn.
 *
 * Quy ước: trong `insert`, chuỗi "$|" đánh dấu vị trí đặt con trỏ sau khi chèn.
 * Mỗi mục: { label, kind, insert?, detail?, doc? }
 *   kind: kw (từ khoá) | fn (hàm) | mod (thư viện) | m (phương thức) | snip (mẫu code)
 */

const item = (label, kind, detail, doc, insert) => ({ label, kind, detail, doc, insert });

/* ============================== PYTHON ============================== */
const PY_KEYWORDS = [
  item('def', 'kw', 'def ten_ham(tham_so):', 'Định nghĩa hàm', 'def $|():\n    '),
  item('class', 'kw', 'class Ten:', 'Định nghĩa lớp', 'class $|:\n    '),
  item('return', 'kw', 'return <giá trị>', 'Trả giá trị về cho nơi gọi hàm', 'return $|'),
  item('if', 'kw', 'if <điều kiện>:', 'Rẽ nhánh', 'if $|:\n    '),
  item('elif', 'kw', 'elif <điều kiện>:', 'Nhánh phụ (else if của JS)', 'elif $|:\n    '),
  item('else', 'kw', 'else:', 'Nhánh còn lại', 'else:\n    $|'),
  item('for', 'kw', 'for x in <dãy>:', 'Lặp qua từng phần tử', 'for $| in :\n    '),
  item('while', 'kw', 'while <điều kiện>:', 'Lặp khi điều kiện còn đúng', 'while $|:\n    '),
  item('break', 'kw', 'break', 'Thoát khỏi vòng lặp gần nhất'),
  item('continue', 'kw', 'continue', 'Bỏ qua phần còn lại, sang lượt lặp kế'),
  item('pass', 'kw', 'pass', 'Câu lệnh rỗng — chỗ giữ chỗ cho khối chưa viết'),
  item('in', 'kw', 'x in dãy', 'Kiểm tra thuộc về / duyệt phần tử'),
  item('not', 'kw', 'not x', 'Phủ định (tương đương ! của JS)'),
  item('and', 'kw', 'a and b', 'Và logic (&& của JS)'),
  item('or', 'kw', 'a or b', 'Hoặc logic (|| của JS)'),
  item('is', 'kw', 'a is b', 'So sánh ĐỊNH DANH object — dùng cho None, không dùng cho số/chuỗi'),
  item('None', 'kw', 'None', 'Giá trị rỗng duy nhất của Python (null + undefined của JS)'),
  item('True', 'kw', 'True', 'Đúng — viết hoa chữ T'),
  item('False', 'kw', 'False', 'Sai — viết hoa chữ F'),
  item('lambda', 'kw', 'lambda x: <biểu thức>', 'Hàm vô danh 1 biểu thức (x => ... của JS)', 'lambda $|: '),
  item('import', 'kw', 'import <thư viện>', 'Nhập thư viện', 'import $|'),
  item('from', 'kw', 'from <thư viện> import <tên>', 'Nhập một phần của thư viện', 'from $| import '),
  item('try', 'kw', 'try: ... except: ...', 'Bắt lỗi', 'try:\n    $|\nexcept Exception as e:\n    '),
  item('except', 'kw', 'except <Lỗi> as e:', 'Nhánh xử lý lỗi', 'except $| as e:\n    '),
  item('raise', 'kw', 'raise ValueError("...")', 'Ném lỗi', 'raise $|'),
  item('with', 'kw', 'with <ngữ cảnh> as x:', 'Tự động dọn dẹp tài nguyên', 'with $| as f:\n    '),
  item('yield', 'kw', 'yield <giá trị>', 'Sinh giá trị trong generator', 'yield $|'),
  item('global', 'kw', 'global x', 'Cho phép gán biến toàn cục bên trong hàm'),
  item('nonlocal', 'kw', 'nonlocal x', 'Gán biến của hàm bao ngoài (dùng nhiều khi đệ quy)'),
  item('assert', 'kw', 'assert <điều kiện>', 'Khẳng định — sai thì ném AssertionError'),
  item('del', 'kw', 'del x', 'Xoá tên/phần tử'),
];

const PY_BUILTINS = [
  item('print', 'fn', 'print(*giá_trị, sep=" ", end="\\n")', 'In ra màn hình — dùng để gỡ lỗi', 'print($|)'),
  item('len', 'fn', 'len(x) -> int', 'Độ dài của list/str/dict/set (không phải .length)', 'len($|)'),
  item('range', 'fn', 'range(stop) | range(start, stop[, step])', 'Dãy số — dừng TRƯỚC stop', 'range($|)'),
  item('enumerate', 'fn', 'enumerate(dãy, start=0) -> (i, x)', 'Lặp vừa lấy chỉ số vừa lấy giá trị', 'enumerate($|)'),
  item('zip', 'fn', 'zip(a, b, ...) -> tuple', 'Ghép nhiều dãy theo cặp, dừng ở dãy ngắn nhất', 'zip($|)'),
  item('sorted', 'fn', 'sorted(dãy, key=None, reverse=False)', 'Trả về list MỚI đã sắp xếp (không sửa gốc)', 'sorted($|)'),
  item('reversed', 'fn', 'reversed(dãy)', 'Lặp ngược — bọc list() để lấy list', 'reversed($|)'),
  item('sum', 'fn', 'sum(dãy, start=0)', 'Tổng các phần tử', 'sum($|)'),
  item('min', 'fn', 'min(dãy) | min(a, b, key=...)', 'Giá trị nhỏ nhất', 'min($|)'),
  item('max', 'fn', 'max(dãy) | max(a, b, key=...)', 'Giá trị lớn nhất', 'max($|)'),
  item('abs', 'fn', 'abs(x)', 'Trị tuyệt đối', 'abs($|)'),
  item('round', 'fn', 'round(x, ndigits=0)', 'Làm tròn', 'round($|)'),
  item('pow', 'fn', 'pow(a, b[, mod])', 'Luỹ thừa, có thể lấy dư luôn', 'pow($|)'),
  item('divmod', 'fn', 'divmod(a, b) -> (thương, dư)', 'Chia lấy thương và dư cùng lúc', 'divmod($|)'),
  item('int', 'fn', 'int(x[, base])', 'Ép về số nguyên', 'int($|)'),
  item('float', 'fn', 'float(x)', 'Ép về số thực', 'float($|)'),
  item('str', 'fn', 'str(x)', 'Ép về chuỗi', 'str($|)'),
  item('bool', 'fn', 'bool(x)', 'Ép về True/False', 'bool($|)'),
  item('list', 'fn', 'list(dãy)', 'Tạo list (cũng dùng để copy nông)', 'list($|)'),
  item('dict', 'fn', 'dict() | dict(cặp)', 'Tạo dict — tương đương Map/Object của JS', 'dict($|)'),
  item('set', 'fn', 'set(dãy)', 'Tập hợp không trùng lặp, kiểm tra thuộc về O(1)', 'set($|)'),
  item('tuple', 'fn', 'tuple(dãy)', 'Bộ giá trị BẤT BIẾN — dùng làm key của dict/set được', 'tuple($|)'),
  item('any', 'fn', 'any(dãy) -> bool', 'Có ít nhất một phần tử đúng', 'any($|)'),
  item('all', 'fn', 'all(dãy) -> bool', 'Mọi phần tử đều đúng', 'all($|)'),
  item('map', 'fn', 'map(hàm, dãy)', 'Áp dụng hàm lên từng phần tử (lười — bọc list())', 'map($|)'),
  item('filter', 'fn', 'filter(hàm, dãy)', 'Lọc phần tử thoả điều kiện (lười — bọc list())', 'filter($|)'),
  item('isinstance', 'fn', 'isinstance(x, Kiểu)', 'Kiểm tra kiểu dữ liệu', 'isinstance($|)'),
  item('type', 'fn', 'type(x)', 'Lấy kiểu của giá trị', 'type($|)'),
  item('ord', 'fn', 'ord("a") -> 97', 'Ký tự -> mã Unicode', 'ord($|)'),
  item('chr', 'fn', 'chr(97) -> "a"', 'Mã Unicode -> ký tự', 'chr($|)'),
  item('input', 'fn', 'input(prompt)', 'Đọc một dòng từ bàn phím', 'input($|)'),
  item('float("inf")', 'fn', 'float("inf") | float("-inf")', 'Vô cực — giá trị khởi tạo cho bài tìm min/max'),
  item('trace', 'fn', 'trace(i=i, l=l, r=r)', 'Theo dõi biến: mỗi lần gọi ghi một bước vào bảng "Theo dõi biến" bên dưới kết quả', 'trace($|)'),
];

const PY_MODULES = [
  item('deque', 'mod', 'from collections import deque', 'Hàng đợi hai đầu — appendleft/popleft O(1), dùng cho BFS', 'deque($|)'),
  item('defaultdict', 'mod', 'defaultdict(list) | defaultdict(int)', 'Dict tự tạo giá trị mặc định — hết KeyError', 'defaultdict($|)'),
  item('Counter', 'mod', 'Counter(dãy) -> {phần_tử: số_lần}', 'Đếm tần suất trong một dòng', 'Counter($|)'),
  item('OrderedDict', 'mod', 'OrderedDict()', 'Dict có move_to_end — dùng cho LRU Cache', 'OrderedDict($|)'),
  item('heapq', 'mod', 'import heapq', 'Hàng đợi ưu tiên (min-heap)'),
  item('heappush', 'mod', 'heapq.heappush(heap, x)', 'Thêm vào heap — O(log n)', 'heappush($|)'),
  item('heappop', 'mod', 'heapq.heappop(heap)', 'Lấy phần tử NHỎ NHẤT ra — O(log n)', 'heappop($|)'),
  item('heapify', 'mod', 'heapq.heapify(list)', 'Biến list thành heap tại chỗ — O(n)', 'heapify($|)'),
  item('nlargest', 'mod', 'heapq.nlargest(k, dãy, key=None)', 'k phần tử lớn nhất', 'nlargest($|)'),
  item('nsmallest', 'mod', 'heapq.nsmallest(k, dãy, key=None)', 'k phần tử nhỏ nhất', 'nsmallest($|)'),
  item('bisect_left', 'mod', 'bisect.bisect_left(a, x)', 'Vị trí chèn TRÁI trong list đã sắp xếp — O(log n)', 'bisect_left($|)'),
  item('bisect_right', 'mod', 'bisect.bisect_right(a, x)', 'Vị trí chèn PHẢI trong list đã sắp xếp', 'bisect_right($|)'),
  item('insort', 'mod', 'bisect.insort(a, x)', 'Chèn giữ nguyên thứ tự sắp xếp', 'insort($|)'),
  item('lru_cache', 'mod', '@lru_cache(maxsize=None)', 'Ghi nhớ kết quả hàm — memoization cho quy hoạch động', 'lru_cache(maxsize=None)'),
  item('cache', 'mod', '@cache', 'lru_cache không giới hạn (Python 3.9+)'),
  item('combinations', 'mod', 'itertools.combinations(dãy, r)', 'Tổ hợp chập r', 'combinations($|)'),
  item('permutations', 'mod', 'itertools.permutations(dãy, r=None)', 'Hoán vị', 'permutations($|)'),
  item('product', 'mod', 'itertools.product(*dãy, repeat=1)', 'Tích Descartes — thay cho vòng lặp lồng nhau', 'product($|)'),
  item('accumulate', 'mod', 'itertools.accumulate(dãy)', 'Tổng tiền tố (prefix sum)', 'accumulate($|)'),
  item('math', 'mod', 'import math', 'math.inf, math.sqrt, math.gcd, math.ceil, math.floor, math.log2'),
];

const PY_MEMBERS = [
  /* list */
  item('append', 'm', 'list.append(x)', 'Thêm 1 phần tử vào cuối — O(1)', 'append($|)'),
  item('extend', 'm', 'list.extend(dãy)', 'Nối thêm nhiều phần tử', 'extend($|)'),
  item('insert', 'm', 'list.insert(i, x)', 'Chèn tại vị trí i — O(n)', 'insert($|)'),
  item('pop', 'm', 'list.pop(i=-1) | dict.pop(key)', 'Lấy ra và xoá; pop() cuối là O(1), pop(0) là O(n)', 'pop($|)'),
  item('remove', 'm', 'list.remove(x) | set.remove(x)', 'Xoá theo GIÁ TRỊ (lần xuất hiện đầu)', 'remove($|)'),
  item('index', 'm', 'list.index(x) | str.index(sub)', 'Vị trí xuất hiện đầu tiên — O(n)', 'index($|)'),
  item('count', 'm', 'list.count(x) | str.count(sub)', 'Đếm số lần xuất hiện', 'count($|)'),
  item('sort', 'm', 'list.sort(key=None, reverse=False)', 'Sắp xếp TẠI CHỖ, trả về None', 'sort($|)'),
  item('reverse', 'm', 'list.reverse()', 'Đảo ngược tại chỗ', 'reverse()'),
  item('copy', 'm', 'list.copy() | dict.copy()', 'Copy NÔNG (một tầng)', 'copy()'),
  item('clear', 'm', 'list.clear() | dict.clear()', 'Xoá sạch nội dung', 'clear()'),
  /* dict */
  item('get', 'm', 'dict.get(key, default=None)', 'Lấy giá trị, không có thì trả mặc định (không lỗi)', 'get($|)'),
  item('keys', 'm', 'dict.keys()', 'Các khoá', 'keys()'),
  item('values', 'm', 'dict.values()', 'Các giá trị', 'values()'),
  item('items', 'm', 'dict.items() -> (key, value)', 'Duyệt cặp khoá–giá trị', 'items()'),
  item('setdefault', 'm', 'dict.setdefault(key, default)', 'Lấy, chưa có thì đặt mặc định rồi lấy', 'setdefault($|)'),
  item('update', 'm', 'dict.update(dict_khác) | set.update(dãy)', 'Gộp thêm vào', 'update($|)'),
  item('most_common', 'm', 'Counter.most_common(n=None)', 'n phần tử xuất hiện nhiều nhất', 'most_common($|)'),
  item('move_to_end', 'm', 'OrderedDict.move_to_end(key, last=True)', 'Đẩy khoá về cuối — lõi của LRU Cache', 'move_to_end($|)'),
  /* deque */
  item('appendleft', 'm', 'deque.appendleft(x)', 'Thêm vào ĐẦU — O(1) (list thì O(n))', 'appendleft($|)'),
  item('popleft', 'm', 'deque.popleft()', 'Lấy từ ĐẦU — O(1), lõi của BFS', 'popleft()'),
  /* str */
  item('split', 'm', 'str.split(sep=None, maxsplit=-1)', 'Cắt chuỗi thành list', 'split($|)'),
  item('join', 'm', '"sep".join(dãy_chuỗi)', 'Nối list chuỗi — ngược của split, nhanh hơn cộng chuỗi', 'join($|)'),
  item('strip', 'm', 'str.strip(chars=None)', 'Bỏ khoảng trắng hai đầu', 'strip($|)'),
  item('replace', 'm', 'str.replace(cũ, mới)', 'Thay thế chuỗi con', 'replace($|)'),
  item('startswith', 'm', 'str.startswith(tiền_tố)', 'Bắt đầu bằng?', 'startswith($|)'),
  item('endswith', 'm', 'str.endswith(hậu_tố)', 'Kết thúc bằng?', 'endswith($|)'),
  item('find', 'm', 'str.find(sub) -> -1 nếu không có', 'Như index nhưng không ném lỗi', 'find($|)'),
  item('lower', 'm', 'str.lower()', 'Về chữ thường', 'lower()'),
  item('upper', 'm', 'str.upper()', 'Về chữ hoa', 'upper()'),
  item('isdigit', 'm', 'str.isdigit()', 'Toàn chữ số?', 'isdigit()'),
  item('isalpha', 'm', 'str.isalpha()', 'Toàn chữ cái?', 'isalpha()'),
  item('isalnum', 'm', 'str.isalnum()', 'Toàn chữ cái hoặc số?', 'isalnum()'),
  /* set */
  item('add', 'm', 'set.add(x)', 'Thêm vào set — O(1)', 'add($|)'),
  item('discard', 'm', 'set.discard(x)', 'Xoá, không có cũng không lỗi', 'discard($|)'),
  item('union', 'm', 'set.union(b) | a | b', 'Hợp hai tập', 'union($|)'),
  item('intersection', 'm', 'set.intersection(b) | a & b', 'Giao hai tập', 'intersection($|)'),
  item('difference', 'm', 'set.difference(b) | a - b', 'Hiệu hai tập', 'difference($|)'),
];

/** Mẫu code hay dùng — hiển thị ở bảng "Cú pháp thường dùng" và cũng nằm trong gợi ý. */
const PY_SNIPPETS = [
  {
    group: 'Vòng lặp',
    items: [
      item('for i in range', 'snip', 'for i in range(n):', 'Lặp theo chỉ số', 'for i in range($|):\n    '),
      item('for x in arr', 'snip', 'for x in arr:', 'Lặp theo giá trị — cách Pythonic nhất', 'for x in $|:\n    '),
      item('for i, x in enumerate', 'snip', 'for i, x in enumerate(arr):', 'Cần cả chỉ số lẫn giá trị', 'for i, x in enumerate($|):\n    '),
      item('for k, v in items', 'snip', 'for k, v in d.items():', 'Duyệt dict', 'for k, v in $|.items():\n    '),
      item('while trái < phải', 'snip', 'while l < r:', 'Hai con trỏ / tìm kiếm nhị phân', 'while l < r:\n    $|'),
      item('duyệt ngược', 'snip', 'for i in range(n - 1, -1, -1):', 'Lặp từ cuối về đầu', 'for i in range(len($|) - 1, -1, -1):\n    '),
    ],
  },
  {
    group: 'Cấu trúc dữ liệu',
    items: [
      item('list rỗng / khởi tạo', 'snip', 'res = []  |  dp = [0] * n', 'Tạo mảng', 'dp = [0] * $|'),
      item('mảng 2 chiều', 'snip', 'dp = [[0] * m for _ in range(n)]', 'Lưu ý: KHÔNG dùng [[0]*m]*n (dùng chung 1 hàng!)', 'dp = [[0] * $| for _ in range()]'),
      item('dict đếm', 'snip', 'cnt = defaultdict(int)', 'Đếm mà không lo KeyError', 'cnt = defaultdict(int)\n$|'),
      item('dict gom nhóm', 'snip', 'groups = defaultdict(list)', 'Gom phần tử theo khoá', 'groups = defaultdict(list)\n$|'),
      item('set để tra nhanh', 'snip', 'seen = set()', 'Kiểm tra đã gặp chưa — O(1)', 'seen = set()\n$|'),
      item('hàng đợi BFS', 'snip', 'q = deque([start])', 'BFS luôn dùng deque, không dùng list', 'q = deque([$|])'),
      item('min-heap', 'snip', 'heap = []; heappush(heap, x)', 'Hàng đợi ưu tiên; max-heap thì đẩy -x', 'heap = []\nheappush(heap, $|)'),
    ],
  },
  {
    group: 'Biểu thức Python',
    items: [
      item('list comprehension', 'snip', '[f(x) for x in arr if dk]', 'Thay cho map/filter — ngắn và nhanh hơn', '[$| for x in arr]'),
      item('dict comprehension', 'snip', '{k: v for k, v in cặp}', 'Tạo dict trong một dòng', '{$|: v for k, v in }'),
      item('toán tử ba ngôi', 'snip', 'a if dk else b', 'Ngược thứ tự so với dk ? a : b của JS', '$| if  else '),
      item('gán đồng thời', 'snip', 'a, b = b, a', 'Hoán đổi không cần biến tạm', 'a, b = b, a'),
      item('mở gói (unpack)', 'snip', 'đầu, *giữa, cuối = arr', 'Tách phần tử theo vị trí'),
      item('f-string', 'snip', 'f"giá trị {x}"', 'Nội suy chuỗi (template literal của JS)', 'f"$|"'),
      item('cắt lát (slice)', 'snip', 'arr[start:stop:step]', 'arr[::-1] đảo ngược, arr[:] copy nông', '[$|:]'),
      item('so sánh chuỗi', 'snip', '0 <= i < n', 'Python cho phép nối phép so sánh'),
    ],
  },
  {
    group: 'Hàm & lớp',
    items: [
      item('def hàm', 'snip', 'def ten(a, b):', 'Định nghĩa hàm', 'def $|(self):\n    '),
      item('def có gợi ý kiểu', 'snip', 'def f(nums: list[int]) -> int:', 'Type hint — không bắt buộc nhưng nên có', 'def $|(nums: list[int]) -> int:\n    '),
      item('hàm đệ quy lồng', 'snip', 'def dfs(node): ...', 'Hàm phụ bên trong hàm chính, dùng chung biến ngoài', 'def dfs($|):\n        '),
      item('memoization', 'snip', '@lru_cache(maxsize=None)', 'Ghi nhớ kết quả — biến đệ quy mũ thành đa thức', '@lru_cache(maxsize=None)\ndef $|():\n    '),
      item('class', 'snip', 'class Ten: def __init__(self): ...', 'Định nghĩa lớp có hàm khởi tạo', 'class $|:\n    def __init__(self):\n        '),
      item('sắp xếp theo khoá', 'snip', 'arr.sort(key=lambda x: x[1])', 'Sắp xếp theo trường bất kỳ, đảo bằng reverse=True', 'sort(key=lambda x: $|)'),
    ],
  },
  {
    group: 'Gỡ lỗi',
    items: [
      item('theo dõi biến', 'snip', 'trace(i=i, l=l, r=r)', 'Ghi lại giá trị các biến ở bước này — hiện thành bảng bên dưới kết quả chạy', 'trace($|)'),
      item('theo dõi có nhãn', 'snip', 'trace("sau khi dịch", l=l, r=r)', 'Đặt tên cho bước để dễ đọc bảng theo dõi', 'trace("$|", )'),
      item('in ra để xem', 'snip', 'print(x)', 'Log của mỗi test được hiện riêng, không trộn lẫn', 'print($|)'),
    ],
  },
];

/* ============================== JAVASCRIPT ============================== */
const JS_KEYWORDS = [
  item('const', 'kw', 'const x = ...', 'Khai báo không gán lại được', 'const $| = '),
  item('let', 'kw', 'let x = ...', 'Khai báo gán lại được', 'let $| = '),
  item('function', 'kw', 'function ten(a) { }', 'Định nghĩa hàm', 'function $|() {\n  \n}'),
  item('return', 'kw', 'return <giá trị>', 'Trả giá trị về cho nơi gọi hàm'),
  item('if', 'kw', 'if (dk) { }', 'Rẽ nhánh', 'if ($|) {\n  \n}'),
  item('else', 'kw', 'else { }', 'Nhánh còn lại', 'else {\n  $|\n}'),
  item('for', 'kw', 'for (let i = 0; i < n; i++)', 'Vòng lặp theo chỉ số', 'for (let i = 0; i < $|; i++) {\n  \n}'),
  item('for...of', 'kw', 'for (const x of arr)', 'Lặp qua từng giá trị của mảng/Set/Map', 'for (const x of $|) {\n  \n}'),
  item('while', 'kw', 'while (dk) { }', 'Lặp khi điều kiện còn đúng', 'while ($|) {\n  \n}'),
  item('break', 'kw', 'break', 'Thoát khỏi vòng lặp gần nhất'),
  item('continue', 'kw', 'continue', 'Bỏ qua phần còn lại, sang lượt lặp kế'),
  item('class', 'kw', 'class Ten { }', 'Định nghĩa lớp', 'class $| {\n  constructor() {\n    \n  }\n}'),
  item('null', 'kw', 'null', 'Rỗng có chủ đích'),
  item('undefined', 'kw', 'undefined', 'Chưa được gán'),
  item('true', 'kw', 'true', 'Đúng — viết thường (Python thì viết hoa True)'),
  item('false', 'kw', 'false', 'Sai — viết thường (Python thì viết hoa False)'),
  item('typeof', 'kw', 'typeof x', 'Kiểu của giá trị'),
];

const JS_BUILTINS = [
  item('console.log', 'fn', 'console.log(...)', 'In ra màn hình để gỡ lỗi', 'console.log($|)'),
  item('Math.max', 'fn', 'Math.max(a, b) | Math.max(...arr)', 'Giá trị lớn nhất', 'Math.max($|)'),
  item('Math.min', 'fn', 'Math.min(a, b) | Math.min(...arr)', 'Giá trị nhỏ nhất', 'Math.min($|)'),
  item('Math.floor', 'fn', 'Math.floor(x)', 'Làm tròn xuống — dùng để chia lấy phần nguyên', 'Math.floor($|)'),
  item('Math.ceil', 'fn', 'Math.ceil(x)', 'Làm tròn lên', 'Math.ceil($|)'),
  item('Math.round', 'fn', 'Math.round(x)', 'Làm tròn gần nhất', 'Math.round($|)'),
  item('Math.abs', 'fn', 'Math.abs(x)', 'Trị tuyệt đối', 'Math.abs($|)'),
  item('Math.sqrt', 'fn', 'Math.sqrt(x)', 'Căn bậc hai', 'Math.sqrt($|)'),
  item('Math.pow', 'fn', 'Math.pow(a, b) | a ** b', 'Luỹ thừa', 'Math.pow($|)'),
  item('Infinity', 'fn', 'Infinity | -Infinity', 'Vô cực — giá trị khởi tạo cho bài tìm min/max'),
  item('Map', 'fn', 'new Map()', 'Bảng băm giữ mọi kiểu khoá — tương đương dict của Python', 'new Map($|)'),
  item('Set', 'fn', 'new Set()', 'Tập hợp không trùng lặp, kiểm tra thuộc về O(1)', 'new Set($|)'),
  item('Array.from', 'fn', 'Array.from({length: n}, () => 0)', 'Tạo mảng có sẵn giá trị', 'Array.from({ length: $| }, () => 0)'),
  item('Array.isArray', 'fn', 'Array.isArray(x)', 'Kiểm tra có phải mảng không', 'Array.isArray($|)'),
  item('Object.entries', 'fn', 'Object.entries(obj) -> [[k, v], ...]', 'Duyệt cặp khoá–giá trị của object thường (tương đương d.items() của Python)', 'Object.entries($|)'),
  item('Object.keys', 'fn', 'Object.keys(obj)', 'Các khoá của object thường', 'Object.keys($|)'),
  item('Object.values', 'fn', 'Object.values(obj)', 'Các giá trị của object thường', 'Object.values($|)'),
  item('parseInt', 'fn', 'parseInt(s, 10)', 'Ép chuỗi về số nguyên (nhớ truyền cơ số 10)', 'parseInt($|, 10)'),
  item('Number', 'fn', 'Number(x)', 'Ép về số', 'Number($|)'),
  item('String', 'fn', 'String(x)', 'Ép về chuỗi', 'String($|)'),
  item('String.fromCharCode', 'fn', 'String.fromCharCode(97) -> "a"', 'Mã Unicode -> ký tự (chr của Python)', 'String.fromCharCode($|)'),
  item('trace', 'fn', 'trace({ i, l, r })', 'Theo dõi biến: mỗi lần gọi ghi một bước vào bảng "Theo dõi biến" bên dưới kết quả', 'trace({ $| })'),
];

const JS_MEMBERS = [
  /* mảng */
  item('push', 'm', 'arr.push(x)', 'Thêm 1 phần tử vào cuối — O(1)', 'push($|)'),
  item('pop', 'm', 'arr.pop()', 'Lấy ra và xoá phần tử cuối — O(1)', 'pop()'),
  item('shift', 'm', 'arr.shift()', 'Lấy khỏi ĐẦU — O(n), tránh dùng trong vòng lặp lớn', 'shift()'),
  item('unshift', 'm', 'arr.unshift(x)', 'Thêm vào ĐẦU — O(n)', 'unshift($|)'),
  item('slice', 'm', 'arr.slice(start, end)', 'Cắt ra mảng mới, không sửa mảng gốc', 'slice($|)'),
  item('splice', 'm', 'arr.splice(i, n)', 'Xoá/chèn TẠI CHỖ', 'splice($|)'),
  item('at', 'm', 'arr.at(-1)', 'Phần tử theo chỉ số, cho phép chỉ số âm (arr[-1] của Python)', 'at($|)'),
  item('map', 'm', 'arr.map(x => ...)', 'Biến đổi từng phần tử thành mảng mới', 'map(($|) => )'),
  item('filter', 'm', 'arr.filter(x => dk)', 'Lọc phần tử thoả điều kiện', 'filter(($|) => )'),
  item('reduce', 'm', 'arr.reduce((acc, x) => ..., khởi_tạo)', 'Gộp mảng thành một giá trị (tính tổng, tìm max...)', 'reduce((acc, x) => $|, 0)'),
  item('find', 'm', 'arr.find(x => dk)', 'Phần tử ĐẦU TIÊN thoả điều kiện, không có thì undefined', 'find(($|) => )'),
  item('findIndex', 'm', 'arr.findIndex(x => dk)', 'Vị trí phần tử đầu tiên thoả điều kiện, không có thì -1', 'findIndex(($|) => )'),
  item('some', 'm', 'arr.some(x => dk)', 'Có ít nhất một phần tử đúng? (any của Python)', 'some(($|) => )'),
  item('every', 'm', 'arr.every(x => dk)', 'Mọi phần tử đều đúng? (all của Python)', 'every(($|) => )'),
  item('sort', 'm', 'arr.sort((a, b) => a - b)', 'Sắp xếp mảng TẠI CHỖ. Mặc định sắp theo CHUỖI — với số luôn phải truyền hàm so sánh', 'sort((a, b) => a - b)'),
  item('reverse', 'm', 'arr.reverse()', 'Đảo ngược mảng tại chỗ', 'reverse()'),
  item('indexOf', 'm', 'arr.indexOf(x)', 'Vị trí xuất hiện đầu tiên — O(n), không có thì trả -1', 'indexOf($|)'),
  item('includes', 'm', 'arr.includes(x)', 'Có chứa giá trị này không? — O(n), Set nhanh hơn nhiều', 'includes($|)'),
  item('concat', 'm', 'a.concat(b)', 'Nối hai mảng thành mảng mới', 'concat($|)'),
  item('flat', 'm', 'arr.flat()', 'Làm phẳng mảng lồng nhau', 'flat()'),
  item('entries', 'm', 'arr.entries() | map.entries()', 'Duyệt vừa lấy chỉ số vừa lấy giá trị (enumerate của Python)', 'entries()'),
  item('join', 'm', "arr.join('')", 'Nối mảng thành chuỗi — nhanh hơn cộng dồn chuỗi', 'join($|)'),
  /* Map / Set */
  item('has', 'm', 'map.has(k) | set.has(x)', 'Kiểm tra có khoá/phần tử này chưa — O(1)', 'has($|)'),
  item('get', 'm', 'map.get(k)', 'Lấy giá trị theo khoá, chưa có thì undefined', 'get($|)'),
  item('set', 'm', 'map.set(k, v)', 'Đặt giá trị cho khoá', 'set($|)'),
  item('add', 'm', 'set.add(x)', 'Thêm vào Set — O(1)', 'add($|)'),
  item('delete', 'm', 'map.delete(k) | set.delete(x)', 'Xoá khoá/phần tử (discard của Python)', 'delete($|)'),
  item('size', 'm', 'map.size | set.size', 'Số phần tử của Map/Set — là THUỘC TÍNH, không phải hàm', 'size'),
  item('keys', 'm', 'map.keys()', 'Các khoá của Map', 'keys()'),
  item('values', 'm', 'map.values()', 'Các giá trị của Map', 'values()'),
  /* chuỗi */
  item('split', 'm', "str.split('')", 'Cắt chuỗi thành mảng', 'split($|)'),
  item('charCodeAt', 'm', 'str.charCodeAt(0) -> 97', 'Ký tự -> mã Unicode (ord của Python)', 'charCodeAt($|)'),
  item('toLowerCase', 'm', 'str.toLowerCase()', 'Về chữ thường', 'toLowerCase()'),
  item('toUpperCase', 'm', 'str.toUpperCase()', 'Về chữ hoa', 'toUpperCase()'),
  item('trim', 'm', 'str.trim()', 'Bỏ khoảng trắng hai đầu', 'trim()'),
  item('startsWith', 'm', 'str.startsWith(tiền_tố)', 'Bắt đầu bằng?', 'startsWith($|)'),
  item('endsWith', 'm', 'str.endsWith(hậu_tố)', 'Kết thúc bằng?', 'endsWith($|)'),
  item('repeat', 'm', 'str.repeat(n)', 'Lặp lại chuỗi n lần', 'repeat($|)'),
  item('padStart', 'm', "str.padStart(n, '0')", 'Đệm thêm ký tự cho đủ độ dài', "padStart($|, '0')"),
  item('length', 'm', 'arr.length | str.length', 'Độ dài mảng/chuỗi — là THUỘC TÍNH, không phải hàm len()', 'length'),
];

const JS_SNIPPETS = [
  {
    group: 'Vòng lặp',
    items: [
      item('for chỉ số', 'snip', 'for (let i = 0; i < n; i++)', 'Vòng lặp cơ bản', 'for (let i = 0; i < $|; i++) {\n  \n}'),
      item('for...of', 'snip', 'for (const x of arr)', 'Duyệt giá trị', 'for (const x of $|) {\n  \n}'),
      item('two pointers', 'snip', 'while (l < r)', 'Hai con trỏ', 'let l = 0, r = arr.length - 1;\nwhile (l < r) {\n  $|\n}'),
    ],
  },
  {
    group: 'Cấu trúc dữ liệu',
    items: [
      item('mảng khởi tạo', 'snip', 'new Array(n).fill(0)', 'Tạo mảng n phần tử', 'new Array($|).fill(0)'),
      item('mảng 2 chiều', 'snip', 'Array.from({length: n}, () => Array(m).fill(0))', 'Không dùng fill([]) — mọi hàng sẽ chung tham chiếu!', 'Array.from({ length: $| }, () => new Array(m).fill(0))'),
      item('đếm tần suất', 'snip', 'cnt.set(x, (cnt.get(x) ?? 0) + 1)', 'Đếm số lần xuất hiện bằng Map', 'cnt.set($|, (cnt.get($|) ?? 0) + 1)'),
      item('gom nhóm theo khoá', 'snip', 'if (!g.has(k)) g.set(k, []); g.get(k).push(x)', 'Gom phần tử vào nhóm (defaultdict(list) của Python)', 'if (!g.has($|)) g.set($|, []);\ng.get($|).push(x);'),
      item('set để tra nhanh', 'snip', 'const seen = new Set()', 'Kiểm tra đã gặp chưa — O(1)', 'const seen = new Set();\n$|'),
      item('hàng đợi BFS', 'snip', 'const q = [start]; let head = 0;', 'JS không có deque: dùng mảng + con trỏ head, KHÔNG dùng shift() (O(n))', 'const q = [$|];\nlet head = 0;\nwhile (head < q.length) {\n  const cur = q[head++];\n  \n}'),
      item('tổng tiền tố', 'snip', 'const pre = [0]; for (const x of arr) pre.push(pre.at(-1) + x)', 'sum(i..j) = pre[j+1] - pre[i]', 'const pre = [0];\nfor (const x of $|) pre.push(pre.at(-1) + x);'),
    ],
  },
  {
    group: 'Biểu thức JavaScript',
    items: [
      item('toán tử ba ngôi', 'snip', 'dk ? a : b', 'Rẽ nhánh trong một biểu thức', '$| ?  : '),
      item('giá trị mặc định', 'snip', 'x ?? 0', 'Dùng 0 khi x là null/undefined (KHÁC || vì 0 và "" vẫn giữ nguyên)', '$| ?? 0'),
      item('truy cập an toàn', 'snip', 'node?.next', 'Không lỗi khi node là null/undefined', '$|?.'),
      item('gán đồng thời', 'snip', '[a, b] = [b, a]', 'Hoán đổi không cần biến tạm', '[a, b] = [b, a];'),
      item('trải mảng', 'snip', '[...arr]', 'Sao chép nông / trải tham số: Math.max(...arr)', '[...$|]'),
      item('chuỗi mẫu', 'snip', '`giá trị ${x}`', 'Nội suy chuỗi (f-string của Python)', '`$|`'),
    ],
  },
  {
    group: 'Gỡ lỗi',
    items: [
      item('theo dõi biến', 'snip', 'trace({ i, l, r })', 'Ghi lại giá trị các biến ở bước này — hiện thành bảng bên dưới kết quả chạy', 'trace({ $| })'),
      item('theo dõi có nhãn', 'snip', 'trace("sau khi dịch", { l, r })', 'Đặt tên cho bước để dễ đọc bảng theo dõi', 'trace("$|", {  })'),
      item('in ra để xem', 'snip', 'console.log(x)', 'Log của mỗi test được hiện riêng, không trộn lẫn', 'console.log($|)'),
    ],
  },
];

/* ============================== xuất ra ============================== */
export const HINTS = {
  python: {
    indent: '    ',
    indentSize: 4,
    globals: [...PY_KEYWORDS, ...PY_BUILTINS, ...PY_MODULES, ...PY_SNIPPETS.flatMap((g) => g.items)],
    members: PY_MEMBERS,
    snippets: PY_SNIPPETS,
  },
  javascript: {
    indent: '  ',
    indentSize: 2,
    globals: [...JS_KEYWORDS, ...JS_BUILTINS, ...JS_SNIPPETS.flatMap((g) => g.items)],
    members: JS_MEMBERS,
    snippets: JS_SNIPPETS,
  },
};

export const KIND_LABEL = { kw: 'từ khoá', fn: 'hàm', mod: 'thư viện', m: 'phương thức', snip: 'mẫu', local: 'trong bài' };

/**
 * Lọc gợi ý theo tiền tố người dùng đang gõ.
 * @param {string} prefix  phần định danh đang gõ
 * @param {boolean} isMember  true nếu ngay trước tiền tố là dấu chấm
 * @param {string[]} locals  các định danh xuất hiện trong code hiện tại
 */
export function completionsFor(lang, prefix, isMember, locals = []) {
  const dict = HINTS[lang] || HINTS.python;
  const pool = isMember
    ? dict.members
    : [...dict.globals, ...locals.map((l) => item(l, 'local', l, 'Định danh có trong code của bạn'))];

  const q = prefix.toLowerCase();
  const seen = new Set();
  const scored = [];

  for (const it of pool) {
    const label = it.label.toLowerCase();
    if (seen.has(it.label)) continue;
    let score;
    if (!q) score = 2;
    else if (label.startsWith(q)) score = 0;
    else if (label.includes(q)) score = 1;
    else continue;
    if (it.kind === 'local') score += 0.5;   // tên có sẵn trong code xếp sau mục từ điển
    seen.add(it.label);
    scored.push({ it, score });
  }

  scored.sort((a, b) => a.score - b.score || a.it.label.length - b.it.label.length || a.it.label.localeCompare(b.it.label));
  return scored.slice(0, 12).map((s) => s.it);
}
