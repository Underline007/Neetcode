/**
 * LỘ TRÌNH PYTHON — MODULE 1: Cú pháp nền tảng & Kiểu dữ liệu
 */

export default [
/* ==================================================================== */
{
  id: 'py-basics',
  name: 'Cú pháp nền tảng & Kiểu dữ liệu',
  en: 'Python Fundamentals & Data Types',
  icon: '🐣',
  summary: 'Bạn đã biết lập trình qua JavaScript — module này dịch trực tiếp phản xạ JS sang "phong cách Python" (Pythonic), không dạy lại từ số 0.',
  lesson: `
## 1. Vấn đề gốc

Bạn không học lập trình từ đầu — bạn học **một ngôn ngữ mới với triết lý khác**. Python và JavaScript
đều là ngôn ngữ kiểu động (dynamic typing), nhưng khác nhau ở hai điểm gốc rễ:

1. **Python đề cao "chỉ có MỘT cách rõ ràng để làm một việc"** (Zen of Python), trong khi JS thường
   cho nhiều cách viết một thứ.
2. **Python phân biệt rạch ròi kiểu bất biến (immutable) và kiểu biến đổi được (mutable)** — đây là nguồn
   gốc của rất nhiều lỗi khi người mới học Python mang tư duy JS sang.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript | Python |
|---|---|---|
| Khai báo biến | \`let x = 5;\` | \`x = 5\` (không từ khoá, không dấu \`;\`) |
| So sánh bằng | \`===\` (nên dùng), \`==\` (ép kiểu, tránh) | chỉ có \`==\`, so sánh **giá trị**; \`is\` so sánh **định danh object** |
| Giá trị "rỗng" | \`undefined\`, \`null\` (hai loại) | chỉ có \`None\` (một loại) |
| Chuỗi định dạng | Template literal \`giá trị \${x}\` | f-string \`f"giá trị {x}"\` |
| Comment | \`// dòng\`, \`/* khối */\` | \`# dòng\` (không có comment khối thật sự) |
| Khối lệnh | \`{ }\` | **thụt đầu dòng (indentation)** — đây là cú pháp, không phải style |
| Hàm vô danh | \`(x) => x + 1\` | \`lambda x: x + 1\` (chỉ 1 biểu thức, không có statement) |

## 3. Ý tưởng cốt lõi: Mutable vs Immutable

Đây là khái niệm quan trọng nhất của module này — quan trọng hơn cú pháp.

> **Immutable (bất biến):** một khi tạo ra, giá trị không thể bị thay đổi tại chỗ. Mọi phép toán tạo ra
> **object mới**. Gồm: \`int\`, \`float\`, \`str\`, \`bool\`, \`tuple\`, \`frozenset\`, \`None\`.
>
> **Mutable (biến đổi được):** có thể thay đổi nội dung tại chỗ, cùng một object trong bộ nhớ. Gồm:
> \`list\`, \`dict\`, \`set\`.

Hệ quả trực tiếp — bẫy kinh điển:

\`\`\`python
def them(danh_sach, phan_tu):
    danh_sach.append(phan_tu)   # sửa TẠI CHỖ — ảnh hưởng tới object gốc bên ngoài hàm!
    return danh_sach

a = [1, 2]
b = them(a, 3)
print(a)   # [1, 2, 3] — a cũng đổi theo, vì list là mutable và Python truyền THAM CHIẾU tới object
\`\`\`

So với chuỗi (immutable):

\`\`\`python
def viet_hoa(s):
    s = s.upper()   # tạo CHUỖI MỚI, không sửa chuỗi gốc
    return s

x = "hi"
y = viet_hoa(x)
print(x)   # vẫn là "hi" — x không đổi vì str bất biến
\`\`\`

**Mental model đúng của Python (khác JS):** Python không truyền "theo giá trị" hay "theo tham chiếu" theo
nghĩa C++ — Python truyền **tham chiếu tới object, theo giá trị** ("pass by object reference"). Biến chỉ là
một cái tên gắn (bind) vào một object. Nếu object đó mutable và bạn sửa nó tại chỗ, mọi tên khác đang trỏ
tới cùng object đó cũng "thấy" thay đổi. Nếu bạn gán lại tên (\`s = s.upper()\`), bạn chỉ đổi hướng cái tên,
không đụng tới object gốc.

## 4. Dấu hiệu nhận biết

| Thấy trong đề bài | Nghĩ tới |
|---|---|
| "không được thay đổi input gốc" | dùng kiểu immutable, hoặc copy trước khi sửa (\`list(x)\`, \`x[:]\`, \`x.copy()\`) |
| "danh sách hằng số / khoá của dict / phần tử của set" | phải dùng \`tuple\` (list không hashable, không dùng làm khoá/phần tử set được) |
| "định dạng số/tiền tệ" | f-string với **format spec**: \`f"{x:,.2f}"\` |
| "giá trị có thể chưa tồn tại" | \`None\`, kiểm tra bằng \`is None\` — **không** dùng \`== None\` |
| "giá trị rỗng có tính là false không?" | \`0\`, \`""\`, \`[]\`, \`{}\`, \`None\`, \`False\` đều falsy — giống JS nhưng Python **không có** khái niệm \`NaN\` falsy-nhưng-khác-biệt như JS |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
# (a) f-string: nội suy + định dạng
name, score = "An", 9.5
print(f"{name} đạt {score:.1f} điểm")       # "An đạt 9.5 điểm"
print(f"{1234567:,}")                        # "1,234,567" — dấu phẩy ngăn cách nghìn
print(f"{0.256:.1%}")                        # "25.6%" — phần trăm

# (b) Gán bội & tráo giá trị — không cần biến tạm như JS
a, b = 1, 2
a, b = b, a          # tráo giá trị, Python làm "atomic" qua tuple ngầm

# (c) Kiểm tra None đúng cách
x = None
if x is None: ...     # ĐÚNG — so sánh định danh
if x == None: ...      # hoạt động nhưng KHÔNG Pythonic, tránh dùng

# (d) Floor division vs true division
7 / 2    # 3.5   (luôn ra float)
7 // 2   # 3     (floor division — làm tròn xuống, kể cả số âm: -7 // 2 == -4)
7 % 2    # 1
divmod(7, 2)  # (3, 1) — cả hai cùng lúc

# (e) Chuỗi bất biến — mọi phương thức trả về chuỗi MỚI
s = "  Hello World  "
s.strip().lower().replace("world", "python")  # không đổi s gốc
\`\`\`

## 6. Bẫy thường gặp

- **\`== None\` thay vì \`is None\`**: hoạt động đúng trong hầu hết trường hợp nhưng không phải quy ước
  Pythonic; \`is\` so sánh định danh object (\`None\` là singleton duy nhất) nên nhanh và rõ ràng hơn.
- **Nhầm \`/\` và \`//\`**: \`/\` luôn trả về \`float\` (kể cả \`4 / 2 == 2.0\`), đây là khác biệt lớn so với
  nhiều ngôn ngữ. Muốn số nguyên phải dùng \`//\` tường minh.
- **Tưởng gán là copy**: \`b = a\` với \`a\` là list KHÔNG tạo bản sao — \`b\` chỉ là tên thứ hai trỏ tới
  cùng object. Sửa qua \`b\` sẽ ảnh hưởng \`a\`. Muốn copy thật: \`b = a[:]\` hoặc \`b = a.copy()\` hoặc
  \`b = list(a)\` (đều là **shallow copy** — copy tầng ngoài, phần tử lồng bên trong vẫn dùng chung).
- **Định dạng số bằng \`round()\` rồi \`str()\`**: \`str(round(5, 2))\` cho \`"5"\`, mất số 0 ở cuối. Dùng
  format spec \`f"{5:.2f}"\` cho \`"5.00"\` mới đúng ý định dạng hiển thị.

## 7. Ứng dụng thực tế

- **API trả dữ liệu tài chính**: luôn định dạng tiền tệ bằng format spec chuẩn, không nối chuỗi thủ công
  (tránh sai lệch làm tròn giữa các nơi hiển thị).
- **Cấu hình bất biến (immutable config)**: dùng \`tuple\`/\`frozenset\` cho các hằng số dùng chung giữa
  nhiều luồng (thread) — tránh bug do một luồng vô tình sửa dữ liệu luồng khác đang đọc.
- **Phân biệt "chưa có dữ liệu" và "dữ liệu là 0/rỗng"**: \`None\` dùng để báo "không có", tách bạch khỏi
  giá trị hợp lệ \`0\` hoặc chuỗi rỗng — nền tảng của các API thiết kế tốt.
`,
  quiz: [
    {
      q: 'Đoạn code sau in ra gì?\n\ndef them(ds):\n    ds.append(99)\n\na = [1, 2]\nthem(a)\nprint(a)',
      options: ['[1, 2]', '[1, 2, 99]', 'Lỗi vì không return', 'None'],
      answer: 1,
      why: '`list` là kiểu mutable. Tham số `ds` bên trong hàm trỏ tới CÙNG object với `a` bên ngoài, nên `ds.append(99)` sửa tại chỗ và `a` cũng thay đổi theo — dù hàm không `return` gì cả.',
    },
    {
      q: 'Vì sao nên dùng `is None` thay vì `== None` để kiểm tra giá trị rỗng?',
      options: [
        '`== None` sẽ luôn báo lỗi cú pháp',
        '`is` so sánh định danh object (None là singleton duy nhất trong toàn chương trình) — đây là quy ước Pythonic, rõ ràng và nhanh hơn `==`',
        '`is None` nhanh hơn vì Python biên dịch riêng cho từ khoá này',
        'Không có sự khác biệt, chỉ là sở thích cá nhân',
      ],
      answer: 1,
      why: 'None chỉ có DUY NHẤT một instance trong suốt vòng đời chương trình Python, nên so sánh định danh (`is`) là cách chính xác và được cộng đồng Python quy ước sử dụng, dù `==` vẫn cho kết quả đúng trong thực tế.',
    },
    {
      q: 'Biểu thức `7 // 2` và `7 / 2` trong Python lần lượt cho kết quả nào?',
      options: ['3 và 3.5', '3.5 và 3', '4 và 3.5', '3 và 3'],
      answer: 0,
      why: '`/` luôn là true division, LUÔN trả về float (kể cả khi chia hết). `//` là floor division, làm tròn xuống về số nguyên gần nhất (chú ý: với số âm, `-7 // 2 == -4`, không phải `-3`).',
    },
    {
      q: '`b = a` với `a` là một list. Sau đó `b.append(4)`. Điều gì đúng?',
      options: [
        '`a` không đổi vì `b` là bản sao độc lập',
        '`a` cũng có thêm phần tử 4, vì `b` chỉ là tên thứ hai trỏ tới cùng object list với `a`',
        'Python sẽ báo lỗi vì không được gán list trực tiếp',
        'Chỉ `b` thay đổi, trừ khi dùng từ khoá `mutable`',
      ],
      answer: 1,
      why: 'Gán (`=`) trong Python không copy object — nó chỉ tạo thêm một TÊN trỏ tới object đã có. Với list (mutable), sửa qua tên nào cũng ảnh hưởng object dùng chung. Muốn bản sao độc lập phải copy tường minh: `b = a.copy()`.',
    },
  ],
  problems: [
    {
      id: 'py-format-price',
      title: 'Định dạng giá tiền',
      en: 'Format Price',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'format_price',
      lang: 'python',
      statement: `
Viết hàm \`format_price(amount, currency)\` trả về chuỗi biểu diễn số tiền với:
- Dấu phẩy ngăn cách hàng nghìn
- Đúng **2 chữ số thập phân**
- Theo sau bởi mã tiền tệ, cách nhau một khoảng trắng

**Ví dụ**
- \`format_price(1234.5, "USD")\` → \`"1,234.50 USD"\`
- \`format_price(5, "USD")\` → \`"5.00 USD"\`
- \`format_price(1234567.891, "JPY")\` → \`"1,234,567.89 JPY"\`

> Không được dùng \`round()\` rồi nối chuỗi thủ công — hãy dùng đúng công cụ định dạng của Python.
`,
      starter: `def format_price(amount, currency):\n    # Trả về chuỗi dạng "1,234.50 USD"\n    \n`,
      tests: [
        { args: [1234.5, 'USD'], expected: '1,234.50 USD', name: 'Ví dụ cơ bản' },
        { args: [0, 'VND'], expected: '0.00 VND', name: 'Số 0' },
        { args: [999999.9, 'EUR'], expected: '999,999.90 EUR', name: 'Gần triệu' },
        { args: [1234567.891, 'JPY'], expected: '1,234,567.89 JPY', name: 'Làm tròn xuống chữ số thứ 3' },
        { args: [5, 'USD'], expected: '5.00 USD', name: 'Số nguyên, cần thêm .00' },
        { args: [-42.5, 'USD'], expected: '-42.50 USD', name: 'Số âm' },
      ],
      hints: [
        'f-string cho phép định dạng số ngay bên trong dấu ngoặc nhọn bằng cú pháp `f"{value:...}"`. Phần sau dấu hai chấm gọi là "format spec".',
        'Dấu `,` trong format spec thêm dấu phẩy ngăn cách hàng nghìn; `.2f` làm tròn về đúng 2 chữ số thập phân (kể cả khi số nguyên). Kết hợp: `f"{amount:,.2f}"`.',
        'Ghép thêm đơn vị tiền tệ vào cuối: `f"{amount:,.2f} {currency}"`. Không cần gọi `round()` — format spec đã tự làm tròn khi hiển thị.',
      ],
      diagnostics: [
        { test: 'str\\s*\\(\\s*round\\s*\\(', message: '`str(round(x, 2))` sẽ làm MẤT số 0 ở cuối (vd: 5.0 thành "5.0" chứ không phải "5.00"). Hãy dùng format spec `f"{x:,.2f}"` thay vì round() + str().' },
      ],
      approach: `
**f-string không chỉ nội suy — nó có cả một "mini-ngôn ngữ" định dạng** nằm sau dấu hai chấm, gọi là
*format spec*. Cú pháp tổng quát: \`f"{giá_trị:[,][.precisionf]}"\`.

- \`,\` → chèn dấu phẩy ngăn cách hàng nghìn.
- \`.2f\` → ép về **fixed-point** với đúng 2 chữ số thập phân (làm tròn nếu cần, luôn hiện đủ 2 số kể
  cả khi là \`.00\`).

Đây là điểm khác biệt quan trọng so với JS: JS cần gọi phương thức riêng
(\`toLocaleString()\`, \`toFixed()\`), còn Python gộp tất cả vào cú pháp f-string — nhanh và ít lỗi gõ hơn.

**Vì sao không nên tự làm tròn bằng \`round()\` rồi nối chuỗi?** Vì \`round(5, 2)\` trả về \`5.0\` (một số
\`float\`, Python không giữ số 0 vô nghĩa), và \`str(5.0)\` chỉ là \`"5.0"\` — sai định dạng hiển thị tiền tệ.
Format spec xử lý đúng việc "hiển thị" tách biệt khỏi "giá trị số học", đây là nguyên tắc thiết kế tốt cần
mang đi: đừng làm tròn giá trị số để phục vụ hiển thị, hãy định dạng lúc hiển thị.
`,
      solution: `def format_price(amount, currency):
    return f"{amount:,.2f} {currency}"`,
      complexity: {
        question: 'Tạo chuỗi kết quả bằng format spec `:,.2f` tốn độ phức tạp thời gian bao nhiêu, tính theo số chữ số d của amount?',
        options: ['O(1) vì Python xử lý số nguyên khối', 'O(d) — tuyến tính theo số chữ số cần xử lý', 'O(d²)', 'O(log d)'],
        answer: 1,
        why: 'Việc chèn dấu phẩy và làm tròn phải duyệt qua từng nhóm chữ số của phần nguyên và phần thập phân, nên chi phí tỉ lệ thuận với số lượng chữ số — O(d), không phải hằng số.',
      },
      realWorld: 'Hiển thị hoá đơn, báo cáo tài chính, dashboard doanh thu: luôn định dạng tại lớp hiển thị (view layer) bằng công cụ chuẩn của ngôn ngữ, tránh mỗi nơi tự viết một kiểu làm tròn/nối chuỗi khác nhau gây sai lệch số liệu giữa các màn hình.',
    },
    {
      id: 'py-to-hms',
      title: 'Đổi giây sang giờ:phút:giây',
      en: 'Seconds to H:M:S',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'to_hms',
      lang: 'python',
      statement: `
Viết hàm \`to_hms(total_seconds)\` nhận số giây (số nguyên không âm), trả về **tuple** \`(giờ, phút, giây)\`.

**Ví dụ**
- \`to_hms(0)\` → \`(0, 0, 0)\`
- \`to_hms(3661)\` → \`(1, 1, 1)\`
- \`to_hms(86399)\` → \`(23, 59, 59)\`
`,
      starter: `def to_hms(total_seconds):\n    # Trả về tuple (gio, phut, giay)\n    \n`,
      tests: [
        { args: [0], expected: [0, 0, 0], name: '0 giây' },
        { args: [59], expected: [0, 0, 59], name: 'Dưới 1 phút' },
        { args: [60], expected: [0, 1, 0], name: 'Đúng 1 phút' },
        { args: [3661], expected: [1, 1, 1], name: '1 giờ 1 phút 1 giây' },
        { args: [10799], expected: [2, 59, 59], name: 'Gần 3 giờ' },
        { args: [86399], expected: [23, 59, 59], name: 'Gần hết 1 ngày' },
      ],
      hints: [
        'Bạn cần tách `total_seconds` thành ba phần dựa trên phép chia số nguyên. Có bao nhiêu giây trong 1 giờ? Trong 1 phút?',
        'Toán tử `//` (floor division) cho phần nguyên, `%` cho phần dư. `gio = total_seconds // 3600`, phần còn lại xử lý tiếp cho phút/giây.',
        'Python có hàm dựng sẵn `divmod(a, b)` trả về `(a // b, a % b)` cùng lúc — dùng hai lần để có cả 3 giá trị, gọn hơn viết `//` và `%` riêng lẻ.',
      ],
      diagnostics: [
        { test: '(?<!/)/\\s*3600', message: 'Bạn đang dùng phép chia thực `/` — kết quả sẽ là số thực (float) như 1.5 giờ, không phải số giờ nguyên. Hãy dùng `//` (floor division) hoặc `divmod()`.' },
      ],
      approach: `
Đây là bài luyện phản xạ **floor division** — khác biệt lớn nhất giữa Python và JavaScript ở tầng số học.

JS chỉ có một phép chia \`/\`, luôn ra số thực, muốn lấy phần nguyên phải gọi \`Math.floor(a / b)\`. Python
có sẵn **hai toán tử tách biệt**: \`/\` (true division, luôn float) và \`//\` (floor division, làm tròn về
âm vô cực — khác với "cắt phần thập phân" khi có số âm).

**Cách gọn nhất — \`divmod()\`:**

\`\`\`python
def to_hms(total_seconds):
    hours, remainder = divmod(total_seconds, 3600)   # vừa chia vừa lấy dư trong 1 bước
    minutes, seconds = divmod(remainder, 60)
    return hours, minutes, seconds
\`\`\`

Chú ý \`return hours, minutes, seconds\` (không có ngoặc) vẫn tạo ra một **tuple** — dấu phẩy mới là thứ
tạo tuple, ngoặc đơn chỉ là tuỳ chọn để dễ đọc.
`,
      solution: `def to_hms(total_seconds):
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return hours, minutes, seconds`,
      complexity: {
        question: 'Độ phức tạp thời gian của to_hms theo giá trị đầu vào total_seconds?',
        options: ['O(1) — số phép toán cố định, không phụ thuộc độ lớn total_seconds', 'O(log n)', 'O(n)', 'O(n²)'],
        answer: 0,
        why: 'Chỉ có đúng 2 lệnh divmod (mỗi lệnh là phép toán phần cứng cơ bản), không có vòng lặp — thời gian chạy không đổi dù total_seconds là 1 hay 1 tỷ.',
      },
      realWorld: 'Hiển thị thời lượng video/podcast, đồng hồ đếm ngược, định dạng thời gian chạy job trong log hệ thống ("hoàn thành sau 01:23:45").',
    },
    {
      id: 'py-safe-average',
      title: 'Tính trung bình an toàn',
      en: 'Safe Average',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'safe_average',
      lang: 'python',
      statement: `
Viết hàm \`safe_average(nums)\` trả về **trung bình cộng** của danh sách số. Nếu danh sách **rỗng**, trả về
\`None\` thay vì gây lỗi chia cho 0.

**Quan trọng:** \`None\` (chưa có dữ liệu) phải được phân biệt rõ với \`0\` (trung bình thật sự bằng 0).

**Ví dụ**
- \`safe_average([1, 2, 3])\` → \`2.0\`
- \`safe_average([])\` → \`None\`
- \`safe_average([0, 0, 0])\` → \`0.0\` (không phải \`None\`!)
`,
      starter: `def safe_average(nums):\n    # Trả về trung bình cộng, hoặc None nếu nums rỗng\n    \n`,
      tests: [
        { args: [[1, 2, 3]], expected: 2.0, name: 'Ví dụ cơ bản' },
        { args: [[]], expected: null, name: 'Danh sách rỗng -> None' },
        { args: [[5]], expected: 5.0, name: 'Một phần tử' },
        { args: [[0, 0, 0]], expected: 0.0, name: 'Toàn số 0 -> vẫn phải là 0.0, KHÔNG phải None' },
        { args: [[-2, 2]], expected: 0.0, name: 'Số âm và dương triệt tiêu' },
        { args: [[1, 2]], expected: 1.5, name: 'Kết quả có phần thập phân' },
      ],
      hints: [
        'Danh sách rỗng là falsy trong Python (giống JS coi `[]` khác nhưng ở đây tương tự): `if not nums:` sẽ đúng khi `nums == []`. Hãy xử lý trường hợp này ĐẦU TIÊN, trước khi chia.',
        'Khi `nums` không rỗng: dùng hai hàm dựng sẵn `sum(nums)` và `len(nums)` rồi chia cho nhau.',
        'Bẫy cần tránh: đừng viết `if not average: return None` ở CUỐI hàm — vì `0.0` cũng là falsy, bạn sẽ vô tình biến kết quả hợp lệ 0.0 thành None. Phải kiểm tra rỗng TRƯỚC khi tính, không kiểm tra kết quả SAU khi tính.',
      ],
      diagnostics: [
        { test: 'except\\s+ZeroDivisionError', message: 'Dùng try/except để bắt lỗi chia cho 0 hoạt động được, nhưng không rõ ràng bằng cách kiểm tra `if not nums:` NGAY từ đầu — đây là bài luyện phản xạ "kiểm tra trước khi làm", không phải "làm rồi bắt lỗi".' },
      ],
      approach: `
Bài này luyện đúng bẫy Python kinh điển: **falsy không đồng nghĩa với "không có dữ liệu"**.

Trong Python, các giá trị sau đều falsy: \`None\`, \`False\`, \`0\`, \`0.0\`, \`""\`, \`[]\`, \`{}\`, \`set()\`.
Điều này giống JS, nhưng cái bẫy nằm ở chỗ: **kết quả tính toán hợp lệ (0.0) và "không có kết quả" (None)
đều falsy như nhau** — nếu bạn kiểm tra sai vị trí, bạn sẽ nhầm lẫn hai trường hợp hoàn toàn khác nghĩa.

**Nguyên tắc đúng:** kiểm tra "input có hợp lệ để tính không" TRƯỚC khi tính, đừng suy luận ngược từ kết quả:

\`\`\`python
def safe_average(nums):
    if not nums:          # kiểm tra ĐẦU VÀO — đúng chỗ
        return None
    return sum(nums) / len(nums)
\`\`\`

Đây chính là nguyên tắc thiết kế API tốt: hàm nên trả về \`None\` để nói "không có gì để tính", và trả về
giá trị số thật (kể cả 0) để nói "đã tính, kết quả là 0" — hai ý nghĩa này không được lẫn vào nhau.
`,
      solution: `def safe_average(nums):
    if not nums:
        return None
    return sum(nums) / len(nums)`,
      complexity: {
        question: 'safe_average có độ phức tạp thời gian nào theo số phần tử n của nums?',
        options: ['O(1)', 'O(n) — sum(nums) phải duyệt qua toàn bộ phần tử', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: '`sum(nums)` cộng dồn từng phần tử một, nên chi phí tuyến tính theo n. `len(nums)` là O(1) vì Python list lưu sẵn độ dài, không cần đếm.',
      },
      realWorld: 'Tính điểm trung bình/rating trung bình sản phẩm khi chưa có đánh giá nào — trả `None` để giao diện hiển thị "Chưa có đánh giá" thay vì crash server vì chia cho 0, hoặc hiển thị nhầm "0 sao" khi thực ra là chưa có dữ liệu.',
    },
  ],
},
];
