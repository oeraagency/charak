/**
 * CHARAK ADMIN PANEL — LOGIC
 * ===========================
 * Complete admin panel functionality:
 * - Load/save config from localStorage
 * - Add/edit/delete products, medicines, experts, etc.
 * - Image upload (base64)
 * - Export/import JSON
 */

// ─── STATE ───────────────────────────────────────────────
let config = {};

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  config = CharakDB.load();
  initAll();
  updateDashStats();

  // Sidebar navigation
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      const panel = link.dataset.panel;
      if (panel) showPanel(panel);
    });
  });

  // Mobile sidebar
  document.getElementById('mobMenuBtn').addEventListener('click', () => {
    document.getElementById('adminSidebar').classList.toggle('open');
  });

  // Save button
  document.getElementById('saveAllBtn').addEventListener('click', saveAll);

  // Export Live data.js for production website
  const exportLiveHandler = (e) => {
    e.preventDefault();
    gatherAllInputs();
    CharakDB.save(config);
    CharakDB.exportDataJS(config);
    showToast('🚀 Live data.js downloaded! Replace in website folder for live hosting.', 'success');
  };
  const pubBtn = document.getElementById('publishLiveBtn');
  if (pubBtn) pubBtn.addEventListener('click', exportLiveHandler);
  const sbExportLive = document.getElementById('sidebarExportLive');
  if (sbExportLive) sbExportLive.addEventListener('click', exportLiveHandler);

  // Export JSON Config
  document.getElementById('sidebarExport').addEventListener('click', (e) => {
    e.preventDefault();
    gatherAllInputs();
    CharakDB.exportJSON(config);
    showToast('✅ Config exported!', 'success');
  });

  // Import
  document.getElementById('sidebarImport').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('importFileInput').click();
  });
  document.getElementById('importFileInput').addEventListener('change', function() {
    if (!this.files[0]) return;
    CharakDB.importJSON(this.files[0], (err, imported) => {
      if (err) { showToast('❌ Invalid JSON file', 'error'); return; }
      config = imported;
      CharakDB.save(config);
      initAll();
      showToast('✅ Config imported successfully!', 'success');
      this.value = '';
    });
  });

  // Reset
  document.getElementById('sidebarReset').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('⚠️ Are you sure? All changes will be lost!')) {
      config = CharakDB.reset();
      initAll();
      showToast('🔄 Reset to defaults', 'success');
    }
  });

  // WhatsApp preview update
  document.getElementById('wa-number').addEventListener('input', updateWAPreview);
  document.getElementById('wa-message').addEventListener('input', updateWAPreview);

  // Update last saved time
  updateLastSaved();
});

// ─── SHOW PANEL ───────────────────────────────────────────
function showPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');

  const link = document.querySelector(`[data-panel="${id}"]`);
  if (link) link.classList.add('active');

  const titles = {
    dashboard: 'Dashboard', general: 'General Info', whatsapp: 'WhatsApp Settings',
    contact: 'Contact & Social', hero: 'Hero Section', products: 'Products',
    medicines: 'Medicines', therapies: 'Therapies', yoga: 'Yoga Programs',
    hospital: 'Hospital', experts: 'Experts / Doctors', about: 'About Section',
    testimonials: 'Testimonials'
  };
  document.getElementById('topbarTitle').textContent = titles[id] || id;

  // Close mobile sidebar
  document.getElementById('adminSidebar').classList.remove('open');
}

// ─── INIT ALL PANELS ──────────────────────────────────────
function initAll() {
  loadGeneral();
  loadWhatsapp();
  loadContact();
  loadHero();
  renderProducts();
  renderMedicines();
  loadTherapies();
  loadYoga();
  loadHospital();
  renderExperts();
  loadAbout();
  renderTestimonials();
  updateDashStats();
  updateLastSaved();
}

// ─── SAVE ALL ─────────────────────────────────────────────
function saveAll() {
  gatherAllInputs();
  const ok = CharakDB.save(config);
  if (ok) {
    showToast('💾 All changes saved!', 'success');
    updateLastSaved();
    // Notify main site if open
    try { localStorage.setItem('charak_config_updated', Date.now()); } catch(e) {}
  } else {
    showToast('❌ Save failed — storage may be full', 'error');
  }
}

function gatherAllInputs() {
  gatherGeneral();
  gatherWhatsapp();
  gatherContact();
  gatherHero();
  gatherTherapies();
  gatherYoga();
  gatherHospital();
  gatherAbout();
  saveTestimonialsFromUI();
}

// ─── GENERAL ──────────────────────────────────────────────
function loadGeneral() {
  const g = config.general;
  setVal('g-siteName',    g.siteName);
  setVal('g-tagline',     g.tagline);
  setVal('g-established', g.established);
  setVal('g-description', g.description);
  if (g.logo) showImgPreview('logoPreview', g.logo);
}
function gatherGeneral() {
  config.general.siteName    = getVal('g-siteName');
  config.general.tagline     = getVal('g-tagline');
  config.general.established = getVal('g-established');
  config.general.description = getVal('g-description');
  const logo = getVal('g-logo');
  if (logo) config.general.logo = logo;
}

// ─── WHATSAPP ─────────────────────────────────────────────
function loadWhatsapp() {
  const wa = config.whatsapp;
  document.getElementById('wa-enabled').checked = wa.enabled;
  setVal('wa-number',   wa.number);
  setVal('wa-message',  wa.message);
  setSelect('wa-position', wa.position);
  updateWAPreview();
}
function gatherWhatsapp() {
  config.whatsapp.enabled  = document.getElementById('wa-enabled').checked;
  config.whatsapp.number   = getVal('wa-number');
  config.whatsapp.message  = getVal('wa-message');
  config.whatsapp.position = getVal('wa-position');
}
function toggleWAPreview() {
  const label = document.getElementById('wa-toggle-label');
  label.textContent = document.getElementById('wa-enabled').checked ? 'Enabled' : 'Disabled';
}
function updateWAPreview() {
  const num = getVal('wa-number').replace(/\D/g,'');
  const msg = encodeURIComponent(getVal('wa-message') || '');
  const link = `https://wa.me/${num}?text=${msg}`;
  document.getElementById('waLinkPreview').textContent = link;
}

// ─── CONTACT ──────────────────────────────────────────────
function loadContact() {
  const c = config.contact;
  const s = config.social || {};
  setVal('c-address', c.address);
  setVal('c-phone',   c.phone);
  setVal('c-email',   c.email);
  setVal('c-hours',   c.hours);
  setVal('s-facebook',  s.facebook);
  setVal('s-instagram', s.instagram);
  setVal('s-youtube',   s.youtube);
  setVal('s-tiktok',    s.tiktok);
  setVal('s-whatsapp',  s.whatsapp);
}
function gatherContact() {
  config.contact.address  = getVal('c-address');
  config.contact.phone    = getVal('c-phone');
  config.contact.email    = getVal('c-email');
  config.contact.hours    = getVal('c-hours');
  if (!config.social) config.social = {};
  config.social.facebook  = getVal('s-facebook');
  config.social.instagram = getVal('s-instagram');
  config.social.youtube   = getVal('s-youtube');
  config.social.tiktok    = getVal('s-tiktok');
  config.social.whatsapp  = getVal('s-whatsapp');
}

// ─── HERO ─────────────────────────────────────────────────
function loadHero() {
  const h = config.hero;
  setVal('h-badge',   h.badge);
  setVal('h-title1',  h.title1);
  setVal('h-title2',  h.title2);
  setVal('h-subtitle',h.subtitle);
  setVal('h-btn1text',h.btn1Text);
  setVal('h-btn2text',h.btn2Text);
  if (h.heroImage) showImgPreview('heroImgPreview', h.heroImage);
  renderHeroStats();
}
function gatherHero() {
  config.hero.badge    = getVal('h-badge');
  config.hero.title1   = getVal('h-title1');
  config.hero.title2   = getVal('h-title2');
  config.hero.subtitle = getVal('h-subtitle');
  config.hero.btn1Text = getVal('h-btn1text');
  config.hero.btn2Text = getVal('h-btn2text');
  const img = getVal('h-heroImg');
  if (img) config.hero.heroImage = img;
  // Stats
  config.hero.stats = [];
  document.querySelectorAll('.hero-stat-row').forEach(row => {
    config.hero.stats.push({
      number: parseInt(row.querySelector('.stat-num-inp').value) || 0,
      suffix: row.querySelector('.stat-suffix-inp').value || '+',
      label:  row.querySelector('.stat-label-inp').value || ''
    });
  });
}
function renderHeroStats() {
  const c = document.getElementById('heroStatsContainer');
  c.innerHTML = '';
  config.hero.stats.forEach((stat, i) => {
    c.innerHTML += `
    <div class="hero-stat-row" style="display:grid; grid-template-columns:1fr 80px 1fr auto; gap:0.75rem; margin-bottom:0.75rem; align-items:end">
      <div class="form-group" style="margin:0"><label class="field-label">Number</label><input type="number" class="stat-num-inp" value="${stat.number}" /></div>
      <div class="form-group" style="margin:0"><label class="field-label">Suffix</label><input type="text" class="stat-suffix-inp" value="${stat.suffix}" /></div>
      <div class="form-group" style="margin:0"><label class="field-label">Label</label><input type="text" class="stat-label-inp" value="${stat.label}" /></div>
      <button class="btn btn-danger btn-sm" onclick="this.closest('.hero-stat-row').remove()">🗑</button>
    </div>`;
  });
}
function addHeroStat() {
  config.hero.stats.push({ number: 0, suffix: '+', label: 'New Stat' });
  renderHeroStats();
}

// ─── PRODUCTS ─────────────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  config.products.forEach((p, i) => {
    grid.innerHTML += `
    <div class="item-card">
      <div class="item-card-img">${p.image ? `<img src="${p.image}" alt="${p.name}" />` : (p.badge ? `<span style="font-size:2rem">🌿</span>` : '🌿')}</div>
      <div class="item-card-body">
        <span class="item-cat">${p.category}</span>
        <h4>${p.name}</h4>
        <p>${p.description}</p>
        ${p.badge ? `<span class="preview-badge badge-${p.badgeColor}">${p.badge}</span>` : ''}
      </div>
      <div class="item-card-footer">
        <span class="item-price">${p.price}</span>
        <div class="item-actions">
          <button class="btn btn-ghost btn-sm" onclick="editProduct(${i})">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${i})">🗑</button>
        </div>
      </div>
    </div>`;
  });
  grid.innerHTML += `<div class="item-card add-new" onclick="openProductModal()"><span class="add-new-icon">➕</span><span>Add New Product</span></div>`;
}

// ─── UNIVERSAL MULTI-IMAGE GALLERY SYSTEM ───
const activeGalleries = {
  prod: [],
  med: [],
  therapy: [],
  yoga: [],
  hosp: []
};

function getGalleryContainerId(prefix) {
  if (prefix === 'prod') return 'prodGalleryThumbs';
  if (prefix === 'med') return 'medGalleryThumbs';
  if (prefix === 'therapy') return 'therapyGalleryThumbs';
  if (prefix === 'yoga') return 'yogaGalleryThumbs';
  if (prefix === 'hosp') return 'hospGalleryThumbs';
  return prefix + 'GalleryThumbs';
}

function handleMultiImgSelect(input, prefix) {
  const files = Array.from(input.files || []);
  if (!files.length) return;

  if (!activeGalleries[prefix]) activeGalleries[prefix] = [];
  const targetArr = activeGalleries[prefix];
  let remaining = files.length;

  files.forEach(file => {
    if (file.size > 4 * 1024 * 1024) {
      showToast(`⚠️ "${file.name}" 4MB سے بڑی ہے`, 'error');
      remaining--;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      targetArr.push(e.target.result);
      remaining--;
      if (remaining === 0) {
        renderGalleryThumbs(prefix);
        showToast(`📸 ${files.length} تصاویر گیلری میں شامل ہو گئیں!`, 'success');
      }
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function renderGalleryThumbs(prefix) {
  const containerId = getGalleryContainerId(prefix);
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = activeGalleries[prefix] || [];
  container.innerHTML = '';

  list.forEach((imgSrc, idx) => {
    const item = document.createElement('div');
    item.className = `gallery-thumb-item ${idx === 0 ? 'cover' : ''}`;
    item.innerHTML = `
      <img src="${imgSrc}" alt="Photo ${idx+1}" />
      <button type="button" class="gallery-thumb-del" onclick="removeGalleryImg('${prefix}', ${idx})">✕</button>
      ${idx === 0 ? '<span class="gallery-thumb-cover-tag">Main Cover</span>' : ''}
    `;
    item.title = idx === 0 ? 'مین کور فوٹو' : 'کلک کر کے مین کور بنائیں';
    if (idx !== 0) {
      item.onclick = (e) => {
        if (e.target.closest('.gallery-thumb-del')) return;
        setCoverImage(prefix, idx);
      };
    }
    container.appendChild(item);
  });

  const hiddenImg = document.getElementById(prefix + '-img');
  if (hiddenImg) {
    hiddenImg.value = list.length > 0 ? list[0] : '';
  }
}

function removeGalleryImg(prefix, idx) {
  const list = activeGalleries[prefix] || [];
  list.splice(idx, 1);
  renderGalleryThumbs(prefix);
}

function setCoverImage(prefix, idx) {
  const list = activeGalleries[prefix] || [];
  const [chosen] = list.splice(idx, 1);
  list.unshift(chosen);
  renderGalleryThumbs(prefix);
  showToast('⭐ مین کور فوٹو سیٹ ہو گئی', 'success');
}

// ─── UNIVERSAL CUSTOM SECTIONS BUILDER (WITH ON/OFF TOGGLE) ───
function resolveCustomSectionsContainerId(target) {
  if (target === 'prod') return 'prodCustomSectionsContainer';
  if (target === 'med') return 'medCustomSectionsContainer';
  if (target === 'therapy' || target === 'therapyCustomSectionsContainer') return 'therapyCustomSectionsContainer';
  if (target === 'yoga' || target === 'yogaCustomSectionsContainer') return 'yogaCustomSectionsContainer';
  if (target === 'hosp' || target === 'hospCustomSectionsContainer') return 'hospCustomSectionsContainer';
  return target;
}

function addCustomSectionRow(target, title = '', content = '', enabled = true) {
  const containerId = resolveCustomSectionsContainerId(target);
  const container = document.getElementById(containerId);
  if (!container) return;

  const row = document.createElement('div');
  const isEnabled = enabled !== false;
  row.className = 'custom-section-row' + (isEnabled ? '' : ' section-disabled');
  row.dataset.enabled = isEnabled ? 'true' : 'false';

  row.innerHTML = `
    <div class="custom-section-row-header">
      <input type="text" class="csr-title form-control" placeholder="Section Name (e.g. Program Overview, Diet Rules, Benefits, Schedule)" value="${escapeHtml(title)}" />
      <div class="csr-actions">
        <button type="button" class="btn-toggle-sec ${isEnabled ? 'active' : 'inactive'}" onclick="toggleCustomSectionStatus(this)" title="Toggle Section On/Off">
          ${isEnabled ? '🟢 Active / آن' : '⚪ Disabled / آف'}
        </button>
        <button type="button" class="btn-del-sec" onclick="this.closest('.custom-section-row').remove()" title="Delete Section">🗑 Delete</button>
      </div>
    </div>
    <textarea class="csr-content form-control" rows="2" placeholder="Section details, instructions, explanation...">${escapeHtml(content)}</textarea>
  `;
  container.appendChild(row);
}

function toggleCustomSectionStatus(btn) {
  const row = btn.closest('.custom-section-row');
  const isCurrentlyEnabled = row.dataset.enabled === 'true';
  const newStatus = !isCurrentlyEnabled;
  row.dataset.enabled = newStatus ? 'true' : 'false';
  row.classList.toggle('section-disabled', !newStatus);
  btn.classList.toggle('active', newStatus);
  btn.classList.toggle('inactive', !newStatus);
  btn.innerHTML = newStatus ? '🟢 Active / آن' : '⚪ Disabled / آف';
}

function getCustomSectionsFromUI(target) {
  const containerId = resolveCustomSectionsContainerId(target);
  const container = document.getElementById(containerId);
  if (!container) return [];
  const rows = container.querySelectorAll('.custom-section-row');
  const sections = [];
  rows.forEach(r => {
    const t = r.querySelector('.csr-title')?.value.trim();
    const c = r.querySelector('.csr-content')?.value.trim();
    const enabled = r.dataset.enabled !== 'false';
    if (t || c) {
      sections.push({ title: t || 'Section', content: c || '', enabled });
    }
  });
  return sections;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function openProductModal(editIdx = -1) {
  clearModalFields(['prod-editId','prod-name','prod-category','prod-desc','prod-price','prod-badge','prod-badgeColor','prod-ingredients','prod-dosage']);
  document.getElementById('productModalTitle').textContent = editIdx >= 0 ? 'Edit Product / Program' : 'Add Product / Program';
  activeGalleries['prod'] = [];
  const secContainer = document.getElementById('prodCustomSectionsContainer');
  if (secContainer) secContainer.innerHTML = '';

  if (editIdx >= 0) {
    const p = config.products[editIdx];
    setVal('prod-editId',  editIdx);
    setVal('prod-name',    p.name);
    setVal('prod-category',p.category);
    setVal('prod-desc',    p.description);
    setVal('prod-price',   p.price);
    setVal('prod-badge',   p.badge);
    setVal('prod-badgeColor', p.badgeColor);
    setVal('prod-ingredients', Array.isArray(p.ingredients) ? p.ingredients.join('\n') : (p.ingredients || ''));
    setVal('prod-dosage', p.dosage || '');

    // Gallery
    if (Array.isArray(p.gallery) && p.gallery.length > 0) {
      activeGalleries['prod'] = [...p.gallery];
    } else if (p.image) {
      activeGalleries['prod'] = [p.image];
    } else {
      activeGalleries['prod'] = ['charak_herbs.png'];
    }

    // Custom Sections
    if (Array.isArray(p.customSections) && p.customSections.length > 0) {
      p.customSections.forEach(s => addCustomSectionRow('prod', s.title, s.content, s.enabled !== false));
    }
  } else {
    setVal('prod-editId', -1);
    activeGalleries['prod'] = ['charak_herbs.png'];
    // Pre-populate default sections for easy editing or disabling
    addCustomSectionRow('prod', '🌿 Key Herbal Ingredients & Benefits', 'Pure Botanical Root Extract (Standardized active withanolides)\nBio-enhancing herbal catalyst for complete absorption\n100% Vegetarian Plant-based Capsules — Chemical Free', true);
    addCustomSectionRow('prod', '⏱ Recommended Dosage & How to Use', '1 capsule twice daily after meals with lukewarm water or milk, or as advised by your physician.', true);
  }
  renderGalleryThumbs('prod');
  openModal('productModal');
}

function editProduct(i)   { openProductModal(i); }
function formatPriceInput(val) {
  if (window.CharakDB && typeof window.CharakDB.formatPrice === 'function') {
    return window.CharakDB.formatPrice(val);
  }
  if (!val) return 'Rs. 450';
  let s = String(val).trim();
  s = s.replace(/[₹₨]|pkr|rs\.?/gi, '').trim();
  return 'Rs. ' + (s || '450');
}

function deleteProduct(i) {
  if (confirm(`Delete "${config.products[i].name}"?`)) {
    config.products.splice(i, 1);
    CharakDB.save(config);
    renderProducts();
    showToast('🗑 Product deleted', 'success');
  }
}

function saveProduct() {
  const editId = getVal('prod-editId');
  const isEdit = editId !== '' && editId !== '-1' && editId !== null && !isNaN(parseInt(editId, 10)) && parseInt(editId, 10) >= 0;
  const idx = isEdit ? parseInt(editId, 10) : -1;

  const ingRaw = getVal('prod-ingredients');
  const ingredients = ingRaw ? ingRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];
  const customSections = getCustomSectionsFromUI('prod');

  const gallery = activeGalleries['prod'].length > 0 ? [...activeGalleries['prod']] : ['charak_herbs.png'];
  const mainImage = gallery[0] || 'charak_herbs.png';

  const prod = {
    id:          isEdit ? config.products[idx]?.id : 'prod-' + Date.now(),
    name:        getVal('prod-name') || 'Herbal Product',
    category:    getVal('prod-category') || 'Ayurveda',
    description: getVal('prod-desc'),
    price:       CharakDB.formatPrice(getVal('prod-price')),
    badge:       getVal('prod-badge'),
    badgeColor:  getVal('prod-badgeColor') || '',
    image:       mainImage,
    gallery:     gallery,
    ingredients: ingredients.length > 0 ? ingredients : [
      "Pure Botanical Root Extract (Standardized active withanolides)",
      "Bio-enhancing herbal catalyst for complete absorption",
      "100% Vegetarian Plant-based Capsules — Chemical Free"
    ],
    dosage:      getVal('prod-dosage') || "1 capsule twice daily after meals with lukewarm water or milk.",
    customSections: customSections
  };

  if (isEdit && idx < config.products.length) {
    config.products[idx] = prod;
  } else {
    config.products.push(prod);
  }

  CharakDB.save(config);
  renderProducts();
  closeModal('productModal');
  showToast('✅ Product saved & updated live on website!', 'success');
}

// ─── MEDICINES ────────────────────────────────────────────
function renderMedicines() {
  const grid = document.getElementById('medicinesGrid');
  grid.innerHTML = '';
  config.medicines.forEach((m, i) => {
    grid.innerHTML += `
    <div class="item-card">
      <div class="item-card-img">${m.image ? `<img src="${m.image}" alt="${m.name}" />` : `<span style="font-size:2.5rem">${m.icon}</span>`}</div>
      <div class="item-card-body">
        <span class="item-cat">${m.category} ${m.featured ? '⭐ Featured' : ''}</span>
        <h4>${m.name}</h4>
        <p>${m.description}</p>
      </div>
      <div class="item-card-footer">
        <span class="item-price">${m.price}</span>
        <div class="item-actions">
          <button class="btn btn-ghost btn-sm" onclick="editMedicine(${i})">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteMedicine(${i})">🗑</button>
        </div>
      </div>
    </div>`;
  });
  grid.innerHTML += `<div class="item-card add-new" onclick="openMedModal()"><span class="add-new-icon">➕</span><span>Add New Medicine</span></div>`;
}

function openMedModal(editIdx = -1) {
  clearModalFields(['med-editId','med-name','med-category','med-desc','med-price','med-icon','med-benefits','med-dosage']);
  document.getElementById('med-featured').checked = false;
  document.getElementById('medModalTitle').textContent = editIdx >= 0 ? 'Edit Medicine' : 'Add Medicine';
  activeGalleries['med'] = [];
  const secContainer = document.getElementById('medCustomSectionsContainer');
  if (secContainer) secContainer.innerHTML = '';

  if (editIdx >= 0) {
    const m = config.medicines[editIdx];
    setVal('med-editId',  editIdx);
    setVal('med-name',    m.name);
    setVal('med-category',m.category);
    setVal('med-desc',    m.description);
    setVal('med-price',   m.price);
    setVal('med-icon',    m.icon);
    setVal('med-benefits', Array.isArray(m.benefits) ? m.benefits.join('\n') : (m.benefits || ''));
    setVal('med-dosage',  m.dosage || '');
    document.getElementById('med-featured').checked = !!m.featured;

    // Gallery
    if (Array.isArray(m.gallery) && m.gallery.length > 0) {
      activeGalleries['med'] = [...m.gallery];
    } else if (m.image) {
      activeGalleries['med'] = [m.image];
    }

    // Custom Sections
    if (Array.isArray(m.customSections) && m.customSections.length > 0) {
      m.customSections.forEach(s => addCustomSectionRow('med', s.title, s.content, s.enabled !== false));
    }
  } else {
    setVal('med-editId', -1);
    // Pre-populate default sections for easy editing or disabling
    addCustomSectionRow('med', '🌿 Key Indications & Healing Benefits', 'Natural holistic healing without synthetic chemicals\nBalances vital doshas (Vata, Pitta, Kapha) in the body\nStrengthens organic immunity and vital vitality', true);
    addCustomSectionRow('med', '⏱ Recommended Dosage', '1-2 tablets/capsules twice daily with warm water after meals, or as prescribed.', true);
  }
  renderGalleryThumbs('med');
  openModal('medicineModal');
}

function editMedicine(i)   { openMedModal(i); }
function deleteMedicine(i) {
  if (confirm(`Delete "${config.medicines[i].name}"?`)) {
    config.medicines.splice(i, 1);
    CharakDB.save(config);
    renderMedicines();
    showToast('🗑 Medicine deleted', 'success');
  }
}

function saveMedicine() {
  const editId = getVal('med-editId');
  const isEdit = editId !== '' && editId !== '-1' && editId !== null && !isNaN(parseInt(editId, 10)) && parseInt(editId, 10) >= 0;
  const idx = isEdit ? parseInt(editId, 10) : -1;

  const benRaw = getVal('med-benefits');
  const benefits = benRaw ? benRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];
  const customSections = getCustomSectionsFromUI('med');

  const gallery = activeGalleries['med'].length > 0 ? [...activeGalleries['med']] : [];
  const mainImage = gallery[0] || (isEdit ? config.medicines[idx]?.image : null);

  const med = {
    id:          isEdit ? config.medicines[idx]?.id : 'med-' + Date.now(),
    name:        getVal('med-name') || 'Herbal Medicine',
    category:    getVal('med-category') || 'Ayurveda',
    description: getVal('med-desc'),
    price:       CharakDB.formatPrice(getVal('med-price')),
    icon:        getVal('med-icon') || '🌿',
    featured:    document.getElementById('med-featured').checked,
    image:       mainImage,
    gallery:     gallery,
    benefits:    benefits.length > 0 ? benefits : [
      "Natural holistic healing without synthetic chemicals",
      "Balances vital doshas (Vata, Pitta, Kapha) in the body",
      "Strengthens organic immunity and vital vitality"
    ],
    dosage:      getVal('med-dosage') || "1-2 tablets twice daily after meals with lukewarm water.",
    customSections: customSections
  };

  if (isEdit && idx < config.medicines.length) {
    config.medicines[idx] = med;
  } else {
    config.medicines.push(med);
  }

  CharakDB.save(config);
  renderMedicines();
  closeModal('medicineModal');
  showToast('✅ Medicine saved & updated live on website!', 'success');
}

// ─── THERAPIES (FULL INTERACTIVE CRUD) ─────────────────────
function loadTherapies() {
  renderTherapiesList();
}

function gatherTherapies() {
  // Handled automatically via saveTherapy & CharakDB
}

function renderTherapiesList() {
  const grid = document.getElementById('therapiesAdminGrid');
  if (!grid || !config.therapies) return;
  grid.innerHTML = '';

  // 1. Featured Therapy Card
  const feat = config.therapies.featured;
  if (feat) {
    const featImg = feat.image || (feat.gallery && feat.gallery[0]) || 'charak_therapy.png';
    const isAct = feat.active !== false;
    grid.innerHTML += `
      <div class="item-card">
        <div class="item-card-img">
          <img src="${featImg}" alt="${feat.name}" onerror="this.src='charak_therapy.png'" />
        </div>
        <div class="item-card-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem">
            <span class="item-cat">⭐ FEATURED • ${feat.tag || 'Signature'}</span>
            <span class="item-status-pill ${isAct ? 'active' : 'inactive'}">${isAct ? '🟢 Active' : '⚪ Hidden'}</span>
          </div>
          <h4>${feat.name}</h4>
          <p>${feat.description || ''}</p>
          <small style="color:var(--text-muted); display:block; margin-top:0.4rem">⏱ Duration: ${feat.duration || '90-120 min'}</small>
        </div>
        <div class="item-card-footer">
          <span style="font-size:0.8rem; color:var(--gold-dark); font-weight:600">Main Homepage Card</span>
          <div class="item-actions">
            <button class="btn btn-ghost btn-sm" onclick="toggleTherapyActive('featured')">${isAct ? 'Disable' : 'Enable'}</button>
            <button class="btn btn-primary btn-sm" onclick="openTherapyModal('featured')">✏️ Edit</button>
          </div>
        </div>
      </div>
    `;
  }

  // 2. Regular Therapy Cards
  const list = Array.isArray(config.therapies.list) ? config.therapies.list : [];
  list.forEach((t, i) => {
    const tImg = t.image || (t.gallery && t.gallery[0]) || 'charak_therapy.png';
    const isAct = t.active !== false;
    grid.innerHTML += `
      <div class="item-card">
        <div class="item-card-img">
          ${t.image || (t.gallery && t.gallery.length > 0) ? `<img src="${tImg}" alt="${t.name}" onerror="this.src='charak_therapy.png'" />` : `<span style="font-size:3rem">${t.icon || '✨'}</span>`}
        </div>
        <div class="item-card-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem">
            <span class="item-cat">${t.tag || 'Therapy'}</span>
            <span class="item-status-pill ${isAct ? 'active' : 'inactive'}">${isAct ? '🟢 Active' : '⚪ Hidden'}</span>
          </div>
          <h4>${t.icon ? t.icon + ' ' : ''}${t.name}</h4>
          <p>${t.description || ''}</p>
          <small style="color:var(--text-muted); display:block; margin-top:0.4rem">⏱ Duration: ${t.duration || 'Session'}</small>
        </div>
        <div class="item-card-footer">
          <button class="btn btn-ghost btn-sm" onclick="toggleTherapyActive('list', ${i})">${isAct ? 'Disable' : 'Enable'}</button>
          <div class="item-actions">
            <button class="btn btn-ghost btn-sm" onclick="openTherapyModal('list', ${i})">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteTherapy('list', ${i})">🗑</button>
          </div>
        </div>
      </div>
    `;
  });

  // 3. Add New Therapy Card
  grid.innerHTML += `
    <div class="item-card add-new" onclick="openTherapyModal('new')">
      <span class="add-new-icon">➕</span>
      <span>Add New Therapy</span>
    </div>
  `;
}

function openTherapyModal(editType = 'new', editIdx = -1) {
  clearModalFields(['th-name', 'th-tag', 'th-duration', 'th-desc']);
  document.getElementById('th-editId').value = `${editType}:${editIdx}`;
  activeGalleries['therapy'] = [];
  const secContainer = document.getElementById('therapyCustomSectionsContainer');
  if (secContainer) secContainer.innerHTML = '';

  const modalTitle = document.getElementById('therapyModalTitle');

  if (editType === 'featured') {
    modalTitle.textContent = 'Edit Featured Therapy (Panchakarma)';
    const t = config.therapies.featured;
    setVal('th-name', t.name);
    setVal('th-tag', t.tag || 'Signature');
    setVal('th-duration', t.duration || '90-120 min');
    setVal('th-desc', t.description || '');
    document.getElementById('th-active').checked = t.active !== false;
    document.getElementById('th-isFeatured').checked = true;
    document.getElementById('th-isFeatured').disabled = true;

    activeGalleries['therapy'] = Array.isArray(t.gallery) && t.gallery.length > 0 ? [...t.gallery] : (t.image ? [t.image] : ['charak_therapy.png']);

    if (Array.isArray(t.customSections) && t.customSections.length > 0) {
      t.customSections.forEach(s => addCustomSectionRow('therapyCustomSectionsContainer', s.title, s.content, s.enabled !== false));
    } else {
      addCustomSectionRow('therapyCustomSectionsContainer', '✨ Therapeutic Benefits & Healing Actions', '• Deep cellular detoxification & chronic toxin (Ama) elimination\n• Soothes joint inflammation, muscular spasms & spinal stiffness\n• Normalizes Vata, Pitta, and Kapha biological doshas', true);
      addCustomSectionRow('therapyCustomSectionsContainer', '📋 Pre & Post Therapy Protocol', 'Includes comprehensive Nadi Pariksha (Pulse Assessment), personalized herbal steam (Swedana), and specialized restorative sattvic dietary plan.', true);
    }

  } else if (editType === 'list' && editIdx >= 0) {
    modalTitle.textContent = 'Edit Therapy';
    const t = config.therapies.list[editIdx];
    setVal('th-name', t.name);
    setVal('th-tag', t.tag || 'Natural Therapy');
    setVal('th-duration', t.duration || '60 min session');
    setVal('th-desc', t.description || '');
    document.getElementById('th-active').checked = t.active !== false;
    document.getElementById('th-isFeatured').checked = false;
    document.getElementById('th-isFeatured').disabled = false;

    activeGalleries['therapy'] = Array.isArray(t.gallery) && t.gallery.length > 0 ? [...t.gallery] : (t.image ? [t.image] : ['charak_therapy.png']);

    if (Array.isArray(t.customSections) && t.customSections.length > 0) {
      t.customSections.forEach(s => addCustomSectionRow('therapyCustomSectionsContainer', s.title, s.content, s.enabled !== false));
    } else {
      addCustomSectionRow('therapyCustomSectionsContainer', '✨ Therapeutic Benefits', 'Relieves tension, nourishes deep tissues, balances doshas, and promotes restful healing.', true);
      addCustomSectionRow('therapyCustomSectionsContainer', '📋 Therapy Protocol', 'Administered by trained Ayurvedic Vaidyas using dosha-specific herbal medicated oils.', true);
    }

  } else {
    modalTitle.textContent = 'Add New Therapy';
    document.getElementById('th-active').checked = true;
    document.getElementById('th-isFeatured').checked = false;
    document.getElementById('th-isFeatured').disabled = false;
    activeGalleries['therapy'] = ['charak_therapy.png'];

    addCustomSectionRow('therapyCustomSectionsContainer', '✨ Therapeutic Benefits', 'Key benefits and healing effects of this therapy session.', true);
    addCustomSectionRow('therapyCustomSectionsContainer', '📋 Session Protocol & Oils Used', 'Instructions, session flow, herbal oils used, and follow-up guidance.', true);
  }

  renderGalleryThumbs('therapy');
  openModal('therapyModal');
}

function saveTherapy() {
  const meta = (document.getElementById('th-editId').value || '').split(':');
  const editType = meta[0] || 'new';
  const editIdx = parseInt(meta[1] || '-1', 10);

  const gallery = activeGalleries['therapy'].length > 0 ? [...activeGalleries['therapy']] : ['charak_therapy.png'];
  const customSections = getCustomSectionsFromUI('therapyCustomSectionsContainer');

  const therapyData = {
    id:          'th-' + Date.now(),
    name:        getVal('th-name') || 'Ayurvedic Therapy',
    tag:         getVal('th-tag') || 'Natural Therapy',
    duration:    getVal('th-duration') || '60 min session',
    description: getVal('th-desc') || '',
    active:      document.getElementById('th-active').checked,
    image:       gallery[0] || 'charak_therapy.png',
    gallery:     gallery,
    customSections: customSections
  };

  if (editType === 'featured') {
    config.therapies.featured = {
      ...config.therapies.featured,
      ...therapyData
    };
  } else if (editType === 'list' && editIdx >= 0 && editIdx < config.therapies.list.length) {
    therapyData.id = config.therapies.list[editIdx].id || therapyData.id;
    config.therapies.list[editIdx] = {
      ...config.therapies.list[editIdx],
      ...therapyData
    };
  } else {
    if (document.getElementById('th-isFeatured').checked) {
      config.therapies.featured = therapyData;
    } else {
      if (!Array.isArray(config.therapies.list)) config.therapies.list = [];
      config.therapies.list.push(therapyData);
    }
  }

  CharakDB.save(config);
  renderTherapiesList();
  closeModal('therapyModal');
  showToast('✅ Therapy saved and live on website!', 'success');
}

function toggleTherapyActive(type, idx) {
  if (type === 'featured' && config.therapies.featured) {
    config.therapies.featured.active = config.therapies.featured.active === false ? true : false;
  } else if (type === 'list' && config.therapies.list && config.therapies.list[idx]) {
    config.therapies.list[idx].active = config.therapies.list[idx].active === false ? true : false;
  }
  CharakDB.save(config);
  renderTherapiesList();
  showToast('Therapy status updated!', 'success');
}

function deleteTherapy(type, idx) {
  if (type === 'list' && config.therapies.list && config.therapies.list[idx]) {
    if (confirm(`Delete therapy "${config.therapies.list[idx].name}"?`)) {
      config.therapies.list.splice(idx, 1);
      CharakDB.save(config);
      renderTherapiesList();
      showToast('🗑 Therapy deleted', 'success');
    }
  }
}

// ─── YOGA (FULL INTERACTIVE CRUD) ──────────────────────────
function loadYoga() {
  if (config.yoga && config.yoga.floatingBadge) {
    setVal('yoga-badge', config.yoga.floatingBadge);
  }
  renderYogaProgramsList();
}

function gatherYoga() {
  if (config.yoga) {
    config.yoga.floatingBadge = getVal('yoga-badge') || '🧘 Daily Sessions Available';
  }
}

function autoSaveYogaBadge() {
  if (!config.yoga) config.yoga = {};
  config.yoga.floatingBadge = getVal('yoga-badge') || '🧘 Daily Sessions Available';
  CharakDB.save(config);
  showToast('🧘 Yoga badge text updated!', 'success');
}

function renderYogaProgramsList() {
  const grid = document.getElementById('yogaAdminGrid');
  if (!grid || !config.yoga) return;
  grid.innerHTML = '';

  const progs = Array.isArray(config.yoga.programs) ? config.yoga.programs : [];
  progs.forEach((p, idx) => {
    const isAct = p.active !== false;
    const pImg = p.image || (p.gallery && p.gallery[0]) || 'charak_yoga.png';
    grid.innerHTML += `
      <div class="item-card">
        <div class="item-card-img">
          <img src="${pImg}" alt="${p.name}" onerror="this.src='charak_yoga.png'" />
        </div>
        <div class="item-card-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem">
            <span class="item-cat">Program #${p.num || (idx + 1)}</span>
            <span class="item-status-pill ${isAct ? 'active' : 'inactive'}">${isAct ? '🟢 Active' : '⚪ Hidden'}</span>
          </div>
          <h4>${p.name}</h4>
          ${p.schedule ? `<small style="display:block; color:var(--forest); font-weight:600; margin-bottom:0.3rem">⏰ ${p.schedule}</small>` : ''}
          <p>${p.desc || ''}</p>
        </div>
        <div class="item-card-footer">
          <button class="btn btn-ghost btn-sm" onclick="toggleYogaActive(${idx})">${isAct ? 'Disable' : 'Enable'}</button>
          <div class="item-actions">
            <button class="btn btn-ghost btn-sm" onclick="openYogaModal(${idx})">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteYogaProgram(${idx})">🗑</button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML += `
    <div class="item-card add-new" onclick="openYogaModal()">
      <span class="add-new-icon">➕</span>
      <span>Add New Yoga Program</span>
    </div>
  `;
}

function openYogaModal(editIdx = -1) {
  clearModalFields(['yoga-num', 'yoga-name', 'yoga-schedule', 'yoga-desc']);
  document.getElementById('yoga-editId').value = editIdx;
  activeGalleries['yoga'] = [];
  const secContainer = document.getElementById('yogaCustomSectionsContainer');
  if (secContainer) secContainer.innerHTML = '';

  const modalTitle = document.getElementById('yogaModalTitle');

  if (editIdx >= 0 && config.yoga && config.yoga.programs[editIdx]) {
    modalTitle.textContent = 'Edit Yoga Program';
    const p = config.yoga.programs[editIdx];
    setVal('yoga-num', p.num || '01');
    setVal('yoga-name', p.name || '');
    setVal('yoga-schedule', p.schedule || '');
    setVal('yoga-desc', p.desc || '');
    document.getElementById('yoga-active').checked = p.active !== false;

    activeGalleries['yoga'] = Array.isArray(p.gallery) && p.gallery.length > 0 ? [...p.gallery] : (p.image ? [p.image] : ['charak_yoga.png']);

    if (Array.isArray(p.customSections) && p.customSections.length > 0) {
      p.customSections.forEach(s => addCustomSectionRow('yogaCustomSectionsContainer', s.title, s.content, s.enabled !== false));
    } else {
      addCustomSectionRow('yogaCustomSectionsContainer', '🧘 What Is Included In This Session', 'Classical Asanas, Therapeutic Pranayama, and guided restorative Yoga Nidra.', true);
      addCustomSectionRow('yogaCustomSectionsContainer', '⏰ Batch Schedule & Timings', 'Morning batches 6:00 AM - 7:30 AM & Evening batches 5:00 PM - 6:30 PM.', true);
    }
  } else {
    modalTitle.textContent = 'Add Yoga Program';
    const nextNum = String((config.yoga && config.yoga.programs ? config.yoga.programs.length : 0) + 1).padStart(2, '0');
    setVal('yoga-num', nextNum);
    document.getElementById('yoga-active').checked = true;
    activeGalleries['yoga'] = ['charak_yoga.png'];

    addCustomSectionRow('yogaCustomSectionsContainer', '🧘 Session Structure & Asanas', 'Overview of poses, pranayama breathwork, and meditation exercises.', true);
    addCustomSectionRow('yogaCustomSectionsContainer', '🌱 Health Benefits & Guidelines', 'Improves spinal flexibility, reduces stress cortisol, and balances blood pressure.', true);
  }

  renderGalleryThumbs('yoga');
  openModal('yogaModal');
}

function saveYogaProgram() {
  const editId = parseInt(document.getElementById('yoga-editId').value || '-1', 10);
  const gallery = activeGalleries['yoga'].length > 0 ? [...activeGalleries['yoga']] : ['charak_yoga.png'];
  const customSections = getCustomSectionsFromUI('yogaCustomSectionsContainer');

  const progData = {
    id:          'yoga-' + Date.now(),
    num:         getVal('yoga-num') || '01',
    name:        getVal('yoga-name') || 'Yoga Session',
    schedule:    getVal('yoga-schedule') || '',
    desc:        getVal('yoga-desc') || '',
    active:      document.getElementById('yoga-active').checked,
    image:       gallery[0] || 'charak_yoga.png',
    gallery:     gallery,
    customSections: customSections
  };

  if (!config.yoga) config.yoga = { programs: [] };
  if (!Array.isArray(config.yoga.programs)) config.yoga.programs = [];

  if (editId >= 0 && editId < config.yoga.programs.length) {
    progData.id = config.yoga.programs[editId].id || progData.id;
    config.yoga.programs[editId] = progData;
  } else {
    config.yoga.programs.push(progData);
  }

  CharakDB.save(config);
  renderYogaProgramsList();
  closeModal('yogaModal');
  showToast('✅ Yoga program saved and live on website!', 'success');
}

function toggleYogaActive(idx) {
  if (config.yoga && config.yoga.programs && config.yoga.programs[idx]) {
    config.yoga.programs[idx].active = config.yoga.programs[idx].active === false ? true : false;
    CharakDB.save(config);
    renderYogaProgramsList();
    showToast('Yoga program status updated!', 'success');
  }
}

function deleteYogaProgram(idx) {
  if (config.yoga && config.yoga.programs && config.yoga.programs[idx]) {
    if (confirm(`Delete yoga program "${config.yoga.programs[idx].name}"?`)) {
      config.yoga.programs.splice(idx, 1);
      CharakDB.save(config);
      renderYogaProgramsList();
      showToast('🗑 Yoga program deleted', 'success');
    }
  }
}

// ─── HOSPITAL (FULL INTERACTIVE CRUD) ──────────────────────
function loadHospital() {
  if (config.hospital && Array.isArray(config.hospital.conditions)) {
    setVal('hosp-conditions', config.hospital.conditions.join(', '));
  }
  renderHospFeaturesList();
}

function gatherHospital() {
  if (!config.hospital) config.hospital = { features: [], conditions: [] };
  config.hospital.conditions = getVal('hosp-conditions').split(',').map(s => s.trim()).filter(Boolean);
}

function renderHospFeaturesList() {
  const grid = document.getElementById('hospitalAdminGrid');
  if (!grid || !config.hospital) return;
  grid.innerHTML = '';

  const feats = Array.isArray(config.hospital.features) ? config.hospital.features : [];
  feats.forEach((f, idx) => {
    const isAct = f.active !== false;
    grid.innerHTML += `
      <div class="item-card">
        <div class="item-card-img">
          ${f.image || (f.gallery && f.gallery.length > 0) ? `<img src="${f.image || f.gallery[0]}" alt="${f.name}" />` : `<span style="font-size:3.5rem">${f.icon || '🏥'}</span>`}
        </div>
        <div class="item-card-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem">
            <span class="item-cat">${f.icon || '🏥'} Facility</span>
            <span class="item-status-pill ${isAct ? 'active' : 'inactive'}">${isAct ? '🟢 Active' : '⚪ Hidden'}</span>
          </div>
          <h4>${f.name}</h4>
          <p>${f.desc || ''}</p>
        </div>
        <div class="item-card-footer">
          <button class="btn btn-ghost btn-sm" onclick="toggleHospActive(${idx})">${isAct ? 'Disable' : 'Enable'}</button>
          <div class="item-actions">
            <button class="btn btn-ghost btn-sm" onclick="openHospModal(${idx})">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteHospFeature(${idx})">🗑</button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML += `
    <div class="item-card add-new" onclick="openHospModal()">
      <span class="add-new-icon">➕</span>
      <span>Add Hospital Feature</span>
    </div>
  `;
}

function openHospModal(editIdx = -1) {
  clearModalFields(['hosp-icon', 'hosp-name', 'hosp-desc']);
  document.getElementById('hosp-editId').value = editIdx;
  activeGalleries['hosp'] = [];
  const secContainer = document.getElementById('hospCustomSectionsContainer');
  if (secContainer) secContainer.innerHTML = '';

  const modalTitle = document.getElementById('hospModalTitle');

  if (editIdx >= 0 && config.hospital && config.hospital.features[editIdx]) {
    modalTitle.textContent = 'Edit Hospital Facility';
    const f = config.hospital.features[editIdx];
    setVal('hosp-icon', f.icon || '🏥');
    setVal('hosp-name', f.name || '');
    setVal('hosp-desc', f.desc || '');
    document.getElementById('hosp-active').checked = f.active !== false;

    activeGalleries['hosp'] = Array.isArray(f.gallery) && f.gallery.length > 0 ? [...f.gallery] : (f.image ? [f.image] : []);

    if (Array.isArray(f.customSections) && f.customSections.length > 0) {
      f.customSections.forEach(s => addCustomSectionRow('hospCustomSectionsContainer', s.title, s.content, s.enabled !== false));
    }
  } else {
    modalTitle.textContent = 'Add Hospital Facility';
    setVal('hosp-icon', '🏥');
    document.getElementById('hosp-active').checked = true;
    activeGalleries['hosp'] = [];

    addCustomSectionRow('hospCustomSectionsContainer', '🏥 Facility Overview & Equipment', 'Details regarding equipment, specialists, and available beds.', true);
  }

  renderGalleryThumbs('hosp');
  openModal('hospitalModal');
}

function saveHospFeature() {
  const editId = parseInt(document.getElementById('hosp-editId').value || '-1', 10);
  const gallery = activeGalleries['hosp'].length > 0 ? [...activeGalleries['hosp']] : [];
  const customSections = getCustomSectionsFromUI('hospCustomSectionsContainer');

  const featData = {
    id:          'hosp-' + Date.now(),
    icon:        getVal('hosp-icon') || '🏥',
    name:        getVal('hosp-name') || 'Hospital Feature',
    desc:        getVal('hosp-desc') || '',
    active:      document.getElementById('hosp-active').checked,
    image:       gallery.length > 0 ? gallery[0] : null,
    gallery:     gallery,
    customSections: customSections
  };

  if (!config.hospital) config.hospital = { features: [], conditions: [] };
  if (!Array.isArray(config.hospital.features)) config.hospital.features = [];

  if (editId >= 0 && editId < config.hospital.features.length) {
    featData.id = config.hospital.features[editId].id || featData.id;
    config.hospital.features[editId] = featData;
  } else {
    config.hospital.features.push(featData);
  }

  CharakDB.save(config);
  renderHospFeaturesList();
  closeModal('hospitalModal');
  showToast('✅ Hospital feature saved and live on website!', 'success');
}

function toggleHospActive(idx) {
  if (config.hospital && config.hospital.features && config.hospital.features[idx]) {
    config.hospital.features[idx].active = config.hospital.features[idx].active === false ? true : false;
    CharakDB.save(config);
    renderHospFeaturesList();
    showToast('Hospital feature status updated!', 'success');
  }
}

function deleteHospFeature(idx) {
  if (config.hospital && config.hospital.features && config.hospital.features[idx]) {
    if (confirm(`Delete feature "${config.hospital.features[idx].name}"?`)) {
      config.hospital.features.splice(idx, 1);
      CharakDB.save(config);
      renderHospFeaturesList();
      showToast('🗑 Feature deleted', 'success');
    }
  }
}

// ─── EXPERTS ──────────────────────────────────────────────
function renderExperts() {
  const grid = document.getElementById('expertsGrid');
  grid.innerHTML = '';
  config.experts.forEach((e, i) => {
    grid.innerHTML += `
    <div class="item-card">
      <div class="item-card-img">${e.image ? `<img src="${e.image}" alt="${e.name}" />` : `<span style="font-size:3rem">👨‍⚕️</span>`}</div>
      <div class="item-card-body">
        <span class="item-cat">${e.spec}</span>
        <h4>${e.name}</h4>
        <p>${e.bio}</p>
        <div style="display:flex; flex-wrap:wrap; gap:0.3rem; margin-top:0.5rem">${(e.tags||[]).map(t=>`<span class="preview-badge" style="background:rgba(122,171,122,0.12);color:var(--forest)">${t}</span>`).join('')}</div>
      </div>
      <div class="item-card-footer">
        <span style="font-size:0.82rem; color:var(--text-muted)">${e.badge}</span>
        <div class="item-actions">
          <button class="btn btn-ghost btn-sm" onclick="editExpert(${i})">✏️ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteExpert(${i})">🗑</button>
        </div>
      </div>
    </div>`;
  });
  grid.innerHTML += `<div class="item-card add-new" onclick="openExpertModal()"><span class="add-new-icon">➕</span><span>Add Doctor</span></div>`;
}

function openExpertModal(editIdx = -1) {
  clearModalFields(['exp-editId','exp-name','exp-badge','exp-spec','exp-bio','exp-img','exp-tags']);
  document.getElementById('expImgPreview').style.display = 'none';
  document.getElementById('expertModalTitle').textContent = editIdx >= 0 ? 'Edit Doctor' : 'Add Doctor';
  // Clear tags UI
  const wrap = document.getElementById('expTagsWrap');
  wrap.querySelectorAll('.tag-item').forEach(t => t.remove());
  if (editIdx >= 0) {
    const e = config.experts[editIdx];
    setVal('exp-editId', editIdx);
    setVal('exp-name',   e.name);
    setVal('exp-badge',  e.badge);
    setVal('exp-spec',   e.spec);
    setVal('exp-bio',    e.bio);
    setVal('exp-tags',   (e.tags||[]).join(','));
    (e.tags||[]).forEach(tag => addTagToUI(wrap, tag, 'exp-tags'));
    if (e.image) showImgPreview('expImgPreview', e.image);
  }
  openModal('expertModal');
}
function editExpert(i)   { openExpertModal(i); }
function deleteExpert(i) {
  if (confirm(`Delete "${config.experts[i].name}"?`)) {
    config.experts.splice(i, 1);
    CharakDB.save(config);
    renderExperts();
    showToast('🗑 Doctor deleted', 'success');
  }
}
function saveExpert() {
  const editId = getVal('exp-editId');
  const isEdit = editId !== '' && editId !== '-1' && editId !== null && !isNaN(parseInt(editId, 10)) && parseInt(editId, 10) >= 0;
  const idx = isEdit ? parseInt(editId, 10) : -1;

  const exp = {
    id:    isEdit ? config.experts[idx]?.id : 'exp-' + Date.now(),
    name:  getVal('exp-name'),
    badge: getVal('exp-badge'),
    spec:  getVal('exp-spec'),
    bio:   getVal('exp-bio'),
    tags:  getVal('exp-tags').split(',').map(s=>s.trim()).filter(Boolean),
    image: getVal('exp-img') || (isEdit ? config.experts[idx]?.image : null),
  };
  if (isEdit && idx < config.experts.length) {
    config.experts[idx] = exp;
  } else {
    config.experts.push(exp);
  }
  CharakDB.save(config);
  renderExperts();
  closeModal('expertModal');
  showToast('✅ Doctor saved & updated live on website!', 'success');
}

// ─── ABOUT ────────────────────────────────────────────────
function loadAbout() {
  const a = config.about;
  setVal('ab-title', a.title);
  setVal('ab-desc1', a.desc1);
  setVal('ab-desc2', a.desc2);
  renderAboutValues();
}
function gatherAbout() {
  config.about.title = getVal('ab-title');
  config.about.desc1 = getVal('ab-desc1');
  config.about.desc2 = getVal('ab-desc2');
  config.about.values = [];
  document.querySelectorAll('.about-val-row').forEach(row => {
    config.about.values.push({
      icon:  row.querySelector('.av-icon').value,
      title: row.querySelector('.av-title').value,
      desc:  row.querySelector('.av-desc').value,
    });
  });
}
function renderAboutValues() {
  const c = document.getElementById('aboutValuesContainer');
  c.innerHTML = '';
  config.about.values.forEach((v, i) => {
    c.innerHTML += `
    <div class="about-val-row" style="display:grid; grid-template-columns:60px 1fr 2fr auto; gap:0.75rem; align-items:end; margin-bottom:0.75rem">
      <div class="form-group" style="margin:0"><label class="field-label">Icon</label><input type="text" class="av-icon" value="${v.icon}" style="text-align:center; font-size:1.3rem" /></div>
      <div class="form-group" style="margin:0"><label class="field-label">Title</label><input type="text" class="av-title" value="${v.title}" /></div>
      <div class="form-group" style="margin:0"><label class="field-label">Description</label><input type="text" class="av-desc" value="${v.desc}" /></div>
      <button class="btn btn-danger btn-sm" onclick="this.closest('.about-val-row').remove()">🗑</button>
    </div>`;
  });
}
function addAboutValue() {
  gatherAbout();
  config.about.values.push({ icon: '🌱', title: 'New Value', desc: 'Description' });
  renderAboutValues();
}

// ─── TESTIMONIALS ─────────────────────────────────────────
function renderTestimonials() {
  const c = document.getElementById('testiContainer');
  c.innerHTML = '';
  config.testimonials.forEach((t, i) => {
    c.innerHTML += `
    <div class="panel-card" style="margin-bottom:1rem; padding:1.25rem">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem">
        <strong style="font-size:0.95rem">Review #${i+1} — ${t.name}</strong>
        <button class="btn btn-danger btn-sm" onclick="deleteTestimonial(${i})">🗑 Delete</button>
      </div>
      <div class="form-grid">
        <div class="form-group" style="margin:0"><label class="field-label">Patient Name</label><input type="text" class="ti-name" value="${t.name}" /></div>
        <div class="form-group" style="margin:0"><label class="field-label">Location / Condition</label><input type="text" class="ti-loc" value="${t.location}" /></div>
        <div class="form-group full" style="margin:0; margin-top:0.5rem"><label class="field-label">Review Text</label><textarea class="ti-text" rows="2">${t.text}</textarea></div>
      </div>
    </div>`;
  });
}
function addTestimonial() {
  // Save current
  saveTestimonialsFromUI();
  config.testimonials.push({ stars: 5, text: 'Patient review here...', name: 'New Patient', location: 'City, State' });
  renderTestimonials();
  showToast('✅ Testimonial added', 'success');
}
function deleteTestimonial(i) {
  if (confirm('Delete this review?')) {
    config.testimonials.splice(i, 1);
    renderTestimonials();
  }
}
function saveTestimonialsFromUI() {
  const rows = document.querySelectorAll('#testiContainer .panel-card');
  config.testimonials = [];
  rows.forEach(row => {
    config.testimonials.push({
      stars: 5,
      name:  row.querySelector('.ti-name')?.value || '',
      location: row.querySelector('.ti-loc')?.value || '',
      text:  row.querySelector('.ti-text')?.value || '',
    });
  });
}

// ─── DASHBOARD STATS ──────────────────────────────────────
function updateDashStats() {
  document.getElementById('dash-products').textContent  = config.products?.length || 0;
  document.getElementById('dash-medicines').textContent = config.medicines?.length || 0;
  document.getElementById('dash-experts').textContent   = config.experts?.length || 0;
  document.getElementById('dash-reviews').textContent   = config.testimonials?.length || 0;
}
function updateLastSaved() {
  const el = document.getElementById('lastSavedText');
  if (!el) return;
  const ts = config.meta?.lastUpdated;
  if (ts) {
    el.textContent = 'Last saved: ' + new Date(ts).toLocaleString('en-IN');
  } else {
    el.textContent = 'Not saved yet';
  }
}

// ─── BADGE SELECTOR ───────────────────────────────────────
function selectBadge(prefix, value) {
  document.getElementById(prefix + '-badge').value = value.charAt(0).toUpperCase() + value.slice(1) || '';
  document.getElementById(prefix + '-badgeColor').value = value;
  document.querySelectorAll('.badge-opt').forEach(o => o.classList.remove('selected'));
  event.target.classList.add('selected');
}

// ─── TAG INPUT ────────────────────────────────────────────
function handleTagInput(e, wrapId, hiddenId) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const input = e.target;
    const val = input.value.trim().replace(',','');
    if (!val) return;
    const wrap = document.getElementById(wrapId);
    addTagToUI(wrap, val, hiddenId);
    input.value = '';
  }
}
function addTagToUI(wrap, val, hiddenId) {
  const tag = document.createElement('span');
  tag.className = 'tag-item';
  tag.innerHTML = `${val} <span class="tag-remove" onclick="removeTag(this,'${hiddenId}')">×</span>`;
  tag.dataset.val = val;
  wrap.insertBefore(tag, wrap.querySelector('.tag-input'));
  updateTagsHidden(hiddenId, wrap);
}
function removeTag(el, hiddenId) {
  const wrap = el.closest('.tags-wrap');
  el.closest('.tag-item').remove();
  updateTagsHidden(hiddenId, wrap);
}
function updateTagsHidden(hiddenId, wrap) {
  const tags = [...wrap.querySelectorAll('.tag-item')].map(t => t.dataset.val);
  document.getElementById(hiddenId).value = tags.join(',');
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────
function handleImgUpload(input, hiddenId, previewId) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast('⚠️ Image must be under 2MB', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById(hiddenId).value = e.target.result;
    showImgPreview(previewId, e.target.result);
  };
  reader.readAsDataURL(file);
}
function showImgPreview(previewId, src) {
  const img = document.getElementById(previewId);
  if (!img) return;
  img.src = src;
  img.style.display = 'block';
}

// ─── MODAL HELPERS ────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function clearModalFields(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = false;
    else el.value = '';
  });
}

// ─── TOAST ────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3100);
}

// ─── HELPERS ──────────────────────────────────────────────
function getVal(id) {
  const el = document.getElementById(id);
  if (!el) return '';
  return el.value || '';
}
function setVal(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = val != null ? val : '';
}
function setSelect(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = val || '';
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
});
