/**
 * PHẦN "CÚ PHÁP CẦN BIẾT TRƯỚC" — nhóm 3 (module 11–15).
 * Xem ghi chú ở đầu syntax1.js về nguyên tắc viết.
 */

export default {
/* ==================================================================== */
'py-typing': `
## A. Type hint là gì?

Type hint là **chú thích kiểu** — bạn ghi thêm "biến này dự kiến là kiểu gì" để người đọc và công cụ
hiểu ý bạn. Python **không kiểm tra** chúng lúc chạy: ghi sai kiểu, chương trình vẫn chạy bình thường.

\`\`\`python
tuoi: int = 20                   # cú pháp: <tên biến> : <kiểu> = <giá trị>
ten: str = "An"

tuoi = "hai mươi"                # KHÔNG lỗi! Python mặc kệ chú thích
\`\`\`

Đây là khác biệt lớn với TypeScript/Java. Muốn kiểm tra thật, phải chạy công cụ ngoài:

\`\`\`bash
pip install mypy
mypy main.py                     # mypy đọc chú thích và báo chỗ không khớp
\`\`\`

## B. Chú thích cho hàm

\`\`\`python
def cong(a: int, b: int) -> int:      # dấu -> chỉ KIỂU TRẢ VỀ, đặt trước dấu :
    return a + b

def in_ra(msg: str) -> None:          # None = hàm không trả về gì
    print(msg)
\`\`\`

Đọc từng ký hiệu:

| Ký hiệu | Nghĩa |
|---|---|
| \`a: int\` | tham số \`a\` dự kiến là số nguyên |
| \`-> int\` | hàm trả về số nguyên |
| \`-> None\` | hàm không trả về gì |
| \`x: int = 0\` | vừa chú thích kiểu vừa có giá trị mặc định |

## C. Kiểu của tập hợp — ghi rõ "chứa cái gì bên trong"

Từ Python 3.9 trở đi dùng thẳng tên kiểu dựng sẵn:

\`\`\`python
ds: list[int]                    # danh sách các số nguyên
bang: dict[str, int]             # dict: khoá chuỗi, giá trị số nguyên
cap: tuple[int, str]             # tuple đúng 2 phần tử: số rồi chuỗi
day: tuple[int, ...]             # tuple gồm số nguyên, dài bao nhiêu cũng được
tap: set[str]
\`\`\`

Code cũ (Python 3.8 trở xuống) viết bằng chữ hoa, phải import:

\`\`\`python
from typing import List, Dict
ds: List[int]                    # tương đương list[int], nay đã lỗi thời
\`\`\`

## D. Các ký hiệu kiểu hay gặp

\`\`\`python
from typing import Optional, Union, Any, Callable, Literal

x: Optional[int]        # int HOẶC None — dùng cho "có thể chưa có giá trị"
x: int | None           # cách viết mới (Python 3.10+), nghĩa y hệt, dấu sổ đứng = "hoặc"

y: Union[int, str]      # int hoặc str
y: int | str            # cách viết mới

z: Any                  # kiểu gì cũng được — tắt kiểm tra, dùng càng ít càng tốt

f: Callable[[int, int], str]     # một HÀM nhận (int, int) và trả về str
                                 # ngoặc vuông thứ nhất = danh sách tham số

mau: Literal["đỏ", "xanh"]       # chỉ được nhận đúng một trong các giá trị này
\`\`\`

Điểm hay nhầm: \`Optional[int]\` **không** có nghĩa "tham số không bắt buộc" — nó chỉ nói giá trị có
thể là \`None\`. Muốn không bắt buộc thì phải có giá trị mặc định:

\`\`\`python
def f(x: Optional[int] = None): ...      # vừa có thể là None, vừa không bắt buộc truyền
\`\`\`

## E. Kiểu cho dữ liệu có cấu trúc

\`\`\`python
from typing import TypedDict, Protocol
from dataclasses import dataclass

class NguoiDict(TypedDict):        # mô tả hình dạng của một dict
    ten: str
    tuoi: int

@dataclass                         # class thật, có kiểm tra thuộc tính khi chạy
class Nguoi:
    ten: str
    tuoi: int

class CoDienTich(Protocol):        # "duck typing có kiểu": bất cứ class nào có hàm này đều khớp
    def dien_tich(self) -> float: ...
\`\`\`

Ba dấu chấm \`...\` (gọi là \`Ellipsis\`) ở đây nghĩa là "thân hàm để trống" — dùng thay \`pass\` trong
phần khai báo kiểu.

## F. Kiểu tự tham chiếu và chuỗi trong chú thích

\`\`\`python
class Node:
    def con(self) -> "Node":       # đặt trong dấu nháy vì lúc này class Node CHƯA định nghĩa xong
        ...

from __future__ import annotations  # thêm dòng này ở đầu file thì khỏi cần dấu nháy
\`\`\`

## G. Xem chú thích lúc chạy

\`\`\`python
def cong(a: int, b: int) -> int: ...

cong.__annotations__       # {'a': <class 'int'>, 'b': <class 'int'>, 'return': <class 'int'>}
\`\`\`

Muốn **thực sự** kiểm tra kiểu khi chạy thì phải tự viết:

\`\`\`python
if not isinstance(x, int):
    raise TypeError("x phải là int")
\`\`\`

\`isinstance(x, int)\` là hàm kiểm tra kiểu lúc chạy; nhận cả tuple: \`isinstance(x, (int, float))\`.

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`x: int\` | chú thích kiểu cho biến |
| \`-> int\` | kiểu trả về của hàm |
| \`-> None\` | hàm không trả về gì |
| \`list[int]\`, \`dict[str, int]\` | tập hợp kèm kiểu phần tử |
| \`Optional[int]\` | có thể là \`None\` (bản mới viết \`int\` sổ đứng \`None\`) |
| \`Any\` | kiểu bất kỳ, tắt kiểm tra |
| \`Callable[[int], str]\` | một hàm nhận int, trả str |
| \`TypedDict\` / \`Protocol\` | hình dạng dict / giao diện dạng duck typing |
| \`...\` | thân khai báo để trống |
| \`isinstance(x, T)\` | kiểm tra kiểu **thật** lúc chạy |

## Lỗi người mới hay gặp

| Hiểu nhầm | Thực tế |
|---|---|
| "Ghi \`x: int\` là Python ép kiểu" | Không. Chú thích bị bỏ qua hoàn toàn lúc chạy |
| "\`Optional[int]\` nghĩa là tham số không bắt buộc" | Không. Phải thêm \`= None\` mới không bắt buộc |
| "Có type hint là hết bug kiểu" | Chỉ đúng khi bạn thực sự chạy \`mypy\` trong CI |
| Dùng \`Any\` khắp nơi | Vô hiệu hoá toàn bộ lợi ích, thà không ghi còn hơn |
| \`def f(x: int = "a")\` | mypy báo lỗi; Python vẫn chạy — bug âm thầm |
`,

/* ==================================================================== */
'py-stdlib': `
## A. Thư viện chuẩn là gì?

Là kho công cụ **cài sẵn cùng Python** — chỉ cần \`import\`, không cần \`pip install\`. Cú pháp nạp:

\`\`\`python
import collections                          # nạp cả module
from collections import Counter             # lấy riêng một thứ (cách hay dùng nhất)
from collections import Counter, defaultdict, deque
\`\`\`

## B. \`collections\` — bốn công cụ thay thế code thủ công

**\`Counter\` — đếm số lần xuất hiện**

\`\`\`python
from collections import Counter

c = Counter("abracadabra")
c                       # Counter({'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1})
c["a"]                  # 5
c["z"]                  # 0  — khoá không có thì trả 0, KHÔNG lỗi như dict thường
c.most_common(2)        # [('a', 5), ('b', 2)] — top 2 nhiều nhất
\`\`\`

**\`defaultdict\` — dict tự tạo giá trị mặc định**

\`\`\`python
from collections import defaultdict

d = defaultdict(list)          # tham số là HÀM tạo giá trị mặc định (list, int, set...)
d["x"].append(1)               # khoá "x" chưa có -> tự tạo list rỗng rồi append
                               # dict thường sẽ báo KeyError ở đây

dem = defaultdict(int)         # int() trả về 0
dem["a"] += 1                  # khỏi cần kiểm tra khoá tồn tại
\`\`\`

**\`deque\` — hàng đợi hai đầu** (đọc là "đếch", viết tắt của double-ended queue)

\`\`\`python
from collections import deque

q = deque([1, 2, 3])
q.append(4)         # thêm vào cuối
q.appendleft(0)     # thêm vào ĐẦU — nhanh, list làm việc này rất chậm
q.pop()             # lấy từ cuối
q.popleft()         # lấy từ ĐẦU — đây là lý do chính để dùng deque
q = deque(maxlen=3) # giới hạn độ dài: thêm vào đầy thì tự đẩy phần tử cũ ra
\`\`\`

**\`namedtuple\` — tuple có tên trường**

\`\`\`python
from collections import namedtuple
Diem = namedtuple("Diem", ["x", "y"])
p = Diem(1, 2)
p.x                 # 1 — truy cập bằng tên thay vì p[0]
\`\`\`

## C. \`itertools\` — công cụ lặp

\`\`\`python
from itertools import groupby, chain, combinations, permutations, product, count, cycle

list(chain([1,2], [3,4]))              # [1,2,3,4] — nối nhiều dãy thành một
list(combinations([1,2,3], 2))         # [(1,2), (1,3), (2,3)] — tổ hợp, không quan tâm thứ tự
list(permutations([1,2,3], 2))         # [(1,2),(2,1),(1,3),...] — hoán vị, có thứ tự
list(product([1,2], "ab"))             # [(1,'a'),(1,'b'),(2,'a'),(2,'b')] — tích Descartes

for khoa, nhom in groupby("aaabbc"):   # gom các phần tử GIỐNG NHAU LIỀN KỀ
    print(khoa, list(nhom))            # a ['a','a','a'] / b ['b','b'] / c ['c']
\`\`\`

> Bẫy \`groupby\`: chỉ gom các phần tử **liền kề**. Muốn gom toàn cục thì phải \`sorted()\` trước.

## D. \`functools\`

\`\`\`python
from functools import lru_cache, reduce, partial, wraps

@lru_cache(maxsize=None)         # nhớ kết quả đã tính, gọi lại với cùng tham số thì lấy ngay
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

reduce(lambda a, b: a + b, [1,2,3])     # 6 — gộp dần cả dãy thành một giá trị

cong10 = partial(lambda a, b: a + b, 10)   # "khoá cứng" tham số đầu = 10
cong10(5)                                   # 15
\`\`\`

## E. \`heapq\` và \`bisect\` — hai module thao tác trên list

\`\`\`python
import heapq

h = [3, 1, 2]
heapq.heapify(h)         # biến list thành heap (đống) TẠI CHỖ
heapq.heappush(h, 0)     # thêm
heapq.heappop(h)         # lấy ra phần tử NHỎ NHẤT — luôn là min-heap
heapq.nsmallest(2, h)    # 2 phần tử nhỏ nhất
\`\`\`

Python chỉ có min-heap. Muốn max-heap thì đẩy số âm vào: \`heappush(h, -x)\`.

\`\`\`python
import bisect

ds = [1, 3, 5, 7]
bisect.bisect_left(ds, 4)      # 2 — vị trí NÊN chèn 4 để list vẫn được sắp xếp
bisect.insort(ds, 4)           # chèn luôn vào đúng chỗ -> [1,3,4,5,7]
\`\`\`

Điều kiện bắt buộc: list phải **đã được sắp xếp** từ trước.

## F. \`datetime\` — ngày giờ

\`\`\`python
from datetime import datetime, date, timedelta

datetime.now()                          # thời điểm hiện tại
date(2026, 8, 11)                       # một ngày cụ thể

d = datetime.now() + timedelta(days=7)  # timedelta = KHOẢNG thời gian, cộng trừ được
(date(2026,8,11) - date(2026,8,1)).days # 10 — trừ hai ngày ra timedelta

d.strftime("%d/%m/%Y")                  # datetime -> chuỗi ("format")
datetime.strptime("11/08/2026", "%d/%m/%Y")   # chuỗi -> datetime ("parse")
\`\`\`

Mẹo nhớ: \`strftime\` = **f**ormat (ra chuỗi), \`strptime\` = **p**arse (vào từ chuỗi).

Mã định dạng hay dùng: \`%Y\` năm 4 số, \`%m\` tháng, \`%d\` ngày, \`%H\` giờ, \`%M\` phút, \`%S\` giây.

## G. Vài module khác gặp hàng ngày

\`\`\`python
import os, sys, random, math, json, re

os.getenv("API_KEY", "mặc_định")     # đọc biến môi trường
os.path.join("a", "b")               # nối đường dẫn (hoặc dùng pathlib như module 8)
sys.argv                             # danh sách tham số dòng lệnh
random.randint(1, 6)                 # số nguyên ngẫu nhiên, bao gồm cả 1 và 6
random.choice(ds)                    # chọn ngẫu nhiên một phần tử
math.sqrt(16), math.ceil(1.2), math.floor(1.8), math.inf
\`\`\`

---

## Bảng tra nhanh ký hiệu module này

| Công cụ | Dùng khi |
|---|---|
| \`Counter\` | đếm tần suất |
| \`defaultdict(list)\` | gom nhóm mà không cần kiểm tra khoá |
| \`deque\` | thêm/lấy ở **đầu** danh sách nhiều lần |
| \`namedtuple\` | tuple có tên trường |
| \`itertools.chain / combinations / groupby\` | nối dãy / tổ hợp / gom nhóm liền kề |
| \`functools.lru_cache\` | ghi nhớ kết quả hàm |
| \`heapq\` | lấy phần tử nhỏ nhất liên tục |
| \`bisect\` | tìm/chèn vào list đã sắp xếp |
| \`datetime\` + \`timedelta\` | thời điểm + khoảng thời gian |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| \`groupby\` mà chưa sắp xếp | chỉ gom nhóm liền kề, kết quả sai | \`groupby(sorted(ds), key=...)\` |
| Dùng \`ds.pop(0)\` nhiều lần | list dịch chuyển toàn bộ, rất chậm | \`deque.popleft()\` |
| \`heapq\` mong lấy max | Python chỉ có min-heap | đẩy giá trị âm vào |
| \`bisect\` trên list chưa sắp xếp | kết quả vô nghĩa | sắp xếp trước |
| \`@lru_cache\` cho hàm nhận list | list không hashable -> \`TypeError\` | chuyển sang \`tuple\` |
| \`strftime\` / \`strptime\` dùng lẫn | ngược chiều nhau | f = ra chuỗi, p = vào từ chuỗi |
`,

/* ==================================================================== */
'py-testing': `
## A. Test là gì và trông ra sao?

Một test là **một hàm bình thường** kiểm tra rằng code của bạn cho ra kết quả đúng.
Với \`pytest\`, quy ước đặt tên là bắt buộc:

\`\`\`python
# file: test_toan.py            <- tên FILE phải bắt đầu bằng test_ (hoặc kết thúc _test.py)

def cong(a, b):
    return a + b

def test_cong():                # tên HÀM phải bắt đầu bằng test_
    assert cong(1, 2) == 3      # dùng assert thuần, không cần assertEqual gì cả
\`\`\`

Chạy:

\`\`\`bash
pip install pytest
pytest                    # tự tìm mọi file test_*.py trong thư mục
pytest -v                 # hiện tên từng test
pytest test_toan.py::test_cong    # chạy đúng một test
pytest -k "cong"          # chạy các test có tên chứa "cong"
pytest -x                 # dừng ngay khi có test đầu tiên hỏng
\`\`\`

Đọc kết quả: dấu \`.\` là một test đạt, \`F\` là hỏng (Failed), \`E\` là lỗi khi chuẩn bị, \`s\` là bỏ qua.

## B. \`assert\` — câu lệnh duy nhất bạn cần

\`\`\`python
assert x == 5                          # sai -> AssertionError, test hỏng
assert x == 5, f"x đang là {x}"        # kèm thông điệp giải thích
assert "a" in danh_sach
assert not ket_qua
\`\`\`

pytest "viết lại" \`assert\` để khi hỏng nó in ra giá trị thực tế của từng vế — nên bạn **không cần**
các hàm \`assertEqual\`, \`assertTrue\`… như \`unittest\`.

## C. Kiểm tra rằng code PHẢI ném lỗi

\`\`\`python
import pytest

def test_chia_khong():
    with pytest.raises(ZeroDivisionError):     # khối này BẮT BUỘC phải ném đúng lỗi đó
        1 / 0

def test_thong_diep():
    with pytest.raises(ValueError, match="phải dương"):    # match nhận REGEX
        rut(-5)
\`\`\`

Nếu khối bên trong **không** ném lỗi, test sẽ hỏng — đó chính là điều bạn muốn khẳng định.

## D. So sánh số thực: \`pytest.approx\`

\`\`\`python
0.1 + 0.2 == 0.3                    # False! Số thực máy tính luôn có sai số nhỏ
0.1 + 0.2 == pytest.approx(0.3)     # True — so sánh có dung sai
assert ds == pytest.approx([0.1, 0.2])   # dùng được cho cả list và dict
\`\`\`

## E. \`@pytest.mark.parametrize\` — một test, nhiều bộ dữ liệu

\`\`\`python
import pytest

@pytest.mark.parametrize("a, b, mong_doi", [      # (1) chuỗi tên tham số  (2) list các bộ giá trị
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_cong(a, b, mong_doi):                    # tên tham số phải TRÙNG với chuỗi ở trên
    assert cong(a, b) == mong_doi
\`\`\`

pytest sẽ chạy hàm này 3 lần, báo cáo thành 3 test riêng biệt — hỏng cái nào biết ngay cái đó.

Các nhãn \`@pytest.mark\` khác:

\`\`\`python
@pytest.mark.skip(reason="chưa làm xong")           # bỏ qua
@pytest.mark.skipif(sys.platform == "win32", reason="chỉ chạy Linux")
@pytest.mark.xfail                                   # biết trước là hỏng, đừng báo đỏ
\`\`\`

## F. Fixture — chuẩn bị dữ liệu dùng chung

\`\`\`python
import pytest

@pytest.fixture                       # đánh dấu đây là "vật tư" cho test
def nguoi_dung():
    return {"ten": "An", "tuoi": 20}

def test_ten(nguoi_dung):             # chỉ cần ĐẶT TÊN THAM SỐ trùng tên fixture
    assert nguoi_dung["ten"] == "An"  # pytest tự gọi fixture và truyền kết quả vào
\`\`\`

Fixture có phần dọn dẹp — dùng \`yield\` y như \`@contextmanager\`:

\`\`\`python
@pytest.fixture
def ket_noi():
    conn = mo_ket_noi()               # phần setup
    yield conn                        # trao cho test
    conn.close()                      # phần dọn dẹp, chạy sau khi test xong
\`\`\`

Fixture dùng chung cho nhiều file thì đặt trong file tên \`conftest.py\` — pytest tự tìm, không cần import.

Fixture dựng sẵn hay dùng: \`tmp_path\` (thư mục tạm), \`capsys\` (bắt nội dung \`print\`),
\`monkeypatch\` (thay thế tạm một hàm/biến).

## G. Bố cục một test tốt: Arrange – Act – Assert

\`\`\`python
def test_rut_tien():
    vi = Vi(100)                  # Arrange: chuẩn bị
    vi.rut(30)                    # Act:     thực hiện đúng MỘT hành động
    assert vi.so_du == 70         # Assert:  kiểm tra kết quả
\`\`\`

Một test kiểm tra **một chuyện**. Tên test nên mô tả điều được khẳng định:
\`test_rut_qua_so_du_thi_bao_loi\` tốt hơn \`test_2\`.

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`test_*.py\` / \`def test_*\` | quy ước tên để pytest tìm thấy |
| \`assert đk, "msg"\` | khẳng định điều kiện đúng |
| \`pytest.raises(X)\` | khẳng định code ném lỗi \`X\` |
| \`pytest.approx(x)\` | so sánh số thực có dung sai |
| \`@pytest.mark.parametrize\` | chạy một test với nhiều bộ dữ liệu |
| \`@pytest.fixture\` | tạo dữ liệu/tài nguyên dùng chung |
| \`yield\` trong fixture | ranh giới setup / dọn dẹp |
| \`conftest.py\` | nơi đặt fixture dùng chung |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | pytest không chạy / sai vì |
|---|---|---|
| File tên \`kiem_tra.py\` | không khớp quy ước | đổi thành \`test_kiem_tra.py\` |
| \`def kiem_tra_cong()\` | hàm không bắt đầu bằng \`test_\` | đổi tên hàm |
| \`assert 0.1 + 0.2 == 0.3\` | sai số số thực | \`pytest.approx(0.3)\` |
| Test phụ thuộc thứ tự chạy | test phải độc lập | mỗi test tự chuẩn bị dữ liệu riêng |
| Một test có 10 \`assert\` khác chủ đề | hỏng cái đầu là không biết phần sau | tách thành nhiều test |
| Quên \`with pytest.raises(...)\` | lỗi ném ra làm test hỏng | bọc trong \`pytest.raises\` |
`,

/* ==================================================================== */
'py-advanced-oop': `
## A. Nhắc lại: decorator trên phương thức

Module này dùng rất nhiều dòng bắt đầu bằng \`@\`. Nhớ lại: \`@x\` đặt ngay trên \`def\` nghĩa là
"lấy hàm bên dưới, đưa qua \`x\`, rồi thay thế bằng kết quả". Bốn nhãn sẽ gặp:
\`@property\`, \`@<tên>.setter\`, \`@abstractmethod\`, \`@classmethod\`.

## B. \`@property\` — biến phương thức thành thuộc tính

Vấn đề: bạn muốn kiểm tra giá trị khi có người gán, nhưng không muốn bắt cả code cũ đổi từ
\`n.tuoi\` sang \`n.get_tuoi()\`.

\`\`\`python
class Nguoi:
    def __init__(self, tuoi):
        self.tuoi = tuoi              # dòng này chạy qua SETTER bên dưới, nên vẫn được kiểm tra

    @property
    def tuoi(self):                   # GETTER — chạy khi ĐỌC n.tuoi
        return self._tuoi

    @tuoi.setter                      # tên nhãn = <tên property>.setter
    def tuoi(self, gia_tri):          # SETTER — chạy khi GÁN n.tuoi = ...
        if gia_tri < 0:
            raise ValueError("Tuổi không âm")
        self._tuoi = gia_tri          # lưu vào biến _tuoi (có gạch dưới) để KHÔNG gọi lại chính mình

n = Nguoi(20)
n.tuoi          # 20   — trông như thuộc tính thường, thực ra đang gọi hàm getter
n.tuoi = -5     # ValueError!
\`\`\`

Ba điều bắt buộc nhớ:

1. Getter và setter phải **cùng tên**.
2. Nơi lưu thật phải là tên **khác** (quy ước: thêm gạch dưới, \`self._tuoi\`). Viết \`self.tuoi = ...\`
   bên trong setter sẽ gọi lại chính setter → **đệ quy vô tận**, lỗi \`RecursionError\`.
3. Chỉ viết \`@property\` mà không viết setter → thuộc tính **chỉ đọc**, gán vào sẽ báo
   \`AttributeError: can't set attribute\`.

## C. \`__slots__\` — cố định danh sách thuộc tính

Mặc định mỗi object Python mang theo một dict \`__dict__\` để chứa thuộc tính, nên bạn gắn thêm
thuộc tính nào cũng được — kể cả do gõ sai tên.

\`\`\`python
class Diem:
    __slots__ = ("x", "y")          # chỉ cho phép đúng hai thuộc tính này

    def __init__(self, x, y):
        self.x, self.y = x, y

d = Diem(1, 2)
d.z = 3          # AttributeError — bắt được lỗi gõ sai tên ngay lập tức
\`\`\`

Lợi ích kèm theo: tiết kiệm bộ nhớ đáng kể khi tạo hàng triệu object. Đánh đổi: không gắn thêm được
thuộc tính động, và kế thừa phức tạp hơn.

## D. Lớp trừu tượng \`ABC\` — bắt buộc lớp con phải cài đặt

\`\`\`python
from abc import ABC, abstractmethod

class PhuongThucThanhToan(ABC):            # kế thừa ABC = "đây là lớp trừu tượng"
    @abstractmethod                        # nhãn: lớp con BẮT BUỘC phải viết hàm này
    def thanh_toan(self, so_tien): ...

class TheTinDung(PhuongThucThanhToan):
    def thanh_toan(self, so_tien):
        return f"Trả {so_tien} bằng thẻ"

PhuongThucThanhToan()      # TypeError — không tạo object từ lớp trừu tượng được
TheTinDung()               # OK
\`\`\`

Khác với type hint (chỉ là tài liệu), \`ABC\` **kiểm tra thật lúc chạy**: quên cài đặt một
\`@abstractmethod\` là không tạo được object.

## E. Nạp chồng toán tử — cho object dùng được \`+\`, \`<\`, \`==\`

\`\`\`python
class Tien:
    def __init__(self, so):
        self.so = so

    def __add__(self, khac):          # định nghĩa dấu +
        return Tien(self.so + khac.so)

    def __eq__(self, khac):           # dấu ==
        return self.so == khac.so

    def __lt__(self, khac):           # dấu <  (có __lt__ là sorted() dùng được luôn)
        return self.so < khac.so

    def __repr__(self):
        return f"Tien({self.so})"

Tien(10) + Tien(5)        # Tien(15)
sorted([Tien(3), Tien(1)])# [Tien(1), Tien(3)]
\`\`\`

Bảng dunder theo toán tử:

| Toán tử | Dunder |
|---|---|
| \`+\` \`-\` \`*\` \`/\` | \`__add__\` \`__sub__\` \`__mul__\` \`__truediv__\` |
| \`==\` \`!=\` | \`__eq__\` \`__ne__\` |
| \`<\` \`<=\` \`>\` \`>=\` | \`__lt__\` \`__le__\` \`__gt__\` \`__ge__\` |
| \`len(obj)\` | \`__len__\` |
| \`obj[i]\` | \`__getitem__\` |
| \`x in obj\` | \`__contains__\` |
| \`obj()\` | \`__call__\` |
| \`with obj:\` | \`__enter__\` / \`__exit__\` |

Lưu ý: viết \`__eq__\` thì object **mất khả năng hashable** (không làm khoá dict / phần tử set được)
trừ khi viết thêm \`__hash__\`.

## F. \`__call__\` — cho object gọi được như hàm

\`\`\`python
class BoCong:
    def __init__(self, n):
        self.n = n
    def __call__(self, x):        # cho phép viết obj(...)
        return x + self.n

cong5 = BoCong(5)
cong5(10)                         # 15 — trông như hàm, thực chất là object có trạng thái
\`\`\`

## G. \`@classmethod\` làm factory và bẫy kế thừa

\`\`\`python
class Nguoi:
    def __init__(self, ten):
        self.ten = ten

    @classmethod
    def tu_chuoi(cls, s):          # cls = CHÍNH LỚP đang gọi, không phải object
        return cls(s.strip())      # dùng cls(...) chứ KHÔNG viết cứng Nguoi(...)

class NhanVien(Nguoi): ...

NhanVien.tu_chuoi(" An ")          # trả về NhanVien — nhờ dùng cls
\`\`\`

Đó là bẫy kinh điển: viết \`return Nguoi(...)\` thì lớp con gọi vào sẽ nhận về object **lớp cha**,
mất hết phần mở rộng.

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`@property\` | getter — đọc thuộc tính thì chạy hàm |
| \`@ten.setter\` | setter — gán thuộc tính thì chạy hàm |
| \`self._x\` | nơi lưu thật phía sau property |
| \`__slots__ = (...)\` | cố định danh sách thuộc tính cho phép |
| \`ABC\` + \`@abstractmethod\` | lớp trừu tượng, bắt buộc lớp con cài đặt |
| \`__add__\`, \`__lt__\`, \`__eq__\` | nạp chồng toán tử |
| \`__call__\` | cho object gọi được như hàm |
| \`cls\` trong \`@classmethod\` | chính lớp đang gọi |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| \`self.tuoi = x\` bên trong setter \`tuoi\` | đệ quy vô tận, \`RecursionError\` | \`self._tuoi = x\` |
| Getter và setter khác tên | setter không được gắn vào property | đặt cùng tên |
| \`@property\` mà không có setter, rồi gán | \`AttributeError\` | thêm \`@ten.setter\` |
| \`__slots__\` rồi gán thuộc tính lạ | \`AttributeError\` | thêm tên vào \`__slots__\` |
| Viết \`__eq__\` mà quên \`__hash__\` | object không dùng làm khoá dict được | thêm \`__hash__\` hoặc dùng \`@dataclass(frozen=True)\` |
| \`return Nguoi(...)\` trong classmethod | lớp con nhận sai kiểu | \`return cls(...)\` |
`,

/* ==================================================================== */
'py-concurrency-performance': `
## A. Ba từ cần phân biệt trước khi đọc bài giảng

| Từ | Nghĩa | Ví dụ đời thường |
|---|---|---|
| **Tuần tự** (sequential) | làm xong việc này mới sang việc khác | một người rửa từng cái bát |
| **Đồng thời** (concurrency) | xen kẽ nhiều việc, lúc việc này chờ thì làm việc kia | một người vừa chờ nước sôi vừa thái rau |
| **Song song** (parallelism) | nhiều việc chạy **thật sự cùng lúc** trên nhiều CPU | hai người cùng rửa bát |

Và hai loại công việc:

- **I/O-bound** — phần lớn thời gian là **chờ** (chờ mạng, chờ đĩa, chờ database).
- **CPU-bound** — phần lớn thời gian là **tính** (xử lý ảnh, nén dữ liệu, tính toán số học).

Chọn công cụ hoàn toàn dựa trên hai loại này:

| Loại việc | Dùng | Lý do |
|---|---|---|
| I/O-bound, ít việc | \`threading\` / \`ThreadPoolExecutor\` | lúc chờ thì nhả CPU cho luồng khác |
| I/O-bound, rất nhiều việc | \`asyncio\` | nhẹ hơn thread rất nhiều |
| CPU-bound | \`multiprocessing\` / \`ProcessPoolExecutor\` | phải dùng nhiều tiến trình mới thoát được GIL |

**GIL** (Global Interpreter Lock) là khoá toàn cục khiến **chỉ một luồng chạy mã Python tại một thời
điểm**. Hệ quả: thêm thread **không** làm code tính toán nhanh hơn — đây là hiểu lầm phổ biến nhất.

## B. \`threading\` — cú pháp cơ bản

\`\`\`python
import threading

def tai(url):
    print("tải", url)

t = threading.Thread(target=tai, args=("a.com",))   # target = HÀM (không có ngoặc!)
t.start()                                            # bắt đầu chạy song song
t.join()                                             # CHỜ luồng này xong mới đi tiếp
\`\`\`

Chú ý \`args=("a.com",)\` — phải là **tuple**, dấu phẩy cuối là bắt buộc khi chỉ có một tham số.

Khoá để tránh tranh chấp dữ liệu:

\`\`\`python
lock = threading.Lock()

with lock:              # chỉ một luồng vào được khối này tại một thời điểm
    dem += 1
\`\`\`

## C. \`concurrent.futures\` — cách viết được khuyến nghị

Gần như luôn nên dùng cái này thay vì tự quản lý \`Thread\`:

\`\`\`python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=5) as ex:        # dùng with để tự dọn dẹp
    ket_qua = list(ex.map(tai, danh_sach_url))       # map: giữ nguyên THỨ TỰ đầu vào

with ThreadPoolExecutor() as ex:
    futures = [ex.submit(tai, u) for u in danh_sach_url]   # submit: gửi từng việc
    for f in as_completed(futures):                        # lấy theo thứ tự XONG TRƯỚC
        print(f.result())                                  # .result() trả kết quả, ném lại lỗi nếu có
\`\`\`

Đổi \`ThreadPoolExecutor\` thành \`ProcessPoolExecutor\` là chuyển sang chạy đa tiến trình — cùng một
cú pháp, dùng cho việc CPU-bound.

## D. \`asyncio\` — cú pháp \`async\` / \`await\`

\`\`\`python
import asyncio

async def tai(url):                  # async def = định nghĩa "coroutine", không phải hàm thường
    await asyncio.sleep(1)           # await = "chỗ này chờ, nhường CPU cho việc khác"
    return f"xong {url}"

async def main():
    ket_qua = await asyncio.gather(  # gather: chạy nhiều coroutine cùng lúc, chờ tất cả
        tai("a"), tai("b"), tai("c")
    )
    print(ket_qua)

asyncio.run(main())                  # điểm khởi động — gọi MỘT lần ở ngoài cùng
\`\`\`

Ba quy tắc cứng của \`async\`:

1. \`await\` **chỉ** viết được bên trong \`async def\`. Viết ở ngoài → \`SyntaxError\`.
2. Gọi \`tai("a")\` mà không \`await\` thì **không chạy gì cả**, chỉ tạo ra một coroutine object
   (và Python cảnh báo "coroutine was never awaited").
3. Gọi một hàm chặn (blocking) như \`time.sleep(1)\` bên trong \`async\` sẽ **đứng toàn bộ** chương
   trình. Phải dùng phiên bản async: \`await asyncio.sleep(1)\`.

## E. \`multiprocessing\`

\`\`\`python
from multiprocessing import Pool

if __name__ == "__main__":        # BẮT BUỘC trên Windows, nếu không sẽ đệ quy tạo tiến trình vô tận
    with Pool(4) as p:
        print(p.map(tinh_nang, du_lieu))
\`\`\`

Tiến trình **không dùng chung bộ nhớ** — dữ liệu phải "đóng gói" (pickle) để gửi qua lại, nên có chi
phí. Với việc nhỏ, đa tiến trình còn **chậm hơn** chạy tuần tự.

## F. Đo hiệu năng — đo trước khi tối ưu

\`\`\`python
import time
t0 = time.perf_counter()          # perf_counter chính xác hơn time.time() cho việc đo
lam_viec()
print(f"{time.perf_counter() - t0:.3f}s")

import timeit
timeit.timeit("sum(range(100))", number=10000)     # chạy lặp nhiều lần, lấy số ổn định

# Tìm hàm nào tốn thời gian nhất:
# python -m cProfile -s cumtime main.py
\`\`\`

## G. Vài phản xạ tối ưu cơ bản

\`\`\`python
"".join(cac_phan)                 # nối chuỗi trong vòng lặp bằng += là O(n²), join là O(n)

if x in tap_hop:                  # set/dict tra cứu O(1)
if x in danh_sach:                # list phải quét hết, O(n) — đổi sang set nếu tra nhiều lần

tong = sum(x * x for x in ds)     # generator: không tạo list trung gian, tiết kiệm RAM

# Dùng hàm dựng sẵn (viết bằng C) thay vì tự viết vòng lặp: sum, min, max, sorted, any, all
\`\`\`

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`Thread(target=f, args=(x,))\` | tạo luồng; \`args\` phải là tuple |
| \`.start()\` / \`.join()\` | chạy / chờ xong |
| \`with lock:\` | vùng chỉ một luồng vào được |
| \`ThreadPoolExecutor\` | hồ luồng cho việc I/O-bound |
| \`ProcessPoolExecutor\` | hồ tiến trình cho việc CPU-bound |
| \`ex.map\` / \`ex.submit\` | chạy theo thứ tự / gửi từng việc |
| \`async def\` / \`await\` | định nghĩa coroutine / điểm nhường CPU |
| \`asyncio.gather\` | chạy nhiều coroutine cùng lúc |
| \`asyncio.run\` | điểm khởi động, gọi một lần |
| \`time.perf_counter\` | đồng hồ đo hiệu năng |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| Dùng thread để tính toán nặng | GIL chặn, không nhanh hơn | \`ProcessPoolExecutor\` |
| \`Thread(target=f())\` | đã gọi hàm mất rồi | \`Thread(target=f)\` |
| \`args=("a")\` | đó là chuỗi, không phải tuple | \`args=("a",)\` |
| \`await\` ngoài \`async def\` | \`SyntaxError\` | bọc trong \`async def\` + \`asyncio.run\` |
| Gọi coroutine mà quên \`await\` | không chạy, chỉ cảnh báo | thêm \`await\` |
| \`time.sleep\` trong hàm async | chặn toàn bộ event loop | \`await asyncio.sleep\` |
| \`multiprocessing\` không có \`if __name__\` | đệ quy tạo tiến trình trên Windows | thêm dòng bảo vệ |
| Tối ưu trước khi đo | tốn công vào chỗ không phải nút thắt | đo bằng \`cProfile\` trước |
`,
};
