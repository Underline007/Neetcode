/**
 * CẨM NANG CÚ PHÁP PYTHON — PHẦN C: LUỒNG & HÀM
 * Điều kiện & vòng lặp · comprehension · hàm · iterator/generator · decorator.
 */
export default [
/* ==================================================================== */
{
  id: 'hb-dieu-kien-lap',
  part: 'C',
  title: 'Điều kiện & vòng lặp',
  icon: '🔁',
  minutes: 6,
  body: `
## 1. Thụt lề là cú pháp, không phải thẩm mỹ

\`\`\`python
if diem >= 8:
    print("Giỏi")        # 4 dấu cách — chuẩn PEP 8
elif diem >= 5:
    print("Đạt")
else:
    print("Chưa đạt")
\`\`\`

Không có \`{ }\`. Trộn tab với dấu cách là lỗi \`TabError\`. Dùng **4 dấu cách**, luôn luôn.

Khối chưa viết xong thì đặt \`pass\` cho hợp lệ:

\`\`\`python
if dieu_kien:
    pass      # TODO: viết sau
\`\`\`

## 2. Toán tử ba ngôi — đảo thứ tự so với JS

\`\`\`python
trang_thai = "Đạt" if diem >= 5 else "Trượt"
\`\`\`

Lồng nhau được nhưng khó đọc — quá hai tầng thì viết \`if/elif\` cho rõ.

## 3. Vòng lặp for luôn duyệt trên "một dãy"

\`\`\`python
for x in [1, 2, 3]: ...          # theo giá trị — cách Pythonic nhất
for i in range(5): ...           # 0,1,2,3,4
for i in range(2, 10, 3): ...    # 2,5,8
for i in range(5, 0, -1): ...    # 5,4,3,2,1 — đếm ngược
for i, x in enumerate(ds): ...   # vừa chỉ số vừa giá trị
for k, v in d.items(): ...       # duyệt dict — THIẾU .items() là lỗi
for a, b in zip(ds1, ds2): ...   # ghép cặp, dừng ở dãy ngắn hơn
for c in "chuỗi": ...            # từng ký tự
\`\`\`

> Không có \`for (let i = 0; i < n; i++)\`. Muốn chỉ số thì dùng \`range()\` hoặc \`enumerate()\`.

Vài công cụ duyệt hay dùng:

\`\`\`python
for x in reversed(ds): ...              # ngược, không tạo bản sao
for x in sorted(ds, key=len): ...       # duyệt theo thứ tự khác
for a, b in zip(ds, ds[1:]): ...        # từng cặp liền kề
from itertools import product
for i, j in product(range(3), range(3)): ...   # thay 2 vòng lồng nhau
\`\`\`

## 4. \`zip\` cắt theo dãy NGẮN NHẤT

\`\`\`python
list(zip([1,2,3], "ab"))       # [(1,'a'), (2,'b')] — mất phần tử 3
\`\`\`

Muốn báo lỗi khi lệch độ dài (Python 3.10+):

\`\`\`python
list(zip(a, b, strict=True))   # ValueError nếu khác độ dài
\`\`\`

Tách ngược lại:

\`\`\`python
cap = [(1,'a'), (2,'b')]
so, chu = zip(*cap)            # (1, 2) và ('a', 'b')
\`\`\`

## 5. while và các lệnh điều khiển

\`\`\`python
while dieu_kien:
    ...
    if xong: break        # thoát hẳn
    if bo_qua: continue   # sang lượt kế
\`\`\`

\`while True\` + \`break\` là mẫu hợp lệ và thường rõ ràng hơn điều kiện phức tạp:

\`\`\`python
while True:
    dong = f.readline()
    if not dong:
        break
    xu_ly(dong)
\`\`\`

> ⚠️ Nguyên nhân số một của vòng lặp vô hạn: **biến điều kiện không đổi trong thân vòng lặp.**
> Trước khi chạy, hãy chỉ tay vào dòng làm điều kiện tiến gần tới chỗ dừng.

## 6. \`else\` của vòng lặp — cú pháp riêng của Python

Khối \`else\` chạy khi vòng lặp kết thúc **mà không gặp \`break\`**:

\`\`\`python
for x in ds:
    if x == can_tim:
        print("Thấy rồi")
        break
else:
    print("Không có trong danh sách")   # chỉ chạy khi KHÔNG break
\`\`\`

Rất gọn cho các bài "tìm kiếm, không thấy thì báo". Đọc là *"for ... else = chạy hết mà không tìm thấy"*.

## 7. Vòng lặp lồng nhau & thoát nhiều tầng

Python **không có** \`break\` nhiều tầng. Ba cách xử lý:

\`\`\`python
# (a) dùng cờ
xong = False
for i in ...:
    for j in ...:
        if dk: xong = True; break
    if xong: break

# (b) bọc trong hàm rồi return — gọn nhất
def tim():
    for i in ...:
        for j in ...:
            if dk: return (i, j)
    return None

# (c) gộp hai vòng thành một
from itertools import product
for i, j in product(range(m), range(n)):
    if dk: break
\`\`\`

## 8. \`match\` — có từ Python 3.10

\`\`\`python
match lenh:
    case "them" | "add":            # nhiều giá trị
        ...
    case ("xoa", ten):              # tách cấu trúc luôn
        ...
    case {"loai": "user", "id": i}: # khớp dict
        ...
    case [x, y, *con_lai]:          # khớp list
        ...
    case n if n > 100:              # có điều kiện phụ
        ...
    case _:                         # mặc định
        ...
\`\`\`

Đây **không phải** \`switch\` đơn thuần — nó khớp theo *cấu trúc*. Với các trường hợp đơn giản,
một dict tra cứu thường gọn hơn:

\`\`\`python
xu_ly = {"them": ham_them, "xoa": ham_xoa}
xu_ly.get(lenh, ham_mac_dinh)()
\`\`\`
`,
},
/* ==================================================================== */
{
  id: 'hb-comprehension',
  part: 'C',
  title: 'Comprehension',
  icon: '🎯',
  minutes: 5,
  body: `
Comprehension là "chữ ký" của Python. Nhìn vào là biết người viết có quen Python hay không.

## 1. Công thức

\`\`\`python
[ biểu_thức  for phần_tử in dãy  if điều_kiện ]
\`\`\`

Đọc từ trái sang phải như một câu: *"lấy \`biểu_thức\`, với mỗi \`phần_tử\` trong \`dãy\`, nếu \`điều_kiện\`"*.

## 2. Thay cho vòng lặp gom kết quả

\`\`\`python
# thay vì
kq = []
for x in ds:
    if x > 0:
        kq.append(x * 2)

# viết
kq = [x * 2 for x in ds if x > 0]
\`\`\`

Quy tắc nhận biết: vòng lặp mà thân **chỉ có \`append\`** thì gần như luôn viết lại được thành comprehension.

## 3. Bốn loại

\`\`\`python
[x*2 for x in ds]                    # list
{x for x in ds}                      # set — khử trùng luôn
{k: v for k, v in cap}               # dict
(x*2 for x in ds)                    # generator — LƯỜI, không tạo list trong bộ nhớ
\`\`\`

Generator dùng khi dãy rất lớn hoặc chỉ duyệt một lần:

\`\`\`python
tong = sum(x*2 for x in range(10_000_000))   # không tốn bộ nhớ
any(x < 0 for x in ds)                       # dừng ngay khi gặp phần tử âm đầu tiên
\`\`\`

> Truyền generator vào một hàm thì bỏ được ngoặc: \`sum(x for x in ds)\`.

## 4. If/else phải đặt TRƯỚC for

Đây là chỗ hay sai nhất:

\`\`\`python
[x if x > 0 else 0 for x in ds]    # ✅ có else → đặt trước for (là toán tử ba ngôi)
[x for x in ds if x > 0]           # ✅ chỉ lọc → đặt sau for
[x if x > 0 for x in ds]           # ❌ SyntaxError
\`\`\`

Lý do: phần trước \`for\` là **biểu thức tạo giá trị**; phần sau \`for\` là **bộ lọc**.

## 5. Lồng nhau — thứ tự như vòng lặp thường

\`\`\`python
[(i, j) for i in range(2) for j in range(2)]
# đọc như:  for i in range(2):
#               for j in range(2):

# làm phẳng ma trận
[x for hang in ma_tran for x in hang]

# tạo ma trận (comprehension bên TRONG dấu ngoặc)
[[0] * m for _ in range(n)]
\`\`\`

Mẹo nhớ: viết các \`for\` theo **đúng thứ tự** bạn sẽ viết trong vòng lặp thường.

## 6. Nhiều điều kiện & vòng lặp phụ thuộc

\`\`\`python
[x for x in ds if x > 0 if x % 2 == 0]        # hai bộ lọc (tương đương and)
[x for hang in ma_tran if hang for x in hang] # bỏ qua hàng rỗng
[(i, j) for i in range(3) for j in range(i)]  # j phụ thuộc i
\`\`\`

## 7. Biến trong comprehension không rò ra ngoài

\`\`\`python
x = 10
ds = [x for x in range(3)]
print(x)      # 10 — vẫn nguyên, khác với Python 2
\`\`\`

## 8. Toán tử hải mã trong comprehension

\`\`\`python
[y for x in ds if (y := tinh(x)) > 0]     # gọi tinh() MỘT lần thay vì hai
\`\`\`

## 9. Khi nào KHÔNG nên dùng

- Khi nó dài quá một dòng dễ đọc
- Khi lồng quá hai tầng
- Khi thân vòng lặp có tác dụng phụ (in ra, ghi file) — lúc đó dùng vòng lặp thường

Mục tiêu là *dễ đọc*, không phải *ngắn nhất*. Một comprehension phải hiểu được trong một lần đọc.
`,
},
/* ==================================================================== */
{
  id: 'hb-ham',
  part: 'C',
  title: 'Hàm: tham số & trả về',
  icon: '🔧',
  minutes: 7,
  body: `
## 1. Khai báo cơ bản

\`\`\`python
def chao(ten, loi="Xin chào"):     # loi có giá trị mặc định
    """Trả về câu chào. Dòng này là docstring — help() sẽ đọc nó."""
    return f"{loi}, {ten}!"

chao("Minh")                  # dùng mặc định
chao("Minh", "Hi")            # theo vị trí
chao(ten="Minh", loi="Hi")    # theo tên — rõ ràng hơn
chao(loi="Hi", ten="Minh")    # theo tên thì đổi thứ tự được
\`\`\`

Tham số có mặc định phải đứng **sau** tham số không có mặc định.

## 2. Bẫy kinh điển: giá trị mặc định biến đổi được

\`\`\`python
def them(x, ds=[]):        # ❌ list này được tạo MỘT LẦN duy nhất
    ds.append(x)
    return ds

them(1)   # [1]
them(2)   # [1, 2]  ← không phải [2]!

def them(x, ds=None):      # ✅ cách đúng
    if ds is None:
        ds = []
    ds.append(x)
    return ds
\`\`\`

Nguyên nhân: giá trị mặc định được tính **một lần lúc định nghĩa hàm**, không phải mỗi lần gọi.
Đây là câu hỏi phỏng vấn Python phổ biến nhất.

## 3. \`*args\` và \`**kwargs\`

\`\`\`python
def f(*args, **kwargs):
    print(args)     # tuple các tham số theo vị trí
    print(kwargs)   # dict các tham số theo tên

f(1, 2, a=3)        # (1, 2)  {'a': 3}
\`\`\`

Dấu \`*\` khi **gọi** hàm thì ngược lại — trải ra:

\`\`\`python
ds = [1, 2, 3]
print(*ds)          # 1 2 3   (thay vì in cả list)
max(*ds)            # tương đương max(1, 2, 3)
f(**{"a": 1})       # tương đương f(a=1)
\`\`\`

## 4. Ép cách truyền tham số

\`\`\`python
def f(a, b, /, c, *, d):
    ...
#      ^^^^      ^
#      chỉ vị trí     d chỉ được truyền theo TÊN

f(1, 2, 3, d=4)     # ✅
f(a=1, ...)         # ❌ a chỉ nhận theo vị trí
f(1, 2, 3, 4)       # ❌ d bắt buộc theo tên
\`\`\`

\`*\` đứng một mình nghĩa là "từ đây trở đi bắt buộc dùng tên" — hữu ích để lời gọi hàm tự giải thích:
\`ve(x, y, mau="đỏ")\` rõ hơn \`ve(x, y, "đỏ")\`.

## 5. Trả về nhiều giá trị

\`\`\`python
def chia(a, b):
    return a // b, a % b     # thật ra là trả về một tuple

thuong, du = chia(7, 2)
kq = chia(7, 2)              # kq là tuple (3, 1)
\`\`\`

Hàm không có \`return\` thì trả về \`None\` — nguồn gốc của lỗi
\`'NoneType' object is not subscriptable\`. Mọi nhánh đều phải trả về gì đó nếu bạn định dùng kết quả.

## 6. Sửa biến của hàm ngoài

\`\`\`python
def dem():
    tong = 0
    def cong(x):
        nonlocal tong     # thiếu dòng này là UnboundLocalError
        tong += x
    for x in ds:
        cong(x)
    return tong
\`\`\`

Cách khác không cần \`nonlocal\`: dùng list một phần tử \`tong = [0]\` rồi sửa \`tong[0]\` —
sửa *nội dung* thì không phải gán tên nên không bị coi là biến cục bộ.

## 7. Tham số truyền theo kiểu gì?

Python truyền **tham chiếu tới object**. Hệ quả:

\`\`\`python
def f(ds):
    ds.append(1)     # ✅ sửa được — cùng object
def g(ds):
    ds = [9]         # ❌ chỉ đổi tên cục bộ, bên ngoài không thấy
\`\`\`

Kiểu bất biến (\`int\`, \`str\`, \`tuple\`) thì mọi phép "sửa" đều tạo object mới, nên hàm không
ảnh hưởng được biến bên ngoài.

## 8. lambda — chỉ cho biểu thức một dòng

\`\`\`python
ds.sort(key=lambda x: x[1])          # sắp theo phần tử thứ 2
sorted(ds, key=len, reverse=True)    # dài nhất trước
list(filter(lambda x: x > 0, ds))    # thường viết comprehension gọn hơn
\`\`\`

lambda không chứa được câu lệnh (\`if\` dạng khối, \`for\`, \`return\`). Cần nhiều hơn một biểu thức
thì dùng \`def\` — đặt tên cho hàm luôn dễ đọc hơn.

## 9. Docstring & chú thích kiểu

\`\`\`python
def tinh_bmi(can_nang: float, chieu_cao: float) -> float:
    """Tính chỉ số BMI.

    Tham số:
        can_nang: cân nặng tính bằng kg
        chieu_cao: chiều cao tính bằng mét
    """
    return can_nang / chieu_cao ** 2

help(tinh_bmi)          # đọc docstring
tinh_bmi.__doc__        # lấy ra dạng chuỗi
\`\`\`

Chú thích kiểu **không bị Python kiểm tra lúc chạy** — chúng dành cho người đọc và công cụ
như mypy. Xem thêm chương *Chú thích kiểu*.
`,
},
/* ==================================================================== */
{
  id: 'hb-iterator-generator',
  part: 'C',
  title: 'Iterator & generator',
  icon: '⏭️',
  minutes: 6,
  body: `
## 1. Vòng lặp for thật ra làm gì

\`\`\`python
for x in ds: ...
\`\`\`

Python gọi \`iter(ds)\` để lấy một **iterator**, rồi gọi \`next()\` liên tục cho tới khi
gặp \`StopIteration\`:

\`\`\`python
it = iter([1, 2])
next(it)     # 1
next(it)     # 2
next(it)     # ❌ StopIteration
next(it, "hết")   # 'hết' — có mặc định thì không lỗi
\`\`\`

Hiểu điều này giải thích rất nhiều hành vi tưởng là kỳ lạ.

## 2. Iterator chỉ dùng được MỘT LẦN

\`\`\`python
g = (x for x in range(3))
list(g)      # [0, 1, 2]
list(g)      # []  ← đã cạn!
\`\`\`

Bẫy hay gặp với \`zip\`, \`map\`, \`filter\`, \`enumerate\` — chúng đều trả iterator:

\`\`\`python
z = zip(a, b)
print(len(list(z)))   # ok
print(list(z))        # [] — đã cạn ở dòng trên
\`\`\`

Cần dùng nhiều lần thì đổ vào list trước: \`z = list(zip(a, b))\`.

## 3. Generator bằng \`yield\`

\`\`\`python
def dem(n):
    i = 0
    while i < n:
        yield i          # trả một giá trị rồi TẠM DỪNG tại đây
        i += 1

for x in dem(3):
    print(x)             # 0, 1, 2
\`\`\`

Khác \`return\`: \`yield\` **giữ nguyên trạng thái** của hàm, lần \`next()\` sau chạy tiếp từ đúng chỗ đó.

## 4. Vì sao dùng generator

\`\`\`python
# ❌ tạo 10 triệu phần tử trong RAM
def doc_het(f):
    return [dong.strip() for dong in f]

# ✅ mỗi lúc chỉ giữ một dòng
def doc_dan(f):
    for dong in f:
        yield dong.strip()
\`\`\`

Ba lợi ích: tốn ít bộ nhớ, có kết quả ngay từ phần tử đầu, và biểu diễn được dãy **vô hạn**:

\`\`\`python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
list(islice(fibonacci(), 10))    # 10 số đầu
\`\`\`

## 5. \`yield from\` — uỷ quyền cho generator khác

\`\`\`python
def phang(ds):
    for x in ds:
        if isinstance(x, list):
            yield from phang(x)    # thay cho: for y in phang(x): yield y
        else:
            yield x

list(phang([1, [2, [3, 4]], 5]))   # [1, 2, 3, 4, 5]
\`\`\`

## 6. Các hàm lười của thư viện chuẩn

\`\`\`python
map(f, ds)                 # áp dụng f — lười
filter(f, ds)              # lọc — lười
zip(a, b)                  # ghép — lười
enumerate(ds)              # đánh số — lười
reversed(ds)               # đảo — lười
range(n)                   # dãy số — lười
\`\`\`

Tất cả đều cần bọc \`list()\` nếu muốn nhìn thấy nội dung.

## 7. \`itertools\` — bộ công cụ cho dãy

\`\`\`python
from itertools import (count, cycle, repeat, chain, islice,
                       accumulate, groupby, combinations, permutations, product)

count(10)                    # 10, 11, 12, ... vô hạn
cycle("ab")                  # a, b, a, b, ... vô hạn
chain(a, b)                  # nối nhiều dãy
islice(dãy, 5)               # lấy 5 phần tử đầu của dãy vô hạn
accumulate([1,2,3,4])        # 1, 3, 6, 10 — tổng tiền tố
combinations("abc", 2)       # ab, ac, bc
permutations("abc", 2)       # ab, ac, ba, bc, ca, cb
product([0,1], repeat=3)     # mọi bộ 3 bit
\`\`\`

> ⚠️ \`groupby\` **chỉ gom các phần tử LIỀN KỀ** giống nhau — phải sắp xếp trước nếu muốn gom toàn cục.

## 8. Tự viết iterator bằng lớp

\`\`\`python
class DemNguoc:
    def __init__(self, n):
        self.n = n
    def __iter__(self):
        return self
    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

list(DemNguoc(3))     # [3, 2, 1]
\`\`\`

Thực tế generator gọn hơn nhiều — chỉ viết lớp khi cần giữ trạng thái phức tạp.
`,
},
/* ==================================================================== */
{
  id: 'hb-decorator',
  part: 'C',
  title: 'Decorator',
  icon: '🎁',
  minutes: 5,
  body: `
## 1. Hàm là giá trị

Trước khi hiểu decorator, phải chấp nhận: **hàm cũng là một object**, gán và truyền đi được.

\`\`\`python
def chao(): print("chào")

f = chao        # KHÔNG có ngoặc — gán chính hàm
f()             # gọi nó

def goi_hai_lan(ham):
    ham(); ham()

goi_hai_lan(chao)      # truyền hàm vào hàm khác
\`\`\`

## 2. Decorator là gì

Một hàm **nhận hàm và trả về hàm mới**:

\`\`\`python
def ghi_log(ham):
    def bao_ngoai(*args, **kwargs):
        print(f"gọi {ham.__name__}")
        kq = ham(*args, **kwargs)
        print(f"xong {ham.__name__}")
        return kq
    return bao_ngoai

@ghi_log
def cong(a, b):
    return a + b

cong(1, 2)      # in "gọi cong" / "xong cong" rồi trả 3
\`\`\`

\`@ghi_log\` chỉ là cách viết tắt của:

\`\`\`python
cong = ghi_log(cong)
\`\`\`

Hiểu được dòng đó là hiểu toàn bộ decorator.

## 3. Luôn dùng \`functools.wraps\`

Không có nó, hàm sau khi bọc bị mất tên và docstring:

\`\`\`python
from functools import wraps

def ghi_log(ham):
    @wraps(ham)                # giữ __name__, __doc__ của hàm gốc
    def bao_ngoai(*args, **kwargs):
        return ham(*args, **kwargs)
    return bao_ngoai
\`\`\`

## 4. Decorator có tham số — thêm một tầng

\`\`\`python
def lap_lai(so_lan):
    def decorator(ham):
        @wraps(ham)
        def bao_ngoai(*args, **kwargs):
            for _ in range(so_lan):
                kq = ham(*args, **kwargs)
            return kq
        return bao_ngoai
    return decorator

@lap_lai(3)
def chao(): print("hi")
\`\`\`

Ba tầng: nhận tham số → nhận hàm → nhận đối số của lời gọi.

## 5. Các decorator có sẵn đáng nhớ

\`\`\`python
from functools import lru_cache, cache

@cache                      # ghi nhớ kết quả — Python 3.9+
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

fib(100)                    # tức thì; không có @cache thì chạy cả đời
\`\`\`

\`@cache\` biến đệ quy mũ thành tuyến tính — công cụ quy hoạch động rẻ nhất Python có.

> ⚠️ Tham số phải **băm được** (không truyền list vào hàm có \`@cache\`).

Trong lớp:

\`\`\`python
class A:
    @staticmethod           # không nhận self
    def tien_ich(): ...

    @classmethod            # nhận cls thay vì self
    def tao_tu_chuoi(cls, s): return cls(...)

    @property               # dùng như thuộc tính, không cần ngoặc
    def dien_tich(self): return self.w * self.h
\`\`\`

## 6. Xếp chồng nhiều decorator

\`\`\`python
@a
@b
def f(): ...
# tương đương f = a(b(f)) — cái GẦN hàm nhất chạy trước
\`\`\`

## 7. Khi nào tự viết decorator

Khi cùng một đoạn "trước/sau" lặp lại ở nhiều hàm: ghi log, đo thời gian, kiểm tra quyền,
thử lại khi lỗi, đệm kết quả.

\`\`\`python
def do_thoi_gian(ham):
    @wraps(ham)
    def bao_ngoai(*args, **kwargs):
        import time
        t0 = time.perf_counter()
        try:
            return ham(*args, **kwargs)
        finally:
            print(f"{ham.__name__}: {time.perf_counter() - t0:.3f}s")
    return bao_ngoai
\`\`\`

Còn nếu chỉ dùng một chỗ thì viết thẳng vào hàm cho dễ đọc — decorator không phải mục tiêu.
`,
},
];
