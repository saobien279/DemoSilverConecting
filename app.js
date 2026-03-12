/* ═══════════════════════════════════════════════════════
   SILVER CONNECT — APP.JS  (Voice-fixed build)
   • Voice reading: unlock on first interaction, guaranteed
   • Excellent comments xuất hiện sớm (comment thứ 3, 7, 12...)
   • TikTok toasts frosted glass chữ đen cho Elder
═══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   VOICE ENGINE — robust cross-browser
══════════════════════════════════════ */
const Voice = (() => {
  let unlocked = false;
  let voiceList = [];

  function loadVoices() {
    voiceList = window.speechSynthesis.getVoices();
  }

  function unlock() {
    if (unlocked || !('speechSynthesis' in window)) return;
    // Speak a zero-length utterance to unblock autoplay policy
    const u = new SpeechSynthesisUtterance('');
    u.volume = 0;
    window.speechSynthesis.speak(u);
    unlocked = true;
    loadVoices();
  }

  function speak(text, rate) {
    if (!('speechSynthesis' in window)) return;
    loadVoices();
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang   = 'vi-VN';
    u.rate   = rate || 0.88;
    u.pitch  = 1.05;
    u.volume = 1;

    // Try Vietnamese voice first, fallback to any
    const vi = voiceList.find(v => v.lang.startsWith('vi'))
             || voiceList.find(v => v.lang.startsWith('vi-'))
             || voiceList[0];
    if (vi) u.voice = vi;

    // Chrome bug: cancel long pauses
    const resume = setInterval(() => {
      if (!window.speechSynthesis.speaking) { clearInterval(resume); return; }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 8000);
    u.onend = () => clearInterval(resume);

    window.speechSynthesis.speak(u);
  }

  function stop() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  // Auto-load voices once available
  if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  return { unlock, speak, stop };
})();

/* ══════════════════════════════════════
   ELDER DATA
══════════════════════════════════════ */

// Comments cho màn hình Elder (TikTok overlay trên video)
// excellent → đọc voice + voice-bar
const ELDER_COMMENTS = [
  { u: 'Ngọc Ánh',   c: 'Chào bác ạ! Em rất xúc động ❤️',                                                                                                              q: 'normal',    col: '#FF9A3C' },
  { u: 'Tuấn Kiệt',  c: 'Hay quá bác ơi! 👏',                                                                                                                           q: 'normal',    col: '#4facfe' },
  { u: 'Hải Đăng',   c: 'Thưa bác, em vừa trải qua thất bại lớn và rất nản lòng. Nghe câu chuyện của bác, em hiểu rằng thất bại chỉ là bước đệm. Cảm ơn bác từ tận đáy lòng!', q: 'excellent', col: '#E74C3C' },
  { u: 'Khánh Linh', c: 'Em đang ngồi khóc rồi ạ 😭',                                                                                                                   q: 'normal',    col: '#a18cd1' },
  { u: 'Minh Châu',  c: 'Câu chuyện của bác chạm đến trái tim em rất nhiều!',                                                                                           q: 'good',      col: '#f093fb' },
  { u: 'Quang Huy',  c: 'Em 22 tuổi, đang mất phương hướng — nghe bác nói em hiểu ra nhiều điều.',                                                                     q: 'good',      col: '#43e97b' },
  { u: 'Bảo Châu',   c: 'Điều gì giúp bác vượt qua giai đoạn khó khăn nhất ạ?',                                                                                        q: 'normal',    col: '#7B68EE' },
  { u: 'Phương Linh',c: 'Thưa bác, con đường bác đã đi qua đã dạy cho em rằng kiên trì và yêu thương là hai thứ không bao giờ lỗi thời. Em sẽ nhớ buổi hôm nay mãi mãi!', q: 'excellent', col: '#9D8AFF' },
  { u: 'Thu Hà',     c: '❤️❤️❤️ Bác truyền cảm hứng quá!',                                                                                                             q: 'normal',    col: '#FF6B8B' },
  { u: 'Yến Nhi',    c: 'Bác kể tiếp đi ạ! Em không muốn buổi này kết thúc 😊',                                                                                        q: 'normal',    col: '#FFD700' },
  { u: 'Lan Anh',    c: 'Em đã lưu câu nói này vào Smart Notes rồi bác ơi!',                                                                                            q: 'good',      col: '#FF6B8B' },
  { u: 'Văn Tùng',   c: 'Thế hệ gen Z chúng em rất cần nghe những bài học như thế này!',                                                                               q: 'good',      col: '#4facfe' },
  { u: 'Mai Phương', c: 'Em 20 tuổi, rất hoang mang về tương lai. Câu "hãy sống hết mình với hiện tại" của bác — đó là điều em cần nghe nhất hôm nay!',                q: 'excellent', col: '#FF9A3C' },
  { u: 'Kim Ngân',   c: 'Mình đang chia sẻ link buổi live này cho cả nhóm bạn thân!',                                                                                  q: 'normal',    col: '#f093fb' },
  { u: 'Gia Bảo',    c: '"Đừng bao giờ so sánh cuộc đời mình với người khác" — câu này hay quá bác!',                                                                  q: 'good',      col: '#2ECC71' },
  { u: 'Hồng Nhung', c: '👏👏👏 Tuyệt vời bác ơi!',                                                                                                                     q: 'normal',    col: '#FF6B8B' },
  { u: 'Bảo Châu',   c: 'Cảm ơn bác đã dành thời gian cho chúng em! Buổi hôm nay thực sự thay đổi cách em nhìn về cuộc sống.',                                        q: 'excellent', col: '#7B68EE' },
  { u: 'Tuấn Anh',   c: 'Livestream hay nhất em từng xem! 🔥',                                                                                                          q: 'good',      col: '#4facfe' },
  { u: 'Ngọc Bích',  c: '315 người đang xem cùng em đây bác ơi!',                                                                                                      q: 'normal',    col: '#a18cd1' },
  { u: 'Minh Khôi',  c: 'Cảm ơn Silver Connect đã kết nối thế hệ như thế này 💜',                                                                                      q: 'good',      col: '#FF9A3C' },
];

// Toast notifications trong luồng Elder (không phải comment stream)
const ELDER_TOASTS = [
  { msg: 'Cháu chào bác Minh! Còn <strong>8 phút</strong> nữa là gặp các bạn sinh viên rồi. Chúc bác buổi chia sẻ thật ý nghĩa!', type: 'ai' },
  { msg: '<strong>Bạn Ngọc Ánh</strong> hỏi: Bác ơi, điều gì giúp bác vượt qua giai đoạn khó khăn nhất trong cuộc đời ạ?', type: 'q' },
  { msg: '<strong>125 bạn sinh viên</strong> vừa gửi ❤️ cho bác — mọi người rất xúc động!', type: 'star' },
  { msg: '<strong>Bạn Tuấn Kiệt</strong> hỏi: Bác có lời khuyên gì cho gen Z đang mất phương hướng không ạ?', type: 'q' },
  { msg: '<strong>18 sinh viên</strong> vừa lưu đoạn vừa rồi vào Smart Notes!', type: 'star' },
  { msg: '<strong>Bạn Hải Đăng</strong> hỏi: Thưa bác, bác định nghĩa "thành công thật sự" như thế nào ạ?', type: 'q' },
  { msg: '90 bình luận trong 5 phút — buổi chia sẻ đang rất <strong>hot</strong> bác ơi! 🔥', type: 'ai' },
  { msg: '<strong>Bạn Bảo Châu</strong> hỏi: Điều bác muốn nhắn nhủ nhất với thế hệ gen Z là gì ạ?', type: 'q' },
  { msg: '<strong>12 người</strong> vừa đăng ký theo dõi buổi chia sẻ tiếp theo của bác!', type: 'star' },
];

/* ══════════════════════════════════════
   STUDENT DATA
══════════════════════════════════════ */

// Comment pool cho Student chat
// Excellent → đọc voice + toast + voice-bar + highlight trong chat
const STUDENT_COMMENTS = [
  { u: 'Ngọc Ánh',   c: '❤️❤️ Chào bác ạ!',                                                                                                                            q: 'normal',    col: '#FF9A3C' },
  { u: 'Tuấn Kiệt',  c: 'Bác ơi, bí quyết hôn nhân 40 năm là gì ạ?',                                                                                                  q: 'normal',    col: '#4facfe' },
  // ★ EXCELLENT #1 — xuất hiện sớm (~15s sau khi vào live)
  { u: 'Bảo Châu',   c: 'Thưa bác, em đang trong một mối quan hệ rất khó khăn. Câu chuyện của bác cho em thấy rằng kiên nhẫn và yêu thương thật sự có thể vượt qua tất cả. Em cảm ơn bác từ tận đáy lòng!', q: 'excellent', col: '#7B68EE' },
  { u: 'Khánh Linh', c: 'Em nghĩ đến bố mẹ em 🥺',                                                                                                                      q: 'normal',    col: '#a18cd1' },
  { u: 'Minh Châu',  c: 'Câu chuyện của bác khiến em khóc mà không biết tại sao 💕',                                                                                   q: 'good',      col: '#f093fb' },
  { u: 'Đức Anh',    c: 'Câu nói "không ngủ khi còn giận nhau" hay quá!',                                                                                              q: 'good',      col: '#F1C40F' },
  { u: 'Hồng Nhung', c: 'Em chia sẻ link này cho bạn trai em luôn 😂',                                                                                                  q: 'normal',    col: '#FF6B8B' },
  // ★ EXCELLENT #2 — ~55s
  { u: 'Gia Bảo',    c: 'Mình năm 22 tuổi, chưa biết tình yêu là gì. Nghe bác nói mình hiểu rằng tình yêu đích thực cần thời gian và nỗ lực chứ không phải cảm xúc bồng bột nhất thời. Cảm ơn bác!', q: 'excellent', col: '#2ECC71' },
  { u: 'Thu Hà',     c: 'Bác ơi em khóc rồi ạ 😭',                                                                                                                      q: 'normal',    col: '#a18cd1' },
  { u: 'Tuấn Anh',   c: '💯 Hay hơn bất kỳ cuốn sách nào!',                                                                                                             q: 'good',      col: '#4facfe' },
  { u: 'Ngọc Bích',  c: '"Tôn trọng sự khác biệt" — em sẽ nhớ câu này mãi!',                                                                                          q: 'good',      col: '#f093fb' },
  { u: 'Minh Khôi',  c: '❤️🌸❤️',                                                                                                                                         q: 'normal',    col: '#FF9A3C' },
  { u: 'Yến Nhi',    c: 'Bác và bác gái quen nhau như thế nào ạ?',                                                                                                      q: 'normal',    col: '#FFD700' },
  // ★ EXCELLENT #3 — ~1:45
  { u: 'Hải Đăng',   c: 'Thưa bác, em vừa trải qua chia tay rất đau lòng. Nghe bác kể về 40 năm yêu nhau, em nhận ra mình còn trẻ lắm và tình yêu thật sự cần xây dựng chứ không chỉ cảm xúc nhất thời. Bác đã giúp em đứng dậy!', q: 'excellent', col: '#E74C3C' },
  { u: 'Lan Anh',    c: 'Livestream hay nhất em từng xem! 🔥',                                                                                                          q: 'normal',    col: '#FF6B8B' },
  { u: 'Minh Châu',  c: '312 người đang xem cùng em — bác không đơn độc!',                                                                                             q: 'good',      col: '#FF9A3C' },
  { u: 'Văn Tùng',   c: '👏 Cảm ơn bác!',                                                                                                                                q: 'normal',    col: '#4facfe' },
  { u: 'Phương Linh',c: 'Em lưu Smart Note câu này để đọc lại khi buồn!',                                                                                              q: 'good',      col: '#a18cd1' },
  // ★ EXCELLENT #4 — ~2:30
  { u: 'Kim Ngân',   c: 'Mình thấy thế hệ mình đang thiếu đi sự kiên nhẫn trong tình yêu. Nghe bác nói, mình hiểu rằng yêu thật sự là một hành trình dài cần cả hai cùng xây dựng mỗi ngày.', q: 'excellent', col: '#f093fb' },
  { u: 'Đức Anh',    c: 'Bác kể tiếp đi bác ơi!',                                                                                                                      q: 'normal',    col: '#F1C40F' },
  { u: 'Hồng Nhung', c: 'Nước mắt em cứ rơi từ nãy đến giờ 😭💕',                                                                                                       q: 'normal',    col: '#FF6B8B' },
  { u: 'Ngọc Ánh',   c: 'Em bookmark lại toàn bộ buổi này!',                                                                                                           q: 'good',      col: '#FF9A3C' },
  { u: 'Tuấn Kiệt',  c: 'Bác gái có hay xem buổi chia sẻ này không ạ?',                                                                                                q: 'normal',    col: '#4facfe' },
  { u: 'Hải Đăng',   c: 'Câu chuyện này là thứ gen Z cần nghe nhất!',                                                                                                  q: 'good',      col: '#E74C3C' },
  { u: 'Yến Nhi',    c: 'Cảm ơn Silver Connect đã kết nối thế hệ ❤️',                                                                                                  q: 'good',      col: '#FFD700' },
  { u: 'Bảo Châu',   c: 'Bác Minh ơi, bác là tấm gương cho em!',                                                                                                       q: 'normal',    col: '#7B68EE' },
  // ★ EXCELLENT #5 — ~3:30
  { u: 'Quang Huy',  c: 'Thưa bác, em là sinh viên năm 3 đang rất mất phương hướng. Hôm nay nghe bác kể về cuộc đời, em thấy rõ rằng mỗi khó khăn đều có ý nghĩa và tương lai phía trước vẫn còn rất nhiều điều tươi đẹp. Cảm ơn bác rất nhiều!', q: 'excellent', col: '#43e97b' },
  { u: 'Phương Linh',c: 'Phải share bài này cho cả nhóm bạn thân!',                                                                                                    q: 'normal',    col: '#a18cd1' },
  { u: 'Lan Anh',    c: '🌸🌸 Trân trọng bác lắm ạ!',                                                                                                                   q: 'normal',    col: '#FF6B8B' },
  { u: 'Văn Tùng',   c: 'Gen Z chúng em may mắn có Silver Connect!',                                                                                                   q: 'good',      col: '#4facfe' },
  { u: 'Ngọc Bích',  c: '❤️👏🌸 Cảm ơn bác!',                                                                                                                            q: 'normal',    col: '#f093fb' },
];

const STUDENT_NOTES_INIT = [
  { id: 1, time: '07:02 PM', txt: '"Yêu không phải là tìm người hoàn hảo, mà là học cách yêu thương người không hoàn hảo."',           tags: ['Tình yêu', 'Bài học'],    pinned: true,  ts: Date.now() - 400000 },
  { id: 2, time: '07:03 PM', txt: '"40 năm vợ chồng — chưa bao giờ chúng tôi ngủ đi mà còn giận nhau."',                              tags: ['Hôn nhân', 'Bền vững'],   pinned: false, ts: Date.now() - 300000 },
  { id: 3, time: '07:05 PM', txt: '"Đừng chờ hạnh phúc hoàn hảo. Hãy xây dựng nó từng ngày, từng hành động nhỏ."',                    tags: ['Hạnh phúc', 'Kiên trì'],  pinned: false, ts: Date.now() - 200000 },
  { id: 4, time: '07:07 PM', txt: '"Hai người không cần giống nhau — cần tôn trọng sự khác biệt của nhau là đủ."',                     tags: ['Tôn trọng', 'Chia sẻ'],   pinned: false, ts: Date.now() - 100000 },
  { id: 5, time: '07:09 PM', txt: '"Gia đình là nơi bạn có thể thất bại mà không bị từ bỏ."',                                         tags: ['Gia đình', 'Tình yêu'],   pinned: false, ts: Date.now() -  50000 },
];

const STUDENT_CHAT_INIT = [
  { type: 'sys',  txt: 'Buổi chia sẻ "40 Năm Yêu Một Người" đã bắt đầu. Hãy đặt câu hỏi cho bác Minh!', time: '19:00' },
  { type: 'user', u: 'Ngọc Ánh',  txt: 'Chào bác ạ! Em rất háo hức được nghe bác chia sẻ ❤️',          time: '19:00', col: '#FF9A3C', q: 'normal' },
  { type: 'user', u: 'Tuấn Kiệt', txt: 'Bí quyết để hôn nhân 40 năm vẫn còn yêu là gì bác ơi ạ?',     time: '19:01', col: '#4facfe', q: 'normal' },
  { type: 'user', u: 'Khánh Linh',txt: 'Em cảm ơn bác đã chia sẻ những điều này ạ 🙏',                  time: '19:01', col: '#a18cd1', q: 'normal' },
];

const STUDENT_NOTEBOOK_INIT = [
  { id: 1, title: 'Bài học về tình yêu bền vững',   date: '10/04/2023', preview: 'Bác Minh: "40 năm không phải lúc nào cũng dễ — nhưng sự kiên nhẫn và tôn trọng là nền tảng..."',    tags: ['Tình yêu', 'Hôn nhân'] },
  { id: 2, title: 'Định nghĩa hạnh phúc thật sự',   date: '25/03/2023', preview: 'Bác Lan: "Hạnh phúc không phải thứ bạn tìm kiếm — mà là thứ bạn tạo ra mỗi ngày từ điều nhỏ bé."', tags: ['Hạnh phúc', 'Triết lý'] },
];

const NOTE_POOL = [
  { txt: '"Bất cứ mối quan hệ nào cũng có khó khăn — điều quan trọng là hai người có chọn ở lại cùng nhau không."', tags: ['Kiên định', 'Tình yêu'] },
  { txt: '"Đừng đo giá trị của mình bằng cảm xúc nhất thời — hãy nhìn vào những gì bạn đã vượt qua."',              tags: ['Giá trị bản thân', 'Vượt khó'] },
  { txt: '"Sự trân trọng nhỏ nhặt mỗi ngày tạo nên hạnh phúc lớn theo năm tháng."',                                 tags: ['Trân trọng', 'Hạnh phúc'] },
  { txt: '"Hãy sống hết mình với hiện tại — đó là cách duy nhất để không hối tiếc về quá khứ."',                     tags: ['Hiện tại', 'Sống trọn vẹn'] },
  { txt: '"Thất bại không phải dấu chấm hết — đó chỉ là dấu phẩy trong câu chuyện cuộc đời bạn."',                  tags: ['Thất bại', 'Hy vọng'] },
  { txt: '"Không có thành công nào không đi kèm hy sinh — hãy biết hy sinh cho đúng thứ."',                          tags: ['Hy sinh', 'Thành công'] },
];

/* ══════════════════════════════════════
   MAIN APP CONTROLLER
══════════════════════════════════════ */
const SC = (() => {

  /* ─── SHARED STATE ─── */
  let cameraStream = null;

  /* ─── ELDER STATE ─── */
  const E = {
    vc: 52, hearts: 312, commentCount: 48,
    sessTimer: null, vcTimer: null, cmtTimer: null, toastTimer: null,
    cmtIdx: 0, toastIdx: 0, sessionSec: 0,
  };

  /* ─── STUDENT STATE ─── */
  const S = {
    notes: JSON.parse(JSON.stringify(STUDENT_NOTES_INIT)),
    chat:  JSON.parse(JSON.stringify(STUDENT_CHAT_INIT)),
    nb:    JSON.parse(JSON.stringify(STUDENT_NOTEBOOK_INIT)),
    noteId: 5,
    rxn: { heart: 187, flower: 72, clap: 94 },
    liveTimer: null, vcTimer: null, cmtTimer: null,
    cmtIdx: 0,
    activePanel: 'notes',
    liveInited: false,
  };

  /* ══════════════════════════════════════
     UTILS
  ══════════════════════════════════════ */
  const gi  = id  => document.getElementById(id);
  const qs  = sel => document.querySelector(sel);
  const now = ()  => new Date().toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit' });
  const fmt = s   => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const show = id => gi(id)?.classList.remove('hidden');
  const hide = id => gi(id)?.classList.add('hidden');

  async function startCamera(vid, ph) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      const v = gi(vid);
      if (!v) return;
      v.srcObject = stream;
      v.style.display = 'block';
      cameraStream = stream;
      if (ph) { const p = gi(ph); if(p) p.style.display = 'none'; }
    } catch(e) { /* camera permission denied — silent */ }
  }

  function stopCamera() {
    document.querySelectorAll('video').forEach(v => {
      if (v.srcObject) v.srcObject.getTracks().forEach(t => t.stop());
    });
    cameraStream = null;
  }

  /* ══════════════════════════════════════
     TIKTOK TOAST (Elder)
     — frosted glass white, chữ đen, slide từ trên
  ══════════════════════════════════════ */
  const TT_ICON = {
    ai:   { cls:'ai',   fa:'fas fa-robot',             lbl:'Trợ lý AI'                    },
    q:    { cls:'q',    fa:'fas fa-question-circle',    lbl:'Câu hỏi từ sinh viên'         },
    star: { cls:'star', fa:'fas fa-star',               lbl:'Phản hồi từ khán giả'         },
    mic:  { cls:'mic',  fa:'fas fa-microphone',         lbl:'🎙️ Đang đọc bình luận xuất sắc' },
  };

  function showElderToast(html, type='ai', dur=5000) {
    const wrap = gi('elder-toast-wrap');
    if (!wrap) return;
    const t = TT_ICON[type] || TT_ICON.ai;
    const el = document.createElement('div');
    el.className = `tt-toast tt-fade${type==='mic'?' tt-voice':''}`;
    el.style.setProperty('--ttl', `${(dur-400)/1000}s`);
    el.innerHTML = `
      <div class="tt-icon-wrap ${t.cls}"><i class="${t.fa}"></i></div>
      <div>
        <div class="tt-label">${t.lbl}</div>
        <div class="tt-text">${html}</div>
      </div>`;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), dur+300);
  }

  function schedElderToasts() {
    if (E.toastIdx >= ELDER_TOASTS.length) return;
    const delay = 10000 + Math.random()*14000;
    E.toastTimer = setTimeout(() => {
      const t = ELDER_TOASTS[E.toastIdx++];
      showElderToast(t.msg, t.type, t.type==='q' ? 6500 : 5000);
      schedElderToasts();
    }, delay);
  }

  /* ══════════════════════════════════════
     ELDER COMMENT STREAM (TikTok overlay)
  ══════════════════════════════════════ */
  const MAX_CMT = 4;

  function addElderComment(cmt) {
    const stream = gi('elive-comment-stream');
    if (!stream) return;

    // Remove oldest if overflow
    const existing = stream.querySelectorAll('.elive-cmt');
    if (existing.length >= MAX_CMT) {
      existing[0].style.animation = 'cmtFadeOut .3s ease forwards';
      setTimeout(() => existing[0]?.remove(), 300);
    }

    const el = document.createElement('div');
    el.className = `elive-cmt${cmt.q==='excellent'?' excellent':''}`;
    el.innerHTML = `
      <div class="elive-cmt-inner">
        <span class="elive-name-badge" style="background:${cmt.col}">${cmt.u}</span>
        <span class="elive-cmt-text">${cmt.c}</span>
      </div>`;
    stream.appendChild(el);

    E.commentCount++;
    const cc = gi('elder-comments');
    if (cc) cc.textContent = E.commentCount;

    // Hearts bump
    if (Math.random() > 0.55) {
      E.hearts += Math.floor(Math.random()*4)+1;
      const hh = gi('elder-hearts');
      if (hh) hh.textContent = E.hearts;
    }

    setTimeout(() => {
      el.style.animation = 'cmtFadeOut .4s ease forwards';
      setTimeout(() => el?.remove(), 400);
    }, 7000);

    if (cmt.q === 'excellent') elderExcellent(cmt);
  }

  function elderExcellent(cmt) {
    // Toast + voice
    showElderToast(`<strong>${cmt.u}</strong>: "${cmt.c.substring(0,60)}${cmt.c.length>60?'...':''}"`, 'mic', 7500);
    Voice.speak(`Bình luận xuất sắc từ bạn ${cmt.u}: ${cmt.c}`);

    // Voice bar overlay on video
    const liveScreen = gi('elder-live');
    gi('elder-voice-bar')?.remove();
    const bar = document.createElement('div');
    bar.id = 'elder-voice-bar';
    bar.className = 'voice-bar';
    bar.innerHTML = `
      <div class="voice-wave">
        <span style="height:5px"></span><span style="height:11px"></span>
        <span style="height:16px"></span><span style="height:11px"></span>
        <span style="height:5px"></span>
      </div>
      <span>Đang đọc bình luận xuất sắc: <strong>${cmt.u}</strong></span>`;
    liveScreen?.appendChild(bar);
    setTimeout(() => bar?.remove(), 7500);
  }

  function schedElderComments() {
    if (E.cmtIdx >= ELDER_COMMENTS.length) return;
    const delay = 5000 + Math.random()*8000; // 5–13s
    E.cmtTimer = setTimeout(() => {
      addElderComment(ELDER_COMMENTS[E.cmtIdx++]);
      schedElderComments();
    }, delay);
  }

  /* ══════════════════════════════════════
     STUDENT TOAST STACK
  ══════════════════════════════════════ */
  const ST_ICON = {
    success: { cls:'succ',    fa:'fas fa-check-circle',  lbl:'Thành công'                      },
    info:    { cls:'info',    fa:'fas fa-bell',           lbl:'Thông báo'                       },
    mic:     { cls:'mic-ic',  fa:'fas fa-microphone',     lbl:'🎙️ Đang đọc bình luận xuất sắc' },
    star:    { cls:'star-ic', fa:'fas fa-star',           lbl:'Bình luận hay ✨'                },
  };

  function showStudentToast(html, type='info', dur=4200) {
    const t  = ST_ICON[type] || ST_ICON.info;
    const el = document.createElement('div');
    el.className = `s-toast${type==='mic'?' voice-toast':''}`;
    el.style.setProperty('--stl', `${(dur-380)/1000}s`);
    el.innerHTML = `
      <div class="s-toast-icon ${t.cls}"><i class="${t.fa}"></i></div>
      <div>
        <div class="s-toast-lbl">${t.lbl}</div>
        <div class="s-toast-msg">${html}</div>
      </div>`;
    const stack = gi('student-toast-stack');
    if (stack) stack.appendChild(el);
    setTimeout(() => el.remove(), dur+300);
  }

  /* ══════════════════════════════════════
     STUDENT COMMENT STREAM → CHAT + VOICE
  ══════════════════════════════════════ */
  function schedStudentComments() {
    if (S.cmtIdx >= STUDENT_COMMENTS.length) return;
    // Delay per comment: 4-11s → 30 comments ≈ 3-5 min
    const delay = 4000 + Math.random()*7000;
    S.cmtTimer = setTimeout(() => {
      const cmt = STUDENT_COMMENTS[S.cmtIdx++];
      addStudentComment(cmt);
      schedStudentComments();
    }, delay);
  }

  function addStudentComment(cmt) {
    S.chat.push({ type:'user', u:cmt.u, txt:cmt.c, time:now(), col:cmt.col, q:cmt.q });
    renderChat(false); // don't re-scroll on normal

    const cb = gi('chat-badge');
    if (cb) cb.textContent = parseInt(cb.textContent||0)+1;

    if (cmt.q === 'excellent') {
      studentExcellent(cmt);
    } else if (cmt.q === 'good') {
      showStudentToast(`<strong>${cmt.u}</strong>: "${cmt.c.substring(0,60)}${cmt.c.length>60?'...':''}"`, 'star');
    }
  }

  function studentExcellent(cmt) {
    // 1. Toast (frosted glass, chữ đen)
    showStudentToast(
      `<strong>${cmt.u}</strong>: "${cmt.c.substring(0,70)}${cmt.c.length>70?'...':''}"`,
      'mic', 7500
    );

    // 2. Voice read
    Voice.speak(`Bình luận xuất sắc từ bạn ${cmt.u}: ${cmt.c}`);

    // 3. Voice bar on video
    const svid = qs('.svid-wrap');
    gi('student-voice-bar')?.remove();
    const bar = document.createElement('div');
    bar.id = 'student-voice-bar';
    bar.className = 'voice-bar';
    bar.innerHTML = `
      <div class="voice-wave">
        <span style="height:5px"></span><span style="height:11px"></span>
        <span style="height:16px"></span><span style="height:11px"></span>
        <span style="height:5px"></span>
      </div>
      <span>Đang đọc: <strong>${cmt.u}</strong></span>`;
    svid?.appendChild(bar);
    setTimeout(() => bar?.remove(), 7500);

    // 4. Scroll chat to show the excellent message
    renderChat(true);
  }

  /* ══════════════════════════════════════
     ELDER FLOW
  ══════════════════════════════════════ */
  function startElder() {
    Voice.unlock(); // unlock on first user gesture
    hide('screen-landing');
    show('screen-elder');
    setTimeout(() => {
      hide('elder-loading');
      show('elder-welcome');
      setTimeout(() => showElderToast(
        'Cháu chào bác Minh! Còn <strong>8 phút</strong> nữa là gặp các bạn sinh viên rồi. Chúc bác buổi chia sẻ thật ý nghĩa!',
        'ai', 5500
      ), 700);
    }, 900);
  }

  function elderStep(step) {
    ['elder-welcome','elder-mirror','elder-live'].forEach(hide);
    if (step === 2) {
      show('elder-mirror');
      startCamera('elder-cam', 'elder-cam-ph');
      setTimeout(() => {
        const fb = gi('elder-feedback');
        if (!fb) return;
        if (Math.random() > 0.4) {
          fb.className = 'feedback-bar good';
          fb.innerHTML = '<i class="fas fa-check-circle"></i>&nbsp;Hình ảnh rất đẹp! Ánh sáng tốt, bác lên hình chuẩn rồi ạ 👍';
          showElderToast('Hình ảnh tốt lắm bác ơi! AI đã chỉnh sáng và làm mịn ảnh tự động rồi 😊', 'star');
        } else {
          fb.className = 'feedback-bar warn';
          fb.innerHTML = '<i class="fas fa-exclamation-triangle"></i>&nbsp;Hơi tối bác ơi — thử bật thêm đèn hoặc quay mặt ra cửa sổ nhé';
          showElderToast('Bác ơi, ánh sáng hơi yếu. Thử bật thêm đèn hoặc quay mặt ra phía cửa sổ nhé, sẽ đẹp hơn nhiều ạ!', 'ai');
        }
      }, 2200);
    } else if (step === 3) {
      stopCamera();
      show('elder-live');
      startCamera('elder-live-cam', 'elder-live-ph');
      // Start session
      E.sessTimer = setInterval(() => E.sessionSec++, 1000);
      E.vcTimer   = setInterval(() => {
        E.vc = Math.max(42, E.vc + (Math.random()>.5?1:-1));
        const el = gi('elder-vc'); if(el) el.textContent = E.vc;
      }, 7000);
      setTimeout(() => schedElderComments(), 4000);
      setTimeout(() => schedElderToasts(),   9000);
    }
  }

  function elderConfirmEnd() {
    if (qs('.confirm-overlay')) return;
    Voice.stop();
    const dur = fmt(E.sessionSec||765);
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-title">Kết thúc buổi chia sẻ?</div>
      <div class="stats-box">
        <div class="stat-row"><span class="sr-label">Người xem</span><span class="sr-val">${E.vc}</span></div>
        <div class="stat-row"><span class="sr-label">Thời gian</span><span class="sr-val">${dur}</span></div>
        <div class="stat-row"><span class="sr-label">❤️ Yêu thích</span><span class="sr-val">${E.hearts}</span></div>
        <div class="stat-row"><span class="sr-label">Bình luận</span><span class="sr-val">${E.commentCount}</span></div>
      </div>
      <div class="confirm-msg">Tuyệt vời! Bác đã truyền cảm hứng cho <strong style="color:#FFD700">${E.vc} bạn trẻ</strong> hôm nay!</div>
      <div class="confirm-btns">
        <button class="btn-continue" onclick="SC.elderContinue()">TIẾP TỤC</button>
        <button class="btn-end-confirm" onclick="SC.elderEnd()">NGHỈ NGƠI</button>
      </div>
      <div class="countdown-hint">Tự động kết thúc sau <span id="elder-cd">10</span>s</div>`;
    gi('elder-live').appendChild(overlay);
    let cd = 10;
    const iv = setInterval(() => {
      const el = gi('elder-cd'); if(el) el.textContent = --cd;
      if (cd <= 0) { clearInterval(iv); elderEnd(); }
    }, 1000);
    overlay._iv = iv;
  }

  function elderContinue() {
    const o = qs('.confirm-overlay');
    if (o) { clearInterval(o._iv); o.remove(); }
  }

  function elderEnd() {
    [E.sessTimer,E.vcTimer,E.cmtTimer,E.toastTimer].forEach(clearInterval);
    [E.cmtTimer,E.toastTimer].forEach(clearTimeout);
    stopCamera(); Voice.stop();
    const l = gi('elder-live'); if(!l) return;
    l.innerHTML = `
      <div class="confirm-overlay">
        <div class="confirm-title">🙏 Cảm ơn bác Minh!</div>
        <div class="stats-box">
          <div class="stat-row"><span class="sr-label">Người xem</span><span class="sr-val">${E.vc}</span></div>
          <div class="stat-row"><span class="sr-label">Thời gian</span><span class="sr-val">${fmt(E.sessionSec||765)}</span></div>
          <div class="stat-row"><span class="sr-label">❤️ Yêu thích</span><span class="sr-val">${E.hearts}</span></div>
          <div class="stat-row"><span class="sr-label">Smart Notes đã lưu</span><span class="sr-val">38</span></div>
        </div>
        <div class="confirm-msg">Câu chuyện của bác đã chạm đến trái tim <strong style="color:#FFD700">${E.vc} bạn trẻ</strong>!</div>
        <a href="index.html" class="btn-end-confirm" style="width:80%;text-decoration:none;text-align:center;padding:16px;display:block;margin-top:8px;border-radius:22px">
          <i class="fas fa-home"></i> VỀ TRANG CHỦ
        </a>
      </div>`;
  }

  /* ══════════════════════════════════════
     STUDENT FLOW
  ══════════════════════════════════════ */
  function startStudent() {
    Voice.unlock(); // unlock on first user gesture
    hide('screen-landing');
    show('screen-student');
    renderNotes(); renderChat(false); renderNotebook();
    show('notif-dot');
    setTimeout(() => showStudentToast('Chào mừng bạn đến với Silver Connect! ✨', 'success'), 400);
    gi('chat-input')?.addEventListener('keypress', e => { if(e.key==='Enter') sendMsg(); });
  }

  function onNotifClick() {
    hide('notif-dot');
    showStudentToast('Bác Minh đang live ngay bây giờ! Nhấn nút Live để tham gia 🔴', 'info');
  }

  function switchTab(tab, el) {
    ['home','live','profile'].forEach(t => {
      const v = gi('view-'+t);
      if (v) { v.classList.add('hidden'); v.style.display=''; }
      gi('nav-'+t)?.classList.remove('active');
    });
    const tv = gi('view-'+tab);
    if (tv) { tv.classList.remove('hidden'); tv.style.display='flex'; tv.style.flexDirection='column'; }
    if (el) el.classList.add('active');
    else gi('nav-'+tab)?.classList.add('active');
    if (tab==='live')    initLive();
    if (tab==='profile') renderNotebook();
  }

  function bookSession(btn, title) {
    if (btn.classList.contains('booked')) return;
    Voice.unlock();
    btn.classList.add('booked');
    btn.innerHTML = '<i class="fas fa-check"></i> ĐÃ BOOKING';
    showStudentToast(`Đã thêm "${title}" vào lịch! Nhắc bạn 15 phút trước 📅`, 'success');
    gi('nav-live').style.display = 'flex';
    if (title.includes('40 Năm')) {
      setTimeout(() => { switchTab('live'); gi('nav-live')?.classList.add('active'); }, 1400);
    }
  }

  function initLive() {
    if (S.liveInited) return;
    S.liveInited = true;
    Voice.unlock();
    renderNotes(); renderChat(true);
    startCamera('student-vid','student-vid-ph');
    // Timer
    let sec=0;
    S.liveTimer = setInterval(() => {
      const el = gi('student-dur'); if(el) el.textContent = fmt(++sec);
    }, 1000);
    // VC fluctuation
    let vc=63;
    S.vcTimer = setInterval(() => {
      vc = Math.max(50, vc+(Math.random()>.5?1:-1));
      const el = gi('student-vc'); if(el) el.textContent=vc;
    }, 6000);
    // Comments — first excellent fires after ~15s
    setTimeout(() => schedStudentComments(), 3000);
    showStudentToast('Đã kết nối với buổi live của bác Minh! 🎉', 'success');
  }

  function react(type) {
    Voice.unlock();
    S.rxn[type]++;
    const el = gi('rxn-counts');
    if (el) el.textContent = `${S.rxn.heart} ❤️ · ${S.rxn.clap} 👏 · ${S.rxn.flower} 🌸`;
    const e = {'heart':'❤️','flower':'🌸','clap':'👏'};
    showStudentToast(`Đã gửi ${e[type]} đến bác Minh!`, 'success');
  }

  function saveNote() {
    Voice.unlock();
    S.noteId++;
    const c = NOTE_POOL[Math.floor(Math.random()*NOTE_POOL.length)];
    S.notes.unshift({ id:S.noteId, time:now(), txt:c.txt, tags:c.tags, pinned:false, ts:Date.now() });
    S.nb.unshift({ id:S.nb.length+1, title:`Smart Note #${S.noteId}`, date:new Date().toLocaleDateString('vi'), preview:c.txt.substring(0,85)+'...', tags:c.tags });
    renderNotes(); renderNotebook();
    showStudentToast('⚡ Đã lưu Clip 30 giây + Transcript tự động!', 'success');
  }

  function sendMsg() {
    Voice.unlock();
    const inp = gi('chat-input');
    const v = inp?.value.trim(); if (!v) return;
    S.chat.push({ type:'user', u:'Tôi', txt:v, time:now(), col:'#7B68EE', q:'normal' });
    inp.value='';
    renderChat(true);
    showStudentToast('AI đã chuyển câu hỏi tới tai nghe bác Minh! 🎧', 'info');
    setTimeout(() => {
      const rs=['Câu hỏi hay quá! Để bác chia sẻ về điều đó nhé...','Cảm ơn bạn! Bác sẽ trả lời ngay.','Đây là điều bác cũng từng trải qua...'];
      S.chat.push({ type:'user', u:'Bác Minh', txt:rs[Math.floor(Math.random()*rs.length)], time:now(), col:'#FF9A3C', q:'normal' });
      renderChat(true);
    }, 2500);
  }

  function switchPanel(panel) {
    S.activePanel = panel;
    const np = gi('panel-notes');
    const cp = gi('panel-chat');
    if (np) { np.style.display = panel==='notes'?'block':'none'; np.className=`panel-body${panel==='notes'?' notes-active':''}`; }
    if (cp) { cp.style.display = panel==='chat'?'flex':'none'; cp.style.flexDirection='column'; cp.className=`panel-body${panel==='chat'?' chat-active':''}`; }
    gi('ptab-notes')?.classList.toggle('active', panel==='notes');
    gi('ptab-chat')?.classList.toggle('active', panel==='chat');
    if (panel==='chat') { const cs=gi('chat-scroll'); if(cs) setTimeout(()=>cs.scrollTop=cs.scrollHeight,80); }
  }

  /* ─── RENDER NOTES ─── */
  function renderNotes() {
    const el = gi('panel-notes'); if(!el) return;
    if (S.notes.length===0) {
      el.innerHTML='<div class="empty-panel"><i class="fas fa-bolt"></i><p>Chưa có Smart Notes. Nhấn ⚡ để lưu!</p></div>';
    } else {
      const sorted = [...S.notes].sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||b.ts-a.ts);
      el.innerHTML = sorted.map(n=>`
        <div class="note-card${n.pinned?' pinned':''}">
          <div class="note-time"><i class="fas fa-video"></i> ${n.time}${n.pinned?' 📌':''}</div>
          <div class="note-txt">${n.txt}</div>
          <div class="note-tags">${n.tags.map(t=>`<span class="ntag">${t}</span>`).join('')}</div>
        </div>`).join('');
    }
    const nb=gi('notes-badge'), pnc=gi('prof-notes-count');
    if(nb) nb.textContent=S.notes.length;
    if(pnc) pnc.textContent=S.notes.length;
    el.className=`panel-body${S.activePanel==='notes'?' notes-active':''}`;
    el.style.display=S.activePanel==='notes'?'block':'none';
  }

  /* ─── RENDER CHAT ─── */
  function renderChat(scrollToBottom=false) {
    const el=gi('chat-msgs'); if(!el) return;
    el.innerHTML = S.chat.map(m=>{
      if(m.type==='sys') return `<div class="sys-msg"><div class="sys-bubble">${m.txt}</div></div>`;
      const own = m.u==='Tôi';
      const exc = m.q==='excellent' ? ' excellent' : '';
      return `<div class="user-msg">
        <div class="msg-hdr">
          <div class="msg-av" style="background:${m.col||'#7B68EE'}">${m.u.charAt(0)}</div>
          <div class="msg-uname">${m.u}</div>
          <div class="msg-time">${m.time}</div>
        </div>
        <div class="msg-bubble${own?' own':''}${exc}">${m.txt}</div>
      </div>`;
    }).join('');
    const cb=gi('chat-badge');
    if(cb) cb.textContent=S.chat.filter(m=>m.type==='user').length;
    if(scrollToBottom) {
      const cs=gi('chat-scroll'); if(cs) setTimeout(()=>cs.scrollTop=cs.scrollHeight,60);
    }
  }

  /* ─── RENDER NOTEBOOK ─── */
  function renderNotebook() {
    const el=gi('notebook-list'); if(!el) return;
    if(S.nb.length===0){ el.innerHTML='<div class="empty-panel"><i class="fas fa-book"></i><p>Sổ tay trống. Smart Notes sẽ tự lưu vào đây.</p></div>'; return; }
    el.innerHTML=S.nb.map(n=>`
      <div class="nb-card">
        <div class="nb-hdr"><div class="nb-title">${n.title}</div><div class="nb-date">${n.date}</div></div>
        <div class="nb-preview">${n.preview}</div>
        <div class="nb-tags">${n.tags.map(t=>`<span class="nb-tag">${t}</span>`).join('')}</div>
      </div>`).join('');
  }

  /* ── PUBLIC ── */
  return {
    startElder, elderStep, elderConfirmEnd, elderContinue, elderEnd,
    startStudent, onNotifClick, switchTab, bookSession,
    react, saveNote, sendMsg, switchPanel, initLive,
  };
})();

/* ══════════════════════════════════════
   BOOT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Pre-load voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
  // Show home view
  const vh = document.getElementById('view-home');
  if (vh) { vh.style.display='flex'; vh.style.flexDirection='column'; }
});