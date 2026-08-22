/**
 * 📖 Trình đọc sách — tối ưu cho việc đọc trên ĐIỆN THOẠI.
 *
 * Vì sao cần riêng một trình đọc thay vì đọc thẳng trang bài giảng:
 *   - Trang bài giảng bày cùng lúc quiz, danh sách bài tập, tiến độ — hợp khi ngồi máy,
 *     nhưng trên điện thoại thì đó là nhiễu.
 *   - Đọc trên điện thoại cần: cỡ chữ chỉnh được, cột chữ hẹp, NHỚ ĐÚNG CHỖ ĐANG ĐỌC,
 *     và đi tiếp chương sau bằng một lần chạm.
 *
 * Toàn bộ nội dung lấy từ data/book.js (cẩm nang viết riêng + 15 module sẵn có),
 * không có bản sao thứ hai của bài giảng.
 */

import { BOOK_PARTS, CHAPTERS, BOOK_MINUTES, chapterById, neighbours, outlineOf, slugify } from '../data/book.js';
import { store } from '../store.js';
import { md } from '../markdown.js';
import { $, $$, esc, bar, toast } from '../ui.js';
import { pwa } from '../pwa.js';

/* ==================================================================== */
/*                          BÌA SÁCH & MỤC LỤC                          */
/* ==================================================================== */

export function renderBookHome() {
  const r = store.reader();
  const doneCount = CHAPTERS.filter((c) => r.read[c.id]).length;
  const pct = Math.round((doneCount / CHAPTERS.length) * 100);
  const conLai = CHAPTERS.filter((c) => !r.read[c.id]).reduce((s, c) => s + c.minutes, 0);

  const dangDoc = r.lastChapter && chapterById.has(r.lastChapter) ? chapterById.get(r.lastChapter) : null;
  const tiepTheo = CHAPTERS.find((c) => !r.read[c.id]);

  return `
    <h1>📖 Sách: Python từ cú pháp tới thực hành</h1>
    <p class="sub">${CHAPTERS.length} chương · khoảng ${BOOK_MINUTES} phút đọc.
      Đọc được cả khi không có mạng — cứ mở app là có.</p>

    <div class="card book-cover">
      <div class="row">
        <div style="flex:1;min-width:200px">
          <div class="row small muted"><span>Đã đọc ${doneCount}/${CHAPTERS.length} chương</span>
            <span class="spacer"></span><span>${conLai > 0 ? `còn ~${conLai} phút` : 'xong toàn bộ 🎉'}</span></div>
          <div style="margin-top:8px">${bar(pct, true)}</div>
        </div>
      </div>
      <div class="row" style="margin-top:14px">
        ${dangDoc && !r.read[dangDoc.id]
          ? `<a class="btn" href="#/book/${dangDoc.id}">▶ Đọc tiếp: ${esc(dangDoc.title)}</a>`
          : tiepTheo
            ? `<a class="btn" href="#/book/${tiepTheo.id}">▶ ${doneCount ? 'Đọc chương tiếp theo' : 'Bắt đầu đọc'}: ${esc(tiepTheo.title)}</a>`
            : `<a class="btn" href="#/book/${CHAPTERS[0].id}">Đọc lại từ đầu</a>`}
      </div>
    </div>

    <div id="offline-box">${offlineCard()}</div>

    ${BOOK_PARTS.map((part, i) => {
      const done = part.chapters.filter((c) => r.read[c.id]).length;
      // Đầu mỗi nhóm (Cẩm nang / Lộ trình) chèn một dải phân cách để mục lục có cấu trúc
      const moNhom = i === 0 || BOOK_PARTS[i - 1].group !== part.group;
      const soChuong = BOOK_PARTS.filter((x) => x.group === part.group).reduce((n, x) => n + x.chapters.length, 0);
      return `
        ${moNhom ? `<div class="book-group"><span>${esc(part.group)}</span><span class="muted small">${soChuong} chương</span></div>` : ''}
        <h2>${part.icon} ${esc(part.title)} <span class="badge${done === part.chapters.length ? ' ok' : ''}">${done}/${part.chapters.length}</span></h2>
        <p class="muted small" style="margin-top:-4px">${esc(part.blurb)}</p>
        <div class="list toc-list">
          ${part.chapters.map((c, i) => {
            const daDoc = !!r.read[c.id];
            const dangO = r.positions[c.id] > 0 && !daDoc;
            return `<a class="list-item toc-item" href="#/book/${c.id}">
              <span class="toc-num">${daDoc ? '✅' : String(i + 1).padStart(2, '0')}</span>
              <span class="t">${c.icon} ${esc(c.title)}</span>
              <span class="spacer"></span>
              ${dangO ? `<span class="badge accent">đang đọc ${r.positions[c.id]}%</span>` : ''}
              <span class="m">${c.minutes} phút</span>
            </a>`;
          }).join('')}
        </div>`;
    }).join('')}
  `;
}

/** Trạng thái đọc ngoại tuyến. Nói rõ cả thứ CHẠY ĐƯỢC lẫn thứ KHÔNG, để không hứa quá. */
function offlineCard() {
  if (!pwa.isSupported()) {
    return `<div class="card tight offline-box">
      <strong>ℹ️ Trình duyệt này không hỗ trợ đọc ngoại tuyến</strong>
      <p class="muted small" style="margin:6px 0 0">Sách vẫn đọc bình thường khi có mạng.
        (Chế độ ngoại tuyến cần trang chạy qua HTTPS hoặc localhost — mở thẳng file trên máy thì không dùng được.)</p>
    </div>`;
  }

  const offline = !pwa.isOnline();
  const daCai = pwa.isInstalled();

  return `<div class="card tight offline-box${offline ? ' is-offline' : ''}">
    <div class="row">
      <strong>${offline ? '📴 Đang ngoại tuyến — vẫn đọc được' : '📶 Sẵn sàng đọc khi mất mạng'}</strong>
      <span class="spacer"></span>
      ${pwa.hasUpdate() ? '<button class="btn small" data-pwa="update">Có bản mới — cập nhật</button>' : ''}
      ${!daCai && pwa.canInstall() ? '<button class="btn small" data-pwa="install">📲 Cài lên màn hình chính</button>' : ''}
      ${daCai ? '<span class="badge ok">đã cài như ứng dụng</span>' : ''}
    </div>
    <p class="muted small" style="margin:8px 0 0">
      Đọc sách, tra cứu, luyện thẻ và làm bài <strong>JavaScript</strong> chạy hoàn toàn không cần mạng.
      Riêng chấm bài <strong>Python</strong> vẫn cần mạng ở lần chạy đầu mỗi phiên để tải môi trường Python.
    </p>
    ${!daCai && !pwa.canInstall() ? '<p class="muted small" style="margin:6px 0 0">Trên iPhone: bấm <strong>Chia sẻ → Thêm vào MH chính</strong>. Trên Android: menu <strong>⋮ → Cài đặt ứng dụng</strong>.</p>' : ''}
  </div>`;
}

export function mountBookHome() {
  const box = $('#offline-box');
  if (!box) return;

  const redraw = () => { box.innerHTML = offlineCard(); };
  window.addEventListener('pwa-changed', redraw);

  box.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-pwa]');
    if (!btn) return;
    if (btn.dataset.pwa === 'install') {
      const ok = await pwa.promptInstall();
      toast(ok ? 'Đang cài — mở app từ màn hình chính là đọc được ngay cả khi mất mạng.' : 'Bạn đã bỏ qua cài đặt.');
    } else if (btn.dataset.pwa === 'update') {
      toast('Đang cập nhật…');
      pwa.applyUpdate();
    }
  });
}

/* ==================================================================== */
/*                            ĐỌC MỘT CHƯƠNG                            */
/* ==================================================================== */

export function renderChapter(id) {
  const c = chapterById.get(id);
  if (!c) return '<h1>Không tìm thấy chương này</h1><p class="sub"><a href="#/book">← Về mục lục</a></p>';

  const r = store.reader();
  const { prev, next, index } = neighbours(id);
  const outline = outlineOf(c.body);
  const daDoc = !!r.read[id];

  return `
    <div class="reader" style="--reader-font:${r.fontSize}px">
      <div class="reader-bar">
        <a class="btn ghost tiny" href="#/book">☰ Mục lục</a>
        ${outline.length ? '<button class="btn ghost tiny" id="rd-outline">Trong chương</button>' : ''}
        <span class="spacer"></span>
        <button class="btn ghost tiny" id="rd-smaller" title="Chữ nhỏ hơn">A−</button>
        <span class="muted tiny-label" id="rd-size">${r.fontSize}</span>
        <button class="btn ghost tiny" id="rd-bigger" title="Chữ to hơn">A+</button>
      </div>
      <div class="reader-progress"><i id="rd-progress" style="width:0%"></i></div>

      <article class="reader-body">
        <div class="reader-head">
          <div class="muted small">Chương ${index + 1}/${CHAPTERS.length} · ${c.minutes} phút đọc</div>
          <h1>${c.icon} ${esc(c.title)}</h1>
          ${c.subtitle ? `<p class="sub">${esc(c.subtitle)}</p>` : ''}
        </div>

        ${outline.length ? `
          <nav class="reader-toc hidden" id="rd-toc">
            <div class="k">Trong chương này</div>
            <ol>${outline.map((o) => `<li><a href="#" data-goto="${o.slug}">${esc(o.text)}</a></li>`).join('')}</ol>
          </nav>` : ''}

        <div class="md reader-md" id="rd-content">${withAnchors(c.body)}</div>

        <div class="reader-end">
          <button class="btn${daDoc ? ' ghost' : ''}" id="rd-done">${daDoc ? '✅ Đã đọc xong chương này' : 'Đánh dấu đã đọc'}</button>
          ${c.topicId ? `<a class="btn ghost" href="#/topic/${c.topicId}">⌨️ Làm bài tập chương này</a>` : ''}
        </div>

        <div class="row reader-nav">
          ${prev ? `<a class="btn ghost small" href="#/book/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}
          <span class="spacer"></span>
          ${next ? `<a class="btn small" href="#/book/${next.id}">${esc(next.title)} →</a>`
                 : '<a class="btn small" href="#/book">🎉 Hết sách — về mục lục</a>'}
        </div>
      </article>
    </div>`;
}

/** Gắn id neo cho mỗi heading `##` để mục lục trong chương nhảy tới được. */
function withAnchors(body) {
  let html = md(body);
  html = html.replace(/<h2>(.*?)<\/h2>/g, (_, inner) => {
    const plain = inner.replace(/<[^>]+>/g, '');
    return `<h2 id="rd-${slugify(plain)}">${inner}</h2>`;
  });
  return html;
}

export function mountChapter(id) {
  const c = chapterById.get(id);
  if (!c) return;
  const r = store.reader();

  /* ---- cỡ chữ ---- */
  const root = $('.reader');
  const applySize = (px) => {
    root.style.setProperty('--reader-font', `${px}px`);
    $('#rd-size').textContent = px;
  };
  $('#rd-smaller').addEventListener('click', () => applySize(store.setFontSize(store.reader().fontSize - 1)));
  $('#rd-bigger').addEventListener('click', () => applySize(store.setFontSize(store.reader().fontSize + 1)));

  /* ---- mục lục trong chương ---- */
  const toc = $('#rd-toc');
  $('#rd-outline')?.addEventListener('click', () => toc?.classList.toggle('hidden'));
  toc?.addEventListener('click', (e) => {
    const a = e.target.closest('[data-goto]');
    if (!a) return;
    e.preventDefault();
    document.getElementById(`rd-${a.dataset.goto}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toc.classList.add('hidden');
  });

  /* ---- đánh dấu đã đọc ---- */
  const doneBtn = $('#rd-done');
  doneBtn.addEventListener('click', () => {
    const on = store.markChapterRead(id, !store.reader().read[id]);
    doneBtn.textContent = on ? '✅ Đã đọc xong chương này' : 'Đánh dấu đã đọc';
    doneBtn.classList.toggle('ghost', on);
    if (on) toast('Đã đánh dấu đọc xong. Mục lục sẽ ghi nhớ.');
  });

  /* ---- theo dõi & khôi phục vị trí đọc ---- */
  const progressEl = $('#rd-progress');

  const percentNow = () => {
    const doc = document.documentElement;
    const canScroll = doc.scrollHeight - window.innerHeight;
    // Chương ngắn hơn màn hình thì coi như đã đọc hết ngay khi mở
    if (canScroll <= 8) return 100;
    return (window.scrollY / canScroll) * 100;
  };

  let saveTimer = null;
  const onScroll = () => {
    // Rời trang rồi thì gỡ listener (view đã bị thay, không còn phần tử)
    if (!document.body.contains(progressEl)) {
      window.removeEventListener('scroll', onScroll);
      return;
    }
    const p = percentNow();
    progressEl.style.width = `${Math.min(100, Math.max(0, p))}%`;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      store.saveReadingSpot(id, p);
      if (store.reader().read[id] && doneBtn.textContent !== '✅ Đã đọc xong chương này') {
        doneBtn.textContent = '✅ Đã đọc xong chương này';
        doneBtn.classList.add('ghost');
      }
    }, 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Khôi phục đúng chỗ đang đọc dở (router đã cuộn về 0 trước khi mount).
  const saved = r.positions[id];
  if (saved > 2 && saved < 95) {
    requestAnimationFrame(() => {
      const canScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: (saved / 100) * canScroll, behavior: 'instant' });
      onScroll();
      toast(`Tiếp tục từ chỗ đang đọc dở (${saved}%)`);
    });
  } else {
    onScroll();
  }
}

/** Số chương chưa đọc — dùng cho badge ở thanh bên. */
export function unreadCount(state = store.get()) {
  const read = state.reader?.read || {};
  return CHAPTERS.filter((c) => !read[c.id]).length;
}
