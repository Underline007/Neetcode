/**
 * PHẦN "CÚ PHÁP CẦN BIẾT TRƯỚC" — nhóm 1 (module 1–5).
 *
 * Mục tiêu: người CHƯA TỪNG viết một dòng Python nào vẫn đọc hiểu được bài giảng phía dưới.
 * Nguyên tắc viết: giải thích từng ký hiệu ("dấu này là gì, đọc thế nào, gõ ra sao") trước,
 * rồi mới tới ý nghĩa; mọi ví dụ đều ngắn, chạy được, và có comment ghi rõ kết quả in ra.
 */

export default {
/* ==================================================================== */
'py-basics': `
## A. Một chương trình Python trông như thế nào?

Python **không có** \`main()\`, không cần khai báo thư viện bắt buộc, không cần dấu chấm phẩy.
Bạn gõ lệnh nào, máy chạy lệnh đó, từ trên xuống dưới.

\`\`\`python
# Đây là comment — máy bỏ qua dòng bắt đầu bằng dấu #
ten = "An"                    # tạo biến tên là "ten", chứa chuỗi "An"
tuoi = 20                     # biến chứa số nguyên
print("Xin chào", ten)        # print = in ra màn hình -> Xin chào An
\`\`\`

Ba điều khác hẳn các ngôn ngữ như Java/C/JavaScript, nhớ ngay từ đầu:

| Điều | Python | Ngôn ngữ khác (C/Java/JS) |
|---|---|---|
| Kết thúc câu lệnh | xuống dòng là xong | phải có dấu \`;\` |
| Nhóm lệnh (khối lệnh) | **thụt vào đầu dòng** | bọc trong \`{ }\` |
| Khai báo biến | \`x = 5\` | \`int x = 5;\` / \`let x = 5;\` |

## B. Thụt đầu dòng (indentation) — quy tắc quan trọng nhất

Trong Python, **khoảng trắng đầu dòng là cú pháp**, không phải cho đẹp. Các dòng thụt vào cùng
một mức tạo thành **một khối** thuộc về dòng phía trên nó.

\`\`\`python
if tuoi >= 18:            # dấu hai chấm ":" báo hiệu "bên dưới là một khối"
    print("Đủ tuổi")      # thụt vào 4 dấu cách -> dòng này THUỘC VỀ câu if
    print("Được vào")     # cũng thụt 4 -> cũng thuộc về if
print("Kết thúc")         # KHÔNG thụt -> nằm ngoài if, luôn chạy
\`\`\`

Quy ước bắt buộc phải theo:

- Thụt bằng **4 dấu cách** (space). Đừng trộn Tab và space trong cùng file — Python sẽ báo lỗi.
- Sau dấu \`:\` thì dòng tiếp theo **bắt buộc** phải thụt vào, nếu không sẽ lỗi \`IndentationError\`.

## C. Biến và cách đặt tên

\`\`\`python
x = 5             # gán: đọc là "x được gán bằng 5", KHÔNG phải "x bằng 5"
x = "chữ"         # hợp lệ! Python không khoá kiểu, biến đổi kiểu tự do
so_luong = 10     # tên biến Python viết kiểu snake_case: chữ thường, nối bằng gạch dưới
SO_PI = 3.14      # VIẾT HOA hết = quy ước "đây là hằng số, đừng sửa"
\`\`\`

Tên biến hợp lệ: bắt đầu bằng chữ cái hoặc \`_\`, sau đó là chữ/số/\`_\`. Không dấu cách, không dấu
tiếng Việt có dấu, không bắt đầu bằng số.

## D. Sáu kiểu dữ liệu bạn gặp mỗi ngày

\`\`\`python
a = 10            # int   — số nguyên
b = 3.14          # float — số thực (có phần thập phân)
c = "xin chào"    # str   — chuỗi ký tự, dùng "..." hoặc '...' đều được
d = True          # bool  — đúng/sai. Viết HOA chữ đầu: True / False
e = None          # None  — "không có giá trị". Tương đương null ở ngôn ngữ khác
f = [1, 2, 3]     # list  — danh sách, học kỹ ở module 3

print(type(a))    # <class 'int'>  — type() cho biết kiểu của một giá trị
\`\`\`

Ép kiểu (chuyển kiểu) dùng chính tên kiểu như một hàm:

\`\`\`python
int("42")      # 42     — chuỗi -> số nguyên
float("3.5")   # 3.5    — chuỗi -> số thực
str(42)        # "42"   — số -> chuỗi
int(3.9)       # 3      — CẮT phần thập phân (không làm tròn!)
bool(0)        # False  — số 0, chuỗi rỗng, list rỗng đều là False
\`\`\`

## E. Toán tử

\`\`\`python
7 + 2    # 9   cộng
7 - 2    # 5   trừ
7 * 2    # 14  nhân
7 / 2    # 3.5 chia — LUÔN ra số thực, kể cả 4 / 2 cho 2.0
7 // 2   # 3   chia lấy phần nguyên (làm tròn XUỐNG)
7 % 2    # 1   chia lấy dư
7 ** 2   # 49  luỹ thừa (7 mũ 2) — KHÔNG phải ^ như nhiều ngôn ngữ khác

x = 5
x += 3   # x = x + 3 -> 8. Tương tự -=, *=, /=
# CHÚ Ý: Python KHÔNG có x++ hay x-- . Phải viết x += 1
\`\`\`

So sánh và logic — Python dùng **từ tiếng Anh** thay cho ký hiệu:

| Ý nghĩa | Python | Ngôn ngữ khác |
|---|---|---|
| và | \`and\` | \`&&\` |
| hoặc | \`or\` | hai dấu sổ đứng |
| phủ định | \`not\` | \`!\` |
| bằng nhau | \`==\` | \`==\` / \`===\` |
| khác nhau | \`!=\` | \`!=\` |
| cùng một object | \`is\` | — |
| nằm trong | \`in\` | — |

\`\`\`python
tuoi = 20
if tuoi >= 18 and tuoi < 60:      # đọc: "và"
    print("người trưởng thành")

if 18 <= tuoi < 60:               # Python cho phép nối chuỗi so sánh — rất tiện, ngôn ngữ khác không có
    print("cũng đúng như trên")

if "a" in "xin chao":             # in: kiểm tra "có chứa không"
    print("có chữ a")
\`\`\`

## F. In ra màn hình và chuỗi f-string

\`\`\`python
print("một", "hai", "ba")         # in nhiều thứ, tự chèn dấu cách -> một hai ba
print("A", "B", sep="-")          # đổi ký tự ngăn cách -> A-B
print("không xuống dòng", end="") # mặc định print tự xuống dòng; end="" để không xuống

ten, diem = "An", 9.456
print(f"{ten} được {diem} điểm")     # f-string: chữ f trước dấu nháy, giá trị đặt trong { }
print(f"{diem:.1f}")                  # 9.5   — .1f = làm tròn 1 chữ số thập phân
print(f"{1234567:,}")                 # 1,234,567 — dấu phẩy ngăn cách hàng nghìn
\`\`\`

**f-string là cách nối chuỗi chuẩn của Python hiện đại** — dùng nó thay vì \`"a" + str(x) + "b"\`.

## G. Nhập dữ liệu và nhiều lệnh trên một dòng

\`\`\`python
ten = input("Nhập tên: ")     # input() LUÔN trả về chuỗi
tuoi = int(input("Tuổi: "))   # muốn số thì phải ép kiểu

a, b = 1, 2        # gán nhiều biến cùng lúc
a, b = b, a        # tráo giá trị hai biến — Python làm được trong 1 dòng, không cần biến tạm
\`\`\`

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Tên gọi | Dùng để làm gì |
|---|---|---|
| \`#\` | dấu thăng | viết comment (ghi chú, máy bỏ qua) |
| \`:\` | dấu hai chấm | mở đầu một khối lệnh, dòng sau phải thụt vào |
| \`=\` | dấu bằng | **gán** giá trị vào biến |
| \`==\` | hai dấu bằng | **so sánh** hai giá trị có bằng nhau không |
| \`f"..."\` | f-string | nhúng giá trị biến vào chuỗi |
| \`_\` | gạch dưới | nối từ trong tên biến (\`so_luong\`) |
| \`None\` | | giá trị "rỗng / chưa có" |

## Lỗi cú pháp người mới hay gặp

| Bạn viết | Lỗi báo ra | Sửa thành |
|---|---|---|
| \`if x = 5:\` | \`SyntaxError\` | \`if x == 5:\` (so sánh dùng hai dấu bằng) |
| \`if x > 3\` (thiếu \`:\`) | \`SyntaxError: expected ':'\` | \`if x > 3:\` |
| \`print("a")\` không thụt sau \`if\` | \`IndentationError\` | thụt vào 4 dấu cách |
| \`x++\` | \`SyntaxError\` | \`x += 1\` |
| \`if x == 5 && y == 2:\` | \`SyntaxError\` | \`if x == 5 and y == 2:\` |
| \`print("Điểm: " + 9)\` | \`TypeError\` (không cộng chuỗi với số) | \`print(f"Điểm: {9}")\` |
| \`true\` / \`TRUE\` | \`NameError\` | \`True\` (viết hoa đúng một chữ T) |
`,

/* ==================================================================== */
'py-control-flow': `
## A. Câu lệnh rẽ nhánh \`if\`

\`\`\`python
diem = 7

if diem >= 8:              # nếu ...
    print("Giỏi")
elif diem >= 5:            # elif = "else if" viết tắt. Có thể có nhiều elif liên tiếp
    print("Trung bình")
else:                      # còn lại
    print("Yếu")
\`\`\`

Ghi nhớ: \`if\` / \`elif\` / \`else\` đều kết thúc bằng dấu \`:\`, và phần thân **luôn thụt vào**.
Python không có \`switch\` truyền thống (từ 3.10 có \`match\` nhưng người mới chưa cần).

Viết \`if\` gọn trên một dòng (gọi là *biểu thức điều kiện* / ternary):

\`\`\`python
trang_thai = "Đỗ" if diem >= 5 else "Trượt"
# đọc theo thứ tự: LẤY "Đỗ" NẾU diem >= 5 NGƯỢC LẠI LẤY "Trượt"
\`\`\`

## B. Vòng lặp \`for\` — Python lặp qua "từng phần tử", không lặp qua chỉ số

Đây là khác biệt lớn nhất so với C/Java. Python **không có** \`for (i = 0; i < n; i++)\`.

\`\`\`python
for ten in ["An", "Bình", "Cường"]:   # lấy ra TỪNG phần tử, gán vào biến "ten"
    print(ten)                        # An / Bình / Cường

for ky_tu in "abc":                   # chuỗi cũng lặp được, ra từng ký tự
    print(ky_tu)                      # a / b / c
\`\`\`

Muốn lặp theo số lần thì dùng \`range()\`:

\`\`\`python
range(5)          # 0 1 2 3 4      — từ 0, DỪNG TRƯỚC 5 (không lấy 5)
range(2, 6)       # 2 3 4 5        — từ 2 đến trước 6
range(0, 10, 2)   # 0 2 4 6 8      — bước nhảy 2
range(5, 0, -1)   # 5 4 3 2 1      — bước âm = đếm ngược

for i in range(3):
    print(i)      # 0 / 1 / 2
\`\`\`

Hai hàm hay dùng kèm \`for\`:

\`\`\`python
ds = ["a", "b", "c"]

for i, gia_tri in enumerate(ds):      # enumerate: vừa lấy CHỈ SỐ vừa lấy GIÁ TRỊ
    print(i, gia_tri)                 # 0 a / 1 b / 2 c

ten = ["An", "Bình"]
tuoi = [20, 22]
for t, u in zip(ten, tuoi):           # zip: ghép hai danh sách, đi song song
    print(t, u)                       # An 20 / Bình 22
\`\`\`

## C. Vòng lặp \`while\`, \`break\`, \`continue\`

\`\`\`python
n = 0
while n < 3:            # lặp CHỪNG NÀO điều kiện còn đúng
    print(n)
    n += 1              # nhớ tự tăng, quên là lặp vô tận!

for i in range(10):
    if i == 3:
        continue        # BỎ QUA phần còn lại của vòng này, sang vòng kế
    if i == 6:
        break           # THOÁT hẳn khỏi vòng lặp
    print(i)            # 0 1 2 4 5
\`\`\`

Python có thêm \`else\` gắn với vòng lặp (rất riêng, ngôn ngữ khác không có):

\`\`\`python
for x in [1, 2, 3]:
    if x == 99:
        break
else:                   # chạy khi vòng lặp kết thúc mà KHÔNG gặp break
    print("không tìm thấy 99")
\`\`\`

## D. Định nghĩa hàm với \`def\`

\`\`\`python
def chao(ten):                 # def = define. "ten" là tham số
    return f"Chào {ten}"       # return = trả kết quả về cho nơi gọi

ket_qua = chao("An")           # gọi hàm
print(ket_qua)                 # Chào An
\`\`\`

Đọc từng phần của dòng \`def\`:

| Phần | Ví dụ | Nghĩa |
|---|---|---|
| \`def\` | | từ khoá bắt đầu định nghĩa hàm |
| tên hàm | \`chao\` | đặt theo snake_case, là động từ |
| \`( )\` | \`(ten)\` | danh sách tham số, để trống nếu hàm không cần đầu vào |
| \`:\` | | mở khối lệnh |
| thân hàm | thụt 4 dấu cách | phần việc của hàm |
| \`return\` | | trả giá trị ra. Không viết \`return\` thì hàm trả về \`None\` |

Các kiểu tham số:

\`\`\`python
def tao(ten, tuoi=18, *mon, **thong_tin):
    ...

# ten          : tham số bắt buộc
# tuoi=18      : tham số có GIÁ TRỊ MẶC ĐỊNH — gọi mà không truyền thì lấy 18
# *mon         : gom mọi đối số thừa (không tên) thành một tuple
# **thong_tin  : gom mọi đối số có tên thành một dict

tao("An")                       # tuoi tự lấy 18
tao("An", 20)                   # truyền theo THỨ TỰ (positional)
tao(ten="An", tuoi=20)          # truyền theo TÊN (keyword) — rõ ràng hơn, thứ tự tuỳ ý
tao("An", 20, "Toán", "Lý")     # "Toán","Lý" rơi vào *mon
tao("An", lop="12A")            # lop="12A" rơi vào **thong_tin
\`\`\`

## E. Hàm ẩn danh \`lambda\`

\`\`\`python
cong = lambda a, b: a + b        # tương đương def cong(a, b): return a + b
print(cong(2, 3))                # 5
\`\`\`

Cú pháp: \`lambda <tham số>: <một biểu thức duy nhất>\`. Không có \`return\`, không viết được nhiều
dòng. Chỉ dùng khi cần một hàm nhỏ đặt ngay tại chỗ, ví dụ làm khoá sắp xếp:

\`\`\`python
ds = [("An", 20), ("Bình", 18)]
ds.sort(key=lambda x: x[1])      # sắp xếp theo phần tử thứ 2 (tuổi)
\`\`\`

## F. Phạm vi biến (scope)

\`\`\`python
x = 10                # biến TOÀN CỤC (global) — nằm ngoài mọi hàm

def f():
    y = 5             # biến CỤC BỘ (local) — chỉ tồn tại bên trong hàm f
    print(x)          # đọc biến toàn cục thì KHÔNG cần khai báo gì

f()
print(y)              # NameError: y không tồn tại ở ngoài hàm
\`\`\`

Muốn **ghi đè** biến toàn cục từ trong hàm, phải khai báo:

\`\`\`python
dem = 0

def tang():
    global dem        # "biến dem trong hàm này chính là biến toàn cục"
    dem += 1          # không có dòng global ở trên -> lỗi UnboundLocalError
\`\`\`

\`nonlocal\` cũng tương tự nhưng dành cho hàm lồng trong hàm (sẽ gặp ở module 5).

## G. Lệnh rỗng \`pass\`

\`\`\`python
def chua_lam():
    pass          # "chưa viết gì cả" — Python bắt buộc khối lệnh phải có nội dung
\`\`\`

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu / từ khoá | Nghĩa |
|---|---|
| \`elif\` | "else if" — nhánh điều kiện tiếp theo |
| \`range(a, b, c)\` | dãy số từ \`a\`, dừng trước \`b\`, bước \`c\` |
| \`enumerate(ds)\` | trả về từng cặp (chỉ số, giá trị) |
| \`zip(a, b)\` | ghép hai dãy, đi song song |
| \`break\` / \`continue\` | thoát vòng lặp / bỏ qua vòng hiện tại |
| \`def\` | định nghĩa hàm |
| \`return\` | trả giá trị về |
| \`*args\` / \`**kwargs\` | gom đối số thừa (không tên / có tên) |
| \`lambda\` | hàm một dòng, không tên |
| \`global\` / \`nonlocal\` | cho phép ghi đè biến ở phạm vi ngoài |
| \`pass\` | chỗ trống hợp lệ, không làm gì |

## Lỗi cú pháp người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| \`for i in range(1, 5)\` mong có số 5 | \`range\` **không lấy** số cuối | \`range(1, 6)\` |
| \`for (i = 0; i < 5; i++)\` | không phải cú pháp Python | \`for i in range(5):\` |
| \`while x < 3:\` mà quên \`x += 1\` | lặp vô tận, treo máy | thêm dòng tăng biến |
| Sửa biến toàn cục trong hàm mà không khai báo | \`UnboundLocalError\` | thêm \`global x\` |
| \`def f(a=[], b)\` | tham số có mặc định phải đứng SAU | \`def f(b, a=[])\` |
| Dùng \`[]\` hoặc \`{}\` làm giá trị mặc định | bẫy kinh điển, giá trị bị dùng chung giữa các lần gọi | dùng \`None\` rồi tạo mới trong thân hàm |
`,

/* ==================================================================== */
'py-data-structures': `
## A. Bốn cấu trúc dữ liệu và ký hiệu dấu ngoặc của chúng

Đây là bảng cần thuộc lòng — nhìn dấu ngoặc là biết ngay đang làm việc với cái gì:

| Ký hiệu | Tên | Có thứ tự? | Sửa được? | Trùng lặp? | Ví dụ |
|---|---|---|---|---|---|
| \`[ ]\` | **list** (danh sách) | có | có | cho phép | \`[1, 2, 2, 3]\` |
| \`( )\` | **tuple** (bộ) | có | **không** | cho phép | \`(1, 2, 3)\` |
| \`{ }\` cặp khoá:giá trị | **dict** (từ điển) | có (theo thứ tự thêm) | có | khoá không trùng | \`{"a": 1}\` |
| \`{ }\` chỉ giá trị | **set** (tập hợp) | **không** | có | **tự loại trùng** | \`{1, 2, 3}\` |

\`\`\`python
ds = [10, 20, 30]                    # list
diem = (9.0, 8.5)                    # tuple — thường dùng cho dữ liệu cố định
nguoi = {"ten": "An", "tuoi": 20}    # dict — tra cứu theo tên khoá
tap = {1, 2, 2, 3}                   # set  -> {1, 2, 3}, số 2 chỉ còn một

rong_list = []
rong_dict = {}
rong_set = set()      # CHÚ Ý: {} là dict rỗng, KHÔNG phải set rỗng!
\`\`\`

## B. Truy cập phần tử: chỉ số và cắt lát (slicing)

Chỉ số Python **bắt đầu từ 0**, và có chỉ số âm đếm ngược từ cuối:

\`\`\`python
ds = ["a", "b", "c", "d", "e"]
#      0    1    2    3    4      <- chỉ số dương
#     -5   -4   -3   -2   -1      <- chỉ số âm

ds[0]     # "a"  — phần tử đầu
ds[-1]    # "e"  — phần tử CUỐI (mẹo rất hay dùng)
ds[-2]    # "d"
\`\`\`

Cắt lát dùng dấu \`:\` bên trong \`[ ]\` — cú pháp \`ds[bắt_đầu : dừng_trước : bước]\`:

\`\`\`python
ds[1:3]     # ['b', 'c']            — từ chỉ số 1, DỪNG TRƯỚC chỉ số 3
ds[:2]      # ['a', 'b']            — bỏ trống = từ đầu
ds[2:]      # ['c', 'd', 'e']       — bỏ trống = tới hết
ds[:]       # bản sao toàn bộ list
ds[::2]     # ['a', 'c', 'e']       — bước 2, lấy cách một phần tử
ds[::-1]    # ['e','d','c','b','a'] — bước -1 = ĐẢO NGƯỢC (mẹo kinh điển)
\`\`\`

Slicing dùng được cho cả chuỗi: \`"python"[::-1]\` cho \`"nohtyp"\`.

## C. Thao tác thường dùng trên list

\`\`\`python
ds = [3, 1, 2]

ds.append(4)        # thêm 1 phần tử vào CUỐI      -> [3, 1, 2, 4]
ds.insert(0, 9)     # chèn vào vị trí 0            -> [9, 3, 1, 2, 4]
ds.extend([5, 6])   # nối thêm cả một list         -> [..., 5, 6]
ds.pop()            # lấy ra & XOÁ phần tử cuối
ds.pop(0)           # lấy ra & xoá phần tử vị trí 0
ds.remove(3)        # xoá phần tử có GIÁ TRỊ là 3 (lần xuất hiện đầu)
len(ds)             # số lượng phần tử
3 in ds             # True/False — có chứa giá trị 3 không

ds.sort()                    # sắp xếp TẠI CHỖ, trả về None
ds.sort(reverse=True)        # giảm dần
moi = sorted(ds)             # trả về list MỚI đã sắp xếp, ds giữ nguyên
\`\`\`

> **Bẫy số 1 của người mới:** \`ds.sort()\` sửa chính \`ds\` và trả về \`None\`.
> Viết \`ds = ds.sort()\` sẽ làm \`ds\` biến thành \`None\`. Muốn giữ bản gốc thì dùng \`sorted(ds)\`.

## D. Thao tác với dict

\`\`\`python
nguoi = {"ten": "An", "tuoi": 20}

nguoi["ten"]              # "An"    — tra theo khoá
nguoi["email"]            # KeyError! Khoá không tồn tại -> lỗi
nguoi.get("email")        # None    — an toàn, không lỗi
nguoi.get("email", "—")   # "—"     — có giá trị mặc định

nguoi["lop"] = "12A"      # thêm khoá mới (hoặc ghi đè nếu đã có)
del nguoi["tuoi"]         # xoá một khoá
"ten" in nguoi            # True — kiểm tra KHOÁ có tồn tại không

nguoi.keys()              # các khoá
nguoi.values()            # các giá trị
nguoi.items()             # các cặp (khoá, giá trị)

for k, v in nguoi.items():          # cách duyệt dict chuẩn
    print(k, "=", v)
\`\`\`

## E. Thao tác với set

\`\`\`python
a = {1, 2, 3}
b = {3, 4}

a.add(5)        # thêm
a.discard(1)    # xoá, không lỗi nếu không có

a | b           # {1,2,3,4,5} hợp (union)
a & b           # {3}         giao (intersection)
a - b           # {1,2,5}     hiệu (difference)
\`\`\`

Công dụng phổ biến nhất: khử trùng lặp — \`list(set([1,1,2]))\` cho \`[1, 2]\`.

## F. Comprehension — cú pháp đặc trưng nhất của Python

Đây là cách viết gọn "tạo một list mới từ một dãy có sẵn". Cấu trúc luôn là:

\`\`\`text
[ <biểu_thức>  for <biến> in <dãy>  if <điều_kiện> ]
      (1)              (2)                (3)
\`\`\`

Đọc theo thứ tự **(2) → (3) → (1)**: lấy từng phần tử, lọc, rồi biến đổi.

\`\`\`python
# Cách viết dài, dễ hiểu:
binh_phuong = []
for x in range(5):
    binh_phuong.append(x * x)

# Cách viết comprehension — CÙNG KẾT QUẢ, một dòng:
binh_phuong = [x * x for x in range(5)]        # [0, 1, 4, 9, 16]

# Có lọc:
chan = [x for x in range(10) if x % 2 == 0]    # [0, 2, 4, 6, 8]

# Có rẽ nhánh (if/else đặt TRƯỚC for):
nhan = ["chẵn" if x % 2 == 0 else "lẻ" for x in range(3)]
\`\`\`

Đổi dấu ngoặc bên ngoài là đổi kiểu kết quả:

\`\`\`python
[x for x in ds]              # list comprehension   -> list
{x for x in ds}              # set comprehension    -> set (tự loại trùng)
{k: v for k, v in cap}       # dict comprehension   -> dict
(x for x in ds)              # generator (module 5) -> KHÔNG phải tuple!
\`\`\`

## G. Giải nén (unpacking)

\`\`\`python
diem = (9, 8)
toan, ly = diem          # tách tuple ra 2 biến

dau, *con_lai = [1, 2, 3, 4]    # dấu * gom phần còn lại -> dau=1, con_lai=[2,3,4]

a = [1, 2]
b = [3, 4]
gop = [*a, *b]                   # [1, 2, 3, 4] — trải list vào list mới
hop = {**d1, **d2}               # gộp hai dict, d2 ghi đè khi trùng khoá
\`\`\`

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`ds[i]\` | lấy phần tử thứ \`i\` (đếm từ 0) |
| \`ds[-1]\` | phần tử cuối cùng |
| \`ds[a:b]\` | cắt lát, từ \`a\` đến **trước** \`b\` |
| \`ds[::-1]\` | đảo ngược |
| \`[x for x in ...]\` | list comprehension |
| \`{k: v for ...}\` | dict comprehension |
| \`*ds\` / \`**d\` | trải list / trải dict |
| \`in\` | kiểm tra chứa (với dict là kiểm tra **khoá**) |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| \`ds = ds.sort()\` | \`sort()\` trả về \`None\` | \`ds.sort()\` hoặc \`ds = sorted(ds)\` |
| \`s = {}\` mong có set rỗng | \`{}\` là **dict** rỗng | \`s = set()\` |
| \`d["khoa_khong_co"]\` | \`KeyError\` | \`d.get("khoa_khong_co", mặc_định)\` |
| \`b = a\` rồi sửa \`b\` | list là kiểu tham chiếu, \`a\` cũng đổi | \`b = a[:]\` hoặc \`b = a.copy()\` |
| \`ds[5]\` khi list có 3 phần tử | \`IndexError\` | kiểm tra \`len(ds)\` trước |
| Xoá phần tử khi đang \`for\` trên chính list đó | bỏ sót phần tử | duyệt trên bản sao \`for x in ds[:]\` |
| \`(1)\` mong là tuple 1 phần tử | đó chỉ là số 1 trong ngoặc | \`(1,)\` — phải có dấu phẩy |
`,

/* ==================================================================== */
'py-oop': `
## A. Class là gì và viết ra sao?

**Class** = bản thiết kế. **Object** (đối tượng) = sản phẩm tạo ra từ bản thiết kế đó.

\`\`\`python
class NguoiDung:                       # class + Tên viết kiểu PascalCase (viết hoa mỗi chữ)
    def __init__(self, ten, tuoi):     # hàm khởi tạo, chạy tự động khi tạo object
        self.ten = ten                 # self.ten = thuộc tính của object
        self.tuoi = tuoi

    def chao(self):                    # phương thức (hàm nằm trong class)
        return f"Tôi là {self.ten}"

u = NguoiDung("An", 20)                # tạo object — KHÔNG có từ khoá "new" như Java/JS
print(u.ten)                           # An     — truy cập thuộc tính bằng dấu chấm
print(u.chao())                        # Tôi là An
\`\`\`

## B. Giải mã ba thứ khó hiểu nhất với người mới

**1. \`self\` là gì?**

\`self\` là chính object đang gọi phương thức. Python **bắt buộc** viết \`self\` làm tham số đầu tiên
của mọi phương thức, nhưng khi **gọi** thì không truyền nó — Python tự điền.

\`\`\`python
u.chao()            # bạn viết thế này
# Python thực chất chạy: NguoiDung.chao(u)  <- u chính là self
\`\`\`

Quên \`self\` là lỗi số 1 của người mới:

\`\`\`python
def chao():         # SAI -> TypeError: chao() takes 0 positional arguments but 1 was given
def chao(self):     # ĐÚNG
\`\`\`

**2. \`__init__\` là gì?** (đọc là "dunder init" — dunder = double underscore, hai gạch dưới)

Là phương thức chạy **ngay khi object được tạo**, dùng để gán giá trị ban đầu. Tên có hai dấu gạch
dưới mỗi bên vì đây là tên "đặc biệt" Python tự gọi, bạn không gọi trực tiếp.

**3. \`self.ten = ten\` nghĩa là gì?**

Vế trái \`self.ten\` là **thuộc tính lưu trên object** (sống lâu dài). Vế phải \`ten\` là **tham số**
truyền vào (biến mất khi hàm kết thúc). Dòng này = "cất tham số vào object để dùng sau".

## C. Các loại phương thức

\`\`\`python
class Vi:
    lai_suat = 0.05                    # thuộc tính của LỚP — mọi object dùng chung

    def __init__(self, so_du):
        self.so_du = so_du             # thuộc tính của OBJECT — mỗi object một giá trị riêng

    def nap(self, tien):               # phương thức thường — cần self
        self.so_du += tien

    @classmethod                       # nhận LỚP (cls), thường dùng làm "hàm tạo thay thế"
    def rong(cls):
        return cls(0)

    @staticmethod                      # không cần self lẫn cls — chỉ là hàm gom vào class cho gọn
    def hop_le(tien):
        return tien > 0
\`\`\`

Dòng bắt đầu bằng \`@\` gọi là **decorator** — hiểu tạm là "nhãn dán thay đổi cách hàm hoạt động".
Học kỹ ở module 5.

## D. Các phương thức đặc biệt (dunder) hay dùng

\`\`\`python
class Diem:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):                       # quyết định object hiện ra thế nào khi print
        return f"Diem({self.x}, {self.y})"

    def __eq__(self, khac):                   # quyết định dấu == so sánh thế nào
        return self.x == khac.x and self.y == khac.y

print(Diem(1, 2))              # Diem(1, 2)   — nhờ __repr__
Diem(1,2) == Diem(1,2)         # True         — nhờ __eq__ (mặc định sẽ là False!)
\`\`\`

| Dunder | Được gọi khi |
|---|---|
| \`__init__\` | tạo object |
| \`__repr__\` | \`print(obj)\`, hiện trong log |
| \`__eq__\` | dùng \`==\` |
| \`__len__\` | dùng \`len(obj)\` |
| \`__str__\` | \`str(obj)\` |

## E. Kế thừa (inheritance)

\`\`\`python
class DongVat:
    def __init__(self, ten):
        self.ten = ten
    def keu(self):
        return "..."

class Cho(DongVat):                    # Cho kế thừa DongVat — tên cha đặt trong ngoặc
    def __init__(self, ten, giong):
        super().__init__(ten)          # super() = gọi lên lớp cha, chạy __init__ của cha
        self.giong = giong
    def keu(self):                     # ghi đè (override) phương thức của cha
        return "Gâu!"

c = Cho("Mực", "Cỏ")
print(c.ten, c.keu())                  # Mực Gâu!    — ten thừa hưởng từ cha
isinstance(c, DongVat)                 # True — c vừa là Cho vừa là DongVat
\`\`\`

## F. Quy ước "riêng tư" bằng dấu gạch dưới

Python **không có** \`private\` / \`public\` như Java. Chỉ có quy ước đặt tên:

\`\`\`python
self.ten     = "An"    # công khai — ai cũng dùng được
self._noi_bo = 1       # MỘT gạch dưới: "đừng đụng vào, đây là chuyện nội bộ" (chỉ là quy ước)
self.__rieng = 2       # HAI gạch dưới: Python đổi tên biến đi (name mangling), khó truy cập từ ngoài
\`\`\`

## G. \`@dataclass\` — viết class chứa dữ liệu chỉ trong 3 dòng

\`\`\`python
from dataclasses import dataclass      # phải import trước khi dùng

@dataclass                             # nhãn này tự sinh __init__, __repr__, __eq__ cho bạn
class Diem:
    x: int                             # cú pháp "tên: kiểu" — bắt buộc với dataclass
    y: int = 0                         # có giá trị mặc định

d = Diem(1, 2)
print(d)                               # Diem(x=1, y=2) — tự có repr đẹp, không cần viết tay
\`\`\`

Phần \`x: int\` là **type hint** (chú thích kiểu), học kỹ ở module 11. Python **không** ép kiểu theo
chú thích này — nó chỉ để người đọc và công cụ kiểm tra hiểu ý bạn.

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`class Ten:\` | định nghĩa lớp, tên viết PascalCase |
| \`self\` | chính object đang thao tác; luôn là tham số đầu tiên |
| \`__init__\` | hàm khởi tạo, chạy khi tạo object |
| \`obj.thuoc_tinh\` | truy cập bằng dấu chấm |
| \`class Con(Cha):\` | kế thừa |
| \`super()\` | gọi lên lớp cha |
| \`@classmethod\` / \`@staticmethod\` | phương thức của lớp / hàm tiện ích |
| \`_x\` / \`__x\` | quy ước nội bộ / ẩn bằng name mangling |
| \`@dataclass\` | tự sinh \`__init__\`, \`__repr__\`, \`__eq__\` |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| \`def chao():\` trong class | thiếu \`self\` | \`def chao(self):\` |
| \`ten = ten\` trong \`__init__\` | không gắn vào object, mất ngay | \`self.ten = ten\` |
| \`u = new NguoiDung(...)\` | Python không có \`new\` | \`u = NguoiDung(...)\` |
| Quên \`super().__init__()\` | thuộc tính của lớp cha không được tạo | gọi \`super().__init__(...)\` |
| Dùng list làm thuộc tính lớp | mọi object dùng CHUNG một list | khởi tạo trong \`__init__\` |
| So sánh hai object bằng \`==\` | mặc định so sánh địa chỉ, ra \`False\` | viết \`__eq__\` hoặc dùng \`@dataclass\` |
`,

/* ==================================================================== */
'py-functional': `
## A. Iterable, iterator và vòng lặp thực sự chạy thế nào

- **Iterable** = thứ có thể lặp được (list, chuỗi, dict, set, range…).
- **Iterator** = thứ biết cách "đưa ra phần tử tiếp theo", nhớ được mình đang ở đâu.

\`\`\`python
ds = [1, 2, 3]
it = iter(ds)        # tạo iterator từ iterable
next(it)             # 1   — lấy phần tử tiếp theo
next(it)             # 2
next(it)             # 3
next(it)             # StopIteration — hết rồi, báo lỗi để vòng for biết mà dừng
\`\`\`

Vòng \`for x in ds:\` thực chất là: gọi \`iter(ds)\`, rồi gọi \`next()\` liên tục cho tới khi gặp
\`StopIteration\`. Hiểu điều này là hiểu toàn bộ module.

## B. Generator và từ khoá \`yield\`

\`yield\` giống \`return\` nhưng **không kết thúc hàm** — nó "nhả ra một giá trị rồi tạm dừng tại chỗ",
lần gọi sau chạy tiếp từ đúng chỗ đã dừng.

\`\`\`python
def dem_den(n):
    i = 0
    while i < n:
        yield i        # nhả ra i, TẠM DỪNG ở đây
        i += 1         # lần sau chạy tiếp từ dòng này

for x in dem_den(3):
    print(x)           # 0 / 1 / 2
\`\`\`

Khác biệt cốt lõi:

| | Hàm thường (\`return\`) | Generator (\`yield\`) |
|---|---|---|
| Khi gọi | chạy hết, trả kết quả | **chưa chạy gì cả**, trả về một generator |
| Bộ nhớ | tạo cả list trong RAM | mỗi lúc chỉ giữ 1 giá trị |
| Dùng lại | gọi lại được | chạy hết một lần là **cạn**, phải tạo mới |

\`\`\`python
g = dem_den(3)
print(g)              # <generator object ...> — chưa có số nào được sinh ra
list(g)               # [0, 1, 2] — ép chạy hết
list(g)               # []        — đã cạn!
\`\`\`

Generator expression — giống list comprehension nhưng dùng dấu \`( )\`:

\`\`\`python
[x * x for x in range(1000000)]     # tạo NGAY 1 triệu phần tử trong RAM
(x * x for x in range(1000000))     # chỉ tạo khi được yêu cầu — gần như không tốn RAM

sum(x * x for x in range(10))       # dùng trực tiếp trong hàm, bỏ được cặp ngoặc thừa
\`\`\`

## C. Hàm là "công dân hạng nhất"

Trong Python, hàm cũng là một giá trị: gán vào biến được, truyền vào hàm khác được, trả về được.

\`\`\`python
def chao(ten):
    return f"Hi {ten}"

f = chao              # KHÔNG có ngoặc -> gán chính hàm vào biến f
f("An")               # "Hi An"

chao("An")            # CÓ ngoặc -> gọi hàm, lấy kết quả
\`\`\`

Ghi nhớ: **có \`( )\` là gọi, không có \`( )\` là chính bản thân hàm.**

Ba hàm dựng sẵn nhận hàm làm tham số:

\`\`\`python
ds = [1, 2, 3, 4]
list(map(lambda x: x * 2, ds))        # [2, 4, 6, 8]  — áp dụng hàm cho từng phần tử
list(filter(lambda x: x % 2 == 0, ds))# [2, 4]        — giữ lại phần tử làm hàm trả True

from functools import reduce
reduce(lambda a, b: a + b, ds)        # 10 — gộp dần thành một giá trị
\`\`\`

(Người Python thường thích comprehension hơn \`map\`/\`filter\` vì dễ đọc hơn.)

## D. Closure — hàm lồng trong hàm và "nhớ" biến bên ngoài

\`\`\`python
def tao_bo_dem():
    dem = 0                  # biến của hàm ngoài

    def tang():              # hàm lồng bên trong
        nonlocal dem         # "dem ở đây là dem của hàm bao ngoài, cho tôi sửa nó"
        dem += 1
        return dem

    return tang              # trả về CHÍNH HÀM (không gọi)

d = tao_bo_dem()
d()    # 1
d()    # 2      — biến dem vẫn sống, dù tao_bo_dem đã kết thúc từ lâu
\`\`\`

\`nonlocal\` khác \`global\`: \`nonlocal\` trỏ tới biến của **hàm bao ngoài gần nhất**, còn \`global\`
trỏ tới biến ở cấp file.

## E. Decorator — ký hiệu \`@\`

Decorator là **một hàm nhận hàm khác và trả về hàm mới đã được "bọc" thêm việc**.

\`\`\`python
def ghi_log(func):                       # 1) nhận vào một hàm
    def ben_trong(*args, **kwargs):      # 2) tạo hàm bọc, nhận mọi kiểu đối số
        print(f"Gọi {func.__name__}")
        ket_qua = func(*args, **kwargs)  # 3) gọi hàm gốc
        print("Xong")
        return ket_qua
    return ben_trong                     # 4) trả hàm bọc ra

@ghi_log                                 # dán nhãn lên hàm
def cong(a, b):
    return a + b

cong(1, 2)
# Gọi cong
# Xong
# -> 3
\`\`\`

Dòng \`@ghi_log\` chỉ là **cách viết tắt** của:

\`\`\`python
cong = ghi_log(cong)      # hoàn toàn tương đương
\`\`\`

Hiểu được câu này là hiểu decorator. \`*args, **kwargs\` ở hàm bọc để nó nhận được **mọi** kiểu đối
số mà hàm gốc có thể có.

Decorator có tham số cần thêm một tầng hàm nữa:

\`\`\`python
def lap_lai(n):                  # tầng 1: nhận THAM SỐ
    def decorator(func):         # tầng 2: nhận HÀM
        def wrapper(*a, **k):    # tầng 3: thay thế hàm gốc
            for _ in range(n):
                func(*a, **k)
        return wrapper
    return decorator

@lap_lai(3)                      # có ngoặc vì phải gọi tầng 1 trước
def chao():
    print("hi")
\`\`\`

Nên thêm \`@functools.wraps(func)\` lên hàm bọc để giữ nguyên tên và docstring của hàm gốc:

\`\`\`python
import functools

def ghi_log(func):
    @functools.wraps(func)       # không có dòng này, cong.__name__ sẽ thành "ben_trong"
    def ben_trong(*a, **k):
        return func(*a, **k)
    return ben_trong
\`\`\`

## F. Dấu gạch dưới \`_\` làm biến vứt đi

\`\`\`python
for _ in range(3):        # "tôi không quan tâm giá trị, chỉ cần lặp 3 lần"
    print("hi")

_, ten = ("bỏ", "An")     # chỉ lấy phần tử thứ hai
\`\`\`

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`iter()\` / \`next()\` | tạo iterator / lấy phần tử tiếp theo |
| \`yield\` | nhả một giá trị rồi tạm dừng hàm |
| \`(x for x in ...)\` | generator expression, tiết kiệm bộ nhớ |
| \`f\` vs \`f()\` | chính hàm vs gọi hàm |
| \`@ten\` | decorator — viết tắt của \`f = ten(f)\` |
| \`*args\` / \`**kwargs\` | nhận mọi đối số, dùng trong hàm bọc |
| \`nonlocal\` | sửa biến của hàm bao ngoài |
| \`functools.wraps\` | giữ tên/metadata hàm gốc khi bọc |
| \`_\` | biến "không dùng tới" |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| \`f = chao()\` mong gán hàm | đã gọi mất rồi, \`f\` là kết quả | \`f = chao\` |
| \`len(gen)\` | generator không có độ dài | \`len(list(gen))\` (nhưng sẽ tốn RAM) |
| Duyệt một generator hai lần | lần hai rỗng vì đã cạn | tạo lại, hoặc chuyển sang \`list\` |
| \`return\` thay vì \`yield\` | hàm dừng hẳn, chỉ ra 1 giá trị | dùng \`yield\` |
| Decorator quên \`return wrapper\` | hàm bị gán thành \`None\` | nhớ trả hàm bọc ra |
| \`@lap_lai\` thay vì \`@lap_lai(3)\` | decorator có tham số phải gọi | thêm ngoặc |
`,
};
