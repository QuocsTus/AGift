/**
 * ============================================================================
 * TRÌNH ĐIỀU KHIỂN TƯƠNG TÁC TOÀN DIỆN (CINEMATIC & 3D INTERACTIVE ENGINE)
 * Tri Ân Ngày Nhà Giáo Việt Nam 20/11 — Người Thầy, Dấu Ấn Không Phai
 * ============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. HEADER NAVIGATION & SCROLL SPY
  // Dùng requestAnimationFrame để throttle scroll spy — tránh jank
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [
    { id: 'hero', nav: 'hero' },
    { id: 'teacherStory', nav: 'teacherStory' },
    { id: 'memoryJourney', nav: 'memoryJourney' },
    { id: 'beliefAndValues', nav: 'beliefAndValues' },
    { id: 'tributeSection', nav: 'tributeSection' },
    { id: 'scene3dSection', nav: 'scene3dSection' }
  ];

  const header = document.getElementById('siteHeader');
  const headerHeight = header ? header.offsetHeight : 58;

  // Cache element references — tránh DOM query mỗi frame
  const sectionEls = sections.map(s => ({
    ...s,
    el: document.getElementById(s.id)
  }));

  // Cuộn mượt với offset header
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight + 2;
        window.scrollTo({
          top: topPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // Nút CTA bắt đầu hành trình
  const startJourneyBtn = document.getElementById('startJourneyBtn');
  if (startJourneyBtn) {
    startJourneyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetEl = document.getElementById('teacherStory');
      if (targetEl) {
        const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight + 2;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    });
  }

  // Scroll Spy — throttle bằng RAF để không chạy mỗi pixel scroll
  let scrollSpyRafId = null;
  let lastActiveNav = '';

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

    navLinks.forEach(link => {
      const isMatch = link.getAttribute('data-nav') === activeNav;
      link.classList.toggle('active', isMatch);
      const underline = link.querySelector('.nav-glow-underline');
      if (underline) underline.style.display = isMatch ? 'block' : 'none';
    });
  }

  function onScroll() {
    if (!scrollSpyRafId) {
      scrollSpyRafId = requestAnimationFrame(updateActiveNav);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateActiveNav();

  // --------------------------------------------------------------------------
  // 2. ÂM NHẠC TRI ÂN DU DƯƠNG (WEB AUDIO API SYNTHESIZER)
  // Không phụ thuộc file ngoài, không lo 404, giai điệu piano/harp ấm áp
  // --------------------------------------------------------------------------
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicLoopTimeout = null;

  // Giai điệu tri ân: Tiến trình hợp âm Cmaj7 -> Am9 -> Fmaj7 -> Gsus4
  const chords = [
    [261.63, 329.63, 392.00, 493.88], // C - E - G - B
    [220.00, 261.63, 329.63, 392.00], // A - C - E - G
    [174.61, 220.00, 261.63, 329.63], // F - A - C - E
    [196.00, 246.94, 293.66, 392.00]  // G - B - D - G
  ];

  let currentChord = 0;
  let stepIndex = 0;

  function initAudioEngine() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPianoNote(freq, duration = 1.8, gainVol = 0.055) {
    if (!audioCtx || !isMusicPlaying) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVol, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

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
    musicToggleBtn.addEventListener('click', () => {
      initAudioEngine();
      isMusicPlaying = !isMusicPlaying;

      if (isMusicPlaying) {
        musicToggleBtn.classList.add('playing');
        showToast('🎵 Đang phát giai điệu tri ân du dương');
        stepMusicMelody();
      } else {
        musicToggleBtn.classList.remove('playing');
        clearTimeout(musicLoopTimeout);
        showToast('Đã tạm dừng âm nhạc');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. CANVAS AMBIENT PARTICLES & FALLING PETALS NỀN
  // Tối ưu: giảm số lượng hạt, dùng offscreen batch, throttle 30fps cho ambient
  // --------------------------------------------------------------------------
  const ambientCanvas = document.getElementById('ambientCanvas');
  if (ambientCanvas) {
    const ctxA = ambientCanvas.getContext('2d', { alpha: true, desynchronized: true });
    let widthA = 0, heightA = 0;
    let animAmbientId = null;

    function resizeAmbientCanvas() {
      widthA = window.innerWidth;
      heightA = window.innerHeight;
      ambientCanvas.width = widthA;
      ambientCanvas.height = heightA;
    }
    window.addEventListener('resize', resizeAmbientCanvas, { passive: true });
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
        phase: Math.random() * Math.PI * 2
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
        colorTone: Math.random() < 0.6 ? 'rgba(255, 240, 225, ' : 'rgba(255, 215, 220, ',
        alpha: Math.random() * 0.35 + 0.28,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.018 + 0.012
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
      ctxA.fillStyle = 'rgba(244, 199, 119, 1)';
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
        ctxA.fillStyle = pt.colorTone + pt.alpha + ')';
        ctxA.beginPath();
        ctxA.moveTo(0, -pt.size);
        ctxA.bezierCurveTo(pt.size * 0.6, -pt.size * 0.5, pt.size * 0.6, pt.size * 0.5, 0, pt.size);
        ctxA.bezierCurveTo(-pt.size * 0.6, pt.size * 0.5, -pt.size * 0.6, -pt.size * 0.5, 0, -pt.size);
        ctxA.fill();
        ctxA.restore();
      }
      ctxA.globalAlpha = 1;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
      animAmbientId = requestAnimationFrame(renderAmbient);
    }

    // Tạm dừng ambient khi tab ẩn — tiết kiệm GPU cho 3D scene
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animAmbientId) { cancelAnimationFrame(animAmbientId); animAmbientId = null; }
      } else {
        if (!animAmbientId) animAmbientId = requestAnimationFrame(renderAmbient);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. MÔ HÌNH 3D TƯƠNG TÁC NGƯỜI LÁI ĐÒ Ở PHẦN DƯỚI CÙNG (SECTION 05)
  // Bảo tồn nguyên vẹn mô hình 3D, hệ hạt ánh sáng & popup thiệp hoàng gia
  // --------------------------------------------------------------------------
  const sceneCanvas = document.getElementById('scene');
  if (sceneCanvas && window.SceneRenderer) {
    const fpsBadge = document.getElementById('fpsValue');
    const canvasHints = document.getElementById('canvasHints');
    
    const letterModal = document.getElementById('letterModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const closeLetterBtn = document.getElementById('closeLetterBtn');
    const returnSkyBtn = document.getElementById('returnSkyBtn');
    const copyWishBtn = document.getElementById('copyWishBtn');

    const renderer = new window.SceneRenderer(sceneCanvas);

    // Góc nhìn tối ưu đã được người dùng phê duyệt
    const DEFAULT_YAW = 0.08;
    const DEFAULT_PITCH = 0.14; // Ngang tầm mắt người lái đò
    const DEFAULT_ZOOM = 0.88;  // Thoáng đãng

    let yaw = DEFAULT_YAW;
    let pitch = DEFAULT_PITCH;
    let zoom = DEFAULT_ZOOM;
    let targetZoom = DEFAULT_ZOOM;

    let velYaw = 0;
    let velPitch = 0;
    let isPointerDown = false;
    let pointerMoved = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let pointerStartX = 0;
    let pointerStartY = 0;

    let isAutoOrbit = true;
    let isExploding = false;
    let blastFactor = 0;
    let burstStartTime = 0;
    let elapsedTime = 0;

    let frameCount = 0;
    let lastFpsUpdate = performance.now();
    let lastTimestamp = performance.now();
    let anim3dId = null;

    function render3dLoop(now) {
      anim3dId = requestAnimationFrame(render3dLoop);

      const dt = Math.min((now - lastTimestamp) / 1000, 0.05);
      lastTimestamp = now;

      // Cập nhật FPS counter mỗi 500ms
      frameCount++;
      if (now - lastFpsUpdate >= 500) {
        const currentFps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
        if (fpsBadge) fpsBadge.textContent = `${currentFps} FPS`;
        frameCount = 0;
        lastFpsUpdate = now;
      }

      elapsedTime += dt;

      // Tự động xoay quanh người lái đò
      if (isAutoOrbit && !isPointerDown && !isExploding) {
        yaw += 0.48 * dt;
      }

      // Quán tính khi buông tay vuốt
      if (!isPointerDown) {
        yaw += velYaw;
        pitch += velPitch;
        velYaw *= 0.92;
        velPitch *= 0.92;
        if (Math.abs(velYaw) < 0.0001) velYaw = 0;
        if (Math.abs(velPitch) < 0.0001) velPitch = 0;
      }

      pitch = Math.max(-1.15, Math.min(1.15, pitch));
      zoom += (targetZoom - zoom) * 0.12;

      // Hiệu ứng nổ Supernova Burst
      if (isExploding) {
        const elapsedBurst = (now - burstStartTime) / 1000;
        const progress = Math.min(1, elapsedBurst / 1.7);
        blastFactor = Math.sin(progress * Math.PI * 0.5);

        if (progress >= 1) {
          isExploding = false;
          blastFactor = 0;
          openLetter();
        }
      }

      renderer.render({
        yaw,
        pitch,
        zoom,
        blast: blastFactor,
        time: elapsedTime
      });
    }

    anim3dId = requestAnimationFrame(render3dLoop);

    // Cử chỉ chuột & cảm ứng vuốt
    sceneCanvas.addEventListener('pointerdown', (e) => {
      if (isExploding) return;
      isPointerDown = true;
      pointerMoved = false;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      velYaw = 0;
      velPitch = 0;
      sceneCanvas.setPointerCapture(e.pointerId);

      if (canvasHints) {
        canvasHints.style.opacity = '0';
      }
    });

    sceneCanvas.addEventListener('pointermove', (e) => {
      if (!isPointerDown || isExploding) return;
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      if (Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY) > 6) {
        pointerMoved = true;
      }
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;

      const rotSpeed = 0.0065;
      const deltaYaw = dx * rotSpeed;
      const deltaPitch = dy * rotSpeed * 0.9;

      yaw += deltaYaw;
      pitch += deltaPitch;

      velYaw = deltaYaw * 0.75;
      velPitch = deltaPitch * 0.75;
    });

    const endDrag = (e) => {
      if (isPointerDown) {
        isPointerDown = false;
        try {
          sceneCanvas.releasePointerCapture(e.pointerId);
        } catch (_) {}

        // Bấm nhẹ để kích hoạt hiệu ứng và mở thiệp; kéo vẫn chỉ xoay mô hình.
        if (!pointerMoved && !isExploding) {
          startCelebration();
        }
      }
    };

    sceneCanvas.addEventListener('pointerup', endDrag);
    sceneCanvas.addEventListener('pointercancel', endDrag);

    // Thu phóng con lăn chuột
    sceneCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
      targetZoom = Math.max(0.65, Math.min(1.85, targetZoom + zoomDelta));
    }, { passive: false });

    // Bùng nổ ánh sáng & mở thiệp khi bấm trực tiếp vào màn 3D.
    function startCelebration() {
      if (isExploding) return;
      isExploding = true;
      burstStartTime = performance.now();
      blastFactor = 0;
      showToast('✦ Các vì sao đang bùng nở đón mừng Thầy Cô...');
    }

    // Xử lý Popup Thiệp Hoàng Gia
    function openLetter() {
      if (letterModal) {
        letterModal.hidden = false;
        document.body.style.overflow = 'hidden';
        if (closeLetterBtn) closeLetterBtn.focus();
      }
    }

    function closeLetter() {
      if (letterModal) {
        letterModal.hidden = true;
        document.body.style.overflow = '';
        sceneCanvas.focus();
      }
    }

    if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeLetter);
    if (returnSkyBtn) returnSkyBtn.addEventListener('click', closeLetter);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeLetter);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && letterModal && !letterModal.hidden) {
        closeLetter();
      }
    });

    if (copyWishBtn) {
      copyWishBtn.addEventListener('click', async () => {
        const poem = `“Có một nghề bụi phấn bám đầy tay,\nNgười ta bảo là nghề cao quý nhất.\nCó một nghề không trồng cây vào đất,\nMà cho đời muôn vạn đóa hoa thơm…”`;
        const prose = `Kính gửi Thầy, Cô! Nhân ngày Nhà giáo Việt Nam 20/11, chúng em xin kính chúc Thầy Cô luôn dồi dào sức khỏe, bình an, hạnh phúc và luôn giữ mãi ngọn lửa nhiệt huyết để tiếp tục nâng bước những thế hệ học trò!`;
        const sigElement = document.querySelector('.sig-name');
        const signature = sigElement ? sigElement.textContent.replace('✎', '').trim() : 'Tập thể học trò kính dâng';
        const fullMessage = `${poem}\n\n${prose}\n\n— ${signature}`;

        try {
          await navigator.clipboard.writeText(fullMessage);
          showToast('✓ Đã sao chép lời chúc vào bộ nhớ tạm thành công!');
        } catch (_) {
          showToast('✓ Đã chuẩn bị sẵn lời chúc ý nghĩa!');
        }
      });
    }

    // Tạm dừng khi chuyển tab
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (anim3dId) cancelAnimationFrame(anim3dId);
        anim3dId = null;
      } else {
        lastTimestamp = performance.now();
        lastFpsUpdate = performance.now();
        if (!anim3dId) anim3dId = requestAnimationFrame(render3dLoop);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. TOAST THÔNG BÁO TINH TẾ
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toastMessage');
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
});
