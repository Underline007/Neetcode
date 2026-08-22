/* TỆP NÀY ĐƯỢC SINH TỰ ĐỘNG — đừng sửa tay.
 * Chạy lại: node tools/gen-sw.mjs   (npm run verify sẽ báo nếu nó lỗi thời)
 *
 * Cho phép đọc sách và làm bài JavaScript khi KHÔNG có mạng.
 * Lưu ý: bài Python chấm bằng Pyodide tải từ CDN ngoài — phần đó vẫn cần mạng
 * ở lần chạy đầu mỗi phiên, service worker không cache hộ được.
 */
const VERSION = 'ae38fa0660';
const CACHE = 'neetcode30-' + VERSION;

const PRECACHE = [
  "./assets/css/app.css",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./index.html",
  "./manifest.webmanifest",
  "./src/data/book.js",
  "./src/data/handbook/index.js",
  "./src/data/handbook/part1.js",
  "./src/data/handbook/part2.js",
  "./src/data/handbook/part3.js",
  "./src/data/handbook/part4.js",
  "./src/data/handbook/part5.js",
  "./src/data/index.js",
  "./src/data/part1.js",
  "./src/data/part2.js",
  "./src/data/part3.js",
  "./src/data/part4.js",
  "./src/data/part5.js",
  "./src/data/part6.js",
  "./src/data/perf-bench.js",
  "./src/data/python/drills.js",
  "./src/data/python/drills1.js",
  "./src/data/python/drills2.js",
  "./src/data/python/drills3.js",
  "./src/data/python/index.js",
  "./src/data/python/part1.js",
  "./src/data/python/part10.js",
  "./src/data/python/part11.js",
  "./src/data/python/part12.js",
  "./src/data/python/part13.js",
  "./src/data/python/part14.js",
  "./src/data/python/part15.js",
  "./src/data/python/part2.js",
  "./src/data/python/part3.js",
  "./src/data/python/part4.js",
  "./src/data/python/part5.js",
  "./src/data/python/part6.js",
  "./src/data/python/part7.js",
  "./src/data/python/part8.js",
  "./src/data/python/part9.js",
  "./src/data/python/syntax.js",
  "./src/data/python/syntax1.js",
  "./src/data/python/syntax2.js",
  "./src/data/python/syntax3.js",
  "./src/data/reference.js",
  "./src/drill.js",
  "./src/editor.js",
  "./src/error-vi.js",
  "./src/highlight.js",
  "./src/hints/index.js",
  "./src/hints/item.js",
  "./src/hints/javascript.js",
  "./src/hints/python-core.js",
  "./src/hints/python-lib.js",
  "./src/hints/python-oop.js",
  "./src/hints/python.js",
  "./src/lang.js",
  "./src/main.js",
  "./src/markdown.js",
  "./src/perf.js",
  "./src/pwa.js",
  "./src/quiz-format.js",
  "./src/runner.js",
  "./src/sandbox.worker.js",
  "./src/sandbox.worker.py.js",
  "./src/scoring.js",
  "./src/search.js",
  "./src/srs.js",
  "./src/store.js",
  "./src/sync-merge.js",
  "./src/sync.js",
  "./src/ui.js",
  "./src/unlock.js",
  "./src/views/book.js",
  "./src/views/dashboard.js",
  "./src/views/lists.js",
  "./src/views/misc.js",
  "./src/views/notebook.js",
  "./src/views/problem.js",
  "./src/views/python.js",
  "./src/views/quiz.js",
  "./src/views/reference.js"
];

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
