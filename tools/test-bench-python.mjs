/**
 * Kiểm chứng phần ĐO HIỆU NĂNG của worker Python (src/sandbox.worker.py.js).
 *
 * Trong trình duyệt, code Python chạy bằng Pyodide; ở đây chạy bằng CPython trên
 * máy — cùng một đoạn mã driver, nên logic đo (chọn số lần lặp, lấy lượt nhanh
 * nhất, sao chép đầu vào, vô hiệu hoá print/trace lúc đo) được kiểm tra thật.
 * Chuỗi DRIVER_SRC được lấy ra rồi cho JS "đọc" đúng như worker đọc, để mọi ký
 * tự escape (\\n, \\") giống hệt bản chạy thật.
 *
 *   node tools/test-bench-python.mjs
 */
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { PY_PROBLEMS } from '../src/data/python/index.js';
import { PROBLEMS, buildTests } from '../src/data/index.js';
import { benchTests, measureTests, perfTier } from '../src/perf.js';

const PY_BIN = process.env.PYTHON || 'python';

let passed = 0;
const failures = [];
const check = (name, ok, detail = '') => {
  if (ok) { passed++; return; }
  failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

/* ---------- lấy driver Python ra khỏi worker ---------- */
function readDriver() {
  const src = readFileSync(new URL('../src/sandbox.worker.py.js', import.meta.url), 'utf8');
  const m = src.match(/const DRIVER_SRC = `([\s\S]*?)`;/);
  if (!m) throw new Error('Không tìm thấy DRIVER_SRC trong src/sandbox.worker.py.js');
  // Đọc như một template literal để JS xử lý escape đúng như lúc worker chạy.
  // eslint-disable-next-line no-new-func
  return new Function('return `' + m[1] + '`;')();
}

function runCases(cases) {
  return new Promise((resolve, reject) => {
    const py = spawn(PY_BIN, ['tools/bench_python_check.py'], {
      stdio: ['pipe', 'pipe', 'inherit'],
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });
    let out = '';
    py.stdout.on('data', (d) => { out += d; });
    py.on('error', (err) => reject(new Error(`Không chạy được "${PY_BIN}": ${err.message}`)));
    py.on('close', (code) => {
      if (code !== 0) return reject(new Error(`bench_python_check.py thoát với mã ${code}`));
      try { resolve(JSON.parse(out)); } catch { reject(new Error(`Không đọc được kết quả:\n${out.slice(0, 400)}`)); }
    });
    py.stdin.end(JSON.stringify({ driver: readDriver(), cases }));
  });
}

/* ---------- các ca kiểm thử ---------- */
const FAST = `def has_dup(a):\n    seen = set()\n    for x in a:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n`;
const SLOW = `def has_dup(a):\n    for i in range(len(a)):\n        for j in range(i + 1, len(a)):\n            if a[i] == a[j]:\n                return True\n    return False\n`;
const DUP_TESTS = [{ name: 'n=600 không trùng', args: [Array.from({ length: 600 }, (_, i) => i)] }];

const plain = PY_PROBLEMS.find((p) => p.id === 'py-drill-count-vowels') || PY_PROBLEMS[0];
const withHarness = PY_PROBLEMS.find((p) => p.id === 'py-drill-rectangle-class')
  || PY_PROBLEMS.find((p) => p.harnessSrc);

const cases = [
  { name: 'chậm vs nhanh', code: SLOW, refCode: FAST, entry: 'has_dup', tests: DUP_TESTS },
  { name: 'cùng một code', code: FAST, refCode: FAST, entry: 'has_dup', tests: DUP_TESTS },
  { name: 'nhanh hơn tham chiếu', code: FAST, refCode: SLOW, entry: 'has_dup', tests: DUP_TESTS },
  {
    name: 'sửa thẳng vào tham số',
    // list.sort() sửa tại chỗ: nếu lượt sau nhận lại đúng list đã sắp xếp thì hàm báo lỗi
    code: `def sort_once(a):\n    if a == sorted(a):\n        raise Exception('dau vao bi dung lai')\n    a.sort()\n    return a[0]\n`,
    refCode: `def sort_once(a):\n    if a == sorted(a):\n        raise Exception('dau vao bi dung lai')\n    a.sort()\n    return a[0]\n`,
    entry: 'sort_once',
    tests: [{ name: 'giảm dần', args: [[5, 4, 3, 2, 1]] }],
  },
  {
    name: 'print() lúc đo',
    code: `def noisy(n):\n    print('dong nay khong duoc lam cham phep do')\n    return n * 2\n`,
    refCode: `def noisy(n):\n    return n * 2\n`,
    entry: 'noisy',
    tests: [{ name: 'in log', args: [21] }],
  },
  {
    name: 'bài thật (hàm)',
    code: plain.solution, refCode: plain.solution, entry: plain.entry,
    tests: benchTests(plain.tests), harnessSrc: plain.harnessSrc || null,
  },
  {
    name: 'bài thật (lớp + harness)',
    code: withHarness.solution, refCode: withHarness.solution, entry: withHarness.entry,
    tests: benchTests(withHarness.tests), harnessSrc: withHarness.harnessSrc || null,
  },
  { name: 'không tìm thấy hàm', code: FAST, refCode: FAST, entry: 'khong_co', tests: DUP_TESTS },
];

/* Dữ liệu lớn để đo (src/data/perf-bench.js) phải chạy được cả ở chế độ Python:
   người học Python vẫn làm các bài thuật toán, và lời giải mẫu Python chậm hơn
   JavaScript hàng chục lần nên kích thước dữ liệu phải vừa với nó. */
const bigData = PROBLEMS.filter((p) => p.perfBench?.length);
for (const p of bigData) {
  cases.push({
    name: `dữ liệu lớn: ${p.id}`,
    code: p.solutionPy, refCode: p.solutionPy, entry: p.entry,
    tests: measureTests(p, buildTests(p)),
    harnessSrc: p.harnessSrcPy || p.harnessSrc || null,
  });
}

const results = new Map((await runCases(cases)).map((r) => [r.name, r.result]));
const get = (name) => results.get(name) || {};

{
  const r = get('chậm vs nhanh');
  check('đo được', r.ok === true, JSON.stringify(r).slice(0, 200));
  check('thời gian hai bên đều > 0', r.ours?.ms > 0 && r.ref?.ms > 0, JSON.stringify(r.ours));
  check('O(n²) bị phát hiện là chậm hơn nhiều lần', r.ratio > 10, `tỉ lệ ${r.ratio?.toFixed(1)}×`);
  check('bậc hiệu năng: mất thưởng', perfTier(r.ratio).credit === 0, perfTier(r.ratio).key);
  check('số lượt chạy được báo lại để người học biết phép đo dày cỡ nào',
    r.ours?.inner >= 1 && r.ours?.passes >= 1, JSON.stringify(r.ours));
}
{
  const r = get('cùng một code');
  check('cùng một code ở hai phía -> tỉ lệ ~1×', r.ratio > 0.6 && r.ratio < 1.7, `tỉ lệ ${r.ratio?.toFixed(2)}×`);
  check('cùng một code -> nhận đủ thưởng', perfTier(r.ratio).credit === 1, perfTier(r.ratio).key);
}
{
  const r = get('nhanh hơn tham chiếu');
  check('code nhanh hơn lời giải mẫu -> tỉ lệ < 1', r.ratio < 0.3, `tỉ lệ ${r.ratio}`);
  check('bậc "nhanh hơn tham chiếu"', perfTier(r.ratio).key === 'faster');
}
{
  check('sửa thẳng vào tham số vẫn đo được (đầu vào luôn là bản sao mới)',
    get('sửa thẳng vào tham số').ok === true, get('sửa thẳng vào tham số').error);
}
{
  const r = get('print() lúc đo');
  check('code có print() vẫn đo được', r.ok === true, r.error);
  // print() bị vô hiệu hoá lúc đo nên không được biến thành gánh nặng thời gian.
  check('print() không làm phép đo lệch hẳn', r.ratio < 6, `tỉ lệ ${r.ratio?.toFixed(2)}×`);
}
{
  const r = get('bài thật (hàm)');
  check(`đo được lời giải mẫu của ${plain.id}`, r.ok === true, r.error);
  check('lời giải mẫu so với chính nó -> ~1×', r.ratio > 0.5 && r.ratio < 2, `tỉ lệ ${r.ratio?.toFixed(2)}×`);
}
{
  const r = get('bài thật (lớp + harness)');
  check(`bài dùng harness riêng vẫn đo được (${withHarness.id})`, r.ok === true, r.error);
}
{
  const r = get('không tìm thấy hàm');
  check('không tìm thấy hàm -> báo lỗi thay vì treo', r.ok === false && r.phase === 'bench', JSON.stringify(r));
}
{
  check('có bài được gắn dữ liệu lớn để đo', bigData.length >= 10, `mới có ${bigData.length} bài`);
  for (const p of bigData) {
    const r = get(`dữ liệu lớn: ${p.id}`);
    if (r.ok !== true) {
      check(`[${p.id}] lời giải mẫu Python chạy được trên dữ liệu lớn`, false, r.error);
      continue;
    }
    // CPython trên máy nhanh hơn Pyodide trong trình duyệt vài lần -> để ngưỡng chặt
    // hơn hẳn mức chấp nhận được, tránh việc chỉ máy dev mới chạy nổi.
    check(`[${p.id}] lời giải mẫu Python vẫn nhanh (${r.ref.ms.toFixed(2)} ms)`, r.ref.ms < 25, `${r.ref.ms} ms`);
    check(`[${p.id}] so với chính nó ra ~1×`, r.ratio > 0.5 && r.ratio < 2, `tỉ lệ ${r.ratio?.toFixed(2)}×`);
  }
}

console.log(`Đo hiệu năng (Python): ${passed} kiểm tra đạt${failures.length ? `, ${failures.length} THẤT BẠI` : ''}.`);
if (failures.length) {
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('✓ Driver Python đo đúng và không thiên vị bên nào.');
