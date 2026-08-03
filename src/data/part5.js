/**
 * NHÓM 5 — Tối ưu: 1-D DP, 2-D DP, Greedy
 */

export default [
/* ==================================================================== */
{
  id: 'dp-1d',
  name: 'Quy hoạch động 1 chiều',
  en: '1-D Dynamic Programming',
  icon: '📈',
  days: [23, 24],
  summary: 'Nhớ lại kết quả bài toán con để không tính lại — biến hàm mũ thành tuyến tính.',
  lesson: `
## 1. Vấn đề gốc

Đệ quy tự nhiên thường tính **đi tính lại** cùng một bài toán con.
Ví dụ Fibonacci đệ quy: \`fib(5)\` gọi \`fib(3)\` hai lần, \`fib(2)\` ba lần...
Số lời gọi tăng theo hàm mũ 2ⁿ dù chỉ có n giá trị khác nhau.

**Quy hoạch động = đệ quy + ghi nhớ.** Chỉ vậy thôi.

## 2. Ba câu hỏi để giải MỌI bài DP

Đừng học thuộc lời giải. Hãy tập trả lời ba câu hỏi này — chúng áp dụng cho mọi bài:

1. **Trạng thái là gì?** \`dp[i]\` mang ý nghĩa gì? *(Đây là câu khó nhất. 80% thời gian nằm ở đây.)*
2. **Công thức truy hồi?** \`dp[i]\` tính từ các trạng thái nhỏ hơn thế nào?
3. **Trường hợp cơ sở và thứ tự tính?** Bắt đầu từ đâu, đi theo hướng nào?

Ví dụ với bài Trộm nhà (House Robber):
1. \`dp[i]\` = số tiền lớn nhất trộm được khi **chỉ xét i căn nhà đầu tiên**.
2. \`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\` — bỏ qua nhà i, hoặc trộm nhà i (cộng với dp cách 2 nhà).
3. \`dp[0] = nums[0]\`, \`dp[1] = max(nums[0], nums[1])\`, tính tăng dần.

## 3. Dấu hiệu nhận biết bài DP

| Đề bài nói | Khả năng cao là DP |
|---|---|
| "số cách", "đếm số phương án" | ✔ |
| "giá trị lớn nhất / nhỏ nhất có thể" | ✔ |
| "có thể đạt được hay không" (khả thi) | ✔ |
| "dài nhất / ngắn nhất" trên **dãy con** | ✔ |
| n ≤ 20 và hỏi mọi tổ hợp | backtracking, không phải DP |
| "chọn ngay tại chỗ luôn tối ưu" | Greedy, không cần DP |

**Phân biệt DP với Greedy:** Greedy chọn một lần rồi không nhìn lại.
DP giữ **mọi khả năng** và chọn tốt nhất ở cuối. Nếu lựa chọn tốt cục bộ có thể sai về sau
→ bắt buộc dùng DP.

## 4. Hai cách viết — nên biết cả hai

**Top-down (đệ quy + memo)** — gần với suy nghĩ tự nhiên:
\`\`\`js
const memo = new Map();
const f = (i) => {
  if (i < 0) return 0;
  if (memo.has(i)) return memo.get(i);
  const res = Math.max(f(i - 1), f(i - 2) + nums[i]);
  memo.set(i, res);
  return res;
};
\`\`\`

**Bottom-up (bảng lặp)** — nhanh hơn, không lo tràn ngăn xếp:
\`\`\`js
const dp = new Array(n).fill(0);
dp[0] = nums[0];
for (let i = 1; i < n; i++) dp[i] = Math.max(dp[i-1], (dp[i-2] ?? 0) + nums[i]);
\`\`\`

**Tối ưu bộ nhớ:** nếu \`dp[i]\` chỉ phụ thuộc vài trạng thái gần nhất, hãy thay mảng bằng **vài biến**
→ O(1) bộ nhớ. Đây là "câu hỏi tiếp theo" gần như chắc chắn sẽ được hỏi.

## 5. Bẫy thường gặp

- **Định nghĩa trạng thái mơ hồ** → công thức truy hồi sai. Hãy viết ra bằng lời trước khi code.
- Quên trường hợp cơ sở (mảng 1 phần tử, mảng rỗng).
- Với bài "khả thi/không", giá trị khởi tạo phải là \`false\`/\`Infinity\` đúng ngữ nghĩa
  (ví dụ Coin Change dùng \`Infinity\` để đánh dấu "không đạt được").
- Nhầm **dãy con** (subsequence, không cần liên tiếp) với **đoạn con** (subarray, phải liên tiếp).

## 6. Ứng dụng thực tế

- **So sánh chuỗi (diff)**: \`git diff\` dùng thuật toán dãy con chung dài nhất.
- **Sinh học tính toán**: căn chỉnh chuỗi DNA (Needleman-Wunsch) là DP 2 chiều.
- **Gõ phím dự đoán / sửa lỗi chính tả**: khoảng cách Levenshtein.
- **Tối ưu tài chính**: phân bổ ngân sách theo từng giai đoạn.
- **Nén video**: chọn khung hình tham chiếu tối ưu bằng DP.
`,
  lessonPy: `
## 1. Vấn đề gốc

Đệ quy tự nhiên thường tính **đi tính lại** cùng một bài toán con.
Ví dụ Fibonacci đệ quy: \`fib(5)\` gọi \`fib(3)\` hai lần, \`fib(2)\` ba lần...
Số lời gọi tăng theo hàm mũ 2ⁿ dù chỉ có n giá trị khác nhau.

**Quy hoạch động = đệ quy + ghi nhớ.** Chỉ vậy thôi. Python có sẵn \`functools.lru_cache\`
để memo hoá tự động — nhưng vẫn nên biết cách tự viết bằng \`dict\` để hiểu bản chất.

## 2. Ba câu hỏi để giải MỌI bài DP

Đừng học thuộc lời giải. Hãy tập trả lời ba câu hỏi này — chúng áp dụng cho mọi bài:

1. **Trạng thái là gì?** \`dp[i]\` mang ý nghĩa gì? *(Đây là câu khó nhất. 80% thời gian nằm ở đây.)*
2. **Công thức truy hồi?** \`dp[i]\` tính từ các trạng thái nhỏ hơn thế nào?
3. **Trường hợp cơ sở và thứ tự tính?** Bắt đầu từ đâu, đi theo hướng nào?

Ví dụ với bài Trộm nhà (House Robber):
1. \`dp[i]\` = số tiền lớn nhất trộm được khi **chỉ xét i căn nhà đầu tiên**.
2. \`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\` — bỏ qua nhà i, hoặc trộm nhà i (cộng với dp cách 2 nhà).
3. \`dp[0] = nums[0]\`, \`dp[1] = max(nums[0], nums[1])\`, tính tăng dần.

## 3. Dấu hiệu nhận biết bài DP

| Đề bài nói | Khả năng cao là DP |
|---|---|
| "số cách", "đếm số phương án" | ✔ |
| "giá trị lớn nhất / nhỏ nhất có thể" | ✔ |
| "có thể đạt được hay không" (khả thi) | ✔ |
| "dài nhất / ngắn nhất" trên **dãy con** | ✔ |
| n ≤ 20 và hỏi mọi tổ hợp | backtracking, không phải DP |
| "chọn ngay tại chỗ luôn tối ưu" | Greedy, không cần DP |

**Phân biệt DP với Greedy:** Greedy chọn một lần rồi không nhìn lại.
DP giữ **mọi khả năng** và chọn tốt nhất ở cuối. Nếu lựa chọn tốt cục bộ có thể sai về sau
→ bắt buộc dùng DP.

## 4. Hai cách viết — nên biết cả hai

**Top-down (đệ quy + memo)** — gần với suy nghĩ tự nhiên:
\`\`\`python
memo = {}
def f(i):
    if i < 0:
        return 0
    if i in memo:
        return memo[i]
    res = max(f(i - 1), f(i - 2) + nums[i])
    memo[i] = res
    return res
\`\`\`
Hoặc gọn hơn với decorator có sẵn:
\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)
def f(i):
    if i < 0:
        return 0
    return max(f(i - 1), f(i - 2) + nums[i])
\`\`\`

**Bottom-up (bảng lặp)** — nhanh hơn, không lo \`RecursionError\`:
\`\`\`python
dp = [0] * n
dp[0] = nums[0]
for i in range(1, n):
    dp[i] = max(dp[i-1], (dp[i-2] if i >= 2 else 0) + nums[i])
\`\`\`

**Tối ưu bộ nhớ:** nếu \`dp[i]\` chỉ phụ thuộc vài trạng thái gần nhất, hãy thay list bằng **vài biến**
→ O(1) bộ nhớ. Đây là "câu hỏi tiếp theo" gần như chắc chắn sẽ được hỏi.

**Lưu ý Python:** top-down đệ quy có thể chạm giới hạn \`sys.getrecursionlimit()\` (~1000) với n lớn.
Bottom-up không có rủi ro này — đó là lý do nhiều lời giải "chuẩn" trong Python ưu tiên bottom-up
khi n có thể lớn.

## 5. Bẫy thường gặp

- **Định nghĩa trạng thái mơ hồ** → công thức truy hồi sai. Hãy viết ra bằng lời trước khi code.
- Quên trường hợp cơ sở (mảng 1 phần tử, mảng rỗng).
- Với bài "khả thi/không", giá trị khởi tạo phải là \`False\`/\`float('inf')\` đúng ngữ nghĩa
  (ví dụ Coin Change dùng \`float('inf')\` để đánh dấu "không đạt được").
- Nhầm **dãy con** (subsequence, không cần liên tiếp) với **đoạn con** (subarray, phải liên tiếp).

## 6. Ứng dụng thực tế

- **So sánh chuỗi (diff)**: \`git diff\` dùng thuật toán dãy con chung dài nhất.
- **Sinh học tính toán**: căn chỉnh chuỗi DNA (Needleman-Wunsch) là DP 2 chiều — thư viện Biopython
  (Python) cài sẵn các thuật toán này.
- **Gõ phím dự đoán / sửa lỗi chính tả**: khoảng cách Levenshtein.
- **Tối ưu tài chính**: phân bổ ngân sách theo từng giai đoạn.
- **Nén video**: chọn khung hình tham chiếu tối ưu bằng DP.
`,
  quiz: [
    {
      q: 'Điều gì phân biệt quy hoạch động với đệ quy thông thường?',
      options: [
        'DP luôn dùng vòng lặp',
        'DP lưu lại kết quả các bài toán con đã tính (memo) nên mỗi bài toán con chỉ giải một lần',
        'DP nhanh hơn vì dùng ít bộ nhớ',
        'DP không dùng hàm đệ quy',
      ],
      answer: 1,
      why: 'Bản chất DP = đệ quy + ghi nhớ. Điều kiện áp dụng: bài toán phải có "bài toán con gối nhau" (overlapping subproblems) — nếu không gối nhau thì memo vô dụng, đó là chia để trị.',
    },
    {
      q: 'Bước KHÓ NHẤT và quan trọng nhất khi giải một bài DP là gì?',
      options: [
        'Viết vòng lặp đúng thứ tự',
        'Định nghĩa trạng thái dp[i] mang ý nghĩa gì',
        'Tối ưu bộ nhớ xuống O(1)',
        'Chọn ngôn ngữ lập trình phù hợp',
      ],
      answer: 1,
      why: 'Định nghĩa trạng thái sai thì công thức truy hồi không bao giờ đúng. Hãy viết ra bằng lời: "dp[i] là ... khi xét ... đầu tiên". Nếu không phát biểu được rõ ràng, bạn chưa hiểu bài toán.',
    },
    {
      q: 'Khi nào KHÔNG nên dùng greedy mà phải dùng DP?',
      options: [
        'Khi mảng chưa được sắp xếp',
        'Khi lựa chọn tối ưu cục bộ ở bước hiện tại có thể dẫn tới kết quả tổng thể tệ hơn',
        'Khi n quá lớn',
        'Khi có nhiều số âm',
      ],
      answer: 1,
      why: 'Ví dụ Coin Change với mệnh giá [1,3,4] và target 6: greedy lấy 4+1+1 = 3 đồng, còn tối ưu là 3+3 = 2 đồng. Greedy chỉ đúng khi chứng minh được tính chất lựa chọn tham lam.',
    },
    {
      q: 'Với bài Fibonacci, vì sao bản đệ quy thuần là O(2ⁿ) còn bản DP là O(n)?',
      options: [
        'Vì DP dùng vòng lặp nhanh hơn đệ quy',
        'Vì đệ quy thuần tính lại cùng một fib(k) rất nhiều lần; DP tính mỗi giá trị đúng một lần',
        'Vì DP dùng ít bộ nhớ hơn',
        'Vì đệ quy tạo ra nhiều luồng',
      ],
      answer: 1,
      why: 'Chỉ có n giá trị khác nhau, nhưng cây đệ quy có 2ⁿ nút vì mỗi giá trị bị tính lại nhiều lần. Ghi nhớ biến 2ⁿ thành n — đây là ví dụ rõ nhất về sức mạnh của DP.',
    },
  ],
  quizPy: [
    {
      q: 'Điều gì phân biệt quy hoạch động với đệ quy thông thường?',
      options: [
        'DP luôn dùng vòng lặp',
        'DP lưu lại kết quả các bài toán con đã tính (memo, ví dụ bằng dict hoặc @lru_cache) nên mỗi bài toán con chỉ giải một lần',
        'DP nhanh hơn vì dùng ít bộ nhớ',
        'DP không dùng hàm đệ quy',
      ],
      answer: 1,
      why: 'Bản chất DP = đệ quy + ghi nhớ. Điều kiện áp dụng: bài toán phải có "bài toán con gối nhau" (overlapping subproblems) — nếu không gối nhau thì memo vô dụng, đó là chia để trị.',
    },
    {
      q: 'Bước KHÓ NHẤT và quan trọng nhất khi giải một bài DP là gì?',
      options: [
        'Viết vòng lặp đúng thứ tự',
        'Định nghĩa trạng thái dp[i] mang ý nghĩa gì',
        'Tối ưu bộ nhớ xuống O(1)',
        'Chọn dùng list hay dict để lưu bảng',
      ],
      answer: 1,
      why: 'Định nghĩa trạng thái sai thì công thức truy hồi không bao giờ đúng. Hãy viết ra bằng lời: "dp[i] là ... khi xét ... đầu tiên". Nếu không phát biểu được rõ ràng, bạn chưa hiểu bài toán.',
    },
    {
      q: 'Khi nào KHÔNG nên dùng greedy mà phải dùng DP?',
      options: [
        'Khi mảng chưa được sắp xếp',
        'Khi lựa chọn tối ưu cục bộ ở bước hiện tại có thể dẫn tới kết quả tổng thể tệ hơn',
        'Khi n quá lớn',
        'Khi có nhiều số âm',
      ],
      answer: 1,
      why: 'Ví dụ Coin Change với mệnh giá [1,3,4] và target 6: greedy lấy 4+1+1 = 3 đồng, còn tối ưu là 3+3 = 2 đồng. Greedy chỉ đúng khi chứng minh được tính chất lựa chọn tham lam.',
    },
    {
      q: 'Với bài Fibonacci, vì sao bản đệ quy thuần là O(2ⁿ) còn bản DP là O(n)?',
      options: [
        'Vì DP dùng vòng lặp nhanh hơn đệ quy',
        'Vì đệ quy thuần tính lại cùng một fib(k) rất nhiều lần; DP tính mỗi giá trị đúng một lần',
        'Vì DP dùng ít bộ nhớ hơn',
        'Vì đệ quy tạo ra nhiều luồng',
      ],
      answer: 1,
      why: 'Chỉ có n giá trị khác nhau, nhưng cây đệ quy có 2ⁿ nút vì mỗi giá trị bị tính lại nhiều lần. Ghi nhớ biến 2ⁿ thành n — đây là ví dụ rõ nhất về sức mạnh của DP.',
    },
  ],
  problems: [
    {
      id: 'climbing-stairs',
      title: 'Leo cầu thang',
      en: 'Climbing Stairs',
      difficulty: 'Easy',
      targetMinutes: 10,
      entry: 'climbStairs',
      statement: `
Bạn leo cầu thang có \`n\` bậc. Mỗi lần bạn được bước **1 hoặc 2 bậc**.
Hỏi có bao nhiêu cách khác nhau để lên tới đỉnh?

**Ví dụ**
- \`n = 2\` → \`2\` (1+1, hoặc 2)
- \`n = 3\` → \`3\` (1+1+1, 1+2, 2+1)
`,
      starter: `function climbStairs(n) {\n  \n}`,
      starterPy: `def climbStairs(n):\n    \n`,
      tests: [
        { args: [2], expected: 2, name: 'n = 2' },
        { args: [3], expected: 3, name: 'n = 3' },
        { args: [1], expected: 1, name: 'n = 1' },
        { args: [5], expected: 8, name: 'n = 5' },
        { args: [10], expected: 89, name: 'n = 10' },
        { args: [45], expected: 1836311903, name: 'n = 45 — bản đệ quy thuần sẽ treo' },
      ],
      hints: [
        'Hỏi ngược: để đứng ở bậc n, bước cuối cùng của bạn xuất phát từ đâu? Chỉ có hai khả năng: từ bậc n-1 (bước 1) hoặc bậc n-2 (bước 2).',
        'Vậy `cách(n) = cách(n-1) + cách(n-2)` — chính là dãy Fibonacci! Cơ sở: `cách(1) = 1`, `cách(2) = 2`.',
        'Đệ quy thuần sẽ là O(2ⁿ) và treo ở n = 45. Hãy dùng vòng lặp với hai biến `prev` và `cur` — O(n) thời gian, O(1) bộ nhớ.',
      ],
      hintsPy: [
        'Hỏi ngược: để đứng ở bậc n, bước cuối cùng của bạn xuất phát từ đâu? Chỉ có hai khả năng: từ bậc n-1 (bước 1) hoặc bậc n-2 (bước 2).',
        'Vậy `cách(n) = cách(n-1) + cách(n-2)` — chính là dãy Fibonacci! Cơ sở: `cách(1) = 1`, `cách(2) = 2`.',
        'Đệ quy thuần sẽ là O(2ⁿ) và treo ở n = 45 (và có thể chạm `RecursionError` trước cả khi chậm). Hãy dùng vòng lặp với hai biến `prev` và `cur` — O(n) thời gian, O(1) bộ nhớ.',
      ],
      diagnostics: [
        { test: 'return\\s+climbStairs\\(n\\s*-\\s*1\\)\\s*\\+\\s*climbStairs\\(n\\s*-\\s*2\\)', message: 'Công thức đúng nhưng thiếu ghi nhớ! Đệ quy thuần là O(2ⁿ) — test n=45 sẽ hết giờ. Hãy thêm memo hoặc chuyển sang vòng lặp.' },
      ],
      diagnosticsPy: [
        { test: 'return\\s+climbStairs\\(n\\s*-\\s*1\\)\\s*\\+\\s*climbStairs\\(n\\s*-\\s*2\\)', message: 'Công thức đúng nhưng thiếu ghi nhớ! Đệ quy thuần là O(2ⁿ) — test n=45 sẽ hết giờ (và có nguy cơ RecursionError). Hãy thêm @lru_cache hoặc chuyển sang vòng lặp.' },
      ],
      approach: `
Bài này là **cửa vào** của quy hoạch động. Hãy dùng nó để luyện đúng ba câu hỏi:

1. **Trạng thái:** \`dp[i]\` = số cách lên tới bậc i.
2. **Truy hồi:** \`dp[i] = dp[i-1] + dp[i-2]\`.
   *Lập luận:* mọi cách lên bậc i đều kết thúc bằng một bước 1 (từ i-1) hoặc một bước 2 (từ i-2).
   Hai nhóm này **rời nhau** và **phủ hết** → cộng lại.
3. **Cơ sở:** \`dp[1] = 1\`, \`dp[2] = 2\`.

\`\`\`
n:   1  2  3  4  5  6
dp:  1  2  3  5  8  13     <- chính là Fibonacci dịch một bậc
\`\`\`

**Tối ưu bộ nhớ về O(1):** \`dp[i]\` chỉ cần hai giá trị liền trước → thay mảng bằng hai biến.
Mẹo này áp dụng cho **mọi** bài DP có cửa sổ phụ thuộc hữu hạn — hãy tạo thành phản xạ.

**Mở rộng thường gặp:** mỗi lần được bước 1, 2 hoặc 3 bậc? → \`dp[i] = dp[i-1]+dp[i-2]+dp[i-3]\`.
Bước được k bậc? → tổng của k giá trị trước đó. Cùng một khung tư duy.
`,
      solution: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev = 1, cur = 2;              // dp[1], dp[2]
  for (let i = 3; i <= n; i++) {
    const next = prev + cur;
    prev = cur;
    cur = next;
  }
  return cur;
}`,
      solutionPy: `def climbStairs(n):
    if n <= 2:
        return n
    prev, cur = 1, 2
    for _ in range(3, n + 1):
        prev, cur = cur, prev + cur
    return cur`,
      complexity: {
        question: 'Bản đệ quy KHÔNG memo có độ phức tạp bao nhiêu, và vì sao?',
        options: [
          'O(n) — mỗi bậc tính một lần',
          'O(2ⁿ) — cây đệ quy phân đôi ở mỗi tầng và cùng một giá trị bị tính lại rất nhiều lần',
          'O(n²)',
          'O(n log n)',
        ],
        answer: 1,
        why: 'Cây đệ quy có ~2ⁿ nút dù chỉ có n giá trị khác nhau. Thêm memo hoặc chuyển sang vòng lặp đưa về O(n). Đây là minh hoạ sạch sẽ nhất cho sức mạnh của DP.',
      },
      realWorld: 'Đếm số cách phân rã một lượng công việc thành các bước có kích thước cho trước — dùng trong lập lịch, đếm cấu hình hợp lệ, và các mô hình tổ hợp trong sinh học.',
    },
    {
      id: 'house-robber',
      title: 'Trộm nhà',
      en: 'House Robber',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'rob',
      statement: `
Mỗi căn nhà chứa \`nums[i]\` tiền. Bạn **không được trộm hai căn liền kề** (sẽ báo động).
Trả về số tiền lớn nhất có thể trộm được.

**Ví dụ**
- \`[1,2,3,1]\` → \`4\` (nhà 0 và 2)
- \`[2,7,9,3,1]\` → \`12\` (nhà 0, 2, 4)
`,
      starter: `function rob(nums) {\n  \n}`,
      starterPy: `def rob(nums):\n    \n`,
      tests: [
        { args: [[1, 2, 3, 1]], expected: 4, name: 'Ví dụ 1' },
        { args: [[2, 7, 9, 3, 1]], expected: 12, name: 'Ví dụ 2' },
        { args: [[5]], expected: 5, name: 'Một nhà' },
        { args: [[]], expected: 0, name: 'Không có nhà' },
        { args: [[2, 1, 1, 2]], expected: 4, name: 'Bẫy: greedy lấy số lớn nhất trước sẽ sai' },
        { args: [[2, 1]], expected: 2, name: 'Hai nhà' },
        { args: [[100, 1, 1, 100]], expected: 200, name: 'Hai đầu' },
      ],
      hints: [
        'Với căn nhà i, bạn có đúng hai lựa chọn: **trộm** (thì không được trộm i-1) hoặc **bỏ qua** (giữ nguyên kết quả tới i-1).',
        '`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`. Hãy phát biểu bằng lời: "số tiền lớn nhất khi chỉ xét i căn nhà đầu tiên".',
        'Test `[2,1,1,2]` là bẫy dành cho greedy: nếu cứ chọn nhà nhiều tiền nhất còn khả dụng, bạn sẽ ra 3 thay vì 4. Đây là lý do bài này bắt buộc dùng DP.',
      ],
      hintsPy: [
        'Với căn nhà i, bạn có đúng hai lựa chọn: **trộm** (thì không được trộm i-1) hoặc **bỏ qua** (giữ nguyên kết quả tới i-1).',
        '`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`. Hãy phát biểu bằng lời: "số tiền lớn nhất khi chỉ xét i căn nhà đầu tiên".',
        'Test `[2,1,1,2]` là bẫy dành cho greedy: nếu cứ chọn nhà nhiều tiền nhất còn khả dụng, bạn sẽ ra 3 thay vì 4. Đây là lý do bài này bắt buộc dùng DP. Dùng gán song song `prev2, prev1 = prev1, max(prev1, prev2 + money)` để nén về O(1) bộ nhớ.',
      ],
      diagnostics: [
        { test: 'sort\\s*\\(', message: 'Sắp xếp làm mất thông tin vị trí — mà ràng buộc "không liền kề" phụ thuộc hoàn toàn vào vị trí. Hướng đi này không cứu được.' },
        { test: 'i\\s*\\+=\\s*2|i\\s*=\\s*i\\s*\\+\\s*2', message: 'Chọn xen kẽ (nhà chẵn hoặc nhà lẻ) là một dạng greedy và sẽ sai với [2,1,1,2]. Bạn cần xét cả hai lựa chọn ở mỗi bước.' },
      ],
      diagnosticsPy: [
        { test: '\\.sort\\s*\\(\\)|sorted\\s*\\(', message: 'Sắp xếp làm mất thông tin vị trí — mà ràng buộc "không liền kề" phụ thuộc hoàn toàn vào vị trí. Hướng đi này không cứu được.' },
        { test: 'range\\s*\\([^)]*,\\s*2\\s*\\)', message: 'Chọn xen kẽ (nhà chẵn hoặc nhà lẻ, bước nhảy 2) là một dạng greedy và sẽ sai với [2,1,1,2]. Bạn cần xét cả hai lựa chọn ở mỗi bước.' },
      ],
      approach: `
Bài này dạy bạn **mẫu "lấy hay không lấy"** — xuất hiện trong hàng chục bài DP khác.

**Ba câu hỏi:**
1. **Trạng thái:** \`dp[i]\` = tiền lớn nhất trộm được khi xét \`nums[0..i]\`.
2. **Truy hồi:** ở nhà i chỉ có hai khả năng:
   - Không trộm i → kết quả bằng \`dp[i-1]\`.
   - Trộm i → không được đụng i-1, nên bằng \`dp[i-2] + nums[i]\`.
   → \`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\`
3. **Cơ sở:** \`dp[0] = nums[0]\`, \`dp[1] = max(nums[0], nums[1])\`.

\`\`\`
nums = [2, 7, 9, 3, 1]
dp   = [2, 7, 11, 11, 12]
                        ^ max(11, 11+1) = 12 ✔
\`\`\`

**Vì sao greedy sai?** Với \`[2,1,1,2]\`, greedy chọn số lớn nhất trước (2 ở đầu), rồi bị chặn,
kết quả 3. DP xét cả hai nhánh nên tìm ra 2+2 = 4. Bài học: khi một lựa chọn **chặn** các lựa chọn
tương lai, greedy thường sai.

**Tối ưu O(1) bộ nhớ:**
\`\`\`js
let rob1 = 0, rob2 = 0;                       // dp[i-2], dp[i-1]
for (const n of nums) [rob1, rob2] = [rob2, Math.max(rob2, rob1 + n)];
return rob2;
\`\`\`

**Biến thể House Robber II** (các nhà xếp thành **vòng tròn**): nhà đầu và nhà cuối kề nhau
→ chạy thuật toán hai lần: một lần bỏ nhà cuối, một lần bỏ nhà đầu, rồi lấy max.
Kỹ thuật "phá vòng bằng cách cố định một lựa chọn" rất đáng nhớ.
`,
      solution: `function rob(nums) {
  let prev2 = 0;   // dp[i-2]
  let prev1 = 0;   // dp[i-1]

  for (const money of nums) {
    const cur = Math.max(prev1, prev2 + money);   // bỏ qua nhà này | trộm nhà này
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
      solutionPy: `def rob(nums):
    prev2 = prev1 = 0
    for money in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + money)
    return prev1`,
      complexity: {
        question: 'Vì sao chiến lược tham lam "luôn chọn căn nhà nhiều tiền nhất còn khả dụng" lại sai?',
        options: [
          'Vì nó chạy quá chậm',
          'Vì chọn một nhà sẽ CHẶN hai nhà bên cạnh — lợi ích trước mắt có thể khiến mất nhiều hơn về sau, như trong [2,1,1,2]',
          'Vì mảng chưa được sắp xếp',
          'Vì có thể có số âm',
        ],
        answer: 1,
        why: 'Đây là ranh giới giữa greedy và DP: khi một lựa chọn loại bỏ các lựa chọn khác, bạn phải cân nhắc cả nhánh "không chọn" — tức là DP.',
      },
      realWorld: 'Bài toán chọn tập độc lập có trọng số lớn nhất: xếp lịch các công việc không được chồng chéo, chọn kênh phát sóng không nhiễu nhau, hay chọn vị trí đặt trạm phát không gây can nhiễu.',
    },
    {
      id: 'coin-change',
      title: 'Đổi tiền',
      en: 'Coin Change',
      difficulty: 'Medium',
      targetMinutes: 25,
      entry: 'coinChange',
      statement: `
Cho các mệnh giá \`coins\` (không giới hạn số lượng mỗi loại) và số tiền \`amount\`.
Trả về **số đồng xu ít nhất** để đổi đúng \`amount\`. Nếu không thể, trả về \`-1\`.

**Ví dụ**
- \`coins = [1,2,5], amount = 11\` → \`3\` (5+5+1)
- \`coins = [2], amount = 3\` → \`-1\`
- \`coins = [1], amount = 0\` → \`0\`
`,
      starter: `function coinChange(coins, amount) {\n  \n}`,
      starterPy: `def coinChange(coins, amount):\n    \n`,
      tests: [
        { args: [[1, 2, 5], 11], expected: 3, name: 'Ví dụ 1' },
        { args: [[2], 3], expected: -1, name: 'Không thể đổi' },
        { args: [[1], 0], expected: 0, name: 'Số tiền 0' },
        { args: [[1, 3, 4], 6], expected: 2, name: 'Bẫy greedy: 3+3 tốt hơn 4+1+1' },
        { args: [[2, 5, 10, 1], 27], expected: 4, name: 'Nhiều mệnh giá' },
        { args: [[186, 419, 83, 408], 6249], expected: 20, name: 'Mệnh giá lớn' },
        { args: [[1, 2, 5], 100], expected: 20, name: 'Số tiền lớn' },
      ],
      hints: [
        'Trạng thái: `dp[a]` = số xu ít nhất để đổi đúng số tiền `a`. Đích cần tìm là `dp[amount]`.',
        'Truy hồi: `dp[a] = 1 + min(dp[a - c])` với mọi mệnh giá `c <= a`. Nghĩa là: dùng một đồng xu c, phần còn lại là bài toán con `a - c`.',
        'Khởi tạo `dp[0] = 0`, còn lại là `Infinity` (chưa đạt được). Cuối cùng nếu `dp[amount] === Infinity` thì trả về -1. Test `[1,3,4], 6` sẽ đánh trượt mọi lời giải tham lam.',
      ],
      hintsPy: [
        'Trạng thái: `dp[a]` = số xu ít nhất để đổi đúng số tiền `a`. Đích cần tìm là `dp[amount]`.',
        'Truy hồi: `dp[a] = 1 + min(dp[a - c])` với mọi mệnh giá `c <= a`. Nghĩa là: dùng một đồng xu c, phần còn lại là bài toán con `a - c`.',
        'Khởi tạo `dp[0] = 0`, còn lại là `float(\'inf\')` (chưa đạt được). Cuối cùng nếu `dp[amount] == float(\'inf\')` thì trả về -1. Test `[1,3,4], 6` sẽ đánh trượt mọi lời giải tham lam.',
      ],
      diagnostics: [
        { test: 'sort\\s*\\([\\s\\S]{0,40}\\)[\\s\\S]{0,200}while[\\s\\S]{0,200}amount', message: 'Đây là chiến lược tham lam (lấy mệnh giá lớn nhất trước). Nó sai với coins=[1,3,4], amount=6: greedy cho 3 đồng (4+1+1) nhưng tối ưu là 2 đồng (3+3).' },
        { test: 'dp\\.fill\\(0\\)|fill\\(\\s*-1\\s*\\)', message: 'Khởi tạo bằng 0 hoặc -1 sẽ làm phép `min` sai. Hãy dùng `Infinity` để biểu diễn "chưa đạt được", rồi đổi thành -1 ở cuối.' },
      ],
      diagnosticsPy: [
        { test: 'sorted\\s*\\([\\s\\S]{0,40}\\)[\\s\\S]{0,200}while[\\s\\S]{0,200}amount', message: 'Đây là chiến lược tham lam (lấy mệnh giá lớn nhất trước). Nó sai với coins=[1,3,4], amount=6: greedy cho 3 đồng (4+1+1) nhưng tối ưu là 2 đồng (3+3).' },
        { test: '\\[0\\]\\s*\\*\\s*\\(amount|\\[-1\\]\\s*\\*', message: 'Khởi tạo bằng 0 hoặc -1 sẽ làm phép `min` sai. Hãy dùng `float(\'inf\')` để biểu diễn "chưa đạt được", rồi đổi thành -1 ở cuối.' },
      ],
      approach: `
**Đây là bài kinh điển chứng minh greedy sai.** Với hệ tiền tệ thật (1, 2, 5, 10...)
greedy tình cờ đúng, nhưng với \`[1,3,4]\` và target 6 thì greedy cho 3 đồng còn tối ưu là 2.
Đó là lý do phải dùng DP.

**Ba câu hỏi:**
1. **Trạng thái:** \`dp[a]\` = số xu ít nhất để tạo ra số tiền a.
2. **Truy hồi:** \`dp[a] = min(dp[a - c] + 1)\` với mọi c trong coins, c ≤ a.
3. **Cơ sở:** \`dp[0] = 0\` (không cần xu nào); các giá trị khác khởi tạo \`Infinity\`.

\`\`\`
coins=[1,3,4], amount=6
dp[0]=0
dp[1]=1        (1)
dp[2]=2        (1+1)
dp[3]=1        (3)
dp[4]=1        (4)
dp[5]=2        (4+1 hoặc 1+3+1... tối ưu 2)
dp[6]=2        (3+3)  <- greedy sẽ cho 3 ✗
\`\`\`

**Vì sao thứ tự vòng lặp là a tăng dần?** Vì \`dp[a]\` phụ thuộc \`dp[a-c]\` với \`a-c < a\`.
Muốn dùng kết quả nào thì phải tính nó trước — nguyên tắc chung của bottom-up DP.

**Độ phức tạp:** O(amount × số_mệnh_giá). Lưu ý đây là **pseudo-polynomial**:
nó phụ thuộc vào *giá trị* của amount chứ không phải kích thước đầu vào.
Với amount = 10⁹ thì cách này bất khả thi — chi tiết đáng nêu để thể hiện bạn hiểu sâu.

**Biến thể quan trọng:** "đếm **số cách** đổi tiền" (Coin Change II) đổi thứ tự hai vòng lặp
(vòng ngoài duyệt coin) để tránh đếm trùng hoán vị. Sự khác biệt tinh tế này hay được hỏi.
`,
      solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;                                    // 0 đồng cần 0 xu

  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      solutionPy: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return -1 if dp[amount] == float('inf') else dp[amount]`,
      complexity: {
        question: 'Độ phức tạp O(amount × n) được gọi là gì và vì sao cần lưu ý?',
        options: [
          'Đa thức thông thường — không có gì đặc biệt',
          'Pseudo-polynomial: phụ thuộc GIÁ TRỊ của amount chứ không phải kích thước đầu vào, nên với amount = 10⁹ sẽ bất khả thi',
          'Hàm mũ',
          'Logarit',
        ],
        answer: 1,
        why: 'Kích thước đầu vào của số amount chỉ là log(amount) bit, nhưng thuật toán chạy amount bước. Bài toán knapsack cũng vậy — đây là lý do chúng được xếp vào lớp NP-hard dù có lời giải DP.',
      },
      realWorld: 'Máy ATM chọn tổ hợp tờ tiền; tối ưu hoá đóng gói hàng vào thùng tiêu chuẩn; chia nhỏ một khoản thanh toán thành các gói phí có sẵn với số giao dịch ít nhất.',
    },
    {
      id: 'longest-increasing-subsequence',
      title: 'Dãy con tăng dài nhất',
      en: 'Longest Increasing Subsequence',
      difficulty: 'Medium',
      targetMinutes: 28,
      entry: 'lengthOfLIS',
      statement: `
Cho mảng \`nums\`, trả về độ dài của **dãy con tăng nghiêm ngặt** dài nhất.

Dãy con (subsequence) **không cần liên tiếp** — chỉ cần giữ đúng thứ tự.

**Ví dụ**
- \`[10,9,2,5,3,7,101,18]\` → \`4\` (dãy \`[2,3,7,101]\`)
- \`[7,7,7,7]\` → \`1\`
`,
      starter: `function lengthOfLIS(nums) {\n  \n}`,
      starterPy: `def lengthOfLIS(nums):\n    \n`,
      tests: [
        { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, name: 'Ví dụ chuẩn' },
        { args: [[0, 1, 0, 3, 2, 3]], expected: 4, name: 'Có phần tử gây nhiễu' },
        { args: [[7, 7, 7, 7]], expected: 1, name: 'Tăng NGHIÊM NGẶT nên giá trị bằng nhau không tính' },
        { args: [[1]], expected: 1, name: 'Một phần tử' },
        { args: [[4, 10, 4, 3, 8, 9]], expected: 3, name: 'Dãy tối ưu nằm ở cuối' },
        { args: [[5, 4, 3, 2, 1]], expected: 1, name: 'Giảm dần' },
        { args: [[1, 3, 6, 7, 9, 4, 10, 5, 6]], expected: 6, name: 'Dãy dài' },
      ],
      hints: [
        'Bản DP O(n²): `dp[i]` = độ dài dãy tăng dài nhất **kết thúc tại i**. Với mỗi i, nhìn lại mọi j < i có `nums[j] < nums[i]` và lấy `dp[i] = max(dp[j]) + 1`.',
        'Chú ý: đáp án là `max(dp)` chứ không phải `dp[n-1]` — dãy tốt nhất có thể kết thúc ở bất kỳ đâu.',
        'Bản O(n log n) (patience sorting): giữ mảng `tails`, trong đó `tails[k]` = phần tử cuối **nhỏ nhất** của mọi dãy tăng độ dài k+1. Với mỗi số, dùng binary search tìm vị trí đầu tiên `>= x` rồi ghi đè. Độ dài `tails` chính là đáp án.',
      ],
      hintsPy: [
        'Bản DP O(n²): `dp[i]` = độ dài dãy tăng dài nhất **kết thúc tại i**. Với mỗi i, nhìn lại mọi j < i có `nums[j] < nums[i]` và lấy `dp[i] = max(dp[j]) + 1`.',
        'Chú ý: đáp án là `max(dp)` chứ không phải `dp[n-1]` — dãy tốt nhất có thể kết thúc ở bất kỳ đâu.',
        'Bản O(n log n) (patience sorting): giữ list `tails`, dùng `bisect.bisect_left(tails, x)` để tìm vị trí đầu tiên `>= x` — nếu vị trí đó bằng `len(tails)` thì `append`, ngược lại ghi đè. Độ dài `tails` chính là đáp án.',
      ],
      diagnostics: [
        { test: 'sort\\s*\\(', message: 'Sắp xếp phá vỡ thứ tự — mà "dãy con" bắt buộc giữ nguyên thứ tự gốc. (Ngoại lệ: bài LIS có thể quy về LCS giữa mảng gốc và mảng đã sắp, nhưng đó là O(n²) và phức tạp hơn.)' },
        { test: '<=\\s*nums\\[i\\]|nums\\[j\\]\\s*<=', message: 'Đề yêu cầu tăng NGHIÊM NGẶT — dùng `<` chứ không phải `<=`. Test [7,7,7,7] sẽ phát hiện lỗi này.' },
      ],
      diagnosticsPy: [
        { test: '\\.sort\\s*\\(\\)|sorted\\s*\\(', message: 'Sắp xếp phá vỡ thứ tự — mà "dãy con" bắt buộc giữ nguyên thứ tự gốc.' },
        { test: '<=\\s*nums\\[i\\]|nums\\[j\\]\\s*<=', message: 'Đề yêu cầu tăng NGHIÊM NGẶT — dùng `<` chứ không phải `<=`. Test [7,7,7,7] sẽ phát hiện lỗi này.' },
      ],
      approach: `
Bài này đáng giá vì nó có **hai lời giải ở hai mức tư duy hoàn toàn khác nhau**.

**Cách 1 — DP O(n²), dễ nghĩ ra:**
1. **Trạng thái:** \`dp[i]\` = độ dài LIS **kết thúc chính xác tại i**.
   *(Định nghĩa "kết thúc tại i" là mấu chốt — nó làm cho truy hồi trở nên khả thi.)*
2. **Truy hồi:** \`dp[i] = 1 + max{ dp[j] : j < i và nums[j] < nums[i] }\` (hoặc 1 nếu không có j nào).
3. **Đáp án:** \`max(dp)\`.

\`\`\`
nums = [10, 9, 2, 5, 3, 7, 101, 18]
dp   = [ 1, 1, 1, 2, 2, 3,   4,  4]  -> max = 4 ✔
\`\`\`

**Cách 2 — Patience sorting, O(n log n):**
Giữ mảng \`tails\`: \`tails[k]\` = **giá trị cuối nhỏ nhất** trong tất cả các dãy tăng độ dài k+1.
Mảng này **luôn được sắp xếp tăng** (đây là bất biến then chốt), nên tìm nhị phân được.

\`\`\`js
const tails = [];
for (const x of nums) {
  let lo = 0, hi = tails.length;
  while (lo < hi) {                       // tìm vị trí đầu tiên >= x
    const mid = (lo + hi) >> 1;
    if (tails[mid] < x) lo = mid + 1; else hi = mid;
  }
  tails[lo] = x;                          // ghi đè hoặc nối thêm
}
return tails.length;
\`\`\`

**Trực giác (trò chơi xếp bài):** mỗi lá bài đặt lên chồng ngoài cùng bên trái có lá trên cùng ≥ nó;
nếu không có chồng nào thì tạo chồng mới. Số chồng cuối cùng = độ dài LIS.

⚠️ **Lưu ý quan trọng:** mảng \`tails\` **không phải** là dãy LIS thực tế —
nó chỉ có đúng *độ dài*. Muốn dựng lại dãy thật phải lưu thêm con trỏ cha.
Hiểu nhầm chỗ này là lỗi rất phổ biến.
`,
      solution: `function lengthOfLIS(nums) {
  // O(n log n) — patience sorting
  const tails = [];                       // tails[k] = đuôi nhỏ nhất của dãy tăng độ dài k+1

  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {                     // tìm vị trí đầu tiên có tails[mid] >= x
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;                        // lo === tails.length -> nối thêm; ngược lại ghi đè
  }
  return tails.length;
}`,
      solutionPy: `from bisect import bisect_left

def lengthOfLIS(nums):
    tails = []
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)`,
      complexity: {
        question: 'Mảng `tails` trong lời giải O(n log n) có ý nghĩa gì?',
        options: [
          'Nó chính là dãy con tăng dài nhất',
          'tails[k] là phần tử cuối NHỎ NHẤT trong mọi dãy tăng độ dài k+1 — chỉ độ dài của nó mới là đáp án',
          'Nó là mảng đã được sắp xếp của nums',
          'Nó lưu chỉ số của các phần tử trong LIS',
        ],
        answer: 1,
        why: 'Đây là hiểu lầm phổ biến nhất về thuật toán này. tails giữ đuôi nhỏ nhất để "dễ nối tiếp nhất về sau"; bản thân nó thường không phải là một dãy con hợp lệ của mảng gốc.',
      },
      realWorld: 'Phân tích xu hướng dài nhất trong chuỗi thời gian; bài toán xếp hộp lồng nhau (Russian doll envelopes); trong sinh học là tìm đoạn gen giữ nguyên thứ tự giữa hai loài.',
    },
  ],
},

/* ==================================================================== */
{
  id: 'dp-2d',
  name: 'Quy hoạch động 2 chiều',
  en: '2-D Dynamic Programming',
  icon: '🧮',
  days: [25, 26],
  summary: 'Khi trạng thái cần HAI chỉ số: hai chuỗi, lưới, hoặc "vị trí + ngân sách còn lại".',
  lesson: `
## 1. Khi nào cần 2 chiều?

Khi một chỉ số không đủ mô tả trạng thái. Ba tình huống điển hình:

1. **Hai dãy dữ liệu**: \`dp[i][j]\` = kết quả khi xét i ký tự đầu của chuỗi A và j ký tự đầu của B.
   *(so sánh chuỗi, khoảng cách chỉnh sửa, dãy con chung)*
2. **Lưới**: \`dp[r][c]\` = kết quả khi đứng tại ô (r, c). *(đếm đường đi, tổng nhỏ nhất)*
3. **Vị trí + tài nguyên**: \`dp[i][w]\` = giá trị tốt nhất khi xét i món đầu với sức chứa w.
   *(bài toán cái túi — knapsack)*

## 2. Khung tư duy — vẫn là ba câu hỏi cũ

Chỉ khác là trạng thái có hai chiều:
1. \`dp[i][j]\` nghĩa là gì? (phát biểu bằng lời!)
2. Truy hồi: \`dp[i][j]\` phụ thuộc những ô nào? *(thường là ô trên, ô trái, và ô chéo trên-trái)*
3. Cơ sở: hàng 0 và cột 0 bằng bao nhiêu?

**Mẹo cực kỳ hữu ích:** dùng bảng kích thước **(m+1) × (n+1)** với hàng/cột 0 làm "biên rỗng".
Nó xoá bỏ hầu hết các phép kiểm tra biên rườm rà.

## 3. Bài toán cái túi 0/1 — mẫu hình phải thuộc

\`\`\`
dp[i][w] = giá trị lớn nhất khi xét i món đầu tiên với sức chứa w

dp[i][w] = max(
  dp[i-1][w],                             // không lấy món i
  dp[i-1][w - weight[i]] + value[i]       // lấy món i (nếu vừa túi)
)
\`\`\`

Rất nhiều bài "khó" chỉ là knapsack đội lốt:
- *Partition Equal Subset Sum* → knapsack với sức chứa \`tổng/2\`, hỏi khả thi.
- *Target Sum* → knapsack đếm số cách.
- *Coin Change II* → knapsack không giới hạn số lượng (unbounded).

Nhận ra "đây là knapsack" là kỹ năng đáng giá nhất của chủ đề này.

## 4. Nén bộ nhớ từ 2D xuống 1D

Nếu \`dp[i][*]\` chỉ phụ thuộc \`dp[i-1][*]\`, ta chỉ cần **một hàng**:

\`\`\`js
// knapsack 0/1 với mảng 1 chiều — CHÚ Ý: vòng w phải duyệt NGƯỢC
for (const item of items)
  for (let w = W; w >= item.weight; w--)
    dp[w] = Math.max(dp[w], dp[w - item.weight] + item.value);
\`\`\`

**Vì sao duyệt ngược?** Vì duyệt xuôi sẽ dùng giá trị *đã cập nhật ở vòng này* →
biến thành "được lấy món nhiều lần" (unbounded knapsack). Chi tiết một dòng này
quyết định bạn đang giải bài 0/1 hay bài không giới hạn — hay bị hỏi trong phỏng vấn.

## 5. Bẫy thường gặp

- Sai thứ tự vòng lặp → dùng giá trị chưa được tính.
- Nhầm chỉ số: \`dp[i][j]\` ứng với ký tự \`A[i-1]\` và \`B[j-1]\` khi dùng biên rỗng.
- Quên khởi tạo hàng/cột 0.
- Bảng quá lớn: \`dp[10⁴][10⁴]\` = 10⁸ ô → hết bộ nhớ. Phải nén xuống 1 chiều.

## 6. Ứng dụng thực tế

- **git diff / so sánh văn bản**: dãy con chung dài nhất (LCS).
- **Sửa lỗi chính tả, gợi ý tìm kiếm**: khoảng cách Levenshtein.
- **Sinh tin học**: căn chỉnh chuỗi DNA/protein (Smith-Waterman) — DP 2 chiều quy mô lớn.
- **Phân bổ nguồn lực có ràng buộc ngân sách**: knapsack trong quảng cáo, đầu tư, lập lịch.
- **Nhận dạng giọng nói**: thuật toán Viterbi trên mô hình Markov ẩn cũng là DP 2 chiều.
`,
  lessonPy: `
## 1. Khi nào cần 2 chiều?

Khi một chỉ số không đủ mô tả trạng thái. Ba tình huống điển hình:

1. **Hai dãy dữ liệu**: \`dp[i][j]\` = kết quả khi xét i ký tự đầu của chuỗi A và j ký tự đầu của B.
   *(so sánh chuỗi, khoảng cách chỉnh sửa, dãy con chung)*
2. **Lưới**: \`dp[r][c]\` = kết quả khi đứng tại ô (r, c). *(đếm đường đi, tổng nhỏ nhất)*
3. **Vị trí + tài nguyên**: \`dp[i][w]\` = giá trị tốt nhất khi xét i món đầu với sức chứa w.
   *(bài toán cái túi — knapsack)*

## 2. Khung tư duy — vẫn là ba câu hỏi cũ

Chỉ khác là trạng thái có hai chiều:
1. \`dp[i][j]\` nghĩa là gì? (phát biểu bằng lời!)
2. Truy hồi: \`dp[i][j]\` phụ thuộc những ô nào? *(thường là ô trên, ô trái, và ô chéo trên-trái)*
3. Cơ sở: hàng 0 và cột 0 bằng bao nhiêu?

**Mẹo cực kỳ hữu ích:** dùng bảng kích thước **(m+1) × (n+1)** với hàng/cột 0 làm "biên rỗng".
Nó xoá bỏ hầu hết các phép kiểm tra biên rườm rà. Trong Python, tạo bảng 2D đúng cách là
\`[[0] * (n+1) for _ in range(m+1)]\` — **không** dùng \`[[0]*(n+1)] * (m+1)\`, vì cách đó tạo
\`m+1\` tham chiếu tới **cùng một** list con, và sửa một hàng sẽ vô tình sửa tất cả các hàng khác!

## 3. Bài toán cái túi 0/1 — mẫu hình phải thuộc

\`\`\`
dp[i][w] = giá trị lớn nhất khi xét i món đầu tiên với sức chứa w

dp[i][w] = max(
    dp[i-1][w],                            # không lấy món i
    dp[i-1][w - weight[i]] + value[i]      # lấy món i (nếu vừa túi)
)
\`\`\`

Rất nhiều bài "khó" chỉ là knapsack đội lốt:
- *Partition Equal Subset Sum* → knapsack với sức chứa \`tổng/2\`, hỏi khả thi.
- *Target Sum* → knapsack đếm số cách.
- *Coin Change II* → knapsack không giới hạn số lượng (unbounded).

Nhận ra "đây là knapsack" là kỹ năng đáng giá nhất của chủ đề này.

## 4. Nén bộ nhớ từ 2D xuống 1D

Nếu \`dp[i][*]\` chỉ phụ thuộc \`dp[i-1][*]\`, ta chỉ cần **một list**:

\`\`\`python
# knapsack 0/1 với list 1 chiều — CHÚ Ý: vòng w phải duyệt NGƯỢC
for item in items:
    for w in range(W, item.weight - 1, -1):
        dp[w] = max(dp[w], dp[w - item.weight] + item.value)
\`\`\`

**Vì sao duyệt ngược?** Vì duyệt xuôi sẽ dùng giá trị *đã cập nhật ở vòng này* →
biến thành "được lấy món nhiều lần" (unbounded knapsack). Chi tiết một dòng này
quyết định bạn đang giải bài 0/1 hay bài không giới hạn — hay bị hỏi trong phỏng vấn.
\`range(W, item.weight - 1, -1)\` là cách viết Python cho "từ W xuống tới item.weight, bước -1".

## 5. Bẫy thường gặp

- Sai thứ tự vòng lặp → dùng giá trị chưa được tính.
- Nhầm chỉ số: \`dp[i][j]\` ứng với ký tự \`A[i-1]\` và \`B[j-1]\` khi dùng biên rỗng.
- Quên khởi tạo hàng/cột 0.
- Bảng quá lớn: \`dp[10⁴][10⁴]\` = 10⁸ ô → hết bộ nhớ. Phải nén xuống 1 chiều.
- **Bẫy Python riêng:** \`[[0]*n] * m\` tạo ra \`m\` tham chiếu tới CÙNG MỘT hàng — dùng list
  comprehension \`[[0]*n for _ in range(m)]\` để có các hàng độc lập.

## 6. Ứng dụng thực tế

- **git diff / so sánh văn bản**: dãy con chung dài nhất (LCS).
- **Sửa lỗi chính tả, gợi ý tìm kiếm**: khoảng cách Levenshtein (thư viện \`python-Levenshtein\`).
- **Sinh tin học**: căn chỉnh chuỗi DNA/protein (Smith-Waterman) — DP 2 chiều quy mô lớn.
- **Phân bổ nguồn lực có ràng buộc ngân sách**: knapsack trong quảng cáo, đầu tư, lập lịch.
- **Nhận dạng giọng nói**: thuật toán Viterbi trên mô hình Markov ẩn cũng là DP 2 chiều
  (thư viện \`hmmlearn\` của Python cài sẵn).
`,
  quiz: [
    {
      q: 'Trong knapsack 0/1 nén xuống mảng 1 chiều, vì sao vòng lặp sức chứa phải duyệt NGƯỢC?',
      options: [
        'Để chạy nhanh hơn',
        'Vì duyệt xuôi sẽ dùng giá trị vừa cập nhật trong cùng vòng, tương đương cho phép lấy một món nhiều lần',
        'Vì mảng được sắp xếp giảm dần',
        'Không quan trọng, cả hai chiều đều đúng',
      ],
      answer: 1,
      why: 'Duyệt ngược đảm bảo dp[w - weight] vẫn là giá trị của "hàng i-1". Duyệt xuôi biến bài 0/1 thành unbounded — đúng một dòng code phân biệt hai bài toán khác nhau.',
    },
    {
      q: 'Bài "chia mảng thành hai tập có tổng bằng nhau" thực chất là bài toán gì?',
      options: [
        'Sắp xếp',
        'Knapsack 0/1: có tồn tại tập con có tổng bằng tổng/2 hay không',
        'Đồ thị hai phía',
        'Cửa sổ trượt',
      ],
      answer: 1,
      why: 'Nếu tìm được tập con có tổng = tổng/2 thì phần còn lại tự động cũng bằng thế. Nhận ra "đây là knapsack đội lốt" là kỹ năng quan trọng nhất của chủ đề.',
    },
    {
      q: 'Với bài LCS của hai chuỗi dài m và n, độ phức tạp thời gian và bộ nhớ tối thiểu là bao nhiêu?',
      options: [
        'O(m·n) thời gian, O(m·n) bộ nhớ — không thể giảm',
        'O(m·n) thời gian, có thể giảm bộ nhớ xuống O(min(m,n)) nếu chỉ cần ĐỘ DÀI',
        'O(m+n) cả hai',
        'O(m·n·log n) thời gian',
      ],
      answer: 1,
      why: 'Vì mỗi hàng chỉ phụ thuộc hàng trước, ta có thể giữ hai hàng. Nhưng nếu cần dựng lại chuỗi LCS thực tế thì phải giữ cả bảng (hoặc dùng thuật toán Hirschberg chia để trị).',
    },
    {
      q: 'Trong bảng DP 2 chiều dùng biên rỗng (kích thước (m+1)×(n+1)), dp[i][j] tương ứng với ký tự nào?',
      options: [
        'A[i] và B[j]',
        'A[i-1] và B[j-1]',
        'A[i+1] và B[j+1]',
        'Không liên quan tới ký tự cụ thể',
      ],
      answer: 1,
      why: 'Vì hàng/cột 0 biểu diễn "chuỗi rỗng", nên dp[i][j] xét i ký tự ĐẦU TIÊN, tức ký tự cuối là A[i-1]. Lệch chỉ số này là nguồn lỗi số một của DP 2 chiều — hãy viết chú thích ngay khi code.',
    },
  ],
  quizPy: [
    {
      q: 'Trong knapsack 0/1 nén xuống list 1 chiều, vì sao vòng lặp sức chứa phải duyệt NGƯỢC?',
      options: [
        'Để chạy nhanh hơn',
        'Vì duyệt xuôi sẽ dùng giá trị vừa cập nhật trong cùng vòng, tương đương cho phép lấy một món nhiều lần',
        'Vì mảng được sắp xếp giảm dần',
        'Không quan trọng, cả hai chiều đều đúng',
      ],
      answer: 1,
      why: 'Duyệt ngược (`range(W, weight-1, -1)`) đảm bảo dp[w - weight] vẫn là giá trị của "hàng i-1". Duyệt xuôi biến bài 0/1 thành unbounded — đúng một dòng code phân biệt hai bài toán khác nhau.',
    },
    {
      q: 'Bài "chia mảng thành hai tập có tổng bằng nhau" thực chất là bài toán gì?',
      options: [
        'Sắp xếp',
        'Knapsack 0/1: có tồn tại tập con có tổng bằng tổng/2 hay không',
        'Đồ thị hai phía',
        'Cửa sổ trượt',
      ],
      answer: 1,
      why: 'Nếu tìm được tập con có tổng = tổng/2 thì phần còn lại tự động cũng bằng thế. Nhận ra "đây là knapsack đội lốt" là kỹ năng quan trọng nhất của chủ đề.',
    },
    {
      q: 'Với bài LCS của hai chuỗi dài m và n, độ phức tạp thời gian và bộ nhớ tối thiểu là bao nhiêu?',
      options: [
        'O(m·n) thời gian, O(m·n) bộ nhớ — không thể giảm',
        'O(m·n) thời gian, có thể giảm bộ nhớ xuống O(min(m,n)) nếu chỉ cần ĐỘ DÀI',
        'O(m+n) cả hai',
        'O(m·n·log n) thời gian',
      ],
      answer: 1,
      why: 'Vì mỗi hàng chỉ phụ thuộc hàng trước, ta có thể giữ hai list. Nhưng nếu cần dựng lại chuỗi LCS thực tế thì phải giữ cả bảng (hoặc dùng thuật toán Hirschberg chia để trị).',
    },
    {
      q: 'Trong bảng DP 2 chiều dùng biên rỗng (kích thước (m+1)×(n+1)), dp[i][j] tương ứng với ký tự nào?',
      options: [
        'A[i] và B[j]',
        'A[i-1] và B[j-1]',
        'A[i+1] và B[j+1]',
        'Không liên quan tới ký tự cụ thể',
      ],
      answer: 1,
      why: 'Vì hàng/cột 0 biểu diễn "chuỗi rỗng", nên dp[i][j] xét i ký tự ĐẦU TIÊN, tức ký tự cuối là A[i-1]. Lệch chỉ số này là nguồn lỗi số một của DP 2 chiều — hãy viết chú thích ngay khi code.',
    },
  ],
  problems: [
    {
      id: 'unique-paths',
      title: 'Đếm số đường đi trên lưới',
      en: 'Unique Paths',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'uniquePaths',
      statement: `
Một robot đứng ở góc trên-trái của lưới \`m × n\`. Nó chỉ được đi **xuống** hoặc **sang phải**.
Hỏi có bao nhiêu đường đi khác nhau tới góc dưới-phải?

**Ví dụ**
- \`m = 3, n = 7\` → \`28\`
- \`m = 3, n = 2\` → \`3\`
`,
      starter: `function uniquePaths(m, n) {\n  \n}`,
      starterPy: `def uniquePaths(m, n):\n    \n`,
      tests: [
        { args: [3, 7], expected: 28, name: 'Ví dụ 1' },
        { args: [3, 2], expected: 3, name: 'Ví dụ 2' },
        { args: [1, 1], expected: 1, name: 'Lưới 1x1' },
        { args: [1, 10], expected: 1, name: 'Một hàng — chỉ một đường' },
        { args: [7, 3], expected: 28, name: 'Đối xứng với ví dụ 1' },
        { args: [10, 10], expected: 48620, name: 'Lưới lớn' },
        { args: [3, 3], expected: 6, name: 'Lưới vuông nhỏ' },
      ],
      hints: [
        'Để tới ô (r, c), robot chỉ có thể đến từ ô bên trên (r-1, c) hoặc ô bên trái (r, c-1). Vậy số đường đi tới (r,c) = tổng của hai ô đó.',
        '`dp[r][c] = dp[r-1][c] + dp[r][c-1]`. Cơ sở: toàn bộ hàng đầu và cột đầu đều bằng 1 (chỉ có một cách đi thẳng).',
        'Tối ưu bộ nhớ: chỉ cần **một hàng**. Duyệt từng hàng, `dp[c] += dp[c-1]` — vì `dp[c]` trước khi cập nhật chính là giá trị hàng trên, còn `dp[c-1]` là ô bên trái đã cập nhật.',
      ],
      hintsPy: [
        'Để tới ô (r, c), robot chỉ có thể đến từ ô bên trên (r-1, c) hoặc ô bên trái (r, c-1). Vậy số đường đi tới (r,c) = tổng của hai ô đó.',
        '`dp[r][c] = dp[r-1][c] + dp[r][c-1]`. Cơ sở: toàn bộ hàng đầu và cột đầu đều bằng 1 (chỉ có một cách đi thẳng).',
        'Tối ưu bộ nhớ: chỉ cần **một list**. Duyệt từng hàng, `dp[c] += dp[c-1]` — vì `dp[c]` trước khi cập nhật chính là giá trị hàng trên, còn `dp[c-1]` là ô bên trái đã cập nhật.',
      ],
      approach: `
**Ba câu hỏi:**
1. **Trạng thái:** \`dp[r][c]\` = số đường đi từ (0,0) tới (r,c).
2. **Truy hồi:** \`dp[r][c] = dp[r-1][c] + dp[r][c-1]\` — hai nhóm đường đi rời nhau, phân theo bước cuối.
3. **Cơ sở:** \`dp[0][c] = dp[r][0] = 1\`.

\`\`\`
m=3, n=7
1  1  1  1  1  1  1
1  2  3  4  5  6  7
1  3  6 10 15 21 28   <- đáp án
\`\`\`
Bảng này chính là **tam giác Pascal** xoay nghiêng — không phải trùng hợp!

**Lời giải toán học O(min(m,n)):** mọi đường đi gồm đúng \`(m-1)\` bước xuống và \`(n-1)\` bước phải,
tổng \`m+n-2\` bước. Chọn vị trí cho các bước xuống → \`C(m+n-2, m-1)\`.

\`\`\`js
let res = 1;
for (let i = 1; i <= m - 1; i++) res = res * (n - 1 + i) / i;
return Math.round(res);
\`\`\`

Nêu được cả hai lời giải (DP và tổ hợp) trong phỏng vấn là điểm cộng lớn —
nó cho thấy bạn nhìn ra **cấu trúc toán học** phía sau bài toán chứ không chỉ áp khuôn.

**Biến thể:** có chướng ngại vật (Unique Paths II) → đặt \`dp[r][c] = 0\` tại ô có vật cản.
Lúc đó công thức tổ hợp không dùng được nữa — đây là lý do DP tổng quát hơn.
`,
      solution: `function uniquePaths(m, n) {
  // nén xuống một hàng: dp[c] vừa là "ô trên" (giá trị cũ) vừa là "ô hiện tại"
  const dp = new Array(n).fill(1);          // hàng đầu tiên toàn 1

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[c] += dp[c - 1];                   // dp[c](trên) + dp[c-1](trái)
    }
  }
  return dp[n - 1];
}`,
      solutionPy: `def uniquePaths(m, n):
    dp = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            dp[c] += dp[c - 1]
    return dp[n - 1]`,
      complexity: {
        question: 'Ngoài DP O(m·n), bài này còn lời giải nào tốt hơn?',
        options: [
          'Không có, DP là tối ưu',
          'Công thức tổ hợp C(m+n-2, m-1) — O(min(m,n)) thời gian, O(1) bộ nhớ',
          'Tìm kiếm nhị phân',
          'Sắp xếp lưới trước',
        ],
        answer: 1,
        why: 'Mọi đường đi là một hoán vị của (m-1) bước xuống và (n-1) bước phải → bài toán chọn tổ hợp. Nhưng khi có chướng ngại vật thì chỉ DP mới giải được — đó là đánh đổi giữa lời giải chuyên biệt và lời giải tổng quát.',
      },
      realWorld: 'Đếm số lộ trình hợp lệ trong lưới kho hàng cho robot AGV; tính số kịch bản trong cây quyết định lưới; và trong xác suất là đếm số đường đi của bước ngẫu nhiên (random walk).',
    },
    {
      id: 'longest-common-subsequence',
      title: 'Dãy con chung dài nhất',
      en: 'Longest Common Subsequence',
      difficulty: 'Medium',
      targetMinutes: 25,
      entry: 'longestCommonSubsequence',
      statement: `
Cho hai chuỗi \`text1\` và \`text2\`, trả về **độ dài dãy con chung dài nhất**.

Dãy con: xoá bớt một số ký tự (có thể không xoá) mà **không đổi thứ tự** các ký tự còn lại.

**Ví dụ**
- \`"abcde"\`, \`"ace"\` → \`3\` (dãy \`"ace"\`)
- \`"abc"\`, \`"def"\` → \`0\`
`,
      starter: `function longestCommonSubsequence(text1, text2) {\n  \n}`,
      starterPy: `def longestCommonSubsequence(text1, text2):\n    \n`,
      tests: [
        { args: ['abcde', 'ace'], expected: 3, name: 'Ví dụ chuẩn' },
        { args: ['abc', 'abc'], expected: 3, name: 'Hai chuỗi giống nhau' },
        { args: ['abc', 'def'], expected: 0, name: 'Không có ký tự chung' },
        { args: ['bl', 'yby'], expected: 1, name: 'Một ký tự chung' },
        { args: ['bsbininm', 'jmjkbkjkv'], expected: 1, name: 'Chuỗi nhiễu' },
        { args: ['oxcpqrsvwf', 'shmtulqrypy'], expected: 2, name: 'Hai ký tự chung liên tiếp' },
        { args: ['', 'abc'], expected: 0, name: 'Chuỗi rỗng' },
      ],
      hints: [
        'Trạng thái: `dp[i][j]` = độ dài LCS của `text1[0..i-1]` và `text2[0..j-1]` (dùng biên rỗng cho gọn).',
        'Nếu `text1[i-1] === text2[j-1]`: hai ký tự này ghép được với nhau → `dp[i][j] = dp[i-1][j-1] + 1`.',
        'Nếu khác nhau: phải bỏ một trong hai ký tự → `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`. Khởi tạo hàng 0 và cột 0 bằng 0 (LCS với chuỗi rỗng luôn là 0).',
      ],
      hintsPy: [
        'Trạng thái: `dp[i][j]` = độ dài LCS của `text1[0..i-1]` và `text2[0..j-1]` (dùng biên rỗng cho gọn).',
        'Nếu `text1[i-1] == text2[j-1]`: hai ký tự này ghép được với nhau → `dp[i][j] = dp[i-1][j-1] + 1`.',
        'Nếu khác nhau: phải bỏ một trong hai ký tự → `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`. Khởi tạo hàng 0 và cột 0 bằng 0. Có thể nén xuống hai list `prev`/`cur`.',
      ],
      diagnostics: [
        { test: 'includes\\s*\\(|indexOf\\s*\\(', message: 'Bài này không giải được bằng cách tìm chuỗi con — "dãy con" cho phép các ký tự KHÔNG liên tiếp. Cần DP 2 chiều.' },
        { test: 'text1\\[i\\]\\s*===\\s*text2\\[j\\]', message: 'Cẩn thận lệch chỉ số: với bảng có biên rỗng, dp[i][j] ứng với text1[i-1] và text2[j-1].' },
      ],
      diagnosticsPy: [
        { test: '\\bin\\s+text2\\b|\\.find\\s*\\(', message: 'Bài này không giải được bằng cách tìm chuỗi con — "dãy con" cho phép các ký tự KHÔNG liên tiếp. Cần DP 2 chiều.' },
        { test: 'text1\\[i\\]\\s*==\\s*text2\\[j\\]', message: 'Cẩn thận lệch chỉ số: với bảng có biên rỗng, dp[i][j] ứng với text1[i-1] và text2[j-1].' },
      ],
      approach: `
**Đây là bài DP 2 chiều mẫu mực nhất** — và cũng là thuật toán đứng sau \`git diff\`.

**Ba câu hỏi:**
1. **Trạng thái:** \`dp[i][j]\` = LCS của i ký tự đầu chuỗi 1 và j ký tự đầu chuỗi 2.
2. **Truy hồi:**
   - Nếu \`A[i-1] === B[j-1]\`: ta *chắc chắn* nên ghép cặp này → \`dp[i-1][j-1] + 1\`.
   - Nếu khác: phải hy sinh một ký tự → \`max(dp[i-1][j], dp[i][j-1])\`.
3. **Cơ sở:** hàng 0 và cột 0 đều bằng 0.

\`\`\`
      ""  a  c  e
  ""   0  0  0  0
  a    0  1  1  1
  b    0  1  1  1
  c    0  1  2  2
  d    0  1  2  2
  e    0  1  2  3   <- đáp án
\`\`\`

**Vì sao khi hai ký tự khớp thì chắc chắn nên ghép?** Đây là điểm cần chứng minh chứ đừng học vẹt:
giả sử có LCS tối ưu không ghép cặp (i-1, j-1). Ta luôn có thể sửa lời giải đó để ghép chúng
mà độ dài không giảm. Vì vậy ghép luôn là an toàn.

**Nén bộ nhớ:** mỗi hàng chỉ phụ thuộc hàng trước → giữ hai hàng, O(min(m,n)) bộ nhớ.
Nhưng nếu cần **dựng lại** chuỗi LCS thì phải giữ cả bảng để truy vết ngược.

**Họ bài toán liên quan (cùng khung):**
- Edit Distance (Levenshtein): thêm phép "thay thế" vào truy hồi.
- Longest Common Substring (liên tiếp): khi không khớp thì đặt về 0 thay vì lấy max.
- Chỉ một thay đổi nhỏ trong công thức → bài toán hoàn toàn khác. Hãy nhìn kỹ sự khác biệt đó.
`,
      solution: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  // dùng biên rỗng: dp[i][j] xét i ký tự đầu của text1, j ký tự đầu của text2
  let prev = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    const cur = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) cur[j] = prev[j - 1] + 1;
      else cur[j] = Math.max(prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[n];
}`,
      solutionPy: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    prev = [0] * (n + 1)
    for i in range(1, m + 1):
        cur = [0] * (n + 1)
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                cur[j] = prev[j - 1] + 1
            else:
                cur[j] = max(prev[j], cur[j - 1])
        prev = cur
    return prev[n]`,
      complexity: {
        question: 'Độ phức tạp thời gian và bộ nhớ (sau khi nén) của LCS?',
        options: [
          'O(m·n) thời gian, O(m·n) bộ nhớ',
          'O(m·n) thời gian, O(min(m,n)) bộ nhớ',
          'O(m+n) cả hai',
          'O(m·n·log n) thời gian',
        ],
        answer: 1,
        why: 'Phải điền m·n ô nên thời gian không giảm được (với thuật toán tổng quát). Nhưng vì mỗi hàng chỉ phụ thuộc hàng trước, bộ nhớ nén được xuống hai hàng.',
      },
      realWorld: '`git diff`, `diff` của Unix và mọi công cụ so sánh phiên bản đều dựa trên LCS. Ngoài ra: so sánh chuỗi DNA, phát hiện đạo văn, và đo mức tương đồng giữa hai chuỗi thao tác người dùng.',
    },
    {
      id: 'partition-equal-subset',
      title: 'Chia mảng thành hai phần bằng nhau',
      en: 'Partition Equal Subset Sum',
      difficulty: 'Medium',
      targetMinutes: 28,
      entry: 'canPartition',
      statement: `
Cho mảng số nguyên dương \`nums\`, xác định có thể chia nó thành **hai tập con có tổng bằng nhau** không.

**Ví dụ**
- \`[1,5,11,5]\` → \`true\` (\`[1,5,5]\` và \`[11]\`)
- \`[1,2,3,5]\` → \`false\`
`,
      starter: `function canPartition(nums) {\n  \n}`,
      starterPy: `def canPartition(nums):\n    \n`,
      tests: [
        { args: [[1, 5, 11, 5]], expected: true, name: 'Ví dụ 1' },
        { args: [[1, 2, 3, 5]], expected: false, name: 'Tổng lẻ' },
        { args: [[1, 1]], expected: true, name: 'Hai phần tử bằng nhau' },
        { args: [[1, 2, 3, 4]], expected: true, name: '1+4 = 2+3' },
        { args: [[2, 2, 3, 5]], expected: false, name: 'Tổng chẵn nhưng không chia được' },
        { args: [[100]], expected: false, name: 'Một phần tử' },
        { args: [[1, 2, 5]], expected: false, name: 'Tổng lẻ (8/2=4 nhưng không tạo được)' },
        { args: [[3, 3, 3, 4, 5]], expected: true, name: '3+4 = 3+3+... kiểm tra kỹ' },
      ],
      hints: [
        'Nhận xét đầu tiên: nếu tổng mảng là **số lẻ** thì chắc chắn không chia được → trả về false ngay.',
        'Nếu tìm được tập con có tổng = `tổng/2` thì phần còn lại tự động cũng bằng thế. Vậy bài toán rút gọn thành: **có tồn tại tập con có tổng bằng target = tổng/2 không?** — đó chính là knapsack 0/1 dạng khả thi.',
        'Dùng mảng boolean `dp[s]` = "có thể tạo ra tổng s không". Khởi tạo `dp[0] = true`. Với mỗi số, duyệt `s` từ **target xuống num** (ngược!) và đặt `dp[s] = dp[s] || dp[s - num]`.',
      ],
      hintsPy: [
        'Nhận xét đầu tiên: nếu tổng mảng là **số lẻ** thì chắc chắn không chia được → trả về False ngay.',
        'Nếu tìm được tập con có tổng = `tổng/2` thì phần còn lại tự động cũng bằng thế. Vậy bài toán rút gọn thành: **có tồn tại tập con có tổng bằng target = tổng/2 không?** — đó chính là knapsack 0/1 dạng khả thi.',
        'Dùng list boolean `dp[s]` = "có thể tạo ra tổng s không". Khởi tạo `dp[0] = True`. Với mỗi số, duyệt `s` bằng `range(target, num - 1, -1)` (ngược!) và đặt `dp[s] = dp[s] or dp[s - num]`.',
      ],
      diagnostics: [
        { test: 'for\\s*\\(\\s*let\\s+s\\s*=\\s*(num|nums\\[i\\])', message: 'Duyệt xuôi sẽ cho phép dùng lại cùng một số nhiều lần (unbounded knapsack) → kết quả sai. Với knapsack 0/1 phải duyệt NGƯỢC từ target về num.' },
        { test: 'sort\\s*\\([\\s\\S]{0,60}\\)[\\s\\S]{0,150}return', message: 'Chiến lược tham lam (xếp số lớn vào bên nhẹ hơn) không đúng cho bài này. Ví dụ [2,2,3,5] tổng 12, greedy dễ ra kết quả sai.' },
      ],
      diagnosticsPy: [
        { test: 'range\\s*\\(\\s*num\\s*,\\s*target', message: 'Duyệt xuôi sẽ cho phép dùng lại cùng một số nhiều lần (unbounded knapsack) → kết quả sai. Với knapsack 0/1 phải duyệt NGƯỢC: `range(target, num - 1, -1)`.' },
        { test: '\\.sort\\s*\\(\\)[\\s\\S]{0,150}return|sorted\\s*\\([\\s\\S]{0,60}\\)[\\s\\S]{0,150}return', message: 'Chiến lược tham lam (xếp số lớn vào bên nhẹ hơn) không đúng cho bài này. Ví dụ [2,2,3,5] tổng 12, greedy dễ ra kết quả sai.' },
      ],
      approach: `
**Bước 1 — Rút gọn bài toán (kỹ năng quan trọng nhất).**
"Chia thành hai phần bằng nhau" ⟺ "tìm tập con có tổng = tổng/2".
Ngay khi phát biểu lại như vậy, bạn nhận ra đây là **knapsack 0/1** dạng khả thi.

**Bước 2 — Loại trừ nhanh.** Tổng lẻ → false ngay lập tức.

**Bước 3 — DP.**
\`dp[s]\` = có thể tạo ra tổng s bằng một tập con nào đó không.
\`\`\`
dp[0] = true
với mỗi num:
  với s từ target xuống num:      // NGƯỢC!
    dp[s] = dp[s] || dp[s - num]
\`\`\`

\`\`\`
nums=[1,5,11,5], tổng=22, target=11
sau 1:      dp: {0,1}
sau 5:      dp: {0,1,5,6}
sau 11:     dp: {0,1,5,6,11,12,16,17}
=> dp[11] = true ✔
\`\`\`

**Vì sao phải duyệt ngược?** Đây là điểm mấu chốt.
Nếu duyệt xuôi, \`dp[s - num]\` có thể **vừa được cập nhật ở chính vòng này** —
nghĩa là bạn đã dùng \`num\` một lần rồi lại dùng tiếp. Đó là bài "unbounded knapsack",
không phải bài này. Một chi tiết nhỏ nhưng thay đổi hoàn toàn ngữ nghĩa.

**Tối ưu thêm (đáng nêu):** dùng \`BigInt\` làm bitset — \`mask |= mask << BigInt(num)\` —
mỗi số chỉ tốn một phép dịch bit, nhanh hơn hàng chục lần. Đây là mẹo được dùng thật trong
các bài thi lập trình.
`,
      solution: `function canPartition(nums) {
  const total = nums.reduce((s, x) => s + x, 0);
  if (total % 2 !== 0) return false;             // tổng lẻ -> chắc chắn không chia được

  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;                                  // tổng 0 luôn tạo được (tập rỗng)

  for (const num of nums) {
    for (let s = target; s >= num; s--) {        // NGƯỢC: mỗi số chỉ dùng một lần
      if (dp[s - num]) dp[s] = true;
    }
    if (dp[target]) return true;                 // thoát sớm
  }
  return dp[target];
}`,
      solutionPy: `def canPartition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for s in range(target, num - 1, -1):
            if dp[s - num]:
                dp[s] = True
        if dp[target]:
            return True
    return dp[target]`,
      complexity: {
        question: 'Độ phức tạp thời gian và bộ nhớ với n số và tổng S?',
        options: [
          'O(n) / O(1)',
          'O(n · S) thời gian, O(S) bộ nhớ — pseudo-polynomial',
          'O(2ⁿ) / O(n)',
          'O(n log n) / O(n)',
        ],
        answer: 1,
        why: 'Bài Subset Sum là NP-hard, nhưng có lời giải pseudo-polynomial O(n·S). Nó chỉ khả thi khi S đủ nhỏ — với S = 10⁹ thì bảng DP không lưu nổi.',
      },
      realWorld: 'Cân bằng tải: chia n tác vụ cho 2 máy sao cho thời gian bằng nhau. Rộng hơn là bài toán phân chia công bằng — chia tài sản, cân bằng dữ liệu giữa các shard, phân bổ ngân sách giữa hai hạng mục.',
    },
  ],
},

/* ==================================================================== */
{
  id: 'greedy',
  name: 'Tham lam',
  en: 'Greedy',
  icon: '🎯',
  days: [27],
  summary: 'Chọn tốt nhất tại chỗ — nhanh và ngắn, nhưng phải CHỨNG MINH được là đúng.',
  lesson: `
## 1. Ý tưởng cốt lõi

> Greedy = ở mỗi bước, chọn phương án **tốt nhất tại thời điểm đó** và **không bao giờ nhìn lại**.

Ưu điểm: thường O(n) hoặc O(n log n), code ngắn gọn.
Nhược điểm chí mạng: **rất hay sai** và cái sai đó khó phát hiện — nó chạy đúng với ví dụ trong đề
nhưng sai với test ẩn.

## 2. Khi nào greedy đúng?

Cần một trong hai tính chất (lý tưởng là cả hai):

1. **Tính chất lựa chọn tham lam** (greedy choice property):
   tồn tại một lời giải tối ưu *chứa* lựa chọn tham lam ở bước đầu tiên.
2. **Cấu trúc con tối ưu**: sau khi chọn, bài toán còn lại vẫn cùng dạng.

**Ba cách kiểm tra nhanh trong phỏng vấn:**
- Thử tìm **phản ví dụ** trong 30 giây. Không tìm được → có thể greedy đúng.
- **Lập luận trao đổi (exchange argument)**: giả sử có lời giải tối ưu khác lựa chọn của tôi;
  chứng minh có thể "đổi" nó về lựa chọn của tôi mà không tệ đi.
- So sánh với DP trên vài ví dụ nhỏ.

## 3. Greedy vs DP — bảng phân biệt

| | Greedy | DP |
|---|---|---|
| Số lựa chọn xét ở mỗi bước | 1 (tốt nhất tại chỗ) | tất cả |
| Có quay lại không | không | có (qua bảng trạng thái) |
| Chi phí | O(n) ~ O(n log n) | thường O(n²) trở lên |
| Rủi ro | có thể sai | luôn đúng nếu trạng thái đúng |

**Ví dụ kinh điển:** Coin Change với \`[1,3,4]\`, target 6 → greedy cho 3 đồng, DP cho 2 đồng.
Nhưng bài *Jump Game* thì greedy đúng và DP là thừa thãi. Sự khác biệt nằm ở việc
lựa chọn hiện tại có **chặn** khả năng tương lai hay không.

## 4. Ba mẫu greedy hay gặp

1. **Sắp xếp rồi quét**: xếp lịch (sắp theo thời gian kết thúc), gộp khoảng, bài toán phân công.
2. **Duy trì một cực trị đang chạy**: Kadane (tổng lớn nhất), Jump Game (tầm xa nhất),
   Best Time to Buy Stock (đáy thấp nhất).
3. **Đổi tài nguyên bằng heap**: luôn phục vụ yêu cầu "cấp bách nhất" tiếp theo.

## 5. Bẫy thường gặp

- Áp greedy mà không kiểm chứng → sai âm thầm.
- Sắp xếp theo **tiêu chí sai** (bài xếp lịch: phải sắp theo *thời gian kết thúc*, không phải thời gian bắt đầu
  hay độ dài).
- Bỏ qua trường hợp biên: mảng rỗng, toàn số âm.

## 6. Ứng dụng thực tế

- **Nén Huffman**: luôn gộp hai nút tần suất nhỏ nhất — greedy có chứng minh chặt chẽ.
- **Lập lịch CPU**: shortest job first tối ưu thời gian chờ trung bình.
- **Định tuyến gói tin, cân bằng tải**: chọn đường/máy chủ tốt nhất tại thời điểm hiện tại.
- **Thuật toán Dijkstra và Prim** đều là greedy (có chứng minh đúng).
- **Đặt giá quảng cáo, phân bổ ngân sách** theo tỉ lệ hiệu quả giảm dần.
`,
  lessonPy: `
## 1. Ý tưởng cốt lõi

> Greedy = ở mỗi bước, chọn phương án **tốt nhất tại thời điểm đó** và **không bao giờ nhìn lại**.

Ưu điểm: thường O(n) hoặc O(n log n), code ngắn gọn.
Nhược điểm chí mạng: **rất hay sai** và cái sai đó khó phát hiện — nó chạy đúng với ví dụ trong đề
nhưng sai với test ẩn.

## 2. Khi nào greedy đúng?

Cần một trong hai tính chất (lý tưởng là cả hai):

1. **Tính chất lựa chọn tham lam** (greedy choice property):
   tồn tại một lời giải tối ưu *chứa* lựa chọn tham lam ở bước đầu tiên.
2. **Cấu trúc con tối ưu**: sau khi chọn, bài toán còn lại vẫn cùng dạng.

**Ba cách kiểm tra nhanh trong phỏng vấn:**
- Thử tìm **phản ví dụ** trong 30 giây. Không tìm được → có thể greedy đúng.
- **Lập luận trao đổi (exchange argument)**: giả sử có lời giải tối ưu khác lựa chọn của tôi;
  chứng minh có thể "đổi" nó về lựa chọn của tôi mà không tệ đi.
- So sánh với DP trên vài ví dụ nhỏ.

## 3. Greedy vs DP — bảng phân biệt

| | Greedy | DP |
|---|---|---|
| Số lựa chọn xét ở mỗi bước | 1 (tốt nhất tại chỗ) | tất cả |
| Có quay lại không | không | có (qua bảng trạng thái) |
| Chi phí | O(n) ~ O(n log n) | thường O(n²) trở lên |
| Rủi ro | có thể sai | luôn đúng nếu trạng thái đúng |

**Ví dụ kinh điển:** Coin Change với \`[1,3,4]\`, target 6 → greedy cho 3 đồng, DP cho 2 đồng.
Nhưng bài *Jump Game* thì greedy đúng và DP là thừa thãi. Sự khác biệt nằm ở việc
lựa chọn hiện tại có **chặn** khả năng tương lai hay không.

## 4. Ba mẫu greedy hay gặp

1. **Sắp xếp rồi quét** (\`sorted(..., key=...)\`): xếp lịch (sắp theo thời gian kết thúc), gộp khoảng, bài toán phân công.
2. **Duy trì một cực trị đang chạy**: Kadane (tổng lớn nhất), Jump Game (tầm xa nhất),
   Best Time to Buy Stock (đáy thấp nhất).
3. **Đổi tài nguyên bằng heap** (\`heapq\`): luôn phục vụ yêu cầu "cấp bách nhất" tiếp theo.

## 5. Bẫy thường gặp

- Áp greedy mà không kiểm chứng → sai âm thầm.
- Sắp xếp theo **tiêu chí sai** (bài xếp lịch: phải sắp theo *thời gian kết thúc*, không phải thời gian bắt đầu
  hay độ dài) — nhớ dùng đúng \`key=lambda x: x[1]\`.
- Bỏ qua trường hợp biên: mảng rỗng, toàn số âm.

## 6. Ứng dụng thực tế

- **Nén Huffman**: luôn gộp hai nút tần suất nhỏ nhất — greedy có chứng minh chặt chẽ.
- **Lập lịch CPU**: shortest job first tối ưu thời gian chờ trung bình.
- **Định tuyến gói tin, cân bằng tải**: chọn đường/máy chủ tốt nhất tại thời điểm hiện tại.
- **Thuật toán Dijkstra và Prim** đều là greedy (có chứng minh đúng).
- **Đặt giá quảng cáo, phân bổ ngân sách** theo tỉ lệ hiệu quả giảm dần.
`,
  quiz: [
    {
      q: 'Cách thuyết phục nhất để chứng minh một thuật toán tham lam là đúng?',
      options: [
        'Chạy thử với nhiều test case',
        'Lập luận trao đổi (exchange argument): chứng minh mọi lời giải tối ưu đều có thể biến đổi thành lời giải chứa lựa chọn tham lam mà không tệ đi',
        'So sánh độ phức tạp với DP',
        'Kiểm tra mảng đã được sắp xếp',
      ],
      answer: 1,
      why: 'Test nhiều không chứng minh được gì (greedy sai thường vẫn qua test đơn giản). Exchange argument là công cụ chuẩn — và nói ra nó trong phỏng vấn thể hiện chiều sâu tư duy.',
    },
    {
      q: 'Trong bài Maximum Subarray (Kadane), tại mỗi vị trí ta quyết định điều gì?',
      options: [
        'Có sắp xếp lại mảng hay không',
        'Nối tiếp đoạn con hiện tại, hay bắt đầu đoạn mới tại phần tử này',
        'Chọn phần tử lớn nhất',
        'Chia mảng thành hai nửa',
      ],
      answer: 1,
      why: '`cur = max(x, cur + x)`. Nếu tổng tích luỹ đang âm thì nó chỉ làm hại — vứt đi và bắt đầu lại. Đây là greedy có chứng minh chặt và cũng là DP với trạng thái O(1).',
    },
    {
      q: 'Bài xếp lịch "chọn nhiều cuộc họp không chồng chéo nhất" nên sắp xếp theo tiêu chí nào?',
      options: [
        'Thời gian bắt đầu sớm nhất',
        'Thời gian KẾT THÚC sớm nhất',
        'Cuộc họp ngắn nhất',
        'Số người tham dự ít nhất',
      ],
      answer: 1,
      why: 'Kết thúc sớm nhất để lại nhiều thời gian nhất cho phần còn lại. Sắp theo thời gian bắt đầu hay độ dài đều có phản ví dụ — chọn đúng tiêu chí sắp xếp chính là chọn đúng thuật toán.',
    },
    {
      q: 'Vì sao greedy đúng cho bài Jump Game nhưng sai cho bài Coin Change?',
      options: [
        'Vì Jump Game có mảng nhỏ hơn',
        'Vì trong Jump Game, "đi xa nhất có thể" không loại bỏ khả năng nào ở tương lai; còn trong Coin Change, chọn đồng xu lớn có thể khiến phần còn lại cần nhiều xu hơn',
        'Vì Coin Change có số âm',
        'Vì Jump Game đã được sắp xếp',
      ],
      answer: 1,
      why: 'Đây là ranh giới cốt lõi. Greedy đúng khi lựa chọn hiện tại KHÔNG thu hẹp không gian nghiệm tương lai. Hãy luôn tự hỏi câu này trước khi dùng greedy.',
    },
  ],
  quizPy: [
    {
      q: 'Cách thuyết phục nhất để chứng minh một thuật toán tham lam là đúng?',
      options: [
        'Chạy thử với nhiều test case',
        'Lập luận trao đổi (exchange argument): chứng minh mọi lời giải tối ưu đều có thể biến đổi thành lời giải chứa lựa chọn tham lam mà không tệ đi',
        'So sánh độ phức tạp với DP',
        'Kiểm tra mảng đã được sắp xếp',
      ],
      answer: 1,
      why: 'Test nhiều không chứng minh được gì (greedy sai thường vẫn qua test đơn giản). Exchange argument là công cụ chuẩn — và nói ra nó trong phỏng vấn thể hiện chiều sâu tư duy.',
    },
    {
      q: 'Trong bài Maximum Subarray (Kadane), tại mỗi vị trí ta quyết định điều gì?',
      options: [
        'Có sắp xếp lại mảng hay không',
        'Nối tiếp đoạn con hiện tại, hay bắt đầu đoạn mới tại phần tử này',
        'Chọn phần tử lớn nhất',
        'Chia mảng thành hai nửa',
      ],
      answer: 1,
      why: '`cur = max(x, cur + x)`. Nếu tổng tích luỹ đang âm thì nó chỉ làm hại — vứt đi và bắt đầu lại. Đây là greedy có chứng minh chặt và cũng là DP với trạng thái O(1).',
    },
    {
      q: 'Bài xếp lịch "chọn nhiều cuộc họp không chồng chéo nhất" nên sắp xếp theo tiêu chí nào?',
      options: [
        'Thời gian bắt đầu sớm nhất',
        'Thời gian KẾT THÚC sớm nhất',
        'Cuộc họp ngắn nhất',
        'Số người tham dự ít nhất',
      ],
      answer: 1,
      why: 'Kết thúc sớm nhất để lại nhiều thời gian nhất cho phần còn lại. Sắp theo thời gian bắt đầu hay độ dài đều có phản ví dụ — chọn đúng `key=lambda x: x[1]` khi sort chính là chọn đúng thuật toán.',
    },
    {
      q: 'Vì sao greedy đúng cho bài Jump Game nhưng sai cho bài Coin Change?',
      options: [
        'Vì Jump Game có mảng nhỏ hơn',
        'Vì trong Jump Game, "đi xa nhất có thể" không loại bỏ khả năng nào ở tương lai; còn trong Coin Change, chọn đồng xu lớn có thể khiến phần còn lại cần nhiều xu hơn',
        'Vì Coin Change có số âm',
        'Vì Jump Game đã được sắp xếp',
      ],
      answer: 1,
      why: 'Đây là ranh giới cốt lõi. Greedy đúng khi lựa chọn hiện tại KHÔNG thu hẹp không gian nghiệm tương lai. Hãy luôn tự hỏi câu này trước khi dùng greedy.',
    },
  ],
  problems: [
    {
      id: 'maximum-subarray',
      title: 'Đoạn con có tổng lớn nhất (Kadane)',
      en: 'Maximum Subarray',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'maxSubArray',
      statement: `
Cho mảng \`nums\`, tìm **đoạn con liên tiếp** (ít nhất một phần tử) có tổng lớn nhất và trả về tổng đó.

**Ví dụ**
- \`[-2,1,-3,4,-1,2,1,-5,4]\` → \`6\` (đoạn \`[4,-1,2,1]\`)
- \`[-1]\` → \`-1\`
- \`[5,4,-1,7,8]\` → \`23\`
`,
      starter: `function maxSubArray(nums) {\n  \n}`,
      starterPy: `def maxSubArray(nums):\n    \n`,
      tests: [
        { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, name: 'Ví dụ chuẩn' },
        { args: [[1]], expected: 1, name: 'Một phần tử' },
        { args: [[5, 4, -1, 7, 8]], expected: 23, name: 'Gần như toàn dương' },
        { args: [[-1]], expected: -1, name: 'Một số âm' },
        { args: [[-2, -1]], expected: -1, name: 'Toàn số âm — phải lấy số lớn nhất' },
        { args: [[-3, -2, -5, -1]], expected: -1, name: 'Toàn âm' },
        { args: [[1, 2, -1, 2]], expected: 4, name: 'Vượt qua số âm nhỏ' },
      ],
      perfTests: [{ build: () => [Array.from({ length: 200000 }, (_, i) => ((i * 7919) % 21) - 10)], name: 'Hiệu năng: n=200.000' }],
      hints: [
        'Câu hỏi then chốt tại mỗi phần tử: "tôi nên **nối tiếp** đoạn con đang có, hay **bắt đầu lại** từ phần tử này?"',
        'Câu trả lời: nếu tổng tích luỹ hiện tại đang **âm**, nó chỉ làm giảm mọi thứ phía sau → vứt đi. `cur = Math.max(x, cur + x)`.',
        'Cẩn thận với mảng toàn số âm: khởi tạo `best = -Infinity` (hoặc `nums[0]`), **không** khởi tạo bằng 0 — nếu không, test `[-2,-1]` sẽ trả về 0 thay vì -1.',
      ],
      hintsPy: [
        'Câu hỏi then chốt tại mỗi phần tử: "tôi nên **nối tiếp** đoạn con đang có, hay **bắt đầu lại** từ phần tử này?"',
        'Câu trả lời: nếu tổng tích luỹ hiện tại đang **âm**, nó chỉ làm giảm mọi thứ phía sau → vứt đi. `cur = max(x, cur + x)`.',
        'Cẩn thận với mảng toàn số âm: khởi tạo `best = nums[0]`, **không** khởi tạo bằng 0 — nếu không, test `[-2,-1]` sẽ trả về 0 thay vì -1.',
      ],
      diagnostics: [
        { test: 'best\\s*=\\s*0|max\\s*=\\s*0', message: 'Khởi tạo đáp án bằng 0 sẽ sai với mảng toàn số âm (đề yêu cầu đoạn con có ít nhất 1 phần tử). Hãy khởi tạo bằng `-Infinity` hoặc `nums[0]`.' },
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lồng nhau là O(n²). Kadane chỉ cần một lượt duyệt O(n).' },
      ],
      diagnosticsPy: [
        { test: 'best\\s*=\\s*0|cur\\s*=\\s*0\\b', message: 'Khởi tạo đáp án bằng 0 sẽ sai với mảng toàn số âm (đề yêu cầu đoạn con có ít nhất 1 phần tử). Hãy khởi tạo bằng `nums[0]`.' },
        { test: 'for\\s+\\w+[\\s\\S]{0,200}for\\s+\\w+', message: 'Hai vòng lồng nhau là O(n²). Kadane chỉ cần một lượt duyệt O(n).' },
      ],
      approach: `
**Thuật toán Kadane** — vừa là greedy vừa là DP, nên nó là bài học hoàn hảo về ranh giới hai chủ đề.

**Góc nhìn DP:** \`dp[i]\` = tổng lớn nhất của đoạn con **kết thúc tại i**.
\`\`\`
dp[i] = max(nums[i], dp[i-1] + nums[i])
\`\`\`
Đáp án = \`max(dp)\`. Vì \`dp[i]\` chỉ cần \`dp[i-1]\` → nén xuống một biến → O(1) bộ nhớ.

**Góc nhìn greedy:** nếu tổng đang tích luỹ là **âm**, nó là gánh nặng cho mọi phần tử phía sau
→ vứt bỏ ngay. Quyết định này là tối ưu và không cần nhìn lại.

\`\`\`
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
cur  = [-2, 1, -2, 4,  3, 5, 6,  1, 5]
best = [-2, 1,  1, 4,  4, 5, 6,  6, 6]  -> 6 ✔
\`\`\`

**Bẫy toàn số âm:** với \`[-3,-2,-5,-1]\`, đáp án là -1 (đoạn con phải có ít nhất một phần tử).
Nếu bạn khởi tạo \`best = 0\` thì sai. Đây là test đầu tiên người phỏng vấn sẽ đưa ra.

**Câu hỏi tiếp theo thường gặp:** trả về **chỉ số** của đoạn con? → lưu thêm biến \`start\`,
cập nhật \`start = i\` mỗi khi bạn "bắt đầu lại".

**Biến thể:** đoạn con có tổng lớn nhất trong mảng **vòng tròn** → tính max thường và
"max = tổng - đoạn nhỏ nhất", rồi lấy lớn hơn (chú ý trường hợp toàn âm).
`,
      solution: `function maxSubArray(nums) {
  let cur = nums[0];
  let best = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // nối tiếp đoạn cũ, hay bắt đầu lại từ nums[i]?
    cur = Math.max(nums[i], cur + nums[i]);
    if (cur > best) best = cur;
  }
  return best;
}`,
      solutionPy: `def maxSubArray(nums):
    cur = best = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
      complexity: {
        question: 'Kadane nên được coi là thuật toán gì?',
        options: [
          'Chỉ là greedy',
          'Vừa là DP (dp[i] = tổng lớn nhất kết thúc tại i) vừa là greedy (vứt bỏ tiền tố âm) — hai góc nhìn của cùng một thuật toán',
          'Chia để trị',
          'Cửa sổ trượt',
        ],
        answer: 1,
        why: 'Kadane là ví dụ đẹp cho thấy greedy và DP không phải hai thế giới tách biệt: greedy chính là DP mà trạng thái rút gọn còn O(1) và quyết định địa phương chứng minh được là tối ưu.',
      },
      realWorld: 'Tìm khoảng thời gian sinh lời nhất trong chuỗi lãi/lỗ; xác định đoạn tín hiệu mạnh nhất trong dữ liệu cảm biến; tìm vùng ảnh có độ tương phản tích luỹ cao nhất.',
    },
    {
      id: 'jump-game',
      title: 'Trò chơi nhảy',
      en: 'Jump Game',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'canJump',
      statement: `
Bạn đứng ở vị trí đầu mảng \`nums\`. Mỗi \`nums[i]\` là **số bước tối đa** bạn có thể nhảy từ vị trí i.
Trả về \`true\` nếu có thể tới được vị trí cuối cùng.

**Ví dụ**
- \`[2,3,1,1,4]\` → \`true\` (0→1→4)
- \`[3,2,1,0,4]\` → \`false\` (luôn kẹt ở chỉ số 3)
`,
      starter: `function canJump(nums) {\n  \n}`,
      starterPy: `def canJump(nums):\n    \n`,
      tests: [
        { args: [[2, 3, 1, 1, 4]], expected: true, name: 'Đi được' },
        { args: [[3, 2, 1, 0, 4]], expected: false, name: 'Kẹt ở số 0' },
        { args: [[0]], expected: true, name: 'Đã ở đích' },
        { args: [[2, 0, 0]], expected: true, name: 'Nhảy qua các số 0' },
        { args: [[1, 0, 1, 0]], expected: false, name: 'Kẹt sớm' },
        { args: [[1, 1, 1, 1]], expected: true, name: 'Bước từng bước' },
        { args: [[2, 5, 0, 0]], expected: true, name: 'Nhảy xa vượt qua' },
      ],
      perfTests: [{ build: () => [Array.from({ length: 100000 }, () => 3)], expected: true, name: 'Hiệu năng: n=100.000' }],
      hints: [
        'Đừng thử mọi đường nhảy (đó là hàm mũ). Chỉ cần theo dõi **một con số**: vị trí xa nhất bạn có thể với tới tính tới hiện tại.',
        'Duyệt i từ 0: nếu `i > reach` thì bạn không bao giờ tới được i → trả về false. Ngược lại cập nhật `reach = Math.max(reach, i + nums[i])`.',
        'Nếu `reach >= n - 1` thì có thể trả về true ngay. Vì sao greedy đúng? Vì "với tới được xa hơn" không bao giờ làm mất đi khả năng nào — không có đánh đổi ở đây.',
      ],
      hintsPy: [
        'Đừng thử mọi đường nhảy (đó là hàm mũ). Chỉ cần theo dõi **một con số**: vị trí xa nhất bạn có thể với tới tính tới hiện tại.',
        'Duyệt i từ 0 (dùng `enumerate(nums)`): nếu `i > reach` thì bạn không bao giờ tới được i → trả về False. Ngược lại cập nhật `reach = max(reach, i + step)`.',
        'Nếu `reach >= len(nums) - 1` thì có thể trả về True ngay. Vì sao greedy đúng? Vì "với tới được xa hơn" không bao giờ làm mất đi khả năng nào — không có đánh đổi ở đây.',
      ],
      diagnostics: [
        { test: 'canJump\\s*\\([\\s\\S]{0,200}canJump\\s*\\(', message: 'Đệ quy thử mọi bước nhảy là O(2ⁿ) — sẽ hết giờ. Chỉ cần một biến "tầm với xa nhất".' },
        { test: 'dp\\s*=\\s*new Array', message: 'DP O(n²) chạy đúng nhưng thừa. Greedy O(n) với một biến là lời giải chuẩn cho bài này — hãy tìm ra vì sao greedy hợp lệ.' },
      ],
      diagnosticsPy: [
        { test: 'canJump\\s*\\([\\s\\S]{0,200}canJump\\s*\\(', message: 'Đệ quy thử mọi bước nhảy là O(2ⁿ) — sẽ hết giờ. Chỉ cần một biến "tầm với xa nhất".' },
        { test: '\\[0\\]\\s*\\*\\s*len\\(nums\\)', message: 'DP O(n²) chạy đúng nhưng thừa. Greedy O(n) với một biến là lời giải chuẩn cho bài này — hãy tìm ra vì sao greedy hợp lệ.' },
      ],
      approach: `
**Vì sao greedy đúng ở đây mà sai ở Coin Change?**
Vì "với tới xa hơn" **không loại bỏ** bất kỳ khả năng nào — tập vị trí đến được chỉ mở rộng.
Không có sự đánh đổi nào cả. Trong Coin Change, chọn một đồng xu lớn **tiêu tốn** ngân sách
và có thể khiến phần còn lại tệ hơn. Đó chính là ranh giới.

**Thuật toán (một biến duy nhất):**
\`\`\`js
let reach = 0;
for (let i = 0; i < nums.length; i++) {
  if (i > reach) return false;            // có một khoảng trống không vượt qua được
  reach = Math.max(reach, i + nums[i]);
}
return true;
\`\`\`

\`\`\`
nums = [3,2,1,0,4]
i=0 reach=3
i=1 reach=3
i=2 reach=3
i=3 reach=3   (0 bước)
i=4 > reach=3 -> false ✔
\`\`\`

**Cách nhìn ngược (cũng hay):** đi từ cuối về đầu, giữ biến \`goal = n-1\`.
Nếu \`i + nums[i] >= goal\` thì \`goal = i\`. Cuối cùng kiểm tra \`goal === 0\`.
Hai cách đều O(n) — nêu cả hai cho thấy bạn hiểu bài chứ không thuộc lòng.

**Jump Game II** (số bước nhảy **ít nhất**) khó hơn một bậc: dùng greedy theo "tầng" —
giống BFS, mỗi tầng là tập vị trí đến được với cùng số bước nhảy.
`,
      solution: `function canJump(nums) {
  let reach = 0;                             // vị trí xa nhất có thể với tới

  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;             // gặp khoảng trống -> kẹt
    reach = Math.max(reach, i + nums[i]);
    if (reach >= nums.length - 1) return true;
  }
  return true;
}`,
      solutionPy: `def canJump(nums):
    reach = 0
    for i, step in enumerate(nums):
        if i > reach:
            return False
        reach = max(reach, i + step)
        if reach >= len(nums) - 1:
            return True
    return True`,
      complexity: {
        question: 'Vì sao chiến lược tham lam "luôn cập nhật tầm với xa nhất" là đúng ở bài này?',
        options: [
          'Vì mảng đã được sắp xếp',
          'Vì mở rộng tầm với không bao giờ loại bỏ khả năng nào — tập vị trí đến được chỉ lớn dần, không có đánh đổi',
          'Vì mọi phần tử đều dương',
          'Vì n luôn nhỏ',
        ],
        answer: 1,
        why: 'Đây là câu hỏi phân biệt "thuộc bài" và "hiểu bài". Greedy đúng khi lựa chọn hiện tại không thu hẹp không gian nghiệm tương lai — điều kiện đó thoả ở đây và không thoả ở Coin Change.',
      },
      realWorld: 'Kiểm tra tính khả thi của chuỗi chuyển tiếp: trạm sạc xe điện dọc tuyến đường (đi được tới cuối không?), vùng phủ sóng nối tiếp, hay chuỗi phiên bản nâng cấp phần mềm tương thích.',
    },
    {
      id: 'gas-station',
      title: 'Trạm xăng',
      en: 'Gas Station',
      difficulty: 'Medium',
      targetMinutes: 25,
      entry: 'canCompleteCircuit',
      statement: `
Có \`n\` trạm xăng xếp thành **vòng tròn**. Trạm i có \`gas[i]\` lít xăng, và đi từ trạm i tới trạm i+1
tốn \`cost[i]\` lít.

Bạn bắt đầu với bình rỗng. Trả về **chỉ số trạm xuất phát** để đi hết một vòng,
hoặc \`-1\` nếu không thể. Đề đảm bảo đáp án là **duy nhất** nếu tồn tại.

**Ví dụ**
- \`gas = [1,2,3,4,5], cost = [3,4,5,1,2]\` → \`3\`
- \`gas = [2,3,4], cost = [3,4,3]\` → \`-1\`
`,
      starter: `function canCompleteCircuit(gas, cost) {\n  \n}`,
      starterPy: `def canCompleteCircuit(gas, cost):\n    \n`,
      tests: [
        { args: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expected: 3, name: 'Ví dụ 1' },
        { args: [[2, 3, 4], [3, 4, 3]], expected: -1, name: 'Không đủ xăng' },
        { args: [[5], [4]], expected: 0, name: 'Một trạm' },
        { args: [[3, 1, 1], [1, 2, 2]], expected: 0, name: 'Bắt đầu từ 0' },
        { args: [[1, 2], [2, 1]], expected: 1, name: 'Hai trạm' },
        { args: [[4], [5]], expected: -1, name: 'Một trạm không đủ' },
        { args: [[2, 0, 1, 2, 3], [1, 2, 2, 1, 1]], expected: 3, name: 'Đáp án ở giữa' },
      ],
      perfTests: [{ build: () => [Array.from({ length: 100000 }, (_, i) => (i % 5) + 1), Array.from({ length: 100000 }, (_, i) => (i % 5) + 1)], expected: 0, name: 'Hiệu năng: n=100.000' }],
      hints: [
        'Nhận xét 1 (điều kiện tồn tại): nếu `tổng(gas) < tổng(cost)` thì chắc chắn không thể → trả về -1. Nếu `tổng(gas) >= tổng(cost)` thì **luôn tồn tại** một điểm xuất phát hợp lệ.',
        'Nhận xét 2 (chìa khoá): nếu bạn xuất phát từ i và hết xăng tại j, thì **mọi trạm giữa i và j đều không thể là điểm xuất phát**. Vì sao? Vì khi tới các trạm đó bạn đã có sẵn xăng dư (≥ 0) mà vẫn không đi nổi.',
        'Vậy chỉ cần một lượt duyệt: giữ `tank` (xăng hiện tại) và `start`. Khi `tank < 0`, đặt `start = i + 1` và `tank = 0`. Đáp án là `start` cuối cùng — O(n), không cần thử từng điểm.',
      ],
      hintsPy: [
        'Nhận xét 1 (điều kiện tồn tại): nếu `sum(gas) < sum(cost)` thì chắc chắn không thể → trả về -1. Nếu `sum(gas) >= sum(cost)` thì **luôn tồn tại** một điểm xuất phát hợp lệ.',
        'Nhận xét 2 (chìa khoá): nếu bạn xuất phát từ i và hết xăng tại j, thì **mọi trạm giữa i và j đều không thể là điểm xuất phát**. Vì sao? Vì khi tới các trạm đó bạn đã có sẵn xăng dư (≥ 0) mà vẫn không đi nổi.',
        'Vậy chỉ cần một lượt duyệt: giữ `tank` (xăng hiện tại) và `start`. Khi `tank < 0`, đặt `start = i + 1` và `tank = 0`. Đáp án là `start` cuối cùng — O(n), không cần thử từng điểm.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Thử mọi điểm xuất phát là O(n²) — trượt test 100.000 trạm. Có lời giải một lượt duyệt O(n) nhờ nhận xét "mọi trạm giữa i và j đều không dùng được".' },
      ],
      diagnosticsPy: [
        { test: 'for\\s+\\w+[\\s\\S]{0,200}for\\s+\\w+', message: 'Thử mọi điểm xuất phát là O(n²) — trượt test 100.000 trạm. Có lời giải một lượt duyệt O(n) nhờ nhận xét "mọi trạm giữa i và j đều không dùng được".' },
      ],
      approach: `
Bài này là **ví dụ mẫu mực về việc chứng minh greedy**. Có hai nhận xét, và mỗi nhận xét đều cần lập luận.

**Nhận xét 1 — Điều kiện tồn tại.**
Tổng xăng thu được trong một vòng là \`Σgas\`, tổng tiêu hao là \`Σcost\`.
Nếu \`Σgas < Σcost\` thì không cách nào đi hết vòng.
Ngược lại, nếu \`Σgas >= Σcost\` thì **chắc chắn tồn tại** điểm xuất phát hợp lệ
(chứng minh được bằng lập luận về tổng tiền tố nhỏ nhất).

**Nhận xét 2 — Loại bỏ hàng loạt ứng viên.**
Giả sử xuất phát từ i và hết xăng khi đang đi từ j sang j+1.
Xét bất kỳ k nằm giữa i và j: khi đi từ i tới k, bình xăng luôn ≥ 0.
Nghĩa là nếu xuất phát *tại* k, bạn có **ít hơn hoặc bằng** lượng xăng so với khi đi từ i tới k.
Vậy nếu từ i không đi nổi qua j thì từ k càng không → **loại toàn bộ i..j** trong một lần.

Hai nhận xét này cho thuật toán một lượt duyệt:
\`\`\`js
let total = 0, tank = 0, start = 0;
for (let i = 0; i < n; i++) {
  const diff = gas[i] - cost[i];
  total += diff;
  tank += diff;
  if (tank < 0) { start = i + 1; tank = 0; }   // loại bỏ cả đoạn vừa qua
}
return total >= 0 ? start : -1;
\`\`\`

\`\`\`
gas  = [1,2,3,4,5]
cost = [3,4,5,1,2]
diff = [-2,-2,-2,3,3]
i=0 tank=-2 <0 -> start=1, tank=0
i=1 tank=-2 <0 -> start=2, tank=0
i=2 tank=-2 <0 -> start=3, tank=0
i=3 tank=3
i=4 tank=6
total = 0 >= 0 -> trả về 3 ✔
\`\`\`

**Bài học:** cấu trúc "chứng minh tồn tại + loại bỏ hàng loạt ứng viên" là mẫu lập luận greedy
mạnh nhất. Khi gặp bài mới, hãy thử hỏi: *"thất bại tại đây loại bỏ được những ứng viên nào?"*
`,
      solution: `function canCompleteCircuit(gas, cost) {
  let total = 0;    // tổng chênh lệch cả vòng -> quyết định CÓ tồn tại đáp án không
  let tank = 0;     // xăng hiện có kể từ điểm xuất phát đang xét
  let start = 0;

  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) {          // không đi nổi tới i+1 -> mọi trạm start..i đều bị loại
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}`,
      solutionPy: `def canCompleteCircuit(gas, cost):
    total = tank = start = 0
    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total += diff
        tank += diff
        if tank < 0:
            start = i + 1
            tank = 0
    return start if total >= 0 else -1`,
      complexity: {
        question: 'Vì sao khi hết xăng tại j, ta có thể loại bỏ TOÀN BỘ các trạm từ start tới j cùng lúc?',
        options: [
          'Vì chúng đã được kiểm tra riêng lẻ',
          'Vì khi đi từ start tới bất kỳ trạm k nào ở giữa, bình xăng luôn ≥ 0 — nên xuất phát tại k sẽ có ít xăng hơn hoặc bằng, càng không thể vượt qua j',
          'Vì mảng đã được sắp xếp',
          'Vì tổng xăng bằng tổng chi phí',
        ],
        answer: 1,
        why: 'Đây chính là lập luận biến O(n²) thành O(n). Mẫu tư duy "một lần thất bại loại được cả một đoạn ứng viên" xuất hiện ở nhiều bài greedy khác — rất đáng ghi nhớ.',
      },
      realWorld: 'Lập kế hoạch tuyến đường có điểm tiếp nhiên liệu/sạc pin; quản lý dòng tiền theo chu kỳ (chọn thời điểm bắt đầu để số dư không bao giờ âm); và cân bằng bộ đệm trong hệ thống sản xuất tuần hoàn.',
    },
  ],
},
];
