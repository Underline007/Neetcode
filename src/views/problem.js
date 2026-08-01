import { problemById, topicById, buildTests } from '../data/index.js';
import { store } from '../store.js';
import { computeScore, grade, BASE_POINTS, HINT_PENALTY } from '../scoring.js';
import { qualityFromScore, schedule, nextDueLabel } from '../srs.js';
import { runTests } from '../runner.js';
import { md } from '../markdown.js';
import { $, $$, esc, toast, diffClass, diffLabel } from '../ui.js';

let session = null;   // trạng thái phiên làm bài hiện tại

export function renderProblem(id) {
  const p = problemById.get(id);
  if (!p) return '<h1>Không tìm thấy bài tập</h1>';

  const rec = store.problem(p.id);
  const topic = topicById.get(p.topic);

  session = {
    problem: p,
    startedAt: Date.now(),
    attempts: 0,
    lastResult: null,
    passedThisSession: false,
  };

  const code = rec.code || p.starter;

  return `
    <div class="row">
      <a class="btn ghost small" href="#/topic/${p.topic}">← ${topic.icon} ${esc(topic.name)}</a>
      <span class="badge ${diffClass(p.difficulty)}">${diffLabel(p.difficulty)}</span>
      <span class="badge">🎯 mục tiêu ${p.targetMinutes} phút</span>
      ${rec.solved ? `<span class="badge ok">Đã giải · ${rec.best} điểm</span>` : ''}
      ${rec.srs?.due ? `<span class="badge">${nextDueLabel(rec.srs)}</span>` : ''}
      <span class="spacer"></span>
      <span class="muted small" id="timer">00:00</span>
    </div>

    <h1 style="margin-top:12px">${esc(p.title)}</h1>
    <p class="sub">${esc(p.en)} · Điểm tối đa cơ bản: ${BASE_POINTS[p.difficulty]}</p>

    <div class="workspace">
      <div>
        <div class="pane">
          <div class="pane-head"><strong>📄 Đề bài</strong></div>
          <div class="pane-body md scroll">${md(p.statement)}</div>
        </div>

        <div class="pane" style="margin-top:14px">
          <div class="pane-head">
            <strong>💡 Gợi ý theo bậc</strong>
            <span class="spacer"></span>
            <span class="muted small">mỗi bậc trừ điểm dần</span>
          </div>
          <div class="pane-body">
            <div id="hints"></div>
            <button class="btn ghost small" id="hint-btn"></button>
          </div>
        </div>

        <div class="pane" style="margin-top:14px">
          <div class="pane-head"><strong>📖 Phân tích &amp; lời giải</strong></div>
          <div class="pane-body">
            <p class="muted small" style="margin-top:0">Xem lời giải sẽ giới hạn điểm tối đa của bài này ở <strong>30%</strong>. Hãy thử hết 3 bậc gợi ý trước.</p>
            <button class="btn ghost small" id="reveal-btn">Xem phân tích &amp; lời giải</button>
            <div id="solution"></div>
          </div>
        </div>
      </div>

      <div>
        <div class="pane">
          <div class="pane-head">
            <strong>⌨️ Lời giải của bạn</strong>
            <span class="badge">JavaScript</span>
            <span class="spacer"></span>
            <button class="btn ghost small" id="reset-btn">Khôi phục code mẫu</button>
          </div>
          <textarea class="editor" id="editor" spellcheck="false">${esc(code)}</textarea>
        </div>

        <div class="row" style="margin-top:12px">
          <button class="btn" id="run-btn">▶ Chạy &amp; chấm điểm</button>
          <span class="muted small">hoặc <span class="kbd">Ctrl</span> + <span class="kbd">Enter</span></span>
        </div>

        <div id="results" style="margin-top:14px"></div>
      </div>
    </div>
  `;
}

/* --------------------------- gắn sự kiện --------------------------- */
export function mountProblem(id) {
  const p = problemById.get(id);
  if (!p) return;
  const rec = store.problem(p.id);
  const editor = $('#editor');

  // timer
  const timerEl = $('#timer');
  const tick = setInterval(() => {
    if (!document.body.contains(timerEl)) { clearInterval(tick); return; }
    const s = Math.floor((Date.now() - session.startedAt) / 1000);
    timerEl.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }, 1000);

  // Tab chèn 2 dấu cách thay vì nhảy focus
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = editor.selectionStart, en = editor.selectionEnd;
      editor.value = editor.value.slice(0, s) + '  ' + editor.value.slice(en);
      editor.selectionStart = editor.selectionEnd = s + 2;
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
  });
  editor.addEventListener('input', () => {
    rec.code = editor.value;
    store.save();
  });

  $('#reset-btn').addEventListener('click', () => {
    if (!confirm('Khôi phục về code mẫu? Code hiện tại sẽ mất.')) return;
    editor.value = p.starter;
    rec.code = p.starter;
    store.save();
  });

  $('#run-btn').addEventListener('click', run);

  // ----- gợi ý -----
  renderHints();
  $('#hint-btn').addEventListener('click', () => {
    if (rec.hintsUsed >= p.hints.length) return;
    rec.hintsUsed++;
    store.save();
    renderHints();
    toast(`Đã mở gợi ý ${rec.hintsUsed}/3 — điểm tối đa giảm còn ${Math.round((1 - HINT_PENALTY[rec.hintsUsed]) * 100)}%`);
  });

  function renderHints() {
    const box = $('#hints');
    box.innerHTML = p.hints.slice(0, rec.hintsUsed)
      .map((h, i) => `<div class="hint"><strong>Gợi ý ${i + 1}.</strong> ${md(h).replace(/^<p>|<\/p>$/g, '')}</div>`)
      .join('');
    const btn = $('#hint-btn');
    if (rec.hintsUsed >= p.hints.length) {
      btn.textContent = 'Đã mở hết gợi ý';
      btn.disabled = true;
    } else {
      const next = rec.hintsUsed + 1;
      btn.textContent = `Mở gợi ý ${next}/3 (−${Math.round((HINT_PENALTY[next] - HINT_PENALTY[rec.hintsUsed]) * 100)}% điểm)`;
    }
  }

  // ----- lời giải -----
  $('#reveal-btn').addEventListener('click', () => {
    if (!rec.revealed && !confirm('Xem lời giải sẽ giới hạn điểm bài này ở 30%. Tiếp tục?')) return;
    rec.revealed = true;
    store.save();
    $('#reveal-btn').classList.add('hidden');
    $('#solution').innerHTML = `
      <div class="md">${md(p.approach)}</div>
      <h3>Lời giải tham khảo (JavaScript)</h3>
      <div class="md">${md('```js\n' + p.solution + '\n```')}</div>
      <h3>Lời giải tham khảo (Python)</h3>
      <div class="md">${md('```python\n' + p.solutionPy + '\n```')}</div>
      <div class="hint"><strong>🌍 Ứng dụng thực tế.</strong> ${esc(p.realWorld)}</div>`;
  });

  /* --------------------------- chạy test --------------------------- */
  async function run() {
    const btn = $('#run-btn');
    btn.disabled = true;
    btn.textContent = '⏳ Đang chạy...';
    const code = editor.value;

    const res = await runTests({
      code,
      entry: p.entry,
      tests: buildTests(p),
      harnessSrc: p.harnessSrc,
      checkerSrc: p.checkerSrc,
      timeoutMs: 6000,
    });

    btn.disabled = false;
    btn.textContent = '▶ Chạy & chấm điểm';

    session.attempts++;
    rec.attempts++;
    rec.lastRun = Date.now();
    store.save();

    const passed = res.ok && res.results.every((r) => r.pass);
    if (passed) onPass(code, res);
    else onFail(code, res);
  }

  function onFail(code, res) {
    const box = $('#results');
    let head = '';

    if (!res.ok) {
      const title = { compile: 'Lỗi cú pháp', timeout: 'Quá thời gian', runtime: 'Lỗi khi chạy', harness: 'Lỗi hệ thống chấm', worker: 'Không khởi tạo được bộ chạy' }[res.phase] || 'Lỗi';
      head = `<div class="card" style="border-color:var(--bad)">
        <strong style="color:var(--bad)">❌ ${title}</strong>
        <pre class="mono small" style="white-space:pre-wrap;margin:8px 0 0">${esc(res.error)}</pre>
      </div>`;
    } else {
      const pass = res.results.filter((r) => r.pass).length;
      head = `<div class="card" style="border-color:var(--bad)">
        <div class="row"><strong style="color:var(--bad)">❌ ${pass}/${res.results.length} test đạt</strong>
        <span class="spacer"></span><span class="muted small">${res.totalMs} ms</span></div>
      </div>`;
    }

    box.innerHTML = head
      + diagnose(code, res)
      + (res.logs?.length ? `<div class="card tight" style="margin-top:10px"><div class="muted small">console.log</div><pre class="mono small" style="white-space:pre-wrap;margin:4px 0 0">${esc(res.logs.join('\n'))}</pre></div>` : '')
      + testList(res);
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function onPass(code, res) {
    const first = rec.attempts === 1;
    if (first) rec.firstTry = true;
    const elapsed = Date.now() - session.startedAt;
    session.passedThisSession = true;
    session.elapsed = elapsed;

    const sc = computeScore({
      difficulty: p.difficulty,
      hintsUsed: rec.hintsUsed,
      revealed: rec.revealed,
      firstTry: !!rec.firstTry,
      elapsedMs: elapsed,
      targetMinutes: p.targetMinutes,
      complexityCorrect: false,
    });

    applyScore(sc.score, 'solve');

    $('#results').innerHTML = `
      <div class="card" style="border-color:var(--ok)">
        <div class="row"><strong style="color:var(--ok)">✅ Toàn bộ ${res.results.length} test đều đạt!</strong>
          <span class="spacer"></span><span class="muted small">${res.totalMs} ms</span></div>
        ${scoreBreakdown(sc, rec)}
      </div>
      <div id="cx" style="margin-top:12px">${complexityCard(p)}</div>
      ${testList(res)}`;

    bindComplexity();
    $('#results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function applyScore(score, kind) {
    const prevBest = rec.best || 0;
    if (score > prevBest) {
      store.addXp(score - prevBest, { type: kind, ref: p.id });
      rec.best = score;
    } else {
      store.touchStreak();
    }
    if (!rec.solved) rec.solved = true;
    const q = qualityFromScore(rec.best, BASE_POINTS[p.difficulty]);
    rec.srs = schedule(rec.srs, q);
    store.save();
  }

  function bindComplexity() {
    const box = $('#cx');
    if (!box) return;
    $$('.opt', box).forEach((opt) => {
      opt.addEventListener('click', () => {
        if (box.dataset.answered) return;
        box.dataset.answered = '1';
        const chosen = Number(opt.dataset.i);
        const correct = p.complexity.answer;
        $$('.opt', box).forEach((o, i) => {
          if (i === correct) o.classList.add('correct');
          else if (i === chosen) o.classList.add('wrong');
        });

        if (chosen === correct) {
          const sc = computeScore({
            difficulty: p.difficulty,
            hintsUsed: rec.hintsUsed,
            revealed: rec.revealed,
            firstTry: !!rec.firstTry,
            elapsedMs: session.elapsed,
            targetMinutes: p.targetMinutes,
            complexityCorrect: true,
          });
          applyScore(sc.score, 'complexity');
          toast(`Chính xác! +10% thưởng phân tích độ phức tạp. Tổng điểm bài này: ${rec.best}`);
        } else {
          toast('Chưa đúng — đọc kỹ phần giải thích bên dưới nhé.');
        }

        const g = grade(rec.best, p.difficulty);
        box.insertAdjacentHTML('beforeend', `
          <div class="hint"><strong>Giải thích.</strong> ${esc(p.complexity.why)}</div>
          <div class="row" style="margin-top:10px">
            <span class="badge ${g.color}">Xếp hạng ${g.letter}</span>
            <span class="muted small">${esc(g.text)} · ${rec.best}/${BASE_POINTS[p.difficulty]} điểm</span>
            <span class="spacer"></span>
            <span class="badge">${nextDueLabel(rec.srs)}</span>
          </div>
          <div class="hint" style="border-left-color:var(--ok)"><strong>🌍 Ứng dụng thực tế.</strong> ${esc(p.realWorld)}</div>
          ${rec.revealed ? '' : '<p class="small muted">Chưa xem phần <strong>Phân tích &amp; lời giải</strong>? Giờ là lúc nên đọc — nó nói về <em>mẫu hình</em> đằng sau bài này, thứ sẽ quay lại ở các bài khó hơn. (Đọc sau khi đã giải xong không bị trừ điểm nữa.)</p>'}
        `);
        // đã giải xong -> mở lời giải miễn phí
        rec.revealed = rec.revealed || false;
        store.save();
      });
    });
  }
}

/* --------------------------- thành phần phụ --------------------------- */
function complexityCard(p) {
  return `
    <div class="quiz-q">
      <strong>🧠 Câu hỏi cuối: ${esc(p.complexity.question)}</strong>
      <p class="muted small" style="margin:6px 0 10px">Trả lời đúng được cộng thêm 10% điểm. Giải được bài mà không biết nó tốn bao nhiêu thì chưa xong việc.</p>
      ${p.complexity.options.map((o, i) => `<div class="opt" data-i="${i}"><span>${'ABCD'[i]}.</span><span>${esc(o)}</span></div>`).join('')}
    </div>`;
}

function scoreBreakdown(sc, rec) {
  return `
    <div style="margin-top:10px">
      <div class="row"><span class="muted small">Điểm nhận được</span><span class="spacer"></span><strong>${sc.score} / ${sc.base}</strong></div>
      ${sc.parts.map((pt) => `<div class="row small" style="color:${pt.delta === null ? 'var(--warn)' : pt.delta > 0 ? 'var(--ok)' : 'var(--bad)'}">
        <span>${esc(pt.label)}</span><span class="spacer"></span>
        <span>${pt.delta === null ? '↓ trần 30%' : (pt.delta > 0 ? '+' : '') + Math.round(pt.delta * 100) + '%'}</span></div>`).join('')}
      ${rec.best ? `<div class="row small muted"><span>Điểm cao nhất của bài này</span><span class="spacer"></span><span>${rec.best}</span></div>` : ''}
    </div>`;
}

function testList(res) {
  if (!res.results?.length) return '';
  return `<div class="tests" style="margin-top:12px">
    ${res.results.map((r, i) => `
      <div class="test ${r.pass ? 'pass' : 'fail'}">
        <div class="row">
          <span>${r.pass ? '✅' : '❌'}</span>
          <strong>Test ${i + 1}${r.name ? ' — ' + esc(r.name) : ''}</strong>
          <span class="spacer"></span>
          <span class="k">${r.ms} ms</span>
        </div>
        ${r.pass ? '' : `
          ${r.args !== null && r.args !== undefined ? `<div class="k">Đầu vào</div><pre>${esc(r.args)}</pre>` : ''}
          ${r.expected !== null && r.expected !== undefined ? `<div class="k">Mong đợi</div><pre>${esc(r.expected)}</pre>` : ''}
          ${r.error ? `<div class="k">Lỗi</div><pre style="color:var(--bad)">${esc(r.error)}</pre>`
            : `<div class="k">Nhận được</div><pre>${esc(r.got)}</pre>`}
        `}
      </div>`).join('')}
  </div>`;
}

/* ------------------- chẩn đoán tự động khi làm sai ------------------- */
function diagnose(code, res) {
  const p = session.problem;
  const notes = [];

  // 1. luật chẩn đoán riêng của từng bài (dựa trên mẫu code)
  for (const d of p.diagnostics || []) {
    try {
      if (new RegExp(d.test, 'm').test(code)) notes.push(d.message);
    } catch { /* regex hỏng thì bỏ qua */ }
  }

  // 2. chẩn đoán chung từ kết quả chạy
  if (res.phase === 'timeout') {
    notes.push('Kiểm tra: mọi vòng `while` có biến điều kiện thay đổi ở mỗi lần lặp không? Và độ phức tạp của bạn có phù hợp với ràng buộc đề bài không?');
  }
  if (res.ok) {
    const failed = res.results.filter((r) => !r.pass);
    const perfFailed = failed.filter((r) => /Hiệu năng/i.test(r.name || ''));
    if (perfFailed.length && failed.length === perfFailed.length) {
      notes.push('Lời giải của bạn **đúng về mặt logic** — chỉ trượt test hiệu năng. Vấn đề nằm ở độ phức tạp, không phải ở logic. Hãy tìm cách bỏ bớt một vòng lặp.');
    }
    const errs = failed.filter((r) => r.error);
    if (errs.length) {
      const msg = errs[0].error;
      if (/undefined/.test(msg)) notes.push('Lỗi truy cập thuộc tính của `undefined`/`null`: thường do chỉ số vượt biên hoặc quên kiểm tra nút rỗng trước khi truy cập `.next` / `.left`.');
      if (/not a function/.test(msg)) notes.push('Bạn đang gọi một thứ không phải hàm — kiểm tra lại tên phương thức hoặc biến bị ghi đè.');
      if (/Maximum call stack/.test(msg)) notes.push('Tràn ngăn xếp: đệ quy không có (hoặc không chạm tới) trường hợp cơ sở. Hãy in ra tham số ở đầu hàm để xem nó có tiến về điều kiện dừng không.');
    }
    if (failed.length === 1 && !errs.length) {
      notes.push(`Chỉ **một** test sai (“${esc(failed[0].name || '')}”) — gần như chắc chắn là trường hợp biên. Hãy chạy tay đúng test đó thay vì sửa mò toàn bộ thuật toán.`);
    }
    if (failed.length && failed.every((r) => /rỗng|một phần tử|0|biên/i.test(r.name || ''))) {
      notes.push('Các test trượt đều là trường hợp biên: mảng rỗng, một phần tử, giá trị 0. Hãy thêm nhánh xử lý riêng ở đầu hàm.');
    }
  }

  if (!notes.length) return '';
  return `<div style="margin-top:10px">
    ${notes.map((n) => `<div class="hint diag">🔍 ${md(n).replace(/^<p>|<\/p>$/g, '')}</div>`).join('')}
  </div>`;
}
