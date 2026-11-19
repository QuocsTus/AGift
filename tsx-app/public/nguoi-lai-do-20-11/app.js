/**
 * ============================================================================
 * TRÌNH ĐIỀU KHIỂN TƯƠNG TÁC TOÀN DIỆN (CINEMATIC & 3D INTERACTIVE ENGINE)
 * Tri Ân Ngày Nhà Giáo Việt Nam 20/11 — Người Thầy, Dấu Ấn Không Phai
 * ============================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. HEADER NAVIGATION & SCROLL SPY
  // Dùng requestAnimationFrame để throttle scroll spy — tránh jank
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = [
    { id: "hero", nav: "hero" },
    { id: "teacherStory", nav: "teacherStory" },
    { id: "memoryJourney", nav: "memoryJourney" },
    { id: "beliefAndValues", nav: "beliefAndValues" },
    { id: "tributeSection", nav: "tributeSection" },
    { id: "scene3dSection", nav: "scene3dSection" },
  ];

  const header = document.getElementById("siteHeader");
  const headerHeight = header ? header.offsetHeight : 58;

  // Cache element references — tránh DOM query mỗi frame
  const sectionEls = sections.map((s) => ({
    ...s,
    el: document.getElementById(s.id),
  }));

  // Cuộn mượt với offset header
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const topPos =
          targetEl.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight +
          2;
        window.scrollTo({
          top: topPos,
          behavior: "smooth",
        });
      }
    });
  });

  // Nút CTA bắt đầu hành trình
  const startJourneyBtn = document.getElementById("startJourneyBtn");
  if (startJourneyBtn) {
    startJourneyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetEl = document.getElementById("teacherStory");
      if (targetEl) {
        const topPos =
          targetEl.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight +
          2;
        window.scrollTo({ top: topPos, behavior: "smooth" });
      }
    });
  }

  // Scroll Spy — throttle bằng RAF để không chạy mỗi pixel scroll
  let scrollSpyRafId = null;
  let lastActiveNav = "";

  function updateActiveNav() {
    scrollSpyRafId = null;
    const scrollPos = window.pageYOffset + headerHeight + 80;

    let activeNav = sectionEls[0].nav;
    for (let i = sectionEls.length - 1; i >= 0; i--) {
      const s = sectionEls[i];
      if (s.el && scrollPos >= s.el.offsetTop) {
        activeNav = s.nav;
        break;
      }
    }

    // Chỉ cập nhật DOM khi active nav thực sự thay đổi
    if (activeNav === lastActiveNav) return;
    lastActiveNav = activeNav;

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("data-nav") === activeNav;
      link.classList.toggle("active", isMatch);
      const underline = link.querySelector(".nav-glow-underline");
      if (underline) underline.style.display = isMatch ? "block" : "none";
    });
  }

  function onScroll() {
    if (!scrollSpyRafId) {
      scrollSpyRafId = requestAnimationFrame(updateActiveNav);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateActiveNav();

  // --------------------------------------------------------------------------
  // 2. ÂM NHẠC TRI ÂN DU DƯƠNG (WEB AUDIO API SYNTHESIZER)
  // Không phụ thuộc file ngoài, không lo 404, giai điệu piano/harp ấm áp
  // --------------------------------------------------------------------------
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicLoopTimeout = null;

  // Giai điệu tri ân: Tiến trình hợp âm Cmaj7 -> Am9 -> Fmaj7 -> Gsus4
  const chords = [
    [261.63, 329.63, 392.0, 493.88], // C - E - G - B
    [220.0, 261.63, 329.63, 392.0], // A - C - E - G
    [174.61, 220.0, 261.63, 329.63], // F - A - C - E
    [196.0, 246.94, 293.66, 392.0], // G - B - D - G
  ];

  let currentChord = 0;
  let stepIndex = 0;

  function initAudioEngine() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playPianoNote(freq, duration = 1.8, gainVol = 0.055) {
    if (!audioCtx || !isMusicPlaying) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        gainVol,
        audioCtx.currentTime + 0.04,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + duration,
      );

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }

  function stepMusicMelody() {
    if (!isMusicPlaying) return;

    const chord = chords[currentChord];
    const octave = stepIndex % 2 === 0 ? 1 : 2;
    const noteFreq = chord[stepIndex % chord.length] * octave;

    playPianoNote(noteFreq, 2.2, 0.045);

    stepIndex++;
    if (stepIndex >= chord.length * 2) {
      stepIndex = 0;
      currentChord = (currentChord + 1) % chords.length;
    }

    musicLoopTimeout = setTimeout(stepMusicMelody, 380);
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", () => {
      initAudioEngine();
      isMusicPlaying = !isMusicPlaying;

      if (isMusicPlaying) {
        musicToggleBtn.classList.add("playing");
        showToast("🎵 Đang phát giai điệu tri ân du dương");
        stepMusicMelody();
      } else {
        musicToggleBtn.classList.remove("playing");
        clearTimeout(musicLoopTimeout);
        showToast("Đã tạm dừng âm nhạc");
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. CANVAS AMBIENT PARTICLES & FALLING PETALS NỀN
  // Tối ưu: giảm số lượng hạt, dùng offscreen batch, throttle 30fps cho ambient
  // --------------------------------------------------------------------------
  const ambientCanvas = document.getElementById("ambientCanvas");
  if (ambientCanvas) {
    const ctxA = ambientCanvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    let widthA = 0,
      heightA = 0;
    let animAmbientId = null;

    function resizeAmbientCanvas() {
      widthA = window.innerWidth;
      heightA = window.innerHeight;
      ambientCanvas.width = widthA;
      ambientCanvas.height = heightA;
    }
    window.addEventListener("resize", resizeAmbientCanvas, { passive: true });
    resizeAmbientCanvas();

    // Giảm xuống 28 hạt (từ 42) — đủ hiệu ứng, nhẹ hơn 30%
    const particleCount = 28;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * widthA,
        y: Math.random() * heightA,
        r: Math.random() * 1.6 + 0.6,
        vy: -(Math.random() * 0.3 + 0.12),
        vx: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.45 + 0.2,
        pulseSpeed: Math.random() * 0.018 + 0.008,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Giảm xuống 8 cánh hoa (từ 14)
    const petalCount = 8;
    const petals = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * widthA,
        y: Math.random() * heightA - heightA,
        size: Math.random() * 6 + 5,
        vy: Math.random() * 0.5 + 0.3,
        vx: Math.random() * 0.4 - 0.08,
        rotation: Math.random() * 360,
        spinSpeed: (Math.random() - 0.5) * 1.2,
        colorTone:
          Math.random() < 0.6 ? "rgba(255, 240, 225, " : "rgba(255, 215, 220, ",
        alpha: Math.random() * 0.35 + 0.28,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.018 + 0.012,
      });
    }

    // Throttle ambient về ~30fps (mỗi 2 frame thực) — scroll vẫn 60fps
    let ambientFrameSkip = 0;

    function renderAmbient() {
      animAmbientId = requestAnimationFrame(renderAmbient);

      // Chỉ vẽ mỗi 2 frame thực — ambient 30fps, scroll 60fps không bị ảnh hưởng
      ambientFrameSkip++;
      if (ambientFrameSkip % 2 !== 0) return;

      ctxA.clearRect(0, 0, widthA, heightA);

      // Bụi sáng vàng
      ctxA.fillStyle = "rgba(244, 199, 119, 1)";
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx;
        p.phase += p.pulseSpeed;

        if (p.y < -10) p.y = heightA + 10;
        if (p.x < -10) p.x = widthA + 10;
        if (p.x > widthA + 10) p.x = -10;

        const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));
        ctxA.globalAlpha = pulseAlpha;
        ctxA.beginPath();
        ctxA.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctxA.fill();
      }

      // Cánh hoa bay
      ctxA.globalAlpha = 1;
      for (let i = 0; i < petalCount; i++) {
        const pt = petals[i];
        pt.swing += pt.swingSpeed;
        pt.y += pt.vy;
        pt.x += pt.vx + Math.sin(pt.swing) * 0.4;
        pt.rotation += pt.spinSpeed;

        if (pt.y > heightA + 20) {
          pt.y = -20;
          pt.x = Math.random() * widthA;
        }

        ctxA.save();
        ctxA.translate(pt.x, pt.y);
        ctxA.rotate((pt.rotation * Math.PI) / 180);
        ctxA.fillStyle = pt.colorTone + pt.alpha + ")";
        ctxA.beginPath();
        ctxA.moveTo(0, -pt.size);
        ctxA.bezierCurveTo(
          pt.size * 0.6,
          -pt.size * 0.5,
          pt.size * 0.6,
          pt.size * 0.5,
          0,
          pt.size,
        );
        ctxA.bezierCurveTo(
          -pt.size * 0.6,
          pt.size * 0.5,
          -pt.size * 0.6,
          -pt.size * 0.5,
          0,
          -pt.size,
        );
        ctxA.fill();
        ctxA.restore();
      }
      ctxA.globalAlpha = 1;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mediaQuery.matches) {
      animAmbientId = requestAnimationFrame(renderAmbient);
    }

    // Tạm dừng ambient khi tab ẩn — tiết kiệm GPU cho 3D scene
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (animAmbientId) {
          cancelAnimationFrame(animAmbientId);
          animAmbientId = null;
        }
      } else {
        if (!animAmbientId)
          animAmbientId = requestAnimationFrame(renderAmbient);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. VIDEO TRI ÂN & HIỆU ỨNG GIẢI MÃ CHỮ BAY (SECTION 05 - CHUẨN 20/10)
  // Kế thừa trọn vẹn thuật toán 20/10: bay hỗn loạn + chữ gây nhiễu ma trận +
  // từng chữ bay hút về slot + bùng nổ tia sáng sparkle + mưa tim + mở thư
  // --------------------------------------------------------------------------
  const tributeFrame = document.getElementById("tributeFrame");
  const tributeVideo = document.getElementById("tributeVideo");
  const decodeStage = document.getElementById("decodeStage");
  const decodeLinesBox = document.getElementById("decodeLinesBox");
  const decLine1 = document.getElementById("decLine1");
  const decLine2 = document.getElementById("decLine2");
  const decLine3 = document.getElementById("decLine3");
  const decLine4 = document.getElementById("decLine4");
  const decodeHint = document.getElementById("decodeHint");
  const decodePromptBtn = document.getElementById("decodePromptBtn");
  const decodeReplayBar = document.getElementById("decodeReplayBar");
  const btnDecodeReplay = document.getElementById("btnDecodeReplay");
  const btnDecodeLetter = document.getElementById("btnDecodeLetter");

  const letterModal = document.getElementById("letterModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const closeLetterBtn = document.getElementById("closeLetterBtn");
  const returnSkyBtn = document.getElementById("returnSkyBtn");
  const copyWishBtn = document.getElementById("copyWishBtn");

  // Popup Lá Thư Tri Ân
  function openLetter() {
    if (letterModal) {
      letterModal.hidden = false;
      document.body.style.overflow = "hidden";
      if (closeLetterBtn) closeLetterBtn.focus();
    }
  }

  function closeLetter() {
    if (letterModal) {
      letterModal.hidden = true;
      document.body.style.overflow = "";
      if (decodeReplayBar) {
        decodeReplayBar.hidden = false;
      }
    }
  }

  if (closeLetterBtn) closeLetterBtn.addEventListener("click", closeLetter);
  if (returnSkyBtn) returnSkyBtn.addEventListener("click", closeLetter);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeLetter);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && letterModal && !letterModal.hidden) {
      closeLetter();
    }
  });

  if (copyWishBtn) {
    copyWishBtn.addEventListener("click", async () => {
      const salutation = "Cô Bình kính yêu!";
      const prose = [
        "Có lẽ, con sẽ chẳng bao giờ tìm được đủ lời để nói hết lòng biết ơn dành cho cô. Con cảm ơn cô vì đã đến bên con, yêu thương con bằng sự dịu dàng, tin tưởng con ngay cả những lúc con chưa đủ tự tin vào chính mình, và luôn âm thầm nâng đỡ con trên mỗi chặng đường.",
        "Con biết mình vẫn còn nhiều điều phải cố gắng, còn những ước mơ chưa thành và cả những chặng đường chưa đi tới. Nhưng con mong cô sẽ luôn biết rằng, trong mỗi bước trưởng thành của con, luôn có một phần yêu thương và niềm tin mà cô đã vun đắp.",
        "Sau này, dù con có lớn lên, đi xa và gặp gỡ thêm nhiều người, con vẫn sẽ luôn tự hào khi nhắc về cô – người hiệu trưởng, người mẹ thứ hai – một chỗ dựa thân thương, một vòng tay tinh thần và một niềm tin ấm áp mà con đã may mắn có được.",
        "Nhân ngày Nhà giáo Việt Nam 20/11, con kính chúc cô luôn mạnh khỏe, bình an, hạnh phúc và mãi giữ trong tim ngọn lửa nhiệt huyết với nghề. Con mong rằng mỗi ngày đến trường của cô đều ngập tràn niềm vui, mỗi nỗ lực đều được đền đáp bằng những yêu thương và trên hành trình gieo mầm tri thức, cô sẽ luôn nhận lại thật nhiều điều tốt đẹp. Con chúc cô không chỉ có một ngày 20/11 thật ý nghĩa, mà còn có thật nhiều tháng năm rực rỡ với những thế hệ học trò luôn yêu quý và biết ơn cô.",
        "Đây không phải một món quà hoàn hảo nhưng là một dấu ấn chân thành. Không chỉ dành cho ngày 20/11, mà còn để nhắc con nhớ rằng mình đã may mắn biết bao khi được làm học trò của cô.",
        "Chúc mừng ngày Nhà giáo Việt Nam 20/11! Con luôn biết ơn cô, hôm nay và cả những năm tháng sau này. ❤️",
      ].join("\n\n");

      const sigElement = document.querySelector(".sig-name");
      const signature = sigElement
        ? sigElement.textContent.replace("✎", "").trim()
        : "Con trai Phan Thế Nam kính dâng";
      const fullMessage = `${salutation}\n\n${prose}\n\n— ${signature}`;

      try {
        await navigator.clipboard.writeText(fullMessage);
        showToast("✓ Đã sao chép lời chúc vào bộ nhớ tạm thành công!");
      } catch (_) {
        showToast("✓ Đã chuẩn bị sẵn lời chúc ý nghĩa!");
      }
    });
  }

  // Cấu hình nội dung các dòng chữ (chuẩn thuật toán 20/10)
  const POOL = "ABCDEFGHIKLMNOPQRSTUVXYĂÂÊÔƠƯ0123456789";
  const rnd = (a) =>
    Array.isArray(a) || typeof a === "string"
      ? a[Math.floor(Math.random() * a.length)]
      : 0;
  const R = (a, b) => Math.random() * (b - a) + a;

  const lineConfigs = [
    { el: decLine1, text: "Con trai Phan Thế Nam", cls: "fly-script" },
    { el: decLine2, text: "chúc mừng cô Lê Thị Bình", cls: "" },
    { el: decLine3, text: "nhân ngày Nhà giáo Việt Nam 20/11", cls: "" },
  ];

  let flyers = [];
  let decoding = false;
  let landed = 0;
  let total = 0;
  let decodeAnimId = null;
  let scrambleTimer = null;
  let decodeTimeouts = [];

  function clearDecodeTimeouts() {
    decodeTimeouts.forEach(clearTimeout);
    decodeTimeouts = [];
  }

  function addDecodeTimeout(fn, ms) {
    const id = setTimeout(() => {
      decodeTimeouts = decodeTimeouts.filter((t) => t !== id);
      fn();
    }, ms);
    decodeTimeouts.push(id);
    return id;
  }

  function buildSlots() {
    flyers = [];
    landed = 0;

    lineConfigs.forEach(({ el, text, cls }) => {
      if (!el) return;
      el.innerHTML = "";
      [...text].forEach((c) => {
        const s = document.createElement("span");
        s.className = "slot" + (c === " " ? " sp" : "");
        s.textContent = c === " " ? "\u00a0" : c;
        el.appendChild(s);
        if (c !== " ") flyers.push({ slot: s, c, cls, real: true });
      });
    });

    // 3 Trái tim
    if (decLine4) {
      decLine4.innerHTML = "";
      for (let i = 0; i < 3; i++) {
        const s = document.createElement("span");
        s.className = "slot heart-slot";
        s.innerHTML = '<span class="h-ico">❤️</span>';
        decLine4.appendChild(s);
        flyers.push({
          slot: s,
          c: "❤️",
          isHeart: true,
          cls: "fly-heart",
          real: true,
        });
      }
    }

    total = flyers.length;
  }

  function mkFlyer(f, size) {
    if (!decodeStage) return;
    const e = document.createElement("div");
    e.className = "fly " + (f.cls || "");
    e.style.fontSize = size + "px";
    e.style.opacity = f.real ? 1 : 0.65;
    e.style.color = rnd([
      "#FFE2A4",
      "#F4C777",
      "#FFD700",
      "#FFF5E6",
      "#FFB75B",
      "#ff9da7",
    ]);
    e.textContent = f.isHeart ? "❤️" : rnd(POOL);
    decodeStage.appendChild(e);

    const W = decodeStage.clientWidth || 880;
    const H = decodeStage.clientHeight || 500;

    Object.assign(f, {
      el: e,
      x: R(25, W - 25),
      y: R(25, H - 25),
      vx: R(-2.2, 2.2),
      vy: R(-2.2, 2.2),
      rot: R(0, 360),
      vr: R(-3, 3),
      t: R(0, 6),
      sc: 1,
      state: "fly",
    });
  }

  function spawnAllFlyers() {
    if (!decodeStage) return;

    // Chữ thật
    flyers.forEach((f) => {
      let size = 26;
      if (f.slot) {
        const fs = parseFloat(getComputedStyle(f.slot).fontSize);
        if (fs) size = fs;
      }
      mkFlyer(f, size);
    });

    // 36 chữ gây nhiễu bay lung tung (đúng chuẩn 20/10)
    for (let i = 0; i < 36; i++) {
      const f = { real: false, c: "", cls: "" };
      flyers.push(f);
      mkFlyer(f, R(16, 40));
    }

    // Scramble chữ gây nhiễu liên tục mỗi 140ms
    if (scrambleTimer) clearInterval(scrambleTimer);
    scrambleTimer = setInterval(() => {
      flyers.forEach((f) => {
        if (f.el && f.state === "fly" && !f.isHeart && Math.random() < 0.4) {
          f.el.textContent = rnd(POOL);
        }
      });
    }, 140);

    if (decodeAnimId) cancelAnimationFrame(decodeAnimId);
    decodeAnimId = requestAnimationFrame(tickFlyers);
  }

  function initDecodeEffect() {
    if (!decodeStage) return;

    clearDecodeTimeouts();
    if (decodeAnimId) cancelAnimationFrame(decodeAnimId);
    if (scrambleTimer) clearInterval(scrambleTimer);
    scrambleTimer = null;
    decodeAnimId = null;

    // Xóa flyers cũ khỏi DOM
    const oldFlies = decodeStage.querySelectorAll(
      ".fly, .burst, .decode-heart",
    );
    oldFlies.forEach((el) => el.remove());
    startHeartLoop();

    if (decodeStage) {
      decodeStage.classList.remove("active");
    }

    buildSlots();

    decoding = false;
    landed = 0;

    if (decodeHint) {
      decodeHint.textContent =
        "✦ Bấm vào video bất kỳ đâu để giải mã thông điệp ✦";
    }
    if (decodePromptBtn) {
      decodePromptBtn.style.display = "inline-flex";
    }
  }

  function tickFlyers() {
    decodeAnimId = requestAnimationFrame(tickFlyers);
    if (!decodeStage) return;

    const W = decodeStage.clientWidth || 880;
    const H = decodeStage.clientHeight || 500;

    flyers.forEach((f) => {
      if (f.state === "done" || !f.el) return;

      if (f.state === "fly") {
        f.vx += R(-0.12, 0.12);
        f.vy += R(-0.12, 0.12);
        const m = Math.hypot(f.vx, f.vy),
          mx = 2.6;
        if (m > mx) {
          f.vx *= mx / m;
          f.vy *= mx / m;
        }
        f.x += f.vx;
        f.y += f.vy;
        f.rot += f.vr;
        f.t += 0.035;
        f.sc = 1 + Math.sin(f.t) * 0.28;

        if (f.x < 12 || f.x > W - 12) f.vx *= -1;
        if (f.y < 12 || f.y > H - 12) f.vy *= -1;
        f.x = Math.max(0, Math.min(W, f.x));
        f.y = Math.max(0, Math.min(H, f.y));
      } else if (f.state === "go") {
        // Hút về slot với tốc độ bay giảm đi (k = 0.038) để thời gian ghép lâu hơn, êm ái hơn
        const k = 0.038;
        f.x += (f.tx - f.x) * k;
        f.y += (f.ty - f.y) * k;
        f.rot += (0 - f.rot) * (k * 1.4);
        f.sc += (1 - f.sc) * (k * 1.4);

        if (Math.hypot(f.tx - f.x, f.ty - f.y) < 1.2 && Math.abs(f.rot) < 1.0) {
          landFlyer(f);
        }
      }

      f.el.style.transform = `translate(${f.x}px,${f.y}px) translate(-50%,-50%) rotate(${f.rot}deg) scale(${f.sc})`;
    });
  }

  function landFlyer(f) {
    f.state = "done";
    if (f.el) f.el.remove();
    if (f.slot) {
      f.slot.classList.add("ok");
      sparkleSlot(f.slot);
    }

    if (++landed === total) {
      if (decodeHint) decodeHint.textContent = "";
      heartStorm();
      showToast("❤️ Thông điệp đã trọn vẹn — Đang mở bức thư tri ân...");
      if (decodeReplayBar) decodeReplayBar.hidden = false;
      addDecodeTimeout(() => {
        openLetter();
        decoding = false;
      }, 2000);
    }
  }

  function sparkleSlot(el) {
    if (!decodeStage) return;
    const stageRect = decodeStage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const cx = r.left - stageRect.left + r.width / 2;
    const cy = r.top - stageRect.top + r.height / 2;
    for (let i = 0; i < 4; i++) {
      burstSpark(cx, cy, "✦", 12);
    }
  }

  function burstSpark(x, y, ch, size) {
    if (!decodeStage) return;
    const b = document.createElement("div");
    b.className = "burst";
    b.textContent = ch;
    b.style.cssText = `left:${x}px;top:${y}px;font-size:${size + R(0, 8)}px;color:#FFE2A4;text-shadow:0 0 10px #F4C777;--bx:${R(-55, 55)}px;--by:${R(-55, 55)}px`;
    decodeStage.appendChild(b);
    setTimeout(() => b.remove(), 900);
  }

  const HEARTS_POOL = ["❤️", "💖", "✨", "✦", "💛", "🌸", "🌹"];
  let heartLoopTimer = null;
  function spawnHeart() {
    if (!decodeStage) return;
    const h = document.createElement("div");
    h.className = "decode-heart";
    h.textContent = rnd(HEARTS_POOL);
    const d = R(3.5, 6.5);
    h.style.cssText = `left:${R(5, 95)}%;font-size:${R(18, 36)}px;animation-duration:${d}s;--dx:${R(-60, 60)}px;--rot:${R(-35, 35)}deg;opacity:${R(0.7, 1)}`;
    decodeStage.appendChild(h);
    setTimeout(() => h.remove(), d * 1000);
  }

  function startHeartLoop() {
    if (!decodeStage || heartLoopTimer) return;

    const emitHeart = () => {
      const activeHearts = decodeStage.querySelectorAll(".decode-heart").length;
      if (activeHearts < 14) spawnHeart();
    };

    emitHeart();
    heartLoopTimer = window.setInterval(emitHeart, 720);
  }

  function heartStorm() {
    for (let i = 0; i < 30; i++) setTimeout(spawnHeart, i * 70);
  }

  function startDecodeSequence() {
    if (decoding) return;
    decoding = true;

    // Dừng video loop
    if (tributeVideo) {
      try {
        tributeVideo.pause();
      } catch (_) {}
    }
    if (tributeFrame) {
      tributeFrame.classList.add("is-paused");
    }

    if (decodeStage) {
      decodeStage.classList.add("active");
    }

    const clickPrompt = document.getElementById("videoClickPrompt");
    if (clickPrompt) {
      clickPrompt.style.display = "none";
    }

    if (decodePromptBtn) {
      decodePromptBtn.style.display = "none";
    }
    if (decodeHint) {
      decodeHint.textContent = "✦ Thông điệp đang bay lượn tự do... ✦";
    }

    // Các chữ bắt đầu bay lúc bấm vào màn hình
    spawnAllFlyers();

    // Chờ 3s bắt đầu ghép chữ
    addDecodeTimeout(() => {
      if (decodeHint) {
        decodeHint.textContent = "Các chữ cái đang tìm về nhau... ✨";
      }

      if (scrambleTimer) {
        clearInterval(scrambleTimer);
        scrambleTimer = null;
      }

      const stageRect = decodeStage.getBoundingClientRect();
      let i = 0;

      // Các chữ nhiễu mờ dần và biến mất
      flyers
        .filter((f) => !f.real)
        .forEach((f) => {
          addDecodeTimeout(
            () => {
              if (f.el) f.el.style.opacity = 0;
            },
            R(200, 1500),
          );
          addDecodeTimeout(() => {
            f.state = "done";
            if (f.el) f.el.remove();
          }, 2400);
        });

      // Các chữ thật bắt đầu bay về slot với độ trễ giãn cách 65ms (giúp thời gian ghép lâu hơn)
      const realFlyers = flyers.filter((f) => f.real);
      realFlyers.forEach((f) => {
        addDecodeTimeout(() => {
          if (!f.el || !f.slot) return;
          const r = f.slot.getBoundingClientRect();
          f.tx = r.left - stageRect.left + r.width / 2;
          f.ty = r.top - stageRect.top + r.height / 2;
          f.rot = (((f.rot % 360) + 540) % 360) - 180;
          f.state = "go";
          f.el.textContent = f.c;
        }, i++ * 65);
      });
    }, 3000);
  }

  // Tương tác bấm vào video hoặc nút giải mã
  if (tributeFrame) {
    tributeFrame.addEventListener("click", (e) => {
      if (
        e.target.closest("#btnDecodeReplay") ||
        e.target.closest("#btnDecodeLetter")
      ) {
        return;
      }
      if (!decoding && landed < total) {
        startDecodeSequence();
      }
    });

    tributeFrame.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !decoding && landed < total) {
        e.preventDefault();
        startDecodeSequence();
      }
    });
  }

  // Replay
  if (btnDecodeReplay) {
    btnDecodeReplay.addEventListener("click", (e) => {
      e.stopPropagation();
      decoding = false;
      landed = 0;

      if (decodeReplayBar) decodeReplayBar.hidden = true;
      if (decodePromptBtn) decodePromptBtn.style.display = "inline-flex";
      if (decodeHint)
        decodeHint.textContent =
          "✦ Bấm vào video bất kỳ đâu để giải mã thông điệp ✦";
      if (tributeFrame) tributeFrame.classList.remove("is-paused");
      const clickPrompt = document.getElementById("videoClickPrompt");
      if (clickPrompt) clickPrompt.style.display = "";

      initDecodeEffect();

      if (tributeVideo) {
        tributeVideo.currentTime = 0;
        tributeVideo.play().catch(() => {});
      }
      showToast("▶ Video đang tiếp tục phát lặp...");
    });
  }

  if (btnDecodeLetter) {
    btnDecodeLetter.addEventListener("click", (e) => {
      e.stopPropagation();
      openLetter();
    });
  }

  // Khởi tạo hiệu ứng giải mã
  initDecodeEffect();

  // Đảm bảo video tự động play khi sẵn sàng
  if (tributeVideo) {
    const tryAutoplay = () => {
      tributeVideo.play().catch(() => {});
    };
    tryAutoplay();
    window.addEventListener("pointerdown", tryAutoplay, { once: true });
  }

  // --------------------------------------------------------------------------
  // 5. TOAST THÔNG BÁO TINH TẾ
  // --------------------------------------------------------------------------
  const toast = document.getElementById("toastMessage");
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }
});
