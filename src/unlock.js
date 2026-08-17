/**
 * Luật mở khoá gợi ý & lời giải.
 *
 * Nguyên tắc: trừ điểm là để bạn **thử trước khi hỏi**, không phải để cấm bạn
 * học. Khi một bài đã pass toàn bộ test thì việc "thử" đã xong — từ lúc đó mọi
 * gợi ý và lời giải tham chiếu đều MIỄN PHÍ, để bạn đọc được các cách khác mà
 * không phải trả giá bằng điểm.
 *
 * NGOẠI LỆ: đang ÔN TẬP (tới từ trang 🔁 Ôn tập ngắt quãng). Mục tiêu của ôn tập
 * là kiểm tra trí nhớ chủ động, nên trong lúc đó gợi ý và lời giải phải trả điểm
 * lại từ đầu, y như bài chưa từng giải — dù `rec.solved` vẫn là true. Mọi hàm ở
 * đây nhận thêm tham số `opts.forcePaid` để ép về trạng thái "chưa miễn phí";
 * views/problem.js bật cờ này khi mở bài qua link ôn tập và tắt lại ngay khi
 * người học tự giải lại thành công (xem `reviewMode` trong mountProblem).
 *
 * Cơ chế: tách "đã mở bao nhiêu" ra khỏi "phải trả bao nhiêu".
 *   - `hintsUsed`  — số gợi ý mở khi bài CHƯA giải được (hoặc đang ôn tập). Đây
 *     là cơ sở trừ điểm.
 *   - `hintsOpen`  — số gợi ý đang hiện trên màn hình (luôn ≥ hintsUsed).
 *   - `revealed`   — đã xem lời giải khi CHƯA giải được (hoặc đang ôn tập) ->
 *     chặn trần điểm 30%.
 *   - `solutionSeen` — lời giải đang hiện (không ảnh hưởng điểm).
 *
 * Nhờ tách đôi như vậy, đọc lời giải sau khi giải xong không làm tụt điểm của
 * những lần chạy sau (ví dụ khi bạn quay lại tối ưu hiệu năng rồi chạy lại).
 *
 * Module thuần logic (không DOM) để test bằng Node — xem tools/test-scoring.mjs.
 */
import { HINT_PENALTY } from './scoring.js';

/** Đã giải được rồi thì mọi thứ miễn phí — TRỪ KHI đang ôn tập (opts.forcePaid). */
export function isFree(rec, opts = {}) {
  if (opts.forcePaid) return false;
  return !!(rec && rec.solved);
}

/**
 * Mở thêm một bậc gợi ý. Trả về bậc vừa mở (1-based) và việc nó có tốn điểm không.
 * @returns {{opened: boolean, level: number, free: boolean}}
 */
export function openHint(rec, total, opts = {}) {
  const free = isFree(rec, opts);
  if (!rec || rec.hintsOpen >= total) return { opened: false, level: rec?.hintsOpen || 0, free };
  rec.hintsOpen++;
  if (!free) rec.hintsUsed = Math.max(rec.hintsUsed || 0, rec.hintsOpen);
  return { opened: true, level: rec.hintsOpen, free };
}

/** Nhãn + trạng thái của nút mở gợi ý. */
export function hintButton(rec, total, opts = {}) {
  const open = rec?.hintsOpen || 0;
  if (open >= total) return { label: 'Đã mở hết gợi ý', disabled: true, free: isFree(rec, opts) };
  const next = open + 1;
  if (isFree(rec, opts)) {
    return { label: `Mở gợi ý ${next}/${total} (miễn phí — đã giải xong)`, disabled: false, free: true };
  }
  const cost = Math.round(((HINT_PENALTY[next] ?? 0) - (HINT_PENALTY[open] ?? 0)) * 100);
  return { label: `Mở gợi ý ${next}/${total} (−${cost}% điểm)`, disabled: false, free: false };
}

/** Dòng chữ nhỏ ở đầu khung gợi ý. */
export function hintPaneNote(rec, opts = {}) {
  return isFree(rec, opts)
    ? 'đã giải xong — mở gợi ý không trừ điểm'
    : 'mỗi bậc trừ điểm dần';
}

/** Xem lời giải khi chưa giải được (hoặc đang ôn tập) thì phải hỏi lại cho chắc. */
export function needsRevealConfirm(rec, opts = {}) {
  return !isFree(rec, opts) && !rec?.revealed;
}

/**
 * Hiện lời giải. Chỉ tính là "đã xem lời giải" (chặn trần 30%) khi bài chưa giải
 * được, hoặc đang ôn tập.
 * @returns {{free: boolean}}
 */
export function revealSolution(rec, opts = {}) {
  const free = isFree(rec, opts);
  if (!rec) return { free };
  rec.solutionSeen = true;
  if (!free) rec.revealed = true;
  return { free };
}

/** Nhãn nút xem lời giải. */
export function revealButtonLabel(rec, opts = {}) {
  return isFree(rec, opts)
    ? '📖 Xem phân tích & lời giải (miễn phí)'
    : 'Xem phân tích & lời giải';
}

/** Giải thích ngay bên trên nút xem lời giải — Markdown ngắn. */
export function revealNote(rec, opts = {}) {
  return isFree(rec, opts)
    ? 'Bạn đã pass toàn bộ test nên phần này **miễn phí**: đọc để so cách của mình với lời giải tham chiếu, và để thấy các cách khác cho cùng một bài.'
    : 'Xem lời giải sẽ giới hạn điểm tối đa của bài này ở **30%**. Hãy thử hết 3 bậc gợi ý trước — và nhớ là sau khi pass hết test thì phần này được mở miễn phí.';
}

/**
 * Đặt lại trạng thái mở khoá về "chưa dùng gì cả" — dùng khi bắt đầu một lượt
 * ÔN TẬP mới, để gợi ý/lời giải phải trả điểm lại từ đầu thay vì ăn ké trạng
 * thái miễn phí còn sót từ lần giải trước.
 */
export function resetUnlockState(rec) {
  if (!rec) return;
  rec.hintsOpen = 0;
  rec.hintsUsed = 0;
  rec.revealed = false;
  rec.solutionSeen = false;
}
