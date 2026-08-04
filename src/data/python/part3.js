/**
 * LỘ TRÌNH PYTHON — MODULE 3: Cấu trúc dữ liệu cốt lõi & Comprehension
 */

export default [
/* ==================================================================== */
{
  id: 'py-data-structures',
  name: 'Cấu trúc dữ liệu cốt lõi & Comprehension',
  en: 'Core Data Structures & Comprehensions',
  icon: '🧺',
  summary: 'list, tuple, dict, set — bạn đã biết Array/Object/Set/Map của JS. Module này dạy ĐÚNG lúc nào dùng cái nào, và vũ khí khiến code Python ngắn gọn hơn JS: comprehension.',
  lesson: `
## 1. Vấn đề gốc

JS có \`Array\`, \`Object\`, \`Map\`, \`Set\`. Python có \`list\`, \`dict\`, \`set\`, \`tuple\` — nhìn tương tự
nhưng **ranh giới sử dụng rõ ràng hơn nhiều**, và Python có một công cụ JS không có ở dạng cú pháp:
**comprehension** — xây dựng list/dict/set trực tiếp từ một biểu thức + vòng lặp, trong một dòng.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript | Python |
|---|---|---|
| Danh sách có thứ tự, sửa được | \`Array\` | \`list\` |
| Danh sách có thứ tự, **không** sửa được | không có sẵn (phải tự đóng băng) | \`tuple\` |
| Bảng băm khoá→giá trị | \`Map\`, hoặc \`Object\` | \`dict\` |
| Tập hợp không trùng lặp | \`Set\` | \`set\` |
| Lấy phần tử con | \`arr.slice(1, 3)\` | \`arr[1:3]\` (cú pháp \`[start:stop:step]\`) |
| Biến đổi từng phần tử | \`arr.map(x => x*2)\` | \`[x*2 for x in arr]\` (**list comprehension**) |
| Lọc phần tử | \`arr.filter(x => x>0)\` | \`[x for x in arr if x>0]\` |
| Map + Filter cùng lúc | \`.filter().map()\` (2 lượt duyệt) | \`[f(x) for x in arr if cond(x)]\` (1 lượt duyệt) |

## 3. Ý tưởng cốt lõi: chọn cấu trúc theo 2 câu hỏi

> **Câu 1: Dữ liệu có cần thay đổi sau khi tạo không?** Không → \`tuple\` (bất biến, nhẹ hơn, dùng được
> làm khoá dict/phần tử set). Có → \`list\`.
>
> **Câu 2: Bạn cần TRA CỨU theo khoá, hay chỉ cần "có mặt hay không"?** Tra theo khoá → \`dict\`. Chỉ cần
> biết có mặt/khử trùng → \`set\`. Cần thứ tự và cho phép trùng → \`list\`/\`tuple\`.

**Bảng độ phức tạp (giống hệt bảng băm JS đã học ở phần thuật toán — cùng một bản chất):**

| Thao tác | list | dict / set |
|---|---|---|
| Tra cứu theo chỉ số | O(1) | — |
| Tìm theo giá trị (\`in\`) | O(n) | O(1) trung bình |
| Thêm cuối | O(1) khấu hao | O(1) |
| Thêm/xoá đầu | O(n) | — |

## 4. Slicing — mạnh hơn \`.slice()\` của JS

Cú pháp tổng quát: \`seq[start:stop:step]\` — hoạt động trên \`list\`, \`tuple\`, \`str\` như nhau.

\`\`\`python
a = [0, 1, 2, 3, 4, 5]
a[1:4]      # [1, 2, 3]      giống arr.slice(1, 4) của JS
a[:3]       # [0, 1, 2]      bỏ trống start = từ đầu
a[3:]       # [3, 4, 5]      bỏ trống stop = tới cuối
a[::2]      # [0, 2, 4]      step=2 — mỗi 2 phần tử lấy 1
a[::-1]     # [5, 4, 3, 2, 1, 0]   step=-1 — ĐẢO NGƯỢC, không cần .reverse()
a[-2:]      # [4, 5]         chỉ số âm đếm từ cuối, giống a.at(-2) trong JS mới
\`\`\`

## 5. Comprehension — vũ khí Python không có tương đương trực tiếp trong JS

\`\`\`python
# List comprehension: [biểu_thức for phần_tử in nguồn if điều_kiện]
squares = [x * x for x in range(10) if x % 2 == 0]     # [0, 4, 16, 36, 64]

# Dict comprehension
lengths = {w: len(w) for w in ["a", "bb", "ccc"]}       # {'a': 1, 'bb': 2, 'ccc': 3}

# Set comprehension
uniq_lens = {len(w) for w in ["a", "bb", "cc", "ddd"]}  # {1, 2, 3}

# Generator expression (giống list comprehension nhưng LƯỜI, không tạo list trong bộ nhớ)
total = sum(x * x for x in range(1_000_000))  # không tạo list 1 triệu phần tử — tiết kiệm RAM
\`\`\`

**Khi nào chọn comprehension thay vì vòng \`for\` thường?** Khi việc bạn làm là **map/filter đơn giản
thành một cấu trúc mới**. Nếu logic bên trong phức tạp (nhiều dòng, nhiều nhánh), viết vòng \`for\` tường
minh vẫn dễ đọc hơn — đừng nhồi mọi thứ vào một dòng comprehension chỉ để "ngắn".

## 6. Unpacking mở rộng với \`*\`

\`\`\`python
first, *middle, last = [1, 2, 3, 4, 5]
# first = 1, middle = [2, 3, 4], last = 5

head, *rest = "hello"    # 'h', ['e','l','l','o']  (str cũng unpack được vì là sequence)
\`\`\`

## 7. Module \`collections\` — bộ công cụ nên biết

\`\`\`python
from collections import Counter, defaultdict, deque

Counter(["a", "b", "a", "c", "a"])       # Counter({'a': 3, 'b': 1, 'c': 1}) — đếm tần suất, 1 dòng
Counter(["a","b","a"]).most_common(1)     # [('a', 2)] — top-k nhiều nhất, khỏi tự viết bucket sort

d = defaultdict(list)                     # dict tự tạo giá trị mặc định khi khoá chưa tồn tại
d["x"].append(1)                          # không cần kiểm tra "if x not in d" trước

dq = deque([1, 2, 3])
dq.appendleft(0)   # O(1) — list.insert(0, ...) là O(n), đây là lý do dùng deque cho hàng đợi 2 đầu
\`\`\`

## 8. Bẫy thường gặp

- **Dùng \`list\` làm khoá dict/phần tử set**: lỗi \`TypeError: unhashable type: 'list'\` — vì list mutable
  không hashable. Cần khoá bất biến thì dùng \`tuple\`.
- **Sửa list trong khi đang duyệt bằng \`for\`**: gây bỏ sót phần tử hoặc lỗi khó hiểu. Muốn lọc, hãy tạo
  list MỚI (comprehension) thay vì \`.remove()\` trong lúc lặp trên chính list đó.
- **So sánh \`dict\`/\`set\` nghĩ là quan tâm thứ tự**: từ Python 3.7, \`dict\` giữ thứ tự CHÈN, nhưng so
  sánh \`==\` giữa hai dict KHÔNG quan tâm thứ tự — chỉ cần cùng cặp khoá-giá trị. \`set\` chưa bao giờ có
  thứ tự.
- **Comprehension lồng quá sâu**: \`[[y for y in row] for row in matrix if ...]\` với nhiều điều kiện dễ
  trở nên khó đọc hơn cả vòng for tường minh — ưu tiên độ rõ ràng hơn độ ngắn.

## 9. Ứng dụng thực tế

- **ETL / xử lý dữ liệu**: comprehension là cách Python "map-reduce" dữ liệu trong một dòng, rất phổ biến
  trong các script xử lý log, CSV, JSON.
- **\`Counter\`** thay thế hoàn toàn mẫu "đếm tần suất bằng Map" đã học ở phần thuật toán JS — cùng ý tưởng,
  ít code hơn.
- **\`deque\`** là cấu trúc chuẩn cho BFS (hàng đợi) và cửa sổ trượt (sliding window) trong Python — vì
  \`list.pop(0)\` là O(n) còn \`deque.popleft()\` là O(1).
`,
  quiz: [
    {
      q: 'Vì sao `{[1,2]: "a"}` (dùng list làm khoá dict) gây lỗi trong Python?',
      options: [
        'Vì dict chỉ chấp nhận khoá là chuỗi',
        'Vì list là kiểu mutable nên không "hashable" — khoá dict/phần tử set bắt buộc phải bất biến',
        'Vì cú pháp dict yêu cầu khoá phải là số nguyên',
        'Đây thực ra không phải lỗi, Python tự động chuyển list thành tuple',
      ],
      answer: 1,
      why: 'Bảng băm (dict/set) cần tính được mã băm (hash) của khoá NGAY KHI THÊM VÀO và mã băm đó không được đổi trong suốt vòng đời — nếu khoá mutable (như list) bị sửa sau khi thêm, bảng băm sẽ hỏng. Python chặn việc này từ đầu bằng cách không cho list hashable. Dùng `tuple` (bất biến) thay thế.',
    },
    {
      q: '`a = [0,1,2,3,4,5]`. Biểu thức nào trả về `[4, 3, 2]`?',
      options: ['`a[4:1:-1]`', '`a[2:5]`', '`a[::-1]`', '`a[4:2]`'],
      answer: 0,
      why: 'Slice `[start:stop:step]` với step âm duyệt ngược. `a[4:1:-1]` bắt đầu tại chỉ số 4 (giá trị 4), lùi dần, DỪNG TRƯỚC chỉ số 1 (không bao gồm) → lấy chỉ số 4, 3, 2 → giá trị [4, 3, 2].',
    },
    {
      q: 'List comprehension `[x for x in range(1000000)]` khác gì generator expression `(x for x in range(1000000))` về hiệu năng bộ nhớ?',
      options: [
        'Không khác gì, cả hai đều tạo list trong bộ nhớ',
        'List comprehension tạo NGAY một list 1 triệu phần tử trong RAM; generator expression tạo một object "lười" (lazy), chỉ sinh từng giá trị khi được yêu cầu — tiết kiệm bộ nhớ nếu chỉ cần duyệt một lượt',
        'Generator expression nhanh hơn vì được biên dịch sẵn',
        'List comprehension chỉ dùng được với range(), generator dùng được với mọi iterable',
      ],
      answer: 1,
      why: 'Đây là điểm khác biệt cốt lõi: `[...]` ép tạo toàn bộ cấu trúc dữ liệu ngay lập tức; `(...)` tạo generator — sinh giá trị theo yêu cầu (lazy evaluation), phù hợp khi bạn chỉ cần duyệt một lần (ví dụ đưa vào `sum()`, `for`) mà không cần giữ toàn bộ trong bộ nhớ.',
    },
    {
      q: 'Vì sao dùng `collections.deque` thay vì `list` để cài đặt hàng đợi (queue) là lựa chọn đúng?',
      options: [
        'deque có cú pháp ngắn hơn list',
        '`list.pop(0)` (lấy ra từ đầu) là O(n) vì phải dịch chuyển mọi phần tử còn lại; `deque.popleft()` là O(1) vì được cài đặt như danh sách liên kết đôi theo khối',
        'deque tự động sắp xếp phần tử',
        'list không hỗ trợ thêm phần tử vào đầu',
      ],
      answer: 1,
      why: 'list được cài đặt bằng mảng liên tục trong bộ nhớ, nên thêm/xoá ở ĐẦU đòi hỏi dịch chuyển toàn bộ phần tử còn lại — O(n). deque tối ưu cho thao tác ở CẢ HAI ĐẦU, đạt O(1) — đúng cấu trúc cho BFS và sliding window.',
    },
    {
      q: 'Đoạn code sau in ra gì?\n\nd = {1: "a", True: "b", 1.0: "c"}\nprint(len(d), d[1])',
      options: ['1 c', '3 a', '2 b', '1 a'],
      answer: 0,
      why: '`dict` xác định hai khoá là "một" khi chúng có cùng `hash()` **và** bằng nhau qua `==`. Trong Python `1 == True == 1.0` và cả ba có cùng hash, nên đây chỉ là MỘT khoá duy nhất: giá trị bị ghi đè lần lượt còn lại `"c"`, và `len(d) == 1`. (Chi tiết tinh tế: object khoá được giữ lại là cái ĐẦU TIÊN, tức số `1`.) Đây là bug thật khi trộn `bool` và `int` làm khoá — ví dụ đếm theo cờ `True/False` lẫn với đếm theo mã số 0/1.',
    },
    {
      q: 'Đoạn code sau in ra gì?\n\na = [1, 2, 3, 4, 5]\na[1:4] = [9]\nprint(a)',
      options: ['[1, 9, 5]', '[1, [9], 4, 5]', '[1, 9, 3, 4, 5]', 'ValueError vì số phần tử không khớp'],
      answer: 0,
      why: 'Gán vào **slice** thay thế cả đoạn `a[1:4]` (ba phần tử 2, 3, 4) bằng nội dung của vế phải — số phần tử hai bên KHÔNG cần bằng nhau, list tự co lại hoặc giãn ra. Khác hẳn `a[1] = [9]` (đặt một list lồng vào ô 1). Chính cơ chế này khiến `a[:] = [...]` trở thành cách chuẩn để ghi đè toàn bộ nội dung một list mà vẫn giữ nguyên object.',
    },
    {
      q: 'Đoạn code sau in ra gì?\n\na = [1, 2, 3]\nb = a\na += [4]\nprint(b)',
      options: ['[1, 2, 3]', '[1, 2, 3, 4]', '[[1, 2, 3], 4]', 'TypeError'],
      answer: 1,
      why: 'Với `list`, `a += x` KHÔNG tương đương `a = a + x`. Toán tử `+=` gọi `__iadd__`, hoạt động như `a.extend(x)` — sửa **tại chỗ** chính object đó, nên `b` (cùng trỏ tới object ấy) cũng thấy `4`. Ngược lại `a = a + [4]` tạo list MỚI và chỉ đổi hướng tên `a`, khi đó `b` vẫn là `[1, 2, 3]`. Với kiểu bất biến (`int`, `str`, `tuple`) thì `+=` luôn tạo object mới vì không thể sửa tại chỗ.',
    },
    {
      q: 'Đoạn code sau in ra gì?\n\nd = {"a": 1, "b": 2}\nprint(1 in d, "a" in d)',
      options: ['True True', 'False True', 'True False', 'False False'],
      answer: 1,
      why: 'Toán tử `in` trên `dict` kiểm tra **khoá**, không phải giá trị — đây là mặc định có chủ đích vì tra cứu khoá là O(1) nhờ bảng băm, còn tìm trong giá trị là O(n). Muốn kiểm tra giá trị phải viết rõ `1 in d.values()`. Bẫy liên quan hay gặp: `{}` là `dict` rỗng chứ không phải `set` rỗng — set rỗng bắt buộc phải viết `set()`.',
    },
  ],
  problems: [
    {
      id: 'py-flatten-unique-sorted',
      title: 'Làm phẳng, khử trùng, sắp xếp',
      en: 'Flatten, Dedupe, Sort',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'flatten_unique_sorted',
      lang: 'python',
      statement: `
Viết hàm \`flatten_unique_sorted(nested)\` nhận vào một danh sách các danh sách số nguyên (\`nested\`),
trả về **một danh sách phẳng**, đã **loại bỏ trùng lặp**, **sắp xếp tăng dần**.

**Ví dụ**
- \`flatten_unique_sorted([[3, 1], [2, 3], [1]])\` → \`[1, 2, 3]\`
- \`flatten_unique_sorted([[5], [5], [5]])\` → \`[5]\`
- \`flatten_unique_sorted([])\` → \`[]\`
`,
      starter: `def flatten_unique_sorted(nested):\n    \n`,
      tests: [
        { args: [[[3, 1], [2, 3], [1]]], expected: [1, 2, 3], name: 'Ví dụ cơ bản' },
        { args: [[[]]], expected: [], name: 'Một danh sách con rỗng' },
        { args: [[]], expected: [], name: 'Không có danh sách con nào' },
        { args: [[[5], [5], [5]]], expected: [5], name: 'Toàn giá trị trùng' },
        { args: [[[-1, 2], [0, -1]]], expected: [-1, 0, 2], name: 'Có số âm' },
      ],
      hints: [
        'Đây là 3 việc riêng biệt: làm phẳng (gộp các danh sách con thành một), khử trùng, sắp xếp. Hãy nghĩ tới cấu trúc dữ liệu nào tự động khử trùng — bạn đã học nó trong bài giảng.',
        'Comprehension lồng có thể làm phẳng trong một dòng: `[x for row in nested for x in row]` — đọc từ trái sang phải giống hai vòng for lồng nhau (vòng ngoài `for row in nested` đứng trước).',
        'Đưa kết quả làm phẳng vào `set(...)` để khử trùng, rồi `sorted(...)` để sắp xếp: `sorted(set(x for row in nested for x in row))`.',
      ],
      diagnostics: [
        { test: '\\.remove\\s*\\(', message: 'Đừng dùng `.remove()` để khử trùng thủ công trong vòng lặp — vừa chậm (O(n) mỗi lần) vừa dễ bug khi sửa list đang duyệt. Hãy dùng `set()`.' },
      ],
      approach: `
Bài này luyện đúng "câu hỏi 2" trong bài giảng: **cần khử trùng → nghĩ ngay tới \`set\`**, hoàn toàn giống
mẫu hình \`Set\` trong phần thuật toán JS bạn đã học — Python chỉ đổi tên và cú pháp.

**Làm phẳng bằng comprehension lồng:**
\`\`\`python
flat = [x for row in nested for x in row]
\`\`\`
Đọc thứ tự giống hai vòng \`for\` lồng nhau viết bình thường:
\`\`\`python
flat = []
for row in nested:
    for x in row:
        flat.append(x)
\`\`\`

**Khử trùng + sắp xếp:** \`sorted(set(flat))\` — \`set()\` loại trùng trong O(n) trung bình, \`sorted()\`
trả về **list** đã sắp (khác với \`list.sort()\` sửa tại chỗ, \`sorted()\` luôn trả về list mới, hoạt động
được trên cả set/dict/bất kỳ iterable nào).
`,
      solution: `def flatten_unique_sorted(nested):
    flat = [x for row in nested for x in row]
    return sorted(set(flat))`,
      complexity: {
        question: 'Với tổng cộng n phần tử trong tất cả danh sách con, độ phức tạp thời gian của flatten_unique_sorted?',
        options: ['O(n)', 'O(n log n) — chi phối bởi bước sorted() ở cuối', 'O(n²)', 'O(log n)'],
        answer: 1,
        why: 'Làm phẳng O(n), đưa vào set khử trùng O(n) trung bình, nhưng sorted() cần O(n log n) — đây là bước chi phối tổng độ phức tạp.',
      },
      realWorld: 'Gộp danh sách tag/category từ nhiều nguồn (mỗi sản phẩm có một danh sách tag riêng) thành một danh sách tag duy nhất, không trùng, để hiển thị bộ lọc trên trang danh mục.',
    },
    {
      id: 'py-word-frequencies',
      title: 'Đếm tần suất từ',
      en: 'Word Frequencies',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'word_frequencies',
      lang: 'python',
      statement: `
Viết hàm \`word_frequencies(text)\` đếm số lần xuất hiện của mỗi từ trong \`text\`, trả về một \`dict\`
khoá là từ (chữ thường), giá trị là số lần xuất hiện.

**Quy tắc tách từ:** một "từ" là một dãy liên tiếp các ký tự chữ/số/gạch dưới (không tính dấu câu, khoảng
trắng làm một phần của từ). Không phân biệt hoa thường.

**Ví dụ**
- \`word_frequencies("Hello world hello")\` → \`{"hello": 2, "world": 1}\`
- \`word_frequencies("One, two two; three-three three")\` → \`{"one": 1, "two": 2, "three": 3}\`
- \`word_frequencies("")\` → \`{}\`
`,
      starter: `import re\n\ndef word_frequencies(text):\n    \n`,
      tests: [
        { args: ['Hello world hello'], expected: { hello: 2, world: 1 }, name: 'Ví dụ cơ bản, không phân biệt hoa thường' },
        { args: [''], expected: {}, name: 'Chuỗi rỗng' },
        { args: ['A a A a.'], expected: { a: 4 }, name: 'Dấu câu bị bỏ qua' },
        { args: ['One, two two; three-three three'], expected: { one: 1, two: 2, three: 3 }, name: 'Dấu gạch ngang tách thành 2 từ riêng' },
      ],
      checkerSrc: 'lambda got, exp, args: isinstance(got, dict) and got == exp',
      hints: [
        'Module `re` (regular expression) có sẵn trong thư viện chuẩn Python. `re.findall(r"\\w+", text)` trả về danh sách mọi dãy ký tự chữ/số/gạch dưới liên tiếp — chính là định nghĩa "từ" của đề bài.',
        'Đừng quên chuyển toàn bộ về chữ thường TRƯỚC KHI đếm — có thể `.lower()` cả `text` từ đầu, hoặc `.lower()` từng từ sau khi tách.',
        'Với danh sách các từ đã chuẩn hoá, `collections.Counter(words)` đếm tần suất trong một dòng và trả về đối tượng hoạt động gần như dict — nếu muốn chắc chắn là dict thuần, bọc thêm `dict(Counter(words))`.',
      ],
      diagnostics: [
        { test: '\\.split\\s*\\(\\s*\\)', message: '`text.split()` chỉ tách theo khoảng trắng — không loại bỏ dấu câu dính liền từ (vd "hello," vẫn còn dấu phẩy). Hãy dùng `re.findall(r"\\w+", text)` để tách đúng theo định nghĩa "từ" của đề bài.' },
      ],
      approach: `
**Bước 1 — Tách từ đúng cách.** \`str.split()\` chỉ cắt theo khoảng trắng, để lại dấu câu dính vào từ
(\`"hello,"\` vẫn còn dấu phẩy, khác \`"hello"\`). Regex \`\\w+\` định nghĩa "từ" chính xác theo đề bài: một
dãy liên tiếp ký tự chữ/số/gạch dưới, tự động bỏ qua dấu câu và khoảng trắng làm ranh giới.

\`\`\`python
import re
words = re.findall(r"\\w+", text.lower())
\`\`\`

**Bước 2 — Đếm.** Đây chính là mẫu hình "đếm tần suất bằng Map" trong phần thuật toán JS, chỉ đổi công cụ:

\`\`\`python
from collections import Counter
return dict(Counter(words))
\`\`\`

**Vì sao trả về dict thuần thay vì để nguyên \`Counter\`?** \`Counter\` là **subclass** của \`dict\` (thêm
vài phương thức tiện ích như \`.most_common()\`), nên về hành vi so sánh \`==\` với dict thường hoạt động
đúng — nhưng bọc \`dict(...)\` giúp kiểu trả về rõ ràng, đúng như chữ ký hàm cam kết.
`,
      solution: `import re
from collections import Counter

def word_frequencies(text):
    words = re.findall(r"\\w+", text.lower())
    return dict(Counter(words))`,
      complexity: {
        question: 'Với văn bản dài n ký tự, độ phức tạp thời gian của word_frequencies?',
        options: ['O(1)', 'O(n) — regex quét qua từng ký tự một lần, đếm mỗi từ O(1) khấu hao', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: 'Việc quét regex để tách từ là tuyến tính theo độ dài văn bản; đếm bằng Counter/dict là O(1) khấu hao cho mỗi từ. Tổng cộng O(n).',
      },
      realWorld: 'Phân tích tần suất từ khoá trong tìm kiếm, tạo "word cloud", lọc spam/nội dung theo tần suất từ nhạy cảm, tiền xử lý văn bản cho các mô hình NLP cơ bản (bag-of-words).',
    },
    {
      id: 'py-chunk-list',
      title: 'Chia danh sách thành từng nhóm',
      en: 'Chunk List',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'chunk_list',
      lang: 'python',
      statement: `
Viết hàm \`chunk_list(items, size)\` chia \`items\` thành các nhóm con liên tiếp, mỗi nhóm tối đa
\`size\` phần tử (nhóm cuối có thể ít hơn nếu không chia hết).

**Ví dụ**
- \`chunk_list([1, 2, 3, 4, 5], 2)\` → \`[[1, 2], [3, 4], [5]]\`
- \`chunk_list([1, 2, 3], 3)\` → \`[[1, 2, 3]]\`
- \`chunk_list([], 3)\` → \`[]\`
`,
      starter: `def chunk_list(items, size):\n    \n`,
      tests: [
        { args: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]], name: 'Không chia hết' },
        { args: [[1, 2, 3], 3], expected: [[1, 2, 3]], name: 'Chia hết, 1 nhóm' },
        { args: [[], 3], expected: [], name: 'Danh sách rỗng' },
        { args: [[1, 2, 3, 4], 1], expected: [[1], [2], [3], [4]], name: 'size = 1' },
        { args: [[1, 2, 3, 4, 5, 6], 4], expected: [[1, 2, 3, 4], [5, 6]], name: 'Nhóm cuối ngắn hơn' },
      ],
      hints: [
        'Bạn cần một chỉ số `i` nhảy theo bước `size`: 0, size, 2*size, ... Hàm dựng sẵn nào của Python cho phép lặp với bước nhảy tuỳ ý?',
        '`range(0, len(items), size)` sinh ra đúng các chỉ số bắt đầu của từng nhóm: 0, size, 2*size, ...',
        'Với mỗi chỉ số bắt đầu `i`, nhóm tương ứng là slice `items[i:i+size]` — slicing tự động cắt gọn ở cuối nếu không đủ `size` phần tử, không cần xử lý biên thủ công. Gộp lại bằng comprehension: `[items[i:i+size] for i in range(0, len(items), size)]`.',
      ],
      diagnostics: [
        { test: 'while[\\s\\S]{0,120}\\+=\\s*size', message: 'Cách này đúng nhưng dài dòng — Python có `range(0, len(items), size)` sinh sẵn các điểm bắt đầu của từng nhóm, kết hợp với slicing sẽ ngắn gọn hơn nhiều.' },
      ],
      approach: `
Bài này luyện phối hợp hai công cụ: **\`range\` với bước nhảy (step)** và **slicing tự động cắt gọn**.

\`range(start, stop, step)\` không chỉ đếm 1-1 — tham số thứ ba cho phép nhảy cách. \`range(0, 5, 2)\` sinh
ra \`0, 2, 4\`. Với bài này, ta muốn nhảy đúng \`size\` bước mỗi lần để lấy vị trí BẮT ĐẦU của từng nhóm:

\`\`\`python
range(0, len(items), size)   # 0, size, 2*size, ... — điểm bắt đầu mỗi nhóm
\`\`\`

**Vì sao không cần xử lý riêng nhóm cuối bị thiếu?** Vì slicing Python **không bao giờ báo lỗi vượt biên**
— \`items[i:i+size]\` khi \`i+size\` vượt quá độ dài danh sách sẽ tự động chỉ lấy tới hết danh sách, không
cần \`if\` kiểm tra biên như khi thao tác bằng chỉ số thủ công (điều mà JS's \`array.slice()\` cũng làm
tương tự — nhưng ở Python, việc "gộp range bước nhảy + slice" biến bài toán 2 chiều thành một comprehension
duy nhất, gọn hơn).
`,
      solution: `def chunk_list(items, size):
    return [items[i:i + size] for i in range(0, len(items), size)]`,
      complexity: {
        question: 'Với n phần tử trong items, độ phức tạp thời gian VÀ bộ nhớ của chunk_list?',
        options: ['O(n) thời gian, O(n) bộ nhớ — mỗi phần tử được sao chép đúng một lần vào đúng một nhóm', 'O(n log n) thời gian, O(1) bộ nhớ', 'O(n²) thời gian, O(n) bộ nhớ', 'O(1) thời gian, O(1) bộ nhớ'],
        answer: 0,
        why: 'Có n/size nhóm, mỗi slice tốn O(size) để copy — tổng tất cả các slice cộng lại đúng bằng O(n) vì mỗi phần tử gốc chỉ được copy vào đúng một nhóm duy nhất. Bộ nhớ cũng O(n) vì toàn bộ dữ liệu được nhân bản sang cấu trúc mới.',
      },
      realWorld: 'Chia nhỏ dữ liệu để gửi theo lô (batch) tới API có giới hạn số lượng bản ghi mỗi request, phân trang (pagination) danh sách kết quả, chia công việc thành các batch xử lý song song.',
    },
    {
      id: 'py-invert-mapping',
      title: 'Đảo ngược dict mà không mất dữ liệu',
      en: 'Invert a Mapping Safely',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'invert_mapping',
      lang: 'python',
      statement: `
Viết hàm \`invert_mapping(d)\` đảo ngược một dict: giá trị trở thành khoá, khoá trở thành **danh sách** các
khoá cũ có cùng giá trị đó.

- Thứ tự các khoá trong mỗi danh sách phải theo đúng **thứ tự xuất hiện** trong dict gốc.
- Không được sửa dict gốc.

**Ví dụ**
- \`invert_mapping({"an": "sales", "binh": "sales", "cuong": "tech"})\`
  → \`{"sales": ["an", "binh"], "tech": ["cuong"]}\`
- \`invert_mapping({})\` → \`{}\`

> Cách viết một dòng \`{v: k for k, v in d.items()}\` trông rất Pythonic — và làm **mất dữ liệu** ngay khi
> có hai khoá trùng giá trị. Bài này bắt đúng chỗ đó.
`,
      starter: `def invert_mapping(d):\n    # Trả về dict: giá trị cũ -> danh sách các khoá cũ\n    \n`,
      checkerSrc: 'lambda got, exp, args: isinstance(got, dict) and got == exp',
      tests: [
        { args: [{ an: 'sales', binh: 'sales', cuong: 'tech' }], expected: { sales: ['an', 'binh'], tech: ['cuong'] }, name: 'Hai khoá trùng giá trị' },
        { args: [{}], expected: {}, name: 'Dict rỗng' },
        { args: [{ a: 'x' }], expected: { x: ['a'] }, name: 'Một cặp duy nhất' },
        { args: [{ k1: 'v', k2: 'v', k3: 'v' }], expected: { v: ['k1', 'k2', 'k3'] }, name: 'Ba khoá cùng một giá trị' },
        { args: [{ a: 'p', b: 'q', c: 'p', d: 'q' }], expected: { p: ['a', 'c'], q: ['b', 'd'] }, name: 'Hai nhóm xen kẽ — kiểm tra thứ tự' },
        { args: [{ x: 'x', y: 'y' }], expected: { x: ['x'], y: ['y'] }, name: 'Khoá và giá trị trùng tên nhau' },
      ],
      hints: [
        'Vấn đề cốt lõi: một giá trị có thể ứng với NHIỀU khoá, nên đích đến không phải `value -> key` mà là `value -> danh sách key`. Cấu trúc kết quả quyết định cách viết vòng lặp.',
        'Duyệt `for key, value in d.items()`. Với mỗi cặp: nếu `value` chưa có trong dict kết quả thì tạo danh sách rỗng, rồi `append(key)` vào danh sách đó.',
        'Hai cách gọn: `out.setdefault(value, []).append(key)` (dict thường), hoặc `out = defaultdict(list)` rồi `out[value].append(key)` — nhớ `return dict(out)` để trả về dict thường. Dict giữ thứ tự chèn từ Python 3.7 nên thứ tự trong danh sách tự động đúng.',
      ],
      diagnostics: [
        { test: '\\{\\s*v\\w*\\s*:\\s*k\\w*\\s+for', message: 'Dict comprehension đảo trực tiếp `{v: k for k, v in d.items()}` chỉ giữ lại khoá CUỐI CÙNG của mỗi giá trị trùng nhau — dữ liệu bị mất âm thầm. Kết quả cần là `value -> danh sách key`.' },
        { test: '\\.append\\s*\\(\\s*value\\s*\\)|\\.append\\s*\\(\\s*v\\s*\\)', message: 'Bạn đang thêm GIÁ TRỊ vào danh sách, nhưng đề yêu cầu ngược lại: giá trị cũ làm khoá mới, còn danh sách chứa các KHOÁ cũ.' },
      ],
      approach: `
Bài này dạy một phản xạ thiết kế quan trọng: **quan hệ 1-1 khi đảo chiều thường trở thành 1-nhiều.**
Nhân viên → phòng ban là 1-1, nhưng phòng ban → nhân viên là 1-nhiều. Nếu bạn giữ nguyên kiểu dữ liệu khi
đảo chiều, bạn sẽ mất dữ liệu.

\`\`\`python
d = {"an": "sales", "binh": "sales"}
{v: k for k, v in d.items()}      # {'sales': 'binh'} — "an" biến mất, không báo lỗi
\`\`\`

**Lời giải với \`setdefault\`:**

\`\`\`python
def invert_mapping(d):
    out = {}
    for key, value in d.items():
        out.setdefault(value, []).append(key)
    return out
\`\`\`

\`setdefault(value, [])\` trả về danh sách đang có nếu khoá đã tồn tại, ngược lại chèn \`[]\` rồi trả về
chính nó — nên \`.append\` luôn tác động đúng danh sách cần thiết.

**Lời giải với \`defaultdict\`** (thường được ưa hơn khi vòng lặp dài):

\`\`\`python
from collections import defaultdict

def invert_mapping(d):
    out = defaultdict(list)
    for key, value in d.items():
        out[value].append(key)
    return dict(out)
\`\`\`

Khác biệt tinh tế đáng nhớ: \`setdefault(value, [])\` **luôn tạo ra một list rỗng mới** ở mỗi vòng lặp
(rồi vứt đi nếu khoá đã tồn tại), vì Python tính đối số trước khi gọi hàm. \`defaultdict\` chỉ gọi
\`list()\` khi thật sự thiếu khoá — hiệu quả hơn khi giá trị mặc định tốn kém.
`,
      solution: `def invert_mapping(d):
    out = {}
    for key, value in d.items():
        out.setdefault(value, []).append(key)
    return out`,
      complexity: {
        question: 'Độ phức tạp thời gian của invert_mapping theo số cặp n trong dict?',
        options: ['O(n) — mỗi cặp được xử lý một lần, tra cứu/chèn dict là O(1) trung bình', 'O(n²) vì phải kiểm tra khoá đã tồn tại chưa', 'O(n log n)', 'O(1)'],
        answer: 0,
        why: 'Vòng lặp chạy đúng n lần; `setdefault` và `append` đều là O(1) trung bình (bảng băm + thêm cuối list). Nếu thay `setdefault` bằng cách kiểm tra `if value in list(out.keys())` thì mới thành O(n²) — một lỗi hiệu năng hay gặp.',
      },
      realWorld: 'Xây "chỉ mục ngược" (inverted index): từ khoá → danh sách tài liệu chứa từ đó (nền tảng của mọi công cụ tìm kiếm), nhóm nhân viên theo phòng ban, nhóm đơn hàng theo trạng thái, dựng danh sách kề (adjacency list) cho đồ thị từ danh sách cạnh.',
    },
    {
      id: 'py-rotate-left',
      title: 'Xoay danh sách bằng slicing',
      en: 'Rotate List Left',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'rotate_left',
      lang: 'python',
      statement: `
Viết hàm \`rotate_left(items, k)\` trả về **danh sách mới** là kết quả xoay \`items\` sang trái \`k\` bước.

- \`k\` có thể lớn hơn độ dài danh sách, hoặc **âm** (xoay sang phải).
- Danh sách rỗng thì trả về danh sách rỗng.
- Không được sửa \`items\` gốc.

**Ví dụ**
- \`rotate_left([1, 2, 3, 4, 5], 2)\` → \`[3, 4, 5, 1, 2]\`
- \`rotate_left([1, 2, 3, 4, 5], 7)\` → \`[3, 4, 5, 1, 2]\` (7 bước = 1 vòng + 2 bước)
- \`rotate_left([1, 2, 3, 4, 5], -1)\` → \`[5, 1, 2, 3, 4]\`
`,
      starter: `def rotate_left(items, k):\n    # Trả về danh sách MỚI đã xoay trái k bước\n    \n`,
      tests: [
        { args: [[1, 2, 3, 4, 5], 2], expected: [3, 4, 5, 1, 2], name: 'Xoay trái 2 bước' },
        { args: [[1, 2, 3, 4, 5], 0], expected: [1, 2, 3, 4, 5], name: 'Không xoay' },
        { args: [[1, 2, 3, 4, 5], 5], expected: [1, 2, 3, 4, 5], name: 'Đúng một vòng' },
        { args: [[1, 2, 3, 4, 5], 7], expected: [3, 4, 5, 1, 2], name: 'k lớn hơn độ dài' },
        { args: [[1, 2, 3, 4, 5], -1], expected: [5, 1, 2, 3, 4], name: 'k âm — xoay phải' },
        { args: [[1, 2], -3], expected: [2, 1], name: 'k âm và lớn hơn độ dài' },
        { args: [[], 3], expected: [], name: 'Danh sách rỗng — cẩn thận chia cho 0' },
        { args: [[9], 4], expected: [9], name: 'Một phần tử' },
      ],
      hints: [
        'Xoay trái k bước nghĩa là: lấy phần từ vị trí k tới hết, ghép với phần từ đầu tới vị trí k. Bằng slicing: `items[k:] + items[:k]`.',
        'Với k lớn hơn độ dài (hoặc âm), hãy quy k về khoảng hợp lệ trước bằng `k %= len(items)`. Nhờ quy tắc số dư của Python, phép này xử lý luôn cả k âm mà không cần thêm nhánh `if`.',
        'Bẫy còn lại: `len(items)` bằng 0 sẽ khiến `%` raise `ZeroDivisionError`. Xử lý danh sách rỗng NGAY từ đầu bằng `if not items: return []`.',
      ],
      diagnostics: [
        { test: '\\.pop\\s*\\(\\s*0\\s*\\)|\\.insert\\s*\\(\\s*0', message: 'Xoay bằng `pop(0)` / `insert(0, x)` lặp k lần là O(n × k) vì mỗi thao tác ở đầu list phải dịch chuyển toàn bộ phần còn lại. Slicing cho lời giải O(n) trong một dòng.' },
        { test: 'items\\s*\\[\\s*:\\s*\\]\\s*=|\\.reverse\\s*\\(\\s*\\)', message: 'Đề yêu cầu trả về danh sách MỚI và không sửa `items` gốc. `items[:] = ...` và `items.reverse()` đều sửa tại chỗ object của người gọi.' },
      ],
      approach: `
Slicing của Python mạnh hơn \`.slice()\` của JavaScript ở chỗ nó **luôn tạo bản sao mới** và ghép được
trực tiếp bằng \`+\`, nên toàn bộ phép xoay gói gọn trong một biểu thức:

\`\`\`python
def rotate_left(items, k):
    if not items:
        return []
    k %= len(items)
    return items[k:] + items[:k]
\`\`\`

**Ba cái bẫy được cài sẵn trong bộ test:**

1. **k lớn hơn độ dài.** Không normalize thì \`items[7:]\` cho \`[]\` — kết quả trả về nguyên danh sách cũ,
   sai. \`k %= len(items)\` giải quyết gọn.
2. **k âm.** Nhờ \`%\` của Python luôn trả kết quả không âm khi số chia dương, \`-1 % 5 == 4\` — xoay trái
   4 bước đúng bằng xoay phải 1 bước. Không cần nhánh \`if k < 0\` nào cả.
3. **Danh sách rỗng.** \`k % 0\` raise \`ZeroDivisionError\`. Phải chặn trước.

**Vì sao trả về danh sách mới thay vì sửa tại chỗ?** Vì hàm này là một phép **biến đổi thuần**
(pure transformation) — người gọi thường vẫn cần dữ liệu gốc. Đây là lựa chọn thiết kế ngược với bài
"xoá số chẵn tại chỗ" ở module trước, và điều quan trọng là bạn **nói rõ trong tài liệu hàm** mình chọn
kiểu nào; hàm vừa sửa tại chỗ vừa trả về giá trị mới là nguồn nhầm lẫn kinh điển.
`,
      solution: `def rotate_left(items, k):
    if not items:
        return []
    k %= len(items)
    return items[k:] + items[:k]`,
      complexity: {
        question: 'Độ phức tạp thời gian và bộ nhớ của lời giải dùng slicing, theo độ dài n?',
        options: [
          'Thời gian O(n), bộ nhớ O(n) — hai lát cắt cùng nhau copy đúng n phần tử vào danh sách mới',
          'Thời gian O(1), bộ nhớ O(1) vì slicing chỉ tạo "view" chứ không copy',
          'Thời gian O(k), bộ nhớ O(k)',
          'Thời gian O(n log n)',
        ],
        answer: 0,
        why: 'Khác với NumPy (slicing tạo view chia sẻ bộ nhớ), slicing trên `list` của Python LUÔN copy. Hai lát `items[k:]` và `items[:k]` cộng lại đúng n phần tử, và phép `+` tạo thêm một list chứa cả n phần tử đó → O(n) thời gian và O(n) bộ nhớ phụ.',
      },
      realWorld: 'Xoay vòng danh sách máy chủ trong load balancer round-robin, dịch chuyển cửa sổ dữ liệu theo thời gian trong biểu đồ, xoay bàn phím/mã Caesar, và luân phiên ca trực. Chi tiết chuẩn hoá `k % n` là thứ luôn bị quên khi tham số đến từ người dùng.',
    },
  ],
},
];
