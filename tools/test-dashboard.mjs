/**
 * Bảng điều khiển phải phản ánh tiến độ của LỘ TRÌNH ĐANG HỌC.
 *
 * Bug đã từng xảy ra: dashboard.js dùng cứng dữ liệu của lộ trình thuật toán, nên
 * người học Python giải xong bài vẫn thấy "0/64 bài đã giải" và "0% mức thành
 * thạo" — trong khi tổng điểm vẫn tăng. Nhìn từ phía người học thì đó đúng là
 * "làm xong mà app không ghi nhận".
 *
 *   node tools/test-dashboard.mjs
 */
/* Giả lập tối thiểu môi trường trình duyệt (dashboard chỉ dựng CHUỖI html, không chạm DOM). */
const kho = new Map();
globalThis.localStorage = {
  getItem: (k) => (kho.has(k) ? kho.get(k) : null),
  setItem: (k, v) => kho.set(k, String(v)),
  removeItem: (k) => kho.delete(k),
};

import { TOPICS, PROBLEMS } from '../src/data/index.js';
import { PY_TOPICS, PY_PROBLEMS } from '../src/data/python/index.js';
import { store } from '../src/store.js';
import { renderDashboard } from '../src/views/dashboard.js';

let passed = 0;
const failures = [];
const check = (name, ok, detail = '') => {
  if (ok) { passed++; return; }
  failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

const JS_DOMAIN = { TOPICS, PROBLEMS };
const PY_DOMAIN = { TOPICS: [...TOPICS, ...PY_TOPICS], PROBLEMS: [...PROBLEMS, ...PY_PROBLEMS] };

/** Đánh dấu đã giải xong một bài, giống luồng chấm điểm thật. */
function solve(id, points = 110) {
  const rec = store.problem(id);
  rec.solved = true;
  rec.best = points;
  rec.attempts = 1;
  rec.lastRun = Date.now();
  store.save();
}

/* --------- 1. Chế độ Python: bài Python vừa giải phải được đếm --------- */
{
  store.reset();
  store.setLang('python');
  const html0 = renderDashboard(PY_DOMAIN);
  check('chưa giải gì -> đếm 0', /class="n">0<span class="muted small">\/\d+/.test(html0), html0.match(/class="n">\d+<span[^>]*>\/\d+/)?.[0]);

  solve('py-drill-three-divisions');
  const html = renderDashboard(PY_DOMAIN);

  const dem = html.match(/class="n">(\d+)<span class="muted small">\/(\d+)</);
  check('bài Python vừa giải được đếm vào "Bài đã giải"', dem?.[1] === '1', `nhận ${dem?.[1]}`);
  check('tổng số bài lấy theo lộ trình đang học, không phải 64 bài JS',
    Number(dem?.[2]) === PY_DOMAIN.PROBLEMS.length, `nhận ${dem?.[2]}, mong ${PY_DOMAIN.PROBLEMS.length}`);
  check('có liệt kê module Python', html.includes('Cú pháp nền tảng'));

  // Mức thành thạo phải NHÍCH LÊN khi học xong hẳn một module Python. Trước đây nó
  // tính trên 18 chủ đề thuật toán nên bài Python có làm bao nhiêu cũng không đổi.
  const truoc = Number(html.match(/class="n">(\d+)%/)?.[1] ?? -1);
  for (const p of PY_PROBLEMS.filter((x) => x.topic === 'py-basics')) solve(p.id, 150);
  store.quiz('py-basics').best = 100;
  const sau = Number(renderDashboard(PY_DOMAIN).match(/class="n">(\d+)%/)?.[1] ?? -1);
  check('học xong một module Python thì mức thành thạo tăng', sau > truoc, `trước ${truoc}%, sau ${sau}%`);
  check('chế độ Python: hiện thẻ "Học tiếp" theo module', html.includes('Học tiếp'));
  check('chế độ Python: KHÔNG hiện thẻ ngày của lộ trình 30 ngày', !/Ngày \d+\/30/.test(html));
  check('module Python không làm vỡ thẻ chủ đề (t.days undefined)', html.includes('câu quiz'));
}

/* --------- 2. Chế độ JavaScript: giữ nguyên hành vi cũ --------- */
{
  store.reset();
  store.setLang('javascript');
  solve('two-sum');
  const html = renderDashboard(JS_DOMAIN);

  const dem = html.match(/class="n">(\d+)<span class="muted small">\/(\d+)</);
  check('[JS] đếm đúng bài vừa giải', dem?.[1] === '1', `nhận ${dem?.[1]}`);
  check('[JS] tổng số bài là số bài của lộ trình thuật toán',
    Number(dem?.[2]) === PROBLEMS.length, `nhận ${dem?.[2]}, mong ${PROBLEMS.length}`);
  check('[JS] không lẫn module Python vào', !html.includes('Cú pháp nền tảng'));
  check('[JS] vẫn có mục "Tiến độ theo chủ đề"', html.includes('Tiến độ theo chủ đề'));
}

/* --------- 3. Không truyền domain thì mặc định vẫn là lộ trình thuật toán --------- */
{
  store.reset();
  store.setLang('javascript');
  const html = renderDashboard();
  check('gọi không tham số -> mặc định lộ trình thuật toán',
    html.includes(`/${PROBLEMS.length}<`), 'không thấy tổng số bài JS');
}

store.reset();

console.log(`Bảng điều khiển: ${passed} kiểm tra đạt${failures.length ? `, ${failures.length} THẤT BẠI` : ''}.`);
if (failures.length) {
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('✓ Tiến độ của lộ trình đang học luôn được phản ánh đúng.');
