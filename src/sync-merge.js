/**
 * Gộp (merge) hai bản tiến độ học tập đến từ hai máy khác nhau.
 *
 * Đây là phần cốt lõi của việc đồng bộ đa máy. Ghi đè nguyên khối (bản nào nhập
 * sau thì thắng) sẽ XOÁ công sức của máy kia, nên mọi field đều có quy tắc gộp
 * riêng — và quy tắc luôn chọn hướng **không làm mất dữ liệu**:
 *
 *   - điểm số, mức tốt nhất  -> lấy giá trị CAO hơn
 *   - đã giải / đã xem lời giải -> chỉ cần một bên đúng là đúng (OR)
 *   - code đang gõ, lịch ôn tập -> lấy bản MỚI hơn (theo lastRun / số lần ôn)
 *   - bài giảng đã đọc, ngày đã xong -> hợp nhất, giữ mốc thời gian SỚM nhất
 *   - nhật ký điểm -> hợp nhất rồi khử trùng lặp theo (at, type, ref)
 *
 * Module này KHÔNG chạm vào localStorage hay DOM để test được bằng Node thuần
 * (xem tools/test-merge.mjs).
 */

const LOG_LIMIT = 400;

/* --------------------------- tiện ích nhỏ --------------------------- */

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const maxNum = (a, b) => Math.max(num(a), num(b));

/** Mốc thời gian lớn hơn; bỏ qua null/undefined. */
function laterTime(a, b) {
  if (a == null) return b ?? null;
  if (b == null) return a;
  return Math.max(a, b);
}

/** Mốc thời gian nhỏ hơn; bỏ qua null/undefined (dùng cho "lần đầu tiên"). */
function earlierTime(a, b) {
  if (a == null) return b ?? null;
  if (b == null) return a;
  return Math.min(a, b);
}

/**
 * Hợp nhất hai map id -> object bằng một hàm gộp cho từng cặp.
 *
 * Bản ghi chỉ có ở MỘT bên vẫn đi qua hàm gộp (bên kia coi như object rỗng) chứ
 * không được sao chép nguyên xi: nhờ vậy kết quả luôn có đúng bộ field hiện tại
 * và lần gộp thứ hai không còn gì để sửa nữa. Nếu sao chép nguyên xi, một bản
 * ghi cũ (thiếu field mới thêm) sẽ được "bổ sung field" ở lần đồng bộ SAU —
 * tiến độ vẫn đúng, nhưng mỗi lần đồng bộ lại sinh ra một bản khác nhau.
 */
function mergeMaps(a = {}, b = {}, mergeOne) {
  const out = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    out[key] = mergeOne(a[key] || {}, b[key] || {});
  }
  return out;
}

/* --------------------------- gộp từng phần --------------------------- */

/**
 * `firstTry` là bộ ba null | true | false ("chưa rõ" / "đúng ngay lần đầu" / "không").
 * Đã đạt được ở máy nào thì giữ, vì đó là thành tích có thật.
 */
function mergeFirstTry(a, b) {
  if (a === true || b === true) return true;
  if (a === false || b === false) return false;
  return null;
}

/**
 * Lịch ôn tập ngắt quãng: lấy nguyên cụm từ bên đã ôn NHIỀU hơn (reps lớn hơn),
 * hoà thì lấy bên có khoảng cách ôn dài hơn. Không trộn lẫn từng field vì
 * due/interval/ease của SM-2 chỉ có ý nghĩa khi đi cùng nhau.
 */
function mergeSrs(a, b) {
  if (!a) return b;
  if (!b) return a;
  if (num(a.reps) !== num(b.reps)) return num(a.reps) > num(b.reps) ? a : b;
  return num(a.interval) >= num(b.interval) ? a : b;
}

/** Tỉ lệ hiệu năng: nhỏ hơn là nhanh hơn; null nghĩa là chưa đo bên đó. */
function betterRatio(a, b) {
  const va = typeof a === 'number' && a > 0 ? a : null;
  const vb = typeof b === 'number' && b > 0 ? b : null;
  if (va == null) return vb;
  if (vb == null) return va;
  return Math.min(va, vb);
}

function mergeProblem(a, b) {
  // Bản "mới hơn" quyết định những thứ không cộng dồn được: code đang gõ, kết quả chạy gần nhất.
  const newer = num(a.lastRun) >= num(b.lastRun) ? a : b;
  const older = newer === a ? b : a;

  return {
    best: maxNum(a.best, b.best),
    // attempts lấy max chứ không cộng: hai bên có chung phần lịch sử trước khi tách nhánh,
    // cộng lại sẽ thổi phồng số lần thử.
    attempts: maxNum(a.attempts, b.attempts),
    solved: Boolean(a.solved || b.solved),
    hintsUsed: maxNum(a.hintsUsed, b.hintsUsed),
    revealed: Boolean(a.revealed || b.revealed),
    // "đang hiện trên màn hình" — luôn ≥ phần phải trả điểm, xem unlock.js
    hintsOpen: Math.max(maxNum(a.hintsOpen, b.hintsOpen), maxNum(a.hintsUsed, b.hintsUsed)),
    solutionSeen: Boolean(a.solutionSeen || b.solutionSeen || a.revealed || b.revealed),
    // hiệu năng: giữ kết quả ĐO TỐT NHẤT (tỉ lệ càng nhỏ càng nhanh)
    perfRatio: betterRatio(a.perfRatio, b.perfRatio),
    perfAt: laterTime(a.perfAt, b.perfAt),
    firstTry: mergeFirstTry(a.firstTry, b.firstTry),
    code: newer.code ?? older.code ?? null,
    // code Python được gõ ở một field riêng (bài song ngữ) — không có dòng này thì
    // đồng bộ giữa hai máy sẽ xoá mất code Python đang gõ dở.
    codePy: newer.codePy ?? older.codePy ?? null,
    lastRun: laterTime(a.lastRun, b.lastRun),
    srs: mergeSrs(a.srs, b.srs),
  };
}

function mergeQuiz(a, b) {
  return {
    best: maxNum(a.best, b.best),
    attempts: maxNum(a.attempts, b.attempts),
    lastAt: laterTime(a.lastAt, b.lastAt),
  };
}

/** Chuỗi ngày học: lấy bản có ngày gần đây hơn; cùng ngày thì lấy chuỗi dài hơn. */
function mergeStreak(a = {}, b = {}) {
  const sa = { count: num(a.count), lastDay: a.lastDay ?? null };
  const sb = { count: num(b.count), lastDay: b.lastDay ?? null };
  if (!sa.lastDay) return sb;
  if (!sb.lastDay) return sa;
  if (sa.lastDay === sb.lastDay) return { count: Math.max(sa.count, sb.count), lastDay: sa.lastDay };
  return sa.lastDay > sb.lastDay ? sa : sb;
}

/**
 * Nhật ký điểm: hợp nhất rồi khử trùng lặp. Một sự kiện được coi là trùng khi
 * cùng (thời điểm, loại, đối tượng) — đủ chặt vì hai máy không thể tạo ra hai
 * sự kiện khác nhau ở cùng một mili-giây cho cùng một bài.
 */
function mergeLog(a = [], b = []) {
  const seen = new Map();
  for (const entry of [...a, ...b]) {
    if (!entry || typeof entry.at !== 'number') continue;
    const key = `${entry.at}|${entry.type ?? ''}|${entry.ref ?? ''}`;
    if (!seen.has(key)) seen.set(key, entry);
  }
  return [...seen.values()].sort((x, y) => y.at - x.at).slice(0, LOG_LIMIT);
}

/* ------------------------------ hàm chính ------------------------------ */

/**
 * Gộp hai bản state. Kết quả không phụ thuộc thứ tự truyền vào (giao hoán) đối
 * với tiến độ học; riêng tuỳ chọn hiển thị (theme/lang) thì bản có `updatedAt`
 * mới hơn được ưu tiên.
 *
 * @param {object} local  state của máy hiện tại
 * @param {object} remote state tải về từ máy khác
 * @returns {object} state đã gộp
 */
export function mergeState(local, remote) {
  if (!remote || typeof remote !== 'object') return local;
  if (!local || typeof local !== 'object') return remote;

  const log = mergeLog(local.log, remote.log);

  // Điểm phải đơn điệu tăng: không bao giờ thấp hơn bất kỳ bên nào. Trong trường
  // hợp thường gặp (nhật ký chưa bị cắt bớt), tổng điểm tính lại từ nhật ký đã
  // khử trùng chính là con số ĐÚNG khi cả hai máy cùng học thêm từ một mốc chung.
  const fromLog = log.reduce((sum, e) => sum + num(e.points), 0);
  const xp = Math.max(num(local.xp), num(remote.xp), fromLog);

  // Tuỳ chọn hiển thị là sở thích, không phải tiến độ -> bản lưu gần đây nhất thắng.
  const newer = num(local.updatedAt) >= num(remote.updatedAt) ? local : remote;

  return {
    ...local,
    version: Math.max(num(local.version) || 1, num(remote.version) || 1),
    createdAt: earlierTime(local.createdAt, remote.createdAt),
    startedAt: earlierTime(local.startedAt, remote.startedAt),
    updatedAt: laterTime(local.updatedAt, remote.updatedAt),
    xp,
    streak: mergeStreak(local.streak, remote.streak),
    problems: mergeMaps(local.problems, remote.problems, mergeProblem),
    quizzes: mergeMaps(local.quizzes, remote.quizzes, mergeQuiz),
    lessons: mergeMaps(local.lessons, remote.lessons, (a, b) => ({ readAt: earlierTime(a.readAt, b.readAt) })),
    days: mergeMaps(local.days, remote.days, (a, b) => ({ doneAt: earlierTime(a.doneAt, b.doneAt) })),
    log,
    theme: newer.theme ?? local.theme,
    lang: newer.lang ?? local.lang,
  };
}

/** Tóm tắt "bản gộp thêm được những gì so với bản cũ" để báo cho người dùng. */
export function summarizeMerge(before, after) {
  const solvedBefore = Object.values(before.problems || {}).filter((p) => p.solved).length;
  const solvedAfter = Object.values(after.problems || {}).filter((p) => p.solved).length;
  return {
    newProblems: Object.keys(after.problems || {}).length - Object.keys(before.problems || {}).length,
    newSolved: solvedAfter - solvedBefore,
    xpGained: num(after.xp) - num(before.xp),
  };
}
