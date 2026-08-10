/**
 * Kiểm thử tích hợp kịch bản "một người, nhiều máy".
 *
 * Chạy CODE THẬT của cả hai phía — src/store.js + src/sync.js ở client và
 * worker/src/index.js ở máy chủ — chỉ giả lập localStorage, window và mạng.
 * Nhờ vậy nó bắt được những lỗi mà test đơn lẻ bỏ sót: sai thứ tự tải/gộp/đẩy,
 * quên cập nhật version, xử lý 409 sai.
 *
 *   node tools/test-sync-e2e.mjs
 */
import worker from '../worker/src/index.js';

/* ----------------------- giả lập môi trường trình duyệt ----------------------- */
const storage = new Map();
globalThis.localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
};
globalThis.window = new EventTarget();

/* --------------------- giả lập mạng: trỏ thẳng vào Worker --------------------- */
const kv = new Map();
const env = {
  PROGRESS: {
    async get(key, opts) {
      const raw = kv.get(key);
      if (raw === undefined) return null;
      return opts?.type === 'json' ? JSON.parse(raw) : raw;
    },
    async put(key, value) { kv.set(key, value); },
  },
};

let requestCount = 0;
globalThis.fetch = async (url, init) => {
  requestCount++;
  return worker.fetch(new Request(url, init), env);
};

const realLog = console.log;
console.log = () => {};   // im lặng log có cấu trúc của Worker

const { store } = await import('../src/store.js');
const { syncNow } = await import('../src/sync.js');

/* ------------------------------- tiện ích test ------------------------------- */
let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) { passed++; return; }
  failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

/** Giả lập "chuyển sang máy khác": xoá sạch tiến độ, giữ cấu hình đồng bộ. */
function switchMachine() {
  store.reset();
  store.sync.set({ version: 0 });   // máy mới chưa từng đọc bản nào
}

/** Ghi nhận đã giải xong một bài, giống hệt luồng chấm điểm thật. */
function solve(id, points) {
  const rec = store.problem(id);
  rec.solved = true;
  rec.best = points;
  rec.attempts += 1;
  rec.lastRun = Date.now();
  rec.code = `// loi giai cua ${id}`;
  store.addXp(points, { type: 'problem', ref: id });
}

const solvedIds = () => Object.entries(store.get().problems).filter(([, r]) => r.solved).map(([id]) => id).sort();

/* ------------------------------ kịch bản chính ------------------------------ */
store.sync.set({ url: 'https://sync.test', code: 'may-tinh-cua-toi-2026', auto: false });

// --- Máy A: giải hai bài rồi đồng bộ lần đầu (máy chủ đang trống) ---
solve('two-sum', 100);
solve('valid-anagram', 90);
const first = await syncNow();
check('lần đồng bộ đầu không nhận gì từ máy chủ', first.summary.newSolved === 0, JSON.stringify(first.summary));
check('máy chủ nhận version 1', store.sync.get().version === 1, `nhận ${store.sync.get().version}`);
const xpA = store.get().xp;

// --- Chuyển sang máy B: chưa có gì, giải một bài khác ---
switchMachine();
check('máy mới bắt đầu từ con số 0', solvedIds().length === 0);
solve('group-anagrams', 150);

const second = await syncNow();
check('máy B nhận được 2 bài từ máy A', second.summary.newSolved === 2, JSON.stringify(second.summary));
check('máy B có đủ cả 3 bài', solvedIds().join(',') === 'group-anagrams,two-sum,valid-anagram', solvedIds().join(','));
check('điểm cộng gộp từ cả hai máy', store.get().xp === xpA + 150, `nhận ${store.get().xp}, mong đợi ${xpA + 150}`);
check('code đã gõ đi theo tiến độ', store.get().problems['two-sum'].code === '// loi giai cua two-sum');

// --- Quay lại máy A (giả lập bằng một máy trắng): phải kéo về đủ 3 bài ---
switchMachine();
const third = await syncNow();
check('máy trắng kéo về đủ 3 bài', solvedIds().length === 3, solvedIds().join(','));
check('điểm khớp với tổng hai máy', store.get().xp === xpA + 150, `nhận ${store.get().xp}`);
check('tóm tắt báo đúng 3 bài mới', third.summary.newSolved === 3, JSON.stringify(third.summary));

// --- Đồng bộ lại khi không có gì mới: không được đổi gì ---
const before = JSON.stringify(store.get());
const idle = await syncNow();
check('đồng bộ không có thay đổi -> không nhận thêm gì', idle.summary.newSolved === 0);
check('đồng bộ lặp lại không làm hỏng dữ liệu', JSON.stringify(store.get().problems) === JSON.stringify(JSON.parse(before).problems));

/* --------------- xung đột: máy khác ghi trong lúc ta đang thao tác --------------- */
{
  const code = store.sync.get().code;

  /** Máy C ghi thẳng vào Worker (không qua fetch giả nên không tính vào requestCount). */
  async function writeFromMachineC() {
    const doc = JSON.parse(kv.get(code));
    const fromC = JSON.parse(JSON.stringify(doc.state));
    fromC.problems['best-time-to-buy'] = {
      best: 120, attempts: 1, solved: true, hintsUsed: 0, revealed: false,
      firstTry: true, code: '// tu may C', lastRun: Date.now(),
      srs: { due: null, interval: 0, ease: 2.5, reps: 0 },
    };
    fromC.xp = doc.state.xp + 120;
    fromC.log = [{ at: Date.now(), type: 'problem', ref: 'best-time-to-buy', points: 120 }, ...doc.state.log];
    const res = await worker.fetch(new Request(`https://sync.test/p/${code}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ baseVersion: doc.version, state: fromC }),
    }), env);
    check('máy C ghi thành công', res.status === 200, `nhận ${res.status}`);
  }

  // Chen máy C vào ĐÚNG khoảng giữa: ta đã đọc xong nhưng chưa kịp ghi. Đây là
  // tình huống duy nhất sinh ra 409 thật, vì syncNow luôn đọc version mới trước khi ghi.
  const versionBefore = store.sync.get().version;
  const passThrough = globalThis.fetch;
  let injected = false;
  globalThis.fetch = async (url, init) => {
    if (!injected && init?.method === 'PUT') {
      injected = true;
      await writeFromMachineC();
    }
    return passThrough(url, init);
  };

  solve('contains-duplicate', 80);

  const requestsBefore = requestCount;
  const merged = await syncNow();
  globalThis.fetch = passThrough;

  check('máy C đã thật sự chen vào giữa', injected);
  check('xung đột được xử lý, không ném lỗi', merged.version > versionBefore, `version ${merged.version}`);
  check('409 khiến client gộp rồi ghi lại (3 lượt gọi)', requestCount - requestsBefore === 3, `${requestCount - requestsBefore} request`);
  check('giữ được bài của máy C', store.get().problems['best-time-to-buy']?.solved === true);
  check('giữ được bài ta vừa giải', store.get().problems['contains-duplicate']?.solved === true);
  check('tổng cộng 5 bài sau khi gộp xung đột', solvedIds().length === 5, solvedIds().join(','));

  // Bản trên máy chủ phải phản ánh đúng kết quả gộp.
  const finalDoc = JSON.parse(kv.get(code));
  check('máy chủ lưu đủ 5 bài', Object.values(finalDoc.state.problems).filter((p) => p.solved).length === 5);
  check('máy chủ giữ code của máy C', finalDoc.state.problems['best-time-to-buy'].code === '// tu may C');
}

/* --------------------------- mạng hỏng thì không mất gì --------------------------- */
{
  const snapshotBefore = JSON.stringify(store.get());
  globalThis.fetch = async () => { throw new Error('mat mang'); };
  let threw = false;
  try { await syncNow(); } catch { threw = true; }
  check('mất mạng -> báo lỗi ra ngoài', threw);
  check('mất mạng -> tiến độ trên máy còn nguyên', JSON.stringify(store.get()) === snapshotBefore);
}

/* --------------------------------- kết quả --------------------------------- */
console.log = realLog;
console.log(`Đồng bộ đa máy (đầu-cuối): ${passed} kiểm tra đạt${failures.length ? `, ${failures.length} THẤT BẠI` : ''}.`);
if (failures.length) {
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('✓ Chuyển máy, gộp hai chiều, xung đột và mất mạng đều không làm mất tiến độ.');
