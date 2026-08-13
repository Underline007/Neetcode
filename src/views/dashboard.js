import { TOPICS, PROBLEMS, PLAN, planByDay, problemById, topicById } from '../data/index.js';
import { PY_TOPICS, PY_PROBLEMS } from '../data/python/index.js';
import { store } from '../store.js';
import { topicMastery, BASE_POINTS } from '../scoring.js';
import { dueItems } from '../srs.js';
import { bar, diffClass, diffLabel, esc, inlineMd } from '../ui.js';

/** Bài đến hạn ôn tính trên CẢ hai lộ trình, để con số ở đây luôn khớp với trang
 *  "Ôn tập ngắt quãng" — ôn tập thì không nên ẩn bớt theo công tắc ngôn ngữ. */
const ALL_PROBLEMS = [...PROBLEMS, ...PY_PROBLEMS];

/**
 * Bảng điều khiển hiển thị tiến độ của **lộ trình đang học** (theo công tắc
 * ngôn ngữ), chứ không phải luôn luôn của lộ trình thuật toán: người học Python
 * giải xong bài mà thấy "0/64 bài đã giải" thì tưởng app không ghi nhận.
 *
 * @param {object} [domain] { TOPICS, PROBLEMS } của lộ trình đang học (xem currentDomain trong main.js)
 */
export function renderDashboard(domain = { TOPICS, PROBLEMS }) {
  const topics = domain.TOPICS || TOPICS;
  const problems = domain.PROBLEMS || PROBLEMS;
  const st = store.get();
  const isPy = (st.lang || 'javascript') === 'python';
  const day = store.currentDay();
  const solved = problems.filter((p) => st.problems[p.id]?.solved).length;
  const due = dueItems(st, ALL_PROBLEMS);
  const totalMastery = topics.length
    ? Math.round(topics.reduce((s, t) => s + topicMastery(t, problems, st), 0) / topics.length)
    : 0;

  const today = day ? planByDay.get(day) : null;

  return `
    <h1>Xin chào 👋</h1>
    <p class="sub">${isPy
      ? 'Lộ trình Python đi theo <strong>module</strong>, không theo ngày cố định — học tới đâu chắc tới đó.'
      : 'Mục tiêu: trong 30 ngày, bạn không chỉ giải được bài mà <strong>hiểu vì sao</strong> lời giải đó đúng.'}</p>

    <div class="grid c4">
      <div class="card stat"><div class="n">${st.xp}</div><div class="l">Tổng điểm</div></div>
      <div class="card stat"><div class="n">${solved}<span class="muted small">/${problems.length}</span></div><div class="l">Bài đã giải${isPy ? ' (Python)' : ''}</div></div>
      <div class="card stat"><div class="n">${totalMastery}%</div><div class="l">Mức thành thạo</div></div>
      <div class="card stat"><div class="n">${st.streak.count} 🔥</div><div class="l">Chuỗi ngày học</div></div>
    </div>

    ${isPy ? nextModuleCard(st) : (day === null ? startCard() : todayCard(day, today, st))}

    ${due.length ? `
      <div class="card" style="margin-top:14px;border-color:var(--warn)">
        <h3 style="margin-top:0">🔁 Bạn có ${due.length} bài đến hạn ôn</h3>
        <p class="muted small">Lặp lại ngắt quãng là thứ quyết định bạn còn nhớ gì sau 30 ngày. Ưu tiên làm phần này trước bài mới.</p>
        <a class="btn" href="#/review">Ôn ngay</a>
      </div>` : ''}

    <h2>${isPy ? 'Tiến độ theo module' : 'Tiến độ theo chủ đề'}</h2>
    <div class="grid c2">
      ${topics.map((t) => topicCard(t, st, problems)).join('')}
    </div>
  `;
}

/** Thẻ "học tiếp" cho lộ trình Python: module đầu tiên chưa đạt 80% thành thạo. */
function nextModuleCard(st) {
  const next = PY_TOPICS.find((t) => topicMastery(t, PY_PROBLEMS, st) < 80) || PY_TOPICS[PY_TOPICS.length - 1];
  if (!next) return '';
  const list = PY_PROBLEMS.filter((p) => p.topic === next.id);
  const solved = list.filter((p) => st.problems[p.id]?.solved).length;
  const quizBest = st.quizzes[next.id]?.best || 0;

  return `
    <div class="card" style="margin-top:16px;border-color:var(--accent)">
      <div class="row">
        <h3 style="margin:0">📌 Học tiếp: ${next.icon} ${esc(next.name)}</h3>
        <div class="spacer"></div>
        <a class="btn ghost small" href="#/plan">Xem toàn bộ module</a>
      </div>
      <p class="muted" style="margin:8px 0 12px">${esc(next.summary)}</p>
      <div class="row" style="gap:6px;margin-bottom:10px">
        <a class="badge accent" href="#/topic/${next.id}" style="text-decoration:none">📖 Cú pháp + bài giảng</a>
        <a class="badge${quizBest >= 75 ? ' ok' : ''}" href="#/quiz/${next.id}" style="text-decoration:none">🧠 Quiz hiểu bản chất${quizBest >= 75 ? ' ✓' : ''}</a>
      </div>
      <div class="list">
        ${list.slice(0, 4).map((p) => {
          const rec = st.problems[p.id];
          return `<a class="list-item" href="#/problem/${p.id}">
            <span>${rec?.solved ? '✅' : '⬜'}</span>
            <span class="t">${esc(p.title)}</span>
            <span class="badge ${diffClass(p.difficulty)}">${diffLabel(p.difficulty)}</span>
            <span class="spacer"></span>
            ${rec?.solved ? `<span class="m">${rec.best} điểm</span>` : `<span class="m">~${p.targetMinutes} phút</span>`}
          </a>`;
        }).join('')}
      </div>
      <div style="margin-top:12px">${bar(list.length ? (solved / list.length) * 100 : 0, true)}</div>
      <div class="muted small" style="margin-top:8px">${solved}/${list.length} bài của module này</div>
    </div>`;
}

function startCard() {
  return `
    <div class="card" style="margin-top:16px;border-color:var(--accent)">
      <h3 style="margin-top:0">🚀 Bắt đầu lộ trình 30 ngày</h3>
      <p>Mỗi ngày khoảng <strong>90–120 phút</strong>: đọc bài giảng → làm 2–4 bài tập → kiểm tra hiểu bản chất bằng quiz → ôn các bài đến hạn.</p>
      <p class="muted small">Bạn vẫn có thể học tự do mà không cần theo lộ trình — nhưng bấm bắt đầu sẽ giúp hệ thống nhắc đúng nội dung mỗi ngày.</p>
      <div class="row">
        <button class="btn" data-action="start-plan">Bắt đầu Ngày 1</button>
        <a class="btn ghost" href="#/guide">Cách dùng app</a>
      </div>
    </div>`;
}

function todayCard(day, plan, st) {
  if (!plan) return '';
  const doneCount = plan.problems.filter((id) => st.problems[id]?.solved).length;
  const quizDone = plan.quiz ? (st.quizzes[plan.quiz]?.best || 0) >= 75 : true;
  const finished = doneCount === plan.problems.length && quizDone;

  return `
    <div class="card" style="margin-top:16px;border-color:${finished ? 'var(--ok)' : 'var(--accent)'}">
      <div class="row">
        <h3 style="margin:0">📌 Ngày ${day}/30 ${finished ? '<span class="badge ok">Hoàn thành</span>' : ''}</h3>
        <div class="spacer"></div>
        <a class="btn ghost small" href="#/plan">Xem toàn bộ lộ trình</a>
      </div>
      <p class="muted" style="margin:8px 0 12px">${inlineMd(plan.focus)}</p>

      <div class="row" style="gap:6px;margin-bottom:10px">
        ${plan.topics.map((id) => {
          const t = topicById.get(id);
          return `<a class="badge accent" href="#/topic/${id}" style="text-decoration:none">${t.icon} Bài giảng: ${esc(t.name)}</a>`;
        }).join('')}
        ${plan.quiz ? `<a class="badge${quizDone ? ' ok' : ''}" href="#/quiz/${plan.quiz}" style="text-decoration:none">🧠 Quiz hiểu bản chất${quizDone ? ' ✓' : ''}</a>` : ''}
      </div>

      <div class="list">
        ${plan.problems.map((id) => {
          const p = problemById.get(id);
          const rec = st.problems[id];
          const pct = rec ? Math.round((rec.best / (BASE_POINTS[p.difficulty] || 150)) * 100) : 0;
          return `<a class="list-item" href="#/problem/${id}">
            <span>${rec?.solved ? '✅' : '⬜'}</span>
            <span class="t">${esc(p.title)}</span>
            <span class="badge ${diffClass(p.difficulty)}">${diffLabel(p.difficulty)}</span>
            <span class="spacer"></span>
            ${rec?.solved ? `<span class="m">${rec.best} điểm · ${pct}%</span>` : `<span class="m">~${p.targetMinutes} phút</span>`}
          </a>`;
        }).join('')}
      </div>

      <div style="margin-top:12px">${bar((doneCount / plan.problems.length) * 100, true)}</div>
    </div>`;
}

function topicCard(t, st, problems = PROBLEMS) {
  const m = topicMastery(t, problems, st);
  const list = problems.filter((p) => p.topic === t.id);
  const solved = list.filter((p) => st.problems[p.id]?.solved).length;
  return `
    <a class="card card-link" href="#/topic/${t.id}">
      <div class="row">
        <strong>${t.icon} ${esc(t.name)}</strong>
        <span class="spacer"></span>
        <span class="badge${m >= 80 ? ' ok' : ''}">${m}%</span>
      </div>
      <p class="muted small" style="margin:6px 0 10px">${esc(t.summary)}</p>
      ${bar(m, true)}
      <div class="row small muted" style="margin-top:8px">
        <!-- module Python học theo thứ tự module, không gắn với ngày nào của lộ trình 30 ngày -->
        <span>${t.days ? `Ngày ${t.days.join(', ')}` : `${(t.quiz || []).length} câu quiz`}</span>
        <span class="spacer"></span><span>${solved}/${list.length} bài</span>
      </div>
    </a>`;
}
