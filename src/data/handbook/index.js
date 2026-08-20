/**
 * CẨM NANG CÚ PHÁP PYTHON — nội dung viết riêng cho việc ĐỌC TRÊN ĐIỆN THOẠI.
 *
 * Khác với 15 module trong `data/python/` (dạy sâu từng chủ đề, kèm bài tập chạy code),
 * các chương ở đây được viết để:
 *   - đọc một mạch trong 4–7 phút, không cần bàn phím
 *   - nặng về BẢNG TRA và VÍ DỤ NGẮN, nhẹ về lý luận dài
 *   - trả lời đúng câu "cú pháp này viết thế nào" khi đang xếp hàng hay ngồi xe buýt
 *
 * Mỗi chương: { id, part, title, icon, minutes, body }  — body là Markdown.
 */
import part1 from './part1.js';
import part2 from './part2.js';
import part3 from './part3.js';
import part4 from './part4.js';
import part5 from './part5.js';

export const HANDBOOK = [...part1, ...part2, ...part3, ...part4, ...part5];

/** Các phần của cẩm nang, theo đúng thứ tự đọc. */
export const HANDBOOK_PARTS = [
  { id: 'A', title: 'Bắt đầu', icon: '🌱', blurb: 'Chạy Python, biến & kiểu, toán tử, số học — nền móng để đọc được mọi đoạn code.' },
  { id: 'B', title: 'Dữ liệu', icon: '🧺', blurb: 'Chuỗi, cắt lát, list, tuple, dict, set — bốn kiểu bạn dùng trong 90% thời gian.' },
  { id: 'C', title: 'Luồng & hàm', icon: '🔁', blurb: 'Điều kiện, vòng lặp, comprehension, hàm, generator, decorator.' },
  { id: 'D', title: 'Tổ chức code', icon: '🏗️', blurb: 'Lớp, kế thừa, module, ngoại lệ, chú thích kiểu — khi chương trình lớn dần.' },
  { id: 'E', title: 'Làm việc thật', icon: '🧰', blurb: 'File, JSON, thư viện chuẩn, regex, ngày giờ, đọc lỗi, PEP 8, chuyển từ JavaScript.' },
];

export const HANDBOOK_MINUTES = HANDBOOK.reduce((s, c) => s + c.minutes, 0);
