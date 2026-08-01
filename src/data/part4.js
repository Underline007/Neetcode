/**
 * NHÓM 4 — Khám phá không gian: Backtracking, Graphs, Advanced Graphs
 */

export default [
/* ==================================================================== */
{
  id: 'backtracking',
  name: 'Quay lui',
  en: 'Backtracking',
  icon: '🧭',
  days: [18, 19],
  summary: 'Duyệt cây quyết định một cách có tổ chức: chọn → đi tiếp → hoàn tác lựa chọn.',
  lesson: `
## 1. Vấn đề gốc

Có những bài toán mà đáp án là **một tổ hợp lựa chọn**: chọn tập con nào, sắp xếp thế nào,
đặt quân hậu ở đâu. Không có công thức trực tiếp — bắt buộc phải **thử**.

Nhưng thử một cách hỗn loạn sẽ sinh trùng lặp và bỏ sót. Quay lui là cách thử **có hệ thống**.

## 2. Ý tưởng cốt lõi

> Mọi bài quay lui đều là **duyệt theo chiều sâu (DFS) trên một cây quyết định ẩn**.
> Mỗi tầng của cây = một quyết định. Mỗi đường đi từ gốc tới lá = một lời giải ứng viên.

Khung mẫu **ba dòng** (thuộc lòng khung này là xong 70% chủ đề):

\`\`\`js
function backtrack(state) {
  if (isSolution(state)) { results.push([...state]); return; }

  for (const choice of choices(state)) {
    if (!isValid(choice, state)) continue;   // cắt tỉa (pruning)
    state.push(choice);                      // 1. CHỌN
    backtrack(state);                        // 2. ĐI TIẾP
    state.pop();                             // 3. HOÀN TÁC  <-- linh hồn của backtracking
  }
}
\`\`\`

**Vì sao phải hoàn tác?** Vì ta dùng chung **một** mảng trạng thái cho cả cây tìm kiếm
(tiết kiệm bộ nhớ). Sau khi khám phá xong một nhánh, trạng thái phải trở về đúng như trước
để nhánh anh em bắt đầu từ điểm xuất phát sạch sẽ.

**Lưu ý bắt buộc:** khi lưu kết quả phải \`push([...state])\` — sao chép!
Nếu push thẳng \`state\`, mọi kết quả sẽ trỏ về cùng một mảng và cuối cùng đều rỗng.

## 3. Ba biến thể — khác nhau ở tham số \`start\`

| Bài | Vòng lặp bắt đầu từ | Ý nghĩa |
|---|---|---|
| **Tập con / tổ hợp** | \`i = start\` | không quay lại phần tử đã qua → không sinh hoán vị trùng |
| **Tổ hợp có lặp lại** | \`i = start\` nhưng gọi đệ quy với \`i\` (không phải \`i+1\`) | được dùng lại chính phần tử đó |
| **Hoán vị** | \`i = 0\` + mảng \`used[]\` | mọi vị trí đều có thể chọn, chỉ cần chưa dùng |

Chỉ một tham số nhỏ này quyết định bạn sinh ra *tập con*, *tổ hợp* hay *hoán vị*.
Hiểu nó là hiểu cả chủ đề.

## 4. Cắt tỉa — thứ biến "bất khả thi" thành "chạy được"

Số lời giải có thể là 2ⁿ hoặc n!. Cắt tỉa sớm là yếu tố sống còn:

- **Sắp xếp trước** rồi \`break\` khi tổng đã vượt target (bài Combination Sum).
- **Bỏ qua nhánh trùng**: \`if (i > start && a[i] === a[i-1]) continue;\`
- **Kiểm tra tính khả thi sớm** (bài N-Queens: kiểm tra cột/đường chéo ngay khi đặt).

Nguyên tắc: **thất bại càng sớm càng tốt**. Một phép kiểm tra rẻ ở tầng 2 có thể xoá bỏ
hàng triệu nhánh ở tầng 10.

## 5. Bẫy thường gặp

- Quên \`pop()\` → trạng thái rò rỉ sang nhánh khác, kết quả sai một cách kỳ lạ.
- Push tham chiếu thay vì bản sao.
- Với dữ liệu có phần tử trùng: quên sắp xếp + bỏ qua trùng → kết quả bị lặp.
- Nhầm giữa \`i + 1\` (không dùng lại) và \`i\` (được dùng lại) khi gọi đệ quy.

## 6. Ứng dụng thực tế

- **Bộ giải Sudoku, sinh mê cung, xếp lịch thi**.
- **Trình giải ràng buộc (CSP solver)**: phân công ca làm việc, xếp phòng học, tô màu bản đồ.
- **Bộ kiểm thử sinh tổ hợp cấu hình** (pairwise testing).
- **Cờ vua / AI trò chơi**: minimax chính là backtracking có đánh giá.
- **Regex engine**: khớp mẫu với dấu \`*\` dùng quay lui — và đó cũng là nguồn gốc lỗ hổng ReDoS.
`,
  quiz: [
    {
      q: 'Vì sao dòng `state.pop()` sau lời gọi đệ quy là bắt buộc?',
      options: [
        'Để giải phóng bộ nhớ',
        'Để trạng thái trở về đúng như trước khi thử nhánh này, cho nhánh anh em bắt đầu sạch sẽ',
        'Để tránh đệ quy vô hạn',
        'Để kết quả được sắp xếp',
      ],
      answer: 1,
      why: 'Ta dùng CHUNG một mảng trạng thái cho toàn bộ cây tìm kiếm. Không hoàn tác thì nhánh sau sẽ kế thừa rác của nhánh trước. Đây chính là chữ "back" trong backtracking.',
    },
    {
      q: 'Điểm khác biệt cốt lõi giữa sinh TỔ HỢP và sinh HOÁN VỊ trong khung quay lui?',
      options: [
        'Tổ hợp dùng vòng lặp từ `start`, hoán vị lặp từ 0 và dùng mảng đánh dấu `used`',
        'Hoán vị cần nhiều bộ nhớ hơn',
        'Tổ hợp không cần hoàn tác trạng thái',
        'Hoán vị phải sắp xếp mảng trước',
      ],
      answer: 0,
      why: 'Tham số `start` ngăn việc quay lại phần tử đã qua → mỗi tập chỉ sinh một lần theo một thứ tự. Bỏ `start` và thêm `used` thì mọi thứ tự đều được sinh → hoán vị.',
    },
    {
      q: 'Trong bài Combination Sum (được dùng lại phần tử nhiều lần), lời gọi đệ quy nên truyền gì?',
      options: [
        'backtrack(i + 1) — chuyển sang phần tử kế tiếp',
        'backtrack(i) — giữ nguyên vị trí để được chọn lại chính phần tử đó',
        'backtrack(0) — bắt đầu lại từ đầu',
        'backtrack(start) — không thay đổi',
      ],
      answer: 1,
      why: 'Truyền `i` cho phép chọn lại phần tử thứ i; truyền `i+1` thì không. Truyền 0 sẽ sinh trùng ([2,3] và [3,2]). Một con số nhỏ nhưng quyết định toàn bộ ngữ nghĩa bài toán.',
    },
    {
      q: 'Kỹ thuật quan trọng nhất để backtracking chạy được với dữ liệu lớn là gì?',
      options: [
        'Dùng vòng lặp thay đệ quy',
        'Cắt tỉa (pruning) — loại bỏ nhánh không thể dẫn tới lời giải càng sớm càng tốt',
        'Dùng nhiều bộ nhớ hơn',
        'Sắp xếp kết quả cuối cùng',
      ],
      answer: 1,
      why: 'Không gian tìm kiếm là hàm mũ; không có cách nào làm nó đa thức. Nhưng cắt tỉa sớm loại bỏ hàng triệu nhánh chết. Một kiểm tra rẻ ở tầng nông giá trị hơn mọi tối ưu vi mô.',
    },
  ],
  problems: [
    {
      id: 'subsets',
      title: 'Sinh tất cả tập con',
      en: 'Subsets',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'subsets',
      statement: `
Cho mảng \`nums\` gồm các phần tử **phân biệt**, trả về **tất cả tập con** (power set).
Thứ tự tập con và thứ tự phần tử bên trong không quan trọng.

**Ví dụ**
- \`[1,2,3]\` → \`[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]\` (8 tập)
- \`[0]\` → \`[[],[0]]\`
`,
      starter: `function subsets(nums) {\n  \n}`,
      tests: [
        { args: [[1, 2, 3]], expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]], name: 'Ba phần tử' },
        { args: [[0]], expected: [[], [0]], name: 'Một phần tử' },
        { args: [[]], expected: [[]], name: 'Mảng rỗng — vẫn có tập rỗng' },
        { args: [[1, 2]], expected: [[], [1], [2], [1, 2]], name: 'Hai phần tử' },
        { args: [[9, 0, 3, 5, 7]], expectedLen: 32, name: '5 phần tử → 32 tập con' },
      ],
      checkerSrc: `(got, exp, args) => {
        if (!Array.isArray(got)) return false;
        const n = args[0].length;
        if (got.length !== (1 << n)) return false;
        const keys = new Set(got.map(s => [...s].sort((a,b)=>a-b).join(',')));
        return keys.size === (1 << n);
      }`,
      hints: [
        'Với mỗi phần tử, bạn có đúng **hai lựa chọn**: lấy hoặc không lấy. Đó là một cây nhị phân quyết định có 2ⁿ đường đi từ gốc tới lá.',
        'Khung quay lui: `dfs(start, path)`. **Mọi nút** của cây (không chỉ lá) đều là một tập con hợp lệ → push `[...path]` ngay khi vào hàm.',
        'Vòng lặp `for (let i = start; i < nums.length; i++)`: chọn `nums[i]`, gọi `dfs(i + 1, path)`, rồi `path.pop()`. Tham số `start` là thứ ngăn bạn sinh [2,1] sau khi đã có [1,2].',
      ],
      diagnostics: [
        { test: 'res\\.push\\(path\\)|results\\.push\\(path\\)', message: 'Bạn đang push THAM CHIẾU tới mảng path. Vì path bị thay đổi liên tục, mọi kết quả sẽ giống nhau (và rỗng ở cuối). Hãy push `[...path]`.' },
        { test: 'dfs\\(\\s*0\\s*,|backtrack\\(\\s*0\\s*,', message: 'Nếu vòng lặp luôn bắt đầu từ 0, bạn sẽ sinh cả [1,2] lẫn [2,1] — đó là hoán vị chứ không phải tập con. Hãy truyền `i + 1`.' },
      ],
      approach: `
**Hai cách nhìn — nên biết cả hai.**

**Cách 1 — Cây quyết định "lấy / không lấy":**
\`\`\`
                  []
          lấy 1 /    \\ bỏ 1
            [1]        []
       /2      \\      /2    \\
    [1,2]      [1]  [2]     []
   /3   \\3    /3 \\3 ...
[1,2,3] [1,2] ...
\`\`\`
2ⁿ lá — đúng bằng số tập con.

**Cách 2 — Duyệt theo \`start\` (khung chuẩn, dễ mở rộng hơn):**
\`\`\`js
const res = [];
const dfs = (start, path) => {
  res.push([...path]);                    // MỌI nút đều là một tập con
  for (let i = start; i < nums.length; i++) {
    path.push(nums[i]);
    dfs(i + 1, path);
    path.pop();
  }
};
dfs(0, []);
\`\`\`

**Cách 3 — Mặt nạ bit (bit mask), rất đẹp:**
\`\`\`js
for (let mask = 0; mask < (1 << n); mask++) {
  const sub = [];
  for (let i = 0; i < n; i++) if (mask & (1 << i)) sub.push(nums[i]);
  res.push(sub);
}
\`\`\`
Mỗi số từ 0 đến 2ⁿ-1 tương ứng đúng một tập con — bit thứ i cho biết có lấy phần tử i hay không.
Ý tưởng này sẽ quay lại ở chủ đề Bit Manipulation và trong DP trên tập con (bitmask DP).

**Độ phức tạp:** O(n · 2ⁿ) — có 2ⁿ tập con, mỗi tập tốn O(n) để sao chép. Không thể tốt hơn
vì bản thân đầu ra đã có kích thước đó.
`,
      solution: `function subsets(nums) {
  const res = [];
  const path = [];

  const dfs = (start) => {
    res.push([...path]);                 // sao chép! không push tham chiếu
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);                // CHỌN
      dfs(i + 1);                        // ĐI TIẾP (i+1: không dùng lại phần tử này)
      path.pop();                        // HOÀN TÁC
    }
  };

  dfs(0);
  return res;
}`,
      solutionPy: `def subsets(nums):
    res, path = [], []

    def dfs(start):
        res.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            dfs(i + 1)
            path.pop()

    dfs(0)
    return res`,
      complexity: {
        question: 'Độ phức tạp thời gian của việc sinh mọi tập con?',
        options: ['O(n²)', 'O(2ⁿ)', 'O(n · 2ⁿ)', 'O(n!)'],
        answer: 2,
        why: 'Có 2ⁿ tập con và mỗi tập cần O(n) để sao chép vào kết quả. Đây là cận dưới bắt buộc vì kích thước ĐẦU RA đã là n·2ⁿ — không thuật toán nào nhanh hơn được.',
      },
      realWorld: 'Sinh mọi tổ hợp cấu hình để kiểm thử (feature flags: 10 cờ = 1024 tổ hợp — lý do người ta dùng pairwise testing thay vì thử hết), hoặc liệt kê mọi nhóm sản phẩm khả dĩ khi tính khuyến mãi.',
    },
    {
      id: 'combination-sum',
      title: 'Tổ hợp có tổng bằng target',
      en: 'Combination Sum',
      difficulty: 'Medium',
      targetMinutes: 22,
      entry: 'combinationSum',
      statement: `
Cho mảng số nguyên dương **phân biệt** \`candidates\` và số \`target\`, trả về **tất cả tổ hợp**
có tổng bằng target. Mỗi số **được dùng lại nhiều lần**.

Hai tổ hợp là khác nhau nếu số lần chọn của ít nhất một số khác nhau. Thứ tự không quan trọng.

**Ví dụ**
- \`candidates = [2,3,6,7], target = 7\` → \`[[2,2,3],[7]]\`
- \`candidates = [2,3,5], target = 8\` → \`[[2,2,2,2],[2,3,3],[3,5]]\`
- \`candidates = [2], target = 1\` → \`[]\`
`,
      starter: `function combinationSum(candidates, target) {\n  \n}`,
      tests: [
        { args: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]], name: 'Ví dụ 1' },
        { args: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]], name: 'Ví dụ 2' },
        { args: [[2], 1], expected: [], name: 'Không có lời giải' },
        { args: [[1], 2], expected: [[1, 1]], name: 'Dùng lại nhiều lần' },
        { args: [[7, 3, 2], 18], expectedLen: 6, name: 'Nhiều tổ hợp' },
      ],
      checkerSrc: `(got, exp, args) => {
        if (!Array.isArray(got)) return false;
        const target = args[1];
        const norm = (g) => g.map(c => [...c].sort((a,b)=>a-b).join(',')).sort().join('|');
        if (got.some(c => c.reduce((s,x)=>s+x,0) !== target)) return false;
        if (new Set(got.map(c => [...c].sort((a,b)=>a-b).join(','))).size !== got.length) return false;
        if (exp) return norm(got) === norm(exp);
        return true;
      }`,
      hints: [
        'Khung quay lui với ba tham số: `dfs(start, path, remain)`. Điều kiện dừng: `remain === 0` → lưu kết quả; `remain < 0` → nhánh chết, quay về.',
        'Vì mỗi số được dùng **nhiều lần**, lời gọi đệ quy phải truyền `i` chứ **không phải** `i + 1`. Nhưng vẫn phải có `start` để không sinh [2,3] và [3,2] trùng nhau.',
        'Cắt tỉa mạnh: sắp xếp `candidates` tăng dần, rồi trong vòng lặp dùng `if (candidates[i] > remain) break;` — vì các phần tử sau còn lớn hơn nên chắc chắn cũng thất bại.',
      ],
      diagnostics: [
        { test: 'dfs\\(\\s*i\\s*\\+\\s*1', message: 'Truyền `i + 1` nghĩa là mỗi số chỉ dùng một lần — nhưng đề cho phép dùng lại nhiều lần. Hãy truyền `i`.' },
        { test: 'dfs\\(\\s*0\\s*[,)]', message: 'Luôn bắt đầu vòng lặp từ 0 sẽ sinh tổ hợp trùng theo thứ tự khác nhau ([2,3] và [3,2]). Hãy dùng tham số `start`.' },
        { test: 'res\\.push\\(path\\)', message: 'Push tham chiếu `path` sẽ khiến mọi kết quả bị ghi đè. Dùng `[...path]`.' },
      ],
      approach: `
**Điểm khó duy nhất: tránh sinh trùng.** \`[2,2,3]\` và \`[3,2,2]\` là *cùng một* tổ hợp.

Giải pháp chuẩn: **chỉ sinh theo thứ tự không giảm**. Tham số \`start\` đảm bảo điều đó —
sau khi đã "bỏ qua" một số, bạn không bao giờ quay lại nó nữa.

\`\`\`
target=7, candidates=[2,3,6,7]

dfs(start=0, remain=7)
├─ chọn 2 -> dfs(0, 5)
│  ├─ chọn 2 -> dfs(0, 3)
│  │  ├─ chọn 2 -> dfs(0, 1) -> chọn 2 -> remain=-1 ✗ (cắt)
│  │  └─ chọn 3 -> remain=0 ✔ [2,2,3]
│  └─ chọn 3 -> dfs(1, 2) -> 3 > 2 -> break (cắt tỉa nhờ đã sắp xếp)
├─ chọn 3 -> ...
└─ chọn 7 -> remain=0 ✔ [7]
\`\`\`

**Vì sao \`break\` mà không phải \`continue\`?** Vì mảng đã sắp xếp: nếu \`candidates[i] > remain\`
thì mọi phần tử sau đó cũng vậy. \`break\` cắt cả một dải nhánh chết — đây chính là sức mạnh của
việc kết hợp sắp xếp với cắt tỉa.

**Biến thể cần phân biệt:**
- **Combination Sum II**: mỗi số dùng **một lần**, mảng **có phần tử trùng** →
  truyền \`i+1\` và thêm \`if (i > start && a[i] === a[i-1]) continue;\`
- **Combination Sum III**: giới hạn số lượng phần tử được chọn → thêm tham số đếm.
`,
      solution: `function combinationSum(candidates, target) {
  const a = [...candidates].sort((x, y) => x - y);   // sắp xếp để cắt tỉa được
  const res = [];
  const path = [];

  const dfs = (start, remain) => {
    if (remain === 0) { res.push([...path]); return; }

    for (let i = start; i < a.length; i++) {
      if (a[i] > remain) break;          // cắt tỉa: các số sau còn lớn hơn
      path.push(a[i]);
      dfs(i, remain - a[i]);             // truyền i: được chọn lại chính số này
      path.pop();
    }
  };

  dfs(0, target);
  return res;
}`,
      solutionPy: `def combinationSum(candidates, target):
    a = sorted(candidates)
    res, path = [], []

    def dfs(start, remain):
        if remain == 0:
            res.append(path[:])
            return
        for i in range(start, len(a)):
            if a[i] > remain:
                break
            path.append(a[i])
            dfs(i, remain - a[i])
            path.pop()

    dfs(0, target)
    return res`,
      complexity: {
        question: 'Vì sao dùng `break` (thay vì `continue`) khi `candidates[i] > remain` lại hợp lệ?',
        options: [
          'Vì break nhanh hơn continue',
          'Vì mảng đã được sắp xếp tăng dần nên mọi phần tử phía sau cũng lớn hơn remain',
          'Vì các phần tử phía sau đã được xét ở nhánh khác',
          'Vì đề bài yêu cầu như vậy',
        ],
        answer: 1,
        why: 'Sắp xếp không chỉ để đẹp — nó biến một phép kiểm tra cục bộ thành kết luận cho toàn bộ phần đuôi. Đây là mẫu "sắp xếp để cắt tỉa" xuất hiện rất nhiều trong backtracking.',
      },
      realWorld: 'Bài toán đổi tiền / chọn mệnh giá; ghép các gói tài nguyên (CPU, RAM) để vừa đúng hạn mức; chọn tổ hợp món ăn theo đúng lượng calo mục tiêu.',
    },
    {
      id: 'permutations',
      title: 'Sinh mọi hoán vị',
      en: 'Permutations',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'permute',
      statement: `
Cho mảng \`nums\` gồm các phần tử **phân biệt**, trả về **tất cả hoán vị** của nó.
Thứ tự các hoán vị trong kết quả không quan trọng.

**Ví dụ**
- \`[1,2,3]\` → 6 hoán vị: \`[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\`
- \`[1]\` → \`[[1]]\`
`,
      starter: `function permute(nums) {\n  \n}`,
      tests: [
        { args: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]], name: 'Ba phần tử' },
        { args: [[0, 1]], expected: [[0, 1], [1, 0]], name: 'Hai phần tử' },
        { args: [[1]], expected: [[1]], name: 'Một phần tử' },
        { args: [[1, 2, 3, 4]], expectedLen: 24, name: '4 phần tử → 24 hoán vị' },
      ],
      checkerSrc: `(got, exp, args) => {
        if (!Array.isArray(got)) return false;
        const n = args[0].length;
        let fact = 1; for (let i = 2; i <= n; i++) fact *= i;
        if (got.length !== fact) return false;
        const keys = new Set(got.map(p => p.join(',')));
        if (keys.size !== fact) return false;
        const src = [...args[0]].sort((a,b)=>a-b).join(',');
        return got.every(p => [...p].sort((a,b)=>a-b).join(',') === src);
      }`,
      hints: [
        'Khác với tập con: ở đây **thứ tự quan trọng**, nên mọi vị trí đều có thể được chọn ở mỗi bước. Bỏ tham số `start` đi.',
        'Cần một cách để biết phần tử nào đã dùng: dùng mảng `used[]` (boolean) hoặc `Set`. Vòng lặp `for (i = 0; i < n; i++)` và `if (used[i]) continue;`.',
        'Điều kiện dừng: `path.length === nums.length` → lưu bản sao. Đừng quên đặt lại `used[i] = false` cùng lúc với `path.pop()` khi hoàn tác.',
      ],
      diagnostics: [
        { test: 'dfs\\(\\s*i\\s*\\+\\s*1|dfs\\(\\s*start', message: 'Tham số `start` là dành cho tổ hợp. Với hoán vị, mọi phần tử chưa dùng đều có thể chọn ở mỗi bước — hãy lặp từ 0 và dùng mảng `used`.' },
        { test: 'res\\.push\\(path\\)', message: 'Push tham chiếu sẽ khiến tất cả hoán vị trong kết quả là cùng một mảng rỗng. Dùng `[...path]`.' },
      ],
      approach: `
**So sánh trực tiếp với bài Subsets — đây là cách nhớ tốt nhất:**

| | Subsets / Combination | Permutation |
|---|---|---|
| Vòng lặp | \`i = start\` | \`i = 0\` |
| Cần \`used[]\`? | không | **có** |
| Khi nào lưu kết quả | mọi nút | chỉ khi \`path.length === n\` |
| Số lượng kết quả | 2ⁿ | n! |

\`\`\`
[1,2,3]
├─ 1 ├─ 2 └─ 3   -> [1,2,3]
│    └─ 3 └─ 2   -> [1,3,2]
├─ 2 ├─ 1 └─ 3   -> [2,1,3]
│    └─ 3 └─ 1   -> [2,3,1]
└─ 3 ├─ 1 └─ 2   -> [3,1,2]
     └─ 2 └─ 1   -> [3,2,1]
\`\`\`

**Cách khác — hoán đổi tại chỗ (không cần \`used\`):**
\`\`\`js
const dfs = (k) => {
  if (k === n) { res.push([...nums]); return; }
  for (let i = k; i < n; i++) {
    [nums[k], nums[i]] = [nums[i], nums[k]];
    dfs(k + 1);
    [nums[k], nums[i]] = [nums[i], nums[k]];   // hoàn tác
  }
};
\`\`\`
Tiết kiệm bộ nhớ hơn nhưng khó xử lý phần tử trùng lặp. Biết cả hai là lợi thế.

**Với mảng có phần tử trùng (Permutations II):** sắp xếp trước, rồi thêm
\`if (i > 0 && a[i] === a[i-1] && !used[i-1]) continue;\` — quy tắc "chỉ dùng bản sao đầu tiên
trong số các bản trùng chưa được dùng".
`,
      solution: `function permute(nums) {
  const res = [];
  const path = [];
  const used = new Array(nums.length).fill(false);

  const dfs = () => {
    if (path.length === nums.length) { res.push([...path]); return; }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;             // phần tử này đã nằm trong path
      used[i] = true;  path.push(nums[i]);
      dfs();
      path.pop();      used[i] = false;  // HOÀN TÁC cả hai
    }
  };

  dfs();
  return res;
}`,
      solutionPy: `def permute(nums):
    res, path = [], []
    used = [False] * len(nums)

    def dfs():
        if len(path) == len(nums):
            res.append(path[:])
            return
        for i, x in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(x)
            dfs()
            path.pop()
            used[i] = False

    dfs()
    return res`,
      complexity: {
        question: 'Với n = 12, số hoán vị là bao nhiêu và điều đó nói lên gì?',
        options: [
          'Khoảng 4.000 — vẫn nhanh',
          'Khoảng 479 triệu — n! tăng nhanh khủng khiếp, nên n phải rất nhỏ hoặc phải cắt tỉa mạnh',
          'Khoảng 144',
          'Khoảng 4.096',
        ],
        answer: 1,
        why: '12! = 479.001.600. Đây là lý do các bài yêu cầu duyệt hoán vị luôn có ràng buộc n ≤ 8-10. Thấy n nhỏ bất thường trong đề → gợi ý mạnh rằng lời giải là backtracking hàm mũ.',
      },
      realWorld: 'Bài toán người bán hàng (TSP) duyệt mọi thứ tự ghé thăm; sắp xếp thứ tự ca làm việc; sinh mọi thứ tự thực thi để kiểm thử race condition trong hệ thống đồng thời.',
    },
    {
      id: 'word-search',
      title: 'Tìm từ trong lưới ký tự',
      en: 'Word Search',
      difficulty: 'Medium',
      targetMinutes: 28,
      entry: 'exist',
      statement: `
Cho lưới ký tự \`board\` (m×n) và chuỗi \`word\`. Trả về \`true\` nếu tồn tại đường đi tạo thành \`word\`.

Các ký tự phải **kề nhau** theo chiều ngang/dọc, và **mỗi ô chỉ được dùng một lần** trong một đường đi.

**Ví dụ**
- board = \`[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\`, word = \`"ABCCED"\` → \`true\`
- cùng board, word = \`"ABCB"\` → \`false\` (phải dùng lại ô 'B')
`,
      starter: `function exist(board, word) {\n  \n}`,
      tests: [
        { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCCED'], expected: true, name: 'Có đường đi' },
        { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'SEE'], expected: true, name: 'Bắt đầu ở giữa' },
        { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCB'], expected: false, name: 'Không được dùng lại ô' },
        { args: [[['a']], 'a'], expected: true, name: 'Lưới 1x1' },
        { args: [[['a']], 'b'], expected: false, name: 'Không khớp' },
        { args: [[['a', 'b'], ['c', 'd']], 'abdc'], expected: true, name: 'Đi vòng' },
        { args: [[['a', 'a']], 'aaa'], expected: false, name: 'Từ dài hơn số ô khả dụng' },
      ],
      hints: [
        'Với mỗi ô của lưới, thử coi nó là điểm bắt đầu và chạy DFS. Nếu bất kỳ điểm bắt đầu nào thành công → true.',
        'Hàm `dfs(r, c, i)`: nếu `i === word.length` → true. Nếu ra ngoài lưới hoặc `board[r][c] !== word[i]` → false. Ngược lại thử 4 hướng với `i + 1`.',
        'Cách đánh dấu ô đã dùng **không cần mảng phụ**: tạm ghi đè `board[r][c] = "#"` trước khi đi tiếp, rồi **khôi phục lại ký tự cũ** sau khi quay về. Đây chính là bước "hoàn tác" của backtracking, áp dụng trên lưới.',
      ],
      diagnostics: [
        { test: 'visited', message: 'Dùng mảng `visited` riêng vẫn đúng, nhưng nhớ reset nó khi quay lui — nếu chỉ đánh dấu mà không xoá, các đường đi khác sẽ bị chặn nhầm. Cách ghi đè ký tự tạm thời gọn hơn.' },
        { test: 'for[\\s\\S]{0,150}for[\\s\\S]{0,150}for[\\s\\S]{0,150}for', message: 'Bốn vòng lặp lồng nhau gợi ý bạn đang thử brute force theo cách khác. Cấu trúc đúng là hai vòng ngoài (chọn điểm xuất phát) + đệ quy DFS.' },
      ],
      approach: `
Đây là bài **backtracking trên lưới** — cầu nối tự nhiên sang chủ đề Graphs
(một lưới chính là đồ thị mà mỗi ô nối với 4 ô kề).

**Cấu trúc lời giải:**
\`\`\`js
for (mỗi ô (r,c))
  if (dfs(r, c, 0)) return true;
return false;

function dfs(r, c, i) {
  if (i === word.length) return true;                        // đã khớp hết
  if (ngoài lưới || board[r][c] !== word[i]) return false;    // nhánh chết

  const tmp = board[r][c];
  board[r][c] = '#';                                          // ĐÁNH DẤU
  const found = dfs(r+1,c,i+1) || dfs(r-1,c,i+1)
             || dfs(r,c+1,i+1) || dfs(r,c-1,i+1);
  board[r][c] = tmp;                                          // HOÀN TÁC
  return found;
}
\`\`\`

**Vì sao phải khôi phục ký tự?** Vì ô đó có thể nằm trên một đường đi *khác* xuất phát từ chỗ khác.
Đánh dấu vĩnh viễn là lỗi kinh điển làm bài chạy sai mà rất khó tìm ra.

**Cắt tỉa nâng cao (đáng nêu trong phỏng vấn):**
- Nếu số ô có ký tự \`c\` ít hơn số lần \`c\` xuất hiện trong word → trả về false ngay.
- Nếu ký tự đầu của word hiếm hơn ký tự cuối → **đảo ngược word** rồi tìm; giảm mạnh số điểm xuất phát.

**Độ phức tạp:** O(m·n·4^L) trong đó L là độ dài word. Con số đáng sợ, nhưng thực tế bị cắt rất mạnh
vì hầu hết nhánh chết ngay ở ký tự thứ hai.
`,
      solution: `function exist(board, word) {
  const m = board.length, n = board[0].length;

  const dfs = (r, c, i) => {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= m || c >= n) return false;
    if (board[r][c] !== word[i]) return false;

    const tmp = board[r][c];
    board[r][c] = '#';                       // đánh dấu ô đang dùng
    const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1)
               || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = tmp;                       // HOÀN TÁC để đường đi khác dùng được
    return found;
  };

  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (dfs(r, c, 0)) return true;

  return false;
}`,
      solutionPy: `def exist(board, word):
    m, n = len(board), len(board[0])

    def dfs(r, c, i):
        if i == len(word):
            return True
        if r < 0 or c < 0 or r >= m or c >= n or board[r][c] != word[i]:
            return False
        tmp, board[r][c] = board[r][c], '#'
        found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1)
                 or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
        board[r][c] = tmp
        return found

    return any(dfs(r, c, 0) for r in range(m) for c in range(n))`,
      complexity: {
        question: 'Vì sao BẮT BUỘC khôi phục `board[r][c]` sau khi thử xong một nhánh?',
        options: [
          'Để tiết kiệm bộ nhớ',
          'Vì ô đó có thể thuộc một đường đi khác xuất phát từ vị trí khác — đánh dấu vĩnh viễn sẽ chặn nhầm',
          'Vì JavaScript không cho phép sửa mảng',
          'Để kết quả được sắp xếp đúng',
        ],
        answer: 1,
        why: 'Ràng buộc "không dùng lại ô" chỉ áp dụng TRONG MỘT đường đi, không phải giữa các đường đi khác nhau. Đây là lỗi logic tinh vi hay gặp nhất ở bài này.',
      },
      realWorld: 'Tìm đường trong bản đồ game (không đi lại ô cũ), giải ô chữ, và dò mẫu trong ảnh nhị phân. Ý tưởng "đánh dấu tạm rồi khôi phục" còn dùng trong bộ giải Sudoku và trình kiểm tra ràng buộc.',
    },
  ],
},

/* ==================================================================== */
{
  id: 'graphs',
  name: 'Đồ thị',
  en: 'Graphs',
  icon: '🕸️',
  days: [20, 21],
  summary: 'BFS cho đường đi ngắn nhất, DFS cho khám phá liên thông, topo sort cho thứ tự phụ thuộc.',
  lesson: `
## 1. Vấn đề gốc

Cây diễn tả quan hệ **phân cấp**. Nhưng đời thực còn có quan hệ **mạng lưới**:
bạn bè, đường xá, phụ thuộc giữa các package, luồng dữ liệu. Đồ thị là mô hình tổng quát nhất —
cây chỉ là một trường hợp đặc biệt (đồ thị liên thông, không chu trình, n-1 cạnh).

**Khác biệt then chốt so với cây:** đồ thị có thể có **chu trình**, nên bạn **bắt buộc** phải nhớ
những đỉnh đã thăm, nếu không sẽ lặp vô hạn.

## 2. Biểu diễn

| Cách | Bộ nhớ | Kiểm tra cạnh (u,v) | Duyệt láng giềng | Dùng khi |
|---|---|---|---|---|
| Danh sách kề | O(V+E) | O(bậc) | O(bậc) | **mặc định** (đồ thị thưa) |
| Ma trận kề | O(V²) | O(1) | O(V) | đồ thị dày, cần kiểm tra cạnh nhanh |
| Lưới (grid) | ngầm định | — | 4 hoặc 8 hướng | bài toán ma trận |

Xây danh sách kề từ danh sách cạnh — mẫu code cần thuộc:
\`\`\`js
const adj = Array.from({ length: n }, () => []);
for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }  // bỏ dòng 2 nếu có hướng
\`\`\`

## 3. Hai thuật toán duyệt — chọn cái nào?

**BFS (hàng đợi)** — lan toả theo từng lớp:
\`\`\`js
const q = [start], seen = new Set([start]);
let steps = 0;
while (q.length) {
  const next = [];
  for (const u of q) {
    for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); next.push(v); }
  }
  q = next; steps++;
}
\`\`\`
→ Dùng khi cần **đường đi ngắn nhất theo số cạnh**, hoặc "lan toả theo thời gian".

**DFS (đệ quy hoặc ngăn xếp)** — đi sâu hết một nhánh:
\`\`\`js
const dfs = (u) => {
  seen.add(u);
  for (const v of adj[u]) if (!seen.has(v)) dfs(v);
};
\`\`\`
→ Dùng khi cần **khám phá toàn bộ thành phần liên thông**, phát hiện chu trình, topo sort.

> Quy tắc chọn: **"ngắn nhất / ít bước nhất" → BFS. "có tồn tại / đếm vùng / thứ tự" → DFS.**

## 4. Sắp xếp tôpô (topological sort)

Dành cho **đồ thị có hướng không chu trình (DAG)**: sắp xếp các đỉnh sao cho mọi cạnh u→v
thì u đứng trước v. Đây là mô hình của **phụ thuộc**: môn tiên quyết, thứ tự build, lịch thi công.

**Thuật toán Kahn (BFS trên bậc vào):**
1. Tính \`indegree\` của mọi đỉnh.
2. Đẩy các đỉnh có \`indegree === 0\` vào hàng đợi.
3. Lấy ra một đỉnh, giảm indegree của các đỉnh kề; đỉnh nào về 0 thì đẩy vào hàng đợi.
4. Nếu số đỉnh lấy ra < V → **có chu trình** (không thể sắp xếp).

Bước 4 chính là cách phát hiện phụ thuộc vòng — thứ mà npm/maven báo lỗi cho bạn.

## 5. Bẫy thường gặp

- **Quên đánh dấu đã thăm** → lặp vô hạn (khác hẳn cây!).
- Đánh dấu \`seen\` khi **lấy ra** khỏi hàng đợi thay vì khi **đẩy vào** → một đỉnh vào hàng đợi nhiều lần,
  BFS chậm đi rất nhiều.
- Với đồ thị vô hướng, quên thêm cạnh hai chiều.
- DFS đệ quy trên đồ thị lớn (10⁵ đỉnh) → tràn ngăn xếp; hãy dùng bản lặp.

## 6. Ứng dụng thực tế

- **Mạng xã hội**: bạn chung, gợi ý kết bạn, đường đi ngắn nhất giữa hai người ("6 độ phân cách").
- **Bản đồ & định tuyến**: Google Maps, định tuyến gói tin trên Internet.
- **Trình quản lý gói (npm, apt)**: giải phụ thuộc bằng topo sort, phát hiện phụ thuộc vòng.
- **Bộ lập lịch tác vụ**: Airflow, CI/CD pipeline đều là DAG.
- **Xử lý ảnh**: flood fill (công cụ "xô sơn"), tách vùng liên thông.
`,
  quiz: [
    {
      q: 'Bạn cần tìm số bước ít nhất để đi từ A tới B trong đồ thị KHÔNG trọng số. Dùng gì?',
      options: ['DFS', 'BFS', 'Dijkstra', 'Quy hoạch động'],
      answer: 1,
      why: 'BFS khám phá theo từng lớp khoảng cách nên lần đầu chạm B chính là đường ngắn nhất. DFS có thể tìm ra đường dài lòng vòng trước. Dijkstra là tổng quát hoá của BFS cho đồ thị CÓ trọng số.',
    },
    {
      q: 'Vì sao trên đồ thị bắt buộc phải có tập `visited` còn trên cây thì không?',
      options: [
        'Vì đồ thị lớn hơn',
        'Vì đồ thị có thể chứa chu trình, không đánh dấu sẽ lặp vô hạn',
        'Vì đồ thị dùng nhiều bộ nhớ hơn',
        'Vì cây luôn được sắp xếp',
      ],
      answer: 1,
      why: 'Cây không có chu trình và mỗi nút có đúng một cha nên không bao giờ quay lại. Đây là khác biệt cấu trúc quan trọng nhất khi chuyển từ cây sang đồ thị.',
    },
    {
      q: 'Trong thuật toán Kahn, điều gì cho biết đồ thị có chu trình?',
      options: [
        'Hàng đợi rỗng ngay từ đầu',
        'Số đỉnh đã xử lý nhỏ hơn tổng số đỉnh khi thuật toán kết thúc',
        'Có đỉnh với indegree lớn hơn 1',
        'Đồ thị có nhiều hơn V-1 cạnh',
      ],
      answer: 1,
      why: 'Các đỉnh nằm trong chu trình không bao giờ có indegree về 0 nên không bao giờ vào hàng đợi. Đây chính là cách npm báo "circular dependency detected".',
    },
    {
      q: 'Bài "đếm số hòn đảo" trong lưới nhị phân — cách tiếp cận chuẩn là gì?',
      options: [
        'Đếm số ô có giá trị 1',
        'Duyệt mọi ô; khi gặp ô đất chưa thăm thì tăng bộ đếm và DFS/BFS làm chìm toàn bộ đảo đó',
        'Sắp xếp lưới rồi đếm',
        'Dùng quy hoạch động trên lưới',
      ],
      answer: 1,
      why: 'Mỗi lần khởi động một lượt duyệt mới = phát hiện một thành phần liên thông mới. Mẫu "đếm thành phần liên thông" này áp dụng cho mọi đồ thị, không riêng lưới.',
    },
  ],
  problems: [
    {
      id: 'number-of-islands',
      title: 'Đếm số hòn đảo',
      en: 'Number of Islands',
      difficulty: 'Medium',
      targetMinutes: 20,
      entry: 'numIslands',
      statement: `
Cho lưới \`grid\` gồm \`"1"\` (đất) và \`"0"\` (nước), đếm số **hòn đảo**.
Một đảo là nhóm các ô đất **liên thông theo chiều ngang/dọc** (không tính chéo).

**Ví dụ**
\`\`\`
[["1","1","0","0"],
 ["1","1","0","0"],
 ["0","0","1","0"],
 ["0","0","0","1"]]   ->  3
\`\`\`
`,
      starter: `function numIslands(grid) {\n  \n}`,
      tests: [
        {
          args: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]],
          expected: 1, name: 'Một đảo lớn',
        },
        {
          args: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]],
          expected: 3, name: 'Ba đảo',
        },
        { args: [[['0']]], expected: 0, name: 'Toàn nước' },
        { args: [[['1']]], expected: 1, name: 'Một ô đất' },
        { args: [[['1', '0', '1', '0', '1']]], expected: 3, name: 'Một hàng' },
        { args: [[['1', '1'], ['0', '1']]], expected: 1, name: 'Nối theo đường chéo vẫn tính là 1 vì có cạnh chung' },
      ],
      hints: [
        'Mẫu hình "đếm thành phần liên thông": duyệt mọi ô; mỗi khi gặp một ô đất **chưa thăm**, tăng bộ đếm lên 1 rồi **làm chìm toàn bộ đảo** đó bằng DFS/BFS.',
        'Hàm `sink(r, c)`: nếu ra ngoài lưới hoặc ô không phải "1" thì return. Ngược lại đặt `grid[r][c] = "0"` (đánh dấu đã thăm) rồi gọi đệ quy 4 hướng.',
        'Ghi đè trực tiếp lên grid tiết kiệm bộ nhớ hơn mảng `visited` riêng. Nếu đề cấm sửa dữ liệu đầu vào, hãy nói rõ điều đó và dùng mảng phụ — người phỏng vấn đánh giá cao việc bạn hỏi trước.',
      ],
      diagnostics: [
        { test: 'count\\s*\\+\\+[\\s\\S]{0,60}\\}\\s*\\}\\s*return count', message: 'Có vẻ bạn đang đếm số ô đất chứ không phải số đảo. Sau khi tăng bộ đếm, bạn phải làm chìm TOÀN BỘ đảo liên thông với ô đó.' },
      ],
      approach: `
**Đây là bài mẫu cho cả một họ bài toán lưới.** Nắm chắc nó, bạn giải được:
Max Area of Island, Surrounded Regions, Pacific Atlantic Water Flow, Flood Fill, Rotting Oranges.

**Khung chuẩn:**
\`\`\`js
let count = 0;
for (let r = 0; r < m; r++)
  for (let c = 0; c < n; c++)
    if (grid[r][c] === '1') { count++; sink(r, c); }
return count;
\`\`\`

**Vì sao đúng?** Vòng lặp ngoài chỉ "chạm" vào mỗi thành phần liên thông **một lần**:
sau lần chạm đầu tiên, \`sink\` đã xoá sạch toàn bộ đảo nên các ô còn lại của nó không kích hoạt lần đếm nữa.

\`\`\`
1 1 0 0        gặp (0,0) -> count=1, chìm cả cụm trái
1 1 0 0    ->  0 0 0 0
0 0 1 0        gặp (2,2) -> count=2
0 0 0 1        gặp (3,3) -> count=3
\`\`\`

**DFS hay BFS?** Ở đây cả hai đều đúng. DFS ngắn hơn; BFS an toàn hơn với lưới rất lớn
(DFS đệ quy trên lưới 1000×1000 toàn đất sẽ tràn ngăn xếp — chi tiết đáng nêu trong phỏng vấn).

**Độ phức tạp:** O(m·n) — mỗi ô được thăm tối đa hai lần (một lần bởi vòng lặp ngoài, một lần bởi sink).
`,
      solution: `function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  const m = grid.length, n = grid[0].length;
  let count = 0;

  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] !== '1') return;
    grid[r][c] = '0';                    // đánh dấu đã thăm
    sink(r + 1, c); sink(r - 1, c);
    sink(r, c + 1); sink(r, c - 1);
  };

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === '1') { count++; sink(r, c); }
    }
  }
  return count;
}`,
      solutionPy: `def numIslands(grid):
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    count = 0

    def sink(r, c):
        if r < 0 or c < 0 or r >= m or c >= n or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        sink(r + 1, c); sink(r - 1, c)
        sink(r, c + 1); sink(r, c - 1)

    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                count += 1
                sink(r, c)
    return count`,
      complexity: {
        question: 'Độ phức tạp thời gian và rủi ro của bản DFS đệ quy trên lưới m×n?',
        options: [
          'O(m·n); rủi ro tràn ngăn xếp khi lưới lớn và toàn đất',
          'O((m·n)²); không có rủi ro',
          'O(m + n); rủi ro sai kết quả',
          'O(m·n·log(m·n)); rủi ro tốn bộ nhớ',
        ],
        answer: 0,
        why: 'Mỗi ô xử lý O(1) lần → O(m·n). Nhưng độ sâu đệ quy có thể tới m·n (lưới toàn "1") → dùng BFS hoặc DFS lặp cho dữ liệu lớn.',
      },
      realWorld: 'Phân tách vùng trong ảnh y tế (đếm tế bào), công cụ "xô sơn" trong phần mềm đồ hoạ, phát hiện cụm người dùng liên kết trong đồ thị gian lận, và đếm vùng phủ sóng liền mạch.',
    },
    {
      id: 'rotting-oranges',
      title: 'Cam thối lan truyền',
      en: 'Rotting Oranges',
      difficulty: 'Medium',
      targetMinutes: 25,
      entry: 'orangesRotting',
      statement: `
Lưới \`grid\` với: \`0\` = ô trống, \`1\` = cam tươi, \`2\` = cam thối.
Mỗi phút, cam thối làm thối **mọi cam tươi kề nó** (4 hướng).

Trả về **số phút tối thiểu** để không còn cam tươi. Nếu không thể, trả về \`-1\`.

**Ví dụ**
- \`[[2,1,1],[1,1,0],[0,1,1]]\` → \`4\`
- \`[[2,1,1],[0,1,1],[1,0,1]]\` → \`-1\` (ô góc dưới trái bị cô lập)
- \`[[0,2]]\` → \`0\`
`,
      starter: `function orangesRotting(grid) {\n  \n}`,
      tests: [
        { args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4, name: 'Ví dụ 1' },
        { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1, name: 'Có cam bị cô lập' },
        { args: [[[0, 2]]], expected: 0, name: 'Không có cam tươi' },
        { args: [[[1]]], expected: -1, name: 'Chỉ có cam tươi, không có nguồn thối' },
        { args: [[[0]]], expected: 0, name: 'Lưới trống' },
        { args: [[[2, 2], [1, 1], [0, 0], [1, 1]]], expected: -1, name: 'Bị chặn bởi ô trống' },
        { args: [[[2, 1, 1], [1, 1, 1], [0, 1, 2]]], expected: 2, name: 'Hai nguồn lan cùng lúc' },
      ],
      hints: [
        'Từ khoá "mỗi phút" + "lan ra các ô kề" = **BFS đa nguồn** (multi-source BFS). Đây là dấu hiệu nhận biết quan trọng.',
        'Khởi tạo hàng đợi với **tất cả** cam thối ban đầu cùng lúc (không phải từng cái một). Đồng thời đếm số cam tươi.',
        'Mỗi vòng lặp xử lý **trọn một tầng** = một phút. Sau khi BFS xong, nếu số cam tươi còn lại > 0 → trả về -1. Chú ý: nếu ban đầu không có cam tươi, đáp án là 0 chứ không phải số phút.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,200}orangesRotting|while\\s*\\(true\\)', message: 'Mô phỏng bằng cách quét lại toàn lưới mỗi phút là O((m·n)²). BFS đa nguồn cho O(m·n).' },
      ],
      approach: `
**BFS đa nguồn** là một trong những kỹ thuật đẹp và hữu dụng nhất của chủ đề đồ thị.

**Trực giác:** thay vì chạy BFS từ từng cam thối rồi lấy min (chậm và rối),
hãy tưởng tượng có một "siêu nguồn" ảo nối tới tất cả cam thối ban đầu.
Đẩy tất cả chúng vào hàng đợi ở bước 0 → chúng lan ra **đồng thời**, đúng như đề bài mô tả.

\`\`\`
[2,1,1]      phút 0: (0,0)
[1,1,0]      phút 1: (0,1),(1,0)
[0,1,1]      phút 2: (0,2),(1,1)
             phút 3: (2,1)
             phút 4: (2,2)   -> đáp án 4
\`\`\`

**Khung code:**
\`\`\`js
let q = [...tất cả ô có giá trị 2], fresh = số ô có giá trị 1, minutes = 0;
while (q.length && fresh > 0) {
  const next = [];
  for (const [r, c] of q)
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (trong lưới && grid[nr][nc] === 1) {
        grid[nr][nc] = 2; fresh--; next.push([nr, nc]);
      }
    }
  q = next;
  minutes++;
}
return fresh === 0 ? minutes : -1;
\`\`\`

**Chú ý điều kiện \`fresh > 0\` trong vòng while:** nếu không có nó, bạn sẽ đếm thừa một phút
ở vòng cuối (khi không còn gì để lây). Đây là lỗi off-by-one phổ biến nhất của bài này.

**Mẫu hình mang đi:** mọi bài "lan toả từ nhiều điểm cùng lúc" — cháy rừng, dịch bệnh,
tín hiệu wifi, khoảng cách tới ô gần nhất (bài 01 Matrix) — đều dùng BFS đa nguồn.
`,
      solution: `function orangesRotting(grid) {
  const m = grid.length, n = grid[0].length;
  let q = [], fresh = 0;

  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 2) q.push([r, c]);      // TẤT CẢ nguồn vào hàng đợi cùng lúc
      else if (grid[r][c] === 1) fresh++;
    }

  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;

  while (q.length && fresh > 0) {                // dừng ngay khi hết cam tươi
    const next = [];
    for (const [r, c] of q) {
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
        if (grid[nr][nc] !== 1) continue;
        grid[nr][nc] = 2;
        fresh--;
        next.push([nr, nc]);
      }
    }
    q = next;
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`,
      solutionPy: `from collections import deque

def orangesRotting(grid):
    m, n = len(grid), len(grid[0])
    q, fresh = deque(), 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 2:
                q.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    minutes = 0
    dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))
    while q and fresh > 0:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
        minutes += 1
    return minutes if fresh == 0 else -1`,
      complexity: {
        question: 'Vì sao BFS đa nguồn đúng hơn (và nhanh hơn) việc chạy BFS riêng từ từng cam thối?',
        options: [
          'Vì nó dùng ít bộ nhớ hơn',
          'Vì các nguồn lan đồng thời đúng như mô tả bài toán, và mỗi ô chỉ được thăm một lần → O(m·n) thay vì O(k·m·n)',
          'Vì BFS đơn nguồn cho kết quả sai',
          'Vì hàng đợi tự sắp xếp theo khoảng cách',
        ],
        answer: 1,
        why: 'Với k nguồn, chạy riêng lẻ tốn O(k·m·n). Đa nguồn khai thác đúng ngữ nghĩa "lan đồng thời" và mỗi ô chỉ bị thăm một lần bởi nguồn GẦN NHẤT.',
      },
      realWorld: 'Mô phỏng lan truyền: cháy rừng, dịch bệnh, tin đồn trên mạng xã hội. Trong hệ thống: tính "khoảng cách tới máy chủ gần nhất" cho mọi vị trí bằng một lần BFS đa nguồn thay vì n lần Dijkstra.',
    },
    {
      id: 'course-schedule',
      title: 'Lịch học (phát hiện chu trình)',
      en: 'Course Schedule',
      difficulty: 'Medium',
      targetMinutes: 25,
      entry: 'canFinish',
      statement: `
Có \`numCourses\` môn học (đánh số 0..n-1) và mảng \`prerequisites\` với \`[a, b]\` nghĩa là
**phải học b trước khi học a**.

Trả về \`true\` nếu có thể hoàn thành tất cả các môn.

**Ví dụ**
- \`numCourses = 2, prerequisites = [[1,0]]\` → \`true\` (học 0 rồi 1)
- \`numCourses = 2, prerequisites = [[1,0],[0,1]]\` → \`false\` (phụ thuộc vòng)
`,
      starter: `function canFinish(numCourses, prerequisites) {\n  \n}`,
      tests: [
        { args: [2, [[1, 0]]], expected: true, name: 'Phụ thuộc đơn giản' },
        { args: [2, [[1, 0], [0, 1]]], expected: false, name: 'Chu trình 2 đỉnh' },
        { args: [5, []], expected: true, name: 'Không có ràng buộc' },
        { args: [4, [[1, 0], [2, 1], [3, 2]]], expected: true, name: 'Chuỗi tuyến tính' },
        { args: [3, [[0, 1], [1, 2], [2, 0]]], expected: false, name: 'Chu trình 3 đỉnh' },
        { args: [5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]]], expected: true, name: 'DAG phân nhánh' },
        { args: [4, [[0, 1], [1, 2], [2, 3], [3, 1]]], expected: false, name: 'Chu trình ở nhánh sau' },
      ],
      hints: [
        'Dịch đề sang ngôn ngữ đồ thị: mỗi môn là một đỉnh, `[a,b]` là cạnh có hướng `b → a`. Câu hỏi "có học hết được không?" tương đương "đồ thị có chu trình không?".',
        'Cách 1 — **Kahn (BFS)**: tính `indegree` (số môn tiên quyết chưa học) cho mỗi môn. Đẩy các môn có indegree = 0 vào hàng đợi. Mỗi lần học một môn thì giảm indegree các môn phụ thuộc nó.',
        'Kết luận: nếu số môn học được **bằng** numCourses → true. Nếu nhỏ hơn → các môn còn lại nằm trong chu trình → false. Nhớ xây danh sách kề trước, đừng quét lại mảng prerequisites trong vòng lặp.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,200}prerequisites[\\s\\S]{0,200}for[\\s\\S]{0,200}prerequisites', message: 'Quét lại mảng prerequisites trong vòng lặp là O(V·E). Hãy xây danh sách kề một lần rồi dùng lại.' },
        { test: 'visited\\s*=\\s*new Set[\\s\\S]{0,400}return false', message: 'Với DFS phát hiện chu trình, một tập `visited` là chưa đủ — bạn cần phân biệt "đang trong đường đi hiện tại" (xám) với "đã xử lý xong" (đen). Nếu không sẽ báo chu trình nhầm ở đồ thị hình kim cương.' },
      ],
      approach: `
**Bước dịch đề — kỹ năng quan trọng nhất:** nhận ra đây là bài **phát hiện chu trình trên đồ thị có hướng**.
Đề không hề nhắc tới "đồ thị" hay "chu trình" — bạn phải tự thấy.

**Cách 1 — Kahn (BFS trên bậc vào) — khuyên dùng:**
\`\`\`js
const adj = Array.from({length: n}, () => []);
const indeg = new Array(n).fill(0);
for (const [a, b] of prerequisites) { adj[b].push(a); indeg[a]++; }

const q = [];
for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);

let done = 0;
while (q.length) {
  const u = q.pop();
  done++;
  for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
}
return done === n;
\`\`\`

Trực giác: mỗi vòng lặp "học xong một môn không còn nợ môn nào". Nếu tới lúc nào đó
không môn nào sẵn sàng mà vẫn còn môn chưa học → chúng nợ lẫn nhau → chu trình.

**Cách 2 — DFS ba màu:**
- trắng = chưa thăm, xám = **đang** nằm trên đường đi hiện tại, đen = đã xử lý xong.
- Gặp lại đỉnh **xám** → có chu trình. Gặp đỉnh **đen** → bỏ qua (đã kiểm tra rồi).

Lỗi kinh điển: chỉ dùng một tập \`visited\` (không phân biệt xám/đen) → báo chu trình sai
với đồ thị hình kim cương \`0→1, 0→2, 1→3, 2→3\`.

**Bonus:** nếu đề hỏi *thứ tự học* (Course Schedule II) thì thứ tự lấy ra khỏi hàng đợi trong Kahn
chính là đáp án — chỉ cần thêm một dòng.
`,
      solution: `function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indeg = new Array(numCourses).fill(0);

  for (const [a, b] of prerequisites) {   // phải học b trước a  =>  b -> a
    adj[b].push(a);
    indeg[a]++;
  }

  const q = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) q.push(i);

  let done = 0;
  while (q.length) {
    const u = q.pop();                    // thứ tự lấy ra không ảnh hưởng kết quả
    done++;
    for (const v of adj[u]) {
      if (--indeg[v] === 0) q.push(v);
    }
  }
  return done === numCourses;             // còn môn chưa học -> có chu trình
}`,
      solutionPy: `from collections import deque

def canFinish(numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]
    indeg = [0] * numCourses
    for a, b in prerequisites:
        adj[b].append(a)
        indeg[a] += 1

    q = deque(i for i in range(numCourses) if indeg[i] == 0)
    done = 0
    while q:
        u = q.popleft()
        done += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return done == numCourses`,
      complexity: {
        question: 'Độ phức tạp của thuật toán Kahn với V đỉnh và E cạnh?',
        options: ['O(V²)', 'O(V + E)', 'O(E log V)', 'O(V · E)'],
        answer: 1,
        why: 'Mỗi đỉnh vào/ra hàng đợi đúng một lần, mỗi cạnh được duyệt đúng một lần khi giảm indegree. Đây là độ phức tạp tối ưu vì bạn buộc phải đọc hết đầu vào.',
      },
      realWorld: 'Trình quản lý gói (npm, pip, apt) dùng chính thuật toán này để xác định thứ tự cài đặt và báo lỗi "circular dependency". Ngoài ra: thứ tự build trong Bazel/Make, lập lịch DAG trong Airflow, và thứ tự tính lại ô trong bảng tính Excel.',
    },
    {
      id: 'clone-graph-lite',
      title: 'Đếm thành phần liên thông',
      en: 'Number of Connected Components',
      difficulty: 'Medium',
      targetMinutes: 18,
      entry: 'countComponents',
      statement: `
Cho \`n\` đỉnh đánh số \`0..n-1\` và danh sách \`edges\` của một đồ thị **vô hướng**,
đếm số **thành phần liên thông**.

**Ví dụ**
- \`n = 5, edges = [[0,1],[1,2],[3,4]]\` → \`2\`
- \`n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]\` → \`1\`
`,
      starter: `function countComponents(n, edges) {\n  \n}`,
      tests: [
        { args: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2, name: 'Hai cụm' },
        { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1, name: 'Một chuỗi' },
        { args: [4, []], expected: 4, name: 'Không có cạnh' },
        { args: [1, []], expected: 1, name: 'Một đỉnh' },
        { args: [6, [[0, 1], [2, 3], [4, 5]]], expected: 3, name: 'Ba cặp' },
        { args: [3, [[0, 1], [1, 2], [0, 2]]], expected: 1, name: 'Có chu trình vẫn là 1 cụm' },
      ],
      hints: [
        'Cách 1 — DFS/BFS: xây danh sách kề, duyệt mọi đỉnh; mỗi lần gặp đỉnh chưa thăm thì tăng bộ đếm và duyệt toàn bộ cụm chứa nó. Giống hệt bài "đếm đảo".',
        'Cách 2 — **Union-Find (Disjoint Set Union)**: bắt đầu với n cụm; mỗi cạnh hợp nhất hai cụm nếu chúng chưa cùng cụm, và giảm bộ đếm đi 1.',
        'Union-Find gồm hai hàm: `find(x)` (tìm đại diện của cụm, có nén đường đi) và `union(a,b)` (nối hai cụm). Đây là cấu trúc bạn sẽ dùng lại cho thuật toán Kruskal ở chủ đề Advanced Graphs.',
      ],
      approach: `
Bài này nhỏ nhưng là cửa ngõ vào **Union-Find** — cấu trúc dữ liệu bạn bắt buộc phải biết.

**Cách 1 — DFS (giống bài đếm đảo):** O(V + E).

**Cách 2 — Union-Find:** đẹp hơn khi đồ thị được cho dưới dạng luồng cạnh (streaming),
hoặc khi cần trả lời liên tục câu hỏi "hai đỉnh này có cùng cụm không?".

\`\`\`js
const parent = Array.from({length: n}, (_, i) => i);

const find = (x) => {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]];   // nén đường đi (path compression)
    x = parent[x];
  }
  return x;
};

let count = n;
for (const [a, b] of edges) {
  const ra = find(a), rb = find(b);
  if (ra !== rb) { parent[ra] = rb; count--; }   // hợp nhất -> bớt một cụm
}
\`\`\`

**Trực giác:** ban đầu mỗi đỉnh là một "quốc gia" riêng. Mỗi cạnh là một hiệp ước sáp nhập.
Nếu hai bên **đã** cùng quốc gia thì cạnh đó là dư thừa (và nó chính là **cạnh tạo chu trình** —
ý tưởng dùng trong bài Redundant Connection và thuật toán Kruskal).

**Độ phức tạp Union-Find:** gần như O(1) mỗi thao tác (chính xác là O(α(n)) — hàm Ackermann ngược,
với mọi n thực tế thì α(n) < 5). Đây là một trong những kết quả đẹp nhất của lý thuyết cấu trúc dữ liệu.
`,
      solution: `function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);

  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];       // nén đường đi
      x = parent[x];
    }
    return x;
  };

  let count = n;                            // ban đầu mỗi đỉnh là một cụm
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) { parent[ra] = rb; count--; }
  }
  return count;
}`,
      solutionPy: `def countComponents(n, edges):
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    count = n
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
            count -= 1
    return count`,
      complexity: {
        question: 'Với nén đường đi, mỗi thao tác find/union của Union-Find tốn khoảng bao nhiêu?',
        options: ['O(log n)', 'O(α(n)) — gần như hằng số, dưới 5 với mọi n thực tế', 'O(n)', 'O(√n)'],
        answer: 1,
        why: 'Union-Find với nén đường đi + hợp nhất theo hạng đạt độ phức tạp khấu hao O(α(n)). Trên thực tế coi như O(1) — đó là lý do nó xuất hiện trong Kruskal và mọi bài "gom cụm động".',
      },
      realWorld: 'Phát hiện cụm tài khoản gian lận có liên hệ với nhau; gom nhóm ảnh cùng một người; kiểm tra mạng có bị chia cắt sau khi một liên kết hỏng; và là nền tảng của thuật toán Kruskal tìm cây khung nhỏ nhất.',
    },
  ],
},

/* ==================================================================== */
{
  id: 'advanced-graphs',
  name: 'Đồ thị nâng cao',
  en: 'Advanced Graphs',
  icon: '🗺️',
  days: [22],
  summary: 'Đồ thị có trọng số: Dijkstra cho đường ngắn nhất, Prim/Kruskal cho cây khung nhỏ nhất.',
  lesson: `
## 1. Vấn đề gốc

BFS tìm đường ngắn nhất khi **mọi cạnh bằng nhau**. Nhưng bản đồ thật thì cạnh có
**trọng số** khác nhau (khoảng cách, thời gian, chi phí). BFS lập tức sai:
đường 2 cạnh có thể tốn 100km, đường 5 cạnh chỉ 10km.

## 2. Dijkstra — BFS với hàng đợi ưu tiên

> Ý tưởng: thay hàng đợi FIFO của BFS bằng **hàng đợi ưu tiên theo khoảng cách**.
> Luôn mở rộng đỉnh **gần nguồn nhất** trong số các đỉnh chưa xử lý.

\`\`\`js
dist = mảng Infinity;  dist[src] = 0;
pq = min-heap chứa [khoảng_cách, đỉnh], khởi tạo [0, src]

while (pq không rỗng) {
  const [d, u] = pq.pop();
  if (d > dist[u]) continue;          // bản cũ đã lỗi thời -> bỏ qua
  for (const [v, w] of adj[u]) {
    if (d + w < dist[v]) {
      dist[v] = d + w;
      pq.push([dist[v], v]);
    }
  }
}
\`\`\`

**Vì sao đúng?** Bất biến: khi một đỉnh được lấy ra khỏi heap, \`dist[u]\` đã là **tối ưu cuối cùng**.
Lý do: mọi đường khác tới u đều phải đi qua một đỉnh đang nằm trong heap với khoảng cách ≥ d,
và vì **trọng số không âm**, thêm cạnh chỉ làm dài thêm.

**Điều kiện bắt buộc: không có cạnh âm.** Có cạnh âm → dùng Bellman-Ford (O(V·E)).
Đây là câu hỏi bẫy rất hay gặp.

## 3. Cây khung nhỏ nhất (MST)

Bài toán: nối tất cả các đỉnh với **tổng chi phí nhỏ nhất**, không tạo chu trình.
Kết quả luôn có đúng V-1 cạnh.

| Thuật toán | Cách làm | Độ phức tạp | Hợp với |
|---|---|---|---|
| **Prim** | mở rộng dần từ một đỉnh, luôn lấy cạnh rẻ nhất chạm vào cây | O(E log V) | đồ thị dày |
| **Kruskal** | sắp xếp mọi cạnh, thêm dần nếu không tạo chu trình (Union-Find) | O(E log E) | đồ thị thưa |

Cả hai đều **tham lam** và cùng dựa trên một định lý: với mọi cách chia đỉnh thành hai nhóm,
**cạnh nhẹ nhất nối hai nhóm luôn thuộc một MST nào đó** (cut property).

## 4. Bảng chọn thuật toán — hãy thuộc bảng này

| Bài toán | Thuật toán | Độ phức tạp |
|---|---|---|
| Đường ngắn nhất, cạnh không trọng số | BFS | O(V+E) |
| Đường ngắn nhất, trọng số **không âm** | **Dijkstra** | O(E log V) |
| Đường ngắn nhất, có **trọng số âm** | Bellman-Ford | O(V·E) |
| Đường ngắn nhất **mọi cặp đỉnh** | Floyd-Warshall | O(V³) |
| Nối mọi đỉnh chi phí nhỏ nhất | Prim / Kruskal | O(E log V) |
| Thứ tự phụ thuộc | Topo sort (Kahn) | O(V+E) |

## 5. Ứng dụng thực tế

- **Google Maps / Waze**: Dijkstra (thực tế dùng A\\* và contraction hierarchies để nhanh hơn).
- **Định tuyến mạng**: OSPF dùng Dijkstra; BGP dùng biến thể vector khoảng cách.
- **Thiết kế hạ tầng**: kéo cáp/đường ống nối n điểm với chi phí thấp nhất = MST.
- **Phân cụm dữ liệu**: cắt các cạnh dài nhất của MST cho ra phân cụm phân cấp.
- **Chênh lệch giá (arbitrage)** trong tài chính: tìm chu trình âm bằng Bellman-Ford.
`,
  quiz: [
    {
      q: 'Vì sao Dijkstra KHÔNG đúng khi đồ thị có cạnh trọng số âm?',
      options: [
        'Vì thuật toán sẽ chạy vô hạn',
        'Vì Dijkstra "chốt" khoảng cách của một đỉnh khi lấy nó ra khỏi heap, nhưng cạnh âm sau đó có thể tạo ra đường ngắn hơn',
        'Vì heap không xử lý được số âm',
        'Vì không thể xây được danh sách kề',
      ],
      answer: 1,
      why: 'Tính đúng đắn dựa vào giả định "đi thêm cạnh thì đường chỉ dài ra". Cạnh âm phá vỡ giả định đó. Khi có cạnh âm phải dùng Bellman-Ford — biết điều này là dấu hiệu hiểu sâu.',
    },
    {
      q: 'Trong Dijkstra, vì sao cần dòng `if (d > dist[u]) continue;`?',
      options: [
        'Để xử lý cạnh âm',
        'Vì một đỉnh có thể được đẩy vào heap nhiều lần với các khoảng cách khác nhau; bản cũ hơn cần bị bỏ qua',
        'Để tránh chia cho 0',
        'Để đảm bảo đồ thị liên thông',
      ],
      answer: 1,
      why: 'Heap chuẩn không hỗ trợ "giảm khoá" (decrease-key), nên ta đẩy bản mới và để bản cũ lại. Dòng kiểm tra này (lazy deletion) là cách xử lý gọn nhất.',
    },
    {
      q: 'Cây khung nhỏ nhất của đồ thị V đỉnh có bao nhiêu cạnh?',
      options: ['V', 'V - 1', 'V + 1', 'Phụ thuộc trọng số'],
      answer: 1,
      why: 'Theo định nghĩa cây: liên thông và không chu trình → đúng V-1 cạnh. Nhớ con số này giúp bạn kiểm tra nhanh xem lời giải có hợp lý không.',
    },
    {
      q: 'Bạn cần nối n toà nhà bằng cáp quang với tổng chiều dài nhỏ nhất. Đây là bài toán gì?',
      options: [
        'Đường đi ngắn nhất (Dijkstra)',
        'Cây khung nhỏ nhất (Prim/Kruskal)',
        'Sắp xếp tôpô',
        'Luồng cực đại',
      ],
      answer: 1,
      why: 'Yêu cầu là "nối TẤT CẢ các đỉnh với tổng chi phí nhỏ nhất" — chính là MST. Dijkstra tối ưu đường đi từ MỘT nguồn tới từng đỉnh, một mục tiêu hoàn toàn khác.',
    },
  ],
  problems: [
    {
      id: 'network-delay-time',
      title: 'Thời gian trễ của mạng (Dijkstra)',
      en: 'Network Delay Time',
      difficulty: 'Medium',
      targetMinutes: 30,
      entry: 'networkDelayTime',
      statement: `
Có \`n\` nút mạng đánh số \`1..n\`. Mảng \`times\` gồm các bộ \`[u, v, w]\`: tín hiệu từ u tới v mất w đơn vị thời gian.

Phát tín hiệu từ nút \`k\`. Trả về **thời gian để tất cả các nút nhận được tín hiệu**.
Nếu có nút không nhận được, trả về \`-1\`.

**Ví dụ**
- \`times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2\` → \`2\`
- \`times = [], n = 2, k = 1\` → \`-1\`
`,
      starter: `function networkDelayTime(times, n, k) {\n  \n}`,
      tests: [
        { args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2, name: 'Ví dụ chuẩn' },
        { args: [[], 1, 1], expected: 0, name: 'Một nút, không cạnh' },
        { args: [[], 2, 1], expected: -1, name: 'Có nút không tới được' },
        { args: [[[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1], expected: 3, name: 'Đường vòng rẻ hơn đường thẳng' },
        { args: [[[1, 2, 1], [2, 1, 3]], 2, 2], expected: 3, name: 'Đồ thị có hướng' },
        { args: [[[1, 2, 1], [2, 3, 7], [1, 3, 4], [2, 1, 2]], 3, 1], expected: 4, name: 'Nhiều đường tới đích' },
      ],
      hints: [
        'Đây là bài "đường đi ngắn nhất từ một nguồn" với trọng số không âm → **Dijkstra**. Đáp án là **giá trị lớn nhất** trong mảng khoảng cách (nút nhận muộn nhất quyết định tổng thời gian).',
        'Xây danh sách kề `adj[u] = [[v, w], ...]`. Khởi tạo `dist` toàn `Infinity` trừ `dist[k] = 0`. Dùng min-heap chứa `[khoảng_cách, đỉnh]`.',
        'Ba chi tiết dễ sai: (1) nút đánh số từ 1 nên mảng cần n+1 phần tử; (2) bỏ qua mục lỗi thời bằng `if (d > dist[u]) continue`; (3) nếu còn `Infinity` trong dist → trả về -1.',
      ],
      diagnostics: [
        { test: 'shift\\s*\\(\\s*\\)[\\s\\S]{0,200}dist', message: 'Dùng hàng đợi FIFO (BFS thường) sẽ cho kết quả sai với đồ thị có trọng số. Bạn cần hàng đợi ưu tiên theo khoảng cách.' },
        { test: 'sort\\s*\\([\\s\\S]{0,60}\\)[\\s\\S]{0,200}while', message: 'Sắp xếp lại mảng mỗi vòng lặp là O(V² log V) — vẫn qua test nhỏ nhưng hãy cài min-heap để đạt O(E log V).' },
      ],
      approach: `
**Bước 1 — Nhận dạng.** "Thời gian tới mọi nút" + trọng số dương = Dijkstra từ nguồn k,
rồi lấy **max** của mảng khoảng cách.

**Bước 2 — Cài đặt.**
\`\`\`js
const adj = Array.from({length: n + 1}, () => []);
for (const [u, v, w] of times) adj[u].push([v, w]);

const dist = new Array(n + 1).fill(Infinity);
dist[k] = 0;
const pq = [[0, k]];                       // min-heap theo phần tử đầu

while (pq.length) {
  const [d, u] = heapPop(pq);
  if (d > dist[u]) continue;               // mục lỗi thời
  for (const [v, w] of adj[u]) {
    if (d + w < dist[v]) { dist[v] = d + w; heapPush(pq, [dist[v], v]); }
  }
}
const ans = Math.max(...dist.slice(1));
return ans === Infinity ? -1 : ans;
\`\`\`

**Bước 3 — Vì sao đúng?**
Bất biến then chốt: *khi một đỉnh được lấy ra khỏi heap lần đầu, khoảng cách của nó đã tối ưu.*
Chứng minh phản chứng: giả sử có đường ngắn hơn tới u. Đường đó phải đi qua một đỉnh x
vẫn còn trong heap, mà \`dist[x] >= dist[u]\` (vì heap lấy ra nhỏ nhất trước).
Vì mọi trọng số ≥ 0, đi từ x tới u chỉ làm dài thêm → mâu thuẫn.

Chính chỗ "vì mọi trọng số ≥ 0" là lý do Dijkstra **sập** với cạnh âm.

\`\`\`
times=[[2,1,1],[2,3,1],[3,4,1]], k=2
dist: [_, 1, 0, 1, 2]  ->  max = 2 ✔
\`\`\`
`,
      solution: `function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);

  // --- min-heap tối giản theo phần tử [0] ---
  const h = [];
  const push = (item) => {
    h.push(item);
    let i = h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[p][0] <= h[i][0]) break;
      [h[p], h[i]] = [h[i], h[p]];
      i = p;
    }
  };
  const pop = () => {
    const top = h[0], last = h.pop();
    if (h.length) {
      h[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let s = i;
        if (l < h.length && h[l][0] < h[s][0]) s = l;
        if (r < h.length && h[r][0] < h[s][0]) s = r;
        if (s === i) break;
        [h[s], h[i]] = [h[i], h[s]];
        i = s;
      }
    }
    return top;
  };

  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  push([0, k]);

  while (h.length) {
    const [d, u] = pop();
    if (d > dist[u]) continue;              // mục lỗi thời trong heap
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) { dist[v] = d + w; push([dist[v], v]); }
    }
  }

  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`,
      solutionPy: `import heapq

def networkDelayTime(times, n, k):
    adj = [[] for _ in range(n + 1)]
    for u, v, w in times:
        adj[u].append((v, w))

    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    pq = [(0, k)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))

    ans = max(dist[1:])
    return -1 if ans == float('inf') else ans`,
      complexity: {
        question: 'Độ phức tạp của Dijkstra dùng binary heap?',
        options: ['O(V²)', 'O(E log V)', 'O(V·E)', 'O(V³)'],
        answer: 1,
        why: 'Mỗi cạnh có thể đẩy một mục vào heap → O(E) mục, mỗi thao tác heap O(log V). Bản dùng mảng (không heap) là O(V²) — nhanh hơn khi đồ thị RẤT dày (E ≈ V²).',
      },
      realWorld: 'Tính độ trễ lan truyền trong mạng phân tán, ước lượng thời gian giao hàng từ một kho tới mọi điểm, và định tuyến gói tin trong giao thức OSPF — tất cả chạy Dijkstra.',
    },
    {
      id: 'min-cost-connect-points',
      title: 'Chi phí nhỏ nhất nối các điểm (MST)',
      en: 'Min Cost to Connect All Points',
      difficulty: 'Medium',
      targetMinutes: 30,
      entry: 'minCostConnectPoints',
      statement: `
Cho \`points\` là mảng các điểm \`[x, y]\` trên mặt phẳng. Chi phí nối hai điểm là
**khoảng cách Manhattan**: \`|x1-x2| + |y1-y2|\`.

Trả về **chi phí nhỏ nhất** để mọi điểm đều liên thông với nhau.

**Ví dụ**
- \`[[0,0],[2,2],[3,10],[5,2],[7,0]]\` → \`20\`
- \`[[3,12],[-2,5],[-4,1]]\` → \`18\`
`,
      starter: `function minCostConnectPoints(points) {\n  \n}`,
      tests: [
        { args: [[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]], expected: 20, name: 'Ví dụ chuẩn' },
        { args: [[[3, 12], [-2, 5], [-4, 1]]], expected: 18, name: 'Toạ độ âm' },
        { args: [[[0, 0]]], expected: 0, name: 'Một điểm' },
        { args: [[[0, 0], [1, 1]]], expected: 2, name: 'Hai điểm' },
        { args: [[[0, 0], [1, 1], [1, 0], [-1, 1]]], expected: 4, name: 'Bốn điểm gần nhau' },
        { args: [[[-1000000, -1000000], [1000000, 1000000]]], expected: 4000000, name: 'Toạ độ lớn' },
      ],
      hints: [
        'Nhận dạng: "nối TẤT CẢ các điểm với tổng chi phí nhỏ nhất" = **cây khung nhỏ nhất (MST)**. Đồ thị ở đây là **đầy đủ**: mọi cặp điểm đều có cạnh.',
        'Vì đồ thị đầy đủ (E = V²), **Prim** phù hợp hơn Kruskal. Prim: giữ mảng `minDist[i]` = chi phí rẻ nhất để nối điểm i vào cây hiện tại.',
        'Vòng lặp n lần: chọn điểm chưa thuộc cây có `minDist` nhỏ nhất, cộng vào tổng, đánh dấu đã thuộc cây, rồi **cập nhật** `minDist` của mọi điểm còn lại bằng khoảng cách tới điểm vừa thêm. O(n²) là đủ tốt với n ≤ 1000.',
      ],
      diagnostics: [
        { test: 'Math\\.sqrt|\\*\\*\\s*2', message: 'Đề dùng khoảng cách MANHATTAN (|dx| + |dy|), không phải Euclid. Không cần bình phương hay căn.' },
        { test: 'sort\\s*\\(\\s*\\)[\\s\\S]{0,100}return', message: 'Chỉ sắp xếp các cạnh là chưa đủ — Kruskal còn cần Union-Find để bỏ qua cạnh tạo chu trình.' },
      ],
      approach: `
**Nhận dạng là 80% công việc:** "nối tất cả, chi phí nhỏ nhất, không cần đường đi ngắn nhất giữa từng cặp"
→ MST, không phải Dijkstra.

**Prim (khuyên dùng ở đây vì đồ thị đầy đủ):**
\`\`\`
inMST = [false × n]
minDist = [Infinity × n];  minDist[0] = 0
total = 0

lặp n lần:
  chọn u = điểm chưa thuộc MST có minDist nhỏ nhất
  total += minDist[u];  inMST[u] = true
  với mọi v chưa thuộc MST:
    minDist[v] = min(minDist[v], dist(u, v))    // cập nhật "chi phí chạm vào cây"
\`\`\`

**Trực giác:** cây lớn dần như một vết dầu loang. Ở mỗi bước, ta trả tiền cho **cạnh rẻ nhất**
nối cây hiện tại với phần thế giới bên ngoài. Tính đúng đắn đến từ **cut property**:
cạnh nhẹ nhất bắc qua một nhát cắt luôn thuộc MST nào đó.

**Kruskal (cách thay thế):** sinh mọi cạnh (n² cạnh), sắp xếp, rồi dùng Union-Find thêm dần
cạnh không tạo chu trình. O(n² log n) — chậm hơn ở bài này nhưng tốt hơn với đồ thị thưa.

**Vì sao Prim O(n²) chấp nhận được?** Vì đồ thị đầy đủ nên E = n²/2; dùng heap cũng không giúp gì
(O(E log V) = O(n² log n) còn tệ hơn). Chọn cài đặt theo **mật độ đồ thị** là kỹ năng thật.

\`\`\`
[[0,0],[2,2],[3,10],[5,2],[7,0]]
nối (0,0)-(2,2)=4, (2,2)-(5,2)=3, (5,2)-(7,0)=4, (2,2)-(3,10)=9  -> 20 ✔
\`\`\`
`,
      solution: `function minCostConnectPoints(points) {
  const n = points.length;
  if (n <= 1) return 0;

  const dist = (i, j) =>
    Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);

  const inMST = new Array(n).fill(false);
  const minDist = new Array(n).fill(Infinity);
  minDist[0] = 0;
  let total = 0;

  for (let iter = 0; iter < n; iter++) {
    // chọn đỉnh chưa thuộc cây có chi phí kết nối nhỏ nhất
    let u = -1;
    for (let v = 0; v < n; v++)
      if (!inMST[v] && (u === -1 || minDist[v] < minDist[u])) u = v;

    inMST[u] = true;
    total += minDist[u];

    // cập nhật chi phí "chạm vào cây" cho các đỉnh còn lại
    for (let v = 0; v < n; v++)
      if (!inMST[v]) minDist[v] = Math.min(minDist[v], dist(u, v));
  }
  return total;
}`,
      solutionPy: `def minCostConnectPoints(points):
    n = len(points)
    if n <= 1:
        return 0

    def dist(i, j):
        return abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])

    in_mst = [False] * n
    min_dist = [float('inf')] * n
    min_dist[0] = 0
    total = 0

    for _ in range(n):
        u = min((v for v in range(n) if not in_mst[v]), key=lambda v: min_dist[v])
        in_mst[u] = True
        total += min_dist[u]
        for v in range(n):
            if not in_mst[v]:
                min_dist[v] = min(min_dist[v], dist(u, v))
    return total`,
      complexity: {
        question: 'Vì sao ở bài này Prim O(n²) lại hợp lý hơn Kruskal?',
        options: [
          'Vì Prim luôn nhanh hơn Kruskal',
          'Vì đồ thị ĐẦY ĐỦ (E ≈ n²): Kruskal phải sinh và sắp xếp n² cạnh → O(n² log n), còn Prim dạng ma trận là O(n²)',
          'Vì Kruskal không xử lý được khoảng cách Manhattan',
          'Vì Prim không cần Union-Find',
        ],
        answer: 1,
        why: 'Quy tắc chọn: đồ thị DÀY → Prim dạng ma trận O(V²); đồ thị THƯA → Kruskal hoặc Prim + heap O(E log V). Biết chọn theo mật độ là dấu hiệu của kinh nghiệm thực chiến.',
      },
      realWorld: 'Quy hoạch hạ tầng: kéo cáp quang/đường ống nối các điểm với chi phí thấp nhất. Ngoài ra MST còn dùng để phân cụm dữ liệu (single-linkage clustering) và xấp xỉ lời giải bài toán người bán hàng.',
    },
  ],
},
];
