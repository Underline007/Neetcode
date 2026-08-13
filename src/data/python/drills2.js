/**
 * BÀI LUYỆN CÚ PHÁP — MODULE 6..10
 *   6. py-strings-regex      7. py-exceptions        8. py-file-io
 *   9. py-packaging         10. py-context-managers
 *
 * Xem drills.js để biết cách các bài này được ghép vào module.
 */

/* ==================================================================== */
/* MODULE 6 — py-strings-regex                                           */
/* ==================================================================== */
const PY_STRINGS_REGEX = [
  {
    id: 'py-drill-normalize-name',
    title: 'Chuẩn hoá khoảng trắng trong tên',
    en: 'Normalize Whitespace',
    difficulty: 'Easy',
    targetMinutes: 6,
    entry: 'normalize_name',
    lang: 'python',
    statement: `
Viết hàm \`normalize_name(text)\` dọn sạch một cái tên do người dùng nhập:

- bỏ khoảng trắng ở hai đầu
- **gộp nhiều khoảng trắng liên tiếp thành một**
- viết hoa chữ đầu mỗi từ

**Ví dụ**
- \`normalize_name("  nguyen   van a ")\` → \`"Nguyen Van A"\`
- \`normalize_name("AN")\` → \`"An"\`
- \`normalize_name("   ")\` → \`""\`

> Bài này giải được bằng **một dòng**, không cần regex, không cần vòng lặp.
`,
    starter: `def normalize_name(text):\n    # Bo khoang trang thua, viet hoa chu dau moi tu\n    \n`,
    tests: [
      { args: ['  nguyen   van a '], expected: 'Nguyen Van A', name: 'Khoảng trắng thừa ở mọi chỗ' },
      { args: ['AN'], expected: 'An', name: 'Đang viết hoa hết' },
      { args: [''], expected: '', name: 'Chuỗi rỗng' },
      { args: ['   '], expected: '', name: 'Chỉ có khoảng trắng' },
      { args: ['tran\tbinh'], expected: 'Tran Binh', name: 'Ký tự tab cũng là khoảng trắng' },
      { args: ['le  thi   c'], expected: 'Le Thi C', name: 'Nhiều từ' },
    ],
    hints: [
      '`text.split()` **không có đối số** thì tách theo mọi loại khoảng trắng (dấu cách, tab, xuống dòng) và **tự bỏ các ô rỗng** — khác hẳn `text.split(" ")`.',
      '`" ".join(danh_sach)` nối các phần tử lại, chèn đúng một dấu cách giữa chúng. Ghép hai bước: `" ".join(text.split())`.',
      'Cuối cùng gọi `.title()` để hoa chữ đầu mỗi từ. Với chuỗi rỗng, cả `split()`, `join()` và `title()` đều trả về rỗng — không cần `if`.',
    ],
    diagnostics: [
      { test: '\\.split\\s*\\(\\s*["\']\\s+["\']\\s*\\)', message: '`split(" ")` giữ lại các ô RỖNG khi có hai dấu cách liền nhau: `"a  b".split(" ")` ra `["a", "", "b"]`. Gọi `split()` không đối số mới bỏ được ô rỗng.' },
      { test: '\\.replace\\s*\\(\\s*["\']\\s\\s["\']', message: '`replace("  ", " ")` chỉ gộp được hai dấu cách thành một — ba dấu cách vẫn còn sót. `split()` + `join()` xử lý mọi số lượng khoảng trắng trong một lần.' },
      { test: 'while[\\s\\S]{0,80}replace', message: 'Lặp `replace` tới khi hết khoảng trắng đôi thì chạy đúng nhưng phải quét lại chuỗi nhiều lần. `" ".join(text.split())` chỉ quét một lần.' },
    ],
    approach: `
**Cặp bài trùng \`split()\` + \`join()\`**

\`\`\`python
def normalize_name(text):
    return " ".join(text.split()).title()
\`\`\`

Đọc từ trong ra ngoài:

1. \`text.split()\` — tách thành danh sách các "từ". Không đối số nghĩa là: tách theo **bất kỳ**
   khoảng trắng nào (\` \`, \`\\t\`, \`\\n\`) và **bỏ hết ô rỗng**.

   \`\`\`python
   "  a   b ".split()      # ['a', 'b']
   "  a   b ".split(" ")   # ['', '', 'a', '', '', 'b', '']  ← rất khác!
   \`\`\`

2. \`" ".join([...])\` — nối lại, chèn dấu cách giữa các phần tử. Chú ý cú pháp hơi lạ: **dấu phân
   cách đứng trước**, \`join\` là phương thức của chuỗi phân cách chứ không phải của list.

3. \`.title()\` — hoa chữ đầu mỗi từ.

**Vì sao \`join\` mà không phải cộng dồn trong vòng lặp?**

\`\`\`python
s = ""
for tu in tu_list:
    s += tu + " "        # đừng làm vậy với dữ liệu lớn
\`\`\`

Chuỗi Python là **bất biến**: mỗi \`s += ...\` tạo một chuỗi mới và copy lại toàn bộ nội dung cũ →
tổng chi phí O(n²). \`join\` biết trước tổng độ dài nên cấp phát một lần rồi copy một lượt → O(n).
Đây là một trong những khác biệt hiệu năng lớn nhất mà người mới hay bỏ qua.

**\`.title()\` và giới hạn của nó**

\`.title()\` coi mọi ký tự không phải chữ là ranh giới từ, nên \`"o'brien".title()\` ra \`"O'Brien"\` và
\`"jean-luc".title()\` ra \`"Jean-Luc"\` (may là đúng), nhưng \`"mcdonald".title()\` ra \`"Mcdonald"\`
(không phải \`"McDonald"\`). Với tên người thật, đừng "sửa" chữ của người ta quá tay — chuẩn hoá
khoảng trắng thì an toàn, chuẩn hoá chữ hoa thì nên cân nhắc.
`,
    solution: `def normalize_name(text):
    return " ".join(text.split()).title()`,
    complexity: {
      question: 'Độ phức tạp thời gian theo độ dài n của chuỗi?',
      options: [
        'O(n) — split quét một lượt, join copy một lượt',
        'O(n²) vì phải nối chuỗi nhiều lần',
        'O(1)',
        'O(n log n) vì phải sắp xếp các từ',
      ],
      answer: 0,
      why: '`split()` đọc từng ký tự đúng một lần; `join()` biết tổng độ dài trước nên cấp phát một lần rồi copy một lượt. Chính việc tránh nối chuỗi lặp đi lặp lại là cách giữ được O(n) thay vì O(n²).',
    },
    realWorld: 'Dọn dữ liệu người dùng nhập từ form, chuẩn hoá tên trước khi so trùng (tránh "Nguyen  Van A" khác "Nguyen Van A"), làm sạch dữ liệu copy-paste từ Excel/Word — nơi luôn có tab và khoảng trắng lạ.',
  },
  {
    id: 'py-drill-is-python-file',
    title: 'Kiểm tra tên file Python',
    en: 'Is It a Python File?',
    difficulty: 'Easy',
    targetMinutes: 6,
    entry: 'is_python_file',
    lang: 'python',
    statement: `
Viết hàm \`is_python_file(name)\` trả về \`True\` khi tên file thoả **cả hai** điều kiện:

- kết thúc bằng \`.py\` — **không phân biệt hoa thường**
- **không** bắt đầu bằng dấu gạch dưới \`_\`

**Ví dụ**
- \`is_python_file("main.py")\` → \`True\`
- \`is_python_file("MAIN.PY")\` → \`True\`
- \`is_python_file("_private.py")\` → \`False\`
- \`is_python_file("notes.txt")\` → \`False\`
`,
    starter: `def is_python_file(name):\n    # Tra ve True/False\n    \n`,
    tests: [
      { args: ['main.py'], expected: true, name: 'Trường hợp thường' },
      { args: ['MAIN.PY'], expected: true, name: 'Viết hoa hết' },
      { args: ['_private.py'], expected: false, name: 'Bắt đầu bằng gạch dưới' },
      { args: ['notes.txt'], expected: false, name: 'Sai đuôi' },
      { args: ['a.pyc'], expected: false, name: 'Đuôi .pyc không phải .py' },
      { args: [''], expected: false, name: 'Tên rỗng' },
      { args: ['Utils.Py'], expected: true, name: 'Hoa thường lẫn lộn' },
    ],
    hints: [
      '`name.endswith(".py")` trả về `True`/`False` — không cần cắt lát hay so sánh chỉ số.',
      'Muốn bỏ qua hoa thường thì hạ chữ trước rồi mới so: `name.lower().endswith(".py")`.',
      'Nối hai điều kiện bằng `and`, và phủ định bằng `not`: `... and not name.startswith("_")`. Kết quả của biểu thức đã là `True`/`False` — `return` thẳng nó, không cần `if/else`.',
    ],
    diagnostics: [
      { test: 'name\\s*\\[\\s*-\\s*3\\s*:\\s*\\]', message: '`name[-3:] == ".py"` chạy được, nhưng `endswith()` đọc rõ ý hơn và không phải đếm số ký tự (đổi sang `.json` là phải sửa số 3 thành 5).' },
      { test: 'if[\\s\\S]{0,120}return\\s+True[\\s\\S]{0,60}return\\s+False', message: 'Biểu thức so sánh đã cho ra `True`/`False` rồi — `return dieu_kien` là đủ, không cần `if ...: return True else: return False`.' },
      { test: 'endswith\\s*\\(\\s*["\']py["\']\\s*\\)', message: 'Thiếu dấu chấm: `endswith("py")` cũng đúng với `"numpy"` hay `"copy"`. Phải là `endswith(".py")`.' },
    ],
    approach: `
**Ba phương thức kiểm tra chuỗi hay dùng nhất**

\`\`\`python
name.startswith("_")     # bắt đầu bằng
name.endswith(".py")     # kết thúc bằng
"@" in email             # có chứa
\`\`\`

Cả ba trả về \`True\`/\`False\` và đọc lên gần như tiếng Anh — đó là lý do nên dùng chúng thay vì
cắt lát rồi so sánh.

**Lời giải**

\`\`\`python
def is_python_file(name):
    return name.lower().endswith(".py") and not name.startswith("_")
\`\`\`

**Ba điểm cú pháp**

1. **Trả về thẳng biểu thức.** \`return a and not b\` — không cần \`if\`. Người mới hay viết
   \`if dieu_kien: return True else: return False\`, dài gấp bốn lần mà không thêm thông tin gì.
2. **\`and\` "chập mạch" (short-circuit).** Nếu điều kiện đầu đã \`False\`, Python không thèm xét
   điều kiện thứ hai. Nhờ vậy khuôn \`if x is not None and x.value > 0\` an toàn — chứ nếu Python
   xét cả hai thì \`None.value\` sẽ nổ.
3. **\`.lower()\` chỉ áp cho phần cần so.** Ở đây ta hạ chữ để so đuôi, nhưng \`startswith("_")\`
   dùng \`name\` gốc — dấu gạch dưới không có hoa thường nên không cần hạ, và giữ bản gốc thì
   không vô tình thay đổi ngữ nghĩa dữ liệu.

**Vì sao \`endswith\` hơn \`name[-3:]\`?**

\`\`\`python
name[-3:] == ".py"       # phải tự đếm 3 ký tự
name.endswith(".py")     # không phải đếm gì
name.endswith((".py", ".pyi"))   # nhận cả TUPLE nhiều đuôi
\`\`\`

Dòng cuối là mẹo ít người biết: \`startswith\`/\`endswith\` nhận một tuple, trả \`True\` nếu khớp
bất kỳ phần tử nào — thay được cho một chuỗi \`or\` dài.

**Trong dự án thật:** việc tách đuôi file nên dùng \`pathlib\`:
\`Path(name).suffix == ".py"\` — nó xử lý đúng các trường hợp rắc rối như \`archive.tar.gz\` hay
đường dẫn có thư mục.
`,
    solution: `def is_python_file(name):
    return name.lower().endswith(".py") and not name.startswith("_")`,
    complexity: {
      question: 'Độ phức tạp thời gian theo độ dài n của tên file?',
      options: [
        'O(n) — `lower()` phải tạo bản sao cả chuỗi',
        'O(1) vì chỉ xem 3 ký tự cuối và 1 ký tự đầu',
        'O(n²)',
        'O(log n)',
      ],
      answer: 0,
      why: 'Bản thân `endswith`/`startswith` chỉ so vài ký tự (O(1) theo độ dài mẫu), nhưng `lower()` tạo một chuỗi MỚI dài bằng chuỗi gốc nên chi phí là O(n). Muốn thật sự O(1) thì so `name[-3:].lower()`.',
    },
    realWorld: 'Lọc file cần xử lý khi quét thư mục (bỏ file tạm `_draft.py`, file build `.pyc`), kiểm tra đuôi file upload, quyết định bộ phân tích nào sẽ đọc file. Quy ước "tên bắt đầu bằng gạch dưới là nội bộ" xuất hiện khắp Python — cả với file, biến và thuộc tính.',
  },
  {
    id: 'py-extract-hashtags',
    title: 'Bóc thẻ hashtag bằng regex',
    en: 'Extract Hashtags',
    difficulty: 'Medium',
    targetMinutes: 12,
    entry: 'extract_hashtags',
    lang: 'python',
    statement: `
Viết hàm \`extract_hashtags(text)\` lấy ra các thẻ hashtag trong một đoạn văn bản:

- thẻ bắt đầu bằng \`#\`, theo sau là **một hoặc nhiều** chữ/số/gạch dưới
- thẻ phải nằm ở **đầu chuỗi hoặc ngay sau một khoảng trắng** (nên \`a#b\` không tính là thẻ)
- kết quả **đổi hết về chữ thường**, **bỏ trùng**, **sắp xếp theo thứ tự chữ cái**

**Ví dụ**

\`\`\`python
extract_hashtags("Yeu #Python va #python #Code")   # ["#code", "#python"]
extract_hashtags("a#b khong tinh")                 # []
\`\`\`
`,
    starter: `import re\n\n\ndef extract_hashtags(text):\n    # Tra ve danh sach the, chu thuong, khong trung, da sap xep\n    \n`,
    tests: [
      { args: ['Yeu #Python va #python #Code'], expected: ['#code', '#python'], name: 'Có thẻ trùng khác hoa thường' },
      { args: ['a#b khong tinh'], expected: [], name: 'Dấu # nằm giữa từ — không tính' },
      { args: ['#Start giua #Giua cuoi #Cuoi'], expected: ['#cuoi', '#giua', '#start'], name: 'Sắp xếp theo chữ cái, không theo thứ tự xuất hiện' },
      { args: ['#123 #abc'], expected: ['#123', '#abc'], name: 'Thẻ toàn số vẫn hợp lệ' },
      { args: [''], expected: [], name: 'Chuỗi rỗng' },
      { args: ['#a\n#b'], expected: ['#a', '#b'], name: 'Xuống dòng cũng là khoảng trắng' },
      { args: ['# khong co chu'], expected: [], name: 'Dấu # đứng một mình' },
    ],
    hints: [
      '`re.findall(mẫu, text)` trả về **list mọi đoạn khớp**. Mẫu cho thẻ là `#\\w+` — `\\w` là "chữ, số hoặc gạch dưới", `+` là "một hoặc nhiều".',
      'Để chặn `a#b`, thêm điều kiện phía trước: `(?:^|\\s)(#\\w+)`. `(?:...)` là nhóm **không bắt giá trị**, `^` là đầu chuỗi, `\\s` là một khoảng trắng. Khi mẫu có nhóm bắt `(...)`, `findall` trả về phần trong nhóm đó.',
      'Bỏ trùng bằng `set`, rồi sắp xếp bằng `sorted()` (luôn trả về list): `sorted({t.lower() for t in the})`.',
    ],
    diagnostics: [
      { test: 'findall\\s*\\(\\s*["\']#', message: 'Chuỗi mẫu regex nên viết dưới dạng **raw string** với chữ `r` phía trước: `r"#\\w+"`. Không có `r`, dấu `\\` trong chuỗi Python có nghĩa riêng và mẫu dễ sai âm thầm.' },
      { test: 'set\\s*\\(', message: 'Dùng `set()` để bỏ trùng là đúng — nhưng nhớ `sorted()` bọc ngoài, vì set KHÔNG có thứ tự và test so sánh theo đúng thứ tự chữ cái.' },
      { test: '\\.sort\\s*\\(\\s*\\)', message: '`.sort()` là phương thức của list, sửa tại chỗ và trả về `None` — nên `return danh_sach.sort()` luôn ra `None`. Với set phải dùng `sorted(...)`.' },
    ],
    approach: `
**Đọc mẫu regex từng ký hiệu**

\`\`\`python
r"(?:^|\\s)(#\\w+)"
  ▲   ▲ ▲   ▲  ▲
  |   | |   |  └── + : một hoặc nhiều lần
  |   | |   └───── \\w : chữ cái, chữ số hoặc _
  |   | └───────── \\s : một ký tự khoảng trắng (space, tab, newline)
  |   └─────────── ^  : đầu chuỗi
  └─────────────── (?: ...) : nhóm KHÔNG bắt giá trị, chỉ để gom lựa chọn
\`\`\`

Còn \`(#\\w+)\` là **nhóm bắt giá trị** — và đây là chi tiết quan trọng:
khi mẫu có nhóm bắt, \`re.findall\` trả về **nội dung nhóm** thay vì cả đoạn khớp. Nhờ vậy ta
không phải tự bỏ đi khoảng trắng đứng trước.

**Vì sao phải có \`r\` trước chuỗi mẫu?**

\`\`\`python
"\\w"    # Python thấy \\w không có nghĩa -> giữ nguyên (may mắn chạy đúng)
"\\b"    # Python hiểu là ký tự BACKSPACE -> regex nhận sai hoàn toàn
r"\\b"   # raw string: giữ đúng hai ký tự \\ và b -> regex hiểu là "ranh giới từ"
\`\`\`

Quy tắc không cần suy nghĩ: **mọi chuỗi regex đều viết \`r"..."\`**.

**Lời giải**

\`\`\`python
import re

def extract_hashtags(text):
    the = re.findall(r"(?:^|\\s)(#\\w+)", text)
    return sorted({t.lower() for t in the})
\`\`\`

\`{t.lower() for t in the}\` là **set comprehension** — cùng cú pháp với list comprehension nhưng
dùng ngoặc nhọn, nên vừa biến đổi vừa bỏ trùng trong một bước. Rồi \`sorted()\` trả về list đã xếp.

**Phân biệt ba hàm \`re\` hay dùng**

| Hàm | Trả về | Dùng khi |
| --- | --- | --- |
| \`re.findall\` | list mọi đoạn khớp | cần lấy hết |
| \`re.search\` | đối tượng khớp ĐẦU TIÊN hoặc \`None\` | chỉ cần tìm có/không |
| \`re.sub\` | chuỗi đã thay thế | cần sửa nội dung |

**Bẫy còn lại của bài:** hai thẻ liền nhau chỉ cách nhau một khoảng trắng, ví dụ \`"#a #b"\`.
Mẫu của ta "ăn" mất khoảng trắng đứng trước thẻ, nên nếu bạn viết \`(\\s|^)#(\\w+)\` mà tìm bằng
vòng lặp thủ công thì dễ bỏ sót thẻ thứ hai. Với \`findall\` thì không sao — nhưng đây là lý do
thực tế người ta hay dùng \`(?<=\\s|^)\` (*lookbehind*, "nhìn lại phía sau mà không ăn ký tự").
`,
    solution: `import re


def extract_hashtags(text):
    the = re.findall(r"(?:^|\\s)(#\\w+)", text)
    return sorted({t.lower() for t in the})`,
    complexity: {
      question: 'Với văn bản dài n ký tự và k thẻ tìm được, độ phức tạp là bao nhiêu?',
      options: [
        'O(n + k log k) — quét văn bản một lượt, rồi sắp xếp k thẻ',
        'O(n) vì regex chạy một lượt',
        'O(n · k)',
        'O(n²) vì regex phải thử lại nhiều lần',
      ],
      answer: 0,
      why: 'Mẫu này đơn giản (không có lồng nhau gây quay lui) nên `findall` quét tuyến tính O(n). Phần `sorted()` trên k thẻ tốn O(k log k). Với regex phức tạp có nhóm lồng và `*` chồng nhau thì mới xảy ra "catastrophic backtracking" và mất tính tuyến tính.',
    },
    realWorld: 'Bóc hashtag/mention từ nội dung mạng xã hội, lấy mã ticket (`#1234`) trong commit message để liên kết tự động, tách các cờ trong một chuỗi lệnh. Yêu cầu "phải đứng sau khoảng trắng" chính là chi tiết phân biệt một bộ bóc tách dùng được với một bộ bóc tách bắt lung tung.',
  },
  {
    id: 'py-render-template',
    title: 'Thay chỗ trống trong khuôn mẫu',
    en: 'Render a Template',
    difficulty: 'Medium',
    targetMinutes: 14,
    entry: 'render',
    lang: 'python',
    statement: `
Viết hàm \`render(template, values)\` thay mọi chỗ trống dạng \`{tên}\` trong \`template\` bằng giá trị
tương ứng trong dict \`values\`:

- tên chỗ trống chỉ gồm chữ/số/gạch dưới
- khoá **không có** trong \`values\` thì **để nguyên** cả \`{tên}\` (không xoá, không báo lỗi)
- giá trị không phải chuỗi thì đổi sang chuỗi

**Ví dụ**

\`\`\`python
render("Xin chao {name}!", {"name": "An"})   # "Xin chao An!"
render("Thieu {x}", {})                      # "Thieu {x}"
render("Gia: {gia} dong", {"gia": 5000})     # "Gia: 5000 dong"
\`\`\`
`,
    starter: `import re\n\n\ndef render(template, values):\n    # Thay {ten} bang values[ten]; khong co khoa thi de nguyen\n    \n`,
    tests: [
      { args: ['Xin chao {name}!', { name: 'An' }], expected: 'Xin chao An!', name: 'Một chỗ trống' },
      { args: ['{a}-{b}', { a: '1', b: '2' }], expected: '1-2', name: 'Hai chỗ trống liền nhau' },
      { args: ['Thieu {x}', {}], expected: 'Thieu {x}', name: 'Không có khoá — để nguyên' },
      { args: ['Khong co gi', { a: '1' }], expected: 'Khong co gi', name: 'Không có chỗ trống nào' },
      { args: ['{n} lan {n}', { n: '3' }], expected: '3 lan 3', name: 'Cùng một khoá xuất hiện hai lần' },
      { args: ['{ khong hop le }', { khong: 'x' }], expected: '{ khong hop le }', name: 'Có khoảng trắng bên trong — không phải chỗ trống' },
      { args: ['Gia: {gia} dong', { gia: 5000 }], expected: 'Gia: 5000 dong', name: 'Giá trị là số' },
      { args: ['{a}{b}', { a: 'x' }], expected: 'x{b}', name: 'Một khoá có, một khoá không' },
    ],
    hints: [
      '`re.sub(mẫu, thay_thế, text)` thay mọi đoạn khớp. Điều ít người biết: `thay_thế` có thể là **một hàm** — Python gọi hàm đó cho từng đoạn khớp và dùng chuỗi nó trả về.',
      'Hàm thay thế nhận một đối tượng *match*. `m.group(1)` là nội dung nhóm bắt thứ nhất (tên khoá), `m.group(0)` là **cả đoạn khớp** — chính là `{tên}` nguyên vẹn để trả lại khi không có khoá.',
      'Mẫu cần thiết: `r"\\{(\\w+)\\}"`. Dấu ngoặc nhọn trong regex có nghĩa riêng (số lần lặp) nên phải thoát bằng `\\{` và `\\}`.',
    ],
    diagnostics: [
      { test: '\\.format\\s*\\(', message: '`str.format()` sẽ raise `KeyError` khi thiếu khoá và không cho bạn quyết định "để nguyên" — đó chính là lý do bài này viết bộ thay thế riêng.' },
      { test: 'for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+values\\.items\\s*\\(\\s*\\)[\\s\\S]{0,120}replace', message: 'Duyệt `values` rồi `replace` từng khoá sẽ không phát hiện được chỗ trống KHÔNG có trong values (nên không giữ nguyên được), và còn nguy cơ thay chồng lên kết quả vừa thay. Hãy duyệt theo các chỗ trống trong template.' },
      { test: 'sub\\s*\\(\\s*r?["\']\\{\\\\?w', message: 'Thiếu thoát dấu ngoặc nhọn: trong regex `{` bắt đầu cú pháp số lần lặp (`a{2,3}`). Mẫu đúng là `r"\\{(\\w+)\\}"`.' },
    ],
    approach: `
**\`re.sub\` với hàm thay thế — công cụ mạnh nhất của module này**

\`\`\`python
import re

def render(template, values):
    def thay(m):
        khoa = m.group(1)              # nội dung trong ngoặc nhọn
        if khoa in values:
            return str(values[khoa])   # thay bằng giá trị
        return m.group(0)              # không có khoá -> trả lại nguyên văn "{khoa}"

    return re.sub(r"\\{(\\w+)\\}", thay, template)
\`\`\`

\`re.sub\` gọi \`thay\` **một lần cho mỗi chỗ khớp**, và ghép các chuỗi trả về vào kết quả. Nhờ đó
bạn quyết định được từng trường hợp — điều mà chuỗi thay thế tĩnh không làm được.

**Đối tượng match có gì?**

\`\`\`python
m.group(0)   # cả đoạn khớp:      "{name}"
m.group(1)   # nhóm bắt thứ nhất: "name"
m.start(), m.end()   # vị trí trong chuỗi gốc
\`\`\`

**Vì sao \`\\{\` phải thoát?**

Trong regex, \`{\` mở cú pháp lặp: \`a{2,3}\` = "a lặp 2 tới 3 lần". Muốn nói "đúng ký tự \`{\`" thì
phải viết \`\\{\`. Danh sách ký tự cần thoát khi muốn hiểu theo nghĩa chữ:
\`. ^ $ * + ? ( ) [ ] { } | \\\` — hoặc dùng \`re.escape(text)\` để Python tự thoát hết.

**Vì sao không dùng \`str.format\`?**

\`\`\`python
"Thieu {x}".format()          # KeyError: 'x'
"Thieu {x}".format_map({})    # cũng KeyError
\`\`\`

Chúng được thiết kế để "thiếu khoá là lỗi" — hợp lý cho code, nhưng sai cho khuôn mẫu do người
dùng nhập (mẫu email, mẫu tin nhắn), nơi một chỗ trống lạ **không nên** làm sập cả hệ thống.
Quy tắc thiết kế: dữ liệu do người dùng cung cấp thì phải xử lý mềm; dữ liệu do lập trình viên
viết thì nên nổ ngay để sửa.

**Vì sao không lặp \`replace\` theo từng khoá?**

\`\`\`python
for k, v in values.items():
    template = template.replace("{" + k + "}", str(v))   # có hai vấn đề
\`\`\`

1. Không cách nào biết còn chỗ trống nào chưa được thay (để giữ nguyên đúng theo đề) — mà cũng
   không biết có chỗ trống lạ nào không.
2. Nguy hiểm hơn: nếu một **giá trị** vừa thay vào lại chứa \`{khoa_khac}\`, vòng lặp sau sẽ thay
   tiếp vào chính giá trị đó — dữ liệu bị hiểu thành khuôn mẫu. Đây là mầm của lỗi *template
   injection*. Cách duyệt theo chỗ trống (\`re.sub\`) chỉ đi một lượt qua template nên miễn nhiễm.
`,
    solution: `import re


def render(template, values):
    def thay(m):
        khoa = m.group(1)
        if khoa in values:
            return str(values[khoa])
        return m.group(0)

    return re.sub(r"\\{(\\w+)\\}", thay, template)`,
    complexity: {
      question: 'Với khuôn mẫu dài n ký tự và k chỗ trống, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(n + k) — quét khuôn một lượt, mỗi chỗ trống tra dict một lần O(1)',
        'O(n · k) vì mỗi chỗ trống phải quét lại cả khuôn',
        'O(n · m) với m là số khoá trong values',
        'O(n²)',
      ],
      answer: 0,
      why: '`re.sub` đi qua chuỗi đúng một lượt và gọi hàm thay thế tại mỗi chỗ khớp; mỗi lần gọi chỉ tra dict (O(1) trung bình). Cách lặp `replace` theo từng khoá mới là O(n·m) vì quét lại cả chuỗi cho mỗi khoá.',
    },
    realWorld: 'Mẫu email/SMS có chỗ trống do người dùng soạn, thay biến trong file cấu hình (`${HOME}`), sinh câu truy vấn có tham số tên. Quy tắc "giữ nguyên khoá lạ" giúp lỗi chính tả của người soạn mẫu hiện ra ngay trong nội dung gửi thử, thay vì làm sập tiến trình gửi hàng loạt.',
  },
];

/* ==================================================================== */
/* MODULE 7 — py-exceptions                                              */
/* ==================================================================== */
const PY_EXCEPTIONS = [
  {
    id: 'py-drill-get-at',
    title: 'Lấy phần tử an toàn bằng try/except',
    en: 'Safe Index Access',
    difficulty: 'Easy',
    targetMinutes: 6,
    entry: 'get_at',
    lang: 'python',
    statement: `
Viết hàm \`get_at(items, i, default)\` trả về \`items[i]\`; nếu chỉ số nằm ngoài phạm vi thì trả về
\`default\` thay vì báo lỗi.

**Ví dụ**
- \`get_at([10, 20, 30], 1, 0)\` → \`20\`
- \`get_at([10], 5, -1)\` → \`-1\`
- \`get_at([1, 2, 3], -1, 0)\` → \`3\` (chỉ số âm vẫn hợp lệ trong Python)
`,
    starter: `def get_at(items, i, default):\n    # Tra ve items[i], hoac default neu chi so ngoai pham vi\n    \n`,
    tests: [
      { args: [[10, 20, 30], 1, 0], expected: 20, name: 'Chỉ số hợp lệ' },
      { args: [[10], 5, -1], expected: -1, name: 'Vượt phạm vi' },
      { args: [[], 0, 'none'], expected: 'none', name: 'Danh sách rỗng' },
      { args: [[1, 2, 3], -1, 0], expected: 3, name: 'Chỉ số âm — phần tử cuối' },
      { args: [[1, 2, 3], -5, 0], expected: 0, name: 'Chỉ số âm vượt phạm vi' },
      { args: [['a', 'b'], 0, 'x'], expected: 'a', name: 'Danh sách chuỗi' },
    ],
    hints: [
      'Khung `try/except`: đặt việc "có thể lỗi" trong `try:`, và cách xử lý khi lỗi trong `except LoạiLỗi:`.',
      'Truy cập ngoài phạm vi list raise `IndexError` — hãy bắt đúng loại đó, đừng bắt `Exception` chung.',
      '`return` được viết trong cả hai khối: `try: return items[i]` và `except IndexError: return default`.',
    ],
    diagnostics: [
      { test: 'except\\s*:', message: '`except:` trơn bắt MỌI thứ, kể cả `KeyboardInterrupt` (bạn bấm Ctrl+C) và lỗi lập trình như gõ sai tên biến — khiến bug bị che mất. Luôn ghi rõ loại: `except IndexError:`.' },
      { test: 'except\\s+Exception', message: '`except Exception` vẫn quá rộng cho bài này: nếu `items` không phải list thì `TypeError` cũng bị nuốt và bạn nhận `default` một cách vô lý. Bắt hẹp nhất có thể: `IndexError`.' },
      { test: 'if\\s+i\\s*<\\s*len\\s*\\(\\s*items\\s*\\)', message: '`if i < len(items)` bỏ sót chỉ số ÂM (`-5` vẫn nhỏ hơn len nhưng vẫn ngoài phạm vi). Muốn kiểm tra trước thì điều kiện đúng phải là `-len(items) <= i < len(items)` — dài và dễ sai hơn `try/except`.' },
    ],
    approach: `
**Khung try/except**

\`\`\`python
def get_at(items, i, default):
    try:
        return items[i]          # việc có thể thất bại
    except IndexError:
        return default           # kế hoạch B
\`\`\`

Đọc: "thử làm việc này; nếu nó raise \`IndexError\` thì làm việc kia". Nếu không có lỗi, khối
\`except\` bị bỏ qua hoàn toàn.

**Vì sao bắt \`IndexError\` chứ không bắt trơn?**

\`\`\`python
except:              # bắt TẤT CẢ — kể cả Ctrl+C và NameError do gõ sai tên
except Exception:    # bắt gần hết lỗi thường — vẫn quá rộng
except IndexError:   # đúng loại lỗi mình dự đoán được
\`\`\`

Nguyên tắc: **bắt hẹp nhất có thể**. Lỗi bạn *không lường trước* thì nên để nó nổ — nổ sớm ở đúng
chỗ dễ sửa hơn nhiều so với việc âm thầm trả về giá trị mặc định rồi sai lệch ở mười bước sau.

**Vì sao \`try/except\` hơn \`if\` kiểm tra trước ở bài này?**

Chỉ số Python đếm được từ hai đầu, nên điều kiện hợp lệ thật sự là
\`-len(items) <= i < len(items)\` — người mới gần như luôn viết thiếu nửa âm. Trong khi đó
\`IndexError\` do chính Python quyết định, nên không thể lệch khỏi luật của Python.

Triết lý này có tên: **EAFP** — *Easier to Ask Forgiveness than Permission* ("cứ làm rồi xin lỗi
dễ hơn xin phép trước"). Ngược lại là **LBYL** (*Look Before You Leap*). Python nghiêng về EAFP,
nhất là khi điều kiện "hợp lệ" khó diễn đạt hoặc dữ liệu có thể đổi giữa lúc kiểm tra và lúc dùng.

**Có sẵn cho dict, chưa có cho list**

\`\`\`python
d.get(key, default)      # dict có sẵn
items.get(i, default)    # AttributeError — list KHÔNG có .get()
\`\`\`

Đó là lý do hàm \`get_at\` này thường được viết tay trong các dự án thật.

**Bốn khối của một câu lệnh try đầy đủ**

\`\`\`python
try:      ...   # việc chính
except:   ...   # khi có lỗi
else:     ...   # khi KHÔNG có lỗi (ít dùng nhưng rất rõ ý)
finally:  ...   # luôn chạy, dù lỗi hay không
\`\`\`
`,
    solution: `def get_at(items, i, default):
    try:
        return items[i]
    except IndexError:
        return default`,
    complexity: {
      question: 'Khi KHÔNG có lỗi, khối `try` làm chậm chương trình bao nhiêu?',
      options: [
        'Gần như bằng 0 — Python chỉ trả giá khi exception thật sự được raise',
        'Tăng gấp đôi thời gian vì phải kiểm tra lỗi mỗi lần',
        'O(n) vì phải quét danh sách để kiểm tra chỉ số',
        'Tuỳ độ dài danh sách',
      ],
      answer: 0,
      why: 'Trong CPython, vào một khối `try` gần như không tốn gì (chi phí đã được chuyển vào bảng xử lý ngoại lệ lúc biên dịch); chỉ khi exception được raise mới tốn kém (phải dựng đối tượng lỗi và truy vết). Vì vậy `try/except` là lựa chọn tốt khi lỗi là trường hợp HIẾM — còn nếu lỗi xảy ra liên tục thì kiểm tra bằng `if` lại nhanh hơn.',
    },
    realWorld: 'Đọc dữ liệu ngoài tầm kiểm soát: dòng CSV thiếu cột, mảng JSON ngắn hơn dự kiến, kết quả API rỗng. Trả `default` là hợp lý khi "thiếu" là chuyện bình thường của dữ liệu — còn nếu thiếu nghĩa là hệ thống sai, hãy để lỗi nổ.',
  },
  {
    id: 'py-drill-check-amount',
    title: 'Tự raise lỗi cho dữ liệu sai',
    en: 'Raise Your Own Errors',
    difficulty: 'Easy',
    targetMinutes: 8,
    entry: 'check_amount',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    try:
        return ["ok", fn(args[0])]
    except Exception as e:
        return [type(e).__name__]`,
    statement: `
Viết hàm \`check_amount(x)\` kiểm tra một số tiền:

- không phải số (\`int\` hoặc \`float\`) → \`raise TypeError\`
- **giá trị \`True\`/\`False\` cũng bị coi là không phải số** → \`raise TypeError\`
- là số nhưng nhỏ hơn 0 → \`raise ValueError\`
- hợp lệ → **trả về chính \`x\`**

Bài chấm bằng cách bắt lỗi và so tên loại lỗi, nên kết quả là \`["ok", x]\` hoặc \`["TypeError"]\` /
\`["ValueError"]\`.
`,
    starter: `def check_amount(x):\n    # raise TypeError / ValueError, hoac tra ve x\n    \n`,
    tests: [
      { args: [5], expected: ['ok', 5], name: 'Số nguyên dương' },
      { args: [0], expected: ['ok', 0], name: 'Bằng 0 vẫn hợp lệ' },
      { args: [2.5], expected: ['ok', 2.5], name: 'Số thực' },
      { args: [-1], expected: ['ValueError'], name: 'Số âm' },
      { args: ['abc'], expected: ['TypeError'], name: 'Chuỗi' },
      { args: [true], expected: ['TypeError'], name: 'True không được coi là số' },
      { args: [null], expected: ['TypeError'], name: 'None' },
    ],
    hints: [
      '`raise TypeError("thông điệp")` phát ra lỗi ngay lập tức và kết thúc hàm — không cần `return` sau đó.',
      '`isinstance(x, (int, float))` kiểm tra x thuộc một trong các kiểu liệt kê. Nhưng cẩn thận: trong Python `bool` là **lớp con của `int`**, nên `isinstance(True, int)` là `True`.',
      'Vì vậy phải loại bool ra trước: `if isinstance(x, bool) or not isinstance(x, (int, float)): raise TypeError(...)`. Kiểm tra kiểu TRƯỚC, kiểm tra giá trị SAU.',
    ],
    diagnostics: [
      { test: 'return\\s+["\']TypeError["\']|return\\s+["\']ValueError["\']', message: 'Đề yêu cầu `raise` (phát ra lỗi) chứ không phải `return` một chuỗi tên lỗi. `raise` mới buộc người gọi phải xử lý; `return "TypeError"` chỉ là một chuỗi bình thường và rất dễ bị bỏ qua.' },
      { test: 'type\\s*\\(\\s*x\\s*\\)\\s*==', message: '`type(x) == int` bỏ mất các lớp con (và không nhận `float` khi bạn chỉ so với `int`). Dùng `isinstance(x, (int, float))` — trừ khi bạn CỐ Ý loại lớp con, như trường hợp `bool` ở bài này.' },
      { test: 'if\\s+x\\s*<\\s*0[\\s\\S]{0,200}isinstance', message: 'Thứ tự sai: nếu kiểm tra `x < 0` trước, đầu vào là chuỗi sẽ raise `TypeError` từ chính phép so sánh — đúng loại lỗi nhưng không phải do bạn kiểm soát, và với `None` thì thông điệp lỗi hoàn toàn khó hiểu. Kiểm tra KIỂU trước.' },
    ],
    approach: `
**\`raise\` — chủ động phát ra lỗi**

\`\`\`python
def check_amount(x):
    if isinstance(x, bool) or not isinstance(x, (int, float)):
        raise TypeError("so tien phai la so")
    if x < 0:
        raise ValueError("so tien khong duoc am")
    return x
\`\`\`

\`raise\` kết thúc hàm ngay và "ném" lỗi lên cho người gọi. Nếu không ai bắt, chương trình dừng và
in traceback.

**Chọn loại lỗi nào?** Quy ước của Python rất rõ:

- \`TypeError\` — **kiểu** dữ liệu sai (đưa chuỗi vào chỗ cần số).
- \`ValueError\` — kiểu đúng nhưng **giá trị** không dùng được (số âm cho số tiền, chuỗi \`"abc"\`
  đưa vào \`int()\`).
- \`KeyError\` / \`IndexError\` — không tìm thấy khoá/chỉ số.
- \`RuntimeError\` — không thuộc loại nào ở trên.

Dùng đúng loại giúp người gọi bắt hẹp được (\`except ValueError\`) mà không phải đọc thông điệp.

**Bẫy lớn: \`bool\` là lớp con của \`int\`**

\`\`\`python
isinstance(True, int)   # True (!)
True + True             # 2
\`\`\`

Đây là di sản lịch sử của Python. Hệ quả thực tế: một hàm nhận số sẽ **âm thầm** chấp nhận \`True\`
như số 1 — và \`check_amount(True)\` trả về \`True\` thay vì báo lỗi. Muốn chặn thì phải kiểm tra
\`isinstance(x, bool)\` **trước**, đúng như đề yêu cầu.

**Vì sao kiểm tra kiểu trước, giá trị sau?**

Nếu đảo lại, \`x < 0\` với \`x = "abc"\` sẽ raise
\`TypeError: '<' not supported between instances of 'str' and 'int'\` — thông điệp nói về phép so
sánh, không nói về "số tiền phải là số". Lỗi do **bạn** raise luôn dễ hiểu hơn lỗi tình cờ xảy ra;
đó là giá trị của việc kiểm tra đầu vào ngay đầu hàm (gọi là *guard clause*).

**Thông điệp lỗi nên viết gì?** Nói rõ *cái gì sai* và *nhận được gì*:

\`\`\`python
raise ValueError(f"so tien khong duoc am, nhan duoc {x}")
\`\`\`

Người đọc log sẽ biết ngay giá trị gây lỗi mà không phải chạy lại chương trình.
`,
    solution: `def check_amount(x):
    if isinstance(x, bool) or not isinstance(x, (int, float)):
        raise TypeError("so tien phai la so")
    if x < 0:
        raise ValueError("so tien khong duoc am")
    return x`,
    complexity: {
      question: 'Chi phí của hàm kiểm tra này là bao nhiêu?',
      options: [
        'O(1) — vài phép kiểm tra kiểu và một phép so sánh',
        'O(n) theo giá trị của x',
        'O(k) với k là số kiểu trong tuple isinstance',
        'Không xác định vì raise rất tốn kém',
      ],
      answer: 0,
      why: '`isinstance` tra cứu kiểu qua chuỗi lớp (rất ngắn, hằng số) và phép so sánh số là O(1). Việc raise có tốn hơn một lời gọi hàm thường, nhưng vẫn là hằng số — và chỉ xảy ra ở trường hợp lỗi.',
    },
    realWorld: 'Kiểm tra đầu vào ở "biên" của hệ thống: tham số API, dữ liệu form, giá trị đọc từ file cấu hình. Raise lỗi đúng loại với thông điệp rõ ràng chính là thứ giúp người gọi (và bạn, sáu tháng sau) sửa nhanh. Bẫy `bool` là số xuất hiện thật khi dữ liệu JSON có `true` ở chỗ đáng lẽ là số lượng.',
  },
  {
    id: 'py-validate-form',
    title: 'Thu hết lỗi của một biểu mẫu',
    en: 'Collect All Form Errors',
    difficulty: 'Medium',
    targetMinutes: 13,
    entry: 'validate',
    lang: 'python',
    checkerSrc: 'lambda got, exp, args: isinstance(got, dict) and got == exp',
    statement: `
Viết hàm \`validate(form)\` kiểm tra một dict biểu mẫu và trả về **dict các lỗi** \`{tên_ô: thông_điệp}\`.
Ô nào hợp lệ thì không xuất hiện trong kết quả; mọi ô hợp lệ → trả về \`{}\`.

Quy tắc (khoá thiếu thì coi như chuỗi rỗng):

| Ô | Điều kiện | Thông điệp khi sai |
| --- | --- | --- |
| \`ten\` | không được rỗng (sau khi bỏ khoảng trắng) | \`khong duoc de trong\` |
| \`tuoi\` | phải đổi được sang số nguyên | \`phai la so nguyen\` |
| \`tuoi\` | và không được âm | \`khong duoc am\` |
| \`email\` | phải chứa ký tự \`@\` | \`phai co ky tu @\` |

**Quan trọng:** phải kiểm tra **hết** các ô rồi trả về tất cả lỗi — không được dừng ở lỗi đầu tiên.
`,
    starter: `def validate(form):\n    # Tra ve dict {ten_o: thong_diep} cua MOI o sai\n    \n`,
    tests: [
      { args: [{ ten: 'An', tuoi: '20', email: 'a@b.c' }], expected: {}, name: 'Hợp lệ hết' },
      { args: [{ ten: '', tuoi: '20', email: 'a@b.c' }], expected: { ten: 'khong duoc de trong' }, name: 'Tên rỗng' },
      { args: [{ ten: '   ', tuoi: '20', email: 'a@b.c' }], expected: { ten: 'khong duoc de trong' }, name: 'Tên chỉ có khoảng trắng' },
      { args: [{ ten: 'An', tuoi: 'abc', email: 'a@b.c' }], expected: { tuoi: 'phai la so nguyen' }, name: 'Tuổi không phải số' },
      { args: [{ ten: 'An', tuoi: '-1', email: 'a@b.c' }], expected: { tuoi: 'khong duoc am' }, name: 'Tuổi âm' },
      { args: [{ ten: 'An', tuoi: '20', email: 'ab.c' }], expected: { email: 'phai co ky tu @' }, name: 'Email thiếu @' },
      { args: [{}], expected: { ten: 'khong duoc de trong', tuoi: 'phai la so nguyen', email: 'phai co ky tu @' }, name: 'Thiếu hết — phải báo cả ba lỗi' },
      { args: [{ ten: '', tuoi: 'x', email: 'y' }], expected: { ten: 'khong duoc de trong', tuoi: 'phai la so nguyen', email: 'phai co ky tu @' }, name: 'Sai cả ba, không được dừng sớm' },
    ],
    hints: [
      '`form.get("ten", "")` lấy giá trị, thiếu khoá thì cho chuỗi rỗng — nhờ vậy không cần `if "ten" in form` riêng.',
      'Với ô `tuoi`, phép `int(...)` có thể raise `ValueError`. Bọc nó trong `try/except ValueError` và ghi lỗi vào dict thay vì để lỗi lan ra ngoài.',
      'Kiểm tra "âm" chỉ có nghĩa khi đổi số thành công → đặt `if tuoi < 0` **bên trong** khối `try`, sau dòng `int(...)`. Đó cũng là chỗ mà khối `else` của `try` hay được dùng.',
    ],
    diagnostics: [
      { test: 'return\\s+\\{[^}]*\\}\\s*$[\\s\\S]*except', message: 'Có vẻ hàm `return` ngay khi gặp lỗi đầu tiên. Đề yêu cầu thu HẾT lỗi: tích luỹ vào một dict rồi `return` một lần ở cuối.' },
      { test: 'except\\s+Exception|except\\s*:', message: 'Ở đây chỉ `int()` mới raise và nó raise `ValueError`. Bắt rộng hơn sẽ che mất lỗi thật (ví dụ `form` không phải dict sẽ thành "tuổi không phải số nguyên").' },
      { test: 'form\\s*\\[\\s*["\']ten["\']\\s*\\]', message: '`form["ten"]` raise `KeyError` khi thiếu khoá — mà test có trường hợp form rỗng. Dùng `form.get("ten", "")`.' },
    ],
    approach: `
**Hai cách xử lý lỗi — chọn theo mục đích**

- **Dừng ngay ở lỗi đầu (fail fast):** \`raise\` lập tức. Phù hợp khi tiếp tục là vô nghĩa hoặc
  nguy hiểm.
- **Thu hết rồi báo một lần:** tích luỹ vào một bộ sưu tập. Phù hợp khi người dùng cần biết **tất
  cả** chỗ phải sửa — không ai muốn sửa form 5 lần để phát hiện 5 lỗi.

Bài này là loại thứ hai, và khuôn của nó rất đáng thuộc:

\`\`\`python
def validate(form):
    loi = {}                                  # 1. bộ tích luỹ

    ten = form.get("ten", "")
    if not ten.strip():
        loi["ten"] = "khong duoc de trong"     # 2. ghi lỗi, KHÔNG return

    try:
        tuoi = int(form.get("tuoi", ""))
        if tuoi < 0:
            loi["tuoi"] = "khong duoc am"
    except ValueError:
        loi["tuoi"] = "phai la so nguyen"

    if "@" not in form.get("email", ""):
        loi["email"] = "phai co ky tu @"

    return loi                                 # 3. trả về một lần
\`\`\`

**\`if not ten.strip()\`** đọc là "nếu bỏ khoảng trắng rồi mà rỗng". Chuỗi rỗng là *falsy* nên
\`not ""\` là \`True\` — không cần so \`== ""\`.

**Vì sao \`int(...)\` phải bọc \`try\`?**

\`int()\` raise \`ValueError\` với \`"abc"\`, với \`""\`, và cả với \`"20.5"\`. Không có "chế độ nhẹ tay"
nào cho \`int()\`, nên đây là chỗ bắt buộc phải \`try\` — hoặc kiểm tra trước bằng
\`text.lstrip("-").isdigit()\` (dài hơn và dễ sót trường hợp).

**Thứ tự bên trong \`try\`**

Dòng \`if tuoi < 0\` nằm **trong** \`try\` vì nó chỉ có nghĩa sau khi \`int()\` thành công. Python còn
cho cách viết rõ ý hơn bằng khối \`else\`:

\`\`\`python
try:
    tuoi = int(form.get("tuoi", ""))
except ValueError:
    loi["tuoi"] = "phai la so nguyen"
else:
    if tuoi < 0:                     # chỉ chạy khi try KHÔNG lỗi
        loi["tuoi"] = "khong duoc am"
\`\`\`

Lợi ích của \`else\`: khối \`try\` chỉ còn đúng **một** dòng có thể raise, nên không có nguy cơ
\`except\` bắt nhầm một \`ValueError\` phát sinh từ dòng khác. Đây là thói quen tốt: **giữ khối
\`try\` nhỏ nhất có thể**.
`,
    solution: `def validate(form):
    loi = {}

    ten = form.get("ten", "")
    if not ten.strip():
        loi["ten"] = "khong duoc de trong"

    try:
        tuoi = int(form.get("tuoi", ""))
    except ValueError:
        loi["tuoi"] = "phai la so nguyen"
    else:
        if tuoi < 0:
            loi["tuoi"] = "khong duoc am"

    if "@" not in form.get("email", ""):
        loi["email"] = "phai co ky tu @"

    return loi`,
    complexity: {
      question: 'Với biểu mẫu có số ô cố định (3 ô), độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(k) với k là tổng độ dài các giá trị — do strip/int/tìm ký tự đều phải đọc chuỗi',
        'O(1) vì chỉ có 3 ô',
        'O(n²)',
        'O(n log n)',
      ],
      answer: 0,
      why: 'Số ô là hằng số, nhưng mỗi phép kiểm tra vẫn phải đọc qua nội dung chuỗi: `strip()` quét hai đầu, `int()` đọc từng chữ số, `in` quét tìm ký tự. Nên chi phí tỉ lệ với tổng độ dài dữ liệu, không phải hằng số tuyệt đối.',
    },
    realWorld: 'Đây đúng là cách mọi thư viện xác thực (Pydantic, Marshmallow, WTForms) hoạt động: chạy hết các quy tắc, gom lỗi theo tên ô, trả về một lượt để giao diện tô đỏ đúng từng ô. Chọn "thu hết" hay "dừng ngay" là quyết định thiết kế — và với dữ liệu do con người nhập thì gần như luôn là "thu hết".',
  },
  {
    id: 'py-custom-error-hierarchy',
    title: 'Cây exception riêng của ứng dụng',
    en: 'Your Own Exception Hierarchy',
    difficulty: 'Medium',
    targetMinutes: 15,
    entry: 'safe_handle',
    lang: 'python',
    statement: `
Tạo một **cây lỗi riêng** cho ứng dụng:

- \`AppError\` — lớp lỗi gốc, kế thừa \`Exception\`
- \`NotFound\` và \`Invalid\` — đều kế thừa \`AppError\`

Viết \`raise_for(kind)\`: \`"notfound"\` → raise \`NotFound\`, \`"invalid"\` → raise \`Invalid\`,
\`"other"\` → raise \`RuntimeError\`, còn lại → trả về \`"ok"\`.

Rồi viết \`safe_handle(kind)\` gọi \`raise_for(kind)\` và:

- bắt được lỗi thuộc cây \`AppError\` → trả về \`"app:"\` + **tên lớp lỗi thật** (vd \`"app:NotFound"\`)
- bắt được lỗi khác → trả về \`"other"\`
- không lỗi → trả về giá trị của \`raise_for\`

**Ví dụ**
- \`safe_handle("notfound")\` → \`"app:NotFound"\`
- \`safe_handle("other")\` → \`"other"\`
- \`safe_handle("gi cung duoc")\` → \`"ok"\`
`,
    starter: `class AppError(Exception):\n    pass\n\n\n# Them NotFound va Invalid ke thua AppError\n\n\ndef raise_for(kind):\n    pass\n\n\ndef safe_handle(kind):\n    pass\n`,
    tests: [
      { args: ['notfound'], expected: 'app:NotFound', name: 'Bắt qua lớp cha, giữ đúng tên lớp con' },
      { args: ['invalid'], expected: 'app:Invalid', name: 'Lớp con thứ hai' },
      { args: ['other'], expected: 'other', name: 'Lỗi ngoài cây AppError' },
      { args: ['fine'], expected: 'ok', name: 'Không lỗi' },
      { args: [''], expected: 'ok', name: 'Chuỗi rỗng — cũng không lỗi' },
      { args: ['NOTFOUND'], expected: 'ok', name: 'So sánh phân biệt hoa thường' },
    ],
    hints: [
      'Định nghĩa lớp lỗi chỉ cần một dòng thân: `class NotFound(AppError): pass`. `pass` là "không làm gì" — cần thiết vì Python không cho phép thân khối rỗng.',
      '`except AppError as e:` bắt được **cả lớp cha và mọi lớp con** — đó chính là điểm của việc tạo cây lỗi. `as e` đặt tên cho đối tượng lỗi để dùng tiếp.',
      '`type(e).__name__` cho tên lớp thật của đối tượng lỗi (`"NotFound"`), khác với `type(e)` (in ra cả `<class ...>`). Thứ tự các khối `except` phải là **hẹp trước, rộng sau**.',
    ],
    diagnostics: [
      { test: 'except\\s+Exception[\\s\\S]{0,200}except\\s+AppError', message: 'Thứ tự sai: `except Exception` đứng trước sẽ bắt luôn cả `AppError` (vì AppError là lớp con của Exception), nên khối `except AppError` bên dưới không bao giờ chạy. Luôn xếp từ HẸP tới RỘNG.' },
      { test: 'class\\s+NotFound\\s*\\(\\s*Exception\\s*\\)', message: '`NotFound` phải kế thừa `AppError`, không phải `Exception` trực tiếp — nếu không, `except AppError` sẽ không bắt được nó và cây lỗi mất ý nghĩa.' },
      { test: 'e\\.__name__|e\\.name', message: 'Đối tượng lỗi không có `__name__`; cái có `__name__` là LỚP. Dùng `type(e).__name__`.' },
    ],
    approach: `
**Vì sao cần lớp lỗi riêng?**

Vì người gọi cần **phân loại** lỗi mà không phải đọc thông điệp:

\`\`\`python
try:
    lay_du_lieu()
except NotFound:
    return 404          # xử lý riêng
except AppError:
    return 400          # mọi lỗi khác của ứng dụng
\`\`\`

Nếu mọi thứ đều là \`Exception("khong tim thay")\` thì code trên phải so sánh chuỗi — vỡ ngay khi
ai đó sửa lại chữ trong thông điệp.

**Định nghĩa cây lỗi**

\`\`\`python
class AppError(Exception):
    pass

class NotFound(AppError):
    pass

class Invalid(AppError):
    pass
\`\`\`

Ba dòng \`pass\` này đã đủ dùng: mọi hành vi (thông điệp, traceback, \`args\`) đều thừa hưởng từ
\`Exception\`. Chỉ khi cần thuộc tính riêng mới viết \`__init__\`:

\`\`\`python
class NotFound(AppError):
    def __init__(self, resource, id):
        super().__init__(f"khong tim thay {resource} id={id}")
        self.resource = resource
        self.id = id
\`\`\`

**Bắt theo lớp cha — điểm mấu chốt**

\`\`\`python
def safe_handle(kind):
    try:
        return raise_for(kind)
    except AppError as e:            # bắt AppError VÀ mọi lớp con của nó
        return "app:" + type(e).__name__
    except Exception:
        return "other"
\`\`\`

\`except AppError\` bắt được \`NotFound\` vì \`isinstance(NotFound(), AppError)\` là \`True\`. Nhờ vậy
bạn thêm lớp lỗi mới mai này mà **không phải sửa** chỗ bắt lỗi — đó là lợi ích thật sự của việc
có một lớp gốc cho riêng ứng dụng.

**Thứ tự \`except\` là từ hẹp tới rộng**

Python thử từng khối \`except\` từ trên xuống và dùng khối **đầu tiên** khớp. Nên đặt
\`except Exception\` lên trước là vô hiệu hoá mọi khối bên dưới — và Python **không** cảnh báo gì.

**\`type(e).__name__\` vs \`e.__class__.__name__\`**

Hai cách này tương đương; \`type(e)\` được ưa dùng hơn. Trong log thật, người ta thường ghi cả hai
phần: \`f"{type(e).__name__}: {e}"\` — tên lớp để phân loại, \`str(e)\` để biết chi tiết.
`,
    solution: `class AppError(Exception):
    pass


class NotFound(AppError):
    pass


class Invalid(AppError):
    pass


def raise_for(kind):
    if kind == "notfound":
        raise NotFound("khong tim thay")
    if kind == "invalid":
        raise Invalid("du lieu sai")
    if kind == "other":
        raise RuntimeError("loi he thong")
    return "ok"


def safe_handle(kind):
    try:
        return raise_for(kind)
    except AppError as e:
        return "app:" + type(e).__name__
    except Exception:
        return "other"`,
    complexity: {
      question: 'Khi một exception được raise và bắt, Python phải làm việc gì tốn kém nhất?',
      options: [
        'Dựng đối tượng lỗi kèm traceback rồi tháo dần các khung hàm — tốn hơn một lời gọi hàm thường nhiều lần',
        'Quét toàn bộ chương trình để tìm khối except phù hợp',
        'Không tốn gì, raise nhanh như return',
        'Sắp xếp lại cây lớp lỗi',
      ],
      answer: 0,
      why: 'Chi phí nằm ở việc tạo đối tượng exception, ghi lại traceback (chuỗi các khung hàm đang chạy) và tháo ngăn xếp tới khối `except` khớp. Việc tìm khối nào khớp thì rẻ — chỉ là kiểm tra `isinstance` theo thứ tự khai báo. Kết luận thực tế: đừng dùng exception cho luồng chạy BÌNH THƯỜNG, lặp hàng triệu lần.',
    },
    realWorld: 'Mọi thư viện lớn đều có cây lỗi riêng: `requests.RequestException` với các lớp con `Timeout`, `ConnectionError`; `sqlalchemy.exc.SQLAlchemyError`. Nhờ đó bạn viết được `except requests.RequestException` để bắt "mọi lỗi mạng" mà không cần liệt kê. Khi tự viết thư viện, hãy tạo một lớp gốc ngay từ đầu — thêm sau sẽ làm vỡ code của người dùng.',
  },
];

/* ==================================================================== */
/* MODULE 8 — py-file-io                                                 */
/* ==================================================================== */
const PY_FILE_IO = [
  {
    id: 'py-drill-count-nonempty',
    title: 'Đếm dòng có nội dung',
    en: 'Count Non-Empty Lines',
    difficulty: 'Easy',
    targetMinutes: 6,
    entry: 'count_nonempty',
    lang: 'python',
    statement: `
Viết hàm \`count_nonempty(text)\` đếm số dòng **có nội dung** trong một khối văn bản.
Dòng rỗng, hoặc dòng chỉ toàn khoảng trắng, đều không tính.

**Ví dụ**
- \`count_nonempty("a\\n\\nb")\` → \`2\`
- \`count_nonempty("  \\nx")\` → \`1\`
- \`count_nonempty("")\` → \`0\`
`,
    starter: `def count_nonempty(text):\n    # Dem so dong co noi dung\n    \n`,
    tests: [
      { args: ['a\n\nb'], expected: 2, name: 'Có một dòng trống ở giữa' },
      { args: [''], expected: 0, name: 'Văn bản rỗng' },
      { args: ['\n\n'], expected: 0, name: 'Chỉ có ký tự xuống dòng' },
      { args: ['  \nx'], expected: 1, name: 'Dòng toàn khoảng trắng không tính' },
      { args: ['a\nb\nc'], expected: 3, name: 'Ba dòng đều có nội dung' },
      { args: ['one line'], expected: 1, name: 'Không có ký tự xuống dòng nào' },
      { args: ['a\n'], expected: 1, name: 'Có xuống dòng ở cuối — không sinh dòng rỗng' },
    ],
    hints: [
      '`text.splitlines()` tách văn bản thành list các dòng, tự bỏ ký tự `\\n` ở cuối mỗi dòng.',
      'Khác biệt quan trọng: `"a\\n".splitlines()` cho `["a"]` (1 phần tử) còn `"a\\n".split("\\n")` cho `["a", ""]` (2 phần tử, có một dòng rỗng ảo).',
      'Dòng "có nội dung" nghĩa là `line.strip()` không rỗng. Chuỗi rỗng là *falsy* nên viết thẳng `if line.strip():`.',
    ],
    diagnostics: [
      { test: '\\.split\\s*\\(\\s*["\']\\\\n["\']\\s*\\)', message: '`split("\\n")` sinh thêm một dòng rỗng ảo khi văn bản kết thúc bằng `\\n` — nó không tính vào kết quả ở bài này nhưng sẽ gây lệch ở các bài khác. `splitlines()` mới xử lý đúng, và còn hiểu cả `\\r\\n` của Windows.' },
      { test: 'if\\s+line\\s*!=\\s*["\']["\']', message: '`line != ""` không loại được dòng chỉ có khoảng trắng (`"   "`). Dùng `if line.strip():`.' },
      { test: 'len\\s*\\(\\s*text\\.splitlines', message: '`len(text.splitlines())` đếm mọi dòng, kể cả dòng rỗng. Bạn cần lọc trước khi đếm.' },
    ],
    approach: `
**\`splitlines()\` — công cụ đúng để tách dòng**

\`\`\`python
def count_nonempty(text):
    dem = 0
    for line in text.splitlines():
        if line.strip():
            dem += 1
    return dem
\`\`\`

**Vì sao không \`split("\\n")\`?**

\`\`\`python
"a\\nb\\n".split("\\n")       # ['a', 'b', '']   ← dòng rỗng ảo ở cuối
"a\\nb\\n".splitlines()      # ['a', 'b']       ← đúng ý người đọc
"a\\r\\nb".splitlines()       # ['a', 'b']       ← hiểu luôn kiểu Windows
"a\\r\\nb".split("\\n")        # ['a\\r', 'b']     ← còn sót \\r
\`\`\`

Ký tự \`\\r\` sót lại là nguồn của một lớp bug rất khó thấy: \`"5\\r" == "5"\` là \`False\`, và
\`int("5\\r")\` thì... vẫn chạy (Python bỏ khoảng trắng hai đầu), nhưng \`"active\\r" == "active"\` thì
sai. Dùng \`splitlines()\` là hết chuyện.

**Ba cách viết cùng một phép đếm**

\`\`\`python
# 1. vòng lặp — rõ ràng nhất khi mới học
dem = 0
for line in text.splitlines():
    if line.strip():
        dem += 1

# 2. sum + generator expression — cách người Python hay viết
dem = sum(1 for line in text.splitlines() if line.strip())

# 3. lọc rồi lấy độ dài — dựng list trung gian, tốn bộ nhớ hơn
dem = len([line for line in text.splitlines() if line.strip()])
\`\`\`

Cách 2 đáng học vì nó **không dựng list trung gian**: \`sum\` nhận generator và cộng dần. Với file
hàng triệu dòng, khác biệt là vài trăm MB bộ nhớ.

**Trong dự án thật, đọc file trực tiếp còn tốt hơn**

\`\`\`python
with open("data.txt", encoding="utf-8") as f:
    dem = sum(1 for line in f if line.strip())
\`\`\`

\`for line in f\` đọc **từng dòng một** chứ không nạp cả file vào bộ nhớ — chính vì \`f\` là một
iterator. Bài tập này nhận sẵn văn bản trong biến để tập trung vào phần xử lý, nhưng phản xạ đúng
khi gặp file lớn là "duyệt qua file", không phải \`f.read()\`.
`,
    solution: `def count_nonempty(text):
    dem = 0
    for line in text.splitlines():
        if line.strip():
            dem += 1
    return dem`,
    complexity: {
      question: 'Với văn bản n ký tự, độ phức tạp thời gian và bộ nhớ là bao nhiêu?',
      options: [
        'Thời gian O(n), bộ nhớ O(n) — vì `splitlines()` dựng sẵn danh sách mọi dòng',
        'Thời gian O(n), bộ nhớ O(1)',
        'Thời gian O(n²)',
        'Thời gian O(số dòng), không phụ thuộc độ dài dòng',
      ],
      answer: 0,
      why: 'Mỗi ký tự được đọc một số lần cố định nên thời gian là O(n). Nhưng `splitlines()` trả về một LIST chứa mọi dòng, nên bộ nhớ cũng là O(n) — đó là lý do với file lớn người ta duyệt `for line in f` thay vì `f.read().splitlines()`.',
    },
    realWorld: 'Đếm số bản ghi thật trong file dữ liệu (bỏ dòng trống cuối file — gần như file nào cũng có), kiểm tra nhanh một file log có nội dung hay không, đếm dòng code. Bẫy `\\r\\n` xuất hiện ngay khi file được tạo trên Windows rồi xử lý trên Linux.',
  },
  {
    id: 'py-drill-first-column',
    title: 'Lấy cột đầu của từng dòng',
    en: 'Extract First Column',
    difficulty: 'Easy',
    targetMinutes: 7,
    entry: 'first_column',
    lang: 'python',
    statement: `
Văn bản gồm nhiều dòng, mỗi dòng là các ô cách nhau bằng dấu phẩy. Viết hàm \`first_column(text)\`
trả về list **ô đầu tiên** của mỗi dòng:

- bỏ qua dòng rỗng / dòng chỉ có khoảng trắng
- bỏ khoảng trắng ở hai đầu ô

**Ví dụ**

\`\`\`python
first_column("a,1\\nb,2")      # ["a", "b"]
first_column(" c , 2 ")        # ["c"]
first_column("")               # []
\`\`\`
`,
    starter: `def first_column(text):\n    # Tra ve list o dau tien cua tung dong\n    \n`,
    tests: [
      { args: ['a,1\nb,2'], expected: ['a', 'b'], name: 'Hai dòng hai cột' },
      { args: [''], expected: [], name: 'Văn bản rỗng' },
      { args: ['x'], expected: ['x'], name: 'Dòng chỉ có một ô, không có dấu phẩy' },
      { args: ['a,1\n\nb,2'], expected: ['a', 'b'], name: 'Có dòng trống ở giữa' },
      { args: [' c , 2 '], expected: ['c'], name: 'Có khoảng trắng quanh ô' },
      { args: ['a,b,c\nd,e'], expected: ['a', 'd'], name: 'Số cột khác nhau giữa các dòng' },
      { args: [',x\ny,z'], expected: ['', 'y'], name: 'Ô đầu rỗng vẫn được tính' },
    ],
    hints: [
      '`line.split(",")` tách một dòng thành list các ô. Lấy ô đầu là `[0]` — luôn tồn tại, vì `split` trên chuỗi rỗng cũng trả về `[""]` (một phần tử).',
      'Ghép ba bước: duyệt `text.splitlines()`, bỏ qua dòng rỗng bằng `continue`, rồi `append(line.split(",")[0].strip())`.',
      'Chú ý thứ tự: `split(",")` trước rồi `.strip()` cho riêng ô đầu — nếu `strip()` cả dòng trước thì cũng được, nhưng ô đầu vẫn có thể còn khoảng trắng bên trong (`" c , 2 "` → ô đầu là `" c "`).',
    ],
    diagnostics: [
      { test: 'text\\.split\\s*\\(\\s*["\'],["\']\\s*\\)', message: 'Bạn đang tách CẢ văn bản theo dấu phẩy, làm mất ranh giới dòng. Phải tách theo dòng trước (`splitlines()`), rồi mới tách từng dòng theo dấu phẩy.' },
      { test: 'split\\s*\\(\\s*["\'],["\']\\s*\\)\\s*\\[\\s*1\\s*\\]', message: 'Chỉ số `[1]` là ô THỨ HAI. Ô đầu tiên là `[0]` — Python đếm từ 0.' },
      { test: 'import\\s+csv', message: 'Module `csv` là công cụ đúng cho CSV thật (có dấu nháy, có phẩy trong ô). Bài này cố tình làm bằng tay để bạn thấy `split` xử lý được gì và KHÔNG xử lý được gì.' },
    ],
    approach: `
**Khuôn "duyệt dòng → tách ô"**

\`\`\`python
def first_column(text):
    ket_qua = []
    for line in text.splitlines():
        if not line.strip():
            continue                                  # bỏ dòng rỗng
        ket_qua.append(line.split(",")[0].strip())
    return ket_qua
\`\`\`

**\`split\` luôn trả về ít nhất một phần tử**

\`\`\`python
"a,b".split(",")   # ['a', 'b']
"a".split(",")     # ['a']       ← không có dấu phẩy vẫn ra 1 phần tử
"".split(",")      # ['']        ← chuỗi rỗng cũng ra 1 phần tử
",x".split(",")    # ['', 'x']   ← ô đầu rỗng
\`\`\`

Nhờ tính chất này, \`line.split(",")[0]\` **không bao giờ** \`IndexError\` — khác với \`[1]\` (ô thứ
hai) thì có thể lỗi. Đây là lý do lấy ô đầu thì an toàn, còn lấy ô sau thì phải kiểm tra độ dài.

**\`split(",", 1)\` — tham số \`maxsplit\`**

\`\`\`python
"a,b,c".split(",", 1)   # ['a', 'b,c']   chỉ tách 1 lần
\`\`\`

Rất hữu ích khi chỉ cần "phần đầu và phần còn lại" — như tách \`key=value\` mà value có thể chứa
dấu \`=\`. Còn \`rsplit\` thì tách từ **bên phải**: \`"a.b.py".rsplit(".", 1)\` cho \`['a.b', 'py']\`.

**Giới hạn thật của cách làm này**

\`split(",")\` không hiểu quy ước CSV về dấu nháy. Dòng sau sẽ bị tách sai:

\`\`\`
"Nguyen, Van A",25
\`\`\`

Nó ra \`['"Nguyen', ' Van A"', '25']\` — ba ô, trong khi CSV thật chỉ có hai. Với dữ liệu thật hãy
dùng module \`csv\` của thư viện chuẩn (\`csv.reader\`); nó xử lý dấu nháy, dấu phẩy trong ô và xuống
dòng trong ô. Biết \`split\` **sai ở đâu** quan trọng hơn việc dùng được nó.
`,
    solution: `def first_column(text):
    ket_qua = []
    for line in text.splitlines():
        if not line.strip():
            continue
        ket_qua.append(line.split(",")[0].strip())
    return ket_qua`,
    complexity: {
      question: 'Với văn bản n ký tự, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(n) — nhưng lưu ý `split(",")` tách CẢ dòng dù ta chỉ cần ô đầu',
        'O(số dòng) vì mỗi dòng chỉ lấy một ô',
        'O(n²)',
        'O(n log n)',
      ],
      answer: 0,
      why: 'Mỗi ký tự vẫn được đọc một lần khi tách dòng và tách ô → O(n). Điểm đáng chú ý: `split(",")` dựng list mọi ô của dòng dù ta chỉ dùng ô đầu — với dòng rất nhiều cột thì `split(",", 1)` tiết kiệm hơn.',
    },
    realWorld: 'Lấy nhanh danh sách id/mã từ một file xuất, kiểm tra khoá chính có trùng không trước khi import, lọc cột đầu của log dạng bảng. Trong sản xuất, hãy chuyển sang `csv.reader` ngay khi dữ liệu có thể chứa dấu phẩy trong nội dung ô.',
  },
  {
    id: 'py-parse-ini-sections',
    title: 'Đọc file cấu hình có nhiều mục',
    en: 'Parse INI Sections',
    difficulty: 'Medium',
    targetMinutes: 15,
    entry: 'parse_ini',
    lang: 'python',
    checkerSrc: 'lambda got, exp, args: isinstance(got, dict) and got == exp',
    statement: `
Đọc văn bản cấu hình kiểu INI thành **dict lồng dict**:

\`\`\`
[db]
host=localhost
port=5432

[app]
debug=true
\`\`\`

→ \`{"db": {"host": "localhost", "port": "5432"}, "app": {"debug": "true"}}\`

Quy tắc:
- dòng \`[tên]\` mở một mục mới (mục trùng tên thì **gộp** vào mục đã có)
- dòng \`khoá=giá trị\` thuộc mục đang mở; bỏ khoảng trắng quanh khoá và giá trị
- bỏ qua: dòng rỗng, dòng bắt đầu bằng \`#\`, dòng không có dấu \`=\`, và mọi cặp
  \`khoá=giá trị\` **xuất hiện trước mục đầu tiên**
- giá trị giữ nguyên dạng chuỗi (không đổi sang số/bool)
`,
    starter: `def parse_ini(text):\n    # Tra ve dict long dict: {ten_muc: {khoa: gia_tri}}\n    \n`,
    tests: [
      { args: ['[db]\nhost=localhost\nport=5432\n\n[app]\ndebug=true'], expected: { db: { host: 'localhost', port: '5432' }, app: { debug: 'true' } }, name: 'Hai mục' },
      { args: [''], expected: {}, name: 'Văn bản rỗng' },
      { args: ['[a]'], expected: { a: {} }, name: 'Mục rỗng vẫn phải xuất hiện' },
      { args: ['# ghi chu\n[a]\nx = 1'], expected: { a: { x: '1' } }, name: 'Bỏ dòng chú thích, bỏ khoảng trắng quanh khoá/giá trị' },
      { args: ['k=v\n[a]\nk2=v2'], expected: { a: { k2: 'v2' } }, name: 'Cặp trước mục đầu tiên bị bỏ' },
      { args: ['[a]\nx=1\n[a]\ny=2'], expected: { a: { x: '1', y: '2' } }, name: 'Mục trùng tên thì gộp' },
      { args: ['[a]\nkhong co dau bang\nx=1'], expected: { a: { x: '1' } }, name: 'Dòng không có dấu = bị bỏ' },
      { args: ['[a]\nurl=http://x/y?a=1'], expected: { a: { url: 'http://x/y?a=1' } }, name: 'Giá trị có chứa dấu = — chỉ tách ở dấu đầu tiên' },
    ],
    hints: [
      'Cần một biến "mục đang mở" bên ngoài vòng lặp: `hien_tai = None`. Mỗi khi gặp dòng `[...]` thì cập nhật biến đó.',
      'Nhận dòng mục bằng `line.startswith("[") and line.endswith("]")`, lấy tên bằng cắt lát `line[1:-1]`.',
      '`line.split("=", 1)` chỉ tách ở dấu `=` **đầu tiên** — nhờ vậy giá trị chứa `=` (như URL có query) vẫn nguyên vẹn. Dùng `ket_qua.setdefault(ten, {})` để mục trùng tên được gộp thay vì ghi đè.',
    ],
    diagnostics: [
      { test: 'split\\s*\\(\\s*["\']=["\']\\s*\\)', message: '`split("=")` tách ở MỌI dấu `=`, nên `url=http://x?a=1` sẽ bị cắt thành 3 phần và bạn mất phần cuối. Dùng `split("=", 1)`.' },
      { test: 'ket_qua\\s*\\[\\s*\\w+\\s*\\]\\s*=\\s*\\{\\s*\\}', message: 'Gán thẳng `ket_qua[ten] = {}` sẽ XOÁ nội dung cũ khi mục xuất hiện lần thứ hai. Dùng `setdefault(ten, {})` — chỉ tạo khi chưa có.' },
      { test: 'hien_tai\\s*=\\s*None[\\s\\S]{0,400}for[\\s\\S]{0,600}hien_tai\\s*=\\s*None', message: 'Biến "mục đang mở" bị đặt lại về `None` bên trong vòng lặp nên mọi cặp khoá/giá trị đều bị bỏ. Nó phải được khởi tạo MỘT lần trước vòng lặp.' },
    ],
    approach: `
**Bài này là một máy trạng thái nhỏ**

Điểm mới so với các bài tách chuỗi trước: xử lý một dòng **phụ thuộc vào các dòng trước đó** (đang
ở trong mục nào). Thứ giữ ngữ cảnh đó là một biến bên ngoài vòng lặp — người ta gọi khuôn này là
*máy trạng thái* (state machine).

\`\`\`python
def parse_ini(text):
    ket_qua = {}
    hien_tai = None                                  # trạng thái: đang ở mục nào

    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("[") and line.endswith("]"):
            hien_tai = line[1:-1].strip()
            ket_qua.setdefault(hien_tai, {})         # mở mục, không xoá nội dung cũ
            continue
        if hien_tai is None or "=" not in line:
            continue
        khoa, gia_tri = line.split("=", 1)
        ket_qua[hien_tai][khoa.strip()] = gia_tri.strip()

    return ket_qua
\`\`\`

**Thứ tự các \`if\` là thứ tự ưu tiên.** Mỗi nhánh kết bằng \`continue\` để "xử lý xong dòng này,
sang dòng khác" — nhờ vậy các nhánh không lồng vào nhau và đọc từ trên xuống như một danh sách
quy tắc.

**\`setdefault\` — công cụ đúng cho "tạo nếu chưa có"**

\`\`\`python
d.setdefault(k, {})     # có k -> trả về giá trị cũ; chưa có -> gán {} rồi trả về
\`\`\`

So với \`if k not in d: d[k] = {}\` thì ngắn hơn một dòng và chỉ băm khoá một lần. Với dữ liệu
nhóm theo khoá, người ta còn dùng \`collections.defaultdict(dict)\` để không phải gọi \`setdefault\`
mỗi lần (module 12).

**\`split("=", 1)\` — tham số maxsplit cứu bàn**

\`\`\`python
"url=http://x?a=1".split("=")      # ['url', 'http://x?a', '1']  ← mất dữ liệu
"url=http://x?a=1".split("=", 1)   # ['url', 'http://x?a=1']     ← đúng
\`\`\`

Quy tắc chung khi tách "khoá và phần còn lại": **luôn** giới hạn số lần tách. Đây là lỗi rất hay
gặp khi đọc file \`.env\`, header HTTP, hay chuỗi kết nối database.

**Vì sao bỏ cặp trước mục đầu tiên?** Vì \`hien_tai is None\` nghĩa là chưa biết đặt nó vào đâu. Có
ba lựa chọn thiết kế: bỏ qua (như đề), raise lỗi, hoặc gom vào một mục mặc định (\`configparser\`
của Python raise \`MissingSectionHeaderError\`). Điều quan trọng là **chọn một cách và viết rõ ra**
— dữ liệu bẩn luôn tồn tại, im lặng đoán ý là nguồn của bug.
`,
    solution: `def parse_ini(text):
    ket_qua = {}
    hien_tai = None

    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("[") and line.endswith("]"):
            hien_tai = line[1:-1].strip()
            ket_qua.setdefault(hien_tai, {})
            continue
        if hien_tai is None or "=" not in line:
            continue
        khoa, gia_tri = line.split("=", 1)
        ket_qua[hien_tai][khoa.strip()] = gia_tri.strip()

    return ket_qua`,
    complexity: {
      question: 'Với văn bản n ký tự, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(n) — mỗi dòng được xử lý một lần, mỗi thao tác dict là O(1) trung bình',
        'O(n · s) với s là số mục',
        'O(n²) vì phải tìm dấu = trong từng dòng',
        'O(n log n)',
      ],
      answer: 0,
      why: 'Mỗi ký tự thuộc đúng một dòng và được đọc một số lần cố định (strip, tìm `=`, split). Việc `setdefault` và gán vào dict lồng đều là O(1) trung bình nhờ bảng băm, không phụ thuộc số mục đã có.',
    },
    realWorld: 'Đây chính là cách `configparser`, file `.gitconfig`, `tox.ini`, `setup.cfg` được đọc. Khuôn "máy trạng thái theo dòng" còn dùng cho: đọc file log nhiều dòng (một sự kiện gồm dòng tiêu đề + các dòng chi tiết), phân tích diff của Git, đọc Markdown theo tiêu đề.',
  },
  {
    id: 'py-rows-to-csv',
    title: 'Xuất dữ liệu ra CSV đúng chuẩn',
    en: 'Rows to CSV Text',
    difficulty: 'Medium',
    targetMinutes: 16,
    entry: 'to_csv',
    lang: 'python',
    statement: `
Viết hàm \`to_csv(rows)\` đổi list các dict thành **một chuỗi CSV**:

- dòng đầu là **tiêu đề**, lấy theo thứ tự khoá của dict **đầu tiên**
- mỗi dòng tiếp theo là các giá trị theo đúng thứ tự cột đó (khoá thiếu → ô rỗng)
- các dòng nối nhau bằng \`\\n\`, không có \`\\n\` ở cuối
- \`rows\` rỗng → trả về chuỗi rỗng
- **thoát ô đúng chuẩn CSV**: ô chứa dấu phẩy, dấu nháy kép hoặc ký tự xuống dòng thì bọc trong
  dấu nháy kép, và mỗi dấu nháy kép bên trong được **nhân đôi**

**Ví dụ**

\`\`\`python
to_csv([{"a": "1", "b": "2"}])       # "a,b\\n1,2"
to_csv([{"a": "x,y"}])               # 'a\\n"x,y"'
to_csv([{"a": 'co "nhay"'}])         # 'a\\n"co ""nhay"""'
\`\`\`
`,
    starter: `def to_csv(rows):\n    # Tra ve chuoi CSV, co thoat o dung chuan\n    \n`,
    tests: [
      { args: [[{ a: '1', b: '2' }]], expected: 'a,b\n1,2', name: 'Một dòng hai cột' },
      { args: [[]], expected: '', name: 'Không có dòng nào' },
      { args: [[{ a: 'x,y' }]], expected: 'a\n"x,y"', name: 'Ô có dấu phẩy — phải bọc nháy' },
      { args: [[{ a: 'co "nhay"' }]], expected: 'a\n"co ""nhay"""', name: 'Ô có dấu nháy — nhân đôi rồi bọc' },
      { args: [[{ a: '1' }, { a: '2' }]], expected: 'a\n1\n2', name: 'Hai dòng' },
      { args: [[{ a: '1', b: '' }]], expected: 'a,b\n1,', name: 'Ô rỗng' },
      { args: [[{ a: '1', b: '2' }, { a: '3' }]], expected: 'a,b\n1,2\n3,', name: 'Dòng sau thiếu cột' },
      { args: [[{ a: 'dong1\ndong2' }]], expected: 'a\n"dong1\ndong2"', name: 'Ô có ký tự xuống dòng' },
      { args: [[{ ten: 'An', tuoi: 20 }]], expected: 'ten,tuoi\nAn,20', name: 'Giá trị là số — đổi sang chuỗi' },
    ],
    hints: [
      'Cột lấy từ `list(rows[0].keys())` — từ Python 3.7 dict **giữ đúng thứ tự khoá được thêm vào**, nên thứ tự cột là thứ tự bạn thấy trong dict đầu.',
      'Viết một hàm con `boc(gia_tri)` lo việc thoát ô: đổi sang `str()`, nếu chứa `,` hoặc `"` hoặc `\\n` thì `\'"\' + s.replace(\'"\', \'""\') + \'"\'`.',
      'Ghép dòng bằng `",".join(...)` và ghép các dòng bằng `"\\n".join(...)`. Với ô thiếu, dùng `row.get(cot, "")`.',
    ],
    diagnostics: [
      { test: 'replace\\s*\\(\\s*\'"\'\\s*,\\s*\'\\\\\\\\"\'', message: 'CSV **không** dùng dấu gạch chéo ngược để thoát (đó là quy ước của JSON). Chuẩn CSV nhân đôi dấu nháy: `"` thành `""`.' },
      { test: 'for\\s+\\w+\\s+in\\s+rows\\s*:[\\s\\S]{0,200}keys\\s*\\(', message: 'Đừng lấy cột từ MỌI dòng — thứ tự sẽ không ổn định và số cột có thể khác nhau giữa các dòng. Đề nói rõ: cột lấy theo dict ĐẦU TIÊN.' },
      { test: 'return\\s+["\']\\\\n["\']\\.join[\\s\\S]{0,80}\\+\\s*["\']\\\\n["\']', message: 'Thêm `\\n` ở cuối là sai với đề (và làm sinh ra một dòng rỗng khi đọc lại). `"\\n".join(...)` đã đặt dấu xuống dòng đúng chỗ — giữa các dòng.' },
    ],
    approach: `
**Tách bài thành hai việc rõ rệt**

1. **Thoát một ô** — quy tắc cục bộ, không phụ thuộc gì khác → tách thành hàm con.
2. **Ghép các ô thành dòng, các dòng thành văn bản** → hai lần \`join\`.

\`\`\`python
def to_csv(rows):
    if not rows:
        return ""

    cot = list(rows[0].keys())

    def boc(gia_tri):
        s = str(gia_tri)
        if "," in s or '"' in s or "\\n" in s:
            return '"' + s.replace('"', '""') + '"'
        return s

    dong = [",".join(cot)]
    for row in rows:
        dong.append(",".join(boc(row.get(c, "")) for c in cot))
    return "\\n".join(dong)
\`\`\`

**Quy tắc thoát của CSV (RFC 4180)**

| Nội dung ô | Ghi ra CSV |
| --- | --- |
| \`abc\` | \`abc\` |
| \`x,y\` | \`"x,y"\` |
| \`co "nhay"\` | \`"co ""nhay"""\` |
| \`dong1\` + xuống dòng + \`dong2\` | ô được bọc nháy, giữ nguyên ký tự xuống dòng |

Điểm khiến người mới bối rối nhất: **nhân đôi** dấu nháy, chứ không phải \`\\"\` như JSON hay như
chuỗi trong code. Nên \`co "nhay"\` thành \`"co ""nhay"""\` — ba dấu nháy liền ở cuối gồm hai dấu
nháy nội dung (đã nhân đôi) và một dấu nháy đóng ô.

**Thứ tự hai thao tác trong \`boc\` rất quan trọng:** nhân đôi nháy **trước**, rồi mới bọc ngoài.
Làm ngược lại thì bạn nhân đôi luôn cả dấu nháy bao ngoài.

**Vì sao dùng hai lần \`join\` mà không cộng chuỗi?**

Cùng lý do như bài "chuẩn hoá khoảng trắng": chuỗi bất biến nên \`s += ...\` trong vòng lặp là
O(n²). Ở đây dữ liệu có thể là hàng chục nghìn dòng, nên khác biệt rất thật. Khuôn chuẩn:
**tích luỹ vào list, rồi \`join\` một lần**.

**Hàm lồng trong hàm dùng để làm gì?**

\`boc\` chỉ có ý nghĩa bên trong \`to_csv\`, nên đặt nó bên trong là cách nói "đây là chi tiết nội
bộ". Nó cũng là closure — đọc được biến của hàm ngoài nếu cần (ví dụ nếu muốn cho phép chọn dấu
phân cách khác).

**Trong dự án thật:** dùng \`csv.writer\` của thư viện chuẩn. Nó xử lý sẵn mọi quy tắc thoát, cả
tuỳ chọn dấu phân cách và kiểu xuống dòng theo hệ điều hành. Bài này viết tay để bạn hiểu module
\`csv\` đang làm gì cho mình — và để nhận ra ngay khi nhìn thấy một file CSV bị thoát sai.
`,
    solution: `def to_csv(rows):
    if not rows:
        return ""

    cot = list(rows[0].keys())

    def boc(gia_tri):
        s = str(gia_tri)
        if "," in s or '"' in s or "\\n" in s:
            return '"' + s.replace('"', '""') + '"'
        return s

    dong = [",".join(cot)]
    for row in rows:
        dong.append(",".join(boc(row.get(c, "")) for c in cot))
    return "\\n".join(dong)`,
    complexity: {
      question: 'Với r dòng, c cột và tổng độ dài dữ liệu n ký tự, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(n + r · c) — mỗi ô được đọc/copy một số lần cố định',
        'O(r · c · n) vì mỗi ô phải quét cả dữ liệu',
        'O(n²) do nối chuỗi',
        'O(r log r)',
      ],
      answer: 0,
      why: 'Mỗi ô được kiểm tra và copy một số lần cố định → tổng tỉ lệ với lượng dữ liệu n, cộng thêm r·c lần tra dict (O(1) mỗi lần). Nhờ dùng `join` thay vì `+=` nên không rơi vào O(n²).',
    },
    realWorld: 'Xuất báo cáo cho người dùng tải về, đẩy dữ liệu sang hệ thống khác, ghi file để mở bằng Excel. Lỗi thoát ô là nguyên nhân số một khiến file CSV "lệch cột" khi mở bằng Excel — thường vì trong dữ liệu có tên kèm dấu phẩy hoặc địa chỉ nhiều dòng.',
  },
];

/* ==================================================================== */
/* MODULE 9 — py-packaging                                               */
/* ==================================================================== */
const PY_PACKAGING = [
  {
    id: 'py-drill-module-name',
    title: 'Từ đường dẫn file ra tên module',
    en: 'Path to Module Name',
    difficulty: 'Easy',
    targetMinutes: 7,
    entry: 'module_name',
    lang: 'python',
    statement: `
Khi Python import, nó làm việc với **tên module** (\`pkg.sub.mod\`) chứ không phải đường dẫn file
(\`pkg/sub/mod.py\`). Viết hàm \`module_name(path)\` đổi đường dẫn thành tên module:

- bỏ đuôi \`.py\`
- đổi dấu \`/\` thành dấu \`.\`
- \`__init__.py\` **không** xuất hiện trong tên: \`pkg/__init__.py\` → \`pkg\`, và \`__init__.py\` → \`""\`

**Ví dụ**
- \`module_name("pkg/sub/mod.py")\` → \`"pkg.sub.mod"\`
- \`module_name("mod.py")\` → \`"mod"\`
- \`module_name("pkg/__init__.py")\` → \`"pkg"\`
`,
    starter: `def module_name(path):\n    # Doi duong dan file thanh ten module\n    \n`,
    tests: [
      { args: ['pkg/sub/mod.py'], expected: 'pkg.sub.mod', name: 'Hai tầng package' },
      { args: ['mod.py'], expected: 'mod', name: 'Module ở gốc' },
      { args: ['pkg/__init__.py'], expected: 'pkg', name: '__init__.py là chính package đó' },
      { args: ['__init__.py'], expected: '', name: '__init__.py ở gốc — không có tên' },
      { args: ['a/b/c/d.py'], expected: 'a.b.c.d', name: 'Nhiều tầng' },
      { args: ['pkg/sub/__init__.py'], expected: 'pkg.sub', name: '__init__.py trong package con' },
    ],
    hints: [
      'Bỏ đuôi bằng cắt lát `path[:-3]` (3 là độ dài `".py"`), hoặc dùng `path.removesuffix(".py")` — có từ Python 3.9, đọc rõ ý hơn.',
      'Xử lý `__init__` TRƯỚC khi đổi `/` thành `.`, vì lúc đó bạn còn nhận ra được `"/__init__"` ở cuối.',
      'Hai trường hợp `__init__` khác nhau: kết thúc bằng `"/__init__"` (cắt cả phần đó đi) và bằng đúng `"__init__"` (trả về chuỗi rỗng). Cuối cùng mới `.replace("/", ".")`.',
    ],
    diagnostics: [
      { test: 'replace\\s*\\(\\s*["\']\\.py["\']', message: '`replace(".py", "")` xoá MỌI chỗ khớp, nên `pkg.py/mod.py` hay tên chứa `.py` ở giữa sẽ bị hỏng. Hãy cắt ở cuối: `path[:-3]` hoặc `removesuffix(".py")`.' },
      { test: 'replace\\s*\\(\\s*["\']/["\'][\\s\\S]{0,200}__init__', message: 'Thứ tự sai: nếu đổi `/` thành `.` trước thì phần cuối thành `.__init__` và điều kiện `endswith("/__init__")` của bạn không còn khớp. Xử lý `__init__` trước.' },
      { test: 'path\\.split\\s*\\(\\s*["\']/["\']\\s*\\)\\s*\\[\\s*-\\s*1\\s*\\]', message: 'Lấy `[-1]` chỉ còn tên file, mất hết phần package phía trước — `pkg/sub/mod.py` sẽ ra `mod` thay vì `pkg.sub.mod`.' },
    ],
    approach: `
**Ba phép biến đổi, và thứ tự giữa chúng mới là bài học**

\`\`\`python
def module_name(path):
    duong_dan = path[:-3] if path.endswith(".py") else path

    if duong_dan.endswith("/__init__"):
        duong_dan = duong_dan[: -len("/__init__")]
    elif duong_dan == "__init__":
        duong_dan = ""

    return duong_dan.replace("/", ".")
\`\`\`

**\`path[:-3]\` và \`removesuffix\`**

\`\`\`python
"mod.py"[:-3]                 # "mod"   — cắt 3 ký tự cuối
"mod.py".removesuffix(".py")  # "mod"   — Python 3.9+, không phải đếm
"mod.py".replace(".py", "")   # "mod"   — nhưng xoá MỌI chỗ khớp -> nguy hiểm
\`\`\`

Vì sao \`replace\` nguy hiểm? Với \`"scripts/copy.py"\` nó vẫn đúng, nhưng với
\`"a.pyx/b.py"\` thì nó ăn cả phần giữa. Quy tắc: **cần cắt ở cuối thì đừng dùng \`replace\`**.

\`duong_dan[: -len("/__init__")]\` đọc là "bỏ đúng số ký tự của \`/__init__\` ở cuối". Viết
\`-len(...)\` thay vì con số \`-9\` để người đọc không phải đếm — và không sai khi ai đó sửa chuỗi.

**Vì sao \`__init__.py\` không có trong tên module?**

Vì \`__init__.py\` **là** package. Khi bạn viết \`import pkg\`, Python chạy file \`pkg/__init__.py\`;
tên module của nó chính là \`pkg\`. Đây là quy ước bạn phải biết để hiểu cấu trúc thư viện:

\`\`\`
pkg/
  __init__.py      -> module "pkg"
  sub/
    __init__.py    -> module "pkg.sub"
    mod.py         -> module "pkg.sub.mod"
\`\`\`

**Cấu trúc \`if\`/\`elif\` ở đây có ý gì?** Hai trường hợp \`__init__\` loại trừ nhau: hoặc nó có
package cha (\`pkg/__init__\`), hoặc nó ở gốc (\`__init__\`). Dùng \`elif\` nói rõ điều đó; viết hai
\`if\` rời cũng chạy nhưng người đọc phải tự suy ra chúng không thể cùng đúng.

**Trong dự án thật:** dùng \`pathlib\`.

\`\`\`python
from pathlib import Path
p = Path("pkg/sub/mod.py")
".".join(p.with_suffix("").parts)   # 'pkg.sub.mod'
\`\`\`

\`pathlib\` xử lý đúng cả dấu \`\\\\\` của Windows — điều mà \`replace("/", ".")\` không làm được.
`,
    solution: `def module_name(path):
    duong_dan = path[:-3] if path.endswith(".py") else path

    if duong_dan.endswith("/__init__"):
        duong_dan = duong_dan[: -len("/__init__")]
    elif duong_dan == "__init__":
        duong_dan = ""

    return duong_dan.replace("/", ".")`,
    complexity: {
      question: 'Độ phức tạp thời gian theo độ dài n của đường dẫn?',
      options: [
        'O(n) — mỗi phép cắt lát và replace đều tạo chuỗi mới dài cỡ n',
        'O(1) vì chỉ xem vài ký tự đầu và cuối',
        'O(n²)',
        'O(số tầng thư mục)',
      ],
      answer: 0,
      why: 'Chuỗi bất biến nên mỗi phép biến đổi (`[:-3]`, `replace`) tạo một chuỗi mới và copy nội dung → O(n) mỗi phép, tổng vẫn O(n) vì số phép là hằng số.',
    },
    realWorld: 'Công cụ nào quét thư mục rồi import động cũng phải làm bước này: bộ thu thập test của pytest, hệ thống nạp plugin, công cụ sinh tài liệu. Hiểu quan hệ "đường dẫn ↔ tên module" cũng là chìa khoá để đọc được lỗi `ModuleNotFoundError`.',
  },
  {
    id: 'py-drill-valid-module-name',
    title: 'Tên module có hợp lệ không?',
    en: 'Is It a Valid Module Name?',
    difficulty: 'Easy',
    targetMinutes: 6,
    entry: 'is_valid_module_name',
    lang: 'python',
    statement: `
Viết hàm \`is_valid_module_name(name)\` trả về \`True\` khi \`name\` dùng được làm tên module Python:

- là một **định danh hợp lệ** (chỉ gồm chữ, số, gạch dưới; **không** bắt đầu bằng chữ số; không có
  dấu gạch ngang hay khoảng trắng)
- **không** phải từ khoá của Python (\`class\`, \`import\`, \`for\`, ...)

**Ví dụ**
- \`is_valid_module_name("my_module")\` → \`True\`
- \`is_valid_module_name("2fast")\` → \`False\`
- \`is_valid_module_name("my-module")\` → \`False\`
- \`is_valid_module_name("class")\` → \`False\`
`,
    starter: `import keyword\n\n\ndef is_valid_module_name(name):\n    # Tra ve True/False\n    \n`,
    tests: [
      { args: ['my_module'], expected: true, name: 'Tên thường' },
      { args: ['2fast'], expected: false, name: 'Bắt đầu bằng chữ số' },
      { args: ['my-module'], expected: false, name: 'Có dấu gạch ngang' },
      { args: ['class'], expected: false, name: 'Từ khoá Python' },
      { args: [''], expected: false, name: 'Chuỗi rỗng' },
      { args: ['_private'], expected: true, name: 'Bắt đầu bằng gạch dưới — hợp lệ' },
      { args: ['Mod2'], expected: true, name: 'Có chữ số ở giữa/cuối' },
      { args: ['my module'], expected: false, name: 'Có khoảng trắng' },
      { args: ['import'], expected: false, name: 'Từ khoá khác' },
    ],
    hints: [
      'Chuỗi có sẵn phương thức `name.isidentifier()` trả về `True` nếu chuỗi dùng được làm tên biến/hàm/module. Không cần regex.',
      'Từ khoá thì `isidentifier()` vẫn cho `True` (`"class".isidentifier()` là `True`) vì về hình thức nó vẫn là định danh — nên phải loại riêng.',
      'Module `keyword` của thư viện chuẩn có `keyword.iskeyword(name)`. Ghép lại: `return name.isidentifier() and not keyword.iskeyword(name)`.',
    ],
    diagnostics: [
      { test: 'import\\s+re|re\\.match', message: 'Không cần regex: `str.isidentifier()` đã áp dụng đúng luật của chính Python (kể cả các ký tự Unicode được phép), còn regex `^[A-Za-z_]\\w*$` thì chỉ đúng với ASCII.' },
      { test: 'KEYWORDS\\s*=|\\[\\s*["\']class["\']\\s*,', message: 'Đừng tự liệt kê danh sách từ khoá — nó thay đổi theo phiên bản Python (`match`, `case` là ví dụ mới). `keyword.iskeyword()` luôn đúng với phiên bản đang chạy.' },
      { test: 'name\\s*\\[\\s*0\\s*\\]\\.isdigit', message: 'Kiểm tra ký tự đầu là chữ số chỉ bắt được một trong nhiều luật (còn khoảng trắng, dấu gạch ngang, chuỗi rỗng...). `isidentifier()` bao hết.' },
    ],
    approach: `
**Lời giải chỉ một dòng — nhưng nằm ở việc biết công cụ**

\`\`\`python
import keyword

def is_valid_module_name(name):
    return name.isidentifier() and not keyword.iskeyword(name)
\`\`\`

**\`str.isidentifier()\`**

Trả lời đúng câu hỏi "chuỗi này dùng được làm tên trong Python không?" theo **chính luật của
Python**:

\`\`\`python
"my_module".isidentifier()   # True
"2fast".isidentifier()       # False  (bắt đầu bằng số)
"my-module".isidentifier()   # False  (dấu gạch ngang)
"".isidentifier()            # False
"class".isidentifier()       # True   (!) — hình thức hợp lệ, nhưng là từ khoá
\`\`\`

Dòng cuối là lý do phải có điều kiện thứ hai. \`isidentifier\` chỉ xét *hình thức*, không xét
*ngữ nghĩa*.

**Họ hàng \`is...()\` của chuỗi** — tất cả trả về \`True\`/\`False\`:

| Phương thức | Đúng khi |
| --- | --- |
| \`isdigit()\` | mọi ký tự là chữ số |
| \`isalpha()\` | mọi ký tự là chữ cái |
| \`isalnum()\` | chữ hoặc số |
| \`isspace()\` | toàn khoảng trắng |
| \`isupper()\` / \`islower()\` | toàn chữ hoa / chữ thường |
| \`isidentifier()\` | dùng được làm tên trong Python |

Lưu ý chung: với **chuỗi rỗng**, tất cả trả về \`False\` — hành vi này thường đúng ý bạn.

**Vì sao không tự liệt kê từ khoá?**

\`keyword.kwlist\` thay đổi theo phiên bản: \`async\`/\`await\` thành từ khoá từ 3.7, \`match\`/\`case\`
là "từ khoá mềm" từ 3.10. Tự chép danh sách nghĩa là code của bạn sẽ **sai một cách im lặng** trên
phiên bản khác. Nguyên tắc chung: khi thư viện chuẩn đã trả lời được câu hỏi về chính ngôn ngữ,
đừng đoán lại.

**Vì sao tên module không được có dấu gạch ngang?** Vì \`import my-module\` sẽ được đọc là
\`my\` trừ \`module\` — dấu \`-\` là phép trừ. Đây cũng là lý do tên **gói** trên PyPI dùng gạch
ngang (\`scikit-learn\`) nhưng tên **module** khi import thì dùng gạch dưới (\`sklearn\`) —
hai không gian tên khác nhau, một điểm rất hay gây bối rối.
`,
    solution: `import keyword


def is_valid_module_name(name):
    return name.isidentifier() and not keyword.iskeyword(name)`,
    complexity: {
      question: 'Độ phức tạp thời gian theo độ dài n của tên?',
      options: [
        'O(n) — phải xét từng ký tự để biết có hợp lệ không',
        'O(1) vì chỉ xét ký tự đầu',
        'O(k) với k là số từ khoá của Python',
        'O(n log n)',
      ],
      answer: 0,
      why: '`isidentifier()` phải duyệt từng ký tự → O(n). `iskeyword()` tra trong một tập hợp (bảng băm) nên chỉ O(1) trung bình, không phụ thuộc số lượng từ khoá.',
    },
    realWorld: 'Kiểm tra tên do người dùng đặt trước khi sinh code/module (công cụ scaffold, generator), xác thực tên cột khi sinh câu SQL hoặc tên field khi sinh dataclass động. Đây cũng là tuyến phòng thủ đầu tiên chống chèn mã: nếu một chuỗi sẽ được đưa vào `getattr`/`exec`, hãy chắc nó là định danh hợp lệ.',
  },
  {
    id: 'py-bump-version',
    title: 'Tăng số phiên bản',
    en: 'Bump a Version Number',
    difficulty: 'Medium',
    targetMinutes: 12,
    entry: 'bump',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    try:
        return fn(*args)
    except ValueError:
        return "ValueError"`,
    statement: `
Phiên bản theo chuẩn *semantic versioning* có dạng \`MAJOR.MINOR.PATCH\`. Viết hàm
\`bump(version, part)\` tăng đúng một thành phần và **đặt lại các thành phần nhỏ hơn về 0**:

- \`"patch"\` → \`1.2.3\` thành \`1.2.4\`
- \`"minor"\` → \`1.2.3\` thành \`1.3.0\`
- \`"major"\` → \`1.2.3\` thành \`2.0.0\`

\`raise ValueError\` khi: phiên bản không có đúng 3 phần số, hoặc \`part\` không thuộc ba giá trị trên.
Bài chấm bắt lỗi và so với chuỗi \`"ValueError"\`.
`,
    starter: `def bump(version, part):\n    # Tra ve chuoi phien ban moi, hoac raise ValueError\n    \n`,
    tests: [
      { args: ['1.2.3', 'patch'], expected: '1.2.4', name: 'Tăng patch' },
      { args: ['1.2.3', 'minor'], expected: '1.3.0', name: 'Tăng minor — patch về 0' },
      { args: ['1.2.3', 'major'], expected: '2.0.0', name: 'Tăng major — hai phần sau về 0' },
      { args: ['0.0.9', 'patch'], expected: '0.0.10', name: 'Không có chuyện "nhớ" sang phần trước' },
      { args: ['10.20.30', 'minor'], expected: '10.21.0', name: 'Số nhiều chữ số' },
      { args: ['1.2.3', 'build'], expected: 'ValueError', name: 'Thành phần không hợp lệ' },
      { args: ['1.2', 'patch'], expected: 'ValueError', name: 'Thiếu một phần số' },
      { args: ['1.2.x', 'patch'], expected: 'ValueError', name: 'Phần không phải số' },
    ],
    hints: [
      '`version.split(".")` cho list các phần. Kiểm tra `len(...) != 3` rồi `raise ValueError(...)` ngay đầu hàm — đó là *guard clause*.',
      'Đổi cả ba phần sang số bằng giải nén: `major, minor, patch = (int(p) for p in phan)`. Nếu một phần không phải số, `int()` sẽ tự raise `ValueError` — đúng loại lỗi đề cần.',
      'Ba nhánh `if part == ...` mỗi nhánh `return` một f-string. Sau cả ba nhánh, `raise ValueError` cho `part` lạ — không cần `else`, vì tới được dòng đó nghĩa là không nhánh nào khớp.',
    ],
    diagnostics: [
      { test: 'return\\s+version', message: 'Trả về nguyên phiên bản cũ khi `part` lạ sẽ khiến lỗi trôi qua im lặng — người gọi tưởng đã tăng phiên bản. Đề yêu cầu `raise ValueError`.' },
      { test: 'int\\s*\\(\\s*version\\s*\\)', message: '`int(version)` với `"1.2.3"` luôn raise vì cả chuỗi không phải số. Phải `split(".")` trước rồi đổi từng phần.' },
      { test: 'patch\\s*\\+\\s*1[\\s\\S]{0,200}minor\\s*\\+\\s*1[\\s\\S]{0,200}major\\s*\\+\\s*1', message: 'Ba nhánh cùng chạy nghĩa là bạn thiếu `return` trong mỗi nhánh — mỗi lần gọi chỉ được tăng ĐÚNG một thành phần.' },
    ],
    approach: `
**Guard clause — chặn dữ liệu sai ngay đầu hàm**

\`\`\`python
def bump(version, part):
    phan = version.split(".")
    if len(phan) != 3:
        raise ValueError("phien ban phai co dang X.Y.Z")

    major, minor, patch = (int(p) for p in phan)

    if part == "major":
        return f"{major + 1}.0.0"
    if part == "minor":
        return f"{major}.{minor + 1}.0"
    if part == "patch":
        return f"{major}.{minor}.{patch + 1}"

    raise ValueError("part phai la major/minor/patch")
\`\`\`

Kiểu viết "kiểm tra sai thì raise/return ngay, phần thân chính không thụt sâu" gọi là **guard
clause**. So với việc bọc tất cả trong \`if hợp_lệ: ...\`, nó giữ thân hàm phẳng và đọc được từ
trên xuống.

**\`major, minor, patch = (int(p) for p in phan)\`**

Giải nén một generator expression vào ba biến. Python kiểm tra số lượng khớp, nên nếu \`phan\` có
4 phần tử bạn sẽ nhận \`ValueError: too many values to unpack\` — vẫn đúng loại lỗi đề cần. Và
\`int("x")\` cũng raise \`ValueError\`. Ở đây ta **tận dụng** việc \`int\` raise sẵn thay vì tự kiểm tra
\`isdigit()\` cho từng phần.

**Vì sao "đặt lại các phần nhỏ hơn về 0" mới là bản chất của bài?**

Vì đó là ngữ nghĩa của semver: \`1.3.0\` nói "bản này thêm tính năng so với 1.2.x", nên
\`1.2.7\` tăng minor phải ra \`1.3.0\`, chứ không phải \`1.3.7\`. Ai làm sai chỗ này sẽ tạo ra những
phiên bản không tồn tại và làm rối cả hệ thống phụ thuộc.

**Nhắc lại: so sánh phiên bản không được dùng chuỗi**

\`\`\`python
"1.10.0" > "1.9.0"    # False (!) — so từng ký tự: "1" < "9"
(1, 10, 0) > (1, 9, 0)  # True   — so tuple số mới đúng
\`\`\`

Tuple so sánh theo **thứ tự từ điển trên các phần tử**: so phần tử đầu, bằng nhau thì so phần tử
sau. Đây chính là quy tắc bạn cần cho phiên bản — nên khuôn chuẩn là
\`tuple(int(p) for p in v.split("."))\`.

**Không cần \`else\` sau chuỗi \`return\`.** Mỗi nhánh đã \`return\`, nên tới được dòng \`raise\` cuối
nghĩa là chắc chắn không nhánh nào khớp. Thêm \`else\` chỉ làm thụt lề sâu hơn mà không thêm nghĩa.
`,
    solution: `def bump(version, part):
    phan = version.split(".")
    if len(phan) != 3:
        raise ValueError("phien ban phai co dang X.Y.Z")

    major, minor, patch = (int(p) for p in phan)

    if part == "major":
        return f"{major + 1}.0.0"
    if part == "minor":
        return f"{major}.{minor + 1}.0"
    if part == "patch":
        return f"{major}.{minor}.{patch + 1}"

    raise ValueError("part phai la major/minor/patch")`,
    complexity: {
      question: 'Độ phức tạp thời gian theo độ dài n của chuỗi phiên bản?',
      options: [
        'O(n) — tách chuỗi và đổi số đều phải đọc từng ký tự',
        'O(1) vì luôn có đúng 3 phần',
        'O(n²)',
        'O(log n) theo giá trị số phiên bản',
      ],
      answer: 0,
      why: 'Số phần là hằng số (3) nhưng mỗi phần vẫn phải được đọc từng chữ số để đổi sang `int`, và f-string phải dựng chuỗi kết quả — nên chi phí tỉ lệ với độ dài chuỗi.',
    },
    realWorld: 'Chính là việc mà `npm version patch`, `poetry version minor`, `bump2version` làm. Trong CI, bước tăng phiên bản tự động này quyết định tag Git và bản phát hành — nên nó phải raise thật to khi dữ liệu sai, thay vì âm thầm phát hành lại cùng một phiên bản.',
  },
  {
    id: 'py-satisfies-spec',
    title: 'Phiên bản có thoả điều kiện phụ thuộc?',
    en: 'Does the Version Satisfy the Spec?',
    difficulty: 'Medium',
    targetMinutes: 16,
    entry: 'satisfies',
    lang: 'python',
    statement: `
Trong \`requirements.txt\`, phụ thuộc được viết dạng \`package>=1.2.0,<2.0.0\`. Viết hàm
\`satisfies(version, spec)\` trả về \`True\` nếu \`version\` thoả **mọi** điều kiện trong \`spec\`.

- \`spec\` gồm các điều kiện cách nhau bằng dấu phẩy, mỗi điều kiện là một toán tử
  (\`>=\`, \`<=\`, \`==\`, \`!=\`, \`>\`, \`<\`) rồi tới số phiên bản
- \`spec\` rỗng nghĩa là **mọi** phiên bản đều thoả
- so sánh theo **giá trị số** của từng phần, không so chuỗi (\`1.10.0\` lớn hơn \`1.9.0\`)
- toán tử lạ → \`raise ValueError\`

**Ví dụ**
- \`satisfies("1.5.0", ">=1.2.0,<2.0.0")\` → \`True\`
- \`satisfies("2.0.0", ">=1.2.0,<2.0.0")\` → \`False\`
- \`satisfies("1.10.0", ">1.9.0")\` → \`True\`
`,
    starter: `def to_tuple(v):\n    # Doi "1.2.3" thanh (1, 2, 3)\n    \n\n\ndef satisfies(version, spec):\n    # Kiem tra version thoa MOI dieu kien trong spec\n    \n`,
    tests: [
      { args: ['1.5.0', '>=1.2.0,<2.0.0'], expected: true, name: 'Nằm trong khoảng' },
      { args: ['2.0.0', '>=1.2.0,<2.0.0'], expected: false, name: 'Đúng biên trên — bị loại' },
      { args: ['1.2.0', '>=1.2.0'], expected: true, name: 'Đúng biên dưới — được nhận' },
      { args: ['1.1.9', '>=1.2.0'], expected: false, name: 'Nhỏ hơn biên dưới' },
      { args: ['1.2.3', '==1.2.3'], expected: true, name: 'Ghim đúng một phiên bản' },
      { args: ['1.10.0', '>1.9.0'], expected: true, name: 'So theo số, không so chuỗi' },
      { args: ['1.0.0', ''], expected: true, name: 'Spec rỗng — mọi phiên bản đều thoả' },
      { args: ['1.2.3', '!=1.2.3'], expected: false, name: 'Loại trừ đúng phiên bản đó' },
      { args: ['1.5.0', '>=1.2.0, <2.0.0'], expected: true, name: 'Có khoảng trắng sau dấu phẩy' },
    ],
    hints: [
      'Viết hàm phụ `to_tuple(v)` trả về `tuple(int(p) for p in v.split("."))`. Tuple so sánh được bằng `<`, `>`, `==` theo đúng thứ tự phần tử — đó là mấu chốt của cả bài.',
      'Duyệt từng điều kiện: `for dieu_kien in spec.split(",")`. Nhớ `.strip()` vì spec có thể có khoảng trắng, và `continue` khi điều kiện rỗng.',
      'Tìm toán tử bằng cách thử lần lượt `(">=", "<=", "==", "!=", ">", "<")` với `startswith` — **hai ký tự trước một ký tự**, nếu không `">="` sẽ bị nhận thành `">"` rồi phần còn lại `"=1.2.0"` không đổi được sang số.',
    ],
    diagnostics: [
      { test: '\\(\\s*["\']>["\']\\s*,\\s*["\']<["\']\\s*,\\s*["\']>=["\']', message: 'Thứ tự thử toán tử sai: `">"` khớp trước thì `">=1.2.0"` bị đọc thành toán tử `">"` với phiên bản `"=1.2.0"`. Luôn thử toán tử DÀI trước: `>=`, `<=`, `==`, `!=` rồi mới `>`, `<`.' },
      { test: 'version\\s*>=\\s*\\w+\\s*\\[|if\\s+version\\s*>', message: 'So sánh trực tiếp hai CHUỖI phiên bản là sai: `"1.10.0" > "1.9.0"` cho `False` vì so theo ký tự. Phải đổi sang tuple số trước.' },
      { test: 'return\\s+True[\\s\\S]{0,200}for\\s+dieu_kien', message: '`return True` đặt trước vòng lặp thì hàm không kiểm tra gì. Khuôn đúng: trong vòng lặp chỉ `return False` khi vi phạm, và `return True` ở SAU vòng lặp.' },
    ],
    approach: `
**Mấu chốt: tuple so sánh được**

\`\`\`python
def to_tuple(v):
    return tuple(int(p) for p in v.split("."))

(1, 10, 0) > (1, 9, 0)     # True  — so phần tử đầu, bằng thì so tiếp
(1, 2) < (1, 2, 0)         # True  — ngắn hơn thì nhỏ hơn khi tiền tố bằng nhau
\`\`\`

Python so tuple theo **thứ tự từ điển trên phần tử**: so phần tử đầu; bằng nhau thì so phần tử
sau; hết phần tử mà vẫn bằng thì tuple ngắn hơn nhỏ hơn. Quy tắc này trùng khớp với cách con
người so phiên bản, nên chỉ cần đổi sang tuple là dùng được toàn bộ toán tử \`<\`, \`>\`, \`==\`.

**Khuôn "mọi điều kiện đều phải thoả"**

\`\`\`python
def satisfies(version, spec):
    hien_tai = to_tuple(version)

    for dieu_kien in spec.split(","):
        dieu_kien = dieu_kien.strip()
        if not dieu_kien:
            continue

        for toan_tu in (">=", "<=", "==", "!=", ">", "<"):
            if dieu_kien.startswith(toan_tu):
                moc = to_tuple(dieu_kien[len(toan_tu):])
                break
        else:
            raise ValueError(f"toan tu khong hop le: {dieu_kien}")

        if toan_tu == ">=" and not hien_tai >= moc:
            return False
        if toan_tu == "<=" and not hien_tai <= moc:
            return False
        if toan_tu == "==" and not hien_tai == moc:
            return False
        if toan_tu == "!=" and not hien_tai != moc:
            return False
        if toan_tu == ">" and not hien_tai > moc:
            return False
        if toan_tu == "<" and not hien_tai < moc:
            return False

    return True
\`\`\`

Đây là khuôn ngược của bài "số âm đầu tiên": ở đó ta \`return\` khi **tìm thấy**; ở đây ta \`return
False\` khi tìm thấy **vi phạm**, và \`True\` chỉ đạt được khi đã đi hết mà không vi phạm gì. Nhờ vậy
\`spec\` rỗng tự động trả về \`True\` — không cần nhánh riêng.

**\`for ... else\` — khối \`else\` của vòng lặp**

\`\`\`python
for toan_tu in (...):
    if khop:
        break
else:
    raise ValueError(...)      # chỉ chạy khi vòng lặp KẾT THÚC MÀ KHÔNG break
\`\`\`

Hãy đọc \`else\` ở đây là **"no-break"**, đừng đọc là "ngược lại". Nó dùng đúng cho việc "tìm mãi
không thấy thì báo lỗi" — thay cho biến cờ \`tim_thay = False\`.

**Vì sao thứ tự thử toán tử quan trọng?**

\`\`\`python
">=1.2.0".startswith(">")     # True  ← khớp SỚM và SAI
\`\`\`

Nếu thử \`">"\` trước, bạn sẽ tách được toán tử \`">"\` và phần còn lại \`"=1.2.0"\` — rồi \`int("=1")\`
nổ. Quy tắc chung khi khớp tiền tố: **xếp mẫu dài trước mẫu ngắn**. Lỗi này rất hay gặp khi tự
viết bộ phân tích cú pháp cho toán tử, đường dẫn, hay tiền tố lệnh.

**Ghi chú thực tế:** phiên bản thật còn có \`1.2.3rc1\`, \`2.0.0.dev4\`, \`1.2.*\` — luật so sánh
(PEP 440) phức tạp hơn nhiều. Dự án thật dùng \`packaging.version.Version\` chứ không tự viết; bài
này để bạn hiểu cơ chế nằm dưới.
`,
    solution: `def to_tuple(v):
    return tuple(int(p) for p in v.split("."))


def satisfies(version, spec):
    hien_tai = to_tuple(version)

    for dieu_kien in spec.split(","):
        dieu_kien = dieu_kien.strip()
        if not dieu_kien:
            continue

        for toan_tu in (">=", "<=", "==", "!=", ">", "<"):
            if dieu_kien.startswith(toan_tu):
                moc = to_tuple(dieu_kien[len(toan_tu):])
                break
        else:
            raise ValueError(f"toan tu khong hop le: {dieu_kien}")

        if toan_tu == ">=" and not hien_tai >= moc:
            return False
        if toan_tu == "<=" and not hien_tai <= moc:
            return False
        if toan_tu == "==" and not hien_tai == moc:
            return False
        if toan_tu == "!=" and not hien_tai != moc:
            return False
        if toan_tu == ">" and not hien_tai > moc:
            return False
        if toan_tu == "<" and not hien_tai < moc:
            return False

    return True`,
    complexity: {
      question: 'Với spec gồm k điều kiện, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(k) — mỗi điều kiện được phân tích và so sánh một lần, độ dài phiên bản coi như hằng số',
        'O(k²) vì phải so mọi cặp điều kiện với nhau',
        'O(1) vì chỉ có 6 toán tử',
        'O(k log k) vì phải sắp xếp các điều kiện',
      ],
      answer: 0,
      why: 'Vòng lặp ngoài chạy k lần; vòng lặp trong chỉ thử tối đa 6 toán tử (hằng số) và phép so tuple cũng chỉ vài phần tử. Không có bước nào so các điều kiện với nhau, nên không thể là O(k²).',
    },
    realWorld: 'Đây là lõi của mọi bộ giải phụ thuộc: pip, npm, Cargo đều phải trả lời "phiên bản này có thoả điều kiện kia không" hàng nghìn lần khi tìm tổ hợp cài được. Hiểu nó giúp bạn đọc được lỗi `ResolutionImpossible` và biết vì sao ghim `==` quá chặt lại gây xung đột.',
  },
];

/* ==================================================================== */
/* MODULE 10 — py-context-managers                                       */
/* ==================================================================== */
const PY_CONTEXT_MANAGERS = [
  {
    id: 'py-drill-tag-writer',
    title: 'Context manager đầu tiên bằng class',
    en: 'First Context Manager (Class)',
    difficulty: 'Easy',
    targetMinutes: 9,
    entry: 'Tag',
    lang: 'python',
    harnessSrc: `def harness(Cls, args, t):
    ten, noi_dung = args
    out = []
    with Cls(out, ten):
        out.append(noi_dung)
    return out`,
    statement: `
Viết class \`Tag\` dùng được với \`with\`, ghi thẻ mở và thẻ đóng vào một list:

- \`__init__(self, out, name)\` — lưu list \`out\` và tên thẻ
- \`__enter__\` — thêm \`"<name>"\` vào \`out\`, rồi **trả về \`self\`**
- \`__exit__(self, exc_type, exc_value, traceback)\` — thêm \`"</name>"\` vào \`out\`

**Ví dụ**

\`\`\`python
out = []
with Tag(out, "b"):
    out.append("hi")
# out == ["<b>", "hi", "</b>"]
\`\`\`
`,
    starter: `class Tag:\n    def __init__(self, out, name):\n        pass\n\n    def __enter__(self):\n        pass\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        pass\n`,
    tests: [
      { args: ['b', 'hi'], expected: ['<b>', 'hi', '</b>'], name: 'Thẻ b' },
      { args: ['i', ''], expected: ['<i>', '', '</i>'], name: 'Nội dung rỗng' },
      { args: ['div', 'x'], expected: ['<div>', 'x', '</div>'], name: 'Tên thẻ dài hơn' },
      { args: ['p', 'a b'], expected: ['<p>', 'a b', '</p>'], name: 'Nội dung có khoảng trắng' },
      { args: ['h1', 'Tieu de'], expected: ['<h1>', 'Tieu de', '</h1>'], name: 'Tên thẻ có chữ số' },
    ],
    hints: [
      'Một class dùng được với `with` khi có đúng hai phương thức đặc biệt: `__enter__` và `__exit__`. Bộ đôi này gọi là *giao thức context manager*.',
      '`__exit__` **bắt buộc** nhận đúng ba tham số ngoài `self`: `exc_type`, `exc_value`, `traceback`. Nếu bên trong `with` không có lỗi, cả ba đều là `None`.',
      '`__enter__` trả về cái mà `as x` sẽ nhận. Ở đây không dùng `as` nhưng vẫn nên `return self` — đó là quy ước.',
    ],
    diagnostics: [
      { test: 'def\\s+__exit__\\s*\\(\\s*self\\s*\\)', message: '`__exit__` phải nhận ba tham số lỗi: `def __exit__(self, exc_type, exc_value, traceback)`. Thiếu chúng thì Python báo lỗi số lượng đối số ngay khi ra khỏi khối `with`.' },
      { test: 'def\\s+__enter__[\\s\\S]{0,200}return\\s+None', message: '`__enter__` nên `return self` — nếu trả về `None` thì `with Tag(...) as t` sẽ cho `t = None`, một cái bẫy rất khó thấy.' },
      { test: 'def\\s+__init__[\\s\\S]{0,200}out\\.append', message: 'Thẻ mở phải được ghi trong `__enter__`, không phải `__init__`. Tạo đối tượng và *vào* khối `with` là hai thời điểm khác nhau — `Tag(out, "b")` có thể được tạo trước rồi mới dùng sau.' },
    ],
    approach: `
**\`with\` làm gì phía sau?**

\`\`\`python
with Tag(out, "b"):
    out.append("hi")
\`\`\`

tương đương (gần đúng) với:

\`\`\`python
t = Tag(out, "b")
t.__enter__()
try:
    out.append("hi")
finally:
    t.__exit__(None, None, None)
\`\`\`

Toàn bộ giá trị của \`with\` nằm ở chữ \`finally\`: **\`__exit__\` luôn chạy** — kết thúc bình thường,
\`return\` giữa khối, hay có exception, đều chạy. Đó là lý do \`with\` là cách đúng để quản lý những
thứ "mở rồi phải đóng": file, kết nối, khoá, giao dịch.

**Lời giải**

\`\`\`python
class Tag:
    def __init__(self, out, name):
        self.out = out
        self.name = name

    def __enter__(self):
        self.out.append(f"<{self.name}>")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.out.append(f"</{self.name}>")
\`\`\`

**Ba tham số của \`__exit__\`**

| Tham số | Khi không có lỗi | Khi có lỗi |
| --- | --- | --- |
| \`exc_type\` | \`None\` | lớp của lỗi, vd \`ValueError\` |
| \`exc_value\` | \`None\` | đối tượng lỗi |
| \`traceback\` | \`None\` | đối tượng truy vết |

Nhờ ba tham số này mà \`__exit__\` **biết** khối \`with\` kết thúc êm hay có sự cố — ví dụ context
manager cho giao dịch database sẽ \`commit\` khi \`exc_type is None\` và \`rollback\` khi không.

**Giá trị \`__exit__\` trả về quyết định lỗi có bị nuốt hay không**

- \`None\` / \`False\` (như bài này, không \`return\` gì) → lỗi tiếp tục lan ra ngoài. **Đây là mặc
  định đúng.**
- \`True\` → lỗi bị **nuốt**, chương trình chạy tiếp sau khối \`with\` như không có gì.

Trả về \`True\` mà không cố ý là một trong những lỗi khó tìm nhất — nó làm biến mất exception.

**\`__enter__\` trả gì cũng được**

\`as x\` nhận đúng giá trị \`__enter__\` trả về. Thường là \`self\`, nhưng không nhất thiết:
\`open()\` trả về đối tượng file, còn một lớp \`Connection\` có thể trả về một \`cursor\`. Bài
"Giá trị mà \`as\` nhận được" ngay sau sẽ dùng đúng điểm này.
`,
    solution: `class Tag:
    def __init__(self, out, name):
        self.out = out
        self.name = name

    def __enter__(self):
        self.out.append(f"<{self.name}>")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.out.append(f"</{self.name}>")`,
    complexity: {
      question: '`with` thêm bao nhiêu chi phí so với việc gọi tay hai hàm mở/đóng?',
      options: [
        'O(1) — chỉ là hai lời gọi phương thức cộng cơ chế try/finally',
        'O(n) theo số dòng trong khối with',
        'Tăng gấp đôi vì phải chạy cả __enter__ và __exit__',
        'Không xác định',
      ],
      answer: 0,
      why: 'Chi phí đúng bằng hai lời gọi phương thức và một khối `try/finally` — đều là hằng số, không phụ thuộc nội dung khối `with`. Đổi lại là bảo đảm "luôn dọn dẹp", nên đây gần như luôn là món hời.',
    },
    realWorld: 'Mọi thứ có cặp "mở/đóng" đều nên là context manager: `open()`, kết nối database, khoá đa luồng, đo thời gian một đoạn code, tạm bật chế độ debug. Ở dạng đơn giản nhất — như bài này — nó cũng đã bảo đảm việc dọn dẹp không bao giờ bị quên.',
  },
  {
    id: 'py-drill-contextmanager-decorator',
    title: 'Cùng việc đó bằng @contextmanager',
    en: 'Same Thing with @contextmanager',
    difficulty: 'Easy',
    targetMinutes: 10,
    entry: 'tag',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    ten, noi_dung, gay_loi = args
    out = []
    try:
        with fn(out, ten):
            out.append(noi_dung)
            if gay_loi:
                raise ValueError("loi ben trong")
    except ValueError:
        out.append("caught")
    return out`,
    statement: `
Viết lại context manager ghi thẻ mở/đóng, nhưng lần này bằng **hàm generator** cùng decorator
\`@contextmanager\` thay cho class:

\`\`\`python
out = []
with tag(out, "b"):
    out.append("hi")
# out == ["<b>", "hi", "</b>"]
\`\`\`

Yêu cầu quan trọng: thẻ đóng phải được ghi **kể cả khi bên trong khối \`with\` có lỗi**, và lỗi đó
vẫn phải lan ra ngoài bình thường.
`,
    starter: `from contextlib import contextmanager\n\n\n@contextmanager\ndef tag(out, name):\n    # Ghi the mo, yield, roi ghi the dong\n    \n`,
    tests: [
      { args: ['b', 'hi', false], expected: ['<b>', 'hi', '</b>'], name: 'Không lỗi' },
      { args: ['b', 'hi', true], expected: ['<b>', 'hi', '</b>', 'caught'], name: 'Có lỗi — thẻ đóng vẫn phải được ghi TRƯỚC khi lỗi lan ra' },
      { args: ['i', '', false], expected: ['<i>', '', '</i>'], name: 'Nội dung rỗng' },
      { args: ['p', 'a', true], expected: ['<p>', 'a', '</p>', 'caught'], name: 'Có lỗi với thẻ khác' },
      { args: ['div', 'x', false], expected: ['<div>', 'x', '</div>'], name: 'Tên thẻ dài hơn' },
    ],
    hints: [
      'Phần code **trước** `yield` chạy khi vào `with` (thay cho `__enter__`); phần **sau** `yield` chạy khi ra (thay cho `__exit__`).',
      'Giá trị bạn `yield` chính là thứ `as x` nhận được. Ở đây `yield out` hay `yield` trơn đều được.',
      'Nếu bên trong `with` có lỗi, lỗi đó được "ném vào" đúng chỗ `yield` — nên phần sau `yield` sẽ **không** chạy nếu bạn không bọc `try/finally`. Đặt `yield` trong `try:` và thẻ đóng trong `finally:`.',
    ],
    diagnostics: [
      { test: 'yield[\\s\\S]{0,200}out\\.append[\\s\\S]{0,80}$(?![\\s\\S]*finally)', message: 'Không có `finally`: khi bên trong `with` raise lỗi, dòng ghi thẻ đóng sẽ bị bỏ qua hoàn toàn. Bọc `yield` trong `try:` và ghi thẻ đóng trong `finally:`.' },
      { test: 'return\\s+out', message: 'Trong hàm được `@contextmanager` trang trí phải dùng `yield`, không dùng `return` giá trị — `return` biến nó thành hàm thường và `with` sẽ báo lỗi thiếu `__enter__`.' },
      { test: 'yield[\\s\\S]*yield', message: 'Hàm context manager chỉ được `yield` ĐÚNG MỘT LẦN. Nhiều `yield` sẽ gây `RuntimeError: generator didn\'t stop`.' },
    ],
    approach: `
**Hai cách viết cùng một context manager**

\`\`\`python
from contextlib import contextmanager

@contextmanager
def tag(out, name):
    out.append(f"<{name}>")      # phần "__enter__"
    try:
        yield out                # trao quyền cho khối with
    finally:
        out.append(f"</{name}>")  # phần "__exit__" — LUÔN chạy
\`\`\`

So với bản class ở bài trước: 6 dòng thay cho 10, không có \`self\`, và thứ tự đọc đúng như thứ tự
chạy. Với context manager đơn giản, đây là cách được dùng phổ biến hơn.

**\`yield\` ở đây nghĩa là gì?**

Nó là điểm "tạm giao quyền": mọi thứ trước \`yield\` chạy lúc vào \`with\`, hàm **đứng lại** ở \`yield\`
trong khi khối \`with\` chạy, rồi tiếp tục từ sau \`yield\` khi khối kết thúc. Chính là cơ chế
generator bạn đã học ở module 5 — \`@contextmanager\` chỉ gói generator đó vào một đối tượng có
\`__enter__\`/\`__exit__\`.

**Vì sao \`try/finally\` là bắt buộc?**

Khi khối \`with\` raise, \`@contextmanager\` **ném exception đó vào chỗ \`yield\`** (bằng
\`gen.throw()\`). Không có \`try\` thì exception đi thẳng ra ngoài, và những dòng sau \`yield\` **không
bao giờ chạy** — thẻ đóng biến mất, file không được đóng, khoá không được nhả.

Đây là khác biệt đáng chú ý so với bản class: ở bản class, Python bảo đảm gọi \`__exit__\` giúp bạn;
ở bản generator, **bạn** phải tự viết \`finally\`. Quy tắc không cần suy nghĩ:
\`@contextmanager\` là \`try/finally\` quanh \`yield\`.

**Muốn nuốt lỗi thì làm sao?** Bản class trả về \`True\` từ \`__exit__\`; bản generator thì bọc
\`try/except\` và **không** raise lại:

\`\`\`python
@contextmanager
def bo_qua_loi():
    try:
        yield
    except ValueError:
        pass          # nuốt ValueError
\`\`\`

**Chọn cách nào?**

- \`@contextmanager\` — logic mở/đóng đơn giản, chạy một lần. Ngắn, dễ đọc.
- Class — khi cần lưu trạng thái, cần dùng lại nhiều lần (một đối tượng vào \`with\` nhiều lượt),
  cần kế thừa, hoặc cần đối tượng vừa là context manager vừa có API khác.

Chú ý: một context manager tạo bởi \`@contextmanager\` **chỉ dùng được một lần** (vì generator chỉ
chạy một lần) — dùng lại sẽ gặp \`RuntimeError\`. Muốn dùng nhiều lần thì gọi lại hàm để tạo cái mới.
`,
    solution: `from contextlib import contextmanager


@contextmanager
def tag(out, name):
    out.append(f"<{name}>")
    try:
        yield out
    finally:
        out.append(f"</{name}>")`,
    complexity: {
      question: 'So với bản viết bằng class, bản `@contextmanager` tốn thêm gì?',
      options: [
        'Thêm chi phí hằng số cho việc tạo generator và đối tượng bọc — vẫn là O(1)',
        'O(n) theo số dòng trong khối with',
        'Không tốn gì vì decorator chạy lúc định nghĩa',
        'Chậm hơn hẳn vì generator phải sinh nhiều giá trị',
      ],
      answer: 0,
      why: 'Mỗi lần vào `with`, Python tạo một generator và một đối tượng `_GeneratorContextManager` — nhiều hơn bản class một chút nhưng vẫn là hằng số. Khác biệt này không đáng kể trừ khi bạn vào/ra `with` hàng triệu lần trong vòng lặp nóng.',
    },
    realWorld: '`@contextmanager` là cách nhanh nhất để đóng gói một cặp "trước/sau": đo thời gian một đoạn code, tạm đổi thư mục làm việc, mở giao dịch, tạm thay cấu hình trong test (`pytest.MonkeyPatch` hoạt động y hệt). Quên `finally` là bug thật hay gặp — biểu hiện là "chỉ khi có lỗi thì tài nguyên mới bị rò rỉ", loại bug rất khó tái hiện.',
  },
  {
    id: 'py-suppress-selected',
    title: 'Context manager nuốt lỗi có chọn lọc',
    en: 'Suppress Selected Exceptions',
    difficulty: 'Medium',
    targetMinutes: 14,
    entry: 'Suppress',
    lang: 'python',
    harnessSrc: `def harness(Cls, args, t):
    loai_bat, loai_raise = args
    bang = {"ValueError": ValueError, "KeyError": KeyError, "TypeError": TypeError}
    out = []
    try:
        with Cls(*[bang[x] for x in loai_bat]):
            out.append("trong")
            if loai_raise:
                raise bang[loai_raise]("loi thu nghiem")
        out.append("sau")
    except Exception as e:
        out.append("lan ra:" + type(e).__name__)
    return out`,
    statement: `
Viết class \`Suppress\` — một context manager **nuốt** các loại lỗi được chỉ định, và để mọi loại
lỗi khác lan ra bình thường:

\`\`\`python
with Suppress(ValueError):
    raise ValueError("x")      # bị nuốt -> chương trình chạy tiếp
print("vẫn chạy tới đây")

with Suppress(ValueError):
    raise KeyError("y")        # KHÔNG bị nuốt -> lan ra ngoài
\`\`\`

- \`__init__(self, *types)\` — nhận số lượng loại lỗi tuỳ ý (có thể không có loại nào)
- \`__enter__\` — trả về \`self\`
- \`__exit__\` — trả về \`True\` **chỉ khi** lỗi thuộc một trong các loại đã chỉ định
`,
    starter: `class Suppress:\n    def __init__(self, *types):\n        pass\n\n    def __enter__(self):\n        pass\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        # Tra ve True de NUOT loi, False/None de loi lan ra\n        pass\n`,
    tests: [
      { args: [['ValueError'], 'ValueError'], expected: ['trong', 'sau'], name: 'Đúng loại — bị nuốt, chạy tiếp sau with' },
      { args: [['ValueError'], 'KeyError'], expected: ['trong', 'lan ra:KeyError'], name: 'Khác loại — lan ra ngoài' },
      { args: [['ValueError', 'KeyError'], 'KeyError'], expected: ['trong', 'sau'], name: 'Nhiều loại — khớp loại thứ hai' },
      { args: [[], null], expected: ['trong', 'sau'], name: 'Không có loại nào, cũng không có lỗi' },
      { args: [['ValueError'], null], expected: ['trong', 'sau'], name: 'Không có lỗi — không được nuốt gì' },
      { args: [[], 'ValueError'], expected: ['trong', 'lan ra:ValueError'], name: 'Không chỉ định loại nào — mọi lỗi đều lan ra' },
      { args: [['TypeError'], 'TypeError'], expected: ['trong', 'sau'], name: 'Loại thứ ba' },
    ],
    hints: [
      '`def __init__(self, *types)` gom mọi lớp lỗi vào tuple `self.types` — chính là `*args` bạn đã học ở module 2.',
      '`issubclass(exc_type, self.types)` kiểm tra lớp lỗi có thuộc (hoặc kế thừa từ) một trong các loại đã cho. Nó nhận tuple nên không cần vòng lặp.',
      'Đừng quên trường hợp **không có lỗi**: khi đó `exc_type` là `None` và `issubclass(None, ...)` sẽ raise `TypeError`. Kiểm tra `exc_type is not None` trước.',
    ],
    diagnostics: [
      { test: 'return\\s+True\\s*$', message: '`return True` vô điều kiện sẽ nuốt MỌI lỗi — kể cả loại không được chỉ định. Giá trị trả về phải phụ thuộc `exc_type`.' },
      { test: 'isinstance\\s*\\(\\s*exc_type', message: '`exc_type` là một LỚP, không phải đối tượng lỗi — nên dùng `issubclass(exc_type, ...)`. (`isinstance(exc_value, ...)` cũng đúng, vì `exc_value` mới là đối tượng.)' },
      { test: 'def\\s+__exit__[\\s\\S]{0,200}issubclass[\\s\\S]{0,200}$(?![\\s\\S]*is\\s+not\\s+None)', message: 'Thiếu kiểm tra `exc_type is not None`: khi khối `with` kết thúc êm, `exc_type` là `None` và `issubclass(None, ...)` raise `TypeError`.' },
    ],
    approach: `
**Giá trị trả về của \`__exit__\` — cái công tắc nuốt lỗi**

\`\`\`python
class Suppress:
    def __init__(self, *types):
        self.types = types

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return exc_type is not None and issubclass(exc_type, self.types)
\`\`\`

Toàn bộ hành vi nằm ở một dòng \`return\`:

- Không có lỗi → \`exc_type is None\` → biểu thức là \`False\` → không có gì để nuốt (Python bỏ qua).
- Có lỗi đúng loại → \`True\` → Python **coi như lỗi đã được xử lý**, chạy tiếp sau khối \`with\`.
- Có lỗi khác loại → \`False\` → lỗi tiếp tục lan ra ngoài.

**\`issubclass\` và \`isinstance\` — dùng đúng chỗ**

\`\`\`python
issubclass(ValueError, (ValueError, KeyError))    # True — so LỚP với lớp
isinstance(ValueError("x"), ValueError)          # True — so ĐỐI TƯỢNG với lớp
\`\`\`

Trong \`__exit__\`, \`exc_type\` là **lớp** (\`ValueError\`) còn \`exc_value\` là **đối tượng**
(\`ValueError("x")\`). Nhầm hai cái này là lỗi kinh điển ở đây.

Cả hai hàm nhận **tuple** ở tham số thứ hai và hiểu là "một trong các loại này" — nên
\`self.types\` (một tuple từ \`*types\`) dùng được trực tiếp, không cần vòng lặp. Thêm nữa,
\`issubclass(X, ())\` với tuple **rỗng** trả về \`False\` — nhờ vậy \`Suppress()\` không nuốt gì cả,
đúng như test yêu cầu, mà ta không phải viết nhánh riêng.

**Vì sao \`issubclass\` chứ không so \`==\`?**

\`\`\`python
exc_type == ValueError                # chỉ khớp CHÍNH lớp đó
issubclass(exc_type, ValueError)      # khớp cả lớp con
\`\`\`

Nếu ai đó định nghĩa \`class MyValueError(ValueError)\`, người dùng chắc chắn mong \`Suppress(ValueError)\`
bắt được nó — giống như \`except ValueError\` vẫn bắt lớp con. Dùng \`issubclass\` để hành vi của bạn
khớp với hành vi của \`except\`.

**Thư viện chuẩn đã có sẵn**

\`\`\`python
from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove("file_co_the_khong_ton_tai.txt")
\`\`\`

\`contextlib.suppress\` chính là lớp bạn vừa viết. Nó gọn hơn \`try/except ... : pass\` và nói rõ ý
"tôi CỐ Ý bỏ qua lỗi này" — đọc code không ai phải đoán xem \`pass\` là chủ ý hay là quên viết.

**Cảnh báo:** nuốt lỗi là con dao hai lưỡi. Chỉ nuốt loại lỗi **rất cụ thể** mà bạn thật sự không
quan tâm. \`with suppress(Exception)\` là cách nhanh nhất để biến một sự cố thành một bí ẩn.
`,
    solution: `class Suppress:
    def __init__(self, *types):
        self.types = types

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return exc_type is not None and issubclass(exc_type, self.types)`,
    complexity: {
      question: 'Chi phí của `__exit__` theo số loại lỗi k được chỉ định?',
      options: [
        'O(k · d) trong trường hợp xấu nhất — với d là độ sâu cây kế thừa của lớp lỗi',
        'O(1) vì chỉ so sánh một lần',
        'O(k²)',
        'O(n) theo số dòng trong khối with',
      ],
      answer: 0,
      why: '`issubclass` phải kiểm tra lớp lỗi với từng phần tử trong tuple (k phần tử), và mỗi phép kiểm tra đi theo chuỗi kế thừa (độ sâu d). Cả k và d đều rất nhỏ và không phụ thuộc dữ liệu, nên thực tế đây là hằng số.',
    },
    realWorld: '`contextlib.suppress` xuất hiện nhiều nhất ở các thao tác "dọn dẹp cho chắc": xoá file tạm có thể đã bị xoá, đóng kết nối có thể đã đóng, huỷ task có thể đã xong. Hiểu cơ chế `__exit__` trả về `True` cũng giúp bạn đọc được vì sao có những context manager làm exception "biến mất" một cách bí ẩn.',
  },
  {
    id: 'py-cm-enter-return',
    title: 'Giá trị mà `as` nhận được',
    en: 'What `as` Actually Binds',
    difficulty: 'Medium',
    targetMinutes: 15,
    entry: 'Connection',
    lang: 'python',
    harnessSrc: `def harness(Cls, args, t):
    ten, cau_lenh = args
    out = []
    conn = Cls(ten)
    with conn as cur:
        out.append(cur.run(cau_lenh))
        out.append(conn.closed)
    out.append(conn.closed)
    try:
        cur.run(cau_lenh)
        out.append("van chay")
    except RuntimeError:
        out.append("RuntimeError")
    return out`,
    statement: `
Viết hai class mô phỏng kết nối database:

**\`Connection(name)\`**
- \`closed\` — ban đầu là \`False\`
- \`__enter__\` — trả về **một \`Cursor\` mới** trỏ tới kết nối này (chú ý: **không** trả về \`self\`)
- \`__exit__\` — đặt \`closed = True\`

**\`Cursor(conn)\`**
- \`run(sql)\` — nếu kết nối đã đóng thì \`raise RuntimeError\`; ngược lại trả về chuỗi
  \`"<tên kết nối>:<sql>"\`

**Ví dụ**

\`\`\`python
conn = Connection("db1")
with conn as cur:
    cur.run("select 1")   # "db1:select 1"
    conn.closed           # False
conn.closed               # True
cur.run("select 1")       # RuntimeError
\`\`\`
`,
    starter: `class Cursor:\n    def __init__(self, conn):\n        pass\n\n    def run(self, sql):\n        pass\n\n\nclass Connection:\n    def __init__(self, name):\n        pass\n\n    def __enter__(self):\n        # Tra ve mot Cursor, KHONG phai self\n        pass\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        pass\n`,
    tests: [
      { args: ['db1', 'select 1'], expected: ['db1:select 1', false, true, 'RuntimeError'], name: 'Ví dụ trong đề' },
      { args: ['main', 'insert'], expected: ['main:insert', false, true, 'RuntimeError'], name: 'Kết nối khác, câu lệnh khác' },
      { args: ['x', ''], expected: ['x:', false, true, 'RuntimeError'], name: 'Câu lệnh rỗng' },
      { args: ['a', 'a b c'], expected: ['a:a b c', false, true, 'RuntimeError'], name: 'Câu lệnh có khoảng trắng' },
      { args: ['db2', 'SELECT *'], expected: ['db2:SELECT *', false, true, 'RuntimeError'], name: 'Giữ nguyên chữ hoa' },
    ],
    hints: [
      '`__enter__` trả về cái gì thì `as cur` nhận đúng cái đó. Ở đây `return Cursor(self)` — truyền `self` để cursor biết nó thuộc kết nối nào.',
      '`Cursor.run` cần đọc trạng thái của kết nối qua tham chiếu đã lưu: `if self.conn.closed: raise RuntimeError(...)`.',
      'Chú ý: `cur` vẫn tồn tại sau khối `with` (Python không xoá biến khi ra khỏi khối). Nó chỉ **không dùng được nữa** vì kết nối đã đóng — và đó chính là điều bài này muốn bạn thấy.',
    ],
    diagnostics: [
      { test: 'def\\s+__enter__[\\s\\S]{0,120}return\\s+self', message: 'Đề yêu cầu `__enter__` trả về một `Cursor`, không phải `self` — để bạn thấy rõ `as x` nhận giá trị TRẢ VỀ chứ không phải đối tượng đứng sau `with`.' },
      { test: 'def\\s+__exit__[\\s\\S]{0,160}return\\s+True', message: '`return True` sẽ nuốt exception. Ở bài này không cần nuốt gì — chỉ cần đặt `closed = True`, và để mặc định trả về `None`.' },
      { test: 'class\\s+Cursor[\\s\\S]{0,300}self\\.closed', message: 'Trạng thái `closed` thuộc về `Connection`, không phải `Cursor`. Cursor phải hỏi kết nối: `self.conn.closed`. Nếu mỗi bên giữ một cờ riêng, chúng sẽ lệch nhau.' },
    ],
    approach: `
**\`as\` nhận giá trị mà \`__enter__\` TRẢ VỀ — không phải đối tượng sau \`with\`**

\`\`\`python
with conn as cur:
    ...
# cur = conn.__enter__()      ← đây mới là sự thật
\`\`\`

Rất nhiều người mới tưởng \`cur\` chính là \`conn\`. Nó chỉ đúng khi \`__enter__\` \`return self\` — điều
mà **hầu hết** context manager làm, nên ngộ nhận này tồn tại lâu. Bài này cố tình làm ngược để bạn
nhìn thấy cơ chế thật.

\`\`\`python
class Cursor:
    def __init__(self, conn):
        self.conn = conn

    def run(self, sql):
        if self.conn.closed:
            raise RuntimeError("ket noi da dong")
        return f"{self.conn.name}:{sql}"


class Connection:
    def __init__(self, name):
        self.name = name
        self.closed = False

    def __enter__(self):
        return Cursor(self)          # as cur -> nhận Cursor này

    def __exit__(self, exc_type, exc_value, traceback):
        self.closed = True
\`\`\`

**Ví dụ thật của mẫu hình này**

\`\`\`python
with open("f.txt") as f:        # __enter__ trả về đối tượng file
with sqlite3.connect(":memory:") as conn:   # trả về connection, và __exit__ COMMIT chứ không đóng
with lock:                      # __enter__ trả về True/None — nên không ai viết "as"
\`\`\`

Trường hợp \`sqlite3\` là bài học đắt giá: nhiều người tưởng ra khỏi \`with\` là kết nối đóng, nhưng
nó chỉ **commit**. Kết luận: đừng đoán \`__exit__\` làm gì — đọc tài liệu, vì mỗi thư viện chọn một
ngữ nghĩa.

**Biến \`as\` vẫn sống sau khối \`with\`**

Python **không** có phạm vi riêng cho khối \`with\` (cũng như \`if\`, \`for\`). Nên sau khối \`with\`,
\`cur\` vẫn là một đối tượng hợp lệ — chỉ là dùng nó thì lỗi, vì tài nguyên phía sau đã bị giải
phóng. Đây là nguồn của lỗi thật rất hay gặp:

\`\`\`python
with open("f.txt") as f:
    data = f.read()
f.read()          # ValueError: I/O operation on closed file
\`\`\`

Và biến thể tinh vi hơn — trả một "dãy lười" ra ngoài khối \`with\`:

\`\`\`python
def doc_dong(path):
    with open(path) as f:
        return (line.strip() for line in f)   # generator, chưa đọc gì cả

for line in doc_dong("f.txt"):    # ValueError: file đã đóng!
    ...
\`\`\`

Quy tắc: **mọi việc dùng tài nguyên phải nằm TRONG khối \`with\`**. Nếu cần trả dữ liệu ra ngoài,
hãy trả về một thứ đã đọc xong (\`list(...)\`), đừng trả về thứ còn phải đọc tiếp.

**Vì sao \`Cursor\` giữ tham chiếu tới \`Connection\` thay vì tự có cờ \`closed\`?** Vì trạng thái đóng
là của kết nối. Nếu cursor giữ bản sao riêng, hai bên sẽ lệch nhau ngay khi có hai cursor. Nguyên
tắc chung: **một dữ kiện chỉ nên có một nơi lưu** — chỗ khác thì tham chiếu tới, không copy.
`,
    solution: `class Cursor:
    def __init__(self, conn):
        self.conn = conn

    def run(self, sql):
        if self.conn.closed:
            raise RuntimeError("ket noi da dong")
        return f"{self.conn.name}:{sql}"


class Connection:
    def __init__(self, name):
        self.name = name
        self.closed = False

    def __enter__(self):
        return Cursor(self)

    def __exit__(self, exc_type, exc_value, traceback):
        self.closed = True`,
    complexity: {
      question: 'Mỗi lần vào khối `with` tốn thêm bộ nhớ bao nhiêu ở thiết kế này?',
      options: [
        'O(1) — một đối tượng Cursor nhỏ giữ đúng một tham chiếu tới connection',
        'O(n) theo số câu lệnh sẽ chạy',
        'Không tốn gì vì Cursor chỉ là tham chiếu tới Connection',
        'O(n) vì mỗi cursor sao chép trạng thái của connection',
      ],
      answer: 0,
      why: '`__enter__` tạo một `Cursor` mới mỗi lần — một đối tượng hằng số kích thước, chỉ chứa tham chiếu tới connection (không sao chép trạng thái). Đây cũng là lý do mẫu hình này rẻ và an toàn: nhiều cursor cùng đọc một nguồn sự thật duy nhất.',
    },
    realWorld: 'Mẫu "connection trả về cursor/session/transaction" có ở mọi thư viện database (`sqlite3`, `psycopg`, SQLAlchemy). Hiểu rằng `as` nhận giá trị trả về giúp bạn không viết `with conn as conn2` rồi bối rối, và tránh được lỗi phổ biến nhất khi làm việc với file: dùng tài nguyên sau khi đã ra khỏi khối `with`.',
  },
];

export const DRILLS_6_10 = {
  'py-strings-regex': PY_STRINGS_REGEX,
  'py-exceptions': PY_EXCEPTIONS,
  'py-file-io': PY_FILE_IO,
  'py-packaging': PY_PACKAGING,
  'py-context-managers': PY_CONTEXT_MANAGERS,
};
