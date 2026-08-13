/**
 * Luật mở khoá gợi ý & lời giải.
 *
 * Nguyên tắc: trừ điểm là để bạn **thử trước khi hỏi**, không phải để cấm bạn
 * học. Khi một bài đã pass toàn bộ test thì việc "thử" đã xong — từ lúc đó mọi
 * gợi ý và lời giải tham chiếu đều MIỄN PHÍ, để bạn đọc được các cách khác mà
 * không phải trả giá bằng điểm.
 *
 * Cơ chế: tách "đã mở bao nhiêu" ra khỏi "phải trả bao nhiêu".
 *   - `hintsUsed`  — số gợi ý mở khi bài CHƯA giải được. Đây là cơ sở trừ điểm.
 *   - `hintsOpen`  — số gợi ý đang hiện trên màn hình (luôn ≥ hintsUsed).
 *   - `revealed`   — đã xem lời giải khi CHƯA giải được -> chặn trần điểm 30%.
 *   - `solutionSeen` — lời giải đang hiện (không ảnh hưởng điểm).
 *
 * Nhờ tách đôi như vậy, đọc lời giải sau khi giải xong không làm tụt điểm của
 * những lần chạy sau (ví dụ khi bạn quay lại tối ưu hiệu năng rồi chạy lại).
 *
 * Module thuần logic (không DOM) để test bằng Node — xem tools/test-scoring.mjs.
 */
import { HINT_PENALTY } from './scoring.js';

/** Đã giải được rồi thì mọi thứ miễn phí. */
export function isFree(rec) {
  return !!(rec && rec.solved);
}

/**
 * Mở thêm một bậc gợi ý. Trả về bậc vừa mở (1-based) và việc nó có tốn điểm không.
 * @returns {{opened: boolean, level: number, free: boolean}}
 */
export function openHint(rec, total) {
  const free = isFree(rec);
  if (!rec || rec.hintsOpen >= total) return { opened: false, level: rec?.hintsOpen || 0, free };
  rec.hintsOpen++;
  if (!free) rec.hintsUsed = Math.max(rec.hintsUsed || 0, rec.hintsOpen);
  return { opened: true, level: rec.hintsOpen, free };
}

/** Nhãn + trạng thái của nút mở gợi ý. */
export function hintButton(rec, total) {
  const open = rec?.hintsOpen || 0;
  if (open >= total) return { label: 'Đã mở hết gợi ý', disabled: true, free: isFree(rec) };
  const next = open + 1;
  if (isFree(rec)) {
    return { label: `Mở gợi ý ${next}/${total} (miễn phí — đã giải xong)`, disabled: false, free: true };
  }
  const cost = Math.round(((HINT_PENALTY[next] ?? 0) - (HINT_PENALTY[open] ?? 0)) * 100);
  return { label: `Mở gợi ý ${next}/${total} (−${cost}% điểm)`, disabled: false, free: false };
}

/** Dòng chữ nhỏ ở đầu khung gợi ý. */
export function hintPaneNote(rec) {
  return isFree(rec)
    ? 'đã giải xong — mở gợi ý không trừ điểm'
    : 'mỗi bậc trừ điểm dần';
}

/** Xem lời giải khi chưa giải được thì phải hỏi lại cho chắc; đã giải rồi thì không. */
export function needsRevealConfirm(rec) {
  return !isFree(rec) && !rec?.revealed;
}

/**
 * Hiện lời giải. Chỉ tính là "đã xem lời giải" (chặn trần 30%) khi bài chưa giải được.
 * @returns {{free: boolean}}
 */
export function revealSolution(rec) {
  const free = isFree(rec);
  if (!rec) return { free };
  rec.solutionSeen = true;
  if (!free) rec.revealed = true;
  return { free };
}

/** Nhãn nút xem lời giải. */
export function revealButtonLabel(rec) {
  return isFree(rec)
    ? '📖 Xem phân tích & lời giải (miễn phí)'
    : 'Xem phân tích & lời giải';
}

/** Giải thích ngay bên trên nút xem lời giải — Markdown ngắn. */
export function revealNote(rec) {
  return isFree(rec)
    ? 'Bạn đã pass toàn bộ test nên phần này **miễn phí**: đọc để so cách của mình với lời giải tham chiếu, và để thấy các cách khác cho cùng một bài.'
    : 'Xem lời giải sẽ giới hạn điểm tối đa của bài này ở **30%**. Hãy thử hết 3 bậc gợi ý trước — và nhớ là sau khi pass hết test thì phần này được mở miễn phí.';
}
