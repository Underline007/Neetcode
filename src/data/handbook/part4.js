/**
 * CẨM NANG CÚ PHÁP PYTHON — PHẦN D: TỔ CHỨC CODE
 * Lớp · kế thừa & phương thức đặc biệt · module & import · ngoại lệ · chú thích kiểu.
 */
export default [
/* ==================================================================== */
{
  id: 'hb-class',
  part: 'D',
  title: 'Lớp và đối tượng',
  icon: '🏗️',
  minutes: 7,
  body: `
## 1. Khai báo tối thiểu

\`\`\`python
class NguoiDung:
    def __init__(self, ten, tuoi=0):   # hàm khởi tạo
        self.ten = ten                 # thuộc tính của đối tượng
        self.tuoi = tuoi

    def chao(self):                    # phương thức
        return f"Tôi là {self.ten}"

u = NguoiDung("Minh", 25)
u.chao()          # 'Tôi là Minh'
u.ten             # 'Minh'
\`\`\`

## 2. \`self\` — bắt buộc, và Python không tự thêm

Mọi phương thức phải có \`self\` là tham số **đầu tiên**. Thiếu nó là lỗi
\`takes 0 positional arguments but 1 was given\` — lỗi số một của người mới học OOP Python.

\`\`\`python
class A:
    def f(self): ...      # ✅
    def g(): ...          # ❌ gọi a.g() sẽ lỗi
\`\`\`

Khi gọi \`u.chao()\`, Python tự truyền \`u\` vào \`self\`. Tên \`self\` chỉ là quy ước, nhưng
**đừng đổi** — cả cộng đồng đọc quen rồi.

## 3. Thuộc tính lớp vs thuộc tính đối tượng

\`\`\`python
class Dem:
    tong = 0                  # thuộc tính LỚP — dùng chung mọi đối tượng

    def __init__(self):
        self.rieng = 0        # thuộc tính ĐỐI TƯỢNG — mỗi cái một bản
        Dem.tong += 1

a, b = Dem(), Dem()
Dem.tong      # 2 — dùng chung
a.rieng       # 0 — riêng
\`\`\`

> ⚠️ Bẫy: thuộc tính lớp mà là list/dict thì **mọi đối tượng dùng chung**:
> \`\`\`python
> class A:
>     ds = []          # ❌ chung cho tất cả
> A().ds.append(1)
> A().ds               # [1] — object mới vẫn thấy!
> \`\`\`
> Cứ khởi tạo trong \`__init__\`: \`self.ds = []\`.

## 4. Quy ước riêng tư

Python **không có** \`private\` thật sự — chỉ có quy ước:

\`\`\`python
self.cong_khai       # ai dùng cũng được
self._noi_bo         # quy ước: "đừng đụng vào từ ngoài"
self.__rat_rieng     # Python đổi tên thành _Ten__rat_rieng (name mangling)
\`\`\`

Một dấu gạch dưới là đủ cho hầu hết trường hợp. Hai dấu chỉ dùng khi thật sự cần tránh
trùng tên với lớp con.

## 5. \`@property\` — thuộc tính tính toán

\`\`\`python
class HinhChuNhat:
    def __init__(self, r, c):
        self.r, self.c = r, c

    @property
    def dien_tich(self):
        return self.r * self.c

hcn = HinhChuNhat(3, 4)
hcn.dien_tich          # 12 — KHÔNG có ngoặc
\`\`\`

Thêm bộ kiểm tra khi gán:

\`\`\`python
class TaiKhoan:
    def __init__(self):
        self._so_du = 0

    @property
    def so_du(self):
        return self._so_du

    @so_du.setter
    def so_du(self, gia_tri):
        if gia_tri < 0:
            raise ValueError("số dư không được âm")
        self._so_du = gia_tri
\`\`\`

Nhờ vậy đổi từ thuộc tính thường sang có kiểm tra mà **không phải sửa code đang dùng**.

## 6. \`@staticmethod\` và \`@classmethod\`

\`\`\`python
class Ngay:
    def __init__(self, d, m, y):
        self.d, self.m, self.y = d, m, y

    @classmethod
    def tu_chuoi(cls, s):              # nhận LỚP, dùng làm hàm khởi tạo phụ
        d, m, y = map(int, s.split("/"))
        return cls(d, m, y)

    @staticmethod
    def la_nam_nhuan(y):               # không cần self lẫn cls
        return y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)

Ngay.tu_chuoi("01/01/2024")
Ngay.la_nam_nhuan(2024)
\`\`\`

Quy tắc chọn: cần dữ liệu đối tượng → \`self\`; cần tạo đối tượng → \`classmethod\`;
không cần gì cả → \`staticmethod\`.

## 7. \`@dataclass\` — bớt code lặp

\`\`\`python
from dataclasses import dataclass, field

@dataclass
class Diem:
    x: int
    y: int = 0
    nhan: list = field(default_factory=list)   # mặc định biến đổi được phải dùng cái này

p = Diem(3, 4)
print(p)              # Diem(x=3, y=4, nhan=[])  ← có sẵn __repr__
Diem(3, 4) == Diem(3, 4)   # True               ← có sẵn __eq__
\`\`\`

Thêm \`@dataclass(frozen=True)\` để bất biến và băm được (dùng làm khoá dict).

Đây là cách gọn nhất để tạo lớp "chỉ chứa dữ liệu" — đỡ viết \`__init__\`, \`__repr__\`, \`__eq__\` bằng tay.

## 8. Xem bên trong một đối tượng

\`\`\`python
vars(u)              # {'ten': 'Minh', 'tuoi': 25}
dir(u)               # mọi thuộc tính & phương thức
isinstance(u, NguoiDung)
hasattr(u, "ten")
getattr(u, "ten", "không có")
setattr(u, "ten", "Lan")
\`\`\`
`,
},
/* ==================================================================== */
{
  id: 'hb-ke-thua-dunder',
  part: 'D',
  title: 'Kế thừa & phương thức đặc biệt',
  icon: '🧬',
  minutes: 6,
  body: `
## 1. Kế thừa

\`\`\`python
class DongVat:
    def __init__(self, ten):
        self.ten = ten
    def keu(self):
        return "..."

class Cho(DongVat):
    def __init__(self, ten, giong):
        super().__init__(ten)      # gọi __init__ của lớp cha
        self.giong = giong
    def keu(self):                 # ghi đè
        return "Gâu gâu"
\`\`\`

\`super()\` gọi lên lớp cha. **Luôn gọi \`super().__init__()\`** trong \`__init__\` của lớp con,
nếu không các thuộc tính của cha sẽ không được khởi tạo.

Gọi thêm hành vi của cha thay vì thay hẳn:

\`\`\`python
def keu(self):
    return super().keu() + " (to)"
\`\`\`

## 2. Kiểm tra quan hệ

\`\`\`python
isinstance(c, Cho)        # c là Cho (hoặc lớp con của Cho)?
isinstance(c, DongVat)    # True — kế thừa cũng tính
issubclass(Cho, DongVat)  # True
Cho.__mro__               # thứ tự Python tìm phương thức
\`\`\`

## 3. Duck typing — Python quan tâm "làm được gì", không quan tâm "là gì"

\`\`\`python
def in_tat_ca(dãy):
    for x in dãy:         # chạy với list, tuple, set, generator, file...
        print(x)
\`\`\`

Không cần kế thừa chung một lớp cha. Chỉ cần đối tượng **có phương thức cần dùng** là được.
Đây là lý do Python ít dùng interface/abstract class hơn Java.

Cần ép buộc thì có \`abc\`:

\`\`\`python
from abc import ABC, abstractmethod

class Hinh(ABC):
    @abstractmethod
    def dien_tich(self): ...

Hinh()      # ❌ TypeError — không tạo được lớp trừu tượng
\`\`\`

## 4. Phương thức đặc biệt (dunder) — bảng tra

Định nghĩa chúng là đối tượng của bạn dùng được với cú pháp có sẵn của Python:

| Viết | Gọi tới | Dùng để |
|---|---|---|
| \`str(x)\`, \`print(x)\` | \`__str__\` | chuỗi cho **người đọc** |
| \`repr(x)\`, hiện trong REPL | \`__repr__\` | chuỗi cho **lập trình viên gỡ lỗi** |
| \`len(x)\` | \`__len__\` | độ dài |
| \`x[i]\` | \`__getitem__\` | truy cập theo chỉ số/khoá |
| \`x[i] = v\` | \`__setitem__\` | gán |
| \`i in x\` | \`__contains__\` | kiểm tra thuộc về |
| \`for i in x\` | \`__iter__\` | duyệt |
| \`x + y\` | \`__add__\` | cộng |
| \`x < y\` | \`__lt__\` | so sánh (đủ cho \`sort()\`) |
| \`x == y\` | \`__eq__\` | bằng nhau |
| \`hash(x)\` | \`__hash__\` | làm khoá dict/set |
| \`x()\` | \`__call__\` | gọi như hàm |
| \`with x:\` | \`__enter__\`/\`__exit__\` | quản lý tài nguyên |
| \`bool(x)\`, \`if x:\` | \`__bool__\` | đúng/sai |

## 5. Ví dụ đầy đủ

\`\`\`python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, khac):
        return Vector(self.x + khac.x, self.y + khac.y)

    def __eq__(self, khac):
        return (self.x, self.y) == (khac.x, khac.y)

    def __hash__(self):
        return hash((self.x, self.y))     # định nghĩa __eq__ thì nên định nghĩa cả cái này

    def __len__(self):
        return 2

Vector(1,2) + Vector(3,4)      # Vector(4, 6)
Vector(1,2) == Vector(1,2)     # True
{Vector(1,2)}                  # dùng trong set được
\`\`\`

> ⚠️ Định nghĩa \`__eq__\` mà **không** định nghĩa \`__hash__\` thì lớp mất khả năng băm —
> không cho vào set/dict được nữa.

## 6. \`__str__\` vs \`__repr__\`

\`\`\`python
print(x)     # dùng __str__, không có thì lùi về __repr__
x            # trong REPL dùng __repr__
[x]          # phần tử trong list LUÔN dùng __repr__
\`\`\`

Nếu chỉ viết một cái, hãy viết \`__repr__\` — nó phủ được nhiều trường hợp hơn. Quy ước tốt:
\`__repr__\` nên trả về chuỗi mà dán vào code là tạo lại được đối tượng.

## 7. Kế thừa nhiều lớp & MRO

\`\`\`python
class A: ...
class B(A): ...
class C(A): ...
class D(B, C): ...

D.__mro__     # D, B, C, A, object — thứ tự tìm phương thức
\`\`\`

Python dùng thuật toán C3 để xếp thứ tự. Thực tế: **tránh kế thừa nhiều lớp** trừ khi dùng
mixin (lớp nhỏ chỉ thêm một nhóm hành vi). Ưu tiên **chứa** hơn **kế thừa** — một đối tượng
*có* một đối tượng khác thường dễ hiểu hơn *là* một loại của nó.
`,
},
/* ==================================================================== */
{
  id: 'hb-module-import',
  part: 'D',
  title: 'Module, package & import',
  icon: '📦',
  minutes: 5,
  body: `
## 1. Các dạng import

\`\`\`python
import math                      # dùng: math.sqrt(4)
import math as m                 # đặt bí danh
from math import sqrt            # dùng thẳng: sqrt(4)
from math import sqrt, pi        # nhiều thứ
from math import sqrt as can     # đổi tên
from math import *               # ❌ TRÁNH — làm bẩn không gian tên
\`\`\`

Nên dùng \`import X\` hoặc \`from X import ten_cu_the\`. Dấu \`*\` khiến người đọc không biết
một cái tên đến từ đâu, và dễ ghi đè nhầm.

## 2. Module chính là file .py

\`\`\`
du_an/
  main.py
  tien_ich.py
\`\`\`

\`\`\`python
# main.py
import tien_ich
from tien_ich import doc_file
\`\`\`

## 3. Package chính là thư mục

\`\`\`
du_an/
  main.py
  goi/
    __init__.py      # có file này là Python coi thư mục là package
    a.py
    b.py
\`\`\`

\`\`\`python
from goi import a
from goi.a import ham
\`\`\`

\`__init__.py\` có thể rỗng. Đặt vào đó những gì bạn muốn lộ ra khi ai đó \`import goi\`.

## 4. Import tương đối (bên trong package)

\`\`\`python
from . import b            # cùng thư mục
from .b import ham
from ..khac import c       # lùi lên một cấp
\`\`\`

> ⚠️ Import tương đối **chỉ chạy khi file được chạy như một phần của package**
> (\`python -m goi.a\`), không chạy khi \`python goi/a.py\`. Đây là nguồn gốc của lỗi
> \`ImportError: attempted relative import with no known parent package\`.

## 5. Python tìm module ở đâu

\`\`\`python
import sys
sys.path        # danh sách thư mục được tìm, theo thứ tự
\`\`\`

Thứ tự: thư mục của file đang chạy → \`PYTHONPATH\` → thư viện chuẩn → site-packages.

> ⚠️ **Đừng đặt tên file trùng thư viện chuẩn.** File tên \`random.py\` sẽ khiến
> \`import random\` lấy file của bạn thay vì thư viện — lỗi rất khó lần ra.

## 6. \`if __name__ == "__main__"\`

\`\`\`python
def main():
    ...

if __name__ == "__main__":
    main()
\`\`\`

\`__name__\` bằng \`"__main__"\` khi file được chạy trực tiếp, và bằng tên module khi bị import.
Nhờ vậy một file vừa dùng làm thư viện, vừa chạy độc lập được.

## 7. Module chỉ được nạp một lần

\`\`\`python
import tien_ich    # lần đầu: chạy toàn bộ file
import tien_ich    # lần sau: lấy từ bộ nhớ đệm, KHÔNG chạy lại
\`\`\`

Hệ quả: code ở cấp cao nhất của module chạy **một lần duy nhất** — hợp cho khởi tạo, nhưng
đừng để tác dụng phụ nặng nề ở đó.

## 8. Import vòng — và cách gỡ

\`\`\`python
# a.py: import b        |  # b.py: import a     -> ImportError
\`\`\`

Ba cách xử lý, theo thứ tự nên thử:
1. **Tách phần dùng chung** ra một module thứ ba — cách đúng nhất
2. Chuyển \`import\` vào **bên trong hàm** (chỉ nạp khi cần)
3. Import module thay vì import tên: \`import b\` rồi dùng \`b.ham()\`

## 9. Cấu trúc dự án nhỏ hay dùng

\`\`\`
du_an/
  README.md
  requirements.txt
  .gitignore
  src/goi_cua_toi/
    __init__.py
    main.py
  tests/
    test_main.py
\`\`\`
`,
},
/* ==================================================================== */
{
  id: 'hb-ngoai-le',
  part: 'D',
  title: 'Ngoại lệ (try / except)',
  icon: '🚨',
  minutes: 6,
  body: `
## 1. Cú pháp đầy đủ

\`\`\`python
try:
    kq = 10 / mau
except ZeroDivisionError:
    print("chia cho 0")
except (ValueError, TypeError) as e:      # bắt nhiều loại
    print(f"lỗi dữ liệu: {e}")
else:
    print("không có lỗi:", kq)            # chạy khi KHÔNG có ngoại lệ
finally:
    print("luôn chạy")                    # dọn dẹp, chạy dù có lỗi hay không
\`\`\`

Thứ tự \`except\` quan trọng: **loại cụ thể phải đứng trước loại tổng quát**, vì Python
lấy nhánh khớp đầu tiên.

## 2. Đừng bắt trắng

\`\`\`python
try:
    ...
except:              # ❌ bắt cả Ctrl+C và lỗi hệ thống
    pass
except Exception:    # ⚠️ đỡ hơn nhưng vẫn quá rộng
    pass
except ValueError:   # ✅ bắt đúng thứ bạn dự đoán được
    ...
\`\`\`

\`except: pass\` là cách chắc chắn nhất để biến một lỗi nhỏ thành một bug không tài nào tìm ra.
Nếu buộc phải bắt rộng, ít nhất hãy ghi log:

\`\`\`python
except Exception as e:
    logging.exception("lỗi khi xử lý %s", ten)
    raise                    # ném lại sau khi đã ghi
\`\`\`

## 3. Cây phân cấp ngoại lệ hay gặp

\`\`\`
BaseException
 └── Exception
      ├── ArithmeticError → ZeroDivisionError, OverflowError
      ├── LookupError     → IndexError, KeyError
      ├── ValueError      → UnicodeDecodeError
      ├── TypeError
      ├── OSError         → FileNotFoundError, PermissionError
      ├── AttributeError
      ├── NameError       → UnboundLocalError
      └── StopIteration
\`\`\`

Bắt \`LookupError\` là bắt cả \`IndexError\` lẫn \`KeyError\`.

## 4. Ném ngoại lệ

\`\`\`python
raise ValueError("tuổi không được âm")
raise                                  # ném lại ngoại lệ đang xử lý
raise ValueError("...") from e         # giữ nguyên nguyên nhân gốc
\`\`\`

\`from e\` giúp traceback hiện *"The above exception was the direct cause of..."* — rất quý khi lần lỗi.

## 5. Ngoại lệ tự định nghĩa

\`\`\`python
class LoiNghiepVu(Exception):
    """Lớp gốc cho mọi lỗi của ứng dụng này."""

class KhongDuTien(LoiNghiepVu):
    def __init__(self, can, co):
        super().__init__(f"cần {can}, chỉ có {co}")
        self.can, self.co = can, co
\`\`\`

Có một lớp gốc riêng cho ứng dụng giúp người dùng thư viện bắt được
\`except LoiNghiepVu\` mà không phải liệt kê từng loại.

## 6. EAFP — phong cách Python

Hai cách viết cùng một việc:

\`\`\`python
# LBYL — nhìn trước khi nhảy
if "k" in d:
    v = d["k"]

# EAFP — cứ làm, sai thì xin lỗi  (phong cách Python)
try:
    v = d["k"]
except KeyError:
    v = mac_dinh
\`\`\`

EAFP nhanh hơn khi lỗi hiếm khi xảy ra, và tránh được lỗi tranh chấp (thứ tồn tại lúc kiểm tra
nhưng biến mất lúc dùng — hay gặp với file). Nhưng với dict thì \`d.get(k, mac_dinh)\` vẫn gọn nhất.

## 7. \`finally\` và dọn dẹp

\`\`\`python
f = open("a.txt")
try:
    xu_ly(f)
finally:
    f.close()        # đóng dù có lỗi hay không
\`\`\`

Nhưng cách đúng là dùng \`with\` — nó tự lo phần \`finally\`:

\`\`\`python
with open("a.txt") as f:
    xu_ly(f)
\`\`\`

> ⚠️ \`return\` trong \`finally\` sẽ **nuốt mất** ngoại lệ đang bay ra. Đừng làm vậy.

## 8. Bảng: gặp lỗi này thì bắt loại nào

| Tình huống | Ngoại lệ |
|---|---|
| Mở file không tồn tại | \`FileNotFoundError\` |
| \`int("abc")\` | \`ValueError\` |
| \`d["thiếu"]\` | \`KeyError\` |
| \`ds[100]\` | \`IndexError\` |
| \`"a" + 1\` | \`TypeError\` |
| Chia cho 0 | \`ZeroDivisionError\` |
| Gọi API mạng thất bại | \`OSError\` / lỗi riêng của thư viện |
| Người dùng bấm Ctrl+C | \`KeyboardInterrupt\` (**không** kế thừa \`Exception\`) |
`,
},
/* ==================================================================== */
{
  id: 'hb-type-hints',
  part: 'D',
  title: 'Chú thích kiểu (type hints)',
  icon: '🏷️',
  minutes: 5,
  body: `
## 1. Cú pháp cơ bản

\`\`\`python
def chao(ten: str, so_lan: int = 1) -> str:
    return f"chào {ten}! " * so_lan

tuoi: int = 25
ten: str
diem: float = 9.5
\`\`\`

> ⚠️ Python **không kiểm tra** chú thích lúc chạy. \`chao(123)\` vẫn chạy bình thường.
> Chúng dành cho người đọc, cho trình soạn thảo (gợi ý code) và cho công cụ kiểm tra như mypy.

## 2. Kiểu cho dãy (Python 3.9+)

\`\`\`python
ds: list[int]
d: dict[str, int]
t: tuple[int, str]              # đúng 2 phần tử, đúng kiểu đó
t: tuple[int, ...]              # số lượng tuỳ ý, cùng kiểu
s: set[str]
\`\`\`

Trước 3.9 phải dùng \`from typing import List, Dict\` — code cũ bạn gặp sẽ viết \`List[int]\`.

## 3. Không bắt buộc, hoặc nhiều kiểu

\`\`\`python
from typing import Optional, Union

def tim(k: str) -> str | None:       # Python 3.10+ — dùng dấu |
    ...
def tim(k: str) -> Optional[str]:    # cách cũ, cùng nghĩa
    ...

so: int | float                      # một trong hai
so: Union[int, float]                # cách cũ
\`\`\`

\`Optional[X]\` chỉ là cách viết khác của \`X | None\` — **không** có nghĩa "tham số không bắt buộc".

## 4. Hàm và kiểu gọi được

\`\`\`python
from typing import Callable

def ap_dung(f: Callable[[int, int], int], a: int, b: int) -> int:
    return f(a, b)
#            ^^^^^^^^^^  ^^^
#            kiểu tham số  kiểu trả về
\`\`\`

Hàm không trả gì:

\`\`\`python
def ghi_log(msg: str) -> None: ...
\`\`\`

## 5. Kiểu chung chung & bí danh

\`\`\`python
Toado = tuple[int, int]              # đặt tên cho kiểu, đọc dễ hơn nhiều
def di(tu: Toado, den: Toado) -> list[Toado]: ...

from typing import TypeVar
T = TypeVar("T")
def dau_tien(ds: list[T]) -> T:      # trả về đúng kiểu của phần tử
    return ds[0]
\`\`\`

## 6. Chú thích trong lớp

\`\`\`python
from dataclasses import dataclass

@dataclass
class NguoiDung:
    ten: str
    tuoi: int = 0
    the_thich: list[str] = field(default_factory=list)
\`\`\`

Với \`@dataclass\`, chú thích kiểu **là bắt buộc** — nó dựa vào đó để sinh \`__init__\`.

## 7. Kiểm tra bằng mypy

\`\`\`bash
pip install mypy
mypy src/
\`\`\`

\`\`\`python
def cong(a: int, b: int) -> int:
    return a + b

cong("1", "2")     # mypy báo lỗi, dù Python vẫn chạy (ra "12")
\`\`\`

## 8. Nên chú thích tới đâu

Nguyên tắc thực dụng:
- **Luôn** chú thích cho hàm công khai của thư viện, và cho hàm mà kiểu không hiển nhiên
- **Bỏ qua** cho biến cục bộ mà nhìn là biết (\`i = 0\`)
- Dự án cũ thì thêm dần từ chỗ hay sinh lỗi nhất, không cần làm một lượt

Chú thích kiểu đắt giá nhất ở chỗ **biên giới** — nơi dữ liệu đi vào và đi ra khỏi module của bạn.
`,
},
];
