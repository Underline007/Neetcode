# Máy chủ đồng bộ tiến độ (Cloudflare Worker + Durable Object)

Cho phép học trên nhiều máy mà tiến độ vẫn khớp nhau. Worker này chỉ là **hộp thư**:
nó giữ một khối JSON theo "mã đồng bộ" và đánh số version. Toàn bộ việc **gộp** dữ liệu
diễn ra ở trình duyệt (`src/sync-merge.js`), nên không máy nào ghi đè mất công sức của máy kia.

Lưu bằng **Durable Object** (SQLite storage), không dùng KV: mỗi mã đồng bộ ứng với đúng
một instance, Cloudflare tự xử lý tuần tự mọi request tới cùng instance đó, nên khoá version
bên dưới là so-sánh-rồi-ghi nguyên tử thật — không có khe hở để hai lần ghi gần như đồng thời
cùng đọc trúng version cũ rồi đè lên nhau. Vẫn nằm trong gói **Workers Free**, không cần trả phí.

## Triển khai (làm một lần, ~3 phút)

```bash
cd worker
npm install -g wrangler        # nếu chưa có
wrangler login
wrangler deploy                # migrations trong wrangler.jsonc tự tạo Durable Object
```

Lệnh `deploy` in ra địa chỉ dạng `https://neetcode30-sync.<tên-tài-khoản>.workers.dev`.
Chép địa chỉ đó vào app: **Thống kê → Đồng bộ nhiều máy → Địa chỉ máy chủ**.

Chi phí: gói miễn phí của Workers thừa sức cho việc này (100.000 request/ngày;
việc học một người tạo vài chục request mỗi ngày).

## API

| Phương thức | Đường dẫn | Kết quả |
|---|---|---|
| `GET` | `/p/:code` | `200 { version, updatedAt, state }` · `404` nếu mã chưa có dữ liệu |
| `PUT` | `/p/:code` | `200 { version, updatedAt }` · `409 { version, updatedAt, state }` nếu `baseVersion` đã cũ |

Body của `PUT`: `{ "baseVersion": <số version vừa đọc>, "state": { ... } }`.

Mã 409 nghĩa là có máy khác vừa ghi trong lúc bạn đang gộp — client sẽ gộp thêm bản
trả về rồi thử lại một lần. Đây là khoá lạc quan, đủ chắc cho một người dùng vài máy.

## Bảo mật — đọc kỹ phần này

**Mã đồng bộ chính là mật khẩu.** Ai biết mã thì đọc và ghi được dữ liệu của mã đó.

- Luôn dùng nút **Tạo mã ngẫu nhiên** trong app: mã 24 ký tự sinh bằng
  `crypto.getRandomValues` (~120 bit), không thể đoán. Đừng tự đặt mã kiểu `nguyenvana2026`.
- Worker từ chối mọi mã ngắn hơn 16 ký tự.
- Dữ liệu ở đây chỉ là tiến độ học và code bài tập của bạn — không có thông tin đăng nhập.
- `Access-Control-Allow-Origin: *` để app chạy được từ `localhost` ở cổng bất kỳ. Mã bí mật
  là lớp bảo vệ duy nhất, đúng theo thiết kế.

Muốn chặt hơn nữa: thêm [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)
trước Worker, hoặc thu hẹp `access-control-allow-origin` về đúng origin bạn dùng.

## Giới hạn đã biết

- **Kích thước**: tối đa 2 MB mỗi mã (đủ cho tiến độ + code đã gõ ở mọi bài).
- **Một instance là một điểm lưu duy nhất**: Durable Object không nhân bản dữ liệu ra nhiều khu
  vực địa lý như KV, nên máy ở xa vị trí instance được tạo có thể có độ trễ mạng cao hơn đôi
  chút. Đổi lại, đọc-ghi luôn nhất quán ngay lập tức — không còn độ trễ lan truyền như KV.

## Chạy thử tại chỗ

```bash
cd worker
wrangler dev            # http://localhost:8787
```

Rồi điền `http://localhost:8787` vào ô địa chỉ máy chủ trong app.
