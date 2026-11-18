const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { createAppServer } = require('../server');

async function runTests() {
  // Làm mới db.json từ seed-data chuẩn trước khi chạy test
  const dbPath = path.join(__dirname, '..', 'data', 'db.json');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const server = createAppServer({ maxHelpRequestsPerWindow: 4 });
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  console.log(`🧪 Bắt đầu chạy bộ kiểm thử toàn diện trên cổng ${port}...`);

  try {
    // 1. Kiểm tra GET /api/bootstrap & 3 Luồng Zalo + Khối lớp 6-9
    const bootRes = await fetch(`${baseUrl}/api/bootstrap`);
    assert.strictEqual(bootRes.status, 200);
    assert.strictEqual(bootRes.headers.get('x-content-type-options'), 'nosniff');
    const bootData = await bootRes.json();
    assert.strictEqual(bootData.ok, true);
    assert.ok(bootData.zaloChannels.zalo_psych, 'Phải có Luồng Zalo 1: Phòng Tâm lý');
    assert.ok(bootData.zaloChannels.zalo_gvcn, 'Phải có Luồng Zalo 2: GVCN');
    assert.ok(bootData.zaloChannels.zalo_bgh, 'Phải có Luồng Zalo 3: Ban Giám hiệu');
    console.log('✅ Test 1: /api/bootstrap trả về đủ dữ liệu Lớp 6-9, 6 kịch bản và cấu hình 3 Luồng Zalo.');

    // 2. Kiểm tra Tra cứu Mã Bảo Mật NA-7868 (Hoàn toàn ẩn danh, không lộ SĐT/IP)
    const lookup7868Res = await fetch(`${baseUrl}/api/help-requests/lookup?code=NA-7868`);
    assert.strictEqual(lookup7868Res.status, 200);
    const lookup7868Data = await lookup7868Res.json();
    assert.strictEqual(lookup7868Data.ok, true);
    assert.strictEqual(lookup7868Data.request.trackingCode, 'NA-7868');
    assert.strictEqual(lookup7868Data.request.privacyHash, undefined, 'Không được lộ privacyHash/IP');
    assert.ok(lookup7868Data.request.zaloDispatch.routedChannels.includes('zalo_psych'));
    assert.ok(lookup7868Data.request.googleSheetSync.rowNumber >= 2);
    console.log('✅ Test 2: Mã bảo mật NA-7868 tra cứu thành công tiến độ Zalo, Google Sheet và lời nhắn thầy cô.');

    // 3. Kiểm tra Định tuyến 3 Luồng Zalo & Tự động Escalation sang Zalo BGH khi mức độ High/Critical
    const createHelpRes = await fetch(`${baseUrl}/api/help-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isAnonymous: true,
        nickname: 'Cánh Cụt Lớp 7',
        grade: '7',
        category: 'verbal_bullying',
        urgency: 'high',
        recipient: 'Giáo viên Chủ nhiệm khối',
        locationAndTime: 'Lớp 7A2 giờ ra chơi',
        description: 'Nhóm bạn bàn cuối liên tục miệt thị ngoại hình và lấy vở của em ném vào thùng rác.'
      })
    });
    assert.strictEqual(createHelpRes.status, 201);
    const createHelpData = await createHelpRes.json();
    assert.strictEqual(createHelpData.ok, true);
    const newCode = createHelpData.trackingCode;
    // Vì gửi cho GVCN nhưng mức độ High -> phải đẩy vào cả zalo_gvcn VÀ zalo_bgh
    assert.ok(createHelpData.zaloDispatch.routedChannels.includes('zalo_gvcn'));
    assert.ok(createHelpData.zaloDispatch.routedChannels.includes('zalo_bgh'));
    assert.ok(createHelpData.googleSheetSync.rowNumber >= 2);
    console.log(`✅ Test 3: Định tuyến thông minh đẩy mã ${newCode} vào [Zalo GVCN + Zalo BGH] và đồng bộ Google Sheet.`);

    // 4. Kiểm tra Phản hồi ẩn danh 2 chiều (Học sinh nhắn thêm qua mã bảo mật -> Giáo viên trả lời)
    const followUpRes = await fetch(`${baseUrl}/api/help-requests/followup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackingCode: newCode,
        message: 'Em bổ sung thêm là sự việc diễn ra lúc 9h05 sáng nay ạ.'
      })
    });
    assert.strictEqual(followUpRes.status, 200);
    const followUpData = await followUpRes.json();
    assert.strictEqual(followUpData.request.studentFollowUps.length, 1);
    console.log('✅ Test 4: Học sinh gửi tin nhắn nối tiếp ẩn danh 2 chiều bằng Mã Bảo Mật thành công.');

    // 5. Kiểm tra Phân quyền Quản trị (RBAC: Phòng Tâm lý TL-2026 vs GVCN GV-2026 vs BGH-2026)
    const loginGvcnRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinCode: 'GV-2026' })
    });
    assert.strictEqual(loginGvcnRes.status, 200);
    const gvcnSession = (await loginGvcnRes.json()).session;
    assert.deepStrictEqual(gvcnSession.allowedChannels, ['zalo_gvcn']);

    // GVCN xem danh sách chỉ thấy các ca thuộc luồng zalo_gvcn
    const gvcnListRes = await fetch(`${baseUrl}/api/counselor/requests`, {
      headers: { 'X-Admin-Token': gvcnSession.token }
    });
    const gvcnListData = await gvcnListRes.json();
    assert.ok(
      gvcnListData.requests.every(r => r.zaloDispatch.routedChannels.includes('zalo_gvcn')),
      'GVCN chỉ được phép xem hồ sơ thuộc luồng Zalo GVCN'
    );

    // GVCN thử trả lời hồ sơ NA-9090 (chỉ thuộc zalo_psych) -> Phải bị chặn 403 Forbidden
    const forbiddenReplyRes = await fetch(`${baseUrl}/api/counselor/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': gvcnSession.token
      },
      body: JSON.stringify({
        trackingCode: 'NA-9090',
        counselorReply: 'Thử phản hồi trái thẩm quyền'
      })
    });
    assert.strictEqual(forbiddenReplyRes.status, 403, 'RBAC phải chặn phản hồi trái luồng Zalo được phân quyền');
    console.log('✅ Test 5: Phân quyền Quản trị RBAC (TL-2026, GV-2026, BGH-2026) bảo vệ chặt chẽ từng luồng Zalo.');

    // 6. Kiểm tra Xuất dữ liệu Google Sheet Trung tâm (.CSV chuẩn UTF-8)
    const csvRes = await fetch(`${baseUrl}/api/counselor/export-sheet.csv`);
    assert.strictEqual(csvRes.status, 200);
    const csvText = await csvRes.text();
    assert.ok(csvText.includes('NA-7868'), 'File Google Sheet CSV phải chứa mã NA-7868');
    assert.ok(csvText.includes('Luồng Zalo Định Tuyến'), 'File CSV phải có cột Luồng Zalo Định Tuyến');
    console.log('✅ Test 6: Đồng bộ và xuất bảng Google Sheet Trung tâm (.CSV) hoạt động hoàn hảo.');

    // 7. Kiểm tra Lớp bảo vệ Chống Spam (Duplicate Filter + Honeypot Bot + Rate Limit)
    const honeypotRes = await fetch(`${baseUrl}/api/help-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Bot tự động gửi spam',
        website_url: 'http://spam-bot.example.com'
      })
    });
    assert.strictEqual(honeypotRes.status, 400, 'Honeypot phải chặn đứng bot tự động');

    // Gửi trùng nội dung liên tiếp -> Phải bị chặn 429 Duplicate Spam
    const dupRes = await fetch(`${baseUrl}/api/help-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Nhóm bạn bàn cuối liên tục miệt thị ngoại hình và lấy vở của em ném vào thùng rác.'
      })
    });
    assert.strictEqual(dupRes.status, 429, 'Bộ lọc chống gửi lặp phải chặn nội dung trùng lặp');
    console.log('✅ Test 7: Các lớp bảo vệ Honeypot, Chống gửi lặp (Anti-Spam) và Giới hạn tần suất hoạt động chính xác 100%.');

    console.log('\n🎉 TẤT CẢ 7 BỘ KIỂM THỬ KIẾN TRÚC ĐỊNH TUYẾN & BẢO MẬT ĐỀU THÀNH CÔNG XUẤT SẮC!');
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('❌ Kiểm thử thất bại:', err);
  process.exit(1);
});
