/**
 * LỘ TRÌNH PYTHON — MODULE 9: Module, Package & Môi trường ảo
 */

export default [
/* ==================================================================== */
{
  id: 'py-packaging',
  name: 'Module, Package & Môi trường ảo',
  en: 'Modules, Packages & Virtual Environments',
  icon: '📦',
  summary: 'Cách Python tìm và nạp code khi bạn `import` một thứ gì đó, vì sao mỗi dự án cần một môi trường ảo riêng, và cách đọc "requirements.txt" đúng nghĩa của nó.',
  lesson: `
## 1. Vấn đề gốc

Hai câu hỏi mọi người mới học Python đều gặp: **"import này lấy code từ đâu ra?"** và **"vì sao dự án A cần
Django 3, dự án B cần Django 4, chạy chung máy có sao không?"**. Cả hai câu hỏi đều dẫn tới cùng một chủ đề:
Python cần một cơ chế rõ ràng để (1) xác định vị trí code khi \`import\`, và (2) cô lập các bộ thư viện khác
nhau giữa các dự án — đó là **package system** và **virtual environment (venv)**.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript (Node.js) | Python |
|---|---|---|
| Đơn vị code có thể import | 1 file = 1 module (ES module/CommonJS) | 1 file \`.py\` = 1 module |
| Nhóm nhiều module lại | thư mục có \`index.js\`, hoặc package npm | thư mục có \`__init__.py\` = **package** |
| Quản lý thư viện bên ngoài | \`package.json\` + \`node_modules\` (tự động cô lập theo từng dự án) | \`requirements.txt\`/\`pyproject.toml\` + **venv** (phải TỰ TẠO, không tự động cô lập) |
| Cài thư viện | \`npm install\` | \`pip install\` (bên trong venv đã kích hoạt) |
| Import tương đối trong package | \`import "./sibling.js"\` | \`from . import sibling\` (bên trong package) |
| Chạy file như script chính | không phân biệt "entry" đặc biệt | \`if __name__ == "__main__":\` |

## 3. Ý tưởng cốt lõi

**(a) Module vs Package.** Một **module** đơn giản là một file \`.py\` — mọi biến/hàm/class trong đó có thể
\`import\`. Một **package** là một THƯ MỤC chứa nhiều module, có file \`__init__.py\` (có thể rỗng) đánh dấu
"đây là một package hợp lệ, không phải thư mục thường". Không có \`__init__.py\`, Python (bản cũ) sẽ không
coi thư mục đó là package importable được theo cách thông thường.

**(b) \`sys.path\` quyết định Python tìm module ở đâu.** Khi bạn \`import foo\`, Python duyệt lần lượt các
thư mục trong danh sách \`sys.path\` (bắt đầu bằng thư mục chứa script đang chạy, rồi tới các thư viện đã
cài) để tìm \`foo.py\` hoặc thư mục \`foo/\` có \`__init__.py\`. Đây là lý do lỗi \`ModuleNotFoundError\` cực kỳ
phổ biến khi cấu trúc thư mục dự án không như bạn nghĩ.

**(c) \`if __name__ == "__main__":\`** — mọi module Python đều có biến đặc biệt \`__name__\`. Khi file được
**chạy trực tiếp** (\`python foo.py\`), \`__name__\` mang giá trị \`"__main__"\`. Khi file được **import** từ
nơi khác (\`import foo\`), \`__name__\` mang giá trị là tên module (\`"foo"\`). Guard này cho phép một file vừa
dùng được như một script độc lập, vừa import được để tái sử dụng hàm mà KHÔNG chạy luôn phần code demo/test
bên trong nó.

**(d) Virtual environment (venv) cô lập thư viện theo từng dự án.** Khác với Node.js (mỗi dự án tự có
\`node_modules\` riêng theo mặc định), Python mặc định cài thư viện vào MỘT nơi dùng chung cho toàn hệ thống
— nếu dự án A cần \`requests==2.20\` và dự án B cần \`requests==2.31\`, cài trực tiếp sẽ xung đột. \`venv\` tạo
một bản Python + thư viện **riêng biệt hoàn toàn** cho từng dự án:

\`\`\`bash
python -m venv .venv          # tạo môi trường ảo trong thư mục .venv
source .venv/bin/activate     # kích hoạt (Windows: .venv\\\\Scripts\\\\activate)
pip install requests==2.31    # chỉ cài vào venv này, không ảnh hưởng dự án khác
pip freeze > requirements.txt # ghi lại đúng phiên bản đang dùng để chia sẻ với người khác
\`\`\`

## 4. Dấu hiệu nhận biết

| Thấy trong đề bài/tình huống | Nghĩ tới |
|---|---|
| "import bị lỗi ModuleNotFoundError dù file rõ ràng tồn tại" | kiểm tra \`sys.path\`, vị trí chạy script, có thiếu \`__init__.py\` không |
| "chạy file này thì in ra demo, nhưng import vào nơi khác lại chạy luôn demo không mong muốn" | thiếu \`if __name__ == "__main__":\` guard |
| "2 dự án cần 2 phiên bản khác nhau của cùng 1 thư viện" | mỗi dự án PHẢI có venv riêng |
| "requirements.txt ghi package==1.2.3" | pin CỨNG đúng phiên bản, đảm bảo mọi máy cài giống hệt nhau |
| "requirements.txt ghi package>=1.2.3" | cho phép bản MỚI HƠN, có thể gây khác biệt hành vi giữa các lần cài |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
# (a) Guard __main__ — mẫu chuẩn cho mọi file Python có thể chạy độc lập
def main():
    print("Chạy logic chính ở đây")

if __name__ == "__main__":
    main()

# (b) Cấu trúc package tối thiểu
# my_package/
#     __init__.py        (có thể rỗng, hoặc export chọn lọc qua __all__)
#     utils.py
#     core.py

# Trong core.py, import module cùng package (relative import):
from . import utils              # import cả module utils
from .utils import helper_func    # import thẳng 1 hàm cụ thể

# (c) __all__ kiểm soát "from package import *" lấy gì
# trong __init__.py:
__all__ = ["core_function", "CoreClass"]   # chỉ export đúng những gì liệt kê ở đây
\`\`\`

## 6. Bẫy thường gặp

- **Quên \`if __name__ == "__main__":\`**: viết code demo/test thẳng ở cấp module (không nằm trong hàm/guard)
  khiến MỌI nơi \`import\` file đó đều vô tình chạy luôn đoạn demo — một lỗi rất phổ biến khi mới viết
  module đầu tiên.
- **Cài thư viện trực tiếp vào Python hệ thống (không dùng venv)**: hoạt động tạm ổn lúc đầu, nhưng khi có
  dự án thứ hai cần phiên bản khác, hai dự án sẽ giẫm chân lên nhau — luôn tạo venv riêng cho MỖI dự án, kể
  cả dự án nhỏ.
- **\`requirements.txt\` không pin phiên bản** (chỉ ghi tên package, không có \`==x.y.z\`): cài lại sau vài
  tháng có thể ra bản khác hoàn toàn, code chạy được hôm nay có thể lỗi ngày mai vì thư viện đã cập nhật và
  đổi hành vi (breaking change) mà bạn không hề sửa code của mình.
- **Nhầm lẫn giữa "chạy sai thư mục" và "thiếu thư viện"**: \`ModuleNotFoundError: No module named 'foo'\`
  có thể do (1) chưa \`pip install foo\` trong venv đang active, HOẶC (2) đang chạy từ sai thư mục khiến
  \`sys.path\` không chứa thư mục dự án — hai nguyên nhân khác hẳn nhau, cần phân biệt để debug đúng hướng.

## 7. Ứng dụng thực tế

- **Đóng gói một dự án nội bộ thành nhiều module có tổ chức** (thay vì một file \`main.py\` khổng lồ vài
  nghìn dòng): tách theo package \`models/\`, \`services/\`, \`utils/\` giúp code dễ bảo trì, dễ tìm, dễ test
  riêng từng phần.
- **CI/CD pipeline luôn tạo venv sạch từ \`requirements.txt\` đã pin phiên bản**: đảm bảo môi trường build
  trên server giống hệt môi trường trên máy dev, tránh câu nói kinh điển "chạy được trên máy tôi mà".
- **Thư viện Python phổ biến đều dùng guard \`__main__\`**: cho phép vừa \`import numpy\` để dùng trong code
  của bạn, vừa cho phép nhóm phát triển numpy chạy file đó trực tiếp để test nội bộ mà không ảnh hưởng người
  dùng thư viện.
`,
  quiz: [
    {
      q: 'Biến đặc biệt `__name__` mang giá trị gì khi một file Python được CHẠY TRỰC TIẾP (ví dụ `python foo.py`)?',
      options: [
        '`"foo"` — luôn là tên file',
        '`"__main__"` — bất kể tên file là gì, khi chạy trực tiếp `__name__` luôn nhận giá trị này; chỉ khi file được IMPORT từ nơi khác thì `__name__` mới mang tên module thật',
        '`None`',
        '`"__init__"`',
      ],
      answer: 1,
      why: 'Đây là cơ chế đứng sau guard `if __name__ == "__main__":`. Chạy trực tiếp → `__name__ == "__main__"`. Import từ module khác → `__name__` là tên module (ví dụ `"foo"`), guard trả về False nên phần code demo/test bên trong không tự chạy.',
    },
    {
      q: 'Vì sao mỗi dự án Python nên có một virtual environment (venv) RIÊNG, thay vì cài thư viện trực tiếp vào Python hệ thống?',
      options: [
        'venv giúp code chạy nhanh hơn về mặt hiệu năng',
        'venv cô lập bộ thư viện của từng dự án — tránh xung đột khi hai dự án cần hai phiên bản khác nhau của cùng một thư viện, vốn không thể cùng tồn tại nếu cài chung vào một Python hệ thống',
        'Python bắt buộc phải dùng venv, không có venv thì `pip install` sẽ báo lỗi',
        'venv chỉ cần thiết khi triển khai lên server, không cần khi phát triển local',
      ],
      answer: 1,
      why: 'Một bản cài Python (không dùng venv) chỉ có MỘT nơi lưu thư viện dùng chung cho mọi dự án. Nếu dự án A cần `requests==2.20` và dự án B cần `requests==2.31`, không thể cài cả hai phiên bản cùng lúc vào cùng một nơi — venv giải quyết bằng cách tạo một bộ thư viện độc lập cho mỗi dự án.',
    },
    {
      q: 'File `__init__.py` (có thể để trống) trong một thư mục có ý nghĩa gì?',
      options: [
        'Chứa hàm `main()` bắt buộc phải có của chương trình',
        'Đánh dấu thư mục đó là một PACKAGE hợp lệ mà Python có thể `import`, đồng thời có thể dùng để export chọn lọc các thành phần con qua biến `__all__`',
        'Là file cấu hình bắt buộc chứa danh sách dependency, giống `package.json`',
        'Chỉ cần thiết khi thư mục có hơn 10 file `.py` trở lên',
      ],
      answer: 1,
      why: '`__init__.py` là dấu hiệu để Python nhận diện một thư mục là package (không phải thư mục thường), và code bên trong nó chạy khi package được import lần đầu — thường dùng để export chọn lọc API công khai của package qua `__all__` hoặc import lại các submodule hay dùng.',
    },
    {
      q: 'Trong `requirements.txt`, dòng `requests==2.31.0` và dòng `requests>=2.31.0` khác nhau như thế nào?',
      options: [
        'Không có khác biệt thực tế nào',
        '`==2.31.0` PIN CỨNG đúng một phiên bản (mọi lần cài lại đều giống hệt nhau); `>=2.31.0` cho phép cài bất kỳ bản MỚI HƠN trong tương lai — có thể mang theo thay đổi hành vi (breaking change) mà code của bạn chưa được kiểm thử với bản đó',
        '`>=2.31.0` chạy nhanh hơn `==2.31.0`',
        '`==2.31.0` chỉ dùng được với thư viện nội bộ, không dùng được với thư viện public trên PyPI',
      ],
      answer: 1,
      why: 'Pin cứng phiên bản (`==`) đảm bảo khả năng tái lập (reproducibility) — ai cài lại cũng ra đúng một bộ thư viện giống hệt. `>=` linh hoạt hơn nhưng đổi lại mất khả năng đảm bảo đó, dễ gặp lỗi "chạy được hôm qua, lỗi hôm nay" khi thư viện phát hành bản mới có thay đổi không tương thích ngược.',
    },
    {
      q: '`from . import utils` bên trong một package có ý nghĩa gì?',
      options: [
        'Import module `utils` từ CÙNG package hiện tại (relative import) — dấu `.` biểu thị "thư mục package hiện tại"',
        'Import module `utils` từ thư viện chuẩn của Python',
        'Đây là cú pháp sai, Python không hỗ trợ dấu `.` trong câu lệnh import',
        'Import TẤT CẢ các module trong package hiện tại cùng lúc',
      ],
      answer: 0,
      why: 'Dấu `.` ở đầu đường dẫn import biểu thị "package hiện tại" (relative import) — dùng để tham chiếu tới các module anh em (sibling) nằm cùng package, thay vì phải ghi đường dẫn tuyệt đối đầy đủ từ gốc dự án.',
    },
  ],
  problems: [
    {
      id: 'py-compare-versions',
      title: 'So sánh phiên bản semantic version',
      en: 'Compare Semantic Versions',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'compare_versions',
      lang: 'python',
      statement: `
Viết hàm \`compare_versions(v1, v2)\` so sánh hai chuỗi phiên bản dạng \`"MAJOR.MINOR.PATCH"\` (ví dụ
\`"2.31.0"\`), trả về:
- \`-1\` nếu \`v1 < v2\`
- \`0\` nếu \`v1 == v2\`
- \`1\` nếu \`v1 > v2\`

So sánh theo **giá trị số** của từng phần (\`"2.9.0"\` lớn hơn \`"2.10.0"\` là **SAI** — phải so \`9 < 10\` chứ
không phải so sánh chuỗi \`"9" < "10"\`).

**Ví dụ**
- \`compare_versions("2.31.0", "2.31.0")\` → \`0\`
- \`compare_versions("2.9.0", "2.10.0")\` → \`-1\` (9 < 10 dù so chuỗi thì "9" > "10")
- \`compare_versions("3.0.0", "2.31.9")\` → \`1\`
`,
      starter: `def compare_versions(v1, v2):\n    # Tra ve -1, 0, hoac 1 khi so sanh 2 chuoi version dang "MAJOR.MINOR.PATCH"\n    \n`,
      tests: [
        { args: ['2.31.0', '2.31.0'], expected: 0, name: 'Bằng nhau hoàn toàn' },
        { args: ['2.9.0', '2.10.0'], expected: -1, name: 'So số, không so chuỗi (9 < 10)' },
        { args: ['3.0.0', '2.31.9'], expected: 1, name: 'Khác MAJOR' },
        { args: ['1.2.3', '1.2.10'], expected: -1, name: 'Khác PATCH, số có độ dài khác nhau' },
        { args: ['1.10.0', '1.9.9'], expected: 1, name: 'MINOR 10 lớn hơn MINOR 9' },
        { args: ['0.1.0', '0.1.0'], expected: 0, name: 'Phiên bản 0.x bằng nhau' },
      ],
      hints: [
        'Tách mỗi chuỗi version thành 3 số nguyên bằng `.split(".")` rồi `int(...)` từng phần — KHÔNG so sánh trực tiếp dạng chuỗi vì `"9" > "10"` theo thứ tự chuỗi (so ký tự đầu tiên) trong khi `9 < 10` theo giá trị số.',
        'Sau khi có hai tuple/list số nguyên (ví dụ `(2, 9, 0)` và `(2, 10, 0)`), Python có thể so sánh TUPLE trực tiếp theo thứ tự từ điển (so phần tử đầu tiên trước, bằng nhau thì so tiếp phần tử kế) — không cần tự viết vòng lặp so từng phần.',
        'Từ kết quả so sánh, trả về đúng `-1`/`0`/`1`: có thể dùng biểu thức `(a > b) - (a < b)` để có kết quả gọn trong một dòng, hoặc dùng if/elif/else tường minh.',
      ],
      diagnostics: [
        { test: 'return\\s+v1\\s*[<>=]|return\\s+.*v1\\s*==\\s*v2\\s*$', message: 'Có vẻ bạn đang so sánh trực tiếp v1, v2 dạng CHUỖI — điều này sai vì so chuỗi so sánh từng KÝ TỰ (ví dụ "9" > "10" theo thứ tự chuỗi). Hãy tách thành số nguyên trước khi so sánh.' },
      ],
      approach: `
Đây là ứng dụng trực tiếp của khái niệm **semantic versioning** — nền tảng của mọi hệ thống quản lý gói
(pip, npm...). Bẫy cốt lõi: so sánh CHUỖI khác hoàn toàn so sánh SỐ.

\`\`\`python
def compare_versions(v1, v2):
    t1 = tuple(int(x) for x in v1.split("."))
    t2 = tuple(int(x) for x in v2.split("."))
    if t1 < t2:
        return -1
    if t1 > t2:
        return 1
    return 0
\`\`\`

**Vì sao so sánh TUPLE số lại đúng, còn so sánh CHUỖI lại sai?** Python so sánh tuple theo kiểu **từ điển
(lexicographic)**: so phần tử đầu tiên trước, nếu bằng nhau mới so tiếp phần tử kế — giống cách so sánh
từ trong từ điển theo từng chữ cái. Với tuple SỐ, \`(2, 9, 0) < (2, 10, 0)\` đúng vì \`9 < 10\` (so sánh SỐ).
Nhưng nếu so sánh trực tiếp chuỗi \`"2.9.0" < "2.10.0"\`, Python so từng KÝ TỰ: \`'9'\` (mã Unicode 57) lớn
hơn \`'1'\` (mã Unicode 49) ngay ở vị trí đó, nên chuỗi \`"2.9.0"\` bị coi là LỚN HƠN \`"2.10.0"\` — sai hoàn
toàn so với ý nghĩa số học thật sự của phiên bản.
`,
      solution: `def compare_versions(v1, v2):
    t1 = tuple(int(x) for x in v1.split("."))
    t2 = tuple(int(x) for x in v2.split("."))
    if t1 < t2:
        return -1
    if t1 > t2:
        return 1
    return 0`,
      complexity: {
        question: 'Độ phức tạp thời gian của `compare_versions`?',
        options: ['O(1) — luôn đúng 3 phần cố định (MAJOR.MINOR.PATCH) cần tách và so sánh, không phụ thuộc input lớn', 'O(n) theo độ dài chuỗi version, không có chặn trên', 'O(n log n)', 'O(n²)'],
        answer: 0,
        why: 'Vì định dạng version luôn có đúng 3 phần cố định, số phép tách chuỗi và so sánh không đổi bất kể giá trị cụ thể của các số — đây là thao tác chi phí hằng số.',
      },
      realWorld: '`pip`/`npm`/mọi package manager đều cần so sánh phiên bản để quyết định "bản nào mới hơn", "có thoả điều kiện >=x.y.z không" khi resolve dependency — logic so sánh sai (dùng so sánh chuỗi thay vì số) từng gây ra bug thật trong lịch sử nhiều công cụ quản lý gói.',
    },
    {
      id: 'py-parse-requirements',
      title: 'Phân tích file requirements.txt',
      en: 'Parse Requirements File',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'parse_requirements',
      lang: 'python',
      statement: `
Viết hàm \`parse_requirements(text)\` phân tích nội dung một file \`requirements.txt\`, trả về **list các
dict** \`{"name": ..., "version": ...}\` cho mỗi dòng hợp lệ, theo quy tắc:

- Mỗi dòng có dạng \`ten_package==phien_ban\` (ví dụ \`requests==2.31.0\`) hoặc chỉ \`ten_package\` (không pin
  phiên bản — khi đó \`"version"\` là \`None\`).
- Dòng **rỗng** hoặc dòng **bắt đầu bằng \`#\`** (comment) phải được **bỏ qua**, không đưa vào kết quả.
- Khoảng trắng thừa ở đầu/cuối mỗi dòng cần được loại bỏ trước khi xử lý.

**Ví dụ**
\`\`\`
requests==2.31.0
# đây là comment, bỏ qua dòng này
flask

pytest==7.4.0
\`\`\`
→ \`[{"name": "requests", "version": "2.31.0"}, {"name": "flask", "version": None}, {"name": "pytest", "version": "7.4.0"}]\`
`,
      starter: `def parse_requirements(text):\n    # Tra ve list dict {"name":..., "version":...}, bo qua dong rong/comment\n    \n`,
      tests: [
        {
          args: ['requests==2.31.0\n# đây là comment, bỏ qua dòng này\nflask\n\npytest==7.4.0'],
          expected: [{ name: 'requests', version: '2.31.0' }, { name: 'flask', version: null }, { name: 'pytest', version: '7.4.0' }],
          name: 'Ví dụ cơ bản: pin version, không pin, comment, dòng rỗng',
        },
        { args: [''], expected: [], name: 'Chuỗi rỗng -> list rỗng' },
        { args: ['# chỉ toàn comment\n# dòng 2'], expected: [], name: 'Chỉ có comment -> list rỗng' },
        { args: ['  numpy==1.26.0  \n  pandas  '], expected: [{ name: 'numpy', version: '1.26.0' }, { name: 'pandas', version: null }], name: 'Khoảng trắng thừa quanh mỗi dòng' },
        { args: ['django==4.2.0'], expected: [{ name: 'django', version: '4.2.0' }], name: 'Chỉ một dòng, có pin version' },
      ],
      hints: [
        'Tách `text` thành từng dòng bằng `.splitlines()`. Với mỗi dòng, `.strip()` trước để bỏ khoảng trắng thừa đầu/cuối.',
        'Bỏ qua dòng nếu (sau khi strip) nó rỗng, HOẶC bắt đầu bằng `"#"` (dùng `line.startswith("#")`).',
        'Với dòng còn lại: nếu có chứa `"=="`, tách bằng `line.split("==", 1)` để lấy đúng tên và phiên bản (tham số `1` giới hạn tối đa 1 lần tách, đề phòng phiên bản có chứa thêm dấu `==` — dù hiếm). Nếu không có `"=="`, cả dòng chính là tên package, `version` là `None`.',
      ],
      diagnostics: [
        { test: '\\.split\\s*\\(\\s*[\'"]==[\'"]\\s*\\)(?!\\s*,\\s*1\\s*\\))', message: '`.split("==")` không giới hạn số lần tách có thể trả về nhiều hơn 2 phần tử trong trường hợp bất thường. An toàn hơn: `.split("==", 1)` để đảm bảo luôn tách thành đúng 2 phần (tên, phiên bản).' },
      ],
      approach: `
Bài này mô phỏng đúng một công việc thật: parser cho \`requirements.txt\` — kết hợp lọc dòng (bỏ comment,
dòng rỗng) và tách chuỗi có điều kiện (có pin version hay không).

\`\`\`python
def parse_requirements(text):
    result = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "==" in line:
            name, version = line.split("==", 1)
        else:
            name, version = line, None
        result.append({"name": name, "version": version})
    return result
\`\`\`

**Vì sao dùng \`.split("==", 1)\` thay vì \`.split("==")\`?** Tham số thứ hai của \`str.split\` giới hạn **số
lần tách tối đa**. Nếu không giới hạn, một dòng bất thường như \`"foo==1.0==extra"\` sẽ bị tách thành 3 phần
(\`["foo", "1.0", "extra"]\`), khiến \`name, version = line.split("==")\` báo lỗi \`ValueError: too many values
to unpack\`. Giới hạn \`maxsplit=1\` đảm bảo LUÔN nhận đúng 2 phần bất kể phần "phiên bản" chứa gì.
`,
      solution: `def parse_requirements(text):
    result = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "==" in line:
            name, version = line.split("==", 1)
        else:
            name, version = line, None
        result.append({"name": name, "version": version})
    return result`,
      complexity: {
        question: 'Độ phức tạp thời gian của `parse_requirements` theo tổng số ký tự n trong text?',
        options: ['O(1)', 'O(n) — mỗi dòng được xử lý (strip, kiểm tra, tách chuỗi) một lần, tổng công việc tỉ lệ thuận với tổng độ dài văn bản', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: 'Tách dòng, strip, và split mỗi dòng đều là các thao tác tuyến tính theo độ dài của chính dòng đó; tổng lại trên toàn bộ văn bản vẫn là O(n).',
      },
      realWorld: 'Công cụ CI/CD, linter dependency (kiểm tra thư viện lỗi thời/có lỗ hổng bảo mật), hoặc tool tự động đồng bộ `requirements.txt` giữa các môi trường đều cần parse chính xác định dạng này — đây là bước đầu tiên trước khi so sánh phiên bản (`compare_versions`) để biết dự án có đang dùng bản lỗi thời hay không.',
    },
    {
      id: 'py-resolve-import',
      title: 'Mô phỏng cách Python tìm module khi import',
      en: 'Simulate Python Import Resolution',
      difficulty: 'Hard',
      targetMinutes: 15,
      entry: 'resolve_import',
      lang: 'python',
      statement: `
Cho một **cây thư mục package** biểu diễn dưới dạng dict lồng nhau: mỗi khoá là tên thư mục/module con;
khoá đặc biệt \`"__init__"\` (giá trị \`True\`) nghĩa là thư mục đó CÓ file \`__init__.py\` (là một package hợp
lệ); một khoá ánh xạ tới \`None\` nghĩa là đó là một **module lá** (file \`tên.py\`, không phải thư mục).

Viết hàm \`resolve_import(tree, dotted_path)\` trả về \`True\` nếu \`import dotted_path\` (ví dụ
\`"pkg.sub.mod"\`) sẽ **thành công**, dựa trên quy tắc: mọi phần TRUNG GIAN trên đường dẫn (không tính phần
cuối cùng) phải là một package hợp lệ (dict có \`"__init__": True\`); phần CUỐI CÙNG chỉ cần tồn tại (có thể
là module lá hoặc package).

**Ví dụ**, với:
\`\`\`python
tree = {
    "pkg": {
        "__init__": True,
        "sub": {"__init__": True, "mod": None},
        "utils": None,
    }
}
\`\`\`
- \`resolve_import(tree, "pkg.sub.mod")\` → \`True\`
- \`resolve_import(tree, "pkg.utils")\` → \`True\`
- \`resolve_import(tree, "pkg.utils.sub")\` → \`False\` (\`utils\` là module lá, không thể chứa \`sub\` bên trong)
- \`resolve_import(tree, "pkg.missing")\` → \`False\`
`,
      starter: `def resolve_import(tree, dotted_path):\n    # Tra ve True/False: dotted_path co import thanh cong tu tree khong\n    \n`,
      tests: [
        {
          args: [{ pkg: { __init__: true, sub: { __init__: true, mod: null }, utils: null } }, 'pkg.sub.mod'],
          expected: true,
          name: 'Import module lá qua 2 tầng package',
        },
        {
          args: [{ pkg: { __init__: true, sub: { __init__: true, mod: null }, utils: null } }, 'pkg.utils'],
          expected: true,
          name: 'Import module lá trực tiếp trong pkg',
        },
        {
          args: [{ pkg: { __init__: true, sub: { __init__: true, mod: null }, utils: null } }, 'pkg.utils.sub'],
          expected: false,
          name: 'utils là module lá, không thể có submodule bên trong',
        },
        {
          args: [{ pkg: { __init__: true, sub: { __init__: true, mod: null }, utils: null } }, 'pkg.missing'],
          expected: false,
          name: 'Tên không tồn tại trong cây',
        },
        {
          args: [{ pkg: { __init__: true, sub: { __init__: true, mod: null }, utils: null } }, 'pkg.sub'],
          expected: true,
          name: 'Import chính package con (không cần đi tới module lá)',
        },
        {
          args: [{ pkg: { __init__: true, sub: { mod: null }, utils: null } }, 'pkg.sub.mod'],
          expected: false,
          name: 'sub thiếu __init__ -> không phải package hợp lệ để đi xuyên qua',
        },
      ],
      hints: [
        'Tách `dotted_path` bằng `.split(".")` để có từng phần tên (ví dụ `["pkg", "sub", "mod"]`). Duyệt qua từng phần, giữ một biến `node` bắt đầu bằng `tree`.',
        'Ở mỗi bước: nếu `node` không phải dict hoặc không chứa tên phần hiện tại làm khoá → trả về `False` ngay (đường dẫn không tồn tại). Nếu có, cập nhật `node = node[phần_đó]`.',
        'Điểm mấu chốt: CHỈ kiểm tra điều kiện "phải là package hợp lệ (`node.get(\'__init__\')`)" khi phần đang xét KHÔNG PHẢI phần cuối cùng của đường dẫn — phần cuối cùng chỉ cần tồn tại, không bắt buộc phải là package.',
      ],
      diagnostics: [
        { test: '__init__.*==.*True(?!.*\\bfor\\b)', message: 'Hãy nhớ kiểm tra điều kiện "phải có __init__" CHỈ áp dụng cho các phần TRUNG GIAN của đường dẫn, không áp dụng cho phần CUỐI CÙNG — nếu áp dụng cho cả phần cuối, các module lá (giá trị None) hợp lệ sẽ bị coi là lỗi.' },
      ],
      approach: `
Bài này mô phỏng đúng bản chất thuật toán đứng sau việc Python duyệt \`sys.path\`/cây package khi \`import\`
một đường dẫn có dấu chấm — một quy trình thường bị coi là "phép màu" nhưng thực chất là một vòng lặp duyệt
cây khá đơn giản.

\`\`\`python
def resolve_import(tree, dotted_path):
    parts = dotted_path.split(".")
    node = tree
    for i, part in enumerate(parts):
        if not isinstance(node, dict) or part not in node:
            return False
        node = node[part]
        is_last = (i == len(parts) - 1)
        if not is_last:
            if not (isinstance(node, dict) and node.get("__init__")):
                return False   # phần trung gian PHẢI là package hợp lệ mới đi tiếp được
    return True
\`\`\`

**Vì sao phần cuối cùng KHÔNG cần kiểm tra \`__init__\`?** Vì \`import pkg.utils\` là hợp lệ ngay cả khi
\`utils\` chỉ là một FILE (\`utils.py\`, module lá, không phải thư mục/package) — bạn chỉ cần \`__init__.py\`
để "đi XUYÊN QUA" một thư mục tới cấp sâu hơn, không cần nó cho chính đích đến cuối cùng của import. Đây
chính là lý do thực tế \`ModuleNotFoundError\` hay xảy ra: một thư mục TRUNG GIAN trên đường dẫn thiếu
\`__init__.py\`, chặn đứng việc "đi xuyên qua" nó dù module đích thực sự tồn tại.
`,
      solution: `def resolve_import(tree, dotted_path):
    parts = dotted_path.split(".")
    node = tree
    for i, part in enumerate(parts):
        if not isinstance(node, dict) or part not in node:
            return False
        node = node[part]
        is_last = (i == len(parts) - 1)
        if not is_last:
            if not (isinstance(node, dict) and node.get("__init__")):
                return False
    return True`,
      complexity: {
        question: 'Độ phức tạp thời gian của `resolve_import` theo số phần k trong dotted_path (số dấu chấm + 1)?',
        options: ['O(1) bất kể k', 'O(k) — duyệt qua đúng k phần của đường dẫn, mỗi bước tốn thời gian không đổi để tra cứu dict', 'O(k²)', 'O(2^k)'],
        answer: 1,
        why: 'Vòng lặp duyệt qua từng phần của dotted_path đúng một lần, mỗi lần tra cứu khoá trong dict là thao tác trung bình O(1) — tổng chi phí tuyến tính theo số phần của đường dẫn.',
      },
      realWorld: 'Hiểu đúng cơ chế này giúp debug nhanh các lỗi `ModuleNotFoundError`/`ImportError` kinh điển trong dự án Python thực tế: thiếu `__init__.py` ở một thư mục trung gian, chạy script từ sai vị trí khiến `sys.path` không như mong đợi, hoặc nhầm giữa "absolute import" và "relative import" khi tái cấu trúc lại package.',
    },
  ],
},
];
