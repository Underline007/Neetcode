import { store } from './store.js';
import { TOPICS, PROBLEMS } from './data/index.js';
import { PY_TOPICS, PY_PROBLEMS } from './data/python/index.js';
import { topicHasPython } from './lang.js';
import { dueItems } from './srs.js';
import { $, $$, esc, toast } from './ui.js';

import { renderDashboard } from './views/dashboard.js';
import { renderPlan, renderTopics, renderTopic, renderProblems, mountProblems } from './views/lists.js';
import { renderProblem, mountProblem } from './views/problem.js';
import { renderQuiz, mountQuiz } from './views/quiz.js';
import { renderReview, renderStats, mountStats, renderGuide } from './views/misc.js';
import { renderPythonHome } from './views/python.js';
import { renderNotebook, mountNotebook } from './views/notebook.js';
import { renderCheatsheet, mountCheatsheet, renderDrill, mountDrill } from './views/reference.js';
import { renderBookHome, mountBookHome, renderChapter, mountChapter, unreadCount } from './views/book.js';
import { CHAPTERS } from './data/book.js';
import { buildIndex, searchIndex } from './search.js';
import { dueCount } from './drill.js';
import { startAutoSync } from './sync.js';
import { registerServiceWorker } from './pwa.js';

/** 18 chủ đề thuật toán + 5 module Python nằm CHUNG một không gian id (mỗi bài tập/chủ
 *  đề thuật toán có thể mang thêm field "...Py" để trở thành song ngữ — xem lang.js).
 *  Map tra cứu dùng chung cho mọi trang chi tiết, không cần phân biệt domain theo id nữa. */
const ALL_TOPICS = [...TOPICS, ...PY_TOPICS];
const ALL_PROBLEMS = [...PROBLEMS, ...PY_PROBLEMS];
const topicById = new Map(ALL_TOPICS.map((t) => [t.id, t]));
const problemById = new Map(ALL_PROBLEMS.map((p) => [p.id, p]));
const DETAIL_DOMAIN = { TOPICS: ALL_TOPICS, PROBLEMS: ALL_PROBLEMS, topicById, problemById, basePath: '' };

/** Domain cho các trang DANH SÁCH (/topics, /problems) — lọc theo công tắc ngôn ngữ.
 *  Ở chế độ Python: chủ đề thuật toán đã được dịch trọn vẹn (topicHasPython) + 5 module
 *  Python thuần tuý. Chủ đề thuật toán chưa dịch sẽ không xuất hiện cho tới khi có bản Python. */
function currentDomain() {
  const lang = store.get().lang;
  if (lang === 'python') {
    const readyTopics = TOPICS.filter(topicHasPython);
    const readyIds = new Set(readyTopics.map((t) => t.id));
    return {
      TOPICS: [...readyTopics, ...PY_TOPICS],
      PROBLEMS: [...PROBLEMS.filter((p) => readyIds.has(p.topic)), ...PY_PROBLEMS],
      topicById, problemById, basePath: '',
      topicsTitle: '🐍 Thư viện chủ đề (Python)',
      topicsSubtitle: 'Chủ đề thuật toán đã có bản Python hiển thị lý thuyết, bài tập và chấm điểm bằng Python thật; các module ngôn ngữ (cú pháp, OOP, decorator...) luôn bằng Python. Chủ đề thuật toán chưa kịp dịch sẽ xuất hiện dần.',
      problemsTitle: '⌨️ Ngân hàng bài tập (Python)',
    };
  }
  return {
    TOPICS, PROBLEMS, topicById, problemById, basePath: '',
    topicsTitle: '📚 Thư viện chủ đề',
    topicsSubtitle: '18 chủ đề theo đúng lộ trình neetcode.io/roadmap. Mỗi bài giảng trả lời: vấn đề gốc là gì, ý tưởng cốt lõi, dấu hiệu nhận biết, mẫu code, bẫy thường gặp và ứng dụng thực tế.',
    problemsTitle: '⌨️ Ngân hàng bài tập',
  };
}

/* ------------------------------- theme ------------------------------- */
function applyTheme() {
  document.documentElement.dataset.theme = store.get().theme || 'dark';
}
applyTheme();

$('#theme-toggle').addEventListener('click', () => {
  store.setTheme(store.get().theme === 'dark' ? 'light' : 'dark');
  applyTheme();
});

/* ------------------------------- ngôn ngữ ------------------------------- */
function applyLangSwitch() {
  const lang = store.get().lang || 'javascript';
  $$('#lang-switch button').forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('ghost', !active);
  });
}
applyLangSwitch();

$$('#lang-switch button').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.lang === store.get().lang) return;
    store.setLang(btn.dataset.lang);
    applyLangSwitch();
    // Đang xem chi tiết 1 bài/chủ đề cụ thể thì giữ nguyên trang (domain tự nhận theo id);
    // đang ở trang danh sách thì render lại theo domain vừa chọn.
    router();
  });
});

/* ------------------------------- router ------------------------------- */
const routes = [
  { re: /^\/$/, render: () => renderDashboard(currentDomain()) },
  { re: /^\/plan$/, render: () => (store.get().lang === 'python' ? renderPythonHome() : renderPlan()) },
  { re: /^\/topics$/, render: () => renderTopics(currentDomain()) },
  { re: /^\/topic\/([\w-]+)$/, render: (m) => renderTopic(m[1], DETAIL_DOMAIN) },
  { re: /^\/problems$/, render: () => renderProblems(currentDomain()), mount: () => mountProblems(currentDomain()) },
  { re: /^\/problem\/([\w-]+)$/, render: (m) => renderProblem(m[1], DETAIL_DOMAIN), mount: (m) => mountProblem(m[1], DETAIL_DOMAIN) },
  { re: /^\/quiz\/([\w-]+)$/, render: (m) => renderQuiz(m[1], DETAIL_DOMAIN), mount: (m) => mountQuiz(m[1], DETAIL_DOMAIN) },
  { re: /^\/review$/, render: () => renderReview() },
  { re: /^\/notebook$/, render: () => renderNotebook(), mount: () => mountNotebook(document) },
  { re: /^\/book$/, render: () => renderBookHome(), mount: () => mountBookHome() },
  { re: /^\/book\/([\w-]+)$/, render: (m) => renderChapter(m[1]), mount: (m) => mountChapter(m[1]) },
  { re: /^\/cheatsheet$/, render: () => renderCheatsheet(), mount: () => mountCheatsheet() },
  { re: /^\/drill$/, render: () => renderDrill(), mount: () => mountDrill() },
  { re: /^\/stats$/, render: () => renderStats(), mount: () => mountStats(document) },
  { re: /^\/guide$/, render: () => renderGuide() },
];

function currentPath() {
  const h = window.location.hash.replace(/^#/, '');
  // "?..." không phải một phần của đường dẫn để so khớp route (xem hashQuery trong ui.js)
  // — nó mang cờ như ?review=1 mà trang làm bài tự đọc riêng.
  const path = h.split('?')[0];
  return path || '/';
}

function router() {
  const path = currentPath();
  const view = $('#view');

  for (const r of routes) {
    const m = path.match(r.re);
    if (m) {
      view.innerHTML = r.render(m);
      window.scrollTo(0, 0);
      bindGlobalActions(view);
      r.mount?.(m);
      updateChrome(path);
      return;
    }
  }

  view.innerHTML = `<h1>404</h1><p class="sub">Không có trang này. <a href="#/">Về bảng điều khiển</a></p>`;
  updateChrome(path);
}

/** Nút "Sao chép" của mọi khối code (gắn một lần, bắt sự kiện nổi lên). */
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.code-copy');
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy || '');
    const old = btn.textContent;
    btn.textContent = '✅ Đã sao chép';
    setTimeout(() => { btn.textContent = old; }, 1400);
  } catch {
    toast('Trình duyệt chặn quyền truy cập clipboard — hãy bôi đen và Ctrl+C.');
  }
});

/* ------------------- thanh bên thu gọn trên điện thoại ------------------- */
/* Màn hình hẹp: thanh bên chiếm gần trọn màn hình nếu bày hết mục, phải cuộn rất lâu
   mới tới nội dung. Thu về một nút Menu, chạm mới mở. */
const sidebar = document.querySelector('.sidebar');
const navToggle = $('#nav-toggle');

function closeNav() {
  sidebar.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Chọn xong một mục thì đóng lại, khỏi phải bấm hai lần
$('#nav').addEventListener('click', (e) => { if (e.target.closest('a')) closeNav(); });
$('#pal-open').addEventListener('click', closeNav);

/* ------------------------- bảng lệnh Ctrl+K ------------------------- */
const PAGES = [
  { icon: '🏠', label: 'Bảng điều khiển', hash: '#/' },
  { icon: '🗓️', label: 'Lộ trình 30 ngày', hash: '#/plan' },
  { icon: '📚', label: 'Thư viện chủ đề', hash: '#/topics' },
  { icon: '⌨️', label: 'Ngân hàng bài tập', hash: '#/problems' },
  { icon: '🔁', label: 'Ôn tập ngắt quãng', hash: '#/review' },
  { icon: '📔', label: 'Sổ tay', hash: '#/notebook' },
  { icon: '📖', label: 'Sách: Python từ cú pháp tới thực hành', hash: '#/book' },
  { icon: '🔎', label: 'Tra cứu nhanh (cú pháp & cấu trúc dữ liệu)', hash: '#/cheatsheet' },
  { icon: '🧠', label: 'Luyện nhớ (thẻ ghi nhớ)', hash: '#/drill' },
  { icon: '📈', label: 'Thống kê & điểm', hash: '#/stats' },
  { icon: '🧭', label: 'Cách dùng app', hash: '#/guide' },
];

/** Một chỉ mục duy nhất cho mọi thứ điều hướng được. Dựng một lần, dùng suốt phiên. */
const palIndex = [
  ...buildIndex(PAGES, (x) => ({ fields: [x.label], kind: 'Trang', icon: x.icon, label: x.label, hash: x.hash, sub: '' })),
  ...buildIndex(ALL_TOPICS, (t) => ({
    fields: [t.name, t.en, t.id], kind: 'Chủ đề', icon: t.icon, label: t.name,
    hash: `#/topic/${t.id}`, sub: t.en,
  })),
  ...buildIndex(CHAPTERS, (c) => ({
    fields: [c.title, c.subtitle, c.id], kind: 'Chương sách', icon: c.icon, label: c.title,
    hash: `#/book/${c.id}`, sub: `${c.minutes} phút đọc`,
  })),
  ...buildIndex(ALL_PROBLEMS, (p) => ({
    fields: [p.title, p.en, p.id, p.topicName], kind: 'Bài tập', icon: '⌨️', label: p.title,
    hash: `#/problem/${p.id}`, sub: `${p.en} · ${p.topicIcon} ${p.topicName}`, difficulty: p.difficulty, id: p.id,
  })),
];

const DIFF_VI = { Easy: 'Dễ', Medium: 'TB', Hard: 'Khó' };
const pal = { open: false, items: [], sel: 0 };

function palRender() {
  const st = store.get();
  const list = $('#pal-list');
  if (!pal.items.length) {
    list.innerHTML = '<div class="pal-empty">Không tìm thấy gì khớp. Thử gõ ít chữ hơn, hoặc gõ tên tiếng Anh của bài.</div>';
    return;
  }
  list.innerHTML = pal.items.map((it, i) => `
    <div class="pal-item${i === pal.sel ? ' sel' : ''}" data-i="${i}">
      <span class="pal-icon">${it.icon}</span>
      <span class="pal-main">
        <span class="pal-label">${esc(it.label)}</span>
        ${it.sub ? `<span class="pal-sub">${esc(it.sub)}</span>` : ''}
      </span>
      ${it.id && st.problems[it.id]?.solved ? '<span class="pal-tag ok">đã giải</span>' : ''}
      ${it.difficulty ? `<span class="pal-tag ${it.difficulty.toLowerCase()}">${DIFF_VI[it.difficulty]}</span>` : ''}
      <span class="pal-kind">${it.kind}</span>
    </div>`).join('');
  const sel = list.querySelector('.sel');
  if (sel) {
    const top = sel.offsetTop, bottom = top + sel.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }
}

function palSearch(q) {
  pal.items = searchIndex(palIndex, q, 40);
  pal.sel = 0;
  palRender();
}

function palOpen() {
  if (pal.open) return;
  pal.open = true;
  $('#palette').classList.remove('hidden');
  const input = $('#pal-q');
  input.value = '';
  input.focus();
  palSearch('');
}

function palClose() {
  if (!pal.open) return;
  pal.open = false;
  $('#palette').classList.add('hidden');
}

function palGo(i) {
  const it = pal.items[i];
  if (!it) return;
  palClose();
  window.location.hash = it.hash.replace(/^#/, '');
}

$('#pal-open').addEventListener('click', palOpen);
$('#pal-q').addEventListener('input', (e) => palSearch(e.target.value));
$('#pal-list').addEventListener('mousedown', (e) => {
  const el = e.target.closest('.pal-item');
  if (!el) return;
  e.preventDefault();
  palGo(Number(el.dataset.i));
});
// bấm ra ngoài hộp thì đóng
$('#palette').addEventListener('mousedown', (e) => { if (e.target.id === 'palette') palClose(); });

document.addEventListener('keydown', (e) => {
  // Ctrl/⌘ + K: mở/đóng ở bất cứ đâu, kể cả khi con trỏ đang trong editor
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    pal.open ? palClose() : palOpen();
    return;
  }

  if (!pal.open) {
    // "/" là lối tắt quen thuộc, nhưng KHÔNG được cướp phím khi đang gõ text
    const t = e.target;
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      palOpen();
    }
    return;
  }

  if (e.key === 'Escape') { e.preventDefault(); palClose(); return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); pal.sel = (pal.sel + 1) % Math.max(1, pal.items.length); palRender(); return; }
  if (e.key === 'ArrowUp') { e.preventDefault(); pal.sel = (pal.sel - 1 + pal.items.length) % Math.max(1, pal.items.length); palRender(); return; }
  if (e.key === 'Enter') { e.preventDefault(); palGo(pal.sel); }
});

function bindGlobalActions(root) {
  $$('[data-action="start-plan"]', root).forEach((btn) =>
    btn.addEventListener('click', () => {
      store.startPlan();
      store.touchStreak();
      toast('Bắt đầu lộ trình! Chúc bạn kiên trì 30 ngày.');
      router();
    })
  );
}

function updateChrome(path) {
  const st = store.get();
  $('#xp-total').textContent = st.xp;
  $('#streak-total').textContent = `${st.streak.count} 🔥`;

  const due = dueItems(st, ALL_PROBLEMS).length;
  const badge = $('#due-badge');
  badge.textContent = due;
  badge.classList.toggle('hidden', due === 0);

  const cards = dueCount(st);
  const cardBadge = $('#card-badge');
  cardBadge.textContent = cards;
  cardBadge.classList.toggle('hidden', cards === 0);

  const unread = unreadCount(st);
  const bookBadge = $('#book-badge');
  bookBadge.textContent = unread;
  bookBadge.classList.toggle('hidden', unread === 0);

  $$('#nav a').forEach((a) => {
    const route = a.dataset.route;
    const active = route === '/' ? path === '/' : path.startsWith(route);
    a.classList.toggle('active', active);
  });
}

registerServiceWorker();

window.addEventListener('hashchange', router);
window.addEventListener('progress-changed', () => updateChrome(currentPath()));

/* --------------------- đồng bộ tiến độ giữa nhiều máy --------------------- */
window.addEventListener('sync-applied', (e) => {
  const { newSolved = 0, xpGained = 0 } = e.detail || {};
  const parts = [];
  if (newSolved > 0) parts.push(`${newSolved} bài đã giải`);
  if (xpGained > 0) parts.push(`+${xpGained} điểm`);
  toast(parts.length ? `Đã nhận tiến độ từ máy khác: ${parts.join(' · ')}.` : 'Đã đồng bộ tiến độ.');

  // Vẽ lại trang để số liệu khớp ngay — trừ trang làm bài, vì render lại sẽ
  // xoá mất code người học đang gõ dở.
  if (!currentPath().startsWith('/problem/')) router();
});

router();
startAutoSync();
