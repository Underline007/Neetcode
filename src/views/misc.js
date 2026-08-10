import { TOPICS, PROBLEMS } from '../data/index.js';
import { PY_TOPICS, PY_PROBLEMS } from '../data/python/index.js';
import { store } from '../store.js';
import { topicMastery, BASE_POINTS, grade } from '../scoring.js';
import { dueItems, nextDueLabel } from '../srs.js';
import { bar, esc, diffClass, diffLabel, fmtDate, toast } from '../ui.js';
import { generateCode, syncManually, syncStatus, CODE_PATTERN } from '../sync.js';

/** Ôn tập & thống kê gộp chung CẢ HAI lộ trình (JS + Python) — cùng một hệ thống điểm/SRS.
 *  Link dùng đường dẫn phẳng #/topic|problem/:id — router tự nhận domain theo id. */
const ALL_TOPICS = [...TOPICS, ...PY_TOPICS];
const ALL_PROBLEMS = [...PROBLEMS, ...PY_PROBLEMS];

/* ------------------------------ ÔN TẬP ------------------------------ */
export function renderReview() {
  const st = store.get();
  const due = dueItems(st, ALL_PROBLEMS);
  const upcoming = ALL_PROBLEMS
    .map((p) => ({ p, rec: st.problems[p.id] }))
    .filter(({ rec }) => rec?.solved && rec.srs?.due && rec.srs.due > Date.now())
    .sort((a, b) => a.rec.srs.due - b.rec.srs.due)
    .slice(0, 12);

  return `
    <h1>🔁 Ôn tập ngắt quãng</h1>
    <p class="sub">Bạn quên khoảng 70% những gì học được sau 1 tuần nếu không ôn lại. Lịch ôn dưới đây được tính theo thuật toán SM-2 rút gọn: bài bạn làm tốt sẽ giãn ra, bài làm kém quay lại sớm.</p>

    ${due.length === 0 ? `
      <div class="card">
        <h3 style="margin-top:0">✨ Không có bài nào đến hạn</h3>
        <p class="muted" style="margin:0">Hãy tiếp tục lộ trình hôm nay. Các bài đã giải sẽ tự động quay lại đây đúng lúc bạn sắp quên.</p>
      </div>` : `
      <div class="card" style="border-color:var(--warn)">
        <strong>${due.length} bài đến hạn ôn hôm nay</strong>
        <p class="muted small" style="margin:6px 0 0">Mẹo: hãy giải lại <em>từ đầu</em>, đừng đọc lại code cũ. Mục tiêu là kiểm tra trí nhớ chủ động.</p>
      </div>
      <div class="list" style="margin-top:12px">
        ${due.map(({ p, rec }) => `
          <a class="list-item" href="#/problem/${p.id}">
            <span>🔁</span>
            <span class="t">${esc(p.title)}</span>
            <span class="badge ${diffClass(p.difficulty)}">${diffLabel(p.difficulty)}</span>
            <span class="spacer"></span>
            <span class="m">${p.topicIcon} ${esc(p.topicName)}</span>
            <span class="m">điểm cũ: ${rec.best}</span>
          </a>`).join('')}
      </div>`}

    ${upcoming.length ? `
      <h2>Sắp tới</h2>
      <div class="list">
        ${upcoming.map(({ p, rec }) => `
          <a class="list-item" href="#/problem/${p.id}">
            <span class="t">${esc(p.title)}</span>
            <span class="spacer"></span>
            <span class="m">${nextDueLabel(rec.srs)} · ${fmtDate(rec.srs.due)}</span>
          </a>`).join('')}
      </div>` : ''}
  `;
}

/* ------------------------------ THỐNG KÊ ------------------------------ */
export function renderStats() {
  const st = store.get();
  const cfg = store.sync.get();
  const solved = ALL_PROBLEMS.filter((p) => st.problems[p.id]?.solved);
  const totalPossible = ALL_PROBLEMS.reduce((s, p) => s + BASE_POINTS[p.difficulty], 0);
  const earned = ALL_PROBLEMS.reduce((s, p) => s + (st.problems[p.id]?.best || 0), 0);

  const weakest = ALL_PROBLEMS
    .filter((p) => st.problems[p.id]?.solved)
    .map((p) => ({ p, rec: st.problems[p.id], pct: st.problems[p.id].best / BASE_POINTS[p.difficulty] }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 8);

  const byDiff = ['Easy', 'Medium', 'Hard'].map((d) => {
    const list = ALL_PROBLEMS.filter((p) => p.difficulty === d);
    const done = list.filter((p) => st.problems[p.id]?.solved).length;
    return { d, done, total: list.length };
  });

  const hintTotal = ALL_PROBLEMS.reduce((s, p) => s + (st.problems[p.id]?.hintsUsed || 0), 0);
  const revealed = ALL_PROBLEMS.filter((p) => st.problems[p.id]?.revealed).length;
  const firstTry = ALL_PROBLEMS.filter((p) => st.problems[p.id]?.firstTry).length;

  return `
    <h1>📈 Thống kê &amp; điểm</h1>
    <p class="sub">Điểm ở đây phản ánh <strong>mức độ tự lực</strong>, không chỉ "đã chạy đúng". Dùng nó để biết nên ôn lại chỗ nào.</p>

    <div class="grid c4">
      <div class="card stat"><div class="n">${st.xp}</div><div class="l">Tổng điểm tích luỹ</div></div>
      <div class="card stat"><div class="n">${Math.round((earned / totalPossible) * 100)}%</div><div class="l">Điểm bài tập (${earned}/${totalPossible})</div></div>
      <div class="card stat"><div class="n">${firstTry}</div><div class="l">Bài đúng ngay lần đầu</div></div>
      <div class="card stat"><div class="n">${hintTotal}</div><div class="l">Gợi ý đã dùng · ${revealed} lần xem lời giải</div></div>
    </div>

    <h2>Theo độ khó</h2>
    <div class="grid c3">
      ${byDiff.map((x) => `
        <div class="card">
          <div class="row"><strong>${diffLabel(x.d)}</strong><span class="spacer"></span><span class="badge ${diffClass(x.d)}">${x.done}/${x.total}</span></div>
          <div style="margin-top:10px">${bar((x.done / x.total) * 100, true)}</div>
        </div>`).join('')}
    </div>

    <h2>Mức thành thạo từng chủ đề</h2>
    <div class="card">
      ${ALL_TOPICS.map((t) => {
        const m = topicMastery(t, ALL_PROBLEMS, st);
        return `<div style="margin:10px 0">
          <div class="row small"><a href="#/topic/${t.id}" style="text-decoration:none">${t.icon} ${esc(t.name)}</a>
          <span class="spacer"></span><span class="muted">${m}%</span></div>
          ${bar(m, true)}
        </div>`;
      }).join('')}
    </div>

    ${weakest.length ? `
      <h2>⚠️ Nên làm lại (điểm thấp nhất)</h2>
      <p class="muted small">Đây là những bài bạn giải được nhưng phải dựa nhiều vào gợi ý, hoặc mất nhiều lần thử. Làm lại chúng có giá trị hơn làm bài mới.</p>
      <div class="list">
        ${weakest.map(({ p, rec }) => {
          const g = grade(rec.best, p.difficulty);
          return `<a class="list-item" href="#/problem/${p.id}">
            <span class="badge ${g.color}">${g.letter}</span>
            <span class="t">${esc(p.title)}</span>
            <span class="spacer"></span>
            <span class="m">${rec.best}/${BASE_POINTS[p.difficulty]} · ${rec.hintsUsed} gợi ý${rec.revealed ? ' · đã xem lời giải' : ''}</span>
          </a>`;
        }).join('')}
      </div>` : ''}

    <h2>Đồng bộ nhiều máy</h2>
    <div class="card">
      <p class="muted small" style="margin-top:0">
        Học ở máy nào cũng tiếp tục được đúng chỗ đang dở. Tiến độ hai bên được <strong>gộp</strong>
        chứ không ghi đè, nên không máy nào mất bài. Cần triển khai một Cloudflare Worker
        (làm một lần, ~3 phút — xem <code>worker/README.md</code>).
      </p>

      <label class="field-label" for="sync-url">Địa chỉ máy chủ</label>
      <input class="field" id="sync-url" type="url" spellcheck="false" placeholder="https://neetcode30-sync.ten-cua-ban.workers.dev" value="${esc(cfg.url || '')}">

      <label class="field-label" for="sync-code">Mã đồng bộ <span class="muted">(dùng CHUNG cho mọi máy của bạn — coi như mật khẩu)</span></label>
      <div class="row">
        <input class="field" id="sync-code" type="text" spellcheck="false" autocomplete="off" placeholder="16–64 ký tự" value="${esc(cfg.code || '')}" style="flex:1;min-width:240px">
        <button class="btn ghost small" data-action="gen-code">🎲 Tạo mã ngẫu nhiên</button>
      </div>

      <div class="row" style="margin-top:12px">
        <label class="row" style="gap:6px;cursor:pointer">
          <input type="checkbox" id="sync-auto" ${cfg.auto === false ? '' : 'checked'}>
          <span class="small">Tự động đồng bộ khi mở app và sau mỗi thay đổi</span>
        </label>
      </div>

      <div class="row" style="margin-top:12px">
        <button class="btn small" data-action="sync-now">🔄 Lưu & đồng bộ ngay</button>
        <button class="btn ghost small" data-action="sync-forget">Quên cấu hình máy này</button>
        <span class="spacer"></span>
        <span class="muted small" id="sync-status">${esc(syncStatusText())}</span>
      </div>

      <p class="muted small" style="margin-bottom:0">
        ⚠️ Ai biết mã đồng bộ thì đọc và ghi được tiến độ của bạn. Hãy dùng nút tạo mã ngẫu nhiên
        thay vì tự đặt mã dễ đoán.
      </p>
    </div>

    <h2>Dữ liệu học tập</h2>
    <div class="card">
      <p class="muted small" style="margin-top:0">Tiến độ được lưu trong trình duyệt này (localStorage). Xuất ra file để sao lưu, hoặc chuyển thủ công sang máy khác khi không dùng đồng bộ tự động.</p>
      <div class="row">
        <button class="btn ghost small" data-action="export">⬇ Xuất tiến độ (JSON)</button>
        <button class="btn ghost small" data-action="import">⬆ Nhập &amp; gộp</button>
        <button class="btn ghost small" data-action="import-replace">Khôi phục (ghi đè)</button>
        <button class="btn danger small" data-action="reset">Xoá toàn bộ tiến độ</button>
      </div>
      <p class="muted small" style="margin-bottom:0">
        <strong>Nhập &amp; gộp</strong> giữ lại phần tốt nhất của cả hai bên — dùng cái này khi chuyển máy.
        <strong>Khôi phục</strong> xoá sạch tiến độ hiện tại rồi thay bằng nội dung file — chỉ dùng khi bạn thật sự muốn quay về một bản sao lưu.
      </p>
    </div>
  `;
}

/** Câu mô tả ngắn trạng thái đồng bộ, hiển thị cạnh nút. */
function syncStatusText() {
  const s = syncStatus();
  if (!s.configured) return 'Chưa cấu hình';
  if (s.running) return 'Đang đồng bộ…';
  if (s.lastError) return `Lỗi: ${s.lastError}`;
  if (!s.lastAt) return 'Chưa đồng bộ lần nào';
  const d = new Date(s.lastAt);
  return `Đồng bộ lúc ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${fmtDate(s.lastAt)}`;
}

/** Listener cập nhật dòng trạng thái đồng bộ — giữ tham chiếu để gỡ khi mount lại. */
let statusListener = null;

export function mountStats(root) {
  root.querySelector('[data-action="export"]')?.addEventListener('click', () => {
    const blob = new Blob([store.export()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `neetcode30-tien-do-${store.today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  const pickFile = (mode) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      try {
        const summary = store.import(await input.files[0].text(), { mode });
        toast(mode === 'replace'
          ? 'Đã khôi phục tiến độ từ file.'
          : `Đã gộp: +${summary.newSolved} bài đã giải, +${summary.xpGained} điểm.`);
        setTimeout(() => location.reload(), 900);
      } catch { toast('File không hợp lệ.'); }
    };
    input.click();
  };

  root.querySelector('[data-action="import"]')?.addEventListener('click', () => pickFile('merge'));

  root.querySelector('[data-action="import-replace"]')?.addEventListener('click', () => {
    if (!confirm('Ghi đè sẽ XOÁ tiến độ hiện tại trên máy này và thay bằng nội dung file. Nếu bạn chỉ muốn chuyển máy, hãy dùng "Nhập & gộp". Tiếp tục?')) return;
    pickFile('replace');
  });

  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    if (!confirm('Xoá toàn bộ tiến độ, điểm số và code đã lưu? Không thể hoàn tác.')) return;
    store.reset();
    location.reload();
  });

  /* -------------------------- đồng bộ nhiều máy -------------------------- */
  const urlInput = root.querySelector('#sync-url');
  const codeInput = root.querySelector('#sync-code');
  const autoInput = root.querySelector('#sync-auto');
  const statusEl = root.querySelector('#sync-status');

  const refreshStatus = () => { if (statusEl) statusEl.textContent = syncStatusText(); };
  // Trang Thống kê được mount lại mỗi lần điều hướng tới -> gỡ listener cũ, tránh rò rỉ.
  if (statusListener) window.removeEventListener('sync-status', statusListener);
  statusListener = refreshStatus;
  window.addEventListener('sync-status', refreshStatus);

  /** Lưu cấu hình đang gõ; trả về false kèm thông báo nếu chưa hợp lệ. */
  function saveConfig() {
    const url = urlInput.value.trim();
    const code = codeInput.value.trim();
    if (!url || !code) { toast('Hãy điền cả địa chỉ máy chủ và mã đồng bộ.'); return false; }
    try {
      new URL(url);
    } catch { toast('Địa chỉ máy chủ không hợp lệ.'); return false; }
    if (!CODE_PATTERN.test(code)) {
      toast('Mã đồng bộ phải dài 16–64 ký tự, chỉ gồm chữ, số, "-" hoặc "_".');
      return false;
    }
    store.sync.set({ url, code, auto: autoInput.checked });
    return true;
  }

  root.querySelector('[data-action="gen-code"]')?.addEventListener('click', () => {
    codeInput.value = generateCode();
    toast('Đã tạo mã mới. Hãy dùng ĐÚNG mã này trên mọi máy của bạn.');
  });

  autoInput?.addEventListener('change', () => store.sync.set({ auto: autoInput.checked }));

  root.querySelector('[data-action="sync-now"]')?.addEventListener('click', async (e) => {
    if (!saveConfig()) return;
    const btn = e.currentTarget;
    btn.disabled = true;
    try {
      const { summary } = await syncManually();
      toast(summary.newSolved || summary.xpGained
        ? `Đã đồng bộ: +${summary.newSolved} bài đã giải, +${summary.xpGained} điểm từ máy khác.`
        : 'Đã đồng bộ. Mọi máy đang khớp nhau.');
      if (summary.newSolved || summary.xpGained || summary.newProblems) setTimeout(() => location.reload(), 900);
    } catch (err) {
      toast(`Đồng bộ thất bại: ${err.message}`);
    } finally {
      btn.disabled = false;
      refreshStatus();
    }
  });

  root.querySelector('[data-action="sync-forget"]')?.addEventListener('click', () => {
    if (!confirm('Xoá địa chỉ máy chủ và mã đồng bộ khỏi MÁY NÀY? Tiến độ đã học vẫn được giữ nguyên, và dữ liệu trên máy chủ không bị xoá.')) return;
    store.sync.clear();
    location.reload();
  });
}

/* ------------------------------ HƯỚNG DẪN ------------------------------ */
export function renderGuide() {
  return `
    <h1>🧭 Cách dùng app này</h1>
    <p class="sub">Đọc 3 phút, tiết kiệm cả tháng.</p>

    <div class="card md">
      <h2>Một ngày học nên diễn ra thế nào</h2>
      <ol>
        <li><strong>Đọc bài giảng (20–25 phút).</strong> Đừng đọc lướt. Phần quan trọng nhất là <em>"Ý tưởng cốt lõi"</em> và <em>"Dấu hiệu nhận biết"</em> — đó là thứ giúp bạn giải bài <em>chưa từng thấy</em>.</li>
        <li><strong>Tự nghĩ 10 phút trước khi mở gợi ý.</strong> Khoảng thời gian bế tắc chính là lúc bộ não học được nhiều nhất. Mở gợi ý quá sớm là cách nhanh nhất để "học mà không nhớ".</li>
        <li><strong>Code và chạy test.</strong> Sai thì đọc phần <em>chẩn đoán tự động</em> và thẻ <em>"Lỗi này nghĩa là gì?"</em> — chúng chỉ ra <em>loại lỗi</em> bạn mắc, không chỉ chỗ sai.</li>
        <li><strong>Trả lời câu hỏi độ phức tạp.</strong> Giải được mà không biết nó tốn bao nhiêu thì chưa xong việc.</li>
        <li><strong>Đọc phần "Phân tích &amp; lời giải" kể cả khi đã giải đúng.</strong> Nó nói về <em>mẫu hình</em>, thứ sẽ quay lại ở các bài khó hơn.</li>
        <li><strong>Làm quiz và các bài đến hạn ôn.</strong></li>
      </ol>

      <h2>Hệ thống chấm điểm hoạt động ra sao</h2>
      <p>Điểm phản ánh <strong>mức độ tự lực</strong>, không phải "chạy đúng hay không". Ai cũng copy được lời giải — nhưng điểm sẽ nói thật.</p>
      <table>
        <thead><tr><th>Thành phần</th><th>Ảnh hưởng</th></tr></thead>
        <tbody>
          <tr><td>Điểm cơ bản</td><td>Dễ 100 · Trung bình 160 · Khó 220</td></tr>
          <tr><td>Mở gợi ý bậc 1 / 2 / 3</td><td>−8% / −20% / −34% (tích luỹ)</td></tr>
          <tr><td>Xem lời giải</td><td>Điểm bị chặn trần ở 30%</td></tr>
          <tr><td>Đúng ngay lần nộp đầu tiên</td><td>+15%</td></tr>
          <tr><td>Trả lời đúng câu hỏi độ phức tạp</td><td>+10%</td></tr>
          <tr><td>Giải trong thời gian mục tiêu</td><td>+10%</td></tr>
        </tbody>
      </table>
      <p>Xếp hạng: <strong>S</strong> ≥115% · <strong>A</strong> ≥100% · <strong>B</strong> ≥80% · <strong>C</strong> ≥60% · <strong>D</strong> còn lại (bắt buộc làm lại).</p>
      <p>Mức thành thạo mỗi chủ đề = 70% từ điểm bài tập + 30% từ quiz. <strong>Đạt 80% mới nên coi là xong một chủ đề.</strong></p>

      <h2>Khi code chạy sai — bốn công cụ gỡ lỗi</h2>
      <p>Phần lớn thời gian học code là thời gian <em>tìm xem mình sai ở đâu</em>. Bốn thứ dưới đây rút ngắn nó lại:</p>
      <table>
        <thead><tr><th>Công cụ</th><th>Dùng khi nào</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>🧭 Thẻ giải thích lỗi</strong></td>
            <td>Tự hiện khi code ném lỗi. Nói rõ <em>lỗi này nghĩa là gì · vì sao thường xảy ra · sửa thế nào</em> bằng tiếng Việt, kèm <strong>số dòng</strong> gây lỗi và nút nhảy thẳng tới dòng đó. Thông báo gốc tiếng Anh vẫn giữ trong phần gập lại.</td>
          </tr>
          <tr>
            <td><strong>🔍 Theo dõi biến</strong></td>
            <td>Gọi <code>trace({ i, l, r })</code> (JavaScript) hoặc <code>trace(i=i, l=l, r=r)</code> (Python) ở bất cứ đâu trong code. App hiện bảng giá trị các biến <strong>qua từng bước</strong>, ô nào vừa đổi giá trị thì tô sáng. Đây là cách nhanh nhất để thuật toán thôi là "hộp đen".</td>
          </tr>
          <tr>
            <td><strong>▶ Chạy lại một test</strong></td>
            <td>Nút trên mỗi dòng test. Chỉ chạy đúng test đó — nhanh hơn nhiều so với chạy cả bộ, và <strong>không tính lượt thử, không ảnh hưởng điểm</strong>.</td>
          </tr>
          <tr>
            <td><strong>🧪 Chạy thử</strong></td>
            <td>Ô dưới trình soạn thảo: tự nhập dữ liệu bất kỳ và xem hàm trả về gì. Không chấm điểm. Ô đã điền sẵn ví dụ đúng định dạng để bạn sửa cho nhanh.</td>
          </tr>
        </tbody>
      </table>
      <p><code>console.log</code> / <code>print</code> của <strong>mỗi test hiện riêng trong thẻ test đó</strong>, không trộn chung — nên bạn luôn biết dòng log nào là của test nào.</p>

      <h2>Nhớ cú pháp và cấu trúc dữ liệu</h2>
      <p>Hai mục phục vụ hai lúc khác nhau:</p>
      <ul>
        <li><strong>🔎 Tra cứu nhanh</strong> — dùng <em>khi đang cần</em>. Có bảng "đề bài nói thế này → dùng cấu trúc nào",
          bảng chi phí thao tác của 11 cấu trúc dữ liệu (kèm cú pháp cả JavaScript lẫn Python), bảng đối chiếu
          <strong>JS ↔ Python</strong> và toàn bộ bảng cú pháp có nút chép. Gõ không dấu cũng tìm được.
          Trong trang làm bài, nút <strong>🔎 Tra cứu</strong> mở ngay panel này mà không phải rời bài.</li>
        <li><strong>🧠 Luyện nhớ</strong> — dùng <em>để lần sau khỏi phải tra</em>. Thẻ ghi nhớ hai mặt, tự chấm
          Quên / Khó / Dễ, xếp lịch bằng đúng thuật toán ôn ngắt quãng của bài tập.
          <strong>Nghĩ ra câu trả lời trong đầu trước khi lật thẻ</strong> — đoán rồi kiểm tra mới là lúc trí nhớ được củng cố.</li>
      </ul>

      <h2>Sổ tay: giữ lại thứ bạn rút ra được</h2>
      <p>Mỗi trang bài tập có pane <strong>📝 Ghi chú của bạn</strong> (tự lưu) và nút <strong>☆ Đánh dấu</strong>.
        Mục <strong>📔 Sổ tay</strong> gom tất cả lại, cộng thêm mục <strong>⚠️ Lỗi bạn hay mắc</strong> —
        xếp hạng các loại lỗi bạn lặp lại nhiều nhất kèm cách sửa. Một loại lỗi lặp lại nhiều lần là
        <em>lỗ hổng kiến thức</em>, không phải sự vô ý.</p>
      <p class="muted">Mẹo viết ghi chú cho đáng: đừng chép lại lời giải (đã có sẵn rồi). Hãy viết
        <em>"mẫu hình của bài này là gì"</em> và <em>"lần sau nhìn dấu hiệu nào để nhận ra"</em>.</p>

      <h2>Đi lại trong app cho nhanh</h2>
      <table>
        <thead><tr><th>Phím / nút</th><th>Tác dụng</th></tr></thead>
        <tbody>
          <tr><td>Ctrl + K (hoặc ⌘ + K)</td><td>Mở bảng lệnh — gõ vài chữ là nhảy tới bất kỳ bài tập, chủ đề hay trang nào. Dùng được cả khi con trỏ đang trong ô code.</td></tr>
          <tr><td>/</td><td>Cũng mở bảng lệnh (khi bạn không đang gõ trong ô nhập nào).</td></tr>
          <tr><td>↑ ↓ · Enter · Esc</td><td>Chọn · mở · đóng bảng lệnh</td></tr>
          <tr><td>Ô lọc ở Ngân hàng bài tập</td><td>Lọc theo độ khó, trạng thái (chưa giải / đã giải / đến hạn ôn / đã đánh dấu) và chủ đề</td></tr>
        </tbody>
      </table>
      <p>Mọi ô tìm kiếm trong app đều <strong>bỏ dấu</strong>: gõ <code>hai con tro</code> ra "Hai con trỏ", gõ <code>dem tan suat</code> ra mục đếm tần suất.</p>

      <h2>Trình soạn thảo &amp; gợi ý cú pháp</h2>
      <p>Ô viết code có tô màu cú pháp, đánh số dòng và <strong>bảng gợi ý</strong> kèm chữ ký hàm + giải thích tiếng Việt — đang học Python mà chưa thuộc <code>enumerate</code>, <code>defaultdict</code> hay <code>heappush</code> thì cứ gõ vài ký tự đầu là ra. Bên dưới ô code còn có bảng <em>"Cú pháp thường dùng"</em>: bấm một mẫu là chèn thẳng vào chỗ con trỏ.</p>
      <table>
        <thead><tr><th>Phím</th><th>Tác dụng</th></tr></thead>
        <tbody>
          <tr><td>Ctrl + Enter</td><td>Chạy &amp; chấm điểm</td></tr>
          <tr><td>Ctrl + Space</td><td>Mở bảng gợi ý cú pháp bất cứ lúc nào</td></tr>
          <tr><td>Ctrl + Z</td><td>Hoàn tác — vẫn hoạt động bình thường như trình duyệt</td></tr>
          <tr><td>Tab / Enter</td><td>Chọn gợi ý đang sáng · Esc để đóng bảng</td></tr>
          <tr><td>Tab / Shift + Tab</td><td>Thụt vào / thụt ra (Python 4 dấu cách, JS 2) — bôi đen nhiều dòng thì áp dụng cả khối</td></tr>
          <tr><td>Enter</td><td>Tự giữ thụt lề; sau dấu <code>:</code> tự thụt vào, sau <code>return</code>/<code>break</code>/<code>continue</code> tự thụt ra</td></tr>
        </tbody>
      </table>
      <p>Ngoặc và nháy tự đóng theo cặp; bôi đen rồi gõ <code>(</code> sẽ bọc vùng đang chọn. Ctrl + Z hoàn tác vẫn hoạt động bình thường.</p>

      <h2>Ôn tập ngắt quãng</h2>
      <p>Sau khi giải xong, mỗi bài được lên lịch ôn lại theo thuật toán SM-2 rút gọn: lần đầu sau 1 ngày, rồi 3 ngày, rồi giãn dần theo chất lượng bạn làm được. Bài điểm thấp sẽ quay lại sớm hơn. Đây là phần <strong>quyết định</strong> bạn còn nhớ gì sau 30 ngày — đừng bỏ qua.</p>

      <h2>Test hiệu năng</h2>
      <p>Nhiều bài có test với dữ liệu rất lớn (tới 200.000 phần tử) và giới hạn 6 giây. Lời giải đúng logic nhưng sai độ phức tạp <strong>sẽ trượt</strong> — giống hệt phỏng vấn thật. Nếu chỉ trượt test hiệu năng, hệ thống sẽ nói rõ cho bạn biết.</p>

      <h2>Nếu bạn chỉ có 60 phút/ngày</h2>
      <p>Hãy làm phiên bản rút gọn: đọc bài giảng + giải bài <strong>đầu tiên</strong> của mỗi ngày + làm quiz. Bỏ bài thứ hai. Lộ trình sẽ dài khoảng 45 ngày thay vì 30 — vẫn tốt hơn nhiều so với bỏ cuộc ở ngày thứ 10.</p>

      <h2>Nguyên tắc quan trọng nhất</h2>
      <blockquote>Đừng đo tiến bộ bằng "số bài đã giải". Hãy đo bằng: <em>khi gặp một bài lạ, bạn có nhận ra nó thuộc mẫu hình nào không?</em></blockquote>
      <p>Đó là lý do mỗi bài giảng đều có mục "Dấu hiệu nhận biết", và mỗi bài tập đều có mục "Ứng dụng thực tế".</p>
    </div>
  `;
}
