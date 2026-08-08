/**
 * Tìm kiếm không dấu, dùng chung cho: bộ lọc ngân hàng bài tập, bảng lệnh Ctrl+K
 * và trang Tra cứu nhanh.
 *
 * Người học gõ "hai con tro" hoặc "haicontro" đều phải ra "Hai con trỏ" — bỏ dấu là
 * yêu cầu bắt buộc với giao diện tiếng Việt, không phải tính năng phụ.
 */

/** Bỏ dấu tiếng Việt + thường hoá. "Đồ thị nâng cao" -> "do thi nang cao" */
export function normalize(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // dấu thanh + dấu mũ (đã tách rời nhờ NFD)
    .replace(/[đĐ]/g, 'd')             // đ KHÔNG bị NFD tách — phải xử lý riêng
    .toLowerCase()
    .trim();
}

/** Bỏ luôn khoảng trắng — để "haicontro" cũng khớp "hai con trỏ" */
const squash = (s) => normalize(s).replace(/\s+/g, '');

/**
 * Chấm điểm một mục so với truy vấn. Trả về null nếu không khớp.
 * Điểm CÀNG NHỎ càng khớp tốt (0 = khớp từ đầu chuỗi).
 */
export function scoreOf(haystacks, query) {
  const q = normalize(query);
  if (!q) return 0;
  const qs = squash(query);

  let best = null;
  haystacks.forEach((raw, rank) => {
    if (!raw) return;
    const h = normalize(raw);
    let s;
    if (h.startsWith(q)) s = 0;
    else if (h.includes(q)) s = 1;
    else if (squash(raw).includes(qs)) s = 2;   // khớp khi bỏ hết khoảng trắng
    else return;
    s += rank * 0.1;                            // trường đứng trước quan trọng hơn
    if (best === null || s < best) best = s;
  });
  return best;
}

/**
 * Dựng chỉ mục tìm kiếm.
 * @param {Array} items  danh sách bản ghi bất kỳ
 * @param {(item) => { fields: string[], ...rest }} project  các trường dùng để so khớp,
 *        xếp theo thứ tự ưu tiên (trường đầu quan trọng nhất)
 */
export function buildIndex(items, project) {
  return items.map((item) => ({ item, ...project(item) }));
}

/** Lọc + xếp hạng chỉ mục theo truy vấn. Truy vấn rỗng -> giữ nguyên thứ tự gốc. */
export function searchIndex(index, query, limit = 30) {
  if (!normalize(query)) return index.slice(0, limit);
  const hits = [];
  for (const entry of index) {
    const score = scoreOf(entry.fields, query);
    if (score !== null) hits.push({ entry, score });
  }
  hits.sort((a, b) => a.score - b.score);
  return hits.slice(0, limit).map((h) => h.entry);
}

/** Có khớp truy vấn không (dùng cho bộ lọc tại chỗ, không cần xếp hạng). */
export function matches(haystacks, query) {
  return scoreOf(haystacks, query) !== null;
}
