/**
 * Đồng bộ tiến độ giữa nhiều máy qua một Cloudflare Worker + KV (xem thư mục worker/).
 *
 * Nguyên tắc: máy chủ chỉ là HỘP THƯ, không hiểu dữ liệu và không tự gộp. Mọi
 * việc gộp đều làm ở client bằng sync-merge.js, nên dù hai máy cùng học lệch
 * nhau thì không bên nào mất tiến độ:
 *
 *   1. TẢI VỀ bản trên máy chủ
 *   2. GỘP vào bản đang có ở máy này
 *   3. ĐẨY LÊN bản đã gộp, kèm số version đã đọc ở bước 1
 *
 * Nếu trong lúc đó có máy khác vừa đẩy lên, máy chủ trả 409 kèm bản mới nhất —
 * ta gộp tiếp rồi thử lại đúng một lần. Đây là khoá lạc quan (optimistic
 * concurrency), đủ chắc cho tình huống một người dùng vài máy.
 */
import { store } from './store.js';

const TIMEOUT_MS = 15000;
const AUTO_PUSH_DELAY_MS = 8000;

/** Mã đồng bộ hợp lệ: đủ dài để không thể đoán, chỉ dùng ký tự an toàn cho URL. */
export const CODE_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

/** Sinh mã đồng bộ ngẫu nhiên bằng nguồn ngẫu nhiên mật mã (không dùng Math.random). */
export function generateCode() {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join('');
}

export function isConfigured() {
  const { url, code } = store.sync.get();
  return Boolean(url && CODE_PATTERN.test(code));
}

function endpoint() {
  const { url, code } = store.sync.get();
  return `${url.replace(/\/+$/, '')}/p/${encodeURIComponent(code)}`;
}

async function request(method, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(endpoint(), {
      method,
      signal: controller.signal,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Đọc bản trên máy chủ. Trả về null nếu chưa có gì (mã đồng bộ mới tinh). */
async function pullDoc() {
  const res = await request('GET');
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await describeError(res));
  return res.json();
}

async function describeError(res) {
  let detail = '';
  try {
    const data = await res.json();
    detail = data?.error || '';
  } catch { /* body không phải JSON */ }
  if (res.status === 400) return detail || 'Mã đồng bộ không hợp lệ.';
  if (res.status === 413) return 'Dữ liệu quá lớn so với giới hạn của máy chủ.';
  return detail || `Máy chủ trả lỗi ${res.status}.`;
}

/**
 * Chạy trọn một vòng đồng bộ: tải về -> gộp -> đẩy lên.
 * @returns {Promise<{ summary: object, version: number }>}
 */
export async function syncNow() {
  if (!isConfigured()) throw new Error('Chưa cấu hình đồng bộ.');

  const remote = await pullDoc();
  let summary = { newProblems: 0, newSolved: 0, xpGained: 0 };
  if (remote?.state) summary = store.mergeRemote(remote.state);

  let baseVersion = remote?.version ?? 0;
  // Mốc để biết người dùng có sửa gì thêm TRONG lúc gọi mạng hay không.
  let pushedUpdatedAt = store.get().updatedAt;
  let res = await request('PUT', { baseVersion, state: store.snapshot() });

  // Máy khác vừa đẩy lên trong lúc ta đang gộp -> gộp thêm bản của họ rồi thử lại.
  if (res.status === 409) {
    const current = await res.json();
    if (current?.state) {
      const extra = store.mergeRemote(current.state);
      summary = {
        newProblems: summary.newProblems + extra.newProblems,
        newSolved: summary.newSolved + extra.newSolved,
        xpGained: summary.xpGained + extra.xpGained,
      };
    }
    baseVersion = current?.version ?? baseVersion;
    pushedUpdatedAt = store.get().updatedAt;
    res = await request('PUT', { baseVersion, state: store.snapshot() });
  }

  if (!res.ok) throw new Error(await describeError(res));

  const saved = await res.json();
  store.sync.set({ version: saved.version, lastAt: Date.now() });
  return { summary, version: saved.version, pushedAt: pushedUpdatedAt };
}

/* ------------------------- đồng bộ tự động ------------------------- */

let running = false;
let pending = null;
let lastError = null;
/** Tiến độ đổi ngay TRONG lúc đang đồng bộ -> phải đẩy thêm một lần nữa sau khi xong. */
let missedChange = false;

/** Trạng thái hiện thời để giao diện hiển thị, không ném lỗi. */
export function syncStatus() {
  const cfg = store.sync.get();
  return { configured: isConfigured(), running, lastAt: cfg.lastAt, lastError, auto: cfg.auto !== false };
}

/** Chạy đồng bộ và nuốt lỗi (dùng cho các lần tự động chạy nền). */
async function runQuietly() {
  if (running || !isConfigured()) return null;
  running = true;
  notify();
  try {
    const result = await syncNow();
    lastError = null;
    // Người dùng làm thêm bài trong lúc chờ mạng -> phần đó chưa nằm trong bản
    // vừa đẩy, hẹn một lượt nữa. (So theo mốc thời gian nên KHÔNG bị nhầm với
    // thay đổi do chính lần gộp vừa rồi tạo ra.)
    if (store.get().updatedAt > result.pushedAt) missedChange = true;
    if (result.summary.newSolved || result.summary.xpGained || result.summary.newProblems) {
      window.dispatchEvent(new CustomEvent('sync-applied', { detail: result.summary }));
    }
    return result;
  } catch (err) {
    // Mất mạng hay Worker chưa bật không nên làm hỏng trải nghiệm học.
    lastError = err?.message || String(err);
    return null;
  } finally {
    running = false;
    notify();
    if (missedChange) {
      missedChange = false;
      scheduleAutoPush();
    }
  }
}

function notify() {
  window.dispatchEvent(new CustomEvent('sync-status'));
}

function scheduleAutoPush() {
  const cfg = store.sync.get();
  if (!isConfigured() || cfg.auto === false || running) return;
  clearTimeout(pending);
  pending = setTimeout(() => {
    pending = null;
    void runQuietly();
  }, AUTO_PUSH_DELAY_MS);
}

/**
 * Bật đồng bộ nền: kéo về khi mở app / khi quay lại tab, và đẩy lên sau mỗi
 * đợt thay đổi (gộp nhiều thay đổi liên tiếp thành một lần gọi mạng).
 */
export function startAutoSync() {
  if (typeof window === 'undefined') return;

  void runQuietly();

  // Tiến độ vừa đổi -> hẹn giờ đẩy lên. Trong lúc đang đồng bộ thì bỏ qua: sự
  // kiện lúc đó phần lớn đến từ chính lần gộp, còn thay đổi thật của người dùng
  // đã được runQuietly phát hiện bằng mốc updatedAt.
  window.addEventListener('progress-changed', () => {
    if (running) return;
    scheduleAutoPush();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Quay lại tab sau khi học ở máy khác -> kéo bản mới về ngay.
      void runQuietly();
    } else if (pending) {
      // Rời tab khi còn thay đổi chưa kịp gửi -> gửi luôn, đừng đợi hết debounce.
      clearTimeout(pending);
      pending = null;
      void runQuietly();
    }
  });
}

/** Chạy đồng bộ theo yêu cầu người dùng (có ném lỗi để hiển thị). */
export async function syncManually() {
  running = true;
  notify();
  try {
    const result = await syncNow();
    lastError = null;
    return result;
  } catch (err) {
    lastError = err?.message || String(err);
    throw err;
  } finally {
    running = false;
    notify();
  }
}
