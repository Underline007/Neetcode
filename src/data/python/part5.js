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
    {
      q: 'Đoạn code sau in ra gì?\n\ng = (x for x in [1, 2, 3])\nprint(sum(g), sum(g))',
      options: ['6 6', '6 0', '6 None', 'TypeError ở lần sum thứ hai'],
      answer: 1,
      why: 'Generator là **iterator dùng một lần**: `sum(g)` đầu tiên chạy hết dãy và đưa nó về trạng thái cạn kiệt. Lần `sum(g)` thứ hai không hề báo lỗi — nó chỉ thấy một dãy RỖNG và trả về `0`. Đây là bug im lặng cực khó tìm khi bạn truyền một generator vào hàm khác rồi định dùng lại. Muốn duyệt nhiều lần, hãy vật chất hoá nó: `data = list(g)`.',
    },
    {
      q: 'Đoạn code sau in ra gì?\n\nnums = [1, 2, 3]\ng = (x * 10 for x in nums)\nnums = [4, 5, 6]\nprint(list(g))',
      options: ['[40, 50, 60]', '[10, 20, 30]', '[]', '[10, 20, 30, 40, 50, 60]'],
      answer: 1,
      why: 'Generator expression lười biếng ở **thân** nhưng **eager** ở iterable ngoài cùng: `nums` được tính và gắn vào generator ngay lúc tạo, nên nó giữ tham chiếu tới list `[1, 2, 3]` gốc. Gán `nums = [4, 5, 6]` chỉ đổi hướng cái tên, không đụng tới object generator đang giữ. Nhưng chú ý mặt còn lại của bẫy: nếu bạn **sửa tại chỗ** (`nums.append(4)`) thì generator SẼ thấy phần tử mới, vì nó vẫn duyệt đúng object đó.',
    },
    {
      q: 'Với hai decorator xếp chồng:\n\n@a\n@b\ndef f(): ...\n\nThứ tự áp dụng là gì?',
      options: ['f = a(b(f)) — b (gần hàm nhất) được áp dụng trước', 'f = b(a(f)) — a (trên cùng) được áp dụng trước', 'Hai decorator chạy song song, thứ tự không quan trọng', 'Lỗi cú pháp, Python chỉ cho phép một decorator'],
      answer: 0,
      why: 'Decorator được áp dụng **từ dưới lên** (gần định nghĩa hàm nhất trước), nhưng lúc CHẠY thì lớp ngoài cùng (`a`) chạy trước vì nó bọc bên ngoài. Thứ tự này quyết định hành vi thật: `@cache` đặt trên `@log` sẽ khiến các lần trúng cache không được ghi log, còn đặt dưới thì mọi lời gọi đều được ghi. Đây là nguồn bug kinh điển khi kết hợp `@app.route`, `@login_required`, `@cache` trong web framework.',
    },
    {
      q: 'Đoạn code sau in ra gì?\n\ndef log(fn):\n    def wrapper(*args, **kwargs):\n        fn(*args, **kwargs)\n    return wrapper\n\n@log\ndef add(a, b):\n    return a + b\n\nprint(add(1, 2))',
      options: ['3', 'None', 'wrapper', 'TypeError'],
      answer: 1,
      why: '`wrapper` gọi `fn(...)` nhưng **quên `return`** kết quả, nên nó trả về `None` mặc định — và vì `add` bây giờ CHÍNH LÀ `wrapper`, mọi lời gọi `add(...)` đều trả `None`. Python không cảnh báo gì cả. Đây là lỗi số một khi tự viết decorator: quy tắc bất di bất dịch là thân wrapper phải kết thúc bằng `return fn(*args, **kwargs)`.',
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
    {
      id: 'py-count-calls-decorator',
      title: 'Decorator đếm số lần gọi (đủ 3 chi tiết)',
      en: 'Call-Counting Decorator',
      difficulty: 'Medium',
      targetMinutes: 15,
      entry: 'count_calls',
      lang: 'python',
      statement: `
Viết decorator \`count_calls(fn)\` thoả **cả ba** yêu cầu:

1. Hàm bao (wrapper) gọi \`fn\` với đúng mọi tham số và **trả về đúng kết quả** của \`fn\`.
2. Gắn thuộc tính \`.calls\` lên hàm bao — số lần đã được gọi, khởi đầu bằng \`0\`.
3. **Giữ nguyên metadata** của hàm gốc: \`wrapped.__name__\` phải vẫn là tên hàm gốc, không phải \`"wrapper"\`.

**Hệ thống chấm** sẽ decorate một hàm tên \`add(a, b)\` rồi gọi nó \`n\` lần với các tham số tăng dần,
và trả về \`[kết_quả_lần_gọi_cuối, wrapped.calls, wrapped.__name__]\` (kết quả là \`0\` nếu \`n = 0\`).

**Ví dụ** với \`n = 3\` → \`[5, 3, "add"]\`
(lần cuối gọi \`add(2, 3)\` nên bằng \`5\`; đã gọi 3 lần; tên hàm vẫn là \`add\`).

> Ba yêu cầu tương ứng với ba lỗi phổ biến nhất khi tự viết decorator. Bộ test kiểm tra riêng từng cái.
`,
      starter: `def count_calls(fn):\n    # Trả về hàm bao: đếm số lần gọi, trả đúng kết quả, giữ nguyên metadata\n    \n`,
      harnessSrc: `def harness(fn, args, t):
    def add(a, b):
        return a + b
    wrapped = fn(add)
    last = 0
    for i in range(args[0]):
        last = wrapped(i, i + 1)
    return [last, wrapped.calls, wrapped.__name__]`,
      tests: [
        { args: [3], expected: [5, 3, 'add'], name: 'Gọi 3 lần' },
        { args: [0], expected: [0, 0, 'add'], name: 'Chưa gọi lần nào — calls phải là 0' },
        { args: [1], expected: [1, 1, 'add'], name: 'Gọi đúng một lần' },
        { args: [5], expected: [9, 5, 'add'], name: 'Gọi 5 lần' },
        { args: [10], expected: [19, 10, 'add'], name: 'Gọi 10 lần' },
      ],
      hints: [
        'Khung chuẩn của decorator: `def count_calls(fn):` → định nghĩa `def wrapper(*args, **kwargs):` bên trong → `return wrapper` (trả về HÀM, không gọi nó). Thân wrapper phải kết thúc bằng `return fn(*args, **kwargs)`.',
        'Để đếm mà không cần `nonlocal`: gắn bộ đếm thẳng lên chính hàm bao. Trong Python, hàm cũng là object nên có thuộc tính: đặt `wrapper.calls = 0` NGAY TRƯỚC `return wrapper`, rồi trong thân wrapper viết `wrapper.calls += 1`.',
        'Metadata: thêm `@functools.wraps(fn)` ngay trên `def wrapper` — nó copy `__name__`, `__doc__`, `__module__`... từ hàm gốc sang. Không có nó, `wrapped.__name__` sẽ là `"wrapper"` và test thứ ba fail.',
      ],
      diagnostics: [
        { test: '^(?![\\s\\S]*wraps)[\\s\\S]*def\\s+count_calls', message: 'Không thấy `functools.wraps`. Không có nó, hàm bao mang tên `"wrapper"` và làm mất `__doc__`, `__module__` của hàm gốc — hỏng cả log, traceback lẫn tài liệu tự sinh. Thêm `@functools.wraps(fn)` ngay trên `def wrapper`.' },
        { test: '^\\s+fn\\s*\\(\\s*\\*', message: 'Bạn gọi `fn(*args, **kwargs)` nhưng không `return` kết quả — hàm sau khi decorate sẽ luôn trả về `None`. Dòng đó phải là `return fn(*args, **kwargs)`.' },
        { test: 'return\\s+wrapper\\s*\\(', message: '`return wrapper()` GỌI hàm bao ngay lập tức và trả về kết quả của nó. Decorator phải trả về CHÍNH HÀM: `return wrapper` (không có dấu ngoặc).' },
      ],
      approach: `
Decorator chỉ là đường cú pháp: \`@count_calls\` đặt trên \`def add\` tương đương với
\`add = count_calls(add)\`. Hiểu vậy rồi thì ba yêu cầu của bài đều tự nhiên.

\`\`\`python
import functools

def count_calls(fn):
    @functools.wraps(fn)              # (3) copy metadata từ fn sang wrapper
    def wrapper(*args, **kwargs):
        wrapper.calls += 1            # (2) bộ đếm sống trên chính object hàm
        return fn(*args, **kwargs)    # (1) BẮT BUỘC có return
    wrapper.calls = 0
    return wrapper                    # trả về hàm, KHÔNG gọi nó
\`\`\`

**Vì sao \`wrapper.calls\` mà không phải \`nonlocal\`?** Cả hai đều đúng, nhưng gắn lên hàm khiến bộ đếm
**đọc được từ bên ngoài** (\`add.calls\`) — rất tiện để kiểm tra trong test hoặc theo dõi số liệu. Với
\`nonlocal counter\` thì biến bị giấu kín trong closure, không ai truy cập được.

**Vì sao \`*args, **kwargs\` chứ không liệt kê tham số cụ thể?** Vì decorator phải dùng lại được cho MỌI
hàm, không biết trước chữ ký. \`*args, **kwargs\` là cách "nhận mọi thứ rồi chuyển tiếp nguyên vẹn".

**Vì sao \`functools.wraps\` quan trọng trong thực tế?** Không có nó, mọi hàm đã decorate đều tên là
\`"wrapper"\`: log bị vô nghĩa, traceback khó đọc, tài liệu tự sinh (Sphinx/FastAPI) sai, và các framework
định tuyến theo tên hàm sẽ trùng khoá. Một dòng ngăn được cả loạt vấn đề.

**Bẫy về trạng thái dùng chung:** nếu bạn đặt \`calls = 0\` ở cấp module thay vì gắn lên \`wrapper\`, thì
MỌI hàm được decorate sẽ cùng chia sẻ một bộ đếm — sai ngay khi decorator được dùng cho hàm thứ hai.
`,
      solution: `import functools


def count_calls(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)

    wrapper.calls = 0
    return wrapper`,
      complexity: {
        question: 'Decorator này làm tăng chi phí mỗi lời gọi hàm lên bao nhiêu?',
        options: [
          'O(1) thêm cố định — một phép cộng và một tầng gọi hàm phụ',
          'O(n) theo số lần đã gọi trước đó',
          'O(log n)',
          'Không tốn thêm gì, decorator chỉ chạy lúc định nghĩa',
        ],
        answer: 0,
        why: 'Mỗi lời gọi phải đi qua thêm một khung stack (wrapper) rồi mới tới hàm thật, cộng một phép tăng biến đếm — chi phí hằng số, không phụ thuộc lịch sử. Đáng lưu ý: chi phí hằng số này vẫn có thật, nên decorator "nặng" đặt trên một hàm gọi hàng triệu lần trong vòng lặp nóng vẫn có thể thành nút thắt hiệu năng.',
      },
      realWorld: 'Đếm số lần gọi API để áp rate limit, đo số lần cache miss, thống kê hàm nào được gọi nhiều nhất khi profiling, và đếm số lần retry. Mẫu "gắn trạng thái lên chính hàm bao" cũng là cách `functools.lru_cache` cung cấp `fn.cache_info()` và `fn.cache_clear()` cho bạn.',
    },
    {
      id: 'py-fib-infinite-gen',
      title: 'Generator vô hạn: dãy Fibonacci',
      en: 'Infinite Fibonacci Generator',
      difficulty: 'Medium',
      targetMinutes: 12,
      entry: 'fib_gen',
      lang: 'python',
      statement: `
Viết **generator vô hạn** \`fib_gen()\` sinh ra dãy Fibonacci: \`0, 1, 1, 2, 3, 5, 8, 13, ...\`

- Hàm **không nhận tham số nào** — nó không biết trước người dùng sẽ lấy bao nhiêu số.
- Mỗi lần gọi \`fib_gen()\` phải cho ra một dãy **mới, bắt đầu lại từ đầu**.

**Hệ thống chấm** sẽ lấy \`n\` số đầu tiên bằng \`itertools.islice(fib_gen(), n)\`, sau đó gọi
\`fib_gen()\` **lần nữa** và lấy 3 số đầu để kiểm tra dãy có bắt đầu lại đúng không.
Kết quả mỗi test có dạng \`[n_số_đầu, 3_số_đầu_của_lần_gọi_mới]\`.

**Ví dụ** với \`n = 5\` → \`[[0, 1, 1, 2, 3], [0, 1, 1]]\`

> Nếu bạn định xây một list rồi \`return\`, hãy tự hỏi: list đó dài bao nhiêu? Bài sẽ **timeout**,
> không phải sai kết quả.
`,
      starter: `def fib_gen():\n    # Generator VÔ HẠN: yield lần lượt 0, 1, 1, 2, 3, 5, ...\n    \n`,
      harnessSrc: `def harness(fn, args, t):
    import itertools
    n = args[0]
    first = list(itertools.islice(fn(), n))
    again = list(itertools.islice(fn(), 3))
    return [first, again]`,
      tests: [
        { args: [5], expected: [[0, 1, 1, 2, 3], [0, 1, 1]], name: 'Năm số đầu' },
        { args: [0], expected: [[], [0, 1, 1]], name: 'Không lấy số nào' },
        { args: [1], expected: [[0], [0, 1, 1]], name: 'Chỉ số đầu tiên' },
        { args: [2], expected: [[0, 1], [0, 1, 1]], name: 'Hai số đầu' },
        { args: [10], expected: [[0, 1, 1, 2, 3, 5, 8, 13, 21, 34], [0, 1, 1]], name: 'Mười số đầu' },
        { args: [15], expected: [[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377], [0, 1, 1]], name: 'Mười lăm số đầu' },
      ],
      hints: [
        'Một hàm chứa `yield` không chạy ngay khi được gọi — nó trả về một generator và chỉ thực thi tới `yield` đầu tiên khi có người yêu cầu giá trị. Nhờ vậy `while True:` bên trong generator là hoàn toàn an toàn.',
        'Giữ hai biến `a, b = 0, 1`. Mỗi vòng: `yield a` rồi cập nhật `a, b = b, a + b`. Phép gán bội tính toàn bộ vế phải trước nên không cần biến tạm.',
        'Đừng thêm điều kiện dừng nào (`while i < n`) — hàm không có tham số `n`. Việc "lấy bao nhiêu" là quyền của bên tiêu thụ, qua `itertools.islice`, `zip(range(n), ...)` hoặc `break` trong vòng `for`.',
      ],
      diagnostics: [
        { test: '\\.append\\s*\\(|return\\s+\\[', message: 'Bạn đang xây một list rồi trả về. Dãy này VÔ HẠN nên vòng lặp không bao giờ kết thúc và bài sẽ timeout. Generator phải `yield` từng giá trị một, không tích trữ.' },
        { test: '^(?![\\s\\S]*yield)[\\s\\S]*def\\s+fib_gen', message: 'Không thấy `yield` trong hàm. Không có `yield` thì đây chỉ là một hàm thường, không phải generator — `itertools.islice` sẽ báo lỗi vì kết quả không lặp được.' },
      ],
      approach: `
Generator giải quyết một bài toán mà hàm thường không làm được: **mô tả một dãy dài vô hạn bằng bộ nhớ
hữu hạn**.

\`\`\`python
def fib_gen():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b
\`\`\`

Cơ chế: khi gặp \`yield\`, hàm **đóng băng** toàn bộ trạng thái (giá trị \`a\`, \`b\`, vị trí đang chạy) và
trả quyền điều khiển về cho người gọi. Lần lấy giá trị tiếp theo, nó **hồi phục đúng chỗ cũ** và chạy tiếp.
\`while True\` không treo vì mỗi vòng đều dừng lại ở \`yield\` chờ được đánh thức.

**Vì sao "gọi lại thì bắt đầu lại"?** Vì \`fib_gen\` là một **hàm generator**, mỗi lời gọi tạo ra một
**object generator** riêng với trạng thái riêng. Đừng nhầm hai thứ này:

\`\`\`python
g = fib_gen()          # g là generator OBJECT — dùng MỘT LẦN, cạn thì thôi
list(itertools.islice(g, 3))   # [0, 1, 1]
list(itertools.islice(g, 3))   # [2, 3, 5]  ← đi tiếp, không quay lại đầu
list(itertools.islice(fib_gen(), 3))  # [0, 1, 1]  ← generator MỚI, bắt đầu lại
\`\`\`

**Vì sao mẫu này quan trọng:** nó tách bạch "ai sinh dữ liệu" khỏi "ai quyết định lấy bao nhiêu". Cùng
một \`fib_gen\` dùng được cho "10 số đầu", "số Fibonacci đầu tiên lớn hơn một triệu", hay "sinh mãi cho
tới khi người dùng bấm dừng" — mà bản thân nó không cần biết gì về các nhu cầu đó. Đây chính là cách
Python đọc file hàng GB theo từng dòng, hay phân trang dữ liệu từ API.
`,
      solution: `def fib_gen():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b`,
      complexity: {
        question: 'Lấy n số đầu tiên từ fib_gen tốn bao nhiêu thời gian và bộ nhớ (bỏ qua chi phí số nguyên lớn)?',
        options: [
          'Thời gian O(n), bộ nhớ O(1) — generator chỉ giữ hai biến a và b',
          'Thời gian O(n), bộ nhớ O(n) vì generator lưu lại mọi giá trị đã sinh',
          'Thời gian O(2^n) như công thức đệ quy Fibonacci ngây thơ',
          'Thời gian O(1) vì generator lười biếng',
        ],
        answer: 0,
        why: 'Mỗi giá trị tốn một phép cộng → O(n) tổng cộng. Generator KHÔNG lưu lịch sử: bất kể bạn lấy 10 hay 10 triệu số, nó luôn chỉ giữ đúng hai biến `a` và `b` → bộ nhớ O(1). Đây là điểm khác biệt lớn nhất so với việc trả về một list (O(n) bộ nhớ), và cũng khác hẳn phiên bản đệ quy không cache (O(2^n) thời gian).',
      },
      realWorld: 'Mọi luồng dữ liệu không biết trước độ dài: đọc log hàng GB theo từng dòng, phân trang kết quả API (yield từng bản ghi, tự gọi trang tiếp theo khi cần), sinh ID/token liên tục, đọc dữ liệu cảm biến theo thời gian thực. Điểm chung: bên tiêu thụ dừng lúc nào cũng được, và bộ nhớ không phình theo lượng dữ liệu đã đi qua.',
    },
  ],
},
];
