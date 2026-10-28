/* ─────────────────────────────────────
   CHARAK – JavaScript
   Leaf Canvas, Dynamic Content, Slider,
   WhatsApp & Admin Synchronization
   ───────────────────────────────────── */

// ─── LEAF CANVAS ANIMATION ───
const canvas = document.getElementById('heroLeafCanvas') || document.getElementById('leafCanvas');
let ctx, W, H, leaves = [];

if (canvas) {
  ctx = canvas.getContext('2d');
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    if (!canvas) return;
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  function drawLeaf(ctx, x, y, size, rotation, opacity, style) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;

    if (style === 0) {
      // Lush Emerald Leaf
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.38, size, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#2b894b';
      ctx.fill();
      // Center Vein
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.strokeStyle = '#0d3d27';
      ctx.lineWidth = 0.75;
      ctx.stroke();
    } else if (style === 1) {
      // Ayurvedic Golden Glow Leaf
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.55, 0, 0, size);
      ctx.quadraticCurveTo(-size * 0.55, 0, 0, -size);
      ctx.fillStyle = '#cba237';
      ctx.fill();
      // Vein
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.strokeStyle = '#8c6b1e';
      ctx.lineWidth = 0.65;
      ctx.stroke();
    } else {
      // Herb Sage Petal
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.45, size * 0.75, Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(74, 158, 98, 0.65)';
      ctx.fill();
    }
    ctx.restore();
  }

  class Leaf {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x      = Math.random() * W;
      this.y      = initial ? Math.random() * H : -60;
      this.size   = 8 + Math.random() * 18;
      this.speedY = 0.3 + Math.random() * 0.6;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.rot    = Math.random() * Math.PI * 2;
      this.rotSpd = (Math.random() - 0.5) * 0.012;
      this.opacity = 0.08 + Math.random() * 0.16;
      this.style  = Math.floor(Math.random() * 3);
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.01 + Math.random() * 0.015;
    }
    update() {
      this.y     += this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x     += this.speedX + Math.sin(this.wobble) * 0.4;
      this.rot   += this.rotSpd;
      if (this.y > H + 60) this.reset();
    }
    draw() {
      drawLeaf(ctx, this.x, this.y, this.size, this.rot, this.opacity, this.style);
    }
  }

  leaves = Array.from({ length: 50 }, () => new Leaf());

  function animateLeaves() {
    ctx.clearRect(0, 0, W, H);
    leaves.forEach(l => { l.update(); l.draw(); });
    requestAnimationFrame(animateLeaves);
  }
  animateLeaves();
}

// ─── DYNAMIC DATA SYNC & RENDERING ───
let siteConfig = null;

// Universal Pakistani Rupee Price Formatter
function formatPriceDisplay(price) {
  if (window.CharakDB && typeof window.CharakDB.formatPrice === 'function') {
    return window.CharakDB.formatPrice(price);
  }
  if (price === undefined || price === null || price === '') return 'Rs. 450';
  let s = String(price).trim();
  s = s.replace(/[₹₨]|PKR|Rs\.?|INR/gi, '').trim();
  return 'Rs. ' + (s || '450');
}

function loadSiteData() {
  if (window.CharakDB) {
    siteConfig = window.CharakDB.load();
  } else if (window.CHARAK_DEFAULT_CONFIG) {
    siteConfig = window.CHARAK_DEFAULT_CONFIG;
  }
  if (!siteConfig) return;

  applyWhatsApp(siteConfig.whatsapp);
  applyGeneral(siteConfig.general);
  applyHero(siteConfig.hero);
  applyContact(siteConfig.contact, siteConfig.social);
  renderProductSlider(siteConfig.products);
  renderMedicinesGrid(siteConfig.medicines);
  renderTherapies(siteConfig.therapies);
  renderYoga(siteConfig.yoga);
  renderHospital(siteConfig.hospital);
  setupTherapiesAndYogaClicks();

  const storeOverlay = document.getElementById('storeOverlay');
  if (storeOverlay && storeOverlay.classList.contains('active')) {
    renderStoreItems(currentStoreTab, currentStoreSearch);
  }
}

// WhatsApp setup
function applyWhatsApp(wa) {
  const btn = document.getElementById('waFloatBtn');
  const txt = document.getElementById('waBtnText');
  if (!btn || !wa) return;

  if (wa.enabled === false) {
    btn.style.display = 'none';
    return;
  }
  btn.style.display = 'flex';

  const cleanNum = (wa.number || '923454947614').replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(wa.message || 'Hello! I would like to inquire about treatments and consultation at CHARAK Hospital.');
  btn.href = `https://wa.me/${cleanNum}?text=${encodedMsg}`;

  if (txt && wa.buttonText) {
    txt.textContent = wa.buttonText;
  }

  if (wa.position === 'bottom-left') {
    btn.classList.add('pos-left');
  } else {
    btn.classList.remove('pos-left');
  }
}

// General site titles & branding
function applyGeneral(g) {
  if (!g) return;
  if (g.siteName) {
    document.querySelectorAll('.logo-name').forEach(el => el.textContent = g.siteName);
  }
  if (g.subName) {
    document.querySelectorAll('.logo-ayurveda').forEach(el => el.textContent = g.subName);
  }
  if (g.tagline) {
    document.querySelectorAll('.logo-tagline').forEach(el => el.textContent = g.tagline);
  }
  if (g.logo) {
    document.querySelectorAll('.brand-logo-img').forEach(el => el.src = g.logo);
  }
}

// Hero texts
function applyHero(h) {
  if (!h) return;
  const badgeEl = document.querySelector('.hero-badge span:last-child');
  if (badgeEl && h.badge) badgeEl.textContent = h.badge;

  const title1 = document.querySelector('.hero-title .title-line:first-child');
  const title2 = document.querySelector('.hero-title .title-line.italic');
  if (title1 && h.title1) title1.textContent = h.title1;
  if (title2 && h.title2) title2.textContent = h.title2;

  const sub = document.querySelector('.hero-sub');
  if (sub && h.subtitle) sub.textContent = h.subtitle;

  if (h.heroImage) {
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) heroImg.src = h.heroImage;
  }
}

// Contact details & Social links
function applyContact(c, s) {
  if (c) {
    const items = document.querySelectorAll('.contact-item');
    if (items.length >= 4) {
      if (c.address) items[0].children[1].textContent = c.address;
      if (c.phone) {
        const phoneLink = items[1].querySelector('a');
        if (phoneLink) {
          phoneLink.href = 'tel:' + c.phone.replace(/[^0-9+]/g, '');
          phoneLink.textContent = c.phone;
        } else {
          items[1].children[1].textContent = c.phone;
        }
      }
      if (c.email) {
        const emailLink = items[2].querySelector('a');
        if (emailLink) {
          emailLink.href = 'mailto:' + c.email;
          emailLink.textContent = c.email;
        } else {
          items[2].children[1].textContent = c.email;
        }
      }
      if (c.hours) items[3].children[1].textContent = c.hours;
    }
  }
  if (s) {
    const fb = document.querySelector('.social-btn[title="Facebook"]');
    const ig = document.querySelector('.social-btn[title="Instagram"]');
    const yt = document.querySelector('.social-btn[title="YouTube"]');
    const tt = document.querySelector('.social-btn[title="TikTok"]');
    const wa = document.querySelector('.social-btn[title="WhatsApp"]');
    if (fb && s.facebook)  fb.href = s.facebook;
    if (ig && s.instagram) ig.href = s.instagram;
    if (yt && s.youtube)   yt.href = s.youtube;
    if (tt && s.tiktok)    tt.href = s.tiktok;
    if (wa && s.whatsapp)  wa.href = s.whatsapp;
  }
}

// ─── PRODUCT SHOWCASE SLIDER ───
let currentSlide = 0;
let slideInterval = null;

function renderProductSlider(products) {
  const track = document.getElementById('prodTrack');
  const dotsContainer = document.getElementById('prodDots');
  if (!track || !products || products.length === 0) return;

  track.innerHTML = '';
  if (dotsContainer) dotsContainer.innerHTML = '';

  products.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'prod-card';

    const imgSrc = p.image || 'charak_herbs.png';
    const badgeHTML = p.badge ? `<span class="prod-badge ${p.badgeColor || 'bestseller'}">${p.badge}</span>` : '';

    card.innerHTML = `
      <div class="prod-img-wrap">
        <img src="${imgSrc}" alt="${p.name}" class="prod-img" onerror="this.src='charak_herbs.png'" />
        ${badgeHTML}
      </div>
      <div class="prod-body">
        <span class="prod-category">${p.category || 'Herbal Formulation'}</span>
        <h3 class="prod-name">${p.name}</h3>
        <p class="prod-desc">${p.description || ''}</p>
        <div class="prod-footer">
          <span class="prod-price">${formatPriceDisplay(p.price)}</span>
          <button class="prod-cta" onclick="event.stopPropagation(); openDetailModal('product', '${p.id}')">View Details & Order</button>
        </div>
      </div>
    `;
    card.onclick = () => openDetailModal('product', p.id);
    track.appendChild(card);

    if (dotsContainer) {
      const dot = document.createElement('div');
      dot.className = `prod-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    }
  });

  setupSliderControls();
}

function getVisibleCards() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function updateSlider() {
  const track = document.getElementById('prodTrack');
  const dots = document.querySelectorAll('.prod-dot');
  if (!track) return;

  const cards = track.querySelectorAll('.prod-card');
  const total = cards.length;
  const visible = getVisibleCards();
  const maxSlide = Math.max(0, total - visible);

  if (currentSlide > maxSlide) currentSlide = 0;
  if (currentSlide < 0) currentSlide = maxSlide;

  const cardWidthPercent = 100 / visible;
  const gap = 1.5; // rem
  track.style.transform = `translateX(calc(-${currentSlide * cardWidthPercent}% - ${currentSlide * gap}rem))`;

  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(idx) {
  currentSlide = idx;
  updateSlider();
  resetSliderTimer();
}

function nextSlide() {
  const track = document.getElementById('prodTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.prod-card');
  const maxSlide = Math.max(0, cards.length - getVisibleCards());
  currentSlide = (currentSlide >= maxSlide) ? 0 : currentSlide + 1;
  updateSlider();
}

function prevSlide() {
  const track = document.getElementById('prodTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.prod-card');
  const maxSlide = Math.max(0, cards.length - getVisibleCards());
  currentSlide = (currentSlide <= 0) ? maxSlide : currentSlide - 1;
  updateSlider();
}

function resetSliderTimer() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 4500);
}

function setupSliderControls() {
  const prevBtn = document.getElementById('prodPrev');
  const nextBtn = document.getElementById('prodNext');
  const wrap = document.querySelector('.prod-slider-wrap');

  if (prevBtn) prevBtn.onclick = () => { prevSlide(); resetSliderTimer(); };
  if (nextBtn) nextBtn.onclick = () => { nextSlide(); resetSliderTimer(); };

  if (wrap) {
    wrap.onmouseenter = () => clearInterval(slideInterval);
    wrap.onmouseleave = () => resetSliderTimer();

    // Touch swipe
    let startX = 0;
    wrap.ontouchstart = (e) => { startX = e.touches[0].clientX; };
    wrap.ontouchend = (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (diff > 50)  { nextSlide(); resetSliderTimer(); }
      if (diff < -50) { prevSlide(); resetSliderTimer(); }
    };
  }

  resetSliderTimer();
  window.addEventListener('resize', updateSlider);
}

// ─── MEDICINES GRID WITH IMAGE SUPPORT ───
function renderMedicinesGrid(medicines) {
  const grid = document.getElementById('medicinesGrid');
  if (!grid || !medicines || medicines.length === 0) return;

  grid.innerHTML = '';
  medicines.forEach(m => {
    const card = document.createElement('div');
    card.className = `medicine-card ${m.featured ? 'featured' : ''}`;
    card.setAttribute('data-aos', '');

    const badgeHTML = m.featured ? `<div class="featured-tag">Bestseller</div>` : '';
    
    // Image Box: supports user uploaded photo or herbal icon
    let visualHTML = '';
    if (m.image) {
      visualHTML = `
        <div class="med-img-box">
          <img src="${m.image}" alt="${m.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'med-icon-box\\'>${m.icon || '🌿'}</div>'" />
        </div>`;
    } else {
      visualHTML = `
        <div class="med-img-box">
          <div class="med-icon-box">${m.icon || '🌿'}</div>
        </div>`;
    }

    card.innerHTML = `
      ${badgeHTML}
      ${visualHTML}
      <div class="med-tag">${m.category || 'Herbal'}</div>
      <h3>${m.name}</h3>
      <p>${m.description || ''}</p>
      <div class="med-footer">
        <span class="med-price">${formatPriceDisplay(m.price)}</span>
        <button class="med-btn" onclick="event.stopPropagation(); openDetailModal('medicine', '${m.id}')">View Details & Consult</button>
      </div>
    `;

    card.onclick = () => openDetailModal('medicine', m.id);

    // Interactive radial glow on mousemove
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(122,171,122,0.22), rgba(255,255,255,0.06) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });

    grid.appendChild(card);
  });
}

// ─── DYNAMIC RENDERER: THERAPIES ───
function renderTherapies(therapies) {
  const container = document.getElementById('therapiesGrid');
  if (!container || !therapies) return;

  const feat = therapies.featured || null;
  const list = Array.isArray(therapies.list) ? therapies.list : [];

  let featHTML = '';
  if (feat && feat.active !== false) {
    const featImg = feat.image || (feat.gallery && feat.gallery[0]) || 'charak_therapy.png';
    featHTML = `
      <div class="therapy-card large" onclick="openDetailModal('therapy', 'featured')">
        <img src="${featImg}" alt="${feat.name}" class="therapy-img" onerror="this.src='charak_therapy.png'" />
        <div class="therapy-overlay">
          <div class="therapy-tag">${feat.tag || 'Signature'}</div>
          <h3>${feat.name}</h3>
          <p>${feat.description || ''}</p>
          <a href="#contact" class="therapy-link" onclick="event.preventDefault(); event.stopPropagation(); openDetailModal('therapy', 'featured')">View Details & Book →</a>
        </div>
      </div>
    `;
  }

  const activeMinis = list.filter(t => t.active !== false);
  let minisHTML = '';
  if (activeMinis.length > 0) {
    minisHTML = `
      <div class="therapy-cards-right">
        ${activeMinis.map((t) => {
          const origIdx = list.indexOf(t);
          return `
            <div class="therapy-mini" onclick="openDetailModal('therapy', '${origIdx}')">
              <div class="therapy-mini-icon">${t.icon || '✨'}</div>
              <div>
                <h4>${t.name}</h4>
                <p>${t.description || ''}</p>
                <span class="mini-duration">${t.duration || 'Session'}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  container.innerHTML = featHTML + minisHTML;
}

// ─── DYNAMIC RENDERER: YOGA ───
function renderYoga(yoga) {
  const container = document.getElementById('yogaPrograms');
  if (!container || !yoga) return;

  const badgeEl = document.querySelector('.yoga-floating span');
  if (badgeEl && yoga.floatingBadge) {
    badgeEl.textContent = yoga.floatingBadge;
  }

  const progs = Array.isArray(yoga.programs) ? yoga.programs.filter(p => p.active !== false) : [];
  container.innerHTML = progs.map((p) => {
    const origIdx = yoga.programs.indexOf(p);
    return `
      <div class="yoga-prog" onclick="openDetailModal('yoga', '${origIdx}')">
        <div class="prog-num">${p.num || '01'}</div>
        <div>
          <strong>${p.name}</strong>
          <p>${p.desc || ''}</p>
          ${p.schedule ? `<small style="display:block; color:var(--sage); margin-top:0.25rem">⏰ ${p.schedule}</small>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ─── DYNAMIC RENDERER: HOSPITAL ───
function renderHospital(hospital) {
  const grid = document.getElementById('hospitalGrid');
  const condList = document.getElementById('conditionsList');
  if (!hospital) return;

  if (grid && Array.isArray(hospital.features)) {
    const activeFeats = hospital.features.filter(f => f.active !== false);
    grid.innerHTML = activeFeats.map((f, i) => `
      <div class="hosp-feature" onclick="openDetailModal('hospital', '${i}')" style="cursor:pointer">
        <div class="hosp-icon">${f.icon || '🏥'}</div>
        <h4>${f.name}</h4>
        <p>${f.desc || ''}</p>
      </div>
    `).join('');
  }

  if (condList && Array.isArray(hospital.conditions)) {
    condList.innerHTML = hospital.conditions.map(c => `
      <span class="condition-tag">${c}</span>
    `).join('');
  }
}

// ─── CLICK HANDLERS FOR THERAPIES & YOGA ───
function setupTherapiesAndYogaClicks() {
  // Handled directly via dynamic click handlers in render functions
}

// ─── LUXURY DETAIL MODAL CONTROLLER ───
window.closeDetailModal = function() {
  const overlay = document.getElementById('detailModalOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    const storeOverlay = document.getElementById('storeOverlay');
    if (!storeOverlay || !storeOverlay.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }
};

function renderModalCustomSections(customSections, fallbackHTML = '') {
  if (Array.isArray(customSections) && customSections.length > 0) {
    const activeSecs = customSections.filter(sec => sec.enabled !== false && (sec.title || sec.content));
    if (activeSecs.length > 0) {
      return activeSecs.map(sec => `
        <div class="detail-section-block">
          <h4>📋 ${sec.title || 'Information'}</h4>
          <p class="detail-small-p" style="white-space: pre-line; line-height: 1.7">${sec.content || ''}</p>
        </div>
      `).join('');
    }
  }
  return fallbackHTML;
}

function renderModalGallery(galleryImgs, itemName, defaultImg) {
  const list = Array.isArray(galleryImgs) && galleryImgs.length > 0 ? galleryImgs : [defaultImg];
  if (list.length <= 1) return '';
  return `
    <div class="detail-thumbs-wrap">
      ${list.map((img, i) => `
        <img src="${img}" alt="${itemName}" class="detail-thumb ${i === 0 ? 'active' : ''}" onclick="switchDetailMainImg(this, '${img}')" onerror="this.src='${defaultImg}'" />
      `).join('')}
    </div>
  `;
}

window.openDetailModal = function(type, id) {
  const overlay = document.getElementById('detailModalOverlay');
  const content = document.getElementById('detailModalContent');
  if (!overlay || !content) return;

  const config = siteConfig || (window.CharakDB ? window.CharakDB.load() : window.CHARAK_DEFAULT_CONFIG);
  const wa = (config && config.whatsapp) ? config.whatsapp : { number: '923454947614' };
  const cleanPhone = (wa.number || '923454947614').replace(/\D/g, '');

  let html = '';

  if (type === 'product') {
    const item = (config.products || []).find(p => p.id === id) || (config.products ? config.products[0] : null);
    if (!item) return;

    const mainImg = item.image || (item.gallery && item.gallery[0]) || 'charak_herbs.png';
    const waText = encodeURIComponent(`Hello CHARAK Hospital! I would like to order: "${item.name}" (${formatPriceDisplay(item.price)}). Please confirm availability and delivery.`);
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    const galleryHTML = renderModalGallery(item.gallery, item.name, mainImg);

    const defaultIngredients = Array.isArray(item.ingredients) ? item.ingredients : (item.ingredients ? [item.ingredients] : [
      "Pure Botanical Root Extract (Standardized active withanolides)",
      "Bio-enhancing herbal catalyst for complete absorption",
      "100% Vegetarian Plant-based Capsules — Chemical Free"
    ]);
    const fallbackHTML = `
      <div class="detail-section-block">
        <h4>🌿 Key Herbal Ingredients & Benefits</h4>
        <ul class="detail-checklist">
          ${defaultIngredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
      <div class="detail-section-block">
        <h4>⏱ Recommended Dosage & How to Use</h4>
        <p class="detail-small-p">${item.dosage || "1 capsule twice daily after meals with lukewarm water or milk, or as advised by your physician."}</p>
      </div>
    `;

    const sectionsHTML = renderModalCustomSections(item.customSections, fallbackHTML);

    html = `
      <div class="detail-grid">
        <div class="detail-media">
          <div class="detail-main-img-wrap">
            <img src="${mainImg}" alt="${item.name}" id="detailMainImg" class="detail-main-img" onerror="this.src='charak_herbs.png'" />
            ${item.badge ? `<span class="detail-badge ${item.badgeColor || 'bestseller'}">${item.badge}</span>` : ''}
          </div>
          ${galleryHTML}
          <div class="detail-guarantee">
            <span>🌿 100% Pure Organic Ayurvedic Formulation</span>
            <span>📦 Secure Delivery Across Pakistan</span>
            <span>📞 Direct Doctor Consultation On Demand</span>
          </div>
        </div>
        <div class="detail-info">
          <div class="detail-cat">${item.category || 'Herbal Formulation'}</div>
          <h2 class="detail-title">${item.name}</h2>
          <div class="detail-price-row">
            <span class="detail-price">${formatPriceDisplay(item.price)}</span>
            <span class="detail-tax">Pakistani Rupees (PKR)</span>
          </div>
          <p class="detail-desc">${item.description || 'Traditional Ayurvedic formulation crafted with certified organic herbs for holistic healing and balance.'}</p>
          ${sectionsHTML}
          <div class="detail-actions">
            <a href="${waLink}" target="_blank" rel="noopener" class="btn-detail-order">
              <span>💬 Order on WhatsApp</span>
            </a>
            <a href="tel:+923454947614" class="btn-detail-call">
              <span>📞 Call 0345-4947614</span>
            </a>
          </div>
        </div>
      </div>
    `;
  } else if (type === 'medicine') {
    const item = (config.medicines || []).find(m => m.id === id) || (config.medicines ? config.medicines[0] : null);
    if (!item) return;

    const mainImg = item.image || (item.gallery && item.gallery[0]) || 'charak_herbs.png';
    const waText = encodeURIComponent(`Hello CHARAK Hospital! I would like to consult & order Ayurvedic Medicine: "${item.name}" (${formatPriceDisplay(item.price)}).`);
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    const galleryHTML = renderModalGallery(item.gallery, item.name, mainImg);

    const defaultBenefits = Array.isArray(item.benefits) ? item.benefits : [
      "Natural holistic healing without synthetic chemicals",
      "Balances vital doshas (Vata, Pitta, Kapha) in the body",
      "Strengthens organic immunity and vital vitality"
    ];
    const fallbackHTML = `
      <div class="detail-section-block">
        <h4>🌿 Key Indications & Healing Benefits</h4>
        <ul class="detail-checklist">
          ${defaultBenefits.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
      <div class="detail-section-block">
        <h4>⏱ Recommended Dosage</h4>
        <p class="detail-small-p">${item.dosage || '1-2 tablets/capsules twice daily with warm water after meals, or as prescribed.'}</p>
      </div>
    `;

    const sectionsHTML = renderModalCustomSections(item.customSections, fallbackHTML);

    html = `
      <div class="detail-grid">
        <div class="detail-media">
          <div class="detail-main-img-wrap">
            ${mainImg ? `<img src="${mainImg}" alt="${item.name}" id="detailMainImg" class="detail-main-img" onerror="this.src='charak_herbs.png'" />` : `<div style="font-size:5rem">${item.icon || '🌿'}</div>`}
            ${item.featured ? `<span class="detail-badge bestseller">Bestseller</span>` : ''}
          </div>
          ${galleryHTML}
          <div class="detail-guarantee">
            <span>🏥 Formulated by Charak Hospital Ayurvedic Physicians</span>
            <span>🔬 Laboratory Tested for Purity & Heavy Metal Safety</span>
          </div>
        </div>
        <div class="detail-info">
          <div class="detail-cat">Charak Hospital Pharmacy • ${item.category || 'Ayurvedic Medicine'}</div>
          <h2 class="detail-title">${item.name}</h2>
          <div class="detail-price-row">
            <span class="detail-price">${formatPriceDisplay(item.price)}</span>
            <span class="detail-tax">Pakistani Rupees • Doctor Recommended</span>
          </div>
          <p class="detail-desc">${item.description || ''}</p>
          ${sectionsHTML}
          <div class="detail-actions">
            <a href="${waLink}" target="_blank" rel="noopener" class="btn-detail-order">
              <span>💬 Consult & Order on WhatsApp</span>
            </a>
            <a href="tel:+923454947614" class="btn-detail-call">
              <span>📞 Doctor Helpline</span>
            </a>
          </div>
        </div>
      </div>
    `;
  } else if (type === 'therapy') {
    let therapy = null;
    if (id === 'featured') {
      therapy = config.therapies ? config.therapies.featured : null;
    } else {
      therapy = config.therapies && config.therapies.list ? config.therapies.list[Number(id)] : null;
    }
    if (!therapy) return;

    const therapyImg = therapy.image || (therapy.gallery && therapy.gallery[0]) || 'charak_therapy.png';
    const waText = encodeURIComponent(`Hello CHARAK Hospital! I want to book an appointment for Natural Therapy: "${therapy.name}". Please share schedule & doctor consultation details.`);
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    const galleryHTML = renderModalGallery(therapy.gallery, therapy.name, therapyImg);

    const fallbackHTML = `
      <div class="detail-section-block">
        <h4>✨ Therapeutic Benefits</h4>
        <ul class="detail-checklist">
          <li>Deep physical detoxification and chronic toxin (Ama) release</li>
          <li>Soothes joint inflammation, stiffness, and chronic muscle pain</li>
          <li>Rebalances autonomic nervous system and relieves severe anxiety</li>
          <li>Customized medicinal oils tailored to your biological Prakriti</li>
        </ul>
      </div>
      <div class="detail-section-block">
        <h4>📋 Protocol & Consultation</h4>
        <p class="detail-small-p">Includes comprehensive Nadi Pariksha (Pulse Assessment), personalized dosha diagnosis, and post-therapy rejuvenation diet guidance.</p>
      </div>
    `;

    const sectionsHTML = renderModalCustomSections(therapy.customSections, fallbackHTML);

    html = `
      <div class="detail-grid">
        <div class="detail-media">
          <div class="detail-main-img-wrap">
            <img src="${therapyImg}" alt="${therapy.name}" id="detailMainImg" class="detail-main-img" onerror="this.src='charak_therapy.png'" />
            <span class="detail-badge premium">${therapy.tag || 'Natural Therapy'}</span>
          </div>
          ${galleryHTML}
          <div class="detail-guarantee">
            <span>⏱ Session Duration: ${therapy.duration || '60 to 90 min'}</span>
            <span>🩺 Administered by Expert Ayurvedic Vaidyas</span>
            <span>🌿 Pure Herbal Medicated Oils & Herbs</span>
          </div>
        </div>
        <div class="detail-info">
          <div class="detail-cat">Charak Hospital • Therapeutic Care</div>
          <h2 class="detail-title">${therapy.name}</h2>
          <p class="detail-desc">${therapy.description || ''}</p>
          ${sectionsHTML}
          <div class="detail-actions">
            <a href="${waLink}" target="_blank" rel="noopener" class="btn-detail-order">
              <span>🌿 Book Therapy via WhatsApp</span>
            </a>
            <a href="#contact" onclick="closeDetailModal()" class="btn-detail-call">
              <span>📅 Book Hospital Appointment</span>
            </a>
          </div>
        </div>
      </div>
    `;
  } else if (type === 'yoga') {
    const prog = config.yoga && config.yoga.programs ? config.yoga.programs[Number(id)] : null;
    if (!prog) return;

    const progImg = prog.image || (prog.gallery && prog.gallery[0]) || 'charak_yoga.png';
    const waText = encodeURIComponent(`Hello CHARAK Wellness! I would like to join the Yoga program: "${prog.name}". Please send batch timings and enrollment details.`);
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    const galleryHTML = renderModalGallery(prog.gallery, prog.name, progImg);

    const fallbackHTML = `
      <div class="detail-section-block">
        <h4>🧘 What Is Included In This Session</h4>
        <ul class="detail-checklist">
          <li>Classical Asanas tailored for flexibility, spine alignment & stamina</li>
          <li>Therapeutic Pranayama (Breathwork for lung health & stress relief)</li>
          <li>Guided Meditation & Yoga Nidra for cellular restorative relaxation</li>
          <li>Condition-specific modifications for diabetes, BP & back pain</li>
        </ul>
      </div>
    `;

    const sectionsHTML = renderModalCustomSections(prog.customSections, fallbackHTML);

    html = `
      <div class="detail-grid">
        <div class="detail-media">
          <div class="detail-main-img-wrap">
            <img src="${progImg}" alt="${prog.name}" id="detailMainImg" class="detail-main-img" onerror="this.src='charak_yoga.png'" />
            <span class="detail-badge bestseller">Yoga & Wellness</span>
          </div>
          ${galleryHTML}
          <div class="detail-guarantee">
            <span>🧘 Conducted by Certified Yoga Masters</span>
            <span>🌅 Morning & Evening Batches Available</span>
            <span>🌱 Natural Garden & Indoor Studio Options</span>
          </div>
        </div>
        <div class="detail-info">
          <div class="detail-cat">Charak Holistic Center • Program #${prog.num || '01'}</div>
          <h2 class="detail-title">${prog.name}</h2>
          ${prog.schedule ? `<div style="font-size:0.85rem; color:var(--sage); font-weight:600; margin-bottom:0.5rem">⏰ Schedule: ${prog.schedule}</div>` : ''}
          <p class="detail-desc">${prog.desc || ''}</p>
          ${sectionsHTML}
          <div class="detail-actions">
            <a href="${waLink}" target="_blank" rel="noopener" class="btn-detail-order">
              <span>🧘 Join Class via WhatsApp</span>
            </a>
            <a href="#contact" onclick="closeDetailModal()" class="btn-detail-call">
              <span>📋 Free Trial Class Inquiry</span>
            </a>
          </div>
        </div>
      </div>
    `;
  } else if (type === 'hospital') {
    const feat = config.hospital && config.hospital.features ? config.hospital.features[Number(id)] : null;
    if (!feat) return;

    const hospImg = feat.image || (feat.gallery && feat.gallery[0]) || 'charak_doctor.png';
    const waText = encodeURIComponent(`Hello CHARAK Hospital! I am inquiring about facility / service: "${feat.name}".`);
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    const galleryHTML = renderModalGallery(feat.gallery, feat.name, hospImg);
    const sectionsHTML = renderModalCustomSections(feat.customSections, '');

    html = `
      <div class="detail-grid">
        <div class="detail-media">
          <div class="detail-main-img-wrap">
            ${feat.image ? `<img src="${hospImg}" alt="${feat.name}" id="detailMainImg" class="detail-main-img" onerror="this.src='charak_doctor.png'" />` : `<div style="font-size:5.5rem">${feat.icon || '🏥'}</div>`}
            <span class="detail-badge premium">Hospital Facility</span>
          </div>
          ${galleryHTML}
          <div class="detail-guarantee">
            <span>🏥 24/7 Inpatient & Outpatient Ayurvedic Care</span>
            <span>🔬 Comprehensive Diagnostic & Laboratory Facilities</span>
          </div>
        </div>
        <div class="detail-info">
          <div class="detail-cat">CHARAK Hospital & Research Institute</div>
          <h2 class="detail-title">${feat.icon || '🏥'} ${feat.name}</h2>
          <p class="detail-desc">${feat.desc || ''}</p>
          ${sectionsHTML}
          <div class="detail-actions">
            <a href="${waLink}" target="_blank" rel="noopener" class="btn-detail-order">
              <span>💬 Hospital Inquiry on WhatsApp</span>
            </a>
            <a href="tel:+923454947614" class="btn-detail-call">
              <span>📞 Call Reception</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  content.innerHTML = html;
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

window.switchDetailMainImg = function(thumb, src) {
  const main = document.getElementById('detailMainImg');
  if (main) main.src = src;
  document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
  if (thumb) thumb.classList.add('active');
};

// Close modal or store overlay when pressing ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const detailOverlay = document.getElementById('detailModalOverlay');
    if (detailOverlay && detailOverlay.classList.contains('active')) {
      closeDetailModal();
    } else {
      closeStoreOverlay();
    }
  }
});

const modalOverlayEl = document.getElementById('detailModalOverlay');
if (modalOverlayEl) {
  modalOverlayEl.addEventListener('click', (e) => {
    if (e.target === modalOverlayEl) closeDetailModal();
  });
}

const storeOverlayEl = document.getElementById('storeOverlay');
if (storeOverlayEl) {
  storeOverlayEl.addEventListener('click', (e) => {
    if (e.target === storeOverlayEl) closeStoreOverlay();
  });
}

// ─── FULL STORE / CATALOG OVERLAY CONTROLLER ───
let currentStoreTab = 'products';
let currentStoreSearch = '';

const STORE_TITLES = {
  products: {
    badge: '🌿 Charak Products Store',
    title: 'Our Signature Wellness Collection',
    sub: 'Explore pure Ayurvedic formulations, herbal extracts & daily health tonics'
  },
  medicines: {
    badge: '🍵 Charak Herbal Pharmacy',
    title: 'Our Herbal Medicines & Remedies',
    sub: 'Formulated by expert Ayurvedic physicians treating the root cause of ailments'
  },
  therapies: {
    badge: '✨ Charak Holistic Therapies',
    title: 'Ancient Healing & Natural Therapies',
    sub: 'Transformative Panchakarma, herbal massages & restorative therapies'
  },
  yoga: {
    badge: '🧘 Charak Yoga Studio',
    title: 'CHARAK Yoga & Wellness Programs',
    sub: 'Classical Hatha, Kundalini & therapeutic meditation courses'
  }
};

window.openStoreOverlay = function(category = 'products') {
  currentStoreTab = category;
  currentStoreSearch = '';

  const searchInput = document.getElementById('storeSearchInput');
  if (searchInput) searchInput.value = '';
  const clearBtn = document.getElementById('storeSearchClear');
  if (clearBtn) clearBtn.style.display = 'none';

  updateStoreHeaderAndTabs();
  renderStoreItems(currentStoreTab, '');

  const overlay = document.getElementById('storeOverlay');
  if (overlay) {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
};

window.closeStoreOverlay = function() {
  const overlay = document.getElementById('storeOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    const detailOverlay = document.getElementById('detailModalOverlay');
    if (!detailOverlay || !detailOverlay.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }
};

window.switchStoreTab = function(category) {
  currentStoreTab = category;
  updateStoreHeaderAndTabs();
  renderStoreItems(currentStoreTab, currentStoreSearch);
};

function updateStoreHeaderAndTabs() {
  // Update header text
  const info = STORE_TITLES[currentStoreTab] || STORE_TITLES.products;
  const badgeEl = document.getElementById('storeCategoryBadge');
  const titleEl = document.getElementById('storeMainTitle');
  const subEl = document.getElementById('storeSubTitle');

  if (badgeEl) badgeEl.textContent = info.badge;
  if (titleEl) titleEl.textContent = info.title;
  if (subEl) subEl.textContent = info.sub;

  // Update tabs active state
  document.querySelectorAll('.store-tab').forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-tab') === currentStoreTab);
  });
}

window.handleStoreSearch = function() {
  const input = document.getElementById('storeSearchInput');
  const clearBtn = document.getElementById('storeSearchClear');
  const val = input ? input.value.trim() : '';

  if (clearBtn) {
    clearBtn.style.display = val.length > 0 ? 'block' : 'none';
  }
  currentStoreSearch = val.toLowerCase();
  renderStoreItems(currentStoreTab, currentStoreSearch);
};

window.clearStoreSearch = function() {
  const input = document.getElementById('storeSearchInput');
  const clearBtn = document.getElementById('storeSearchClear');
  if (input) input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  currentStoreSearch = '';
  renderStoreItems(currentStoreTab, '');
};

function renderStoreItems(category, filterText) {
  const grid = document.getElementById('storeGrid');
  if (!grid) return;

  const config = siteConfig || (window.CharakDB ? window.CharakDB.load() : window.CHARAK_DEFAULT_CONFIG);
  if (!config) return;

  const wa = config.whatsapp || { number: '923454947614' };
  const cleanPhone = (wa.number || '923454947614').replace(/\D/g, '');

  // Update count indicators on tabs
  const prodCount = (config.products || []).length;
  const medCount = (config.medicines || []).length;
  const therapyCount = ((config.therapies && config.therapies.list) ? config.therapies.list.length : 0) +
                       ((config.therapies && config.therapies.featured) ? 1 : 0);
  const yogaCount = (config.yoga && config.yoga.programs) ? config.yoga.programs.length : 0;

  const countProdEl = document.getElementById('storeCountProducts');
  const countMedEl = document.getElementById('storeCountMedicines');
  const countTherapyEl = document.getElementById('storeCountTherapies');
  const countYogaEl = document.getElementById('storeCountYoga');

  if (countProdEl) countProdEl.textContent = prodCount;
  if (countMedEl) countMedEl.textContent = medCount;
  if (countTherapyEl) countTherapyEl.textContent = therapyCount;
  if (countYogaEl) countYogaEl.textContent = yogaCount;

  let cardsHTML = '';

  if (category === 'products') {
    let list = config.products || [];
    if (filterText) {
      list = list.filter(p => {
        const text = [p.name, p.category, p.description, ...(p.ingredients || [])].join(' ').toLowerCase();
        return text.includes(filterText);
      });
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="store-empty">
          <div class="store-empty-icon">🔍</div>
          <h3 class="store-empty-title">No Products Found</h3>
          <p>No products match "${filterText}". Try searching with different keywords or clear your search.</p>
        </div>`;
      return;
    }

    cardsHTML = list.map(item => {
      const imgSrc = item.image || (item.gallery && item.gallery[0]) || 'charak_herbs.png';
      const badgeHTML = item.badge ? `<span class="store-card-badge ${item.badgeColor || ''}">${item.badge}</span>` : '';
      const waMsg = encodeURIComponent(`Hello CHARAK Hospital! I want to order product: "${item.name}" (${formatPriceDisplay(item.price)}). Please confirm availability.`);
      const waLink = `https://wa.me/${cleanPhone}?text=${waMsg}`;

      return `
        <div class="store-card" onclick="openDetailModal('product', '${item.id}')">
          <div class="store-card-media">
            <img src="${imgSrc}" alt="${item.name}" class="store-card-img" onerror="this.src='charak_herbs.png'" />
            ${badgeHTML}
          </div>
          <div class="store-card-body">
            <span class="store-card-cat">${item.category || 'Herbal Formulation'}</span>
            <h3 class="store-card-name">${item.name}</h3>
            <p class="store-card-desc">${item.description || ''}</p>
            <div class="store-card-footer">
              <span class="store-card-price">${formatPriceDisplay(item.price)}</span>
              <div class="store-card-cta-group">
                <button type="button" class="btn-store-view" onclick="event.stopPropagation(); openDetailModal('product', '${item.id}')">View Details</button>
                <a href="${waLink}" target="_blank" rel="noopener" class="btn-store-wa" onclick="event.stopPropagation()">💬 Order</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } else if (category === 'medicines') {
    let list = config.medicines || [];
    if (filterText) {
      list = list.filter(m => {
        const text = [m.name, m.category, m.description, ...(m.benefits || [])].join(' ').toLowerCase();
        return text.includes(filterText);
      });
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="store-empty">
          <div class="store-empty-icon">🍵</div>
          <h3 class="store-empty-title">No Medicines Found</h3>
          <p>No herbal medicines match "${filterText}".</p>
        </div>`;
      return;
    }

    cardsHTML = list.map(item => {
      const imgSrc = item.image || (item.gallery && item.gallery[0]);
      let mediaHTML = '';
      if (imgSrc) {
        mediaHTML = `<img src="${imgSrc}" alt="${item.name}" class="store-card-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'store-card-icon-box\\'>${item.icon || '🌿'}</div>'" />`;
      } else {
        mediaHTML = `<div class="store-card-icon-box">${item.icon || '🌿'}</div>`;
      }

      const badgeHTML = item.featured ? `<span class="store-card-badge">Bestseller</span>` : '';
      const waMsg = encodeURIComponent(`Hello CHARAK Hospital! I want to consult and order Ayurvedic medicine: "${item.name}" (${formatPriceDisplay(item.price)}).`);
      const waLink = `https://wa.me/${cleanPhone}?text=${waMsg}`;

      return `
        <div class="store-card" onclick="openDetailModal('medicine', '${item.id}')">
          <div class="store-card-media">
            ${mediaHTML}
            ${badgeHTML}
          </div>
          <div class="store-card-body">
            <span class="store-card-cat">${item.category || 'Ayurvedic Medicine'}</span>
            <h3 class="store-card-name">${item.name}</h3>
            <p class="store-card-desc">${item.description || ''}</p>
            <div class="store-card-footer">
              <span class="store-card-price">${formatPriceDisplay(item.price)}</span>
              <div class="store-card-cta-group">
                <button type="button" class="btn-store-view" onclick="event.stopPropagation(); openDetailModal('medicine', '${item.id}')">View Details</button>
                <a href="${waLink}" target="_blank" rel="noopener" class="btn-store-wa" onclick="event.stopPropagation()">💬 Consult</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } else if (category === 'therapies') {
    let list = [];
    if (config.therapies && config.therapies.featured && config.therapies.featured.active !== false) {
      list.push({ ...config.therapies.featured, key: 'featured', duration: config.therapies.featured.duration || '90-120 min', icon: '✨' });
    }
    if (config.therapies && Array.isArray(config.therapies.list)) {
      config.therapies.list.forEach((t, i) => {
        if (t.active !== false) {
          list.push({ ...t, key: String(i) });
        }
      });
    }

    if (filterText) {
      list = list.filter(t => {
        const text = [t.name, t.description, t.tag, t.duration].join(' ').toLowerCase();
        return text.includes(filterText);
      });
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="store-empty">
          <div class="store-empty-icon">✨</div>
          <h3 class="store-empty-title">No Therapies Found</h3>
          <p>No therapies match "${filterText}".</p>
        </div>`;
      return;
    }

    cardsHTML = list.map(item => {
      const imgSrc = item.image || (item.gallery && item.gallery[0]) || 'charak_therapy.png';
      const badgeHTML = `<span class="store-card-badge ${item.key === 'featured' ? 'premium' : ''}">${item.tag || item.duration || 'Therapy'}</span>`;
      const waMsg = encodeURIComponent(`Hello CHARAK Hospital! I want to book an appointment for therapy: "${item.name}". Please share consultation schedule.`);
      const waLink = `https://wa.me/${cleanPhone}?text=${waMsg}`;

      return `
        <div class="store-card" onclick="openDetailModal('therapy', '${item.key}')">
          <div class="store-card-media">
            <img src="${imgSrc}" alt="${item.name}" class="store-card-img" onerror="this.src='charak_therapy.png'" />
            ${badgeHTML}
          </div>
          <div class="store-card-body">
            <span class="store-card-cat">Holistic Healing · Panchakarma</span>
            <h3 class="store-card-name">${item.name}</h3>
            <p class="store-card-desc">${item.description || ''}</p>
            <div class="store-card-footer">
              <span class="store-card-duration">⏱ ${item.duration || 'Session'}</span>
              <div class="store-card-cta-group">
                <button type="button" class="btn-store-view" onclick="event.stopPropagation(); openDetailModal('therapy', '${item.key}')">View Protocol</button>
                <a href="${waLink}" target="_blank" rel="noopener" class="btn-store-wa" onclick="event.stopPropagation()">🌿 Book</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } else if (category === 'yoga') {
    let list = (config.yoga && Array.isArray(config.yoga.programs)) ? config.yoga.programs.filter(p => p.active !== false) : [];
    if (filterText) {
      list = list.filter(prog => {
        const text = [prog.name, prog.desc, prog.num, prog.schedule].join(' ').toLowerCase();
        return text.includes(filterText);
      });
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="store-empty">
          <div class="store-empty-icon">🧘</div>
          <h3 class="store-empty-title">No Yoga Programs Found</h3>
          <p>No yoga programs match "${filterText}".</p>
        </div>`;
      return;
    }

    cardsHTML = list.map((item, idx) => {
      const progImg = item.image || (item.gallery && item.gallery[0]) || 'charak_yoga.png';
      const badgeHTML = `<span class="store-card-badge">Program #${item.num || (idx + 1)}</span>`;
      const waMsg = encodeURIComponent(`Hello CHARAK Wellness! I would like to join the Yoga program: "${item.name}". Please send batch timings.`);
      const waLink = `https://wa.me/${cleanPhone}?text=${waMsg}`;

      return `
        <div class="store-card" onclick="openDetailModal('yoga', '${idx}')">
          <div class="store-card-media">
            <img src="${progImg}" alt="${item.name}" class="store-card-img" onerror="this.src='charak_yoga.png'" />
            ${badgeHTML}
          </div>
          <div class="store-card-body">
            <span class="store-card-cat">Charak Yoga Studio · Mind & Body</span>
            <h3 class="store-card-name">${item.name}</h3>
            ${item.schedule ? `<small style="display:block; color:var(--light-sage); margin-bottom:0.4rem">⏰ ${item.schedule}</small>` : ''}
            <p class="store-card-desc">${item.desc || ''}</p>
            <div class="store-card-footer">
              <span class="store-card-duration">🧘 Daily Batches</span>
              <div class="store-card-cta-group">
                <button type="button" class="btn-store-view" onclick="event.stopPropagation(); openDetailModal('yoga', '${idx}')">View Details</button>
                <a href="${waLink}" target="_blank" rel="noopener" class="btn-store-wa" onclick="event.stopPropagation()">🧘 Join</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  grid.innerHTML = cardsHTML;
}

// Quick action to WhatsApp when clicking "Consult / Order"
window.consultProduct = function(name) {
  const decoded = decodeURIComponent(name);
  const wa = (siteConfig && siteConfig.whatsapp) ? siteConfig.whatsapp : { number: '923454947614' };
  const cleanNum = (wa.number || '923454947614').replace(/\D/g, '');
  const msg = encodeURIComponent(`Hello CHARAK Hospital! I am interested in "${decoded}". Please share consultation and availability details.`);
  window.open(`https://wa.me/${cleanNum}?text=${msg}`, '_blank');
};

// ─── NAVBAR & SCROLL BEHAVIOR ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  const btt = document.getElementById('backToTop');
  if (btt) btt.classList.toggle('visible', window.scrollY > 500);
});

// Mobile Nav
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
}
window.closeMobileNav = function() {
  if (mobileNav) mobileNav.classList.remove('open');
};

// Back to top
const btt = document.getElementById('backToTop');
if (btt) {
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Scroll Reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const siblings = e.target.parentElement.querySelectorAll('.reveal');
        let idx = 0;
        siblings.forEach((s, si) => { if (s === e.target) idx = si; });
        setTimeout(() => e.target.classList.add('visible'), idx * 70);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.target) || 0;
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

if ('IntersectionObserver' in window) {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));
}

// Active Pill on scroll
const sections = ['medicines', 'therapies', 'yoga', 'hospital', 'experts'];
const pillMap  = {
  medicines: 'pill-medicines',
  therapies: 'pill-therapies',
  yoga:      'pill-yoga',
  hospital:  'pill-hospital',
  experts:   'pill-experts',
};

if ('IntersectionObserver' in window) {
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const id = e.target.id;
      const pill = document.getElementById(pillMap[id]);
      if (!pill) return;
      if (e.isIntersecting) {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObs.observe(el);
  });
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const name = document.getElementById('fname')?.value || '';
    const phone = document.getElementById('fphone')?.value || '';
    const consult = document.getElementById('fconsult')?.value || 'General Consultation';
    const msg = document.getElementById('fmsg')?.value || '';

    btn.textContent = '✓ Booking Submitted!';
    btn.style.background = 'var(--sage)';
    btn.disabled = true;

    // Optional direct WhatsApp forward if number exists
    if (siteConfig && siteConfig.whatsapp && siteConfig.whatsapp.number) {
      setTimeout(() => {
        const cleanNum = siteConfig.whatsapp.number.replace(/\D/g, '');
        const waMsg = encodeURIComponent(`Namaste CHARAK! Consultation booking request:\nName: ${name}\nPhone: ${phone}\nService: ${consult}\nMessage: ${msg}`);
        window.open(`https://wa.me/${cleanNum}?text=${waMsg}`, '_blank');
      }, 1000);
    }

    setTimeout(() => {
      btn.textContent = 'Book Free Consultation →';
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 4000);
  });
}

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── INITIALIZATION & ZERO-DELAY REAL-TIME SYNC ───
let lastSyncTimestamp = '';

function checkForUpdates() {
  try {
    const updated = localStorage.getItem('charak_config_updated');
    if (updated && updated !== lastSyncTimestamp) {
      lastSyncTimestamp = updated;
      loadSiteData();
    }
  } catch(e) {}
}

// 1. Instant execution on script load
loadSiteData();

// 2. DOMContentLoaded (if page was still parsing)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSiteData);
}

// 3. Window Load
window.addEventListener('load', loadSiteData);

// 4. BroadcastChannel (0ms real-time tab-to-tab sync)
try {
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel('charak_sync_channel');
    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'CONFIG_UPDATED') {
        loadSiteData();
      }
    };
  }
} catch(e) {}

// 5. Cross-tab storage event
window.addEventListener('storage', (e) => {
  if (!e || e.key === 'charak_site_config' || e.key === 'charak_config_updated') {
    loadSiteData();
  }
});

// 6. Custom event in same window
window.addEventListener('charak_config_changed', loadSiteData);

// 7. Tab visibility & focus (reloads immediately when user returns to website tab)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') loadSiteData();
});
window.addEventListener('focus', loadSiteData);

// 8. Polling heartbeat every 500ms (ensures 100% sync even in file:/// mode where events are muted)
setInterval(checkForUpdates, 500);
