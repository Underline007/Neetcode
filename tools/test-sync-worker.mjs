/**
 * Kiểm chứng Worker đồng bộ (worker/src/index.js) bằng một Durable Object giả
 * trong bộ nhớ (giả lập ctx.storage.get/put, không phải KV).
 *
 * Không cần tài khoản Cloudflare, không cần deploy: Worker chỉ là một hàm
 * fetch(Request, env) nên gọi thẳng được từ Node. Phần đáng kiểm tra nhất là
 * khoá lạc quan theo version — thứ ngăn hai máy ghi đè lên nhau.
 *
 *   node tools/test-sync-worker.mjs
 */
import worker, { SyncRoom } from '../worker/src/index.js';

const CODE = 'abcdefghijklmnop';           // đúng 16 ký tự, hợp lệ
const URL_BASE = 'https://sync.example.dev';

let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) { passed++; return; }
  failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

/** ctx.storage giả: cùng shape get/put với Durable Object storage thật. */
function makeStorage() {
  const map = new Map();
  return {
    async get(key) { return map.has(key) ? map.get(key) : undefined; },
    async put(key, value) { map.set(key, value); },
  };
}

/** Namespace giả: mỗi mã đồng bộ (id) ánh xạ tới đúng một instance SyncRoom, như thật. */
function makeEnv() {
  const rooms = new Map();
  return {
    SYNC_ROOM: {
      idFromName: (name) => name,
      get(id) {
        if (!rooms.has(id)) rooms.set(id, new SyncRoom({ storage: makeStorage() }));
        return rooms.get(id);
      },
    },
  };
}

const call = (env, method, path, body, headers) =>
  worker.fetch(new Request(`${URL_BASE}${path}`, {
    method,
    headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...headers },
    body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)),
  }), env);

// Worker ghi log có cấu trúc; tắt tiếng để kết quả test dễ đọc.
const realLog = console.log;
console.log = () => {};

try {
  /* --------- định tuyến & xác thực mã --------- */
  {
    const env = makeEnv();
    const res = await call(env, 'GET', `/p/${CODE}`);
    check('mã chưa có dữ liệu -> 404', res.status === 404, `nhận ${res.status}`);

    const short = await call(env, 'GET', '/p/qua-ngan');
    check('mã ngắn bị từ chối -> 400', short.status === 400, `nhận ${short.status}`);

    const nowhere = await call(env, 'GET', '/khong-ton-tai');
    check('đường dẫn lạ -> 404', nowhere.status === 404, `nhận ${nowhere.status}`);

    const post = await call(env, 'POST', `/p/${CODE}`, { state: {} });
    check('phương thức không hỗ trợ -> 405', post.status === 405, `nhận ${post.status}`);

    const opts = await call(env, 'OPTIONS', `/p/${CODE}`);
    check('preflight CORS -> 204', opts.status === 204, `nhận ${opts.status}`);
    check('preflight có Allow-Origin', opts.headers.get('access-control-allow-origin') === '*');
    check('preflight cho phép PUT', (opts.headers.get('access-control-allow-methods') || '').includes('PUT'));
  }

  /* --------- ghi rồi đọc --------- */
  {
    const env = makeEnv();
    const put = await call(env, 'PUT', `/p/${CODE}`, { baseVersion: 0, state: { xp: 120 } });
    check('ghi lần đầu -> 200', put.status === 200, `nhận ${put.status}`);
    const saved = await put.json();
    check('version bắt đầu từ 1', saved.version === 1, `nhận ${saved.version}`);

    const get = await call(env, 'GET', `/p/${CODE}`);
    const doc = await get.json();
    check('đọc lại đúng dữ liệu đã ghi', doc.state?.xp === 120, JSON.stringify(doc.state));
    check('đọc lại đúng version', doc.version === 1, `nhận ${doc.version}`);
    check('phản hồi không được cache', (get.headers.get('cache-control') || '').includes('no-store'));
  }

  /* --------- khoá lạc quan: chống hai máy ghi đè nhau --------- */
  {
    const env = makeEnv();
    await call(env, 'PUT', `/p/${CODE}`, { baseVersion: 0, state: { xp: 10 } });

    // Máy B vẫn đang cầm version 0 -> phải bị từ chối, kèm bản mới nhất để gộp.
    const stale = await call(env, 'PUT', `/p/${CODE}`, { baseVersion: 0, state: { xp: 999 } });
    check('ghi với version cũ -> 409', stale.status === 409, `nhận ${stale.status}`);
    const conflict = await stale.json();
    check('409 trả kèm version hiện tại', conflict.version === 1, `nhận ${conflict.version}`);
    check('409 trả kèm state hiện tại để client gộp', conflict.state?.xp === 10, JSON.stringify(conflict.state));

    const after = await call(env, 'GET', `/p/${CODE}`);
    check('bản ghi cũ KHÔNG bị đè bởi lần ghi hỏng', (await after.json()).state.xp === 10);

    // Gộp xong, ghi lại với version đúng.
    const retry = await call(env, 'PUT', `/p/${CODE}`, { baseVersion: 1, state: { xp: 1009 } });
    check('ghi lại với version đúng -> 200', retry.status === 200, `nhận ${retry.status}`);
    check('version tăng dần', (await retry.json()).version === 2);
  }

  /* --------- body hỏng & quá lớn --------- */
  {
    const env = makeEnv();
    const bad = await call(env, 'PUT', `/p/${CODE}`, 'khong-phai-json');
    check('body không phải JSON -> 400', bad.status === 400, `nhận ${bad.status}`);

    const noState = await call(env, 'PUT', `/p/${CODE}`, { baseVersion: 0 });
    check('thiếu trường state -> 400', noState.status === 400, `nhận ${noState.status}`);

    const huge = JSON.stringify({ baseVersion: 0, state: { blob: 'x'.repeat(2 * 1024 * 1024 + 10) } });
    const tooBig = await call(env, 'PUT', `/p/${CODE}`, huge);
    check('body vượt 2 MB -> 413', tooBig.status === 413, `nhận ${tooBig.status}`);

    const stillEmpty = await call(env, 'GET', `/p/${CODE}`);
    check('không có gì được ghi sau các yêu cầu hỏng', stillEmpty.status === 404);
  }

  /* --------- lỗi hạ tầng phải trả 500 có cấu trúc, không nuốt --------- */
  {
    const brokenRoom = new SyncRoom({
      storage: { async get() { throw new Error('storage sập'); }, async put() {} },
    });
    const broken = { SYNC_ROOM: { idFromName: (name) => name, get: () => brokenRoom } };
    const realError = console.error;
    console.error = () => {};
    const res = await call(broken, 'GET', `/p/${CODE}`);
    console.error = realError;
    check('storage lỗi -> 500', res.status === 500, `nhận ${res.status}`);
    check('500 vẫn là JSON có trường error', (await res.json()).error !== undefined);
    check('500 vẫn kèm header CORS', res.headers.get('access-control-allow-origin') === '*');
  }
} finally {
  console.log = realLog;
}

console.log(`Worker đồng bộ: ${passed} kiểm tra đạt${failures.length ? `, ${failures.length} THẤT BẠI` : ''}.`);
if (failures.length) {
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('✓ Định tuyến, xác thực mã, khoá version và xử lý lỗi đều đúng.');
