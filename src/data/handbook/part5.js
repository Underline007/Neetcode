/**
 * CẨM NANG CÚ PHÁP PYTHON — PHẦN E: LÀM VIỆC THẬT
 * File & JSON · thư viện chuẩn · regex · ngày giờ · đọc lỗi · PEP 8 · từ JS sang Python.
 */
export default [
/* ==================================================================== */
{
  id: 'hb-file-json',
  part: 'E',
  title: 'File, đường dẫn & JSON',
  icon: '📄',
  minutes: 6,
  body: `
## 1. Luôn dùng \`with\`

\`\`\`python
with open("a.txt", encoding="utf-8") as f:
    noi_dung = f.read()
# file tự đóng ở đây, kể cả khi có lỗi
\`\`\`

> ⚠️ **Luôn truyền \`encoding="utf-8"\`.** Mặc định phụ thuộc hệ điều hành, và trên Windows nó
> thường không phải UTF-8 — tiếng Việt sẽ hỏng hoặc ném \`UnicodeDecodeError\`.

## 2. Các chế độ mở

| Chế độ | Nghĩa |
|---|---|
| \`"r"\` | đọc (mặc định), lỗi nếu file không có |
| \`"w"\` | ghi — **xoá sạch nội dung cũ** |
| \`"a"\` | ghi nối vào cuối |
| \`"x"\` | tạo mới, lỗi nếu đã tồn tại |
| \`"rb"\` / \`"wb"\` | nhị phân (ảnh, file nén) — không dùng \`encoding\` |

## 3. Bốn cách đọc

\`\`\`python
f.read()             # cả file thành MỘT chuỗi
f.readline()         # một dòng
f.readlines()        # list các dòng (còn ký tự \\n)

for dong in f:       # ✅ duyệt từng dòng — không tốn bộ nhớ, file lớn cỡ nào cũng được
    print(dong.rstrip("\\n"))
\`\`\`

Cách cuối là mặc định nên dùng: file 10 GB cũng chạy được vì mỗi lúc chỉ giữ một dòng.

## 4. Ghi file

\`\`\`python
with open("ra.txt", "w", encoding="utf-8") as f:
    f.write("một dòng\\n")        # write KHÔNG tự xuống dòng
    f.writelines(["a\\n", "b\\n"]) # cũng không tự thêm
    print("qua print", file=f)    # cách này thì có xuống dòng
\`\`\`

## 5. \`pathlib\` — cách xử lý đường dẫn hiện đại

\`\`\`python
from pathlib import Path

p = Path("du_lieu") / "2024" / "a.txt"   # dấu / ghép đường dẫn, đúng trên mọi hệ điều hành
p.name          # 'a.txt'
p.stem          # 'a'
p.suffix        # '.txt'
p.parent        # Path('du_lieu/2024')
p.exists()
p.is_file(), p.is_dir()

p.read_text(encoding="utf-8")         # đọc cả file, một dòng lệnh
p.write_text("nội dung", encoding="utf-8")

Path("thu_muc").mkdir(parents=True, exist_ok=True)   # tạo cả cây thư mục
list(Path(".").glob("*.py"))          # mọi file .py ở đây
list(Path(".").rglob("*.py"))         # đệ quy xuống mọi thư mục con
p.unlink(missing_ok=True)             # xoá file
\`\`\`

\`pathlib\` gọn và an toàn hơn nối chuỗi \`"a/" + ten\`, nhất là khi code phải chạy cả trên Windows.

## 6. JSON

\`\`\`python
import json

# chuỗi ↔ object
d = json.loads('{"a": 1}')                 # chuỗi -> dict
s = json.dumps(d, ensure_ascii=False, indent=2)   # dict -> chuỗi

# file ↔ object   (chú ý: KHÔNG có chữ s)
with open("a.json", encoding="utf-8") as f:
    d = json.load(f)
with open("a.json", "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
\`\`\`

> ⚠️ **\`ensure_ascii=False\`** là bắt buộc với tiếng Việt — không có nó, "chào" bị ghi thành
> \`"ch\\u00e0o"\`, vẫn đúng nhưng không đọc được bằng mắt.

Bảng chuyển kiểu:

| Python | JSON |
|---|---|
| \`dict\` | object |
| \`list\`, \`tuple\` | array (tuple **thành** array, không quay lại được) |
| \`str\` | string |
| \`int\`, \`float\` | number |
| \`True\` / \`False\` | \`true\` / \`false\` |
| \`None\` | \`null\` |

Kiểu JSON không biết (như \`datetime\`) thì phải tự chuyển:

\`\`\`python
json.dumps(d, default=str)     # cách nhanh: cái gì lạ thì đổi sang chuỗi
\`\`\`

## 7. CSV

\`\`\`python
import csv

with open("a.csv", newline="", encoding="utf-8") as f:
    for hang in csv.DictReader(f):      # mỗi hàng là một dict theo tên cột
        print(hang["ten"])

with open("ra.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["ten", "tuoi"])
    w.writeheader()
    w.writerow({"ten": "Minh", "tuoi": 25})
\`\`\`

> ⚠️ \`newline=""\` là bắt buộc — thiếu nó, trên Windows file sẽ có dòng trống xen kẽ.

## 8. Bẫy hay gặp

| Triệu chứng | Nguyên nhân |
|---|---|
| File bị xoá sạch | mở bằng \`"w"\` thay vì \`"a"\` |
| \`UnicodeDecodeError\` | thiếu \`encoding="utf-8"\`, hoặc file thật ra là nhị phân |
| Dòng đọc ra thừa \`\\n\` | dùng \`.rstrip("\\n")\` |
| CSV có dòng trống xen kẽ | thiếu \`newline=""\` |
| Tiếng Việt ra \`\\u00e0\` | thiếu \`ensure_ascii=False\` |
| File không đóng | quên \`with\` |
`,
},
/* ==================================================================== */
{
  id: 'hb-stdlib',
  part: 'E',
  title: 'Thư viện chuẩn hay dùng',
  icon: '🧰',
  minutes: 6,
  body: `
Python đi kèm rất nhiều thứ dùng được ngay, không phải cài gì. Đây là những cái đáng thuộc.

## 1. \`collections\`

\`\`\`python
from collections import Counter, defaultdict, deque, namedtuple

Counter("abracadabra").most_common(2)   # [('a', 5), ('b', 2)]
defaultdict(list)                       # tự tạo list rỗng cho khoá mới
deque([1,2,3])                          # thêm/lấy hai đầu đều O(1) — dùng cho BFS
deque(maxlen=5)                         # tự đẩy phần tử cũ ra khi đầy
namedtuple("Diem", "x y")               # tuple có tên trường
\`\`\`

## 2. \`itertools\`

\`\`\`python
from itertools import chain, islice, accumulate, groupby, combinations, product, pairwise

list(chain([1,2], [3,4]))          # [1,2,3,4]
list(accumulate([1,2,3,4]))        # [1,3,6,10] — tổng tiền tố
list(combinations("abc", 2))       # [('a','b'), ('a','c'), ('b','c')]
list(product([0,1], repeat=2))     # [(0,0),(0,1),(1,0),(1,1)]
list(pairwise([1,2,3]))            # [(1,2), (2,3)] — Python 3.10+
\`\`\`

## 3. \`functools\`

\`\`\`python
from functools import cache, lru_cache, reduce, partial, wraps

@cache                              # ghi nhớ kết quả hàm
def fib(n): ...

reduce(lambda a,b: a*b, [1,2,3,4])  # 24 — thường comprehension dễ đọc hơn
nhan_doi = partial(nhan, 2)         # cố định sẵn tham số đầu
\`\`\`

## 4. \`os\` & \`sys\`

\`\`\`python
import os, sys

os.environ.get("API_KEY", "mặc định")   # biến môi trường
os.getcwd()                             # thư mục hiện tại
os.cpu_count()

sys.argv                                # tham số dòng lệnh: ['script.py', 'a', 'b']
sys.exit(1)                             # thoát với mã lỗi
sys.version_info >= (3, 10)             # kiểm tra phiên bản Python
\`\`\`

Xử lý tham số dòng lệnh nghiêm túc thì dùng \`argparse\`:

\`\`\`python
import argparse
p = argparse.ArgumentParser(description="Công cụ của tôi")
p.add_argument("dau_vao")
p.add_argument("--so-luong", type=int, default=10)
p.add_argument("--chi-tiet", action="store_true")
args = p.parse_args()
print(args.dau_vao, args.so_luong, args.chi_tiet)
\`\`\`

\`argparse\` tự sinh cả \`--help\` — không phải viết tay.

## 5. \`logging\` — thay cho \`print\` khi làm thật

\`\`\`python
import logging
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")

log = logging.getLogger(__name__)
log.debug("chi tiết gỡ lỗi")
log.info("chạy bình thường")
log.warning("có gì đó lạ")
log.error("hỏng rồi")
log.exception("hỏng — kèm cả traceback")   # chỉ gọi bên trong except
\`\`\`

Hơn \`print\` ở chỗ: bật/tắt theo mức, có mốc thời gian, ghi ra file được, và không phải đi xoá
từng dòng khi xong việc.

## 6. \`time\` & đo hiệu năng

\`\`\`python
import time
time.time()              # mốc thời gian thực (giây từ 1970)
time.perf_counter()      # đồng hồ chính xác — dùng để ĐO thời gian chạy
time.sleep(0.5)

t0 = time.perf_counter()
lam_gi_do()
print(f"{time.perf_counter() - t0:.3f}s")
\`\`\`

So sánh nhiều cách viết:

\`\`\`python
import timeit
timeit.timeit('"-".join(str(i) for i in range(100))', number=10000)
\`\`\`

## 7. Vài module khác đáng biết

\`\`\`python
import hashlib;   hashlib.sha256(b"abc").hexdigest()
import base64;    base64.b64encode(b"abc")
import uuid;      uuid.uuid4()                 # id ngẫu nhiên duy nhất
import textwrap;  textwrap.dedent(chuoi)       # bỏ thụt lề thừa
import pprint;    pprint.pprint(du_lieu)       # in cấu trúc lồng nhau cho dễ đọc
import shutil;    shutil.copy(a, b)            # sao chép file/thư mục
import subprocess; subprocess.run(["ls", "-l"], capture_output=True, text=True)
\`\`\`

## 8. Mẹo tìm nhanh

\`\`\`python
help(collections.deque)      # đọc tài liệu ngay trong REPL
dir(str)                     # mọi phương thức của str
import inspect; inspect.getsource(ham)   # xem mã nguồn của một hàm
\`\`\`
`,
},
/* ==================================================================== */
{
  id: 'hb-regex',
  part: 'E',
  title: 'Biểu thức chính quy (regex)',
  icon: '🔍',
  minutes: 6,
  body: `
## 1. Năm hàm cần biết

\`\`\`python
import re

re.search(mau, s)       # tìm ở BẤT KỲ đâu -> Match hoặc None
re.match(mau, s)        # chỉ khớp từ ĐẦU chuỗi
re.fullmatch(mau, s)    # phải khớp TOÀN BỘ chuỗi
re.findall(mau, s)      # list mọi chỗ khớp
re.finditer(mau, s)     # iterator các Match (có vị trí)
re.sub(mau, thay, s)    # thay thế
re.split(mau, s)        # cắt theo mẫu
\`\`\`

> ⚠️ \`re.match\` **không** phải "kiểm tra chuỗi có khớp không" — nó chỉ neo ở đầu.
> Muốn kiểm tra cả chuỗi thì dùng \`re.fullmatch\`.

## 2. Luôn dùng raw string

\`\`\`python
re.search(r"\\d+", s)     # ✅ r"..." — dấu \\ giữ nguyên
re.search("\\d+", s)      # ⚠️ dễ sai, vì \\ còn bị Python xử lý một lần nữa
\`\`\`

## 3. Bảng ký hiệu

| Mẫu | Khớp |
|---|---|
| \`.\` | một ký tự bất kỳ (trừ xuống dòng) |
| \`\\d\` \`\\D\` | chữ số / không phải chữ số |
| \`\\w\` \`\\W\` | chữ-số-gạch dưới / ngược lại |
| \`\\s\` \`\\S\` | khoảng trắng / ngược lại |
| \`[abc]\` | một trong a, b, c |
| \`[^abc]\` | KHÔNG phải a, b, c |
| \`[a-z0-9]\` | khoảng |
| \`^\` \`$\` | đầu / cuối chuỗi |
| \`\\b\` | biên của từ |
| \`a\\|b\` | a hoặc b |

Số lần lặp:

| Mẫu | Số lần |
|---|---|
| \`*\` | 0 trở lên |
| \`+\` | 1 trở lên |
| \`?\` | 0 hoặc 1 |
| \`{3}\` | đúng 3 |
| \`{2,5}\` | từ 2 tới 5 |
| \`{2,}\` | từ 2 trở lên |

## 4. Tham lam và không tham lam

\`\`\`python
re.findall(r"<.*>", "<a><b>")     # ['<a><b>']   ← tham lam, lấy dài nhất
re.findall(r"<.*?>", "<a><b>")    # ['<a>', '<b>'] ← thêm ? để lấy ngắn nhất
\`\`\`

Đây là nguyên nhân số một của "regex khớp nhiều hơn mong đợi".

## 5. Nhóm

\`\`\`python
m = re.search(r"(\\d{4})-(\\d{2})-(\\d{2})", "ngày 2024-01-15")
m.group(0)      # '2024-01-15'  — toàn bộ chỗ khớp
m.group(1)      # '2024'
m.groups()      # ('2024', '01', '15')
m.start(), m.end()

# nhóm có tên — dễ đọc hơn nhiều
m = re.search(r"(?P<nam>\\d{4})-(?P<thang>\\d{2})", s)
m.group("nam")
m.groupdict()   # {'nam': '2024', 'thang': '01'}

# nhóm không bắt giữ — chỉ để gom, không tính vào groups()
re.search(r"(?:abc)+", s)
\`\`\`

## 6. Thay thế

\`\`\`python
re.sub(r"\\s+", " ", s)                    # gộp mọi khoảng trắng thành một
re.sub(r"(\\d{4})-(\\d{2})", r"\\2/\\1", s)  # đảo vị trí bằng \\1 \\2
re.sub(r"\\d+", lambda m: str(int(m.group()) * 2), s)   # thay bằng hàm
\`\`\`

## 7. Cờ

\`\`\`python
re.IGNORECASE  (re.I)    # không phân biệt hoa thường
re.MULTILINE   (re.M)    # ^ và $ khớp từng DÒNG
re.DOTALL      (re.S)    # . khớp cả ký tự xuống dòng
re.VERBOSE     (re.X)    # cho phép xuống dòng và comment trong mẫu

re.search(r"abc", s, re.I | re.M)
\`\`\`

\`re.VERBOSE\` khiến regex dài đọc được như code:

\`\`\`python
mau = re.compile(r"""
    (\\d{4})   # năm
    -
    (\\d{2})   # tháng
""", re.VERBOSE)
\`\`\`

## 8. Biên dịch trước nếu dùng nhiều lần

\`\`\`python
MAU = re.compile(r"\\d+")      # biên dịch một lần, ở cấp module
for dong in f:
    MAU.findall(dong)
\`\`\`

## 9. Khi nào ĐỪNG dùng regex

- Tách chuỗi đơn giản → \`split()\` nhanh và rõ hơn
- Kiểm tra đầu/cuối → \`startswith()\` / \`endswith()\`
- Phân tích HTML/XML/JSON → dùng thư viện chuyên dụng, regex sẽ sai ở các trường hợp lồng nhau

> Regex viết thì nhanh, đọc lại thì chậm. Regex nào dài quá một dòng thì nên có comment
> giải thích nó khớp cái gì.
`,
},
/* ==================================================================== */
{
  id: 'hb-datetime',
  part: 'E',
  title: 'Ngày giờ',
  icon: '📅',
  minutes: 5,
  body: `
## 1. Bốn lớp cơ bản

\`\`\`python
from datetime import datetime, date, time, timedelta, timezone

date(2024, 1, 15)                # chỉ ngày
time(14, 30)                     # chỉ giờ
datetime(2024, 1, 15, 14, 30)    # cả hai
timedelta(days=7)                # khoảng thời gian
\`\`\`

## 2. Lấy thời điểm hiện tại

\`\`\`python
datetime.now()                   # giờ máy, KHÔNG kèm múi giờ
datetime.now(timezone.utc)       # UTC, có kèm múi giờ
date.today()
\`\`\`

## 3. Chuỗi ↔ ngày giờ

\`\`\`python
d = datetime.strptime("15/01/2024", "%d/%m/%Y")   # chuỗi -> datetime  (p = parse)
s = d.strftime("%d/%m/%Y %H:%M")                  # datetime -> chuỗi  (f = format)

datetime.fromisoformat("2024-01-15T14:30:00")     # đọc chuẩn ISO
d.isoformat()                                     # '2024-01-15T14:30:00'
\`\`\`

Mẹo nhớ: **p**arse là đọc vào, **f**ormat là in ra.

Bảng mã định dạng:

| Mã | Nghĩa | Ví dụ |
|---|---|---|
| \`%Y\` \`%y\` | năm 4 số / 2 số | 2024 / 24 |
| \`%m\` | tháng | 01 |
| \`%d\` | ngày | 15 |
| \`%H\` \`%M\` \`%S\` | giờ 24h / phút / giây | 14 30 00 |
| \`%I\` \`%p\` | giờ 12h / SA-CH | 02 PM |
| \`%A\` \`%a\` | thứ đầy đủ / rút gọn | Monday / Mon |
| \`%B\` \`%b\` | tháng bằng chữ | January / Jan |
| \`%j\` | ngày thứ mấy trong năm | 015 |

## 4. Cộng trừ thời gian

\`\`\`python
hom_nay = date.today()
tuan_sau = hom_nay + timedelta(days=7)
hom_qua  = hom_nay - timedelta(days=1)

khoang = ngay_b - ngay_a         # ra timedelta
khoang.days                      # số ngày
khoang.total_seconds()           # tổng số giây
\`\`\`

> ⚠️ \`timedelta\` **không có** tham số \`months\` hay \`years\` — vì tháng dài ngắn khác nhau.
> Cần cộng theo tháng thì dùng thư viện ngoài \`dateutil\`:
> \`\`\`python
> from dateutil.relativedelta import relativedelta
> ngay + relativedelta(months=1)
> \`\`\`

## 5. Múi giờ

\`\`\`python
from zoneinfo import ZoneInfo        # Python 3.9+, không cần cài gì

vn = ZoneInfo("Asia/Ho_Chi_Minh")
datetime.now(vn)
d_utc.astimezone(vn)                 # đổi múi giờ
\`\`\`

Quy tắc thực dụng: **lưu trữ bằng UTC, chỉ đổi sang giờ địa phương khi hiển thị.**
Trộn lẫn hai loại là nguồn gốc của lỗi lệch giờ khó tìm.

> ⚠️ Không so sánh được datetime "có múi giờ" với "không múi giờ" — ném \`TypeError\`.

## 6. Mốc thời gian Unix

\`\`\`python
d.timestamp()                        # datetime -> số giây
datetime.fromtimestamp(1705300000)   # số giây -> datetime (giờ địa phương)
datetime.fromtimestamp(x, timezone.utc)
\`\`\`

## 7. So sánh & sắp xếp

\`\`\`python
d1 < d2                              # so sánh trực tiếp được
sorted(ds_ngay)
max(ds_ngay)
\`\`\`

## 8. Đo thời gian chạy thì ĐỪNG dùng \`datetime\`

\`\`\`python
import time
t0 = time.perf_counter()
lam_gi_do()
print(time.perf_counter() - t0)
\`\`\`

\`datetime.now()\` có thể nhảy lùi khi máy đồng bộ giờ; \`perf_counter()\` thì không bao giờ.
`,
},
/* ==================================================================== */
{
  id: 'hb-doc-loi',
  part: 'E',
  title: 'Đọc thông báo lỗi & gỡ lỗi',
  icon: '🧭',
  minutes: 6,
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

Chữ *"most recent call last"* nghĩa đúng như vậy: chỗ gần lỗi nhất nằm dưới cùng.

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
| \`ModuleNotFoundError\` | không có thư viện | chưa \`pip install\`, hoặc quên bật venv |
| \`FileNotFoundError\` | không thấy file | sai đường dẫn tương đối |

## 3. Lỗi báo ở dòng N nhưng sai ở dòng N−1

Với \`SyntaxError\`, chỗ báo thường là nơi Python **phát hiện** vấn đề, còn ký tự thiếu nằm
ở phía trước:

\`\`\`python
ds = [1, 2, 3       # ← ngoặc thiếu ở đây
print("hi")         # ← nhưng lỗi báo ở dòng này
\`\`\`

Gặp \`SyntaxError\` mà nhìn dòng đó không thấy gì sai → soi dòng ngay trên.

## 4. Bốn cách gỡ lỗi, từ rẻ tới đắt

**(a) \`print\` có tên biến**

\`\`\`python
print(f"{x=}, {type(x)=}, {len(ds)=}")
\`\`\`

**(b) \`assert\` để dừng sớm đúng chỗ sai**

\`\`\`python
assert len(ds) > 0, f"danh sách rỗng ở bước {i}"
\`\`\`

**(c) \`breakpoint()\` — trình gỡ lỗi có sẵn**

\`\`\`python
breakpoint()      # dừng tại đây, mở pdb
\`\`\`

Trong pdb: \`n\` chạy dòng tiếp, \`s\` bước vào hàm, \`c\` chạy tiếp, \`p x\` in biến, \`l\` xem code, \`q\` thoát.

**(d) \`logging\`** khi cần theo dõi lâu dài, chạy thật.

## 5. Thu hẹp vùng nghi ngờ

Khi không biết lỗi ở đâu, đừng đọc lại toàn bộ code. Hãy **chia đôi**:

1. Đặt một \`print\` ở giữa chương trình
2. Chạy — nó in ra không?
3. Có → lỗi nằm ở nửa sau. Không → nửa trước
4. Lặp lại với nửa đang nghi

Vài lần chia đôi là khoanh được vùng nhỏ, kể cả với file dài.

## 6. Câu hỏi nên tự hỏi khi bí

- Giá trị thật sự là gì? (in ra, đừng đoán)
- Kiểu thật sự là gì? (\`type(x)\` — nhiều lỗi là \`str\` giả dạng số)
- Đoạn này **lần cuối chạy đúng** là khi nào? Từ đó tới giờ đổi gì?
- Rút gọn được thành 5 dòng vẫn lỗi không? (thu nhỏ ví dụ thường tự lộ ra nguyên nhân)

## 7. Nguyên tắc

> Khi bí, đừng sửa mò. Hãy **in ra giá trị ngay trước dòng lỗi** và tự hỏi:
> *"nó khác gì so với thứ mình nghĩ nó phải là?"*
>
> Sửa mò có thể làm code chạy được mà bạn vẫn không biết vì sao — lần sau vẫn sẽ mắc lại.
`,
},
/* ==================================================================== */
{
  id: 'hb-pep8',
  part: 'E',
  title: 'PEP 8 & quy ước đặt tên',
  icon: '📐',
  minutes: 4,
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
| Không dùng | \`l\`, \`O\`, \`I\` một mình | dễ nhầm với 1 và 0 |

> Đây là khác biệt rõ nhất với JavaScript (\`camelCase\`). Viết \`soLuong\` trong Python
> là dấu hiệu người viết đến từ ngôn ngữ khác.

Tên tốt quan trọng hơn tên ngắn: \`ds_nguoi_dung_hoat_dong\` rõ hơn \`dnhd\`.

## 2. Khoảng trắng

\`\`\`python
x = 1                     # ✅ có dấu cách quanh =
def f(a, b=1):            # ✅ KHÔNG có dấu cách quanh = của tham số mặc định
y = a + b * c             # ✅ ưu tiên thấp thì cách thoáng hơn
ds[1:3]                   # ✅ không cách trong ngoặc vuông
f(a, b)                   # ✅ sau dấu phẩy có cách, trước thì không
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

Mỗi nhóm cách nhau một dòng trống, trong nhóm thì xếp theo bảng chữ cái.

## 4. Vài quy ước nội dung

\`\`\`python
if x is None:              # ✅ không phải == None
if not ds:                 # ✅ không phải len(ds) == 0
if isinstance(x, int):     # ✅ không phải type(x) == int

def f():                   # ✅ dùng def
    ...
f = lambda: ...            # ❌ đã đặt tên thì dùng def
\`\`\`

## 5. Để máy làm thay

\`\`\`bash
pip install black ruff
black .        # tự định dạng toàn bộ code
ruff check .   # bắt lỗi và chỗ không theo chuẩn
ruff check --fix .
\`\`\`

Dùng \`black\` thì khỏi phải tranh luận về định dạng — nó quyết định hết, và cả nhóm ra cùng
một kết quả. Đây là cách rẻ nhất để mọi file trong dự án trông như một người viết.

## 6. Zen of Python

Gõ \`import this\` trong REPL để xem đủ. Ba câu đáng nhớ nhất:

> Đơn giản tốt hơn phức tạp.
>
> Dễ đọc là quan trọng.
>
> Nên có một — và tốt nhất là chỉ một — cách hiển nhiên để làm một việc.

Khi phân vân giữa hai cách viết, chọn cái mà **người đọc sau bạn sáu tháng** hiểu nhanh hơn.
`,
},
/* ==================================================================== */
{
  id: 'hb-js-sang-python',
  part: 'E',
  title: 'Từ JavaScript sang Python',
  icon: '🔀',
  minutes: 6,
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
| \`try/catch\` | \`try/except\` |
| \`throw\` | \`raise\` |
| \`class A extends B\` | \`class A(B):\` |
| \`import x from "y"\` | \`from y import x\` |

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
| \`arr.reduce(...)\` | \`sum()\` / \`functools.reduce\` |
| \`arr.includes(x)\` | \`x in arr\` |
| \`arr.indexOf(x)\` | \`arr.index(x)\` (ném lỗi nếu thiếu) |
| \`new Map()\` | \`{}\` hoặc \`defaultdict\` |
| \`m.get(k)\` | \`d[k]\` (lỗi nếu thiếu) hoặc \`d.get(k)\` |
| \`m.has(k)\` | \`k in d\` |
| \`m.size\` | \`len(d)\` |
| \`Object.entries(o)\` | \`d.items()\` |
| \`Object.keys(o)\` | \`d.keys()\` |
| \`arr.join("")\` | \`"".join(arr)\` |
| \`JSON.parse\` / \`stringify\` | \`json.loads\` / \`json.dumps\` |
| \`Math.floor(a/b)\` | \`a // b\` |
| \`String(x)\` / \`Number(x)\` | \`str(x)\` / \`int(x)\` |

## 3. Bốn khác biệt gây lỗi nhiều nhất

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

**(d) Tham số mặc định biến đổi được.**

\`\`\`javascript
function f(ds = []) { ... }   // mỗi lần gọi là một mảng MỚI
\`\`\`
\`\`\`python
def f(ds=[]):                 # ❌ CÙNG một list qua mọi lần gọi
def f(ds=None):               # ✅ cách đúng
\`\`\`

## 4. Thứ Python có mà JS không

- Cắt lát \`a[1:5:2]\` và \`a[::-1]\`
- Comprehension bốn loại
- Gán bung \`a, *b = ds\` và hoán đổi \`a, b = b, a\`
- So sánh nối \`0 <= i < n\`
- Số nguyên **không giới hạn độ lớn**
- \`else\` của vòng lặp
- Nạp chồng toán tử (\`__add__\`, \`__eq__\`...)
- \`with\` để quản lý tài nguyên
- Tham số bắt buộc truyền theo tên (\`*\` trong danh sách tham số)

## 5. Thứ JS có mà Python không

- \`++\` / \`--\`
- \`switch\` cổ điển (có \`match\` từ 3.10, nhưng khác)
- Hàm vô danh nhiều dòng (lambda chỉ một biểu thức)
- \`break\` nhiều tầng có nhãn
- Bất đồng bộ mặc định — Python đồng bộ trừ khi dùng \`async\`/\`await\`

## 6. Mẹo chuyển ngôn ngữ

Khi bí, hãy tự hỏi **"người Python sẽ viết thế nào?"** thay vì dịch từng dòng JavaScript.
Ví dụ, thay vì dịch một vòng \`for\` có chỉ số, hãy hỏi: *ở đây thật sự cần chỉ số không, hay
chỉ cần duyệt giá trị?* Phần lớn trường hợp là không cần.
`,
},
];
