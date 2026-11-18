/**
 * SỔ TAY KIẾN THỨC NỀN TẢNG THCS (LỚP 6 – LỚP 9 • CHƯƠNG TRÌNH GDPT 2018)
 * Hiển thị khi kích hoạt Chế độ Ẩn nhanh (ESC x2) — Đầy đủ, chuẩn xác, trực quan và có giá trị ôn tập thực tế
 */

const STUDY_KNOWLEDGE_CARDS = [
  // ===================== TOÁN HỌC (LỚP 6 - 9) =====================
  {
    id: 'math-6',
    grade: '6',
    subject: 'math',
    subjectLabel: 'Toán học',
    icon: '📐',
    title: 'Số nguyên, ƯCLN–BCNN & Hình học trực quan',
    summary: 'Nền tảng phép tính số học và công thức chu vi, diện tích các hình phẳng trọng tâm Lớp 6.',
    formulas: [
      { name: 'Quy tắc dấu ngoặc', expr: '-(a + b - c) = -a - b + c' },
      { name: 'Quan hệ ƯCLN & BCNN', expr: 'a · b = ƯCLN(a, b) · BCNN(a, b)' },
      { name: 'Diện tích Hình bình hành', expr: 'S = a · h   (C = 2(a + b))' },
      { name: 'Diện tích Hình thoi', expr: 'S = ½ · d₁ · d₂   (d₁, d₂ là 2 đường chéo)' },
      { name: 'Diện tích Hình thang cân', expr: 'S = ½ · (a + b) · h' }
    ],
    tip: 'Khi bỏ dấu ngoặc có dấu "-" đằng trước, nhớ đổi dấu TẤT CẢ các số hạng bên trong ngoặc; dấu "+" giữ nguyên dấu.'
  },
  {
    id: 'math-7',
    grade: '7',
    subject: 'math',
    subjectLabel: 'Toán học',
    icon: '📐',
    title: 'Tỉ lệ thức, Góc song song & Tam giác bằng nhau',
    summary: 'Công cụ giải toán tỉ lệ và 3 trường hợp chứng minh hai tam giác bằng nhau cốt lõi.',
    formulas: [
      { name: 'Tỉ lệ thức', expr: 'a/b = c/d  ⇔  a·d = b·c  (b, d ≠ 0)' },
      { name: 'Dãy tỉ số bằng nhau', expr: 'a/b = c/d = (a + c)/(b + d) = (a - c)/(b - d)' },
      { name: 'Tổng 3 góc tam giác', expr: '∠A + ∠B + ∠C = 180°' },
      { name: 'Góc ngoài tam giác', expr: 'Góc ngoài = tổng 2 góc trong không kề với nó' },
      { name: '3 TH tam giác bằng nhau', expr: 'c.c.c  •  c.g.c (góc xen giữa)  •  g.c.g (cạnh xen giữa)' }
    ],
    tip: 'Khi chứng minh tam giác bằng nhau theo c.g.c, góc PHẢI nằm giữa 2 cạnh đang xét; với tam giác vuông có thêm trường hợp Cạnh huyền – Góc nhọn và Cạnh huyền – Cạnh góc vuông.'
  },
  {
    id: 'math-8',
    grade: '8',
    subject: 'math',
    subjectLabel: 'Toán học',
    icon: '📐',
    title: 'Trọn bộ 7 Hằng đẳng thức đáng nhớ & Định lý Thalès',
    summary: 'Kiến thức xương sống của đại số THCS dùng xuyên suốt từ Lớp 8 đến thi vào Lớp 10.',
    formulas: [
      { name: '1–2. Bình phương tổng/hiệu', expr: '(A ± B)² = A² ± 2AB + B²' },
      { name: '3. Hiệu hai bình phương', expr: 'A² - B² = (A - B)(A + B)' },
      { name: '4–5. Lập phương tổng/hiệu', expr: '(A ± B)³ = A³ ± 3A²B + 3AB² ± B³' },
      { name: '6–7. Tổng/Hiệu lập phương', expr: 'A³ ± B³ = (A ± B)(A² ∓ AB + B²)' },
      { name: 'Định lý Thalès (DE // BC)', expr: 'AD/AB = AE/AC = DE/BC' },
      { name: 'Định lý Pytago', expr: 'ΔABC vuông tại A ⇔ BC² = AB² + AC²' }
    ],
    tip: 'Phân biệt nhanh: A³ + B³ có nhân tử đầu là (A + B), ngoặc sau là bình phương thiếu mang dấu TRỪ (-AB) và ngược lại với A³ - B³.'
  },
  {
    id: 'math-9',
    grade: '9',
    subject: 'math',
    subjectLabel: 'Toán học',
    icon: '📐',
    title: 'Phương trình bậc hai, Viète & Lượng giác (Ôn thi vào 10)',
    summary: 'Hệ thống công thức trọng tâm xuất hiện trong 100% đề thi tuyển sinh vào Lớp 10 THPT.',
    formulas: [
      { name: 'Căn bậc hai số học', expr: '√(A²) = |A|   (A nếu A ≥ 0; -A nếu A < 0)' },
      { name: 'Biệt thức Delta (ax²+bx+c=0)', expr: 'Δ = b² - 4ac   •   x₁,₂ = (-b ± √Δ) / (2a)' },
      { name: 'Định lý Viète (Δ ≥ 0)', expr: 'S = x₁ + x₂ = -b/a   •   P = x₁·x₂ = c/a' },
      { name: 'Tỉ số lượng giác góc nhọn α', expr: 'sin = Đối/Huyền • cos = Kề/Huyền • tan = Đối/Kề • cot = Kề/Đối' },
      { name: 'Hệ thức lượng cơ bản', expr: 'sin²α + cos²α = 1   •   tanα · cotα = 1' }
    ],
    tip: 'Thần chú lượng giác kinh điển: "Sin đi học (Đối/Huyền), Cos không hư (Kề/Huyền), Tan đoàn kết (Đối/Kề), Cot kết đoàn (Kề/Đối)".'
  },

  // ===================== TIẾNG ANH (GRADES 6 - 9) =====================
  {
    id: 'eng-6',
    grade: '6',
    subject: 'english',
    subjectLabel: 'Tiếng Anh',
    icon: '📘',
    title: 'Thì Hiện tại, So sánh Tính từ & Modal Verbs (Grade 6)',
    summary: 'Cấu trúc nền tảng giúp xây dựng câu đúng ngữ pháp ngay từ đầu cấp THCS.',
    formulas: [
      { name: 'Present Simple (Hiện tại đơn)', expr: 'S + V(s/es) + O   (always, usually, every day)' },
      { name: 'Present Continuous (HT tiếp diễn)', expr: 'S + am/is/are + V-ing   (now, at the moment, Look!)' },
      { name: 'So sánh hơn (Comparative)', expr: 'Tính từ ngắn: adj-er + than  |  Dài: more + adj + than' },
      { name: 'So sánh nhất (Superlative)', expr: 'Ngắn: the + adj-est  |  Dài: the most + adj' },
      { name: 'Động từ khuyết thiếu', expr: 'S + should / must / can + V-inf (nguyên mẫu)' }
    ],
    tip: 'Tính từ bất quy tắc hay gặp: good → better → the best; bad → worse → the worst; far → farther/further → the farthest/furthest.'
  },
  {
    id: 'eng-7',
    grade: '7',
    subject: 'english',
    subjectLabel: 'Tiếng Anh',
    icon: '📘',
    title: 'Quá khứ đơn, Tương lai đơn & Liên từ (Grade 7)',
    summary: 'Diễn đạt hành động quá khứ – tương lai và nối câu mạch lạc bằng liên từ tương phản.',
    formulas: [
      { name: 'Past Simple (Quá khứ đơn)', expr: 'S + V2/V-ed + O  |  Phủ định: S + didn\'t + V-inf' },
      { name: 'Future Simple (Tương lai đơn)', expr: 'S + will / won\'t + V-inf   (tomorrow, next week)' },
      { name: 'Nhượng bộ (Mặc dù)', expr: 'Although / Though + S + V,  S + V' },
      { name: 'Tuy nhiên (However)', expr: 'S + V.  However,  S + V.' },
      { name: 'Lượng từ (Quantifiers)', expr: 'many / a few + N đếm được số nhiều  |  much / a little + N không đếm được' }
    ],
    tip: 'Lưu ý tránh lỗi sai kinh điển: Trong 1 câu đã dùng "Although / Though" thì KHÔNG dùng thêm "but" ở vế sau!'
  },
  {
    id: 'eng-8',
    grade: '8',
    subject: 'english',
    subjectLabel: 'Tiếng Anh',
    icon: '📘',
    title: 'Quá khứ tiếp diễn, Điều kiện loại 1 & Câu gián tiếp (Grade 8)',
    summary: 'Các cấu trúc nâng cao giúp viết câu phức và chuyển đổi câu mượt mà.',
    formulas: [
      { name: 'Past Continuous (QK tiếp diễn)', expr: 'S + was/were + V-ing   (at 8 p.m. yesterday, when/while)' },
      { name: 'Present Perfect (HT hoàn thành)', expr: 'S + have/has + V3/ed   (since + mốc, for + khoảng, yet, already)' },
      { name: 'First Conditional (ĐK loại 1)', expr: 'If + S + V(HTĐ),  S + will/can/may + V-inf' },
      { name: 'Reported Speech (Câu trần thuật)', expr: 'S + said (that) / told O (that) + S + V(lùi 1 thì)' },
      { name: 'Passive Voice (Câu bị động)', expr: 'S + be (chia theo thì) + V3/ed + (by O)' }
    ],
    tip: 'Khi chuyển sang Câu gián tiếp nhớ 3 bước đổi: (1) Đổi đại từ/tính từ sở hữu → (2) Lùi 1 thì động từ → (3) Đổi trạng từ thời gian (now → then, today → that day, yesterday → the day before).'
  },
  {
    id: 'eng-9',
    grade: '9',
    subject: 'english',
    subjectLabel: 'Tiếng Anh',
    icon: '📘',
    title: 'Điều kiện loại 2, Câu ước Wish & Mệnh đề quan hệ (Grade 9)',
    summary: 'Trọng tâm ngữ pháp viết lại câu và trắc nghiệm trong đề thi vào Lớp 10.',
    formulas: [
      { name: 'Second Conditional (ĐK loại 2)', expr: 'If + S + V2/ed (be → were),  S + would/could + V-inf' },
      { name: 'Wish ở hiện tại', expr: 'S + wish(es) + S + V2/ed (be → were) / could + V-inf' },
      { name: 'Relative Clauses (MĐ quan hệ)', expr: 'who (người-S) • whom (người-O) • which (vật) • whose (sở hữu)' },
      { name: 'Phrasal Verbs hay thi', expr: 'look after (chăm sóc) • turn down (từ chối) • get over (vượt qua) • pass down (truyền lại)' },
      { name: 'Used to vs. Be used to', expr: 'used to + V-inf (đã từng)  ≠  be/get used to + V-ing (quen với)' }
    ],
    tip: 'Trong Mệnh đề quan hệ không xác định (có dấu phẩy ngăn cách, tên riêng hoặc this/that/my...), tuyệt đối KHÔNG dùng "that" thay cho who/which.'
  },

  // ===================== NGỮ VĂN (LỚP 6 - 9) =====================
  {
    id: 'lit-6',
    grade: '6',
    subject: 'literature',
    subjectLabel: 'Ngữ văn',
    icon: '📖',
    title: '6 Biện pháp tu từ cốt lõi & Cách nêu tác dụng chuẩn điểm',
    summary: 'Nhận diện nhanh và trả lời trọn điểm câu hỏi đọc hiểu biện pháp tu từ từ Lớp 6.',
    formulas: [
      { name: 'So sánh', expr: 'Đối chiếu sự vật A với B (từ: như, tựa, là, hơn...) → gợi hình ảnh sinh động.' },
      { name: 'Nhân hóa', expr: 'Gọi/tả vật bằng từ ngữ của người (chị ong, tre xung phong) → gần gũi, có hồn.' },
      { name: 'Ẩn dụ (So sánh ngầm)', expr: 'Gọi tên A bằng B dựa trên nét TƯƠNG ĐỒNG (VD: "Thuyền về có nhớ bến chăng").' },
      { name: 'Hoán dụ', expr: 'Gọi tên A bằng B dựa trên quan hệ GẦN GŨI (VD: "Áo nâu liền với áo xanh").' },
      { name: 'Điệp ngữ & Liệt kê', expr: 'Lặp từ/cụm từ để nhấn mạnh cảm xúc; kể nối tiếp để diễn tả đầy đủ, sâu sắc.' }
    ],
    tip: 'Công thức trả lời câu hỏi tu từ luôn đạt đủ 3 ý: (1) Gọi tên biện pháp + chỉ rõ từ ngữ → (2) Tác dụng nghệ thuật (gợi hình, gợi cảm, tạo nhịp điệu) → (3) Tác dụng nội dung (nhấn mạnh điều gì & thái độ tác giả).'
  },
  {
    id: 'lit-7',
    grade: '7',
    subject: 'literature',
    subjectLabel: 'Ngữ văn',
    icon: '📖',
    title: 'Kiểu đoạn văn, Ngôi kể & Văn Nghị luận đời sống',
    summary: 'Phân biệt nhanh cấu trúc đoạn văn và kỹ năng lập luận rõ ràng, giàu cảm xúc.',
    formulas: [
      { name: 'Đoạn Diễn dịch', expr: 'Câu chủ đề đứng ĐẦU đoạn → các câu sau triển khai, chứng minh.' },
      { name: 'Đoạn Quy nạp', expr: 'Các câu đầu phân tích dẫn chứng → Câu chủ đề chốt lại ở CUỐI đoạn.' },
      { name: 'Đoạn Song song / Phối hợp', expr: 'Song song: các câu bình đẳng | Phối hợp: có cả câu mở đầu và câu kết đoạn.' },
      { name: 'Ngôi kể chuyện', expr: 'Ngôi thứ nhất ("tôi" – chân thực)  •  Ngôi thứ ba (giấu mình – khách quan, linh hoạt).' }
    ],
    tip: 'Khi viết văn Nghị luận về một ý kiến (Tán thành / Phản đối), mỗi luận điểm cần đi kèm ít nhất 1 lí lẽ sắc bén + 1 bằng chứng đời sống cụ thể.'
  },
  {
    id: 'lit-8',
    grade: '8',
    subject: 'literature',
    subjectLabel: 'Ngữ văn',
    icon: '📖',
    title: 'Kiểu câu theo mục đích nói & Biện pháp tu từ nâng cao',
    summary: 'Làm chủ sắc thái diễn đạt trong văn bản thông tin, truyện ngắn và thơ Đường luật.',
    formulas: [
      { name: '4 kiểu câu mục đích nói', expr: 'Kể (.)  •  Hỏi (?)  •  Khiến (! / hãy, đừng, chớ)  •  Cảm (! / ôi, chao ôi)' },
      { name: 'Nói quá (Khoa trương)', expr: 'Phóng đại quy mô, tính chất để nhấn mạnh, gây ấn tượng mạnh.' },
      { name: 'Nói giảm nói tránh', expr: 'Diễn đạt tế nhị, uyển chuyển để tránh gây đau buồn hoặc thô tục.' },
      { name: 'Đảo ngữ & Câu hỏi tu từ', expr: 'Đảo vị ngữ lên trước để nhấn mạnh; hỏi không để trả lời mà để bộc lộ cảm xúc.' }
    ],
    tip: 'Khi phân tích thơ Đường luật (Thất ngôn bát cú / Tứ tuyệt), chú ý nghệ thuật ĐỐI ở hai cặp câu Thực (3–4) và Luận (5–6) cùng nhãn tự (từ đắt giá nhất câu).'
  },
  {
    id: 'lit-9',
    grade: '9',
    subject: 'literature',
    subjectLabel: 'Ngữ văn',
    icon: '📖',
    title: 'Mô hình Nghị luận Xã hội 4 bước & 6 Phương thức biểu đạt',
    summary: 'Cẩm nang đọc hiểu và viết đoạn văn Nghị luận Xã hội 200 chữ đạt điểm tối đa thi vào 10.',
    formulas: [
      { name: '6 Phương thức biểu đạt', expr: 'Tự sự • Miêu tả • Biểu cảm • Thuyết minh • Nghị luận • Hành chính – Công vụ' },
      { name: 'Bước 1 (NLXH): Giải thích', expr: 'Giải thích ngắn gọn khái niệm/từ khóa cốt lõi (1–2 câu).' },
      { name: 'Bước 2 (NLXH): Bàn luận', expr: 'Trả lời "Vì sao quan trọng?" (Ý nghĩa với cá nhân & cộng đồng).' },
      { name: 'Bước 3 (NLXH): Dẫn chứng', expr: '1–2 tấm gương/sự kiện thực tế tiêu biểu, khách quan, ngắn gọn.' },
      { name: 'Bước 4 (NLXH): Phản đề & Liên hệ', expr: 'Phê phán biểu hiện trái ngược + Bài học nhận thức & hành động của bản thân.' }
    ],
    tip: 'Với yêu cầu viết ĐOẠN VĂN 200 chữ: tuyệt đối KHÔNG xuống dòng ngắt đoạn, giữ dung lượng gọn trong khoảng 2/3 trang giấy thi và có câu chủ đề rõ ràng.'
  },

  // ===================== KHOA HỌC TỰ NHIÊN (LỚP 6 - 9) =====================
  {
    id: 'sci-6',
    grade: '6',
    subject: 'science',
    subjectLabel: 'KHTN (Lý–Hóa–Sinh)',
    icon: '🔬',
    title: 'Tế bào, Các thể của chất & Lực – Trọng lượng (KHTN 6)',
    summary: 'Những quy luật đầu tiên về thế giới sống, vật chất và lực cơ học trong tự nhiên.',
    formulas: [
      { name: 'Đơn vị cơ bản của sự sống', expr: 'Tế bào → Mô → Cơ quan → Hệ cơ quan → Cơ thể' },
      { name: '3 thành phần chính tế bào', expr: 'Màng tế bào  •  Tế bào chất  •  Nhân (hoặc vùng nhân ở tế bào nhân sơ)' },
      { name: 'Trọng lượng & Khối lượng', expr: 'P = 10 · m   (P: Newton [N], m: kilôgam [kg])' },
      { name: 'Sự chuyển thể của chất', expr: 'Nóng chảy (R→L) • Đông đặc (L→R) • Bay hơi (L→K) • Ngưng tụ (K→L)' }
    ],
    tip: 'Phân biệt nhanh: Tế bào THỰC VẬT có thêm Thành tế bào (cứng cáp), Lục lạp (quang hợp) và Không bào trung tâm lớn mà tế bào động vật không có.'
  },
  {
    id: 'sci-7',
    grade: '7',
    subject: 'science',
    subjectLabel: 'KHTN (Lý–Hóa–Sinh)',
    icon: '🔬',
    title: 'Tốc độ, Phản xạ ánh sáng, Nguyên tử & Quang hợp (KHTN 7)',
    summary: 'Công thức chuyển động đều, quang học cơ bản và trao đổi chất ở sinh vật.',
    formulas: [
      { name: 'Tốc độ chuyển động', expr: 'v = s / t   •   Đổi đơn vị: 1 m/s = 3,6 km/h' },
      { name: 'Định luật phản xạ ánh sáng', expr: 'Góc phản xạ bằng góc tới:  i\' = i' },
      { name: 'Cấu tạo Nguyên tử', expr: 'Số p = Số e = Số hiệu nguyên tử (Z)   •   Khối lượng ≈ p + n (amu)' },
      { name: 'Phương trình Quang hợp', expr: 'Nước + CO₂  —(Ánh sáng, Diệp lục)→  Glucose + Khí Oxygen (O₂)' }
    ],
    tip: 'Muốn đổi từ km/h sang m/s chỉ cần CHIA cho 3,6; muốn đổi từ m/s sang km/h chỉ cần NHÂN với 3,6 (VD: 36 km/h = 10 m/s).'
  },
  {
    id: 'sci-8',
    grade: '8',
    subject: 'science',
    subjectLabel: 'KHTN (Lý–Hóa–Sinh)',
    icon: '🔬',
    title: 'Áp suất, Bảo toàn khối lượng, Mol & Nồng độ (KHTN 8)',
    summary: 'Bộ công thức tính toán trọng tâm Vật lý chất lỏng và Hóa học định lượng.',
    formulas: [
      { name: 'Khối lượng riêng', expr: 'D = m / V   (kg/m³ hoặc g/cm³)' },
      { name: 'Áp suất & Lực đẩy Archimedes', expr: 'p = F / S  (Pa)   •   F_A = d · V  (N)' },
      { name: 'Định luật Bảo toàn khối lượng', expr: 'Tổng m(chất tham gia) = Tổng m(sản phẩm)' },
      { name: 'Công thức tính Số mol (n)', expr: 'n = m / M   •   Ở đkc (25°C, 1 bar): n = V / 24,79' },
      { name: 'Nồng độ dung dịch', expr: 'C% = (m_ct / m_dd) · 100%   •   C_M = n / V_dd (mol/L)' }
    ],
    tip: 'Chương trình GDPT 2018 dùng thể tích mol khí ở điều kiện chuẩn (25°C, 1 bar) là 24,79 lít (thay cho 22,4 lít ở chương trình cũ).'
  },
  {
    id: 'sci-9',
    grade: '9',
    subject: 'science',
    subjectLabel: 'KHTN (Lý–Hóa–Sinh)',
    icon: '🔬',
    title: 'Định luật Ohm, Dãy hoạt động kim loại & ADN (KHTN 9)',
    summary: 'Kiến thức tổng hợp Điện học, Hóa học vô cơ – hữu cơ và Di truyền học Lớp 9.',
    formulas: [
      { name: 'Định luật Ohm & Điện trở', expr: 'I = U / R   •   R = ρ · (l / S)   (Đơn vị: Ω)' },
      { name: 'Mạch nối tiếp / song song', expr: 'Nối tiếp: R_tđ = R₁ + R₂  |  Song song: 1/R_tđ = 1/R₁ + 1/R₂' },
      { name: 'Công suất & Điện năng', expr: 'P = U · I = I²·R = U²/R  (W)   •   A = P · t  (J)' },
      { name: 'Dãy hoạt động kim loại', expr: 'K, Na, Ba, Ca, Mg, Al, Zn, Fe, Pb, (H), Cu, Ag, Au' },
      { name: 'Nguyên tắc bổ sung ADN', expr: 'A liên kết T (2 lk H)  •  G liên kết C (3 lk H)  •  L = (N/2)·3,4 Å' }
    ],
    tip: 'Mẹo nhớ Dãy hoạt động kim loại: "Khi Nào Bạn Cần May Áo Záp Sắt Phải (Hỏi) Cửa Á Âu" — kim loại đứng trước H đẩy được H₂ ra khỏi axit HCl/H₂SO₄ loãng.'
  }
];

const STUDY_QUICK_QUIZZES = [
  {
    grade: '8',
    subject: 'Toán học',
    q: 'Khai triển hằng đẳng thức (x - 3)² bằng biểu thức nào sau đây?',
    options: ['x² - 9', 'x² - 6x + 9', 'x² + 6x + 9', 'x² - 3x + 9'],
    answer: 1,
    explain: 'Áp dụng (A - B)² = A² - 2AB + B² với A = x, B = 3 ta được x² - 2·x·3 + 3² = x² - 6x + 9.'
  },
  {
    grade: '9',
    subject: 'Toán học',
    q: 'Với phương trình bậc hai x² - 5x + 6 = 0, theo định lý Viète tổng hai nghiệm x₁ + x₂ bằng bao nhiêu?',
    options: ['-5', '6', '5', '-6'],
    answer: 2,
    explain: 'Ta có a = 1, b = -5, c = 6 (Δ = 1 > 0). Theo Viète: x₁ + x₂ = -b/a = -(-5)/1 = 5.'
  },
  {
    grade: '7',
    subject: 'KHTN',
    q: 'Một người đi xe đạp với tốc độ 18 km/h. Đổi sang đơn vị m/s kết quả là bao nhiêu?',
    options: ['5 m/s', '6 m/s', '10 m/s', '64,8 m/s'],
    answer: 0,
    explain: 'Đổi từ km/h sang m/s ta chia cho 3,6: 18 : 3,6 = 5 m/s.'
  },
  {
    grade: '8',
    subject: 'KHTN',
    q: 'Ở điều kiện chuẩn (25°C, 1 bar), 1 mol chất khí bất kỳ chiếm thể tích bằng bao nhiêu lít?',
    options: ['22,4 lít', '24,79 lít', '20,0 lít', '25,0 lít'],
    answer: 1,
    explain: 'Theo chương trình KHTN GDPT 2018, ở điều kiện chuẩn (25°C, 1 bar), 1 mol khí chiếm 24,79 lít.'
  },
  {
    grade: '9',
    subject: 'Tiếng Anh',
    q: 'Chọn đáp án đúng: "If I _____ you, I would talk to the teacher."',
    options: ['am', 'was', 'were', 'will be'],
    answer: 2,
    explain: 'Câu điều kiện loại 2 giả định không có thật ở hiện tại, động từ "to be" luôn chia là "were" cho mọi ngôi.'
  },
  {
    grade: '7',
    subject: 'Tiếng Anh',
    q: 'Chọn liên từ đúng: "_____ it rained heavily, we still went to school on time."',
    options: ['Because', 'Although', 'However', 'Despite'],
    answer: 1,
    explain: 'Sau chỗ trống là một mệnh đề đầy đủ (S + V) mang nghĩa tương phản nên dùng "Although" (Mặc dù).'
  },
  {
    grade: '6',
    subject: 'Ngữ văn',
    q: 'Câu thơ "Ngày ngày mặt trời đi qua trên lăng / Thấy một mặt trời trong lăng rất đỏ" (Viễn Phương) sử dụng biện pháp tu từ nào ở cụm "mặt trời trong lăng"?',
    options: ['So sánh', 'Hoán dụ', 'Ẩn dụ', 'Nói quá'],
    answer: 2,
    explain: '"Mặt trời trong lăng" là ẩn dụ cho Bác Hồ dựa trên nét tương đồng: nguồn sáng dẫn đường và nguồn hơi ấm cho dân tộc.'
  },
  {
    grade: '9',
    subject: 'KHTN',
    q: 'Trong mạch điện nối tiếp gồm R₁ = 4 Ω và R₂ = 6 Ω, đặt hiệu điện thế U = 20 V. Cường độ dòng điện I bằng bao nhiêu?',
    options: ['1 A', '2 A', '4 A', '5 A'],
    answer: 1,
    explain: 'Điện trở tương đương R_tđ = R₁ + R₂ = 4 + 6 = 10 Ω. Theo định luật Ohm: I = U / R_tđ = 20 / 10 = 2 A.'
  },
  {
    grade: '6',
    subject: 'Toán học',
    q: 'Kết quả của phép tính bỏ ngoặc: 15 - (15 - 27) bằng bao nhiêu?',
    options: ['-27', '27', '3', '-3'],
    answer: 1,
    explain: 'Trước ngoặc có dấu "-" nên đổi dấu bên trong: 15 - 15 + 27 = 27.'
  },
  {
    grade: '8',
    subject: 'Tiếng Anh',
    q: 'Chọn đáp án đúng: "She has lived in this city _____ 2020."',
    options: ['for', 'in', 'since', 'at'],
    answer: 2,
    explain: 'Thì Hiện tại hoàn thành: dùng "since" trước mốc thời gian (2020), dùng "for" trước khoảng thời gian (5 years).'
  }
];

const StudyHub = {
  state: {
    grade: 'all',
    subject: 'all',
    search: '',
    quizIdx: 0,
    quizAnswered: false
  },

  init() {
    this.bindEvents();
    this.renderCards();
    this.renderQuiz();
  },

  syncGrade(grade) {
    // Giữ hiển thị tất cả hoặc khớp lớp nếu cần; mặc định để "all" cho kho kiến thức đầy đủ sinh động
    this.renderCards();
  },

  bindEvents() {
    document.querySelectorAll('.study-grade-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.study-grade-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.grade = btn.getAttribute('data-study-grade') || 'all';
        this.renderCards();
      });
    });

    document.querySelectorAll('.study-subject-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.study-subject-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.subject = btn.getAttribute('data-study-subject') || 'all';
        this.renderCards();
      });
    });

    const searchInput = document.getElementById('study-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.state.search = searchInput.value.trim().toLowerCase();
        this.renderCards();
      });
    }

    const nextQuizBtn = document.getElementById('btn-study-next-quiz');
    if (nextQuizBtn) {
      nextQuizBtn.addEventListener('click', () => {
        this.state.quizIdx = (this.state.quizIdx + 1) % STUDY_QUICK_QUIZZES.length;
        this.state.quizAnswered = false;
        this.renderQuiz();
      });
    }
  },

  renderCards() {
    const grid = document.getElementById('study-cards-grid');
    const countEl = document.getElementById('study-cards-count');
    if (!grid) return;

    const { grade, subject, search } = this.state;
    const filtered = STUDY_KNOWLEDGE_CARDS.filter(card => {
      if (grade !== 'all' && card.grade !== grade) return false;
      if (subject !== 'all' && card.subject !== subject) return false;
      if (search) {
        const hay = [
          card.title,
          card.summary,
          card.tip,
          card.subjectLabel,
          `lớp ${card.grade}`,
          ...card.formulas.map(f => `${f.name} ${f.expr}`)
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });

    if (countEl) {
      countEl.textContent = `Hiển thị ${filtered.length}/${STUDY_KNOWLEDGE_CARDS.length} chuyên đề nền tảng`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="study-empty-state">Không tìm thấy chuyên đề phù hợp với từ khóa "<strong>${this.escape(search)}</strong>". Hãy thử tìm "Pytago", "hằng đẳng thức", "Ohm", "Wish" hoặc "ẩn dụ".</div>`;
      return;
    }

    grid.innerHTML = filtered
      .map(card => {
        const formulaRows = card.formulas
          .map(
            f => `
            <div class="study-formula-item">
              <span class="sf-name">${this.escape(f.name)}</span>
              <code class="sf-expr">${this.escape(f.expr)}</code>
            </div>`
          )
          .join('');

        return `
          <article class="study-card subject-${card.subject}">
            <div class="study-card-top">
              <div class="study-badges">
                <span class="study-grade-tag">Lớp ${card.grade}</span>
                <span class="study-subject-tag tag-${card.subject}">${card.icon} ${this.escape(card.subjectLabel)}</span>
              </div>
            </div>
            <h3 class="study-card-title">${this.escape(card.title)}</h3>
            <p class="study-card-summary">${this.escape(card.summary)}</p>
            <div class="study-formulas-list">
              ${formulaRows}
            </div>
            <div class="study-tip-box">
              <strong>💡 Mẹo ghi nhớ:</strong> ${this.escape(card.tip)}
            </div>
          </article>
        `;
      })
      .join('');
  },

  renderQuiz() {
    const qText = document.getElementById('study-quiz-question');
    const qMeta = document.getElementById('study-quiz-meta');
    const qOptions = document.getElementById('study-quiz-options');
    const qFeedback = document.getElementById('study-quiz-feedback');
    if (!qText || !qOptions) return;

    const item = STUDY_QUICK_QUIZZES[this.state.quizIdx];
    if (qMeta) qMeta.textContent = `Lớp ${item.grade} • ${item.subject} • Câu ${this.state.quizIdx + 1}/${STUDY_QUICK_QUIZZES.length}`;
    qText.textContent = item.q;
    if (qFeedback) {
      qFeedback.className = 'study-quiz-feedback hidden';
      qFeedback.textContent = '';
    }

    const letters = ['A', 'B', 'C', 'D'];
    qOptions.innerHTML = item.options
      .map(
        (opt, idx) => `
        <button type="button" class="study-quiz-opt" data-opt-idx="${idx}">
          <span class="sq-letter">${letters[idx]}</span>
          <span>${this.escape(opt)}</span>
        </button>`
      )
      .join('');

    qOptions.querySelectorAll('.study-quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.state.quizAnswered) return;
        this.state.quizAnswered = true;
        const picked = Number(btn.getAttribute('data-opt-idx'));
        const isCorrect = picked === item.answer;

        qOptions.querySelectorAll('.study-quiz-opt').forEach((b, i) => {
          if (i === item.answer) b.classList.add('correct');
          else if (i === picked) b.classList.add('wrong');
          b.disabled = true;
        });

        if (qFeedback) {
          qFeedback.className = `study-quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`;
          qFeedback.innerHTML = `<strong>${isCorrect ? '✅ Chính xác!' : '📘 Chưa đúng — Đáp án đúng là ' + letters[item.answer] + ':'}</strong> ${this.escape(item.explain)}`;
        }
      });
    });
  },

  escape(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};

window.StudyHub = StudyHub;
document.addEventListener('DOMContentLoaded', () => StudyHub.init());
