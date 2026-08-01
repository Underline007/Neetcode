import { TOPICS, PROBLEMS, PLAN, planByDay, problemById, topicById } from '../data/index.js';
import { store } from '../store.js';
import { topicMastery, BASE_POINTS } from '../scoring.js';
import { dueItems } from '../srs.js';
import { bar, diffClass, diffLabel, esc } from '../ui.js';

export function renderDashboard() {
  const st = store.get();
  const day = store.currentDay();
  const solved = PROBLEMS.filter((p) => st.problems[p.id]?.solved).length;
  const due = dueItems(st, PROBLEMS);
  const totalMastery = Math.round(
    TOPICS.reduce((s, t) => s + topicMastery(t, PROBLEMS, st), 0) / TOPICS.length
  );

  const today = day ? planByDay.get(day) : null;

  return `
    <h1>Xin chào 👋</h1>
    <p class="sub">Mục tiêu: trong 30 ngày, bạn không chỉ giải được bài mà <strong>hiểu vì sao</strong> lời giải đó đúng.</p>

    <div class="grid c4">
      <div class="card stat"><div class="n">${st.xp}</div><div class="l">Tổng điểm</div></div>
      <div class="card stat"><div class="n">${solved}<span class="muted small">/${PROBLEMS.length}</span></div><div class="l">Bài đã giải</div></div>
      <div class="card stat"><div class="n">${totalMastery}%</div><div class="l">Mức thành thạo</div></div>
      <div class="card stat"><div class="n">${st.streak.count} 🔥</div><div class="l">Chuỗi ngày học</div></div>
    </div>

    ${day === null ? startCard() : todayCard(day, today, st)}

    ${due.length ? `
      <div class="card" style="margin-top:14px;border-color:var(--warn)">
        <h3 style="margin-top:0">🔁 Bạn có ${due.length} bài đến hạn ôn</h3>
        <p class="muted small">Lặp lại ngắt quãng là thứ quyết định bạn còn nhớ gì sau 30 ngày. Ưu tiên làm phần này trước bài mới.</p>
        <a class="btn" href="#/review">Ôn ngay</a>
      </div>` : ''}

    <h2>Tiến độ theo chủ đề</h2>
    <div class="grid c2">
      ${TOPICS.map((t) => topicCard(t, st)).join('')}
    </div>
  `;
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
      <p class="muted" style="margin:8px 0 12px">${esc(plan.focus)}</p>

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

function topicCard(t, st) {
  const m = topicMastery(t, PROBLEMS, st);
  const list = PROBLEMS.filter((p) => p.topic === t.id);
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
        <span>Ngày ${t.days.join(', ')}</span><span class="spacer"></span><span>${solved}/${list.length} bài</span>
      </div>
    </a>`;
}
