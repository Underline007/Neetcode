/**
 * Cài đặt ngoại tuyến (PWA).
 *
 * Mục tiêu: mở app trên điện thoại là đọc được sách ngay cả khi không có mạng,
 * và cài được vào màn hình chính như một ứng dụng.
 *
 * Nói rõ giới hạn để không hứa quá:
 *   ✅ Đọc sách, tra cứu, luyện thẻ, làm bài JavaScript — chạy hoàn toàn ngoại tuyến.
 *   ❌ Chấm bài Python — cần tải Pyodide (~vài MB) từ CDN ngoài ở lần chạy đầu mỗi
 *      phiên, service worker không cache hộ tài nguyên khác gốc được.
 *
 * Service worker chỉ hoạt động trên HTTPS hoặc localhost — mở bằng file:// thì không.
 */

let deferredInstall = null;   // sự kiện beforeinstallprompt bị hoãn lại để tự bày nút
let waitingWorker = null;     // bản mới đã tải xong, đang chờ được kích hoạt

export const pwa = {
  /** Đã cài / đang chạy ở chế độ ứng dụng độc lập? */
  isInstalled() {
    return window.matchMedia?.('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
  },
  canInstall() { return !!deferredInstall; },
  isSupported() { return 'serviceWorker' in navigator; },
  isOnline() { return navigator.onLine !== false; },
  hasUpdate() { return !!waitingWorker; },

  /** Bày hộp thoại cài đặt của trình duyệt. Trả về true nếu người dùng đồng ý. */
  async promptInstall() {
    if (!deferredInstall) return false;
    deferredInstall.prompt();
    const { outcome } = await deferredInstall.userChoice;
    deferredInstall = null;
    window.dispatchEvent(new CustomEvent('pwa-changed'));
    return outcome === 'accepted';
  },

  /** Áp dụng bản cập nhật đang chờ rồi tải lại trang. */
  applyUpdate() {
    if (!waitingWorker) return;
    waitingWorker.postMessage('skip-waiting');
  },
};

export function registerServiceWorker() {
  if (!pwa.isSupported()) return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });

      // Có bản mới đang tải -> theo dõi tới khi nó sẵn sàng
      reg.addEventListener('updatefound', () => {
        const sw = reg.installing;
        if (!sw) return;
        sw.addEventListener('statechange', () => {
          // Chỉ báo cập nhật khi ĐÃ có bản cũ đang chạy; lần cài đầu tiên thì không.
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            waitingWorker = sw;
            window.dispatchEvent(new CustomEvent('pwa-changed'));
          }
        });
      });

      if (reg.waiting && navigator.serviceWorker.controller) {
        waitingWorker = reg.waiting;
        window.dispatchEvent(new CustomEvent('pwa-changed'));
      }
    } catch {
      /* Không đăng ký được (mở bằng file://, hoặc trình duyệt chặn) — app vẫn chạy bình thường. */
    }
  });

  // Bản mới nắm quyền -> tải lại một lần duy nhất để dùng code mới
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();               // chặn thanh gợi ý mặc định, tự bày nút đúng chỗ
    deferredInstall = e;
    window.dispatchEvent(new CustomEvent('pwa-changed'));
  });

  window.addEventListener('appinstalled', () => {
    deferredInstall = null;
    window.dispatchEvent(new CustomEvent('pwa-changed'));
  });

  for (const ev of ['online', 'offline']) {
    window.addEventListener(ev, () => window.dispatchEvent(new CustomEvent('pwa-changed')));
  }
}
