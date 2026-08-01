/* eslint-disable no-unused-vars */
/**
 * Worker chạy code của người học trong luồng riêng.
 * - Vòng lặp vô hạn không làm treo UI (luồng chính sẽ terminate worker).
 * - Cung cấp sẵn các cấu trúc dữ liệu quen thuộc: ListNode, TreeNode.
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

function preview(value, max = 260) {
  let s;
  try {
    s = JSON.stringify(value, (k, v) => (v === undefined ? '<undefined>' : v));
  } catch { s = String(value); }
  if (s === undefined) s = String(value);
  return s.length > max ? s.slice(0, max) + ' …' : s;
}

/* ---------- Thực thi ---------- */
self.onmessage = (e) => {
  const { code, entry, tests, harnessSrc, checkerSrc } = e.data;
  const logs = [];
  const realLog = console.log;
  console.log = (...args) => {
    if (logs.length < 60) logs.push(args.map((a) => (typeof a === 'string' ? a : preview(a, 160))).join(' '));
  };

  let fn;
  try {
    // eslint-disable-next-line no-new-func
    const factory = new Function(`"use strict";\n${code}\n;return typeof ${entry} === "function" ? ${entry} : null;`);
    fn = factory();
  } catch (err) {
    self.postMessage({ ok: false, phase: 'compile', error: `${err.name}: ${err.message}`, logs });
    return;
  }
  if (typeof fn !== 'function') {
    self.postMessage({
      ok: false, phase: 'compile',
      error: `Không tìm thấy hàm "${entry}". Hãy giữ nguyên tên hàm trong khung code mẫu.`, logs,
    });
    return;
  }

  let harness;
  let checker;
  try {
    harness = harnessSrc ? eval(`(${harnessSrc})`) : (f, args) => f(...args);
    checker = checkerSrc ? eval(`(${checkerSrc})`) : null;
  } catch (err) {
    self.postMessage({ ok: false, phase: 'harness', error: String(err), logs });
    return;
  }

  const results = [];
  const t0 = performance.now();
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    let args;
    try { args = structuredClone(t.args); } catch { args = JSON.parse(JSON.stringify(t.args)); }
    const start = performance.now();
    try {
      const got = harness(fn, args, t);
      const ms = performance.now() - start;
      const pass = checker ? !!checker(got, t.expected, t.args) : deepEqual(got, t.expected);
      results.push({
        i, name: t.name || null, hidden: !!t.hidden, pass, ms: +ms.toFixed(2),
        args: t.hidden ? null : preview(t.args),
        expected: t.hidden ? null : preview(t.expected),
        got: t.hidden ? null : preview(got),
      });
    } catch (err) {
      results.push({
        i, name: t.name || null, hidden: !!t.hidden, pass: false, ms: +(performance.now() - start).toFixed(2),
        args: t.hidden ? null : preview(t.args),
        expected: t.hidden ? null : preview(t.expected),
        got: null, error: `${err.name}: ${err.message}`,
      });
    }
  }
  console.log = realLog;
  self.postMessage({ ok: true, results, totalMs: +(performance.now() - t0).toFixed(2), logs });
};
