const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const {
  GRADE_PROFILES,
  generateAIResponseWithOptionalGemini,
  generateTeacherCoPilotBriefing,
  generateTeacherAdvisorChatResponse
} = require('./src/ai-engine');
const {
  INTERACTIVE_SCENARIOS,
  SUPPORT_DIRECTORY,
  INITIAL_DB
} = require('./src/seed-data');
const {
  ZALO_CHANNELS,
  ADMIN_ROLES,
  dispatchToZaloStreams,
  syncRequestToGoogleSheet,
  generateGoogleSheetCsv,
  SecurityGuard
} = require('./src/routing-and-security');

const os = require('os');
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'ban-dong-hanh-data')
  : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

let runtimeGeminiApiKey = process.env.GEMINI_API_KEY || '';
let inMemoryDbFallback = null;

function ensureDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf8');
    }
  } catch (_err) {
    if (!inMemoryDbFallback) {
      inMemoryDbFallback = JSON.parse(JSON.stringify(INITIAL_DB));
    }
  }
}

function readDb() {
  ensureDb();
  if (inMemoryDbFallback) {
    return inMemoryDbFallback;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (_err) {
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }
}

function writeDb(db) {
  inMemoryDbFallback = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (_err) {
    // Trên môi trường Serverless chỉ đọc (read-only), dữ liệu được giữ an toàn trong bộ nhớ phiên
  }
}

function getSecurityHeaders(contentType = 'application/json; charset=utf-8') {
  return {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'no-referrer'
  };
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, getSecurityHeaders('application/json; charset=utf-8'));
  res.end(body);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 5e5) {
        reject(new Error('Dữ liệu gửi lên vượt quá giới hạn an toàn cho phép.'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function containsToxicWords(text = '') {
  const lower = String(text).toLowerCase();
  const banned = ['ngu', 'chết đi', 'đồ điên', 'xấu xí', 'cút', 'đánh mày', 'ghét mày', 'vô dụng'];
  return banned.some(w => lower.includes(w));
}

function generateUniqueTrackingCode(existingRequests = []) {
  const existingCodes = new Set(existingRequests.map(r => r.trackingCode));
  for (let i = 0; i < 50; i++) {
    const num = Math.floor(1000 + Math.random() * 9000);
    const code = `NA-${num}`;
    if (!existingCodes.has(code)) return code;
  }
  return `NA-${Date.now().toString().slice(-4)}`;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function createAppHandler(options = {}) {
  ensureDb();
  const security = new SecurityGuard();
  const maxHelpRequestsPerWindow = options.maxHelpRequestsPerWindow || 8;
  const maxChatPerWindow = options.maxChatPerWindow || 30;

  return async (req, res) => {
    try {
      if (req.method === 'OPTIONS') {
        res.writeHead(204, getSecurityHeaders());
        return res.end();
      }

      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const pathname = parsedUrl.pathname;
      const clientHash = security.hashClientIp(req);

      // 1. GET /api/bootstrap
      if (req.method === 'GET' && pathname === '/api/bootstrap') {
        const db = readDb();
        const requests = db.helpRequests || [];

        const zaloStats = {
          zalo_psych: requests.filter(r => (r.zaloDispatch?.routedChannels || []).includes('zalo_psych')).length,
          zalo_gvcn: requests.filter(r => (r.zaloDispatch?.routedChannels || []).includes('zalo_gvcn')).length,
          zalo_bgh: requests.filter(r => (r.zaloDispatch?.routedChannels || []).includes('zalo_bgh')).length
        };

        const byCategory = {};
        const byUrgency = { low: 0, medium: 0, high: 0, critical: 0 };
        requests.forEach(r => {
          const cat = r.categoryLabel || r.category || 'Khác';
          byCategory[cat] = (byCategory[cat] || 0) + 1;
          const urg = r.urgency || 'medium';
          if (byUrgency[urg] !== undefined) byUrgency[urg] += 1;
        });

        return sendJson(res, 200, {
          ok: true,
          schoolName: db.settings?.schoolName || 'Trường THCS Nắng Ấm',
          counselorName: db.settings?.counselorName || 'ThS. Tâm lý Nguyễn Minh Tâm',
          hasGeminiKey: Boolean(runtimeGeminiApiKey),
          gradeProfiles: GRADE_PROFILES,
          scenarios: INTERACTIVE_SCENARIOS,
          supportDirectory: SUPPORT_DIRECTORY,
          zaloChannels: ZALO_CHANNELS,
          integrations: db.settings?.integrations || INITIAL_DB.settings.integrations,
          adminRolesSummary: Object.values(ADMIN_ROLES).map(r => ({
            role: r.role,
            title: r.title,
            allowedChannels: r.allowedChannels,
            demoPinHint: r.pinCode
          })),
          moodLogs: (db.moodLogs || []).slice(0, 20),
          kindnessMessages: (db.kindnessMessages || []).slice(0, 30),
          stats: {
            totalMoodCheckins: (db.moodLogs || []).length,
            totalKindnessNotes: (db.kindnessMessages || []).length,
            totalHelpRequests: requests.length,
            repliedHelpRequests: requests.filter(r => r.status === 'replied').length,
            zaloStats,
            byCategory,
            byUrgency,
            evaluationMetrics: {
              studentSatisfactionRate: '96.5%',
              avgResponseTime: '18 phút (Ca khẩn cấp < 5 phút)',
              referralQualityRate: '100% đúng thẩm quyền (Tâm lý • GVCN • BGH)',
              campaignsCount: 12
            }
          }
        });
      }

      // 2. POST /api/chat - Trò chuyện cùng AI Mặt Trời Nhỏ (Có Rate Limiting bảo vệ)
      if (req.method === 'POST' && pathname === '/api/chat') {
        const rate = security.checkRateLimit(clientHash, 'chat', maxChatPerWindow, 60 * 1000);
        if (!rate.allowed) {
          return sendJson(res, 429, {
            ok: false,
            error: `Hệ thống chống spam đang bảo vệ kết nối. Em vui lòng đợi ${rate.retryAfterSeconds} giây rồi nhắn tiếp nhé!`
          });
        }

        const body = await parseJsonBody(req);
        const message = security.sanitizeInput(body.message || '', 1200);
        const grade = security.sanitizeInput(body.grade || '7', 5);
        const nickname = security.sanitizeInput(body.nickname || 'Bạn Nhỏ Dũng Cảm', 40);
        const selectedTopic = security.sanitizeInput(body.selectedTopic || '', 40);
        const studentRole = ['victim', 'bystander', 'perpetrator'].includes(body.studentRole)
          ? body.studentRole
          : 'victim';
        const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

        if (!message) {
          return sendJson(res, 400, { ok: false, error: 'Vui lòng nhập lời tâm sự của em nhé.' });
        }

        const aiResult = await generateAIResponseWithOptionalGemini({
          message,
          grade,
          nickname,
          selectedTopic,
          studentRole,
          history,
          geminiApiKey: runtimeGeminiApiKey
        });

        return sendJson(res, 200, {
          ok: true,
          ...aiResult,
          timestamp: new Date().toISOString()
        });
      }

      // 3. POST /api/help-requests - Gửi Hộp Thư Cầu Viện + Định tuyến 3 Luồng Zalo + Đồng bộ Google Sheet
      if (req.method === 'POST' && pathname === '/api/help-requests') {
        const body = await parseJsonBody(req);

        // Lớp bảo vệ 1: Honeypot chống Bot tự động
        if (body.website_url && String(body.website_url).trim().length > 0) {
          return sendJson(res, 400, { ok: false, error: 'Phát hiện yêu cầu tự động không hợp lệ (Bot Honeypot).' });
        }

        // Lớp bảo vệ 2: Rate Limiting giới hạn tần suất gửi hộp thư
        const rate = security.checkRateLimit(clientHash, 'help_request', maxHelpRequestsPerWindow, 10 * 60 * 1000);
        if (!rate.allowed) {
          return sendJson(res, 429, {
            ok: false,
            error: `Để chống spam hệ thống khẩn cấp, mỗi thiết bị chỉ gửi tối đa ${maxHelpRequestsPerWindow} hộp thư trong 10 phút. Vui lòng thử lại sau ${rate.retryAfterSeconds} giây.`
          });
        }

        const description = security.sanitizeInput(body.description || '', 2000);
        if (!description || description.length < 5) {
          return sendJson(res, 400, {
            ok: false,
            error: 'Em hãy mô tả ngắn gọn chuyện đang xảy ra (ít nhất 5 ký tự) để thầy cô hỗ trợ em tốt nhất nhé.'
          });
        }

        // Lớp bảo vệ 3: Chống gửi trùng lặp (Duplicate Spam Filter)
        const dup = security.checkDuplicateSpam(clientHash, description, 60 * 1000);
        if (dup.isSpam) {
          return sendJson(res, 429, {
            ok: false,
            error: 'Nội dung hộp thư này vừa được gửi thành công rồi. Em hãy dùng Mã Tra Cứu để theo dõi tiến độ nhé!'
          });
        }

        const db = readDb();
        const trackingCode = generateUniqueTrackingCode(db.helpRequests || []);
        const isAnonymous = body.isAnonymous !== false;

        const categoryMap = {
          isolation: 'Bị tẩy chay, cô lập trong lớp',
          cyber_bullying: 'Bắt nạt trên mạng / Group Chat',
          verbal_bullying: 'Trêu chọc ngoại hình / Đặt biệt danh xấu',
          physical_bullying: 'Bắt nạt thể chất / Trấn lột / Giấu đồ',
          bystander: 'Báo cáo giúp bạn đang bị bắt nạt (Người chứng kiến)',
          perpetrator_reflection: 'Nhận diện & Sửa sai khi lỡ trêu chọc / bắt nạt bạn',
          academic_stress: 'Áp lực học tập, thi cử & Gia đình',
          other: 'Tâm sự & Khó khăn khác'
        };

        const category = security.sanitizeInput(body.category || 'other', 40);
        const urgency = ['low', 'medium', 'high', 'critical'].includes(body.urgency)
          ? body.urgency
          : 'medium';

        const newRequest = {
          id: `hr-${Date.now()}`,
          trackingCode,
          isAnonymous,
          nickname: security.sanitizeInput(body.nickname || 'Bạn Nhỏ Ẩn Danh', 40),
          studentName: isAnonymous ? '' : security.sanitizeInput(body.studentName || '', 60),
          grade: security.sanitizeInput(body.grade || '7', 5),
          className: isAnonymous ? '' : security.sanitizeInput(body.className || '', 20),
          contactMethod: security.sanitizeInput(body.contactMethod || '', 120),
          evidenceNote: security.sanitizeInput(body.evidenceNote || '', 500),
          category,
          categoryLabel: categoryMap[category] || categoryMap.other,
          urgency,
          recipient: security.sanitizeInput(body.recipient || 'Phòng Tư vấn Tâm lý Học đường', 80),
          locationAndTime: security.sanitizeInput(body.locationAndTime || 'Tại trường', 150),
          description,
          status: 'pending',
          counselorReply: '',
          repliedBy: '',
          repliedAt: null,
          createdAt: new Date().toISOString(),
          privacyHash: clientHash, // Chỉ lưu mã băm 1 chiều chống spam, tuyệt đối không lưu IP hay SĐT
          studentFollowUps: []
        };

        // Tạo Phác đồ Tham mưu Sắc bén từ Trợ lý AI Cố vấn cho Thầy Cô & Group BGH
        newRequest.aiCoPilotBriefing = generateTeacherCoPilotBriefing(newRequest);

        // Định tuyến đẩy vào 3 Luồng Zalo tương ứng (Phòng Tâm lý / GVCN / Ban Giám hiệu)
        const integrations = db.settings?.integrations || {};
        newRequest.zaloDispatch = await dispatchToZaloStreams(newRequest, integrations);

        // Đồng bộ về Google Sheet Trung tâm của nhà trường
        const totalExisting = (db.helpRequests || []).length;
        newRequest.googleSheetSync = await syncRequestToGoogleSheet(
          newRequest,
          integrations,
          totalExisting + 1
        );

        db.helpRequests = [newRequest, ...(db.helpRequests || [])];
        writeDb(db);

        // Không trả privacyHash ra ngoài client
        const { privacyHash, ...publicRequest } = newRequest;

        return sendJson(res, 201, {
          ok: true,
          trackingCode,
          request: publicRequest,
          zaloDispatch: newRequest.zaloDispatch,
          googleSheetSync: newRequest.googleSheetSync,
          message: `Hộp thư đã được mã hóa ẩn danh, đẩy tới [${newRequest.zaloDispatch.routedChannelNames.join(' + ')}] và đồng bộ vào Google Sheet trung tâm!`
        });
      }

      // 4. GET /api/help-requests/lookup?code=NA-XXXX - Học sinh tra cứu ẩn danh bằng Mã Bảo Mật
      if (req.method === 'GET' && pathname === '/api/help-requests/lookup') {
        const code = security.sanitizeInput(parsedUrl.searchParams.get('code') || '', 20).toUpperCase();
        if (!code) {
          return sendJson(res, 400, { ok: false, error: 'Vui lòng nhập Mã Tra Cứu Bí Mật (VD: NA-7868).' });
        }
        const db = readDb();
        const found = (db.helpRequests || []).find(
          r => String(r.trackingCode).toUpperCase() === code
        );
        if (!found) {
          return sendJson(res, 404, {
            ok: false,
            error: `Không tìm thấy hộp thư với mã "${code}". Em có thể thử mã mẫu NA-7868, NA-2026, NA-6868 hoặc NA-9090 nhé!`
          });
        }
        const { privacyHash, ...safeRequest } = found;
        return sendJson(res, 200, {
          ok: true,
          request: safeRequest
        });
      }

      // 5. POST /api/help-requests/followup - Học sinh nhắn phản hồi nối tiếp ẩn danh bằng Mã Bảo Mật
      if (req.method === 'POST' && pathname === '/api/help-requests/followup') {
        const rate = security.checkRateLimit(clientHash, 'followup', 10, 5 * 60 * 1000);
        if (!rate.allowed) {
          return sendJson(res, 429, {
            ok: false,
            error: `Vui lòng đợi ${rate.retryAfterSeconds} giây trước khi gửi thêm phản hồi.`
          });
        }

        const body = await parseJsonBody(req);
        const trackingCode = security.sanitizeInput(body.trackingCode || '', 20).toUpperCase();
        const message = security.sanitizeInput(body.message || '', 800);

        if (!trackingCode || !message) {
          return sendJson(res, 400, {
            ok: false,
            error: 'Vui lòng nhập nội dung phản hồi của em cho thầy cô.'
          });
        }

        const db = readDb();
        const idx = (db.helpRequests || []).findIndex(
          r => String(r.trackingCode).toUpperCase() === trackingCode
        );
        if (idx === -1) {
          return sendJson(res, 404, { ok: false, error: 'Không tìm thấy mã hộp thư này.' });
        }

        if (!Array.isArray(db.helpRequests[idx].studentFollowUps)) {
          db.helpRequests[idx].studentFollowUps = [];
        }
        db.helpRequests[idx].studentFollowUps.push({
          message,
          createdAt: new Date().toISOString()
        });

        writeDb(db);
        const { privacyHash, ...safeRequest } = db.helpRequests[idx];
        return sendJson(res, 200, {
          ok: true,
          request: safeRequest
        });
      }

      // 6. POST /api/admin/login - Đăng nhập Phân quyền Quản trị (RBAC: Phòng Tâm lý / GVCN / BGH)
      if (req.method === 'POST' && pathname === '/api/admin/login') {
        const rate = security.checkRateLimit(clientHash, 'admin_login', 15, 5 * 60 * 1000);
        if (!rate.allowed) {
          return sendJson(res, 429, {
            ok: false,
            error: `Quá nhiều lần thử đăng nhập. Vui lòng đợi ${rate.retryAfterSeconds} giây.`
          });
        }

        const body = await parseJsonBody(req);
        const session = security.authenticateAdminPin(body.pinCode || '');
        if (!session) {
          return sendJson(res, 401, {
            ok: false,
            error: 'Mã PIN phân quyền không chính xác. (Gợi ý mã demo: TL-2026, GV-2026 hoặc BGH-2026)'
          });
        }

        return sendJson(res, 200, {
          ok: true,
          session
        });
      }

      // 7. GET /api/counselor/requests - Danh sách hồ sơ theo Phân quyền Luồng Zalo & Đồng bộ Google Sheet
      if (req.method === 'GET' && pathname === '/api/counselor/requests') {
        const db = readDb();
        const adminSession = security.verifyAdminSession(req);
        const channelFilter = parsedUrl.searchParams.get('channel') || 'all';

        let list = (db.helpRequests || []).map(({ privacyHash, ...rest }) => ({
          ...rest,
          aiCoPilotBriefing: rest.aiCoPilotBriefing || generateTeacherCoPilotBriefing(rest)
        }));

        // Nếu đăng nhập theo vai trò cụ thể (VD: GVCN chỉ xem luồng zalo_gvcn, Tâm lý xem zalo_psych, BGH xem cả 3)
        if (adminSession && Array.isArray(adminSession.allowedChannels)) {
          list = list.filter(r => {
            const routed = r.zaloDispatch?.routedChannels || ['zalo_psych'];
            return routed.some(ch => adminSession.allowedChannels.includes(ch));
          });
        }

        if (channelFilter !== 'all' && ZALO_CHANNELS[channelFilter]) {
          list = list.filter(r =>
            (r.zaloDispatch?.routedChannels || []).includes(channelFilter)
          );
        }

        return sendJson(res, 200, {
          ok: true,
          activeRole: adminSession
            ? {
              role: adminSession.role,
              title: adminSession.title,
              allowedChannels: adminSession.allowedChannels,
              canExportSheet: adminSession.canExportSheet,
              canConfigWebhooks: adminSession.canConfigWebhooks
            }
            : {
              role: 'bgh_preview',
              title: 'Chế độ Xem Tổng hợp 3 Luồng (Demo Quản trị)',
              allowedChannels: ['zalo_psych', 'zalo_gvcn', 'zalo_bgh'],
              canExportSheet: true,
              canConfigWebhooks: true
            },
          zaloChannels: ZALO_CHANNELS,
          integrations: db.settings?.integrations || {},
          requests: list
        });
      }

      // 8. POST /api/counselor/reply - Giáo viên Tư vấn phản hồi & tự động đồng bộ lại Google Sheet
      if (req.method === 'POST' && pathname === '/api/counselor/reply') {
        const body = await parseJsonBody(req);
        const trackingCode = security.sanitizeInput(body.trackingCode || '', 20).toUpperCase();
        const counselorReply = security.sanitizeInput(body.counselorReply || '', 2000);
        const adminSession = security.verifyAdminSession(req);
        const defaultReplier = adminSession
          ? adminSession.title
          : 'ThS. Nguyễn Minh Tâm - Phòng Tâm lý Học đường';
        const repliedBy = security.sanitizeInput(body.repliedBy || defaultReplier, 100);

        if (!trackingCode || !counselorReply) {
          return sendJson(res, 400, {
            ok: false,
            error: 'Vui lòng nhập đầy đủ mã hộp thư và nội dung phản hồi tư vấn.'
          });
        }

        const db = readDb();
        const idx = (db.helpRequests || []).findIndex(
          r => String(r.trackingCode).toUpperCase() === trackingCode
        );
        if (idx === -1) {
          return sendJson(res, 404, { ok: false, error: 'Không tìm thấy hộp thư cần phản hồi.' });
        }

        // Kiểm tra phân quyền nếu có token
        if (adminSession) {
          const routed = db.helpRequests[idx].zaloDispatch?.routedChannels || ['zalo_psych'];
          const hasPermission = routed.some(ch => adminSession.allowedChannels.includes(ch));
          if (!hasPermission) {
            return sendJson(res, 403, {
              ok: false,
              error: `Vai trò [${adminSession.title}] không có quyền phản hồi hồ sơ thuộc luồng Zalo này.`
            });
          }
        }

        db.helpRequests[idx].status = 'replied';
        db.helpRequests[idx].counselorReply = counselorReply;
        db.helpRequests[idx].repliedBy = repliedBy;
        db.helpRequests[idx].repliedAt = new Date().toISOString();

        // Đồng bộ cập nhật trạng thái ĐÃ PHẢN HỒI sang Google Sheet Trung tâm
        const integrations = db.settings?.integrations || {};
        db.helpRequests[idx].googleSheetSync = await syncRequestToGoogleSheet(
          db.helpRequests[idx],
          integrations,
          db.helpRequests[idx].googleSheetSync?.rowNumber - 1 || idx + 1
        );

        writeDb(db);
        const { privacyHash, ...safeReq } = db.helpRequests[idx];
        return sendJson(res, 200, {
          ok: true,
          request: safeReq
        });
      }

      // 9. GET /api/counselor/export-sheet.csv - Tải file Google Sheet Trung tâm (.csv chuẩn UTF-8)
      if (req.method === 'GET' && pathname === '/api/counselor/export-sheet.csv') {
        const db = readDb();
        const csv = generateGoogleSheetCsv(db.helpRequests || []);
        res.writeHead(200, {
          ...getSecurityHeaders('text/csv; charset=utf-8'),
          'Content-Disposition': 'attachment; filename="GoogleSheet_TramNangAm_THCS.csv"'
        });
        return res.end(csv);
      }

      // 10. POST /api/counselor/integrations - Cấu hình Nhanh 3 Luồng Zalo (SĐT/Group/QR/Webhook) & Google Sheet Trung tâm
      if (req.method === 'POST' && pathname === '/api/counselor/integrations') {
        const body = await parseJsonBody(req);
        const db = readDb();
        if (!db.settings) db.settings = {};
        const prev = db.settings.integrations || INITIAL_DB.settings.integrations;

        db.settings.integrations = {
          zaloQuickLinks: {
            zalo_psych: security.sanitizeInput(
              body.quick_zalo_psych !== undefined ? body.quick_zalo_psych : prev.zaloQuickLinks?.zalo_psych || '0901234567',
              200
            ),
            zalo_gvcn: security.sanitizeInput(
              body.quick_zalo_gvcn !== undefined ? body.quick_zalo_gvcn : prev.zaloQuickLinks?.zalo_gvcn || '0902345678',
              200
            ),
            zalo_bgh: security.sanitizeInput(
              body.quick_zalo_bgh !== undefined ? body.quick_zalo_bgh : prev.zaloQuickLinks?.zalo_bgh || 'https://zalo.me/g/bghnangam2026',
              200
            )
          },
          zaloWebhooks: {
            zalo_psych: security.sanitizeInput(
              body.zalo_psych !== undefined ? body.zalo_psych : prev.zaloWebhooks?.zalo_psych || '',
              300
            ),
            zalo_gvcn: security.sanitizeInput(
              body.zalo_gvcn !== undefined ? body.zalo_gvcn : prev.zaloWebhooks?.zalo_gvcn || '',
              300
            ),
            zalo_bgh: security.sanitizeInput(
              body.zalo_bgh !== undefined ? body.zalo_bgh : prev.zaloWebhooks?.zalo_bgh || '',
              300
            )
          },
          googleSheetWebhookUrl: security.sanitizeInput(
            body.googleSheetWebhookUrl !== undefined ? body.googleSheetWebhookUrl : prev.googleSheetWebhookUrl || '',
            300
          ),
          googleSheetPublicUrl: security.sanitizeInput(
            body.googleSheetPublicUrl !== undefined ? body.googleSheetPublicUrl : prev.googleSheetPublicUrl || '',
            300
          ),
          googleSheetName: security.sanitizeInput(
            body.googleSheetName || prev.googleSheetName || 'Quản Lý Hộp Thư Báo Cáo Bắt Nạt THCS (Trung Tâm)',
            120
          )
        };
        writeDb(db);
        return sendJson(res, 200, {
          ok: true,
          integrations: db.settings.integrations,
          message: 'Đã lưu cấu hình Kết nối 3 Luồng Zalo (2 Cá nhân + 1 Group BGH), Mã QR & Google Sheet Trung tâm!'
        });
      }

      // 11. POST /api/moods - Ghi nhận Nhật ký Cảm xúc hàng ngày
      if (req.method === 'POST' && pathname === '/api/moods') {
        const rate = security.checkRateLimit(clientHash, 'mood', 15, 60 * 1000);
        if (!rate.allowed) {
          return sendJson(res, 429, { ok: false, error: 'Em thao tác hơi nhanh, vui lòng đợi ít giây nhé!' });
        }

        const body = await parseJsonBody(req);
        const mood = security.sanitizeInput(body.mood || 'happy', 20);
        const note = security.sanitizeInput(body.note || '', 300);
        const grade = security.sanitizeInput(body.grade || '7', 5);
        const nickname = security.sanitizeInput(body.nickname || 'Bạn Nhỏ', 40);

        const moodMeta = {
          happy: {
            label: 'Vui vẻ & Hào hứng',
            feedback: 'Tuyệt vời quá! Năng lượng tích cực của em hôm nay giống như ánh nắng ấm áp vậy. Hãy lan tỏa nụ cười này tới bạn bè nhé! 🌻'
          },
          calm: {
            label: 'Bình yên & Nhẹ nhõm',
            feedback: 'Một tâm trí bình yên là nền tảng tuyệt vời nhất để học tập và tận hưởng tuổi học trò. Giữ nhịp thở nhẹ nhàng này nhé! 🍀'
          },
          anxious: {
            label: 'Hơi lo lắng & Bối rối',
            feedback: 'Cảm ơn em đã thành thật với cảm xúc của mình. Khi lo lắng, hãy thử 3 vòng thở 4-4-4 hoặc trò chuyện cùng Mặt Trời Nhỏ ngay nhé! 💛'
          },
          sad: {
            label: 'Buồn & Cô đơn',
            feedback: 'Mình gửi tới em một cái ôm thật ấm áp! 🫂 Những đám mây buồn rồi sẽ bay qua, và em không bao giờ phải ở một mình tại Trạm Nắng Ấm.'
          },
          stressed: {
            label: 'Áp lực & Mệt mỏi',
            feedback: 'Hôm nay em đã cố gắng rất nhiều rồi! Hãy cho phép bản thân nghỉ ngơi 10 phút, uống một cốc nước ấm và thả lỏng hai vai nhé! 🌈'
          },
          angry: {
            label: 'Đang bức xúc / Tức giận',
            feedback: 'Tức giận khi gặp chuyện bất công là phản ứng tự nhiên. Hãy hít thở sâu để làm dịu cơn nóng giận trước khi quyết định hành động nhé! 🛡️'
          }
        };

        const chosen = moodMeta[mood] || moodMeta.happy;
        const db = readDb();
        const entry = {
          id: `m-${Date.now()}`,
          nickname,
          grade,
          mood,
          moodLabel: chosen.label,
          note: note || `Check-in tâm trạng: ${chosen.label}`,
          createdAt: new Date().toISOString()
        };

        db.moodLogs = [entry, ...(db.moodLogs || [])];
        writeDb(db);

        return sendJson(res, 201, {
          ok: true,
          entry,
          encouragement: chosen.feedback
        });
      }

      // 12. POST /api/kindness - Gửi lời chúc lên Vườn Hoa Tử Tế
      if (req.method === 'POST' && pathname === '/api/kindness') {
        const rate = security.checkRateLimit(clientHash, 'kindness', 10, 60 * 1000);
        if (!rate.allowed) {
          return sendJson(res, 429, {
            ok: false,
            error: `Vui lòng đợi ${rate.retryAfterSeconds} giây trước khi gửi thêm lời chúc nhé!`
          });
        }

        const body = await parseJsonBody(req);
        const message = security.sanitizeInput(body.message || '', 500);
        const fromNickname = security.sanitizeInput(body.fromNickname || 'Một Người Bạn Tốt', 40);
        const grade = security.sanitizeInput(body.grade || '7', 5);
        const toTarget = security.sanitizeInput(body.toTarget || 'Các bạn khối 6, 7, 8, 9', 80);
        const color = ['amber', 'teal', 'coral', 'sky'].includes(body.color) ? body.color : 'amber';

        if (!message || message.length < 5) {
          return sendJson(res, 400, {
            ok: false,
            error: 'Hãy viết một lời nhắn ấm áp dài ít nhất 5 ký tự nhé!'
          });
        }

        if (containsToxicWords(message)) {
          return sendJson(res, 400, {
            ok: false,
            error: 'Vườn Hoa Tử Tế chỉ đón nhận những lời động viên yêu thương và tích cực thôi nhé! 🌻'
          });
        }

        const db = readDb();
        const newCard = {
          id: `k-${Date.now()}`,
          fromNickname,
          grade,
          toTarget,
          message,
          likes: 1,
          color,
          createdAt: new Date().toISOString()
        };

        db.kindnessMessages = [newCard, ...(db.kindnessMessages || [])];
        writeDb(db);

        return sendJson(res, 201, {
          ok: true,
          card: newCard
        });
      }

      // 13. POST /api/kindness/like - Thả tim lời nhắn tích cực
      if (req.method === 'POST' && pathname === '/api/kindness/like') {
        const body = await parseJsonBody(req);
        const id = security.sanitizeInput(body.id || '', 40);
        const db = readDb();
        const item = (db.kindnessMessages || []).find(k => k.id === id);
        if (!item) {
          return sendJson(res, 404, { ok: false, error: 'Không tìm thấy lời nhắn.' });
        }
        item.likes = (item.likes || 0) + 1;
        writeDb(db);
        return sendJson(res, 200, { ok: true, card: item });
      }

      // 14. POST /api/settings/gemini - Cấu hình Gemini API Key tùy chọn
      if (req.method === 'POST' && pathname === '/api/settings/gemini') {
        const body = await parseJsonBody(req);
        runtimeGeminiApiKey = security.sanitizeInput(body.apiKey || '', 200);
        return sendJson(res, 200, {
          ok: true,
          hasGeminiKey: Boolean(runtimeGeminiApiKey),
          message: runtimeGeminiApiKey
            ? 'Đã kích hoạt kết nối mở rộng Google Gemini API kết hợp Bộ não Sư phạm An toàn!'
            : 'Đang sử dụng Bộ máy Trí tuệ Nhân tạo Sư phạm Nội tại (Sẵn sàng 100% không cần khóa ngoài).'
        });
      }

      // 15. POST /api/counselor/copilot-chat - Trợ lý AI Cố vấn Sư phạm & Pháp lý cho Thầy Cô & Ban Giám hiệu
      if (req.method === 'POST' && pathname === '/api/counselor/copilot-chat') {
        const body = await parseJsonBody(req);
        const question = security.sanitizeInput(body.question || '', 1200);
        const adminSession = security.verifyAdminSession(req);
        const roleTitle = adminSession ? adminSession.title : 'Ban Giám hiệu & Giáo viên Tư vấn';

        if (!question) {
          return sendJson(res, 400, {
            ok: false,
            error: 'Vui lòng nhập tình huống cần Trợ lý AI tham mưu.'
          });
        }

        const result = await generateTeacherAdvisorChatResponse({
          question,
          roleTitle,
          geminiApiKey: runtimeGeminiApiKey
        });

        return sendJson(res, 200, {
          ok: true,
          ...result,
          timestamp: new Date().toISOString()
        });
      }

      // Phục vụ file tĩnh trong thư mục public/
      let safePath = path.normalize(pathname === '/' ? '/index.html' : pathname);
      safePath = safePath.replace(/^(\.\.[/\\])+/, '');
      const filePath = path.join(PUBLIC_DIR, safePath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, getSecurityHeaders(contentType));
        return fs.createReadStream(filePath).pipe(res);
      }

      const indexHtml = path.join(PUBLIC_DIR, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.writeHead(200, getSecurityHeaders('text/html; charset=utf-8'));
        return fs.createReadStream(indexHtml).pipe(res);
      }

      sendJson(res, 404, { ok: false, error: 'Not found' });
    } catch (err) {
      sendJson(res, 500, { ok: false, error: err.message || 'Internal Server Error' });
    }
  };
}

function createAppServer(options = {}) {
  return http.createServer(createAppHandler(options));
}

const defaultVercelHandler = createAppHandler();

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = createAppServer();
  server.listen(PORT, () => {
    console.log(`🌻 BẠN ĐỒNG HÀNH AI (THCS Lớp 6-9) đang hoạt động tại: http://localhost:${PORT}`);
  });
}

module.exports = Object.assign(defaultVercelHandler, {
  createAppServer,
  createAppHandler
});
