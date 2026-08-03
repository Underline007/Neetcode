import part1 from './part1.js';
import part2 from './part2.js';
import part3 from './part3.js';
import part4 from './part4.js';
import part5 from './part5.js';
import part6 from './part6.js';
import part7 from './part7.js';
import part8 from './part8.js';
import part9 from './part9.js';
import part10 from './part10.js';
import part11 from './part11.js';
import part12 from './part12.js';
import part13 from './part13.js';
import part14 from './part14.js';
import part15 from './part15.js';

/** Các module của lộ trình Python — học theo thứ tự module, không theo ngày cố định.
 *  Trang chi tiết (/topic/:id, /problem/:id) tự nhận domain theo id (xem main.js) nên
 *  không cần tiền tố đường dẫn riêng — mọi link đều dùng đường dẫn phẳng #/topic/..., #/problem/... */
export const PY_TOPICS = [
  ...part1, ...part2, ...part3, ...part4, ...part5,
  ...part6, ...part7, ...part8, ...part9, ...part10,
  ...part11, ...part12, ...part13, ...part14, ...part15,
];

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
