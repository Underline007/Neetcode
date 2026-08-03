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
        { test: 'yield(?!.*try)|(?<!try:\\n\\s{4})yield', message: 'Nhớ đặt `yield` bên trong khối `try`, với phần khôi phục giá trị nằm trong `finally` — nếu không, khi code bên trong `with` (của người gọi) gây lỗi, phần khôi phục giá trị gốc sẽ bị bỏ qua, để lại `d` ở trạng thái sai.' },
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
  ],
},
];
