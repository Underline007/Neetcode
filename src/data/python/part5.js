/**
 * LỘ TRÌNH PYTHON — MODULE 5: Iterator, Generator & Decorator
 */

export default [
/* ==================================================================== */
{
  id: 'py-functional',
  name: 'Iterator, Generator & Decorator',
  en: 'Iterators, Generators & Decorators',
  icon: '🌀',
  summary: 'Đây là ba công cụ tách biệt lập trình viên Python "biết code" khỏi lập trình viên Python "senior" — generator để lười tính toán, decorator để thêm hành vi mà không sửa hàm gốc.',
  lesson: `
## 1. Vấn đề gốc

Bạn đã biết hàm bậc nhất (first-class function) và closure từ JS. Python nâng cấp hai ý tưởng đó thành
công cụ ngôn ngữ tường minh: **generator** (hàm có thể "tạm dừng" và "tiếp tục") và **decorator** (cú pháp
\`@\` để bọc thêm hành vi quanh một hàm mà không sửa code hàm gốc — về bản chất là **Higher-Order Function**
bạn đã biết, chỉ khác cú pháp gọi).

## 2. So sánh nhanh JS ↔ Python

| Việc cần làm | JavaScript | Python |
|---|---|---|
| Hàm sinh giá trị "lười" | \`function* gen() { yield 1; }\` | \`def gen(): yield 1\` (cú pháp gần như giống hệt!) |
| Bọc thêm hành vi quanh hàm | Higher-order function thủ công: \`const wrapped = withLogging(fn)\` | decorator: \`@with_logging\` viết ngay trên định nghĩa hàm |
| Cache kết quả hàm theo tham số | tự viết Map cache thủ công | \`@functools.lru_cache\` — có sẵn, một dòng |
| Duyệt lần lượt (protocol) | \`Symbol.iterator\`, \`next()\` | \`__iter__\`/\`__next__\`, hoặc đơn giản hơn: generator |

## 3. Ý tưởng cốt lõi #1: Generator — hàm "tạm dừng được"

Hàm thường chạy từ đầu tới \`return\` rồi kết thúc, mất hết trạng thái. **Generator** (hàm có \`yield\`)
tạm dừng tại \`yield\`, trả một giá trị ra ngoài, và **giữ nguyên toàn bộ trạng thái** cho tới khi được
yêu cầu giá trị tiếp theo:

\`\`\`python
def dem_den(n):
    i = 1
    while i <= n:
        yield i        # TẠM DỪNG ở đây, trả về i, nhớ vị trí này
        i += 1

for x in dem_den(3):
    print(x)   # 1, 2, 3 — mỗi lần lặp, generator "thức dậy" ngay sau yield lần trước
\`\`\`

**Vì sao quan trọng?** Generator sinh giá trị **theo yêu cầu** (lazy), không tạo toàn bộ dãy trong bộ nhớ
trước. \`range(10**9)\` không tạo 1 tỷ số ngay lập tức — nó sinh từng số một khi bạn lặp tới. Đây là lý do
\`range\` trong Python 3 là "generator-like" chứ không phải list, khác hẳn Python 2.

## 4. Ý tưởng cốt lõi #2: Decorator — hàm nhận hàm, trả về hàm

Một decorator đơn giản chỉ là: **một hàm nhận vào một hàm, trả về một hàm khác** (thường là bản "bọc thêm
hành vi" của hàm gốc). Cú pháp \`@ten_decorator\` phía trên \`def\` chỉ là **đường tắt cú pháp**
(syntactic sugar) cho việc gán lại hàm:

\`\`\`python
def with_logging(fn):
    def wrapper(*args, **kwargs):     # *args/**kwargs: "chuyển tiếp" mọi đối số, không cần biết chữ ký fn
        print(f"Gọi {fn.__name__} với {args}")
        result = fn(*args, **kwargs)
        print(f"{fn.__name__} trả về {result}")
        return result
    return wrapper

@with_logging
def cong(a, b):
    return a + b

# Dòng trên TƯƠNG ĐƯƠNG với:
# def cong(a, b): return a + b
# cong = with_logging(cong)
\`\`\`

Sau khi decorate, tên \`cong\` không còn trỏ tới hàm gốc nữa — nó trỏ tới \`wrapper\`. Gọi \`cong(1, 2)\`
thực chất gọi \`wrapper(1, 2)\`, và \`wrapper\` mới là nơi gọi lại hàm gốc (\`fn\`) bên trong.

## 5. Decorator có tham số — "hàm trả về decorator"

Muốn decorator nhận tham số cấu hình (ví dụ \`@retry(3)\`), cần thêm **một tầng hàm nữa**:

\`\`\`python
def retry(times):                       # tầng 1: nhận tham số cấu hình
    def decorator(fn):                  # tầng 2: decorator thật sự, nhận hàm
        def wrapper(*args, **kwargs):   # tầng 3: hàm bọc, chạy khi gọi hàm đã decorate
            for _ in range(times):
                try:
                    return fn(*args, **kwargs)
                except Exception:
                    continue
            raise RuntimeError("hết lượt thử")
        return wrapper
    return decorator

@retry(3)
def flaky(): ...
\`\`\`

\`@retry(3)\` thực chất là \`@(retry(3))\` — \`retry(3)\` chạy TRƯỚC, trả về \`decorator\`, rồi \`decorator\`
mới được áp lên \`flaky\`. Ba tầng hàm lồng nhau tương ứng ba "thời điểm": cấu hình → định nghĩa → gọi.

## 6. \`functools\` — bộ công cụ hàm bậc cao nên biết

\`\`\`python
from functools import lru_cache, reduce, partial

@lru_cache(maxsize=None)      # tự động cache kết quả theo tham số — khỏi tự viết dict cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

reduce(lambda acc, x: acc + x, [1, 2, 3, 4], 0)   # 10 — gộp dần dãy về 1 giá trị

them_10 = partial(lambda a, b: a + b, 10)          # "đóng băng" trước tham số đầu
them_10(5)   # 15
\`\`\`

## 7. Bẫy thường gặp

- **Decorator làm mất metadata của hàm gốc**: sau khi decorate, \`fn.__name__\` trở thành \`"wrapper"\` thay
  vì tên hàm gốc, gây khó debug. Cách sửa chuẩn: dùng \`@functools.wraps(fn)\` trên \`wrapper\` (module
  \`functools\`) — giữ nguyên \`__name__\`, \`__doc__\` của hàm gốc.
- **Generator chỉ dùng được MỘT LẦN**: sau khi duyệt hết một generator (ví dụ bằng \`for\` hoặc
  \`list(gen)\`), nó "cạn" — lặp lại lần hai sẽ ra rỗng ngay. Cần dãy giá trị nhiều lần → dùng \`list\`,
  hoặc gọi lại hàm generator để tạo generator MỚI.
- **Nhầm decorator với tham số và không tham số**: \`@retry\` (thiếu dấu ngoặc) khác hẳn \`@retry(3)\` — cái
  đầu coi \`retry\` chính là decorator (nhận thẳng hàm), cái sau coi \`retry(3)\` là decorator (ba tầng như
  mục 5). Viết nhầm gây lỗi khó hiểu ngay từ lúc định nghĩa hàm.
- **Trạng thái dùng chung ngoài ý muốn**: nếu \`wrapper\` lưu cache/bộ đếm ở biến NGOÀI hàm (module-level),
  mọi hàm được decorate bằng CÙNG MỘT lần gọi decorator sẽ chia sẻ chung trạng thái đó — đôi khi đúng ý,
  đôi khi là bug ẩn.

## 8. Ứng dụng thực tế

- **\`@lru_cache\`**: tăng tốc các hàm đệ quy/tính toán lặp lại tham số (fibonacci, tính khoảng cách giữa
  các cặp điểm cố định...) mà không cần viết logic cache thủ công.
- **Decorator xác thực/phân quyền** trong web framework (Flask, FastAPI, Django): \`@login_required\`,
  \`@require_role("admin")\` — chèn logic kiểm tra TRƯỚC khi hàm xử lý request thật sự chạy, mà không sửa
  code nghiệp vụ bên trong.
- **Decorator retry/timeout/rate-limit**: xử lý lỗi mạng tạm thời khi gọi API bên ngoài — viết một lần,
  áp dụng cho mọi hàm gọi API bằng một dòng \`@retry(3)\`.
- **Generator xử lý dữ liệu lớn**: đọc file log hàng GB theo từng dòng (\`yield\` từng dòng) thay vì
  \`.readlines()\` nạp hết vào RAM — nền tảng của xử lý dữ liệu streaming.
`,
  quiz: [
    {
      q: 'Điều gì xảy ra khi bạn gọi một hàm generator (có `yield` bên trong), ví dụ `g = dem_den(3)`?',
      options: [
        'Hàm chạy ngay lập tức và trả về danh sách kết quả',
        'Trả về một generator object CHƯA chạy dòng code nào cả — code chỉ thực thi dần khi bạn gọi `next(g)` hoặc lặp qua nó',
        'Python báo lỗi vì phải dùng `await`',
        'Hàm chạy đến `yield` đầu tiên rồi dừng hẳn, không chạy tiếp được nữa',
      ],
      answer: 1,
      why: 'Gọi hàm generator KHÔNG thực thi thân hàm — nó chỉ tạo ra một generator object "sẵn sàng chạy". Code bên trong chỉ chạy dần từng đoạn mỗi khi bạn yêu cầu giá trị tiếp theo (qua `next()` hoặc vòng `for`), dừng lại ở mỗi `yield` và tiếp tục đúng chỗ đó ở lần gọi sau.',
    },
    {
      q: '`@with_logging` viết ngay trên `def cong(a, b): ...` tương đương với đoạn code nào?',
      options: [
        '`cong = with_logging(cong)` chạy NGAY SAU khi định nghĩa hàm `cong`',
        '`with_logging(cong())` — gọi cong trước rồi log kết quả',
        'Không tương đương gì, đây chỉ là comment đặc biệt',
        '`cong.logging = with_logging` — gắn thuộc tính logging vào hàm',
      ],
      answer: 0,
      why: 'Cú pháp `@decorator` phía trên `def` là đường tắt cú pháp (syntactic sugar) — Python định nghĩa hàm xong rồi NGAY LẬP TỨC gán lại tên đó bằng kết quả gọi decorator lên hàm vừa định nghĩa: `ten_ham = decorator(ten_ham)`.',
    },
    {
      q: 'Vì sao decorator `wrapper(*args, **kwargs)` cần dùng `*args, **kwargs` thay vì liệt kê tham số cụ thể?',
      options: [
        'Để chạy nhanh hơn',
        'Để wrapper có thể "chuyển tiếp" lời gọi cho BẤT KỲ hàm nào được decorate, bất kể chữ ký (số lượng, tên tham số) của hàm đó là gì',
        'Đây là yêu cầu bắt buộc của cú pháp `@`',
        '`*args, **kwargs` giúp Python tự động parallelize lời gọi hàm',
      ],
      answer: 1,
      why: 'Một decorator thường được viết để áp dụng cho NHIỀU hàm khác nhau, mỗi hàm có chữ ký khác nhau. `*args, **kwargs` cho phép wrapper nhận bất kỳ tổ hợp đối số nào rồi chuyển tiếp y nguyên (`fn(*args, **kwargs)`) cho hàm gốc, mà không cần biết trước chữ ký cụ thể.',
    },
    {
      q: '`@retry(3)` (có dấu ngoặc, kèm tham số) khác `@retry` (không ngoặc) như thế nào về số tầng hàm cần thiết?',
      options: [
        'Không khác gì, chỉ là phong cách viết',
        '`@retry` coi retry LÀ decorator (nhận thẳng hàm cần bọc — 2 tầng: decorator + wrapper). `@retry(3)` cần thêm một tầng NGOÀI CÙNG nhận tham số cấu hình rồi mới trả về decorator thật sự (3 tầng)',
        '`@retry(3)` chạy nhanh hơn vì có cache tham số',
        '`@retry` chỉ dùng được với hàm không có tham số',
      ],
      answer: 1,
      why: 'Decorator không tham số nhận thẳng hàm cần bọc (2 tầng: decorator(fn) -> wrapper). Decorator CÓ tham số cấu hình cần thêm một tầng ngoài cùng: hàm nhận tham số cấu hình, trả về decorator thật sự, decorator đó mới nhận hàm cần bọc (3 tầng lồng nhau).',
    },
  ],
  problems: [
    {
      id: 'py-gen-primes',
      title: 'Generator sinh số nguyên tố',
      en: 'Prime Number Generator',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'gen_primes',
      lang: 'python',
      harnessSrc: 'lambda f, args, t: list(f(*args))',
      statement: `
Viết **hàm generator** \`gen_primes(n)\`: sinh LẦN LƯỢT (dùng \`yield\`, không tạo sẵn danh sách) \`n\` số
nguyên tố đầu tiên, theo thứ tự tăng dần.

**Ví dụ** (kết quả được thu thập qua \`list(gen_primes(n))\` để kiểm tra)
- \`gen_primes(0)\` → \`[]\`
- \`gen_primes(1)\` → \`[2]\`
- \`gen_primes(5)\` → \`[2, 3, 5, 7, 11]\`
`,
      starter: `def gen_primes(n):\n    # Ham GENERATOR: dung yield, sinh lan luot tung so nguyen to cho toi khi du n so\n    \n`,
      tests: [
        { args: [0], expected: [], name: 'n = 0' },
        { args: [1], expected: [2], name: 'Số nguyên tố đầu tiên' },
        { args: [5], expected: [2, 3, 5, 7, 11], name: '5 số nguyên tố đầu' },
        { args: [10], expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29], name: '10 số nguyên tố đầu' },
      ],
      hints: [
        'Đây phải là một hàm GENERATOR — thân hàm cần chứa từ khoá `yield` (không phải `return` một list). Mỗi khi tìm được một số nguyên tố mới, `yield` nó ra ngay, đừng gom vào list rồi trả về cuối cùng.',
        'Duy trì một bộ đếm `count = 0` và một số `candidate = 2` đang xét. Với mỗi `candidate`, kiểm tra nguyên tố (dùng lại kỹ thuật `is_prime` với vòng lặp thử ước tới căn bậc hai, đã học ở module trước); nếu là nguyên tố thì `yield candidate` và tăng `count`; dù nguyên tố hay không, tăng `candidate` lên 1.',
        'Vòng lặp chính dừng khi `count == n`. Cấu trúc gợi ý: `while count < n: if is_prime(candidate): yield candidate; count += 1; candidate += 1`.',
      ],
      approach: `
**Điểm mấu chốt: đây phải là generator thật sự, không phải "tính hết rồi trả list".** Sự khác biệt không
chỉ nằm ở cú pháp — nó nằm ở **thời điểm** công việc được thực hiện. Với generator, nếu người gọi chỉ cần
3 số nguyên tố đầu của \`gen_primes(1000000)\`, chương trình chỉ tính đúng 3 số đó rồi dừng (nhờ \`for\`
sớm \`break\`) — với hàm trả list, bạn buộc phải tính đủ cả triệu số trước khi trả về bất cứ thứ gì.

\`\`\`python
def gen_primes(n):
    def is_prime(k):
        if k < 2:
            return False
        for i in range(2, int(k ** 0.5) + 1):
            if k % i == 0:
                return False
        return True

    count = 0
    candidate = 2
    while count < n:
        if is_prime(candidate):
            yield candidate
            count += 1
        candidate += 1
\`\`\`

**Vì sao vòng lặp \`while\` "biết dừng đúng lúc"?** Vì generator TẠM DỪNG hoàn toàn tại \`yield\` — nó
không "chạy trước cho hết" rồi mới trả kết quả. Mỗi lần \`list(gen_primes(n))\` (hoặc \`for\`) yêu cầu giá
trị tiếp theo, hàm chạy tiếp từ ngay sau \`yield\` lần trước, cho tới khi gặp \`yield\` mới hoặc hàm kết
thúc tự nhiên (không còn giá trị nào để sinh nữa — vòng \`while count < n\` sai điều kiện).
`,
      solution: `def gen_primes(n):
    def is_prime(k):
        if k < 2:
            return False
        for i in range(2, int(k ** 0.5) + 1):
            if k % i == 0:
                return False
        return True

    count = 0
    candidate = 2
    while count < n:
        if is_prime(candidate):
            yield candidate
            count += 1
        candidate += 1`,
      complexity: {
        question: 'Ưu điểm chính về BỘ NHỚ của cài đặt bằng generator so với việc tính trước toàn bộ rồi trả về một list?',
        options: [
          'Không có khác biệt, generator chỉ đẹp cú pháp hơn',
          'Generator không giữ toàn bộ kết quả trong bộ nhớ cùng lúc — chỉ giữ trạng thái để sinh giá trị KẾ TIẾP, phù hợp khi n rất lớn hoặc người gọi chỉ cần một phần kết quả',
          'Generator luôn chạy nhanh hơn về thời gian (Big-O nhỏ hơn)',
          'Generator tự động chạy song song trên nhiều luồng',
        ],
        answer: 1,
        why: 'Generator sinh giá trị theo yêu cầu (lazy) — bộ nhớ sử dụng không phụ thuộc vào n, chỉ phụ thuộc vào trạng thái hiện tại (candidate, count). Nếu người gọi chỉ lấy 3 giá trị đầu rồi dừng, phần còn lại không bao giờ được tính — điều một hàm trả list đầy đủ không làm được.',
      },
      realWorld: 'Đọc và xử lý file log/dataset hàng GB theo từng dòng bằng generator thay vì nạp hết vào RAM; sinh dữ liệu test/phân trang kết quả API theo yêu cầu (chỉ tính trang đang xem, chưa tính các trang sau).',
    },
    {
      id: 'py-retry-decorator',
      title: 'Decorator thử lại khi lỗi',
      en: 'Retry Decorator',
      difficulty: 'Hard',
      targetMinutes: 18,
      entry: 'run_with_retry',
      lang: 'python',
      statement: `
Viết decorator có tham số \`retry(times)\`: khi áp lên một hàm, nếu hàm đó \`raise\` exception, tự động
**gọi lại** hàm đó, tối đa \`times\` lần tổng cộng (kể cả lần đầu). Nếu tất cả \`times\` lần đều thất bại,
để exception cuối cùng "thoát ra ngoài" \`wrapper\`.

Viết hàm \`run_with_retry(fail_times)\`:
- Định nghĩa một hàm nội bộ \`flaky()\` (đặt BÊN TRONG \`run_with_retry\`, dùng một bộ đếm cục bộ): \`fail_times\`
  lần gọi ĐẦU TIÊN sẽ \`raise RuntimeError(...)\`, các lần gọi sau đó trả về chuỗi \`"OK"\`.
- Áp \`@retry(3)\` lên \`flaky\`.
- Gọi \`flaky()\` qua try/except: nếu cuối cùng vẫn thất bại (hết \`times\` lượt thử), trả về chuỗi
  \`"FAILED"\`; nếu thành công, trả về kết quả (\`"OK"\`).

**Ví dụ**
- \`run_with_retry(0)\` → \`"OK"\` (thành công ngay từ lần thử đầu tiên)
- \`run_with_retry(2)\` → \`"OK"\` (2 lần đầu lỗi, lần thứ 3 thành công — vừa đủ trong 3 lượt thử)
- \`run_with_retry(3)\` → \`"FAILED"\` (cần lần thử thứ 4 mới thành công, nhưng chỉ có 3 lượt)
`,
      starter: `def retry(times):\n    def decorator(fn):\n        def wrapper(*args, **kwargs):\n            # Goi lai toi da 'times' lan neu fn raise exception\n            \n        return wrapper\n    return decorator\n\n\ndef run_with_retry(fail_times):\n    attempts = [0]\n\n    @retry(3)\n    def flaky():\n        # attempts[0] lan dau tien raise RuntimeError, sau do tra ve \"OK\"\n        \n\n    try:\n        return flaky()\n    except Exception:\n        return 'FAILED'`,
      tests: [
        { args: [0], expected: 'OK', name: 'Thành công ngay lần đầu' },
        { args: [1], expected: 'OK', name: '1 lần lỗi, thành công lần 2' },
        { args: [2], expected: 'OK', name: '2 lần lỗi, thành công lần 3 (vừa đủ)' },
        { args: [3], expected: 'FAILED', name: 'Cần lần thứ 4 mới thành công -> vượt quá 3 lượt' },
        { args: [5], expected: 'FAILED', name: 'Lỗi nhiều hơn hẳn số lượt cho phép' },
      ],
      hints: [
        '`retry(times)` cần BA tầng hàm lồng nhau (đã học trong bài giảng): tầng 1 nhận `times`, tầng 2 (`decorator`) nhận hàm cần bọc, tầng 3 (`wrapper`) chạy khi hàm được gọi thật sự.',
        'Bên trong `wrapper`, dùng `for _ in range(times): try: return fn(*args, **kwargs) except Exception as e: last_err = e` — mỗi lần lỗi, vòng lặp tự động thử lại; `return` ngay khi thành công thoát khỏi vòng lặp sớm.',
        'Nếu vòng `for` chạy hết mà chưa `return` được (mọi lần đều lỗi), sau vòng lặp hãy `raise last_err` để lỗi cuối cùng thoát ra ngoài `wrapper` — đó là lúc `run_with_retry` bắt được nó bằng `except Exception` và trả về `"FAILED"`. Với `flaky()`, dùng `attempts[0]` (list 1 phần tử) làm bộ đếm cục bộ để tăng được giá trị mà không cần `nonlocal`.',
      ],
      approach: `
Bài này ghép hai kỹ năng: **decorator ba tầng có tham số** (mục 5 bài giảng) và **trạng thái cục bộ độc
lập giữa các lần gọi** (đã luyện ở bài Bank Account và bài Memoize cùng module).

\`\`\`python
def retry(times):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            last_err = None
            for _ in range(times):
                try:
                    return fn(*args, **kwargs)   # thành công -> return NGAY, thoát decorator
                except Exception as e:
                    last_err = e                  # ghi nhớ lỗi, thử lại vòng kế tiếp
            raise last_err                        # hết lượt thử -> để lỗi cuối cùng thoát ra
        return wrapper
    return decorator
\`\`\`

**Vì sao \`attempts = [0]\` phải nằm TRONG \`run_with_retry\`, không phải biến toàn cục?** Nếu \`attempts\`
là biến module-level dùng chung, lần gọi \`run_with_retry\` THỨ HAI sẽ kế thừa bộ đếm còn sót từ lần gọi
TRƯỚC — phá vỡ tính độc lập giữa các lần chấm bài (giống hệt nguyên tắc đã nhấn mạnh ở bài Memoize: mỗi
lần gọi hàm cấp cao nhất phải tạo trạng thái MỚI cho riêng nó).

**Vì sao dùng \`list\` 1 phần tử thay vì biến số nguyên thường?** Vì hàm lồng bên trong (\`flaky\`) chỉ
ĐỌC được biến ngoài tự do, nhưng muốn GÁN LẠI (\`attempts += 1\`) phải khai báo \`nonlocal attempts\`. Dùng
\`attempts[0] += 1\` là SỬA TẠI CHỖ một list mutable — không cần \`nonlocal\` vì bạn không gán lại tên
\`attempts\`, chỉ sửa nội dung bên trong nó (đây là bản chất bẫy mutable/immutable đã học ở Module 1,
nay dùng CÓ CHỦ ĐÍCH để né việc phải khai báo \`nonlocal\`).
`,
      solution: `def retry(times):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            last_err = None
            for _ in range(times):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    last_err = e
            raise last_err
        return wrapper
    return decorator


def run_with_retry(fail_times):
    attempts = [0]

    @retry(3)
    def flaky():
        attempts[0] += 1
        if attempts[0] <= fail_times:
            raise RuntimeError('lỗi tạm thời')
        return 'OK'

    try:
        return flaky()
    except Exception:
        return 'FAILED'`,
      complexity: {
        question: 'Trong trường hợp xấu nhất (luôn lỗi), wrapper của retry(times) gọi hàm gốc bao nhiêu lần?',
        options: ['Đúng 1 lần', 'Đúng `times` lần — vòng for chạy hết range(times) rồi mới raise lỗi cuối', 'Vô hạn lần', '`times - 1` lần'],
        answer: 1,
        why: '`for _ in range(times)` giới hạn chính xác `times` lượt thử — đây là lý do tham số được đặt tên times, đảm bảo không thử lại vô hạn khi gặp lỗi dai dẳng (tránh treo hệ thống).',
      },
      realWorld: 'Gọi API bên ngoài hay gặp lỗi mạng tạm thời (timeout, 503 Service Unavailable): decorator retry là pattern chuẩn trong mọi hệ thống backend gọi service khác, thường kết hợp thêm exponential backoff (giãn cách thời gian giữa các lần thử) để tránh dội tải lên service đang gặp sự cố.',
    },
    {
      id: 'py-memoize-fib',
      title: 'Tự viết decorator memoize',
      en: 'Hand-Roll a Memoize Decorator',
      difficulty: 'Hard',
      targetMinutes: 18,
      entry: 'fib_calls',
      lang: 'python',
      statement: `
Viết decorator \`memoize(fn)\` (**không dùng \`functools.lru_cache\`**) lưu cache kết quả theo tham số đầu
vào, và đếm số lần THÂN HÀM GỐC thực sự chạy (không tính những lần lấy thẳng từ cache).

Viết hàm \`fib_calls(n)\`:
- Định nghĩa một hàm đệ quy \`fib(k)\` tính số Fibonacci (\`fib(0)=0, fib(1)=1, fib(k)=fib(k-1)+fib(k-2)\`),
  đặt **BÊN TRONG** \`fib_calls\` và áp \`@memoize\` lên nó.
- Trả về \`[fib(n), số_lần_thân_hàm_đã_chạy]\`.

**Ví dụ đã tính sẵn để bạn tự kiểm tra**
- \`fib_calls(0)\` → \`[0, 1]\` (chỉ tính fib(0) — 1 lần)
- \`fib_calls(1)\` → \`[1, 1]\` (fib(1) là trường hợp cơ sở, KHÔNG gọi đệ quy xuống fib(0) — chỉ 1 lần)
- \`fib_calls(2)\` → \`[1, 3]\` (fib(2) gọi fib(1) và fib(0), cả 3 giá trị {2,1,0} đều là lần đầu tính → 3 lần)
- \`fib_calls(5)\` → \`[5, 6]\` (tính đúng 1 lần cho mỗi giá trị k = 0..5 → 6 lần)
`,
      starter: `def memoize(fn):\n    cache = {}\n    calls = [0]\n\n    def wrapper(n):\n        # Neu n co trong cache: tra ve luon, KHONG tang calls\n        # Neu chua co: tang calls, tinh fn(n), luu vao cache, tra ve\n        \n\n    wrapper.calls = calls\n    return wrapper\n\n\ndef fib_calls(n):\n    @memoize\n    def fib(k):\n        if k < 2:\n            return k\n        return fib(k - 1) + fib(k - 2)\n\n    result = fib(n)\n    return [result, fib.calls[0]]`,
      tests: [
        { args: [0], expected: [0, 1], name: 'fib(0)' },
        { args: [1], expected: [1, 1], name: 'fib(1) là trường hợp cơ sở, không đệ quy' },
        { args: [2], expected: [1, 3], name: 'fib(2) chạm tới cả fib(1) và fib(0)' },
        { args: [5], expected: [5, 6], name: 'fib(5), 6 giá trị phân biệt được tính' },
        { args: [10], expected: [55, 11], name: 'fib(10), 11 giá trị phân biệt được tính' },
      ],
      hints: [
        'Mỗi khi `wrapper(n)` được gọi: nếu `n` ĐÃ có trong `cache`, trả về `cache[n]` NGAY, không được tăng `calls[0]` (đây không phải một lần "thực sự chạy thân hàm").',
        'Nếu `n` CHƯA có trong cache: tăng `calls[0] += 1` (ghi nhận một lần thân hàm thực sự chạy), tính `ket_qua = fn(n)`, lưu `cache[n] = ket_qua`, rồi trả về `ket_qua`.',
        'Vì sao `fib` phải được định nghĩa và decorate BÊN TRONG `fib_calls`, không phải ở module-level? Nếu đặt bên ngoài, `cache` sẽ được TÁI SỬ DỤNG giữa các lần gọi `fib_calls` khác nhau, khiến `calls[0]` của lần gọi sau bị tính thiếu (vì nhiều giá trị đã có sẵn trong cache từ lần gọi trước) — vi phạm yêu cầu mỗi lần gọi `fib_calls(n)` phải đếm ĐỘC LẬP.',
      ],
      approach: `
Bài này là bản thực hành đầy đủ của mục "\`functools\`" trong bài giảng — bạn tự tay xây dựng lại đúng cơ
chế mà \`@lru_cache\` làm sẵn, để hiểu rõ NÓ HOẠT ĐỘNG NHƯ THẾ NÀO thay vì chỉ biết gọi.

\`\`\`python
def memoize(fn):
    cache = {}
    calls = [0]

    def wrapper(n):
        if n in cache:
            return cache[n]        # cache HIT — không tính lại, không tăng calls
        calls[0] += 1               # cache MISS — sắp thực sự chạy thân hàm
        result = fn(n)
        cache[n] = result
        return result

    wrapper.calls = calls
    return wrapper
\`\`\`

**Vì sao đệ quy vẫn hoạt động đúng qua wrapper?** Khi bạn viết \`@memoize\` trên \`def fib(k):\`, tên
\`fib\` trong phạm vi bao quanh bị GÁN LẠI thành \`wrapper\`. Bên trong thân hàm gốc, lời gọi đệ quy
\`fib(k - 1)\` được Python tra cứu tên \`fib\` **tại thời điểm gọi** (không phải tại thời điểm định nghĩa)
— và lúc đó, \`fib\` đã là \`wrapper\` mất rồi. Vậy nên mọi lời gọi đệ quy, kể cả gọi từ bên trong chính
hàm gốc, đều tự động đi qua lớp cache — đây là điều làm cho memoize hoạt động "trong suốt" mà không cần
sửa logic đệ quy bên trong.

**Vì sao \`fib_calls(1)\` chỉ có 1 lần chạy, không phải 2?** \`fib(1)\` rơi vào nhánh cơ sở \`if k < 2:
return k\` — nó \`return\` NGAY LẬP TỨC mà không hề gọi \`fib(0)\`. Chỉ khi hàm được gọi với \`k >= 2\`, đệ
quy mới thực sự "chạm" xuống các giá trị nhỏ hơn.
`,
      solution: `def memoize(fn):
    cache = {}
    calls = [0]

    def wrapper(n):
        if n in cache:
            return cache[n]
        calls[0] += 1
        result = fn(n)
        cache[n] = result
        return result

    wrapper.calls = calls
    return wrapper


def fib_calls(n):
    @memoize
    def fib(k):
        if k < 2:
            return k
        return fib(k - 1) + fib(k - 2)

    result = fib(n)
    return [result, fib.calls[0]]`,
      complexity: {
        question: 'fib_calls(n) với bản đệ quy CÓ memoize đạt độ phức tạp thời gian nào, so với O(2ⁿ) của đệ quy fibonacci không cache?',
        options: ['Vẫn O(2ⁿ) vì bản chất vẫn là đệ quy', 'O(n) — mỗi giá trị k từ 0 đến n chỉ được tính đúng một lần nhờ cache, các lần gọi lại sau đó là O(1)', 'O(n²)', 'O(log n)'],
        answer: 1,
        why: 'Không có memoize, đệ quy fibonacci tính lại cùng một giá trị hàng triệu lần (cây đệ quy phân nhánh theo cấp số nhân) — O(2ⁿ). Có memoize, mỗi giá trị k chỉ tính một lần (cache miss), các lần gọi lại là tra cứu O(1) — tổng cộng chỉ O(n) lần tính thực sự.',
      },
      realWorld: 'Đây chính xác là ý tưởng nền tảng của Dynamic Programming "top-down" (đệ quy + nhớ đã học ở phần thuật toán) — và cũng là cách các framework web cache kết quả tính toán tốn kém (render template, truy vấn tổng hợp) theo tham số đầu vào để tránh tính lại không cần thiết.',
    },
  ],
},
];
