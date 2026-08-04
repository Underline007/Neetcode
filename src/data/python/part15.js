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
    {
      q: '100 thread cùng chạy `counter += 1` mười nghìn lần trên một biến toàn cục. Kết quả cuối cùng thế nào?',
      options: [
        'Luôn đúng bằng 1.000.000 — GIL đảm bảo mỗi thao tác là nguyên tử',
        'Thường NHỎ HƠN 1.000.000 — `counter += 1` gồm ba bước (đọc, cộng, ghi) và GIL có thể chuyển luồng ở giữa',
        'Luôn lớn hơn 1.000.000',
        'Chương trình raise RuntimeError',
      ],
      answer: 1,
      why: 'Đây là hiểu lầm phổ biến nhất về GIL: nó đảm bảo **một bytecode tại một thời điểm**, chứ không phải "một dòng code Python tại một thời điểm". `counter += 1` biên dịch thành nhiều bytecode (LOAD, ADD, STORE) và trình thông dịch có thể chuyển luồng ở khe giữa — hai luồng cùng đọc giá trị 5, cùng ghi 6, và một lần tăng biến mất. **GIL bảo vệ trạng thái nội bộ của trình thông dịch, không bảo vệ dữ liệu của bạn.** Vẫn phải dùng `threading.Lock` (hoặc `queue.Queue`) cho mọi trạng thái dùng chung.',
    },
    {
      q: 'Hai lời gọi mạng, mỗi cái mất 1 giây:\n\nawait fetch("A")\nawait fetch("B")\n\nTổng thời gian là bao nhiêu?',
      options: [
        'Khoảng 1 giây — async tự động chạy song song',
        'Khoảng 2 giây — mỗi `await` CHỜ xong mới chạy dòng tiếp theo',
        'Không xác định',
        'Lỗi vì thiếu asyncio.run',
      ],
      answer: 1,
      why: '`await` nghĩa là "dừng ở đây cho tới khi việc này xong" — nó nhường CPU cho các tác vụ **khác** đang chờ, nhưng không hề khiến hai dòng liên tiếp chạy đồng thời. Muốn thật sự chồng lấn, phải khởi động cả hai TRƯỚC rồi mới chờ: `await asyncio.gather(fetch("A"), fetch("B"))` → khoảng 1 giây. Đây là lỗi số một khi mới dùng asyncio: viết đúng cú pháp async nhưng vẫn chạy tuần tự, và tự hỏi vì sao code "bất đồng bộ" chẳng nhanh hơn chút nào.',
    },
    {
      q: 'Vì sao chuyển một hàm tính toán rất NHẸ (ví dụ `x * 2`) sang `multiprocessing` thường khiến chương trình CHẬM HƠN?',
      options: [
        'Vì multiprocessing vẫn bị GIL giới hạn',
        'Vì chi phí tạo tiến trình và đóng gói (pickle) dữ liệu qua lại lớn hơn nhiều so với chính phép tính',
        'Vì Python giới hạn số tiến trình tối đa là 2',
        'Vì hàm quá nhẹ nên bị hệ điều hành bỏ qua',
      ],
      answer: 1,
      why: 'Mỗi tiến trình con là một trình thông dịch Python riêng: khởi động tốn hàng chục mili-giây, và **mọi dữ liệu đi qua lại đều phải pickle rồi unpickle** vì các tiến trình không chia sẻ bộ nhớ. Chi phí đó cố định và khá lớn, nên chỉ đáng bỏ ra khi mỗi tác vụ đủ nặng (thường từ vài chục mili-giây trở lên). Hai hệ quả thực tế đi kèm: hãy chia dữ liệu thành **lô lớn** thay vì gửi từng phần tử, và nhớ rằng `lambda`/hàm lồng **không pickle được** — đó là lý do bạn hay gặp `PicklingError` khi mới dùng `multiprocessing`.',
    },
    {
      q: 'Kiểm tra `if x in danh_sach` bên trong một vòng lặp duyệt n phần tử. Vấn đề hiệu năng là gì?',
      options: [
        'Không có vấn đề gì, `in` luôn là O(1)',
        'Mỗi phép `in` trên `list` là O(n) → tổng thành O(n²); đổi sang `set` đưa nó về O(n)',
        '`in` chỉ hoạt động với list đã sắp xếp',
        'Vấn đề nằm ở bộ nhớ, không phải thời gian',
      ],
      answer: 1,
      why: '`x in list` phải **quét tuần tự** cho tới khi tìm thấy — O(n). Đặt trong một vòng lặp n bước là O(n²): với n = 100.000, đó là mười tỷ phép so sánh (nhiều phút), trong khi bản dùng `set` chạy trong tích tắc. `x in set` (và `x in dict`) là O(1) trung bình nhờ bảng băm. Đây là tối ưu hoá đáng làm nhất trong Python vì nó đổi hẳn **bậc độ phức tạp**, không phải chỉ giảm hằng số — và cũng là lý do nên profile trước: một dòng `in` trông vô hại thường là nút thắt thật sự, chứ không phải "vòng lặp trông có vẻ nặng".',
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
        { test: 'bound_type\\s*==\\s*[\'"]cpu[\'"]\\s*:\\s*return\\s+[\'"](asyncio|threading)', message: 'Khuyến nghị `asyncio`/`threading` cho tác vụ CPU-bound là SAI hướng: vì GIL, các công cụ dựa trên thread (kể cả asyncio, vốn cũng chạy trên 1 thread) không giúp tính toán thuần Python chạy nhanh hơn — CPU-bound cần `multiprocessing` để tận dụng nhiều nhân CPU thật sự.' },
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
    {
      id: 'py-split-batches',
      title: 'Chia việc đều cho các worker',
      en: 'Balanced Work Splitting',
      difficulty: 'Medium',
      targetMinutes: 14,
      entry: 'split_batches',
      lang: 'python',
      statement: `
Trước khi giao việc cho \`multiprocessing.Pool\` hay một nhóm thread, bạn phải chia dữ liệu thành các lô.

Viết hàm \`split_batches(items, workers)\` chia \`items\` thành **đúng \`workers\` nhóm**, sao cho:
- Kích thước hai nhóm bất kỳ chênh nhau **tối đa 1 phần tử**.
- Các nhóm lớn hơn nằm **trước**.
- Thứ tự phần tử được giữ nguyên.
- Nếu \`items\` ít hơn \`workers\`, các nhóm cuối là danh sách **rỗng** (vẫn phải đủ số nhóm).

**Ví dụ**
- \`split_batches([1,2,3,4,5,6,7], 3)\` → \`[[1,2,3], [4,5], [6,7]]\`
- \`split_batches([1,2,3], 5)\` → \`[[1], [2], [3], [], []]\`
- \`split_batches([], 3)\` → \`[[], [], []]\`

> Cách chia phổ biến nhất — \`chunk = len(items) // workers\` rồi cắt theo bước cố định — cho ra **sai số
> lượng nhóm** và dồn phần dư vào một chỗ. Bộ test bắt đúng các trường hợp đó.
`,
      starter: `def split_batches(items, workers):\n    # Chia thành đúng workers nhóm, chênh lệch tối đa 1 phần tử\n    \n`,
      tests: [
        { args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [[1, 2, 3], [4, 5], [6, 7]], name: 'Chia dư — nhóm lớn nằm trước' },
        { args: [[1, 2, 3, 4], 2], expected: [[1, 2], [3, 4]], name: 'Chia hết' },
        { args: [[1, 2, 3, 4, 5], 2], expected: [[1, 2, 3], [4, 5]], name: 'Dư một phần tử' },
        { args: [[1, 2, 3], 5], expected: [[1], [2], [3], [], []], name: 'Ít việc hơn worker' },
        { args: [[], 3], expected: [[], [], []], name: 'Không có việc — vẫn đủ số nhóm' },
        { args: [[1, 2, 3], 1], expected: [[1, 2, 3]], name: 'Một worker duy nhất' },
        { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4], expected: [[1, 2, 3], [4, 5, 6], [7, 8], [9, 10]], name: 'Mười việc, bốn worker' },
        { args: [[1], 3], expected: [[1], [], []], name: 'Một việc, ba worker' },
      ],
      hints: [
        'Dùng `q, r = divmod(len(items), workers)`: `q` là kích thước cơ bản của mọi nhóm, `r` là số phần tử dư ra cần rải thêm.',
        'Rải phần dư: `r` nhóm ĐẦU TIÊN nhận thêm đúng một phần tử. Kích thước nhóm thứ `i` là `q + 1` nếu `i < r`, ngược lại là `q`.',
        'Duyệt `for i in range(workers)` (không phải duyệt theo `items`) để chắc chắn luôn tạo đủ số nhóm — kể cả khi `items` rỗng. Giữ một con trỏ `start`, cắt `items[start:start + size]`, rồi `start += size`.',
      ],
      diagnostics: [
        { test: 'range\\s*\\(\\s*0\\s*,\\s*len\\s*\\(\\s*items\\s*\\)\\s*,', message: 'Cắt theo bước cố định (`range(0, len(items), chunk)`) cho ra số nhóm PHỤ THUỘC dữ liệu — có thể thừa, thiếu, hoặc bằng 0 khi `items` rỗng. Đề yêu cầu luôn đúng `workers` nhóm, nên hãy lặp theo `range(workers)`.' },
        { test: '\\[\\s*-\\s*1\\s*\\]\\s*\\.extend|\\[\\s*-\\s*1\\s*\\]\\s*\\+=', message: 'Dồn phần dư vào nhóm cuối làm mất tính cân bằng: với 7 việc và 3 worker bạn sẽ được `[[1,2],[3,4],[5,6,7]]`, tức một worker phải làm nhiều hơn 50% — trong xử lý song song, thời gian hoàn thành do worker CHẬM NHẤT quyết định.' },
        { test: 'math\\.ceil|-\\s*\\(\\s*-\\s*len', message: 'Dùng `ceil(len/workers)` làm kích thước cho mọi nhóm sẽ khiến các nhóm đầu quá đầy và những nhóm cuối rỗng hoàn toàn (ví dụ 10 việc / 4 worker thành 3+3+3+1). `divmod` cho cách rải đều chính xác.' },
      ],
      approach: `
Đây là bước chuẩn bị của mọi bài toán song song, và cách chia sai làm hỏng chính lợi ích bạn đang tìm:
**thời gian hoàn thành của cả nhóm bằng thời gian của worker chậm nhất**, nên lệch tải là lãng phí trực
tiếp.

\`\`\`python
def split_batches(items, workers):
    q, r = divmod(len(items), workers)   # q: kích thước nền, r: số phần dư
    batches = []
    start = 0
    for i in range(workers):
        size = q + (1 if i < r else 0)   # r nhóm đầu nhận thêm 1
        batches.append(items[start:start + size])
        start += size
    return batches
\`\`\`

**Vì sao \`divmod\` là công cụ đúng.** Nó trả về cùng lúc thương và dư — chính xác hai con số bạn cần:
"mỗi người ít nhất bao nhiêu" và "còn thừa mấy phần cần rải". Với 7 việc và 3 worker: \`q = 2, r = 1\` →
kích thước \`[3, 2, 2]\`.

**So sánh ba cách chia sai thường gặp** (7 việc, 3 worker):

| Cách làm | Kết quả | Vấn đề |
|---|---|---|
| \`chunk = 7 // 3 = 2\`, cắt theo bước 2 | \`[[1,2],[3,4],[5,6],[7]]\` | **4 nhóm** thay vì 3 |
| \`chunk = ceil(7/3) = 3\` | \`[[1,2,3],[4,5,6],[7]]\` | nhóm cuối chỉ 1 việc, lệch tải |
| chia đều rồi dồn dư vào cuối | \`[[1,2],[3,4],[5,6,7]]\` | một worker làm nhiều hơn 50% |

Cả ba đều "chạy được" và đều sai theo cách khó nhận ra cho tới khi lên môi trường thật với dữ liệu lớn.

**Một mẹo Python đáng biết** — cắt theo bước không cần biến đếm:

\`\`\`python
batches = [items[i::workers] for i in range(workers)]
\`\`\`

Cách này cũng cho các nhóm chênh nhau tối đa 1 và luôn đủ số nhóm, nhưng nó **xen kẽ** phần tử
(\`[1,4,7], [2,5], [3,6]\`) chứ không giữ khối liền mạch. Chọn cái nào tuỳ bài toán: khi dữ liệu có tính
cục bộ (đọc file theo dòng liên tiếp, xử lý ảnh theo vùng), khối liền mạch tốt hơn; khi độ nặng của từng
phần tử **tăng dần theo vị trí**, cách xen kẽ lại cân tải tốt hơn nhiều.
`,
      solution: `def split_batches(items, workers):
    q, r = divmod(len(items), workers)
    batches = []
    start = 0
    for i in range(workers):
        size = q + (1 if i < r else 0)
        batches.append(items[start:start + size])
        start += size
    return batches`,
      complexity: {
        question: 'Độ phức tạp thời gian và bộ nhớ theo số phần tử n?',
        options: [
          'Thời gian O(n), bộ nhớ O(n) — mỗi phần tử được copy đúng một lần sang lô của nó',
          'Thời gian O(n × workers)',
          'Thời gian O(n log n) do phải cân bằng các nhóm',
          'Thời gian O(workers), bộ nhớ O(1)',
        ],
        answer: 0,
        why: 'Các lát cắt cộng lại copy đúng n phần tử → O(n) thời gian và O(n) bộ nhớ phụ. Nếu dữ liệu quá lớn để nhân đôi trong RAM, hãy trả về **cặp chỉ số** (start, end) thay vì lát cắt thật, hoặc dùng `itertools.islice` để tạo lô một cách lười biếng — đúng cách các thư viện xử lý dữ liệu lớn vẫn làm.',
      },
      realWorld: 'Chia dữ liệu cho `multiprocessing.Pool`, phân mảnh (sharding) bản ghi cho nhiều worker đọc từ queue, chia file lớn cho các luồng tải song song, phân trang kết quả. Chi tiết "nhóm lớn nằm trước" tuy nhỏ nhưng thường được yêu cầu để kết quả **xác định**, giúp tái hiện lại chính xác một lần chạy khi cần gỡ lỗi.',
    },
    {
      id: 'py-concurrent-vs-sequential',
      title: 'Song song thì tổng thời gian là max, không phải sum',
      en: 'Concurrent Completion Order',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'run_schedule',
      lang: 'python',
      statement: `
Cho \`tasks\` là danh sách các tác vụ **I/O-bound** dạng \`[tên, thời_lượng]\` (thời lượng tính bằng giây).
Giả sử tất cả được khởi động **cùng lúc** (như \`asyncio.gather\`) và chỉ ngồi chờ I/O — không tranh CPU.

Viết hàm \`run_schedule(tasks)\` trả về \`[thứ_tự_hoàn_thành, thời_gian_song_song, thời_gian_tuần_tự]\`:
- \`thứ_tự_hoàn_thành\` — danh sách **tên** theo thứ tự kết thúc; hai tác vụ cùng thời lượng thì giữ đúng
  **thứ tự ban đầu** trong \`tasks\`.
- \`thời_gian_song_song\` — tổng thời gian nếu chạy đồng thời.
- \`thời_gian_tuần_tự\` — tổng thời gian nếu chạy lần lượt.
- Danh sách rỗng → \`[[], 0, 0]\`.

**Ví dụ**
- \`[["a", 3], ["b", 1], ["c", 2]]\` → \`[["b", "c", "a"], 3, 6]\`
`,
      starter: `def run_schedule(tasks):\n    # [thứ tự hoàn thành, thời gian song song, thời gian tuần tự]\n    \n`,
      tests: [
        { args: [[['a', 3], ['b', 1], ['c', 2]]], expected: [['b', 'c', 'a'], 3, 6], name: 'Ba tác vụ khác thời lượng' },
        { args: [[['a', 1], ['b', 1]]], expected: [['a', 'b'], 1, 2], name: 'Bằng nhau — giữ thứ tự ban đầu' },
        { args: [[]], expected: [[], 0, 0], name: 'Không có tác vụ nào' },
        { args: [[['x', 5]]], expected: [['x'], 5, 5], name: 'Một tác vụ — hai con số bằng nhau' },
        { args: [[['a', 2], ['b', 2], ['c', 1]]], expected: [['c', 'a', 'b'], 2, 5], name: 'Hai tác vụ đồng hạng' },
        { args: [[['slow', 10], ['fast', 1]]], expected: [['fast', 'slow'], 10, 11], name: 'Một tác vụ rất chậm chi phối' },
        { args: [[['a', 0], ['b', 3]]], expected: [['a', 'b'], 3, 3], name: 'Tác vụ tức thì' },
      ],
      hints: [
        'Thứ tự hoàn thành chính là thứ tự thời lượng tăng dần. Dùng `sorted(tasks, key=lambda t: t[1])` — **chỉ** sắp theo thời lượng, đừng sắp theo cả cặp.',
        'Yêu cầu "cùng thời lượng thì giữ thứ tự ban đầu" được đáp ứng **miễn phí**: thuật toán sắp xếp của Python là ổn định (stable), nên các phần tử có khoá bằng nhau không bị đảo chỗ.',
        'Thời gian song song là `max` của các thời lượng, tuần tự là `sum`. Nhớ xử lý danh sách rỗng: `max()` trên dãy rỗng raise `ValueError` — dùng `max(..., default=0)` (còn `sum` của dãy rỗng vốn đã là 0).',
      ],
      diagnostics: [
        { test: 'sorted\\s*\\(\\s*tasks\\s*\\)|tasks\\.sort\\s*\\(\\s*\\)', message: 'Sắp xếp trực tiếp danh sách các cặp sẽ so sánh phần tử ĐẦU (tên) trước, rồi mới tới thời lượng — không phải thứ tự hoàn thành. Cần `key=lambda t: t[1]`.' },
        { test: 'reverse\\s*=\\s*True', message: 'Tác vụ NGẮN hoàn thành trước, nên thứ tự là thời lượng tăng dần — không dùng `reverse=True`.' },
        { test: '^(?![\\s\\S]*max\\s*\\()[\\s\\S]*def\\s+run_schedule', message: 'Không thấy `max` trong lời giải. Khi các tác vụ I/O chạy đồng thời, tổng thời gian là **thời lượng của tác vụ lâu nhất**, không phải tổng các thời lượng — đó chính là toàn bộ lý do người ta dùng concurrency.' },
        { test: 'max\\s*\\((?![\\s\\S]*default)(?![\\s\\S]*if\\s+not\\s+tasks)', message: '`max()` trên một dãy rỗng raise `ValueError: max() arg is an empty sequence`. Hãy dùng `max(..., default=0)` hoặc xử lý trường hợp `tasks` rỗng ngay từ đầu.' },
      ],
      approach: `
Bài này biến câu khẩu hiệu "async giúp chạy nhanh hơn" thành một công thức bạn kiểm chứng được.

\`\`\`python
def run_schedule(tasks):
    order = [name for name, _ in sorted(tasks, key=lambda t: t[1])]
    parallel = max((duration for _, duration in tasks), default=0)
    sequential = sum(duration for _, duration in tasks)
    return [order, parallel, sequential]
\`\`\`

**Ý chính: với tác vụ I/O-bound chạy đồng thời, thời gian tổng là \`max\`, không phải \`sum\`.** Ba lời gọi
API mất 3s, 1s, 2s: chạy tuần tự mất 6 giây, chạy đồng thời mất 3 giây — đúng bằng lời gọi chậm nhất, vì
trong lúc chờ mạng thì chương trình chẳng làm gì cả, và "chẳng làm gì" thì làm được đồng thời cho nhiều
tác vụ.

**Ba điều cần nhớ kèm theo:**

1. **Chỉ đúng với I/O-bound.** Nếu các tác vụ này ngốn CPU, chúng phải tranh nhau GIL và tổng thời gian
   quay về gần \`sum\`. Công thức \`max\` là phần thưởng cho việc **chờ đợi**, không phải cho việc tính toán.
2. **Tác vụ chậm nhất chi phối tất cả.** Test \`[["slow", 10], ["fast", 1]]\` cho thấy: thêm bao nhiêu tác
   vụ nhanh cũng không thay đổi gì, muốn nhanh hơn phải tối ưu đúng cái chậm nhất. Đây là lý do người ta
   đặt **timeout** cho từng tác vụ — một lời gọi treo sẽ giữ cả nhóm lại.
3. **Tính ổn định của sort là một tính năng, không phải may mắn.** Yêu cầu "cùng thời lượng thì giữ thứ tự
   ban đầu" được đáp ứng chỉ vì Timsort ổn định. Nhờ đó kết quả **xác định**, tái hiện được — điều tối
   quan trọng khi gỡ lỗi hệ thống đồng thời, nơi mọi thứ khác đều khó tái hiện.

**Liên hệ với đời thật:** đây chính là khác biệt giữa

\`\`\`python
for url in urls:            # tuần tự: sum(thời gian)
    await fetch(url)

await asyncio.gather(*[fetch(u) for u in urls])   # đồng thời: max(thời gian)
\`\`\`

Vòng lặp \`for\` với \`await\` bên trong trông rất "async" nhưng vẫn chạy tuần tự — bẫy phổ biến nhất khi
mới học asyncio, và bây giờ bạn đã có công thức để chỉ ra nó tốn bao nhiêu.
`,
      solution: `def run_schedule(tasks):
    order = [name for name, _ in sorted(tasks, key=lambda t: t[1])]
    parallel = max((duration for _, duration in tasks), default=0)
    sequential = sum(duration for _, duration in tasks)
    return [order, parallel, sequential]`,
      complexity: {
        question: 'Độ phức tạp thời gian của run_schedule theo số tác vụ n?',
        options: [
          'O(n log n) — chi phối bởi phép sắp xếp; `max` và `sum` chỉ là O(n)',
          'O(n) vì chỉ duyệt danh sách vài lần',
          'O(n²)',
          'O(1)',
        ],
        answer: 0,
        why: '`sorted` là O(n log n) và lấn át hai lần duyệt tuyến tính của `max`/`sum`. Nếu chỉ cần hai con số thời gian mà không cần thứ tự hoàn thành, bạn giải được trong O(n) — một ví dụ nhỏ nhưng đúng tinh thần tối ưu: **bỏ bớt thứ mình không cần** thường hiệu quả hơn tăng tốc thứ mình đang làm.',
      },
      realWorld: 'Ước lượng thời gian cho một loạt lời gọi API, thiết kế timeout cho từng bước trong pipeline, giải thích cho đồng đội vì sao thêm worker không giúp ích khi có một tác vụ chậm chi phối, và phân tích đường găng (critical path) trong pipeline CI/CD — nơi câu hỏi luôn là "bước nào đang quyết định tổng thời gian?".',
    },
  ],
},
];
