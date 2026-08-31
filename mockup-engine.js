/* ============================================================
   AVCI STÜDYO — Dinamik Tişört Mockup Motoru
   - 4 noktalı perspektif warp (homography + üçgen alt bölme)
   - Dinamik gölge/ışık: fotoğrafın baskı alanı grayscale
     normalize edilir; tasarım üzerine multiply (gölge) +
     screen (parlama) çift katman
   - Kumaş mikro-kıvrımı: SVG feTurbulence/feDisplacementMap
   - Admin: sürüklenebilir 4 köşe anchor + JSON dışa aktarma
   - Tam çözünürlük (orijinal fotoğraf) render
   ============================================================ */
(function () {
  'use strict';

  let S = null; // aktif durum

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sessiz */ } }

  // 4 noktadan homography (3x3) çöz
  function solveHomography(src, dst) {
    const A = [], b = [];
    for (let i = 0; i < 4; i++) {
      const sx = src[i][0], sy = src[i][1], dx = dst[i].x, dy = dst[i].y;
      A.push([sx, sy, 1, 0, 0, 0, -dx * sx, -dx * sy]); b.push(dx);
      A.push([0, 0, 0, sx, sy, 1, -dy * sx, -dy * sy]); b.push(dy);
    }
    const n = 8;
    for (let col = 0; col < n; col++) {
      let piv = col;
      for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
      const tA = A[col]; A[col] = A[piv]; A[piv] = tA;
      const tb = b[col]; b[col] = b[piv]; b[piv] = tb;
      if (Math.abs(A[col][col]) < 1e-10) return null;
      for (let r = col + 1; r < n; r++) {
        const f = A[r][col] / A[col][col];
        for (let c = col; c < n; c++) A[r][c] -= f * A[col][c];
        b[r] -= f * b[col];
      }
    }
    const x = new Array(n).fill(0);
    for (let r = n - 1; r >= 0; r--) {
      let s = b[r];
      for (let c = r + 1; c < n; c++) s -= A[r][c] * x[c];
      x[r] = s / A[r][r];
    }
    return [x[0], x[1], x[2], x[3], x[4], x[5], x[6], x[7], 1];
  }
  function hApply(H, x, y) {
    const w = H[6] * x + H[7] * y + H[8];
    return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
  }
  // Tex görselini hedef quad'a perspektif ile ger
  function warpQuad(ctx, tex, dst, grid) {
    const tw = tex.width || tex.naturalWidth, th = tex.height || tex.naturalHeight;
    const H = solveHomography(
      [[0, 0], [tw, 0], [tw, th], [0, th]],
      [[dst[0].x, dst[0].y], [dst[1].x, dst[1].y], [dst[2].x, dst[2].y], [dst[3].x, dst[3].y]]
    );
    if (!H) return;
    const g = grid || 18;
    const P = [];
    for (let j = 0; j <= g; j++) {
      const row = [];
      for (let i = 0; i <= g; i++) row.push(hApply(H, (i / g) * tw, (j / g) * th));
      P.push(row);
    }
    for (let j = 0; j < g; j++) {
      for (let i = 0; i < g; i++) {
        const a = P[j][i], bq = P[j][i + 1], c = P[j + 1][i + 1], d = P[j + 1][i];
        const su = (i / g) * tw, sv = (j / g) * th;
        const du = tw / g, dv = th / g;
        drawTexTri(ctx, tex, [su, sv], [su + du, sv], [su + du, sv + dv], a, bq, c);
        drawTexTri(ctx, tex, [su, sv], [su + du, sv + dv], [su, sv + dv], a, c, d);
      }
    }
  }
  // Tek üçgen: kaynak (tex) üçgenini hedef üçgene affine ile çiz
  function drawTexTri(ctx, tex, s0, s1, s2, d0, d1, d2) {
    const den = (s1[0] - s2[0]) * (s0[1] - s2[1]) - (s0[0] - s2[0]) * (s1[1] - s2[1]);
    if (Math.abs(den) < 1e-8) return;
    const a = ((d1.x - d2.x) * (s0[1] - s2[1]) - (d0.x - d2.x) * (s1[1] - s2[1])) / den;
    const c = ((s1[0] - s2[0]) * (d0.x - d2.x) - (s0[0] - s2[0]) * (d1.x - d2.x)) / den;
    const e = d0.x - a * s0[0] - c * s0[1];
    const b = ((d1.y - d2.y) * (s0[1] - s2[1]) - (d0.y - d2.y) * (s1[1] - s2[1])) / den;
    const dd = ((s1[0] - s2[0]) * (d0.y - d2.y) - (s0[0] - s2[0]) * (d1.y - d2.y)) / den;
    const f = d0.y - b * s0[0] - dd * s0[1];
    // hedef üçgeni hafif büyüterek dikiş çizgilerini önle
    const cx = (d0.x + d1.x + d2.x) / 3, cy = (d0.y + d1.y + d2.y) / 3, k = 1.015;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx + (d0.x - cx) * k, cy + (d0.y - cy) * k);
    ctx.lineTo(cx + (d1.x - cx) * k, cy + (d1.y - cy) * k);
    ctx.lineTo(cx + (d2.x - cx) * k, cy + (d2.y - cy) * k);
    ctx.closePath();
    ctx.clip();
    ctx.transform(a, b, c, dd, e, f);
    ctx.drawImage(tex, 0, 0);
    ctx.restore();
  }
  function quadPath(ctx, q) {
    ctx.beginPath();
    ctx.moveTo(q[0].x, q[0].y);
    ctx.lineTo(q[1].x, q[1].y);
    ctx.lineTo(q[2].x, q[2].y);
    ctx.lineTo(q[3].x, q[3].y);
    ctx.closePath();
  }
  // Fotoğrafın quad bölgesini grayscale + kontrast normalize et
  function makeShading(photo, natW, natH) {
    const canFilter = typeof document.createElement('canvas').getContext('2d').filter === 'string';
    const c2 = document.createElement('canvas');
    c2.width = natW; c2.height = natH;
    const x2 = c2.getContext('2d');
    const c3 = document.createElement('canvas');
    c3.width = natW; c3.height = natH;
    const x3 = c3.getContext('2d');
    try {
      // normalize: küçük örnekten min/max luminance al
      const sw = 160, sh = Math.max(1, Math.round(natH / natW * 160));
      const s = document.createElement('canvas');
      s.width = sw; s.height = sh;
      const sx = s.getContext('2d');
      sx.drawImage(photo, 0, 0, sw, sh);
      const d = sx.getImageData(0, 0, sw, sh).data;
      let mn = 255, mx = 0;
      for (let i = 0; i < d.length; i += 40) {
        const l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        if (l < mn) mn = l; if (l > mx) mx = l;
      }
      const contrast = Math.min(3, 190 / Math.max(20, mx - mn));
      x2.filter = 'grayscale(1) contrast(' + contrast.toFixed(2) + ') brightness(1.05)';
      x2.drawImage(photo, 0, 0, natW, natH);
      x3.filter = 'grayscale(1) invert(1)';
      x3.drawImage(photo, 0, 0, natW, natH);
    } catch (e) {
      x2.filter = 'none'; x3.filter = 'none';
      x2.drawImage(photo, 0, 0, natW, natH);
      x3.drawImage(photo, 0, 0, natW, natH);
    }
    return { gray: c2, inv: c3 };
  }
  /* ---------- render: tam çözünürlük ---------- */
  function render() {
    if (!S || !S.img || !S.img.complete || !S.getDesign) return null;
    const natW = S.natW, natH = S.natH;
    // Çalışma çözünürlüğünü sınırla: son çıktı 2000px olduğundan dev kaynak
    // fotoğraflarda bellek şişmesini / mobilde çökme riskini önler (oran korunur).
    const MAX_RENDER_EDGE = 2048;
    let sc = 1;
    if (Math.max(natW, natH) > MAX_RENDER_EDGE) sc = MAX_RENDER_EDGE / Math.max(natW, natH);
    const outW2 = Math.max(Math.round(natW * sc), 2);
    const outH2 = Math.max(Math.round(natH * sc), 2);
    const q = S.quad.map(function (p) { return { x: p.x * outW2, y: p.y * outH2 }; });
    const D = S.getDesign();
    const out = document.createElement('canvas');
    out.width = outW2; out.height = outH2;
    const ctx = out.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outW2, outH2);
    ctx.drawImage(S.img, 0, 0, outW2, outH2);
    if (!D) return out;

    const fx = outW2 / S.dispW, fy = outH2 / S.dispH;
    const cx = D.cx * fx, cy = D.cy * fy;
    const w = D.w * fx, h = D.h * fy;
    const ang = (D.angle || 0) * Math.PI / 180;
    const cos = Math.cos(ang), sin = Math.sin(ang);
    const hw = w / 2, hh = h / 2;
    const dQuad = [
      { x: cx + (-hw * cos + hh * sin), y: cy + (-hw * sin - hh * cos) },
      { x: cx + (hw * cos + hh * sin), y: cy + (hw * sin - hh * cos) },
      { x: cx + (hw * cos - hh * sin), y: cy + (hw * sin + hh * cos) },
      { x: cx + (-hw * cos - hh * sin), y: cy + (-hw * sin + hh * cos) }
    ];

    // 3D yanal dönüş (yaw): tasarım dikey eksen etrafında sağa/sola döndürülür.
    // Model yana dönükken tasarım da aynı yöne bakacak şekilde perspektifle daraltılır.
    const yawRad = (D.yaw || 0) * Math.PI / 180;
    if (yawRad) {
      const cosY = Math.cos(yawRad), sinY = Math.sin(yawRad);
      // Görüş mesafesi: yarı genişlik baz alınır; arka kenar uzaklaştıkça daralır.
      const focal = Math.max(hw, 1) * 1.6;
      for (let i = 0; i < 4; i++) {
        const dx = dQuad[i].x - cx;
        const dy = dQuad[i].y - cy;
        // dikey eksen (Y) etrafında döndür: görsel yatayda perspektif alır
        const z = dx * sinY;
        const scale = focal / (focal - z);
        dQuad[i].x = cx + dx * cosY * scale;
        dQuad[i].y = cy + dy * scale;
      }
    }

    // 3D yukarı/aşağı dönüş (pitch): tasarım yatay eksen (X) etrafında döndürülür.
    // Model kameraya doğru eğilmişse tasarım da aynı açıyla üstte/altta daralır.
    const pitchRad = (D.pitch || 0) * Math.PI / 180;
    if (pitchRad) {
      const cosP = Math.cos(pitchRad), sinP = Math.sin(pitchRad);
      const focal = Math.max(hh, 1) * 1.6;
      for (let i = 0; i < 4; i++) {
        const dx = dQuad[i].x - cx;
        const dy = dQuad[i].y - cy;
        // yatay eksen (X) etrafında döndür: görsel dikeyde perspektif alır
        const z = dy * sinP;
        const scale = focal / (focal - z);
        dQuad[i].x = cx + dx * scale;
        dQuad[i].y = cy + dy * cosP * scale;
      }
    }

    // 1) tasarım katmanı: perspektif warp
    const layer = document.createElement('canvas');
    layer.width = outW2; layer.height = outH2;
    const lx = layer.getContext('2d');
    lx.save();
    quadPath(lx, q);
    lx.clip();
    warpQuad(lx, D.el, dQuad, 20);
    lx.restore();

    // 2) kumaş mikro-kıvrımı: SVG displacement
    try {
      const tmp = document.createElement('canvas');
      tmp.width = outW2; tmp.height = outH2;
      const tx = tmp.getContext('2d');
      tx.filter = 'url(#fabric-displacement)';
      tx.drawImage(layer, 0, 0);
      lx.clearRect(0, 0, outW2, outH2);
      lx.drawImage(tmp, 0, 0);
    } catch (e) { /* filter yoksa düz devam */ }

    // 3) dinamik gölge/ışık katmanları
    const sh = makeShading(S.img, outW2, outH2);
    lx.save();
    quadPath(lx, q);
    lx.clip();
    lx.globalCompositeOperation = 'multiply';
    lx.globalAlpha = 0.85;
    lx.drawImage(sh.gray, 0, 0);
    lx.globalCompositeOperation = 'screen';
    lx.globalAlpha = 0.30;
    lx.drawImage(sh.inv, 0, 0);
    lx.restore();
    // alfa maskesi: gölge sadece tasarımın olduğu yerde
    lx.globalCompositeOperation = 'destination-in';
    lx.save();
    quadPath(lx, q);
    lx.clip();
    warpQuad(lx, D.el, dQuad, 8);
    lx.restore();
    lx.globalCompositeOperation = 'source-over';

    // 4) kompozit
    ctx.drawImage(layer, 0, 0);
    return out;
  }
  function canRender() { return !!(S && S.img && S.img.complete); }
  /* ---------- köşe (anchor) editörü ---------- */
  let styleInjected = false;
  function injectStyles() {
    if (styleInjected) return;
    styleInjected = true;
    const st = document.createElement('style');
    st.textContent =
      '.engine-handles{position:absolute;inset:0;pointer-events:none;z-index:6;}' +
      '.engine-handle{position:absolute;width:18px;height:18px;border-radius:50%;' +
      'background:#38bdf8;border:2px solid #fff;box-shadow:0 0 10px rgba(56,189,248,.9);' +
      'transform:translate(-50%,-50%);cursor:move;pointer-events:auto;}' +
      '.engine-handle:hover{background:#e879f9;box-shadow:0 0 12px rgba(232,121,249,.9);}' +
      '.engine-handle .idx{position:absolute;top:-20px;left:50%;transform:translateX(-50%);' +
      'font-size:10px;color:#7dd3fc;font-weight:700;}';
    document.head.appendChild(st);
  }
  function buildHandles() {
    injectStyles();
    const old = S.wrap.querySelector('.engine-handles');
    if (old) old.remove();
    const box = document.createElement('div');
    box.className = 'engine-handles';
    for (let i = 0; i < 4; i++) {
      (function (i) {
        const h = document.createElement('div');
        h.className = 'engine-handle';
        h.innerHTML = '<span class="idx">' + (i + 1) + '</span>';
        h.style.left = (S.quad[i].x * S.dispW) + 'px';
        h.style.top = (S.quad[i].y * S.dispH) + 'px';
        h.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          h.setPointerCapture(e.pointerId);
          function move(ev) {
            const r = S.wrap.getBoundingClientRect();
            let nx = (ev.clientX - r.left) / S.dispW;
            let ny = (ev.clientY - r.top) / S.dispH;
            nx = Math.max(0, Math.min(1, nx));
            ny = Math.max(0, Math.min(1, ny));
            S.quad[i].x = nx; S.quad[i].y = ny;
            h.style.left = (nx * S.dispW) + 'px';
            h.style.top = (ny * S.dispH) + 'px';
            lsSet('avci_quad_' + S.id, JSON.stringify(S.quad));
            if (S.onQuadChange) S.onQuadChange(S.quad);
          }
          function up() {
            h.removeEventListener('pointermove', move);
            h.removeEventListener('pointerup', up);
          }
          h.addEventListener('pointermove', move);
          h.addEventListener('pointerup', up);
        });
        box.appendChild(h);
      })(i);
    }
    S.wrap.appendChild(box);
  }
  function enableCorners(on) {
    if (!S) return;
    S.editing = on;
    let box = S.wrap.querySelector('.engine-handles');
    if (on) {
      if (!box) buildHandles();
      else box.style.display = '';
    } else if (box) box.style.display = 'none';
  }
  /* ---------- JSON dışa aktarma ---------- */
  function getQuadJSON() {
    if (!S) return null;
    return {
      id: S.id,
      corners: S.quad.map(function (p) {
        return { x: Math.round(p.x * S.natW), y: Math.round(p.y * S.natH) };
      })
    };
  }
  function downloadQuadJSON() {
    const data = getQuadJSON();
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'avci-sablon-' + (data.id || 'model') + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    a.remove();
  }

  /* ---------- bağlama ---------- */
  function attach(opts) {
    if (!opts || !opts.img || !opts.wrap) return;
    let quad = null;
    // forceQuad: çağıran taraf her açılışta taze algılama uygular; kayıtlı
    // quad yok sayılır ve algılanan quad ile üzerine yazılır.
    if (!opts.forceQuad) {
      try {
        const saved = lsGet('avci_quad_' + opts.id);
        if (saved) {
          const arr = JSON.parse(saved);
          if (Array.isArray(arr) && arr.length === 4) quad = arr;
        }
      } catch (e) { /* sessiz */ }
    }
    if (!quad) {
      quad = opts.defaultQuad.map(function (p) {
        return { x: p.x / opts.dispW, y: p.y / opts.dispH };
      });
    }
    S = {
      img: opts.img, natW: opts.natW, natH: opts.natH,
      dispW: opts.dispW, dispH: opts.dispH,
      id: opts.id || 'model', quad: quad,
      wrap: opts.wrap, getDesign: opts.getDesign || null,
      onQuadChange: opts.onQuadChange || null,
      editing: false
    };
    if (opts.forceQuad) lsSet('avci_quad_' + S.id, JSON.stringify(S.quad));
    if (S.editing || opts.wrap.querySelector('.engine-handles')) buildHandles();
  }

  /* ---------- temizlik ---------- */
  function detach() { S = null; }

  window.MockupEngine = { attach: attach, render: render, canRender: canRender, enableCorners: enableCorners, getQuadJSON: getQuadJSON, downloadQuadJSON: downloadQuadJSON, detach: detach };
})();




