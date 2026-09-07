/**
 * NHÓM 1 — Nền móng: Arrays & Hashing, Two Pointers, Sliding Window
 */

export default [
/* ==================================================================== */
{
  id: 'arrays-hashing',
  name: 'Mảng & Bảng băm',
  en: 'Arrays & Hashing',
  icon: '🗂️',
  days: [1, 2, 3],
  summary: 'Đổi bộ nhớ lấy tốc độ: biến phép "tìm kiếm" O(n) thành phép "tra cứu" O(1).',
  lesson: `
## 1. Vấn đề gốc

Mảng cho bạn **truy cập theo chỉ số** cực nhanh: \`a[7]\` là O(1) vì máy tính chỉ cần tính
\`địa_chỉ_đầu + 7 * kích_thước_phần_tử\`. Nhưng khi câu hỏi đổi thành **"giá trị 42 nằm ở đâu?"**
thì mảng bó tay — bạn phải quét từng phần tử, O(n).

Hầu hết bài toán "chậm" ở mức người mới đều có chung một hình dạng:

\`\`\`js
for (let i = 0; i < n; i++)
  for (let j = 0; j < n; j++)   // <-- vòng lặp thứ hai chỉ để ĐI TÌM một thứ
    if (a[j] === somethingAbout(a[i])) ...
\`\`\`

Vòng lặp bên trong không hề "tính toán" gì — nó chỉ **đi tìm**. Nếu xoá được nó, O(n²) tụt xuống O(n).

## 2. Ý tưởng cốt lõi

> **Bảng băm = đánh đổi bộ nhớ để mua thời gian.**
> Thay vì đi tìm, ta ghi sẵn "vật ở đâu" vào một cuốn sổ tra cứu.

Hàm băm biến một khoá bất kỳ (chuỗi, số, tuple) thành một chỉ số mảng. Nhờ vậy \`map.get(key)\`
cũng chỉ là một phép truy cập theo chỉ số — O(1) trung bình.

Mental model: **danh bạ điện thoại**. Tìm số của "Minh" trong danh sách 10.000 người chưa sắp xếp
mất 10.000 bước. Có danh bạ sắp theo tên: mở đúng trang, 1 bước.

## 3. Dấu hiệu nhận biết (rất quan trọng)

Thấy một trong các câu này trong đề bài → nghĩ ngay tới Set/Map:

| Câu hỏi trong đề | Cấu trúc nên dùng |
|---|---|
| "Có phần tử nào lặp lại không?" | \`Set\` |
| "Đếm số lần xuất hiện" | \`Map\` (value = count) |
| "Tôi cần tìm phần bù \`target - x\`" | \`Map\` (value = index) |
| "Nhóm các phần tử *giống nhau theo một tiêu chí*" | \`Map\` (key = chữ ký/signature) |
| "Tổng của đoạn con \`[i..j]\`" | Mảng tổng tiền tố (prefix sum) |

Mẹo tổng quát: **hãy hỏi "khoá là gì?"**. Nghĩ ra đúng khoá thì bài toán tự giải.
Với "nhóm các từ đảo chữ", khoá là *chuỗi đã sắp xếp ký tự* — đó là toàn bộ lời giải.

## 4. Mẫu code cần thuộc lòng

\`\`\`js
// (a) Đếm tần suất
const count = new Map();
for (const x of arr) count.set(x, (count.get(x) || 0) + 1);

// (b) Kiểm tra đã gặp chưa
const seen = new Set();
for (const x of arr) {
  if (seen.has(x)) return true;
  seen.add(x);
}

// (c) Tra phần bù (two-sum pattern)
const pos = new Map();            // value -> index
for (let i = 0; i < arr.length; i++) {
  const need = target - arr[i];
  if (pos.has(need)) return [pos.get(need), i];
  pos.set(arr[i], i);             // LƯU SAU khi kiểm tra -> tránh dùng lại chính nó
}

// (d) Nhóm theo chữ ký
const groups = new Map();
for (const w of words) {
  const key = signature(w);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(w);
}

// (e) Tổng tiền tố: sum(i..j) = pre[j+1] - pre[i]
const pre = [0];
for (const x of arr) pre.push(pre.at(-1) + x);
\`\`\`

## 5. Bẫy thường gặp

- **Dùng \`Object\` thay \`Map\` với khoá số**: key bị ép về chuỗi, và \`{}\` có sẵn các key kế thừa
  (\`toString\`...). Bài phỏng vấn thật: dùng \`Map\`/\`Set\`.
- **\`arr.includes(x)\` trong vòng lặp**: trông gọn nhưng chính là O(n) ẩn → tổng O(n²). Đây là lỗi
  làm rớt phỏng vấn nhiều nhất.
- **Ghi vào Map trước khi kiểm tra** ở mẫu (c) → tự khớp với chính mình.
- **Worst case O(n)**: băm là O(1) *trung bình*. Kẻ tấn công có thể tạo hash collision (hashDoS).
  Trong phỏng vấn cứ nói O(n) trung bình, nhưng biết là có worst case sẽ ghi điểm.

## 6. Ứng dụng thực tế

- **Chống trùng lặp**: khử trùng log/sự kiện bằng \`Set\` các \`event_id\` (idempotency key trong thanh toán).
- **Cache / memoization**: Redis chính là một bảng băm phân tán khổng lồ.
- **Chỉ mục database**: hash index cho truy vấn \`WHERE id = ?\`.
- **Phát hiện file trùng**: băm nội dung (SHA-256) rồi so khoá thay vì so từng byte.
- **Đếm sự kiện analytics**: \`Map<user_id, count>\` — chính là mẫu (a).
- **Prefix sum** là nền tảng của mọi bảng thống kê tích luỹ (doanh thu luỹ kế, biểu đồ đường).

## 7. Bảng độ phức tạp

| Thao tác | Mảng | Set/Map (băm) |
|---|---|---|
| Truy cập theo chỉ số | O(1) | — |
| Tìm theo giá trị | O(n) | O(1) trung bình |
| Thêm/xoá cuối | O(1) | O(1) |
| Thêm/xoá giữa | O(n) | O(1) |
| Bộ nhớ | thấp | cao hơn ~2-3 lần |
`,
  lessonPy: `
## 1. Vấn đề gốc

Mảng (\`list\`) cho bạn **truy cập theo chỉ số** cực nhanh: \`a[7]\` là O(1) — máy tính chỉ cần nhảy
thẳng tới địa chỉ bộ nhớ số 7, không cần xem qua sáu ô trước đó. Nhưng khi câu hỏi đổi dạng, từ
*"ô số 7 chứa gì?"* thành **"giá trị 42 nằm ở ô nào?"**, thì \`list\` hoàn toàn bó tay — nó không biết
đường tắt nào cả, phải đi hỏi từng ô một: "có phải mày không? có phải mày không?..." cho tới khi tìm
thấy hoặc hết mảng. Đó là O(n).

Hãy nhìn cụ thể một bài toán chậm ở mức người mới hay viết ra đầu tiên: kiểm tra một mảng có hai phần
tử nào giống nhau không.

\`\`\`python
def has_duplicate_cham(a):
    n = len(a)
    for i in range(n):
        for j in range(n):          # <-- vòng lặp thứ hai chỉ để ĐI TÌM một thứ
            if i != j and a[i] == a[j]:
                return True
    return False
\`\`\`

Với \`a\` có 10 phần tử, vòng lặp ngoài chạy 10 lần, mỗi lần vòng lặp trong lại quét lại **toàn bộ**
10 phần tử để "đi hỏi": có ai bằng \`a[i]\` không? Tổng cộng khoảng 10 × 10 = 100 phép so sánh cho
10 phần tử — nếu mảng có 100.000 phần tử, con số đó là 10 tỷ. Vòng lặp bên trong không hề "tính toán"
gì mới cả — nó chỉ lặp lại đúng một câu hỏi đã hỏi rồi. Đây chính là dấu hiệu để nhận ra: **nếu vòng
lặp trong chỉ để "đi tìm" chứ không tính gì mới, gần như luôn có cách xoá nó, đưa O(n²) về O(n).**

## 2. Ý tưởng cốt lõi

> **\`dict\`/\`set\` = đánh đổi bộ nhớ để mua thời gian.**
> Thay vì mỗi lần đi hỏi lại từ đầu, ta ghi sẵn "đã thấy gì rồi" vào một cuốn sổ tra cứu (bảng băm),
> và tra cuốn sổ đó thay vì quét lại mảng.

Cơ chế bên trong: một **hàm băm** (hash function) biến một khoá bất kỳ (số, chuỗi, tuple...) thành
một con số, con số đó lại được dùng làm chỉ số trong một mảng nội bộ (giống hệt \`a[7]\` ở trên).
Nhờ vậy \`d[key]\` thực chất cũng chỉ là một phép **truy cập theo chỉ số** — chính là phép toán O(1)
ở phần 1, chỉ khác là chỉ số được máy tự tính ra từ \`key\` thay vì do bạn gõ tay. Đây là lý do vì sao
tra cứu trong \`dict\`/\`set\` nhanh ngang truy cập mảng, thay vì phải quét tuần tự như \`list\`.

Viết lại bài trên bằng \`set\` — không còn vòng lặp lồng nhau:

\`\`\`python
def has_duplicate_nhanh(a):
    seen = set()           # cuốn sổ "đã thấy những gì"
    for x in a:
        if x in seen:       # tra sổ — O(1), KHÔNG quét lại toàn bộ seen
            return True
        seen.add(x)          # ghi thêm vào sổ
    return False
\`\`\`

Chạy thử bằng tay với \`a = [3, 1, 4, 1]\`: \`seen\` bắt đầu rỗng.
Bước 1: \`x=3\`, \`3\` chưa có trong \`seen\` → thêm, \`seen = {3}\`.
Bước 2: \`x=1\`, \`1\` chưa có → thêm, \`seen = {3, 1}\`.
Bước 3: \`x=4\`, chưa có → thêm, \`seen = {3, 1, 4}\`.
Bước 4: \`x=1\`, **đã có trong seen** → trả về \`True\` ngay, không cần quét lại \`a\`.
Chỉ một lượt duyệt \`a\`, mỗi bước tốn O(1) để tra/ghi sổ → tổng O(n), không phải O(n²).

Mental model dễ nhớ nhất: **danh bạ điện thoại**. Tìm số của "Minh" trong danh sách 10.000 người
*chưa sắp xếp* mất tới 10.000 bước dò từng dòng. Có một cuốn danh bạ đã đánh chỉ mục theo tên: bạn mở
thẳng đúng mục, 1 bước là xong. \`dict\`/\`set\` chính là cuốn danh bạ đó, còn hàm băm là "quy tắc đánh
chỉ mục" chạy ngầm bên dưới mà bạn không cần tự viết.

## 3. Cấu trúc & hàm Python thường dùng trong chủ đề này

| Tên | Vai trò | Ví dụ dùng nhanh |
|---|---|---|
| \`set\` | Tập hợp không trùng lặp, kiểm tra "đã có chưa" trong O(1) | \`seen = set(); seen.add(x); x in seen\` |
| \`dict\` | Ánh xạ khoá → giá trị, tra cứu O(1) | \`d = {}; d[key] = value; d.get(key, mac_dinh)\` |
| \`dict.get(k, mac_dinh)\` | Đọc giá trị, không ném lỗi nếu khoá chưa tồn tại | \`count.get(x, 0)\` thay vì \`count[x]\` (sẽ \`KeyError\`) |
| \`collections.Counter\` | \`dict\` chuyên đếm số lần xuất hiện, có sẵn \`.most_common()\` | \`Counter(arr)\` đếm tần suất chỉ trong 1 dòng |
| \`collections.defaultdict\` | \`dict\` tự tạo giá trị mặc định khi gặp khoá mới, khỏi phải \`if key not in d\` | \`defaultdict(list)\` cho bài "gom nhóm" |
| \`enumerate(arr)\` | Duyệt vừa lấy chỉ số vừa lấy giá trị, khỏi phải \`range(len(arr))\` rồi \`arr[i]\` | \`for i, x in enumerate(arr): ...\` |
| \`sorted(s)\` | Trả về **danh sách ký tự/phần tử đã sắp** — dùng làm "chữ ký" so khớp anagram | \`sorted("eat")\` → \`['a','e','t']\` |
| \`"".join(list_ky_tu)\` | Ghép một list ký tự lại thành chuỗi (để dùng chuỗi làm khoá dict) | \`"".join(sorted("eat"))\` → \`"aet"\` |
| \`tuple(...)\` | Biến một list thành \`tuple\` — bất biến nên **hashable**, dùng làm khoá dict/phần tử set được | \`tuple(sorted(word))\` làm khoá anagram |
| \`hashlib.sha256\` | Băm nội dung (chuỗi/byte) thành một chuỗi cố định — so trùng nội dung lớn mà không so từng byte | \`hashlib.sha256(data).hexdigest()\` |

## 4. Dấu hiệu nhận biết (rất quan trọng)

Thấy một trong các câu này trong đề bài → nghĩ ngay tới \`set\`/\`dict\`:

| Câu hỏi trong đề | Cấu trúc nên dùng |
|---|---|
| "Có phần tử nào lặp lại không?" | \`set\` |
| "Đếm số lần xuất hiện" | \`dict\` hoặc \`collections.Counter\` |
| "Tôi cần tìm phần bù \`target - x\`" | \`dict\` (value = index) |
| "Nhóm các phần tử *giống nhau theo một tiêu chí*" | \`dict\` (key = chữ ký/signature) |
| "Tổng của đoạn con \`[i..j]\`" | Mảng tổng tiền tố (prefix sum) |

Mẹo tổng quát: **hãy hỏi "khoá là gì?"**. Nghĩ ra đúng khoá thì bài toán tự giải.
Với "nhóm các từ đảo chữ", khoá là *chuỗi đã sắp xếp ký tự* (hoặc tốt hơn: \`tuple\` đếm 26 chữ cái) —
đó là toàn bộ lời giải.

## 5. Mẫu code cần thuộc lòng

**(a) Đếm tần suất** — bài toán con xuất hiện trong hầu hết mọi đề: "phần tử nào xuất hiện nhiều
nhất/đúng k lần?"

\`\`\`python
from collections import Counter

def dem_tan_suat(arr):
    # Cách nhanh nhất: Counter là dict chuyên dụng để đếm, chỉ 1 dòng
    count = Counter(arr)
    print(count)                 # Counter({1: 3, 2: 1})  — arr = [1,1,1,2]
    print(count.most_common(1))  # [(1, 3)] — phần tử xuất hiện nhiều nhất, kèm số lần
    return count

# Nếu không dùng Counter, tự đếm bằng dict thường — CÙNG bản chất, chỉ dài hơn:
def dem_tan_suat_tu_tay(arr):
    count = {}
    for x in arr:
        count[x] = count.get(x, 0) + 1   # get(x, 0): nếu x CHƯA có khoá, coi như đang đếm từ 0
    return count
\`\`\`

**(b) Kiểm tra đã gặp chưa** — dùng cho "có phần tử trùng không?", "hai mảng có giao nhau không?".

\`\`\`python
def co_phan_tu_trung(arr):
    seen = set()              # "cuốn sổ" các giá trị đã thấy
    for x in arr:
        if x in seen:          # tra sổ — O(1)
            return True
        seen.add(x)             # chưa có -> ghi vào sổ rồi đi tiếp
    return False
\`\`\`

**(c) Tra phần bù (khuôn mẫu Two Sum)** — bất cứ khi nào đề có dạng "tìm hai phần tử có tổng/hiệu
bằng X", đây là khuôn mẫu cần nhớ, không phải nghĩ lại từ đầu:

\`\`\`python
def two_sum(nums, target):
    pos = {}                          # giá trị đã duyệt qua -> chỉ số của nó
    for i, x in enumerate(nums):       # enumerate: vừa có chỉ số i, vừa có giá trị x
        need = target - x              # "mình đang thiếu giá trị nào để đủ target?"
        if need in pos:                 # đã từng thấy giá trị mình cần chưa?
            return [pos[need], i]
        pos[x] = i                      # LƯU SAU khi kiểm tra -> tránh việc x tự ghép với chính nó
    return []                            # đề bài đảm bảo luôn có đáp án thì dòng này không tới lượt chạy

print(two_sum([2, 7, 11, 15], 9))   # [0, 1] vì nums[0] + nums[1] == 2 + 7 == 9
\`\`\`

**(d) Nhóm theo chữ ký** — dùng cho "gom các phần tử giống nhau theo một tiêu chí nào đó vào chung
nhóm" (ví dụ: các từ là đảo chữ của nhau).

\`\`\`python
from collections import defaultdict

def nhom_anagram(words):
    groups = defaultdict(list)     # khoá chưa tồn tại -> tự tạo list() rỗng, khỏi cần kiểm tra tay
    for w in words:
        key = "".join(sorted(w))     # "chữ ký": sắp xếp ký tự rồi nối lại thành chuỗi
        groups[key].append(w)         # mọi từ có cùng chữ ký sẽ rơi vào cùng một list
    return list(groups.values())

print(nhom_anagram(["eat", "tea", "tan", "ate", "nat", "bat"]))
# [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
# "eat" và "tea" cùng chữ ký "aet" nên vào chung nhóm; "bat" chữ ký "abt" không trùng ai nên đứng riêng.
\`\`\`

**(e) Tổng tiền tố (prefix sum)** — dùng cho "tính tổng của một đoạn con \`[i, j]\` nhiều lần".

\`\`\`python
def xay_prefix_sum(arr):
    pre = [0]                 # pre[0] = 0: quy ước "tổng của 0 phần tử đầu tiên"
    for x in arr:
        pre.append(pre[-1] + x)  # pre[k] = tổng của k phần tử đầu tiên trong arr
    return pre

arr = [3, 1, 4, 1, 5]
pre = xay_prefix_sum(arr)      # pre = [0, 3, 4, 8, 9, 14]
# Muốn tổng đoạn [1, 3] (tức arr[1] + arr[2] + arr[3] = 1 + 4 + 1 = 6):
print(pre[3 + 1] - pre[1])      # pre[4] - pre[1] = 9 - 3 = 6 — đúng, và chỉ tốn O(1), không cần duyệt lại
\`\`\`

## 6. Bẫy thường gặp

- **Dùng \`list\` làm khoá \`dict\`/phần tử \`set\`**: \`TypeError: unhashable type: 'list'\`. List là
  mutable nên không hashable. Cần khoá là tập hợp bất biến thì dùng \`tuple\`.
- **\`x in arr\` với \`arr\` là \`list\` bên trong vòng lặp**: trông gọn (\`in\` là cú pháp Python "sạch")
  nhưng chính là O(n) ẩn → tổng O(n²). Đây là lỗi làm rớt phỏng vấn nhiều nhất — kiểm tra thành viên
  (\`in\`) chỉ O(1) khi vế phải là \`set\`/\`dict\`, còn với \`list\`/\`tuple\` vẫn là O(n).
- **\`d[key]\` khi khoá chưa tồn tại** → \`KeyError\`. Dùng \`d.get(key, default)\` để tránh, hoặc
  \`collections.defaultdict\` khi bạn luôn muốn một giá trị mặc định.
- **Ghi vào dict trước khi kiểm tra** ở mẫu (c) → tự khớp với chính mình.
- **Trung bình O(1), không phải LUÔN LUÔN O(1)**: băm là O(1) *trung bình*. Kẻ tấn công có thể tạo hash
  collision (hashDoS — CPython có random hash seed để giảm rủi ro này). Trong phỏng vấn cứ nói O(n)
  trung bình, nhưng biết có worst case sẽ ghi điểm.

## 7. Ứng dụng thực tế

- **Chống trùng lặp**: khử trùng log/sự kiện bằng \`set\` các \`event_id\` (idempotency key trong thanh toán).
- **Cache / memoization**: \`functools.lru_cache\`, hay Redis ở quy mô lớn — về bản chất đều là bảng băm.
- **Chỉ mục database**: hash index cho truy vấn \`WHERE id = ?\`.
- **Phát hiện file trùng**: băm nội dung (\`hashlib.sha256\`) rồi so khoá thay vì so từng byte.
- **Đếm sự kiện analytics**: \`Counter\` chính là mẫu (a) đóng gói sẵn.
- **Prefix sum** là nền tảng của mọi bảng thống kê tích luỹ (doanh thu luỹ kế, biểu đồ đường).

## 8. Bảng độ phức tạp

| Thao tác | list | set/dict (băm) |
|---|---|---|
| Truy cập theo chỉ số | O(1) | — |
| Tìm theo giá trị (\`in\`) | O(n) | O(1) trung bình |
| Thêm/xoá cuối | O(1) khấu hao | O(1) |
| Thêm/xoá giữa | O(n) | O(1) |
| Bộ nhớ | thấp | cao hơn ~2-3 lần |
`,
  quiz: [
    {
      q: 'Vì sao bảng băm giúp giảm O(n²) xuống O(n) trong bài Two Sum?',
      options: [
        'Vì Map được cài đặt bằng cây cân bằng nên tìm kiếm nhanh hơn',
        'Vì nó thay vòng lặp "đi tìm phần bù" bằng một phép tra cứu O(1)',
        'Vì Map tự động sắp xếp dữ liệu giúp bỏ qua nhiều phần tử',
        'Vì Map dùng ít bộ nhớ hơn mảng nên chạy nhanh hơn',
      ],
      answer: 1,
      why: 'Vòng lặp trong của bản O(n²) không tính toán gì, nó chỉ ĐI TÌM `target - a[i]`. Map biến việc đi tìm đó thành tra cứu O(1). Đây là bản chất — không liên quan tới sắp xếp hay bộ nhớ.',
    },
    {
      q: 'Đoạn code sau có độ phức tạp thực sự là bao nhiêu?\n\nfor (const x of a) { if (b.includes(x)) out.push(x); }',
      options: ['O(n)', 'O(n log n)', 'O(n · m) với m = độ dài b', 'O(1)'],
      answer: 2,
      why: '`includes` quét tuyến tính mảng b mỗi lần gọi. Đổi b thành `new Set(b)` là về O(n + m). Hãy tập phản xạ: mọi lời gọi `includes/indexOf/find` bên trong vòng lặp đều là một vòng lặp ẩn.',
    },
    {
      q: 'Với bài "nhóm các từ đảo chữ" (anagrams), điều quan trọng nhất cần nghĩ ra là gì?',
      options: [
        'Thuật toán sắp xếp nhanh nhất',
        'Chọn đúng KHOÁ (chữ ký) sao cho các từ cùng nhóm có chung khoá',
        'Dùng đệ quy để sinh mọi hoán vị rồi so sánh',
        'Nén chuỗi trước khi so sánh để tiết kiệm bộ nhớ',
      ],
      answer: 1,
      why: 'Cả lớp bài "gom nhóm" quy về một câu hỏi: khoá là gì? Chọn khoá = chuỗi đã sắp xếp, hoặc vector đếm 26 chữ cái. Khi khoá đúng, phần còn lại chỉ là mẫu (d).',
    },
    {
      q: 'Prefix sum `pre[i+1] = pre[i] + a[i]` cho phép làm gì trong O(1)?',
      options: [
        'Tìm phần tử lớn nhất trong đoạn [i..j]',
        'Tính tổng của đoạn con bất kỳ [i..j]',
        'Sắp xếp mảng con [i..j]',
        'Đếm số phần tử phân biệt trong [i..j]',
      ],
      answer: 1,
      why: 'sum(i..j) = pre[j+1] - pre[i]. Tiền xử lý O(n), sau đó mỗi truy vấn O(1). Max của đoạn cần cấu trúc khác (sparse table / segment tree).',
    },
  ],
  quizPy: [
    {
      q: 'Vì sao dict giúp giảm O(n²) xuống O(n) trong bài Two Sum?',
      options: [
        'Vì dict được cài đặt bằng cây cân bằng nên tìm kiếm nhanh hơn',
        'Vì nó thay vòng lặp "đi tìm phần bù" bằng một phép tra cứu O(1)',
        'Vì dict tự động sắp xếp dữ liệu giúp bỏ qua nhiều phần tử',
        'Vì dict dùng ít bộ nhớ hơn list nên chạy nhanh hơn',
      ],
      answer: 1,
      why: 'Vòng lặp trong của bản O(n²) không tính toán gì, nó chỉ ĐI TÌM `target - a[i]`. dict biến việc đi tìm đó thành tra cứu O(1). Đây là bản chất — không liên quan tới sắp xếp hay bộ nhớ.',
    },
    {
      q: 'Đoạn code sau có độ phức tạp thực sự là bao nhiêu?\n\nfor x in a:\n    if x in b:\n        out.append(x)',
      options: ['O(n) nếu b là list', 'O(n log n)', 'O(n · m) với m = độ dài b, NẾU b là list (nếu b là set thì O(n))', 'O(1)'],
      answer: 2,
      why: '`x in b` quét tuyến tính nếu b là list/tuple — mỗi lần gọi O(m). Đổi b thành set(b) đưa độ phức tạp về O(n + m). Hãy tập phản xạ: `in` chỉ nhanh (O(1)) khi vế phải là set/dict.',
    },
    {
      q: 'Với bài "nhóm các từ đảo chữ" (anagrams), điều quan trọng nhất cần nghĩ ra là gì?',
      options: [
        'Thuật toán sắp xếp nhanh nhất',
        'Chọn đúng KHOÁ (chữ ký) sao cho các từ cùng nhóm có chung khoá',
        'Dùng đệ quy để sinh mọi hoán vị rồi so sánh',
        'Nén chuỗi trước khi so sánh để tiết kiệm bộ nhớ',
      ],
      answer: 1,
      why: 'Cả lớp bài "gom nhóm" quy về một câu hỏi: khoá là gì? Chọn khoá = chuỗi đã sắp xếp, hoặc tuple đếm 26 chữ cái (tuple hashable, dùng làm khoá dict được). Khi khoá đúng, phần còn lại chỉ là mẫu (d).',
    },
    {
      q: 'Prefix sum `pre[i+1] = pre[i] + a[i]` cho phép làm gì trong O(1)?',
      options: [
        'Tìm phần tử lớn nhất trong đoạn [i..j]',
        'Tính tổng của đoạn con bất kỳ [i..j]',
        'Sắp xếp mảng con [i..j]',
        'Đếm số phần tử phân biệt trong [i..j]',
      ],
      answer: 1,
      why: 'sum(i..j) = pre[j+1] - pre[i]. Tiền xử lý O(n), sau đó mỗi truy vấn O(1). Max của đoạn cần cấu trúc khác (sparse table / segment tree).',
    },
  ],
  problems: [
    {
      id: 'contains-duplicate',
      title: 'Kiểm tra phần tử trùng lặp',
      en: 'Contains Duplicate',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'hasDuplicate',
      statement: `
Cho mảng số nguyên \`nums\`. Trả về \`true\` nếu có bất kỳ giá trị nào xuất hiện **ít nhất hai lần**,
ngược lại trả về \`false\`.

**Ví dụ**
- \`nums = [1,2,3,1]\` → \`true\`
- \`nums = [1,2,3,4]\` → \`false\`

**Ràng buộc:** \`1 <= nums.length <= 100000\`

> Bài khởi động, nhưng hãy đạt O(n). Test cuối có 100.000 phần tử — bản O(n²) sẽ hết giờ.
`,
      starter: `function hasDuplicate(nums) {\n  // Gợi ý: bạn cần trả lời câu hỏi "đã gặp giá trị này chưa?"\n  \n}`,
      starterPy: `def hasDuplicate(nums):\n    # Goi y: ban can tra loi cau hoi "da gap gia tri nay chua?"\n    \n`,
      tests: [
        { args: [[1, 2, 3, 1]], expected: true, name: 'Có trùng' },
        { args: [[1, 2, 3, 4]], expected: false, name: 'Không trùng' },
        { args: [[1]], expected: false, name: 'Một phần tử' },
        { args: [[0, 0]], expected: true, name: 'Hai số 0' },
        { args: [[-1, -1, 2]], expected: true, name: 'Số âm' },
        { args: [[5, 4, 3, 2, 1]], expected: false, name: 'Giảm dần, không trùng' },
      ],
      perfTests: [{ build: () => [Array.from({ length: 100000 }, (_, i) => i + 1)], expected: false, name: 'Hiệu năng: 100.000 phần tử phân biệt' }],
      hints: [
        'Đừng so từng cặp. Hãy đi một lượt qua mảng và tự hỏi ở mỗi phần tử: "giá trị này đã xuất hiện trước đó chưa?"',
        'Cấu trúc trả lời câu hỏi "đã có chưa?" trong O(1) là `Set`. Duyệt mảng, nếu `seen.has(x)` thì trả về true, ngược lại `seen.add(x)`.',
        'Cách ngắn nhất: `return new Set(nums).size !== nums.length`. Nhưng cách duyệt + Set thoát sớm tốt hơn khi phần tử trùng nằm ở đầu mảng (không phải duyệt hết).',
      ],
      hintsPy: [
        'Đừng so từng cặp. Hãy đi một lượt qua mảng và tự hỏi ở mỗi phần tử: "giá trị này đã xuất hiện trước đó chưa?"',
        'Cấu trúc trả lời câu hỏi "đã có chưa?" trong O(1) là `set`. Duyệt mảng, nếu `x in seen` thì trả về True, ngược lại `seen.add(x)`.',
        'Cách ngắn nhất: `return len(set(nums)) != len(nums)`. Nhưng cách duyệt + set thoát sớm tốt hơn khi phần tử trùng nằm ở đầu mảng (không phải duyệt hết).',
      ],
      diagnostics: [
        { test: 'includes\\s*\\(|indexOf\\s*\\(', message: 'Bạn đang dùng `includes`/`indexOf` — mỗi lời gọi là O(n), lồng trong vòng lặp thành O(n²). Đổi sang `Set`.' },
        { test: 'sort\\s*\\(', message: 'Sắp xếp rồi so hàng xóm là lời giải đúng nhưng O(n log n). Có cách O(n) — hãy nghĩ tới `Set`.' },
      ],
      diagnosticsPy: [
        { test: '\\bx in nums\\b|\\bnums\\.count\\s*\\(', message: 'Kiểm tra thành viên trên `list` (`in nums`, `nums.count(...)`) là O(n) mỗi lần, lồng trong vòng lặp thành O(n²). Đổi sang `set`.' },
        { test: '\\.sort\\s*\\(\\)|sorted\\s*\\(', message: 'Sắp xếp rồi so hàng xóm là lời giải đúng nhưng O(n log n). Có cách O(n) — hãy nghĩ tới `set`.' },
      ],
      approach: `
**Bản ngây thơ (O(n²))**: hai vòng lặp so mọi cặp. Vòng trong chỉ để "đi tìm" — dấu hiệu kinh điển.

**Tối ưu (O(n) thời gian, O(n) bộ nhớ)**: duyệt một lượt, giữ một \`Set\` các giá trị đã gặp.
Ở mỗi bước, câu hỏi "đã gặp chưa?" được trả lời trong O(1).

**Biến thể hay bị hỏi thêm:** nếu không được dùng bộ nhớ phụ? → sắp xếp tại chỗ rồi so hai phần tử
kề nhau: O(n log n) thời gian, O(1) bộ nhớ. Đây chính là cuộc đánh đổi thời gian ↔ bộ nhớ.
`,
      solution: `function hasDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;   // thoát ngay khi tìm thấy
    seen.add(x);
  }
  return false;
}`,
      solutionPy: `def hasDuplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False`,
      complexity: {
        question: 'Độ phức tạp thời gian và bộ nhớ của lời giải tối ưu?',
        options: ['O(n) / O(1)', 'O(n) / O(n)', 'O(n log n) / O(1)', 'O(n²) / O(1)'],
        answer: 1,
        why: 'Duyệt một lượt là O(n) thời gian; Set có thể chứa tới n phần tử nên O(n) bộ nhớ. Bản sắp xếp mới là O(n log n)/O(1).',
      },
      realWorld: 'Chống xử lý trùng (idempotency): hệ thống thanh toán lưu Set các `request_id` đã xử lý để một cú click hai lần không bị trừ tiền hai lần.',
    },
    {
      id: 'two-sum',
      title: 'Tổng hai số',
      en: 'Two Sum',
      difficulty: 'Easy',
      targetMinutes: 12,
      entry: 'twoSum',
      statement: `
Cho mảng \`nums\` và số \`target\`. Trả về **chỉ số của hai phần tử** có tổng bằng \`target\`.

Mỗi đề bài đảm bảo có **đúng một** đáp án và bạn không được dùng cùng một phần tử hai lần.
Thứ tự hai chỉ số trong kết quả không quan trọng.

**Ví dụ**
- \`nums = [2,7,11,15], target = 9\` → \`[0,1]\` (vì 2 + 7 = 9)
- \`nums = [3,2,4], target = 6\` → \`[1,2]\`

> Đây là bài "mẹ" của cả lớp kỹ thuật băm. Hiểu nó = hiểu 30% các bài Medium sau này.
`,
      starter: `function twoSum(nums, target) {\n  // Trả về mảng 2 chỉ số, ví dụ [0, 1]\n  \n}`,
      starterPy: `def twoSum(nums, target):\n    # Tra ve list 2 chi so, vi du [0, 1]\n    \n`,
      tests: [
        { args: [[2, 7, 11, 15], 9], expected: [0, 1], name: 'Ví dụ 1' },
        { args: [[3, 2, 4], 6], expected: [1, 2], name: 'Không phải hai phần tử đầu' },
        { args: [[3, 3], 6], expected: [0, 1], name: 'Hai giá trị giống nhau' },
        { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], name: 'Số âm' },
        { args: [[0, 4, 3, 0], 0], expected: [0, 3], name: 'Hai số 0' },
      ],
      perfTests: [{ build: () => [Array.from({ length: 150000 }, (_, i) => i + 1), 299999], expected: [149998, 149999], name: 'Hiệu năng: n=150.000 (bản O(n²) sẽ hết giờ)' }],
      checkerSrc: `(got, exp, args) => Array.isArray(got) && got.length === 2
        && Number.isInteger(got[0]) && Number.isInteger(got[1]) && got[0] !== got[1]
        && args[0][got[0]] + args[0][got[1]] === args[1]`,
      checkerSrcPy: `lambda got, exp, args: isinstance(got, (list, tuple)) and len(got) == 2 \\
        and isinstance(got[0], int) and isinstance(got[1], int) and got[0] != got[1] \\
        and args[0][got[0]] + args[0][got[1]] == args[1]`,
      hints: [
        'Cố định một phần tử `nums[i]`. Bạn đang đi tìm chính xác một giá trị: `target - nums[i]`. Vấn đề chỉ còn là "tìm nhanh".',
        'Dùng `Map` ánh xạ giá_trị → chỉ_số. Duyệt i từ trái sang: nếu `map.has(target - nums[i])` thì đã có đáp án; nếu chưa, lưu `map.set(nums[i], i)`.',
        'Thứ tự rất quan trọng: **kiểm tra trước, lưu sau**. Nếu lưu trước, với `nums=[3,3]` và target=6 bạn sẽ khớp phần tử với chính nó. Chỉ cần một vòng lặp duy nhất — không cần vòng thứ hai.',
      ],
      hintsPy: [
        'Cố định một phần tử `nums[i]`. Bạn đang đi tìm chính xác một giá trị: `target - nums[i]`. Vấn đề chỉ còn là "tìm nhanh".',
        'Dùng `dict` ánh xạ giá_trị → chỉ_số. Duyệt bằng `enumerate(nums)`: nếu `target - x in pos` thì đã có đáp án; nếu chưa, lưu `pos[x] = i`.',
        'Thứ tự rất quan trọng: **kiểm tra trước, lưu sau**. Nếu lưu trước, với `nums=[3,3]` và target=6 bạn sẽ khớp phần tử với chính nó. Chỉ cần một vòng lặp duy nhất — không cần vòng thứ hai.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Đang có hai vòng lặp lồng nhau → O(n²). Test hiệu năng sẽ đánh trượt. Hãy thay vòng trong bằng một `Map`.' },
        { test: 'sort\\s*\\(', message: 'Cẩn thận: sắp xếp làm mất chỉ số gốc. Nếu vẫn muốn dùng hai con trỏ, bạn phải lưu cặp (giá trị, chỉ số) trước khi sắp.' },
      ],
      diagnosticsPy: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Đang có hai vòng lặp lồng nhau → O(n²). Test hiệu năng sẽ đánh trượt. Hãy thay vòng trong bằng một `dict`.' },
        { test: '\\.sort\\s*\\(\\)|sorted\\s*\\(', message: 'Cẩn thận: sắp xếp làm mất chỉ số gốc. Nếu vẫn muốn dùng hai con trỏ, bạn phải lưu cặp (giá trị, chỉ số) trước khi sắp.' },
      ],
      approach: `
**Bước 1 — Viết lại đề bằng ngôn ngữ của mình.** "Với mỗi x, tồn tại \`target - x\` trong phần còn lại không?"
Ngay khi phát biểu được như vậy, bạn thấy vòng lặp trong chỉ làm nhiệm vụ TÌM.

**Bước 2 — Thay tìm bằng tra.** Map: giá trị → chỉ số.

\`\`\`
i=0  x=2   cần 7   map={}            -> chưa có, lưu {2:0}
i=1  x=7   cần 2   map={2:0}         -> CÓ! trả về [0, 1]
\`\`\`

**Bước 3 — Vì sao chỉ cần một vòng lặp?** Nếu cặp đáp án là (i, j) với i < j, thì khi con trỏ tới j,
phần tử i chắc chắn đã nằm trong map. Ta không bao giờ bỏ sót — đây là *bất biến* (invariant) của thuật toán:
> Khi xử lý tới vị trí j, map chứa đúng tất cả các phần tử ở bên trái j.

Nhớ được câu bất biến này là bạn đã có chìa khoá của kỹ thuật "một lượt duyệt + cấu trúc phụ".
`,
      solution: `function twoSum(nums, target) {
  const pos = new Map();               // giá trị -> chỉ số
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (pos.has(need)) return [pos.get(need), i];
    pos.set(nums[i], i);               // lưu SAU khi kiểm tra
  }
  return [];
}`,
      solutionPy: `def twoSum(nums, target):
    pos = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in pos:
            return [pos[need], i]
        pos[x] = i
    return []`,
      complexity: {
        question: 'Lời giải một lượt duyệt + Map có độ phức tạp?',
        options: ['O(n²) / O(1)', 'O(n log n) / O(n)', 'O(n) / O(n)', 'O(n) / O(1)'],
        answer: 2,
        why: 'Một vòng lặp qua n phần tử, mỗi bước làm O(1) thao tác Map → O(n). Map lưu tối đa n cặp → O(n) bộ nhớ.',
      },
      realWorld: 'Đối soát giao dịch: tìm cặp bút toán nợ/có triệt tiêu nhau. Duyệt sổ cái một lượt, với mỗi giao dịch tra xem số tiền đối ứng đã xuất hiện chưa — đúng mẫu này.',
    },
    {
      id: 'group-anagrams',
      title: 'Nhóm các từ đảo chữ',
      en: 'Group Anagrams',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'groupAnagrams',
      statement: `
Cho mảng chuỗi \`strs\`, hãy nhóm các **từ đảo chữ** (anagram) vào cùng một nhóm.
Hai từ là đảo chữ của nhau nếu dùng đúng cùng bộ ký tự với số lượng như nhau.

**Ví dụ**
\`strs = ["eat","tea","tan","ate","nat","bat"]\`
→ \`[["eat","tea","ate"],["tan","nat"],["bat"]]\`

Thứ tự các nhóm và thứ tự trong mỗi nhóm **không quan trọng**.

**Ràng buộc:** chỉ chữ thường a-z, \`0 <= strs[i].length <= 100\`
`,
      starter: `function groupAnagrams(strs) {\n  // Trả về mảng các nhóm, ví dụ [["eat","tea"],["bat"]]\n  \n}`,
      starterPy: `def groupAnagrams(strs):\n    # Tra ve list cac nhom, vi du [["eat","tea"],["bat"]]\n    \n`,
      tests: [
        { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']], name: 'Ví dụ chuẩn' },
        { args: [['']], expected: [['']], name: 'Chuỗi rỗng' },
        { args: [['a']], expected: [['a']], name: 'Một ký tự' },
        { args: [['abc', 'bca', 'cab', 'xyz']], expected: [['abc', 'bca', 'cab'], ['xyz']], name: 'Ba từ cùng nhóm' },
        { args: [['aab', 'aba', 'baa', 'ab', 'ba']], expected: [['aab', 'aba', 'baa'], ['ab', 'ba']], name: 'Ký tự lặp — phải đếm số lượng' },
      ],
      checkerSrc: `(got, exp) => {
        if (!Array.isArray(got)) return false;
        const norm = (g) => g.map(x => [...x].sort().join('|')).sort().join(' ## ');
        return norm(got) === norm(exp);
      }`,
      checkerSrcPy: `lambda got, exp, args: isinstance(got, list) \\
        and sorted(tuple(sorted(g)) for g in got) == sorted(tuple(sorted(g)) for g in exp)`,
      hints: [
        'Mọi bài "gom nhóm" đều quy về một câu hỏi duy nhất: **khoá của nhóm là gì?** Hãy tìm một hàm f(từ) sao cho hai từ đảo chữ luôn cho cùng giá trị.',
        'Cách 1: sắp xếp các ký tự trong từ — "eat" và "tea" đều thành "aet". Cách 2 (nhanh hơn): đếm 26 chữ cái rồi ghép thành chuỗi "1#0#0#...".',
        'Dùng `Map<string, string[]>`. Với mỗi từ: tính khoá, nếu Map chưa có khoá thì tạo mảng rỗng, rồi push từ vào. Cuối cùng trả về `[...map.values()]`.',
      ],
      hintsPy: [
        'Mọi bài "gom nhóm" đều quy về một câu hỏi duy nhất: **khoá của nhóm là gì?** Hãy tìm một hàm f(từ) sao cho hai từ đảo chữ luôn cho cùng giá trị.',
        'Cách 1: sắp xếp các ký tự trong từ — "eat" và "tea" đều thành "aet". Cách 2 (nhanh hơn): đếm 26 chữ cái rồi tạo tuple đếm.',
        'Dùng `collections.defaultdict(list)`. Với mỗi từ: tính khoá (ví dụ `tuple` đếm 26 chữ cái — tuple hashable, dùng làm khoá dict được), rồi `groups[key].append(w)`. Cuối cùng trả về `list(groups.values())`.',
      ],
      diagnostics: [
        { test: 'permut|for[\\s\\S]{0,300}for[\\s\\S]{0,300}for', message: 'Bạn đang so từng cặp hoặc sinh hoán vị. Không cần — chỉ cần chuẩn hoá mỗi từ thành một khoá rồi gom bằng Map (một lượt duyệt).' },
      ],
      diagnosticsPy: [
        { test: 'permutations|for[\\s\\S]{0,300}for[\\s\\S]{0,300}for', message: 'Bạn đang so từng cặp hoặc sinh hoán vị. Không cần — chỉ cần chuẩn hoá mỗi từ thành một khoá rồi gom bằng dict (một lượt duyệt).' },
      ],
      approach: `
**Ý tưởng cốt lõi: chuẩn hoá (canonicalization).**
Anagram là một *quan hệ tương đương*. Với mọi quan hệ tương đương, cách xử lý là tìm một **đại diện chuẩn**
cho mỗi lớp — rồi dùng nó làm khoá băm.

- Khoá bằng sắp xếp: \`"tea" -> "aet"\`. Chi phí O(k log k) mỗi từ.
- Khoá bằng vector đếm: \`"tea" -> [0,0,0,0,1,...]\` → chuỗi. Chi phí O(k). Tổng O(n·k).

**Vì sao vector đếm nhanh hơn?** Vì bảng chữ cái cố định (26). Đây là mẹo chung: khi miền giá trị nhỏ và cố định,
"đếm" luôn thắng "sắp xếp".

**Cẩn thận với cách sai phổ biến:** dùng tổng mã ký tự làm khoá ("abc" → 294). Sai, vì "abc" và "aad"
có thể trùng tổng. Khoá phải là **song ánh** với đa tập ký tự.
`,
      solution: `function groupAnagrams(strs) {
  const groups = new Map();
  for (const w of strs) {
    const cnt = new Array(26).fill(0);
    for (const ch of w) cnt[ch.charCodeAt(0) - 97]++;
    const key = cnt.join('#');            // khoá song ánh với đa tập ký tự
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}`,
      solutionPy: `from collections import defaultdict

def groupAnagrams(strs):
    groups = defaultdict(list)
    for w in strs:
        cnt = [0] * 26
        for ch in w:
            cnt[ord(ch) - ord('a')] += 1
        groups[tuple(cnt)].append(w)
    return list(groups.values())`,
      complexity: {
        question: 'Với n từ, mỗi từ dài tối đa k, lời giải dùng vector đếm có độ phức tạp thời gian?',
        options: ['O(n · k log k)', 'O(n · k)', 'O(n² · k)', 'O(n log n)'],
        answer: 1,
        why: 'Mỗi từ được duyệt một lần để đếm ký tự (O(k)) và tạo khoá độ dài 26 (hằng số) → O(n·k). Bản dùng sort là O(n·k log k).',
      },
      realWorld: 'Chống trùng dữ liệu (data deduplication): gom các bản ghi "giống nhau về bản chất" bằng cách chuẩn hoá thành khoá — ví dụ gom địa chỉ "12 Lê Lợi, Q1" và "12 le loi q.1" về cùng một khoá chuẩn hoá.',
    },
    {
      id: 'top-k-frequent',
      title: 'K phần tử xuất hiện nhiều nhất',
      en: 'Top K Frequent Elements',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'topKFrequent',
      statement: `
Cho mảng \`nums\` và số nguyên \`k\`, trả về \`k\` phần tử **xuất hiện nhiều lần nhất**.
Thứ tự trong kết quả không quan trọng. Đề bài đảm bảo đáp án là duy nhất.

**Ví dụ**
- \`nums = [1,1,1,2,2,3], k = 2\` → \`[1,2]\`
- \`nums = [7,7], k = 1\` → \`[7]\`

> Thử thách: giải trong **O(n)** — tốt hơn cả O(n log n) của sắp xếp.
`,
      starter: `function topKFrequent(nums, k) {\n  \n}`,
      starterPy: `def topKFrequent(nums, k):\n    \n`,
      tests: [
        { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], name: 'Ví dụ 1' },
        { args: [[7, 7], 1], expected: [7], name: 'Một phần tử' },
        { args: [[1, 2, 3, 4], 4], expected: [1, 2, 3, 4], name: 'k = n, tất cả tần suất 1' },
        { args: [[5, 5, 5, 4, 4, 3, 3, 3, 3], 2], expected: [3, 5], name: 'Ba nhóm tần suất' },
        { args: [[-1, -1, 2], 1], expected: [-1], name: 'Số âm' },
      ],
      checkerSrc: `(got, exp) => Array.isArray(got) && got.length === exp.length
        && [...got].sort((a,b)=>a-b).join(',') === [...exp].sort((a,b)=>a-b).join(',')`,
      checkerSrcPy: `lambda got, exp, args: isinstance(got, list) and len(got) == len(exp) and sorted(got) == sorted(exp)`,
      hints: [
        'Chia thành hai giai đoạn rõ ràng: (1) đếm tần suất bằng Map; (2) chọn ra k khoá có tần suất lớn nhất. Đừng trộn hai việc này.',
        'Giai đoạn (2) đơn giản nhất là sắp xếp theo tần suất giảm dần rồi lấy k đầu → O(n log n). Đúng, nhưng chưa tối ưu.',
        'Mẹo **bucket sort**: tần suất luôn nằm trong [1..n]. Tạo mảng `buckets` độ dài n+1, `buckets[f]` = danh sách các giá trị có tần suất f. Duyệt buckets từ cuối về đầu, gom đủ k phần tử → O(n).',
      ],
      hintsPy: [
        'Chia thành hai giai đoạn rõ ràng: (1) đếm tần suất bằng `collections.Counter`; (2) chọn ra k khoá có tần suất lớn nhất. Đừng trộn hai việc này.',
        'Giai đoạn (2) đơn giản nhất là `Counter(nums).most_common(k)` — nhưng đó vẫn là O(n log n) bên trong. Thử thách của bài là đạt O(n).',
        'Mẹo **bucket sort**: tần suất luôn nằm trong [1..n]. Tạo `buckets = [[] for _ in range(len(nums)+1)]`, `buckets[f]` = danh sách các giá trị có tần suất f. Duyệt buckets từ cuối về đầu (`range(len(buckets)-1, 0, -1)`), gom đủ k phần tử → O(n).',
      ],
      diagnostics: [
        { test: 'sort\\s*\\(', message: 'Bản dùng sort là O(n log n) — vẫn được chấp nhận, nhưng hãy thử đạt O(n) bằng bucket sort (tần suất bị chặn bởi n).' },
      ],
      diagnosticsPy: [
        { test: '\\.sort\\s*\\(\\)|sorted\\s*\\(|most_common', message: 'Bản dùng sort/most_common là O(n log n) — vẫn được chấp nhận, nhưng hãy thử đạt O(n) bằng bucket sort (tần suất bị chặn bởi n).' },
      ],
      approach: `
**Giai đoạn 1 — Đếm.** \`Map<value, freq>\`, O(n).

**Giai đoạn 2 — Chọn top k.** Có ba mức tư duy:

1. Sắp xếp toàn bộ theo tần suất: O(m log m). Đơn giản, luôn đúng.
2. Heap kích thước k (xem lại ở chủ đề Heap): O(m log k). Tốt khi k rất nhỏ so với m.
3. **Bucket sort theo tần suất: O(n).** Chìa khoá là nhận ra *miền giá trị của tần suất bị chặn*:
   một phần tử không thể xuất hiện quá n lần. Khi miền giá trị bị chặn và nhỏ, ta được phép dùng
   mảng làm "chỉ mục trực tiếp" thay cho so sánh — đây chính là lý do counting/bucket sort phá được
   rào cản Ω(n log n) của sắp xếp so sánh.

\`\`\`
nums = [1,1,1,2,2,3]
freq  = {1:3, 2:2, 3:1}
bucket[1]=[3]  bucket[2]=[2]  bucket[3]=[1]
duyệt f = 3,2,1  ->  lấy 1, rồi 2  ->  [1,2]
\`\`\`
`,
      solution: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);

  // buckets[f] = các giá trị xuất hiện đúng f lần
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, f] of freq) buckets[f].push(val);

  const out = [];
  for (let f = buckets.length - 1; f >= 1 && out.length < k; f--) {
    for (const val of buckets[f]) {
      out.push(val);
      if (out.length === k) break;
    }
  }
  return out;
}`,
      solutionPy: `from collections import Counter

def topKFrequent(nums, k):
    freq = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for val, f in freq.items():
        buckets[f].append(val)

    out = []
    for f in range(len(buckets) - 1, 0, -1):
        for val in buckets[f]:
            out.append(val)
            if len(out) == k:
                return out
    return out`,
      complexity: {
        question: 'Lời giải bucket sort đạt độ phức tạp thời gian nào?',
        options: ['O(n log n)', 'O(n log k)', 'O(n)', 'O(k log n)'],
        answer: 2,
        why: 'Đếm O(n), xếp vào bucket O(m ≤ n), duyệt bucket O(n). Không có bước sắp xếp so sánh nào → O(n). Nó "lách" được cận Ω(n log n) vì tần suất là số nguyên bị chặn bởi n.',
      },
      realWorld: 'Bảng xếp hạng thời gian thực: top 10 từ khoá tìm kiếm, top sản phẩm bán chạy, top lỗi trong log. Ở quy mô lớn người ta dùng biến thể xấp xỉ (Count-Min Sketch) vì không đủ RAM để đếm chính xác.',
    },
    {
      id: 'product-except-self',
      title: 'Tích của mảng trừ chính nó',
      en: 'Product of Array Except Self',
      difficulty: 'Medium',
      targetMinutes: 20,
      entry: 'productExceptSelf',
      statement: `
Cho mảng \`nums\`, trả về mảng \`out\` với \`out[i]\` = tích của **tất cả phần tử trừ \`nums[i]\`**.

**Bắt buộc:** không được dùng phép chia, và phải chạy trong O(n).

**Ví dụ**
- \`nums = [1,2,3,4]\` → \`[24,12,8,6]\`
- \`nums = [-1,1,0,-3,3]\` → \`[0,0,9,0,0]\`
`,
      starter: `function productExceptSelf(nums) {\n  \n}`,
      starterPy: `def productExceptSelf(nums):\n    \n`,
      tests: [
        { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], name: 'Ví dụ 1' },
        { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], name: 'Có số 0' },
        { args: [[0, 0]], expected: [0, 0], name: 'Hai số 0' },
        { args: [[2, 3]], expected: [3, 2], name: 'Hai phần tử' },
        { args: [[5, 1, 1, 1]], expected: [1, 5, 5, 5], name: 'Nhiều số 1' },
        { args: [[-1, -2, -3]], expected: [6, 3, 2], name: 'Toàn số âm' },
      ],
      hints: [
        'Tích "trừ chính nó" = (tích mọi thứ **bên trái** i) × (tích mọi thứ **bên phải** i). Hãy tách bài toán thành hai nửa độc lập.',
        'Duyệt trái→phải để tính prefix[i] = tích các phần tử trước i. Duyệt phải→trái để tính suffix[i]. Kết quả out[i] = prefix[i] * suffix[i].',
        'Tối ưu bộ nhớ về O(1) (không tính mảng output): dùng chính mảng `out` để lưu prefix ở lượt đi, rồi nhân dần với một biến `right` chạy ngược ở lượt về.',
      ],
      hintsPy: [
        'Tích "trừ chính nó" = (tích mọi thứ **bên trái** i) × (tích mọi thứ **bên phải** i). Hãy tách bài toán thành hai nửa độc lập.',
        'Duyệt trái→phải để tính prefix[i] = tích các phần tử trước i. Duyệt phải→trái để tính suffix[i]. Kết quả out[i] = prefix[i] * suffix[i].',
        'Tối ưu bộ nhớ về O(1) (không tính mảng output): dùng chính list `out` để lưu prefix ở lượt đi, rồi nhân dần với một biến `right` chạy ngược ở lượt về (`for i in range(n-1, -1, -1)`).',
      ],
      diagnostics: [
        { test: '\\/(?![\\/*])|\\bMath\\.floor\\s*\\([^)]*\\/', message: 'Đề bài cấm phép chia (vì mảng có thể chứa số 0 làm hỏng cách chia tổng tích). Hãy dùng tích tiền tố và tích hậu tố.' },
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lặp lồng nhau là O(n²). Bạn cần đúng 2 lượt duyệt *tuần tự* (không lồng nhau).' },
      ],
      diagnosticsPy: [
        { test: '(?<!/)/(?!/)', message: 'Đề bài cấm phép chia (vì mảng có thể chứa số 0 làm hỏng cách chia tổng tích). Hãy dùng tích tiền tố và tích hậu tố.' },
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lặp lồng nhau là O(n²). Bạn cần đúng 2 lượt duyệt *tuần tự* (không lồng nhau).' },
      ],
      approach: `
**Bẫy đầu tiên:** ai cũng nghĩ tới "tính tích tất cả rồi chia cho nums[i]". Sai khi có số 0 (và đề cấm chia).
Việc cấm chia không phải làm khó — nó ép bạn khám phá một kỹ thuật tổng quát hơn: **prefix/suffix**.

**Nhìn lại bài toán:**
\`\`\`
out[i] = (a[0]·a[1]···a[i-1]) · (a[i+1]···a[n-1])
          \\_______ trái ______/   \\_____ phải _____/
\`\`\`

Cả hai vế đều tính được bằng **một lượt duyệt tích luỹ**:

\`\`\`
nums    = [ 1,  2,  3,  4]
prefix  = [ 1,  1,  2,  6]     (tích các phần tử ĐỨNG TRƯỚC)
suffix  = [24, 12,  4,  1]     (tích các phần tử ĐỨNG SAU)
out     = [24, 12,  8,  6]
\`\`\`

**Mẫu hình cần mang đi:** rất nhiều bài "với mỗi i, cần thông tin tổng hợp của hai bên"
đều giải bằng prefix + suffix trong 2 lượt duyệt: tổng tiền tố, max bên trái/phải (Trapping Rain Water),
đếm số nhỏ hơn ở bên trái... Đây là kỹ thuật đáng giá hơn bản thân bài này rất nhiều.
`,
      solution: `function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);

  // lượt 1: out[i] = tích các phần tử bên trái i
  let left = 1;
  for (let i = 0; i < n; i++) {
    out[i] = left;
    left *= nums[i];
  }

  // lượt 2: nhân thêm tích các phần tử bên phải i
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;
}`,
      solutionPy: `def productExceptSelf(nums):
    n = len(nums)
    out = [1] * n

    left = 1
    for i in range(n):
        out[i] = left
        left *= nums[i]

    right = 1
    for i in range(n - 1, -1, -1):
        out[i] *= right
        right *= nums[i]
    return out`,
      complexity: {
        question: 'Lời giải hai lượt duyệt dùng bao nhiêu bộ nhớ phụ (không tính mảng kết quả)?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        answer: 2,
        why: 'Chỉ cần hai biến `left` và `right`. Mảng kết quả theo quy ước không tính vào bộ nhớ phụ. Bản dùng hai mảng prefix/suffix riêng thì tốn O(n).',
      },
      realWorld: 'Tính "đóng góp của từng thành phần" khi bỏ nó ra: ví dụ đánh giá ảnh hưởng của mỗi kênh marketing lên chỉ số nhân tính, hay tính xác suất "tất cả trừ cái này" trong mô hình Naive Bayes.',
    },
  ],
},

/* ==================================================================== */
{
  id: 'two-pointers',
  name: 'Hai con trỏ',
  en: 'Two Pointers',
  icon: '↔️',
  days: [4, 5],
  summary: 'Khi mảng có thứ tự, hai con trỏ cho phép loại bỏ cả một vùng lời giải trong mỗi bước.',
  lesson: `
## 1. Vấn đề gốc

Bạn cần xét **mọi cặp** (i, j) — đó là O(n²) cặp. Nhưng nếu dữ liệu có **cấu trúc** (đã sắp xếp,
hoặc đối xứng), bạn không cần xét hết: mỗi bước có thể **loại bỏ hàng loạt** ứng viên cùng lúc.

## 2. Ý tưởng cốt lõi

> Hai con trỏ hoạt động được khi ta chứng minh được: *"phần tử này không thể là đáp án với bất kỳ ai
> còn lại"* — nhờ đó ta an tâm bỏ nó đi và thu hẹp phạm vi.

Ví dụ mảng đã sắp tăng, tìm cặp có tổng \`target\`:

\`\`\`
l ->                      <- r
[1, 3, 5, 7, 9, 11]   target = 12
sum = 1 + 11 = 12  -> tìm thấy
\`\`\`
Nếu \`sum > target\`: \`nums[r]\` quá lớn. Nhưng nó đã ghép với **phần tử nhỏ nhất còn lại** rồi mà vẫn dư
→ nó không thể ghép với bất kỳ ai khác → **loại r** (\`r--\`). Một bước loại được cả một cột của ma trận cặp.
Đó chính là lý do O(n²) → O(n).

Câu thần chú: **"mỗi lần dịch chuyển phải loại bỏ vĩnh viễn một ứng viên"**. Nếu không chứng minh được
điều đó, hai con trỏ sẽ cho kết quả sai.

## 3. Ba biến thể phải biết

| Biến thể | Hình dạng | Bài tiêu biểu |
|---|---|---|
| Hai đầu hội tụ | \`l = 0, r = n-1\`, tiến vào giữa | Two Sum II, Container With Most Water, kiểm tra palindrome |
| Cùng chiều (nhanh/chậm) | \`slow\` giữ vị trí ghi, \`fast\` quét | Xoá phần tử trùng tại chỗ, dời số 0 |
| Hai mảng | mỗi con trỏ trên một mảng | Trộn hai mảng đã sắp, giao/hợp |

## 4. Mẫu code

\`\`\`js
// (a) Hai đầu hội tụ trên mảng đã sắp
let l = 0, r = n - 1;
while (l < r) {
  const sum = a[l] + a[r];
  if (sum === target) return [l, r];
  if (sum < target) l++;      // cần lớn hơn -> bỏ phần tử nhỏ nhất
  else r--;                   // cần nhỏ hơn -> bỏ phần tử lớn nhất
}

// (b) Nhanh/chậm — ghi đè tại chỗ
let slow = 0;
for (let fast = 0; fast < n; fast++) {
  if (giữLại(a[fast])) a[slow++] = a[fast];
}
return slow;                  // độ dài mới

// (c) Bỏ qua phần tử trùng (dùng nhiều trong 3Sum)
while (l < r && a[l] === a[l + 1]) l++;
\`\`\`

## 5. Bẫy thường gặp

- **Quên sắp xếp**: đa số bài hai con trỏ yêu cầu mảng đã sắp. Sắp xếp trước là hoàn toàn hợp lệ (O(n log n))
  *trừ khi* đề yêu cầu giữ chỉ số gốc.
- **Vòng lặp vô hạn**: mọi nhánh của \`if\` đều phải dịch chuyển ít nhất một con trỏ.
- **Điều kiện \`l < r\` hay \`l <= r\`**: nếu i và j phải khác nhau thì dùng \`l < r\`.
- **Bỏ sót trùng lặp**: bài 3Sum yêu cầu bộ ba *không trùng* — phải bỏ qua giá trị lặp ở cả 3 vị trí.

## 6. Ứng dụng thực tế

- **Merge trong merge sort / external sort**: trộn hai file đã sắp xếp bằng hai con trỏ — nền tảng của
  việc sắp xếp dữ liệu lớn hơn RAM.
- **Trộn danh sách đã sắp** trong database (merge join): nhanh hơn nhiều so với nested-loop join.
- **Nén mảng tại chỗ**: mẫu nhanh/chậm chính là cách các thư viện cài đặt \`filter\` không cấp phát bộ nhớ mới.
- **Kiểm tra chuỗi đối xứng / so khớp hai đầu** trong xử lý văn bản.
`,
  lessonPy: `
## 1. Vấn đề gốc

Kiểu bài "tìm cặp phần tử thoả điều kiện" (tổng bằng target, khoảng cách lớn nhất...) mà giải bằng
cách xét **mọi cặp (i, j)** sẽ tốn O(n²), vì có tới n×(n-1)/2 cặp cần thử:

\`\`\`python
def hai_so_co_tong_cham(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):        # duyệt HẾT các cặp còn lại
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
\`\`\`

Nhưng nếu dữ liệu có **cấu trúc** — cụ thể ở đây là *đã sắp xếp tăng dần* — bạn không cần xét hết
mọi cặp: mỗi bước so sánh có thể giúp **loại bỏ hàng loạt** ứng viên cùng lúc, không phải loại từng
cái một.

## 2. Ý tưởng cốt lõi

> Hai con trỏ hoạt động được khi ta chứng minh được: *"phần tử này không thể là đáp án với bất kỳ ai
> còn lại"* — nhờ đó ta an tâm bỏ nó đi vĩnh viễn và thu hẹp phạm vi tìm kiếm.

Ví dụ cụ thể: list đã sắp tăng \`[1, 3, 5, 7, 9, 11]\`, tìm cặp có tổng \`target = 12\`. Đặt con trỏ
\`l\` ở đầu (giá trị 1), \`r\` ở cuối (giá trị 11).

\`\`\`
l ->                      <- r
[1, 3, 5, 7, 9, 11]   target = 12
sum = 1 + 11 = 12  -> tìm thấy ngay!
\`\`\`

Giả sử tổng thay vào đó là *quá lớn* so với target (\`sum > target\`): điều đó nghĩa là \`nums[r]\` (số
lớn nhất bên phải \`l\`) đã ghép với **phần tử nhỏ nhất còn lại trong phạm vi đang xét** (\`nums[l]\`)
mà tổng vẫn dư. Vì mảng đã sắp tăng, ghép \`nums[r]\` với bất kỳ phần tử nào khác bên trong đoạn
\`[l, r-1]\` (toàn số ≤ \`nums[l]\`) tổng sẽ còn dư nhiều hơn nữa, chắc chắn không bao giờ bằng target.
Vậy \`nums[r]\` **bị loại vĩnh viễn** khỏi mọi cặp còn lại có thể xét (\`r -= 1\`). Chỉ một phép so sánh
đã loại bỏ được cả một cột trong "ma trận mọi cặp" tưởng tượng — đó chính xác là lý do độ phức tạp
tụt từ O(n²) xuống O(n): tổng số bước di chuyển của \`l\` và \`r\` cộng lại không bao giờ vượt quá \`n\`.

Câu thần chú cần thuộc: **"mỗi lần dịch chuyển phải loại bỏ vĩnh viễn ít nhất một ứng viên, và không
bao giờ được bỏ sót đáp án đúng"**. Nếu không chứng minh được cả hai vế đó, hai con trỏ sẽ cho kết
quả sai một cách âm thầm — chương trình vẫn chạy, chỉ là trả lời sai.

## 3. Cấu trúc & hàm Python thường dùng trong chủ đề này

| Tên | Vai trò | Ví dụ dùng nhanh |
|---|---|---|
| \`sorted(a)\` | Trả về list **mới** đã sắp tăng, giữ nguyên \`a\` gốc | \`b = sorted(a)\` — hai con trỏ thường cần dữ liệu đã sắp |
| \`a.sort()\` | Sắp xếp **tại chỗ**, không tạo bản sao, không trả về gì (trả \`None\`) | \`a.sort()\` rồi dùng luôn \`a\` |
| \`list.pop()\` / \`list.pop(0)\` | Xoá phần tử cuối (O(1)) hoặc đầu (O(n) — phải dồn cả list) | dùng khi mô phỏng "bỏ một đầu ra khỏi phạm vi xét" |
| Gán bội \`l, r = 0, n - 1\` | Khởi tạo hai con trỏ trong một dòng, không cần biến tạm | thay cho hai dòng \`l = 0\` rồi \`r = n - 1\` |
| \`while l < r:\` | Vòng lặp chính của hầu hết bài hai con trỏ hội tụ | dừng khi hai con trỏ gặp/vượt nhau |
| \`str[::-1]\` | Đảo ngược chuỗi bằng slicing — dùng để so sánh palindrome nhanh | \`s == s[::-1]\` (chỉ nên dùng để đối chiếu, không thay hai con trỏ khi cần O(1) bộ nhớ) |
| \`str.isalnum()\` | Kiểm tra ký tự có phải chữ/số không — lọc ký tự khi kiểm tra palindrome | \`if ch.isalnum(): ...\` |

## 4. Ba biến thể phải biết

| Biến thể | Hình dạng | Bài tiêu biểu |
|---|---|---|
| Hai đầu hội tụ | \`l = 0, r = n-1\`, tiến vào giữa | Two Sum II, Container With Most Water, kiểm tra palindrome |
| Cùng chiều (nhanh/chậm) | \`slow\` giữ vị trí ghi, \`fast\` quét | Xoá phần tử trùng tại chỗ, dời số 0 |
| Hai list | mỗi con trỏ trên một list | Trộn hai list đã sắp, giao/hợp |

## 5. Mẫu code cần thuộc lòng

**(a) Hai đầu hội tụ trên list đã sắp** — khuôn mẫu quan trọng nhất của cả chủ đề:

\`\`\`python
def hai_so_co_tong(nums_da_sap, target):
    l, r = 0, len(nums_da_sap) - 1
    while l < r:
        total = nums_da_sap[l] + nums_da_sap[r]
        if total == target:
            return [l, r]
        if total < target:
            l += 1              # tổng đang nhỏ hơn target -> cần lớn hơn -> bỏ phần tử nhỏ nhất
        else:
            r -= 1              # tổng đang lớn hơn target -> cần nhỏ hơn -> bỏ phần tử lớn nhất
    return []

print(hai_so_co_tong([1, 3, 5, 7, 9, 11], 12))   # [0, 5] vì 1 + 11 == 12
\`\`\`

**(b) Nhanh/chậm — ghi đè tại chỗ**, dùng khi đề yêu cầu "xoá phần tử X mà không cấp phát mảng mới":

\`\`\`python
def loc_tai_cho(a, giu_lai):
    slow = 0                       # slow: vị trí TIẾP THEO sẽ ghi phần tử được giữ lại
    for fast in range(len(a)):      # fast: con trỏ quét qua từng phần tử một
        if giu_lai(a[fast]):
            a[slow] = a[fast]        # ghi đè lên vị trí slow, không tạo list mới
            slow += 1
    return slow                       # slow chính là độ dài mới của phần "đã lọc"

a = [3, 0, 1, 0, 5]
n_moi = loc_tai_cho(a, lambda x: x != 0)   # giữ lại phần tử khác 0
print(a[:n_moi])    # [3, 1, 5] — phần đầu của a đã được nén lại, đúng thứ tự ban đầu
\`\`\`

**(c) Bỏ qua phần tử trùng** — mảnh ghép bắt buộc phải nhớ khi làm 3Sum (loại bộ ba trùng nhau):

\`\`\`python
# giả sử nums đã sắp và l đang trỏ tới một giá trị vừa được xét làm ứng viên đầu tiên của bộ ba
while l < r and nums[l] == nums[l + 1]:
    l += 1     # nhảy qua mọi bản sao liên tiếp của cùng một giá trị, tránh sinh lại bộ ba đã có
\`\`\`

## 6. Bẫy thường gặp

- **Quên sắp xếp**: đa số bài hai con trỏ yêu cầu list đã sắp. Sắp xếp trước là hoàn toàn hợp lệ
  (\`sorted(a)\`, O(n log n)) *trừ khi* đề yêu cầu giữ chỉ số gốc.
- **\`a.sort()\` (tại chỗ) vs \`sorted(a)\` (tạo bản sao)**: nếu cần giữ mảng gốc để trả lại chỉ số ban đầu,
  đừng dùng \`sort()\` trực tiếp trên nó — hãy sort trên bản sao hoặc trên danh sách cặp (giá trị, chỉ số).
  Nhớ thêm: \`a.sort()\` trả về \`None\` — viết \`a = a.sort()\` là lỗi kinh điển, xoá luôn dữ liệu.
- **Vòng lặp vô hạn**: mọi nhánh của \`if\`/\`while\` đều phải dịch chuyển ít nhất một con trỏ, nếu không
  chương trình treo mãi.
- **Điều kiện \`l < r\` hay \`l <= r\`**: nếu i và j phải khác nhau (không được trỏ cùng một phần tử)
  thì dùng \`l < r\`.
- **Bỏ sót trùng lặp**: bài 3Sum yêu cầu bộ ba *không trùng* — phải bỏ qua giá trị lặp ở cả 3 vị trí,
  không chỉ vị trí ngoài cùng.

## 7. Ứng dụng thực tế

- **Merge trong merge sort / external sort**: trộn hai file đã sắp xếp bằng hai con trỏ — nền tảng của
  việc sắp xếp dữ liệu lớn hơn RAM (\`heapq.merge\` trong Python dùng chính ý tưởng này).
- **Trộn danh sách đã sắp** trong database (merge join): nhanh hơn nhiều so với nested-loop join.
- **Nén mảng tại chỗ**: mẫu nhanh/chậm chính là cách nhiều thư viện cài đặt "lọc tại chỗ" không cấp phát bộ nhớ mới.
- **Kiểm tra chuỗi đối xứng / so khớp hai đầu** trong xử lý văn bản.
`,
  quiz: [
    {
      q: 'Điều kiện tiên quyết để kỹ thuật hai con trỏ "hai đầu hội tụ" cho kết quả đúng là gì?',
      options: [
        'Mảng phải có số phần tử chẵn',
        'Mỗi lần dịch con trỏ, ta phải chắc chắn loại bỏ ứng viên đó khỏi mọi lời giải khả dĩ',
        'Mảng phải chứa toàn số dương',
        'Phải có sẵn một bảng băm đi kèm',
      ],
      answer: 1,
      why: 'Đây là bản chất. Nếu không chứng minh được "bỏ đi không mất nghiệm", thuật toán sai. Với mảng đã sắp, `sum > target` cho phép kết luận a[r] quá lớn với MỌI đối tác còn lại.',
    },
    {
      q: 'Trong bài Container With Most Water, vì sao ta luôn dịch con trỏ ở phía có cột THẤP hơn?',
      options: [
        'Vì cột thấp dễ tính toán hơn',
        'Vì diện tích bị giới hạn bởi cột thấp; giữ nó lại thì mọi lựa chọn sau đều hẹp hơn và không cao hơn',
        'Vì cột cao có thể là đáp án cuối cùng nên phải giữ',
        'Vì làm vậy giúp mảng vẫn được sắp xếp',
      ],
      answer: 1,
      why: 'Diện tích = min(h[l],h[r]) × (r-l). Nếu giữ cột thấp, chiều rộng chắc chắn giảm còn chiều cao không thể vượt quá cột thấp đó → mọi phương án còn lại với nó đều tệ hơn. Vậy nên loại nó.',
    },
    {
      q: 'Mẫu "nhanh/chậm" (slow/fast) trên cùng một mảng thường dùng để làm gì?',
      options: [
        'Sắp xếp mảng tại chỗ',
        'Ghi đè/nén mảng tại chỗ với O(1) bộ nhớ phụ',
        'Tìm phần tử lớn thứ k',
        'Chia mảng thành hai nửa bằng nhau',
      ],
      answer: 1,
      why: '`slow` là con trỏ ghi, `fast` là con trỏ đọc. Đây là cách `remove duplicates`, `move zeroes`, và cả `filter` tại chỗ hoạt động — O(n) thời gian, O(1) bộ nhớ.',
    },
    {
      q: 'Bài 3Sum sắp xếp mảng rồi cố định phần tử i và chạy hai con trỏ. Tổng độ phức tạp?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
      answer: 2,
      why: 'Sắp xếp O(n log n) + với mỗi i (n lần) chạy hai con trỏ O(n) → O(n²). Bản ngây thơ ba vòng lặp là O(n³).',
    },
  ],
  quizPy: [
    {
      q: 'Điều kiện tiên quyết để kỹ thuật hai con trỏ "hai đầu hội tụ" cho kết quả đúng là gì?',
      options: [
        'List phải có số phần tử chẵn',
        'Mỗi lần dịch con trỏ, ta phải chắc chắn loại bỏ ứng viên đó khỏi mọi lời giải khả dĩ',
        'List phải chứa toàn số dương',
        'Phải có sẵn một dict đi kèm',
      ],
      answer: 1,
      why: 'Đây là bản chất. Nếu không chứng minh được "bỏ đi không mất nghiệm", thuật toán sai. Với list đã sắp, `sum > target` cho phép kết luận a[r] quá lớn với MỌI đối tác còn lại.',
    },
    {
      q: 'Trong bài Container With Most Water, vì sao ta luôn dịch con trỏ ở phía có cột THẤP hơn?',
      options: [
        'Vì cột thấp dễ tính toán hơn',
        'Vì diện tích bị giới hạn bởi cột thấp; giữ nó lại thì mọi lựa chọn sau đều hẹp hơn và không cao hơn',
        'Vì cột cao có thể là đáp án cuối cùng nên phải giữ',
        'Vì làm vậy giúp list vẫn được sắp xếp',
      ],
      answer: 1,
      why: 'Diện tích = min(h[l],h[r]) × (r-l). Nếu giữ cột thấp, chiều rộng chắc chắn giảm còn chiều cao không thể vượt quá cột thấp đó → mọi phương án còn lại với nó đều tệ hơn. Vậy nên loại nó.',
    },
    {
      q: 'Mẫu "nhanh/chậm" (slow/fast) trên cùng một list thường dùng để làm gì?',
      options: [
        'Sắp xếp list tại chỗ',
        'Ghi đè/nén list tại chỗ với O(1) bộ nhớ phụ',
        'Tìm phần tử lớn thứ k',
        'Chia list thành hai nửa bằng nhau',
      ],
      answer: 1,
      why: '`slow` là con trỏ ghi, `fast` là con trỏ đọc. Đây là cách `remove duplicates`, `move zeroes`, và cả `filter` tại chỗ hoạt động — O(n) thời gian, O(1) bộ nhớ.',
    },
    {
      q: 'Bài 3Sum sắp xếp list rồi cố định phần tử i và chạy hai con trỏ. Tổng độ phức tạp?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
      answer: 2,
      why: 'Sắp xếp (`sorted()`) O(n log n) + với mỗi i (n lần) chạy hai con trỏ O(n) → O(n²). Bản ngây thơ ba vòng lặp là O(n³).',
    },
  ],
  problems: [
    {
      id: 'valid-palindrome',
      title: 'Chuỗi đối xứng hợp lệ',
      en: 'Valid Palindrome',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'isPalindrome',
      statement: `
Cho chuỗi \`s\`, trả về \`true\` nếu nó là **palindrome** khi chỉ xét chữ và số (bỏ qua dấu câu,
khoảng trắng) và **không phân biệt hoa thường**.

**Ví dụ**
- \`"A man, a plan, a canal: Panama"\` → \`true\`
- \`"race a car"\` → \`false\`
- \`" "\` → \`true\` (chuỗi rỗng sau khi lọc)
`,
      starter: `function isPalindrome(s) {\n  \n}`,
      starterPy: `def isPalindrome(s):\n    \n`,
      tests: [
        { args: ['A man, a plan, a canal: Panama'], expected: true, name: 'Ví dụ kinh điển' },
        { args: ['race a car'], expected: false, name: 'Không đối xứng' },
        { args: [' '], expected: true, name: 'Chỉ khoảng trắng' },
        { args: ['0P'], expected: false, name: 'Bẫy: so sánh mã ký tự thô' },
        { args: ['aa'], expected: true, name: 'Hai ký tự giống nhau' },
        { args: ['ab_a'], expected: true, name: 'Có ký tự đặc biệt ở giữa' },
        { args: ['.,'], expected: true, name: 'Toàn dấu câu' },
      ],
      hints: [
        'Đặt `l = 0`, `r = s.length - 1`. Trong khi `l < r`: nếu ký tự ở l không phải chữ/số thì `l++`; tương tự với r; nếu cả hai đều hợp lệ thì so sánh.',
        'Kiểm tra "chữ hoặc số" bằng regex `/[a-z0-9]/i` hoặc so sánh mã ký tự. Đừng quên `toLowerCase()` trước khi so sánh.',
        'Bẫy `"0P"`: nếu bạn so sánh mã ký tự mà không chuẩn hoá hoa/thường, `0`(48) và `P`(80) chênh nhau đúng 32 giống như quan hệ hoa-thường → dễ ra kết quả sai. Luôn chuẩn hoá trước.',
      ],
      hintsPy: [
        'Đặt `l = 0`, `r = len(s) - 1`. Trong khi `l < r`: nếu ký tự ở l không phải chữ/số thì `l += 1`; tương tự với r; nếu cả hai đều hợp lệ thì so sánh.',
        'Kiểm tra "chữ hoặc số" bằng phương thức có sẵn `str.isalnum()` — không cần regex. Đừng quên `.lower()` trước khi so sánh.',
        'Bẫy `"0P"`: nếu bạn so sánh mã ký tự (`ord(...)`) mà không chuẩn hoá hoa/thường, `\'0\'`(48) và `\'P\'`(80) chênh nhau đúng 32 giống như quan hệ hoa-thường → dễ ra kết quả sai. Luôn `.lower()` trước.',
      ],
      approach: `
Có hai cách và cả hai đều nên biết:

**Cách 1 — Lọc rồi so (dễ viết):** \`const t = s.toLowerCase().replace(/[^a-z0-9]/g,'')\` rồi so \`t\` với \`t\` đảo ngược.
Đúng, O(n) thời gian nhưng tốn O(n) bộ nhớ phụ.

**Cách 2 — Hai con trỏ tại chỗ (được đánh giá cao hơn):** O(1) bộ nhớ. Đây là câu hỏi tiếp theo
người phỏng vấn *chắc chắn* sẽ hỏi: "làm được với O(1) bộ nhớ không?"

Bất biến: mọi cặp ký tự đã đi qua đều khớp nhau. Khi \`l >= r\` thì toàn chuỗi đã được xác nhận.
`,
      solution: `function isPalindrome(s) {
  const ok = (c) => /[a-z0-9]/i.test(c);
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !ok(s[l])) l++;
    while (l < r && !ok(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}`,
      solutionPy: `def isPalindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l, r = l + 1, r - 1
    return True`,
      complexity: {
        question: 'Lời giải hai con trỏ dùng bao nhiêu bộ nhớ phụ?',
        options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
        answer: 1,
        why: 'Chỉ hai biến chỉ số, không tạo chuỗi mới. Bản `replace` + đảo chuỗi tốn O(n) bộ nhớ — đây chính là điểm khác biệt người phỏng vấn muốn nghe.',
      },
      realWorld: 'Kiểm tra tính đối xứng của dữ liệu: xác thực checksum hai chiều, kiểm tra chuỗi DNA đảo bổ sung, so khớp hai đầu buffer trong parser.',
    },
    {
      id: 'two-sum-ii',
      title: 'Tổng hai số II — mảng đã sắp xếp',
      en: 'Two Sum II',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'twoSumSorted',
      statement: `
Cho mảng \`numbers\` **đã sắp xếp tăng dần** và số \`target\`. Tìm hai số có tổng bằng \`target\`.

Trả về \`[index1, index2]\` với chỉ số bắt đầu từ **1** và \`index1 < index2\`.
Bắt buộc dùng **O(1) bộ nhớ phụ** (nên không được dùng Map!).

**Ví dụ**
- \`numbers = [2,7,11,15], target = 9\` → \`[1,2]\`
- \`numbers = [2,3,4], target = 6\` → \`[1,3]\`
`,
      starter: `function twoSumSorted(numbers, target) {\n  \n}`,
      starterPy: `def twoSumSorted(numbers, target):\n    \n`,
      tests: [
        { args: [[2, 7, 11, 15], 9], expected: [1, 2], name: 'Ví dụ 1' },
        { args: [[2, 3, 4], 6], expected: [1, 3], name: 'Hai đầu' },
        { args: [[-1, 0], -1], expected: [1, 2], name: 'Số âm' },
        { args: [[1, 2, 3, 4, 4, 9, 56, 90], 8], expected: [4, 5], name: 'Giá trị lặp' },
        { args: [[5, 25, 75], 100], expected: [2, 3], name: 'Hai phần tử cuối' },
      ],
      hints: [
        'Ràng buộc "O(1) bộ nhớ" là lời nhắc rằng bạn không được dùng Map. Vậy phải khai thác tính chất nào của mảng? — nó **đã được sắp xếp**.',
        'Đặt `l` ở đầu, `r` ở cuối. Tổng hiện tại quá nhỏ → cần số lớn hơn → `l++`. Quá lớn → `r--`.',
        'Vì sao đúng? Khi `a[l] + a[r] > target`, thì a[r] cộng với phần tử NHỎ NHẤT còn lại đã dư → a[r] không thể thuộc lời giải nào → loại bỏ an toàn. Đừng quên +1 vào chỉ số khi trả về.',
      ],
      hintsPy: [
        'Ràng buộc "O(1) bộ nhớ" là lời nhắc rằng bạn không được dùng dict. Vậy phải khai thác tính chất nào của list? — nó **đã được sắp xếp**.',
        'Đặt `l` ở đầu, `r` ở cuối. Tổng hiện tại quá nhỏ → cần số lớn hơn → `l += 1`. Quá lớn → `r -= 1`.',
        'Vì sao đúng? Khi `a[l] + a[r] > target`, thì a[r] cộng với phần tử NHỎ NHẤT còn lại đã dư → a[r] không thể thuộc lời giải nào → loại bỏ an toàn. Đừng quên +1 vào chỉ số khi trả về.',
      ],
      diagnostics: [
        { test: 'new Map|new Set|\\{\\s*\\}\\s*;?\\s*\\n[\\s\\S]*\\[[a-z]+\\]\\s*=', message: 'Đề yêu cầu O(1) bộ nhớ phụ — dùng Map là vi phạm. Hãy khai thác việc mảng đã sắp xếp.' },
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lặp lồng nhau là O(n²). Với mảng đã sắp, chỉ cần MỘT vòng while với hai con trỏ.' },
      ],
      diagnosticsPy: [
        { test: '\\{\\s*\\}|\\bdict\\s*\\(', message: 'Đề yêu cầu O(1) bộ nhớ phụ — dùng dict là vi phạm. Hãy khai thác việc list đã sắp xếp.' },
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lặp lồng nhau là O(n²). Với list đã sắp, chỉ cần MỘT vòng while với hai con trỏ.' },
      ],
      approach: `
Đây là bài giúp bạn cảm nhận rõ nhất "vì sao hai con trỏ đúng".

Hình dung ma trận mọi cặp (l, r). Bắt đầu từ **góc** (0, n-1) — vị trí đặc biệt vì nó vừa có
phần tử nhỏ nhất vừa có phần tử lớn nhất:

- \`sum > target\`: mọi cặp \`(l', r)\` với \`l' > l\` còn lớn hơn nữa (vì a[l'] ≥ a[l]).
  → cả **cột r** bị loại → \`r--\`.
- \`sum < target\`: mọi cặp \`(l, r')\` với \`r' < r\` còn nhỏ hơn → cả **hàng l** bị loại → \`l++\`.

Mỗi bước loại một hàng hoặc một cột → tối đa 2n bước → O(n).
Kỹ thuật "đi từ một góc của ma trận" này còn dùng lại trong bài *Search a 2D Matrix II*.
`,
      solution: `function twoSumSorted(numbers, target) {
  let l = 0, r = numbers.length - 1;
  while (l < r) {
    const sum = numbers[l] + numbers[r];
    if (sum === target) return [l + 1, r + 1];   // chỉ số 1-based
    if (sum < target) l++;
    else r--;
  }
  return [];
}`,
      solutionPy: `def twoSumSorted(numbers, target):
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:
            return [l + 1, r + 1]
        if s < target:
            l += 1
        else:
            r -= 1
    return []`,
      complexity: {
        question: 'Số bước tối đa của vòng lặp hai con trỏ trên mảng n phần tử?',
        options: ['n/2', 'n - 1', 'n log n', 'n²'],
        answer: 1,
        why: 'Mỗi vòng lặp dịch chuyển đúng một con trỏ, khoảng cách r-l giảm 1 mỗi bước, bắt đầu từ n-1 → tối đa n-1 bước → O(n).',
      },
      realWorld: 'Merge join trong cơ sở dữ liệu: khi hai bảng đã được sắp theo khoá, hệ quản trị dùng hai con trỏ để ghép mà không cần bảng băm — tiết kiệm RAM khi dữ liệu rất lớn.',
    },
    {
      id: 'container-most-water',
      title: 'Thùng chứa nhiều nước nhất',
      en: 'Container With Most Water',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'maxArea',
      statement: `
Cho mảng \`height\`, \`height[i]\` là chiều cao của cột thứ i (các cột cách nhau 1 đơn vị).
Chọn **hai cột** tạo thành thùng chứa nước. Trả về **lượng nước tối đa** chứa được.

Diện tích = \`min(height[l], height[r]) × (r - l)\`.

**Ví dụ**
- \`height = [1,8,6,2,5,4,8,3,7]\` → \`49\` (cột 1 và cột 8: min(8,7) × 7 = 49)
- \`height = [1,1]\` → \`1\`
`,
      starter: `function maxArea(height) {\n  \n}`,
      starterPy: `def maxArea(height):\n    \n`,
      tests: [
        { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, name: 'Ví dụ chuẩn' },
        { args: [[1, 1]], expected: 1, name: 'Hai cột bằng nhau' },
        { args: [[4, 3, 2, 1, 4]], expected: 16, name: 'Hai đầu cao nhất' },
        { args: [[1, 2, 1]], expected: 2, name: 'Ba cột' },
        { args: [[2, 3, 4, 5, 18, 17, 6]], expected: 17, name: 'Đỉnh ở giữa' },
        { args: [[0, 0, 0, 5, 5]], expected: 5, name: 'Có cột cao 0' },
      ],
      perfTests: [{ build: () => [Array.from({ length: 120000 }, (_, i) => (i * 7919) % 1000)], name: 'Hiệu năng: n=120.000' }],
      hints: [
        'Bản O(n²) xét mọi cặp. Để giảm xuống O(n), hãy bắt đầu từ cặp **rộng nhất** (l=0, r=n-1) và tìm cách loại bớt ứng viên.',
        'Ở mỗi bước, dịch con trỏ đứng ở cột **thấp hơn**. Vì sao? Nếu giữ cột thấp lại, chiều rộng chỉ giảm mà chiều cao không bao giờ vượt quá cột thấp đó.',
        'Chứng minh chặt: giả sử h[l] < h[r]. Với mọi k nằm giữa l và r, diện tích (l, k) = min(h[l], h[k]) × (k - l) ≤ h[l] × (r - l) = diện tích hiện tại. Vậy cột l không thể tham gia lời giải tốt hơn → loại nó an toàn.',
      ],
      hintsPy: [
        'Bản O(n²) xét mọi cặp. Để giảm xuống O(n), hãy bắt đầu từ cặp **rộng nhất** (l=0, r=n-1) và tìm cách loại bớt ứng viên.',
        'Ở mỗi bước, dịch con trỏ đứng ở cột **thấp hơn**. Vì sao? Nếu giữ cột thấp lại, chiều rộng chỉ giảm mà chiều cao không bao giờ vượt quá cột thấp đó.',
        'Chứng minh chặt: giả sử h[l] < h[r]. Với mọi k nằm giữa l và r, diện tích (l, k) = min(h[l], h[k]) × (k - l) ≤ h[l] × (r - l) = diện tích hiện tại. Vậy cột l không thể tham gia lời giải tốt hơn → loại nó an toàn.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,250}for', message: 'Hai vòng lồng nhau → O(n²), sẽ trượt test hiệu năng 60.000 phần tử. Hãy dùng hai con trỏ từ hai đầu.' },
        { test: 'Math\\.max\\s*\\(\\s*height', message: 'Cẩn thận: diện tích bị chặn bởi cột THẤP hơn (`Math.min`), không phải cột cao.' },
      ],
      diagnosticsPy: [
        { test: 'for[\\s\\S]{0,250}for', message: 'Hai vòng lồng nhau → O(n²), sẽ trượt test hiệu năng 60.000 phần tử. Hãy dùng hai con trỏ từ hai đầu.' },
        { test: 'max\\s*\\(\\s*height', message: 'Cẩn thận: diện tích bị chặn bởi cột THẤP hơn (`min(...)`), không phải cột cao.' },
      ],
      approach: `
**Vì sao tham lam "dịch cột thấp" lại đúng?** Đây là điểm khiến bài này đáng giá.

Diện tích = \`min(h[l], h[r]) × (r - l)\`. Bắt đầu ở cặp có **chiều rộng lớn nhất**.
Từ đây trở đi chiều rộng chỉ có thể giảm. Vậy để hy vọng có diện tích lớn hơn, chiều cao **bắt buộc**
phải tăng. Mà chiều cao bị chặn bởi cột thấp → phải bỏ cột thấp đi, không có cách nào khác.

\`\`\`
[1, 8, 6, 2, 5, 4, 8, 3, 7]
 l                       r    min(1,7)*8 = 8   -> h[l] thấp, l++
    l                    r    min(8,7)*7 = 49  -> h[r] thấp, r--
    l                 r       min(8,3)*6 = 18  -> r--
    ...                       max = 49
\`\`\`

**Bài học mang đi:** khi một đại lượng là tích của hai yếu tố mà một yếu tố *chỉ giảm*,
hãy bắt đầu ở cực trị của yếu tố đó rồi đi tham lam. Mẫu này lặp lại ở nhiều bài tối ưu.
`,
      solution: `function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    const area = Math.min(height[l], height[r]) * (r - l);
    if (area > best) best = area;
    if (height[l] < height[r]) l++;   // luôn bỏ cột thấp hơn
    else r--;
  }
  return best;
}`,
      solutionPy: `def maxArea(height):
    l, r, best = 0, len(height) - 1, 0
    while l < r:
        best = max(best, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return best`,
      complexity: {
        question: 'Độ phức tạp thời gian / bộ nhớ của lời giải hai con trỏ?',
        options: ['O(n²) / O(1)', 'O(n log n) / O(n)', 'O(n) / O(1)', 'O(n) / O(n)'],
        answer: 2,
        why: 'Mỗi bước dịch một con trỏ, tổng cộng ≤ n bước → O(n). Chỉ dùng vài biến → O(1).',
      },
      realWorld: 'Bài toán "chọn hai điểm để tối ưu một tích": chọn khoảng thời gian giữa hai mốc sao cho tối đa giá trị bị chặn bởi mốc yếu hơn — ví dụ tìm cặp máy chủ có băng thông khả dụng × khoảng cách lớn nhất.',
    },
    {
      id: 'three-sum',
      title: 'Bộ ba có tổng bằng 0',
      en: '3Sum',
      difficulty: 'Medium',
      targetMinutes: 25,
      entry: 'threeSum',
      statement: `
Cho mảng \`nums\`, tìm **tất cả bộ ba không trùng nhau** \`[a,b,c]\` sao cho \`a + b + c = 0\`.

Không được có bộ ba trùng lặp trong kết quả. Thứ tự các bộ ba và thứ tự trong bộ ba không quan trọng
(hệ thống chấm sẽ chuẩn hoá trước khi so sánh).

**Ví dụ**
- \`nums = [-1,0,1,2,-1,-4]\` → \`[[-1,-1,2],[-1,0,1]]\`
- \`nums = [0,1,1]\` → \`[]\`
- \`nums = [0,0,0]\` → \`[[0,0,0]]\`
`,
      starter: `function threeSum(nums) {\n  \n}`,
      starterPy: `def threeSum(nums):\n    \n`,
      tests: [
        { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]], name: 'Ví dụ chuẩn' },
        { args: [[0, 1, 1]], expected: [], name: 'Không có nghiệm' },
        { args: [[0, 0, 0]], expected: [[0, 0, 0]], name: 'Ba số 0' },
        { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]], name: 'Bốn số 0 — không được trùng bộ' },
        { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]], name: 'Có giá trị lặp' },
        { args: [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6]], expected: [[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]], name: 'Nhiều trùng lặp' },
      ],
      checkerSrc: `(got, exp) => {
        if (!Array.isArray(got)) return false;
        const norm = (g) => g.map(t => [...t].sort((a,b)=>a-b).join(',')).sort().join(' | ');
        return norm(got) === norm(exp);
      }`,
      checkerSrcPy: `lambda got, exp, args: isinstance(got, list) \\
        and sorted(','.join(str(x) for x in sorted(t)) for t in got) == sorted(','.join(str(x) for x in sorted(t)) for t in exp)`,
      hints: [
        'Giảm bài toán: cố định phần tử đầu tiên `nums[i]`, phần còn lại trở thành **Two Sum II** với target = `-nums[i]` trên đoạn `[i+1, n-1]`.',
        'Sắp xếp mảng trước. Sắp xếp cho bạn hai thứ: dùng được hai con trỏ, và các giá trị trùng nhau nằm cạnh nhau nên dễ bỏ qua.',
        'Xử lý trùng ở **cả ba vị trí**: (1) bỏ qua i nếu `nums[i] === nums[i-1]`; (2) sau khi tìm được nghiệm, tăng l cho tới khi giá trị đổi; (3) tương tự giảm r. Tối ưu thoát sớm: nếu `nums[i] > 0` thì dừng (mảng đã sắp, tổng ba số dương không thể bằng 0).',
      ],
      hintsPy: [
        'Giảm bài toán: cố định phần tử đầu tiên `nums[i]`, phần còn lại trở thành **Two Sum II** với target = `-nums[i]` trên đoạn `[i+1, n-1]`.',
        'Sắp xếp list trước bằng `sorted(nums)` (không dùng `.sort()` nếu còn cần thứ tự gốc ở nơi khác). Sắp xếp cho bạn hai thứ: dùng được hai con trỏ, và các giá trị trùng nhau nằm cạnh nhau nên dễ bỏ qua.',
        'Xử lý trùng ở **cả ba vị trí**: (1) bỏ qua i nếu `a[i] == a[i-1]`; (2) sau khi tìm được nghiệm, tăng l cho tới khi giá trị đổi; (3) tương tự giảm r. Tối ưu thoát sớm: nếu `a[i] > 0` thì dừng (list đã sắp, tổng ba số dương không thể bằng 0).',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,300}for[\\s\\S]{0,300}for', message: 'Ba vòng lặp lồng nhau → O(n³). Hãy cố định 1 phần tử rồi dùng hai con trỏ cho phần còn lại → O(n²).' },
        { test: 'JSON\\.stringify', message: 'Dùng Set chuỗi JSON để khử trùng thì chạy đúng nhưng tốn bộ nhớ và chậm. Sau khi sắp xếp, bạn khử trùng được bằng cách so sánh phần tử kề nhau — gọn và nhanh hơn.' },
      ],
      diagnosticsPy: [
        { test: 'for[\\s\\S]{0,300}for[\\s\\S]{0,300}for', message: 'Ba vòng lặp lồng nhau → O(n³). Hãy cố định 1 phần tử rồi dùng hai con trỏ cho phần còn lại → O(n²).' },
        { test: 'itertools|permutations|combinations', message: 'Sinh tổ hợp/hoán vị bằng itertools để thử mọi bộ ba là quá chậm và không cần thiết. Sắp xếp rồi dùng hai con trỏ cho phần còn lại → O(n²).' },
      ],
      approach: `
**Kỹ thuật quan trọng nhất ở đây: hạ bậc bài toán (reduction).**
3Sum = n lần bài 2Sum. Đây là mẫu tổng quát: kSum = n lần (k-1)Sum. Bạn có thể giải 4Sum bằng đúng ý này.

**Thuật toán:**
1. Sắp xếp \`nums\` — O(n log n).
2. Với mỗi \`i\` từ 0..n-3:
   - Nếu \`nums[i] > 0\` → dừng (mọi số sau đều dương, tổng không thể bằng 0).
   - Nếu \`i > 0 && nums[i] === nums[i-1]\` → bỏ qua (tránh bộ ba trùng).
   - Hai con trỏ \`l = i+1\`, \`r = n-1\` tìm cặp có tổng \`-nums[i]\`.
3. Khi tìm được nghiệm, **dịch cả hai con trỏ và bỏ qua giá trị lặp**.

**Vì sao khử trùng bằng "so với phần tử liền trước" là đủ?** Vì sau khi sắp xếp, mọi giá trị bằng nhau
nằm liền kề. Ta chỉ cho phép **lần xuất hiện đầu tiên** của mỗi giá trị đóng vai trò "phần tử i".

Độ phức tạp: O(n log n) + O(n²) = **O(n²)**, bộ nhớ O(1) (không tính output).
`,
      solution: `function threeSum(nums) {
  const a = [...nums].sort((x, y) => x - y);
  const res = [];
  const n = a.length;

  for (let i = 0; i < n - 2; i++) {
    if (a[i] > 0) break;                      // thoát sớm
    if (i > 0 && a[i] === a[i - 1]) continue; // bỏ qua i trùng

    let l = i + 1, r = n - 1;
    while (l < r) {
      const sum = a[i] + a[l] + a[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        res.push([a[i], a[l], a[r]]);
        l++; r--;
        while (l < r && a[l] === a[l - 1]) l++;   // bỏ qua l trùng
        while (l < r && a[r] === a[r + 1]) r--;   // bỏ qua r trùng
      }
    }
  }
  return res;
}`,
      solutionPy: `def threeSum(nums):
    a = sorted(nums)
    res, n = [], len(a)
    for i in range(n - 2):
        if a[i] > 0:
            break
        if i > 0 and a[i] == a[i - 1]:
            continue
        l, r = i + 1, n - 1
        while l < r:
            s = a[i] + a[l] + a[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([a[i], a[l], a[r]])
                l, r = l + 1, r - 1
                while l < r and a[l] == a[l - 1]:
                    l += 1
                while l < r and a[r] == a[r + 1]:
                    r -= 1
    return res`,
      complexity: {
        question: 'Độ phức tạp của 3Sum dùng sắp xếp + hai con trỏ?',
        options: ['O(n log n)', 'O(n²)', 'O(n² log n)', 'O(n³)'],
        answer: 1,
        why: 'Sắp xếp O(n log n) bị lấn át bởi vòng ngoài n lần × hai con trỏ O(n) = O(n²). Đây là cận tốt nhất đã biết cho 3Sum (bài toán 3SUM-hard nổi tiếng trong hình học tính toán).',
      },
      realWorld: 'Tìm tổ hợp triệt tiêu rủi ro: chọn 3 vị thế tài chính có tổng độ nhạy bằng 0 (delta-neutral). Cùng mẫu hình: giảm k chiều về 2 chiều rồi quét hai con trỏ.',
    },
  ],
},

/* ==================================================================== */
{
  id: 'sliding-window',
  name: 'Cửa sổ trượt',
  en: 'Sliding Window',
  icon: '🪟',
  days: [6, 7],
  summary: 'Tái sử dụng kết quả của đoạn con trước thay vì tính lại từ đầu — O(n²) thành O(n).',
  lesson: `
## 1. Vấn đề gốc

Bài toán dạng "tìm **đoạn con liên tiếp** (subarray/substring) thoả điều kiện X và tối ưu Y".
Có O(n²) đoạn con. Duyệt hết là quá chậm.

## 2. Ý tưởng cốt lõi

> Khi cửa sổ dịch từ \`[i, j]\` sang \`[i, j+1]\`, ta **không tính lại từ đầu** —
> chỉ cập nhật phần chênh lệch. Mỗi phần tử vào cửa sổ đúng 1 lần và ra đúng 1 lần → O(n).

Điều kiện để dùng được: trạng thái của cửa sổ phải **cập nhật được theo kiểu tăng dần**
(thêm 1 phần tử / bớt 1 phần tử) trong O(1) hoặc O(log n). Ví dụ: tổng, số lượng ký tự phân biệt,
số lần xuất hiện. Ngược lại, "trung vị của cửa sổ" thì cần cấu trúc phức tạp hơn (2 heap).

## 3. Hai kiểu cửa sổ

**(a) Cửa sổ cố định (kích thước k)**
\`\`\`js
let sum = 0;
for (let i = 0; i < n; i++) {
  sum += a[i];
  if (i >= k) sum -= a[i - k];   // phần tử rời khỏi cửa sổ
  if (i >= k - 1) best = Math.max(best, sum);
}
\`\`\`

**(b) Cửa sổ co giãn (quan trọng hơn nhiều)**
\`\`\`js
let l = 0;
for (let r = 0; r < n; r++) {
  thêm a[r] vào trạng thái;
  while (điều_kiện_bị_vi_phạm) {
    bớt a[l] khỏi trạng thái;
    l++;
  }
  // ở đây [l, r] luôn là cửa sổ HỢP LỆ dài nhất kết thúc tại r
  best = Math.max(best, r - l + 1);
}
\`\`\`

**Học thuộc khung (b).** 70% bài sliding window chỉ khác nhau ở phần "trạng thái" và "điều kiện vi phạm".

## 4. Nhận dạng bài toán

| Đề bài nói | Hướng làm |
|---|---|
| "đoạn con **liên tiếp** dài nhất thoả..." | cửa sổ co giãn, tối đa hoá \`r-l+1\` |
| "đoạn con ngắn nhất có tổng ≥ target" | cửa sổ co giãn, co lại khi *đã* thoả |
| "cửa sổ kích thước k" | cửa sổ cố định |
| "nhiều nhất k ký tự phân biệt" | cửa sổ + Map đếm |
| Mảng có **số âm** và hỏi tổng | ⚠️ sliding window **không** dùng được → chuyển sang prefix sum + hash |

Cảnh báo quan trọng: cửa sổ trượt yêu cầu tính **đơn điệu** — mở rộng cửa sổ làm đại lượng tăng
(hoặc giảm) một chiều. Có số âm thì "tổng tăng khi thêm phần tử" không còn đúng → thuật toán sai.

## 5. Bẫy thường gặp

- Dùng \`if\` thay vì \`while\` khi co cửa sổ (có thể phải co nhiều bước).
- Cập nhật đáp án sai thời điểm: với bài "dài nhất" cập nhật *sau* khi đã sửa cửa sổ hợp lệ;
  với bài "ngắn nhất" cập nhật *bên trong* vòng co.
- Quên xoá khoá khỏi Map khi số đếm về 0 (làm sai phép kiểm tra \`map.size\`).

## 6. Ứng dụng thực tế

- **Rate limiting** (giới hạn tần suất API): "tối đa 100 request trong 60 giây trượt" — chính xác là cửa sổ trượt.
- **Chỉ báo tài chính**: đường trung bình động (moving average) 20 phiên.
- **Giám sát hệ thống**: tỉ lệ lỗi trong 5 phút gần nhất → cảnh báo.
- **Nén dữ liệu**: LZ77 dùng cửa sổ trượt để tìm chuỗi lặp gần nhất.
- **Xử lý tín hiệu/video**: bộ lọc trên cửa sổ mẫu liên tiếp.
`,
  lessonPy: `
## 1. Vấn đề gốc

Bài toán dạng "tìm **đoạn con liên tiếp** (subarray/substring) thoả điều kiện X và tối ưu Y" (dài
nhất, ngắn nhất, tổng lớn nhất...). Một mảng độ dài \`n\` có tới O(n²) đoạn con liên tiếp khác nhau
(mỗi cặp điểm bắt đầu/kết thúc là một đoạn), nên nếu duyệt và tính lại từ đầu cho từng đoạn, tổng
chi phí ít nhất là O(n²) — quá chậm khi \`n\` lớn.

\`\`\`python
def doan_dai_nhat_tong_le_k_cham(a, k):
    n = len(a)
    best = 0
    for i in range(n):
        for j in range(i, n):          # xét MỌI đoạn con [i, j]
            if sum(a[i:j + 1]) <= k:     # sum() lại quét từ đầu -> lãng phí, tính đi tính lại
                best = max(best, j - i + 1)
    return best
\`\`\`

Nhận ra vấn đề: khi đi từ đoạn \`[i, j]\` sang đoạn \`[i, j+1]\`, phần lớn dữ liệu (từ \`i\` đến \`j\`)
không hề đổi — chỉ có thêm đúng một phần tử mới. Vậy tại sao phải \`sum()\` lại từ đầu mỗi lần?

## 2. Ý tưởng cốt lõi

> Khi cửa sổ dịch từ \`[l, r]\` sang \`[l, r+1]\`, ta **không tính lại từ đầu** —
> chỉ cập nhật phần chênh lệch (thêm phần tử mới vào, và nếu cần thì bớt phần tử cũ ra).
> Mỗi phần tử vào cửa sổ đúng 1 lần và ra khỏi cửa sổ đúng 1 lần trong suốt vòng lặp → tổng công
> việc là O(n), dù số lượng cửa sổ đã xét qua vẫn là O(n²).

Điều kiện để dùng được kỹ thuật này: trạng thái của cửa sổ phải **cập nhật được theo kiểu tăng dần**
(thêm 1 phần tử / bớt 1 phần tử) trong O(1) hoặc O(log n) — ví dụ: tổng cộng dồn, số lượng ký tự
phân biệt, số lần xuất hiện của từng ký tự. Ngược lại, một đại lượng như "trung vị của cửa sổ" không
cập nhật kiểu tăng dần đơn giản được, nên cần cấu trúc phức tạp hơn (hai heap).

## 3. Cấu trúc & hàm Python thường dùng trong chủ đề này

| Tên | Vai trò | Ví dụ dùng nhanh |
|---|---|---|
| \`collections.Counter\` | Đếm số lần xuất hiện của từng phần tử trong cửa sổ hiện tại | \`window = Counter()\` rồi \`window[ch] += 1\` |
| \`collections.defaultdict(int)\` | Tương tự Counter, nhưng chủ động hơn khi cần logic đặc biệt | \`count = defaultdict(int)\` |
| \`len(dict)\` | Số lượng khoá phân biệt hiện có — dùng cho "nhiều nhất k ký tự phân biệt" | \`if len(count) > k: ...\` |
| \`max(best, r - l + 1)\` | Cập nhật đáp án là độ dài cửa sổ hiện tại, nếu nó lớn hơn đáp án cũ | luôn đặt sau khi cửa sổ đã hợp lệ trở lại |
| \`while dieu_kien:\` (thay vì \`if\`) | Co cửa sổ tới khi hợp lệ — có thể cần co NHIỀU bước liên tiếp, không chỉ một | \`while count[ch] > 1: ...\` |
| \`del d[key]\` | Xoá hẳn khoá khỏi dict khi số đếm về 0, tránh \`len(d)\` bị sai | \`if count[ch] == 0: del count[ch]\` |
| \`s[l:r+1]\` | Cắt ra chuỗi con hiện tại của cửa sổ để trả kết quả cuối cùng | chỉ dùng lúc trả kết quả, tránh cắt lặp lại bên trong vòng lặp chính |

## 4. Hai kiểu cửa sổ

**(a) Cửa sổ cố định (kích thước k)** — dùng khi đề cho sẵn độ dài cửa sổ, ví dụ "tổng lớn nhất của
mọi đoạn con liên tiếp dài đúng k phần tử":

\`\`\`python
def tong_lon_nhat_cua_so_k(a, k):
    total = sum(a[:k])       # tổng của cửa sổ đầu tiên, tính một lần duy nhất
    best = total
    for i in range(k, len(a)):
        total += a[i]          # phần tử mới a[i] TIẾN vào cửa sổ
        total -= a[i - k]       # phần tử a[i-k] RỜI khỏi cửa sổ (cửa sổ luôn giữ đúng k phần tử)
        best = max(best, total)
    return best

print(tong_lon_nhat_cua_so_k([2, 1, 5, 1, 3, 2], 3))   # 9 (đoạn [5, 1, 3])
\`\`\`

**(b) Cửa sổ co giãn (quan trọng hơn nhiều — 70% bài sliding window dùng khung này)**:

\`\`\`python
def doan_dai_nhat_khong_lap_ky_tu(s):
    seen = set()          # trạng thái của cửa sổ: tập ký tự đang có trong [l, r]
    l = 0
    best = 0
    for r in range(len(s)):
        while s[r] in seen:            # cửa sổ đang VI PHẠM (ký tự mới bị trùng) -> co lại từ trái
            seen.remove(s[l])
            l += 1
        seen.add(s[r])                  # ở đây cửa sổ [l, r] chắc chắn đã HỢP LỆ trở lại
        best = max(best, r - l + 1)      # nên mới được phép cập nhật đáp án
    return best

print(doan_dai_nhat_khong_lap_ky_tu("abcabcbb"))   # 3 ("abc")
\`\`\`

Hãy học thuộc bộ khung \`for r ... while vi_phạm: co lại ... cập nhật đáp án\` — phần lớn bài trong
chủ đề này chỉ khác nhau ở "trạng thái cửa sổ là gì" và "điều kiện vi phạm là gì", còn bộ khung giữ
nguyên.

## 5. Nhận dạng bài toán

| Đề bài nói | Hướng làm |
|---|---|
| "đoạn con **liên tiếp** dài nhất thoả..." | cửa sổ co giãn, tối đa hoá \`r-l+1\` |
| "đoạn con ngắn nhất có tổng ≥ target" | cửa sổ co giãn, co lại khi *đã* thoả |
| "cửa sổ kích thước k" | cửa sổ cố định |
| "nhiều nhất k ký tự phân biệt" | cửa sổ + dict đếm, so \`len(dict)\` với k |
| Mảng có **số âm** và hỏi tổng | sliding window **không** dùng được -> chuyển sang prefix sum + hash |

Cảnh báo quan trọng: cửa sổ trượt yêu cầu tính **đơn điệu** — mở rộng cửa sổ làm đại lượng tăng
(hoặc giảm) một chiều. Có số âm thì "tổng tăng khi thêm phần tử" không còn đúng nữa (thêm một số âm
làm tổng GIẢM) → thuật toán sai âm thầm.

## 6. Bẫy thường gặp

- Dùng \`if\` thay vì \`while\` khi co cửa sổ — có những bước cần co liên tiếp NHIỀU lần mới hợp lệ trở
  lại, \`if\` chỉ co được đúng một bước rồi dừng.
- Cập nhật đáp án sai thời điểm: với bài "dài nhất" cập nhật *sau* khi đã sửa cửa sổ hợp lệ;
  với bài "ngắn nhất" cập nhật *bên trong* vòng co (ngay khi cửa sổ vừa hợp lệ, trước khi co tiếp).
- Quên xoá khoá khỏi dict khi số đếm về 0 (làm sai phép kiểm tra \`len(count)\`, vì khoá với giá trị 0
  vẫn được \`dict\` tính là "đang tồn tại").
- \`collections.Counter\` rất tiện cho đếm, nhưng nhớ rằng \`counter[key] -= 1\` không tự xoá khoá khi về 0 —
  phải \`del counter[key]\` thủ công nếu logic dựa vào số lượng khoá còn lại (\`len(counter)\`).

## 7. Ứng dụng thực tế

- **Rate limiting** (giới hạn tần suất API): "tối đa 100 request trong 60 giây trượt" — chính xác là cửa sổ trượt.
- **Chỉ báo tài chính**: đường trung bình động (moving average) 20 phiên.
- **Giám sát hệ thống**: tỉ lệ lỗi trong 5 phút gần nhất → cảnh báo.
- **Nén dữ liệu**: LZ77 dùng cửa sổ trượt để tìm chuỗi lặp gần nhất.
- **Xử lý tín hiệu/video**: bộ lọc trên cửa sổ mẫu liên tiếp.
`,
  quiz: [
    {
      q: 'Vì sao cửa sổ trượt đạt O(n) dù có tới O(n²) đoạn con?',
      options: [
        'Vì nó chỉ xét các đoạn con có độ dài chẵn',
        'Vì mỗi phần tử chỉ vào cửa sổ một lần và ra khỏi cửa sổ một lần (phân tích khấu hao)',
        'Vì nó dùng bảng băm để nhớ mọi đoạn con',
        'Vì nó sắp xếp mảng trước',
      ],
      answer: 1,
      why: 'Con trỏ l và r đều chỉ đi tiến, tổng số bước ≤ 2n. Dù vòng while lồng trong for, tổng chi phí vẫn tuyến tính — đây gọi là phân tích khấu hao (amortized analysis).',
    },
    {
      q: 'Bài "đoạn con có tổng bằng k" với mảng CHỨA SỐ ÂM. Cửa sổ trượt có dùng được không?',
      options: [
        'Có, luôn dùng được cho mọi mảng',
        'Không — mất tính đơn điệu, phải dùng prefix sum + bảng băm',
        'Có, nhưng phải sắp xếp mảng trước',
        'Không, phải dùng quy hoạch động',
      ],
      answer: 1,
      why: 'Cửa sổ trượt dựa vào: mở rộng thì tổng tăng, co lại thì tổng giảm. Số âm phá vỡ điều đó nên không biết nên dịch l hay r. Cách đúng: pre[j]-pre[i]=k, tra `pre[j]-k` trong Map.',
    },
    {
      q: 'Trong khung cửa sổ co giãn, khi nào nên cập nhật đáp án cho bài "đoạn con NGẮN NHẤT thoả điều kiện"?',
      options: [
        'Ngay sau khi mở rộng r, trước vòng while',
        'Bên trong vòng while co cửa sổ, trước khi tăng l',
        'Sau khi kết thúc toàn bộ vòng for',
        'Không cần cập nhật, kết quả là r - l + 1 cuối cùng',
      ],
      answer: 1,
      why: 'Với bài "ngắn nhất", vòng while chạy khi cửa sổ ĐÃ thoả điều kiện và ta co để tìm bản ngắn hơn. Mỗi trạng thái bên trong while đều hợp lệ nên phải cập nhật ở đó. Ngược lại, bài "dài nhất" thì while chạy khi cửa sổ vi phạm, nên cập nhật sau while.',
    },
    {
      q: 'Rate limiter "tối đa 100 request trong 60 giây" thuộc dạng nào?',
      options: ['Cửa sổ cố định theo số phần tử', 'Cửa sổ co giãn theo thời gian (loại bỏ các mốc đã quá 60s)', 'Quy hoạch động', 'Chia để trị'],
      answer: 1,
      why: 'Đây là cửa sổ trượt theo miền thời gian: mỗi request đẩy vào hàng đợi, đồng thời loại mọi mốc cũ hơn now-60s ở đầu hàng đợi. Chi phí khấu hao O(1) mỗi request.',
    },
  ],
  quizPy: [
    {
      q: 'Vì sao cửa sổ trượt đạt O(n) dù có tới O(n²) đoạn con?',
      options: [
        'Vì nó chỉ xét các đoạn con có độ dài chẵn',
        'Vì mỗi phần tử chỉ vào cửa sổ một lần và ra khỏi cửa sổ một lần (phân tích khấu hao)',
        'Vì nó dùng dict để nhớ mọi đoạn con',
        'Vì nó sắp xếp list trước',
      ],
      answer: 1,
      why: 'Con trỏ l và r đều chỉ đi tiến, tổng số bước ≤ 2n. Dù vòng while lồng trong for, tổng chi phí vẫn tuyến tính — đây gọi là phân tích khấu hao (amortized analysis).',
    },
    {
      q: 'Bài "đoạn con có tổng bằng k" với list CHỨA SỐ ÂM. Cửa sổ trượt có dùng được không?',
      options: [
        'Có, luôn dùng được cho mọi list',
        'Không — mất tính đơn điệu, phải dùng prefix sum + dict',
        'Có, nhưng phải sắp xếp list trước',
        'Không, phải dùng quy hoạch động',
      ],
      answer: 1,
      why: 'Cửa sổ trượt dựa vào: mở rộng thì tổng tăng, co lại thì tổng giảm. Số âm phá vỡ điều đó nên không biết nên dịch l hay r. Cách đúng: pre[j]-pre[i]=k, tra `pre[j]-k` trong dict.',
    },
    {
      q: 'Trong khung cửa sổ co giãn, khi nào nên cập nhật đáp án cho bài "đoạn con NGẮN NHẤT thoả điều kiện"?',
      options: [
        'Ngay sau khi mở rộng r, trước vòng while',
        'Bên trong vòng while co cửa sổ, trước khi tăng l',
        'Sau khi kết thúc toàn bộ vòng for',
        'Không cần cập nhật, kết quả là r - l + 1 cuối cùng',
      ],
      answer: 1,
      why: 'Với bài "ngắn nhất", vòng while chạy khi cửa sổ ĐÃ thoả điều kiện và ta co để tìm bản ngắn hơn. Mỗi trạng thái bên trong while đều hợp lệ nên phải cập nhật ở đó. Ngược lại, bài "dài nhất" thì while chạy khi cửa sổ vi phạm, nên cập nhật sau while.',
    },
    {
      q: 'Rate limiter "tối đa 100 request trong 60 giây" thuộc dạng nào?',
      options: ['Cửa sổ cố định theo số phần tử', 'Cửa sổ co giãn theo thời gian (loại bỏ các mốc đã quá 60s)', 'Quy hoạch động', 'Chia để trị'],
      answer: 1,
      why: 'Đây là cửa sổ trượt theo miền thời gian: mỗi request đẩy vào hàng đợi (`collections.deque`), đồng thời loại mọi mốc cũ hơn now-60s ở đầu hàng đợi. Chi phí khấu hao O(1) mỗi request.',
    },
  ],
  problems: [
    {
      id: 'best-time-stock',
      title: 'Thời điểm mua bán cổ phiếu tốt nhất',
      en: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'maxProfit',
      statement: `
Mảng \`prices\` với \`prices[i]\` là giá cổ phiếu ngày thứ i. Bạn được **mua đúng một lần** và
**bán đúng một lần** (bán phải sau ngày mua). Trả về lợi nhuận lớn nhất; nếu không thể có lãi, trả về 0.

**Ví dụ**
- \`prices = [7,1,5,3,6,4]\` → \`5\` (mua ngày 1 giá 1, bán ngày 4 giá 6)
- \`prices = [7,6,4,3,1]\` → \`0\` (giá chỉ giảm)
`,
      starter: `function maxProfit(prices) {\n  \n}`,
      starterPy: `def maxProfit(prices):\n    \n`,
      tests: [
        { args: [[7, 1, 5, 3, 6, 4]], expected: 5, name: 'Ví dụ 1' },
        { args: [[7, 6, 4, 3, 1]], expected: 0, name: 'Giá chỉ giảm' },
        { args: [[1]], expected: 0, name: 'Một ngày' },
        { args: [[2, 4, 1]], expected: 2, name: 'Đỉnh ở giữa' },
        { args: [[3, 3, 3]], expected: 0, name: 'Giá không đổi' },
        { args: [[2, 1, 2, 1, 0, 1, 2]], expected: 2, name: 'Nhiều đáy' },
      ],
      perfTests: [{ build: () => [Array.from({ length: 100000 }, (_, i) => (i * 7919) % 1000)], name: 'Hiệu năng: 100.000 ngày' }],
      hints: [
        'Đừng xét mọi cặp (mua, bán) — đó là O(n²). Hãy duyệt một lượt và tự hỏi ở mỗi ngày: "nếu bán HÔM NAY, lợi nhuận tốt nhất là bao nhiêu?"',
        'Nếu bán hôm nay tại giá `p`, lợi nhuận tốt nhất = `p - (giá thấp nhất từ đầu tới hôm qua)`. Vậy chỉ cần nhớ **một biến**: giá nhỏ nhất đã thấy.',
        'Vòng lặp: `minPrice = Math.min(minPrice, p)` và `best = Math.max(best, p - minPrice)`. Thứ tự hai dòng này không ảnh hưởng kết quả vì `p - p = 0` không làm tăng best.',
      ],
      hintsPy: [
        'Đừng xét mọi cặp (mua, bán) — đó là O(n²). Hãy duyệt một lượt và tự hỏi ở mỗi ngày: "nếu bán HÔM NAY, lợi nhuận tốt nhất là bao nhiêu?"',
        'Nếu bán hôm nay tại giá `p`, lợi nhuận tốt nhất = `p - (giá thấp nhất từ đầu tới hôm qua)`. Vậy chỉ cần nhớ **một biến**: giá nhỏ nhất đã thấy.',
        'Vòng lặp: `min_price = min(min_price, p)` và `best = max(best, p - min_price)`. Thứ tự hai dòng này không ảnh hưởng kết quả vì `p - p = 0` không làm tăng best.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lồng nhau O(n²) sẽ trượt test 100.000 phần tử. Chỉ cần một lượt duyệt với biến "giá thấp nhất đã thấy".' },
        { test: 'Math\\.min\\s*\\(\\s*\\.\\.\\.|Math\\.max\\s*\\(\\s*\\.\\.\\.', message: 'Cẩn thận: `Math.min(...arr)` với mảng 100.000 phần tử có thể gây lỗi tràn stack, và nếu gọi trong vòng lặp thì thành O(n²).' },
      ],
      diagnosticsPy: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lồng nhau O(n²) sẽ trượt test 100.000 phần tử. Chỉ cần một lượt duyệt với biến "giá thấp nhất đã thấy".' },
        { test: 'min\\s*\\(\\s*prices\\s*\\)|max\\s*\\(\\s*prices\\s*\\)', message: 'Gọi `min(prices)`/`max(prices)` lại trong vòng lặp biến bài toán thành O(n²). Chỉ cần một biến tích luỹ "giá thấp nhất đã thấy".' },
      ],
      approach: `
Bài này là cửa sổ trượt ở dạng đơn giản nhất: cửa sổ \`[đáy_thấp_nhất, hôm_nay]\`.

**Đổi góc nhìn — mẹo quan trọng nhất:** thay vì hỏi "chọn cặp nào?", hãy **cố định điểm bán**
và hỏi "điểm mua tốt nhất cho ngày bán này là gì?". Câu trả lời hiển nhiên: giá thấp nhất trong quá khứ.
Mà giá thấp nhất trong quá khứ thì cập nhật được trong O(1) khi duyệt.

\`\`\`
prices  = [7, 1, 5, 3, 6, 4]
min     =  7  1  1  1  1  1
lãi nếu bán = 0  0  4  2  5  3   -> max = 5
\`\`\`

**Mẫu hình mang đi:** "cố định một đầu, tối ưu đầu còn lại bằng thông tin tích luỹ" —
áp dụng cho hàng loạt bài: Trapping Rain Water, Maximum Subarray, Stock II/III.
`,
      solution: `function maxProfit(prices) {
  let minPrice = Infinity, best = 0;
  for (const p of prices) {
    if (p < minPrice) minPrice = p;          // đáy tốt nhất tới hiện tại
    else if (p - minPrice > best) best = p - minPrice;
  }
  return best;
}`,
      solutionPy: `def maxProfit(prices):
    min_price, best = float('inf'), 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > best:
            best = p - min_price
    return best`,
      complexity: {
        question: 'Độ phức tạp thời gian / bộ nhớ?',
        options: ['O(n) / O(1)', 'O(n) / O(n)', 'O(n log n) / O(1)', 'O(n²) / O(1)'],
        answer: 0,
        why: 'Một lượt duyệt, hai biến. Đây cũng là bản rút gọn của thuật toán Kadane mà bạn sẽ gặp lại ở phần quy hoạch động.',
      },
      realWorld: 'Tính drawdown/lợi nhuận tối đa trong phân tích tài chính; rộng hơn là mẫu "so giá trị hiện tại với cực trị lịch sử" dùng trong giám sát chỉ số hệ thống.',
    },
    {
      id: 'longest-substring',
      title: 'Chuỗi con dài nhất không lặp ký tự',
      en: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'lengthOfLongestSubstring',
      statement: `
Cho chuỗi \`s\`, tìm **độ dài** chuỗi con **liên tiếp** dài nhất không chứa ký tự lặp lại.

**Ví dụ**
- \`"abcabcbb"\` → \`3\` ("abc")
- \`"bbbbb"\` → \`1\` ("b")
- \`"pwwkew"\` → \`3\` ("wke" — lưu ý "pwke" là *dãy con* chứ không liên tiếp)
`,
      starter: `function lengthOfLongestSubstring(s) {\n  \n}`,
      starterPy: `def lengthOfLongestSubstring(s):\n    \n`,
      tests: [
        { args: ['abcabcbb'], expected: 3, name: 'Ví dụ 1' },
        { args: ['bbbbb'], expected: 1, name: 'Toàn ký tự giống nhau' },
        { args: ['pwwkew'], expected: 3, name: 'Bẫy dãy con vs chuỗi con' },
        { args: [''], expected: 0, name: 'Chuỗi rỗng' },
        { args: [' '], expected: 1, name: 'Một khoảng trắng' },
        { args: ['dvdf'], expected: 3, name: 'Bẫy kinh điển: con trỏ trái không được lùi' },
        { args: ['abba'], expected: 2, name: 'Bẫy: nhảy l về vị trí cũ' },
      ],
      perfTests: [{ build: () => [Array.from({ length: 60000 }, (_, i) => String.fromCharCode(97 + ((i * 7919) % 26))).join('')], name: 'Hiệu năng: chuỗi 60.000 ký tự' }],
      hints: [
        'Khung cửa sổ co giãn: mở rộng `r`, khi cửa sổ **vi phạm** (có ký tự lặp) thì co `l` cho tới khi hợp lệ trở lại.',
        'Trạng thái cửa sổ = tập ký tự đang có. Dùng `Set`: khi thêm `s[r]` mà đã tồn tại, hãy `while` xoá `s[l]` và `l++` cho tới khi xoá được ký tự trùng đó.',
        'Bản tối ưu dùng `Map<char, lastIndex>` để nhảy `l` thẳng tới `lastIndex + 1`. **Bẫy "abba"**: con trỏ l chỉ được TIẾN, nên phải viết `l = Math.max(l, lastIndex + 1)`, nếu không l sẽ lùi lại và cho kết quả sai.',
      ],
      hintsPy: [
        'Khung cửa sổ co giãn: mở rộng `r`, khi cửa sổ **vi phạm** (có ký tự lặp) thì co `l` cho tới khi hợp lệ trở lại.',
        'Trạng thái cửa sổ = tập ký tự đang có. Dùng `set`: khi thêm `s[r]` mà đã tồn tại, hãy `while` xoá `s[l]` và `l += 1` cho tới khi xoá được ký tự trùng đó.',
        'Bản tối ưu dùng `dict` ánh xạ ký tự → chỉ số xuất hiện gần nhất, để nhảy `l` thẳng tới `last[c] + 1`. **Bẫy "abba"**: con trỏ l chỉ được TIẾN, nên phải viết `l = max(l, last[c] + 1)`, nếu không l sẽ lùi lại và cho kết quả sai.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,250}for', message: 'Hai vòng lồng nhau (thử mọi chuỗi con) là O(n²)/O(n³). Hãy dùng một vòng for cho r và một vòng while co l — tổng vẫn là O(n).' },
        { test: 'if\\s*\\([^)]*has\\([^)]*\\)\\s*\\)\\s*\\{?\\s*l\\+\\+', message: 'Dùng `if` để co cửa sổ là chưa đủ — có thể phải co nhiều bước liên tiếp. Đổi thành `while`.' },
      ],
      diagnosticsPy: [
        { test: 'for[\\s\\S]{0,250}for', message: 'Hai vòng lồng nhau (thử mọi chuỗi con) là O(n²)/O(n³). Hãy dùng một vòng for cho r và một vòng while co l — tổng vẫn là O(n).' },
        { test: 'if\\s+\\w+\\s+in\\s+\\w+\\s*:\\s*\\n\\s*l\\s*\\+=\\s*1', message: 'Dùng `if` để co cửa sổ là chưa đủ — có thể phải co nhiều bước liên tiếp. Đổi thành `while`.' },
      ],
      approach: `
**Khung chuẩn (Set):**
\`\`\`js
let l = 0, best = 0;
const win = new Set();
for (let r = 0; r < s.length; r++) {
  while (win.has(s[r])) { win.delete(s[l]); l++; }   // co tới khi hợp lệ
  win.add(s[r]);
  best = Math.max(best, r - l + 1);                  // cập nhật SAU khi hợp lệ
}
\`\`\`

**Bất biến (nhớ câu này):** *sau vòng while, \`[l..r]\` luôn không có ký tự lặp.*
Vì \`r - l + 1\` là cửa sổ hợp lệ dài nhất kết thúc tại r, lấy max qua mọi r chính là đáp án.

**Vì sao O(n) dù có while lồng trong for?** \`l\` không bao giờ lùi. Tổng số lần \`l++\` trong toàn bộ
chương trình ≤ n. Cộng với n bước của \`r\` → tối đa 2n thao tác.

**Bẫy "dvdf"** (đáp án 3, không phải 2): nhiều người reset \`l\` về \`i+1\` của lần gặp trùng đầu tiên
mà quên rằng cửa sổ đã trượt qua đó. Luôn dùng \`Math.max\` khi nhảy l.
`,
      solution: `function lengthOfLongestSubstring(s) {
  const last = new Map();     // ký tự -> chỉ số xuất hiện gần nhất
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    if (last.has(c)) l = Math.max(l, last.get(c) + 1);  // l chỉ được TIẾN
    last.set(c, r);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
      solutionPy: `def lengthOfLongestSubstring(s):
    last = {}
    l = best = 0
    for r, c in enumerate(s):
        if c in last:
            l = max(l, last[c] + 1)
        last[c] = r
        best = max(best, r - l + 1)
    return best`,
      complexity: {
        question: 'Vì sao thuật toán là O(n) dù có vòng while lồng trong vòng for?',
        options: [
          'Vì vòng while chỉ chạy tối đa 2 lần mỗi bước',
          'Vì con trỏ l không bao giờ lùi, tổng số lần dịch l trong cả chương trình ≤ n (khấu hao)',
          'Vì chuỗi luôn ngắn',
          'Vì Set có độ phức tạp O(log n)',
        ],
        answer: 1,
        why: 'Đây là phân tích khấu hao. Đừng nhìn "for lồng while" rồi kết luận O(n²) — hãy đếm TỔNG số thao tác của con trỏ trong toàn bộ vòng đời.',
      },
      realWorld: 'Phát hiện phiên làm việc hợp lệ dài nhất không có sự kiện trùng; hoặc trong bảo mật: tìm chuỗi thao tác dài nhất không lặp lại một hành động nhạy cảm.',
    },
    {
      id: 'longest-repeating-replacement',
      title: 'Chuỗi lặp dài nhất sau k lần thay thế',
      en: 'Longest Repeating Character Replacement',
      difficulty: 'Medium',
      targetMinutes: 22,
      entry: 'characterReplacement',
      statement: `
Cho chuỗi \`s\` (chữ hoa A-Z) và số nguyên \`k\`. Bạn được **đổi tối đa k ký tự** thành bất kỳ chữ cái nào.
Trả về độ dài chuỗi con liên tiếp **dài nhất chỉ gồm một loại ký tự** có thể đạt được.

**Ví dụ**
- \`s = "ABAB", k = 2\` → \`4\` (đổi 2 chữ A thành B)
- \`s = "AABABBA", k = 1\` → \`4\` ("AABA" → "AAAA")
`,
      starter: `function characterReplacement(s, k) {\n  \n}`,
      starterPy: `def characterReplacement(s, k):\n    \n`,
      tests: [
        { args: ['ABAB', 2], expected: 4, name: 'Ví dụ 1' },
        { args: ['AABABBA', 1], expected: 4, name: 'Ví dụ 2' },
        { args: ['AAAA', 0], expected: 4, name: 'k = 0, đã đồng nhất' },
        { args: ['ABCDE', 1], expected: 2, name: 'Toàn ký tự khác nhau' },
        { args: ['A', 0], expected: 1, name: 'Một ký tự' },
        { args: ['AAAB', 0], expected: 3, name: 'k = 0' },
        { args: ['ABBB', 2], expected: 4, name: 'Đổi được hết' },
      ],
      hints: [
        'Câu hỏi then chốt: **khi nào một cửa sổ là hợp lệ?** Cửa sổ `[l..r]` hợp lệ nếu số ký tự phải đổi ≤ k, tức là `(độ dài cửa sổ) - (số lần xuất hiện của ký tự nhiều nhất trong cửa sổ) <= k`.',
        'Giữ mảng đếm 26 phần tử cho cửa sổ hiện tại và biến `maxCount` = tần suất lớn nhất. Khi vi phạm, co `l` và giảm bộ đếm tương ứng.',
        'Mẹo nâng cao: **không cần** tính lại `maxCount` khi co cửa sổ. Nếu maxCount hơi "cũ" (lớn hơn thực tế), cửa sổ chỉ đơn giản không nở thêm — đáp án vẫn đúng vì ta chỉ quan tâm cửa sổ lớn nhất từng đạt được.',
      ],
      hintsPy: [
        'Câu hỏi then chốt: **khi nào một cửa sổ là hợp lệ?** Cửa sổ `[l..r]` hợp lệ nếu số ký tự phải đổi ≤ k, tức là `(độ dài cửa sổ) - (số lần xuất hiện của ký tự nhiều nhất trong cửa sổ) <= k`.',
        'Giữ một `dict` đếm cho cửa sổ hiện tại và biến `max_count` = tần suất lớn nhất. Khi vi phạm, co `l` và giảm bộ đếm tương ứng.',
        'Mẹo nâng cao: **không cần** tính lại `max_count` khi co cửa sổ. Nếu max_count hơi "cũ" (lớn hơn thực tế), cửa sổ chỉ đơn giản không nở thêm — đáp án vẫn đúng vì ta chỉ quan tâm cửa sổ lớn nhất từng đạt được.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,120}for[\\s\\S]{0,200}for', message: 'Ba vòng lặp lồng nhau quá chậm. Cửa sổ trượt chỉ cần một lượt duyệt r và một con trỏ l chạy tiến.' },
      ],
      diagnosticsPy: [
        { test: 'for[\\s\\S]{0,120}for[\\s\\S]{0,200}for', message: 'Ba vòng lặp lồng nhau quá chậm. Cửa sổ trượt chỉ cần một lượt duyệt r và một con trỏ l chạy tiến.' },
      ],
      approach: `
**Bước 1 — Phát biểu lại điều kiện hợp lệ.** Đây là toàn bộ độ khó của bài.
Trong cửa sổ độ dài \`L\`, nếu ký tự phổ biến nhất xuất hiện \`maxCount\` lần thì
số ký tự cần đổi = \`L - maxCount\`. Cửa sổ hợp lệ ⟺ \`L - maxCount <= k\`.

**Bước 2 — Áp khung cửa sổ co giãn.**
\`\`\`js
for (r...) {
  count[s[r]]++;
  maxCount = Math.max(maxCount, count[s[r]]);
  while ((r - l + 1) - maxCount > k) { count[s[l]]--; l++; }
  best = Math.max(best, r - l + 1);
}
\`\`\`

**Bước 3 — Vì sao không cần giảm \`maxCount\` khi co?**
Câu hỏi này rất hay được hỏi lại. Lý do: \`best\` là một *biến chỉ tăng*. Nếu \`maxCount\` bị "phóng đại",
điều kiện while trở nên dễ dãi hơn → cửa sổ có thể lớn hơn thực tế hợp lệ? Không —
vì cửa sổ chỉ nở khi có một ký tự **thực sự** đạt tần suất cao hơn. Cửa sổ không bao giờ nở
vượt quá kích thước hợp lệ lớn nhất đã từng thấy. Ta chỉ mất tính "cửa sổ hiện tại luôn hợp lệ",
nhưng vẫn giữ được đáp án đúng.

*(Nếu thấy lập luận này khó chịu — hoàn toàn hợp lý — bạn có thể tính lại maxCount = max(count) mỗi bước:
O(26n), vẫn tuyến tính và dễ chứng minh hơn.)*
`,
      solution: `function characterReplacement(s, k) {
  const count = new Array(26).fill(0);
  let l = 0, maxCount = 0, best = 0;

  for (let r = 0; r < s.length; r++) {
    const ri = s.charCodeAt(r) - 65;
    count[ri]++;
    maxCount = Math.max(maxCount, count[ri]);

    // (độ dài) - (ký tự phổ biến nhất) = số ký tự phải đổi
    while ((r - l + 1) - maxCount > k) {
      count[s.charCodeAt(l) - 65]--;
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`,
      solutionPy: `def characterReplacement(s, k):
    count = {}
    l = max_count = best = 0
    for r, c in enumerate(s):
        count[c] = count.get(c, 0) + 1
        max_count = max(max_count, count[c])
        while (r - l + 1) - max_count > k:
            count[s[l]] -= 1
            l += 1
        best = max(best, r - l + 1)
    return best`,
      complexity: {
        question: 'Độ phức tạp của lời giải cửa sổ trượt (bảng chữ cái 26 ký tự)?',
        options: ['O(n) hoặc O(26n) = O(n)', 'O(n log n)', 'O(n²)', 'O(26ⁿ)'],
        answer: 0,
        why: 'Mỗi con trỏ đi qua chuỗi một lần; thao tác trong cửa sổ là hằng số (hoặc 26 nếu tính lại maxCount) → tuyến tính.',
      },
      realWorld: 'Bài toán "chuỗi đồng nhất dài nhất sau k lần sửa" xuất hiện khi làm sạch dữ liệu chuỗi thời gian: tìm khoảng thời gian dài nhất mà một trạng thái chiếm ưu thế, cho phép tối đa k điểm nhiễu.',
    },
    {
      id: 'min-size-subarray-sum',
      title: 'Đoạn con ngắn nhất có tổng ≥ target',
      en: 'Minimum Size Subarray Sum',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'minSubArrayLen',
      statement: `
Cho mảng số **nguyên dương** \`nums\` và số \`target\`. Trả về **độ dài nhỏ nhất** của một đoạn con
liên tiếp có tổng ≥ \`target\`. Nếu không tồn tại, trả về \`0\`.

**Ví dụ**
- \`target = 7, nums = [2,3,1,2,4,3]\` → \`2\` (đoạn \`[4,3]\`)
- \`target = 11, nums = [1,1,1,1,1,1,1,1]\` → \`0\`
`,
      starter: `function minSubArrayLen(target, nums) {\n  \n}`,
      starterPy: `def minSubArrayLen(target, nums):\n    \n`,
      tests: [
        { args: [7, [2, 3, 1, 2, 4, 3]], expected: 2, name: 'Ví dụ 1' },
        { args: [4, [1, 4, 4]], expected: 1, name: 'Một phần tử là đủ' },
        { args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0, name: 'Không tồn tại' },
        { args: [15, [1, 2, 3, 4, 5]], expected: 5, name: 'Cả mảng' },
        { args: [213, [12, 28, 83, 4, 25, 26, 25, 2, 25, 25, 25, 12]], expected: 8, name: 'Trường hợp dài' },
      ],
      perfTests: [{ build: () => [100001, new Array(100000).fill(1)], expected: 0, name: 'Hiệu năng: n=100.000' }],
      hints: [
        'Đây là bài "NGẮN NHẤT" nên logic ngược với bài "dài nhất": mở rộng r cho tới khi cửa sổ **đã thoả** (tổng ≥ target), rồi co l để tìm bản ngắn hơn.',
        'Khung: `sum += nums[r]; while (sum >= target) { best = Math.min(best, r-l+1); sum -= nums[l]; l++; }`. Chú ý cập nhật đáp án **bên trong** vòng while.',
        'Đề yêu cầu số nguyên dương — đó chính là điều kiện cho tính đơn điệu (thêm phần tử thì tổng chỉ tăng). Nếu có số âm, thuật toán này sai và phải dùng prefix sum + deque.',
      ],
      hintsPy: [
        'Đây là bài "NGẮN NHẤT" nên logic ngược với bài "dài nhất": mở rộng r cho tới khi cửa sổ **đã thoả** (tổng ≥ target), rồi co l để tìm bản ngắn hơn.',
        'Khung: `total += nums[r]` rồi `while total >= target: best = min(best, r-l+1); total -= nums[l]; l += 1`. Chú ý cập nhật đáp án **bên trong** vòng while.',
        'Đề yêu cầu số nguyên dương — đó chính là điều kiện cho tính đơn điệu (thêm phần tử thì tổng chỉ tăng). Nếu có số âm, thuật toán này sai và phải dùng prefix sum + `collections.deque`.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lồng nhau → O(n²). Chỉ cần một vòng for (r) và một vòng while (l) — hai con trỏ đều chỉ tiến.' },
      ],
      diagnosticsPy: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lồng nhau → O(n²). Chỉ cần một vòng for (r) và một vòng while (l) — hai con trỏ đều chỉ tiến.' },
      ],
      approach: `
So sánh trực tiếp hai khung để nhớ lâu:

| | Dài nhất | Ngắn nhất |
|---|---|---|
| Vòng while chạy khi | cửa sổ **vi phạm** | cửa sổ **đã thoả** |
| Cập nhật đáp án | **sau** while | **trong** while |
| Kết quả khởi tạo | 0 | Infinity |

Cùng một khung, chỉ đảo điều kiện. Nắm được bảng này bạn giải được đa số bài sliding window.

\`\`\`
target = 7,  nums = [2,3,1,2,4,3]
[2,3,1,2]      sum=8 >= 7 -> best=4, bỏ 2 -> sum=6
[3,1,2,4]      sum=10 -> best=4, bỏ 3 -> sum=7 -> best=3, bỏ 1 -> sum=6
[2,4,3]        sum=9 -> best=3, bỏ 2 -> sum=7 -> best=2 ✔
\`\`\`

**Mở rộng đáng biết:** với mảng có số âm, bài "đoạn con ngắn nhất tổng ≥ k" cần
prefix sum + hàng đợi đơn điệu (monotonic deque) — O(n) nhưng khó hơn hẳn.
`,
      solution: `function minSubArrayLen(target, nums) {
  let l = 0, sum = 0, best = Infinity;
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];
    while (sum >= target) {                 // đã thoả -> thử co cho ngắn hơn
      best = Math.min(best, r - l + 1);
      sum -= nums[l];
      l++;
    }
  }
  return best === Infinity ? 0 : best;
}`,
      solutionPy: `def minSubArrayLen(target, nums):
    l = total = 0
    best = float('inf')
    for r, x in enumerate(nums):
        total += x
        while total >= target:
            best = min(best, r - l + 1)
            total -= nums[l]
            l += 1
    return 0 if best == float('inf') else best`,
      complexity: {
        question: 'Độ phức tạp thời gian?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(target · n)'],
        answer: 0,
        why: 'Cả l và r chỉ tiến, tổng ≤ 2n bước. Có một biến thể O(n log n) dùng prefix sum + tìm nhị phân, hữu ích khi mảng có số âm bị cấm.',
      },
      realWorld: 'Tự động co giãn tài nguyên: tìm khoảng thời gian ngắn nhất mà tổng lưu lượng vượt ngưỡng để kích hoạt cảnh báo — tránh báo động giả do đo tức thời.',
    },
  ],
},
];
