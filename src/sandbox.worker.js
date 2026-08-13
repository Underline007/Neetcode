/* eslint-disable no-unused-vars */
/**
 * Worker chạy code của người học trong luồng riêng.
 * - Vòng lặp vô hạn không làm treo UI (luồng chính sẽ terminate worker).
 * - Cung cấp sẵn các cấu trúc dữ liệu quen thuộc: ListNode, TreeNode.
 * - Cung cấp hàm `trace(...)` để người học xem biến biến đổi qua từng bước.
 * - Mỗi test có `logs` và `trace` RIÊNG (không trộn chung), kèm số dòng gây lỗi.
 */

/* ---------- Cấu trúc dữ liệu dùng chung ---------- */
function ListNode(val, next) { this.val = val === undefined ? 0 : val; this.next = next === undefined ? null : next; }
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

function buildList(arr) {
  const head = new ListNode(0);
  let cur = head;
  for (const v of arr || []) { cur.next = new ListNode(v); cur = cur.next; }
  return head.next;
}
function listToArray(node, limit = 10000) {
  const out = [];
  let n = node, guard = 0;
  while (n && guard++ < limit) { out.push(n.val); n = n.next; }
  if (guard >= limit) throw new Error('Danh sách bị lặp vòng (cycle) hoặc quá dài');
  return out;
}
/** Mảng theo kiểu LeetCode: [1,2,3,null,4] -> cây nhị phân */
function buildTree(arr) {
  if (!arr || !arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const q = [root];
  let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift();
    if (i < arr.length) { const v = arr[i++]; if (v !== null) { node.left = new TreeNode(v); q.push(node.left); } }
    if (i < arr.length) { const v = arr[i++]; if (v !== null) { node.right = new TreeNode(v); q.push(node.right); } }
  }
  return root;
}
function treeToArray(root) {
  if (!root) return [];
  const out = [];
  const q = [root];
  while (q.length) {
    const n = q.shift();
    if (!n) { out.push(null); continue; }
    out.push(n.val);
    q.push(n.left, n.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return Math.abs(a - b) < 1e-9;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}

/** So sánh không quan tâm thứ tự (kể cả mảng lồng nhau) */
function sameMultiset(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const norm = (x) => JSON.stringify(Array.isArray(x) ? [...x].sort(cmpAny) : x);
  const A = a.map(norm).sort();
  const B = b.map(norm).sort();
  return A.every((v, i) => v === B[i]);
}
function cmpAny(x, y) { return String(x) < String(y) ? -1 : String(x) > String(y) ? 1 : 0; }

/** Set/Map không JSON hoá được (ra `{}`) — mà người học dùng chúng suốt, nên hiện tường minh. */
function jsonSafe(v) {
  if (v === undefined) return '<undefined>';
  if (v instanceof Set) return `Set{${[...v].join(', ')}}`;
  if (v instanceof Map) return `Map{${[...v].map(([k, val]) => `${k}: ${jsonSafe(val)}`).join(', ')}}`;
  if (typeof v === 'function') return `<hàm ${v.name || 'ẩn danh'}>`;
  if (typeof v === 'bigint') return `${v}n`;
  return v;
}

function preview(value, max = 260) {
  let s;
  try {
    const top = jsonSafe(value);
    // jsonSafe đã tự mô tả thành chuỗi (Set/Map/hàm/undefined) -> dùng thẳng, đừng bọc thêm dấu nháy.
    s = typeof top === 'string' && top !== value ? top : JSON.stringify(top, (k, v) => jsonSafe(v));
  } catch { s = String(value); }
  if (s === undefined) s = String(value);
  return s.length > max ? s.slice(0, max) + ' …' : s;
}

/* ---------- Theo dõi biến: hàm trace() dành cho người học ---------- */
/** Số bước tối đa GHI LẠI cho mỗi test. Vượt quá vẫn chạy tiếp, chỉ ngừng ghi. */
const TRACE_CAP = 200;
let traceRows = [];
let traceCalls = 0;

function traceReset() { traceRows = []; traceCalls = 0; }

/**
 * trace({ i, left, right })          -> ghi lại một bước
 * trace('sau khi dịch', { l, r })    -> kèm nhãn
 * Trả về undefined; chỉ để quan sát, không ảnh hưởng thuật toán.
 */
self.trace = function trace(...args) {
  traceCalls++;
  if (traceRows.length >= TRACE_CAP) return;
  const label = typeof args[0] === 'string' ? args[0] : null;
  const values = label === null ? args[0] : args[1];
  const row = { label, values: {} };
  if (values && typeof values === 'object' && !Array.isArray(values) && !(values instanceof Set) && !(values instanceof Map)) {
    for (const k of Object.keys(values)) row.values[k] = preview(values[k], 60);
  } else if (args.length) {
    row.values = { 'giá trị': preview(values, 60) };
  }
  traceRows.push(row);
};

/* ---------- Số dòng gây lỗi trong code của người học ---------- */
/** Khung `new Function('"use strict";\n' + code + ...)` đẩy mọi dòng xuống 3 (đã đo bằng script). */
const LINE_OFFSET = 3;

function codeLineFromStack(stack, totalLines) {
  if (!stack) return null;
  const s = String(stack);
  const m = s.match(/<anonymous>:(\d+):\d+/) || s.match(/(?:Function|anonymous)[:@](\d+):\d+/);
  if (!m) return null;
  const line = Number(m[1]) - LINE_OFFSET;
  return line >= 1 && line <= totalLines ? line : null;
}

/* ---------- Đo hiệu năng: code của người học vs lời giải tham chiếu ---------- */
/**
 * Cùng một lượt, cùng một máy, cùng dữ liệu -> tỉ lệ thời gian giữa hai bên là con
 * số so sánh được (xem src/perf.js). Đo lặp nhiều lượt rồi lấy lượt NHANH NHẤT:
 * nhiễu từ GC / hệ điều hành chỉ có thể làm chậm đi, không làm nhanh lên.
 */
const BENCH = {
  targetPassMs: 8,      // mỗi lượt đo nên dài cỡ này để đồng hồ đủ độ phân giải
  calibrateMs: 400,     // trần thời gian cho bước dò số lần lặp
  minTotalMs: 140,      // đo đủ thời gian này thì dừng
  hardMs: 1200,         // trần cứng cho một phía (code chậm vẫn phải trả kết quả)
  maxPasses: 60,
  maxInner: 200000,
  maxCloneBytes: 8e6,   // trần bộ nhớ cho các bản sao đầu vào chuẩn bị trước
  secondRoundIfUnderMs: 700,
};

function cloneArgs(a) {
  try { return structuredClone(a); } catch { return JSON.parse(JSON.stringify(a)); }
}

/**
 * Hàm này có sửa thẳng vào đầu vào không (sort tại chỗ, đảo mảng, push...)?
 *
 * Nếu KHÔNG thì mỗi lượt đo chỉ cần một bản sao dùng lại nhiều lần — nhờ vậy số
 * lần lặp không còn bị chặn bởi bộ nhớ, và một lượt đo mới đủ dài để đồng hồ thô
 * của trình duyệt nói được điều gì. Nếu CÓ thì phải sao chép cho từng lần gọi,
 * nếu không lần gọi thứ hai sẽ chạy trên dữ liệu đã bị hỏng.
 * Lượt thử này cũng kiêm luôn việc làm nóng.
 */
function benchMutates(fn, harness, tests) {
  for (const t of tests) {
    const args = cloneArgs(t.args);
    let before;
    try { before = JSON.stringify(args); } catch { return true; }
    try { harness(fn, args, t); } catch { return true; }   // lỗi -> cứ sao chép cho chắc
    try { if (JSON.stringify(args) !== before) return true; } catch { return true; }
  }
  return false;
}

/**
 * Một lượt đo = `inner` lần chạy hết bộ test.
 * Bản sao đầu vào được chuẩn bị TRƯỚC khi bấm đồng hồ: chi phí sao chép không phải
 * lỗi của người học nên không được tính vào thời gian của họ.
 */
function benchPass(fn, harness, tests, inner, reuse) {
  const n = tests.length * inner;
  const argsList = new Array(n);
  const testList = new Array(n);
  let k = 0;
  for (let r = 0; r < inner; r++) {
    for (let i = 0; i < tests.length; i++) {
      argsList[k] = reuse && r > 0 ? argsList[i] : cloneArgs(tests[i].args);
      testList[k] = tests[i];
      k++;
    }
  }
  const t0 = performance.now();
  for (let i = 0; i < n; i++) harness(fn, argsList[i], testList[i]);
  return performance.now() - t0;
}

/**
 * Số lần lặp trong một lượt đo: đủ dài để đo được, đủ nhỏ để không ngốn bộ nhớ.
 *
 * `performance.now()` trong trình duyệt chỉ chính xác tới khoảng 0.1 ms (bị làm
 * thô để chống đo mạch thời gian). Một hàm nhỏ chạy hết 20 µs sẽ đo ra **0 ms** —
 * và 0/0 thì không so được gì. Nên phải tăng dần số lần lặp cho tới khi một lượt
 * đo đủ dài, chứ không thể tính một lần từ phép đo đầu tiên (vốn có thể bằng 0).
 */
function benchInner(fn, harness, tests, bytes, reuse) {
  const cap = reuse
    ? BENCH.maxInner
    : Math.max(1, Math.min(BENCH.maxInner, Math.floor(BENCH.maxCloneBytes / Math.max(bytes, 1))));
  const until = performance.now() + BENCH.calibrateMs;
  let inner = 1;
  let ms = benchPass(fn, harness, tests, inner, reuse);
  while (ms < BENCH.targetPassMs && inner < cap && performance.now() < until) {
    const grow = ms > 0 ? Math.ceil(BENCH.targetPassMs / ms) : 16;
    inner = Math.min(cap, inner * Math.min(Math.max(grow, 2), 64));
    ms = benchPass(fn, harness, tests, inner, reuse);
  }
  return inner;
}

/** Thời gian của MỘT lần chạy hết bộ test (đã chia lại theo `inner`). */
function benchSide(fn, harness, tests, inner, reuse) {
  let best = Infinity;
  let passes = 0;
  const t0 = performance.now();
  while (true) {
    const ms = benchPass(fn, harness, tests, inner, reuse);
    if (ms < best) best = ms;
    passes++;
    const elapsed = performance.now() - t0;
    if (passes >= BENCH.maxPasses || elapsed >= BENCH.hardMs) break;
    if (elapsed >= BENCH.minTotalMs && passes >= 3) break;
  }
  return { ms: best / inner, passMs: +best.toFixed(3), inner, passes };
}

function compileEntry(code, entry) {
  // eslint-disable-next-line no-new-func
  const factory = new Function(`"use strict";\n${code}\n;return typeof ${entry} === "function" ? ${entry} : null;`);
  const fn = factory();
  if (typeof fn !== 'function') throw new Error(`Không tìm thấy hàm "${entry}".`);
  return fn;
}

function runBench({ code, refCode, entry, tests, harnessSrc }) {
  const list = (tests || []).filter((t) => t && !t.scratch);
  if (!list.length) {
    self.postMessage({ ok: false, phase: 'bench', error: 'Không có test nào để đo.' });
    return;
  }

  // Trong lúc đo, print/trace của người học bị vô hiệu hoá: chúng ghi log và dựng
  // bảng theo dõi biến, tức là đo luôn cả chi phí gỡ lỗi thay vì chi phí thuật toán.
  const realLog = console.log;
  const realTrace = self.trace;
  console.log = () => {};
  self.trace = () => {};

  try {
    const ours = compileEntry(code, entry);
    const ref = compileEntry(refCode, entry);
    // eslint-disable-next-line no-eval
    const harness = harnessSrc ? eval(`(${harnessSrc})`) : (f, args) => f(...args);

    let bytes = 0;
    try { bytes = JSON.stringify(list.map((t) => t.args)).length; } catch { bytes = 1024; }

    // Mỗi bên tự dò số lần lặp của mình. Dùng CHUNG một con số sẽ hỏng ở cả hai đầu:
    // lấy số nhỏ (theo bên chậm) thì bên nhanh đo ra 0 ms, lấy số lớn (theo bên nhanh)
    // thì bên chậm chạy hàng chục giây. Kết quả so sánh là thời gian MỘT lượt chạy hết
    // bộ test, đã chia lại theo số lần lặp — nên khác số lần lặp không làm lệch tỉ lệ.
    const reuseOurs = !benchMutates(ours, harness, list);
    const reuseRef = !benchMutates(ref, harness, list);
    const innerOurs = benchInner(ours, harness, list, bytes, reuseOurs);
    const innerRef = benchInner(ref, harness, list, bytes, reuseRef);

    const t0 = performance.now();
    let a = benchSide(ours, harness, list, innerOurs, reuseOurs);
    let b = benchSide(ref, harness, list, innerRef, reuseRef);
    // Đo vòng thứ hai (nếu còn thời gian) để loại bớt ảnh hưởng của thứ tự đo.
    if (performance.now() - t0 < BENCH.secondRoundIfUnderMs) {
      const b2 = benchSide(ref, harness, list, innerRef, reuseRef);
      const a2 = benchSide(ours, harness, list, innerOurs, reuseOurs);
      if (a2.ms < a.ms) a = a2;
      if (b2.ms < b.ms) b = b2;
    }

    self.postMessage({
      ok: true, mode: 'bench',
      ours: { ms: a.ms, passes: a.passes, inner: a.inner },
      ref: { ms: b.ms, passes: b.passes, inner: b.inner },
      ratio: b.ms > 0 ? a.ms / b.ms : null,
      tests: list.length,
      onBigData: list.some((t) => t.perf),
    });
  } catch (err) {
    self.postMessage({ ok: false, phase: 'bench', error: `${err.name || 'Error'}: ${err.message || String(err)}` });
  } finally {
    console.log = realLog;
    self.trace = realTrace;
  }
}

/* ---------- Thực thi ---------- */
self.onmessage = (e) => {
  if (e.data && e.data.mode === 'bench') { runBench(e.data); return; }
  const { code, entry, tests, harnessSrc, checkerSrc } = e.data;
  const totalLines = String(code).split('\n').length;

  // Bộ đệm log được THAY MỚI trước mỗi test -> mỗi test giữ đúng log của riêng nó.
  let logBuf = [];
  const realLog = console.log;
  console.log = (...args) => {
    if (logBuf.length < 40) logBuf.push(args.map((a) => (typeof a === 'string' ? a : preview(a, 160))).join(' '));
  };

  let fn;
  try {
    // eslint-disable-next-line no-new-func
    const factory = new Function(`"use strict";\n${code}\n;return typeof ${entry} === "function" ? ${entry} : null;`);
    fn = factory();
  } catch (err) {
    console.log = realLog;
    self.postMessage({
      ok: false, phase: 'compile', error: `${err.name}: ${err.message}`, logs: logBuf,
      errorLine: codeLineFromStack(err.stack, totalLines),
    });
    return;
  }
  if (typeof fn !== 'function') {
    console.log = realLog;
    self.postMessage({
      ok: false, phase: 'compile',
      error: `Không tìm thấy hàm "${entry}". Hãy giữ nguyên tên hàm trong khung code mẫu.`, logs: logBuf,
    });
    return;
  }
  const setupLogs = logBuf;   // log sinh ra ở cấp cao nhất, trước khi chạy test nào

  let harness;
  let checker;
  try {
    harness = harnessSrc ? eval(`(${harnessSrc})`) : (f, args) => f(...args);
    checker = checkerSrc ? eval(`(${checkerSrc})`) : null;
  } catch (err) {
    console.log = realLog;
    self.postMessage({ ok: false, phase: 'harness', error: String(err), logs: setupLogs });
    return;
  }

  /** Ảnh chụp trace của test vừa chạy, kèm thông tin đã bị cắt bớt bao nhiêu bước. */
  const takeTrace = () => (traceRows.length
    ? { rows: traceRows, total: traceCalls, truncated: traceCalls > traceRows.length }
    : null);

  const results = [];
  const t0 = performance.now();
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    let args;
    try { args = structuredClone(t.args); } catch { args = JSON.parse(JSON.stringify(t.args)); }

    logBuf = [];
    traceReset();

    const start = performance.now();
    try {
      const got = harness(fn, args, t);
      const ms = performance.now() - start;
      // "Chạy thử": người học tự nhập đầu vào, không có đáp án để so -> chỉ hiện kết quả trả về.
      const pass = t.scratch ? true : (checker ? !!checker(got, t.expected, t.args) : deepEqual(got, t.expected));
      results.push({
        i, name: t.name || null, hidden: !!t.hidden, scratch: !!t.scratch, pass, ms: +ms.toFixed(2),
        args: t.hidden ? null : preview(t.args),
        expected: t.hidden || t.scratch ? null : preview(t.expected),
        got: t.hidden ? null : preview(got),
        logs: logBuf, trace: takeTrace(),
      });
    } catch (err) {
      results.push({
        i, name: t.name || null, hidden: !!t.hidden, scratch: !!t.scratch, pass: false,
        ms: +(performance.now() - start).toFixed(2),
        args: t.hidden ? null : preview(t.args),
        expected: t.hidden || t.scratch ? null : preview(t.expected),
        got: null, error: `${err.name}: ${err.message}`,
        errorLine: codeLineFromStack(err.stack, totalLines),
        logs: logBuf, trace: takeTrace(),
      });
    }
  }
  console.log = realLog;
  self.postMessage({ ok: true, results, totalMs: +(performance.now() - t0).toFixed(2), logs: setupLogs });
};
