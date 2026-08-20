/**
 * CẨM NANG CÚ PHÁP PYTHON — phần nội dung viết riêng cho việc ĐỌC TRÊN ĐIỆN THOẠI.
 *
 * Khác với 15 module trong `data/python/` (dạy sâu từng chủ đề, kèm bài tập chạy code),
 * các chương ở đây được viết để:
 *   - đọc một mạch trong 3–6 phút, không cần bàn phím
 *   - nặng về BẢNG TRA và VÍ DỤ NGẮN, nhẹ về lý luận dài
 *   - trả lời đúng câu "cú pháp này viết thế nào" khi đang xếp hàng hay ngồi xe buýt
 *
 * Mỗi chương: { id, title, icon, minutes, body }  — body là Markdown.
 */

export const HANDBOOK = [
/* ==================================================================== */
{
  id: 'hb-chay-python',
  title: 'Chạy Python lần đầu',
  icon: '▶️',
  minutes: 3,
  body: `
Python có hai cách chạy, và người mới hay lẫn chúng.

## 1. REPL — gõ tới đâu chạy tới đó

Mở terminal, gõ \`python3\` rồi Enter. Bạn thấy dấu nhắc \`>>>\`:

\`\`\`python
>>> 2 + 3
5
>>> ten = "Minh"
>>> f"Chào {ten}"
'Chào Minh'
\`\`\`

REPL **tự in ra giá trị** của biểu thức, nên không cần \`print()\`. Đây là chỗ tốt nhất
để thử một dòng cú pháp bạn không chắc. Thoát bằng \`exit()\` hoặc Ctrl+D.

## 2. Chạy một file

Lưu file \`bai1.py\`, rồi:

\`\`\`bash
python3 bai1.py
\`\`\`

Trong file thì **không tự in gì cả** — muốn thấy kết quả phải gọi \`print()\`.
Đây là khác biệt làm người mới bối rối nhất khi chuyển từ REPL sang file.

## 3. Ba dòng đầu tiên nên biết

\`\`\`python
# Đây là comment — Python không có comment khối thật sự
print("Xin chào")          # in ra màn hình
ten = input("Tên bạn: ")   # đọc một dòng từ bàn phím, LUÔN trả về chuỗi
\`\`\`

> ⚠️ \`input()\` luôn trả về **chuỗi**. Muốn số thì phải ép: \`tuoi = int(input("Tuổi: "))\`.
> Quên bước này là gặp lỗi \`TypeError\` khi đem cộng.

## 4. Môi trường ảo (venv) — làm sớm cho đỡ khổ

Mỗi dự án nên có thư viện riêng, không cài chung vào máy:

\`\`\`bash
python3 -m venv .venv          # tạo môi trường ảo trong thư mục .venv
source .venv/bin/activate      # bật (Windows: .venv\\Scripts\\activate)
pip install requests           # cài thư viện — chỉ nằm trong dự án này
deactivate                     # tắt
\`\`\`

Dấu hiệu đã bật: dấu nhắc terminal có tiền tố \`(.venv)\`.
`,
},
/* ==================================================================== */
{
  id: 'hb-bien-kieu',
  title: 'Biến, kiểu và phép gán',
  icon: '📦',
  minutes: 4,
  body: `
## 1. Không có từ khoá khai báo

\`\`\`python
x = 5          # không let/const/var, không dấu chấm phẩy
x = "chữ"      # gán lại kiểu khác cũng được — Python là kiểu động
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

## 3. Gán nhiều biến cùng lúc

\`\`\`python
a, b = 1, 2
a, b = b, a                 # hoán đổi, không cần biến tạm
dau, *giua, cuoi = [1,2,3,4,5]   # dau=1, giua=[2,3,4], cuoi=5
x = y = 0                   # cùng một giá trị
\`\`\`

## 4. Bẫy lớn nhất: gán KHÔNG phải sao chép

\`\`\`python
a = [1, 2, 3]
b = a          # b và a trỏ tới CÙNG một list
b.append(4)
print(a)       # [1, 2, 3, 4]  ← a cũng đổi!

c = a[:]       # hoặc list(a) — sao chép nông, giờ mới là list khác
\`\`\`

Với kiểu bất biến (\`int\`, \`str\`, \`tuple\`) thì không có vấn đề này, vì không sửa tại chỗ được.

## 5. Kiểm tra kiểu

\`\`\`python
type(x)                    # <class 'int'>
isinstance(x, int)         # True — cách nên dùng
isinstance(x, (int, float))  # kiểm nhiều kiểu cùng lúc
\`\`\`

> ⚠️ \`isinstance(True, int)\` trả về \`True\` — trong Python, \`bool\` là **lớp con của \`int\`**.
> \`True + True == 2\`. Nhớ điều này khi đếm số phần tử thoả điều kiện: \`sum(x > 0 for x in arr)\`.
`,
},
/* ==================================================================== */
{
  id: 'hb-toan-tu',
  title: 'Toán tử & thứ tự ưu tiên',
  icon: '➗',
  minutes: 4,
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

## 2. So sánh nối chuỗi được

\`\`\`python
if 0 <= i < len(arr):      # đúng cú pháp Python, đọc như toán học
    ...
\`\`\`

## 3. \`==\` và \`is\` — đừng lẫn

| | Ý nghĩa | Dùng khi |
|---|---|---|
| \`==\` | so sánh **giá trị** | hầu hết mọi lúc |
| \`is\` | so sánh **cùng một object trong bộ nhớ** | chỉ với \`None\`, \`True\`, \`False\` |

\`\`\`python
if x is None:      # ✅ đúng chuẩn
if x == None:      # ⚠️ chạy được nhưng không nên
\`\`\`

## 4. Logic: từ, không phải ký hiệu

\`\`\`python
a and b      # không phải &&
a or b       # không phải ||
not a        # không phải !
\`\`\`

\`and\`/\`or\` trả về **giá trị**, không phải \`True\`/\`False\`:

\`\`\`python
ten = ten_nhap or "Khách"     # rỗng thì dùng mặc định
\`\`\`

## 5. Cái gì được coi là "sai"?

Bảy thứ falsy — nhớ hết là đỡ viết thừa:

\`\`\`python
False, None, 0, 0.0, "", [], {}, set()
\`\`\`

Nên viết \`if not arr:\` thay vì \`if len(arr) == 0:\`.

## 6. Thứ tự ưu tiên (cao → thấp)

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

> Bẫy hay gặp: \`2 ** 3 ** 2\` bằng **512** chứ không phải 64 — \`**\` kết hợp từ **phải sang trái**.
> Còn lại đều trái sang phải. Không chắc thì cứ đóng ngoặc.
`,
},
/* ==================================================================== */
{
  id: 'hb-chuoi',
  title: 'Chuỗi & f-string',
  icon: '🔤',
  minutes: 5,
  body: `
## 1. Bốn cách viết chuỗi

\`\`\`python
'nháy đơn'
"nháy kép"
'''nhiều
dòng'''
r"C:\\thu\\muc"       # raw string — dấu \\ không còn là ký tự thoát
\`\`\`

## 2. f-string — dùng cái này, quên phần còn lại

\`\`\`python
ten, diem = "Minh", 9.456

f"Chào {ten}"                 # Chào Minh
f"{diem:.2f}"                 # 9.46      ← làm tròn 2 chữ số
f"{diem:>10.2f}"              #       9.46 ← căn phải trong 10 ô
f"{1234567:,}"                # 1,234,567  ← dấu phân cách nghìn
f"{0.85:.1%}"                 # 85.0%      ← phần trăm
f"{255:x}"                    # ff         ← hệ 16
f"{5:03d}"                    # 005        ← đệm số 0
f"{diem=}"                    # diem=9.456 ← in cả TÊN BIẾN, cực tiện khi gỡ lỗi
\`\`\`

## 3. Bảng phương thức hay dùng

| Việc | Cú pháp | Ghi nhớ |
|---|---|---|
| Độ dài | \`len(s)\` | hàm, không phải \`.length\` |
| Ký tự thứ i | \`s[i]\`, \`s[-1]\` | chỉ số âm đếm từ cuối |
| Cắt thành list | \`s.split(",")\` | không tham số = cắt theo khoảng trắng |
| Nối list | \`",".join(ds)\` | **dấu nối đứng trước** |
| Bỏ khoảng trắng | \`s.strip()\` | \`.lstrip()\` / \`.rstrip()\` |
| Thay thế | \`s.replace(cũ, mới)\` | trả về chuỗi MỚI |
| Tìm vị trí | \`s.find(x)\` | không có → \`-1\`; \`.index()\` thì ném lỗi |
| Có chứa? | \`x in s\` | ngắn hơn \`.find()\` |
| Hoa/thường | \`s.upper()\`, \`s.lower()\` | |
| Kiểm tra | \`s.isdigit()\`, \`s.isalpha()\` | |
| Đầu/cuối | \`s.startswith(x)\`, \`s.endswith(x)\` | |

## 4. Chuỗi là BẤT BIẾN

\`\`\`python
s = "abc"
s[0] = "x"        # ❌ TypeError
s = "x" + s[1:]   # ✅ tạo chuỗi mới
\`\`\`

Hệ quả về hiệu năng — cộng dồn chuỗi trong vòng lặp là **O(n²)**:

\`\`\`python
# ❌ chậm
kq = ""
for x in ds:
    kq += x

# ✅ nhanh
kq = "".join(ds)
\`\`\`

## 5. Ký tự ↔ mã số

\`\`\`python
ord("a")     # 97
chr(97)      # 'a'
ord("c") - ord("a")   # 2  ← mẹo quy chữ cái về chỉ số 0..25
\`\`\`
`,
},
/* ==================================================================== */
{
  id: 'hb-slicing',
  title: 'Cắt lát (slicing)',
  icon: '✂️',
  minutes: 4,
  body: `
Cắt lát là thứ Python có mà JavaScript không có tương đương gọn. Thuộc nó tiết kiệm rất nhiều dòng code.

## 1. Công thức

\`\`\`python
day[bat_dau : ket_thuc : buoc]
\`\`\`

- \`bat_dau\` — **tính cả**, mặc định \`0\`
- \`ket_thuc\` — **không tính**, mặc định hết dãy
- \`buoc\` — mặc định \`1\`, âm thì đi ngược

## 2. Bảng tra nhanh

Với \`a = [0, 1, 2, 3, 4, 5]\`:

| Viết | Kết quả | Ý nghĩa |
|---|---|---|
| \`a[2:5]\` | \`[2, 3, 4]\` | từ 2 đến trước 5 |
| \`a[:3]\` | \`[0, 1, 2]\` | ba phần tử đầu |
| \`a[3:]\` | \`[3, 4, 5]\` | từ 3 tới hết |
| \`a[-2:]\` | \`[4, 5]\` | hai phần tử cuối |
| \`a[:-1]\` | \`[0,1,2,3,4]\` | bỏ phần tử cuối |
| \`a[::2]\` | \`[0, 2, 4]\` | cách một lấy một |
| \`a[::-1]\` | \`[5,4,3,2,1,0]\` | **đảo ngược** |
| \`a[:]\` | \`[0..5]\` | sao chép nông |

## 3. Không bao giờ lỗi vượt biên

\`\`\`python
a = [1, 2, 3]
a[10]      # ❌ IndexError
a[10:20]   # ✅ []  — cắt lát chỉ trả về rỗng
a[:100]    # ✅ [1, 2, 3]
\`\`\`

Đây là lý do cắt lát an toàn hơn truy cập chỉ số khi xử lý biên.

## 4. Gán vào lát cắt (chỉ với list)

\`\`\`python
a = [0, 1, 2, 3, 4]
a[1:3] = [9, 9, 9]    # [0, 9, 9, 9, 3, 4] — thay đoạn, độ dài đổi được
a[:] = []             # xoá sạch NHƯNG giữ nguyên object gốc
del a[1:3]            # xoá một đoạn
\`\`\`

## 5. Dùng được với mọi dãy

\`\`\`python
"Python"[::-1]        # 'nohtyP'
(1, 2, 3)[:2]         # (1, 2)
\`\`\`

> ⚠️ Không dùng được với \`set\` và \`dict\` — hai kiểu đó không có thứ tự chỉ số.
`,
},
/* ==================================================================== */
{
  id: 'hb-dieu-kien-lap',
  title: 'Điều kiện & vòng lặp',
  icon: '🔁',
  minutes: 4,
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

## 2. Toán tử ba ngôi — đảo thứ tự so với JS

\`\`\`python
trang_thai = "Đạt" if diem >= 5 else "Trượt"
\`\`\`

## 3. Vòng lặp for luôn duyệt trên "một dãy"

\`\`\`python
for x in [1, 2, 3]: ...          # theo giá trị — cách Pythonic nhất
for i in range(5): ...           # 0,1,2,3,4
for i in range(2, 10, 3): ...    # 2,5,8
for i in range(5, 0, -1): ...    # 5,4,3,2,1 — đếm ngược
for i, x in enumerate(ds): ...   # vừa chỉ số vừa giá trị
for k, v in d.items(): ...       # duyệt dict — THIẾU .items() là lỗi
for a, b in zip(ds1, ds2): ...   # ghép cặp, dừng ở dãy ngắn hơn
\`\`\`

> Không có \`for (let i = 0; i < n; i++)\`. Muốn chỉ số thì dùng \`range()\` hoặc \`enumerate()\`.

## 4. while và các lệnh điều khiển

\`\`\`python
while dieu_kien:
    ...
    if xong: break        # thoát hẳn
    if bo_qua: continue   # sang lượt kế
\`\`\`

## 5. \`else\` của vòng lặp — cú pháp riêng của Python

Khối \`else\` chạy khi vòng lặp kết thúc **mà không gặp \`break\`**:

\`\`\`python
for x in ds:
    if x == can_tim:
        print("Thấy rồi")
        break
else:
    print("Không có trong danh sách")   # chỉ chạy khi KHÔNG break
\`\`\`

Rất gọn cho các bài "tìm kiếm, không thấy thì báo".

## 6. \`match\` — có từ Python 3.10

\`\`\`python
match lenh:
    case "them" | "add":
        ...
    case ("xoa", ten):        # tách cấu trúc luôn
        ...
    case _:                   # mặc định
        ...
\`\`\`
`,
},
/* ==================================================================== */
{
  id: 'hb-comprehension',
  title: 'Comprehension',
  icon: '🎯',
  minutes: 4,
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
\`\`\`

## 4. If/else phải đặt TRƯỚC for

Đây là chỗ hay sai nhất:

\`\`\`python
[x if x > 0 else 0 for x in ds]    # ✅ có else → đặt trước for (là toán tử ba ngôi)
[x for x in ds if x > 0]           # ✅ chỉ lọc → đặt sau for
[x if x > 0 for x in ds]           # ❌ SyntaxError
\`\`\`

## 5. Lồng nhau — thứ tự như vòng lặp thường

\`\`\`python
[(i, j) for i in range(2) for j in range(2)]
# đọc như:  for i in range(2):
#               for j in range(2):

# làm phẳng ma trận
[x for hang in ma_tran for x in hang]
\`\`\`

## 6. Khi nào KHÔNG nên dùng

Khi nó dài quá một dòng dễ đọc, hoặc lồng quá hai tầng. Lúc đó vòng lặp thường rõ ràng hơn —
mục tiêu là *dễ đọc*, không phải *ngắn nhất*.
`,
},
/* ==================================================================== */
{
  id: 'hb-ham',
  title: 'Hàm: tham số & trả về',
  icon: '🔧',
  minutes: 5,
  body: `
## 1. Khai báo cơ bản

\`\`\`python
def chao(ten, loi="Xin chào"):     # loi có giá trị mặc định
    return f"{loi}, {ten}!"

chao("Minh")                  # dùng mặc định
chao("Minh", "Hi")            # theo vị trí
chao(ten="Minh", loi="Hi")    # theo tên — rõ ràng hơn
\`\`\`

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
\`\`\`

## 4. Trả về nhiều giá trị

\`\`\`python
def chia(a, b):
    return a // b, a % b     # thật ra là trả về một tuple

thuong, du = chia(7, 2)
\`\`\`

Hàm không có \`return\` thì trả về \`None\` — nguồn gốc của lỗi
\`'NoneType' object is not subscriptable\`.

## 5. Sửa biến của hàm ngoài

\`\`\`python
def dem():
    tong = 0
    def cong(x):
        nonlocal tong     # thiếu dòng này là UnboundLocalError
        tong += x
    ...
\`\`\`

Quy tắc: **chỉ cần GÁN một biến ở đâu đó trong hàm là Python coi nó là biến cục bộ của cả hàm đó.**

## 6. lambda — chỉ cho biểu thức một dòng

\`\`\`python
ds.sort(key=lambda x: x[1])          # sắp theo phần tử thứ 2
sorted(ds, key=len, reverse=True)    # dài nhất trước
\`\`\`
`,
},
/* ==================================================================== */
{
  id: 'hb-js-sang-python',
  title: 'Từ JavaScript sang Python',
  icon: '🔀',
  minutes: 5,
  body: `
Bạn đã biết JavaScript. Chương này chỉ liệt kê những **phản xạ cần đổi** — đọc một lượt là đủ.

## 1. Cú pháp

| JavaScript | Python |
|---|---|
| \`let x = 1;\` | \`x = 1\` |
| \`{ }\` khối lệnh | thụt lề 4 dấu cách |
| \`//\` comment | \`#\` |
| \`null\` / \`undefined\` | \`None\` (chỉ một) |
| \`true\` / \`false\` | \`True\` / \`False\` |
| \`&&\` \`\\|\\|\` \`!\` | \`and\` \`or\` \`not\` |
| \`===\` | \`==\` |
| \`i++\` | \`i += 1\` (không có \`++\`) |
| \`cond ? a : b\` | \`a if cond else b\` |
| \`\` \`chào \${x}\` \`\` | \`f"chào {x}"\` |
| \`function f(a) {}\` | \`def f(a):\` |
| \`(x) => x + 1\` | \`lambda x: x + 1\` |
| \`this\` | \`self\` (**phải khai báo tường minh**) |

## 2. Dữ liệu

| JavaScript | Python |
|---|---|
| \`arr.length\` | \`len(arr)\` |
| \`arr.push(x)\` | \`arr.append(x)\` |
| \`arr.slice(1,3)\` | \`arr[1:3]\` |
| \`arr.at(-1)\` | \`arr[-1]\` |
| \`[...arr].reverse()\` | \`arr[::-1]\` |
| \`arr.map(f)\` | \`[f(x) for x in arr]\` |
| \`arr.filter(f)\` | \`[x for x in arr if f(x)]\` |
| \`arr.includes(x)\` | \`x in arr\` |
| \`new Map()\` | \`{}\` hoặc \`defaultdict\` |
| \`m.get(k)\` | \`d[k]\` (lỗi nếu thiếu) hoặc \`d.get(k)\` |
| \`m.has(k)\` | \`k in d\` |
| \`m.size\` | \`len(d)\` |
| \`Object.entries(o)\` | \`d.items()\` |
| \`arr.join("")\` | \`"".join(arr)\` |

## 3. Ba khác biệt gây lỗi nhiều nhất

**(a) Sắp xếp.** JS mặc định sắp theo chuỗi, Python thì không:

\`\`\`javascript
[10, 9, 1].sort()        // [1, 10, 9]  ← phải truyền (a,b)=>a-b
\`\`\`
\`\`\`python
sorted([10, 9, 1])       # [1, 9, 10]  ← đúng luôn
\`\`\`

**(b) Sắp tại chỗ trả về \`None\`.**

\`\`\`python
arr = arr.sort()    # ❌ arr thành None
arr.sort()          # ✅ sửa tại chỗ
arr2 = sorted(arr)  # ✅ tạo list mới
\`\`\`

**(c) Không tự ép kiểu.**

\`\`\`javascript
"3" + 5      // "35"
\`\`\`
\`\`\`python
"3" + 5      # ❌ TypeError — phải int("3") + 5
\`\`\`

## 4. Thứ Python có mà JS không

- Cắt lát \`a[1:5:2]\`
- Comprehension
- Gán bung \`a, *b = ds\`
- So sánh nối \`0 <= i < n\`
- Số nguyên không giới hạn độ lớn
- \`else\` của vòng lặp
`,
},
/* ==================================================================== */
{
  id: 'hb-doc-loi',
  title: 'Đọc thông báo lỗi',
  icon: '🧭',
  minutes: 5,
  body: `
Biết đọc lỗi tiết kiệm nhiều thời gian hơn biết thêm cú pháp.

## 1. Đọc traceback từ DƯỚI lên

\`\`\`
Traceback (most recent call last):
  File "bai.py", line 12, in <module>
    ket_qua = tinh(so_lieu)
  File "bai.py", line 5, in tinh
    return tong / len(ds)
ZeroDivisionError: division by zero
\`\`\`

- **Dòng cuối** = loại lỗi và mô tả → đọc trước tiên
- **Khối ngay trên nó** = dòng code thực sự gây lỗi (dòng 5)
- Các khối trên nữa = đường đi tới đó

## 2. Bảng lỗi hay gặp

| Lỗi | Nghĩa | Thường do |
|---|---|---|
| \`SyntaxError\` | code chưa đúng cú pháp | thiếu \`:\` cuối \`if\`/\`for\`/\`def\`, ngoặc chưa đóng |
| \`IndentationError\` | thụt lề sai | trộn tab và dấu cách |
| \`NameError\` | chưa có tên này | gõ sai, hoặc quên \`import\` |
| \`TypeError\` | sai kiểu dữ liệu | cộng chuỗi với số, gọi thứ không phải hàm |
| \`ValueError\` | đúng kiểu, sai giá trị | \`int("abc")\` |
| \`IndexError\` | chỉ số vượt biên | vòng lặp chạm \`arr[i+1]\` ở lượt cuối |
| \`KeyError\` | khoá không có trong dict | dùng \`d.get(k, 0)\` hoặc \`defaultdict\` |
| \`AttributeError\` | kiểu này không có thuộc tính đó | dùng nhầm phương thức của kiểu khác |
| \`UnboundLocalError\` | đọc biến cục bộ trước khi gán | thiếu \`nonlocal\`/\`global\` |
| \`ZeroDivisionError\` | chia cho 0 | mẫu số là \`len()\` của dãy rỗng |
| \`RecursionError\` | đệ quy quá sâu | thiếu trường hợp cơ sở |

## 3. Ba mẹo gỡ lỗi không cần công cụ

\`\`\`python
print(f"{x=}, {type(x)=}")     # in cả tên biến lẫn kiểu
assert len(ds) > 0, "danh sách rỗng!"   # dừng sớm ngay chỗ sai
breakpoint()                   # mở trình gỡ lỗi tại dòng này (Python 3.7+)
\`\`\`

## 4. Nguyên tắc

> Khi bí, đừng sửa mò. Hãy **in ra giá trị ngay trước dòng lỗi** và tự hỏi:
> *"nó khác gì so với thứ mình nghĩ nó phải là?"*
`,
},
/* ==================================================================== */
{
  id: 'hb-pep8',
  title: 'PEP 8 & quy ước đặt tên',
  icon: '📐',
  minutes: 3,
  body: `
PEP 8 là chuẩn viết code chính thức của Python. Không bắt buộc, nhưng cả cộng đồng theo — code
không theo chuẩn sẽ bị nhận ra ngay.

## 1. Đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Biến, hàm | \`snake_case\` | \`so_luong\`, \`tinh_tong()\` |
| Hằng số | \`UPPER_CASE\` | \`MAX_SIZE\` |
| Lớp | \`PascalCase\` | \`class NguoiDung:\` |
| Nội bộ | \`_bat_dau_gach_duoi\` | \`_dem\` |
| Tránh trùng từ khoá | \`them_gach_duoi_\` | \`class_\`, \`id_\` |

> Đây là khác biệt rõ nhất với JavaScript (\`camelCase\`). Viết \`soLuong\` trong Python
> là dấu hiệu người viết đến từ ngôn ngữ khác.

## 2. Khoảng trắng

\`\`\`python
x = 1                     # ✅ có dấu cách quanh =
def f(a, b=1):            # ✅ KHÔNG có dấu cách quanh = của tham số mặc định
y = a + b * c             # ✅ ưu tiên thấp thì cách thoáng hơn
ds[1:3]                   # ✅ không cách trong ngoặc vuông
\`\`\`

- Thụt lề: **4 dấu cách**, không dùng tab
- Dòng tối đa ~79–100 ký tự
- Hai dòng trống giữa các hàm cấp cao nhất, một dòng trống giữa các phương thức

## 3. Thứ tự import

\`\`\`python
import os                        # 1. thư viện chuẩn
import sys

import requests                  # 2. thư viện ngoài

from .tien_ich import doc_file   # 3. code trong dự án
\`\`\`

## 4. Để máy làm thay

\`\`\`bash
pip install black ruff
black .        # tự định dạng toàn bộ code
ruff check .   # bắt lỗi và chỗ không theo chuẩn
\`\`\`

Dùng \`black\` thì khỏi phải tranh luận về định dạng — nó quyết định hết.

## 5. Zen of Python

Gõ \`import this\` trong REPL để xem đủ. Ba câu đáng nhớ nhất:

> Đơn giản tốt hơn phức tạp.
>
> Dễ đọc là quan trọng.
>
> Nên có một — và tốt nhất là chỉ một — cách hiển nhiên để làm một việc.
`,
},
];

/** Tổng số phút đọc ước tính của cẩm nang. */
export const HANDBOOK_MINUTES = HANDBOOK.reduce((s, c) => s + c.minutes, 0);
