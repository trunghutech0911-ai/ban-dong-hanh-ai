/**
 * DỮ LIỆU KỊCH BẢN SƯ PHẠM, NHẬP VAI ỨNG XỬ (ROLEPLAY) & KHỞI TẠO CƠ SỞ DỮ LIỆU
 * Dành cho học sinh THCS từ Lớp 6 đến Lớp 9
 */

const INTERACTIVE_SCENARIOS = [
  {
    id: 'isolation',
    title: 'Bị tẩy chay & Cô lập trong lớp',
    badge: 'Phổ biến ở Lớp 6 & Lớp 7',
    icon: '🫧',
    colorTheme: 'amber',
    shortDesc: 'Khi nhóm bạn bỗng nhiên nghỉ chơi, xì xào bàn tán hoặc không cho em tham gia hoạt động nhóm.',
    reassurance: 'Giá trị của em không nằm ở việc một nhóm bạn có chọn chơi với em hay không. Bị cô lập là một hình thức bắt nạt tinh thần, và em hoàn toàn xứng đáng có những người bạn chân thành, tôn trọng mình.',
    immediateSteps: [
      'Giữ bình tĩnh và tự nhiên: Đừng tỏ ra hoảng loạn hay năn nỉ. Hãy mở sách đọc, vẽ vời hoặc trò chuyện với các bạn hiền lành ở tổ khác.',
      'Tìm hiểu nguyên nhân qua 1 người bạn ôn hòa nhất trong nhóm bằng tin nhắn riêng lịch sự (nếu chỉ là hiểu lầm nhỏ).',
      'Nhờ Giáo viên chủ nhiệm hoặc Cán bộ Tâm lý khéo léo sắp xếp lại nhóm học tập mà không nhắc tên em.'
    ],
    dos: [
      'Mở rộng kết bạn với các bạn lớp bên cạnh hoặc tham gia Câu lạc bộ Thể thao / Nghệ thuật / Đọc sách.',
      'Chăm sóc bản thân thật tốt, giữ gương mặt tươi tỉnh để người có ý xấu thấy trò tẩy chay vô tác dụng.'
    ],
    donts: [
      'Đừng hạ mình làm những việc sai trái hoặc tặng quà/tiền chỉ để xin được vào lại nhóm.',
      'Đừng tự nhốt mình một góc rồi bỏ bữa trưa hay nghỉ học.'
    ],
    gradeSpecificAdvice: {
      '6': 'Mới lên Lớp 6, các nhóm bạn còn thay đổi rất nhiều. Hôm nay chưa hợp nhóm này thì tuần sau em hoàn toàn có thể tìm thấy bạn cùng sở thích ở tổ khác!',
      '7': 'Lớp 7 rất hay có hiệu ứng đám đông (1 bạn giận là kéo cả nhóm nghỉ chơi). Hãy kiên nhẫn, các bạn đi theo đám đông sẽ sớm nhận ra ai mới là người tử tế.',
      '8': 'Ở Lớp 8, hãy tập trung phát triển thế mạnh riêng (học tập, vẽ, nhạc, thể thao). Sự tự tin độc lập của em chính là sức hút lớn nhất.',
      '9': 'Lớp 9 ưu tiên hàng đầu là mục tiêu tương lai. Hãy kết nối với những bạn có tinh thần học tập nghiêm túc để cùng nhau tiến bộ.'
    },
    roleplay: {
      situation: 'Giờ ra chơi, em đi tới bàn của nhóm bạn hay chơi cùng thì bạn A nói to: "Chỗ này hết chỗ rồi, tụi tao đang nói chuyện riêng, đừng có ngồi đây!" và mấy bạn kia cười khúc khích.',
      choices: [
        {
          id: 'a',
          text: 'Đứng lại cãi to: "Bàn của trường chứ của nhà cậu đâu mà đuổi mình!" rồi bật khóc.',
          score: 40,
          verdict: 'Chưa tối ưu',
          feedback: 'Khi em nổi nóng hoặc bật khóc ngay lúc đó, bạn A sẽ càng cảm thấy đắc thắng vì đã chọc tức được em trước đám đông.'
        },
        {
          id: 'b',
          text: 'Mỉm cười nhẹ nhàng, nói bình thản: "Ừ, vậy các cậu nói chuyện đi nhé, mình qua bàn bên kia đọc truyện/nói chuyện với bạn Lan đây" rồi bước đi tự tin.',
          score: 100,
          verdict: 'Tuyệt vời & Bản lĩnh!',
          feedback: 'Xuất sắc! Thái độ bình thản, lịch sự và tự chủ của em làm đối phương hoàn toàn bất ngờ và thấy trò cô lập trở nên vô nghĩa.'
        },
        {
          id: 'c',
          text: 'Cúi gằm mặt đi ra hành lang đứng một mình và tự trách bản thân suốt buổi học.',
          score: 30,
          verdict: 'Cần thay đổi',
          feedback: 'Đừng tự phạt bản thân vì lỗi của người khác nhé! Em hãy chủ động ngồi cạnh một bạn hiền lành khác trong lớp.'
        }
      ]
    }
  },
  {
    id: 'cyber_bullying',
    title: 'Bắt nạt trên mạng & Group Chat',
    badge: 'Nguy cơ cao ở Lớp 7, 8 & 9',
    icon: '📱',
    colorTheme: 'coral',
    shortDesc: 'Bị chụp lén, chế ảnh (meme) dìm hàng, lập nhóm chat nói xấu hoặc tung tin đồn sai sự thật trên Facebook/Zalo/TikTok.',
    reassurance: 'Thế giới ảo nhưng nỗi đau là thật. Tuy nhiên, ưu điểm lớn nhất trên mạng là MỌI HÀNH VI XẤU ĐỀU ĐỂ LẠI DẤU VẾT. Khi em giữ được bằng chứng, pháp luật và nhà trường luôn bảo vệ em!',
    immediateSteps: [
      'Dừng ngay việc trả lời hay cãi lại trong bình luận (không tiếp thêm "nhiên liệu" cho kẻ bắt nạt).',
      'Chụp màn hình (Screenshot) toàn bộ tin nhắn, bài đăng, tên tài khoản và thời gian làm bằng chứng.',
      'Báo cáo bài viết (Report), chặn (Block) tài khoản độc hại và gửi ảnh chụp qua Hộp Thư Cầu Viện An Toàn.'
    ],
    dos: [
      'Cài đặt tài khoản mạng xã hội ở chế độ Riêng tư (Chỉ bạn bè tin cậy mới xem được ảnh).',
      'Chia sẻ ngay với bố mẹ hoặc thầy cô tư vấn tâm lý khi có tin nhắn đe dọa.'
    ],
    donts: [
      'Tuyệt đối KHÔNG xóa tin nhắn trước khi chụp màn hình lưu bằng chứng.',
      'Không lập tài khoản ảo để chửi lại hay đăng bài trả đũa (vì sẽ biến em từ nạn nhân thành người vi phạm nội quy).'
    ],
    gradeSpecificAdvice: {
      '6': 'Ở Lớp 6, khi tham gia nhóm Zalo/Messenger của lớp, em hãy nhờ bố mẹ cùng kiểm tra cài đặt quyền riêng tư để tránh người lạ nhắn tin.',
      '7': 'Nếu có group chat lập ra để nói xấu một ai đó, hãy rời nhóm hoặc giữ bằng chứng báo thầy cô, đừng bấm "Haha" vì bấm thả cảm xúc cũng là tiếp tay.',
      '8': 'Ở Lớp 8, các trang Confession hoặc TikTok ẩn danh rất phổ biến. Hãy nhớ: nhà trường hoàn toàn có thể phối hợp xác minh và yêu cầu gỡ các trang bôi nhọ học sinh.',
      '9': 'Đừng để những bình luận độc hại trên mạng làm xao nhãng kỳ thi cuối cấp. Hãy tạm tắt thông báo mạng xã hội và giao việc xử lý cho thầy cô.'
    },
    roleplay: {
      situation: 'Tối thứ Bảy, em phát hiện một bức ảnh em đang ngủ gật trong lớp bị ai đó ghép chữ chế giễu và đăng vào nhóm chat 40 người kèm nhiều bình luận cười cợt.',
      choices: [
        {
          id: 'a',
          text: 'Nhắn tin chửi lại từng người trong nhóm và dọa sẽ đánh người đăng ảnh vào sáng thứ Hai.',
          score: 25,
          verdict: 'Rất nguy hiểm!',
          feedback: 'Nếu em nhắn tin chửi bới hoặc dọa đánh, kẻ xấu sẽ chụp lại chính tin nhắn nóng giận của em để đổ lỗi ngược lại cho em trước mặt thầy cô.'
        },
        {
          id: 'b',
          text: 'Chụp màn hình rõ tên người đăng và các bình luận, nhắn 1 câu đĩnh đạc: "Mình đã lưu lại ảnh chụp màn hình việc tự ý dùng ảnh của mình để chế giễu. Đề nghị xóa ngay, nếu không mình sẽ gửi GVCN xử lý", sau đó gửi vào Hộp Thư Cầu Viện.',
          score: 100,
          verdict: 'Chuẩn Chuyên Gia!',
          feedback: 'Cực kỳ thông minh và đanh thép! Em vừa giữ được bằng chứng thép, vừa thể hiện thái độ văn minh khiến người đăng phải chột dạ và xóa bài.'
        },
        {
          id: 'c',
          text: 'Sợ quá lập tức rời nhóm, xóa ứng dụng và nằm khóc cả đêm không dám nói với ai.',
          score: 40,
          verdict: 'Cần giữ bằng chứng trước',
          feedback: 'Rời nhóm ngay mà chưa chụp màn hình sẽ làm mất bằng chứng. Hãy chụp màn hình trước, sau đó chia sẻ với người lớn hoặc Hộp thư tâm lý nhé!'
        }
      ]
    }
  },
  {
    id: 'verbal_bullying',
    title: 'Trêu chọc ngoại hình (Body Shaming) & Đặt biệt danh xấu',
    badge: 'Thường gặp ở Lớp 6, 7 & 8',
    icon: '🛡️',
    colorTheme: 'teal',
    shortDesc: 'Bị chê bai cân nặng, chiều cao, mụn dậy thì, giọng nói, hoàn cảnh gia đình hoặc bị gọi bằng biệt danh gây tổn thương.',
    reassurance: 'Cơ thể của em ở tuổi dậy thì đang lớn lên từng ngày và là duy nhất. Người mang ngoại hình hay gia cảnh của người khác ra chế giễu mới là người thiếu sự tự tin và thiếu văn hóa ứng xử.',
    immediateSteps: [
      'Áp dụng chiến thuật "Đá Tảng Xám": Đáp lại bằng thái độ tỉnh bơ, ngắn gọn, không tức giận để kẻ trêu chọc thấy... nhạt nhẽo và tự dừng lại.',
      'Nhìn thẳng và tuyên bố ranh giới rõ ràng: "Mình không thích biệt danh đó. Hãy gọi đúng tên mình."',
      'Nếu hành vi lặp lại nhiều lần thành quấy rối có chủ đích, hãy ghi lại và báo cho thầy cô chủ nhiệm.'
    ],
    dos: [
      'Dùng câu trả lời hài hước nhẹ nhàng hoặc câu chốt ngắn gọn rồi bước đi ngay.',
      'Tập trung vào những phẩm chất đáng quý của bản thân (lòng tốt, sự chăm chỉ, nụ cười, tài năng riêng).'
    ],
    donts: [
      'Đừng nhịn ăn tiêu cực hay tự làm hại cơ thể vì lời chê bai vô duyên của người khác.',
      'Đừng dùng lời lẽ miệt thị ngoại hình của họ để chửi lại.'
    ],
    gradeSpecificAdvice: {
      '6': 'Ở Lớp 6, nhiều bạn nam/nữ trêu nhau chỉ vì muốn gây chú ý mà chưa hiểu hết sự tổn thương. Một lời nhắc thẳng thắn, nghiêm túc của em sẽ giúp bạn nhận ra giới hạn.',
      '7': 'Tuổi Lớp 7 bắt đầu dậy thì (vỡ giọng, có mụn, tăng cân/chiều cao). Ai cũng sẽ trải qua giai đoạn này, em hoàn toàn tự hào về sự trưởng thành của mình!',
      '8': 'Ở Lớp 8, hãy dùng sự điềm tĩnh và bản lĩnh để đáp trả ngắn gọn. Ai cố tình body shaming người khác trước đám đông sẽ tự làm xấu hình ảnh của chính họ.',
      '9': 'Giữ năng lượng tích cực cho bản thân, đừng cho phép những lời nhận xét kém duyên tồn tại trong tâm trí em quá 5 phút.'
    },
    roleplay: {
      situation: 'Khi em đứng lên phát biểu hoặc đi ngang qua lớp, một bạn hay trêu chọc cố tình nói to biệt danh xấu chỉ ngoại hình của em để cả lớp quay lại nhìn.',
      choices: [
        {
          id: 'a',
          text: 'Nhìn thẳng vào bạn đó với gương mặt bình thản, nói rõ ràng: "Trò đùa này cũ rồi cậu ơi, tập trung vào bài học đi nhé" rồi tiếp tục việc của mình như không có gì xảy ra.',
          score: 100,
          verdict: 'Bản lĩnh & Tinh tế!',
          feedback: 'Khi em không hề nao núng mà còn nhắc nhở bạn ấy một cách lịch sự, người bị "quê" trước cả lớp chính là người vừa trêu chọc em!'
        },
        {
          id: 'b',
          text: 'Đỏ mặt tía tai, cầm quyển sách ném về phía bạn đó trước mặt giáo viên.',
          score: 20,
          verdict: 'Rất bất lợi cho em',
          feedback: 'Hành động ném sách sẽ khiến thầy cô nhìn thấy hành vi bạo lực của em trước tiên, làm em chịu thiệt thòi dù mình là người bị trêu trước.'
        },
        {
          id: 'c',
          text: 'Ngồi thụp xuống bàn, từ đó về sau không bao giờ dám giơ tay phát biểu trên lớp nữa.',
          score: 35,
          verdict: 'Đừng đánh mất cơ hội của mình',
          feedback: 'Đừng vì một lời nói kém duyên mà tước đi quyền được tỏa sáng trong học tập của chính em nhé!'
        }
      ]
    }
  },
  {
    id: 'physical_bullying',
    title: 'Bắt nạt thể chất, Giấu đồ & Trấn lột',
    badge: 'Cần can thiệp ngay (Lớp 6 - 9)',
    icon: '🚨',
    colorTheme: 'rose',
    shortDesc: 'Bị chặn đường, đánh, xô đẩy, giấu/lấy cắp đồ dùng học tập, hoặc bị ép phải nộp tiền ăn sáng, làm bài tập hộ.',
    reassurance: 'Lên tiếng khi bị đánh hoặc trấn lột KHÔNG PHẢI là "mách lẻo" — đó là bảo vệ sự an toàn chính đáng của em và ngăn chặn hành vi phạm pháp trong trường học.',
    immediateSteps: [
      'Ưu tiên thoát khỏi khu vực vắng vẻ (nhà vệ sinh cuối dãy, góc cầu thang, hẻm nhỏ ngoài cổng trường) về nơi có đông người hoặc có camera.',
      'Không dùng tiền bạc để "mua sự yên ổn" vì kẻ trấn lột sẽ đòi hỏi ngày càng nhiều hơn.',
      'Báo ngay cho bố mẹ, thầy cô hoặc gửi Hộp Thư Cầu Viện (có thể báo ẩn danh vị trí & thời gian để nhà trường trích xuất camera).'
    ],
    dos: [
      'Đi học và ra về cùng nhóm bạn hoặc đứng ở khu vực bác bảo vệ trường trong lúc chờ bố mẹ đón.',
      'Ghi nhớ rõ thời gian, địa điểm, tên hoặc đặc điểm phù hiệu/lớp của người đe dọa.'
    ],
    donts: [
      'Tuyệt đối không mang theo đồ vật sắc nhọn hay rủ người ngoài vào đánh nhau.',
      'Không đi một mình đến chỗ hẹn vắng vẻ theo lời dụ dỗ "Ra đây nói chuyện riêng".'
    ],
    gradeSpecificAdvice: {
      '6': 'Học sinh Lớp 6 nhỏ tuổi nhất trường nên đôi khi bị các anh chị lớp trên dọa nạt. Hãy nhớ bác bảo vệ và thầy cô Giám thị luôn ưu tiên bảo vệ học sinh Lớp 6!',
      '7': 'Nếu bị giấu cặp sách hoặc đổ rác vào ngăn bàn nhiều lần, hãy báo riêng cho GVCN để cô kiểm tra đột xuất.',
      '8': 'Ở Lớp 8, tuyệt đối tránh tâm lý "tự giải quyết bằng nắm đấm". Báo cáo qua kênh an toàn là cách hành xử của người trưởng thành.',
      '9': 'Mọi xô xát bạo lực ở Lớp 9 đều ảnh hưởng trực tiếp đến hồ sơ rèn luyện thi chuyển cấp. Hãy để nhà trường xử lý nghiêm minh.'
    },
    roleplay: {
      situation: 'Giờ tan học, hai học sinh lớn hơn chặn em ở góc hành lang vắng và nói: "Ngày mai mang 50 nghìn nộp cho tụi tao, nếu mày mách thầy cô hay bố mẹ thì biết tay!"',
      choices: [
        {
          id: 'a',
          text: 'Lúc đó giữ thái độ bình tĩnh để thoát về nơi an toàn trước, sau đó về nhà kể ngay cho bố mẹ và gửi báo cáo qua Hộp Thư Cầu Viện ghi rõ góc hành lang & giờ bị chặn để nhà trường kiểm tra camera xử lý.',
          score: 100,
          verdict: 'An toàn & Chính xác 100%!',
          feedback: 'Hoàn toàn chính xác! Trước mặt kẻ đe dọa ở nơi vắng, ưu tiên số 1 là giữ an toàn cho bản thân để rời đi, sau đó lập tức dùng kênh bảo vệ của nhà trường và gia đình.'
        },
        {
          id: 'b',
          text: 'Sợ bị đánh nên lén lấy tiền tiết kiệm mang nộp cho họ và giấu kín không nói với ai.',
          score: 20,
          verdict: 'Nguy hiểm kéo dài',
          feedback: 'Nếu em đưa tiền 1 lần, hôm sau họ sẽ tiếp tục đòi 100 nghìn, 200 nghìn không bao giờ dừng lại. Im lặng chính là điều kẻ bắt nạt mong muốn nhất.'
        },
        {
          id: 'c',
          text: 'Lao vào đánh nhau tay đôi ngay tại góc cầu thang vắng vẻ đó.',
          score: 15,
          verdict: 'Rất nguy hiểm cho cơ thể em',
          feedback: 'Khi đối phương đông hơn và ở nơi vắng người, việc xô xát trực tiếp có thể gây chấn thương nguy hiểm cho em.'
        }
      ]
    }
  },
  {
    id: 'bystander',
    title: 'Chứng kiến bạn bị bắt nạt (Người chứng kiến thông thái)',
    badge: 'Kỹ năng Vàng cho Lớp 6 - 9',
    icon: '🤝',
    colorTheme: 'emerald',
    shortDesc: 'Khi em nhìn thấy một bạn trong lớp hoặc trong trường bị trêu chọc, cô lập, đánh đập và em muốn giúp bạn một cách an toàn.',
    reassurance: '85% các vụ bắt nạt học đường có sự chứng kiến của các học sinh xung quanh. Chỉ cần MỘT người chứng kiến hành động thông minh, chuỗi bắt nạt sẽ bị phá vỡ!',
    immediateSteps: [
      'Không hùa theo cười cợt, không đứng quay video cổ vũ hay chia sẻ clip bắt nạt.',
      'Đánh lạc hướng khéo léo (Ví dụ: hô to "Thầy giám thị lên kìa!" hoặc gọi bạn nạn nhân đi làm việc lớp).',
      'Hỏi thăm, động viên riêng bạn nạn nhân sau đó và gửi thông báo ẩn danh qua Hộp Thư Cầu Viện giúp bạn.'
    ],
    dos: [
      'Rủ bạn đang bị cô lập cùng đi xuống căng-tin, cùng làm bài tập nhóm hoặc đi về cùng.',
      'Sử dụng Hộp Thư Ẩn Danh để báo thời gian và địa điểm cho thầy cô can thiệp kịp thời.'
    ],
    donts: [
      'Không lao vào xô xát trực tiếp nếu nhóm bắt nạt đang hung hăng hoặc có vật nguy hiểm.',
      'Không quay clip đăng lên mạng xã hội vì sẽ làm bạn nạn nhân bị tổn thương lần thứ hai.'
    ],
    gradeSpecificAdvice: {
      '6': 'Ở Lớp 6, một lời rủ "Cậu ngồi ăn quà chiều cùng tụi mình không?" có thể biến một ngày buồn bã của bạn thành ngày hạnh phúc nhất.',
      '7': 'Đừng sợ khác biệt với đám đông. Từ chối tham gia nói xấu bạn khác trong group chat chính là biểu hiện của lòng dũng cảm.',
      '8': 'Học sinh Lớp 8 có thể chủ động làm cầu nối hòa giải các hiểu lầm nhỏ trong lớp trước khi nó biến thành tẩy chay.',
      '9': 'Là anh chị lớn nhất trường, sự lên tiếng bảo vệ các em khóa dưới của học sinh Lớp 9 có sức nặng và uy tín rất lớn!'
    },
    roleplay: {
      situation: 'Em thấy một bạn hiền lành cùng lớp đang bị 3 bạn khác vây quanh bàn, giật vở văn ra đọc to rồi cười nhạo.',
      choices: [
        {
          id: 'a',
          text: 'Đứng xem và cười theo cho khỏi bị 3 bạn kia chú ý tới mình.',
          score: 20,
          verdict: 'Vô tình tiếp tay',
          feedback: 'Tiếng cười của những người xung quanh chính là thứ làm bạn nạn nhân đau lòng nhất và khiến kẻ trêu chọc càng lấn tới.'
        },
        {
          id: 'b',
          text: 'Đi nhanh từ cửa lớp vào nói to: "Các cậu ơi, cô chủ nhiệm đang đi sang lớp mình kiểm tra đột xuất kìa, về chỗ mau!" rồi lát nữa ra chơi đến hỏi thăm, động viên bạn bị giật vở.',
          score: 100,
          verdict: 'Người Hùng Thông Thái!',
          feedback: 'Tuyệt vời! Cách đánh lạc hướng này vừa giải vây cho bạn ngay lập tức, vừa giữ an toàn tuyệt đối cho em mà không gây xung đột trực tiếp.'
        },
        {
          id: 'c',
          text: 'Lấy điện thoại quay clip cảnh bạn bị trêu rồi đăng lên Facebook để mọi người vào bình luận.',
          score: 10,
          verdict: 'Không nên làm',
          feedback: 'Đăng clip bạn bị làm nhục lên mạng sẽ khiến hình ảnh tổn thương của bạn ấy bị phát tán rộng rãi. Nếu quay làm bằng chứng, chỉ được gửi riêng cho thầy cô!'
        }
      ]
    }
  },
  {
    id: 'academic_stress',
    title: 'Áp lực học tập, Thi cử & Kỳ vọng gia đình',
    badge: 'Trọng tâm Lớp 8 & Lớp 9',
    icon: '🌱',
    colorTheme: 'sky',
    shortDesc: 'Khi em cảm thấy ngợp vì bài vở, sợ điểm kém, áp lực thi vào Lớp 10 hoặc buồn vì bị bố mẹ so sánh với "con nhà người ta".',
    reassurance: 'Em không phải là một cỗ máy giải đề thi. Điểm số chỉ phản ánh kết quả của một bài kiểm tra, còn lòng nhân hậu, sự nỗ lực và sức khỏe tinh thần của em mới đi theo em suốt cuộc đời.',
    immediateSteps: [
      'Dừng lại hít thở sâu (tập thở 4-4-4 tại Góc Bình Tâm) khi thấy tim đập nhanh hoặc đầu óc trống rỗng.',
      'Chia mục tiêu lớn thành các bước cực nhỏ (chỉ 25 phút ôn 1 chủ đề, làm từ câu dễ nhất).',
      'Trò chuyện với bố mẹ bằng "Thông điệp Tôi" (nói về cảm xúc và kế hoạch cố gắng của con thay vì cãi lại).'
    ],
    dos: [
      'Đảm bảo ngủ đủ 7-8 tiếng mỗi đêm và vận động nhẹ 15 phút mỗi ngày.',
      'Nhờ thầy cô bộ môn hoặc bạn học khá chỉ dẫn ngay phần kiến thức mình bị hổng.'
    ],
    donts: [
      'Không thức trắng đêm uống cà phê/nước tăng lực để học nhồi nhét.',
      'Không giữ kín nỗi sợ trong lòng đến mức kiệt sức.'
    ],
    gradeSpecificAdvice: {
      '6': 'Mới làm quen cách tính điểm và kiểm tra cấp 2, nếu lỡ có 1 điểm chưa cao thì vẫn còn rất nhiều cột điểm thường xuyên để gỡ lại!',
      '7': 'Lập thời gian biểu cân bằng giữa học tập và sở thích cá nhân để mỗi ngày đến trường đều có niềm vui.',
      '8': 'Xây dựng nền tảng các môn cơ bản từ sớm để năm sau lên Lớp 9 không bị dồn bài.',
      '9': 'Có rất nhiều cánh cửa tốt đẹp ở phía trước (THPT công lập, tư thục, trường nghề chất lượng cao). Hãy nỗ lực hết sức nhưng luôn thương yêu bản thân mình nhé!'
    },
    roleplay: {
      situation: 'Em vừa nhận bài kiểm tra Toán giữa kỳ bị điểm thấp hơn kỳ vọng. Về nhà, mẹ nhìn điểm rồi thở dài nói: "Học hành thế này thì làm sao bằng bạn Minh con bác Hà, làm sao đỗ nổi cấp 3?"',
      choices: [
        {
          id: 'a',
          text: 'Hét lên: "Mẹ thương bạn Minh thì nhận bạn ấy làm con đi!" rồi đóng sầm cửa phòng.',
          score: 30,
          verdict: 'Dễ gây căng thẳng thêm',
          feedback: 'Câu nói lúc nóng giận sẽ làm cả mẹ và em đều tổn thương sâu sắc hơn và không giải quyết được áp lực.'
        },
        {
          id: 'b',
          text: 'Hít một hơi sâu, đợi lúc bình tĩnh nói với mẹ: "Con cũng đang rất buồn vì bài thi hôm nay chưa tốt. Khi mẹ so sánh con với bạn khác con càng áp lực hơn. Con đã đánh dấu 2 câu làm sai để mai nhờ cô giảng lại rồi, mẹ tin tưởng và động viên con nhé!"',
          score: 100,
          verdict: 'Chín chắn & Thấu cảm!',
          feedback: 'Cách phản hồi này vừa thể hiện tinh thần trách nhiệm của em, vừa chạm tới trái tim của bố mẹ khiến bố mẹ nhận ra việc so sánh đang làm con tổn thương.'
        },
        {
          id: 'c',
          text: 'Giấu bài kiểm tra đi, giả chữ ký của bố mẹ và tự nhủ mình là kẻ bất tài.',
          score: 20,
          verdict: 'Cần tránh tuyệt đối',
          feedback: 'Giấu điểm chỉ làm nỗi lo sợ phình to hơn mỗi ngày. Thành thật và có kế hoạch sửa sai luôn được thầy cô và bố mẹ trân trọng.'
        }
      ]
    }
  },
  {
    id: 'perpetrator_reflection',
    title: 'Nhận diện & Sửa sai khi lỡ có hành vi bắt nạt bạn',
    badge: 'Cá thể hóa Vai trò (Mục 3.2)',
    icon: '💛',
    colorTheme: 'amber',
    shortDesc: 'Khi em nhận ra mình đã lỡ hùa theo đám đông trêu chọc, chế ảnh, cô lập bạn và muốn dừng lại để sửa sai một cách dũng cảm.',
    reassurance: 'Dám nhận ra lỗi sai và dừng lại đúng lúc không làm em mất mặt, mà chứng minh em là một học sinh có lòng tự trọng, bản lĩnh và trưởng thành. Mọi người đều trân trọng một lời xin lỗi chân thành!',
    immediateSteps: [
      'Dừng ngay lập tức hành vi trêu chọc, xóa ngay các bức ảnh chế hoặc bình luận tiêu cực mà em đã đăng trong nhóm lớp.',
      'Gửi một lời xin lỗi chân thành (trực tiếp hoặc nhắn tin riêng) tới người bạn đã bị tổn thương mà không viện cớ "chỉ đùa thôi".',
      'Chủ động đề nghị với nhóm bạn dừng việc cô lập bạn ấy hoặc nhờ giáo viên tư vấn hỗ trợ hòa giải.'
    ],
    dos: [
      'Thừa nhận thẳng thắn cảm xúc của bạn: "Mình xin lỗi vì trò đùa của mình đã làm cậu buồn".',
      'Hành động bù đắp bằng cách rủ bạn tham gia hoạt động nhóm hoặc chia sẻ tài liệu học tập.'
    ],
    donts: [
      'Không đổ lỗi ngược cho nạn nhân như "Tại cậu nhạy cảm quá thôi chứ tụi mình chỉ đùa".',
      'Không vì sĩ diện trước đám đông mà tiếp tục trêu bạn khi biết bạn đã tổn thương.'
    ],
    gradeSpecificAdvice: {
      '6': 'Ở Lớp 6, nhiều khi em trêu bạn chỉ vì muốn hòa nhập với nhóm bạn mới. Hãy dũng cảm nói lời xin lỗi, bạn ấy sẽ rất cảm kích!',
      '7': 'Đừng để áp lực đồng trang lứa ở Lớp 7 cuốn em vào việc tẩy chay người khác. Người dám nói "Thôi đừng trêu bạn nữa" mới là thủ lĩnh đích thực.',
      '8': 'Ở Lớp 8, hãy làm chủ nút "Share" và bình luận của mình trên mạng. Xóa ngay bài đăng trêu bạn và nhắn tin xin lỗi riêng là hành động cực kỳ văn minh.',
      '9': 'Trước khi ra trường, hãy để lại những kỷ niệm đẹp thay vì sự tổn thương. Một lời xin lỗi chân thành sẽ giúp cả em và bạn đều nhẹ lòng.'
    },
    roleplay: {
      situation: 'Hôm qua em lỡ hùa theo các bạn trong nhóm chat thả "Haha" và bình luận trêu ngoại hình của bạn Nam. Hôm nay đến lớp thấy bạn Nam ngồi cúi mặt buồn bã một mình, em cảm thấy rất áy náy.',
      choices: [
        {
          id: 'a',
          text: 'Cố tình lơ đi và tiếp tục hùa theo nhóm bạn trêu tiếp để khỏi bị quê.',
          score: 15,
          verdict: 'Tiếp tục gây tổn thương',
          feedback: 'Làm vậy sẽ khiến bạn Nam càng tuyệt vọng hơn và chính em cũng sẽ luôn cảm thấy cắn rứt lương tâm.'
        },
        {
          id: 'b',
          text: 'Chủ động xóa bình luận của mình trong nhóm chat, ra chơi đến ngồi cạnh hoặc nhắn riêng cho Nam: "Chuyện tối qua trong nhóm chat mình đã quá vô tâm khi trêu cậu. Mình xóa bình luận rồi, cho mình xin lỗi Nam thật lòng nhé!"',
          score: 100,
          verdict: 'Dũng cảm & Trưởng thành!',
          feedback: 'Tuyệt vời! Lời xin lỗi chân thành và hành động xóa bình luận của em sẽ giúp chữa lành tổn thương của bạn Nam và làm gương cho cả lớp.'
        },
        {
          id: 'c',
          text: 'Nói với Nam: "Tại cậu không biết đùa đấy thôi, có gì đâu mà phải buồn!"',
          score: 25,
          verdict: 'Đổ lỗi cho nạn nhân',
          feedback: 'Một trò đùa chỉ vui khi cả hai cùng vui. Khi người kia bị tổn thương, việc nói "tại cậu không biết đùa" sẽ làm bạn ấy đau lòng gấp đôi.'
        }
      ]
    }
  }
];

const SUPPORT_DIRECTORY = [
  {
    id: 'hotline-111',
    name: 'Tổng đài Quốc gia Bảo vệ Trẻ em 111',
    phone: '111',
    availability: 'Hoạt động 24/7 – Hoàn toàn Miễn phí cước gọi',
    description: 'Đường dây nóng khẩn cấp của Nhà nước chuyên tiếp nhận thông tin, tư vấn tâm lý và can thiệp bảo vệ trẻ em, học sinh khỏi bạo lực, xâm hại, bắt nạt.',
    badge: 'Khẩn cấp Quốc gia'
  },
  {
    id: 'school-counselor',
    name: 'Phòng Tư vấn Tâm lý Học đường – Trạm Nắng Ấm',
    phone: '1800-6868 (Nội bộ) / P.202 Nhà A',
    availability: 'Thứ 2 – Thứ 7 (07:30 – 17:30) & Trực Hộp thư 24/7',
    description: 'Không gian lắng nghe trực tiếp hoặc ẩn danh cùng Chuyên gia Tâm lý Giáo dục của nhà trường. Bảo mật tuyệt đối thông tin học sinh.',
    badge: 'Tại trường'
  },
  {
    id: 'unicef-mental-health',
    name: 'Chương trình Chăm sóc Sức khỏe Tâm thần Thanh thiếu niên',
    phone: '1900-1267',
    availability: 'Hỗ trợ tư vấn tâm lý chuyên sâu cho lứa tuổi 11–18',
    description: 'Lắng nghe và hướng dẫn kỹ năng vượt qua khủng hoảng tuổi dậy thì, lo âu thi cử và mâu thuẫn gia đình.',
    badge: 'Tư vấn Chuyên gia'
  }
];

const INITIAL_DB = {
  settings: {
    schoolName: process.env.SCHOOL_NAME || 'Trường THCS Nắng Ấm',
    counselorName: process.env.COUNSELOR_NAME || 'ThS. Tâm lý Nguyễn Minh Tâm (20 năm kinh nghiệm)',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    integrations: {
      zaloQuickLinks: {
        zalo_psych: process.env.ZALO_PSYCH_LINK || '0901234567',
        zalo_gvcn: process.env.ZALO_GVCN_LINK || '0902345678',
        zalo_bgh: process.env.ZALO_BGH_LINK || 'https://zalo.me/g/bghnangam2026'
      },
      zaloWebhooks: {
        zalo_psych: process.env.ZALO_WEBHOOK_ZALO_PSYCH || '',
        zalo_gvcn: process.env.ZALO_WEBHOOK_ZALO_GVCN || '',
        zalo_bgh: process.env.ZALO_WEBHOOK_ZALO_BGH || ''
      },
      googleSheetWebhookUrl: process.env.GOOGLE_SHEET_WEBHOOK_URL || '',
      googleSheetPublicUrl: process.env.GOOGLE_SHEET_PUBLIC_URL || '',
      alertEmails: process.env.ALERT_EMAILS || '',
      googleSheetName: 'Quản Lý Hộp Thư Báo Cáo Bắt Nạt THCS (Trung Tâm)'
    }
  },
  moodLogs: [
    {
      id: 'm-1',
      nickname: 'Sóc Nhỏ Chăm Chỉ',
      grade: '6',
      mood: 'happy',
      moodLabel: 'Vui vẻ & Hào hứng',
      note: 'Hôm nay em đã mạnh dạn bắt chuyện và làm quen được với 2 bạn mới ở tổ 3!',
      createdAt: '2026-11-16T09:15:00.000Z'
    },
    {
      id: 'm-2',
      nickname: 'Mèo Con Dũng Cảm',
      grade: '7',
      mood: 'anxious',
      moodLabel: 'Hơi lo lắng',
      note: 'Nhóm bạn trong lớp có chút hiểu lầm nhưng sau khi đọc La Bàn Ứng Phó em đã biết cách giữ bình tĩnh.',
      createdAt: '2026-11-16T14:20:00.000Z'
    },
    {
      id: 'm-3',
      nickname: 'Hải Âu Xanh',
      grade: '8',
      mood: 'calm',
      moodLabel: 'Bình yên & Nhẹ nhõm',
      note: 'Bài tập thở 4-4-4 giúp em bớt căng thẳng hẳn trước giờ kiểm tra Hóa.',
      createdAt: '2026-11-17T07:30:00.000Z'
    },
    {
      id: 'm-4',
      nickname: 'Hướng Dương Kiên Cường',
      grade: '9',
      mood: 'stressed',
      moodLabel: 'Áp lực học tập',
      note: 'Đang ôn thi học kỳ Lớp 9 hơi mệt nhưng đọc được lời chúc trên Vườn Hoa Tử Tế thấy ấm lòng lắm!',
      createdAt: '2026-11-17T08:10:00.000Z'
    }
  ],
  kindnessMessages: [
    {
      id: 'k-1',
      fromNickname: 'Gấu Bông Lớp 9A',
      grade: '9',
      toTarget: 'Các em Lớp 6 mới vào trường',
      message: 'Chào đón các em Lớp 6 nhé! Hồi mới vào trường anh chị cũng bỡ ngỡ lắm, đừng sợ nha, có gì cần giúp cứ hỏi anh chị hoặc vào Trạm Nắng Ấm nhé! 🌻',
      likes: 28,
      color: 'amber',
      createdAt: '2026-11-15T10:00:00.000Z'
    },
    {
      id: 'k-2',
      fromNickname: 'Cánh Cụt Tốt Bụng',
      grade: '7',
      toTarget: 'Những bạn đang cảm thấy cô đơn',
      message: 'Nếu hôm nay ở lớp chưa ai ngồi cùng cậu thì đừng buồn nhé. Cậu là một người rất tuyệt vời và xứng đáng có những người bạn chân thành! 💛',
      likes: 35,
      color: 'teal',
      createdAt: '2026-11-16T11:30:00.000Z'
    },
    {
      id: 'k-3',
      fromNickname: 'Mây Trắng Lớp 8',
      grade: '8',
      toTarget: 'Tất cả các bạn khối 6, 7, 8, 9',
      message: 'Ngoại hình của mỗi chúng mình đều đáng trân trọng. Đừng để lời trêu chọc vô tâm của ai đó làm tắt đi nụ cười rạng rỡ của cậu hôm nay nha! ✨',
      likes: 42,
      color: 'coral',
      createdAt: '2026-11-16T16:45:00.000Z'
    },
    {
      id: 'k-4',
      fromNickname: 'Cô Minh Tâm (Phòng Tâm Lý)',
      grade: 'GV',
      toTarget: 'Các học sinh thân yêu',
      message: 'Cánh cửa Phòng Tâm lý và Trạm Nắng Ấm luôn rộng mở. Lên tiếng bảo vệ bản thân và bạn bè là hành động dũng cảm nhất! Cô luôn tự hào về các em. 🌈',
      likes: 64,
      color: 'sky',
      createdAt: '2026-11-17T07:00:00.000Z'
    }
  ],
  helpRequests: [
    {
      id: 'hr-100',
      trackingCode: 'NA-7868',
      isAnonymous: true,
      nickname: 'Gấu Bông Dũng Cảm',
      studentName: '',
      grade: '7',
      className: '',
      category: 'isolation',
      categoryLabel: 'Bị tẩy chay, cô lập trong lớp',
      urgency: 'high',
      recipient: 'Phòng Tư vấn Tâm lý Học đường',
      locationAndTime: 'Lớp học tầng 2 & Nhóm chat Zalo của lớp',
      description: 'Trong lớp có một nhóm bạn rủ nhau cô lập em, không cho em vào nhóm làm bài tập Lịch sử và còn nhắn tin trêu chọc em trong nhóm chat. Em sợ nếu nói tên thật sẽ bị các bạn ghét thêm nên em gửi ẩn danh mong thầy cô giúp đỡ ạ.',
      status: 'replied',
      counselorReply: 'Chào Gấu Bông Dũng Cảm! Cô Minh Tâm (Phòng Tâm lý) và Giáo viên Chủ nhiệm đã nhận được thông báo qua Luồng Zalo Định Tuyến. Chiều nay trong tiết Hoạt động trải nghiệm, GVCN sẽ chủ động bốc thăm chia lại toàn bộ các nhóm học tập trong lớp một cách ngẫu nhiên, đồng thời nhắc nhở quy tắc văn minh trên nhóm Zalo lớp. Danh tính của em được bảo vệ bí mật 100%, em yên tâm đến lớp nhé! 🌻',
      repliedBy: 'ThS. Nguyễn Minh Tâm (Phòng Tâm lý) & GVCN Khối 7',
      repliedAt: '2026-11-17T09:15:00.000Z',
      createdAt: '2026-11-17T07:45:00.000Z',
      zaloDispatch: {
        primaryChannel: 'zalo_psych',
        primaryChannelName: 'Zalo Phòng Tâm Lý',
        routedChannels: ['zalo_psych', 'zalo_bgh'],
        routedChannelNames: ['Zalo Phòng Tâm Lý', 'Zalo Ban Giám Hiệu'],
        dispatchedAt: '2026-11-17T07:45:02.000Z'
      },
      googleSheetSync: {
        sheetName: 'Quản Lý Hộp Thư Cầu Viện THCS (Trung Tâm)',
        rowNumber: 2,
        syncStatus: 'synced_local_and_ready',
        syncedAt: '2026-11-17T09:15:01.000Z'
      },
      studentFollowUps: [
        {
          message: 'Dạ em cảm ơn cô nhiều lắm ạ! Đọc lời nhắn của cô em thấy yên tâm hơn rất nhiều rồi ạ!',
          createdAt: '2026-11-17T09:40:00.000Z'
        }
      ]
    },
    {
      id: 'hr-101',
      trackingCode: 'NA-2026',
      isAnonymous: true,
      nickname: 'Sóc Nhỏ Lớp 6',
      studentName: '',
      grade: '6',
      className: '',
      category: 'verbal_bullying',
      categoryLabel: 'Trêu chọc ngoại hình / Đặt biệt danh xấu',
      urgency: 'medium',
      recipient: 'Giáo viên Chủ nhiệm khối',
      locationAndTime: 'Trong lớp 6A3 vào giờ ra chơi tiết 2 buổi sáng',
      description: 'Có 2 bạn bàn cuối hay lấy hộp bút của em giấu đi rồi chê em lùn trước mặt cả lớp. Em nhắc nhưng các bạn cứ cười. Em mong thầy cô nhắc nhở chung cả lớp giúp em để các bạn không biết em báo ạ.',
      status: 'replied',
      counselorReply: 'Chào Sóc Nhỏ dũng cảm của cô! Thông tin đã được chuyển tới Luồng Zalo Giáo viên Chủ nhiệm. Sáng mai trong giờ sinh hoạt 15 phút đầu giờ, cô chủ nhiệm sẽ tổ chức trò chơi "Tôn trọng sự khác biệt & Giữ gìn đồ dùng lớp học" và xếp lại sơ đồ chỗ ngồi cuối lớp thật tự nhiên. Em hoàn toàn yên tâm là không ai biết em đã nhắn cho cô nhé! 🌻',
      repliedBy: 'Cô Giáo viên Chủ nhiệm Khối 6 & Phòng Tâm lý',
      repliedAt: '2026-11-16T15:30:00.000Z',
      createdAt: '2026-11-16T10:15:00.000Z',
      zaloDispatch: {
        primaryChannel: 'zalo_gvcn',
        primaryChannelName: 'Zalo GV Chủ Nhiệm',
        routedChannels: ['zalo_gvcn'],
        routedChannelNames: ['Zalo GV Chủ Nhiệm'],
        dispatchedAt: '2026-11-16T10:15:01.000Z'
      },
      googleSheetSync: {
        sheetName: 'Quản Lý Hộp Thư Cầu Viện THCS (Trung Tâm)',
        rowNumber: 3,
        syncStatus: 'synced_local_and_ready',
        syncedAt: '2026-11-16T15:30:02.000Z'
      },
      studentFollowUps: []
    },
    {
      id: 'hr-102',
      trackingCode: 'NA-6868',
      isAnonymous: true,
      nickname: 'Hải Âu Lớp 8',
      studentName: '',
      grade: '8',
      className: '',
      category: 'cyber_bullying',
      categoryLabel: 'Bắt nạt trên mạng / Group Chat',
      urgency: 'high',
      recipient: 'Ban Giám hiệu & Ban An toàn trường học',
      locationAndTime: 'Nhóm chat Messenger không chính thức của khối 8 tối hôm qua',
      description: 'Em phát hiện có một tài khoản ảo đăng ảnh chụp lén một bạn nữ lớp em kèm lời lẽ body shaming rất nặng nề làm bạn ấy hôm nay khóc không dám đi học. Em là người chứng kiến nên muốn báo ẩn danh để nhà trường bảo vệ bạn ấy ạ.',
      status: 'replied',
      counselorReply: 'Cảm ơn Hải Âu Lớp 8 vì hành động "Người chứng kiến thông thái" vô cùng nhân văn! Ban Giám hiệu và Phòng Tâm lý đã nhận cảnh báo qua Luồng Zalo Ban Giám hiệu, làm việc ngay với quản trị viên nhóm chat để gỡ toàn bộ hình ảnh vi phạm, đồng thời cô đã liên hệ động viên riêng bạn nữ. Nhà trường rất trân trọng tấm lòng bảo vệ bạn của em!',
      repliedBy: 'Ban Giám hiệu & Phòng Tâm lý Học đường',
      repliedAt: '2026-11-17T08:00:00.000Z',
      createdAt: '2026-11-16T21:10:00.000Z',
      zaloDispatch: {
        primaryChannel: 'zalo_bgh',
        primaryChannelName: 'Zalo Ban Giám Hiệu',
        routedChannels: ['zalo_bgh', 'zalo_psych'],
        routedChannelNames: ['Zalo Ban Giám Hiệu', 'Zalo Phòng Tâm Lý'],
        dispatchedAt: '2026-11-16T21:10:02.000Z'
      },
      googleSheetSync: {
        sheetName: 'Quản Lý Hộp Thư Cầu Viện THCS (Trung Tâm)',
        rowNumber: 4,
        syncStatus: 'synced_local_and_ready',
        syncedAt: '2026-11-17T08:00:01.000Z'
      },
      studentFollowUps: []
    },
    {
      id: 'hr-103',
      trackingCode: 'NA-9090',
      isAnonymous: false,
      nickname: 'Hướng Dương 9A',
      studentName: 'Lê Hoàng Minh',
      grade: '9',
      className: '9A2',
      category: 'academic_stress',
      categoryLabel: 'Áp lực học tập, thi cử & Gia đình',
      urgency: 'low',
      recipient: 'Phòng Tư vấn Tâm lý Học đường',
      locationAndTime: 'Hẹn gặp tại Phòng Tâm lý P.202 chiều thứ Năm',
      description: 'Dạo này em rất lo lắng chuyện thi vào lớp 10, cộng thêm bạn thân chuyển trường nên trên lớp em thấy cô đơn và mất ngủ. Em muốn đăng ký gặp cô tư vấn 1 buổi chiều thứ Năm tuần này ạ.',
      status: 'pending',
      counselorReply: '',
      repliedBy: '',
      repliedAt: null,
      createdAt: '2026-11-17T08:30:00.000Z',
      zaloDispatch: {
        primaryChannel: 'zalo_psych',
        primaryChannelName: 'Zalo Phòng Tâm Lý',
        routedChannels: ['zalo_psych'],
        routedChannelNames: ['Zalo Phòng Tâm Lý'],
        dispatchedAt: '2026-11-17T08:30:01.000Z'
      },
      googleSheetSync: {
        sheetName: 'Quản Lý Hộp Thư Cầu Viện THCS (Trung Tâm)',
        rowNumber: 5,
        syncStatus: 'synced_local_and_ready',
        syncedAt: '2026-11-17T08:30:02.000Z'
      },
      studentFollowUps: []
    }
  ]
};

// Chế độ chạy dữ liệu thật: đặt biến môi trường DEMO_DATA=off để xóa toàn bộ dữ liệu mẫu
const DEMO_MODE = String(process.env.DEMO_DATA || 'on').toLowerCase() !== 'off';
if (!DEMO_MODE) {
  INITIAL_DB.moodLogs = [];
  INITIAL_DB.kindnessMessages = [];
  INITIAL_DB.helpRequests = [];
}

module.exports = {
  DEMO_MODE,
  INTERACTIVE_SCENARIOS,
  SUPPORT_DIRECTORY,
  INITIAL_DB
};
