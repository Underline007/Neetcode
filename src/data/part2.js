/**
 * NHÓM 2 — Cấu trúc & tìm kiếm: Stack, Binary Search, Linked List
 */

export default [
/* ==================================================================== */
{
  id: 'stack',
  name: 'Ngăn xếp',
  en: 'Stack',
  icon: '🥞',
  days: [8],
  summary: 'LIFO: công cụ của mọi bài toán "ghép cặp lồng nhau" và "phần tử lớn hơn kế tiếp".',
  lesson: `
## 1. Vấn đề gốc

Có một lớp bài toán mà **thứ tự xử lý phải ngược với thứ tự xuất hiện**: cái mở sau phải đóng trước.
Ngoặc lồng nhau, thẻ HTML, lời gọi hàm, phép toán ưu tiên — tất cả đều có cấu trúc *lồng*.
Mảng thường không nắm bắt được cấu trúc này một cách tự nhiên; ngăn xếp thì có.

## 2. Ý tưởng cốt lõi

> Ngăn xếp = **trí nhớ về những việc còn dang dở**, theo thứ tự "việc mới nhất chưa xong thì xử lý trước".

\`push\` = "tôi bắt đầu một việc mới, việc cũ tạm gác lại".
\`pop\` = "việc mới nhất đã xong, quay lại việc trước đó".

Chính vì thế **đệ quy và ngăn xếp là một**: máy tính cài đặt đệ quy bằng call stack.
Mọi thuật toán đệ quy đều viết lại được bằng vòng lặp + stack (và ngược lại).

## 3. Hai mẫu hình phải thuộc

**(a) Ghép cặp / kiểm tra tính hợp lệ lồng nhau**
\`\`\`js
const st = [];
for (const c of s) {
  if (isOpen(c)) st.push(c);
  else {
    if (!st.length || !matches(st.pop(), c)) return false;
  }
}
return st.length === 0;   // đừng quên: còn thừa dấu mở là SAI
\`\`\`

**(b) Ngăn xếp đơn điệu (monotonic stack) — kỹ thuật ăn điểm**

Dùng khi đề hỏi: *"với mỗi phần tử, tìm phần tử **lớn hơn/nhỏ hơn** đầu tiên ở bên phải/trái"*.

\`\`\`js
const st = [];                        // lưu CHỈ SỐ, giữ giá trị giảm dần
for (let i = 0; i < n; i++) {
  while (st.length && a[i] > a[st.at(-1)]) {
    const j = st.pop();
    res[j] = i - j;                   // a[i] chính là "phần tử lớn hơn kế tiếp" của a[j]
  }
  st.push(i);
}
\`\`\`

Bất biến: **các phần tử trong stack luôn giảm dần và đều là những phần tử "chưa tìm được đáp án"**.
Khi gặp phần tử lớn hơn, nó giải quyết một loạt phần tử đang chờ.

Vì sao O(n)? Mỗi chỉ số vào stack đúng 1 lần và ra đúng 1 lần. Lại là phân tích khấu hao.

## 4. Nhận dạng

| Dấu hiệu trong đề | Kỹ thuật |
|---|---|
| Ngoặc, thẻ, biểu thức lồng nhau | stack ghép cặp |
| "phần tử lớn hơn tiếp theo", "số ngày phải chờ" | monotonic stack |
| "biểu thức hậu tố (RPN)", máy tính bỏ túi | stack toán hạng |
| "hoàn tác (undo)", "quay lại trang trước" | stack lịch sử |
| Cần \`getMin()\` trong O(1) | stack phụ chứa min |
| Duyệt cây/đồ thị không đệ quy | stack thay call stack |

## 5. Bẫy thường gặp

- Quên kiểm tra stack rỗng trước khi \`pop()\` → \`undefined\`.
- Quên kiểm tra stack rỗng **ở cuối** trong bài ngoặc: \`"((("\` phải trả về false.
- Trong monotonic stack: lưu **chỉ số** chứ đừng lưu giá trị, vì bạn thường cần khoảng cách \`i - j\`.
- Nhầm \`>\` với \`>=\` khi có phần tử bằng nhau — quyết định này thay đổi kết quả bài toán.

## 6. Ứng dụng thực tế

- **Trình biên dịch/parser**: kiểm tra cân bằng ngoặc, phân tích cú pháp đệ quy xuống.
- **Undo/Redo** trong mọi trình soạn thảo; **back button** của trình duyệt.
- **Call stack** — hiểu stack là hiểu stack trace và lỗi *stack overflow*.
- **Máy ảo dựa trên stack**: JVM, WebAssembly, EVM (Ethereum) đều là stack machine.
- **Backtracking** (chủ đề sau) chính là đệ quy + stack ngầm.
`,
  lessonPy: `
## 1. Vấn đề gốc

Có một lớp bài toán mà **thứ tự xử lý phải ngược với thứ tự xuất hiện**: cái mở sau phải đóng trước.
Ví dụ dễ hình dung nhất: chuỗi ngoặc \`"([{}])"\`. Dấu \`{\` mở SAU CÙNG (gần giữa nhất) lại phải được
đóng ĐẦU TIÊN bởi \`}\` ngay sau nó, rồi mới tới \`[\`, rồi mới tới \`(\`. Ngoặc lồng nhau, thẻ HTML
(\`<div><span></span></div>\`), lời gọi hàm lồng nhau, biểu thức toán có ưu tiên — tất cả đều mang
đúng cấu trúc "lồng vào nhau" này.

Nếu chỉ dùng biến thường để nhớ "còn bao nhiêu ngoặc đang mở", bạn sẽ đếm được **số lượng** nhưng
không biết được **loại** ngoặc nào đang chờ đóng ở vị trí nào — với \`"([)]"\` (sai vì lồng chéo nhau)
đếm số lượng vẫn ra huề nhau, nhưng chuỗi này thực chất KHÔNG hợp lệ. Bạn cần nhớ *toàn bộ thứ tự*
các ngoặc mở, không chỉ đếm số lượng — đó chính là việc một **ngăn xếp (stack)** làm.

## 2. Ý tưởng cốt lõi

> Ngăn xếp = **trí nhớ về những việc còn dang dở**, theo thứ tự "việc mới nhất chưa xong thì xử lý
> trước" (Last-In-First-Out, viết tắt LIFO).

\`append(x)\` (push) = "tôi vừa bắt đầu một việc mới (\`x\`), việc cũ tạm gác lại bên dưới".
\`pop()\` = "việc mới nhất vừa xong, dỡ nó ra và quay lại đúng việc đang dang dở trước đó".

Hình dung một chồng đĩa: bạn chỉ có thể đặt thêm đĩa lên **đỉnh** chồng, và cũng chỉ lấy được đĩa ở
**đỉnh** ra trước — muốn lấy đĩa dưới đáy phải dỡ hết đĩa phía trên ra đã. \`list\` trong Python đóng
vai chồng đĩa đó một cách tự nhiên: \`append\`/\`pop\` (không tham số) đều thao tác ở cuối list, và đều
là O(1).

Chính vì cơ chế "việc mới nhất xử lý trước" này mà **đệ quy và ngăn xếp là một thứ**: máy tính cài đặt
lời gọi hàm đệ quy bằng một ngăn xếp thật gọi là *call stack* — mỗi lần gọi hàm là một "đĩa" được đặt
lên, hàm return là dỡ đĩa đó ra. Python giới hạn độ sâu đệ quy mặc định khoảng 1000 lời gọi lồng nhau
(\`sys.setrecursionlimit\` có thể nâng, nhưng đổi lại là rủi ro tràn stack thật của trình thông dịch).
Mọi thuật toán viết bằng đệ quy đều có thể viết lại bằng vòng lặp cộng với một \`list\` đóng vai stack
tường minh, và ngược lại.

## 3. Cấu trúc & hàm Python thường dùng trong chủ đề này

| Tên | Vai trò | Ví dụ dùng nhanh |
|---|---|---|
| \`list\` (\`append\`/\`pop\`) | Cài đặt stack đơn giản nhất — thao tác ở CUỐI list, cả hai đều O(1) | \`st = []; st.append(x); y = st.pop()\` |
| \`st[-1]\` | Xem đỉnh stack mà KHÔNG lấy nó ra (khác \`pop()\` sẽ xoá luôn) | \`if st and st[-1] == x: ...\` |
| \`if not st:\` | Kiểm tra stack rỗng trước khi \`pop()\`, tránh \`IndexError\` | \`if not st or st[-1] != x: return False\` |
| \`collections.deque\` | Hàng đợi hai đầu — dùng khi cần \`pop\`/thêm ở **đầu** hiệu quả O(1) (list không làm được việc này nhanh) | \`from collections import deque; dq = deque()\` |
| \`str.isdigit()\` | Kiểm tra một ký tự/chuỗi có phải toàn chữ số — hay dùng khi parse biểu thức RPN | \`if token.lstrip('-').isdigit(): ...\` |
| \`int(token)\` | Chuyển token chuỗi (ví dụ \`"42"\`) thành số nguyên để tính toán | \`num = int(token)\` |
| \`str.split()\` | Tách chuỗi biểu thức thành danh sách token theo khoảng trắng | \`"2 1 + 3 *".split()\` → \`['2','1','+','3','*']\` |

## 4. Hai mẫu hình phải thuộc

**(a) Ghép cặp / kiểm tra tính hợp lệ lồng nhau**

\`\`\`python
def ngoac_hop_le(s):
    cap_dong = {')': '(', ']': '[', '}': '{'}   # ngoặc đóng -> ngoặc mở tương ứng
    st = []
    for c in s:
        if c in '([{':
            st.append(c)                          # gặp ngoặc mở -> đẩy lên stack, "việc mới bắt đầu"
        elif c in cap_dong:
            if not st or st.pop() != cap_dong[c]:   # đỉnh stack phải KHỚP đúng loại ngoặc mở tương ứng
                return False
    return len(st) == 0    # đừng quên: còn dư ngoặc mở CHƯA đóng ("(((") thì vẫn là SAI

print(ngoac_hop_le("([{}])"))   # True
print(ngoac_hop_le("([)]"))     # False — lồng chéo nhau, "[" chưa kịp đóng thì ")" đã xuất hiện
print(ngoac_hop_le("((("))      # False — thiếu ngoặc đóng, stack còn dư 3 phần tử ở cuối
\`\`\`

**(b) Ngăn xếp đơn điệu (monotonic stack) — kỹ thuật ăn điểm**

Dùng khi đề hỏi: *"với mỗi phần tử, tìm phần tử **lớn hơn/nhỏ hơn** đầu tiên ở bên phải/trái"* — ví dụ
bài "còn bao nhiêu ngày nữa thì nhiệt độ ấm hơn hôm nay":

\`\`\`python
def ngay_cho_nhiet_do_am_hon(nhiet_do):
    n = len(nhiet_do)
    res = [0] * n
    st = []                                # lưu CHỈ SỐ (không lưu giá trị), giữ nhiệt độ giảm dần
    for i in range(n):
        while st and nhiet_do[i] > nhiet_do[st[-1]]:
            j = st.pop()                     # j là một ngày đang "chờ" ngày ấm hơn
            res[j] = i - j                    # hôm nay (i) CHÍNH LÀ ngày ấm hơn mà j đang chờ
        st.append(i)
    return res

print(ngay_cho_nhiet_do_am_hon([73, 74, 75, 71, 69, 72, 76, 73]))
# [1, 1, 4, 2, 1, 1, 0, 0]
\`\`\`

Bất biến cần nắm: **các chỉ số còn nằm trong stack luôn ứng với nhiệt độ giảm dần, và đều là những
ngày "chưa tìm được câu trả lời"**. Khi gặp một ngày ấm hơn, nó lần lượt "giải quyết" cho một loạt
ngày đang chờ trong stack, rồi chính nó lại được đẩy vào chờ ngày ấm hơn tiếp theo.

Vì sao độ phức tạp là O(n) dù có vòng \`while\` lồng trong \`for\`? Vì mỗi chỉ số chỉ được \`append\`
đúng 1 lần và \`pop\` **tối đa** 1 lần trong suốt chương trình — tổng số lần \`pop\` trên toàn bộ vòng
lặp ngoài không thể vượt quá \`n\`. Đây gọi là **phân tích khấu hao (amortized analysis)**: từng bước
riêng lẻ trông như có thể chạy lâu, nhưng cộng dồn lại trên toàn bộ vòng lặp chỉ là O(n).

## 5. Nhận dạng

| Dấu hiệu trong đề | Kỹ thuật |
|---|---|
| Ngoặc, thẻ, biểu thức lồng nhau | stack ghép cặp |
| "phần tử lớn hơn tiếp theo", "số ngày phải chờ" | monotonic stack |
| "biểu thức hậu tố (RPN)", máy tính bỏ túi | stack toán hạng |
| "hoàn tác (undo)", "quay lại trang trước" | stack lịch sử |
| Cần \`get_min()\` trong O(1) | stack phụ chứa min |
| Duyệt cây/đồ thị không đệ quy | stack (list) thay call stack |

## 6. Bẫy thường gặp

- Quên kiểm tra stack rỗng trước khi \`pop()\` → \`IndexError: pop from empty list\`.
- Quên kiểm tra stack rỗng **ở cuối** trong bài ngoặc: \`"((("\` phải trả về \`False\` vì còn dư ngoặc mở.
- Trong monotonic stack: lưu **chỉ số** chứ đừng lưu giá trị, vì bạn thường cần khoảng cách \`i - j\`
  giữa hai vị trí, không chỉ giá trị tại đó.
- Nhầm \`>\` với \`>=\` khi có phần tử bằng nhau — quyết định này thay đổi kết quả bài toán (ví dụ:
  hai ngày cùng nhiệt độ có tính là "ấm hơn" nhau không?).
- \`list.pop()\` (không tham số) là O(1) — xoá ở **cuối**. \`list.pop(0)\` là O(n) vì Python phải dịch
  chuyển toàn bộ phần tử còn lại lên một vị trí. Nếu cần xoá/thêm hiệu quả ở **đầu**, dùng
  \`collections.deque\` (cả hai đầu đều O(1)), đừng dùng \`list\`.

## 7. Ứng dụng thực tế

- **Trình biên dịch/parser**: kiểm tra cân bằng ngoặc, phân tích cú pháp đệ quy xuống — bản thân
  trình thông dịch Python cũng làm việc này khi parse code của bạn.
- **Undo/Redo** trong mọi trình soạn thảo; **back button** của trình duyệt.
- **Call stack** — hiểu stack là hiểu traceback và lỗi *RecursionError* / *stack overflow*.
- **Máy ảo dựa trên stack**: CPython bytecode, JVM, WebAssembly đều là stack machine.
- **Backtracking** (chủ đề sau) chính là đệ quy + stack ngầm.
`,
  quiz: [
    {
      q: 'Vì sao ngăn xếp đơn điệu (monotonic stack) chạy trong O(n) dù có vòng while lồng trong for?',
      options: [
        'Vì vòng while chạy tối đa 2 lần',
        'Vì mỗi phần tử được push đúng một lần và pop tối đa một lần trong toàn bộ chương trình',
        'Vì stack luôn có kích thước hằng số',
        'Vì mảng đã được sắp xếp',
      ],
      answer: 1,
      why: 'Tổng số thao tác push + pop ≤ 2n. Đây lại là phân tích khấu hao — cùng nguyên lý với cửa sổ trượt. Nhận ra mẫu này giúp bạn tự tin trả lời độ phức tạp trong phỏng vấn.',
    },
    {
      q: 'Kiểm tra chuỗi ngoặc "([)]" — điều gì làm nó KHÔNG hợp lệ trong khi "()[]"" hợp lệ?',
      options: [
        'Vì số ký tự lẻ',
        'Vì cấu trúc lồng nhau bị chéo: ngoặc mở gần nhất chưa đóng là "[" nhưng lại gặp ")"',
        'Vì có ngoặc vuông',
        'Vì stack bị tràn',
      ],
      answer: 1,
      why: 'Tính hợp lệ không chỉ là "đếm đủ số lượng" mà là "đúng thứ tự lồng". Stack nắm bắt điều đó: phần tử đỉnh luôn là ngoặc mở gần nhất chưa được đóng.',
    },
    {
      q: 'Để MinStack hỗ trợ getMin() trong O(1), cách làm chuẩn là gì?',
      options: [
        'Duyệt toàn bộ stack mỗi lần gọi getMin',
        'Sắp xếp stack sau mỗi lần push',
        'Giữ một stack phụ song song, mỗi phần tử là min tính tới thời điểm đó',
        'Dùng một biến min duy nhất',
      ],
      answer: 2,
      why: 'Một biến min là không đủ: khi pop đúng phần tử min, ta không biết min mới. Stack phụ lưu "lịch sử min" giải quyết trọn vẹn — đây là ý tưởng "mang theo thông tin tổng hợp cùng với dữ liệu".',
    },
    {
      q: 'Bài "Daily Temperatures" (số ngày phải chờ tới ngày ấm hơn) thuộc mẫu nào?',
      options: ['Cửa sổ trượt', 'Ngăn xếp đơn điệu giảm dần', 'Tìm kiếm nhị phân', 'Quy hoạch động'],
      answer: 1,
      why: 'Đề hỏi "phần tử lớn hơn đầu tiên ở bên phải" — đúng chữ ký của monotonic stack. Stack giữ các ngày đang CHỜ một ngày ấm hơn, theo thứ tự nhiệt độ giảm dần.',
    },
  ],
  quizPy: [
    {
      q: 'Vì sao ngăn xếp đơn điệu (monotonic stack) chạy trong O(n) dù có vòng while lồng trong for?',
      options: [
        'Vì vòng while chạy tối đa 2 lần',
        'Vì mỗi phần tử được push (append) đúng một lần và pop tối đa một lần trong toàn bộ chương trình',
        'Vì stack luôn có kích thước hằng số',
        'Vì list đã được sắp xếp',
      ],
      answer: 1,
      why: 'Tổng số thao tác append + pop ≤ 2n. Đây lại là phân tích khấu hao — cùng nguyên lý với cửa sổ trượt. Nhận ra mẫu này giúp bạn tự tin trả lời độ phức tạp trong phỏng vấn.',
    },
    {
      q: 'Kiểm tra chuỗi ngoặc "([)]" — điều gì làm nó KHÔNG hợp lệ trong khi "()[]" hợp lệ?',
      options: [
        'Vì số ký tự lẻ',
        'Vì cấu trúc lồng nhau bị chéo: ngoặc mở gần nhất chưa đóng là "[" nhưng lại gặp ")"',
        'Vì có ngoặc vuông',
        'Vì stack bị tràn',
      ],
      answer: 1,
      why: 'Tính hợp lệ không chỉ là "đếm đủ số lượng" mà là "đúng thứ tự lồng". Stack nắm bắt điều đó: phần tử đỉnh luôn là ngoặc mở gần nhất chưa được đóng.',
    },
    {
      q: 'Để MinStack hỗ trợ getMin() trong O(1), cách làm chuẩn là gì?',
      options: [
        'Duyệt toàn bộ stack mỗi lần gọi getMin',
        'Sắp xếp stack sau mỗi lần push',
        'Giữ một stack (list) phụ song song, mỗi phần tử là min tính tới thời điểm đó',
        'Dùng một biến min duy nhất',
      ],
      answer: 2,
      why: 'Một biến min là không đủ: khi pop đúng phần tử min, ta không biết min mới. Stack phụ lưu "lịch sử min" giải quyết trọn vẹn — đây là ý tưởng "mang theo thông tin tổng hợp cùng với dữ liệu".',
    },
    {
      q: 'Bài "Daily Temperatures" (số ngày phải chờ tới ngày ấm hơn) thuộc mẫu nào?',
      options: ['Cửa sổ trượt', 'Ngăn xếp đơn điệu giảm dần', 'Tìm kiếm nhị phân', 'Quy hoạch động'],
      answer: 1,
      why: 'Đề hỏi "phần tử lớn hơn đầu tiên ở bên phải" — đúng chữ ký của monotonic stack. Stack giữ các ngày đang CHỜ một ngày ấm hơn, theo thứ tự nhiệt độ giảm dần.',
    },
  ],
  problems: [
    {
      id: 'valid-parentheses',
      title: 'Chuỗi ngoặc hợp lệ',
      en: 'Valid Parentheses',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'isValid',
      statement: `
Cho chuỗi \`s\` chỉ gồm các ký tự \`()[]{}\`. Xác định chuỗi có hợp lệ không.

Hợp lệ khi: mỗi ngoặc mở được đóng bằng đúng loại tương ứng, và đóng theo **đúng thứ tự lồng nhau**.

**Ví dụ**
- \`"()[]{}"\` → \`true\`
- \`"([)]"\` → \`false\`
- \`"{[]}"\` → \`true\`
`,
      starter: `function isValid(s) {\n  \n}`,
      starterPy: `def isValid(s):\n    \n`,
      tests: [
        { args: ['()'], expected: true, name: 'Cơ bản' },
        { args: ['()[]{}'], expected: true, name: 'Nối tiếp' },
        { args: ['(]'], expected: false, name: 'Sai loại' },
        { args: ['([)]'], expected: false, name: 'Lồng chéo' },
        { args: ['{[]}'], expected: true, name: 'Lồng đúng' },
        { args: ['((('], expected: false, name: 'Thừa ngoặc mở' },
        { args: [']'], expected: false, name: 'Chỉ có ngoặc đóng' },
        { args: [''], expected: true, name: 'Chuỗi rỗng' },
      ],
      hints: [
        'Khi gặp ngoặc mở, bạn chưa biết nó đúng hay sai — hãy **ghi nhớ** nó. Khi gặp ngoặc đóng, nó phải khớp với ngoặc mở **gần nhất chưa được đóng**.',
        'Cấu trúc trả lời "phần tử gần nhất chưa xử lý" chính là stack. Dùng một object ánh xạ `{")":"(", "]":"[", "}":"{"}` để tra cặp.',
        'Hai kiểm tra dễ quên: (1) gặp ngoặc đóng khi stack rỗng → False ngay; (2) hết chuỗi mà stack **chưa rỗng** → False (còn ngoặc mở chưa đóng).',
      ],
      hintsPy: [
        'Khi gặp ngoặc mở, bạn chưa biết nó đúng hay sai — hãy **ghi nhớ** nó. Khi gặp ngoặc đóng, nó phải khớp với ngoặc mở **gần nhất chưa được đóng**.',
        'Cấu trúc trả lời "phần tử gần nhất chưa xử lý" chính là stack (`list`). Dùng một `dict` ánh xạ `{")":"(", "]":"[", "}":"{"}` để tra cặp.',
        'Hai kiểm tra dễ quên: (1) gặp ngoặc đóng khi stack rỗng → False ngay (đừng gọi `st.pop()` trên list rỗng, sẽ dấy `IndexError`); (2) hết chuỗi mà stack **chưa rỗng** → False (còn ngoặc mở chưa đóng).',
      ],
      diagnostics: [
        { test: 'replace\\s*\\(', message: 'Cách "xoá dần cặp ngoặc bằng replace trong vòng lặp" chạy đúng nhưng là O(n²). Stack cho O(n) và thể hiện bạn hiểu cấu trúc lồng.' },
        { test: 'count|counter', message: 'Chỉ đếm số lượng ngoặc là không đủ: "([)]" có số lượng cân bằng nhưng vẫn sai. Thứ tự lồng mới là điều quan trọng.' },
      ],
      diagnosticsPy: [
        { test: '\\.replace\\s*\\(', message: 'Cách "xoá dần cặp ngoặc bằng replace trong vòng lặp" chạy đúng nhưng là O(n²). Stack cho O(n) và thể hiện bạn hiểu cấu trúc lồng.' },
        { test: 'count\\s*\\(|Counter', message: 'Chỉ đếm số lượng ngoặc là không đủ: "([)]" có số lượng cân bằng nhưng vẫn sai. Thứ tự lồng mới là điều quan trọng.' },
      ],
      approach: `
Bài này là "hello world" của ngăn xếp, nhưng hãy rút ra bài học đúng:

**Điều gì khiến stack là cấu trúc *duy nhất* phù hợp?** Vì tính hợp lệ được định nghĩa đệ quy:
\`S -> (S) | [S] | {S} | SS | ε\`. Ngữ pháp lồng nhau ⟺ cần bộ nhớ dạng LIFO.
Đây cũng là lý do biểu thức ngoặc không thể kiểm tra bằng regex thuần (ngôn ngữ chính quy không đếm được độ lồng).

**Ba trạng thái kết thúc:**
1. Gặp đóng khi stack rỗng → sai (đóng mà chưa mở).
2. Gặp đóng không khớp đỉnh → sai (lồng chéo).
3. Hết chuỗi, stack còn phần tử → sai (mở mà chưa đóng).
`,
      solution: `function isValid(s) {
  const pair = { ')': '(', ']': '[', '}': '{' };
  const st = [];
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') st.push(c);
    else {
      if (st.pop() !== pair[c]) return false;   // rỗng -> undefined -> cũng false
    }
  }
  return st.length === 0;
}`,
      solutionPy: `def isValid(s):
    pair = {')': '(', ']': '[', '}': '{'}
    st = []
    for c in s:
        if c in '([{':
            st.append(c)
        else:
            if not st or st.pop() != pair[c]:
                return False
    return not st`,
      complexity: {
        question: 'Độ phức tạp thời gian / bộ nhớ?',
        options: ['O(n) / O(n)', 'O(n) / O(1)', 'O(n²) / O(n)', 'O(n log n) / O(n)'],
        answer: 0,
        why: 'Duyệt một lần O(n). Bộ nhớ O(n) vì trường hợp xấu nhất "((((((" đẩy toàn bộ ký tự vào stack.',
      },
      realWorld: 'Mọi trình soạn thảo code đều chạy thuật toán này để tô sáng ngoặc và báo lỗi cú pháp. Bộ phân tích JSON/XML cũng dùng stack để kiểm tra cấu trúc lồng.',
    },
    {
      id: 'min-stack',
      title: 'Ngăn xếp có getMin O(1)',
      en: 'Min Stack',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'MinStack',
      statement: `
Thiết kế lớp \`MinStack\` hỗ trợ **cả 4 thao tác trong O(1)**:

- \`push(val)\` — thêm phần tử
- \`pop()\` — xoá phần tử trên cùng
- \`top()\` — trả về phần tử trên cùng
- \`getMin()\` — trả về **phần tử nhỏ nhất** trong ngăn xếp

**Ví dụ**
\`\`\`
push(-2); push(0); push(-3);
getMin();  // -3
pop();
top();     // 0
getMin();  // -2
\`\`\`

> Bài chấm bằng cách gọi một chuỗi thao tác và so sánh mảng kết quả (\`null\` cho các lệnh không trả về).
`,
      starter: `class MinStack {\n  constructor() {\n    \n  }\n\n  push(val) {\n    \n  }\n\n  pop() {\n    \n  }\n\n  top() {\n    \n  }\n\n  getMin() {\n    \n  }\n}`,
      starterPy: `class MinStack:\n    def __init__(self):\n        pass\n\n    def push(self, val):\n        pass\n\n    def pop(self):\n        pass\n\n    def top(self):\n        pass\n\n    def getMin(self):\n        pass\n`,
      harnessSrc: `(Cls, args) => {
        const [ops, vals] = args;
        const out = [];
        let obj = null;
        for (let i = 0; i < ops.length; i++) {
          if (ops[i] === 'MinStack') { obj = new Cls(); out.push(null); }
          else {
            const r = obj[ops[i]].apply(obj, vals[i] || []);
            // pop() là thao tác void trong đặc tả -> bỏ qua giá trị trả về
            out.push(ops[i] === 'pop' || r === undefined ? null : r);
          }
        }
        return out;
      }`,
      harnessSrcPy: `def harness(Cls, args, t):
    ops, vals = args
    out = []
    obj = None
    for i in range(len(ops)):
        if ops[i] == 'MinStack':
            obj = Cls()
            out.append(None)
        else:
            v = vals[i] if vals[i] else []
            r = getattr(obj, ops[i])(*v)
            out.append(None if ops[i] == 'pop' or r is None else r)
    return out`,
      tests: [
        {
          args: [['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], [[], [-2], [0], [-3], [], [], [], []]],
          expected: [null, null, null, null, -3, null, 0, -2],
          name: 'Ví dụ chuẩn',
        },
        {
          args: [['MinStack', 'push', 'push', 'getMin', 'pop', 'getMin'], [[], [2], [2], [], [], []]],
          expected: [null, null, null, 2, null, 2],
          name: 'Giá trị trùng nhau (bẫy!)',
        },
        {
          args: [['MinStack', 'push', 'getMin', 'top', 'pop', 'push', 'getMin'], [[], [5], [], [], [], [1], []]],
          expected: [null, null, 5, 5, null, null, 1],
          name: 'Pop hết rồi push lại',
        },
        {
          args: [['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'getMin', 'pop', 'getMin'], [[], [3], [1], [2], [], [], [], [], []]],
          expected: [null, null, null, null, 1, null, 1, null, 3],
          name: 'Min ở giữa',
        },
      ],
      hints: [
        'Một biến `min` duy nhất là **không đủ**. Hãy tự hỏi: khi pop đúng phần tử đang là min, làm sao biết min mới mà không duyệt lại?',
        'Ý tưởng: mỗi phần tử "mang theo" thông tin min tại thời điểm nó được push. Dùng stack thứ hai `mins`, trong đó `mins[i]` = min của toàn bộ phần tử từ đáy tới i.',
        '`push(v)`: `mins.push(Math.min(v, mins.at(-1) ?? Infinity))`. `pop()`: pop cả hai stack. Chú ý bẫy giá trị trùng: nếu chỉ push vào `mins` khi `v < min` thì bài test [2,2] sẽ sai — hãy dùng `<=` hoặc luôn push.',
      ],
      hintsPy: [
        'Một biến `min` duy nhất là **không đủ**. Hãy tự hỏi: khi pop đúng phần tử đang là min, làm sao biết min mới mà không duyệt lại?',
        'Ý tưởng: mỗi phần tử "mang theo" thông tin min tại thời điểm nó được push. Dùng `list` thứ hai `self.mins`, trong đó `self.mins[i]` = min của toàn bộ phần tử từ đáy tới i.',
        '`push(v)`: `self.mins.append(min(v, self.mins[-1]) if self.mins else v)`. `pop()`: pop cả hai list. Chú ý bẫy giá trị trùng: nếu chỉ push vào `mins` khi `v < min` thì bài test [2,2] sẽ sai — hãy dùng `<=` hoặc luôn push (như trong `min(v, self.mins[-1])`).',
      ],
      diagnostics: [
        { test: 'Math\\.min\\s*\\(\\s*\\.\\.\\.', message: '`Math.min(...stack)` là O(n) mỗi lần gọi — vi phạm yêu cầu O(1). Hãy lưu sẵn lịch sử min.' },
        { test: 'sort\\s*\\(', message: 'Sắp xếp phá vỡ thứ tự LIFO và tốn O(n log n). Không phải hướng đi của bài này.' },
      ],
      diagnosticsPy: [
        { test: 'min\\s*\\(\\s*self\\.st\\s*\\)', message: '`min(self.st)` là O(n) mỗi lần gọi — vi phạm yêu cầu O(1). Hãy lưu sẵn lịch sử min trong một list phụ.' },
        { test: '\\.sort\\s*\\(\\)|sorted\\s*\\(', message: 'Sắp xếp phá vỡ thứ tự LIFO và tốn O(n log n). Không phải hướng đi của bài này.' },
      ],
      approach: `
**Bài học lớn hơn bản thân bài toán: "tăng cường dữ liệu" (data augmentation).**
Khi một truy vấn (ở đây là min) quá tốn kém để tính lại, hãy **lưu sẵn câu trả lời cùng với dữ liệu**,
và duy trì nó theo từng thao tác. Đây là ý tưởng nền của segment tree, của index trong database,
và của mọi bộ đệm thống kê.

\`\`\`
push(-2)  stack: [-2]       mins: [-2]
push(0)   stack: [-2,0]     mins: [-2,-2]
push(-3)  stack: [-2,0,-3]  mins: [-2,-2,-3]   getMin -> -3
pop()     stack: [-2,0]     mins: [-2,-2]      getMin -> -2  ✔
\`\`\`

**Biến thể tiết kiệm bộ nhớ** (hay được hỏi thêm): chỉ push vào \`mins\` khi \`v <= getMin()\`,
và chỉ pop \`mins\` khi giá trị bị pop bằng min hiện tại. Dấu \`=\` là bắt buộc — nếu dùng \`<\`,
chuỗi \`push(2); push(2); pop(); getMin()\` sẽ trả sai.
`,
      solution: `class MinStack {
  constructor() {
    this.st = [];
    this.mins = [];        // mins[i] = min của st[0..i]
  }
  push(val) {
    this.st.push(val);
    const m = this.mins.length ? Math.min(val, this.mins[this.mins.length - 1]) : val;
    this.mins.push(m);
  }
  pop() {
    this.mins.pop();
    return this.st.pop();
  }
  top() {
    return this.st[this.st.length - 1];
  }
  getMin() {
    return this.mins[this.mins.length - 1];
  }
}`,
      solutionPy: `class MinStack:
    def __init__(self):
        self.st = []
        self.mins = []

    def push(self, val):
        self.st.append(val)
        self.mins.append(min(val, self.mins[-1]) if self.mins else val)

    def pop(self):
        self.mins.pop()
        return self.st.pop()

    def top(self):
        return self.st[-1]

    def getMin(self):
        return self.mins[-1]`,
      complexity: {
        question: 'Bộ nhớ của cách dùng hai stack song song?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        answer: 2,
        why: 'Stack phụ có cùng kích thước với stack chính → O(n). Đây là cái giá phải trả để có getMin O(1) — lại là đánh đổi bộ nhớ lấy thời gian.',
      },
      realWorld: 'Theo dõi giá trị cực trị trong luồng dữ liệu có hoàn tác: ví dụ hệ thống giao dịch cần biết mức giá thấp nhất trong lịch sử hiện hành và có thể rollback từng bước.',
    },
    {
      id: 'eval-rpn',
      title: 'Tính biểu thức hậu tố (RPN)',
      en: 'Evaluate Reverse Polish Notation',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'evalRPN',
      statement: `
Cho mảng \`tokens\` biểu diễn biểu thức theo **ký pháp Ba Lan ngược** (toán tử đứng sau toán hạng).
Tính giá trị biểu thức.

Toán tử: \`+ - * /\`. Phép chia **lấy phần nguyên hướng về 0** (\`6/-132\` → 0, \`-7/2\` → -3).

**Ví dụ**
- \`["2","1","+","3","*"]\` → \`9\`   ((2+1)*3)
- \`["4","13","5","/","+"]\` → \`6\`  (4 + 13/5 = 4+2)
`,
      starter: `function evalRPN(tokens) {\n  \n}`,
      starterPy: `def evalRPN(tokens):\n    \n`,
      tests: [
        { args: [['2', '1', '+', '3', '*']], expected: 9, name: 'Ví dụ 1' },
        { args: [['4', '13', '5', '/', '+']], expected: 6, name: 'Chia lấy nguyên' },
        { args: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], expected: 22, name: 'Biểu thức dài' },
        { args: [['3', '-4', '+']], expected: -1, name: 'Số âm' },
        { args: [['5']], expected: 5, name: 'Một toán hạng' },
        { args: [['7', '2', '/']], expected: 3, name: 'Chia làm tròn về 0' },
        { args: [['-7', '2', '/']], expected: -3, name: 'Chia số âm — làm tròn về 0, KHÔNG phải floor' },
      ],
      hints: [
        'RPN được thiết kế để tính bằng stack: gặp **số** thì push; gặp **toán tử** thì pop hai số, tính, rồi push kết quả trở lại.',
        'Thứ tự toán hạng rất quan trọng với `-` và `/`: phần tử pop ra **đầu tiên** là số bên **phải**. `const b = st.pop(), a = st.pop();` rồi tính `a - b`, `a / b`.',
        'Chia trong JS cho số thực. Làm tròn về 0 phải dùng `Math.trunc(a/b)` chứ **không** phải `Math.floor` — với -7/2, floor cho -4 (sai), trunc cho -3 (đúng).',
      ],
      hintsPy: [
        'RPN được thiết kế để tính bằng stack: gặp **số** thì push; gặp **toán tử** thì pop hai số, tính, rồi push kết quả trở lại.',
        'Thứ tự toán hạng rất quan trọng với `-` và `/`: phần tử pop ra **đầu tiên** là số bên **phải**. `b, a = st.pop(), st.pop()` rồi tính `a - b`, `a / b`.',
        'Bẫy lớn nhất trong Python: toán tử `/` trả về `float`, và \`//\` (floor division) làm tròn về **âm vô cực**, không phải về 0 — với -7//2 cho -4 (sai). Đề yêu cầu làm tròn về 0, dùng `int(a / b)` chứ không phải `a // b`.',
      ],
      diagnostics: [
        { test: 'Math\\.floor\\s*\\(', message: '`Math.floor(-3.5)` = -4, nhưng đề yêu cầu làm tròn **về phía 0** → -3. Dùng `Math.trunc` (hoặc `~~` với số nhỏ).' },
        { test: 'eval\\s*\\(', message: 'Dùng `eval` là né tránh bài toán (và là lỗ hổng bảo mật trong thực tế). Hãy cài đặt bằng stack.' },
        { test: 'parseInt\\s*\\(\\s*[a-z]+\\s*\\)\\s*[^,)]*\\bNaN', message: 'Nhớ rằng `Number("-11")` hoạt động tốt với số âm; kiểm tra toán tử bằng danh sách chứ đừng dựa vào isNaN của dấu trừ.' },
      ],
      diagnosticsPy: [
        { test: '\\/\\/', message: '`//` là floor division — làm tròn về ÂM VÔ CỰC, không phải về 0. Với -7//2 = -4 (sai). Đề yêu cầu làm tròn về 0: dùng `int(a / b)`.' },
        { test: '\\beval\\s*\\(', message: 'Dùng `eval` là né tránh bài toán (và là lỗ hổng bảo mật trong thực tế). Hãy cài đặt bằng stack.' },
      ],
      approach: `
**Vì sao RPN tồn tại?** Vì nó **không cần ngoặc** và tính được bằng một lượt duyệt với stack duy nhất.
Đó là lý do máy ảo JVM, WebAssembly, và máy tính HP cổ điển đều dùng dạng hậu tố:
biểu thức trung tố \`(2+1)*3\` cần bộ phân tích cú pháp với độ ưu tiên, còn hậu tố thì không.

\`\`\`
["2","1","+","3","*"]
2      -> [2]
1      -> [2,1]
"+"    -> pop 1, pop 2 -> push 3   -> [3]
3      -> [3,3]
"*"    -> pop 3, pop 3 -> push 9   -> [9]
\`\`\`

**Bất biến:** stack luôn chứa các kết quả trung gian *chưa được tiêu thụ*.
Biểu thức RPN hợp lệ ⟺ stack còn đúng 1 phần tử khi kết thúc.

**Liên hệ:** thuật toán Shunting-yard của Dijkstra chuyển trung tố → hậu tố cũng dùng stack.
Đây là bộ đôi kinh điển trong xây dựng trình biên dịch.
`,
      solution: `function evalRPN(tokens) {
  const st = [];
  const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),   // làm tròn VỀ 0, không phải floor
  };
  for (const t of tokens) {
    if (t in ops) {
      const b = st.pop();               // pop trước = toán hạng bên PHẢI
      const a = st.pop();
      st.push(ops[t](a, b));
    } else {
      st.push(Number(t));
    }
  }
  return st.pop();
}`,
      solutionPy: `def evalRPN(tokens):
    st = []
    for t in tokens:
        if t in ('+', '-', '*', '/'):
            b, a = st.pop(), st.pop()
            if t == '+': st.append(a + b)
            elif t == '-': st.append(a - b)
            elif t == '*': st.append(a * b)
            else: st.append(int(a / b))   # int() làm tròn về 0
        else:
            st.append(int(t))
    return st.pop()`,
      complexity: {
        question: 'Độ phức tạp thời gian / bộ nhớ với n token?',
        options: ['O(n) / O(n)', 'O(n log n) / O(n)', 'O(n²) / O(1)', 'O(n) / O(1)'],
        answer: 0,
        why: 'Mỗi token xử lý một lần với O(1) thao tác stack. Bộ nhớ O(n) cho trường hợp toàn toán hạng ở đầu.',
      },
      realWorld: 'Máy ảo dựa trên stack (JVM bytecode, WebAssembly, EVM) thực thi chính xác vòng lặp này. Công thức trong bảng tính và bộ máy quy tắc (rule engine) cũng thường biên dịch về RPN để tính nhanh.',
    },
    {
      id: 'daily-temperatures',
      title: 'Nhiệt độ hằng ngày',
      en: 'Daily Temperatures',
      difficulty: 'Medium',
      targetMinutes: 20,
      entry: 'dailyTemperatures',
      statement: `
Cho mảng \`temperatures\`. Với mỗi ngày, trả về **số ngày phải chờ** để có nhiệt độ ấm hơn.
Nếu không có ngày nào ấm hơn, giá trị là \`0\`.

**Ví dụ**
- \`[73,74,75,71,69,72,76,73]\` → \`[1,1,4,2,1,1,0,0]\`
- \`[30,40,50,60]\` → \`[1,1,1,0]\`
`,
      starter: `function dailyTemperatures(temperatures) {\n  \n}`,
      starterPy: `def dailyTemperatures(temperatures):\n    \n`,
      tests: [
        { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0], name: 'Ví dụ chuẩn' },
        { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0], name: 'Tăng dần' },
        { args: [[30, 60, 90]], expected: [1, 1, 0], name: 'Ba ngày' },
        { args: [[90, 80, 70]], expected: [0, 0, 0], name: 'Giảm dần — không có ngày ấm hơn' },
        { args: [[50, 50, 50]], expected: [0, 0, 0], name: 'Bằng nhau KHÔNG tính là ấm hơn' },
        { args: [[100]], expected: [0], name: 'Một ngày' },
      ],
      perfTests: [{ build: () => [Array.from({ length: 120000 }, (_, i) => (i === 119999 ? 200 : 120000 - i))], name: 'Hiệu năng: 120.000 ngày (giảm dần — bản O(n²) sẽ hết giờ)' }],
      hints: [
        'Bản O(n²) là "với mỗi i, quét sang phải tìm ngày ấm hơn". Hãy đảo ngược câu hỏi: khi đứng ở ngày `i`, ngày này **giải quyết** được cho những ngày nào trong quá khứ?',
        'Giữ một stack các **chỉ số** ngày đang "chờ" một ngày ấm hơn. Vì các ngày trong stack chưa tìm được ngày ấm hơn nên nhiệt độ của chúng **giảm dần** từ đáy lên đỉnh.',
        'Với mỗi i: `while (st.length && t[i] > t[st.at(-1)]) { const j = st.pop(); res[j] = i - j; }` rồi `st.push(i)`. Chú ý dùng `>` chứ không `>=` vì "bằng nhau" không phải "ấm hơn".',
      ],
      hintsPy: [
        'Bản O(n²) là "với mỗi i, quét sang phải tìm ngày ấm hơn". Hãy đảo ngược câu hỏi: khi đứng ở ngày `i`, ngày này **giải quyết** được cho những ngày nào trong quá khứ?',
        'Giữ một stack (`list`) các **chỉ số** ngày đang "chờ" một ngày ấm hơn. Vì các ngày trong stack chưa tìm được ngày ấm hơn nên nhiệt độ của chúng **giảm dần** từ đáy lên đỉnh.',
        'Với mỗi i: `while st and t[i] > t[st[-1]]: j = st.pop(); res[j] = i - j` rồi `st.append(i)`. Chú ý dùng `>` chứ không `>=` vì "bằng nhau" không phải "ấm hơn".',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lồng nhau → O(n²), trượt test 100.000 phần tử. Hãy dùng ngăn xếp đơn điệu để mỗi phần tử chỉ được xử lý một lần.' },
        { test: '>=\\s*temperatures\\[|temperatures\\[[a-z]+\\]\\s*>=', message: 'Cẩn thận: "ấm hơn" là lớn hơn thực sự (`>`), nhiệt độ bằng nhau không tính.' },
      ],
      diagnosticsPy: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lồng nhau → O(n²), trượt test 100.000 phần tử. Hãy dùng ngăn xếp đơn điệu để mỗi phần tử chỉ được xử lý một lần.' },
        { test: '>=\\s*temperatures\\[|temperatures\\[\\w+\\]\\s*>=', message: 'Cẩn thận: "ấm hơn" là lớn hơn thực sự (`>`), nhiệt độ bằng nhau không tính.' },
      ],
      approach: `
**Đảo ngược góc nhìn** — đây là kỹ thuật tư duy quan trọng nhất của bài này.

Thay vì hỏi *"ngày i phải chờ ai?"* (phải nhìn về tương lai — tốn kém),
hãy hỏi *"ngày i giải quyết cho những ai?"* (nhìn về quá khứ — đã có sẵn trong stack).

\`\`\`
t = [73, 74, 75, 71, 69, 72, 76, 73]

i=0  st=[]        push 0            st=[0]
i=1  74>73 -> res[0]=1              st=[1]
i=2  75>74 -> res[1]=1              st=[2]
i=3  71<75                          st=[2,3]
i=4  69<71                          st=[2,3,4]
i=5  72>69 -> res[4]=1
     72>71 -> res[3]=2              st=[2,5]
i=6  76>72 -> res[5]=1
     76>75 -> res[2]=4              st=[6]
i=7  73<76                          st=[6,7]
còn lại trong stack -> res = 0
\`\`\`

**Bất biến:** stack chứa các chỉ số có nhiệt độ **giảm dần**; đó đúng là tập những ngày chưa có lời giải.
Khi một ngày ấm xuất hiện, nó "trả lời" cho một loạt ngày liên tiếp ở đỉnh stack.

**Họ bài toán này rất lớn:** Next Greater Element, Largest Rectangle in Histogram,
Trapping Rain Water, Stock Span, Remove K Digits — tất cả đều là monotonic stack.
`,
      solution: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const res = new Array(n).fill(0);
  const st = [];                        // chỉ số các ngày đang chờ, nhiệt độ giảm dần

  for (let i = 0; i < n; i++) {
    while (st.length && temperatures[i] > temperatures[st[st.length - 1]]) {
      const j = st.pop();
      res[j] = i - j;
    }
    st.push(i);
  }
  return res;                           // các ngày còn trong stack giữ giá trị 0
}`,
      solutionPy: `def dailyTemperatures(temperatures):
    n = len(temperatures)
    res = [0] * n
    st = []
    for i, t in enumerate(temperatures):
        while st and t > temperatures[st[-1]]:
            j = st.pop()
            res[j] = i - j
        st.append(i)
    return res`,
      complexity: {
        question: 'Độ phức tạp của lời giải ngăn xếp đơn điệu?',
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(n · k) với k là số ngày chờ trung bình'],
        answer: 2,
        why: 'Mỗi chỉ số được push đúng 1 lần và pop tối đa 1 lần → tổng thao tác ≤ 2n. Vòng while không làm tăng bậc độ phức tạp.',
      },
      realWorld: 'Chỉ báo "stock span" trong tài chính (số phiên liên tiếp giá thấp hơn hôm nay) dùng đúng thuật toán này. Trong giám sát hệ thống: "bao lâu nữa tải vượt mức hiện tại" cũng cùng dạng.',
    },
  ],
},

/* ==================================================================== */
{
  id: 'binary-search',
  name: 'Tìm kiếm nhị phân',
  en: 'Binary Search',
  icon: '🎯',
  days: [9, 10],
  summary: 'Loại một nửa không gian tìm kiếm mỗi bước — và bí mật lớn: có thể tìm nhị phân trên ĐÁP ÁN.',
  lesson: `
## 1. Vấn đề gốc

Tìm một giá trị trong n phần tử cần O(n). Nhưng nếu dữ liệu có **thứ tự**, mỗi phép so sánh
cho ta biết đáp án nằm ở **nửa nào** — thông tin đó đáng giá gấp bội.

log₂(1.000.000) ≈ 20. Từ một triệu bước xuống 20 bước.

## 2. Ý tưởng cốt lõi

> Tìm kiếm nhị phân **không phải** về "mảng đã sắp xếp".
> Nó là về **tính đơn điệu của một vị từ (predicate)**: tồn tại một điểm cắt mà trước đó
> điều kiện luôn sai, sau đó luôn đúng — dạng \`F F F F T T T T\`.

Nếu bạn tìm được một hàm \`check(x)\` có dạng đó, bạn tìm nhị phân được — kể cả khi
"mảng" là **tập mọi đáp án có thể**. Đó là kỹ thuật **binary search on answer**, thứ phân biệt
người mới với người có kinh nghiệm.

## 3. Mẫu code chống lỗi off-by-one

Hãy dùng **một khuôn duy nhất** cho mọi bài (nửa mở \`[lo, hi)\`), đừng nhớ nhiều biến thể:

\`\`\`js
// Tìm chỉ số NHỎ NHẤT thoả check(x) === true, với check có dạng F...F T...T
let lo = 0, hi = n;              // hi nằm NGOÀI phạm vi
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);   // tránh tràn số (quan trọng ở Java/C++)
  if (check(mid)) hi = mid;            // mid có thể là đáp án -> giữ lại
  else lo = mid + 1;                   // mid chắc chắn không phải -> bỏ
}
return lo;                             // lo === hi === điểm chuyển F->T
\`\`\`

Với bài tìm giá trị chính xác:
\`\`\`js
let lo = 0, hi = n - 1;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (a[mid] === target) return mid;
  if (a[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
return -1;
\`\`\`

## 4. Binary search on answer — mở khoá cả một lớp bài

Dấu hiệu: đề hỏi **"giá trị nhỏ nhất/lớn nhất sao cho ... khả thi"**, và bạn kiểm tra được tính khả thi dễ dàng.

Ví dụ *Koko ăn chuối*: "tốc độ ăn nhỏ nhất k để ăn xong trong h giờ".
- Không gian đáp án: k ∈ [1, max(piles)].
- \`check(k)\` = "ăn với tốc độ k có kịp trong h giờ không?" — tính trong O(n).
- **Đơn điệu**: k càng lớn thì càng dễ kịp → F F F T T T. ✔ Tìm nhị phân được.

Ba bước luôn giống nhau:
1. Xác định **khoảng đáp án** [lo, hi].
2. Viết hàm \`check(x)\` (thường là mô phỏng tham lam O(n)).
3. Chứng minh \`check\` **đơn điệu** — nếu không đơn điệu thì không được dùng!

## 5. Bẫy thường gặp

- \`(lo + hi) / 2\` gây tràn số ở ngôn ngữ số nguyên 32-bit → dùng \`lo + (hi-lo)/2\`.
- Vòng lặp vô hạn khi \`lo = mid\` mà mid không tiến. Quy tắc: nếu gán \`lo = mid\` thì phải làm tròn lên.
- Quên rằng mảng xoay vòng vẫn dùng được binary search: **luôn có ít nhất một nửa đã sắp xếp**.
- Áp binary search lên hàm không đơn điệu → kết quả sai một cách khó phát hiện.

## 6. Ứng dụng thực tế

- **Chỉ mục B-tree** trong database: mỗi lần truy vấn theo khoá là tìm nhị phân trên đĩa.
- **git bisect**: tìm commit gây lỗi trong lịch sử — tìm nhị phân trên trục thời gian!
- **Điều chỉnh tham số hệ thống**: tìm mức tải tối đa mà độ trễ vẫn dưới ngưỡng (đúng mẫu "search on answer").
- **Tìm phiên bản lỗi đầu tiên** trong CI; **rate limit tuning**; **tìm ngưỡng nhị phân** trong xử lý ảnh.
`,
  lessonPy: `
## 1. Vấn đề gốc

Tìm một giá trị trong \`n\` phần tử bằng cách quét lần lượt từng phần tử (\`for x in a: if x == target...\`)
cần O(n) — với 1 triệu phần tử là 1 triệu phép so sánh trong trường hợp xấu nhất. Nhưng nếu dữ liệu
có **thứ tự** (đã sắp xếp), mỗi phép so sánh không chỉ loại được MỘT phần tử — nó cho ta biết đáp án
nằm ở **nửa nào** trong hai nửa còn lại, loại bỏ được cả nửa còn lại cùng lúc.

\`\`\`python
def tim_kiem_tuyen_tinh(a, target):     # O(n) — quét từng phần tử
    for i, x in enumerate(a):
        if x == target:
            return i
    return -1
\`\`\`

Vì mỗi lần so sánh loại được một nửa, sau \`k\` lần so sánh chỉ còn \`n / 2^k\` phần tử để xét. Số lần
so sánh cần thiết để đưa \`n\` phần tử về còn 1 phần tử là \`k = log₂(n)\`. Với \`n = 1.000.000\`,
\`log₂(1.000.000) ≈ 20\` — từ một triệu bước quét tuần tự xuống chỉ còn 20 bước so sánh.

## 2. Ý tưởng cốt lõi

> Tìm kiếm nhị phân **không phải** chỉ là "tìm trong list đã sắp xếp".
> Bản chất của nó là tính **đơn điệu của một vị từ (predicate)** — một hàm \`check(x)\` trả về
> \`True\`/\`False\` — sao cho tồn tại một điểm cắt: trước điểm đó \`check\` luôn \`False\`, từ điểm đó
> trở đi luôn \`True\`. Viết ra thành dãy sẽ có dạng \`F F F F T T T T\`, không bao giờ xen kẽ lộn xộn.

Nếu bạn tìm được một hàm \`check(x)\` có đúng tính chất đơn điệu đó, bạn tìm nhị phân được — **kể cả
khi "mảng" không phải là một danh sách số liệu có sẵn, mà là tập mọi đáp án khả dĩ** (ví dụ: mọi tốc
độ ăn có thể có, từ 1 tới giá trị lớn nhất). Kỹ thuật tổng quát hoá này gọi là **binary search on
answer**, và nó là thứ phân biệt rõ nhất người mới học với người đã có kinh nghiệm giải thuật toán.

## 3. Cấu trúc & hàm Python thường dùng trong chủ đề này

| Tên | Vai trò | Ví dụ dùng nhanh |
|---|---|---|
| \`lo + (hi - lo) // 2\` | Tính điểm giữa an toàn, tránh cộng hai số lớn tràn phạm vi (thói quen tốt dù Python không tràn số) | thay cho \`(lo + hi) // 2\` |
| \`//\` (floor division) | Luôn dùng để tính \`mid\` — chia \`/\` trả về \`float\`, không dùng làm chỉ số được | \`mid = (lo + hi) // 2\` |
| \`bisect.bisect_left(a, x)\` | Tìm vị trí chèn \`x\` vào list \`a\` đã sắp để giữ thứ tự, ở BÊN TRÁI các phần tử bằng \`x\` | \`from bisect import bisect_left\` |
| \`bisect.bisect_right(a, x)\` | Tương tự nhưng chèn ở BÊN PHẢI các phần tử bằng \`x\` | dùng khi cần đếm số phần tử \`<= x\` |
| \`math.ceil(a / b)\` | Làm tròn LÊN — hay dùng trong \`check(x)\` của binary search on answer (ví dụ: "cần bao nhiêu giờ") | \`math.ceil(pile / speed)\` |
| \`float('inf')\` | Giá trị vô cùng — dùng làm cận trên/dưới ban đầu khi chưa biết giới hạn cụ thể | \`hi = float('inf')\` |

## 4. Mẫu code chống lỗi off-by-one

Hãy dùng **một khuôn duy nhất** cho mọi bài (nửa mở \`[lo, hi)\`), đừng cố nhớ nhiều biến thể khác nhau:

\`\`\`python
# Tìm chỉ số NHỎ NHẤT thoả check(x) là True, với check có dạng F...F T...T
def tim_bien_chuyen(check, n):
    lo, hi = 0, n                    # hi nằm NGOÀI phạm vi hợp lệ, quy ước "nửa mở"
    while lo < hi:
        mid = lo + (hi - lo) // 2     # // là floor division, không tràn số trong Python
        if check(mid):
            hi = mid                 # mid THOẢ điều kiện -> có thể là đáp án -> giữ lại, thu hẹp bên phải
        else:
            lo = mid + 1              # mid chắc chắn KHÔNG THOẢ -> loại hẳn, thu hẹp bên trái
    return lo                          # khi vòng lặp dừng, lo == hi == đúng điểm chuyển từ F sang T

# Ví dụ: a = [1, 3, 3, 3, 5, 7], tìm vị trí đầu tiên có giá trị >= 3
a = [1, 3, 3, 3, 5, 7]
print(tim_bien_chuyen(lambda i: a[i] >= 3, len(a)))   # 1 — a[1] là phần tử đầu tiên >= 3
\`\`\`

Với bài tìm giá trị chính xác trong list đã sắp (khuôn "đóng" \`[lo, hi]\`, kinh điển hơn):

\`\`\`python
def tim_kiem_nhi_phan(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1              # target lớn hơn a[mid] -> bỏ nửa trái, kể cả mid
        else:
            hi = mid - 1               # target nhỏ hơn a[mid] -> bỏ nửa phải, kể cả mid
    return -1

print(tim_kiem_nhi_phan([1, 3, 5, 7, 9, 11], 7))   # 3
print(tim_kiem_nhi_phan([1, 3, 5, 7, 9, 11], 4))   # -1 — không tồn tại
\`\`\`

Python cũng có sẵn \`bisect_left\`/\`bisect_right\` trong module \`bisect\` để tra cứu nhanh trên list đã
sắp mà không cần tự viết vòng lặp, nhưng trong phỏng vấn bạn vẫn nên biết tự viết khuôn này từ trí nhớ
— vì phần lớn bài không phải "tìm chính xác một giá trị", mà là biến thể của "tìm điểm chuyển F→T".

## 5. Binary search on answer — mở khoá cả một lớp bài

Dấu hiệu nhận ra dạng bài này: đề hỏi **"giá trị nhỏ nhất/lớn nhất sao cho ... là khả thi"**, và bạn
có thể kiểm tra tính khả thi của MỘT giá trị cụ thể một cách dễ dàng (thường bằng một vòng lặp O(n)).

Ví dụ kinh điển — *Koko ăn chuối*: "tìm tốc độ ăn nhỏ nhất k để ăn hết mọi đống chuối trong h giờ".

- **Không gian đáp án**: \`k\` có thể là bất kỳ số nguyên nào từ \`1\` đến \`max(piles)\` — đây chính là
  "mảng" để tìm nhị phân, dù nó không phải dữ liệu đề bài cho sẵn mà là *tập giá trị k khả dĩ*.
- \`check(k)\` = "nếu ăn với tốc độ \`k\`, có kịp trong \`h\` giờ không?" — tính được trong O(n) bằng cách
  cộng dồn \`math.ceil(pile / k)\` cho từng đống chuối.
- **Tính đơn điệu**: \`k\` càng lớn thì càng dễ ăn kịp giờ hơn → dãy kết quả của \`check\` có dạng
  \`F F F T T T\` (k nhỏ thì không kịp, k đủ lớn thì kịp). Có tính đơn điệu → tìm nhị phân được.

\`\`\`python
import math

def toc_do_an_nho_nhat(piles, h):
    def kip_gio(k):
        return sum(math.ceil(pile / k) for pile in piles) <= h

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if kip_gio(mid):
            hi = mid           # tốc độ mid đã đủ nhanh -> thử tốc độ chậm hơn nữa xem có được không
        else:
            lo = mid + 1        # tốc độ mid chưa đủ nhanh -> cần nhanh hơn
    return lo
\`\`\`

Ba bước luôn giống nhau khi gặp dạng bài này:
1. Xác định **khoảng đáp án** \`[lo, hi]\` — giá trị nhỏ nhất và lớn nhất có thể của đáp án.
2. Viết hàm \`check(x)\` (thường là mô phỏng tham lam, chạy O(n) hoặc O(n log n)).
3. **Chứng minh \`check\` đơn điệu** trước khi áp dụng — nếu không đơn điệu (không có dạng F...FT...T
   sạch sẽ) thì binary search sẽ cho kết quả sai mà không hề báo lỗi.

## 6. Bẫy thường gặp

- Python số nguyên không tràn (không như số 32-bit cố định ở Java/C++), nhưng vẫn nên viết
  \`lo + (hi - lo) // 2\` thay vì \`(lo + hi) // 2\` như một thói quen tốt, áp dụng được cả khi chuyển
  ngôn ngữ khác lúc phỏng vấn.
- Vòng lặp vô hạn khi gán \`lo = mid\` mà \`mid\` không tiến lên (vì \`//\` làm tròn xuống, \`mid\` có thể
  bằng \`lo\`). Quy tắc nhớ: nếu nhánh nào gán \`lo = mid\` (giữ lại \`mid\`), nhánh \`mid\` phải được tính
  làm tròn LÊN (\`mid = lo + (hi - lo + 1) // 2\`) để đảm bảo luôn tiến.
- \`//\` là floor division — với số âm nó làm tròn về **âm vô cực**, khác với thói quen \`Math.trunc\`
  cắt về 0 ở nhiều ngôn ngữ khác. Cẩn thận nếu \`mid\`/\`check\` có liên quan tới số âm.
- Quên rằng mảng đã bị xoay (rotated) vẫn dùng được binary search: **luôn tồn tại ít nhất một nửa
  (trái hoặc phải của \`mid\`) vẫn còn được sắp xếp bình thường**, chỉ cần xác định đúng nửa nào.
- Áp binary search lên một hàm KHÔNG đơn điệu → kết quả sai một cách âm thầm, không có exception nào
  báo hiệu — đây là lỗi khó phát hiện nhất trong cả chủ đề này.

## 7. Ứng dụng thực tế

- **Chỉ mục B-tree** trong database: mỗi lần truy vấn theo khoá là một lượt tìm nhị phân trên đĩa.
- **git bisect**: tìm commit gây lỗi trong lịch sử — tìm nhị phân trên trục thời gian của các commit!
- **Điều chỉnh tham số hệ thống**: tìm mức tải tối đa mà độ trễ vẫn dưới ngưỡng cho phép (đúng mẫu
  "binary search on answer").
- **Tìm phiên bản lỗi đầu tiên** trong CI; **rate limit tuning**; **tìm ngưỡng nhị phân** trong xử lý ảnh.
`,
  quiz: [
    {
      q: 'Điều kiện THỰC SỰ để dùng được tìm kiếm nhị phân là gì?',
      options: [
        'Mảng phải được sắp xếp tăng dần',
        'Tồn tại một vị từ đơn điệu: sai với mọi giá trị nhỏ và đúng với mọi giá trị lớn (hoặc ngược lại)',
        'Dữ liệu phải nằm trong bộ nhớ liên tục',
        'Số phần tử phải là luỹ thừa của 2',
      ],
      answer: 1,
      why: 'Mảng đã sắp xếp chỉ là MỘT trường hợp của tính đơn điệu. Hiểu đúng bản chất mở khoá kỹ thuật "binary search on answer" — nơi không hề có mảng nào cả.',
    },
    {
      q: 'Trong mảng đã sắp bị xoay như [4,5,6,7,0,1,2], vì sao vẫn tìm nhị phân được?',
      options: [
        'Vì mảng vẫn được sắp xếp',
        'Vì với mọi mid, luôn có ít nhất một nửa [lo..mid] hoặc [mid..hi] được sắp xếp hoàn chỉnh',
        'Vì ta có thể sắp xếp lại mảng trong O(1)',
        'Vì phần tử giữa luôn là phần tử nhỏ nhất',
      ],
      answer: 1,
      why: 'Điểm xoay chỉ nằm ở MỘT nửa. Nửa còn lại sắp xếp hoàn chỉnh nên ta kiểm tra được target có nằm trong nửa đó không, rồi loại nửa kia. Vẫn O(log n).',
    },
    {
      q: 'Bài "tốc độ ăn chuối nhỏ nhất để kịp h giờ" (Koko) — điều gì cho phép dùng binary search?',
      options: [
        'Mảng piles đã được sắp xếp',
        'Hàm check(k) = "ăn kịp với tốc độ k" là đơn điệu: k tăng thì từ sai chuyển sang đúng và không đảo lại',
        'Vì h luôn lớn hơn số đống chuối',
        'Vì piles chứa số nguyên',
      ],
      answer: 1,
      why: 'Ta tìm nhị phân trên KHÔNG GIAN ĐÁP ÁN [1, max(piles)], không phải trên mảng piles. Điều kiện duy nhất là check đơn điệu. Đây là mẫu hình đáng giá nhất của chủ đề này.',
    },
    {
      q: 'Vì sao nên viết `mid = lo + ((hi - lo) >> 1)` thay vì `mid = (lo + hi) / 2`?',
      options: [
        'Vì nhanh hơn nhiều',
        'Vì tránh tràn số nguyên khi lo + hi vượt giới hạn kiểu dữ liệu',
        'Vì kết quả khác nhau về mặt toán học',
        'Vì bắt buộc trong JavaScript',
      ],
      answer: 1,
      why: 'Lỗi này từng tồn tại 9 năm trong thư viện chuẩn Java (java.util.Arrays.binarySearch). Trong JS số là 64-bit float nên ít rủi ro hơn, nhưng đây là thói quen tốt cần có khi phỏng vấn C++/Java.',
    },
  ],
  quizPy: [
    {
      q: 'Điều kiện THỰC SỰ để dùng được tìm kiếm nhị phân là gì?',
      options: [
        'List phải được sắp xếp tăng dần',
        'Tồn tại một vị từ đơn điệu: sai với mọi giá trị nhỏ và đúng với mọi giá trị lớn (hoặc ngược lại)',
        'Dữ liệu phải nằm trong bộ nhớ liên tục',
        'Số phần tử phải là luỹ thừa của 2',
      ],
      answer: 1,
      why: 'List đã sắp xếp chỉ là MỘT trường hợp của tính đơn điệu. Hiểu đúng bản chất mở khoá kỹ thuật "binary search on answer" — nơi không hề có list nào cả.',
    },
    {
      q: 'Trong list đã sắp bị xoay như [4,5,6,7,0,1,2], vì sao vẫn tìm nhị phân được?',
      options: [
        'Vì list vẫn được sắp xếp',
        'Vì với mọi mid, luôn có ít nhất một nửa [lo..mid] hoặc [mid..hi] được sắp xếp hoàn chỉnh',
        'Vì ta có thể sắp xếp lại list trong O(1)',
        'Vì phần tử giữa luôn là phần tử nhỏ nhất',
      ],
      answer: 1,
      why: 'Điểm xoay chỉ nằm ở MỘT nửa. Nửa còn lại sắp xếp hoàn chỉnh nên ta kiểm tra được target có nằm trong nửa đó không, rồi loại nửa kia. Vẫn O(log n).',
    },
    {
      q: 'Bài "tốc độ ăn chuối nhỏ nhất để kịp h giờ" (Koko) — điều gì cho phép dùng binary search?',
      options: [
        'List piles đã được sắp xếp',
        'Hàm check(k) = "ăn kịp với tốc độ k" là đơn điệu: k tăng thì từ sai chuyển sang đúng và không đảo lại',
        'Vì h luôn lớn hơn số đống chuối',
        'Vì piles chứa số nguyên',
      ],
      answer: 1,
      why: 'Ta tìm nhị phân trên KHÔNG GIAN ĐÁP ÁN [1, max(piles)], không phải trên list piles. Điều kiện duy nhất là check đơn điệu (dùng math.ceil để tính giờ). Đây là mẫu hình đáng giá nhất của chủ đề này.',
    },
    {
      q: 'Vì sao nên viết `mid = lo + (hi - lo) // 2` thay vì `mid = (lo + hi) // 2`?',
      options: [
        'Vì nhanh hơn nhiều trong Python',
        'Vì tránh tràn số nguyên khi lo + hi vượt giới hạn kiểu dữ liệu (thói quen tốt dù Python không tràn số)',
        'Vì kết quả khác nhau về mặt toán học',
        'Vì bắt buộc trong Python',
      ],
      answer: 1,
      why: 'Lỗi này từng tồn tại 9 năm trong thư viện chuẩn Java (java.util.Arrays.binarySearch). Python có số nguyên lớn tuỳ ý nên không tràn, nhưng đây là thói quen tốt cần có khi phỏng vấn đa ngôn ngữ.',
    },
  ],
  problems: [
    {
      id: 'binary-search-basic',
      title: 'Tìm kiếm nhị phân cơ bản',
      en: 'Binary Search',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'search',
      statement: `
Cho mảng \`nums\` **đã sắp tăng dần** (các phần tử phân biệt) và \`target\`.
Trả về chỉ số của target, hoặc \`-1\` nếu không tồn tại. Yêu cầu O(log n).

**Ví dụ**
- \`nums = [-1,0,3,5,9,12], target = 9\` → \`4\`
- \`nums = [-1,0,3,5,9,12], target = 2\` → \`-1\`
`,
      starter: `function search(nums, target) {\n  \n}`,
      starterPy: `def search(nums, target):\n    \n`,
      tests: [
        { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, name: 'Tìm thấy' },
        { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, name: 'Không tồn tại' },
        { args: [[5], 5], expected: 0, name: 'Một phần tử — trúng' },
        { args: [[5], -5], expected: -1, name: 'Một phần tử — trượt' },
        { args: [[1, 2], 2], expected: 1, name: 'Hai phần tử — bẫy off-by-one' },
        { args: [[1, 2, 3, 4, 5], 1], expected: 0, name: 'Phần tử đầu' },
        { args: [[1, 2, 3, 4, 5], 5], expected: 4, name: 'Phần tử cuối' },
      ],
      hints: [
        'Khuôn mẫu: `lo = 0, hi = n - 1`, lặp khi `lo <= hi`. Tính mid, so sánh với target, rồi thu hẹp phạm vi.',
        'Ba nhánh: `nums[mid] === target` → trả về mid; `nums[mid] < target` → đáp án ở nửa phải (`lo = mid + 1`); ngược lại `hi = mid - 1`.',
        'Bẫy vòng lặp vô hạn: phải là `mid + 1` và `mid - 1`, không được để `lo = mid` hoặc `hi = mid` với `while lo <= hi`. Test [1,2] tìm 2 sẽ phát hiện lỗi này ngay.',
      ],
      hintsPy: [
        'Khuôn mẫu: `lo, hi = 0, len(nums) - 1`, lặp khi `lo <= hi`. Tính mid, so sánh với target, rồi thu hẹp phạm vi.',
        'Ba nhánh: `nums[mid] == target` → trả về mid; `nums[mid] < target` → đáp án ở nửa phải (`lo = mid + 1`); ngược lại `hi = mid - 1`.',
        'Bẫy vòng lặp vô hạn: phải là `mid + 1` và `mid - 1`, không được để `lo = mid` hoặc `hi = mid` với `while lo <= hi`. Test [1,2] tìm 2 sẽ phát hiện lỗi này ngay.',
      ],
      diagnostics: [
        { test: 'indexOf\\s*\\(|\\.find\\s*\\(|includes\\s*\\(', message: 'Dùng hàm dựng sẵn là O(n) và né tránh mục tiêu bài học. Hãy tự cài đặt vòng lặp nhị phân.' },
        { test: 'lo\\s*=\\s*mid\\s*;|hi\\s*=\\s*mid\\s*;', message: 'Gán `lo = mid` hoặc `hi = mid` với vòng `while (lo <= hi)` sẽ gây lặp vô hạn. Dùng `mid + 1` / `mid - 1`.' },
      ],
      diagnosticsPy: [
        { test: '\\.index\\s*\\(|\\bin\\s+nums\\b', message: 'Dùng `nums.index(...)`/`in nums` là O(n) và né tránh mục tiêu bài học. Hãy tự cài đặt vòng lặp nhị phân.' },
        { test: 'lo\\s*=\\s*mid\\s*\\n|hi\\s*=\\s*mid\\s*\\n', message: 'Gán `lo = mid` hoặc `hi = mid` với vòng `while lo <= hi` sẽ gây lặp vô hạn. Dùng `mid + 1` / `mid - 1`.' },
      ],
      approach: `
Bài này đơn giản nhưng **phải viết đúng từ trí nhớ, không cần thử-sai**. Người phỏng vấn để ý điều đó.

**Bất biến:** nếu target tồn tại thì nó luôn nằm trong \`[lo, hi]\`.
Mỗi vòng lặp thu hẹp khoảng đi một nửa và bất biến vẫn được giữ.
Khi \`lo > hi\`, khoảng rỗng → target không tồn tại.

**Vì sao O(log n)?** Kích thước khoảng: n → n/2 → n/4 → ... → 1. Số bước là log₂n.
Với n = 10⁹, chỉ khoảng 30 bước.

**Mẹo kiểm tra code nhanh:** luôn chạy thử mảng 2 phần tử. 90% lỗi off-by-one lộ ra ở đó.
`,
      solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      solutionPy: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      complexity: {
        question: 'Với n = 1 tỷ phần tử, tìm kiếm nhị phân cần khoảng bao nhiêu bước?',
        options: ['~1000 bước', '~30 bước', '~1 triệu bước', '~100 bước'],
        answer: 1,
        why: 'log₂(10⁹) ≈ 30. Con số này đáng để ghi nhớ — nó cho thấy vì sao chỉ mục database khiến truy vấn nhanh đến vậy.',
      },
      realWorld: '`git bisect` tìm commit gây lỗi giữa hàng nghìn commit chỉ với ~12 lần build. Cùng ý tưởng: mỗi phép thử loại một nửa lịch sử.',
    },
    {
      id: 'search-rotated',
      title: 'Tìm kiếm trong mảng xoay vòng',
      en: 'Search in Rotated Sorted Array',
      difficulty: 'Medium',
      targetMinutes: 22,
      entry: 'searchRotated',
      statement: `
Mảng đã sắp tăng dần (phần tử phân biệt) bị **xoay** tại một vị trí không xác định.
Ví dụ \`[0,1,2,4,5,6,7]\` xoay thành \`[4,5,6,7,0,1,2]\`.

Cho \`nums\` và \`target\`, trả về chỉ số của target hoặc \`-1\`. Yêu cầu **O(log n)**.

**Ví dụ**
- \`nums = [4,5,6,7,0,1,2], target = 0\` → \`4\`
- \`nums = [4,5,6,7,0,1,2], target = 3\` → \`-1\`
`,
      starter: `function searchRotated(nums, target) {\n  \n}`,
      starterPy: `def searchRotated(nums, target):\n    \n`,
      tests: [
        { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4, name: 'Ở nửa sau' },
        { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1, name: 'Không tồn tại' },
        { args: [[1], 0], expected: -1, name: 'Một phần tử — trượt' },
        { args: [[1], 1], expected: 0, name: 'Một phần tử — trúng' },
        { args: [[3, 1], 1], expected: 1, name: 'Hai phần tử xoay' },
        { args: [[5, 1, 3], 3], expected: 2, name: 'Ba phần tử' },
        { args: [[1, 2, 3, 4, 5], 4], expected: 3, name: 'Không xoay' },
        { args: [[6, 7, 0, 1, 2, 4, 5], 6], expected: 0, name: 'Phần tử đầu' },
      ],
      hints: [
        'Quan sát mấu chốt: với bất kỳ `mid` nào, **ít nhất một trong hai nửa** `[lo..mid]` và `[mid..hi]` là dãy tăng hoàn chỉnh (không chứa điểm xoay).',
        'Cách nhận biết nửa trái đã sắp xếp: `nums[lo] <= nums[mid]`. Khi đó nếu `nums[lo] <= target < nums[mid]` thì target nằm trong nửa trái → `hi = mid - 1`; ngược lại `lo = mid + 1`.',
        'Nếu nửa trái KHÔNG sắp xếp thì nửa phải chắc chắn sắp xếp: kiểm tra `nums[mid] < target <= nums[hi]` → `lo = mid + 1`; ngược lại `hi = mid - 1`. Vẽ ra giấy 2 trường hợp này, đừng học vẹt.',
      ],
      hintsPy: [
        'Quan sát mấu chốt: với bất kỳ `mid` nào, **ít nhất một trong hai nửa** `[lo..mid]` và `[mid..hi]` là dãy tăng hoàn chỉnh (không chứa điểm xoay).',
        'Cách nhận biết nửa trái đã sắp xếp: `nums[lo] <= nums[mid]`. Khi đó nếu `nums[lo] <= target < nums[mid]` thì target nằm trong nửa trái → `hi = mid - 1`; ngược lại `lo = mid + 1`.',
        'Nếu nửa trái KHÔNG sắp xếp thì nửa phải chắc chắn sắp xếp: kiểm tra `nums[mid] < target <= nums[hi]` → `lo = mid + 1`; ngược lại `hi = mid - 1`. Python cho phép viết chuỗi so sánh `a <= x < b` trực tiếp, gọn hơn JS.',
      ],
      diagnostics: [
        { test: 'indexOf\\s*\\(|for\\s*\\([^)]*\\)\\s*\\{?\\s*if\\s*\\([^)]*===\\s*target', message: 'Quét tuyến tính là O(n) — đề yêu cầu O(log n). Hãy khai thác việc luôn có một nửa đã sắp xếp.' },
        { test: 'sort\\s*\\(', message: 'Sắp xếp lại là O(n log n), tệ hơn cả quét tuyến tính về mặt mục tiêu bài học.' },
      ],
      diagnosticsPy: [
        { test: '\\.index\\s*\\(|for\\s+\\w+.*:\\s*\\n\\s*if[\\s\\S]{0,40}==\\s*target', message: 'Quét tuyến tính là O(n) — đề yêu cầu O(log n). Hãy khai thác việc luôn có một nửa đã sắp xếp.' },
        { test: '\\.sort\\s*\\(\\)|sorted\\s*\\(', message: 'Sắp xếp lại là O(n log n), tệ hơn cả quét tuyến tính về mặt mục tiêu bài học.' },
      ],
      approach: `
**Ý tưởng:** mảng xoay = hai đoạn tăng dần nối nhau. Điểm xoay chỉ nằm ở **một** nửa.
Vậy mỗi bước ta: (1) xác định nửa nào "lành lặn"; (2) kiểm tra target có nằm trong nửa lành lặn đó không;
(3) đi vào nửa lành lặn nếu có, ngược lại đi vào nửa còn lại.

\`\`\`
[4, 5, 6, 7, 0, 1, 2]   target = 0
 lo      mid         hi
nums[lo]=4 <= nums[mid]=7  -> nửa TRÁI [4,5,6,7] đã sắp xếp
0 có nằm trong [4,7)? Không -> đi sang phải: lo = mid+1

[0, 1, 2]
 lo mid  hi
nums[lo]=0 <= nums[mid]=1 -> trái sắp xếp, 0 ∈ [0,1)? có -> hi = mid-1
=> tìm thấy tại chỉ số 4 ✔
\`\`\`

**Điểm khiến bài này khó:** bạn phải kiểm tra **hai** điều mỗi bước (nửa nào lành + target ở đâu)
thay vì một. Hãy viết ra 4 nhánh rõ ràng thay vì cố gộp cho ngắn — code rõ ràng sẽ ít lỗi hơn.

**Mở rộng thường bị hỏi thêm:** nếu mảng có **phần tử trùng lặp** thì sao?
Khi \`nums[lo] === nums[mid] === nums[hi]\` ta không xác định được nửa nào lành → phải \`lo++, hi--\`,
worst case suy biến về O(n). Biết điều này sẽ ghi điểm.
`,
      solution: `function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;

    if (nums[lo] <= nums[mid]) {                 // nửa TRÁI đã sắp xếp
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                     // nửa PHẢI đã sắp xếp
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
      solutionPy: `def searchRotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:            # nửa trái đã sắp xếp
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                                 # nửa phải đã sắp xếp
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      complexity: {
        question: 'Nếu mảng xoay CÓ phần tử trùng lặp, độ phức tạp xấu nhất trở thành?',
        options: ['Vẫn O(log n)', 'O(n)', 'O(n log n)', 'O(√n)'],
        answer: 1,
        why: 'Với [2,2,2,0,2,2], khi nums[lo]=nums[mid]=nums[hi] ta không biết nửa nào đã sắp xếp, buộc phải thu hẹp từng bước → O(n). Đây là câu hỏi phụ rất hay gặp.',
      },
      realWorld: 'Tìm kiếm trong buffer vòng (circular buffer) — cấu trúc dùng trong log tuần hoàn, hàng đợi sự kiện, bộ đệm audio, nơi dữ liệu được sắp theo thời gian nhưng có điểm "quấn vòng".',
    },
    {
      id: 'find-min-rotated',
      title: 'Phần tử nhỏ nhất trong mảng xoay',
      en: 'Find Minimum in Rotated Sorted Array',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'findMin',
      statement: `
Mảng đã sắp tăng dần (phần tử phân biệt) bị xoay. Tìm **phần tử nhỏ nhất** trong O(log n).

**Ví dụ**
- \`[3,4,5,1,2]\` → \`1\`
- \`[4,5,6,7,0,1,2]\` → \`0\`
- \`[11,13,15,17]\` → \`11\` (không xoay)
`,
      starter: `function findMin(nums) {\n  \n}`,
      starterPy: `def findMin(nums):\n    \n`,
      tests: [
        { args: [[3, 4, 5, 1, 2]], expected: 1, name: 'Xoay 3 bước' },
        { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0, name: 'Xoay 4 bước' },
        { args: [[11, 13, 15, 17]], expected: 11, name: 'Không xoay' },
        { args: [[2, 1]], expected: 1, name: 'Hai phần tử' },
        { args: [[1]], expected: 1, name: 'Một phần tử' },
        { args: [[5, 1, 2, 3, 4]], expected: 1, name: 'Xoay 1 bước' },
        { args: [[3, 1, 2]], expected: 1, name: 'Min ở giữa' },
      ],
      hints: [
        'Đừng so `nums[mid]` với `nums[lo]`. Hãy so **`nums[mid]` với `nums[hi]`** — đây là mẹo khiến bài trở nên đơn giản bất ngờ.',
        'Nếu `nums[mid] > nums[hi]`: điểm xoay (và giá trị nhỏ nhất) nằm **bên phải** mid → `lo = mid + 1`. Ngược lại, min nằm ở mid hoặc bên trái → `hi = mid`.',
        'Dùng khuôn `while (lo < hi)` với `hi = mid` (không phải `mid - 1`, vì mid có thể chính là đáp án). Kết thúc khi `lo === hi` → trả về `nums[lo]`.',
      ],
      hintsPy: [
        'Đừng so `nums[mid]` với `nums[lo]`. Hãy so **`nums[mid]` với `nums[hi]`** — đây là mẹo khiến bài trở nên đơn giản bất ngờ.',
        'Nếu `nums[mid] > nums[hi]`: điểm xoay (và giá trị nhỏ nhất) nằm **bên phải** mid → `lo = mid + 1`. Ngược lại, min nằm ở mid hoặc bên trái → `hi = mid`.',
        'Dùng khuôn `while lo < hi` với `hi = mid` (không phải `mid - 1`, vì mid có thể chính là đáp án). Kết thúc khi `lo == hi` → trả về `nums[lo]`.',
      ],
      diagnostics: [
        { test: 'Math\\.min\\s*\\(\\s*\\.\\.\\.|\\.sort\\s*\\(', message: '`Math.min(...nums)` hay sort là O(n) / O(n log n). Đề yêu cầu O(log n).' },
        { test: 'hi\\s*=\\s*mid\\s*-\\s*1', message: 'Cẩn thận: `hi = mid - 1` có thể làm mất chính phần tử nhỏ nhất (khi mid đang đứng đúng đáp án). Dùng `hi = mid` với vòng `while (lo < hi)`.' },
      ],
      diagnosticsPy: [
        { test: 'min\\s*\\(\\s*nums\\s*\\)|\\.sort\\s*\\(\\)|sorted\\s*\\(', message: '`min(nums)` hay sort là O(n) / O(n log n). Đề yêu cầu O(log n).' },
        { test: 'hi\\s*=\\s*mid\\s*-\\s*1', message: 'Cẩn thận: `hi = mid - 1` có thể làm mất chính phần tử nhỏ nhất (khi mid đang đứng đúng đáp án). Dùng `hi = mid` với vòng `while lo < hi`.' },
      ],
      approach: `
**Vì sao so với \`nums[hi]\` mà không phải \`nums[lo]\`?**

Đây là bài học tinh tế đáng nhớ. Ta cần một vị từ **đơn điệu**.
Xét \`check(i) = (nums[i] <= nums[n-1])\` — "phần tử i thuộc đoạn tăng thứ hai":

\`\`\`
[4, 5, 6, 7, 0, 1, 2]
 F  F  F  F  T  T  T     <- đúng dạng F...F T...T
\`\`\`

Đáp án chính là **điểm chuyển F→T đầu tiên**. Áp thẳng khuôn mẫu ở phần lý thuyết.

Nếu so với \`nums[lo]\` thì vị từ **không đơn điệu** khi mảng không bị xoay
(\`[11,13,15,17]\`: mọi phần tử đều ≥ nums[lo]) → phải xử lý thêm trường hợp đặc biệt.
Chọn đúng vị từ giúp code ngắn và ít lỗi hơn — đó là kỹ năng thật sự của binary search.

\`\`\`
[4,5,6,7,0,1,2]
lo=0 hi=6 mid=3: 7 > 2 -> min ở phải, lo=4
lo=4 hi=6 mid=5: 1 <= 2 -> min ở mid hoặc trái, hi=5
lo=4 hi=5 mid=4: 0 <= 2 -> hi=4
lo===hi=4 -> nums[4]=0 ✔
\`\`\`
`,
      solution: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] > nums[hi]) lo = mid + 1;   // điểm xoay ở bên phải mid
    else hi = mid;                            // mid có thể LÀ đáp án -> giữ lại
  }
  return nums[lo];
}`,
      solutionPy: `def findMin(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]`,
      complexity: {
        question: 'Vì sao dùng `hi = mid` thay vì `hi = mid - 1` trong bài này?',
        options: [
          'Để vòng lặp chạy nhanh hơn',
          'Vì nums[mid] có thể chính là phần tử nhỏ nhất, loại nó đi sẽ mất đáp án',
          'Vì mảng bị xoay nên chỉ số bị lệch 1',
          'Không có lý do, cả hai đều đúng',
        ],
        answer: 1,
        why: 'Quy tắc tổng quát: khi mid CÓ THỂ là đáp án, hãy giữ nó (`hi = mid`) và dùng điều kiện `lo < hi`. Khi mid CHẮC CHẮN không phải, hãy loại (`hi = mid - 1`).',
      },
      realWorld: 'Tìm điểm "quấn vòng" trong dữ liệu tuần hoàn: xác định vị trí bắt đầu ghi đè trong log tròn, hay mốc reset của bộ đếm phần cứng.',
    },
    {
      id: 'koko-bananas',
      title: 'Koko ăn chuối (tìm nhị phân trên đáp án)',
      en: 'Koko Eating Bananas',
      difficulty: 'Medium',
      targetMinutes: 25,
      entry: 'minEatingSpeed',
      statement: `
Có \`piles\` đống chuối, \`piles[i]\` là số quả trong đống i. Koko chọn tốc độ \`k\` quả/giờ.
Mỗi giờ cô chọn **một** đống và ăn \`k\` quả; nếu đống còn ít hơn k thì ăn hết và **nghỉ phần giờ còn lại**
(tức mỗi đống tốn \`ceil(piles[i] / k)\` giờ).

Tìm **tốc độ k nhỏ nhất** để ăn hết trong \`h\` giờ.

**Ví dụ**
- \`piles = [3,6,7,11], h = 8\` → \`4\`
- \`piles = [30,11,23,4,20], h = 5\` → \`30\`
- \`piles = [30,11,23,4,20], h = 6\` → \`23\`
`,
      starter: `function minEatingSpeed(piles, h) {\n  \n}`,
      starterPy: `def minEatingSpeed(piles, h):\n    \n`,
      tests: [
        { args: [[3, 6, 7, 11], 8], expected: 4, name: 'Ví dụ 1' },
        { args: [[30, 11, 23, 4, 20], 5], expected: 30, name: 'h = số đống → phải ăn nhanh nhất' },
        { args: [[30, 11, 23, 4, 20], 6], expected: 23, name: 'Ví dụ 3' },
        { args: [[1, 1, 1, 1], 4], expected: 1, name: 'Tốc độ nhỏ nhất' },
        { args: [[312884470], 968709470], expected: 1, name: 'h rất lớn' },
        { args: [[1000000000], 2], expected: 500000000, name: 'Số lớn — không được duyệt tuyến tính' },
      ],
      hints: [
        'Đây KHÔNG phải bài tìm kiếm trên mảng `piles`. Hãy tìm nhị phân trên **không gian đáp án**: k nằm trong khoảng [1, max(piles)].',
        'Viết hàm `hours(k)` = tổng `Math.ceil(p / k)` cho mọi đống. Nhận xét then chốt: k càng lớn thì `hours(k)` càng nhỏ → vị từ `hours(k) <= h` có dạng F F F **T T T**.',
        'Áp khuôn "tìm chỉ số nhỏ nhất thoả điều kiện": `lo=1, hi=max(piles)`; `while (lo < hi) { mid; if (hours(mid) <= h) hi = mid; else lo = mid + 1; }` → trả về `lo`. Test `[1000000000], h=2` sẽ đánh trượt mọi lời giải duyệt k từ 1.',
      ],
      hintsPy: [
        'Đây KHÔNG phải bài tìm kiếm trên list `piles`. Hãy tìm nhị phân trên **không gian đáp án**: k nằm trong khoảng [1, max(piles)].',
        'Viết hàm `hours(k)` = tổng `math.ceil(p / k)` cho mọi đống (`import math`). Nhận xét then chốt: k càng lớn thì `hours(k)` càng nhỏ → vị từ `hours(k) <= h` có dạng F F F **T T T**.',
        'Áp khuôn "tìm chỉ số nhỏ nhất thoả điều kiện": `lo, hi = 1, max(piles)`; `while lo < hi: mid = ...; if hours(mid) <= h: hi = mid; else: lo = mid + 1` → trả về `lo`. Test `[1000000000], h=2` sẽ đánh trượt mọi lời giải duyệt k từ 1.',
      ],
      diagnostics: [
        { test: 'for\\s*\\(\\s*(let|var)\\s+k\\s*=\\s*1', message: 'Duyệt k từ 1 tăng dần là O(max(piles) · n) — test với đống 1 tỷ quả sẽ hết giờ. Hãy tìm nhị phân trên k.' },
        { test: 'Math\\.floor\\s*\\([^)]*\\/', message: 'Số giờ cho một đống là `Math.ceil(p / k)` chứ không phải floor — ăn dư một phần giờ vẫn tính trọn giờ.' },
      ],
      diagnosticsPy: [
        { test: 'for\\s+k\\s+in\\s+range\\s*\\(\\s*1', message: 'Duyệt k từ 1 tăng dần là O(max(piles) · n) — test với đống 1 tỷ quả sẽ hết giờ. Hãy tìm nhị phân trên k.' },
        { test: '\\/\\/', message: 'Số giờ cho một đống là `math.ceil(p / k)` chứ không phải floor division `//` — ăn dư một phần giờ vẫn tính trọn giờ.' },
      ],
      approach: `
**Đây là bài quan trọng nhất của chủ đề.** Nó dạy bạn rằng binary search không cần mảng.

**Ba bước chuẩn của "binary search on answer":**

1. **Khoảng đáp án**: k nhỏ nhất có thể là 1; lớn nhất hợp lý là \`max(piles)\`
   (nhanh hơn nữa cũng không giúp gì vì mỗi giờ chỉ ăn được một đống).
2. **Hàm kiểm tra**: \`hours(k) = Σ ceil(piles[i] / k)\`, tính trong O(n).
3. **Chứng minh đơn điệu**: nếu \`k1 < k2\` thì \`ceil(p/k1) >= ceil(p/k2)\` với mọi p
   → \`hours(k1) >= hours(k2)\`. Vậy tập các k thoả \`hours(k) <= h\` là một **tia** [k*, ∞).
   Ta cần đầu mút trái của tia đó.

\`\`\`
piles=[3,6,7,11], h=8
k=1 -> 3+6+7+11 = 27 giờ   F
k=2 -> 2+3+4+6  = 15       F
k=3 -> 1+2+3+4  = 10       F
k=4 -> 1+2+2+3  = 8        T  <- đáp án
k=5 -> 1+2+2+3  = 8        T
\`\`\`

**Nhận diện lớp bài này trong đề thi:** "tốc độ tối thiểu", "công suất tối thiểu",
"số ngày ít nhất", "chia mảng thành k phần sao cho tổng lớn nhất là nhỏ nhất"
— tất cả đều là minimax và đều giải bằng binary search on answer.
Độ phức tạp luôn có dạng **O(n · log(khoảng đáp án))**.
`,
      solution: `function minEatingSpeed(piles, h) {
  const hours = (k) => {
    let t = 0;
    for (const p of piles) t += Math.ceil(p / k);
    return t;
  };

  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {                       // tìm k NHỎ NHẤT thoả hours(k) <= h
    const mid = lo + Math.floor((hi - lo) / 2);
    if (hours(mid) <= h) hi = mid;        // mid khả thi -> giữ lại
    else lo = mid + 1;                    // mid quá chậm -> loại
  }
  return lo;
}`,
      solutionPy: `import math

def minEatingSpeed(piles, h):
    def hours(k):
        return sum(math.ceil(p / k) for p in piles)

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if hours(mid) <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
      complexity: {
        question: 'Độ phức tạp của binary search on answer ở bài này?',
        options: ['O(n)', 'O(n log n)', 'O(n · log(max(piles)))', 'O(max(piles) · n)'],
        answer: 2,
        why: 'Mỗi lần kiểm tra tốn O(n); số lần kiểm tra là log của KHOẢNG ĐÁP ÁN (không phải log n). Với max = 10⁹ thì chỉ khoảng 30 vòng lặp.',
      },
      realWorld: 'Định cỡ hạ tầng: "cần tối thiểu bao nhiêu worker để xử lý hết hàng đợi trong 4 giờ?" — mô phỏng được thời gian với X worker, và hàm đó đơn điệu → binary search. Đây là mẫu dùng thật trong capacity planning.',
    },
  ],
},

/* ==================================================================== */
{
  id: 'linked-list',
  name: 'Danh sách liên kết',
  en: 'Linked List',
  icon: '🔗',
  days: [11, 12],
  summary: 'Con trỏ và bất biến: khi bạn vẽ được sơ đồ mũi tên, code tự viết ra.',
  lesson: `
## 1. Vấn đề gốc

Mảng có nhược điểm chí mạng: **chèn/xoá ở giữa tốn O(n)** vì phải dịch chuyển toàn bộ phần đuôi.
Danh sách liên kết đổi lại: chèn/xoá tại một nút đã biết chỉ tốn **O(1)** — chỉ cần đổi vài mũi tên.
Cái giá phải trả: mất truy cập ngẫu nhiên (muốn tới phần tử thứ k phải đi từ đầu).

| | Mảng | Linked List |
|---|---|---|
| Truy cập phần tử thứ k | O(1) | O(k) |
| Chèn/xoá tại vị trí đã biết | O(n) | **O(1)** |
| Bộ nhớ | liên tục, cache-friendly | rời rạc, mỗi nút tốn thêm con trỏ |

## 2. Ý tưởng cốt lõi

> Làm việc với linked list = **duy trì bất biến trên vài con trỏ**.
> Luôn vẽ sơ đồ trước khi viết code. Người giỏi nhất cũng vẽ.

Ba kỹ thuật giải quyết ~90% bài:

**(a) Nút giả (dummy node)** — xoá bỏ mọi trường hợp đặc biệt ở đầu danh sách:
\`\`\`js
const dummy = new ListNode(0, head);
// ...thao tác...
return dummy.next;      // không cần if (head === null) rải rác
\`\`\`

**(b) Hai con trỏ nhanh/chậm** — tìm giữa, phát hiện chu trình, lấy nút thứ k từ cuối:
\`\`\`js
let slow = head, fast = head;
while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
// slow đang ở giữa danh sách
\`\`\`

**(c) Đảo con trỏ** — mẫu ba biến kinh điển:
\`\`\`js
let prev = null, cur = head;
while (cur) {
  const next = cur.next;   // 1. NHỚ trước khi phá
  cur.next = prev;         // 2. đảo mũi tên
  prev = cur;              // 3. tiến prev
  cur = next;              // 4. tiến cur
}
return prev;               // prev là đầu mới
\`\`\`

## 3. Vì sao rùa & thỏ phát hiện được chu trình?

Nếu có vòng lặp, con trỏ nhanh (2 bước) sẽ vào vòng và **đuổi kịp** con chậm (1 bước).
Mỗi bước, khoảng cách giữa chúng trong vòng giảm đúng 1 → chắc chắn gặp nhau sau tối đa
(độ dài vòng) bước. Nếu không có vòng, con nhanh chạm \`null\` trước. Đây là thuật toán
**Floyd cycle detection** — O(n) thời gian, **O(1) bộ nhớ**, đẹp hơn hẳn cách dùng Set O(n) bộ nhớ.

## 4. Bẫy thường gặp

- **Mất con trỏ**: gán \`cur.next = prev\` trước khi lưu \`next\` → mất phần đuôi vĩnh viễn.
- **Truy cập null**: luôn kiểm tra \`fast && fast.next\` trước khi \`fast.next.next\`.
- **Quên cập nhật head** khi xoá nút đầu → dùng dummy node là hết lo.
- **Tạo vòng lặp vô tình** khi nối sai thứ tự → chương trình treo.

## 5. Ứng dụng thực tế

- **LRU Cache** = HashMap + doubly linked list (bài phỏng vấn hệ thống kinh điển).
- **Quản lý bộ nhớ**: free list của bộ cấp phát; danh sách tiến trình trong kernel.
- **Undo/redo, lịch sử duyệt web**: danh sách liên kết đôi.
- **Blockchain** là một danh sách liên kết mà mỗi nút trỏ ngược bằng hash.
- **Xử lý va chạm hash** bằng chaining: mỗi bucket là một linked list.
`,
  lessonPy: `
## 1. Vấn đề gốc

\`list\` (mảng động) của Python có một nhược điểm chí mạng khi cần **chèn/xoá ở giữa**: vì các phần
tử nằm liên tiếp nhau trong bộ nhớ, chèn một phần tử vào giữa buộc Python phải **dịch chuyển toàn bộ
phần đuôi** sang phải một ô để nhường chỗ — tốn O(n). Thử hình dung một hàng người xếp ghế liền nhau:
muốn chen thêm một người vào giữa hàng, mọi người phía sau phải đứng dậy, dịch sang một ghế.

\`\`\`python
a = [1, 2, 4, 5]
a.insert(2, 3)     # chèn giá trị 3 vào chỉ số 2 -> [1, 2, 3, 4, 5]
# Python phải dịch chuyển 4 và 5 sang phải một ô để có chỗ trống cho 3 — đây là chi phí O(n) ẩn
# đằng sau một lệnh trông rất đơn giản.
\`\`\`

**Danh sách liên kết (linked list)** giải quyết đúng vấn đề này bằng cách từ bỏ tính liên tục: mỗi
phần tử ("nút") nằm ở một vị trí bộ nhớ bất kỳ, và chỉ giữ một **con trỏ** trỏ tới nút tiếp theo. Chèn
một nút mới chỉ cần đổi vài con trỏ \`.next\` — không phải dịch chuyển bất cứ ai — nên chỉ tốn **O(1)**
nếu bạn đã có sẵn tham chiếu tới vị trí cần chèn. Cái giá phải trả: mất khả năng "nhảy thẳng" tới
phần tử thứ k — muốn tới đó phải đi bộ từ đầu, ghé qua từng nút một, tốn O(k).

| | list (array) | Linked List |
|---|---|---|
| Truy cập phần tử thứ k | O(1) | O(k) |
| Chèn/xoá tại vị trí ĐÃ CÓ con trỏ tới | O(n) | **O(1)** |
| Bộ nhớ | liên tục, cache-friendly | rời rạc, mỗi nút tốn thêm bộ nhớ cho con trỏ |

## 2. Ý tưởng cốt lõi

> Làm việc với linked list = **duy trì đúng bất biến trên một vài con trỏ**, từng bước một.
> Luôn vẽ sơ đồ mũi tên ra giấy trước khi viết code — người giải giỏi nhất cũng vẽ, đây không phải
> việc "dành cho người mới".

Trong Python, một nút thường là một class rất đơn giản, chỉ giữ giá trị và con trỏ tới nút kế:

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val    # dữ liệu của nút
        self.next = next   # con trỏ tới nút TIẾP THEO, hoặc None nếu đây là nút cuối
\`\`\`
(Trong bài tập, lớp \`ListNode\` đã có sẵn — không cần tự định nghĩa lại, chỉ cần biết nó có hai
thuộc tính \`.val\` và \`.next\`.)

## 3. Cấu trúc & hàm Python thường dùng trong chủ đề này

| Tên | Vai trò | Ví dụ dùng nhanh |
|---|---|---|
| \`node.val\` / \`node.next\` | Đọc giá trị / con trỏ kế tiếp của một nút | \`print(node.val); node = node.next\` |
| \`ListNode(v, n)\` | Tạo một nút mới với giá trị \`v\` và con trỏ kế \`n\` | \`dummy = ListNode(0, head)\` |
| \`x is None\` / \`x is not None\` | Kiểm tra con trỏ có trỏ tới "không có gì" hay không — dùng liên tục để tránh truy cập lỗi | \`while node is not None: ...\` |
| \`a, b = b, a\` | Gán song song — hữu ích khi cần đổi nhiều con trỏ "cùng lúc" mà không ghi đè nhầm | dùng cẩn trọng, xem bẫy ở mục 6 |
| \`slow, fast = head, head\` | Khởi tạo hai con trỏ cùng xuất phát từ một điểm trong một dòng | mở đầu kỹ thuật rùa & thỏ |
| \`node1 is node2\` | So sánh **định danh** — kiểm tra hai biến có trỏ tới CÙNG một nút vật lý hay không (khác \`==\`) | \`if slow is fast: co_chu_trinh = True\` |

## 4. Ba kỹ thuật giải quyết phần lớn bài trong chủ đề này

**(a) Nút giả (dummy node)** — xoá bỏ mọi trường hợp đặc biệt khi thao tác xảy ra ngay tại đầu danh
sách (ví dụ: xoá nút đầu tiên nghĩa là phải đổi luôn biến \`head\`, dễ quên xử lý riêng):

\`\`\`python
def xoa_gia_tri(head, val):
    dummy = ListNode(0, head)   # dummy đứng TRƯỚC head thật, dummy.next luôn trỏ đúng "đầu hiện tại"
    cur = dummy
    while cur.next:
        if cur.next.val == val:
            cur.next = cur.next.next   # nhảy qua nút cần xoá — kể cả khi đó là head ban đầu
        else:
            cur = cur.next
    return dummy.next    # không cần viết riêng nhánh "nếu head bị xoá thì..."
\`\`\`

**(b) Hai con trỏ nhanh/chậm** — tìm nút giữa, phát hiện chu trình, lấy nút thứ k từ cuối:

\`\`\`python
def tim_nut_giua(head):
    slow = fast = head          # cả hai cùng bắt đầu ở head
    while fast and fast.next:    # fast còn ĐỦ CHỖ để đi 2 bước
        slow = slow.next          # slow đi 1 bước
        fast = fast.next.next      # fast đi 2 bước -> khi fast tới cuối, slow mới đi được nửa đường
    return slow                    # slow đang đứng đúng ở giữa danh sách
\`\`\`

**(c) Đảo con trỏ** — mẫu ba biến kinh điển, xuất hiện trong rất nhiều bài biến đổi danh sách:

\`\`\`python
def dao_nguoc(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next     # BƯỚC 1 — bắt buộc: nhớ nút tiếp theo TRƯỚC KHI phá mũi tên của cur
        cur.next = prev    # BƯỚC 2 — đảo mũi tên: cur giờ trỏ NGƯỢC về nút trước nó
        prev = cur         # BƯỚC 3 — tiến prev lên, chuẩn bị cho vòng lặp kế
        cur = nxt           # BƯỚC 4 — tiến cur lên (dùng giá trị đã lưu ở bước 1, không bị mất)
    return prev              # khi cur == None, prev đang đứng ở nút CUỐI CÙNG của danh sách gốc — đó là đầu mới
\`\`\`

Chạy tay với \`1 -> 2 -> 3 -> None\`: vòng 1 biến \`1 -> None\` (prev=1, cur=2); vòng 2 biến
\`2 -> 1\` (prev=2, cur=3); vòng 3 biến \`3 -> 2\` (prev=3, cur=None) — kết quả \`3 -> 2 -> 1 -> None\`,
trả về \`prev = 3\` làm đầu danh sách mới.

## 5. Vì sao rùa & thỏ phát hiện được chu trình?

Nếu danh sách có vòng lặp, con trỏ nhanh (đi 2 bước mỗi lượt) sẽ đi vào vòng và dần dần **đuổi kịp**
con trỏ chậm (đi 1 bước mỗi lượt) — vì mỗi lượt, khoảng cách giữa chúng bên trong vòng giảm đúng 1.
Do đó chúng chắc chắn gặp nhau sau tối đa (độ dài của vòng) bước. Nếu danh sách KHÔNG có vòng, con
trỏ nhanh sẽ chạm tới \`None\` trước khi kịp gặp con chậm. Đây chính là thuật toán **Floyd cycle
detection** — chạy trong O(n) thời gian và chỉ tốn **O(1) bộ nhớ**, đẹp hơn hẳn cách thay thế là dùng
một \`set\` để ghi nhớ "đã ghé qua nút nào chưa" (cách đó đúng nhưng tốn O(n) bộ nhớ).

## 6. Bẫy thường gặp

- **Mất con trỏ**: gán \`cur.next = prev\` TRƯỚC khi lưu \`nxt = cur.next\` → phần đuôi phía sau \`cur\`
  bị mất vĩnh viễn, không còn cách nào lấy lại (không giống \`list\` nơi dữ liệu vẫn còn trong bộ nhớ).
- **Truy cập thuộc tính trên \`None\`**: luôn kiểm tra \`fast and fast.next\` (theo đúng thứ tự này,
  nhờ short-circuit của \`and\`) trước khi viết \`fast.next.next\` — viết ngược thứ tự hoặc bỏ qua kiểm
  tra sẽ gây \`AttributeError: 'NoneType' object has no attribute 'next'\`.
- **Quên cập nhật \`head\`** khi xoá đúng nút đầu tiên → dùng dummy node (mục 4a) để không phải nhớ xử
  lý riêng trường hợp này.
- **Tạo vòng lặp vô tình** khi nối con trỏ sai thứ tự → chương trình chạy mãi không dừng (và khi chấm
  bằng Pyodide trong trình duyệt sẽ bị timeout, không có traceback rõ ràng để debug).
- **So sánh bằng \`is\` chứ không \`==\`** khi kiểm tra hai biến có đang trỏ tới cùng một nút vật lý hay
  không (ví dụ phát hiện chu trình: \`slow is fast\`, không phải \`slow == fast\` — dù \`ListNode\` mặc
  định không tự định nghĩa \`__eq__\` nên \`==\` ở đây tình cờ cũng hoạt động giống \`is\`, dùng \`is\` vẫn
  rõ ý định hơn và an toàn hơn nếu sau này lớp \`ListNode\` được định nghĩa lại \`__eq__\`).

## 7. Ứng dụng thực tế

- **LRU Cache** = dict (hash map) + doubly linked list (bài phỏng vấn hệ thống kinh điển,
  cũng chính là cách \`functools.lru_cache\` của Python được cài đặt bên trong CPython).
- **Quản lý bộ nhớ**: free list của bộ cấp phát; danh sách tiến trình trong kernel.
- **Undo/redo, lịch sử duyệt web**: danh sách liên kết đôi.
- **Blockchain** là một danh sách liên kết mà mỗi nút trỏ ngược bằng hash.
- **Xử lý va chạm hash** bằng chaining: mỗi bucket là một linked list (bên trong \`dict\` của CPython
  không dùng chaining mà dùng open addressing, nhưng nhiều cài đặt hash table khác thì có).
`,
  quiz: [
    {
      q: 'Vì sao dùng "nút giả" (dummy node) lại giúp code ngắn và ít lỗi hơn?',
      options: [
        'Vì tiết kiệm bộ nhớ',
        'Vì nó loại bỏ trường hợp đặc biệt "thao tác trên nút đầu" — mọi nút thật đều có nút đứng trước',
        'Vì làm thuật toán chạy nhanh hơn',
        'Vì bắt buộc trong JavaScript',
      ],
      answer: 1,
      why: 'Phần lớn lỗi trong bài linked list nằm ở việc xử lý head. Dummy node biến head thành một nút bình thường → không cần rẽ nhánh đặc biệt.',
    },
    {
      q: 'Trong thuật toán rùa-thỏ, vì sao thỏ (2 bước) chắc chắn gặp rùa (1 bước) nếu có chu trình?',
      options: [
        'Vì thỏ nhanh gấp đôi nên luôn về đích trước',
        'Vì khi cả hai đã vào vòng, khoảng cách giữa chúng giảm đúng 1 sau mỗi bước nên sẽ về 0',
        'Vì chu trình luôn có độ dài chẵn',
        'Vì thỏ đi qua tất cả các nút',
      ],
      answer: 1,
      why: 'Đây là lập luận cốt lõi. Vận tốc tương đối = 2-1 = 1, nên khoảng cách trong vòng giảm dần đều và không thể "nhảy qua" nhau.',
    },
    {
      q: 'Trong mẫu đảo danh sách, vì sao BẮT BUỘC lưu `next = cur.next` trước khi gán `cur.next = prev`?',
      options: [
        'Để code dễ đọc hơn',
        'Vì sau khi gán, con trỏ tới phần đuôi danh sách bị mất vĩnh viễn',
        'Vì JavaScript không cho phép gán trực tiếp',
        'Để tránh rò rỉ bộ nhớ',
      ],
      answer: 1,
      why: 'Mũi tên `cur -> next` là ĐƯỜNG DUY NHẤT tới phần còn lại. Ghi đè nó mà chưa lưu = mất dữ liệu. Đây là lỗi phổ biến nhất khi làm linked list.',
    },
    {
      q: 'Cấu trúc nào phù hợp nhất để cài LRU Cache với get/put trong O(1)?',
      options: [
        'Mảng + tìm kiếm nhị phân',
        'HashMap kết hợp danh sách liên kết đôi',
        'Cây tìm kiếm nhị phân cân bằng',
        'Hai ngăn xếp',
      ],
      answer: 1,
      why: 'HashMap cho tra cứu O(1); danh sách liên kết đôi cho phép tách và chuyển một nút lên đầu trong O(1). Không cấu trúc đơn lẻ nào làm được cả hai — đây là bài học về kết hợp cấu trúc dữ liệu.',
    },
  ],
  quizPy: [
    {
      q: 'Vì sao dùng "nút giả" (dummy node) lại giúp code ngắn và ít lỗi hơn?',
      options: [
        'Vì tiết kiệm bộ nhớ',
        'Vì nó loại bỏ trường hợp đặc biệt "thao tác trên nút đầu" — mọi nút thật đều có nút đứng trước',
        'Vì làm thuật toán chạy nhanh hơn',
        'Vì bắt buộc trong Python',
      ],
      answer: 1,
      why: 'Phần lớn lỗi trong bài linked list nằm ở việc xử lý head. Dummy node biến head thành một nút bình thường → không cần rẽ nhánh đặc biệt.',
    },
    {
      q: 'Trong thuật toán rùa-thỏ, vì sao thỏ (2 bước) chắc chắn gặp rùa (1 bước) nếu có chu trình?',
      options: [
        'Vì thỏ nhanh gấp đôi nên luôn về đích trước',
        'Vì khi cả hai đã vào vòng, khoảng cách giữa chúng giảm đúng 1 sau mỗi bước nên sẽ về 0',
        'Vì chu trình luôn có độ dài chẵn',
        'Vì thỏ đi qua tất cả các nút',
      ],
      answer: 1,
      why: 'Đây là lập luận cốt lõi. Vận tốc tương đối = 2-1 = 1, nên khoảng cách trong vòng giảm dần đều và không thể "nhảy qua" nhau.',
    },
    {
      q: 'Trong mẫu đảo danh sách, vì sao BẮT BUỘC lưu `nxt = cur.next` trước khi gán `cur.next = prev`?',
      options: [
        'Để code dễ đọc hơn',
        'Vì sau khi gán, con trỏ tới phần đuôi danh sách bị mất vĩnh viễn',
        'Vì Python không cho phép gán trực tiếp',
        'Để tránh rò rỉ bộ nhớ',
      ],
      answer: 1,
      why: 'Thuộc tính `cur.next` là ĐƯỜNG DUY NHẤT tới phần còn lại. Ghi đè nó mà chưa lưu = mất dữ liệu. Đây là lỗi phổ biến nhất khi làm linked list.',
    },
    {
      q: 'Cấu trúc nào phù hợp nhất để cài LRU Cache với get/put trong O(1)?',
      options: [
        'List + tìm kiếm nhị phân',
        'dict kết hợp danh sách liên kết đôi',
        'Cây tìm kiếm nhị phân cân bằng',
        'Hai ngăn xếp',
      ],
      answer: 1,
      why: 'dict cho tra cứu O(1); danh sách liên kết đôi cho phép tách và chuyển một nút lên đầu trong O(1). Không cấu trúc đơn lẻ nào làm được cả hai — bản thân `functools.lru_cache` trong CPython dùng đúng tổ hợp này.',
    },
  ],
  problems: [
    {
      id: 'reverse-linked-list',
      title: 'Đảo ngược danh sách liên kết',
      en: 'Reverse Linked List',
      difficulty: 'Easy',
      targetMinutes: 12,
      entry: 'reverseList',
      statement: `
Cho \`head\` của một danh sách liên kết đơn, hãy đảo ngược nó và trả về đầu mới.

**Ví dụ**
- \`[1,2,3,4,5]\` → \`[5,4,3,2,1]\`
- \`[]\` → \`[]\`

Lớp \`ListNode\` đã có sẵn: \`new ListNode(val, next)\` với thuộc tính \`.val\` và \`.next\`.
Hệ thống chấm sẽ tự chuyển mảng thành danh sách và ngược lại.
`,
      starter: `function reverseList(head) {\n  // head là một ListNode (hoặc null)\n  \n}`,
      starterPy: `def reverseList(head):\n    # head la mot ListNode (hoac None)\n    \n`,
      harnessSrc: `(fn, args) => listToArray(fn(buildList(args[0])))`,
      harnessSrcPy: `lambda fn, args, t: listToArray(fn(buildList(args[0])))`,
      tests: [
        { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], name: 'Năm phần tử' },
        { args: [[1, 2]], expected: [2, 1], name: 'Hai phần tử' },
        { args: [[]], expected: [], name: 'Danh sách rỗng' },
        { args: [[7]], expected: [7], name: 'Một phần tử' },
        { args: [[1, 1, 2]], expected: [2, 1, 1], name: 'Có giá trị trùng' },
      ],
      hints: [
        'Vẽ ra giấy: `null <- 1 <- 2  3 -> 4 -> 5`. Bạn cần ba con trỏ: `prev` (phần đã đảo), `cur` (đang xử lý), `next` (phần chưa đụng tới).',
        'Thứ tự bốn dòng lệnh là bất di bất dịch: (1) `next = cur.next`; (2) `cur.next = prev`; (3) `prev = cur`; (4) `cur = next`.',
        'Khi vòng lặp kết thúc, `cur === null` và `prev` chính là đầu danh sách mới. Đừng trả về `head` — nó đã trở thành đuôi rồi!',
      ],
      hintsPy: [
        'Vẽ ra giấy: `None <- 1 <- 2  3 -> 4 -> 5`. Bạn cần ba con trỏ: `prev` (phần đã đảo), `cur` (đang xử lý), `nxt` (phần chưa đụng tới).',
        'Thứ tự bốn dòng lệnh là bất di bất dịch: (1) `nxt = cur.next`; (2) `cur.next = prev`; (3) `prev = cur`; (4) `cur = nxt`.',
        'Khi vòng lặp kết thúc, `cur is None` và `prev` chính là đầu danh sách mới. Đừng trả về `head` — nó đã trở thành đuôi rồi!',
      ],
      diagnostics: [
        { test: 'return\\s+head\\s*;?\\s*\\}?\\s*$', message: 'Sau khi đảo, `head` trở thành nút CUỐI. Bạn cần trả về `prev`.' },
        { test: 'push|\\[\\]|Array', message: 'Chép giá trị ra mảng rồi tạo danh sách mới thì chạy đúng nhưng tốn O(n) bộ nhớ và né tránh mục tiêu bài học. Hãy đảo con trỏ tại chỗ với O(1) bộ nhớ.' },
      ],
      diagnosticsPy: [
        { test: 'return\\s+head\\s*$', message: 'Sau khi đảo, `head` trở thành nút CUỐI. Bạn cần trả về `prev`.' },
        { test: '\\.append\\s*\\(|^\\s*\\[\\]', message: 'Chép giá trị ra list rồi tạo danh sách mới thì chạy đúng nhưng tốn O(n) bộ nhớ và né tránh mục tiêu bài học. Hãy đảo con trỏ tại chỗ với O(1) bộ nhớ.' },
      ],
      approach: `
**Bất biến (viết ra trước khi code):**
> Tại mọi thời điểm, \`prev\` là đầu của phần **đã đảo xong**, \`cur\` là đầu của phần **chưa xử lý**.

\`\`\`
Ban đầu:  prev=null   cur=1 -> 2 -> 3 -> null

Bước 1:   null <- 1        cur=2 -> 3
Bước 2:   null <- 1 <- 2   cur=3
Bước 3:   null <- 1 <- 2 <- 3   cur=null  -> trả về prev = 3
\`\`\`

**Bản đệ quy** (nên biết, hay bị hỏi):
\`\`\`js
function reverseList(head) {
  if (!head || !head.next) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;    // nút sau quay lại trỏ về mình
  head.next = null;         // cắt mũi tên cũ
  return newHead;
}
\`\`\`
Đẹp nhưng tốn **O(n) bộ nhớ ngăn xếp** và có nguy cơ tràn stack với danh sách 100.000 nút.
Trong phỏng vấn, hãy nêu cả hai và nói rõ đánh đổi này — đó là điều người phỏng vấn muốn nghe.
`,
      solution: `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;   // 1. nhớ phần đuôi TRƯỚC khi phá mũi tên
    cur.next = prev;         // 2. đảo hướng
    prev = cur;              // 3. tiến prev
    cur = next;              // 4. tiến cur
  }
  return prev;               // prev là đầu mới
}`,
      solutionPy: `def reverseList(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    return prev`,
      complexity: {
        question: 'Bản lặp và bản đệ quy khác nhau ở điểm nào?',
        options: [
          'Bản đệ quy nhanh hơn',
          'Cùng O(n) thời gian, nhưng bản lặp dùng O(1) bộ nhớ còn bản đệ quy dùng O(n) ngăn xếp',
          'Bản đệ quy dùng ít bộ nhớ hơn',
          'Bản lặp không xử lý được danh sách rỗng',
        ],
        answer: 1,
        why: 'Mỗi lời gọi đệ quy chiếm một khung ngăn xếp. Với danh sách 10⁵ nút, bản đệ quy có thể gây stack overflow — một rủi ro thật trong sản phẩm.',
      },
      realWorld: 'Đảo thứ tự một chuỗi xử lý (pipeline) hoặc lịch sử thao tác mà không cấp phát bộ nhớ mới — quan trọng trong hệ thống nhúng nơi RAM rất hạn chế.',
    },
    {
      id: 'merge-two-lists',
      title: 'Trộn hai danh sách đã sắp xếp',
      en: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      targetMinutes: 12,
      entry: 'mergeTwoLists',
      statement: `
Cho hai danh sách liên kết **đã sắp tăng dần**, trộn chúng thành một danh sách đã sắp xếp
bằng cách **nối lại các nút có sẵn** (không tạo nút mới).

**Ví dụ**
- \`[1,2,4]\` và \`[1,3,4]\` → \`[1,1,2,3,4,4]\`
- \`[]\` và \`[0]\` → \`[0]\`
`,
      starter: `function mergeTwoLists(list1, list2) {\n  \n}`,
      starterPy: `def mergeTwoLists(list1, list2):\n    \n`,
      harnessSrc: `(fn, args) => listToArray(fn(buildList(args[0]), buildList(args[1])))`,
      harnessSrcPy: `lambda fn, args, t: listToArray(fn(buildList(args[0]), buildList(args[1])))`,
      tests: [
        { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4], name: 'Ví dụ chuẩn' },
        { args: [[], []], expected: [], name: 'Cả hai rỗng' },
        { args: [[], [0]], expected: [0], name: 'Một danh sách rỗng' },
        { args: [[5], [1, 2, 3]], expected: [1, 2, 3, 5], name: 'Độ dài lệch nhau' },
        { args: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6], name: 'Xen kẽ' },
        { args: [[-9, 3], [5, 7]], expected: [-9, 3, 5, 7], name: 'Số âm' },
      ],
      hints: [
        'Dùng **nút giả**: `const dummy = new ListNode(0); let tail = dummy;`. Nhờ đó bạn không cần xử lý riêng trường hợp chọn phần tử đầu tiên.',
        'Vòng lặp khi cả hai danh sách còn nút: so `list1.val` với `list2.val`, nối nút nhỏ hơn vào `tail.next`, rồi dịch con trỏ tương ứng và dịch `tail`.',
        'Khi một danh sách hết, phần còn lại của danh sách kia **đã sắp xếp sẵn** → chỉ cần `tail.next = list1 or list2`. Cuối cùng trả về `dummy.next`.',
      ],
      hintsPy: [
        'Dùng **nút giả**: `dummy = ListNode(0); tail = dummy`. Nhờ đó bạn không cần xử lý riêng trường hợp chọn phần tử đầu tiên.',
        'Vòng lặp khi cả hai danh sách còn nút: so `list1.val` với `list2.val`, nối nút nhỏ hơn vào `tail.next`, rồi dịch con trỏ tương ứng và dịch `tail`.',
        'Khi một danh sách hết, phần còn lại của danh sách kia **đã sắp xếp sẵn** → chỉ cần `tail.next = list1 or list2`. Cuối cùng trả về `dummy.next`.',
      ],
      diagnostics: [
        { test: 'sort\\s*\\(', message: 'Đổ ra mảng rồi sort là O((n+m) log(n+m)) và tốn bộ nhớ. Hai danh sách đã sắp xếp — chỉ cần trộn tuyến tính O(n+m).' },
        { test: 'new ListNode\\([\\s\\S]{0,40}\\.val', message: 'Đề yêu cầu nối lại các nút CÓ SẴN. Tạo nút mới cho từng giá trị làm tăng bộ nhớ không cần thiết (dù vẫn qua test).' },
      ],
      diagnosticsPy: [
        { test: '\\.sort\\s*\\(\\)|sorted\\s*\\(', message: 'Đổ ra list rồi sort là O((n+m) log(n+m)) và tốn bộ nhớ. Hai danh sách đã sắp xếp — chỉ cần trộn tuyến tính O(n+m).' },
        { test: 'ListNode\\([\\s\\S]{0,40}\\.val', message: 'Đề yêu cầu nối lại các nút CÓ SẴN. Tạo nút mới cho từng giá trị làm tăng bộ nhớ không cần thiết (dù vẫn qua test).' },
      ],
      approach: `
Đây chính là bước "merge" trong **merge sort** — thuật toán nền tảng của việc sắp xếp dữ liệu lớn hơn RAM.

\`\`\`
l1: 1 -> 2 -> 4
l2: 1 -> 3 -> 4
dummy -> 1(l2) -> 1(l1) -> 2 -> 3 -> 4 -> 4
\`\`\`

**Vì sao dummy node quan trọng?** Không có nó, bạn phải viết:
\`\`\`js
let head;
if (!list1) head = list2; else if (!list2) head = list1;
else if (list1.val <= list2.val) { head = list1; list1 = list1.next; }
else { head = list2; list2 = list2.next; }
let tail = head;  // rồi mới bắt đầu vòng lặp...
\`\`\`
Dài gấp ba và dễ sai. Dummy node xoá sạch mớ đó — hãy tạo thói quen dùng nó.

**Mở rộng:** trộn **k** danh sách? Dùng heap nhỏ nhất kích thước k → O(N log k).
Bạn sẽ gặp lại ở chủ đề Heap.
`,
      solution: `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let tail = dummy;

  while (list1 && list2) {
    if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
    else { tail.next = list2; list2 = list2.next; }
    tail = tail.next;
  }
  tail.next = list1 || list2;    // phần đuôi còn lại đã sắp xếp sẵn
  return dummy.next;
}`,
      solutionPy: `def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    tail = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next, list1 = list1, list1.next
        else:
            tail.next, list2 = list2, list2.next
        tail = tail.next
    tail.next = list1 or list2
    return dummy.next`,
      complexity: {
        question: 'Độ phức tạp thời gian và bộ nhớ phụ (không tính danh sách kết quả)?',
        options: ['O(n·m) / O(1)', 'O(n+m) / O(1)', 'O(n+m) / O(n+m)', 'O((n+m) log(n+m)) / O(1)'],
        answer: 1,
        why: 'Mỗi nút được thăm đúng một lần và ta chỉ nối lại con trỏ, không cấp phát thêm (ngoài dummy) → O(n+m) thời gian, O(1) bộ nhớ.',
      },
      realWorld: 'External merge sort: khi dữ liệu lớn hơn RAM, ta chia nhỏ, sắp từng phần, ghi ra đĩa rồi trộn các file đã sắp — chính là hàm này ở quy mô file.',
    },
    {
      id: 'linked-list-cycle',
      title: 'Phát hiện chu trình (rùa & thỏ)',
      en: 'Linked List Cycle',
      difficulty: 'Easy',
      targetMinutes: 12,
      entry: 'hasCycle',
      statement: `
Cho \`head\` của một danh sách liên kết, xác định xem nó có **chu trình** hay không.

Hệ thống chấm nhận tham số \`(mảng_giá_trị, pos)\`: \`pos\` là chỉ số nút mà đuôi trỏ tới
(\`-1\` nghĩa là không có chu trình). Hàm của bạn chỉ nhận \`head\`.

**Thử thách:** giải với **O(1) bộ nhớ**.

**Ví dụ**
- \`[3,2,0,-4], pos = 1\` → \`true\`
- \`[1,2], pos = -1\` → \`false\`
`,
      starter: `function hasCycle(head) {\n  \n}`,
      starterPy: `def hasCycle(head):\n    \n`,
      harnessSrc: `(fn, args) => {
        const [arr, pos] = args;
        const head = buildList(arr);
        if (head && pos >= 0) {
          let tail = head, k = 0;
          while (tail.next) tail = tail.next;
          let target = head;
          while (k < pos) { target = target.next; k++; }
          tail.next = target;
        }
        return fn(head) === true;
      }`,
      harnessSrcPy: `lambda fn, args, t: fn(buildCycleList(args[0], args[1])) is True`,
      tests: [
        { args: [[3, 2, 0, -4], 1], expected: true, name: 'Có chu trình' },
        { args: [[1, 2], 0], expected: true, name: 'Chu trình về đầu' },
        { args: [[1], -1], expected: false, name: 'Một nút, không chu trình' },
        { args: [[1], 0], expected: true, name: 'Tự trỏ vào chính mình' },
        { args: [[1, 2, 3, 4, 5], -1], expected: false, name: 'Danh sách thường' },
        { args: [[], -1], expected: false, name: 'Rỗng' },
        { args: [[1, 2, 3, 4, 5, 6], 3], expected: true, name: 'Chu trình ở cuối' },
      ],
      hints: [
        'Cách dễ: dùng `Set` lưu các nút đã thăm, gặp lại nút cũ → có chu trình. Đúng, nhưng tốn O(n) bộ nhớ. Đề thách thức O(1).',
        'Ý tưởng rùa & thỏ: cho `slow` đi 1 bước, `fast` đi 2 bước. Nếu có vòng, thỏ sẽ đuổi kịp rùa. Nếu không có vòng, thỏ chạm `null` trước.',
        'Điều kiện vòng lặp phải là `while (fast && fast.next)` — kiểm tra CẢ HAI trước khi làm `fast.next.next`, nếu không sẽ lỗi truy cập null. Kiểm tra `slow === fast` **sau** khi dịch chuyển, nếu không thì ngay bước đầu chúng đã bằng nhau.',
      ],
      hintsPy: [
        'Cách dễ: dùng `set` lưu các nút đã thăm, gặp lại nút cũ → có chu trình. Đúng, nhưng tốn O(n) bộ nhớ. Đề thách thức O(1).',
        'Ý tưởng rùa & thỏ: cho `slow` đi 1 bước, `fast` đi 2 bước. Nếu có vòng, thỏ sẽ đuổi kịp rùa. Nếu không có vòng, thỏ chạm `None` trước.',
        'Điều kiện vòng lặp phải là `while fast and fast.next` — kiểm tra CẢ HAI trước khi làm `fast.next.next`, nếu không sẽ lỗi `AttributeError: NoneType has no attribute next`. Kiểm tra `slow is fast` **sau** khi dịch chuyển, nếu không thì ngay bước đầu chúng đã bằng nhau.',
      ],
      diagnostics: [
        { test: 'new Set|new Map', message: 'Cách dùng Set chạy đúng nhưng tốn O(n) bộ nhớ. Hãy thử lại bằng rùa & thỏ để đạt O(1) — đây là điều người phỏng vấn muốn thấy.' },
        { test: 'fast\\.next\\.next[\\s\\S]{0,80}while\\s*\\(\\s*fast\\s*\\)', message: 'Điều kiện `while (fast)` chưa đủ: `fast.next` có thể là null khi bạn gọi `fast.next.next`. Dùng `while (fast && fast.next)`.' },
      ],
      diagnosticsPy: [
        { test: '\\bset\\s*\\(\\)|=\\s*set\\s*\\(\\)', message: 'Cách dùng set chạy đúng nhưng tốn O(n) bộ nhớ. Hãy thử lại bằng rùa & thỏ để đạt O(1) — đây là điều người phỏng vấn muốn thấy.' },
        { test: 'while\\s+fast\\s*:', message: 'Điều kiện `while fast:` chưa đủ: `fast.next` có thể là `None` khi bạn gọi `fast.next.next`. Dùng `while fast and fast.next:`.' },
      ],
      approach: `
**Thuật toán Floyd (rùa & thỏ)** — một trong những thuật toán đẹp nhất của khoa học máy tính.

**Chứng minh trực giác:** giả sử có vòng độ dài L. Khi cả hai đã ở trong vòng,
xét khoảng cách d từ thỏ tới rùa (theo chiều đi). Mỗi bước:
rùa +1, thỏ +2 → d giảm đúng 1. Vì d là số nguyên không âm nhỏ hơn L,
sau tối đa L bước thì d = 0 → gặp nhau. **Không thể "nhảy qua"** vì d giảm từng đơn vị một.

\`\`\`
3 -> 2 -> 0 -> -4
     ^__________|

slow: 3, 2, 0, -4, 2, 0 ...
fast: 3, 0,  2,  0, ...  -> gặp nhau
\`\`\`

**Câu hỏi tiếp theo (rất hay bị hỏi):** *tìm nút bắt đầu chu trình?*
Sau khi gặp nhau, đặt một con trỏ về \`head\`, giữ con kia ở điểm gặp, rồi cho cả hai đi **1 bước**.
Chúng sẽ gặp nhau đúng tại điểm bắt đầu vòng. Lý do: gọi a = khoảng cách head→đầu vòng,
b = khoảng cách đầu vòng→điểm gặp. Ta chứng minh được a ≡ (L - b) mod L.

Ý tưởng này còn dùng để **tìm số lặp trong mảng** (bài Find the Duplicate Number) —
biến mảng thành đồ thị hàm số rồi tìm chu trình.
`,
      solution: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {       // kiểm tra CẢ HAI trước khi nhảy 2 bước
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true; // so sánh SAU khi dịch chuyển
  }
  return false;                     // thỏ chạm null -> không có vòng
}`,
      solutionPy: `def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
      complexity: {
        question: 'Độ phức tạp thời gian / bộ nhớ của thuật toán Floyd?',
        options: ['O(n) / O(n)', 'O(n) / O(1)', 'O(n²) / O(1)', 'O(n log n) / O(1)'],
        answer: 1,
        why: 'Thỏ đi tối đa ~2n bước; chỉ dùng hai biến con trỏ. Ưu thế O(1) bộ nhớ so với cách dùng Set chính là lý do thuật toán này nổi tiếng.',
      },
      realWorld: 'Phát hiện vòng lặp trong: chuỗi chuyển hướng URL, quan hệ phụ thuộc giữa các module, chuỗi symbolic link trong hệ thống file, và chu kỳ của bộ sinh số giả ngẫu nhiên.',
    },
    {
      id: 'remove-nth-from-end',
      title: 'Xoá nút thứ n từ cuối',
      en: 'Remove Nth Node From End of List',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'removeNthFromEnd',
      statement: `
Cho \`head\` và số \`n\`, xoá nút thứ \`n\` **tính từ cuối** danh sách và trả về đầu danh sách.

**Thử thách:** làm trong **một lượt duyệt duy nhất**.

**Ví dụ**
- \`[1,2,3,4,5], n = 2\` → \`[1,2,3,5]\`
- \`[1], n = 1\` → \`[]\`
- \`[1,2], n = 2\` → \`[2]\` (xoá nút đầu)
`,
      starter: `function removeNthFromEnd(head, n) {\n  \n}`,
      starterPy: `def removeNthFromEnd(head, n):\n    \n`,
      harnessSrc: `(fn, args) => listToArray(fn(buildList(args[0]), args[1]))`,
      harnessSrcPy: `lambda fn, args, t: listToArray(fn(buildList(args[0]), args[1]))`,
      tests: [
        { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5], name: 'Ví dụ chuẩn' },
        { args: [[1], 1], expected: [], name: 'Xoá nút duy nhất' },
        { args: [[1, 2], 1], expected: [1], name: 'Xoá nút cuối' },
        { args: [[1, 2], 2], expected: [2], name: 'Xoá nút ĐẦU (bẫy)' },
        { args: [[1, 2, 3], 3], expected: [2, 3], name: 'Xoá đầu trong danh sách 3 phần tử' },
        { args: [[1, 2, 3, 4, 5], 5], expected: [2, 3, 4, 5], name: 'n = độ dài' },
      ],
      hints: [
        'Vấn đề: bạn không biết độ dài. Cách 2 lượt (đếm rồi xoá) là hợp lệ, nhưng hãy thử làm trong 1 lượt.',
        'Mẹo **khoảng cách cố định**: cho con trỏ `fast` đi trước `n` bước. Sau đó cho cả `fast` và `slow` đi cùng nhau. Khi `fast` chạm cuối, `slow` cách cuối đúng n bước.',
        'Bẫy lớn nhất là xoá **nút đầu** (n = độ dài). Dùng dummy node: `const dummy = new ListNode(0, head); let slow = dummy;` — khi đó `slow` luôn dừng ở nút TRƯỚC nút cần xoá, và bạn trả về `dummy.next`.',
      ],
      hintsPy: [
        'Vấn đề: bạn không biết độ dài. Cách 2 lượt (đếm rồi xoá) là hợp lệ, nhưng hãy thử làm trong 1 lượt.',
        'Mẹo **khoảng cách cố định**: cho con trỏ `fast` đi trước `n` bước. Sau đó cho cả `fast` và `slow` đi cùng nhau. Khi `fast` chạm cuối, `slow` cách cuối đúng n bước.',
        'Bẫy lớn nhất là xoá **nút đầu** (n = độ dài). Dùng dummy node: `dummy = ListNode(0, head); slow = dummy` — khi đó `slow` luôn dừng ở nút TRƯỚC nút cần xoá, và bạn trả về `dummy.next`.',
      ],
      diagnostics: [
        { test: 'length|count\\+\\+[\\s\\S]{0,200}for', message: 'Cách hai lượt (đếm độ dài rồi duyệt lại) chạy đúng. Hãy thử phiên bản một lượt bằng hai con trỏ cách nhau n bước.' },
        { test: 'return\\s+head', message: 'Nếu xoá chính nút đầu, `head` cũ không còn hợp lệ. Dùng dummy node và trả về `dummy.next`.' },
      ],
      diagnosticsPy: [
        { test: 'len\\s*\\(|count\\s*\\+=\\s*1[\\s\\S]{0,200}for', message: 'Cách hai lượt (đếm độ dài rồi duyệt lại) chạy đúng. Hãy thử phiên bản một lượt bằng hai con trỏ cách nhau n bước.' },
        { test: 'return\\s+head\\s*$', message: 'Nếu xoá chính nút đầu, `head` cũ không còn hợp lệ. Dùng dummy node và trả về `dummy.next`.' },
      ],
      approach: `
**Kỹ thuật: hai con trỏ cách nhau một khoảng cố định.**
Đây là biến thể quan trọng của "nhanh/chậm" — thay vì khác *tốc độ*, chúng khác *vị trí xuất phát*.

\`\`\`
n = 2,  danh sách 1->2->3->4->5

dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
 slow                fast              <- fast đi trước n+1 bước tính từ dummy

đi cùng nhau tới khi fast === null:
dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
              slow            fast=null
slow.next = 4 chính là nút cần xoá  ->  slow.next = slow.next.next
\`\`\`

**Vì sao khoảng cách là n+1 chứ không phải n?** Vì ta cần \`slow\` dừng ở nút **trước** nút bị xoá
(muốn xoá X thì phải sửa \`prev.next\`). Dummy node giúp quy tắc này đúng cả khi X là nút đầu.

**Bài học chung:** khi cần biết "vị trí thứ k từ cuối" mà chỉ được đi một chiều,
hãy tạo một **cửa sổ trượt độ dài k** trên danh sách. Đây cũng là ý tưởng đằng sau việc
tìm nút giữa (fast đi gấp đôi) hay chia danh sách thành hai nửa.
`,
      solution: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let slow = dummy, fast = dummy;

  for (let i = 0; i <= n; i++) fast = fast.next;   // fast đi trước n+1 bước

  while (fast) { slow = slow.next; fast = fast.next; }

  slow.next = slow.next.next;    // slow đứng NGAY TRƯỚC nút cần xoá
  return dummy.next;
}`,
      solutionPy: `def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    slow = fast = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow, fast = slow.next, fast.next
    slow.next = slow.next.next
    return dummy.next`,
      complexity: {
        question: 'Cách một lượt duyệt có tốt hơn cách hai lượt về độ phức tạp không?',
        options: [
          'Có, từ O(2n) xuống O(n) nên nhanh gấp đôi về bậc',
          'Không — cả hai đều là O(n); ưu điểm là chỉ cần duyệt dữ liệu một lần, quan trọng khi dữ liệu là luồng (stream)',
          'Có, từ O(n²) xuống O(n)',
          'Không, cách hai lượt luôn nhanh hơn',
        ],
        answer: 1,
        why: 'Về bậc thì giống nhau. Giá trị thật nằm ở chỗ: với dữ liệu dạng luồng (chỉ đọc được một lần, không quay lại), cách hai lượt là bất khả thi. Đây là lý do kỹ thuật này quan trọng trong thực tế.',
      },
      realWorld: 'Giữ "N bản ghi gần nhất" trong luồng dữ liệu bằng cửa sổ trượt độ dài N — dùng trong log rotation, buffer phát lại video, hay giữ N sự kiện cuối để chẩn đoán sự cố.',
    },
  ],
},
];
