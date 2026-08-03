import { PY_TOPICS, PY_PROBLEMS } from '../data/python/index.js';
import { store } from '../store.js';
import { topicMastery } from '../scoring.js';
import { bar, esc } from '../ui.js';

export function renderPythonHome() {
  const st = store.get();
  const solved = PY_PROBLEMS.filter((p) => st.problems[p.id]?.solved).length;
  const totalMastery = PY_TOPICS.length
    ? Math.round(PY_TOPICS.reduce((s, t) => s + topicMastery(t, PY_PROBLEMS, st), 0) / PY_TOPICS.length)
    : 0;
  const next = PY_TOPICS.find((t) => topicMastery(t, PY_PROBLEMS, st) < 80) || PY_TOPICS[PY_TOPICS.length - 1];

  return `
    <h1>🐍 Lộ trình Python — Cơ bản đến Senior</h1>
    <p class="sub">Không đi theo ngày cố định như lộ trình thuật toán — học theo module, mỗi module có bài giảng, quiz hiểu bản chất, và bài tập được <strong>chấm điểm bằng Python thật</strong> (chạy qua Pyodide, ngay trong trình duyệt, không cần cài đặt gì).</p>

    <div class="grid c4">
      <div class="card stat"><div class="n">${solved}<span class="muted small">/${PY_PROBLEMS.length}</span></div><div class="l">Bài đã giải</div></div>
      <div class="card stat"><div class="n">${totalMastery}%</div><div class="l">Mức thành thạo</div></div>
      <div class="card stat"><div class="n">${PY_TOPICS.length}</div><div class="l">Module</div></div>
      <div class="card stat"><div class="n">${st.xp}</div><div class="l">Tổng điểm (dùng chung 2 lộ trình)</div></div>
    </div>

    ${next ? `
      <div class="card" style="margin-top:16px;border-color:var(--accent)">
        <h3 style="margin-top:0">📌 Nên học tiếp: ${next.icon} ${esc(next.name)}</h3>
        <p class="muted small" style="margin:8px 0 12px">${esc(next.summary)}</p>
        <a class="btn" href="#/topic/${next.id}">Vào học</a>
      </div>` : ''}

    <h2>Toàn bộ module</h2>
    <div class="grid c2">
      ${PY_TOPICS.map((t) => {
        const m = topicMastery(t, PY_PROBLEMS, st);
        const list = PY_PROBLEMS.filter((p) => p.topic === t.id);
        const solvedN = list.filter((p) => st.problems[p.id]?.solved).length;
        return `<a class="card card-link" href="#/topic/${t.id}">
          <div class="row"><strong>${t.icon} ${esc(t.name)}</strong><span class="spacer"></span><span class="badge${m >= 80 ? ' ok' : ''}">${m}%</span></div>
          <div class="muted small" style="margin:2px 0 8px">${esc(t.en)}</div>
          <p class="small" style="margin:0 0 10px">${esc(t.summary)}</p>
          ${bar(m, true)}
          <div class="muted small" style="margin-top:8px">${solvedN}/${list.length} bài · ${t.quiz.length} câu quiz</div>
        </a>`;
      }).join('')}
    </div>

    <div class="card" style="margin-top:16px">
      <p class="muted small" style="margin:0">💡 Lần đầu vào một bài tập Python trong phiên, trình duyệt cần vài giây để tải môi trường chạy Python (Pyodide — cần internet lần đầu, sau đó trình duyệt lưu cache). Các lần chạy sau trong cùng phiên sẽ nhanh hơn nhiều. Bài Python cũng dùng chung hệ thống điểm, gợi ý theo bậc, chẩn đoán lỗi tự động và ôn tập ngắt quãng với lộ trình thuật toán.</p>
    </div>
  `;
}
