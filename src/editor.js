/**
 * Trình soạn thảo code cho phần làm bài tập — không dùng thư viện ngoài.
 *
 * Gồm bốn phần:
 *   1. Lớp phủ tô màu: một <pre> nằm dưới <textarea> trong suốt, hai lớp dùng CHUNG chỉ số
 *      font/line-height/padding nên từng ký tự khớp nhau tuyệt đối.
 *   2. Gợi ý cú pháp: bảng chọn hiện khi gõ, kèm chữ ký hàm và giải thích tiếng Việt
 *      (xem syntax-hints.js). Ưu tiên Python.
 *   3. Thụt lề thông minh: Enter sau dấu ":" tự thụt vào, return/break/continue tự thụt ra,
 *      Tab theo đúng đơn vị của ngôn ngữ (Python 4 dấu cách, JS 2).
 *   4. Tự đóng ngoặc/nháy, gõ đè ký tự đóng, bọc vùng đang chọn.
 */

import { highlightLines } from './highlight.js';
import { HINTS, KIND_LABEL, completionsFor } from './hints/index.js';
import { esc } from './ui.js';

const LINE_H = 21;      // phải khớp với --ed-line trong CSS
const PAD_X = 16;
const PAD_Y = 12;
const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
const CLOSERS = new Set([')', ']', '}', '"', "'", '`']);
const STOP_WORDS = new Set(['self', 'return', 'if', 'for', 'while', 'def', 'class', 'in', 'is', 'not', 'and', 'or', 'else', 'elif', 'const', 'let', 'function', 'var']);

export function createEditor({ mount, value = '', lang = 'python', onChange, onRun }) {
  const dict = HINTS[lang] || HINTS.python;
  const indentUnit = dict.indent;
  const indentSize = dict.indentSize;

  mount.innerHTML = `
    <div class="ed">
      <div class="ed-gutter"><div class="ed-gutter-in"></div></div>
      <div class="ed-main">
        <pre class="ed-hl" aria-hidden="true"><code></code></pre>
        <textarea class="ed-area" spellcheck="false" wrap="off" autocomplete="off"
                  autocapitalize="off" autocorrect="off" aria-label="Vùng viết code"></textarea>
        <span class="ed-measure" aria-hidden="true">0000000000</span>
      </div>
      <div class="ac hidden"><div class="ac-list"></div><div class="ac-doc"></div></div>
    </div>
    <div class="ed-status">
      <span class="ed-pos">Dòng 1, cột 1</span>
      <span class="spacer"></span>
      <span class="muted">gợi ý cú pháp: <span class="kbd">Ctrl</span>+<span class="kbd">Space</span> · chọn: <span class="kbd">Tab</span></span>
    </div>`;

  const root = mount.querySelector('.ed');
  const ta = root.querySelector('.ed-area');
  const hlCode = root.querySelector('.ed-hl > code');
  const gutter = root.querySelector('.ed-gutter-in');
  const measure = root.querySelector('.ed-measure');
  const ac = root.querySelector('.ac');
  const acList = root.querySelector('.ac-list');
  const acDoc = root.querySelector('.ac-doc');
  const posEl = mount.querySelector('.ed-pos');

  ta.value = value;

  let charW = 8.1;
  let frame = 0;
  let quiet = false;   // đang sửa nội dung theo lệnh của editor -> bỏ qua xử lý gõ phím
  const pop = { open: false, items: [], sel: 0, prefix: '' };

  /* ------------------------------ vẽ lại ------------------------------ */
  function paint() {
    const lines = highlightLines(ta.value, lang);
    hlCode.innerHTML = lines.map((l) => `<span class="cl">${l}</span>`).join('');
    gutter.innerHTML = lines.map((_, i) => `<span>${i + 1}</span>`).join('');
    syncScroll();
  }
  function schedulePaint() {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; paint(); });
  }
  function syncScroll() {
    hlCode.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
    gutter.style.transform = `translateY(${-ta.scrollTop}px)`;
  }

  function updatePos() {
    const upto = ta.value.slice(0, ta.selectionStart);
    const row = (upto.match(/\n/g) || []).length;
    const col = upto.length - upto.lastIndexOf('\n') - 1;
    posEl.textContent = `Dòng ${row + 1}, cột ${col + 1}`;
  }

  function changed() {
    schedulePaint();
    updatePos();
    onChange?.(ta.value);
  }

  /* ------------------------ sửa nội dung an toàn ------------------------ */
  /** Mọi thay đổi do editor tự sinh đều đi qua đây. Ưu tiên execCommand('insertText')
   *  vì đó là cách DUY NHẤT giữ được ngăn xếp hoàn tác (Ctrl+Z) gốc của trình duyệt;
   *  setRangeText chỉ là phương án dự phòng. */
  function replaceRange(from, to, text, caret = from + text.length, caretEnd = caret) {
    quiet = true;
    ta.focus();
    ta.setSelectionRange(from, to);
    let ok = false;
    try { ok = document.execCommand('insertText', false, text); } catch { ok = false; }
    if (!ok) ta.setRangeText(text, from, to, 'end');
    ta.setSelectionRange(caret, caretEnd);
    quiet = false;
    changed();
  }

  const lineStartOf = (pos) => ta.value.lastIndexOf('\n', pos - 1) + 1;
  const lineEndOf = (pos) => { const i = ta.value.indexOf('\n', pos); return i === -1 ? ta.value.length : i; };
  const indentOf = (line) => (line.match(/^[ \t]*/) || [''])[0];

  /* ------------------------------ gợi ý ------------------------------ */
  function contextAtCaret() {
    const before = ta.value.slice(0, ta.selectionStart);
    const m = before.match(/([A-Za-z_][\w]*)$/);
    const prefix = m ? m[1] : '';
    const charBefore = before[before.length - prefix.length - 1];
    return { prefix, isMember: charBefore === '.' };
  }

  function localNames() {
    const names = new Set();
    for (const m of ta.value.matchAll(/[A-Za-z_]\w{1,}/g)) {
      if (!STOP_WORDS.has(m[0])) names.add(m[0]);
    }
    return [...names].slice(0, 300);
  }

  function openPopup(force = false) {
    const { prefix, isMember } = contextAtCaret();
    if (!force && !isMember && prefix.length < 1) return closePopup();

    const items = completionsFor(lang, prefix, isMember, isMember ? [] : localNames());
    if (!items.length) return closePopup();

    pop.open = true;
    pop.items = items;
    pop.prefix = prefix;
    pop.sel = 0;
    ac.classList.remove('hidden');
    drawPopup();
    placePopup();
  }

  function closePopup() {
    if (!pop.open) return;
    pop.open = false;
    pop.items = [];
    ac.classList.add('hidden');
  }

  function drawPopup() {
    acList.innerHTML = pop.items.map((it, i) => `
      <div class="ac-item${i === pop.sel ? ' sel' : ''}" data-i="${i}">
        <span class="ac-kind k-${it.kind}">${esc(KIND_LABEL[it.kind] || it.kind)}</span>
        <span class="ac-label">${esc(it.label)}</span>
      </div>`).join('');
    const cur = pop.items[pop.sel];
    // Ví dụ kèm kết quả là thứ giải thích nhanh nhất -> hiện ngay trong bảng gợi ý,
    // không bắt người học rời trang đi tra.
    acDoc.innerHTML = cur
      ? `<code>${esc(cur.detail || cur.label)}</code>`
        + (cur.doc ? `<span>${esc(cur.doc)}</span>` : '')
        + (cur.ex?.length ? `<span class="ac-ex">${esc(cur.ex[0])}</span>` : '')
      : '';
    // tự cuộn danh sách (không dùng scrollIntoView để trang phía sau không bị nhảy)
    const sel = acList.querySelector('.sel');
    if (sel) {
      const top = sel.offsetTop;
      const bottom = top + sel.offsetHeight;
      if (top < acList.scrollTop) acList.scrollTop = top;
      else if (bottom > acList.scrollTop + acList.clientHeight) acList.scrollTop = bottom - acList.clientHeight;
    }
  }

  function placePopup() {
    const upto = ta.value.slice(0, ta.selectionStart);
    const row = (upto.match(/\n/g) || []).length;
    const col = upto.length - upto.lastIndexOf('\n') - 1 - pop.prefix.length;
    const gw = root.querySelector('.ed-gutter').offsetWidth;
    const maxX = root.clientWidth - ac.offsetWidth - 8;
    const x = Math.max(4, Math.min(maxX, gw + PAD_X + col * charW - ta.scrollLeft));
    let y = PAD_Y + (row + 1) * LINE_H - ta.scrollTop + 4;
    if (y + ac.offsetHeight > root.clientHeight && y - ac.offsetHeight - LINE_H - 8 > 0) {
      y = y - ac.offsetHeight - LINE_H - 8;   // không đủ chỗ bên dưới thì lật lên trên
    }
    ac.style.left = `${x}px`;
    ac.style.top = `${y}px`;
  }

  function moveSel(d) {
    pop.sel = (pop.sel + d + pop.items.length) % pop.items.length;
    drawPopup();
  }

  function accept(it) {
    const text = it.insert || it.label;
    const end = ta.selectionStart;
    const start = end - pop.prefix.length;
    const base = indentOf(ta.value.slice(lineStartOf(start), start));
    let body = text.replace(/\n/g, '\n' + base);
    // "$|" là chỗ đặt con trỏ. Mẫu code có thể ghi nhiều chỗ (ví dụ mẫu đếm tần suất
    // nhắc lại tên biến ba lần) -> con trỏ đặt ở chỗ ĐẦU TIÊN, các dấu còn lại phải
    // được xoá hết, nếu không chúng nằm lại trong code của người học.
    let caret = body.indexOf('$|');
    body = body.split('$|').join('');
    if (caret < 0) caret = body.length;
    closePopup();
    replaceRange(start, end, body, start + caret);
    ta.focus();
  }

  acList.addEventListener('mousedown', (e) => {
    const el = e.target.closest('.ac-item');
    if (!el) return;
    e.preventDefault();
    accept(pop.items[Number(el.dataset.i)]);
  });

  /* ------------------------------ phím ------------------------------ */
  ta.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter luôn là "chạy & chấm điểm", kể cả khi bảng gợi ý đang mở
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      closePopup();
      onRun?.();
      return;
    }

    if (e.ctrlKey && e.code === 'Space') { e.preventDefault(); openPopup(true); return; }

    if (pop.open) {
      if (e.key === 'ArrowDown') { e.preventDefault(); return moveSel(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); return moveSel(-1); }
      if (e.key === 'Escape') { e.preventDefault(); return closePopup(); }
      if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); return accept(pop.items[pop.sel]); }
    }

    if (e.key === 'Tab') { e.preventDefault(); return handleTab(e.shiftKey); }
    if (e.key === 'Enter') { e.preventDefault(); return handleEnter(); }
    if (e.key === 'Backspace') return handleBackspace(e);
    if (e.key.length === 1) return handleTyping(e);
  });

  function handleTab(shift) {
    const { selectionStart: s, selectionEnd: en } = ta;
    const multi = ta.value.slice(s, en).includes('\n');

    if (multi || shift) {
      const from = lineStartOf(s);
      const to = lineEndOf(en);
      const block = ta.value.slice(from, to);
      const out = block.split('\n').map((ln) => {
        if (shift) {
          const cut = ln.match(new RegExp(`^ {1,${indentSize}}|^\t`));
          return cut ? ln.slice(cut[0].length) : ln;
        }
        return ln.trim() ? indentUnit + ln : ln;
      }).join('\n');
      replaceRange(from, to, out, from, from + out.length);
      return;
    }

    const col = s - lineStartOf(s);
    const n = indentSize - (col % indentSize);
    replaceRange(s, en, ' '.repeat(n));
  }

  function handleEnter() {
    const s = ta.selectionStart;
    const lineStart = lineStartOf(s);
    const line = ta.value.slice(lineStart, s);
    const indent = indentOf(line);
    const nextCh = ta.value[ta.selectionEnd] || '';

    let opens = false;
    if (lang === 'python') opens = /:\s*(#.*)?$/.test(line);
    else opens = /[{([]\s*$/.test(line);

    let next = indent;
    if (opens) next = indent + indentUnit;
    else if (lang === 'python' && /^\s*(return|break|continue|pass|raise)\b/.test(line) && indent.length >= indentSize) {
      next = indent.slice(0, indent.length - indentSize);
    }

    // Con trỏ đang kẹp giữa cặp ngoặc: mở thành ba dòng, dấu đóng lùi về đúng cột
    if (opens && CLOSERS.has(nextCh) && lang !== 'python') {
      const body = `\n${next}\n${indent}`;
      replaceRange(ta.selectionStart, ta.selectionEnd, body, s + 1 + next.length);
      return;
    }
    replaceRange(ta.selectionStart, ta.selectionEnd, `\n${next}`);
  }

  function handleBackspace(e) {
    const s = ta.selectionStart;
    if (s !== ta.selectionEnd) return;
    const lineStart = lineStartOf(s);
    const before = ta.value.slice(lineStart, s);
    if (!before || !/^[ ]+$/.test(before)) return;   // chỉ xử lý khi trước con trỏ toàn dấu cách
    e.preventDefault();
    const back = ((before.length % indentSize) || indentSize);
    replaceRange(s - back, s, '');
  }

  function handleTyping(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const ch = e.key;
    const s = ta.selectionStart, en = ta.selectionEnd;
    const nextCh = ta.value[en] || '';

    // gõ đè ký tự đóng đã được tự thêm trước đó
    if (s === en && CLOSERS.has(ch) && nextCh === ch && !PAIRS[ch]) {
      e.preventDefault();
      ta.selectionStart = ta.selectionEnd = s + 1;
      updatePos();
      return;
    }
    if (s === en && (ch === '"' || ch === "'" || ch === '`') && nextCh === ch) {
      e.preventDefault();
      ta.selectionStart = ta.selectionEnd = s + 1;
      updatePos();
      return;
    }

    const close = PAIRS[ch];
    if (!close) return;

    // bọc vùng đang chọn
    if (s !== en) {
      e.preventDefault();
      const sel = ta.value.slice(s, en);
      replaceRange(s, en, ch + sel + close, s + 1, en + 1);
      return;
    }

    // chỉ tự đóng khi ký tự kế tiếp là khoảng trắng / dấu đóng / hết dòng
    if (nextCh && !/[\s)\]},.;:]/.test(nextCh)) return;
    if ((ch === '"' || ch === "'") && /[\w"']$/.test(ta.value.slice(0, s))) return;
    e.preventDefault();
    replaceRange(s, en, ch + close, s + 1);
  }

  /* ------------------------------ sự kiện khác ------------------------------ */
  ta.addEventListener('input', () => {
    if (quiet) return;   // replaceRange sẽ tự gọi changed() sau khi đặt lại con trỏ
    changed();
    const { prefix, isMember } = contextAtCaret();
    if (isMember || prefix.length >= 1) openPopup();
    else closePopup();
  });
  ta.addEventListener('scroll', () => { syncScroll(); if (pop.open) placePopup(); });
  ta.addEventListener('blur', closePopup);
  ta.addEventListener('click', () => { closePopup(); updatePos(); });
  ta.addEventListener('keyup', (e) => { if (/Arrow|Home|End/.test(e.key)) { updatePos(); if (pop.open) placePopup(); } });

  /* ------------------------------ khởi tạo ------------------------------ */
  function remeasure() {
    const w = measure.getBoundingClientRect().width / 10;
    if (w > 0) charW = w;
  }
  remeasure();
  document.fonts?.ready?.then(remeasure).catch(() => {});
  paint();
  updatePos();

  return {
    get value() { return ta.value; },
    set value(v) { replaceRange(0, ta.value.length, v, 0); },
    focus() { ta.focus(); },
    /** Đưa con trỏ về đầu phần code của dòng thứ n (1-based) và cuộn tới đó.
     *  Dùng khi bấm "Nhảy tới dòng N" ở thẻ giải thích lỗi. */
    gotoLine(n) {
      const lines = ta.value.split('\n');
      const row = Math.max(1, Math.min(lines.length, Math.floor(n))) - 1;
      let pos = 0;
      for (let i = 0; i < row; i++) pos += lines[i].length + 1;
      pos += indentOf(lines[row] || '').length;   // bỏ qua phần thụt lề, con trỏ vào đúng chữ đầu
      ta.focus();
      ta.setSelectionRange(pos, pos);
      // đưa dòng đó vào khoảng giữa vùng nhìn thấy
      ta.scrollTop = Math.max(0, (row + 0.5) * LINE_H - ta.clientHeight / 2);
      syncScroll();
      updatePos();
    },
    /** Chèn một mẫu code tại con trỏ (dùng cho bảng "Cú pháp thường dùng"). */
    insertSnippet(text) {
      ta.focus();
      const s = ta.selectionStart, en = ta.selectionEnd;
      const base = indentOf(ta.value.slice(lineStartOf(s), s));
      let body = String(text).replace(/\n/g, '\n' + base);
      let caret = body.indexOf('$|');
      body = body.replace('$|', '');
      if (caret < 0) caret = body.length;
      replaceRange(s, en, body, s + caret);
    },
    destroy() { if (frame) cancelAnimationFrame(frame); closePopup(); },
  };
}
