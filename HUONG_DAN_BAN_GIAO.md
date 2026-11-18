# 📋 BẢNG HƯỚNG DẪN BÀN GIAO & VẬN HÀNH HỆ THỐNG
## DỰ ÁN ỨNG DỤNG AI “BẠN ĐỒNG HÀNH” (THCS LỚP 6 – LỚP 9)

Tài liệu này hướng dẫn Ban Giám hiệu, Giáo viên Tư vấn Tâm lý và Giáo viên Chủ nhiệm triển khai hệ thống theo **2 giai đoạn an toàn**:
1. **Giai đoạn 1 (Bản Demo):** Giữ nguyên dữ liệu mẫu để nhà trường trải nghiệm, họp hội đồng sư phạm và nghiệm thu toàn bộ tính năng.
2. **Giai đoạn 2 (Vận hành Thật):** Xóa sạch toàn bộ dữ liệu demo, khóa chặt cổng Quản trị bằng Mã PIN riêng của nhà trường và chạy 100% bằng dữ liệu thật qua 3 Luồng Zalo + Google Sheet.

---

## GIAI ĐOẠN 1: NGHIỆM THU TRÊN BẢN DEMO (ĐANG CHẠY SẴN)

Khi mới mở đường link ứng dụng trên Vercel, hệ thống đang ở **Chế độ Demo (`DEMO_DATA=on`)** để thầy cô xem trước đầy đủ 6 phân hệ:
- **Tab 1 – AI Tư Vấn Tâm Lý Ẩn Danh:** Học sinh chọn khối lớp (6–9), vai trò (người bị bắt nạt / người chứng kiến / người muốn sửa sai) và trò chuyện với AI. Có nút **“🚀 Chuyển tâm sự này nhờ Thầy Cô / BGH hỗ trợ ngay”** (và tự động chuyển khi phát hiện nguy cơ khẩn cấp Bước 3B).
- **Tab 2 – Thư Viện Kỹ Năng (Góc Kỹ Năng):** 7 tình huống thực tế kèm nhập vai (Roleplay) chấm điểm bản lĩnh.
- **Tab 3 – Hộp Thư Báo Cáo & Kết Nối GV:** Gửi báo cáo ẩn danh hoặc có tên, đính kèm mô tả bằng chứng, nhận Mã Tra Cứu (`NA-XXXX`). Có sẵn 4 mã mẫu để thử tra cứu 2 chiều: `NA-7868`, `NA-2026`, `NA-6868`, `NA-9090`.
- **Tab 4 – Góc Bình Tâm & Vườn Hoa Tử Tế:** Vòng tròn hít thở 4-4-4, Nhật ký cảm xúc và Bức tường lời chúc tích cực.
- **Tab 5 – Thống Kê, Cảnh Báo & Xử Lý (GV & BGH):**
  - Thử 3 vai trò phân quyền mẫu: **Phòng Tâm lý (`TL-2026`)**, **GV Chủ nhiệm (`GV-2026`)**, **Ban Giám hiệu (`BGH-2026`)**.
  - Trải nghiệm **Trợ lý AI Cố vấn Sư phạm & Pháp lý** trên từng hồ sơ (3 nút chọn nhanh câu trả lời mẫu) và **Bàn Cố Vấn Tình Huống Khó**.
  - Thử 3 Mã QR Zalo và nút **Copy & Mở Zalo 1-Chạm**.
- **Tab 6 – Quy Trình, An Toàn & Pháp Lý:** Trình bày đầy đủ Bước 1–3A/3B, nguyên tắc Mục 5 và 3 căn cứ pháp lý (Nghị định 80/2017/NĐ-CP, Thông tư 18/2025/TT-BGDĐT, Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15).

---

## GIAI ĐOẠN 2: CHUYỂN SANG DỮ LIỆU THẬT CỦA NHÀ TRƯỜNG (5 PHÚT)

Sau khi Ban Giám hiệu thống nhất đưa vào sử dụng chính thức, thực hiện đúng **3 bước sau**:

### Bước 1: Tạo Google Sheet Trung Tâm của Nhà trường (Lưu trữ lâu dài 100%)
> **Lưu ý quan trọng:** Vercel chạy theo cơ chế Serverless (bộ nhớ tạm sẽ tự làm mới sau mỗi lần khởi động lại), nên **Google Sheet là nơi lưu trữ hồ sơ chính thức và vĩnh viễn của nhà trường**.

1. Dùng tài khoản Google chính thức của nhà trường tạo một file **Google Sheet** mới (đặt tên VD: *Quản Lý Hộp Thư Bạn Đồng Hành AI - THCS ...*).
2. Trên thanh công cụ Google Sheet, chọn **Tiện ích mở rộng (Extensions) ➔ Apps Script**.
3. Xóa hết nội dung mặc định trong Apps Script, dán đoạn mã có sẵn ở mục **“📋 Copy Mã Google Apps Script Chuẩn”** (Tab 5 trên web) vào rồi bấm **Lưu (Ctrl + S)**.
4. Bấm **Triển khai (Deploy) ➔ Triển khai mới (New deployment)**:
   - Chọn loại: **Ứng dụng web (Web App)**
   - Thực thi dưới dạng (Execute as): **Tôi (Me)**
   - Quyền truy cập (Who has access): **Bất kỳ ai (Anyone)**
5. Bấm **Triển khai**, cấp quyền và **Copy đường link Web App** (có dạng `https://script.google.com/macros/s/.../exec`).

### Bước 2: Chuẩn bị 3 Luồng Zalo thật của Nhà trường
1. **Luồng Zalo 1 (Cá nhân GV Tâm lý):** Số điện thoại Zalo của thầy/cô phụ trách tư vấn tâm lý (VD: `0912345678`).
2. **Luồng Zalo 2 (Cá nhân GV Chủ nhiệm / Giám thị):** Số điện thoại Zalo của đại diện GVCN/Giám thị trực (VD: `0987654321`).
3. **Luồng Zalo 3 (Group Ban Giám hiệu & An toàn Trường học):** Mở nhóm Zalo BGH trên điện thoại ➔ Bấm biểu tượng **Menu góc phải ➔ Link tham gia nhóm ➔ Sao chép link** (dạng `https://zalo.me/g/xxxxxx`).

### Bước 3: Bật Chế độ Dữ liệu Thật & Khóa Bảo mật trên Vercel
Đăng nhập **Vercel** ➔ Mở dự án **`ban-dong-hanh-ai`** ➔ Chọn **Settings ➔ Environment Variables** và thêm bảng biến môi trường sau:

| Tên biến (Key) | Giá trị (Value) | Tác dụng |
|---|---|---|
| `DEMO_DATA` | `off` | **Xóa sạch toàn bộ dữ liệu demo**, ẩn nút PIN mẫu và **BẮT BUỘC đăng nhập PIN** mới xem được Tab 5 |
| `SCHOOL_NAME` | `Trường THCS ...` | Tên trường hiển thị trên hệ thống |
| `PIN_PSYCH` | *(Mã bí mật riêng, VD: `TL-8392`)* | Mã PIN đăng nhập Luồng 1 (GV Tâm lý) |
| `PIN_GVCN` | *(Mã bí mật riêng, VD: `GV-4719`)* | Mã PIN đăng nhập Luồng 2 (GV Chủ nhiệm) |
| `PIN_BGH` | *(Mã bí mật riêng, VD: `BGH-9504`)* | Mã PIN toàn quyền Ban Giám hiệu |
| `SESSION_SECRET` | *(Chuỗi bí mật bất kỳ dài >= 20 ký tự)* | Khóa ký token đăng nhập HMAC-SHA256 an toàn |
| `ZALO_PSYCH_LINK` | *(SĐT Zalo GV Tâm lý)* | Lưu cố định Zalo Luồng 1 & tự tạo QR |
| `ZALO_GVCN_LINK` | *(SĐT Zalo GVCN)* | Lưu cố định Zalo Luồng 2 & tự tạo QR |
| `ZALO_BGH_LINK` | *(Link Group `https://zalo.me/g/...`)* | Lưu cố định Group Zalo Luồng 3 & tự tạo QR |
| `GOOGLE_SHEET_WEBHOOK_URL` | *(Link Web App ở Bước 1)* | Tự động đẩy 100% hồ sơ & phản hồi vào Google Sheet |
| `GEMINI_API_KEY` | *(Tùy chọn)* | Kết nối mở rộng Gemini API (bỏ trống hệ thống vẫn chạy 100% AI Nội tại) |

Sau khi lưu các biến trên, vào tab **Deployments** ➔ bấm dấu **`...`** ở bản mới nhất ➔ chọn **Redeploy**. Từ lúc này, toàn bộ dữ liệu mẫu biến mất và hệ thống chạy hoàn toàn bằng dữ liệu thật của nhà trường!

---

## 🛡️ ĐÁNH GIÁ CHỐNG SPAM & BẢO MẬT AN TOÀN HỆ THỐNG

### 1. Các lớp bảo vệ ĐÃ TÍCH HỢP và ĐÃ KIỂM THỬ
1. **Chống Spam 5 lớp:**
   - **Honeypot ẩn (`website_url`):** Tự động chặn bot điền form tự động.
   - **Giới hạn tần suất (Rate Limiting theo IP băm):** Chặn gửi quá nhiều lượt ở tất cả API nhạy cảm (Hộp thư: 8 ca/10 phút; Chat AI: 30 tin/phút; Tra cứu mã: 25 lần/5 phút chống dò mã `NA-XXXX`; Đăng nhập PIN: 15 lần/5 phút chống dò PIN; Vườn Tử Tế: 10 lời nhắn/phút).
   - **Chống gửi trùng lặp (Duplicate Filter):** Chặn bấm gửi lặp lại cùng một nội dung trong 60 giây.
   - **Lọc spam rác & ngôn từ độc hại:** Chặn chuỗi lặp ký tự vô nghĩa (VD: `aaaaaaaaaaaa...`), chặn rải quá 3 đường link quảng cáo, và lọc từ ngữ xúc phạm ở Vườn Hoa Tử Tế.
   - **Giới hạn kích thước gói tin:** Chặn payload vượt quá 500 KB để chống tấn công làm treo bộ nhớ.
2. **Bảo mật Dữ liệu Trẻ em & Chống Lỗ hổng Web (Tuân thủ Luật 91/2025/QH15):**
   - **Không lưu IP thật / SĐT bắt buộc:** Chỉ băm 1 chiều IP bằng `HMAC-SHA256` để chống spam, tuyệt đối không trả mã băm ra ngoài.
   - **Chống XSS & Script Injection:** Đã làm sạch đầu vào (`sanitizeInput`) ở backend và mã hóa HTML (`escapeHtml`) toàn bộ nội dung học sinh trước khi hiển thị ở frontend.
   - **Chống CSV Formula Injection:** Tự động vô hiệu hóa công thức độc hại (`=`, `+`, `-`, `@`) khi xuất file Google Sheet `.csv`.
   - **Phân quyền RBAC chặt chẽ & Token HMAC-SHA256:** Khi bật `DEMO_DATA=off`, mọi API quản trị (xem danh sách hồ sơ, trả lời, tải CSV, đổi cấu hình Zalo/Sheet, dùng Trợ lý AI BGH) đều bắt buộc xác thực token ký HMAC-SHA256 (hạn 12 giờ), chỉ xem đúng luồng Zalo thuộc thẩm quyền và không bao giờ lộ tài liệu tham mưu BGH ra phía học sinh.
   - **Security Headers chuẩn:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, `Cache-Control: no-store` cho dữ liệu nhạy cảm.
   - **Chế độ Ngụy trang Nhanh (`ESC x2`):** Bảo vệ học sinh khi có người đi ngang qua màn hình.

### 2. Hai lưu ý thực tế khi chạy trên gói miễn phí Vercel (Minh bạch cho Nhà trường)
- **Lưu ý 1 – Rate Limit theo bộ nhớ tiến trình:** Trên gói Serverless miễn phí của Vercel, bộ đếm chống spam chạy trong RAM của từng instance (không dùng Redis ngoài). Với lưu lượng 1 trường THCS (~500–2.000 học sinh), cơ chế này hoạt động hiệu quả và không tốn chi phí; nếu triển khai cấp Sở/Quận nhiều vạn học sinh thì nên bổ sung thêm **Cloudflare Turnstile / Upstash Redis**.
- **Lưu ý 2 – Lưu trữ dài hạn:** Khi máy chủ Serverless của Vercel ngủ đông sau một thời gian không có truy cập, dữ liệu lưu tạm trên máy chủ sẽ tự làm mới. Do đó nhà trường **bắt buộc kết nối Google Sheet ở Giai đoạn 2** để lưu giữ 100% lịch sử báo cáo, và cài đặt quyền chia sẻ file Google Sheet ở chế độ **Hạn chế (Restricted)** chỉ cấp cho Ban Giám hiệu và Giáo viên Tư vấn Tâm lý.
