/**
 * NHÓM 6 — Hoàn thiện: Intervals, Bit Manipulation, Math & Geometry
 */

export default [
/* ==================================================================== */
{
  id: 'intervals',
  name: 'Khoảng (Intervals)',
  en: 'Intervals',
  icon: '📅',
  days: [28],
  summary: 'Gần như mọi bài khoảng đều bắt đầu bằng một câu: sắp xếp theo đầu mút nào?',
  lesson: `
## 1. Vấn đề gốc

Khoảng \`[start, end]\` mô tả **thời gian** hoặc **phạm vi**: lịch họp, ca trực, đoạn bộ nhớ,
khoảng giá trị. Câu hỏi thường gặp: có chồng lấn không, gộp lại thế nào, cần bao nhiêu tài nguyên.

## 2. Ý tưởng cốt lõi

> **Bước đầu tiên của 95% bài khoảng: SẮP XẾP.**
> Câu hỏi duy nhất là: sắp theo \`start\` hay theo \`end\`?

| Mục tiêu | Sắp theo | Lý do |
|---|---|---|
| Gộp các khoảng chồng nhau | **start** | duyệt trái sang phải, gộp dần |
| Chọn **nhiều nhất** khoảng không chồng nhau | **end** | kết thúc sớm để lại nhiều chỗ nhất |
| Đếm số phòng họp cần thiết | tách start/end riêng, hoặc dùng heap theo end | đếm số khoảng "đang mở" |

Chọn sai tiêu chí sắp xếp = thuật toán sai. Đây là nơi bài khoảng "bẫy" người mới.

## 3. Điều kiện chồng lấn — nhớ chính xác

Hai khoảng \`[a1, a2]\` và \`[b1, b2]\` **chồng nhau** khi và chỉ khi:
\`\`\`
a1 <= b2 && b1 <= a2
\`\`\`
Nhớ dạng phủ định thì dễ hơn: **không** chồng ⟺ \`a2 < b1 || b2 < a1\` (cái này kết thúc trước cái kia bắt đầu).

⚠️ Luôn hỏi người phỏng vấn: **hai khoảng chạm nhau tại một điểm (\`[1,2]\` và \`[2,3]\`) có tính là chồng không?**
Với lịch họp thì thường **không** (họp xong lúc 2h, họp sau bắt đầu lúc 2h là hợp lệ);
với đoạn số nguyên thì thường **có**. Hỏi trước khi code là điểm cộng lớn.

## 4. Hai mẫu code cần thuộc

**(a) Gộp khoảng:**
\`\`\`js
intervals.sort((x, y) => x[0] - y[0]);
const res = [intervals[0]];
for (const [s, e] of intervals.slice(1)) {
  const last = res[res.length - 1];
  if (s <= last[1]) last[1] = Math.max(last[1], e);   // chồng -> nới rộng
  else res.push([s, e]);                              // rời nhau -> khoảng mới
}
\`\`\`

**(b) Quét đường (sweep line) — đếm số khoảng đang mở:**
\`\`\`js
const starts = intervals.map(i => i[0]).sort((a,b) => a-b);
const ends   = intervals.map(i => i[1]).sort((a,b) => a-b);
let rooms = 0, best = 0, j = 0;
for (const s of starts) {
  while (ends[j] <= s) { rooms--; j++; }    // các cuộc họp đã kết thúc
  rooms++;
  best = Math.max(best, rooms);
}
\`\`\`
Trực giác: tưởng tượng một đường thẳng quét từ trái sang phải trên trục thời gian;
mỗi \`start\` làm số phòng +1, mỗi \`end\` làm -1. Đỉnh cao nhất chính là đáp án.

## 5. Bẫy thường gặp

- Quên sắp xếp, hoặc sắp theo tiêu chí sai.
- Nhầm \`<\` và \`<=\` ở điều kiện chồng lấn (khác biệt ở trường hợp chạm biên).
- Khi gộp: quên \`Math.max\` ở đầu mút phải — \`[1,10]\` gộp với \`[2,3]\` vẫn phải là \`[1,10]\`.
- Sửa mảng đầu vào khi đề không cho phép (hãy sao chép trước khi sort).

## 6. Ứng dụng thực tế

- **Lịch & đặt phòng**: Google Calendar tìm khung giờ trống chính là bài gộp khoảng.
- **Cấp phát tài nguyên**: số máy chủ/nhân viên cần tại giờ cao điểm = bài phòng họp.
- **Quản lý bộ nhớ**: gộp các vùng nhớ trống liền kề (defragmentation).
- **Phân tích log**: gộp các khoảng downtime chồng lấn để tính tổng thời gian sự cố thực tế.
- **Đồ hoạ máy tính**: thuật toán quét đường để tô đa giác, phát hiện va chạm.
`,
  lessonPy: `
## 1. Vấn đề gốc

Một khoảng \`[start, end]\` mô tả **thời gian** hoặc **phạm vi**: một cuộc họp diễn ra từ 9h tới 10h,
một ca trực từ thứ Hai tới thứ Tư, một đoạn bộ nhớ được cấp phát từ địa chỉ 100 tới 200, một khoảng
giá trị hợp lệ từ 0 tới 100. Câu hỏi thường gặp xoay quanh các khoảng này: hai khoảng có chồng lấn
lên nhau không, nếu chồng thì gộp lại thành một khoảng lớn hơn ra sao, và tại một thời điểm bất kỳ
cần bao nhiêu tài nguyên (phòng họp, nhân viên...) để phục vụ hết mọi khoảng đang diễn ra.

Nếu duyệt các khoảng theo đúng thứ tự đề bài cho (không sắp xếp gì cả), ta không có cách nào biết
khoảng nào "đứng cạnh" khoảng nào trên trục thời gian — phải so sánh từng cặp một, tốn O(n²). Ví dụ
thử gộp \`[[1,3], [8,10], [2,6]]\` mà không sắp xếp: rất khó biết \`[1,3]\` và \`[2,6]\` chồng nhau trong
khi \`[8,10]\` đứng tách biệt, vì chúng không nằm cạnh nhau theo thứ tự xuất hiện trong đề.

## 2. Ý tưởng cốt lõi

> **Bước đầu tiên của khoảng 95% bài toán về khoảng: SẮP XẾP.** Một khi đã sắp xếp đúng tiêu chí, các
> khoảng liên quan tới nhau sẽ đứng CẠNH NHAU, biến bài toán so sánh từng cặp O(n²) thành một lượt
> quét tuyến tính O(n). Câu hỏi duy nhất còn lại là: sắp theo \`start\` hay theo \`end\`?

| Mục tiêu | Sắp theo | Lý do |
|---|---|---|
| Gộp các khoảng chồng nhau | start (\`key=lambda x: x[0]\`) | duyệt trái sang phải, khoảng nào chồng khoảng đang xét sẽ đứng ngay kế tiếp |
| Chọn nhiều nhất khoảng không chồng nhau | end (\`key=lambda x: x[1]\`) | khoảng kết thúc sớm nhất luôn để lại nhiều chỗ trống nhất cho các lựa chọn sau |
| Đếm số phòng họp cần thiết cùng lúc | tách riêng danh sách start/end, hoặc dùng \`heapq\` theo end | cần đếm số khoảng "đang mở" tại mỗi thời điểm |

Chọn sai tiêu chí sắp xếp sẽ cho ra thuật toán sai một cách âm thầm — chương trình vẫn chạy, chỉ là
kết quả không đúng. Đây chính là nơi bài toán khoảng "bẫy" người mới học nhiều nhất.

## 3. Cấu trúc & hàm Python thường dùng trong chủ đề này

| Tên | Vai trò | Ví dụ dùng nhanh |
|---|---|---|
| \`sorted(a, key=lambda x: x[0])\` | Sắp xếp theo điểm bắt đầu, tạo bản sao mới | dùng khi cần giữ nguyên mảng gốc |
| \`a.sort(key=lambda x: x[1])\` | Sắp xếp tại chỗ theo điểm kết thúc | dùng khi được phép sửa mảng gốc |
| \`max(a, b)\` | Lấy điểm kết thúc lớn hơn khi gộp hai khoảng chồng nhau | \`last[1] = max(last[1], e)\` |
| \`list(interval)\` | Sao chép một khoảng thành list có thể sửa được (nếu đề cho tuple bất biến) | \`res = [list(intervals[0])]\` |
| \`heapq\` | Theo dõi khoảng nào "đóng sớm nhất" trong số các khoảng đang mở | dùng trong bài đếm phòng họp |
| Biến đếm chạy (\`rooms\`, \`best\`) | Đếm số khoảng đang mở tại một thời điểm khi quét qua trục thời gian | xem thuật toán quét đường ở mục 5 |

## 4. Điều kiện chồng lấn — nhớ chính xác

Hai khoảng \`[a1, a2]\` và \`[b1, b2]\` **chồng nhau** khi và chỉ khi:
\`\`\`
a1 <= b2 and b1 <= a2
\`\`\`
Nhớ dạng phủ định thì thường dễ hình dung hơn: **không** chồng khi và chỉ khi
\`a2 < b1 or b2 < a1\` — nghĩa là một trong hai khoảng đã kết thúc hẳn trước khi khoảng kia bắt đầu.

Luôn hỏi rõ (với đề bài, hoặc người phỏng vấn nếu đang phỏng vấn trực tiếp): **hai khoảng chạm nhau
đúng tại một điểm** (ví dụ \`[1,2]\` và \`[2,3]\`) **có được tính là chồng lấn không?** Với bài lịch họp
thì thường KHÔNG (họp trước kết thúc lúc 2h, họp sau bắt đầu đúng lúc 2h vẫn là hợp lệ, không xung
đột); với bài đoạn số nguyên liên tục thì thường CÓ. Hỏi rõ điều này trước khi viết code là một điểm
cộng lớn, vì nó quyết định dùng \`<\` hay \`<=\` trong điều kiện so sánh.

## 5. Hai mẫu code cần thuộc

**(a) Gộp khoảng chồng nhau:**

\`\`\`python
def gop_khoang(intervals):
    intervals = sorted(intervals, key=lambda x: x[0])   # bước 1 bắt buộc: sắp theo điểm BẮT ĐẦU
    res = [list(intervals[0])]                             # khoảng đầu tiên luôn được giữ nguyên
    for s, e in intervals[1:]:
        last = res[-1]                                       # khoảng cuối cùng đã có trong kết quả
        if s <= last[1]:                                       # khoảng mới CHỒNG với khoảng cuối cùng
            last[1] = max(last[1], e)                            # nới rộng đầu mút phải, PHẢI dùng max()
        else:
            res.append([s, e])                                  # rời nhau hẳn -> thêm khoảng mới riêng
    return res

print(gop_khoang([[1, 3], [8, 10], [2, 6], [15, 18]]))
# Sau khi sắp xếp: [[1,3],[2,6],[8,10],[15,18]]
# [1,3] và [2,6] chồng nhau (2 <= 3) -> gộp thành [1,6]
# [1,6] và [8,10] KHÔNG chồng (8 > 6) -> [8,10] là khoảng mới
# Kết quả: [[1, 6], [8, 10], [15, 18]]
\`\`\`

Chú ý dòng \`last[1] = max(last[1], e)\`, không phải \`last[1] = e\`: nếu khoảng \`[1,10]\` gộp với một
khoảng nằm gọn bên trong như \`[2,3]\`, đầu mút phải phải giữ nguyên là \`10\` (lớn hơn \`3\`), không được
ghi đè thành \`3\`.

**(b) Quét đường (sweep line) — đếm số phòng họp cần thiết tại một thời điểm:**

\`\`\`python
def so_phong_can_thiet(intervals):
    starts = sorted(i[0] for i in intervals)     # tách riêng mọi điểm BẮT ĐẦU, sắp tăng dần
    ends = sorted(i[1] for i in intervals)         # tách riêng mọi điểm KẾT THÚC, sắp tăng dần
    rooms = best = j = 0
    for s in starts:
        while ends[j] <= s:       # mọi cuộc họp đã kết thúc TRƯỚC khi cuộc họp mới này bắt đầu
            rooms -= 1              # giải phóng phòng của các cuộc họp đó
            j += 1
        rooms += 1                  # cuộc họp mới bắt đầu -> chiếm thêm một phòng
        best = max(best, rooms)      # ghi nhận số phòng đang dùng nhiều nhất từ trước tới giờ
    return best

print(so_phong_can_thiet([[0, 30], [5, 10], [15, 20]]))   # 2
\`\`\`

Trực giác: tưởng tượng một đường thẳng đứng quét từ trái sang phải dọc theo trục thời gian; mỗi khi
gặp một điểm \`start\`, số phòng đang dùng \`+1\`; mỗi khi gặp một điểm \`end\`, số phòng \`-1\`. Giá trị
lớn nhất mà biến đếm từng đạt tới trong suốt quá trình quét chính là đáp án — số phòng tối đa cần
dùng cùng lúc tại một thời điểm bất kỳ.

## 6. Bẫy thường gặp

- Quên sắp xếp trước khi xử lý, hoặc sắp xếp theo tiêu chí sai (\`start\` khi cần \`end\`, hoặc ngược lại).
- Nhầm lẫn \`<\` và \`<=\` ở điều kiện chồng lấn — khác biệt chỉ lộ ra ở trường hợp hai khoảng chạm nhau
  đúng tại một điểm biên, dễ bị bỏ sót khi tự viết test.
- Khi gộp khoảng: quên dùng \`max()\` ở đầu mút phải — \`[1,10]\` gộp với \`[2,3]\` (nằm gọn bên trong)
  vẫn phải cho ra \`[1,10]\`, không phải \`[1,3]\`.
- Sửa mảng đầu vào khi đề không cho phép: dùng \`sorted(intervals, key=...)\` (tạo bản sao mới) thay vì
  \`intervals.sort(key=...)\` (sửa tại chỗ) nếu cần giữ nguyên mảng gốc sau khi hàm chạy xong.

## 7. Ứng dụng thực tế

- **Lịch & đặt phòng**: Google Calendar tìm khung giờ trống chính là bài gộp khoảng.
- **Cấp phát tài nguyên**: số máy chủ/nhân viên cần tại giờ cao điểm = bài phòng họp.
- **Quản lý bộ nhớ**: gộp các vùng nhớ trống liền kề (defragmentation).
- **Phân tích log**: gộp các khoảng downtime chồng lấn để tính tổng thời gian sự cố thực tế.
- **Đồ hoạ máy tính**: thuật toán quét đường để tô đa giác, phát hiện va chạm.
`,
  quiz: [
    {
      q: 'Với bài "chọn nhiều nhất các khoảng không chồng nhau", nên sắp xếp theo tiêu chí nào?',
      options: ['Theo start tăng dần', 'Theo end tăng dần', 'Theo độ dài tăng dần', 'Theo start giảm dần'],
      answer: 1,
      why: 'Kết thúc sớm nhất để lại nhiều thời gian nhất cho các khoảng sau. Sắp theo start hoặc độ dài đều có phản ví dụ — ví dụ một khoảng bắt đầu sớm nhưng rất dài sẽ chiếm chỗ của nhiều khoảng ngắn.',
    },
    {
      q: 'Hai khoảng [a1,a2] và [b1,b2] KHÔNG chồng nhau khi nào?',
      options: [
        'a1 < b1',
        'a2 < b1 hoặc b2 < a1',
        'a1 + a2 < b1 + b2',
        'a2 = b1',
      ],
      answer: 1,
      why: 'Không chồng ⟺ một khoảng kết thúc hoàn toàn trước khi khoảng kia bắt đầu. Phủ định của nó (a1 ≤ b2 và b1 ≤ a2) là điều kiện chồng lấn. Nhớ dạng phủ định thường dễ hơn.',
    },
    {
      q: 'Kỹ thuật "quét đường" (sweep line) trong bài đếm số phòng họp hoạt động thế nào?',
      options: [
        'Sắp xếp theo độ dài rồi đếm',
        'Tách riêng mảng start và end, quét theo thời gian: mỗi start làm bộ đếm +1, mỗi end làm -1; đỉnh cao nhất là đáp án',
        'Dùng quy hoạch động trên trục thời gian',
        'Duyệt mọi cặp khoảng để đếm chồng lấn',
      ],
      answer: 1,
      why: 'Sweep line biến bài toán hình học thành bài toán đếm sự kiện theo thứ tự thời gian. Đây là kỹ thuật nền tảng trong hình học tính toán và cả trong lập lịch tài nguyên.',
    },
    {
      q: 'Khi gộp khoảng [1,10] với [2,3], kết quả đúng là gì?',
      options: ['[1,3]', '[1,10]', '[2,10]', '[2,3]'],
      answer: 1,
      why: 'Phải dùng `Math.max(last[1], e)` chứ không phải gán thẳng `last[1] = e`. Khoảng sau nằm HOÀN TOÀN bên trong khoảng trước — đây là lỗi hay gặp nhất khi cài bài merge intervals.',
    },
  ],
  quizPy: [
    {
      q: 'Với bài "chọn nhiều nhất các khoảng không chồng nhau", nên sắp xếp theo tiêu chí nào?',
      options: ['Theo start tăng dần', 'Theo end tăng dần', 'Theo độ dài tăng dần', 'Theo start giảm dần'],
      answer: 1,
      why: 'Kết thúc sớm nhất để lại nhiều thời gian nhất cho các khoảng sau. Sắp theo start hoặc độ dài đều có phản ví dụ — ví dụ một khoảng bắt đầu sớm nhưng rất dài sẽ chiếm chỗ của nhiều khoảng ngắn.',
    },
    {
      q: 'Hai khoảng [a1,a2] và [b1,b2] KHÔNG chồng nhau khi nào?',
      options: [
        'a1 < b1',
        'a2 < b1 hoặc b2 < a1',
        'a1 + a2 < b1 + b2',
        'a2 = b1',
      ],
      answer: 1,
      why: 'Không chồng ⟺ một khoảng kết thúc hoàn toàn trước khi khoảng kia bắt đầu. Phủ định của nó (a1 ≤ b2 và b1 ≤ a2) là điều kiện chồng lấn. Nhớ dạng phủ định thường dễ hơn.',
    },
    {
      q: 'Kỹ thuật "quét đường" (sweep line) trong bài đếm số phòng họp hoạt động thế nào?',
      options: [
        'Sắp xếp theo độ dài rồi đếm',
        'Tách riêng list start và end, quét theo thời gian: mỗi start làm bộ đếm +1, mỗi end làm -1; đỉnh cao nhất là đáp án',
        'Dùng quy hoạch động trên trục thời gian',
        'Duyệt mọi cặp khoảng để đếm chồng lấn',
      ],
      answer: 1,
      why: 'Sweep line biến bài toán hình học thành bài toán đếm sự kiện theo thứ tự thời gian. Đây là kỹ thuật nền tảng trong hình học tính toán và cả trong lập lịch tài nguyên.',
    },
    {
      q: 'Khi gộp khoảng [1,10] với [2,3], kết quả đúng là gì?',
      options: ['[1,3]', '[1,10]', '[2,10]', '[2,3]'],
      answer: 1,
      why: 'Phải dùng `max(last[1], e)` chứ không phải gán thẳng `last[1] = e`. Khoảng sau nằm HOÀN TOÀN bên trong khoảng trước — đây là lỗi hay gặp nhất khi cài bài merge intervals.',
    },
  ],
  problems: [
    {
      id: 'merge-intervals',
      title: 'Gộp các khoảng chồng nhau',
      en: 'Merge Intervals',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'merge',
      statement: `
Cho mảng \`intervals\` với \`intervals[i] = [start_i, end_i]\`, hãy **gộp mọi khoảng chồng nhau**
và trả về danh sách các khoảng không chồng nhau, bao phủ đúng toàn bộ đầu vào.

**Ví dụ**
- \`[[1,3],[2,6],[8,10],[15,18]]\` → \`[[1,6],[8,10],[15,18]]\`
- \`[[1,4],[4,5]]\` → \`[[1,5]]\` (chạm biên vẫn tính là chồng ở bài này)
`,
      starter: `function merge(intervals) {\n  \n}`,
      starterPy: `def merge(intervals):\n    \n`,
      tests: [
        { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], name: 'Ví dụ chuẩn' },
        { args: [[[1, 4], [4, 5]]], expected: [[1, 5]], name: 'Chạm biên' },
        { args: [[[1, 4], [2, 3]]], expected: [[1, 4]], name: 'Khoảng sau nằm TRONG khoảng trước' },
        { args: [[[1, 4]]], expected: [[1, 4]], name: 'Một khoảng' },
        { args: [[[4, 5], [1, 2]]], expected: [[1, 2], [4, 5]], name: 'Chưa sắp xếp' },
        { args: [[[1, 4], [0, 4]]], expected: [[0, 4]], name: 'Bắt đầu sớm hơn ở cuối mảng' },
        { args: [[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]], expected: [[1, 10]], name: 'Một khoảng nuốt tất cả' },
      ],
      hints: [
        'Bước bắt buộc đầu tiên: **sắp xếp theo start tăng dần**. Sau đó bạn chỉ cần so khoảng hiện tại với khoảng cuối cùng trong kết quả.',
        'Nếu `start <= last[1]` thì chồng nhau → nới rộng `last[1] = Math.max(last[1], end)`. Ngược lại thì đẩy khoảng mới vào kết quả.',
        'Đừng gán `last[1] = end` mà không có `Math.max` — test `[[1,4],[2,3]]` sẽ cho `[[1,3]]` (sai) vì khoảng sau nằm hoàn toàn bên trong khoảng trước.',
      ],
      hintsPy: [
        'Bước bắt buộc đầu tiên: **sắp xếp theo start tăng dần** (`sorted(intervals, key=lambda x: x[0])`). Sau đó bạn chỉ cần so khoảng hiện tại với khoảng cuối cùng trong kết quả.',
        'Nếu `s <= res[-1][1]` thì chồng nhau → nới rộng `res[-1][1] = max(res[-1][1], e)`. Ngược lại thì `res.append([s, e])`.',
        'Đừng gán `res[-1][1] = e` mà không có `max` — test `[[1,4],[2,3]]` sẽ cho `[[1,3]]` (sai) vì khoảng sau nằm hoàn toàn bên trong khoảng trước.',
      ],
      diagnostics: [
        { test: 'last\\[1\\]\\s*=\\s*(e|end|intervals\\[i\\]\\[1\\])\\s*;', message: 'Thiếu `Math.max`! Khi khoảng sau nằm gọn trong khoảng trước ([1,10] và [2,3]), gán thẳng sẽ thu nhỏ kết quả sai.' },
        { test: 'for[\\s\\S]{0,200}for', message: 'So mọi cặp khoảng là O(n²). Sau khi sắp xếp, chỉ cần một lượt duyệt O(n log n) tổng cộng.' },
      ],
      diagnosticsPy: [
        { test: 'res\\[-1\\]\\[1\\]\\s*=\\s*e\\b', message: 'Thiếu `max`! Khi khoảng sau nằm gọn trong khoảng trước ([1,10] và [2,3]), gán thẳng sẽ thu nhỏ kết quả sai. Dùng `max(res[-1][1], e)`.' },
        { test: 'for\\s+\\w+[\\s\\S]{0,200}for\\s+\\w+', message: 'So mọi cặp khoảng là O(n²). Sau khi sắp xếp, chỉ cần một lượt duyệt O(n log n) tổng cộng.' },
      ],
      approach: `
**Vì sao sắp theo \`start\` là đủ?** Sau khi sắp xếp, mọi khoảng chồng lấn với khoảng hiện tại
đều **nằm liền kề nhau** trong mảng. Ta không cần nhìn xa hơn phần tử cuối của kết quả.

Chứng minh ngắn: nếu khoảng thứ k chồng với khoảng cuối trong kết quả,
thì mọi khoảng giữa chúng cũng đã được gộp vào rồi (vì start của chúng ≤ start của k).

\`\`\`
sắp xếp: [1,3] [2,6] [8,10] [15,18]

[1,3]              -> res = [[1,3]]
[2,6]  2 <= 3      -> gộp: [1, max(3,6)] = [1,6]
[8,10] 8 > 6       -> res = [[1,6],[8,10]]
[15,18] 15 > 10    -> res = [[1,6],[8,10],[15,18]]
\`\`\`

**Ba biến thể của cùng một khung** (rất hay bị hỏi nối tiếp):
- **Insert Interval**: chèn một khoảng vào danh sách đã sắp → O(n) không cần sort lại.
- **Non-overlapping Intervals**: xoá ít khoảng nhất → sắp theo **end** rồi greedy.
- **Meeting Rooms II**: đếm chồng lấn tối đa → sweep line hoặc heap.

Nhận ra ba bài này chỉ khác nhau ở **tiêu chí sắp xếp và đại lượng theo dõi** là bạn đã nắm trọn chủ đề.
`,
      solution: `function merge(intervals) {
  if (!intervals.length) return [];

  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const res = [[...sorted[0]]];

  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    const last = res[res.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);   // chồng -> nới rộng
    else res.push([s, e]);                              // rời nhau -> khoảng mới
  }
  return res;
}`,
      solutionPy: `def merge(intervals):
    if not intervals:
        return []
    res = []
    for s, e in sorted(intervals, key=lambda x: x[0]):
        if res and s <= res[-1][1]:
            res[-1][1] = max(res[-1][1], e)
        else:
            res.append([s, e])
    return res`,
      complexity: {
        question: 'Độ phức tạp của lời giải gộp khoảng?',
        options: ['O(n)', 'O(n log n) — bị chi phối bởi bước sắp xếp', 'O(n²)', 'O(log n)'],
        answer: 1,
        why: 'Bước duyệt chỉ O(n) nhưng sắp xếp là O(n log n) nên nó quyết định. Nếu đầu vào ĐÃ sắp xếp thì bài toán trở thành O(n) — hãy hỏi người phỏng vấn về giả định này.',
      },
      realWorld: 'Google Calendar gộp lịch bận để tìm khung giờ rảnh chung; hệ thống giám sát gộp các khoảng downtime chồng lấn để tính SLA chính xác; bộ cấp phát bộ nhớ gộp các vùng trống liền kề.',
    },
    {
      id: 'non-overlapping-intervals',
      title: 'Xoá ít khoảng nhất để hết chồng lấn',
      en: 'Non-overlapping Intervals',
      difficulty: 'Medium',
      targetMinutes: 20,
      entry: 'eraseOverlapIntervals',
      statement: `
Cho mảng \`intervals\`, trả về **số khoảng ít nhất cần xoá** để các khoảng còn lại không chồng nhau.

Lưu ý: hai khoảng chỉ **chạm biên** như \`[1,2]\` và \`[2,3]\` được coi là **không chồng nhau**.

**Ví dụ**
- \`[[1,2],[2,3],[3,4],[1,3]]\` → \`1\` (xoá \`[1,3]\`)
- \`[[1,2],[1,2],[1,2]]\` → \`2\`
- \`[[1,2],[2,3]]\` → \`0\`
`,
      starter: `function eraseOverlapIntervals(intervals) {\n  \n}`,
      starterPy: `def eraseOverlapIntervals(intervals):\n    \n`,
      tests: [
        { args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1, name: 'Ví dụ 1' },
        { args: [[[1, 2], [1, 2], [1, 2]]], expected: 2, name: 'Ba khoảng trùng nhau' },
        { args: [[[1, 2], [2, 3]]], expected: 0, name: 'Chạm biên — không chồng' },
        { args: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expected: 2, name: 'Một khoảng rất dài' },
        { args: [[[1, 2]]], expected: 0, name: 'Một khoảng' },
        { args: [[[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]], expected: 2, name: 'Chuỗi chồng lấn' },
      ],
      hints: [
        'Đổi câu hỏi: "xoá **ít nhất**" ⟺ "**giữ lại nhiều nhất** các khoảng không chồng nhau". Đáp án = tổng số khoảng − số giữ lại.',
        'Đây là bài xếp lịch kinh điển: để giữ được nhiều khoảng nhất, hãy **sắp xếp theo thời điểm KẾT THÚC** rồi tham lam chọn khoảng nào không chồng với khoảng vừa chọn.',
        'Vì sao sắp theo end? Vì khoảng kết thúc sớm nhất để lại nhiều "không gian" nhất cho các khoảng sau. Chứng minh bằng lập luận trao đổi: thay khoảng đầu tiên của lời giải tối ưu bằng khoảng kết thúc sớm nhất — vẫn hợp lệ và không mất khoảng nào.',
      ],
      hintsPy: [
        'Đổi câu hỏi: "xoá **ít nhất**" ⟺ "**giữ lại nhiều nhất** các khoảng không chồng nhau". Đáp án = tổng số khoảng − số giữ lại.',
        'Đây là bài xếp lịch kinh điển: để giữ được nhiều khoảng nhất, hãy **sắp xếp theo thời điểm KẾT THÚC** (`key=lambda x: x[1]`) rồi tham lam chọn khoảng nào không chồng với khoảng vừa chọn.',
        'Vì sao sắp theo end? Vì khoảng kết thúc sớm nhất để lại nhiều "không gian" nhất cho các khoảng sau. Chứng minh bằng lập luận trao đổi.',
      ],
      diagnostics: [
        { test: 'sort\\s*\\(\\s*\\([^)]*\\)\\s*=>\\s*[a-z]\\[0\\]\\s*-\\s*[a-z]\\[0\\]', message: 'Bạn đang sắp theo START. Với bài "giữ lại nhiều nhất" phải sắp theo END — thử test [[1,100],[11,22],[1,11],[2,12]] để thấy khác biệt.' },
      ],
      diagnosticsPy: [
        { test: 'key\\s*=\\s*lambda\\s+\\w+\\s*:\\s*\\w+\\[0\\]', message: 'Bạn đang sắp theo START. Với bài "giữ lại nhiều nhất" phải sắp theo END (`key=lambda x: x[1]`) — thử test [[1,100],[11,22],[1,11],[2,12]] để thấy khác biệt.' },
      ],
      approach: `
**Bước 1 — Đổi bài toán.** "Xoá ít nhất" = "giữ nhiều nhất". Đây là bài
**Activity Selection** (chọn hoạt động) kinh điển trong lý thuyết greedy.

**Bước 2 — Chọn đúng tiêu chí sắp xếp: theo \`end\`.**

*Chứng minh bằng lập luận trao đổi:* gọi \`f\` là khoảng có thời điểm kết thúc sớm nhất.
Giả sử có lời giải tối ưu \`S\` không chứa \`f\`. Gọi \`g\` là khoảng đầu tiên trong \`S\`.
Vì \`f.end <= g.end\`, ta thay \`g\` bằng \`f\` — mọi khoảng còn lại của \`S\` bắt đầu sau \`g.end >= f.end\`
nên vẫn không chồng. Ta được lời giải tối ưu **chứa** \`f\`. ∎

\`\`\`
[[1,2],[2,3],[3,4],[1,3]]  ->  sắp theo end: [1,2],[1,3],[2,3],[3,4]

chọn [1,2]           lastEnd = 2, giữ = 1
[1,3]: 1 < 2  chồng  -> xoá (count = 1)
[2,3]: 2 >= 2 ok     -> giữ, lastEnd = 3
[3,4]: 3 >= 3 ok     -> giữ, lastEnd = 4
=> xoá 1 khoảng ✔
\`\`\`

**Vì sao sắp theo start là SAI?** Xét \`[[1,100],[11,22],[1,11],[2,12]]\`:
sắp theo start sẽ chọn \`[1,100]\` trước và loại hết phần còn lại → giữ được 1.
Sắp theo end giữ được 2. Một dòng \`sort\` sai làm hỏng cả bài.

**Ghi nhớ:** với các bài xếp lịch dạng "nhiều nhất", tiêu chí gần như luôn là **thời gian kết thúc**.
`,
      solution: `function eraseOverlapIntervals(intervals) {
  if (intervals.length <= 1) return 0;

  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);   // theo END
  let kept = 1;
  let lastEnd = sorted[0][1];

  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    if (s >= lastEnd) {          // không chồng (chạm biên vẫn hợp lệ)
      kept++;
      lastEnd = e;
    }
  }
  return intervals.length - kept;
}`,
      solutionPy: `def eraseOverlapIntervals(intervals):
    if len(intervals) <= 1:
        return 0
    intervals = sorted(intervals, key=lambda x: x[1])
    kept, last_end = 1, intervals[0][1]
    for s, e in intervals[1:]:
        if s >= last_end:
            kept += 1
            last_end = e
    return len(intervals) - kept`,
      complexity: {
        question: 'Vì sao phải sắp xếp theo thời điểm KẾT THÚC chứ không phải bắt đầu?',
        options: [
          'Vì thời điểm kết thúc luôn lớn hơn',
          'Vì khoảng kết thúc sớm nhất để lại nhiều không gian nhất cho các lựa chọn sau — chứng minh được bằng lập luận trao đổi',
          'Vì mảng đầu vào đã sắp theo start',
          'Không quan trọng, cả hai đều đúng',
        ],
        answer: 1,
        why: 'Đây là một trong số ít thuật toán tham lam có chứng minh hoàn toàn chặt chẽ. Nắm được lập luận trao đổi này giúp bạn tự tin bảo vệ lời giải trước người phỏng vấn.',
      },
      realWorld: 'Xếp lịch phòng họp/máy móc để tối đa số công việc hoàn thành; chọn tập quảng cáo phát trong khung giờ; lập lịch quan sát của kính viễn vọng — tất cả là bài Activity Selection.',
    },
    {
      id: 'meeting-rooms-ii',
      title: 'Số phòng họp tối thiểu',
      en: 'Meeting Rooms II',
      difficulty: 'Medium',
      targetMinutes: 22,
      entry: 'minMeetingRooms',
      statement: `
Cho mảng \`intervals\` là thời gian các cuộc họp \`[start, end]\`, trả về **số phòng họp tối thiểu** cần thiết.

Cuộc họp kết thúc lúc \`t\` và cuộc họp bắt đầu lúc \`t\` **dùng chung được** một phòng.

**Ví dụ**
- \`[[0,30],[5,10],[15,20]]\` → \`2\`
- \`[[7,10],[2,4]]\` → \`1\`
`,
      starter: `function minMeetingRooms(intervals) {\n  \n}`,
      starterPy: `def minMeetingRooms(intervals):\n    \n`,
      tests: [
        { args: [[[0, 30], [5, 10], [15, 20]]], expected: 2, name: 'Ví dụ 1' },
        { args: [[[7, 10], [2, 4]]], expected: 1, name: 'Không chồng nhau' },
        { args: [[]], expected: 0, name: 'Không có cuộc họp' },
        { args: [[[1, 5]]], expected: 1, name: 'Một cuộc họp' },
        { args: [[[1, 5], [5, 10], [10, 15]]], expected: 1, name: 'Nối tiếp liên tục — dùng chung 1 phòng' },
        { args: [[[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]]], expected: 4, name: 'Chồng lấn nhiều tầng' },
        { args: [[[9, 10], [4, 9], [4, 17]]], expected: 2, name: 'Chạm biên' },
      ],
      hints: [
        'Diễn đạt lại: số phòng cần = **số cuộc họp chồng lấn nhiều nhất tại một thời điểm bất kỳ**.',
        'Kỹ thuật **quét đường**: tách riêng mảng `starts` và `ends`, cùng sắp xếp tăng dần. Duyệt qua từng `start`: trước tiên "trả phòng" cho mọi cuộc họp đã kết thúc (`ends[j] <= s`), rồi "mượn" một phòng.',
        'Cách 2 — min-heap: giữ heap các thời điểm kết thúc của những phòng đang dùng. Với mỗi cuộc họp (đã sắp theo start): nếu gốc heap `<= start` thì pop (phòng đó vừa trống). Push end vào heap. Kích thước heap lớn nhất chính là đáp án.',
      ],
      hintsPy: [
        'Diễn đạt lại: số phòng cần = **số cuộc họp chồng lấn nhiều nhất tại một thời điểm bất kỳ**.',
        'Kỹ thuật **quét đường**: tách riêng list `starts` và `ends`, cùng `sorted()`. Duyệt qua từng `start`: trước tiên "trả phòng" cho mọi cuộc họp đã kết thúc (`ends[j] <= s`), rồi "mượn" một phòng.',
        'Cách 2 — `heapq`: giữ heap các thời điểm kết thúc của những phòng đang dùng. Với mỗi cuộc họp (đã sắp theo start): nếu `heap[0] <= s` thì `heappop` (phòng đó vừa trống). `heappush` end vào heap. Kích thước heap lớn nhất chính là đáp án.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,200}for', message: 'So mọi cặp cuộc họp là O(n²). Kỹ thuật quét đường cho O(n log n).' },
      ],
      diagnosticsPy: [
        { test: 'for\\s+\\w+[\\s\\S]{0,200}for\\s+\\w+', message: 'So mọi cặp cuộc họp là O(n²). Kỹ thuật quét đường hoặc heapq cho O(n log n).' },
      ],
      approach: `
**Bước quan trọng nhất: diễn đạt lại bài toán.**
"Số phòng tối thiểu" nghe như bài tối ưu phức tạp, nhưng thực chất nó bằng
**số cuộc họp diễn ra đồng thời nhiều nhất** — một đại lượng đếm được đơn giản.

**Cách 1 — Quét đường (sweep line), trực quan nhất:**

Tưởng tượng bạn đứng trên trục thời gian và đi từ trái sang phải.
Mỗi lần gặp một \`start\` → +1 phòng. Mỗi lần gặp một \`end\` → -1 phòng.
Giá trị lớn nhất từng đạt được chính là đáp án.

\`\`\`
[[0,30],[5,10],[15,20]]
starts: 0, 5, 15
ends:  10, 20, 30

t=0   -> rooms=1  (best=1)
t=5   -> chưa có end nào <= 5 -> rooms=2 (best=2)
t=15  -> end 10 <= 15 -> rooms=1, rồi +1 -> rooms=2
=> 2 ✔
\`\`\`

Mẹo: **không cần biết cuộc họp nào kết thúc** — chỉ cần biết *có* một cuộc kết thúc.
Vì vậy ta được phép tách rời hai mảng start/end và sắp xếp độc lập. Nhận ra điều này
là bước nhảy tư duy của bài toán.

**Cách 2 — Min-heap các thời điểm kết thúc:**
Heap giữ "các phòng đang bận", gốc là phòng sắp trống sớm nhất.
Cách này tự nhiên hơn nếu bạn cần biết **cuộc họp nào ở phòng nào**.

Cả hai đều O(n log n) do sắp xếp.

**Mở rộng:** nếu hỏi *khung giờ nào đông nhất* → lưu lại thời điểm khi \`best\` được cập nhật.
Đây chính là cách các hệ thống tính "giờ cao điểm".
`,
      solution: `function minMeetingRooms(intervals) {
  if (!intervals.length) return 0;

  const starts = intervals.map((x) => x[0]).sort((a, b) => a - b);
  const ends = intervals.map((x) => x[1]).sort((a, b) => a - b);

  let rooms = 0, best = 0, j = 0;
  for (const s of starts) {
    while (j < ends.length && ends[j] <= s) { rooms--; j++; }  // trả phòng đã xong
    rooms++;                                                    // mượn phòng mới
    if (rooms > best) best = rooms;
  }
  return best;
}`,
      solutionPy: `import heapq

def minMeetingRooms(intervals):
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[0])
    heap = []                       # các thời điểm kết thúc đang bận
    for s, e in intervals:
        if heap and heap[0] <= s:
            heapq.heappop(heap)     # một phòng vừa trống
        heapq.heappush(heap, e)
    return len(heap)`,
      complexity: {
        question: 'Vì sao có thể tách rời mảng starts và ends rồi sắp xếp độc lập?',
        options: [
          'Vì hai mảng luôn có cùng thứ tự',
          'Vì ta chỉ cần biết CÓ một cuộc họp kết thúc trước thời điểm này, không cần biết đó là cuộc nào',
          'Vì các cuộc họp không chồng nhau',
          'Vì đề bài đảm bảo start < end',
        ],
        answer: 1,
        why: 'Đây là bước nhảy tư duy của bài toán: bài toán ghép cặp trở thành bài toán đếm sự kiện. Ý tưởng "chỉ cần đếm, không cần ghép" xuất hiện trong nhiều bài sweep line khác.',
      },
      realWorld: 'Định cỡ tài nguyên: số máy chủ cần tại giờ cao điểm, số nhân viên trực tổng đài theo khung giờ, số làn thu phí, số giường bệnh cần chuẩn bị — tất cả là "đếm chồng lấn tối đa".',
    },
  ],
},

/* ==================================================================== */
{
  id: 'bit-manipulation',
  name: 'Thao tác bit',
  en: 'Bit Manipulation',
  icon: '🔢',
  days: [29],
  summary: 'Nói chuyện trực tiếp với phần cứng: tập hợp, cờ, và những mẹo O(1) đẹp mắt.',
  lesson: `
## 1. Vì sao cần biết?

Bit là **ngôn ngữ gốc của máy tính**. Hiểu bit giúp bạn:
- Giải một số bài với O(1) bộ nhớ mà cách thường cần O(n).
- Hiểu cách hệ thống thật hoạt động: cờ quyền, bitmask, IP subnet, bloom filter.
- Viết code nhanh hơn nhiều lần trong các vòng lặp nóng.

## 2. Bảng phép toán — thuộc lòng

| Phép | Ký hiệu | Quy tắc | Dùng để |
|---|---|---|---|
| AND | \`&\` | 1 khi **cả hai** là 1 | **kiểm tra** bit, xoá bit |
| OR | pipe đơn | 1 khi **ít nhất một** là 1 | **bật** bit |
| XOR | \`^\` | 1 khi **khác nhau** | **đảo** bit, tìm khác biệt |
| NOT | \`~\` | đảo mọi bit | tạo mặt nạ |
| Dịch trái | \`<<\` | nhân 2 mỗi bước | tạo bit thứ k |
| Dịch phải | \`>>\` | chia 2 (giữ dấu) | duyệt từng bit |
| Dịch phải không dấu | \`>>>\` | chia 2 (điền 0) | xử lý số âm trong JS |

## 3. Bảy mẹo cần thuộc

\`\`\`js
x & 1              // x lẻ?
x >> 1             // chia 2
1 << k             // số chỉ có bit thứ k bằng 1
x & (1 << k)       // bit thứ k của x có bật không?
x | (1 << k)       // bật bit thứ k
x & ~(1 << k)      // tắt bit thứ k
x ^ (1 << k)       // đảo bit thứ k
x & (x - 1)        // XOÁ bit 1 THẤP NHẤT   <- mẹo quan trọng nhất
x & (-x)           // GIỮ LẠI bit 1 thấp nhất
\`\`\`

**\`x & (x-1)\`** là mẹo đáng giá nhất. \`x-1\` biến bit 1 thấp nhất thành 0 và mọi bit sau nó thành 1;
AND lại sẽ xoá đúng bit đó. Nhờ vậy đếm số bit 1 chỉ cần lặp đúng **số bit 1 lần**,
thay vì 32 lần. Hệ quả đẹp: \`x & (x-1) === 0\` ⟺ x là **luỹ thừa của 2**.

## 4. Tính chất kỳ diệu của XOR

\`\`\`
a ^ a = 0          (tự triệt tiêu)
a ^ 0 = a          (phần tử trung hoà)
a ^ b ^ a = b      (giao hoán + kết hợp)
\`\`\`

Hệ quả: XOR toàn bộ một mảng mà **mọi phần tử xuất hiện 2 lần trừ một** → kết quả chính là
phần tử lẻ loi đó. O(n) thời gian, **O(1) bộ nhớ** — trong khi cách dùng Set cần O(n) bộ nhớ.

XOR còn dùng để: hoán đổi hai biến không cần biến tạm, tìm số bị thiếu, mã hoá đơn giản,
và tính chẵn lẻ (parity) trong mã sửa lỗi.

## 5. Cạm bẫy riêng của JavaScript

- Toán tử bit trong JS làm việc trên **số nguyên có dấu 32 bit**, dù Number là 64-bit float.
  \`1 << 31\` cho số **âm**.
- Với số không dấu, dùng \`>>>\` thay \`>>\`.
- Cần hơn 32 bit? Dùng \`BigInt\` (nhưng chậm hơn).

## 6. Ứng dụng thực tế

- **Cờ quyền (permission flags)**: quyền Unix \`rwx\` = 3 bit; kiểm tra quyền là một phép AND.
- **Bitmask trong DP**: biểu diễn tập con bằng một số nguyên (bitmask DP cho n ≤ 20).
- **Mạng máy tính**: subnet mask, kiểm tra IP thuộc dải nào — toàn phép AND.
- **Bloom filter**: cấu trúc xác suất kiểm tra "có thể tồn tại", nền tảng của nhiều database.
- **Nén dữ liệu, đồ hoạ, mã hoá**: XOR là phép cơ bản trong mọi mã khối.
`,
  lessonPy: `
## 1. Vì sao cần biết?

Mọi số nguyên trong máy tính, ở tầng thấp nhất, đều là một dãy **bit** — các chữ số nhị phân chỉ gồm
\`0\` và \`1\`. Số \`13\` mà bạn viết trong Python thực chất được lưu trữ dưới dạng \`1101\` (đọc từ trái
sang phải: \`1×8 + 1×4 + 0×2 + 1×1 = 13\`). Bit là **ngôn ngữ gốc của máy tính**, và các phép toán trên
bit chạy trực tiếp trên phần cứng, không qua bất kỳ lớp trừu tượng nào — vì vậy hiểu bit giúp bạn:
- Giải một số bài với **O(1) bộ nhớ** mà cách thông thường (dùng \`set\`, \`dict\`...) cần O(n).
- Hiểu cách các hệ thống thật hoạt động bên dưới: cờ quyền truy cập, bitmask, subnet mạng, bloom filter.
- Viết code chạy nhanh hơn hẳn trong các vòng lặp được gọi rất nhiều lần ("vòng lặp nóng").

## 2. Bảng phép toán — thuộc lòng

| Phép | Ký hiệu | Quy tắc | Dùng để |
|---|---|---|---|
| AND | \`&\` | 1 khi cả hai bit đều là 1 | kiểm tra bit, xoá bit |
| OR | pipe đơn | 1 khi ít nhất một bit là 1 | bật bit |
| XOR | \`^\` | 1 khi hai bit khác nhau | đảo bit, tìm khác biệt |
| NOT | \`~\` | đảo mọi bit (Python: \`~x == -x-1\`, số nguyên lớn tuỳ ý) | tạo mặt nạ |
| Dịch trái | \`<<\` | nhân 2 mỗi bước dịch | tạo số chỉ có bit thứ k bật |
| Dịch phải | \`>>\` | chia 2, làm tròn về ÂM VÔ CỰC | duyệt qua từng bit |

Ví dụ cụ thể với \`x = 13\` (nhị phân \`1101\`) và \`y = 6\` (nhị phân \`0110\`):

\`\`\`python
x, y = 13, 6
print(bin(x), bin(y))     # 0b1101  0b110  — bin() hiển thị dạng nhị phân, tiền tố "0b"
print(x & y)               # 4  (0100) — mỗi vị trí: cả hai đều 1 mới giữ 1
print(x | y)               # 15 (1111) — mỗi vị trí: một trong hai là 1 thì giữ 1
print(x ^ y)               # 11 (1011) — mỗi vị trí: khác nhau thì thành 1
print(x << 1)               # 26 (11010) — dịch trái 1 bước = nhân đôi
print(x >> 1)               # 6  (110)  — dịch phải 1 bước = chia đôi, bỏ phần dư
\`\`\`

**Khác biệt lớn nhất với nhiều ngôn ngữ khác (JS, Java): Python không có toán tử dịch phải không dấu
(kiểu \`>>>\` của JS) vì hoàn toàn không cần tới nó** — số nguyên trong Python có độ dài tuỳ ý (không
bị "ép" về đúng 32-bit có dấu như nhiều ngôn ngữ khác), nên không tồn tại khái niệm "bit dấu" gây
nhiễu khi dịch phải. Điều này giúp code thao tác bit ở Python đơn giản hơn hẳn, nhưng cũng có nghĩa
là nếu một bài toán yêu cầu mô phỏng đúng hành vi số nguyên 32-bit có dấu (một số đề kiểm tra hành vi
này), bạn phải tự làm bằng \`x & 0xFFFFFFFF\` rồi xử lý bit dấu thủ công.

## 3. Cấu trúc & hàm Python thường dùng trong chủ đề này

| Tên | Vai trò | Ví dụ dùng nhanh |
|---|---|---|
| \`bin(x)\` | Hiển thị \`x\` dưới dạng chuỗi nhị phân (tiền tố \`0b\`) — hữu ích để debug bằng mắt | \`bin(13)\` → \`'0b1101'\` |
| \`x.bit_count()\` | Đếm số bit \`1\` trong \`x\` (Python 3.10+) — khỏi tự cài vòng lặp | \`(13).bit_count()\` → \`3\` |
| \`bin(x).count('1')\` | Cách đếm bit 1 tương thích với Python cũ hơn 3.10 | dùng khi không chắc phiên bản Python |
| \`x.bit_length()\` | Số bit cần thiết để biểu diễn \`x\` (không tính số 0 ở đầu) | \`(13).bit_length()\` → \`4\` |
| \`functools.reduce\` + \`operator.xor\` | XOR dồn tất cả phần tử của một danh sách trong một dòng | \`reduce(xor, nums, 0)\` |
| \`1 << k\` | Tạo nhanh một số chỉ có đúng bit thứ \`k\` bật (dùng làm "mặt nạ") | \`mask = 1 << 3\` → \`8\` (\`1000\`) |

## 4. Bảy mẹo cần thuộc

\`\`\`python
x & 1              # x có LẺ không? (bit cuối cùng là 1 <=> số lẻ)
x >> 1             # chia 2 (bỏ phần dư, tương đương // 2 với số không âm)
1 << k             # số chỉ có DUY NHẤT bit thứ k bằng 1, còn lại toàn 0
x & (1 << k)       # bit thứ k của x có đang BẬT không? (khác 0 nghĩa là có)
x | (1 << k)       # BẬT bit thứ k của x lên (dù trước đó là 0 hay 1)
x & ~(1 << k)      # TẮT bit thứ k của x xuống 0 (dù trước đó là gì)
x ^ (1 << k)       # ĐẢO bit thứ k của x (0 thành 1, 1 thành 0)
x & (x - 1)        # XOÁ bit 1 THẤP NHẤT của x   <- mẹo quan trọng nhất, xem giải thích dưới
x & (-x)           # GIỮ LẠI đúng bit 1 thấp nhất, xoá hết các bit còn lại
\`\`\`

**\`x & (x - 1)\`** là mẹo đáng giá nhất trong cả chủ đề. Cơ chế: phép trừ \`x - 1\` biến bit \`1\` thấp
nhất của \`x\` thành \`0\`, và biến MỌI bit đứng sau nó (bên phải) từ \`0\` thành \`1\` — giống hệt phép
"mượn" khi trừ trong hệ thập phân, chỉ là ở hệ nhị phân. AND hai số đó lại sẽ xoá đúng bit \`1\` thấp
nhất, giữ nguyên mọi bit khác:

\`\`\`python
def dem_so_bit_1(x):
    dem = 0
    while x:
        x &= (x - 1)      # mỗi vòng lặp XOÁ ĐÚNG MỘT bit 1, dù x có bao nhiêu bit tổng cộng
        dem += 1
    return dem

print(dem_so_bit_1(13))   # 13 = 1101 -> có 3 bit 1 -> kết quả 3
\`\`\`

Nhờ cơ chế này, đếm số bit \`1\` chỉ cần lặp đúng **số lần bằng số bit \`1\` đang có**, thay vì phải
lặp đủ 32/64 lần cố định để xét từng bit một. Hệ quả đẹp đi kèm: \`x & (x - 1) == 0\` khi và chỉ khi
\`x\` là một **luỹ thừa của 2** (một số chỉ có đúng một bit \`1\` duy nhất, xoá bit đó đi là về 0 ngay).
Python cũng có sẵn \`x.bit_count()\` (từ Python 3.10) hoặc \`bin(x).count('1')\` để đếm bit 1 trực tiếp
mà không cần tự viết vòng lặp — tiện cho việc kiểm tra nhanh, nhưng trong phỏng vấn vẫn nên biết cách
tự cài đặt bằng tay như trên.

## 5. Tính chất kỳ diệu của XOR

\`\`\`
a ^ a = 0          (một số XOR với chính nó luôn triệt tiêu về 0)
a ^ 0 = a          (XOR với 0 không đổi gì cả — 0 là "phần tử trung hoà")
a ^ b ^ a = b      (giao hoán + kết hợp: hai lần XOR với cùng một giá trị a sẽ TỰ HUỶ nhau)
\`\`\`

Hệ quả trực tiếp và cực kỳ hữu ích: XOR dồn toàn bộ một mảng mà **mọi phần tử đều xuất hiện đúng 2
lần, trừ đúng một phần tử xuất hiện 1 lần** → kết quả cuối cùng chính là phần tử lẻ loi đó, vì mọi
cặp trùng nhau sẽ tự triệt tiêu về 0 theo tính chất \`a ^ a = 0\`, chỉ còn phần tử không có cặp sống
sót:

\`\`\`python
from functools import reduce
from operator import xor

def tim_so_le_loi(nums):
    return reduce(xor, nums, 0)     # 0 ban đầu là "phần tử trung hoà", không ảnh hưởng kết quả

print(tim_so_le_loi([4, 1, 2, 1, 2]))   # 4 — mọi số khác đều có cặp, chỉ 4 xuất hiện lẻ
# Diễn giải: 4^1^2^1^2 = 4^(1^1)^(2^2) = 4^0^0 = 4
\`\`\`

Cách này chạy trong O(n) thời gian và chỉ tốn **O(1) bộ nhớ** — trong khi cách thay thế bằng \`set\`
(thêm vào rồi loại bỏ phần tử trùng) đúng nhưng tốn O(n) bộ nhớ để lưu tập hợp.

XOR còn được dùng để: hoán đổi hai biến mà không cần biến tạm (dù trong Python đã có cách gọn hơn hẳn
là \`a, b = b, a\`, không cần thủ thuật XOR như ở các ngôn ngữ khác), tìm số bị thiếu trong một dãy,
mã hoá đơn giản (XOR cipher — mã hoá và giải mã dùng chung một phép toán), và tính chẵn lẻ (parity)
trong các mã sửa lỗi truyền dữ liệu.

## 6. Không còn cạm bẫy 32-bit như JS — nhưng có cạm bẫy khác

- Không cần lo lắng về việc \`1 << 31\` cho ra một số âm bất ngờ như ở JavaScript — Python luôn tính
  đúng theo toán học vì số nguyên có độ dài tuỳ ý, không bị "ép khuôn" về 32-bit có dấu.
- Nhưng nếu đề bài yêu cầu mô phỏng đúng hành vi của một ngôn ngữ có số nguyên 32-bit có dấu (ví dụ
  để so khớp kết quả với test được sinh ra từ Java/C++), bạn phải tự ép kiểu bằng tay: tính
  \`x & 0xFFFFFFFF\` trước, rồi nếu bit thứ 31 (bit dấu) đang bật thì trừ thêm \`0x100000000\` để ra
  đúng giá trị âm tương ứng.
- \`x >> 1\` với \`x\` âm làm tròn về phía ÂM VÔ CỰC (floor), không phải cắt về 0 — khác với thói quen
  \`Math.trunc\` ở nhiều ngôn ngữ khác, cần lưu ý khi bài toán có liên quan tới số âm.

## 7. Ứng dụng thực tế

- **Cờ quyền (permission flags)**: quyền Unix \`rwx\` = 3 bit; kiểm tra quyền là một phép AND.
- **Bitmask trong DP**: biểu diễn tập con bằng một số nguyên (bitmask DP cho n ≤ 20).
- **Mạng máy tính**: subnet mask, kiểm tra IP thuộc dải nào — toàn phép AND.
- **Bloom filter**: cấu trúc xác suất kiểm tra "có thể tồn tại", nền tảng của nhiều database.
- **Nén dữ liệu, đồ hoạ, mã hoá**: XOR là phép cơ bản trong mọi mã khối.
`,
  quiz: [
    {
      q: 'Biểu thức `x & (x - 1)` làm gì?',
      options: [
        'Nhân x với 2',
        'Xoá bit 1 thấp nhất của x',
        'Đảo tất cả các bit',
        'Kiểm tra x có phải số chẵn không',
      ],
      answer: 1,
      why: '`x-1` biến bit 1 thấp nhất thành 0 và các bit sau nó thành 1; AND lại xoá đúng bit đó. Hệ quả: đếm bit 1 chỉ cần lặp đúng số bit 1 lần, và `x & (x-1) === 0` nghĩa là x là luỹ thừa của 2.',
    },
    {
      q: 'Vì sao XOR toàn bộ mảng lại tìm được phần tử xuất hiện một lần (các phần tử khác xuất hiện hai lần)?',
      options: [
        'Vì XOR sắp xếp các số',
        'Vì a^a = 0 và a^0 = a, nên các cặp trùng nhau tự triệt tiêu, chỉ còn lại phần tử lẻ loi',
        'Vì XOR luôn cho số lớn nhất',
        'Vì XOR đếm số lần xuất hiện',
      ],
      answer: 1,
      why: 'XOR có tính giao hoán và kết hợp nên thứ tự không quan trọng. Đây là lời giải O(n) thời gian / O(1) bộ nhớ — vượt trội so với cách dùng HashSet O(n) bộ nhớ.',
    },
    {
      q: 'Trong bài Counting Bits (đếm số bit 1 của mọi số từ 0 tới n), công thức DP nào đúng?',
      options: [
        'dp[i] = dp[i-1] + 1',
        'dp[i] = dp[i >> 1] + (i & 1)',
        'dp[i] = dp[i] * 2',
        'dp[i] = i % 2',
      ],
      answer: 1,
      why: 'Số i chính là `i>>1` với một bit thêm vào cuối. Vậy số bit 1 của i = số bit 1 của i>>1, cộng thêm 1 nếu bit cuối là 1. Đây là ví dụ đẹp về DP kết hợp thao tác bit.',
    },
    {
      q: 'Trong JavaScript, `1 << 31` cho kết quả gì?',
      options: [
        '2147483648',
        'Một số ÂM (-2147483648), vì toán tử bit dùng số nguyên có dấu 32 bit',
        'Lỗi tràn số',
        '0',
      ],
      answer: 1,
      why: 'JS chuyển toán hạng về int32 có dấu trước khi thực hiện phép bit. Bit 31 là bit dấu. Muốn kết quả không dấu, dùng `>>>` hoặc `BigInt`. Đây là bẫy rất hay gặp khi làm bài bit bằng JS.',
    },
  ],
  quizPy: [
    {
      q: 'Biểu thức `x & (x - 1)` làm gì?',
      options: [
        'Nhân x với 2',
        'Xoá bit 1 thấp nhất của x',
        'Đảo tất cả các bit',
        'Kiểm tra x có phải số chẵn không',
      ],
      answer: 1,
      why: '`x-1` biến bit 1 thấp nhất thành 0 và các bit sau nó thành 1; AND lại xoá đúng bit đó. Hệ quả: đếm bit 1 chỉ cần lặp đúng số bit 1 lần, và `x & (x-1) == 0` nghĩa là x là luỹ thừa của 2.',
    },
    {
      q: 'Vì sao XOR toàn bộ mảng lại tìm được phần tử xuất hiện một lần (các phần tử khác xuất hiện hai lần)?',
      options: [
        'Vì XOR sắp xếp các số',
        'Vì a^a = 0 và a^0 = a, nên các cặp trùng nhau tự triệt tiêu, chỉ còn lại phần tử lẻ loi',
        'Vì XOR luôn cho số lớn nhất',
        'Vì XOR đếm số lần xuất hiện',
      ],
      answer: 1,
      why: 'XOR có tính giao hoán và kết hợp nên thứ tự không quan trọng. Đây là lời giải O(n) thời gian / O(1) bộ nhớ — vượt trội so với cách dùng set O(n) bộ nhớ.',
    },
    {
      q: 'Trong bài Counting Bits (đếm số bit 1 của mọi số từ 0 tới n), công thức DP nào đúng?',
      options: [
        'dp[i] = dp[i-1] + 1',
        'dp[i] = dp[i >> 1] + (i & 1)',
        'dp[i] = dp[i] * 2',
        'dp[i] = i % 2',
      ],
      answer: 1,
      why: 'Số i chính là `i>>1` với một bit thêm vào cuối. Vậy số bit 1 của i = số bit 1 của i>>1, cộng thêm 1 nếu bit cuối là 1. Đây là ví dụ đẹp về DP kết hợp thao tác bit.',
    },
    {
      q: 'Vì sao Python không cần toán tử kiểu `>>>` (dịch phải không dấu) như JavaScript?',
      options: [
        'Vì Python không hỗ trợ dịch bit',
        'Vì số nguyên Python có độ dài tuỳ ý, không bị ép về 32-bit có dấu nên không có khái niệm "bit dấu" gây nhiễu khi dịch phải',
        'Vì Python luôn dùng số không dấu',
        'Vì Python tự động chuyển sang float',
      ],
      answer: 1,
      why: 'JS ép toán hạng bit về int32 có dấu nên `>>` với số có bit cao bị hiểu nhầm là âm. Python giữ nguyên giá trị toán học của số nguyên (không giới hạn 32-bit) nên `>>` luôn cho kết quả đúng theo trực giác.',
    },
  ],
  problems: [
    {
      id: 'single-number',
      title: 'Số xuất hiện một lần',
      en: 'Single Number',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'singleNumber',
      statement: `
Trong mảng \`nums\`, **mọi phần tử xuất hiện đúng hai lần** trừ **một** phần tử duy nhất.
Tìm phần tử đó.

**Yêu cầu:** O(n) thời gian và **O(1) bộ nhớ phụ**.

**Ví dụ**
- \`[2,2,1]\` → \`1\`
- \`[4,1,2,1,2]\` → \`4\`
`,
      starter: `function singleNumber(nums) {\n  \n}`,
      starterPy: `def singleNumber(nums):\n    \n`,
      tests: [
        { args: [[2, 2, 1]], expected: 1, name: 'Ví dụ 1' },
        { args: [[4, 1, 2, 1, 2]], expected: 4, name: 'Ví dụ 2' },
        { args: [[1]], expected: 1, name: 'Một phần tử' },
        { args: [[-1, -1, -2]], expected: -2, name: 'Số âm' },
        { args: [[0, 1, 0]], expected: 1, name: 'Có số 0' },
        { args: [[7, 3, 5, 3, 7]], expected: 5, name: 'Phần tử lẻ ở giữa' },
      ],
      hints: [
        'Ràng buộc "O(1) bộ nhớ" loại bỏ Set/Map. Vậy phải có một phép toán nào đó khiến các cặp giống nhau **tự triệt tiêu**.',
        'XOR có ba tính chất vàng: `a ^ a = 0`, `a ^ 0 = a`, và có tính giao hoán/kết hợp (thứ tự không quan trọng).',
        'Chỉ cần XOR toàn bộ mảng: `nums.reduce((a, b) => a ^ b, 0)`. Mọi cặp triệt tiêu về 0, chỉ còn lại phần tử lẻ loi.',
      ],
      hintsPy: [
        'Ràng buộc "O(1) bộ nhớ" loại bỏ set/dict. Vậy phải có một phép toán nào đó khiến các cặp giống nhau **tự triệt tiêu**.',
        'XOR có ba tính chất vàng: `a ^ a = 0`, `a ^ 0 = a`, và có tính giao hoán/kết hợp (thứ tự không quan trọng).',
        'Chỉ cần XOR toàn bộ mảng bằng vòng lặp, hoặc gọn hơn: `from functools import reduce; from operator import xor; reduce(xor, nums, 0)`.',
      ],
      diagnostics: [
        { test: 'new Set|new Map|\\{\\s*\\}', message: 'Dùng Set/Map là O(n) bộ nhớ — vi phạm yêu cầu O(1). Hãy nghĩ tới một phép toán tự triệt tiêu.' },
        { test: 'sort\\s*\\(', message: 'Sắp xếp rồi so hàng xóm chạy đúng nhưng là O(n log n) và sửa mảng đầu vào. Có cách O(n)/O(1) đẹp hơn nhiều.' },
      ],
      diagnosticsPy: [
        { test: '=\\s*set\\s*\\(\\)|\\{\\s*\\}', message: 'Dùng set/dict là O(n) bộ nhớ — vi phạm yêu cầu O(1). Hãy nghĩ tới một phép toán tự triệt tiêu.' },
        { test: '\\.sort\\s*\\(\\)|sorted\\s*\\(', message: 'Sắp xếp rồi so hàng xóm chạy đúng nhưng là O(n log n). Có cách O(n)/O(1) đẹp hơn nhiều.' },
      ],
      approach: `
Bài này ngắn nhưng dạy một bài học lớn: **khi ràng buộc bộ nhớ là O(1), hãy tìm một phép toán có
tính chất đại số phù hợp.**

\`\`\`
[4,1,2,1,2]
4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1^1) ^ (2^2)      (giao hoán, kết hợp)
= 4 ^ 0 ^ 0
= 4  ✔
\`\`\`

**Vì sao XOR chứ không phải cộng/trừ?** Vì tổng có thể tràn số và không tự triệt tiêu.
XOR triệt tiêu hoàn hảo và không bao giờ tràn.

**Các biến thể — hãy biết ít nhất tên của chúng:**
- **Single Number II** (mọi số xuất hiện 3 lần trừ một): đếm bit theo modulo 3,
  hoặc dùng hai biến trạng thái \`ones\`/\`twos\`.
- **Single Number III** (có **hai** số lẻ loi): XOR tất cả được \`a^b\`;
  lấy bit 1 thấp nhất \`d = x & (-x)\` để chia mảng thành hai nhóm, XOR riêng từng nhóm.
- **Missing Number**: XOR mảng với 0..n → số bị thiếu.

Tất cả đều là biến tấu của cùng một ý tưởng: **tìm phép toán khiến nhiễu tự triệt tiêu.**
`,
      solution: `function singleNumber(nums) {
  let res = 0;
  for (const x of nums) res ^= x;    // các cặp giống nhau tự triệt tiêu
  return res;
}`,
      solutionPy: `from functools import reduce
from operator import xor

def singleNumber(nums):
    return reduce(xor, nums, 0)`,
      complexity: {
        question: 'Vì sao XOR tốt hơn cách dùng HashSet ở bài này?',
        options: [
          'Vì XOR nhanh hơn về mặt bậc độ phức tạp',
          'Cả hai đều O(n) thời gian, nhưng XOR chỉ dùng O(1) bộ nhớ còn HashSet dùng O(n)',
          'Vì HashSet cho kết quả sai',
          'Vì XOR xử lý được số âm còn HashSet thì không',
        ],
        answer: 1,
        why: 'Điểm khác biệt nằm ở BỘ NHỚ, không phải thời gian. Đề bài cố tình đặt ràng buộc O(1) để dẫn bạn tới lời giải bit — đọc kỹ ràng buộc luôn là gợi ý về hướng giải.',
      },
      realWorld: 'Kiểm tra tính toàn vẹn dữ liệu bằng parity/checksum: RAID 5 dùng XOR để phục hồi dữ liệu khi một ổ đĩa hỏng — chính xác cùng tính chất a^a=0.',
    },
    {
      id: 'number-of-1-bits',
      title: 'Đếm số bit 1',
      en: 'Number of 1 Bits',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'hammingWeight',
      statement: `
Cho một số nguyên **không âm** \`n\`, trả về số **bit 1** trong biểu diễn nhị phân của nó
(còn gọi là trọng số Hamming).

**Ví dụ**
- \`n = 11\` (nhị phân \`1011\`) → \`3\`
- \`n = 128\` (nhị phân \`10000000\`) → \`1\`
- \`n = 4294967293\` → \`31\`
`,
      starter: `function hammingWeight(n) {\n  \n}`,
      starterPy: `def hammingWeight(n):\n    \n`,
      tests: [
        { args: [11], expected: 3, name: '1011' },
        { args: [128], expected: 1, name: '10000000' },
        { args: [0], expected: 0, name: 'Số 0' },
        { args: [1], expected: 1, name: 'Số 1' },
        { args: [4294967293], expected: 31, name: 'Số 32 bit lớn — cẩn thận với >> trong JS' },
        { args: [255], expected: 8, name: 'Tám bit 1' },
        { args: [2147483648], expected: 1, name: 'Bit cao nhất' },
      ],
      hints: [
        'Cách cơ bản: lặp 32 lần, mỗi lần kiểm tra `n & 1` rồi `n >>>= 1` (chú ý dùng `>>>` chứ không phải `>>` để tránh vòng lặp vô hạn với số có bit dấu).',
        'Cách hay hơn: dùng mẹo `n = n & (n - 1)` để **xoá bit 1 thấp nhất** ở mỗi vòng, đếm số vòng lặp. Số vòng đúng bằng số bit 1.',
        'Trong JS, `4294967293 >> 1` cho kết quả sai vì số bị coi là âm khi chuyển sang int32. Hãy dùng `>>>` (dịch phải không dấu) hoặc `n = Math.floor(n / 2)`.',
      ],
      hintsPy: [
        'Cách cơ bản: lặp 32 lần, mỗi lần kiểm tra `n & 1` rồi `n >>= 1`. Python không có vấn đề bit dấu như JS nên cách này luôn đúng.',
        'Cách hay hơn: dùng mẹo `n = n & (n - 1)` để **xoá bit 1 thấp nhất** ở mỗi vòng, đếm số vòng lặp. Số vòng đúng bằng số bit 1.',
        'Từ Python 3.10 trở lên có sẵn `n.bit_count()` — nhưng trong phỏng vấn hãy tự cài để thể hiện bạn hiểu bản chất.',
      ],
      diagnostics: [
        { test: 'n\\s*>>=\\s*1|n\\s*=\\s*n\\s*>>\\s*1', message: 'Dùng `>>` với số ≥ 2³¹ trong JS sẽ cho kết quả sai (bit dấu). Đổi sang `>>>`.' },
        { test: 'toString\\s*\\(\\s*2\\s*\\)', message: 'Chuyển sang chuỗi nhị phân rồi đếm ký tự chạy đúng nhưng tốn bộ nhớ và chậm hơn nhiều. Hãy dùng phép bit — đó là mục tiêu bài học.' },
      ],
      diagnosticsPy: [
        { test: 'bin\\s*\\(\\s*n\\s*\\)\\.count', message: '`bin(n).count(\'1\')` chạy đúng nhưng né tránh mục tiêu bài học (thao tác bit trực tiếp). Hãy tự cài bằng `n & (n-1)` hoặc vòng lặp `n & 1`.' },
      ],
      approach: `
**Cách 1 — Duyệt 32 bit:** đơn giản, luôn chạy đúng 32 vòng.
\`\`\`js
let count = 0;
for (let i = 0; i < 32; i++) if ((n >>> i) & 1) count++;
\`\`\`

**Cách 2 — Mẹo Brian Kernighan:** chỉ lặp **đúng số bit 1** lần.
\`\`\`js
let count = 0;
while (n) { n &= n - 1; count++; }
\`\`\`

**Vì sao \`n & (n-1)\` xoá bit 1 thấp nhất?**
\`\`\`
n     = 1011 0000
n - 1 = 1010 1111     (bit 1 thấp nhất -> 0, các bit sau -> 1)
n&(n-1)=1010 0000     <- đúng một bit 1 biến mất
\`\`\`
Với số như \`10000000\` (chỉ 1 bit), cách 2 chỉ lặp **1 lần** thay vì 32.

**Hệ quả cần nhớ:** \`n & (n - 1) === 0\` ⟺ n là **luỹ thừa của 2** (chỉ có đúng một bit 1).
Đây là cách kiểm tra luỹ thừa của 2 nhanh nhất, dùng rất nhiều trong cài đặt cấu trúc dữ liệu
(kích thước bảng băm, buffer, cấp phát bộ nhớ).

**Lưu ý JS:** vì \`n\` có thể tới 2³²-1, hãy dùng \`>>>\` hoặc thao tác cẩn thận với dấu.
Trong bài này, \`n &= n - 1\` vẫn hoạt động đúng với int32 kể cả khi bit dấu bật —
nhưng \`while (n)\` cần thành \`while (n !== 0)\` để an toàn với giá trị âm.
`,
      solution: `function hammingWeight(n) {
  let count = 0;
  // xử lý an toàn cho giá trị tới 2^32 - 1 trong JavaScript
  let x = n >>> 0;
  while (x !== 0) {
    x &= x - 1;          // xoá bit 1 thấp nhất
    count++;
  }
  return count;
}`,
      solutionPy: `def hammingWeight(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count`,
      complexity: {
        question: 'Mẹo `n &= n - 1` cải thiện điều gì so với vòng lặp 32 bước?',
        options: [
          'Giảm độ phức tạp từ O(n) xuống O(log n)',
          'Số vòng lặp bằng đúng SỐ BIT 1 thay vì luôn là 32 — nhanh hơn nhiều với số thưa bit',
          'Tiết kiệm bộ nhớ',
          'Xử lý được số âm',
        ],
        answer: 1,
        why: 'Cả hai đều O(1) với số 32 bit cố định, nhưng hằng số khác nhau rõ rệt. Với số như 2³¹ (một bit 1), cách này lặp 1 lần thay vì 32 — đáng kể trong vòng lặp nóng.',
      },
      realWorld: 'Đếm số cờ đang bật trong bitmask quyền hạn; tính khoảng cách Hamming trong mã sửa lỗi và trong so khớp ảnh (perceptual hash); đếm số phần tử trong bitset của database.',
    },
    {
      id: 'counting-bits',
      title: 'Đếm bit cho mọi số từ 0 tới n',
      en: 'Counting Bits',
      difficulty: 'Easy',
      targetMinutes: 15,
      entry: 'countBits',
      statement: `
Cho số nguyên \`n\`, trả về mảng \`ans\` độ dài \`n+1\` với \`ans[i]\` = số bit 1 của số \`i\`.

**Thử thách:** giải trong **O(n)** — nghĩa là mỗi số chỉ tốn O(1), không đếm lại từ đầu.

**Ví dụ**
- \`n = 2\` → \`[0,1,1]\`
- \`n = 5\` → \`[0,1,1,2,1,2]\`
`,
      starter: `function countBits(n) {\n  \n}`,
      starterPy: `def countBits(n):\n    \n`,
      tests: [
        { args: [2], expected: [0, 1, 1], name: 'n = 2' },
        { args: [5], expected: [0, 1, 1, 2, 1, 2], name: 'n = 5' },
        { args: [0], expected: [0], name: 'n = 0' },
        { args: [1], expected: [0, 1], name: 'n = 1' },
        { args: [8], expected: [0, 1, 1, 2, 1, 2, 2, 3, 1], name: 'Qua mốc luỹ thừa 2' },
        { args: [16], expected: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4, 1], name: 'n = 16' },
      ],
      hints: [
        'Đừng đếm bit của từng số một cách độc lập (đó là O(n log n)). Hãy tìm quan hệ giữa `ans[i]` và các giá trị đã tính trước đó.',
        'Nhận xét: số `i` chính là `i >> 1` với một bit thêm vào cuối. Vậy `ans[i] = ans[i >> 1] + (i & 1)`.',
        'Cách khác cũng đẹp: `ans[i] = ans[i & (i - 1)] + 1` — vì `i & (i-1)` là chính i sau khi xoá một bit 1, và nó luôn nhỏ hơn i nên đã được tính rồi.',
      ],
      hintsPy: [
        'Đừng đếm bit của từng số một cách độc lập (đó là O(n log n)). Hãy tìm quan hệ giữa `ans[i]` và các giá trị đã tính trước đó.',
        'Nhận xét: số `i` chính là `i >> 1` với một bit thêm vào cuối. Vậy `ans[i] = ans[i >> 1] + (i & 1)`.',
        'Cách khác cũng đẹp: `ans[i] = ans[i & (i - 1)] + 1` — vì `i & (i-1)` là chính i sau khi xoá một bit 1, và nó luôn nhỏ hơn i nên đã được tính rồi.',
      ],
      diagnostics: [
        { test: 'toString\\s*\\(\\s*2\\s*\\)', message: 'Chuyển từng số sang chuỗi nhị phân là O(n log n) và tốn bộ nhớ. Hãy tìm công thức truy hồi để đạt O(n).' },
        { test: 'while[\\s\\S]{0,120}for|for[\\s\\S]{0,120}while', message: 'Đếm lại bit cho từng số là O(n log n). Có công thức DP cho O(n) — mỗi số chỉ tốn một phép toán.' },
      ],
      diagnosticsPy: [
        { test: 'bin\\s*\\(', message: 'Chuyển từng số sang chuỗi nhị phân là O(n log n) và tốn bộ nhớ. Hãy tìm công thức truy hồi để đạt O(n).' },
        { test: 'while[\\s\\S]{0,120}for|for[\\s\\S]{0,120}while', message: 'Đếm lại bit cho từng số là O(n log n). Có công thức DP cho O(n) — mỗi số chỉ tốn một phép toán.' },
      ],
      approach: `
Bài này là **giao điểm đẹp giữa DP và thao tác bit**.

**Quan sát mấu chốt:** trong nhị phân, \`i\` = \`(i >> 1)\` được viết thêm một bit ở cuối.
\`\`\`
i = 13 = 1101
i>>1 =  6 =  110      (bỏ bit cuối)
bit cuối của 13 là 1
=> bits(13) = bits(6) + 1 = 2 + 1 = 3 ✔
\`\`\`

**Công thức:** \`ans[i] = ans[i >> 1] + (i & 1)\`

Vì \`i >> 1 < i\`, giá trị cần dùng luôn đã được tính → duyệt i tăng dần là đủ.

\`\`\`
i:      0  1  2  3  4  5  6  7  8
ans:    0  1  1  2  1  2  2  3  1
             ^     ^        ^     ^
        mỗi luỹ thừa của 2 lại reset về 1
\`\`\`

**Cách nhìn thứ hai:** \`ans[i] = ans[i & (i-1)] + 1\`.
\`i & (i-1)\` xoá bit 1 thấp nhất → số nhỏ hơn, đã tính rồi, và ít hơn đúng một bit.
Cách này thậm chí còn trực tiếp hơn.

**Bài học tổng quát:** khi phải tính một hàm cho **mọi** giá trị trong một dải,
hãy tìm quan hệ truy hồi giữa chúng thay vì tính độc lập từng cái.
Đây chính là tinh thần của quy hoạch động, áp dụng vào một lĩnh vực tưởng như không liên quan.
`,
      solution: `function countBits(n) {
  const ans = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    ans[i] = ans[i >> 1] + (i & 1);    // i = (i>>1) thêm một bit ở cuối
  }
  return ans;
}`,
      solutionPy: `def countBits(n):
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
    return ans`,
      complexity: {
        question: 'Vì sao công thức `ans[i] = ans[i >> 1] + (i & 1)` cho phép đạt O(n)?',
        options: [
          'Vì phép dịch bit rất nhanh',
          'Vì i >> 1 luôn nhỏ hơn i nên giá trị đó đã được tính — mỗi số chỉ tốn O(1) thay vì O(log n) để đếm lại',
          'Vì mảng đã được sắp xếp',
          'Vì n luôn là luỹ thừa của 2',
        ],
        answer: 1,
        why: 'Đây chính là tinh thần DP: tái sử dụng kết quả đã tính. Không có DP thì mỗi số tốn O(log n) để đếm bit → tổng O(n log n).',
      },
      realWorld: 'Tiền tính bảng popcount để tăng tốc các phép toán trên bitset (dùng trong database column store, công cụ tìm kiếm); và trong bitmask DP để đánh giá nhanh kích thước tập con.',
    },
  ],
},

/* ==================================================================== */
{
  id: 'math-geometry',
  name: 'Toán & Hình học',
  en: 'Math & Geometry',
  icon: '📐',
  days: [29],
  summary: 'Các bài về ma trận và số học: thường có một mẹo hình học biến bài khó thành dễ.',
  lesson: `
## 1. Đặc điểm của nhóm bài này

Đây là nhóm ít "mẫu hình" nhất — mỗi bài thường có một **mẹo riêng**.
Nhưng có vài kỹ thuật lặp lại đủ nhiều để đáng học:

## 2. Ma trận: ba kỹ thuật cốt lõi

**(a) Chuyển vị (transpose) + đảo hàng = xoay 90°**
\`\`\`
xoay 90° theo chiều kim đồng hồ = chuyển vị rồi đảo mỗi HÀNG
xoay 90° ngược chiều kim đồng hồ = chuyển vị rồi đảo mỗi CỘT
\`\`\`
Đây là mẹo đáng giá nhất: nó biến "xoay ma trận tại chỗ" từ bài rối rắm thành hai vòng lặp đơn giản.

**(b) Duyệt theo lớp (layer)** — cho các bài xoắn ốc, xoay:
duy trì bốn biên \`top, bottom, left, right\` và thu hẹp dần vào trong.

**(c) Dùng chính ma trận làm bộ nhớ đánh dấu** — khi đề yêu cầu O(1) bộ nhớ phụ:
dùng hàng 0 và cột 0 làm cờ (bài Set Matrix Zeroes).

## 3. Số học: những điều nên biết

- **Modulo**: \`(a + b) % m\`, \`(a * b) % m\` để tránh tràn số.
- **Ước chung lớn nhất (Euclid)**: \`gcd(a,b) = gcd(b, a % b)\`.
- **Sàng Eratosthenes**: liệt kê số nguyên tố tới n trong O(n log log n).
- **Luỹ thừa nhanh**: \`x^n\` trong O(log n) bằng chia đôi số mũ.
- **Phát hiện chu trình trên hàm số**: rùa-thỏ (bài Happy Number) — cùng ý tưởng với linked list!

## 4. Chiến lược khi gặp bài lạ

1. **Thử ví dụ nhỏ bằng tay** và tìm quy luật.
2. **Vẽ ra giấy** — đặc biệt với bài ma trận, hình học.
3. Tự hỏi: có **tính chất bất biến** nào không? (tổng, chẵn lẻ, khoảng cách...)
4. Tự hỏi: có thể **biến đổi hệ toạ độ** cho đơn giản hơn không?

Nếu bí, hãy nói to suy nghĩ. Với nhóm bài này, người phỏng vấn quan tâm **cách bạn khám phá quy luật**
hơn là bạn có nhớ mẹo hay không.

## 5. Ứng dụng thực tế

- **Xử lý ảnh**: xoay/lật ảnh chính là các phép biến đổi ma trận này.
- **Đồ hoạ 3D**: mọi phép quay/tịnh tiến là nhân ma trận.
- **Mật mã học**: số học modulo là nền tảng của RSA và mọi hệ mã khoá công khai.
- **Hash và phân mảnh dữ liệu**: modulo quyết định dữ liệu nằm ở shard nào.
- **Học máy**: mọi phép tính trên tensor đều là đại số ma trận ở quy mô lớn.
`,
  lessonPy: `
## 1. Đặc điểm của nhóm bài này

Đây là nhóm ít "mẫu hình chung" nhất trong toàn bộ lộ trình — khác với sliding window hay two pointers
(nơi một khung code giải được hàng chục bài), mỗi bài toán/hình học thường có một **mẹo quan sát
riêng**, đặc thù cho chính bài đó. Dù vậy, vẫn có vài kỹ thuật lặp lại đủ nhiều lần để đáng học kỹ,
vì chúng xuất hiện trở lại ở rất nhiều bài khác nhau về ma trận và số học.

## 2. Ma trận: ba kỹ thuật cốt lõi

**(a) Chuyển vị (transpose) + đảo hàng = xoay 90°**

\`\`\`
xoay 90° theo chiều kim đồng hồ = chuyển vị rồi đảo mỗi HÀNG
xoay 90° ngược chiều kim đồng hồ = chuyển vị rồi đảo mỗi CỘT
\`\`\`

Đây là mẹo đáng giá nhất của cả chủ đề: nó biến bài "xoay ma trận tại chỗ" từ một bài toán rối rắm về
tính chỉ số thành hai vòng lặp cực kỳ đơn giản.

\`\`\`python
def xoay_90_do(matrix):
    n = len(matrix)
    # Bước 1: CHUYỂN VỊ — biến (i, j) thành (j, i), làm tại chỗ trên ma trận vuông
    for i in range(n):
        for j in range(i + 1, n):    # chỉ xét NỬA TRÊN đường chéo, tránh hoán đổi hai lần
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]   # gán bội, không cần biến tạm
    # Bước 2: ĐẢO NGƯỢC từng hàng
    for row in matrix:
        row.reverse()               # reverse() đảo NGƯỢC một list TẠI CHỖ, không tạo bản sao
    return matrix

print(xoay_90_do([[1,2,3],[4,5,6],[7,8,9]]))
# [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
\`\`\`

**(b) Duyệt theo lớp (layer)** — dùng cho các bài xoắn ốc, xoay theo vòng: duy trì bốn biên
\`top, bottom, left, right\` đánh dấu phần ma trận CHƯA được xử lý, rồi thu hẹp dần bốn biên đó vào
trong sau mỗi vòng duyệt trọn một lớp (một "vòng khung" quanh biên hiện tại).

**(c) Dùng chính ma trận làm bộ nhớ đánh dấu** — áp dụng khi đề yêu cầu chỉ dùng O(1) bộ nhớ phụ: ví
dụ bài "đặt cả hàng và cột về 0 nếu có một ô bằng 0" có thể dùng chính hàng 0 và cột 0 của ma trận để
làm "cờ đánh dấu" thay vì cấp phát thêm mảng phụ.

**Lưu ý bắt buộc khi tạo ma trận trong Python:** luôn dùng \`[[0]*n for _ in range(m)]\` — list
comprehension tạo MỖI HÀNG là một object độc lập. **Không bao giờ** viết \`[[0]*n] * m\`, vì cách đó
tạo ra \`m\` cái tên cùng trỏ tới MỘT list hàng duy nhất — sửa một ô sẽ vô tình sửa luôn cả cột tương
ứng ở mọi hàng khác (xem lại bẫy này ở chủ đề [[DP hai chiều]], nó lặp lại y hệt ở đây).

## 3. Cấu trúc & hàm Python thường dùng trong chủ đề này

| Tên | Vai trò | Ví dụ dùng nhanh |
|---|---|---|
| \`row.reverse()\` | Đảo ngược một list tại chỗ, không tạo bản sao mới | dùng trong bước 2 của phép xoay ma trận |
| \`a, b = b, a\` | Hoán đổi hai phần tử ma trận không cần biến tạm | \`matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\` |
| \`math.gcd(a, b)\` | Ước chung lớn nhất — có sẵn, khỏi tự cài thuật toán Euclid | \`math.gcd(12, 18)\` → \`6\` |
| \`pow(x, n, mod)\` | Luỹ thừa nhanh CÓ modulo, tự động dùng thuật toán O(log n) bên trong | \`pow(2, 100, 10**9+7)\` |
| \`x % m\` | Lấy phần dư — bắt buộc khi đề yêu cầu "trả kết quả theo modulo" | \`(a * b) % (10**9 + 7)\` |
| \`[[0]*n for _ in range(m)]\` | Cách ĐÚNG để tạo ma trận \`m×n\` với các hàng độc lập | xem cảnh báo ở mục 2 |
| \`zip(*matrix)\` | Chuyển vị nhanh một ma trận bằng một dòng (không tại chỗ, tạo cấu trúc mới) | \`list(zip(*matrix))\` |

## 4. Số học: những điều nên biết

- **Modulo**: \`(a + b) % m\`, \`(a * b) % m\` giúp giữ giá trị trung gian trong phạm vi kiểm soát được
  (dù Python không giới hạn kích thước số nguyên như nhiều ngôn ngữ khác, phép modulo vẫn cần thiết
  khi đề yêu cầu tường minh "trả về kết quả theo modulo \`10⁹+7\`").
- **Ước chung lớn nhất (thuật toán Euclid)**: \`gcd(a, b) = gcd(b, a % b)\`, dừng khi \`b == 0\` — hoặc
  dùng thẳng hàm có sẵn \`math.gcd(a, b)\`, không cần tự cài trong hầu hết trường hợp.
- **Sàng Eratosthenes**: liệt kê mọi số nguyên tố nhỏ hơn hoặc bằng \`n\` trong O(n log log n), bằng
  cách đánh dấu dần bội số của từng số nguyên tố tìm được.
- **Luỹ thừa nhanh**: tính \`x^n\` trong O(log n) bằng cách chia đôi số mũ liên tục (bình phương hoá
  lặp lại), thay vì nhân tuần tự O(n) lần — hoặc dùng thẳng \`pow(x, n, mod)\` có sẵn của Python, vốn
  đã cài đặt sẵn thuật toán luỹ thừa nhanh kèm modulo cực kỳ hiệu quả.
- **Phát hiện chu trình trên một hàm số** (ví dụ bài Happy Number — lặp lại phép "tính tổng bình
  phương các chữ số" và kiểm tra có rơi vào vòng lặp không): dùng đúng kỹ thuật rùa-thỏ (Floyd cycle
  detection) — cùng một ý tưởng đã học ở chủ đề [[Danh sách liên kết]]!

## 5. Chiến lược khi gặp bài lạ

1. **Thử ví dụ nhỏ bằng tay** và tìm quy luật.
2. **Vẽ ra giấy** — đặc biệt với bài ma trận, hình học.
3. Tự hỏi: có **tính chất bất biến** nào không? (tổng, chẵn lẻ, khoảng cách...)
4. Tự hỏi: có thể **biến đổi hệ toạ độ** cho đơn giản hơn không?

Nếu bí, hãy nói to suy nghĩ. Với nhóm bài này, người phỏng vấn quan tâm **cách bạn khám phá quy luật**
hơn là bạn có nhớ mẹo hay không.

## 6. Ứng dụng thực tế

- **Xử lý ảnh**: xoay/lật ảnh chính là các phép biến đổi ma trận này (thư viện Pillow/NumPy của Python).
- **Đồ hoạ 3D**: mọi phép quay/tịnh tiến là nhân ma trận (NumPy).
- **Mật mã học**: số học modulo là nền tảng của RSA và mọi hệ mã khoá công khai.
- **Hash và phân mảnh dữ liệu**: modulo quyết định dữ liệu nằm ở shard nào.
- **Học máy**: mọi phép tính trên tensor đều là đại số ma trận ở quy mô lớn (NumPy/PyTorch).
`,
  quiz: [
    {
      q: 'Xoay ma trận vuông 90° theo chiều kim đồng hồ tại chỗ được thực hiện thế nào?',
      options: [
        'Đảo ngược từng hàng rồi đảo ngược từng cột',
        'Chuyển vị (transpose) rồi đảo ngược từng hàng',
        'Đổi chỗ hàng đầu và hàng cuối',
        'Sắp xếp lại các phần tử theo giá trị',
      ],
      answer: 1,
      why: 'Chuyển vị đổi (i,j) thành (j,i); đảo hàng hoàn tất phép quay. Hai bước đơn giản thay cho việc tính toán chỉ số phức tạp — mẹo này biến bài Medium thành gần như Easy.',
    },
    {
      q: 'Bài Happy Number (lặp tổng bình phương các chữ số) dùng kỹ thuật nào để phát hiện lặp vô hạn?',
      options: [
        'Quy hoạch động',
        'Rùa & thỏ (Floyd) hoặc HashSet — vì dãy số tạo thành một đồ thị hàm số có chu trình',
        'Tìm kiếm nhị phân',
        'Sắp xếp',
      ],
      answer: 1,
      why: 'Mỗi số ánh xạ tới đúng một số tiếp theo → dãy này là một "danh sách liên kết" ẩn và chắc chắn có chu trình (vì miền giá trị hữu hạn). Đây là ví dụ đẹp về việc tái sử dụng kỹ thuật từ chủ đề khác.',
    },
    {
      q: 'Với bài duyệt ma trận theo xoắn ốc, cách quản lý trạng thái gọn nhất là gì?',
      options: [
        'Dùng mảng visited cùng kích thước ma trận',
        'Duy trì bốn biên top/bottom/left/right và thu hẹp dần sau mỗi cạnh',
        'Đệ quy chia ma trận thành bốn phần',
        'Sắp xếp các phần tử theo khoảng cách tới tâm',
      ],
      answer: 1,
      why: 'Bốn biên biểu diễn chính xác "phần chưa duyệt" và cập nhật rất rẻ. Cách này O(1) bộ nhớ phụ và ít lỗi hơn nhiều so với mảng visited.',
    },
    {
      q: 'Vì sao phép modulo lại quan trọng trong các bài toán số học lớn?',
      options: [
        'Vì nó làm chương trình chạy nhanh hơn',
        'Vì nó giữ giá trị trong phạm vi biểu diễn được, tránh tràn số, và là nền tảng của mật mã hiện đại',
        'Vì nó giúp sắp xếp dữ liệu',
        'Vì nó chỉ dùng cho số nguyên tố',
      ],
      answer: 1,
      why: 'Tính chất (a·b) mod m = ((a mod m)·(b mod m)) mod m cho phép tính toán với số cực lớn mà không tràn — nền tảng của RSA, hash, và mọi bài toán "trả về kết quả mod 10⁹+7".',
    },
  ],
  quizPy: [
    {
      q: 'Xoay ma trận vuông 90° theo chiều kim đồng hồ tại chỗ được thực hiện thế nào?',
      options: [
        'Đảo ngược từng hàng rồi đảo ngược từng cột',
        'Chuyển vị (transpose) rồi đảo ngược từng hàng',
        'Đổi chỗ hàng đầu và hàng cuối',
        'Sắp xếp lại các phần tử theo giá trị',
      ],
      answer: 1,
      why: 'Chuyển vị đổi (i,j) thành (j,i); đảo hàng (`row.reverse()`) hoàn tất phép quay. Hai bước đơn giản thay cho việc tính toán chỉ số phức tạp — mẹo này biến bài Medium thành gần như Easy.',
    },
    {
      q: 'Bài Happy Number (lặp tổng bình phương các chữ số) dùng kỹ thuật nào để phát hiện lặp vô hạn?',
      options: [
        'Quy hoạch động',
        'Rùa & thỏ (Floyd) hoặc set — vì dãy số tạo thành một đồ thị hàm số có chu trình',
        'Tìm kiếm nhị phân',
        'Sắp xếp',
      ],
      answer: 1,
      why: 'Mỗi số ánh xạ tới đúng một số tiếp theo → dãy này là một "danh sách liên kết" ẩn và chắc chắn có chu trình (vì miền giá trị hữu hạn). Đây là ví dụ đẹp về việc tái sử dụng kỹ thuật từ chủ đề khác.',
    },
    {
      q: 'Với bài duyệt ma trận theo xoắn ốc, cách quản lý trạng thái gọn nhất là gì?',
      options: [
        'Dùng mảng visited cùng kích thước ma trận',
        'Duy trì bốn biên top/bottom/left/right và thu hẹp dần sau mỗi cạnh',
        'Đệ quy chia ma trận thành bốn phần',
        'Sắp xếp các phần tử theo khoảng cách tới tâm',
      ],
      answer: 1,
      why: 'Bốn biên biểu diễn chính xác "phần chưa duyệt" và cập nhật rất rẻ. Cách này O(1) bộ nhớ phụ và ít lỗi hơn nhiều so với mảng visited.',
    },
    {
      q: 'Vì sao phép modulo lại quan trọng trong các bài toán số học lớn, kể cả khi Python không tràn số?',
      options: [
        'Vì nó làm chương trình chạy nhanh hơn',
        'Vì đề bài thường yêu cầu trả kết quả mod 10⁹+7 (để so sánh test cố định), và modulo là nền tảng của mật mã hiện đại',
        'Vì nó giúp sắp xếp dữ liệu',
        'Vì nó chỉ dùng cho số nguyên tố',
      ],
      answer: 1,
      why: 'Dù Python có số nguyên lớn tuỳ ý (không tràn), đề bài vẫn quy ước trả kết quả theo modulo để chuẩn hoá test case. Tính chất (a·b) mod m = ((a mod m)·(b mod m)) mod m còn là nền tảng của RSA và hash.',
    },
  ],
  problems: [
    {
      id: 'rotate-image',
      title: 'Xoay ma trận 90 độ',
      en: 'Rotate Image',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'rotate',
      statement: `
Cho ma trận vuông \`matrix\` (n × n), hãy **xoay nó 90° theo chiều kim đồng hồ**, **tại chỗ**
(không được cấp phát ma trận mới).

**Ví dụ**
\`\`\`
[[1,2,3],        [[7,4,1],
 [4,5,6],   ->    [8,5,2],
 [7,8,9]]         [9,6,3]]
\`\`\`
`,
      starter: `function rotate(matrix) {\n  // sửa trực tiếp trên matrix, không cần return\n  \n}`,
      starterPy: `def rotate(matrix):\n    # sua truc tiep tren matrix, khong can return\n    \n`,
      harnessSrc: `(fn, args) => { const m = args[0]; fn(m); return m; }`,
      harnessSrcPy: `lambda fn, args, t: (fn(args[0]), args[0])[1]`,
      tests: [
        { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]], name: 'Ma trận 3x3' },
        { args: [[[1, 2], [3, 4]]], expected: [[3, 1], [4, 2]], name: 'Ma trận 2x2' },
        { args: [[[1]]], expected: [[1]], name: 'Ma trận 1x1' },
        {
          args: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]],
          expected: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]],
          name: 'Ma trận 4x4',
        },
      ],
      hints: [
        'Đừng cố tính công thức chỉ số cho phép xoay trực tiếp — rất dễ sai. Hãy tách thành **hai phép biến đổi đơn giản**.',
        'Mẹo: **chuyển vị** (đổi chỗ `matrix[i][j]` với `matrix[j][i]`) rồi **đảo ngược từng hàng**. Thử với ma trận 3x3 trên giấy để tin là đúng.',
        'Khi chuyển vị, chỉ duyệt **nửa trên đường chéo** (`j` từ `i+1`), nếu không bạn sẽ đổi chỗ hai lần và ma trận trở về như cũ.',
      ],
      hintsPy: [
        'Đừng cố tính công thức chỉ số cho phép xoay trực tiếp — rất dễ sai. Hãy tách thành **hai phép biến đổi đơn giản**.',
        'Mẹo: **chuyển vị** (`matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]`) rồi **đảo ngược từng hàng** (`row.reverse()`).',
        'Khi chuyển vị, chỉ duyệt **nửa trên đường chéo** (`j` từ `i+1`), nếu không bạn sẽ đổi chỗ hai lần và ma trận trở về như cũ.',
      ],
      diagnostics: [
        { test: 'new Array|\\[\\s*\\]\\s*;[\\s\\S]{0,200}push', message: 'Tạo ma trận mới vi phạm yêu cầu "tại chỗ". Hãy thử cách chuyển vị + đảo hàng.' },
        { test: 'for\\s*\\(\\s*let\\s+j\\s*=\\s*0[\\s\\S]{0,120}\\[j\\]\\[i\\]', message: 'Nếu duyệt j từ 0 khi chuyển vị, mỗi cặp bị đổi chỗ hai lần → ma trận không đổi. Hãy bắt đầu j từ i+1.' },
      ],
      diagnosticsPy: [
        { test: '=\\s*\\[\\[', message: 'Tạo ma trận mới vi phạm yêu cầu "tại chỗ". Hãy thử cách chuyển vị + đảo hàng.' },
        { test: 'range\\s*\\(\\s*0\\s*,\\s*n\\s*\\)[\\s\\S]{0,120}\\[j\\]\\[i\\]', message: 'Nếu duyệt j từ 0 khi chuyển vị, mỗi cặp bị đổi chỗ hai lần → ma trận không đổi. Hãy bắt đầu j từ i+1.' },
      ],
      approach: `
**Vì sao "chuyển vị + đảo hàng" lại cho phép xoay?**

Xoay 90° theo chiều kim đồng hồ nghĩa là: phần tử ở \`(i, j)\` phải đi tới \`(j, n-1-i)\`.
Tách thành hai bước:

\`\`\`
Bước 1 — chuyển vị:  (i, j) -> (j, i)
1 2 3        1 4 7
4 5 6   ->   2 5 8
7 8 9        3 6 9

Bước 2 — đảo mỗi hàng:  (j, i) -> (j, n-1-i)
1 4 7        7 4 1
2 5 8   ->   8 5 2
3 6 9        9 6 3   ✔
\`\`\`

Hợp hai phép: \`(i,j) -> (j,i) -> (j, n-1-i)\`. Đúng công thức cần.

**Mẹo ghi nhớ:**
- Xoay **thuận** chiều kim đồng hồ = chuyển vị + đảo **hàng**.
- Xoay **ngược** chiều kim đồng hồ = chuyển vị + đảo **cột**.
- Xoay 180° = đảo hàng + đảo cột.

**Bài học lớn hơn:** khi một phép biến đổi phức tạp, hãy tìm cách **phân rã nó thành các phép đơn giản
đã biết**. Đây chính xác là cách đồ hoạ máy tính xử lý phép quay 3D (phân rã thành các phép quay quanh
từng trục).
`,
      solution: `function rotate(matrix) {
  const n = matrix.length;

  // Bước 1: chuyển vị (chỉ duyệt nửa trên đường chéo)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  // Bước 2: đảo ngược từng hàng
  for (const row of matrix) row.reverse();
}`,
      solutionPy: `def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()`,
      complexity: {
        question: 'Độ phức tạp thời gian và bộ nhớ phụ của cách chuyển vị + đảo hàng?',
        options: ['O(n²) / O(n²)', 'O(n²) / O(1)', 'O(n) / O(1)', 'O(n log n) / O(1)'],
        answer: 1,
        why: 'Phải chạm mọi ô nên O(n²) thời gian là tối thiểu. Nhưng chỉ dùng biến tạm để hoán đổi → O(1) bộ nhớ phụ, đúng yêu cầu "tại chỗ".',
      },
      realWorld: 'Xoay ảnh trong thư viện xử lý ảnh; biến đổi toạ độ trong đồ hoạ 2D/3D; và xoay ma trận dữ liệu khi chuyển đổi giữa bố cục theo hàng và theo cột trong tính toán hiệu năng cao.',
    },
    {
      id: 'spiral-matrix',
      title: 'Duyệt ma trận theo xoắn ốc',
      en: 'Spiral Matrix',
      difficulty: 'Medium',
      targetMinutes: 22,
      entry: 'spiralOrder',
      statement: `
Cho ma trận \`m × n\`, trả về mảng các phần tử theo **thứ tự xoắn ốc** (từ ngoài vào trong,
theo chiều kim đồng hồ).

**Ví dụ**
\`\`\`
[[1,2,3],
 [4,5,6],   ->  [1,2,3,6,9,8,7,4,5]
 [7,8,9]]
\`\`\`
`,
      starter: `function spiralOrder(matrix) {\n  \n}`,
      starterPy: `def spiralOrder(matrix):\n    \n`,
      tests: [
        { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5], name: 'Ma trận 3x3' },
        { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7], name: 'Ma trận 3x4' },
        { args: [[[1]]], expected: [1], name: 'Một phần tử' },
        { args: [[[1, 2], [3, 4]]], expected: [1, 2, 4, 3], name: 'Ma trận 2x2' },
        { args: [[[1], [2], [3]]], expected: [1, 2, 3], name: 'Một cột' },
        { args: [[[1, 2, 3]]], expected: [1, 2, 3], name: 'Một hàng' },
        { args: [[[1, 2, 3], [4, 5, 6]]], expected: [1, 2, 3, 6, 5, 4], name: 'Ma trận 2x3' },
      ],
      hints: [
        'Duy trì **bốn biên**: `top`, `bottom`, `left`, `right`. Mỗi lần đi hết một cạnh thì thu hẹp biên tương ứng.',
        'Chu kỳ bốn bước: đi sang phải theo hàng `top` (rồi `top++`), đi xuống theo cột `right` (rồi `right--`), đi sang trái theo hàng `bottom` (rồi `bottom--`), đi lên theo cột `left` (rồi `left++`).',
        'Bẫy quan trọng: với ma trận không vuông (một hàng hoặc một cột), sau hai bước đầu các biên có thể đã giao nhau. Phải **kiểm tra lại `top <= bottom`** trước bước đi sang trái và **`left <= right`** trước bước đi lên.',
      ],
      hintsPy: [
        'Duy trì **bốn biên**: `top`, `bottom`, `left`, `right`. Mỗi lần đi hết một cạnh thì thu hẹp biên tương ứng.',
        'Chu kỳ bốn bước: đi sang phải theo hàng `top` (rồi `top += 1`), đi xuống theo cột `right` (rồi `right -= 1`), đi sang trái theo hàng `bottom` (rồi `bottom -= 1`), đi lên theo cột `left` (rồi `left += 1`).',
        'Bẫy quan trọng: với ma trận không vuông (một hàng hoặc một cột), sau hai bước đầu các biên có thể đã giao nhau. Phải **kiểm tra lại `top <= bottom`** trước bước đi sang trái và **`left <= right`** trước bước đi lên.',
      ],
      diagnostics: [
        { test: 'visited', message: 'Mảng `visited` hoạt động được nhưng tốn O(m·n) bộ nhớ. Cách bốn biên chỉ tốn O(1) và ít lỗi hơn.' },
      ],
      diagnosticsPy: [
        { test: 'visited', message: 'set/list `visited` hoạt động được nhưng tốn O(m·n) bộ nhớ. Cách bốn biên chỉ tốn O(1) và ít lỗi hơn.' },
      ],
      approach: `
**Ý tưởng: bóc từng lớp vỏ hành.** Bốn biến biên mô tả chính xác "phần ma trận chưa duyệt".

\`\`\`js
while (top <= bottom && left <= right) {
  for (let c = left; c <= right; c++) res.push(matrix[top][c]);      // →
  top++;
  for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);    // ↓
  right--;
  if (top <= bottom) {                                              // KIỂM TRA LẠI
    for (let c = right; c >= left; c--) res.push(matrix[bottom][c]); // ←
    bottom--;
  }
  if (left <= right) {                                              // KIỂM TRA LẠI
    for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);   // ↑
    left++;
  }
}
\`\`\`

**Vì sao cần hai lệnh kiểm tra bổ sung?**
Xét ma trận một hàng \`[[1,2,3]]\`: sau bước → ta có \`top = 1 > bottom = 0\`.
Nếu không kiểm tra, bước ← sẽ duyệt lại hàng đó lần nữa → kết quả \`[1,2,3,3,2,1]\` (sai).

Đây là lỗi số một của bài này. Với ma trận **vuông** bạn sẽ không phát hiện ra —
nên hãy luôn thử test một hàng và một cột.

\`\`\`
[[1,2,3],
 [4,5,6],
 [7,8,9]]

lớp ngoài: 1 2 3 | 6 9 | 8 7 | 4
lớp trong: 5
=> [1,2,3,6,9,8,7,4,5] ✔
\`\`\`

**Bài học chung:** khi bạn thấy mình phải viết nhiều \`if\` kiểm tra biên,
đó là dấu hiệu nên chọn cách biểu diễn trạng thái tốt hơn — ở đây, bốn biên là lựa chọn tối ưu.
`,
      solution: `function spiralOrder(matrix) {
  const res = [];
  if (!matrix.length) return res;

  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) res.push(matrix[top][c]);       // sang phải
    top++;

    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);     // xuống dưới
    right--;

    if (top <= bottom) {                                                // cần kiểm tra lại!
      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);  // sang trái
      bottom--;
    }
    if (left <= right) {                                                // cần kiểm tra lại!
      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);    // lên trên
      left++;
    }
  }
  return res;
}`,
      solutionPy: `def spiralOrder(matrix):
    if not matrix:
        return []
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            res.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            res.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                res.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                res.append(matrix[r][left])
            left += 1
    return res`,
      complexity: {
        question: 'Vì sao cần kiểm tra `top <= bottom` một lần nữa trước khi đi sang trái?',
        options: [
          'Để tối ưu tốc độ',
          'Vì với ma trận chỉ có một hàng (hoặc lớp trong cùng chỉ còn một hàng), biên đã giao nhau và nếu không kiểm tra sẽ duyệt lại phần tử',
          'Vì ma trận có thể rỗng',
          'Vì cần xử lý số âm',
        ],
        answer: 1,
        why: 'Lỗi này chỉ xuất hiện với ma trận KHÔNG vuông hoặc lớp trong cùng suy biến. Bài học: luôn kiểm thử với ma trận 1×n và n×1 khi làm bài lưới.',
      },
      realWorld: 'Duyệt dữ liệu theo mẫu hình học: quét cảm biến theo vòng xoắn, sắp xếp thứ tự hiển thị theo lớp trong giao diện, và các thuật toán quét vùng trong xử lý ảnh.',
    },
    {
      id: 'happy-number',
      title: 'Số hạnh phúc',
      en: 'Happy Number',
      difficulty: 'Easy',
      targetMinutes: 15,
      entry: 'isHappy',
      statement: `
Một số là **số hạnh phúc** nếu: lặp lại việc thay số đó bằng **tổng bình phương các chữ số** của nó,
cuối cùng sẽ về \`1\`. Nếu quá trình rơi vào một chu trình không chứa 1 thì đó **không** phải số hạnh phúc.

**Ví dụ**
- \`19\` → \`true\`: 1²+9²=82 → 8²+2²=68 → 6²+8²=100 → 1²+0²+0²=**1**
- \`2\` → \`false\` (rơi vào chu trình 4→16→37→58→89→145→42→20→4...)
`,
      starter: `function isHappy(n) {\n  \n}`,
      starterPy: `def isHappy(n):\n    \n`,
      tests: [
        { args: [19], expected: true, name: 'Số hạnh phúc' },
        { args: [2], expected: false, name: 'Rơi vào chu trình' },
        { args: [1], expected: true, name: 'Đã là 1' },
        { args: [7], expected: true, name: '7 là số hạnh phúc' },
        { args: [116], expected: false, name: 'Không hạnh phúc' },
        { args: [100], expected: true, name: '100 → 1' },
        { args: [1111111], expected: true, name: 'Nhiều chữ số 1' },
      ],
      hints: [
        'Viết hàm phụ `next(x)` = tổng bình phương các chữ số. Lấy chữ số bằng `x % 10` rồi `x = Math.floor(x / 10)`.',
        'Vấn đề: khi nào thì dừng? Nếu không về 1, dãy sẽ **lặp vô hạn**. Cần phát hiện chu trình.',
        'Hai cách: (1) `Set` lưu các số đã gặp — đơn giản, O(n) bộ nhớ; (2) **rùa & thỏ** — vì mỗi số ánh xạ tới đúng một số kế tiếp, dãy này chính là một "danh sách liên kết ẩn"! O(1) bộ nhớ.',
      ],
      hintsPy: [
        'Viết hàm phụ `nxt(x)` = tổng bình phương các chữ số. Lấy chữ số bằng `x % 10` rồi `x //= 10`.',
        'Vấn đề: khi nào thì dừng? Nếu không về 1, dãy sẽ **lặp vô hạn**. Cần phát hiện chu trình.',
        'Hai cách: (1) `set` lưu các số đã gặp — đơn giản, O(n) bộ nhớ; (2) **rùa & thỏ** — vì mỗi số ánh xạ tới đúng một số kế tiếp, dãy này chính là một "danh sách liên kết ẩn"! O(1) bộ nhớ.',
      ],
      diagnostics: [
        { test: 'while\\s*\\(\\s*true\\s*\\)[\\s\\S]{0,200}\\}\\s*$', message: 'Vòng lặp không có điều kiện thoát cho trường hợp chu trình sẽ chạy mãi. Bạn cần phát hiện chu trình (Set hoặc rùa-thỏ).' },
        { test: 'toString\\s*\\(\\s*\\)', message: 'Dùng chuỗi vẫn chạy đúng nhưng chậm hơn. Phép `% 10` và `/ 10` là cách chuẩn để tách chữ số.' },
      ],
      diagnosticsPy: [
        { test: 'while\\s+True\\s*:[\\s\\S]{0,200}$', message: 'Vòng lặp không có điều kiện thoát cho trường hợp chu trình sẽ chạy mãi. Bạn cần phát hiện chu trình (set hoặc rùa-thỏ).' },
        { test: 'str\\s*\\(\\s*x\\s*\\)', message: 'Dùng chuỗi vẫn chạy đúng nhưng chậm hơn. Phép `% 10` và `// 10` là cách chuẩn để tách chữ số.' },
      ],
      approach: `
**Điểm hay của bài này: nó là bài linked list đội lốt bài số học.**

Hàm \`next(x)\` ánh xạ mỗi số tới **đúng một** số tiếp theo. Đó chính là định nghĩa của một
danh sách liên kết (mỗi nút có đúng một \`next\`). Và vì miền giá trị hữu hạn
(số có d chữ số cho \`next(x) <= 81d\`, nên dãy luôn bị chặn dưới 1000),
dãy **bắt buộc** phải hoặc về 1, hoặc rơi vào chu trình.

**Vậy bài toán trở thành: phát hiện chu trình.** Và bạn đã biết hai cách từ chủ đề Linked List:

**Cách 1 — HashSet:** O(log n) bộ nhớ (số lượng giá trị khác nhau bị chặn).
\`\`\`js
const seen = new Set();
while (n !== 1 && !seen.has(n)) { seen.add(n); n = next(n); }
return n === 1;
\`\`\`

**Cách 2 — Rùa & thỏ (O(1) bộ nhớ):**
\`\`\`js
let slow = n, fast = next(n);
while (fast !== 1 && slow !== fast) { slow = next(slow); fast = next(next(fast)); }
return fast === 1;
\`\`\`

\`\`\`
19 -> 82 -> 68 -> 100 -> 1        ✔ hạnh phúc
2 -> 4 -> 16 -> 37 -> 58 -> 89 -> 145 -> 42 -> 20 -> 4 ... (chu trình)
\`\`\`

**Bài học quan trọng nhất:** khi gặp bài lạ, hãy hỏi *"cấu trúc ẩn ở đây là gì?"*.
Nhận ra "đây là đồ thị hàm số" mở khoá toàn bộ kho công cụ về chu trình.
Bài *Find the Duplicate Number* cũng dùng chính mẹo này trên một mảng.
`,
      solution: `function isHappy(n) {
  const next = (x) => {
    let sum = 0;
    while (x > 0) {
      const d = x % 10;
      sum += d * d;
      x = Math.floor(x / 10);
    }
    return sum;
  };

  // rùa & thỏ: dãy next() là một "danh sách liên kết" ẩn -> O(1) bộ nhớ
  let slow = n, fast = next(n);
  while (fast !== 1 && slow !== fast) {
    slow = next(slow);
    fast = next(next(fast));
  }
  return fast === 1;
}`,
      solutionPy: `def isHappy(n):
    def nxt(x):
        total = 0
        while x:
            d = x % 10
            total += d * d
            x //= 10
        return total

    slow, fast = n, nxt(n)
    while fast != 1 and slow != fast:
        slow = nxt(slow)
        fast = nxt(nxt(fast))
    return fast == 1`,
      complexity: {
        question: 'Vì sao dãy số trong bài này chắc chắn hoặc về 1 hoặc rơi vào chu trình?',
        options: [
          'Vì các số luôn giảm dần',
          'Vì next(x) bị chặn (số d chữ số cho kết quả ≤ 81·d), nên dãy nằm trong tập hữu hạn và theo nguyên lý chuồng bồ câu phải lặp lại',
          'Vì mọi số đều là số hạnh phúc',
          'Vì thuật toán có giới hạn số vòng lặp',
        ],
        answer: 1,
        why: 'Đây là lập luận quan trọng: miền giá trị hữu hạn + hàm xác định ⟹ chắc chắn có chu trình. Nhận ra tính chất này biến bài toán mơ hồ thành bài phát hiện chu trình quen thuộc.',
      },
      realWorld: 'Phát hiện vòng lặp trong hệ thống xác định: chuỗi biến đổi trạng thái trong máy trạng thái, chu kỳ của bộ sinh số giả ngẫu nhiên, và phát hiện lặp vô hạn trong quy tắc chuyển hướng.',
    },
  ],
},
];
