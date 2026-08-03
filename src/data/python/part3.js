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
  ],
},
];
