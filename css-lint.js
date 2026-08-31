// Basit CSS saglik kontrolu (gecici arac)
const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');
const lines = css.split(/\r?\n/);
const out = [];

// 1) Ayrac dengesi
let depth = 0;
lines.forEach((l, i) => {
  for (const ch of l) {
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth < 0) { out.push('FAZLA KAPANIS satir ' + (i + 1) + ': ' + l.trim()); depth = 0; }
    }
  }
});
out.push('son derinlik: ' + depth);

// 2) Blok disinda kalan bildirimler (yetim satirlar)
depth = 0;
lines.forEach((l, i) => {
  const t = l.trim();
  const isDecl = /^[-a-zA-Z][\w-]*\s*:/.test(t) && !t.startsWith('//');
  if (depth === 0 && isDecl && !t.startsWith('@')) {
    out.push('BLOK DISI BILDIRIM satir ' + (i + 1) + ': ' + t);
  }
  for (const ch of l) {
    if (ch === '{') depth++;
    if (ch === '}') depth = Math.max(0, depth - 1);
  }
});

// 3) Gecersiz radial-gradient aci sozdizimi
lines.forEach((l, i) => {
  if (/radial-gradient\(\s*\d+deg/.test(l)) out.push('GECERSIZ radial-gradient acisi satir ' + (i + 1) + ': ' + l.trim());
});

// 4) Ayni isimde birden fazla @keyframes
const kf = {};
lines.forEach((l, i) => {
  const m = l.match(/@keyframes\s+([\w-]+)/);
  if (m) (kf[m[1]] = kf[m[1]] || []).push(i + 1);
});
Object.keys(kf).forEach((k) => {
  if (kf[k].length > 1) out.push('TEKRARLI @keyframes "' + k + '" satirlar: ' + kf[k].join(', '));
});

fs.writeFileSync('css-lint-report.txt', out.join('\n'), 'utf8');
console.log(out.join('\n'));
