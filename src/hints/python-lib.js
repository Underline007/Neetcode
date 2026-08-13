/**
 * Từ điển cú pháp Python — phần thư viện & tình huống thật: chuỗi/regex, ngoại lệ,
 * file & JSON/CSV, module/package, context manager, thư viện chuẩn, testing, hiệu năng,
 * và các phương thức gọi sau dấu chấm. Tương ứng module 6–10, 12, 13, 15 + lộ trình thuật toán.
 */
import { entry as e, tag } from './item.js';

/* ==================== PHƯƠNG THỨC CỦA LIST / DICT / SET ==================== */
const DATA_METHODS = tag('data', [
  /* list */
  e('append', 'm', 'list.append(x)',
    'Thêm MỘT phần tử vào cuối list. Nhanh, không phụ thuộc list dài bao nhiêu.', {
      ex: ['a = [1]; a.append(2); a → [1, 2]', 'a = []; a.append([1, 2]); a → [[1, 2]]'],
      alias: 'them vao cuoi, push',
    }),
  e('extend', 'm', 'list.extend(dãy)',
    'Nối thêm NHIỀU phần tử từ một dãy khác vào cuối list.', {
      ex: ['a = [1]; a.extend([2, 3]); a → [1, 2, 3]', 'a = [1]; a.extend("ab"); a → [1, \'a\', \'b\']'],
      alias: 'noi list, them nhieu',
    }),
  e('insert', 'm', 'list.insert(i, x)',
    'Chèn vào giữa, trước vị trí i. Phải dịch các phần tử sau nên chậm hơn append.', {
      ex: ['a = [1, 3]; a.insert(1, 2); a → [1, 2, 3]', 'a = [2]; a.insert(0, 1); a → [1, 2]'],
      alias: 'chen vao giua',
    }),
  e('pop', 'm', 'list.pop(i=-1) | dict.pop(key, mặc_định)',
    'Lấy ra rồi xoá. pop() lấy cuối (nhanh), pop(0) lấy đầu (phải dồn cả list nên chậm).', {
      ex: ['a = [1, 2]; a.pop() → 2', 'a = [1, 2]; a.pop(0); a → [2]', 'd = {"a": 1}; d.pop("b", 0) → 0'],
      alias: 'lay ra va xoa',
    }),
  e('remove', 'm', 'list.remove(x)',
    'Xoá theo GIÁ TRỊ, chỉ lần xuất hiện đầu tiên. Không có giá trị đó thì báo lỗi ValueError.', {
      ex: ['a = [1, 2, 1]; a.remove(1); a → [2, 1]'],
      alias: 'xoa theo gia tri',
    }),
  e('index', 'm', 'list.index(x) | str.index(sub)',
    'Vị trí xuất hiện đầu tiên. Không tìm thấy thì báo lỗi — muốn khỏi lỗi thì dùng find với chuỗi.', {
      ex: ['[10, 20].index(20) → 1', '"abc".index("b") → 1'],
      alias: 'tim vi tri',
    }),
  e('count', 'm', 'list.count(x) | str.count(sub)',
    'Đếm số lần xuất hiện của một giá trị hoặc chuỗi con.', {
      ex: ['[1, 1, 2].count(1) → 2', '"aab".count("a") → 2'],
      alias: 'dem so lan',
    }),
  e('sort', 'm', 'list.sort(key=None, reverse=False)',
    'Sắp xếp NGAY TRÊN list gốc và trả về None. Cần list mới thì dùng sorted().', {
      ex: ['a = [3, 1]; a.sort(); a → [1, 3]', '[3, 1].sort() → None',
        'a = [("b", 2), ("a", 9)]; a.sort(key=lambda t: t[0]); a[0] → (\'a\', 9)'],
      alias: 'sap xep tai cho',
    }),
  e('reverse', 'm', 'list.reverse()',
    'Đảo ngược ngay trên list gốc, trả về None.', { ex: ['a = [1, 2]; a.reverse(); a → [2, 1]'] }),
  e('copy', 'm', 'list.copy() | dict.copy()',
    'Bản sao MỘT TẦNG: sửa bản sao không ảnh hưởng gốc, nhưng các list bên trong vẫn dùng chung.', {
      ex: ['a = [1]; b = a.copy(); b.append(2); a → [1]',
        'a = [[1]]; b = a.copy(); b[0].append(2); a → [[1, 2]]'],
      alias: 'sao chep',
    }),
  e('clear', 'm', 'list.clear() | dict.clear()',
    'Xoá sạch nội dung nhưng giữ nguyên object đó (mọi tên đang trỏ vào đều thấy rỗng).', {
      ex: ['a = [1, 2]; a.clear(); a → []'],
    }),
  /* dict */
  e('get', 'm', 'dict.get(key, mặc_định=None)',
    'Lấy giá trị theo khoá; khoá chưa có thì trả mặc định thay vì báo lỗi KeyError.', {
      ex: ['{"a": 1}.get("a") → 1', '{}.get("x") → None', '{}.get("x", 0) → 0'],
      alias: 'lay gia tri an toan',
    }),
  e('keys', 'm', 'dict.keys()',
    'Danh sách các khoá. Là "khung nhìn" nên tự cập nhật khi dict đổi.', {
      ex: ['list({"a": 1, "b": 2}.keys()) → [\'a\', \'b\']'],
    }),
  e('values', 'm', 'dict.values()',
    'Danh sách các giá trị, dùng để cộng/tìm max mà không cần khoá.', {
      ex: ['sum({"a": 1, "b": 2}.values()) → 3'],
    }),
  e('items', 'm', 'dict.items() -> (khoá, giá_trị)',
    'Duyệt cả khoá và giá trị cùng lúc — cách chuẩn để đi qua một dict.', {
      ex: ['list({"a": 1}.items()) → [(\'a\', 1)]',
        'max({"a": 1, "b": 5}.items(), key=lambda t: t[1])[0] → \'b\''],
      alias: 'duyet dict',
    }),
  e('setdefault', 'm', 'dict.setdefault(key, mặc_định)',
    'Chưa có khoá thì đặt giá trị mặc định rồi trả về; đã có thì trả giá trị cũ. Hay dùng để gom nhóm.', {
      ex: ['d = {}; d.setdefault("a", []).append(1); d → {\'a\': [1]}', 'd = {"a": 1}; d.setdefault("a", 9) → 1'],
    }),
  e('update', 'm', 'dict.update(dict_khác) | set.update(dãy)',
    'Gộp thêm dữ liệu vào; khoá trùng thì giá trị mới ghi đè giá trị cũ.', {
      ex: ['d = {"a": 1}; d.update({"b": 2}); d → {\'a\': 1, \'b\': 2}', 'd = {"a": 1}; d.update(a=9); d → {\'a\': 9}'],
    }),
  e('fromkeys', 'm', 'dict.fromkeys(dãy_khoá, giá_trị)',
    'Tạo dict từ danh sách khoá với cùng một giá trị ban đầu.', {
      ex: ['dict.fromkeys("ab", 0) → {\'a\': 0, \'b\': 0}'],
    }),
  e('popitem', 'm', 'dict.popitem()',
    'Lấy ra và xoá cặp CUỐI CÙNG được thêm vào — dùng khi cần dùng dict như một ngăn xếp.', {
      ex: ['d = {"a": 1, "b": 2}; d.popitem() → (\'b\', 2)'],
    }),
  e('most_common', 'm', 'Counter.most_common(n=None)',
    'n phần tử xuất hiện nhiều nhất, đã xếp từ nhiều đến ít.', {
      setup: 'from collections import Counter',
      ex: ['Counter("aabbbc").most_common(2) → [(\'b\', 3), (\'a\', 2)]'],
      alias: 'top k tan suat',
    }),
  /* set */
  e('add', 'm', 'set.add(x)',
    'Thêm một phần tử vào set; đã có rồi thì không đổi gì.', {
      ex: ['s = {1}; s.add(2); s → {1, 2}', 's = {1}; s.add(1); len(s) → 1'],
    }),
  e('discard', 'm', 'set.discard(x)',
    'Xoá khỏi set; không có phần tử đó cũng không báo lỗi (khác remove).', {
      ex: ['s = {1}; s.discard(9); s → {1}'],
    }),
  e('union', 'm', 'set.union(b) | a | b',
    'Hợp hai tập: mọi phần tử có ở một trong hai bên.', { ex: ['{1, 2} | {2, 3} → {1, 2, 3}'] }),
  e('intersection', 'm', 'set.intersection(b) | a & b',
    'Giao hai tập: chỉ những phần tử có ở CẢ HAI bên.', { ex: ['{1, 2} & {2, 3} → {2}'] }),
  e('difference', 'm', 'set.difference(b) | a - b',
    'Hiệu hai tập: có ở bên trái mà không có ở bên phải.', { ex: ['{1, 2} - {2} → {1}'] }),
  e('symmetric_difference', 'm', 'a ^ b',
    'Những phần tử chỉ thuộc một trong hai tập, bỏ phần chung.', { ex: ['{1, 2} ^ {2, 3} → {1, 3}'] }),
  e('issubset', 'm', 'a.issubset(b) | a <= b',
    'Mọi phần tử của a đều có trong b?', { ex: ['{1}.issubset({1, 2}) → True'] }),
]);

/* ==================== 🔤 CHUỖI & REGEX ==================== */
const STRINGS = tag('strings', [
  e('split', 'm', 'str.split(sep=None, maxsplit=-1)',
    'Cắt chuỗi thành list theo dấu phân cách. Không truyền gì thì cắt theo mọi khoảng trắng.', {
      ex: ['"a,b".split(",") → [\'a\', \'b\']', '" a  b ".split() → [\'a\', \'b\']',
        '"a=b=c".split("=", 1) → [\'a\', \'b=c\']'],
      alias: 'cat chuoi, tach chuoi',
    }),
  e('join', 'm', '"dấu".join(dãy_chuỗi)',
    'Nối một dãy chuỗi lại, chèn dấu ở giữa. Nối chuỗi trong vòng lặp nên dùng cách này vì nhanh hơn +=.', {
      ex: ['"-".join(["a", "b"]) → \'a-b\'', '"".join(["a", "b"]) → \'ab\'',
        '",".join(str(x) for x in [1, 2]) → \'1,2\''],
      alias: 'noi chuoi',
    }),
  e('strip', 'm', 'str.strip(ký_tự=None)',
    'Cắt bỏ khoảng trắng (hoặc các ký tự chỉ định) ở HAI ĐẦU chuỗi.', {
      ex: ['"  a \\n".strip() → \'a\'', '"xxaxx".strip("x") → \'a\'', '"a,b,".rstrip(",") → \'a,b\''],
      alias: 'cat khoang trang, trim',
    }),
  e('replace', 'm', 'str.replace(cũ, mới, count=-1)',
    'Thay mọi chỗ xuất hiện của chuỗi con. Chuỗi là bất biến nên hàm trả về chuỗi MỚI.', {
      ex: ['"a-b-c".replace("-", "+") → \'a+b+c\'', '"aaa".replace("a", "b", 2) → \'bba\''],
      alias: 'thay the',
    }),
  e('startswith', 'm', 'str.startswith(tiền_tố)',
    'Chuỗi có bắt đầu bằng đoạn đó không; truyền tuple để kiểm tra nhiều khả năng.', {
      ex: ['"hello".startswith("he") → True', '"a.py".endswith((".py", ".txt")) → True'],
    }),
  e('endswith', 'm', 'str.endswith(hậu_tố)',
    'Chuỗi có kết thúc bằng đoạn đó không — hay dùng để lọc theo đuôi tên tệp.', {
      ex: ['"a.txt".endswith(".txt") → True'],
    }),
  e('find', 'm', 'str.find(sub) -> -1 nếu không có',
    'Vị trí chuỗi con; không tìm thấy thì trả -1 chứ không báo lỗi như index.', {
      ex: ['"abc".find("c") → 2', '"abc".find("z") → -1'],
      alias: 'tim chuoi con',
    }),
  e('lower', 'm', 'str.lower()',
    'Đổi hết sang chữ thường — dùng để so sánh không phân biệt hoa thường.', {
      ex: ['"AbC".lower() → \'abc\'', '"Abc".lower() == "abc" → True'],
    }),
  e('upper', 'm', 'str.upper()',
    'Đổi hết sang chữ in hoa. Chuỗi gốc không đổi, hàm trả về chuỗi mới.', {
      ex: ['"abc".upper() → \'ABC\'', 's = "a"; s.upper(); s → \'a\''],
    }),
  e('title', 'm', 'str.title()',
    'Viết hoa chữ đầu của mỗi từ — tiện để chuẩn hoá tên riêng.', {
      ex: ['"nguyen van a".title() → \'Nguyen Van A\''],
    }),
  e('capitalize', 'm', 'str.capitalize()',
    'Viết hoa chữ đầu câu và viết thường tất cả phần còn lại.', { ex: ['"xIN chao".capitalize() → \'Xin chao\''] }),
  e('zfill', 'm', 'str.zfill(độ_dài)',
    'Thêm số 0 vào trước cho đủ độ dài — dùng khi in mã số, giờ phút.', {
      ex: ['"7".zfill(3) → \'007\'', 'str(5).zfill(2) → \'05\''],
      alias: 'them so 0, dem 0',
    }),
  e('ljust', 'm', 'str.ljust(rộng, ký_tự=" ")',
    'Kéo dài chuỗi về bên phải cho đủ độ rộng — dùng để in bảng thẳng cột.', {
      ex: ['"ab".ljust(5, ".") → \'ab...\'', 'len("ab".ljust(5)) → 5'],
      alias: 'canh le trai',
    }),
  e('rjust', 'm', 'str.rjust(rộng, ký_tự=" ")',
    'Đẩy chuỗi sang phải cho đủ độ rộng, thường dùng cho cột số.', { ex: ['"7".rjust(3, "0") → \'007\''] }),
  e('center', 'm', 'str.center(rộng, ký_tự=" ")',
    'Đặt chuỗi vào giữa, hai bên chèn ký tự bù.', { ex: ['"ab".center(6, "*") → \'**ab**\''] }),
  e('splitlines', 'm', 'str.splitlines()',
    'Cắt chuỗi thành list theo từng dòng, tự hiểu cả \\n lẫn \\r\\n.', {
      ex: ['"a\\nb".splitlines() → [\'a\', \'b\']', 'len("a\\nb\\n".splitlines()) → 2'],
      alias: 'tach dong',
    }),
  e('removeprefix', 'm', 'str.removeprefix(tiền_tố)',
    'Bỏ đúng đoạn đầu nếu có (Python 3.9+). An toàn hơn cắt lát vì không cần đếm ký tự.', {
      ex: ['"test_a".removeprefix("test_") → \'a\'', '"a".removeprefix("x") → \'a\''],
    }),
  e('removesuffix', 'm', 'str.removesuffix(hậu_tố)',
    'Bỏ đúng đoạn cuối nếu có — hay dùng để cắt phần mở rộng tên tệp.', {
      ex: ['"a.py".removesuffix(".py") → \'a\''],
    }),
  e('format', 'm', '"{} và {:.1f}".format(a, b)',
    'Điền giá trị vào các chỗ {} của chuỗi. Cách cũ hơn f-string, vẫn gặp nhiều trong code sẵn có.', {
      ex: ['"{} tuoi".format(20) → \'20 tuoi\'', '"{:.1f}".format(3.14159) → \'3.1\'',
        '"{1}{0}".format("a", "b") → \'ba\''],
      alias: 'dinh dang chuoi',
    }),
  e('partition', 'm', 'str.partition(sep) -> (trước, sep, sau)',
    'Cắt tại lần xuất hiện ĐẦU TIÊN và giữ lại cả dấu phân cách. Luôn trả về 3 phần.', {
      ex: ['"a=b=c".partition("=") → (\'a\', \'=\', \'b=c\')', '"abc".partition("=") → (\'abc\', \'\', \'\')'],
    }),
  e('isdigit', 'm', 'str.isdigit()',
    'Chuỗi có toàn chữ số không — kiểm tra trước khi int() để tránh lỗi.', {
      ex: ['"123".isdigit() → True', '"12a".isdigit() → False', '"".isdigit() → False'],
    }),
  e('isalpha', 'm', 'str.isalpha()',
    'Chuỗi có toàn chữ cái không (không có số, không khoảng trắng).', {
      ex: ['"abc".isalpha() → True', '"a1".isalpha() → False'],
    }),
  e('isalnum', 'm', 'str.isalnum()',
    'Chuỗi có toàn chữ cái hoặc chữ số không — dùng nhiều ở bài lọc ký tự.', {
      ex: ['"a1".isalnum() → True', '"a!".isalnum() → False'],
    }),
  e('isspace', 'm', 'str.isspace()',
    'Chuỗi có toàn khoảng trắng/tab/xuống dòng không.', { ex: ['" \\t".isspace() → True', '"".isspace() → False'] }),
  e('isupper', 'm', 'str.isupper()',
    'Các chữ cái trong chuỗi có đều là chữ in hoa không.', { ex: ['"AB".isupper() → True', '"Ab".isupper() → False'] }),
  e('encode', 'm', 'str.encode("utf-8")',
    'Đổi chuỗi thành bytes để ghi ra tệp hoặc gửi qua mạng.', {
      ex: ['"a".encode() → b\'a\'', 'len("é".encode("utf-8")) → 2'],
    }),

  /* ---------- regex ---------- */
  e('re.search', 'mod', 're.search(mẫu, chuỗi)',
    'Tìm mẫu ở BẤT KỲ đâu trong chuỗi, trả về đối tượng khớp đầu tiên hoặc None.', {
      setup: 'import re',
      ex: ['bool(re.search(r"\\d+", "ab12")) → True', 're.search(r"\\d+", "ab12").group() → \'12\'',
        're.search(r"z", "ab") → None'],
      alias: 'tim theo mau, regex tim',
    }),
  e('re.match', 'mod', 're.match(mẫu, chuỗi)',
    'Chỉ khớp ở ĐẦU chuỗi. Muốn tìm ở giữa thì dùng search.', {
      setup: 'import re',
      ex: ['bool(re.match(r"\\d", "1a")) → True', 're.match(r"\\d", "a1") → None'],
    }),
  e('re.fullmatch', 'mod', 're.fullmatch(mẫu, chuỗi)',
    'Cả chuỗi phải khớp trọn vẹn — dùng để kiểm tra định dạng (email, mã số).', {
      setup: 'import re',
      ex: ['bool(re.fullmatch(r"\\d{3}", "123")) → True', 're.fullmatch(r"\\d{3}", "1234") → None'],
    }),
  e('re.findall', 'mod', 're.findall(mẫu, chuỗi)',
    'Lấy MỌI đoạn khớp thành một list chuỗi. Có nhóm () thì trả về list các nhóm.', {
      setup: 'import re',
      ex: ['re.findall(r"\\d+", "a1b22") → [\'1\', \'22\']',
        're.findall(r"(\\w)=(\\d)", "a=1 b=2") → [(\'a\', \'1\'), (\'b\', \'2\')]'],
      alias: 'tim tat ca, regex findall',
    }),
  e('re.sub', 'mod', 're.sub(mẫu, thay_bằng, chuỗi)',
    'Thay mọi đoạn khớp bằng chuỗi khác. Dùng \\1 để chèn lại nhóm đã bắt.', {
      setup: 'import re',
      ex: ['re.sub(r"\\d", "#", "a1b2") → \'a#b#\'', 're.sub(r"\\s+", " ", "a   b") → \'a b\''],
      alias: 'thay the theo mau',
    }),
  e('re.split', 'mod', 're.split(mẫu, chuỗi)',
    'Cắt chuỗi theo một mẫu, mạnh hơn str.split vì cắt được theo nhiều loại dấu.', {
      setup: 'import re',
      ex: ['re.split(r"[,;]", "a,b;c") → [\'a\', \'b\', \'c\']'],
    }),
  e('re.compile', 'mod', 'mẫu = re.compile(r"...")',
    'Dịch sẵn mẫu một lần rồi dùng nhiều lần — gọn hơn và nhanh hơn khi lặp lại.', {
      setup: 'import re',
      ex: ['p = re.compile(r"\\d+"); p.findall("a1b2") → [\'1\', \'2\']'],
    }),
  e('group', 'm', 'khớp.group(n=0)',
    'Lấy đoạn khớp: group() là cả đoạn, group(1) là nhóm ngoặc thứ nhất.', {
      setup: 'import re',
      ex: ['re.search(r"(\\w)-(\\d)", "a-1").group(1) → \'a\'',
        're.search(r"(\\w)-(\\d)", "a-1").groups() → (\'a\', \'1\')'],
    }),
  e('nhóm có tên', 'snip', 'r"(?P<ten>\\w+)"',
    'Đặt tên cho nhóm để lấy theo tên thay vì đếm số thứ tự — đọc lại code dễ hơn nhiều.', {
      setup: 'import re',
      insert: '(?P<$|>)',
      ex: ['re.search(r"(?P<so>\\d+)", "a12").group("so") → \'12\'',
        're.search(r"(?P<a>\\w)", "x").groupdict() → {\'a\': \'x\'}'],
    }),
  e('mẫu regex', 'snip', '\\d \\w \\s . + * ? [] ^ $',
    'Các mảnh ghép hay dùng: \\d là chữ số, \\w là chữ/số/gạch dưới, \\s là khoảng trắng, + là một hoặc nhiều.', {
      setup: 'import re',
      insert: 'r"$|"',
      ex: ['re.findall(r"\\w+@\\w+", "a@b c") → [\'a@b\']', 're.findall(r"^a\\d?", "a1 a2") → [\'a1\']'],
      alias: 'ky hieu regex, bang regex',
    }),
]);

/* ==================== 🚨 NGOẠI LỆ & GỠ LỖI ==================== */
const ERRORS = tag('errors', [
  e('try', 'kw', 'try: ... except Lỗi: ...',
    'Chạy đoạn code có thể lỗi, và tự xử lý khi lỗi xảy ra thay vì để chương trình dừng.', {
      insert: 'try:\n    $|\nexcept Exception as e:\n    ',
      ex: ['try:\n    r = 1 / 0\nexcept ZeroDivisionError:\n    r = "loi"\nr → \'loi\''],
      alias: 'bat loi',
    }),
  e('except', 'kw', 'except ValueError as e:',
    'Nhánh xử lý một loại lỗi cụ thể. Nên bắt đúng loại, đừng bắt tất cả rồi bỏ qua.', {
      insert: 'except $| as e:\n    ',
      ex: ['try:\n    int("x")\nexcept ValueError as e:\n    r = type(e).__name__\nr → \'ValueError\''],
    }),
  e('finally', 'kw', 'finally:',
    'Luôn chạy dù có lỗi hay không — chỗ để dọn dẹp (đóng tệp, nhả khoá).', {
      insert: 'finally:\n    $|',
      ex: ['r = []\ntry:\n    r.append(1)\nfinally:\n    r.append(2)\nr → [1, 2]'],
    }),
  e('else (try)', 'kw', 'try/except/else',
    'Chạy khi KHÔNG có lỗi nào. Giúp tách phần "chạy tiếp nếu ổn" ra khỏi phần dễ lỗi.', {
      ex: ['try:\n    n = 1\nexcept ValueError:\n    r = "loi"\nelse:\n    r = "on"\nr → \'on\''],
    }),
  e('raise', 'kw', 'raise ValueError("thông báo")',
    'Tự ném lỗi khi dữ liệu không hợp lệ — tốt hơn là trả về None rồi để nơi gọi tự đoán.', {
      insert: 'raise $|("")',
      ex: ['try:\n    raise ValueError("am")\nexcept ValueError as e:\n    r = str(e)\nr → \'am\''],
      alias: 'nem loi',
    }),
  e('raise from', 'snip', 'raise MớiError("...") from e',
    'Ném lỗi mới nhưng giữ lại nguyên nhân gốc, nên vết lỗi vẫn chỉ đúng chỗ hỏng đầu tiên.', {
      insert: 'raise $|("") from e',
      ex: ['try:\n    try:\n        int("x")\n    except ValueError as e:\n        raise KeyError("k") from e\nexcept KeyError as k:\n    r = type(k.__cause__).__name__\nr → \'ValueError\''],
    }),
  e('Exception', 'kw', 'class LỗiCủaTôi(Exception):',
    'Lớp gốc của mọi lỗi thường. Kế thừa nó để tạo lỗi riêng cho ứng dụng của mình.', {
      ex: ['class LoiRieng(Exception): pass\ntry:\n    raise LoiRieng("x")\nexcept Exception as e:\n    r = type(e).__name__\nr → \'LoiRieng\''],
    }),
  e('ValueError', 'kw', 'raise ValueError(...)',
    'Kiểu đúng nhưng GIÁ TRỊ không hợp lệ — ví dụ int("abc") hay tuổi âm.', {
      ex: ['try:\n    int("abc")\nexcept ValueError:\n    r = 1\nr → 1'],
    }),
  e('TypeError', 'kw', 'raise TypeError(...)',
    'Sai KIỂU dữ liệu — ví dụ cộng số với chuỗi, hoặc gọi hàm thiếu tham số.', {
      ex: ['try:\n    1 + "a"\nexcept TypeError:\n    r = 1\nr → 1'],
    }),
  e('KeyError', 'kw', 'dict[khoá_không_có]',
    'Truy cập một khoá không có trong dict. Muốn tránh thì dùng .get() hoặc defaultdict.', {
      ex: ['try:\n    {}["a"]\nexcept KeyError:\n    r = 1\nr → 1'],
    }),
  e('IndexError', 'kw', 'list[chỉ_số_quá_lớn]',
    'Chỉ số vượt ngoài phạm vi của list/chuỗi. Nhớ là phần tử cuối có chỉ số len-1.', {
      ex: ['try:\n    [1][5]\nexcept IndexError:\n    r = 1\nr → 1'],
    }),
  e('ZeroDivisionError', 'kw', 'a / 0',
    'Chia cho 0. Hay gặp khi tính trung bình của một danh sách rỗng.', {
      ex: ['try:\n    1 / 0\nexcept ZeroDivisionError:\n    r = 1\nr → 1'],
    }),
  e('AttributeError', 'kw', 'obj.thuộc_tính_không_có',
    'Object không có thuộc tính/phương thức đó — thường vì biến đang là None hoặc sai kiểu.', {
      ex: ['try:\n    None.append(1)\nexcept AttributeError:\n    r = 1\nr → 1'],
    }),
  e('FileNotFoundError', 'kw', 'open("khong_co.txt")',
    'Không tìm thấy tệp. Nên bắt riêng lỗi này để báo cho người dùng đường dẫn sai.', {
      ex: ['try:\n    open("khong-ton-tai-abc.txt")\nexcept FileNotFoundError:\n    r = 1\nr → 1'],
    }),
  e('assert', 'kw', 'assert điều_kiện, "thông báo"',
    'Khẳng định một điều phải đúng; sai thì ném AssertionError. Dùng để kiểm tra giả định khi phát triển.', {
      insert: 'assert $|, ""',
      ex: ['try:\n    assert 1 == 2, "khac nhau"\nexcept AssertionError as e:\n    r = str(e)\nr → \'khac nhau\''],
    }),
  e('traceback', 'mod', 'traceback.format_exc()',
    'Lấy toàn bộ vết lỗi dạng chuỗi để ghi log — biết lỗi xảy ra ở dòng nào, qua những hàm nào.', {
      setup: 'import traceback',
      ex: ['try:\n    1 / 0\nexcept ZeroDivisionError:\n    r = "ZeroDivision" in traceback.format_exc()\nr → True'],
    }),
  e('logging', 'mod', 'logging.warning("...")',
    'Ghi log có mức độ (debug/info/warning/error) — thay cho print khi chương trình chạy thật.', {
      setup: 'import logging',
      ex: ['logging.getLogger("x").level → 0'],
    }),
]);

/* ==================== 📄 FILE, JSON & CSV ==================== */
const FILES = tag('files', [
  e('open', 'fn', 'open(đường_dẫn, "r"|"w"|"a", encoding="utf-8")',
    'Mở tệp: "r" đọc, "w" ghi mới (xoá nội dung cũ), "a" ghi thêm vào cuối. Nên luôn ghi encoding.', {
      ex: ['open(__file__).__class__.__name__ ≈ TextIOWrapper'],
      alias: 'mo tep, doc file',
    }),
  e('with open', 'snip', 'with open(p) as f:',
    'Cách mở tệp đúng chuẩn: hết khối with là tệp tự đóng, kể cả khi giữa đường có lỗi.', {
      insert: 'with open($|) as f:\n    ',
      ex: ['import tempfile, os\np = os.path.join(tempfile.mkdtemp(), "a.txt")\nwith open(p, "w") as f: f.write("xin chao")\nwith open(p) as f: r = f.read()\nr → \'xin chao\''],
    }),
  e('read', 'm', 'f.read() | f.read(n)',
    'Đọc toàn bộ nội dung tệp thành MỘT chuỗi. Tệp lớn thì nên đọc từng dòng thay vì đọc hết.', {
      ex: ['import io\nio.StringIO("abc").read() → \'abc\''],
    }),
  e('readlines', 'm', 'f.readlines()',
    'Đọc thành list các dòng, mỗi dòng còn nguyên ký tự xuống dòng ở cuối.', {
      ex: ['import io\nio.StringIO("a\\nb").readlines() → [\'a\\n\', \'b\']'],
    }),
  e('write', 'm', 'f.write(chuỗi)',
    'Ghi chuỗi vào tệp và trả về số ký tự đã ghi. Không tự thêm xuống dòng, phải tự viết \\n.', {
      ex: ['import io\nio.StringIO().write("abc") → 3'],
    }),
  e('duyệt tệp', 'snip', 'for dòng in f:',
    'Đọc tệp từng dòng một, không nạp cả tệp vào bộ nhớ — cách xử lý tệp lớn.', {
      insert: 'for dong in f:\n    $|',
      ex: ['import io\n[d.strip() for d in io.StringIO("a\\nb")] → [\'a\', \'b\']'],
    }),
  e('json.dumps', 'mod', 'json.dumps(obj, indent=2, ensure_ascii=False)',
    'Đổi dict/list thành chuỗi JSON. Có tiếng Việt thì đặt ensure_ascii=False để không bị \\u.', {
      setup: 'import json',
      ex: ['json.dumps({"a": 1}) → \'{"a": 1}\'', 'json.dumps(["á"], ensure_ascii=False) → \'["á"]\''],
      alias: 'chuyen sang json',
    }),
  e('json.loads', 'mod', 'json.loads(chuỗi_json)',
    'Đọc chuỗi JSON thành dict/list của Python.', {
      setup: 'import json',
      ex: ['json.loads(\'{"a": 1}\') → {\'a\': 1}', 'json.loads("[1, 2]") → [1, 2]'],
      alias: 'doc json, parse json',
    }),
  e('json.dump', 'mod', 'json.dump(obj, f)',
    'Ghi JSON thẳng vào tệp đang mở (không có "s" là làm việc với tệp).', {
      setup: 'import json, io',
      ex: ['buf = io.StringIO(); json.dump({"a": 1}, buf); buf.getvalue() → \'{"a": 1}\''],
    }),
  e('json.load', 'mod', 'json.load(f)',
    'Đọc JSON trực tiếp từ một tệp đang mở.', {
      setup: 'import json, io',
      ex: ['json.load(io.StringIO(\'{"a": 1}\')) → {\'a\': 1}'],
    }),
  e('csv.reader', 'mod', 'csv.reader(f)',
    'Đọc CSV thành từng dòng dạng list. Biết xử lý dấu phẩy nằm trong dấu ngoặc kép, khác split(",").', {
      setup: 'import csv, io',
      ex: ['list(csv.reader(io.StringIO(\'a,b\\n1,2\'))) → [[\'a\', \'b\'], [\'1\', \'2\']]',
        'list(csv.reader(io.StringIO(\'"a,b",c\'))) → [[\'a,b\', \'c\']]'],
    }),
  e('csv.DictReader', 'mod', 'csv.DictReader(f)',
    'Đọc CSV thành dict theo tên cột ở dòng đầu — code đọc dễ hơn dùng chỉ số cột.', {
      setup: 'import csv, io',
      ex: ['[dict(r) for r in csv.DictReader(io.StringIO("ten,tuoi\\nan,7"))] → [{\'ten\': \'an\', \'tuoi\': \'7\'}]'],
    }),
  e('csv.writer', 'mod', 'csv.writer(f).writerow(dòng)',
    'Ghi CSV, tự thêm dấu ngoặc kép khi giá trị có dấu phẩy.', {
      setup: 'import csv, io',
      ex: ['buf = io.StringIO(); csv.writer(buf).writerow(["a", "b,c"]); buf.getvalue().strip() → \'a,"b,c"\''],
    }),
  e('Path', 'mod', 'Path("thu_muc") / "tep.txt"',
    'Làm việc với đường dẫn bằng object thay vì ghép chuỗi — dấu / nối đường dẫn đúng trên mọi hệ điều hành.', {
      setup: 'from pathlib import Path',
      ex: ['str(Path("a") / "b.txt") ≈ a/b.txt', 'Path("a/b.txt").suffix → \'.txt\'',
        'Path("a/b.txt").name → \'b.txt\'', 'Path("a/b.txt").stem → \'b\''],
      alias: 'duong dan, pathlib',
    }),
  e('exists', 'm', 'Path(p).exists()',
    'Đường dẫn có tồn tại không — kiểm tra trước khi đọc để báo lỗi rõ ràng.', {
      setup: 'from pathlib import Path',
      ex: ['Path("khong-ton-tai-abc.txt").exists() → False'],
    }),
  e('read_text', 'm', 'Path(p).read_text(encoding="utf-8")',
    'Đọc cả tệp thành chuỗi trong một dòng, tự mở và tự đóng.', {
      setup: 'from pathlib import Path\nimport tempfile, os',
      ex: ['p = Path(tempfile.mkdtemp()) / "a.txt"\np.write_text("noi dung", encoding="utf-8")\np.read_text(encoding="utf-8") → \'noi dung\''],
    }),
]);

/* ==================== 📦 MODULE & PACKAGE ==================== */
const PACKAGING = tag('packaging', [
  e('import', 'kw', 'import math',
    'Nạp cả một thư viện; dùng thì phải gọi kèm tên: math.sqrt(9).', {
      insert: 'import $|',
      ex: ['import math\nmath.floor(2.7) → 2'],
    }),
  e('from import', 'kw', 'from collections import Counter',
    'Chỉ lấy đúng thứ cần dùng, nhờ đó gọi trực tiếp không cần tên thư viện.', {
      insert: 'from $| import ',
      ex: ['from math import sqrt\nsqrt(16) → 4.0'],
    }),
  e('as', 'kw', 'import numpy as np',
    'Đặt tên ngắn cho thứ vừa nhập — hay dùng cho tên thư viện dài.', {
      ex: ['import math as m\nm.pi > 3 → True'],
    }),
  e('__name__', 'kw', 'if __name__ == "__main__":',
    'Đoạn chỉ chạy khi tệp được gọi trực tiếp, không chạy khi tệp bị import — chỗ đặt code thử nghiệm.', {
      insert: 'if __name__ == "__main__":\n    $|',
      ex: ['__name__ ≈ __main__'],
      alias: 'diem chay chinh, main',
    }),
  e('__init__.py', 'snip', 'goi_package/__init__.py',
    'Tệp đánh dấu một thư mục là package và là chỗ khai báo những gì package cho dùng ra ngoài.', {
      ex: ['"__init__" in "__init__.py" → True'],
    }),
  e('__all__', 'kw', '__all__ = ["ham_a", "LopB"]',
    'Danh sách tên được xuất ra khi ai đó viết "from module import *".', {
      ex: ['__all__ = ["a"]\n__all__ → [\'a\']'],
    }),
  e('sys.path', 'mod', 'sys.path',
    'Danh sách thư mục Python đi tìm module. Lỗi ModuleNotFoundError thường là do thiếu đường dẫn ở đây.', {
      setup: 'import sys',
      ex: ['isinstance(sys.path, list) → True'],
    }),
  e('venv', 'snip', 'python -m venv .venv',
    'Tạo môi trường ảo riêng cho từng dự án để thư viện của các dự án không đè lên nhau.', {
      ex: ['"venv" in "python -m venv .venv" → True'],
      alias: 'moi truong ao',
    }),
  e('pip install', 'snip', 'pip install -r requirements.txt',
    'Cài thư viện; ghi danh sách vào requirements.txt để máy khác dựng lại đúng môi trường.', {
      ex: ['"pip" in "pip install rich" → True'],
    }),
]);

/* ==================== 🔐 CONTEXT MANAGER ==================== */
const CONTEXT = tag('context', [
  e('with', 'kw', 'with mở_gì_đó() as x:',
    'Mở một tài nguyên và đảm bảo nó được dọn khi ra khỏi khối, kể cả khi có lỗi xảy ra.', {
      insert: 'with $| as f:\n    ',
      ex: ['import io\nwith io.StringIO("ab") as f:\n    r = f.read()\nr → \'ab\''],
    }),
  e('with nhiều', 'snip', 'with open(a) as f1, open(b) as f2:',
    'Mở nhiều tài nguyên trong một câu with, khỏi lồng nhiều tầng.', {
      insert: 'with open($|) as f1, open() as f2:\n    ',
      ex: ['import io\nwith io.StringIO("a") as f1, io.StringIO("b") as f2:\n    r = f1.read() + f2.read()\nr → \'ab\''],
    }),
  e('__enter__', 'm', 'def __enter__(self):',
    'Chạy khi vào khối with; giá trị trả về chính là thứ đứng sau "as".', {
      insert: 'def __enter__(self):\n        return $|',
      ex: ['class M:\n    def __enter__(self): return 42\n    def __exit__(self, *a): return False\nwith M() as x:\n    r = x\nr → 42'],
    }),
  e('__exit__', 'm', 'def __exit__(self, exc_type, exc, tb):',
    'Chạy khi ra khỏi khối with — chỗ dọn dẹp. Trả về True nghĩa là "đã xử lý xong lỗi, đừng ném ra nữa".', {
      insert: 'def __exit__(self, exc_type, exc, tb):\n        $|\n        return False',
      ex: ['class Bo:\n    def __enter__(self): return self\n    def __exit__(self, t, e, tb): return True\nwith Bo():\n    1 / 0\nr = "khong vo"\nr → \'khong vo\''],
    }),
  e('contextmanager', 'mod', '@contextmanager\\ndef mo(): yield x',
    'Viết context manager bằng một hàm có yield: phần trước yield là mở, phần sau là dọn.', {
      setup: 'from contextlib import contextmanager',
      insert: '@contextmanager\ndef $|():\n    \n    yield \n    ',
      ex: ['@contextmanager\ndef m():\n    yield 5\nwith m() as v:\n    r = v\nr → 5'],
    }),
  e('suppress', 'mod', 'with suppress(FileNotFoundError):',
    'Bỏ qua đúng loại lỗi được liệt kê — gọn hơn try/except/pass và nói rõ ý định hơn.', {
      setup: 'from contextlib import suppress',
      ex: ['with suppress(ZeroDivisionError):\n    1 / 0\nr = "di qua"\nr → \'di qua\''],
    }),
  e('closing', 'mod', 'with closing(obj):',
    'Bọc một object chỉ có hàm close() để dùng được trong with.', {
      setup: 'from contextlib import closing\nimport io',
      ex: ['f = io.StringIO("a")\nwith closing(f):\n    r = f.read()\nf.closed → True'],
    }),
  e('nullcontext', 'mod', 'with nullcontext():',
    'Context manager không làm gì — dùng khi có/không có tài nguyên đều phải viết chung một khối with.', {
      setup: 'from contextlib import nullcontext',
      ex: ['with nullcontext(7) as v:\n    r = v\nr → 7'],
    }),
]);

/* ==================== 🧰 THƯ VIỆN CHUẨN ==================== */
const STDLIB = tag('stdlib', [
  e('math.sqrt', 'mod', 'math.sqrt(x)',
    'Căn bậc hai, luôn trả về số thực. Với số nguyên lớn thì dùng math.isqrt cho chính xác.', {
      setup: 'import math',
      ex: ['math.sqrt(16) → 4.0', 'math.isqrt(17) → 4'],
    }),
  e('math.ceil', 'mod', 'math.ceil(x)',
    'Làm tròn LÊN thành số nguyên gần nhất.', { setup: 'import math', ex: ['math.ceil(2.1) → 3', 'math.ceil(-2.1) → -2'] }),
  e('math.floor', 'mod', 'math.floor(x)',
    'Làm tròn XUỐNG thành số nguyên gần nhất.', { setup: 'import math', ex: ['math.floor(2.9) → 2'] }),
  e('math.gcd', 'mod', 'math.gcd(a, b)',
    'Ước số chung lớn nhất — dùng để rút gọn phân số.', { setup: 'import math', ex: ['math.gcd(12, 18) → 6'] }),
  e('math.inf', 'mod', 'math.inf | float("inf")',
    'Vô cực. Giá trị khởi tạo cho bài tìm nhỏ nhất (bắt đầu bằng inf) hoặc lớn nhất (-inf).', {
      setup: 'import math',
      ex: ['math.inf > 10 ** 100 → True', 'min(5, math.inf) → 5'],
    }),
  e('math.comb', 'mod', 'math.comb(n, k)',
    'Số cách chọn k trong n (tổ hợp), tính trực tiếp không cần vòng lặp.', {
      setup: 'import math',
      ex: ['math.comb(5, 2) → 10', 'math.factorial(5) → 120'],
    }),
  e('math.isclose', 'mod', 'math.isclose(a, b)',
    'So sánh hai số thực "gần bằng nhau" — cách đúng để so số thực vì phép tính luôn sai số nhỏ.', {
      setup: 'import math',
      ex: ['0.1 + 0.2 == 0.3 → False', 'math.isclose(0.1 + 0.2, 0.3) → True'],
    }),
  e('randint', 'mod', 'random.randint(a, b)',
    'Số nguyên ngẫu nhiên từ a đến b, KỂ CẢ b.', {
      setup: 'import random',
      ex: ['random.seed(1); random.randint(1, 6) ≈ 3', 'random.randint(5, 5) → 5'],
      alias: 'ngau nhien',
    }),
  e('choice', 'mod', 'random.choice(dãy)',
    'Lấy ngẫu nhiên một phần tử của dãy.', {
      setup: 'import random',
      ex: ['random.choice([7]) → 7', 'random.choice("ab") ≈ a'],
    }),
  e('shuffle', 'mod', 'random.shuffle(list)',
    'Trộn NGAY TRÊN list gốc, trả về None.', {
      setup: 'import random',
      ex: ['a = [1, 2, 3]; random.shuffle(a); sorted(a) → [1, 2, 3]'],
    }),
  e('sample', 'mod', 'random.sample(dãy, k)',
    'Lấy k phần tử khác nhau (không lặp lại) một cách ngẫu nhiên.', {
      setup: 'import random',
      ex: ['len(random.sample(range(10), 3)) → 3'],
    }),
  e('datetime', 'mod', 'datetime.now() | datetime(2026, 8, 13)',
    'Mốc thời gian gồm cả ngày và giờ. now() lấy thời điểm hiện tại.', {
      setup: 'from datetime import datetime, timedelta',
      ex: ['datetime(2026, 8, 13).year → 2026', 'datetime.now().year ≈ 2026'],
      alias: 'ngay gio, thoi gian',
    }),
  e('strftime', 'm', 'dt.strftime("%d/%m/%Y")',
    'Đổi mốc thời gian thành chuỗi theo mẫu mình muốn.', {
      setup: 'from datetime import datetime',
      ex: ['datetime(2026, 8, 13).strftime("%d/%m/%Y") → \'13/08/2026\''],
    }),
  e('strptime', 'm', 'datetime.strptime("13/08/2026", "%d/%m/%Y")',
    'Đọc chuỗi thành mốc thời gian — chiều ngược của strftime.', {
      setup: 'from datetime import datetime',
      ex: ['datetime.strptime("13/08/2026", "%d/%m/%Y").month → 8'],
    }),
  e('timedelta', 'mod', 'timedelta(days=1, hours=2)',
    'Khoảng thời gian, cộng/trừ được với datetime để tính ngày trước/sau.', {
      setup: 'from datetime import datetime, timedelta',
      ex: ['(datetime(2026, 1, 1) + timedelta(days=31)).month → 2',
        '(datetime(2026, 1, 2) - datetime(2026, 1, 1)).days → 1'],
    }),
  e('deepcopy', 'mod', 'copy.deepcopy(x)',
    'Bản sao SÂU: sao chép cả các list/dict lồng bên trong, nên sửa bản sao không ảnh hưởng gốc.', {
      setup: 'from copy import deepcopy',
      ex: ['a = [[1]]; b = deepcopy(a); b[0].append(2); a → [[1]]'],
      alias: 'sao chep sau',
    }),
  e('mean', 'mod', 'statistics.mean(dãy)',
    'Giá trị trung bình; cùng thư viện còn có median (trung vị) và mode (giá trị hay gặp nhất).', {
      setup: 'import statistics',
      ex: ['statistics.mean([1, 2, 3]) → 2', 'statistics.median([1, 3, 100]) → 3'],
      alias: 'trung binh, trung vi',
    }),
  e('Decimal', 'mod', 'Decimal("0.1")',
    'Số thập phân chính xác tuyệt đối — dùng cho tiền, nơi không được phép sai số như số thực.', {
      setup: 'from decimal import Decimal',
      ex: ['Decimal("0.1") + Decimal("0.2") == Decimal("0.3") → True', '0.1 + 0.2 == 0.3 → False'],
      alias: 'tien, so chinh xac',
    }),
  e('os.environ', 'mod', 'os.environ.get("TEN")',
    'Đọc biến môi trường (cấu hình, khoá bí mật) — dùng .get để không lỗi khi biến chưa được đặt.', {
      setup: 'import os',
      ex: ['os.environ.get("KHONG_CO_BIEN_NAY") → None'],
    }),
  e('sys.argv', 'mod', 'sys.argv',
    'Danh sách tham số dòng lệnh; phần tử đầu là tên tệp đang chạy.', {
      setup: 'import sys',
      ex: ['isinstance(sys.argv, list) → True'],
    }),
]);

/* ==================== ✅ TESTING VỚI PYTEST ==================== */
const TESTING = tag('testing', [
  e('test_', 'snip', 'def test_ten_viec_can_kiem_tra():',
    'pytest tự tìm hàm bắt đầu bằng test_ trong tệp test_*.py. Tên hàm nên nói rõ đang kiểm tra điều gì.', {
      insert: 'def test_$|():\n    ',
      ex: ['def test_cong(): assert 1 + 1 == 2\ntest_cong() → None'],
    }),
  e('pytest.raises', 'mod', 'with pytest.raises(ValueError):',
    'Khẳng định đoạn code PHẢI ném lỗi. Không ném thì test thất bại — cách kiểm tra nhánh lỗi.', {
      setup: 'import contextlib',
      ex: ['with contextlib.suppress(ValueError):\n    raise ValueError("x")\nr = "da bat"\nr → \'da bat\''],
      alias: 'kiem tra loi',
    }),
  e('parametrize', 'mod', '@pytest.mark.parametrize("a,b", [(1, 2), (3, 4)])',
    'Chạy cùng một test với nhiều bộ dữ liệu, thay vì copy test ra nhiều lần.', {
      ex: ['cases = [(1, 2, 3), (2, 3, 5)]\nall(a + b == t for a, b, t in cases) → True'],
      alias: 'nhieu bo du lieu',
    }),
  e('fixture', 'mod', '@pytest.fixture\\ndef du_lieu(): ...',
    'Hàm dựng sẵn dữ liệu dùng chung cho nhiều test; test chỉ cần khai tên fixture ở tham số.', {
      ex: ['def du_lieu(): return [1, 2]\nsum(du_lieu()) → 3'],
      alias: 'du lieu dung chung',
    }),
  e('approx', 'mod', 'pytest.approx(0.3)',
    'So sánh số thực trong test có sai số cho phép — vì 0.1 + 0.2 không đúng bằng 0.3.', {
      setup: 'import math',
      ex: ['math.isclose(0.1 + 0.2, 0.3) → True'],
    }),
  e('tmp_path', 'mod', 'def test_x(tmp_path):',
    'Fixture cho một thư mục tạm sạch cho mỗi test — chỗ để thử đọc/ghi tệp mà không bẩn dự án.', {
      setup: 'import tempfile, os',
      ex: ['os.path.isdir(tempfile.mkdtemp()) → True'],
    }),
  e('capsys', 'mod', 'def test_x(capsys):',
    'Fixture bắt lại những gì code in ra, để kiểm tra nội dung print.', {
      setup: 'import io, contextlib',
      ex: ['buf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    print("chao")\nbuf.getvalue().strip() → \'chao\''],
    }),
  e('monkeypatch', 'mod', 'monkeypatch.setattr(...)',
    'Fixture thay tạm một hàm/biến trong lúc test rồi tự trả lại như cũ khi test xong.', {
      ex: ['class A:\n    def f(self): return 1\na = A(); A.f = lambda s: 2; a.f() → 2'],
    }),
  e('unittest', 'mod', 'class TestX(unittest.TestCase):',
    'Bộ test có sẵn trong Python, dùng self.assertEqual thay cho assert. pytest chạy được cả loại này.', {
      setup: 'import unittest',
      ex: ['issubclass(unittest.TestCase, object) → True'],
    }),
]);

/* ==================== ⚡ ĐỒNG THỜI & HIỆU NĂNG ==================== */
const PERF = tag('perf', [
  e('Thread', 'mod', 'Thread(target=hàm, args=(...,))',
    'Chạy một hàm song song. Có lợi khi phải CHỜ (mạng, tệp), không giúp nhanh hơn với tính toán nặng.', {
      setup: 'from threading import Thread',
      ex: ['r = []\nt = Thread(target=lambda: r.append(1))\nt.start(); t.join()\nr → [1]'],
      alias: 'luong, da luong',
    }),
  e('join (luồng)', 'm', 'thread.join()',
    'Đợi luồng chạy xong mới đi tiếp. Thiếu bước này thì kết quả có thể chưa kịp có.', {
      insert: 'join()',
      setup: 'from threading import Thread',
      ex: ['t = Thread(target=lambda: None); t.start(); t.join(); t.is_alive() → False'],
    }),
  e('Lock', 'mod', 'with lock:',
    'Khoá để mỗi lúc chỉ một luồng sửa dữ liệu chung, tránh hai luồng ghi chồng lên nhau.', {
      setup: 'from threading import Lock',
      ex: ['lock = Lock()\nwith lock:\n    r = 1\nr → 1'],
      alias: 'khoa, dong bo',
    }),
  e('ThreadPoolExecutor', 'mod', 'with ThreadPoolExecutor() as ex:',
    'Bể luồng: giao một loạt việc rồi lấy kết quả, khỏi tự quản lý từng luồng.', {
      setup: 'from concurrent.futures import ThreadPoolExecutor',
      ex: ['with ThreadPoolExecutor(2) as ex:\n    r = list(ex.map(lambda x: x * 2, [1, 2]))\nr → [2, 4]'],
    }),
  e('as_completed', 'mod', 'for f in as_completed(futures):',
    'Lấy kết quả theo thứ tự việc nào xong trước, không phải theo thứ tự gửi đi.', {
      setup: 'from concurrent.futures import ThreadPoolExecutor, as_completed',
      ex: ['with ThreadPoolExecutor(2) as ex:\n    fs = [ex.submit(lambda: 1) for _ in range(2)]\n    r = sorted(f.result() for f in as_completed(fs))\nr → [1, 1]'],
    }),
  e('Queue', 'mod', 'q = Queue(); q.put(x); q.get()',
    'Hàng đợi an toàn giữa các luồng — cách chuẩn để luồng này chuyển việc cho luồng khác.', {
      setup: 'from queue import Queue',
      ex: ['q = Queue(); q.put(5); q.get() → 5'],
    }),
  e('async def', 'kw', 'async def f(): await g()',
    'Hàm bất đồng bộ: gặp await thì nhường CPU cho việc khác trong lúc chờ. Gọi bằng asyncio.run.', {
      setup: 'import asyncio',
      ex: ['async def f(): return 7\nasyncio.run(f()) → 7'],
      alias: 'bat dong bo, asyncio',
    }),
  e('await', 'kw', 'kq = await ham_async()',
    'Chờ một việc bất đồng bộ xong và lấy kết quả. Chỉ viết được bên trong async def.', {
      setup: 'import asyncio',
      ex: ['async def g(): return 1\nasync def f(): return await g() + 1\nasyncio.run(f()) → 2'],
    }),
  e('gather', 'mod', 'await asyncio.gather(a(), b())',
    'Chạy nhiều việc bất đồng bộ cùng lúc và đợi tất cả xong, trả về list kết quả theo thứ tự.', {
      setup: 'import asyncio',
      ex: ['async def g(x): return x\nasync def f(): return await asyncio.gather(g(1), g(2))\nasyncio.run(f()) → [1, 2]'],
    }),
  e('perf_counter', 'mod', 't0 = time.perf_counter()',
    'Đồng hồ chính xác để đo thời gian chạy. Lấy hiệu hai lần gọi ra số giây.', {
      setup: 'import time',
      ex: ['t = time.perf_counter(); time.perf_counter() >= t → True'],
      alias: 'do thoi gian',
    }),
  e('timeit', 'mod', 'timeit.timeit("code", number=1000)',
    'Chạy một đoạn code nhiều lần rồi báo tổng thời gian — cách đo đúng thay vì bấm đồng hồ một lần.', {
      setup: 'import timeit',
      ex: ['timeit.timeit("1 + 1", number=10) > 0 → True'],
    }),
  e('nối chuỗi nhanh', 'snip', '"".join(cac_phan)',
    'Nối chuỗi trong vòng lặp bằng += tạo lại chuỗi mới mỗi lần nên rất chậm; gom vào list rồi join một lần.', {
      insert: '"".join($|)',
      ex: ['parts = [str(i) for i in range(3)]; "".join(parts) → \'012\''],
      alias: 'toi uu noi chuoi',
    }),
  e('GIL', 'snip', 'threading vs multiprocessing',
    'Python chỉ cho một luồng chạy mã Python tại một thời điểm; muốn tận dụng nhiều CPU cho tính toán thì dùng multiprocessing.', {
      ex: ['import sys; sys.version_info[0] → 3'],
      alias: 'da tien trinh, cpu',
    }),
]);

/* ==================== 🧮 CẤU TRÚC CHO THUẬT TOÁN ==================== */
const ALGO = tag('algo', [
  e('deque', 'mod', 'deque([...]) | deque(maxlen=n)',
    'Hàng đợi hai đầu: thêm/lấy ở CẢ hai đầu đều nhanh. Đây là thứ dùng cho BFS, list thì chậm ở đầu.', {
      setup: 'from collections import deque',
      ex: ['deque([1, 2]) → deque([1, 2])', 'q = deque([1]); q.appendleft(0); list(q) → [0, 1]'],
      alias: 'hang doi, bfs',
    }),
  e('appendleft', 'm', 'deque.appendleft(x)',
    'Thêm vào ĐẦU hàng đợi, nhanh không phụ thuộc độ dài (list.insert(0, x) thì phải dồn cả list).', {
      setup: 'from collections import deque',
      ex: ['q = deque([2]); q.appendleft(1); list(q) → [1, 2]'],
    }),
  e('popleft', 'm', 'deque.popleft()',
    'Lấy phần tử ở ĐẦU ra — chính là bước "lấy đỉnh khỏi hàng đợi" của BFS.', {
      setup: 'from collections import deque',
      ex: ['q = deque([1, 2]); q.popleft() → 1'],
    }),
  e('heappush', 'mod', 'heapq.heappush(heap, x)',
    'Thêm vào hàng đợi ưu tiên (min-heap). Muốn max-heap thì đẩy giá trị âm.', {
      setup: 'import heapq',
      ex: ['h = []; heapq.heappush(h, 3); heapq.heappush(h, 1); h[0] → 1'],
      alias: 'heap, hang doi uu tien',
    }),
  e('heappop', 'mod', 'heapq.heappop(heap)',
    'Lấy phần tử NHỎ NHẤT ra khỏi heap.', {
      setup: 'import heapq',
      ex: ['h = [1, 3]; heapq.heapify(h); heapq.heappop(h) → 1'],
    }),
  e('heapify', 'mod', 'heapq.heapify(list)',
    'Biến một list thường thành heap ngay tại chỗ, nhanh hơn đẩy từng phần tử.', {
      setup: 'import heapq',
      ex: ['h = [5, 1, 3]; heapq.heapify(h); h[0] → 1'],
    }),
  e('nlargest', 'mod', 'heapq.nlargest(k, dãy, key=None)',
    'k phần tử lớn nhất, đã sắp từ lớn xuống. Nhanh hơn sắp xếp cả dãy khi k nhỏ.', {
      setup: 'import heapq',
      ex: ['heapq.nlargest(2, [5, 1, 9]) → [9, 5]', 'heapq.nsmallest(2, [5, 1, 9]) → [1, 5]'],
      alias: 'top k',
    }),
  e('bisect_left', 'mod', 'bisect.bisect_left(a, x)',
    'Vị trí nên chèn x vào list ĐÃ SẮP XẾP (bên trái các giá trị bằng nhau), tìm bằng chặt nhị phân.', {
      setup: 'import bisect',
      ex: ['bisect.bisect_left([1, 3, 5], 3) → 1', 'bisect.bisect_right([1, 3, 5], 3) → 2'],
      alias: 'chat nhi phan, tim kiem nhi phan',
    }),
  e('insort', 'mod', 'bisect.insort(a, x)',
    'Chèn x vào list đã sắp xếp mà vẫn giữ đúng thứ tự.', {
      setup: 'import bisect',
      ex: ['a = [1, 5]; bisect.insort(a, 3); a → [1, 3, 5]'],
    }),
  e('OrderedDict', 'mod', 'OrderedDict()',
    'Dict có move_to_end để đẩy khoá về cuối — lõi của bài LRU Cache.', {
      setup: 'from collections import OrderedDict',
      ex: ['d = OrderedDict(a=1, b=2); d.move_to_end("a"); list(d) → [\'b\', \'a\']'],
    }),
  e('trace', 'fn', 'trace(i=i, l=l, r=r)',
    'Hàm riêng của app này: mỗi lần gọi ghi một bước vào bảng "Theo dõi biến" dưới phần kết quả chạy.', {
      ex: ['"trace" in "trace(i=1)" → True'],
      alias: 'theo doi bien, debug',
    }),
]);

export default [
  ...DATA_METHODS, ...STRINGS, ...ERRORS, ...FILES,
  ...PACKAGING, ...CONTEXT, ...STDLIB, ...TESTING, ...PERF, ...ALGO,
];
