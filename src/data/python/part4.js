/**
 * LỘ TRÌNH PYTHON — MODULE 4: Lập trình hướng đối tượng & Dataclass
 */

export default [
/* ==================================================================== */
{
  id: 'py-oop',
  name: 'Lập trình hướng đối tượng & Dataclass',
  en: 'OOP & Dataclasses',
  icon: '🏗️',
  summary: 'class trong Python và class trong JS trông giống nhau — nhưng self tường minh, dunder methods, và @dataclass là những thứ đổi hẳn cách bạn thiết kế object.',
  lesson: `
## 1. Vấn đề gốc

JS ES6 có \`class\`, Python cũng có \`class\` — cú pháp trông na ná khiến người mới dễ chủ quan. Khác biệt
nằm ở ba chỗ: **\`self\` phải viết tường minh trong mọi phương thức**, Python dùng **dunder methods**
(\`__init__\`, \`__repr__\`, \`__eq__\`...) để "cắm" object vào các hành vi ngôn ngữ có sẵn (in ra, so sánh,
cộng...), và \`@dataclass\` giúp bạn bỏ qua phần lớn boilerplate cho các class chủ yếu chứa dữ liệu.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript | Python |
|---|---|---|
| Định nghĩa class | \`class Foo { constructor(x) { this.x = x; } }\` | \`class Foo:\` với \`def __init__(self, x): self.x = x\` |
| Tham chiếu tới chính instance | \`this\` (ẩn, tự động) | \`self\` (**tường minh**, phải khai báo là tham số đầu tiên của mọi phương thức) |
| Gọi hàm lớp cha | \`super().method()\` | \`super().method()\` (giống hệt cú pháp!) |
| Định nghĩa cách in object | \`toString()\` | \`__repr__(self)\` / \`__str__(self)\` |
| Định nghĩa cách so sánh \`==\` | \`Symbol\` phức tạp, ít ai làm | \`__eq__(self, other)\` — rất phổ biến |
| Getter | \`get prop() { return this._x; }\` | \`@property\` decorator trên một method |
| Class chỉ chứa dữ liệu | không có sẵn (phải tự viết constructor + toString...) | \`@dataclass\` — tự sinh \`__init__\`, \`__repr__\`, \`__eq__\` |

## 3. Ý tưởng cốt lõi #1: \`self\` không phải phép màu — nó là THAM SỐ

\`\`\`python
class Counter:
    def __init__(self, start=0):
        self.value = start          # self.value = một THUỘC TÍNH gắn vào instance này

    def increment(self):            # self LUÔN là tham số đầu tiên, dù không truyền khi GỌI
        self.value += 1
        return self.value

c = Counter()
c.increment()      # Python tự động truyền c vào làm self — tương đương Counter.increment(c)
\`\`\`

\`self\` chỉ là **quy ước đặt tên** (không phải từ khoá) cho tham số đầu tiên của mọi phương thức instance
— Python truyền chính instance đang gọi vào đó một cách tự động khi bạn viết \`obj.method()\`. Hiểu điều
này giải thích luôn vì sao bạn không bao giờ quên viết \`self\` trong định nghĩa method — nếu quên, tham
số đầu tiên bạn TƯỞNG là đối số thật sự sẽ vô tình nhận chính instance.

## 4. Ý tưởng cốt lõi #2: Dunder methods — "cắm" object vào hành vi ngôn ngữ

Tên gọi "dunder" = "double underscore" (\`__x__\`). Đây là cách Python cho phép object của bạn tham gia
vào cú pháp ngôn ngữ (toán tử, \`print()\`, \`len()\`, vòng lặp...) — tương tự việc JS cho override
\`toString()\`/\`valueOf()\`, nhưng Python có nhiều "móc nối" hơn hẳn và dùng phổ biến hơn nhiều:

| Dunder method | Được gọi khi nào |
|---|---|
| \`__init__(self, ...)\` | tạo instance mới — giống \`constructor\` |
| \`__repr__(self)\` | \`print(obj)\`, hoặc gõ \`obj\` trong REPL — nên trả về chuỗi rõ ràng, debug-friendly |
| \`__eq__(self, other)\` | \`obj1 == obj2\` — mặc định so sánh theo ĐỊNH DANH (như \`is\`), phải tự định nghĩa để so theo GIÁ TRỊ |
| \`__lt__(self, other)\` | \`obj1 < obj2\` — cần có để \`sorted()\` sắp xếp được list các object tuỳ chỉnh |
| \`__add__(self, other)\` | \`obj1 + obj2\` — nạp chồng toán tử cộng |
| \`__len__(self)\` | \`len(obj)\` |

## 5. \`@dataclass\` — dẹp bỏ boilerplate cho class chứa dữ liệu

Rất nhiều class chỉ đơn giản là "một túi thuộc tính có kiểu": Point, Vector, Config... Viết
\`__init__\`/\`__repr__\`/\`__eq__\` tay cho mỗi class như vậy là lặp lại vô nghĩa. \`@dataclass\` tự sinh
tất cả:

\`\`\`python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p1 = Point(1, 2)
p2 = Point(1, 2)
print(p1)          # Point(x=1, y=2)  — __repr__ tự sinh, dễ debug
p1 == p2            # True — __eq__ tự sinh, so theo GIÁ TRỊ từng field, không phải định danh
\`\`\`

So với class thường phải tự viết ba dunder method trên bằng tay, \`@dataclass\` giảm ~10 dòng boilerplate
xuống 4 dòng khai báo kiểu.

## 6. Kế thừa & \`super()\`

\`\`\`python
class Shape:
    def area(self):
        raise NotImplementedError    # ép mọi lớp con PHẢI override — "hợp đồng" interface

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):                  # OVERRIDE — định nghĩa lại hành vi cho lớp con
        return 3.14159265 * self.radius ** 2

class Square(Shape):
    def __init__(self, side):
        super().__init__()           # gọi __init__ của lớp cha (nếu cha có logic khởi tạo riêng)
        self.side = side

    def area(self):
        return self.side ** 2
\`\`\`

**Đa hình (polymorphism):** một hàm nhận \`shape: Shape\` và gọi \`shape.area()\` không cần biết đó là
\`Circle\` hay \`Square\` — Python tự tìm đúng phương thức \`area()\` của LỚP THẬT SỰ tại runtime. Đây chính
là lý do interface/lớp trừu tượng hữu ích: code dùng chung không cần \`if isinstance(...)\` rẽ nhánh.

## 7. Bẫy thường gặp

- **Quên \`self\`** trong định nghĩa method → \`TypeError: takes 0 positional arguments but 1 was given\`
  (Python tự truyền instance vào, nhưng hàm không có chỗ nhận).
- **So sánh object bằng \`==\` khi chưa định nghĩa \`__eq__\`**: mặc định so theo ĐỊNH DANH bộ nhớ (như
  \`is\`) — hai object khác nhau dù giá trị giống hệt vẫn \`!= nhau\`. Đây là lý do nhiều bug "so sánh sai"
  khi mới quen OOP Python.
- **Thuộc tính CLASS (dùng chung) vs thuộc tính INSTANCE (riêng từng object)**: khai báo biến mutable ở
  cấp class (\`class Foo: items = []\`) là **thuộc tính dùng chung cho MỌI instance** — y hệt bẫy tham số
  mặc định mutable đã học ở module trước, chỉ khác chỗ xảy ra.
- **Kế thừa quá sâu**: kế thừa nhiều tầng khiến code khó theo dõi phương thức thực sự chạy nằm ở lớp nào.
  Nguyên tắc senior: **ưu tiên composition (chứa object khác làm thuộc tính) hơn inheritance** khi quan hệ
  không thực sự là "is-a" (Circle IS-A Shape hợp lý; nhưng "Engine" không nên kế thừa từ "Car").

## 8. Ứng dụng thực tế

- **\`@dataclass\`** dùng cho mọi model dữ liệu: cấu hình, kết quả API, đối tượng truyền giữa các lớp
  (DTO — Data Transfer Object) trong hệ thống backend thực tế.
- **\`__eq__\`/\`__lt__\`** cần thiết khi muốn \`sorted()\`/so sánh các object nghiệp vụ (ví dụ sắp xếp danh
  sách đơn hàng theo tổng tiền, so sánh hai phiên bản cấu hình có giống nhau không).
- **Đa hình qua kế thừa** là nền tảng của rất nhiều framework: xử lý sự kiện, plugin system, các driver
  cùng interface nhưng cài đặt khác nhau (ví dụ nhiều loại "PaymentProvider" cùng có \`.charge()\`).
`,
  quiz: [
    {
      q: 'Vì sao mọi phương thức instance trong Python class đều cần khai báo `self` làm tham số đầu tiên?',
      options: [
        'Đó là từ khoá bắt buộc của Python, giống `this` trong JS',
        '`self` chỉ là quy ước đặt tên cho tham số đầu tiên — Python tự động truyền chính instance đang gọi vào vị trí đó khi bạn viết `obj.method()`',
        'Để phân biệt phương thức instance với phương thức tĩnh (static)',
        '`self` là biến toàn cục Python tự tạo sẵn trong mọi class',
      ],
      answer: 1,
      why: '`self` không phải từ khoá — bạn có thể đặt tên khác (dù không nên). Khi gọi `obj.method(a)`, Python thực chất thực thi `ClassCủaObj.method(obj, a)` — instance luôn được truyền vào làm đối số ĐẦU TIÊN một cách tự động.',
    },
    {
      q: 'class Foo không định nghĩa `__eq__`. `Foo() == Foo()` (hai instance khác nhau, cùng không có thuộc tính) trả về gì?',
      options: ['True, vì hai object giống hệt nhau', 'False, vì mặc định `==` so sánh theo ĐỊNH DANH (giống `is`) khi chưa override `__eq__`', 'Lỗi TypeError', 'True nếu class rỗng, False nếu có thuộc tính'],
      answer: 1,
      why: 'Không định nghĩa `__eq__`, Python dùng hành vi mặc định kế thừa từ `object`: so sánh định danh bộ nhớ, tương đương `is`. Hai lần gọi `Foo()` tạo ra HAI object khác nhau trong bộ nhớ, nên `==` trả về False dù "trông giống nhau".',
    },
    {
      q: '`@dataclass` tự động sinh ra những gì cho một class?',
      options: [
        'Chỉ sinh `__init__`',
        '`__init__`, `__repr__`, và `__eq__` dựa trên các field đã khai báo kiểu — bỏ đi phần lớn boilerplate của class chỉ chứa dữ liệu',
        'Tự động biến class thành immutable',
        'Tự động sinh phương thức `__add__` để cộng hai instance',
      ],
      answer: 1,
      why: '`@dataclass` sinh `__init__` (gán field theo tham số), `__repr__` (in dễ đọc dạng `ClassName(field=value, ...)`), và `__eq__` (so sánh từng field theo giá trị) dựa trên khai báo kiểu (type annotation) của các field. `__add__` hay tính bất biến (`frozen=True`) phải khai báo thêm tường minh.',
    },
    {
      q: 'Vì sao nguyên tắc senior thường khuyên "ưu tiên composition hơn inheritance"?',
      options: [
        'Vì Python không hỗ trợ đa kế thừa tốt',
        'Kế thừa tạo quan hệ chặt (tight coupling) và chỉ nên dùng cho quan hệ "is-a" thực sự; composition (chứa object khác làm thuộc tính) linh hoạt hơn, dễ thay đổi hành vi tại runtime và tránh cây kế thừa sâu khó theo dõi',
        'Composition luôn chạy nhanh hơn kế thừa',
        'Vì `super()` trong Python dễ gây lỗi vòng lặp vô hạn',
      ],
      answer: 1,
      why: 'Kế thừa phù hợp khi quan hệ thực sự là "is-a" (Circle IS-A Shape). Khi chỉ muốn TÁI SỬ DỤNG hành vi mà không có quan hệ is-a rõ ràng, composition (một class CHỨA instance của class khác) linh hoạt hơn: dễ đổi thành phần lúc runtime, không kéo theo toàn bộ interface của lớp cha, và tránh cây kế thừa sâu khó bảo trì.',
    },
    {
      q: 'Đoạn code sau in ra gì?\n\nclass Team:\n    members = []\n    def add(self, name):\n        self.members.append(name)\n\na, b = Team(), Team()\na.add("An")\nprint(b.members)',
      options: ["[]", "['An']", 'AttributeError vì b chưa có members', 'None'],
      answer: 1,
      why: '`members = []` khai ở thân class là **thuộc tính CLASS** — chỉ có đúng một list, dùng chung cho mọi instance. `self.members.append(...)` không hề tạo thuộc tính riêng: Python tra `self.members`, không thấy ở instance nên lấy của class, rồi sửa list đó tại chỗ. (Ngược lại, phép GÁN `self.members = [...]` mới tạo thuộc tính instance che đi thuộc tính class — chính sự bất đối xứng giữa đọc và gán này làm bug khó thấy.) Cách đúng: khởi tạo `self.members = []` trong `__init__`.',
    },
    {
      q: 'Một class chỉ định nghĩa `__str__` (không có `__repr__`). `print(obj)` và `print([obj])` cho kết quả thế nào?',
      options: [
        'Cả hai đều dùng `__str__`',
        '`print(obj)` dùng `__str__`, còn `print([obj])` in ra dạng mặc định `<... object at 0x...>`',
        'Cả hai đều in dạng mặc định `<... object at 0x...>`',
        'TypeError vì thiếu `__repr__`',
      ],
      answer: 1,
      why: 'Các container (`list`, `dict`, `tuple`, `set`) luôn dùng `repr()` cho từng phần tử, không dùng `str()` — vì `repr` nhằm phục vụ lập trình viên (chính xác, không mơ hồ) còn `str` phục vụ người dùng cuối. Quy tắc thực dụng: nếu chỉ viết MỘT hàm, hãy viết `__repr__` — `str()` sẽ tự động fallback về nó, còn chiều ngược lại thì không.',
    },
    {
      q: 'Điều gì xảy ra với đoạn code sau?\n\nfrom dataclasses import dataclass\n\n@dataclass\nclass Cart:\n    items: list = []',
      options: [
        'Chạy bình thường, nhưng mọi Cart dùng chung một list',
        'ValueError ngay khi định nghĩa class — dataclass từ chối giá trị mặc định mutable',
        'TypeError khi tạo instance đầu tiên',
        'Python tự động copy list cho từng instance',
      ],
      answer: 1,
      why: '`@dataclass` chủ động CHẶN bẫy "giá trị mặc định mutable" (bạn đã gặp ở module về hàm) bằng cách raise `ValueError: mutable default <class \'list\'> for field items` ngay lúc định nghĩa class. Cách đúng là `items: list = field(default_factory=list)` — hàm `list` được gọi lại cho từng instance. Đây là ví dụ hay về thiết kế API tốt: biến một bug im lặng thành lỗi ồn ào, phát hiện càng sớm càng tốt.',
    },
    {
      q: 'Đoạn code sau in ra gì?\n\nclass A:\n    def who(self): return "A"\nclass B(A):\n    def who(self): return "B" + super().who()\nclass C(A):\n    def who(self): return "C" + super().who()\nclass D(B, C): pass\n\nprint(D().who())',
      options: ['BA', 'BCA', 'BAC', 'TypeError vì đa kế thừa mơ hồ'],
      answer: 1,
      why: '`super()` KHÔNG có nghĩa là "lớp cha trực tiếp" — nó nghĩa là "lớp KẾ TIẾP trong MRO (Method Resolution Order) của lớp thực tế của object". MRO của `D` là `D → B → C → A → object`, nên `super().who()` bên trong `B` gọi `C.who`, chứ không phải `A.who`. Đây chính là lý do phải luôn dùng `super()` thay vì gọi thẳng `A.who(self)`: chỉ `super()` mới đảm bảo mọi lớp trong cây kế thừa đều được chạy đúng một lần. Xem MRO bằng `D.__mro__`.',
    },
  ],
  problems: [
    {
      id: 'py-bank-account',
      title: 'Tài khoản ngân hàng với ngoại lệ',
      en: 'Bank Account with Exceptions',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'run_account',
      lang: 'python',
      statement: `
Viết class \`BankAccount\` và hàm \`run_account(ops)\`:

- \`BankAccount\` khởi tạo với số dư \`0\`, có phương thức:
  - \`deposit(amount)\`: cộng thêm \`amount\` vào số dư.
  - \`withdraw(amount)\`: trừ \`amount\` khỏi số dư; nếu \`amount\` **lớn hơn** số dư hiện tại, **raise
    \`ValueError\`** (không được rút, số dư giữ nguyên).
  - Thuộc tính \`balance\`: số dư hiện tại.

- \`run_account(ops)\` tạo **một** \`BankAccount\` mới, rồi thực hiện tuần tự từng thao tác trong \`ops\`
  (mỗi thao tác là một tuple):
  - \`("deposit", amount)\` → gọi \`deposit\`, không ghi gì vào kết quả.
  - \`("withdraw", amount)\` → gọi \`withdraw\`; nếu bị từ chối (ValueError), ghi chuỗi \`"ERROR"\` vào
    kết quả; nếu thành công, không ghi gì.
  - \`("balance",)\` → ghi số dư hiện tại vào kết quả.
  - Trả về danh sách kết quả đã ghi, theo đúng thứ tự.

**Ví dụ**
- \`run_account([("deposit", 100), ("withdraw", 30), ("balance",)])\` → \`[70]\`
- \`run_account([("withdraw", 50), ("balance",)])\` → \`["ERROR", 0]\`
`,
      starter: `class BankAccount:\n    def __init__(self):\n        \n\n    def deposit(self, amount):\n        \n\n    def withdraw(self, amount):\n        # Neu amount > so du hien tai: raise ValueError(...)\n        \n\n\ndef run_account(ops):\n    account = BankAccount()\n    results = []\n    # Duyet ops, xu ly tung loai thao tac\n    \n    return results`,
      tests: [
        { args: [[['deposit', 100], ['withdraw', 30], ['balance']]], expected: [70], name: 'Nạp rồi rút thành công' },
        { args: [[['withdraw', 50], ['balance']]], expected: ['ERROR', 0], name: 'Rút khi số dư 0 -> ERROR, số dư không đổi' },
        { args: [[['deposit', 50], ['deposit', 50], ['withdraw', 100], ['balance']]], expected: [0], name: 'Rút đúng hết số dư -> không lỗi' },
        { args: [[['deposit', 20], ['withdraw', 25], ['balance']]], expected: ['ERROR', 20], name: 'Rút vượt quá -> ERROR, số dư giữ nguyên' },
        { args: [[['balance']]], expected: [0], name: 'Chỉ hỏi số dư ban đầu' },
      ],
      hints: [
        'Trong `__init__`, khởi tạo `self.balance = 0`. Mỗi phương thức thao tác trực tiếp lên `self.balance` — đây chính là ý nghĩa của "trạng thái" (state) gắn liền với một instance.',
        '`withdraw` cần kiểm tra ĐIỀU KIỆN TRƯỚC khi trừ: `if amount > self.balance: raise ValueError("số dư không đủ")`. Chỉ trừ `self.balance -= amount` ở nhánh còn lại (không vượt quá).',
        'Trong `run_account`, dùng `op[0]` để biết loại thao tác. Với `"withdraw"`, bọc lời gọi trong `try/except ValueError:` để bắt lỗi và ghi `"ERROR"` thay vì để chương trình dừng đột ngột.',
      ],
      diagnostics: [
        { test: 'except\\s+Exception', message: 'Bắt `except Exception` quá rộng — nó sẽ nuốt luôn cả những lỗi lập trình không liên quan (ví dụ gõ sai tên biến). Hãy bắt đúng `except ValueError:` như class đã raise.' },
        { test: 'self\\.balance\\s*-=\\s*amount\\s*\\n\\s*if', message: 'Kiểm tra thứ tự: bạn cần kiểm tra `amount > self.balance` TRƯỚC rồi mới trừ — nếu trừ trước rồi mới kiểm tra, số dư sẽ tạm thời bị âm sai quy tắc trước khi bạn kịp raise lỗi.' },
      ],
      approach: `
Bài này luyện ba thứ cùng lúc: **trạng thái gắn với instance** (\`self.balance\`), **exception có chủ đích**
(dùng \`raise\` để báo lỗi nghiệp vụ, không phải lỗi lập trình), và **tổ chức code gọi qua try/except**.

**Nguyên tắc thiết kế quan trọng:** \`withdraw\` không nên ÂM THẦM từ chối (ví dụ trả về \`False\`) — nó nên
\`raise ValueError\` để buộc người gọi PHẢI xử lý tình huống lỗi một cách tường minh (qua \`try/except\`),
thay vì có thể vô tình bỏ qua một giá trị trả về báo lỗi. Đây là triết lý phổ biến trong Python: "dễ xin
tha thứ hơn xin phép" (EAFP — Easier to Ask Forgiveness than Permission) — thử làm, nếu lỗi thì bắt lỗi,
thay vì luôn kiểm tra điều kiện trước (LBYL — Look Before You Leap) như thói quen JS thường thấy
(\`if (canWithdraw) { ... }\`).

**Vì sao mỗi \`run_account\` phải tạo BankAccount MỚI?** Nếu dùng chung một account cho nhiều lần gọi
\`run_account\` (ví dụ khai báo account ở phạm vi module), số dư sẽ RÒ RỈ giữa các lượt test khác nhau —
đúng nguyên tắc "mỗi lần gọi hàm độc lập" đã nhấn mạnh xuyên suốt các module trước.
`,
      solution: `class BankAccount:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("số dư không đủ")
        self.balance -= amount


def run_account(ops):
    account = BankAccount()
    results = []
    for op in ops:
        kind = op[0]
        if kind == 'deposit':
            account.deposit(op[1])
        elif kind == 'withdraw':
            try:
                account.withdraw(op[1])
            except ValueError:
                results.append('ERROR')
        elif kind == 'balance':
            results.append(account.balance)
    return results`,
      complexity: {
        question: 'Với k thao tác trong ops, độ phức tạp thời gian của run_account?',
        options: ['O(1)', 'O(k) — mỗi thao tác xử lý trong thời gian không đổi', 'O(k²)', 'O(k log k)'],
        answer: 1,
        why: 'Mỗi thao tác (deposit/withdraw/balance) chỉ đọc/ghi một thuộc tính O(1), lặp qua k thao tác cho tổng O(k).',
      },
      realWorld: 'Đây chính là hình dạng của mọi hệ thống xử lý giao dịch tài chính thực tế: trạng thái (số dư) gắn với một entity, mọi thay đổi phải qua các phương thức kiểm soát bất biến nghiệp vụ (không cho số dư âm), và lỗi nghiệp vụ được biểu diễn bằng exception có tên rõ ràng thay vì mã lỗi mơ hồ.',
    },
    {
      id: 'py-vector-dataclass',
      title: 'Cộng vector với @dataclass',
      en: 'Add Vectors with @dataclass',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'add_vectors',
      lang: 'python',
      statement: `
Viết class \`Vector\` bằng \`@dataclass\` với hai field \`x\`, \`y\`, có nạp chồng toán tử \`+\` (\`__add__\`)
để cộng hai vector theo từng thành phần.

Viết hàm \`add_vectors(pairs)\`: \`pairs\` là danh sách các cặp điểm \`[[x1, y1], [x2, y2]]\`. Với mỗi cặp,
tạo hai \`Vector\`, cộng chúng bằng toán tử \`+\`, rồi trả về danh sách kết quả dạng \`[x, y]\`.

**Ví dụ**
- \`add_vectors([[[1, 2], [3, 4]]])\` → \`[[4, 6]]\`
- \`add_vectors([[[0, 0], [0, 0]]])\` → \`[[0, 0]]\`
- \`add_vectors([])\` → \`[]\`
`,
      starter: `from dataclasses import dataclass\n\n@dataclass\nclass Vector:\n    x: float\n    y: float\n\n    def __add__(self, other):\n        \n\n\ndef add_vectors(pairs):\n    result = []\n    # Voi moi cap [a, b]: tao 2 Vector, cong bang +, them [x, y] vao result\n    \n    return result`,
      tests: [
        { args: [[[[1, 2], [3, 4]]]], expected: [[4, 6]], name: 'Ví dụ cơ bản' },
        { args: [[[[0, 0], [0, 0]]]], expected: [[0, 0]], name: 'Vector 0' },
        { args: [[[[1, 1], [2, 2]], [[-1, -1], [1, 1]]]], expected: [[3, 3], [0, 0]], name: 'Hai cặp, có số âm' },
        { args: [[]], expected: [], name: 'Danh sách rỗng' },
      ],
      hints: [
        '`__add__(self, other)` được gọi khi Python gặp biểu thức `a + b` với `a` là instance của class này — bạn cần trả về một `Vector` MỚI (không sửa `self`/`other` tại chỗ), cộng từng thành phần tương ứng.',
        '`return Vector(self.x + other.x, self.y + other.y)` — dùng lại chính class Vector để tạo kết quả, giữ tính nhất quán kiểu dữ liệu.',
        'Trong `add_vectors`, với mỗi cặp `[a, b]`: `va = Vector(a[0], a[1])`, `vb = Vector(b[0], b[1])`, `tong = va + vb` (Python tự gọi `__add__`), rồi thêm `[tong.x, tong.y]` vào kết quả.',
      ],
      approach: `
Bài này cho thấy sức mạnh thật sự của dunder methods: **\`va + vb\` không phải cú pháp đặc biệt dành riêng
cho số** — nó là cú pháp Python DÙNG CHUNG cho mọi kiểu có định nghĩa \`__add__\`. Khi bạn viết
\`va + vb\`, Python thực chất gọi \`va.__add__(vb)\`.

**Vì sao \`@dataclass\` phù hợp ở đây?** \`Vector\` là class "chứa dữ liệu thuần tuý" (chỉ có \`x\`, \`y\`,
không có logic phức tạp) — đúng trường hợp \`@dataclass\` được thiết kế để phục vụ: bạn chỉ cần khai báo
kiểu của các field, \`__init__\` được sinh tự động (\`Vector(1, 2)\` hoạt động ngay không cần viết
\`__init__\` tay), kèm theo \`__repr__\` giúp debug dễ hơn (\`print(Vector(1,2))\` ra \`Vector(x=1, y=2)\`
thay vì địa chỉ bộ nhớ khó đọc).

**\`__add__\` vẫn phải viết tay** vì nó là hành vi NGHIỆP VỤ riêng của Vector (cộng theo toạ độ) —
\`@dataclass\` chỉ tự sinh những gì có thể suy ra máy móc từ khai báo field (\`__init__\`, \`__repr__\`,
\`__eq__\`), không thể đoán được ý nghĩa "cộng" của bạn là gì.
`,
      solution: `from dataclasses import dataclass

@dataclass
class Vector:
    x: float
    y: float

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)


def add_vectors(pairs):
    result = []
    for a, b in pairs:
        va = Vector(a[0], a[1])
        vb = Vector(b[0], b[1])
        tong = va + vb
        result.append([tong.x, tong.y])
    return result`,
      complexity: {
        question: 'Với n cặp điểm trong pairs, độ phức tạp thời gian của add_vectors?',
        options: ['O(1)', 'O(n) — mỗi cặp tốn thời gian không đổi để tạo Vector và cộng', 'O(n²)', 'O(n log n)'],
        answer: 1,
        why: 'Mỗi cặp chỉ tạo 2 object Vector và thực hiện 1 phép cộng O(1), lặp qua n cặp cho tổng O(n).',
      },
      realWorld: '@dataclass là mẫu chuẩn cho các "value object" trong hệ thống thực tế: toạ độ GPS, giá tiền kèm đơn vị, khoảng thời gian — những đối tượng nhỏ, chủ yếu là dữ liệu, thường cần so sánh giá trị (`__eq__`) và đôi khi cần phép toán riêng (`__add__` để cộng dồn khoảng cách, `__lt__` để sắp xếp theo mốc thời gian).',
    },
    {
      id: 'py-shape-area',
      title: 'Đa hình với Shape',
      en: 'Polymorphism with Shape',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'total_area',
      lang: 'python',
      statement: `
Viết class \`Shape\` (lớp cơ sở) với phương thức \`area(self)\` — lớp con **phải** override.

Viết hai lớp con:
- \`Circle(Shape)\`: khởi tạo với \`radius\`, \`area()\` trả về \`pi * radius**2\` (dùng \`math.pi\`).
- \`Rectangle(Shape)\`: khởi tạo với \`width\`, \`height\`, \`area()\` trả về \`width * height\`.

Viết hàm \`total_area(shapes)\`: \`shapes\` là danh sách tuple mô tả hình, ví dụ
\`("circle", 2)\` hoặc \`("rectangle", 3, 4)\`. Tạo đúng loại \`Shape\` cho từng phần tử, **cộng dồn** diện
tích của tất cả, trả về **tổng đã làm tròn 2 chữ số thập phân** (\`round(total, 2)\`).

**Ví dụ**
- \`total_area([("circle", 2), ("rectangle", 3, 4)])\` → \`24.57\`
- \`total_area([("rectangle", 2, 5)])\` → \`10.0\`
- \`total_area([])\` → \`0\`
`,
      starter: `import math\n\nclass Shape:\n    def area(self):\n        raise NotImplementedError\n\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        \n\n    def area(self):\n        \n\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        \n\n    def area(self):\n        \n\n\ndef total_area(shapes):\n    total = 0\n    # Voi moi tuple trong shapes: tao dung Circle/Rectangle roi cong don area()\n    \n    return round(total, 2)`,
      tests: [
        { args: [[['circle', 2], ['rectangle', 3, 4]]], expected: 24.57, name: 'Hỗn hợp circle + rectangle' },
        { args: [[['rectangle', 2, 5]]], expected: 10, name: 'Chỉ rectangle' },
        { args: [[]], expected: 0, name: 'Danh sách rỗng' },
        { args: [[['circle', 1]]], expected: 3.14, name: 'Một circle bán kính 1' },
        { args: [[['circle', 1], ['circle', 1]]], expected: 6.28, name: 'Hai circle giống nhau' },
      ],
      hints: [
        '`Circle.__init__` cần lưu `radius` vào `self.radius`; `Circle.area()` dùng `math.pi * self.radius ** 2`. Tương tự cho `Rectangle` với `width`, `height`.',
        'Trong `total_area`, với mỗi tuple `t`, `t[0]` cho biết loại hình ("circle" hay "rectangle"). Dùng `if/elif` để quyết định tạo `Circle(t[1])` hay `Rectangle(t[1], t[2])`.',
        'Sau khi tạo đúng object (dù là Circle hay Rectangle), bạn luôn gọi CÙNG một phương thức `.area()` — đây chính là đa hình: code cộng dồn không cần biết đang cộng diện tích hình gì. `total += shape.area()`.',
      ],
      diagnostics: [
        { test: 'isinstance\\s*\\([^)]*Circle', message: 'Không cần `isinstance` để quyết định cách tính diện tích — đó chính là việc mà đa hình (polymorphism) giải quyết: gọi `.area()` như nhau trên mọi Shape, Python tự tìm đúng phương thức của lớp thật sự.' },
      ],
      approach: `
Đây là ví dụ chuẩn mực về **đa hình (polymorphism)**: \`total_area\` cộng dồn bằng cách gọi \`shape.area()\`
**giống hệt nhau** cho mọi loại hình, không cần \`if isinstance(shape, Circle): ... elif isinstance(shape,
Rectangle): ...\` để quyết định CÁCH TÍNH diện tích. Việc "biết cách tính diện tích của chính mình" là
trách nhiệm của TỪNG LỚP CON — đây gọi là nguyên tắc **"Tell, Don't Ask"**: thay vì hỏi object nó là gì rồi
tự xử lý logic bên ngoài, hãy YÊU CẦU object tự làm việc của nó.

**\`raise NotImplementedError\` trong \`Shape.area()\`** đóng vai trò như một "hợp đồng" (interface) — nếu
ai đó tạo lớp con mới của \`Shape\` mà quên override \`area()\`, lỗi sẽ xuất hiện ngay khi gọi \`.area()\`
thay vì âm thầm trả về kết quả sai. Đây là kỹ thuật phổ biến ở Python để mô phỏng "phương thức trừu tượng"
(abstract method) mà không cần dùng module \`abc\` đầy đủ.

**Vì sao code KHÔNG nên rẽ nhánh theo loại hình bên ngoài class?** Nếu sau này thêm \`Triangle\`, code dùng
\`isinstance\` rải rác khắp nơi sẽ phải sửa ở MỌI chỗ rẽ nhánh; code dùng đa hình chỉ cần thêm một class
\`Triangle(Shape)\` mới, mọi nơi gọi \`.area()\` tự động hoạt động đúng — đây là nguyên tắc Open/Closed
(mở để mở rộng, đóng để sửa đổi) trong SOLID.
`,
      solution: `import math

class Shape:
    def area(self):
        raise NotImplementedError


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2


class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height


def total_area(shapes):
    total = 0
    for t in shapes:
        if t[0] == 'circle':
            shape = Circle(t[1])
        elif t[0] == 'rectangle':
            shape = Rectangle(t[1], t[2])
        else:
            continue
        total += shape.area()
    return round(total, 2)`,
      complexity: {
        question: 'Với n hình trong shapes, độ phức tạp thời gian của total_area?',
        options: ['O(1)', 'O(n) — tạo và tính diện tích mỗi hình tốn thời gian không đổi', 'O(n²)', 'O(n log n)'],
        answer: 1,
        why: 'Tạo object và gọi area() cho mỗi hình là O(1), lặp qua n hình cho tổng O(n).',
      },
      realWorld: 'Đa hình qua kế thừa là xương sống của các hệ thống plugin: nhiều "PaymentProvider" (Stripe, PayPal, MoMo...) cùng có `.charge()`, nhiều "NotificationChannel" (Email, SMS, Push) cùng có `.send()` — code điều phối trung tâm chỉ gọi phương thức chung, không cần biết đang làm việc với cài đặt cụ thể nào.',
    },
    {
      id: 'py-basket-instance-state',
      title: 'Thuộc tính class hay thuộc tính instance?',
      en: 'Class vs Instance Attribute',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'run_baskets',
      lang: 'python',
      statement: `
Định nghĩa một class \`Basket\` (giỏ hàng) với:
- Thuộc tính \`items\` — danh sách sản phẩm, ban đầu **rỗng**.
- Phương thức \`add(item)\` — thêm một sản phẩm vào giỏ.

Sau đó viết hàm \`run_baskets(a_items, b_items)\`:
1. Tạo **hai** giỏ hàng riêng biệt.
2. Thêm lần lượt các phần tử của \`a_items\` vào giỏ thứ nhất, \`b_items\` vào giỏ thứ hai.
3. Trả về \`[giỏ_1.items, giỏ_2.items]\`.

**Ví dụ**
- \`run_baskets(["ao"], ["quan"])\` → \`[["ao"], ["quan"]]\`

> Hai giỏ hàng phải **hoàn toàn độc lập**. Nếu kết quả của bạn là \`[["ao", "quan"], ["ao", "quan"]]\`
> thì bạn vừa gặp một trong những bug OOP kinh điển nhất của Python.
`,
      starter: `class Basket:\n    # items: danh sách sản phẩm, RIÊNG cho từng giỏ\n    \n    def add(self, item):\n        pass\n\n\ndef run_baskets(a_items, b_items):\n    # Tạo 2 giỏ, thêm hàng, trả về [items giỏ 1, items giỏ 2]\n    \n`,
      tests: [
        { args: [['ao'], ['quan']], expected: [['ao'], ['quan']], name: 'Mỗi giỏ một món' },
        { args: [[], ['a', 'b']], expected: [[], ['a', 'b']], name: 'Giỏ thứ nhất rỗng' },
        { args: [['p', 'q'], []], expected: [['p', 'q'], []], name: 'Giỏ thứ hai rỗng' },
        { args: [[], []], expected: [[], []], name: 'Cả hai giỏ rỗng' },
        { args: [['1', '2', '3'], ['4']], expected: [['1', '2', '3'], ['4']], name: 'Nhiều món, kiểm tra thứ tự' },
        { args: [['x'], ['x']], expected: [['x'], ['x']], name: 'Hai giỏ cùng món — vẫn phải tách biệt' },
      ],
      hints: [
        'Viết `items = []` ngay trong thân class sẽ tạo thuộc tính CLASS: chỉ có duy nhất một list, mọi giỏ hàng dùng chung nó.',
        'Thuộc tính riêng của từng object phải được tạo trong `__init__`, vì `__init__` chạy lại cho MỖI instance: `def __init__(self): self.items = []`.',
        'Bẫy phụ khi kiểm tra: `self.items.append(x)` (đọc rồi sửa tại chỗ) sẽ dùng chung list của class, nhưng `self.items = [...]` (gán) lại tạo thuộc tính instance mới — nên bug chỉ lộ ra khi bạn `append`, và chỉ ở giỏ thứ hai trở đi.',
      ],
      diagnostics: [
        { test: 'class\\s+Basket[^\\n]*:\\s*\\n\\s+items\\s*=\\s*\\[\\s*\\]', message: '`items = []` viết trực tiếp trong thân class là thuộc tính CLASS — chỉ tồn tại một list duy nhất, dùng chung cho mọi giỏ hàng. Chuyển nó vào `__init__` dưới dạng `self.items = []` để mỗi instance có list riêng.' },
        { test: '^(?![\\s\\S]*__init__)[\\s\\S]*class\\s+Basket', message: 'Class của bạn chưa có `__init__`. Không có nó thì không có chỗ nào tạo trạng thái RIÊNG cho từng instance — mọi giỏ hàng sẽ buộc phải dùng chung dữ liệu khai ở cấp class.' },
      ],
      approach: `
Python tra cứu thuộc tính theo thứ tự: **instance trước, class sau**. Điều đó tạo ra một bất đối xứng
mà người mới rất hay vấp:

\`\`\`python
class Basket:
    items = []            # MỘT list duy nhất, thuộc về class

b1, b2 = Basket(), Basket()
b1.items.append("ao")     # ĐỌC self.items -> không có ở instance -> lấy của class -> sửa tại chỗ
print(b2.items)           # ['ao']  ← b2 "thấy" món hàng của b1

b1.items = ["moi"]        # GÁN -> TẠO thuộc tính instance mới, che thuộc tính class
print(b2.items)           # ['ao']  ← từ giờ b1 và b2 mới tách nhau
\`\`\`

Đọc thì đi lên tới class, gán thì tạo mới ở instance. Vì vậy bug chỉ xuất hiện khi bạn **sửa tại chỗ**
(\`append\`, \`+=\`, \`update\`) — đúng thao tác phổ biến nhất với list và dict.

**Cách đúng:**

\`\`\`python
class Basket:
    def __init__(self):
        self.items = []       # chạy lại cho từng instance -> mỗi giỏ một list riêng

    def add(self, item):
        self.items.append(item)
\`\`\`

**Khi nào thuộc tính class là ĐÚNG?** Khi dữ liệu thật sự dùng chung và bất biến: hằng số
(\`MAX_SIZE = 100\`), bộ đếm tổng số instance, bảng cấu hình chỉ đọc. Nguyên tắc an toàn: **thuộc tính
class chỉ nên là giá trị immutable.**
`,
      solution: `class Basket:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)


def run_baskets(a_items, b_items):
    a = Basket()
    b = Basket()
    for item in a_items:
        a.add(item)
    for item in b_items:
        b.add(item)
    return [a.items, b.items]`,
      complexity: {
        question: 'Độ phức tạp thời gian của run_baskets theo tổng số món hàng n = len(a_items) + len(b_items)?',
        options: ['O(n) — mỗi món được append đúng một lần, append vào list là O(1) khấu hao', 'O(n²) vì mỗi lần append phải copy lại list', 'O(1)', 'O(n log n)'],
        answer: 0,
        why: '`list.append` là O(1) khấu hao (amortized): Python cấp phát dư chỗ nên phần lớn lời gọi chỉ ghi vào ô trống, thỉnh thoảng mới copy sang vùng nhớ lớn hơn — trung bình vẫn là hằng số. Hai vòng lặp cộng lại chạy đúng n lần.',
      },
      realWorld: 'Bug này xuất hiện thật ở mọi model có danh sách/dict làm trạng thái: giỏ hàng, danh sách quyền của user, cache theo phiên, danh sách lỗi của một form. Triệu chứng đặc trưng là "dữ liệu của người dùng A hiện ra ở tài khoản người dùng B" — nghiêm trọng về bảo mật và cực khó tái hiện trên môi trường dev vì chỉ lộ khi có nhiều instance cùng lúc.',
    },
    {
      id: 'py-point-eq-hash',
      title: 'Điểm bằng nhau và bài toán hashable',
      en: 'Value Equality: __eq__ and __hash__',
      difficulty: 'Medium',
      targetMinutes: 14,
      entry: 'Point',
      lang: 'python',
      statement: `
Hoàn thiện class \`Point(x, y)\` sao cho **hai điểm có cùng toạ độ được coi là một**:
- \`Point(1, 2) == Point(1, 2)\` phải là \`True\`.
- Đưa nhiều \`Point\` vào một \`set\` thì các điểm trùng toạ độ chỉ được tính **một lần**.

**Hệ thống chấm sẽ làm như sau** với danh sách toạ độ đầu vào:
1. Tạo một \`Point\` cho mỗi cặp toạ độ.
2. Đưa tất cả vào một \`set\` và đếm số phần tử.
3. Kiểm tra \`điểm_đầu_tiên == Point(cùng toạ độ)\`.

Kết quả mỗi test có dạng \`[số_điểm_phân_biệt, kết_quả_so_sánh_bằng]\`.

**Ví dụ** với \`[[1, 2], [1, 2], [3, 4]]\` → \`[2, True]\`

> Chỉ định nghĩa \`__eq__\` là **chưa đủ** — và cách nó hỏng sẽ khiến bạn bất ngờ.
`,
      starter: `class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    # Bổ sung những gì cần thiết để hai điểm cùng toạ độ được coi là MỘT\n    \n`,
      harnessSrc: `def harness(Cls, args, t):
    pairs = args[0]
    points = [Cls(x, y) for x, y in pairs]
    same = points[0] == Cls(pairs[0][0], pairs[0][1])
    return [len(set(points)), bool(same)]`,
      tests: [
        { args: [[[1, 2], [1, 2], [3, 4]]], expected: [2, true], name: 'Một cặp trùng nhau' },
        { args: [[[0, 0]]], expected: [1, true], name: 'Một điểm duy nhất' },
        { args: [[[1, 1], [2, 2], [3, 3], [1, 1], [2, 2]]], expected: [3, true], name: 'Nhiều điểm trùng lặp' },
        { args: [[[5, 6], [6, 5]]], expected: [2, true], name: 'Đảo toạ độ là điểm KHÁC' },
        { args: [[[-1, 0], [-1, 0], [-1, 0]]], expected: [1, true], name: 'Ba bản sao của cùng một điểm' },
        { args: [[[2, 3], [2, 3], [2, 4], [9, 9]]], expected: [3, true], name: 'Hỗn hợp' },
      ],
      hints: [
        'Mặc định, Python so sánh object bằng ĐỊNH DANH bộ nhớ — hai `Point(1, 2)` khác nhau luôn `!=`. Muốn so theo giá trị, hãy định nghĩa `__eq__(self, other)` trả về `self.x == other.x and self.y == other.y`.',
        'Nhưng chỉ thêm `__eq__` thôi thì `set(points)` sẽ raise `TypeError: unhashable type: Point`. Lý do: khi bạn tự định nghĩa `__eq__`, Python TỰ ĐỘNG đặt `__hash__ = None` để tránh mâu thuẫn "hai object bằng nhau nhưng hash khác nhau".',
        'Vì vậy phải khai luôn `__hash__`, và nó phải nhất quán với `__eq__` — dựa trên đúng những trường dùng để so sánh: `def __hash__(self): return hash((self.x, self.y))`. Cách gọn nhất cho cả bài: dùng `@dataclass(frozen=True)`, nó sinh sẵn cả hai.',
      ],
      diagnostics: [
        { test: '^(?![\\s\\S]*(__hash__|frozen))[\\s\\S]*__eq__', message: 'Bạn có `__eq__` nhưng chưa có `__hash__`. Định nghĩa `__eq__` khiến Python đặt `__hash__ = None`, nên object không còn dùng được trong `set`/làm khoá `dict` (`TypeError: unhashable type`). Thêm `def __hash__(self): return hash((self.x, self.y))`.' },
        { test: '^(?![\\s\\S]*(__eq__|dataclass))[\\s\\S]*class\\s+Point', message: 'Chưa thấy `__eq__` (hoặc `@dataclass`). Không có nó, `Point(1, 2) == Point(1, 2)` là `False` vì Python so sánh theo địa chỉ bộ nhớ, và `set` cũng sẽ coi mọi điểm là phân biệt.' },
      ],
      approach: `
Bài này chạm tới một **hợp đồng ngầm** của Python mà rất nhiều người viết sai:

> Nếu \`a == b\` thì bắt buộc \`hash(a) == hash(b)\`.

\`set\` và \`dict\` dựa vào hợp đồng đó: chúng dùng \`hash\` để nhảy thẳng tới đúng "ngăn" cần tìm, rồi mới
dùng \`==\` để xác nhận. Nếu hai object bằng nhau nhưng hash khác nhau, chúng rơi vào hai ngăn khác nhau và
\`set\` sẽ chứa cả hai — cấu trúc dữ liệu hỏng âm thầm.

Vì hậu quả nguy hiểm như vậy, Python chọn cách **phòng vệ chủ động**: hễ bạn tự viết \`__eq__\`, nó lập tức
đặt \`__hash__ = None\` cho class đó. Object trở thành unhashable, và bạn nhận \`TypeError\` ồn ào ngay lần
đầu bỏ vào \`set\` — thay vì một bug đếm sai số liệu âm thầm nhiều tháng sau.

**Lời giải tường minh:**

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented       # để Python thử phép so sánh ngược lại
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))   # cùng bộ trường với __eq__
\`\`\`

Trả về \`NotImplemented\` (không phải \`False\`) khi gặp kiểu lạ là quy ước chuẩn: nó cho phép Python thử
\`other.__eq__(self)\` trước khi kết luận.

**Lời giải Pythonic hơn** — \`@dataclass(frozen=True)\` sinh sẵn \`__init__\`, \`__eq__\`, \`__hash__\` và
\`__repr__\`, đồng thời khoá object lại thành bất biến (điều kiện an toàn để hash không bao giờ đổi):

\`\`\`python
from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: int
    y: int
\`\`\`

**Cảnh báo cuối:** đừng bao giờ hash theo một trường **mutable**. Nếu \`x\` đổi sau khi object đã nằm trong
\`set\`, hash của nó thay đổi nhưng nó vẫn nằm ở ngăn cũ — bạn sẽ không bao giờ tìm lại được nó nữa.
`,
      solution: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))`,
      complexity: {
        question: 'Đưa n điểm vào một `set` tốn độ phức tạp thời gian trung bình bao nhiêu?',
        options: [
          'O(n) — mỗi lần thêm là O(1) trung bình nhờ bảng băm',
          'O(n²) vì mỗi điểm phải so sánh `==` với mọi điểm đã có',
          'O(n log n)',
          'O(1)',
        ],
        answer: 0,
        why: 'Bảng băm đưa mỗi phần tử thẳng tới ngăn của nó qua `hash`, chỉ so `==` với vài phần tử cùng ngăn → O(1) trung bình cho mỗi lần thêm, O(n) cho toàn bộ. Nhưng nếu `__hash__` viết tệ (ví dụ luôn `return 1`), mọi phần tử dồn vào một ngăn và độ phức tạp SUY BIẾN về O(n²) — hash vẫn "đúng" theo hợp đồng nhưng hiệu năng sụp đổ.',
      },
      realWorld: 'Bất cứ khi nào bạn muốn khử trùng lặp hoặc dùng object làm khoá cache: toạ độ trên bản đồ, cặp (user_id, ngày) để chống ghi trùng, khoá tổ hợp trong bộ nhớ đệm, so sánh hai bản ghi xem có thay đổi không. Bộ đôi `__eq__`/`__hash__` chính là thứ mà `@dataclass(frozen=True)` sinh ra cho bạn — biết nó hoạt động thế nào giúp bạn chọn đúng khi dataclass không đủ.',
    },
  ],
},
];
