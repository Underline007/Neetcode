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
    {
      q: 'Bạn tạo file `random.py` trong thư mục dự án để thử nghiệm. Sau đó một module khác chạy `import random` rồi gọi `random.randint(1, 10)`. Chuyện gì xảy ra?',
      options: [
        'Vẫn chạy đúng — Python luôn ưu tiên thư viện chuẩn',
        'AttributeError: module `random` has no attribute `randint` — Python nạp NHẦM file của bạn',
        'Python báo lỗi trùng tên module ngay khi bạn tạo file',
        'Hai module được gộp lại, có đủ cả hàm của bạn lẫn của thư viện chuẩn',
      ],
      answer: 1,
      why: 'Python tìm module theo thứ tự trong `sys.path`, mà phần tử đầu tiên thường là **thư mục chứa script đang chạy** — đứng TRƯỚC thư viện chuẩn. File của bạn thắng, và lỗi hiện ra ở một chỗ hoàn toàn không liên quan (`randint` không tồn tại), khiến việc truy vết rất mất thời gian. Cùng cơ chế đó gây ra bug kinh điển với `email.py`, `json.py`, `types.py`, `test.py`. Kiểm tra nhanh: `import random; print(random.__file__)`.',
    },
    {
      q: 'File `config.py` có dòng `print("nap config")` ở cấp module. Một chương trình thực hiện `import config` ở ba file khác nhau. Dòng đó được in mấy lần?',
      options: ['3 lần', '1 lần', '0 lần', 'Tuỳ vào thứ tự import'],
      answer: 1,
      why: 'Lần import đầu tiên, Python chạy toàn bộ code cấp module rồi lưu object module vào `sys.modules`. Mọi lần `import` sau đó chỉ **lấy lại từ cache**, không chạy lại gì cả. Hai hệ quả lớn: (1) module là **singleton tự nhiên** của Python — biến toàn cục trong module được cả chương trình dùng chung, đây là cách cài đặt cấu hình/kết nối database dùng chung; (2) mọi tác dụng phụ khi import (mở file, gọi mạng) chỉ xảy ra một lần, đúng lúc bạn không kiểm soát — vì vậy code cấp module nên chỉ định nghĩa, đừng làm việc.',
    },
    {
      q: 'Module `mod.py` có `counter = 0` và hàm `inc()` làm `global counter; counter += 1`.\n\nfrom mod import counter, inc\ninc()\nprint(counter)\n\nIn ra gì?',
      options: ['1', '0', 'None', 'NameError'],
      answer: 1,
      why: '`from mod import counter` **copy giá trị hiện tại vào một tên mới** trong module của bạn. `inc()` gán lại `mod.counter` bên trong module gốc, nhưng tên `counter` của bạn vẫn trỏ tới số `0` cũ — hai cái tên độc lập. Đây là lý do quy ước Python là `import mod` rồi dùng `mod.counter` khi giá trị có thể thay đổi: khi đó bạn luôn đọc qua object module, thấy đúng giá trị mới nhất. Với hàm và hằng số thì `from ... import ...` hoàn toàn ổn.',
    },
    {
      q: '`a.py` có `import b` ở đầu file, `b.py` có `import a` ở đầu file. Chạy `python a.py` thì điều gì xảy ra?',
      options: [
        'Python lặp vô hạn cho tới khi tràn stack',
        'Thường là `ImportError: cannot import name ... (most likely due to a circular import)` — vì `b` nhìn thấy `a` mới nạp một PHẦN',
        'Python tự động sắp xếp lại thứ tự import và chạy bình thường',
        'Cả hai module được nạp hai lần',
      ],
      answer: 1,
      why: 'Python đưa module vào `sys.modules` **trước khi** chạy xong code của nó. Nên khi `b` gọi `import a`, nó nhận về một object `a` **chưa hoàn thiện** — chỉ có những tên đã kịp định nghĩa trước dòng `import b`. Không có vòng lặp vô hạn (nhờ cache), nhưng nếu `b` cần một tên chưa tồn tại thì lỗi. Cách sửa theo mức độ ưu tiên: tách phần dùng chung ra module thứ ba (đúng nhất), hoặc chuyển lệnh import vào trong hàm để nó chỉ chạy lúc gọi (giải pháp tình thế).',
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
    {
      id: 'py-import-order-cycle',
      title: 'Thứ tự nạp module và phát hiện import vòng',
      en: 'Import Order & Cycle Detection',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'import_order',
      lang: 'python',
      statement: `
Cho \`deps\` là một \`dict\` mô tả dự án: khoá là tên module, giá trị là danh sách các module mà nó import.

Viết hàm \`import_order(deps)\` trả về **một thứ tự nạp hợp lệ**: mọi module phải xuất hiện **sau** tất cả
những module mà nó phụ thuộc. Nếu tồn tại **import vòng** (không có thứ tự nào hợp lệ), trả về \`None\`.

**Quy tắc bắt buộc để kết quả là duy nhất:** khi có nhiều module cùng sẵn sàng để nạp, luôn chọn module
có tên **nhỏ nhất theo thứ tự chữ cái**.

Phụ thuộc không xuất hiện làm khoá trong \`deps\` được coi là **thư viện ngoài** — bỏ qua, không đưa vào
kết quả.

**Ví dụ**
- \`{"main": ["utils", "models"], "models": ["utils"], "utils": []}\` → \`["utils", "models", "main"]\`
- \`{"a": ["b"], "b": ["a"]}\` → \`None\` (import vòng)
`,
      starter: `def import_order(deps):\n    # Trả về danh sách thứ tự nạp, hoặc None nếu có import vòng\n    \n`,
      tests: [
        { args: [{ a: ['b'], b: [] }], expected: ['b', 'a'], name: 'Phụ thuộc đơn giản' },
        { args: [{ a: ['b'], b: ['a'] }], expected: null, name: 'Import vòng hai module' },
        { args: [{ a: [], b: [], c: ['a', 'b'] }], expected: ['a', 'b', 'c'], name: 'Hai module độc lập — thứ tự chữ cái' },
        { args: [{}], expected: [], name: 'Dự án rỗng' },
        { args: [{ a: [] }], expected: ['a'], name: 'Một module duy nhất' },
        { args: [{ main: ['utils', 'models'], models: ['utils'], utils: [] }], expected: ['utils', 'models', 'main'], name: 'Cấu trúc dự án điển hình' },
        { args: [{ a: ['a'] }], expected: null, name: 'Module tự import chính nó' },
        { args: [{ x: ['y'], y: ['z'], z: [] }], expected: ['z', 'y', 'x'], name: 'Chuỗi ba tầng' },
        { args: [{ app: ['os', 'json'] }], expected: ['app'], name: 'Thư viện ngoài — bỏ qua' },
        { args: [{ a: ['b'], b: ['c'], c: ['a'], d: [] }], expected: null, name: 'Vòng ba module, có thêm module rời' },
      ],
      hints: [
        'Đây chính là bài toán **sắp xếp topo** (topological sort) bạn đã gặp ở lộ trình thuật toán, chỉ đổi ngữ cảnh: đỉnh là module, cạnh `dep -> module` nghĩa là `dep` phải được nạp trước.',
        'Thuật toán Kahn: đếm `indeg[m]` = số phụ thuộc (chỉ tính những phụ thuộc CÓ trong `deps`). Lấy dần các module có `indeg == 0`, mỗi lần lấy thì giảm bậc của những module phụ thuộc vào nó.',
        'Để chọn module nhỏ nhất theo chữ cái ở mỗi bước, dùng `heapq` làm hàng đợi ưu tiên (`heappush`/`heappop`). Cuối cùng: nếu số module lấy ra ÍT HƠN tổng số module thì phần còn lại nằm trong vòng — trả về `None`.',
      ],
      diagnostics: [
        { test: '\\.pop\\s*\\(\\s*0\\s*\\)(?![\\s\\S]*sort)', message: 'Dùng hàng đợi thường (`pop(0)`) sẽ cho ra một thứ tự hợp lệ nhưng KHÔNG xác định — đề yêu cầu luôn chọn tên nhỏ nhất theo chữ cái. Dùng `heapq`, hoặc sắp xếp lại danh sách sẵn sàng sau mỗi bước.' },
        { test: 'return\\s+\\[\\s*\\]\\s*$(?![\\s\\S]*None)', message: 'Khi phát hiện import vòng, đề yêu cầu trả về `None` chứ không phải danh sách rỗng — vì `[]` là kết quả HỢP LỆ của một dự án không có module nào.' },
        { test: 'sorted\\s*\\(\\s*deps\\s*\\)\\s*$', message: 'Sắp xếp tên module theo chữ cái KHÔNG giải được bài này: thứ tự nạp do quan hệ phụ thuộc quyết định, không phải do tên. Thứ tự chữ cái chỉ dùng để phá thế hoà khi nhiều module cùng sẵn sàng.',
        },
      ],
      approach: `
Import vòng không phải chuyện lạ — nó là hệ quả tự nhiên khi dự án lớn dần. Việc phát hiện nó **chính là**
bài toán tìm chu trình trên đồ thị có hướng, và sắp xếp topo giải quyết cả hai câu hỏi cùng lúc: "nạp theo
thứ tự nào?" và "có nạp được không?".

\`\`\`python
import heapq

def import_order(deps):
    indeg = {m: 0 for m in deps}
    children = {m: [] for m in deps}

    for module, imports in deps.items():
        for dep in imports:
            if dep not in deps:      # thư viện ngoài -> không phải đỉnh của đồ thị
                continue
            children[dep].append(module)
            indeg[module] += 1

    ready = [m for m in deps if indeg[m] == 0]
    heapq.heapify(ready)             # hàng đợi ưu tiên -> luôn lấy tên nhỏ nhất

    order = []
    while ready:
        module = heapq.heappop(ready)
        order.append(module)
        for child in children[module]:
            indeg[child] -= 1
            if indeg[child] == 0:
                heapq.heappush(ready, child)

    return order if len(order) == len(deps) else None
\`\`\`

**Vì sao "lấy được ít hơn tổng số" nghĩa là có vòng?** Vì mỗi module chỉ vào hàng đợi khi bậc phụ thuộc
của nó về 0. Những module nằm trong một vòng luôn chờ nhau, bậc không bao giờ về 0, nên chúng không bao giờ
được lấy ra. Đây là cách kiểm tra chu trình **rẻ nhất** — không cần thêm lần duyệt nào.

**Ba chi tiết dễ mất điểm:**
- \`{"a": ["a"]}\` (tự import) là một vòng độ dài 1: \`indeg["a"] == 1\` ngay từ đầu → trả \`None\`. Đúng như
  Python thật, nơi \`import a\` bên trong chính \`a.py\` là dấu hiệu của lỗi cấu trúc.
- Phụ thuộc ngoài (\`os\`, \`json\`) phải bị **loại khỏi đồ thị**, nếu không \`indeg\` sẽ đếm cả những đỉnh
  không tồn tại và mọi module đều bị kẹt.
- Trả \`None\` chứ không phải \`[]\`: \`[]\` là câu trả lời hợp lệ cho một dự án rỗng, nên hai trường hợp
  không được lẫn vào nhau — đúng nguyên tắc "phân biệt *không có gì* với *không làm được*".

**Ứng dụng ngược lại:** đảo chiều thuật toán này sẽ cho bạn thứ tự **gỡ cài đặt** an toàn, hay thứ tự chạy
migration của database.
`,
      solution: `import heapq


def import_order(deps):
    indeg = {m: 0 for m in deps}
    children = {m: [] for m in deps}

    for module, imports in deps.items():
        for dep in imports:
            if dep not in deps:
                continue
            children[dep].append(module)
            indeg[module] += 1

    ready = [m for m in deps if indeg[m] == 0]
    heapq.heapify(ready)

    order = []
    while ready:
        module = heapq.heappop(ready)
        order.append(module)
        for child in children[module]:
            indeg[child] -= 1
            if indeg[child] == 0:
                heapq.heappush(ready, child)

    return order if len(order) == len(deps) else None`,
      complexity: {
        question: 'Độ phức tạp thời gian theo số module V và số quan hệ phụ thuộc E?',
        options: [
          'O(V log V + E) — mỗi module vào/ra heap một lần, mỗi cạnh được duyệt một lần',
          'O(V × E) vì phải quét lại toàn bộ sau mỗi lần lấy module',
          'O(V²) trong mọi trường hợp',
          'O(E log E)',
        ],
        answer: 0,
        why: 'Mỗi đỉnh được đẩy vào và lấy ra khỏi heap đúng một lần (mỗi thao tác O(log V)), và mỗi cạnh được xét đúng một lần khi giảm bậc → O(V log V + E). Nếu dùng hàng đợi thường thay cho heap thì còn O(V + E), nhưng ta đánh đổi hệ số log đó để lấy kết quả xác định theo thứ tự chữ cái.',
      },
      realWorld: 'Chính là thứ mà `pip` chạy để quyết định thứ tự cài đặt package, `make`/`bazel` dùng để dựng thứ tự biên dịch, công cụ migration database dùng để chạy đúng thứ tự, và các linter kiến trúc (`import-linter`) dùng để chặn import vòng ngay từ CI. Biết nó là một bài topo sort giúp bạn đọc thông báo lỗi của những công cụ này bằng con mắt khác.',
    },
    {
      id: 'py-import-trace',
      title: 'Mô phỏng sys.modules: code cấp module chạy khi nào?',
      en: 'Simulating sys.modules Caching',
      difficulty: 'Medium',
      targetMinutes: 16,
      entry: 'import_trace',
      lang: 'python',
      statement: `
Cho \`graph\` là \`dict\` module → danh sách module nó import (theo đúng thứ tự viết trong file), và
\`sequence\` là danh sách các module mà chương trình chính import lần lượt.

Viết hàm \`import_trace(graph, sequence)\` trả về danh sách tên module theo đúng thứ tự **code cấp module
của chúng thực sự được chạy**, mô phỏng chính xác cơ chế của Python:

1. Khi nạp module \`M\`: nếu \`M\` **đã có trong cache** thì không làm gì cả.
2. Ngược lại, **ghi vào cache TRƯỚC** (đúng như Python đưa module vào \`sys.modules\` trước khi chạy),
   rồi nạp lần lượt từng phụ thuộc của nó, và **cuối cùng** mới tới lượt code của \`M\` chạy.
3. Module không xuất hiện làm khoá trong \`graph\` coi như không có phụ thuộc nào.

**Ví dụ**
- \`graph = {"a": ["b"], "b": []}\`, \`sequence = ["a"]\` → \`["b", "a"]\`
- \`graph = {"a": [], "b": []}\`, \`sequence = ["a", "b", "a"]\` → \`["a", "b"]\` (import lần hai không chạy lại)
- \`graph = {"a": ["b"], "b": ["a"]}\`, \`sequence = ["a"]\` → \`["b", "a"]\` ← **đây là lý do import vòng không treo**
`,
      starter: `def import_trace(graph, sequence):\n    # Trả về thứ tự code cấp module thực sự chạy\n    \n`,
      tests: [
        { args: [{ a: ['b'], b: [] }, ['a']], expected: ['b', 'a'], name: 'Phụ thuộc chạy trước' },
        { args: [{ a: [], b: [] }, ['a', 'b', 'a']], expected: ['a', 'b'], name: 'Import lần hai bị cache chặn' },
        { args: [{ a: ['c'], b: ['c'], c: [] }, ['a', 'b']], expected: ['c', 'a', 'b'], name: 'Phụ thuộc chung chỉ chạy một lần' },
        { args: [{}, []], expected: [], name: 'Không import gì' },
        { args: [{ m: ['u', 'v'], u: [], v: ['u'] }, ['m']], expected: ['u', 'v', 'm'], name: 'Kim cương nhỏ' },
        { args: [{ a: ['b'], b: ['a'] }, ['a']], expected: ['b', 'a'], name: 'Import vòng — bắt đầu từ a' },
        { args: [{ a: ['b'], b: ['a'] }, ['b']], expected: ['a', 'b'], name: 'Import vòng — bắt đầu từ b' },
        { args: [{ app: ['os'] }, ['app']], expected: ['os', 'app'], name: 'Module ngoài graph — không có phụ thuộc' },
        { args: [{ a: ['b', 'c'], b: [], c: ['b'] }, ['a']], expected: ['b', 'c', 'a'], name: 'Thứ tự phụ thuộc được giữ nguyên' },
      ],
      hints: [
        'Dùng đệ quy: hàm `load(m)` lo việc nạp một module, còn vòng lặp ngoài chỉ gọi `load` cho từng phần tử của `sequence`.',
        'Giữ một `set` tên `seen` đóng vai `sys.modules`. Chi tiết quyết định toàn bộ bài: `seen.add(m)` phải nằm **TRƯỚC** vòng lặp nạp các phụ thuộc, không phải sau. Đặt sau sẽ gây đệ quy vô hạn ngay khi gặp import vòng.',
        'Thứ tự append cũng quan trọng: `order.append(m)` nằm **sau** khi đã nạp xong mọi phụ thuộc — vì trong Python thật, các lệnh `import` nằm ở đầu file và phải chạy xong trước phần code còn lại của module.',
      ],
      diagnostics: [
        { test: 'for\\s+dep[\\s\\S]{0,200}?seen\\.add', message: 'Bạn đang thêm module vào `seen` SAU khi nạp phụ thuộc. Với import vòng, module sẽ tự gọi lại chính nó và gây đệ quy vô hạn (RecursionError/timeout). Python đưa module vào `sys.modules` NGAY trước khi chạy code của nó — hãy làm đúng như vậy.' },
        { test: 'order\\.append\\s*\\(\\s*m\\s*\\)[\\s\\S]{0,120}?for\\s+dep', message: 'Bạn ghi nhận module TRƯỚC khi nạp phụ thuộc của nó. Trong Python, các lệnh `import` ở đầu file chạy xong rồi mới tới phần thân module — nên phụ thuộc phải xuất hiện trước trong kết quả.' },
      ],
      approach: `
Bài này biến một câu hỏi thường bị trả lời mơ hồ ("import vòng có bị lặp vô hạn không?") thành thứ bạn
phải cài đặt chính xác.

\`\`\`python
def import_trace(graph, sequence):
    seen = set()      # đóng vai sys.modules
    order = []

    def load(module):
        if module in seen:        # (1) đã nạp -> lấy từ cache, không chạy lại
            return
        seen.add(module)          # (2) ĐÁNH DẤU TRƯỚC khi chạy — mấu chốt
        for dep in graph.get(module, []):
            load(dep)             # (3) các lệnh import ở đầu file chạy trước
        order.append(module)      # (4) rồi mới tới phần thân module

    for module in sequence:
        load(module)
    return order
\`\`\`

**Dòng \`seen.add\` đặt ở đâu quyết định tất cả.** Nếu đặt nó **sau** vòng lặp phụ thuộc, đồ thị \`a → b → a\`
sẽ khiến \`a\` gọi \`b\`, \`b\` gọi lại \`a\`, và vì \`a\` chưa được đánh dấu nên vòng lặp không bao giờ dừng.
Đặt **trước**, ta có đúng hành vi của Python: \`a\` gọi \`b\`, \`b\` gọi \`a\` và nhận về ngay một object
\`a\` **mới nạp một phần** (partially initialized).

Đây chính là lời giải thích cho thông báo lỗi bạn hay gặp:

\`\`\`
ImportError: cannot import name 'X' from partially initialized module 'a'
(most likely due to a circular import)
\`\`\`

Python không treo — nó đưa cho bạn một module còn dang dở. Nếu tên \`X\` chưa kịp được định nghĩa (vì nó
nằm **sau** dòng \`import b\` trong \`a.py\`), bạn nhận lỗi. Từ đó suy ra một mẹo chữa cháy đã trở thành
kinh nghiệm phổ biến: chuyển lệnh import xuống **cuối file** hoặc **vào trong hàm** thì đôi khi hết lỗi —
vì lúc đó tên cần thiết đã kịp tồn tại. Đó là vá triệu chứng; cách chữa gốc vẫn là tách phần dùng chung ra
một module thứ ba.

**Liên hệ với bài trước:** \`import_order\` cho bạn biết dự án **có** import vòng hay không;
\`import_trace\` cho bạn biết Python **xử lý** vòng đó thế nào khi nó đã tồn tại.
`,
      solution: `def import_trace(graph, sequence):
    seen = set()
    order = []

    def load(module):
        if module in seen:
            return
        seen.add(module)
        for dep in graph.get(module, []):
            load(dep)
        order.append(module)

    for module in sequence:
        load(module)

    return order`,
      complexity: {
        question: 'Độ phức tạp thời gian theo số module V và số quan hệ import E?',
        options: [
          'O(V + E) — mỗi module được nạp thật đúng một lần, mỗi cạnh được xét một lần',
          'O(V × E) vì mỗi lần import phải quét lại cache',
          'O(2^V) khi có import vòng',
          'O(V log V)',
        ],
        answer: 0,
        why: 'Đây là DFS có đánh dấu: nhờ `seen` (kiểm tra O(1) trên set), mỗi module chỉ đi vào thân hàm `load` một lần và mỗi cạnh chỉ được duyệt một lần → O(V + E). Chính cơ chế cache này biến việc import từ nguy cơ bùng nổ tổ hợp thành tuyến tính — và cũng là thứ ngăn import vòng gây đệ quy vô hạn.',
      },
      realWorld: 'Hiểu đúng cơ chế này giúp bạn giải thích được: vì sao dòng `print` trong `settings.py` chỉ chạy một lần dù cả chục file import nó; vì sao biến toàn cục trong module trở thành singleton dùng chung toàn ứng dụng (kết nối database, cấu hình, logger); và vì sao đôi khi chuyển một lệnh `import` xuống trong hàm lại làm hết lỗi. Đây cũng là mô hình chung của mọi hệ thống nạp module — kể cả `require`/ESM của JavaScript.',
    },
  ],
},
];
