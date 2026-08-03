import part1 from './part1.js';
import part2 from './part2.js';
import part3 from './part3.js';
import part4 from './part4.js';
import part5 from './part5.js';

/** Các module của lộ trình Python — học theo thứ tự module, không theo ngày cố định.
 *  Trang chi tiết (/topic/:id, /problem/:id) tự nhận domain theo id (xem main.js) nên
 *  không cần tiền tố đường dẫn riêng — mọi link đều dùng đường dẫn phẳng #/topic/..., #/problem/... */
export const PY_TOPICS = [...part1, ...part2, ...part3, ...part4, ...part5];

/** Toàn bộ bài tập Python, gắn thông tin module + đánh dấu ngôn ngữ. */
export const PY_PROBLEMS = PY_TOPICS.flatMap((t) =>
  t.problems.map((p) => ({
    ...p,
    topic: t.id,
    topicName: t.name,
    topicIcon: t.icon,
    lang: p.lang || 'python',
  }))
);

export const pyTopicById = new Map(PY_TOPICS.map((t) => [t.id, t]));
export const pyProblemById = new Map(PY_PROBLEMS.map((p) => [p.id, p]));
