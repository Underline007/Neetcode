/** Cầu nối tới worker chấm bài: có timeout để bắt vòng lặp vô hạn / thuật toán quá chậm. */

export function runTests({ code, entry, tests, harnessSrc, checkerSrc, timeoutMs = 6000 }) {
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
