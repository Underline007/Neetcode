/**
 * Phần "Cú pháp cần biết trước" của từng module Python.
 *
 * Vì sao tách khỏi part*.js: mỗi module đã có `lesson` dạy TƯ DUY (vấn đề gốc, ý tưởng cốt lõi,
 * bẫy, ứng dụng thực tế) — phần này dạy CÚ PHÁP thuần tuý cho người chưa từng viết Python, nên
 * là một mạch nội dung riêng, đọc trước bài giảng. Gộp vào topic ở data/python/index.js.
 *
 * Khoá của map = id của topic. Thiếu khoá nào thì topic đó đơn giản là không có phần cú pháp
 * (giao diện tự ẩn mục này), không gây lỗi.
 */
import g1 from './syntax1.js';
import g2 from './syntax2.js';
import g3 from './syntax3.js';

export const PY_SYNTAX = { ...g1, ...g2, ...g3 };
