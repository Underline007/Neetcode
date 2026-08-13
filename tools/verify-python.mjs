/**
 * Kiểm chứng bài tập của lộ trình PYTHON: chạy toàn bộ lời giải mẫu qua toàn bộ test case
 * bằng CPython thật trên máy, cộng thêm các kiểm tra về cấu trúc dữ liệu (thiếu trường,
 * trùng id, quiz sai đáp án...).
 *
 *   node tools/verify-python.mjs
 *
 * Vì sao cần file riêng bên cạnh tools/verify.mjs? Bài của lộ trình thuật toán viết bằng
 * JavaScript nên Node chạy được trực tiếp; bài của lộ trình Python thì phải nhờ tới
 * python (xem tools/verify_python.py) — nơi ngữ nghĩa chấm bài được nhân bản từ
 * src/sandbox.worker.py.js.
 */
import { spawn } from 'node:child_process';
import { PY_TOPICS, PY_PROBLEMS } from '../src/data/python/index.js';

const PY_BIN = process.env.PYTHON || 'python';
const DIFFICULTIES = new Set(['Easy', 'Medium', 'Hard']);

/** Bài được miễn luật "ít nhất 4 test": đầu vào chỉ là MỘT giá trị bool nên chỉ tồn tại
 *  đúng 2 trường hợp để kiểm tra. Danh sách này phải luôn ngắn — cần thêm tên vào đây là
 *  dấu hiệu bài tập đó có đầu vào quá hẹp. */
const FEW_TESTS_OK = new Set(['py-reentrant-lock']);

let failures = 0;
const fail = (msg) => { console.error(`❌ ${msg}`); failures++; };

/* ------------------------- kiểm tra cấu trúc dữ liệu ------------------------- */
const ids = new Set();
for (const p of PY_PROBLEMS) {
  if (ids.has(p.id)) fail(`TRÙNG ID bài tập: ${p.id}`);
  ids.add(p.id);

  for (const field of ['title', 'en', 'entry', 'statement', 'starter', 'solution', 'approach', 'realWorld']) {
    if (!p[field]) fail(`${p.id}: thiếu trường "${field}"`);
  }
  if (!DIFFICULTIES.has(p.difficulty)) fail(`${p.id}: difficulty không hợp lệ (${p.difficulty})`);
  if (!(p.targetMinutes > 0)) fail(`${p.id}: thiếu targetMinutes`);
  if (!p.hints || p.hints.length < 3) fail(`${p.id}: cần ít nhất 3 gợi ý`);
  if (!p.tests || p.tests.length < (FEW_TESTS_OK.has(p.id) ? 2 : 4)) fail(`${p.id}: cần ít nhất 4 test case`);
  for (const t of p.tests || []) {
    if (!t.name) fail(`${p.id}: có test case thiếu tên`);
    if (!Array.isArray(t.args)) fail(`${p.id}: test "${t.name}" phải có args là mảng`);
  }
  if (p.starter && !p.starter.includes(p.entry)) {
    fail(`${p.id}: code mẫu không chứa tên "${p.entry}"`);
  }
  const cx = p.complexity;
  if (!cx || !cx.question || !cx.options || !cx.why) fail(`${p.id}: thiếu câu hỏi độ phức tạp`);
  else if (!(cx.answer >= 0 && cx.answer < cx.options.length)) fail(`${p.id}: complexity.answer sai chỉ số`);
}

/* --------------------------- kiểm tra chủ đề & quiz --------------------------- */
for (const t of PY_TOPICS) {
  if (!t.lesson || t.lesson.length < 500) fail(`module ${t.id}: bài giảng quá ngắn`);
  if (!t.quiz || t.quiz.length < 3) fail(`module ${t.id}: cần ít nhất 3 câu quiz`);
  for (const q of t.quiz || []) {
    if (!q.options || q.options.length < 2) fail(`module ${t.id}: quiz thiếu lựa chọn`);
    if (!(q.answer >= 0 && q.answer < (q.options?.length || 0))) fail(`module ${t.id}: quiz sai chỉ số đáp án — "${q.q.slice(0, 40)}…"`);
    if (!q.why) fail(`module ${t.id}: quiz thiếu giải thích — "${q.q.slice(0, 40)}…"`);
  }

  // Bậc thang độ khó: trong một module, bài phải xếp từ dễ đến khó
  const rank = { Easy: 0, Medium: 1, Hard: 2 };
  const order = t.problems.map((p) => rank[p.difficulty] ?? 9);
  for (let i = 1; i < order.length; i++) {
    if (order[i] < order[i - 1]) {
      fail(`module ${t.id}: bài "${t.problems[i].id}" (${t.problems[i].difficulty}) xếp sau bài khó hơn`);
      break;
    }
  }
}

/* ------------------------- chạy lời giải bằng Python ------------------------- */
const payload = {
  problems: PY_PROBLEMS.map((p) => ({
    id: p.id,
    entry: p.entry,
    solution: p.solution,
    tests: p.tests,
    harnessSrc: p.harnessSrc || null,
    checkerSrc: p.checkerSrc || null,
  })),
};

const py = spawn(PY_BIN, ['tools/verify_python.py'], {
  stdio: ['pipe', 'inherit', 'inherit'],
  // Console Windows mặc định là cp1252 -> in tiếng Việt/emoji sẽ crash nếu không ép UTF-8
  env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
});
py.on('error', (err) => {
  console.error(`❌ Không chạy được "${PY_BIN}": ${err.message}\n   Đặt biến môi trường PYTHON=<đường dẫn python> nếu cần.`);
  process.exit(1);
});
py.stdin.end(JSON.stringify(payload));

py.on('close', (code) => {
  console.log(`Cấu trúc dữ liệu: ${PY_PROBLEMS.length} bài · ${PY_TOPICS.length} module · ${failures} lỗi`);
  if (failures || code !== 0) {
    console.error('❌ CHƯA ĐẠT');
    process.exit(1);
  }
  console.log('✅ TẤT CẢ ĐỀU ĐẠT');
});
