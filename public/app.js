/**
 * FRONTEND CONTROLLER - TRẠM NẮNG ẤM (SUNNY HARBOR THCS LỚP 6 - LỚP 9)
 * Tích hợp:
 *  - Tư vấn AI Sư phạm theo Khối Lớp 6, 7, 8, 9
 *  - Định tuyến tự động 3 Luồng Zalo (Phòng Tâm lý, GVCN, Ban Giám hiệu) & Đồng bộ Google Sheet Trung tâm
 *  - Cơ chế Phản hồi & Tra cứu Ẩn danh 2 chiều bằng Mã Bảo Mật (VD: NA-7868)
 *  - Lớp bảo vệ: Chống Spam, Giới hạn tần suất, Phân quyền Quản trị RBAC (TL-2026, GV-2026, BGH-2026)
 */

const CUTE_NICKNAMES = [
  'Gấu Bông Dũng Cảm',
  'Sóc Nhỏ Lạc Quan',
  'Cánh Cụt Ấm Áp',
  'Mèo Con Tinh Nhuệ',
  'Hải Âu Tự Do',
  'Hướng Dương Rạng Rỡ',
  'Thỏ Trắng Thông Thái',
  'Sao Biển Vui Vẻ',
  'Cánh Én Mùa Xuân',
  'Cá Heo Thân Thiện'
];

const appState = {
  grade: '7',
  studentRole: 'victim',
  nickname: 'Gấu Bông Dũng Cảm',
  selectedTopic: '',
  gradeProfiles: {},
  scenarios: [],
  activeScenarioId: 'isolation',
  supportDirectory: [],
  moodLogs: [],
  kindnessMessages: [],
  counselorRequests: [],
  counselorFilter: 'all',
  adminToken: '',
  activeAdminRole: null,
  schoolStats: null,
  chatHistory: [],
  breathingInterval: null,
  breathingActive: false,
  lastEscTime: 0
};

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMarkdown(text = '') {
  const escaped = escapeHtml(text);

  return escaped
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

function formatDateVN(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (_e) {
    return isoStr;
  }
}

// ============================================================================
// KHỞI ĐỘNG & TẢI DỮ LIỆU BAN ĐẦU
// ============================================================================
async function initApp() {
  bindGlobalEvents();
  await loadBootstrapData();
  renderInitialWelcomeChat();
  // Chế độ demo: tải sẵn mẫu tra cứu NA-7868; chế độ dữ liệu thật: ẩn các phần demo
  if (appState.demoMode !== false) {
    await lookupHelpRequest('NA-7868');
  } else {
    document.querySelectorAll('.demo-only').forEach(el => el.classList.add('hidden'));
    const lookupInput = document.getElementById('input-lookup-code');
    if (lookupInput) lookupInput.value = '';
  }
}

async function loadBootstrapData() {
  try {
    const res = await fetch('/api/bootstrap');
    const data = await res.json();
    if (!data.ok) return;

    appState.demoMode = data.demoMode;
    appState.gradeProfiles = data.gradeProfiles || {};
    appState.scenarios = data.scenarios || [];
    appState.supportDirectory = data.supportDirectory || [];
    appState.moodLogs = data.moodLogs || [];
    appState.kindnessMessages = data.kindnessMessages || [];

    if (data.stats) {
      appState.schoolStats = data.stats;
      const repliedEl = document.getElementById('stat-replied-count');
      if (repliedEl) repliedEl.textContent = data.stats.repliedHelpRequests;

      if (data.stats.zaloStats) {
        const zp = document.getElementById('count-zalo-psych');
        const zg = document.getElementById('count-zalo-gvcn');
        const zb = document.getElementById('count-zalo-bgh');
        if (zp) zp.textContent = `${data.stats.zaloStats.zalo_psych || 0} ca`;
        if (zg) zg.textContent = `${data.stats.zaloStats.zalo_gvcn || 0} ca`;
        if (zb) zb.textContent = `${data.stats.zaloStats.zalo_bgh || 0} ca`;
      }
      renderSchoolAnalyticsDashboard();
    }

    updateGradeUI();
    renderScenariosList();
    renderScenarioDetail(appState.activeScenarioId);
    renderSupportDirectory();
    renderMoodJournalList();
    renderKindnessWall();
    await loadCounselorRequests();
  } catch (err) {
    console.error('Lỗi tải dữ liệu khởi tạo:', err);
  }
}

// ============================================================================
// CẬP NHẬT GIAO DIỆN THEO KHỐI LỚP (LỚP 6, 7, 8, 9) & BIỆT DANH
// ============================================================================
function updateGradeUI() {
  const g = appState.grade;
  const profile = appState.gradeProfiles[g] || {
    label: `Lớp ${g}`,
    stageName: 'Giai đoạn phát triển tâm sinh lý THCS',
    commonStruggles: 'Bạn bè, học tập, cảm xúc tuổi dậy thì.',
    encouragement: 'Mọi tâm sự của em tại đây đều được lắng nghe và bảo vệ!'
  };

  const roleLabels = {
    victim: 'Người bị bắt nạt / gặp khó khăn',
    bystander: 'Người chứng kiến tình huống',
    perpetrator: 'Người muốn nhận diện & sửa sai hành vi'
  };
  const roleName = roleLabels[appState.studentRole] || roleLabels.victim;

  const displayNick = document.getElementById('display-nickname');
  if (displayNick) displayNick.textContent = appState.nickname;

  const formNickPreview = document.getElementById('form-nick-preview');
  if (formNickPreview) formNickPreview.textContent = appState.nickname;

  const heroPill = document.getElementById('hero-grade-pill');
  if (heroPill) {
    heroPill.textContent = `✨ BẠN ĐỒNG HÀNH AI — Lắng nghe • Thấu hiểu • Bảo vệ (${profile.label} • ${roleName})`;
  }

  const heroDesc = document.getElementById('hero-grade-desc');
  if (heroDesc) {
    heroDesc.innerHTML = `<strong>Bạn có thể chia sẻ mà không cần cho biết họ tên. AI sẽ cùng bạn tìm cách giải quyết.</strong> ${profile.encouragement}`;
  }

  const sbTitle = document.getElementById('sidebar-grade-title');
  const sbStage = document.getElementById('sidebar-grade-stage');
  const sbStruggles = document.getElementById('sidebar-grade-struggles');
  if (sbTitle) sbTitle.textContent = `Cá thể hóa: ${profile.label}`;
  if (sbStage) sbStage.textContent = `${profile.stageName} • Vai trò: ${roleName}`;
  if (sbStruggles) sbStruggles.textContent = profile.commonStruggles;

  if (appState.scenarios.length > 0) {
    renderScenarioDetail(appState.activeScenarioId);
  }
}

// ============================================================================
// ĐIỀU HƯỚNG TAB CHÍNH
// ============================================================================
function switchTab(tabId) {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  buttons.forEach(btn => {
    const isTarget = btn.getAttribute('data-tab') === tabId;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  panels.forEach(panel => {
    const isTarget = panel.id === `panel-${tabId}`;
    panel.classList.toggle('active', isTarget);
    panel.classList.toggle('hidden', !isTarget);
  });

  if (tabId === 'counselor') {
    loadCounselorRequests();
  }
}

// ============================================================================
// PHÂN HỆ 1: TRÒ CHUYỆN CÙNG BẠN ĐỒNG HÀNH AI (MỤC 3.1 & 3.2)
// ============================================================================
function renderInitialWelcomeChat() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  container.innerHTML = '';

  const welcomeText = `**“Xin chào ${appState.nickname} (Khối Lớp ${appState.grade})! Hôm nay bạn cảm thấy thế nào?”** 🌻\n\nMình là **BẠN ĐỒNG HÀNH AI** (*Lắng nghe • Thấu hiểu • Bảo vệ*). **Bạn có thể chia sẻ mà không cần cho biết họ tên. AI sẽ cùng bạn tìm cách giải quyết.**\n\nTại đây, nội dung hỗ trợ được **cá thể hóa (Mục 3.2)** theo khối lớp, cảm xúc, mức độ an toàn và vai trò của bạn:\n- 🛡️ **Người bị bắt nạt:** Hướng dẫn kỹ năng tự bảo vệ, lưu bằng chứng, ứng xử không bạo lực và tìm người lớn hỗ trợ.\n- 🤝 **Người chứng kiến:** Cách giải vây an toàn, động viên bạn và báo cáo bảo mật giúp bạn.\n- 💛 **Người lỡ có hành vi bắt nạt:** Cùng nhận diện hành vi, dừng lại đúng lúc và xin lỗi chân thành mà không bị phán xét.\n\n*(Lưu ý Mục 3.1 & Mục 5: AI không tự chẩn đoán bệnh tâm lý, không tự kết luận kỷ luật và tuân thủ nguyên tắc Ẩn danh có giới hạn để bảo vệ an toàn cho học sinh).*`;

  appendChatMessage({
    role: 'assistant',
    content: welcomeText,
    meta: `Bước 1 & 2: Truy cập Ẩn danh • Cá thể hóa Khối ${appState.grade}`
  });

  renderSuggestedChips([
    'Em đang bị các bạn trong lớp tẩy chay, cô lập',
    'Có người chế ảnh và nói xấu em trong nhóm lớp',
    'Em thấy bạn cùng lớp bị bắt nạt, làm sao giúp bạn an toàn?',
    'Em lỡ hùa theo trêu bạn làm bạn buồn, em muốn sửa sai'
  ]);
}

function appendChatMessage({ role, content, meta = '', recommendedModule = null }) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const row = document.createElement('div');
  row.className = `msg-row ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'assistant' ? '🌞' : '🧒';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = `<div>${formatMarkdown(content)}</div>`;

  if (meta) {
    const metaEl = document.createElement('div');
    metaEl.className = 'msg-meta-tag';
    metaEl.textContent = meta;
    bubble.appendChild(metaEl);
  }

  if (recommendedModule) {
    const moduleLabels = {
      scenarios: '🧭 Mở Thư Viện Kỹ Năng Phòng Chống Bắt Nạt',
      helpbox: '📮 Mở Hộp Thư Báo Cáo Bắt Nạt & Kết Nối Giáo Viên',
      wellness: '🌻 Mở Vòng Tròn Hơi Thở 4-4-4 & Góc Bình Tâm'
    };
    if (moduleLabels[recommendedModule]) {
      const jumpBtn = document.createElement('button');
      jumpBtn.type = 'button';
      jumpBtn.className = 'msg-action-jump';
      jumpBtn.textContent = moduleLabels[recommendedModule];
      jumpBtn.addEventListener('click', () => switchTab(recommendedModule));
      bubble.appendChild(document.createElement('br'));
      bubble.appendChild(jumpBtn);
    }
  }

  row.appendChild(avatar);
  row.appendChild(bubble);
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function renderSuggestedChips(suggestions = []) {
  const bar = document.getElementById('chat-suggested-bar');
  if (!bar) return;
  bar.innerHTML = '';

  suggestions.forEach(text => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'suggested-chip';
    btn.textContent = `💬 ${text}`;
    btn.addEventListener('click', () => {
      sendChatMessage(text);
    });
    bar.appendChild(btn);
  });
}

// Đóng gói cuộc trò chuyện thành hồ sơ gửi 3 Luồng Zalo (Mục 3.5 / Bước 3B)
async function escalateChatToZalo(isAuto = false) {
  const box = document.getElementById('chat-escalate-result');
  const userMsgs = appState.chatHistory.filter(h => h.role === 'user').map(h => h.content);
  if (userMsgs.length === 0) {
    if (box) {
      box.classList.remove('hidden');
      box.textContent = 'Em hãy tâm sự với AI trước khi chuyển cho thầy cô nhé.';
    }
    return;
  }
  const analysis = appState.lastAnalysis || {};
  const validCats = ['isolation', 'cyber_bullying', 'verbal_bullying', 'physical_bullying', 'bystander', 'perpetrator_reflection', 'academic_stress'];
  let category = validCats.includes(analysis.scenarioId) ? analysis.scenarioId : appState.selectedTopic;
  if (!validCats.includes(category)) category = 'other';
  const urgency = analysis.riskLevel === 'critical' ? 'critical' : analysis.riskLevel === 'high' ? 'high' : 'medium';
  const description = `[Chuyển từ Chat AI${isAuto ? ' - tự động do nguy cơ cao' : ''}] ` + userMsgs.slice(-5).join(' | ');

  try {
    const res = await fetch('/api/help-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isAnonymous: true,
        nickname: appState.nickname,
        grade: appState.grade,
        category,
        urgency,
        recipient: urgency === 'medium' ? 'Phòng Tư vấn Tâm lý Học đường' : 'Ban Giám hiệu & Ban An toàn trường học',
        locationAndTime: 'Chuyển từ khung Chat AI',
        description
      })
    });
    const data = await res.json();
    if (box) {
      box.classList.remove('hidden');
      box.innerHTML = data.ok
        ? `✅ Đã chuyển tới <strong>${(data.zaloDispatch?.routedChannelNames || []).join(' + ')}</strong>. Mã Tra Cứu Bí Mật của em: <code>${data.trackingCode}</code> (lưu lại để xem phản hồi ở mục Hộp Thư).`
        : `⚠️ ${data.error}`;
    }
    if (data.ok) await loadBootstrapData();
  } catch (_e) {
    if (box) {
      box.classList.remove('hidden');
      box.textContent = '⚠️ Chưa gửi được, em thử lại sau ít giây nhé.';
    }
  }
}

async function askCopilot(question) {
  const out = document.getElementById('copilot-advisor-output');
  if (!out) return;
  out.classList.remove('hidden');
  out.textContent = '⏳ Trợ lý AI đang soạn phương án...';
  const headers = { 'Content-Type': 'application/json' };
  if (appState.adminToken) headers['X-Admin-Token'] = appState.adminToken;
  try {
    const res = await fetch('/api/counselor/copilot-chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    out.innerHTML = data.ok ? formatMarkdown(data.reply) : `⚠️ ${data.error}`;
  } catch (_e) {
    out.textContent = '⚠️ Không kết nối được Trợ lý AI.';
  }
}

async function sendChatMessage(rawText) {
  const input = document.getElementById('chat-input');
  const message = (rawText !== undefined ? rawText : input.value).trim();
  if (!message) return;

  if (rawText === undefined && input) {
    input.value = '';
  }

  appendChatMessage({
    role: 'user',
    content: message,
    meta: `${appState.nickname} • Lớp ${appState.grade}`
  });

  appState.chatHistory.push({ role: 'user', content: message });

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        grade: appState.grade,
        nickname: appState.nickname,
        selectedTopic: appState.selectedTopic,
        studentRole: appState.studentRole,
        history: appState.chatHistory
      })
    });
    const data = await res.json();
    if (!data.ok) {
      appendChatMessage({
        role: 'assistant',
        content: `⚠️ ${data.error || 'Hệ thống đang bận, em vui lòng thử lại sau ít giây nhé.'}`,
        meta: 'Lớp bảo vệ Chống Spam'
      });
      return;
    }

    appState.chatHistory.push({ role: 'assistant', content: data.reply });
    appState.lastAnalysis = data.analysis || null;
    if (data.analysis?.riskLevel === 'critical' && !appState.autoEscalated) {
      appState.autoEscalated = true;
      escalateChatToZalo(true);
    }

    const badge = document.getElementById('chat-risk-badge');
    if (badge && data.analysis) {
      badge.setAttribute('data-risk', data.analysis.riskLevel || 'low');
      const riskLabels = {
        low: `🛡️ Bước 3A • An toàn (${data.analysis.emotion})`,
        medium: `💛 Bước 3A • Hỗ trợ kỹ năng (${data.analysis.scenarioName})`,
        high: `🟠 Bước 3B • Nguy cơ cao (${data.analysis.scenarioName})`,
        critical: `🚨 BƯỚC 3B KHẨN CẤP (Gọi 111 / Báo Giáo Viên Ngay)`
      };
      badge.textContent = riskLabels[data.analysis.riskLevel] || riskLabels.low;
    }

    appendChatMessage({
      role: 'assistant',
      content: data.reply,
      meta: `${data.analysis?.workflowStep || 'Bước 3A'} • Cảm xúc: ${data.analysis?.emotion || 'Lắng nghe'} • Khối ${appState.grade}`,
      recommendedModule: data.recommendedModule
    });

    if (Array.isArray(data.suggestedActions)) {
      renderSuggestedChips(data.suggestedActions);
    }
  } catch (err) {
    console.error('Lỗi gửi tin nhắn AI:', err);
  }
}

// ============================================================================
// PHÂN HỆ 2: LA BÀN ỨNG PHÓ BẮT NẠT & NHẬP VAI THỰC HÀNH (SCENARIOS & ROLEPLAY)
// ============================================================================
function renderScenariosList() {
  const listEl = document.getElementById('scenario-cards-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  appState.scenarios.forEach(sc => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `scenario-item-btn ${sc.id === appState.activeScenarioId ? 'active' : ''}`;
    btn.innerHTML = `
      <div class="sc-item-top">
        <span class="sc-item-title">${sc.icon} ${sc.title}</span>
        <span class="sc-item-badge">${sc.badge}</span>
      </div>
      <p class="sc-item-desc">${sc.shortDesc}</p>
    `;
    btn.addEventListener('click', () => {
      appState.activeScenarioId = sc.id;
      renderScenariosList();
      renderScenarioDetail(sc.id);
    });
    listEl.appendChild(btn);
  });
}

function renderScenarioDetail(scenarioId) {
  const detailEl = document.getElementById('scenario-detail-view');
  if (!detailEl) return;

  const sc = appState.scenarios.find(item => item.id === scenarioId) || appState.scenarios[0];
  if (!sc) return;

  const gradeNote = (sc.gradeSpecificAdvice && sc.gradeSpecificAdvice[appState.grade]) || '';

  detailEl.innerHTML = `
    <div class="card-header-badge">${sc.icon} ${sc.badge}</div>
    <h3>${sc.title}</h3>
    <div class="reassurance-banner">
      💚 <strong>Thông điệp Chuyên gia:</strong> ${sc.reassurance}
    </div>

    <div class="grade-tailored-box">
      <strong>🎯 Lời khuyên riêng cho học sinh Lớp ${appState.grade} (${appState.nickname}):</strong>
      <p>${gradeNote}</p>
    </div>

    <div class="steps-section">
      <h4>🧭 3 Bước Ứng Phó Ngay Lập Tức:</h4>
      <ol class="steps-list">
        ${sc.immediateSteps.map(step => `<li>${step}</li>`).join('')}
      </ol>
    </div>

    <div class="dos-donts-grid">
      <div class="do-box">
        <h5>✅ Những điều NÊN làm:</h5>
        <ul>
          ${sc.dos.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>
      <div class="dont-box">
        <h5>🚫 Những điều TUYỆT ĐỐI TRÁNH:</h5>
        <ul>
          ${sc.donts.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="roleplay-arena">
      <h4>🎭 Thử Thách Nhập Vai Bản Lĩnh (Roleplay Simulator)</h4>
      <p class="roleplay-situation"><strong>Tình huống giả định:</strong> ${sc.roleplay.situation}</p>
      <p class="small-note" style="margin-bottom:0.5rem;">Nếu là em trong hoàn cảnh đó, em sẽ chọn cách ứng xử nào?</p>
      <div class="roleplay-choices" id="roleplay-choices-box">
        ${sc.roleplay.choices
          .map(
            (ch, idx) => `
          <button type="button" class="roleplay-choice-btn" data-choice-id="${ch.id}">
            <strong>Phương án ${idx + 1}:</strong> ${ch.text}
          </button>
        `
          )
          .join('')}
      </div>
      <div id="roleplay-feedback" class="roleplay-feedback-box hidden" aria-live="polite"></div>
    </div>
  `;

  const choiceBtns = detailEl.querySelectorAll('.roleplay-choice-btn');
  const feedbackBox = detailEl.querySelector('#roleplay-feedback');

  choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cId = btn.getAttribute('data-choice-id');
      const chosen = sc.roleplay.choices.find(c => c.id === cId);
      if (!chosen || !feedbackBox) return;

      feedbackBox.classList.remove('hidden');
      const color = chosen.score >= 80 ? '#059669' : chosen.score >= 40 ? '#D97706' : '#DC2626';
      feedbackBox.innerHTML = `
        <div style="font-weight:800; color:${color}; margin-bottom:0.35rem;">
          🏅 Đánh giá: ${chosen.verdict} (${chosen.score}/100 điểm bản lĩnh)
        </div>
        <p>${chosen.feedback}</p>
      `;
    });
  });
}

// ============================================================================
// PHÂN HỆ 3: HỘP THƯ CẦU VIỆN, ĐỊNH TUYẾN 3 LUỒNG ZALO & TRA CỨU MÃ BẢO MẬT
// ============================================================================
function renderSupportDirectory() {
  const container = document.getElementById('support-directory-list');
  if (!container) return;
  container.innerHTML = '';

  appState.supportDirectory.forEach(item => {
    const div = document.createElement('div');
    div.className = 'directory-item';
    div.innerHTML = `
      <div class="dir-top">
        <strong>${item.name}</strong>
        <span class="dir-phone">📞 ${item.phone}</span>
      </div>
      <div class="small-note" style="font-weight:700; color:#059669;">${item.availability}</div>
      <p class="small-note" style="margin-top:0.25rem;">${item.description}</p>
    `;
    container.appendChild(div);
  });
}

async function submitHelpRequest(e) {
  e.preventDefault();
  const isAnonymous = document.getElementById('chk-anonymous').checked;
  const studentName = document.getElementById('help-student-name').value;
  const className = document.getElementById('help-class-name').value;
  const category = document.getElementById('help-category').value;
  const urgency = document.getElementById('help-urgency').value;
  const recipient = document.getElementById('help-recipient').value;
  const locationAndTime = document.getElementById('help-location').value;
  const evidenceNote = document.getElementById('help-evidence')?.value || '';
  const contactMethod = document.getElementById('help-contact')?.value || '';
  const description = document.getElementById('help-description').value;
  const website_url = document.getElementById('help-website-honeypot')?.value || '';

  const res = await fetch('/api/help-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      isAnonymous,
      nickname: appState.nickname,
      studentName,
      grade: appState.grade,
      className,
      category,
      urgency,
      recipient,
      locationAndTime,
      evidenceNote,
      contactMethod,
      description,
      website_url
    })
  });

  const data = await res.json();
  const resultBox = document.getElementById('help-submit-result');
  if (!resultBox) return;

  resultBox.classList.remove('hidden');
  if (!data.ok) {
    resultBox.innerHTML = `<p style="color:#DC2626; font-weight:700;">⚠️ ${data.error}</p>`;
    return;
  }

  const routedNames = (data.zaloDispatch?.routedChannelNames || [recipient]).join(' + ');
  const sheetRow = data.googleSheetSync?.rowNumber || 'Mới';
  const primaryDelivery = (data.zaloDispatch?.deliveries || [])[0];
  const directZaloUrl = primaryDelivery?.directZaloUrl || 'https://zalo.me/0901234567';

  resultBox.innerHTML = `
    <h4>🎉 Đã gửi Hộp Thư Báo Cáo Bảo Mật & Định tuyến thành công!</h4>
    <p>Hãy lưu lại <strong>Mã Tra Cứu Bí Mật</strong> dưới đây để theo dõi tiến độ và đọc phản hồi từ thầy cô mà không cần lộ danh tính:</p>
    <div class="tracking-code-pill">${data.trackingCode}</div>
    <div class="progress-pipeline">
      <div class="pipeline-step done">
        <strong>1. Bảo mật Ẩn danh</strong><br/>Đã mã hóa SHA-256
      </div>
      <div class="pipeline-step done">
        <strong>2. Định tuyến 3 Luồng Zalo</strong><br/>📲 ${routedNames}
      </div>
      <div class="pipeline-step done">
        <strong>3. Google Sheet</strong><br/>📊 Đồng bộ Hàng #${sheetRow}
      </div>
    </div>
    <div style="margin-top:0.55rem; display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
      <a href="${directZaloUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary-sm" style="text-decoration:none;">
        📲 Mở nhanh ${primaryDelivery?.shortName || 'Zalo Giáo viên Tư vấn'} (Nếu cần nhắn trực tiếp)
      </a>
      <span class="small-note">Mã <code>${data.trackingCode}</code> đã được điền sẵn sang khung Tra cứu bên phải!</span>
    </div>
  `;

  document.getElementById('help-description').value = '';
  const lookupInput = document.getElementById('input-lookup-code');
  if (lookupInput) {
    lookupInput.value = data.trackingCode;
  }
  await lookupHelpRequest(data.trackingCode);
  await loadBootstrapData();
}

async function lookupHelpRequest(codeRaw) {
  const code = String(codeRaw || '').trim().toUpperCase();
  const container = document.getElementById('lookup-result-container');
  if (!container || !code) return;

  const res = await fetch(`/api/help-requests/lookup?code=${encodeURIComponent(code)}`);
  const data = await res.json();

  if (!data.ok) {
    container.innerHTML = `
      <div class="lookup-result-card">
        <p style="color:#DC2626; font-weight:700;">${escapeHtml(data.error)}</p>
      </div>
    `;
    return;
  }

  const req = data.request;
  const routedChannelsText = escapeHtml((req.zaloDispatch?.routedChannelNames || [req.recipient]).join(' + '));
  const sheetRow = escapeHtml(req.googleSheetSync?.rowNumber || 2);
  const isReplied = req.status === 'replied';

  const statusBadge = isReplied
    ? '<span class="badge-pill replied">✅ Thầy/Cô đã phản hồi</span>'
    : '<span class="badge-pill">⏳ Đang xử lý trên Luồng Zalo</span>';

  const followUpsHtml =
    Array.isArray(req.studentFollowUps) && req.studentFollowUps.length > 0
      ? `
      <div style="margin-top:0.65rem; background:#FFFBEB; padding:0.65rem; border-radius:8px; border:1px solid #FDE68A;">
        <strong style="font-size:0.82rem; color:#92400E;">💬 Lời nhắn phản hồi thêm của em (Ẩn danh):</strong>
        ${req.studentFollowUps
          .map(
            f => `<p class="small-note" style="margin-top:0.25rem; color:#0F293A;">• "${escapeHtml(f.message)}" <em>(${escapeHtml(formatDateVN(f.createdAt))})</em></p>`
          )
          .join('')}
      </div>
    `
      : '';

  const safeCode = escapeHtml(req.trackingCode);
  const safeIdentity = req.isAnonymous
    ? `Ẩn danh: ${escapeHtml(req.nickname)}`
    : escapeHtml(req.studentName);

  container.innerHTML = `
    <div class="lookup-result-card">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.4rem; margin-bottom:0.45rem;">
        <strong>Mã bảo mật: <code>${safeCode}</code> (${safeIdentity} • Lớp ${escapeHtml(req.grade)})</strong>
        ${statusBadge}
      </div>

      <!-- Tiến độ xử lý 3 bước minh bạch -->
      <div class="progress-pipeline">
        <div class="pipeline-step done">
          <strong>1. Tiếp nhận Ẩn danh</strong><br/>Không lộ tên/SĐT
        </div>
        <div class="pipeline-step done">
          <strong>2. Đẩy 3 Luồng Zalo & Sheet</strong><br/>${routedChannelsText} (Hàng #${sheetRow})
        </div>
        <div class="pipeline-step ${isReplied ? 'done' : 'waiting'}">
          <strong>3. Phản hồi Tư vấn</strong><br/>${isReplied ? 'Đã có câu trả lời' : 'Đang chờ thầy cô'}
        </div>
      </div>

      <p class="small-note"><strong>Phân loại:</strong> ${escapeHtml(req.categoryLabel)} • <strong>Mức độ:</strong> ${escapeHtml(String(req.urgency).toUpperCase())}</p>
      ${req.evidenceNote ? `<p class="small-note" style="margin-top:0.2rem;"><strong>📎 Bằng chứng bổ sung:</strong> ${escapeHtml(req.evidenceNote)}</p>` : ''}
      ${req.contactMethod ? `<p class="small-note" style="margin-top:0.2rem;"><strong>📞 Phương thức liên hệ hỗ trợ:</strong> ${escapeHtml(req.contactMethod)}</p>` : ''}
      <p style="margin-top:0.45rem; font-size:0.9rem;"><strong>Nội dung em đã gửi:</strong> "${escapeHtml(req.description)}"</p>

      ${
        isReplied
          ? `
        <div class="counselor-reply-box">
          <strong>🌻 Lời nhắn phản hồi từ ${escapeHtml(req.repliedBy)}:</strong>
          <p style="margin-top:0.3rem;">${escapeHtml(req.counselorReply)}</p>
          <div class="small-note" style="margin-top:0.3rem;">Phản hồi lúc: ${escapeHtml(formatDateVN(req.repliedAt))}</div>
        </div>
      `
          : `
        <div class="counselor-reply-box" style="background:#FFFBEB; border-left-color:#F59E0B;">
          <strong>💛 Thông báo từ Hệ thống Định tuyến:</strong> Hồ sơ của em đã được đẩy vào <strong>${routedChannelsText}</strong> và đồng bộ lên Google Sheet trung tâm (Hàng #${sheetRow}). Thầy cô sẽ phản hồi vào mã <code>${safeCode}</code> sớm nhất!
        </div>
      `
      }

      ${followUpsHtml}

      <!-- Học sinh có thể nhắn phản hồi nối tiếp hoàn toàn ẩn danh bằng mã bảo mật -->
      <div class="student-followup-box">
        <label class="small-note" for="input-student-followup"><strong>✉️ Nhắn thêm cho thầy cô qua mã ${safeCode} (Hoàn toàn ẩn danh):</strong></label>
        <form id="form-student-followup" class="followup-form-row" data-code="${req.trackingCode}">
          <input type="text" id="input-student-followup" placeholder="Nhập lời nhắn tiếp theo của em (không cần lộ tên/SĐT)..." required />
          <button type="submit" class="btn-secondary-sm">Gửi ẩn danh</button>
        </form>
      </div>
    </div>
  `;

  const followUpForm = container.querySelector('#form-student-followup');
  if (followUpForm) {
    followUpForm.addEventListener('submit', async e => {
      e.preventDefault();
      const inputEl = followUpForm.querySelector('#input-student-followup');
      const msg = inputEl.value.trim();
      if (!msg) return;

      const fRes = await fetch('/api/help-requests/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCode: req.trackingCode,
          message: msg
        })
      });
      const fData = await fRes.json();
      if (fData.ok) {
        await lookupHelpRequest(req.trackingCode);
        await loadCounselorRequests();
      }
    });
  }
}

// ============================================================================
// PHÂN HỆ 4: VÒNG TRÒN HƠI THỞ 4-4-4, NHẬT KÝ CẢM XÚC & VƯỜN HOA TỬ TẾ
// ============================================================================
function toggleBreathingExercise() {
  const circle = document.getElementById('breathing-circle');
  const phaseText = document.getElementById('breathing-phase-text');
  const timerNum = document.getElementById('breathing-timer-num');
  const btn = document.getElementById('btn-toggle-breathing');

  if (appState.breathingActive) {
    clearInterval(appState.breathingInterval);
    appState.breathingActive = false;
    circle.className = 'breathing-circle';
    phaseText.textContent = 'Sẵn sàng';
    timerNum.textContent = '4s';
    btn.textContent = '▶️ Bắt đầu Tập thở Bình tâm';
    return;
  }

  appState.breathingActive = true;
  btn.textContent = '⏹️ Dừng bài tập thở';

  const phases = [
    { name: 'Hít vào thật sâu...', css: 'inhale' },
    { name: 'Giữ hơi nhẹ nhàng...', css: 'hold' },
    { name: 'Thở ra từ từ...', css: 'exhale' }
  ];

  let phaseIdx = 0;
  let secondsLeft = 4;

  const updateTick = () => {
    const current = phases[phaseIdx];
    circle.className = `breathing-circle ${current.css}`;
    phaseText.textContent = current.name;
    timerNum.textContent = `${secondsLeft}s`;

    secondsLeft -= 1;
    if (secondsLeft < 1) {
      secondsLeft = 4;
      phaseIdx = (phaseIdx + 1) % phases.length;
    }
  };

  updateTick();
  appState.breathingInterval = setInterval(updateTick, 1000);
}

async function recordMood(mood, note = '') {
  const res = await fetch('/api/moods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mood,
      note,
      grade: appState.grade,
      nickname: appState.nickname
    })
  });
  const data = await res.json();
  if (!data.ok) return null;

  appState.moodLogs.unshift(data.entry);
  renderMoodJournalList();
  return data;
}

function renderMoodJournalList() {
  const listEl = document.getElementById('mood-journal-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  const emojiMap = {
    happy: '😄',
    calm: '😌',
    anxious: '😟',
    sad: '😢',
    stressed: '🤯',
    angry: '😠'
  };

  appState.moodLogs.slice(0, 10).forEach(item => {
    const div = document.createElement('div');
    div.className = 'mood-log-item';
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-weight:700;">
        <span>${emojiMap[item.mood] || '🌻'} ${escapeHtml(item.nickname)} (Lớp ${escapeHtml(item.grade)}) — ${escapeHtml(item.moodLabel)}</span>
        <span class="small-note">${escapeHtml(formatDateVN(item.createdAt))}</span>
      </div>
      <p style="margin-top:0.2rem; color:#3B5568;">${escapeHtml(item.note)}</p>
    `;
    listEl.appendChild(div);
  });
}

function renderKindnessWall() {
  const grid = document.getElementById('kindness-cards-grid');
  if (!grid) return;
  grid.innerHTML = '';

  appState.kindnessMessages.forEach(card => {
    const el = document.createElement('div');
    el.className = `kindness-card ${escapeHtml(card.color || 'amber')}`;
    el.innerHTML = `
      <div>
        <div class="k-card-target">💌 Gửi tới: ${escapeHtml(card.toTarget)}</div>
        <p class="k-card-msg">“${escapeHtml(card.message)}”</p>
      </div>
      <div class="k-card-footer">
        <span>🌻 Từ: <strong>${escapeHtml(card.fromNickname)}</strong> (Lớp ${escapeHtml(card.grade)})</span>
        <button type="button" class="btn-like-kindness" data-id="${escapeHtml(card.id)}">
          💛 ${Number(card.likes) || 1}
        </button>
      </div>
    `;
    const likeBtn = el.querySelector('.btn-like-kindness');
    likeBtn.addEventListener('click', async () => {
      const res = await fetch('/api/kindness/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: card.id })
      });
      const data = await res.json();
      if (data.ok) {
        card.likes = data.card.likes;
        renderKindnessWall();
      }
    });
    grid.appendChild(el);
  });
}

// ============================================================================
// PHÂN HỆ 5: THỐNG KÊ XU HƯỚNG, QUẢN TRỊ PHÂN QUYỀN (RBAC) & ĐỒNG BỘ GOOGLE SHEET
// ============================================================================
function renderSchoolAnalyticsDashboard() {
  const container = document.getElementById('school-analytics-dashboard');
  if (!container || !appState.schoolStats) return;

  const st = appState.schoolStats;
  const byCat = st.byCategory || {};
  const byUrg = st.byUrgency || { low: 0, medium: 0, high: 0, critical: 0 };
  const ev = st.evaluationMetrics || {
    studentSatisfactionRate: '96.5%',
    avgResponseTime: '18 phút (Ca khẩn cấp < 5 phút)',
    referralQualityRate: '100% đúng thẩm quyền',
    campaignsCount: 12
  };

  const catListHtml = Object.entries(byCat)
    .map(([label, count]) => `<li><strong>${label}:</strong> ${count} phản ánh</li>`)
    .join('');

  container.innerHTML = `
    <div class="dos-donts-grid">
      <div class="do-box" style="background:#FFFDF7; border-color:#F2E8CF;">
        <h5 style="color:#0F293A;">📈 1. Xu Hướng Theo Nhóm Tình Huống & Mức Độ (Mục 3.6)</h5>
        <ul style="margin-top:0.35rem;">
          ${catListHtml || '<li>Chưa có dữ liệu</li>'}
        </ul>
        <p class="small-note" style="margin-top:0.45rem;">
          <strong>Phân bố mức độ:</strong> Khẩn cấp/Nguy cơ cao: <strong>${(byUrg.high || 0) + (byUrg.critical || 0)} ca</strong> • Trung bình/Thấp: <strong>${(byUrg.medium || 0) + (byUrg.low || 0)} ca</strong> • Đã xử lý: <strong>${st.repliedHelpRequests}/${st.totalHelpRequests} phản ánh</strong>.
        </p>
      </div>
      <div class="do-box" style="background:#E6FBF5; border-color:#A7F3D0;">
        <h5 style="color:#059669;">🏅 2. Đánh Giá Hiệu Quả & Hoạt Động Tuyên Truyền (Mục 6.2)</h5>
        <ul style="margin-top:0.35rem;">
          <li><strong>Khảo sát mức độ hài lòng & tin tưởng của HS:</strong> ${ev.studentSatisfactionRate}</li>
          <li><strong>Thời gian phản hồi trung bình:</strong> ${ev.avgResponseTime}</li>
          <li><strong>Chất lượng chuyển tuyến (3 Luồng Zalo):</strong> ${ev.referralQualityRate}</li>
          <li><strong>Hoạt động tuyên truyền & Góc Tử Tế:</strong> ${ev.campaignsCount} chuyên đề • ${st.totalKindnessNotes} thông điệp tích cực • ${st.totalMoodCheckins} lượt chia sẻ cảm xúc</li>
        </ul>
      </div>
    </div>
  `;
}

async function loginAdminRole(pinCode) {
  const fb = document.getElementById('admin-auth-feedback');
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pinCode })
  });
  const data = await res.json();
  if (!data.ok) {
    if (fb) {
      fb.style.color = '#DC2626';
      fb.textContent = `⚠️ ${data.error}`;
    }
    return;
  }

  appState.adminToken = data.session.token;
  appState.activeAdminRole = data.session;

  const exportLink = document.querySelector('.btn-export-sheet');
  if (exportLink) {
    exportLink.href = `/api/counselor/export-sheet.csv?token=${encodeURIComponent(data.session.token)}`;
  }

  if (fb) {
    fb.style.color = '#059669';
    fb.textContent = `✅ Đã kích hoạt phân quyền: ${data.session.title} (Luồng được phép truy cập: ${data.session.allowedChannels.join(', ')})`;
  }
  await loadCounselorRequests();
}

function buildClientZaloUrl(rawInput = '', fallback = 'https://zalo.me/0901234567') {
  const val = String(rawInput || '').trim();
  if (!val) return fallback;
  if (val.startsWith('http://') || val.startsWith('https://')) return val;
  const digits = val.replace(/[^0-9]/g, '');
  if (digits.length >= 8) return `https://zalo.me/${digits}`;
  return `https://zalo.me/${encodeURIComponent(val)}`;
}

function renderZaloQrConnectBoxes(integrations = {}) {
  const quick = integrations.zaloQuickLinks || {
    zalo_psych: '0901234567',
    zalo_gvcn: '0902345678',
    zalo_bgh: 'https://zalo.me/g/bghnangam2026'
  };

  const configs = [
    {
      elId: 'qr-box-zalo-psych',
      raw: quick.zalo_psych || '0901234567',
      label: 'Mở Zalo Cá nhân GV Tâm Lý',
      sub: 'Quét QR hoặc bấm mở Zalo Cá nhân'
    },
    {
      elId: 'qr-box-zalo-gvcn',
      raw: quick.zalo_gvcn || '0902345678',
      label: 'Mở Zalo Cá nhân GVCN',
      sub: 'Quét QR hoặc bấm mở Zalo Cá nhân'
    },
    {
      elId: 'qr-box-zalo-bgh',
      raw: quick.zalo_bgh || 'https://zalo.me/g/bghnangam2026',
      label: 'Tham gia Group Zalo BGH',
      sub: 'Quét QR vào thẳng Nhóm Ban Giám Hiệu'
    }
  ];

  configs.forEach(cfg => {
    const box = document.getElementById(cfg.elId);
    if (!box) return;
    const directUrl = buildClientZaloUrl(cfg.raw);
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=4&data=${encodeURIComponent(directUrl)}`;
    box.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.65rem; margin-top:0.55rem; background:#FFFFFF; padding:0.5rem; border-radius:8px; border:1px solid #E5D4AC;">
        <img src="${qrImgUrl}" alt="QR ${cfg.label}" width="64" height="64" style="border-radius:6px; border:1px solid #F2E8CF; flex-shrink:0;" loading="lazy" />
        <div style="display:flex; flex-direction:column; gap:0.25rem;">
          <span class="small-note" style="font-weight:700; color:#0F293A;">📱 ${cfg.sub}</span>
          <code style="font-size:0.74rem; color:#0284C7; word-break:break-all;">${directUrl}</code>
          <a href="${directUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary-sm" style="text-decoration:none; display:inline-block; width:fit-content; font-size:0.76rem; padding:0.25rem 0.55rem;">
            🔗 ${cfg.label}
          </a>
        </div>
      </div>
    `;
  });
}

async function loadCounselorRequests() {
  try {
    const headers = {};
    if (appState.adminToken) {
      headers['X-Admin-Token'] = appState.adminToken;
    }
    const res = await fetch('/api/counselor/requests', { headers });
    const data = await res.json();
    if (!data.ok) {
      if (data.requireAuth) {
        const roleHeading = document.getElementById('admin-role-heading');
        if (roleHeading) {
          roleHeading.textContent = '🔒 Chế độ Bảo mật Nhà trường: Vui lòng nhập Mã PIN Phân quyền để xem hồ sơ';
        }
        const listBox = document.getElementById('counselor-requests-list');
        if (listBox) {
          listBox.innerHTML = `<div class="card" style="background:#FFFBEB; border:1px solid #FDE68A;">
            <p style="font-weight:700; color:#92400E;">🔐 ${escapeHtml(data.error)}</p>
            <p class="small-note" style="margin-top:0.3rem;">Nhập Mã PIN của Phòng Tâm lý, GV Chủ nhiệm hoặc Ban Giám hiệu vào ô phía trên để mở khóa đúng luồng hồ sơ được phân quyền.</p>
          </div>`;
        }
      }
      return;
    }

    appState.counselorRequests = data.requests || [];
    appState.integrations = data.integrations || {};

    const roleHeading = document.getElementById('admin-role-heading');
    if (roleHeading && data.activeRole) {
      roleHeading.textContent = `Đang xem với quyền: ${data.activeRole.title}`;
    }

    if (data.integrations) {
      const qPsych = document.getElementById('quick-zalo-psych');
      const qGvcn = document.getElementById('quick-zalo-gvcn');
      const qBgh = document.getElementById('quick-zalo-bgh');
      const whPsych = document.getElementById('wh-zalo-psych');
      const whGvcn = document.getElementById('wh-zalo-gvcn');
      const whBgh = document.getElementById('wh-zalo-bgh');
      const whSheet = document.getElementById('wh-google-sheet');

      if (qPsych) qPsych.value = data.integrations.zaloQuickLinks?.zalo_psych || '0901234567';
      if (qGvcn) qGvcn.value = data.integrations.zaloQuickLinks?.zalo_gvcn || '0902345678';
      if (qBgh) qBgh.value = data.integrations.zaloQuickLinks?.zalo_bgh || 'https://zalo.me/g/bghnangam2026';
      if (whPsych) whPsych.value = data.integrations.zaloWebhooks?.zalo_psych || '';
      if (whGvcn) whGvcn.value = data.integrations.zaloWebhooks?.zalo_gvcn || '';
      if (whBgh) whBgh.value = data.integrations.zaloWebhooks?.zalo_bgh || '';
      if (whSheet) whSheet.value = data.integrations.googleSheetWebhookUrl || '';

      renderZaloQrConnectBoxes(data.integrations);
    }

    renderCounselorPortal();
  } catch (err) {
    console.error('Lỗi tải danh sách hộp thư giáo viên:', err);
  }
}

function renderCounselorPortal() {
  const container = document.getElementById('counselor-requests-list');
  if (!container) return;
  container.innerHTML = '';

  let filtered = appState.counselorRequests;
  if (appState.counselorFilter === 'pending') {
    filtered = filtered.filter(r => r.status === 'pending');
  } else if (appState.counselorFilter === 'replied') {
    filtered = filtered.filter(r => r.status === 'replied');
  } else if (['zalo_psych', 'zalo_gvcn', 'zalo_bgh'].includes(appState.counselorFilter)) {
    filtered = filtered.filter(r =>
      (r.zaloDispatch?.routedChannels || []).includes(appState.counselorFilter)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="card"><p>Không có hồ sơ nào trong luồng/bộ lọc này (hoặc tài khoản hiện tại không có quyền xem luồng Zalo này).</p></div>`;
    return;
  }

  filtered.forEach(req => {
    const card = document.createElement('div');
    card.className = 'counselor-req-card';

    const urgencyBadge =
      req.urgency === 'high' || req.urgency === 'critical'
        ? `<span class="badge-pill urgent">🚨 Khẩn cấp: ${req.urgency.toUpperCase()}</span>`
        : `<span class="badge-pill">Mức độ: ${req.urgency}</span>`;

    const statusBadge =
      req.status === 'replied'
        ? `<span class="badge-pill replied">✅ Đã phản hồi</span>`
        : `<span class="badge-pill">⏳ Chờ tư vấn</span>`;

    const zaloChannelsBadges = (req.zaloDispatch?.routedChannelNames || [req.recipient])
      .map(name => `<span class="badge-pill" style="background:#E6FBF5; color:#059669;">📲 ${name}</span>`)
      .join(' ');

    const sheetBadge = `<span class="badge-pill" style="background:#EAF6FF; color:#0284C7;">📊 Google Sheet Hàng #${req.googleSheetSync?.rowNumber || 2}</span>`;

    const followUpsHtml =
      Array.isArray(req.studentFollowUps) && req.studentFollowUps.length > 0
        ? `
        <div style="margin-top:0.5rem; background:#FFFBEB; padding:0.6rem; border-radius:8px; border:1px solid #FDE68A;">
          <strong class="small-note">💬 Học sinh nhắn phản hồi ẩn danh:</strong>
          ${req.studentFollowUps
            .map(f => `<div class="small-note">• "${escapeHtml(f.message)}" (${escapeHtml(formatDateVN(f.createdAt))})</div>`)
            .join('')}
        </div>
      `
        : '';

    const safeCode = escapeHtml(req.trackingCode);
    const safeStudent = req.isAnonymous
      ? `${escapeHtml(req.nickname)} (Ẩn danh 100%)`
      : `${escapeHtml(req.studentName)} (${escapeHtml(req.className)})`;

    card.innerHTML = `
      <div class="c-req-header">
        <div>
          <strong>Mã Tra Cứu: <code>${safeCode}</code></strong> —
          <span>Học sinh: <strong>${safeStudent}</strong> • Khối Lớp ${escapeHtml(req.grade)}</span>
        </div>
        <div class="c-req-badges">
          ${zaloChannelsBadges}
          ${sheetBadge}
          ${urgencyBadge}
          ${statusBadge}
          <span class="small-note">${escapeHtml(formatDateVN(req.createdAt))}</span>
        </div>
      </div>

      <p class="small-note"><strong>Phân loại:</strong> ${escapeHtml(req.categoryLabel)} • <strong>Địa điểm/Thời gian:</strong> ${escapeHtml(req.locationAndTime)}</p>
      ${req.evidenceNote ? `<p class="small-note"><strong>📎 Bằng chứng bổ sung:</strong> ${escapeHtml(req.evidenceNote)}</p>` : ''}
      ${req.contactMethod ? `<p class="small-note"><strong>📞 Phương thức liên hệ học sinh để lại:</strong> ${escapeHtml(req.contactMethod)}</p>` : ''}
      <p style="margin-top:0.5rem; background:#FFFDF7; padding:0.75rem; border-radius:8px; border:1px solid #F2E8CF;">
        <strong>Nội dung học sinh chia sẻ:</strong> "${escapeHtml(req.description)}"
      </p>

      ${followUpsHtml}

      ${
        req.status === 'replied'
          ? `
        <div class="counselor-reply-box">
          <strong>🌻 Phản hồi đã gửi (${escapeHtml(req.repliedBy)}):</strong>
          <p>${escapeHtml(req.counselorReply)}</p>
        </div>
      `
          : ''
      }

      ${
        req.aiCoPilotBriefing
          ? `
      <div style="margin-top:0.6rem; padding:0.75rem; background:#F0FDF4; border:1px solid #86EFAC; border-radius:10px;">
        <strong style="color:#166534;">🧠 Cố Vấn AI: ${req.aiCoPilotBriefing.situationTitle}</strong>
        <p class="small-note" style="margin-top:0.35rem;"><strong>Tâm sinh lý:</strong> ${req.aiCoPilotBriefing.psychInsight}</p>
        <p class="small-note" style="margin-top:0.25rem;"><strong>Căn cứ pháp lý:</strong> ${req.aiCoPilotBriefing.legalBasis}</p>
        <ul class="small-note" style="margin:0.3rem 0 0 1rem;">
          ${(req.aiCoPilotBriefing.tacticalSteps || []).map(s => `<li>${s}</li>`).join('')}
        </ul>
        <div style="margin-top:0.5rem; display:flex; flex-direction:column; gap:0.35rem;">
          <span class="small-note" style="font-weight:700;">✍️ Chọn 1 phương án trả lời (tự điền vào ô phản hồi bên dưới):</span>
          ${(req.aiCoPilotBriefing.replyOptions || [])
            .map((o, i) => `<button type="button" class="btn-secondary-sm btn-copilot-reply" data-idx="${i}" style="text-align:left;">${o.label}</button>`)
            .join('')}
        </div>
      </div>`
          : ''
      }

      <!-- Cụm nút Chuyển tiếp 1-Chạm sang đúng Luồng Zalo (Cá nhân / Group BGH) -->
      <div style="display:flex; flex-wrap:wrap; gap:0.5rem; align-items:center; margin-top:0.55rem; padding:0.5rem 0.65rem; background:#F0FDF4; border-radius:8px; border:1px solid #BBF7D0;">
        <span class="small-note" style="font-weight:700; color:#065F46;">📲 Đẩy nhanh sang Zalo:</span>
        <button type="button" class="btn-secondary-sm btn-oneclick-zalo" data-channel="zalo_psych">
          👤 Copy & Mở Zalo 1 (Cá nhân Tâm lý)
        </button>
        <button type="button" class="btn-secondary-sm btn-oneclick-zalo" data-channel="zalo_gvcn">
          👤 Copy & Mở Zalo 2 (Cá nhân GVCN)
        </button>
        <button type="button" class="btn-secondary-sm btn-oneclick-zalo" data-channel="zalo_bgh" style="background:#FFF0ED; color:#DC2626; border-color:#FECACA;">
          👥 Copy & Mở Group Zalo 3 (Ban Giám Hiệu)
        </button>
        <span class="small-note zalo-copy-status" style="color:#059669; font-weight:700;"></span>
      </div>

      <form class="c-reply-form" data-code="${safeCode}">
        <textarea rows="2" placeholder="Nhập lời khuyên tâm lý và phương án hỗ trợ bảo vệ học sinh (mã ${safeCode})..." required>${escapeHtml(req.counselorReply || '')}</textarea>
        <button type="submit" class="btn-send-counselor-reply">
          ${req.status === 'replied' ? 'Cập nhật & Đồng bộ Sheet' : '💌 Gửi phản hồi & Đồng bộ Sheet'}
        </button>
      </form>
    `;

    const form = card.querySelector('.c-reply-form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const textarea = form.querySelector('textarea');
      const replyText = textarea.value.trim();
      if (!replyText) return;

      const headers = { 'Content-Type': 'application/json' };
      if (appState.adminToken) {
        headers['X-Admin-Token'] = appState.adminToken;
      }

      const res = await fetch('/api/counselor/reply', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          trackingCode: req.trackingCode,
          counselorReply: replyText
        })
      });
      const data = await res.json();
      if (data.ok) {
        await loadCounselorRequests();
        await lookupHelpRequest(req.trackingCode);
      }
    });

    card.querySelectorAll('.btn-copilot-reply').forEach(rBtn => {
      rBtn.addEventListener('click', () => {
        const opt = req.aiCoPilotBriefing?.replyOptions?.[Number(rBtn.getAttribute('data-idx'))];
        const ta = card.querySelector('.c-reply-form textarea');
        if (opt && ta) {
          ta.value = opt.text;
          ta.focus();
        }
      });
    });

    card.querySelectorAll('.btn-oneclick-zalo').forEach(zBtn => {
      zBtn.addEventListener('click', async () => {
        const ch = zBtn.getAttribute('data-channel');
        const quickLinks = appState.integrations?.zaloQuickLinks || {
          zalo_psych: '0901234567',
          zalo_gvcn: '0902345678',
          zalo_bgh: 'https://zalo.me/g/bghnangam2026'
        };
        const targetUrl = buildClientZaloUrl(quickLinks[ch]);
        const summaryText =
          req.aiCoPilotBriefing?.bghZaloClipboardText ||
          req.zaloDispatch?.zaloMessagePreview ||
          `[BẠN ĐỒNG HÀNH AI] Mã: ${req.trackingCode} | Khối ${req.grade} | Phân loại: ${req.categoryLabel} | Nội dung: ${req.description}`;
        try {
          await navigator.clipboard.writeText(summaryText);
        } catch (_e) {
          // Bỏ qua nếu trình duyệt chặn clipboard
        }
        const statusEl = card.querySelector('.zalo-copy-status');
        if (statusEl) {
          statusEl.textContent = '✅ Đã copy nội dung hồ sơ! Đang mở Zalo...';
        }
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      });
    });

    container.appendChild(card);
  });
}

// ============================================================================
// GẮN SỰ KIỆN TƯƠNG TÁC TOÀN CỤC
// ============================================================================
function bindGlobalEvents() {
  // 1. Chọn Khối lớp (6, 7, 8, 9) & Vai trò cá thể hóa (Mục 3.2)
  const gradeSelect = document.getElementById('select-grade');
  if (gradeSelect) {
    gradeSelect.addEventListener('change', () => {
      appState.grade = gradeSelect.value;
      updateGradeUI();
    });
  }

  const roleSelect = document.getElementById('select-role');
  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      appState.studentRole = roleSelect.value;
      updateGradeUI();
    });
  }

  // Nút điều hướng 4 khu vực chính trên Banner (Mục 2 File Word)
  document.querySelectorAll('.word-area-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-jump-tab');
      if (targetTab) {
        switchTab(targetTab);
      }
      if (btn.getAttribute('data-scroll-directory') === 'true') {
        const dirEl = document.getElementById('support-directory-list');
        if (dirEl) dirEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 2. Đổi Biệt danh an toàn
  const nickInput = document.getElementById('input-nickname');
  if (nickInput) {
    nickInput.addEventListener('input', () => {
      appState.nickname = nickInput.value.trim() || 'Gấu Bông Dũng Cảm';
      updateGradeUI();
    });
  }

  const randomNickBtn = document.getElementById('btn-random-nickname');
  if (randomNickBtn && nickInput) {
    randomNickBtn.addEventListener('click', () => {
      const next = CUTE_NICKNAMES[Math.floor(Math.random() * CUTE_NICKNAMES.length)];
      nickInput.value = next;
      appState.nickname = next;
      updateGradeUI();
    });
  }

  // 3. Chuyển đổi 5 Tab chính
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  // 4. Check-in cảm xúc nhanh trên Hero Banner
  document.querySelectorAll('.quick-mood-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.quick-mood-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const mood = btn.getAttribute('data-mood');
      const data = await recordMood(mood, 'Check-in nhanh trên bảng tin Nắng Ấm');
      const fb = document.getElementById('quick-mood-feedback');
      if (fb && data?.encouragement) {
        fb.textContent = data.encouragement;
      }
    });
  });

  // 5. Chọn nhanh Hoàn cảnh bên cột trái khung Chat
  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      appState.selectedTopic = chip.getAttribute('data-topic') || '';
      const prompt = chip.getAttribute('data-prompt') || '';
      if (prompt) {
        sendChatMessage(prompt);
      }
    });
  });

  // 6. Gửi tin nhắn Chat AI
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  if (chatForm) {
    chatForm.addEventListener('submit', e => {
      e.preventDefault();
      sendChatMessage();
    });
  }
  if (chatInput) {
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  // 7. Cấu hình tùy chọn Gemini API
  const btnToggleGemini = document.getElementById('btn-toggle-gemini-config');
  const geminiDrawer = document.getElementById('gemini-config-drawer');
  if (btnToggleGemini && geminiDrawer) {
    btnToggleGemini.addEventListener('click', () => {
      geminiDrawer.classList.toggle('hidden');
    });
  }

  const btnSaveGemini = document.getElementById('btn-save-gemini-key');
  if (btnSaveGemini) {
    btnSaveGemini.addEventListener('click', async () => {
      const key = document.getElementById('input-gemini-key').value;
      const headers = { 'Content-Type': 'application/json' };
      if (appState.adminToken) headers['X-Admin-Token'] = appState.adminToken;
      const res = await fetch('/api/settings/gemini', {
        method: 'POST',
        headers,
        body: JSON.stringify({ apiKey: key })
      });
      const data = await res.json();
      const msgEl = document.getElementById('gemini-save-msg');
      const labelEl = document.getElementById('ai-engine-label');
      if (msgEl) msgEl.textContent = data.message || data.error || '';
      if (labelEl && data.ok) {
        labelEl.textContent = data.hasGeminiKey
          ? 'Gemini API + AI Sư phạm An toàn'
          : 'AI Sư phạm Nội tại (Sẵn sàng 100%)';
      }
    });
  }

  // 8. Hộp Thư Cầu Viện An Toàn
  const chkAnon = document.getElementById('chk-anonymous');
  const namedFields = document.getElementById('named-student-fields');
  if (chkAnon && namedFields) {
    chkAnon.addEventListener('change', () => {
      namedFields.classList.toggle('hidden', chkAnon.checked);
    });
  }

  const helpForm = document.getElementById('form-help-request');
  if (helpForm) {
    helpForm.addEventListener('submit', submitHelpRequest);
  }

  const lookupForm = document.getElementById('form-lookup-code');
  if (lookupForm) {
    lookupForm.addEventListener('submit', e => {
      e.preventDefault();
      const code = document.getElementById('input-lookup-code').value;
      lookupHelpRequest(code);
    });
  }

  document.querySelectorAll('.chip-code:not(.rbac-pin-chip)').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      const input = document.getElementById('input-lookup-code');
      if (input) input.value = code;
      lookupHelpRequest(code);
    });
  });

  // 9. Bài tập thở 4-4-4 & Nhật ký Cảm xúc
  const btnBreathing = document.getElementById('btn-toggle-breathing');
  if (btnBreathing) {
    btnBreathing.addEventListener('click', toggleBreathingExercise);
  }

  const moodJournalForm = document.getElementById('form-mood-journal');
  if (moodJournalForm) {
    moodJournalForm.addEventListener('submit', async e => {
      e.preventDefault();
      const mood = document.getElementById('journal-mood-select').value;
      const noteInput = document.getElementById('journal-mood-note');
      await recordMood(mood, noteInput.value);
      noteInput.value = '';
    });
  }

  // 10. Vườn Hoa Tử Tế (Kindness Wall)
  const kindnessForm = document.getElementById('form-kindness');
  if (kindnessForm) {
    kindnessForm.addEventListener('submit', async e => {
      e.preventDefault();
      const toTarget = document.getElementById('kindness-target').value;
      const color = document.getElementById('kindness-color').value;
      const msgInput = document.getElementById('kindness-message');
      const fbEl = document.getElementById('kindness-feedback-msg');

      const res = await fetch('/api/kindness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromNickname: appState.nickname,
          grade: appState.grade,
          toTarget,
          color,
          message: msgInput.value
        })
      });
      const data = await res.json();
      if (!data.ok) {
        if (fbEl) {
          fbEl.style.color = '#DC2626';
          fbEl.textContent = data.error;
        }
        return;
      }

      if (fbEl) {
        fbEl.style.color = '#059669';
        fbEl.textContent = '🌸 Đã gieo một bông hoa lời chúc lên Vườn Tử Tế thành công!';
      }
      msgInput.value = '';
      appState.kindnessMessages.unshift(data.card);
      renderKindnessWall();
    });
  }

  // 11. Phân quyền Quản trị (RBAC) & Cấu hình Webhook 3 Luồng Zalo + Google Sheet
  const adminLoginForm = document.getElementById('form-admin-login');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', e => {
      e.preventDefault();
      const pin = document.getElementById('input-admin-pin').value;
      loginAdminRole(pin);
    });
  }

  document.querySelectorAll('.rbac-pin-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const pin = btn.getAttribute('data-pin');
      const input = document.getElementById('input-admin-pin');
      if (input) input.value = pin;
      loginAdminRole(pin);
    });
  });

  const btnToggleWebhook = document.getElementById('btn-toggle-webhook-drawer');
  const webhookDrawer = document.getElementById('webhook-config-drawer');
  if (btnToggleWebhook && webhookDrawer) {
    btnToggleWebhook.addEventListener('click', () => {
      webhookDrawer.classList.toggle('hidden');
    });
  }

  const webhookForm = document.getElementById('form-webhook-config');
  if (webhookForm) {
    webhookForm.addEventListener('submit', async e => {
      e.preventDefault();
      const headers = { 'Content-Type': 'application/json' };
      if (appState.adminToken) headers['X-Admin-Token'] = appState.adminToken;
      const res = await fetch('/api/counselor/integrations', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          quick_zalo_psych: document.getElementById('quick-zalo-psych')?.value || '',
          quick_zalo_gvcn: document.getElementById('quick-zalo-gvcn')?.value || '',
          quick_zalo_bgh: document.getElementById('quick-zalo-bgh')?.value || '',
          zalo_psych: document.getElementById('wh-zalo-psych')?.value || '',
          zalo_gvcn: document.getElementById('wh-zalo-gvcn')?.value || '',
          zalo_bgh: document.getElementById('wh-zalo-bgh')?.value || '',
          googleSheetWebhookUrl: document.getElementById('wh-google-sheet')?.value || ''
        })
      });
      const data = await res.json();
      const msgEl = document.getElementById('webhook-save-msg');
      if (msgEl) {
        if (data.ok) {
          msgEl.style.color = '#059669';
          msgEl.textContent = `✅ ${data.message}`;
          appState.integrations = data.integrations;
          renderZaloQrConnectBoxes(data.integrations);
        } else {
          msgEl.style.color = '#DC2626';
          msgEl.textContent = `⚠️ ${data.error || 'Không thể lưu cấu hình.'}`;
        }
      }
    });
  }

  const btnEscalate = document.getElementById('btn-escalate-chat-to-zalo');
  if (btnEscalate) btnEscalate.addEventListener('click', () => escalateChatToZalo(false));

  const copilotForm = document.getElementById('form-copilot-advisor');
  if (copilotForm) {
    copilotForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById('input-copilot-question').value.trim();
      if (q) askCopilot(q);
    });
  }
  document.querySelectorAll('.copilot-quick-q').forEach(b => {
    b.addEventListener('click', () => {
      const q = b.getAttribute('data-q');
      const inp = document.getElementById('input-copilot-question');
      if (inp) inp.value = q;
      askCopilot(q);
    });
  });

  const btnCopyAppsScript = document.getElementById('btn-copy-apps-script');
  if (btnCopyAppsScript) {
    btnCopyAppsScript.addEventListener('click', async () => {
      const codeBlock = document.getElementById('apps-script-code-block');
      const fb = document.getElementById('copy-script-feedback');
      if (!codeBlock) return;
      try {
        await navigator.clipboard.writeText(codeBlock.textContent);
        if (fb) fb.textContent = '✅ Đã copy mã Apps Script! Hãy dán vào Google Sheet > Extensions > Apps Script.';
      } catch (_e) {
        if (fb) fb.textContent = '⚠️ Hãy bôi đen đoạn mã bên dưới và nhấn Ctrl+C.';
      }
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.counselorFilter = btn.getAttribute('data-filter') || 'all';
      renderCounselorPortal();
    });
  });

  // 12. Chế độ Ngụy trang An toàn (Quick Exit Camouflage)
  const camouflageScreen = document.getElementById('camouflage-screen');
  const mainApp = document.getElementById('main-app');
  const btnCamouflage = document.getElementById('btn-quick-camouflage');
  const btnExitCamouflage = document.getElementById('btn-exit-camouflage');

  const activateCamouflage = () => {
    camouflageScreen.classList.remove('hidden');
    camouflageScreen.setAttribute('aria-hidden', 'false');
    mainApp.classList.add('hidden');
    document.title = 'Ôn tập Công thức Toán & Tiếng Anh THCS';
  };

  const deactivateCamouflage = () => {
    camouflageScreen.classList.add('hidden');
    camouflageScreen.setAttribute('aria-hidden', 'true');
    mainApp.classList.remove('hidden');
    document.title = 'BẠN ĐỒNG HÀNH AI 🌻 | Tư Vấn Tâm Lý Ẩn Danh THCS';
  };

  if (btnCamouflage) btnCamouflage.addEventListener('click', activateCamouflage);
  if (btnExitCamouflage) btnExitCamouflage.addEventListener('click', deactivateCamouflage);

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const now = Date.now();
      if (now - appState.lastEscTime < 800) {
        activateCamouflage();
      }
      appState.lastEscTime = now;
    }
  });

  // 13. Modal SOS Khẩn cấp (Tổng đài 111)
  const sosModal = document.getElementById('sos-modal');
  const btnOpenSos = document.getElementById('btn-open-sos');
  const btnCloseSos = document.getElementById('btn-close-sos');
  const btnSosGoHelpbox = document.getElementById('btn-sos-go-helpbox');

  if (btnOpenSos && sosModal) {
    btnOpenSos.addEventListener('click', () => {
      sosModal.classList.remove('hidden');
    });
  }
  if (btnCloseSos && sosModal) {
    btnCloseSos.addEventListener('click', () => {
      sosModal.classList.add('hidden');
    });
  }
  if (btnSosGoHelpbox && sosModal) {
    btnSosGoHelpbox.addEventListener('click', () => {
      sosModal.classList.add('hidden');
      switchTab('helpbox');
      const urgencySelect = document.getElementById('help-urgency');
      if (urgencySelect) urgencySelect.value = 'critical';
      document.getElementById('help-description')?.focus();
    });
  }
}

document.addEventListener('DOMContentLoaded', initApp);
