/**
 * CẨM NANG CÚ PHÁP PYTHON — PHẦN B: DỮ LIỆU
 * Chuỗi · cắt lát · list & tuple · dict · set.
 */
export default [
/* ==================================================================== */
{
  id: 'hb-chuoi',
  part: 'B',
  title: 'Chuỗi & f-string',
  icon: '🔤',
  minutes: 6,
  body: `
## 1. Bốn cách viết chuỗi

\`\`\`python
'nháy đơn'
"nháy kép"
'''nhiều
dòng'''
r"C:\\thu\\muc"       # raw string — dấu \\ không còn là ký tự thoát
\`\`\`

Ký tự thoát hay dùng: \`\\n\` xuống dòng, \`\\t\` tab, \`\\\\\` dấu gạch chéo, \`\\"\` nháy kép.

Hai chuỗi viết cạnh nhau tự nối — tiện khi câu dài:

\`\`\`python
thong_bao = ("Dòng đầu tiên rất dài. "
             "Dòng thứ hai nối tiếp.")
\`\`\`

## 2. f-string — dùng cái này, quên phần còn lại

\`\`\`python
ten, diem = "Minh", 9.456

f"Chào {ten}"                 # Chào Minh
f"{diem:.2f}"                 # 9.46      ← làm tròn 2 chữ số
f"{diem:>10.2f}"              #       9.46 ← căn phải trong 10 ô
f"{ten:<10}|"                 # Minh      | ← căn trái
f"{ten:^10}|"                 #    Minh   | ← căn giữa
f"{ten:*^10}"                 # ***Minh***  ← đệm bằng ký tự khác
f"{1234567:,}"                # 1,234,567  ← dấu phân cách nghìn
f"{1234567:_}"                # 1_234_567
f"{0.85:.1%}"                 # 85.0%      ← phần trăm
f"{255:x}"                    # ff         ← hệ 16
f"{255:08b}"                  # 11111111   ← nhị phân, đệm 8 chữ số
f"{5:03d}"                    # 005        ← đệm số 0
f"{diem=}"                    # diem=9.456 ← in cả TÊN BIẾN, cực tiện khi gỡ lỗi
f"{ten!r}"                    # 'Minh'     ← dùng repr(), thấy cả dấu nháy
\`\`\`

Độ rộng cũng lấy được từ biến:

\`\`\`python
w = 12
f"{ten:>{w}}"                 # căn phải trong w ô
\`\`\`

## 3. Bảng phương thức hay dùng

| Việc | Cú pháp | Ghi nhớ |
|---|---|---|
| Độ dài | \`len(s)\` | hàm, không phải \`.length\` |
| Ký tự thứ i | \`s[i]\`, \`s[-1]\` | chỉ số âm đếm từ cuối |
| Cắt thành list | \`s.split(",")\` | không tham số = cắt theo mọi khoảng trắng |
| Cắt theo dòng | \`s.splitlines()\` | an toàn hơn \`split("\\n")\` |
| Nối list | \`",".join(ds)\` | **dấu nối đứng trước** |
| Bỏ khoảng trắng | \`s.strip()\` | \`.lstrip()\` / \`.rstrip()\` |
| Thay thế | \`s.replace(cũ, mới)\` | trả về chuỗi MỚI |
| Tìm vị trí | \`s.find(x)\` | không có → \`-1\`; \`.index()\` thì ném lỗi |
| Có chứa? | \`x in s\` | ngắn hơn \`.find()\` |
| Đếm | \`s.count(x)\` | số lần xuất hiện |
| Hoa/thường | \`s.upper()\`, \`s.lower()\` | \`.title()\`, \`.capitalize()\` |
| Kiểm tra | \`s.isdigit()\`, \`s.isalpha()\`, \`s.isalnum()\` | |
| Đầu/cuối | \`s.startswith(x)\`, \`s.endswith(x)\` | nhận cả tuple: \`s.endswith((".jpg", ".png"))\` |
| Đệm | \`s.zfill(5)\`, \`s.ljust(10)\`, \`s.rjust(10)\` | |
| Bỏ tiền tố/hậu tố | \`s.removeprefix(x)\`, \`s.removesuffix(x)\` | Python 3.9+ |

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

## 5. \`split()\` — ba hành vi khác nhau

\`\`\`python
"a b  c".split()        # ['a', 'b', 'c']    ← gộp mọi khoảng trắng liên tiếp
"a b  c".split(" ")     # ['a', 'b', '', 'c'] ← tách đúng từng dấu cách, sinh chuỗi rỗng
"a,b,c".split(",", 1)   # ['a', 'b,c']       ← chỉ tách 1 lần
"a,b,c".rsplit(",", 1)  # ['a,b', 'c']       ← tách từ phải
"k=v=w".partition("=")  # ('k', '=', 'v=w')  ← luôn trả 3 phần
\`\`\`

## 6. Ký tự ↔ mã số

\`\`\`python
ord("a")     # 97
chr(97)      # 'a'
ord("c") - ord("a")   # 2  ← mẹo quy chữ cái về chỉ số 0..25
[0] * 26              # bảng đếm 26 chữ cái
\`\`\`

## 7. Tiếng Việt & Unicode

\`\`\`python
len("chào")             # 4 — Python 3 đếm KÝ TỰ, không phải byte
"Chào".lower()          # 'chào' — hoạt động đúng với tiếng Việt
"chào".encode("utf-8")  # b'ch\\xc3\\xa0o' — sang bytes khi ghi file/gửi mạng
b"...".decode("utf-8")  # ngược lại
\`\`\`

Bỏ dấu tiếng Việt:

\`\`\`python
import unicodedata
def bo_dau(s):
    nfd = unicodedata.normalize("NFD", s)
    return "".join(c for c in nfd if unicodedata.category(c) != "Mn")

bo_dau("Tiếng Việt")     # 'Tieng Viet'   (chữ đ phải xử lý riêng)
\`\`\`
`,
},
/* ==================================================================== */
{
  id: 'hb-slicing',
  part: 'B',
  title: 'Cắt lát (slicing)',
  icon: '✂️',
  minutes: 5,
  body: `
Cắt lát là thứ Python có mà JavaScript không có tương đương gọn. Thuộc nó tiết kiệm rất nhiều dòng code.

## 1. Công thức

\`\`\`python
day[bat_dau : ket_thuc : buoc]
\`\`\`

- \`bat_dau\` — **tính cả**, mặc định \`0\`
- \`ket_thuc\` — **không tính**, mặc định hết dãy
- \`buoc\` — mặc định \`1\`, âm thì đi ngược

Mẹo nhớ: \`a[i:j]\` có đúng \`j - i\` phần tử.

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
| \`a[1::2]\` | \`[1, 3, 5]\` | các vị trí lẻ |
| \`a[::-1]\` | \`[5,4,3,2,1,0]\` | **đảo ngược** |
| \`a[::-2]\` | \`[5, 3, 1]\` | đảo ngược, cách một |
| \`a[:]\` | \`[0..5]\` | sao chép nông |

## 3. Không bao giờ lỗi vượt biên

\`\`\`python
a = [1, 2, 3]
a[10]      # ❌ IndexError
a[10:20]   # ✅ []  — cắt lát chỉ trả về rỗng
a[:100]    # ✅ [1, 2, 3]
a[-100:]   # ✅ [1, 2, 3]
\`\`\`

Đây là lý do cắt lát an toàn hơn truy cập chỉ số khi xử lý biên — dùng nó để tránh phải viết
nhánh kiểm tra riêng.

## 4. Bước âm — cẩn thận với cận

Khi \`buoc\` âm, mặc định của \`bat_dau\` và \`ket_thuc\` **đảo lại**:

\`\`\`python
a[::-1]      # [5,4,3,2,1,0]  — cả dãy, ngược
a[4:1:-1]    # [4, 3, 2]      — từ 4 lùi tới TRƯỚC 1
a[:2:-1]     # [5, 4, 3]      — từ cuối lùi tới trước 2
\`\`\`

> ⚠️ \`a[1:4:-1]\` cho \`[]\` — vì đi ngược mà cận trái nhỏ hơn cận phải thì không có gì cả.

## 5. Gán vào lát cắt (chỉ với list)

\`\`\`python
a = [0, 1, 2, 3, 4]
a[1:3] = [9, 9, 9]    # [0, 9, 9, 9, 3, 4] — thay đoạn, độ dài đổi được
a[::2] = [7, 7, 7]    # gán theo bước — độ dài PHẢI khớp
a[:] = []             # xoá sạch NHƯNG giữ nguyên object gốc
del a[1:3]            # xoá một đoạn
\`\`\`

Khác biệt quan trọng:

\`\`\`python
a = [1,2,3]; b = a
a = []        # b vẫn là [1,2,3] — a trỏ sang object mới
a = [1,2,3]; b = a
a[:] = []     # b cũng thành [] — sửa TẠI CHỖ object cũ
\`\`\`

## 6. Dùng được với mọi dãy

\`\`\`python
"Python"[::-1]        # 'nohtyP'
(1, 2, 3)[:2]         # (1, 2)
range(10)[2:5]        # range(2, 5)
\`\`\`

> ⚠️ Không dùng được với \`set\` và \`dict\` — hai kiểu đó không có thứ tự chỉ số.

## 7. Đối tượng \`slice\` — đặt tên cho lát cắt

\`\`\`python
HO_TEN = slice(0, 20)
NGAY_SINH = slice(20, 30)

dong = "Nguyễn Văn Minh     01/01/1990"
dong[HO_TEN].strip()      # 'Nguyễn Văn Minh'
dong[NGAY_SINH].strip()   # '01/01/1990'
\`\`\`

Rất hợp khi đọc file có cột cố định — thay số bí ẩn bằng tên có nghĩa.
`,
},
/* ==================================================================== */
{
  id: 'hb-list-tuple',
  part: 'B',
  title: 'List & tuple',
  icon: '📋',
  minutes: 7,
  body: `
## 1. Tạo list

\`\`\`python
ds = []
ds = [1, 2, 3]
ds = list(range(5))          # [0, 1, 2, 3, 4]
ds = [0] * 5                 # [0, 0, 0, 0, 0]
ds = [x*x for x in range(5)] # [0, 1, 4, 9, 16]
\`\`\`

## 2. Bảng phương thức + chi phí

| Phương thức | Việc | Chi phí |
|---|---|---|
| \`ds.append(x)\` | thêm 1 phần tử vào cuối | O(1) |
| \`ds.extend(khac)\` | nối thêm nhiều phần tử | O(k) |
| \`ds.insert(i, x)\` | chèn tại vị trí i | O(n) |
| \`ds.pop()\` | lấy & xoá cuối | O(1) |
| \`ds.pop(0)\` | lấy & xoá đầu | **O(n)** |
| \`ds.remove(x)\` | xoá theo GIÁ TRỊ (lần đầu) | O(n) |
| \`del ds[i]\` | xoá theo chỉ số | O(n) |
| \`ds.index(x)\` | vị trí đầu tiên | O(n) |
| \`ds.count(x)\` | đếm số lần | O(n) |
| \`ds.sort()\` | sắp xếp TẠI CHỖ | O(n log n) |
| \`ds.reverse()\` | đảo TẠI CHỖ | O(n) |
| \`ds.clear()\` | xoá sạch | O(n) |
| \`ds.copy()\` | sao chép nông | O(n) |
| \`x in ds\` | có chứa? | **O(n)** |

> ⚠️ \`x in ds\` với list là O(n). Trong vòng lặp thì thành O(n²) — đổi sang \`set\` nếu chỉ cần kiểm tra tồn tại.

## 3. Ba hàm sửa-tại-chỗ trả về \`None\`

\`\`\`python
ds = ds.sort()      # ❌ ds thành None
ds.sort()           # ✅ sửa tại chỗ
ds2 = sorted(ds)    # ✅ tạo list mới
\`\`\`

Cùng bẫy đó với \`.reverse()\` và \`.append()\`. Nhớ quy tắc:
**tên là động từ mệnh lệnh (\`sort\`, \`reverse\`) thì sửa tại chỗ; \`sorted\`, \`reversed\` thì trả bản mới.**

## 4. Sắp xếp có điều kiện

\`\`\`python
ds.sort(reverse=True)                    # giảm dần
ds.sort(key=len)                         # theo độ dài
ds.sort(key=lambda x: x[1])              # theo phần tử thứ 2
ds.sort(key=lambda x: (x[0], -x[1]))     # x[0] tăng, rồi x[1] GIẢM
ds.sort(key=str.lower)                   # không phân biệt hoa thường
\`\`\`

Python dùng sắp xếp **ổn định**: hai phần tử bằng khoá thì giữ nguyên thứ tự cũ. Nhờ vậy sắp
nhiều tầng được bằng cách sắp lần lượt từ khoá phụ tới khoá chính.

## 5. Duyệt list đúng cách

\`\`\`python
for x in ds: ...                    # theo giá trị
for i, x in enumerate(ds): ...      # cần cả chỉ số
for i, x in enumerate(ds, 1): ...   # đánh số từ 1
for x in reversed(ds): ...          # ngược
for a, b in zip(ds1, ds2): ...      # song song
\`\`\`

> ⚠️ **Đừng xoá phần tử trong lúc đang duyệt** — chỉ số bị lệch, sót phần tử:
> \`\`\`python
> for x in ds:
>     if x < 0: ds.remove(x)     # ❌ sai kết quả
> ds = [x for x in ds if x >= 0] # ✅ tạo list mới
> ds[:] = [x for x in ds if x >= 0]  # ✅ nếu cần sửa tại chỗ
> \`\`\`

## 6. Bẫy nhân bản list lồng nhau

\`\`\`python
ma_tran = [[0] * 3] * 2     # ❌ hai hàng là CÙNG một list
ma_tran[0][0] = 9
print(ma_tran)              # [[9, 0, 0], [9, 0, 0]]  ← cả hai đổi!

ma_tran = [[0] * 3 for _ in range(2)]   # ✅ mỗi hàng một list riêng
\`\`\`

Quy tắc: \`* n\` chỉ nhân **tham chiếu**. An toàn với số/chuỗi (bất biến), nguy hiểm với list/dict.

## 7. Tuple — list bất biến

\`\`\`python
t = (1, 2, 3)
t = 1, 2, 3            # ngoặc không bắt buộc
t = (1,)               # ⚠️ MỘT phần tử phải có dấu phẩy
t = ()                 # rỗng
\`\`\`

Dùng tuple khi:
- Dữ liệu **không được đổi** (toạ độ, cấu hình)
- Cần làm **khoá dict/set** — list không làm được
- Trả về nhiều giá trị từ hàm (thật ra Python đang trả tuple)

\`\`\`python
d[(r, c)] = "X"        # khoá là toạ độ
seen.add(tuple(ds))    # đưa list vào set qua tuple
\`\`\`

## 8. \`namedtuple\` — tuple có tên trường

\`\`\`python
from collections import namedtuple
Diem = namedtuple("Diem", "x y")
p = Diem(3, 4)
p.x, p.y        # 3, 4
p[0]            # 3  — vẫn dùng được như tuple
\`\`\`

Đọc \`p.x\` dễ hiểu hơn \`p[0]\` rất nhiều. Cần thứ tương tự nhưng sửa được thì dùng
\`@dataclass\` (xem chương Lớp và đối tượng).

## 9. So sánh list/tuple

So sánh theo **thứ tự từ điển** — từng phần tử một:

\`\`\`python
[1, 2, 3] < [1, 2, 4]      # True
[1, 2] < [1, 2, 0]         # True — hết trước thì nhỏ hơn
(1, "b") < (1, "c")        # True
\`\`\`

Nhờ vậy \`sort()\` trên list các tuple hoạt động đúng như mong đợi mà không cần \`key\`.
`,
},
/* ==================================================================== */
{
  id: 'hb-dict',
  part: 'B',
  title: 'Dict — bảng băm',
  icon: '🗂️',
  minutes: 7,
  body: `
## 1. Tạo dict

\`\`\`python
d = {}
d = {"a": 1, "b": 2}
d = dict(a=1, b=2)                  # khoá là tên biến hợp lệ
d = dict([("a", 1), ("b", 2)])      # từ danh sách cặp
d = {k: v for k, v in cap}          # dict comprehension
d = dict.fromkeys("abc", 0)         # {'a': 0, 'b': 0, 'c': 0}
\`\`\`

Từ Python 3.7, dict **giữ nguyên thứ tự chèn**.

## 2. Đọc giá trị — bốn cách, khác nhau ở chỗ thiếu khoá

\`\`\`python
d["x"]                 # ❌ KeyError nếu chưa có
d.get("x")             # None nếu chưa có
d.get("x", 0)          # 0 nếu chưa có — cách hay dùng nhất
d.setdefault("x", [])  # chưa có thì TẠO rồi trả về
\`\`\`

## 3. Bảng phương thức

| Việc | Cú pháp |
|---|---|
| Có khoá? | \`k in d\` (không phải \`d.has_key\`) |
| Số cặp | \`len(d)\` |
| Duyệt khoá | \`for k in d\` |
| Duyệt giá trị | \`for v in d.values()\` |
| Duyệt cặp | \`for k, v in d.items()\` |
| Xoá | \`del d[k]\` hoặc \`d.pop(k, mặc_định)\` |
| Xoá cặp cuối | \`d.popitem()\` |
| Gộp | \`d.update(khác)\` hoặc \`d1 \\| d2\` (3.9+) |
| Xoá sạch | \`d.clear()\` |
| Sao chép nông | \`d.copy()\` |

> ⚠️ \`for k in d\` duyệt **khoá**, không phải cặp. Viết \`for k, v in d:\` là lỗi
> \`ValueError: too many values to unpack\` — thiếu \`.items()\`.

## 4. Ba mẫu đếm & gom nhóm

\`\`\`python
# (a) đếm tần suất
from collections import Counter
cnt = Counter(ds)
cnt.most_common(3)       # 3 phần tử nhiều nhất
cnt["x"]                 # 0 nếu chưa có — không lỗi

# hoặc thủ công
cnt = {}
for x in ds:
    cnt[x] = cnt.get(x, 0) + 1

# (b) gom nhóm
from collections import defaultdict
nhom = defaultdict(list)
for w in tu:
    nhom["".join(sorted(w))].append(w)

# (c) đếm bằng defaultdict
dem = defaultdict(int)
for x in ds:
    dem[x] += 1          # không cần khởi tạo
\`\`\`

> ⚠️ \`defaultdict\` **tạo khoá khi bạn chỉ đọc**: \`d[k]\` với \`k\` chưa có sẽ thêm luôn \`k\` vào dict.
> Muốn chỉ kiểm tra thì dùng \`k in d\`.

## 5. Sắp xếp dict

Dict không "sắp xếp được" — bạn sắp *các cặp* rồi dựng dict mới:

\`\`\`python
sorted(d)                                  # danh sách khoá đã sắp
sorted(d.items(), key=lambda kv: kv[1])    # theo GIÁ TRỊ tăng dần
dict(sorted(d.items(), key=lambda kv: -kv[1]))   # dict mới, giá trị giảm dần
max(d, key=d.get)                          # khoá có giá trị lớn nhất
\`\`\`

## 6. Khoá phải bất biến

\`\`\`python
d[(1, 2)] = "ok"      # ✅ tuple
d["abc"] = "ok"       # ✅ chuỗi
d[[1, 2]] = "lỗi"     # ❌ TypeError: unhashable type: 'list'
\`\`\`

Cần dùng list làm khoá thì đổi sang tuple: \`d[tuple(ds)]\`.

> ⚠️ \`1\`, \`1.0\` và \`True\` **băm giống nhau** — \`{1: 'a', True: 'b'}\` chỉ còn một cặp.

## 7. Dict lồng nhau

\`\`\`python
d = {"a": {"b": {"c": 1}}}
d["a"]["b"]["c"]                       # 1
d.get("a", {}).get("b", {}).get("c")   # an toàn khi thiếu tầng nào đó
\`\`\`

Tự sinh nhiều tầng:

\`\`\`python
from collections import defaultdict
cay = lambda: defaultdict(cay)
d = cay()
d["a"]["b"]["c"] = 1     # không cần tạo tầng nào trước
\`\`\`

## 8. Các biến thể trong \`collections\`

\`\`\`python
from collections import Counter, defaultdict, OrderedDict, ChainMap

Counter("abracadabra")         # đếm ký tự
Counter(a) - Counter(b)        # trừ tần suất
defaultdict(list)              # tự tạo list rỗng
OrderedDict()                  # có move_to_end — lõi của LRU Cache
ChainMap(cau_hinh, mac_dinh)   # tra lần lượt nhiều dict
\`\`\`

## 9. Vì sao dict nhanh

Dict là **bảng băm**: khoá được băm thành một chỉ số, nên tra cứu là O(1) trung bình thay vì
O(n) như quét list. Cái giá là tốn bộ nhớ hơn và **khoá phải băm được** (bất biến).

Đây chính là kỹ thuật biến thuật toán O(n²) thành O(n): thay "đi tìm trong list" bằng "tra trong dict".
`,
},
/* ==================================================================== */
{
  id: 'hb-set',
  part: 'B',
  title: 'Set — tập hợp',
  icon: '🎯',
  minutes: 5,
  body: `
## 1. Tạo set

\`\`\`python
s = set()              # ⚠️ {} là DICT rỗng, không phải set!
s = {1, 2, 3}
s = set([1, 2, 2, 3])  # {1, 2, 3} — tự khử trùng
s = {x*2 for x in ds}  # set comprehension
\`\`\`

## 2. Thao tác cơ bản

| Việc | Cú pháp | Chi phí |
|---|---|---|
| Thêm | \`s.add(x)\` | O(1) |
| Thêm nhiều | \`s.update(ds)\` | O(k) |
| Xoá (không lỗi nếu thiếu) | \`s.discard(x)\` | O(1) |
| Xoá (lỗi nếu thiếu) | \`s.remove(x)\` | O(1) |
| Lấy ra một phần tử bất kỳ | \`s.pop()\` | O(1) |
| Kiểm tra thuộc về | \`x in s\` | O(1) |
| Số phần tử | \`len(s)\` | O(1) |

## 3. Phép toán tập hợp

\`\`\`python
a = {1, 2, 3}
b = {3, 4, 5}

a | b        # {1,2,3,4,5}   hợp        (a.union(b))
a & b        # {3}           giao       (a.intersection(b))
a - b        # {1, 2}        hiệu       (a.difference(b))
a ^ b        # {1,2,4,5}     hiệu đối xứng — có ở đúng một bên

a <= b       # a là tập con của b?      (a.issubset(b))
a >= b       # a là tập cha của b?
a.isdisjoint(b)   # không có phần tử chung?
\`\`\`

Bản sửa tại chỗ: \`a |= b\`, \`a &= b\`, \`a -= b\`.

## 4. Khi nào dùng set thay list

\`\`\`python
# ❌ O(n²)
for x in ds1:
    if x in ds2: ...          # mỗi lần kiểm tra quét cả ds2

# ✅ O(n)
tap2 = set(ds2)
for x in ds1:
    if x in tap2: ...
\`\`\`

Đây là một trong những cách tăng tốc dễ nhất mà người mới hay bỏ qua.

## 5. Khử trùng lặp

\`\`\`python
list(set(ds))                    # nhanh nhất, MẤT thứ tự
list(dict.fromkeys(ds))          # GIỮ thứ tự xuất hiện đầu tiên
\`\`\`

Cách thứ hai đáng nhớ — dict giữ thứ tự chèn nên nó vừa khử trùng vừa giữ thứ tự.

## 6. Phần tử phải bất biến

\`\`\`python
s.add((1, 2))       # ✅ tuple
s.add([1, 2])       # ❌ TypeError: unhashable type: 'list'
\`\`\`

Cần "tập hợp của các tập hợp" thì dùng \`frozenset\` — set bất biến:

\`\`\`python
fs = frozenset([1, 2])
{fs: "ok"}          # dùng làm khoá dict được
\`\`\`

## 7. Set không có thứ tự

\`\`\`python
s = {3, 1, 2}
print(s)            # thứ tự in ra KHÔNG đảm bảo
s[0]                # ❌ TypeError — không có chỉ số
sorted(s)           # [1, 2, 3] — cần thứ tự thì sắp xếp
\`\`\`

Đừng dựa vào thứ tự khi in ra set — nó có thể đổi giữa các lần chạy.

## 8. Ba dấu hiệu nên nghĩ tới set

1. Đề bài hỏi *"có phần tử nào lặp lại không?"* → \`len(set(ds)) != len(ds)\`
2. Cần *"đã gặp chưa"* trong lúc duyệt → \`seen = set()\`
3. Cần *"phần chung / phần riêng"* của hai danh sách → phép toán tập hợp
`,
},
];
