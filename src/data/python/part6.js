/**
 * LỘ TRÌNH PYTHON — MODULE 6: Chuỗi & Regex nâng cao
 */

export default [
/* ==================================================================== */
{
  id: 'py-strings-regex',
  name: 'Chuỗi & Regex nâng cao',
  en: 'Advanced Strings & Regex',
  icon: '🔤',
  summary: 'Khi nào một phương thức chuỗi (`str.split`, `str.replace`...) là đủ, và khi nào bạn thực sự cần `re` — cùng những bẫy regex khiến code chạy đúng lúc test nhưng sai lúc gặp input thật.',
  lesson: `
## 1. Vấn đề gốc

Người mới học thường rơi vào một trong hai thái cực: **dùng regex cho mọi thứ** (kể cả việc \`"a,b,c".split(",")\`
làm được ngay lập tức, không cần regex) hoặc **né regex hoàn toàn** rồi viết vòng lặp thủ công phức tạp hơn
nhiều so với một pattern 1 dòng. Vấn đề gốc của module này là xây **trực giác chọn công cụ đúng**:

- Nếu bạn tách/nối/thay thế theo **một chuỗi cố định**, dùng phương thức chuỗi (\`split\`, \`join\`, \`replace\`,
  \`strip\`) — nhanh hơn, dễ đọc hơn, không cần import gì.
- Nếu bạn cần khớp theo **một khuôn mẫu** (một hoặc nhiều chữ số, một hoặc không có ký tự nào đó, "bất kỳ chuỗi
  nào giữa hai dấu ngoặc"...), đó là lúc cần \`re\`.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript | Python |
|---|---|---|
| Tìm 1 khớp đầu tiên | \`str.match(/re/)\` | \`re.search(pattern, s)\` |
| Khớp phải từ đầu chuỗi | \`/^re/.test(s)\` | \`re.match(pattern, s)\` (chỉ neo đầu, KHÔNG neo cuối) |
| Khớp toàn bộ chuỗi | \`/^re$/.test(s)\` | \`re.fullmatch(pattern, s)\` |
| Tìm mọi khớp | \`str.match(/re/g)\` | \`re.findall(pattern, s)\` |
| Thay thế | \`str.replace(/re/g, x)\` | \`re.sub(pattern, x, s)\` |
| Nhóm bắt (capture group) | \`(?<name>...)\`, truy cập qua \`match.groups.name\` | \`(?P<name>...)\`, truy cập qua \`m.group("name")\` hoặc \`m.groupdict()\` |
| Biên dịch trước để tái sử dụng | động cơ JS tự cache | \`re.compile(pattern)\` tường minh nếu dùng pattern nhiều lần trong vòng lặp |

## 3. Ý tưởng cốt lõi: raw string, greedy vs lazy, anchor

**(a) Raw string \`r"..."\` gần như bắt buộc khi viết regex.** Chuỗi Python thường (\`"\\\\d"\`) và regex string
đụng độ ký tự \`\\\\\`: cả Python lẫn regex đều dùng \`\\\\\` làm ký tự thoát, nên nếu không dùng \`r"..."\`, bạn phải
gõ \`"\\\\\\\\d"\` (thoát 2 lần) để regex nhận đúng \`\\d\`. Raw string tắt cơ chế thoát của Python, để nguyên
\`\\d\` cho \`re\` tự diễn giải — luôn dùng \`r"pattern"\`, không có ngoại lệ.

**(b) Greedy (\`*\`, \`+\`) mặc định tham lam — khớp DÀI NHẤT có thể**, rồi mới lùi lại (backtrack) nếu phần
sau không khớp. Thêm \`?\` sau chúng (\`*?\`, \`+?\`) để chuyển sang **lazy — khớp NGẮN NHẤT có thể**. Đây là
bẫy kinh điển khi parse chuỗi có nhiều cặp dấu ngoặc/thẻ giống nhau.

**(c) Anchor quyết định "khớp ở đâu"**: \`^\`/\`$\` neo đầu/cuối chuỗi (hoặc đầu/cuối dòng nếu có cờ
\`re.MULTILINE\`). \`re.match\` **ngầm neo đầu** nhưng KHÔNG neo cuối — nó trả về khớp ngay khi tìm được ở vị
trí 0, dù phần còn lại của chuỗi có gì cũng mặc kệ. Muốn chắc chắn toàn bộ chuỗi khớp đúng khuôn mẫu, luôn
dùng \`re.fullmatch\`, không phải \`re.match\`.

## 4. Dấu hiệu nhận biết

| Thấy trong đề bài | Nghĩ tới |
|---|---|
| "tách theo dấu phẩy/khoảng trắng cố định" | \`str.split(",")\` — không cần regex |
| "một hoặc nhiều chữ số/khoảng trắng liên tiếp" | regex với \`\\d+\`, \`\\s+\` |
| "toàn bộ chuỗi phải đúng định dạng (username, mã bưu điện...)" | \`re.fullmatch\` |
| "trích xuất nhiều phần có tên rõ ràng từ 1 dòng log/địa chỉ" | named group \`(?P<ten>...)\` + \`m.groupdict()\` |
| "thay thế mọi thứ không phải chữ/số bằng dấu gạch ngang" | \`re.sub(r"[^a-z0-9]+", "-", s)\` |
| dùng cùng 1 pattern hàng nghìn lần trong vòng lặp lớn | \`re.compile(pattern)\` một lần bên ngoài vòng lặp |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
import re

# (a) Tìm tất cả khớp
re.findall(r"\\d+", "có 12 con mèo và 7 con chó")     # ['12', '7']

# (b) Named group + groupdict
m = re.fullmatch(r"(?P<ten>\\w+)@(?P<domain>[\\w.]+)", "an@example.com")
m.groupdict()   # {'ten': 'an', 'domain': 'example.com'}

# (c) Thay thế bằng hàm (không chỉ chuỗi cố định)
re.sub(r"\\d+", lambda m: str(int(m.group()) * 2), "a1 b22")   # "a2 b44"

# (d) match vs fullmatch vs search — khác nhau ở ĐÂU được phép khớp
re.match(r"\\d+", "123abc")       # khớp "123" — chỉ cần khớp từ đầu, phần đuôi kệ nó
re.fullmatch(r"\\d+", "123abc")   # None — "abc" ở cuối phá vỡ yêu cầu khớp TOÀN BỘ
re.search(r"\\d+", "abc123xyz")  # khớp "123" — tìm ở BẤT KỲ đâu trong chuỗi

# (e) Biên dịch trước khi dùng lặp lại nhiều lần
PATTERN = re.compile(r"\\bpython\\b", re.IGNORECASE)
PATTERN.findall("Python và python và PYTHON")   # ['Python', 'python', 'PYTHON']
\`\`\`

## 6. Bẫy thường gặp

- **Quên raw string**: viết \`"\\d+"\` thay vì \`r"\\d+"\` vô tình vẫn chạy đúng trong nhiều trường hợp (vì
  \`\\d\` không phải escape sequence hợp lệ của Python nên Python giữ nguyên) nhưng với \`\\n\`, \`\\t\`, \`\\b\`
  (đều LÀ escape hợp lệ của Python) thì chuỗi sẽ bị Python diễn giải sai trước khi tới \`re\` — luôn dùng
  \`r"..."\` cho chắc chắn, không phụ thuộc vào việc "may mắn không trùng escape sequence".
- **Dùng \`re.match\` khi cần \`re.fullmatch\`**: \`re.match(r"\\d+", "123abc")\` trả về khớp (vì chỉ neo đầu),
  khiến bạn tưởng "123abc" là một số hợp lệ — sai. Validate toàn bộ chuỗi luôn cần \`fullmatch\`.
- **\`.\` không khớp ký tự xuống dòng \`\\n\`** theo mặc định — nếu input có thể nhiều dòng và bạn cần \`.\`
  khớp cả \`\\n\`, phải bật cờ \`re.DOTALL\`.
- **Quên rằng \`re.findall\` với nhiều group trả về TUPLE, không phải chuỗi đầy đủ**: nếu pattern có từ 2
  group trở lên, mỗi phần tử kết quả là tuple các group đó (không phải toàn bộ khớp) — dễ gây bug im lặng.

## 7. Ứng dụng thực tế

- **Parse log server**: trích ngày giờ, mức độ (ERROR/INFO/WARNING), nội dung từ mỗi dòng log để đưa vào
  hệ thống giám sát — named group giúp code đọc lại sau này không cần đếm group theo số thứ tự.
- **Tạo URL slug từ tiêu đề bài viết**: \`re.sub\` gộp nhiều bước "lowercase, bỏ ký tự đặc biệt, thay khoảng
  trắng bằng gạch ngang" thành 1-2 dòng, dùng trong mọi CMS/blog.
- **Validate input người dùng** (username, mã sản phẩm, số điện thoại): \`fullmatch\` đảm bảo không có ký tự
  thừa lọt qua — một lỗ hổng bảo mật kinh điển là validate bằng \`search\`/\`match\` tưởng chặt nhưng thực ra
  chỉ kiểm tra một phần chuỗi, kẻ tấn công chèn thêm nội dung độc hại ở phần không bị kiểm tra.
`,
  quiz: [
    {
      q: '`re.match(r"\\d+", "123abc")` và `re.fullmatch(r"\\d+", "123abc")` khác nhau ở điểm nào?',
      options: [
        'Không khác gì nhau, cả hai đều trả về None',
        '`match` khớp "123" vì chỉ neo đầu chuỗi; `fullmatch` trả về None vì phần "abc" ở cuối phá vỡ yêu cầu khớp TOÀN BỘ chuỗi',
        '`fullmatch` nhanh hơn `match` nhưng kết quả giống hệt nhau',
        '`match` chỉ dùng được với chuỗi 1 dòng, `fullmatch` dùng được với nhiều dòng',
      ],
      answer: 1,
      why: '`re.match` chỉ yêu cầu khớp bắt đầu từ vị trí 0, không quan tâm phần còn lại của chuỗi. `re.fullmatch` yêu cầu TOÀN BỘ chuỗi phải khớp pattern — đây là hàm đúng để validate input.',
    },
    {
      q: 'Vì sao nên viết regex bằng raw string `r"..."` thay vì chuỗi thường?',
      options: [
        'Vì `re` module chỉ chấp nhận raw string, chuỗi thường sẽ báo lỗi cú pháp ngay lập tức',
        'Vì cả Python và regex đều dùng `\\\\` làm ký tự thoát — raw string tắt cơ chế thoát của Python để `\\d`, `\\n`, `\\b`... được giữ nguyên cho `re` tự diễn giải, tránh xung đột escape sequence',
        'Raw string giúp regex chạy nhanh hơn về mặt hiệu năng',
        'Không có lý do kỹ thuật, chỉ là quy ước cho đẹp code',
      ],
      answer: 1,
      why: 'Nếu không dùng raw string, một số escape sequence như `\\n`, `\\t`, `\\b` sẽ bị Python diễn giải TRƯỚC khi `re` nhìn thấy chuỗi, dẫn tới pattern bị sai lệch âm thầm — đặc biệt nguy hiểm vì lỗi này không phải lúc nào cũng gây crash ngay.',
    },
    {
      q: 'Trong regex, `*` và `+` mặc định là "greedy" (tham lam). Thêm dấu `?` ngay sau chúng (`*?`, `+?`) có tác dụng gì?',
      options: [
        'Làm cho phần đó trở thành tuỳ chọn (0 hoặc 1 lần)',
        'Chuyển từ greedy (khớp dài nhất có thể) sang lazy/non-greedy (khớp ngắn nhất có thể)',
        'Không có tác dụng gì, `?` chỉ áp dụng được cho ký tự đơn',
        'Báo lỗi cú pháp vì không thể đặt `?` sau `*` hoặc `+`',
      ],
      answer: 1,
      why: '`.*` sẽ cố khớp càng nhiều ký tự càng tốt rồi lùi lại nếu cần; `.*?` cố khớp càng ÍT càng tốt. Đây là bẫy kinh điển khi parse chuỗi có nhiều cặp ký tự giống nhau, ví dụ nhiều cặp thẻ HTML trên cùng một dòng.',
    },
    {
      q: '`re.findall(r"(\\w+)=(\\d+)", "a=1 b=2")` trả về kết quả nào?',
      options: [
        '`["a=1", "b=2"]`',
        '`[("a", "1"), ("b", "2")]` — mỗi khớp có từ 2 group trở lên nên trả về tuple các group, không phải chuỗi khớp đầy đủ',
        '`["a", "1", "b", "2"]`',
        'Lỗi vì pattern có nhiều hơn 1 group',
      ],
      answer: 1,
      why: 'Khi pattern có từ 2 capture group trở lên, `re.findall` trả về list các TUPLE (mỗi tuple là các group của một khớp), không trả về toàn bộ chuỗi khớp — đây là hành vi hay gây bất ngờ nếu không nhớ quy tắc này.',
    },
    {
      q: 'Khi nào nên dùng `str.split(",")` thay vì viết regex `re.split(r",", s)`?',
      options: [
        'Luôn luôn nên dùng regex vì regex mạnh hơn và linh hoạt hơn',
        'Khi dấu phân tách là một chuỗi CỐ ĐỊNH (không phải khuôn mẫu) — `str.split` đơn giản, nhanh, không cần import `re`, và không có nguy cơ ký tự đặc biệt của regex (như `.`, `|`) bị hiểu nhầm',
        '`str.split` không tồn tại trong Python, chỉ có `re.split`',
        'Không có khác biệt nào, chọn cái nào cũng được về mặt hiệu năng và độ an toàn',
      ],
      answer: 1,
      why: 'Quy tắc chọn công cụ: dấu phân tách CỐ ĐỊNH → phương thức chuỗi; dấu phân tách là KHUÔN MẪU (ví dụ "một hoặc nhiều khoảng trắng liên tiếp") → mới cần `re.split`. Dùng regex cho việc đơn giản làm code khó đọc hơn và chậm hơn không cần thiết.',
    },
  ],
  problems: [
    {
      id: 'py-extract-emails',
      title: 'Trích xuất địa chỉ email',
      en: 'Extract Emails',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'extract_emails',
      lang: 'python',
      statement: `
Viết hàm \`extract_emails(text)\` trả về **list các email** xuất hiện trong \`text\`, theo đúng thứ tự xuất hiện.

Quy ước "email hợp lệ" cho bài này: một chuỗi liên tục dạng \`phần_trước@phần_sau\`, trong đó:
- Phần trước gồm 1 hoặc nhiều ký tự chữ/số/\`.\`/\`+\`/\`-\`/\`_\`
- Phần sau (domain) gồm ít nhất **hai đoạn** ngăn cách bởi dấu chấm, mỗi đoạn chỉ gồm chữ/số/\`-\`
  (đoạn cuối domain **không được** kết thúc bằng dấu chấm "thừa" ở cuối câu)

**Ví dụ**
- \`extract_emails("Liên hệ an@example.com hoặc chi.tiet99@sub.domain.co")\` → \`["an@example.com", "chi.tiet99@sub.domain.co"]\`
- \`extract_emails("test@abc.com.")\` → \`["test@abc.com"]\` (dấu chấm cuối câu KHÔNG thuộc email)
- \`extract_emails("không có email nào ở đây")\` → \`[]\`
`,
      starter: `import re\n\ndef extract_emails(text):\n    # Tra ve list email tim thay trong text, dung thu tu xuat hien\n    \n`,
      tests: [
        { args: ['Liên hệ an@example.com hoặc chi.tiet99@sub.domain.co'], expected: ['an@example.com', 'chi.tiet99@sub.domain.co'], name: 'Hai email cơ bản' },
        { args: ['không có email nào ở đây'], expected: [], name: 'Không có email' },
        { args: ['test@abc.com.'], expected: ['test@abc.com'], name: 'Không lấy dấu chấm cuối câu' },
        { args: ['hai@vi.du, x.y+z@sub.b.co!'], expected: ['hai@vi.du', 'x.y+z@sub.b.co'], name: 'Ký tự +, dấu phẩy/chấm than xung quanh' },
        { args: ['không hợp lệ: @abc.com và abc@.com'], expected: [], name: 'Thiếu phần trước hoặc phần sau @' },
        { args: ['duy nhất mộtmail@here.io ở giữa câu.'], expected: ['mộtmail@here.io'], name: 'Email nằm giữa câu có dấu tiếng Việt xung quanh' },
      ],
      hints: [
        'Pattern tổng quát: `phần_trước @ phần_sau`. Phần trước dùng lớp ký tự `[\\w.+-]+` (một hoặc nhiều). Đừng quên `r"..."` (raw string).',
        'Phần sau (domain) cần ÍT NHẤT một dấu chấm ở giữa, và không được kết thúc bằng dấu chấm. Thử: `[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+` — nhóm không bắt `(?:...)` lặp lại "chấm + đoạn ký tự", đảm bảo luôn kết thúc bằng một đoạn ký tự, không phải dấu chấm.',
        'Ghép hai phần bằng `@` ở giữa, dùng `re.findall(pattern, text)` để lấy tất cả khớp theo đúng thứ tự xuất hiện.',
      ],
      diagnostics: [
        { test: '\\.\\*|\\.\\+', message: 'Regex đang dùng `.` (khớp MỌI ký tự) thay vì lớp ký tự cụ thể như `[\\w.-]` hoặc `[A-Za-z0-9-]` — email thật không chứa khoảng trắng/dấu phẩy nên đừng dùng `.` quá rộng, sẽ "ăn" cả những ký tự không thuộc email.' },
      ],
      approach: `
Bài này luyện đúng kỹ năng cốt lõi: **thiết kế char class đủ chặt** để không "ăn lấn" sang phần không phải
email (dấu phẩy, chấm than, dấu chấm cuối câu).

**Điểm mấu chốt**: domain không thể dùng \`[\\w.-]+\` đơn giản (sẽ cho phép kết thúc bằng dấu chấm, "ăn" luôn
dấu chấm cuối câu vào email). Thay vào đó, buộc domain phải kết thúc bằng một **đoạn ký tự** (không phải dấu
chấm) bằng cách lặp lại cụm "chấm + đoạn ký tự" như một khối:

\`\`\`python
import re

EMAIL_RE = re.compile(r"[\\w.+-]+@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+")

def extract_emails(text):
    return EMAIL_RE.findall(text)
\`\`\`

\`(?:...)\` là **non-capturing group** — nhóm các ký tự lại để áp dụng lượng từ \`+\` cho cả cụm, nhưng
không tạo ra một "group" riêng trong kết quả (nếu dùng \`(...)\` thường, \`findall\` sẽ trả về list các phần
group thay vì toàn bộ khớp — đây chính là bẫy đã học ở phần lý thuyết).
`,
      solution: `import re

EMAIL_RE = re.compile(r"[\\w.+-]+@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+")

def extract_emails(text):
    return EMAIL_RE.findall(text)`,
      complexity: {
        question: 'Độ phức tạp thời gian của `extract_emails` theo độ dài n của text (giả sử không có trường hợp regex "catastrophic backtracking")?',
        options: ['O(1)', 'O(n) — regex engine quét qua text một lượt, mỗi ký tự được xét một số lần giới hạn', 'O(n²) luôn luôn bất kể pattern', 'O(2^n)'],
        answer: 1,
        why: 'Với pattern không có backtracking bùng nổ (các lớp ký tự ở đây tách bạch rõ ràng, không mơ hồ chồng lấn), regex engine của Python chạy gần tuyến tính theo độ dài chuỗi đầu vào.',
      },
      realWorld: 'Trích xuất địa chỉ liên hệ từ email/tài liệu quét OCR, kiểm duyệt nội dung tự động phát hiện thông tin cá nhân (PII) trước khi lưu log, xây dựng công cụ crawl thu thập contact từ trang web.',
    },
    {
      id: 'py-slugify',
      title: 'Chuyển tiêu đề thành URL slug',
      en: 'Slugify Title',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'slugify',
      lang: 'python',
      statement: `
Viết hàm \`slugify(title)\` chuyển một tiêu đề thành **URL slug**: chữ thường, các ký tự không phải chữ/số
được thay bằng dấu gạch ngang \`-\`, gộp nhiều gạch ngang liên tiếp thành một, và bỏ gạch ngang thừa ở đầu/cuối.

**Ví dụ**
- \`slugify("Hello, World! 2024")\` → \`"hello-world-2024"\`
- \`slugify("   Multiple   Spaces   ")\` → \`"multiple-spaces"\`
- \`slugify("---trim---hyphens---")\` → \`"trim-hyphens"\`

> Bài này chỉ xử lý ký tự ASCII (a-z, 0-9) — không cần lo việc chuẩn hoá ký tự có dấu.
`,
      starter: `import re\n\ndef slugify(title):\n    # Tra ve slug: chu thuong, khong-phai-chu-so -> '-', gon gang dau/cuoi\n    \n`,
      tests: [
        { args: ['Hello, World! 2024'], expected: 'hello-world-2024', name: 'Ví dụ cơ bản' },
        { args: ['   Multiple   Spaces   '], expected: 'multiple-spaces', name: 'Nhiều khoảng trắng liên tiếp + đầu/cuối' },
        { args: ['Already-slugged-title'], expected: 'already-slugged-title', name: 'Đã là slug sẵn' },
        { args: ['C++ & Python: Best Friends?'], expected: 'c-python-best-friends', name: 'Nhiều ký tự đặc biệt liên tiếp' },
        { args: ['2024 Recap: Year in Review'], expected: '2024-recap-year-in-review', name: 'Số ở đầu' },
        { args: ['---trim---hyphens---'], expected: 'trim-hyphens', name: 'Gạch ngang thừa đầu/cuối' },
      ],
      hints: [
        'Bước 1: hạ toàn bộ chuỗi về chữ thường bằng `.lower()`.',
        'Bước 2: dùng `re.sub(r"[^a-z0-9]+", "-", s)` để thay MỌI CỤM ký tự không phải chữ thường/số bằng một dấu gạch ngang duy nhất (dấu `+` trong regex đảm bảo nhiều ký tự đặc biệt liên tiếp chỉ tạo ra MỘT dấu `-`, không phải nhiều dấu `-` liền nhau).',
        'Bước 3: dùng `.strip("-")` để bỏ dấu gạch ngang thừa ở đầu/cuối chuỗi kết quả (sinh ra khi tiêu đề gốc có khoảng trắng/ký tự đặc biệt ở đầu hoặc cuối).',
      ],
      diagnostics: [
        { test: 'replace\\s*\\(\\s*[\'"]\\s+', message: 'Dùng chuỗi `.replace(" ", "-")` chỉ xử lý ĐÚNG một khoảng trắng — sẽ để lại nhiều dấu gạch ngang liên tiếp khi có nhiều khoảng trắng hoặc ký tự đặc biệt khác. Hãy dùng `re.sub` với lượng từ `+` để gộp một lượt.' },
      ],
      approach: `
Bài này là ví dụ kinh điển cho việc **regex thay thế theo khuôn mẫu, không phải chuỗi cố định** — không thể
dùng \`str.replace\` vì "ký tự cần thay" không phải một chuỗi cố định mà là "bất kỳ ký tự nào không phải chữ
thường/số".

\`\`\`python
import re

def slugify(title):
    s = title.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")
\`\`\`

**Vì sao \`[^a-z0-9]+\` (có dấu \`+\`) chứ không phải \`[^a-z0-9]\` (không có \`+\`)?** Nếu bỏ \`+\`, mỗi ký tự
đặc biệt sẽ được thay bằng một dấu \`-\` RIÊNG LẺ — chuỗi \`"C++  &  Python"\` (nhiều ký tự đặc biệt liên
tiếp) sẽ ra \`"c-----python"\` (5 gạch ngang) thay vì \`"c-python"\` (1 gạch ngang). Dấu \`+\` gộp toàn bộ CỤM
ký tự đặc biệt liên tiếp thành một lần thay thế duy nhất — nguyên tắc chung: khi thay thế một "vùng" ký tự,
luôn nghĩ tới lượng từ \`+\`/\`*\` thay vì thay từng ký tự một.
`,
      solution: `import re

def slugify(title):
    s = title.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")`,
      complexity: {
        question: 'Độ phức tạp thời gian của `slugify` theo độ dài n của title?',
        options: ['O(1)', 'O(n) — mỗi bước (lower, sub, strip) đều duyệt tuyến tính qua chuỗi', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: '`.lower()`, `re.sub`, và `.strip()` đều là các phép quét một lượt qua chuỗi, mỗi phép tốn O(n), tổng vẫn là O(n) (hằng số 3 không ảnh hưởng bậc độ phức tạp).',
      },
      realWorld: 'Tạo đường dẫn URL thân thiện với SEO cho bài viết blog/CMS (`/bai-viet/hello-world-2024` thay vì ID số khó nhớ), tạo tên file an toàn từ tiêu đề do người dùng nhập.',
    },
    {
      id: 'py-parse-log-line',
      title: 'Phân tích dòng log',
      en: 'Parse Log Line',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'parse_log_line',
      lang: 'python',
      statement: `
Viết hàm \`parse_log_line(line)\` phân tích một dòng log theo định dạng:

\`\`\`
2024-03-15 08:42:07 [ERROR] Kết nối database thất bại
\`\`\`

Trả về **dict** với 4 khoá: \`"date"\`, \`"time"\`, \`"level"\`, \`"message"\`. Nếu dòng **không đúng định dạng**,
trả về \`None\`.

**Ví dụ**
- \`parse_log_line("2024-03-15 08:42:07 [ERROR] Kết nối database thất bại")\`
  → \`{"date": "2024-03-15", "time": "08:42:07", "level": "ERROR", "message": "Kết nối database thất bại"}\`
- \`parse_log_line("dòng không đúng định dạng")\` → \`None\`
`,
      starter: `import re\n\ndef parse_log_line(line):\n    # Tra ve dict {date, time, level, message} hoac None neu khong khop dinh dang\n    \n`,
      tests: [
        {
          args: ['2024-03-15 08:42:07 [ERROR] Kết nối database thất bại'],
          expected: { date: '2024-03-15', time: '08:42:07', level: 'ERROR', message: 'Kết nối database thất bại' },
          name: 'Dòng log ERROR cơ bản',
        },
        {
          args: ['2024-01-01 00:00:00 [INFO] Khởi động hệ thống'],
          expected: { date: '2024-01-01', time: '00:00:00', level: 'INFO', message: 'Khởi động hệ thống' },
          name: 'Dòng log INFO, mốc thời gian 0',
        },
        { args: ['dòng không đúng định dạng'], expected: null, name: 'Không đúng định dạng -> None' },
        {
          args: ['2024-12-31 23:59:59 [WARNING] Dung lượng đĩa còn 5%'],
          expected: { date: '2024-12-31', time: '23:59:59', level: 'WARNING', message: 'Dung lượng đĩa còn 5%' },
          name: 'Message chứa ký tự đặc biệt %',
        },
        { args: ['2024-03-15 [ERROR] Thiếu giờ'], expected: null, name: 'Thiếu phần giờ:phút:giây -> None' },
      ],
      hints: [
        'Định nghĩa 4 named group: `(?P<date>\\d{4}-\\d{2}-\\d{2})`, `(?P<time>\\d{2}:\\d{2}:\\d{2})`, `(?P<level>\\w+)` (nằm trong dấu ngoặc vuông `[ ]` — nhớ escape `\\[` và `\\]` vì đây là ký tự đặc biệt của regex), `(?P<message>.+)`.',
        'Ghép các phần theo đúng thứ tự xuất hiện trong dòng log, cách nhau bằng khoảng trắng và ký tự `[`/`]` xung quanh level. Dùng `re.fullmatch` (không phải `match`) để chắc chắn TOÀN BỘ dòng đúng định dạng.',
        'Nếu `re.fullmatch(...)` trả về `None` (không khớp), hàm trả về `None` luôn. Nếu khớp, gọi `.groupdict()` trên kết quả để lấy dict 4 khoá đúng như yêu cầu.',
      ],
      diagnostics: [
        { test: 're\\.match\\s*\\(', message: '`re.match` chỉ neo ĐẦU chuỗi, không đảm bảo toàn bộ dòng khớp định dạng — một dòng thiếu phần cuối vẫn có thể "khớp một phần" và bị coi là hợp lệ sai. Hãy dùng `re.fullmatch` để đảm bảo khớp toàn bộ dòng.' },
      ],
      approach: `
Bài này luyện đúng use-case kinh điển của **named group**: khi có nhiều phần cần trích xuất, đặt tên cho
từng group giúp code đọc kết quả rõ ràng hơn nhiều so với việc nhớ "group số 1, group số 2...".

\`\`\`python
import re

LOG_RE = re.compile(
    r"(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<time>\\d{2}:\\d{2}:\\d{2}) \\[(?P<level>\\w+)\\] (?P<message>.+)"
)

def parse_log_line(line):
    m = LOG_RE.fullmatch(line)
    return m.groupdict() if m else None
\`\`\`

**Vì sao \`fullmatch\` chứ không phải \`match\`?** Nếu dòng log thiếu phần cuối (ví dụ thiếu \`[LEVEL]\` và
message), \`re.match\` vẫn có thể khớp được phần đầu (ngày + giờ) rồi dừng lại coi như thành công một phần —
nhưng đó là kết quả SAI vì dòng log không đầy đủ. \`fullmatch\` buộc toàn bộ chuỗi phải khớp pattern từ đầu
đến cuối, nếu không sẽ trả \`None\` — đúng ý nghĩa "dòng này có đúng định dạng hay không", không phải "dòng
này có PHẦN NÀO khớp hay không".
`,
      solution: `import re

LOG_RE = re.compile(
    r"(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<time>\\d{2}:\\d{2}:\\d{2}) \\[(?P<level>\\w+)\\] (?P<message>.+)"
)

def parse_log_line(line):
    m = LOG_RE.fullmatch(line)
    return m.groupdict() if m else None`,
      complexity: {
        question: 'Độ phức tạp thời gian của `parse_log_line` theo độ dài n của dòng log?',
        options: ['O(1)', 'O(n) — regex engine quét qua dòng một lượt (không có backtracking bùng nổ trong pattern này)', 'O(n²)', 'O(n!)'],
        answer: 1,
        why: 'Các group ở đây có ranh giới rõ ràng (dấu cách, dấu ngoặc vuông cố định), không gây backtracking phức tạp, nên chi phí tuyến tính theo độ dài dòng log.',
      },
      realWorld: 'Hệ thống giám sát (monitoring/observability) parse hàng triệu dòng log mỗi ngày để đưa vào dashboard tìm lỗi (ELK stack, Datadog...); named group giúp mapping trực tiếp sang cột trong database mà không cần nhớ thứ tự group.',
    },
    {
      id: 'py-valid-username',
      title: 'Kiểm tra username hợp lệ',
      en: 'Validate Username',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'is_valid_username',
      lang: 'python',
      statement: `
Viết hàm \`is_valid_username(name)\` trả về \`True\`/\`False\` theo quy tắc:
- Độ dài từ **3 đến 16 ký tự**
- Ký tự **đầu tiên phải là chữ cái** (a-z, A-Z)
- Các ký tự còn lại chỉ được là chữ cái, chữ số, hoặc dấu gạch dưới \`_\`
- **Không được có khoảng trắng** hay ký tự đặc biệt khác

**Ví dụ**
- \`is_valid_username("abc")\` → \`True\`
- \`is_valid_username("ab")\` → \`False\` (quá ngắn)
- \`is_valid_username("1abc")\` → \`False\` (bắt đầu bằng số)
- \`is_valid_username("no spaces")\` → \`False\`
`,
      starter: `import re\n\ndef is_valid_username(name):\n    # Tra ve True/False\n    \n`,
      tests: [
        { args: ['abc'], expected: true, name: 'Đúng 3 ký tự (biên dưới)' },
        { args: ['ab'], expected: false, name: 'Chỉ 2 ký tự -> quá ngắn' },
        { args: ['1abc'], expected: false, name: 'Bắt đầu bằng số' },
        { args: ['valid_user_99'], expected: true, name: 'Chữ, số, gạch dưới hợp lệ' },
        { args: ['this_username_is_way_too_long'], expected: false, name: 'Quá 16 ký tự' },
        { args: ['no spaces'], expected: false, name: 'Có khoảng trắng' },
      ],
      hints: [
        'Dùng regex mô tả đúng 3 phần của quy tắc: 1 chữ cái đầu, rồi 2-15 ký tự tiếp theo (để tổng độ dài trong khoảng 3-16). Lớp ký tự cho phần sau: `[A-Za-z0-9_]`.',
        'Pattern gợi ý: `r"[A-Za-z][A-Za-z0-9_]{2,15}"` — chữ cái đầu, sau đó từ 2 đến 15 ký tự nữa (tổng 3 đến 16).',
        'Dùng `re.fullmatch` (không phải `match` hay `search`) để đảm bảo TOÀN BỘ chuỗi khớp — nếu chỉ dùng `search`, chuỗi `"no spaces"` vẫn có thể tìm thấy một khớp con hợp lệ ở đâu đó và bị chấp nhận sai.',
      ],
      diagnostics: [
        { test: 're\\.search\\s*\\(', message: '`re.search` chỉ cần tìm thấy MỘT đoạn khớp bất kỳ trong chuỗi, không đảm bảo toàn bộ chuỗi hợp lệ — ví dụ chuỗi "no spaces" vẫn chứa đoạn con "no" khớp được một phần pattern. Hãy dùng `re.fullmatch` để validate toàn bộ chuỗi.' },
      ],
      approach: `
Bài này là ứng dụng trực tiếp của nguyên tắc đã học: **validate toàn bộ input luôn cần \`fullmatch\`**,
không phải \`match\` hay \`search\`.

\`\`\`python
import re

USERNAME_RE = re.compile(r"[A-Za-z][A-Za-z0-9_]{2,15}")

def is_valid_username(name):
    return USERNAME_RE.fullmatch(name) is not None
\`\`\`

**Vì sao lượng từ \`{2,15}\` chứ không phải \`{3,16}\`?** Vì ký tự đầu tiên đã được match riêng bởi
\`[A-Za-z]\` (chiếm 1 trong tổng độ dài), nên phần còn lại chỉ cần từ \`3 - 1 = 2\` đến \`16 - 1 = 15\` ký tự
nữa. Đây là lỗi sai một-đơn-vị (off-by-one) rất dễ mắc khi tách một ràng buộc "tổng độ dài" thành nhiều
phần regex riêng biệt — luôn cộng/trừ lại phần đã tiêu thụ bởi các token đứng trước.
`,
      solution: `import re

USERNAME_RE = re.compile(r"[A-Za-z][A-Za-z0-9_]{2,15}")

def is_valid_username(name):
    return USERNAME_RE.fullmatch(name) is not None`,
      complexity: {
        question: 'Độ phức tạp thời gian của `is_valid_username` theo độ dài n của name?',
        options: ['O(1) vì độ dài tối đa đã bị giới hạn 16 ký tự trong chính đề bài', 'O(n) tổng quát, và vì ràng buộc độ dài ≤16 nên trong bài này là O(1) theo nghĩa thực tế', 'O(n²)', 'O(2^n)'],
        answer: 1,
        why: 'Về bản chất thuật toán, việc khớp regex tuyến tính theo độ dài chuỗi input (O(n)). Vì đề bài giới hạn cứng độ dài tối đa 16, chi phí thực tế bị chặn trên bởi một hằng số — nhưng bản chất thuật toán vẫn là O(n), không phải O(1) một cách nội tại.',
      },
      realWorld: 'Validate username/mã sản phẩm/mã khuyến mãi khi đăng ký tài khoản hoặc nhập liệu — validate chặt bằng `fullmatch` ngay tại backend là lớp phòng thủ cuối cùng, không nên chỉ tin vào validate phía frontend (có thể bị bỏ qua bởi request giả mạo trực tiếp tới API).',
    },
  ],
},
];
