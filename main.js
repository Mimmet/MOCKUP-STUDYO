/* ============================================================
   Mockup Stüdyo — Ana Uygulama Mantığı
   Fabric.js ile mockup düzenleme: manken galerisi, tasarım
   bindleme, dil çevirisi (TR/EN) ve görsel dışa aktarma.
   ============================================================ */
'use strict';

/* ---------------- Çeviri Sözlüğü ---------------- */
const TRANSLATIONS = {
  tr: {
    pageTitle: 'Mockup Studyo',
    dropHint: 'PNG / JPEG dosyanızı buraya sürükleyin',
    uploadTitle: 'Dosya Yükle',
    uploadSub: 'Tasarımınızı (PNG / JPEG) buraya sürükleyin veya tıklayıp seçin',
    selectDesign: 'Tasarım Seç',
    replaceHint: 'Tasarımı değiştirmek için tıklayın',
    toolbarInfo: 'Tasarım, aşağıdaki tüm mankenlere otomatik uygulanır.',
    removeDesign: 'Tasarımı Kaldır',
    favBtn: 'Favori Maketler',
    favPanelTitle: '♥ Favori Maketler',
    favEmpty: 'Henüz favori maket yok.',
    infoTitle: '🖼 Kaliteli Mockup İçin',
    infoStep1: 'PNG veya JPEG tasarımınızı seçin.',
    infoStep2: 'Şeffaf arka planlı dosya kullanın — arka plan otomatik temizlenmez.',
    infoStep3: 'Yüksek çözünürlük (en az 2000×2000 px) daha keskin sonuç verir.',
    infoStep4: 'Aşağıdan dilediğiniz mankeni seçerek tasarımı uygulayın.',
    infoNote: '💡 Hazır mockup 2000×2000 px PNG olarak indirilir.',
    galleryTitle: 'Manken Galerisi',
    addMannequin: '+ Manken Ekle',
    emptyState: 'Henüz manken görseli yok.',
    reviewBtn: '💬 Yorum Yap',
    reviewsTitle: '💬 Kullanıcı Yorumları',
    reviewTitle: 'Değerlendirmeniz',
    reviewPlaceholder: 'Düşüncelerinizi yazın...',
    reviewCancel: 'Vazgeç',
    reviewSave: 'Kaydet',
    reviewsEmpty: 'Henüz yorum yok. İlk yorumu sen yap! 💬',
    reviewNeedStars: 'En az 1 yıldız vermelisiniz.',
    reviewNeedText: 'Lütfen düşüncelerinizi yazın.',
    reviewConfirmDelete: 'Bu yorumu silmek istediğine emin misin?',
    loadingText: 'Mockup hazırlanıyor…',
    closeTitle: 'Kapat',
    themeTitle: 'Gece / Gündüz Modu',
    editTitle: 'Maketi Düzenle',
    editSub: 'Tasarımı sürükleyerek konumlandırın',
    sizeLabel: 'Boyut',
    angleLabel: 'Açı',
    yawLabel: 'Yana Eğim',
    pitchLabel: 'Yukarı-Aşağı Eğim',
    shopLabel: '📐 FORMAT 2000×2000',
    formatFixed: '📐 FORMAT 2000×2000',
    formatSub: 'Etsy listelemeye uygun',
    designBtn: '🖼 Tasarım Seç',
    recenterBtn: '⟲ Otomatik Yerleştir',
    applyBtn: 'Uygula',
    modalHint: '💡 Tasarımı sürükleyerek manken üzerinde istediğiniz yere yerleştirin.',
    dlTitle: 'Ücretsiz İndirme',
    dlSub: 'Mockup hazırlanıyor',
    dlMsg: 'Ücretsiz indirmek için kısa videoyu izleyin',
    adStatus: 'Lütfen bekleyin…',
    dlDone: 'Mockup indiriliyor…',
    bottomAdText: 'Reklamınız burada görünebilir — bize ulaşın',
    dlCancel: 'Vazgeç',
    privacyLink: 'Gizlilik Politikası',
    privacyFixedText: 'Gizlilik Politikası: Kişisel verileriniz Google AdSense çerezleriyle korunur.',
    privacyFullLink: 'Politiği Oku ›',
    termsLink: 'Kullanım Şartları',
    disclaimerLink: 'Feragatname',
    contactLink: 'İletişim',
    contactLabel: 'contact@mockupstudio.com',
    contentTitle: 'Mockup Studyo: Ücretsiz Online Mockup Oluşturucu',
    contentPara1: 'Mockup Studyo, online mağazalarında ürün satan girişimciler, zanaatkârlar ve küçük işletmeler için tasarlanmış, tamamen ücretsiz ve tarayıcıda çalışan bir mockup oluşturma aracıdır. Karmaşık tasarım yazılımlarına veya pahalı aboneliklere gerek kalmadan, kendi logo veya görselinizi seçip saniyeler içinde profesyonel görünümlü ürün görselleri hazırlayabilirsiniz. Tüm işlemler doğrudan tarayıcınızda gerçekleşir; dosya yüklemek için hesap açmanıza veya ek bir program kurmanıza gerek yoktur.',
    contentPara2: 'Bu araç özellikle tişört, hoodie, sweatshirt ve benzeri tekstil ürünleri üzerinde tasarımlarınızı denemek için idealdir. Tasarımınızı yükleyin, galeriden dilediğiniz mankeni seçin ve uygulayın; sonuç 2000×2000 piksel, ürün sayfalarınız için uygun yüksek çözünürlüklü bir PNG dosyası olarak indirilir. Böylece ürün listelemeleriniz için gerçekçi, satışı artıran görselleri ücretsiz oluşturabilirsiniz.',
    contentSub1: 'Neden Mockup Studyo?',
    contentPara3: 'Ücretsiz ve sınırsız kullanım sayesinde kaç mockup isterseniz oluşturun. Arayüz sade ve anlaşılırdır; tasarımı sürükleyip bırakarak konumlandırabilir, boyut, açı ve eğim gibi ince ayarları tek tıkla değiştirebilirsiniz. Favori maketlerinizi kaydederek sık kullandığınız görselleri kolayca yeniden düzenleyebilirsiniz. Dilerseniz koyu tema ile de çalışabilirsiniz.',
    contentSub2: 'Nasıl Çalışır?',
    contentPara4: 'Süreç çok basittir: İlk olarak PNG veya JPEG tasarımınızı seçin. Yüksek çözünürlük ve şeffaf arka plan, daha keskin ve profesyonel sonuçlar elde etmenize yardımcı olur. Ardından galeriden beğendiğiniz mankeni seçin; tasarımınız seçilen tüm mankenlere otomatik olarak uygulanır. Konum ve açıyı ayarlayıp Uygula düğmesine bastıktan sonra en iyi kareyi seçerek PNG olarak indirin.',
    contentSub3: 'Ürün Görselleri İçin İpuçları',
    contentPara5: 'Ürününüzü gerçek bir model veya manken üzerinde göstermek, alıcıların ürünü hayal etmesine yardımcı olur ve tıklama oranınızı artırır. İlk görseliniz net ve çekici olsun; yüksek çözünürlüklü görseller her zaman daha güvenilir görünür. Tasarımınızın ürünün boyutuna ve şekline uygun olduğundan emin olun ve farklı renkler için ayrı mockup hazırlayın. Doğru aydınlatma ve açı seçimiyle ürününüzün en iyi yönlerini öne çıkarabilirsiniz.',
    contentPara6: 'Mockup Studyo tamamen ücretsizdir ve reklam gelirleriyle desteklenir. Aracı rahatça kullanabilir, dilediğiniz kadar görsel oluşturabilirsiniz. Siteyle ilgili sorularınız için iletişim sayfamızdan bize ulaşabilirsiniz. İyi satışlar dileriz!'
  },
  en: {
    pageTitle: 'Mockup Studio',
    dropHint: 'Drag & drop your PNG / JPEG file here',
    uploadTitle: 'Upload File',
    uploadSub: 'Drag your design (PNG / JPEG) here or click to select',
    selectDesign: 'Select Design',
    replaceHint: 'Click to change the design',
    toolbarInfo: 'The design is applied to all mannequins below automatically.',
    removeDesign: 'Remove Design',
    favBtn: 'Favorite Mockups',
    favPanelTitle: '♥ Favorite Mockups',
    favEmpty: 'No favorite mockups yet.',
    infoTitle: '🖼 For a High-Quality Mockup',
    infoStep1: 'Choose your design as PNG or JPEG.',
    infoStep2: 'Use a file with a transparent background — the background is not removed automatically.',
    infoStep3: 'Higher resolution (at least 2000×2000 px) gives sharper results.',
    infoStep4: 'Select any mannequin below and apply your design.',
    infoNote: '💡 The finished mockup is downloaded as a 2000×2000 px PNG.',
    galleryTitle: 'Mannequin Gallery',
    addMannequin: '+ Add Mannequin',
    emptyState: 'No mannequin images yet.',
    reviewBtn: '💬 Write a Review',
    reviewsTitle: '💬 User Reviews',
    reviewTitle: 'Your Rating',
    reviewPlaceholder: 'Write your thoughts...',
    reviewCancel: 'Cancel',
    reviewSave: 'Save',
    reviewsEmpty: 'No reviews yet. Be the first! 💬',
    reviewNeedStars: 'Please give at least 1 star.',
    reviewNeedText: 'Please write your thoughts.',
    reviewConfirmDelete: 'Are you sure you want to delete this review?',
    loadingText: 'Preparing mockup…',
    closeTitle: 'Close',
    themeTitle: 'Night / Day Mode',
    editTitle: 'Edit Mockup',
    editSub: 'Drag the design to position it',
    sizeLabel: 'Size',
    angleLabel: 'Angle',
    yawLabel: 'Side Tilt',
    pitchLabel: 'Up-Down Tilt',
    shopLabel: '📐 FORMAT 2000×2000',
    formatFixed: '📐 FORMAT 2000×2000',
    formatSub: 'Suitable for Etsy listing',
    designBtn: '🖼 Choose Design',
    recenterBtn: '⟲ Auto Position',
    applyBtn: 'Apply',
    modalHint: '💡 Drag the design onto the mannequin.',
    dlTitle: 'Free Download',
    dlSub: 'Preparing mockup',
    dlMsg: 'Watch a short video to download for free',
    adStatus: 'Please wait…',
    dlDone: 'Downloading mockup…',
    bottomAdText: 'Your ad could be here — contact us to advertise',
    dlCancel: 'Cancel',
    privacyLink: 'Privacy Policy',
    privacyFixedText: 'Privacy Policy: Your data is protected with Google AdSense cookies.',
    privacyFullLink: 'Read Policy ›',
    termsLink: 'Terms of Service',
    disclaimerLink: 'Disclaimer',
    contactLink: 'Contact',
    contactLabel: 'contact@mockupstudio.com',
    contentTitle: 'Mockup Studyo: Free Online Mockup Generator',
    contentPara1: 'Mockup Studyo is a completely free, browser-based mockup generator built for entrepreneurs, crafters, and small businesses selling products in their online stores. Without the need for complex design software or paid subscriptions, you can select your own logo or artwork and create professional-looking product images in seconds. Everything runs directly in your browser — no account is required and there is nothing to install.',
    contentPara2: 'This tool is ideal for previewing your designs on t-shirts, hoodies, sweatshirts, and other textile products. Upload your design, choose any mannequin from the gallery, and apply it; the result is downloaded as a high-resolution 2000×2000 px PNG, perfect for your product pages. Create realistic, conversion-friendly product photos for your listings at no cost.',
    contentSub1: 'Why Mockup Studyo?',
    contentPara3: 'Use it as much as you want, completely free. The interface is simple and intuitive: drag and drop your design into place, then fine-tune size, angle, and tilt with a single click. Save your favorite mockups to quickly re-edit the images you use most. You can also switch to dark theme whenever you like.',
    contentSub2: 'How It Works',
    contentPara4: 'The process is very simple. First, choose your design as a PNG or JPEG; high resolution and a transparent background help produce sharper, more professional results. Next, select a mannequin from the gallery and your design is applied to all chosen mannequins automatically. Adjust the position and angle, press Apply, then pick your best frame and download it as a PNG.',
    contentSub3: 'Tips for Product Photos',
    contentPara5: 'Showing your product on a real model or mannequin helps buyers imagine it and can boost your click-through rate. Make your first image clear and eye-catching — high-resolution photos always look more trustworthy. Make sure your design fits the product size and shape, and create separate mockups for different colors. With the right lighting and angle, you can highlight the best features of your product.',
    contentPara6: 'Mockup Studyo is completely free and supported by advertising revenue. Use it freely and create as many images as you like. If you have any questions, feel free to reach out through our contact page. Happy selling!'
  }
};
let currentLang = 'en';

/* ---------------- Yardımcılar ---------------- */
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
function uid() {
  return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function fabricReady() {
  return typeof fabric !== 'undefined' && typeof fabric.Canvas === 'function';
}

/* ---------------- Durum ---------------- */
// Varsayılan olarak galeriye eklenecek manken görselleri (boyut ve format değiştirilmez).
const DEFAULT_MANNEQUINS = [
  'adfe.png',
  'Adsırgrz tasarım.png',
  'Adsıwerwz tasarım.png',
  'Adsız regtasarım.png',
  'Adsız tafrfrsarım.png',
  'Adsız tafrfsarım.png',
  'Adsız tarfregsarım.png',
  'Adsız tasacvfrım.png',
  'Adsız tasadfsrım.png',
  'Adsız tasaefrrım.png',
  'Adsız tasareerrım.png',
  'Adsız tasaregerrım.png',
  'Adsız tasarerım.png',
  'Adsız tasarg5etım.png',
  'Adsız tasargfhtım.png',
  'Adsız tasargrerım.png',
  'Adsız tasarım.png',
  'Adsız tasasfrım.png',
  'Adsız tasartgeım.png',
  'Adsız tasartwrım.png',
  'Adsız tasatg5erım.png',
  'Adsız taswrfarım.png',
  'Adsız tathtrsarım.png',
  'Adsız tatyrtsarım.png',
  'Adsız tdfosasarım.png',
  'Adsız tdfsasarım.png',
  'Adsız tgetasarım.png',
  'Adsız tgregegasarım.png',
  'asdjfsf.png',
  'ddcscds.png',
  'ddsc.png',
  'dfdes.png',
  'dfs.png',
  'dfsekf.png',
  'dfskgs.png',
  'dlfskf.png',
  'dmznfn.png',
  'dncsd.png',
  'dsf.png',
  'dsfd.png',
  'dsfdg.png',
  'dsfds.png',
  'dsfdsfl.png',
  'dsfdskf.png',
  'dsfes.png',
  'dsfesfe.png',
  'dsfsd.png',
  'dsfsf.png',
  'dsfsrf.png',
  'dsgfdg.png',
  'dsgffg.png',
  'ejjfıeje.png',
  'fdgd.png',
  'fgklfdmgl.png',
  'fgrd.png',
  'fsfrgf.png',
  'ghbrhf.png',
  'kvdjfea.png',
  'ldvd.png',
  'rgtry.png',
  'sddffgskg.png',
  'sfgdg.png',
  'sfgjfj.png',
  'sfgjıdg.png',
  'sfhsr.png',
  'sfrf.png',
  'vff.png',
  'vfrsv.png',
    'zcsd.png',
  'zdfs.png',
  // --- Klasöre eklenen yeni görseller ---
  'bdfgdgr.png',
  'dfghjklşlt.png',
  'dgthtd.png',
  'dkfgokreoger.png',
  'erGJtgdtgeths.png',
  'eryutryffoosae.png',
  'ewujfuerg.png',
  'fdgdfg.png',
  'fdgfhdyf.png',
  'fdgfhyjut.png',
  'fgre.png',
  'fgsthyhj.png',
  'gfgtrjkuoı.png',
  'ghryry.png',
  'ghtge.png',
  'ghyyf.png',
  'gjnerfw3rfes.png',
  'gtg.png',
  'gtsrhtyjun.png',
  'hntyjuyu.png',
  'jgıojerıt.png',
  'reegtrhryg.png',
  'rejgetjgoıjteg.png',
  'rfgerg.png',
  'rgftghtrht.png',
  'rgketrgke.png',
  'rjfgerjgre.png',
  'rtgrgerdged.png',
  'rtgtrh.png',
  'sdfghjk.png',
  'sfgdg.png',
  'sfkvrkgre.png',
  'sfregrtd.png',
  'tgtryt.png'
];
let mannequins = [];   // { id, name, src, cardEl }
let design = null;     // { name, dataUrl, img: HTMLImageElement }
let activeCardIndex = null;
let activeDesignObj = null;   // Modal içinde sürüklenen tasarım objesi
let designBaseScale = 1;      // tasarımın açılıştaki ölçeği (slider %100'ü budur)
let engineQuad = null;        // Tişört yüzeyi (görünmez, sadece perspektif render için)
let modalCanvas = null;
let modalCardId = null;
let dlTimer = null;
let downloading = false;     // indirme akışı sürerken buton spam koruması
let dlCancelPending = false; // kullanıcı indirmeyi iptal etti mi

/* ---------------- Dil Değiştirme ---------------- */
function setLang(lang) {
  currentLang = (lang === 'en') ? 'en' : 'tr';
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.tr;
  document.documentElement.lang = currentLang === 'tr' ? 'tr' : 'en';
  $$('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  $$('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.setAttribute('placeholder', t[key]);
  });
  $$('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (t[key]) el.setAttribute('title', t[key]);
  });
  if (t.pageTitle) document.title = t.pageTitle;
  const code = $('#lang-wheel-code');
  if (code) code.textContent = currentLang.toUpperCase();
  // Dil değişince dinamik listeler de yeni dille yeniden çizilsin
  if (typeof renderReviews === 'function') renderReviews();
  try { localStorage.setItem('mockup_lang', currentLang); } catch (e) { /* sessiz */ }
}

function applyStoredLang() {
  let stored = null;
  try { stored = localStorage.getItem('mockup_lang'); } catch (e) { /* sessiz */ }
  // Ana dil İngilizce: kayıtlı tercih yoksa veya 'tr' değilse EN
  setLang(stored === 'tr' ? 'tr' : 'en');
}

/* ---------------- Manken Galerisi ---------------- */
function updateGalleryState() {
  const es = $('#empty-state');
  if (es) es.style.display = mannequins.length ? 'none' : '';
}

// Kart: sadece görsel gösterir, orijinal boyut/format korunur.
function makeCard(m) {
  const card = document.createElement('div');
  card.className = 'mannequin-card mannequin-clickable';
  card.dataset.id = m.id;

  const holder = document.createElement('div');
  holder.className = 'mannequin-holder';

  const img = document.createElement('img');
  img.className = 'mannequin-img';
  img.alt = m.name || 'Manken';
  // Performans: galeride önce küçük thumbnail'i göster; kullanıcı maketi seçince
  // tam çözünürlüklü orijinal render'da yüklenir. Yüklenemezse orijinale düş.
  img.loading = 'lazy';
  img.decoding = 'async';
  img.fetchPriority = 'low';
  img.src = m.thumbSrc || m.src;

  // Görsel yüklenemezse: önce thumbnail yüklenememişse tam çözünürlük dene (bir kez),
  // o da yüklenemezse konsola yaz ve kartı gizleme (kırık ikon yerine mesaj göster).
  img.addEventListener('error', () => {
    const full = m.src;
    if (img.src !== full && full && !img.dataset.fellback) {
      img.dataset.fellback = '1';
      img.src = full;
      return;
    }
    console.warn('[Manken] Görsel yüklenemedi:', m.src);
    holder.textContent = '⚠ Görsel yüklenemedi';
    holder.style.cssText = 'color:#f87171;font-size:.8rem;text-align:center;padding:20px;';
  });
  img.addEventListener('load', () => {
    console.info('[Manken] Görsel yüklendi:', m.src);
  });

  holder.appendChild(img);

  // Favori kalbi (sağ alt köşe): tıklayınca içi dolar/boşalır
  const favBtn = document.createElement('button');
  favBtn.type = 'button';
  favBtn.className = 'fav-btn' + (isFavorite(m) ? ' active' : '');
  favBtn.setAttribute('aria-label', 'Favori');
  favBtn.innerHTML = isFavorite(m) ? '♥' : '♡';
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(m);
  });
  card.appendChild(favBtn);

  card.appendChild(holder);
  card.addEventListener('click', () => openModal(card, m));
  return card;
}

function buildCard(m) {
  return makeCard(m);
}

function renderCard(m, container) {
  const grid = container || $('#mannequin-grid');
  const card = buildCard(m);
  m.cardEl = card;
  grid.appendChild(card);
  updateGalleryState();
  return card;
}

function removeMannequin(id) {
  const idx = mannequins.findIndex((m) => m.id === id);
  if (idx === -1) return;
  const m = mannequins[idx];
  if (m.cardEl) m.cardEl.remove();
  mannequins.splice(idx, 1);
  updateGalleryState();
}

function loadMannequinSrc(src, name, container) {
  // Aynı URL daha önce eklendiyse kopya koruması: tekrar ekleme.
  if (seenSrcs.has(src)) {
    console.info('[Manken] Aynı URL kopyası atlandı (loadMannequinSrc):', name, '->', src);
    return null;
  }
  seenSrcs.add(src);
  const id = uid();
  const m = { id, name: name || '', src, cardEl: null, fav: isFavorite({ src }) };
  mannequins.push(m);
  renderCard(m, container);
  return m;
}

/* ---------------- Favoriler ---------------- */
const FAV_KEY = 'avci_favorites';

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(list) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('[Favori] localStorage yazılamadı:', e);
  }
  updateFavCount();
}

// Bir kart/bileşen favori mi? src dizesine göre karşılaştır.
function isFavorite(m) {
  if (!m || !m.src) return false;
  return getFavorites().indexOf(m.src) !== -1;
}

function setFavButtonState(m, btn) {
  const fav = isFavorite(m);
  if (btn) {
    btn.classList.toggle('active', fav);
    btn.innerHTML = fav ? '♥' : '♡';
  }
  if (m) m.fav = fav;
}

function toggleFavorite(m) {
  let favs = getFavorites();
  const idx = favs.indexOf(m.src);
  if (idx === -1) favs.push(m.src);
  else favs.splice(idx, 1);
  saveFavorites(favs);

  // Kart üzerindeki kalbi güncelle
  if (m.cardEl) {
    const btn = m.cardEl.querySelector('.fav-btn');
    setFavButtonState(m, btn);
  }

  // Panel açıksa listeyi canlı yenile
  const panel = $('#fav-panel');
  if (panel && !panel.classList.contains('hidden')) renderFavPanel();
}

function updateFavCount() {
  const countEl = $('#fav-count');
  if (countEl) countEl.textContent = getFavorites().length;
}

function renderFavPanel() {
  const body = $('#fav-panel-body');
  if (!body) return;
  const favs = getFavorites();
  body.innerHTML = '';

  if (!favs.length) {
    body.innerHTML = '<div class="fav-empty" data-i18n="favEmpty">Henüz favori maket yok.</div>';
    setLang(currentLang);
    return;
  }

  favs.forEach((src) => {
    // ilgili manken objesini bul (resim yolu değişebilir)
    const m = mannequins.find((x) => x.src === src) || { id: null, src, name: '' };
    const item = document.createElement('div');
    item.className = 'fav-item';

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'fav-thumb';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.fetchPriority = 'low';
    img.src = src;
    img.alt = m.name || 'Favori maket';
    thumbWrap.appendChild(img);

    const name = document.createElement('span');
    name.className = 'fav-item-name';
    name.textContent = (m.name || String(src).split('/').pop() || 'Favori maket').slice(0, 60);

    const rm = document.createElement('button');
    rm.type = 'button';
    rm.className = 'fav-remove';
    rm.title = 'Kaldır';
    rm.innerHTML = '✕';
    rm.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(m);
    });

    // Tıklanınca: tasarım varsa modalı aç
    item.addEventListener('click', () => {
      toggleFavPanel(false);
      if (m.id && mannequins.find((x) => x.id === m.id)) {
        openModal(m.cardEl || null, m);
      }
    });

    item.appendChild(thumbWrap);
    item.appendChild(name);
    item.appendChild(rm);
    body.appendChild(item);
  });
}

function toggleFavPanel(force) {
  const panel = $('#fav-panel');
  if (!panel) return;
  const shouldOpen = typeof force === 'boolean' ? force : panel.classList.contains('hidden');
  panel.classList.toggle('hidden', !shouldOpen);
  if (shouldOpen) renderFavPanel();
}

// Navbar'daki favori butonu + panel dışına tıklayınca kapanma
function bindFavEvents() {
  const btn = $('#fav-toggle-btn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavPanel();
    });
  }
  document.addEventListener('click', (e) => {
    const panel = $('#fav-panel');
    if (!panel || panel.classList.contains('hidden')) return;
    if (!e.target.closest('.navbar-actions')) toggleFavPanel(false);
  });
  updateFavCount();
}

// Tişört GÖĞÜS bölgesi analizi: en büyük ön plan bileşeninin satır profilinden
// (doluluk + span + orta nokta) omuz hattını, eteği ve göğüs merkezini bulur.
// Dönen değerler görsele göre normalize edilmiştir (0-1):
//   cx, cy     -> GÖĞÜS merkezi (baskı merkezi)
//   boxW, boxH -> göğüs bölgesi SINIRI (tasarım buraya oturtulur)
// Geometri şüpheliyse null döner (detectProduct yedeğe düşer).
function analyzeTorso(aw, ah, isFg, best) {
  const x0 = best.minx, y0 = best.miny;
  const W = best.maxx - best.minx + 1, H = best.maxy - best.miny + 1;
  if (W < 10 || H < 20) return null;

  // 1) Satır profili: span (min..max), dolu piksel sayısı ve satır ortası
  const rowSpan = new Array(H).fill(0);
  const rowCnt = new Array(H).fill(0);
  const rowMid = new Array(H).fill(0);
  for (let y = 0; y < H; y++) {
    let mn = -1, mx = -1, cnt = 0;
    for (let x = 0; x < W; x++) {
      if (isFg(x0 + x, y0 + y)) {
        if (mn < 0) mn = x;
        mx = x; cnt++;
      }
    }
    if (mn >= 0) { rowSpan[y] = mx - mn + 1; rowCnt[y] = cnt; rowMid[y] = mn + mx; }
  }
  let maxW = 0;
  for (let y = 0; y < H; y++) if (rowSpan[y] > maxW) maxW = rowSpan[y];
  if (maxW < 10) return null;

  // 2) Omuz hattı: üstte span'ın ilk kez maxW'nin %55'ini geçtiği satır
  //    (yaka/kafa/askı dar olduğundan omuzlar net biçimde "genişler")
  let shoulderY = -1;
  const shoulderLimit = Math.floor(H * 0.6);
  for (let y = 0; y <= shoulderLimit; y++) {
    if (rowSpan[y] >= maxW * 0.55) { shoulderY = y; break; }
  }
  if (shoulderY < 0) return null;

  // 3) Etek: alttan gelen ilk "geniş ve dolu" satır (bacak/pantolon boşluklarını atla)
  let hemY = -1;
  for (let y = H - 1; y > shoulderY; y--) {
    if (rowSpan[y] >= maxW * 0.4 && rowCnt[y] >= rowSpan[y] * 0.55) { hemY = y; break; }
  }
  if (hemY < 0) return null;

  // 4) Gövde boyu sınırı: pantolon/uzun taşmaları kırp
  const torsoH = Math.min(hemY - shoulderY, Math.round(maxW * 1.45));
  if (torsoH < maxW * 0.4) return null;

  // 5) Göğüs merkezi: omuzdan gövde boyunun ~%34'ü aşağıda (DTG standardı)
  const chestY = shoulderY + Math.round(torsoH * 0.34);

  // 6) Göğüs genişliği + merkez x: chestY çevresindeki satırların medyanı
  const band = Math.max(1, Math.round(torsoH * 0.06));
  const yA = Math.max(0, chestY - band), yB = Math.min(H - 1, chestY + band);
  const widths = [], mids = [];
  for (let y = yA; y <= yB; y++) {
    if (rowSpan[y] > 0) widths.push(rowSpan[y]);
    if (rowCnt[y] > 0) mids.push(rowMid[y] / 2);
  }
  if (widths.length < 3 || mids.length < 3) return null;
  widths.sort((a, b) => a - b);
  const bodyW = widths[Math.floor(widths.length / 2)];
  if (bodyW < maxW * 0.3) return null;
  mids.sort((a, b) => a - b);
  const bodyCx = mids[Math.floor(mids.length / 2)];

  // 7) GÖĞÜS BÖLGESİ (merkez/ölçü için) + TÜM TİŞÖRT yüzeyi (render quad için):
  //    cx/cy, boxW/boxH = göğüs bölgesi; qcx/qcy/qw/qh = tüm tişört (görünmez
  //    perspektif yüzeyi). Kullanıcı serbestçe yerleştirir, motor yüzeye basar.
  const pw = Math.min(bodyW * 0.62, maxW * 0.66);
  const ph = Math.min(pw * 1.16, torsoH * 0.55);
  if (pw < 8 || ph < 8) return null;
  const qTop = Math.max(0, shoulderY - Math.round(torsoH * 0.07)); // yaka payı
  const qBot = Math.min(H - 1, shoulderY + torsoH);                // etek

  return {
    // göğüs bölgesi (skorlama / bilgi)
    cx: Math.max(0.3, Math.min(0.7, (x0 + bodyCx) / aw)),
    cy: Math.max(0.24, Math.min(0.78, (y0 + chestY) / ah)),
    boxW: Math.max(0.16, Math.min(0.6, pw / aw)),
    boxH: Math.max(0.14, Math.min(0.5, ph / ah)),
    // tüm tişört yüzeyi (motor quad'ı)
    qcx: Math.max(0.15, Math.min(0.85, (x0 + bodyCx) / aw)),
    qcy: Math.max(0.12, Math.min(0.88, (y0 + (qTop + qBot) / 2) / ah)),
    qw: Math.max(0.3, Math.min(0.9, maxW / aw)),
    qh: Math.max(0.28, Math.min(0.85, (qBot - qTop + 1) / ah))
  };
}

/* ---------------- Tasarımı Tüm Maketlere Uygula ---------------- */
// Dayanıklı tişört algılama piplinesi:
// 1) Şeffaf PNG kesimlerinde ALFA kanalı maskesi kullanılır (en güvenilir yol).
// 2) Opak fotoğrafta: kenar medyan renginden renk-uzaklık haritası çıkarılır;
//    Otsu + birkaç eşik denenir, her eşikteki TÜM bağlantılı bileşenler
//    toplanır ve "tişört benzerliği" skoruyla en iyi aday seçilir
//    (tek eşik + tek 'en büyük bileşen' hatası ortadan kalkar).
// 3) Gövde geometrisi (analyzeTorso) çıkamazsa bileşen kutusundan güvenli
//    göğüs tahmini yapılır; hiçbir şey bulunamazsa null döner (çağıran
//    varsayılan göğüs kutusu kullanır).

// Otsu eşikleme: uzaklık histogramı üzerinden iki sınıf varyansını maksimize eden
// eşiği bulur. Kare (squared) uzaklık biriminde eşik döndürür.
function otsuThreshold(dist2) {
  const hist = new Array(256).fill(0);
  const n = dist2.length;
  for (let i = 0; i < n; i++) {
    const v = Math.min(255, Math.round(Math.sqrt(dist2[i])));
    hist[v]++;
  }
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0, wB = 0, maxVar = -1, bestT = 0;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = n - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB, mF = (sum - sumB) / wF;
    const v = wB * wF * (mB - mF) * (mB - mF);
    if (v > maxVar) { maxVar = v; bestT = t; }
  }
  return bestT * bestT;
}

// Bileşen "tişört benzerliği" skoru. Yüksek skor = manken/tişört görünümü.
function scoreComponent(b, aw, ah, hasTorso) {
  const w = b.maxx - b.minx + 1, h = b.maxy - b.miny + 1;
  const frac = b.cnt / (aw * ah);
  if (frac < 0.015) return -Infinity;
  const cx = ((b.minx + b.maxx) / 2) / aw;
  const cy = ((b.miny + b.maxy) / 2) / ah;
  const ar = h / w;
  let s = 0;
  // Boyut: neredeyse tüm kareyi kaplayan bölge = arka plan, ceza
  if (frac > 0.9) s -= 25;
  else s += Math.min(frac / 0.3, 1) * 10;
  // Görüntü genişliğinin önemli kısmını kaplar (tee/manken kalıbı)
  const wF = w / aw;
  if (wF >= 0.35) s += 6; else if (wF >= 0.2) s += 2; else s -= 6;
  // En/boy oranı: dikey giysi ~1.1-3.5
  if (ar >= 1.1 && ar <= 3.5) s += 8; else if (ar >= 0.8 && ar < 1.1) s += 2; else s -= 8;
  // Yatayda ortalanma (mockup fotoğrafları genelde merkezdedir)
  s += Math.max(0, 1 - Math.abs(cx - 0.5) / 0.5) * 6;
  if (cy >= 0.15 && cy <= 0.85) s += 3; else s -= 6;
  // Görüntü merkezini kaplıyor mu
  const cxM = aw / 2, cyM = ah * 0.5;
  if (b.minx <= cxM && b.maxx >= cxM && b.miny <= cyM && b.maxy >= cyM) s += 5;
  // Gövde geometrisi çözülebildiyse güçlü bonus
  if (hasTorso) s += 18;
  return s;
}

// Verilen ikili maskeden tüm bileşenleri topla; en iyi skorluyu seç ve göğüs
// sınırını hesapla.  { score, result:{cx,cy,boxW,boxH} } döner, sonuç yoksa null.
function pickFromMask(aw, ah, m) {
  const area = aw * ah;
  const seen = new Uint8Array(area);
  const comps = [];
  for (let y0 = 0; y0 < ah; y0++) {
    for (let x0 = 0; x0 < aw; x0++) {
      if (seen[y0 * aw + x0] || !m[y0 * aw + x0]) continue;
      const stack = [[x0, y0]];
      seen[y0 * aw + x0] = 1;
      let minx = x0, maxx = x0, miny = y0, maxy = y0, cnt = 0, sx = 0, sy = 0;
      while (stack.length) {
        const [x, y] = stack.pop();
        cnt++; sx += x; sy += y;
        if (x < minx) minx = x; if (x > maxx) maxx = x;
        if (y < miny) miny = y; if (y > maxy) maxy = y;
        if (x + 1 < aw && !seen[y * aw + (x + 1)] && m[y * aw + (x + 1)]) { seen[y * aw + (x + 1)] = 1; stack.push([x + 1, y]); }
        if (x - 1 >= 0 && !seen[y * aw + (x - 1)] && m[y * aw + (x - 1)]) { seen[y * aw + (x - 1)] = 1; stack.push([x - 1, y]); }
        if (y + 1 < ah && !seen[(y + 1) * aw + x] && m[(y + 1) * aw + x]) { seen[(y + 1) * aw + x] = 1; stack.push([x, y + 1]); }
        if (y - 1 >= 0 && !seen[(y - 1) * aw + x] && m[(y - 1) * aw + x]) { seen[(y - 1) * aw + x] = 1; stack.push([x, y - 1]); }
      }
      if (cnt >= area * 0.004) comps.push({ cnt, minx, maxx, miny, maxy, sx, sy });
    }
  }
  if (!comps.length) return null;
  const isFg = (x, yy) => m[yy * aw + x] > 0;
  let best = null, bestScore = -Infinity;
  for (let i = 0; i < comps.length; i++) {
    const b = comps[i];
    const torso = analyzeTorso(aw, ah, isFg, b);
    const sc = scoreComponent(b, aw, ah, !!torso);
    if (sc > bestScore) { bestScore = sc; best = { b, torso }; }
  }
  if (!best || bestScore < 4) return null;
  const b = best.b;
  if (best.torso) return { score: bestScore, result: best.torso };
  // Gövde geometrisi çıkamadı: bileşen kutusundan güvenli göğüs tahmini
  const w = b.maxx - b.minx + 1, h = b.maxy - b.miny + 1;
  const cx = ((b.minx + b.maxx) / 2) / aw;
  const chestCy = Math.max(0.22, Math.min(0.78, (b.miny + h * 0.42) / ah));
  const boxW = Math.min(Math.max((w / aw) * 0.55, 0.16), 0.6);
  const boxH = Math.min(Math.max((h / ah) * 0.42, 0.14), 0.5);
  return {
    score: bestScore,
    result: {
      cx, cy: chestCy, boxW, boxH,
      qcx: Math.max(0.15, Math.min(0.85, cx)),
      qcy: Math.max(0.12, Math.min(0.88, chestCy)),
      qw: Math.max(0.3, Math.min(0.9, w / aw)),
      qh: Math.max(0.28, Math.min(0.85, h / ah))
    }
  };
}

function detectProduct(img, size) {
  const w0 = img.naturalWidth || img.width || 1000;
  const h0 = img.naturalHeight || img.height || 1000;
  const sLimit = Math.min(size || 220, Math.max(w0, h0));
  const r = w0 / h0;
  let aw, ah;
  if (r >= 1) { aw = sLimit; ah = Math.max(Math.round(sLimit / r), 8); }
  else { ah = sLimit; aw = Math.max(Math.round(sLimit * r), 8); }
  const c = document.createElement('canvas');
  c.width = aw; c.height = ah;
  const cx0 = c.getContext('2d', { willReadFrequently: true });
  try { cx0.drawImage(img, 0, 0, aw, ah); } catch (e) { return null; }
  let id;
  try { id = cx0.getImageData(0, 0, aw, ah); } catch (e) { return null; }
  const data = id.data;
  const area = aw * ah;
  const B = 4;

  // ---- Şeffaf (kesilmiş PNG) arka plan: alfa kanalı maskesi (en güvenilir) ----
  let edgeT = 0, edgeN = 0;
  for (let y = 0; y < ah; y++) {
    for (let x = 0; x < aw; x++) {
      if (x < B || y < B || x >= aw - B || y >= ah - B) {
        edgeN++;
        if (data[(y * aw + x) * 4 + 3] < 120) edgeT++;
      }
    }
  }
  if (edgeN > 0 && edgeT / edgeN > 0.5) {
    const m = new Uint8Array(area);
    for (let p = 0; p < area; p++) m[p] = data[p * 4 + 3] > 110 ? 1 : 0;
    const det = pickFromMask(aw, ah, m);
    if (det) return det.result;
    return null;
  }

  // ---- Opak fotoğraf: renk uzaklığı haritası + çoklu eşik ---- //
  const P = (x, y) => {
    const i = (y * aw + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  // Arka plan: kenardaki piksellerin ortanca (medyan) rengi
  const edge = [];
  for (let y = 0; y < ah; y++) {
    for (let x = 0; x < aw; x++) {
      if (x < B || y < B || x >= aw - B || y >= ah - B) edge.push(P(x, y));
    }
  }
  if (!edge.length) return null;
  const med = (arr) => arr.slice().sort((a, b) => a - b)[Math.floor(arr.length / 2)];
  const bgr = med(edge.map((p) => p[0]));
  const bgg = med(edge.map((p) => p[1]));
  const bgb = med(edge.map((p) => p[2]));

  const dist2 = new Float32Array(area);
  let dSum = 0;
  for (let y = 0; y < ah; y++) {
    for (let x = 0; x < aw; x++) {
      const p = P(x, y);
      const dr = p[0] - bgr, dg = p[1] - bgg, db = p[2] - bgb;
      const d2 = dr * dr + dg * dg + db * db;
      dist2[y * aw + x] = d2;
      dSum += d2;
    }
  }
  const meanD = dSum / area;
  const otsu = otsuThreshold(dist2);

  // Birkaç eşik denenir; en iyi "tişört benzeri" bileşen kazanır.
  const ths = [];
  if (isFinite(otsu) && otsu > 0) ths.push(otsu, otsu * 0.45, otsu * 0.2);
  ths.push(Math.max(20 * 20, meanD * 1.1), Math.max(16 * 16, meanD * 0.5));

  let best = null, bestScore = -Infinity;
  for (let ti = 0; ti < ths.length; ti++) {
    const th = ths[ti];
    const m = new Uint8Array(area);
    let fgCount = 0;
    for (let p = 0; p < area; p++) {
      if (dist2[p] > th) { m[p] = 1; fgCount++; }
    }
    if (fgCount < area * 0.01) continue;
    const d = pickFromMask(aw, ah, m);
    if (d && d.score > bestScore) { bestScore = d.score; best = d; }
  }
  if (best) return best.result;

  // En kötü senaryo: kontrastsız arka plan, belirgin bileşen yok
  return null;
}

// Görsel yolunu hazırla: Türkçe karakter ve boşlukları güvenli kodla.
function mannequinPath(file) {
  return 'görsel/' + encodeURIComponent(file);
}

// Küçük galeri önizlemesi (thumbnail) yolunu hazırla.
// Orijinal PNG'ler birkaç MB iken thumb ('görsel/thumbs') ~30-60KB'dır;
// galeri bunları gösterir, tam çözünürlük yalnızca render sırasında yüklenir.
function thumbPath(file) {
  const base = String(file).replace(/\.[^.]+$/, '');
  return 'görsel/thumbs/' + encodeURIComponent(base + '.jpg');
}

// Görsel parmak izi: küçük 8x8 tuvale indirip gri ton dizisi üretir.
// Aynı görselin farklı isimli kopyaları aynı parmak izini üretir.
function computeFingerprint(img) {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 8;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, 8, 8);
  const d = ctx.getImageData(0, 0, 8, 8).data;
  let fp = '';
  for (let i = 0; i < d.length; i += 4) {
    fp += Math.round(((d[i] + d[i + 1] + d[i + 2]) / 3) / 32) + ',';
  }
  return fp;
}

const seenFingerprints = new Set();
// Aynı URL'ye sahip görselin ikinci kez eklenmesini engeller.
const seenSrcs = new Set();

// Yolları sırayla dener; yüklenen görsel daha önce eklendiyse (aynı görünümlü
// kopya veya aynı URL) galeriye eklemeden atlar.
function tryLoadMannequin(paths, name, idx, opts) {
  if (idx >= paths.length) return;
  const img = new Image();
  img.onload = () => {
    // Kanonik kimlik = tam çözünürlüklü dosya (favoriler & render bunu kullanır).
    const canonSrc = (opts && opts.fullSrc) || img.src;
    if (seenSrcs.has(canonSrc)) {
      console.info('[Manken] Aynı URL kopyası atlandı:', name, '->', canonSrc);
      updateGalleryState();
      return;
    }
    seenSrcs.add(canonSrc);

    let fp = '';
    try { fp = computeFingerprint(img); } catch (e) { /* CORS vb. → kontrol yok */ }
    if (fp && seenFingerprints.has(fp)) {
      console.info('[Manken] Aynı görsel kopyası atlandı (fingerprint):', name);
      updateGalleryState();
      return;
    }
    if (fp) seenFingerprints.add(fp);

    // İlk yol thumbnail ise galeride onu kullan; yüklenemezse (idx>0) tam çözünürlük.
    const isThumb = !!(opts && opts.thumbSrc && idx === 0);
    const m = {
      id: uid(),
      name,
      src: canonSrc,                                // tam çözünürlük (render/favori)
      thumbSrc: isThumb ? opts.thumbSrc : canonSrc, // galeri kartı önizlemesi
      cardEl: null,
      fav: isFavorite({ src: canonSrc })
    };
    mannequins.push(m);
    renderCard(m);
    updateGalleryState();
  };
  img.onerror = () => tryLoadMannequin(paths, name, idx + 1, opts);
  img.src = paths[idx];
}

// Varsayılan mankenler: önce küçük thumbnail'leri yüklenir (parmak izi + hızlı galeri),
// tam PNG yalnızca mockup render edilirken getirilir.
function seedDefaultMannequins() {
  DEFAULT_MANNEQUINS.forEach((file) => {
    const fullAbs = new URL(mannequinPath(file), location.href).href;
    const thumbAbs = new URL(thumbPath(file), location.href).href;
    const paths = [thumbPath(file), mannequinPath(file), 'görsel/' + file];
    tryLoadMannequin(paths, file.replace(/\.[^.]+$/, ''), 0, { fullSrc: fullAbs, thumbSrc: thumbAbs });
  });
  setTimeout(() => {
    console.info('[Manken] Galeride', mannequins.length, 'kart oluşturuldu (kopyalar atlandı).');
  }, 3000);
}

/* ---------------- Tasarım Yükleme ---------------- */
function showDesignPreview() {
  const ph = $('#drop-placeholder');
  const prev = $('#design-preview');
  ph.classList.add('hidden');
  prev.src = design.dataUrl || design.src;
  prev.classList.remove('hidden');
  // Tasarım yüklendi; maket seçiliyse (modal açıksa) o makete bind'i güncelle
  refreshModalDesign();
}

function clearDesign() {
  design = null;
  activeDesignObj = null;
  const prev = $('#design-preview');
  prev.classList.add('hidden');
  if (prev.src) prev.removeAttribute('src');
  const ph = $('#drop-placeholder');
  ph.classList.remove('hidden');
  const input = $('#design-upload');
  input.value = '';
  // Tasarım kaldırıldı; maket seçiliyse bind'i temizle
  refreshModalDesign();
}

// Modal açıksa, mevcut makette tasarımı yeniden bind eder (yoksa temizler).
function refreshModalDesign() {
  if (!modalCardId) return;
  const mm = modalCard();
  if (mm) initModalCanvas(mm);
}

function loadDesignSrc(src, name) {
  const img = new Image();
  img.onload = () => {
    design = { name: name || 'design', src, dataUrl: src, img };
    showDesignPreview();
  };
  img.onerror = () => { /* sessiz */ };
  img.src = src;
}

/* ---------------- Dosya Doğrulama (Güvenlik) ---------------- */
const ALLOWED_UPLOAD_TYPES = /^image\/(png|jpeg|webp)$/i;
const REJECTED_SVG_TYPE = /^image\/svg\+xml$/i;
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 MB

// Dosya tipi/boyut doğrulama. Hata yoksa null, aksi halde kullanıcıya gösterilecek mesaj döner.
function validateImageFile(file) {
  if (!file) return 'Dosya seçilmedi.';
  if (REJECTED_SVG_TYPE.test(file.type || '')) {
    return 'SVG dosyaları desteklenmez (güvenlik nedeniyle).';
  }
  if (!ALLOWED_UPLOAD_TYPES.test(file.type || '')) {
    return 'Sadece PNG, JPEG veya WebP görselleri desteklenir.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return 'Dosya çok büyük (maks. 100 MB).';
  }
  return null;
}

function readFileAsDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => rej(new Error('read-fail'));
    r.readAsDataURL(file);
  });
}

async function handleDesignFile(file) {
  const err = validateImageFile(file);
  if (err) { alert(err); return; }
  try {
    const dataUrl = await readFileAsDataURL(file);
    const img = new Image();
    img.onload = () => {
      design = { name: file.name, dataUrl, img };
      showDesignPreview();
    };
    img.onerror = () => {
      alert('Görsel yüklenemedi: dosya bozuk veya desteklenmeyebilir.');
      const input = $('#design-upload');
      if (input) input.value = '';
    };
    img.src = dataUrl;
  } catch (e) {
    alert('Dosya okunamadı.');
  }
}

/* ---------------- Dosya Yükleme Olayları ---------------- */
function bindUploadEvents() {
  const dropZone = $('#drop-zone');
  const fileInput = $('#design-upload');
  const selectBtn = $('#drop-placeholder .primary-btn');

  if (selectBtn) selectBtn.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach((ev) =>
    dropZone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragging');
    }));
  ['dragleave', 'drop'].forEach((ev) =>
    dropZone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragging');
    }));
  dropZone.addEventListener('drop', (e) => {
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleDesignFile(f); // tip / güvenlik kontrolü handleDesignFile içinde
  });
  // drop-zone tıklayınca da dosya seç
  dropZone.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    fileInput.click();
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) handleDesignFile(fileInput.files[0]);
    fileInput.value = ''; // aynı dosya tekrar seçilebilsin
  });

  const removeBtn = $('#remove-design');
  if (removeBtn) removeBtn.addEventListener('click', clearDesign);

  const addBtn = $('#add-mannequin');
  const manInput = $('#mannequin-upload');
  if (addBtn && manInput) addBtn.addEventListener('click', () => manInput.click());
  if (manInput) manInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => {
      const err = validateImageFile(f);
      if (err) { alert(err); return; }
      const reader = new FileReader();
      reader.onload = (r) => {
        const dataUrl = r.target.result;
        const id = uid();
        const m = { id, name: f.name, src: dataUrl, cardEl: null };
        mannequins.push(m);
        renderCard(m);
      };
      reader.onerror = () => alert('Görsel okunamadı.');
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  });
}

/* ---------------- Modal Düzenleme ---------------- */
function modalCard() {
  return mannequins.find((m) => m.id === modalCardId) || null;
}

function printAreaRect(bg) {
  const w = (bg.getScaledWidth && bg.getScaledWidth()) || bg.width;
  const h = (bg.getScaledHeight && bg.getScaledHeight()) || bg.height;
  return { x: 0, y: 0, w, h };
}

// Çerçeve yok: kesikli baskı alanı çizimi kaldırıldı (sadece görsel).
function drawPrintArea(bg) {
  if (!modalCanvas) return;
  modalCanvas.getObjects().forEach((o) => {
    if (o.id === 'printArea') modalCanvas.remove(o);
  });
  modalCanvas.requestRenderAll();
}

function getModalBackground() {
  if (!modalCanvas) return null;
  return modalCanvas.getObjects().find((o) => o.type === 'image' && o.selectable === false);
}

// Çerçeve yok: tasarım serbest hareket eder, hiçbir alana sınırlanmaz.
function clampDesignToPrintArea() {
  if (modalCanvas) modalCanvas.requestRenderAll();
}

function autoState() {
  if (!modalCanvas) return;
  modalCanvas.requestRenderAll();
}

function printArea() {
  autoState();
}

function syncModalControls() {
  if (!activeDesignObj) return;
  const sc = $('#modal-scale');
  const rt = $('#modal-rotate');
  const yw = $('#modal-yaw');
  const sv = $('#modal-scale-val');
  const rv = $('#modal-rotate-val');
  const yv = $('#modal-yaw-val');
  if (sc && sv) {
    // Slider görevidir: açılıştaki ölçeğe oranla yüzde
    const base = designBaseScale || 1;
    const pct = Math.max(10, Math.min(300, Math.round((activeDesignObj.scaleX / base) * 100)));
    sc.value = pct; sv.textContent = pct + '%';
  }
  if (rt && rv) {
    const r = Math.round((activeDesignObj.angle || 0) % 360);
    rt.value = r; rv.textContent = r + '°';
  }
  if (yw && yv) {
    const y = activeDesignObj.yaw || 0;
    yw.value = y; yv.textContent = y + '°';
  }
  const pch = $('#modal-pitch');
  const pv = $('#modal-pitch-val');
  if (pch && pv) {
    const p = activeDesignObj.pitch || 0;
    pch.value = p; pv.textContent = p + '°';
  }
}

function syncModalScale() {
  if (activeDesignObj) syncModalControls();
}

function setBlend() {
  if (!activeDesignObj) return;
  const b = $('#modal-blend');
  if (b && b.value === 'multiply') {
    activeDesignObj.globalCompositeOperation = 'multiply';
  } else {
    activeDesignObj.globalCompositeOperation = 'source-over';
  }
  if (modalCanvas) modalCanvas.requestRenderAll();
}

function collectModalState() {
  if (!activeDesignObj) return null;
  return {
    scaleX: activeDesignObj.scaleX,
    scaleY: activeDesignObj.scaleY,
    angle: activeDesignObj.angle,
    yaw: activeDesignObj.yaw || 0,
    pitch: activeDesignObj.pitch || 0,
    left: activeDesignObj.left,
    top: activeDesignObj.top,
    blend: $('#modal-blend') ? $('#modal-blend').value : 'source-over'
  };
}

// Serbest mod: tasarım hiçbir sınıra bağlanmaz; sadece yeniden çizer.
function clampToPrintBound() {
  if (modalCanvas) modalCanvas.requestRenderAll();
}

function initModalCanvas(m) {
  const canvasEl = $('#modal-canvas');
  const wrap = $('#modal-canvas-wrap');
  const loadingEl = $('#modal-loading');
  // Yükleme ekranı: mockup hazırlanırken kısa süre görünür.
  const MIN_LOADING_MS = 1000;
  const loadStart = Date.now();
  if (loadingEl) loadingEl.classList.remove('hidden');
  const finishLoading = () => {
    const wait = Math.max(0, MIN_LOADING_MS - (Date.now() - loadStart));
    setTimeout(() => { if (loadingEl) loadingEl.classList.add('hidden'); }, wait);
  };
  // Görseli yükle ve canvas'a çiz
  const img = new Image();
  img.src = m.src;
  img.onload = () => {
    const natW = img.naturalWidth || img.width || 1000;
    const natH = img.naturalHeight || img.height || 1000;
    const MAX_W = Math.max((wrap.clientWidth || 560) - 20, 300);
    const MAX_H = 520;
    const scale = Math.min(MAX_W / natW, MAX_H / natH, 1);
    const dispW = Math.max(Math.round(natW * scale), 2);
    const dispH = Math.max(Math.round(natH * scale), 2);

    if (modalCanvas) { modalCanvas.dispose(); modalCanvas = null; }
    canvasEl.width = dispW;
    canvasEl.height = dispH;
    if (!fabricReady()) { finishLoading(); return; }
    modalCanvas = new fabric.Canvas(canvasEl);
    // Serbest mod: tasarım hiçbir sınıra bağlı değil; sadece yeniden çizer.
    modalCanvas.on('object:moving', clampToPrintBound);
    modalCanvas.on('object:scaling', clampToPrintBound);
    modalCanvas.on('object:modified', clampToPrintBound);

    // Mockup Motoru bağlama yardımcısı: algılanan tişört yüzeyini engine quad
    // yapar (export perspektif warp + ışık/gölge burayı kullanır). Kullanıcıya
    // hiçbir çerçeve gösterilmez; kullanıcı tasarımı serbestçe sürükler.
    const mountEngine = (quad) => {
      if (!window.MockupEngine) return;
      const leftoverHandles = wrap.querySelector('.engine-handles');
      if (leftoverHandles) leftoverHandles.remove();
      MockupEngine.attach({
        img: img, natW: natW, natH: natH,
        dispW: dispW, dispH: dispH,
        id: (m.id || 'model'),
        forceQuad: true, // her açılışta taze algılama uygula (eski kayıt yok sayılır)
        defaultQuad: [
          { x: quad.x, y: quad.y },
          { x: quad.x + quad.w, y: quad.y },
          { x: quad.x + quad.w, y: quad.y + quad.h },
          { x: quad.x, y: quad.y + quad.h }
        ],
        getDesign: function () {
          if (!design || !activeDesignObj || !activeDesignObj._element) return null;
          const o = activeDesignObj;
          // originX/Y 'center' olduğu için left/top merkezdir; getCenterPoint
          // her origin ayarında gerçek merkezi verir (warp kaymasını önler).
          let ccx = o.left + (o.width * o.scaleX) / 2;
          let ccy = o.top + (o.height * o.scaleY) / 2;
          if (typeof o.getCenterPoint === 'function') {
            const cp = o.getCenterPoint();
            ccx = cp.x; ccy = cp.y;
          }
          return {
            el: o._element,
            cx: ccx,
            cy: ccy,
            w: o.width * o.scaleX,
            h: o.height * o.scaleY,
            angle: o.angle || 0,
            yaw: o.yaw || 0,
            pitch: o.pitch || 0
          };
        },
        onQuadChange: function (qn) {
          engineQuad = {
            x: qn[0].x * dispW, y: qn[0].y * dispH,
            w: (qn[1].x - qn[0].x) * dispW, h: (qn[3].y - qn[0].y) * dispH
          };
        }
      });
    };

    const bg = new fabric.Image(img);
    bg.selectable = false;
    bg.evented = false;
    bg.set({ left: 0, top: 0, scaleX: dispW / natW, scaleY: dispH / natH });
    bg.crossOrigin = 'anonymous';
    modalCanvas.add(bg);
    modalCanvas.sendToBack(bg);

    activeDesignObj = null;
    syncModalControls();

    // Tişörtü algıla -> görünmez yüzeyi (engine quad) ayarla. UI'da hiçbir
    // çerçeve gösterilmez; kullanıcı tasarımı istediği yere koyar.
    const det = detectProduct(img, 240);
    let quad;
    if (det) {
      const qcx = (det.qcx !== undefined ? det.qcx : det.cx);
      const qcy = (det.qcy !== undefined ? det.qcy : det.cy);
      const qw = det.qw || Math.max(0.3, Math.min(0.9, det.boxW * 2));
      const qh = det.qh || Math.max(0.28, Math.min(0.85, det.boxH * 2));
      quad = {
        x: Math.max(0, Math.min((qcx - qw / 2) * dispW, dispW - qw * dispW)),
        y: Math.max(0, Math.min((qcy - qh / 2) * dispH, dispH - qh * dispH)),
        w: Math.min(qw * dispW, dispW),
        h: Math.min(qh * dispH, dispH)
      };
    } else {
      quad = {
        x: dispW * 0.08, y: dispH * 0.10,
        w: dispW * 0.84, h: dispH * 0.72
      };
    }
    engineQuad = quad;

    // --- Mockup Motoru'nu bağla (perspektif + gölge + kumaş dokusu) ---
    mountEngine(engineQuad);

    if (design && design.dataUrl) {
      // Tasarımı mankenin tam ortasına koy; kullanıcı istediği yere sürükler.
      const fx = dispW / 2;
      const fy = dispH / 2;
      fabric.Image.fromURL(design.dataUrl, (obj) => {
        if (!obj) {
          console.error('[Modal] Tasarım fabric\'e yüklenemedi');
          finishLoading();
          return;
        }
        activeDesignObj = obj;
        const dr = obj.height / obj.width;
        // Açılış boyutu: canvas genişliğinin ~%40'ı (makul başlangıç).
        const fit = Math.min(dispW * 0.40, (dispH * 0.32) / dr);
        obj.set({
          originX: 'center', originY: 'center',
          left: fx,
          top: fy,
          scaleX: fit / obj.width,
          scaleY: fit / obj.width,
          angle: 0
        });
        designBaseScale = fit / obj.width; // slider %100'ü = bu açılış boyutu
        obj.hasControls = true;
        setBlend(); // kumaşa yedir (multiply doku işleme)
        modalCanvas.add(obj);
        modalCanvas.setActiveObject(obj);
        syncModalControls();
        modalCanvas.requestRenderAll();
        finishLoading(); // yerleşim tamam, yükleme ekranını kapat
      }, { crossOrigin: 'anonymous' });
    } else {
      finishLoading();
    }
    modalCanvas.requestRenderAll();
  };
  img.onerror = () => {
    console.error('Görsel yüklenemedi:', m.src);
    finishLoading();
  };
}

function bindModalControls() {
  const sc = $('#modal-scale');
  if (sc) sc.oninput = () => {
    if (!activeDesignObj) return;
    const v = Number(sc.value) / 100;
    const base = designBaseScale || 1;
    activeDesignObj.scaleX = base * v;
    activeDesignObj.scaleY = base * v;
    syncModalScale();
    if (modalCanvas) modalCanvas.requestRenderAll();
  };
  const rt = $('#modal-rotate');
  if (rt) rt.oninput = () => {
    if (!activeDesignObj) return;
    activeDesignObj.angle = Number(rt.value);
    const rv = $('#modal-rotate-val');
    if (rv) rv.textContent = Number(rt.value) + '°';
    if (modalCanvas) modalCanvas.requestRenderAll();
  };
  const yw = $('#modal-yaw');
  if (yw) yw.oninput = () => {
    if (!activeDesignObj) return;
    const deg = Number(yw.value);
    activeDesignObj.yaw = deg;
    // Canlı önizlemede dikey eksen eğmesi (skewX) ile görünür olsun.
    activeDesignObj.set({ skewX: deg });
    const yv = $('#modal-yaw-val');
    if (yv) yv.textContent = deg + '°';
    if (modalCanvas) modalCanvas.requestRenderAll();
  };
const pch = $('#modal-pitch');
  if (pch) pch.oninput = () => {
    if (!activeDesignObj) return;
    const deg = Number(pch.value);
    activeDesignObj.pitch = deg;
    // Canlı önizlemede yatay eksen eğmesi (skewY) ile görünür olsun.
    activeDesignObj.set({ skewY: deg });
    const pv = $('#modal-pitch-val');
    if (pv) pv.textContent = deg + '°';
    if (modalCanvas) modalCanvas.requestRenderAll();
  };
  // modal-blend HTML'de olmayabilir; varsa bağla
  const blend = $('#modal-blend');
  if (blend) blend.onchange = setBlend;
  const designBtn = $('#modal-design');
  if (designBtn) designBtn.addEventListener('click', () => {
    const fi = $('#design-upload');
    if (fi) fi.click();
  });
  const recenterBtn = $('#modal-recenter');
  if (recenterBtn) recenterBtn.addEventListener('click', () => {
    if (!activeDesignObj || !modalCanvas) return;
    // Tasarımı canvas (manken) ortasına geri getir.
    activeDesignObj.set({
      left: modalCanvas.getWidth() * 0.5,
      top: modalCanvas.getHeight() * 0.5
    });
    activeDesignObj.setCoords();
    autoState();
  });
  const applyBtn = $('#modal-apply');
  if (applyBtn) applyBtn.addEventListener('click', () => {
    if (!design) return;
    // Reklam + indirme akışını başlat. Modal açık kalır ki exportMockup
    // canlı canvas'tan çizim yapabilsin; indirme bitince modal kapatılır.
    startDownloadFlow();
  });
  const closeBtn = $('#modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  // Arka alana tıklayınca da kapat
  const overlay = $('#modal');
  if (overlay) overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  // ESC tuşu ile kapat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#modal').classList.contains('hidden')) closeModal();
  });
}

function openModal(card, m) {
  if (!fabricReady()) return;
  if (!design) return; // tasarım yokken edit sessizce açılmaz
  activeCardIndex = mannequins.findIndex((x) => x.id === m.id);
  modalCardId = m.id;
  $('#modal').classList.remove('hidden');
  // Edit ekranı açıkken üst reklam banneri görünsün
  const topAd = $('#top-ad-banner');
  if (topAd) topAd.classList.remove('hidden');
  document.body.classList.add('top-ad-visible');
  initModalCanvas(m);
}

function closeModal() {
  if (modalCanvas) {
    modalCanvas.dispose();
    modalCanvas = null;
  }
  // Edit ekranı kapanınca üst reklam bannerini gizle
  const topAd = $('#top-ad-banner');
  if (topAd) topAd.classList.add('hidden');
  document.body.classList.remove('top-ad-visible');
  // Motor singleton'ının eski görsel/tasarım referanslarını bırak (bellek temizliği).
  if (window.MockupEngine && typeof window.MockupEngine.detach === 'function') {
    window.MockupEngine.detach();
  }
  $('#modal').classList.add('hidden');
  activeDesignObj = null;
  activeCardIndex = null;
  modalCardId = null;
  designBaseScale = 1;
  engineQuad = null;
}

/* ---------------- Dışa Aktarma ---------------- */
// Sıra: 1) MockupEngine tam çözünürlük kompozit (perspektif warp + kumaş dokusu +
// gölge/ışık)  2) mağaza preset boyutuna sığdır  3) PNG/JPEG olarak indir.
async function exportMockup() {
  const m = modalCard();
  if (!m) return;

  // --- Sabit format: Etsy listeleme için 2000×2000 PNG ---
  const outW = 2000;
  const outH = 2000;
  const filetype = 'png';

  // 1) Tam çözünürlük kompozit üret
  let full = null;
  if (window.MockupEngine && MockupEngine.canRender()) {
    try { full = MockupEngine.render(); } catch (e) {
      console.error('[Export] MockupEngine render hatası:', e);
    }
  }
  if (!full) {
    // Motor yoksa/başarısızsa: canlı canvas'taki arka plan + tasarım (düz bindirme)
    const bgObj = getModalBackground();
    const el = bgObj && bgObj.getElement ? bgObj.getElement() : null;
    if (!el) return;
    full = document.createElement('canvas');
    full.width = el.naturalWidth || el.width || 1000;
    full.height = el.naturalHeight || el.height || 1000;
    const fx0 = full.getContext('2d');
    fx0.fillStyle = '#ffffff';
    fx0.fillRect(0, 0, full.width, full.height);
    fx0.drawImage(el, 0, 0, full.width, full.height);
    if (activeDesignObj && activeDesignObj._element) {
      const d = activeDesignObj;
      const dispW = modalCanvas ? modalCanvas.getWidth() : full.width;
      const s = full.width / dispW;
      // getCenterPoint: origin 'center' iken left/top zaten merkezdir
      let ccx = d.left + (d.width * d.scaleX) / 2;
      let ccy = d.top + (d.height * d.scaleY) / 2;
      if (typeof d.getCenterPoint === 'function') {
        const cp = d.getCenterPoint();
        ccx = cp.x; ccy = cp.y;
      }
      const cx = ccx * s;
      const cy = ccy * s;
      const dw = d.width * d.scaleX * s;
      const dh = d.height * d.scaleY * s;
      fx0.save();
      fx0.translate(cx, cy);
      fx0.rotate(((d.angle || 0) * Math.PI) / 180);
      if (d.globalCompositeOperation === 'multiply') fx0.globalCompositeOperation = 'multiply';
      fx0.drawImage(d._element, -dw / 2, -dh / 2, dw, dh);
      fx0.restore();
    }
  }

  // 2) Mağaza preset boyutuna sığdır (oran koru, ortala, beyaz zemin)
  const out = document.createElement('canvas');
  out.width = outW;
  out.height = outH;
  const ctx = out.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, outW, outH);
  const fit = Math.min(outW / full.width, outH / full.height);
  const drawW = full.width * fit;
  const drawH = full.height * fit;
  ctx.drawImage(full, (outW - drawW) / 2, (outH - drawH) / 2, drawW, drawH);

  // 3) İndir: tercihen toBlob + object URL (bellek dostu, revoke edilir).
  //    toBlob desteklenmiyorsa eski toDataURL yedek olarak kullanılır.
  const ext = filetype === 'jpeg' ? 'jpeg' : 'png';
  const mime = filetype === 'jpeg' ? 'image/jpeg' : 'image/png';
  let href = null;
  let objectUrl = null;
  try {
    if (typeof out.toBlob === 'function') {
      const blob = await new Promise((res, rej) => {
        try { out.toBlob((b) => (b ? res(b) : rej(new Error('blob-empty'))), mime); }
        catch (e) { rej(e); }
      });
      objectUrl = URL.createObjectURL(blob);
      href = objectUrl;
    } else {
      href = filetype === 'jpeg' ? out.toDataURL('image/jpeg', 0.92) : out.toDataURL('image/png');
    }
  } catch (e) {
    // file:// ile doğrudan açıldığında tarayıcı canvas'ı güvenilmez sayıp
    // dışa aktarmayı engeller; yerel sunucu (örn. Live Server) gerekir.
    console.error('[Export] dışa aktarma hatası:', e);
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    alert('İndirme tarayıcı güvenliği nedeniyle engellendi.\nLütfen projeyi yerel bir sunucuyla açın (örn. VS Code Live Server) ve tekrar deneyin.');
    return;
  }
  const a = document.createElement('a');
  a.href = href;
  a.download = 'mockup_' + (m.name || 'model').replace(/\.[^.]+$/, '').replace(/\W+/g, '_') + '_' + outW + 'x' + outH + '.' + ext;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 0);
  if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl), 1000); // bellek temizliği
}

function closeDownloadModal() {
  stopAdPlayback();
  $('#download-modal').classList.add('hidden');
}

// Reklam videosunu/geri sayımı durdurur (modal kapanırken çağrılır).
function stopAdPlayback() {
  if (dlTimer) { clearInterval(dlTimer); dlTimer = null; }
  const video = $('#ad-video');
  if (video) {
    try { video.pause(); } catch (e) { /* yoksay */ }
    video.onended = video.ontimeupdate = video.onerror = null;
  }
}

function setAdProgress(ratio) {
  const fill = $('#ad-progress-fill');
  if (fill) fill.style.width = Math.round(Math.min(1, Math.max(0, ratio)) * 100) + '%';
}

function setAdCountdown(text) {
  const el = $('#ad-countdown');
  if (el) el.textContent = text;
}

// Reklam akışı: Uygula → reklam videosu oynatılır → video bitince indirme başlar.
// assets/reklam.mp4 yoksa/oynatılamazsa 15 sn'lik geri sayım yedeği kullanılır.
function startDownloadFlow() {
  if (!design || !modalCard()) return; // sessiz: akış yoksa başlatma
  if (downloading) return;             // buton spam koruması: akış zaten sürüyor
  downloading = true;
  dlCancelPending = false;

  const applyBtn = $('#modal-apply');
  if (applyBtn) {
    applyBtn.disabled = true;           // akış sürerken yeniden başlatmayı engelle
    applyBtn.classList.add('loading');
  }

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.tr || {};
  const sub = $('#dl-subtitle');
  if (sub) sub.textContent = t.dlMsg || sub.textContent;
  const status = $('#ad-status');
  if (status) status.textContent = t.adStatus || status.textContent;

  // Modalı göster, ilerlemeyi sıfırla
  setAdProgress(0);
  setAdCountdown('15s');
  const vidEl = $('#ad-video');
  const phEl = $('#ad-video-placeholder');
  if (vidEl) vidEl.classList.remove('hidden');
  if (phEl) phEl.classList.add('hidden');
  $('#download-modal').classList.remove('hidden');

  // Video bitince (veya yedek geri sayım bitince) çağrılır: indir + kapat.
  const finishAndDownload = async () => {
    if (dlCancelPending) return;
    stopAdPlayback();
    setAdProgress(1);
    if (status) status.textContent = t.dlDone || status.textContent;
    try {
      await exportMockup(); // canlı edit canvas'ından çizim yapabilmek için modal açık kalır
    } catch (e) {
      console.error('[Download] dışa aktarma hatası:', e);
    }
    closeDownloadModal();
    closeModal(); // indirme bitti, edit canvas'ı kapat
    finishDownloadFlow(applyBtn);
  };

  // Geri sayım yedeği: video oynatılamazsa 15 sn bekletip indirir.
  const startCountdownFallback = () => {
    const video = $('#ad-video');
    if (video) video.classList.add('hidden');
    const ph = $('#ad-video-placeholder');
    if (ph) ph.classList.remove('hidden');

    const DURATION = 15;
    let left = DURATION;
    setAdCountdown(left + 's');
    dlTimer = setInterval(() => {
      if (dlCancelPending) { stopAdPlayback(); return; }
      left -= 1;
      setAdProgress(1 - left / DURATION);
      setAdCountdown(Math.max(0, left) + 's');
      if (left <= 0) finishAndDownload();
    }, 1000);
  };

  const video = $('#ad-video');
  if (!video) { startCountdownFallback(); return; }

  video.onerror = () => { if (!dlCancelPending) startCountdownFallback(); };
  video.onended = () => finishAndDownload();
  video.ontimeupdate = () => {
    if (video.duration && isFinite(video.duration) && video.duration > 0) {
      const remaining = Math.max(0, Math.ceil(video.duration - video.currentTime));
      setAdProgress(video.currentTime / video.duration);
      setAdCountdown(remaining + 's');
    }
  };

  video.currentTime = 0;
  const p = video.play();
  if (p && typeof p.catch === 'function') {
    // Otomatik oynatma engellenirse (muted değilse) kullanıcı etkileşimi
    // zaten var (buton tıklaması) ama garanti olsun diye sessiz başlat.
    p.catch(() => {
      video.muted = true;
      const retry = video.play();
      if (retry && typeof retry.catch === 'function') retry.catch(() => startCountdownFallback());
    });
  }
}

// İndirme akışını sonlandırıp butonları tekrar etkinleştirir.
function finishDownloadFlow(applyBtn) {
  downloading = false;
  dlCancelPending = false;
  if (applyBtn) {
    applyBtn.disabled = false;
    applyBtn.classList.remove('loading');
  }
}

/* --- Yeni nesil arka plan: büyük, zarif, canlı parçalar --- */
function spawnGeometricShapeLayers(container) {
  const rand = (a, b) => a + Math.random() * (b - a);
  container.innerHTML = '';

  const pieces = [
    // Dev renk küreleri — HER BİRİ FARKLI RENK
    ['bg-piece bg-piece--orb c-blue',   [440, 780]],
    ['bg-piece bg-piece--orb c-violet', [400, 720]],
    ['bg-piece bg-piece--orb c-pink',   [420, 760]],
    ['bg-piece bg-piece--orb c-teal',   [380, 700]],
    ['bg-piece bg-piece--orb c-amber',  [360, 660]],
    ['bg-piece bg-piece--orb c-green',  [340, 640]],
    ['bg-piece bg-piece--orb c-coral',  [320, 600]],
    ['bg-piece bg-piece--orb c-purple', [300, 560]],
    ['bg-piece bg-piece--orb c-cyan',   [280, 520]],
    ['bg-piece bg-piece--orb c-orange', [260, 480]],
    ['bg-piece bg-piece--orb c-rose',   [240, 440]],
    ['bg-piece bg-piece--orb c-indigo', [220, 420]],
    // Renkli şeritler — her biri farklı renk
    ['bg-piece bg-piece--ribbon r-blue',   [700, 1100]],
    ['bg-piece bg-piece--ribbon r-pink',   [640, 1000]],
    ['bg-piece bg-piece--ribbon r-teal',   [600, 950]],
    ['bg-piece bg-piece--ribbon r-orange', [560, 900]],
    // Büyük yavaş dönen halkalar
    ['bg-piece bg-piece--ring',         [340, 620]],
    ['bg-piece bg-piece--ring dashed',  [280, 520]],
    // Hafif cam paneller
    ['bg-piece bg-piece--panel', [260, 460]],
    ['bg-piece bg-piece--panel', [200, 380]]
  ];

  pieces.forEach(([cls, sizeRange], i) => {
    const el = document.createElement('div');
    el.className = cls;
    const size = Math.round(rand(sizeRange[0], sizeRange[1]));
    if (cls.indexOf('--ribbon') !== -1) {
      el.style.width = size + 'px';
      el.style.height = Math.round(size * rand(0.08, 0.16)) + 'px';
    } else {
      el.style.width = size + 'px';
      el.style.height = size + 'px';
    }
    el.style.left = rand(-12, 78).toFixed(1) + '%';
    el.style.top = rand(-12, 78).toFixed(1) + '%';
    // Her parça farklı faz ve hızda başlasın
    el.style.animationDelay = '-' + rand(0, 30).toFixed(2) + 's';
    el.style.animationDuration = (rand(18, 34)).toFixed(1) + 's, ' + (rand(10, 18)).toFixed(1) + 's';
    container.appendChild(el);
  });
}


/* --- Şekil etkileşimi: hover parlatır, tıklayınca parçalanıp yok olur --- */
const FRAGMENT_COLORS = [
  'rgba(56, 189, 248, 0.9)', 'rgba(129, 140, 248, 0.9)', 'rgba(232, 121, 249, 0.9)',
  'rgba(45, 212, 191, 0.9)', 'rgba(251, 191, 36, 0.9)', 'rgba(74, 222, 128, 0.9)',
  'rgba(251, 113, 133, 0.9)', 'rgba(192, 132, 252, 0.9)'
];

function randomizePiecePosition(piece) {
  piece.style.left = (Math.random() * 90 - 12).toFixed(1) + '%';
  piece.style.top = (Math.random() * 90 - 12).toFixed(1) + '%';
}

function burstPiece(piece, cx, cy) {
  const container = document.getElementById('geometric-bg');
  if (!container) return;
  const COUNT = 18;
  for (let i = 0; i < COUNT; i++) {
    const f = document.createElement('div');
    f.className = 'bg-fragment';
    const size = 6 + Math.random() * 12;
    f.style.width = size + 'px';
    f.style.height = size + 'px';
    f.style.left = (cx - size / 2) + 'px';
    f.style.top = (cy - size / 2) + 'px';
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 130;
    f.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px');
    f.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(1) + 'px');
    f.style.background = FRAGMENT_COLORS[Math.floor(Math.random() * FRAGMENT_COLORS.length)];
    container.appendChild(f);
    setTimeout(() => f.remove(), 950);
  }
  // Parça yok olur, birkaç saniye sonra başka yerde yeniden doğar
  piece.style.visibility = 'hidden';
  piece.classList.remove('bg-piece-hover');
  setTimeout(() => {
    randomizePiecePosition(piece);
    piece.style.visibility = 'visible';
  }, 3500 + Math.random() * 2500);
}

function initShapeInteractions() {
  const container = document.getElementById('geometric-bg');
  if (!container) return;

  // Buradaki ağır hover/patlama etkileşimi (her mousemove'da elementsFromPoint)
  // yalnızca küçük bir hız koruması olan pending throttling ile çalışır.
  // Animasyonlar her koşulda (hareket azaltma açık olsa bile) görünür kalır.

  let pending = false;
  document.addEventListener('mousemove', (e) => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      const hit = document.elementsFromPoint(e.clientX, e.clientY)
        .some((el) => el.classList && el.classList.contains('bg-piece'));
      if (hit !== initShapeInteractions._over) {
        initShapeInteractions._over = hit;
        document.body.style.cursor = hit ? 'pointer' : '';
      }
      // Hover parlatması: doğrudan üstteki şekle uygula
      $$('.bg-piece-hover').forEach((el) => el.classList.remove('bg-piece-hover'));
      if (hit) {
        const top = document.elementsFromPoint(e.clientX, e.clientY)
          .find((el) => el.classList && el.classList.contains('bg-piece'));
        if (top) top.classList.add('bg-piece-hover');
      }
    });
  });

  document.addEventListener('click', (e) => {
    const piece = document.elementsFromPoint(e.clientX, e.clientY)
      .find((el) => el.classList && el.classList.contains('bg-piece'));
    if (piece) burstPiece(piece, e.clientX, e.clientY);
  });
}

/* --- Dinamik Canlı Arka Plan: yalnızca yeni büyük parçalar --- */
function createAnimatedShapes() {
  const container = document.getElementById('geometric-bg');
  if (!container) return;

  // Yeni nesil büyük parçalar; eski canvas parçacık ağı kaldırıldı.
  spawnGeometricShapeLayers(container);
  initShapeInteractions();
}


/* ---------------- Başlatma ---------------- */
function bindLangWheel() {
  const wheel = $('#lang-wheel');
  wheel.addEventListener('click', () => {
    if (wheel.classList.contains('spinning')) return;
    wheel.classList.add('spinning');
    setTimeout(() => wheel.classList.remove('spinning'), 700);
    setLang(currentLang === 'tr' ? 'en' : 'tr');
  });
}

// Tek sefer bağlanan kalıcı olaylar (modal her açılışta yeniden bağlanmaz).
function bindStaticEvents() {
  bindModalControls();
  const dlCancel = $('#dl-cancel');
  if (dlCancel && !dlCancel._bound) {
    dlCancel._bound = true;
    dlCancel.addEventListener('click', () => {
      dlCancelPending = true;
      if (dlTimer) { clearInterval(dlTimer); dlTimer = null; }
      closeDownloadModal();
      finishDownloadFlow($('#modal-apply'));
    });
  }
  const dlClose = $('#dl-close');
  if (dlClose && !dlClose._bound) {
    dlClose._bound = true;
    dlClose.addEventListener('click', () => {
      dlCancelPending = true;
      if (dlTimer) { clearInterval(dlTimer); dlTimer = null; }
      closeDownloadModal();
      finishDownloadFlow($('#modal-apply'));
    });
  }
}

/* ---------------- Gece / Gündüz Tema ---------------- */
const THEME_KEY = 'mockup_theme';

function applyStoredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'night') {
    document.body.classList.add('night-mode');
    const icon = $('#theme-icon');
    if (icon) icon.textContent = '☀️';
  }
}

function bindThemeToggle() {
  const btn = $('#theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const night = document.body.classList.toggle('night-mode');
    localStorage.setItem(THEME_KEY, night ? 'night' : 'day');
    const icon = $('#theme-icon');
    if (icon) icon.textContent = night ? '☀️' : '🌙';
  });
}

/* ---------------- Yorum / Değerlendirme Sistemi ---------------- */
const REVIEWS_KEY = 'mockup_reviews';
let reviewRating = 0;

function getReviews() {
  try { return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []; }
  catch (e) { return []; }
}

function renderReviewStars(container, rating) {
  container.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function renderReviews() {
  const list = $('#reviews-list');
  if (!list) return;
  const reviews = getReviews();
  list.innerHTML = '';
  if (!reviews.length) {
    const empty = document.createElement('div');
    empty.className = 'reviews-empty';
    empty.textContent = (TRANSLATIONS[currentLang] || TRANSLATIONS.tr).reviewsEmpty;
    list.appendChild(empty);
    return;
  }
  // En yeni yorum üstte
  reviews.slice().reverse().forEach((r) => {
    const card = document.createElement('div');
    card.className = 'review-card';
    const stars = document.createElement('div');
    stars.className = 'stars';
    stars.textContent = '★'.repeat(r.r) + '☆'.repeat(5 - r.r);
    const txt = document.createElement('div');
    txt.className = 'txt';
    txt.textContent = r.t;
    const date = document.createElement('div');
    date.className = 'date';
    date.textContent = new Date(r.d).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'review-delete';
    del.title = 'Yorumu Sil';
    del.textContent = '🗑';
    const originalIndex = reviews.indexOf(r);
    del.addEventListener('click', () => {
      if (!confirm((TRANSLATIONS[currentLang] || TRANSLATIONS.tr).reviewConfirmDelete)) return;
      const arr = getReviews();
      arr.splice(originalIndex, 1);
      try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(arr)); } catch (e) {}
      renderReviews();
    });
    card.appendChild(stars);
    card.appendChild(txt);
    card.appendChild(date);
    card.appendChild(del);
    list.appendChild(card);
  });
}

function resetReviewModal() {
  reviewRating = 5; // varsayılan: 5 yıldız
  $$('#review-stars .review-star').forEach((s) => {
    s.classList.toggle('active', (parseInt(s.dataset.v, 10) || 0) <= reviewRating);
  });
  const ta = $('#review-text');
  if (ta) ta.value = '';
}

function bindReviewEvents() {
  const openBtn = $('#review-open-btn');
  const modal = $('#review-modal');
  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    resetReviewModal();
    modal.classList.remove('hidden');
  });

  $$('#review-stars .review-star').forEach((star) => {
    star.addEventListener('click', () => {
      reviewRating = parseInt(star.dataset.v, 10) || 0;
      $$('#review-stars .review-star').forEach((s) => {
        s.classList.toggle('active', (parseInt(s.dataset.v, 10) || 0) <= reviewRating);
      });
    });
  });

  const close = () => modal.classList.add('hidden');
  const cancelBtn = $('#review-cancel');
  if (cancelBtn) cancelBtn.addEventListener('click', close);
  // Karanlık alana tıklayınca da kapansın
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  const saveBtn = $('#review-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const ta = $('#review-text');
      const text = (ta ? ta.value : '').trim();
      if (reviewRating < 1) { alert((TRANSLATIONS[currentLang] || TRANSLATIONS.tr).reviewNeedStars); return; }
      if (!text) { alert((TRANSLATIONS[currentLang] || TRANSLATIONS.tr).reviewNeedText); return; }
      const reviews = getReviews();
      reviews.push({ r: reviewRating, t: text, d: Date.now() });
      try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews)); } catch (e) {}
      renderReviews();
      close();
    });
  }
}

/* ---------------- Varlık Koruma (temel, istemci taraflı) ---------------- */
function protectAssets() {
  // Sağ tık menüsü: görsel/canvas üzerinde kapat (form alanlarında serbest)
  document.addEventListener('contextmenu', (e) => {
    const t = e.target;
    const isInput = t.closest && t.closest('input, textarea, select, [contenteditable]');
    if (!isInput) e.preventDefault();
  });

  // Görsel/canvas sürükleyip dışarı taşımayı engelle
  document.addEventListener('dragstart', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'IMG' || t.tagName === 'CANVAS')) e.preventDefault();
  });

  // PrintScreen caydırıcılığı: kopyalama anında canvas'ı karart (tam koruma değildir)
  document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      const veil = document.createElement('div');
      veil.style.cssText = 'position:fixed;inset:0;background:#000;z-index:99999;';
      document.body.appendChild(veil);
      setTimeout(() => veil.remove(), 120);
      try { navigator.clipboard.writeText('Bu sitedeki görseller telif ile korunmaktadır.'); } catch (err) {}
    }
  });
}

// Kayıtlı olabilecek eski üçüncü taraf (Monetag gibi) servis worker'ı devre dışı bırak.
// Reklam servis worker'ları tıklama başına yönlendirme yapabilir; dosya silinse bile
// tarayıcı önbelleğinde kalan kayıt önbellekten eski sayfayı sunmaya devam eder.
// Bu yüzden yalnızca kaydı değil, önbelleğe alınmış cache verilerini de temizliyoruz.
function purgeLegacyServiceWorkers() {
  try {
    // 1) Yönlendirme yapan servis worker kayıtlarını kaldır
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => {
          if (reg.active) reg.active.postMessage({ type: 'SKIP_WAITING' });
          try { reg.unregister(); } catch (e) { /* sessiz */ }
        });
      });
      // Bekleyen/çoğalan worker'ı da atla
      if (navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage) {
        try { navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' }); } catch (e) { /* sessiz */ }
      }
    }
    // 2) Reklam servis worker'larının önbelleğe aldığı cache verilerini temizle.
    //    Fav/görsel verileri localStorage'da saklanır, cache'e dokunmaz; burada sadece
    //    servis worker önbellekleri sıfırlanır.
    if ('caches' in window) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
    }
  } catch (e) { /* sessiz */ }
}

function init() {
  // Her adım ayrı try/catch içinde: biri patlarsa diğerleri yine çalışsın.
  const steps = [
    ['purgeLegacyServiceWorkers', purgeLegacyServiceWorkers],
    ['applyStoredTheme', applyStoredTheme],
    ['protectAssets', protectAssets],
    ['bindThemeToggle', bindThemeToggle],
    ['bindReviewEvents', bindReviewEvents],
    ['renderReviews', renderReviews],
    ['applyStoredLang', applyStoredLang],
    ['bindLangWheel', bindLangWheel],
    ['bindUploadEvents', bindUploadEvents],
    ['bindStaticEvents', bindStaticEvents],
    ['bindFavEvents', bindFavEvents],
    ['seedDefaultMannequins', seedDefaultMannequins],
    ['createAnimatedShapes', createAnimatedShapes]
  ];
  steps.forEach(([name, fn]) => {
    try {
      fn();
    } catch (e) {
      console.error('[Init] ' + name + ' hatası:', e);
    }
  });
}


// Tıklama animasyonu: halka + renkli parçacık patlaması
const CLICK_PALETTE = ['#38bdf8', '#818cf8', '#e879f9', '#2dd4bf', '#fb923c', '#ffffff'];
document.addEventListener('click', (e) => {
  // 1) Genişleyen halka
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top = e.clientY + 'px';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);

  // 2) Rastgele renklerle parçacık patlaması
  const N = 10;
  for (let i = 0; i < N; i++) {
    const p = document.createElement('div');
    p.className = 'click-particle';
    const angle = (Math.PI * 2 * i) / N + Math.random() * 0.5;
    const dist = 45 + Math.random() * 50;
    p.style.left = e.clientX + 'px';
    p.style.top = e.clientY + 'px';
    p.style.background = CLICK_PALETTE[Math.floor(Math.random() * CLICK_PALETTE.length)];
    p.style.boxShadow = '0 0 8px ' + CLICK_PALETTE[Math.floor(Math.random() * CLICK_PALETTE.length)];
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    p.style.animationDuration = (0.5 + Math.random() * 0.35).toFixed(2) + 's';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }

  // 3) Anlık parlama (flash)
  const flash = document.createElement('div');
  flash.style.cssText =
    'position:fixed;left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
    'width:70px;height:70px;border-radius:50%;pointer-events:none;z-index:9998;zoom:1;' +
    'transform:translate(-50%,-50%);' +
    'background:radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(56,189,248,0.25) 40%, transparent 70%);' +
    'animation:clickRipple 0.4s ease-out forwards;';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 450);
});

document.addEventListener('DOMContentLoaded', init);
