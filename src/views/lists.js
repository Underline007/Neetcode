import { TOPICS, PROBLEMS, PLAN, problemById, topicById } from '../data/index.js';
import { store } from '../store.js';
import { topicMastery, BASE_POINTS, grade } from '../scoring.js';
import { md } from '../markdown.js';
import { bar, diffClass, diffLabel, esc, inlineMd } from '../ui.js';
import { nextDueLabel } from '../srs.js';
import { pick } from '../lang.js';

const curLang = () => store.get().lang || 'javascript';

/** Domain mặc định = lộ trình JavaScript/NeetCode. Lộ trình Python truyền domain riêng
 *  (xem data/python/index.js) để tái dùng toàn bộ UI thư viện chủ đề/bài tập bên dưới. */
const JS_DOMAIN = {
  TOPICS, PROBLEMS, topicById,
  basePath: '',
  topicsTitle: '📚 Thư viện chủ đề',
  topicsSubtitle: '18 chủ đề theo đúng lộ trình neetcode.io/roadmap. Mỗi bài giảng trả lời: vấn đề gốc là gì, ý tưởng cốt lõi, dấu hiệu nhận biết, mẫu code, bẫy thường gặp và ứng dụng thực tế.',
  problemsTitle: '⌨️ Ngân hàng bài tập',
};

/* ------------------------------- LỘ TRÌNH ------------------------------- */
export function renderPlan() {
  const st = store.get();
  const cur = store.currentDay();

  return `
    <h1>🗓️ Lộ trình 30 ngày</h1>
    <p class="sub">Mỗi ngày 90–120 phút. Thứ tự đã được sắp để kiến thức ngày sau dựa trên ngày trước — hãy bám sát thứ tự.</p>

    ${cur === null ? `
      <div class="card" style="border-color:var(--accent)">
        <div class="row">
          <div>
            <strong>Chưa bắt đầu lộ trình</strong>
            <div class="muted small">Bấm bắt đầu để hệ thống theo dõi tiến độ theo ngày.</div>
          </div>
          <span class="spacer"></span>
          <button class="btn" data-action="start-plan">Bắt đầu</button>
        </div>
      </div>` : `<p class="muted">Bạn đang ở <strong>ngày ${cur}</strong>. Bắt đầu từ ${new Date(st.startedAt).toLocaleDateString('vi-VN')}.</p>`}

    <div class="grid" style="margin-top:14px">
      ${PLAN.map((d) => dayCard(d, st, cur)).join('')}
    </div>
  `;
}

function dayCard(d, st, cur) {
  const done = d.problems.every((id) => st.problems[id]?.solved);
  const isToday = cur === d.day;
  return `
    <div class="day${done ? ' done' : ''}${isToday ? ' today' : ''}">
      <div class="num">${d.day}</div>
      <div style="flex:1">
        <div class="row" style="gap:6px">
          ${d.topics.map((id) => {
            const t = topicById.get(id);
            return `<a class="badge accent" style="text-decoration:none" href="#/topic/${id}">${t.icon} ${esc(t.name)}</a>`;
          }).join('')}
          ${d.quiz ? `<a class="badge" style="text-decoration:none" href="#/quiz/${d.quiz}">🧠 Quiz</a>` : ''}
          ${isToday ? '<span class="badge accent">Hôm nay</span>' : ''}
        </div>
        <p class="muted small" style="margin:8px 0">${inlineMd(d.focus)}</p>
        <div class="pill-row">
          ${d.problems.map((id) => {
            const p = problemById.get(id);
            const solved = st.problems[id]?.solved;
            return `<a class="badge ${solved ? 'ok' : diffClass(p.difficulty)}" style="text-decoration:none"
              href="#/problem/${id}">${solved ? '✓ ' : ''}${esc(p.title)}</a>`;
          }).join('')}
        </div>
      </div>
    </div>`;
}

/* ------------------------------ CHỦ ĐỀ ------------------------------ */
export function renderTopics(domain = JS_DOMAIN) {
  const { TOPICS, PROBLEMS, basePath, topicsTitle, topicsSubtitle } = domain;
  const st = store.get();
  const lang = curLang();
  return `
    <h1>${topicsTitle}</h1>
    <p class="sub">${topicsSubtitle}</p>
    <div class="grid c2">
      ${TOPICS.map((t) => {
        const m = topicMastery(t, PROBLEMS, st);
        const list = PROBLEMS.filter((p) => p.topic === t.id);
        const solved = list.filter((p) => st.problems[p.id]?.solved).length;
        const quizLen = pick(t, 'quiz', lang).length;
        return `<a class="card card-link" href="#${basePath}/topic/${t.id}">
          <div class="row"><strong>${t.icon} ${esc(t.name)}</strong><span class="spacer"></span><span class="badge${m >= 80 ? ' ok' : ''}">${m}%</span></div>
          <div class="muted small" style="margin:2px 0 8px">${esc(t.en)}${t.days ? ` · Ngày ${t.days.join(', ')}` : ''}</div>
          <p class="small" style="margin:0 0 10px">${esc(t.summary)}</p>
          ${bar(m, true)}
          <div class="muted small" style="margin-top:8px">${solved}/${list.length} bài · ${quizLen} câu quiz</div>
        </a>`;
      }).join('')}
    </div>`;
}

export function renderTopic(id, domain = JS_DOMAIN) {
  const { PROBLEMS, topicById, basePath } = domain;
  const t = topicById.get(id);
  if (!t) return '<h1>Không tìm thấy chủ đề</h1>';
  const st = store.get();
  const lang = curLang();
  const lesson = pick(t, 'lesson', lang);
  const quizQs = pick(t, 'quiz', lang);
  const list = PROBLEMS.filter((p) => p.topic === t.id);
  const quiz = st.quizzes[t.id];

  store.markLessonRead(t.id);

  return `
    <div class="row">
      <a class="btn ghost small" href="#${basePath}/topics">← Thư viện</a>
      <span class="spacer"></span>
      ${t.days ? `<span class="badge">Ngày ${t.days.join(', ')}</span>` : ''}
    </div>

    <h1 style="margin-top:14px">${t.icon} ${esc(t.name)}</h1>
    <p class="sub">${esc(t.en)} — ${esc(t.summary)}</p>

    <div class="card md">${md(lesson)}</div>

    <h2>🧠 Kiểm tra hiểu bản chất</h2>
    <div class="card">
      <p style="margin-top:0">${quizQs.length} câu hỏi khái niệm. Đây là phần quan trọng nhất — giải được bài mà không hiểu bản chất thì tuần sau bạn sẽ quên sạch.</p>
      <div class="row">
        <a class="btn" href="#${basePath}/quiz/${t.id}">${quiz ? 'Làm lại quiz' : 'Làm quiz'}</a>
        ${quiz ? `<span class="badge${quiz.best >= 75 ? ' ok' : ''}">Điểm cao nhất: ${quiz.best}%</span>` : ''}
      </div>
    </div>

    <h2>⌨️ Bài tập của chủ đề</h2>
    <div class="list">
      ${list.map((p) => problemRow(p, st, basePath)).join('')}
    </div>
  `;
}

/* ------------------------------ BÀI TẬP ------------------------------ */
export function renderProblems(domain = JS_DOMAIN) {
  const { TOPICS, PROBLEMS, basePath, problemsTitle } = domain;
  const st = store.get();
  return `
    <h1>${problemsTitle}</h1>
    <p class="sub">${PROBLEMS.length} bài, sắp theo thứ tự học. Mỗi bài có 3 bậc gợi ý, chẩn đoán tự động khi sai, phân tích lời giải và câu hỏi độ phức tạp.</p>
    ${TOPICS.map((t) => {
      const list = PROBLEMS.filter((p) => p.topic === t.id);
      return `<h2>${t.icon} ${esc(t.name)}</h2>
        <div class="list">${list.map((p) => problemRow(p, st, basePath)).join('')}</div>`;
    }).join('')}
  `;
}

export function problemRow(p, st, basePath = '') {
  const rec = st.problems[p.id];
  const g = rec && rec.best ? grade(rec.best, p.difficulty) : null;
  return `<a class="list-item" href="#${basePath}/problem/${p.id}">
    <span>${rec?.solved ? '✅' : '⬜'}</span>
    <span class="t">${esc(p.title)}</span>
    <span class="badge ${diffClass(p.difficulty)}">${diffLabel(p.difficulty)}</span>
    <span class="spacer"></span>
    ${g ? `<span class="badge ${g.color}">${g.letter}</span><span class="m">${rec.best}/${BASE_POINTS[p.difficulty]}</span>` : `<span class="m">~${p.targetMinutes}′</span>`}
    ${rec?.srs?.due ? `<span class="m">${nextDueLabel(rec.srs)}</span>` : ''}
  </a>`;
}
