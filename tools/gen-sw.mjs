/**
 * Sinh service worker (sw.js) từ danh sách file thật trên đĩa.
 *
 * Dự án không có bước build, nên danh sách file cần cache phải được sinh ra chứ không
 * gõ tay — gõ tay là chắc chắn có ngày quên một file rồi app hỏng khi offline.
 * `npm run verify` sẽ báo lỗi nếu sw.js không còn khớp với cây file.
 *
 *   node tools/gen-sw.mjs            ghi lại sw.js
 *   node tools/gen-sw.mjs --check    chỉ kiểm tra, khác thì thoát mã 1
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/** Mọi file trình duyệt cần để chạy app khi không có mạng. */
export function assetList() {
  const files = ['index.html', 'manifest.webmanifest'];
  for (const dir of ['src', 'assets']) {
    if (!existsSync(join(ROOT, dir))) continue;
    for (const f of walk(join(ROOT, dir))) {
      const rel = relative(ROOT, f);
      if (/\.(js|css|woff2?|png|svg|webmanifest)$/.test(rel)) files.push(rel);
    }
  }
  return files.sort().map((f) => './' + f.split('\\').join('/'));
}

/** Phiên bản cache = băm nội dung mọi file. Đổi bất kỳ file nào là cache tự làm mới. */
function version(files) {
  const h = createHash('sha256');
  for (const f of files) {
    const p = join(ROOT, f.replace('./', ''));
    h.update(f);
    if (existsSync(p)) h.update(readFileSync(p));
  }
  return h.digest('hex').slice(0, 10);
}

function build() {
  const files = assetList();
  const ver = version(files);
  return `/* TỆP NÀY ĐƯỢC SINH TỰ ĐỘNG — đừng sửa tay.
 * Chạy lại: node tools/gen-sw.mjs   (npm run verify sẽ báo nếu nó lỗi thời)
 *
 * Cho phép đọc sách và làm bài JavaScript khi KHÔNG có mạng.
 * Lưu ý: bài Python chấm bằng Pyodide tải từ CDN ngoài — phần đó vẫn cần mạng
 * ở lần chạy đầu mỗi phiên, service worker không cache hộ được.
 */
const VERSION = '${ver}';
const CACHE = 'neetcode30-' + VERSION;

const PRECACHE = ${JSON.stringify(files, null, 2)};

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // addAll thất bại toàn bộ nếu một file lỗi -> thêm từng file để một file hỏng
    // không làm chết cả bản cài đặt.
    await Promise.all(PRECACHE.map((u) => cache.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('neetcode30-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Khác gốc (CDN Pyodide...) -> để trình duyệt tự lo, không đụng vào.
  if (url.origin !== self.location.origin) return;

  // Điều hướng trang: ưu tiên mạng để lấy bản mới, mất mạng thì trả bản đã lưu.
  if (request.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        (await caches.open(CACHE)).put('./index.html', fresh.clone());
        return fresh;
      } catch {
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  // Tài nguyên tĩnh: trả bản đã lưu ngay cho nhanh, đồng thời cập nhật ngầm.
  e.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    const network = fetch(request).then((res) => {
      if (res && res.ok) caches.open(CACHE).then((c) => c.put(request, res.clone()));
      return res;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});

// Trang gọi lệnh này khi người dùng bấm "Cập nhật ngay".
self.addEventListener('message', (e) => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});
`;
}

const out = build();
const target = join(ROOT, 'sw.js');
const check = process.argv.includes('--check');

if (check) {
  const cur = existsSync(target) ? readFileSync(target, 'utf8') : '';
  if (cur !== out) {
    console.error('❌ sw.js đã lỗi thời so với cây file. Chạy: node tools/gen-sw.mjs');
    process.exit(1);
  }
  console.log(`✅ sw.js khớp (${assetList().length} file được cache)`);
} else {
  writeFileSync(target, out);
  console.log(`✅ đã sinh sw.js — ${assetList().length} file, phiên bản ${version(assetList())}`);
}
