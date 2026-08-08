/**
 * Dịch & giải thích lỗi runtime sang tiếng Việt.
 *
 * Vì sao cần: `TypeError: Cannot read properties of undefined (reading 'next')` là một
 * bức tường với người học Việt mới bắt đầu. Nó nói *cái gì* xảy ra nhưng không nói
 * *vì sao* và *sửa thế nào* — mà hai câu đó mới là phần dạy được.
 *
 * Mỗi luật trả lời đúng ba câu hỏi:
 *   title — lỗi này nghĩa là gì (một câu, không thuật ngữ)
 *   why   — vì sao nó thường xảy ra, viết bám ngữ cảnh bài tập trong app này
 *   fix   — làm gì bây giờ (hành động cụ thể, không phải lời khuyên chung)
 *
 * `key` là mã ổn định, dùng để đếm ở mục "Lỗi bạn hay mắc" trong Sổ tay —
 * ĐỪNG đổi key của luật đã có, thêm luật mới thì đặt key mới.
 */

/* ============================== JAVASCRIPT ============================== */
/** Dùng chung cho cả hai cách diễn đạt của lỗi "đọc thuộc tính của undefined/null":
 *  Chrome mới  : Cannot read properties of undefined (reading 'next')
 *  V8 cũ/Node  : Cannot read property 'next' of undefined
 *  Firefox     : can't access property "next" of undefined
 *  (Cùng `key` để mục "Lỗi bạn hay mắc" đếm gộp thành một loại.) */
const NULLISH_PROP = {
  key: 'js-prop-of-nullish',
  generic: 'Đọc thuộc tính của một giá trị `undefined`/`null`.',
  why: 'Ba nguồn gốc phổ biến: (1) đi quá cuối danh sách liên kết — `node` đã là `null` mà vẫn gọi `node.next`; '
    + '(2) chỉ số vượt biên mảng — `arr[i]` với `i >= arr.length` cho `undefined`; '
    + '(3) hàm không có `return` nên trả về `undefined`, rồi bạn dùng kết quả đó tiếp.',
  fix: 'Kiểm tra trước khi truy cập: `while (node && node.next)` thay vì `while (node.next)`. '
    + 'Không rõ giá trị nào bị rỗng thì đặt `trace({ node, i })` ngay phía trên dòng lỗi để xem nó là gì ở bước cuối.',
};

const nullishTitle = (prop, kind) =>
  `Bạn đang đọc thuộc tính ${prop ? `\`${prop}\` ` : ''}của một giá trị **${kind || 'rỗng'}** — tức là "của cái không có gì".`;

const JS_RULES = [
  {
    ...NULLISH_PROP,
    // Chrome mới: thứ tự "of undefined" TRƯỚC tên thuộc tính
    test: /Cannot read propert(?:y|ies) of (undefined|null) \(reading '([^']+)'\)/,
    title: (m) => nullishTitle(m[2], m[1]),
  },
  {
    ...NULLISH_PROP,
    // V8 cũ / Node: tên thuộc tính trước, rồi "of undefined"
    test: /Cannot read propert(?:y|ies) '([^']+)' of (undefined|null)/,
    title: (m) => nullishTitle(m[1], m[2]),
  },
  {
    ...NULLISH_PROP,
    // Firefox
    test: /can't access propert(?:y|ies) "([^"]+)" of (undefined|null)/,
    title: (m) => nullishTitle(m[1], m[2]),
  },
  {
    ...NULLISH_PROP,
    // Phương án dự phòng: bắt được "of undefined/null" là đủ để giải thích
    test: /Cannot read propert(?:y|ies).* of (undefined|null)/,
    title: (m) => nullishTitle(null, m[1]),
  },
  {
    key: 'js-not-a-function',
    generic: 'Gọi một thứ không phải là hàm.',
    test: /(\S+) is not a function/,
    title: (m) => `\`${m[1]}\` không phải là một hàm nên không gọi được.`,
    why: 'Thường là sai tên phương thức, hoặc gọi phương thức của kiểu khác: mảng có `push` nhưng `Set` thì dùng `add`; '
      + '`Map` dùng `set/get` chứ không phải `push`. Cũng có thể bạn đã gán một giá trị lên biến vốn là hàm.',
    fix: 'Đối chiếu lại tên phương thức đúng của kiểu dữ liệu bạn đang dùng (mục **🔎 Tra cứu nhanh** có bảng đầy đủ). '
      + 'Nếu tên đúng, hãy kiểm tra biến đó có bị gán lại ở đâu không.',
  },
  {
    key: 'js-not-defined',
    generic: 'Dùng một biến/hàm chưa được khai báo.',
    test: /(\S+) is not defined/,
    title: (m) => `Chưa có biến hay hàm nào tên \`${m[1]}\`.`,
    why: 'Hoặc gõ sai tên (JavaScript phân biệt chữ hoa/thường: `Map` khác `map`), hoặc biến được khai báo bằng `let/const` '
      + 'bên trong một khối `{ }` khác nên ra ngoài khối là không còn thấy nữa.',
    fix: 'Soát lại chính tả tên biến. Nếu cần dùng ở nhiều khối, hãy khai báo nó ở phạm vi bao ngoài (đầu hàm).',
  },
  {
    key: 'js-stack-overflow',
    test: /Maximum call stack size exceeded/,
    title: () => 'Đệ quy gọi quá sâu — hàm tự gọi chính nó mà không bao giờ dừng.',
    why: 'Hàm đệ quy thiếu **trường hợp cơ sở**, hoặc có nhưng tham số không tiến về phía nó '
      + '(ví dụ luôn truyền lại `n` thay vì `n - 1`, hoặc quên đánh dấu ô đã thăm nên đi vòng tròn mãi).',
    fix: 'Trả lời hai câu: *khi nào hàm dừng?* và *mỗi lần gọi tham số tiến về điều kiện dừng bao nhiêu?* '
      + 'Đặt `trace({ n })` ở dòng đầu tiên trong hàm để xem tham số có thực sự nhỏ dần không.',
  },
  {
    key: 'js-not-iterable',
    test: /is not iterable|is not a function or its return value is not iterable/,
    title: () => 'Giá trị này không duyệt được bằng `for...of`.',
    why: 'Chỉ mảng, chuỗi, `Set`, `Map` mới duyệt được kiểu đó. Object thường (`{}`) và `undefined` thì không. '
      + 'Rất hay gặp khi hàm trả về `undefined` rồi kết quả đó bị đem đi duyệt.',
    fix: 'Muốn duyệt object thường: `for (const [k, v] of Object.entries(obj))`. '
      + 'Còn nếu giá trị là `undefined`, lỗi thật nằm ở chỗ tạo ra nó — không phải ở vòng lặp.',
  },
  {
    key: 'js-const-assign',
    test: /Assignment to constant variable/,
    title: () => 'Bạn đang gán lại giá trị cho một biến khai báo bằng `const`.',
    why: '`const` nghĩa là "không gán lại tên này". Lưu ý: sửa *nội dung* mảng/object thì vẫn được '
      + '(`arr.push(1)` hợp lệ), nhưng thay cả biến (`arr = []`) thì không.',
    fix: 'Biến cần thay đổi giá trị (con trỏ `l`, `r`, biến đếm, biến kết quả) thì khai báo bằng `let`.',
  },
  {
    key: 'js-syntax',
    test: /SyntaxError|Unexpected token|Unexpected end of input|missing \) after/,
    title: () => 'Code chưa đúng cú pháp nên chưa chạy được dòng nào.',
    why: 'Gần như luôn là thiếu hoặc thừa một ký tự: ngoặc `)` `}` `]` chưa đóng, thiếu dấu phẩy giữa các phần tử, '
      + 'hoặc thừa một dấu toán tử ở cuối biểu thức.',
    fix: 'Xem đúng số dòng bên dưới và soát từ đó **lùi lên**. Số dòng báo lỗi thường là nơi trình biên dịch '
      + '*phát hiện* vấn đề, còn ký tự thiếu nằm ở phía trước.',
  },
  {
    key: 'js-invalid-length',
    test: /Invalid array length|Invalid string length/,
    title: () => 'Kích thước mảng/chuỗi không hợp lệ (số âm, không nguyên, hoặc quá lớn).',
    why: 'Thường do `new Array(n)` với `n` bị âm hoặc là `NaN` — mà `NaN` lại sinh ra từ một phép tính '
      + 'trên `undefined` ở phía trước.',
    fix: 'Đặt `trace({ n })` ngay trước dòng tạo mảng để xem `n` thực sự bằng bao nhiêu.',
  },
];

/* ============================== PYTHON ============================== */
const PY_RULES = [
  {
    key: 'py-indent',
    test: /IndentationError|TabError|unexpected indent|expected an indented block/,
    title: () => 'Thụt lề sai — Python dùng thụt lề để biết đâu là thân của khối lệnh.',
    why: 'Hai nguyên nhân: (1) **trộn tab và dấu cách** trong cùng một khối — nhìn giống nhau nhưng Python coi là khác; '
      + '(2) sau dòng có dấu `:` (`if`, `for`, `def`) mà dòng tiếp theo không thụt vào.',
    fix: 'Dùng **4 dấu cách** cho mỗi cấp và tuyệt đối không dùng tab (nút Tab trong app này đã tự chèn dấu cách). '
      + 'Khối rỗng chưa viết thì đặt `pass` vào cho đủ.',
  },
  {
    key: 'py-name-error',
    generic: 'Dùng một biến/hàm chưa được khai báo hoặc chưa import.',
    test: /NameError: name '([^']+)' is not defined/,
    title: (m) => `Chưa có biến hay hàm nào tên \`${m[1]}\`.`,
    why: 'Gõ sai tên, hoặc quên `import`. Python phân biệt chữ hoa/thường và dùng `True`/`False`/`None` '
      + '(viết hoa chữ đầu) — viết `true`, `null` là lỗi này.',
    fix: 'Soát chính tả. Cần thư viện thì thêm dòng `import` ở đầu, ví dụ '
      + '`from collections import defaultdict, deque` hoặc `import heapq`.',
  },
  {
    key: 'py-unbound-local',
    test: /UnboundLocalError/,
    title: () => 'Bạn đọc một biến của hàm trước khi nó được gán trong hàm đó.',
    why: 'Trong Python, chỉ cần **gán** một biến ở đâu đó trong hàm là biến đó thành biến cục bộ của cả hàm — '
      + 'kể cả khi bên ngoài đã có biến cùng tên. Rất hay gặp khi hàm `dfs` lồng bên trong muốn cập nhật `res` của hàm ngoài.',
    fix: 'Khai báo `nonlocal res` ở đầu hàm lồng (hoặc `global` nếu biến ở cấp module). '
      + 'Cách khác gọn hơn: dùng list một phần tử `res = [0]` rồi sửa `res[0]` — sửa nội dung thì không cần `nonlocal`.',
  },
  {
    key: 'py-index-error',
    test: /IndexError/,
    title: () => 'Chỉ số vượt ra ngoài phạm vi của list.',
    why: 'List `n` phần tử có chỉ số hợp lệ từ `0` đến `n-1`. Lỗi kinh điển: vòng lặp `range(len(arr))` '
      + 'mà bên trong lại truy cập `arr[i + 1]` — đến lượt cuối là vượt biên. List rỗng thì `arr[0]` cũng lỗi.',
    fix: 'Đổi cận vòng lặp thành `range(len(arr) - 1)` khi bên trong dùng `arr[i + 1]`. '
      + 'Và thêm nhánh xử lý list rỗng ở đầu hàm.',
  },
  {
    key: 'py-key-error',
    test: /KeyError/,
    title: () => 'Bạn đọc một khoá chưa tồn tại trong dict.',
    why: '`d[k]` yêu cầu khoá `k` phải có sẵn. Mẫu đếm tần suất `cnt[x] += 1` sẽ lỗi ngay ở lần đầu gặp `x`.',
    fix: 'Ba cách, chọn một: `cnt = defaultdict(int)` rồi `cnt[x] += 1`; hoặc `cnt[x] = cnt.get(x, 0) + 1`; '
      + 'hoặc `Counter(arr)` nếu chỉ cần đếm.',
  },
  {
    key: 'py-none-subscript',
    test: /'NoneType' object is not subscriptable|'NoneType' object has no attribute|'NoneType' object is not iterable/,
    title: () => 'Bạn đang dùng `None` như thể nó là list, dict hay object.',
    why: 'Nguồn gốc gần như luôn là một hàm **thiếu `return`** (hàm không trả gì thì trả `None`), '
      + 'hoặc `arr.sort()` / `arr.reverse()` — hai hàm này sửa tại chỗ và trả về `None`, '
      + 'nên `arr = arr.sort()` sẽ biến `arr` thành `None`.',
    fix: 'Cần list đã sắp xếp thành biến mới thì dùng `sorted(arr)`; muốn sửa tại chỗ thì gọi `arr.sort()` '
      + 'và **không gán lại**. Nếu là hàm của bạn, kiểm tra mọi nhánh đều có `return`.',
  },
  {
    key: 'py-attribute-error',
    generic: 'Gọi phương thức không tồn tại trên kiểu dữ liệu đó.',
    test: /AttributeError: '([^']+)' object has no attribute '([^']+)'/,
    title: (m) => `Kiểu \`${m[1]}\` không có phương thức \`${m[2]}\`.`,
    why: 'Đang dùng phương thức của kiểu khác. Hay lẫn nhất: `list` dùng `append` (không phải `push`/`add`), '
      + '`set` dùng `add` (không phải `append`), `dict` dùng `items()` (không phải `entries()`), '
      + '`str` không có `length` mà dùng `len(s)`.',
    fix: 'Mở mục **🔎 Tra cứu nhanh** để đối chiếu phương thức đúng của từng kiểu — '
      + 'ở đó có cả bảng đối chiếu JavaScript ↔ Python.',
  },
  {
    key: 'py-unhashable',
    generic: 'Dùng list/set/dict làm khoá của dict hoặc set.',
    test: /unhashable type: '([^']+)'/,
    title: (m) => `Không thể dùng \`${m[1]}\` làm khoá của dict/set.`,
    why: 'Khoá phải **bất biến** để băm được. `list`, `set`, `dict` đều thay đổi được nên không dùng làm khoá.',
    fix: 'Chuyển sang `tuple`: `seen.add(tuple(arr))`, `d[(r, c)] = ...`. '
      + 'Với bài nhóm từ đảo chữ, khoá nên là `tuple(sorted(w))` hoặc `"".join(sorted(w))`.',
  },
  {
    key: 'py-recursion',
    test: /RecursionError|maximum recursion depth/,
    title: () => 'Đệ quy quá sâu — hàm tự gọi mãi mà không dừng.',
    why: 'Thiếu **trường hợp cơ sở**, hoặc tham số không tiến về điều kiện dừng, '
      + 'hoặc đi trên đồ thị/lưới mà quên đánh dấu ô đã thăm nên quay vòng.',
    fix: 'Viết trường hợp cơ sở ở dòng ĐẦU của hàm (`if not node: return 0`). '
      + 'Với đồ thị, đánh dấu `visited.add(node)` **trước** khi đi tiếp.',
  },
  {
    key: 'py-unpack',
    test: /not enough values to unpack|too many values to unpack|cannot unpack non-sequence/,
    title: () => 'Số biến bên trái dấu `=` không khớp số giá trị bên phải.',
    why: '`for k, v in d:` sẽ lỗi vì duyệt dict cho ra **khoá** chứ không phải cặp. '
      + 'Tương tự `for i, x in arr:` lỗi vì mỗi phần tử là một giá trị đơn.',
    fix: 'Duyệt cặp khoá–giá trị: `for k, v in d.items()`. '
      + 'Cần cả chỉ số và giá trị của list: `for i, x in enumerate(arr)`.',
  },
  {
    key: 'py-type-error-op',
    test: /unsupported operand type\(s\)|can only concatenate|must be str, not|not supported between instances/,
    title: () => 'Phép toán này không dùng được giữa hai kiểu dữ liệu đó.',
    why: 'Python không tự đổi kiểu như JavaScript: `"3" + 5` là lỗi (JS thì ra `"35"`). '
      + 'Hay gặp khi so sánh/cộng một giá trị `None` với số, hoặc cộng chuỗi với số.',
    fix: 'Ép kiểu tường minh: `int("3") + 5`, hoặc `str(5)` khi nối chuỗi (gọn nhất là f-string: `f"{a}{b}"`).',
  },
  {
    key: 'py-zero-division',
    test: /ZeroDivisionError|division by zero|integer division or modulo by zero/,
    title: () => 'Chia cho 0.',
    why: 'Thường do mẫu số là độ dài của một list rỗng, hoặc là một biến đếm chưa kịp tăng.',
    fix: 'Thêm nhánh chặn trước phép chia: `if not arr: return 0`.',
  },
  {
    key: 'py-args-count',
    test: /takes \d+ positional argument|missing \d+ required positional argument|takes no arguments/,
    title: () => 'Số tham số truyền vào không khớp với định nghĩa hàm.',
    why: 'Trong một `class`, mọi phương thức phải có `self` là tham số đầu tiên — thiếu `self` là nguyên nhân số một. '
      + 'Ngoài ra có thể bạn gọi hàm với số tham số khác lúc định nghĩa.',
    fix: 'Thêm `self`: `def push(self, x):`. Và bên trong phương thức, truy cập dữ liệu của đối tượng qua `self.ten`.',
  },
  {
    key: 'py-syntax',
    test: /SyntaxError|invalid syntax/,
    title: () => 'Code chưa đúng cú pháp nên chưa chạy được dòng nào.',
    why: 'Thường là: thiếu dấu `:` ở cuối dòng `if`/`for`/`while`/`def`; dùng `=` (gán) thay vì `==` (so sánh) '
      + 'trong điều kiện; hoặc ngoặc chưa đóng. Cú pháp JavaScript lẫn vào cũng gây lỗi này: '
      + 'Python không có `&&`, `||`, `!`, `++` — hãy dùng `and`, `or`, `not`, `+= 1`.',
    fix: 'Xem đúng số dòng bên dưới và soát từ đó lùi lên một vài dòng.',
  },
];

/* ============================== chung ============================== */
const COMMON_RULES = [
  {
    key: 'timeout',
    test: /^__timeout__$/,
    title: () => 'Code chạy quá lâu nên bị dừng giữa đường.',
    why: 'Hai khả năng: (1) **vòng lặp vô hạn** — biến điều kiện của `while` không thay đổi mỗi lượt; '
      + '(2) **độ phức tạp quá cao** — lời giải đúng logic nhưng chậm, không kịp với test dữ liệu lớn.',
    fix: 'Chạy lại một test nhỏ bằng nút ▶ trên dòng test đó. Qua được test nhỏ mà trượt test hiệu năng '
      + 'thì vấn đề là độ phức tạp: hãy tìm cách bỏ bớt một vòng lặp (thường bằng `Map`/`Set`).',
  },
  {
    key: 'entry-missing',
    test: /Không tìm thấy hàm/,
    title: () => 'Hệ thống chấm bài không tìm thấy hàm cần nộp.',
    why: 'Tên hàm đã bị đổi hoặc xoá. Bộ chấm gọi đúng tên hàm ghi trong code mẫu, không phải tên nào khác.',
    fix: 'Bấm **Khôi phục code mẫu** để lấy lại đúng khung hàm, rồi viết phần thân bên trong.',
  },
];

/**
 * Giải thích một thông điệp lỗi.
 * @param {string} message  thông điệp lỗi thô từ sandbox
 * @param {'javascript'|'python'} lang
 * @returns {{ key: string, title: string, why: string, fix: string } | null}
 */
export function explainError(message, lang = 'javascript') {
  const msg = String(message || '');
  if (!msg) return null;
  const rules = [...COMMON_RULES, ...(lang === 'python' ? PY_RULES : JS_RULES)];
  for (const r of rules) {
    const m = msg.match(r.test);
    if (!m) continue;
    return { key: r.key, title: r.title(m), why: r.why, fix: r.fix };
  }
  return null;
}

/** Giải thích cho trường hợp hết thời gian (không có message cụ thể). */
export function explainTimeout() {
  return explainError('__timeout__');
}

/** Tra lại phần giải thích từ `key` đã lưu — dùng cho mục "Lỗi bạn hay mắc" ở Sổ tay. */
export function explanationByKey(key) {
  const all = [...COMMON_RULES, ...JS_RULES, ...PY_RULES];
  const r = all.find((x) => x.key === key);
  if (!r) return null;
  // Tiêu đề của một số luật được dựng từ dữ liệu trong regex; ở đây không có thông điệp
  // gốc nên dùng nhãn chung `generic` đã viết sẵn cho từng luật đó.
  let title = r.generic;
  if (!title) { try { title = r.title([]); } catch { title = key; } }
  return { key: r.key, title, why: r.why, fix: r.fix };
}
