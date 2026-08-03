/**
 * LỘ TRÌNH PYTHON — MODULE 14: OOP nâng cao
 * (property, __slots__, ABC/abstractmethod, classmethod factory)
 */

export default [
/* ==================================================================== */
{
  id: 'py-advanced-oop',
  name: 'OOP nâng cao',
  en: 'Advanced OOP',
  icon: '🧬',
  summary: 'Bốn công cụ để kiểm soát class chặt chẽ hơn: `@property` (validate khi gán), `__slots__` (giới hạn/tối ưu bộ nhớ), `ABC` (bắt buộc lớp con implement — enforce thật lúc runtime, không chỉ tài liệu), và bẫy kinh điển của `@classmethod` làm factory.',
  lesson: `
## 1. Vấn đề gốc

Module OOP cơ bản đã dạy class, kế thừa, \`@dataclass\`. Module này đi vào các cơ chế Python cung cấp để
**kiểm soát chặt chẽ hơn** hành vi của class — những thứ khiến OOP trong Python thực sự mạnh hơn "class là
một cái túi thuộc tính": kiểm soát việc GÁN giá trị (\`property\`), giới hạn bộ nhớ/thuộc tính (\`__slots__\`),
bắt buộc lớp con phải tuân theo một "hợp đồng" (\`ABC\`), và một bẫy rất tinh vi khi viết factory method bằng
\`@classmethod\`.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript | Python |
|---|---|---|
| Getter/setter chạy code khi truy cập | \`get x() { ... }\`/\`set x(v) { ... }\` | \`@property\` / \`@x.setter\` |
| Bắt buộc lớp con implement một phương thức | không có cơ chế enforce thật lúc runtime (chỉ TypeScript check lúc compile) | \`abc.ABC\` + \`@abstractmethod\` — Python **raise \`TypeError\` ngay khi khởi tạo** lớp con thiếu implement, đây là kiểm tra RUNTIME thật |
| Giới hạn thuộc tính instance được phép có | object JS mặc định linh hoạt, thêm thuộc tính bất kỳ lúc nào | \`__slots__ = (...)\` — khai báo trước, gán thuộc tính NGOÀI danh sách sẽ raise \`AttributeError\` |
| Factory method (tạo instance theo cách khác \`__init__\` thường) | static method thường | \`@classmethod\` — nhận \`cls\` thay vì \`self\`, cho phép kế thừa đúng |

## 3. Ý tưởng cốt lõi

**(a) \`@property\`** biến một phương thức thành thứ TRÔNG NHƯ một thuộc tính khi truy cập (không cần dấu
\`()\`), cho phép chạy logic validate mỗi khi gán giá trị:

\`\`\`python
class Person:
    def __init__(self, age):
        self.age = age          # gọi setter bên dưới ngay từ đây

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("Tuổi không được âm")
        self._age = value
\`\`\`

**(b) \`__slots__ = ("x", "y")\`** khai báo TRƯỚC danh sách cố định các thuộc tính instance được phép có.
Python sẽ KHÔNG tạo \`__dict__\` riêng cho mỗi instance nữa (tiết kiệm bộ nhớ đáng kể khi có hàng triệu
instance nhỏ), và — hiệu ứng phụ hữu ích — gán một thuộc tính KHÔNG nằm trong \`__slots__\` sẽ raise
\`AttributeError\` NGAY LẬP TỨC, thay vì âm thầm tạo ra một thuộc tính mới do gõ nhầm tên.

**(c) \`abc.ABC\` + \`@abstractmethod\`** định nghĩa một "hợp đồng": lớp con KẾ THỪA từ \`ABC\` và có ít nhất
một phương thức đánh dấu \`@abstractmethod\` chưa được override sẽ **KHÔNG THỂ khởi tạo được** — Python raise
\`TypeError\` ngay tại dòng gọi \`TênLớp()\`, không phải khi gọi phương thức đó. Đây là điểm khác biệt LỚN so
với type hint (chỉ là tài liệu tĩnh) — \`ABC\` enforce THẬT lúc chương trình chạy.

**(d) \`@classmethod\` làm "alternate constructor"** — nhận \`cls\` (chính lớp đang được gọi, KHÔNG PHẢI
luôn là lớp định nghĩa phương thức) thay vì \`self\`:

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5 / 9)   # dùng cls(...), KHÔNG hardcode Temperature(...)
\`\`\`

## 4. Dấu hiệu nhận biết

| Thấy trong đề bài | Nghĩ tới |
|---|---|
| "gán giá trị sai phải bị chặn ngay, không để lọt vào object" | \`@property\` + \`@x.setter\` validate |
| "có hàng triệu object nhỏ, cần tối ưu bộ nhớ" | \`__slots__\` |
| "mọi loại X (payment method, driver, plugin...) đều PHẢI có phương thức Y" | \`ABC\` + \`@abstractmethod\` |
| "tạo object bằng cách khác \`__init__\` thường (từ chuỗi, từ đơn vị đo khác...)" | \`@classmethod\` factory, nhớ dùng \`cls(...)\` |
| "lớp con gọi factory kế thừa từ lớp cha, mong tạo ra ĐÚNG lớp con" | kiểm tra factory có hardcode tên lớp cha hay dùng \`cls\` |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
from abc import ABC, abstractmethod

# (a) ABC — bắt buộc lớp con implement, enforce THẬT lúc runtime
class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount):
        ...

class CreditCard(PaymentMethod):
    def pay(self, amount):
        return f"Thanh toán {amount} bằng thẻ"

PaymentMethod()      # TypeError: Can't instantiate abstract class...
CreditCard().pay(100) # OK — đã implement đủ

# (b) __slots__ — giới hạn thuộc tính, tiết kiệm bộ nhớ
class Point:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(1, 2)
p.z = 3    # AttributeError: 'Point' object has no attribute 'z'

# (c) classmethod factory ĐÚNG cách — dùng cls, hỗ trợ kế thừa
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5 / 9)   # cls là lớp THỰC SỰ được gọi, dù là cha hay con

class FancyTemperature(Temperature):
    pass

FancyTemperature.from_fahrenheit(212)   # trả về FancyTemperature, KHÔNG phải Temperature
\`\`\`

## 6. Bẫy thường gặp

- **Chỉ viết \`@property\` (getter) mà quên \`@x.setter\`**: cố gán \`obj.x = 5\` sẽ raise
  \`AttributeError: can't set attribute\` — \`property\` mặc định là READ-ONLY nếu chỉ có getter, phải khai
  báo thêm setter tường minh mới cho phép gán.
- **\`__slots__\` không tự động "kế thừa xuống" lớp con**: nếu lớp con KHÔNG tự khai \`__slots__\` riêng (kể
  cả \`__slots__ = ()\` rỗng), nó vẫn sẽ có \`__dict__\` bình thường — mất đi lợi ích tiết kiệm bộ nhớ của
  \`__slots__\` ở lớp cha.
- **Quên decorator \`@abstractmethod\`**: định nghĩa một phương thức trong lớp kế thừa \`ABC\` nhưng KHÔNG
  đánh dấu \`@abstractmethod\` khiến nó chỉ là một phương thức THƯỜNG — lớp con không override vẫn khởi tạo
  được bình thường, "hợp đồng" không được enforce như bạn tưởng.
- **Factory method \`@classmethod\` hardcode tên lớp cha thay vì dùng \`cls\`**: viết
  \`return Temperature((f - 32) * 5 / 9)\` thay vì \`return cls(...)\` khiến MỌI lớp con gọi
  \`from_fahrenheit\` đều nhận về một instance của lớp CHA, không phải lớp con thực sự đang gọi — phá vỡ tính
  đa hình (polymorphism), một lỗi rất khó phát hiện qua test hời hợt vì code vẫn "chạy được", chỉ sai kiểu
  trả về.

## 7. Ứng dụng thực tế

- **\`@property\` validate dữ liệu**: đảm bảo tuổi không âm, email đúng định dạng, số dư tài khoản không âm
  — validate NGAY tại điểm gán, không để dữ liệu sai lọt sâu vào hệ thống rồi mới phát hiện.
- **\`ABC\` cho hệ thống plugin/driver**: mọi driver database, mọi cổng thanh toán, mọi adapter phải implement
  đúng interface đã định nghĩa — code gọi chung một API mà không cần biết implementation cụ thể bên dưới là
  gì (đúng nguyên tắc Liskov Substitution).
- **\`__slots__\` cho hệ thống có hàng triệu object nhỏ**: game engine (entity, particle), xử lý dữ liệu lớn
  (mỗi dòng dữ liệu là một object) — tiết kiệm bộ nhớ đáng kể so với để mỗi instance tự có \`__dict__\`
  riêng.
- **\`@classmethod\` factory**: \`User.from_json(data)\`, \`Config.from_env()\`, \`Date.from_timestamp(ts)\` —
  mẫu cực kỳ phổ biến trong thư viện Python thực tế để cung cấp nhiều CÁCH tạo object mà vẫn giữ một
  \`__init__\` chính duy nhất, rõ ràng.
`,
  quiz: [
    {
      q: 'Nếu một class chỉ định nghĩa `@property` (getter) mà KHÔNG có `@x.setter` tương ứng, điều gì xảy ra khi cố gán giá trị mới cho thuộc tính đó?',
      options: [
        'Gán bình thường, giá trị được cập nhật như một thuộc tính thường',
        'Raise `AttributeError: can\'t set attribute` — property chỉ có getter mặc định là READ-ONLY, phải khai báo thêm `@x.setter` mới cho phép gán',
        'Python tự động tạo setter mặc định chỉ gán thẳng giá trị không validate gì',
        'Gây lỗi cú pháp ngay khi định nghĩa class',
      ],
      answer: 1,
      why: '`@property` không tự động cho phép gán — nếu muốn property có thể gán được (và validate khi gán), phải khai báo thêm một hàm cùng tên với decorator `@ten_thuoc_tinh.setter`.',
    },
    {
      q: 'Vì sao thử `PaymentMethod()` (khởi tạo trực tiếp một lớp kế thừa `ABC` có `@abstractmethod` chưa được override) lại raise `TypeError` NGAY LẬP TỨC, khác với việc chỉ khai báo type hint?',
      options: [
        'Vì đây chỉ là quy ước, không có enforce thật — TypeError chỉ xảy ra ngẫu nhiên',
        'Vì `ABC` là cơ chế ENFORCE THẬT lúc runtime — Python kiểm tra ngay tại thời điểm gọi `TênLớp()` xem còn `@abstractmethod` nào chưa được lớp con override hay không, khác hẳn type hint (chỉ là tài liệu tĩnh, không được interpreter kiểm tra)',
        'Vì `PaymentMethod` thiếu `__init__`',
        'Vì Python không cho phép đặt tên class trùng với một module đã import',
      ],
      answer: 1,
      why: 'Đây là điểm khác biệt cốt lõi so với type hint (module trước): `ABC`/`@abstractmethod` là một trong số ít cơ chế Python THỰC SỰ kiểm tra và chặn đứng việc khởi tạo ngay tại runtime, không chỉ là tài liệu cho người đọc.',
    },
    {
      q: 'Nếu lớp cha khai báo `__slots__ = ("x", "y")` nhưng lớp con KHÔNG tự khai `__slots__` riêng, điều gì xảy ra?',
      options: [
        'Lớp con tự động thừa hưởng đúng `__slots__` của lớp cha, vẫn giới hạn thuộc tính như cha',
        'Lớp con vẫn có `__dict__` bình thường (mất lợi ích tiết kiệm bộ nhớ và giới hạn thuộc tính của `__slots__`) — muốn giữ lợi ích đó, lớp con cũng phải tự khai `__slots__` (kể cả rỗng `__slots__ = ()`)',
        'Chương trình báo lỗi ngay khi định nghĩa lớp con',
        'Lớp con sẽ không thể được khởi tạo',
      ],
      answer: 1,
      why: '`__slots__` không tự động "lan xuống" lớp con — đây là một trong những bẫy thường gặp khi dùng `__slots__` với kế thừa, khiến lợi ích tối ưu bộ nhớ bị mất đi một cách âm thầm nếu không để ý.',
    },
    {
      q: 'Trong một `@classmethod` dùng làm factory (ví dụ `from_fahrenheit`), vì sao nên viết `return cls(...)` thay vì hardcode `return TenLopCha(...)`?',
      options: [
        'Không có khác biệt gì, cả hai cách đều tương đương trong mọi trường hợp',
        '`cls` luôn là LỚP THỰC SỰ được dùng để gọi phương thức (có thể là lớp cha hoặc bất kỳ lớp con nào kế thừa) — hardcode tên lớp cha sẽ khiến mọi lớp con gọi factory này đều nhận về instance của LỚP CHA thay vì đúng lớp con đang gọi, phá vỡ tính đa hình',
        '`cls(...)` chạy nhanh hơn về mặt hiệu năng',
        'Hardcode tên lớp cha sẽ gây lỗi cú pháp ngay lập tức',
      ],
      answer: 1,
      why: 'Đây là bẫy tinh vi nhất của module: `cls` được Python tự động truyền là lớp THẬT SỰ đứng trước dấu chấm khi gọi (`FancyTemperature.from_fahrenheit(...)` truyền `cls=FancyTemperature`) — hardcode tên lớp cha phá vỡ khả năng lớp con "thừa hưởng đúng" factory method này.',
    },
    {
      q: 'Định nghĩa một phương thức bên trong lớp kế thừa `ABC` nhưng QUÊN đánh dấu `@abstractmethod` sẽ dẫn tới điều gì?',
      options: [
        'Chương trình báo lỗi ngay khi định nghĩa lớp',
        'Phương thức đó chỉ là một phương thức THƯỜNG (có thể có phần thân code thật) — lớp con KHÔNG BẮT BUỘC phải override nó, "hợp đồng" bạn tưởng đã áp đặt thực ra không được enforce cho phương thức này',
        'Python tự động thêm `@abstractmethod` cho mọi phương thức trong lớp kế thừa ABC',
        'Phương thức đó sẽ chạy nhanh hơn các phương thức khác',
      ],
      answer: 1,
      why: 'Chỉ những phương thức được đánh dấu tường minh `@abstractmethod` mới bị `ABC` enforce việc bắt buộc override ở lớp con. Quên decorator này là một lỗi dễ mắc, khiến một phần "hợp đồng" bạn định thiết kế không thực sự có hiệu lực.',
    },
  ],
  problems: [
    {
      id: 'py-property-validated-age',
      title: 'Property có validate (tuổi không âm)',
      en: 'Validated Property (Age)',
      difficulty: 'Medium',
      targetMinutes: 10,
      entry: 'try_create_person',
      lang: 'python',
      statement: `
Viết class \`Person\`: \`__init__(self, name, age)\` lưu \`name\`, và gán \`age\` (thông qua property \`age\`).
Property \`age\` phải **validate**: nếu gán giá trị **âm**, \`raise ValueError("Tuổi không được âm")\`.

Viết thêm hàm \`try_create_person(name, age)\`:
- Nếu tạo \`Person\` thành công → trả về \`("ok", person.age)\`.
- Nếu \`ValueError\` được raise (tuổi âm) → trả về \`("error", thông_điệp_lỗi)\`.

**Ví dụ**
- \`try_create_person("An", 20)\` → \`("ok", 20)\`
- \`try_create_person("Binh", -5)\` → \`("error", "Tuổi không được âm")\`
`,
      starter: `class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    @property\n    def age(self):\n        return self._age\n\n    @age.setter\n    def age(self, value):\n        # Neu value < 0: raise ValueError(\"Tuoi khong duoc am\")\n        # Nguoc lai: luu vao self._age\n        \n\n\ndef try_create_person(name, age):\n    try:\n        p = Person(name, age)\n        return (\"ok\", p.age)\n    except ValueError as e:\n        return (\"error\", str(e))\n`,
      tests: [
        { args: ['An', 20], expected: ['ok', 20], name: 'Tuổi hợp lệ dương' },
        { args: ['Binh', -5], expected: ['error', 'Tuổi không được âm'], name: 'Tuổi âm -> lỗi' },
        { args: ['Chi', 0], expected: ['ok', 0], name: 'Tuổi bằng 0, hợp lệ (biên)' },
        { args: ['Dung', -1], expected: ['error', 'Tuổi không được âm'], name: 'Âm nhẹ, vẫn phải chặn' },
        { args: ['Em', 100], expected: ['ok', 100], name: 'Tuổi lớn, vẫn hợp lệ' },
      ],
      hints: [
        'Trong setter `age`: `if value < 0: raise ValueError("Tuổi không được âm")`, sau đó (nếu không raise) `self._age = value`.',
        'Chú ý: `__init__` gán `self.age = age` — dòng này TỰ ĐỘNG gọi setter `age` bên dưới (vì `age` là property), không phải gán trực tiếp vào một thuộc tính thường. Đây là lý do validate chạy đúng NGAY TỪ lúc khởi tạo, không cần gọi lại gì thêm.',
        'Lưu ý đặt tên thuộc tính lưu trữ THẬT SỰ là `self._age` (có gạch dưới, khác với `self.age` là property) — nếu setter lại gán `self.age = value` (không có gạch dưới), nó sẽ gọi lại CHÍNH setter này, gây đệ quy vô hạn.',
      ],
      diagnostics: [
        { test: 'def\\s+age\\s*\\(\\s*self\\s*,\\s*value\\s*\\)[\\s\\S]*?self\\.age\\s*=\\s*value', message: 'Bên trong setter `age`, gán `self.age = value` sẽ gọi LẠI CHÍNH setter này (vì `age` là property) — gây đệ quy vô hạn (`RecursionError`). Hãy lưu vào một thuộc tính khác tên, ví dụ `self._age = value`.' },
      ],
      approach: `
Bài này minh hoạ đúng lý do \`@property\` hữu ích: chèn logic validate vào đúng ĐIỂM GÁN GIÁ TRỊ, để dữ liệu
sai không bao giờ lọt được vào object ngay từ đầu.

\`\`\`python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age    # gọi setter age bên dưới ngay lập tức

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("Tuổi không được âm")
        self._age = value


def try_create_person(name, age):
    try:
        p = Person(name, age)
        return ("ok", p.age)
    except ValueError as e:
        return ("error", str(e))
\`\`\`

**Vì sao thuộc tính lưu trữ thật sự phải khác tên (\`_age\`) với property (\`age\`)?** Vì property \`age\`
CHIẾM tên \`age\` để chạy code getter/setter mỗi lần truy cập — nếu setter cũng cố gán \`self.age = value\`,
nó sẽ gọi LẠI CHÍNH property \`age\` (đệ quy vô hạn cho tới khi tràn stack). Quy ước phổ biến: tên thuộc tính
lưu trữ thật sự có dấu gạch dưới ở đầu (\`_age\`) để phân biệt rõ với tên property công khai (\`age\`) mà
người dùng class thấy và tương tác.
`,
      solution: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("Tuổi không được âm")
        self._age = value


def try_create_person(name, age):
    try:
        p = Person(name, age)
        return ("ok", p.age)
    except ValueError as e:
        return ("error", str(e))`,
      complexity: {
        question: 'Độ phức tạp thời gian của `try_create_person`?',
        options: ['O(1) — một phép so sánh và gán, không phụ thuộc kích thước input', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 0,
        why: 'Setter chỉ thực hiện một phép so sánh và một phép gán — chi phí hằng số, không phụ thuộc vào giá trị cụ thể của age.',
      },
      realWorld: 'Validate dữ liệu ngay tại tầng model (ví dụ ORM/entity trong ứng dụng backend): tuổi không âm, số dư tài khoản không âm, email đúng định dạng — chặn dữ liệu sai NGAY tại điểm tạo/sửa object, tránh dữ liệu bẩn lan sâu vào database rồi mới phát hiện qua báo cáo lỗi khó truy nguyên.',
    },
    {
      id: 'py-slots-point',
      title: '__slots__ giới hạn thuộc tính',
      en: 'Restrict Attributes with __slots__',
      difficulty: 'Medium',
      targetMinutes: 10,
      entry: 'describe_point',
      lang: 'python',
      statement: `
Viết class \`Point\` với \`__slots__ = ("x", "y")\` (chỉ cho phép đúng 2 thuộc tính \`x\`, \`y\`), và
\`__init__(self, x, y)\` gán hai thuộc tính đó.

Viết hàm \`describe_point(x, y, extra_name, extra_value)\`:
- Tạo \`Point(x, y)\`.
- Thử \`setattr(point, extra_name, extra_value)\` (gán động một thuộc tính tên \`extra_name\`).
- Trả về list \`[point.x, point.y, "allowed"]\` nếu gán thành công, hoặc \`[point.x, point.y, "blocked"]\` nếu
  bị chặn bởi \`AttributeError\` (vì \`extra_name\` không nằm trong \`__slots__\`).

**Ví dụ**
- \`describe_point(1, 2, "z", 99)\` → \`[1, 2, "blocked"]\` (\`"z"\` không thuộc \`__slots__\`)
- \`describe_point(5, -3, "x", 100)\` → \`[5, -3, "allowed"]\` (\`"x"\` LÀ một slot hợp lệ, gán lại vẫn được phép)
`,
      starter: `class Point:\n    __slots__ = (\"x\", \"y\")\n\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n\ndef describe_point(x, y, extra_name, extra_value):\n    p = Point(x, y)\n    result = [p.x, p.y]\n    try:\n        setattr(p, extra_name, extra_value)\n        result.append(\"allowed\")\n    except AttributeError:\n        result.append(\"blocked\")\n    return result\n`,
      tests: [
        { args: [1, 2, 'z', 99], expected: [1, 2, 'blocked'], name: '"z" không thuộc __slots__ -> bị chặn' },
        { args: [0, 0, 'w', 1], expected: [0, 0, 'blocked'], name: '"w" cũng bị chặn' },
        { args: [5, -3, 'x', 100], expected: [5, -3, 'allowed'], name: '"x" là slot hợp lệ, gán lại vẫn cho phép' },
        { args: [7, 8, 'y', 0], expected: [7, 8, 'allowed'], name: '"y" cũng là slot hợp lệ' },
        { args: [-1, -1, 'label', 'hi'], expected: [-1, -1, 'blocked'], name: '"label" không thuộc __slots__' },
      ],
      hints: [
        '`__slots__ = ("x", "y")` phải được khai báo ở CẤP LỚP (ngay dưới dòng `class Point:`), không phải bên trong `__init__`.',
        'Với `__slots__` khai báo đúng, Python TỰ ĐỘNG raise `AttributeError` khi gán bất kỳ thuộc tính nào KHÔNG có trong danh sách — bạn không cần tự viết logic kiểm tra thủ công, chỉ cần khai báo `__slots__` đúng và để Python tự chặn.',
        'Phần code trong `describe_point` đã được viết sẵn đầy đủ trong starter — nhiệm vụ chính của bài này là khai báo ĐÚNG `__slots__` cho class `Point`.',
      ],
      diagnostics: [
        { test: '__slots__\\s*=\\s*\\[', message: '`__slots__` thường được khai báo bằng tuple `("x", "y")` (dùng dấu ngoặc đơn); dùng list `["x", "y"]` vẫn hoạt động đúng về mặt chức năng, nhưng tuple là quy ước phổ biến hơn vì `__slots__` mang tính KHAI BÁO CỐ ĐỊNH, không cần thay đổi được sau khi định nghĩa class.' },
      ],
      approach: `
Bài này cho thấy \`__slots__\` hoạt động HOÀN TOÀN THỤ ĐỘNG — chỉ cần khai báo đúng, Python tự lo phần chặn
gán thuộc tính lạ, không cần bất kỳ logic \`if\`/\`raise\` thủ công nào.

\`\`\`python
class Point:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y
\`\`\`

**Vì sao \`p.x = 100\` (gán lại một slot ĐÃ khai báo) luôn được phép, còn \`p.z = 99\` (chưa khai báo) luôn bị
chặn?** \`__slots__\` không phải "khoá object lại hoàn toàn" — nó chỉ giới hạn TẬP HỢP TÊN thuộc tính hợp lệ
mà instance được phép có. Gán lại giá trị mới cho một tên ĐÃ NẰM trong danh sách vẫn là thao tác bình
thường, được phép vô hạn lần; chỉ có việc THÊM MỘT TÊN MỚI ngoài danh sách mới bị chặn. Đây chính là điểm
khác biệt so với việc chỉ đơn giản làm object "đóng băng" (immutable) — \`__slots__\` giới hạn "HÌNH DẠNG"
của object (những tên thuộc tính nào tồn tại), không giới hạn việc thay đổi GIÁ TRỊ của các thuộc tính đã có.
`,
      solution: `class Point:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y


def describe_point(x, y, extra_name, extra_value):
    p = Point(x, y)
    result = [p.x, p.y]
    try:
        setattr(p, extra_name, extra_value)
        result.append("allowed")
    except AttributeError:
        result.append("blocked")
    return result`,
      complexity: {
        question: 'So với một class KHÔNG dùng `__slots__` (dùng `__dict__` mặc định), lợi ích chính của `__slots__` là gì về mặt độ phức tạp KHÔNG GIAN (bộ nhớ)?',
        options: [
          'Không có khác biệt gì về bộ nhớ',
          'Giảm đáng kể bộ nhớ mỗi instance tiêu tốn — vì không cần cấp phát một `__dict__` riêng (vốn có overhead đáng kể) cho từng instance, quan trọng khi có RẤT NHIỀU instance nhỏ',
          '`__slots__` làm object chạy nhanh hơn nhưng tốn NHIỀU bộ nhớ hơn `__dict__`',
          '`__slots__` chỉ ảnh hưởng tốc độ truy cập thuộc tính, không ảnh hưởng bộ nhớ',
        ],
        answer: 1,
        why: 'Mỗi instance thường (không dùng `__slots__`) mang theo một `__dict__` riêng để lưu thuộc tính động — cấu trúc này có overhead bộ nhớ đáng kể. `__slots__` thay `__dict__` bằng một cấu trúc cố định, gọn nhẹ hơn nhiều, đặc biệt đáng kể khi nhân với số lượng LỚN instance.',
      },
      realWorld: 'Game engine với hàng trăm nghìn entity/particle nhỏ, xử lý dữ liệu lớn (mỗi dòng CSV/log là một object), hoặc thư viện cần tối ưu bộ nhớ nghiêm ngặt (ví dụ xử lý dữ liệu khoa học với hàng triệu điểm dữ liệu) — `__slots__` là công cụ chuẩn để giảm đáng kể lượng bộ nhớ tiêu tốn trong các tình huống này.',
    },
    {
      id: 'py-abstract-payment-method',
      title: 'Interface bắt buộc bằng ABC',
      en: 'Enforced Interface with ABC',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'process_payment',
      lang: 'python',
      statement: `
Viết class trừu tượng \`PaymentMethod\` kế thừa \`ABC\`, với \`@abstractmethod pay(self, amount)\`. Viết hai
lớp con: \`CreditCard\` (\`pay\` trả về \`f"Thanh toán {amount} bằng thẻ tín dụng"\`) và \`CashOnDelivery\`
(\`pay\` trả về \`f"Thanh toán {amount} khi nhận hàng"\`).

Viết hàm \`process_payment(method_name, amount)\`:
- \`"credit_card"\` → tạo \`CreditCard()\`, gọi \`pay(amount)\`, trả kết quả.
- \`"cod"\` → tạo \`CashOnDelivery()\`, gọi \`pay(amount)\`, trả kết quả.
- \`"abstract_direct"\` → thử tạo trực tiếp \`PaymentMethod()\`; nếu bị chặn bởi \`TypeError\` (đúng như mong
  đợi vì còn \`@abstractmethod\` chưa override), trả về chuỗi \`"bi chan dung nhu mong doi"\`; nếu KHÔNG bị
  chặn (nghĩa là code sai), trả về \`"khong bi chan"\`.
- Giá trị khác → trả về \`"khong ho tro"\`.
`,
      starter: `from abc import ABC, abstractmethod\n\nclass PaymentMethod(ABC):\n    @abstractmethod\n    def pay(self, amount):\n        ...\n\n\nclass CreditCard(PaymentMethod):\n    def pay(self, amount):\n        return f\"Thanh toan {amount} bang the tin dung\"\n\n\nclass CashOnDelivery(PaymentMethod):\n    def pay(self, amount):\n        return f\"Thanh toan {amount} khi nhan hang\"\n\n\ndef process_payment(method_name, amount):\n    if method_name == \"credit_card\":\n        method = CreditCard()\n    elif method_name == \"cod\":\n        method = CashOnDelivery()\n    elif method_name == \"abstract_direct\":\n        try:\n            PaymentMethod()\n            return \"khong bi chan\"\n        except TypeError:\n            return \"bi chan dung nhu mong doi\"\n    else:\n        return \"khong ho tro\"\n    return method.pay(amount)\n`,
      tests: [
        { args: ['credit_card', 100], expected: 'Thanh toan 100 bang the tin dung', name: 'Thẻ tín dụng' },
        { args: ['cod', 50], expected: 'Thanh toan 50 khi nhan hang', name: 'Thanh toán khi nhận hàng' },
        { args: ['abstract_direct', 0], expected: 'bi chan dung nhu mong doi', name: 'Khởi tạo trực tiếp lớp trừu tượng phải bị chặn' },
        { args: ['unknown', 10], expected: 'khong ho tro', name: 'Loại thanh toán không hỗ trợ' },
        { args: ['credit_card', 250], expected: 'Thanh toan 250 bang the tin dung', name: 'Số tiền khác' },
      ],
      hints: [
        '`PaymentMethod` phải kế thừa `ABC` (từ `abc import ABC`), và phương thức `pay` phải có decorator `@abstractmethod` ngay phía trên `def pay(self, amount):`.',
        'Cả `CreditCard` và `CashOnDelivery` đều phải kế thừa `PaymentMethod` VÀ override đầy đủ `pay` (có phần thân code thật) — thiếu override sẽ khiến CHÍNH lớp con đó cũng không khởi tạo được.',
        'Phần logic `process_payment` đã được viết sẵn đầy đủ trong starter — nhiệm vụ chính của bài này là khai báo đúng `PaymentMethod`/`CreditCard`/`CashOnDelivery` để `ABC` enforce đúng như mong đợi.',
      ],
      diagnostics: [
        { test: 'class\\s+PaymentMethod\\s*:(?!.*ABC)', message: '`PaymentMethod` cần kế thừa `ABC` (viết `class PaymentMethod(ABC):`) — nếu không, nó chỉ là một class thường, `@abstractmethod` sẽ không có hiệu lực enforce nào cả, và `PaymentMethod()` sẽ KHÔNG bị chặn như đề bài yêu cầu.' },
      ],
      approach: `
Bài này chứng minh trực tiếp điểm khác biệt cốt lõi của \`ABC\` so với type hint thông thường: **enforce
THẬT lúc runtime**, không chỉ là tài liệu.

\`\`\`python
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount):
        ...

class CreditCard(PaymentMethod):
    def pay(self, amount):
        return f"Thanh toan {amount} bang the tin dung"

class CashOnDelivery(PaymentMethod):
    def pay(self, amount):
        return f"Thanh toan {amount} khi nhan hang"
\`\`\`

**Vì sao \`PaymentMethod()\` raise \`TypeError\` ngay lập tức, mà không phải khi gọi \`.pay()\`?** Python kiểm
tra tại chính THỜI ĐIỂM GỌI \`TênLớp()\` xem lớp đó (hoặc bất kỳ lớp cha nào trong cây kế thừa) còn phương
thức nào đánh dấu \`@abstractmethod\` mà CHƯA được lớp hiện tại override hay không. Đây là lý do bạn không
thể "lỡ" tạo ra một object không đầy đủ rồi mới gặp lỗi khi dùng nó về sau — lỗi được bắt SỚM NHẤT có thể,
ngay từ lúc khởi tạo, giúp phát hiện thiếu sót implementation ngay lập tức thay vì để nó âm thầm trôi tới
tận lúc gọi phương thức thiếu.
`,
      solution: `from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount):
        ...


class CreditCard(PaymentMethod):
    def pay(self, amount):
        return f"Thanh toan {amount} bang the tin dung"


class CashOnDelivery(PaymentMethod):
    def pay(self, amount):
        return f"Thanh toan {amount} khi nhan hang"


def process_payment(method_name, amount):
    if method_name == "credit_card":
        method = CreditCard()
    elif method_name == "cod":
        method = CashOnDelivery()
    elif method_name == "abstract_direct":
        try:
            PaymentMethod()
            return "khong bi chan"
        except TypeError:
            return "bi chan dung nhu mong doi"
    else:
        return "khong ho tro"
    return method.pay(amount)`,
      complexity: {
        question: 'Độ phức tạp thời gian của `process_payment`?',
        options: ['O(1) — số nhánh if/elif cố định, mỗi nhánh chỉ tạo một object và gọi một phương thức', 'O(n) theo amount', 'O(log n)', 'O(n²)'],
        answer: 0,
        why: 'Toàn bộ hàm chỉ là một chuỗi kiểm tra if/elif cố định (không phụ thuộc kích thước input) và tối đa một lần tạo object + gọi phương thức — chi phí hằng số.',
      },
      realWorld: 'Hệ thống thanh toán/plugin thực tế (Stripe, PayPal, giao hàng COD...) đều định nghĩa một interface `PaymentMethod`/`ShippingProvider` chung bằng `ABC`, đảm bảo MỌI nhà cung cấp mới thêm vào sau này đều buộc phải implement đúng các phương thức cần thiết — nếu quên, lỗi xuất hiện NGAY khi triển khai (khởi tạo), không phải khi khách hàng thực sự thanh toán.',
    },
    {
      id: 'py-classmethod-factory-polymorphic',
      title: 'Classmethod factory và bẫy đa hình',
      en: 'Classmethod Factory & the Polymorphism Trap',
      difficulty: 'Hard',
      targetMinutes: 15,
      entry: 'make_from_fahrenheit_typename',
      lang: 'python',
      statement: `
Viết class \`Temperature\`: \`__init__(self, celsius)\` lưu \`celsius\`; \`@classmethod from_fahrenheit(cls,
f)\` tạo một instance từ độ F (công thức: \`(f - 32) * 5 / 9\`) — **PHẢI dùng \`cls(...)\`**, không hardcode
tên lớp.

Viết thêm class \`FancyTemperature(Temperature)\` (kế thừa, không cần override gì thêm).

Viết hàm \`make_from_fahrenheit_typename(cls_name, f)\`:
- Nếu \`cls_name == "Temperature"\`: gọi \`Temperature.from_fahrenheit(f)\`.
- Ngược lại: gọi \`FancyTemperature.from_fahrenheit(f)\`.
- Trả về list \`[tên_lớp_thật_sự_của_object, celsius_đã_làm_tròn_2_chữ_số]\`.

**Ví dụ**
- \`make_from_fahrenheit_typename("Temperature", 32)\` → \`["Temperature", 0.0]\`
- \`make_from_fahrenheit_typename("FancyTemperature", 212)\` → \`["FancyTemperature", 100.0]\` (⚠️ nếu
  \`from_fahrenheit\` hardcode \`Temperature(...)\` thay vì \`cls(...)\`, kết quả sẽ SAI thành
  \`["Temperature", 100.0]\`)
`,
      starter: `class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    @classmethod\n    def from_fahrenheit(cls, f):\n        # Tra ve mot instance (dung cls(...), KHONG hardcode Temperature(...))\n        \n\n\nclass FancyTemperature(Temperature):\n    pass\n\n\ndef make_from_fahrenheit_typename(cls_name, f):\n    if cls_name == \"Temperature\":\n        obj = Temperature.from_fahrenheit(f)\n    else:\n        obj = FancyTemperature.from_fahrenheit(f)\n    return [type(obj).__name__, round(obj.celsius, 2)]\n`,
      tests: [
        { args: ['Temperature', 32], expected: ['Temperature', 0.0], name: '32°F = 0°C, đúng lớp Temperature' },
        { args: ['FancyTemperature', 212], expected: ['FancyTemperature', 100.0], name: '212°F = 100°C, PHẢI trả về đúng lớp FancyTemperature (kiểm tra cls, không hardcode)' },
        { args: ['Temperature', 98.6], expected: ['Temperature', 37.0], name: 'Thân nhiệt người, làm tròn 2 chữ số' },
        { args: ['FancyTemperature', 32], expected: ['FancyTemperature', 0.0], name: 'FancyTemperature ở điểm đóng băng' },
        { args: ['Temperature', -40], expected: ['Temperature', -40.0], name: 'Điểm -40 là nơi C và F bằng nhau' },
      ],
      hints: [
        'Bên trong `from_fahrenheit(cls, f)`, dùng công thức `(f - 32) * 5 / 9` để tính celsius, rồi TRẢ VỀ bằng cách gọi `cls(gia_tri_celsius)` — KHÔNG viết cứng `Temperature(gia_tri_celsius)`.',
        '`cls` là tham số đặc biệt của `@classmethod`: nó LUÔN là lớp thực sự đứng trước dấu chấm khi gọi phương thức. Gọi `FancyTemperature.from_fahrenheit(212)` sẽ khiến `cls` bên trong hàm chính LÀ `FancyTemperature`, không phải `Temperature`, dù phương thức được ĐỊNH NGHĨA trong `Temperature`.',
        'Nếu bạn hardcode `return Temperature(...)`, mọi lời gọi qua `FancyTemperature.from_fahrenheit(...)` sẽ luôn trả về một `Temperature` thuần, khiến `type(obj).__name__` sai thành `"Temperature"` thay vì `"FancyTemperature"` — đây chính xác là bug mà bộ test của bài này được thiết kế để phát hiện.',
      ],
      diagnostics: [
        { test: 'return\\s+Temperature\\s*\\(', message: 'Hardcode `return Temperature(...)` trong `from_fahrenheit` phá vỡ tính đa hình: khi `FancyTemperature.from_fahrenheit(...)` được gọi, kết quả vẫn luôn là một `Temperature` thuần thay vì đúng lớp `FancyTemperature` đang gọi. Hãy dùng `return cls(...)`.' },
      ],
      approach: `
Đây là bẫy tinh vi nhất của cả module: \`@classmethod\` factory chỉ thực sự hỗ trợ đa hình khi dùng \`cls\`
thay vì hardcode tên lớp.

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5 / 9)


class FancyTemperature(Temperature):
    pass
\`\`\`

**Vì sao \`cls((f - 32) * 5 / 9)\` "tự động đúng" cho cả \`Temperature\` lẫn \`FancyTemperature\`, dù chỉ viết
CÓ MỘT phiên bản \`from_fahrenheit\`?** Vì \`@classmethod\` nhận \`cls\` là **lớp thực sự được dùng để gọi**,
được Python tự động xác định tại thời điểm gọi — không phải lớp nơi phương thức được ĐỊNH NGHĨA. Gọi
\`Temperature.from_fahrenheit(32)\` → \`cls = Temperature\`. Gọi \`FancyTemperature.from_fahrenheit(212)\` →
\`cls = FancyTemperature\`, dù \`FancyTemperature\` không hề tự định nghĩa lại \`from_fahrenheit\` (nó THỪA
HƯỞNG nguyên vẹn từ \`Temperature\`). Đây chính là sức mạnh thực sự của \`classmethod\` so với việc chỉ dùng
\`@staticmethod\` hay hardcode tên lớp: MỘT đoạn code factory dùng lại được ĐÚNG CÁCH cho toàn bộ cây kế thừa
phía sau, kể cả những lớp con được viết SAU NÀY mà bạn chưa biết trước khi viết \`Temperature\`.
`,
      solution: `class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5 / 9)


class FancyTemperature(Temperature):
    pass


def make_from_fahrenheit_typename(cls_name, f):
    if cls_name == "Temperature":
        obj = Temperature.from_fahrenheit(f)
    else:
        obj = FancyTemperature.from_fahrenheit(f)
    return [type(obj).__name__, round(obj.celsius, 2)]`,
      complexity: {
        question: 'Độ phức tạp thời gian của `make_from_fahrenheit_typename`?',
        options: ['O(1) — một phép tính công thức và tạo một object, không phụ thuộc kích thước input', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 0,
        why: 'Toàn bộ luồng chỉ là một phép tính số học và tạo một instance — chi phí hằng số, không có vòng lặp hay đệ quy nào phụ thuộc kích thước dữ liệu.',
      },
      realWorld: 'Thư viện thực tế dùng mẫu này RẤT nhiều: `datetime.fromtimestamp()`, `pathlib.Path.home()`, `dict.fromkeys()` — đều là `classmethod` factory cho phép lớp con (nếu có) kế thừa đúng hành vi tạo object mà không cần viết lại; hiểu đúng cơ chế `cls` giúp tránh viết factory method "chỉ đúng cho một lớp duy nhất" khi thiết kế thư viện/framework cho người khác kế thừa.',
    },
  ],
},
];
