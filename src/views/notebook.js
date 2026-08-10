/**
 * 📔 Sổ tay — nơi giữ lại những gì bạn RÚT RA được, không phải những gì bạn đã giải.
 *
 * Ba mục:
 *   1. Ghi chú theo bài (gom theo chủ đề)
 *   2. Bài đã đánh dấu ⭐
 *   3. "Lỗi bạn hay mắc" — dựng từ store.errorStats, mỗi mục kèm lại phần giải thích
 *      của error-vi.js. Đây là báo cáo điểm yếu cá nhân, thứ không có ở mục Thống kê.
 */

import { TOPICS, PROBLEMS } from '../data/index.js';
import { PY_TOPICS, PY_PROBLEMS } from '../data/python/index.js';
import { store } from '../store.js';
import { md } from '../markdown.js';
import { $, esc, fmtDate, toast, diffClass, diffLabel } from '../ui.js';
import { explanationByKey } from '../error-vi.js';

const ALL_TOPICS = [...TOPICS, ...PY_TOPICS];
const ALL_PROBLEMS = [...PROBLEMS, ...PY_PROBLEMS];
const problemById = new Map(ALL_PROBLEMS.map((p) => [p.id, p]));

export function renderNotebook() {
  const st = store.get();

  const noteIds = Object.keys(st.notes || {}).filter((id) => problemById.has(id));
  const marked = Object.keys(st.bookmarks || {}).filter((id) => problemById.has(id));
  const errors = Object.entries(st.errorStats || {})
    .map(([key, v]) => ({ key, ...v, ex: explanationByKey(key) }))
    .filter((e) => e.ex)
    .sort((a, b) => b.count - a.count);

  const empty = !noteIds.length && !marked.length && !errors.length;

  return `
    <h1>📔 Sổ tay</h1>
    <p class="sub">Mục Thống kê cho biết bạn đã làm được bao nhiêu. Sổ tay giữ thứ quan trọng hơn:
      <strong>bạn rút ra được gì</strong> và <strong>bạn hay sai ở đâu</strong>.</p>

    ${empty ? `
      <div class="card">
        <h3 style="margin-top:0">Sổ tay đang trống</h3>
        <p class="muted" style="margin:0">Trong mỗi trang bài tập có pane <strong>📝 Ghi chú của bạn</strong> và nút
          <strong>☆ Đánh dấu</strong>. Viết một hai câu sau khi giải xong — "mẫu hình của bài này là gì", "mình mắc ở đâu" —
          là cách rẻ nhất để tháng sau vẫn còn nhớ.</p>
      </div>` : ''}

    ${errors.length ? `
      <h2>⚠️ Lỗi bạn hay mắc</h2>
      <p class="muted small">Đếm từ những lần chạy code bị lỗi. Loại lỗi lặp lại nhiều lần là một lỗ hổng kiến thức,
        không phải sự vô ý — đọc lại phần "vì sao" là cách sửa tận gốc.</p>
      <div class="grid">
        ${errors.map(errorCard).join('')}
      </div>` : ''}

    ${noteIds.length ? `
      <h2>📝 Ghi chú của bạn <span class="badge">${noteIds.length}</span></h2>
      <div class="row" style="margin-bottom:10px">
        <button class="btn ghost small" data-action="export-notes">⬇ Xuất ghi chú ra Markdown</button>
      </div>
      ${notesByTopic(noteIds, st)}` : ''}

    ${marked.length ? `
      <h2>⭐ Bài đã đánh dấu <span class="badge">${marked.length}</span></h2>
      <div class="list">
        ${marked
          .map((id) => problemById.get(id))
          .sort((a, b) => ALL_PROBLEMS.indexOf(a) - ALL_PROBLEMS.indexOf(b))
          .map((p) => {
            const rec = st.problems[p.id];
            return `<a class="list-item" href="#/problem/${p.id}">
              <span>${rec?.solved ? '✅' : '⬜'}</span>
              <span class="t">${esc(p.title)}</span>
              <span class="badge ${diffClass(p.difficulty)}">${diffLabel(p.difficulty)}</span>
              <span class="spacer"></span>
              <span class="m">${p.topicIcon} ${esc(p.topicName)}</span>
            </a>`;
          }).join('')}
      </div>` : ''}
  `;
}

function errorCard(e) {
  const p = e.lastProblem ? problemById.get(e.lastProblem) : null;
  return `<div class="card err-stat">
    <div class="row">
      <strong>${md(e.ex.title).replace(/^<p>|<\/p>$/g, '')}</strong>
      <span class="spacer"></span>
      <span class="badge ${e.count >= 5 ? 'hard' : e.count >= 3 ? 'medium' : ''}">${e.count} lần</span>
    </div>
    <div class="hint" style="margin-bottom:6px"><strong>Vì sao xảy ra.</strong> ${md(e.ex.why).replace(/^<p>|<\/p>$/g, '')}</div>
    <div class="hint" style="border-left-color:var(--ok)"><strong>Sửa thế nào.</strong> ${md(e.ex.fix).replace(/^<p>|<\/p>$/g, '')}</div>
    <div class="row small muted" style="margin-top:8px">
      <span>Lần cuối: ${fmtDate(e.lastAt)}</span>
      ${p ? `<span class="spacer"></span><a href="#/problem/${p.id}">${esc(p.title)}</a>` : ''}
    </div>
  </div>`;
}

function notesByTopic(noteIds, st) {
  const groups = new Map();
  for (const id of noteIds) {
    const p = problemById.get(id);
    if (!groups.has(p.topic)) groups.set(p.topic, []);
    groups.get(p.topic).push(p);
  }
  // giữ đúng thứ tự chủ đề của lộ trình
  return ALL_TOPICS.filter((t) => groups.has(t.id)).map((t) => `
    <h3>${t.icon} ${esc(t.name)}</h3>
    <div class="grid">
      ${groups.get(t.id).map((p) => `
        <div class="card tight note-card">
          <div class="row">
            <a href="#/problem/${p.id}" class="note-title">${esc(p.title)}</a>
            <span class="spacer"></span>
            <span class="muted small">${fmtDate(st.notes[p.id].updatedAt)}</span>
          </div>
          <p class="note-body">${esc(st.notes[p.id].text)}</p>
        </div>`).join('')}
    </div>`).join('');
}

export function mountNotebook(root = document) {
  root.querySelector('[data-action="export-notes"]')?.addEventListener('click', () => {
    const st = store.get();
    const lines = ['# Ghi chú học thuật toán', '', `_Xuất ngày ${store.today()}_`, ''];

    for (const t of ALL_TOPICS) {
      const inTopic = Object.keys(st.notes)
        .filter((id) => problemById.get(id)?.topic === t.id)
        .map((id) => problemById.get(id));
      if (!inTopic.length) continue;
      lines.push(`## ${t.icon} ${t.name}`, '');
      for (const p of inTopic) {
        lines.push(`### ${p.title} (${p.en})`, '', st.notes[p.id].text.trim(), '');
      }
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ghi-chu-neetcode-${store.today()}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Đã xuất ghi chú ra file Markdown.');
  });
}
