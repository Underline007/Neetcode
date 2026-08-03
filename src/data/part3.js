/**
 * NHÓM 3 — Cấu trúc phân cấp: Trees, Tries, Heap / Priority Queue
 */

export default [
/* ==================================================================== */
{
  id: 'trees',
  name: 'Cây nhị phân',
  en: 'Trees',
  icon: '🌳',
  days: [13, 14, 15],
  summary: 'Đệ quy là ngôn ngữ tự nhiên của cây: giải bài toán con ở nhánh trái/phải rồi ghép lại.',
  lesson: `
## 1. Vấn đề gốc

Dữ liệu đời thực rất hay có **cấu trúc phân cấp**: thư mục, DOM, cơ cấu tổ chức, cây quyết định.
Mảng và danh sách là *tuyến tính* — chúng không diễn tả được quan hệ cha/con.

Ngoài ra, cây tìm kiếm nhị phân (BST) cân bằng cho cả ba thao tác tìm/thêm/xoá trong **O(log n)**,
điều mà mảng đã sắp (tìm nhanh, thêm chậm) và linked list (thêm nhanh, tìm chậm) không làm được.

## 2. Ý tưởng cốt lõi

> **Cây là cấu trúc đệ quy**: một cây = một nút gốc + cây con trái + cây con phải.
> Vì vậy hầu hết bài toán cây có dạng: *"giải bài toán này cho cây con trái, cho cây con phải,
> rồi kết hợp hai kết quả lại."*

Khung mẫu đúng cho ~80% bài:
\`\`\`js
function solve(node) {
  if (!node) return giá_trị_cơ_sở;        // 1. TRƯỜNG HỢP CƠ SỞ
  const L = solve(node.left);             // 2. tin tưởng đệ quy làm đúng
  const R = solve(node.right);
  return kết_hợp(node.val, L, R);         // 3. ghép lại
}
\`\`\`

**Mẹo tâm lý quan trọng:** đừng cố "chạy trong đầu" toàn bộ đệ quy — bạn sẽ rối.
Hãy tin rằng \`solve(node.left)\` trả về đúng kết quả (giả thiết quy nạp), và chỉ tập trung
vào việc **kết hợp**. Đây là bước nhảy tư duy lớn nhất của chủ đề này.

## 3. Bốn kiểu duyệt và khi nào dùng

| Kiểu | Thứ tự | Dùng khi |
|---|---|---|
| Preorder (gốc → trái → phải) | xử lý nút **trước** con | sao chép cây, tuần tự hoá, truyền thông tin **từ trên xuống** |
| Inorder (trái → gốc → phải) | với BST cho ra **dãy tăng dần** | kiểm tra BST, tìm phần tử nhỏ thứ k |
| Postorder (trái → phải → gốc) | xử lý nút **sau** con | tính chiều cao, xoá cây, gom thông tin **từ dưới lên** |
| BFS theo mức (dùng hàng đợi) | từng tầng | "theo từng tầng", đường đi ngắn nhất theo số cạnh |

Hai câu hỏi quyết định chọn kiểu nào:
1. Nút cần thông tin **từ cha** (giới hạn, độ sâu)? → preorder, truyền tham số xuống.
2. Nút cần thông tin **từ con** (chiều cao, tổng)? → postorder, trả giá trị lên.

## 4. BST — tính chất phải thuộc

> Với mọi nút: **toàn bộ** cây con trái < nút < **toàn bộ** cây con phải.

Chú ý chữ "toàn bộ". Lỗi kinh điển khi kiểm tra BST là chỉ so nút với hai con trực tiếp:
\`\`\`
    5
   / \\
  1   7
     / \\
    3   8      <- 3 < 7 nhưng 3 < 5 nên KHÔNG phải BST hợp lệ
\`\`\`
Cách đúng: truyền **khoảng hợp lệ** (min, max) xuống dưới.

## 5. Bẫy thường gặp

- Quên trường hợp cơ sở \`if (!node)\` → lỗi null.
- Nhầm **chiều cao** (số cạnh) với **số nút trên đường đi** — đọc kỹ đề.
- Cây lệch (như danh sách liên kết) làm đệ quy sâu n tầng → stack overflow. BST **không tự cân bằng**;
  AVL/Red-Black tree mới cân bằng.
- Với bài đường kính/đường đi, hãy tách rõ: hàm đệ quy **trả về** một thứ (chiều cao),
  còn đáp án được cập nhật vào biến ngoài.

## 6. Ứng dụng thực tế

- **Chỉ mục database (B-tree/B+ tree)**: cây nhiều nhánh, chiều cao 3-4 cho hàng tỷ bản ghi.
- **DOM và Virtual DOM**: React so sánh (diff) hai cây để cập nhật giao diện tối thiểu.
- **Cây quyết định / Gradient Boosting (XGBoost)**: mô hình học máy phổ biến nhất cho dữ liệu bảng.
- **Hệ thống file, JSON/XML parser, AST của trình biên dịch**.
- **Merkle tree** trong Git và blockchain: xác minh dữ liệu lớn bằng cách so vài hash.
`,
  lessonPy: `
## 1. Vấn đề gốc

Dữ liệu đời thực rất hay có **cấu trúc phân cấp**: thư mục, DOM, cơ cấu tổ chức, cây quyết định.
List và linked list là *tuyến tính* — chúng không diễn tả được quan hệ cha/con.

Ngoài ra, cây tìm kiếm nhị phân (BST) cân bằng cho cả ba thao tác tìm/thêm/xoá trong **O(log n)**,
điều mà list đã sắp (tìm nhanh, thêm chậm) và linked list (thêm nhanh, tìm chậm) không làm được.

## 2. Ý tưởng cốt lõi

> **Cây là cấu trúc đệ quy**: một cây = một nút gốc + cây con trái + cây con phải.
> Vì vậy hầu hết bài toán cây có dạng: *"giải bài toán này cho cây con trái, cho cây con phải,
> rồi kết hợp hai kết quả lại."*

Khung mẫu đúng cho ~80% bài:
\`\`\`python
def solve(node):
    if not node:
        return gia_tri_co_so           # 1. TRƯỜNG HỢP CƠ SỞ
    L = solve(node.left)                # 2. tin tưởng đệ quy làm đúng
    R = solve(node.right)
    return ket_hop(node.val, L, R)      # 3. ghép lại
\`\`\`

**Mẹo tâm lý quan trọng:** đừng cố "chạy trong đầu" toàn bộ đệ quy — bạn sẽ rối.
Hãy tin rằng \`solve(node.left)\` trả về đúng kết quả (giả thiết quy nạp), và chỉ tập trung
vào việc **kết hợp**. Đây là bước nhảy tư duy lớn nhất của chủ đề này.

Lưu ý về Python: độ sâu đệ quy mặc định giới hạn ~1000 (\`sys.getrecursionlimit()\`).
Với cây rất lệch/sâu, đệ quy có thể ném \`RecursionError\` — khi đó cần chuyển sang bản lặp (BFS/dùng stack).

## 3. Bốn kiểu duyệt và khi nào dùng

| Kiểu | Thứ tự | Dùng khi |
|---|---|---|
| Preorder (gốc → trái → phải) | xử lý nút **trước** con | sao chép cây, tuần tự hoá, truyền thông tin **từ trên xuống** |
| Inorder (trái → gốc → phải) | với BST cho ra **dãy tăng dần** | kiểm tra BST, tìm phần tử nhỏ thứ k |
| Postorder (trái → phải → gốc) | xử lý nút **sau** con | tính chiều cao, xoá cây, gom thông tin **từ dưới lên** |
| BFS theo mức (dùng \`collections.deque\`) | từng tầng | "theo từng tầng", đường đi ngắn nhất theo số cạnh |

Hai câu hỏi quyết định chọn kiểu nào:
1. Nút cần thông tin **từ cha** (giới hạn, độ sâu)? → preorder, truyền tham số xuống.
2. Nút cần thông tin **từ con** (chiều cao, tổng)? → postorder, trả giá trị lên.

## 4. BST — tính chất phải thuộc

> Với mọi nút: **toàn bộ** cây con trái < nút < **toàn bộ** cây con phải.

Chú ý chữ "toàn bộ". Lỗi kinh điển khi kiểm tra BST là chỉ so nút với hai con trực tiếp:
\`\`\`
    5
   / \\
  1   7
     / \\
    3   8      <- 3 < 7 nhưng 3 < 5 nên KHÔNG phải BST hợp lệ
\`\`\`
Cách đúng: truyền **khoảng hợp lệ** (lo, hi) xuống dưới — dùng \`float('-inf')\`/\`float('inf')\` làm biên khởi tạo.

## 5. Bẫy thường gặp

- Quên trường hợp cơ sở \`if not node:\` → lỗi \`AttributeError: NoneType\`.
- Nhầm **chiều cao** (số cạnh) với **số nút trên đường đi** — đọc kỹ đề.
- Cây lệch (như danh sách liên kết) làm đệ quy sâu n tầng → \`RecursionError\` (không phải "stack overflow"
  như ở JS/C++, nhưng cùng bản chất). BST **không tự cân bằng**; AVL/Red-Black tree mới cân bằng.
- Với bài đường kính/đường đi, hãy tách rõ: hàm đệ quy **trả về** một thứ (chiều cao),
  còn đáp án được cập nhật vào biến ngoài (dùng \`nonlocal\` nếu cập nhật biến ở hàm lồng nhau).

## 6. Ứng dụng thực tế

- **Chỉ mục database (B-tree/B+ tree)**: cây nhiều nhánh, chiều cao 3-4 cho hàng tỷ bản ghi.
- **DOM và Virtual DOM**: React so sánh (diff) hai cây để cập nhật giao diện tối thiểu.
- **Cây quyết định / Gradient Boosting (XGBoost, LightGBM)**: mô hình học máy phổ biến nhất cho dữ liệu bảng,
  và cả hai thư viện này đều có API Python là giao diện chính.
- **Hệ thống file, JSON/XML parser, AST của trình biên dịch** — module \`ast\` của Python phân tích chính code Python thành cây.
- **Merkle tree** trong Git và blockchain: xác minh dữ liệu lớn bằng cách so vài hash.
`,
  quiz: [
    {
      q: 'Đâu là cách kiểm tra một cây có phải BST hợp lệ hay không?',
      options: [
        'Với mỗi nút, kiểm tra node.left.val < node.val < node.right.val',
        'Truyền khoảng (min, max) hợp lệ xuống các nút con và kiểm tra nút nằm trong khoảng đó',
        'Kiểm tra cây có cân bằng hay không',
        'Đếm số nút ở mỗi tầng',
      ],
      answer: 1,
      why: 'So sánh với hai con trực tiếp là lỗi kinh điển: một nút sâu bên phải vẫn có thể nhỏ hơn tổ tiên. Ràng buộc BST mang tính TOÀN CỤC nên phải truyền khoảng xuống (hoặc duyệt inorder rồi kiểm tra tăng dần).',
    },
    {
      q: 'Duyệt inorder một BST cho ra kết quả gì?',
      options: ['Thứ tự ngẫu nhiên', 'Dãy giá trị tăng dần', 'Theo từng tầng', 'Từ lá lên gốc'],
      answer: 1,
      why: 'Đây là tính chất đắt giá nhất của BST: inorder = sorted. Nhờ nó, bài "phần tử nhỏ thứ k trong BST" chỉ là inorder rồi đếm tới k, dừng sớm — O(h + k).',
    },
    {
      q: 'Bạn cần tính chiều cao của cây. Nên dùng kiểu duyệt nào và vì sao?',
      options: [
        'Preorder, vì cần biết gốc trước',
        'Postorder, vì chiều cao của một nút phụ thuộc vào chiều cao của các con (thông tin đi từ dưới lên)',
        'Inorder, vì nó cho thứ tự tăng dần',
        'Kiểu nào cũng như nhau',
      ],
      answer: 1,
      why: 'Quy tắc chọn kiểu duyệt: cần thông tin TỪ CON thì postorder (trả giá trị lên); cần thông tin TỪ CHA thì preorder (truyền tham số xuống). Ghi nhớ quy tắc này giúp bạn chọn đúng ngay từ đầu.',
    },
    {
      q: 'Vì sao BFS (duyệt theo tầng) cần hàng đợi (queue) chứ không phải ngăn xếp?',
      options: [
        'Vì hàng đợi nhanh hơn',
        'Vì FIFO đảm bảo các nút cùng tầng được xử lý hết trước khi sang tầng sau',
        'Vì ngăn xếp không lưu được nút cây',
        'Vì hàng đợi tốn ít bộ nhớ hơn',
      ],
      answer: 1,
      why: 'Thứ tự lấy ra quyết định thứ tự khám phá: FIFO → lan toả theo tầng (BFS); LIFO → đi sâu một nhánh trước (DFS). Đổi queue thành stack là biến BFS thành DFS.',
    },
  ],
  quizPy: [
    {
      q: 'Đâu là cách kiểm tra một cây có phải BST hợp lệ hay không?',
      options: [
        'Với mỗi nút, kiểm tra node.left.val < node.val < node.right.val',
        'Truyền khoảng (lo, hi) hợp lệ xuống các nút con và kiểm tra nút nằm trong khoảng đó',
        'Kiểm tra cây có cân bằng hay không',
        'Đếm số nút ở mỗi tầng',
      ],
      answer: 1,
      why: 'So sánh với hai con trực tiếp là lỗi kinh điển: một nút sâu bên phải vẫn có thể nhỏ hơn tổ tiên. Ràng buộc BST mang tính TOÀN CỤC nên phải truyền khoảng xuống (hoặc duyệt inorder rồi kiểm tra tăng dần).',
    },
    {
      q: 'Duyệt inorder một BST cho ra kết quả gì?',
      options: ['Thứ tự ngẫu nhiên', 'Dãy giá trị tăng dần', 'Theo từng tầng', 'Từ lá lên gốc'],
      answer: 1,
      why: 'Đây là tính chất đắt giá nhất của BST: inorder = sorted. Nhờ nó, bài "phần tử nhỏ thứ k trong BST" chỉ là inorder rồi đếm tới k, dừng sớm — O(h + k).',
    },
    {
      q: 'Bạn cần tính chiều cao của cây. Nên dùng kiểu duyệt nào và vì sao?',
      options: [
        'Preorder, vì cần biết gốc trước',
        'Postorder, vì chiều cao của một nút phụ thuộc vào chiều cao của các con (thông tin đi từ dưới lên)',
        'Inorder, vì nó cho thứ tự tăng dần',
        'Kiểu nào cũng như nhau',
      ],
      answer: 1,
      why: 'Quy tắc chọn kiểu duyệt: cần thông tin TỪ CON thì postorder (trả giá trị lên); cần thông tin TỪ CHA thì preorder (truyền tham số xuống). Ghi nhớ quy tắc này giúp bạn chọn đúng ngay từ đầu.',
    },
    {
      q: 'Vì sao BFS (duyệt theo tầng) cần hàng đợi (collections.deque) chứ không phải ngăn xếp?',
      options: [
        'Vì hàng đợi nhanh hơn',
        'Vì FIFO đảm bảo các nút cùng tầng được xử lý hết trước khi sang tầng sau',
        'Vì ngăn xếp không lưu được nút cây',
        'Vì hàng đợi tốn ít bộ nhớ hơn',
      ],
      answer: 1,
      why: 'Thứ tự lấy ra quyết định thứ tự khám phá: FIFO → lan toả theo tầng (BFS); LIFO → đi sâu một nhánh trước (DFS). deque.popleft() là O(1); dùng list.pop(0) sẽ là O(n) và làm chậm cả thuật toán.',
    },
  ],
  problems: [
    {
      id: 'invert-binary-tree',
      title: 'Lật ngược cây nhị phân',
      en: 'Invert Binary Tree',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'invertTree',
      statement: `
Cho gốc của một cây nhị phân, hãy **lật ngược** nó (đổi chỗ cây con trái và phải ở mọi nút),
rồi trả về gốc.

**Ví dụ**
- \`[4,2,7,1,3,6,9]\` → \`[4,7,2,9,6,3,1]\`

Cây được biểu diễn theo mảng kiểu LeetCode (theo tầng, \`null\` cho nút trống).
Lớp \`TreeNode\` có sẵn với \`.val\`, \`.left\`, \`.right\`.

> Bài này nổi tiếng vì tác giả Homebrew từng trượt phỏng vấn Google vì nó.
`,
      starter: `function invertTree(root) {\n  \n}`,
      starterPy: `def invertTree(root):\n    \n`,
      harnessSrc: `(fn, args) => treeToArray(fn(buildTree(args[0])))`,
      harnessSrcPy: `lambda fn, args, t: treeToArray(fn(buildTree(args[0])))`,
      tests: [
        { args: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1], name: 'Cây đầy đủ' },
        { args: [[2, 1, 3]], expected: [2, 3, 1], name: 'Ba nút' },
        { args: [[]], expected: [], name: 'Cây rỗng' },
        { args: [[1]], expected: [1], name: 'Một nút' },
        { args: [[1, 2]], expected: [1, null, 2], name: 'Chỉ có con trái' },
        { args: [[1, 2, 3, 4, null, null, 5]], expected: [1, 3, 2, 5, null, null, 4], name: 'Cây lệch' },
      ],
      hints: [
        'Khung đệ quy chuẩn: trường hợp cơ sở là `if (!root) return null;`. Sau đó nghĩ: nếu cây con trái và phải đã được lật đúng rồi, mình cần làm gì nữa?',
        'Chỉ cần **hoán đổi** hai con: `[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]`.',
        'Thứ tự lật con và hoán đổi không quan trọng, miễn là bạn không dùng biến đã bị ghi đè. Nếu viết `root.left = invertTree(root.right)` trước thì phải lưu `root.left` cũ vào biến tạm.',
      ],
      hintsPy: [
        'Khung đệ quy chuẩn: trường hợp cơ sở là `if not root: return None`. Sau đó nghĩ: nếu cây con trái và phải đã được lật đúng rồi, mình cần làm gì nữa?',
        'Chỉ cần **hoán đổi** hai con. Python cho phép gán song song ngay cả khi vế phải gọi hàm: `root.left, root.right = invertTree(root.right), invertTree(root.left)` — vế phải được tính toàn bộ trước khi gán, nên không sợ bị ghi đè giữa chừng.',
        'Đây là một trong số ít trường hợp Python "an toàn hơn" JS về mặt cú pháp: gán song song `a, b = b, a` đánh giá toàn bộ vế phải trước, nên không cần biến tạm.',
      ],
      diagnostics: [
        { test: 'root\\.left\\s*=\\s*invertTree\\(root\\.right\\)\\s*;?\\s*\\n?\\s*root\\.right\\s*=\\s*invertTree\\(root\\.left\\)', message: 'Bạn đã ghi đè `root.left` ở dòng đầu, nên dòng sau dùng phải giá trị MỚI. Hãy lưu vào biến tạm hoặc dùng gán đồng thời.' },
      ],
      diagnosticsPy: [
        { test: 'root\\.left\\s*=\\s*invertTree\\(root\\.right\\)\\s*\\n\\s*root\\.right\\s*=\\s*invertTree\\(root\\.left\\)', message: 'Bạn đã ghi đè `root.left` ở dòng đầu, nên dòng sau dùng phải giá trị MỚI. Hãy dùng gán song song: `root.left, root.right = invertTree(root.right), invertTree(root.left)`.' },
      ],
      approach: `
Bài đơn giản nhưng là bài tập tốt nhất để làm quen "niềm tin đệ quy".

**Đừng** cố hình dung toàn bộ cây bị lật thế nào. Chỉ cần trả lời hai câu hỏi:
1. Cây rỗng thì sao? → trả về null.
2. Giả sử \`invertTree\` đã lật đúng hai cây con, tôi cần làm gì? → hoán đổi chúng.

Xong. Đó chính là quy nạp toán học dưới dạng code.

\`\`\`
     4                4
   /   \\            /   \\
  2     7    ->    7     2
 / \\   / \\        / \\   / \\
1   3 6   9      9   6 3   1
\`\`\`

**Bản lặp (BFS)** — nên biết để tránh tràn stack với cây sâu:
\`\`\`js
const q = [root];
while (q.length) {
  const n = q.shift();
  if (!n) continue;
  [n.left, n.right] = [n.right, n.left];
  q.push(n.left, n.right);
}
\`\`\`
`,
      solution: `function invertTree(root) {
  if (!root) return null;
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  root.left = right;
  root.right = left;
  return root;
}`,
      solutionPy: `def invertTree(root):
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
      complexity: {
        question: 'Độ phức tạp thời gian / bộ nhớ (n nút, chiều cao h)?',
        options: ['O(n) / O(h)', 'O(n) / O(1)', 'O(n log n) / O(n)', 'O(h) / O(h)'],
        answer: 0,
        why: 'Mỗi nút thăm đúng một lần → O(n). Bộ nhớ là độ sâu ngăn xếp đệ quy = chiều cao h; cây cân bằng h = log n, cây lệch h = n.',
      },
      realWorld: 'Biến đổi cấu trúc cây tại chỗ: đảo thứ tự hiển thị của cây menu cho giao diện phải-sang-trái (RTL), hay lật cây quyết định khi đảo dấu điều kiện.',
    },
    {
      id: 'max-depth-tree',
      title: 'Độ sâu lớn nhất của cây',
      en: 'Maximum Depth of Binary Tree',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'maxDepth',
      statement: `
Cho gốc cây nhị phân, trả về **độ sâu lớn nhất** — số nút trên đường đi dài nhất từ gốc xuống lá.

**Ví dụ**
- \`[3,9,20,null,null,15,7]\` → \`3\`
- \`[]\` → \`0\`
`,
      starter: `function maxDepth(root) {\n  \n}`,
      starterPy: `def maxDepth(root):\n    \n`,
      harnessSrc: `(fn, args) => fn(buildTree(args[0]))`,
      harnessSrcPy: `lambda fn, args, t: fn(buildTree(args[0]))`,
      tests: [
        { args: [[3, 9, 20, null, null, 15, 7]], expected: 3, name: 'Ví dụ chuẩn' },
        { args: [[1, null, 2]], expected: 2, name: 'Cây lệch phải' },
        { args: [[]], expected: 0, name: 'Cây rỗng' },
        { args: [[1]], expected: 1, name: 'Một nút' },
        { args: [[1, 2, 3, 4, 5, null, null, 6]], expected: 4, name: 'Lệch trái sâu' },
      ],
      hints: [
        'Độ sâu của một cây = 1 + độ sâu lớn hơn trong hai cây con. Trường hợp cơ sở: cây rỗng có độ sâu 0.',
        'Một dòng: `return root ? 1 + Math.max(maxDepth(root.left), maxDepth(root.right)) : 0;`',
        'Nên biết cả bản BFS: đếm số tầng bằng hàng đợi. Bản BFS an toàn hơn với cây rất sâu (không gây RecursionError) và là nền tảng cho bài "duyệt theo tầng".',
      ],
      hintsPy: [
        'Độ sâu của một cây = 1 + độ sâu lớn hơn trong hai cây con. Trường hợp cơ sở: cây rỗng có độ sâu 0.',
        'Một dòng: `return 1 + max(maxDepth(root.left), maxDepth(root.right)) if root else 0`.',
        'Nên biết cả bản BFS bằng `collections.deque`: đếm số tầng. Bản BFS an toàn hơn với cây rất sâu (tránh `RecursionError`) và là nền tảng cho bài "duyệt theo tầng".',
      ],
      approach: `
Đây là ví dụ mẫu mực của **postorder**: thông tin đi **từ dưới lên**.

\`\`\`
depth(node) = 0                                  nếu node rỗng
            = 1 + max(depth(trái), depth(phải))  ngược lại
\`\`\`

Công thức truy hồi này gần như chính là code — đó là vẻ đẹp của đệ quy trên cây.

**Bản BFS đếm tầng** (nên thuộc, vì nó là khung của rất nhiều bài khác):
\`\`\`js
if (!root) return 0;
let q = [root], depth = 0;
while (q.length) {
  const next = [];
  for (const n of q) {           // xử lý TRỌN một tầng
    if (n.left) next.push(n.left);
    if (n.right) next.push(n.right);
  }
  q = next;
  depth++;
}
return depth;
\`\`\`
Mẹo "xử lý trọn một tầng bằng cách chụp lại kích thước hàng đợi" sẽ dùng lại ở bài Level Order
và trong BFS trên đồ thị.
`,
      solution: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      solutionPy: `def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
      complexity: {
        question: 'Với cây bị lệch hoàn toàn (giống danh sách liên kết) gồm 10⁵ nút, bản đệ quy gặp rủi ro gì?',
        options: [
          'Chạy sai kết quả',
          'Tràn ngăn xếp (stack overflow) vì độ sâu đệ quy bằng n',
          'Tốn O(n²) thời gian',
          'Không có rủi ro gì',
        ],
        answer: 1,
        why: 'Bộ nhớ của đệ quy là O(h). Cây cân bằng h ≈ log n (an toàn), nhưng cây lệch h = n → tràn stack. Trong phỏng vấn, nêu được rủi ro này là điểm cộng lớn.',
      },
      realWorld: 'Đo độ sâu lồng nhau: cảnh báo cấu trúc JSON/DOM quá sâu (ảnh hưởng hiệu năng render), hay giới hạn độ sâu thư mục khi quét hệ thống file.',
    },
    {
      id: 'level-order',
      title: 'Duyệt cây theo tầng',
      en: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'levelOrder',
      statement: `
Cho gốc cây nhị phân, trả về giá trị các nút **theo từng tầng**, từ trái sang phải,
mỗi tầng là một mảng con.

**Ví dụ**
- \`[3,9,20,null,null,15,7]\` → \`[[3],[9,20],[15,7]]\`
- \`[]\` → \`[]\`
`,
      starter: `function levelOrder(root) {\n  \n}`,
      starterPy: `def levelOrder(root):\n    \n`,
      harnessSrc: `(fn, args) => fn(buildTree(args[0]))`,
      harnessSrcPy: `lambda fn, args, t: fn(buildTree(args[0]))`,
      tests: [
        { args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]], name: 'Ví dụ chuẩn' },
        { args: [[1]], expected: [[1]], name: 'Một nút' },
        { args: [[]], expected: [], name: 'Cây rỗng' },
        { args: [[1, 2, 3, 4, null, null, 5]], expected: [[1], [2, 3], [4, 5]], name: 'Cây thưa' },
        { args: [[1, null, 2, null, 3]], expected: [[1], [2], [3]], name: 'Lệch phải hoàn toàn' },
      ],
      hints: [
        'BFS bằng hàng đợi. Điều khó duy nhất: làm sao biết một tầng kết thúc ở đâu?',
        'Mẹo chuẩn: **chụp lại số phần tử trong hàng đợi ở đầu mỗi vòng** (`const size = q.length`) — đó chính là số nút của tầng hiện tại. Xử lý đúng `size` nút rồi kết thúc tầng.',
        'Trong JS, `q.shift()` là O(n) với mảng lớn. Cách nhanh hơn: giữ hai mảng `cur` và `next`, hoặc dùng chỉ số đầu `head` thay vì shift.',
      ],
      hintsPy: [
        'BFS bằng hàng đợi. Điều khó duy nhất: làm sao biết một tầng kết thúc ở đâu?',
        'Mẹo chuẩn: **chụp lại số phần tử trong hàng đợi ở đầu mỗi vòng** (`size = len(q)`) — đó chính là số nút của tầng hiện tại. Xử lý đúng `size` nút rồi kết thúc tầng.',
        'Dùng `collections.deque` chứ không dùng `list` làm hàng đợi: `list.pop(0)` là O(n) mỗi lần, còn `deque.popleft()` là O(1).',
      ],
      diagnostics: [
        { test: 'q\\.shift\\s*\\(\\s*\\)', message: '`Array.shift()` là O(n) nên tổng có thể thành O(n²) với cây lớn. Với bài này vẫn qua, nhưng hãy biết cách dùng con trỏ `head` hoặc hai mảng cur/next.' },
      ],
      diagnosticsPy: [
        { test: '\\.pop\\(0\\)', message: '`list.pop(0)` là O(n) nên tổng có thể thành O(n²) với cây lớn. Hãy dùng `collections.deque` với `popleft()` — O(1).' },
      ],
      approach: `
**Khung "BFS theo tầng"** — học một lần, dùng cho cả cây lẫn đồ thị (đường đi ngắn nhất, ma trận lan toả):

\`\`\`js
const res = [];
if (!root) return res;
let cur = [root];
while (cur.length) {
  const next = [], vals = [];
  for (const n of cur) {
    vals.push(n.val);
    if (n.left) next.push(n.left);
    if (n.right) next.push(n.right);
  }
  res.push(vals);
  cur = next;                 // sang tầng kế tiếp
}
\`\`\`

**Vì sao khung này quan trọng hơn bản thân bài toán?** Vì "xử lý trọn một tầng" là chìa khoá của:
- Đường đi ngắn nhất theo số bước (BFS trên đồ thị không trọng số)
- Bài "thối rữa cam" (Rotting Oranges) — lan toả theo đơn vị thời gian
- Right Side View, Zigzag Traversal, tìm tầng có tổng lớn nhất

Bất cứ khi nào đề nói **"theo từng bước / từng phút / từng tầng"**, hãy nghĩ tới khung này.
`,
      solution: `function levelOrder(root) {
  const res = [];
  if (!root) return res;

  let cur = [root];
  while (cur.length) {
    const next = [], vals = [];
    for (const node of cur) {
      vals.push(node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    res.push(vals);
    cur = next;
  }
  return res;
}`,
      solutionPy: `from collections import deque

def levelOrder(root):
    res = []
    if not root:
        return res
    q = deque([root])
    while q:
        size = len(q)          # chụp lại kích thước tầng hiện tại
        vals = []
        for _ in range(size):
            node = q.popleft()
            vals.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(vals)
    return res`,
      complexity: {
        question: 'Bộ nhớ xấu nhất của BFS trên cây n nút?',
        options: ['O(1)', 'O(log n)', 'O(n) — tầng cuối của cây đầy đủ chứa tới n/2 nút', 'O(n²)'],
        answer: 2,
        why: 'Đây là điểm khác biệt quan trọng với DFS: DFS tốn O(h) (chiều cao), BFS tốn O(w) (bề rộng lớn nhất). Cây đầy đủ có tầng cuối ≈ n/2 nút → BFS tốn nhiều bộ nhớ hơn.',
      },
      realWorld: 'Duyệt phân cấp theo tầng: hiển thị cơ cấu tổ chức theo cấp bậc, lan truyền thông báo theo từng vòng bạn bè, hay crawl web theo độ sâu tăng dần.',
    },
    {
      id: 'validate-bst',
      title: 'Kiểm tra cây tìm kiếm nhị phân hợp lệ',
      en: 'Validate Binary Search Tree',
      difficulty: 'Medium',
      targetMinutes: 20,
      entry: 'isValidBST',
      statement: `
Cho gốc cây nhị phân, xác định nó có phải **BST hợp lệ** không.

BST hợp lệ: với mọi nút, **toàn bộ** cây con trái nhỏ hơn nút, **toàn bộ** cây con phải lớn hơn nút,
và cả hai cây con cũng là BST hợp lệ.

**Ví dụ**
- \`[2,1,3]\` → \`true\`
- \`[5,1,4,null,null,3,6]\` → \`false\` (3 nằm ở cây con phải của 5 nhưng lại nhỏ hơn 5)
`,
      starter: `function isValidBST(root) {\n  \n}`,
      starterPy: `def isValidBST(root):\n    \n`,
      harnessSrc: `(fn, args) => fn(buildTree(args[0])) === true`,
      harnessSrcPy: `lambda fn, args, t: fn(buildTree(args[0])) is True`,
      tests: [
        { args: [[2, 1, 3]], expected: true, name: 'BST hợp lệ' },
        { args: [[5, 1, 4, null, null, 3, 6]], expected: false, name: 'Vi phạm ràng buộc toàn cục' },
        { args: [[]], expected: true, name: 'Cây rỗng' },
        { args: [[1]], expected: true, name: 'Một nút' },
        { args: [[5, 4, 6, null, null, 3, 7]], expected: false, name: 'Bẫy kinh điển: 3 < 5 nhưng nằm bên phải' },
        { args: [[2, 2, 2]], expected: false, name: 'Giá trị bằng nhau không hợp lệ' },
        { args: [[10, 5, 15, null, null, 6, 20]], expected: false, name: 'Vi phạm ở tầng sâu' },
        { args: [[3, 1, 5, 0, 2, 4, 6]], expected: true, name: 'BST đầy đủ' },
      ],
      hints: [
        'Bẫy số 1: chỉ so `node.val` với `node.left.val` và `node.right.val` là SAI. Hãy nhìn test "[5,4,6,null,null,3,7]" — mọi cặp cha-con đều đúng nhưng cây vẫn không phải BST.',
        'Ràng buộc BST là **toàn cục**: mỗi nút phải nằm trong một khoảng (min, max) được xác định bởi tất cả tổ tiên của nó.',
        'Đi xuống trái: cận trên thành `node.val`. Đi xuống phải: cận dưới thành `node.val`. Khởi tạo `(-Infinity, +Infinity)`. Cách thứ hai: duyệt inorder và kiểm tra dãy tăng **nghiêm ngặt**.',
      ],
      hintsPy: [
        'Bẫy số 1: chỉ so `node.val` với `node.left.val` và `node.right.val` là SAI. Hãy nhìn test "[5,4,6,null,null,3,7]" — mọi cặp cha-con đều đúng nhưng cây vẫn không phải BST.',
        'Ràng buộc BST là **toàn cục**: mỗi nút phải nằm trong một khoảng (lo, hi) được xác định bởi tất cả tổ tiên của nó.',
        'Đi xuống trái: cận trên thành `node.val`. Đi xuống phải: cận dưới thành `node.val`. Khởi tạo `(float(\'-inf\'), float(\'inf\'))`. Python cho phép viết gọn `lo < node.val < hi`. Cách thứ hai: duyệt inorder và kiểm tra dãy tăng **nghiêm ngặt**.',
      ],
      diagnostics: [
        { test: 'root\\.left\\.val\\s*<\\s*root\\.val[\\s\\S]{0,80}root\\.right\\.val\\s*>\\s*root\\.val', message: 'Đây chính là lỗi kinh điển: chỉ kiểm tra cha với con trực tiếp. Ràng buộc BST là toàn cục — hãy truyền khoảng (min, max) xuống.' },
      ],
      diagnosticsPy: [
        { test: 'root\\.left\\.val\\s*<\\s*root\\.val[\\s\\S]{0,80}root\\.right\\.val\\s*>\\s*root\\.val', message: 'Đây chính là lỗi kinh điển: chỉ kiểm tra cha với con trực tiếp. Ràng buộc BST là toàn cục — hãy truyền khoảng (lo, hi) xuống.' },
      ],
      approach: `
**Hai lời giải chuẩn — nên biết cả hai.**

**Cách 1 — Truyền khoảng hợp lệ (preorder, thông tin đi từ trên xuống):**
\`\`\`js
function valid(node, lo, hi) {
  if (!node) return true;
  if (node.val <= lo || node.val >= hi) return false;
  return valid(node.left, lo, node.val) && valid(node.right, node.val, hi);
}
return valid(root, -Infinity, Infinity);
\`\`\`
Trực giác: mỗi nút "thu hẹp" khoảng cho các con. Nút bên trái của 5 và bên phải của 3
phải nằm trong (3, 5) — chính xác điều mà test bẫy kiểm tra.

**Cách 2 — Inorder phải tăng dần:**
\`\`\`js
let prev = -Infinity, ok = true;
function inorder(n) {
  if (!n || !ok) return;
  inorder(n.left);
  if (n.val <= prev) ok = false;
  prev = n.val;
  inorder(n.right);
}
\`\`\`
Cách này khai thác tính chất "inorder của BST là dãy tăng". Ngắn hơn nhưng cần biến trạng thái ngoài.

**Chú ý dấu bằng:** BST chuẩn không cho phép giá trị trùng → dùng \`<=\` và \`>=\` khi báo lỗi.
Nếu đề cho phép trùng, hãy hỏi lại người phỏng vấn — đó là câu hỏi làm rõ đáng giá.
`,
      solution: `function isValidBST(root) {
  const valid = (node, lo, hi) => {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return valid(node.left, lo, node.val) && valid(node.right, node.val, hi);
  };
  return valid(root, -Infinity, Infinity);
}`,
      solutionPy: `def isValidBST(root):
    def valid(node, lo, hi):
        if not node:
            return True
        if not (lo < node.val < hi):
            return False
        return valid(node.left, lo, node.val) and valid(node.right, node.val, hi)
    return valid(root, float('-inf'), float('inf'))`,
      complexity: {
        question: 'Vì sao không thể kiểm tra BST chỉ bằng cách so mỗi nút với hai con trực tiếp?',
        options: [
          'Vì như vậy quá chậm',
          'Vì ràng buộc BST là toàn cục: một nút ở sâu vẫn phải nằm trong khoảng do mọi tổ tiên quy định',
          'Vì cây có thể không cân bằng',
          'Vì giá trị có thể âm',
        ],
        answer: 1,
        why: 'Đây là bài học tư duy chính: phân biệt ràng buộc CỤC BỘ và TOÀN CỤC. Nhiều bài cây khó chỉ khó vì bạn phải mang theo ngữ cảnh từ tổ tiên xuống.',
      },
      realWorld: 'Kiểm tra tính nhất quán của cấu trúc chỉ mục sau khi sửa đổi (database integrity check), hoặc kiểm tra một cây phân loại có giữ đúng thứ tự ngưỡng hay không.',
    },
    {
      id: 'lca-bst',
      title: 'Tổ tiên chung gần nhất trong BST',
      en: 'Lowest Common Ancestor of a BST',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'lowestCommonAncestor',
      statement: `
Cho một **BST** và hai nút \`p\`, \`q\` (đảm bảo đều tồn tại trong cây), tìm **tổ tiên chung gần nhất**
— nút sâu nhất có cả p và q làm con cháu (một nút có thể là tổ tiên của chính nó).

Hệ thống chấm nhận \`(mảng_cây, giá_trị_p, giá_trị_q)\` và so sánh **giá trị** của nút bạn trả về.

**Ví dụ**
- cây \`[6,2,8,0,4,7,9,null,null,3,5]\`, p = 2, q = 8 → \`6\`
- cùng cây, p = 2, q = 4 → \`2\` (nút 2 là tổ tiên của chính nó)
`,
      starter: `function lowestCommonAncestor(root, p, q) {\n  // p và q là các đối tượng TreeNode\n  \n}`,
      starterPy: `def lowestCommonAncestor(root, p, q):\n    # p va q la cac doi tuong TreeNode\n    \n`,
      harnessSrc: `(fn, args) => {
        const [arr, pv, qv] = args;
        const root = buildTree(arr);
        const find = (n, v) => !n ? null : (n.val === v ? n : (find(n.left, v) || find(n.right, v)));
        const res = fn(root, find(root, pv), find(root, qv));
        return res ? res.val : null;
      }`,
      harnessSrcPy: `def harness(fn, args, t):
    arr, pv, qv = args
    root = buildTree(arr)
    def find(n, v):
        if not n:
            return None
        if n.val == v:
            return n
        return find(n.left, v) or find(n.right, v)
    res = fn(root, find(root, pv), find(root, qv))
    return res.val if res else None`,
      tests: [
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expected: 6, name: 'Hai nhánh khác nhau' },
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expected: 2, name: 'Tổ tiên của chính nó' },
        { args: [[2, 1], 2, 1], expected: 2, name: 'Cây hai nút' },
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 5], expected: 4, name: 'Cả hai ở sâu' },
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 7, 9], expected: 8, name: 'Nhánh phải' },
        { args: [[5, 3, 8, 1, 4, 7, 9], 1, 4], expected: 3, name: 'Nhánh trái' },
      ],
      hints: [
        'Đừng duyệt cả cây! Hãy khai thác tính chất BST: chỉ cần so sánh giá trị để biết nên đi trái hay phải.',
        'Nếu **cả p và q đều nhỏ hơn** nút hiện tại → cả hai nằm bên trái → đi trái. Nếu cả hai đều lớn hơn → đi phải.',
        'Ngược lại (một bên nhỏ hơn, một bên lớn hơn, hoặc một trong hai bằng nút hiện tại) → **nút hiện tại chính là LCA**. Đây là điểm "rẽ nhánh" (split point) và nó là nút đầu tiên gặp được khi đi từ gốc xuống.',
      ],
      hintsPy: [
        'Đừng duyệt cả cây! Hãy khai thác tính chất BST: chỉ cần so sánh giá trị để biết nên đi trái hay phải.',
        'Nếu **cả p và q đều nhỏ hơn** nút hiện tại → cả hai nằm bên trái → đi trái. Nếu cả hai đều lớn hơn → đi phải.',
        'Ngược lại (một bên nhỏ hơn, một bên lớn hơn, hoặc một trong hai bằng nút hiện tại) → **nút hiện tại chính là LCA**. Viết bằng vòng `while node:` với 3 nhánh `if/elif/else`.',
      ],
      diagnostics: [
        { test: 'levelOrder|queue|\\bpath\\b|Array\\.isArray', message: 'Bạn có vẻ đang duyệt toàn bộ cây hoặc lưu đường đi. Với BST chỉ cần đi một đường từ gốc xuống — O(h) thời gian, O(1) bộ nhớ.' },
      ],
      diagnosticsPy: [
        { test: 'deque|\\bpath\\b\\s*=\\s*\\[', message: 'Bạn có vẻ đang duyệt toàn bộ cây hoặc lưu đường đi. Với BST chỉ cần đi một đường từ gốc xuống — O(h) thời gian, O(1) bộ nhớ.' },
      ],
      approach: `
**Vì sao BST khiến bài này dễ hơn hẳn cây thường?** Vì giá trị nút cho ta biết **hướng đi**
mà không cần khám phá.

Đi từ gốc xuống, chỉ có ba khả năng:
\`\`\`
p, q đều < node   ->  cả hai ở cây con trái   ->  đi trái
p, q đều > node   ->  cả hai ở cây con phải   ->  đi phải
còn lại           ->  ĐÂY là điểm rẽ nhánh    ->  node chính là LCA
\`\`\`

**Vì sao điểm rẽ nhánh đầu tiên chính là LCA?** Vì mọi tổ tiên phía trên nó đều có cả p và q
nằm cùng một phía (nên chưa "chung"), còn mọi nút phía dưới chỉ chứa một trong hai.

\`\`\`
        6
      /   \\
     2     8        p=2, q=8:  2 < 6 < 8 -> rẽ nhánh ngay tại 6 ✔
    / \\   / \\
   0   4 7   9
\`\`\`

**Với cây nhị phân thường (không phải BST)** thì cần cách khác:
\`\`\`js
function lca(node, p, q) {
  if (!node || node === p || node === q) return node;
  const L = lca(node.left, p, q), R = lca(node.right, p, q);
  return (L && R) ? node : (L || R);   // tìm thấy hai bên -> node là LCA
}
\`\`\`
Đây là O(n). So sánh hai bản giúp bạn thấy rõ: **cấu trúc dữ liệu tốt hơn = thuật toán đơn giản hơn**.
`,
      solution: `function lowestCommonAncestor(root, p, q) {
  let node = root;
  while (node) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node;          // điểm rẽ nhánh đầu tiên = LCA
  }
  return null;
}`,
      solutionPy: `def lowestCommonAncestor(root, p, q):
    node = root
    while node:
        if p.val < node.val and q.val < node.val:
            node = node.left
        elif p.val > node.val and q.val > node.val:
            node = node.right
        else:
            return node
    return None`,
      complexity: {
        question: 'Độ phức tạp cho BST cân bằng có n nút?',
        options: ['O(n) / O(n)', 'O(log n) / O(1)', 'O(n log n) / O(1)', 'O(1) / O(1)'],
        answer: 1,
        why: 'Ta chỉ đi một đường từ gốc xuống → O(h), với cây cân bằng h = log n. Bản lặp không dùng ngăn xếp nên O(1) bộ nhớ.',
      },
      realWorld: 'Tìm thư mục cha chung của hai file; tìm nút quản lý chung gần nhất của hai nhân viên trong sơ đồ tổ chức; trong Git là tìm merge base giữa hai nhánh (cùng ý tưởng LCA trên đồ thị commit).',
    },
  ],
},

/* ==================================================================== */
{
  id: 'tries',
  name: 'Cây tiền tố (Trie)',
  en: 'Tries',
  icon: '🔤',
  days: [16],
  summary: 'Chia sẻ tiền tố chung để tra cứu chuỗi trong O(độ dài từ), không phụ thuộc số lượng từ.',
  lesson: `
## 1. Vấn đề gốc

Bạn có 1 triệu từ và cần trả lời: *"có từ nào bắt đầu bằng 'prog' không?"*
- Bảng băm: tra chính xác một từ thì O(1), nhưng **không** trả lời được câu hỏi tiền tố
  (bạn phải quét hết 1 triệu từ).
- Mảng đã sắp + binary search: O(log n · độ dài) — được, nhưng thêm từ mới thì tốn kém.

**Trie** giải quyết triệt để: mọi thao tác chỉ phụ thuộc vào **độ dài từ**, không phụ thuộc số lượng từ.

## 2. Ý tưởng cốt lõi

> Trie = cây mà **mỗi cạnh là một ký tự**, và **đường đi từ gốc tới một nút chính là một tiền tố**.
> Các từ có chung tiền tố thì dùng chung phần đầu của đường đi.

\`\`\`
        (root)
        /    \\
       c      d
       |      |
       a      o
      / \\     |
     t   r    g
    (*)  (*)  (*)      (*) = kết thúc một từ hợp lệ
   cat  car  dog
\`\`\`

Cấu trúc một nút cực kỳ đơn giản:
\`\`\`js
class TrieNode {
  constructor() {
    this.children = new Map();   // ký tự -> TrieNode
    this.isEnd = false;          // đường đi tới đây có tạo thành một từ hoàn chỉnh?
  }
}
\`\`\`

**Cờ \`isEnd\` là bắt buộc**: nếu không có nó, ta không phân biệt được "app" là từ thật
hay chỉ là tiền tố của "apple".

## 3. Ba thao tác — cùng một khung

\`\`\`js
insert(word)  // đi theo ký tự, thiếu nút thì tạo, cuối cùng đánh dấu isEnd = true
search(word)  // đi theo ký tự, thiếu -> false, cuối cùng kiểm tra isEnd
startsWith(p) // giống search nhưng KHÔNG cần kiểm tra isEnd
\`\`\`

Cả ba đều là O(L) với L là độ dài từ — **không phụ thuộc vào số từ đã lưu**. Đó là điều kỳ diệu.

## 4. Khi nào dùng Trie?

| Dấu hiệu | Vì sao Trie thắng |
|---|---|
| "tự động hoàn thành", "gợi ý tìm kiếm" | duyệt cây con tại nút tiền tố |
| "tiền tố chung dài nhất" | đi xuống tới khi phân nhánh |
| "tìm nhiều mẫu trong một văn bản" | Aho-Corasick (Trie + KMP) |
| "tìm từ trong bảng chữ cái với ký tự đại diện" | DFS trên trie, gặp '.' thì thử mọi nhánh |
| "định tuyến IP theo tiền tố dài nhất" | trie nhị phân trên bit |

**Đánh đổi**: trie tốn bộ nhớ hơn hash set (mỗi nút một map con). Với 26 chữ cái, dùng mảng 26 phần tử
nhanh hơn Map nhưng tốn bộ nhớ hơn nếu cây thưa.

## 5. Ứng dụng thực tế

- **Gợi ý tìm kiếm** của Google/IDE (autocomplete) — ứng dụng kinh điển nhất.
- **Bảng định tuyến IP**: router tra "tiền tố dài nhất khớp" bằng trie nhị phân, hàng triệu gói/giây.
- **Bộ lọc từ cấm / kiểm duyệt nội dung**: Aho-Corasick quét mọi từ cấm trong một lượt.
- **Kiểm tra chính tả và sửa lỗi gõ**: trie + khoảng cách Levenshtein.
- **Nén từ điển** trong bàn phím điện thoại (T9, dự đoán từ).
`,
  lessonPy: `
## 1. Vấn đề gốc

Bạn có 1 triệu từ và cần trả lời: *"có từ nào bắt đầu bằng 'prog' không?"*
- \`set\`/\`dict\`: tra chính xác một từ thì O(1), nhưng **không** trả lời được câu hỏi tiền tố
  (bạn phải quét hết 1 triệu từ).
- List đã sắp + binary search (\`bisect\`): O(log n · độ dài) — được, nhưng thêm từ mới thì tốn kém.

**Trie** giải quyết triệt để: mọi thao tác chỉ phụ thuộc vào **độ dài từ**, không phụ thuộc số lượng từ.

## 2. Ý tưởng cốt lõi

> Trie = cây mà **mỗi cạnh là một ký tự**, và **đường đi từ gốc tới một nút chính là một tiền tố**.
> Các từ có chung tiền tố thì dùng chung phần đầu của đường đi.

\`\`\`
        (root)
        /    \\
       c      d
       |      |
       a      o
      / \\     |
     t   r    g
    (*)  (*)  (*)      (*) = kết thúc một từ hợp lệ
   cat  car  dog
\`\`\`

Cấu trúc một nút cực kỳ đơn giản:
\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}     # ký tự -> TrieNode
        self.is_end = False    # đường đi tới đây có tạo thành một từ hoàn chỉnh?
\`\`\`

**Cờ \`is_end\` là bắt buộc**: nếu không có nó, ta không phân biệt được "app" là từ thật
hay chỉ là tiền tố của "apple".

## 3. Ba thao tác — cùng một khung

\`\`\`python
insert(word)   # đi theo ký tự, thiếu nút thì tạo (dict.setdefault tiện cho việc này), cuối cùng đánh dấu is_end = True
search(word)   # đi theo ký tự, thiếu -> False, cuối cùng kiểm tra is_end
startsWith(p)  # giống search nhưng KHÔNG cần kiểm tra is_end
\`\`\`

Cả ba đều là O(L) với L là độ dài từ — **không phụ thuộc vào số từ đã lưu**. Đó là điều kỳ diệu.

## 4. Khi nào dùng Trie?

| Dấu hiệu | Vì sao Trie thắng |
|---|---|
| "tự động hoàn thành", "gợi ý tìm kiếm" | duyệt cây con tại nút tiền tố |
| "tiền tố chung dài nhất" | đi xuống tới khi phân nhánh |
| "tìm nhiều mẫu trong một văn bản" | Aho-Corasick (Trie + KMP) |
| "tìm từ trong bảng chữ cái với ký tự đại diện" | DFS trên trie, gặp '.' thì thử mọi nhánh |
| "định tuyến IP theo tiền tố dài nhất" | trie nhị phân trên bit |

**Đánh đổi**: trie tốn bộ nhớ hơn hash set (mỗi nút một dict con). Với 26 chữ cái, dùng list 26 phần tử
nhanh hơn dict một chút nhưng tốn bộ nhớ hơn nếu cây thưa.

## 5. Ứng dụng thực tế

- **Gợi ý tìm kiếm** của Google/IDE (autocomplete) — ứng dụng kinh điển nhất.
- **Bảng định tuyến IP**: router tra "tiền tố dài nhất khớp" bằng trie nhị phân, hàng triệu gói/giây.
- **Bộ lọc từ cấm / kiểm duyệt nội dung**: Aho-Corasick quét mọi từ cấm trong một lượt.
- **Kiểm tra chính tả và sửa lỗi gõ**: trie + khoảng cách Levenshtein.
- **Nén từ điển** trong bàn phím điện thoại (T9, dự đoán từ).
`,
  quiz: [
    {
      q: 'Ưu thế quyết định của Trie so với HashSet khi lưu từ điển là gì?',
      options: [
        'Trie luôn tốn ít bộ nhớ hơn',
        'Trie trả lời được truy vấn theo TIỀN TỐ trong O(độ dài tiền tố), việc HashSet không làm được',
        'Trie tìm kiếm nhanh hơn HashSet',
        'Trie tự động sắp xếp các từ',
      ],
      answer: 1,
      why: 'HashSet băm cả từ nên không giữ quan hệ tiền tố. Trie đánh đổi bộ nhớ để có được cấu trúc tiền tố — đó là lý do duy nhất và chính đáng để dùng nó.',
    },
    {
      q: 'Vì sao mỗi nút trie cần cờ isEnd?',
      options: [
        'Để đếm số từ trong trie',
        'Để phân biệt "app" là một từ hoàn chỉnh hay chỉ là tiền tố của "apple"',
        'Để biết nút đó có bao nhiêu con',
        'Để tối ưu bộ nhớ',
      ],
      answer: 1,
      why: 'Không có isEnd, search("app") sẽ trả về true chỉ vì đường đi tồn tại (do "apple"). Cờ này chính là ranh giới giữa `search` và `startsWith`.',
    },
    {
      q: 'Độ phức tạp của insert/search trong Trie với từ dài L và từ điển có n từ?',
      options: ['O(n)', 'O(L)', 'O(n · L)', 'O(log n)'],
      answer: 1,
      why: 'Ta chỉ đi qua L nút, mỗi bước tra một map con O(1). Số từ n KHÔNG ảnh hưởng — đây là tính chất khiến trie phù hợp cho từ điển khổng lồ.',
    },
    {
      q: 'Với truy vấn có ký tự đại diện "." (khớp mọi ký tự), thuật toán tìm kiếm trên trie trở thành gì?',
      options: [
        'Vẫn đi thẳng một đường như bình thường',
        'DFS/backtracking: khi gặp "." phải thử tất cả các nhánh con',
        'Binary search trên các con',
        'Không thể làm được',
      ],
      answer: 1,
      why: 'Ký tự đại diện biến việc "đi một đường" thành "khám phá nhiều nhánh" → cần đệ quy quay lui. Đây là cầu nối tự nhiên sang chủ đề Backtracking.',
    },
  ],
  quizPy: [
    {
      q: 'Ưu thế quyết định của Trie so với set khi lưu từ điển là gì?',
      options: [
        'Trie luôn tốn ít bộ nhớ hơn',
        'Trie trả lời được truy vấn theo TIỀN TỐ trong O(độ dài tiền tố), việc set/dict không làm được',
        'Trie tìm kiếm nhanh hơn set',
        'Trie tự động sắp xếp các từ',
      ],
      answer: 1,
      why: 'set/dict băm cả từ nên không giữ quan hệ tiền tố. Trie đánh đổi bộ nhớ để có được cấu trúc tiền tố — đó là lý do duy nhất và chính đáng để dùng nó.',
    },
    {
      q: 'Vì sao mỗi nút trie cần cờ is_end?',
      options: [
        'Để đếm số từ trong trie',
        'Để phân biệt "app" là một từ hoàn chỉnh hay chỉ là tiền tố của "apple"',
        'Để biết nút đó có bao nhiêu con',
        'Để tối ưu bộ nhớ',
      ],
      answer: 1,
      why: 'Không có is_end, search("app") sẽ trả về True chỉ vì đường đi tồn tại (do "apple"). Cờ này chính là ranh giới giữa `search` và `startsWith`.',
    },
    {
      q: 'Độ phức tạp của insert/search trong Trie với từ dài L và từ điển có n từ?',
      options: ['O(n)', 'O(L)', 'O(n · L)', 'O(log n)'],
      answer: 1,
      why: 'Ta chỉ đi qua L nút, mỗi bước tra một dict con O(1). Số từ n KHÔNG ảnh hưởng — đây là tính chất khiến trie phù hợp cho từ điển khổng lồ.',
    },
    {
      q: 'Với truy vấn có ký tự đại diện "." (khớp mọi ký tự), thuật toán tìm kiếm trên trie trở thành gì?',
      options: [
        'Vẫn đi thẳng một đường như bình thường',
        'DFS/backtracking: khi gặp "." phải thử tất cả các nhánh con',
        'Binary search trên các con',
        'Không thể làm được',
      ],
      answer: 1,
      why: 'Ký tự đại diện biến việc "đi một đường" thành "khám phá nhiều nhánh" → cần đệ quy quay lui. Đây là cầu nối tự nhiên sang chủ đề Backtracking.',
    },
  ],
  problems: [
    {
      id: 'implement-trie',
      title: 'Cài đặt Trie (cây tiền tố)',
      en: 'Implement Trie',
      difficulty: 'Medium',
      targetMinutes: 20,
      entry: 'Trie',
      statement: `
Cài đặt lớp \`Trie\` với ba phương thức:

- \`insert(word)\` — thêm từ vào trie
- \`search(word)\` — trả về \`true\` nếu **từ** đã được thêm
- \`startsWith(prefix)\` — trả về \`true\` nếu có từ nào **bắt đầu bằng** prefix

**Ví dụ**
\`\`\`
insert("apple");
search("apple");     // true
search("app");       // false  <- "app" chưa từng được thêm
startsWith("app");   // true
insert("app");
search("app");       // true
\`\`\`
`,
      starter: `class Trie {\n  constructor() {\n    \n  }\n\n  insert(word) {\n    \n  }\n\n  search(word) {\n    \n  }\n\n  startsWith(prefix) {\n    \n  }\n}`,
      starterPy: `class Trie:\n    def __init__(self):\n        pass\n\n    def insert(self, word):\n        pass\n\n    def search(self, word):\n        pass\n\n    def startsWith(self, prefix):\n        pass\n`,
      harnessSrc: `(Cls, args) => {
        const [ops, vals] = args;
        const out = [];
        let obj = null;
        for (let i = 0; i < ops.length; i++) {
          if (ops[i] === 'Trie') { obj = new Cls(); out.push(null); }
          else {
            const r = obj[ops[i]].apply(obj, vals[i] || []);
            out.push(r === undefined ? null : r);
          }
        }
        return out;
      }`,
      harnessSrcPy: `def harness(Cls, args, t):
    ops, vals = args
    out = []
    obj = None
    for i in range(len(ops)):
        if ops[i] == 'Trie':
            obj = Cls()
            out.append(None)
        else:
            v = vals[i] if vals[i] else []
            r = getattr(obj, ops[i])(*v)
            out.append(None if r is None else r)
    return out`,
      tests: [
        {
          args: [['Trie', 'insert', 'search', 'search', 'startsWith', 'insert', 'search'],
            [[], ['apple'], ['apple'], ['app'], ['app'], ['app'], ['app']]],
          expected: [null, null, true, false, true, null, true],
          name: 'Ví dụ chuẩn',
        },
        {
          args: [['Trie', 'search', 'startsWith'], [[], ['a'], ['a']]],
          expected: [null, false, false],
          name: 'Trie rỗng',
        },
        {
          args: [['Trie', 'insert', 'insert', 'search', 'search', 'startsWith', 'startsWith'],
            [[], ['cat'], ['car'], ['cat'], ['ca'], ['ca'], ['cart']]],
          expected: [null, null, null, true, false, true, false],
          name: 'Chung tiền tố' ,
        },
        {
          args: [['Trie', 'insert', 'search', 'startsWith'], [[], [''], [''], ['']]],
          expected: [null, null, true, true],
          name: 'Chuỗi rỗng',
        },
      ],
      hints: [
        'Mỗi nút cần đúng hai thứ: một `Map` (hoặc object) ánh xạ ký_tự → nút_con, và một cờ boolean `isEnd`.',
        'Cả ba phương thức đều có chung một khung: đi từ gốc, với mỗi ký tự thì bước xuống nút con tương ứng. Khác biệt duy nhất nằm ở việc thiếu nút thì làm gì (insert: tạo mới; search/startsWith: trả về false).',
        'Viết một hàm phụ `_walk(str)` trả về nút cuối cùng hoặc `null`. Khi đó: `search = node !== null && node.isEnd`, còn `startsWith = node !== null`. Rất gọn và ít lỗi.',
      ],
      hintsPy: [
        'Mỗi nút cần đúng hai thứ: một `dict` ánh xạ ký_tự → nút_con, và một cờ boolean `is_end`.',
        'Cả ba phương thức đều có chung một khung: đi từ gốc, với mỗi ký tự thì bước xuống nút con tương ứng. Khác biệt duy nhất nằm ở việc thiếu nút thì làm gì (insert: tạo mới — `node.children.setdefault(ch, TrieNode())`; search/startsWith: trả về False).',
        'Viết một hàm phụ `_walk(s)` trả về nút cuối cùng hoặc `None`. Khi đó: `search = node is not None and node.is_end`, còn `startsWith = node is not None`. Rất gọn và ít lỗi.',
      ],
      diagnostics: [
        { test: 'this\\.words\\s*=\\s*\\[|\\.push\\(word\\)|new Set\\(\\)', message: 'Lưu tất cả từ vào mảng/Set rồi quét khi kiểm tra prefix sẽ là O(n·L) mỗi truy vấn — đó chính là vấn đề mà Trie sinh ra để giải quyết. Hãy dựng cấu trúc cây thật.' },
        { test: 'startsWith\\s*\\([^)]*\\)\\s*\\{[\\s\\S]{0,200}isEnd', message: '`startsWith` KHÔNG được kiểm tra `isEnd` — chỉ cần đường đi tồn tại là đủ.' },
      ],
      diagnosticsPy: [
        { test: 'self\\.words\\s*=\\s*\\[|\\.append\\(word\\)|=\\s*set\\s*\\(\\)', message: 'Lưu tất cả từ vào list/set rồi quét khi kiểm tra prefix sẽ là O(n·L) mỗi truy vấn — đó chính là vấn đề mà Trie sinh ra để giải quyết. Hãy dựng cấu trúc cây thật.' },
        { test: 'def\\s+startsWith[\\s\\S]{0,200}is_end', message: '`startsWith` KHÔNG được kiểm tra `is_end` — chỉ cần đường đi tồn tại là đủ.' },
      ],
      approach: `
**Điểm mấu chốt: cả ba phương thức chỉ khác nhau ở phần kết.**

\`\`\`
insert:      đi, thiếu thì TẠO,        cuối cùng đánh dấu isEnd = true
search:      đi, thiếu thì FALSE,      cuối cùng trả về node.isEnd
startsWith:  đi, thiếu thì FALSE,      cuối cùng trả về true
\`\`\`

Nhận ra sự đối xứng này giúp bạn viết code ngắn và không lẫn lộn.

**Chọn cấu trúc con:** \`Map\` linh hoạt (mọi bảng chữ cái, tiết kiệm khi thưa);
mảng 26 phần tử nhanh hơn một chút nhưng lãng phí bộ nhớ. Trong phỏng vấn, nói ra được đánh đổi này
quan trọng hơn việc chọn cái nào.

**Mở rộng đáng suy nghĩ:**
- Muốn hỗ trợ \`delete\`? Cần đếm số từ đi qua mỗi nút để biết khi nào xoá nhánh được.
- Muốn liệt kê **mọi từ có tiền tố p** (autocomplete)? Đi tới nút p rồi DFS toàn bộ cây con.
- Bộ nhớ lớn quá? Dùng **radix tree** (nén các chuỗi nút chỉ có một con thành một cạnh).
`,
      solution: `class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  _walk(str) {                      // dùng chung cho search & startsWith
    let node = this.root;
    for (const ch of str) {
      if (!node.children.has(ch)) return null;
      node = node.children.get(ch);
    }
    return node;
  }

  search(word) {
    const node = this._walk(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix) {
    return this._walk(prefix) !== null;
  }
}`,
      solutionPy: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end = True

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end

    def startsWith(self, prefix):
        return self._walk(prefix) is not None`,
      complexity: {
        question: 'Bộ nhớ xấu nhất của trie chứa n từ, mỗi từ dài tối đa L?',
        options: ['O(n)', 'O(L)', 'O(n · L)', 'O(n log L)'],
        answer: 2,
        why: 'Trường hợp xấu nhất (không từ nào chung tiền tố) cần n·L nút. Thực tế văn bản tự nhiên chia sẻ rất nhiều tiền tố nên tiết kiệm hơn nhiều — đó cũng là lý do trie hữu ích với từ điển thật.',
      },
      realWorld: 'Ô tìm kiếm gợi ý của Google, autocomplete trong IDE, và bảng định tuyến của router (longest prefix match trên trie nhị phân) — tất cả đều là cấu trúc này.',
    },
    {
      id: 'word-dictionary',
      title: 'Từ điển hỗ trợ ký tự đại diện',
      en: 'Design Add and Search Words',
      difficulty: 'Medium',
      targetMinutes: 25,
      entry: 'WordDictionary',
      statement: `
Thiết kế cấu trúc dữ liệu hỗ trợ:

- \`addWord(word)\` — thêm từ
- \`search(word)\` — trả về true nếu có từ nào **khớp**. Từ tìm kiếm có thể chứa ký tự \`.\`,
  khớp với **bất kỳ ký tự nào**.

**Ví dụ**
\`\`\`
addWord("bad"); addWord("dad"); addWord("mad");
search("pad");  // false
search("bad");  // true
search(".ad");  // true
search("b..");  // true
\`\`\`
`,
      starter: `class WordDictionary {\n  constructor() {\n    \n  }\n\n  addWord(word) {\n    \n  }\n\n  search(word) {\n    \n  }\n}`,
      starterPy: `class WordDictionary:\n    def __init__(self):\n        pass\n\n    def addWord(self, word):\n        pass\n\n    def search(self, word):\n        pass\n`,
      harnessSrc: `(Cls, args) => {
        const [ops, vals] = args;
        const out = [];
        let obj = null;
        for (let i = 0; i < ops.length; i++) {
          if (ops[i] === 'WordDictionary') { obj = new Cls(); out.push(null); }
          else {
            const r = obj[ops[i]].apply(obj, vals[i] || []);
            out.push(r === undefined ? null : r);
          }
        }
        return out;
      }`,
      harnessSrcPy: `def harness(Cls, args, t):
    ops, vals = args
    out = []
    obj = None
    for i in range(len(ops)):
        if ops[i] == 'WordDictionary':
            obj = Cls()
            out.append(None)
        else:
            v = vals[i] if vals[i] else []
            r = getattr(obj, ops[i])(*v)
            out.append(None if r is None else r)
    return out`,
      tests: [
        {
          args: [['WordDictionary', 'addWord', 'addWord', 'addWord', 'search', 'search', 'search', 'search'],
            [[], ['bad'], ['dad'], ['mad'], ['pad'], ['bad'], ['.ad'], ['b..']]],
          expected: [null, null, null, null, false, true, true, true],
          name: 'Ví dụ chuẩn',
        },
        {
          args: [['WordDictionary', 'addWord', 'search', 'search'], [[], ['a'], ['.'], ['..']]],
          expected: [null, null, true, false],
          name: 'Độ dài phải khớp',
        },
        {
          args: [['WordDictionary', 'addWord', 'addWord', 'search', 'search'],
            [[], ['at'], ['and'], ['a.'], ['a..']]],
          expected: [null, null, null, true, true],
          name: 'Nhiều độ dài khác nhau',
        },
        {
          args: [['WordDictionary', 'search'], [[], ['.']]],
          expected: [null, false],
          name: 'Từ điển rỗng',
        },
      ],
      hints: [
        'Bắt đầu từ Trie thông thường cho `addWord`. Toàn bộ độ khó nằm ở `search` khi gặp ký tự `.`.',
        'Khi gặp ký tự bình thường: đi xuống đúng một nhánh. Khi gặp `.`: phải **thử tất cả các nhánh con** — đó chính là quay lui (backtracking) bằng đệ quy.',
        'Viết hàm đệ quy `dfs(node, i)`: nếu `i === word.length` thì trả về `node.isEnd`. Nếu `word[i] === "."` thì lặp qua mọi con và trả về true nếu **bất kỳ** nhánh nào thành công. Ngược lại chỉ đi vào nhánh `word[i]`.',
      ],
      hintsPy: [
        'Bắt đầu từ Trie thông thường cho `addWord`. Toàn bộ độ khó nằm ở `search` khi gặp ký tự `.`.',
        'Khi gặp ký tự bình thường: đi xuống đúng một nhánh. Khi gặp `.`: phải **thử tất cả các nhánh con** — đó chính là quay lui (backtracking) bằng đệ quy.',
        'Viết hàm đệ quy `dfs(node, i)`: nếu `i == len(word)` thì trả về `node.is_end`. Nếu `word[i] == "."` thì dùng `any(dfs(child, i+1) for child in node.children.values())` — gọn hơn viết vòng for tường minh. Ngược lại chỉ đi vào nhánh `word[i]` nếu tồn tại.',
      ],
      diagnostics: [
        { test: 'RegExp|new RegExp|\\.match\\s*\\(', message: 'Dùng regex quét mọi từ đã lưu là O(n · L) mỗi truy vấn. Trie + DFS chỉ khám phá các nhánh thực sự tồn tại — nhanh hơn nhiều khi từ điển lớn.' },
        { test: 'for\\s*\\(\\s*const\\s+w\\s+of\\s+this\\.words', message: 'Duyệt toàn bộ danh sách từ là cách "brute force". Hãy dựng trie để tận dụng tiền tố chung.' },
      ],
      diagnosticsPy: [
        { test: 'import re|\\.match\\s*\\(|fullmatch', message: 'Dùng regex quét mọi từ đã lưu là O(n · L) mỗi truy vấn. Trie + DFS chỉ khám phá các nhánh thực sự tồn tại — nhanh hơn nhiều khi từ điển lớn.' },
        { test: 'for\\s+\\w+\\s+in\\s+self\\.words', message: 'Duyệt toàn bộ danh sách từ là cách "brute force". Hãy dựng trie để tận dụng tiền tố chung.' },
      ],
      approach: `
Đây là bài **bản lề** giữa Trie và Backtracking — hãy làm kỹ.

**Cấu trúc dữ liệu:** y hệt Trie thường.

**Tìm kiếm với ký tự đại diện:** biến việc "đi một đường thẳng" thành "khám phá cây".
\`\`\`js
function dfs(node, i) {
  if (i === word.length) return node.isEnd;

  const c = word[i];
  if (c === '.') {
    for (const child of node.children.values())
      if (dfs(child, i + 1)) return true;    // thử mọi nhánh, chỉ cần MỘT nhánh đúng
    return false;
  }
  const next = node.children.get(c);
  return next ? dfs(next, i + 1) : false;
}
\`\`\`

**Vì sao vẫn nhanh trong thực tế?** Vì trie chỉ chứa các nhánh **thực sự tồn tại**.
Với \`".ad"\`, ta chỉ thử các chữ cái đầu có thật (b, d, m) chứ không phải cả 26 chữ.
So với việc quét toàn bộ danh sách từ, ta cắt tỉa được rất nhiều.

**Độ phức tạp:** trường hợp xấu nhất (toàn dấu chấm) là O(26^L) về lý thuyết,
nhưng thực tế bị chặn bởi số nút của trie → O(số nút). Nói được cả hai con số này là rất ăn điểm.

**Đây chính là backtracking:** thử một nhánh → nếu thất bại thì quay lại thử nhánh khác.
Bạn sẽ gặp lại khung tư duy này ở chủ đề Backtracking và Graphs.
`,
      solution: `class WDNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class WordDictionary {
  constructor() {
    this.root = new WDNode();
  }

  addWord(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new WDNode());
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  search(word) {
    const dfs = (node, i) => {
      if (i === word.length) return node.isEnd;
      const c = word[i];
      if (c === '.') {
        for (const child of node.children.values()) {
          if (dfs(child, i + 1)) return true;    // quay lui: thử mọi nhánh
        }
        return false;
      }
      const next = node.children.get(c);
      return next ? dfs(next, i + 1) : false;
    };
    return dfs(this.root, 0);
  }
}`,
      solutionPy: `class WDNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class WordDictionary:
    def __init__(self):
        self.root = WDNode()

    def addWord(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, WDNode())
        node.is_end = True

    def search(self, word):
        def dfs(node, i):
            if i == len(word):
                return node.is_end
            c = word[i]
            if c == '.':
                return any(dfs(child, i + 1) for child in node.children.values())
            return dfs(node.children[c], i + 1) if c in node.children else False
        return dfs(self.root, 0)`,
      complexity: {
        question: 'Khi truy vấn toàn dấu chấm ("....") độ phức tạp xấu nhất là gì?',
        options: [
          'O(L) như trie thường',
          'O(26^L) về lý thuyết, nhưng bị chặn bởi số nút thực có trong trie',
          'O(n) với n là số từ',
          'O(1)',
        ],
        answer: 1,
        why: 'Mỗi dấu chấm nhân số nhánh phải thử lên tới 26 lần. Nhưng ta chỉ đi vào nhánh CÓ THẬT, nên chi phí thực tế bị chặn bởi kích thước trie — một ví dụ điển hình về khác biệt giữa cận lý thuyết và hiệu năng thực tế.',
      },
      realWorld: 'Tìm kiếm mờ trong từ điển: gợi ý sửa lỗi chính tả, giải ô chữ, khớp mẫu tên miền có wildcard (*.example.com), và bộ lọc chuỗi ký tự trong công cụ phân tích log.',
    },
  ],
},

/* ==================================================================== */
{
  id: 'heap',
  name: 'Heap / Hàng đợi ưu tiên',
  en: 'Heap / Priority Queue',
  icon: '⛰️',
  days: [17],
  summary: 'Khi chỉ cần phần tử "tốt nhất" chứ không cần sắp xếp toàn bộ — heap cho O(log n) mỗi thao tác.',
  lesson: `
## 1. Vấn đề gốc

Bạn cần **liên tục** lấy ra phần tử nhỏ nhất (hoặc lớn nhất) trong một tập **đang thay đổi**.

- Mảng chưa sắp: tìm min O(n) mỗi lần → quá chậm.
- Mảng đã sắp: tìm min O(1) nhưng chèn phần tử mới O(n).
- **Heap: chèn O(log n), lấy min O(log n), xem min O(1).**

Điểm mấu chốt: sắp xếp toàn bộ là **làm dư việc**. Nếu chỉ cần biết ai đứng đầu, ta không cần
biết thứ tự của những người còn lại.

## 2. Ý tưởng cốt lõi

> Heap là cây nhị phân **gần đầy đủ** thoả tính chất: **mỗi nút ≤ các con của nó** (min-heap).
> Đây là thứ tự **một phần** (partial order), yếu hơn sắp xếp nhưng đủ để biết ai nhỏ nhất — và
> chính vì yếu hơn nên duy trì rẻ hơn.

Heap được lưu trong **mảng phẳng**, không cần con trỏ:
\`\`\`
cha của i      = (i - 1) >> 1
con trái của i = 2i + 1
con phải của i = 2i + 2
\`\`\`

Hai thao tác duy nhất cần nhớ:
- **sift-up (bubble up)**: thêm vào cuối mảng rồi đẩy lên tới khi ≥ cha. O(log n).
- **sift-down**: lấy gốc ra, đưa phần tử cuối lên gốc, rồi dìm xuống. O(log n).

## 3. Ba mẫu hình dùng heap

**(a) Top-K với heap kích thước K** — mẹo quan trọng nhất:
> Muốn tìm **K phần tử lớn nhất**, hãy dùng **min-heap** kích thước K (và ngược lại).

Vì sao? Giữ heap đúng K phần tử; mỗi phần tử mới so với **gốc** (phần tử nhỏ nhất trong nhóm K).
Nếu lớn hơn thì thay thế. Chi phí O(n log k) và bộ nhớ chỉ O(k) — quan trọng khi n là luồng vô hạn.

**(b) Trộn k danh sách đã sắp**: đẩy phần tử đầu của mỗi danh sách vào heap, liên tục lấy nhỏ nhất.
O(N log k).

**(c) Mô phỏng theo sự kiện / lập lịch**: heap theo thời gian, luôn xử lý sự kiện sớm nhất trước.
Đây chính là cách Dijkstra và mọi bộ lập lịch hoạt động.

## 4. Bảng so sánh — chọn đúng công cụ

| Nhu cầu | Công cụ | Chi phí |
|---|---|---|
| Sắp xếp toàn bộ một lần | sort | O(n log n) |
| Lấy min/max liên tục khi dữ liệu thay đổi | **heap** | O(log n)/thao tác |
| Top-K của luồng dữ liệu lớn | **heap kích thước K** | O(n log k), bộ nhớ O(k) |
| Top-K của mảng cố định | bucket/quickselect | O(n) |
| Cần cả min lẫn max lẫn tìm kiếm | cây cân bằng (TreeMap) | O(log n) |

Lưu ý: JavaScript **không có** priority queue dựng sẵn — trong phỏng vấn JS, bạn có thể phải tự cài
(khoảng 30 dòng) hoặc dùng mảng sắp xếp nếu n nhỏ.

## 5. Ứng dụng thực tế

- **Dijkstra & A\\*** (tìm đường đi ngắn nhất trong bản đồ, game) — heap là trái tim của thuật toán.
- **Bộ lập lịch tiến trình** của hệ điều hành; **timer queue** trong Node.js/nginx.
- **Nén Huffman**: luôn ghép hai cây có tần suất nhỏ nhất.
- **Top-K thời gian thực**: bảng xếp hạng, phát hiện bất thường trong luồng log.
- **Load balancer**: chọn máy chủ đang rảnh nhất.
`,
  lessonPy: `
## 1. Vấn đề gốc

Bạn cần **liên tục** lấy ra phần tử nhỏ nhất (hoặc lớn nhất) trong một tập **đang thay đổi**.

- List chưa sắp: tìm min O(n) mỗi lần → quá chậm.
- List đã sắp: tìm min O(1) nhưng chèn phần tử mới O(n).
- **Heap: chèn O(log n), lấy min O(log n), xem min O(1).**

Điểm mấu chốt: sắp xếp toàn bộ là **làm dư việc**. Nếu chỉ cần biết ai đứng đầu, ta không cần
biết thứ tự của những người còn lại.

## 2. Ý tưởng cốt lõi

> Heap là cây nhị phân **gần đầy đủ** thoả tính chất: **mỗi nút ≤ các con của nó** (min-heap).
> Đây là thứ tự **một phần** (partial order), yếu hơn sắp xếp nhưng đủ để biết ai nhỏ nhất — và
> chính vì yếu hơn nên duy trì rẻ hơn.

**Python có sẵn module \`heapq\`** — cài đặt heap trên một \`list\` bình thường, không cần tự viết
sift-up/sift-down như JS:
\`\`\`python
import heapq
h = []
heapq.heappush(h, 5)
heapq.heappush(h, 2)
smallest = heapq.heappop(h)     # 2
heapq.heapify(existing_list)    # biến 1 list sẵn có thành heap tại chỗ, O(n)
\`\`\`

**Bẫy quan trọng nhất của \`heapq\`: nó chỉ có MIN-heap.** Muốn max-heap, đảo dấu giá trị khi push/pop
(\`heapq.heappush(h, -v)\`, lấy ra thì phủ định lại) — đây là mẹo bắt buộc phải nhớ trong Python.

Cha/con vẫn theo công thức mảng phẳng bên trong \`heapq\`, nhưng bạn hiếm khi cần tự đụng tới:
\`\`\`
cha của i      = (i - 1) // 2
con trái của i = 2i + 1
con phải của i = 2i + 2
\`\`\`

## 3. Ba mẫu hình dùng heap

**(a) Top-K với heap kích thước K** — mẹo quan trọng nhất:
> Muốn tìm **K phần tử lớn nhất**, hãy dùng **min-heap** kích thước K (và ngược lại).

Vì sao? Giữ heap đúng K phần tử; mỗi phần tử mới so với **gốc** (phần tử nhỏ nhất trong nhóm K).
Nếu lớn hơn thì thay thế. Chi phí O(n log k) và bộ nhớ chỉ O(k) — quan trọng khi n là luồng vô hạn.
Python còn có sẵn \`heapq.nlargest(k, iterable)\` / \`heapq.nsmallest(k, iterable)\` cho trường hợp
dữ liệu đã có sẵn trọn vẹn (không phải luồng).

**(b) Trộn k danh sách đã sắp**: \`heapq.merge(*lists)\` làm sẵn việc này! Hoặc tự đẩy phần tử đầu
của mỗi danh sách vào heap, liên tục lấy nhỏ nhất. O(N log k).

**(c) Mô phỏng theo sự kiện / lập lịch**: heap theo thời gian, luôn xử lý sự kiện sớm nhất trước.
Đây chính là cách Dijkstra và mọi bộ lập lịch hoạt động.

## 4. Bảng so sánh — chọn đúng công cụ

| Nhu cầu | Công cụ | Chi phí |
|---|---|---|
| Sắp xếp toàn bộ một lần | \`sorted()\` | O(n log n) |
| Lấy min/max liên tục khi dữ liệu thay đổi | **\`heapq\`** | O(log n)/thao tác |
| Top-K của luồng dữ liệu lớn | **heap kích thước K** | O(n log k), bộ nhớ O(k) |
| Top-K của mảng cố định | \`heapq.nlargest/nsmallest\` hoặc quickselect | O(n log k) hoặc O(n) |
| Cần cả min lẫn max lẫn tìm kiếm | \`sortedcontainers.SortedList\` (thư viện ngoài) | O(log n) |

Lưu ý: \`heapq\` thao tác trên \`list\` thường (không phải class riêng) — \`h[0]\` luôn là phần tử nhỏ nhất
hiện tại, đọc được trực tiếp trong O(1) mà không cần gọi hàm.

## 5. Ứng dụng thực tế

- **Dijkstra & A\\*** (tìm đường đi ngắn nhất trong bản đồ, game) — heap là trái tim của thuật toán.
- **Bộ lập lịch tiến trình** của hệ điều hành; \`sched\` module và các thư viện task queue của Python
  dùng heap để biết việc nào chạy tiếp theo.
- **Nén Huffman**: luôn ghép hai cây có tần suất nhỏ nhất.
- **Top-K thời gian thực**: bảng xếp hạng, phát hiện bất thường trong luồng log.
- **Load balancer**: chọn máy chủ đang rảnh nhất.
`,
  quiz: [
    {
      q: 'Để tìm K phần tử LỚN nhất trong n số, nên dùng heap loại nào và kích thước bao nhiêu?',
      options: [
        'Max-heap kích thước n',
        'Min-heap kích thước K',
        'Max-heap kích thước K',
        'Min-heap kích thước n',
      ],
      answer: 1,
      why: 'Min-heap kích thước K: gốc là phần tử NHỎ NHẤT trong top-K hiện tại, nên nó là "người sắp bị loại". Mỗi số mới chỉ cần so với gốc. Chi phí O(n log k), bộ nhớ O(k) — dùng được cả với luồng dữ liệu vô hạn.',
    },
    {
      q: 'Heap đảm bảo tính chất gì?',
      options: [
        'Toàn bộ mảng được sắp xếp tăng dần',
        'Mỗi nút nhỏ hơn hoặc bằng các con của nó (thứ tự một phần)',
        'Cây luôn cân bằng hoàn hảo với chiều cao log n chính xác',
        'Các nút cùng tầng được sắp xếp',
      ],
      answer: 1,
      why: 'Chỉ là quan hệ cha-con, không có ràng buộc giữa các anh em. Chính vì ràng buộc YẾU nên duy trì rẻ (O(log n)) — đây là ý tưởng thiết kế cốt lõi: chỉ đảm bảo đúng thứ bạn cần.',
    },
    {
      q: 'Vì sao Dijkstra dùng heap thay vì quét mảng tìm đỉnh gần nhất?',
      options: [
        'Vì heap tiết kiệm bộ nhớ hơn',
        'Vì giảm chi phí tìm đỉnh có khoảng cách nhỏ nhất từ O(V) xuống O(log V), đưa tổng từ O(V²) về O(E log V)',
        'Vì heap tự động sắp xếp các cạnh',
        'Vì không thể cài Dijkstra bằng mảng',
      ],
      answer: 1,
      why: 'Dijkstra lặp lại thao tác "lấy đỉnh chưa thăm gần nhất" — đúng định nghĩa của priority queue. Với đồ thị thưa, O(E log V) nhanh hơn hẳn O(V²).',
    },
    {
      q: 'Xây heap từ một mảng n phần tử có sẵn (heapify) tốn bao nhiêu?',
      options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'],
      answer: 1,
      why: 'Chèn từng phần tử là O(n log n), nhưng heapify từ dưới lên chỉ tốn O(n) — vì phần lớn nút nằm gần đáy và chỉ phải dìm xuống vài bậc. Đây là chi tiết đẹp và hay được hỏi.',
    },
  ],
  quizPy: [
    {
      q: 'Để tìm K phần tử LỚN nhất trong n số, nên dùng heap loại nào và kích thước bao nhiêu?',
      options: [
        'Max-heap kích thước n',
        'Min-heap kích thước K',
        'Max-heap kích thước K',
        'Min-heap kích thước n',
      ],
      answer: 1,
      why: 'Min-heap kích thước K: gốc (h[0]) là phần tử NHỎ NHẤT trong top-K hiện tại, nên nó là "người sắp bị loại". Mỗi số mới chỉ cần so với gốc. Chi phí O(n log k), bộ nhớ O(k) — dùng được cả với luồng dữ liệu vô hạn.',
    },
    {
      q: 'heapq của Python mặc định là loại heap nào, và làm sao để có max-heap?',
      options: [
        'Max-heap; muốn min-heap thì đảo dấu',
        'Min-heap; muốn max-heap thì đảo dấu giá trị khi push/pop',
        'Cả hai, tuỳ tham số truyền vào',
        'heapq không hỗ trợ max-heap dưới bất kỳ hình thức nào',
      ],
      answer: 1,
      why: 'heapq CHỈ cài đặt min-heap. Mẹo bắt buộc phải nhớ: push giá trị âm (`heapq.heappush(h, -v)`), rồi phủ định lại khi lấy ra, để mô phỏng max-heap.',
    },
    {
      q: 'Vì sao Dijkstra dùng heap thay vì quét mảng tìm đỉnh gần nhất?',
      options: [
        'Vì heap tiết kiệm bộ nhớ hơn',
        'Vì giảm chi phí tìm đỉnh có khoảng cách nhỏ nhất từ O(V) xuống O(log V), đưa tổng từ O(V²) về O(E log V)',
        'Vì heap tự động sắp xếp các cạnh',
        'Vì không thể cài Dijkstra bằng mảng',
      ],
      answer: 1,
      why: 'Dijkstra lặp lại thao tác "lấy đỉnh chưa thăm gần nhất" — đúng định nghĩa của priority queue. Với đồ thị thưa, O(E log V) nhanh hơn hẳn O(V²).',
    },
    {
      q: 'heapq.heapify(list) từ một list n phần tử có sẵn tốn bao nhiêu?',
      options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'],
      answer: 1,
      why: 'Chèn từng phần tử (n lần heappush) là O(n log n), nhưng heapify từ dưới lên chỉ tốn O(n) — vì phần lớn nút nằm gần đáy và chỉ phải dìm xuống vài bậc. Đây là chi tiết đẹp và hay được hỏi.',
    },
  ],
  problems: [
    {
      id: 'last-stone-weight',
      title: 'Trọng lượng viên đá cuối cùng',
      en: 'Last Stone Weight',
      difficulty: 'Easy',
      targetMinutes: 15,
      entry: 'lastStoneWeight',
      statement: `
Cho mảng \`stones\`. Mỗi lượt, lấy **hai viên nặng nhất** \`x <= y\` và đập chúng:
- nếu \`x === y\`: cả hai vỡ vụn
- nếu \`x !== y\`: viên x vỡ, viên y còn lại \`y - x\`

Lặp tới khi còn tối đa một viên. Trả về trọng lượng viên còn lại (hoặc \`0\`).

**Ví dụ**
- \`[2,7,4,1,8,1]\` → \`1\`
- \`[1]\` → \`1\`
`,
      starter: `function lastStoneWeight(stones) {\n  \n}`,
      starterPy: `def lastStoneWeight(stones):\n    \n`,
      tests: [
        { args: [[2, 7, 4, 1, 8, 1]], expected: 1, name: 'Ví dụ chuẩn' },
        { args: [[1]], expected: 1, name: 'Một viên' },
        { args: [[2, 2]], expected: 0, name: 'Hai viên bằng nhau' },
        { args: [[3, 7, 2]], expected: 2, name: 'Ba viên' },
        { args: [[10, 4, 2, 10]], expected: 2, name: 'Có hai viên nặng nhất bằng nhau' },
        { args: [[1, 1, 1]], expected: 1, name: 'Ba viên bằng nhau' },
      ],
      hints: [
        'Bài này là một chuỗi thao tác "lấy phần tử lớn nhất" trên tập dữ liệu **thay đổi liên tục** — chữ ký của max-heap.',
        'JavaScript không có heap dựng sẵn. Với n nhỏ, `sort` lại mỗi vòng cũng chạy được (O(n² log n)). Nhưng hãy thử tự cài một max-heap đơn giản để hiểu cấu trúc.',
        'Max-heap tối giản: mảng `h`; `push(v)` thì đẩy vào cuối rồi sift-up; `pop()` thì đổi chỗ gốc với cuối, `h.pop()`, rồi sift-down từ gốc. Chỉ khoảng 25 dòng.',
      ],
      hintsPy: [
        'Bài này là một chuỗi thao tác "lấy phần tử lớn nhất" trên tập dữ liệu **thay đổi liên tục** — chữ ký của max-heap.',
        'Python có `heapq` sẵn nhưng nó CHỈ là min-heap. Mẹo: đảo dấu mọi giá trị khi đẩy vào (`heapq.heapify([-s for s in stones])`), rồi phủ định lại khi lấy ra.',
        '`heapq.heappop(h)` lấy phần tử NHỎ NHẤT (tức giá trị âm lớn nhất sau khi đảo dấu = viên đá NẶNG nhất). Lặp: lấy hai viên nặng nhất, nếu khác nhau thì đẩy hiệu (đã đảo dấu) trở lại.',
      ],
      approach: `
Bài này nhỏ nhưng là cơ hội tốt nhất để **tự cài heap một lần** — sau đó bạn dùng lại mãi.

**Thuật toán:** đẩy tất cả đá vào max-heap. Trong khi còn ≥ 2 viên: lấy hai viên lớn nhất,
nếu khác nhau thì đẩy hiệu trở lại heap. Kết quả là phần tử còn lại hoặc 0.

\`\`\`
[2,7,4,1,8,1] -> heap: 8 7 4 2 1 1
8,7 -> đẩy lại 1   -> 4 2 1 1 1
4,2 -> đẩy lại 2   -> 2 1 1 1
2,1 -> đẩy lại 1   -> 1 1 1
1,1 -> vỡ hết      -> 1
=> 1 ✔
\`\`\`

**Max-heap tối giản bằng JS** (đáng để chép vào sổ tay):
\`\`\`js
class MaxHeap {
  constructor() { this.h = []; }
  get size() { return this.h.length; }
  push(v) {
    this.h.push(v);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] >= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop() {
    const top = this.h[0], last = this.h.pop();
    if (this.h.length) {
      this.h[0] = last;
      let i = 0;
      for (;;) {
        const l = 2*i+1, r = 2*i+2;
        let big = i;
        if (l < this.h.length && this.h[l] > this.h[big]) big = l;
        if (r < this.h.length && this.h[r] > this.h[big]) big = r;
        if (big === i) break;
        [this.h[big], this.h[i]] = [this.h[i], this.h[big]];
        i = big;
      }
    }
    return top;
  }
}
\`\`\`
`,
      solution: `function lastStoneWeight(stones) {
  // --- max-heap tối giản ---
  const h = [...stones];
  const size = () => h.length;
  const up = (i) => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[p] >= h[i]) break;
      [h[p], h[i]] = [h[i], h[p]];
      i = p;
    }
  };
  const down = (i) => {
    for (;;) {
      const l = 2 * i + 1, r = 2 * i + 2;
      let big = i;
      if (l < h.length && h[l] > h[big]) big = l;
      if (r < h.length && h[r] > h[big]) big = r;
      if (big === i) break;
      [h[big], h[i]] = [h[i], h[big]];
      i = big;
    }
  };
  const push = (v) => { h.push(v); up(h.length - 1); };
  const pop = () => {
    const top = h[0], last = h.pop();
    if (h.length) { h[0] = last; down(0); }
    return top;
  };

  for (let i = (h.length >> 1) - 1; i >= 0; i--) down(i);   // heapify O(n)

  while (size() > 1) {
    const y = pop(), x = pop();
    if (y !== x) push(y - x);
  }
  return size() ? h[0] : 0;
}`,
      solutionPy: `import heapq

def lastStoneWeight(stones):
    h = [-s for s in stones]      # Python chỉ có min-heap -> đảo dấu
    heapq.heapify(h)
    while len(h) > 1:
        y = -heapq.heappop(h)
        x = -heapq.heappop(h)
        if y != x:
            heapq.heappush(h, -(y - x))
    return -h[0] if h else 0`,
      complexity: {
        question: 'Độ phức tạp khi dùng heap (n viên đá)?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n² log n)'],
        answer: 1,
        why: 'Mỗi vòng loại ít nhất một viên → tối đa n vòng, mỗi vòng vài thao tác heap O(log n) → O(n log n). Cách sort lại mỗi vòng là O(n² log n).',
      },
      realWorld: 'Mô phỏng theo sự kiện: luôn xử lý "việc ưu tiên cao nhất" tiếp theo và có thể sinh việc mới — chính là cách bộ lập lịch tác vụ và hàng đợi công việc (job queue) hoạt động.',
    },
    {
      id: 'kth-largest-stream',
      title: 'Phần tử lớn thứ k trong luồng dữ liệu',
      en: 'Kth Largest Element in a Stream',
      difficulty: 'Easy',
      targetMinutes: 18,
      entry: 'KthLargest',
      statement: `
Thiết kế lớp tìm **phần tử lớn thứ k** trong một luồng số (tính cả các số được thêm sau).

- \`constructor(k, nums)\` — khởi tạo với k và mảng ban đầu
- \`add(val)\` — thêm val vào luồng và trả về phần tử lớn thứ k hiện tại

**Ví dụ**
\`\`\`
KthLargest(3, [4,5,8,2]);
add(3);   // 4
add(5);   // 5
add(10);  // 5
add(9);   // 8
add(4);   // 8
\`\`\`
`,
      starter: `class KthLargest {\n  constructor(k, nums) {\n    \n  }\n\n  add(val) {\n    \n  }\n}`,
      starterPy: `class KthLargest:\n    def __init__(self, k, nums):\n        pass\n\n    def add(self, val):\n        pass\n`,
      harnessSrc: `(Cls, args) => {
        const [ops, vals] = args;
        const out = [];
        let obj = null;
        for (let i = 0; i < ops.length; i++) {
          if (ops[i] === 'KthLargest') { obj = new Cls(vals[i][0], vals[i][1]); out.push(null); }
          else {
            const r = obj[ops[i]].apply(obj, vals[i] || []);
            out.push(r === undefined ? null : r);
          }
        }
        return out;
      }`,
      harnessSrcPy: `def harness(Cls, args, t):
    ops, vals = args
    out = []
    obj = None
    for i in range(len(ops)):
        if ops[i] == 'KthLargest':
            obj = Cls(vals[i][0], vals[i][1])
            out.append(None)
        else:
            v = vals[i] if vals[i] else []
            r = getattr(obj, ops[i])(*v)
            out.append(None if r is None else r)
    return out`,
      tests: [
        {
          args: [['KthLargest', 'add', 'add', 'add', 'add', 'add'],
            [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]],
          expected: [null, 4, 5, 5, 8, 8],
          name: 'Ví dụ chuẩn',
        },
        {
          args: [['KthLargest', 'add', 'add', 'add'], [[1, []], [-3], [-2], [-4]]],
          expected: [null, -3, -2, -2],
          name: 'k = 1, mảng ban đầu rỗng, số âm',
        },
        {
          args: [['KthLargest', 'add', 'add'], [[2, [0]], [-1], [1]]],
          expected: [null, -1, 0],
          name: 'Ít phần tử hơn k lúc đầu',
        },
      ],
      hints: [
        'Nghĩ ngược: bạn KHÔNG cần giữ toàn bộ luồng. Chỉ cần giữ đúng **k phần tử lớn nhất** đã thấy — phần tử lớn thứ k chính là nhỏ nhất trong nhóm đó.',
        'Dùng **min-heap kích thước k**. Khi thêm giá trị mới: push vào; nếu `heap.size > k` thì pop (bỏ phần tử nhỏ nhất). Đáp án luôn là gốc heap.',
        'Vì sao min-heap chứ không phải max-heap? Vì ta cần loại bỏ nhanh phần tử **nhỏ nhất** trong nhóm k — gốc của min-heap chính là nó. Đây là mẹo quan trọng nhất của mọi bài top-K.',
      ],
      hintsPy: [
        'Nghĩ ngược: bạn KHÔNG cần giữ toàn bộ luồng. Chỉ cần giữ đúng **k phần tử lớn nhất** đã thấy — phần tử lớn thứ k chính là nhỏ nhất trong nhóm đó.',
        'Dùng **`heapq`** (min-heap tự nhiên, không cần đảo dấu ở đây!) kích thước k. Khi thêm giá trị mới: `heapq.heappush(self.h, val)`; nếu `len(self.h) > k` thì `heapq.heappop(self.h)`. Đáp án luôn là `self.h[0]`.',
        'Vì sao min-heap chứ không phải max-heap? Vì ta cần loại bỏ nhanh phần tử **nhỏ nhất** trong nhóm k — gốc của min-heap (`h[0]`) chính là nó. Đây là mẹo quan trọng nhất của mọi bài top-K — và đúng lúc khớp với việc heapq mặc định là min-heap, không cần đảo dấu.',
      ],
      diagnostics: [
        { test: 'sort\\s*\\([\\s\\S]{0,60}\\)[\\s\\S]{0,60}add', message: 'Sort lại toàn bộ mảng mỗi lần `add` là O(n log n) mỗi thao tác và tốn O(n) bộ nhớ — không dùng được với luồng dữ liệu dài. Min-heap kích thước k cho O(log k) và bộ nhớ O(k).' },
      ],
      diagnosticsPy: [
        { test: '\\.sort\\s*\\(\\)[\\s\\S]{0,60}def\\s+add|sorted\\s*\\([\\s\\S]{0,60}def\\s+add', message: 'Sort lại toàn bộ list mỗi lần `add` là O(n log n) mỗi thao tác và tốn O(n) bộ nhớ — không dùng được với luồng dữ liệu dài. Min-heap (heapq) kích thước k cho O(log k) và bộ nhớ O(k).' },
      ],
      approach: `
**Bài học cốt lõi: đừng lưu nhiều hơn mức cần thiết.**

Luồng có thể vô hạn (hàng tỷ số) nhưng ta chỉ cần **k** số. Với k = 3, dù đã thấy 10⁹ số,
bộ nhớ vẫn chỉ là 3 phần tử.

\`\`\`
k=3, ban đầu [4,5,8,2] -> min-heap giữ 3 lớn nhất: [4,5,8]  (gốc = 4)
add(3):  3 < 4 -> không vào được, đáp án 4
add(5):  push -> [4,5,5,8] -> pop min(4) -> [5,5,8], đáp án 5
add(10): push -> pop 5 -> [5,8,10], đáp án 5
add(9):  push -> pop 5 -> [8,9,10], đáp án 8
\`\`\`

**Chi phí:** \`add\` là O(log k), bộ nhớ O(k). So sánh:
- Giữ mảng + sort mỗi lần: O(n log n) mỗi add — không khả thi.
- Giữ mảng đã sắp + chèn nhị phân: O(n) mỗi add do phải dịch phần tử.
- **Min-heap kích thước k: O(log k)** ✔

**Đây là mẫu hình cực kỳ phổ biến trong hệ thống thực**: mọi bảng xếp hạng "top N"
trên luồng sự kiện đều dùng cấu trúc này (hoặc biến thể xấp xỉ khi k rất lớn).
`,
      solution: `class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.h = [];                       // min-heap
    for (const v of nums) this._push(v);
    while (this.h.length > k) this._pop();
  }

  _push(v) {
    const h = this.h;
    h.push(v);
    let i = h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[p] <= h[i]) break;
      [h[p], h[i]] = [h[i], h[p]];
      i = p;
    }
  }

  _pop() {
    const h = this.h;
    const top = h[0], last = h.pop();
    if (h.length) {
      h[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let small = i;
        if (l < h.length && h[l] < h[small]) small = l;
        if (r < h.length && h[r] < h[small]) small = r;
        if (small === i) break;
        [h[small], h[i]] = [h[i], h[small]];
        i = small;
      }
    }
    return top;
  }

  add(val) {
    this._push(val);
    if (this.h.length > this.k) this._pop();   // luôn giữ đúng k phần tử lớn nhất
    return this.h[0];
  }
}`,
      solutionPy: `import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.h = list(nums)
        heapq.heapify(self.h)
        while len(self.h) > k:
            heapq.heappop(self.h)

    def add(self, val):
        heapq.heappush(self.h, val)
        if len(self.h) > self.k:
            heapq.heappop(self.h)
        return self.h[0]`,
      complexity: {
        question: 'Chi phí thời gian và bộ nhớ của mỗi lần `add` với min-heap kích thước k?',
        options: ['O(1) / O(n)', 'O(log k) / O(k)', 'O(log n) / O(n)', 'O(n) / O(k)'],
        answer: 1,
        why: 'Push + pop trên heap k phần tử là O(log k); bộ nhớ chỉ O(k) bất kể luồng dài bao nhiêu. Đây là lý do kỹ thuật này dùng được cho dữ liệu thời gian thực quy mô lớn.',
      },
      realWorld: 'Bảng xếp hạng thời gian thực (top 10 người chơi, top sản phẩm), giám sát "10 truy vấn chậm nhất" trong database, và phát hiện bất thường trên luồng metrics — tất cả đều là heap kích thước k.',
    },
    {
      id: 'k-closest-points',
      title: 'K điểm gần gốc toạ độ nhất',
      en: 'K Closest Points to Origin',
      difficulty: 'Medium',
      targetMinutes: 20,
      entry: 'kClosest',
      statement: `
Cho mảng \`points\` gồm các điểm \`[x, y]\` và số \`k\`, trả về **k điểm gần gốc toạ độ (0,0) nhất**
theo khoảng cách Euclid. Thứ tự kết quả không quan trọng.

**Ví dụ**
- \`points = [[1,3],[-2,2]], k = 1\` → \`[[-2,2]]\`
- \`points = [[3,3],[5,-1],[-2,4]], k = 2\` → \`[[3,3],[-2,4]]\`
`,
      starter: `function kClosest(points, k) {\n  \n}`,
      starterPy: `def kClosest(points, k):\n    \n`,
      tests: [
        { args: [[[1, 3], [-2, 2]], 1], expected: [[-2, 2]], name: 'Ví dụ 1' },
        { args: [[[3, 3], [5, -1], [-2, 4]], 2], expected: [[3, 3], [-2, 4]], name: 'Ví dụ 2' },
        { args: [[[0, 1], [1, 0]], 2], expected: [[0, 1], [1, 0]], name: 'Lấy tất cả' },
        { args: [[[1, 1], [2, 2], [3, 3]], 1], expected: [[1, 1]], name: 'Gần nhất' },
        { args: [[[-5, 4], [-6, -5], [4, 6]], 2], expected: [[-5, 4], [4, 6]], name: 'Toạ độ âm' },
      ],
      checkerSrc: `(got, exp) => {
        if (!Array.isArray(got) || got.length !== exp.length) return false;
        const norm = (g) => g.map(p => p.join(',')).sort().join('|');
        return norm(got) === norm(exp);
      }`,
      checkerSrcPy: `lambda got, exp, args: isinstance(got, list) and len(got) == len(exp) \\
        and sorted(','.join(str(x) for x in p) for p in got) == sorted(','.join(str(x) for x in p) for p in exp)`,
      hints: [
        'Không cần tính căn bậc hai! So sánh `x² + y²` cho cùng thứ tự với `√(x² + y²)` vì hàm căn là đơn điệu tăng — tiết kiệm thời gian và tránh sai số dấu phẩy động.',
        'Cách 1 (dễ): sắp xếp toàn bộ theo khoảng cách rồi lấy k điểm đầu → O(n log n). Hoàn toàn chấp nhận được.',
        'Cách 2 (heap): **max-heap kích thước k** — với bài "k NHỎ nhất" ta dùng max-heap để loại phần tử xa nhất. O(n log k), tốt hơn khi k nhỏ hơn n rất nhiều. Cách 3 (quickselect): O(n) trung bình.',
      ],
      hintsPy: [
        'Không cần tính căn bậc hai! So sánh `x² + y²` cho cùng thứ tự với `√(x² + y²)` vì hàm căn là đơn điệu tăng — tiết kiệm thời gian và tránh sai số dấu phẩy động.',
        'Cách 1 (dễ): `sorted(points, key=lambda p: p[0]**2 + p[1]**2)[:k]` → O(n log n). Hoàn toàn chấp nhận được.',
        'Cách 2 (heap): dùng `heapq` với giá trị **đảo dấu** để mô phỏng max-heap kích thước k — với bài "k NHỎ nhất" ta dùng max-heap để loại phần tử xa nhất. O(n log k). Cách 3 (quickselect): O(n) trung bình. Python cũng có sẵn `heapq.nsmallest(k, points, key=...)` làm gọn cách 2.',
      ],
      diagnostics: [
        { test: 'Math\\.sqrt', message: 'Không cần `Math.sqrt` — so sánh bình phương khoảng cách cho cùng thứ tự, nhanh hơn và chính xác hơn về mặt số học.' },
      ],
      diagnosticsPy: [
        { test: '\\bmath\\.sqrt|\\*\\*\\s*0\\.5', message: 'Không cần tính căn bậc hai — so sánh bình phương khoảng cách cho cùng thứ tự, nhanh hơn và chính xác hơn về mặt số học.' },
      ],
      approach: `
Bài này đáng giá vì nó cho bạn **ba lời giải với ba mức tư duy** — hãy nêu cả ba trong phỏng vấn.

**Cách 1 — Sắp xếp: O(n log n).** Đơn giản, luôn đúng. Bắt đầu bằng cách này.

**Cách 2 — Max-heap kích thước k: O(n log k).**
Quy tắc đối ngẫu cần thuộc:
> k phần tử **nhỏ** nhất → dùng **max**-heap kích thước k
> k phần tử **lớn** nhất → dùng **min**-heap kích thước k
Lý do: gốc heap phải là "ứng viên sắp bị loại".
Ưu điểm lớn: bộ nhớ O(k) → xử lý được luồng dữ liệu khổng lồ.

**Cách 3 — Quickselect: O(n) trung bình.**
Dùng ý tưởng phân hoạch của quicksort nhưng chỉ đệ quy vào **một** nửa.
Nhanh nhất về lý thuyết nhưng worst case O(n²) và không dùng được cho luồng dữ liệu.

**Khi nào chọn gì?**
| Tình huống | Chọn |
|---|---|
| Mảng cố định, k gần n | sort |
| Luồng dữ liệu / n rất lớn, k nhỏ | heap kích thước k |
| Mảng cố định trong bộ nhớ, cần nhanh nhất | quickselect |

Trả lời được bảng này thể hiện bạn hiểu **đánh đổi**, không chỉ thuộc thuật toán.
`,
      solution: `function kClosest(points, k) {
  // max-heap theo bình phương khoảng cách, giữ đúng k phần tử gần nhất
  const h = [];                                   // mỗi phần tử: [d2, point]
  const up = (i) => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[p][0] >= h[i][0]) break;
      [h[p], h[i]] = [h[i], h[p]];
      i = p;
    }
  };
  const down = (i) => {
    for (;;) {
      const l = 2 * i + 1, r = 2 * i + 2;
      let big = i;
      if (l < h.length && h[l][0] > h[big][0]) big = l;
      if (r < h.length && h[r][0] > h[big][0]) big = r;
      if (big === i) break;
      [h[big], h[i]] = [h[i], h[big]];
      i = big;
    }
  };

  for (const [x, y] of points) {
    h.push([x * x + y * y, [x, y]]);              // không cần sqrt
    up(h.length - 1);
    if (h.length > k) {                            // bỏ điểm XA nhất
      const last = h.pop();
      if (h.length) { h[0] = last; down(0); }
    }
  }
  return h.map(([, p]) => p);
}`,
      solutionPy: `import heapq

def kClosest(points, k):
    h = []                                  # max-heap: đảo dấu khoảng cách
    for x, y in points:
        heapq.heappush(h, (-(x * x + y * y), [x, y]))
        if len(h) > k:
            heapq.heappop(h)
    return [p for _, p in h]`,
      complexity: {
        question: 'Với n = 10⁸ điểm đến từ một luồng và k = 100, vì sao heap tốt hơn sort?',
        options: [
          'Vì heap có độ phức tạp thời gian thấp hơn tuyệt đối',
          'Vì heap chỉ cần O(k) bộ nhớ, còn sort đòi hỏi giữ toàn bộ n điểm trong RAM',
          'Vì sort không so sánh được số thực',
          'Vì heap luôn cho kết quả đã sắp xếp',
        ],
        answer: 1,
        why: 'Điểm mấu chốt trong thực tế thường là BỘ NHỚ chứ không phải thời gian. Heap kích thước k xử lý được luồng vô hạn; sort thì không.',
      },
      realWorld: 'Tìm k cửa hàng/tài xế gần bạn nhất trong ứng dụng gọi xe; k láng giềng gần nhất (KNN) trong học máy; chọn k máy chủ có độ trễ thấp nhất trong CDN.',
    },
  ],
},
];
