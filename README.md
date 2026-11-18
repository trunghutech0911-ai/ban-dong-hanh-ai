# 🌻 DỰ ÁN ỨNG DỤNG AI “BẠN ĐỒNG HÀNH”
**Lắng nghe • Thấu hiểu • Bảo vệ**  
*Tư vấn tâm lý ẩn danh, cá thể hóa và phòng chống bắt nạt học đường dành cho học sinh trung học cơ sở (Lớp 6 – Lớp 9)*

---

## 🎯 1. Ý Tưởng Cốt Lõi & 6 Chức Năng Chính
Ứng dụng giúp học sinh lớp 6–9 có nơi chia sẻ những khó khăn tâm lý, được hướng dẫn xử lý tình huống bắt nạt học đường và kết nối với người hỗ trợ phù hợp mà không bắt buộc tiết lộ danh tính khi bắt đầu trò chuyện:
1. **AI tư vấn tâm lý ẩn danh (Mục 3.1):** Chọn biệt danh, không cần tài khoản; AI lắng nghe, đặt câu hỏi ngắn dễ hiểu, không tự chẩn đoán bệnh tâm lý.
2. **Cá thể hóa hỗ trợ (Mục 3.2):** Theo khối lớp (6–9), cảm xúc, vai trò (*Người bị bắt nạt, Người chứng kiến, Người muốn nhận diện & sửa sai hành vi*) và mức độ an toàn.
3. **Hộp thư báo cáo bắt nạt (Mục 3.3):** Văn bản, nhóm tình huống, bổ sung bằng chứng khi thực sự cần thiết; chọn ẩn danh hoặc để lại phương thức liên hệ; tra cứu phản hồi 2 chiều bằng mã bí mật (`NA-XXXX`).
4. **Thư viện kỹ năng phòng chống bắt nạt (Mục 3.4):** 7 tình huống tương tác (Roleplay) luyện kỹ năng tự bảo vệ và ứng xử không bạo lực.
5. **Kết nối giáo viên tư vấn & 3 Luồng Zalo (Mục 3.5):** Định tuyến thông minh vào 3 luồng Zalo nhà trường và ưu tiên ca nguy cơ cao theo quy trình Bước 3B.
6. **Thống kê, cảnh báo & Đồng bộ Google Sheet (Mục 3.6 & 6.2):** Tổng hợp xu hướng ở quy mô trường mà không lộ danh tính học sinh.

---

## 📲 2. Hướng Dẫn Bàn Giao: Kết Nối 3 Luồng Zalo & Google Sheet Cho Nhà Trường (30 Giây)

Sau khi mở ứng dụng, thầy cô vào tab **`5. Thống Kê, Cảnh Báo & Xử Lý (GV)`** ➔ bấm **`📲 Thiết lập Nhanh 3 Zalo (2 Cá nhân + 1 Group BGH) & Google Sheet`**:

### A. Kết nối 3 Luồng Zalo (Quét QR hoặc 1-Chạm)
* **👤 Luồng Zalo 1 (Cá nhân GV Tâm lý):** Nhập **Số điện thoại Zalo** của giáo viên phụ trách tư vấn tâm lý (VD: `0901234567`). Hệ thống tự tạo link `https://zalo.me/0901234567` và **Mã QR** ngay trên màn hình.
* **👤 Luồng Zalo 2 (Cá nhân GV Chủ nhiệm):** Nhập **Số điện thoại Zalo** của đại diện GVCN/Giám thị khối (VD: `0902345678`).
* **👥 Luồng Zalo 3 (Group Ban Giám hiệu):** Mở nhóm Zalo Ban Giám hiệu & An toàn trường học ➔ Copy **Link tham gia nhóm** (`https://zalo.me/g/...`) dán vào ô Luồng 3.
* **Cách sử dụng hàng ngày cho thầy cô:** Trên mỗi hồ sơ phản ánh đều có 3 nút **`Copy & Mở Zalo 1/2/3`** — chỉ cần bấm 1 chạm, hệ thống tự động copy toàn bộ tóm tắt hồ sơ chuẩn và bật thẳng cửa sổ chat Zalo cá nhân hoặc Group BGH để thầy cô dán (`Ctrl + V`) vào xử lý ngay!

### B. Kết nối tự động với Google Sheet Trung Tâm (Không cần cài đặt phức tạp)
1. Tạo 1 file **Google Sheet** mới trên tài khoản Google của nhà trường.
2. Trên thanh công cụ Google Sheet, chọn **Tiện ích mở rộng (Extensions) > Apps Script**.
3. Trong giao diện web của ứng dụng (Mục Thiết lập), bấm nút **`📋 Copy Mã Google Apps Script Chuẩn`**, dán đè vào cửa sổ Apps Script và bấm **Lưu**.
4. Bấm **Triển khai (Deploy) > Triển khai mới (New deployment)** ➔ Chọn loại **Ứng dụng web (Web App)** ➔ Quyền truy cập chọn **Bất kỳ ai (Anyone)** ➔ Copy **URL Web App** dán vào ô `Google Apps Script Web App URL` trên ứng dụng và bấm **Lưu**.
5. Ngoài ra, nhà trường luôn có thể bấm nút **`📊 Tải Google Sheet (.CSV)`** bất cứ lúc nào để lấy bảng tổng hợp tiếng Việt chuẩn UTF-8.

---

## 🚀 3. Hướng Dẫn Đẩy Lên GitHub (`trunghutech0911-ai`) & Deploy Lên Vercel

### Bước 1: Đẩy code lên GitHub mới
Mở Terminal / PowerShell tại thư mục dự án và chạy:
```bash
git init
git add .
git commit -m "Release du an Ban Dong Hanh AI THCS (3 Luong Zalo + Google Sheet + Vercel)"
git branch -M main
# Thay <TEN_REPO> bằng tên repository bạn tạo trên https://github.com/trunghutech0911-ai
git remote add origin https://github.com/trunghutech0911-ai/<TEN_REPO>.git
git push -u origin main
```

### Bước 2: Deploy 1-Chạm lên Vercel
Dự án đã được cấu hình sẵn file `vercel.json` và Serverless Entrypoint tại `api/index.js`:
1. Đăng nhập [https://vercel.com](https://vercel.com) bằng tài khoản GitHub `trunghutech0911-ai`.
2. Bấm **Add New... > Project** ➔ Chọn repository vừa đẩy lên và bấm **Import**.
3. Giữ nguyên mặc định và bấm **Deploy** (Hoàn tất trong ~20 giây).
4. *(Tùy chọn)* Trong mục **Settings > Environment Variables** trên Vercel, có thể cấu hình sẵn:
   - `GOOGLE_SHEET_WEBHOOK_URL`: Link Google Apps Script Web App của trường.
   - `GEMINI_API_KEY`: Khóa Gemini API (nếu muốn mở rộng bên cạnh Bộ não AI Sư phạm Nội tại).

---

## ⚖️ 4. Cơ Sở Pháp Lý Tham Khảo (Mục 7)
1. **Chính phủ (2017):** Nghị định số `80/2017/NĐ-CP` về môi trường giáo dục an toàn, lành mạnh, thân thiện, phòng, chống bạo lực học đường.
2. **Bộ Giáo dục và Đào tạo (2025):** Thông tư số `18/2025/TT-BGDĐT` hướng dẫn về công tác tư vấn học đường và công tác xã hội trong trường học.
3. **Quốc hội (2025):** Luật Bảo vệ dữ liệu cá nhân số `91/2025/QH15`, hiệu lực ngày 01/01/2026.
