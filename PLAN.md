# 🌻 KẾ HOẠCH GIÁO DỤC & KIẾN TRÚC HỆ THỐNG: "TRẠM NẮNG ẤM" (SUNNY HARBOR)
**Web App tích hợp Trí Tuệ Nhân Tạo hỗ trợ tâm lý & phòng chống bắt nạt học đường cho học sinh THCS (Lớp 6 – Lớp 9)**

---

## PHẦN 1: GÓC NHÌN CHUYÊN GIA GIÁO DỤC 20 NĂM KINH NGHIỆM

### 1.1. Đặc điểm tâm sinh lý học sinh từ Lớp 6 đến Lớp 9
Qua 20 năm công tác tư vấn tâm lý và quản lý giáo dục cấp Trung học Cơ sở (THCS), chúng tôi nhận thấy học sinh từ 11 đến 15 tuổi không thể áp dụng chung một cách tiếp cận cứng nhắc. Mỗi khối lớp có "vùng nhạy cảm" riêng:

| Khối lớp | Độ tuổi | Đặc điểm tâm lý nổi bật | Nguy cơ học đường & Bắt nạt thường gặp | Phương pháp AI & Sư phạm tiếp cận |
| :--- | :--- | :--- | :--- | :--- |
| **Lớp 6** | 11–12 | Khủng hoảng chuyển cấp từ Tiểu học lên THCS; bỡ ngỡ với cách học mới, sợ bị lạc lõng. | Bị trêu chọc ngoại hình, giấu đồ dùng học tập, chưa biết cách kết bạn nhóm mới, bị anh chị lớp lớn dọa nạt. | Ngôn ngữ ấm áp, khích lệ nhẹ nhàng, hướng dẫn kỹ năng kết bạn và tìm thầy cô chủ nhiệm. |
| **Lớp 7** | 12–13 | Bắt đầu dậy thì mạnh, nhu cầu thuộc về một "nhóm bạn" (peer group) cực kỳ lớn. | **Bắt nạt quan hệ (Relational bullying):** Tẩy chay, cô lập khỏi nhóm chơi, lập group chat nói xấu, tung tin đồn. | Đồng cảm sâu sắc với nỗi sợ bị bỏ rơi, hướng dẫn cách giữ bình tĩnh, lưu bằng chứng và mở rộng vòng bạn bè. |
| **Lớp 8** | 13–14 | Khẳng định cái tôi mạnh mẽ, dễ bất đồng với phụ huynh/giáo viên, nhạy cảm về ngoại hình và tình cảm tuổi học trò. | **Cyberbullying (Bắt nạt qua mạng):** Chế ảnh (meme), body shaming, công kích cá nhân trên mạng xã hội, áp lực đồng trang lứa. | Tôn trọng quyền tự chủ, không phán xét hay giáo điều; phân tích tình huống khách quan, cung cấp kịch bản ứng xử thông minh. |
| **Lớp 9** | 14–15 | Áp lực thi tuyển sinh vào Lớp 10, lo âu tương lai, kiệt sức học tập (burnout) cộng hưởng mâu thuẫn bạn bè. | Cô lập tinh thần, bắt nạt ngầm kết hợp áp lực điểm số, nguy cơ trầm cảm hoặc suy nghĩ tiêu cực cao hơn. | Lắng nghe sâu, giải tỏa áp lực kỳ vọng, chia nhỏ mục tiêu, kết nối trực tiếp chuyên gia tâm lý khi có dấu hiệu quá tải. |

### 1.2. Nguyên tắc Thiết kế "Màu sắc Vui vẻ - Không gian An toàn" (Cheerful & Safe UI/UX)
- **Không dùng màu sắc u tối hay cảnh báo hình sự hóa:** Các ứng dụng chống bạo lực học đường truyền thống thường dùng màu đỏ-đen tạo cảm giác căng thẳng, tội lỗi. **Trạm Nắng Ấm** sử dụng bảng màu **Vàng Nắng Ấm (`#FFB703`) - Cam San Hô (`#FF6B6B`) - Xanh Bạc Hà (`#06D6A0`) - Nền Kem Sáng (`#FFFDF7`)** mang lại năng lượng tích cực, thân thiện và hy vọng.
- **Cơ chế Bảo vệ Kép (Safety-First):**
  - **Chế độ Ẩn danh Thông minh:** Học sinh tự chọn Biệt danh dễ thương (VD: *Sóc Nhỏ Lạc Quan*, *Cánh Cụt Dũng Cảm*).
  - **Nút "Ẩn Nhanh / Chuyển sang Trang Học Tập" (`ESC x2` hoặc click 1 chạm):** Ngay lập tức biến giao diện thành "Bảng Ôn Tập Công Thức Toán & Tiếng Anh THCS" để nếu có người lạ hoặc kẻ bắt nạt bất ngờ nhìn vào màn hình, học sinh hoàn toàn được bảo vệ.

---

## PHẦN 2: CẤU TRÚC 6 MODULE CHỨC NĂNG HOÀN CHỈNH

1. **Module 1 - Trò chuyện cùng AI "Mặt Trời Nhỏ" (AI Companion):**
   - Tích hợp bộ máy AI Sư phạm chuyên biệt cho Lớp 6-9 (hoạt động tức thì 100% không cần cấu hình phức tạp, đồng thời hỗ trợ kết nối Google Gemini API nếu trường học muốn mở rộng).
   - Tự động điều chỉnh cách xưng hô và lời khuyên theo **Khối lớp (6, 7, 8, 9)** và **Hoàn cảnh cụ thể**.
   - Hệ thống **Triage Cảnh báo Sớm**: Phát hiện từ khóa nguy hiểm (bạo lực thể chất, đe dọa, tự làm hại, tuyệt vọng) để hiển thị đường dây nóng **111** và nút Cầu viện khẩn cấp.
2. **Module 2 - La Bàn Ứng Phó Bắt Nạt & Luyện Tập Tình Huống (Interactive Anti-Bullying Guide & Roleplay):**
   - 6 kịch bản hoàn cảnh thực tế (Bắt nạt mạng, Tẩy chay cô lập, Body shaming/Lời nói, Trấn lột/Thể chất, Áp lực học tập/Gia đình, Người chứng kiến).
   - Mỗi kịch bản có: *Giải mã tâm lý*, *3 bước hành động vàng*, *Những điều TUYỆT ĐỐI tránh*, và **Trò chơi nhập vai (Roleplay Quiz)** giúp học sinh thử chọn cách phản ứng và nhận phân tích từ chuyên gia.
3. **Module 3 - Hộp Thư Cầu Viện An Toàn & Tra Cứu Phản Hồi (Safe Help Box):**
   - Gửi báo cáo/tâm sự ẩn danh hoặc định danh tới Phòng Tâm lý học đường.
   - Nhận **Mã Bảo Mật (Tracking Code)** để tra cứu câu trả lời của thầy cô tư vấn bất cứ lúc nào.
4. **Module 4 - Trạm Năng Lượng Vui Vẻ & Góc Bình Tâm (Wellness & Joy Station):**
   - **Check-in Cảm Xúc Hàng Ngày (Mood Journal):** Ghi lại cảm xúc và nhận thông điệp chữa lành.
   - **Vòng Tròn Hơi Thở 4-4-4 (Breathing Exercise):** Hoạt ảnh hướng dẫn hít thở giảm căng thẳng tức thì.
   - **Vườn Hoa Tử Tế (Kindness Wall):** Nơi học sinh lớp 6-9 gửi những lời chúc, lời động viên ẩn danh cho nhau.
5. **Module 5 - Cổng Chuyên Gia Tư Vấn / Giáo Viên (Counselor Portal):**
   - Dành cho Giáo viên Tâm lý Học đường theo dõi thống kê cảm xúc toàn trường theo khối 6-9, xem danh sách Hộp thư cầu viện, lọc ca nguy cơ cao và gửi phản hồi trực tiếp cho học sinh qua Mã Bảo Mật.
6. **Module 6 - Chế Độ Ngụy Trang An Toàn (Quick Camouflage Mode):**
   - Chuyển đổi tức thời sang giao diện Ôn tập Kiến thức THCS khi cần giữ bí mật.

---

## PHẦN 3: HƯỚNG DẪN KHỞI CHẠY & SỬ DỤNG
1. Chạy lệnh `npm start` tại thư mục dự án.
2. Mở trình duyệt tại `http://localhost:3000`.
3. Toàn bộ dữ liệu mẫu (nhật ký, lời nhắn tích cực, kịch bản lớp 6-9, hộp thư mẫu) đã được khởi tạo sẵn sàng để trải nghiệm ngay.
