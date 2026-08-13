/**
 * Kiểm chứng từ điển cú pháp (src/hints/*).
 *
 * Hai việc, cả hai đều quan trọng với người mới học:
 *   1. ĐỦ và ĐÚNG KHUÔN — mỗi mục có chữ ký, có một câu giải thích bằng tiếng Việt
 *      thường (không phải mấy chữ viết tắt), và có ví dụ; các module của lộ trình
 *      Python đều được phủ từ khoá.
 *   2. VÍ DỤ KHÔNG NÓI SAI — mọi ví dụ dạng `code → kết quả` được chạy thật bằng
 *      CPython (tools/check_hint_examples.py) và so với kết quả đã ghi.
 *
 *   node tools/test-hints.mjs
 */
import { spawn } from 'node:child_process';
import { HINTS } from '../src/hints/index.js';
import { HINT_TOPICS, EX_EXACT, EX_ABOUT } from '../src/hints/item.js';
import { PY_TOPICS } from '../src/data/python/index.js';

const PY_BIN = process.env.PYTHON || 'python';

let passed = 0;
const failures = [];
const check = (name, ok, detail = '') => {
  if (ok) { passed++; return; }
  failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

const all = (lang) => [...HINTS[lang].globals, ...HINTS[lang].members];

/* ===================== 1. Khuôn dữ liệu ===================== */
const KINDS = new Set(['kw', 'fn', 'mod', 'm', 'snip']);
/** Mục không cần ví dụ: mẫu code (bản thân nó đã là ví dụ) và các mục chỉ là cú pháp khai báo. */
const EX_OPTIONAL = new Set(['snip']);

for (const lang of ['python', 'javascript']) {
  const items = all(lang);
  const labels = new Map();
  // Yêu cầu "giải thích thành câu + có ví dụ" áp cho PYTHON — đó là lộ trình đang học
  // và là phần đã được viết lại. Bộ JavaScript giữ nguyên mức cũ, chỉ kiểm tra khuôn.
  const strict = lang === 'python';

  for (const it of items) {
    const at = `[${lang}] ${it.label}`;
    if (!KINDS.has(it.kind)) check(`${at}: kind hợp lệ`, false, it.kind);
    if (!it.detail) check(`${at}: có chữ ký`, false);
    if (!it.doc) check(`${at}: có giải thích`, false);
    // "Copy NÔNG (một tầng)" là kiểu giải thích người mới đọc không hiểu -> đặt sàn
    // độ dài để buộc viết thành câu.
    else if (strict && it.doc.length < 25) check(`${at}: giải thích quá ngắn`, false, `"${it.doc}"`);
    for (const ex of it.ex || []) {
      const ok = ex.includes(` ${EX_EXACT} `) || ex.includes(` ${EX_ABOUT} `);
      if (!ok) check(`${at}: ví dụ phải có "${EX_EXACT}" hoặc "${EX_ABOUT}"`, false, ex);
    }
    if (strict && !EX_OPTIONAL.has(it.kind) && !(it.ex || []).length) {
      check(`${at}: cần ít nhất một ví dụ`, false);
    }
    if (strict && !it.topic) check(`${at}: chưa gắn chủ đề`, false);

    const prev = labels.get(it.label);
    if (prev !== undefined && prev === it.kind) check(`${at}: trùng mục`, false);
    labels.set(it.label, it.kind);
  }

  check(`[${lang}] từ điển có nội dung`, items.length > 50, `${items.length} mục`);
}

/* ===================== 2. Phủ hết 15 module Python ===================== */
{
  const pyItems = all('python');
  const byTopic = new Map();
  for (const it of pyItems) byTopic.set(it.topic, (byTopic.get(it.topic) || 0) + 1);

  for (const t of HINT_TOPICS) {
    check(`chủ đề "${t.id}" có mục`, (byTopic.get(t.id) || 0) >= 5, `${byTopic.get(t.id) || 0} mục`);
  }
  for (const id of byTopic.keys()) {
    check(`chủ đề "${id}" nằm trong danh sách chủ đề`, HINT_TOPICS.some((t) => t.id === id));
  }
  // Mỗi module của lộ trình phải có chủ đề tương ứng, để tra cứu theo module được
  for (const t of PY_TOPICS) {
    check(`module ${t.id} có chủ đề tra cứu`, HINT_TOPICS.some((h) => h.module === t.id), t.name);
  }

  // Những từ khoá mà 15 module dạy: tra cứu phải có, không thì học xong không tra được
  const MUST_HAVE = [
    '//', '%', '**', '*args', '**kwargs', ':=', 'f-string',
    'self', '__init__', '__repr__', '__eq__', 'super', '@dataclass', '@property', '@staticmethod',
    'yield', 'yield from', 'next', 'iter', '@wraps', 'partial', 'reduce',
    're.search', 're.findall', 're.sub', 'zfill', 'title', 'format', 'splitlines',
    'ValueError', 'TypeError', 'KeyError', 'IndexError', 'finally', 'raise',
    'open', 'json.dumps', 'json.loads', 'csv.DictReader', 'Path',
    '__enter__', '__exit__', 'contextmanager', 'suppress',
    'Optional', 'Callable', 'Iterable', 'TypeVar', 'Protocol', 'NamedTuple',
    'math.sqrt', 'math.gcd', 'randint', 'datetime', 'timedelta', 'deepcopy',
    'pytest.raises', 'parametrize', 'fixture', 'approx',
    'abstractmethod', '__call__', '__iter__', '__getitem__', 'total_ordering',
    'Thread', 'Lock', 'ThreadPoolExecutor', 'perf_counter', 'lru_cache', '__slots__',
  ];
  const have = new Set(pyItems.map((i) => i.label));
  const missing = MUST_HAVE.filter((k) => !have.has(k));
  check('phủ hết từ khoá cốt lõi của 15 module', missing.length === 0, `thiếu: ${missing.join(', ')}`);
}

/* ===================== 3. Chạy thật mọi ví dụ Python ===================== */
const cases = [];
for (const it of all('python')) {
  (it.ex || []).forEach((ex) => {
    const cut = ex.lastIndexOf(` ${EX_EXACT} `);
    if (cut < 0) return;                                  // ví dụ "≈" -> không kiểm chứng được
    cases.push({
      // id phải đánh theo số thứ tự phẳng: có những tên xuất hiện hai lần với hai
      // nghĩa khác nhau (count của list và count của itertools).
      id: `${cases.length}:${it.label}`,
      code: ex.slice(0, cut).trim(),
      expected: ex.slice(cut + 3).trim(),
      setup: it.setup || '',
    });
  });
}

const results = await new Promise((resolve, reject) => {
  const py = spawn(PY_BIN, ['tools/check_hint_examples.py'], {
    stdio: ['pipe', 'pipe', 'inherit'],
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
  });
  let out = '';
  py.stdout.on('data', (d) => { out += d; });
  py.on('error', (err) => reject(new Error(`Không chạy được "${PY_BIN}": ${err.message}`)));
  py.on('close', (code) => {
    if (code !== 0) return reject(new Error(`check_hint_examples.py thoát với mã ${code}`));
    try { resolve(JSON.parse(out)); } catch { reject(new Error(`Không đọc được kết quả:\n${out.slice(0, 400)}`)); }
  });
  py.stdin.end(JSON.stringify({ cases }));
});

const byId = new Map(cases.map((c) => [c.id, c]));
/** So kết quả: bỏ qua khác biệt về khoảng trắng và kiểu dấu nháy của Python. */
const same = (a, b) => a.replace(/\s+/g, '').replace(/"/g, "'") === b.replace(/\s+/g, '').replace(/"/g, "'");

let exOk = 0;
for (const r of results) {
  const c = byId.get(r.id);
  if (!r.ok) { check(`ví dụ "${c.code}" chạy được`, false, r.error); continue; }
  if (!same(r.got, c.expected)) {
    check(`ví dụ "${c.code}"`, false, `ghi ${c.expected}, thật ra ${r.got}`);
    continue;
  }
  exOk++;
  passed++;
}

console.log(`Từ điển cú pháp: ${all('python').length} mục Python · ${all('javascript').length} mục JavaScript · ${exOk}/${cases.length} ví dụ chạy đúng`);
console.log(`Tổng: ${passed} kiểm tra đạt${failures.length ? `, ${failures.length} THẤT BẠI` : ''}.`);
if (failures.length) {
  for (const f of failures.slice(0, 40)) console.error('  ✗ ' + f);
  if (failures.length > 40) console.error(`  … và ${failures.length - 40} lỗi nữa`);
  process.exit(1);
}
console.log('✓ Mọi mục đều có giải thích thành câu và ví dụ đã được chạy thật.');
