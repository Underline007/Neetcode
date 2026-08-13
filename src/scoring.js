/**
 * Hệ thống chấm điểm.
 *
 * Triết lý: điểm phản ánh *mức độ tự lực* chứ không chỉ "chạy đúng test".
 * Ai cũng có thể copy lời giải — nhưng điểm sẽ nói thật.
 *
 * "Chạy đúng test" cũng chưa phải xong việc: một lời giải đúng nhưng chậm gấp
 * chục lần vẫn là lời giải sai độ phức tạp. Vì thế có thêm mức thưởng hiệu
 * năng, đo bằng cách so với lời giải tham chiếu (xem perf.js).
 */
import { perfTier } from './perf.js';

export const BASE_POINTS = { Easy: 100, Medium: 160, Hard: 220 };

/** Phạt tích luỹ theo từng bậc gợi ý đã mở (0 -> 3 bậc) */
export const HINT_PENALTY = [0, 0.08, 0.20, 0.34];

/** Xem lời giải: điểm bị chặn trần ở 30% */
export const REVEAL_CAP = 0.30;

export const BONUS = {
  firstTry: 0.15,       // pass toàn bộ test ngay lần chạy đầu tiên
  complexity: 0.10,     // trả lời đúng câu hỏi độ phức tạp
  speed: 0.10,          // giải trong thời gian mục tiêu
  perf: 0.10,           // chạy nhanh ngang lời giải tham chiếu
};

/**
 * @param {number|null} perfRatio thời gian chạy của người học / của lời giải tham chiếu.
 *   null = chưa đo (không thưởng, cũng không phạt).
 */
export function computeScore({
  difficulty = 'Medium',
  hintsUsed = 0,
  revealed = false,
  firstTry = false,
  elapsedMs = null,
  targetMinutes = null,
  complexityCorrect = false,
  perfRatio = null,
} = {}) {
  const base = BASE_POINTS[difficulty] ?? 150;
  const penalty = HINT_PENALTY[Math.min(hintsUsed, 3)] ?? 0.34;

  let mult = 1 - penalty;
  const parts = [];
  if (penalty > 0) parts.push({ label: `Đã mở ${hintsUsed} gợi ý`, delta: -penalty });

  if (firstTry) { mult += BONUS.firstTry; parts.push({ label: 'Đúng ngay lần nộp đầu', delta: BONUS.firstTry }); }
  if (complexityCorrect) { mult += BONUS.complexity; parts.push({ label: 'Phân tích đúng độ phức tạp', delta: BONUS.complexity }); }

  const speedOk = elapsedMs != null && targetMinutes != null && elapsedMs <= targetMinutes * 60000;
  if (speedOk) { mult += BONUS.speed; parts.push({ label: `Giải trong ${targetMinutes} phút`, delta: BONUS.speed }); }

  // Hiệu năng: chỉ THƯỞNG, không trừ. Chậm thì mất phần thưởng đó — đủ để thấy
  // rõ trong bảng điểm, mà không xoá công của người vừa tự giải xong một bài.
  if (perfRatio != null) {
    const tier = perfTier(perfRatio);
    const delta = BONUS.perf * tier.credit;
    mult += delta;
    parts.push({ label: `Hiệu năng: ${tier.label}`, delta });
  }

  let score = Math.max(0, Math.round(base * mult));
  if (revealed) {
    const capped = Math.round(base * REVEAL_CAP);
    if (score > capped) {
      parts.push({ label: 'Đã xem lời giải (trần 30%)', delta: null });
      score = capped;
    }
  }
  const maxMult = 1 + BONUS.firstTry + BONUS.complexity + BONUS.speed + BONUS.perf;
  return { score, base, parts, max: Math.round(base * maxMult) };
}

/** Xếp hạng chữ cho một điểm số so với base */
export function grade(score, difficulty = 'Medium') {
  const base = BASE_POINTS[difficulty] ?? 150;
  const p = score / base;
  if (p >= 1.15) return { letter: 'S', color: 'accent', text: 'Xuất sắc — tự lực hoàn toàn' };
  if (p >= 1.0) return { letter: 'A', color: 'ok', text: 'Rất tốt — nắm chắc mẫu hình' };
  if (p >= 0.8) return { letter: 'B', color: 'ok', text: 'Tốt — cần thêm chút tốc độ' };
  if (p >= 0.6) return { letter: 'C', color: 'medium', text: 'Ổn — nên làm lại sau 3 ngày' };
  if (p > 0) return { letter: 'D', color: 'hard', text: 'Còn phụ thuộc gợi ý — bắt buộc ôn lại' };
  return { letter: '-', color: '', text: 'Chưa giải' };
}

/**
 * Mức thành thạo 1 chủ đề (0..100):
 *  70% từ điểm bài tập (so với base), 30% từ quiz hiểu bản chất.
 */
export function topicMastery(topic, problems, state) {
  const list = problems.filter((p) => p.topic === topic.id);
  if (!list.length) return 0;
  let sum = 0;
  for (const p of list) {
    const rec = state.problems[p.id];
    const base = BASE_POINTS[p.difficulty] ?? 150;
    sum += rec ? Math.min(1, rec.best / base) : 0;
  }
  const problemPart = sum / list.length;
  const quiz = state.quizzes[topic.id];
  const quizPart = quiz ? quiz.best / 100 : 0;
  return Math.round((problemPart * 0.7 + quizPart * 0.3) * 100);
}
