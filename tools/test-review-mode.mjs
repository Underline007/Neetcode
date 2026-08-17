/**
 * Ôn tập ngắt quãng chỉ có tác dụng nếu người học thực sự phải TỰ NHỚ, không phải
 * mở bài ra là thấy sẵn lời giải cũ mình từng viết. Bug thật đã xảy ra: mọi lần mở
 * lại một bài đã giải — kể cả từ trang 🔁 Ôn tập — editor đều tự điền `rec.code`,
 * nên "ôn tập" chỉ là bấm chạy lại đúng code cũ.
 *
 * Sửa: link từ trang Ôn tập mang cờ "?review=1" (xem src/views/misc.js); trang bài
 * tập đọc cờ đó qua hashQuery() (src/ui.js) và:
 *   - khởi tạo editor bằng CODE MẪU (starter), không phải rec.code/rec.codePy;
 *   - không ghi đè rec.code/rec.codePy trong lúc gõ dở (để không làm mất lời giải
 *     cũ nếu người học bỏ ngang giữa chừng);
 *   - chỉ thay lời giải cũ bằng lời giải mới khi pass lại thành công, hoặc khi
 *     người học chủ động bấm "Xem lời giải trước của bạn".
 *
 * Bug thứ hai (cùng gốc): gợi ý & lời giải tham chiếu vốn MIỄN PHÍ sau khi đã giải
 * (xem src/unlock.js) — nhưng "đang ôn tập" thì `rec.solved` vẫn true từ trước, nên
 * mở gợi ý/xem lời giải trong lúc ôn tập cũng ăn ké MIỄN PHÍ đó, mất hết tác dụng
 * "vẫn phải trả điểm như thường nếu dùng". Sửa bằng `resetUnlockState()` (dọn sạch
 * trạng thái mở khoá khi bắt đầu lượt ôn) + tham số `{ forcePaid: true }` truyền
 * qua mọi hàm của unlock.js trong lúc đang ôn tập (tắt lại ngay khi giải lại thành
 * công — xem `reviewMode` trong mountProblem).
 *
 * Vì mountProblem() cần một trình soạn thảo thật gắn vào DOM (dự án không dùng
 * jsdom — nguyên tắc zero npm dependencies), phần tương tác điều đó đã được xác
 * nhận bằng trình duyệt thật (Chrome headless qua CDP) trong phiên làm việc. File
 * này kiểm tra phần LOGIC THUẦN tách ra được mà không cần DOM: hashQuery(),
 * isReviewMode(), và HTML do renderProblem() (một hàm thuần dựng chuỗi) trả về.
 *
 *   node tools/test-review-mode.mjs
 */
const kho = new Map();
globalThis.localStorage = {
  getItem: (k) => (kho.has(k) ? kho.get(k) : null),
  setItem: (k, v) => kho.set(k, String(v)),
  removeItem: (k) => kho.delete(k),
};
globalThis.window = { location: { hash: '' } };

import { hashQuery } from '../src/ui.js';
import { store } from '../src/store.js';
import { renderProblem, isReviewMode } from '../src/views/problem.js';
import { problemById, topicById } from '../src/data/index.js';

let passed = 0;
const failures = [];
const check = (name, ok, detail = '') => {
  if (ok) { passed++; return; }
  failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};
const eq2 = (name, actual, expected) => check(name, actual === expected, `mong ${expected}, nhận ${actual}`);

const setHash = (h) => { globalThis.window.location.hash = h; };

/* ================= 1. hashQuery() ================= */
{
  setHash('#/problem/two-sum?review=1');
  check('đọc được cờ review=1', hashQuery().get('review') === '1');

  setHash('#/problem/two-sum');
  check('không có "?" -> không có cờ nào', hashQuery().get('review') === null);

  setHash('#/problem/two-sum?review=1&x=2');
  check('đọc đúng khi có nhiều tham số', hashQuery().get('review') === '1' && hashQuery().get('x') === '2');

  setHash('');
  check('hash rỗng không crash', hashQuery().get('review') === null);
}

/* ================= 2. isReviewMode(rec) ================= */
{
  const withCode = { code: 'function f(){}', codePy: null };
  const noCode = { code: null, codePy: null };

  setHash('#/problem/x?review=1');
  check('có cờ + có code cũ -> đang ôn tập', isReviewMode(withCode) === true);
  check('có cờ nhưng CHƯA từng viết code -> không có gì để giấu, không bật', isReviewMode(noCode) === false);

  setHash('#/problem/x');
  check('mở bình thường (không có cờ) -> không bật dù có code cũ', isReviewMode(withCode) === false);

  setHash('#/problem/x?review=1');
  check('codePy cũng được coi là "có code cũ"', isReviewMode({ code: null, codePy: 'def f(): pass' }) === true);
}

/* ================= 3. Banner "Đang ôn tập" trong renderProblem() ================= */
{
  store.reset();
  const p = problemById.get('two-sum');

  // Chưa từng giải -> dù có cờ review=1 cũng không có gì để ôn, không hiện banner
  setHash(`#/problem/${p.id}?review=1`);
  let html = renderProblem(p.id, { problemById, topicById, basePath: '' });
  check('chưa từng giải: không hiện banner ôn tập', !html.includes('Đang ôn tập'));

  // Đã giải, mở BÌNH THƯỜNG -> không hiện banner (đây là mở lại để xem/sửa, không phải ôn tập)
  const rec = store.problem(p.id);
  rec.solved = true;
  rec.code = p.solution;
  store.save();
  setHash(`#/problem/${p.id}`);
  html = renderProblem(p.id, { problemById, topicById, basePath: '' });
  check('đã giải, mở bình thường: không hiện banner ôn tập', !html.includes('Đang ôn tập'));

  // Đã giải, mở qua link ôn tập (?review=1) -> PHẢI hiện banner + nút xem lời giải cũ
  setHash(`#/problem/${p.id}?review=1`);
  html = renderProblem(p.id, { problemById, topicById, basePath: '' });
  check('đã giải + ?review=1: hiện banner "Đang ôn tập"', html.includes('Đang ôn tập'));
  check('đã giải + ?review=1: có nút xem lời giải cũ', html.includes('review-reveal-btn'));
  // Bản HTML trả về không chứa nội dung code cũ ở bất cứ đâu (editor được dựng riêng ở
  // mountProblem, không qua renderProblem) -> không có nguy cơ rò rỉ lời giải qua HTML.
  check('lời giải cũ không bị lộ ra trong HTML của renderProblem', !html.includes(p.solution));

  store.reset();
}

/* ========= 4. Đang ôn tập: gợi ý & lời giải KHÔNG được miễn phí ========= */
{
  store.reset();
  const p = problemById.get('two-sum');
  const rec = store.problem(p.id);
  // Trạng thái điển hình SAU khi đã giải xong bình thường một lần: đã mở hết gợi ý
  // và xem lời giải MIỄN PHÍ (vì lúc đó không phải ôn tập, xem ../src/unlock.js).
  rec.solved = true;
  rec.code = p.solution;
  rec.hintsOpen = 3;
  rec.hintsUsed = 1;
  rec.revealed = true;
  rec.solutionSeen = true;
  store.save();

  // Mở BÌNH THƯỜNG (không qua trang Ôn tập): hành vi miễn phí phải giữ nguyên như cũ.
  setHash(`#/problem/${p.id}`);
  let html = renderProblem(p.id, { problemById, topicById, basePath: '' });
  check('mở bình thường: gợi ý vẫn nói "không trừ điểm"', html.includes('không trừ điểm'));
  check('mở bình thường: nút xem lời giải vẫn nói "miễn phí"', /Xem phân tích[^<]*miễn phí/.test(html));
  check('mở bình thường: KHÔNG đụng vào trạng thái đã mở trước đó', rec.hintsOpen === 3 && rec.revealed === true);

  // Mở qua trang Ôn tập: phải reset sạch VÀ không còn miễn phí.
  setHash(`#/problem/${p.id}?review=1`);
  html = renderProblem(p.id, { problemById, topicById, basePath: '' });
  check('ôn tập: gợi ý không còn nói "không trừ điểm"', !html.includes('không trừ điểm'));
  check('ôn tập: lời nhắc gợi ý nói "trừ điểm dần" như bài chưa giải', html.includes('trừ điểm dần'));
  check('ôn tập: nút xem lời giải KHÔNG còn nói miễn phí',
    !/Xem phân tích[^<]*miễn phí/.test(html), html.match(/id="reveal-btn">[^<]*/)?.[0]);
  check('ôn tập: phần giải thích cảnh báo trần 30%', /30%/.test(html));

  const after = store.problem(p.id);
  eq2('ôn tập: hintsOpen được dọn về 0', after.hintsOpen, 0);
  eq2('ôn tập: hintsUsed được dọn về 0', after.hintsUsed, 0);
  eq2('ôn tập: revealed được dọn về false', after.revealed, false);
  eq2('ôn tập: solutionSeen được dọn về false', after.solutionSeen, false);
  check('ôn tập: KHÔNG đụng vào rec.solved (lịch sử thật)', after.solved === true);
  check('ôn tập: KHÔNG đụng vào rec.best (điểm cao nhất đã đạt)', after.best === rec.best);

  store.reset();
}

/* ================= 5. Link từ trang Ôn tập phải mang cờ review=1 ================= */
{
  store.reset();
  const p = problemById.get('two-sum');
  const rec = store.problem(p.id);
  rec.solved = true;
  rec.best = 100;
  rec.srs = { due: Date.now() - 1000, interval: 1, ease: 2.5, reps: 1 };
  store.save();

  const { renderReview } = await import('../src/views/misc.js');
  const html = renderReview();
  check('trang Ôn tập link tới bài kèm ?review=1',
    html.includes(`#/problem/${p.id}?review=1`), 'không tìm thấy link đúng dạng');
  check('không còn link kiểu cũ (thiếu cờ) trỏ tới cùng bài',
    !new RegExp(`#/problem/${p.id}"`).test(html));

  store.reset();
}

console.log(`Ôn tập không lộ code cũ: ${passed} kiểm tra đạt${failures.length ? `, ${failures.length} THẤT BẠI` : ''}.`);
if (failures.length) {
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('✓ Ôn tập bắt đầu từ đầu; lời giải cũ được giữ an toàn cho tới khi tự giải lại được.');
