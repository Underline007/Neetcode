/**
 * Từ điển cú pháp Python — phần dùng hằng ngày: nền tảng, điều khiển, cấu trúc dữ liệu.
 * Tương ứng module 1–3 của lộ trình Python.
 *
 * Quy ước viết `doc` và `ex`: xem src/hints/item.js. Mọi ví dụ `→` đều được chạy thật
 * bằng CPython trong tools/test-hints.mjs, nên đừng sửa kết quả bằng cảm giác.
 */
import { entry as e, tag } from './item.js';

/* ============================ 🐣 NỀN TẢNG ============================ */
const BASICS = tag('basics', [
  e('print', 'fn', 'print(*giá_trị, sep=" ", end="\\n")',
    'In giá trị ra màn hình. Dùng để xem biến đang mang gì khi gỡ lỗi.', {
      ex: ['print("xin chao") ≈ xin chao', 'print(1, 2, sep="-") ≈ 1-2'],
      alias: 'in ra, xuat, log',
    }),
  e('len', 'fn', 'len(x) -> int',
    'Đếm số phần tử của list, số ký tự của chuỗi, số khoá của dict. Python không có .length.', {
      ex: ['len("abc") → 3', 'len([10, 20]) → 2', 'len({"a": 1}) → 1'],
      alias: 'do dai, so phan tu, length',
    }),
  e('type', 'fn', 'type(x)',
    'Cho biết giá trị đang thuộc kiểu nào — hay dùng khi kết quả không như mong đợi.', {
      ex: ['type(3) → <class \'int\'>', 'type("a") → <class \'str\'>'],
      alias: 'kieu du lieu',
    }),
  e('isinstance', 'fn', 'isinstance(x, Kiểu)',
    'Kiểm tra một giá trị có thuộc kiểu nào đó không; nên dùng thay cho so sánh type().', {
      ex: ['isinstance(3, int) → True', 'isinstance(3, (str, float)) → False'],
      alias: 'kiem tra kieu',
    }),
  e('int', 'fn', 'int(x) | int("1010", 2)',
    'Đổi sang số nguyên. Đổi từ chuỗi thì cắt bỏ phần thập phân không được, phải là số nguyên đúng dạng.', {
      ex: ['int("42") → 42', 'int(3.9) → 3', 'int("ff", 16) → 255'],
      alias: 'ep kieu so nguyen',
    }),
  e('float', 'fn', 'float(x)',
    'Đổi sang số thực. Số thực trong máy là gần đúng nên hay lệch ở chữ số cuối.', {
      ex: ['float("2.5") → 2.5', '0.1 + 0.2 → 0.30000000000000004'],
      alias: 'so thuc',
    }),
  e('str', 'fn', 'str(x)',
    'Đổi giá trị thành chuỗi. Cần khi muốn nối số với chữ, vì Python không tự đổi giúp.', {
      ex: ['str(42) + "!" → \'42!\'', 'str([1, 2]) → \'[1, 2]\''],
      alias: 'ep kieu chuoi',
    }),
  e('bool', 'fn', 'bool(x)',
    'Đổi sang True/False. Rỗng (0, "", [], {}, None) là False, còn lại là True.', {
      ex: ['bool(0) → False', 'bool("") → False', 'bool([0]) → True'],
      alias: 'dung sai',
    }),
  e('abs', 'fn', 'abs(x)',
    'Trị tuyệt đối — bỏ dấu âm.', { ex: ['abs(-5) → 5', 'abs(2.5) → 2.5'] }),
  e('round', 'fn', 'round(x, ndigits=0)',
    'Làm tròn. Lưu ý Python làm tròn số .5 về phía số CHẴN, không phải luôn làm tròn lên.', {
      ex: ['round(2.5) → 2', 'round(3.5) → 4', 'round(3.14159, 2) → 3.14'],
      alias: 'lam tron',
    }),
  e('min', 'fn', 'min(dãy) | min(a, b) | min(dãy, key=hàm)',
    'Giá trị nhỏ nhất. Truyền key để so theo một tiêu chí khác, ví dụ độ dài chuỗi.', {
      ex: ['min([3, 1, 2]) → 1', 'min("bc", "ab") → \'ab\'', 'min(["aaa", "b"], key=len) → \'b\''],
      alias: 'nho nhat',
    }),
  e('max', 'fn', 'max(dãy) | max(a, b) | max(dãy, key=hàm)',
    'Giá trị lớn nhất, dùng key giống min. Dãy rỗng sẽ báo lỗi, trừ khi truyền default.', {
      ex: ['max([3, 1, 2]) → 3', 'max([], default=0) → 0'],
      alias: 'lon nhat',
    }),
  e('sum', 'fn', 'sum(dãy, start=0)',
    'Cộng tất cả phần tử của dãy số.', { ex: ['sum([1, 2, 3]) → 6', 'sum([1, 2], 10) → 13'], alias: 'tong' }),
  e('pow', 'fn', 'pow(a, b) | pow(a, b, mod)',
    'Luỹ thừa; thêm tham số thứ ba để lấy dư luôn (nhanh hơn tính rồi mới lấy dư).', {
      ex: ['pow(2, 10) → 1024', 'pow(2, 10, 1000) → 24'],
    }),
  e('divmod', 'fn', 'divmod(a, b) -> (thương, dư)',
    'Lấy thương và dư trong một lần gọi — dùng nhiều khi tách chữ số hoặc đổi đơn vị.', {
      ex: ['divmod(7, 2) → (3, 1)', 'divmod(125, 60) → (2, 5)'],
      alias: 'thuong va du',
    }),
  e('ord', 'fn', 'ord("a") -> 97',
    'Đổi một ký tự thành mã số của nó. Hay dùng để coi chữ cái như chỉ số 0..25.', {
      ex: ['ord("a") → 97', 'ord("A") → 65', 'ord("z") - ord("a") → 25'],
    }),
  e('chr', 'fn', 'chr(97) -> "a"',
    'Đổi mã số thành ký tự — chiều ngược của ord.', { ex: ['chr(97) → \'a\'', 'chr(ord("a") + 2) → \'c\''] }),
  e('bin', 'fn', 'bin(x) -> "0b..."',
    'Xem dạng nhị phân của một số nguyên, dưới dạng chuỗi có tiền tố 0b.', {
      ex: ['bin(10) → \'0b1010\'', 'bin(10)[2:] → \'1010\''],
      alias: 'nhi phan',
    }),
  e('hex', 'fn', 'hex(x) -> "0x..."',
    'Xem dạng thập lục phân (hệ 16) của một số nguyên.', { ex: ['hex(255) → \'0xff\''], alias: 'thap luc phan' }),
  e('input', 'fn', 'input(prompt)',
    'Đọc một dòng người dùng gõ vào, LUÔN trả về chuỗi — muốn tính toán thì phải int()/float().', {
      ex: ['input("Ten: ") ≈ chuỗi người dùng gõ'],
    }),
  e('id', 'fn', 'id(x)',
    'Số định danh của object trong bộ nhớ. Dùng để kiểm tra hai tên có trỏ cùng một object không.', {
      ex: ['a = [1]; b = a; id(a) == id(b) → True', 'id([1]) == id([1]) ≈ False'],
    }),
  e('True', 'kw', 'True',
    'Giá trị đúng. Viết hoa chữ T — true viết thường là lỗi tên biến.', {
      ex: ['True + True → 2', 'sum([True, False, True]) → 2'],
    }),
  e('False', 'kw', 'False', 'Giá trị sai. Viết hoa chữ F.', { ex: ['False or 5 → 5'] }),
  e('None', 'kw', 'None',
    'Giá trị "không có gì" duy nhất của Python (thay cho cả null và undefined của JS).', {
      ex: ['x = None; x is None → True', 'print(None) ≈ None'],
      alias: 'rong, null',
    }),
  e('and', 'kw', 'a and b',
    'Và logic. Trả về chính giá trị quyết định, không phải True/False — a sai thì trả a.', {
      ex: ['True and 5 → 5', '0 and 5 → 0'],
    }),
  e('or', 'kw', 'a or b',
    'Hoặc logic. Hay dùng để đặt giá trị mặc định: x or 0.', { ex: ['0 or 7 → 7', '"a" or "b" → \'a\''] }),
  e('not', 'kw', 'not x', 'Phủ định, đổi đúng thành sai và ngược lại.', { ex: ['not 0 → True', 'not [1] → False'] }),
  e('is', 'kw', 'a is b',
    'So sánh hai tên có trỏ cùng MỘT object không. Chỉ dùng với None, đừng dùng cho số hay chuỗi.', {
      ex: ['None is None → True', '[1] is [1] → False', '[1] == [1] → True'],
    }),
  e('is not', 'kw', 'a is not None',
    'Ngược của is. Cách viết đúng chuẩn để kiểm tra "khác None".', {
      ex: ['x = 0; x is not None → True', 'x = None; x is not None → False'],
    }),
  e('in', 'kw', 'x in dãy',
    'Có mặt trong dãy không. Với set/dict thì rất nhanh, với list thì phải quét từng phần tử.', {
      ex: ['3 in [1, 2, 3] → True', '"ab" in "cabd" → True', '"a" in {"a": 1} → True'],
      alias: 'thuoc, chua, co trong',
    }),
  e('not in', 'kw', 'x not in dãy',
    'Không có mặt trong dãy — viết gọn thay cho not (x in dãy).', { ex: ['5 not in [1, 2] → True'] }),
  e('//', 'kw', 'a // b',
    'Chia lấy phần nguyên. Với số âm thì làm tròn XUỐNG (về phía âm vô cực), khác JS.', {
      ex: ['7 // 2 → 3', '-7 // 2 → -4', '7 / 2 → 3.5'],
      alias: 'chia lay nguyen',
    }),
  e('%', 'kw', 'a % b',
    'Lấy phần dư. Dư trong Python luôn cùng dấu với số chia, nên -1 % 3 ra 2 chứ không ra -1.', {
      ex: ['7 % 2 → 1', '-1 % 3 → 2', '10 % 5 → 0'],
      alias: 'chia lay du, modulo',
    }),
  e('**', 'kw', 'a ** b',
    'Luỹ thừa. Số mũ 0.5 nghĩa là căn bậc hai.', { ex: ['2 ** 10 → 1024', '9 ** 0.5 → 3.0'], alias: 'luy thua' }),
  e('+=', 'kw', 'x += 1',
    'Cộng thêm vào chính biến đó. Python không có ++, nên tăng một đơn vị phải viết x += 1.', {
      ex: ['x = 5; x += 3; x → 8', 's = "a"; s += "b"; s → \'ab\''],
    }),
  e('_', 'kw', 'for _ in range(3)',
    'Tên biến quy ước cho giá trị không dùng tới, để người đọc biết là cố ý bỏ.', {
      ex: ['[0 for _ in range(3)] → [0, 0, 0]'],
    }),
  e('f-string', 'snip', 'f"tên: {x}" | f"{x:.2f}"',
    'Nhúng giá trị vào chuỗi. Sau dấu hai chấm là cách định dạng: số lẻ, canh lề, dấu phân cách nghìn.', {
      insert: 'f"$|"',
      ex: ['x = 7; f"co {x} qua" → \'co 7 qua\'', 'f"{3.14159:.2f}" → \'3.14\'',
        'f"{42:>5}" → \'   42\'', 'f"{1234567:,}" → \'1,234,567\''],
      alias: 'noi suy chuoi, template',
    }),
  e('#', 'kw', '# ghi chú',
    'Ghi chú một dòng — Python không có /* */ nhiều dòng, mỗi dòng phải có dấu #.', {
      ex: ['1 + 1  # cong hai so → 2'],
      alias: 'comment, ghi chu',
    }),
  e('"""', 'kw', '"""chuỗi nhiều dòng"""',
    'Chuỗi nhiều dòng. Đặt ngay đầu hàm/lớp thì thành phần mô tả (docstring) của nó.', {
      insert: '"""$|"""',
      ex: ['len("""ab""") → 2'],
      alias: 'docstring, chuoi nhieu dong',
    }),
  e('so sánh nối', 'snip', '0 <= i < n',
    'Nối nhiều phép so sánh trong một biểu thức — Python cho phép, JS thì không.', {
      insert: '0 <= $| < ',
      ex: ['i = 3; 0 <= i < 5 → True', '1 < 2 < 3 → True'],
      alias: 'so sanh kep',
    }),
]);

/* ==================== 🔁 ĐIỀU KHIỂN, HÀM & PHẠM VI ==================== */
const CONTROL = tag('control', [
  e('if', 'kw', 'if điều_kiện:',
    'Rẽ nhánh: chạy khối bên dưới khi điều kiện đúng. Dấu hai chấm và thụt lề là bắt buộc.', {
      insert: 'if $|:\n    ',
      ex: ['x = 5; "lon" if x > 3 else "nho" → \'lon\''],
    }),
  e('elif', 'kw', 'elif điều_kiện:',
    'Nhánh tiếp theo khi các nhánh trên đều sai — viết gọn của else if.', {
      insert: 'elif $|:\n    ',
      ex: ['x = 0; ("duong" if x > 0 else "khong" if x == 0 else "am") → \'khong\''],
    }),
  e('else', 'kw', 'else:',
    'Nhánh chạy khi mọi điều kiện trên đều sai. Gắn được cả vào for/while/try.', {
      insert: 'else:\n    $|',
      ex: ['[x if x else "rong" for x in [1, 0]] → [1, \'rong\']'],
    }),
  e('toán tử ba ngôi', 'snip', 'a if điều_kiện else b',
    'Chọn giá trị trong một dòng. Thứ tự ngược với JS: giá trị trước, điều kiện sau.', {
      insert: '$| if  else ',
      ex: ['n = 4; "chan" if n % 2 == 0 else "le" → \'chan\''],
      alias: 'ternary, ba ngoi',
    }),
  e('for', 'kw', 'for x in dãy:',
    'Lặp qua từng phần tử của dãy. Không có for(i=0;...) như JS — muốn chỉ số thì dùng range/enumerate.', {
      insert: 'for $| in :\n    ',
      ex: ['[x * 2 for x in [1, 2]] → [2, 4]'],
    }),
  e('while', 'kw', 'while điều_kiện:',
    'Lặp khi điều kiện còn đúng. Phải có gì đó thay đổi trong vòng lặp, nếu không sẽ lặp mãi.', {
      insert: 'while $|:\n    ',
      ex: ['n = 5; c = 0\nwhile n: n //= 2; c += 1\nc → 3'],
    }),
  e('range', 'fn', 'range(stop) | range(start, stop, step)',
    'Dãy số dừng TRƯỚC stop. Không phải list — muốn thấy các số thì bọc list().', {
      ex: ['list(range(3)) → [0, 1, 2]', 'list(range(1, 6, 2)) → [1, 3, 5]',
        'list(range(3, 0, -1)) → [3, 2, 1]'],
      alias: 'day so, vong lap chi so',
    }),
  e('enumerate', 'fn', 'enumerate(dãy, start=0)',
    'Lặp mà lấy được cả chỉ số lẫn giá trị, khỏi phải tự đếm bằng biến riêng.', {
      ex: ['list(enumerate("ab")) → [(0, \'a\'), (1, \'b\')]',
        'list(enumerate(["a"], start=1)) → [(1, \'a\')]'],
      alias: 'chi so va gia tri',
    }),
  e('zip', 'fn', 'zip(a, b, ...)',
    'Ghép các dãy theo từng cặp cùng vị trí, dừng ở dãy ngắn nhất.', {
      ex: ['list(zip([1, 2], "ab")) → [(1, \'a\'), (2, \'b\')]',
        'list(zip([1, 2, 3], [9])) → [(1, 9)]'],
      alias: 'ghep cap, di song song',
    }),
  e('break', 'kw', 'break',
    'Thoát ngay khỏi vòng lặp gần nhất, không chạy các lượt còn lại.', {
      ex: ['r = 0\nfor x in [1, 2, 3]:\n    if x == 2: break\n    r = x\nr → 1'],
    }),
  e('continue', 'kw', 'continue',
    'Bỏ qua phần còn lại của lượt này và sang lượt kế tiếp.', {
      ex: ['r = []\nfor x in range(4):\n    if x % 2: continue\n    r.append(x)\nr → [0, 2]'],
    }),
  e('pass', 'kw', 'pass',
    'Không làm gì cả. Dùng để giữ chỗ cho khối chưa viết, vì Python không cho khối rỗng.', {
      ex: ['def f(): pass\nf() → None'],
    }),
  e('def', 'kw', 'def tên(tham_số):',
    'Định nghĩa hàm. Hàm không có return thì trả về None.', {
      insert: 'def $|():\n    ',
      ex: ['def cong(a, b): return a + b\ncong(2, 3) → 5'],
      alias: 'ham, function',
    }),
  e('return', 'kw', 'return giá_trị',
    'Trả kết quả về cho nơi gọi và kết thúc hàm ngay tại đó.', {
      insert: 'return $|',
      ex: ['def f():\n    return 1\n    return 2\nf() → 1'],
    }),
  e('tham số mặc định', 'snip', 'def f(a, b=10):',
    'Cho tham số một giá trị sẵn để gọi hàm mà không cần truyền. Đừng đặt mặc định là [] hay {}.', {
      insert: 'def $|(a, b=):\n    ',
      ex: ['def f(a, b=10): return a + b\nf(1) → 11'],
    }),
  e('gọi theo tên', 'snip', 'f(b=2, a=1)',
    'Truyền tham số kèm tên nên không cần đúng thứ tự, và người đọc hiểu ngay ý nghĩa.', {
      insert: '$|=',
      ex: ['def f(a, b): return a - b\nf(b=1, a=5) → 4'],
      alias: 'keyword argument',
    }),
  e('*args', 'kw', 'def f(*args):',
    'Gom mọi tham số vị trí còn lại thành một tuple, nhờ vậy hàm nhận số tham số tuỳ ý.', {
      insert: '*args',
      ex: ['def tong(*args): return sum(args)\ntong(1, 2, 3) → 6'],
      alias: 'nhieu tham so',
    }),
  e('**kwargs', 'kw', 'def f(**kwargs):',
    'Gom mọi tham số truyền kèm tên thành một dict.', {
      insert: '**kwargs',
      ex: ['def f(**kw): return kw\nf(a=1, b=2) → {\'a\': 1, \'b\': 2}'],
    }),
  e('trải tham số', 'snip', 'f(*danh_sách) | f(**dict)',
    'Bung một list/dict thành các tham số riêng lẻ khi gọi hàm.', {
      insert: '*$|',
      ex: ['def f(a, b): return a + b\nf(*[1, 2]) → 3', 'max(*[3, 7]) → 7'],
      alias: 'unpack, spread',
    }),
  e('lambda', 'kw', 'lambda x: biểu_thức',
    'Hàm ngắn không tên, chỉ chứa MỘT biểu thức. Hay dùng làm tham số key khi sắp xếp.', {
      insert: 'lambda $|: ',
      ex: ['(lambda x: x * 2)(5) → 10', 'sorted([(2, "a"), (1, "b")], key=lambda t: t[0]) → [(1, \'b\'), (2, \'a\')]'],
      alias: 'ham vo danh, arrow function',
    }),
  e(':=', 'kw', 'if (n := len(x)) > 3:',
    'Gán và dùng luôn giá trị trong cùng một biểu thức (toán tử "hải mã").', {
      ex: ['x = [1, 2, 3, 4]\n(n := len(x)) > 3 → True'],
      alias: 'walrus, hai ma',
    }),
  e('global', 'kw', 'global x',
    'Cho phép GÁN lại biến ở ngoài hàm. Chỉ đọc thì không cần khai báo gì.', {
      ex: ['x = 1\ndef f():\n    global x\n    x = 9\nf(); x → 9'],
      alias: 'bien toan cuc',
    }),
  e('nonlocal', 'kw', 'nonlocal x',
    'Cho phép gán lại biến của hàm bao ngoài — cần khi dùng hàm lồng hoặc đệ quy có biến đếm.', {
      ex: ['def ngoai():\n    n = 0\n    def trong():\n        nonlocal n\n        n += 1\n    trong(); return n\nngoai() → 1'],
    }),
  e('hàm lồng', 'snip', 'def ngoai():\\n    def trong(): ...',
    'Định nghĩa hàm bên trong hàm. Hàm trong đọc được biến của hàm ngoài — rất tiện cho DFS.', {
      insert: 'def $|():\n        ',
      ex: ['def ngoai(n):\n    def trong(): return n * 2\n    return trong()\nngoai(4) → 8'],
      alias: 'closure, ham trong ham',
    }),
  e('đệ quy', 'snip', 'def f(n): return f(n - 1)',
    'Hàm tự gọi lại chính nó. Luôn phải có trường hợp dừng, nếu không sẽ tràn ngăn xếp.', {
      insert: 'def $|(n):\n    if n <= 1:\n        return 1\n    return ',
      ex: ['def gt(n): return 1 if n <= 1 else n * gt(n - 1)\ngt(5) → 120'],
      alias: 'recursion, de quy',
    }),
]);

/* ================ 🧺 CẤU TRÚC DỮ LIỆU & COMPREHENSION ================ */
const DATA = tag('data', [
  e('list', 'fn', 'list() | list(dãy) | [1, 2, 3]',
    'Danh sách có thứ tự, sửa được. Tương đương Array của JS.', {
      ex: ['list("ab") → [\'a\', \'b\']', 'list(range(3)) → [0, 1, 2]'],
      alias: 'mang, array, danh sach',
    }),
  e('tuple', 'fn', 'tuple(dãy) | (1, 2)',
    'Bộ giá trị KHÔNG sửa được. Vì bất biến nên dùng làm khoá của dict/phần tử của set được.', {
      ex: ['tuple([1, 2]) → (1, 2)', '{(1, 2): "a"}[(1, 2)] → \'a\''],
      alias: 'bo gia tri, bat bien',
    }),
  e('dict', 'fn', 'dict() | {"a": 1}',
    'Bảng khoá → giá trị, tra cứu rất nhanh. Tương đương Map/Object của JS.', {
      ex: ['dict(a=1) → {\'a\': 1}', 'dict([("a", 1)]) → {\'a\': 1}'],
      alias: 'tu dien, bang bam, map, object',
    }),
  e('set', 'fn', 'set() | {1, 2}',
    'Tập hợp không trùng lặp, kiểm tra "đã có chưa" rất nhanh. Không có thứ tự.', {
      ex: ['set([1, 2, 2]) → {1, 2}', 'len(set("aab")) → 2'],
      alias: 'tap hop, khu trung',
    }),
  e('frozenset', 'fn', 'frozenset(dãy)',
    'Set không sửa được — dùng khi cần một tập hợp làm khoá của dict.', {
      ex: ['frozenset([1, 2]) == frozenset([2, 1]) → True'],
    }),
  e('sorted', 'fn', 'sorted(dãy, key=None, reverse=False)',
    'Trả về một LIST MỚI đã sắp xếp, không đụng vào dãy gốc.', {
      ex: ['sorted([3, 1, 2]) → [1, 2, 3]', 'sorted("cab") → [\'a\', \'b\', \'c\']',
        'sorted([3, 1], reverse=True) → [3, 1]', 'sorted(["aaa", "b"], key=len) → [\'b\', \'aaa\']'],
      alias: 'sap xep',
    }),
  e('reversed', 'fn', 'reversed(dãy)',
    'Duyệt từ cuối về đầu mà không tạo bản sao. Muốn ra list thì bọc list().', {
      ex: ['list(reversed([1, 2, 3])) → [3, 2, 1]', '"".join(reversed("abc")) → \'cba\''],
      alias: 'dao nguoc',
    }),
  e('any', 'fn', 'any(dãy) -> bool',
    'Có ít nhất một phần tử đúng? Dãy rỗng cho False.', {
      ex: ['any([0, 3]) → True', 'any([]) → False', 'any(x > 2 for x in [1, 5]) → True'],
      alias: 'ton tai, co phan tu nao',
    }),
  e('all', 'fn', 'all(dãy) -> bool',
    'Mọi phần tử đều đúng? Dãy rỗng cho True (không có phản ví dụ nào).', {
      ex: ['all([1, 2]) → True', 'all([1, 0]) → False', 'all([]) → True'],
      alias: 'moi phan tu, tat ca',
    }),
  e('map', 'fn', 'map(hàm, dãy)',
    'Áp dụng một hàm lên từng phần tử. Kết quả chỉ tính khi được duyệt, nên thường bọc list().', {
      ex: ['list(map(str, [1, 2])) → [\'1\', \'2\']', 'list(map(len, ["ab", "c"])) → [2, 1]'],
      alias: 'bien doi tung phan tu',
    }),
  e('filter', 'fn', 'filter(hàm, dãy)',
    'Giữ lại các phần tử làm hàm trả về True.', {
      ex: ['list(filter(None, [0, 1, 2])) → [1, 2]', 'list(filter(lambda x: x > 1, [1, 2, 3])) → [2, 3]'],
      alias: 'loc',
    }),
  e('list comprehension', 'snip', '[biểu_thức for x in dãy if điều_kiện]',
    'Tạo list mới từ một dãy trong một dòng — cách viết Python thay cho map/filter.', {
      insert: '[$| for x in ]',
      ex: ['[x * x for x in range(4)] → [0, 1, 4, 9]', '[x for x in range(6) if x % 2 == 0] → [0, 2, 4]'],
      alias: 'comprehension, tao list nhanh',
    }),
  e('dict comprehension', 'snip', '{k: v for k, v in dãy}',
    'Tạo dict trong một dòng — hay dùng để đảo khoá/giá trị hoặc lập bảng tra.', {
      insert: '{$|: v for k, v in }',
      ex: ['{x: x * x for x in range(3)} → {0: 0, 1: 1, 2: 4}',
        '{v: k for k, v in {"a": 1}.items()} → {1: \'a\'}'],
    }),
  e('set comprehension', 'snip', '{f(x) for x in dãy}',
    'Tạo set trong một dòng, tự khử trùng lặp luôn.', {
      insert: '{$| for x in }',
      ex: ['{x % 3 for x in range(6)} → {0, 1, 2}'],
    }),
  e('cắt lát', 'snip', 'arr[start:stop:step]',
    'Lấy một đoạn: từ start, dừng TRƯỚC stop. Bỏ trống nghĩa là từ đầu / tới cuối.', {
      insert: '[$|:]',
      ex: ['[0, 1, 2, 3][1:3] → [1, 2]', '"abcd"[::-1] → \'dcba\'', '[1, 2, 3][:-1] → [1, 2]'],
      alias: 'slice, lay doan, dao chuoi',
    }),
  e('gán đồng thời', 'snip', 'a, b = b, a',
    'Gán nhiều biến một lúc; đổi chỗ hai biến không cần biến tạm.', {
      insert: 'a, b = b, a',
      ex: ['a, b = 1, 2\na, b = b, a\n(a, b) → (2, 1)'],
      alias: 'swap, hoan doi',
    }),
  e('mở gói', 'snip', 'đầu, *giữa, cuối = arr',
    'Tách các phần tử vào từng biến; dấu * hứng phần còn lại thành list.', {
      insert: '$|, *rest = ',
      ex: ['a, *b = [1, 2, 3]\n(a, b) → (1, [2, 3])'],
      alias: 'unpack, tach phan tu',
    }),
  e('mảng 2 chiều', 'snip', 'dp = [[0] * m for _ in range(n)]',
    'Tạo bảng n hàng m cột. ĐỪNG viết [[0]*m]*n vì n hàng đó là cùng một list, sửa một hàng là đổi hết.', {
      insert: 'dp = [[0] * $| for _ in range()]',
      ex: ['dp = [[0] * 2 for _ in range(2)]\ndp[0][0] = 1\ndp → [[1, 0], [0, 0]]'],
      alias: 'ma tran, bang 2 chieu, grid',
    }),
  e('nhân list', 'snip', '[0] * n',
    'Tạo nhanh list n phần tử giống nhau. Chỉ an toàn với số/chuỗi, không dùng với list lồng.', {
      insert: '[0] * $|',
      ex: ['[0] * 4 → [0, 0, 0, 0]', '["-"] * 2 → [\'-\', \'-\']'],
    }),

  /* ---------- collections ---------- */
  e('Counter', 'mod', 'Counter(dãy) -> {phần_tử: số_lần}',
    'Đếm số lần xuất hiện của từng phần tử trong một dòng.', {
      setup: 'from collections import Counter',
      ex: ['Counter("aab") → Counter({\'a\': 2, \'b\': 1})', 'Counter([1, 1, 2])[1] → 2',
        'Counter("aab").most_common(1) → [(\'a\', 2)]'],
      alias: 'dem tan suat, dem so lan',
    }),
  e('defaultdict', 'mod', 'defaultdict(int) | defaultdict(list)',
    'Dict tự tạo giá trị mặc định cho khoá chưa có, nên không còn lỗi KeyError.', {
      setup: 'from collections import defaultdict',
      ex: ['d = defaultdict(int); d["x"] += 1; d["x"] → 1',
        'g = defaultdict(list); g["a"].append(1); g["a"] → [1]'],
      alias: 'dict mac dinh, gom nhom',
    }),
  e('namedtuple', 'mod', 'namedtuple("Tên", ["a", "b"])',
    'Tuple mà các ô có tên, đọc dễ hơn t[0], t[1] mà vẫn nhẹ và bất biến.', {
      setup: 'from collections import namedtuple',
      ex: ['P = namedtuple("P", ["x", "y"]); p = P(1, 2); p.x → 1', 'P = namedtuple("P", "x y"); tuple(P(1, 2)) → (1, 2)'],
    }),
]);

export default [...BASICS, ...CONTROL, ...DATA];
