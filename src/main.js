import { store } from './store.js';
import { PROBLEMS } from './data/index.js';
import { dueItems } from './srs.js';
import { $, $$, toast } from './ui.js';

import { renderDashboard } from './views/dashboard.js';
import { renderPlan, renderTopics, renderTopic, renderProblems } from './views/lists.js';
import { renderProblem, mountProblem } from './views/problem.js';
import { renderQuiz, mountQuiz } from './views/quiz.js';
import { renderReview, renderStats, mountStats, renderGuide } from './views/misc.js';

/* ------------------------------- theme ------------------------------- */
function applyTheme() {
  document.documentElement.dataset.theme = store.get().theme || 'dark';
}
applyTheme();

$('#theme-toggle').addEventListener('click', () => {
  store.setTheme(store.get().theme === 'dark' ? 'light' : 'dark');
  applyTheme();
});

/* ------------------------------- router ------------------------------- */
const routes = [
  { re: /^\/$/, render: () => renderDashboard() },
  { re: /^\/plan$/, render: () => renderPlan() },
  { re: /^\/topics$/, render: () => renderTopics() },
  { re: /^\/topic\/([\w-]+)$/, render: (m) => renderTopic(m[1]) },
  { re: /^\/problems$/, render: () => renderProblems() },
  { re: /^\/problem\/([\w-]+)$/, render: (m) => renderProblem(m[1]), mount: (m) => mountProblem(m[1]) },
  { re: /^\/quiz\/([\w-]+)$/, render: (m) => renderQuiz(m[1]), mount: (m) => mountQuiz(m[1]) },
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

  const due = dueItems(st, PROBLEMS).length;
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
