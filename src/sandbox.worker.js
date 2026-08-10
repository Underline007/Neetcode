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

/* ---------- Thực thi ---------- */
self.onmessage = (e) => {
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
