/**
 * ============================================================================
 * ENGINE 3D HỆ HẠT ÁNH SÁNG TRI ÂN 20/11 - NGƯỜI LÁI ĐÒ GIỮA NGÀN ÁNH SAO
 * Tối ưu hóa 60FPS Hardware Acceleration trên Canvas 2D
 * Tách bạch rõ rệt 2 TRANG SÁCH ĐỐI XỨNG từ mọi góc nhìn (kể cả nhìn dọc & nhìn ngang)
 * ============================================================================
 */

"use strict";

(function (global) {
  // Bộ sinh số giả ngẫu nhiên có seed cố định để mô hình 3D luôn tái hiện nhất quán
  function createRnd(seed) {
    let s = seed | 0;
    return function () {
      s ^= s << 13;
      s ^= s >>> 17;
      s ^= s << 5;
      return (s >>> 0) / 4294967296;
    };
  }

  const rand = createRnd(20261120);

  // Danh sách toàn bộ các hạt 3D
  const points = [];

  /**
   * Thêm một hạt 3D vào hệ thống
   * @param {number} x - Tọa độ X
   * @param {number} y - Tọa độ Y
   * @param {number} z - Tọa độ Z
   * @param {number} size - Bán kính hạt
   * @param {number} tone - 0: Vàng kim ấm, 1: Xanh ngọc lam, 2: Trắng bạc tinh khôi, 3: Đỏ hồng thắm, 4: Hổ phách rực rỡ, 5: Vàng chanh sáng
   * @param {number} kind - 0: Trang sách, 1: Thuyền & Sông, 2: Sao xa, 3: Gáy sách & Điểm nhấn, 4: Người lái đò & Mái chèo
   */
  function addPoint(x, y, z, size = 1.4, tone = 0, kind = 0, jitterAmp = 0.02) {
    const jitter = (rand() - 0.5) * jitterAmp;
    const theta = rand() * Math.PI * 2;
    const phi = (rand() - 0.5) * Math.PI;
    const burstSpeed = 1.2 + rand() * 2.5;

    let r = 248, g = 210, b = 120; // Default Gold
    if (tone === 1) { r = 110; g = 231; b = 245; } // Astral Cyan (Sông sao)
    else if (tone === 2) { r = 255; g = 255; b = 255; } // Pure Star White (Dòng chữ tri thức)
    else if (tone === 3) { r = 255; g = 135; b = 115; } // Warm Coral Glow (Gáy sách)
    else if (tone === 4) { r = 255; g = 190; b = 60; }  // Radiant Amber (Người lái đò / Thuyền)
    else if (tone === 5) { r = 255; g = 245; b = 170; } // Bright Lemon Gold (Nón lá & Viền trang)

    points.push({
      ox: x + jitter,
      oy: y + jitter,
      oz: z + jitter,
      x: x + jitter,
      y: y + jitter,
      z: z + jitter,
      vx: Math.cos(phi) * Math.cos(theta) * burstSpeed,
      vy: Math.sin(phi) * burstSpeed * 0.9,
      vz: Math.cos(phi) * Math.sin(theta) * burstSpeed,
      r, g, b,
      size,
      kind,
      tone,
      phase: rand() * Math.PI * 2,
      twinkleSpeed: 1.5 + rand() * 2.5
    });
  }

  // --------------------------------------------------------------------------
  // HÀM TẠO TỌA ĐỘ BỀ MẶT CHO TỪNG TRANG SÁCH (ĐẢM BẢO 2 TRANG ĐỐI XỨNG RÕ RỆT)
  // side: -1 (Trang Trái), +1 (Trang Phải)
  // t: 0 (gần rãnh gáy sách) -> 1 (mép ngoài cùng của trang)
  // v: -1 (mép dưới của trang) -> +1 (mép trên của trang)
  // --------------------------------------------------------------------------
  function getPageSurface(side, t, v) {
    const innerGap = 0.12;       // Khoảng hở gáy sách tạo rãnh chữ V rõ nét
    const pageWidth = 2.42;      // Độ rộng mỗi trang
    const x = side * (innerGap + t * pageWidth);

    // Vòm cong chữ S (S-curve) mềm mại của trang sách mở:
    // Vồng lên ở giữa trang và vểnh nhẹ ở mép ngoài
    const archH = 0.44 * Math.sin(t * Math.PI * 0.85);
    const liftEdge = 0.58 * Math.pow(t, 1.85);

    // Nâng độ cao của phía đầu sách (v = -1) tạo độ dốc nghiêng như đặt trên giá đọc sách
    const tiltIncline = -v * 0.48;
    const baseSpineY = -1.50 + tiltIncline; // Hạ nhẹ vị trí cuốn sách xuống một chút để thông thoáng bên dưới thuyền

    // Độ cong nhẹ theo chiều dài cuốn sách (dọc theo v)
    const longCurl = 0.08 * (1 - v * v * 0.65);

    const y = baseSpineY + archH + liftEdge + longCurl;

    // Chiều sâu z dọc theo cuốn sách, có độ phồng mềm mại
    const z = v * 1.35 + 0.08 * Math.sin(t * Math.PI) * (1 - v * v * 0.4);

    return { x, y, z };
  }

  // --------------------------------------------------------------------------
  // 1. CUỐN SÁCH TRI THỨC 3D (ĐẦY ĐỦ 2 TRANG MỞ ĐỐI XỨNG Ở MỌI GÓC NHÌN)
  // --------------------------------------------------------------------------
  [-1, 1].forEach((side) => {
    // A. Bề mặt trang sách mịn màng (420 hạt mỗi bên)
    for (let i = 0; i < 420; i++) {
      const t = rand();
      const v = rand() * 2 - 1;
      const pt = getPageSurface(side, t, v);
      const tone = rand() < 0.22 ? 1 : (rand() < 0.38 ? 2 : 0);
      addPoint(pt.x, pt.y, pt.z, rand() * 0.7 + 0.85, tone, 0, 0.03);
    }

    // B. Dòng chữ ánh sáng trên từng trang sách (8 dòng kẻ song song mỗi bên)
    const lineRows = [-0.75, -0.55, -0.35, -0.15, 0.10, 0.30, 0.50, 0.70];
    lineRows.forEach((vRow) => {
      for (let step = 0; step < 26; step++) {
        const t = 0.12 + (step / 25) * 0.76; // từ lề trong ra lề ngoài
        const pt = getPageSurface(side, t, vRow + (rand() - 0.5) * 0.015);
        addPoint(pt.x, pt.y, pt.z, 1.4, 2, 0, 0.008); // hạt trắng sáng sắc sảo
      }
    });

    // C. Viền ngoài trang sách (Book Page Borders):
    // 1) Mép ngoài cùng (Outer edge - t = 1)
    for (let s = 0; s <= 65; s++) {
      const v = -1 + (s / 65) * 2;
      const pt = getPageSurface(side, 1, v);
      addPoint(pt.x, pt.y, pt.z, 1.7, 5, 0, 0.005);
    }

    // 2) Mép trong sát rãnh gáy sách (Inner edge - t = 0)
    for (let s = 0; s <= 65; s++) {
      const v = -1 + (s / 65) * 2;
      const pt = getPageSurface(side, 0, v);
      addPoint(pt.x, pt.y, pt.z, 1.5, 4, 0, 0.005);
    }

    // 3) Mép trên (Top edge - v = 1) - Cánh cung vòm của từng trang
    for (let s = 0; s <= 50; s++) {
      const t = s / 50;
      const pt = getPageSurface(side, t, 1);
      addPoint(pt.x, pt.y, pt.z, 1.6, 5, 0, 0.005);
    }

    // 4) Mép dưới (Bottom edge - v = -1) - Cánh cung vòm của từng trang
    for (let s = 0; s <= 50; s++) {
      const t = s / 50;
      const pt = getPageSurface(side, t, -1);
      addPoint(pt.x, pt.y, pt.z, 1.6, 5, 0, 0.005);
    }

    // D. Tập giấy dày xếp tầng ở cả mép ngoài, mép trên và mép dưới
    // (Tạo thành khối giấy dày 3D ở cả 2 bên khi nhìn ngang lẫn nhìn dọc)
    for (let layer = 1; layer <= 3; layer++) {
      const dY = layer * 0.07;
      const dZ = layer * 0.02;

      // Mép ngoài dày
      for (let s = 0; s <= 35; s++) {
        const v = -1 + (s / 35) * 2;
        const pt = getPageSurface(side, 1, v);
        addPoint(pt.x, pt.y - dY, pt.z - dZ, 1.1, 0, 0, 0.008);
      }

      // Mép trên dày (Khi nhìn dọc từ đầu trang sẽ thấy rõ 2 khối tập giấy 2 bên!)
      for (let s = 0; s <= 30; s++) {
        const t = s / 30;
        const pt = getPageSurface(side, t, 1);
        addPoint(pt.x, pt.y - dY, pt.z + layer * 0.03, 1.1, 0, 0, 0.008);
      }

      // Mép dưới dày (Khi nhìn dọc từ cuối trang sẽ thấy rõ 2 khối tập giấy 2 bên!)
      for (let s = 0; s <= 30; s++) {
        const t = s / 30;
        const pt = getPageSurface(side, t, -1);
        addPoint(pt.x, pt.y - dY, pt.z - layer * 0.03, 1.1, 0, 0, 0.008);
      }
    }
  });

  // E. Rãnh gáy sách trung tâm (Central Spine Valley & Binding)
  // Chạy thẳng từ v = -1 đến v = 1 ở tâm x = 0, chìm sâu hơn để phân tách 2 trang sách
  for (let s = 0; s <= 90; s++) {
    const v = -1 + (s / 90) * 2;
    const z = v * 1.35;
    const tiltIncline = -v * 0.48; // Nghiêng dốc đồng bộ nâng cao phía đầu sách
    const ySpine = -1.54 + tiltIncline + 0.06 * Math.cos(v * Math.PI);

    // Gáy sách dập nổi đỏ san hô và vàng ấm
    addPoint(0, ySpine, z, 2.4, 3, 3, 0.005);
    addPoint(0.04, ySpine + 0.02, z, 1.6, 4, 3, 0.005);
    addPoint(-0.04, ySpine + 0.02, z, 1.6, 4, 3, 0.005);

    // Bìa cứng nâng đỡ dưới đáy gáy sách
    addPoint(0, ySpine - 0.12, z, 1.8, 0, 0, 0.005);
  }

  // --------------------------------------------------------------------------
  // 2. DÒNG SÔNG SAO (RIVER OF STARS)
  // --------------------------------------------------------------------------
  // Dòng sông ánh sáng uốn lượn từ lòng cuốn sách chảy ra phía trước
  for (let i = 0; i < 340; i++) {
    const a = rand() * Math.PI * 2;
    const rad = rand() * 2.2;
    const rx = Math.cos(a) * rad * 1.15;
    const rz = -0.38 + Math.sin(a) * rad * 0.65;
    // Dòng sông dốc nhẹ xuôi theo độ nghiêng cuốn sách
    const riverIncline = -(rz / 1.35) * 0.18;
    const ry = 0.45 + riverIncline + Math.sin(a) * rad * 0.12;
    addPoint(rx, ry, rz, rand() * 0.8 + 0.9, 1, 1);
  }

  // --------------------------------------------------------------------------
  // 3. CON THUYỀN VÀNG KIM (THE GOLDEN CRESCENT BOAT) - KHẮC HỌA RÕ KHỐI 3D
  // --------------------------------------------------------------------------
  const BOAT_Z_CENTER = -0.35;
  const BOAT_Y_BASE = 0.68;

  // A. Hai đường mạn thuyền cong vút hình trăng lưỡi liềm (Left & Right Gunwales)
  const boatSegments = 80;
  for (let s = 0; s <= boatSegments; s++) {
    const u = -1 + (s / boatSegments) * 2;
    const bx = u * 1.45;
    const by = BOAT_Y_BASE + 0.32 * Math.pow(Math.abs(u), 1.6);
    const bWidth = 0.38 * Math.sqrt(Math.max(0, 1 - u * u));

    // Mạn trái (+Z)
    addPoint(bx, by, BOAT_Z_CENTER + bWidth, 1.8, 5, 1, 0.005);
    // Mạn phải (-Z)
    addPoint(bx, by, BOAT_Z_CENTER - bWidth, 1.8, 5, 1, 0.005);

    // Đường sống đáy thuyền (Keel line)
    const byBottom = BOAT_Y_BASE - 0.15 + 0.28 * Math.pow(Math.abs(u), 1.6);
    addPoint(bx, byBottom, BOAT_Z_CENTER, 1.5, 4, 1, 0.005);

    // Thân ván thuyền
    if (s % 2 === 0) {
      addPoint(bx, (by + byBottom) * 0.5, BOAT_Z_CENTER + bWidth * 0.75, 1.2, 0, 1, 0.01);
      addPoint(bx, (by + byBottom) * 0.5, BOAT_Z_CENTER - bWidth * 0.75, 1.2, 0, 1, 0.01);
    }
  }

  // B. Các nan be ngang thuyền & sàn gỗ phát sáng (Crossbeams & Deck)
  const beamPositions = [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75];
  beamPositions.forEach((u) => {
    const bx = u * 1.45;
    const by = BOAT_Y_BASE + 0.32 * Math.pow(Math.abs(u), 1.6);
    const bWidth = 0.38 * Math.sqrt(Math.max(0, 1 - u * u));
    for (let step = 0; step <= 12; step++) {
      const frac = -1 + (step / 12) * 2;
      const bz = BOAT_Z_CENTER + frac * bWidth;
      addPoint(bx, by - 0.04, bz, 1.3, 4, 1, 0.005);
    }
  });

  // C. Mũi thuyền và Đuôi thuyền nhọn vểnh cao phát sáng đặc biệt
  addPoint(1.48, BOAT_Y_BASE + 0.34, BOAT_Z_CENTER, 2.4, 2, 1);
  addPoint(1.52, BOAT_Y_BASE + 0.38, BOAT_Z_CENTER, 2.0, 5, 1);
  addPoint(-1.48, BOAT_Y_BASE + 0.34, BOAT_Z_CENTER, 2.2, 2, 1);

  // --------------------------------------------------------------------------
  // 4. HÌNH BÓNG NGƯỜI LÁI ĐÒ & MÁI CHÈO (THE FERRYMAN & OAR) - CHI TIẾT & SẮC NÉT
  // --------------------------------------------------------------------------
  const MAN_X = -0.12;
  const MAN_Z = -0.35;

  // A. Chiếc nón lá truyền thống (Conical Hat)
  const HAT_APEX_X = MAN_X + 0.04;
  const HAT_APEX_Y = 1.84;
  const HAT_APEX_Z = MAN_Z + 0.02;
  const HAT_RADIUS = 0.38;
  const HAT_BASE_Y = 1.58;

  addPoint(HAT_APEX_X, HAT_APEX_Y, HAT_APEX_Z, 2.6, 2, 4);
  addPoint(HAT_APEX_X, HAT_APEX_Y - 0.04, HAT_APEX_Z, 2.0, 5, 4);

  // Vành nón lá tròn đều
  for (let i = 0; i < 48; i++) {
    const ang = (i / 48) * Math.PI * 2;
    const hx = HAT_APEX_X + Math.cos(ang) * HAT_RADIUS;
    const hz = HAT_APEX_Z + Math.sin(ang) * HAT_RADIUS;
    const hy = HAT_BASE_Y + Math.sin(ang) * 0.04;
    addPoint(hx, hy, hz, 1.6, 5, 4, 0.005);
  }

  // Mặt nón lá (Nan nón)
  for (let rib = 0; rib < 16; rib++) {
    const ang = (rib / 16) * Math.PI * 2;
    for (let step = 1; step <= 6; step++) {
      const frac = step / 7;
      const hx = HAT_APEX_X + Math.cos(ang) * HAT_RADIUS * frac;
      const hz = HAT_APEX_Z + Math.sin(ang) * HAT_RADIUS * frac;
      const hy = HAT_APEX_Y - frac * (HAT_APEX_Y - HAT_BASE_Y);
      addPoint(hx, hy, hz, 1.3, 0, 4, 0.005);
    }
  }

  // B. Khuôn mặt & Dáng đầu dưới vành nón lá
  for (let i = 0; i < 22; i++) {
    const ang = rand() * Math.PI * 2;
    const rHead = rand() * 0.12;
    addPoint(MAN_X + Math.cos(ang) * rHead, 1.52 + (rand() - 0.5) * 0.1, MAN_Z + Math.sin(ang) * rHead, 1.4, 4, 4);
  }

  // C. Dáng đứng Thầy Cô: Bờ vai, Thân áo dài / Áo tơi uyển chuyển
  for (let step = 0; step <= 14; step++) {
    const frac = -1 + (step / 14) * 2;
    const shoulderX = MAN_X + frac * 0.06;
    const shoulderZ = MAN_Z + frac * 0.22;
    addPoint(shoulderX, 1.42, shoulderZ, 1.8, 5, 4, 0.005);
  }

  // Thân mình & Tà áo tơi rủ xuống sàn thuyền
  for (let layer = 0; layer <= 22; layer++) {
    const fracY = layer / 22;
    const curY = 1.42 - fracY * 0.70;
    const flare = 0.12 + fracY * 0.18;
    const pointsInLayer = 8 + Math.floor(fracY * 6);

    for (let pIdx = 0; pIdx < pointsInLayer; pIdx++) {
      const ang = (pIdx / pointsInLayer) * Math.PI * 2;
      const bx = MAN_X + (fracY * 0.08) + Math.cos(ang) * flare * 0.7;
      const bz = MAN_Z + Math.sin(ang) * flare;
      const tone = fracY < 0.3 ? 5 : (pIdx % 2 === 0 ? 4 : 0);
      addPoint(bx, curY, bz, 1.4, tone, 4, 0.008);
    }
  }

  // D. Hai cánh tay cầm mái chèo
  // - Cánh tay sau
  for (let step = 0; step <= 10; step++) {
    const f = step / 10;
    const ax = (MAN_X - 0.04) + f * (-0.12);
    const ay = 1.40 - f * 0.12;
    const az = (MAN_Z + 0.18) + f * (-0.18);
    addPoint(ax, ay, az, 1.5, 4, 4, 0.005);
  }

  // - Cánh tay trước
  for (let step = 0; step <= 10; step++) {
    const f = step / 10;
    const ax = (MAN_X + 0.05) + f * 0.22;
    const ay = 1.38 - f * 0.22;
    const az = (MAN_Z - 0.15) + f * 0.22;
    addPoint(ax, ay, az, 1.5, 4, 4, 0.005);
  }

  // E. Mái chèo dài (The Long Oar) & Bản mái dầm chạm nước
  const OAR_TOP_X = -0.42, OAR_TOP_Y = 1.48, OAR_TOP_Z = -0.05;
  const OAR_WATER_X = 0.88, OAR_WATER_Y = 0.42, OAR_WATER_Z = 0.42;

  for (let step = 0; step <= 48; step++) {
    const f = step / 48;
    const ox = OAR_TOP_X + f * (OAR_WATER_X - OAR_TOP_X);
    const oy = OAR_TOP_Y + f * (OAR_WATER_Y - OAR_TOP_Y);
    const oz = OAR_TOP_Z + f * (OAR_WATER_Z - OAR_TOP_Z);
    addPoint(ox, oy, oz, 1.7, 5, 4, 0.004);
  }

  // Bản mái dầm (Oar Blade) bè phẳng chạm vào dòng nước
  for (let bStep = 0; bStep <= 18; bStep++) {
    const f = bStep / 18;
    const bx = OAR_WATER_X + f * 0.28;
    const by = OAR_WATER_Y - f * 0.18;
    const bz = OAR_WATER_Z + f * 0.12;
    addPoint(bx, by, bz + 0.06, 1.8, 1, 4, 0.005);
    addPoint(bx, by, bz - 0.06, 1.8, 1, 4, 0.005);
    addPoint(bx, by, bz, 2.0, 2, 4, 0.005);
  }

  // F. Vòng sóng nước phát sáng nơi mái chèo khua xuống dòng sông (Oar Ripples)
  const rippleRadii = [0.18, 0.32, 0.48];
  rippleRadii.forEach((rRip, rIdx) => {
    const count = 16 + rIdx * 8;
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2;
      const rx = OAR_WATER_X + Math.cos(ang) * rRip * 1.2;
      const rz = OAR_WATER_Z + Math.sin(ang) * rRip;
      const ry = OAR_WATER_Y + Math.sin(ang * 2) * 0.02;
      addPoint(rx, ry, rz, 1.3, 1, 4, 0.005);
    }
  });

  // --------------------------------------------------------------------------
  // 5. BẦU TRỜ ĐẦY SAO XA (COSMIC STARFIELD)
  // --------------------------------------------------------------------------
  for (let i = 0; i < 220; i++) {
    const sx = (rand() - 0.5) * 8.2;
    const sy = (rand() - 0.5) * 5.6;
    const sz = (rand() - 0.5) * 4.6;
    addPoint(sx, sy, sz, rand() * 0.9 + 0.5, rand() < 0.4 ? 1 : (rand() < 0.7 ? 2 : 0), 2);
  }

  // --------------------------------------------------------------------------
  // SAO BĂNG LƯỚT QUA BẦU TRỜ (SHOOTING STAR SYSTEM)
  // --------------------------------------------------------------------------
  const shootingStars = [];
  function spawnShootingStar() {
    shootingStars.push({
      x: (rand() * 2 - 1) * 3.2,
      y: 1.5 + rand() * 1.2,
      z: -1 - rand() * 2,
      dx: -1.8 - rand() * 1.2,
      dy: -1.2 - rand() * 0.8,
      life: 1.0,
      decay: 0.02 + rand() * 0.03
    });
  }

  // --------------------------------------------------------------------------
  // LỚP KẾT XUẤT 3D (RENDERER) - TỐI ƯU ĐỘ RỰC RỠ VÀ RÕ NÉT CỦA ĐIỂM SÁNG
  // --------------------------------------------------------------------------
  class SceneRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false });
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.updateSize();
    }

    updateSize() {
      const rect = this.canvas.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = Math.max(320, Math.floor(rect.width));
      const displayH = Math.max(220, Math.floor(rect.height));

      if (this.canvas.width !== displayW * this.dpr || this.canvas.height !== displayH * this.dpr) {
        this.canvas.width = displayW * this.dpr;
        this.canvas.height = displayH * this.dpr;
        this.width = displayW;
        this.height = displayH;
      }
    }

    render(state) {
      this.updateSize();
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const dpr = this.dpr;

      // Reset ma trận biến đổi & xóa màn hình với gradient vũ trụ sâu thẳm
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const bgGrad = ctx.createRadialGradient(
        w * dpr * 0.5, h * dpr * 0.45, 10,
        w * dpr * 0.5, h * dpr * 0.45, Math.max(w, h) * dpr * 0.85
      );
      bgGrad.addColorStop(0, '#0e1838');
      bgGrad.addColorStop(0.55, '#060a19');
      bgGrad.addColorStop(1, '#02040a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w * dpr, h * dpr);

      // Scale theo tỉ lệ DPR để hình ảnh nét căng
      ctx.scale(dpr, dpr);

      // Ma trận xoay Camera 3D
      const cy = Math.cos(state.yaw), sy = Math.sin(state.yaw);
      const cp = Math.cos(state.pitch), sp = Math.sin(state.pitch);
      const zoom = state.zoom;
      const baseScale = Math.min(w, h) * 0.25 * zoom;
      const blast = Math.max(0, Math.min(1, state.blast));
      const t = state.time;

      // Chuyển động bập bềnh của thuyền, người lái đò và sóng nước
      const boatFloatY = 0.08 * Math.sin(t * 1.5);
      const boatSwayX = 0.10 * Math.cos(t * 0.85);
      const boatRoll = 0.04 * Math.sin(t * 1.2);

      // Hiệu ứng thở nhẹ của cuốn sách tri thức
      const bookBreathe = 0.035 * Math.sin(t * 1.05);

      // Chế độ hòa trộn cộng hưởng ánh sáng (Additive Blending)
      ctx.globalCompositeOperation = 'lighter';

      // 1. Vẽ sao băng nếu có
      if (Math.random() < 0.015 && shootingStars.length < 3) {
        spawnShootingStar();
      }

      for (let sIdx = shootingStars.length - 1; sIdx >= 0; sIdx--) {
        const ss = shootingStars[sIdx];
        ss.x += ss.dx * 0.035;
        ss.y += ss.dy * 0.035;
        ss.life -= ss.decay;

        if (ss.life <= 0) {
          shootingStars.splice(sIdx, 1);
          continue;
        }

        const sX = ss.x * cy + ss.z * sy;
        const sZ = -ss.x * sy + ss.z * cy;
        const sY = ss.y * cp - sZ * sp;
        const sDepth = ss.y * sp + sZ * cp;
        const sPersp = 4.8 / (4.8 - sDepth * 0.25);
        const spx = w * 0.5 + sX * baseScale * sPersp;
        const spy = h * 0.56 - sY * baseScale * sPersp;

        ctx.strokeStyle = `rgba(255, 240, 200, ${ss.life * 0.8})`;
        ctx.lineWidth = 1.8 * sPersp;
        ctx.beginPath();
        ctx.moveTo(spx, spy);
        ctx.lineTo(spx - ss.dx * 8 * sPersp, spy + ss.dy * 8 * sPersp);
        ctx.stroke();
      }

      // 2. Chiếu và vẽ toàn bộ các hạt 3D
      const centerX = w * 0.5;
      const centerY = h * 0.57; // Hạ toàn bộ mô hình xuống màn hình một chút, tạo sự thoáng đãng phía trên

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        let px3 = p.ox;
        let py3 = p.oy;
        let pz3 = p.oz;

        // Hoạt ảnh động theo từng nhóm đối tượng
        if (p.kind === 0) {
          // Trang sách thở nhẹ nhàng
          py3 += bookBreathe * Math.abs(p.ox * 0.35);
        } else if (p.kind === 1 || p.kind === 4) {
          // Con thuyền, Người lái đò, Mái chèo và Sóng nước chuyển động đồng bộ
          px3 += boatSwayX;
          py3 += boatFloatY;
          if (p.kind === 4) {
            // Người lái đò có nhịp rướn người chèo đò nhẹ
            px3 += 0.02 * Math.sin(t * 1.5);
            py3 += 0.015 * Math.cos(t * 1.5);
          }
          // Nghiêng lắc lư theo sóng
          const rx = px3 * Math.cos(boatRoll) - py3 * Math.sin(boatRoll);
          const ry = px3 * Math.sin(boatRoll) + py3 * Math.cos(boatRoll);
          px3 = rx;
          py3 = ry;
        } else if (p.kind === 2) {
          // Bầu trời sao trôi nhẹ
          py3 += 0.07 * Math.sin(t * 0.6 + p.phase);
        }

        // Hiệu ứng Bùng Nổ Sao Băng Ánh Sáng (Supernova Burst)
        if (blast > 0) {
          const power = Math.pow(blast, 1.4) * 4.8;
          const spiralAng = blast * 3.2 + p.phase;
          px3 += (p.vx + Math.cos(spiralAng) * 0.8) * power;
          py3 += (p.vy + Math.sin(spiralAng) * 0.8) * power;
          pz3 += (p.vz + Math.sin(p.phase * 2) * 1.1) * power;
        }

        // Phép chiếu phối cảnh 3D
        const rotX = px3 * cy + pz3 * sy;
        const rotZ = -px3 * sy + pz3 * cy;
        const rotY = py3 * cp - rotZ * sp;
        const depth = py3 * sp + rotZ * cp;

        const perspective = 4.8 / (4.8 - depth * 0.25);
        if (perspective <= 0) continue;

        const screenX = centerX + rotX * baseScale * perspective;
        const screenY = centerY - rotY * baseScale * perspective;

        if (screenX < -25 || screenX > w + 25 || screenY < -25 || screenY > h + 25) {
          continue;
        }

        // Tăng cường độ sáng & độ nổi bật cho Người lái đò, Con thuyền và Gáy sách
        const isImportant = (p.kind === 4 || p.kind === 1 || p.kind === 3);
        const minAlpha = isImportant ? 0.45 : 0.25; // Nâng độ sáng tối thiểu của sách lên 0.25
        const twinkle = 0.75 + 0.25 * Math.sin(t * p.twinkleSpeed + p.phase);
        let alpha = Math.min(1, Math.max(minAlpha, twinkle * perspective * 0.9));

        if (blast > 0) {
          alpha = Math.min(1, alpha * (1 + blast * 1.2));
        }

        const pointRadius = Math.max(
          0.8,
          p.size * perspective * (isImportant ? 1.08 : 0.96) * (0.85 + blast * 0.5)
        );

        // Vẽ hạt nhân chính
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, pointRadius, 0, Math.PI * 2);
        ctx.fill();

        // Vẽ quầng hào quang tỏa tròn (Glow Aura)
        if (isImportant || pointRadius > 1.6 || p.tone === 2 || p.tone === 5) {
          const auraRadius = pointRadius * (isImportant ? 2.5 : 2.0);
          const auraAlpha = alpha * (isImportant ? 0.35 : 0.22);
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${auraAlpha})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, auraRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // Xuất ra phạm vi toàn cục
  global.SceneRenderer = SceneRenderer;
  global.SCENE_POINTS = points;

})(window);
