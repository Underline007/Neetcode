# Máy chủ đồng bộ tiến độ (Cloudflare Worker + KV)

Cho phép học trên nhiều máy mà tiến độ vẫn khớp nhau. Worker này chỉ là **hộp thư**:
nó giữ một khối JSON theo "mã đồng bộ" và đánh số version. Toàn bộ việc **gộp** dữ liệu
diễn ra ở trình duyệt (`src/sync-merge.js`), nên không máy nào ghi đè mất công sức của máy kia.

## Triển khai (làm một lần, ~3 phút)

```bash
cd worker
npm install -g wrangler        # nếu chưa có
wrangler login

# 1) Tạo KV namespace, rồi dán id nhận được vào wrangler.jsonc
wrangler kv namespace create PROGRESS

# 2) Đưa Worker lên
wrangler deploy
```

Lệnh `deploy` in ra địa chỉ dạng `https://neetcode30-sync.<tên-tài-khoản>.workers.dev`.
Chép địa chỉ đó vào app: **Thống kê → Đồng bộ nhiều máy → Địa chỉ máy chủ**.

Chi phí: gói miễn phí của Workers/KV thừa sức cho việc này (100.000 request/ngày;
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
- **KV nhất quán cuối (eventual consistency)**: sau khi máy A ghi, máy B có thể mất tới ~60
  giây mới đọc được bản mới nếu ở khu vực địa lý khác. Không thành vấn đề khi bạn chuyển máy
  cách nhau hàng giờ. Nếu cần đọc-ghi tức thì từ nhiều máy cùng lúc, hãy đổi KV sang
  [Durable Objects](https://developers.cloudflare.com/durable-objects/) — API của Worker giữ nguyên,
  chỉ thay chỗ lưu.

## Chạy thử tại chỗ

```bash
cd worker
wrangler dev            # http://localhost:8787
```

Rồi điền `http://localhost:8787` vào ô địa chỉ máy chủ trong app.
