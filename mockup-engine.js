/* ============================================================
   AVCI STÜDYO — WebGL (GPU) Tişört Mockup Motoru
   - Fragment shader: kumaş luminance'ından Gaussian blur +
     Sobel gradyanı ile DONANIM hızlandırmalı displacement
     (pikselleşme/tırtıklanma yok — GPU linear interpolasyon)
   - Shader içi ışık/gölge compositing: multiply (gölge) +
     soft-light (parlama)
   - Tasarım: fabric objesinden serbest konum/boyut/açı/skew
     alınır; sınır yok, kullanıcı istediği yere sürükler
   - Eski public API korunmuştur: attach / render / canRender /
     enableCorners / getQuadJSON / downloadQuadJSON / detach
   - Yeni: mountPreview() + renderPreview() → edit modalinde
     canlı GPU önizleme katmanı
   ============================================================ */
console.log('[STUDYO] mockup-engine.js v5 yüklendi — WebGL GPU motoru');
(function () {
  'use strict';

  let S = null; // aktif durum

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sessiz */ } }

  /* ================= SHADER KAYNAKLARI ================= */
  var VS_SRC = [
    'attribute vec2 a_pos;',
    'varying vec2 v_uv;',
    'void main() {',
    '  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);',
    '  gl_Position = vec4(a_pos, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FS_SRC = [
    'precision highp float;',
    'varying vec2 v_uv;',
    'uniform sampler2D u_shirt;',
    'uniform sampler2D u_design;',
    'uniform vec2  u_texel;     // 1 / tişört doku boyutu',
    'uniform float u_A;         // genislik / yukseklik',
    'uniform vec2  u_dcenter;   // tasarım merkezi',
    'uniform vec2  u_dhalf;     // tasarım yarı boyutu',
    'uniform vec2  u_rot;       // cos(a), sin(a)',
    'uniform vec2  u_skew;      // tan(skewX), tan(skewY)',
    'uniform float u_intensity;',
    'uniform float u_blur;',
    'uniform float u_shading;',
    'uniform float u_mode;      // 0 düz, 1 multiply+softlight, 2 sadece multiply',
    '',
    'float lumAt(vec2 uv) {',
    '  vec3 c = texture2D(u_shirt, uv).rgb;',
    '  return dot(c, vec3(0.299, 0.587, 0.114));',
    '}',
    '/* Gaussian (1-2-1 x 1-2-1) luminance: mikro iplik parazitini eler,',
    '   sadece ana kumaş dalgalarını/kıvrımlarını referans alır */',
    'float lumBlur(vec2 uv, float r) {',
    '  vec2 o = u_texel * r;',
    '  float s = 0.0;',
    '  s += lumAt(uv + vec2(-o.x, -o.y)) * 1.0;',
    '  s += lumAt(uv + vec2( 0.0, -o.y)) * 2.0;',
    '  s += lumAt(uv + vec2( o.x, -o.y)) * 1.0;',
    '  s += lumAt(uv + vec2(-o.x,  0.0)) * 2.0;',
    '  s += lumAt(uv)                    * 4.0;',
    '  s += lumAt(uv + vec2( o.x,  0.0)) * 2.0;',
    '  s += lumAt(uv + vec2(-o.x,  o.y)) * 1.0;',
    '  s += lumAt(uv + vec2( 0.0,  o.y)) * 2.0;',
    '  s += lumAt(uv + vec2( o.x,  o.y)) * 1.0;',
    '  return s / 16.0;',
    '}',
    '',
    'void main() {',
    '  vec4 shirt = texture2D(u_shirt, v_uv);',
    '',
    '  /* 1) BLUR LU LUMINANCE + SOBEL GRADYAN (GPU da) */',
    '  float r = max(u_blur, 0.5);',
    '  float gStep = r * 2.0;',
    '  vec2 o = u_texel * gStep;',
    '  float lL = lumBlur(v_uv - vec2(o.x, 0.0), r);',
    '  float lR = lumBlur(v_uv + vec2(o.x, 0.0), r);',
    '  float lT = lumBlur(v_uv - vec2(0.0, o.y), r);',
    '  float lB = lumBlur(v_uv + vec2(0.0, o.y), r);',
    '  vec2 grad = vec2(lR - lL, lB - lT);',
    '  float lum = lumBlur(v_uv, r);',
    '',
    '  /* 2) PURUZSUZ DISPLACEMENT (donanim linear interpolasyonu) */',
    '  vec2 disp = grad * u_intensity * u_texel * 32.0;',
    '  float dLen = length(disp);',
    '  float dCap = u_intensity * 2.0 * u_texel.x;',
    '  disp /= 1.0 + dLen / max(dCap, 0.000001); // yumuşak tavan',
    '',
    '  /* 3) TASARIM KOORDINAT DONUSUMU (serbest konum + açı + skew) */',
    '  vec2 pA = vec2(v_uv.x * u_A, v_uv.y) + vec2(disp.x * u_A, disp.y);',
    '  vec2 q = pA - u_dcenter;',
    '  q.x -= q.y * u_skew.x;',
    '  q.y -= q.x * u_skew.y;',
    '  vec2 rq = vec2(u_rot.x * q.x + u_rot.y * q.y, -u_rot.y * q.x + u_rot.x * q.y);',
    '  vec2 local = rq / u_dhalf + 0.5;',
    '',
    '  /* 4) kenarda yumuşak sönümleme (testere/kırılma yok) */',
    '  vec2 ef = smoothstep(0.0, 0.01, local) * (1.0 - smoothstep(0.99, 1.0, local));',
    '  float edge = ef.x * ef.y;',
    '',
    '  vec2 duv = clamp(local, 0.0, 1.0);',
    '  vec4 design = texture2D(u_design, duv);',
    '  float da = design.a * edge;',
    '  if (da < 0.003) { gl_FragColor = shirt; return; }',
    '',
    '  /* 5) ISIK / GOLGE COMPOSITING (shader ici) */',
    '  vec3 dc = design.rgb;',
    '  float shadeMul = 1.0 - u_shading * (1.0 - clamp(lum * 1.15, 0.0, 1.0));',
    '  vec3 shaded = dc * shadeMul;',
    '  float hi = clamp((lum - 0.62) / 0.38, 0.0, 1.0);',
    '  shaded += shaded * hi * u_shading * 0.5;',
    '  if (u_mode > 1.5)      shaded = dc * shadeMul;',
    '  else if (u_mode < 0.5) shaded = dc;',
    '',
    '  /* 6) TASARIMI KUMASA GOM */',
    '  gl_FragColor = vec4(mix(shirt.rgb, shaded, da), shirt.a);',
    '}'
  ].join('\n');

  /* ================= GPU BAGLAMI (tekil, yeniden kullanilir) ================= */
  var E = null; // { canvas, gl, U, shirtTex, designTex, designKey }

  function buildEngine() {
    if (E) return E;
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: true })
          || canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    if (!gl) return null;
    function shader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[MockupEngine] Shader derlenemedi:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }
    var vs = shader(gl.VERTEX_SHADER, VS_SRC);
    var fs = shader(gl.FRAGMENT_SHADER, FS_SRC);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[MockupEngine] Program link hatası:', gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['u_shirt', 'u_design', 'u_texel', 'u_A', 'u_dcenter', 'u_dhalf', 'u_rot',
     'u_skew', 'u_intensity', 'u_blur', 'u_shading', 'u_mode'].forEach(function (n) {
      U[n] = gl.getUniformLocation(prog, n);
    });
    E = { canvas: canvas, gl: gl, U: U, shirtTex: null, designTex: null, designEl: null };
    return E;
  }

  function destroyTextures() {
    if (!E) return;
    if (E.shirtTex) { E.gl.deleteTexture(E.shirtTex); E.shirtTex = null; }
    if (E.designTex) { E.gl.deleteTexture(E.designTex); E.designTex = null; }
    E.designEl = null;
  }

  // Büyük fotoğrafları GPU'ya göndermeden önce kaliteli biçimde küçült
  // (sessiz texImage2D hatalarını ve pikselliği engeller)
  function prepare(src, maxSide) {
    var w = src.naturalWidth || src.width, h = src.naturalHeight || src.height;
    var k = Math.min(1, maxSide / Math.max(w, h));
    var c = document.createElement('canvas');
    c.width = Math.max(2, Math.round(w * k));
    c.height = Math.max(2, Math.round(h * k));
    var cx = c.getContext('2d');
    cx.imageSmoothingEnabled = true;
    cx.imageSmoothingQuality = 'high';
    cx.drawImage(src, 0, 0, c.width, c.height);
    return c;
  }

  function makeTex(unit, src) {
    var gl = E.gl;
    var t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    return t;
  }

  /* ================= RENDER ================= */
  // Sabit motor ayarları (kullanıcıya ayar yükü yok — otomatik optimum)
  var ENGINE_SETTINGS = { intensity: 12, blur: 3, shading: 0.70, mode: 1 };

  // w,h: hedef çıktı piksel boyutu. Tasarım getDesign() üzerinden ekran
  // koordinatlarında gelir; tam çözünürlükte oransal olarak ölçeklenir.
  function drawToGL(w, h) {
    if (!S || !S.shirtPrepared || !buildEngine()) return false;
    var gl = E.gl, U = E.U;
    if (E.canvas.width !== Math.round(w) || E.canvas.height !== Math.round(h)) {
      E.canvas.width = Math.max(2, Math.round(w));
      E.canvas.height = Math.max(2, Math.round(h));
    }
    gl.viewport(0, 0, E.canvas.width, E.canvas.height);

    if (!E.shirtTex) E.shirtTex = makeTex(0, S.shirtPrepared);

    var d = S.getDesign ? S.getDesign() : null;
    var hasDesign = !!(d && d.el && d.w > 0 && d.h > 0);
    if (hasDesign && E.designEl !== d.el) {
      if (E.designTex) E.gl.deleteTexture(E.designTex);
      E.designTex = makeTex(1, prepare(d.el, 2048));
      E.designEl = d.el;
    }

    gl.uniform1i(U.u_shirt, 0);
    gl.uniform1i(U.u_design, 1);
    gl.uniform2f(U.u_texel, 1 / S.shirtPrepared.width, 1 / S.shirtPrepared.height);
    gl.uniform1f(U.u_A, w / h);

    // Tasarım yerleşimi: ekran pikseli (px,py) -> (px/h, py/h).
    // getDesign() ekran (dispW x dispH) koordinatı verir; s = çözünürlük ölçeği.
    var s = w / S.dispW;
    if (hasDesign) {
      var ang = ((d.angle || 0) * Math.PI) / 180;
      gl.uniform2f(U.u_dcenter, (d.cx * s) / h, (d.cy * s) / h);
      gl.uniform2f(U.u_dhalf, (d.w * s) / (2 * h), (d.h * s) / (2 * h));
      gl.uniform2f(U.u_rot, Math.cos(ang), Math.sin(ang));
      gl.uniform2f(U.u_skew, Math.tan(((d.yaw || 0) * Math.PI) / 180),
                            Math.tan(((d.pitch || 0) * Math.PI) / 180));
    } else {
      // tasarım yok: görünmez yerleşim
      gl.uniform2f(U.u_dcenter, -10, -10);
      gl.uniform2f(U.u_dhalf, 0.0001, 0.0001);
      gl.uniform2f(U.u_rot, 1, 0);
      gl.uniform2f(U.u_skew, 0, 0);
    }

    gl.uniform1f(U.u_intensity, ENGINE_SETTINGS.intensity);
    gl.uniform1f(U.u_blur, ENGINE_SETTINGS.blur);
    gl.uniform1f(U.u_shading, ENGINE_SETTINGS.shading);
    // fabric "multiply" harmanı seçiliyse shader multiply-only moduna geçer
    gl.uniform1f(U.u_mode, hasDesign && d.blend === 1 ? 2 : ENGINE_SETTINGS.mode);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return true;
  }

  function copyTo2D(w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(2, Math.round(w));
    c.height = Math.max(2, Math.round(h));
    c.getContext('2d').drawImage(E.canvas, 0, 0, c.width, c.height);
    return c;
  }

  /* ================= DURUM / attach ================= */
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
    destroyTextures(); // yeni tişört: eski GPU dokularını bırak
    S = {
      img: opts.img,
      // GPU'ya göndermeden önce kaliteli küçültme (MAX_TEXTURE_SIZE güvencesi)
      shirtPrepared: prepare(opts.img, 1800),
      natW: opts.natW, natH: opts.natH,
      dispW: opts.dispW, dispH: opts.dispH,
      id: opts.id || 'model', quad: quad,
      wrap: opts.wrap, getDesign: opts.getDesign || null,
      onQuadChange: opts.onQuadChange || null,
      editing: false
    };
    if (opts.forceQuad) lsSet('avci_quad_' + S.id, JSON.stringify(S.quad));
    if (S.editing || opts.wrap.querySelector('.engine-handles')) buildHandles();
  }

  /* ---------- tam çözünürlük render (dışa aktarma) ---------- */
  function canRender() {
    return !!(S && S.shirtPrepared && buildEngine());
  }
  function render() {
    if (!canRender()) return null;
    // tasarım yerleşimi ekran (dispW) koordinatındandır -> natW'ye ölçekle
    if (!drawToGL(S.natW, S.natH)) return null;
    return copyTo2D(S.natW, S.natH);
  }

  /* ---------- canlı önizleme (edit modaline GPU katmanı) ---------- */
  // hedef 2D canvas'a GPU çıktısını çizer; her tasarım değişiminde çağır.
  function renderPreview(targetCanvas, maxW) {
    if (!S || !S.shirtPrepared || !buildEngine()) return false;
    var k = Math.min(1, (maxW || 900) / S.natW);
    var w = Math.round(S.natW * k), h = Math.round(S.natH * k);
    if (!drawToGL(w, h)) return false;
    targetCanvas.width = w; targetCanvas.height = h;
    targetCanvas.getContext('2d').drawImage(E.canvas, 0, 0);
    return true;
  }

  /* ---------- admin: sürüklenebilir 4 köşe anchor (JSON için) ---------- */
  function buildHandles() {
    if (!S || !S.wrap) return;
    let box = S.wrap.querySelector('.engine-handles');
    if (box) box.remove();
    box = document.createElement('div');
    box.className = 'engine-handles';
    box.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:30;';
    for (let i = 0; i < 4; i++) {
      (function (i) {
        const h = document.createElement('div');
        h.className = 'engine-handle';
        h.style.cssText = 'position:absolute;width:14px;height:14px;margin:-7px 0 0 -7px;' +
          'background:rgba(255,80,80,.85);border:2px solid #fff;border-radius:50%;' +
          'pointer-events:auto;cursor:move;';
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

  /* ---------- temizlik ---------- */
  function detach() { destroyTextures(); S = null; }

  window.MockupEngine = {
    attach: attach, render: render, canRender: canRender,
    enableCorners: enableCorners, getQuadJSON: getQuadJSON,
    downloadQuadJSON: downloadQuadJSON, detach: detach,
    mountPreview: renderPreview, renderPreview: renderPreview
  };
})();

