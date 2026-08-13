/**
 * Khuôn dữ liệu cho từ điển cú pháp (gợi ý trong trình soạn thảo + bảng 🔎 Tra cứu).
 *
 * Mỗi mục trả lời ba câu hỏi của người học, theo đúng thứ tự họ hỏi:
 *   1. `detail` — viết thế nào?      (chữ ký / dạng cú pháp)
 *   2. `doc`    — nó làm gì?         (một câu tiếng Việt thường, không thuật ngữ)
 *   3. `ex`     — chạy ra cái gì?    (ví dụ CỤ THỂ kèm kết quả)
 *
 * Ví dụ là phần dễ hiểu nhất với người mới, nên nó không được sai. Mọi ví dụ viết
 * dạng `code → kết quả` đều được CHẠY THẬT bằng CPython trong tools/test-hints.mjs
 * và so với kết quả ghi ở đây; ví dụ nào không thể kiểm chứng (giờ hiện tại, số
 * ngẫu nhiên, luồng) thì viết `code ≈ kết quả` để nói rõ là kết quả tuỳ lúc chạy.
 */

/** `→` = kết quả chính xác, có kiểm chứng. `≈` = tuỳ lúc chạy, không kiểm chứng được. */
export const EX_EXACT = '→';
export const EX_ABOUT = '≈';

/**
 * Chủ đề = 15 module của lộ trình Python + một nhóm cho lộ trình thuật toán.
 * Nhờ có `module`, bảng tra cứu lọc được đúng phần cú pháp của module đang học.
 */
export const HINT_TOPICS = [
  { id: 'basics', label: '🐣 Nền tảng & kiểu dữ liệu', module: 'py-basics' },
  { id: 'control', label: '🔁 Điều khiển, hàm & phạm vi', module: 'py-control-flow' },
  { id: 'data', label: '🧺 Cấu trúc dữ liệu & comprehension', module: 'py-data-structures' },
  { id: 'oop', label: '🏗️ Lớp & dataclass', module: 'py-oop' },
  { id: 'functional', label: '🌀 Iterator, generator & decorator', module: 'py-functional' },
  { id: 'strings', label: '🔤 Chuỗi & regex', module: 'py-strings-regex' },
  { id: 'errors', label: '🚨 Ngoại lệ & gỡ lỗi', module: 'py-exceptions' },
  { id: 'files', label: '📄 File, JSON & CSV', module: 'py-file-io' },
  { id: 'packaging', label: '📦 Module & package', module: 'py-packaging' },
  { id: 'context', label: '🔐 Context manager (with)', module: 'py-context-managers' },
  { id: 'typing', label: '🏷️ Type hints', module: 'py-typing' },
  { id: 'stdlib', label: '🧰 Thư viện chuẩn', module: 'py-stdlib' },
  { id: 'testing', label: '✅ Testing với pytest', module: 'py-testing' },
  { id: 'advoop', label: '🧬 OOP nâng cao & dunder', module: 'py-advanced-oop' },
  { id: 'perf', label: '⚡ Đồng thời & hiệu năng', module: 'py-concurrency-performance' },
  { id: 'algo', label: '🧮 Cấu trúc cho thuật toán', module: null },
];

export const topicLabel = (id) => HINT_TOPICS.find((t) => t.id === id)?.label || id;

/**
 * Đoán `insert` cho trình soạn thảo khi mục không tự khai báo: hàm/phương thức thì
 * chèn `ten(` rồi đặt con trỏ trong ngoặc — đúng việc người học muốn làm tiếp theo.
 * Chỉ đoán khi tên là một định danh đơn giản; mọi trường hợp khác phải tự ghi.
 */
function guessInsert(label, kind, detail) {
  if (!/^[A-Za-z_]\w*$/.test(label)) return undefined;
  if (!['fn', 'm', 'mod'].includes(kind)) return undefined;
  if (!detail || !detail.includes(`${label}(`)) return undefined;
  return detail.includes(`${label}()`) ? `${label}()` : `${label}($|)`;
}

/**
 * Một mục của từ điển.
 * @param {string} label   tên gõ vào code (khoá của gợi ý)
 * @param {string} kind    kw | fn | mod | m | snip
 * @param {string} detail  chữ ký / dạng cú pháp
 * @param {string} doc     một câu tiếng Việt: nó làm gì
 * @param {object} [opts]  { ex, insert, setup, alias }
 *   ex     — mảng ví dụ `code → kết quả`
 *   setup  — code cần chạy trước ví dụ (import...), dùng cả khi kiểm chứng
 *   alias  — từ khoá tìm kiếm thêm (kể cả tên tiếng Việt không dấu)
 */
export function entry(label, kind, detail, doc, opts = {}) {
  const it = { label, kind, detail, doc, ...opts };
  if (it.insert === undefined) it.insert = guessInsert(label, kind, detail);
  return it;
}

/** Gắn chủ đề cho cả một cụm mục — đỡ phải nhắc lại ở từng dòng. */
export const tag = (topic, items) => items.map((i) => ({ ...i, topic }));
