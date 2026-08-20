/**
 * CẨM NANG CÚ PHÁP PYTHON — PHẦN A: BẮT ĐẦU
 * Chạy Python · biến & kiểu · toán tử · số học.
 */
export default [
/* ==================================================================== */
{
  id: 'hb-chay-python',
  part: 'A',
  title: 'Chạy Python lần đầu',
  icon: '▶️',
  minutes: 5,
  body: `
Python có ba cách chạy code, và người mới hay lẫn chúng với nhau.

## 1. REPL — gõ tới đâu chạy tới đó

Mở terminal, gõ \`python3\` rồi Enter. Bạn thấy dấu nhắc \`>>>\`:

\`\`\`python
>>> 2 + 3
5
>>> ten = "Minh"
>>> f"Chào {ten}"
'Chào Minh'
>>> [x*2 for x in range(4)]
[0, 2, 4, 6]
\`\`\`

REPL **tự in ra giá trị** của biểu thức, nên không cần \`print()\`. Đây là chỗ tốt nhất để thử
một dòng cú pháp bạn không chắc — nhanh hơn nhiều so với sửa file rồi chạy lại.

Vài lệnh REPL đáng nhớ:

\`\`\`python
>>> help(str.split)     # đọc tài liệu ngay tại chỗ
>>> dir(list)           # liệt kê mọi phương thức của list
>>> type(x)             # x là kiểu gì?
>>> exit()              # thoát (hoặc Ctrl+D)
\`\`\`

## 2. Chạy một file

Lưu file \`bai1.py\`, rồi:

\`\`\`bash
python3 bai1.py
\`\`\`

Trong file thì **không tự in gì cả** — muốn thấy kết quả phải gọi \`print()\`.
Đây là khác biệt làm người mới bối rối nhất khi chuyển từ REPL sang file.

## 3. Chạy một module của thư viện chuẩn

Cờ \`-m\` chạy module như một chương trình, rất hay dùng:

\`\`\`bash
python3 -m venv .venv        # tạo môi trường ảo
python3 -m http.server 8000  # bật máy chủ web trong thư mục hiện tại
python3 -m json.tool a.json  # định dạng lại file JSON cho dễ đọc
python3 -m pip install X     # cách gọi pip an toàn nhất
\`\`\`

## 4. Ba dòng đầu tiên nên biết

\`\`\`python
# Đây là comment — Python không có comment khối thật sự
print("Xin chào")            # in ra màn hình
ten = input("Tên bạn: ")     # đọc một dòng từ bàn phím, LUÔN trả về chuỗi
\`\`\`

> ⚠️ \`input()\` luôn trả về **chuỗi**. Muốn số thì phải ép: \`tuoi = int(input("Tuổi: "))\`.
> Quên bước này là gặp \`TypeError\` khi đem cộng.

\`print()\` có vài tham số hữu ích:

\`\`\`python
print("a", "b", "c")               # a b c        — mặc định ngăn bằng dấu cách
print("a", "b", sep="-")           # a-b
print("đang chạy...", end="")      # không xuống dòng
print(*[1, 2, 3])                  # 1 2 3        — trải list ra
\`\`\`

## 5. Môi trường ảo (venv) — làm sớm cho đỡ khổ

Mỗi dự án nên có thư viện riêng, không cài chung vào máy:

\`\`\`bash
python3 -m venv .venv          # tạo môi trường ảo trong thư mục .venv
source .venv/bin/activate      # bật (Windows: .venv\\Scripts\\activate)
pip install requests           # cài thư viện — chỉ nằm trong dự án này
pip freeze > requirements.txt  # ghi lại danh sách để máy khác cài đúng như vậy
deactivate                     # tắt
\`\`\`

Dấu hiệu đã bật: dấu nhắc terminal có tiền tố \`(.venv)\`.

## 6. Khối \`if __name__ == "__main__"\`

Bạn sẽ thấy dòng này ở cuối rất nhiều file Python:

\`\`\`python
def main():
    print("chạy chương trình")

if __name__ == "__main__":
    main()
\`\`\`

Ý nghĩa: **chỉ chạy \`main()\` khi file này được chạy trực tiếp**, chứ không chạy khi nó bị
file khác \`import\`. Nhờ vậy một file vừa dùng làm thư viện vừa dùng làm chương trình được.

## 7. Bảng lỗi khởi động hay gặp

| Thông báo | Nguyên nhân |
|---|---|
| \`command not found: python\` | trên Linux/macOS thường phải gõ \`python3\` |
| \`No module named 'requests'\` | chưa \`pip install\`, hoặc quên bật venv |
| \`SyntaxError: invalid syntax\` ngay dòng \`print\` | đang chạy bằng Python 2 |
| \`Permission denied\` | thiếu quyền — thử \`pip install --user\` hoặc dùng venv |
`,
},
/* ==================================================================== */
{
  id: 'hb-bien-kieu',
  part: 'A',
  title: 'Biến, kiểu và phép gán',
  icon: '📦',
  minutes: 6,
  body: `
## 1. Không có từ khoá khai báo

\`\`\`python
x = 5          # không let/const/var, không dấu chấm phẩy
x = "chữ"      # gán lại kiểu khác cũng được — Python là kiểu động
\`\`\`

Python **không có hằng số thật sự**. Quy ước: viết HOA để báo "đừng đổi cái này":

\`\`\`python
MAX_SIZE = 100      # người khác đọc là hiểu không nên gán lại
\`\`\`

## 2. Bảy kiểu dựng sẵn cần thuộc

| Kiểu | Ví dụ | Bất biến? | Ghi nhớ |
|---|---|---|---|
| \`int\` | \`42\`, \`-7\` | ✅ | số nguyên **không giới hạn độ lớn** |
| \`float\` | \`3.14\` | ✅ | \`0.1 + 0.2 != 0.3\` — sai số nhị phân |
| \`str\` | \`"chào"\` | ✅ | sửa được ký tự? **Không** |
| \`bool\` | \`True\`, \`False\` | ✅ | viết **hoa** chữ đầu |
| \`list\` | \`[1, 2, 3]\` | ❌ | sửa tại chỗ được |
| \`tuple\` | \`(1, 2)\` | ✅ | dùng làm khoá dict được |
| \`dict\` | \`{"a": 1}\` | ❌ | giữ thứ tự chèn (từ 3.7) |

Cộng thêm \`set\` (\`{1, 2}\` — biến đổi được) và \`None\`.

## 3. Ép kiểu

\`\`\`python
int("42")        # 42
int("42", 2)     # 2   ← đọc "42" ở hệ cơ số... lỗi, vì hệ 2 chỉ có 0 và 1
int("1010", 2)   # 10  ← nhị phân sang thập phân
int(3.99)        # 3   ← CẮT phần thập phân, không làm tròn
round(3.99)      # 4   ← muốn làm tròn thì dùng round
float("3.14")    # 3.14
str(42)          # '42'
bool("")         # False
list("abc")      # ['a', 'b', 'c']
tuple([1, 2])    # (1, 2)
\`\`\`

> ⚠️ \`int("3.5")\` là **lỗi** \`ValueError\` — phải đi qua float: \`int(float("3.5"))\`.

## 4. Gán nhiều biến cùng lúc

\`\`\`python
a, b = 1, 2
a, b = b, a                      # hoán đổi, không cần biến tạm
dau, *giua, cuoi = [1,2,3,4,5]   # dau=1, giua=[2,3,4], cuoi=5
x = y = 0                        # cùng một giá trị
a, (b, c) = 1, (2, 3)            # bung lồng nhau
_, quan_trong = lay_cap()        # _ là quy ước "không cần giá trị này"
\`\`\`

## 5. Bẫy lớn nhất: gán KHÔNG phải sao chép

\`\`\`python
a = [1, 2, 3]
b = a          # b và a trỏ tới CÙNG một list
b.append(4)
print(a)       # [1, 2, 3, 4]  ← a cũng đổi!
\`\`\`

Ba mức sao chép:

\`\`\`python
b = a           # KHÔNG sao chép — cùng một object
b = a[:]        # sao chép NÔNG (hoặc list(a), a.copy())
import copy
b = copy.deepcopy(a)   # sao chép SÂU — cả các list lồng bên trong
\`\`\`

Vì sao "nông" chưa đủ:

\`\`\`python
a = [[1, 2], [3, 4]]
b = a[:]           # list ngoài là mới...
b[0].append(99)    # ...nhưng list TRONG vẫn dùng chung
print(a)           # [[1, 2, 99], [3, 4]]  ← a vẫn đổi
\`\`\`

Với kiểu bất biến (\`int\`, \`str\`, \`tuple\`) thì không có vấn đề này, vì không sửa tại chỗ được.

## 6. Kiểm tra kiểu và định danh

\`\`\`python
type(x)                       # <class 'int'>
isinstance(x, int)            # True — cách nên dùng
isinstance(x, (int, float))   # kiểm nhiều kiểu cùng lúc
id(x)                         # địa chỉ object trong bộ nhớ
a is b                        # có phải CÙNG một object không
\`\`\`

> ⚠️ \`isinstance(True, int)\` trả về \`True\` — trong Python, \`bool\` là **lớp con của \`int\`**.
> \`True + True == 2\`. Nhớ điều này khi đếm: \`sum(x > 0 for x in arr)\` đếm được số phần tử dương.

## 7. Phạm vi biến (scope) — quy tắc LEGB

Python tìm tên theo thứ tự: **L**ocal → **E**nclosing (hàm bao ngoài) → **G**lobal → **B**uilt-in.

\`\`\`python
x = "toàn cục"

def ngoai():
    x = "bao ngoài"
    def trong():
        print(x)      # "bao ngoài" — tìm thấy ở tầng enclosing
    trong()
\`\`\`

Muốn **gán** (không phải chỉ đọc) biến ở tầng ngoài:

\`\`\`python
def dem():
    tong = 0
    def cong(x):
        nonlocal tong     # gán biến của hàm bao ngoài
        tong += x
    ...

bien_toan_cuc = 0
def sua():
    global bien_toan_cuc  # gán biến ở cấp module
    bien_toan_cuc += 1
\`\`\`

**Quy tắc vàng:** chỉ cần **gán** một tên ở đâu đó trong hàm là Python coi nó là biến cục bộ
của cả hàm đó — đọc nó trước dòng gán sẽ ném \`UnboundLocalError\`.
`,
},
/* ==================================================================== */
{
  id: 'hb-toan-tu',
  part: 'A',
  title: 'Toán tử & thứ tự ưu tiên',
  icon: '➗',
  minutes: 6,
  body: `
## 1. Số học — hai phép chia khác nhau

\`\`\`python
7 / 2      # 3.5   ← LUÔN ra float, kể cả 6/2 cũng ra 3.0
7 // 2     # 3     ← chia lấy phần nguyên
-7 // 2    # -4    ← làm tròn XUỐNG, không phải cắt về 0
7 % 2      # 1     ← số dư
-7 % 2     # 1     ← dấu theo SỐ CHIA (khác C, khác JavaScript!)
2 ** 10    # 1024  ← luỹ thừa
divmod(7, 2)  # (3, 1) — thương và dư cùng lúc
\`\`\`

Mẹo dùng \`%\` hay gặp trong thuật toán:

\`\`\`python
i % 2 == 0            # số chẵn?
(i + 1) % n           # đi vòng tròn quanh mảng n phần tử
gio = tong_phut // 60
phut = tong_phut % 60
\`\`\`

## 2. Phép gán rút gọn

\`\`\`python
x += 1      # x = x + 1   (KHÔNG có ++)
x -= 1
x *= 2
x //= 2
x **= 2
x %= 7
ds += [4]   # với list: tương đương extend, sửa TẠI CHỖ
\`\`\`

## 3. So sánh nối chuỗi được

\`\`\`python
if 0 <= i < len(arr):      # đúng cú pháp Python, đọc như toán học
    ...
if a == b == c:            # cả ba bằng nhau
\`\`\`

## 4. \`==\` và \`is\` — đừng lẫn

| | Ý nghĩa | Dùng khi |
|---|---|---|
| \`==\` | so sánh **giá trị** | hầu hết mọi lúc |
| \`is\` | so sánh **cùng một object trong bộ nhớ** | chỉ với \`None\`, \`True\`, \`False\` |

\`\`\`python
if x is None:      # ✅ đúng chuẩn
if x == None:      # ⚠️ chạy được nhưng không nên
[1,2] == [1,2]     # True  — cùng giá trị
[1,2] is [1,2]     # False — hai object khác nhau
\`\`\`

## 5. Logic: từ, không phải ký hiệu

\`\`\`python
a and b      # không phải &&
a or b       # không phải ||
not a        # không phải !
\`\`\`

\`and\`/\`or\` trả về **giá trị**, không phải \`True\`/\`False\`:

\`\`\`python
ten = ten_nhap or "Khách"          # rỗng thì dùng mặc định
ket_qua = ds and ds[0]             # ds rỗng thì trả [] chứ không lỗi
\`\`\`

Cả hai đều **đoản mạch**: \`a and b\` không tính \`b\` nếu \`a\` đã sai. Nhờ vậy viết được:

\`\`\`python
if node is not None and node.val > 0:    # an toàn, không lỗi khi node là None
\`\`\`

## 6. Cái gì được coi là "sai"?

Bảy thứ falsy — nhớ hết là đỡ viết thừa:

\`\`\`python
False, None, 0, 0.0, "", [], {}, set()
\`\`\`

Nên viết \`if not arr:\` thay vì \`if len(arr) == 0:\`.

> ⚠️ Bẫy: \`if not x:\` đúng khi bạn muốn bắt cả \`0\`. Nhưng nếu \`0\` là giá trị hợp lệ và bạn chỉ
> muốn bắt "chưa có", phải viết \`if x is None:\`.

## 7. Toán tử thành viên & đồng nhất

\`\`\`python
x in ds          # có trong dãy? — với list là O(n), với set/dict là O(1)
x not in ds
a is b
a is not b
\`\`\`

## 8. Toán tử bit

\`\`\`python
a & b     # AND         5 & 3 == 1
a | b     # OR          5 | 3 == 7
a ^ b     # XOR         5 ^ 3 == 6
~a        # NOT         ~5 == -6
a << n    # dịch trái   1 << 3 == 8   (nhân 2^n)
a >> n    # dịch phải   8 >> 3 == 1   (chia 2^n)
\`\`\`

Mẹo hay gặp:

\`\`\`python
n & 1           # bit cuối — kiểm tra lẻ/chẵn
n & (n - 1)     # xoá bit 1 thấp nhất
n & -n          # giữ lại đúng bit 1 thấp nhất
bin(10)         # '0b1010'
n.bit_count()   # đếm số bit 1 (Python 3.10+)
\`\`\`

## 9. Toán tử hải mã \`:=\` (Python 3.8+)

Gán **và** trả về giá trị trong cùng một biểu thức:

\`\`\`python
while (dong := f.readline()):    # gán rồi kiểm tra luôn
    xu_ly(dong)

if (n := len(ds)) > 10:
    print(f"quá dài: {n}")
\`\`\`

## 10. Thứ tự ưu tiên (cao → thấp)

| Nhóm | Toán tử |
|---|---|
| 1 | \`**\` |
| 2 | \`+x\`, \`-x\`, \`~x\` |
| 3 | \`*\`, \`/\`, \`//\`, \`%\` |
| 4 | \`+\`, \`-\` |
| 5 | \`<<\`, \`>>\` |
| 6 | \`&\` → \`^\` → \`\\|\` |
| 7 | so sánh, \`in\`, \`is\`, \`==\` |
| 8 | \`not\` → \`and\` → \`or\` |
| 9 | \`a if c else b\`, \`lambda\`, \`:=\` |

> Bẫy hay gặp: \`2 ** 3 ** 2\` bằng **512** chứ không phải 64 — \`**\` kết hợp từ **phải sang trái**.
> Còn lại đều trái sang phải. Không chắc thì cứ đóng ngoặc — đóng ngoặc không bao giờ bị chê.
`,
},
/* ==================================================================== */
{
  id: 'hb-so-hoc',
  part: 'A',
  title: 'Số học: int lớn, float, làm tròn',
  icon: '🔢',
  minutes: 5,
  body: `
## 1. \`int\` của Python không giới hạn độ lớn

\`\`\`python
2 ** 1000      # chạy bình thường, ra số 302 chữ số
\`\`\`

Không có tràn số như C hay Java. Đây là lý do Python hay được dùng cho bài toán số lớn.
Đổi lại, số rất lớn thì phép tính chậm hơn.

## 2. \`float\` có sai số — điều BẮT BUỘC phải biết

\`\`\`python
0.1 + 0.2            # 0.30000000000000004
0.1 + 0.2 == 0.3     # False!
\`\`\`

Không phải lỗi Python — máy tính lưu số thực theo hệ nhị phân, \`0.1\` không biểu diễn chính xác được.
Mọi ngôn ngữ đều vậy.

Cách so sánh đúng:

\`\`\`python
import math
math.isclose(0.1 + 0.2, 0.3)          # True
abs(a - b) < 1e-9                     # cách thủ công, cũng ổn
\`\`\`

## 3. Tiền bạc thì dùng \`Decimal\`, không dùng \`float\`

\`\`\`python
from decimal import Decimal
Decimal("0.1") + Decimal("0.2")       # Decimal('0.3')  ← chính xác
\`\`\`

> ⚠️ Phải truyền **chuỗi**: \`Decimal(0.1)\` vẫn dính sai số vì đã đi qua float rồi.

Cần phân số chính xác thì có \`Fraction\`:

\`\`\`python
from fractions import Fraction
Fraction(1, 3) + Fraction(1, 6)       # Fraction(1, 2)
\`\`\`

## 4. Làm tròn — có một bất ngờ

\`\`\`python
round(3.7)        # 4
round(3.14159, 2) # 3.14
round(2.5)        # 2   ← KHÔNG phải 3!
round(3.5)        # 4
\`\`\`

Python dùng **làm tròn về số chẵn gần nhất** (banker's rounding) để không lệch thống kê khi
cộng dồn nhiều số. Muốn làm tròn kiểu học phổ thông:

\`\`\`python
import math
math.floor(x + 0.5)                   # luôn lên khi đúng .5
\`\`\`

Các hàm làm tròn khác:

\`\`\`python
math.floor(3.7)   # 3   ← xuống
math.ceil(3.2)    # 4   ← lên
math.trunc(-3.7)  # -3  ← cắt về 0
int(-3.7)         # -3  ← giống trunc
math.floor(-3.7)  # -4  ← khác int()!
\`\`\`

## 5. \`math\` — những hàm hay dùng

\`\`\`python
math.sqrt(16)       # 4.0
math.isqrt(17)      # 4      ← căn bậc hai NGUYÊN, không sai số
math.gcd(12, 18)    # 6      ← ước chung lớn nhất
math.lcm(4, 6)      # 12     ← bội chung nhỏ nhất (3.9+)
math.log2(1024)     # 10.0
math.log(100, 10)   # 2.0
math.inf            # vô cực — dùng khởi tạo bài tìm min
math.factorial(5)   # 120
math.comb(5, 2)     # 10     ← tổ hợp C(5,2)
math.perm(5, 2)     # 20     ← chỉnh hợp
math.pi, math.e
\`\`\`

## 6. Số ngẫu nhiên

\`\`\`python
import random
random.random()              # số thực [0.0, 1.0)
random.randint(1, 6)         # số nguyên 1..6, TÍNH CẢ 6
random.randrange(0, 10, 2)   # 0,2,4,6,8 — không tính 10
random.choice(ds)            # một phần tử bất kỳ
random.choices(ds, k=3)      # 3 phần tử, CÓ thể lặp
random.sample(ds, 3)         # 3 phần tử, KHÔNG lặp
random.shuffle(ds)           # xáo trộn TẠI CHỖ
random.seed(42)              # cố định để kết quả lặp lại được khi gỡ lỗi
\`\`\`

## 7. Đổi hệ cơ số

\`\`\`python
bin(10)        # '0b1010'
oct(10)        # '0o12'
hex(255)       # '0xff'
int('1010', 2) # 10
int('ff', 16)  # 255
f"{255:b}"     # '11111111'  ← không có tiền tố 0b
f"{255:08b}"   # '11111111'  ← đệm cho đủ 8 chữ số
\`\`\`

## 8. Bảng tóm tắt bẫy số học

| Viết | Kết quả | Vì sao |
|---|---|---|
| \`7 / 2\` | \`3.5\` | \`/\` luôn ra float |
| \`-7 // 2\` | \`-4\` | làm tròn xuống, không cắt về 0 |
| \`-7 % 2\` | \`1\` | dấu theo số chia |
| \`0.1 + 0.2 == 0.3\` | \`False\` | sai số nhị phân |
| \`round(2.5)\` | \`2\` | làm tròn về số chẵn |
| \`int(-3.7)\` | \`-3\` | cắt về 0 |
| \`math.floor(-3.7)\` | \`-4\` | làm tròn xuống |
| \`2 ** 3 ** 2\` | \`512\` | \`**\` tính từ phải sang |
`,
},
];
