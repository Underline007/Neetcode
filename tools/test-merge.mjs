/**
 * Kiểm chứng bộ gộp tiến độ đa máy (src/sync-merge.js).
 *
 * Sai sót ở đây đồng nghĩa với MẤT tiến độ học của người dùng, nên mỗi quy tắc
 * gộp đều có một ca kiểm thử riêng, kèm hai tính chất tổng quát: gộp hai chiều
 * cho cùng kết quả (giao hoán) và gộp lại lần nữa không đổi gì (idempotent).
 *
 *   node tools/test-merge.mjs
 */
import { mergeState, summarizeMerge } from '../src/sync-merge.js';

let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) { passed++; return; }
  failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

/** Chuẩn hoá để so sánh: sắp xếp khoá của object (thứ tự khoá không mang ý nghĩa),
 *  giữ nguyên thứ tự mảng (nhật ký có thứ tự thật sự). */
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, canonical(value[k])]));
  }
  return value;
}

function eq(name, actual, expected) {
  const a = JSON.stringify(canonical(actual));
  const b = JSON.stringify(canonical(expected));
  check(name, a === b, `mong đợi ${b}, nhận ${a}`);
}

/** State tối thiểu, đủ field để bộ gộp làm việc. */
function base(patch = {}) {
  return {
    version: 1,
    createdAt: 1000,
    updatedAt: 1000,
    startedAt: null,
    xp: 0,
    streak: { count: 0, lastDay: null },
    problems: {},
    quizzes: {},
    lessons: {},
    days: {},
    log: [],
    theme: 'dark',
    lang: 'javascript',
    ...patch,
  };
}

function problem(patch = {}) {
  return {
    best: 0, attempts: 0, solved: false, hintsUsed: 0, revealed: false,
    firstTry: null, code: null, lastRun: null,
    srs: { due: null, interval: 0, ease: 2.5, reps: 0 },
    ...patch,
  };
}

/* --------- 1. Hai máy giải hai bài khác nhau: phải giữ được cả hai --------- */
{
  const a = base({ problems: { 'two-sum': problem({ solved: true, best: 100 }) } });
  const b = base({ problems: { 'valid-anagram': problem({ solved: true, best: 90 }) } });
  const m = mergeState(a, b);
  eq('bài của máy A còn nguyên', m.problems['two-sum'].best, 100);
  eq('bài của máy B được thêm vào', m.problems['valid-anagram'].best, 90);
  eq('không mất bài nào', Object.keys(m.problems).length, 2);
}

/* --------- 2. Cùng một bài, hai máy làm khác nhau --------- */
{
  const a = base({ problems: { x: problem({ best: 120, attempts: 3, solved: true, hintsUsed: 2 }) } });
  const b = base({ problems: { x: problem({ best: 80, attempts: 5, solved: false, hintsUsed: 1, revealed: true }) } });
  const m = mergeState(a, b).problems.x;
  eq('best lấy điểm cao hơn', m.best, 120);
  eq('attempts lấy max (không cộng dồn, tránh thổi phồng)', m.attempts, 5);
  eq('solved chỉ cần một bên đúng', m.solved, true);
  eq('hintsUsed lấy max', m.hintsUsed, 2);
  eq('revealed chỉ cần một bên đúng', m.revealed, true);
}

/* --------- 3. Code đang gõ: lấy bản chạy gần nhất --------- */
{
  const a = base({ problems: { x: problem({ code: 'ban cu', lastRun: 100 }) } });
  const b = base({ problems: { x: problem({ code: 'ban moi', lastRun: 500 }) } });
  eq('code lấy theo lastRun mới hơn', mergeState(a, b).problems.x.code, 'ban moi');
  eq('đổi chiều vẫn ra bản mới hơn', mergeState(b, a).problems.x.code, 'ban moi');

  const c = base({ problems: { x: problem({ code: null, lastRun: 900 }) } });
  const d = base({ problems: { x: problem({ code: 'co code', lastRun: 100 }) } });
  eq('bản mới hơn không có code thì lấy code của bản cũ', mergeState(c, d).problems.x.code, 'co code');
}

/* --------- 4. Lịch ôn tập: lấy nguyên cụm của bên đã ôn nhiều hơn --------- */
{
  const a = base({ problems: { x: problem({ srs: { due: 10, interval: 1, ease: 2.5, reps: 1 } }) } });
  const b = base({ problems: { x: problem({ srs: { due: 99, interval: 6, ease: 2.6, reps: 3 } }) } });
  eq('srs đi trọn cụm theo reps lớn hơn', mergeState(a, b).problems.x.srs, { due: 99, interval: 6, ease: 2.6, reps: 3 });
}

/* --------- 5. firstTry là thành tích, đạt ở máy nào cũng giữ --------- */
{
  const a = base({ problems: { x: problem({ firstTry: true }) } });
  const b = base({ problems: { x: problem({ firstTry: false }) } });
  eq('firstTry true thắng', mergeState(a, b).problems.x.firstTry, true);
  eq('null + false ra false', mergeState(base({ problems: { x: problem({ firstTry: null }) } }), b).problems.x.firstTry, false);
}

/* --------- 6. Bài giảng đã đọc / ngày đã xong: hợp nhất, giữ mốc SỚM nhất --------- */
{
  const a = base({ lessons: { arrays: { readAt: 500 } }, days: { 1: { doneAt: 500 } } });
  const b = base({ lessons: { arrays: { readAt: 200 }, stack: { readAt: 700 } }, days: { 2: { doneAt: 800 } } });
  const m = mergeState(a, b);
  eq('lần đọc đầu tiên được giữ', m.lessons.arrays.readAt, 200);
  eq('bài giảng của máy kia được thêm', m.lessons.stack.readAt, 700);
  eq('ngày đã xong hợp nhất', Object.keys(m.days).sort(), ['1', '2']);
}

/* --------- 7. Nhật ký + điểm: khử trùng, không bao giờ giảm --------- */
{
  const shared = { at: 100, type: 'problem', ref: 'x', points: 50 };
  const a = base({ xp: 80, log: [shared, { at: 200, type: 'quiz', ref: 't', points: 30 }] });
  const b = base({ xp: 90, log: [shared, { at: 300, type: 'problem', ref: 'y', points: 40 }] });
  const m = mergeState(a, b);
  eq('sự kiện trùng chỉ còn một', m.log.length, 3);
  eq('nhật ký sắp xếp mới nhất trước', m.log.map((e) => e.at), [300, 200, 100]);
  eq('điểm = tổng nhật ký đã khử trùng', m.xp, 120);
  check('điểm không thấp hơn bất kỳ bên nào', m.xp >= Math.max(a.xp, b.xp));
}
{
  // Nhật ký bị cắt bớt (chỉ giữ 400 mục gần nhất) -> tổng từ log nhỏ hơn xp thật.
  const a = base({ xp: 5000, log: [{ at: 1, type: 'p', ref: 'x', points: 10 }] });
  const b = base({ xp: 4200, log: [] });
  eq('điểm rơi về max khi nhật ký không còn đủ', mergeState(a, b).xp, 5000);
}

/* --------- 8. Chuỗi ngày học --------- */
{
  const a = base({ streak: { count: 7, lastDay: '2026-08-05' } });
  const b = base({ streak: { count: 3, lastDay: '2026-08-07' } });
  eq('ngày gần đây hơn thắng', mergeState(a, b).streak, { count: 3, lastDay: '2026-08-07' });
  const c = base({ streak: { count: 4, lastDay: '2026-08-07' } });
  eq('cùng ngày thì lấy chuỗi dài hơn', mergeState(b, c).streak.count, 4);
}

/* --------- 9. Mốc thời gian của lộ trình --------- */
{
  const a = base({ createdAt: 900, startedAt: 5000, updatedAt: 100 });
  const b = base({ createdAt: 300, startedAt: 2000, updatedAt: 700 });
  const m = mergeState(a, b);
  eq('createdAt lấy sớm nhất', m.createdAt, 300);
  eq('startedAt lấy sớm nhất (lộ trình bắt đầu từ lần đầu)', m.startedAt, 2000);
  eq('updatedAt lấy muộn nhất', m.updatedAt, 700);
  eq('theme/lang theo bản lưu gần đây nhất', mergeState(a, base({ updatedAt: 9999, lang: 'python' })).lang, 'python');
}

/* --------- 10. Đầu vào hỏng thì không được làm mất dữ liệu --------- */
{
  const a = base({ xp: 50 });
  eq('remote null -> giữ nguyên local', mergeState(a, null).xp, 50);
  eq('remote không phải object -> giữ nguyên local', mergeState(a, 'rác').xp, 50);
  eq('local null -> lấy remote', mergeState(null, a).xp, 50);
}

/* --------- 11. Tính chất tổng quát: giao hoán & idempotent --------- */
{
  const a = base({
    xp: 100, updatedAt: 10,
    problems: { x: problem({ best: 100, solved: true, lastRun: 50, code: 'a' }), y: problem({ best: 30 }) },
    quizzes: { t1: { best: 80, attempts: 2, lastAt: 40 } },
    lessons: { l1: { readAt: 5 } },
    days: { 1: { doneAt: 9 } },
    log: [{ at: 1, type: 'p', ref: 'x', points: 100 }],
    streak: { count: 2, lastDay: '2026-08-01' },
  });
  const b = base({
    xp: 50, updatedAt: 20,
    problems: { x: problem({ best: 120, hintsUsed: 1, lastRun: 80, code: 'b' }), z: problem({ best: 70, solved: true }) },
    quizzes: { t1: { best: 60, attempts: 5, lastAt: 90 }, t2: { best: 100, attempts: 1, lastAt: 95 } },
    lessons: { l2: { readAt: 3 } },
    days: { 2: { doneAt: 11 } },
    log: [{ at: 2, type: 'q', ref: 't1', points: 50 }],
    streak: { count: 9, lastDay: '2026-08-03' },
  });

  const forward = mergeState(a, b);
  const backward = mergeState(b, a);
  // theme/lang cố ý phụ thuộc "bản mới hơn", phần tiến độ thì phải giống hệt nhau.
  const progressOnly = ({ theme, lang, ...rest }) => rest;
  eq('gộp hai chiều cho cùng tiến độ', progressOnly(forward), progressOnly(backward));

  eq('gộp lại lần nữa không đổi gì (idempotent)', mergeState(forward, b), forward);
  eq('gộp với chính mình không đổi gì', mergeState(forward, forward), forward);

  eq('điểm cộng gộp từ nhật ký hai bên', forward.xp, 150);

  const s = summarizeMerge(a, forward);
  eq('tóm tắt đếm đúng số bài mới', s.newProblems, 1);
  eq('tóm tắt đếm đúng số bài vừa giải được', s.newSolved, 1);
  eq('tóm tắt báo đúng số điểm nhận thêm', s.xpGained, 50);
}

/* ------------------------------- kết quả ------------------------------- */
console.log(`Bộ gộp tiến độ: ${passed} kiểm tra đạt${failures.length ? `, ${failures.length} THẤT BẠI` : ''}.`);
if (failures.length) {
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('✓ Không có kịch bản nào làm mất tiến độ.');
