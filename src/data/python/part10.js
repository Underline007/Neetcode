/**
 * LỘ TRÌNH PYTHON — MODULE 10: Context Manager (câu lệnh with)
 */

export default [
/* ==================================================================== */
{
  id: 'py-context-managers',
  name: 'Context Manager (câu lệnh with)',
  en: 'Context Managers (the with statement)',
  icon: '🔐',
  summary: '`with open(...) as f:` không phải phép màu — đó là một giao thức 2 phương thức (`__enter__`/`__exit__`) mà bạn tự viết được cho bất kỳ cặp "setup/dọn dẹp" nào: khoá/mở khoá, đo thời gian, transaction...',
  lesson: `
## 1. Vấn đề gốc

Rất nhiều thao tác có hình dạng chung: **"chuẩn bị → làm việc → dọn dẹp (luôn phải chạy, kể cả có lỗi)"** —
mở file rồi đóng, khoá một tài nguyên rồi mở khoá, bắt đầu transaction database rồi commit/rollback, đo
thời gian bắt đầu rồi tính thời gian kết thúc. Viết tay bằng try/finally cho MỌI trường hợp này vừa dài
dòng, vừa dễ quên (đặc biệt khi hàm có nhiều điểm \`return\` sớm). Python đóng gói khuôn mẫu này thành một
**giao thức object** gọi là **context manager**, dùng qua từ khoá \`with\`.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript | Python |
|---|---|---|
| Đảm bảo dọn dẹp dù có lỗi | \`try { ... } finally { cleanup() }\` (phải viết tay mỗi lần) | \`with resource() as r: ...\` (logic dọn dẹp đóng gói SẴN trong đối tượng, dùng lại được ở mọi nơi) |
| Nhiều tài nguyên cùng lúc | nhiều khối try/finally lồng nhau | \`with open(a) as fa, open(b) as fb:\` — một dòng |
| Định nghĩa "chuẩn bị/dọn dẹp" riêng | không có giao thức chuẩn tương đương | class có \`__enter__\`/\`__exit__\`, hoặc hàm generator + \`@contextmanager\` |

## 3. Ý tưởng cốt lõi: giao thức 2 phương thức

Một object là context manager nếu nó có đủ hai phương thức:

- \`__enter__(self)\`: chạy khi VÀO khối \`with\`. Giá trị trả về được gán cho biến sau \`as\` (có thể trả về
  \`self\`, hoặc một object khác, hoặc không cần trả gì nếu không dùng \`as\`).
- \`__exit__(self, exc_type, exc_value, traceback)\`: chạy khi RA KHỎI khối \`with\` — **LUÔN LUÔN chạy**, kể
  cả khi khối \`with\` kết thúc bình thường hay có exception xảy ra bên trong. Nếu có exception, ba tham số
  \`exc_type\`/\`exc_value\`/\`traceback\` mô tả lỗi đó; nếu không có lỗi, cả ba đều là \`None\`.

**Giá trị trả về của \`__exit__\` quyết định exception có bị "nuốt" hay không**: trả về \`True\` → exception
bị chặn lại, KHÔNG lan ra ngoài khối \`with\` nữa. Trả về \`False\` (hoặc \`None\`, mặc định) → exception tiếp
tục lan lên như bình thường sau khi \`__exit__\` chạy xong phần dọn dẹp.

**Cách viết gọn hơn — \`@contextmanager\`** (từ module \`contextlib\`): viết một hàm **generator** với ĐÚNG
MỘT \`yield\`. Code TRƯỚC \`yield\` đóng vai trò \`__enter__\`; giá trị sau \`yield\` là giá trị trả về cho
\`as\`; code SAU \`yield\` đóng vai trò \`__exit__\` — và để dọn dẹp luôn chạy dù có lỗi, code sau \`yield\`
phải nằm trong khối \`finally\`.

## 4. Dấu hiệu nhận biết

| Thấy trong đề bài | Nghĩ tới |
|---|---|
| "chuẩn bị tài nguyên, dùng xong phải dọn dẹp, kể cả khi lỗi" | viết context manager thay vì try/finally rải rác nhiều nơi |
| "tạm thời đổi một giá trị/cấu hình, dùng xong khôi phục lại" | \`@contextmanager\` với logic khôi phục trong \`finally\` sau \`yield\` |
| "khoá một tài nguyên, không cho vào lại khi đang bị khoá" | class context manager với \`__enter__\` kiểm tra trạng thái, \`__exit__\` luôn giải phóng |
| "bỏ qua (nuốt) một số loại lỗi cụ thể, loại khác vẫn phải báo" | \`__exit__\` kiểm tra \`exc_type\`, trả \`True\` có điều kiện |
| "đo thời gian chạy của một đoạn code" | context manager ghi \`start\` ở \`__enter__\`, tính hiệu số ở \`__exit__\` |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
from contextlib import contextmanager

# (a) Class-based context manager
class Lock:
    def __init__(self):
        self.locked = False

    def __enter__(self):
        if self.locked:
            raise RuntimeError("Đã bị khoá")
        self.locked = True
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.locked = False   # LUÔN chạy — kể cả khi bên trong with có lỗi
        return False           # không nuốt exception, để nó tiếp tục lan lên

# (b) @contextmanager — viết gọn bằng generator, PHẢI có try/finally quanh yield
@contextmanager
def temporary_value(d, key, value):
    had_key = key in d
    original = d.get(key)
    d[key] = value
    try:
        yield d          # đây là giá trị gán cho "as" — code TRƯỚC dòng này là __enter__
    finally:
        if had_key:
            d[key] = original    # code SAU yield là __exit__, luôn chạy nhờ finally
        else:
            del d[key]

# (c) Nhiều context manager trong một dòng with
with open("a.txt") as fa, open("b.txt") as fb:
    ...
\`\`\`

## 6. Bẫy thường gặp

- **Quên bọc \`try/finally\` quanh \`yield\` trong hàm \`@contextmanager\`**: nếu code bên trong khối \`with\`
  raise lỗi, exception sẽ được ném NGAY TẠI điểm \`yield\` — nếu không có \`try/finally\` bao quanh, phần
  code dọn dẹp sau \`yield\` sẽ **bị bỏ qua hoàn toàn**, tài nguyên không được giải phóng đúng cách.
- **Nhầm tưởng \`__exit__\` trả về \`None\` nghĩa là "có lỗi"**: thực ra \`None\`/\`False\` là giá trị MẶC ĐỊNH
  và ĐÚNG cho hầu hết trường hợp (để exception lan tiếp bình thường) — chỉ khi bạn CHỦ ĐÍCH muốn "nuốt" một
  loại lỗi cụ thể thì mới cần trả về \`True\` một cách có điều kiện, không nên trả \`True\` vô điều kiện (sẽ
  nuốt NHẦM mọi loại lỗi, kể cả lỗi lập trình không liên quan).
- **Dùng khoá (lock)/tài nguyên mà không qua \`with\`**: gọi \`lock.acquire()\` rồi tự \`lock.release()\` tay
  ở cuối hàm — nếu có exception xảy ra ở giữa và không có try/finally, \`release()\` sẽ không bao giờ được
  gọi, tài nguyên bị khoá vĩnh viễn ("deadlock" nếu là lock thật trong đa luồng).

## 7. Ứng dụng thực tế

- **Quản lý file/kết nối database/socket**: đảm bảo đóng kết nối dù xử lý dữ liệu gặp lỗi giữa chừng — đây
  chính là lý do \`with open(...)\`/\`with connection.cursor()\` xuất hiện ở khắp nơi trong code Python thật.
- **Transaction database tự động commit/rollback**: \`__exit__\` kiểm tra có exception hay không để quyết
  định \`commit()\` (thành công) hay \`rollback()\` (có lỗi) — chuẩn thiết kế của hầu hết thư viện ORM.
- **Tạm thời thay đổi trạng thái toàn cục rồi khôi phục**: đổi thư mục làm việc tạm thời, tạm ghi đè biến
  môi trường trong lúc test, tạm bật chế độ debug — dùng xong luôn khôi phục về trạng thái cũ, kể cả khi
  code bên trong \`with\` gặp lỗi.
- **Đo thời gian thực thi (profiling)** một đoạn code cụ thể mà không cần sửa logic bên trong đoạn đó.
`,
  quiz: [
    {
      q: 'Phương thức nào trong giao thức context manager LUÔN LUÔN được gọi khi ra khỏi khối `with`, kể cả khi bên trong xảy ra exception?',
      options: ['`__init__`', '`__enter__`', '`__exit__` — đây chính là điểm khác biệt cốt lõi so với code thường: nó chạy dù khối `with` kết thúc bình thường hay có lỗi', '`__del__`'],
      answer: 2,
      why: '`__exit__` đóng vai trò tương tự khối `finally` — Python đảm bảo nó luôn được gọi khi thoát khỏi `with`, bất kể có exception hay không, giúp code dọn dẹp tài nguyên không bao giờ bị bỏ sót.',
    },
    {
      q: 'Nếu `__exit__(self, exc_type, exc_value, traceback)` trả về `True`, điều gì xảy ra với exception đang xử lý (nếu có)?',
      options: [
        'Exception bị "nuốt" — KHÔNG lan ra ngoài khối `with` nữa, chương trình tiếp tục chạy như không có gì xảy ra',
        'Exception vẫn lan ra ngoài bình thường, giá trị trả về không ảnh hưởng gì',
        'Chương trình sẽ crash ngay lập tức vì `__exit__` không được phép trả về `True`',
        'Exception được ném lại nhưng kèm thêm traceback mới',
      ],
      answer: 0,
      why: 'Đây là quy tắc quan trọng nhất cần nhớ: `True` từ `__exit__` có nghĩa là "tôi đã xử lý xong lỗi này rồi, đừng lan tiếp nữa". Mặc định (`None`/`False`) để lỗi tiếp tục lan lên như bình thường sau khi dọn dẹp xong.',
    },
    {
      q: 'Khi viết context manager bằng `@contextmanager` (generator có 1 `yield`), vì sao BẮT BUỘC phải bọc `try/finally` quanh `yield` nếu muốn code dọn dẹp luôn chạy?',
      options: [
        'Không bắt buộc, code sau `yield` luôn chạy dù có `try/finally` hay không',
        'Vì nếu code bên trong khối `with` (nơi gọi context manager) raise lỗi, exception đó được ném NGAY TẠI điểm `yield` — không có `try/finally` bao quanh, phần code dọn dẹp sau `yield` sẽ bị bỏ qua hoàn toàn',
        'Vì Python yêu cầu mọi generator đều phải có `try/finally`, không riêng gì context manager',
        '`try/finally` chỉ cần thiết khi hàm generator có nhiều hơn 1 `yield`',
      ],
      answer: 1,
      why: 'Đây là bẫy quan trọng nhất của `@contextmanager`: nếu code trong khối `with` lỗi, lỗi đó "nhảy vào" đúng vị trí `yield` trong generator. Không có `try/finally`, phần dọn dẹp phía sau `yield` sẽ không bao giờ được thực thi khi có lỗi — tài nguyên rò rỉ.',
    },
    {
      q: 'Giá trị `None` (mặc định, không ghi rõ `return`) từ `__exit__` có ý nghĩa gì?',
      options: [
        'Tương đương `False` — không nuốt exception, để nó tiếp tục lan lên bình thường sau khi dọn dẹp; đây là hành vi ĐÚNG cho hầu hết trường hợp, không phải một lỗi cần sửa',
        'Gây ra lỗi `TypeError` vì `__exit__` bắt buộc phải trả về giá trị boolean tường minh',
        'Luôn nuốt mọi exception giống như `True`',
        'Chỉ hợp lệ khi không có exception nào xảy ra',
      ],
      answer: 0,
      why: 'Trong Python, giá trị falsy (bao gồm `None`) từ `__exit__` được hiểu là "không nuốt lỗi". Đây là mặc định AN TOÀN — bạn chỉ cần chủ động trả `True` khi THỰC SỰ muốn chặn một loại lỗi cụ thể lại, không nên làm điều đó một cách vô điều kiện.',
    },
    {
      q: '`with open("a.txt") as fa, open("b.txt") as fb:` (hai context manager trên cùng một dòng `with`) tương đương với điều gì?',
      options: [
        'Chỉ `fa` được quản lý bởi context manager, `fb` là biến thường',
        'Hai `with` lồng nhau: mở `fa`, rồi bên trong đó mở `fb` — cả hai đều được đảm bảo đóng đúng cách khi ra khỏi khối, kể cả khi có lỗi',
        'Cú pháp này không hợp lệ trong Python, phải viết thành hai dòng `with` lồng nhau riêng biệt',
        'Cả hai file dùng chung một context, đóng một trong hai sẽ tự đóng cái còn lại',
      ],
      answer: 1,
      why: 'Cú pháp nhiều context manager cách nhau bằng dấu phẩy trên một dòng `with` là cách viết gọn của việc lồng nhiều khối `with` vào nhau — cả hai tài nguyên đều được đảm bảo dọn dẹp đúng cách (theo thứ tự ngược lại với lúc mở) khi thoát khỏi khối, dù có lỗi hay không.',
    },
    {
      q: 'Sau khối lệnh sau, `print(f.closed)` cho kết quả gì?\n\nwith open("data.txt") as f:\n    data = f.read()\nprint(f.closed)',
      options: ['NameError — f chỉ tồn tại bên trong khối with', 'True — f vẫn tồn tại, chỉ là file đã được đóng', 'False', 'None'],
      answer: 1,
      why: '`with` **không tạo phạm vi biến mới** — khác hẳn với khối lệnh trong JavaScript hay C. Trong Python, chỉ hàm, class và module mới tạo scope; `if`, `for`, `while`, `with` thì không. Vì vậy `f` (và cả `data`) vẫn sống sau khối lệnh. Điều `with` đảm bảo không phải là "biến biến mất" mà là "**phương thức dọn dẹp đã chạy**": file đã đóng, nên `f.read()` lúc này sẽ raise `ValueError: I/O operation on closed file`.',
    },
    {
      q: 'Nếu `__enter__` raise exception ngay khi vừa vào khối `with`, thì `__exit__` có được gọi không?',
      options: [
        'Có — `__exit__` luôn luôn được gọi',
        'Không — `with` chưa "vào" được, nên chưa có gì để dọn dẹp',
        'Có, nhưng với cả ba tham số đều là None',
        'Tuỳ vào việc `__enter__` có `return self` hay không',
      ],
      answer: 1,
      why: 'Lời hứa của `with` chính xác là: "**nếu** đã vào được khối lệnh thì chắc chắn `__exit__` sẽ chạy". Khi `__enter__` hỏng giữa chừng, hợp đồng chưa bắt đầu — exception lan thẳng ra ngoài và `__exit__` không được gọi. Hệ quả thực hành rất quan trọng: nếu `__enter__` của bạn chiếm **nhiều** tài nguyên (mở 3 file), nó phải tự dọn phần đã chiếm khi hỏng ở giữa; đừng trông cậy vào `__exit__`.',
    },
    {
      q: 'Đoạn code sau in ra gì?\n\nclass T:\n    def __enter__(self):\n        pass\n    def __exit__(self, *args):\n        pass\n\nwith T() as t:\n    print(t)',
      options: ['<T object at 0x...>', 'None', 'TypeError: __enter__ phải return self', 'T'],
      answer: 1,
      why: 'Biến sau `as` nhận **giá trị trả về của `__enter__`**, chứ không phải bản thân context manager. Ở đây `__enter__` không có `return` nên trả về `None`, và `t` là `None` — mọi lời gọi `t.something()` sau đó sẽ raise `AttributeError: NoneType object has no attribute ...`, một thông báo lỗi chẳng gợi ý gì về nguyên nhân thật. Đó là lý do `return self` gần như luôn là dòng cuối của `__enter__`. (Ngoại lệ có chủ đích: `open()` trả về file object, còn `lock` thì trả về `True`/`None` vì bạn không cần dùng tới nó.)',
    },
    {
      q: 'Hàm decorate bằng `@contextmanager` có HAI lệnh `yield`. Điều gì xảy ra khi ra khỏi khối `with`?',
      options: [
        'Khối `with` chạy hai lần',
        'RuntimeError: generator didn\'t stop',
        'Lệnh `yield` thứ hai bị bỏ qua',
        'Lỗi ngay khi định nghĩa hàm',
      ],
      answer: 1,
      why: '`@contextmanager` dịch generator thành context manager theo đúng một khuôn: phần trước `yield` là `__enter__`, phần sau là `__exit__`. Vì vậy generator **bắt buộc phải dừng lại đúng một lần**. Khi ra khỏi khối, `contextlib` gọi `next()` và kỳ vọng nhận `StopIteration`; nếu generator lại yield tiếp, nó raise `RuntimeError: generator didn\'t stop`. Cùng logic đó, nếu bạn nuốt exception bằng `except: pass` quanh `yield` rồi yield thêm lần nữa, bạn sẽ nhận `RuntimeError: generator didn\'t stop after throw()`.',
    },
  ],
  problems: [
    {
      id: 'py-suppress-context-manager',
      title: 'Context manager nuốt lỗi có chọn lọc',
      en: 'Selective Exception-Suppressing Context Manager',
      difficulty: 'Hard',
      targetMinutes: 15,
      entry: 'demo',
      lang: 'python',
      statement: `
Viết class \`Suppressor\` là một context manager: nhận một hoặc nhiều LOẠI exception khi khởi tạo
(\`Suppressor(ValueError)\` hoặc \`Suppressor(ValueError, KeyError)\`). Khi dùng trong khối \`with\`:
- Nếu bên trong khối \`with\` raise một exception thuộc **đúng những loại đã khai báo**, \`Suppressor\` phải
  **nuốt lỗi đó** (chương trình tiếp tục chạy tiếp sau khối \`with\`, không crash).
- Nếu raise một loại exception **khác** (không nằm trong danh sách đã khai báo), lỗi phải **lan ra ngoài
  bình thường** (không được nuốt).

Sau đó viết hàm \`demo(kind)\` minh hoạ 5 tình huống theo \`kind\` (xem test) và trả về một trong 3 chuỗi:
\`"ok"\` (không có lỗi gì xảy ra), \`"recovered"\` (lỗi bị \`Suppressor\` nuốt, code sau \`with\` chạy tiếp
bình thường), hoặc \`"propagated"\` (lỗi KHÔNG bị nuốt, lan ra ngoài và bị bắt bởi \`try/except\` ở tầng
\`demo\`).
`,
      starter: `class Suppressor:\n    def __init__(self, *exc_types):\n        # Luu lai cac loai exception can nuot\n        \n\n    def __enter__(self):\n        return self\n\n    def __exit__(self, exc_type, exc_value, traceback):\n        # Tra ve True neu exc_type thuoc cac loai da khai bao (nuot loi)\n        # Tra ve False/None neu khong (loi tiep tuc lan len)\n        \n\n\ndef demo(kind):\n    result = \"ok\"\n    try:\n        if kind == \"none\":\n            with Suppressor(ValueError):\n                pass\n        elif kind == \"suppressed\":\n            with Suppressor(ValueError):\n                raise ValueError(\"loi\")\n            result = \"recovered\"\n        elif kind == \"unsuppressed\":\n            with Suppressor(ValueError):\n                raise TypeError(\"loi\")\n            result = \"recovered\"\n        elif kind == \"suppressed_multi\":\n            with Suppressor(ValueError, KeyError):\n                raise KeyError(\"loi\")\n            result = \"recovered\"\n        elif kind == \"unsuppressed_multi\":\n            with Suppressor(ValueError, KeyError):\n                raise TypeError(\"loi\")\n            result = \"recovered\"\n    except Exception:\n        result = \"propagated\"\n    return result\n`,
      tests: [
        { args: ['none'], expected: 'ok', name: 'Không có lỗi xảy ra' },
        { args: ['suppressed'], expected: 'recovered', name: 'ValueError bị Suppressor(ValueError) nuốt' },
        { args: ['unsuppressed'], expected: 'propagated', name: 'TypeError KHÔNG thuộc Suppressor(ValueError) -> lan ra ngoài' },
        { args: ['suppressed_multi'], expected: 'recovered', name: 'KeyError bị Suppressor(ValueError, KeyError) nuốt' },
        { args: ['unsuppressed_multi'], expected: 'propagated', name: 'TypeError không thuộc danh sách nhiều loại -> lan ra ngoài' },
      ],
      hints: [
        'Trong `__init__`, lưu `exc_types` (một tuple) vào `self` để dùng lại trong `__exit__`: `self.exc_types = exc_types`.',
        'Trong `__exit__(self, exc_type, exc_value, traceback)`: nếu không có lỗi (`exc_type is None`), trả về gì cũng được (không ảnh hưởng). Nếu có lỗi, kiểm tra `issubclass(exc_type, self.exc_types)` — hàm `issubclass` chấp nhận tham số thứ hai là MỘT tuple các class, tự động kiểm tra khớp với BẤT KỲ loại nào trong đó.',
        'Trả về đúng kết quả của biểu thức `issubclass(...)` (là `True`/`False`) — không cần if/else dài dòng, biểu thức boolean này chính là giá trị `__exit__` cần trả về.',
      ],
      diagnostics: [
        { test: 'return\\s+True\\s*$', message: 'Nếu `__exit__` LUÔN trả về `True` (không điều kiện), nó sẽ nuốt MỌI loại lỗi, kể cả những loại không được khai báo trong `Suppressor(...)` — hãy kiểm tra `exc_type` có khớp với `self.exc_types` đã lưu hay không trước khi quyết định nuốt.' },
      ],
      approach: `
Bài này luyện đúng phần khó nhất của \`__exit__\`: **quyết định CÓ ĐIỀU KIỆN** có nuốt lỗi hay không, dựa
trên loại lỗi thực tế xảy ra.

\`\`\`python
class Suppressor:
    def __init__(self, *exc_types):
        self.exc_types = exc_types

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            return False
        return issubclass(exc_type, self.exc_types)
\`\`\`

**Vì sao \`issubclass(exc_type, self.exc_types)\` mà không phải \`exc_type in self.exc_types\`?** Cả hai đều
hoạt động đúng cho trường hợp lỗi CHÍNH XÁC là một trong các loại đã khai báo. Nhưng \`issubclass\` còn xử lý
đúng trường hợp lỗi thực tế là một **lớp CON** của loại đã khai báo (ví dụ khai báo \`Suppressor(Exception)\`
thì phải nuốt được cả \`ValueError\`, \`TypeError\`... vì tất cả đều là lớp con của \`Exception\`) — đây chính
là cách \`except\` thật của Python hoạt động phía dưới, nên viết \`Suppressor\` mô phỏng đúng ngữ nghĩa đó
mới nhất quán.
`,
      solution: `class Suppressor:
    def __init__(self, *exc_types):
        self.exc_types = exc_types

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            return False
        return issubclass(exc_type, self.exc_types)


def demo(kind):
    result = "ok"
    try:
        if kind == "none":
            with Suppressor(ValueError):
                pass
        elif kind == "suppressed":
            with Suppressor(ValueError):
                raise ValueError("loi")
            result = "recovered"
        elif kind == "unsuppressed":
            with Suppressor(ValueError):
                raise TypeError("loi")
            result = "recovered"
        elif kind == "suppressed_multi":
            with Suppressor(ValueError, KeyError):
                raise KeyError("loi")
            result = "recovered"
        elif kind == "unsuppressed_multi":
            with Suppressor(ValueError, KeyError):
                raise TypeError("loi")
            result = "recovered"
    except Exception:
        result = "propagated"
    return result`,
      complexity: {
        question: 'Độ phức tạp thời gian của `__exit__` theo số loại exception k đã khai báo trong `Suppressor(...)`?',
        options: ['O(1) bất kể k', 'O(k) trong trường hợp xấu nhất — `issubclass` với một tuple loại phải kiểm tra lần lượt cho tới khi tìm thấy khớp hoặc hết danh sách', 'O(k²)', 'O(2^k)'],
        answer: 1,
        why: '`issubclass(cls, tuple_of_classes)` về bản chất kiểm tra khớp với từng phần tử trong tuple, chi phí tỉ lệ thuận với số lượng loại exception đã khai báo trong trường hợp xấu nhất (khớp với phần tử cuối cùng hoặc không khớp gì).',
      },
      realWorld: 'Chính module chuẩn `contextlib.suppress(*exceptions)` của Python làm y hệt điều này — dùng để bỏ qua gọn gàng một số loại lỗi biết trước là "không sao" (ví dụ `os.remove` lỗi vì file không tồn tại), mà không cần viết `try/except: pass` dài dòng ở khắp nơi trong code.',
    },
    {
      id: 'py-temporary-value',
      title: 'Tạm thời đổi giá trị rồi khôi phục (@contextmanager)',
      en: 'Temporary Value Context Manager',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'temporary_value',
      lang: 'python',
      statement: `
Dùng \`@contextmanager\` (từ \`contextlib\`), viết hàm \`temporary_value(d, key, value)\`: một context manager
**tạm thời** gán \`d[key] = value\` trong lúc ở TRONG khối \`with\`, và **khôi phục lại đúng trạng thái ban
đầu** khi ra khỏi khối \`with\`:
- Nếu \`key\` đã tồn tại trong \`d\` trước đó → khôi phục lại **giá trị cũ**.
- Nếu \`key\` **chưa từng** tồn tại trong \`d\` → **xoá** \`key\` đó đi sau khi ra khỏi \`with\` (không để lại
  key thừa không có trong dict gốc).

**Ví dụ** (\`d = {"a": 1}\`):
- Trong \`with temporary_value(d, "a", 99):\` → \`d\` là \`{"a": 99}\`
- Sau khi ra khỏi \`with\` → \`d\` trở lại \`{"a": 1}\`
`,
      starter: `from contextlib import contextmanager\n\n@contextmanager\ndef temporary_value(d, key, value):\n    # Ghi de d[key] = value, dam bao khoi phuc dung trang thai ban dau khi ra khoi with\n    # (kha nang bat 1 hoac 2 gia tri sau yield)\n    \n`,
      tests: [
        { args: [{ a: 1 }, 'a', 99], expected: [{ a: 99 }, { a: 1 }], name: 'Key đã tồn tại -> khôi phục giá trị cũ' },
        { args: [{ a: 1 }, 'b', 5], expected: [{ a: 1, b: 5 }, { a: 1 }], name: 'Key chưa tồn tại -> xoá sau khi khôi phục' },
        { args: [{}, 'x', 10], expected: [{ x: 10 }, {}], name: 'Dict ban đầu rỗng' },
        { args: [{ x: 1, y: 2 }, 'y', 0], expected: [{ x: 1, y: 0 }, { x: 1, y: 2 }], name: 'Ghi đè giá trị bằng 0 (falsy nhưng hợp lệ)' },
      ],
      hints: [
        'Trước `yield`: lưu lại xem `key` đã tồn tại trong `d` chưa (`had_key = key in d`) và giá trị cũ nếu có (`original = d.get(key)`), rồi gán `d[key] = value`.',
        '`yield d` (hoặc `yield` không kèm gì) — đây là điểm dừng, code bên trong khối `with` của người gọi sẽ chạy tại đây.',
        'Bọc phần code SAU `yield` trong `try/finally` (đặt `yield` bên trong `try`): trong `finally`, nếu `had_key` là `True` thì `d[key] = original` (khôi phục), ngược lại `del d[key]` (xoá key đã thêm tạm).',
      ],
      diagnostics: [
        { test: '^(?![\\s\\S]*finally)[\\s\\S]*def\\s+temporary_value', message: 'Không thấy `finally` trong lời giải. Nhớ đặt `yield` bên trong khối `try`, với phần khôi phục giá trị nằm trong `finally` — nếu không, khi code bên trong `with` (của người gọi) gây lỗi, phần khôi phục giá trị gốc sẽ bị bỏ qua, để lại `d` ở trạng thái sai.' },
      ],
      approach: `
Đây là ví dụ chuẩn cho \`@contextmanager\`: setup trước \`yield\`, cleanup sau \`yield\` — và cleanup PHẢI nằm
trong \`finally\` để đảm bảo luôn chạy.

\`\`\`python
from contextlib import contextmanager

@contextmanager
def temporary_value(d, key, value):
    had_key = key in d
    original = d.get(key)
    d[key] = value
    try:
        yield d
    finally:
        if had_key:
            d[key] = original
        else:
            del d[key]
\`\`\`

**Vì sao phải phân biệt "key đã tồn tại với giá trị nào đó" và "key chưa từng tồn tại"?** Nếu chỉ đơn giản
lưu \`original = d.get(key)\` (mặc định trả \`None\` nếu không có) rồi luôn luôn \`d[key] = original\` lúc
khôi phục, trường hợp key CHƯA TỪNG tồn tại sẽ bị "khôi phục" thành \`d[key] = None\` — để lại một key thừa
không có trong dict gốc (thay vì xoá hẳn key đó đi). Đây là bẫy tinh vi: hai trường hợp "giá trị là None" và
"key không tồn tại" nghe giống nhau nhưng có ý nghĩa hoàn toàn khác — y hệt bẫy \`None\` vs "không có dữ
liệu" đã học ở module Cú pháp nền tảng.
`,
      solution: `from contextlib import contextmanager

@contextmanager
def temporary_value(d, key, value):
    had_key = key in d
    original = d.get(key)
    d[key] = value
    try:
        yield d
    finally:
        if had_key:
            d[key] = original
        else:
            del d[key]`,
      harnessSrc: `def harness(fn, args, t):
    d, key, value = args
    d = dict(d)
    with fn(d, key, value):
        during = dict(d)
    after = dict(d)
    return [during, after]`,
      complexity: {
        question: 'Độ phức tạp thời gian của một lần vào/ra khối `with temporary_value(...)`?',
        options: ['O(1) — kiểm tra key, gán/xoá một phần tử dict đều là thao tác trung bình hằng số', 'O(n) theo kích thước d', 'O(log n)', 'O(n²)'],
        answer: 0,
        why: 'Kiểm tra `key in d`, `d.get(key)`, gán `d[key] = ...`, và `del d[key]` đều là các thao tác dict trung bình O(1), không phụ thuộc vào số lượng phần tử hiện có trong `d`.',
      },
      realWorld: 'Tạm thời ghi đè biến môi trường/cấu hình trong lúc chạy test (rồi khôi phục để không ảnh hưởng các test khác), tạm bật một feature flag để test một nhánh code cụ thể, tạm thay đổi một tham số hệ thống trong một đoạn xử lý ngắn rồi trả về đúng trạng thái ban đầu.',
    },
    {
      id: 'py-reentrant-lock',
      title: 'Khoá không cho vào lại (non-reentrant lock)',
      en: 'Non-Reentrant Lock Context Manager',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'run_with_lock',
      lang: 'python',
      statement: `
Viết class \`Lock\` là context manager mô phỏng một khoá đơn giản, **không cho vào lại khi đang bị khoá**:
- \`__enter__\`: nếu khoá **đang bị khoá** (\`self.locked is True\`), \`raise RuntimeError("Đã bị khoá")\`.
  Ngược lại, đặt \`self.locked = True\` rồi trả về \`self\`.
- \`__exit__\`: đặt \`self.locked = False\` (**LUÔN LUÔN chạy**, kể cả khi bên trong \`with\` có lỗi), và
  **không nuốt** exception (lỗi bên trong vẫn phải lan ra ngoài bình thường).

Sau đó viết hàm \`run_with_lock(should_raise)\`:
- Tạo một \`Lock()\` mới, chuẩn bị \`result = []\`.
- Bên trong \`with lock:\`, thêm \`lock.locked\` vào \`result\`; nếu \`should_raise\` là \`True\`, \`raise
  ValueError("lỗi bên trong")\`.
- Bắt \`ValueError\` (nếu có) bên ngoài khối \`with\`, thêm chuỗi \`"caught"\` vào \`result\` khi bắt được.
- Sau khối \`with\`/\`try\`, thêm \`lock.locked\` vào \`result\` lần nữa (để kiểm tra khoá đã được giải phóng).
- Trả về \`result\`.
`,
      starter: `class Lock:\n    def __init__(self):\n        self.locked = False\n\n    def __enter__(self):\n        # Neu dang locked: raise RuntimeError. Nguoc lai: khoa lai va tra ve self\n        \n\n    def __exit__(self, exc_type, exc_value, traceback):\n        # Luon mo khoa (self.locked = False), khong nuot exception\n        \n\n\ndef run_with_lock(should_raise):\n    lock = Lock()\n    result = []\n    try:\n        with lock:\n            result.append(lock.locked)\n            if should_raise:\n                raise ValueError(\"loi ben trong\")\n    except ValueError:\n        result.append(\"caught\")\n    result.append(lock.locked)\n    return result\n`,
      tests: [
        { args: [false], expected: [true, false], name: 'Không lỗi: locked=True bên trong, False sau khi ra' },
        { args: [true], expected: [true, 'caught', false], name: 'Có lỗi: vẫn locked=True bên trong, lỗi bị bắt bên ngoài, và locked=False được khôi phục dù có lỗi' },
      ],
      hints: [
        '`__enter__`: `if self.locked: raise RuntimeError("Đã bị khoá")`, sau đó `self.locked = True` và `return self`.',
        '`__exit__(self, exc_type, exc_value, traceback)`: luôn đặt `self.locked = False` ở dòng ĐẦU TIÊN (hoặc dòng duy nhất trước khi return) — bất kể `exc_type` là gì.',
        'Kết thúc `__exit__` bằng `return False` (hoặc không `return` gì, mặc định cũng là `None`/falsy) để KHÔNG nuốt exception — lỗi `ValueError` bên trong `with` phải tiếp tục lan ra ngoài để `run_with_lock` bắt được ở khối `except` của nó.',
      ],
      diagnostics: [
        { test: 'def\\s+__exit__[\\s\\S]*?return\\s+True', message: '`__exit__` đang trả về `True` — điều này sẽ NUỐT exception `ValueError`, khiến `except ValueError` bên trong `run_with_lock` không bao giờ chạy được và chuỗi "caught" sẽ không xuất hiện trong kết quả.' },
      ],
      approach: `
Bài này chứng minh rõ nhất tính chất **"\`__exit__\` luôn chạy, giống \`finally\`"** — khoá phải được giải
phóng dù bên trong \`with\` có lỗi hay không, và việc giải phóng khoá KHÔNG liên quan gì tới việc có nuốt lỗi
đó hay không (đây là hai việc độc lập).

\`\`\`python
class Lock:
    def __init__(self):
        self.locked = False

    def __enter__(self):
        if self.locked:
            raise RuntimeError("Đã bị khoá")
        self.locked = True
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.locked = False   # luôn chạy, không phụ thuộc exc_type
        return False           # không nuốt lỗi — độc lập với việc dọn dẹp ở trên
\`\`\`

**Vì sao tách biệt "dọn dẹp" (\`self.locked = False\`) và "quyết định nuốt lỗi" (\`return\`)?** Đây là hai
trách nhiệm HOÀN TOÀN KHÁC NHAU của \`__exit__\`: một là đảm bảo tài nguyên được giải phóng đúng cách (luôn
luôn phải làm), hai là quyết định xem lỗi có nên tiếp tục lan lên tầng gọi hay không (tuỳ từng use-case cụ
thể). Nhầm lẫn hai việc này — ví dụ chỉ mở khoá khi KHÔNG có lỗi — sẽ dẫn tới khoá bị "kẹt" mãi mãi mỗi khi
có exception xảy ra, một lỗi rất khó phát hiện vì chỉ xuất hiện trong đường lỗi (error path), không xuất
hiện khi test với input hợp lệ.
`,
      solution: `class Lock:
    def __init__(self):
        self.locked = False

    def __enter__(self):
        if self.locked:
            raise RuntimeError("Đã bị khoá")
        self.locked = True
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.locked = False
        return False


def run_with_lock(should_raise):
    lock = Lock()
    result = []
    try:
        with lock:
            result.append(lock.locked)
            if should_raise:
                raise ValueError("loi ben trong")
    except ValueError:
        result.append("caught")
    result.append(lock.locked)
    return result`,
      complexity: {
        question: 'Độ phức tạp thời gian của `run_with_lock`?',
        options: ['O(1) — số bước cố định không phụ thuộc input', 'O(n) theo giá trị should_raise', 'O(log n)', 'Không xác định được'],
        answer: 0,
        why: 'Toàn bộ hàm chỉ có một số thao tác cố định (kiểm tra, gán, append vào list tối đa 3 lần) — không có vòng lặp hay đệ quy phụ thuộc kích thước input.',
      },
      realWorld: '`threading.Lock`, kết nối database dùng connection pool, hay bất kỳ tài nguyên "độc quyền" nào (chỉ một luồng/tiến trình được dùng tại một thời điểm) đều cần đảm bảo giải phóng đúng cách dù code sử dụng nó có lỗi hay không — nếu không, một lỗi ở nơi dùng tài nguyên có thể khiến toàn bộ phần còn lại của hệ thống bị "treo" chờ tài nguyên không bao giờ được giải phóng (deadlock).',
    },
    {
      id: 'py-transaction-context',
      title: 'Context manager kiểu transaction (commit / rollback)',
      en: 'Transaction Context Manager',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'run_transaction',
      lang: 'python',
      statement: `
Viết class \`Transaction\` dùng được với câu lệnh \`with\`, mô phỏng một giao dịch database:

- \`self.pending\` — danh sách thao tác đang chờ; \`self.log\` — nhật ký sự kiện.
- \`add(op)\` — thêm một thao tác vào \`pending\`.
- \`__enter__\` — ghi \`"begin"\` vào \`log\` và **trả về chính nó** (để dùng được với \`as\`).
- \`__exit__\`:
  - Nếu khối \`with\` kết thúc **bình thường**: ghi \`"commit:" + op\` cho **từng** thao tác trong \`pending\`
    (theo đúng thứ tự đã thêm).
  - Nếu có exception: ghi đúng một dòng \`"rollback"\`.
  - Cả hai trường hợp: xoá sạch \`pending\`, và **KHÔNG nuốt exception** — nó phải lan tiếp ra ngoài.

Hàm \`run_transaction\` đã được viết sẵn ở phần dưới khung code — **đừng sửa nó**, chỉ hoàn thiện class.

**Ví dụ**
- \`["a", "b"]\` → \`["begin", "commit:a", "commit:b"]\`
- \`["a", "boom", "b"]\` → \`["begin", "rollback", "caught"]\`
`,
      starter: `class Transaction:\n    def __init__(self):\n        self.pending = []\n        self.log = []\n\n    def add(self, op):\n        self.pending.append(op)\n\n    # Bổ sung __enter__ và __exit__\n    \n\n\n# ----- KHÔNG SỬA PHẦN DƯỚI ĐÂY -----\ndef run_transaction(ops):\n    t = Transaction()\n    try:\n        with t as tx:\n            for op in ops:\n                if op == "boom":\n                    raise ValueError(op)\n                tx.add(op)\n    except ValueError:\n        t.log.append("caught")\n    return t.log\n`,
      tests: [
        { args: [['a', 'b']], expected: ['begin', 'commit:a', 'commit:b'], name: 'Giao dịch thành công' },
        { args: [['a', 'boom', 'b']], expected: ['begin', 'rollback', 'caught'], name: 'Lỗi giữa chừng — rollback và KHÔNG nuốt lỗi' },
        { args: [[]], expected: ['begin'], name: 'Giao dịch rỗng' },
        { args: [['boom']], expected: ['begin', 'rollback', 'caught'], name: 'Lỗi ngay thao tác đầu tiên' },
        { args: [['x']], expected: ['begin', 'commit:x'], name: 'Một thao tác' },
        { args: [['a', 'b', 'c', 'boom']], expected: ['begin', 'rollback', 'caught'], name: 'Lỗi ở cuối — mọi thao tác trước đó đều bị huỷ' },
        { args: [['p', 'q', 'r']], expected: ['begin', 'commit:p', 'commit:q', 'commit:r'], name: 'Ba thao tác, đúng thứ tự' },
      ],
      hints: [
        '`__enter__(self)` chỉ cần ghi `"begin"` và `return self`. Thiếu `return self` thì biến sau `as` sẽ là `None` và `tx.add(op)` raise `AttributeError`.',
        'Chữ ký bắt buộc: `__exit__(self, exc_type, exc_value, traceback)`. Phân biệt hai trường hợp bằng `if exc_type is None:` — không có exception thì commit, ngược lại thì rollback.',
        'Chi tiết quyết định test "caught": giá trị trả về của `__exit__`. Trả `True` nghĩa là "tôi đã xử lý xong, nuốt exception này" — khi đó khối `except ValueError` bên ngoài sẽ không chạy và `"caught"` biến mất. Hãy `return False` (hoặc đơn giản là không viết `return` nào).',
      ],
      diagnostics: [
        { test: 'def\\s+__exit__[\\s\\S]{0,400}?return\\s+True', message: '`__exit__` trả về `True` sẽ **nuốt** exception: nó không lan ra ngoài nữa, nên khối `except ValueError` của `run_transaction` không chạy và `"caught"` không được ghi. Một transaction phải rollback rồi vẫn để lỗi báo lên trên. Hãy `return False`.' },
        { test: 'def\\s+__enter__(?![\\s\\S]{0,200}?return\\s+self)', message: 'Kiểm tra lại `__enter__`: nó cần `return self`. Nếu không, biến sau `as` nhận `None` và mọi lời gọi phương thức trên đó sẽ raise `AttributeError`.' },
        { test: 'def\\s+__exit__\\s*\\(\\s*self\\s*\\)', message: '`__exit__` phải nhận đúng bốn tham số: `(self, exc_type, exc_value, traceback)`. Python luôn truyền đủ ba thông tin về exception (hoặc ba giá trị `None` nếu không có lỗi).' },
      ],
      approach: `
Transaction là **ví dụ mẫu mực nhất** của context manager, vì nó cần cả hai vế mà \`with\` cung cấp: một
điểm bắt đầu rõ ràng, và một điểm kết thúc **có phân biệt thành công/thất bại**.

\`\`\`python
class Transaction:
    def __init__(self):
        self.pending = []
        self.log = []

    def add(self, op):
        self.pending.append(op)

    def __enter__(self):
        self.log.append("begin")
        return self                      # biến sau 'as' nhận giá trị này

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            for op in self.pending:
                self.log.append("commit:" + op)
        else:
            self.log.append("rollback")
        self.pending.clear()
        return False                     # KHÔNG nuốt exception
\`\`\`

**Ba tham số của \`__exit__\` chính là "kênh thông tin" về chuyện đã xảy ra:**

| Tình huống | \`exc_type\` | Ý nghĩa |
|---|---|---|
| Khối \`with\` chạy xong bình thường | \`None\` | commit |
| Có exception (kể cả từ \`return\`/\`break\` bên trong? không) | lớp exception | rollback |

Nhờ vậy \`__exit__\` **quyết định được** hành vi dọn dẹp dựa trên kết quả — điều mà một khối \`finally\`
đơn thuần không làm được nếu không tự bắt lỗi.

**Giá trị trả về mới là phần dễ sai nhất.** Nó KHÔNG phải là "báo đã dọn dẹp xong":

- \`return False\` / không \`return\` gì (\`None\`) → exception **tiếp tục lan ra ngoài**. Đây là mặc định
  đúng cho hầu hết trường hợp.
- \`return True\` → exception bị **nuốt hoàn toàn**, chương trình chạy tiếp như chưa có gì. Chỉ dùng khi
  bạn cố ý làm việc đó (ví dụ \`contextlib.suppress\`).

Với transaction, nuốt lỗi là sai nghiêm trọng: lớp gọi phía trên sẽ tưởng mọi thứ thành công, trong khi dữ
liệu đã bị rollback. Đây đúng là loại bug làm hỏng tính toàn vẹn dữ liệu mà không ai phát hiện cho tới khi
đối soát sổ sách.

**Vì sao \`pending.clear()\` nằm ngoài cả hai nhánh?** Vì "dọn sạch trạng thái" phải xảy ra trong MỌI
trường hợp — đúng tinh thần \`finally\`. Nếu chỉ xoá ở nhánh commit, một transaction thất bại sẽ để lại rác
làm bẩn giao dịch tiếp theo.
`,
      solution: `class Transaction:
    def __init__(self):
        self.pending = []
        self.log = []

    def add(self, op):
        self.pending.append(op)

    def __enter__(self):
        self.log.append("begin")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            for op in self.pending:
                self.log.append("commit:" + op)
        else:
            self.log.append("rollback")
        self.pending.clear()
        return False


def run_transaction(ops):
    t = Transaction()
    try:
        with t as tx:
            for op in ops:
                if op == "boom":
                    raise ValueError(op)
                tx.add(op)
    except ValueError:
        t.log.append("caught")
    return t.log`,
      complexity: {
        question: 'Độ phức tạp thời gian của một giao dịch có n thao tác?',
        options: [
          'O(n) — mỗi thao tác được thêm một lần và ghi log tối đa một lần',
          'O(n²) vì `__exit__` phải duyệt lại pending cho từng thao tác',
          'O(1) vì `__exit__` chỉ chạy một lần',
          'O(n log n)',
        ],
        answer: 0,
        why: '`add` là O(1) khấu hao, và `__exit__` duyệt `pending` đúng một lượt → O(n) tổng cộng. Điểm đáng chú ý về bộ nhớ: mô hình này giữ TOÀN BỘ thao tác trong RAM cho tới lúc commit — chính là lý do transaction thật bị giới hạn kích thước, và là lý do người ta chia dữ liệu lớn thành nhiều lô nhỏ thay vì một transaction khổng lồ.',
      },
      realWorld: 'Đây chính là cách `sqlite3.Connection`, SQLAlchemy `session.begin()`, và các ORM khác hoạt động: `with conn:` tự commit khi thành công và rollback khi có exception. Cùng khuôn mẫu đó áp dụng cho ghi file theo kiểu "tất cả hoặc không gì" (ghi vào file tạm rồi đổi tên), gửi lô message lên queue, và cập nhật nhiều dịch vụ trong một thao tác nghiệp vụ.',
    },
    {
      id: 'py-close-in-reverse',
      title: 'Chiếm nhiều tài nguyên và dọn dẹp theo thứ tự ngược',
      en: 'Acquire Many, Release in Reverse',
      difficulty: 'Medium',
      targetMinutes: 16,
      entry: 'open_all',
      lang: 'python',
      statement: `
Viết hàm \`open_all(names, fail_on)\` mô phỏng việc chiếm lần lượt nhiều tài nguyên và trả về nhật ký:

Với mỗi tên trong \`names\`, theo thứ tự:
- Nếu tên đó bằng \`fail_on\` → \`raise RuntimeError(tên)\` (tài nguyên này **không** được mở).
- Ngược lại → ghi \`"open:" + tên\`.

Nếu mở được **hết**, ghi \`"work"\`. Nếu có lỗi, bắt lại và ghi \`"error"\`.

**Trong mọi trường hợp**, cuối cùng phải đóng những tài nguyên **đã thực sự mở được**, theo **thứ tự
ngược** với lúc mở, ghi \`"close:" + tên\` cho từng cái.

\`fail_on\` có thể là \`None\` (không có lỗi nào).

**Ví dụ**
- \`(["a", "b"], None)\` → \`["open:a", "open:b", "work", "close:b", "close:a"]\`
- \`(["a", "b", "c"], "b")\` → \`["open:a", "error", "close:a"]\` ← chỉ \`a\` được mở nên chỉ \`a\` bị đóng
`,
      starter: `def open_all(names, fail_on):\n    # Mở lần lượt, luôn đóng những cái ĐÃ mở, theo thứ tự ngược\n    \n`,
      tests: [
        { args: [['a', 'b'], null], expected: ['open:a', 'open:b', 'work', 'close:b', 'close:a'], name: 'Mở hết, đóng ngược' },
        { args: [['a', 'b', 'c'], 'b'], expected: ['open:a', 'error', 'close:a'], name: 'Hỏng ở giữa — chỉ đóng cái đã mở' },
        { args: [[], null], expected: ['work'], name: 'Không có tài nguyên nào' },
        { args: [['a'], 'a'], expected: ['error'], name: 'Hỏng ngay cái đầu tiên — không đóng gì cả' },
        { args: [['a', 'b', 'c'], null], expected: ['open:a', 'open:b', 'open:c', 'work', 'close:c', 'close:b', 'close:a'], name: 'Ba tài nguyên' },
        { args: [['a', 'b', 'c'], 'c'], expected: ['open:a', 'open:b', 'error', 'close:b', 'close:a'], name: 'Hỏng ở cái cuối' },
        { args: [['db', 'cache', 'file'], 'cache'], expected: ['open:db', 'error', 'close:db'], name: 'Tên thật, hỏng ở tầng hai' },
      ],
      hints: [
        'Giữ một danh sách `opened` ghi lại những tài nguyên đã mở THÀNH CÔNG. Đây là điểm mấu chốt: bạn chỉ được đóng đúng những thứ trong danh sách này, không phải toàn bộ `names`.',
        'Khung xử lý: `try:` mở lần lượt rồi ghi `"work"` → `except RuntimeError:` ghi `"error"` → `finally:` đóng. Phần đóng phải nằm trong `finally` để chạy được ở cả hai nhánh.',
        'Đóng theo thứ tự ngược: `for n in reversed(opened):`. Đừng dùng `opened.reverse()` nếu bạn còn cần danh sách gốc — `reversed()` chỉ tạo một iterator, không sửa list.',
      ],
      diagnostics: [
        { test: 'for\\s+\\w+\\s+in\\s+reversed\\s*\\(\\s*names\\s*\\)', message: 'Bạn đang đóng theo `names` — tức là đóng cả những tài nguyên CHƯA hề mở được (và cả cái đã gây lỗi). Chỉ được đóng những cái nằm trong danh sách đã mở thành công.' },
        { test: '^(?![\\s\\S]*finally)[\\s\\S]*def\\s+open_all', message: 'Không thấy `finally`. Nếu phần đóng tài nguyên chỉ nằm ở nhánh thành công hoặc chỉ trong `except`, sẽ luôn có một trường hợp bị rò rỉ tài nguyên. Dọn dẹp thuộc về `finally`.' },
        { test: '\\.reverse\\s*\\(\\s*\\)', message: '`list.reverse()` đảo ngược TẠI CHỖ và trả về `None` — nếu bạn viết `for n in opened.reverse():` sẽ gặp `TypeError: NoneType is not iterable`. Dùng `reversed(opened)` (tạo iterator) hoặc `opened[::-1]` (tạo bản sao).' },
      ],
      approach: `
Đây là bài toán mà \`with\` lồng nhau giải quyết **miễn phí** cho bạn — và bài này bắt bạn tự làm để hiểu
nó đang làm gì.

\`\`\`python
with open("a") as fa:
    with open("b") as fb:
        ...
# fb đóng trước, rồi mới tới fa — thứ tự NGƯỢC, tự động
\`\`\`

**Vì sao phải đóng theo thứ tự ngược?** Vì tài nguyên sau thường **phụ thuộc** vào tài nguyên trước: một
transaction mở trên một connection, một file nằm trong một thư mục tạm, một cursor thuộc về một session.
Đóng connection trước khi đóng transaction là hỏng. Nguyên tắc chung: **thứ tự huỷ luôn ngược với thứ tự
tạo** — giống hệt cách ngăn xếp hoạt động (và cũng chính là lý do nó dùng stack).

**Vì sao chỉ đóng những cái đã mở?** Vì lỗi thường xảy ra **ở giữa** quá trình chiếm tài nguyên. Cố đóng
một thứ chưa mở sẽ gây thêm một exception mới ngay trong lúc dọn dẹp — che mất lỗi gốc, và đây là kiểu bug
khiến người ta mất hàng giờ nhìn nhầm chỗ.

\`\`\`python
def open_all(names, fail_on):
    log = []
    opened = []
    try:
        for n in names:
            if n == fail_on:
                raise RuntimeError(n)
            log.append("open:" + n)
            opened.append(n)     # chỉ ghi nhận SAU khi mở thành công
        log.append("work")
    except RuntimeError:
        log.append("error")
    finally:
        for n in reversed(opened):
            log.append("close:" + n)
    return log
\`\`\`

**Trong Python thật, bạn không nên tự viết cái này.** Khi số tài nguyên biết trước, hãy dùng nhiều context
manager trên một dòng \`with\`. Khi số lượng **không biết trước** (đúng tình huống của bài này), công cụ
đúng là \`contextlib.ExitStack\`:

\`\`\`python
from contextlib import ExitStack

with ExitStack() as stack:
    files = [stack.enter_context(open(name)) for name in names]
    # thoát khối -> ExitStack đóng mọi thứ đã đăng ký, theo thứ tự ngược,
    # kể cả khi việc mở file thứ 3 thất bại giữa chừng
\`\`\`

\`ExitStack\` chính là phiên bản tổng quát của lời giải trên: nó giữ một ngăn xếp các hàm dọn dẹp và bung
ngược lại lúc thoát. Biết cách nó hoạt động giúp bạn tin dùng nó đúng chỗ.
`,
      solution: `def open_all(names, fail_on):
    log = []
    opened = []
    try:
        for n in names:
            if n == fail_on:
                raise RuntimeError(n)
            log.append("open:" + n)
            opened.append(n)
        log.append("work")
    except RuntimeError:
        log.append("error")
    finally:
        for n in reversed(opened):
            log.append("close:" + n)
    return log`,
      complexity: {
        question: 'Độ phức tạp thời gian và bộ nhớ theo số tài nguyên n?',
        options: [
          'Thời gian O(n), bộ nhớ O(n) — phải nhớ danh sách những gì đã mở để còn đóng lại',
          'Thời gian O(n²) vì phải tìm lại từng tài nguyên khi đóng',
          'Thời gian O(n), bộ nhớ O(1)',
          'Thời gian O(n log n)',
        ],
        answer: 0,
        why: 'Mỗi tài nguyên được mở tối đa một lần và đóng tối đa một lần → O(n) thời gian. Bộ nhớ O(n) là **bắt buộc, không tối ưu được**: muốn dọn dẹp thì phải nhớ mình đã chiếm những gì. Đó cũng chính là thứ `ExitStack` lưu bên trong nó, và là lý do nó có tên "stack".',
      },
      realWorld: 'Mở nhiều file cùng lúc để trộn dữ liệu, chiếm nhiều khoá (lock) theo thứ tự cố định để tránh deadlock, khởi tạo chuỗi kết nối database/cache/message-queue lúc ứng dụng khởi động và tắt chúng theo thứ tự ngược khi dừng. Đây cũng là mô hình của mọi hệ thống quản lý vòng đời tài nguyên: RAII trong C++, `defer` trong Go, `try-with-resources` trong Java.',
    },
  ],
},
];
