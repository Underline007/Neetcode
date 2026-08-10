/**
 * Hộp thư đồng bộ tiến độ NeetCode 30.
 *
 * Worker này CỐ TÌNH ngu ngốc: nó không hiểu dữ liệu học tập, không gộp, không
 * tính điểm. Nó chỉ giữ một khối JSON theo "mã đồng bộ" và đánh số version để
 * hai máy không ghi đè lên nhau. Toàn bộ logic gộp nằm ở client (src/sync-merge.js).
 *
 *   GET  /p/:code  -> 200 { version, updatedAt, state } | 404 nếu chưa có gì
 *   PUT  /p/:code  -> 200 { version, updatedAt }
 *                     409 { version, updatedAt, state } nếu baseVersion đã cũ
 *
 * Mã đồng bộ chính là mật khẩu: ai biết mã thì đọc và ghi được dữ liệu của mã đó.
 * Vì vậy mã bắt buộc dài tối thiểu 16 ký tự (client sinh 24 ký tự ngẫu nhiên
 * bằng crypto.getRandomValues, tương đương ~120 bit).
 */

const CODE_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB: đủ cho cả code người học đã gõ ở mọi bài

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, PUT, OPTIONS',
  'access-control-allow-headers': 'content-type',
  'access-control-max-age': '86400',
};

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...CORS, ...extraHeaders },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    const url = new URL(request.url);
    const match = url.pathname.match(/^\/p\/([^/]+)$/);
    if (!match) return json({ error: 'Không có endpoint này.' }, 404);

    const code = decodeURIComponent(match[1]);
    if (!CODE_PATTERN.test(code)) {
      return json({ error: 'Mã đồng bộ phải dài 16–64 ký tự, chỉ gồm chữ, số, gạch ngang hoặc gạch dưới.' }, 400);
    }

    try {
      if (request.method === 'GET') return await handleGet(env, code);
      if (request.method === 'PUT') return await handlePut(request, env, code);
      return json({ error: 'Phương thức không được hỗ trợ.' }, 405);
    } catch (err) {
      // Không dùng passThroughOnException: lỗi phải hiện ra ở log và trả về có cấu trúc.
      console.error(JSON.stringify({ msg: 'sync_failed', method: request.method, error: String(err?.stack || err) }));
      return json({ error: 'Máy chủ đồng bộ gặp sự cố.' }, 500);
    }
  },
};

async function handleGet(env, code) {
  const stored = await env.PROGRESS.get(code, { type: 'json' });
  if (!stored) return json({ error: 'Chưa có dữ liệu cho mã này.' }, 404);
  return json(stored);
}

async function handlePut(request, env, code) {
  // Chặn theo content-length TRƯỚC khi đọc body, để không nạp dữ liệu vô hạn vào bộ nhớ.
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > MAX_BYTES) return json({ error: 'Dữ liệu vượt quá 2 MB.' }, 413);

  const raw = await request.text();
  if (raw.length > MAX_BYTES) return json({ error: 'Dữ liệu vượt quá 2 MB.' }, 413);

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: 'Body không phải JSON hợp lệ.' }, 400);
  }

  if (!payload?.state || typeof payload.state !== 'object') {
    return json({ error: 'Thiếu trường "state".' }, 400);
  }

  const stored = await env.PROGRESS.get(code, { type: 'json' });
  const currentVersion = stored?.version ?? 0;
  const baseVersion = Number(payload.baseVersion ?? 0);

  // Khoá lạc quan: client phải cho biết nó đã đọc bản nào. Đọc bản cũ nghĩa là
  // có máy khác vừa ghi -> trả bản mới nhất để client gộp rồi thử lại.
  if (baseVersion !== currentVersion) {
    return json({ error: 'Phiên bản đã cũ.', ...(stored ?? { version: 0 }) }, 409);
  }

  const doc = { version: currentVersion + 1, updatedAt: Date.now(), state: payload.state };
  await env.PROGRESS.put(code, JSON.stringify(doc));

  console.log(JSON.stringify({ msg: 'sync_saved', version: doc.version, bytes: raw.length }));
  return json({ version: doc.version, updatedAt: doc.updatedAt });
}
