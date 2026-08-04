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
    {
      q: 'Trong dataclass sau, `b` có trở thành một field không?\n\n@dataclass\nclass P:\n    a: int\n    b = 5',
      options: [
        'Có — b là field với giá trị mặc định 5',
        'Không — thiếu annotation nên b chỉ là thuộc tính class thường, không vào __init__ cũng không vào __eq__',
        'Lỗi khi định nghĩa class',
        'Có, nhưng b là field bắt buộc phải truyền',
      ],
      answer: 1,
      why: '`@dataclass` quét `__annotations__` để tìm field — **không có annotation thì không phải field**. `b = 5` chỉ là thuộc tính class bình thường: không xuất hiện trong `__init__`, không được so sánh trong `__eq__`, không có trong `__repr__`. Bug này im lặng tuyệt đối: `P(1) == P(1)` vẫn `True` ngay cả khi bạn đã gán `p1.b = 99`. Muốn `b` là field thì phải viết `b: int = 5`.',
    },
    {
      q: 'Câu lệnh `isinstance(x, list[int])` cho kết quả gì lúc chạy?',
      options: [
        'True nếu x là list toàn số nguyên',
        'TypeError — không dùng được generic có tham số với isinstance',
        'Luôn True nếu x là list, bất kể kiểu phần tử',
        'False trong mọi trường hợp',
      ],
      answer: 1,
      why: 'Python raise `TypeError: isinstance() argument 2 cannot be a parameterized generic`. Lý do sâu xa: kiểm tra "list này có toàn số nguyên không" là thao tác **O(n)**, và Python từ chối giấu một vòng lặp sau vẻ ngoài của một phép kiểm tra O(1). Điều này khẳng định lại thông điệp cốt lõi của module: type hint dành cho công cụ phân tích tĩnh; lúc chạy bạn chỉ kiểm tra được `isinstance(x, list)` (kiểu gốc), còn phần tử thì phải tự duyệt — hoặc dùng `pydantic`.',
    },
    {
      q: 'Đoạn code sau gặp vấn đề gì?\n\nclass Node:\n    def next_node(self) -> Node:\n        ...',
      options: [
        'Không có vấn đề gì',
        'NameError — tại thời điểm dòng def được chạy, tên Node chưa tồn tại',
        'Chỉ mypy báo lỗi, chạy vẫn bình thường',
        'SyntaxError',
      ],
      answer: 1,
      why: 'Annotation được **tính như một biểu thức bình thường** ngay khi câu lệnh `def` chạy — mà lúc đó class `Node` còn đang được xây, tên của nó chưa gán vào namespace. Ba cách sửa: (1) đặt trong dấu nháy `-> "Node"` (forward reference); (2) thêm `from __future__ import annotations` ở đầu file để mọi annotation trở thành chuỗi, không được tính ngay; (3) dùng `typing.Self` (Python 3.11+). Cách (2) là lựa chọn mặc định tốt cho code mới.',
    },
    {
      q: 'Khai báo `x: Any` khác `x: object` như thế nào đối với công cụ kiểm tra kiểu tĩnh?',
      options: [
        'Không khác gì, chỉ là hai cách viết',
        '`Any` TẮT mọi kiểm tra trên x (làm gì với nó cũng hợp lệ); `object` thì ngược lại — hầu như không làm gì được nếu chưa thu hẹp kiểu',
        '`object` tắt kiểm tra, còn `Any` bắt buộc phải ép kiểu',
        '`Any` chỉ dùng được cho tham số hàm',
      ],
      answer: 1,
      why: 'Hai kiểu này nằm ở hai cực đối lập. `Any` là "cửa thoát hiểm": mypy chấp nhận `x.bat_ky_gi()` và `x + 1` mà không kiểm tra gì — nên rắc `Any` để làm mypy im lặng đồng nghĩa với việc **vô hiệu hoá chính công cụ bạn vừa cài đặt**, và cái tệ nhất là nó lan sang các biến khác. `object` là "tổ tiên chung của mọi kiểu": an toàn thật sự, nhưng bạn phải `isinstance` để thu hẹp trước khi dùng. Khi thật sự nhận dữ liệu bất kỳ, `object` + kiểm tra tường minh mới là lựa chọn đúng.',
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
    {
      id: 'py-runtime-type-check',
      title: 'Kiểm tra kiểu lúc chạy — và bẫy bool là int',
      en: 'Runtime Type Checking',
      difficulty: 'Medium',
      targetMinutes: 14,
      entry: 'check_types',
      lang: 'python',
      statement: `
Viết hàm \`check_types(values, expected)\` nhận hai danh sách cùng độ dài: \`values\` là các giá trị,
\`expected\` là tên kiểu mong đợi tương ứng. Trả về danh sách \`True\`/\`False\` cho từng cặp.

Các tên kiểu được hỗ trợ: \`"int"\`, \`"float"\`, \`"str"\`, \`"bool"\`, \`"list"\`, \`"dict"\`, \`"none"\`.
Tên kiểu không nằm trong danh sách trên → \`False\`.

**Yêu cầu nghiêm ngặt (đây là toàn bộ độ khó của bài):**
- \`True\` là kiểu \`"bool"\`, **không** được tính là \`"int"\`.
- \`1\` là kiểu \`"int"\`, **không** được tính là \`"bool"\`.
- \`2\` **không** được tính là \`"float"\`, và \`1.5\` **không** được tính là \`"int"\`.

**Ví dụ**
- \`check_types([1, "a", True], ["int", "str", "bool"])\` → \`[True, True, True]\`
- \`check_types([True], ["int"])\` → \`[False]\`
`,
      starter: `def check_types(values, expected):\n    # Trả về list True/False cho từng cặp (giá trị, tên kiểu)\n    \n`,
      tests: [
        { args: [[1, 'a', true], ['int', 'str', 'bool']], expected: [true, true, true], name: 'Ba kiểu cơ bản' },
        { args: [[true], ['int']], expected: [false], name: 'bool KHÔNG được tính là int' },
        { args: [[1], ['bool']], expected: [false], name: 'int KHÔNG được tính là bool' },
        { args: [[1.5], ['int']], expected: [false], name: 'float không phải int' },
        { args: [[2], ['float']], expected: [false], name: 'int không phải float' },
        { args: [[1.5], ['float']], expected: [true], name: 'float đúng kiểu' },
        { args: [[null], ['none']], expected: [true], name: 'None' },
        { args: [[null], ['str']], expected: [false], name: 'None không phải str' },
        { args: [[[1, 2], { a: 1 }], ['list', 'dict']], expected: [true, true], name: 'list và dict' },
        { args: [[1], ['so_nguyen']], expected: [false], name: 'Tên kiểu không hỗ trợ' },
        { args: [[], []], expected: [], name: 'Danh sách rỗng' },
        { args: [[false, 0], ['bool', 'int']], expected: [true, true], name: 'False và 0 — hai kiểu khác nhau' },
      ],
      hints: [
        'Với hầu hết kiểu, `isinstance(v, int)`, `isinstance(v, str)`... là đủ. Riêng `None` phải kiểm tra bằng `v is None` chứ không phải `isinstance`.',
        'Bẫy trung tâm: trong Python `bool` là **lớp con của `int`**, nên `isinstance(True, int)` trả về `True`. Để "int" không nhận `True`, bạn phải loại trừ tường minh: `isinstance(v, int) and not isinstance(v, bool)`.',
        'Chiều ngược lại thì đơn giản: `isinstance(1, bool)` vốn đã là `False` (int không phải lớp con của bool), nên `"bool"` chỉ cần `isinstance(v, bool)`. Với `"float"`, dùng `isinstance(v, float)` — số nguyên `2` không phải instance của `float` nên tự động bị loại.',
      ],
      diagnostics: [
        { test: 'type\\s*\\(\\s*\\w+\\s*\\)\\s*==\\s*int', message: 'So sánh `type(v) == int` tình cờ giải đúng bài này (vì nó loại `bool`), nhưng đó là thói quen xấu: nó cũng loại luôn MỌI lớp con hợp lệ khác. Quy ước Python là dùng `isinstance` và loại trừ `bool` một cách tường minh khi cần.' },
        { test: 'isinstance\\s*\\(\\s*\\w+\\s*,\\s*int\\s*\\)(?![\\s\\S]*bool)', message: 'Bạn dùng `isinstance(v, int)` mà không loại trừ `bool`. Vì `bool` là lớp con của `int`, `True` sẽ bị nhận nhầm là số nguyên.' },
        { test: 'isinstance\\s*\\(\\s*\\w+\\s*,\\s*(list|dict)\\s*\\[', message: 'Không dùng được generic có tham số (`list[int]`) với `isinstance` — Python raise `TypeError`. Lúc chạy bạn chỉ kiểm tra được kiểu gốc `list`, phần tử bên trong phải tự duyệt.' },
      ],
      approach: `
Bài này buộc bạn đối mặt với một sự thật lịch sử của Python: **\`bool\` kế thừa từ \`int\`.**

\`\`\`python
isinstance(True, int)     # True   ← bool LÀ một loại int
isinstance(1, bool)       # False  ← nhưng int KHÔNG phải bool
True + True               # 2
sum([True, False, True])  # 2      ← đôi khi rất tiện
\`\`\`

Lý do: Python không có kiểu boolean cho tới phiên bản 2.3; trước đó người ta dùng \`1\`/\`0\`. Khi thêm
\`bool\`, để không phá vỡ hàng loạt code cũ, nó được làm thành **lớp con của \`int\`**. Sự tiện lợi đó
(đếm phần tử đúng bằng \`sum\`) đi kèm cái giá: mọi phép kiểm tra kiểu ngây thơ đều nhận nhầm.

\`\`\`python
def check_types(values, expected):
    def matches(value, name):
        if name == "bool":
            return isinstance(value, bool)
        if name == "int":
            return isinstance(value, int) and not isinstance(value, bool)
        if name == "float":
            return isinstance(value, float)
        if name == "str":
            return isinstance(value, str)
        if name == "list":
            return isinstance(value, list)
        if name == "dict":
            return isinstance(value, dict)
        if name == "none":
            return value is None
        return False

    return [matches(v, n) for v, n in zip(values, expected)]
\`\`\`

**Thứ tự kiểm tra là mấu chốt.** Nếu bạn xử lý \`"int"\` trước mà không loại \`bool\`, thì \`True\` lọt lưới.
Đây chính là lý do quiz của module khuyên: khi phân nhánh theo \`isinstance\` trên một Union chứa cả
\`int\` và \`bool\`, luôn đặt \`bool\` **lên trước**.

**Vì sao \`"float"\` không nhận số nguyên?** Vì \`isinstance(2, float)\` là \`False\` — \`int\` và \`float\` là hai
lớp độc lập, không ai kế thừa ai. Nhưng chú ý: điều này khác với **quy ước của kiểm tra kiểu tĩnh**, nơi
mypy chấp nhận truyền \`int\` vào tham số khai \`float\` (numeric tower). Lại thêm một minh chứng cho thông
điệp lớn của module: **kiểm tra tĩnh và kiểm tra runtime không phải một, và không phải lúc nào cũng đồng ý
với nhau.**

**Trong dự án thật:** đừng tự viết bộ kiểm tra này. Dùng \`pydantic\` — nó xử lý sẵn kiểu lồng nhau, ép
kiểu có kiểm soát, và thông báo lỗi chi tiết theo từng trường. Nhưng biết rõ \`bool\`/\`int\` để đọc hiểu khi
\`pydantic\` phàn nàn ở chế độ \`strict\` thì vẫn cần thiết.
`,
      solution: `def check_types(values, expected):
    def matches(value, name):
        if name == "bool":
            return isinstance(value, bool)
        if name == "int":
            return isinstance(value, int) and not isinstance(value, bool)
        if name == "float":
            return isinstance(value, float)
        if name == "str":
            return isinstance(value, str)
        if name == "list":
            return isinstance(value, list)
        if name == "dict":
            return isinstance(value, dict)
        if name == "none":
            return value is None
        return False

    return [matches(v, n) for v, n in zip(values, expected)]`,
      complexity: {
        question: 'Độ phức tạp thời gian theo số cặp n?',
        options: [
          'O(n) — mỗi cặp tốn một số phép isinstance hằng định',
          'O(n × k) với k là tổng số phần tử bên trong các list/dict được kiểm tra',
          'O(n²)',
          'O(n log n)',
        ],
        answer: 0,
        why: '`isinstance` chỉ tra cứu chuỗi kế thừa của kiểu (độ dài cố định, rất ngắn) nên là O(1); mỗi cặp qua tối đa 7 nhánh `if` → hằng số. Chú ý: nếu đề yêu cầu kiểm tra cả kiểu PHẦN TỬ bên trong list/dict thì độ phức tạp mới thành O(tổng số phần tử) — đúng lý do Python cấm dùng `list[int]` với `isinstance`.',
      },
      realWorld: 'Validate payload API trước khi ghi database, kiểm tra dữ liệu đọc từ JSON/CSV, viết bộ kiểm tra cấu hình lúc khởi động. Bẫy `bool`/`int` gây bug thật rất thường xuyên: một cột "so_luong" nhận `True` thay vì `1` sẽ đi qua mọi lớp kiểm tra và chỉ lộ ra khi báo cáo cuối tháng lệch số.',
    },
    {
      id: 'py-coerce-config-value',
      title: 'Ép kiểu giá trị cấu hình an toàn',
      en: 'Safe Config Coercion',
      difficulty: 'Medium',
      targetMinutes: 14,
      entry: 'coerce',
      lang: 'python',
      statement: `
Mọi giá trị đọc từ biến môi trường hay file cấu hình đều là **chuỗi**. Viết hàm \`coerce(text, target)\`
chuyển chuỗi đó về kiểu mong muốn, trả về \`None\` nếu không chuyển được.

| \`target\` | Quy tắc |
|---|---|
| \`"int"\` | Số nguyên hợp lệ → \`int\`; ngược lại \`None\` (kể cả \`"3.5"\`) |
| \`"float"\` | Số thực hợp lệ → \`float\`; ngược lại \`None\` |
| \`"bool"\` | \`"true"\`, \`"1"\`, \`"yes"\` → \`True\`; \`"false"\`, \`"0"\`, \`"no"\` → \`False\` (**không phân biệt hoa thường**); mọi giá trị khác → \`None\` |
| \`"str"\` | Trả về nguyên chuỗi |
| khác | \`None\` |

**Ví dụ**
- \`coerce("42", "int")\` → \`42\`
- \`coerce("False", "bool")\` → \`False\` ← không phải \`True\`!
- \`coerce("3.5", "int")\` → \`None\`
- \`coerce("0", "int")\` → \`0\` (giá trị hợp lệ, **không** phải \`None\`)
`,
      starter: `def coerce(text, target):\n    # Chuyển chuỗi cấu hình về kiểu target, None nếu không hợp lệ\n    \n`,
      tests: [
        { args: ['42', 'int'], expected: 42, name: 'Số nguyên' },
        { args: ['0', 'int'], expected: 0, name: 'Số 0 — hợp lệ, không phải None' },
        { args: ['-7', 'int'], expected: -7, name: 'Số âm' },
        { args: ['3.5', 'int'], expected: null, name: '"3.5" không phải số nguyên' },
        { args: ['abc', 'int'], expected: null, name: 'Chuỗi không phải số' },
        { args: ['3.5', 'float'], expected: 3.5, name: 'Số thực' },
        { args: ['False', 'bool'], expected: false, name: 'Bẫy lớn nhất: bool("False") là True' },
        { args: ['true', 'bool'], expected: true, name: 'true viết thường' },
        { args: ['YES', 'bool'], expected: true, name: 'Không phân biệt hoa thường' },
        { args: ['0', 'bool'], expected: false, name: 'Chuỗi "0" là False' },
        { args: ['maybe', 'bool'], expected: null, name: 'Giá trị bool không nhận diện được' },
        { args: ['', 'bool'], expected: null, name: 'Chuỗi rỗng' },
        { args: ['hello', 'str'], expected: 'hello', name: 'Giữ nguyên chuỗi' },
        { args: ['5', 'so_nguyen'], expected: null, name: 'Tên kiểu không hỗ trợ' },
      ],
      hints: [
        'Với `"int"` và `"float"`: dùng `try: return int(text) except ValueError: return None` — đây là EAFP, gọn hơn nhiều so với tự viết regex kiểm tra định dạng số.',
        'Bẫy chí mạng ở `"bool"`: **đừng bao giờ dùng `bool(text)`**. Mọi chuỗi không rỗng đều truthy, nên `bool("False")`, `bool("0")`, `bool("no")` đều trả về `True`. Phải so khớp với tập giá trị đã định nghĩa.',
        'Chuẩn hoá trước khi so khớp: `t = text.strip().lower()`, rồi `if t in ("true", "1", "yes"): return True`. Nhớ kiểm tra nhánh `False` riêng, và trả `None` cho mọi giá trị còn lại.',
      ],
      diagnostics: [
        { test: 'bool\\s*\\(\\s*text\\s*\\)', message: '`bool("False")` trả về `True`! Trong Python, MỌI chuỗi không rỗng đều truthy — kể cả `"False"`, `"0"`, `"no"`. Đây là bug cấu hình kinh điển (tắt một tính năng bằng `DEBUG=False` mà nó vẫn bật). Phải so khớp chuỗi với danh sách giá trị hợp lệ.' },
        { test: 'int\\s*\\(\\s*float\\s*\\(', message: '`int(float("3.5"))` cho `3` — nhưng đề yêu cầu `"3.5"` KHÔNG phải số nguyên hợp lệ và phải trả `None`. Ép kiểu âm thầm làm mất dữ liệu là điều tệ nhất một hàm cấu hình có thể làm.' },
        { test: 'except\\s*:\\s*$|except\\s+Exception', message: 'Hãy bắt đúng loại lỗi mà `int()`/`float()` ném ra: `ValueError` (và `TypeError` nếu đầu vào có thể không phải chuỗi). `except:` trần sẽ che luôn lỗi lập trình của chính bạn.' },
      ],
      approach: `
Đây là bài về **ranh giới giữa dữ liệu chuỗi bên ngoài và dữ liệu có kiểu bên trong** — nơi mọi hệ thống
đều phải có một lớp chuyển đổi, và cũng là nơi bug hay ẩn nấp nhất.

\`\`\`python
def coerce(text, target):
    if target == "str":
        return text
    if target == "int":
        try:
            return int(text)
        except ValueError:
            return None
    if target == "float":
        try:
            return float(text)
        except ValueError:
            return None
    if target == "bool":
        t = text.strip().lower()
        if t in ("true", "1", "yes"):
            return True
        if t in ("false", "0", "no"):
            return False
        return None
    return None
\`\`\`

**Bẫy \`bool("False")\` đáng để dừng lại suy nghĩ.** Hàm dựng \`bool()\` không "phân tích" chuỗi — nó hỏi
"object này có truthy không?". Mọi chuỗi không rỗng đều truthy, nên:

\`\`\`python
bool("False")   # True
bool("0")       # True
bool("")        # False  ← trường hợp DUY NHẤT cho False
\`\`\`

Hệ quả trong thực tế: \`DEBUG = bool(os.environ.get("DEBUG", ""))\` với \`DEBUG=False\` trong file \`.env\` sẽ
**bật** chế độ debug trên production. Đây là bug có thật, lặp đi lặp lại ở vô số dự án, và là lý do
Django/pydantic đều có hàm chuyển đổi bool riêng thay vì dùng \`bool()\`.

**Vì sao \`"3.5"\` phải bị từ chối khi target là \`"int"\`?** Vì \`int("3.5")\` raise \`ValueError\` — Python
cố tình **không** tự cắt phần thập phân khi phân tích chuỗi (khác với \`int(3.5)\` trên số, cho \`3\`). Nếu
bạn "sửa" bằng \`int(float(text))\`, bạn đang âm thầm biến cấu hình \`timeout=1.9\` thành \`1\` mà không ai
biết. Một hàm ép kiểu tốt phải **từ chối rõ ràng** thay vì đoán ý người dùng.

**Vì sao trả \`None\` chứ không raise?** Đây là lựa chọn thiết kế phù hợp cho lớp cấu hình: người gọi
thường muốn "không hợp lệ thì dùng giá trị mặc định". Nhưng hãy chú ý hệ quả — người gọi phải kiểm tra
bằng \`is None\`, không được viết \`value or default\`, vì \`0\` và \`False\` là kết quả hợp lệ và cũng falsy.
`,
      solution: `def coerce(text, target):
    if target == "str":
        return text

    if target == "int":
        try:
            return int(text)
        except (ValueError, TypeError):
            return None

    if target == "float":
        try:
            return float(text)
        except (ValueError, TypeError):
            return None

    if target == "bool":
        t = text.strip().lower()
        if t in ("true", "1", "yes"):
            return True
        if t in ("false", "0", "no"):
            return False
        return None

    return None`,
      complexity: {
        question: 'Độ phức tạp thời gian theo độ dài chuỗi n?',
        options: [
          'O(n) — phân tích số hay so khớp chuỗi đều phải đọc qua từng ký tự',
          'O(1) vì chỉ có vài lệnh if',
          'O(n²)',
          'O(log n) vì int() dùng chia đôi',
        ],
        answer: 0,
        why: '`int(text)` phải duyệt từng chữ số để dựng số, `text.lower()` tạo chuỗi mới O(n), và so khớp `in (...)` với vài chuỗi cố định cũng tuyến tính theo độ dài. Tất cả đều O(n) với n rất nhỏ trong thực tế — chi phí này hoàn toàn không đáng lo, khác hẳn với cái giá của một lần đọc sai cấu hình.',
      },
      realWorld: 'Đọc biến môi trường (`os.environ` luôn trả chuỗi), tham số dòng lệnh, giá trị từ file `.env`/`.ini`, và query string của HTTP request — tất cả đều là chuỗi. Đây chính xác là công việc mà `pydantic-settings`, `django-environ`, hay `python-decouple` làm cho bạn; và bẫy `bool("False")` là lý do đầu tiên khiến những thư viện đó tồn tại.',
    },
  ],
},
];
