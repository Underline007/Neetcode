/**
 * Kiểm chứng dữ liệu bài tập: chạy TOÀN BỘ lời giải mẫu qua TOÀN BỘ test case.
 * Dùng đúng cơ chế harness/checker như worker trong trình duyệt.
 *
 *   node tools/verify.mjs
 */
import { TOPICS, PROBLEMS, buildTests } from '../src/data/index.js';

/* ---- các cấu trúc dữ liệu giống hệt sandbox.worker.js ---- */
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
  if (guard >= limit) throw new Error('cycle');
  return out;
}
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
    return a.every((x, i) => deepEqual(x, b[i]));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    return ka.length === kb.length && ka.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}

Object.assign(globalThis, { ListNode, TreeNode, buildList, listToArray, buildTree, treeToArray, deepEqual });

/* ---- chạy kiểm chứng ---- */
let failures = 0;
let totalTests = 0;
const ids = new Set();

for (const p of PROBLEMS) {
  if (ids.has(p.id)) { console.error(`❌ TRÙNG ID: ${p.id}`); failures++; }
  ids.add(p.id);

  for (const field of ['statement', 'starter', 'solution', 'solutionPy', 'approach', 'realWorld']) {
    if (!p[field]) { console.error(`❌ ${p.id}: thiếu trường "${field}"`); failures++; }
  }
  if (!p.hints || p.hints.length < 3) { console.error(`❌ ${p.id}: cần ít nhất 3 gợi ý`); failures++; }
  if (!p.complexity || typeof p.complexity.answer !== 'number') {
    console.error(`❌ ${p.id}: thiếu câu hỏi độ phức tạp`); failures++;
  }
  if (!p.starter.includes(p.entry)) {
    console.error(`❌ ${p.id}: code mẫu không chứa tên hàm "${p.entry}"`); failures++;
  }

  let fn;
  try {
    fn = new Function(`${p.solution}\n;return typeof ${p.entry} === "function" ? ${p.entry} : null;`)();
  } catch (err) {
    console.error(`❌ ${p.id}: lời giải không biên dịch được — ${err.message}`);
    failures++;
    continue;
  }
  if (!fn) { console.error(`❌ ${p.id}: lời giải không định nghĩa "${p.entry}"`); failures++; continue; }

  const harness = p.harnessSrc ? eval(`(${p.harnessSrc})`) : (f, args) => f(...args);
  const checker = p.checkerSrc ? eval(`(${p.checkerSrc})`) : null;

  for (const t of buildTests(p)) {
    totalTests++;
    const args = structuredClone(t.args);
    try {
      const got = harness(fn, args, t);
      const ok = checker ? !!checker(got, t.expected, t.args) : deepEqual(got, t.expected);
      if (!ok) {
        console.error(`❌ ${p.id} / "${t.name}"\n   nhận : ${JSON.stringify(got)}\n   mong : ${JSON.stringify(t.expected)}`);
        failures++;
      }
    } catch (err) {
      console.error(`❌ ${p.id} / "${t.name}" — lỗi chạy: ${err.message}`);
      failures++;
    }
  }
}

/* ---- kiểm tra dữ liệu chủ đề & lộ trình ---- */
for (const t of TOPICS) {
  if (!t.lesson || t.lesson.length < 500) { console.error(`❌ topic ${t.id}: bài giảng quá ngắn`); failures++; }
  if (!t.quiz || t.quiz.length < 3) { console.error(`❌ topic ${t.id}: cần ít nhất 3 câu quiz`); failures++; }
  for (const q of t.quiz || []) {
    if (!q.options || q.options.length < 2) { console.error(`❌ topic ${t.id}: quiz thiếu lựa chọn`); failures++; }
    if (q.answer == null || q.answer < 0 || q.answer >= q.options.length) {
      console.error(`❌ topic ${t.id}: đáp án quiz không hợp lệ`); failures++;
    }
    if (!q.why) { console.error(`❌ topic ${t.id}: quiz thiếu giải thích`); failures++; }
  }
}

const { PLAN } = await import('../src/data/index.js');
const planProblems = new Set();
for (const d of PLAN) {
  for (const pid of d.problems) {
    if (!PROBLEMS.find((p) => p.id === pid)) { console.error(`❌ Ngày ${d.day}: không tìm thấy bài "${pid}"`); failures++; }
    planProblems.add(pid);
  }
  for (const tid of d.topics) {
    if (!TOPICS.find((t) => t.id === tid)) { console.error(`❌ Ngày ${d.day}: không tìm thấy chủ đề "${tid}"`); failures++; }
  }
  if (d.quiz && !TOPICS.find((t) => t.id === d.quiz)) { console.error(`❌ Ngày ${d.day}: quiz "${d.quiz}" không tồn tại`); failures++; }
}
for (const p of PROBLEMS) {
  if (!planProblems.has(p.id)) { console.error(`❌ Bài "${p.id}" không được xếp vào ngày nào trong lộ trình`); failures++; }
}

console.log('');
console.log(`Chủ đề : ${TOPICS.length}`);
console.log(`Bài tập: ${PROBLEMS.length}`);
console.log(`Test   : ${totalTests}`);
console.log(failures === 0 ? '✅ TẤT CẢ ĐỀU ĐẠT' : `❌ ${failures} lỗi`);
process.exit(failures === 0 ? 0 : 1);
