/**
 * Kiểm chứng một bất biến của store: **bản ghi trả về từ `store.problem()` /
 * `store.quiz()` / `store.card()` phải LUÔN là bản ghi sống trong state.**
 *
 * Vì sao cần test riêng cho chuyện này? Các trang làm bài giữ tham chiếu tới bản
 * ghi suốt cả phiên (`const rec = store.problem(id)` lúc mở bài, rồi ghi vào
 * `rec.solved`, `rec.best`, `rec.code`... nhiều phút sau). Nếu store thay `state`
 * bằng một object MỚI ở giữa (đồng bộ đa máy gộp dữ liệu về), mọi thay đổi sau đó
 * ghi vào bản ghi mồ côi và biến mất — trong khi điểm vẫn tăng vì `addXp` ghi
 * thẳng vào state. Đúng là bug "giải xong, điểm tăng, nhưng bài vẫn báo chưa làm".
 *
 *   node tools/test-store-refs.mjs
 */
import { store } from '../src/store.js';

let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) { passed++; return; }
  failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

/* --------- 1. Gộp dữ liệu từ máy khác không được làm mồ côi bản ghi --------- */
{
  const rec = store.problem('py-drill-three-divisions');
  rec.attempts = 1;

  // Máy khác đẩy lên bản của nó (chưa có bài này) -> app tự gộp về.
  store.mergeRemote({
    version: 1,
    updatedAt: Date.now(),
    xp: 10,
    problems: { 'py-other': { best: 5, attempts: 1, solved: true } },
    log: [{ at: 1, type: 'solve', ref: 'py-other', points: 10 }],
  });

  check('gộp xong vẫn là CÙNG một object bản ghi',
    store.problem('py-drill-three-divisions') === rec,
    'store.problem() trả về object khác -> mọi tham chiếu đang giữ đã thành mồ côi');

  // Người học giải xong bài SAU khi lần gộp kia đã chạy.
  rec.solved = true;
  rec.best = 90;
  store.save();

  const saved = store.get().problems['py-drill-three-divisions'];
  check('cờ "đã giải" ghi qua tham chiếu cũ vẫn vào được state', saved?.solved === true,
    `nhận ${JSON.stringify(saved)}`);
  check('điểm cao nhất ghi qua tham chiếu cũ vẫn vào được state', saved?.best === 90,
    `nhận ${JSON.stringify(saved)}`);
  check('bài của máy khác cũng được giữ lại', store.get().problems['py-other']?.solved === true);
  check('dữ liệu gộp về không bị mất khi ghi tiếp', store.get().xp >= 10, `xp = ${store.get().xp}`);
}

/* ------------- 2. Cùng bất biến đó cho quiz và thẻ luyện nhớ ------------- */
{
  const quiz = store.quiz('py-basics');
  const card = store.card('card-1');
  store.mergeRemote({ version: 1, updatedAt: Date.now(), quizzes: { 'py-oop': { best: 75, attempts: 1 } } });

  check('quiz: vẫn cùng một object sau khi gộp', store.quiz('py-basics') === quiz);
  check('thẻ nhớ: vẫn cùng một object sau khi gộp', store.card('card-1') === card);

  quiz.best = 100;
  check('điểm quiz ghi qua tham chiếu cũ vẫn vào được state',
    store.get().quizzes['py-basics'].best === 100);
}

/* ---- 3. Bản ghi đã có ở cả hai bên: giữ object cũ, lấy giá trị đã gộp ---- */
{
  const rec = store.problem('py-shared');
  rec.best = 40;
  rec.attempts = 2;
  store.mergeRemote({
    version: 1,
    updatedAt: Date.now(),
    problems: { 'py-shared': { best: 80, attempts: 5, solved: true, revealed: true } },
  });

  check('bản ghi trùng: vẫn cùng một object', store.problem('py-shared') === rec);
  check('bản ghi trùng: lấy điểm cao hơn của hai bên', rec.best === 80, `nhận ${rec.best}`);
  check('bản ghi trùng: cờ đã giải được gộp bằng OR', rec.solved === true);
  check('bản ghi trùng: số lần thử lấy max', rec.attempts === 5, `nhận ${rec.attempts}`);
}

/* ------------------------------- kết quả ------------------------------- */
console.log(`Tham chiếu bản ghi của store: ${passed} kiểm tra đạt${failures.length ? `, ${failures.length} THẤT BẠI` : ''}.`);
if (failures.length) {
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('✓ Bản ghi luôn sống: không có thay đổi nào của người học bị mất.');
