/**
 * Bộ thẻ ghi nhớ cho trang 🧠 Luyện nhớ.
 *
 * Hai nguồn thẻ:
 *   1. SINH TỰ ĐỘNG từ từ điển gợi ý cú pháp (`syntax-hints.js`) — mặt trước là mô tả tiếng Việt
 *      (`doc`), mặt sau là tên + chữ ký hàm. Không phải chép lại dữ liệu: sửa từ điển là thẻ tự đổi.
 *   2. VIẾT TAY trong `data/reference.js` (`DS_CARDS`) cho phần không suy ra được từ từ điển:
 *      chi phí thao tác, quy tắc chọn cấu trúc, bẫy thường gặp.
 *
 * Lịch ôn dùng CHUNG thuật toán SM-2 rút gọn với bài tập (`srs.js`) — không có hệ thống thứ hai.
 */

import { HINTS, KIND_LABEL } from './hints/index.js';
import { DS_CARDS } from './data/reference.js';
import { store } from './store.js';
import { schedule } from './srs.js';

export const DECKS = [
  { id: 'python', label: '🐍 Cú pháp Python' },
  { id: 'javascript', label: '🟨 Cú pháp JavaScript' },
  { id: 'ds', label: '🧱 Cấu trúc dữ liệu & chi phí' },
];

/** Người học tự chấm sau khi lật thẻ -> chất lượng nhớ 0..5 của SM-2. */
export const GRADES = [
  { id: 'again', label: '😵 Quên', quality: 1, hint: 'quay lại ngay ngày mai' },
  { id: 'hard', label: '😐 Khó', quality: 3, hint: 'giãn ra chậm' },
  { id: 'easy', label: '😄 Dễ', quality: 5, hint: 'giãn ra nhanh' },
];

const LANG_NAME = { python: 'Python', javascript: 'JavaScript' };

function syntaxCards(lang) {
  const dict = HINTS[lang];
  if (!dict) return [];
  const seen = new Set();
  const out = [];

  for (const it of [...dict.globals, ...dict.members]) {
    // Không có mô tả tiếng Việt thì không dựng được mặt trước -> bỏ qua.
    if (!it.doc || seen.has(it.label)) continue;
    seen.add(it.label);
    out.push({
      id: `syn:${lang}:${it.label}`,
      deck: lang,
      tag: KIND_LABEL[it.kind] || it.kind,
      // Mặt trước/sau là MARKDOWN (giống DS_CARDS) — trang hiển thị sẽ render qua md().
      front: `Trong ${LANG_NAME[lang]}, dùng gì để: *${it.doc}*`,
      answer: it.label,
      // Mặt sau có cả ví dụ kèm kết quả: nhớ được chữ ký mà không hình dung ra kết quả
      // thì vẫn chưa dùng được.
      back: '`' + (it.detail || it.label) + '`'
        + (it.ex?.length ? '\n\n' + it.ex.map((x) => '- `' + x + '`').join('\n') : ''),
    });
  }
  return out;
}

/** Toàn bộ thẻ của mọi bộ. Dựng một lần rồi dùng lại. */
let cache = null;
export function allCards() {
  if (!cache) {
    cache = [
      ...syntaxCards('python'),
      ...syntaxCards('javascript'),
      ...DS_CARDS.map((c) => ({
        id: `ds:${c.id}`, deck: 'ds', tag: c.tag,
        front: c.front, answer: null, back: c.back,
      })),
    ];
  }
  return cache;
}

export function cardsOfDeck(deckId) {
  return deckId === 'all' ? allCards() : allCards().filter((c) => c.deck === deckId);
}

/** Thẻ đến hạn ôn: thẻ CHƯA HỌC cũng tính là đến hạn (lần đầu ai cũng phải gặp nó một lần). */
export function dueCards(deckId = 'all', state = store.get()) {
  const now = Date.now();
  return cardsOfDeck(deckId).filter((c) => {
    const rec = state.cards?.[c.id];
    return !rec || !rec.due || rec.due <= now;
  });
}

/** Số thẻ đến hạn — dùng cho badge ở thanh bên. */
export function dueCount(state = store.get()) {
  return dueCards('all', state).length;
}

/** Ghi nhận người học tự chấm một thẻ, xếp lịch lần gặp lại. */
export function gradeCard(cardId, quality) {
  const rec = store.card(cardId);
  const next = schedule(rec, quality);
  Object.assign(rec, next);
  store.save();
  return rec;
}

/** Đã học được bao nhiêu / tổng bao nhiêu trong một bộ. */
export function deckProgress(deckId, state = store.get()) {
  const cards = cardsOfDeck(deckId);
  const learned = cards.filter((c) => state.cards?.[c.id]?.reps > 0).length;
  return { total: cards.length, learned, due: dueCards(deckId, state).length };
}
