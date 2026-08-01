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
      diagnostics: [
        { test: 'includes\\s*\\(|indexOf\\s*\\(', message: 'Bạn đang dùng `includes`/`indexOf` — mỗi lời gọi là O(n), lồng trong vòng lặp thành O(n²). Đổi sang `Set`.' },
        { test: 'sort\\s*\\(', message: 'Sắp xếp rồi so hàng xóm là lời giải đúng nhưng O(n log n). Có cách O(n) — hãy nghĩ tới `Set`.' },
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
      hints: [
        'Cố định một phần tử `nums[i]`. Bạn đang đi tìm chính xác một giá trị: `target - nums[i]`. Vấn đề chỉ còn là "tìm nhanh".',
        'Dùng `Map` ánh xạ giá_trị → chỉ_số. Duyệt i từ trái sang: nếu `map.has(target - nums[i])` thì đã có đáp án; nếu chưa, lưu `map.set(nums[i], i)`.',
        'Thứ tự rất quan trọng: **kiểm tra trước, lưu sau**. Nếu lưu trước, với `nums=[3,3]` và target=6 bạn sẽ khớp phần tử với chính nó. Chỉ cần một vòng lặp duy nhất — không cần vòng thứ hai.',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Đang có hai vòng lặp lồng nhau → O(n²). Test hiệu năng sẽ đánh trượt. Hãy thay vòng trong bằng một `Map`.' },
        { test: 'sort\\s*\\(', message: 'Cẩn thận: sắp xếp làm mất chỉ số gốc. Nếu vẫn muốn dùng hai con trỏ, bạn phải lưu cặp (giá trị, chỉ số) trước khi sắp.' },
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
      hints: [
        'Mọi bài "gom nhóm" đều quy về một câu hỏi duy nhất: **khoá của nhóm là gì?** Hãy tìm một hàm f(từ) sao cho hai từ đảo chữ luôn cho cùng giá trị.',
        'Cách 1: sắp xếp các ký tự trong từ — "eat" và "tea" đều thành "aet". Cách 2 (nhanh hơn): đếm 26 chữ cái rồi ghép thành chuỗi "1#0#0#...".',
        'Dùng `Map<string, string[]>`. Với mỗi từ: tính khoá, nếu Map chưa có khoá thì tạo mảng rỗng, rồi push từ vào. Cuối cùng trả về `[...map.values()]`.',
      ],
      diagnostics: [
        { test: 'permut|for[\\s\\S]{0,300}for[\\s\\S]{0,300}for', message: 'Bạn đang so từng cặp hoặc sinh hoán vị. Không cần — chỉ cần chuẩn hoá mỗi từ thành một khoá rồi gom bằng Map (một lượt duyệt).' },
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
      tests: [
        { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], name: 'Ví dụ 1' },
        { args: [[7, 7], 1], expected: [7], name: 'Một phần tử' },
        { args: [[1, 2, 3, 4], 4], expected: [1, 2, 3, 4], name: 'k = n, tất cả tần suất 1' },
        { args: [[5, 5, 5, 4, 4, 3, 3, 3, 3], 2], expected: [3, 5], name: 'Ba nhóm tần suất' },
        { args: [[-1, -1, 2], 1], expected: [-1], name: 'Số âm' },
      ],
      checkerSrc: `(got, exp) => Array.isArray(got) && got.length === exp.length
        && [...got].sort((a,b)=>a-b).join(',') === [...exp].sort((a,b)=>a-b).join(',')`,
      hints: [
        'Chia thành hai giai đoạn rõ ràng: (1) đếm tần suất bằng Map; (2) chọn ra k khoá có tần suất lớn nhất. Đừng trộn hai việc này.',
        'Giai đoạn (2) đơn giản nhất là sắp xếp theo tần suất giảm dần rồi lấy k đầu → O(n log n). Đúng, nhưng chưa tối ưu.',
        'Mẹo **bucket sort**: tần suất luôn nằm trong [1..n]. Tạo mảng `buckets` độ dài n+1, `buckets[f]` = danh sách các giá trị có tần suất f. Duyệt buckets từ cuối về đầu, gom đủ k phần tử → O(n).',
      ],
      diagnostics: [
        { test: 'sort\\s*\\(', message: 'Bản dùng sort là O(n log n) — vẫn được chấp nhận, nhưng hãy thử đạt O(n) bằng bucket sort (tần suất bị chặn bởi n).' },
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
      diagnostics: [
        { test: '\\/(?![\\/*])|\\bMath\\.floor\\s*\\([^)]*\\/', message: 'Đề bài cấm phép chia (vì mảng có thể chứa số 0 làm hỏng cách chia tổng tích). Hãy dùng tích tiền tố và tích hậu tố.' },
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
      diagnostics: [
        { test: 'new Map|new Set|\\{\\s*\\}\\s*;?\\s*\\n[\\s\\S]*\\[[a-z]+\\]\\s*=', message: 'Đề yêu cầu O(1) bộ nhớ phụ — dùng Map là vi phạm. Hãy khai thác việc mảng đã sắp xếp.' },
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lặp lồng nhau là O(n²). Với mảng đã sắp, chỉ cần MỘT vòng while với hai con trỏ.' },
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
      diagnostics: [
        { test: 'for[\\s\\S]{0,250}for', message: 'Hai vòng lồng nhau → O(n²), sẽ trượt test hiệu năng 60.000 phần tử. Hãy dùng hai con trỏ từ hai đầu.' },
        { test: 'Math\\.max\\s*\\(\\s*height', message: 'Cẩn thận: diện tích bị chặn bởi cột THẤP hơn (`Math.min`), không phải cột cao.' },
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
      hints: [
        'Giảm bài toán: cố định phần tử đầu tiên `nums[i]`, phần còn lại trở thành **Two Sum II** với target = `-nums[i]` trên đoạn `[i+1, n-1]`.',
        'Sắp xếp mảng trước. Sắp xếp cho bạn hai thứ: dùng được hai con trỏ, và các giá trị trùng nhau nằm cạnh nhau nên dễ bỏ qua.',
        'Xử lý trùng ở **cả ba vị trí**: (1) bỏ qua i nếu `nums[i] === nums[i-1]`; (2) sau khi tìm được nghiệm, tăng l cho tới khi giá trị đổi; (3) tương tự giảm r. Tối ưu thoát sớm: nếu `nums[i] > 0` thì dừng (mảng đã sắp, tổng ba số dương không thể bằng 0).',
      ],
      diagnostics: [
        { test: 'for[\\s\\S]{0,300}for[\\s\\S]{0,300}for', message: 'Ba vòng lặp lồng nhau → O(n³). Hãy cố định 1 phần tử rồi dùng hai con trỏ cho phần còn lại → O(n²).' },
        { test: 'JSON\\.stringify', message: 'Dùng Set chuỗi JSON để khử trùng thì chạy đúng nhưng tốn bộ nhớ và chậm. Sau khi sắp xếp, bạn khử trùng được bằng cách so sánh phần tử kề nhau — gọn và nhanh hơn.' },
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
      diagnostics: [
        { test: 'for[\\s\\S]{0,200}for', message: 'Hai vòng lồng nhau O(n²) sẽ trượt test 100.000 phần tử. Chỉ cần một lượt duyệt với biến "giá thấp nhất đã thấy".' },
        { test: 'Math\\.min\\s*\\(\\s*\\.\\.\\.|Math\\.max\\s*\\(\\s*\\.\\.\\.', message: 'Cẩn thận: `Math.min(...arr)` với mảng 100.000 phần tử có thể gây lỗi tràn stack, và nếu gọi trong vòng lặp thì thành O(n²).' },
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
      diagnostics: [
        { test: 'for[\\s\\S]{0,250}for', message: 'Hai vòng lồng nhau (thử mọi chuỗi con) là O(n²)/O(n³). Hãy dùng một vòng for cho r và một vòng while co l — tổng vẫn là O(n).' },
        { test: 'if\\s*\\([^)]*has\\([^)]*\\)\\s*\\)\\s*\\{?\\s*l\\+\\+', message: 'Dùng `if` để co cửa sổ là chưa đủ — có thể phải co nhiều bước liên tiếp. Đổi thành `while`.' },
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
      diagnostics: [
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
      diagnostics: [
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
