/** Các tiện ích dùng chung cho phần giao diện. */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let toastTimer = null;
export function toast(msg, ms = 2600) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), ms);
}

export const diffClass = (d) => ({ Easy: 'easy', Medium: 'medium', Hard: 'hard' }[d] || '');
export const diffLabel = (d) => ({ Easy: 'Dễ', Medium: 'Trung bình', Hard: 'Khó' }[d] || d);

export function bar(percent, slim = false) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return `<div class="bar${slim ? ' slim' : ''}"><i style="width:${p}%"></i></div>`;
}

export function fmtDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/** Gắn sự kiện cho các phần tử [data-action] bên trong một gốc */
export function on(root, action, handler) {
  $$(`[data-action="${action}"]`, root).forEach((el) => {
    el.addEventListener('click', (e) => handler(e, el));
  });
}

export const go = (hash) => { window.location.hash = hash; };
