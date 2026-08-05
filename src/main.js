import { store } from './store.js';
import { TOPICS, PROBLEMS } from './data/index.js';
import { PY_TOPICS, PY_PROBLEMS } from './data/python/index.js';
import { topicHasPython } from './lang.js';
import { dueItems } from './srs.js';
import { $, $$, toast } from './ui.js';

import { renderDashboard } from './views/dashboard.js';
import { renderPlan, renderTopics, renderTopic, renderProblems } from './views/lists.js';
import { renderProblem, mountProblem } from './views/problem.js';
import { renderQuiz, mountQuiz } from './views/quiz.js';
import { renderReview, renderStats, mountStats, renderGuide } from './views/misc.js';
import { renderPythonHome } from './views/python.js';

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
  { re: /^\/$/, render: () => renderDashboard() },
  { re: /^\/plan$/, render: () => (store.get().lang === 'python' ? renderPythonHome() : renderPlan()) },
  { re: /^\/topics$/, render: () => renderTopics(currentDomain()) },
  { re: /^\/topic\/([\w-]+)$/, render: (m) => renderTopic(m[1], DETAIL_DOMAIN) },
  { re: /^\/problems$/, render: () => renderProblems(currentDomain()) },
  { re: /^\/problem\/([\w-]+)$/, render: (m) => renderProblem(m[1], DETAIL_DOMAIN), mount: (m) => mountProblem(m[1], DETAIL_DOMAIN) },
  { re: /^\/quiz\/([\w-]+)$/, render: (m) => renderQuiz(m[1], DETAIL_DOMAIN), mount: (m) => mountQuiz(m[1], DETAIL_DOMAIN) },
  { re: /^\/review$/, render: () => renderReview() },
  { re: /^\/stats$/, render: () => renderStats(), mount: () => mountStats(document) },
  { re: /^\/guide$/, render: () => renderGuide() },
];

function currentPath() {
  const h = window.location.hash.replace(/^#/, '');
  return h || '/';
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

  $$('#nav a').forEach((a) => {
    const route = a.dataset.route;
    const active = route === '/' ? path === '/' : path.startsWith(route);
    a.classList.toggle('active', active);
  });
}

window.addEventListener('hashchange', router);
window.addEventListener('progress-changed', () => updateChrome(currentPath()));
router();
