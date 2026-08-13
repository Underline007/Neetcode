/**
 * BÀI LUYỆN CÚ PHÁP — MODULE 11..15
 *   11. py-typing            12. py-stdlib           13. py-testing
 *   14. py-advanced-oop      15. py-concurrency-performance
 *
 * Xem drills.js để biết cách các bài này được ghép vào module.
 */

/* ==================================================================== */
/* MODULE 11 — py-typing                                                 */
/* ==================================================================== */
const PY_TYPING = [
  {
    id: 'py-drill-optional-first',
    title: 'Optional và bẫy giá trị falsy',
    en: 'Optional and the Falsy Trap',
    difficulty: 'Easy',
    targetMinutes: 7,
    entry: 'first_or_none',
    lang: 'python',
    statement: `
Viết hàm \`first_or_none(items)\` trả về phần tử **đầu tiên** của danh sách, hoặc \`None\` nếu danh
sách rỗng. Hãy viết cả **chú thích kiểu**:

\`\`\`python
def first_or_none(items: list) -> Optional[int]:
\`\`\`

**Ví dụ**
- \`first_or_none([1, 2])\` → \`1\`
- \`first_or_none([])\` → \`None\`
- \`first_or_none([0])\` → \`0\` ← **không** phải \`None\`

> Bẫy của bài: \`0\`, \`False\`, \`""\` và \`[]\` đều là giá trị *falsy*. Nếu kiểm tra sai chỗ, phần tử
> đầu bằng \`0\` sẽ bị trả về thành \`None\`.
`,
    starter: `from typing import Optional\n\n\ndef first_or_none(items: list) -> Optional[int]:\n    # Tra ve phan tu dau, hoac None neu rong\n    \n`,
    tests: [
      { args: [[1, 2]], expected: 1, name: 'Danh sách thường' },
      { args: [[]], expected: null, name: 'Danh sách rỗng' },
      { args: [['a']], expected: 'a', name: 'Phần tử là chuỗi' },
      { args: [[0]], expected: 0, name: 'Phần tử đầu bằng 0 — bẫy falsy' },
      { args: [[false, true]], expected: false, name: 'Phần tử đầu là False' },
      { args: [['']], expected: '', name: 'Phần tử đầu là chuỗi rỗng' },
    ],
    hints: [
      'Điều kiện phải xét **danh sách** có rỗng hay không, không xét **giá trị** của phần tử: `if not items: return None`.',
      '`items[0]` chỉ an toàn sau khi đã chắc danh sách không rỗng — nếu không sẽ `IndexError`.',
      '`Optional[int]` nghĩa là "int hoặc None", viết tắt của `Union[int, None]`. Từ Python 3.10 có thể viết `int | None`. Chú thích kiểu **không** ảnh hưởng lúc chạy — Python không tự kiểm tra gì.',
    ],
    diagnostics: [
      { test: 'if\\s+items\\s*\\[\\s*0\\s*\\]', message: 'Đang kiểm tra GIÁ TRỊ của phần tử đầu — với `[0]` hoặc `[False]` điều kiện sẽ sai và hàm trả về `None`. Phải kiểm tra danh sách: `if not items:`.' },
      { test: 'return\\s+items\\s*\\[\\s*0\\s*\\]\\s+if\\s+items\\s*\\[\\s*0\\s*\\]', message: 'Cùng lỗi trên, viết dưới dạng biểu thức điều kiện: điều kiện phải là `if items`, không phải `if items[0]`.' },
      { test: 'len\\s*\\(\\s*items\\s*\\)\\s*>\\s*0', message: '`len(items) > 0` chạy đúng, nhưng người Python viết `if items:` — ngắn hơn và hoạt động với mọi thứ đếm được (chuỗi, dict, set).' },
    ],
    approach: `
**Lời giải**

\`\`\`python
from typing import Optional

def first_or_none(items: list) -> Optional[int]:
    if not items:
        return None
    return items[0]
\`\`\`

**Chú thích kiểu đọc thế nào?**

\`\`\`python
def f(items: list) -> Optional[int]:
#          ▲              ▲
#          |              └── kiểu GIÁ TRỊ TRẢ VỀ (sau dấu ->)
#          └───────────────── kiểu tham số (sau dấu :)
\`\`\`

- \`Optional[int]\` = \`Union[int, None]\` = (Python 3.10+) \`int | None\`.
- Chú thích **không được kiểm tra lúc chạy**: \`first_or_none("abc")\` vẫn chạy bình thường. Chúng
  dành cho người đọc và cho công cụ kiểm tra tĩnh (mypy, Pyright) — chạy riêng, trước khi chương
  trình chạy.

**Vì sao \`Optional\` là kiểu đáng ngại nhất?**

Vì nó buộc **mọi** nơi dùng giá trị phải xử lý trường hợp \`None\`:

\`\`\`python
x = first_or_none(nums)
print(x + 1)          # nếu x là None -> TypeError
if x is not None:     # đúng cách
    print(x + 1)
\`\`\`

Công cụ như mypy sẽ báo lỗi ngay ở dòng \`x + 1\` — đó chính là giá trị của việc ghi \`Optional\`:
nó biến một lỗi lúc chạy thành một lỗi thấy được trước khi chạy.

**Bẫy falsy — bài học chính của bài này**

Những giá trị sau đều **falsy** (bị coi như \`False\` trong \`if\`):

\`\`\`python
0    0.0    ""    []    {}    set()    None    False
\`\`\`

Nên hai điều kiện dưới đây **khác nhau hoàn toàn**:

\`\`\`python
if not items:        # danh sách RỖNG
if not items[0]:     # phần tử đầu là 0 / "" / False / None
\`\`\`

Và đây là lý do quy tắc "kiểm tra \`None\` phải dùng \`is None\`" tồn tại:

\`\`\`python
if x is None:        # đúng: chỉ bắt None
if not x:            # sai: bắt cả 0, "", [], False
\`\`\`

Lỗi này rất hay xảy ra với giá trị số thật: số lượng hàng bằng 0, số dư bằng 0, giảm giá 0% — tất
cả đều là dữ liệu hợp lệ nhưng bị code xử lý như "không có dữ liệu".
`,
    solution: `from typing import Optional


def first_or_none(items: list) -> Optional[int]:
    if not items:
        return None
    return items[0]`,
    complexity: {
      question: 'Chú thích kiểu (`: list`, `-> Optional[int]`) làm chương trình chạy chậm đi bao nhiêu?',
      options: [
        'Gần như không — chúng chỉ được lưu lại dưới dạng dữ liệu, không kiểm tra gì lúc chạy',
        'Chậm gấp đôi vì Python phải kiểm tra kiểu mỗi lời gọi',
        'O(n) theo số phần tử vì phải kiểm tra kiểu từng phần tử',
        'Chậm hơn chỉ khi dùng Optional',
      ],
      answer: 0,
      why: 'Python lưu chú thích vào `f.__annotations__` và không kiểm tra gì lúc chạy. Chi phí duy nhất là lúc định nghĩa hàm (dựng đối tượng chú thích) — không có chi phí cho mỗi lời gọi. Muốn kiểm tra thật thì phải dùng công cụ ngoài (mypy) hoặc thư viện như Pydantic.',
    },
    realWorld: 'Hàm "tìm kiếm có thể không thấy" xuất hiện khắp nơi: `dict.get()`, truy vấn database trả về một bản ghi, tìm người dùng theo email. Ghi rõ `Optional` trong chữ ký là cách bạn nói với người gọi (và với mypy) rằng "phải xử lý trường hợp không có" — thay vì để họ phát hiện bằng một `AttributeError: NoneType` lúc 2 giờ sáng.',
  },
  {
    id: 'py-drill-optional-default-tags',
    title: 'Dùng Optional thay cho mặc định mutable',
    en: 'Optional Instead of Mutable Default',
    difficulty: 'Easy',
    targetMinutes: 8,
    entry: 'add_tag',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    lan_1 = fn(args[0])
    lan_2 = fn(args[1])
    co_san = fn(args[2], ["cu"])
    return [lan_1, lan_2, co_san]`,
    statement: `
Viết hàm \`add_tag(tag, tags=None)\` thêm một thẻ vào danh sách và trả về danh sách đó:

- gọi **không** truyền \`tags\` → tạo danh sách MỚI chỉ chứa thẻ vừa thêm
- gọi **có** truyền \`tags\` → thêm vào chính danh sách đó

Chữ ký phải là \`tags: Optional[list] = None\` — **không** được viết \`tags: list = []\`.

**Ví dụ**

\`\`\`python
add_tag("a")            # ["a"]
add_tag("b")            # ["b"]   ← KHÔNG phải ["a", "b"]
add_tag("c", ["cu"])    # ["cu", "c"]
\`\`\`
`,
    starter: `from typing import Optional\n\n\ndef add_tag(tag: str, tags: Optional[list] = None) -> list:\n    # tags la None thi tao danh sach moi\n    \n`,
    tests: [
      { args: ['a', 'b', 'c'], expected: [['a'], ['b'], ['cu', 'c']], name: 'Hai lần gọi độc lập' },
      { args: ['x', 'y', 'z'], expected: [['x'], ['y'], ['cu', 'z']], name: 'Thẻ khác' },
      { args: ['1', '2', '3'], expected: [['1'], ['2'], ['cu', '3']], name: 'Thẻ là chuỗi số' },
      { args: ['', '', ''], expected: [[''], [''], ['cu', '']], name: 'Thẻ rỗng' },
      { args: ['p', 'q', 'r'], expected: [['p'], ['q'], ['cu', 'r']], name: 'Ba thẻ khác nhau' },
    ],
    hints: [
      '`None` là giá trị mặc định **an toàn** vì nó bất biến — không thể bị sửa và mang sang lần gọi sau.',
      'Dòng đầu thân hàm: `if tags is None: tags = []`. Dùng `is None`, không dùng `if not tags` — vì một danh sách rỗng do người gọi truyền vào là dữ liệu hợp lệ, không được thay bằng danh sách khác.',
      'Sau đó `tags.append(tag)` rồi `return tags` cho cả hai trường hợp.',
    ],
    diagnostics: [
      { test: 'tags\\s*:\\s*list\\s*=\\s*\\[\\s*\\]|tags\\s*=\\s*\\[\\s*\\]', message: 'Đây đúng là bẫy bài này muốn tránh: `tags=[]` chỉ được tạo MỘT lần lúc định nghĩa hàm, nên mọi lời gọi dùng chung một danh sách và thẻ cứ tích luỹ lại. Dùng `tags=None`.' },
      { test: 'if\\s+not\\s+tags\\s*:', message: '`if not tags` cũng đúng với danh sách RỖNG do người gọi truyền vào — bạn sẽ thay danh sách của họ bằng một danh sách khác, và thẻ họ mong thấy trong biến của họ sẽ không xuất hiện. Dùng `if tags is None`.' },
      { test: 'return\\s+tags\\s*\\+\\s*\\[', message: '`tags + [tag]` tạo danh sách MỚI nên trường hợp "truyền danh sách có sẵn" sẽ không thêm được vào danh sách của người gọi. Đề yêu cầu thêm vào chính danh sách đó — dùng `append`.' },
    ],
    approach: `
**Lời giải**

\`\`\`python
from typing import Optional

def add_tag(tag: str, tags: Optional[list] = None) -> list:
    if tags is None:
        tags = []
    tags.append(tag)
    return tags
\`\`\`

**Vì sao \`tags=[]\` sai?**

Giá trị mặc định được tính **một lần duy nhất**, lúc câu lệnh \`def\` chạy (thường là lúc import
module) — không phải mỗi lần gọi hàm. Nên danh sách đó là **một** đối tượng dùng chung:

\`\`\`python
def add_tag(tag, tags=[]):      # ĐỪNG
    tags.append(tag)
    return tags

add_tag("a")    # ['a']
add_tag("b")    # ['a', 'b']  (!)
add_tag.__defaults__            # (['a', 'b'],) — bằng chứng: nó nằm trong chính hàm
\`\`\`

Quy tắc không cần suy nghĩ: **giá trị mặc định phải bất biến** — số, chuỗi, tuple, \`None\`,
\`frozenset\`. Cần list/dict/set thì dùng \`None\` rồi tạo trong thân hàm.

**Vì sao \`is None\` mà không phải \`not tags\`?**

Đây là chỗ tinh tế và là điểm khác biệt giữa "chạy được" và "đúng":

\`\`\`python
cua_toi = []
add_tag("a", cua_toi)
print(cua_toi)      # với \`is None\`:  ['a']  ← đúng, ta thêm vào danh sách của họ
                     # với \`not tags\`: []     ← sai, ta đã tự tạo danh sách khác
\`\`\`

\`None\` nghĩa là "người gọi **không cung cấp**". Danh sách rỗng nghĩa là "người gọi cung cấp một
danh sách, hiện đang rỗng". Hai chuyện khác nhau, và \`not tags\` xoá mất khác biệt đó.

**Ghi chú về thiết kế: hàm này có tác dụng phụ**

Khi được truyền danh sách, hàm **sửa dữ liệu của người gọi**. Đó là chủ ý của đề, nhưng trong code
thật hãy chọn rõ một trong hai kiểu và ghi vào tên hàm:

- Sửa tại chỗ, trả \`None\` — như \`list.append()\`, \`list.sort()\`.
- Không sửa gì, trả về bản mới — như \`sorted()\`, \`str.upper()\`.

Kiểu "vừa sửa vừa trả về" (như bài này) dễ gây ngộ nhận cho người đọc: \`moi = add_tag("a", cu)\` làm
người ta tưởng \`cu\` không đổi.

**Chú thích kiểu tương ứng**

\`Optional[list] = None\` là cách chuẩn: kiểu nói "có thể là list, có thể là None", còn giá trị mặc
định nói "mặc định là None". mypy sẽ báo lỗi nếu bạn viết \`tags: list = None\`.
`,
    solution: `from typing import Optional


def add_tag(tag: str, tags: Optional[list] = None) -> list:
    if tags is None:
        tags = []
    tags.append(tag)
    return tags`,
    complexity: {
      question: 'Độ phức tạp thời gian của một lời gọi `add_tag`?',
      options: [
        'O(1) khấu trừ (amortized) — `append` thỉnh thoảng phải cấp phát lại vùng nhớ nhưng trung bình là hằng số',
        'O(n) vì phải copy danh sách',
        'O(n) theo số lần hàm đã được gọi',
        'O(log n)',
      ],
      answer: 0,
      why: 'Danh sách Python cấp phát dư chỗ, nên `append` thường chỉ ghi vào ô trống có sẵn — O(1). Khi hết chỗ, nó cấp phát vùng lớn hơn và copy (O(n)), nhưng vì kích thước tăng theo tỉ lệ nên chi phí trung bình mỗi `append` vẫn là hằng số. Lưu ý phương án "O(n) vì phải copy" chỉ đúng nếu bạn viết `tags + [tag]`.',
    },
    realWorld: 'Bẫy mặc định mutable là câu hỏi phỏng vấn Python phổ biến nhất, và cũng là bug thật: một hàm tích luỹ danh sách lỗi qua nhiều request, một cache "riêng" hoá ra dùng chung giữa các người dùng. Khuôn `x=None` rồi `if x is None` xuất hiện trong gần như mọi thư viện Python bạn sẽ đọc.',
  },
  {
    id: 'py-length-of-union',
    title: 'Thu hẹp kiểu với isinstance',
    en: 'Narrowing a Union Type',
    difficulty: 'Medium',
    targetMinutes: 12,
    entry: 'length_of',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    try:
        return fn(args[0])
    except TypeError:
        return "TypeError"`,
    statement: `
Viết hàm \`length_of(value)\` nhận một giá trị thuộc \`Union[str, list, dict, None]\` và trả về "độ dài":

- \`None\` → \`0\`
- \`str\`, \`list\`, \`dict\` → \`len(value)\`
- kiểu khác (kể cả \`bool\`) → \`raise TypeError\`

Bài chấm bắt \`TypeError\` và so với chuỗi \`"TypeError"\`.

**Ví dụ**
- \`length_of("abc")\` → \`3\`
- \`length_of(None)\` → \`0\`
- \`length_of(5)\` → \`TypeError\`
`,
    starter: `from typing import Union\n\n\ndef length_of(value: Union[str, list, dict, None]) -> int:\n    # None -> 0; str/list/dict -> len; con lai -> raise TypeError\n    \n`,
    tests: [
      { args: ['abc'], expected: 3, name: 'Chuỗi' },
      { args: [[1, 2]], expected: 2, name: 'Danh sách' },
      { args: [{ a: 1 }], expected: 1, name: 'Dict — đếm số khoá' },
      { args: [null], expected: 0, name: 'None → 0' },
      { args: [''], expected: 0, name: 'Chuỗi rỗng → 0 (không phải None)' },
      { args: [[]], expected: 0, name: 'Danh sách rỗng' },
      { args: [5], expected: 'TypeError', name: 'Số — không hỗ trợ' },
      { args: [true], expected: 'TypeError', name: 'bool — cũng không hỗ trợ' },
    ],
    hints: [
      'Xét `None` trước bằng `if value is None: return 0` — vì `len(None)` sẽ raise `TypeError` với thông điệp khó hiểu.',
      '`isinstance(value, (str, list, dict))` kiểm tra một lần cho cả ba kiểu. Sau nhánh này, bạn (và mypy) biết chắc `value` có `len()`.',
      'Nhánh cuối là `raise TypeError(...)`. Nhớ `bool` **không** thuộc `(str, list, dict)` nên nó tự động rơi vào nhánh này — không cần xử lý riêng.',
    ],
    diagnostics: [
      { test: 'if\\s+not\\s+value\\s*:\\s*\\n\\s*return\\s+0', message: '`if not value: return 0` gộp cả `None`, `""`, `[]`, `{}` và cả `0` vào một nhánh — nên `length_of(0)` sẽ trả về 0 thay vì raise `TypeError`. Xét riêng `value is None`.' },
      { test: 'except\\s+TypeError', message: 'Đừng bắt `TypeError` trong hàm này — đề yêu cầu hàm PHÁT RA lỗi đó cho người gọi. Việc bắt là của bộ chấm.' },
      { test: 'type\\s*\\(\\s*value\\s*\\)\\s*in', message: '`type(value) in (str, list, dict)` bỏ mất các lớp con (ví dụ `collections.OrderedDict` là lớp con của `dict`). Dùng `isinstance` để nhận cả lớp con — trừ khi bạn cố ý loại, như trường hợp `bool`.' },
    ],
    approach: `
**"Thu hẹp kiểu" (type narrowing) là gì?**

Khi tham số có kiểu \`Union[...]\`, bạn chưa biết nó là kiểu nào, nên chưa được dùng những thao tác
chỉ có ở một kiểu. Mỗi lần kiểm tra bằng \`isinstance\` hay \`is None\`, phạm vi kiểu **hẹp lại** —
cả với người đọc và với mypy:

\`\`\`python
from typing import Union

def length_of(value: Union[str, list, dict, None]) -> int:
    if value is None:
        return 0                      # ở đây value chắc chắn là None
    if isinstance(value, (str, list, dict)):
        return len(value)             # ở đây value chắc chắn có len()
    raise TypeError("khong ho tro kieu " + type(value).__name__)
\`\`\`

mypy hiểu được luồng này: sau \`if value is None: return\`, nó biết ở các dòng sau \`value\` không thể
là \`None\` nữa — nên không còn cảnh báo "None không có len()".

**Thứ tự các nhánh là bắt buộc, không phải sở thích**

Nếu để \`isinstance\` trước rồi mới xét \`None\`, kết quả vẫn đúng ở bài này. Nhưng nếu gộp \`None\`
vào nhánh falsy chung thì sai ngay:

\`\`\`python
if not value:
    return 0        # bắt cả 0, "" và [] -> length_of(0) trả về 0, đáng lẽ phải lỗi
\`\`\`

Lại là bẫy falsy. Đây là lý do trong code có nhiều kiểu, người ta luôn dùng \`is None\` cho \`None\` và
\`isinstance\` cho kiểu — không dùng "tính đúng/sai" của giá trị.

**Vì sao \`bool\` bị loại một cách tự nhiên?**

\`bool\` là lớp con của \`int\`, mà \`int\` không nằm trong \`(str, list, dict)\` → rơi xuống nhánh
\`raise\`. Nhưng hãy nhớ điều ngược lại từ module 7: nếu bạn viết \`isinstance(value, int)\` thì
\`True\` **sẽ** khớp. Quy tắc để thuộc: \`bool\` khớp với \`int\`, không khớp với gì khác.

**Thông điệp lỗi nên nói ra kiểu nhận được**

\`type(value).__name__\` cho \`'int'\`, \`'bool'\`, \`'set'\`... Người đọc log sẽ biết ngay dữ liệu vào là
gì. So sánh hai thông điệp:

\`\`\`
TypeError: khong ho tro kieu int          ← của bạn, rõ ràng
TypeError: object of type 'int' has no len()   ← của Python, không nói bạn đang ở đâu
\`\`\`

**Union viết ngắn:** từ Python 3.10, \`Union[str, list, dict, None]\` viết được thành
\`str | list | dict | None\`. Hai cách tương đương; cách mới đọc gọn hơn và không cần import.
`,
    solution: `from typing import Union


def length_of(value: Union[str, list, dict, None]) -> int:
    if value is None:
        return 0
    if isinstance(value, (str, list, dict)):
        return len(value)
    raise TypeError("khong ho tro kieu " + type(value).__name__)`,
    complexity: {
      question: 'Độ phức tạp thời gian của hàm này?',
      options: [
        'O(1) — `len()` của str/list/dict là hằng số vì độ dài được lưu sẵn',
        'O(n) vì `len()` phải đếm từng phần tử',
        'O(n) chỉ với dict',
        'O(log n)',
      ],
      answer: 0,
      why: 'Các kiểu dựng sẵn của Python lưu sẵn số phần tử, nên `len()` chỉ là đọc một con số — O(1). Cả `isinstance` cũng là hằng số. (Với generator thì không có `len()` chính vì nó không biết trước độ dài.)',
    },
    realWorld: 'Hàm nhận nhiều kiểu đầu vào rất phổ biến ở lớp biên: tham số API có thể là chuỗi hoặc danh sách, cấu hình có thể là giá trị đơn hoặc mảng. Khuôn "is None → isinstance → raise" là cách viết an toàn: mọi kiểu ngoài dự kiến đều lộ ra ngay thay vì bị xử lý sai một cách im lặng.',
  },
  {
    id: 'py-coerce-record',
    title: 'Đổi kiểu cả bản ghi theo khai báo',
    en: 'Coerce a Record by Spec',
    difficulty: 'Medium',
    targetMinutes: 16,
    entry: 'coerce_record',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    try:
        return fn(*args)
    except ValueError as e:
        return "ValueError"`,
    statement: `
Dữ liệu đọc từ form/CSV luôn là **chuỗi**. Viết hàm \`coerce_record(spec, raw)\` đổi kiểu theo bản
khai báo:

- \`spec\` là dict \`{tên_field: tên_kiểu}\` với tên kiểu thuộc \`"int"\`, \`"float"\`, \`"bool"\`, \`"str"\`
- \`raw\` là dict \`{tên_field: giá trị chuỗi}\`
- field có trong \`spec\` nhưng **thiếu** trong \`raw\` → bỏ qua (không xuất hiện trong kết quả)
- \`"bool"\`: các chuỗi \`"true"\`, \`"1"\`, \`"yes"\` (không phân biệt hoa thường, bỏ khoảng trắng) →
  \`True\`; còn lại → \`False\`
- tên kiểu không hỗ trợ → \`raise ValueError\`

**Ví dụ**

\`\`\`python
coerce_record({"tuoi": "int"}, {"tuoi": "20"})     # {"tuoi": 20}
coerce_record({"ok": "bool"}, {"ok": "0"})         # {"ok": False}
coerce_record({"a": "date"}, {"a": "x"})           # ValueError
\`\`\`
`,
    starter: `def coerce_record(spec: dict, raw: dict) -> dict:\n    # Doi kieu tung field theo spec\n    \n`,
    tests: [
      { args: [{ tuoi: 'int' }, { tuoi: '20' }], expected: { tuoi: 20 }, name: 'Đổi sang int' },
      { args: [{ gia: 'float' }, { gia: '1.5' }], expected: { gia: 1.5 }, name: 'Đổi sang float' },
      { args: [{ ok: 'bool' }, { ok: 'true' }], expected: { ok: true }, name: 'bool: "true" → True' },
      { args: [{ ok: 'bool' }, { ok: '0' }], expected: { ok: false }, name: 'bool: "0" → False' },
      { args: [{ ok: 'bool' }, { ok: ' YES ' }], expected: { ok: true }, name: 'bool: có khoảng trắng và chữ hoa' },
      { args: [{ ten: 'str' }, { ten: 'An' }], expected: { ten: 'An' }, name: 'Giữ nguyên chuỗi' },
      { args: [{ a: 'int', b: 'int' }, { a: '1' }], expected: { a: 1 }, name: 'Thiếu field trong raw — bỏ qua' },
      { args: [{}, { a: '1' }], expected: {}, name: 'spec rỗng — không lấy gì' },
      { args: [{ a: 'date' }, { a: 'x' }], expected: 'ValueError', name: 'Kiểu không hỗ trợ' },
      { args: [{ tuoi: 'int' }, { tuoi: 'abc' }], expected: 'ValueError', name: 'Giá trị không đổi được sang int' },
    ],
    hints: [
      'Duyệt theo `spec` (không phải theo `raw`), vì `spec` là nơi khai báo field nào cần lấy: `for field, kieu in spec.items()`.',
      'Bỏ qua field thiếu bằng `if field not in raw: continue`.',
      'Với `"bool"`, không được dùng `bool(gia_tri)` — chuỗi `"0"` là chuỗi KHÔNG rỗng nên `bool("0")` ra `True`. Phải so danh sách chuỗi được coi là đúng: `str(gia_tri).strip().lower() in ("true", "1", "yes")`.',
    ],
    diagnostics: [
      { test: 'bool\\s*\\(\\s*gia_tri\\s*\\)|bool\\s*\\(\\s*raw', message: '`bool("0")` là `True` vì chuỗi `"0"` không rỗng — đây là bẫy kinh điển khi đọc cấu hình. Phải so nội dung chuỗi, không đổi kiểu trực tiếp.' },
      { test: 'for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+raw\\.items', message: 'Duyệt theo `raw` sẽ lấy cả những field không được khai báo trong `spec`, và không biết đổi chúng sang kiểu gì. `spec` mới là nguồn sự thật.' },
      { test: 'eval\\s*\\(', message: 'Đừng dùng `eval` để đổi kiểu — nó chạy mọi thứ người dùng gửi tới, đây là lỗ hổng thực thi mã. Hãy khớp tên kiểu bằng các nhánh `if` như đề.' },
    ],
    approach: `
**Khuôn "phân phối theo tên kiểu"**

\`\`\`python
def coerce_record(spec: dict, raw: dict) -> dict:
    ket_qua = {}
    for field, kieu in spec.items():
        if field not in raw:
            continue
        gia_tri = raw[field]

        if kieu == "int":
            ket_qua[field] = int(gia_tri)
        elif kieu == "float":
            ket_qua[field] = float(gia_tri)
        elif kieu == "bool":
            ket_qua[field] = str(gia_tri).strip().lower() in ("true", "1", "yes")
        elif kieu == "str":
            ket_qua[field] = str(gia_tri)
        else:
            raise ValueError("kieu khong ho tro: " + kieu)

    return ket_qua
\`\`\`

**Vì sao duyệt \`spec\` chứ không duyệt \`raw\`?**

\`spec\` là **hợp đồng**: nó nói field nào tồn tại và mang kiểu gì. Duyệt \`raw\` (dữ liệu người dùng
gửi) nghĩa là để dữ liệu quyết định cấu trúc — thừa field lạ, thiếu kiểu để đổi, và mở đường cho
*mass assignment*: người dùng gửi thêm \`{"is_admin": "true"}\` và bạn ngoan ngoãn đưa vào bản ghi.
Nguyên tắc: **lặp theo khai báo, tra cứu vào dữ liệu**.

**Bẫy \`bool("0")\`**

\`\`\`python
bool("0")       # True  (!)  chuỗi không rỗng là truthy
bool("false")   # True  (!)
bool("")        # False
\`\`\`

Với chuỗi, \`bool()\` chỉ trả lời "có ký tự nào không", chứ không hiểu nội dung. Đây là nguyên nhân
thật của những sự cố kiểu "tắt tính năng trong config mà nó vẫn bật": \`DEBUG=false\` đọc từ biến môi
trường rồi \`bool("false")\` ra \`True\`. Bắt buộc phải so danh sách giá trị được coi là đúng.

**\`in ("true", "1", "yes")\` trả về gì?** Chính là \`True\`/\`False\` — nên gán thẳng kết quả biểu
thức, không cần \`if/else\`.

**Vì sao để \`int()\` tự raise?**

\`int("abc")\` raise \`ValueError\` — **cùng loại lỗi** ta dùng cho "kiểu không hỗ trợ", nên người gọi
chỉ cần một khối \`except ValueError\` cho cả hai tình huống "dữ liệu sai" và "khai báo sai". Nếu
muốn phân biệt, hãy tạo cây lỗi riêng như module 7:
\`class SpecError(ValueError)\` và \`class DataError(ValueError)\`.

**Cách viết gọn hơn khi số kiểu tăng lên: bảng phân phối**

\`\`\`python
def to_bool(v):
    return str(v).strip().lower() in ("true", "1", "yes")

BANG = {"int": int, "float": float, "bool": to_bool, "str": str}

def coerce_record(spec, raw):
    ket_qua = {}
    for field, kieu in spec.items():
        if field not in raw:
            continue
        if kieu not in BANG:
            raise ValueError("kieu khong ho tro: " + kieu)
        ket_qua[field] = BANG[kieu](raw[field])
    return ket_qua
\`\`\`

Đây là mẫu hình **dict thay cho chuỗi if/elif**: hàm là giá trị nên lưu được trong dict, và thêm
kiểu mới chỉ là thêm một dòng vào bảng. Dùng cách này khi số nhánh còn tăng; giữ \`if/elif\` khi mỗi
nhánh có logic riêng dài.
`,
    solution: `def coerce_record(spec: dict, raw: dict) -> dict:
    ket_qua = {}
    for field, kieu in spec.items():
        if field not in raw:
            continue
        gia_tri = raw[field]

        if kieu == "int":
            ket_qua[field] = int(gia_tri)
        elif kieu == "float":
            ket_qua[field] = float(gia_tri)
        elif kieu == "bool":
            ket_qua[field] = str(gia_tri).strip().lower() in ("true", "1", "yes")
        elif kieu == "str":
            ket_qua[field] = str(gia_tri)
        else:
            raise ValueError("kieu khong ho tro: " + kieu)

    return ket_qua`,
    complexity: {
      question: 'Với spec có f field, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(f) cộng chi phí đổi kiểu từng giá trị — tra dict là O(1) trung bình',
        'O(f²) vì phải đối chiếu spec với raw',
        'O(f · k) với k là số kiểu được hỗ trợ',
        'O(1)',
      ],
      answer: 0,
      why: 'Mỗi field được xử lý một lần; `field not in raw` và `raw[field]` đều là O(1) trung bình nhờ bảng băm. Chuỗi `if/elif` chỉ thử tối đa 4 nhánh — hằng số. Chi phí còn lại là đọc từng ký tự của giá trị khi gọi `int()`/`float()`.',
    },
    realWorld: 'Đây là lõi của mọi thư viện xác thực dữ liệu (Pydantic, attrs, dataclass + converters) và của mọi bộ đọc cấu hình. Bẫy `bool("false")` là một trong những lỗi cấu hình tốn thời gian nhất trong thực tế — vì code không lỗi, chỉ là tính năng bật/tắt sai.',
  },
];

/* ==================================================================== */
/* MODULE 12 — py-stdlib                                                 */
/* ==================================================================== */
const PY_STDLIB = [
  {
    id: 'py-drill-counter-top',
    title: 'Từ xuất hiện nhiều nhất với Counter',
    en: 'Most Common Word with Counter',
    difficulty: 'Easy',
    targetMinutes: 8,
    entry: 'top_word',
    lang: 'python',
    statement: `
Viết hàm \`top_word(text)\` trả về từ xuất hiện **nhiều nhất** trong văn bản:

- không phân biệt hoa thường (đưa hết về chữ thường)
- từ được tách theo khoảng trắng
- **bằng số lần** thì lấy từ nhỏ hơn theo thứ tự chữ cái
- văn bản không có từ nào → \`None\`

**Ví dụ**
- \`top_word("a b a")\` → \`"a"\`
- \`top_word("a b")\` → \`"a"\` (bằng nhau, lấy theo alphabet)
- \`top_word("")\` → \`None\`
`,
    starter: `from collections import Counter\n\n\ndef top_word(text):\n    # Tra ve tu xuat hien nhieu nhat\n    \n`,
    tests: [
      { args: ['a b a'], expected: 'a', name: 'Một từ trội hơn' },
      { args: ['a b'], expected: 'a', name: 'Bằng nhau — lấy theo alphabet' },
      { args: [''], expected: null, name: 'Văn bản rỗng' },
      { args: ['   '], expected: null, name: 'Chỉ có khoảng trắng' },
      { args: ['b b a a c'], expected: 'a', name: 'Hai từ cùng đứng đầu — lấy "a"' },
      { args: ['Hello hello world'], expected: 'hello', name: 'Không phân biệt hoa thường' },
      { args: ['x'], expected: 'x', name: 'Một từ duy nhất' },
    ],
    hints: [
      '`Counter(danh_sach)` đếm số lần xuất hiện của từng phần tử, trả về một dict đặc biệt: `Counter(["a","b","a"])` cho `{"a": 2, "b": 1}`.',
      '`most_common(1)` cho phần tử nhiều nhất, nhưng khi **bằng nhau** nó lấy theo thứ tự gặp trước — không phải theo alphabet như đề yêu cầu.',
      'Dùng `min(dem, key=lambda tu: (-dem[tu], tu))`: sắp theo số lần **giảm dần** (dấu trừ) rồi theo chữ cái tăng dần. Đây là mẹo "sắp xếp hai tiêu chí ngược chiều nhau".',
    ],
    diagnostics: [
      { test: 'most_common\\s*\\(\\s*1\\s*\\)', message: '`most_common(1)` không xử lý được yêu cầu "bằng nhau thì lấy theo alphabet" — nó giữ thứ tự gặp trước. Với `"b b a a c"` nó trả về `"b"`, trong khi đề cần `"a"`.' },
      { test: 'max\\s*\\(\\s*dem[\\s\\S]{0,60}dem\\.get\\s*\\)', message: '`max(dem, key=dem.get)` cũng chỉ xét số lần, nên khi bằng nhau kết quả phụ thuộc thứ tự chèn — không xác định theo đề. Cần khoá sắp xếp gồm cả tên từ.' },
      { test: 'if\\s+not\\s+text\\s*:', message: 'Kiểm tra `text` rỗng chưa đủ: `"   "` không rỗng nhưng cũng không có từ nào. Hãy kiểm tra bộ đếm sau khi tách: `if not dem: return None`.' },
    ],
    approach: `
**\`Counter\` — đếm tần suất trong một dòng**

\`\`\`python
from collections import Counter

Counter("a b a".split())        # Counter({'a': 2, 'b': 1})
Counter("hello")                # Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})
\`\`\`

Nó là **lớp con của \`dict\`** nên dùng được mọi thao tác dict, cộng thêm vài tiện ích:

\`\`\`python
dem["z"]              # 0  — khoá không có trả về 0, KHÔNG raise KeyError
dem.most_common(2)    # [('a', 2), ('b', 1)]
dem + Counter(...)    # cộng hai bộ đếm
\`\`\`

**Lời giải**

\`\`\`python
def top_word(text):
    dem = Counter(text.lower().split())
    if not dem:
        return None
    return min(dem, key=lambda tu: (-dem[tu], tu))
\`\`\`

**Giải mã \`key=lambda tu: (-dem[tu], tu)\`**

\`min\`/\`max\`/\`sorted\` nhận tham số \`key\` — một hàm biến mỗi phần tử thành "giá trị để so sánh".
Ở đây ta trả về một **tuple hai thành phần**, và tuple so sánh theo thứ tự phần tử:

1. \`-dem[tu]\` — số lần xuất hiện, **đổi dấu**. Vì \`min\` tìm nhỏ nhất, số lần lớn nhất (âm nhỏ
   nhất) sẽ thắng.
2. \`tu\` — khi số lần bằng nhau, so tên từ theo chữ cái tăng dần.

Đây là mẹo chuẩn để **sắp xếp hai tiêu chí ngược chiều nhau**: một tiêu chí giảm dần, một tiêu chí
tăng dần. Với \`sorted\` bạn không thể dùng \`reverse=True\` cho riêng một tiêu chí, nên dấu trừ là
cách gọn nhất (dùng được với số; với chuỗi thì phải tách hai bước sắp xếp).

**Vì sao \`most_common(1)\` không đủ?**

\`most_common\` sắp theo số lần, và các phần tử bằng nhau giữ **thứ tự chèn** (từ Python 3.7).
Với \`"b b a a c"\`, \`"b"\` được gặp trước nên đứng trước \`"a"\` — trong khi đề cần \`"a"\`. Bài học:
khi đề nói rõ cách phá thế bằng nhau (*tie-break*), bạn phải tự viết khoá sắp xếp.

**\`if not dem\`** hoạt động vì \`Counter\` rỗng là *falsy* — giống dict rỗng. Kiểm tra ở đây (sau khi
tách) đúng hơn là kiểm tra \`text\` rỗng, vì \`"   ".split()\` cho danh sách rỗng.
`,
    solution: `from collections import Counter


def top_word(text):
    dem = Counter(text.lower().split())
    if not dem:
        return None
    return min(dem, key=lambda tu: (-dem[tu], tu))`,
    complexity: {
      question: 'Với văn bản n ký tự và k từ khác nhau, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(n + k) — đếm tuyến tính theo văn bản, rồi quét một lượt qua k từ khác nhau',
        'O(n log n) vì phải sắp xếp toàn bộ',
        'O(n · k)',
        'O(k²)',
      ],
      answer: 0,
      why: '`Counter` băm từng từ một lần → O(n). `min` với key quét đúng một lượt qua k khoá → O(k). Lưu ý `most_common()` không có đối số thì phải SẮP XẾP nên tốn O(k log k) — dùng `min`/`max` khi chỉ cần một phần tử.',
    },
    realWorld: 'Đếm tần suất là thao tác phân tích dữ liệu phổ biến nhất: từ khoá hay xuất hiện trong log lỗi, mã sản phẩm bán chạy nhất, IP gọi nhiều nhất. Quy tắc tie-break rõ ràng cũng rất quan trọng thực tế — nó làm kết quả **tái lập được** (deterministic) giữa các lần chạy.',
  },
  {
    id: 'py-drill-group-by-letter',
    title: 'Nhóm dữ liệu với defaultdict',
    en: 'Grouping with defaultdict',
    difficulty: 'Easy',
    targetMinutes: 8,
    entry: 'group_by_letter',
    lang: 'python',
    checkerSrc: 'lambda got, exp, args: isinstance(got, dict) and got == exp',
    statement: `
Viết hàm \`group_by_letter(words)\` nhóm các từ theo **chữ cái đầu** (chữ thường):

- giữ nguyên thứ tự xuất hiện của các từ trong mỗi nhóm
- bỏ qua chuỗi rỗng
- trả về **dict thường** (không phải \`defaultdict\`)

**Ví dụ**

\`\`\`python
group_by_letter(["an", "binh", "ao"])
# {"a": ["an", "ao"], "b": ["binh"]}
\`\`\`
`,
    starter: `from collections import defaultdict\n\n\ndef group_by_letter(words):\n    # Nhom tu theo chu cai dau\n    \n`,
    tests: [
      { args: [['an', 'binh', 'ao']], expected: { a: ['an', 'ao'], b: ['binh'] }, name: 'Hai nhóm' },
      { args: [[]], expected: {}, name: 'Không có từ nào' },
      { args: [['x']], expected: { x: ['x'] }, name: 'Một từ' },
      { args: [['An', 'ao']], expected: { a: ['An', 'ao'] }, name: 'Chữ đầu hoa/thường vào cùng nhóm, giữ nguyên từ gốc' },
      { args: [['', '']], expected: {}, name: 'Chuỗi rỗng bị bỏ' },
      { args: [['bo', 'ba', 'ca', 'bi']], expected: { b: ['bo', 'ba', 'bi'], c: ['ca'] }, name: 'Giữ thứ tự xuất hiện trong nhóm' },
    ],
    hints: [
      '`defaultdict(list)` là dict mà khi truy cập khoá **chưa tồn tại**, nó tự tạo giá trị mặc định bằng cách gọi `list()` — nên `nhom[k].append(x)` luôn chạy được.',
      'Chữ cái đầu là `tu[0]`, hạ chữ bằng `.lower()`. Nhớ bỏ qua chuỗi rỗng trước, vì `""[0]` sẽ `IndexError`.',
      '`defaultdict` là lớp con của `dict` nên so sánh `==` với dict thường vẫn đúng — nhưng đề yêu cầu trả `dict(nhom)` để hàm không "rò rỉ" hành vi tự tạo khoá ra ngoài.',
    ],
    diagnostics: [
      { test: 'nhom\\s*=\\s*\\{\\s*\\}[\\s\\S]{0,200}nhom\\s*\\[[^\\]]+\\]\\.append', message: 'Với dict thường, `nhom[k].append(...)` raise `KeyError` ở từ đầu tiên của mỗi nhóm. Hoặc dùng `defaultdict(list)`, hoặc `nhom.setdefault(k, []).append(...)`.' },
      { test: 'defaultdict\\s*\\(\\s*list\\s*\\(\\s*\\)\\s*\\)', message: 'Truyền `list` (tên hàm), không phải `list()` (kết quả gọi hàm): `defaultdict(list)`. `defaultdict` cần một *hàm tạo* để gọi mỗi khi thiếu khoá.' },
      { test: 'if\\s+tu\\s*\\[\\s*0\\s*\\]', message: 'Với chuỗi rỗng, `tu[0]` raise `IndexError` trước khi điều kiện được xét. Hãy kiểm tra `if not tu: continue` trước.' },
    ],
    approach: `
**Ba cách nhóm dữ liệu — biết cả ba, dùng cái gọn nhất**

\`\`\`python
# 1. defaultdict — gọn nhất khi nhóm vào list
from collections import defaultdict
nhom = defaultdict(list)
nhom[k].append(x)

# 2. setdefault — không cần import
nhom = {}
nhom.setdefault(k, []).append(x)

# 3. kiểm tra bằng tay — dài, dễ quên
nhom = {}
if k not in nhom:
    nhom[k] = []
nhom[k].append(x)
\`\`\`

**Lời giải**

\`\`\`python
from collections import defaultdict

def group_by_letter(words):
    nhom = defaultdict(list)
    for tu in words:
        if not tu:
            continue
        nhom[tu[0].lower()].append(tu)
    return dict(nhom)
\`\`\`

**\`defaultdict(list)\` hoạt động ra sao?**

Bạn đưa vào một **hàm tạo** (\`list\`, \`int\`, \`set\`, hoặc \`lambda: 0\`). Khi bạn đọc một khoá chưa
có, \`defaultdict\` gọi hàm đó, gán kết quả vào khoá rồi trả về. Vì vậy:

\`\`\`python
dem = defaultdict(int)
dem["a"] += 1        # không cần khởi tạo trước, mặc định là 0

tap = defaultdict(set)
tap["a"].add(1)      # mặc định là set rỗng
\`\`\`

Chú ý \`defaultdict(list)\` chứ **không** phải \`defaultdict(list())\` — bạn đưa *cái để gọi*, không
đưa *kết quả đã gọi*.

**Mặt tối của \`defaultdict\`: chỉ đọc thôi cũng tạo khoá**

\`\`\`python
nhom = defaultdict(list)
print(nhom["z"])     # []
print(nhom)          # defaultdict(<class 'list'>, {'z': []})  ← "z" đã bị tạo!
\`\`\`

Đây là lý do đề yêu cầu \`return dict(nhom)\`: người gọi nhận một dict thường, nên một lỗi gõ sai
khoá (\`ket_qua["zz"]\`) sẽ raise \`KeyError\` như mong đợi, thay vì âm thầm trả về danh sách rỗng và
làm bẩn dữ liệu.

**Thứ tự được giữ như thế nào?** Từ Python 3.7, dict giữ **thứ tự chèn khoá**, và list thì hiển
nhiên giữ thứ tự \`append\`. Nên cả thứ tự các nhóm và thứ tự từ trong mỗi nhóm đều theo thứ tự
xuất hiện trong dữ liệu — không cần làm gì thêm.

**Người anh em: \`itertools.groupby\`** chỉ nhóm các phần tử **liền kề** giống nhau, nên muốn dùng
nó để nhóm toàn cục thì phải \`sorted()\` trước. Với dữ liệu chưa sắp xếp, \`defaultdict\` vừa nhanh
hơn (O(n) thay vì O(n log n)) vừa ít bẫy hơn.
`,
    solution: `from collections import defaultdict


def group_by_letter(words):
    nhom = defaultdict(list)
    for tu in words:
        if not tu:
            continue
        nhom[tu[0].lower()].append(tu)
    return dict(nhom)`,
    complexity: {
      question: 'Với n từ, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(n) — mỗi từ được băm một lần và append một lần, đều là O(1) trung bình',
        'O(n log n) vì phải nhóm theo khoá',
        'O(n · k) với k là số nhóm',
        'O(n²)',
      ],
      answer: 0,
      why: 'Mỗi từ đi qua đúng một lần: lấy chữ đầu (O(1)), băm khoá (O(1) trung bình), append (O(1) khấu trừ). Đây chính là lý do nhóm bằng dict nhanh hơn cách "sắp xếp rồi groupby" — không cần trả giá O(n log n) cho việc sắp xếp.',
    },
    realWorld: 'Nhóm là bước tiền xử lý của gần như mọi báo cáo: đơn hàng theo khách, log theo mã lỗi, file theo phần mở rộng, sự kiện theo ngày. `defaultdict(list)` là công cụ mặc định; đổi sang `defaultdict(int)` là đếm, `defaultdict(set)` là gom giá trị không trùng.',
  },
  {
    id: 'py-heap-k-smallest',
    title: 'k phần tử nhỏ nhất với heapq',
    en: 'k Smallest with heapq',
    difficulty: 'Medium',
    targetMinutes: 12,
    entry: 'k_smallest',
    lang: 'python',
    statement: `
Viết hàm \`k_smallest(nums, k)\` trả về **k phần tử nhỏ nhất**, đã sắp xếp tăng dần:

- \`k <= 0\` → danh sách rỗng
- \`k\` lớn hơn số phần tử → trả về mọi phần tử (đã sắp xếp)
- giữ được cả phần tử trùng nhau

**Ví dụ**
- \`k_smallest([5, 1, 3], 2)\` → \`[1, 3]\`
- \`k_smallest([2, 2, 1], 2)\` → \`[1, 2]\`
- \`k_smallest([1, 2], 5)\` → \`[1, 2]\`
`,
    starter: `import heapq\n\n\ndef k_smallest(nums, k):\n    # Tra ve k phan tu nho nhat, da sap xep\n    \n`,
    tests: [
      { args: [[5, 1, 3], 2], expected: [1, 3], name: 'Hai phần tử nhỏ nhất' },
      { args: [[], 3], expected: [], name: 'Danh sách rỗng' },
      { args: [[2, 2, 1], 2], expected: [1, 2], name: 'Có phần tử trùng' },
      { args: [[1, 2, 3], 0], expected: [], name: 'k = 0' },
      { args: [[1, 2], 5], expected: [1, 2], name: 'k lớn hơn số phần tử' },
      { args: [[3, -1, 0], 2], expected: [-1, 0], name: 'Có số âm' },
      { args: [[5, 4, 3, 2, 1], 3], expected: [1, 2, 3], name: 'Dãy giảm dần' },
      { args: [[7], 1], expected: [7], name: 'Một phần tử' },
    ],
    hints: [
      '`heapq.nsmallest(k, nums)` trả về đúng k phần tử nhỏ nhất, **đã sắp xếp tăng dần**. Nó cũng tự xử lý `k = 0` và `k` lớn hơn độ dài.',
      'Không cần `if` nào cho các trường hợp biên — hãy thử `nsmallest` với `k = 0` và với `k` rất lớn để tự thấy.',
      'Điều đáng học không phải cú pháp mà là **vì sao** nó tốt hơn `sorted(nums)[:k]` khi k nhỏ và n lớn: nó chỉ giữ một heap k phần tử thay vì sắp xếp cả n.',
    ],
    diagnostics: [
      { test: 'sorted\\s*\\(\\s*nums\\s*\\)\\s*\\[', message: '`sorted(nums)[:k]` cho kết quả đúng nhưng tốn O(n log n) và O(n) bộ nhớ cho bản sao. Bài này để luyện `heapq.nsmallest` — O(n log k), tiết kiệm hẳn khi k nhỏ và n rất lớn.' },
      { test: 'heapify[\\s\\S]{0,200}for[\\s\\S]{0,200}heappop', message: 'Tự `heapify` rồi `heappop` k lần cũng đúng (O(n + k log n)) nhưng dài dòng — `nsmallest` đã làm sẵn và còn tối ưu hơn cho k nhỏ.' },
      { test: 'nlargest', message: '`nlargest` cho k phần tử LỚN nhất. Đề cần nhỏ nhất — dùng `nsmallest`.' },
    ],
    approach: `
**Lời giải một dòng**

\`\`\`python
import heapq

def k_smallest(nums, k):
    return heapq.nsmallest(k, nums)
\`\`\`

Điều quan trọng của bài này không phải viết được dòng đó, mà là **biết khi nào nên dùng nó**.

**Ba cách lấy k nhỏ nhất và chi phí của chúng**

| Cách | Thời gian | Bộ nhớ | Nên dùng khi |
| --- | --- | --- | --- |
| \`sorted(nums)[:k]\` | O(n log n) | O(n) | k gần bằng n, hoặc cần cả dãy đã sắp |
| \`heapq.nsmallest(k, nums)\` | O(n log k) | O(k) | k nhỏ hơn n nhiều |
| \`min(nums)\` | O(n) | O(1) | chỉ cần 1 phần tử |

Với n = 10 triệu và k = 10, khác biệt là rất thật: cách đầu phải sắp xếp 10 triệu phần tử và giữ
bản sao trong bộ nhớ; \`nsmallest\` chỉ giữ 10 phần tử và quét một lượt.

**Heap là gì?**

Một cây nhị phân được cài đặt bằng **list phẳng**, luôn duy trì tính chất: cha nhỏ hơn (hoặc bằng)
con. Nhờ vậy phần tử nhỏ nhất luôn ở vị trí \`heap[0]\` — lấy ra O(1), thêm/bớt O(log n).

\`\`\`python
h = [5, 1, 3]
heapq.heapify(h)         # biến list thành heap, O(n)
heapq.heappush(h, 0)     # thêm, O(log n)
heapq.heappop(h)         # lấy PHẦN TỬ NHỎ NHẤT ra, O(log n)
h[0]                     # xem phần tử nhỏ nhất mà không lấy, O(1)
\`\`\`

**\`nsmallest\` làm gì bên trong?** Nó giữ một heap **k phần tử** (dạng max-heap ngược): quét từng
phần tử, nếu nhỏ hơn phần tử lớn nhất trong heap thì thay thế. Mỗi bước O(log k), tổng O(n log k).
Đây chính là khuôn "top-k trên luồng dữ liệu" — dùng được cả khi n không biết trước và không đủ
bộ nhớ để giữ hết.

**\`heapq\` chỉ có min-heap.** Muốn max-heap, mẹo là **đổi dấu**:

\`\`\`python
heapq.heappush(h, -x)     # đẩy giá trị âm
-heapq.heappop(h)         # lấy ra rồi đổi dấu lại
\`\`\`

**Sắp theo tiêu chí riêng:** \`nsmallest\` nhận \`key\` như \`sorted\`:
\`heapq.nsmallest(3, nguoi, key=lambda p: p["tuoi"])\`.
`,
    solution: `import heapq


def k_smallest(nums, k):
    return heapq.nsmallest(k, nums)`,
    complexity: {
      question: 'Với n phần tử và k nhỏ hơn n nhiều, `nsmallest` tốn bao nhiêu?',
      options: [
        'O(n log k) thời gian, O(k) bộ nhớ',
        'O(n log n) thời gian, O(n) bộ nhớ — giống sorted',
        'O(k log n) thời gian',
        'O(n) thời gian với mọi k',
      ],
      answer: 0,
      why: 'Nó duy trì một heap kích thước k: mỗi phần tử trong n phần tử cần tối đa một lần đẩy/lấy O(log k). Bộ nhớ chỉ là heap k phần tử. Đây là lý do `nsmallest`/`nlargest` là công cụ chuẩn cho bài toán top-k trên dữ liệu lớn.',
    },
    realWorld: 'Top-k xuất hiện liên tục: 10 truy vấn chậm nhất, 5 file lớn nhất, 20 sản phẩm bán chạy nhất, k điểm gần nhất. Với log hàng triệu dòng, chọn `nsmallest` thay vì `sorted` là khác biệt giữa "chạy tức thì" và "hết RAM".',
  },
  {
    id: 'py-consecutive-diffs',
    title: 'Hiệu giữa các phần tử liền nhau',
    en: 'Consecutive Differences',
    difficulty: 'Medium',
    targetMinutes: 13,
    entry: 'consecutive_diffs',
    lang: 'python',
    statement: `
Cho dãy số đo theo thời gian. Viết hàm \`consecutive_diffs(readings)\` trả về **list 2 phần tử**:

1. list các **hiệu** giữa mỗi cặp phần tử liền nhau (\`sau - trước\`)
2. **số lần tăng** (số hiệu lớn hơn 0)

**Ví dụ**
- \`consecutive_diffs([1, 3, 2])\` → \`[[2, -1], 1]\`
- \`consecutive_diffs([1, 2, 3, 4])\` → \`[[1, 1, 1], 3]\`
- \`consecutive_diffs([5])\` → \`[[], 0]\`

> Dãy có n phần tử thì có \`n - 1\` cặp liền nhau — dãy rỗng hoặc 1 phần tử thì không có cặp nào.
`,
    starter: `def consecutive_diffs(readings):\n    # Tra ve [danh_sach_hieu, so_lan_tang]\n    \n`,
    tests: [
      { args: [[1, 3, 2]], expected: [[2, -1], 1], name: 'Tăng rồi giảm' },
      { args: [[5]], expected: [[], 0], name: 'Một phần tử — không có cặp nào' },
      { args: [[]], expected: [[], 0], name: 'Dãy rỗng' },
      { args: [[1, 1, 1]], expected: [[0, 0], 0], name: 'Không đổi — hiệu 0 không tính là tăng' },
      { args: [[1, 2, 3, 4]], expected: [[1, 1, 1], 3], name: 'Tăng liên tục' },
      { args: [[10, 0]], expected: [[-10], 0], name: 'Giảm mạnh' },
      { args: [[0, 5, 5, 1, 2]], expected: [[5, 0, -4, 1], 2], name: 'Dãy hỗn hợp' },
    ],
    hints: [
      '`zip(a, b)` ghép từng cặp phần tử cùng vị trí và **dừng ở dãy ngắn hơn**. Mẹo lấy cặp liền nhau: `zip(readings, readings[1:])`.',
      'Với `[1, 3, 2]`: `readings` là `[1,3,2]`, `readings[1:]` là `[3,2]` → zip cho `(1,3)` và `(3,2)` — đúng hai cặp liền nhau.',
      'Đếm số lần tăng bằng `sum(1 for h in hieu if h > 0)`. Chú ý hiệu bằng 0 **không** phải tăng.',
    ],
    diagnostics: [
      { test: 'for\\s+i\\s+in\\s+range\\s*\\(\\s*len\\s*\\(\\s*readings\\s*\\)\\s*\\)', message: '`range(len(readings))` sẽ khiến `readings[i + 1]` vượt biên ở vòng cuối (`IndexError`). Nếu dùng chỉ số thì phải là `range(len(readings) - 1)` — nhưng `zip(readings, readings[1:])` không thể sai biên.' },
      { test: '>=\\s*0', message: 'Hiệu bằng 0 nghĩa là KHÔNG đổi, không phải tăng. Điều kiện đếm phải là `> 0`.' },
      { test: 'sum\\s*\\(\\s*hieu\\s*\\)', message: '`sum(hieu)` là tổng các hiệu (bằng phần tử cuối trừ phần tử đầu), không phải SỐ LẦN tăng. Cần đếm số hiệu dương.' },
    ],
    approach: `
**Mẹo \`zip(a, a[1:])\` — ghép từng cặp liền nhau**

\`\`\`python
readings = [1, 3, 2]
list(zip(readings, readings[1:]))     # [(1, 3), (3, 2)]
\`\`\`

Đọc như hình: dãy thứ hai bị dịch trái một bước, nên khi ghép cùng vị trí ta được các cặp
(trước, sau). Và vì \`zip\` **dừng ở dãy ngắn hơn**, số cặp tự động là \`n - 1\` — dãy rỗng hoặc một
phần tử cho 0 cặp, không cần \`if\` nào.

\`\`\`python
def consecutive_diffs(readings):
    hieu = [b - a for a, b in zip(readings, readings[1:])]
    so_lan_tang = sum(1 for h in hieu if h > 0)
    return [hieu, so_lan_tang]
\`\`\`

**\`for a, b in zip(...)\`** giải nén luôn từng cặp thành hai biến — dễ đọc hơn \`cap[0]\`, \`cap[1]\`.

**Vì sao không dùng chỉ số?**

\`\`\`python
for i in range(len(readings) - 1):
    hieu.append(readings[i + 1] - readings[i])
\`\`\`

Chạy đúng, nhưng bạn phải tự nhớ trừ 1. Đây là chỗ sinh ra lỗi *off-by-one* kinh điển: viết
\`range(len(readings))\` là \`IndexError\` ở vòng cuối. Với \`zip\`, cấu trúc dữ liệu tự bảo đảm biên.

**\`zip\` dừng ở dãy ngắn nhất — con dao hai lưỡi**

\`\`\`python
list(zip([1, 2, 3], ["a", "b"]))     # [(1, 'a'), (2, 'b')]  — mất phần tử 3, KHÔNG cảnh báo
\`\`\`

Ở bài này ta **lợi dụng** tính chất đó. Nhưng khi ghép hai dãy đáng lẽ dài bằng nhau (tên cột với
giá trị hàng chẳng hạn), sự im lặng này làm mất dữ liệu. Từ Python 3.10 hãy dùng
\`zip(a, b, strict=True)\` để nhận \`ValueError\` khi độ dài lệch.

**Bộ nhớ:** \`readings[1:]\` tạo một bản sao (O(n)). Muốn tránh, dùng
\`itertools.pairwise(readings)\` (Python 3.10+) — trả về đúng các cặp liền nhau mà không copy:

\`\`\`python
from itertools import pairwise
hieu = [b - a for a, b in pairwise(readings)]
\`\`\`

**Đếm bằng \`sum(1 for ...)\`** là khuôn "đếm phần tử thoả điều kiện" bạn đã gặp ở module 2. Nó
không dựng list trung gian, nên với dãy rất dài thì tiết kiệm hơn \`len([...])\`.
`,
    solution: `def consecutive_diffs(readings):
    hieu = [b - a for a, b in zip(readings, readings[1:])]
    so_lan_tang = sum(1 for h in hieu if h > 0)
    return [hieu, so_lan_tang]`,
    complexity: {
      question: 'Với n số đo, độ phức tạp thời gian và bộ nhớ là bao nhiêu?',
      options: [
        'Thời gian O(n), bộ nhớ O(n) — do `readings[1:]` tạo bản sao và list hiệu cũng dài n-1',
        'Thời gian O(n), bộ nhớ O(1)',
        'Thời gian O(n²) vì zip phải ghép mọi cặp',
        'Thời gian O(n log n)',
      ],
      answer: 0,
      why: 'Mỗi cặp được xử lý một lần → O(n) thời gian. Bộ nhớ là O(n) vì hai lý do: cắt lát `readings[1:]` copy n-1 phần tử, và kết quả cũng là list n-1 hiệu. Dùng `itertools.pairwise` sẽ bỏ được phần copy.',
    },
    realWorld: 'Tính biến động giữa các mốc thời gian: nhiệt độ theo giờ, giá theo ngày, số lỗi theo phiên bản, thời gian giữa các lần request (để phát hiện dồn dập). Mẹo `zip(a, a[1:])` cũng dùng để kiểm tra "dãy có được sắp xếp chưa": `all(a <= b for a, b in zip(x, x[1:]))`.',
  },
];

/* ==================================================================== */
/* MODULE 13 — py-testing                                                */
/* ==================================================================== */
const PY_TESTING = [
  {
    id: 'py-drill-check-equal',
    title: 'Thông điệp thất bại phải nói ra dữ liệu',
    en: 'A Useful Failure Message',
    difficulty: 'Easy',
    targetMinutes: 6,
    entry: 'check_equal',
    lang: 'python',
    statement: `
Viết hàm \`check_equal(got, expected)\` so hai giá trị:

- bằng nhau → trả về \`"PASS"\`
- khác nhau → trả về \`"FAIL: nhan <got>, mong <expected>"\`

**Ví dụ**
- \`check_equal(1, 1)\` → \`"PASS"\`
- \`check_equal(1, 2)\` → \`"FAIL: nhan 1, mong 2"\`
- \`check_equal(None, 0)\` → \`"FAIL: nhan None, mong 0"\`
`,
    starter: `def check_equal(got, expected):\n    # "PASS" hoac "FAIL: nhan X, mong Y"\n    \n`,
    tests: [
      { args: [1, 1], expected: 'PASS', name: 'Bằng nhau' },
      { args: [1, 2], expected: 'FAIL: nhan 1, mong 2', name: 'Khác nhau — thông điệp có cả hai giá trị' },
      { args: ['a', 'a'], expected: 'PASS', name: 'Chuỗi bằng nhau' },
      { args: ['a', 'b'], expected: 'FAIL: nhan a, mong b', name: 'Chuỗi khác nhau' },
      { args: [[1], [1]], expected: 'PASS', name: 'Hai list cùng nội dung — `==` so nội dung' },
      { args: [null, 0], expected: 'FAIL: nhan None, mong 0', name: 'None khác 0' },
      { args: [[1, 2], [2, 1]], expected: 'FAIL: nhan [1, 2], mong [2, 1]', name: 'List khác thứ tự' },
    ],
    hints: [
      '`==` so **nội dung**: hai list khác nhau trong bộ nhớ nhưng cùng phần tử thì vẫn bằng nhau. (`is` mới so danh tính.)',
      'Dùng f-string để nhúng cả hai giá trị: `f"FAIL: nhan {got}, mong {expected}"`. Trong f-string, giá trị nào cũng được tự đổi sang chuỗi.',
      '`None` trong f-string hiện thành `None`, list `[1, 2]` hiện thành `[1, 2]` — đúng như test mong đợi, không cần xử lý riêng.',
    ],
    diagnostics: [
      { test: 'if\\s+got\\s+is\\s+expected', message: '`is` so **danh tính** (có phải cùng một đối tượng trong bộ nhớ không) nên hai list cùng nội dung sẽ bị coi là khác nhau. So sánh giá trị phải dùng `==`.' },
      { test: 'return\\s+["\']FAIL["\']\\s*$', message: 'Thông điệp chỉ có chữ "FAIL" thì người đọc log không biết sai ở đâu. Đề yêu cầu nhúng cả giá trị nhận được và giá trị mong đợi.' },
      { test: 'print\\s*\\(', message: '`print` chỉ in ra màn hình và trả về `None` — hàm này phải `return` chuỗi để nơi gọi dùng được (ghi log, đếm số ca sai...).' },
    ],
    approach: `
**Lời giải**

\`\`\`python
def check_equal(got, expected):
    if got == expected:
        return "PASS"
    return f"FAIL: nhan {got}, mong {expected}"
\`\`\`

Bài rất ngắn nhưng dạy đúng thứ quyết định chất lượng một bộ test: **thông điệp thất bại**.

**\`==\` và \`is\` — khác biệt phải thuộc**

\`\`\`python
a = [1, 2]
b = [1, 2]
a == b     # True  — cùng NỘI DUNG
a is b     # False — hai đối tượng khác nhau trong bộ nhớ
\`\`\`

Trong test, gần như luôn dùng \`==\`. \`is\` chỉ dùng cho \`None\`, \`True\`, \`False\` và khi bạn **cố ý**
kiểm tra "có phải đúng đối tượng đó không" (ví dụ bài "sửa danh sách tại chỗ" ở module 2).

**Vì sao thông điệp phải chứa dữ liệu?**

So hai kiểu báo lỗi:

\`\`\`
FAIL                                   ← phải chạy lại, thêm print, đoán
FAIL: nhan 1, mong 2                   ← biết ngay, sửa luôn
\`\`\`

Đây là lý do \`pytest\` nổi tiếng: khi \`assert a == b\` sai, nó tự in ra giá trị hai bên và cả phần
khác nhau. Khi tự viết kiểm tra, hãy bắt chước: **đừng bao giờ báo lỗi mà không nói dữ liệu**.

**\`{got}\` gọi \`str()\`, còn \`{got!r}\` gọi \`repr()\`**

\`\`\`python
x = "5"
f"{x}"     # 5      ← không thấy được nó là chuỗi
f"{x!r}"   # '5'    ← thấy rõ dấu nháy
\`\`\`

Trong thông điệp test thật, \`!r\` thường tốt hơn: nó phân biệt được \`5\` với \`"5"\`, \`None\` với
\`"None"\`, và chuỗi có khoảng trắng ở cuối (\`'abc '\`). Bài này dùng \`str()\` cho khớp với đề, nhưng
hãy nhớ mẹo \`!r\` — nó tiết kiệm rất nhiều thời gian debug.

**Ba cách viết cùng một hàm**

\`\`\`python
# 1. như trên — rõ ràng nhất
# 2. biểu thức điều kiện
return "PASS" if got == expected else f"FAIL: nhan {got}, mong {expected}"
# 3. assert — cách của pytest
assert got == expected, f"nhan {got}, mong {expected}"
\`\`\`

Cách 3 khác về bản chất: \`assert\` **raise \`AssertionError\`** khi sai, chứ không trả về chuỗi. Đó là
cách một test framework hoạt động — nó bắt exception để biết ca nào sai. Lưu ý: \`assert\` bị **loại
bỏ hoàn toàn** khi Python chạy với cờ \`-O\`, nên đừng dùng \`assert\` để kiểm tra dữ liệu người dùng
trong code sản xuất — chỉ dùng trong test.
`,
    solution: `def check_equal(got, expected):
    if got == expected:
        return "PASS"
    return f"FAIL: nhan {got}, mong {expected}"`,
    complexity: {
      question: 'Phép `got == expected` với hai list n phần tử tốn bao nhiêu?',
      options: [
        'O(n) — phải so từng phần tử cho tới khi tìm thấy khác biệt',
        'O(1) vì Python so địa chỉ bộ nhớ',
        'O(n log n)',
        'O(n²) vì phải so mọi cặp',
      ],
      answer: 0,
      why: '`==` trên list so lần lượt từng vị trí và dừng ngay khi khác nhau. Có một tối ưu nhỏ: nếu hai biến trỏ cùng một đối tượng, Python trả về True ngay (O(1)) — nhưng trường hợp chung vẫn là O(n).',
    },
    realWorld: 'Mọi hàm kiểm tra tự viết (script smoke test, kiểm tra dữ liệu sau khi migrate, so sánh kết quả hai phiên bản API) đều cần khuôn này. Chất lượng thông điệp quyết định bạn mất 30 giây hay 30 phút để hiểu vì sao nó sai.',
  },
  {
    id: 'py-drill-summarize-results',
    title: 'Tổng hợp kết quả — True cũng là số 1',
    en: 'Summarize Results',
    difficulty: 'Easy',
    targetMinutes: 7,
    entry: 'summarize',
    lang: 'python',
    checkerSrc: 'lambda got, exp, args: isinstance(got, dict) and got == exp',
    statement: `
Viết hàm \`summarize(results)\` nhận list các \`True\`/\`False\` (kết quả từng ca kiểm thử) và trả về dict:

\`\`\`python
{"tong": <số ca>, "dat": <số ca True>, "truot": <số ca False>}
\`\`\`

**Ví dụ**
- \`summarize([True, False, True])\` → \`{"tong": 3, "dat": 2, "truot": 1}\`
- \`summarize([])\` → \`{"tong": 0, "dat": 0, "truot": 0}\`

> Gợi ý: trong Python \`True\` **bằng** \`1\` và \`False\` bằng \`0\` — nên có một cách đếm ngắn đến mức
> bất ngờ.
`,
    starter: `def summarize(results):\n    # Tra ve dict {"tong", "dat", "truot"}\n    \n`,
    tests: [
      { args: [[true, false, true]], expected: { tong: 3, dat: 2, truot: 1 }, name: 'Hỗn hợp' },
      { args: [[]], expected: { tong: 0, dat: 0, truot: 0 }, name: 'Không có ca nào' },
      { args: [[true]], expected: { tong: 1, dat: 1, truot: 0 }, name: 'Một ca đạt' },
      { args: [[false, false]], expected: { tong: 2, dat: 0, truot: 2 }, name: 'Trượt hết' },
      { args: [[true, true, true]], expected: { tong: 3, dat: 3, truot: 0 }, name: 'Đạt hết' },
      { args: [[false, true, false, true, false]], expected: { tong: 5, dat: 2, truot: 3 }, name: 'Năm ca' },
    ],
    hints: [
      '`sum([True, False, True])` cho `2` — vì `bool` là lớp con của `int`, `True` cộng như số 1.',
      'Số ca trượt = tổng số ca trừ số ca đạt, không cần đếm lần thứ hai.',
      'Đừng gọi `len(results)` ba lần — gán ra biến hoặc dùng trực tiếp một lần cho mỗi khoá; điều quan trọng là không đếm lại dữ liệu đã đếm.',
    ],
    diagnostics: [
      { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lặp (một đếm True, một đếm False) là làm việc hai lần trên cùng dữ liệu. Đếm một lần rồi trừ ra.' },
      { test: 'results\\.count\\s*\\(\\s*True\\s*\\)[\\s\\S]{0,120}results\\.count\\s*\\(\\s*False\\s*\\)', message: 'Gọi `count` hai lần là quét danh sách hai lượt. Một lượt `sum()` là đủ, phần còn lại suy ra bằng phép trừ.' },
      { test: 'if\\s+not\\s+results\\s*:\\s*\\n\\s*return', message: 'Không cần nhánh riêng cho danh sách rỗng: `len([])` là 0 và `sum([])` là 0, nên công thức chung đã đúng.' },
    ],
    approach: `
**Lời giải**

\`\`\`python
def summarize(results):
    dat = sum(results)
    return {"tong": len(results), "dat": dat, "truot": len(results) - dat}
\`\`\`

**Vì sao \`sum\` đếm được \`True\`?**

Vì trong Python \`bool\` là **lớp con của \`int\`**: \`True == 1\`, \`False == 0\`.

\`\`\`python
True + True        # 2
sum([True, False]) # 1
int(True)          # 1
\`\`\`

Nhờ đó \`sum(danh_sach_bool)\` là cách đếm "có bao nhiêu cái đúng" ngắn nhất. Cách tổng quát hơn cho
điều kiện bất kỳ là khuôn bạn đã gặp:

\`\`\`python
sum(1 for x in items if dieu_kien(x))
sum(dieu_kien(x) for x in items)      # cũng được, vì True cộng như 1
\`\`\`

**Mặt tối của cùng tính chất này**

Đây cũng chính là bẫy đã gặp ở module 7 (\`isinstance(True, int)\` là \`True\`) và ở module 3
(\`set([1, True])\` chỉ có một phần tử). Cùng một đặc điểm ngôn ngữ: tiện khi đếm, nguy hiểm khi
kiểm tra kiểu. Cách phân biệt: **dùng nó khi bạn đang tính toán, cảnh giác khi bạn đang phân loại.**

**Vì sao lấy \`truot = tong - dat\` thay vì đếm lại?**

- Nhanh hơn: một lượt quét thay vì hai.
- Không thể lệch: hai phép đếm độc lập có thể không cộng lại thành tổng nếu dữ liệu có giá trị lạ
  (ví dụ \`None\` lẫn trong danh sách). Suy ra bằng phép trừ thì \`tong = dat + truot\` **luôn** đúng.

Đó là nguyên tắc chung khi làm báo cáo: **chỉ đo những con số độc lập, phần còn lại suy ra** — nếu
không, bạn sẽ có những bảng thống kê mà các cột không cộng lại thành tổng.

**Không cần nhánh cho danh sách rỗng**

\`len([])\` và \`sum([])\` đều là 0, nên công thức chung tự cho \`{"tong": 0, "dat": 0, "truot": 0}\`.
Lại là bài học đã gặp: **chọn giá trị khởi tạo trung tính thì bỏ được nhánh đặc biệt.**
`,
    solution: `def summarize(results):
    dat = sum(results)
    return {"tong": len(results), "dat": dat, "truot": len(results) - dat}`,
    complexity: {
      question: 'Với n ca kiểm thử, độ phức tạp thời gian là bao nhiêu?',
      options: [
        'O(n) — một lượt `sum`, còn `len` là O(1)',
        'O(n) nhưng quét hai lượt nên là O(2n), khác O(n)',
        'O(1)',
        'O(n log n)',
      ],
      answer: 0,
      why: '`sum` duyệt đúng một lượt qua n phần tử; `len` đọc con số đã lưu sẵn nên là O(1). Ghi chú: O(2n) không phải cách viết hợp lệ — hằng số luôn bị rút gọn, dù trên thực tế quét hai lượt vẫn chậm hơn một lượt.',
    },
    realWorld: 'Mọi bảng tổng kết đều dùng khuôn này: báo cáo test của CI, thống kê job thành công/thất bại, tỉ lệ request lỗi. Mẹo `sum(bool)` cũng dùng để đếm nhanh điều kiện trên dữ liệu: `sum(don["da_thanh_toan"] for don in don_hang)`.',
  },
  {
    id: 'py-run-cases',
    title: 'Bảng test có ca "phải báo lỗi"',
    en: 'Table Tests with Expected Errors',
    difficulty: 'Medium',
    targetMinutes: 15,
    entry: 'run_cases',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    def chia(a, b):
        if b == 0:
            raise ValueError("chia cho 0")
        return a / b

    return fn(chia, args[0])`,
    statement: `
Viết hàm \`run_cases(fn, cases)\` chạy một **bảng ca kiểm thử** cho hàm \`fn\`. Mỗi ca là
\`[danh_sách_đối_số, mong_đợi]\`, trong đó \`mong_đợi\` có thể là:

- một **giá trị** → ca đạt khi \`fn(*đối_số)\` trả về đúng giá trị đó
- một **chuỗi tên loại lỗi** (vd \`"ValueError"\`) → ca đạt khi \`fn\` raise đúng loại lỗi đó

Trả về list \`"pass"\`/\`"fail"\` theo đúng thứ tự các ca.

Hàm được kiểm thử trong bài là \`chia(a, b)\`: trả về \`a / b\`, và \`raise ValueError\` khi \`b == 0\`.

**Ví dụ**

\`\`\`python
run_cases(chia, [[[6, 2], 3], [[6, 0], "ValueError"]])   # ["pass", "pass"]
run_cases(chia, [[[6, 2], 4]])                           # ["fail"]
run_cases(chia, [[[6, 2], "ValueError"]])                # ["fail"] — mong lỗi mà không lỗi
\`\`\`
`,
    starter: `def run_cases(fn, cases):\n    # Tra ve list "pass"/"fail" cho tung ca\n    \n`,
    tests: [
      { args: [[[[6, 2], 3]]], expected: ['pass'], name: 'Ca giá trị, đúng' },
      { args: [[[[6, 0], 'ValueError']]], expected: ['pass'], name: 'Ca lỗi, đúng loại lỗi' },
      { args: [[[[6, 2], 4]]], expected: ['fail'], name: 'Ca giá trị, sai kết quả' },
      { args: [[[[6, 0], 3]]], expected: ['fail'], name: 'Mong giá trị nhưng hàm raise' },
      { args: [[[[6, 2], 'ValueError']]], expected: ['fail'], name: 'Mong lỗi nhưng hàm chạy êm' },
      { args: [[[[1, 2], 0.5], [[4, 2], 2]]], expected: ['pass', 'pass'], name: 'Hai ca đều đạt' },
      { args: [[]], expected: [], name: 'Bảng rỗng' },
      { args: [[[[6, 0], 'TypeError']]], expected: ['fail'], name: 'Raise ValueError nhưng ca mong TypeError' },
    ],
    hints: [
      'Mỗi ca cần một khối `try/except` riêng: `try: nhan = fn(*doi_so)` rồi `except Exception as e:` để bắt mọi loại lỗi và so tên.',
      '`type(e).__name__` cho tên loại lỗi dạng chuỗi (`"ValueError"`) để so với `mong_doi`.',
      'Đừng quên ca "mong lỗi mà hàm chạy êm": sau khi `fn` trả về bình thường, nếu `isinstance(mong_doi, str)` thì đó là `"fail"`.',
    ],
    diagnostics: [
      { test: 'except\\s+ValueError\\s*:', message: 'Chỉ bắt `ValueError` thì ca mong `TypeError` (hoặc hàm raise loại khác) sẽ làm sập cả bộ chạy test. Bộ chạy test phải bắt `Exception` — đây là một trong ít trường hợp bắt rộng là ĐÚNG.' },
      { test: 'return\\s+\\[[\\s\\S]{0,40}\\]\\s*$[\\s\\S]*for\\s+', message: 'Có vẻ hàm trả về ngay trong/trước vòng lặp. Phải chạy HẾT các ca rồi trả về list kết quả — một ca sai không được làm dừng các ca sau.' },
      { test: 'type\\s*\\(\\s*e\\s*\\)\\s*==\\s*mong_doi', message: 'So một LỚP lỗi với một CHUỖI luôn cho `False`. Cần lấy tên lớp: `type(e).__name__ == mong_doi`.' },
    ],
    approach: `
**Bảng test (table-driven test) là gì?**

Thay vì viết một hàm test cho mỗi trường hợp, ta để **dữ liệu** mô tả các trường hợp và một vòng
lặp chạy hết. Thêm ca mới = thêm một dòng dữ liệu.

\`\`\`python
def run_cases(fn, cases):
    ket_qua = []
    for doi_so, mong_doi in cases:
        try:
            nhan = fn(*doi_so)
        except Exception as e:
            ket_qua.append("pass" if type(e).__name__ == mong_doi else "fail")
            continue

        if isinstance(mong_doi, str):
            ket_qua.append("fail")          # mong lỗi mà hàm chạy êm
        else:
            ket_qua.append("pass" if nhan == mong_doi else "fail")
    return ket_qua
\`\`\`

**Bốn nhánh cần phủ — bảng này chính là bài học**

| \`mong_doi\` | \`fn\` chạy êm | \`fn\` raise |
| --- | --- | --- |
| giá trị | so \`==\` | fail (lỗi ngoài dự kiến) |
| tên lỗi | **fail** (thiếu lỗi mong đợi) | so tên lỗi |

Ô dễ bị bỏ nhất là ô \`(tên lỗi, chạy êm)\`. Một bộ test quên ô này sẽ **báo đạt** cho hàm không còn
raise nữa — tức là mất luôn tác dụng bảo vệ. Trong \`pytest\`, việc này được lo bởi
\`pytest.raises\`: nếu khối bên trong không raise, chính \`pytest.raises\` sẽ báo thất bại.

**\`continue\` sau khi ghi kết quả trong \`except\`**

Không có \`continue\`, luồng sẽ chạy tiếp xuống phần so sánh giá trị với biến \`nhan\` **chưa được
gán** → \`UnboundLocalError\`. Đây là lý do nên dùng \`continue\` (hoặc \`else\` của \`try\`) để tách rõ
hai đường đi:

\`\`\`python
try:
    nhan = fn(*doi_so)
except Exception as e:
    ...
else:
    ...        # chỉ chạy khi KHÔNG có lỗi — biến nhan chắc chắn tồn tại
\`\`\`

**Ở đây bắt \`Exception\` là đúng**

Các bài trước dạy "bắt hẹp nhất có thể". Bộ chạy test là ngoại lệ hợp lý: nhiệm vụ của nó là
**cô lập** từng ca — một ca nổ không được làm sập cả bộ. Nguyên tắc thật sự không phải "luôn bắt
hẹp" mà là: **bắt đúng phạm vi mà bạn có kế hoạch xử lý**. Bộ chạy test có kế hoạch cho mọi lỗi:
ghi lại rồi đi tiếp.

**\`fn(*doi_so)\`** dùng dấu \`*\` để **mở** list thành các đối số riêng — chiều ngược của \`*args\`
lúc khai báo (module 2). Nhờ vậy bảng test không cần biết hàm có mấy tham số.
`,
    solution: `def run_cases(fn, cases):
    ket_qua = []
    for doi_so, mong_doi in cases:
        try:
            nhan = fn(*doi_so)
        except Exception as e:
            ket_qua.append("pass" if type(e).__name__ == mong_doi else "fail")
            continue

        if isinstance(mong_doi, str):
            ket_qua.append("fail")
        else:
            ket_qua.append("pass" if nhan == mong_doi else "fail")
    return ket_qua`,
    complexity: {
      question: 'Với c ca kiểm thử, chi phí của bộ chạy (không tính chi phí bên trong `fn`) là bao nhiêu?',
      options: [
        'O(c) — mỗi ca một lời gọi và một phép so sánh',
        'O(c²) vì phải so mỗi ca với mọi ca khác',
        'O(1)',
        'O(c log c)',
      ],
      answer: 0,
      why: 'Vòng lặp chạy đúng c lần, mỗi lần làm một lượng việc hằng số ngoài bản thân `fn`. Ghi chú thực tế: chi phí thật của một bộ test nằm gần như toàn bộ ở trong `fn`, nên tối ưu bộ chạy hầu như không giúp gì.',
    },
    realWorld: 'Bảng test là kiểu test phổ biến nhất cho hàm thuần: `pytest.mark.parametrize` chính là cách viết bảng của pytest. Việc mô tả "ca này phải raise" bằng dữ liệu (thay vì viết riêng một hàm test) giúp các trường hợp lỗi được kiểm thử đầy đủ như trường hợp thành công — điều rất hay bị bỏ qua.',
  },
  {
    id: 'py-fixture-order',
    title: 'setup/teardown chạy quanh từng ca',
    en: 'Setup and Teardown Order',
    difficulty: 'Medium',
    targetMinutes: 14,
    entry: 'run_suite',
    lang: 'python',
    statement: `
Viết hàm \`run_suite(tests)\` mô phỏng cách một test framework chạy nhiều ca, mỗi ca được bọc bởi
\`setup\` và \`teardown\`. \`tests\` là list tên ca; tên **bắt đầu bằng \`!\`** nghĩa là ca đó raise lỗi.

Hàm trả về **log** các bước theo thứ tự:

- trước mỗi ca: \`"setup"\`
- ca chạy êm: \`"test:<tên>"\`
- ca lỗi: \`"error:<tên không có dấu !>"\`
- sau mỗi ca — **kể cả khi lỗi**: \`"teardown"\`

**Ví dụ**

\`\`\`python
run_suite(["a"])          # ["setup", "test:a", "teardown"]
run_suite(["!x"])         # ["setup", "error:x", "teardown"]
run_suite(["a", "!y"])    # ["setup","test:a","teardown","setup","error:y","teardown"]
\`\`\`

> Một ca lỗi **không được** làm dừng các ca sau.
`,
    starter: `def run_suite(tests):\n    # Tra ve log cac buoc: setup / test:... / error:... / teardown\n    \n`,
    tests: [
      { args: [['a']], expected: ['setup', 'test:a', 'teardown'], name: 'Một ca chạy êm' },
      { args: [['a', 'b']], expected: ['setup', 'test:a', 'teardown', 'setup', 'test:b', 'teardown'], name: 'Hai ca — setup/teardown lặp lại cho từng ca' },
      { args: [['!x']], expected: ['setup', 'error:x', 'teardown'], name: 'Ca lỗi — teardown vẫn chạy' },
      { args: [[]], expected: [], name: 'Không có ca nào' },
      { args: [['a', '!y', 'b']], expected: ['setup', 'test:a', 'teardown', 'setup', 'error:y', 'teardown', 'setup', 'test:b', 'teardown'], name: 'Ca lỗi không làm dừng ca sau' },
      { args: [['!p', '!q']], expected: ['setup', 'error:p', 'teardown', 'setup', 'error:q', 'teardown'], name: 'Hai ca lỗi liên tiếp' },
    ],
    hints: [
      'Mỗi ca là một lượt của vòng lặp, và bên trong mỗi lượt là một khối `try/except/finally` **riêng**.',
      '`"teardown"` phải nằm trong `finally:` — đó là cách duy nhất bảo đảm nó chạy cả khi ca lỗi.',
      'Bỏ dấu `!` khỏi tên bằng cắt lát `ten[1:]`. Vì `except` nằm **bên trong** vòng lặp, lỗi được xử lý tại chỗ và vòng lặp tiếp tục sang ca sau.',
    ],
    diagnostics: [
      { test: 'try\\s*:[\\s\\S]{0,120}for\\s+', message: 'Khối `try` bọc CẢ vòng lặp thì ca lỗi đầu tiên sẽ làm dừng mọi ca sau. `try` phải nằm bên trong vòng lặp, bọc từng ca.' },
      { test: 'log\\.append\\s*\\(\\s*["\']teardown["\']\\s*\\)\\s*\\n(?![\\s\\S]{0,80}finally)', message: 'Nếu `"teardown"` không nằm trong `finally:`, nó sẽ bị bỏ qua khi ca raise lỗi — đúng loại rò rỉ tài nguyên mà setup/teardown sinh ra để ngăn.' },
      { test: 'error:\\{ten\\}|["\']error:["\']\\s*\\+\\s*ten\\s*\\)', message: 'Tên trong log phải bỏ dấu `!` ở đầu: dùng `ten[1:]`.' },
    ],
    approach: `
**Khuôn "mỗi ca một vòng đời"**

\`\`\`python
def run_suite(tests):
    log = []
    for ten in tests:
        log.append("setup")
        try:
            if ten.startswith("!"):
                raise ValueError(ten)
            log.append("test:" + ten)
        except ValueError:
            log.append("error:" + ten[1:])
        finally:
            log.append("teardown")
    return log
\`\`\`

**Vị trí của \`try\` quyết định phạm vi cô lập**

\`\`\`python
for ten in tests:        # try BÊN TRONG vòng lặp -> mỗi ca độc lập
    try: ...

try:                      # try BỌC vòng lặp -> ca lỗi đầu tiên làm dừng tất cả
    for ten in tests: ...
\`\`\`

Đây chính là điều làm nên một test framework: **một ca sai không được ảnh hưởng ca khác**. Nguyên
tắc rộng hơn: đặt \`try\` quanh **đơn vị công việc nhỏ nhất mà bạn muốn tiếp tục được sau khi nó
thất bại** — xử lý một dòng dữ liệu, gửi một email, đồng bộ một bản ghi.

**\`finally\` là chỗ duy nhất bảo đảm dọn dẹp**

\`finally\` chạy trong **mọi** đường ra khỏi khối \`try\`: kết thúc êm, có exception, thậm chí \`return\`
giữa khối. Đó là lý do teardown, đóng file, nhả khoá, rollback đều phải nằm ở đây.

Nhắc lại quan hệ với module 10: \`with\` chính là \`try/finally\` được đóng gói. Bài này viết tay để
bạn thấy phần "bảo đảm chạy" mà \`with\` đang làm giúp mình.

**Vì sao teardown lặp lại cho từng ca (mà không làm một lần cuối)?**

Vì mục đích của nó là **cô lập trạng thái**: mỗi ca phải bắt đầu từ một trạng thái sạch, nếu không
kết quả sẽ phụ thuộc thứ tự chạy — loại bug tệ nhất trong test ("chạy riêng thì đạt, chạy cả bộ thì
trượt"). Trong pytest, đó là fixture với \`scope="function"\` (mặc định). Fixture \`scope="module"\`
hay \`"session"\` chạy một lần cho nhiều ca — nhanh hơn nhưng đánh đổi bằng nguy cơ các ca ảnh hưởng
nhau.

**Ghi chú:** ở đây ta bắt \`ValueError\` vì tự biết ca chỉ raise loại đó. Một framework thật bắt
\`BaseException\` cho mọi ca (xem lại bài trước) và còn phân biệt "test thất bại" với "test lỗi hạ
tầng".
`,
    solution: `def run_suite(tests):
    log = []
    for ten in tests:
        log.append("setup")
        try:
            if ten.startswith("!"):
                raise ValueError(ten)
            log.append("test:" + ten)
        except ValueError:
            log.append("error:" + ten[1:])
        finally:
            log.append("teardown")
    return log`,
    complexity: {
      question: 'Với n ca kiểm thử, độ dài log và độ phức tạp thời gian là bao nhiêu?',
      options: [
        'Log dài đúng 3n phần tử, thời gian O(n)',
        'Log dài n, thời gian O(n)',
        'Log dài 3n, thời gian O(n²) vì append vào list',
        'Không xác định vì phụ thuộc số ca lỗi',
      ],
      answer: 0,
      why: 'Mỗi ca luôn sinh đúng 3 dòng log (setup, một dòng kết quả, teardown) — dù đạt hay lỗi — nên log dài 3n và thời gian tỉ lệ n. `append` là O(1) khấu trừ nên không gây O(n²).',
    },
    realWorld: 'Đây là mô hình của mọi test runner (pytest fixtures, unittest `setUp`/`tearDown`, JUnit `@Before`/`@After`) và cũng là mô hình của các job xử lý theo lô: mỗi bản ghi được mở giao dịch, xử lý, rồi đóng — một bản ghi lỗi chỉ bị đánh dấu lỗi, không làm chết cả lô.',
  },
];

/* ==================================================================== */
/* MODULE 14 — py-advanced-oop                                           */
/* ==================================================================== */
const PY_ADVANCED_OOP = [
  {
    id: 'py-drill-class-counter',
    title: 'Thuộc tính của LỚP và @classmethod',
    en: 'Class Attribute and @classmethod',
    difficulty: 'Easy',
    targetMinutes: 9,
    entry: 'Ticket',
    lang: 'python',
    harnessSrc: `def harness(Cls, args, t):
    Cls.count = 0
    ve = [Cls(x) for x in args[0]]
    return [Cls.total(), ve[0].name if ve else None, Cls.count]`,
    statement: `
Viết class \`Ticket\` đếm số vé đã tạo:

- \`count\` — **thuộc tính của LỚP** (không phải của từng đối tượng), bắt đầu từ \`0\`
- \`__init__(self, name)\` — lưu \`self.name\` và **tăng \`count\` của lớp lên 1**
- \`total()\` — một \`@classmethod\` trả về \`count\` hiện tại

**Ví dụ**

\`\`\`python
Ticket("a"); Ticket("b")
Ticket.total()     # 2
Ticket.count       # 2
\`\`\`
`,
    starter: `class Ticket:\n    count = 0\n\n    def __init__(self, name):\n        pass\n\n    @classmethod\n    def total(cls):\n        pass\n`,
    tests: [
      { args: [['a', 'b']], expected: [2, 'a', 2], name: 'Hai vé' },
      { args: [[]], expected: [0, null, 0], name: 'Chưa tạo vé nào' },
      { args: [['x']], expected: [1, 'x', 1], name: 'Một vé' },
      { args: [['p', 'q', 'r']], expected: [3, 'p', 3], name: 'Ba vé' },
      { args: [['1', '2']], expected: [2, '1', 2], name: 'Tên là chuỗi số' },
    ],
    hints: [
      'Thuộc tính của lớp được khai **thẳng trong thân class**, ngoài mọi phương thức: `count = 0`. Nó thuộc về LỚP nên mọi đối tượng cùng thấy một giá trị.',
      'Trong `__init__`, phải tăng qua chính lớp: `Ticket.count += 1` (hoặc `type(self).count += 1`). **Không** viết `self.count += 1` — xem phần phân tích để biết vì sao.',
      '`@classmethod` nhận `cls` (bản thân LỚP) thay cho `self`, nên `total()` gọi được cả từ lớp (`Ticket.total()`) mà không cần tạo đối tượng nào.',
    ],
    diagnostics: [
      { test: 'self\\.count\\s*\\+=', message: '`self.count += 1` đọc giá trị của LỚP rồi tạo một thuộc tính MỚI trên đối tượng — nên `Ticket.count` không bao giờ tăng, và mỗi vé chỉ đếm được chính nó (luôn bằng 1). Dùng `Ticket.count += 1`.' },
      { test: 'def\\s+total\\s*\\(\\s*self\\s*\\)', message: 'Với `self`, `total` trở thành phương thức của đối tượng nên phải có vé mới gọi được. Đề cần `@classmethod` nhận `cls` để gọi thẳng `Ticket.total()`.' },
      { test: 'def\\s+__init__[\\s\\S]{0,120}count\\s*=\\s*0', message: 'Đặt `count = 0` trong `__init__` sẽ reset về 0 mỗi lần tạo vé. Thuộc tính của lớp phải khai trong thân class, ngoài các phương thức.' },
    ],
    approach: `
**Thuộc tính của LỚP vs thuộc tính của ĐỐI TƯỢNG**

\`\`\`python
class Ticket:
    count = 0                      # THUỘC LỚP — một bản duy nhất, mọi vé cùng thấy

    def __init__(self, name):
        self.name = name           # THUỘC ĐỐI TƯỢNG — mỗi vé một bản riêng
        Ticket.count += 1

    @classmethod
    def total(cls):
        return cls.count
\`\`\`

**Vì sao \`self.count += 1\` sai?**

Dòng đó thực chất là \`self.count = self.count + 1\`, và Python xử lý hai bên rất khác nhau:

1. **Đọc** \`self.count\` — không thấy trên đối tượng, nên đi tìm trên lớp → được \`0\`.
2. **Gán** \`self.count = 1\` — tạo một thuộc tính **mới trên đối tượng**, che (shadow) thuộc tính
   của lớp.

Kết quả: \`Ticket.count\` vẫn là \`0\` mãi mãi, và mỗi vé có \`count\` riêng bằng 1. Bug này không báo
lỗi gì cả — chỉ là con số đếm luôn sai.

**Luật tra thuộc tính:** đọc thì tìm trên **đối tượng trước, rồi tới lớp**; ghi thì **luôn ghi vào
đối tượng** (trừ khi bạn ghi qua tên lớp).

**Ba loại phương thức**

\`\`\`python
class C:
    def phuong_thuc(self): ...          # cần đối tượng; làm việc với dữ liệu của đối tượng

    @classmethod
    def cua_lop(cls): ...               # nhận LỚP; làm việc với dữ liệu của lớp, hoặc tạo đối tượng

    @staticmethod
    def tien_ich(): ...                 # không nhận gì; chỉ là hàm đặt trong class cho gọn
\`\`\`

\`@classmethod\` hay dùng nhất cho **hàm tạo thay thế** (alternative constructor):

\`\`\`python
@classmethod
def from_csv(cls, line):
    ten, gia = line.split(",")
    return cls(ten)          # cls, không phải Ticket -> lớp con dùng lại được
\`\`\`

Viết \`cls(...)\` thay vì \`Ticket(...)\` là điểm quan trọng: nếu ai đó tạo \`class VipTicket(Ticket)\`
thì \`VipTicket.from_csv(...)\` sẽ trả về đúng \`VipTicket\`.

**Cảnh báo về trạng thái dùng chung**

Biến đếm ở cấp lớp là **trạng thái toàn cục** trá hình: nó tồn tại suốt đời tiến trình, làm các
test ảnh hưởng nhau (chính vì thế bộ chấm của bài này phải \`Ticket.count = 0\` trước mỗi ca), và
không an toàn khi có nhiều luồng. Với đếm thật, hãy truyền một đối tượng đếm vào, hoặc dùng
\`itertools.count()\`. Bẫy nặng hơn của cùng cơ chế: **thuộc tính lớp là list/dict** — mọi đối tượng
dùng chung, đúng như quiz \`class Team: members = []\` ở module 4.
`,
    solution: `class Ticket:
    count = 0

    def __init__(self, name):
        self.name = name
        Ticket.count += 1

    @classmethod
    def total(cls):
        return cls.count`,
    complexity: {
      question: 'Tạo n vé tốn bao nhiêu, và bộ nhớ cho `count` là bao nhiêu?',
      options: [
        'O(n) thời gian, và `count` chỉ chiếm O(1) bộ nhớ vì chỉ có MỘT bản trên lớp',
        'O(n) thời gian, O(n) bộ nhớ vì mỗi đối tượng giữ một bản count',
        'O(n²) thời gian',
        'O(1) thời gian vì count là thuộc tính lớp',
      ],
      answer: 0,
      why: 'Mỗi vé là một lần khởi tạo O(1) → tổng O(n). `count` nằm trong `__dict__` của LỚP nên chỉ tồn tại một bản, bất kể tạo bao nhiêu đối tượng — đó chính là ý nghĩa của thuộc tính lớp (và cũng là lý do nó là trạng thái dùng chung).',
    },
    realWorld: 'Thuộc tính lớp dùng cho những gì thuộc về "loại" chứ không thuộc về "một cái": giá trị mặc định, bảng đăng ký các lớp con (registry), hằng số cấu hình. `@classmethod` thì gặp nhất ở hàm tạo thay thế — `datetime.now()`, `dict.fromkeys()`, `Model.from_dict()` đều là classmethod.',
  },
  {
    id: 'py-drill-property-area',
    title: 'Thuộc tính tính toán với @property',
    en: 'Computed Attribute with @property',
    difficulty: 'Easy',
    targetMinutes: 9,
    entry: 'Circle',
    lang: 'python',
    harnessSrc: `def harness(Cls, args, t):
    c = Cls(args[0])
    out = [round(c.area, 2)]
    try:
        c.area = 1
        out.append("gan duoc")
    except AttributeError:
        out.append("AttributeError")
    return out`,
    statement: `
Viết class \`Circle\`:

- \`__init__(self, r)\` — lưu bán kính
- \`area\` — **thuộc tính chỉ đọc** trả về diện tích \`pi * r * r\`, truy cập như dữ liệu
  (\`c.area\`, **không** phải \`c.area()\`)
- gán vào \`c.area\` phải bị chặn (Python tự raise \`AttributeError\`)

**Ví dụ**

\`\`\`python
c = Circle(1)
c.area          # 3.14159...
c.area = 5      # AttributeError
\`\`\`
`,
    starter: `import math\n\n\nclass Circle:\n    def __init__(self, r):\n        pass\n\n    @property\n    def area(self):\n        pass\n`,
    tests: [
      { args: [1], expected: [3.14, 'AttributeError'], name: 'Bán kính 1' },
      { args: [2], expected: [12.57, 'AttributeError'], name: 'Bán kính 2' },
      { args: [0], expected: [0.0, 'AttributeError'], name: 'Bán kính 0' },
      { args: [0.5], expected: [0.79, 'AttributeError'], name: 'Bán kính thập phân' },
      { args: [10], expected: [314.16, 'AttributeError'], name: 'Bán kính lớn' },
    ],
    hints: [
      '`@property` đặt ngay trên `def area(self)` biến phương thức thành thuộc tính: người dùng viết `c.area` (không ngoặc) và Python tự gọi hàm.',
      '`math.pi` là số pi. Diện tích là `math.pi * self.r * self.r` (hoặc `math.pi * self.r ** 2`).',
      'Bạn **không phải làm gì** để chặn việc gán: chỉ có `@property` mà không có setter thì Python tự raise `AttributeError` khi ai đó gán. Đó là quà kèm theo.',
    ],
    diagnostics: [
      { test: 'def\\s+area\\s*\\(\\s*self\\s*\\)\\s*:(?![\\s\\S]{0,200}@property)', message: 'Thiếu `@property` phía trên `def area` — khi đó `c.area` trả về đối tượng hàm chứ không phải số, và `round(c.area, 2)` sẽ báo TypeError.' },
      { test: 'self\\.area\\s*=', message: 'Đừng gán `self.area` trong `__init__`: nó sẽ xung đột với property (raise `AttributeError` ngay khi tạo đối tượng). Property TÍNH giá trị mỗi lần đọc, không lưu sẵn.' },
      { test: '@area\\.setter', message: 'Thêm setter làm mất tính chỉ đọc — test yêu cầu việc gán phải raise `AttributeError`.' },
    ],
    approach: `
**\`@property\` — gọi hàm nhưng nhìn như đọc dữ liệu**

\`\`\`python
import math

class Circle:
    def __init__(self, r):
        self.r = r

    @property
    def area(self):
        return math.pi * self.r * self.r
\`\`\`

\`\`\`python
c = Circle(2)
c.area       # 12.566...  ← không có dấu ngoặc, nhưng hàm vừa chạy
c.r = 3
c.area       # 28.27...   ← tự tính lại theo r mới
\`\`\`

**Vì sao không lưu sẵn \`self.area\` trong \`__init__\`?**

Vì nó sẽ **lỗi thời** ngay khi \`r\` đổi. Property giải quyết đúng vấn đề đó: giá trị được tính **tại
thời điểm đọc**, nên không bao giờ lệch với dữ liệu gốc. Nguyên tắc chung: **dữ liệu có thể suy ra
được thì đừng lưu** (một dữ kiện, một nơi lưu — nhắc lại từ module 10).

**Vì sao không dùng phương thức \`get_area()\`?**

Được, nhưng \`@property\` cho bạn một thứ quan trọng: **thay đổi cách cài đặt mà không phá code người
dùng**. Ban đầu \`c.area\` là thuộc tính thường; sau này cần tính toán/kiểm tra, bạn biến nó thành
property — mọi chỗ viết \`c.area\` vẫn chạy. Trong Java người ta viết getter/setter từ đầu để đề phòng
chuyện này; Python không cần, vì luôn có đường lùi.

**Chỉ đọc là miễn phí**

Chỉ khai \`@property\` mà không khai setter → gán vào sẽ raise:

\`\`\`
AttributeError: property 'area' of 'Circle' object has no setter
\`\`\`

Đây là cách gọn nhất để có **thuộc tính bất biến từ bên ngoài**. Muốn cho gán thì thêm setter, và
đó cũng là nơi đặt kiểm tra dữ liệu:

\`\`\`python
@property
def r(self):
    return self._r

@r.setter
def r(self, value):
    if value < 0:
        raise ValueError("ban kinh khong duoc am")
    self._r = value
\`\`\`

Chú ý quy ước tên: dữ liệu thật lưu ở \`self._r\` (một gạch dưới = "nội bộ"), còn \`self.r\` là cửa
vào có kiểm soát. **Bẫy chết người:** nếu setter viết \`self.r = value\` (thay vì \`self._r\`) thì nó
gọi lại chính nó → đệ quy vô hạn → \`RecursionError\`.

**Nhược điểm cần biết:** \`c.area\` **trông như** rẻ tiền nhưng thật ra chạy code. Đừng đặt việc đắt
(truy vấn database, gọi mạng) sau một property — người đọc sẽ vô tình gọi nó trong vòng lặp. Việc
đắt thì đặt tên như một hành động: \`c.tinh_dien_tich()\`. Cần tính một lần rồi nhớ luôn thì dùng
\`functools.cached_property\`.
`,
    solution: `import math


class Circle:
    def __init__(self, r):
        self.r = r

    @property
    def area(self):
        return math.pi * self.r * self.r`,
    complexity: {
      question: 'Đọc `c.area` 1000 lần tốn bao nhiêu phép nhân?',
      options: [
        '2000 — property tính lại MỖI lần đọc, không có cache',
        '2 — Python nhớ kết quả lần đầu',
        '0 — giá trị đã được tính trong __init__',
        'Tuỳ vào bán kính',
      ],
      answer: 0,
      why: 'Property là một lời gọi hàm được che giấu: mỗi lần đọc là một lần chạy thân hàm (ở đây 2 phép nhân). Không có cache nào — muốn có thì dùng `functools.cached_property`, nhưng khi đó giá trị sẽ không tự cập nhật nếu `r` đổi.',
    },
    realWorld: '`@property` xuất hiện khắp các thư viện: `df.shape`, `response.text`, `path.suffix` — đều là hàm được che dưới hình dạng thuộc tính. Dùng nó cho các giá trị suy ra (tổng tiền của đơn hàng, tuổi từ ngày sinh, trạng thái từ nhiều cờ) để không bao giờ phải nhớ "gọi lại hàm cập nhật".',
  },
  {
    id: 'py-repr-eq-unhashable',
    title: 'Định nghĩa __eq__ làm mất tính hashable',
    en: 'Defining __eq__ Breaks Hashing',
    difficulty: 'Medium',
    targetMinutes: 14,
    entry: 'Point',
    lang: 'python',
    harnessSrc: `def harness(Cls, args, t):
    p = Cls(*args)
    q = Cls(*args)
    out = [repr(p), p == q, p is q]
    try:
        out.append(len({p, q}))
    except TypeError:
        out.append("TypeError")
    return out`,
    statement: `
Viết class \`Point\` với:

- \`__init__(self, x, y)\`
- \`__repr__\` → chuỗi dạng \`"Point(1, 2)"\`
- \`__eq__\` → hai điểm bằng nhau khi **cùng \`x\` và cùng \`y\`**
- **KHÔNG** định nghĩa \`__hash__\`

Bài chấm trả về \`[repr(p), p == q, p is q, số_phần_tử_của_set]\` — và bạn sẽ thấy bước cuối
raise \`TypeError\`. Đó chính là bài học của bài này.

**Ví dụ**

\`\`\`python
p, q = Point(1, 2), Point(1, 2)
repr(p)      # "Point(1, 2)"
p == q       # True   — cùng nội dung
p is q       # False  — hai đối tượng khác nhau
{p, q}       # TypeError: unhashable type: 'Point'
\`\`\`
`,
    starter: `class Point:\n    def __init__(self, x, y):\n        pass\n\n    def __repr__(self):\n        pass\n\n    def __eq__(self, other):\n        pass\n`,
    tests: [
      { args: [1, 2], expected: ['Point(1, 2)', true, false, 'TypeError'], name: 'Điểm cơ bản' },
      { args: [0, 0], expected: ['Point(0, 0)', true, false, 'TypeError'], name: 'Gốc toạ độ' },
      { args: [-1, 5], expected: ['Point(-1, 5)', true, false, 'TypeError'], name: 'Toạ độ âm' },
      { args: [3, 4], expected: ['Point(3, 4)', true, false, 'TypeError'], name: 'Điểm khác' },
      { args: [10, -10], expected: ['Point(10, -10)', true, false, 'TypeError'], name: 'Một âm một dương' },
    ],
    hints: [
      '`__repr__` trả về chuỗi mô tả dành cho lập trình viên, theo quy ước "gõ lại được": `f"Point({self.x}, {self.y})"`.',
      '`__eq__(self, other)` so nội dung: `return self.x == other.x and self.y == other.y`. (Bản đầy đủ nên kiểm tra `isinstance(other, Point)` trước — xem phần phân tích.)',
      'Bạn không cần làm gì để `{p, q}` raise `TypeError`: khi một class định nghĩa `__eq__` mà không định nghĩa `__hash__`, Python **tự đặt** `__hash__ = None`.',
    ],
    diagnostics: [
      { test: 'def\\s+__hash__', message: 'Đề yêu cầu KHÔNG định nghĩa `__hash__` — bài này để bạn thấy hậu quả. (Trong code thật thì có `__hash__` mới là đúng, xem phần phân tích.)' },
      { test: 'def\\s+__eq__[\\s\\S]{0,160}self\\s+is\\s+other', message: '`self is other` chỉ đúng khi hai biến trỏ cùng một đối tượng — đó là hành vi MẶC ĐỊNH mà ta đang muốn thay thế. Hãy so `x` và `y`.' },
      { test: 'def\\s+__str__\\s*\\(', message: 'Đề cần `__repr__` (dùng bởi `repr()`, bởi console và khi in list) — không phải `__str__`. Nếu chỉ viết một cái, hãy viết `__repr__`: `str()` sẽ tự dùng nó.' },
    ],
    approach: `
**Lời giải**

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
\`\`\`

**\`__repr__\` — quy ước "gõ lại được"**

Chuỗi trả về nên trông như biểu thức tạo lại đối tượng: \`Point(1, 2)\`, \`datetime(2024, 3, 15)\`.
Nhờ vậy khi bạn in một danh sách đối tượng ra console, output đọc được ngay:

\`\`\`python
print([Point(1, 2), Point(3, 4)])     # [Point(1, 2), Point(3, 4)]
\`\`\`

Lưu ý: \`print\` một đối tượng dùng \`__str__\`, nhưng in một **list** thì các phần tử dùng \`__repr__\`.
Đó là lý do lời khuyên "nếu chỉ viết một cái thì viết \`__repr__\`" — \`str()\` sẽ tự dùng \`__repr__\`
khi không có \`__str__\`, còn chiều ngược lại thì không.

**Bài học chính: \`__eq__\` **giết** \`__hash__\`**

Mặc định, mọi đối tượng đều hashable (băm theo địa chỉ bộ nhớ) và \`==\` so danh tính. Khi bạn định
nghĩa \`__eq__\`, Python **tự đặt \`__hash__ = None\`**:

\`\`\`python
{Point(1, 2)}          # TypeError: unhashable type: 'Point'
d = {Point(1, 2): "a"}  # cũng TypeError
\`\`\`

**Vì sao Python làm vậy?** Vì có một hợp đồng bắt buộc giữa \`==\` và \`hash\`:

> Hai đối tượng bằng nhau **phải** có cùng giá trị băm.

Nếu Python giữ nguyên hash theo địa chỉ, thì \`Point(1,2) == Point(1,2)\` (True) nhưng hai hash khác
nhau → set/dict sẽ chứa hai phần tử "bằng nhau", tra cứu thất bại một cách bí ẩn. Thay vì để bạn
gặp bug đó, Python chặn thẳng bằng \`TypeError\`. Đây là ví dụ đẹp của **fail fast**.

**Cách sửa đúng trong code thật**

\`\`\`python
def __hash__(self):
    return hash((self.x, self.y))     # băm theo CÙNG các trường dùng trong __eq__
\`\`\`

Mẹo: gói các trường vào tuple rồi băm tuple — Python đã lo phần khó. Điều kiện duy nhất: các trường
đó phải **không đổi** sau khi tạo đối tượng; nếu \`x\` đổi sau khi đã đưa vào set, phần tử sẽ "mất
tích" trong set.

Cách gọn hơn cả: \`@dataclass(frozen=True)\` — nó sinh sẵn \`__init__\`, \`__repr__\`, \`__eq__\` và
\`__hash__\`, đồng thời chặn việc sửa thuộc tính (nên hash luôn hợp lệ).

**Một chi tiết \`__eq__\` chuyên nghiệp hơn**

\`\`\`python
def __eq__(self, other):
    if not isinstance(other, Point):
        return NotImplemented
    return (self.x, self.y) == (other.x, other.y)
\`\`\`

Không có \`isinstance\`, \`Point(1,2) == "chuoi"\` sẽ nổ \`AttributeError\` thay vì trả về \`False\`. Trả
về \`NotImplemented\` (không phải \`False\`!) là cách nói "tôi không biết so với loại này" — Python sẽ
thử \`__eq__\` của phía bên kia, rồi mới kết luận \`False\`.
`,
    solution: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y`,
    complexity: {
      question: 'Nếu bổ sung `__hash__` đúng cách, tra cứu `p in tap_hop` tốn bao nhiêu?',
      options: [
        'O(1) trung bình — băm để tới đúng ô, chỉ so `==` với vài phần tử cùng ô',
        'O(n) vì phải so với mọi phần tử',
        'O(log n)',
        'O(1) trong mọi trường hợp, kể cả xấu nhất',
      ],
      answer: 0,
      why: 'Set/dict dùng bảng băm: từ hash tính ra ô cần tới, rồi so `==` với các phần tử trong ô đó. Trung bình là O(1). Trường hợp xấu nhất (mọi phần tử cùng hash — ví dụ `__hash__` trả về hằng số) suy biến thành O(n) — đó là lý do hàm băm phải phân tán tốt.',
    },
    realWorld: 'Bug "không cho vào set/dict được" xuất hiện ngay khi bạn thêm `__eq__` vào một model để so sánh trong test. Nó cũng lý giải vì sao `list` và `dict` không dùng làm khoá dict được (chúng có `__eq__` theo nội dung và có thể thay đổi), còn `tuple` và `frozenset` thì được.',
  },
  {
    id: 'py-comparable-version',
    title: 'Cho đối tượng biết so sánh và sắp xếp',
    en: 'Make Objects Sortable',
    difficulty: 'Medium',
    targetMinutes: 15,
    entry: 'Version',
    lang: 'python',
    harnessSrc: `def harness(Cls, args, t):
    objs = [Cls(s) for s in args[0]]
    da_sap = [str(v) for v in sorted(objs)]
    lon_nhat = str(max(objs)) if objs else None
    return [da_sap, lon_nhat]`,
    statement: `
Viết class \`Version\` để **sắp xếp được** các số phiên bản:

- \`__init__(self, text)\` — lưu chuỗi gốc và phân tích thành tuple số (\`"1.2.3"\` → \`(1, 2, 3)\`)
- \`__str__\` — trả về **chuỗi gốc**
- \`__lt__(self, other)\` — so sánh theo tuple số
- \`__eq__(self, other)\` — bằng nhau khi tuple số bằng nhau

Sau đó \`sorted(danh_sách_version)\` và \`max(...)\` phải hoạt động.

**Ví dụ**

\`\`\`python
vs = [Version("1.10.0"), Version("1.9.0"), Version("1.2.3")]
[str(v) for v in sorted(vs)]     # ["1.2.3", "1.9.0", "1.10.0"]
str(max(vs))                     # "1.10.0"
\`\`\`
`,
    starter: `class Version:\n    def __init__(self, text):\n        pass\n\n    def __str__(self):\n        pass\n\n    def __lt__(self, other):\n        pass\n\n    def __eq__(self, other):\n        pass\n`,
    tests: [
      { args: [['1.10.0', '1.9.0', '1.2.3']], expected: [['1.2.3', '1.9.0', '1.10.0'], '1.10.0'], name: 'So theo số, không so chuỗi' },
      { args: [['2.0.0', '10.0.0']], expected: [['2.0.0', '10.0.0'], '10.0.0'], name: 'Hai chữ số ở phần đầu' },
      { args: [['1.0.0']], expected: [['1.0.0'], '1.0.0'], name: 'Một phiên bản' },
      { args: [[]], expected: [[], null], name: 'Danh sách rỗng' },
      { args: [['1.0.1', '1.0.0', '1.0.2']], expected: [['1.0.0', '1.0.1', '1.0.2'], '1.0.2'], name: 'Khác nhau ở phần patch' },
      { args: [['0.9.9', '1.0.0', '0.10.0']], expected: [['0.9.9', '0.10.0', '1.0.0'], '1.0.0'], name: '0.10.0 lớn hơn 0.9.9' },
    ],
    hints: [
      'Trong `__init__`, lưu cả hai: `self.text = text` (để `__str__` trả về nguyên bản) và `self.parts = tuple(int(p) for p in text.split("."))` (để so sánh).',
      '`__lt__` nghĩa là "less than" — Python gọi nó khi gặp toán tử `<`. Chỉ cần `return self.parts < other.parts`, vì tuple đã biết so sánh.',
      '`sorted()` **chỉ cần `__lt__`**. `max()` cũng chạy được nhờ Python tự dùng `__lt__` theo chiều ngược lại khi không tìm thấy `__gt__`.',
    ],
    diagnostics: [
      { test: 'def\\s+__lt__[\\s\\S]{0,160}self\\.text\\s*<', message: 'So chuỗi gốc là sai: `"1.10.0" < "1.9.0"` cho `True` vì so theo ký tự. Phải so tuple số (`self.parts`).' },
      { test: 'def\\s+__lt__\\s*\\(\\s*self\\s*\\)', message: '`__lt__` cần hai tham số: `def __lt__(self, other)` — nó so `self` với `other`.' },
      { test: 'sorted\\s*\\(\\s*[\\s\\S]{0,40}key\\s*=', message: 'Ở bài này việc so sánh phải nằm TRONG class (qua `__lt__`), không phải ở chỗ gọi `sorted` — nhờ vậy mọi nơi dùng `Version` đều sắp xếp đúng mà không cần nhớ truyền `key`.' },
    ],
    approach: `
**Nạp toán tử: cho class của bạn hiểu \`<\`**

\`\`\`python
class Version:
    def __init__(self, text):
        self.text = text
        self.parts = tuple(int(p) for p in text.split("."))

    def __str__(self):
        return self.text

    def __lt__(self, other):
        return self.parts < other.parts

    def __eq__(self, other):
        return self.parts == other.parts
\`\`\`

Mỗi toán tử tương ứng một dunder: \`<\` → \`__lt__\`, \`<=\` → \`__le__\`, \`>\` → \`__gt__\`,
\`>=\` → \`__ge__\`, \`==\` → \`__eq__\`, \`!=\` → \`__ne__\`.

**Vì sao chỉ cần \`__lt__\` mà \`sorted\` và \`max\` đều chạy?**

- \`sorted\`/\`list.sort\` **chỉ dùng \`<\`**. Đây là quyết định thiết kế của Python: một quan hệ "nhỏ
  hơn" là đủ để sắp xếp.
- \`max\`/\`min\` dùng \`>\` hoặc \`<\`; khi không có \`__gt__\`, Python thử **toán tử phản chiếu**: \`a > b\`
  trở thành \`b < a\`. Nhờ vậy \`__lt__\` gánh được cả hai.

Muốn đủ cả 6 toán tử mà không viết 6 hàm, dùng decorator:

\`\`\`python
from functools import total_ordering

@total_ordering
class Version:
    ...   # chỉ cần __eq__ và __lt__, phần còn lại được sinh ra
\`\`\`

**Vì sao lưu cả \`text\` và \`parts\`?**

Vì chúng phục vụ hai mục đích khác nhau: \`text\` để **hiển thị** đúng nguyên bản người dùng nhập
(\`"1.02.0"\` vẫn hiện là \`"1.02.0"\`), \`parts\` để **so sánh** theo giá trị số. Đây là mẫu hình rất
hay gặp — giữ dạng gốc để hiển thị, giữ dạng chuẩn hoá để tính toán.

**Vì sao đặt so sánh trong class thay vì truyền \`key=\` vào \`sorted\`?**

\`\`\`python
sorted(vs, key=lambda v: v.parts)      # phải nhớ viết mỗi lần, mỗi nơi
sorted(vs)                             # class tự biết cách so
\`\`\`

Khi quy tắc so sánh **thuộc về bản chất** của kiểu dữ liệu (phiên bản, tiền tệ, ngày tháng), hãy
đặt nó vào class. Còn \`key=\` dành cho quy tắc **tuỳ ngữ cảnh** ("lần này tôi muốn sắp theo tên").

**Nhắc lại từ bài trước:** class này định nghĩa \`__eq__\` nên đã **mất tính hashable** — không cho
vào set/dict được. Với một lớp \`Version\` dùng thật, hãy thêm:

\`\`\`python
def __hash__(self):
    return hash(self.parts)
\`\`\`

**Điểm chưa hoàn thiện của bài:** \`__lt__\` giả định \`other\` cũng là \`Version\`. Bản chắc chắn hơn
nên \`return NotImplemented\` nếu không phải — khi đó \`Version("1.0.0") < 5\` cho \`TypeError\` rõ ràng
thay vì \`AttributeError\` khó hiểu.
`,
    solution: `class Version:
    def __init__(self, text):
        self.text = text
        self.parts = tuple(int(p) for p in text.split("."))

    def __str__(self):
        return self.text

    def __lt__(self, other):
        return self.parts < other.parts

    def __eq__(self, other):
        return self.parts == other.parts`,
    complexity: {
      question: 'Sắp xếp n đối tượng Version tốn bao nhiêu phép so sánh?',
      options: [
        'O(n log n) phép so sánh, mỗi phép so tuple là O(số phần) — coi như hằng số',
        'O(n) vì Python dùng bảng băm',
        'O(n²) vì mỗi cặp phải so với nhau',
        'O(log n)',
      ],
      answer: 0,
      why: 'Thuật toán sắp xếp của Python (Timsort) cần O(n log n) phép so sánh trong trường hợp chung. Mỗi phép so sánh gọi `__lt__` và so hai tuple 3 phần tử — hằng số. Lưu ý: việc phân tích chuỗi thành tuple đã làm sẵn trong `__init__`, nên không bị lặp lại ở mỗi phép so sánh (nếu tính trong `__lt__` sẽ chậm hơn nhiều).',
    },
    realWorld: 'Bất cứ kiểu dữ liệu nào có thứ tự tự nhiên đều nên nạp toán tử: phiên bản, tiền tệ, khoảng thời gian, mức độ ưu tiên, điểm số. Đó là lý do `datetime`, `Decimal`, `pathlib.Path` sắp xếp được ngay. Mẹo "chuẩn hoá một lần trong `__init__`, so sánh nhanh về sau" cũng chính là cách các thư viện phiên bản (`packaging.version`) hoạt động.',
  },
];

/* ==================================================================== */
/* MODULE 15 — py-concurrency-performance                                */
/* ==================================================================== */
const PY_CONCURRENCY = [
  {
    id: 'py-drill-batch-count',
    title: 'Chia lô: phép chia làm tròn LÊN',
    en: 'Ceiling Division',
    difficulty: 'Easy',
    targetMinutes: 7,
    entry: 'batch_count',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    try:
        return fn(*args)
    except ValueError:
        return "ValueError"`,
    statement: `
Gửi \`total\` bản ghi, mỗi lô tối đa \`size\` bản ghi. Viết hàm \`batch_count(total, size)\` trả về
**số lô cần thiết** — phần dư cũng phải có một lô riêng.

- \`size <= 0\` → \`raise ValueError\`
- \`total = 0\` → \`0\` lô

**Ví dụ**
- \`batch_count(10, 3)\` → \`4\` (3 + 3 + 3 + 1)
- \`batch_count(9, 3)\` → \`3\`
- \`batch_count(0, 5)\` → \`0\`
`,
    starter: `def batch_count(total, size):\n    # So lo can thiet, lam tron LEN\n    \n`,
    tests: [
      { args: [10, 3], expected: 4, name: 'Có phần dư' },
      { args: [9, 3], expected: 3, name: 'Chia hết' },
      { args: [0, 5], expected: 0, name: 'Không có bản ghi nào' },
      { args: [1, 10], expected: 1, name: 'Ít hơn một lô' },
      { args: [7, 7], expected: 1, name: 'Đúng một lô' },
      { args: [100, 7], expected: 15, name: 'Số lớn hơn' },
      { args: [10, 0], expected: 'ValueError', name: 'size = 0' },
      { args: [10, -1], expected: 'ValueError', name: 'size âm' },
    ],
    hints: [
      'Chia lấy nguyên `//` làm tròn XUỐNG nên `10 // 3` ra `3` — thiếu một lô cho phần dư.',
      'Mẹo làm tròn lên chỉ dùng số nguyên: `-(-total // size)`. Đổi dấu hai lần biến "làm tròn xuống" thành "làm tròn lên".',
      'Cách khác là `math.ceil(total / size)` — nhưng nó đi qua số thực nên có thể sai với số cực lớn. Đặt `if size <= 0: raise ValueError(...)` ngay đầu hàm.',
    ],
    diagnostics: [
      { test: 'total\\s*//\\s*size\\s*$', message: '`//` làm tròn xuống nên phần dư bị mất cả một lô: `10 // 3` ra 3, đề cần 4.' },
      { test: 'if\\s+total\\s*%\\s*size', message: 'Kiểu `total // size + (1 if total % size else 0)` chạy đúng nhưng dài. `-(-total // size)` gọn hơn và không cần nhánh nào — chỉ cần biết mẹo.' },
      { test: 'round\\s*\\(', message: '`round()` làm tròn về số GẦN NHẤT (và làm tròn .5 về số chẵn), nên `round(10/3)` ra 3 — sai hướng. Cần làm tròn LÊN.' },
    ],
    approach: `
**Lời giải**

\`\`\`python
def batch_count(total, size):
    if size <= 0:
        raise ValueError("size phai lon hon 0")
    return -(-total // size)
\`\`\`

**Mẹo \`-(-a // b)\` hoạt động ra sao?**

Nhớ lại module 1: \`//\` làm tròn **xuống** (về phía âm vô cực).

\`\`\`python
10 // 3      # 3    làm tròn xuống
-10 // 3     # -4   cũng làm tròn xuống, nhưng ở phía âm nên là "xa hơn"
-(-10 // 3)  # 4    đổi dấu lại -> thành làm tròn LÊN
\`\`\`

Nói cách khác: làm tròn lên của \`a/b\` chính là làm tròn xuống của \`-a/b\` rồi đổi dấu. Toàn bộ phép
tính chỉ dùng số nguyên nên **không mất chính xác**.

**Vì sao không \`math.ceil(total / size)\`?**

Vì \`/\` cho số thực, và số thực chỉ có 53 bit phần định trị:

\`\`\`python
math.ceil(10 / 3)                        # 4    đúng
n = 10**18
math.ceil((n + 1) / n)                   # 1 (!) đáng lẽ 2 — sai do làm tròn float
-(-(n + 1) // n)                         # 2     đúng
\`\`\`

Với dữ liệu thường thì \`math.ceil\` vẫn đúng, nhưng biết cách chỉ-dùng-số-nguyên là biết cách không
bao giờ sai.

**Vì sao \`total = 0\` tự đúng?** \`-(-0 // 5)\` = \`-(0)\` = \`0\`. Không cần nhánh riêng — lại là mẫu
"chọn công thức xử lý được cả trường hợp biên".

**Vì sao \`size <= 0\` phải raise?**

\`size = 0\` sẽ gây \`ZeroDivisionError\` — đúng là lỗi, nhưng thông điệp không nói gì về "kích thước
lô". Với \`size < 0\` thì tệ hơn: hàm **chạy êm** và trả về số âm, rồi một vòng lặp ở đâu đó chạy 0
lần và bạn tưởng đã gửi hết dữ liệu. Đây là lý do guard clause ở đầu hàm có giá trị: biến một lỗi
âm thầm thành một lỗi rõ ràng.

**Liên hệ tới hiệu năng — vì sao bài này ở module cuối?** Chia lô là bước đầu của mọi xử lý song
song và mọi lời gọi API hàng loạt: gửi 1 triệu bản ghi thành các lô 500. Tính sai số lô nghĩa là
**mất dữ liệu ở lô cuối** — loại bug rất khó phát hiện vì nó chỉ ảnh hưởng phần dư.
`,
    solution: `def batch_count(total, size):
    if size <= 0:
        raise ValueError("size phai lon hon 0")
    return -(-total // size)`,
    complexity: {
      question: 'Độ phức tạp thời gian của hàm này?',
      options: [
        'O(1) — hai phép chia số nguyên và một phép đổi dấu',
        'O(n) theo total',
        'O(total / size)',
        'O(log total)',
      ],
      answer: 0,
      why: 'Không có vòng lặp nào: chỉ vài phép toán số học trên số nguyên. (Với số nguyên khổng lồ hàng nghìn chữ số thì phép chia mới phụ thuộc số chữ số, nhưng với số thường thì đây là hằng số.)',
    },
    realWorld: 'Phân trang (số trang từ số bản ghi), chia dữ liệu thành lô để gọi API, chia file thành khối để upload, tính số worker cần thiết. Lỗi kinh điển là dùng `//` rồi mất lô cuối — người dùng thấy "thiếu vài dòng cuối" mà log không có lỗi nào.',
  },
  {
    id: 'py-drill-has-duplicate',
    title: 'Phát hiện trùng: O(n) thay vì O(n²)',
    en: 'Detect Duplicates in O(n)',
    difficulty: 'Easy',
    targetMinutes: 8,
    entry: 'has_duplicate',
    lang: 'python',
    statement: `
Viết hàm \`has_duplicate(items)\` trả về \`True\` nếu có phần tử nào xuất hiện từ hai lần trở lên.
Yêu cầu: **dừng ngay khi phát hiện phần tử trùng đầu tiên**, không quét hết danh sách.

**Ví dụ**
- \`has_duplicate([1, 2, 3])\` → \`False\`
- \`has_duplicate([1, 2, 1])\` → \`True\`
- \`has_duplicate([])\` → \`False\`

> Có một test khiến nhiều người bất ngờ: \`has_duplicate([0, False])\` → \`True\`. Phần phân tích sẽ
> giải thích vì sao.
`,
    starter: `def has_duplicate(items):\n    # True neu co phan tu trung, dung ngay khi tim thay\n    \n`,
    tests: [
      { args: [[1, 2, 3]], expected: false, name: 'Không trùng' },
      { args: [[1, 2, 1]], expected: true, name: 'Có trùng' },
      { args: [[]], expected: false, name: 'Danh sách rỗng' },
      { args: [['a', 'a']], expected: true, name: 'Chuỗi trùng' },
      { args: [[1, '1']], expected: false, name: 'Số 1 và chuỗi "1" là khác nhau' },
      { args: [[0, false]], expected: true, name: '0 và False được coi là CÙNG một khoá' },
      { args: [[1, 2, 3, 4, 5, 3]], expected: true, name: 'Phần tử trùng nằm ở cuối' },
    ],
    hints: [
      'Duy trì một `set` các phần tử đã gặp. Với mỗi phần tử: nếu đã có trong set thì `return True`, ngược lại thêm vào set.',
      '`x in tap_hop` là O(1) trung bình nhờ bảng băm, còn `x in danh_sach` là O(n) — thay một chữ mà đổi cả độ phức tạp.',
      '`len(set(items)) != len(items)` cũng cho kết quả đúng nhưng luôn quét HẾT danh sách và dựng set đầy đủ. Đề yêu cầu dừng sớm.',
    ],
    diagnostics: [
      { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lặp lồng nhau là O(n²): với 100 nghìn phần tử là 10 tỉ phép so sánh. Dùng set để về O(n).' },
      { test: 'da_gap\\s*=\\s*\\[\\s*\\]', message: 'Dùng LIST để lưu phần tử đã gặp thì phép `x in da_gap` là O(n), tổng thành O(n²). Đổi `[]` thành `set()` là xong — cùng cú pháp `in`, khác hẳn độ phức tạp.' },
      { test: 'len\\s*\\(\\s*set\\s*\\(', message: '`len(set(items)) != len(items)` đúng kết quả nhưng luôn xử lý cả n phần tử. Đề yêu cầu dừng ngay khi thấy phần tử trùng đầu tiên — với dữ liệu lớn mà phần tử trùng nằm ở đầu, khác biệt là rất lớn.' },
    ],
    approach: `
**Lời giải — dừng sớm**

\`\`\`python
def has_duplicate(items):
    da_gap = set()
    for x in items:
        if x in da_gap:
            return True
        da_gap.add(x)
    return False
\`\`\`

**Ba cách và chi phí thật**

| Cách | Thời gian | Dừng sớm? |
| --- | --- | --- |
| hai vòng lặp lồng nhau | O(n²) | có |
| \`len(set(items)) != len(items)\` | O(n) | không |
| set + dừng sớm (bài này) | O(n), tốt nhất O(1) | có |

Với 100 nghìn phần tử: cách đầu là ~5 tỉ phép so sánh (vài phút), hai cách sau là 100 nghìn phép
(vài chục miligiây). Đây là ví dụ rõ nhất cho thấy **chọn đúng cấu trúc dữ liệu quan trọng hơn mọi
mẹo tối ưu vi mô**.

**Vì sao \`in\` trên set là O(1) mà trên list là O(n)?**

Set/dict dùng **bảng băm**: từ giá trị tính ra một số (hash), số đó chỉ thẳng tới ô cần xem. List
thì phải so lần lượt từ đầu. Cùng một từ khoá \`in\`, hai cơ chế hoàn toàn khác — nên khi thấy \`in\`
trong vòng lặp, hãy luôn hỏi "vế phải là gì?".

**Bẫy \`[0, False]\` → \`True\`**

\`\`\`python
0 == False          # True
hash(0) == hash(False)   # True  (đều là 0)
{0, False}          # {0}  — chỉ MỘT phần tử!
\`\`\`

Set coi hai giá trị là trùng khi \`hash\` bằng nhau **và** \`==\` cho \`True\`. Vì \`bool\` là lớp con của
\`int\` (bẫy đã gặp ở module 7 và 13), \`False\` **là** \`0\` dưới mắt bảng băm. Tương tự \`1\` và \`True\`,
\`1\` và \`1.0\`. Hệ quả thực tế: đừng trộn kiểu trong cùng một khoá dữ liệu — nếu id có thể là \`1\` hay
\`"1"\`, hãy chuẩn hoá về một kiểu trước khi bỏ vào set/dict.

**Điều kiện để dùng được set:** phần tử phải **hashable**. List và dict thì không:

\`\`\`python
has_duplicate([[1], [1]])    # TypeError: unhashable type: 'list'
\`\`\`

Cách xử lý: đổi sang dạng bất biến trước — \`tuple(x)\` cho list, \`frozenset(x)\` cho set,
\`json.dumps(x, sort_keys=True)\` cho dict lồng nhau.
`,
    solution: `def has_duplicate(items):
    da_gap = set()
    for x in items:
        if x in da_gap:
            return True
        da_gap.add(x)
    return False`,
    complexity: {
      question: 'Độ phức tạp thời gian và bộ nhớ trong trường hợp xấu nhất?',
      options: [
        'Thời gian O(n), bộ nhớ O(n) — xấu nhất là không có phần tử trùng nào, set chứa cả n phần tử',
        'Thời gian O(n²), bộ nhớ O(1)',
        'Thời gian O(n), bộ nhớ O(1)',
        'Thời gian O(n log n) vì set phải sắp xếp',
      ],
      answer: 0,
      why: 'Xấu nhất (không trùng) phải xét cả n phần tử và set giữ đủ n phần tử → O(n) cả hai. Đây là sự đánh đổi kinh điển *dùng bộ nhớ để mua thời gian*: chấp nhận O(n) bộ nhớ để giảm từ O(n²) xuống O(n) thời gian.',
    },
    realWorld: 'Kiểm tra id trùng trong file import trước khi ghi database, phát hiện request bị gửi hai lần (idempotency key), tìm vòng lặp trong danh sách liên kết. Việc dừng sớm rất có giá trị khi dữ liệu bẩn thường lộ ra ngay từ đầu — bạn báo lỗi cho người dùng sau 1ms thay vì sau 30 giây.',
  },
  {
    id: 'py-memo-call-count',
    title: 'Ghi nhớ kết quả: từ hàm mũ về tuyến tính',
    en: 'Memoization: Exponential to Linear',
    difficulty: 'Medium',
    targetMinutes: 15,
    entry: 'fib_with_count',
    lang: 'python',
    statement: `
Viết hàm \`fib_with_count(n)\` tính số Fibonacci thứ \`n\` **có ghi nhớ kết quả** (memoization), và
trả về \`[giá_trị, số_lần_tính_thật]\` — trong đó "số lần tính thật" là số lần thân hàm đệ quy phải
tính vì **chưa có trong bộ nhớ đệm**.

\`fib(0) = 0\`, \`fib(1) = 1\`, \`fib(k) = fib(k-1) + fib(k-2)\`.

**Ví dụ**
- \`fib_with_count(0)\` → \`[0, 1]\`
- \`fib_with_count(5)\` → \`[5, 6]\`
- \`fib_with_count(30)\` → \`[832040, 31]\`

> Con số thứ hai là bài học: với memoization nó là \`n + 1\`; **không** có memoization, \`fib(30)\` cần
> hơn 2,7 triệu lời gọi.
`,
    starter: `def fib_with_count(n):\n    # Tra ve [gia_tri, so_lan_tinh_that]\n    \n`,
    tests: [
      { args: [0], expected: [0, 1], name: 'fib(0)' },
      { args: [1], expected: [1, 1], name: 'fib(1)' },
      { args: [2], expected: [1, 3], name: 'fib(2) — tính 2, 1, 0' },
      { args: [5], expected: [5, 6], name: 'Mỗi k từ 0..5 chỉ tính một lần' },
      { args: [10], expected: [55, 11], name: 'n + 1 lần tính' },
      { args: [30], expected: [832040, 31], name: 'Không có cache thì cần hơn 2,7 triệu lời gọi' },
    ],
    hints: [
      'Định nghĩa một hàm đệ quy **bên trong** `fib_with_count`, cùng một dict `cache = {}` và một biến đếm — cả hai nằm ở hàm ngoài nên hàm trong đọc được (closure).',
      'Thứ tự trong hàm đệ quy: kiểm tra `if k in cache: return cache[k]` TRƯỚC (không tăng biến đếm), rồi mới tăng đếm và tính.',
      'Biến đếm là số nguyên nên gán lại bên trong hàm lồng sẽ bị coi là biến cục bộ (`UnboundLocalError`). Hai cách: dùng `nonlocal dem`, hoặc dùng list một phần tử `dem = [0]` rồi `dem[0] += 1`.',
    ],
    diagnostics: [
      { test: 'dem\\s*\\+=\\s*1[\\s\\S]{0,200}if\\s+k\\s+in\\s+cache', message: 'Tăng biến đếm TRƯỚC khi kiểm tra cache sẽ đếm cả những lần lấy từ cache — con số sẽ lớn hơn n + 1. Kiểm tra cache trước.' },
      { test: 'def\\s+fib[\\s\\S]{0,300}dem\\s*\\+=\\s*1(?![\\s\\S]*nonlocal)', message: 'Gán vào `dem` bên trong hàm lồng mà không khai `nonlocal dem` sẽ gây `UnboundLocalError` — Python coi `dem` là biến cục bộ của hàm trong. Dùng `nonlocal dem` hoặc `dem = [0]` rồi `dem[0] += 1`.' },
      { test: 'lru_cache', message: '`functools.lru_cache` là công cụ đúng trong code thật, nhưng ở đây bạn cần tự đếm số lần tính nên phải viết cache bằng tay. (`lru_cache` có `cache_info()` cho hits/misses — xem phần phân tích.)' },
    ],
    approach: `
**Lời giải**

\`\`\`python
def fib_with_count(n):
    cache = {}
    dem = [0]                       # list 1 phần tử để hàm lồng sửa được

    def fib(k):
        if k in cache:              # 1. có sẵn -> KHÔNG tính, không đếm
            return cache[k]
        dem[0] += 1                 # 2. đây là một lần tính thật
        if k < 2:
            ket_qua = k
        else:
            ket_qua = fib(k - 1) + fib(k - 2)
        cache[k] = ket_qua          # 3. ghi vào cache trước khi trả về
        return ket_qua

    return [fib(n), dem[0]]
\`\`\`

**Vì sao \`fib\` không cache lại là thảm hoạ?**

\`\`\`
fib(5) = fib(4) + fib(3)
         fib(3) + fib(2)   fib(2) + fib(1)
         ...
\`\`\`

\`fib(3)\` bị tính **hai lần**, \`fib(2)\` ba lần, \`fib(1)\` năm lần... Số lời gọi tăng theo hàm mũ:
xấp xỉ \`2^n\`. Cụ thể: \`fib(30)\` cần 2.692.537 lời gọi, \`fib(40)\` cần hơn 300 triệu — máy tính đứng
hàng chục giây cho một bài toán lẽ ra tức thời.

Với cache, mỗi giá trị \`k\` chỉ được tính **một lần** → đúng \`n + 1\` lần tính, độ phức tạp về
**O(n)**. Đây là ý tưởng nền của *dynamic programming*: **đổi bộ nhớ lấy thời gian**.

**Ba chi tiết cú pháp**

1. **Thứ tự kiểm tra cache.** Phải là việc đầu tiên — nếu tăng biến đếm trước, bạn đếm cả những lần
   "chỉ lấy ra dùng".
2. **\`nonlocal\` và bẫy \`UnboundLocalError\`.** Trong Python, chỉ cần một lệnh GÁN cho biến nào đó
   trong hàm là biến đó thành cục bộ của hàm ấy — nên \`dem += 1\` trong hàm lồng sẽ nổ
   \`UnboundLocalError\`. Hai cách chữa:

   \`\`\`python
   nonlocal dem      # khai rõ: dùng biến của hàm bao ngoài
   dem[0] += 1        # hoặc: SỬA trong một list (không phải gán tên) -> không cần khai gì
   \`\`\`

   Cách thứ hai chạy được vì \`dem[0] += 1\` là *sửa nội dung*, không phải *gán lại tên*. Với \`dict\`
   \`cache\` cũng vậy: ta chỉ \`cache[k] = ...\` nên không cần \`nonlocal\`.
3. **Ghi cache trước khi \`return\`.** Quên dòng này thì hàm vẫn đúng kết quả nhưng chậm như cũ —
   một lỗi hiệu năng im lặng.

**Trong code thật: dùng \`functools.lru_cache\`**

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(k):
    return k if k < 2 else fib(k - 1) + fib(k - 2)

fib(100)            # tức thời
fib.cache_info()    # CacheInfo(hits=98, misses=101, ...)
\`\`\`

Một dòng decorator thay cho cả cache viết tay — và \`cache_info()\` cho bạn đúng con số mà bài này
đếm bằng tay. Ba điều cần nhớ khi dùng \`lru_cache\`: đối số phải **hashable** (không truyền list),
hàm phải **thuần** (cùng đầu vào luôn cho cùng đầu ra — cache một hàm đọc database là mời gọi dữ
liệu cũ), và cache giữ tham chiếu tới kết quả nên có thể **ăn bộ nhớ** nếu \`maxsize=None\`.
`,
    solution: `def fib_with_count(n):
    cache = {}
    dem = [0]

    def fib(k):
        if k in cache:
            return cache[k]
        dem[0] += 1
        if k < 2:
            ket_qua = k
        else:
            ket_qua = fib(k - 1) + fib(k - 2)
        cache[k] = ket_qua
        return ket_qua

    return [fib(n), dem[0]]`,
    complexity: {
      question: 'Với memoization, độ phức tạp thời gian và bộ nhớ là bao nhiêu?',
      options: [
        'Thời gian O(n), bộ nhớ O(n) — cache giữ n + 1 giá trị, và độ sâu đệ quy cũng là O(n)',
        'Thời gian O(2ⁿ), bộ nhớ O(n)',
        'Thời gian O(n), bộ nhớ O(1)',
        'Thời gian O(n log n)',
      ],
      answer: 0,
      why: 'Mỗi k từ 0..n được tính đúng một lần, mỗi lần O(1) → O(n). Bộ nhớ gồm cache n+1 phần tử VÀ ngăn xếp đệ quy sâu n — điểm sau khiến `fib(3000)` gặp `RecursionError` dù đã có cache. Bản dùng vòng lặp (bottom-up) chỉ cần O(1) bộ nhớ nếu giữ hai giá trị cuối.',
    },
    realWorld: 'Memoization là cách tăng tốc rẻ nhất cho các hàm thuần bị gọi lặp: phân tích cấu hình, biên dịch regex, gọi API tra cứu không đổi, tính toán trong vòng lặp render. `@lru_cache` trên một hàm nặng thường là thay đổi một dòng đem lại khác biệt hàng chục lần — nhưng nhớ điều kiện: hàm phải thuần và đối số phải hashable.',
  },
  {
    id: 'py-worker-finish-times',
    title: 'Chia việc cho worker rảnh sớm nhất',
    en: 'Assign Work to the Earliest Free Worker',
    difficulty: 'Medium',
    targetMinutes: 16,
    entry: 'assign',
    lang: 'python',
    harnessSrc: `def harness(fn, args, t):
    try:
        return fn(*args)
    except ValueError:
        return "ValueError"`,
    statement: `
Có \`workers\` worker chạy song song và một danh sách công việc với thời lượng \`durations\`. Lần lượt
giao **từng việc theo đúng thứ tự** cho worker **rảnh sớm nhất** (nếu nhiều worker rảnh cùng lúc thì
chọn worker có chỉ số nhỏ hơn).

Viết hàm \`assign(durations, workers)\` trả về \`[thời_điểm_kết_thúc_của_từng_worker, tổng_thời_gian]\`
— tổng thời gian là lúc worker cuối cùng xong việc.

\`workers <= 0\` → \`raise ValueError\`.

**Ví dụ**

\`\`\`python
assign([3, 1, 2], 2)
# việc 3 -> worker 0 (rảnh lúc 0)  -> kết thúc [3, 0]
# việc 1 -> worker 1 (rảnh lúc 0)  -> kết thúc [3, 1]
# việc 2 -> worker 1 (rảnh lúc 1)  -> kết thúc [3, 3]
# => [[3, 3], 3]
\`\`\`
`,
    starter: `def assign(durations, workers):\n    # Tra ve [danh_sach_thoi_diem_ket_thuc, tong_thoi_gian]\n    \n`,
    tests: [
      { args: [[3, 1, 2], 2], expected: [[3, 3], 3], name: 'Ví dụ trong đề' },
      { args: [[1, 1, 1], 1], expected: [[3], 3], name: 'Một worker làm tuần tự' },
      { args: [[], 3], expected: [[0, 0, 0], 0], name: 'Không có việc nào' },
      { args: [[5], 3], expected: [[5, 0, 0], 5], name: 'Ít việc hơn worker' },
      { args: [[4, 4, 4], 2], expected: [[8, 4], 8], name: 'Bằng nhau thì chọn worker chỉ số nhỏ hơn' },
      { args: [[2, 3], 2], expected: [[2, 3], 3], name: 'Mỗi worker một việc' },
      { args: [[1, 2, 3, 4], 2], expected: [[4, 6], 6], name: 'Bốn việc, hai worker' },
      { args: [[1], 0], expected: 'ValueError', name: 'Không có worker nào' },
    ],
    hints: [
      'Giữ một list `ket_thuc = [0] * workers` — thời điểm mỗi worker rảnh. `[0] * n` tạo list n số 0.',
      'Worker rảnh sớm nhất là `min(ket_thuc)`; chỉ số của nó là `ket_thuc.index(min(ket_thuc))` — và `index` trả về **vị trí đầu tiên** khớp, đúng luật "bằng nhau thì chọn chỉ số nhỏ hơn".',
      'Giao việc = `ket_thuc[i] += d`. Tổng thời gian là `max(ket_thuc)`. Đừng quên guard `if workers <= 0: raise ValueError(...)`.',
    ],
    diagnostics: [
      { test: '\\[\\s*\\[\\s*\\]\\s*\\]\\s*\\*\\s*workers|\\[\\s*\\{\\s*\\}\\s*\\]\\s*\\*', message: 'Cẩn thận: `[[]] * n` tạo n tham chiếu tới CÙNG một list — sửa một cái là sửa tất cả. Với số (`[0] * n`) thì an toàn vì số bất biến; với list/dict thì phải dùng `[[] for _ in range(n)]`.' },
      { test: 'sum\\s*\\(\\s*ket_thuc\\s*\\)', message: '`sum` là tổng thời gian LÀM VIỆC của mọi worker. Vì các worker chạy song song, thời gian trôi qua là `max(ket_thuc)` — worker cuối cùng xong lúc nào.' },
      { test: 'sorted\\s*\\(\\s*durations', message: 'Đề yêu cầu giao việc theo ĐÚNG thứ tự đầu vào. (Sắp xếp giảm dần trước khi giao — thuật toán LPT — cho kết quả cân bằng hơn, nhưng đó là bài toán khác.)' },
    ],
    approach: `
**Thuật toán tham lam (greedy)**

\`\`\`python
def assign(durations, workers):
    if workers <= 0:
        raise ValueError("can it nhat 1 worker")

    ket_thuc = [0] * workers                 # thời điểm mỗi worker rảnh
    for d in durations:
        i = ket_thuc.index(min(ket_thuc))    # worker rảnh sớm nhất
        ket_thuc[i] += d
    return [ket_thuc, max(ket_thuc)]
\`\`\`

**Vì sao \`max\` chứ không phải \`sum\`?**

Vì các worker chạy **song song**. \`sum(ket_thuc)\` là tổng công sức bỏ ra (bằng \`sum(durations)\`);
\`max(ket_thuc)\` là **thời gian trôi qua** (makespan) — con số người dùng cảm nhận. Phân biệt được
hai đại lượng này là điều kiện để nói chuyện về song song hoá:

- Thêm worker **không giảm** tổng công sức, chỉ giảm thời gian trôi qua.
- Thời gian trôi qua không bao giờ nhỏ hơn việc dài nhất — thêm bao nhiêu worker cũng vậy.

**Bẫy \`[x] * n\` với phần tử mutable**

\`\`\`python
[0] * 3        # [0, 0, 0]        an toàn — số bất biến
[[]] * 3       # [[], [], []]     NHƯNG là 3 tham chiếu tới CÙNG một list
a = [[]] * 3
a[0].append(1)
a              # [[1], [1], [1]]  (!)
[[] for _ in range(3)]   # cách đúng: 3 list riêng biệt
\`\`\`

Đây vẫn là bẫy "dùng chung đối tượng mutable" đã gặp ở tham số mặc định (module 2) và dataclass
(module 4) — cùng một gốc rễ, ba hình dạng khác nhau.

**\`index(min(...))\` — gọn nhưng quét hai lượt**

Nó gọi \`min\` (O(w)) rồi \`index\` (O(w)) — tổng O(w) cho mỗi việc, nên toàn bài là **O(n·w)**. Với
số worker lớn, cách chuẩn là dùng **heap** (module 12):

\`\`\`python
import heapq

def assign(durations, workers):
    heap = [(0, i) for i in range(workers)]   # (thời điểm rảnh, chỉ số worker)
    heapq.heapify(heap)
    ket_thuc = [0] * workers
    for d in durations:
        ranh, i = heapq.heappop(heap)          # tuple so sánh theo phần tử đầu -> rồi tới chỉ số
        ket_thuc[i] = ranh + d
        heapq.heappush(heap, (ranh + d, i))
    return [ket_thuc, max(ket_thuc)]
\`\`\`

Chi phí về **O(n log w)**. Chú ý mẹo: đưa \`(thời_điểm, chỉ_số)\` vào heap thì khi thời điểm bằng
nhau, tuple tự so tiếp chỉ số — đúng luật "chọn worker chỉ số nhỏ hơn" mà không cần code thêm.

**Ghi chú về chất lượng thuật toán:** giao việc theo thứ tự đến (như đề) là *list scheduling*. Nếu
được **sắp xếp giảm dần trước** (thuật toán LPT), kết quả bảo đảm không tệ hơn 4/3 lần phương án
tối ưu. Bài toán chia việc tối ưu tuyệt đối là **NP-hard** — nên trong thực tế người ta luôn dùng
heuristic như thế này.
`,
    solution: `def assign(durations, workers):
    if workers <= 0:
        raise ValueError("can it nhat 1 worker")

    ket_thuc = [0] * workers
    for d in durations:
        i = ket_thuc.index(min(ket_thuc))
        ket_thuc[i] += d
    return [ket_thuc, max(ket_thuc)]`,
    complexity: {
      question: 'Với n việc và w worker, lời giải dùng `index(min(...))` tốn bao nhiêu?',
      options: [
        'O(n · w) — mỗi việc phải quét cả w worker để tìm người rảnh sớm nhất',
        'O(n) vì mỗi việc chỉ giao một lần',
        'O(n log w) — giống bản dùng heap',
        'O(w²)',
      ],
      answer: 0,
      why: 'Mỗi việc gọi `min` (quét w phần tử) rồi `index` (quét lại w phần tử) → O(w) mỗi việc, tổng O(n·w). Dùng heap giảm được về O(n log w), đáng làm khi w lớn; với w nhỏ (số nhân CPU) thì bản đơn giản này nhanh hơn vì không có chi phí quản lý heap.',
    },
    realWorld: 'Đây là lõi của mọi bộ điều phối: chia task cho pool thread/process, gán job cho các node CI, phân shard dữ liệu cho consumer. Việc phân biệt "tổng công sức" với "thời gian trôi qua" cũng chính là cách đọc đúng một biểu đồ hiệu năng — và là lý do thêm worker tới một mức nào đó thì không nhanh thêm được nữa (định luật Amdahl).',
  },
];

export const DRILLS_11_15 = {
  'py-typing': PY_TYPING,
  'py-stdlib': PY_STDLIB,
  'py-testing': PY_TESTING,
  'py-advanced-oop': PY_ADVANCED_OOP,
  'py-concurrency-performance': PY_CONCURRENCY,
};
