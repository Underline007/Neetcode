# NeetCode 30 — Học thuật toán trong 1 tháng 🧠

Ứng dụng web tự học thuật toán bằng **tiếng Việt**, bám theo lộ trình
[neetcode.io/roadmap](https://neetcode.io/roadmap), được thiết kế để hoàn thành trong **30 ngày**.

Không phải một danh sách bài tập. Đây là một **khoá học có cấu trúc**: mỗi chủ đề giải thích
*vấn đề gốc → ý tưởng cốt lõi → dấu hiệu nhận biết → mẫu code → bẫy thường gặp → ứng dụng thực tế*,
kèm bài tập chấm điểm tự động, gợi ý theo bậc, chẩn đoán lỗi và lịch ôn tập ngắt quãng.

```
18 chủ đề  ·  64 bài tập  ·  401 test case  ·  72 câu quiz khái niệm  ·  lộ trình 30 ngày
```

---

## Chạy ứng dụng

Không cần cài đặt, không cần build. Chỉ cần một máy chủ tĩnh (bắt buộc, vì app dùng ES modules
và Web Worker — mở trực tiếp file `index.html` sẽ bị chặn bởi CORS):

```bash
git clone <repo>
cd Neetcode
python3 -m http.server 8000      # hoặc: npm start
```

Mở http://localhost:8000

Kiểm chứng toàn bộ dữ liệu bài tập (chạy mọi lời giải mẫu qua mọi test case):

```bash
npm run verify      # node tools/verify.mjs
```

---

## Lộ trình 30 ngày

| Ngày | Chủ đề | Ngày | Chủ đề |
|---|---|---|---|
| 1–3 | Mảng & Bảng băm | 18–19 | Quay lui (Backtracking) |
| 4–5 | Hai con trỏ | 20–21 | Đồ thị |
| 6–7 | Cửa sổ trượt | 22 | Đồ thị nâng cao (Dijkstra, MST) |
| 8 | Ngăn xếp | 23–24 | Quy hoạch động 1 chiều |
| 9–10 | Tìm kiếm nhị phân | 25–26 | Quy hoạch động 2 chiều |
| 11–12 | Danh sách liên kết | 27 | Tham lam |
| 13–15 | Cây nhị phân | 28 | Khoảng (Intervals) |
| 16 | Cây tiền tố (Trie) | 29 | Thao tác bit + Toán & Hình học |
| 17 | Heap / Hàng đợi ưu tiên | 30 | Tổng ôn |

Mỗi ngày ~90–120 phút: đọc bài giảng → giải 2–4 bài → quiz hiểu bản chất → ôn bài đến hạn.
Chỉ có 60 phút/ngày? App hướng dẫn cách rút gọn (xem mục *Cách dùng app*).

---

## Điểm khác biệt

**Dạy để hiểu bản chất, không phải để nhớ lời giải.**
Mỗi bài giảng bắt đầu từ câu hỏi *"vấn đề gốc là gì?"* và *"vì sao thuật toán này đúng?"*.
Ví dụ: chương Tìm kiếm nhị phân không dạy "mảng đã sắp xếp" mà dạy **tính đơn điệu của vị từ** —
nhờ đó bạn mở khoá được kỹ thuật *binary search on answer*.

**Chấm điểm theo mức độ tự lực.**
Ai cũng copy được lời giải; điểm số thì nói thật.

| Thành phần | Ảnh hưởng |
|---|---|
| Điểm cơ bản | Dễ 100 · Trung bình 160 · Khó 220 |
| Mở gợi ý bậc 1 / 2 / 3 | −8% / −20% / −34% (tích luỹ) |
| Xem lời giải | điểm bị chặn trần **30%** |
| Đúng ngay lần nộp đầu | +15% |
| Trả lời đúng câu hỏi độ phức tạp | +10% |
| Giải trong thời gian mục tiêu | +10% |

Xếp hạng **S / A / B / C / D**. Mức thành thạo mỗi chủ đề = 70% bài tập + 30% quiz.

**Gợi ý theo 3 bậc, không phải lời giải sẵn.**
Bậc 1 gợi hướng tư duy · bậc 2 chỉ ra cấu trúc dữ liệu · bậc 3 mô tả thuật toán.
Lời giải đầy đủ (JavaScript **và** Python) nằm riêng và có cái giá của nó.

**Chẩn đoán tự động khi làm sai.**
Hệ thống phân tích code + kết quả test để chỉ ra *loại lỗi*, không chỉ *chỗ sai*:

> 🔍 Đang có hai vòng lặp lồng nhau → O(n²). Test hiệu năng sẽ đánh trượt. Hãy thay vòng trong bằng một `Map`.
>
> 🔍 Chỉ **một** test sai ("Chuỗi rỗng") — gần như chắc chắn là trường hợp biên. Hãy chạy tay đúng test đó thay vì sửa mò toàn bộ thuật toán.

**Test hiệu năng như phỏng vấn thật.**
Nhiều bài có test tới 200.000 phần tử với giới hạn 6 giây. Lời giải đúng logic nhưng sai độ phức tạp
**sẽ trượt** — và hệ thống nói rõ rằng vấn đề nằm ở độ phức tạp chứ không phải logic.

**Ôn tập ngắt quãng (SM-2 rút gọn).**
Sau khi giải xong, mỗi bài được lên lịch quay lại: 1 ngày → 3 ngày → giãn dần theo chất lượng.
Bài điểm thấp quay lại sớm hơn. Đây là phần quyết định bạn còn nhớ gì sau 30 ngày.

**Quiz kiểm tra hiểu bản chất.**
72 câu hỏi khái niệm, mỗi câu có giải thích chi tiết. Không hỏi "code thế nào" mà hỏi
*"vì sao greedy sai ở Coin Change nhưng đúng ở Jump Game?"*.

**Ứng dụng thực tế cho mọi bài.**
Từ `git diff` (dãy con chung dài nhất) tới rate limiter (cửa sổ trượt), từ RAID 5 (XOR) tới
`npm install` (sắp xếp tôpô).

---

## Cấu trúc mã nguồn

```
index.html                 khung ứng dụng (sidebar + vùng nội dung)
assets/css/app.css         giao diện, hỗ trợ chế độ sáng/tối
src/
  main.js                  router theo hash, khởi tạo
  store.js                 lưu tiến độ trong localStorage (xuất/nhập được)
  scoring.js               công thức tính điểm, xếp hạng, mức thành thạo
  srs.js                   lịch ôn tập ngắt quãng (SM-2 rút gọn)
  runner.js                cầu nối tới worker chấm bài, có timeout 6 giây
  sandbox.worker.js        chạy code người học trong luồng riêng (ListNode/TreeNode có sẵn)
  markdown.js              bộ render Markdown tối giản, không phụ thuộc thư viện
  ui.js                    tiện ích giao diện
  views/                   dashboard · lists · problem · quiz · misc
  data/
    part1..part6.js        toàn bộ bài giảng, quiz, bài tập, test, gợi ý, lời giải
    index.js               gộp dữ liệu + lộ trình 30 ngày + sinh test hiệu năng
tools/verify.mjs           kiểm chứng: chạy mọi lời giải mẫu qua mọi test case
```

**Không phụ thuộc thư viện ngoài. Không có bước build.** Toàn bộ là ES modules thuần.

Code của người học chạy trong **Web Worker** riêng: vòng lặp vô hạn không làm treo giao diện
(luồng chính sẽ chấm dứt worker sau 6 giây), và mỗi lần chạy đều nhận bản sao dữ liệu đầu vào.

### Thêm bài tập mới

Mỗi bài là một object trong `src/data/partN.js`:

```js
{
  id, title, en, difficulty, targetMinutes, entry,   // entry = tên hàm người học phải viết
  statement,        // đề bài (Markdown)
  starter,          // code mẫu
  tests: [{ args, expected, name }],
  perfTests: [{ build: () => [...], name }],          // đáp án tự suy ra từ lời giải mẫu
  harnessSrc,       // (tuỳ chọn) chuyển đổi đầu vào/ra: mảng ↔ linked list / cây / lớp
  checkerSrc,       // (tuỳ chọn) so sánh linh hoạt (không quan tâm thứ tự...)
  hints: [3 bậc],
  diagnostics: [{ test: 'regex', message }],
  approach, solution, solutionPy,
  complexity: { question, options, answer, why },
  realWorld,
}
```

Chạy `npm run verify` sau khi thêm — script sẽ kiểm tra tính đầy đủ của dữ liệu,
chạy lời giải mẫu qua toàn bộ test, và xác nhận mọi bài đều được xếp vào lộ trình.

---

## Tiến độ của bạn

Lưu trong `localStorage` của trình duyệt. Trong mục **Thống kê** có nút xuất/nhập JSON
để sao lưu hoặc chuyển sang máy khác.

---

## Giấy phép

MIT. Tên bài tập tham chiếu tới lộ trình NeetCode và LeetCode; toàn bộ bài giảng, lời giải,
test case và nội dung trong repo này là bản gốc viết cho dự án.
