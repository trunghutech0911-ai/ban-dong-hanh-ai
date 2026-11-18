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
    pinCode: 'TL-2026',
    allowedChannels: ['zalo_psych'],
    canExportSheet: true,
    canConfigWebhooks: false
  },
  gvcn: {
    role: 'gvcn',
    title: 'Giáo viên Chủ nhiệm Khối 6–9',
    pinCode: 'GV-2026',
    allowedChannels: ['zalo_gvcn'],
    canExportSheet: false,
    canConfigWebhooks: false
  },
  bgh: {
    role: 'bgh',
    title: 'Ban Giám hiệu & Quản trị Hệ thống (Toàn quyền)',
    pinCode: 'BGH-2026',
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
 * ĐỒNG BỘ DỮ LIỆU VỀ GOOGLE SHEET TRUNG TÂM CỦA NHÀ TRƯỜNG
 */
async function syncRequestToGoogleSheet(requestItem, integrationConfig = {}, totalRowsCount = 1) {
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
    description: requestItem.description,
    status: requestItem.status === 'replied' ? 'ĐÃ PHẢN HỒI' : 'CHỜ XỬ LÝ',
    counselorReply: requestItem.counselorReply || '',
    repliedBy: requestItem.repliedBy || '',
    repliedAt: requestItem.repliedAt || ''
  };

  let syncStatus = 'synced_local_and_ready';
  const sheetWebhookUrl =
    integrationConfig?.googleSheetWebhookUrl ||
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    '';

  if (sheetWebhookUrl && sheetWebhookUrl.startsWith('http')) {
    try {
      const resp = await fetch(sheetWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPSERT_ROW',
          row: sheetRow
        })
      });
      syncStatus = resp.ok ? 'synced_cloud_webhook' : `cloud_http_${resp.status}`;
    } catch (_e) {
      syncStatus = 'queued_local_mirror';
    }
  }

  return {
    sheetName: 'Quản Lý Hộp Thư Cầu Viện THCS ( Trung Tâm )',
    rowNumber: sheetRow.rowNumber,
    syncStatus,
    syncedAt: new Date().toISOString(),
    columns: sheetRow
  };
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
    const str = String(val ?? '').replace(/\r?\n/g, ' ');
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
    this.serverSalt = crypto.randomBytes(16).toString('hex');
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
   * Xác thực đăng nhập Phân quyền Quản trị (RBAC) cho 3 luồng Zalo nhà trường
   */
  authenticateAdminPin(pinCode = '') {
    const cleanPin = String(pinCode).trim().toUpperCase();
    const matchedRole = Object.values(ADMIN_ROLES).find(r => r.pinCode === cleanPin);
    if (!matchedRole) {
      return null;
    }

    const token = crypto.randomBytes(24).toString('hex');
    const session = {
      token,
      role: matchedRole.role,
      title: matchedRole.title,
      allowedChannels: matchedRole.allowedChannels,
      canExportSheet: matchedRole.canExportSheet,
      canConfigWebhooks: matchedRole.canConfigWebhooks,
      createdAt: Date.now()
    };
    this.activeAdminSessions.set(token, session);
    return session;
  }

  /**
   * Kiểm tra phiên đăng nhập Quản trị viên từ Header hoặc Query
   */
  verifyAdminSession(req) {
    const authHeader = req.headers['x-admin-token'] || '';
    if (authHeader && this.activeAdminSessions.has(authHeader)) {
      return this.activeAdminSessions.get(authHeader);
    }
    return null;
  }
}

module.exports = {
  ZALO_CHANNELS,
  ADMIN_ROLES,
  buildZaloDirectUrl,
  determineZaloRouting,
  dispatchToZaloStreams,
  syncRequestToGoogleSheet,
  generateGoogleSheetCsv,
  SecurityGuard
};
