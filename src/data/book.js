/**
 * Cấu trúc "sách" cho trình đọc (#/book).
 *
 * Sách gộp hai nguồn, KHÔNG chép lại nội dung nào:
 *   Phần I  — Cẩm nang cú pháp (data/handbook.js): chương ngắn, viết riêng để đọc trên điện thoại.
 *   Phần II — Lộ trình Python (data/python/): dùng thẳng trường `lesson` của 15 module sẵn có,
 *             nên sửa bài giảng ở đâu thì sách tự cập nhật theo, không có bản sao thứ hai.
 *
 * Mỗi chương: { id, title, icon, minutes, body, partId, topicId? }
 * `topicId` có nghĩa là chương này lấy từ một module có bài tập — trình đọc sẽ hiện
 * nút "Làm bài tập" để chuyển từ đọc sang thực hành.
 */

import { HANDBOOK, HANDBOOK_PARTS } from './handbook/index.js';
import { PY_TOPICS } from './python/index.js';

/** Ước lượng thời gian đọc: ~900 ký tự/phút với văn bản kỹ thuật tiếng Việt có code. */
const uocLuongPhut = (text) => Math.max(2, Math.round(String(text).length / 900));

export const BOOK_PARTS = [
  // Cẩm nang chia thành 5 phần nhỏ — 26 chương trong một danh sách phẳng thì không tra được.
  ...HANDBOOK_PARTS.map((p) => ({
    id: `cam-nang-${p.id}`,
    group: 'Cẩm nang cú pháp',
    title: p.title,
    icon: p.icon,
    blurb: p.blurb,
    chapters: HANDBOOK.filter((c) => c.part === p.id).map((c) => ({ ...c, partId: `cam-nang-${p.id}` })),
  })),
  {
    id: 'lo-trinh',
    group: 'Lộ trình Python',
    title: 'Lộ trình Python',
    icon: '🐍',
    blurb: 'Đi sâu từng chủ đề, đúng nội dung bài giảng của 15 module — đọc xong có thể làm bài tập ngay.',
    chapters: PY_TOPICS.map((t) => ({
      id: `ch-${t.id}`,
      title: t.name,
      icon: t.icon,
      minutes: uocLuongPhut(t.lesson),
      body: t.lesson,
      partId: 'lo-trinh',
      topicId: t.id,
      subtitle: t.en,
    })),
  },
];

/** Toàn bộ chương theo đúng thứ tự đọc. */
export const CHAPTERS = BOOK_PARTS.flatMap((p) => p.chapters);
export const chapterById = new Map(CHAPTERS.map((c) => [c.id, c]));
export const partById = new Map(BOOK_PARTS.map((p) => [p.id, p]));

export const BOOK_MINUTES = CHAPTERS.reduce((s, c) => s + c.minutes, 0);

/** Chương liền trước / liền sau, xuyên qua ranh giới phần. */
export function neighbours(chapterId) {
  const i = CHAPTERS.findIndex((c) => c.id === chapterId);
  return {
    prev: i > 0 ? CHAPTERS[i - 1] : null,
    next: i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : null,
    index: i,
  };
}

/** Các mục cấp `##` trong một chương — dùng dựng mục lục bên trong chương.
 *  Bỏ qua heading nằm trong khối code (```) để không bắt nhầm comment Python. */
export function outlineOf(body) {
  const out = [];
  let inCode = false;
  for (const line of String(body).split('\n')) {
    if (/^```/.test(line)) { inCode = !inCode; continue; }
    if (inCode) continue;
    const m = line.match(/^##\s+(.*)$/);
    if (m) out.push({ text: m[1].trim(), slug: slugify(m[1]) });
  }
  return out;
}

/** Tạo id neo cho heading, bỏ dấu tiếng Việt để id sạch. */
export function slugify(text) {
  return String(text)
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 60);
}
