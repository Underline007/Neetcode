/**
 * Từ điển cú pháp JavaScript cho lộ trình thuật toán.
 *
 * Bộ này giữ nguyên như trước: mỗi mục có chữ ký (`detail`) và một dòng mô tả (`doc`).
 * Phần được viết lại theo kiểu "giải thích thành câu + ví dụ có kết quả" hiện mới làm
 * cho Python (xem python-*.js), vì lộ trình đang học là Python.
 */

/** Giữ đúng khuôn cũ: tham số thứ 5 là `insert` chứ không phải object tuỳ chọn. */
const item = (label, kind, detail, doc, insert) => ({ label, kind, detail, doc, insert });

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

export const JS_HINTS = {
  indent: '  ',
  indentSize: 2,
  globals: [...JS_KEYWORDS, ...JS_BUILTINS, ...JS_SNIPPETS.flatMap((g) => g.items)],
  members: JS_MEMBERS,
  snippets: JS_SNIPPETS,
};
