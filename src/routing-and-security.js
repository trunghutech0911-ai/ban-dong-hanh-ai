const crypto = require('crypto');

/**
 * CẤU HÌNH 3 LUỒNG ĐỊNH TUYẾN ZALO CHUYÊN BIỆT CỦA NHÀ TRƯỜNG
 * - Luồng 1: Zalo Cá nhân Giáo viên Tư vấn Tâm lý Học đường
 * - Luồng 2: Zalo Cá nhân Giáo viên Chủ nhiệm (GVCN)
 * - Luồng 3: Nhóm (Group) Zalo Ban Giám hiệu & Ban Bảo vệ Trẻ em
 */
const ZALO_CHANNELS = {
  zalo_psych: {
    id: 'zalo_psych',
    name: 'Luồng Zalo 1 (Cá nhân): Giáo viên Tư vấn Tâm lý Học đường',
    shortName: 'Zalo Cá nhân GV Tâm Lý',
    channelType: 'personal',
    badgeColor: 'teal',
    managerRole: 'psych',
    defaultContact: '0901234567',
    defaultQuickUrl: 'https://zalo.me/0901234567',
    description: 'Kết nối trực tiếp Zalo cá nhân Chuyên viên Tâm lý để tiếp nhận tâm sự ẩn danh, bị cô lập, áp lực học tập/thi cử.'
  },
  zalo_gvcn: {
    id: 'zalo_gvcn',
    name: 'Luồng Zalo 2 (Cá nhân): Giáo viên Chủ nhiệm Khối 6 – 9',
    shortName: 'Zalo Cá nhân GV Chủ Nhiệm',
    channelType: 'personal',
    badgeColor: 'amber',
    managerRole: 'gvcn',
    defaultContact: '0902345678',
    defaultQuickUrl: 'https://zalo.me/0902345678',
    description: 'Kết nối trực tiếp Zalo cá nhân GVCN để xử lý trêu chọc ngoại hình, giấu đồ dùng, mâu thuẫn nhóm bạn, xếp lại chỗ ngồi.'
  },
  zalo_bgh: {
    id: 'zalo_bgh',
    name: 'Luồng Zalo 3 (Group): Nhóm Zalo Ban Giám hiệu & An toàn Trường học',
    shortName: 'Group Zalo Ban Giám Hiệu',
    channelType: 'group',
    badgeColor: 'rose',
    managerRole: 'bgh',
    defaultContact: 'https://zalo.me/g/bghnangam2026',
    defaultQuickUrl: 'https://zalo.me/g/bghnangam2026',
    description: 'Đẩy thẳng vào Group Zalo Ban Giám hiệu các vụ bắt nạt thể chất, trấn lột, bạo lực mạng và tự động CC mọi ca Khẩn cấp (Bước 3B).'
  }
};

/**
 * PHÂN QUYỀN QUẢN TRỊ (RBAC) CHO 3 VAI TRÒ NHÀ TRƯỜNG
 */
const ADMIN_ROLES = {
  psych: {
    role: 'psych',
    title: 'Chuyên gia Phòng Tâm lý Học đường',
    pinCode: String(process.env.PIN_PSYCH || 'TL-2026').toUpperCase(),
    allowedChannels: ['zalo_psych'],
    canExportSheet: true,
    canConfigWebhooks: false
  },
  gvcn: {
    role: 'gvcn',
    title: 'Giáo viên Chủ nhiệm Khối 6–9',
    pinCode: String(process.env.PIN_GVCN || 'GV-2026').toUpperCase(),
    allowedChannels: ['zalo_gvcn'],
    canExportSheet: false,
    canConfigWebhooks: false
  },
  bgh: {
    role: 'bgh',
    title: 'Ban Giám hiệu & Quản trị Hệ thống (Toàn quyền)',
    pinCode: String(process.env.PIN_BGH || 'BGH-2026').toUpperCase(),
    allowedChannels: ['zalo_psych', 'zalo_gvcn', 'zalo_bgh'],
    canExportSheet: true,
    canConfigWebhooks: true
  }
};

/**
 * Xác định luồng Zalo chính và các luồng Zalo đồng nhận (CC/Escalation)
 */
function determineZaloRouting({ recipient = '', category = '', urgency = 'medium' }) {
  const recLower = String(recipient).toLowerCase();
  let primaryChannel = 'zalo_psych';

  if (recLower.includes('chủ nhiệm') || recLower.includes('gvcn')) {
    primaryChannel = 'zalo_gvcn';
  } else if (recLower.includes('giám hiệu') || recLower.includes('bgh') || recLower.includes('an toàn')) {
    primaryChannel = 'zalo_bgh';
  } else if (category === 'physical_bullying') {
    primaryChannel = 'zalo_bgh';
  } else if (category === 'verbal_bullying') {
    primaryChannel = 'zalo_gvcn';
  }

  const routedChannels = [primaryChannel];

  // Quy tắc Escalation tự động: Nếu mức độ High hoặc Critical, bắt buộc đẩy đồng thời vào Luồng 3 (Ban Giám hiệu)
  if ((urgency === 'high' || urgency === 'critical') && !routedChannels.includes('zalo_bgh')) {
    routedChannels.push('zalo_bgh');
  }

  // Nếu là bắt nạt mạng hoặc tẩy chay mức độ cao, phối hợp thêm Phòng Tâm lý
  if ((category === 'cyber_bullying' || category === 'isolation') && !routedChannels.includes('zalo_psych')) {
    routedChannels.push('zalo_psych');
  }

  return {
    primaryChannel,
    primaryChannelName: ZALO_CHANNELS[primaryChannel].shortName,
    routedChannels,
    routedChannelNames: routedChannels.map(id => ZALO_CHANNELS[id].shortName)
  };
}

/**
 * Chuẩn hóa số điện thoại hoặc link Zalo thành đường dẫn mở Zalo trực tiếp (zalo.me/...)
 */
function buildZaloDirectUrl(rawInput = '', defaultUrl = 'https://zalo.me/0901234567') {
  const val = String(rawInput || '').trim();
  if (!val) return defaultUrl;
  if (val.startsWith('http://') || val.startsWith('https://')) {
    return val;
  }
  const digits = val.replace(/[^0-9]/g, '');
  if (digits.length >= 8) {
    return `https://zalo.me/${digits}`;
  }
  return `https://zalo.me/${encodeURIComponent(val)}`;
}

/**
 * Đẩy thông báo vào 3 luồng Zalo (Hỗ trợ cả Link Zalo Cá nhân / Group QR VÀ Webhook tự động)
 */
async function dispatchToZaloStreams(requestItem, integrationConfig = {}) {
  const routing = determineZaloRouting({
    recipient: requestItem.recipient,
    category: requestItem.category,
    urgency: requestItem.urgency
  });

  const urgencyIcons = {
    low: '🟢 [BƯỚC 3A - TÂM SỰ / XIN LỜI KHUYÊN]',
    medium: '🟡 [BƯỚC 3A - CẦN LƯU Ý HỖ TRỢ]',
    high: '🟠 [BƯỚC 3B - CẢNH BÁO NGUY CƠ CAO]',
    critical: '🔴 [BƯỚC 3B KHẨN CẤP - ĐE DỌA AN TOÀN]'
  };

  const zaloMessage = [
    `${urgencyIcons[requestItem.urgency] || urgencyIcons.medium}`,
    `📌 Mã hồ sơ: ${requestItem.trackingCode}`,
    `🏫 Khối: Lớp ${requestItem.grade} (${requestItem.isAnonymous ? `Ẩn danh: ${requestItem.nickname}` : `${requestItem.studentName} - ${requestItem.className}`})`,
    `📂 Phân loại: ${requestItem.categoryLabel}`,
    `📍 Địa điểm/Thời gian: ${requestItem.locationAndTime}`,
    requestItem.evidenceNote ? `📎 Bằng chứng: ${requestItem.evidenceNote}` : null,
    requestItem.contactMethod ? `📞 Liên hệ HS: ${requestItem.contactMethod}` : null,
    `💬 Nội dung: "${requestItem.description}"`,
    `🔗 Định tuyến: ${routing.routedChannelNames.join(' + ')}`
  ]
    .filter(Boolean)
    .join('\n');

  const deliveries = [];
  for (const chId of routing.routedChannels) {
    const channelMeta = ZALO_CHANNELS[chId];
    const quickContact = integrationConfig?.zaloQuickLinks?.[chId] || channelMeta.defaultContact;
    const directZaloUrl = buildZaloDirectUrl(quickContact, channelMeta.defaultQuickUrl);
    const webhookUrl =
      integrationConfig?.zaloWebhooks?.[chId] ||
      process.env[`ZALO_WEBHOOK_${chId.toUpperCase()}`] ||
      '';
    let webhookStatus = 'ready_quick_connect';

    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channel: chId,
            channelType: channelMeta.channelType,
            trackingCode: requestItem.trackingCode,
            urgency: requestItem.urgency,
            directZaloUrl,
            text: zaloMessage
          })
        });
        webhookStatus = resp.ok ? 'webhook_delivered' : `webhook_http_${resp.status}`;
      } catch (_err) {
        webhookStatus = 'webhook_queued_offline';
      }
    }

    deliveries.push({
      channelId: chId,
      channelName: channelMeta.name,
      shortName: channelMeta.shortName,
      channelType: channelMeta.channelType,
      directZaloUrl,
      status: webhookStatus,
      dispatchedAt: new Date().toISOString()
    });
  }

  return {
    primaryChannel: routing.primaryChannel,
    primaryChannelName: routing.primaryChannelName,
    routedChannels: routing.routedChannels,
    routedChannelNames: routing.routedChannelNames,
    zaloMessagePreview: zaloMessage,
    deliveries,
    dispatchedAt: new Date().toISOString()
  };
}

/**
 * ĐỒNG BỘ DỮ LIỆU 2 CHIỀU VỀ GOOGLE SHEET TRUNG TÂM & KÍCH HOẠT EMAIL CẢNH BÁO KHẨN BƯỚC 3B
 */
async function syncRequestToGoogleSheet(
  requestItem,
  integrationConfig = {},
  totalRowsCount = 1,
  syncOptions = {}
) {
  const evidenceParts = [
    requestItem.evidenceNote ? `Bằng chứng: ${requestItem.evidenceNote}` : '',
    requestItem.contactMethod ? `Liên hệ: ${requestItem.contactMethod}` : ''
  ].filter(Boolean);

  const sheetRow = {
    rowNumber: totalRowsCount + 1, // Hàng 1 là tiêu đề cột
    trackingCode: requestItem.trackingCode,
    createdAt: requestItem.createdAt,
    grade: `Lớp ${requestItem.grade}`,
    identityMode: requestItem.isAnonymous ? 'Ẩn danh 100%' : 'Có định danh',
    studentDisplay: requestItem.isAnonymous
      ? requestItem.nickname
      : `${requestItem.studentName} (${requestItem.className})`,
    categoryLabel: requestItem.categoryLabel,
    urgency: String(requestItem.urgency || 'medium').toUpperCase(),
    zaloChannels: (requestItem.zaloDispatch?.routedChannelNames || [requestItem.recipient]).join(' | '),
    locationAndTime: requestItem.locationAndTime,
    evidenceAndContact: evidenceParts.join(' | '),
    description: requestItem.description,
    status: requestItem.status === 'replied' ? 'ĐÃ PHẢN HỒI' : 'CHỜ XỬ LÝ',
    counselorReply: requestItem.counselorReply || '',
    repliedBy: requestItem.repliedBy || '',
    repliedAt: requestItem.repliedAt || ''
  };

  // Bản ghi chuẩn hóa không chứa privacyHash để lưu cột JSON_SYNC phục vụ đọc ngược 2 chiều
  const { privacyHash, aiCoPilotBriefing, ...portableRecord } = requestItem;
  const aiCoPilotSummary = aiCoPilotBriefing
    ? [
        aiCoPilotBriefing.situationTitle,
        `Căn cứ pháp lý: ${aiCoPilotBriefing.legalBasis}`,
        ...(aiCoPilotBriefing.tacticalSteps || [])
      ].join('\n')
    : '';

  const alertEmails =
    integrationConfig?.alertEmails ||
    process.env.ALERT_EMAILS ||
    '';

  let syncStatus = 'synced_local_and_ready';
  let emailAlertTriggered = false;
  const sheetWebhookUrl =
    integrationConfig?.googleSheetWebhookUrl ||
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    '';

  if (sheetWebhookUrl && sheetWebhookUrl.startsWith('http')) {
    try {
      const resp = await fetch(sheetWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({
          action: 'UPSERT_ROW',
          isNew: Boolean(syncOptions.isNew),
          alertEmails,
          aiCoPilotSummary,
          row: sheetRow,
          rawRecord: portableRecord
        })
      });
      if (resp.ok) {
        syncStatus = 'synced_cloud_2way';
        try {
          const data = await resp.json();
          if (data?.rowNumber) sheetRow.rowNumber = data.rowNumber;
          emailAlertTriggered = Boolean(data?.emailSent);
        } catch (_parseErr) {
          // Bỏ qua nếu Apps Script trả về text
        }
      } else {
        syncStatus = `cloud_http_${resp.status}`;
      }
    } catch (_e) {
      syncStatus = 'queued_local_mirror';
    }
  }

  return {
    sheetName: 'Quản Lý Hộp Thư Báo Cáo Bắt Nạt THCS (Trung Tâm)',
    rowNumber: sheetRow.rowNumber,
    syncStatus,
    emailAlertTriggered,
    syncedAt: new Date().toISOString(),
    columns: sheetRow
  };
}

/**
 * ĐỌC NGƯỢC DANH SÁCH HỒ SƠ TỪ GOOGLE SHEET (LƯU TRỮ BỀN VỮNG 2 CHIỀU KHI VERCEL KHỞI ĐỘNG LẠI)
 */
async function fetchRequestsFromGoogleSheet(integrationConfig = {}) {
  const sheetWebhookUrl =
    integrationConfig?.googleSheetWebhookUrl ||
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    '';
  if (!sheetWebhookUrl || !sheetWebhookUrl.startsWith('http')) {
    return null;
  }

  try {
    const sep = sheetWebhookUrl.includes('?') ? '&' : '?';
    const resp = await fetch(`${sheetWebhookUrl}${sep}action=LIST`, {
      method: 'GET',
      signal: AbortSignal.timeout(4500)
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data && data.ok && Array.isArray(data.requests)) {
      return data.requests;
    }
  } catch (_err) {
    // Fallback êm mượt về bộ nhớ cục bộ nếu Google Sheet tạm chậm
  }
  return null;
}

/**
 * TRA CỨU TRỰC TIẾP 1 MÃ HỒ SƠ (NA-XXXX) TỪ GOOGLE SHEET (2 CHIỀU)
 */
async function lookupRequestFromGoogleSheet(trackingCode = '', integrationConfig = {}) {
  const sheetWebhookUrl =
    integrationConfig?.googleSheetWebhookUrl ||
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    '';
  if (!sheetWebhookUrl || !sheetWebhookUrl.startsWith('http') || !trackingCode) {
    return null;
  }

  try {
    const sep = sheetWebhookUrl.includes('?') ? '&' : '?';
    const url = `${sheetWebhookUrl}${sep}action=LOOKUP&code=${encodeURIComponent(trackingCode)}`;
    const resp = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(4500)
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data && data.ok && data.request && data.request.trackingCode) {
      return data.request;
    }
  } catch (_err) {
    // Fallback về cục bộ
  }
  return null;
}

/**
 * Xuất bảng dữ liệu chuẩn Google Sheet (CSV UTF-8 có BOM hiển thị tiếng Việt hoàn hảo)
 */
function generateGoogleSheetCsv(helpRequests = []) {
  const headers = [
    'Mã Tra Cứu',
    'Thời Gian Gửi',
    'Khối Lớp',
    'Chế Độ Bảo Mật',
    'Biệt Danh / Học Sinh',
    'Phân Loại Hoàn Cảnh',
    'Mức Độ Khẩn Cấp',
    'Luồng Zalo Định Tuyến',
    'Địa Điểm & Thời Gian',
    'Nội Dung Học Sinh Chia Sẻ',
    'Trạng Thái Xử Lý',
    'Phản Hồi Của Thầy Cô',
    'Người Phản Hồi',
    'Thời Gian Phản Hồi'
  ];

  const escapeCsv = val => {
    let str = String(val ?? '').replace(/\r?\n/g, ' ');
    // Chống lỗ hổng CSV Formula Injection trên Excel / Google Sheets
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = helpRequests.map(req => [
    req.trackingCode,
    req.createdAt,
    `Lớp ${req.grade}`,
    req.isAnonymous ? 'Ẩn danh 100%' : 'Định danh',
    req.isAnonymous ? req.nickname : `${req.studentName} (${req.className})`,
    req.categoryLabel,
    String(req.urgency).toUpperCase(),
    (req.zaloDispatch?.routedChannelNames || [req.recipient]).join(' + '),
    req.locationAndTime,
    req.description,
    req.status === 'replied' ? 'Đã phản hồi' : 'Chờ xử lý',
    req.counselorReply || '',
    req.repliedBy || '',
    req.repliedAt || ''
  ]);

  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map(r => r.map(escapeCsv).join(','))
  ].join('\r\n');

  // Thêm UTF-8 BOM (\uFEFF) để Excel và Google Sheets nhận diện chuẩn tiếng Việt
  return '\uFEFF' + csvContent;
}

/**
 * CÁC LỚP BẢO VỆ AN NINH: CHỐNG SPAM, GIỚI HẠN TẦN SUẤT, BĂM ẨN DANH & PHÂN QUYỀN
 */
class SecurityGuard {
  constructor() {
    this.rateBuckets = new Map();
    this.recentFingerprints = new Map();
    this.activeAdminSessions = new Map();
    this.serverSalt = process.env.IP_HASH_SALT || crypto.randomBytes(16).toString('hex');
    // Khóa ký token không trạng thái (stateless) giúp đăng nhập Quản trị bền vững trên Vercel Serverless
    this.tokenSecret =
      process.env.SESSION_SECRET ||
      crypto
        .createHash('sha256')
        .update(
          `bdh-thcs:${ADMIN_ROLES.psych.pinCode}:${ADMIN_ROLES.gvcn.pinCode}:${ADMIN_ROLES.bgh.pinCode}`
        )
        .digest('hex');
  }

  /**
   * Băm một chiều địa chỉ IP của học sinh để vừa chống spam vừa KHÔNG BAO GIỜ lưu IP thật
   */
  hashClientIp(req) {
    const rawIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      '127.0.0.1';
    return crypto
      .createHmac('sha256', this.serverSalt)
      .update(String(rawIp))
      .digest('hex')
      .slice(0, 16);
  }

  /**
   * Làm sạch dữ liệu đầu vào chống XSS & Script Injection
   */
  sanitizeInput(str = '', maxLen = 2000) {
    return String(str)
      .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
      .replace(/javascript:/gi, '')
      .trim()
      .slice(0, maxLen);
  }

  /**
   * Kiểm tra giới hạn tần suất (Rate Limiting) theo từng loại tác vụ
   */
  checkRateLimit(clientHash, actionType, maxRequests, windowMs) {
    const now = Date.now();
    const key = `${clientHash}:${actionType}`;
    const timestamps = (this.rateBuckets.get(key) || []).filter(t => now - t < windowMs);

    if (timestamps.length >= maxRequests) {
      const oldest = timestamps[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
      return {
        allowed: false,
        retryAfterSeconds,
        remaining: 0
      };
    }

    timestamps.push(now);
    this.rateBuckets.set(key, timestamps);
    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: maxRequests - timestamps.length
    };
  }

  /**
   * Chống gửi lặp / Spam nội dung giống hệt nhau liên tiếp
   */
  checkDuplicateSpam(clientHash, content = '', windowMs = 90000) {
    const now = Date.now();
    const norm = String(content).toLowerCase().replace(/\s+/g, ' ').trim();
    const fp = crypto.createHash('md5').update(`${clientHash}:${norm}`).digest('hex');

    const lastTime = this.recentFingerprints.get(fp);
    if (lastTime && now - lastTime < windowMs) {
      return { isSpam: true };
    }
    this.recentFingerprints.set(fp, now);
    return { isSpam: false };
  }

  /**
   * Kiểm tra mẫu nội dung spam/quấy rối tự động (lặp ký tự vô nghĩa, chèn nhiều link quảng cáo)
   */
  checkSpamPattern(content = '') {
    const text = String(content || '').trim();
    if (!text) return { isSpam: false };
    // Chặn lặp 1 ký tự liên tiếp từ 14 lần trở lên (VD: "aaaaaaaaaaaaaaaaa")
    if (/(.)\1{13,}/.test(text)) {
      return {
        isSpam: true,
        reason: 'Nội dung chứa ký tự lặp lại bất thường. Em vui lòng nhập nội dung rõ ràng nhé.'
      };
    }
    // Chặn rải link quảng cáo hàng loạt (> 3 đường link trong 1 tin)
    const urls = text.match(/https?:\/\/\S+/gi) || [];
    if (urls.length > 3) {
      return {
        isSpam: true,
        reason: 'Hệ thống chống spam chỉ cho phép tối đa 3 đường link bằng chứng trong mỗi lần gửi.'
      };
    }
    return { isSpam: false };
  }

  /**
   * Xác thực đăng nhập Phân quyền Quản trị (RBAC) cho 3 luồng Zalo nhà trường
   * Dùng token HMAC-SHA256 không trạng thái (hạn 12 giờ) để chạy ổn định trên Vercel Serverless
   */
  authenticateAdminPin(pinCode = '') {
    const cleanPin = String(pinCode).trim().toUpperCase();
    const matchedRole = Object.values(ADMIN_ROLES).find(r => r.pinCode === cleanPin);
    if (!matchedRole) {
      return null;
    }

    const exp = Date.now() + 12 * 60 * 60 * 1000;
    const payload = Buffer.from(JSON.stringify({ role: matchedRole.role, exp })).toString('base64url');
    const sig = crypto.createHmac('sha256', this.tokenSecret).update(payload).digest('base64url');
    const token = `${payload}.${sig}`;

    const session = {
      token,
      role: matchedRole.role,
      title: matchedRole.title,
      allowedChannels: matchedRole.allowedChannels,
      canExportSheet: matchedRole.canExportSheet,
      canConfigWebhooks: matchedRole.canConfigWebhooks,
      createdAt: Date.now(),
      expiresAt: exp
    };
    this.activeAdminSessions.set(token, session);
    return session;
  }

  /**
   * Kiểm tra phiên đăng nhập Quản trị viên từ Header (X-Admin-Token) hoặc Query (?token=...)
   */
  verifyAdminSession(req, queryToken = '') {
    const authHeader = String(req.headers['x-admin-token'] || queryToken || '').trim();
    if (!authHeader) return null;

    if (this.activeAdminSessions.has(authHeader)) {
      const cached = this.activeAdminSessions.get(authHeader);
      if (!cached.expiresAt || cached.expiresAt > Date.now()) {
        return cached;
      }
      this.activeAdminSessions.delete(authHeader);
      return null;
    }

    // Xác minh chữ ký HMAC stateless (hoạt động xuyên suốt các instance Vercel Serverless)
    const parts = authHeader.split('.');
    if (parts.length !== 2) return null;
    const [payload, sig] = parts;
    const expectedSig = crypto.createHmac('sha256', this.tokenSecret).update(payload).digest('base64url');
    if (sig.length !== expectedSig.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;

    try {
      const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      if (!decoded.exp || decoded.exp <= Date.now()) return null;
      const matchedRole = ADMIN_ROLES[decoded.role];
      if (!matchedRole) return null;
      return {
        token: authHeader,
        role: matchedRole.role,
        title: matchedRole.title,
        allowedChannels: matchedRole.allowedChannels,
        canExportSheet: matchedRole.canExportSheet,
        canConfigWebhooks: matchedRole.canConfigWebhooks,
        expiresAt: decoded.exp
      };
    } catch (_err) {
      return null;
    }
  }
}

module.exports = {
  ZALO_CHANNELS,
  ADMIN_ROLES,
  buildZaloDirectUrl,
  determineZaloRouting,
  dispatchToZaloStreams,
  syncRequestToGoogleSheet,
  fetchRequestsFromGoogleSheet,
  lookupRequestFromGoogleSheet,
  generateGoogleSheetCsv,
  SecurityGuard
};
