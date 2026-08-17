/**
 * Kiểm chứng hai luật chấm điểm mới:
 *
 *  1. HIỆU NĂNG được tính điểm: giải đúng mà chậm gấp chục lần lời giải tham
 *     chiếu thì không nhận mức thưởng hiệu năng (src/perf.js + src/scoring.js).
 *  2. Sau khi PASS HẾT TEST, gợi ý và lời giải MIỄN PHÍ: mở thêm không được làm
 *     tụt điểm của những lần chạy sau (src/unlock.js).
 *
 *   node tools/test-scoring.mjs
 */
/* dashboard/store cần localStorage; ở đây chỉ store.problem() dùng tới */
const kho = new Map();
globalThis.localStorage = {
  getItem: (k) => (kho.has(k) ? kho.get(k) : null),
  setItem: (k, v) => kho.set(k, String(v)),
  removeItem: (k) => kho.delete(k),
};

import { computeScore, BASE_POINTS, BONUS, REVEAL_CAP } from '../src/scoring.js';
import { perfTier, benchTests, perfScope, perfShaky, fmtMs, fmtRatio, PERF_TIERS } from '../src/perf.js';
import {
  isFree, openHint, hintButton, hintPaneNote, needsRevealConfirm,
  revealSolution, revealButtonLabel, revealNote, resetUnlockState,
} from '../src/unlock.js';
import { store } from '../src/store.js';

let passed = 0;
const failures = [];
const check = (name, ok, detail = '') => {
  if (ok) { passed++; return; }
  failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};
const eq = (name, actual, expected) => check(name, actual === expected, `mong ${expected}, nhận ${actual}`);

/** Bản ghi bài tập như store.problem() trả về. */
const rec = (patch = {}) => ({
  best: 0, attempts: 0, solved: false, hintsUsed: 0, revealed: false,
  hintsOpen: 0, solutionSeen: false, perfRatio: null, perfAt: null,
  firstTry: null, code: null, lastRun: null, ...patch,
});

/* ================= 1. Bậc hiệu năng ================= */
{
  eq('nhanh hơn tham chiếu -> bậc "faster"', perfTier(0.6).key, 'faster');
  eq('ngang ngửa (1.0×) -> nhận đủ thưởng', perfTier(1).credit, 1);
  eq('1.35× vẫn coi là ngang ngửa', perfTier(1.35).key, 'onpar');
  eq('1.36× -> chậm hơn một chút', perfTier(1.36).key, 'ok');
  eq('chậm hơn một chút -> nửa thưởng', perfTier(2).credit, 0.5);
  eq('2.5× vẫn ở bậc "ok"', perfTier(2.5).key, 'ok');
  eq('3× -> mất thưởng', perfTier(3).credit, 0);
  eq('20× -> lệch độ phức tạp', perfTier(20).key, 'verySlow');
  eq('chưa đo (null) thì không phạt oan', perfTier(null).credit, 1);
  eq('số vô nghĩa cũng không phạt oan', perfTier(0).credit, 1);
  check('mọi bậc đều có lời khuyên cụ thể', PERF_TIERS.every((t) => t.advice && t.advice.length > 40));
  check('mọi bậc đều có màu để hiện badge', PERF_TIERS.every((t) => ['ok', 'medium', 'hard'].includes(t.tone)));
}

/* ================= 2. Điểm có tính hiệu năng ================= */
{
  const args = { difficulty: 'Easy' };   // base 100, không thưởng gì khác
  eq('chưa đo hiệu năng: điểm như cũ', computeScore(args).score, BASE_POINTS.Easy);
  eq('nhanh ngang tham chiếu: +10%', computeScore({ ...args, perfRatio: 1.1 }).score, 110);
  eq('chậm hơn một chút: +5%', computeScore({ ...args, perfRatio: 2 }).score, 105);
  eq('chậm gấp 10 lần: không thưởng', computeScore({ ...args, perfRatio: 10 }).score, 100);
  check('chậm cũng KHÔNG bị trừ điểm', computeScore({ ...args, perfRatio: 50 }).score >= BASE_POINTS.Easy);

  const slow = computeScore({ ...args, perfRatio: 10 });
  const line = slow.parts.find((pt) => /Hiệu năng/.test(pt.label));
  check('bảng điểm nói rõ vì sao không được thưởng', !!line && line.delta === 0, JSON.stringify(slow.parts));

  eq('điểm tối đa gồm cả thưởng hiệu năng',
    computeScore({ difficulty: 'Medium' }).max,
    Math.round(BASE_POINTS.Medium * (1 + BONUS.firstTry + BONUS.complexity + BONUS.speed + BONUS.perf)));

  // Thưởng hiệu năng vẫn nằm dưới trần 30% của "đã xem lời giải".
  eq('đã xem lời giải thì thưởng hiệu năng không vượt trần',
    computeScore({ ...args, revealed: true, perfRatio: 1 }).score, Math.round(BASE_POINTS.Easy * REVEAL_CAP));
}

/* ================= 3. Chọn bộ test để đo ================= */
{
  const tests = [
    { name: 'nhỏ 1', args: [[1, 2]] },
    { name: 'nhỏ 2', args: [[3]] },
    { name: 'Hiệu năng: n=100.000', args: [[1]], perf: true },
    { name: 'Chạy thử', args: [[9]], scratch: true },
  ];
  const chosen = benchTests(tests);
  eq('có test dữ liệu lớn thì chỉ đo trên đó', chosen.length, 1);
  eq('đúng test dữ liệu lớn', chosen[0].name, 'Hiệu năng: n=100.000');
  check('không bao giờ đo test "chạy thử"', !benchTests(tests.slice(0, 2).concat(tests[3])).some((t) => t.scratch));
  eq('không có test lớn thì đo trên bộ test thường', benchTests(tests.slice(0, 2)).length, 2);
  eq('giới hạn số test để phép đo không kéo dài', benchTests(Array.from({ length: 30 }, () => ({ args: [] }))).length, 12);

  check('đo trên dữ liệu lớn thì nói là phản ánh độ phức tạp', perfScope(tests).big === true);
  check('đo trên test thường thì nói rõ giới hạn của phép đo',
    perfScope(tests.slice(0, 2)).big === false && /hằng số/.test(perfScope(tests.slice(0, 2)).note));

  check('thời gian cỡ micro-giây bị đánh dấu là nhiễu', perfShaky(0.003, 0.002));
  check('thời gian cỡ mili-giây thì tin được', !perfShaky(3, 1));
  eq('hiện thời gian rất nhỏ theo µs', fmtMs(0.0123), '12.3 µs');
  eq('hiện thời gian lớn theo ms', fmtMs(153.7), '154 ms');
  eq('tỉ lệ nhỏ hiện 2 chữ số thập phân', fmtRatio(1.234), '1.23×');
  eq('tỉ lệ lớn hiện số nguyên', fmtRatio(23.4), '23×');
}

/* ================= 4. Chưa giải được: gợi ý & lời giải vẫn trừ điểm ================= */
{
  const r = rec();
  check('chưa giải thì chưa miễn phí', !isFree(r));
  const first = openHint(r, 3);
  check('mở được gợi ý 1', first.opened && first.level === 1 && first.free === false);
  openHint(r, 3);
  eq('mở 2 gợi ý -> phần phải trả điểm là 2', r.hintsUsed, 2);
  eq('số gợi ý đang hiện cũng là 2', r.hintsOpen, 2);
  check('nhãn nút nói rõ mất bao nhiêu %', /−\d+% điểm/.test(hintButton(r, 3).label), hintButton(r, 3).label);
  check('lời nhắc nói "trừ điểm dần"', /trừ điểm/.test(hintPaneNote(r)));

  check('chưa giải thì phải hỏi lại trước khi xem lời giải', needsRevealConfirm(r));
  revealSolution(r);
  check('xem lời giải khi chưa giải -> bị chặn trần điểm', r.revealed === true && r.solutionSeen === true);
  eq('điểm bị chặn ở 30%',
    computeScore({ difficulty: 'Easy', hintsUsed: r.hintsUsed, revealed: r.revealed }).score, 30);
}

/* ================= 5. Đã pass hết test: gợi ý & lời giải MIỄN PHÍ ================= */
{
  const r = rec();
  openHint(r, 3);                       // mở 1 gợi ý lúc còn đang bí -> có trả giá
  const before = computeScore({ difficulty: 'Medium', hintsUsed: r.hintsUsed, revealed: r.revealed, perfRatio: 1 }).score;

  r.solved = true;                      // pass hết test
  check('đã giải xong thì mọi thứ miễn phí', isFree(r));
  check('lời nhắc chuyển sang "không trừ điểm"', /không trừ điểm/.test(hintPaneNote(r)));
  check('nhãn nút nói "miễn phí"', /miễn phí/.test(hintButton(r, 3).label), hintButton(r, 3).label);

  const res = openHint(r, 3);
  check('mở thêm gợi ý sau khi giải xong là miễn phí', res.free === true);
  openHint(r, 3);
  eq('cả 3 gợi ý đang hiện', r.hintsOpen, 3);
  eq('nhưng phần phải trả điểm vẫn là 1', r.hintsUsed, 1);

  check('không hỏi lại nữa khi xem lời giải', !needsRevealConfirm(r));
  check('nhãn nút xem lời giải nói rõ miễn phí', /miễn phí/.test(revealButtonLabel(r)));
  check('phần giải thích nói rõ miễn phí', /miễn phí/.test(revealNote(r)));
  revealSolution(r);
  eq('lời giải đang hiện', r.solutionSeen, true);
  eq('nhưng KHÔNG bị tính là "đã xem lời giải"', r.revealed, false);

  const after = computeScore({ difficulty: 'Medium', hintsUsed: r.hintsUsed, revealed: r.revealed, perfRatio: 1 }).score;
  eq('điểm không hề tụt sau khi đọc gợi ý + lời giải', after, before);

  eq('mở quá số gợi ý có thật thì không làm gì', openHint(r, 3).opened, false);
  check('hết gợi ý thì nút bị vô hiệu hoá', hintButton(r, 3).disabled === true);
}

/* ================= 6. Bản ghi cũ vẫn đọc được ================= */
{
  store.reset();
  // Bản ghi từ phiên bản trước: chưa có hintsOpen/solutionSeen/perfRatio.
  const st = store.get();
  st.problems['bai-cu'] = { best: 90, attempts: 4, solved: true, hintsUsed: 2, revealed: true, lastRun: 1 };
  const r = store.problem('bai-cu');
  eq('suy ra số gợi ý đang hiện từ dữ liệu cũ', r.hintsOpen, 2);
  eq('suy ra lời giải đang hiện từ dữ liệu cũ', r.solutionSeen, true);
  eq('chưa từng đo hiệu năng', r.perfRatio, null);

  const fresh = store.problem('bai-moi');
  check('bản ghi mới có đủ trường mới',
    fresh.hintsOpen === 0 && fresh.solutionSeen === false && fresh.perfRatio === null);
  store.reset();
}

/* ================= 7. Ôn tập (forcePaid): đã giải rồi vẫn phải trả điểm ================= */
{
  const paid = { forcePaid: true };

  // Bài ĐÃ GIẢI (rec.solved = true) nhưng đang ôn tập -> KHÔNG được coi là miễn phí.
  const r = rec({ solved: true });
  check('rec.solved=true nhưng forcePaid -> không còn miễn phí', !isFree(r, paid));
  check('không truyền opts thì vẫn miễn phí như cũ (không phá vỡ hành vi cũ)', isFree(r));

  const opened = openHint(r, 3, paid);
  check('mở gợi ý lúc đang ôn tập vẫn tính là phải trả điểm', opened.free === false);
  eq('hintsUsed tăng lên dù bài đã từng giải', r.hintsUsed, 1);
  check('nhãn nút nói rõ số % mất, không nói "miễn phí"',
    /−\d+% điểm/.test(hintButton(r, 3, paid).label) && !/miễn phí/.test(hintButton(r, 3, paid).label),
    hintButton(r, 3, paid).label);
  check('lời nhắc đầu khung gợi ý nói "trừ điểm dần"', /trừ điểm/.test(hintPaneNote(r, paid)));

  check('xem lời giải lúc đang ôn tập vẫn phải hỏi lại', needsRevealConfirm(r, paid));
  check('nhãn nút xem lời giải không còn nói miễn phí', !/miễn phí/.test(revealButtonLabel(r, paid)));
  check('phần giải thích cảnh báo trần 30%', /30%/.test(revealNote(r, paid)));
  const revealRes = revealSolution(r, paid);
  check('xem lời giải lúc ôn tập bị tính là "đã xem" -> chặn trần điểm', revealRes.free === false && r.revealed === true);

  const scoreDuringReview = computeScore({ difficulty: 'Medium', hintsUsed: r.hintsUsed, revealed: r.revealed }).score;
  eq('điểm của lượt ôn tập này bị chặn trần 30% y như bài chưa từng giải',
    scoreDuringReview, Math.round(BASE_POINTS.Medium * REVEAL_CAP));

  // Không có forcePaid (đã giải lại thành công, review kết thúc) -> quay lại miễn phí ngay,
  // dù hintsUsed/revealed vẫn còn nguyên giá trị của lượt vừa rồi.
  check('bỏ forcePaid đi thì miễn phí trở lại (giống lúc vừa giải lại xong)', isFree(r));
  check('nhãn nút quay lại nói miễn phí khi không còn forcePaid', /miễn phí/.test(revealButtonLabel(r)));
}

/* ================= 8. resetUnlockState: bắt đầu lượt ôn tập mới sạch sẽ ================= */
{
  // Bản ghi mang trạng thái "đã mở hết, đã xem lời giải" từ TRƯỚC (dù miễn phí hay
  // không) -> resetUnlockState phải đưa nó về y hệt bài chưa từng đụng tới gì.
  const r = rec({ solved: true, hintsUsed: 2, hintsOpen: 3, revealed: true, solutionSeen: true });
  resetUnlockState(r);
  eq('hintsOpen về 0', r.hintsOpen, 0);
  eq('hintsUsed về 0', r.hintsUsed, 0);
  eq('revealed về false', r.revealed, false);
  eq('solutionSeen về false', r.solutionSeen, false);
  check('không đụng vào best/solved — đó là lịch sử thật, không phải trạng thái mở khoá',
    r.solved === true);

  check('resetUnlockState(null) không crash', (() => { resetUnlockState(null); return true; })());
}

console.log(`Chấm điểm & mở khoá: ${passed} kiểm tra đạt${failures.length ? `, ${failures.length} THẤT BẠI` : ''}.`);
if (failures.length) {
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('✓ Hiệu năng được tính điểm; đã giải xong thì gợi ý và lời giải miễn phí.');
