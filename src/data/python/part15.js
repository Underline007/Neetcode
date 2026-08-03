/**
 * LỘ TRÌNH PYTHON — MODULE 15: Concurrency cơ bản & Performance/Best Practice
 */

export default [
/* ==================================================================== */
{
  id: 'py-concurrency-performance',
  name: 'Concurrency cơ bản & Performance/Best Practice',
  en: 'Basic Concurrency & Performance Best Practices',
  icon: '⚡',
  summary: 'Điểm hiểu lầm phổ biến nhất về Python: threading KHÔNG giúp code tính toán nặng chạy nhanh hơn (vì GIL) — nhưng vẫn cực kỳ hữu ích cho tác vụ chờ mạng/đĩa. Biết đúng "loại việc" mới chọn đúng công cụ.',
  lesson: `
## 1. Vấn đề gốc

Nhiều người từ ngôn ngữ khác chuyển sang Python mang theo kỳ vọng: "dùng nhiều thread thì code chạy nhanh
hơn nhờ tận dụng nhiều nhân CPU". Với **CPython** (bản Python phổ biến nhất), điều này **SAI** cho phần lớn
trường hợp — vì một cơ chế gọi là **GIL (Global Interpreter Lock)**: tại một thời điểm, chỉ có **MỘT**
thread được phép thực thi bytecode Python, bất kể máy có bao nhiêu nhân CPU. Hiểu đúng GIL là điều kiện
tiên quyết để chọn đúng công cụ concurrency trong Python.

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript (Node.js) | Python |
|---|---|---|
| Mô hình xử lý mặc định | Đơn luồng (single-thread), non-blocking I/O qua event loop | CPython có GIL — về bản chất cũng chỉ MỘT thread thực thi Python code tại một thời điểm |
| Xử lý nhiều tác vụ CHỜ MẠNG/ĐĨA cùng lúc | \`async\`/\`await\`, Promise, event loop | \`asyncio\` (mô hình tương tự Node.js) HOẶC \`threading\` (GIL được nhả ra khi chờ I/O) |
| Tận dụng THẬT nhiều nhân CPU cho tính toán nặng | \`worker_threads\`/\`cluster\` (phức tạp hơn, ít dùng) | \`multiprocessing\` — mỗi process có GIL RIÊNG, chạy THẬT song song trên nhiều nhân |
| Đo hiệu năng trước khi tối ưu | \`console.time\`/profiler trình duyệt | \`time.perf_counter()\`, module \`cProfile\` |

## 3. Ý tưởng cốt lõi: chọn đúng công cụ theo LOẠI tác vụ

**(a) I/O-bound** (tác vụ dành phần lớn thời gian CHỜ — mạng, ổ đĩa, database): trong lúc một thread đang
chờ I/O hoàn tất, Python **tự động nhả GIL** cho thread khác chạy — threading VẪN hữu ích ở đây, dù không
"song song thật" theo nghĩa CPU. \`asyncio\` giải quyết cùng vấn đề này theo mô hình đơn luồng, hợp tác
(cooperative) — thường hiệu quả hơn threading khi số lượng tác vụ chờ I/O rất lớn (hàng nghìn kết nối).

**(b) CPU-bound** (tác vụ dành phần lớn thời gian TÍNH TOÁN thuần Python — không có gì để "chờ"): threading
**KHÔNG giúp gì** vì GIL không bao giờ được nhả ra giữa chừng (không có I/O để chờ). Muốn tận dụng thật
nhiều nhân CPU, phải dùng \`multiprocessing\` — chạy nhiều **process** riêng biệt (mỗi process có bộ nhớ và
GIL RIÊNG của nó), hệ điều hành phân phối các process này lên các nhân CPU khác nhau, đạt song song THẬT.

**(c) \`async def\`/\`await\`** — hàm khai báo \`async def\` là một **coroutine**: gọi nó KHÔNG chạy ngay lập
tức, mà trả về một "đối tượng coroutine" — phải \`await\` nó (hoặc chạy qua \`asyncio.run(...)\`) để thực sự
thực thi. \`asyncio.gather(coro1, coro2, ...)\` chạy NHIỀU coroutine "đồng thời" (xen kẽ nhau khi mỗi cái
đang chờ), trả về kết quả theo ĐÚNG THỨ TỰ đã truyền vào, bất kể cái nào hoàn thành trước.

**(d) Đo trước, tối ưu sau (profiling mindset)**: đừng đoán chỗ nào chậm — dùng \`time.perf_counter()\` (đo
thời gian) hoặc \`cProfile\` (đo chi tiết từng hàm) để tìm ĐÚNG chỗ chậm nhất TRƯỚC khi bỏ công sức tối ưu.
Tối ưu một đoạn code không phải bottleneck thực sự là lãng phí công sức và thường làm code khó đọc hơn mà
không cải thiện gì đáng kể về tốc độ tổng thể.

## 4. Dấu hiệu nhận biết

| Thấy trong tình huống | Nghĩ tới |
|---|---|
| "gọi hàng trăm API/tải hàng trăm file cùng lúc" | I/O-bound → \`asyncio\` hoặc \`threading\` |
| "xử lý ảnh/video/tính toán số học nặng cho hàng nghìn file" | CPU-bound → \`multiprocessing\` |
| "chỉ có 1 tác vụ, không có gì chạy song song" | không cần concurrency gì cả — thêm vào chỉ tăng độ phức tạp code vô ích |
| "code async chạy 'giật', một tác vụ chặn đứng mọi tác vụ khác" | có khả năng dùng nhầm \`time.sleep()\` thay vì \`asyncio.sleep()\` bên trong hàm \`async\` |
| "không biết chỗ nào code chậm, đoán đại rồi tối ưu" | dừng lại, dùng \`time.perf_counter()\`/\`cProfile\` đo trước |
| "nối chuỗi lớn bằng \`+=\` trong vòng lặp hàng chục nghìn lần" | đổi sang \`"".join(list_chuoi)\` — \`str\` bất biến khiến mỗi \`+=\` tạo chuỗi MỚI, tốn O(n) mỗi lần, tổng O(n²) |

## 5. Mẫu code cần thuộc lòng

\`\`\`python
import asyncio, time
from multiprocessing import Pool

# (a) asyncio — chạy nhiều coroutine "đồng thời" (xen kẽ khi chờ)
async def fetch(name):
    await asyncio.sleep(0.1)     # mô phỏng việc CHỜ mạng — dùng asyncio.sleep, KHÔNG dùng time.sleep
    return f"{name}: xong"

async def main():
    results = await asyncio.gather(fetch("A"), fetch("B"), fetch("C"))
    return results    # luôn theo ĐÚNG thứ tự đã truyền: [A, B, C], bất kể xong trước/sau

asyncio.run(main())

# (b) multiprocessing — CPU-bound, chạy THẬT song song trên nhiều nhân
def tinh_nang(n):
    return sum(i * i for i in range(n))

with Pool(4) as pool:                        # 4 process riêng biệt
    ket_qua = pool.map(tinh_nang, [10**6, 10**6, 10**6, 10**6])

# (c) Đo hiệu năng TRƯỚC khi tối ưu
start = time.perf_counter()
lam_viec_gi_do()
print(f"Mất {time.perf_counter() - start:.4f} giây")

# (d) Nối chuỗi lớn — join() thay vì += trong vòng lặp
parts = [str(i) for i in range(100_000)]
ket_qua = "".join(parts)      # O(n) tổng — thay vì += từng bước tốn O(n²)
\`\`\`

## 6. Bẫy thường gặp

- **Tưởng \`threading\` giúp code TÍNH TOÁN NẶNG chạy nhanh hơn**: sai vì GIL — nhiều thread chạy code CPU-
  bound có thể còn CHẬM HƠN một thread duy nhất (do chi phí chuyển đổi ngữ cảnh giữa các thread mà không thu
  được lợi ích song song thật nào).
- **Dùng \`time.sleep()\` bên trong một hàm \`async def\`**: \`time.sleep()\` chặn ĐỨNG toàn bộ event loop
  (không nhường quyền chạy cho coroutine khác đang chờ), phá vỡ hoàn toàn lợi ích của \`asyncio\` — luôn
  dùng \`asyncio.sleep()\` bên trong code bất đồng bộ.
- **Quên \`await\` một coroutine**: gọi \`fetch("A")\` (không có \`await\`) chỉ TẠO RA một đối tượng coroutine,
  KHÔNG thực sự chạy nó — Python thường cảnh báo \`RuntimeWarning: coroutine was never awaited\`, một lỗi dễ
  bị bỏ qua nếu không để ý log cảnh báo.
- **Tối ưu hoá mù quáng (premature optimization)**: bỏ nhiều giờ tối ưu một hàm chiếm 0.1% tổng thời gian
  chạy, trong khi bottleneck thật sự nằm ở một truy vấn database chậm không được để ý tới — luôn ĐO trước
  khi quyết định tối ưu chỗ nào.

## 7. Ứng dụng thực tế

- **Web scraper/crawler gọi hàng trăm API cùng lúc**: đây là I/O-bound kinh điển — \`asyncio\`/\`threading\`
  giảm đáng kể tổng thời gian so với gọi tuần tự từng API một.
- **Xử lý hàng loạt ảnh/video, huấn luyện mô hình machine learning trên CPU**: CPU-bound thuần tuý —
  \`multiprocessing\` (hoặc thư viện tối ưu native như NumPy, vốn giải phóng GIL khi chạy code C bên dưới) là
  lựa chọn đúng, threading sẽ không cải thiện gì.
- **Backend API xử lý hàng nghìn request đồng thời (mỗi request chủ yếu chờ database)**: framework hiện đại
  như FastAPI dùng \`asyncio\` để phục vụ số lượng kết nối lớn hiệu quả hơn nhiều so với mô hình một thread
  cho mỗi request.
- **Trước khi tối ưu bất kỳ hệ thống thực tế nào**: luôn profile để tìm bottleneck THẬT (thường là I/O,
  database, hoặc một thuật toán có độ phức tạp cao hơn cần thiết) trước khi đụng tới bất kỳ dòng code nào.
`,
  quiz: [
    {
      q: 'GIL (Global Interpreter Lock) trong CPython gây ra hệ quả gì?',
      options: [
        'Python không thể chạy được trên máy nhiều nhân CPU',
        'Tại một thời điểm, chỉ có MỘT thread được phép thực thi bytecode Python — nên nhiều thread KHÔNG giúp tăng tốc code TÍNH TOÁN THUẦN PYTHON (CPU-bound), dù máy có nhiều nhân CPU',
        'Mỗi thread trong Python luôn chạy trên một nhân CPU riêng biệt',
        'GIL chỉ ảnh hưởng tới `multiprocessing`, không ảnh hưởng tới `threading`',
      ],
      answer: 1,
      why: 'Đây là điểm hiểu lầm phổ biến nhất khi chuyển sang Python từ ngôn ngữ khác: `threading` trong CPython không mang lại song song THẬT cho tính toán CPU-bound vì GIL chỉ cho một thread thực thi Python bytecode tại một thời điểm.',
    },
    {
      q: 'Vì sao `threading` VẪN hữu ích cho các tác vụ I/O-bound (chờ mạng, đọc/ghi đĩa), dù có GIL?',
      options: [
        'Vì I/O-bound không liên quan gì tới GIL',
        'Vì khi một thread đang CHỜ I/O hoàn tất (không thực thi bytecode Python nào), GIL được NHẢ RA cho thread khác chạy — nhiều thread có thể cùng ở trạng thái "đang chờ" song song, giảm tổng thời gian chờ',
        'Vì GIL chỉ áp dụng cho code CPU-bound, hoàn toàn không áp dụng cho I/O-bound',
        '`threading` tự động tắt GIL khi phát hiện tác vụ I/O-bound',
      ],
      answer: 1,
      why: 'Trong lúc chờ I/O (không có bytecode Python nào cần thực thi), GIL được nhả ra, cho phép thread khác chạy — đây là lý do threading hiệu quả cho I/O-bound dù không hiệu quả cho CPU-bound.',
    },
    {
      q: '`multiprocessing` khác `threading` ở điểm cốt lõi nào, khiến nó phù hợp cho tác vụ CPU-bound?',
      options: [
        'Không có khác biệt, hai module hoạt động hoàn toàn giống nhau',
        'Mỗi process trong `multiprocessing` có bộ nhớ và GIL RIÊNG của nó — hệ điều hành có thể phân phối các process này lên các nhân CPU khác nhau, đạt được song song THẬT SỰ cho tính toán nặng',
        '`multiprocessing` chỉ dùng được cho tác vụ I/O-bound, không dùng được cho CPU-bound',
        '`multiprocessing` nhanh hơn `threading` trong MỌI trường hợp không có ngoại lệ',
      ],
      answer: 1,
      why: 'Vì mỗi process có GIL độc lập (không chia sẻ với process khác), tính toán CPU-bound chạy trên nhiều process có thể tận dụng thật sự nhiều nhân CPU — đánh đổi là chi phí giao tiếp giữa các process cao hơn nhiều so với giữa các thread (không chia sẻ bộ nhớ trực tiếp).',
    },
    {
      q: 'Vì sao dùng `time.sleep()` bên trong một hàm `async def` là một lỗi nghiêm trọng?',
      options: [
        '`time.sleep()` không hoạt động được bên trong hàm `async def`, sẽ báo lỗi cú pháp ngay lập tức',
        '`time.sleep()` chặn ĐỨNG toàn bộ event loop (không nhường quyền chạy cho bất kỳ coroutine nào khác), phá vỡ hoàn toàn lợi ích "chạy đồng thời" của `asyncio` — phải dùng `asyncio.sleep()` để nhường quyền chạy đúng cách',
        '`time.sleep()` chạy nhanh hơn `asyncio.sleep()` nên không có vấn đề gì',
        'Không có khác biệt nào, cả hai hoạt động y hệt nhau trong ngữ cảnh `async`',
      ],
      answer: 1,
      why: '`asyncio.sleep()` là một điểm "nhường quyền chạy" (yield control) hợp tác cho event loop, cho phép coroutine khác chạy trong lúc chờ. `time.sleep()` là blocking call thông thường, "đóng băng" toàn bộ thread (và do đó cả event loop) trong suốt thời gian chờ.',
    },
    {
      q: 'Vì sao nên "đo trước khi tối ưu" (profiling mindset) thay vì đoán chỗ nào chậm rồi tối ưu ngay?',
      options: [
        'Vì việc đo lường luôn tốn nhiều thời gian hơn lợi ích mang lại',
        'Vì trực giác về "chỗ nào chậm" thường SAI — tối ưu một đoạn code không phải bottleneck thực sự (ví dụ chỉ chiếm 0.1% tổng thời gian chạy) vừa lãng phí công sức, vừa có thể làm code khó đọc hơn mà không cải thiện gì đáng kể về hiệu năng tổng thể',
        'Vì Python không cho phép tối ưu code nếu chưa profiling trước',
        'Vì profiling luôn phát hiện đúng 100% mọi vấn đề hiệu năng ngay lần đo đầu tiên',
      ],
      answer: 1,
      why: 'Bottleneck thực sự thường nằm ở nơi không ai ngờ tới (một truy vấn database, một vòng lặp nối chuỗi bằng `+=`...). Đo đạc bằng công cụ (`time.perf_counter`, `cProfile`) trước khi tối ưu giúp tập trung đúng công sức vào nơi thực sự tạo ra khác biệt.',
    },
  ],
  problems: [
    {
      id: 'py-recommend-concurrency-tool',
      title: 'Chọn đúng công cụ concurrency',
      en: 'Recommend the Right Concurrency Tool',
      difficulty: 'Easy',
      targetMinutes: 8,
      entry: 'recommend_tool',
      lang: 'python',
      statement: `
Viết hàm \`recommend_tool(bound_type, task_count)\` khuyến nghị công cụ concurrency phù hợp:
- Nếu \`task_count <= 1\` → \`"khong can concurrency"\` (chỉ có 1 tác vụ, không có gì để chạy đồng thời).
- Nếu \`bound_type == "cpu"\` (và \`task_count > 1\`) → \`"multiprocessing"\` (CPU-bound, cần song song THẬT
  qua nhiều process, vì GIL khiến threading vô dụng ở đây).
- Nếu \`bound_type == "io"\` (và \`task_count > 1\`) → \`"asyncio hoac threading"\` (I/O-bound, GIL được nhả
  ra khi chờ, cả hai công cụ đều hiệu quả).

**Ví dụ**
- \`recommend_tool("io", 100)\` → \`"asyncio hoac threading"\`
- \`recommend_tool("cpu", 50)\` → \`"multiprocessing"\`
- \`recommend_tool("cpu", 1)\` → \`"khong can concurrency"\`
`,
      starter: `def recommend_tool(bound_type, task_count):\n    # task_count <= 1 -> "khong can concurrency"\n    # bound_type == "cpu" -> "multiprocessing"\n    # bound_type == "io" -> "asyncio hoac threading"\n    \n`,
      tests: [
        { args: ['io', 100], expected: 'asyncio hoac threading', name: 'Nhiều tác vụ I/O-bound' },
        { args: ['cpu', 50], expected: 'multiprocessing', name: 'Nhiều tác vụ CPU-bound' },
        { args: ['cpu', 1], expected: 'khong can concurrency', name: 'Chỉ 1 tác vụ CPU-bound' },
        { args: ['io', 1], expected: 'khong can concurrency', name: 'Chỉ 1 tác vụ I/O-bound' },
        { args: ['io', 2], expected: 'asyncio hoac threading', name: 'Biên: đúng 2 tác vụ đã cần concurrency' },
      ],
      hints: [
        'Kiểm tra `task_count <= 1` TRƯỚC TIÊN — dù `bound_type` là gì, chỉ có 1 tác vụ thì không có gì để chạy "đồng thời" cả.',
        'Sau đó phân nhánh theo `bound_type`: `"cpu"` cần song song THẬT (nhiều nhân CPU) vì GIL chặn threading không giúp được gì cho tính toán thuần Python; `"io"` thì threading/asyncio đều hiệu quả vì GIL được nhả khi chờ.',
        'Bài này chủ yếu luyện đúng TRỰC GIAC phân loại I/O-bound/CPU-bound — phần code thực ra khá ngắn (if/elif/else), phần quan trọng là hiểu ĐÚNG lý do đằng sau mỗi khuyến nghị (xem phần "Ý tưởng cốt lõi" của bài học).',
      ],
      diagnostics: [
        { test: 'bound_type\\s*==\\s*[\'"]cpu[\'"][\\s\\S]*return\\s+[\'"]asyncio', message: 'Khuyến nghị `asyncio`/`threading` cho tác vụ CPU-bound là SAI hướng: vì GIL, các công cụ dựa trên thread (kể cả asyncio, vốn cũng chạy trên 1 thread) không giúp tính toán thuần Python chạy nhanh hơn — CPU-bound cần `multiprocessing` để tận dụng nhiều nhân CPU thật sự.' },
      ],
      approach: `
Bài này là bài tập trực tiếp áp dụng lý thuyết cốt lõi của module: **phân loại đúng loại tác vụ quyết định
công cụ concurrency đúng**, và sai lầm phổ biến nhất là dùng threading cho CPU-bound (không có tác dụng gì
vì GIL).

\`\`\`python
def recommend_tool(bound_type, task_count):
    if task_count <= 1:
        return "khong can concurrency"
    if bound_type == "cpu":
        return "multiprocessing"
    return "asyncio hoac threading"
\`\`\`

**Vì sao CPU-bound cần \`multiprocessing\` chứ không phải \`threading\`?** Vì GIL chỉ cho MỘT thread thực thi
bytecode Python tại một thời điểm, và GIL chỉ được nhả ra khi thread đang CHỜ (I/O) — với CPU-bound (không
có gì để chờ, luôn đang tính toán), GIL không bao giờ được nhả, nên nhiều thread chạy tuần tự y như một
thread, thậm chí còn chậm hơn do chi phí chuyển đổi ngữ cảnh. \`multiprocessing\` né hoàn toàn vấn đề này
bằng cách dùng NHIỀU PROCESS riêng biệt, mỗi process có GIL của RIÊNG NÓ, được hệ điều hành phân phối lên
các nhân CPU khác nhau — đạt song song thật.
`,
      solution: `def recommend_tool(bound_type, task_count):
    if task_count <= 1:
        return "khong can concurrency"
    if bound_type == "cpu":
        return "multiprocessing"
    return "asyncio hoac threading"`,
      complexity: {
        question: 'Độ phức tạp thời gian của `recommend_tool`?',
        options: ['O(1) — số nhánh if/elif cố định, không phụ thuộc kích thước input', 'O(n) theo task_count', 'O(log n)', 'O(n²)'],
        answer: 0,
        why: 'Hàm chỉ thực hiện tối đa 2 phép so sánh cố định, không có vòng lặp hay phụ thuộc vào giá trị cụ thể của task_count — chi phí hằng số.',
      },
      realWorld: 'Quyết định kiến trúc thực tế khi thiết kế một service: crawler gọi hàng nghìn API (I/O-bound → asyncio), pipeline xử lý ảnh hàng loạt (CPU-bound → multiprocessing), hay job chỉ chạy một lần (không cần concurrency, thêm vào chỉ tăng độ phức tạp code vô ích).',
    },
    {
      id: 'py-simulate-round-robin',
      title: 'Mô phỏng lịch chạy round-robin (mô hình GIL đơn giản hoá)',
      en: 'Simulate Round-Robin Scheduling',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'simulate_round_robin',
      lang: 'python',
      statement: `
Để hiểu trực giác cách GIL "luân phiên" cấp quyền thực thi giữa các thread, viết hàm
\`simulate_round_robin(tasks)\`: \`tasks\` là list các list (mỗi list con là các "bước" còn lại của một
tác vụ/thread). Mô phỏng lịch chạy **round-robin** (luân phiên tuần tự): ở mỗi "vòng", lần lượt xét từng
tác vụ theo thứ tự \`0, 1, 2, ...\`; nếu tác vụ đó còn bước chưa chạy, thực hiện bước KẾ TIẾP của nó (ghi
nhận vào kết quả); nếu tác vụ đã chạy hết các bước, bỏ qua nó ở vòng này. Lặp lại các vòng cho tới khi TẤT
CẢ tác vụ đã hoàn thành hết các bước.

Trả về **list các \`[chỉ_số_tác_vụ, bước]\`** theo đúng THỨ TỰ thực thi.

**Ví dụ**
- \`simulate_round_robin([["a1", "a2"], ["b1"], ["c1", "c2", "c3"]])\`
  → \`[[0, "a1"], [1, "b1"], [2, "c1"], [0, "a2"], [2, "c2"], [2, "c3"]]\`
`,
      starter: `def simulate_round_robin(tasks):\n    # Tra ve list [chi_so_task, buoc] theo dung thu tu thuc thi round-robin\n    \n`,
      tests: [
        {
          args: [[['a1', 'a2'], ['b1'], ['c1', 'c2', 'c3']]],
          expected: [[0, 'a1'], [1, 'b1'], [2, 'c1'], [0, 'a2'], [2, 'c2'], [2, 'c3']],
          name: 'Ba tác vụ độ dài khác nhau',
        },
        { args: [[]], expected: [], name: 'Không có tác vụ nào' },
        { args: [[['x1', 'x2', 'x3']]], expected: [[0, 'x1'], [0, 'x2'], [0, 'x3']], name: 'Chỉ 1 tác vụ, chạy tuần tự hết các bước của chính nó' },
        { args: [[[], ['y1']]], expected: [[1, 'y1']], name: 'Tác vụ đầu tiên rỗng, bị bỏ qua ngay từ vòng đầu' },
        { args: [[['p1'], ['q1']]], expected: [[0, 'p1'], [1, 'q1']], name: 'Hai tác vụ cùng độ dài 1 bước' },
      ],
      hints: [
        'Dùng một mảng `pointers` (cùng độ dài với `tasks`) lưu "tác vụ thứ i đã chạy tới bước nào", khởi tạo toàn bộ bằng 0.',
        'Lặp qua nhiều "vòng": mỗi vòng, duyệt `i` từ `0` tới hết `tasks`, nếu `pointers[i] < len(tasks[i])`, ghi nhận `[i, tasks[i][pointers[i]]]` vào kết quả rồi tăng `pointers[i]` lên 1.',
        'Dùng một cờ boolean (ví dụ `active`) để biết vòng vừa rồi có tác vụ nào còn chạy được không — nếu CẢ VÒNG không tác vụ nào chạy được bước nào (mọi tác vụ đã hết), dừng vòng lặp ngoài lại.',
      ],
      diagnostics: [
        { test: 'for\\s+\\w+\\s+in\\s+tasks\\s*:[\\s\\S]*?tasks\\.remove', message: 'Sửa/xoá trực tiếp phần tử của `tasks` (tham số đầu vào) trong lúc mô phỏng có thể gây tác dụng phụ không mong muốn lên dữ liệu gốc bên ngoài hàm. Hãy dùng một mảng `pointers` riêng để theo dõi tiến độ mỗi tác vụ, không sửa `tasks` gốc.' },
      ],
      approach: `
Bài này biến khái niệm trừu tượng "GIL luân phiên cấp quyền cho các thread" thành một thuật toán cụ thể, dễ
kiểm chứng: **round-robin scheduling** — lần lượt cho mỗi tác vụ chạy ĐÚNG MỘT bước rồi chuyển sang tác vụ
kế tiếp, quay vòng lại từ đầu khi hết danh sách.

\`\`\`python
def simulate_round_robin(tasks):
    pointers = [0] * len(tasks)
    order = []
    active = True
    while active:
        active = False
        for i, steps in enumerate(tasks):
            if pointers[i] < len(steps):
                order.append([i, steps[pointers[i]]])
                pointers[i] += 1
                active = True
    return order
\`\`\`

**Vì sao cần biến cờ \`active\` để biết khi nào dừng, thay vì một điều kiện đơn giản hơn?** Vì các tác vụ có
thể có ĐỘ DÀI KHÁC NHAU — không thể biết trước "vòng thứ mấy" là vòng cuối cùng chỉ từ độ dài của MỘT tác vụ
cụ thể. Cách chắc chắn nhất: chạy một vòng thử, nếu vòng đó KHÔNG có tác vụ nào còn bước để chạy (nghĩa là
toàn bộ đã hoàn thành), dừng lại — đây chính là mô hình đơn giản hoá của cách bộ lập lịch (scheduler) thật
sự quyết định "khi nào tất cả các luồng đã xong việc".
`,
      solution: `def simulate_round_robin(tasks):
    pointers = [0] * len(tasks)
    order = []
    active = True
    while active:
        active = False
        for i, steps in enumerate(tasks):
            if pointers[i] < len(steps):
                order.append([i, steps[pointers[i]]])
                pointers[i] += 1
                active = True
    return order`,
      complexity: {
        question: 'Độ phức tạp thời gian của `simulate_round_robin` theo tổng số bước N (tổng độ dài của toàn bộ các tác vụ)?',
        options: ['O(N) — mỗi bước của mỗi tác vụ được ghi nhận vào kết quả đúng một lần trong suốt quá trình mô phỏng', 'O(N²)', 'O(N log N)', 'O(1)'],
        answer: 0,
        why: 'Dù có vòng lặp lồng nhau (vòng ngoài "round", vòng trong duyệt các tác vụ), mỗi BƯỚC cụ thể của một tác vụ chỉ được xử lý và thêm vào kết quả đúng một lần duy nhất trong suốt toàn bộ quá trình — tổng công việc tỉ lệ thuận với tổng số bước N.',
      },
      realWorld: 'Mô hình round-robin y hệt cách nhiều hệ điều hành/scheduler thực tế phân chia thời gian CPU cho nhiều tiến trình/luồng đang chờ chạy — hiểu mô hình đơn giản hoá này giúp hình dung trực quan tại sao nhiều thread I/O-bound "cảm giác" chạy song song dù về bản chất vẫn luân phiên nhau trên một GIL duy nhất.',
    },
    {
      id: 'py-count-primes-sqrt-optimization',
      title: 'Đếm số nguyên tố — tối ưu bằng căn bậc hai',
      en: 'Count Primes with sqrt Optimization',
      difficulty: 'Medium',
      targetMinutes: 10,
      entry: 'count_primes_upto',
      lang: 'python',
      statement: `
Viết hàm \`count_primes_upto(limit)\` đếm số lượng **số nguyên tố** nhỏ hơn \`limit\` (không tính \`limit\`).

Yêu cầu về **hiệu năng**: khi kiểm tra một số \`n\` có phải số nguyên tố hay không, **chỉ cần thử chia** cho
các số từ \`2\` tới \`sqrt(n)\` (căn bậc hai của \`n\`) — không cần thử tới tận \`n - 1\`.

**Ví dụ**
- \`count_primes_upto(10)\` → \`4\` (các số nguyên tố: 2, 3, 5, 7)
- \`count_primes_upto(2)\` → \`0\` (không có số nguyên tố nào nhỏ hơn 2)
`,
      starter: `def count_primes_upto(limit):\n    def is_prime(n):\n        if n < 2:\n            return False\n        if n == 2:\n            return True\n        if n % 2 == 0:\n            return False\n        # Chi thu chia cac so LE tu 3 den sqrt(n)\n        i = 3\n        while i * i <= n:\n            if n % i == 0:\n                return False\n            i += 2\n        return True\n\n    return sum(1 for n in range(2, limit) if is_prime(n))\n`,
      tests: [
        { args: [10], expected: 4, name: 'Nhỏ hơn 10: 2, 3, 5, 7' },
        { args: [2], expected: 0, name: 'Không có số nguyên tố nào < 2' },
        { args: [20], expected: 8, name: 'Nhỏ hơn 20: 2,3,5,7,11,13,17,19' },
        { args: [1], expected: 0, name: 'limit = 1' },
        { args: [100], expected: 25, name: 'Nhỏ hơn 100: có đúng 25 số nguyên tố' },
      ],
      hints: [
        'Một số `n` KHÔNG phải số nguyên tố nếu nó chia hết cho một số nào đó từ `2` tới `sqrt(n)` — nếu không có ước số nào trong khoảng đó, `n` chắc chắn là số nguyên tố (nếu `n` có ước số LỚN HƠN `sqrt(n)`, thì ước số TƯƠNG ỨNG còn lại của phép chia đó chắc chắn NHỎ HƠN `sqrt(n)`, nên đã được phát hiện từ trước).',
        'Vòng lặp `while i * i <= n:` (thay vì tính `sqrt(n)` bằng `math.sqrt` rồi so sánh) tránh được sai số làm tròn của phép tính căn bậc hai với số thực — so sánh `i * i <= n` luôn chính xác tuyệt đối vì chỉ dùng số nguyên.',
        'Sau khi có `is_prime(n)` đúng, dùng generator expression `sum(1 for n in range(2, limit) if is_prime(n))` để đếm — gọn hơn viết vòng lặp `for` với biến đếm thủ công.',
      ],
      diagnostics: [
        { test: 'range\\s*\\(\\s*2\\s*,\\s*n\\s*\\)', message: 'Thử chia từ 2 tới `n - 1` (thay vì tới `sqrt(n)`) vẫn cho kết quả ĐÚNG nhưng chậm hơn nhiều — với `n` lớn, đây là khác biệt giữa O(sqrt(n)) và O(n) cho MỖI lần kiểm tra, nhân lên với toàn bộ các số cần đếm sẽ chênh lệch đáng kể.' },
      ],
      approach: `
Bài này là ví dụ cụ thể cho tinh thần "performance best practice" của module: **hiểu đúng độ phức tạp của
từng bước nhỏ cộng dồn lại tạo ra khác biệt lớn** khi quy mô dữ liệu tăng lên.

\`\`\`python
def count_primes_upto(limit):
    def is_prime(n):
        if n < 2:
            return False
        if n == 2:
            return True
        if n % 2 == 0:
            return False
        i = 3
        while i * i <= n:
            if n % i == 0:
                return False
            i += 2
        return True

    return sum(1 for n in range(2, limit) if is_prime(n))
\`\`\`

**Vì sao chỉ cần thử chia tới \`sqrt(n)\` là ĐỦ để xác định \`n\` có phải số nguyên tố?** Nếu \`n = a × b\`
với \`a <= b\`, thì bắt buộc \`a <= sqrt(n)\` (vì nếu cả \`a\` và \`b\` đều lớn hơn \`sqrt(n)\`, tích \`a × b\`
sẽ lớn hơn \`n\`, vô lý). Nói cách khác: nếu \`n\` có MỘT ước số hợp lệ nào đó, chắc chắn có ít nhất một ước
số trong khoảng từ \`2\` tới \`sqrt(n)\` — không cần thử xa hơn. Đây là ví dụ điển hình của việc **hiểu đúng
tính chất toán học của bài toán giúp giảm độ phức tạp** từ kiểm tra O(n) mỗi số xuống còn O(sqrt(n)) mỗi
số — với \`limit\` lớn, chênh lệch này là sự khác biệt giữa chương trình chạy tức thì và chương trình treo
hàng chục giây.
`,
      solution: `def count_primes_upto(limit):
    def is_prime(n):
        if n < 2:
            return False
        if n == 2:
            return True
        if n % 2 == 0:
            return False
        i = 3
        while i * i <= n:
            if n % i == 0:
                return False
            i += 2
        return True

    return sum(1 for n in range(2, limit) if is_prime(n))`,
      complexity: {
        question: 'Độ phức tạp thời gian của `count_primes_upto(limit)` với cách kiểm tra "chỉ thử chia tới sqrt(n)"?',
        options: ['O(limit) — mỗi số kiểm tra tốn O(1)', 'O(limit · sqrt(limit)) — với mỗi số trong khoảng kiểm tra (O(limit) số), việc kiểm tra nguyên tố tốn tối đa O(sqrt(n)) ⊆ O(sqrt(limit))', 'O(limit²)', 'O(log(limit))'],
        answer: 1,
        why: 'Có khoảng `limit` số cần kiểm tra, mỗi lần kiểm tra `is_prime` tốn tối đa O(sqrt(n)) (với n ⊆ limit) — tổng chi phí là O(limit · sqrt(limit)), tốt hơn NHIỀU so với O(limit²) nếu thử chia tới tận `n - 1` cho mỗi số.',
      },
      realWorld: 'Kiểm tra tính nguyên tố xuất hiện trong mật mã học (chọn số nguyên tố lớn cho RSA), bài toán tối ưu hoá thuật toán kinh điển trong phỏng vấn kỹ thuật — nhưng bài học lớn hơn của bài này là tổng quát: LUÔN đặt câu hỏi "có cần lặp/kiểm tra XA đến vậy không, hay có giới hạn toán học nào giúp dừng SỚM HƠN" trước khi chấp nhận một độ phức tạp cao hơn cần thiết.',
    },
  ],
},
];
