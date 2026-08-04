/**
 * LỘ TRÌNH PYTHON — MODULE 12: Thư viện chuẩn cốt lõi
 * (collections, itertools, functools, datetime)
 */

export default [
/* ==================================================================== */
{
  id: 'py-stdlib',
  name: 'Thư viện chuẩn cốt lõi',
  en: 'Core Standard Library',
  icon: '🧰',
  summary: 'Rất nhiều thao tác bạn tự viết bằng vòng lặp/dict thủ công đã có sẵn công cụ tối ưu trong thư viện chuẩn: `Counter`, `defaultdict`, `deque`, `itertools`, `functools` — biết chúng giúp code ngắn hơn, nhanh hơn, và ít bug hơn.',
  lesson: `
## 1. Vấn đề gốc

Một lượng lớn code "tự viết tay" trong các bài toán thực tế (đếm tần suất, nhóm dữ liệu theo khoá, xử lý
hàng đợi hai đầu, tổ hợp các phần tử, cache kết quả hàm) đều là những bài toán ĐÃ ĐƯỢC GIẢI SẴN trong thư
viện chuẩn của Python — không cần cài thêm gói nào. Vấn đề của module này không phải học thuật toán mới, mà
là học **nhận diện đúng lúc nào có sẵn công cụ chuẩn**, thay vì tự viết lại (thường chậm hơn và dễ có bug
tinh vi hơn bản chuẩn đã được kiểm thử kỹ).

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript | Python |
|---|---|---|
| Đếm tần suất phần tử | tự dùng \`Map\`, cộng dồn thủ công | \`collections.Counter(iterable)\` — có sẵn \`.most_common(n)\` |
| Dict tự tạo giá trị mặc định khi truy cập khoá lạ | \`map.get(k) ?? default\` mỗi lần truy cập | \`collections.defaultdict(factory)\` — tự gọi \`factory()\` khi gặp khoá lạ, không cần kiểm tra mỗi lần |
| Hàng đợi 2 đầu (thêm/xoá đầu VÀ cuối đều nhanh) | không có sẵn, dùng mảng thường (xoá đầu mảng là O(n)) | \`collections.deque\` — \`append\`/\`appendleft\`/\`pop\`/\`popleft\` đều O(1) |
| Tổ hợp/hoán vị có sẵn | không có, cần tự viết hoặc thư viện ngoài | \`itertools.combinations\`/\`itertools.permutations\` |
| Gộp dần một mảng thành 1 giá trị | \`array.reduce((a, b) => ..., init)\` | \`functools.reduce(fn, iterable, init)\` (ít dùng hơn JS vì Python đã có \`sum\`/\`max\`/\`min\` cho các trường hợp phổ biến) |
| Cache kết quả hàm theo tham số | tự viết \`Map\` cache thủ công | \`@functools.lru_cache\` — một dòng decorator |
| Làm việc với ngày giờ | \`Date\` object (API nổi tiếng khó dùng) | \`datetime\` module — \`datetime\`, \`timedelta\`, \`strftime\`/\`strptime\` |

## 3. Ý tưởng cốt lõi (lướt nhanh từng công cụ)

**\`collections.Counter\`** — đếm tần suất phần tử trong một iterable, trả về dict-like với \`.most_common(n)\`
lấy \`n\` phần tử xuất hiện nhiều nhất (giảm dần), hỗ trợ cả phép cộng/trừ giữa hai Counter.

**\`collections.defaultdict(factory)\`** — hoạt động như \`dict\` bình thường, NHƯNG khi truy cập một khoá
chưa tồn tại (\`d[khoa_la]\`), nó tự động gọi \`factory()\` (ví dụ \`list\`, \`int\`, \`set\`) để tạo giá trị mặc
định RỒI GÁN LUÔN vào dict, thay vì raise \`KeyError\` như \`dict\` thường.

**\`collections.deque\`** — cấu trúc hàng đợi hai đầu, O(1) cho \`append\`/\`appendleft\`/\`pop\`/\`popleft\`.
List thường có \`pop(0)\`/\`insert(0, x)\` tốn O(n) (phải dịch chuyển toàn bộ phần tử còn lại) — \`deque\` là lựa
chọn ĐÚNG khi cần thao tác thường xuyên ở CẢ HAI đầu (hàng đợi, sliding window, BFS).

**\`itertools.groupby(iterable, key)\`** — nhóm các phần tử LIÊN TIẾP có cùng khoá thành từng nhóm. Đây
KHÔNG phải nhóm toàn cục theo khoá (khác \`Counter\`/\`defaultdict\`) — nếu hai phần tử cùng khoá nhưng bị
ngăn cách bởi phần tử khác ở giữa, chúng thuộc HAI nhóm riêng biệt.

**\`functools.lru_cache\`** — decorator tự động cache kết quả hàm theo tham số đầu vào (đã học ở module
Iterator/Generator/Decorator khi cài Fibonacci) — chỉ hoạt động đúng khi tham số **hashable** (không dùng
được list/dict làm tham số trực tiếp).

**\`datetime\`** — \`datetime.strptime(s, fmt)\` parse chuỗi thành đối tượng ngày giờ, \`strftime(fmt)\` làm
ngược lại, và trừ hai \`datetime\` cho nhau ra một \`timedelta\` (có \`.days\` — Python tự lo đúng số ngày
trong từng tháng, năm nhuận... không cần bạn tự tính tay.

## 4. Dấu hiệu nhận biết

| Thấy trong đề bài | Nghĩ tới |
|---|---|
| "phần tử xuất hiện nhiều nhất", "top k tần suất" | \`Counter(...).most_common(k)\` |
| "nhóm các phần tử theo một khoá nào đó" (toàn cục, không quan tâm thứ tự) | \`defaultdict(list)\`, append vào |
| "nhóm các LẦN LẶP LIÊN TIẾP giống nhau" (run-length) | \`itertools.groupby\` — không cần sort trước |
| "cửa sổ trượt, cần thêm/bớt cả 2 đầu hiệu quả" | \`collections.deque\` |
| "tổ hợp/hoán vị của một tập hợp nhỏ" | \`itertools.combinations\`/\`permutations\` thay vì tự viết đệ quy |
| "số ngày giữa hai mốc thời gian" | \`datetime.strptime\` + trừ hai đối tượng \`datetime\` lấy \`.days\` |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
from collections import Counter, defaultdict, deque
from itertools import groupby, combinations
from functools import lru_cache
from datetime import datetime

# (a) Counter — đếm và lấy top-k
c = Counter(["a", "b", "a", "c", "a", "b"])
c.most_common(2)     # [('a', 3), ('b', 2)]

# (b) defaultdict — nhóm dữ liệu không cần kiểm tra khoá tồn tại
groups = defaultdict(list)
for word in ["eat", "tea", "bat"]:
    key = "".join(sorted(word))
    groups[key].append(word)     # KHÔNG cần "if key not in groups: groups[key] = []"

# (c) deque — hàng đợi 2 đầu O(1)
dq = deque([1, 2, 3])
dq.appendleft(0)      # deque([0, 1, 2, 3])
dq.pop()               # bỏ phần tử cuối, O(1)
dq.popleft()           # bỏ phần tử đầu, O(1) — khác list.pop(0) là O(n)

# (d) groupby — CHỈ nhóm phần tử LIÊN TIẾP giống nhau
[(k, list(g)) for k, g in groupby([1, 1, 2, 2, 1])]
# [(1, [1, 1]), (2, [2, 2]), (1, [1])]  — số 1 xuất hiện ở HAI nhóm riêng vì không liên tiếp

# (e) datetime — số ngày giữa hai mốc, tự lo năm nhuận/độ dài tháng
d1 = datetime.strptime("2024-02-28", "%Y-%m-%d")
d2 = datetime.strptime("2024-03-01", "%Y-%m-%d")
(d2 - d1).days          # 2 — 2024 là năm nhuận nên có ngày 29/2
\`\`\`

## 6. Bẫy thường gặp

- **Nhầm \`itertools.groupby\` là "nhóm toàn cục" giống \`Counter\`/\`defaultdict\`**: \`groupby([1, 2, 1])\`
  cho RA BA nhóm riêng biệt (\`1\`, \`2\`, \`1\`), KHÔNG gộp hai số \`1\` lại vì chúng không liên tiếp. Muốn nhóm
  toàn cục, phải **sort trước** theo đúng key rồi mới \`groupby\`, hoặc dùng \`defaultdict\` nếu không cần thứ
  tự đầu vào.
- **\`defaultdict\` vô tình TẠO khoá mới chỉ vì "kiểm tra" bằng \`d[key]\`**: khác với \`dict\` thường (chỉ
  raise \`KeyError\` khi kiểm tra khoá không tồn tại), \`defaultdict\` sẽ ÂM THẦM tạo và gán khoá đó ngay khi
  bạn chỉ ĐỌC thử \`d[key]\` — nếu chỉ muốn kiểm tra tồn tại mà không muốn tạo khoá mới, dùng \`key in d\`
  thay vì truy cập trực tiếp.
- **\`list.pop(0)\`/\`list.insert(0, x)\` tưởng nhanh nhưng là O(n)**: mọi phần tử còn lại phải dịch chuyển
  vị trí. Nếu code thao tác thường xuyên ở đầu danh sách trong vòng lặp lớn, đây là điểm nghẽn hiệu năng ẩn
  — chuyển sang \`deque\` giải quyết triệt để.
- **\`@lru_cache\` với tham số không hashable (list, dict)**: gây lỗi \`TypeError: unhashable type\` — cache
  cần dùng tham số làm khoá tra cứu, mà \`list\`/\`dict\` không thể làm khoá (mutable, không hashable). Muốn
  cache hàm nhận list, phải chuyển tham số thành \`tuple\` trước khi gọi.

## 7. Ứng dụng thực tế

- **\`Counter\`**: phân tích log tìm lỗi xuất hiện nhiều nhất, đếm từ khoá phổ biến trong văn bản, thống kê
  sản phẩm bán chạy nhất.
- **\`defaultdict\`**: nhóm giao dịch theo mã khách hàng, nhóm log theo mã lỗi, xây dựng đồ thị kề (adjacency
  list) mà không cần khởi tạo trước danh sách rỗng cho mỗi đỉnh.
- **\`deque\`**: cài đặt BFS (duyệt theo chiều rộng), sliding window tối ưu, hàng đợi task xử lý theo thứ tự
  đến trước-phục vụ trước (FIFO) trong hệ thống xử lý tác vụ nền.
- **\`datetime\`**: tính hạn thanh toán, số ngày còn lại của một gói dịch vụ, lịch nhắc nhở định kỳ — tất cả
  đều cần xử lý đúng năm nhuận/độ dài tháng khác nhau mà không nên tự viết công thức tay.
`,
  quiz: [
    {
      q: '`itertools.groupby([1, 2, 1])` (không sort trước) sẽ tạo ra bao nhiêu nhóm, và vì sao?',
      options: [
        '2 nhóm — một nhóm cho số 1 (gộp cả hai lần xuất hiện), một nhóm cho số 2',
        '3 nhóm riêng biệt (`1`, `2`, `1`) — `groupby` chỉ nhóm các phần tử LIÊN TIẾP có cùng khoá; hai số 1 không liên tiếp (bị số 2 ngăn ở giữa) nên thuộc hai nhóm khác nhau',
        '1 nhóm duy nhất chứa cả 3 phần tử',
        'Lỗi runtime vì `groupby` yêu cầu input phải luôn được sort trước khi gọi',
      ],
      answer: 1,
      why: '`groupby` là công cụ nhóm THEO TÍNH LIÊN TIẾP, không phải nhóm toàn cục. Đây là bẫy hiểu lầm phổ biến nhất về công cụ này — muốn nhóm toàn cục (gộp mọi lần xuất hiện của cùng một khoá bất kể vị trí), phải sort dữ liệu theo khoá đó TRƯỚC khi gọi `groupby`, hoặc dùng `defaultdict` thay thế.',
    },
    {
      q: 'Điểm khác biệt quan trọng nhất giữa `dict` thường và `collections.defaultdict(list)` là gì?',
      options: [
        'Không có khác biệt, `defaultdict` chỉ là bí danh khác của `dict`',
        'Khi truy cập một khoá CHƯA TỪNG TỒN TẠI, `dict` thường raise `KeyError`; `defaultdict(list)` tự động tạo một `list` rỗng, GÁN LUÔN vào khoá đó, rồi trả về — kể cả khi bạn chỉ định ĐỌC (không có ý định ghi)',
        '`defaultdict` không cho phép xoá khoá bằng `del`',
        '`defaultdict` chạy chậm hơn `dict` thường nên chỉ nên dùng khi thực sự cần thiết',
      ],
      answer: 1,
      why: 'Đây chính là bẫy hay gặp: `defaultdict` "tự động tạo khoá" ngay cả khi bạn chỉ đọc thử một khoá để kiểm tra sự tồn tại — nếu không muốn tạo khoá thừa, phải dùng `key in d` để kiểm tra thay vì truy cập trực tiếp `d[key]`.',
    },
    {
      q: 'Vì sao `collections.deque` phù hợp hơn `list` thường khi cần liên tục thêm/xoá phần tử ở ĐẦU danh sách?',
      options: [
        '`list.pop(0)`/`list.insert(0, x)` tốn O(n) vì phải dịch chuyển mọi phần tử còn lại; `deque.popleft()`/`deque.appendleft()` tốn O(1) nhờ cấu trúc dữ liệu bên trong khác biệt (double-ended queue)',
        '`list` không hỗ trợ thêm/xoá phần tử ở đầu, chỉ `deque` mới làm được',
        '`deque` chỉ nhanh hơn khi danh sách có ít hơn 10 phần tử',
        'Không có khác biệt về hiệu năng, chỉ khác về cú pháp gọi hàm',
      ],
      answer: 0,
      why: '`list` của Python được cài đặt dựa trên mảng liên tục trong bộ nhớ — thêm/xoá ở ĐẦU đòi hỏi dịch chuyển toàn bộ phần tử còn lại (O(n)). `deque` dùng cấu trúc khác (thường là danh sách các khối) cho phép thao tác O(1) ở CẢ HAI đầu.',
    },
    {
      q: '`@functools.lru_cache` sẽ gây lỗi gì nếu hàm được gọi với một tham số kiểu `list`?',
      options: [
        'Không có lỗi gì, `lru_cache` tự động chuyển `list` thành `tuple` để cache',
        '`TypeError: unhashable type` — `lru_cache` cần dùng tham số làm KHOÁ TRA CỨU trong cache nội bộ, mà `list` là kiểu mutable nên không hashable, không thể làm khoá',
        'Hàm vẫn chạy đúng nhưng không cache được, âm thầm bỏ qua việc cache',
        '`lru_cache` sẽ tự động bỏ qua tham số đó khi tính cache key',
      ],
      answer: 1,
      why: 'Cơ chế cache dựa trên việc dùng tham số (đóng gói cùng nhau) làm khoá trong một cấu trúc giống dict — mọi thành phần của khoá đó phải hashable. `list`/`dict` là mutable nên không hashable, gây lỗi `TypeError` ngay khi gọi hàm, không phải lỗi âm thầm.',
    },
    {
      q: 'Vì sao nên dùng `datetime` module để tính số ngày giữa hai mốc thời gian, thay vì tự viết công thức tính tay dựa trên số ngày mỗi tháng?',
      options: [
        '`datetime` module chạy nhanh hơn về mặt hiệu năng',
        '`datetime` tự động xử lý đúng các trường hợp phức tạp như năm nhuận (tháng 2 có 28 hay 29 ngày), độ dài khác nhau của từng tháng — tự viết tay rất dễ sai sót ở các trường hợp biên này',
        'Tự viết công thức tính tay là không thể thực hiện được trong Python',
        'Không có lý do đặc biệt, chỉ là quy ước code sạch hơn',
      ],
      answer: 1,
      why: 'Tính toán ngày tháng thủ công dễ sai ở các trường hợp biên: năm nhuận, tháng 2/4/6/9/11 có số ngày khác nhau, chuyển giao giữa các năm... `datetime`/`timedelta` đã xử lý đúng toàn bộ các trường hợp này, đã được kiểm thử kỹ qua hàng triệu ứng dụng thực tế.',
    },
    {
      q: '`list(zip([1, 2, 3], ["a", "b"]))` trả về gì?',
      options: [
        "[(1, 'a'), (2, 'b'), (3, None)]",
        "[(1, 'a'), (2, 'b')]",
        'ValueError vì hai danh sách khác độ dài',
        "[(1, 'a'), (2, 'b'), (3,)]",
      ],
      answer: 1,
      why: '`zip` dừng ở dãy **ngắn nhất** và **im lặng bỏ qua** phần dư — không cảnh báo gì. Đây là nguồn mất dữ liệu thầm lặng khi ghép hai danh sách mà bạn tưởng chúng luôn cùng độ dài (ví dụ ghép tên cột với giá trị dòng CSV bị thiếu ô). Từ Python 3.10 có `zip(a, b, strict=True)` để raise `ValueError` khi độ dài lệch — nên dùng mặc định mỗi khi bạn *kỳ vọng* hai dãy bằng nhau. Muốn giữ phần dư thì dùng `itertools.zip_longest`.',
    },
    {
      q: 'Đoạn code sau in ra gì?\n\nfrom collections import Counter\nc = Counter("ab")\nprint(c["z"], len(c))',
      options: ['0 2', '0 3', 'KeyError', 'None 2'],
      answer: 0,
      why: '`Counter` trả về `0` cho khoá chưa từng thấy — nhưng **không tạo khoá mới**, nên `len(c)` vẫn là 2. Đây là điểm khác biệt tinh tế và quan trọng so với `defaultdict(int)`: cùng trả về `0`, nhưng `defaultdict` **chèn** khoá vào dict ngay khi bạn chỉ định đọc nó, làm dict phình lên và làm sai kết quả khi bạn đếm số khoá hay lặp qua chúng. Muốn đọc mà chắc chắn không tạo khoá với `defaultdict`, dùng `d.get(key, 0)`.',
    },
    {
      q: 'Vì sao có thể sắp xếp theo nhiều tiêu chí bằng cách gọi `sorted` NHIỀU LẦN, theo thứ tự ưu tiên từ thấp đến cao?',
      options: [
        'Vì `sorted` tự động nhớ các lần sắp xếp trước',
        'Vì thuật toán sắp xếp của Python (Timsort) **ổn định** — các phần tử bằng nhau giữ nguyên thứ tự tương đối vốn có',
        'Vì `sorted` luôn sắp xếp lại từ đầu nên thứ tự cũ không quan trọng',
        'Đó là hiểu lầm — phải luôn dùng một key tuple duy nhất',
      ],
      answer: 1,
      why: '**Tính ổn định** (stability) là lời hứa của Timsort: hai phần tử có khoá bằng nhau sẽ giữ nguyên thứ tự chúng vốn có. Nhờ vậy `sorted(sorted(data, key=ten), key=diem, reverse=True)` cho ra "xếp theo điểm giảm dần, cùng điểm thì theo tên tăng dần". Cách này đặc biệt hữu ích khi các tiêu chí có chiều sắp xếp KHÁC nhau (cái tăng, cái giảm) — điều mà một key tuple duy nhất khó diễn đạt với dữ liệu không phải số. Không phải ngôn ngữ nào cũng đảm bảo điều này, nên đừng mang giả định đó đi nơi khác.',
    },
    {
      q: 'Trừ hai đối tượng `datetime`, một cái tạo bằng `datetime.now()` và một cái có gắn múi giờ (timezone-aware), sẽ ra sao?',
      options: [
        'Trả về timedelta bình thường, Python tự quy đổi múi giờ',
        'TypeError: can\'t subtract offset-naive and offset-aware datetimes',
        'Kết quả đúng nhưng bị lệch đúng số giờ của múi giờ',
        'Đối tượng naive tự động được coi là UTC',
      ],
      answer: 1,
      why: 'Python chia `datetime` thành hai loại: **naive** (không biết mình thuộc múi giờ nào) và **aware** (có `tzinfo`). Trộn hai loại là lỗi, và Python từ chối đoán — vì đoán sai sẽ tạo ra sai lệch nhiều giờ mà không ai phát hiện. Quy tắc thực hành cho hệ thống thật: **lưu và tính toán mọi thứ ở UTC dạng aware** (`datetime.now(timezone.utc)`), chỉ đổi sang giờ địa phương ở ngay lớp hiển thị. Lưu ý `datetime.utcnow()` trả về một đối tượng **naive** — cái tên gây hiểu nhầm này đã bị đánh dấu deprecated từ Python 3.12.',
    },
  ],
  problems: [
    {
      id: 'py-top-k-frequent-words',
      title: 'Top K từ xuất hiện nhiều nhất',
      en: 'Top K Frequent Words',
      difficulty: 'Medium',
      targetMinutes: 10,
      entry: 'top_k_frequent',
      lang: 'python',
      statement: `
Viết hàm \`top_k_frequent(words, k)\` trả về \`k\` từ xuất hiện **nhiều nhất** trong \`words\`, sắp xếp:
1. Theo **tần suất giảm dần**.
2. Nếu tần suất bằng nhau, theo **thứ tự chữ cái (alphabet) tăng dần**.

**Ví dụ**
- \`top_k_frequent(["i", "love", "leetcode", "i", "love", "coding"], 2)\` → \`["i", "love"]\` (cả hai đều xuất
  hiện 2 lần, "i" đứng trước "love" theo alphabet)
- \`top_k_frequent(["the", "day", "is", "sunny", "the", "the", "sunny", "is", "two"], 4)\`
  → \`["the", "is", "sunny", "day"]\`
`,
      starter: `from collections import Counter\n\ndef top_k_frequent(words, k):\n    # Tra ve k tu tan suat cao nhat, giam dan; bang tan suat -> alphabet tang dan\n    \n`,
      tests: [
        { args: [['i', 'love', 'leetcode', 'i', 'love', 'coding'], 2], expected: ['i', 'love'], name: 'Ví dụ cơ bản, tie-break bằng alphabet' },
        { args: [['the', 'day', 'is', 'sunny', 'the', 'the', 'sunny', 'is', 'two'], 4], expected: ['the', 'is', 'sunny', 'day'], name: 'Ví dụ có nhiều mức tần suất khác nhau' },
        { args: [['a'], 1], expected: ['a'], name: 'Chỉ 1 từ' },
        { args: [['a', 'b', 'c'], 2], expected: ['a', 'b'], name: 'Mọi từ tần suất bằng nhau -> thuần alphabet' },
        { args: [[], 0], expected: [], name: 'Danh sách rỗng, k=0' },
      ],
      hints: [
        '`Counter(words)` đếm tần suất mỗi từ, cho ra một dict-like `{"i": 2, "love": 2, "leetcode": 1, "coding": 1}`.',
        'Cần sắp xếp theo HAI tiêu chí: tần suất giảm dần TRƯỚC, alphabet tăng dần SAU (khi tần suất bằng nhau). Dùng `sorted(..., key=lambda w: (-counts[w], w))` — số âm của tần suất khiến tần suất cao đứng trước khi sort tăng dần, còn `w` (chuỗi) tự nhiên sort theo alphabet tăng dần khi bằng nhau.',
        'Sau khi có danh sách đã sort đúng thứ tự, chỉ cần lấy `k` phần tử đầu tiên bằng slicing `[:k]`.',
      ],
      diagnostics: [
        { test: '\\.most_common\\s*\\(\\s*k\\s*\\)(?!.*sorted)', message: '`Counter.most_common(k)` chỉ đảm bảo đúng thứ tự tần suất giảm dần, KHÔNG đảm bảo tie-break theo alphabet khi tần suất bằng nhau (thứ tự khi bằng nhau phụ thuộc thứ tự chèn vào Counter). Hãy tự `sorted(...)` với key kết hợp `(-tan_suat, tu)` để đảm bảo đúng cả hai tiêu chí.' },
      ],
      approach: `
Bài này kết hợp \`Counter\` (đếm) với \`sorted\` có **key phức hợp** (nhiều tiêu chí sắp xếp trong một lần
gọi) — một kỹ thuật rất hay dùng khi có yêu cầu "sắp xếp theo A giảm dần, B tăng dần khi A bằng nhau".

\`\`\`python
from collections import Counter

def top_k_frequent(words, k):
    counts = Counter(words)
    ranked = sorted(counts.keys(), key=lambda w: (-counts[w], w))
    return ranked[:k]
\`\`\`

**Vì sao \`key=lambda w: (-counts[w], w)\` giải quyết được CẢ HAI tiêu chí trong một lần \`sorted\`?** Python
so sánh tuple theo kiểu từ điển: so phần tử ĐẦU TIÊN trước (\`-counts[w]\`) — số âm biến "tần suất cao" thành
"giá trị nhỏ", nên \`sorted\` (mặc định tăng dần) sẽ xếp tần suất cao lên đầu. Khi hai từ có \`-counts[w]\`
bằng nhau (cùng tần suất), Python tự động so tiếp phần tử THỨ HAI của tuple (\`w\`, chính là chuỗi từ) theo
thứ tự tăng dần tự nhiên — đúng nghĩa alphabet. Đây là mẫu "tie-breaker qua tuple key" rất hữu dụng, tránh
phải viết hàm so sánh phức tạp bằng tay.
`,
      solution: `from collections import Counter

def top_k_frequent(words, k):
    counts = Counter(words)
    ranked = sorted(counts.keys(), key=lambda w: (-counts[w], w))
    return ranked[:k]`,
      complexity: {
        question: 'Độ phức tạp thời gian của `top_k_frequent` theo số từ n (giả sử số từ KHÁC NHAU cũng là O(n) trong trường hợp xấu nhất)?',
        options: ['O(n)', 'O(n log n) — đếm tần suất tốn O(n), nhưng sắp xếp toàn bộ các từ khác nhau tốn O(n log n), là bước chiếm ưu thế', 'O(n²)', 'O(1)'],
        answer: 1,
        why: '`Counter(words)` đếm tần suất tốn O(n). Bước `sorted` trên tối đa n từ khác nhau tốn O(n log n) — vì đây là bước có độ phức tạp cao hơn, tổng độ phức tạp của cả hàm là O(n log n).',
      },
      realWorld: 'Gợi ý từ khoá tìm kiếm phổ biến nhất, thống kê hashtag trending trên mạng xã hội, xác định sản phẩm bán chạy nhất trong báo cáo kinh doanh — mẫu "đếm rồi sắp xếp theo nhiều tiêu chí" xuất hiện trong hầu hết các bảng xếp hạng (leaderboard) thực tế.',
    },
    {
      id: 'py-group-anagrams-defaultdict',
      title: 'Nhóm các từ anagram bằng defaultdict',
      en: 'Group Anagrams with defaultdict',
      difficulty: 'Medium',
      targetMinutes: 10,
      entry: 'group_anagrams',
      lang: 'python',
      statement: `
Viết hàm \`group_anagrams(words)\` nhóm các từ là **anagram của nhau** (chứa cùng các chữ cái, chỉ khác thứ
tự) thành các nhóm con. Trả về **list các list** — thứ tự các nhóm và thứ tự bên trong mỗi nhóm **không
quan trọng** (bài kiểm tra so sánh không phụ thuộc thứ tự).

**Ví dụ**
- \`group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])\`
  → (một cách nhóm hợp lệ) \`[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]\`
`,
      starter: `from collections import defaultdict\n\ndef group_anagrams(words):\n    # Tra ve list cac nhom tu la anagram cua nhau (thu tu khong quan trong)\n    \n`,
      tests: [
        { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']], name: 'Ví dụ cơ bản, 3 nhóm' },
        { args: [[]], expected: [], name: 'Danh sách rỗng' },
        { args: [['a']], expected: [['a']], name: 'Một từ duy nhất' },
        { args: [['abc', 'cba', 'bac', 'xyz']], expected: [['abc', 'cba', 'bac'], ['xyz']], name: 'Một nhóm 3 từ, một nhóm lẻ' },
        { args: [['ab', 'ba', 'ab']], expected: [['ab', 'ba', 'ab']], name: 'Có từ trùng lặp, vẫn cùng một nhóm' },
      ],
      hints: [
        'Hai từ là anagram của nhau khi và chỉ khi CHUỖI CÁC CHỮ CÁI ĐÃ SẮP XẾP của chúng giống hệt nhau: `"".join(sorted("eat"))` và `"".join(sorted("tea"))` đều cho ra `"aet"`.',
        'Dùng `defaultdict(list)` với khoá là chuỗi đã sắp xếp — với mỗi từ, `groups[key].append(word)` mà KHÔNG cần kiểm tra `key` đã tồn tại hay chưa (đây chính là lợi ích của `defaultdict` so với `dict` thường).',
        'Kết quả cuối cùng chỉ cần `list(groups.values())` — lấy toàn bộ các nhóm đã gom được, không quan tâm thứ tự.',
      ],
      diagnostics: [
        { test: 'if\\s+key\\s+not\\s+in\\s+groups', message: 'Nếu đang dùng `defaultdict(list)` mà vẫn viết `if key not in groups: groups[key] = []`, bạn chưa tận dụng đúng lợi ích của `defaultdict` — nó tự làm việc này, bỏ được hẳn dòng kiểm tra thừa.' },
      ],
      approach: `
Đây là ứng dụng chuẩn của \`defaultdict(list)\`: nhóm dữ liệu theo khoá suy ra từ mỗi phần tử, không cần
kiểm tra khoá tồn tại trước khi append.

\`\`\`python
from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        key = "".join(sorted(word))
        groups[key].append(word)
    return list(groups.values())
\`\`\`

**Vì sao \`"".join(sorted(word))\` là "chữ ký" (signature) đúng cho anagram?** Hai từ là anagram khi và chỉ
khi chúng có ĐÚNG cùng một tập hợp chữ cái với ĐÚNG cùng số lần xuất hiện mỗi chữ — sắp xếp các chữ cái của
một từ theo thứ tự cố định (alphabet) sẽ luôn cho ra CÙNG MỘT kết quả cho mọi từ là anagram của nhau, bất kể
thứ tự gốc khác nhau thế nào. Đây là một kỹ thuật "canonical form" (dạng chuẩn hoá) rất hay gặp: biến nhiều
biểu diễn khác nhau của "cùng một thứ" về một dạng DUY NHẤT để so sánh/nhóm dễ dàng bằng dict/set.
`,
      solution: `from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        key = "".join(sorted(word))
        groups[key].append(word)
    return list(groups.values())`,
      checkerSrc: `def checker(got, expected, args):
    if not isinstance(got, list):
        return False
    def normalize(groups):
        return sorted(sorted(g) for g in groups)
    try:
        return normalize(got) == normalize(expected)
    except Exception:
        return False`,
      complexity: {
        question: 'Độ phức tạp thời gian của `group_anagrams` theo số từ n và độ dài tối đa m của mỗi từ?',
        options: ['O(n)', 'O(n · m log m) — mỗi từ trong n từ cần sort các ký tự của nó (tốn O(m log m)), tổng lại theo toàn bộ n từ', 'O(n²)', 'O(1)'],
        answer: 1,
        why: 'Với mỗi từ (n từ), việc `sorted(word)` tốn O(m log m) với m là độ dài từ đó. Tổng công việc trên toàn bộ danh sách là O(n · m log m), với m là độ dài từ dài nhất.',
      },
      realWorld: 'Nhóm các biến thể chính tả/gõ nhầm của cùng một từ khoá trong công cụ tìm kiếm, phát hiện các chuỗi trùng lặp về nội dung nhưng khác thứ tự (ví dụ tag sản phẩm), hoặc bài toán kinh điển trong phỏng vấn kỹ thuật minh hoạ tư duy "canonical form + dict nhóm".',
    },
    {
      id: 'py-sliding-window-max-deque',
      title: 'Giá trị lớn nhất trong cửa sổ trượt (deque)',
      en: 'Sliding Window Maximum (deque)',
      difficulty: 'Hard',
      targetMinutes: 18,
      entry: 'max_sliding_window',
      lang: 'python',
      statement: `
Viết hàm \`max_sliding_window(nums, k)\` trả về list giá trị **lớn nhất** trong mỗi cửa sổ trượt kích thước
\`k\` khi trượt qua \`nums\` từ trái sang phải.

**Ví dụ**
- \`max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3)\` → \`[3, 3, 5, 5, 6, 7]\`
  (cửa sổ \`[1,3,-1]\`→3, \`[3,-1,-3]\`→3, \`[-1,-3,5]\`→5, \`[-3,5,3]\`→5, \`[5,3,6]\`→6, \`[3,6,7]\`→7)

> Gợi ý: giải bằng vòng lặp lồng nhau (duyệt lại mỗi cửa sổ) sẽ tốn O(n·k) — bài này yêu cầu giải pháp O(n)
> bằng \`collections.deque\`.
`,
      starter: `from collections import deque\n\ndef max_sliding_window(nums, k):\n    # Tra ve list gia tri lon nhat moi cua so kich thuoc k, dung deque de dat O(n)\n    \n`,
      tests: [
        { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7], name: 'Ví dụ kinh điển' },
        { args: [[1], 1], expected: [1], name: 'Chỉ 1 phần tử, k=1' },
        { args: [[9, 11], 2], expected: [11], name: 'k bằng độ dài mảng' },
        { args: [[4, -2], 2], expected: [4], name: 'Có số âm' },
        { args: [[1, 3, 1, 2, 0, 5], 3], expected: [3, 3, 2, 5], name: 'Mảng dài hơn, k=3' },
      ],
      hints: [
        'Duy trì một `deque` lưu CHỈ SỐ (index) của các phần tử, sao cho giá trị tương ứng LUÔN giảm dần từ đầu tới cuối deque (monotonic decreasing) — phần tử đầu deque luôn là chỉ số của giá trị lớn nhất trong cửa sổ hiện tại.',
        'Với mỗi phần tử mới `x` ở chỉ số `i`: trong khi deque không rỗng VÀ giá trị ở CUỐI deque `<= x`, pop nó ra khỏi cuối (nó không còn cơ hội là max vì đã có `x` mới hơn và lớn hơn hoặc bằng). Sau đó `append(i)` vào cuối deque.',
        'Trước khi ghi nhận kết quả cho cửa sổ hiện tại: nếu chỉ số ở ĐẦU deque đã "rơi ra khỏi" cửa sổ (`dq[0] <= i - k`), `popleft()` nó ra. Khi `i >= k - 1` (đã đủ một cửa sổ đầy đủ), giá trị lớn nhất của cửa sổ hiện tại chính là `nums[dq[0]]`.',
      ],
      diagnostics: [
        { test: 'for\\s+\\w+\\s+in\\s+range\\([^)]*\\):[\\s\\S]*for\\s+\\w+\\s+in\\s+range\\([^)]*\\):[\\s\\S]*max\\(', message: 'Có vẻ bạn đang dùng vòng lặp lồng nhau để tính max của MỖI cửa sổ riêng biệt — cách này chạy đúng nhưng tốn O(n·k), không đạt yêu cầu O(n) của bài. Hãy dùng `deque` để duy trì "ứng viên max" qua các cửa sổ liên tiếp, không tính lại từ đầu mỗi lần.' },
      ],
      approach: `
Đây là bài toán kinh điển minh hoạ đúng lý do \`deque\` tồn tại: **duy trì một "deque đơn điệu giảm"
(monotonic decreasing deque)** chứa CHỈ SỐ của các ứng viên có thể là max, loại bỏ sớm những chỉ số không
còn cơ hội trở thành max.

\`\`\`python
from collections import deque

def max_sliding_window(nums, k):
    dq = deque()   # luu index, gia tri tuong ung giam dan tu dau den cuoi
    result = []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()              # cac gia tri nho hon x o CUOI khong con co hoi la max
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()          # chi so da roi ra khoi cua so hien tai
        if i >= k - 1:
            result.append(nums[dq[0]])   # dau deque luon la index cua max hien tai
    return result
\`\`\`

**Vì sao mỗi chỉ số chỉ bị \`pop\`/\`popleft\` TỐI ĐA một lần trong suốt vòng lặp?** Đây là lý do độ phức tạp
đạt O(n) thay vì O(n·k): mỗi phần tử được \`append\` đúng một lần, và chỉ có thể bị loại khỏi deque (qua
\`pop\` ở cuối hoặc \`popleft\` ở đầu) đúng một lần nữa — tổng số thao tác trên deque trong suốt thuật toán bị
chặn trên bởi \`2n\`, không phụ thuộc \`k\`. Đây chính là kỹ thuật "amortized O(1) mỗi bước" thường gặp khi
phân tích độ phức tạp của các thuật toán dùng deque/stack đơn điệu.
`,
      solution: `from collections import deque

def max_sliding_window(nums, k):
    dq = deque()
    result = []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`,
      complexity: {
        question: 'Độ phức tạp thời gian của lời giải dùng deque cho `max_sliding_window`, theo độ dài n của nums?',
        options: ['O(n·k)', 'O(n) — mỗi chỉ số được thêm vào và loại khỏi deque tối đa một lần mỗi thao tác, tổng công việc tuyến tính bất kể k', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: 'Dù có vòng lặp `while` bên trong vòng lặp `for`, mỗi phần tử chỉ có thể bị `pop` ra khỏi deque đúng một lần trong toàn bộ quá trình chạy — tổng số thao tác trên deque bị chặn trên bởi O(n), không phụ thuộc kích thước cửa sổ k.',
      },
      realWorld: 'Giám sát giá trị lớn nhất trong N giây gần nhất của một luồng dữ liệu (giá cổ phiếu, nhiệt độ cảm biến IoT), phát hiện đỉnh cục bộ trong dữ liệu streaming mà không thể tải toàn bộ dữ liệu vào bộ nhớ để tính lại từ đầu mỗi lần.',
    },
    {
      id: 'py-run-length-encode-groupby',
      title: 'Mã hoá run-length bằng itertools.groupby',
      en: 'Run-Length Encode with groupby',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'run_length_encode',
      lang: 'python',
      statement: `
Viết hàm \`run_length_encode(items)\` trả về list các cặp \`[giá_trị, số_lần_lặp_liên_tiếp]\` — mỗi lần giá
trị THAY ĐỔI so với phần tử ngay trước nó sẽ bắt đầu một cặp mới.

**Ví dụ**
- \`run_length_encode([1, 1, 1, 2, 2, 3, 1, 1])\` → \`[[1, 3], [2, 2], [3, 1], [1, 2]]\`
  (chú ý: số \`1\` xuất hiện ở **hai nhóm riêng biệt** vì bị số \`3\` ngăn cách ở giữa — không gộp toàn cục)
- \`run_length_encode([])\` → \`[]\`
`,
      starter: `from itertools import groupby\n\ndef run_length_encode(items):\n    # Tra ve list [gia_tri, so_lan_lap_lien_tiep]\n    \n`,
      tests: [
        { args: [[1, 1, 1, 2, 2, 3, 1, 1]], expected: [[1, 3], [2, 2], [3, 1], [1, 2]], name: 'Có giá trị lặp lại KHÔNG liên tiếp -> vẫn tách nhóm riêng' },
        { args: [[]], expected: [], name: 'Danh sách rỗng' },
        { args: [['a', 'a', 'b']], expected: [['a', 2], ['b', 1]], name: 'Chuỗi ký tự thay vì số' },
        { args: [[5]], expected: [[5, 1]], name: 'Một phần tử duy nhất' },
        { args: [[1, 2, 1, 2]], expected: [[1, 1], [2, 1], [1, 1], [2, 1]], name: 'Xen kẽ hoàn toàn -> mỗi phần tử một nhóm riêng' },
      ],
      hints: [
        '`itertools.groupby(items)` (không truyền `key`, mặc định dùng chính giá trị phần tử) trả về các cặp `(giá_trị, group)`, trong đó `group` là một ITERATOR — cần bọc `list(group)` để lấy số lượng phần tử qua `len(...)`.',
        'Dùng list comprehension: `[[k, len(list(g))] for k, g in groupby(items)]` — vừa gọn vừa đúng ý nghĩa "mỗi lần giá trị đổi là một nhóm mới".',
        'KHÔNG cần `sorted(items)` trước khi gọi `groupby` ở bài này — mục tiêu chính là nhóm theo TÍNH LIÊN TIẾP trong thứ tự gốc, sort trước sẽ phá vỡ đúng ý nghĩa "run-length" (mã hoá theo thứ tự xuất hiện thật).',
      ],
      diagnostics: [
        { test: 'sorted\\s*\\(\\s*items\\s*\\)', message: 'Đừng `sorted(items)` trước khi `groupby` ở bài này — mục tiêu là mã hoá run-length THEO ĐÚNG THỨ TỰ XUẤT HIỆN GỐC, sort trước sẽ làm mất thông tin về việc số 1 ở ví dụ xuất hiện tại hai vị trí tách biệt.' },
      ],
      approach: `
Bài này cho thấy đúng use-case TỰ NHIÊN của \`itertools.groupby\`: **run-length encoding** — nén một chuỗi
bằng cách thay các lần lặp liên tiếp bằng \`(giá_trị, số_lần)\`. Đây là trường hợp \`groupby\` được dùng ĐÚNG
ý nghĩa của nó, không cần sort trước (khác với các trường hợp \`groupby\` bị dùng SAI khi người viết tưởng
nó nhóm toàn cục).

\`\`\`python
from itertools import groupby

def run_length_encode(items):
    return [[k, len(list(g))] for k, g in groupby(items)]
\`\`\`

**Vì sao \`group\` (phần tử thứ hai trả về bởi \`groupby\`) cần bọc \`list(...)\` trước khi \`len(...)\`?** Vì
\`groupby\` trả về \`group\` dưới dạng một **iterator** (để tiết kiệm bộ nhớ, không tạo list thật cho tới khi
cần) — \`len()\` không hoạt động trực tiếp trên iterator (iterator không biết trước số phần tử của mình cho
tới khi duyệt qua hết). Chuyển thành \`list\` trước sẽ "tiêu thụ" toàn bộ iterator, khi đó \`len\` mới tính
được số lượng.
`,
      solution: `from itertools import groupby

def run_length_encode(items):
    return [[k, len(list(g))] for k, g in groupby(items)]`,
      complexity: {
        question: 'Độ phức tạp thời gian của `run_length_encode` theo độ dài n của items?',
        options: ['O(1)', 'O(n) — mỗi phần tử được duyệt qua đúng một lần khi groupby quét tuần tự qua toàn bộ items', 'O(n log n)', 'O(n²)'],
        answer: 1,
        why: '`groupby` quét qua `items` đúng một lượt tuần tự, mỗi phần tử chỉ được xử lý một lần dù nó thuộc nhóm nào — tổng chi phí tuyến tính theo độ dài đầu vào.',
      },
      realWorld: 'Nén dữ liệu run-length encoding (RLE) dùng trong định dạng ảnh bitmap đơn giản, nén log trạng thái thiết bị IoT (chỉ ghi lại "trạng thái X kéo dài bao lâu" thay vì ghi từng mili-giây), hoặc phát hiện các đoạn lặp liên tiếp trong chuỗi DNA/tín hiệu cảm biến.',
    },
    {
      id: 'py-days-between-dates',
      title: 'Số ngày giữa hai mốc thời gian',
      en: 'Days Between Dates',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'days_between',
      lang: 'python',
      statement: `
Viết hàm \`days_between(date1, date2)\` nhận hai chuỗi ngày dạng \`"YYYY-MM-DD"\`, trả về **số ngày chênh
lệch** giữa hai mốc (luôn là số không âm, không quan tâm ngày nào trước/sau).

**Ví dụ**
- \`days_between("2024-01-01", "2024-01-10")\` → \`9\`
- \`days_between("2024-02-28", "2024-03-01")\` → \`2\` (2024 là năm nhuận, tháng 2 có 29 ngày)
- \`days_between("2024-01-01", "2024-01-01")\` → \`0\`
`,
      starter: `from datetime import datetime\n\ndef days_between(date1, date2):\n    # Tra ve so ngay chenh lech tuyet doi giua 2 chuoi "YYYY-MM-DD"\n    \n`,
      tests: [
        { args: ['2024-01-01', '2024-01-10'], expected: 9, name: 'Cùng tháng' },
        { args: ['2024-01-10', '2024-01-01'], expected: 9, name: 'Đảo thứ tự đầu vào, kết quả vẫn không âm' },
        { args: ['2024-01-01', '2024-01-01'], expected: 0, name: 'Hai ngày giống hệt nhau' },
        { args: ['2024-02-28', '2024-03-01'], expected: 2, name: 'Qua năm nhuận (2024 có ngày 29/2)' },
        { args: ['2023-12-25', '2024-01-05'], expected: 11, name: 'Chuyển giao qua năm mới' },
      ],
      hints: [
        '`datetime.strptime(chuoi, "%Y-%m-%d")` parse chuỗi ngày theo đúng định dạng \`"YYYY-MM-DD"\` thành một đối tượng \`datetime\` — \`%Y\` là năm 4 chữ số, \`%m\` là tháng 2 chữ số, \`%d\` là ngày 2 chữ số.',
        'Trừ hai đối tượng \`datetime\` cho nhau (\`d2 - d1\`) cho ra một đối tượng \`timedelta\`, có thuộc tính \`.days\` là số ngày chênh lệch (có thể ÂM nếu \`d1\` sau \`d2\`).',
        'Dùng \`abs(...)\` quanh kết quả \`.days\` để đảm bảo LUÔN trả về số không âm, không phụ thuộc thứ tự truyền \`date1\`/\`date2\`.',
      ],
      diagnostics: [
        { test: '\\(\\s*int\\s*\\(\\s*date2\\[', message: 'Đừng tự tách chuỗi ngày bằng tay rồi tính công thức thủ công (dễ sai ở năm nhuận, độ dài tháng khác nhau) — hãy dùng `datetime.strptime` để parse và trừ hai đối tượng `datetime`, để Python tự lo phần lịch phức tạp.' },
      ],
      approach: `
Bài này minh hoạ đúng thông điệp cốt lõi: đừng tự tính lịch bằng tay, hãy để \`datetime\` xử lý phần phức
tạp (năm nhuận, độ dài tháng khác nhau).

\`\`\`python
from datetime import datetime

def days_between(date1, date2):
    d1 = datetime.strptime(date1, "%Y-%m-%d")
    d2 = datetime.strptime(date2, "%Y-%m-%d")
    return abs((d2 - d1).days)
\`\`\`

**Vì sao không tự viết công thức "số ngày mỗi tháng" bằng tay?** Vì phải xử lý ĐÚNG rất nhiều trường hợp
biên dễ sai: năm nào là năm nhuận (chia hết cho 4, nhưng KHÔNG chia hết cho 100, TRỪ KHI chia hết cho 400 —
một quy tắc ba tầng dễ code sai), tháng nào có 30/31 ngày, chuyển giao qua năm mới... \`datetime\` đã đóng
gói toàn bộ logic này, được kiểm thử qua hàng triệu ứng dụng — tự viết lại gần như luôn có bug ở một trường
hợp biên nào đó mà bạn chưa nghĩ tới khi viết test.
`,
      solution: `from datetime import datetime

def days_between(date1, date2):
    d1 = datetime.strptime(date1, "%Y-%m-%d")
    d2 = datetime.strptime(date2, "%Y-%m-%d")
    return abs((d2 - d1).days)`,
      complexity: {
        question: 'Độ phức tạp thời gian của `days_between`?',
        options: ['O(1) — parse hai chuỗi có độ dài cố định và trừ hai giá trị số, không phụ thuộc vào khoảng cách giữa hai ngày', 'O(n) theo số ngày chênh lệch giữa hai mốc', 'O(log n)', 'O(n²)'],
        answer: 0,
        why: 'Chuỗi ngày luôn có độ dài cố định ("YYYY-MM-DD"), và việc trừ hai đối tượng `datetime` là phép toán số học nội bộ không phụ thuộc khoảng cách thực tế giữa hai ngày — dù hai ngày cách nhau 1 ngày hay 100 năm, chi phí tính toán như nhau.',
      },
      realWorld: 'Tính số ngày còn lại của gói dịch vụ/subscription, tính hạn thanh toán hoá đơn, tính tuổi chính xác theo ngày sinh — mọi hệ thống quản lý có yếu tố thời gian đều cần phép tính này chính xác tuyệt đối, sai một ngày có thể gây tranh chấp thực tế với khách hàng.',
    },
    {
      id: 'py-bisect-rank',
      title: 'Xếp hạng trên danh sách đã sắp xếp (bisect)',
      en: 'Ranking with bisect',
      difficulty: 'Medium',
      targetMinutes: 14,
      entry: 'rank_pairs',
      lang: 'python',
      statement: `
Cho \`scores\` là danh sách điểm **đã sắp xếp tăng dần** (có thể có giá trị trùng nhau) và \`queries\` là
danh sách các điểm cần tra cứu.

Với **mỗi** query \`q\`, trả về một cặp \`[số phần tử < q, số phần tử <= q]\`.
Kết quả cuối cùng là danh sách các cặp đó, theo đúng thứ tự \`queries\`.

**Ví dụ** với \`scores = [10, 20, 20, 30]\`
- \`q = 20\` → \`[1, 3]\` (một phần tử nhỏ hơn 20; ba phần tử nhỏ hơn hoặc bằng 20)
- \`q = 25\` → \`[3, 3]\` (không có phần tử nào bằng 25 nên hai con số trùng nhau)
- \`q = 5\` → \`[0, 0]\`

> Yêu cầu về hiệu năng: mỗi query phải chạy trong **O(log n)**, không được duyệt lại cả danh sách.
`,
      starter: `import bisect\n\n\ndef rank_pairs(scores, queries):\n    # Mỗi query -> [số phần tử < q, số phần tử <= q]\n    \n`,
      tests: [
        { args: [[10, 20, 20, 30], [20]], expected: [[1, 3]], name: 'Giá trị trùng lặp — hai con số khác nhau' },
        { args: [[10, 20, 20, 30], [25]], expected: [[3, 3]], name: 'Giá trị không tồn tại' },
        { args: [[10, 20, 20, 30], [5, 35]], expected: [[0, 0], [4, 4]], name: 'Ngoài hai biên' },
        { args: [[], [7]], expected: [[0, 0]], name: 'Danh sách rỗng' },
        { args: [[1, 1, 1], [1]], expected: [[0, 3]], name: 'Toàn bộ đều bằng nhau' },
        { args: [[1, 2, 3], [1, 2, 3]], expected: [[0, 1], [1, 2], [2, 3]], name: 'Nhiều query' },
        { args: [[10, 20, 20, 30], [30]], expected: [[3, 4]], name: 'Phần tử cuối cùng' },
        { args: [[5], []], expected: [], name: 'Không có query nào' },
      ],
      hints: [
        'Module `bisect` làm sẵn tìm kiếm nhị phân cho bạn. Hai hàm cốt lõi: `bisect_left(a, x)` và `bisect_right(a, x)` — cả hai đều trả về **vị trí chèn** để danh sách vẫn giữ thứ tự.',
        'Điểm khác nhau nằm ở chỗ chúng chèn vào đâu khi `x` đã tồn tại: `bisect_left` chèn TRƯỚC nhóm giá trị bằng `x`, `bisect_right` chèn SAU nhóm đó.',
        'Suy ra ý nghĩa đếm: `bisect_left(a, x)` chính bằng **số phần tử nhỏ hơn x**, còn `bisect_right(a, x)` bằng **số phần tử nhỏ hơn hoặc bằng x**. Hiệu của chúng là số lần x xuất hiện.',
      ],
      diagnostics: [
        { test: '\\.count\\s*\\(|len\\s*\\(\\s*\\[\\s*\\w+\\s+for', message: 'Đếm bằng `count()` hoặc comprehension là O(n) cho MỖI query — với nhiều query thì thành O(n × m). Danh sách đã được sắp xếp sẵn, hãy tận dụng bằng tìm kiếm nhị phân O(log n).' },
        { test: 'sorted\\s*\\(\\s*scores|scores\\.sort\\s*\\(', message: '`scores` đã được sắp xếp sẵn theo đề bài — sắp xếp lại là O(n log n) thừa, và làm mất luôn ưu điểm chính của cấu trúc dữ liệu này.' },
        { test: 'bisect\\.bisect\\s*\\((?![\\s\\S]*bisect_left)', message: '`bisect.bisect` là bí danh của `bisect_right`. Bài này cần CẢ HAI biến thể — hãy gọi tên đầy đủ `bisect_left` và `bisect_right` để code nói rõ ý định.' },
      ],
      approach: `
Danh sách đã sắp xếp là một cấu trúc dữ liệu có "siêu năng lực" mà nhiều người bỏ phí: mọi câu hỏi dạng
*"có bao nhiêu phần tử nhỏ hơn X"* đều trả lời được trong \`O(log n)\`.

\`\`\`python
import bisect

def rank_pairs(scores, queries):
    return [[bisect.bisect_left(scores, q), bisect.bisect_right(scores, q)] for q in queries]
\`\`\`

**Chìa khoá là hiểu \`bisect_left\` và \`bisect_right\` nói gì.** Cả hai trả lời cùng một câu hỏi — *"chèn
x vào đâu thì danh sách vẫn có thứ tự?"* — nhưng khác nhau khi \`x\` đã có mặt:

\`\`\`
scores = [10, 20, 20, 30]
                ↑       ↑
      bisect_left(20)=1  bisect_right(20)=3
\`\`\`

Từ đó suy ra ba công thức đáng thuộc:

| Cần biết | Công thức |
|---|---|
| số phần tử **< x** | \`bisect_left(a, x)\` |
| số phần tử **<= x** | \`bisect_right(a, x)\` |
| số lần **x xuất hiện** | \`bisect_right(a, x) - bisect_left(a, x)\` |

**Vì sao không tự viết binary search?** Không phải vì khó, mà vì binary search là thuật toán **nổi tiếng
dễ viết sai** ở các điều kiện biên (\`<\` hay \`<=\`, \`mid\` hay \`mid+1\`) — đúng loại lỗi chỉ lộ ra với dữ
liệu trùng lặp hoặc ở hai đầu mảng. \`bisect\` là code C đã được kiểm nghiệm hàng chục năm.

**Người anh em cần biết: \`bisect.insort(a, x)\`** chèn \`x\` vào đúng vị trí, giữ danh sách luôn có thứ tự.
Nhưng chú ý bản chất: tìm vị trí là O(log n), còn **chèn vào giữa list vẫn là O(n)** vì phải dịch chuyển
phần đuôi. Nếu bạn cần chèn liên tục với tần suất cao, hãy cân nhắc heap (\`heapq\`) hoặc cây cân bằng thay
vì list đã sắp xếp.
`,
      solution: `import bisect


def rank_pairs(scores, queries):
    result = []
    for q in queries:
        lower = bisect.bisect_left(scores, q)
        upper = bisect.bisect_right(scores, q)
        result.append([lower, upper])
    return result`,
      complexity: {
        question: 'Độ phức tạp thời gian với n phần tử và m query?',
        options: [
          'O(m log n) — mỗi query là hai lần tìm kiếm nhị phân',
          'O(n × m) vì mỗi query phải duyệt danh sách',
          'O(n log n + m)',
          'O(n + m)',
        ],
        answer: 0,
        why: 'Mỗi `bisect_*` là O(log n) và mỗi query gọi hai lần → O(m log n). So sánh cho rõ khoảng cách: với n = 1.000.000 và m = 1.000, cách duyệt tuần tự tốn khoảng một tỷ phép so sánh, còn bisect chỉ tốn khoảng 40.000 — nhanh hơn hàng chục nghìn lần, chỉ nhờ tận dụng dữ liệu đã sắp xếp.',
      },
      realWorld: 'Bảng xếp hạng game ("bạn đứng trên bao nhiêu phần trăm người chơi"), phân vị điểm thi, tra khung thuế/khung giá theo bậc, tìm bản ghi log gần một mốc thời gian nhất, và ánh xạ giá trị ngẫu nhiên sang phân phối có trọng số (`random.choices` dùng chính `bisect` bên trong).',
    },
    {
      id: 'py-lru-cache-ordereddict',
      title: 'Tự cài LRU cache bằng OrderedDict',
      en: 'LRU Cache with OrderedDict',
      difficulty: 'Hard',
      targetMinutes: 22,
      entry: 'lru_ops',
      lang: 'python',
      statement: `
Cài đặt một **LRU cache** (Least Recently Used — loại bỏ mục ít được dùng gần đây nhất) rồi chạy một chuỗi
thao tác.

Viết hàm \`lru_ops(capacity, ops)\`. Mỗi phần tử của \`ops\` là:
- \`["put", key, value]\` — ghi giá trị. Nếu vượt sức chứa, **loại bỏ mục ít được dùng gần đây nhất**.
- \`["get", key]\` — đọc giá trị, trả về \`None\` nếu không có.

Cả \`get\` **và** \`put\` (kể cả khi ghi đè khoá đã có) đều làm khoá đó trở thành **mới dùng nhất**.

Trả về danh sách kết quả của **các thao tác \`get\`**, theo thứ tự chúng xuất hiện.

**Ví dụ** với \`capacity = 2\`:
\`\`\`
put a=1, put b=2, get a, put c=3, get b
\`\`\`
→ \`[1, None]\`
(\`get a\` trả 1 và đẩy \`a\` lên mới nhất; \`put c\` vì thế loại bỏ \`b\` chứ không phải \`a\`.)
`,
      starter: `from collections import OrderedDict\n\n\ndef lru_ops(capacity, ops):\n    # Trả về danh sách kết quả của các thao tác "get"\n    \n`,
      tests: [
        { args: [2, [['put', 'a', 1], ['put', 'b', 2], ['get', 'a'], ['put', 'c', 3], ['get', 'b']]], expected: [1, null], name: 'get làm đổi thứ tự loại bỏ' },
        { args: [1, [['put', 'a', 1], ['put', 'b', 2], ['get', 'a']]], expected: [null], name: 'Sức chứa 1' },
        { args: [2, [['get', 'x']]], expected: [null], name: 'Đọc khoá chưa từng có' },
        { args: [2, [['put', 'a', 1], ['put', 'a', 2], ['get', 'a']]], expected: [2], name: 'Ghi đè khoá cũ' },
        { args: [3, [['put', 'a', 1], ['put', 'b', 2], ['put', 'c', 3], ['get', 'a'], ['put', 'd', 4], ['get', 'b'], ['get', 'a']]], expected: [1, null, 1], name: 'Sức chứa 3, loại bỏ đúng b' },
        { args: [2, [['put', 'a', 1], ['put', 'b', 2], ['put', 'a', 9], ['put', 'c', 3], ['get', 'b'], ['get', 'a']]], expected: [null, 9], name: 'put cũng làm mới độ ưu tiên' },
        { args: [2, []], expected: [], name: 'Không có thao tác nào' },
        { args: [2, [['put', 'a', 1], ['get', 'a'], ['get', 'a']]], expected: [1, 1], name: 'Đọc lặp lại' },
      ],
      hints: [
        '`OrderedDict` là `dict` có thêm khả năng **di chuyển khoá trong thứ tự**. Quy ước tiện dụng: coi đầu danh sách là "cũ nhất", cuối là "mới nhất".',
        'Hai phương thức bạn cần: `cache.move_to_end(key)` đẩy một khoá xuống cuối (đánh dấu vừa dùng), và `cache.popitem(last=False)` lấy ra **phần tử đầu tiên** — tức mục ít dùng gần đây nhất.',
        'Khung xử lý `put`: nếu khoá đã có → gán giá trị mới rồi `move_to_end`. Nếu chưa có → gán rồi kiểm tra `if len(cache) > capacity: cache.popitem(last=False)`. Với `get`: nếu không có → `None`; nếu có → `move_to_end` rồi mới trả về giá trị.',
      ],
      diagnostics: [
        { test: 'min\\s*\\(|\\.index\\s*\\(', message: 'Tìm mục ít dùng nhất bằng `min()` hoặc `index()` là O(n) cho mỗi thao tác — làm hỏng đúng cái tính chất khiến LRU cache đáng dùng. `OrderedDict` cho bạn thao tác đó trong O(1).' },
        { test: 'popitem\\s*\\(\\s*\\)', message: '`popitem()` không tham số lấy phần tử **cuối** (mới dùng nhất) — ngược hoàn toàn với ý định. Bạn cần `popitem(last=False)` để lấy phần tử đầu, tức mục cũ nhất.' },
        { test: '(?<!\\.)\\bget\\s*\\(\\s*key\\s*\\)(?![\\s\\S]*move_to_end)', message: 'Nhớ rằng thao tác `get` THÀNH CÔNG cũng phải cập nhật độ ưu tiên (`move_to_end`). Nếu chỉ đọc mà không cập nhật, bạn đang cài FIFO chứ không phải LRU — và test đầu tiên sẽ loại bỏ nhầm phần tử.' },
      ],
      approach: `
LRU cache là bài toán kinh điển vì nó đòi hỏi **hai thao tác O(1) cùng lúc**: tra cứu theo khoá, và biết
được phần tử nào cũ nhất. \`dict\` cho bạn cái thứ nhất, danh sách liên kết cho cái thứ hai — và
\`OrderedDict\` chính là hai thứ đó ghép sẵn với nhau.

\`\`\`python
from collections import OrderedDict

def lru_ops(capacity, ops):
    cache = OrderedDict()      # đầu = cũ nhất, cuối = mới nhất
    results = []

    for op in ops:
        if op[0] == "put":
            _, key, value = op
            cache[key] = value
            cache.move_to_end(key)             # vừa dùng -> đẩy xuống cuối
            if len(cache) > capacity:
                cache.popitem(last=False)      # loại bỏ mục ở ĐẦU = cũ nhất
        else:
            key = op[1]
            if key not in cache:
                results.append(None)
            else:
                cache.move_to_end(key)         # đọc CŨNG là "vừa dùng"
                results.append(cache[key])

    return results
\`\`\`

**Chi tiết phân biệt LRU thật với LRU giả:** \`get\` cũng phải cập nhật thứ tự. Bỏ dòng \`move_to_end\` trong
nhánh \`get\`, bạn được một cache FIFO — vẫn chạy, vẫn qua nhiều test, nhưng loại bỏ nhầm mục đang được
đọc liên tục. Test đầu tiên của bài được thiết kế riêng để phát hiện điều này.

**Vì sao dùng \`OrderedDict\` chứ không phải \`dict\` thường?** Từ Python 3.7, \`dict\` cũng giữ thứ tự chèn,
nhưng nó **không có** \`move_to_end\` và \`popitem(last=False)\`. Với \`dict\`, muốn "làm mới" một khoá bạn
phải \`del d[k]\` rồi gán lại — vẫn O(1) nhưng dài dòng hơn; còn muốn lấy phần tử đầu thì phải
\`next(iter(d))\`, và đây đúng là loại code khiến người đọc sau phải dừng lại đoán ý.

**Trong thực tế:** \`functools.lru_cache\` đã làm sẵn tất cả những điều này (bằng danh sách liên kết vòng
viết bằng C) cho việc cache **kết quả hàm**. Tự cài như bài này chỉ cần thiết khi bạn phải kiểm soát cache
theo khoá tự chọn, cần thêm TTL, hoặc cần thống kê hit/miss riêng.
`,
      solution: `from collections import OrderedDict


def lru_ops(capacity, ops):
    cache = OrderedDict()
    results = []

    for op in ops:
        if op[0] == "put":
            key, value = op[1], op[2]
            cache[key] = value
            cache.move_to_end(key)
            if len(cache) > capacity:
                cache.popitem(last=False)
        else:
            key = op[1]
            if key not in cache:
                results.append(None)
            else:
                cache.move_to_end(key)
                results.append(cache[key])

    return results`,
      complexity: {
        question: 'Độ phức tạp thời gian cho m thao tác, với sức chứa c?',
        options: [
          'O(m) — mỗi thao tác là O(1) khấu hao nhờ bảng băm cộng danh sách liên kết hai chiều',
          'O(m × c) vì mỗi lần loại bỏ phải quét toàn bộ cache',
          'O(m log c)',
          'O(m²)',
        ],
        answer: 0,
        why: '`OrderedDict` kết hợp bảng băm (tra cứu khoá O(1)) với danh sách liên kết hai chiều (di chuyển và lấy phần tử ở hai đầu O(1)). `move_to_end` chỉ nối lại vài con trỏ, `popitem(last=False)` gỡ nút đầu — không có vòng lặp nào. Bộ nhớ là O(c), đúng bằng sức chứa, đó chính là mục đích của cache.',
      },
      realWorld: 'Cache truy vấn database, bộ nhớ đệm ảnh/thumbnail trong ứng dụng di động, cache DNS, và bộ đệm trang của hệ điều hành đều dùng LRU hoặc biến thể của nó. Đây cũng là câu hỏi phỏng vấn xuất hiện thường xuyên nhất về cấu trúc dữ liệu — và điểm người ta hay bị hỏi thêm chính là: "vì sao `get` cũng phải cập nhật thứ tự?".',
    },
  ],
},
];
