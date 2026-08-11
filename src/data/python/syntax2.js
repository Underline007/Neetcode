/**
 * PHẦN "CÚ PHÁP CẦN BIẾT TRƯỚC" — nhóm 2 (module 6–10).
 * Xem ghi chú ở đầu syntax1.js về nguyên tắc viết.
 */

export default {
/* ==================================================================== */
'py-strings-regex': `
## A. Viết một chuỗi: bốn kiểu dấu nháy

\`\`\`python
a = "xin chào"           # nháy kép
b = 'xin chào'           # nháy đơn — hoàn toàn tương đương, chọn kiểu nào cũng được
c = """nhiều
dòng"""                  # ba nháy: giữ nguyên xuống dòng, dùng viết văn bản dài / docstring
d = r"C:\\Users\\An"      # r = raw string: dấu \\ giữ nguyên, KHÔNG bị hiểu là ký tự đặc biệt
\`\`\`

Mẹo chọn nháy: chuỗi có dấu nháy kép bên trong thì bọc bằng nháy đơn, và ngược lại —
\`'Anh ấy nói "hi"'\` khỏi phải escape.

## B. Ký tự đặc biệt (escape sequence)

Dấu \`\\\` (backslash) báo cho Python biết ký tự sau nó có nghĩa đặc biệt:

| Viết | Nghĩa |
|---|---|
| \`\\n\` | xuống dòng |
| \`\\t\` | dấu tab |
| \`\\\\\` | chính dấu backslash |
| \`\\"\` | dấu nháy kép nằm trong chuỗi bọc bằng nháy kép |

\`\`\`python
print("dòng 1\\ndòng 2")     # in ra 2 dòng
print(r"dòng 1\\ndòng 2")    # in ra nguyên văn: dòng 1\\ndòng 2
\`\`\`

**Vì sao regex luôn dùng \`r"..."\`?** Vì regex cũng dùng dấu \`\\\` cho ký hiệu của nó. Không có \`r\`,
bạn phải viết \`"\\\\d"\` (hai backslash) mới ra một \`\\d\` cho regex — rối và dễ sai.

## C. Chuỗi là bất biến (immutable)

\`\`\`python
s = "hello"
s[0]              # "h"   — đọc được như list
s[0] = "H"        # TypeError! KHÔNG sửa được ký tự trong chuỗi
s = "H" + s[1:]   # cách đúng: tạo chuỗi MỚI
\`\`\`

Mọi phương thức chuỗi đều **trả về chuỗi mới**, không sửa chuỗi gốc:

\`\`\`python
s = "  Xin Chào  "
s.strip()          # "Xin Chào"  — cắt khoảng trắng hai đầu
s.lower()          # "  xin chào  "
s                  # "  Xin Chào  " — s KHÔNG hề đổi
s = s.strip()      # muốn giữ kết quả thì phải gán lại
\`\`\`

## D. Các phương thức chuỗi phải thuộc

\`\`\`python
s = "Xin chào Python"

s.upper()                 # "XIN CHÀO PYTHON"
s.lower()                 # "xin chào python"
s.strip()                 # cắt khoảng trắng 2 đầu (.lstrip() / .rstrip() cắt 1 bên)
s.replace("Python", "PY") # thay thế
s.split()                 # ['Xin', 'chào', 'Python'] — tách theo khoảng trắng
s.split("h")              # tách theo ký tự chỉ định
"-".join(["a", "b"])      # "a-b" — NGƯỢC với split. Đọc: "lấy dấu - nối các phần tử lại"
s.startswith("Xin")       # True
s.endswith("n")           # True
s.find("chào")            # 4    — vị trí, không thấy thì trả -1
s.count("n")              # đếm số lần xuất hiện
"123".isdigit()           # True — toàn số?
s.title()                 # "Xin Chào Python"
\`\`\`

> \`join\` là chỗ người mới hay viết ngược. Nhớ: **dấu nối đứng trước**, \`", ".join(danh_sach)\`.

## E. Regex — bảng ký hiệu tối thiểu

Regex là "ngôn ngữ mô tả khuôn mẫu chuỗi". Trước khi đọc bài giảng, thuộc bảng này:

| Ký hiệu | Khớp với |
|---|---|
| \`.\` | một ký tự bất kỳ (trừ xuống dòng) |
| \`\\d\` | một chữ số 0–9 |
| \`\\w\` | một ký tự chữ, số, hoặc \`_\` |
| \`\\s\` | một khoảng trắng (space, tab, xuống dòng) |
| \`[abc]\` | một trong các ký tự a, b, c |
| \`[a-z]\` | một chữ cái thường bất kỳ |
| \`[^abc]\` | một ký tự **không** phải a, b, c |
| \`*\` | lặp 0 lần trở lên |
| \`+\` | lặp **1** lần trở lên |
| \`?\` | có 0 hoặc 1 lần (không bắt buộc) |
| \`{3}\` / \`{2,5}\` | đúng 3 lần / từ 2 đến 5 lần |
| \`^\` | đầu chuỗi |
| \`$\` | cuối chuỗi |
| \`( )\` | **nhóm bắt** — phần muốn lấy ra |
| dấu sổ đứng | hoặc — khớp một trong nhiều lựa chọn |

Viết hoa là phủ định: \`\\D\` = không phải chữ số, \`\\W\`, \`\\S\` tương tự.

\`\`\`text
r"\\d{3}-\\d{4}"      khớp "123-4567"
r"^Hello"            chuỗi PHẢI bắt đầu bằng Hello
r"a+"                một hoặc nhiều chữ a liên tiếp
r"(\\d+)-(\\d+)"      hai nhóm số, lấy ra được riêng từng nhóm
\`\`\`

## F. Module \`re\` — bốn hàm dùng nhiều nhất

\`\`\`python
import re

re.search(r"\\d+", "abc 123")     # tìm ở BẤT KỲ đâu -> Match object, không thấy thì None
re.match(r"\\d+", "abc 123")      # chỉ khớp từ ĐẦU chuỗi -> None (vì bắt đầu bằng "abc")
re.findall(r"\\d+", "1 và 22")    # ['1', '22'] — trả về LIST mọi kết quả
re.sub(r"\\d+", "#", "a1b22")     # "a#b#"      — thay thế
\`\`\`

Lấy dữ liệu ra từ kết quả:

\`\`\`python
m = re.search(r"(\\d+)-(\\d+)", "sđt 123-4567")
if m:                       # LUÔN kiểm tra, vì không khớp sẽ là None
    m.group(0)              # "123-4567" — toàn bộ phần khớp
    m.group(1)              # "123"      — nhóm ngoặc thứ nhất
    m.group(2)              # "4567"
    m.groups()              # ('123', '4567')
\`\`\`

Nhóm đặt tên cho dễ đọc — cú pháp \`(?P<tên>...)\`:

\`\`\`python
m = re.search(r"(?P<ma>\\d+)-(?P<so>\\d+)", "123-4567")
m.group("ma")               # "123"
\`\`\`

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`"""..."""\` | chuỗi nhiều dòng / docstring |
| \`r"..."\` | raw string — luôn dùng cho regex |
| \`\\n\` \`\\t\` | xuống dòng, tab |
| \`"x".join(ds)\` | nối list thành chuỗi (dấu nối đứng trước) |
| \`s.split(x)\` | tách chuỗi thành list |
| \`re.search\` / \`findall\` / \`sub\` | tìm một / tìm hết / thay thế |
| \`m.group(n)\` | lấy nội dung nhóm ngoặc thứ \`n\` |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| \`s.strip()\` rồi dùng \`s\` | chuỗi bất biến, \`s\` không đổi | \`s = s.strip()\` |
| \`s[0] = "H"\` | không sửa được chuỗi | \`s = "H" + s[1:]\` |
| \`danh_sach.join("-")\` | viết ngược | \`"-".join(danh_sach)\` |
| \`re.match\` mong tìm giữa chuỗi | \`match\` chỉ khớp từ đầu | dùng \`re.search\` |
| \`m.group(1)\` khi \`m\` là \`None\` | \`AttributeError\` | kiểm tra \`if m:\` trước |
| Regex viết \`"\\d"\` không có \`r\` | Python hiểu \`\\d\` sai | \`r"\\d"\` |
| \`"a" + 1\` | \`TypeError\` | \`f"a{1}"\` hoặc \`"a" + str(1)\` |
`,

/* ==================================================================== */
'py-exceptions': `
## A. Exception là gì?

Khi Python gặp việc không làm được (chia cho 0, mở file không tồn tại, ép \`"abc"\` thành số), nó
**ném ra một exception** — chương trình dừng và in ra một khối chữ đỏ gọi là *traceback*.

\`\`\`text
Traceback (most recent call last):
  File "main.py", line 3, in <module>          <- dòng nào gây lỗi
    print(10 / 0)
ZeroDivisionError: division by zero            <- LOẠI lỗi : mô tả lỗi
\`\`\`

**Cách đọc traceback: đọc từ DƯỚI LÊN.** Dòng cuối cho biết lỗi gì, dòng ngay trên cho biết ở đâu.

## B. Cú pháp \`try / except\`

\`\`\`python
try:
    x = int("abc")                 # đoạn code CÓ THỂ lỗi
except ValueError:                 # nếu lỗi loại ValueError xảy ra thì chạy khối này
    print("Không phải số")
    x = 0
\`\`\`

Đầy đủ bốn khối:

\`\`\`python
try:
    f = open("data.txt")
except FileNotFoundError as e:     # "as e" = đặt tên cho object lỗi để đọc chi tiết
    print("Không thấy file:", e)
except (ValueError, TypeError):    # bắt NHIỀU loại lỗi cùng lúc — đặt trong ngoặc tròn
    print("Dữ liệu sai kiểu")
else:
    print("Chạy khi KHÔNG có lỗi nào")
finally:
    print("LUÔN chạy, dù lỗi hay không — thường dùng để dọn dẹp")
\`\`\`

| Khối | Chạy khi nào |
|---|---|
| \`try\` | luôn — đây là phần được canh chừng |
| \`except\` | khi có lỗi khớp loại đã ghi |
| \`else\` | khi \`try\` chạy trót lọt, không lỗi |
| \`finally\` | luôn luôn, kể cả khi đã \`return\` |

## C. Cây phân cấp exception và thứ tự \`except\`

Các loại lỗi kế thừa lẫn nhau. \`Exception\` là cha của gần như mọi lỗi thường gặp:

\`\`\`text
BaseException
 └── Exception
      ├── ValueError        (giá trị sai: int("abc"))
      ├── TypeError         (sai kiểu: "a" + 1)
      ├── KeyError          (dict không có khoá)
      ├── IndexError        (list vượt chỉ số)
      ├── AttributeError    (object không có thuộc tính)
      ├── ZeroDivisionError
      └── OSError
           └── FileNotFoundError
\`\`\`

Quy tắc quan trọng: **\`except\` đặt lớp con TRƯỚC, lớp cha SAU.** Nếu để cha trước, khối con
không bao giờ chạy — và Python **không** báo lỗi cho bạn biết.

\`\`\`python
try: ...
except FileNotFoundError: ...     # cụ thể trước
except OSError: ...               # tổng quát sau
except Exception: ...             # tổng quát nhất, cuối cùng
\`\`\`

## D. Chủ động ném lỗi bằng \`raise\`

\`\`\`python
def rut(so_du, tien):
    if tien <= 0:
        raise ValueError("Số tiền phải dương")     # raise = ném lỗi ra ngay
    return so_du - tien
\`\`\`

Bắt rồi ném lại — hai kiểu:

\`\`\`python
try:
    ...
except ValueError:
    raise                                  # ném lại NGUYÊN VẸN lỗi cũ (giữ traceback gốc)

try:
    ...
except ValueError as e:
    raise RuntimeError("Lỗi khi xử lý") from e     # "from e" giữ lại nguyên nhân gốc
\`\`\`

## E. Tự tạo loại lỗi riêng

\`\`\`python
class SoDuKhongDu(Exception):        # kế thừa Exception là đủ
    pass                             # không cần viết gì thêm

raise SoDuKhongDu("Không đủ tiền")
\`\`\`

Muốn kèm dữ liệu:

\`\`\`python
class SoDuKhongDu(Exception):
    def __init__(self, thieu):
        super().__init__(f"Thiếu {thieu} đồng")     # đặt thông điệp
        self.thieu = thieu                          # lưu lại để nơi bắt lỗi dùng
\`\`\`

## F. EAFP — triết lý xử lý lỗi của Python

Hai lối tư duy:

\`\`\`python
# LBYL — "Look Before You Leap": kiểm tra trước rồi mới làm (kiểu Java/C)
if "ten" in d:
    x = d["ten"]

# EAFP — "Easier to Ask Forgiveness than Permission": cứ làm, lỗi thì bắt (kiểu Python)
try:
    x = d["ten"]
except KeyError:
    x = None
\`\`\`

Python **ưa EAFP** vì tránh được lỗi tranh chấp (giữa lúc kiểm tra và lúc dùng, dữ liệu có thể đổi)
và code đường-đi-chính sạch hơn.

## G. \`assert\` — chốt kiểm tra khi đang phát triển

\`\`\`python
assert tuoi > 0, "Tuổi phải dương"     # sai -> AssertionError kèm thông điệp
\`\`\`

Lưu ý: \`assert\` bị **tắt hoàn toàn** khi chạy Python với cờ \`-O\`. Đừng dùng \`assert\` để kiểm tra
dữ liệu người dùng — việc đó phải dùng \`if ... raise\`.

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`try:\` | canh chừng đoạn code có thể lỗi |
| \`except X as e:\` | bắt lỗi loại \`X\`, đặt tên \`e\` |
| \`except (A, B):\` | bắt nhiều loại cùng lúc |
| \`else:\` | chạy khi không có lỗi |
| \`finally:\` | luôn chạy, dùng để dọn dẹp |
| \`raise\` | ném lỗi (không tham số = ném lại lỗi đang bắt) |
| \`raise X from e\` | ném lỗi mới, giữ nguyên nhân gốc |
| \`assert đk, "msg"\` | chốt kiểm tra lúc phát triển |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| \`except:\` trống | nuốt cả Ctrl+C và lỗi hệ thống | \`except Exception:\` |
| \`except Exception\` đặt đầu tiên | các \`except\` sau không bao giờ chạy | xếp cụ thể trước, tổng quát sau |
| \`except\` rồi \`pass\` | lỗi bị giấu, cực khó debug | ít nhất phải ghi log |
| \`raise ValueError\` không thông điệp | người đọc log không biết chuyện gì | \`raise ValueError("mô tả rõ")\` |
| Bọc cả trăm dòng trong một \`try\` | không biết dòng nào lỗi | chỉ bọc dòng thực sự rủi ro |
| Dùng \`assert\` để validate input | bị tắt khi chạy \`-O\` | \`if ...: raise ValueError(...)\` |
`,

/* ==================================================================== */
'py-file-io': `
## A. Mở file: luôn dùng \`with\`

\`\`\`python
with open("data.txt", "r", encoding="utf-8") as f:    # mở file
    noi_dung = f.read()                               # dùng file bên trong khối thụt vào
# ra khỏi khối -> Python TỰ ĐỘNG đóng file, kể cả khi có lỗi xảy ra
\`\`\`

Đọc từng phần của dòng \`with\`:

| Phần | Nghĩa |
|---|---|
| \`open(...)\` | mở file, trả về một "file object" |
| \`"data.txt"\` | đường dẫn file |
| \`"r"\` | chế độ mở (xem bảng dưới) |
| \`encoding="utf-8"\` | bảng mã — **luôn ghi rõ**, nếu không tiếng Việt sẽ lỗi trên Windows |
| \`as f\` | đặt tên \`f\` cho file object để dùng bên trong |
| \`:\` | mở khối, dòng sau thụt vào |

Không dùng \`with\` thì phải tự đóng — và rất dễ quên khi có lỗi giữa chừng:

\`\`\`python
f = open("data.txt")
noi_dung = f.read()
f.close()                  # quên dòng này -> file bị giữ, rò rỉ tài nguyên
\`\`\`

## B. Các chế độ mở file

| Chế độ | Tên | Ý nghĩa | File chưa tồn tại |
|---|---|---|---|
| \`"r"\` | read | đọc (mặc định) | báo \`FileNotFoundError\` |
| \`"w"\` | write | ghi — **XOÁ SẠCH nội dung cũ** | tạo mới |
| \`"a"\` | append | ghi thêm vào cuối | tạo mới |
| \`"x"\` | exclusive | tạo mới, lỗi nếu đã có | tạo mới |
| \`"rb"\` / \`"wb"\` | binary | đọc/ghi nhị phân (ảnh, zip) | — |

> \`"w"\` là chế độ nguy hiểm nhất với người mới: mở file bằng \`"w"\` là **mất toàn bộ nội dung cũ
> ngay lập tức**, kể cả khi bạn chưa ghi gì. Muốn thêm vào thì dùng \`"a"\`.

## C. Đọc file — bốn cách

\`\`\`python
with open("data.txt", encoding="utf-8") as f:
    f.read()             # trả về TOÀN BỘ file thành một chuỗi
    f.readline()         # đọc một dòng
    f.readlines()        # trả về list các dòng, mỗi phần tử còn ký tự "\\n" ở cuối

with open("data.txt", encoding="utf-8") as f:
    for dong in f:                       # CÁCH TỐT NHẤT: duyệt từng dòng, không nạp hết vào RAM
        print(dong.rstrip("\\n"))         # rstrip để bỏ ký tự xuống dòng thừa
\`\`\`

## D. Ghi file

\`\`\`python
with open("out.txt", "w", encoding="utf-8") as f:
    f.write("dòng 1\\n")            # write KHÔNG tự xuống dòng — phải tự thêm \\n
    f.write("dòng 2\\n")
    f.writelines(["a\\n", "b\\n"])   # ghi cả list (cũng không tự thêm \\n)

print("nội dung", file=f)           # cũng ghi được bằng print, tham số file=
\`\`\`

## E. Đường dẫn file với \`pathlib\`

\`\`\`python
from pathlib import Path

p = Path("thu_muc") / "data.txt"    # dấu / để nối đường dẫn — chạy đúng trên cả Windows lẫn Linux
p.exists()                          # file có tồn tại không
p.name                              # "data.txt"
p.suffix                            # ".txt"
p.parent                            # Path("thu_muc")

p.read_text(encoding="utf-8")       # đọc nhanh cả file, không cần with
p.write_text("nội dung", encoding="utf-8")
\`\`\`

## F. JSON — trao đổi dữ liệu

JSON là định dạng text để chuyển dữ liệu giữa các chương trình. Bốn hàm, nhớ theo quy tắc:
**có chữ \`s\` = làm việc với chuỗi (String), không có \`s\` = làm việc với file.**

\`\`\`python
import json

json.dumps(obj)        # object Python -> CHUỖI json
json.loads(chuoi)      # chuỗi json    -> object Python
json.dump(obj, f)      # object Python -> ghi thẳng vào FILE f
json.load(f)           # đọc FILE f    -> object Python
\`\`\`

\`\`\`python
nguoi = {"ten": "An", "tuoi": 20}

with open("nguoi.json", "w", encoding="utf-8") as f:
    json.dump(nguoi, f, ensure_ascii=False, indent=2)
    # ensure_ascii=False -> giữ nguyên tiếng Việt, không đổi thành \\u1ea5n
    # indent=2           -> xuống dòng thụt lề cho người đọc được

with open("nguoi.json", encoding="utf-8") as f:
    lai = json.load(f)
\`\`\`

Bảng chuyển đổi kiểu — không phải kiểu Python nào cũng đưa vào JSON được:

| Python | JSON |
|---|---|
| \`dict\` | object \`{ }\` |
| \`list\`, \`tuple\` | array \`[ ]\` (tuple biến thành list, **không quay lại được**) |
| \`str\` | string |
| \`int\`, \`float\` | number |
| \`True\` / \`False\` | \`true\` / \`false\` (chữ thường!) |
| \`None\` | \`null\` |
| \`set\`, \`datetime\`, object tự định nghĩa | **lỗi** \`TypeError\` — phải tự chuyển trước |

## G. CSV — bảng dữ liệu

\`\`\`python
import csv

with open("bang.csv", encoding="utf-8", newline="") as f:   # newline="" là BẮT BUỘC
    doc = csv.reader(f)
    for hang in doc:
        print(hang)              # mỗi hàng là một LIST chuỗi: ['An', '20']

with open("bang.csv", encoding="utf-8", newline="") as f:
    doc = csv.DictReader(f)      # dùng dòng đầu làm tên cột
    for hang in doc:
        print(hang["ten"])       # mỗi hàng là một DICT — dễ đọc hơn nhiều

with open("ra.csv", "w", encoding="utf-8", newline="") as f:
    ghi = csv.writer(f)
    ghi.writerow(["ten", "tuoi"])
    ghi.writerows([["An", 20], ["Bình", 22]])
\`\`\`

Hai điều phải nhớ: **mọi giá trị đọc từ CSV đều là chuỗi** (số cũng vậy, phải tự \`int()\`), và
\`newline=""\` để tránh bị chèn dòng trống trên Windows.

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`with open(...) as f:\` | mở file và tự đóng khi xong |
| \`"r"\` / \`"w"\` / \`"a"\` | đọc / ghi đè / ghi thêm |
| \`encoding="utf-8"\` | bảng mã, luôn ghi rõ |
| \`for dong in f:\` | duyệt từng dòng, tiết kiệm RAM |
| \`json.dump\` / \`dumps\` | ghi file / ra chuỗi |
| \`json.load\` / \`loads\` | đọc file / từ chuỗi |
| \`csv.DictReader\` | đọc CSV thành dict theo tên cột |
| \`Path("a") / "b"\` | nối đường dẫn đa nền tảng |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| \`open("f.txt", "w")\` để đọc | xoá sạch file ngay lập tức | \`"r"\` để đọc, \`"a"\` để thêm |
| Không có \`encoding="utf-8"\` | tiếng Việt lỗi font / \`UnicodeDecodeError\` | luôn ghi \`encoding="utf-8"\` |
| Quên \`f.close()\` khi không dùng \`with\` | rò rỉ tài nguyên, dữ liệu chưa ghi hết | dùng \`with\` |
| \`f.write(so)\` | \`TypeError\` — write chỉ nhận chuỗi | \`f.write(str(so))\` |
| \`json.dumps\` với \`set\` | \`TypeError\` | chuyển thành \`list\` trước |
| Đọc CSV rồi cộng số | mọi ô là chuỗi, \`"1"+"2"="12"\` | \`int(hang["tuoi"])\` |
| Đọc file sau khi ra khỏi \`with\` | \`ValueError: I/O on closed file\` | làm mọi việc bên trong khối |
`,

/* ==================================================================== */
'py-packaging': `
## A. Import — bốn cách viết

\`\`\`python
import math                        # nạp cả module, dùng qua tên: math.sqrt(4)
import math as m                   # đặt bí danh:            m.sqrt(4)
from math import sqrt              # lấy riêng một thứ:      sqrt(4)
from math import sqrt, pi          # lấy nhiều thứ
from math import *                 # lấy TẤT CẢ — TRÁNH DÙNG, làm rối tên, khó lần vết
\`\`\`

Nên viết \`import\` ở **đầu file**, theo ba nhóm cách nhau một dòng trống (quy ước PEP 8):

\`\`\`python
import os                          # 1. thư viện chuẩn của Python
import sys

import requests                    # 2. thư viện cài từ bên ngoài (pip)

from .models import NguoiDung      # 3. code của chính dự án
\`\`\`

## B. Module, package và \`__init__.py\`

| Thuật ngữ | Là gì | Ví dụ |
|---|---|---|
| **module** | một file \`.py\` | \`utils.py\` |
| **package** | một thư mục chứa nhiều module | \`myapp/\` |
| \`__init__.py\` | file đánh dấu "thư mục này là package" | có thể để trống |

\`\`\`text
duan/
├── main.py
└── myapp/
    ├── __init__.py          <- file này khiến myapp thành package
    ├── models.py
    └── utils/
        ├── __init__.py
        └── text.py
\`\`\`

\`\`\`python
# trong main.py
from myapp.models import NguoiDung        # dấu chấm = đi vào thư mục con
from myapp.utils.text import lam_sach
\`\`\`

Import tương đối (chỉ dùng **bên trong** package):

\`\`\`python
from .models import NguoiDung      # một chấm  = cùng thư mục hiện tại
from ..config import CAI_DAT       # hai chấm  = lùi lên thư mục cha
\`\`\`

## C. Python tìm module ở đâu?

Khi bạn viết \`import abc\`, Python tìm theo thứ tự trong danh sách \`sys.path\`:

\`\`\`python
import sys
print(sys.path)      # 1. thư mục chứa file đang chạy
                     # 2. các đường dẫn trong biến môi trường PYTHONPATH
                     # 3. thư mục site-packages (nơi pip cài thư viện)
\`\`\`

Hệ quả trực tiếp — **bẫy đặt tên file**: nếu bạn tạo file tên \`random.py\` trong thư mục dự án,
thì \`import random\` sẽ lấy file của bạn thay vì thư viện chuẩn, gây lỗi rất khó hiểu.
Đừng đặt tên file trùng tên thư viện (\`json.py\`, \`math.py\`, \`csv.py\`, \`email.py\`…).

## D. \`if __name__ == "__main__":\` — dòng bí ẩn nhất Python

\`\`\`python
def cong(a, b):
    return a + b

if __name__ == "__main__":
    print(cong(1, 2))          # chỉ chạy khi file này được chạy TRỰC TIẾP
\`\`\`

Giải thích: mỗi file có sẵn biến \`__name__\`.

| Cách file được dùng | Giá trị \`__name__\` |
|---|---|
| chạy trực tiếp: \`python main.py\` | \`"__main__"\` |
| bị file khác \`import\` | tên module, ví dụ \`"main"\` |

Nhờ vậy bạn viết được file vừa dùng làm thư viện (import vào lấy hàm) vừa chạy được như chương
trình độc lập, mà phần chạy thử không bị kích hoạt khi bị import.

## E. Môi trường ảo (virtual environment)

Vấn đề: dự án A cần \`requests\` phiên bản 2.0, dự án B cần 3.0. Cài chung một chỗ là xung đột.
Môi trường ảo = một thư mục Python riêng cho từng dự án.

\`\`\`bash
python -m venv .venv                 # tạo môi trường ảo trong thư mục .venv

# Kích hoạt — lệnh khác nhau theo hệ điều hành:
.venv\\Scripts\\activate               # Windows (PowerShell / CMD)
source .venv/bin/activate            # macOS / Linux

# Dấu hiệu đã kích hoạt: dòng lệnh có tiền tố (.venv)
deactivate                           # thoát ra
\`\`\`

Nhớ: thêm \`.venv/\` vào \`.gitignore\` — **không bao giờ** đưa môi trường ảo lên git.

## F. pip và \`requirements.txt\`

\`\`\`bash
pip install requests                 # cài một gói
pip install requests==2.31.0         # cài đúng phiên bản
pip uninstall requests               # gỡ
pip list                             # xem đã cài gì
pip freeze > requirements.txt        # ghi lại TOÀN BỘ gói + phiên bản đang có
pip install -r requirements.txt      # cài lại y hệt trên máy khác
\`\`\`

Cách đọc ký hiệu phiên bản trong \`requirements.txt\`:

| Viết | Nghĩa |
|---|---|
| \`requests==2.31.0\` | đúng chính xác phiên bản này |
| \`requests>=2.0\` | từ 2.0 trở lên |
| \`requests~=2.31.0\` | từ 2.31.0 tới trước 2.32 (chỉ nhận bản vá) |
| \`requests\` | bản mới nhất — **rủi ro**, hôm nay chạy mai có thể hỏng |

## G. Thư mục \`__pycache__\`

Python tự sinh thư mục \`__pycache__\` chứa file \`.pyc\` (bản đã biên dịch, để lần import sau nhanh
hơn). Đây là file tạm — thêm \`__pycache__/\` vào \`.gitignore\`, đừng bao giờ sửa tay.

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`import x\` / \`from x import y\` | nạp cả module / lấy riêng một phần |
| \`import x as z\` | đặt bí danh |
| \`.\` / \`..\` trong import | thư mục hiện tại / thư mục cha |
| \`__init__.py\` | đánh dấu thư mục là package |
| \`__name__ == "__main__"\` | file đang được chạy trực tiếp |
| \`python -m venv .venv\` | tạo môi trường ảo |
| \`pip freeze\` / \`-r\` | xuất / cài lại danh sách gói |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| Đặt file tên \`random.py\` | che mất thư viện chuẩn | đổi tên file |
| \`from x import *\` | rối tên, không biết hàm đến từ đâu | import cụ thể |
| \`pip install\` khi chưa kích hoạt venv | cài lung tung vào Python hệ thống | kích hoạt venv trước |
| Đưa \`.venv/\` lên git | repo phình to hàng trăm MB | thêm vào \`.gitignore\` |
| Hai module import lẫn nhau | \`ImportError\` (circular import) | tách phần dùng chung ra module thứ ba |
| \`ModuleNotFoundError\` dù file tồn tại | chạy sai thư mục gốc | chạy từ thư mục gốc dự án, dùng \`python -m goi.module\` |
`,

/* ==================================================================== */
'py-context-managers': `
## A. \`with\` là gì — nhắc lại từ gốc

\`with\` là cú pháp đảm bảo **"mở ra thì chắc chắn được đóng lại"**, kể cả khi giữa chừng có lỗi.

\`\`\`python
with open("f.txt") as f:      # <- lúc vào khối: mở file
    noi_dung = f.read()
# <- lúc ra khối (dù bình thường hay do lỗi): file được đóng
\`\`\`

Nó tương đương chính xác đoạn dài dòng này:

\`\`\`python
f = open("f.txt")
try:
    noi_dung = f.read()
finally:
    f.close()                 # finally = luôn chạy -> đó là toàn bộ "phép màu" của with
\`\`\`

Cấu trúc câu lệnh:

\`\`\`text
with  <biểu thức>  as  <tên biến>  :
       (1)              (2)
\`\`\`

- (1) là một **context manager** — object biết cách "mở" và "đóng".
- (2) là tên nhận giá trị mà phần "mở" trả về. \`as ...\` **không bắt buộc**, có thứ không cần tên.

Mở nhiều thứ cùng lúc, ngăn bằng dấu phẩy:

\`\`\`python
with open("a.txt") as fa, open("b.txt", "w") as fb:
    fb.write(fa.read())
\`\`\`

## B. Tự viết context manager — cách 1: bằng class

Một object dùng được với \`with\` chỉ cần có **đúng hai phương thức**:

\`\`\`python
class DoThoiGian:
    def __enter__(self):              # chạy khi VÀO khối with
        import time
        self.bat_dau = time.time()
        return self                   # giá trị này rơi vào phần "as ..."

    def __exit__(self, loai, gia_tri, vet):    # chạy khi RA khỏi khối with
        import time
        print(f"Mất {time.time() - self.bat_dau:.2f}s")
        return False                  # False = "tôi không xử lý lỗi, cứ để nó ném tiếp"

with DoThoiGian() as t:
    tinh_toan_nang()
\`\`\`

Ba tham số của \`__exit__\` là thông tin lỗi (nếu có):

| Tham số | Khi không có lỗi | Khi có lỗi |
|---|---|---|
| \`loai\` (exc_type) | \`None\` | loại lỗi, ví dụ \`ValueError\` |
| \`gia_tri\` (exc_value) | \`None\` | chính object lỗi |
| \`vet\` (traceback) | \`None\` | đối tượng traceback |

Giá trị \`__exit__\` trả về quyết định số phận của lỗi:

- \`return False\` (hoặc không return gì) → **lỗi tiếp tục được ném ra ngoài**. Đây là mặc định đúng.
- \`return True\` → **nuốt lỗi**, coi như không có gì xảy ra. Chỉ dùng khi thực sự cố ý.

## C. Tự viết context manager — cách 2: bằng \`@contextmanager\` (ngắn hơn nhiều)

\`\`\`python
from contextlib import contextmanager

@contextmanager
def do_thoi_gian():
    import time
    bat_dau = time.time()             # phần TRƯỚC yield = __enter__
    try:
        yield bat_dau                 # yield = "trao quyền cho khối with", giá trị rơi vào "as"
    finally:
        print(f"Mất {time.time() - bat_dau:.2f}s")   # phần SAU yield = __exit__

with do_thoi_gian() as t0:
    tinh_toan_nang()
\`\`\`

Bản đồ ghi nhớ:

\`\`\`text
def ham():
    <mã setup>          <- __enter__
    try:
        yield <giá trị>  <- thân khối with chạy ở đây
    finally:
        <mã dọn dẹp>     <- __exit__ (finally để dọn dẹp cả khi khối with lỗi)
\`\`\`

**Bắt buộc phải có đúng một \`yield\`.** Không \`yield\` lần nào → lỗi \`RuntimeError: generator
didn't yield\`. \`yield\` hai lần → \`RuntimeError: generator didn't stop\`.

Và **bắt buộc bọc trong \`try/finally\`** nếu phần dọn dẹp phải luôn chạy — không có \`try\`, khi khối
\`with\` ném lỗi thì phần sau \`yield\` sẽ bị bỏ qua.

## D. Công cụ có sẵn trong \`contextlib\`

\`\`\`python
from contextlib import suppress, closing, ExitStack

with suppress(FileNotFoundError):     # bỏ qua đúng loại lỗi này, gọn hơn try/except/pass
    os.remove("tam.txt")

with closing(doi_tuong) as x:         # gọi x.close() khi xong, cho object chỉ có close()
    ...

with ExitStack() as stack:            # mở SỐ LƯỢNG KHÔNG BIẾT TRƯỚC các context
    files = [stack.enter_context(open(t)) for t in ten_files]
\`\`\`

## E. Những chỗ khác cũng dùng \`with\`

\`\`\`python
import threading, sqlite3

lock = threading.Lock()
with lock:                       # tự khoá / mở khoá — không cần "as" vì không cần giá trị
    ...

with sqlite3.connect("db.sqlite") as conn:     # tự commit/rollback theo kết quả
    ...

import pytest
with pytest.raises(ValueError):                # khẳng định "đoạn này PHẢI ném ValueError"
    int("abc")
\`\`\`

---

## Bảng tra nhanh ký hiệu module này

| Ký hiệu | Nghĩa |
|---|---|
| \`with X() as y:\` | mở \`X\`, gán kết quả vào \`y\`, tự dọn khi ra khối |
| \`with A() as a, B() as b:\` | mở nhiều context cùng lúc |
| \`__enter__\` | chạy khi vào khối, giá trị trả về rơi vào \`as\` |
| \`__exit__(t, v, tb)\` | chạy khi ra khối; \`return True\` = nuốt lỗi |
| \`@contextmanager\` | biến một generator thành context manager |
| \`yield\` trong \`@contextmanager\` | ranh giới giữa phần mở và phần dọn dẹp |
| \`suppress(X)\` | bỏ qua lỗi loại \`X\` |

## Lỗi người mới hay gặp

| Bạn viết | Vấn đề | Sửa thành |
|---|---|---|
| \`__exit__\` \`return True\` | nuốt mọi lỗi một cách âm thầm | \`return False\` hoặc không return |
| \`@contextmanager\` không có \`try/finally\` | khối \`with\` lỗi thì không dọn dẹp | bọc \`yield\` trong \`try/finally\` |
| \`@contextmanager\` có 2 \`yield\` | \`RuntimeError: generator didn't stop\` | chỉ để đúng một \`yield\` |
| Dùng file sau khi ra khỏi \`with\` | \`ValueError: closed file\` | làm mọi việc bên trong khối |
| \`with open(...):\` quên \`as f\` | không có tên để dùng file | thêm \`as f\` |
| Quên \`return self\` trong \`__enter__\` | \`as x\` nhận \`None\` | \`return self\` |
`,
};
