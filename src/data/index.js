import part1 from './part1.js';
import part2 from './part2.js';
import part3 from './part3.js';
import part4 from './part4.js';
import part5 from './part5.js';
import part6 from './part6.js';

/** 18 chủ đề theo đúng lộ trình neetcode.io/roadmap */
export const TOPICS = [...part1, ...part2, ...part3, ...part4, ...part5, ...part6];

/** Toàn bộ bài tập, đã gắn thông tin chủ đề */
export const PROBLEMS = TOPICS.flatMap((t) =>
  t.problems.map((p) => ({ ...p, topic: t.id, topicName: t.name, topicIcon: t.icon }))
);

export const topicById = new Map(TOPICS.map((t) => [t.id, t]));
export const problemById = new Map(PROBLEMS.map((p) => [p.id, p]));

/* ------------------------------------------------------------------ */
/* Sinh test hiệu năng: dữ liệu lớn được tạo lúc chạy, đáp án lấy từ
   lời giải tham chiếu (đã được bộ test thường xác nhận là đúng).      */
const perfCache = new Map();

export function buildTests(problem) {
  const tests = problem.tests.map((t) => ({ ...t }));

  for (const pt of problem.perfTests || []) {
    const key = `${problem.id}::${pt.name}`;
    let entry = perfCache.get(key);
    if (!entry) {
      const args = pt.build();
      let expected = pt.expected;
      if (expected === undefined) {
        // eslint-disable-next-line no-new-func
        const ref = new Function(`${problem.solution}\n;return ${problem.entry};`)();
        expected = ref(...args.map((a) => (Array.isArray(a) ? [...a] : a)));
      }
      entry = { args, expected, name: pt.name, perf: true };
      perfCache.set(key, entry);
    }
    tests.push(entry);
  }
  return tests;
}

/* ------------------------------------------------------------------ */
/** Lộ trình 30 ngày — mỗi ngày ~90-120 phút */
export const PLAN = [
  { day: 1, topics: ['arrays-hashing'], problems: ['contains-duplicate', 'two-sum'], focus: 'Đọc kỹ bài giảng Mảng & Bảng băm. Mục tiêu hôm nay không phải giải nhanh mà là *hiểu vì sao* bảng băm xoá được vòng lặp trong.' },
  { day: 2, topics: ['arrays-hashing'], problems: ['group-anagrams', 'top-k-frequent'], focus: 'Luyện câu hỏi "khoá là gì?". Với mọi bài gom nhóm, hãy viết ra hàm sinh khoá trước khi code.' },
  { day: 3, topics: ['arrays-hashing'], problems: ['product-except-self'], quiz: 'arrays-hashing', focus: 'Kỹ thuật tiền tố/hậu tố. Làm quiz để kiểm tra bạn có thực sự hiểu bản chất hay chỉ nhớ lời giải.' },
  { day: 4, topics: ['two-pointers'], problems: ['valid-palindrome', 'two-sum-ii'], focus: 'Tập phát biểu bằng lời: "vì sao dịch con trỏ này KHÔNG làm mất nghiệm?". Không trả lời được thì thuật toán sai.' },
  { day: 5, topics: ['two-pointers'], problems: ['container-most-water', 'three-sum'], quiz: 'two-pointers', focus: '3Sum là bài quan trọng nhất tuần. Chú ý kỹ thuật khử trùng ở cả ba vị trí.' },
  { day: 6, topics: ['sliding-window'], problems: ['best-time-stock', 'longest-substring'], focus: 'Học thuộc khung cửa sổ co giãn. Viết lại khung đó từ trí nhớ 3 lần trước khi làm bài.' },
  { day: 7, topics: ['sliding-window'], problems: ['longest-repeating-replacement', 'min-size-subarray-sum'], quiz: 'sliding-window', focus: 'Phân biệt bài "dài nhất" (cập nhật sau while) và "ngắn nhất" (cập nhật trong while). Cuối ngày: ôn lại các bài đến hạn.' },
  { day: 8, topics: ['stack'], problems: ['valid-parentheses', 'min-stack', 'eval-rpn', 'daily-temperatures'], quiz: 'stack', focus: 'Ngăn xếp đơn điệu là kỹ thuật ăn điểm. Hãy hiểu bất biến "stack chứa các phần tử đang chờ đáp án".' },
  { day: 9, topics: ['binary-search'], problems: ['binary-search-basic', 'search-rotated'], focus: 'Viết khuôn binary search đúng từ trí nhớ, không thử-sai. Luôn kiểm thử với mảng 2 phần tử.' },
  { day: 10, topics: ['binary-search'], problems: ['find-min-rotated', 'koko-bananas'], quiz: 'binary-search', focus: 'Koko là bài mở khoá "binary search on answer" — kỹ thuật giá trị nhất của chủ đề này.' },
  { day: 11, topics: ['linked-list'], problems: ['reverse-linked-list', 'merge-two-lists'], focus: 'Luôn VẼ sơ đồ mũi tên trước khi viết code. Tập dùng dummy node thành phản xạ.' },
  { day: 12, topics: ['linked-list'], problems: ['linked-list-cycle', 'remove-nth-from-end'], quiz: 'linked-list', focus: 'Rùa & thỏ và hai con trỏ cách nhau k bước. Hai mẫu này đủ cho phần lớn bài linked list.' },
  { day: 13, topics: ['trees'], problems: ['invert-binary-tree', 'max-depth-tree'], focus: 'Luyện "niềm tin đệ quy": tin rằng lời gọi cho cây con đã đúng, chỉ tập trung vào bước kết hợp.' },
  { day: 14, topics: ['trees'], problems: ['level-order', 'validate-bst'], focus: 'Khung BFS theo tầng sẽ dùng lại ở chủ đề đồ thị. Nắm chắc phân biệt ràng buộc cục bộ và toàn cục.' },
  { day: 15, topics: ['trees'], problems: ['lca-bst'], quiz: 'trees', focus: 'Ngày tổng kết nửa đầu. Sau khi làm bài, hãy ôn lại toàn bộ bài đến hạn trong mục Ôn tập ngắt quãng.' },
  { day: 16, topics: ['tries'], problems: ['implement-trie', 'word-dictionary'], quiz: 'tries', focus: 'Bài từ điển có ký tự đại diện là cầu nối sang Backtracking — chú ý phần DFS thử mọi nhánh.' },
  { day: 17, topics: ['heap'], problems: ['last-stone-weight', 'kth-largest-stream', 'k-closest-points'], quiz: 'heap', focus: 'Ghi vào sổ tay đoạn code heap tối giản. Thuộc quy tắc đối ngẫu: top-K lớn nhất dùng MIN-heap.' },
  { day: 18, topics: ['backtracking'], problems: ['subsets', 'combination-sum'], focus: 'Học thuộc khung CHỌN → ĐI TIẾP → HOÀN TÁC. Chú ý khác biệt giữa truyền i và i+1.' },
  { day: 19, topics: ['backtracking'], problems: ['permutations', 'word-search'], quiz: 'backtracking', focus: 'So sánh trực tiếp bảng tổ hợp vs hoán vị. Word Search là backtracking trên lưới — chuẩn bị cho đồ thị.' },
  { day: 20, topics: ['graphs'], problems: ['number-of-islands', 'rotting-oranges'], focus: 'Mẫu đếm thành phần liên thông và BFS đa nguồn. Hai mẫu này phủ rất nhiều bài lưới.' },
  { day: 21, topics: ['graphs'], problems: ['course-schedule', 'clone-graph-lite'], quiz: 'graphs', focus: 'Kỹ năng quan trọng nhất: DỊCH đề bài đời thường sang ngôn ngữ đồ thị.' },
  { day: 22, topics: ['advanced-graphs'], problems: ['network-delay-time', 'min-cost-connect-points'], quiz: 'advanced-graphs', focus: 'Thuộc bảng chọn thuật toán (BFS / Dijkstra / Bellman-Ford / MST). Đây là câu hỏi phỏng vấn rất hay gặp.' },
  { day: 23, topics: ['dp-1d'], problems: ['climbing-stairs', 'house-robber'], focus: 'Luyện ba câu hỏi DP: trạng thái? truy hồi? cơ sở? Viết ra giấy bằng lời trước khi code.' },
  { day: 24, topics: ['dp-1d'], problems: ['coin-change', 'longest-increasing-subsequence'], quiz: 'dp-1d', focus: 'Coin Change cho thấy vì sao greedy sai. LIS có hai lời giải ở hai mức tư duy — học cả hai.' },
  { day: 25, topics: ['dp-2d'], problems: ['unique-paths', 'longest-common-subsequence'], focus: 'LCS là thuật toán đứng sau git diff. Chú ý lệch chỉ số khi dùng biên rỗng.' },
  { day: 26, topics: ['dp-2d'], problems: ['partition-equal-subset'], quiz: 'dp-2d', focus: 'Nhận ra "knapsack đội lốt". Hiểu vì sao vòng lặp sức chứa phải duyệt ngược.' },
  { day: 27, topics: ['greedy'], problems: ['maximum-subarray', 'jump-game', 'gas-station'], quiz: 'greedy', focus: 'Với mỗi bài, hãy tự chứng minh vì sao greedy đúng. Không chứng minh được thì đừng dùng greedy.' },
  { day: 28, topics: ['intervals'], problems: ['merge-intervals', 'non-overlapping-intervals', 'meeting-rooms-ii'], quiz: 'intervals', focus: 'Câu hỏi duy nhất của chủ đề: sắp xếp theo start hay end? Trả lời đúng là xong bài.' },
  { day: 29, topics: ['bit-manipulation', 'math-geometry'], problems: ['single-number', 'number-of-1-bits', 'counting-bits', 'rotate-image', 'spiral-matrix'], quiz: 'bit-manipulation', focus: 'Ngày nhẹ về tư duy nhưng nhiều mẹo. Ghi lại 7 mẹo bit vào sổ tay.' },
  { day: 30, topics: ['math-geometry'], problems: ['happy-number'], quiz: 'math-geometry', focus: 'TỔNG ÔN: làm lại 3 bài có điểm thấp nhất trong mục Thống kê, hoàn thành mọi bài đến hạn ôn, và tự tổng kết mỗi chủ đề bằng 2 câu.' },
];

export const planByDay = new Map(PLAN.map((d) => [d.day, d]));
