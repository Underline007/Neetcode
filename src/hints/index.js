/**
 * Từ điển gợi ý cú pháp — đầu vào duy nhất cho mọi nơi cần nó:
 *   - bảng gợi ý khi gõ trong trình soạn thảo (editor.js),
 *   - bảng "cú pháp thường dùng" cạnh bài tập (views/problem.js),
 *   - trang 🔎 Tra cứu nhanh và panel tra cứu trong bài (views/reference.js),
 *   - thẻ 🧠 Luyện nhớ sinh tự động (drill.js).
 *
 * Nội dung nằm ở ./python*.js và ./javascript.js; khuôn dữ liệu ở ./item.js.
 */
import { PY_HINTS } from './python.js';
import { JS_HINTS } from './javascript.js';

export { HINT_TOPICS, topicLabel, EX_EXACT, EX_ABOUT } from './item.js';

export const HINTS = {
  python: PY_HINTS,
  javascript: JS_HINTS,
};

export const KIND_LABEL = {
  kw: 'từ khoá', fn: 'hàm', mod: 'thư viện', m: 'phương thức', snip: 'mẫu', local: 'trong bài',
};

/** Tìm trong cả tên, chữ ký, mô tả và từ khoá tìm kiếm phụ (không dấu). */
const haystack = (it) => [it.label, it.alias || '', it.detail || '', it.doc || ''];

/**
 * Lọc gợi ý theo tiền tố người dùng đang gõ.
 *
 * Ngoài khớp theo tên, còn khớp theo `alias` (ví dụ gõ "dem" ra Counter): người mới
 * thường nhớ việc mình cần làm chứ chưa nhớ tên hàm.
 *
 * @param {string} prefix  phần định danh đang gõ
 * @param {boolean} isMember  true nếu ngay trước tiền tố là dấu chấm
 * @param {string[]} locals  các định danh xuất hiện trong code hiện tại
 */
export function completionsFor(lang, prefix, isMember, locals = []) {
  const dict = HINTS[lang] || HINTS.python;
  const pool = isMember
    ? dict.members
    : [...dict.globals, ...locals.map((l) => ({ label: l, kind: 'local', detail: l, doc: 'Định danh có trong code của bạn' }))];

  const q = prefix.toLowerCase();
  const seen = new Set();
  const scored = [];

  for (const it of pool) {
    if (seen.has(it.label)) continue;
    const label = it.label.toLowerCase();
    let score;
    if (!q) score = 2;
    else if (label.startsWith(q)) score = 0;
    else if (label.includes(q)) score = 1;
    else if ((it.alias || '').toLowerCase().includes(q)) score = 1.8;
    else continue;
    if (it.kind === 'local') score += 0.5;   // tên có sẵn trong code xếp sau mục từ điển
    seen.add(it.label);
    scored.push({ it, score });
  }

  scored.sort((a, b) => a.score - b.score || a.it.label.length - b.it.label.length || a.it.label.localeCompare(b.it.label));
  return scored.slice(0, 12).map((s) => s.it);
}

/** Mọi mục của một ngôn ngữ, dùng cho tra cứu và thẻ ghi nhớ. */
export const allHints = (lang) => [...(HINTS[lang]?.globals || []), ...(HINTS[lang]?.members || [])];

export { haystack as hintHaystack };
