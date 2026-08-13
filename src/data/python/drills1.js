/**
 * BÀI LUYỆN CÚ PHÁP — MODULE 1..5
 *   1. py-basics             2. py-control-flow      3. py-data-structures
 *   4. py-oop                5. py-functional
 *
 * Mỗi module 4 bài, xếp từ dễ đến khó: 2 bài luyện đúng một điểm cú pháp → 1 bài vừa →
 * 1 bài có kịch bản. Xem drills.js để biết cách các bài này được ghép vào module.
 */

/* ==================================================================== */
/* MODULE 1 — py-basics                                                  */
/* ==================================================================== */
const PY_BASICS = [
  {
    id: 'py-drill-three-divisions',
    title: 'Ba kiểu chia của Python',
    en: 'Three Kinds of Division',
    difficulty: 'Easy',
    targetMinutes: 6,
    entry: 'divide_three_ways',
    lang: 'python',
    statement: `
Viết hàm \`divide_three_ways(a, b)\` trả về **tuple 3 giá trị** theo đúng thứ tự:

1. \`a / b\` — chia thường (luôn ra số thực)
2. \`a // b\` — chia lấy phần nguyên
3. \`a % b\` — lấy phần dư

**Ví dụ**
- \`divide_three_ways(7, 2)\` → \`(3.5, 3, 1)\`
- \`divide_three_ways(-7, 2)\` → \`(-3.5, -4, 1)\`

> Bài này chỉ có một dòng \`return\`. Mục đích là để bạn TỰ THẤY \`-7 // 2\` ra \`-4\` chứ không
> phải \`-3\` — Python làm tròn xuống (về phía âm vô cực), không phải cắt phần thập phân.
`,
    starter: `def divide_three_ways(a, b):\n    # Trả về tuple (chia thuong, chia nguyen, phan du)\n    \n`,
    tests: [
      { args: [7, 2], expected: [3.5, 3, 1], name: 'Ví dụ cơ bản' },
      { args: [10, 5], expected: [2.0, 2, 0], name: 'Chia hết — chú ý 10 / 5 vẫn là 2.0' },
      { args: [1, 3], expected: [0.3333333333333333, 0, 1], name: 'Kết quả lặp vô hạn' },
      { args: [-7, 2], expected: [-3.5, -4, 1], name: 'Số bị chia âm — bẫy làm tròn' },
      { args: [7, -2], expected: [-3.5, -4, -1], name: 'Số chia âm — phần dư mang dấu của số chia' },
      { args: [0, 5], expected: [0.0, 0, 0], name: 'Số 0' },
    ],
    hints: [
      'Ba toán tử cần dùng đã có sẵn trong đề: `/`, `//`, `%`. Không cần import gì, không cần vòng lặp.',
      'Dấu phẩy là thứ tạo ra tuple, không phải dấu ngoặc. `return a / b, a // b, a % b` đã trả về một tuple 3 phần tử.',
      'Đừng thay `a // b` bằng `int(a / b)`: với số âm, `int()` cắt phần thập phân (`int(-3.5)` = `-3`) còn `//` làm tròn xuống (`-7 // 2` = `-4`). Hai kết quả khác nhau.',
    ],
    diagnostics: [
      { test: 'int\\s*\\(\\s*a\\s*/\\s*b', message: '`int(a / b)` KHÔNG giống `a // b` khi có số âm: `int(-7/2)` = `-3` (cắt phần thập phân) còn `-7 // 2` = `-4` (làm tròn xuống). Hãy dùng thẳng `//`.' },
      { test: 'math\\.floor', message: 'Không cần `math.floor()` — Python có sẵn toán tử `//` làm đúng việc đó, và `//` còn hoạt động với số nguyên lớn mà không mất chính xác.' },
    ],
    approach: `
**Đọc từng ký hiệu**

- \`/\` là *true division*. Kể cả khi chia hết, kết quả vẫn là số thực: \`10 / 5\` ra \`2.0\` (có \`.0\`).
- \`//\` là *floor division* — "floor" nghĩa là làm tròn **xuống**, về phía số nhỏ hơn.
- \`%\` là *modulo*, lấy phần dư.

**Chỗ dễ sai nhất: số âm**

\`\`\`python
7 // 2    # 3
-7 // 2   # -4  ← không phải -3
int(-7 / 2)  # -3  ← int() cắt phần thập phân, KHÁC //
\`\`\`

Vì sao \`-4\`? Vì Python chọn quy tắc "làm tròn xuống" để giữ đúng đẳng thức
\`b * (a // b) + (a % b) == a\`. Kiểm tra: \`2 * (-4) + 1 = -7\` ✓.

Kéo theo đó, **dấu của phần dư đi theo số CHIA**, không đi theo số bị chia:

\`\`\`python
-7 % 2    # 1   (số chia là 2 → dư dương)
7 % -2    # -1  (số chia là -2 → dư âm)
\`\`\`

Đây là điểm khác JavaScript: trong JS \`-7 % 2\` ra \`-1\`. Nếu bạn từng viết \`i % n\` để
"quay vòng" chỉ số thì trong Python nó chạy đúng cả với số âm, còn trong JS thì không.

**Tạo tuple**

\`\`\`python
def divide_three_ways(a, b):
    return a / b, a // b, a % b
\`\`\`

Không có dấu ngoặc nào ở đây nhưng hàm vẫn trả về tuple \`(3.5, 3, 1)\` — vì **dấu phẩy tạo tuple**.
Viết thêm ngoặc \`return (a / b, a // b, a % b)\` cũng đúng, chỉ là để đọc cho rõ.
`,
    solution: `def divide_three_ways(a, b):
    return a / b, a // b, a % b`,
    complexity: {
      question: 'Ba phép chia này tốn độ phức tạp thời gian bao nhiêu với số nguyên nhỏ?',
      options: [
        'O(1) — mỗi phép chia là một lệnh của CPU, số lượng phép toán không đổi',
        'O(n) theo giá trị của a',
        'O(log a) vì phải chia liên tiếp',
        'O(3) — đúng bằng số phép chia',
      ],
      answer: 0,
      why: 'Không có vòng lặp nào: đúng ba phép toán số học, mỗi phép là một lệnh phần cứng. "O(3)" không phải cách viết hợp lệ — hằng số luôn được rút về O(1).',
    },
    realWorld: 'Mọi chỗ cần "chia thành nhóm và biết phần lẻ": chia trang (phân trang), chia hàng vào thùng, đổi đơn vị (giây → phút). Dùng sai `/` thay cho `//` là lỗi kinh điển khiến số trang ra 3.5 rồi crash lúc dùng làm chỉ số.',
  },
  {
    id: 'py-drill-intro-card',
    title: 'Thẻ giới thiệu bằng f-string',
    en: 'Intro Card with f-string',
    difficulty: 'Easy',
    targetMinutes: 7,
    entry: 'intro_card',
    lang: 'python',
    statement: `
Viết hàm \`intro_card(name, age, city)\` trả về một chuỗi theo đúng khuôn:

\`\`\`
Ten Viet Hoa | 25 tuoi | Thanh pho
\`\`\`

Quy tắc:
- \`name\`: bỏ khoảng trắng ở hai đầu, rồi viết **hoa chữ đầu mỗi từ**
- \`age\`: chèn nguyên giá trị số vào chuỗi
- \`city\`: chỉ bỏ khoảng trắng ở hai đầu, giữ nguyên chữ

Ba phần cách nhau bằng dấu \` | \` (khoảng trắng, sổ đứng, khoảng trắng).

**Ví dụ**
- \`intro_card("an", 25, "Ha Noi")\` → \`"An | 25 tuoi | Ha Noi"\`
- \`intro_card("  nguyen van a  ", 30, " Da Nang ")\` → \`"Nguyen Van A | 30 tuoi | Da Nang"\`
`,
    starter: `def intro_card(name, age, city):\n    # Tra ve chuoi dang "An | 25 tuoi | Ha Noi"\n    \n`,
    tests: [
      { args: ['an', 25, 'Ha Noi'], expected: 'An | 25 tuoi | Ha Noi', name: 'Ví dụ cơ bản' },
      { args: ['  nguyen van a  ', 30, ' Da Nang '], expected: 'Nguyen Van A | 30 tuoi | Da Nang', name: 'Có khoảng trắng thừa hai đầu' },
      { args: ['AN', 1, 'Hue'], expected: 'An | 1 tuoi | Hue', name: 'Tên viết hoa hết — vẫn phải về dạng "An"' },
      { args: ['mai', 0, 'Hoi An'], expected: 'Mai | 0 tuoi | Hoi An', name: 'Tuổi bằng 0' },
      { args: ['tran binh', 45, 'Can Tho'], expected: 'Tran Binh | 45 tuoi | Can Tho', name: 'Tên hai từ' },
    ],
    hints: [
      'f-string là chuỗi có chữ `f` ngay trước dấu nháy: `f"..."`. Mọi thứ đặt trong `{}` bên trong nó sẽ được thay bằng giá trị.',
      '`name.strip()` bỏ khoảng trắng hai đầu, `.title()` viết hoa chữ đầu mỗi từ. Gọi nối tiếp được: `name.strip().title()`.',
      'Số không cần đổi sang chuỗi: `f"{age} tuoi"` tự gọi `str(age)` giúp bạn. Chỉ khi nối bằng dấu `+` mới bắt buộc `str(age)`.',
    ],
    diagnostics: [
      { test: '["\']\\s*\\+\\s*str\\s*\\(', message: 'Nối chuỗi bằng `+` và `str()` thì chạy được nhưng dài và dễ quên khoảng trắng. Bài này để luyện f-string: `f"{a} | {b}"`.' },
      { test: '\\.upper\\s*\\(\\s*\\)', message: '`.upper()` biến TẤT CẢ thành chữ hoa ("AN"). Đề cần hoa chữ đầu mỗi từ — đó là `.title()`.' },
    ],
    approach: `
**f-string đọc thế nào?**

\`\`\`python
f"{name} | {age} tuoi"
 ▲  ▲                   f = format, bật chế độ nội suy
    └── mọi thứ trong {} được TÍNH rồi thay bằng kết quả
\`\`\`

Bên trong \`{}\` bạn được viết cả biểu thức, kể cả gọi phương thức:

\`\`\`python
def intro_card(name, age, city):
    return f"{name.strip().title()} | {age} tuoi | {city.strip()}"
\`\`\`

**Ba phương thức chuỗi vừa dùng**

- \`.strip()\` → bỏ khoảng trắng (và \`\\n\`, \`\\t\`) ở **hai đầu**, không đụng vào giữa.
- \`.title()\` → \`"nguyen van a"\` thành \`"Nguyen Van A"\`.
- Gọi nối tiếp \`a.strip().title()\` chạy từ trái sang phải: strip trước, title sau.

**Chuỗi trong Python là bất biến (immutable)**

\`name.strip()\` **không** sửa \`name\`; nó trả về chuỗi MỚI. Nếu muốn giữ lại thì phải gán:
\`name = name.strip()\`. Người mới rất hay viết \`name.strip()\` một dòng riêng rồi thắc mắc sao
không có gì thay đổi.

**Vì sao không nối bằng dấu \`+\`?**

\`\`\`python
return name.strip().title() + " | " + str(age) + " tuoi | " + city.strip()
\`\`\`

Chạy đúng, nhưng: dài hơn, bắt buộc \`str(age)\` (Python không tự đổi số sang chuỗi khi dù\`+\`),
và rất dễ đếm sai khoảng trắng. f-string cho bạn thấy luôn *hình dạng* chuỗi kết quả.
`,
    solution: `def intro_card(name, age, city):
    return f"{name.strip().title()} | {age} tuoi | {city.strip()}"`,
    complexity: {
      question: 'Độ phức tạp thời gian theo tổng độ dài n của các chuỗi đầu vào?',
      options: ['O(1)', 'O(n) — mỗi ký tự được đọc/ghi một số lần cố định', 'O(n²) vì nối chuỗi nhiều lần', 'O(n log n)'],
      answer: 1,
      why: '`strip()`, `title()` và việc dựng chuỗi kết quả đều phải duyệt qua từng ký tự đúng vài lượt, nên chi phí tỉ lệ thuận với độ dài đầu vào.',
    },
    realWorld: 'Dựng nội dung hiển thị: tên trên hoá đơn, dòng tiêu đề email, nhãn in thẻ. Chuẩn hoá bằng `strip()` ngay tại lớp nhận dữ liệu là cách chặn lỗi "hai tài khoản khác nhau chỉ vì một dấu cách ở cuối tên".',
  },
  {
    id: 'py-receipt-line',
    title: 'Dòng hoá đơn thẳng cột',
    en: 'Aligned Receipt Line',
    difficulty: 'Medium',
    targetMinutes: 12,
    entry: 'receipt_line',
    lang: 'python',
    statement: `
Máy in hoá đơn dùng phông chữ đơn cách (mỗi ký tự rộng bằng nhau) nên muốn thẳng cột thì phải
**chèn khoảng trắng cho đủ độ rộng**. Viết hàm \`receipt_line(name, qty, unit_price)\` trả về một dòng:

- tên hàng: căn **lề trái** trong **12** ký tự (tên luôn dài không quá 12)
- ngay sau đó là chữ \`x\` rồi số lượng căn **lề phải** trong **3** ký tự
- rồi \` =\` và thành tiền (\`qty * unit_price\`) căn **lề phải** trong **12** ký tự, có dấu phẩy
  ngăn cách hàng nghìn, **không có** số thập phân

**Ví dụ** (dấu \`·\` bên dưới là khoảng trắng, chỉ để bạn đếm)

\`\`\`
Ca phe······x··2·=······50,000
Kem·········x100·=···1,200,000
\`\`\`
`,
    starter: `def receipt_line(name, qty, unit_price):\n    # Tra ve mot dong hoa don da can le\n    \n`,
    tests: [
      { args: ['Ca phe', 2, 25000], expected: 'Ca phe      x  2 =      50,000', name: 'Ví dụ cơ bản' },
      { args: ['Tra da', 10, 3000], expected: 'Tra da      x 10 =      30,000', name: 'Số lượng 2 chữ số' },
      { args: ['Kem', 100, 12000], expected: 'Kem         x100 =   1,200,000', name: 'Số lượng chiếm hết 3 ký tự' },
      { args: ['Bun bo Hue', 3, 40000], expected: 'Bun bo Hue  x  3 =     120,000', name: 'Tên 10 ký tự' },
      { args: ['Nem', 1, 0], expected: 'Nem         x  1 =           0', name: 'Thành tiền bằng 0' },
      { args: ['Combo bua tr', 1, 99000], expected: 'Combo bua trx  1 =      99,000', name: 'Tên đúng 12 ký tự — không còn khoảng đệm nào' },
    ],
    hints: [
      'Trong f-string, phần sau dấu hai chấm gọi là *format spec*: `f"{value:spec}"`. Với chuỗi, `:<12` nghĩa là căn lề trái trong 12 ký tự.',
      '`:>3` căn lề phải trong 3 ký tự. Ghép nhiều thứ trong format spec được: `:>12,.0f` = căn phải rộng 12, có dấu phẩy nghìn, 0 số thập phân.',
      'Thứ tự các phần trong format spec là `[căn lề][độ rộng][,][.số_lẻ][kiểu]`. Ví dụ `:>12,.0f` đọc là: căn phải, rộng 12, phẩy nghìn, không lẻ, kiểu số thực.',
    ],
    diagnostics: [
      { test: '\\.ljust\\s*\\(|\\.rjust\\s*\\(', message: '`ljust()`/`rjust()` chạy đúng, nhưng bài này để luyện format spec — cách viết gọn và đọc được ngay hình dạng dòng: `f"{name:<12}"` thay cho `name.ljust(12)`.' },
      { test: ':>12,\\.2f|:,\\.2f', message: '`.2f` sẽ in ra 2 số thập phân (`50,000.00`). Đề yêu cầu không có phần thập phân — dùng `.0f`.' },
      { test: '["\']\\s*\\*\\s*\\(?\\s*12', message: 'Tự nhân dấu cách (`" " * (12 - len(name))`) sẽ sai ngay khi tên dài đúng 12 (ra số âm) và rất khó đọc. Format spec `:<12` tự lo việc đệm.' },
    ],
    approach: `
**Format spec — "mini ngôn ngữ" nằm sau dấu hai chấm**

\`\`\`python
f"{name:<12}"      # chuỗi, căn lề TRÁI,  đệm cho đủ 12 ký tự
f"{qty:>3}"        # số,    căn lề PHẢI,  đủ 3 ký tự
f"{total:>12,.0f}" # số,    căn phải, rộng 12, phẩy nghìn, 0 số lẻ
\`\`\`

Ba ký hiệu căn lề: \`<\` trái, \`>\` phải, \`^\` giữa. Mặc định chuỗi căn trái còn **số căn phải** —
nhưng cứ ghi rõ ra, người đọc sau không phải nhớ luật.

**Lời giải**

\`\`\`python
def receipt_line(name, qty, unit_price):
    total = qty * unit_price
    return f"{name:<12}x{qty:>3} ={total:>12,.0f}"
\`\`\`

Đọc lại chuỗi khuôn \`"{name:<12}x{qty:>3} ={total:>12,.0f}"\`: giữa \`}\` và \`x\` **không** có khoảng
trắng — khoảng trắng bạn thấy trên hoá đơn là phần đệm do \`:<12\` tạo ra. Còn dấu cách trước \`=\`
là ký tự thật ta gõ vào.

**Vì sao không tự đếm khoảng trắng?**

\`\`\`python
name + " " * (12 - len(name)) + "x" + ...   # đừng
\`\`\`

Khi \`len(name)\` bằng 12, \`" " * 0\` ra chuỗi rỗng (may là không lỗi); khi dài hơn 12 thì
\`" " * -1\` cũng ra rỗng — im lặng sai lệch cột. Format spec xử lý sẵn cả hai trường hợp, và
quan trọng hơn: **khuôn dòng nhìn thấy được ngay trong chuỗi**, không phải suy ra từ phép cộng.

**\`.0f\` khác \`int()\` chỗ nào?** \`.0f\` chỉ *hiển thị* không có phần lẻ (làm tròn khi cần), giá trị
gốc không bị đổi. Đây là nguyên tắc nên mang theo: làm tròn ở lớp hiển thị, đừng làm tròn dữ liệu.
`,
    solution: `def receipt_line(name, qty, unit_price):
    total = qty * unit_price
    return f"{name:<12}x{qty:>3} ={total:>12,.0f}"`,
    complexity: {
      question: 'Chi phí dựng một dòng hoá đơn theo độ rộng cột w (ở đây w là hằng số 12 + 3 + 12)?',
      options: ['O(1) — độ rộng cột là hằng số nên chuỗi kết quả có độ dài giới hạn', 'O(n) theo giá trị của total', 'O(w²)', 'O(log total)'],
      answer: 0,
      why: 'Độ rộng các cột được ấn định trong khuôn, nên chuỗi kết quả luôn dài xấp xỉ 30 ký tự bất kể dữ liệu — chi phí không đổi. Chỉ khi số quá lớn vượt độ rộng thì độ dài mới phụ thuộc dữ liệu.',
    },
    realWorld: 'Hoá đơn máy in nhiệt, báo cáo dạng text, log dạng bảng, output của công cụ dòng lệnh: tất cả đều dựa vào phông đơn cách + đệm khoảng trắng. Đây cũng là lý do log của các công cụ lớn luôn thẳng cột — họ khai báo độ rộng chứ không nối chuỗi thủ công.',
  },
  {
    id: 'py-human-size',
    title: 'Đổi byte sang KB, MB, GB',
    en: 'Human-Readable File Size',
    difficulty: 'Medium',
    targetMinutes: 13,
    entry: 'human_size',
    lang: 'python',
    statement: `
Viết hàm \`human_size(n)\` đổi số byte thành chuỗi dễ đọc, dùng bậc **1024**:

- Nếu \`n < 1024\`: trả về số nguyên kèm đơn vị \`B\` — \`"512 B"\`
- Ngược lại: chia liên tiếp cho 1024 tới khi còn nhỏ hơn 1024, in **1 chữ số thập phân**
  kèm đơn vị tương ứng: \`KB\`, \`MB\`, \`GB\`, \`TB\`

**Ví dụ**
- \`human_size(0)\` → \`"0 B"\`
- \`human_size(1024)\` → \`"1.0 KB"\`
- \`human_size(1536)\` → \`"1.5 KB"\`
- \`human_size(1610612736)\` → \`"1.5 GB"\`

> \`TB\` là đơn vị lớn nhất: số nào lớn hơn nữa vẫn hiển thị bằng \`TB\`.
`,
    starter: `def human_size(n):\n    # Tra ve "512 B", "1.5 KB", "2.0 MB"...\n    \n`,
    tests: [
      { args: [0], expected: '0 B', name: 'Không byte nào' },
      { args: [512], expected: '512 B', name: 'Dưới 1024 — giữ số nguyên' },
      { args: [1023], expected: '1023 B', name: 'Sát biên dưới' },
      { args: [1024], expected: '1.0 KB', name: 'Đúng biên — đổi đơn vị' },
      { args: [1536], expected: '1.5 KB', name: 'Có phần lẻ' },
      { args: [1048576], expected: '1.0 MB', name: '1024 × 1024' },
      { args: [1610612736], expected: '1.5 GB', name: 'Cỡ GB' },
      { args: [1099511627776], expected: '1.0 TB', name: 'Cỡ TB' },
      { args: [2251799813685248], expected: '2048.0 TB', name: 'Vượt TB — vẫn dùng TB' },
    ],
    hints: [
      'Bạn cần lặp "chia cho 1024" nhiều lần chứ không biết trước bao nhiêu lần → dùng `while`, không dùng `for`.',
      'Giữ danh sách đơn vị `["B", "KB", "MB", "GB", "TB"]` và một biến chỉ số `i`. Mỗi lần chia thì `i += 1`. Điều kiện dừng gồm hai phần: giá trị đã nhỏ hơn 1024, HOẶC đã tới đơn vị cuối.',
      'Trường hợp `B` phải in số nguyên (`512 B`) còn các đơn vị khác in 1 số lẻ (`1.5 KB`) → hai `return` khác nhau, phân biệt bằng `if i == 0`.',
    ],
    diagnostics: [
      { test: '1000', message: 'Bậc chia ở đây là 1024 (bậc nhị phân), không phải 1000. Dùng 1000 sẽ ra "1.0 KB" cho 1000 byte — sai so với đề.' },
      { test: 'while\\s+[a-z_]+\\s*>=?\\s*1024\\s*:\\s*\\n(?:(?!len\\(units\\)).)*$', message: 'Điều kiện `while` chỉ kiểm tra giá trị mà không kiểm tra "đã hết đơn vị chưa" sẽ gây `IndexError` với số cực lớn. Thêm điều kiện `and i < len(units) - 1`.' },
      { test: '//\\s*1024', message: 'Chia lấy nguyên `// 1024` làm mất phần lẻ nên 1536 sẽ ra "1.0 KB" thay vì "1.5 KB". Ở đây cần chia thực `/`.' },
    ],
    approach: `
**Bài này gồm ba mảnh cú pháp ghép lại**

1. \`while\` với điều kiện **kép** — vừa xét dữ liệu, vừa chặn tràn danh sách.
2. Chia thực \`/\` (không phải \`//\`) để giữ phần lẻ.
3. Format spec \`.1f\` để in đúng một số thập phân.

\`\`\`python
def human_size(n):
    units = ["B", "KB", "MB", "GB", "TB"]
    value = float(n)
    i = 0
    while value >= 1024 and i < len(units) - 1:
        value /= 1024
        i += 1
    if i == 0:
        return f"{n} B"
    return f"{value:.1f} {units[i]}"
\`\`\`

**\`value /= 1024\` là gì?** Là cách viết ngắn của \`value = value / 1024\`. Python có bộ toán tử
gán kép: \`+=\`, \`-=\`, \`*=\`, \`/=\`, \`//=\`, \`%=\`.

**Vì sao \`i < len(units) - 1\`?** \`units\` có 5 phần tử, chỉ số hợp lệ là 0..4. Nếu chỉ viết
\`while value >= 1024\` thì với số cực lớn, \`i\` sẽ nhảy tới 5 và \`units[5]\` gây \`IndexError\`.
Điều kiện thứ hai giữ \`i\` dừng ở 4 (\`TB\`) và để giá trị lớn hơn 1024 lần vẫn hiển thị bằng TB.

**Vì sao tách riêng \`if i == 0\`?** Vì đơn vị byte thì "1.0 B" là vô nghĩa — không có nửa byte để
nói. Đây là ví dụ nhỏ của một nguyên tắc lớn: **quy tắc hiển thị thường không đồng nhất**, và
chỗ nào đề nói "khác nhau" thì code phải có một nhánh \`if\` tương ứng.

**Bẫy \`//\`:** dùng \`value // 1024\` sẽ mất phần lẻ ngay bước đầu → mọi kết quả đều là \`.0\`.
Bài trước dạy \`//\` là công cụ đúng khi cần *phần nguyên*; ở đây ta cần *tỉ lệ*, nên phải là \`/\`.
`,
    solution: `def human_size(n):
    units = ["B", "KB", "MB", "GB", "TB"]
    value = float(n)
    i = 0
    while value >= 1024 and i < len(units) - 1:
        value /= 1024
        i += 1
    if i == 0:
        return f"{n} B"
    return f"{value:.1f} {units[i]}"`,
    complexity: {
      question: 'Số vòng lặp tối đa của hàm này là bao nhiêu, xét theo n?',
      options: [
        'O(log n) nhưng bị chặn trên bởi số đơn vị (4 lần) → thực tế là O(1)',
        'O(n) — phải chia n lần',
        'O(n log n)',
        'O(1) vì không có vòng lặp nào',
      ],
      answer: 0,
      why: 'Mỗi vòng lặp chia giá trị cho 1024 nên số vòng là log₁₀₂₄(n) — nhưng điều kiện `i < len(units) - 1` chặn cứng ở 4 vòng, nên trên thực tế chi phí là hằng số.',
    },
    realWorld: 'Hiển thị dung lượng file trong trình quản lý file, log dung lượng ổ đĩa, báo cáo kích thước ảnh upload. Lưu ý thực tế: hệ điều hành Windows dùng bậc 1024 (KB) còn nhà sản xuất ổ cứng dùng bậc 1000 (kB) — đó chính là lý do ổ "1 TB" chỉ hiện ~931 GB.',
  },
];

/* ==================================================================== */
/* MODULE 2 — py-control-flow                                            */
/* ==================================================================== */
const PY_CONTROL_FLOW = [
  {
    id: 'py-drill-count-vowels',
    title: 'Đếm nguyên âm',
    en: 'Count Vowels',
    difficulty: 'Easy',
    targetMinutes: 6,
    entry: 'count_vowels',
    lang: 'python',
    statement: `
Viết hàm \`count_vowels(text)\` đếm số nguyên âm trong chuỗi. Nguyên âm là 5 chữ cái
\`a\`, \`e\`, \`i\`, \`o\`, \`u\` — **không phân biệt hoa thường**, không tính chữ có dấu.

**Ví dụ**
- \`count_vowels("hello")\` → \`2\`
- \`count_vowels("AEIOU")\` → \`5\`
- \`count_vowels("xyz")\` → \`0\`
`,
    starter: `def count_vowels(text):\n    # Dem so nguyen am trong text\n    \n`,
    tests: [
      { args: ['hello'], expected: 2, name: 'Ví dụ cơ bản' },
      { args: ['AEIOU'], expected: 5, name: 'Toàn chữ hoa' },
      { args: ['xyz'], expected: 0, name: 'Không có nguyên âm' },
      { args: [''], expected: 0, name: 'Chuỗi rỗng' },
      { args: ['Python'], expected: 1, name: '"y" không phải nguyên âm ở đây' },
      { args: ['Programming Language'], expected: 7, name: 'Câu dài có khoảng trắng' },
    ],
    hints: [
      '`for ch in text:` lặp qua TỪNG KÝ TỰ của chuỗi — Python lặp thẳng qua phần tử, không cần chỉ số như `for (i = 0; ...)`.',
      'Toán tử `in` kiểm tra "có nằm trong" cho cả chuỗi: `ch in "aeiou"` trả về `True`/`False`.',
      'Cần một biến đếm khởi tạo `count = 0` TRƯỚC vòng lặp, rồi `count += 1` khi gặp nguyên âm. Nhớ `return count` ở cuối, thẳng lề với `for` (không thụt vào trong vòng lặp).',
    ],
    diagnostics: [
      { test: 'for\\s+i\\s+in\\s+range\\s*\\(\\s*len\\s*\\(', message: '`for i in range(len(text))` là phản xạ từ ngôn ngữ khác. Trong Python hãy lặp thẳng qua phần tử: `for ch in text:` — ngắn hơn và không thể lệch chỉ số.' },
      { test: 'return\\s+count\\s*$[\\s\\S]*count\\s*\\+=', message: 'Có vẻ `return` nằm TRONG vòng lặp nên hàm thoát ngay ở ký tự đầu tiên. `return count` phải thẳng lề với `for`, chạy sau khi lặp xong.' },
    ],
    approach: `
**Khuôn "đếm" kinh điển — nhớ ba dòng này là làm được vô số bài**

\`\`\`python
def count_vowels(text):
    count = 0                    # 1. khởi tạo TRƯỚC vòng lặp
    for ch in text.lower():      # 2. duyệt từng phần tử
        if ch in "aeiou":
            count += 1           # 3. cập nhật khi thoả điều kiện
    return count                 # 4. trả về SAU vòng lặp
\`\`\`

**Bốn điểm cú pháp**

- \`for ch in text\` — Python lặp qua *phần tử*, không qua chỉ số. Với chuỗi, mỗi phần tử là một ký tự.
- \`text.lower()\` — trả về chuỗi mới đã hạ hết chữ hoa. Nhờ vậy chỉ cần so với \`"aeiou"\` một lần
  thay vì viết cả \`"AEIOU"\`.
- \`ch in "aeiou"\` — \`in\` là toán tử kiểm tra thành viên, dùng được cho chuỗi, list, tuple, set, dict.
- Thụt lề quyết định chuyện gì nằm trong vòng lặp. \`return count\` thụt 4 dấu cách (thẳng với \`for\`)
  nên chạy sau khi lặp xong; nếu thụt 8 dấu cách, nó nằm trong \`for\` và hàm sẽ trả về ngay vòng đầu.

**Cách viết ngắn của người Python (đọc để biết)**

\`\`\`python
return sum(1 for ch in text.lower() if ch in "aeiou")
\`\`\`

Cùng logic, gói trong một biểu thức. Chưa cần dùng ngay — nhưng khi đọc code người khác bạn sẽ
gặp rất nhiều, và nó chỉ là khuôn 4 bước ở trên viết gọn lại.
`,
    solution: `def count_vowels(text):
    count = 0
    for ch in text.lower():
        if ch in "aeiou":
            count += 1
    return count`,
    complexity: {
      question: 'Độ phức tạp thời gian theo độ dài n của text?',
      options: ['O(n) — mỗi ký tự được xét đúng một lần', 'O(1)', 'O(n · 5) nên là O(5n) khác O(n)', 'O(n²)'],
      answer: 0,
      why: 'Vòng lặp chạy n lần, mỗi lần làm một phép kiểm tra trên chuỗi 5 ký tự (hằng số). O(5n) rút gọn thành O(n) — hằng số luôn bị bỏ khi tính big-O.',
    },
    realWorld: 'Khuôn "duyệt + đếm theo điều kiện" là nền của mọi thống kê: đếm request lỗi trong log, đếm ô trống trong bảng dữ liệu, đếm ký tự đặc biệt khi kiểm tra mật khẩu.',
  },
  {
    id: 'py-drill-first-negative',
    title: 'Số âm đầu tiên',
    en: 'First Negative Number',
    difficulty: 'Easy',
    targetMinutes: 7,
    entry: 'first_negative',
    lang: 'python',
    statement: `
Viết hàm \`first_negative(nums)\` trả về **số âm đầu tiên** trong danh sách.
Nếu không có số âm nào, trả về \`None\`.

**Ví dụ**
- \`first_negative([3, 1, -2, 5, -7])\` → \`-2\` (dừng ngay ở \`-2\`, không đi tiếp)
- \`first_negative([1, 2, 3])\` → \`None\`
- \`first_negative([])\` → \`None\`

> Số \`0\` **không** phải số âm.
`,
    starter: `def first_negative(nums):\n    # Tra ve so am dau tien, hoac None neu khong co\n    \n`,
    tests: [
      { args: [[3, 1, -2, 5, -7]], expected: -2, name: 'Có hai số âm — chỉ lấy số đầu' },
      { args: [[1, 2, 3]], expected: null, name: 'Không có số âm' },
      { args: [[]], expected: null, name: 'Danh sách rỗng' },
      { args: [[-1]], expected: -1, name: 'Một phần tử duy nhất, âm' },
      { args: [[0, 0, -0.5]], expected: -0.5, name: 'Số 0 không phải số âm' },
      { args: [[5, -9, -1]], expected: -9, name: 'Số âm đầu tiên không phải số nhỏ nhất' },
    ],
    hints: [
      'Không cần biến tạm nào: khi gặp số âm, `return` luôn giá trị đó — `return` kết thúc hàm ngay lập tức nên vòng lặp tự dừng.',
      'Sau vòng lặp mà chưa `return` gì nghĩa là không tìm thấy → `return None` ở cuối, thẳng lề với `for`.',
      'Python cho phép bỏ hẳn `return None`: hàm không `return` gì sẽ tự trả về `None`. Nhưng viết rõ ra thì người đọc sau không phải đoán.',
    ],
    diagnostics: [
      { test: 'break', message: '`break` chỉ thoát vòng lặp rồi bạn vẫn phải nhớ giá trị vừa tìm được vào biến tạm. `return` ngay trong vòng lặp vừa thoát vừa trả kết quả — ngắn và không có biến trung gian nào để quên.' },
      { test: '<=\\s*0', message: '`<= 0` tính cả số 0 là số âm. Đề nói rõ 0 không phải số âm → điều kiện phải là `< 0`.' },
      { test: 'return\\s+None[\\s\\S]*for\\s', message: 'Nếu `return None` nằm TRƯỚC hoặc TRONG vòng lặp thì hàm luôn trả về None. Nó phải là dòng cuối cùng, thẳng lề với `for`.' },
    ],
    approach: `
**Khuôn "tìm phần tử đầu tiên thoả điều kiện"**

\`\`\`python
def first_negative(nums):
    for x in nums:
        if x < 0:
            return x      # thoát hàm NGAY, mang theo kết quả
    return None           # chạy tới đây = đã duyệt hết mà không thấy
\`\`\`

**\`return\` trong vòng lặp làm gì?** Nó kết thúc **cả hàm**, nên cũng kết thúc luôn vòng lặp.
Đây là lý do ta không cần \`break\`, không cần biến \`ket_qua = None\` rồi gán rồi \`break\` rồi
\`return ket_qua\` — bốn bước thu về một bước.

**Vì sao "dừng ngay" lại quan trọng?** Với danh sách 1 triệu phần tử mà số âm nằm ở vị trí thứ 3,
hàm này chỉ đọc 3 phần tử. Người mới hay viết kiểu "lọc hết rồi lấy phần tử đầu":

\`\`\`python
am = [x for x in nums if x < 0]   # duyệt HẾT 1 triệu phần tử
return am[0] if am else None      # rồi mới lấy cái đầu
\`\`\`

Chạy đúng, nhưng làm việc vô ích và tốn thêm bộ nhớ cho danh sách trung gian.

**\`None\` là gì?** Là giá trị đặc biệt nghĩa là "không có gì" (tương đương \`null\`). Nó **không**
phải \`0\`, không phải \`False\`, không phải chuỗi rỗng. Khi kiểm tra, dùng \`is\`:

\`\`\`python
if first_negative(nums) is None:   # đúng
if first_negative(nums) == None:   # chạy được nhưng không đúng chuẩn
\`\`\`

**Bẫy thật sự của bài này:** nếu kết quả có thể là \`0\` thì \`if not ket_qua\` sẽ nhầm \`0\` thành
"không tìm thấy" — vì \`0\` cũng là *falsy*. Với hàm trả về "giá trị hoặc None", luôn kiểm tra
bằng \`is None\`.
`,
    solution: `def first_negative(nums):
    for x in nums:
        if x < 0:
            return x
    return None`,
    complexity: {
      question: 'Độ phức tạp thời gian trong trường hợp xấu nhất, với n phần tử?',
      options: ['O(n) — xấu nhất là không có số âm nào, phải duyệt hết', 'O(1) vì luôn dừng sớm', 'O(log n)', 'O(n²)'],
      answer: 0,
      why: 'Trường hợp tốt nhất là O(1) (số âm nằm ngay đầu), nhưng xấu nhất — không có số âm hoặc nó nằm cuối — phải xét cả n phần tử. Big-O mặc định nói về trường hợp xấu nhất.',
    },
    realWorld: 'Tìm bản ghi lỗi đầu tiên trong log để báo cho người dùng, tìm ô dữ liệu không hợp lệ đầu tiên trong file import, tìm phiên bản đầu tiên không tương thích. Trả `None` thay vì raise lỗi là lựa chọn hợp lý khi "không tìm thấy" là chuyện bình thường, không phải sự cố.',
  },
  {
    id: 'py-total-flexible',
    title: 'Hàm tính tổng linh hoạt',
    en: 'Flexible Total',
    difficulty: 'Medium',
    targetMinutes: 12,
    entry: 'total',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    nums, opts = args
    return fn(*nums, **opts)`,
    statement: `
Viết hàm \`total\` nhận **số lượng đối số tuỳ ý** rồi trả về tổng, kèm một tuỳ chọn:

\`\`\`python
def total(*nums, skip_negative=False):
    ...
\`\`\`

- \`total(1, 2, 3)\` → \`6\`
- \`total(1, -2, 3)\` → \`2\`
- \`total(1, -2, 3, skip_negative=True)\` → \`4\` (bỏ qua số âm)
- \`total()\` → \`0\`

> Chú ý: \`skip_negative\` nằm **sau** \`*nums\` nên chỉ được truyền bằng tên
> (\`skip_negative=True\`), không truyền theo vị trí được.
`,
    starter: `def total(*nums, skip_negative=False):\n    # Tinh tong cac so trong nums\n    \n`,
    tests: [
      { args: [[1, 2, 3], {}], expected: 6, name: 'Ba số dương' },
      { args: [[1, -2, 3], {}], expected: 2, name: 'Có số âm, mặc định vẫn cộng' },
      { args: [[1, -2, 3], { skip_negative: true }], expected: 4, name: 'Bỏ qua số âm' },
      { args: [[], {}], expected: 0, name: 'Không có đối số nào' },
      { args: [[-1, -2], { skip_negative: true }], expected: 0, name: 'Bỏ hết thì tổng là 0' },
      { args: [[5], { skip_negative: true }], expected: 5, name: 'Một số dương, có bật tuỳ chọn' },
      { args: [[0, -0.5, 2.5], {}], expected: 2, name: 'Có số thực' },
    ],
    hints: [
      'Dấu `*` trước tên tham số nghĩa là "gom mọi đối số vị trí còn lại vào một tuple". Trong hàm, `nums` là một tuple bình thường — lặp `for n in nums:` như list.',
      'Khởi tạo `result = 0` rồi cộng dần. Với `total()` (không đối số), `nums` là tuple rỗng nên vòng lặp không chạy lần nào và kết quả là 0 — đúng luôn, không cần `if` riêng.',
      'Muốn bỏ qua một phần tử giữa vòng lặp thì dùng `continue`: `if skip_negative and n < 0: continue`.',
    ],
    diagnostics: [
      { test: 'def\\s+total\\s*\\(\\s*nums', message: 'Đề yêu cầu `def total(*nums, ...)` — có dấu `*`. Viết `def total(nums)` thì hàm chỉ nhận đúng MỘT đối số là cả danh sách, và `total(1, 2, 3)` sẽ báo lỗi thừa đối số.' },
      { test: 'def\\s+total\\s*\\([^)]*skip_negative[^)]*\\*nums', message: 'Thứ tự sai: `*nums` phải đứng TRƯỚC các tham số chỉ truyền bằng tên. Đúng là `def total(*nums, skip_negative=False)`.' },
      { test: 'sum\\s*\\(\\s*nums\\s*\\)\\s*$', message: '`sum(nums)` bỏ qua tuỳ chọn `skip_negative`. Hãy lọc trước khi cộng, hoặc dùng vòng lặp có `continue`.' },
    ],
    approach: `
**\`*nums\` — gom đối số vào tuple**

\`\`\`python
def total(*nums, skip_negative=False):
    print(nums)        # total(1, 2, 3)  ->  (1, 2, 3)
    print(type(nums))  # <class 'tuple'>
\`\`\`

Dấu \`*\` không phải phép nhân ở đây; nó là ký hiệu "gom" (\`*args\` trong tài liệu). Bên trong hàm,
\`nums\` là **tuple** — duyệt được, \`len()\` được, nhưng không sửa được (immutable).

**Tham số sau \`*\` chỉ truyền bằng tên**

\`\`\`python
total(1, 2, skip_negative=True)   # đúng
total(1, 2, True)                 # TypeError: nhận 3 đối số vị trí
\`\`\`

Đây là tính năng cố ý: \`total(1, 2, True)\` đọc lên không ai biết \`True\` nghĩa là gì, còn
\`skip_negative=True\` thì tự giải thích. Khi thiết kế hàm có "cờ bật/tắt", cứ đặt nó sau \`*\`.

**Lời giải**

\`\`\`python
def total(*nums, skip_negative=False):
    result = 0
    for n in nums:
        if skip_negative and n < 0:
            continue      # bỏ qua phần tử này, sang vòng kế tiếp
        result += n
    return result
\`\`\`

**\`continue\` khác \`break\` thế nào?**

- \`continue\` → bỏ phần còn lại của vòng **hiện tại**, nhảy sang phần tử tiếp theo.
- \`break\` → thoát hẳn vòng lặp.

**Vì sao không cần \`if not nums: return 0\`?** Vì \`result\` đã khởi tạo bằng 0 và vòng lặp trên
tuple rỗng chạy 0 lần. Khởi tạo đúng giá trị trung tính (0 cho tổng, 1 cho tích, \`[]\` cho danh
sách) giúp bỏ được cả nhánh "trường hợp rỗng" — ít code, ít lỗi.

**Người anh em \`**kwargs\`:** \`*\` gom đối số vị trí thành tuple, \`**\` gom đối số có tên thành dict.
\`def f(*args, **kwargs)\` là cách viết "nhận mọi thứ", hay gặp khi viết decorator (module 5).
`,
    solution: `def total(*nums, skip_negative=False):
    result = 0
    for n in nums:
        if skip_negative and n < 0:
            continue
        result += n
    return result`,
    complexity: {
      question: 'Độ phức tạp thời gian theo số lượng đối số n?',
      options: ['O(n) — mỗi đối số được cộng đúng một lần', 'O(1) vì Python cộng cả tuple một lượt', 'O(n²)', 'O(n log n)'],
      answer: 0,
      why: 'Vòng lặp chạy đúng n lần, mỗi lần một phép cộng và một phép so sánh. Việc gom đối số vào tuple cũng là O(n).',
    },
    realWorld: 'API kiểu "nhận bao nhiêu cũng được" rất phổ biến: `print()`, `max()`, `os.path.join()` đều dùng `*args`. Còn cờ truyền-bằng-tên là quy ước thiết kế của thư viện chuẩn — ví dụ `sorted(data, reverse=True)` — giúp lời gọi tự giải thích mà không cần mở tài liệu.',
  },
  {
    id: 'py-collatz-steps',
    title: 'Đếm bước dãy Collatz',
    en: 'Collatz Steps',
    difficulty: 'Medium',
    targetMinutes: 14,
    entry: 'collatz_steps',
    lang: 'python',
    statement: `
Dãy Collatz: bắt đầu từ số nguyên \`n >= 1\`, mỗi bước làm một trong hai việc:

- \`n\` **chẵn** → \`n = n // 2\`
- \`n\` **lẻ** → \`n = 3 * n + 1\`

Viết hàm \`collatz_steps(n, limit=1000)\` trả về **số bước** để \`n\` về được \`1\`.
Nếu chạy quá \`limit\` bước mà vẫn chưa về 1, trả về \`-1\`.

**Ví dụ**
- \`collatz_steps(1)\` → \`0\` (đã là 1 rồi, không cần bước nào)
- \`collatz_steps(6)\` → \`8\` (6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1)
- \`collatz_steps(7, 5)\` → \`-1\` (7 cần tới 16 bước, vượt giới hạn 5)
`,
    starter: `def collatz_steps(n, limit=1000):\n    # Dem so buoc de n ve 1, tra ve -1 neu vuot limit\n    \n`,
    tests: [
      { args: [1, 1000], expected: 0, name: 'Đã là 1' },
      { args: [2, 1000], expected: 1, name: 'Một bước' },
      { args: [6, 1000], expected: 8, name: 'Ví dụ trong đề' },
      { args: [7, 1000], expected: 16, name: 'Đường đi dài hơn giá trị ban đầu' },
      { args: [27, 1000], expected: 111, name: 'Số nhỏ nhưng đi rất lâu' },
      { args: [7, 5], expected: -1, name: 'Vượt giới hạn bước' },
      { args: [1, 0], expected: 0, name: 'limit = 0 nhưng không cần bước nào' },
      { args: [8, 3], expected: 3, name: 'Vừa đủ đúng bằng limit' },
    ],
    hints: [
      'Không biết trước phải lặp bao nhiêu lần → `while n != 1:`. Đây là dấu hiệu nhận biết khi nào dùng `while` thay cho `for`.',
      'Cần một biến `steps = 0` bên ngoài vòng lặp và `steps += 1` sau mỗi lần biến đổi `n`.',
      'Chèn kiểm tra `if steps >= limit: return -1` ở ĐẦU thân vòng lặp — trước khi biến đổi. Nhờ vậy `collatz_steps(1, 0)` vẫn ra 0 vì vòng lặp không chạy lần nào.',
    ],
    diagnostics: [
      { test: 'n\\s*/\\s*2', message: 'Chia thực `n / 2` biến n thành số thực (`6 / 2` ra `3.0`), sau đó `n % 2` vẫn chạy nhưng giá trị đã là float — và `n != 1` sẽ so `1.0 != 1` (may là bằng nhau). Hãy dùng `//` để n luôn là số nguyên.' },
      { test: 'while\\s+n\\s*>\\s*1', message: '`while n > 1` chạy đúng với n ≥ 1, nhưng đề chỉ định nghĩa dãy dừng khi n BẰNG 1 — viết `while n != 1` sát đề hơn và bộc lộ ngay nếu ai đó gọi hàm với n = 0 (vòng lặp vô hạn) thay vì âm thầm trả về 0.' },
      { test: 'return\\s+steps[\\s\\S]*while', message: '`return steps` nằm trước `while` thì hàm thoát ngay. Nó phải là dòng cuối, thẳng lề với `while`.' },
    ],
    approach: `
**Khi nào \`while\`, khi nào \`for\`?**

- \`for\` — biết trước tập cần duyệt (\`for x in nums\`, \`for i in range(10)\`).
- \`while\` — chỉ biết **điều kiện dừng**, không biết trước số vòng. Bài này đúng loại đó: không ai
  biết trước 27 cần 111 bước.

\`\`\`python
def collatz_steps(n, limit=1000):
    steps = 0
    while n != 1:
        if steps >= limit:
            return -1
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        steps += 1
    return steps
\`\`\`

**Ba chi tiết cú pháp đáng để ý**

1. \`limit=1000\` là **giá trị mặc định**: gọi \`collatz_steps(6)\` thì \`limit\` tự là 1000. Nhắc lại
   bẫy đã học: giá trị mặc định chỉ được tính MỘT lần lúc định nghĩa hàm — với số thì vô hại, với
   \`[]\` hay \`{}\` thì thành lỗi (xem lại bài "Bẫy tham số mặc định").
2. Có thể viết gọn hai nhánh thành **biểu thức điều kiện**:
   \`n = n // 2 if n % 2 == 0 else 3 * n + 1\` — đọc là "lấy \`n // 2\` nếu chẵn, ngược lại lấy \`3n+1\`".
3. \`n % 2 == 0\` là cách kiểm tra chẵn. \`n % 2\` trả về 0 hoặc 1, và \`0\` là *falsy*, nên \`if n % 2:\`
   nghĩa là "nếu lẻ" — bạn sẽ gặp cách viết này nhiều.

**Vì sao đặt \`if steps >= limit\` ở đầu thân vòng lặp?**

Vì nó là **chốt an toàn** (guard) cho vòng \`while\`. Một vòng \`while\` mà điều kiện dừng phụ thuộc
dữ liệu luôn có nguy cơ chạy mãi (thử \`collatz_steps(0)\` không có chốt: 0 → 0 → 0...). Trong
code thật, mọi vòng lặp "chờ tới khi xong" — chờ mạng, chờ file, thử lại — đều cần một giới hạn
số lần như vậy.

Đặt ở đầu thân vòng lặp còn cho ta hành vi đúng ở biên: với \`n = 1\`, vòng lặp không chạy lần nào
nên trả về 0 ngay cả khi \`limit = 0\`.
`,
    solution: `def collatz_steps(n, limit=1000):
    steps = 0
    while n != 1:
        if steps >= limit:
            return -1
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        steps += 1
    return steps`,
    complexity: {
      question: 'Vì sao không thể nói độ phức tạp của hàm này là O(log n)?',
      options: [
        'Vì số bước của dãy Collatz chưa ai chứng minh được công thức — chỉ chắc chắn bị chặn bởi limit, nên ta nói O(limit)',
        'Vì mỗi bước đều chia 2 nên chắc chắn là O(log n)',
        'Vì hàm luôn chạy đúng limit vòng',
        'Vì phép `3 * n + 1` tốn O(n)',
      ],
      answer: 0,
      why: 'Bước lẻ làm n TĂNG (3n+1), nên dãy không giảm đều như tìm kiếm nhị phân — giả thuyết Collatz (mọi n đều về 1) tới nay vẫn chưa được chứng minh. Điều duy nhất bảo đảm hàm dừng chính là tham số `limit`, nên cận trên đúng đắn là O(limit).',
    },
    realWorld: 'Khuôn "lặp tới khi đạt trạng thái mong muốn, có giới hạn số lần" là khuôn của mọi vòng thử lại: gọi API tối đa 5 lần, chờ container khởi động tối đa 60 giây, thăm dò trạng thái job. Không có `limit`, một sự cố nhỏ ở phía xa sẽ treo cả tiến trình của bạn.',
  },
];

/* ==================================================================== */
/* MODULE 3 — py-data-structures                                         */
/* ==================================================================== */
const PY_DATA_STRUCTURES = [
  {
    id: 'py-drill-trim-ends',
    title: 'Bỏ đầu bỏ cuối bằng cắt lát',
    en: 'Trim Both Ends',
    difficulty: 'Easy',
    targetMinutes: 6,
    entry: 'trim_ends',
    lang: 'python',
    statement: `
Viết hàm \`trim_ends(items)\` trả về danh sách MỚI đã bỏ phần tử đầu và phần tử cuối.
Nếu danh sách có 2 phần tử hoặc ít hơn, trả về danh sách rỗng.

**Ví dụ**
- \`trim_ends([1, 2, 3, 4])\` → \`[2, 3]\`
- \`trim_ends([1, 2, 3])\` → \`[2]\`
- \`trim_ends([1, 2])\` → \`[]\`
- \`trim_ends([])\` → \`[]\`

> Bài này giải được bằng **một dòng** nhờ cú pháp cắt lát (slicing). Không cần \`if\` nào.
`,
    starter: `def trim_ends(items):\n    # Bo phan tu dau va cuoi\n    \n`,
    tests: [
      { args: [[1, 2, 3, 4]], expected: [2, 3], name: 'Bốn phần tử' },
      { args: [[1, 2, 3]], expected: [2], name: 'Ba phần tử' },
      { args: [[1, 2]], expected: [], name: 'Hai phần tử — bỏ hết' },
      { args: [[1]], expected: [], name: 'Một phần tử' },
      { args: [[]], expected: [], name: 'Danh sách rỗng — không được lỗi' },
      { args: [['a', 'b', 'c', 'd', 'e']], expected: ['b', 'c', 'd'], name: 'Danh sách chuỗi' },
    ],
    hints: [
      'Cú pháp cắt lát là `items[bắt_đầu:kết_thúc]`, lấy từ chỉ số `bắt_đầu` tới **trước** `kết_thúc`.',
      'Chỉ số âm đếm từ cuối: `-1` là phần tử cuối cùng. Vậy "tới trước phần tử cuối" viết là `:-1`.',
      'Ghép hai ý trên: `items[1:-1]`. Cắt lát không bao giờ báo lỗi vượt biên — với danh sách rỗng nó trả về danh sách rỗng, nên bạn không cần `if` nào.',
    ],
    diagnostics: [
      { test: 'len\\s*\\(\\s*items\\s*\\)\\s*-\\s*1', message: 'Không cần tính `len(items) - 1`: chỉ số âm làm sẵn việc đó. `items[1:-1]` đọc là "từ phần tử thứ hai tới trước phần tử cuối".' },
      { test: '\\.pop\\s*\\(|del\\s+items', message: '`pop()` và `del` SỬA danh sách gốc của người gọi — một tác dụng phụ ngoài ý muốn. Cắt lát tạo danh sách mới, giữ nguyên bản gốc.' },
      { test: 'if\\s+len\\s*\\(\\s*items\\s*\\)\\s*<=?\\s*2', message: 'Nhánh `if` này không cần thiết: `[1, 2][1:-1]` đã tự trả về `[]`. Cắt lát an toàn với mọi độ dài — dựa vào đó để bỏ bớt nhánh điều kiện.' },
    ],
    approach: `
**Cắt lát đọc thế nào?**

\`\`\`python
items[start:stop]      # từ start, tới TRƯỚC stop
items[1:-1]            # bỏ phần tử đầu (chỉ số 0) và phần tử cuối (chỉ số -1)
\`\`\`

Hai điều cần thuộc:

1. **\`stop\` không được lấy.** \`[10, 20, 30][0:2]\` ra \`[10, 20]\` — đúng 2 phần tử.
   Nhờ quy ước này mà \`items[:k]\` và \`items[k:]\` ghép lại vừa khít, không trùng không hở.
2. **Chỉ số âm đếm từ cuối:** \`-1\` là cuối cùng, \`-2\` là kế cuối. Vậy \`:-1\` = "tới trước cái cuối".

**Vì sao không cần \`if\`?**

Cắt lát **không bao giờ raise IndexError**, khác hẳn truy cập một phần tử:

\`\`\`python
[][0]        # IndexError
[][1:-1]     # []  ← im lặng trả về rỗng
[1, 2][1:-1] # []  ← start 1, stop 1 -> rỗng
\`\`\`

Đây là điểm thiết kế rất Python: *lấy một phần tử* thì sai chỉ số là lỗi lập trình nên phải báo
ngay; còn *lấy một khoảng* thì "khoảng rỗng" là kết quả hợp lệ.

**Cắt lát tạo bản sao MỚI (nông)**

\`\`\`python
b = a[:]        # cách sao chép danh sách kinh điển
b.append(9)     # a không đổi
\`\`\`

Nhưng "nông" (shallow): nếu phần tử là list lồng trong list thì bản sao vẫn dùng chung các list
con đó — chính là bẫy đã gặp ở quiz module 1 (\`a = [[1,2]]; b = a[:]; b[0].append(99)\` làm đổi cả \`a\`).

**Bộ ba cắt lát đầy đủ:** \`items[start:stop:step]\`. Bước nhảy \`step\` cho vài mẹo hay gặp:
\`items[::2]\` lấy phần tử ở vị trí chẵn, \`items[::-1]\` **đảo ngược** danh sách.
`,
    solution: `def trim_ends(items):
    return items[1:-1]`,
    complexity: {
      question: 'Cắt lát `items[1:-1]` tốn độ phức tạp thời gian và bộ nhớ bao nhiêu với n phần tử?',
      options: [
        'O(n) thời gian và O(n) bộ nhớ — phải copy các phần tử sang danh sách mới',
        'O(1) cả hai vì chỉ tạo một "khung nhìn" vào danh sách cũ',
        'O(1) thời gian, O(n) bộ nhớ',
        'O(log n)',
      ],
      answer: 0,
      why: 'Trong Python, cắt lát list luôn tạo danh sách MỚI và copy tham chiếu của từng phần tử — nên tốn cả thời gian lẫn bộ nhớ tỉ lệ với số phần tử lấy ra. (Khác với NumPy, nơi cắt lát trả về view O(1).)',
    },
    realWorld: 'Bỏ dòng tiêu đề và dòng tổng của một file CSV (`lines[1:-1]`), bỏ ký tự bao quanh một chuỗi, lấy "trang giữa" của kết quả phân trang. Vì cắt lát không lỗi khi rỗng, code xử lý dữ liệu ngoài dự đoán ngắn hơn hẳn.',
  },
  {
    id: 'py-drill-describe-items',
    title: 'Đếm phần tử trùng bằng set',
    en: 'Describe Items with set',
    difficulty: 'Easy',
    targetMinutes: 7,
    entry: 'describe_items',
    lang: 'python',
    statement: `
Viết hàm \`describe_items(items)\` trả về **tuple 3 giá trị**:

1. tổng số phần tử
2. số phần tử **khác nhau**
3. \`True\`/\`False\` — có phần tử nào bị trùng hay không

**Ví dụ**
- \`describe_items([1, 2, 2, 3])\` → \`(4, 3, True)\`
- \`describe_items(["a", "b"])\` → \`(2, 2, False)\`
- \`describe_items([])\` → \`(0, 0, False)\`
`,
    starter: `def describe_items(items):\n    # Tra ve (tong so, so khac nhau, co trung khong)\n    \n`,
    tests: [
      { args: [[1, 2, 2, 3]], expected: [4, 3, true], name: 'Một phần tử trùng' },
      { args: [['a', 'b']], expected: [2, 2, false], name: 'Không trùng' },
      { args: [[]], expected: [0, 0, false], name: 'Danh sách rỗng' },
      { args: [[5, 5, 5]], expected: [3, 1, true], name: 'Trùng hết' },
      { args: [[1, '1']], expected: [2, 2, false], name: 'Số 1 và chuỗi "1" là hai giá trị khác nhau' },
      { args: [['x', 'y', 'x', 'z', 'y']], expected: [5, 3, true], name: 'Nhiều nhóm trùng' },
    ],
    hints: [
      '`set(items)` tạo một tập hợp — cấu trúc **tự loại bỏ phần tử trùng**. `len(set(items))` chính là số phần tử khác nhau.',
      'Câu hỏi "có trùng không" tương đương "số phần tử khác nhau có ít hơn tổng số không": `len(unique) != len(items)`.',
      'Đừng gọi `set(items)` ba lần — gán ra biến `unique = set(items)` rồi dùng lại. Vừa nhanh hơn vừa đọc rõ ý.',
    ],
    diagnostics: [
      { test: 'for[\\s\\S]*for', message: 'Hai vòng lặp lồng nhau để tìm phần tử trùng là cách O(n²). `set()` làm cùng việc đó trong O(n) nhờ bảng băm — đây chính là lý do set tồn tại.' },
      { test: '\\.count\\s*\\(', message: '`items.count(x)` phải quét cả danh sách cho MỖI x, nên gọi trong vòng lặp là O(n²). Với câu hỏi "có trùng không", chỉ cần so `len(set(items))` với `len(items)`.' },
      { test: 'set\\s*\\(\\s*items\\s*\\)[\\s\\S]*set\\s*\\(\\s*items\\s*\\)', message: 'Bạn đang tạo `set(items)` nhiều lần — mỗi lần đều tốn O(n). Gán vào biến `unique` rồi dùng lại.' },
    ],
    approach: `
**\`set\` là gì?**

Một tập hợp **không thứ tự, không phần tử trùng**, viết bằng ngoặc nhọn \`{1, 2, 3}\` hoặc dựng từ
thứ khác bằng \`set(...)\`:

\`\`\`python
set([1, 2, 2, 3])   # {1, 2, 3}
len(set([1, 2, 2, 3]))  # 3
\`\`\`

Chú ý: \`{}\` **rỗng là dict**, không phải set. Set rỗng phải viết \`set()\`.

**Lời giải**

\`\`\`python
def describe_items(items):
    unique = set(items)
    return len(items), len(unique), len(unique) != len(items)
\`\`\`

Giá trị thứ ba là một **biểu thức so sánh**, tự trả về \`True\`/\`False\` — không cần
\`if ...: return True else: return False\`.

**Vì sao \`set\` nhanh?**

Set (và dict) dùng **bảng băm**: từ giá trị tính ra một "địa chỉ" rồi tới thẳng đó, nên kiểm tra
\`x in s\` tốn O(1) trung bình, không phụ thuộc số phần tử. Với list, \`x in lst\` phải so lần lượt →
O(n). Đó là lý do hai cách viết dưới đây khác nhau một trời một vực khi n lớn:

\`\`\`python
if x in danh_sach:   # O(n) mỗi lần
if x in tap_hop:     # O(1) mỗi lần
\`\`\`

**Cái giá của set:** mất thứ tự (\`set([3,1,2])\` không hứa in ra theo thứ tự nào) và phần tử phải
**hashable** — số, chuỗi, tuple thì được; list, dict thì không (\`set([[1,2]])\` báo
\`TypeError: unhashable type: 'list'\`).

**Bẫy nhỏ:** với Python, \`1 == True\` và \`1.0 == 1\`, nên \`set([1, True, 1.0])\` chỉ còn **một**
phần tử. Còn \`1\` và \`"1"\` là hai giá trị khác nhau — như test trong bài.
`,
    solution: `def describe_items(items):
    unique = set(items)
    return len(items), len(unique), len(unique) != len(items)`,
    complexity: {
      question: 'Độ phức tạp thời gian của hàm này với n phần tử?',
      options: [
        'O(n) — dựng set phải băm từng phần tử một lần, len() là O(1)',
        'O(n²) vì phải so mọi cặp phần tử với nhau',
        'O(1) vì chỉ gọi len()',
        'O(n log n) vì set phải sắp xếp bên trong',
      ],
      answer: 0,
      why: '`set(items)` duyệt n phần tử, mỗi phần tử băm và chèn tốn O(1) trung bình → O(n). `len()` của list và set đều là O(1) vì độ dài được lưu sẵn. Set KHÔNG sắp xếp gì — đó là lý do nó không giữ thứ tự.',
    },
    realWorld: 'Kiểm tra file import có mã trùng, phát hiện email đăng ký hai lần, đếm số người dùng duy nhất truy cập trong ngày. Mẹo `len(set(x)) != len(x)` là cách kiểm tra trùng lặp ngắn nhất và cũng là cách nhanh nhất.',
  },
  {
    id: 'py-merge-prices',
    title: 'Gộp hai bảng giá, lấy giá thấp hơn',
    en: 'Merge Price Tables',
    difficulty: 'Medium',
    targetMinutes: 12,
    entry: 'merge_prices',
    lang: 'python',
    checkerSrc: 'lambda got, exp, args: isinstance(got, dict) and got == exp',
    statement: `
Hai bảng giá là hai dict \`{tên hàng: giá}\`. Viết hàm \`merge_prices(old, new)\` trả về **dict mới**
chứa **mọi** mặt hàng có trong một trong hai bảng; mặt hàng nào có ở cả hai thì lấy **giá thấp hơn**.

**Ví dụ**

\`\`\`python
merge_prices({"ao": 100, "quan": 200}, {"quan": 150, "non": 50})
# {"ao": 100, "quan": 150, "non": 50}
\`\`\`

Không được sửa hai dict đầu vào.
`,
    starter: `def merge_prices(old, new):\n    # Tra ve dict moi, gia trung thi lay gia thap hon\n    \n`,
    tests: [
      { args: [{ ao: 100, quan: 200 }, { quan: 150, non: 50 }], expected: { ao: 100, quan: 150, non: 50 }, name: 'Ví dụ trong đề' },
      { args: [{}, { a: 1 }], expected: { a: 1 }, name: 'Bảng cũ rỗng' },
      { args: [{ a: 1 }, {}], expected: { a: 1 }, name: 'Bảng mới rỗng' },
      { args: [{}, {}], expected: {}, name: 'Cả hai rỗng' },
      { args: [{ a: 5 }, { a: 5 }], expected: { a: 5 }, name: 'Giá bằng nhau' },
      { args: [{ a: 1, b: 2 }, { a: 10, b: 0 }], expected: { a: 1, b: 0 }, name: 'Mỗi bên thắng một mặt hàng' },
      { args: [{ x: 300 }, { y: 200, z: 100 }], expected: { x: 300, y: 200, z: 100 }, name: 'Không có mặt hàng nào trùng' },
    ],
    hints: [
      '`d.keys()` trả về "khung nhìn" các khoá. Điều đặc biệt: khung nhìn này dùng được các phép toán tập hợp — `old.keys() | new.keys()` cho **hợp** của hai bộ khoá.',
      '`d.get(key, mặc_định)` lấy giá trị, và trả về `mặc_định` nếu không có khoá — khác `d[key]` là raise `KeyError`. Đây là công cụ để xử lý "mặt hàng chỉ có ở một bảng".',
      'Dict comprehension viết là `{khoá: giá_trị for ... in ...}`. Ghép lại: duyệt hợp hai bộ khoá, mỗi khoá lấy `min()` của hai giá — dùng `float("inf")` làm mặc định để bên thiếu không bao giờ thắng.',
    ],
    diagnostics: [
      { test: 'old\\s*\\[', message: 'Truy cập `old[ten]` sẽ raise `KeyError` với mặt hàng chỉ có ở bảng `new`. Dùng `old.get(ten, ...)` để có giá trị mặc định.' },
      { test: 'old\\.update\\s*\\(|old\\s*\\[[^\\]]+\\]\\s*=', message: 'Bạn đang sửa thẳng dict `old` — đề yêu cầu không thay đổi đầu vào. Hãy tạo bản sao `dict(old)` hoặc dựng dict mới bằng comprehension.' },
      { test: '\\{\\s*\\*\\*\\s*old\\s*,\\s*\\*\\*\\s*new\\s*\\}', message: '`{**old, **new}` gộp đúng nhưng luôn để `new` ghi đè, không so sánh giá. Đề cần lấy giá THẤP HƠN nên phải có `min()`.' },
    ],
    approach: `
**Ba công cụ dict cần cho bài này**

\`\`\`python
d.keys()                 # khung nhìn các khoá
old.keys() | new.keys()  # HỢP hai bộ khoá (toán tử của set!)
d.get(k, default)         # lấy giá trị, không có thì trả default (không raise)
\`\`\`

Điểm hay: \`.keys()\` hành xử như một **set**, nên dùng được cả \`|\` (hợp), \`&\` (giao),
\`-\` (hiệu). \`old.keys() & new.keys()\` là "các mặt hàng có ở cả hai bảng" — một dòng, không vòng lặp.

**Lời giải bằng dict comprehension**

\`\`\`python
def merge_prices(old, new):
    return {
        ten: min(old.get(ten, float("inf")), new.get(ten, float("inf")))
        for ten in old.keys() | new.keys()
    }
\`\`\`

Đọc: "với mỗi \`ten\` trong hợp hai bộ khoá, giá là min của giá bên cũ và bên mới".
\`float("inf")\` là **dương vô cực** — dùng làm giá trị mặc định để bên nào không có mặt hàng thì
chắc chắn thua ở \`min()\`. Mẹo này áp dụng chung: khi cần "giá trị trung tính cho phép min",
dùng \`inf\`; cho phép max thì dùng \`-inf\`.

**Cách viết bằng vòng lặp (dễ đọc hơn khi logic phức tạp dần)**

\`\`\`python
def merge_prices(old, new):
    ket_qua = dict(old)          # bản sao, không sửa bản gốc
    for ten, gia in new.items():
        if ten in ket_qua:
            ket_qua[ten] = min(ket_qua[ten], gia)
        else:
            ket_qua[ten] = gia
    return ket_qua
\`\`\`

\`.items()\` cho từng cặp \`(khoá, giá_trị)\`, và \`for ten, gia in ...\` **giải nén** cặp đó ra hai
biến ngay tại chỗ. Đây là cách duyệt dict chuẩn — \`for k in d: d[k]\` là cách viết vòng vo.

**\`dict(old)\` khác \`old\` chỗ nào?** \`b = old\` chỉ tạo thêm một cái tên cho **cùng** một dict
(sửa \`b\` là sửa \`old\`); \`dict(old)\` tạo dict mới. Hàm nhận dữ liệu của người khác thì đừng
sửa vào bản gốc — đó là loại lỗi rất khó tìm vì nơi báo lỗi cách nơi gây lỗi rất xa.
`,
    solution: `def merge_prices(old, new):
    return {
        ten: min(old.get(ten, float("inf")), new.get(ten, float("inf")))
        for ten in old.keys() | new.keys()
    }`,
    complexity: {
      question: 'Với bảng cũ n mặt hàng và bảng mới m mặt hàng, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(n + m) — mỗi khoá được xử lý một lần, tra cứu dict là O(1) trung bình',
        'O(n · m) vì phải so từng mặt hàng bảng này với từng mặt hàng bảng kia',
        'O(n log n) vì phải sắp xếp khoá',
        'O(1)',
      ],
      answer: 0,
      why: 'Hợp hai bộ khoá có nhiều nhất n + m phần tử; với mỗi khoá ta gọi `.get()` hai lần, mỗi lần O(1) trung bình nhờ bảng băm. Không có vòng lặp lồng nhau nào nên không thể là O(n·m).',
    },
    realWorld: 'Gộp cấu hình theo nhiều lớp (mặc định → theo môi trường → theo người dùng), so bảng giá nhà cung cấp để chọn giá tốt nhất, hợp nhất hai bản danh mục sau khi đồng bộ. Quy tắc "gộp thế nào khi trùng khoá" chính là phần dễ sai nhất — hãy viết nó ra thành `min`/`max`/"bên nào thắng" thay vì để `update()` quyết định ngầm.',
  },
  {
    id: 'py-parse-rows',
    title: 'Tách dòng dữ liệu bằng giải nén có dấu sao',
    en: 'Parse Rows with Starred Unpacking',
    difficulty: 'Medium',
    targetMinutes: 14,
    entry: 'parse_rows',
    lang: 'python',
    statement: `
Mỗi hàng dữ liệu là một list: ô đầu là **tên**, ô thứ hai là **tuổi** (dạng chuỗi số), các ô còn
lại — có thể không có ô nào — là **thẻ** (tag).

Viết hàm \`parse_rows(rows)\` trả về list các dict \`{"ten": ..., "tuoi": ..., "the": [...]}\`
với \`tuoi\` đã đổi sang số nguyên. Hàng có **ít hơn 2 ô** thì bỏ qua.

**Ví dụ**

\`\`\`python
parse_rows([["An", "20", "vip", "new"], ["Binh", "31"]])
# [{"ten": "An", "tuoi": 20, "the": ["vip", "new"]},
#  {"ten": "Binh", "tuoi": 31, "the": []}]
\`\`\`
`,
    starter: `def parse_rows(rows):\n    # Tach moi hang thanh dict {"ten", "tuoi", "the"}\n    \n`,
    tests: [
      { args: [[['An', '20', 'vip', 'new']]], expected: [{ ten: 'An', tuoi: 20, the: ['vip', 'new'] }], name: 'Có hai thẻ' },
      { args: [[['Binh', '31']]], expected: [{ ten: 'Binh', tuoi: 31, the: [] }], name: 'Không có thẻ nào' },
      { args: [[]], expected: [], name: 'Không có hàng nào' },
      { args: [[['Cuong', '0', 'x'], ['Dung', '45']]], expected: [{ ten: 'Cuong', tuoi: 0, the: ['x'] }, { ten: 'Dung', tuoi: 45, the: [] }], name: 'Hai hàng khác dạng' },
      { args: [[['Eo'], ['Fa', '10']]], expected: [{ ten: 'Fa', tuoi: 10, the: [] }], name: 'Hàng thiếu ô — bỏ qua' },
      { args: [[[]]], expected: [], name: 'Hàng rỗng — bỏ qua' },
      { args: [[['Gia', '7', 'a', 'b', 'c']]], expected: [{ ten: 'Gia', tuoi: 7, the: ['a', 'b', 'c'] }], name: 'Ba thẻ' },
    ],
    hints: [
      'Giải nén thường: `a, b = [1, 2]`. Nếu số biến không khớp số phần tử, Python raise `ValueError` — đó là lý do phải bỏ qua hàng thiếu ô.',
      'Dấu `*` trước MỘT biến bên trái dấu `=` sẽ gom "phần còn lại" vào list: `ten, tuoi, *the = row`. Khi row chỉ có 2 ô, `the` là list rỗng — không lỗi.',
      '`int("20")` đổi chuỗi sang số nguyên. Nhớ bỏ qua hàng `len(row) < 2` bằng `continue` TRƯỚC khi giải nén.',
    ],
    diagnostics: [
      { test: 'row\\s*\\[\\s*2\\s*:\\s*\\]', message: '`row[2:]` chạy đúng, nhưng `ten, tuoi, *the = row` nói rõ ý hơn: "hai ô đầu có tên gọi, phần còn lại gom lại". Đọc code là thấy ngay cấu trúc của một hàng.' },
      { test: 'int\\s*\\(\\s*row\\s*\\)', message: '`int(row)` là đổi cả LIST sang số — luôn `TypeError`. Bạn cần đổi riêng ô tuổi: `int(tuoi)`.' },
      { test: 'the\\s*=\\s*\\[\\s*\\]\\s*$', message: 'Không cần khởi tạo `the = []` rồi append: giải nén có dấu sao đã tự tạo list (kể cả list rỗng) cho bạn.' },
    ],
    approach: `
**Giải nén (unpacking) — gán nhiều biến một lượt**

\`\`\`python
a, b = [1, 2]          # a=1, b=2
a, b = b, a            # đổi chỗ hai biến, không cần biến tạm
ten, tuoi, *the = ["An", "20", "vip", "new"]
# ten="An", tuoi="20", the=["vip", "new"]
\`\`\`

Dấu \`*\` bên trái dấu \`=\` nghĩa là "gom phần còn lại vào một **list**". Ba tính chất đáng nhớ:

- Chỉ được có **một** biến mang dấu \`*\` trong một lệnh giải nén.
- Biến \`*\` luôn nhận **list**, kể cả khi chỉ còn 0 hoặc 1 phần tử (\`the == []\`).
- Đặt ở đâu cũng được: \`dau, *giua, cuoi = row\` cho bạn phần tử đầu, phần tử cuối và khúc giữa.

**Lời giải**

\`\`\`python
def parse_rows(rows):
    ket_qua = []
    for row in rows:
        if len(row) < 2:
            continue                       # hàng thiếu ô -> bỏ qua
        ten, tuoi, *the = row
        ket_qua.append({"ten": ten, "tuoi": int(tuoi), "the": the})
    return ket_qua
\`\`\`

**Vì sao phải kiểm tra \`len(row) < 2\` trước?** Vì giải nén là **chặt chẽ**: nếu bên phải không đủ
phần tử cho các biến không có dấu \`*\`, Python raise ngay
\`ValueError: not enough values to unpack\`. Ta chọn "bỏ qua hàng lỗi" nên phải chặn trước bằng
\`continue\`. (Cách khác là \`try/except ValueError\` — module 7 sẽ bàn khi nào nên dùng cách nào.)

**\`int("20")\` và bẫy của nó**

\`int()\` chỉ nhận chuỗi số hợp lệ. \`int("hai muoi")\` hay \`int("")\` raise \`ValueError\`, còn
\`int("20.5")\` **cũng raise** — muốn đổi số thực trong chuỗi phải qua \`float()\` trước.
Dữ liệu thật hay bẩn, nên trong code thật bước này thường được bọc \`try/except\`.

**Bonus — giải nén ngay ở đầu vòng \`for\`**

\`for ten, tuoi, *the in rows:\` cũng hợp lệ và ngắn hơn. Nhưng khi đó không còn chỗ nào để kiểm
tra \`len(row)\`, nên một hàng lỗi sẽ làm sập cả vòng lặp. Ở đây ta cần độ bền, nên giải nén sau
khi đã kiểm tra.
`,
    solution: `def parse_rows(rows):
    ket_qua = []
    for row in rows:
        if len(row) < 2:
            continue
        ten, tuoi, *the = row
        ket_qua.append({"ten": ten, "tuoi": int(tuoi), "the": the})
    return ket_qua`,
    complexity: {
      question: 'Với n hàng, mỗi hàng nhiều nhất k ô, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(n · k) — mỗi ô được đọc/copy một số lần cố định',
        'O(n) vì mỗi hàng chỉ tốn một phép giải nén',
        'O(n²)',
        'O(n log n)',
      ],
      answer: 0,
      why: 'Giải nén có dấu sao phải copy các ô còn lại sang list mới, nên chi phí một hàng tỉ lệ với số ô của hàng đó. Tổng lại là tổng số ô — viết gọn thành O(n·k).',
    },
    realWorld: 'Đọc CSV/TSV mà số cột cuối không cố định (danh sách thẻ, danh sách quyền), tách chuỗi lệnh thành `lenh, *doi_so = text.split()`, bóc header của một giao thức rồi giữ phần thân. Kiểm tra độ dài trước khi giải nén là thói quen giúp một dòng dữ liệu bẩn không làm sập cả job.',
  },
];

/* ==================================================================== */
/* MODULE 4 — py-oop                                                     */
/* ==================================================================== */
const PY_OOP = [
  {
    id: 'py-drill-rectangle-class',
    title: 'Class đầu tiên: hình chữ nhật',
    en: 'Your First Class',
    difficulty: 'Easy',
    targetMinutes: 8,
    entry: 'Rectangle',
    lang: 'python',
    harnessSrc: 'lambda Cls, args, t: [Cls(*args).area(), Cls(*args).perimeter()]',
    statement: `
Viết class \`Rectangle\` mô tả hình chữ nhật:

- \`__init__(self, width, height)\` — lưu chiều rộng và chiều cao vào đối tượng
- \`area(self)\` — trả về diện tích (\`width * height\`)
- \`perimeter(self)\` — trả về chu vi (\`2 * (width + height)\`)

**Ví dụ**

\`\`\`python
r = Rectangle(3, 4)
r.area()       # 12
r.perimeter()  # 14
\`\`\`

> Bài này chấm bằng cách tạo \`Rectangle(*args)\` rồi gọi hai phương thức — hãy giữ đúng tên class,
> tên phương thức và thứ tự tham số.
`,
    starter: `class Rectangle:\n    def __init__(self, width, height):\n        # Luu width va height vao doi tuong\n        pass\n\n    def area(self):\n        pass\n\n    def perimeter(self):\n        pass\n`,
    tests: [
      { args: [3, 4], expected: [12, 14], name: 'Ví dụ cơ bản' },
      { args: [1, 1], expected: [1, 4], name: 'Hình vuông đơn vị' },
      { args: [0, 5], expected: [0, 10], name: 'Một chiều bằng 0' },
      { args: [2.5, 4], expected: [10.0, 13.0], name: 'Số thực' },
      { args: [10, 10], expected: [100, 40], name: 'Hình vuông' },
    ],
    hints: [
      '`__init__` là phương thức chạy tự động khi bạn viết `Rectangle(3, 4)`. Việc của nó là **gắn dữ liệu vào đối tượng**: `self.width = width`.',
      '`self` là chính đối tượng đang được thao tác. Python truyền nó vào tự động — bạn khai báo `def area(self)` nhưng gọi `r.area()` (không truyền self).',
      'Bên trong phương thức, muốn đọc dữ liệu đã lưu thì phải qua `self`: `return self.width * self.height`. Viết `return width * height` sẽ báo `NameError` vì không có biến nào tên `width` trong phương thức đó.',
    ],
    diagnostics: [
      { test: 'def\\s+(area|perimeter)\\s*\\(\\s*\\)', message: 'Mọi phương thức của đối tượng đều phải có `self` làm tham số đầu: `def area(self):`. Thiếu `self` thì lúc gọi `r.area()` Python báo "takes 0 positional arguments but 1 was given".' },
      { test: 'return\\s+width\\s*\\*\\s*height', message: 'Thiếu `self.`: trong `area()` không có biến cục bộ nào tên `width`. Dữ liệu đã lưu vào đối tượng nên phải đọc qua `self.width`.' },
      { test: 'def\\s+__int__|def\\s+_init_\\b|def\\s+__init_\\b', message: 'Tên đúng là `__init__` — hai dấu gạch dưới ở CẢ hai đầu. Viết sai tên thì Python không gọi nó, và đối tượng của bạn sẽ không có thuộc tính nào.' },
    ],
    approach: `
**Class là khuôn, đối tượng là món đồ làm ra từ khuôn**

\`\`\`python
class Rectangle:                        # khuôn
    def __init__(self, width, height):  # chạy khi tạo đối tượng
        self.width = width              # gắn dữ liệu VÀO đối tượng
        self.height = height

    def area(self):                     # hành vi
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

r = Rectangle(3, 4)   # gọi tên class như gọi hàm -> __init__ chạy
r.area()              # 12
\`\`\`

**Giải mã ba thứ khó hiểu nhất với người mới**

1. **\`self\` là gì?** Là đối tượng đang được thao tác. Khi bạn viết \`r.area()\`, Python dịch thành
   \`Rectangle.area(r)\` — \`r\` được đưa vào chỗ \`self\`. Vì vậy khai báo phải có \`self\`, còn lời gọi
   thì không truyền. Tên \`self\` chỉ là quy ước (không phải từ khoá) nhưng **đừng đổi**.
2. **\`__init__\` là gì?** "Initialize" — hàm khởi tạo. Nó **không** tạo ra đối tượng (Python đã tạo
   trước đó rồi), việc của nó chỉ là *điền dữ liệu* vào đối tượng trống ấy. Hai dấu gạch dưới ở hai
   đầu là quy ước cho "phương thức đặc biệt Python tự gọi" — gọi là *dunder* (double underscore).
3. **\`self.width\` khác \`width\` thế nào?** \`width\` là tham số, sống và chết trong \`__init__\`.
   \`self.width\` là thuộc tính gắn vào đối tượng, còn sống sau khi \`__init__\` kết thúc — nên
   \`area()\` mới đọc được. Quên chữ \`self.\` là lỗi số một của người mới.

**Vì sao không dùng hai hàm rời cho gọn?**

\`\`\`python
def area(w, h): return w * h
def perimeter(w, h): return 2 * (w + h)
\`\`\`

Chạy được. Nhưng khi cần thêm \`scale()\`, \`is_square()\`, kiểm tra \`width > 0\`... bạn sẽ phải
truyền \`w, h\` đi khắp nơi và không gì bảo đảm chúng đi cùng nhau. Class **đóng gói dữ liệu với
hành vi** để "một hình chữ nhật" là *một* thứ, không phải hai con số rời rạc.
`,
    solution: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)`,
    complexity: {
      question: 'Gọi `r.area()` tốn độ phức tạp thời gian bao nhiêu?',
      options: [
        'O(1) — tra thuộc tính trong dict của đối tượng rồi nhân, đều là hằng số',
        'O(n) theo số thuộc tính của class',
        'O(log n) vì phải tìm phương thức trong cây kế thừa',
        'O(1) chỉ khi class không kế thừa ai',
      ],
      answer: 0,
      why: 'Thuộc tính của đối tượng được lưu trong một dict (`r.__dict__`) nên tra cứu là O(1) trung bình; phép nhân cũng là O(1). Việc tìm phương thức đi theo chuỗi kế thừa (MRO) nhưng chuỗi này ngắn và cố định, không phụ thuộc dữ liệu.',
    },
    realWorld: 'Mọi thứ có "dữ liệu đi kèm hành vi" đều là ứng viên cho class: kết nối database (`conn.query()`), giỏ hàng (`cart.add()`), request HTTP (`req.json()`). Dấu hiệu nên tạo class: bạn thấy mình truyền đúng cùng một bộ tham số vào hết hàm này tới hàm khác.',
  },
  {
    id: 'py-drill-book-str',
    title: 'Cho đối tượng biết tự giới thiệu',
    en: 'Object with __str__',
    difficulty: 'Easy',
    targetMinutes: 8,
    entry: 'Book',
    lang: 'python',
    harnessSrc: `def harness(Cls, args, t):
    sach = Cls(*args)
    return [str(sach), sach.year]`,
    statement: `
Viết class \`Book\` với \`__init__(self, title, author, year)\` lưu ba thuộc tính cùng tên, và
phương thức đặc biệt \`__str__\` để khi \`print()\` hoặc \`str()\` một quyển sách thì ra:

\`\`\`
Ten sach - Tac gia (1988)
\`\`\`

**Ví dụ**

\`\`\`python
s = Book("Nha gia kim", "Paulo Coelho", 1988)
str(s)    # "Nha gia kim - Paulo Coelho (1988)"
print(s)  # in ra đúng chuỗi trên
\`\`\`
`,
    starter: `class Book:\n    def __init__(self, title, author, year):\n        pass\n\n    def __str__(self):\n        pass\n`,
    tests: [
      { args: ['Nha gia kim', 'Paulo Coelho', 1988], expected: ['Nha gia kim - Paulo Coelho (1988)', 1988], name: 'Ví dụ cơ bản' },
      { args: ['Dac nhan tam', 'Dale Carnegie', 1936], expected: ['Dac nhan tam - Dale Carnegie (1936)', 1936], name: 'Sách khác' },
      { args: ['X', 'Y', 0], expected: ['X - Y (0)', 0], name: 'Năm bằng 0' },
      { args: ['', 'An danh', 2024], expected: [' - An danh (2024)', 2024], name: 'Tên sách rỗng' },
      { args: ['Ky thuat 101', 'Nhieu tac gia', 2019], expected: ['Ky thuat 101 - Nhieu tac gia (2019)', 2019], name: 'Tên có số' },
    ],
    hints: [
      '`__str__` phải **trả về** một chuỗi bằng `return`, không phải `print()` bên trong. `print()` in ra màn hình và trả về `None` — làm vậy `str(sach)` sẽ báo lỗi.',
      'Dùng f-string đọc các thuộc tính qua `self`: `f"{self.title} - {self.author} ({self.year})"`.',
      'Dấu ngoặc quanh năm là ký tự bình thường trong chuỗi, chỉ có `{self.year}` mới được thay bằng giá trị: `({self.year})`.',
    ],
    diagnostics: [
      { test: 'def\\s+__str__[\\s\\S]{0,200}print\\s*\\(', message: '`__str__` phải `return` chuỗi, không được `print()`. Nếu `print` bên trong, hàm trả về `None` và Python báo "__str__ returned non-string".' },
      { test: 'def\\s+toString|def\\s+to_string', message: 'Python không dùng `toString()`. Tên đúng của "phương thức tự mô tả" là `__str__` — nhờ đúng tên này mà `print()`, `str()`, f-string mới tự gọi được nó.' },
      { test: 'def\\s+__str__\\s*\\(\\s*\\)', message: '`__str__` cũng là phương thức của đối tượng nên phải nhận `self`: `def __str__(self):`.' },
    ],
    approach: `
**Dunder — những phương thức Python tự gọi**

\`__str__\` không phải hàm bạn gọi trực tiếp. Bạn viết nó ra, rồi **Python gọi giúp** mỗi khi cần
biến đối tượng thành chuỗi:

\`\`\`python
class Book:
    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year

    def __str__(self):
        return f"{self.title} - {self.author} ({self.year})"

s = Book("Nha gia kim", "Paulo Coelho", 1988)
print(s)          # Python gọi s.__str__()
str(s)            # cũng vậy
f"Sach: {s}"      # cũng vậy
\`\`\`

Không có \`__str__\`, \`print(s)\` in ra \`<__main__.Book object at 0x7f3c...>\` — đúng kỹ thuật nhưng
vô dụng khi debug.

**\`__str__\` và \`__repr__\` khác nhau ra sao?**

- \`__str__\` — dành cho **người dùng cuối** đọc, ưu tiên dễ hiểu.
- \`__repr__\` — dành cho **lập trình viên**, nên hiện đủ thông tin để tái tạo đối tượng, kiểu
  \`Book('Nha gia kim', 'Paulo Coelho', 1988)\`.

Khi bạn xem một list trong console, Python dùng \`__repr__\` của từng phần tử — đó là lý do
\`print([s])\` vẫn hiện \`<Book object ...>\` dù đã có \`__str__\`. Kinh nghiệm thực tế: nếu chỉ viết
được một cái, hãy viết \`__repr__\` (vì \`str()\` sẽ tự dùng \`__repr__\` khi không có \`__str__\`).

**Các dunder hay dùng khác**

- \`__len__\` → cho \`len(obj)\` chạy được
- \`__eq__\` → cho \`obj1 == obj2\` so theo nội dung thay vì so danh tính
- \`__bool__\` → quyết định \`if obj:\` là đúng hay sai
- \`__call__\` → cho phép gọi đối tượng như hàm: \`obj()\`

Nguyên tắc chung của Python: **muốn đối tượng của bạn hoạt động với cú pháp có sẵn của ngôn ngữ,
hãy cài dunder tương ứng** — thay vì bắt người dùng học tên hàm riêng của bạn.
`,
    solution: `class Book:
    def __init__(self, title, author, year):
        self.title = title
        self.author = author
        self.year = year

    def __str__(self):
        return f"{self.title} - {self.author} ({self.year})"`,
    complexity: {
      question: 'Chi phí của `str(sach)` theo tổng độ dài t của tên sách và tác giả?',
      options: ['O(t) — phải dựng một chuỗi mới dài cỡ t', 'O(1) vì chuỗi đã có sẵn trong đối tượng', 'O(t²)', 'O(log t)'],
      answer: 0,
      why: 'f-string tạo ra một chuỗi MỚI, phải copy từng ký tự của các phần ghép vào. Chuỗi trong Python là bất biến nên không thể "nối tại chỗ" — mỗi lần định dạng là một lần cấp phát và copy.',
    },
    realWorld: 'Log và báo lỗi sống nhờ `__str__`/`__repr__`: một dòng log `Đã lưu <Order object at 0x...>` là vô dụng, còn `Đã lưu Order(id=42, total=150000)` thì tìm được ngay. Đây là việc bỏ 3 dòng code để tiết kiệm hàng giờ debug.',
  },
  {
    id: 'py-employee-inherit',
    title: 'Kế thừa: lương nhân viên và quản lý',
    en: 'Inheritance: Employee and Manager',
    difficulty: 'Medium',
    targetMinutes: 14,
    entry: 'pay_slips',
    lang: 'python',
    statement: `
Xây hai class:

- \`Employee(name, base)\` — \`salary()\` trả về \`base\`
- \`Manager(name, base, bonus_percent)\` — **kế thừa** \`Employee\`, \`salary()\` trả về
  \`base + base * bonus_percent / 100\`

Sau đó viết hàm \`pay_slips(rows)\`: mỗi phần tử của \`rows\` là một list mô tả một người —
\`["emp", tên, base]\` hoặc \`["mgr", tên, base, bonus_percent]\`. Hàm trả về list các cặp
\`[tên, lương]\` theo đúng thứ tự đầu vào.

**Ví dụ**

\`\`\`python
pay_slips([["emp", "An", 1000], ["mgr", "Binh", 1000, 20]])
# [["An", 1000], ["Binh", 1200.0]]
\`\`\`

> Yêu cầu: \`Manager.__init__\` phải gọi \`super().__init__(...)\` để tái dùng phần khởi tạo của
> \`Employee\`, không được gán lại \`self.name\`, \`self.base\` thủ công.
`,
    starter: `class Employee:\n    def __init__(self, name, base):\n        pass\n\n    def salary(self):\n        pass\n\n\nclass Manager(Employee):\n    def __init__(self, name, base, bonus_percent):\n        pass\n\n    def salary(self):\n        pass\n\n\ndef pay_slips(rows):\n    pass\n`,
    tests: [
      { args: [[['emp', 'An', 1000]]], expected: [['An', 1000]], name: 'Một nhân viên thường' },
      { args: [[['mgr', 'Binh', 1000, 20]]], expected: [['Binh', 1200]], name: 'Một quản lý, thưởng 20%' },
      { args: [[['emp', 'A', 0], ['mgr', 'B', 100, 0]]], expected: [['A', 0], ['B', 100]], name: 'Thưởng 0% — lương bằng base' },
      { args: [[['mgr', 'C', 3000, 10], ['emp', 'D', 500]]], expected: [['C', 3300], ['D', 500]], name: 'Giữ đúng thứ tự đầu vào' },
      { args: [[]], expected: [], name: 'Không có ai' },
      { args: [[['mgr', 'E', 1000, 150]]], expected: [['E', 2500]], name: 'Thưởng lớn hơn 100%' },
    ],
    hints: [
      '`class Manager(Employee):` là cú pháp kế thừa — Manager có sẵn mọi thứ của Employee.',
      '`super().__init__(name, base)` gọi `__init__` của lớp cha để nó lo `self.name`, `self.base`. Sau dòng đó bạn chỉ cần gán thêm phần riêng: `self.bonus_percent = bonus_percent`.',
      'Trong `pay_slips`, đọc ô đầu để biết tạo class nào: `if row[0] == "mgr": nguoi = Manager(row[1], row[2], row[3])`. Rồi `nguoi.salary()` — Python tự chọn đúng `salary()` của lớp thật, đó chính là *đa hình*.',
    ],
    diagnostics: [
      { test: 'class\\s+Manager\\s*:', message: 'Thiếu lớp cha trong ngoặc: phải là `class Manager(Employee):`. Viết `class Manager:` thì Manager không kế thừa gì, và `super().__init__` sẽ không tới được Employee.' },
      { test: 'Employee\\.__init__\\s*\\(\\s*self', message: 'Gọi thẳng `Employee.__init__(self, ...)` chạy được nhưng ghim cứng tên lớp cha — đổi cây kế thừa là phải sửa. `super().__init__(...)` luôn trỏ đúng lớp cha theo MRO.' },
      { test: 'def\\s+__init__[\\s\\S]{0,300}self\\.name\\s*=[\\s\\S]{0,200}self\\.base\\s*=[\\s\\S]{0,400}class\\s+Manager[\\s\\S]{0,300}self\\.name\\s*=', message: 'Manager đang gán lại `self.name`/`self.base` — lặp lại việc Employee đã làm. Gọi `super().__init__(name, base)` để một chỗ duy nhất chịu trách nhiệm khởi tạo.' },
    ],
    approach: `
**Kế thừa: viết phần khác biệt, không viết lại phần giống nhau**

\`\`\`python
class Employee:
    def __init__(self, name, base):
        self.name = name
        self.base = base

    def salary(self):
        return self.base


class Manager(Employee):                       # ← kế thừa
    def __init__(self, name, base, bonus_percent):
        super().__init__(name, base)           # nhờ cha khởi tạo phần chung
        self.bonus_percent = bonus_percent     # rồi thêm phần riêng

    def salary(self):                          # ghi đè (override)
        return self.base + self.base * self.bonus_percent / 100
\`\`\`

**\`super()\` là gì?** Là "lớp cha của lớp đang viết". \`super().__init__(name, base)\` chạy
\`__init__\` của \`Employee\` với chính đối tượng Manager đang tạo. Lợi ích: quy tắc khởi tạo
\`name/base\` chỉ tồn tại **một chỗ**; mai này Employee thêm \`self.id = ...\` thì Manager tự có.

**Ghi đè (override)** — Manager định nghĩa lại \`salary()\`. Không có từ khoá gì đặc biệt: cùng tên
là ghi đè. Muốn *mở rộng* thay vì thay thế hoàn toàn thì gọi cả bản của cha:

\`\`\`python
def salary(self):
    return super().salary() + self.base * self.bonus_percent / 100
\`\`\`

**Đa hình (polymorphism) — phần đáng giá nhất**

\`\`\`python
def pay_slips(rows):
    ket_qua = []
    for row in rows:
        if row[0] == "mgr":
            nguoi = Manager(row[1], row[2], row[3])
        else:
            nguoi = Employee(row[1], row[2])
        ket_qua.append([nguoi.name, nguoi.salary()])   # KHÔNG cần biết là ai
    return ket_qua
\`\`\`

Dòng \`nguoi.salary()\` không hề có \`if\` nào để phân biệt loại người, nhưng vẫn chạy đúng công
thức của từng loại — Python tra phương thức trên **lớp thật** của đối tượng lúc chạy. Thêm
\`Director\` mai này chỉ cần thêm class, dòng tính lương không phải sửa.

Chú ý chỗ \`if\` còn lại: nó nằm ở **nơi tạo đối tượng**, không nằm ở nơi dùng. Đây là mẫu hình
chung — dồn mọi phân nhánh "loại nào" vào một điểm (gọi là *factory*), phần còn lại của hệ thống
làm việc với giao diện chung.

**Vì sao lương quản lý ra \`1200.0\` mà không phải \`1200\`?** Vì \`/\` luôn trả về float. Với tiền
tệ thật, đừng dùng float — hãy tính bằng đơn vị nhỏ nhất (đồng, xu) với \`int\`, hoặc dùng
\`decimal.Decimal\`.
`,
    solution: `class Employee:
    def __init__(self, name, base):
        self.name = name
        self.base = base

    def salary(self):
        return self.base


class Manager(Employee):
    def __init__(self, name, base, bonus_percent):
        super().__init__(name, base)
        self.bonus_percent = bonus_percent

    def salary(self):
        return self.base + self.base * self.bonus_percent / 100


def pay_slips(rows):
    ket_qua = []
    for row in rows:
        if row[0] == "mgr":
            nguoi = Manager(row[1], row[2], row[3])
        else:
            nguoi = Employee(row[1], row[2])
        ket_qua.append([nguoi.name, nguoi.salary()])
    return ket_qua`,
    complexity: {
      question: 'Với n người, độ phức tạp thời gian của `pay_slips` là bao nhiêu?',
      options: [
        'O(n) — mỗi người tạo một đối tượng và gọi salary() một lần, đều là O(1)',
        'O(n · d) với d là độ sâu cây kế thừa',
        'O(n²)',
        'O(n log n)',
      ],
      answer: 0,
      why: 'Mỗi vòng lặp làm một lượng việc hằng số. Việc tra phương thức trên chuỗi kế thừa (MRO) có phụ thuộc độ sâu d, nhưng d là hằng số của chương trình (không lớn theo dữ liệu) và Python còn cache kết quả tra cứu này.',
    },
    realWorld: 'Kế thừa + đa hình là bộ xương của mọi hệ thống có "nhiều loại cùng làm một việc": nhiều phương thức thanh toán (`pay()`), nhiều định dạng xuất báo cáo (`render()`), nhiều loại thông báo (`send()`). Cẩn thận: nếu các lớp con không thật sự "là một loại" của lớp cha, kế thừa sẽ thành gánh nặng — khi đó dùng thành phần rời (composition) tốt hơn.',
  },
  {
    id: 'py-dataclass-order',
    title: 'dataclass và bẫy giá trị mặc định dùng chung',
    en: 'dataclass and the Shared Default Trap',
    difficulty: 'Medium',
    targetMinutes: 15,
    entry: 'order_summary',
    lang: 'python',
    statement: `
Dùng \`@dataclass\` viết class \`Order\` chứa một danh sách món hàng:

- thuộc tính \`items\` — **mặc định là danh sách rỗng**, và mỗi đơn hàng phải có danh sách RIÊNG
- \`add(self, name, qty, price)\` — thêm một món
- \`total(self)\` — tổng tiền (\`qty * price\` của mọi món)

Rồi viết \`order_summary(carts)\`: mỗi phần tử của \`carts\` là một giỏ hàng — list các
\`[tên, số lượng, đơn giá]\`. Với mỗi giỏ, tạo **một \`Order()\` mới**, thêm hết món trong giỏ, rồi
lấy tổng tiền. Trả về list các tổng tiền.

**Ví dụ**

\`\`\`python
order_summary([[["ao", 2, 100]], [["quan", 1, 200]]])   # [200, 200]
\`\`\`

> Nếu bạn khai \`items: list = []\` thì **mọi** đơn hàng dùng CHUNG một danh sách và kết quả sẽ là
> \`[200, 400]\`. Bài này chính là để bạn gặp lỗi đó và biết cách sửa.
`,
    starter: `from dataclasses import dataclass, field\n\n\n@dataclass\nclass Order:\n    # Khai bao items sao cho moi don hang co danh sach RIENG\n    pass\n\n\ndef order_summary(carts):\n    pass\n`,
    tests: [
      { args: [[[['ao', 2, 100]], [['quan', 1, 200]]]], expected: [200, 200], name: 'Hai giỏ độc lập — bẫy dùng chung list' },
      { args: [[[['a', 1, 10], ['b', 2, 20]]]], expected: [50], name: 'Một giỏ hai món' },
      { args: [[[], []]], expected: [0, 0], name: 'Hai giỏ rỗng' },
      { args: [[[['x', 3, 7]], [], [['y', 1, 1]]]], expected: [21, 0, 1], name: 'Có giỏ rỗng ở giữa' },
      { args: [[]], expected: [], name: 'Không có giỏ nào' },
      { args: [[[['m', 0, 999]]]], expected: [0], name: 'Số lượng bằng 0' },
    ],
    hints: [
      '`@dataclass` là *decorator*: đặt ngay trên `class`, nó tự sinh `__init__`, `__repr__`, `__eq__` từ danh sách thuộc tính bạn khai báo.',
      'Trong dataclass, thuộc tính khai theo dạng `tên: kiểu = mặc_định`. Với giá trị mặc định là list/dict/set, KHÔNG viết `= []` mà phải `= field(default_factory=list)`.',
      '`default_factory=list` nghĩa là "mỗi lần tạo đối tượng, hãy gọi `list()` để có một danh sách mới". Nhờ vậy hai `Order()` không dùng chung dữ liệu.',
    ],
    diagnostics: [
      { test: 'items\\s*:\\s*list\\s*=\\s*\\[\\s*\\]', message: 'Đây chính là bẫy: `items: list = []` bị dataclass chặn thẳng bằng `ValueError: mutable default`. Dùng `field(default_factory=list)` để mỗi đối tượng có danh sách riêng.' },
      { test: 'def\\s+total[\\s\\S]{0,200}for[\\s\\S]{0,200}return\\s+0', message: '`return 0` nằm trong hoặc sau vòng lặp sai chỗ sẽ luôn ra 0. Hãy cộng dồn vào một biến rồi trả về, hoặc dùng `sum(...)`.' },
      { test: 'Order\\s*\\(\\s*\\)[\\s\\S]{0,80}for\\s+cart', message: 'Đối tượng `Order()` đang được tạo TRƯỚC vòng lặp qua các giỏ, nên mọi giỏ dồn vào cùng một đơn hàng. Mỗi giỏ phải có `order = Order()` riêng bên trong vòng lặp.' },
    ],
    approach: `
**\`@dataclass\` — viết class chứa dữ liệu trong vài dòng**

\`\`\`python
from dataclasses import dataclass, field

@dataclass
class Order:
    items: list = field(default_factory=list)

    def add(self, name, qty, price):
        self.items.append((name, qty, price))

    def total(self):
        return sum(qty * price for _, qty, price in self.items)
\`\`\`

Chỉ khai báo thuộc tính, \`@dataclass\` tự sinh cho bạn \`__init__\`, \`__repr__\` (in ra
\`Order(items=[...])\` thay vì \`<Order object at 0x...>\`) và \`__eq__\` (so sánh theo nội dung).

**Vì sao \`= []\` là sai?**

Giá trị mặc định của một hàm/class được tính **đúng một lần**, lúc câu lệnh định nghĩa chạy — không
phải mỗi lần tạo đối tượng. Nên \`items: list = []\` sẽ tạo *một* danh sách rồi cho **mọi** đơn hàng
dùng chung nó; đơn thứ hai sẽ thấy món của đơn thứ nhất. Đây cùng gốc rễ với bẫy \`def f(x=[])\`
trong module 2.

Chuyện hay: \`@dataclass\` **không cho bạn mắc lỗi này** — nó raise
\`ValueError: mutable default <class 'list'> for field items\` ngay lúc định nghĩa class.
\`field(default_factory=list)\` là cách nói "mỗi đối tượng, gọi \`list()\` một lần để có bản riêng".

**Đọc \`sum(qty * price for _, qty, price in self.items)\`**

- Phần trong \`sum(...)\` là **generator expression**: sinh lần lượt từng giá trị, không dựng list trung gian.
- \`for _, qty, price in self.items\` giải nén từng tuple 3 phần tử.
- \`_\` là quy ước cho "biến tôi không dùng" — ở đây là tên món. Nó là biến bình thường, chỉ là tên
  \`_\` báo cho người đọc rằng giá trị này bị bỏ đi.

**Hàm bên ngoài**

\`\`\`python
def order_summary(carts):
    ket_qua = []
    for cart in carts:
        order = Order()                 # BÊN TRONG vòng lặp -> mỗi giỏ một đơn
        for name, qty, price in cart:
            order.add(name, qty, price)
        ket_qua.append(order.total())
    return ket_qua
\`\`\`

Vị trí dòng \`order = Order()\` chính là ranh giới đúng/sai của cả bài: đặt ngoài vòng lặp thì mọi
giỏ dồn vào một đơn. Nguyên tắc: **tạo đối tượng ở đúng vòng đời của nó**.
`,
    solution: `from dataclasses import dataclass, field


@dataclass
class Order:
    items: list = field(default_factory=list)

    def add(self, name, qty, price):
        self.items.append((name, qty, price))

    def total(self):
        return sum(qty * price for _, qty, price in self.items)


def order_summary(carts):
    ket_qua = []
    for cart in carts:
        order = Order()
        for name, qty, price in cart:
            order.add(name, qty, price)
        ket_qua.append(order.total())
    return ket_qua`,
    complexity: {
      question: 'Với g giỏ và tổng cộng m món hàng, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(g + m) — mỗi giỏ tạo một đối tượng, mỗi món được thêm và cộng một lần',
        'O(g · m) vì mỗi giỏ phải duyệt lại mọi món',
        'O(m²) do append vào list',
        'O(m log m)',
      ],
      answer: 0,
      why: '`append` là O(1) khấu trừ (amortized) và `total()` duyệt đúng số món của giỏ đó. Cộng lại, mỗi món được xử lý một số lần cố định nên tổng chi phí là O(g + m).',
    },
    realWorld: '`@dataclass` là cách chuẩn để mô tả "dữ liệu có hình dạng" trong Python hiện đại: bản ghi cấu hình, DTO trả về từ API, kết quả truy vấn. Bẫy `default_factory` xuất hiện thật ở mọi model có danh sách con (đơn hàng có nhiều dòng, bài viết có nhiều thẻ) — và biểu hiện của nó rất khó tìm: dữ liệu của người dùng này lẫn sang người dùng khác.',
  },
];

/* ==================================================================== */
/* MODULE 5 — py-functional                                              */
/* ==================================================================== */
const PY_FUNCTIONAL = [
  {
    id: 'py-drill-countdown-gen',
    title: 'Generator đầu tiên với yield',
    en: 'Your First Generator',
    difficulty: 'Easy',
    targetMinutes: 8,
    entry: 'countdown',
    lang: 'python',
    harnessSrc: 'lambda f, args, t: list(f(*args))',
    statement: `
Viết **generator** \`countdown(n)\` sinh ra lần lượt \`n, n-1, ..., 1\` rồi dừng.
Nếu \`n\` nhỏ hơn 1 thì không sinh ra gì cả.

**Ví dụ**

\`\`\`python
list(countdown(3))   # [3, 2, 1]
list(countdown(0))   # []

for x in countdown(3):
    print(x)         # 3, rồi 2, rồi 1
\`\`\`

> Dùng \`yield\` thay cho \`return\`. Hàm nào có \`yield\` thì tự động là generator.
`,
    starter: `def countdown(n):\n    # Dung yield de sinh ra n, n-1, ..., 1\n    \n`,
    tests: [
      { args: [3], expected: [3, 2, 1], name: 'Ví dụ cơ bản' },
      { args: [1], expected: [1], name: 'Chỉ một giá trị' },
      { args: [0], expected: [], name: 'Không sinh gì' },
      { args: [-5], expected: [], name: 'Số âm — cũng không sinh gì' },
      { args: [5], expected: [5, 4, 3, 2, 1], name: 'Năm giá trị' },
    ],
    hints: [
      '`yield x` trả giá trị `x` ra ngoài rồi **tạm dừng** hàm tại đó; lần lấy giá trị tiếp theo, hàm chạy tiếp từ chính chỗ đã dừng.',
      'Vẫn dùng vòng lặp như bình thường: `while n > 0:` rồi `yield n` rồi `n -= 1`. Điều kiện `n > 0` cũng tự xử lý luôn trường hợp n nhỏ hơn 1.',
      'Cách khác: `for x in range(n, 0, -1): yield x` — `range` với bước nhảy `-1` đếm ngược. Với `n = 0`, `range(0, 0, -1)` rỗng nên vòng lặp không chạy.',
    ],
    diagnostics: [
      { test: 'return\\s+n\\b', message: '`return` kết thúc hàm và chỉ trả về MỘT giá trị. Generator dùng `yield` để trả nhiều giá trị lần lượt mà không kết thúc hàm.' },
      { test: 'ket_qua\\s*=\\s*\\[\\s*\\][\\s\\S]*append[\\s\\S]*return', message: 'Bạn đang dựng cả danh sách rồi trả về — chạy đúng nhưng đó không phải generator, và với dãy rất dài sẽ tốn hết bộ nhớ. Hãy `yield` từng giá trị.' },
      { test: 'range\\s*\\(\\s*n\\s*,\\s*0\\s*\\)', message: '`range(n, 0)` là dãy rỗng (thiếu bước nhảy âm nên nó đếm tăng từ n tới 0). Đếm ngược phải là `range(n, 0, -1)`.' },
    ],
    approach: `
**\`yield\` biến hàm thành generator**

\`\`\`python
def countdown(n):
    while n > 0:
        yield n      # đưa giá trị ra ngoài, rồi ĐỨNG LẠI ở đây
        n -= 1
\`\`\`

Điểm lạ nhất với người mới: gọi \`countdown(3)\` **không chạy** dòng nào trong thân hàm. Nó trả về
một đối tượng generator — như một "cuộn băng chưa phát":

\`\`\`python
g = countdown(3)
print(g)        # <generator object countdown at 0x...>
next(g)         # 3   ← bây giờ thân hàm mới chạy, tới yield đầu tiên
next(g)         # 2   ← chạy tiếp từ chỗ vừa dừng
next(g)         # 1
next(g)         # StopIteration -> hết
\`\`\`

Vòng \`for\` gọi \`next()\` giúp bạn và bắt \`StopIteration\` để dừng — nên bạn không thấy những
chuyện này. \`list(g)\` thì lấy hết một lượt.

**\`yield\` khác \`return\` thế nào?**

| \`return\` | \`yield\` |
| --- | --- |
| Kết thúc hàm | Tạm dừng hàm, giữ nguyên trạng thái |
| Trả về một giá trị | Trả ra nhiều giá trị, lần lượt |
| Gọi hàm là chạy ngay | Gọi hàm chỉ tạo generator, chưa chạy |

**Vì sao cần generator?** Vì nó **không cần dựng sẵn cả dãy trong bộ nhớ**:

\`\`\`python
sum(countdown(10_000_000))     # bộ nhớ gần như không tăng
sum(list(range(10_000_000)))   # dựng list 10 triệu phần tử trước
\`\`\`

Nhờ đó generator làm được cả những thứ *vô hạn* (dãy Fibonacci không giới hạn, đọc file log đang
ghi liên tục) — miễn là người dùng chỉ lấy phần đầu.

**Cái giá:** generator **chỉ chạy được một lần**. Lấy hết rồi thì lần sau ra rỗng, và không có
\`len()\`, không truy cập được \`g[2]\`. Bài "Generator chỉ đi qua một lần" ngay sau đây sẽ cho bạn
thấy tận mắt.
`,
    solution: `def countdown(n):
    while n > 0:
        yield n
        n -= 1`,
    complexity: {
      question: 'Bộ nhớ mà `for x in countdown(1_000_000)` chiếm là bao nhiêu?',
      options: [
        'O(1) — generator chỉ giữ trạng thái hiện tại, không giữ cả dãy',
        'O(n) vì phải sinh sẵn 1 triệu số',
        'O(log n)',
        'O(n) nhưng được giải phóng dần',
      ],
      answer: 0,
      why: 'Generator chỉ lưu biến `n` và vị trí đang dừng trong thân hàm; mỗi giá trị được sinh ra rồi bỏ đi. Đây là khác biệt cốt lõi so với việc trả về một list — list phải giữ toàn bộ n phần tử cùng lúc.',
    },
    realWorld: 'Đọc file lớn từng dòng (`for line in file` chính là một generator), phân trang kết quả từ API, xử lý luồng dữ liệu (stream) mà không biết trước độ dài. Quy tắc thực tế: nếu bạn chỉ định *duyệt qua* dữ liệu một lần, hãy yield thay vì trả về list.',
  },
  {
    id: 'py-drill-make-multiplier',
    title: 'Hàm sinh ra hàm (closure)',
    en: 'Function Returning a Function',
    difficulty: 'Easy',
    targetMinutes: 9,
    entry: 'make_multiplier',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    k, values = args
    nhan = fn(k)
    doi_lap = fn(100)(2)
    return [[nhan(v) for v in values], doi_lap]`,
    statement: `
Viết hàm \`make_multiplier(k)\` **trả về một hàm khác** — hàm mới này nhân đối số của nó với \`k\`.

**Ví dụ**

\`\`\`python
nhan3 = make_multiplier(3)
nhan3(5)    # 15
nhan3(10)   # 30

nhan10 = make_multiplier(10)
nhan10(5)   # 50   ← nhan3 và nhan10 độc lập với nhau
\`\`\`
`,
    starter: `def make_multiplier(k):\n    # Tra ve MOT HAM nhan doi so voi k\n    \n`,
    tests: [
      { args: [3, [1, 2, 3]], expected: [[3, 6, 9], 200], name: 'Nhân với 3' },
      { args: [0, [5]], expected: [[0], 200], name: 'Nhân với 0' },
      { args: [-2, [1, -1]], expected: [[-2, 2], 200], name: 'Hệ số âm' },
      { args: [10, []], expected: [[], 200], name: 'Không có giá trị nào để nhân' },
      { args: [1, [7]], expected: [[7], 200], name: 'Nhân với 1' },
      { args: [2.5, [4]], expected: [[10.0], 200], name: 'Hệ số là số thực' },
    ],
    hints: [
      'Định nghĩa một hàm lồng bên trong: `def nhan(x): return x * k`. Rồi `return nhan` — **không có dấu ngoặc**, vì ta trả về chính hàm đó chứ không phải kết quả gọi nó.',
      'Hàm bên trong đọc được `k` của hàm bên ngoài dù `make_multiplier` đã kết thúc. Cơ chế "hàm mang theo biến môi trường" đó gọi là *closure*.',
      'Viết siêu ngắn được bằng lambda: `return lambda x: x * k`. `lambda` là hàm không tên, chỉ chứa MỘT biểu thức và tự trả về giá trị của biểu thức đó.',
    ],
    diagnostics: [
      { test: 'return\\s+nhan\\s*\\(', message: 'Có dấu ngoặc là bạn đang GỌI hàm và trả về kết quả. Đề cần trả về chính hàm đó: `return nhan` (không ngoặc).' },
      { test: 'return\\s+x\\s*\\*\\s*k', message: 'Có vẻ bạn trả về kết quả phép nhân ngay trong `make_multiplier`, nhưng `x` chưa tồn tại ở đó. `x` chỉ có ý nghĩa bên trong hàm con — hãy định nghĩa hàm con rồi trả về nó.' },
      { test: 'global\\s+k', message: 'Không cần `global`: hàm con đọc được `k` của hàm cha một cách tự nhiên (closure). `global` là chuyện khác — nó trỏ tới biến ở cấp module.' },
    ],
    approach: `
**Hàm là giá trị, không phải cú pháp đặc biệt**

Trong Python, một hàm cũng chỉ là một *đối tượng* như số hay chuỗi: gán được vào biến, đưa vào
list, truyền vào hàm khác, và **trả về từ một hàm khác**.

\`\`\`python
def make_multiplier(k):
    def nhan(x):
        return x * k      # đọc k của hàm BÊN NGOÀI
    return nhan           # trả về hàm, KHÔNG gọi nó
\`\`\`

Dấu ngoặc là ranh giới sinh tử ở đây:

\`\`\`python
return nhan      # trả về HÀM
return nhan(2)   # trả về SỐ (kết quả gọi hàm)
\`\`\`

**Closure — "bao đóng"**

\`make_multiplier(3)\` kết thúc rồi, biến \`k\` lẽ ra biến mất. Nhưng hàm \`nhan\` vẫn dùng được \`k\`,
vì Python giữ lại môi trường mà hàm con cần. Mỗi lần gọi \`make_multiplier\` tạo ra **một môi trường
riêng**, nên \`nhan3\` và \`nhan10\` không đụng nhau:

\`\`\`python
nhan3 = make_multiplier(3)
nhan10 = make_multiplier(10)
nhan3(5), nhan10(5)     # (15, 50)
\`\`\`

**\`lambda\` — hàm viết trong một dòng**

\`\`\`python
return lambda x: x * k
#      ▲      ▲  ▲
#      |      |  └── biểu thức, giá trị của nó được trả về (không viết return)
#      |      └───── tham số
#      └──────────── từ khoá tạo hàm không tên
\`\`\`

\`lambda\` chỉ chứa **một biểu thức** — không đặt được \`if/else\` nhiều nhánh, không vòng lặp,
không nhiều dòng. Khi cần hơn thế, dùng \`def\`.

**Bẫy kinh điển: closure bắt BIẾN, không bắt giá trị**

\`\`\`python
fns = []
for i in range(3):
    fns.append(lambda x: x + i)
fns[0](0)     # 2 (!) chứ không phải 0 — mọi lambda cùng thấy i sau vòng lặp
\`\`\`

Cách sửa quen dùng là "đóng băng" giá trị qua tham số mặc định: \`lambda x, i=i: x + i\`. Hoặc dùng
đúng một hàm sinh hàm như bài này — mỗi lần gọi là một môi trường mới.
`,
    solution: `def make_multiplier(k):
    def nhan(x):
        return x * k
    return nhan`,
    complexity: {
      question: 'Gọi `make_multiplier(3)` rồi gọi hàm kết quả 1 lần tốn bao nhiêu?',
      options: [
        'O(1) — tạo closure là hằng số, gọi hàm cũng là hằng số',
        'O(n) theo giá trị của k',
        'O(k) vì phải nhân k lần',
        'O(log k)',
      ],
      answer: 0,
      why: 'Tạo closure chỉ là cấp phát một đối tượng hàm giữ tham chiếu tới môi trường — hằng số. Phép nhân số cũng là một lệnh phần cứng. Không có vòng lặp nào phụ thuộc k.',
    },
    realWorld: 'Closure là cách gọn nhất để "cấu hình trước rồi dùng nhiều lần": tạo hàm định dạng theo đơn vị tiền tệ, tạo hàm xác thực theo bộ quy tắc, tạo key function cho `sorted(data, key=make_getter("age"))`. Decorator (bài sau) cũng chỉ là closure có thêm cú pháp `@`.',
  },
  {
    id: 'py-shout-decorator',
    title: 'Viết decorator đầu tiên',
    en: 'Your First Decorator',
    difficulty: 'Medium',
    targetMinutes: 13,
    entry: 'shout',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    def greet(name):
        return f"xin chao {name}"

    def join_words(a, b):
        return a + " " + b

    g = fn(greet)
    j = fn(join_words)
    return [g(args[0]), g.__name__, j(args[0], args[1]), j.__name__]`,
    statement: `
Viết decorator \`shout(fn)\`: hàm được trang trí vẫn làm việc như cũ, nhưng chuỗi kết quả được
đổi thành **CHỮ HOA** và thêm dấu \`!\` ở cuối.

\`\`\`python
@shout
def greet(name):
    return f"xin chao {name}"

greet("an")        # "XIN CHAO AN!"
greet.__name__     # "greet"   ← phải giữ đúng tên hàm gốc
\`\`\`

Yêu cầu:
- Hoạt động với hàm có **số lượng tham số bất kỳ** (\`greet(name)\` hay \`join_words(a, b)\`).
- Giữ nguyên \`__name__\` của hàm gốc.
`,
    starter: `import functools\n\n\ndef shout(fn):\n    # Tra ve mot ham moi: goi fn roi in hoa ket qua + "!"\n    \n`,
    tests: [
      { args: ['an', 'bo'], expected: ['XIN CHAO AN!', 'greet', 'AN BO!', 'join_words'], name: 'Hai hàm khác số tham số' },
      { args: ['Binh', 'Cuong'], expected: ['XIN CHAO BINH!', 'greet', 'BINH CUONG!', 'join_words'], name: 'Chữ đã có hoa sẵn' },
      { args: ['', ''], expected: ['XIN CHAO !', 'greet', ' !', 'join_words'], name: 'Chuỗi rỗng' },
      { args: ['a b', 'c'], expected: ['XIN CHAO A B!', 'greet', 'A B C!', 'join_words'], name: 'Đối số có khoảng trắng' },
      { args: ['x1', 'y2'], expected: ['XIN CHAO X1!', 'greet', 'X1 Y2!', 'join_words'], name: 'Có chữ số — không đổi' },
    ],
    hints: [
      'Decorator là **hàm nhận một hàm và trả về một hàm**. Khung xương: `def shout(fn): def wrapper(...): ... ; return wrapper`.',
      'Để nhận mọi kiểu tham số, khai `def wrapper(*args, **kwargs)` rồi gọi lại `fn(*args, **kwargs)`. Dấu `*`/`**` lúc gọi làm việc ngược lại lúc khai: nó **mở** tuple/dict ra thành các đối số.',
      'Không có `@functools.wraps(fn)` thì `greet.__name__` sẽ ra `"wrapper"` — vì tên `greet` giờ trỏ tới hàm bọc. Đặt `@functools.wraps(fn)` ngay trên `def wrapper`.',
    ],
    diagnostics: [
      { test: 'return\\s+wrapper\\s*\\(', message: '`return wrapper()` là gọi hàm bọc ngay lúc trang trí. Decorator phải trả về chính hàm: `return wrapper` (không ngoặc).' },
      { test: 'def\\s+wrapper\\s*\\(\\s*\\)', message: '`def wrapper()` không nhận được đối số nào nên `greet("an")` sẽ báo lỗi. Dùng `def wrapper(*args, **kwargs)` để chuyển tiếp mọi đối số.' },
      { test: 'def\\s+shout[\\s\\S]*(?!functools\\.wraps)[\\s\\S]*return\\s+wrapper\\s*$', message: 'Nếu chưa có `@functools.wraps(fn)`, `__name__` của hàm sau khi trang trí sẽ là `"wrapper"` — test yêu cầu giữ tên gốc.' },
    ],
    approach: `
**\`@shout\` chỉ là cú pháp đường mật**

Hai đoạn dưới đây **hoàn toàn giống nhau**:

\`\`\`python
@shout
def greet(name): ...

# tương đương
def greet(name): ...
greet = shout(greet)
\`\`\`

Hiểu được dòng \`greet = shout(greet)\` là hiểu xong decorator: tên \`greet\` bị **gán lại** để trỏ
tới hàm mà \`shout\` trả về. Vì vậy \`shout\` bắt buộc phải trả về một *hàm* — trả về gì khác thì
\`greet(...)\` sẽ không gọi được.

**Lời giải**

\`\`\`python
import functools

def shout(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs).upper() + "!"
    return wrapper
\`\`\`

**\`*args, **kwargs\` — hai chiều của dấu sao**

\`\`\`python
def wrapper(*args, **kwargs):   # lúc KHAI: gom đối số lại
    fn(*args, **kwargs)          # lúc GỌI:  mở đối số ra
\`\`\`

Cặp này là "ống dẫn" chuẩn của decorator: nhận bất cứ thứ gì và chuyển tiếp y nguyên, nhờ vậy
\`shout\` dùng được cho hàm 1 tham số, 2 tham số hay có cả tham số tên.

**\`functools.wraps\` chữa bệnh gì?**

Sau khi trang trí, \`greet\` thực chất là \`wrapper\` — nên mất hết "giấy tờ" của hàm gốc:

\`\`\`python
greet.__name__   # "wrapper"    ← không có wraps
greet.__doc__    # None
\`\`\`

Điều này làm hỏng log, hỏng trang tài liệu tự sinh, hỏng cả framework nào dựa vào tên hàm để định
tuyến. \`@functools.wraps(fn)\` copy \`__name__\`, \`__doc__\`, \`__module__\`... từ \`fn\` sang \`wrapper\`.
Quy tắc: **viết decorator là viết \`wraps\`** — không có ngoại lệ đáng để nhớ.

**Thứ tự khi xếp chồng nhiều decorator**

\`\`\`python
@a
@b
def f(): ...      # f = a(b(f))  -> b áp dụng TRƯỚC (gần hàm hơn)
\`\`\`

Đọc từ dưới lên khi hỏi "cái nào bọc trước", đọc từ trên xuống khi hỏi "lời gọi đi qua cái nào
đầu tiên".
`,
    solution: `import functools


def shout(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs).upper() + "!"
    return wrapper`,
    complexity: {
      question: 'Decorator này thêm bao nhiêu chi phí cho mỗi lời gọi hàm?',
      options: [
        'O(k) với k là độ dài chuỗi kết quả — do phải tạo chuỗi in hoa mới',
        'O(1) vì chỉ thêm một lời gọi hàm',
        'O(n) với n là số lần hàm được gọi',
        'Không thêm chi phí nào vì decorator chỉ chạy lúc định nghĩa',
      ],
      answer: 0,
      why: 'Phần "một lời gọi hàm lồng thêm" là O(1), nhưng `.upper()` phải tạo chuỗi MỚI dài bằng chuỗi cũ nên chi phí tỉ lệ độ dài kết quả. Lưu ý phần thân decorator (`shout(greet)`) thật sự chỉ chạy một lần lúc định nghĩa — nhưng `wrapper` thì chạy mỗi lời gọi.',
    },
    realWorld: 'Decorator là cách Python "gắn thêm việc" mà không sửa hàm gốc: `@app.route` của Flask, `@pytest.fixture`, `@functools.lru_cache`, log thời gian chạy, kiểm tra quyền, thử lại khi lỗi mạng. Tất cả đều là cùng một khung xương bạn vừa viết.',
  },
  {
    id: 'py-gen-consumed-once',
    title: 'Generator chỉ đi qua một lần',
    en: 'Generators Are Consumed Once',
    difficulty: 'Medium',
    targetMinutes: 14,
    entry: 'even_numbers',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    g = fn(args[0])
    lan_1 = list(g)
    lan_2 = list(g)
    moi = list(fn(args[0]))
    return [lan_1, lan_2, moi]`,
    statement: `
Viết generator \`even_numbers(n)\` sinh ra các số **chẵn** từ \`0\` tới \`n\` (bao gồm \`n\` nếu \`n\` chẵn).

Bài chấm bằng ba lần đọc, để bạn thấy đúng bản chất generator:

\`\`\`python
g = even_numbers(6)
list(g)                 # [0, 2, 4, 6]   lần đọc thứ nhất
list(g)                 # []             lần đọc thứ hai — ĐÃ HẾT
list(even_numbers(6))   # [0, 2, 4, 6]   generator MỚI thì lại đủ
\`\`\`

Kết quả cần trả về là \`[lần_1, lần_2, generator_mới]\`.
`,
    starter: `def even_numbers(n):\n    # Sinh cac so chan tu 0 toi n\n    \n`,
    tests: [
      { args: [6], expected: [[0, 2, 4, 6], [], [0, 2, 4, 6]], name: 'n chẵn' },
      { args: [7], expected: [[0, 2, 4, 6], [], [0, 2, 4, 6]], name: 'n lẻ — không lấy 7' },
      { args: [0], expected: [[0], [], [0]], name: 'Chỉ có số 0' },
      { args: [1], expected: [[0], [], [0]], name: 'n = 1' },
      { args: [-1], expected: [[], [], []], name: 'n âm — rỗng ngay từ đầu' },
      { args: [10], expected: [[0, 2, 4, 6, 8, 10], [], [0, 2, 4, 6, 8, 10]], name: 'Dãy dài hơn' },
    ],
    hints: [
      '`range(bắt_đầu, kết_thúc, bước)` — muốn số chẵn thì bước nhảy là 2: `range(0, n + 1, 2)`. Nhớ `n + 1` vì `range` không lấy giá trị cuối.',
      'Thân hàm chỉ cần `for x in range(0, n + 1, 2): yield x`. Với `n = -1`, `range(0, 0, 2)` rỗng nên không sinh gì — không cần `if` riêng.',
      'Bạn không phải làm gì để "lần đọc thứ hai ra rỗng" — đó là bản chất của generator. Chỉ cần viết đúng generator là ba kết quả sẽ khớp.',
    ],
    diagnostics: [
      { test: 'range\\s*\\(\\s*0\\s*,\\s*n\\s*,\\s*2\\s*\\)', message: '`range(0, n, 2)` bỏ mất chính số `n` khi n chẵn (vì `range` không lấy giá trị cuối). Cần `range(0, n + 1, 2)`.' },
      { test: 'if\\s+x\\s*%\\s*2\\s*==\\s*0', message: 'Lọc từng số bằng `% 2` thì chạy đúng nhưng phải xét cả n số. `range(0, n + 1, 2)` nhảy thẳng qua số chẵn — một nửa số vòng lặp.' },
      { test: 'return\\s*\\[', message: 'Trả về list thì hàm không còn là generator: lần đọc thứ hai vẫn đủ phần tử và test sẽ báo sai. Phải dùng `yield`.' },
    ],
    approach: `
**Lời giải rất ngắn, nhưng bài học nằm ở hành vi**

\`\`\`python
def even_numbers(n):
    for x in range(0, n + 1, 2):
        yield x
\`\`\`

**Vì sao lần đọc thứ hai ra rỗng?**

Generator là một **iterator**: nó có con trỏ "đang ở đâu" và con trỏ đó chỉ đi một chiều. Khi
\`list(g)\` chạy hết, thân hàm đã kết thúc, generator ở trạng thái *exhausted* (đã cạn). Mọi lần
đọc sau chỉ nhận \`StopIteration\` ngay lập tức → \`list(g)\` ra \`[]\`, và \`for\` không chạy vòng nào.

Không có cách "quay lại từ đầu": không có \`g.reset()\`. Muốn đọc lại thì **tạo generator mới** —
gọi lại \`even_numbers(6)\`.

**Đây là nguồn của một loại bug rất hay gặp**

\`\`\`python
g = (x for x in [1, 2, 3])
print(sum(g))    # 6
print(sum(g))    # 0  (!)

so_chan = (x for x in nums if x % 2 == 0)
if any(so_chan):            # đã ăn mất vài phần tử đầu
    print(list(so_chan))    # thiếu phần tử
\`\`\`

Nguy hiểm ở chỗ nó **không báo lỗi** — chỉ âm thầm ra kết quả rỗng hoặc thiếu. Dấu hiệu để nghi
ngờ: một biến "dãy" được dùng ở **hai** chỗ trở lên.

**Cách xử lý trong code thật**

- Chỉ cần duyệt một lần → dùng generator, đúng thế mạnh của nó.
- Cần duyệt nhiều lần → \`items = list(gen)\` một lần rồi dùng \`items\`.
- Cần duyệt nhiều lần mà dữ liệu quá lớn để giữ hết → viết một **hàm** trả generator và gọi lại
  mỗi khi cần (\`for x in doc_lai()\`), hoặc dùng class có \`__iter__\` trả generator mới mỗi lượt.

**\`iter()\` và \`next()\` — nền của vòng \`for\`**

\`for x in dãy\` thực chất là: gọi \`iter(dãy)\` để lấy iterator, rồi gọi \`next()\` liên tục tới khi
gặp \`StopIteration\`. Điều thú vị: \`iter(list)\` mỗi lần trả về iterator **mới** (nên list duyệt
lại được bao nhiêu lần cũng xong), còn \`iter(generator)\` trả về **chính nó** — đó chính là lý do
generator không thể duyệt lại.
`,
    solution: `def even_numbers(n):
    for x in range(0, n + 1, 2):
        yield x`,
    complexity: {
      question: 'Sinh hết dãy tốn thời gian và bộ nhớ bao nhiêu (n là giá trị đầu vào)?',
      options: [
        'Thời gian O(n), bộ nhớ O(1) — sinh từng số, không giữ dãy',
        'Thời gian O(n), bộ nhớ O(n)',
        'Thời gian O(1) vì generator "lười"',
        'Thời gian O(n/2) nên khác O(n)',
      ],
      answer: 0,
      why: 'Có khoảng n/2 lần yield → thời gian tỉ lệ n (hằng số 1/2 bị bỏ khi tính big-O). Bộ nhớ chỉ gồm biến đếm và trạng thái hàm, không phụ thuộc n — đó là lợi thế lớn nhất của generator so với list.',
    },
    realWorld: 'Bug "generator đã cạn" xuất hiện nhiều nhất khi xử lý dữ liệu lớn: đọc file rồi vừa muốn đếm dòng vừa muốn in ra, gọi API phân trang rồi kiểm tra rỗng trước khi dùng, dùng `map()`/`filter()` (đều trả iterator trong Python 3) ở hai chỗ. Hãy tập phản xạ: dùng dãy hai lần thì `list()` nó lại trước.',
  },
];

export const DRILLS_1_5 = {
  'py-basics': PY_BASICS,
  'py-control-flow': PY_CONTROL_FLOW,
  'py-data-structures': PY_DATA_STRUCTURES,
  'py-oop': PY_OOP,
  'py-functional': PY_FUNCTIONAL,
};
