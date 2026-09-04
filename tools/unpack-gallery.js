/* ============================================================
   unpack-gallery.js — git binary'si olmadan pack dosyasından
   görselleri geri yükler (node zlib ile packfile okur).
   Yalnızca 'görsel' ve 'görsel-thumb' klasörlerini çıkarır.
   Kullanım: node tools/unpack-gallery.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const OBJ = path.join(ROOT, '.git', 'objects');

/* ---------- loose obje ---------- */
function readLoose(sha) {
  const p = path.join(OBJ, sha.slice(0, 2), sha.slice(2));
  if (!fs.existsSync(p)) return null;
  const raw = zlib.inflateSync(fs.readFileSync(p));
  const nul = raw.indexOf(0);
  const type = raw.slice(0, nul).toString().split(' ')[0];
  return { type, data: raw.slice(nul + 1) };
}

/* ---------- delta uygula ---------- */
function applyDelta(base, delta) {
  let p = 0;
  function varint() {
    let r = 0, sh = 0, b;
    do { b = delta[p++]; r |= (b & 0x7f) << sh; sh += 7; } while (b & 0x80);
    return r >>> 0;
  }
  varint();               // base boyut (bilgi)
  const resultSize = varint();
  const out = Buffer.alloc(resultSize);
  let o = 0;
  while (p < delta.length) {
    const op = delta[p++];
    if (op & 0x80) {      // copy
      let cpOff = 0, cpSize = 0;
      if (op & 0x01) cpOff |= delta[p++];
      if (op & 0x02) cpOff |= delta[p++] << 8;
      if (op & 0x04) cpOff |= delta[p++] << 16;
      if (op & 0x08) cpOff |= delta[p++] << 24;
      if (op & 0x10) cpSize |= delta[p++];
      if (op & 0x20) cpSize |= delta[p++] << 8;
      if (op & 0x40) cpSize |= delta[p++] << 16;
      if (cpSize === 0) cpSize = 0x10000;
      base.copy(out, o, cpOff, cpOff + cpSize);
      o += cpSize;
    } else if (op) {      // insert
      delta.copy(out, o, p, p + op);
      p += op; o += op;
    } else {
      throw new Error('gecersiz delta op');
    }
  }
  return out;
}

/* ---------- pack + index yukle ---------- */
const packs = [];
for (const f of fs.readdirSync(path.join(OBJ, 'pack'))) {
  if (f.endsWith('.idx')) {
    const prefix = f.slice(0, -4);
    const idx = fs.readFileSync(path.join(OBJ, 'pack', f));
    const pack = fs.readFileSync(path.join(OBJ, 'pack', prefix + '.pack'));
    if (idx.readUInt32BE(0) !== 0xff744f63) { console.log('IDX v1 atlandi:', f); continue; }
    const fanoutOff = 8;
    const n = idx.readUInt32BE(fanoutOff + 255 * 4);
    const shaOff = fanoutOff + 256 * 4;
    const crcOff = shaOff + n * 20;
    const offOff = crcOff + n * 4;
    const bigOff = offOff + n * 4;
    const map = new Map();
    for (let i = 0; i < n; i++) {
      let sha = '';
      for (let j = 0; j < 20; j++) sha += idx[shaOff + i * 20 + j].toString(16).padStart(2, '0');
      let off = idx.readUInt32BE(offOff + i * 4);
      if (off & 0x80000000) off = Number(idx.readBigUInt64BE(bigOff + (off & 0x7fffffff) * 8));
      map.set(sha, off);
    }
    packs.push({ pack, map, resolved: new Map() });
    console.log('Pack yuklendi: ' + f + ' (' + n + ' obje, ' + Math.round(pack.length / 1048576) + ' MB)');
  }
}

/* ---------- pack icinden obje coz ---------- */
function readPackObj(P, off, depth) {
  depth = depth || 0;
  if (P.resolved.has(off)) return P.resolved.get(off);
  if (depth > 60) throw new Error('delta zinciri cok derin');
  const pack = P.pack;
  let p = off;
  let b = pack[p++];
  const type = (b >> 4) & 7;
  let size = b & 0x0f, shift = 4;
  while (b & 0x80) { b = pack[p++]; size |= (b & 0x7f) << shift; shift += 7; }
  let r;
  if (type >= 1 && type <= 4) {
    const data = zlib.inflateSync(pack.subarray(p));
    r = { type: ['commit', 'tree', 'blob', 'tag'][type - 1], data };
    if (type !== 3) P.resolved.set(off, r); // blob'lari cache'leme (bellek)
  } else if (type === 6) { // OFS_DELTA
    b = pack[p++];
    let rel = b & 0x7f;
    while (b & 0x80) { b = pack[p++]; rel = ((rel + 1) << 7) | (b & 0x7f); }
    const base = readPackObj(P, off - rel, depth + 1);
    const data = applyDelta(base.data, zlib.inflateSync(pack.subarray(p)));
    r = { type: base.type, data };
    P.resolved.set(off, r);
  } else if (type === 7) { // REF_DELTA
    let sha = '';
    for (let j = 0; j < 20; j++) sha += pack[p++].toString(16).padStart(2, '0');
    const base = readObj(sha, depth + 1);
    const data = applyDelta(base.data, zlib.inflateSync(pack.subarray(p)));
    r = { type: base.type, data };
    P.resolved.set(off, r);
  } else {
    throw new Error('bilinmeyen pack tipi: ' + type);
  }
  return r;
}

function readObj(sha, depth) {
  const loose = readLoose(sha);
  if (loose) return loose;
  for (const P of packs) {
    const off = P.map.get(sha);
    if (off !== undefined) return readPackObj(P, off, depth);
  }
  throw new Error('obje bulunamadi: ' + sha);
}

/* ---------- tree parse ---------- */
function parseTree(data) {
  const entries = [];
  let p = 0;
  while (p < data.length) {
    const sp = data.indexOf(32, p);
    const mode = data.slice(p, sp).toString();
    const nul = data.indexOf(0, sp);
    const name = data.slice(sp + 1, nul).toString('utf8');
    const sha = data.slice(nul + 1, nul + 21).toString('hex');
    entries.push({ mode, name, sha });
    p = nul + 21;
  }
  return entries;
}

/* ---------- HEAD -> commit -> kok agac ---------- */
function resolveRef(refName) {
  const p = path.join(ROOT, '.git', ...refName.split('/'));
  if (fs.existsSync(p)) {
    const v = fs.readFileSync(p, 'utf8').trim();
    if (/^[0-9a-f]{40}$/.test(v)) return v;
  }
  const packed = path.join(ROOT, '.git', 'packed-refs');
  if (fs.existsSync(packed)) {
    for (const l of fs.readFileSync(packed, 'utf8').split(/\r?\n/)) {
      const m = l.match(/^([0-9a-f]{40}) (.+)$/);
      if (m && m[2].trim() === refName) return m[1];
    }
  }
  return null;
}

function collectRefShas() {
  const out = [];
  const refsDir = path.join(ROOT, '.git', 'refs');
  (function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, f.name);
      if (f.isDirectory()) walk(fp);
      else {
        const v = fs.readFileSync(fp, 'utf8').trim();
        if (/^[0-9a-f]{40}$/.test(v)) out.push(v);
      }
    }
  })(refsDir);
  const packed = path.join(ROOT, '.git', 'packed-refs');
  if (fs.existsSync(packed)) {
    for (const l of fs.readFileSync(packed, 'utf8').split(/\r?\n/)) {
      const m = l.match(/^([0-9a-f]{40}) /);
      if (m) out.push(m[1]);
    }
  }
  return out;
}

let ref = fs.readFileSync(path.join(ROOT, '.git', 'HEAD'), 'utf8').trim();
let headSha = null;
if (ref.startsWith('ref: ')) {
  headSha = resolveRef(ref.slice(5).trim());
} else if (/^[0-9a-f]{40}$/.test(ref)) {
  headSha = ref;
}
if (!headSha) {
  // ref dosyalari yoksa: okunabilen ilk commit'i bul (tum ref sha'larini dene)
  for (const sha of collectRefShas()) {
    try {
      const c = readObj(sha);
      if (c.type === 'commit') { headSha = sha; break; }
    } catch (e) { /* bu sha cozulemedi, devam */ }
  }
}
if (!headSha) {
  console.log('HATA: hicbir commit bulunamadi (ref dosyalari + packed-refs bos).');
  process.exit(1);
}
console.log('HEAD commit: ' + headSha);
const commit = readObj(headSha);
const treeSha = commit.data.toString('utf8').match(/^tree ([0-9a-f]{40})/m)[1];
const rootTree = parseTree(readObj(treeSha).data);

/* ---------- yalnizca gorsel klasorlerini geri yukle ---------- */
let written = 0, bytes = 0;
function writeTree(entries, dirPrefix) {
  const dir = path.join(ROOT, dirPrefix);
  fs.mkdirSync(dir, { recursive: true });
  for (const e of entries) {
    if (e.mode === '40000') {
      writeTree(parseTree(readObj(e.sha).data), dirPrefix + '/' + e.name);
    } else {
      const obj = readObj(e.sha);
      fs.writeFileSync(path.join(ROOT, dirPrefix, e.name), obj.data);
      written++; bytes += obj.data.length;
    }
  }
  console.log('Klasor tamam: ' + dirPrefix);
}

const wanted = rootTree.filter((e) => e.mode === '40000' && (e.name === 'görsel' || e.name === 'görsel-thumb'));
if (!wanted.length) {
  console.log('HATA: kok agacta görsel/görsel-thumb bulunamadi. Kok agac: ' + rootTree.map((e) => e.name).join(', '));
  process.exit(1);
}
for (const w of wanted) {
  writeTree(parseTree(readObj(w.sha).data), w.name);
}
console.log('BITTI: ' + written + ' dosya, ' + (bytes / 1048576).toFixed(1) + ' MB geri yuklendi.');


