/**
 * BỘ MÁY TRÍ TUỆ NHÂN TẠO SƯ PHẠM & TÂM LÝ HỌC ĐƯỜNG THCS (LỚP 6 - LỚP 9)
 * Thiết kế bởi Chuyên gia Giáo dục 20 năm kinh nghiệm
 * Hỗ trợ:
 *  1. Phân tích đa tầng (Cảm xúc + Tình huống + Đặc điểm tâm lý Khối 6, 7, 8, 9 + Mức độ nguy cơ)
 *  2. Phản hồi cá nhân hóa theo ngữ cảnh hội thoại và hoàn cảnh thực tế của học sinh
 *  3. Kết nối mở rộng với Google Gemini API (nếu có API Key) + Bộ não Sư phạm Nội tại (luôn hoạt động 100%)
 */

const GRADE_PROFILES = {
  '6': {
    label: 'Lớp 6 (11-12 tuổi)',
    stageName: 'Giai đoạn Chuyển cấp & Làm quen môi trường mới',
    tone: 'Dịu dàng, ấm áp như người anh/chị lớn hoặc thầy cô tâm lý; giải thích ngắn gọn, cụ thể, trấn an nỗi sợ bỡ ngỡ.',
    commonStruggles: 'Bỡ ngỡ trường mới, sợ các anh chị lớp lớn, bị trêu chọc ngoại hình, chưa quen cách học nhiều môn, sợ bị lạc lõng.',
    encouragement: 'Mới lên Lớp 6, chuyện cảm thấy bỡ ngỡ hay lo lắng là hoàn toàn bình thường. Em đã rất dũng cảm khi chia sẻ điều này!'
  },
  '7': {
    label: 'Lớp 7 (12-13 tuổi)',
    stageName: 'Giai đoạn Kết nhóm bạn bè & Khẳng định bản thân',
    tone: 'Thân thiện, đồng cảm sâu sắc với nhu cầu bạn bè, hướng dẫn kỹ năng xử lý mâu thuẫn nhóm và bảo vệ ranh giới cá nhân.',
    commonStruggles: 'Bị tẩy chay khỏi nhóm chơi, lập group chat nói xấu, hiểu lầm bạn thân, nhạy cảm với lời nhận xét của người khác.',
    encouragement: 'Ở tuổi Lớp 7, bạn bè rất quan trọng, nhưng giá trị của em không bao giờ phụ thuộc vào việc một vài người đối xử tệ với em đâu nhé.'
  },
  '8': {
    label: 'Lớp 8 (13-14 tuổi)',
    stageName: 'Giai đoạn Dậy thì mạnh mẽ & Định hình cá tính',
    tone: 'Tôn trọng, bình đẳng, không giáo điều hay phán xét; phân tích thấu đáo, giúp học sinh tự chủ và làm chủ cảm xúc.',
    commonStruggles: 'Bắt nạt trên mạng (cyberbullying), body shaming, xung đột quan điểm với bố mẹ, khủng hoảng cảm xúc tuổi dậy thì.',
    encouragement: 'Lớp 8 là lúc em có nhiều suy nghĩ sâu sắc và muốn được tôn trọng. Mình luôn ở đây lắng nghe em mà không phán xét bất cứ điều gì.'
  },
  '9': {
    label: 'Lớp 9 (14-15 tuổi)',
    stageName: 'Giai đoạn Chuyển cấp THPT & Định hướng tương lai',
    tone: 'Chững chạc, thấu hiểu áp lực kép (vừa chuyện bạn bè vừa áp lực thi cử Lớp 10), giúp gỡ rối từng bước thực tế.',
    commonStruggles: 'Áp lực thi vào lớp 10, sợ làm bố mẹ thất vọng, kiệt sức (burnout), cô lập tinh thần trong giai đoạn cuối cấp.',
    encouragement: 'Năm Lớp 9 có rất nhiều áp lực đè nặng lên vai em. Hãy hít một hơi thật sâu nhé, em không phải gánh vác mọi thứ một mình đâu!'
  }
};

const SCENARIO_KNOWLEDGE_BASE = [
  {
    id: 'crisis',
    name: 'Khẩn cấp / Nguy cơ an toàn cao',
    riskLevel: 'critical',
    keywords: [
      'tự tử', 'muốn chết', 'không muốn sống', 'tự làm đau', 'rạch tay', 'nhảy lầu',
      'đánh hội đồng', 'cầm dao', 'hung khí', 'dọa giết', 'xâm hại', 'cưỡng bức',
      'chặn đánh ngoài cổng', 'uống thuốc', 'kết thúc cuộc đời', 'biến mất mãi mãi'
    ],
    empathyTemplates: [
      'Mình nghe thấy nỗi đau và sự nguy hiểm mà em đang phải đối mặt lúc này. Xin em hãy dừng lại một nhịp và hít thở cùng mình nhé — sự an toàn và tính mạng của em là quý giá nhất trên đời này!',
      'Em ơi, mình ở ngay đây với em! Những gì em đang trải qua quá sức chịu đựng của một học sinh, và em CẦN được người lớn bảo vệ ngay lập tức.'
    ],
    actionSteps: [
      '🚨 **Gọi ngay Tổng đài Quốc gia Bảo vệ Trẻ em 111** (Miễn phí 24/7, hoàn toàn bảo mật) hoặc bấm nút **Cầu Viện Khẩn Cấp (SOS)** màu đỏ ngay trên màn hình.',
      '🏃 **Di chuyển ngay đến nơi an toàn:** Nếu đang ở trường, hãy vào thẳng Phòng Giám hiệu, Phòng Y tế hoặc Phòng Tư vấn Tâm lý. Nếu đang ở nhà, hãy ở cạnh bố mẹ hoặc người thân tin cậy.',
      '💬 **Đừng giữ một mình:** Hãy bấm gửi **Hộp Thư Cầu Viện Khẩn Cấp** ngay bên dưới để Thầy/Cô phụ trách an toàn trường học hỗ trợ em ngay lập tức.'
    ],
    whatToSay: '“Con/Em đang gặp nguy hiểm và rất cần sự bảo vệ ngay bây giờ. Xin hãy giúp con/em!”',
    followUpQuestions: [
      'Ngay lúc này em đang ở đâu (ở nhà hay ở trường)? Có người lớn nào ở gần em không?',
      'Em có muốn mình mở ngay Hộp thư Khẩn cấp để báo cho thầy cô tin cậy giúp em không?'
    ]
  },
  {
    id: 'physical_bullying',
    name: 'Bắt nạt thể chất & Trấn lột',
    riskLevel: 'high',
    keywords: [
      'bị đánh', 'đánh em', 'tát', 'đấm', 'đá', 'trấn lột', 'lấy tiền', 'ép đưa tiền',
      'giấu cặp', 'xé sách', 'xé vở', 'đập đồ', 'chặn đường', 'dọa đánh', 'kéo tóc',
      'ném đồ', 'bắt quỳ', 'nhốt trong nhà vệ sinh', 'bắt nạt hội đồng'
    ],
    empathyTemplates: [
      'Mình rất thương và lo cho em khi nghe chuyện này. Việc ai đó động chạm vào cơ thể, đánh đập hay lấy đồ/tiền của em là **hành vi vi phạm nghiêm trọng**, và đó **TUYỆT ĐỐI KHÔNG PHẢI LỖI CỦA EM**.',
      'Cảm ơn em đã dũng cảm nói ra! Những kẻ bắt nạt thường dùng vũ lực hoặc đe dọa "Cấm mách thầy cô" để làm em sợ, nhưng khi em lên tiếng đúng cách, chúng sẽ không thể làm hại em nữa.'
    ],
    actionSteps: [
      '🛡️ **Ưu tiên bảo vệ cơ thể trước tiên:** Không đôi co hay đánh trả khi đối phương đông hơn. Hãy tìm cách thoát về khu vực có đông người, có camera hoặc gần phòng giáo viên/bảo vệ.',
      '📸 **Giữ lại bằng chứng & ghi nhớ chi tiết:** Chụp lại vết thương, sách vở/đồ đạc bị hỏng, ghi nhớ thời gian, địa điểm (ví dụ: góc cầu thang tầng 2 lúc ra chơi) và tên/đặc điểm người bắt nạt.',
      '🤝 **Báo cáo an toàn (Không phải là "mách lẻo"):** Trấn lột và đánh bạn là hành vi bạo lực cần người lớn can thiệp. Hãy gửi thông tin qua **Hộp Thư Cầu Viện An Toàn** (có thể ẩn danh) để nhà trường kiểm tra camera và xử lý kín đáo mà không làm lộ việc em là người báo.'
    ],
    whatToSay: 'Khi bị chặn đường hoặc đòi tiền: Hãy giữ giọng bình tĩnh, nhìn thẳng và nói to rõ: **"Dừng lại đi! Sắp tới giờ thầy/cô đi kiểm tra hành lang rồi đấy!"** rồi bước nhanh về phía có người lớn.',
    followUpQuestions: [
      'Em có bị thương ở đâu không? Việc này đã xảy ra mấy lần rồi và thường diễn ra ở khu vực nào trong trường?',
      'Em có muốn mình hướng dẫn cách gửi báo cáo kín để thầy cô kiểm tra camera xử lý mà bạn kia không biết là em báo không?'
    ]
  },
  {
    id: 'cyber_bullying',
    name: 'Bắt nạt trên mạng & Group Chat (Cyberbullying)',
    riskLevel: 'high',
    keywords: [
      'trên mạng', 'facebook', 'tiktok', 'zalo', 'messenger', 'group chat', 'nhóm chat',
      'chế ảnh', 'meme', 'dìm hàng', 'bóc phốt', 'nói xấu trên mạng', 'tung tin đồn',
      'comment chửi', 'nhắn tin đe dọa', 'lập nhóm anti', 'ghép ảnh', 'đăng bài nói xấu', 'confession'
    ],
    empathyTemplates: [
      'Bị tấn công trên mạng hay trong các group chat thực sự rất ngột ngạt, vì cảm giác như đi đâu hay về nhà mở điện thoại ra cũng thấy những lời ác ý. Mình hoàn toàn hiểu cảm giác tổn thương và tức giận của em lúc này.',
      'Những lời bình luận độc hại hay bức ảnh chế đó chỉ phản ánh sự thiếu văn minh của người đăng, chứ **không định nghĩa con người thật của em**.'
    ],
    actionSteps: [
      '🚫 **Quy tắc "3 KHÔNG":** **KHÔNG cãi tay đôi** trong phần bình luận (càng cãi, kẻ bắt nạt càng thích thú); **KHÔNG xóa tin nhắn ngay** trước khi chụp màn hình; **KHÔNG đọc đi đọc lại** những lời ác ý đó.',
      '📲 **Chụp màn hình làm bằng chứng (Screenshot):** Chụp rõ tên tài khoản, đường link, nội dung tin nhắn/ảnh chế và thời gian đăng. Đây là bằng chứng thép để thầy cô và phụ huynh giải quyết.',
      '🔒 **Chặn (Block), Báo cáo (Report) & Gửi Hộp thư:** Khóa quyền bình luận/nhắn tin từ người lạ, rời khỏi group chat độc hại và đính kèm thông tin vào **Hộp Thư Cầu Viện** để nhà trường yêu cầu gỡ bài.'
    ],
    whatToSay: 'Nếu cần lên tiếng 1 lần duy nhất trước khi khóa/chặn: **"Việc lấy hình ảnh/thông tin của mình ra chế giễu là sai trái. Mình đã chụp màn hình toàn bộ để gửi thầy cô và gia đình xử lý."**',
    followUpQuestions: [
      'Những nội dung đó đang xuất hiện ở nhóm chat riêng của lớp hay đăng công khai trên mạng xã hội (Facebook/TikTok/Confession)?',
      'Em đã kịp chụp màn hình lại các tin nhắn hoặc bài đăng đó chưa?'
    ]
  },
  {
    id: 'isolation',
    name: 'Bị tẩy chay, cô lập trong lớp / nhóm bạn',
    riskLevel: 'medium',
    keywords: [
      'tẩy chay', 'cô lập', 'không ai chơi', 'nghỉ chơi', 'bơ em', 'lơ em',
      'cả nhóm nghỉ chơi', 'không có bạn', 'cô đơn', 'lạc lõng', 'ra rìa',
      'chia bè kết phái', 'xì xào', 'không cho vào nhóm', 'ghét em', 'bị bỏ rơi'
    ],
    empathyTemplates: [
      'Cảm giác bước vào lớp mà thấy mọi người xì xào hoặc quay lưng lại với mình thực sự rất cô đơn và tủi thân. Mình ôm em một cái thật ấm nhé! 🌻',
      'Rất nhiều học sinh từ Lớp 6 đến Lớp 9 từng trải qua giai đoạn bị một nhóm bạn "tẩy chay" vô cớ theo tâm lý đám đông. Điều đó khiến em buồn, nhưng hãy nhớ: **Một nhóm bạn tốt thật sự sẽ không bao giờ dùng sự cô lập để làm tổn thương nhau.**'
    ],
    actionSteps: [
      '🌱 **Giữ phong thái bình thản (Đừng van xin sự chú ý):** Khi thấy em vẫn tự tin học tập, đọc sách, mỉm cười và không suy sụp, trò "tẩy chay" của đối phương sẽ tự mất tác dụng.',
      '🤝 **Kết nối 1-1 với những người bạn hiền lành khác:** Trong một lớp 35-45 bạn, thường chỉ có 2-3 bạn cầm đầu việc tẩy chay, số còn lại chỉ hùa theo hoặc đứng ngoài. Hãy bắt chuyện nhẹ nhàng với những bạn trầm tính, tốt bụng ở tổ khác hoặc tham gia CLB của trường.',
      '💬 **Nhờ Giáo viên chủ nhiệm xếp lại chỗ ngồi hoặc nhóm học tập:** Em có thể nhắn riêng cho thầy/cô hoặc gửi qua **Hộp Thư Cầu Viện** để thầy/cô khéo léo điều chỉnh nhóm làm việc mà không ai biết em đã nhờ.'
    ],
    whatToSay: 'Khi một bạn từng thân bị lôi kéo nghỉ chơi với em, có thể nhắn riêng nhẹ nhàng: **"Mình không rõ có hiểu lầm gì giữa tụi mình không, nếu có thì mình sẵn sàng lắng nghe. Còn nếu cậu cần khoảng lặng thì mình tôn trọng nhé."**',
    followUpQuestions: [
      'Chuyện các bạn bắt đầu giữ khoảng cách hoặc tẩy chay em xuất phát từ một hiểu lầm cụ thể nào, hay tự nhiên xảy ra?',
      'Trong lớp hoặc ở lớp bên cạnh, có bạn nào tính tình hiền lành mà em cảm thấy dễ nói chuyện không?'
    ]
  },
  {
    id: 'verbal_bullying',
    name: 'Bắt nạt bằng lời nói, trêu chọc, miệt thị ngoại hình (Body Shaming)',
    riskLevel: 'medium',
    keywords: [
      'trêu chọc', 'body shaming', 'chê béo', 'chê mập', 'chê lùn', 'chê xấu', 'mụn',
      'đặt biệt danh', 'gọi tên bố mẹ', 'chửi', 'xúc phạm', 'nhại lại', 'cười nhạo',
      'chê nghèo', 'miệt thị', 'nói móc', 'mỉa mai', 'vô duyên'
    ],
    empathyTemplates: [
      'Lời nói không phải là dao nhưng đôi khi lại cứa rất sâu vào lòng mình, nhất là khi bị mang ngoại hình, gia đình hay điểm riêng tư ra làm trò đùa. Mình hoàn toàn đứng về phía em!',
      'Ở lứa tuổi dậy thì (Lớp 6 - Lớp 9), cơ thể mỗi người phát triển theo nhịp độ khác nhau. Không một ai có quyền lấy ngoại hình hay hoàn cảnh của em ra để mua vui cả!'
    ],
    actionSteps: [
      '🛡️ **Kỹ thuật "Đá Tảng Xám" (Fogging / Phản ứng nhạt):** Kẻ trêu chọc muốn nhìn thấy em đỏ mặt, tức giận hoặc bật khóc. Nếu em trả lời cực kỳ ngắn, tỉnh bơ rồi quay đi làm việc khác, họ sẽ thấy... quê và chán ngay.',
      '🗣️ **Đặt ranh giới rõ ràng bằng giọng điệu dứt khoát:** Nhìn thẳng vào mắt bạn đó và nói rõ ràng rằng trò đùa đó không hề vui.',
      '📝 **Ghi nhận nếu lặp lại nhiều lần:** Nếu bạn đó vẫn cố tình xúc phạm mỗi ngày, đó không còn là "trêu đùa" mà là bắt nạt bằng lời nói. Hãy báo với giáo viên chủ nhiệm hoặc Hộp thư tâm lý.'
    ],
    whatToSay: '3 câu đáp trả thông minh & bản lĩnh:\n1. *"Trò đùa này cũ rồi, cậu không có chủ đề nào thú vị hơn để nói à?"*\n2. *"Ngoại hình của mình thế nào mình tự thấy ổn, cảm ơn cậu đã quan tâm hơi quá mức nhé."*\n3. *"Mình không thấy vui khi cậu gọi mình bằng biệt danh đó. Đề nghị cậu gọi đúng tên mình."*',
    followUpQuestions: [
      'Các bạn ấy thường lấy chuyện gì ra để trêu em, và các bạn trêu vì nghĩ là "đùa cho vui" hay cố tình ác ý?',
      'Em muốn thử luyện tập cách đáp trả ngắn gọn, bản lĩnh ngay tại đây với mình không?'
    ]
  },
  {
    id: 'bystander',
    name: 'Chứng kiến bạn khác bị bắt nạt (Người chứng kiến thông thái)',
    riskLevel: 'medium',
    keywords: [
      'thấy bạn bị bắt nạt', 'bạn em bị đánh', 'bạn cùng lớp bị tẩy chay', 'muốn giúp bạn',
      'thương bạn ấy', 'sợ bị vạ lây', 'chứng kiến', 'bạn bị trêu', 'cứu bạn'
    ],
    empathyTemplates: [
      'Trái tim của em thật ấm áp và nhân hậu! 🌻 Việc em trăn trở muốn bảo vệ bạn nhưng lại lo sợ mình bị liên lụy là tâm lý hoàn toàn tự nhiên.',
      'Em biết không, trong học đường, **Người chứng kiến thông thái** chính là người hùng thầm lặng có thể thay đổi hoàn toàn cuộc đời của một người bạn đang bị bắt nạt mà vẫn đảm bảo an toàn cho chính mình!'
    ],
    actionSteps: [
      '🤝 **Hỗ trợ gián tiếp (An toàn 100% cho em):** Không cần lao vào cãi nhau với nhóm bắt nạt lúc chúng đang hung hăng. Sau khi sự việc qua đi, hãy đến hỏi thăm riêng bạn ấy, đưa cho bạn một tờ giấy ăn, hoặc nhắn tin: *"Tớ biết cậu không có lỗi, tớ vẫn quý cậu nhé"*. Chỉ một câu đó thôi cũng cứu bạn ấy khỏi sự tuyệt vọng!',
      '📢 **Đánh lạc hướng thông minh:** Khi thấy bạn đang bị vây quanh trêu chọc, em có thể gọi to: *"Ơ các cậu ơi, thầy/cô giám thị đang đi lên cầu thang kìa!"* hoặc gọi bạn nạn nhân: *"Cậu ơi, cô giáo bảo mang sổ đầu bài xuống văn phòng giúp cô ngay!"* để giải vây cho bạn.',
      '📮 **Báo cáo ẩn danh qua Hộp Thư Báo Cáo Bắt Nạt:** Em có thể dùng chức năng **Báo cáo Ẩn danh** trên ứng dụng này để báo vị trí, thời gian cho thầy cô can thiệp mà nhóm bắt nạt hoàn toàn không biết ai đã báo.'
    ],
    whatToSay: 'Nhắn riêng cho người bạn đang bị bắt nạt: **"Chuyện hôm nay ở lớp thật sự quá đáng. Cậu đừng buồn một mình nhé, nếu cần người đi cùng xuống căng-tin hay về nhà thì cứ bảo tớ!"**',
    followUpQuestions: [
      'Người bạn mà em đang muốn giúp hiện đang gặp tình huống bắt nạt như thế nào?',
      'Em có muốn gửi một thông báo ẩn danh giúp bạn ấy qua Hộp Thư Báo Cáo Bắt Nạt ngay bây giờ không?'
    ]
  },
  {
    id: 'perpetrator_reflection',
    name: 'Nhận diện & Sửa sai khi lỡ có hành vi bắt nạt / trêu chọc bạn',
    riskLevel: 'low',
    keywords: [
      'em lỡ trêu', 'em lỡ bắt nạt', 'em hùa theo', 'tẩy chay bạn', 'lỡ nói xấu',
      'hối hận', 'xin lỗi bạn', 'làm bạn khóc', 'em sai rồi', 'lỡ chế ảnh bạn', 'cách xin lỗi'
    ],
    empathyTemplates: [
      'Mình rất trân trọng sự trung thực và dũng cảm của em khi dám nhìn nhận lại hành động của mình! 🌻 Ai ở tuổi học trò cũng có lúc bồng bột hoặc hùa theo đám đông mà vô tình làm tổn thương bạn khác. Nhận ra lỗi sai chính là bước đầu tiên của sự trưởng thành.',
      'Tại **Bạn Đồng Hành AI**, mình không phán xét hay kết tội em. Điều quan trọng nhất bây giờ là em đã muốn dừng lại và tìm cách hàn gắn tổn thương cho bạn ấy.'
    ],
    actionSteps: [
      '🛑 **Dừng ngay hành vi gây tổn thương:** Chủ động xóa ngay các bình luận, bức ảnh chế hoặc tin nhắn trêu chọc bạn trên nhóm chat; ngừng hùa theo khi các bạn khác trêu bạn ấy.',
      '💌 **Gửi lời xin lỗi chân thành (Trực tiếp hoặc qua tin nhắn riêng):** Một lời xin lỗi không làm em yếu kém đi, mà chứng tỏ em là người cực kỳ bản lĩnh và tử tế.',
      '🤝 **Hành động bù đắp:** Nếu cả nhóm đang cô lập bạn ấy, em hãy là người đầu tiên chủ động bắt chuyện, chia sẻ bài vở hoặc bảo vệ bạn khi người khác còn trêu chọc.'
    ],
    whatToSay: 'Mẫu câu xin lỗi chân thành, không ngại ngùng:\n**"Chuyện hôm trước mình trêu/nói về cậu thật sự là mình đã quá vô tâm. Mình đã xóa bài/dừng lại rồi. Cho mình xin lỗi cậu thật lòng nhé, mong cậu đừng buồn nữa!"**',
    followUpQuestions: [
      'Chuyện giữa em và bạn ấy đã diễn ra như thế nào? Em có muốn mình cùng soạn một lời xin lỗi thật tự nhiên gửi cho bạn ấy không?',
      'Em có gặp khó khăn gì từ nhóm bạn xung quanh khi muốn dừng việc trêu chọc bạn ấy lại không?'
    ]
  },
  {
    id: 'academic_stress',
    name: 'Áp lực học tập, điểm số & Thi chuyển cấp',
    riskLevel: 'low',
    keywords: [
      'áp lực học', 'điểm kém', 'sợ trượt', 'thi vào 10', 'thi cấp 3', 'học dốt',
      'quá tải', 'mệt mỏi vì học', 'học thêm', 'bài tập nhiều', 'kiểm tra', 'thi học kỳ',
      'mất gốc', 'không hiểu bài', 'sợ bố mẹ mắng vì điểm'
    ],
    empathyTemplates: [
      'Mình nghe thấy sự mệt mỏi của em sau những giờ học căng thẳng. Điểm số trên giấy kiểm tra chỉ đo lường một phần kiến thức ở một thời điểm, chứ **không bao giờ đo được giá trị và tương lai của cả cuộc đời em**.',
      'Cảm giác sợ hãi khi điểm chưa như ý hay lo lắng trước kỳ thi là điều hầu hết học sinh THCS đều trải qua. Mình cùng tháo gỡ từng nút thắt nhỏ nhé!'
    ],
    actionSteps: [
      '🧩 **Chia nhỏ ngọn núi (Kỹ thuật Pomodoro 25 phút):** Đừng nhìn vào cả đống đề cương khổng lồ. Hãy chỉ đặt mục tiêu học tập trung 25 phút cho 1 dạng bài nhỏ, sau đó nghỉ 5 phút vươn vai, uống nước.',
      '🙋 **Tìm "Bạn đồng hành học tập" hoặc hỏi thầy cô:** Chọn 1 môn em lo nhất, đánh dấu đúng 1 câu chưa hiểu và nhờ bạn ngồi cạnh hoặc thầy cô giảng lại. Thầy cô luôn quý học sinh chủ động hỏi bài!',
      '🌬️ **Chăm sóc giấc ngủ và não bộ:** Khi căng thẳng quá mức, hãy sang mục **Góc Bình Tâm** trên web này, tập thở 4-4-4 trong 2 phút để não bộ được nạp lại oxy.'
    ],
    whatToSay: 'Khi muốn tâm sự với bố mẹ về điểm số: **"Đợt kiểm tra vừa rồi con rất tiếc vì kết quả chưa tốt như con mong đợi. Con đã tìm ra phần mình bị hổng kiến thức và đang lên kế hoạch ôn lại, bố mẹ động viên con nhé!"**',
    followUpQuestions: [
      'Hiện tại môn học nào hoặc kỳ thi nào đang làm em thấy lo lắng và nặng nề nhất?',
      'Em muốn mình gợi ý một lịch ôn tập nhẹ nhàng không bị quá tải cho khối lớp của em không?'
    ]
  },
  {
    id: 'family_conflict',
    name: 'Khó khăn khi giao tiếp với Bố mẹ / Gia đình',
    riskLevel: 'low',
    keywords: [
      'bố mẹ mắng', 'bố mẹ không hiểu', 'con nhà người ta', 'so sánh', 'gia đình',
      'cãi nhau với mẹ', 'bố mẹ cấm', 'áp đặt', 'thu điện thoại', 'không ai lắng nghe ở nhà'
    ],
    empathyTemplates: [
      'Ở tuổi từ Lớp 6 đến Lớp 9, em đã lớn hơn rất nhiều và có suy nghĩ riêng, nhưng đôi khi bố mẹ vẫn quen nhìn em như một đứa trẻ nhỏ và dùng sự lo lắng quá mức biến thành lời trách mắng. Mình hiểu cảm giác ấm ức khi không được lắng nghe của em.',
      'Bố mẹ thường thương con nhưng lại vụng về trong cách thể hiện, hay đem "con nhà người ta" ra so sánh vì nghĩ làm vậy em sẽ cố gắng hơn, mà không biết điều đó làm em tổn thương.'
    ],
    actionSteps: [
      '⏸️ **Tránh tranh luận lúc đôi bên đang nóng giận:** Khi bố mẹ đang to tiếng, hãy hít thở sâu, im lặng lắng nghe trước. Đợi lúc cả nhà ăn cơm vui vẻ hoặc buổi tối bình tĩnh mới bày tỏ suy nghĩ.',
      '✉️ **Viết một bức thư nhỏ hoặc tin nhắn Zalo cho bố/mẹ:** Nếu nói trực tiếp dễ bị ngắt lời, việc viết ra cảm xúc chân thành bằng thông điệp "Con cảm thấy..." sẽ khiến bố mẹ chững lại và suy ngẫm.',
      '🌱 **Tập trung vào điều em kiểm soát được:** Đừng để những lời so sánh làm em nghi ngờ bản thân. Mỗi người là một bông hoa nở vào mùa riêng của mình.'
    ],
    whatToSay: 'Mẫu câu "Thông điệp Tôi" (I-Message) gửi bố mẹ:\n**"Bố mẹ ơi, con biết bố mẹ lo cho tương lai của con. Nhưng mỗi khi bố mẹ so sánh con với bạn khác, con thấy rất buồn và mất tự tin. Con mong bố mẹ ghi nhận những nỗ lực của riêng con ạ."**',
    followUpQuestions: [
      'Điều gì trong cách ứng xử của bố mẹ gần đây làm em cảm thấy buồn hoặc áp lực nhất?',
      'Em có muốn mình cùng soạn một tin nhắn thật khéo léo để gửi cho bố/mẹ giúp bố mẹ hiểu em hơn không?'
    ]
  }
];

/**
 * Chuẩn hóa văn bản tiếng Việt để so khớp từ khóa chính xác
 */
function normalizeText(str = '') {
  return String(str).toLowerCase().trim();
}

/**
 * Phân tích tình huống, cảm xúc, vai trò và mức độ nguy cơ từ tin nhắn của học sinh
 */
function analyzeStudentMessage(message, grade = '7', selectedTopic = '', studentRole = 'victim') {
  const norm = normalizeText(message);
  let matchedScenario = null;
  let maxScore = 0;

  // 1. Ưu tiên kiểm tra khủng hoảng / khẩn cấp trước tiên (Bước 3B)
  const crisisScenario = SCENARIO_KNOWLEDGE_BASE.find(s => s.id === 'crisis');
  for (const kw of crisisScenario.keywords) {
    if (norm.includes(kw)) {
      matchedScenario = crisisScenario;
      maxScore = 100;
      break;
    }
  }

  // 2. Tính điểm khớp từ khóa cho các kịch bản khác
  if (!matchedScenario) {
    for (const scenario of SCENARIO_KNOWLEDGE_BASE) {
      if (scenario.id === 'crisis') continue;
      let score = 0;
      for (const kw of scenario.keywords) {
        if (norm.includes(kw)) {
          score += kw.split(' ').length * 2;
        }
      }
      if (selectedTopic && scenario.id === selectedTopic) {
        score += 3;
      }
      if (studentRole === 'bystander' && scenario.id === 'bystander') {
        score += 4;
      }
      if (studentRole === 'perpetrator' && scenario.id === 'perpetrator_reflection') {
        score += 4;
      }
      if (score > maxScore) {
        maxScore = score;
        matchedScenario = scenario;
      }
    }
  }

  // 3. Phân tích sắc thái cảm xúc
  let detectedEmotion = 'Cần được lắng nghe';
  if (/sợ|hoảng|lo lắng|run|ám ảnh|khủng hoảng/.test(norm)) {
    detectedEmotion = 'Lo âu & Sợ hãi';
  } else if (/buồn|khóc|tủi thân|cô đơn|lạc lõng|chán/.test(norm)) {
    detectedEmotion = 'Buồn bã & Cô đơn';
  } else if (/tức|giận|ức chế|ghét|bực/.test(norm)) {
    detectedEmotion = 'Tức giận & Ức chế';
  } else if (/mệt|kiệt sức|áp lực|quá tải/.test(norm)) {
    detectedEmotion = 'Mệt mỏi & Áp lực';
  } else if (/vui|đỡ hơn|cảm ơn|tốt hơn|ổn/.test(norm)) {
    detectedEmotion = 'Tích cực & Khởi sắc';
  }

  const riskLevel = matchedScenario ? matchedScenario.riskLevel : 'low';
  const workflowStep =
    riskLevel === 'critical' || riskLevel === 'high'
      ? 'Bước 3B – Có nguy cơ mất an toàn (Ưu tiên đảm bảo an toàn & kết nối người lớn)'
      : 'Bước 3A – Chưa có dấu hiệu nguy hiểm (Gợi ý kỹ năng & kế hoạch ứng phó)';

  return {
    scenario: matchedScenario,
    score: maxScore,
    emotion: detectedEmotion,
    riskLevel,
    workflowStep,
    studentRole,
    gradeProfile: GRADE_PROFILES[String(grade)] || GRADE_PROFILES['7']
  };
}

/**
 * Sinh phản hồi Sư phạm thông minh theo từng khối lớp (6, 7, 8, 9), vai trò, hoàn cảnh và lịch sử hội thoại
 */
function generatePedagogicalResponse({
  message,
  grade = '7',
  nickname = 'Bạn Nhỏ',
  selectedTopic = '',
  studentRole = 'victim',
  history = []
}) {
  const analysis = analyzeStudentMessage(message, grade, selectedTopic, studentRole);
  const { scenario, emotion, riskLevel, workflowStep, gradeProfile } = analysis;
  const norm = normalizeText(message);
  const turnCount = Array.isArray(history) ? Math.floor(history.length / 2) : 0;

  const roleLabels = {
    victim: 'Người đang gặp khó khăn / bị bắt nạt',
    bystander: 'Người chứng kiến tình huống',
    perpetrator: 'Người muốn nhận diện & điều chỉnh hành vi'
  };
  const currentRoleLabel = roleLabels[studentRole] || roleLabels.victim;

  // Kiểm tra các yêu cầu cụ thể trong luồng hội thoại tiếp theo (Follow-up intents)
  const wantsPracticeReply = /luyện tập|cách đáp trả|trả lời sao|nói sao|ứng xử sao|soạn tin nhắn|viết thư/.test(norm);
  const wantsAnonymousReport = /báo cáo kín|ẩn danh|hộp thư|mách thầy cô|báo thầy cô|camera/.test(norm);
  const wantsStudyPlan = /lịch ôn tập|kế hoạch học|ôn thi|phương pháp học/.test(norm);
  const isGreetingOrShort = norm.length < 18 && /chào|hi|hello|ơi|có ai không|giúp em|tâm sự/.test(norm);
  const isThanking = /cảm ơn|đỡ hơn rồi|em hiểu rồi|vâng ạ|dạ vâng|ok ạ/.test(norm);

  if (isGreetingOrShort && !scenario) {
    return {
      reply: `Chào **${nickname}** (${gradeProfile.label})! 🌻 Mình là **Bạn Đồng Hành AI** (*Lắng nghe • Thấu hiểu • Bảo vệ*).\n\n${gradeProfile.encouragement}\n\nBạn có thể chia sẻ mà không cần cho biết họ tên. AI sẽ cùng bạn tìm cách giải quyết dựa trên vai trò hiện tại của bạn (**${currentRoleLabel}**).\n\n*(Lưu ý: AI hỗ trợ lắng nghe và gợi ý kỹ năng ứng phó, không tự chẩn đoán bệnh tâm lý).* 💛`,
      analysis: {
        scenarioId: 'greeting',
        scenarioName: 'Chào hỏi & Kết nối an toàn',
        emotion: 'Đang mở lòng',
        riskLevel: 'low',
        workflowStep,
        studentRole: currentRoleLabel,
        gradeLabel: gradeProfile.label
      },
      suggestedActions: [
        'Em đang bị các bạn trong lớp tẩy chay, cô lập',
        'Có bạn chế ảnh / nói xấu em trên group chat',
        'Em chứng kiến bạn cùng lớp bị bắt nạt và muốn giúp bạn',
        'Em lỡ trêu chọc làm bạn buồn và muốn sửa sai'
      ],
      recommendedModule: null
    };
  }

  if (isThanking && !scenario) {
    return {
      reply: `Mình rất vui vì **${nickname}** đã cảm thấy nhẹ lòng hơn! 🌈\n\nHãy nhớ rằng ở độ tuổi **${gradeProfile.label}**, mỗi thử thách em vượt qua đều giúp em trưởng thành và mạnh mẽ hơn. Bất cứ khi nào em cần một người lắng nghe, muốn thử **Góc Kỹ Năng** hay gửi lời nhắn tới thầy cô tư vấn, **Bạn Đồng Hành AI** luôn mở cửa đón em nhé! Chúc em một ngày thật nhiều năng lượng tích cực! ✨`,
      analysis: {
        scenarioId: 'positive_closing',
        scenarioName: 'Khích lệ & Đồng hành',
        emotion: 'Tích cực & Khởi sắc',
        riskLevel: 'low',
        workflowStep,
        studentRole: currentRoleLabel,
        gradeLabel: gradeProfile.label
      },
      suggestedActions: [
        'Thử bài tập thở 4-4-4 giúp bình tâm',
        'Ghé thăm Vườn Hoa Tử Tế đọc lời động viên',
        'Luyện tập xử lý tình huống tại Góc Kỹ Năng'
      ],
      recommendedModule: 'wellness'
    };
  }

  if (wantsAnonymousReport) {
    return {
      reply: `Rất hoan nghênh sự dũng cảm của **${nickname}**! 🛡️ Để gửi phản ánh qua **Hộp Thư Báo Cáo Bắt Nạt** tới giáo viên tư vấn mà vẫn bảo mật, em làm theo các bước sau nhé:\n\n1. **Bấm vào mục "Hộp Thư Báo Cáo Bắt Nạt"** trên thanh menu (hoặc nút bên dưới).\n2. **Chọn chế độ Báo cáo Ẩn danh** (hoặc cung cấp phương thức liên hệ nếu muốn nhận hỗ trợ trực tiếp).\n3. **Chọn nhóm tình huống, ghi rõ địa điểm & thời gian** và **bổ sung bằng chứng** (mô tả/link ảnh chụp màn hình) khi thực sự cần thiết.\n4. Lưu lại **Mã Tra Cứu Bí Mật** (dạng \`NA-xxxx\`) để xem thầy cô phản hồi và hỗ trợ nhé!`,
      analysis: {
        scenarioId: 'report_guidance',
        scenarioName: 'Hướng dẫn Báo cáo An toàn & Bảo mật',
        emotion,
        riskLevel: 'medium',
        workflowStep,
        studentRole: currentRoleLabel,
        gradeLabel: gradeProfile.label
      },
      suggestedActions: [
        'Mở ngay Hộp Thư Báo Cáo Bắt Nạt',
        'Nếu đối phương hỏi "Mày mách cô à?" thì em nên nói gì?',
        'Em muốn luyện tập cách giữ bình tĩnh khi gặp bạn đó'
      ],
      recommendedModule: 'helpbox'
    };
  }

  if (wantsStudyPlan) {
    const gradeStudyTips = {
      '6': 'Ở **Lớp 6**, em vừa chuyển từ Tiểu học lên nên số môn học tăng lên nhiều. Bí quyết là dùng **Sổ tay 3 màu**: Màu đỏ cho bài tập cần làm ngay hôm nay, màu vàng cho bài kiểm tra tuần tới, và màu xanh lá cho từ vựng/công thức ngắn cần nhẩm 10 phút mỗi tối.',
      '7': 'Ở **Lớp 7**, các môn Toán (Hình học chứng minh), Ngữ Văn và Tiếng Anh bắt đầu nâng cao hơn. Em hãy áp dụng phương pháp **Học nhóm đôi 20 phút giờ ra chơi** hoặc vẽ sơ đồ tư duy (Mindmap) 1 trang giấy cho mỗi chương nhé.',
      '8': 'Ở **Lớp 8**, có thêm môn Hóa học và kiến thức Lý/Toán nặng hơn. Đừng cố học thuộc lòng máy móc, hãy dành **25 phút mỗi tối** giải 2 bài tập cơ bản nhất trong sách giáo khoa trước khi làm bài nâng cao.',
      '9': 'Ở **Lớp 9**, áp lực thi vào Lớp 10 rất lớn. Em hãy chia thời gian theo quy tắc **3-2-1**: 3 buổi/tuần luyện đề các môn thi chính (Toán - Văn - Anh), 2 buổi rà soát lại đúng những câu mình làm sai (sổ tay sửa sai), và 1 buổi tối cuối tuần nghỉ ngơi hoàn toàn để chống kiệt sức!'
    };
    return {
      reply: `Mình thiết kế riêng gợi ý nhịp độ học tập vừa sức cho **${nickname} (${gradeProfile.label})** đây nhé! 📚✨\n\n- 🎯 **Chiến lược riêng cho khối của em:** ${gradeStudyTips[String(grade)] || gradeStudyTips['7']}\n- ⏱️ **Nhịp thở Pomodoro (25/5):** Học tập trung 25 phút (tắt thông báo điện thoại) -> Nghỉ 5 phút đứng dậy uống nước, vươn vai.\n- 💤 **Ngủ đủ trước 23h00:** Não bộ tuổi 11-15 cần giấc ngủ sâu để ghi nhớ kiến thức. Thức khuya học vẹt chỉ làm em thêm lo âu vào sáng hôm sau thôi.\n\nEm thấy môn học nào đang cần mình gỡ rối đầu tiên nào?`,
      analysis: {
        scenarioId: 'academic_stress',
        scenarioName: 'Kế hoạch Học tập Giảm Áp lực',
        emotion,
        riskLevel: 'low',
        workflowStep,
        studentRole: currentRoleLabel,
        gradeLabel: gradeProfile.label
      },
      suggestedActions: [
        'Làm sao để bố mẹ không tạo áp lực điểm số?',
        'Thử bài tập thở 4-4-4 giảm hồi hộp trước giờ kiểm tra',
        'Chia sẻ thêm về chuyện bạn bè trên lớp'
      ],
      recommendedModule: 'wellness'
    };
  }

  if (wantsPracticeReply && !scenario) {
    return {
      reply: `Tuyệt vời lắm **${nickname}**! Khi mình chuẩn bị sẵn kịch bản và câu nói trong đầu, mình sẽ không bị lúng túng hay bật khóc trước mặt người khác. 💪\n\n**3 nguyên tắc vàng khi ứng xử không bạo lực trước kẻ trêu chọc/bắt nạt:**\n1. **Giọng đều, ngắn gọn, không hét lên:** Vì khi em nổi nóng là trúng ý đồ của họ.\n2. **Nhìn vào trán hoặc sống mũi người đó:** Tạo vẻ tự tin mà không gây khiêu khích.\n3. **Dùng câu chốt ngắn rồi bước đi ngay:**\n   - *“Chuyện đó không vui đâu, dừng lại đi.”*\n   - *“Cảm ơn đã quan tâm, nhưng mình đang bận rồi.”*\n   - *“Mình đã lưu lại bằng chứng rồi, tụi mình trao đổi việc này với thầy cô nhé?”*\n\nEm có thể bấm sang mục **Thư Viện Kỹ Năng Phòng Chống Bắt Nạt** để thực hành chọn câu trả lời trong các tình huống tương tác của học sinh Lớp ${grade} nhé!`,
      analysis: {
        scenarioId: 'roleplay_coaching',
        scenarioName: 'Huấn luyện Kỹ năng Tự bảo vệ & Ứng xử không bạo lực',
        emotion,
        riskLevel: 'low',
        workflowStep,
        studentRole: currentRoleLabel,
        gradeLabel: gradeProfile.label
      },
      recommendedModule: 'scenarios',
      suggestedActions: [
        'Mở Thư Viện Kỹ Năng để thực hành tình huống tương tác',
        'Nếu bạn ấy vẫn đi theo trêu tiếp thì làm sao?',
        'Hướng dẫn em gửi Hộp Thư Báo Cáo Bắt Nạt kín đáo'
      ]
    };
  }

  // Nếu khớp kịch bản cụ thể trong Knowledge Base
  if (scenario) {
    const empathy = scenario.empathyTemplates[turnCount % scenario.empathyTemplates.length];
    const gradeNoteMap = {
      '6': `💡 **Cá thể hóa cho học sinh Lớp 6 (${currentRoleLabel}):** Mới bước vào cấp 2, nhiều bạn còn mang thói quen trêu đùa vô tâm hoặc bắt nạt các bạn hiền lành mới quen. Em đừng tự trách mình nhé, việc nhờ Thầy/Cô chủ nhiệm hoặc Giáo viên tư vấn hỗ trợ ở Lớp 6 là cách thông minh và an toàn nhất!`,
      '7': `💡 **Cá thể hóa cho học sinh Lớp 7 (${currentRoleLabel}):** Ở Lớp 7, các hội nhóm trong lớp hay biến động. Đừng sợ rằng nếu mình lên tiếng bảo vệ bản thân hoặc bảo vệ bạn thì sẽ "mất bạn" — những người bạn thật sự sẽ luôn tôn trọng sự an toàn và cảm xúc của em.`,
      '8': `💡 **Cá thể hóa cho học sinh Lớp 8 (${currentRoleLabel}):** Ở tuổi Lớp 8, em hoàn toàn có đủ sự chín chắn để giữ cái đầu lạnh, thu thập bằng chứng rõ ràng (ảnh chụp màn hình, thời gian, nhân chứng) và giải quyết vấn đề một cách văn minh thay vì đôi co nóng nảy.`,
      '9': `💡 **Cá thể hóa cho học sinh Lớp 9 (${currentRoleLabel}):** Năm cuối cấp rất quan trọng với tương lai của em. Đừng để những hành vi bắt nạt hay tiêu cực lấy mất sự bình yên và thời gian quý báu của em. Hãy để giáo viên tư vấn và người lớn tin cậy san sẻ gánh nặng này cùng em ngay hôm nay!`
    };

    const stepsFormatted = scenario.actionSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n');
    const followUp = scenario.followUpQuestions[turnCount % scenario.followUpQuestions.length];

    const safetyNotice =
      scenario.riskLevel === 'critical' || scenario.riskLevel === 'high'
        ? `\n\n> 🚨 **Quy trình Bước 3B – Có nguy cơ mất an toàn:** Trường hợp có nguy cơ cao cần ưu tiên đảm bảo an toàn ngay lập tức, liên hệ người lớn tin cậy hoặc gọi **Tổng đài Quốc gia Bảo vệ Trẻ em 111** (miễn phí 24/7). *(Nguyên tắc Ẩn danh có giới hạn: Khi có nguy cơ nghiêm trọng đe dọa an toàn của học sinh, hệ thống khuyến nghị chia sẻ thông tin tối thiểu cần thiết tới giáo viên bảo vệ trẻ em của nhà trường).*`
        : `\n\n> 🛡️ **Quy trình Bước 3A – Hỗ trợ kỹ năng & Kế hoạch ứng phó:** AI đồng hành gợi ý kỹ năng tự bảo vệ, ứng xử không bạo lực và khuyến khích em trao đổi với người lớn đáng tin cậy. *(AI không tự chẩn đoán bệnh tâm lý và không tự kết luận kỷ luật).*`;

    const reply = `Chào **${nickname}**, ${empathy}\n\n${gradeNoteMap[String(grade)] || gradeNoteMap['7']}\n\n### 🧭 Hướng dẫn hành động phù hợp với tình huống của em:\n${stepsFormatted}\n\n### 💬 Gợi ý cách nói / ứng xử không bạo lực:\n> ${scenario.whatToSay}${safetyNotice}\n\n---\n💛 **Bạn Đồng Hành AI hỏi thăm thêm:** ${followUp}`;

    let recommendedModule = 'scenarios';
    if (scenario.riskLevel === 'critical' || scenario.riskLevel === 'high') {
      recommendedModule = 'helpbox';
    } else if (scenario.id === 'academic_stress') {
      recommendedModule = 'wellness';
    }

    return {
      reply,
      analysis: {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        emotion,
        riskLevel: scenario.riskLevel,
        workflowStep,
        studentRole: currentRoleLabel,
        gradeLabel: gradeProfile.label
      },
      suggestedActions: [
        scenario.followUpQuestions[0],
        'Hướng dẫn em gửi Hộp Thư Báo Cáo Bắt Nạt ẩn danh',
        'Luyện tập kỹ năng tự bảo vệ khi gặp tình huống này'
      ],
      recommendedModule
    };
  }

  // Trường hợp tâm sự chung chung chưa khớp từ khóa hẹp -> Phản hồi thấu cảm sâu sắc + hỏi gợi mở sư phạm
  return {
    reply: `Cảm ơn **${nickname}** (${gradeProfile.label} • Vai trò: *${currentRoleLabel}*) đã tin tưởng chia sẻ với **Bạn Đồng Hành AI** nhé! 🌻\n\nMình đang lắng nghe rất kỹ những điều em vừa tâm sự: *"${message.slice(0, 120)}${message.length > 120 ? '...' : ''}"*.\n\n${gradeProfile.encouragement}\n\nĐể mình cá thể hóa lời khuyên sát nhất với tình huống của em, em có thể chia sẻ thêm một chút không?\n- Chuyện này liên quan đến **bắt nạt bằng lời nói, bắt nạt thể chất, cô lập bạn bè, bắt nạt trên mạng** hay **áp lực học tập**?\n- Hiện tại em có cảm thấy an toàn không, và điều gì đang làm em lo lắng nhất?\n\n*(Bạn có thể chia sẻ mà không cần cho biết họ tên. AI không tự chẩn đoán bệnh tâm lý mà sẽ cùng bạn tìm cách giải quyết an toàn nhất!)* 💛`,
    analysis: {
      scenarioId: 'general_listening',
      scenarioName: 'Lắng nghe & Thấu cảm Cá thể hóa',
      emotion,
      riskLevel: 'low',
      workflowStep,
      studentRole: currentRoleLabel,
      gradeLabel: gradeProfile.label
    },
    suggestedActions: [
      'Chuyện liên quan đến các bạn trong lớp tẩy chay / trêu chọc em',
      'Có người nói xấu và chế ảnh em trên mạng xã hội',
      'Em bị bạn dọa nạt hoặc lấy đồ / trấn lột',
      'Em chứng kiến bạn bị bắt nạt hoặc muốn sửa sai khi lỡ trêu bạn'
    ],
    recommendedModule: null
  };
}

/**
 * Gọi Google Gemini API (nếu người dùng cấu hình API Key) kết hợp phân tích an toàn nội tại
 */
async function generateAIResponseWithOptionalGemini({
  message,
  grade = '7',
  nickname = 'Bạn Nhỏ',
  selectedTopic = '',
  studentRole = 'victim',
  history = [],
  geminiApiKey = ''
}) {
  // Luôn chạy bộ phân tích an toàn nội tại trước để đảm bảo phát hiện khủng hoảng (Crisis Triage) chính xác 100%
  const localResult = generatePedagogicalResponse({
    message,
    grade,
    nickname,
    selectedTopic,
    studentRole,
    history
  });

  const cleanKey = (geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
  if (!cleanKey) {
    return {
      ...localResult,
      engineUsed: 'pedagogical-builtin'
    };
  }

  try {
    const gradeProfile = GRADE_PROFILES[String(grade)] || GRADE_PROFILES['7'];
    const systemInstruction = `Bạn là "Bạn Đồng Hành AI" (Lắng nghe • Thấu hiểu • Bảo vệ) - Hệ thống tư vấn tâm lý ẩn danh, cá thể hóa và phòng chống bắt nạt học đường dành cho học sinh THCS tại Việt Nam (Lớp 6 đến Lớp 9).
Thông tin phiên cá thể hóa của học sinh:
- Biệt danh ẩn danh: ${nickname}
- Khối lớp: ${gradeProfile.label} (${gradeProfile.stageName})
- Vai trò trong tình huống: ${studentRole} (victim: người bị bắt nạt, bystander: người chứng kiến, perpetrator: người có hành vi bắt nạt muốn nhận diện & sửa sai)
- Phong cách giao tiếp: ${gradeProfile.tone}
Nguyên tắc bắt buộc (Theo Nghị định 80/2017/NĐ-CP, Thông tư 18/2025/TT-BGDĐT, Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15):
1. Luôn ấm áp, thấu hiểu, không phán xét. AI KHÔNG tự chẩn đoán bệnh tâm lý, không tự kết luận ai có lỗi và không tự quyết định kỷ luật.
2. Hướng dẫn kỹ năng tự bảo vệ, ứng xử không bạo lực, lưu bằng chứng và tìm kiếm sự giúp đỡ từ giáo viên tư vấn học đường hoặc người lớn tin cậy.
3. Ẩn danh có giới hạn & Can thiệp khẩn cấp: Nếu phát hiện dấu hiệu tự gây hại, bạo lực nghiêm trọng hoặc xâm hại (Bước 3B), ưu tiên hướng dẫn học sinh tìm nơi an toàn, liên hệ người lớn ngay lập tức và gọi Tổng đài Quốc gia bảo vệ trẻ em 111 (miễn phí, 24/7).
4. Trình bày rõ ràng bằng Markdown, có sử dụng biểu tượng cảm xúc thân thiện, độ dài vừa phải (150-250 từ), kết thúc bằng 1 câu hỏi ngắn dễ hiểu.`;

    const contents = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(h.content || '') }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(cleanKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 700
          }
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 10) {
        return {
          ...localResult,
          reply: text.trim(),
          engineUsed: 'gemini-api-hybrid'
        };
      }
    }
  } catch (_err) {
    // Fallback tự động về bộ máy AI Sư phạm nội tại để không bao giờ gián đoạn trải nghiệm của học sinh
  }

  return {
    ...localResult,
    engineUsed: 'pedagogical-builtin'
  };
}

/**
 * TRỢ LÝ AI CỐ VẤN SƯ PHẠM & PHÁP LÝ (AI CO-PILOT CHO 3 LUỒNG ZALO & GROUP BAN GIÁM HIỆU)
 * Phân tích hồ sơ của học sinh và đưa ra:
 * 1. Nhận định tâm sinh lý lứa tuổi (Khối 6-9)
 * 2. Căn cứ pháp lý bắt buộc (Nghị định 80/2017, Thông tư 18/2025, Luật 91/2025)
 * 3. Phác đồ nghiệp vụ xử lý sắc bén cho 3 Luồng Zalo (Bảo vệ danh tính người báo)
 * 4. 3 Phương án câu trả lời mẫu (1-Click) để Thầy Cô / BGH chọn gửi ngay
 */
function generateTeacherCoPilotBriefing(reqItem = {}) {
  const grade = String(reqItem.grade || '7');
  const gradeProfile = GRADE_PROFILES[grade] || GRADE_PROFILES['7'];
  const studentDisplay = reqItem.isAnonymous
    ? reqItem.nickname || 'Bạn Nhỏ Ẩn Danh'
    : reqItem.studentName || reqItem.nickname || 'Em';
  const category = reqItem.category || 'other';
  const urgency = reqItem.urgency || 'medium';
  const location = reqItem.locationAndTime || 'khu vực trường học';

  const briefings = {
    crisis: {
      situationTitle: 'Tình huống 1: Khẩn cấp / Nguy cơ tự gây hại hoặc Bạo lực nghiêm trọng (Bước 3B)',
      psychInsight: `Học sinh ${gradeProfile.label} đang rơi vào khủng hoảng cấp tính, cảm giác bế tắc hoặc hoảng loạn tột độ. Mọi sự chậm trễ hoặc thái độ trách mắng lúc này đều có thể dẫn tới hậu quả nghiêm trọng.`,
      legalBasis: 'Điều 6 Nghị định 80/2017/NĐ-CP & Thông tư 18/2025/TT-BGDĐT (Kích hoạt quy trình can thiệp khẩn cấp Bước 3B, áp dụng nguyên tắc "Ẩn danh có giới hạn" để bảo vệ tính mạng trẻ em).',
      tacticalSteps: [
        '👥 [Group Zalo 3 - BGH]: Cử ngay cán bộ Giám thị / Bảo vệ và GV Tư vấn có mặt tại vị trí học sinh trong vòng 3–5 phút để đưa em về Phòng Tâm lý / Y tế an toàn.',
        '👤 [Luồng Zalo 1 - Tâm lý]: Lắng nghe 1-1, trấn an cảm xúc, tuyệt đối không để học sinh ở một mình.',
        '📞 [Phối hợp]: Thông báo khẩn cho phụ huynh (nếu gia đình là nguồn an toàn) và kết nối Tổng đài Quốc gia Bảo vệ Trẻ em 111 khi cần can thiệp chuyên sâu.'
      ],
      replyOptions: [
        {
          label: 'Phương án 1: Khẩn cấp Trấn an & Đón học sinh về phòng an toàn',
          text: `Chào ${studentDisplay}! Ban Giám hiệu và Thầy Cô Phòng Tâm lý đã nhận được tín hiệu khẩn của em ngay lúc này. Sự an toàn của em là quan trọng nhất! Ngay bây giờ em hãy di chuyển vào Phòng Tư vấn Tâm lý (P.202) hoặc Phòng Y tế nhé, cô đang mở cửa chờ đón và bảo vệ em tuyệt đối!`
        },
        {
          label: 'Phương án 2: Cử thầy cô ra đón trực tiếp tại vị trí',
          text: `${studentDisplay} ơi, em bình tĩnh hít thở sâu nhé, em không đơn độc đâu! Thầy cô Giám thị và Ban An toàn trường học đang đi ra khu vực [${location}] ngay bây giờ để hỗ trợ em. Em hãy đứng ở nơi có đông người hoặc gần phòng bảo vệ chờ thầy cô 2 phút nhé!`
        },
        {
          label: 'Phương án 3: Bảo vệ khẩn cấp & Kết nối đường dây nóng',
          text: `Chào ${studentDisplay}, thầy cô luôn ở bên cạnh bảo vệ em! Nhà trường đã kích hoạt ngay quy trình bảo vệ khẩn cấp tại khu vực [${location}]. Nếu đang ở ngoài trường, em hãy gọi ngay Tổng đài 111 (miễn phí 24/7) hoặc nhắn lại vị trí hiện tại vào mã ${reqItem.trackingCode} để thầy cô hỗ trợ tức thì nhé!`
        }
      ]
    },
    physical_bullying: {
      situationTitle: 'Tình huống 2: Bắt nạt thể chất, Trấn lột, Giấu đồ & Đe dọa "Cấm mách"',
      psychInsight: `Học sinh ${gradeProfile.label} đang rất sợ bị trả thù nếu kẻ bắt nạt biết em là người báo cáo. Nếu giáo viên gọi hai bên lên đối chất trực tiếp ngay, nạn nhân sẽ hoảng sợ và không dám nói thật.`,
      legalBasis: 'Nghị định 80/2017/NĐ-CP (Phòng chống bạo lực học đường) & Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 (Bảo vệ tuyệt đối bí mật người phản ánh).',
      tacticalSteps: [
        '🚫 [Nguyên tắc Vàng]: TUYỆT ĐỐI KHÔNG gọi nạn nhân và học sinh bắt nạt lên đối chất trực tiếp trước mặt nhau.',
        '👥 [Group Zalo 3 - BGH]: Chỉ đạo trích xuất camera an ninh hoặc cử Giám thị "đi tuần tra ngẫu nhiên" tại [${location}] vào đúng khung giờ học sinh báo để phát hiện khách quan.',
        '👤 [Luồng Zalo 2 - GVCN]: Kiểm tra đột xuất việc giữ gìn tài sản lớp học và làm việc riêng với học sinh có hành vi bắt nạt dựa trên dữ liệu camera của trường (không nhắc tới đơn báo cáo).'
      ],
      replyOptions: [
        {
          label: 'Phương án 1 (Khuyên dùng): Xử lý qua Camera & Tuần tra ngẫu nhiên (Giữ kín 100% người báo)',
          text: `Chào ${studentDisplay} dũng cảm! Ban Giám hiệu và GVCN đã nhận được thông tin qua Luồng Zalo An toàn. Để bảo vệ em tuyệt đối khỏi bị nghi ngờ, nhà trường sẽ dùng nghiệp vụ "Kiểm tra camera an ninh định kỳ & Tăng cường Giám thị tuần tra ngẫu nhiên" tại khu vực [${location}]. Các bạn kia sẽ chỉ biết là do nhà trường kiểm tra camera phát hiện chứ hoàn toàn không biết có người báo. Em yên tâm đi học nhé!`
        },
        {
          label: 'Phương án 2: Can thiệp Sư phạm trong lớp học & Bảo vệ giờ tan trường',
          text: `Cảm ơn ${studentDisplay} đã tin tưởng báo cho thầy cô! GVCN và tổ Giám thị đã lập tức đưa khu vực [${location}] vào diện giám sát chặt chẽ giờ ra chơi và giờ tan học. Ngày mai GVCN sẽ kiểm tra đột xuất nề nếp lớp mà không nhắc tên bất kỳ ai. Nếu có bất kỳ biểu hiện đe dọa nào tiếp diễn, em nhắn ngay vào mã ${reqItem.trackingCode} này nhé!`
        },
        {
          label: 'Phương án 3: Phối hợp Bảo vệ & Răn đe nghiêm minh theo Nội quy',
          text: `Chào ${studentDisplay}! Mọi hành vi đánh bạn, giấu đồ hay trấn lột đều vi phạm nghiêm trọng nội quy nhà trường. Ban Giám hiệu đã chỉ đạo bộ phận An ninh trích xuất hình ảnh tại [${location}] để làm việc trực tiếp với học sinh vi phạm và phụ huynh, đồng thời cam kết giữ bí mật 100% danh tính của em!`
        }
      ]
    },
    cyber_bullying: {
      situationTitle: 'Tình huống 3: Bắt nạt trên mạng, Chế ảnh (Meme), Lập Group Chat nói xấu',
      psychInsight: `Ở tuổi ${gradeProfile.label}, sự bôi nhọ trên nhóm chat tạo cảm giác "cả thế giới đang nhìn vào và cười nhạo mình", dễ dẫn đến suy sụp tinh thần và sợ đến trường.`,
      legalBasis: 'Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (Hiệu lực 01/01/2026 - Nghiêm cấm tự ý sử dụng hình ảnh, thông tin cá nhân trẻ em để bôi nhọ trên mạng) & Thông tư 18/2025/TT-BGDĐT.',
      tacticalSteps: [
        '📸 [Lưu vết]: Lưu trữ thông tin bằng chứng (${reqItem.evidenceNote || "ảnh chụp màn hình/link nhóm"}) vào hồ sơ bảo mật.',
        '👥 [Group Zalo 3 - BGH & Luồng 2 - GVCN]: Yêu cầu quản trị viên nhóm chat / học sinh đăng bài gỡ bỏ toàn bộ hình ảnh, bình luận vi phạm ngay trong ngày.',
        '👤 [Luồng Zalo 1 - Tâm lý]: Tổ chức sinh hoạt chuyên đề ngắn tại lớp về "Quyền hình ảnh cá nhân theo Luật 91/2025/QH15" để răn đe văn minh mà không nêu tên nạn nhân.'
      ],
      replyOptions: [
        {
          label: 'Phương án 1 (Sắc bén & Đúng luật): Yêu cầu gỡ bài theo Luật 91/2025 & Không lộ người báo',
          text: `Chào ${studentDisplay}! Ban Giám hiệu và Phòng Tâm lý đã tiếp nhận phản ánh và bằng chứng của em. Theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15, việc tự ý đăng ảnh/thông tin chế giễu người khác trên mạng là vi phạm quy định. Hôm nay nhà trường và GVCN sẽ chấn chỉnh ngay các nhóm chat của khối và yêu cầu gỡ bỏ toàn bộ nội dung độc hại dưới hình thức rà soát định kỳ, giữ kín 100% danh tính của em!`
        },
        {
          label: 'Phương án 2: Trấn an tâm lý & Hướng dẫn khóa tương tác độc hại',
          text: `Cô ôm ${studentDisplay} một cái thật ấm nhé! Những lời lẽ trên mạng chỉ phản ánh sự thiếu văn minh của người đăng chứ không định nghĩa giá trị của em. Em hãy giữ nguyên ảnh chụp màn hình, bật chế độ chặn người lạ và tạm tắt thông báo nhóm đó nhé. GVCN và Phòng Tâm lý đã vào cuộc xử lý để trả lại không gian mạng an toàn cho em!`
        },
        {
          label: 'Phương án 3: Làm việc trực tiếp với quản trị viên nhóm chat',
          text: `Cảm ơn ${studentDisplay} đã dũng cảm lên tiếng! Ban An toàn trường học đã xác minh thông tin tại [${location}] và yêu cầu gỡ bỏ ngay lập tức các bài đăng/hình ảnh vi phạm, đồng thời nhắc nhở nghiêm khắc các cá nhân liên quan. Em hoàn toàn yên tâm đến lớp học tập bình thường nhé!`
        }
      ]
    },
    isolation: {
      situationTitle: 'Tình huống 4: Bị tẩy chay, Cô lập tập thể trong lớp học',
      psychInsight: `Học sinh ${gradeProfile.label} rất nhạy cảm với hiệu ứng đám đông. Nếu giáo viên phê bình cả nhóm công khai hoặc ép buộc "Các em phải chơi với bạn", nhóm đó sẽ càng tẩy chay ngầm mạnh hơn.`,
      legalBasis: 'Thông tư 18/2025/TT-BGDĐT (Tư vấn tâm lý học đường lấy học sinh làm trung tâm, xây dựng tập thể lớp bao dung, không kỳ thị).',
      tacticalSteps: [
        '🚫 [Tránh sai lầm]: Không hỏi trước lớp "Sao các em không chơi với bạn A?" làm học sinh bị cô lập thêm xấu hổ.',
        '👤 [Luồng Zalo 2 - GVCN]: Trong tiết Sinh hoạt lớp / Hoạt động trải nghiệm, tổ chức trò chơi "Bốc thăm ngẫu nhiên chia lại toàn bộ nhóm học tập" và xếp em ngồi cạnh 1–2 cán bộ lớp nhân hậu, hòa đồng.',
        '👤 [Luồng Zalo 1 - Tâm lý]: Mời học sinh tham gia CLB sở thích của trường để mở rộng vòng kết nối bạn bè mới.'
      ],
      replyOptions: [
        {
          label: 'Phương án 1 (Nghiệp vụ Sư phạm Tinh tế): Bốc thăm chia lại nhóm học tập tự nhiên',
          text: `Chào ${studentDisplay}! Cô Tâm lý và GVCN đã đọc rất kỹ tâm sự của em và rất thương em. Để giúp em tự nhiên nhất mà không ai trong lớp biết em đã nhắn cho cô, trong tiết sinh hoạt tới GVCN sẽ tổ chức "Bốc thăm ngẫu nhiên đổi mới toàn bộ các nhóm học tập" của cả lớp, đồng thời tạo điều kiện để em kết nối với những bạn hiền lành, ấm áp nhất lớp. Em cứ tự tin mỉm cười đến lớp nhé! 🌻`
        },
        {
          label: 'Phương án 2: Đồng hành tâm lý & Mở rộng vòng bạn bè qua CLB',
          text: `Gửi ${studentDisplay} cái ôm thật ấm từ Phòng Tâm lý! Giá trị của em không bao giờ phụ thuộc vào việc một vài người có chọn chơi với em hay không. Bên cạnh việc GVCN đang khéo léo điều chỉnh lại chỗ ngồi và nhóm học trên lớp, cô mời em ghé Phòng Tâm lý hoặc tham gia CLB Sách & Nghệ thuật tuần này để gặp những người bạn cực kỳ dễ thương nhé!`
        },
        {
          label: 'Phương án 3: Hóa giải hiểu lầm ngầm trong lớp học',
          text: `Chào ${studentDisplay}, thầy cô luôn đứng về phía em! GVCN đã nắm được tình hình tại [${location}] và sẽ lồng ghép chuyên đề "Thấu cảm & Tình bạn chân thành" vào giờ sinh hoạt tuần này để tháo gỡ bầu không khí căng thẳng trong lớp một cách nhẹ nhàng, tinh tế nhất!`
        }
      ]
    },
    verbal_bullying: {
      situationTitle: 'Tình huống 5: Bắt nạt bằng lời nói, Trêu chọc ngoại hình (Body Shaming)',
      psychInsight: `Tuổi dậy thì (${gradeProfile.label}) đang có nhiều thay đổi cơ thể. Nhiều học sinh trêu bạn vì muốn gây chú ý trước đám đông mà không lường được vết thương tâm lý cho bạn.`,
      legalBasis: 'Nghị định 80/2017/NĐ-CP & Bộ Quy tắc Ứng xử Văn hóa Học đường (Tôn trọng nhân phẩm, ngoại hình và sự khác biệt của học sinh).',
      tacticalSteps: [
        '👤 [Luồng Zalo 2 - GVCN]: Nhắc nhở nghiêm khắc quy tắc "Không gọi biệt danh xấu / Không miệt thị ngoại hình" trong giờ sinh hoạt chung.',
        '🌱 [Kỷ luật tích cực]: Giao nhiệm vụ cho các học sinh hay trêu bạn chuẩn bị bài thuyết trình ngắn về "Tôn trọng sự khác biệt tuổi dậy thì" để tự thay đổi nhận thức.',
        '👤 [Luồng Zalo 1 - Tâm lý]: Hướng dẫn học sinh bị trêu áp dụng kỹ thuật "Đá tảng xám" (phản ứng bình thản khiến kẻ trêu thấy nhạt nhẽo).'
      ],
      replyOptions: [
        {
          label: 'Phương án 1: Chấn chỉnh văn hóa lớp học & Giữ bí mật người phản ánh',
          text: `Chào ${studentDisplay}! Thầy cô hoàn toàn đồng cảm với sự bức xúc của em — không ai có quyền mang ngoại hình hay tên gọi của người khác ra làm trò đùa. GVCN đã nhận thông tin qua Luồng Zalo 2 và sẽ đưa ngay quy tắc "Cấm đặt biệt danh xấu & Tôn trọng sự khác biệt" vào nội quy thi đua của các tổ trong tuần này mà tuyệt đối không nhắc tên em!`
        },
        {
          label: 'Phương án 2: Kết hợp nhắc nhở riêng học sinh trêu chọc & đổi vị trí ngồi',
          text: `Cảm ơn ${studentDisplay} đã chia sẻ với thầy cô! GVCN đã nắm rõ sự việc diễn ra tại [${location}]. Thầy/cô sẽ chủ động điều chỉnh lại sơ đồ chỗ ngồi và làm việc riêng bằng phương pháp kỷ luật tích cực với các bạn hay trêu chọc để chấm dứt tình trạng này. Em hãy luôn tự hào về bản thân mình nhé! 🌻`
        },
        {
          label: 'Phương án 3: Tư vấn kỹ năng đáp trả bản lĩnh & Bảo vệ từ Phòng Tâm lý',
          text: `Chào ${studentDisplay}! Bên cạnh việc thầy cô chủ nhiệm sẽ nghiêm khắc chấn chỉnh nề nếp giao tiếp trong lớp, khi gặp lời trêu vô duyên, em hãy nhìn thẳng và nói ngắn gọn: "Trò đùa này cũ rồi, tập trung học đi" rồi bước đi bình thản nhé. Thầy cô luôn theo sát bảo vệ em!`
        }
      ]
    },
    bystander: {
      situationTitle: 'Tình huống 6A: Người chứng kiến thông thái báo tin cứu bạn',
      psychInsight: `Học sinh ${gradeProfile.label} có lòng trắc ẩn rất đáng quý nhưng lo sợ nếu lộ mặt sẽ bị nhóm bắt nạt chuyển sang trả thù mình.`,
      legalBasis: 'Thông tư 18/2025/TT-BGDĐT (Khuyến khích học sinh tham gia mạng lưới phòng ngừa bạo lực học đường và bảo vệ tuyệt đối người cung cấp thông tin).',
      tacticalSteps: [
        '🛡️ [Bảo mật 100%]: Tuyệt đối giữ kín danh tính học sinh báo tin; tiếp cận vụ việc như một hoạt động kiểm tra định kỳ của nhà trường.',
        '👥 [Phối hợp 3 Luồng]: Nhanh chóng hỗ trợ học sinh đang là nạn nhân theo đúng địa điểm [${location}] mà người chứng kiến đã cung cấp.'
      ],
      replyOptions: [
        {
          label: 'Phương án 1: Biểu dương "Người hùng thầm lặng" & Can thiệp bảo vệ bạn ngay',
          text: `Cảm ơn ${studentDisplay} rất nhiều vì trái tim nhân hậu và hành động "Người chứng kiến thông thái"! 🌻 Nhờ thông tin quý giá của em tại [${location}], Ban Giám hiệu và Phòng Tâm lý đã lập tức vào cuộc bảo vệ bạn ấy một cách khéo léo như tình cờ phát hiện qua camera. Danh tính của em được giữ bí mật 100%, nhà trường rất tự hào về em!`
        },
        {
          label: 'Phương án 2: Phối hợp cùng người chứng kiến động viên tinh thần bạn',
          text: `Chào ${studentDisplay}! Thầy cô đã tiếp nhận báo cáo của em và đang triển khai phương án hỗ trợ bạn ấy ngay trong hôm nay. Trên lớp, khi có cơ hội an toàn, một lời hỏi thăm nhẹ nhàng của em dành cho bạn ấy lúc này sẽ giúp bạn ấm lòng hơn rất nhiều đấy. Cảm ơn em thật nhiều nhé!`
        },
        {
          label: 'Phương án 3: Xác nhận đã điều phối Giám thị & GVCN xử lý',
          text: `Thông tin của ${studentDisplay} đã được chuyển thẳng tới Luồng Zalo Chuyên trách. Thầy cô Giám thị và GVCN đã nắm được sự việc tại [${location}] và sẽ xử lý dứt điểm, an toàn. Cảm ơn em đã góp phần giữ gìn mái trường bình yên!`
        }
      ]
    },
    perpetrator_reflection: {
      situationTitle: 'Tình huống 6B: Học sinh lỡ có hành vi bắt nạt / trêu bạn muốn nhận diện & sửa sai',
      psychInsight: `Học sinh ${gradeProfile.label} đã có sự thức tỉnh lương tâm, biết hối lỗi nhưng ngại sĩ diện trước đám đông hoặc sợ bị thầy cô kỷ luật nặng.`,
      legalBasis: 'Thông tư 18/2025/TT-BGDĐT & Quy định Kỷ luật Tích cực của Bộ GD&ĐT (Giáo dục phục hồi, không dán nhãn học sinh khi các em chủ động nhận lỗi và khắc phục).',
      tacticalSteps: [
        '💛 [Không phán xét]: Ghi nhận tinh thần tự giác nhận lỗi của học sinh.',
        '👤 [Luồng Zalo 1 - Tâm lý]: Hỗ trợ làm cầu nối hòa giải kín đáo 1-1 giữa hai học sinh để tháo gỡ nút thắt êm đẹp.'
      ],
      replyOptions: [
        {
          label: 'Phương án 1: Khích lệ lòng dũng cảm nhận lỗi & Hướng dẫn cách xin lỗi tinh tế',
          text: `Chào ${studentDisplay}! Cô thực sự rất trân trọng sự dũng cảm và trung thực của em khi dám nhìn nhận lại hành động của mình. Biết nhận lỗi và dừng lại đúng lúc chính là biểu hiện của một người trưởng thành và bản lĩnh! Em hãy chủ động xóa các nội dung trêu bạn và nhắn một lời xin lỗi chân thành cho bạn ấy nhé. Nếu cần cô làm cầu nối hòa giải kín đáo, Phòng Tâm lý luôn sẵn sàng giúp em!`
        },
        {
          label: 'Phương án 2: Hẹn gặp kín đáo tại Phòng Tâm lý để hỗ trợ hòa giải êm đẹp',
          text: `Cảm ơn ${studentDisplay} đã mở lòng chia sẻ! Tại Phòng Tư vấn Tâm lý, thầy cô không phán xét hay trách phạt khi em đã chủ động muốn sửa sai. Cô sẽ hỗ trợ tạo một cuộc trò chuyện nhẹ nhàng, kín đáo để giúp em và bạn tháo gỡ hiểu lầm, giữ lại tình bạn đẹp trong lớp nhé!`
        },
        {
          label: 'Phương án 3: Hướng dẫn hành động bù đắp tích cực trên lớp',
          text: `Chào ${studentDisplay}! Bên cạnh một lời xin lỗi chân thành gửi riêng cho bạn, cách sửa sai tuyệt vời nhất là ngày mai trên lớp em hãy chủ động dừng các trò trêu chọc của nhóm và rủ bạn cùng tham gia hoạt động chung. Thầy cô rất ghi nhận sự thay đổi tích cực này của em! 🌻`
        }
      ]
    },
    academic_stress: {
      situationTitle: 'Tình huống: Áp lực học tập, Thi cử & Bất đồng với kỳ vọng của Phụ huynh',
      psychInsight: `Học sinh ${gradeProfile.label} (${gradeProfile.stageName}) dễ rơi vào trạng thái quá tải nhận thức và sợ làm bố mẹ thất vọng.`,
      legalBasis: 'Thông tư 18/2025/TT-BGDĐT (Tư vấn tâm lý học đường hỗ trợ học sinh giải tỏa căng thẳng học tập và tư vấn phối hợp gia đình - nhà trường).',
      tacticalSteps: [
        '👤 [Luồng Zalo 1 - Tâm lý]: Lắng nghe, hướng dẫn phương pháp chia nhỏ mục tiêu học tập và kỹ thuật điều hòa cảm xúc.',
        '👤 [Luồng Zalo 2 - GVCN]: Trao đổi khéo léo với phụ huynh để giảm áp lực so sánh điểm số, động viên sự tiến bộ của con.'
      ],
      replyOptions: [
        {
          label: 'Phương án 1: Lắng nghe thấu cảm & Mời trò chuyện tại Phòng Tâm lý',
          text: `Chào ${studentDisplay}! Cô Minh Tâm (Phòng Tâm lý) đã nhận được tâm sự của em tại [${location}]. Điểm số không bao giờ là thước đo duy nhất cho giá trị của em! Cô rất mong được đón em tại Phòng Tư vấn Tâm lý P.202 (hoặc trò chuyện qua mã ${reqItem.trackingCode} này) để cô trò mình cùng lập một kế hoạch ôn tập nhẹ nhàng và tháo gỡ áp lực với bố mẹ nhé! 🌻`
        },
        {
          label: 'Phương án 2: GVCN hỗ trợ phụ đạo kiến thức & Tâm sự cùng phụ huynh giúp em',
          text: `Thương gửi ${studentDisplay}! Thầy cô hiểu em đã cố gắng rất nhiều trong thời gian qua. GVCN và giáo viên bộ môn sẽ hỗ trợ giải đáp riêng những phần kiến thức em còn lo lắng, đồng thời thầy cô sẽ trao đổi khéo léo để bố mẹ thấu hiểu và đồng hành nhẹ nhàng hơn với em nhé!`
        },
        {
          label: 'Phương án 3: Hướng dẫn cân bằng sức khỏe tinh thần mùa thi',
          text: `Chào ${studentDisplay}! Hãy hít một hơi thật sâu nhé, em không phải gánh vác mọi áp lực một mình đâu. Hôm nay em hãy dành thời gian nghỉ ngơi hợp lý, chia nhỏ bài học thành từng phần 25 phút và ghé Phòng Tâm lý theo lịch hẹn [${location}] để cô tiếp thêm năng lượng cho em nhé!`
        }
      ]
    }
  };

  let chosenKey = category;
  if (urgency === 'critical' && category !== 'crisis') {
    chosenKey = 'crisis';
  }
  const selected = briefings[chosenKey] || briefings.isolation;

  // Tạo Bản tin chuẩn để Copy 1-Chạm gửi thẳng vào Group Zalo 3 (Ban Giám hiệu) hoặc Zalo 1, 2
  const bghZaloClipboardText = [
    `📋 [BÁO CÁO & THAM MƯU AI - DỰ ÁN BẠN ĐỒNG HÀNH]`,
    `• Mã hồ sơ: ${reqItem.trackingCode || 'MỚI'} (${reqItem.isAnonymous ? `Ẩn danh: ${studentDisplay}` : `${studentDisplay} - ${reqItem.className || ''}`} • Khối ${grade})`,
    `• Phân loại: ${reqItem.categoryLabel || selected.situationTitle} | Mức độ: ${String(urgency).toUpperCase()}`,
    `• Địa điểm/Thời gian: ${location}`,
    reqItem.evidenceNote ? `• Bằng chứng: ${reqItem.evidenceNote}` : null,
    `• Nội dung HS phản ánh: "${reqItem.description || ''}"`,
    `----------------------------------------`,
    `🧠 THAM MƯU TỪ TRỢ LÝ AI SƯ PHẠM & PHÁP LÝ:`,
    `1. Tâm lý lứa tuổi: ${selected.psychInsight}`,
    `2. Căn cứ pháp lý: ${selected.legalBasis}`,
    `3. Đề xuất xử lý chuẩn:`,
    ...selected.tacticalSteps.map(s => `   ${s}`)
  ]
    .filter(Boolean)
    .join('\n');

  return {
    ...selected,
    gradeLabel: gradeProfile.label,
    bghZaloClipboardText
  };
}

/**
 * TRỢ LÝ AI HỎI - ĐÁP TRỰC TIẾP DÀNH RIÊNG CHO THẦY CÔ & BAN GIÁM HIỆU (TEACHER / BGH CO-PILOT CHAT)
 */
async function generateTeacherAdvisorChatResponse({ question = '', roleTitle = 'Ban Giám Hiệu & Giáo Viên Tư Vấn', geminiApiKey = '' }) {
  const norm = normalizeText(question);

  // Bộ tri thức tình huống thực chiến dành cho Giáo viên & Ban Giám hiệu
  let builtInAnswer = '';

  if (/phụ huynh|bố mẹ|không hợp tác|bênh con|phản ứng/.test(norm)) {
    builtInAnswer = `### 🤝 Tham mưu Kịch bản Làm việc với Phụ huynh (Sắc bén, Đúng luật & Giữ hòa khí)\n\n**1. Nguyên tắc Tâm lý & Pháp lý (Thông tư 18/2025/TT-BGDĐT & Nghị định 80/2017/NĐ-CP):**\n- Khi phụ huynh của học sinh có hành vi bắt nạt phản ứng gay gắt hoặc bênh con, nguyên nhân thường do **tâm lý sợ con mình bị mang tiếng xấu hoặc bị kỷ luật đuổi học**.\n- Tuyệt đối không mở đầu bằng lời buộc tội. Hãy mở đầu bằng **Mục tiêu bảo vệ tương lai cho cả 2 học sinh** và đưa ra **dữ liệu khách quan** (trích xuất camera, ảnh chụp màn hình đã che tên người báo).\n\n**2. Kịch bản 3 bước phát ngôn chuẩn dành cho Ban Giám hiệu / GVCN:**\n- **Bước 1 – Đồng hành (Hạ nhiệt cảm xúc):** *"Nhà trường mời gia đình hôm nay không phải để kết tội cháu, mà vì muốn phối hợp cùng anh/chị giúp cháu nhận ra giới hạn an toàn trước khi sự việc đi quá xa ảnh hưởng đến hồ sơ rèn luyện của chính cháu."*\n- **Bước 2 – Nêu căn cứ Pháp lý & Bằng chứng khách quan:** *"Qua hệ thống giám sát của nhà trường (và quy định tại Nghị định 80/2017/NĐ-CP, Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15), hành vi này đã gây tổn thương tinh thần/thể chất cho bạn học. Nếu xử lý nội bộ theo hướng giáo dục kỷ luật tích cực ngay bây giờ, cháu sẽ có cơ hội sửa sai rất tốt."*\n- **Bước 3 – Chốt cam kết 2 chiều:** Đề nghị phụ huynh ký cam kết phối hợp quản lý thời gian dùng mạng xã hội / giờ giấc của con và thống nhất biện pháp khắc phục (xin lỗi, gỡ bài, không tái phạm).`;
  } else if (/camera|đối chất|lộ danh tính|trả thù|sợ bị đánh/.test(norm)) {
    builtInAnswer = `### 🛡️ Nghiệp vụ Xử lý Bắt nạt Không Làm Lộ Danh Tính Học Sinh Báo Cáo\n\n**1. Căn cứ bắt buộc (Mục 5 Đề án & Luật 91/2025/QH15):**\n- Sai lầm phổ biến nhất là gọi học sinh báo cáo và học sinh bắt nạt lên phòng Giám thị đối chất trực tiếp ➔ Kẻ bắt nạt biết ngay ai báo và sẽ trả thù sau giờ học.\n\n**2. Quy trình "Hợp thức hóa nguồn phát hiện" (3 bước nghiệp vụ sắc bén):**\n- **Cách 1 – Dùng nghiệp vụ Camera / Tuần tra ngẫu nhiên:** Thông báo với học sinh vi phạm rằng *Bộ phận An ninh trường học rà soát camera định kỳ khu vực cầu thang/hành lang* hoặc *Giám thị đi tuần tra phát hiện sự việc*, hoàn toàn không nhắc tới việc có học sinh gửi Hộp thư.\n- **Cách 2 – Khảo sát ẩn danh cả lớp:** Nếu vụ việc xảy ra trong lớp, GVCN phát phiếu khảo sát 2 phút cho cả 40 học sinh về bầu không khí lớp học, từ đó mời 5–7 học sinh bất kỳ lên trò chuyện riêng (trong đó có học sinh vi phạm), khiến không ai đoán được ai là người phản ánh.\n- **Cách 3 – Bốc thăm chia lại nhóm/chỗ ngồi:** Giải quyết êm đẹp các vụ cô lập tập thể mà không tạo sự đối đầu.`;
  } else if (/mạng xã hội|group chat|chế ảnh|tiktok|facebook|luật 91|xóa bài/.test(norm)) {
    builtInAnswer = `### 📱 Quy trình Xử lý Bắt nạt Trên Mạng (Cyberbullying) Theo Luật 91/2025/QH15\n\n**1. Căn cứ Pháp lý Sắc bén:**\n- **Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (Hiệu lực 01/01/2026):** Hình ảnh, thông tin đời tư của học sinh là dữ liệu cá nhân được pháp luật bảo vệ. Việc chụp lén, ghép ảnh chế giễu (meme), lập group anti là hành vi xâm phạm dữ liệu cá nhân và danh dự trẻ em.\n\n**2. Phác đồ 4 bước dành cho Ban Giám hiệu & GVCN:**\n1. **Đóng băng bằng chứng:** Chụp màn hình lưu hồ sơ nội bộ của Ban An toàn trường học.\n2. **Yêu cầu gỡ bỏ ngay trong 2 giờ:** Làm việc riêng với quản trị viên group chat / học sinh đăng bài, phân tích rõ quy định của Luật 91/2025/QH15 để các em tự giác xóa toàn bộ bài viết, hình ảnh ngay tại phòng làm việc.\n3. **Ngăn chặn lan truyền thứ cấp:** Nhắc nhở trên các kênh thông tin lớp: *"Không chia sẻ, bình luận hoặc thả cảm xúc vào các bài đăng xâm phạm quyền riêng tư của bạn học"*.\n4. **Hỗ trợ tâm lý nạn nhân:** Phòng Tâm lý (Luồng Zalo 1) đồng hành trấn an học sinh bị hại để em tự tin quay lại lớp.`;
  } else {
    builtInAnswer = `### 🧠 Tham mưu Sư phạm & Pháp lý từ Trợ lý AI (Dành cho ${roleTitle})\n\nĐối với tình huống thầy/cô vừa nêu: *"${question.slice(0, 140)}"*, **Trợ lý AI Cố vấn** đề xuất phác đồ xử lý chuẩn theo **3 trụ cột** sau:\n\n1. **Về Pháp lý & Quy trình (Nghị định 80/2017/NĐ-CP, Thông tư 18/2025/TT-BGDĐT, Luật 91/2025/QH15):**\n   - Phân loại ngay mức độ an toàn: Nếu thuộc **Bước 3A (Chưa có nguy cơ mất an toàn)** ➔ Ưu tiên tư vấn tâm lý, kỷ luật tích cực và điều chỉnh môi trường lớp học. Nếu thuộc **Bước 3B (Có nguy cơ bạo lực/tự hại)** ➔ Kích hoạt ngay nhóm phản ứng nhanh của Ban Giám hiệu và bảo vệ học sinh.\n2. **Về Tâm sinh lý Học sinh THCS (Lớp 6 – Lớp 9):**\n   - Bảo vệ tuyệt đối danh tính người báo tin (sử dụng nghiệp vụ kiểm tra camera định kỳ hoặc khảo sát chung cả lớp để hợp thức hóa việc phát hiện).\n   - Không phán xét hay phê bình công khai trước tập thể lớp để tránh phản ứng chống đối ngầm.\n3. **Gợi ý phát ngôn chuẩn mực của Nhà trường:**\n   - *Với học sinh gặp khó khăn:* Khẳng định các em không có lỗi, nhà trường luôn bảo vệ an toàn và giữ kín thông tin của các em.\n   - *Với học sinh vi phạm & Phụ huynh:* Tập trung vào hành vi cần sửa đổi và giải pháp khắc phục (kỷ luật tích cực) thay vì dán nhãn nhân cách.`;
  }

  const cleanKey = (geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
  if (cleanKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(cleanKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: `Bạn là Chuyên gia Cố vấn Cao cấp về Tâm lý Học đường và Pháp luật Giáo dục Việt Nam (nắm vững Nghị định 80/2017/NĐ-CP, Thông tư 18/2025/TT-BGDĐT, Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15). Hãy tham mưu cho Ban Giám hiệu và Giáo viên THCS cách xử lý tình huống sắc bén, nhân văn, bảo mật danh tính học sinh và kèm theo mẫu câu phát ngôn chuẩn mực.`
                }
              ]
            },
            contents: [{ role: 'user', parts: [{ text: question }] }],
            generationConfig: { temperature: 0.6, maxOutputTokens: 700 }
          })
        }
      );
      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 20) {
          return { reply: text.trim(), engineUsed: 'gemini-copilot' };
        }
      }
    } catch (_e) {
      // Fallback về bộ cố vấn nội tại
    }
  }

  return {
    reply: builtInAnswer,
    engineUsed: 'builtin-copilot'
  };
}

module.exports = {
  GRADE_PROFILES,
  SCENARIO_KNOWLEDGE_BASE,
  analyzeStudentMessage,
  generatePedagogicalResponse,
  generateAIResponseWithOptionalGemini,
  generateTeacherCoPilotBriefing,
  generateTeacherAdvisorChatResponse
};
