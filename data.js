/**
 * CHARAK WEBSITE — SITE DATABASE / CONFIG
 * =========================================
 * यह file पूरी website का default data store है।
 * Admin Panel से जो भी changes होते हैं वो localStorage में save होते हैं।
 * इस file को manually भी edit किया जा सकता है।
 */

const CHARAK_DEFAULT_CONFIG = {
  meta: {
    version: "1.2.0",
    lastUpdated: new Date().toISOString()
  },

  // ─── GENERAL SITE INFO ───────────────────────────────
  general: {
    siteName:    "Charak",
    subName:     "AYURVEDA",
    tagline:     "Health • Balance • Natural Life",
    description: "Ancient Wisdom. Modern Healing.",
    established: "Health • Balance • Natural Life",
    logo:        "charak_logo.png",
  },

  // ─── WHATSAPP ─────────────────────────────────────────
  whatsapp: {
    enabled:    true,
    number:     "923454947614",   // Pakistan +92 345 4947614
    message:    "Hello! I would like to inquire about treatments and consultation at CHARAK Hospital.",
    buttonText: "Chat on WhatsApp",
    position:   "bottom-right",  // bottom-right | bottom-left
  },

  // ─── CONTACT INFO ─────────────────────────────────────
  contact: {
    address: "CHARAK Hospital & Holistic Wellness Centre",
    phone:   "+92 345 4947614",
    email:   "info@charakhospital.com",
    hours:   "Mon – Sat: 9:00 AM – 8:00 PM",
  },

  // ─── SOCIAL LINKS ─────────────────────────────────────
  social: {
    facebook:  "https://www.facebook.com/profile.php?id=61595380087578",
    instagram: "https://www.instagram.com/hospital_charak/",
    youtube:   "https://www.youtube.com/@Charak_Hospital",
    tiktok:    "https://www.tiktok.com/@charak_hospital",
    whatsapp:  "https://wa.me/923454947614",
  },

  // ─── HERO SECTION ─────────────────────────────────────
  hero: {
    badge:    "Est. 1987 · Ancient Ayurveda",
    title1:   "Ancient Wisdom.",
    title2:   "Modern Healing.",
    subtitle: "Rooted in the timeless science of Ayurveda, CHARAK blends nature's finest herbs with modern wellness protocols to restore your body's natural harmony.",
    btn1Text: "Explore Wellness",
    btn1Link: "#about",
    btn2Text: "Book Consultation",
    btn2Link: "#contact",
    heroImage: null,  // base64 or null (uses default)
    stats: [
      { number: 35,    suffix: "+", label: "Years of Healing"  },
      { number: 500,   suffix: "+", label: "Herbal Formulas"   },
      { number: 50000, suffix: "+", label: "Patients Healed"   },
    ],
    miniPills: [
      "🌿 Herbal Medicines",
      "🌺 Nature Therapies",
      "🧘 Yoga Wellness"
    ]
  },

  // ─── PRODUCTS / MEDICINES ──────────────────────────────
  products: [
    {
      id: "prod-1",
      name:        "Ashwagandha Complex",
      category:    "Immunity · Adaptogen",
      description: "Pure root extract to build resilience, reduce stress & restore vitality.",
      price:       "Rs. 450",
      badge:       "Bestseller",
      badgeColor:  "bestseller",
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      ingredients: [
        "Pure Ashwagandha Root Extract (Withania Somnifera, 500mg)",
        "Piperine / Black Pepper Extract for 200% Enhanced Bioavailability",
        "100% Plant-Derived Vegetarian Cellulose Capsules"
      ],
      benefits: [
        "Clinically reduces cortisol and combats anxiety & fatigue",
        "Enhances physical stamina, strength and vitality",
        "Fosters deep restorative sleep and cognitive clarity"
      ],
      dosage: "1 capsule twice daily with warm water or milk after meals, or as directed by your physician.",
      customSections: [
        {
          title: "Complete 90-Day Vitality Program",
          content: "• Phase 1 (Days 1-30): Cellular detox & cortisol stabilization.\n• Phase 2 (Days 31-60): Muscle recovery, stamina buildup & sleep cycle restoration.\n• Phase 3 (Days 61-90): Long-term nervous system resilience & peak vitality."
        },
        {
          title: "Dietary & Lifestyle Protocol",
          content: "Avoid excess caffeine and processed foods. Best consumed with warm milk or lukewarm water in the morning and before sleep alongside 10 minutes of gentle pranayama."
        }
      ]
    },
    {
      id: "prod-2",
      name:        "Triphala Wellness",
      category:    "Digestion · Detox",
      description: "Tri-fruit formula for gut health, daily detox & metabolic balance.",
      price:       "Rs. 380",
      badge:       "New",
      badgeColor:  "new",
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      ingredients: [
        "Organic Amla (Emblica Officinalis)",
        "Haritaki (Terminalia Chebula)",
        "Bibhitaki (Terminalia Bellirica)"
      ],
      benefits: [
        "Gentle daily digestive detox without cramping",
        "Relieves constipation, bloating and acidity",
        "Enriched with natural Vitamin C for radiant skin"
      ],
      dosage: "1 to 2 capsules or 1 teaspoon with lukewarm water before bedtime."
    },
    {
      id: "prod-3",
      name:        "Neem & Tulsi Blend",
      category:    "Skin · Hair · Purify",
      description: "Purifying herbal blend for radiant skin, scalp health & glow.",
      price:       "Rs. 520",
      badge:       "",
      badgeColor:  "",
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      ingredients: [
        "Azadirachta Indica (Organic Neem Leaves)",
        "Ocimum Sanctum (Holy Tulsi Extract)",
        "Manjistha (Indian Madder Root)"
      ],
      benefits: [
        "Natural blood purifier to clear acne and skin blemishes",
        "Supports healthy liver detoxification and immune response",
        "Soothes itchy scalp and promotes lustrous hair growth"
      ],
      dosage: "1 capsule twice daily with fresh water after meals."
    },
    {
      id: "prod-4",
      name:        "Brahmi Mind Formula",
      category:    "Brain · Memory · Calm",
      description: "Cognitive enhancer to sharpen memory & calm the nervous system.",
      price:       "Rs. 680",
      badge:       "Premium",
      badgeColor:  "premium",
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      ingredients: [
        "Bacopa Monnieri (Standardized Brahmi Extract)",
        "Shankhpushpi (Convolvulus Pluricaulis)",
        "Gotu Kola (Centella Asiatica)"
      ],
      benefits: [
        "Sharpens focus, memory retention and mental agility",
        "Calms neurological restlessness and eases examination / work stress",
        "Promotes calm brain wave balance throughout the day"
      ],
      dosage: "1 capsule in the morning and evening with warm milk or honey."
    },
    {
      id: "prod-5",
      name:        "Shallaki Joint Care",
      category:    "Joints · Mobility",
      description: "Boswellia extract for joint pain, arthritis relief & mobility.",
      price:       "Rs. 590",
      badge:       "",
      badgeColor:  "",
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      ingredients: [
        "Boswellia Serrata Extract (65% Boswellic Acid)",
        "Guggulu (Commiphora Mukul)",
        "Nirgundi (Vitex Negundo)"
      ],
      benefits: [
        "Targeted anti-inflammatory action for knee and back stiffness",
        "Protects cartilage and improves synovial fluid lubrication",
        "Supports painless walking, climbing and daily flexibility"
      ],
      dosage: "1 capsule twice daily after meals with lukewarm water."
    },
    {
      id: "prod-6",
      name:        "Arjuna Heart Tonic",
      category:    "Heart · Blood Pressure",
      description: "Cardioprotective formula to support heart function & regulate BP.",
      price:       "Rs. 720",
      badge:       "Bestseller",
      badgeColor:  "bestseller",
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      ingredients: [
        "Terminalia Arjuna Bark Extract (Standardized Tannins)",
        "Pushkarmool (Inula Racemosa)",
        "Punarnava (Boerhavia Diffusa)"
      ],
      benefits: [
        "Strengthens cardiac muscle tone and vascular integrity",
        "Assists in maintaining optimal blood pressure levels",
        "Reduces LDL cholesterol oxidation and improves circulation"
      ],
      dosage: "1 capsule twice daily after meals or as advised by your cardiologist."
    },
  ],

  // ─── MEDICINES (same as products, shown in separate section) ───
  medicines: [
    {
      id: "med-1",
      name:        "Ashwagandha Complex",
      category:    "Immunity",
      icon:        "🌿",
      description: "Adaptogenic formula to strengthen immunity, reduce stress, and restore vitality.",
      price:       "Rs. 450",
      featured:    false,
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      benefits:    ["Combats daily fatigue & chronic stress", "Balances Vata & Kapha doshas", "Strengthens natural immunity against seasonal infections"],
      dosage:      "1 capsule twice daily with warm water or milk after meals."
    },
    {
      id: "med-2",
      name:        "Triphala Wellness",
      category:    "Digestion",
      icon:        "🍵",
      description: "Ancient tri-fruit formula for digestive health, detoxification, and gut balance.",
      price:       "Rs. 380",
      featured:    true,
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      benefits:    ["Cleanses colon and improves nutrient absorption", "Relieves acidity and gastric distress", "Rich in natural bioflavonoids and antioxidants"],
      dosage:      "1-2 capsules at bedtime with lukewarm water."
    },
    {
      id: "med-3",
      name:        "Neem & Tulsi Blend",
      category:    "Skin & Hair",
      icon:        "🌸",
      description: "Purifying herbal blend for radiant skin, scalp health, and anti-inflammatory support.",
      price:       "Rs. 520",
      featured:    false,
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      benefits:    ["Anti-microbial purification for clear skin", "Alleviates allergic skin irritation and blemishes", "Supports healthy liver detox pathways"],
      dosage:      "1 capsule twice daily after meals."
    },
    {
      id: "med-4",
      name:        "Brahmi Mind Formula",
      category:    "Brain & Nerves",
      icon:        "🧠",
      description: "Cognitive enhancer to sharpen memory, reduce anxiety, and calm the nervous system.",
      price:       "Rs. 680",
      featured:    false,
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      benefits:    ["Enhances cognitive retention and alertness", "Alleviates mental stress and nervous tension", "Soothes Pitta-induced headaches"],
      dosage:      "1 capsule twice daily with milk or water."
    },
    {
      id: "med-5",
      name:        "Shallaki Joint Care",
      category:    "Joints & Bones",
      icon:        "💪",
      description: "Anti-inflammatory boswellia extract for joint pain, arthritis, and mobility.",
      price:       "Rs. 590",
      featured:    false,
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      benefits:    ["Reduces morning joint stiffness and swelling", "Inhibits pro-inflammatory enzymes naturally", "Restores knee and hip joint flexibility"],
      dosage:      "1 capsule twice daily after meals."
    },
    {
      id: "med-6",
      name:        "Arjuna Heart Tonic",
      category:    "Heart & BP",
      icon:        "❤️",
      description: "Cardioprotective formula to support heart function, regulate BP, and reduce cholesterol.",
      price:       "Rs. 720",
      featured:    false,
      image:       "charak_herbs.png",
      gallery:     ["charak_herbs.png"],
      benefits:    ["Strengthens myocardium and regulates rhythm", "Aids in healthy systolic and diastolic BP levels", "Improves overall cardiovascular stamina"],
      dosage:      "1 capsule twice daily after meals."
    },
  ],

  // ─── THERAPIES ────────────────────────────────────────
  therapies: {
    featured: {
      id:          "th-feat",
      name:        "Panchakarma Detox",
      tag:         "Signature",
      duration:    "90-120 min session",
      description: "The ultimate Ayurvedic detoxification — five purifying treatments to cleanse body, mind, and soul.",
      image:       "charak_therapy.png",
      gallery:     ["charak_therapy.png"],
      active:      true,
      customSections: [
        {
          title: "✨ Therapeutic Benefits & Healing Actions",
          content: "• Deep cellular detoxification & chronic toxin (Ama) elimination\n• Soothes joint inflammation, muscular spasms & spinal stiffness\n• Normalizes Vata, Pitta, and Kapha biological doshas\n• Recharges adrenal energy and reverses chronic fatigue",
          enabled: true
        },
        {
          title: "📋 Pre & Post Therapy Protocol",
          content: "Includes comprehensive Nadi Pariksha (Pulse Assessment), personalized herbal steam (Swedana), and specialized restorative sattvic dietary plan.",
          enabled: true
        }
      ]
    },
    list: [
      {
        id:          "th-1",
        icon:        "🛁",
        name:        "Abhyanga Massage",
        tag:         "Restorative",
        duration:    "90 min session",
        description: "Full-body herbal oil massage to improve circulation, relieve stress, and nourish skin.",
        image:       "charak_therapy.png",
        gallery:     ["charak_therapy.png"],
        active:      true,
        customSections: [
          {
            title: "🌿 Medicated Herbal Oils",
            content: "Warm medicated sesame and taila oils customized according to your body's dosha composition.",
            enabled: true
          },
          {
            title: "⏱ Session Benefits",
            content: "Stimulates lymphatic drainage, relieves deep tissue fatigue, and leaves skin radiantly soft.",
            enabled: true
          }
        ]
      },
      {
        id:          "th-2",
        icon:        "🌊",
        name:        "Shirodhara",
        tag:         "Stress Relief",
        duration:    "60 min session",
        description: "Warm herbal oil stream on the forehead — the ultimate stress relief treatment.",
        image:       "charak_therapy.png",
        gallery:     ["charak_therapy.png"],
        active:      true,
        customSections: [
          {
            title: "🧠 Neurological Harmony",
            content: "Profoundly calms the central nervous system, relieving insomnia, anxiety, and mental fatigue.",
            enabled: true
          }
        ]
      },
      {
        id:          "th-3",
        icon:        "🔥",
        name:        "Agni Karma",
        tag:         "Pain Relief",
        duration:    "45 min session",
        description: "Thermal micro-cauterization for chronic pain, frozen shoulder, and musculoskeletal disorders.",
        image:       "charak_therapy.png",
        gallery:     ["charak_therapy.png"],
        active:      true,
        customSections: [
          {
            title: "🎯 Targeted Pain Management",
            content: "Specialized heat transfer therapy for stubborn sciatica, heel spur, tendonitis, and joint calcification.",
            enabled: true
          }
        ]
      },
      {
        id:          "th-4",
        icon:        "🌺",
        name:        "Nasya Therapy",
        tag:         "Sinus & Mind",
        duration:    "30 min session",
        description: "Nasal herbal administration to treat sinusitis, migraine, and neurological imbalances.",
        image:       "charak_therapy.png",
        gallery:     ["charak_therapy.png"],
        active:      true,
        customSections: [
          {
            title: "🌸 ENT & Head Rejuvenation",
            content: "Cleanses head sinuses, improves oxygen flow to brain centers, and relieves allergic rhinitis.",
            enabled: true
          }
        ]
      }
    ]
  },

  // ─── YOGA ─────────────────────────────────────────────
  yoga: {
    floatingBadge: "🧘 Daily Sessions Available",
    programs: [
      {
        id:       "yoga-1",
        num:      "01",
        name:     "Morning Sadhana",
        schedule: "Daily 6:00 AM - 7:30 AM",
        desc:     "6 AM sunrise session — pranayama, asanas & meditation for vitality and mental clarity.",
        image:    "charak_yoga.png",
        gallery:  ["charak_yoga.png"],
        active:   true,
        customSections: [
          {
            title: "🧘 Morning Routine Overview",
            content: "Classical Surya Namaskars, vitalizing breathing techniques, and silent contemplation in natural garden air.",
            enabled: true
          }
        ]
      },
      {
        id:       "yoga-2",
        num:      "02",
        name:     "Therapeutic Yoga",
        schedule: "Mon to Fri 8:00 AM & 5:00 PM",
        desc:     "Condition-specific yoga for diabetes, BP, spine issues, and musculoskeletal restoration.",
        image:    "charak_yoga.png",
        gallery:  ["charak_yoga.png"],
        active:   true,
        customSections: [
          {
            title: "🩺 Medical Alignment",
            content: "Guided by Ayurvedic doctors and yoga masters to relieve chronic disc issues, postural strain, and metabolic imbalances.",
            enabled: true
          }
        ]
      },
      {
        id:       "yoga-3",
        num:      "03",
        name:     "Yoga Nidra",
        schedule: "Tue, Thu, Sat 6:30 PM - 7:45 PM",
        desc:     "Deep relaxation & sleep healing through guided meditation and subconscious restorative rest.",
        image:    "charak_yoga.png",
        gallery:  ["charak_yoga.png"],
        active:   true,
        customSections: [
          {
            title: "✨ Restorative Benefits",
            content: "1 hour of conscious yogic sleep provides cellular rest equivalent to 4 hours of deep natural sleep.",
            enabled: true
          }
        ]
      },
      {
        id:       "yoga-4",
        num:      "04",
        name:     "Weekend Retreats",
        schedule: "Saturday & Sunday Immersive Batches",
        desc:     "Full-day immersive wellness retreats in nature settings with organic Ayurvedic meals.",
        image:    "charak_yoga.png",
        gallery:  ["charak_yoga.png"],
        active:   true,
        customSections: [
          {
            title: "🌿 Weekend Itinerary",
            content: "Intensive breathwork workshops, herbal detoxification teas, sound healing bowls, and guided walking meditations.",
            enabled: true
          }
        ]
      }
    ]
  },

  // ─── HOSPITAL ─────────────────────────────────────────
  hospital: {
    features: [
      {
        id:      "hosp-1",
        icon:    "🏥",
        name:    "100-Bed Facility",
        desc:    "State-of-the-art inpatient wing with Ayurvedic treatment rooms and herb gardens",
        image:   null,
        gallery: [],
        active:  true,
        customSections: []
      },
      {
        id:      "hosp-2",
        icon:    "🔬",
        name:    "Herb Research Lab",
        desc:    "In-house laboratory for quality testing and new formulation development",
        image:   null,
        gallery: [],
        active:  true,
        customSections: []
      },
      {
        id:      "hosp-3",
        icon:    "💊",
        name:    "In-House Pharmacy",
        desc:    "Freshly prepared Ayurvedic formulations — classical and patent medicines",
        image:   null,
        gallery: [],
        active:  true,
        customSections: []
      },
      {
        id:      "hosp-4",
        icon:    "🩺",
        name:    "Multi-Specialty OPD",
        desc:    "Specialized clinics for arthritis, diabetes, skin, kidney, and cardiac conditions",
        image:   null,
        gallery: [],
        active:  true,
        customSections: []
      },
      {
        id:      "hosp-5",
        icon:    "🧬",
        name:    "Diagnostic Center",
        desc:    "Modern diagnostics integrated with Nadi Pariksha and dosha assessment",
        image:   null,
        gallery: [],
        active:  true,
        customSections: []
      },
      {
        id:      "hosp-6",
        icon:    "🌿",
        name:    "Herbal Garden",
        desc:    "On-campus medicinal herb garden with 200+ species used fresh in treatments",
        image:   null,
        gallery: [],
        active:  true,
        customSections: []
      }
    ],
    conditions: [
      "Arthritis", "Diabetes", "Hypertension", "Kidney Disorders",
      "Skin Diseases", "Digestive Issues", "Neurological", "Respiratory",
      "Women's Health", "PCOD / PCOS", "Liver Disorders", "Obesity"
    ]
  },

  // ─── EXPERTS / DOCTORS ────────────────────────────────
  experts: [
    {
      id:      "exp-1",
      name:    "Dr. Rajesh Sharma",
      badge:   "Chief Physician",
      spec:    "Ayurveda & Panchakarma",
      bio:     "25+ years in classical Ayurveda with specialization in chronic disease management.",
      tags:    ["Panchakarma", "Arthritis", "Diabetes"],
      image:   null,
    },
    {
      id:      "exp-2",
      name:    "Dr. Priya Nair",
      badge:   "Senior Consultant",
      spec:    "Naturopathy & Yoga Therapy",
      bio:     "Pioneer in integrating naturopathy with yoga for holistic women's wellness.",
      tags:    ["PCOS", "Yoga Therapy", "Hormones"],
      image:   null,
    },
    {
      id:      "exp-3",
      name:    "Dr. Arun Menon",
      badge:   "Research Director",
      spec:    "Herbal Pharmacology",
      bio:     "Leading researcher in Rasayana therapy and formulation science.",
      tags:    ["Research", "Rasayana", "Immunity"],
      image:   null,
    },
  ],

  // ─── TESTIMONIALS ─────────────────────────────────────
  testimonials: [
    { stars: 5, text: "After 10 years of chronic arthritis pain, CHARAK's Panchakarma literally gave me my life back. I walk freely now!", name: "Amita Verma",  location: "Arthritis Patient, Delhi" },
    { stars: 5, text: "CHARAK's herbal medicines reversed my diabetes naturally — no more insulin. The doctors here are exceptional.",      name: "Ramesh Gupta", location: "Diabetes Patient, Mumbai" },
    { stars: 5, text: "The yoga therapy at CHARAK cured my PCOD in 4 months. The holistic approach is truly life-changing.",               name: "Sunita Joshi", location: "PCOD Patient, Jaipur" },
    { stars: 5, text: "Shirodhara therapy at CHARAK cured my chronic migraine. Best decision I ever made for my health.",                  name: "Pooja Mehta",  location: "Migraine Patient, Pune" },
  ],

  // ─── ABOUT SECTION ────────────────────────────────────
  about: {
    title: "Healing the World the Natural Way",
    desc1: "CHARAK was founded on the ancient teachings of Maharishi Charak — the father of Ayurveda. We believe that every disease has a natural cure, and every body has the wisdom to heal itself when given the right nourishment.",
    desc2: "From our research laboratories to our healing centers, every product and therapy is crafted with reverence for nature and backed by scientific validation.",
    values: [
      { icon: "🌱", title: "100% Natural",   desc: "No chemicals, no synthetics — pure nature" },
      { icon: "🔬", title: "Science-Backed", desc: "Ancient wisdom validated by modern research" },
      { icon: "🫀", title: "Holistic Care",  desc: "Body, mind & spirit in perfect balance" },
    ],
    floatingCards: [
      { emoji: "🌿", title: "500+ Herbs",  sub: "Carefully sourced" },
      { emoji: "⭐", title: "4.9 Rating",  sub: "Patient reviews" },
    ]
  },
};

// ─── CONFIG MANAGER ──────────────────────────────────────
const CharakDB = {
  STORAGE_KEY: "charak_site_config",

  // Format price strictly as Pakistani Rupee (Rs. <amount>)
  formatPrice(price) {
    if (price === undefined || price === null || price === '') return 'Rs. 450';
    let s = String(price).trim();
    s = s.replace(/[₹₨]|PKR|Rs\.?|INR/gi, '').trim();
    return 'Rs. ' + (s || '450');
  },

  // Load config (from localStorage, fallback to defaults)
  load() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        let updated = false;

        // Auto-migrate any rupee symbols in products & medicines to Pakistani Rupee (Rs.)
        if (Array.isArray(parsed.products)) {
          parsed.products.forEach(p => {
            if (p) {
              const formatted = this.formatPrice(p.price);
              if (p.price !== formatted) {
                p.price = formatted;
                updated = true;
              }
            }
          });
        }
        if (Array.isArray(parsed.medicines)) {
          parsed.medicines.forEach(m => {
            if (m) {
              const formatted = this.formatPrice(m.price);
              if (m.price !== formatted) {
                m.price = formatted;
                updated = true;
              }
            }
          });
        }

        if (!parsed.meta) {
          parsed.meta = { version: CHARAK_DEFAULT_CONFIG.meta.version, lastUpdated: new Date().toISOString() };
          updated = true;
        }

        if (updated) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
        }

        return this._deepMerge(JSON.parse(JSON.stringify(CHARAK_DEFAULT_CONFIG)), parsed);
      }
    } catch (e) {
      console.warn("CHARAK: Could not load saved config, using defaults.", e);
    }
    return JSON.parse(JSON.stringify(CHARAK_DEFAULT_CONFIG));
  },

  // Save config to localStorage and broadcast real-time
  save(config) {
    try {
      if (!config) return false;
      if (!config.meta) config.meta = {};
      config.meta.lastUpdated = new Date().toISOString();
      config.meta.version = CHARAK_DEFAULT_CONFIG.meta.version;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      const ts = String(Date.now());
      try { localStorage.setItem('charak_config_updated', ts); } catch(e) {}
      
      // Real-time BroadcastChannel to update index.html immediately in 0ms
      try {
        if ('BroadcastChannel' in window) {
          const ch = new BroadcastChannel('charak_sync_channel');
          ch.postMessage({ type: 'CONFIG_UPDATED', timestamp: ts, config: config });
        }
      } catch(e) {}

      try {
        window.dispatchEvent(new CustomEvent('charak_config_changed', { detail: config }));
      } catch(e) {}

      return true;
    } catch (e) {
      console.error("CHARAK: Could not save config.", e);
      return false;
    }
  },

  // Export updated data.js for uploading to live hosting server
  exportDataJS(config) {
    const configToExport = config || this.load();
    const configJSON = JSON.stringify(configToExport, null, 2);
    const content = `/**
 * CHARAK WEBSITE — PRODUCTION DATA FILE
 * =========================================
 * Generated from Charak Admin Panel for Live Website Deployment.
 * Upload this file to your hosting server (cPanel, Netlify, Vercel, etc.)
 * Date: ${new Date().toLocaleString()}
 */

const CHARAK_DEFAULT_CONFIG = ${configJSON};

window.CHARAK_DEFAULT_CONFIG = CHARAK_DEFAULT_CONFIG;
if (typeof window.CharakDB !== 'undefined') {
  window.CharakDB.defaultConfig = CHARAK_DEFAULT_CONFIG;
}
`;
    const blob = new Blob([content], { type: "application/javascript;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 1500);
  },

  // Reset to defaults
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    return JSON.parse(JSON.stringify(CHARAK_DEFAULT_CONFIG));
  },

  // Export config as JSON file
  exportJSON(config) {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `charak-config-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  },

  // Import config from JSON file
  importJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        const merged = this._deepMerge(JSON.parse(JSON.stringify(CHARAK_DEFAULT_CONFIG)), imported);
        callback(null, merged);
      } catch (err) {
        callback(err, null);
      }
    };
    reader.readAsText(file);
  },

  // Deep merge two objects
  _deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        this._deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  },
};

// Make available globally
window.CharakDB = CharakDB;
window.CHARAK_DEFAULT_CONFIG = CHARAK_DEFAULT_CONFIG;
