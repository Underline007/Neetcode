/**
 * LỘ TRÌNH PYTHON — MODULE 11: Type Hints & Kiểm tra kiểu tĩnh
 */

export default [
/* ==================================================================== */
{
  id: 'py-typing',
  name: 'Type Hints & Kiểm tra kiểu tĩnh',
  en: 'Type Hints & Static Type Checking',
  icon: '🏷️',
  summary: 'Điểm khác biệt quan trọng nhất cần hiểu: type hint trong Python là TÀI LIỆU (metadata), KHÔNG được trình thông dịch enforce lúc chạy — khác hẳn TypeScript. Muốn kiểm tra thật, cần công cụ ngoài (mypy) hoặc tự viết validation.',
  lesson: `
## 1. Vấn đề gốc

Python là ngôn ngữ **kiểu động** — không khai báo kiểu vẫn chạy được, và điều này KHÔNG đổi dù bạn có viết
type hint hay không. Vậy type hint để làm gì? Trả lời đúng bản chất: **type hint là TÀI LIỆU có cấu trúc**
giúp con người (và IDE) hiểu một hàm mong đợi kiểu dữ liệu gì, KHÔNG phải một cơ chế ép buộc kiểu như nhiều
người mới học lầm tưởng.

## 2. So sánh nhanh JS ↔ Python — điểm khác biệt CỐT LÕI

| | TypeScript | Python type hint |
|---|---|---|
| Kiểm tra khi nào | Lúc **biên dịch** (compile-time), chặn build nếu sai kiểu | Chỉ khi bạn CHỦ ĐỘNG chạy công cụ ngoài (\`mypy\`, \`pyright\`) — **không tự động** |
| Ảnh hưởng lúc chạy chương trình | Bị "xoá" hoàn toàn sau khi biên dịch ra JS (không tồn tại lúc runtime) | Cũng không ảnh hưởng runtime — nhưng vẫn tồn tại dưới dạng metadata (\`__annotations__\`), có thể đọc lại bằng code |
| Viết sai kiểu | Trình biên dịch chặn lại | Chương trình **VẪN CHẠY BÌNH THƯỜNG**, không có lỗi nào tự động xảy ra |
| Ai "enforce" kiểu thật sự lúc runtime | Không ai — TS cũng chỉ là static | Không ai, TRỪ KHI bạn dùng thư viện chuyên biệt như \`pydantic\` (tự validate lúc runtime dựa trên hint) |

**Đây là điều quan trọng nhất của cả module này:** viết \`def f(x: int) -> int:\` rồi gọi \`f("chuỗi")\` sẽ
**KHÔNG** tự động báo lỗi — Python interpreter hoàn toàn bỏ qua annotation khi thực thi. Hint chỉ hữu ích khi
có công cụ khác (mypy/pyright, hoặc chính bạn tự đọc code) dùng tới nó.

## 3. Ý tưởng cốt lõi: cú pháp và các kiểu hay dùng

\`\`\`python
def greet(name: str, age: int = 18) -> str:
    return f"{name}, {age} tuổi"

x: int = 5                       # annotate biến thường (ít dùng hơn annotate hàm)

from typing import Optional, Union

def find_user(uid: int) -> Optional[dict]:      # Optional[X] = Union[X, None] — "X hoặc None"
    ...

def parse(value: Union[int, str]) -> int:        # value có thể là int HOẶC str
    ...

# Từ Python 3.10+: viết gọn Union bằng dấu |, không cần import
def parse2(value: int | str) -> int: ...
def find_user2(uid: int) -> dict | None: ...     # tương đương Optional[dict]

# Từ Python 3.9+: dùng thẳng list/dict built-in làm generic, không cần typing.List/typing.Dict
def total(nums: list[int]) -> int: ...
def lookup(table: dict[str, int]) -> int: ...
\`\`\`

**\`Optional[X]\` nghĩa là "giá trị có thể là X, hoặc có thể là \`None\`"** — KHÔNG có nghĩa "tham số này có
giá trị mặc định". Đây là hai khái niệm độc lập: một tham số có thể có default value (\`age: int = 18\`) mà
không cần \`Optional\`, và một tham số có thể \`Optional[int]\` (chấp nhận \`None\`) mà vẫn bắt buộc phải
truyền vào (không có default).

## 4. Dấu hiệu nhận biết

| Thấy trong đề bài | Nghĩ tới |
|---|---|
| "hàm có thể trả về None nếu không tìm thấy" | kiểu trả về nên annotate \`Optional[X]\`/\`X \\| None\` |
| "tham số chấp nhận nhiều kiểu khác nhau" | \`Union[A, B]\`/\`A \\| B\`, và code XỬ LÝ TỪNG TRƯỜNG HỢP bằng \`isinstance\` (hint không tự phân nhánh code cho bạn) |
| "muốn IDE gợi ý đúng phương thức của tham số" | annotate kiểu tham số càng cụ thể càng tốt, tránh \`Any\` nếu không cần thiết |
| "cần đảm bảo dữ liệu ĐÚNG kiểu lúc runtime (ví dụ validate JSON từ API)" | type hint KHÔNG đủ — cần tự viết \`isinstance\` check, hoặc dùng thư viện validate như \`pydantic\` |
| "định nghĩa 'hình dạng' cố định cho một dict" | \`TypedDict\` (vẫn chỉ là hint tĩnh, không tự validate runtime) |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
from typing import Optional, Union, Any

# (a) Optional — rất hay dùng cho hàm "tìm kiếm, có thể không thấy"
def find(items: list[int], target: int) -> Optional[int]:
    for i, x in enumerate(items):
        if x == target:
            return i
    return None

# (b) Union + xử lý runtime bằng isinstance (hint không thay thế việc kiểm tra)
def to_text(value: int | float | str) -> str:
    if isinstance(value, str):
        return value
    if isinstance(value, bool):        # LƯU Ý: kiểm tra bool TRƯỚC int (xem mục Bẫy)
        return "true" if value else "false"
    if isinstance(value, int):
        return f"số nguyên {value}"
    return f"số thực {value:.2f}"

# (c) Any — khi thực sự không muốn/không thể ràng buộc kiểu
def log_anything(value: Any) -> None:
    print(value)

# (d) Type alias — đặt tên cho một kiểu phức tạp hay lặp lại
UserRecord = dict[str, str | int]
def save(record: UserRecord) -> None: ...
\`\`\`

## 6. Bẫy thường gặp

- **Tưởng type hint tự validate lúc runtime**: \`def f(x: int):\` rồi gọi \`f("abc")\` sẽ chạy BÌNH THƯỜNG,
  không raise \`TypeError\` nào cả — annotation chỉ là "lời hứa", không phải "kiểm tra". Muốn kiểm tra thật,
  hoặc chạy \`mypy\` trước khi merge code, hoặc tự viết \`isinstance\`, hoặc dùng thư viện như \`pydantic\`.
- **\`isinstance(x, int)\` cũng đúng khi \`x\` là \`bool\`**: vì \`bool\` là **lớp con** của \`int\` trong Python
  (\`True == 1\`, \`False == 0\`) — nếu code phân nhánh theo kiểu mà không kiểm tra \`bool\` TRƯỚC \`int\`, giá
  trị \`True\`/\`False\` sẽ vô tình rơi vào nhánh xử lý số nguyên.
- **Nhầm \`Optional[X]\` với "tham số không bắt buộc"**: \`Optional[int]\` chỉ nói "giá trị có thể là \`None\`",
  không tự tạo default value — muốn tham số có thể bỏ qua khi gọi hàm vẫn phải viết \`= None\` tường minh:
  \`def f(x: Optional[int] = None):\`.
- **Type hint tham chiếu tới một class được định nghĩa SAU nó trong cùng file (forward reference)**: gây
  lỗi \`NameError\` nếu viết trực tiếp; giải pháp là viết kiểu dưới dạng CHUỖI (\`def f(x: "MyClass"): ...\`)
  hoặc thêm \`from __future__ import annotations\` ở đầu file để hoãn việc đánh giá toàn bộ annotation.

## 7. Ứng dụng thực tế

- **\`mypy\`/\`pyright\` chạy trong CI pipeline**: bắt được cả một lớp lỗi (truyền sai kiểu, quên xử lý
  \`None\`) TRƯỚC khi code chạy thật, mà không cần viết thêm test — nhiều team lớn coi đây là bước bắt buộc
  trước khi merge.
- **IDE autocomplete chính xác hơn nhiều**: gõ \`user.\` sau khi annotate \`user: User\` sẽ gợi ý đúng các
  thuộc tính/phương thức của \`User\`, thay vì không gợi ý được gì (do không biết kiểu).
- **\`pydantic\`/FastAPI dùng type hint để validate THẬT lúc runtime**: khác với type hint thuần (chỉ tĩnh),
  các thư viện này ĐỌC annotation và tự sinh code kiểm tra kiểu khi nhận dữ liệu từ request HTTP — đây là
  trường hợp hiếm hoi type hint có ảnh hưởng runtime thực sự, nhưng là nhờ THƯ VIỆN chủ động làm việc đó,
  không phải bản thân Python interpreter.
`,
  quiz: [
    {
      q: 'Viết `def f(x: int) -> int:` rồi gọi `f("chuỗi")` (truyền sai kiểu) sẽ xảy ra điều gì khi chạy chương trình Python bình thường (không dùng thêm công cụ nào khác)?',
      options: [
        'Python tự động raise `TypeError` ngay lập tức vì kiểu không khớp annotation',
        'Chương trình vẫn chạy bình thường — annotation chỉ là metadata, Python interpreter KHÔNG tự kiểm tra kiểu tại runtime; lỗi (nếu có) chỉ xảy ra khi code bên trong `f` thực sự làm điều gì đó không hợp với kiểu chuỗi',
        'Python sẽ tự động chuyển đổi `"chuỗi"` thành số nguyên nếu có thể',
        'Chương trình báo lỗi cú pháp (SyntaxError) ngay khi định nghĩa hàm',
      ],
      answer: 1,
      why: 'Đây là điểm khác biệt quan trọng nhất so với TypeScript: type hint của Python không được interpreter enforce. Muốn phát hiện lỗi kiểu này, phải chạy công cụ static type checker riêng (mypy/pyright) hoặc tự viết kiểm tra runtime.',
    },
    {
      q: '`Optional[int]` trong type hint có ý nghĩa gì?',
      options: [
        'Tham số đó KHÔNG BẮT BUỘC phải truyền khi gọi hàm (có thể bỏ qua)',
        'Giá trị có thể là `int`, HOẶC có thể là `None` — đây là ý nghĩa DUY NHẤT của `Optional`, không liên quan tới việc tham số có bắt buộc truyền hay không (muốn có default value vẫn phải viết `= None` tường minh)',
        'Kiểu dữ liệu sẽ được Python tự động kiểm tra và raise lỗi nếu không phải int hoặc None',
        'Tương đương với `Any`, chấp nhận mọi kiểu dữ liệu',
      ],
      answer: 1,
      why: '`Optional[X]` là viết tắt của `Union[X, None]` — chỉ mô tả "giá trị hợp lệ có thể là gì", hoàn toàn tách biệt với việc tham số có default value hay không. Hai khái niệm dễ bị nhầm lẫn với nhau vì thường đi cùng nhau trong thực tế, nhưng về ngữ nghĩa là độc lập.',
    },
    {
      q: 'Vì sao khi dùng `isinstance` để phân nhánh xử lý theo kiểu Union (ví dụ `int | str`), cần kiểm tra `isinstance(x, bool)` TRƯỚC `isinstance(x, int)`?',
      options: [
        'Không cần thiết, thứ tự không quan trọng',
        '`bool` là LỚP CON của `int` trong Python — `isinstance(True, int)` trả về `True`, nên nếu kiểm tra `int` trước, giá trị `True`/`False` sẽ vô tình rơi vào nhánh xử lý dành cho số nguyên thường',
        'Vì `bool` luôn được kiểm tra sau cùng theo quy ước PEP 8',
        '`isinstance` không hoạt động được với kiểu `bool`',
      ],
      answer: 1,
      why: 'Đây là một chi tiết dễ gây bug: do lịch sử thiết kế, `bool` kế thừa từ `int` trong Python. Nếu logic phân nhánh theo kiểu cần xử lý `bool` khác với `int` thường, phải đặt điều kiện kiểm tra `bool` lên TRƯỚC để tránh bị "nuốt" bởi nhánh `int`.',
    },
    {
      q: 'Đâu là cách CHÍNH XÁC để đảm bảo dữ liệu nhận từ một API bên ngoài THỰC SỰ đúng kiểu đã khai báo (kiểm tra thật lúc runtime, không chỉ là tài liệu tĩnh)?',
      options: [
        'Chỉ cần viết type hint đầy đủ cho hàm xử lý dữ liệu đó là đủ, Python sẽ tự lo phần còn lại',
        'Type hint thuần không đủ để validate runtime — cần tự viết kiểm tra bằng `isinstance`/logic tường minh, hoặc dùng thư viện chuyên validate dựa trên type hint như `pydantic`',
        'Dùng `typing.TypedDict` là đủ để Python tự raise lỗi khi dữ liệu sai cấu trúc',
        'Chuyển toàn bộ type hint thành comment để Python tự kiểm tra khi parse file',
      ],
      answer: 1,
      why: '`TypedDict`, `Optional`, `Union`... đều CHỈ LÀ hint tĩnh, không có cơ chế runtime nào tự kiểm tra chúng. Muốn validate dữ liệu thật (ví dụ dữ liệu không đáng tin từ bên ngoài), phải tự viết logic kiểm tra, hoặc dùng thư viện như `pydantic` — thư viện này đọc chính các type hint bạn viết để SINH RA code validate thật.',
    },
    {
      q: 'Từ Python 3.10 trở lên, cú pháp `int | str` trong type hint có ý nghĩa tương đương với gì?',
      options: [
        'Phép toán bitwise OR giữa hai kiểu, trả về một kiểu mới',
        '`typing.Union[int, str]` — cú pháp viết gọn hơn cho "kiểu int HOẶC str", không cần import `Union` từ module `typing`',
        'Kiểu giao (intersection) — giá trị phải thoả mãn ĐỒNG THỜI cả hai kiểu int và str',
        'Cú pháp này không hợp lệ, chỉ dùng được với `Union[int, str]` viết đầy đủ',
      ],
      answer: 1,
      why: 'PEP 604 (Python 3.10+) cho phép dùng dấu `|` để biểu diễn Union ngay trong cú pháp annotation, giúp code ngắn gọn hơn và không cần `from typing import Union` — về ý nghĩa hoàn toàn tương đương `Union[int, str]`.',
    },
  ],
  problems: [
    {
      id: 'py-parse-optional-int',
      title: 'Parse số nguyên có thể vắng mặt',
      en: 'Parse Optional Int',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'parse_optional_int',
      lang: 'python',
      statement: `
Viết hàm \`parse_optional_int(raw)\`, với kiểu ý nghĩa là \`(raw: str | None) -> int | None\`:
- Nếu \`raw\` là \`None\` → trả về \`None\`.
- Nếu \`raw\` là chuỗi số nguyên hợp lệ (có thể có dấu \`-\` ở đầu) → trả về số nguyên tương ứng.
- Nếu \`raw\` là chuỗi **không** parse được thành số nguyên → trả về \`None\` (không để chương trình crash).

**Ví dụ**
- \`parse_optional_int(None)\` → \`None\`
- \`parse_optional_int("42")\` → \`42\`
- \`parse_optional_int("-7")\` → \`-7\`
- \`parse_optional_int("abc")\` → \`None\`
`,
      starter: `from typing import Optional\n\ndef parse_optional_int(raw: Optional[str]) -> Optional[int]:\n    # None -> None. Chuoi so hop le -> int. Chuoi khong hop le -> None (khong crash)\n    \n`,
      tests: [
        { args: [null], expected: null, name: 'Đầu vào None -> None' },
        { args: ['42'], expected: 42, name: 'Chuỗi số dương hợp lệ' },
        { args: ['-7'], expected: -7, name: 'Chuỗi số âm hợp lệ' },
        { args: ['abc'], expected: null, name: 'Chuỗi không hợp lệ -> None' },
        { args: ['3.14'], expected: null, name: 'Số thực dạng chuỗi không phải số nguyên hợp lệ -> None' },
        { args: ['0'], expected: 0, name: 'Chuỗi "0" hợp lệ' },
      ],
      hints: [
        'Kiểm tra `raw is None` TRƯỚC TIÊN — trả về `None` ngay nếu đúng, không cần thử parse gì cả.',
        'Nếu `raw` không phải `None`, thử `int(raw)` trong khối `try`. `int()` tự xử lý dấu `-` ở đầu, nên không cần tự viết logic kiểm tra dấu âm riêng.',
        'Bọc `int(raw)` trong `try/except ValueError: return None` — mẫu EAFP quen thuộc đã học ở module Ngoại lệ, áp dụng lại ở đây cho trường hợp `raw` không phải `None` nhưng cũng không phải số hợp lệ.',
      ],
      diagnostics: [
        { test: 'raw\\.isdigit\\s*\\(\\s*\\)', message: '`"−7".isdigit()` trả về `False` (dấu `-` không phải chữ số) dù `-7` là số nguyên hợp lệ — dùng `int(raw)` trong try/except thay vì `isdigit()` để xử lý đúng cả số âm.' },
      ],
      approach: `
Bài này là bản kết hợp của hai bài học trước: kiểm tra \`None\` TRƯỚC (module Cú pháp nền tảng) và EAFP khi
parse số (module Ngoại lệ) — đúng ý nghĩa kiểu \`Optional[str] -> Optional[int]\` mô tả: đầu vào CÓ THỂ vắng
mặt (\`None\`), và việc parse CÓ THỂ thất bại (cũng dẫn tới \`None\`).

\`\`\`python
from typing import Optional

def parse_optional_int(raw: Optional[str]) -> Optional[int]:
    if raw is None:
        return None
    try:
        return int(raw)
    except ValueError:
        return None
\`\`\`

**Lưu ý quan trọng về bản chất**: dòng \`raw: Optional[str]\` chỉ là TÀI LIỆU cho người đọc/IDE — Python
KHÔNG tự kiểm tra người gọi có thực sự truyền đúng \`str\` hay \`None\` hay không. Logic \`if raw is None:\`
bên trong thân hàm mới là phần THỰC SỰ xử lý trường hợp \`None\`, chứ bản thân annotation không "tự làm" gì
cả lúc chương trình chạy.
`,
      solution: `from typing import Optional

def parse_optional_int(raw: Optional[str]) -> Optional[int]:
    if raw is None:
        return None
    try:
        return int(raw)
    except ValueError:
        return None`,
      complexity: {
        question: 'Độ phức tạp thời gian của `parse_optional_int` theo độ dài n của raw?',
        options: ['O(1)', 'O(n) — chuyển đổi chuỗi thành số nguyên cần xét qua từng chữ số của chuỗi', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: '`int(raw)` cần duyệt qua từng ký tự của chuỗi để xây dựng số nguyên tương ứng, nên chi phí tỉ lệ thuận với độ dài chuỗi đầu vào.',
      },
      realWorld: 'Parse tham số truy vấn URL (query string) như `?page=2` — giá trị `page` khi không được truyền sẽ là `None`, khi được truyền lại luôn ở dạng chuỗi và có thể do người dùng gõ tay sai định dạng; hàm kiểu này là lớp phòng thủ đầu tiên trước khi dữ liệu đi sâu vào logic nghiệp vụ.',
    },
    {
      id: 'py-union-stringify',
      title: 'Định dạng chuỗi theo từng loại kiểu (Union dispatch)',
      en: 'Stringify by Union Type',
      difficulty: 'Medium',
      targetMinutes: 10,
      entry: 'stringify',
      lang: 'python',
      statement: `
Viết hàm \`stringify(value)\`, với kiểu ý nghĩa \`(value: int | float | str | None) -> str\`, trả về:
- \`"không có giá trị"\` nếu \`value is None\`
- \`f"số nguyên: {value}"\` nếu \`value\` là \`int\`
- \`f"số thực: {value}"\` nếu \`value\` là \`float\`
- \`f"chuỗi: {value}"\` nếu \`value\` là \`str\`

**Ví dụ**
- \`stringify(None)\` → \`"không có giá trị"\`
- \`stringify(42)\` → \`"số nguyên: 42"\`
- \`stringify(3.14)\` → \`"số thực: 3.14"\`
- \`stringify("hi")\` → \`"chuỗi: hi"\`
`,
      starter: `def stringify(value):\n    # None -> "khong co gia tri", int -> "so nguyen: ...", float -> "so thuc: ...", str -> "chuoi: ..."\n    \n`,
      tests: [
        { args: [null], expected: 'không có giá trị', name: 'None' },
        { args: [42], expected: 'số nguyên: 42', name: 'int dương' },
        { args: [-5], expected: 'số nguyên: -5', name: 'int âm' },
        { args: [3.14], expected: 'số thực: 3.14', name: 'float' },
        { args: ['hi'], expected: 'chuỗi: hi', name: 'str' },
        { args: [0], expected: 'số nguyên: 0', name: 'int bằng 0 (không phải None hay falsy-bug)' },
      ],
      hints: [
        'Kiểu \`Union\` trong type hint chỉ MÔ TẢ các kiểu có thể có — bản thân Python không tự phân nhánh xử lý cho bạn, bạn vẫn cần tự viết `if`/`isinstance` để kiểm tra runtime.',
        'Kiểm tra `value is None` trước tiên. Sau đó dùng `isinstance(value, str)`, `isinstance(value, float)`, `isinstance(value, int)` theo đúng thứ tự — nhưng chú ý các kiểu này không chồng lấn nhau ở đây (không có `bool` trong bài) nên thứ tự `int`/`float` không quan trọng.',
        'Cẩn thận KHÔNG dùng `if value:` để kiểm tra "có giá trị hay không" — `value = 0` là falsy nhưng vẫn là một số nguyên hợp lệ 0, không phải None. Luôn kiểm tra `value is None` một cách tường minh.',
      ],
      diagnostics: [
        { test: 'if\\s+not\\s+value\\s*:|if\\s+value\\s*:', message: 'Kiểm tra `if value:`/`if not value:` sẽ coi `0` là falsy giống `None` — dẫn tới xử lý SAI cho trường hợp `stringify(0)`. Hãy kiểm tra tường minh `value is None`.' },
      ],
      approach: `
Bài này minh hoạ đúng thông điệp cốt lõi của module: **type hint Union chỉ là tài liệu — bạn vẫn phải tự
viết logic phân nhánh runtime bằng \`isinstance\`/\`is None\`**, Python không "tự động" làm việc đó.

\`\`\`python
def stringify(value):
    if value is None:
        return "không có giá trị"
    if isinstance(value, str):
        return f"chuỗi: {value}"
    if isinstance(value, float):
        return f"số thực: {value}"
    return f"số nguyên: {value}"
\`\`\`

**Vì sao kiểm tra \`value is None\` chứ không phải \`if not value:\`?** Vì \`0\` (một số nguyên hợp lệ) cũng
là falsy trong Python — nếu dùng \`if not value:\`, \`stringify(0)\` sẽ SAI bị coi như "không có giá trị".
Đây chính là bẫy "falsy không đồng nghĩa với None" đã học từ module Cú pháp nền tảng, xuất hiện lại ở đây
dưới một hình hài khác: type hint \`Optional\`/\`Union\` không tự nhắc bạn tránh bẫy này — kỷ luật viết code
kiểm tra đúng vẫn hoàn toàn thuộc về người lập trình.
`,
      solution: `def stringify(value):
    if value is None:
        return "không có giá trị"
    if isinstance(value, str):
        return f"chuỗi: {value}"
    if isinstance(value, float):
        return f"số thực: {value}"
    return f"số nguyên: {value}"`,
      complexity: {
        question: 'Độ phức tạp thời gian của `stringify`?',
        options: ['O(1) — tối đa vài lần kiểm tra isinstance và tạo một chuỗi ngắn, không phụ thuộc kích thước input lớn', 'O(n) theo độ dài value', 'O(log n)', 'O(n²)'],
        answer: 0,
        why: 'Số lần kiểm tra `isinstance` là cố định (tối đa 3 lần), và việc tạo f-string với một giá trị đơn lẻ là thao tác chi phí không đổi.',
      },
      realWorld: 'Định dạng log/hiển thị cho một trường dữ liệu có thể mang nhiều kiểu khác nhau (ví dụ giá trị cấu hình đọc từ file có thể là số, chuỗi, hoặc thiếu hẳn) — một mẫu hay gặp khi xây dựng công cụ debug/dashboard hiển thị dữ liệu không đồng nhất.',
    },
    {
      id: 'py-valid-user-record',
      title: 'Validate cấu trúc dict theo "TypedDict" thủ công',
      en: 'Validate User Record (Manual TypedDict Check)',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'is_valid_user_record',
      lang: 'python',
      statement: `
Giả sử bạn định nghĩa kiểu (chỉ mang tính tài liệu, không tự validate runtime):

\`\`\`python
class UserRecord(TypedDict):
    name: str
    age: int
\`\`\`

Viết hàm \`is_valid_user_record(record)\` **tự kiểm tra thật** (vì \`TypedDict\` KHÔNG tự làm việc này lúc
runtime) xem \`record\` có đúng là một \`UserRecord\` hợp lệ hay không:
- Phải là \`dict\` với **đúng chính xác 2 khoá**: \`"name"\` và \`"age"\` (không thiếu, không thừa khoá khác).
- \`record["name"]\` phải là \`str\`.
- \`record["age"]\` phải là \`int\` **và không âm** (\`>= 0\`).

Trả về \`True\`/\`False\`.

**Ví dụ**
- \`is_valid_user_record({"name": "An", "age": 20})\` → \`True\`
- \`is_valid_user_record({"name": "An", "age": "20"})\` → \`False\` (age là chuỗi, không phải int)
- \`is_valid_user_record({"name": "An"})\` → \`False\` (thiếu khoá "age")
`,
      starter: `def is_valid_user_record(record):\n    # dict dung 2 khoa "name" (str) va "age" (int >= 0) -> True, nguoc lai False\n    \n`,
      tests: [
        { args: [{ name: 'An', age: 20 }], expected: true, name: 'Hợp lệ' },
        { args: [{ name: 'An', age: '20' }], expected: false, name: 'age là chuỗi, không phải int' },
        { args: [{ name: 'An' }], expected: false, name: 'Thiếu khoá "age"' },
        { args: [{ name: 'An', age: 20, extra: 1 }], expected: false, name: 'Thừa khoá "extra"' },
        { args: [{ name: 123, age: 20 }], expected: false, name: 'name không phải str' },
        { args: [{ name: 'An', age: -1 }], expected: false, name: 'age âm, không hợp lệ' },
      ],
      hints: [
        'Kiểm tra `record` là `dict` và `set(record.keys()) == {"name", "age"}` — cách này đảm bảo vừa không thiếu vừa không thừa khoá nào so với đúng 2 khoá yêu cầu.',
        'Kiểm tra kiểu: `isinstance(record.get("name"), str)` và `isinstance(record.get("age"), int)`.',
        'Cẩn thận bẫy `bool` là lớp con của `int`: nếu muốn chặt chẽ, có thể thêm `not isinstance(record.get("age"), bool)` trước khi kiểm tra `isinstance(..., int)` — dù đề bài không có test riêng cho trường hợp này, đây là điểm cần lưu ý khi áp dụng vào thực tế. Cuối cùng kiểm tra `record["age"] >= 0`.',
      ],
      diagnostics: [
        { test: 'len\\s*\\(\\s*record\\s*\\)\\s*==\\s*2(?!.*keys)', message: 'Chỉ kiểm tra `len(record) == 2` không đảm bảo ĐÚNG 2 khoá là "name" và "age" — record có thể có 2 khoá HOÀN TOÀN KHÁC (ví dụ "foo", "bar") và vẫn qua được kiểm tra độ dài. Hãy so sánh trực tiếp tập hợp khoá: `set(record.keys()) == {"name", "age"}`.' },
      ],
      approach: `
Bài này là ví dụ rõ nhất cho thông điệp cốt lõi: **\`TypedDict\` (và mọi type hint khác) không tự validate
lúc runtime — muốn kiểm tra dữ liệu THẬT SỰ đúng cấu trúc, bạn phải tự viết hàm như thế này**, hoặc dùng một
thư viện chuyên biệt (\`pydantic\`) tự sinh ra logic tương tự dựa trên chính các type hint bạn khai báo.

\`\`\`python
def is_valid_user_record(record):
    if not isinstance(record, dict):
        return False
    if set(record.keys()) != {"name", "age"}:
        return False
    if not isinstance(record.get("name"), str):
        return False
    age = record.get("age")
    if not isinstance(age, int) or isinstance(age, bool):
        return False
    return age >= 0
\`\`\`

**Vì sao so sánh \`set(record.keys()) != {"name", "age"}\` thay vì chỉ kiểm tra \`"name" in record and "age"
in record\`?** Vì cách kiểm tra thứ hai chỉ đảm bảo 2 khoá đó CÓ MẶT, nhưng không loại trừ việc \`record\` có
THÊM các khoá khác ngoài dự kiến (ví dụ do dữ liệu từ nguồn không đáng tin gửi thừa trường). So sánh trực
tiếp hai tập hợp (\`set\`) đảm bảo khớp CHÍNH XÁC, không thiếu không thừa — đúng tinh thần "cấu trúc cố định"
mà \`TypedDict\` muốn mô tả (dù bản thân \`TypedDict\` không ép được điều này, hàm của bạn mới là nơi thực thi
thật).
`,
      solution: `def is_valid_user_record(record):
    if not isinstance(record, dict):
        return False
    if set(record.keys()) != {"name", "age"}:
        return False
    if not isinstance(record.get("name"), str):
        return False
    age = record.get("age")
    if not isinstance(age, int) or isinstance(age, bool):
        return False
    return age >= 0`,
      complexity: {
        question: 'Độ phức tạp thời gian của `is_valid_user_record` theo số khoá k trong record?',
        options: ['O(1) bất kể k', 'O(k) — xây dựng `set(record.keys())` và so sánh cần duyệt qua toàn bộ khoá hiện có của record', 'O(k²)', 'O(k log k)'],
        answer: 1,
        why: 'Việc tạo tập hợp từ `record.keys()` phải duyệt qua tất cả k khoá hiện có trong dict, nên chi phí tỉ lệ thuận với số khoá — dù trong bài này k thường nhỏ và cố định về mặt ý nghĩa (2 khoá), thuật toán tổng quát vẫn là O(k).',
      },
      realWorld: 'Validate payload JSON nhận từ client trước khi lưu vào database — đây chính xác là công việc mà `pydantic`/`FastAPI` tự động hoá dựa trên type hint bạn khai báo, giúp bạn không phải tự viết tay từng hàm `is_valid_xxx` như bài này cho mọi loại dữ liệu trong hệ thống lớn.',
    },
  ],
},
];
