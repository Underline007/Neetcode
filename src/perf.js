/**
 * Chấm HIỆU NĂNG, không chỉ chấm đúng/sai.
 *
 * Cách đo: chạy code của người học và **lời giải tham chiếu của chính bài đó**
 * trong cùng một lượt, cùng một máy, cùng bộ dữ liệu — rồi so thời gian.
 * Tỉ lệ `ratio = thời-gian-của-bạn / thời-gian-tham-chiếu` là con số duy nhất
 * người học cần nhìn: 1× là ngang ngửa, 10× là đang làm việc thừa gấp mười lần.
 *
 * Vì sao không chấm bằng thời gian tuyệt đối? Vì máy nhanh máy chậm, Pyodide
 * chậm hơn CPython, mỗi lần đo lại lệch chút — điểm số không được phụ thuộc vào
 * những thứ đó. So với chính lời giải tham chiếu thì mọi yếu tố ngoại cảnh bị
 * triệt tiêu, chỉ còn lại chất lượng thuật toán.
 *
 * Module này thuần logic (không DOM, không worker) để test bằng Node — xem
 * tools/test-scoring.mjs.
 */

/**
 * Bậc hiệu năng theo tỉ lệ thời gian. `credit` là phần thưởng nhận được của
 * mức thưởng hiệu năng (xem BONUS.perf trong scoring.js): 1 = nhận đủ.
 *
 * Vì sao mốc "ngang ngửa" rộng tới 1.35× chứ không phải 1.05×? Vì cùng một
 * thuật toán viết bằng hai cách hợp lý (vòng for vs comprehension, dict vs
 * Counter) vẫn lệch nhau vài chục phần trăm — phạt vào đó là dạy mẹo vi mô,
 * không phải dạy tư duy. Còn sai độ phức tạp thì chênh lệch là hàng chục lần,
 * không bao giờ lẫn vào vùng này được.
 */
export const PERF_TIERS = [
  {
    key: 'faster', max: 0.9, credit: 1, tone: 'ok',
    label: 'Nhanh hơn cả lời giải tham chiếu 🏆',
    // Trên dữ liệu nhỏ, một lời giải O(n²) rất hay "thắng" lời giải O(n) vì không phải
    // dựng bảng băm. Nói "nhanh hơn lời giải mẫu" trong tình huống đó là dạy sai.
    smallLabel: 'Nhanh hơn lời giải tham chiếu trên dữ liệu nhỏ',
    advice: 'Bạn tìm được cách còn gọn hơn bản tham chiếu. Hãy đọc lời giải tham chiếu bên dưới để biết mình đã tiết kiệm được đúng ở chỗ nào — và tự hỏi cách của bạn có còn đúng khi dữ liệu lớn hơn không.',
    smallAdvice: '**Cẩn thận với con số này.** Bộ test của bài rất nhỏ, mà trên dữ liệu nhỏ thì một lời giải O(n²) hay thắng lời giải O(n) chỉ vì không phải dựng bảng băm/mảng phụ. Nhanh ở đây **không** đồng nghĩa với độ phức tạp tốt hơn — muốn biết chắc, hãy tự hỏi mỗi phần tử đầu vào bị chạm bao nhiêu lần khi n = 100.000.',
  },
  {
    key: 'onpar', max: 1.35, credit: 1, tone: 'ok',
    label: 'Nhanh ngang lời giải tham chiếu',
    smallLabel: 'Nhanh ngang lời giải tham chiếu (dữ liệu nhỏ)',
    advice: 'Cùng một mức chi phí với lời giải tham chiếu — đây là mục tiêu. Vẫn nên đọc bản tham chiếu để so cách diễn đạt.',
    smallAdvice: 'Ngang ngửa lời giải tham chiếu trên bộ test của bài. Bộ test này nhỏ nên phép đo chỉ nói về hằng số; nếu lời giải của bạn có vòng lặp lồng thì hãy tự kiểm tra lại độ phức tạp bằng đầu, đừng tin mỗi con số này.',
  },
  {
    key: 'ok', max: 2.5, credit: 0.5, tone: 'medium',
    label: 'Chậm hơn một chút',
    advice: 'Cùng độ phức tạp nhưng hằng số lớn hơn. Thường do: duyệt dữ liệu hai lượt trong khi một lượt là đủ, tạo mảng/chuỗi trung gian trong vòng lặp, hoặc gọi lại một phép tính đã biết kết quả. Hãy tìm trong vòng lặp của bạn xem có việc gì làm mà không dùng tới.',
  },
  {
    key: 'slow', max: 6, credit: 0, tone: 'hard',
    label: 'Chậm hơn hẳn',
    advice: 'Chênh lệch tới mức này gần như luôn là **việc thừa trong vòng lặp**: một vòng lặp lồng thêm, một phép tìm kiếm tuyến tính đáng lẽ dùng dict/set, hoặc cắt chuỗi/mảng ở mỗi bước. Hãy đếm xem mỗi phần tử đầu vào bị chạm bao nhiêu lần — mục tiêu thường là một lần.',
  },
  {
    key: 'verySlow', max: Infinity, credit: 0, tone: 'hard',
    label: 'Chậm hơn rất nhiều — gần như chắc chắn lệch độ phức tạp',
    advice: 'Chênh lệch cỡ này không phải chuyện hằng số nữa: lời giải của bạn đang ở một **độ phức tạp khác**, ví dụ O(n²) so với O(n). Đừng vá từng dòng — hãy đọc lại gợi ý và đổi cách tiếp cận (thường là đổi vòng lặp lồng thành một lượt duyệt + bảng băm).',
  },
];

/** Bậc hiệu năng của một tỉ lệ thời gian. */
export function perfTier(ratio) {
  const r = Number(ratio);
  if (!Number.isFinite(r) || r <= 0) return PERF_TIERS[1];   // không đo được -> coi như ngang ngửa, không phạt oan
  return PERF_TIERS.find((t) => r <= t.max) || PERF_TIERS[PERF_TIERS.length - 1];
}

/**
 * Nhãn và lời khuyên nói ĐÚNG mức tin cậy của phép đo.
 *
 * Đo trên dữ liệu nhỏ thì chỉ được nói về hằng số. Riêng chiều "nhanh hơn lời giải
 * tham chiếu" phải nói kèm cảnh báo: đó là kết luận dễ sai nhất, vì trên dữ liệu nhỏ
 * thì thuật toán tệ hơn vẫn có thể nhanh hơn.
 */
export function perfLabel(tier, onBigData) {
  return onBigData ? tier.label : (tier.smallLabel || tier.label);
}

export function perfAdvice(tier, onBigData) {
  return onBigData ? tier.advice : (tier.smallAdvice || tier.advice);
}

/**
 * Bộ test dùng để ĐO (khác bộ test dùng để chấm đúng/sai).
 *
 * Nếu bài có test dữ liệu lớn (`perf: true`, xem buildTests trong data/index.js)
 * thì chỉ đo trên chúng: đo lẫn với các test 5 phần tử sẽ pha loãng mất khác
 * biệt về độ phức tạp. Bài chưa có test lớn thì đo trên bộ test thường.
 */
export function benchTests(tests, limit = 12) {
  const usable = (tests || []).filter((t) => t && !t.scratch);
  const heavy = usable.filter((t) => t.perf);
  return (heavy.length ? heavy : usable).slice(0, limit);
}

/** Dữ liệu lớn sinh ra lúc chạy tốn thời gian -> chỉ sinh một lần cho mỗi phiên. */
const benchDataCache = new Map();

/**
 * Dữ liệu để đo của một bài, theo thứ tự ưu tiên:
 *   1. `perfBench` — dữ liệu lớn chỉ dùng để đo (xem data/perf-bench.js);
 *   2. test dữ liệu lớn có tính điểm (`perf: true`);
 *   3. bộ test thường (khi đó phép đo chỉ nói về hằng số — xem perfScope).
 */
export function measureTests(problem, tests, limit = 12) {
  const specs = problem?.perfBench || [];
  if (!specs.length) return benchTests(tests, limit);
  return specs.slice(0, limit).map((spec) => {
    const key = `${problem.id}::${spec.name}`;
    if (!benchDataCache.has(key)) {
      benchDataCache.set(key, { name: spec.name, args: spec.build(), perf: true });
    }
    return benchDataCache.get(key);
  });
}

/** Phép đo này nói được điều gì — và KHÔNG nói được điều gì. */
export function perfScope(tests) {
  const big = (tests || []).some((t) => t && t.perf);
  return big
    ? {
      big: true,
      note: 'Đo trên **test dữ liệu lớn** của bài, nên con số này phản ánh cả độ phức tạp thuật toán.',
    }
    : {
      big: false,
      note: 'Bài này chưa có test dữ liệu lớn nên phép đo chạy trên chính bộ test thường: nó bắt được **hằng số** (việc thừa trong vòng lặp, tạo dữ liệu trung gian vô ích), còn khác biệt về **độ phức tạp** thì chỉ dữ liệu lớn mới lộ ra.',
    };
}

/** Đo ở mức micro-giây thì nhiễu ngang với chênh lệch -> nói thẳng cho người học biết. */
export function perfShaky(oursMs, refMs) {
  const slower = Math.max(Number(oursMs) || 0, Number(refMs) || 0);
  return slower > 0 && slower < 0.01;
}

export function fmtMs(ms) {
  const v = Number(ms);
  if (!Number.isFinite(v)) return '—';
  if (v >= 100) return `${Math.round(v)} ms`;
  if (v >= 1) return `${v.toFixed(2)} ms`;
  return `${(v * 1000).toFixed(1)} µs`;
}

/** "1.12×" · "12×" — số càng lớn càng không cần phần thập phân. */
export function fmtRatio(ratio) {
  const r = Number(ratio);
  if (!Number.isFinite(r) || r <= 0) return '—';
  if (r >= 10) return `${Math.round(r)}×`;
  return `${r.toFixed(2)}×`;
}
