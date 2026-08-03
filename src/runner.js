/** Cầu nối tới worker chấm bài: có timeout để bắt vòng lặp vô hạn / thuật toán quá chậm. */

export function runTests({ code, entry, tests, harnessSrc, checkerSrc, timeoutMs = 6000, lang = 'javascript' }) {
  return lang === 'python'
    ? runPyTests({ code, entry, tests, harnessSrc, checkerSrc, timeoutMs: Math.max(timeoutMs, 20000) })
    : runJsTests({ code, entry, tests, harnessSrc, checkerSrc, timeoutMs });
}

/** JavaScript: một worker MỚI cho mỗi lượt chạy — cô lập hoàn toàn, khởi động tức thì. */
function runJsTests({ code, entry, tests, harnessSrc, checkerSrc, timeoutMs }) {
  return new Promise((resolve) => {
    let worker;
    try {
      worker = new Worker(new URL('./sandbox.worker.js', import.meta.url));
    } catch (err) {
      resolve({ ok: false, phase: 'worker', error: String(err), results: [], logs: [] });
      return;
    }

    const timer = setTimeout(() => {
      worker.terminate();
      resolve({
        ok: false, phase: 'timeout', results: [], logs: [],
        error: `Quá ${timeoutMs / 1000}s mà chưa chạy xong. Nguyên nhân thường gặp: (1) vòng lặp vô hạn — ` +
          `con trỏ/biến điều kiện không thay đổi; (2) độ phức tạp quá cao so với ràng buộc đề bài.`,
      });
    }, timeoutMs);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (err) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ ok: false, phase: 'runtime', error: err.message || String(err), results: [], logs: [] });
    };

    worker.postMessage({ code, entry, tests, harnessSrc, checkerSrc });
  });
}

/** Python: worker Pyodide TÁI SỬ DỤNG giữa các lượt chạy (tải môi trường Python tốn vài giây,
 *  chỉ nên trả phí đó một lần cho mỗi phiên). Nếu timeout/lỗi, worker bị huỷ và tạo lại ở lượt sau. */
let pyWorker = null;

function runPyTests({ code, entry, tests, harnessSrc, checkerSrc, timeoutMs }) {
  return new Promise((resolve) => {
    let worker;
    try {
      worker = pyWorker || (pyWorker = new Worker(new URL('./sandbox.worker.py.js', import.meta.url)));
    } catch (err) {
      pyWorker = null;
      resolve({ ok: false, phase: 'worker', error: String(err), results: [], logs: [] });
      return;
    }

    const timer = setTimeout(() => {
      worker.onmessage = null;
      worker.onerror = null;
      worker.terminate();
      pyWorker = null;
      resolve({
        ok: false, phase: 'timeout', results: [], logs: [],
        error: `Quá ${Math.round(timeoutMs / 1000)}s mà chưa chạy xong. Có thể do: (1) vòng lặp vô hạn; ` +
          `(2) lần đầu tải môi trường Python trên mạng chậm — hãy thử chạy lại; (3) độ phức tạp quá cao.`,
      });
    }, timeoutMs);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      resolve(e.data);
    };
    worker.onerror = (err) => {
      clearTimeout(timer);
      worker.terminate();
      pyWorker = null;
      resolve({ ok: false, phase: 'runtime', error: err.message || String(err), results: [], logs: [] });
    };

    worker.postMessage({ code, entry, tests, harnessSrc, checkerSrc });
  });
}
