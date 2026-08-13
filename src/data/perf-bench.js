/**
 * Dữ liệu LỚN dùng để ĐO hiệu năng (không dùng để chấm đúng/sai).
 *
 * Vì sao cần file này? Bộ test của một bài thường chỉ có 5–10 phần tử. Đo trên đó
 * chỉ nói được về hằng số: một lời giải O(n²) thậm chí còn "thắng" lời giải O(n)
 * vì không phải dựng bảng băm. Muốn nói được câu "độ phức tạp của bạn chưa đúng"
 * thì phải đo trên dữ liệu đủ lớn.
 *
 * Khác với `perfTests` (xem buildTests trong ./index.js): `perfTests` là test THẬT,
 * trượt là không được tính điểm; còn `perfBench` chỉ để bấm đồng hồ nên không cần
 * đáp án, không ảnh hưởng việc bài có đạt hay không.
 *
 * Chọn kích thước dữ liệu theo hai ràng buộc:
 *   1. Lời giải tham chiếu phải chạy nhanh trên MỌI môi trường — kể cả Python trong
 *      trình duyệt (Pyodide), chậm hơn JavaScript hàng chục lần.
 *   2. Lời giải sai độ phức tạp phải chậm hẳn ra, nhưng không chậm tới mức treo:
 *      bài mà bẫy là O(n²) thì n ~ 4.000; bài mà bẫy là "quét tuyến tính thay vì
 *      chặt nhị phân" thì n ~ 5.000 (quét 5.000 phần tử vẫn nhanh, nhưng gấp hàng
 *      trăm lần so với 13 bước chặt nhị phân).
 *
 * Dữ liệu sinh bằng công thức tất định (không dùng Math.random) để hai lần đo trên
 * cùng một máy so sánh được với nhau.
 */

/** Dãy giả ngẫu nhiên tất định: 7919 là số nguyên tố nên các giá trị rải đều. */
const spread = (i, mod) => (i * 7919) % mod;

const numbers = (n, mod) => Array.from({ length: n }, (_, i) => spread(i, mod));

/** Từ 5 chữ cái sinh từ i — nhiều từ trùng chữ cái để bài gom nhóm có việc thật sự làm. */
function word(i) {
  let s = '';
  for (let k = 0; k < 5; k++) s += String.fromCharCode(97 + spread(i * 5 + k, 26));
  return s;
}

const one = (name, build) => [{ name, build }];

export const PERF_BENCH = {
  /* ---------- mảng & bảng băm: bẫy là vòng lặp lồng ---------- */
  'group-anagrams': one('4.000 từ', () => [Array.from({ length: 4000 }, (_, i) => word(i))]),
  'top-k-frequent': one('8.000 số, 200 giá trị khác nhau',
    () => [Array.from({ length: 8000 }, (_, i) => spread(i, 200)), 10]),
  // Chỉ dùng 1 và -1: tích của 4.000 số nguyên khác sẽ thành số khổng lồ, mà số nguyên
  // của Python thì vô hạn chữ số -> phép nhân chậm dần, đo ra tốc độ của bignum chứ
  // không phải tốc độ thuật toán.
  'product-except-self': one('4.000 phần tử (±1)',
    () => [Array.from({ length: 4000 }, (_, i) => (i % 3 === 0 ? -1 : 1))]),
  'single-number': one('4.001 phần tử',
    () => [[...Array.from({ length: 2000 }, (_, i) => i + 1), ...Array.from({ length: 2000 }, (_, i) => i + 1), 999999]]),

  /* ---------- hai con trỏ: bẫy là xét mọi cặp ---------- */
  'valid-palindrome': one('chuỗi 20.000 ký tự', () => {
    const half = Array.from({ length: 10000 }, (_, i) => String.fromCharCode(97 + spread(i, 26))).join('');
    return [half + [...half].reverse().join('')];
  }),
  // target rơi vào đúng cặp CUỐI: đó là trường hợp tệ nhất của vòng lặp lồng
  'two-sum-ii': one('4.000 phần tử đã sắp xếp',
    () => [Array.from({ length: 4000 }, (_, i) => i + 1), 4000 + 3999]),
  'three-sum': one('300 phần tử', () => [numbers(300, 101).map((v) => v - 50)]),

  /* ---------- cửa sổ trượt & ngăn xếp ---------- */
  'longest-repeating-replacement': one('chuỗi 4.000 ký tự',
    () => [Array.from({ length: 4000 }, (_, i) => String.fromCharCode(65 + spread(i, 4))).join(''), 2]),
  'valid-parentheses': one('4.200 dấu ngoặc lồng nhau', () => ['({[]})'.repeat(700)]),

  /* ---------- chặt nhị phân: bẫy là quét tuyến tính ---------- */
  // target là phần tử CUỐI: quét tuyến tính phải đi hết mảng, chặt nhị phân 13 bước
  'binary-search-basic': one('5.000 phần tử, tìm phần tử cuối',
    () => [Array.from({ length: 5000 }, (_, i) => i * 2), 9998]),
  'search-rotated': one('5.000 phần tử đã xoay', () => {
    const k = 3777;   // điểm xoay lệch hẳn về cuối để phép quét tuyến tính tốn nhiều bước
    const sorted = Array.from({ length: 5000 }, (_, i) => i * 2);
    return [[...sorted.slice(k), ...sorted.slice(0, k)], sorted[k - 1]];
  }),
  'find-min-rotated': one('5.000 phần tử đã xoay', () => {
    const sorted = Array.from({ length: 5000 }, (_, i) => i * 2);
    return [[...sorted.slice(4321), ...sorted.slice(0, 4321)]];
  }),
  // Bẫy ở đây là dò từng tốc độ một thay vì chặt nhị phân trên đáp án
  'koko-bananas': one('1.000 đống chuối, 2.000 giờ', () => [numbers(1000, 10000).map((v) => v + 1), 2000]),

  /* ---------- khoảng & bit ---------- */
  'merge-intervals': one('4.000 khoảng',
    () => [Array.from({ length: 4000 }, (_, i) => [spread(i, 100000), spread(i, 100000) + 50])]),
  'non-overlapping-intervals': one('4.000 khoảng',
    () => [Array.from({ length: 4000 }, (_, i) => [spread(i, 20000), spread(i, 20000) + 30])]),
  'meeting-rooms-ii': one('4.000 cuộc họp',
    () => [Array.from({ length: 4000 }, (_, i) => [spread(i, 20000), spread(i, 20000) + 45])]),
  // Bẫy: đếm lại số bit của từng số từ đầu, thay vì dùng kết quả đã tính
  'counting-bits': one('n = 20.000', () => [20000]),
};
