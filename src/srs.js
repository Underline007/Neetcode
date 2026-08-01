/**
 * Lặp lại ngắt quãng (spaced repetition) rút gọn từ SM-2.
 * Mục tiêu: sau 30 ngày bạn vẫn còn nhớ, không phải "học xong quên luôn".
 */

const DAY = 86400000;

/** Điểm số -> chất lượng nhớ 0..5 */
export function qualityFromScore(score, base) {
  const p = base ? score / base : 0;
  if (p >= 1.0) return 5;
  if (p >= 0.85) return 4;
  if (p >= 0.65) return 3;
  if (p >= 0.4) return 2;
  return 1;
}

/** Cập nhật lịch ôn cho 1 bài sau khi giải xong */
export function schedule(srs, quality) {
  const s = { ...(srs || { interval: 0, ease: 2.5, reps: 0 }) };
  if (quality < 3) {
    s.reps = 0;
    s.interval = 1;               // sai nhiều -> ôn lại ngay ngày mai
  } else {
    s.reps = (s.reps || 0) + 1;
    if (s.reps === 1) s.interval = 1;
    else if (s.reps === 2) s.interval = 3;
    else s.interval = Math.round((s.interval || 3) * s.ease);
  }
  s.ease = Math.max(1.3, (s.ease || 2.5) + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  s.interval = Math.min(s.interval, 21);   // trong khoá 30 ngày, không giãn quá 3 tuần
  s.due = Date.now() + s.interval * DAY;
  return s;
}

/** Danh sách bài tới hạn ôn, sắp xếp theo mức quá hạn */
export function dueItems(state, problems) {
  const now = Date.now();
  return problems
    .map((p) => ({ p, rec: state.problems[p.id] }))
    .filter(({ rec }) => rec && rec.solved && rec.srs && rec.srs.due && rec.srs.due <= now)
    .sort((a, b) => a.rec.srs.due - b.rec.srs.due);
}

export function nextDueLabel(srs) {
  if (!srs || !srs.due) return '—';
  const diff = srs.due - Date.now();
  if (diff <= 0) return 'Đến hạn ôn';
  const d = Math.ceil(diff / DAY);
  return `Ôn sau ${d} ngày`;
}
