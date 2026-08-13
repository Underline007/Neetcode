/**
 * Kiểm chứng phần ĐO HIỆU NĂNG của worker JavaScript (src/sandbox.worker.js).
 *
 * Phép đo này ảnh hưởng tới điểm, nên nó phải đúng ở ba mặt:
 *   - phân biệt được O(n²) với O(n) (tỉ lệ phải lớn, không phải "hơi lớn");
 *   - công bằng: cùng một đoạn code chạy ở hai phía thì tỉ lệ phải ~1×;
 *   - mỗi lần gọi nhận một BẢN SAO đầu vào, vì hàm của người học có thể sửa
 *     thẳng vào tham số (sort tại chỗ) — nếu không, lượt đo sau sẽ đo trên dữ
 *     liệu đã bị hỏng.
 *
 * Worker không import được (nó là classic worker, chạy bằng `self`), nên ở đây
 * ta nạp thẳng mã nguồn của nó vào một hàm với `self` giả — vẫn là ĐÚNG đoạn mã
 * chạy trong trình duyệt, không phải bản sao chép lại.
 *
 *   node tools/test-bench.mjs
 */
import { readFileSync } from 'node:fs';
import { PROBLEMS, buildTests } from '../src/data/index.js';
import { benchTests, measureTests, perfTier, perfLabel, perfAdvice } from '../src/perf.js';

let passed = 0;
const failures = [];
const check = (name, ok, detail = '') => {
  if (ok) { passed++; return; }
  failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

/* ---------- nạp worker với `self` giả ---------- */
function loadWorker(clock = performance, { bridgeTrace = false } = {}) {
  const src = readFileSync(new URL('../src/sandbox.worker.js', import.meta.url), 'utf8');
  const fake = {};
  let inbox = null;
  fake.postMessage = (m) => { inbox = m; };
  // eslint-disable-next-line no-new-func
  new Function('self', 'performance', 'structuredClone', src)(fake, clock, structuredClone);
  // Trong trình duyệt `self` LÀ đối tượng toàn cục, nên `self.trace = ...` đồng thời tạo
  // ra biến toàn cục `trace` mà code người học gọi được. Ở Node thì không — bắc cầu lại
  // bằng getter để phép thử "trace() còn hoạt động sau khi đo" là phép thử thật.
  // Chỉ bắc cầu cho MỘT worker: hai worker cùng giành biến `trace` thì bảng theo dõi
  // biến sẽ được ghi vào worker này mà đọc ra ở worker kia.
  if (bridgeTrace) Object.defineProperty(globalThis, 'trace', { configurable: true, get: () => fake.trace });
  return {
    send(msg) {
      inbox = null;
      fake.onmessage({ data: msg });
      return inbox;
    },
  };
}

const worker = loadWorker(performance, { bridgeTrace: true });
const bench = (msg) => worker.send({ mode: 'bench', ...msg });

/* ================= 1. O(n²) vs O(n): tỉ lệ phải lộ rõ ================= */
{
  const entry = 'hasDup';
  const fast = `function hasDup(a){const s=new Set();for(const x of a){if(s.has(x))return true;s.add(x);}return false;}`;
  const slow = `function hasDup(a){for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(a[i]===a[j])return true;return false;}`;
  const tests = [{ name: 'n=1200 không trùng', args: [Array.from({ length: 1200 }, (_, i) => i)] }];

  const res = bench({ code: slow, refCode: fast, entry, tests });
  check('đo được', res?.ok === true, JSON.stringify(res)?.slice(0, 200));
  check('có nhãn mode để phân biệt với lượt chấm thường', res?.mode === 'bench');
  check('thời gian hai bên đều > 0', res?.ours?.ms > 0 && res?.ref?.ms > 0, JSON.stringify(res?.ours));
  check('O(n²) bị phát hiện là chậm hơn nhiều lần', res?.ratio > 10, `tỉ lệ ${res?.ratio?.toFixed(1)}×`);
  check('bậc hiệu năng: mất thưởng', perfTier(res.ratio).credit === 0, perfTier(res.ratio).key);
  check('báo đúng số test đã đo', res?.tests === 1);
  check('biết là chưa đo trên dữ liệu lớn', res?.onBigData === false);

  const same = bench({ code: fast, refCode: fast, entry, tests });
  check('cùng một code ở hai phía -> tỉ lệ ~1×', same.ratio > 0.6 && same.ratio < 1.7, `tỉ lệ ${same.ratio?.toFixed(2)}×`);
  check('cùng một code -> vẫn nhận đủ thưởng', perfTier(same.ratio).credit === 1, perfTier(same.ratio).key);

  const reversed = bench({ code: fast, refCode: slow, entry, tests });
  check('code nhanh hơn lời giải mẫu -> tỉ lệ < 1', reversed.ratio < 0.3, `tỉ lệ ${reversed.ratio}`);
  check('bậc "nhanh hơn tham chiếu"', perfTier(reversed.ratio).key === 'faster');
}

/* ================= 2. Mỗi lần gọi phải nhận bản sao đầu vào ================= */
{
  // Hàm này báo lỗi nếu nhận lại đúng object đã bị nó sửa ở lượt trước.
  const code = `function touch(o){ if (o.seen) throw new Error('đầu vào bị dùng lại'); o.seen = true; return 1; }`;
  const res = bench({ code, refCode: code, entry: 'touch', tests: [{ name: 'sửa tham số', args: [{ n: 1 }] }] });
  check('sửa thẳng vào tham số vẫn đo được (đầu vào luôn là bản sao mới)', res?.ok === true, res?.error);
}

/* ================= 3. Đo trên chính dữ liệu của bài thật ================= */
{
  // contains-duplicate có test dữ liệu lớn -> phép đo phải tự chọn đúng test đó.
  const p = PROBLEMS.find((x) => x.id === 'contains-duplicate');
  const tests = benchTests(buildTests(p));
  check('bài có test dữ liệu lớn -> đo trên test đó', tests.length === 1 && tests[0].perf === true,
    tests.map((t) => t.name).join(', '));

  const res = bench({ code: p.solution, refCode: p.solution, entry: p.entry, tests, harnessSrc: p.harnessSrc });
  check('đo được lời giải mẫu của bài thật', res?.ok === true, res?.error);
  check('đánh dấu là đã đo trên dữ liệu lớn', res?.onBigData === true);
  check('lời giải mẫu so với chính nó -> ~1×', res.ratio > 0.6 && res.ratio < 1.7, `tỉ lệ ${res.ratio?.toFixed(2)}×`);
  check('dữ liệu lớn nên thời gian đo được cỡ mili-giây (tin được)', res.ref.ms > 0.05, `${res.ref.ms} ms`);
}

/* ================= 4. Bài dùng harness riêng (entry là một lớp) ================= */
{
  const p = PROBLEMS.find((x) => x.id === 'min-stack');
  if (!p) {
    check('có bài min-stack để kiểm tra harness', false);
  } else {
    const res = bench({
      code: p.solution, refCode: p.solution, entry: p.entry,
      tests: benchTests(buildTests(p)), harnessSrc: p.harnessSrc,
    });
    check('bài có harness riêng vẫn đo được', res?.ok === true, res?.error);
  }
}

/* ================= 5. Đường lỗi ================= */
{
  const bad = bench({ code: 'function a(){}', refCode: 'function b(){}', entry: 'khongCo', tests: [{ args: [] }] });
  check('không tìm thấy hàm -> báo lỗi thay vì treo', bad?.ok === false && bad?.phase === 'bench', JSON.stringify(bad));

  const noTests = bench({ code: 'function f(){}', refCode: 'function f(){}', entry: 'f', tests: [{ args: [], scratch: true }] });
  check('chỉ có test "chạy thử" -> không đo', noTests?.ok === false && /Không có test/.test(noTests.error || ''));
}

/* ====== 6. Dữ liệu lớn để đo (src/data/perf-bench.js) phải dùng được thật ====== */
{
  const withBench = PROBLEMS.filter((p) => p.perfBench?.length);
  check('có bài được gắn dữ liệu lớn để đo', withBench.length >= 10, `mới có ${withBench.length} bài`);

  for (const p of withBench) {
    const tests = measureTests(p, buildTests(p));
    check(`[${p.id}] dữ liệu đo là dữ liệu lớn`, tests.length > 0 && tests.every((t) => t.perf === true));

    const res = bench({ code: p.solution, refCode: p.solution, entry: p.entry, tests, harnessSrc: p.harnessSrc });
    if (res?.ok !== true) {
      check(`[${p.id}] lời giải mẫu chạy được trên dữ liệu lớn`, false, res?.error);
      continue;
    }

    // Dữ liệu phải đủ lớn để NÓI ĐƯỢC điều gì — theo một trong ba dấu hiệu, vì mỗi
    // bài "lớn" theo một kiểu: nhiều phần tử, tham số là số lớn (bài đếm bit), hoặc
    // ít phần tử nhưng lời giải mẫu phải làm việc thật (3Sum là O(n²) trên 300 số).
    for (const t of tests) {
      const json = JSON.stringify(t.args);
      const bigNumber = t.args.some((a) => typeof a === 'number' && a >= 10000);
      check(`[${p.id}] "${t.name}" đủ lớn để đo`,
        json.length >= 4000 || bigNumber || res.ref.ms >= 0.05,
        `${json.length} ký tự, lời giải mẫu ${res.ref.ms.toFixed(3)} ms`);
    }
    // Lời giải mẫu không được thành gánh nặng: nó còn phải chạy bằng Python trong
    // trình duyệt (Pyodide), chậm hơn JavaScript hàng chục lần.
    check(`[${p.id}] lời giải mẫu vẫn nhanh (${res.ref.ms.toFixed(3)} ms)`, res.ref.ms < 12, `${res.ref.ms} ms`);
    check(`[${p.id}] so với chính nó ra ~1×`, res.ratio > 0.5 && res.ratio < 2, `tỉ lệ ${res.ratio?.toFixed(2)}×`);
  }
}

/* ====== 6b. Lời giải sai độ phức tạp phải bị dữ liệu lớn bắt được ====== */
{
  // Bản O(n²) của "gom nhóm chữ cái": đúng logic, sai độ phức tạp.
  const p = PROBLEMS.find((x) => x.id === 'group-anagrams');
  const slow = `function groupAnagrams(strs) {
    const key = (s) => s.split('').sort().join('');
    const groups = [];
    for (const s of strs) {
      let found = null;
      for (const g of groups) if (key(g[0]) === key(s)) { found = g; break; }
      if (found) found.push(s); else groups.push([s]);
    }
    return groups;
  }`;

  const onSmall = bench({ code: slow, refCode: p.solution, entry: p.entry, tests: benchTests(p.tests) });
  const onBig = bench({ code: slow, refCode: p.solution, entry: p.entry, tests: measureTests(p, buildTests(p)) });

  // Chính vì điều này mà cần perf-bench.js: trên bộ test 6 từ, bản O(n²) còn NHANH hơn.
  check('trên dữ liệu nhỏ, bản O(n²) không bị phát hiện', onSmall.ratio < 2, `tỉ lệ ${onSmall.ratio?.toFixed(2)}×`);
  check('trên dữ liệu lớn, bản O(n²) bị phát hiện', onBig.ratio > 6, `tỉ lệ ${onBig.ratio?.toFixed(1)}×`);
  check('và bị mất thưởng hiệu năng', perfTier(onBig.ratio).credit === 0, perfTier(onBig.ratio).key);

  // Nhãn phải nói đúng mức tin cậy: đo trên dữ liệu nhỏ thì không được kết luận
  // "nhanh hơn lời giải tham chiếu" như thể đó là kết luận về độ phức tạp.
  const fasterTier = perfTier(0.5);
  check('dữ liệu nhỏ: nhãn có nói rõ "dữ liệu nhỏ"', /dữ liệu nhỏ/.test(perfLabel(fasterTier, false)),
    perfLabel(fasterTier, false));
  check('dữ liệu nhỏ: lời khuyên cảnh báo O(n²) có thể "thắng"',
    /không.*đồng nghĩa|Cẩn thận/i.test(perfAdvice(fasterTier, false)));
  check('dữ liệu lớn: giữ nhãn khẳng định', perfLabel(fasterTier, true) === fasterTier.label);
}

/* ============ 7. Đồng hồ THÔ của trình duyệt (bẫy đã thật sự xảy ra) ============ */
{
  // Node đo được tới nano-giây, nhưng performance.now() trong trình duyệt bị làm thô
  // tới ~0.1 ms (có cấu hình còn 1 ms) để chống đo mạch thời gian. Một hàm nhỏ chạy
  // 20 µs sẽ đo ra 0 ms — và 0/0 thì không so được gì: đúng lỗi đã gặp khi chạy thật.
  const coarse = { now: () => Math.floor(performance.now()) };   // độ phân giải 1 ms
  const rough = loadWorker(coarse);
  const tiny = `function add(a,b){return a+b;}`;
  const tinySlow = `function add(a,b){const t=[];for(let i=0;i<300;i++)t.push((a+b)*i);return t.length===300?a+b:0;}`;
  const tests = [{ name: 'cộng hai số', args: [2, 3] }];

  const same = rough.send({ mode: 'bench', code: tiny, refCode: tiny, entry: 'add', tests });
  check('[đồng hồ thô] hàm cực nhỏ vẫn đo ra thời gian > 0', same.ok && same.ours.ms > 0 && same.ref.ms > 0,
    JSON.stringify({ ours: same.ours, ref: same.ref }));
  check('[đồng hồ thô] tỉ lệ là số dùng được, không phải null', Number.isFinite(same.ratio) && same.ratio > 0, `${same.ratio}`);
  check('[đồng hồ thô] phải nhân số lần lặp lên rất nhiều', same.ours.inner > 1000, `inner=${same.ours.inner}`);

  // Hai bên lệch nhau hàng trăm lần: mỗi bên phải tự chọn số lần lặp của mình, nếu
  // dùng chung một con số thì bên nhanh lại đo ra 0 ms và tỉ lệ thành null.
  const slower = rough.send({ mode: 'bench', code: tinySlow, refCode: tiny, entry: 'add', tests });
  check('[đồng hồ thô] bên nhanh và bên chậm dùng số lần lặp KHÁC nhau',
    slower.ref?.inner > slower.ours?.inner, `ours=${slower.ours?.inner}, ref=${slower.ref?.inner}`);
  check('[đồng hồ thô] vẫn phân biệt được nhanh/chậm', slower.ratio > 10, `tỉ lệ ${slower.ratio?.toFixed?.(1)}×`);
}

/* ================= 8. Không làm hỏng lượt chấm thường ================= */
{
  const p = PROBLEMS.find((x) => x.id === 'contains-duplicate');
  const res = worker.send({
    code: p.solution, entry: p.entry, tests: p.tests,
    harnessSrc: p.harnessSrc, checkerSrc: p.checkerSrc,
  });
  check('lượt chấm bình thường vẫn chạy', res?.ok === true, JSON.stringify(res)?.slice(0, 160));
  check('tất cả test vẫn đạt', res?.results?.every((r) => r.pass) === true);
  // print/trace bị vô hiệu hoá TRONG lúc đo -> phải được trả lại sau đó
  const withLog = worker.send({
    code: 'function f(a){ console.log("xin chao"); trace({ a }); return a; }',
    entry: 'f', tests: [{ name: 'log', args: [1], expected: 1 }],
  });
  check('console.log của người học vẫn được thu lại sau khi đo',
    withLog?.results?.[0]?.logs?.join(' ') === 'xin chao', JSON.stringify(withLog?.results?.[0]?.logs));
  check('trace() vẫn hoạt động sau khi đo', withLog?.results?.[0]?.trace?.rows?.length === 1);
}

console.log(`Đo hiệu năng (JavaScript): ${passed} kiểm tra đạt${failures.length ? `, ${failures.length} THẤT BẠI` : ''}.`);
if (failures.length) {
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('✓ Phép đo phân biệt được độ phức tạp và không thiên vị bên nào.');
