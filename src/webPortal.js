// ============================================================================
// SEMT x CAPITOLIUM — MODERN EDITORIAL & ARCHITECTURAL HERITAGE WEB PORTAL
// Enhanced Readability, Split-Hero Search & Auto-Cycling Live Routes + pSEO Engine
// ============================================================================

export class SemtAnalyticsEngine {
  constructor() {
    this.eventsLog = [];
  }

  track(eventName, params = {}) {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...params
    };
    this.eventsLog.push(payload);

    // 1. Google Analytics 4 (GA4)
    try {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }
    } catch (_) {}

    // 2. Vercel Web Analytics
    try {
      if (typeof window !== 'undefined' && typeof window.va === 'function') {
        window.va('event', { name: eventName, data: params });
      }
    } catch (_) {}

    // 3. Dev log
    try {
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.log(`📊 [SEMT Analytics] ${eventName}:`, params);
      }
    } catch (_) {}
  }
}

export class SemtCapitoliumPortal {
  constructor() {
    this.analytics = new SemtAnalyticsEngine();
    this.lang = 'tr';
    this.atmo = 'twilight'; // 'golden' | 'twilight' | 'obsidian'
    this.soundEnabled = false;
    this.audioCtx = null;
    this.menuOpen = false;
    this.selectedDistrictId = 'karakoy';
    this.progVibe = 'arch'; // 'arch' | 'photo' | 'food' | 'night'

    // Hero Stationary Route Card & Background Time Engine
    this.heroSliderIndex = 0;
    this.sessionElapsedSeconds = 0;
    this.bgTimer = null;
    this.heroSliderPaused = false;

    // Interactive Route Matcher Engine State
    this.matcherMood = 'photo';
    this.matcherTime = 'short';
    this.matcherPace = 'hills';

    // Spatial Proximity & Telemetry Engine State
    this.proximityWatchId = null;
    this.lastUserPosition = null;
    this.arrivedNotifiedStops = {};

    // Theme Engine (Dark: Midnight Obsidian, Light: Carrara Marble)
    this.currentTheme = typeof localStorage !== 'undefined' ? (localStorage.getItem('semt_portal_theme') || 'dark') : 'dark';

    // pSEO Filter State
    this.pseoActiveFilter = 'all';
    this.searchQuery = '';

    // Subtle Marble Veining SVG Data URI
    this.marbleSvgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" fill="none">
        <path d="M-100 120 C 280 210, 420 40, 820 190 C 1120 310, 1290 110, 1600 240" stroke="#c3a677" stroke-width="1.2" stroke-opacity="0.32"/>
        <path d="M-60 480 C 310 380, 640 630, 1020 440 C 1240 330, 1410 520, 1620 470" stroke="#8d7551" stroke-width="0.9" stroke-opacity="0.22"/>
        <path d="M120 -40 C 340 240, 210 520, 560 740 C 780 880, 1150 690, 1490 920" stroke="#c3a677" stroke-width="0.8" stroke-opacity="0.25"/>
      </svg>
    `)}`;

    this.starSvg = `
      <svg class="btn-cap__star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M12 1L14.8 9.2L23 12L14.8 14.8L12 23L9.2 14.8L1 12L9.2 9.2L12 1Z"/>
      </svg>
    `;

    this.initData();
  }

  initData() {
    this.districts = [
      {
        id: 'karakoy',
        routeSlug: 'karakoy-kamondo-sessiz-hanlar',
        chap: 'BÖLÜM 01',
        name: 'Karaköy · Galata',
        continent: 'AVRUPA YAKASI',
        scriptTitle: 'Karaköy & Galata Taş Kemerleri',
        tagline: 'Ceneviz surları, Art Nouveau merdivenler ve 19. yüzyıl finans hanları.',
        bestHour: '17:45 Alacakaranlık',
        lensTip: '35mm · Kamondo orta sahanlığından Bankalar Caddesi açısı',
        ferryLink: 'Karaköy ↔ Kadıköy Vapuru (20 dk · 1.50€)',
        coords: { x: 0.42, y: 0.44, lat: '41.0242° N', lng: '28.9746° E' },
        images: [
          '/assets/galata_twilight.jpg',
          '/assets/camondo_1895.jpg',
          '/assets/bankalar_twilight.jpg',
          '/assets/camondo_twilight.jpg',
          '/assets/galata_tower_vintage_poster.jpg'
        ],
        stops: ['Galata Kulesi & Surlar', 'Kamondo Merdivenleri', 'SALT Galata & Kasa Daireleri', 'St. Pierre Han Taş Avlusu']
      },
      {
        id: 'balat',
        routeSlug: 'balat-altin-saat-fotograf-rotasi',
        chap: 'BÖLÜM 02',
        name: 'Fener · Balat',
        continent: 'TARİHİ YARIMADA · HALİÇ',
        scriptTitle: 'Haliç’in Kızıl Sabahı & Sarnıçlar',
        tagline: 'Sabah 07:30 altın saatinde cumbalı sokaklar, Kırmızı Mektep ve Haliç kıyısı.',
        bestHour: '07:30 Altın Saat',
        lensTip: '24mm · Kiremit Caddesi & Merdivenli Yokuş diyagonal kadraj',
        ferryLink: 'Karaköy → Fener Haliç Hattı (14 dk · 1.50€)',
        coords: { x: 0.23, y: 0.34, lat: '41.0318° N', lng: '28.9489° E' },
        images: [
          '/assets/balat_golden_arch.jpg',
          '/assets/balat_wooden_houses.jpg',
          '/assets/balat_cat_church.jpg',
          '/assets/balat_vintage_poster.jpg'
        ],
        stops: ['Fener Rum Lisesi (Kırmızı Mektep)', 'Merdivenli Yokuş & Cumbalı Evler', 'Sveti Stefan (Demir Kilise)', 'Tarihi Taş Fırınlar']
      },
      {
        id: 'sultanahmet',
        routeSlug: 'sultanahmet-bizans-sarniclari-rotasi',
        chap: 'BÖLÜM 02',
        name: 'Tarihi Yarımada',
        continent: 'AVRUPA YAKASI',
        scriptTitle: 'Tarihi Yarımada & Kubbeler',
        tagline: '1600 yıllık Bizans su sarnıçları, Süleymaniye’nin gizli terası ve kubbeler.',
        bestHour: '08:15 Sabah Sükuneti',
        lensTip: '28mm · Şerefiye Sarnıcı su yansıması & Süleymaniye Haliç açısı',
        ferryLink: 'Eminönü ↔ Üsküdar / Kadıköy (18 dk · 1.50€)',
        coords: { x: 0.36, y: 0.68, lat: '41.0086° N', lng: '28.9802° E' },
        images: [
          '/assets/sultanahmet_cistern_marble.jpg',
          '/assets/basilica_cistern_columns.jpg',
          '/assets/suleymaniye_courtyard.jpg',
          '/assets/suleymaniye_panorama.jpg',
          '/assets/basilica_cistern_poster.jpg'
        ],
        stops: ['Şerefiye & Yerebatan Sarnıcı', 'Süleymaniye Arka Terası', 'Büyük Valide Han Avlusu', 'Hipodrom Meydanı']
      },
      {
        id: 'moda',
        routeSlug: 'moda-gun-batimi-vapur-turu',
        chap: 'BÖLÜM 03',
        name: 'Moda · Kadıköy',
        continent: 'ASYA YAKASI',
        scriptTitle: 'Boğaziçi & Moda Gün Batımı',
        tagline: '1.50€’luk vapurla kıta geçişi, tarihi Moda İskelesi ve lodoslu gün batımı.',
        bestHour: '18:15 Gün Batımı Vapuru',
        lensTip: '50mm · Moda İskelesi kemerlerinden Tarihi Yarımada silüeti',
        ferryLink: 'Karaköy → Kadıköy Gün Batımı Vapuru (20 dk)',
        coords: { x: 0.74, y: 0.76, lat: '40.9862° N', lng: '29.0254° E' },
        images: [
          '/assets/moda_bosphorus_ferry.jpg',
          '/assets/bosphorus_ferry_poster.jpg',
          '/assets/haydarpasa_vintage_poster.jpg',
          '/assets/maidens_tower_poster.jpg'
        ],
        stops: ['Tarihi Moda İskelesi & Kütüphanesi', 'Kadıköy Tarihi Çarşı', 'Bahariye Nostaljik Tramvayı', 'Moda Sahil Kayalıkları']
      },
      {
        id: 'kuzguncuk',
        routeSlug: 'kuzguncuk-bostan-ahsap-koskler',
        chap: 'BÖLÜM 03',
        name: 'Kuzguncuk',
        continent: 'ASYA YAKASI · BOĞAZİÇİ',
        scriptTitle: 'Kuzguncuk Bostanı & Ahşap Köşkler',
        tagline: 'Asırlık çınarlar altında 700 yıllık bostan, ahşap köşkler ve üç dinin yan yana mirası.',
        bestHour: '10:30 Kuşluk Vakti',
        lensTip: '35mm · Simitçi Tahir Sokak cumbalı köşkler ve İcadiye Bostanı',
        ferryLink: 'Beşiktaş / Eminönü → Üsküdar + 12 dk Kıyı Yürüyüşü',
        coords: { x: 0.78, y: 0.36, lat: '41.0348° N', lng: '29.0298° E' },
        images: [
          '/assets/direction_c.jpg',
          '/assets/beylerbeyi_palace_poster.jpg',
          '/assets/ortakoy_mosque_poster.jpg',
          '/assets/rumeli_fortress_poster.jpg',
          '/assets/pierre_loti_poster.jpg'
        ],
        stops: ['İcadiye Caddesi & Ahşap Köşkler', '700 Yıllık Kuzguncuk Bostanı', 'Nail Kitabevi & Tarihi Fırın', 'Çınaraltı Boğaz İskelesi']
      },
      {
        id: 'nisantasi',
        routeSlug: 'nisantasi-art-nouveau-tasarim',
        chap: 'BÖLÜM 03',
        name: 'Nişantaşı · Teşvikiye',
        continent: 'AVRUPA YAKASI',
        scriptTitle: 'Nişantaşı Art Nouveau Avluları',
        tagline: 'Belle Époque apartmanları, Maçka Palas cepheleri ve tasarım avluları.',
        bestHour: '16:00 İkindi Işığı',
        lensTip: '50mm · Abdi İpekçi & Atiye Sokak taş cephe rölyefleri',
        ferryLink: 'Kabataş İskelesi + Füniküler',
        coords: { x: 0.52, y: 0.20, lat: '41.0485° N', lng: '28.9940° E' },
        images: [
          '/assets/bankalar_twilight.jpg',
          '/assets/dolmabahce_palace_poster.jpg',
          '/assets/palace_interior_vintage_poster.jpg',
          '/assets/grand_bazaar_lamps.jpg'
        ],
        stops: ['Teşvikiye Camii Taş Avlusu', 'Maçka Palas & Art Nouveau Cepheler', 'Atiye Sokak Avluları', 'Maçka Sanat Vadisi']
      }
    ];

    // Comprehensive Programmatic SEO (pSEO) Routes Matrix with Multi-Image Collections
    // Designed for maximum visual richness and seamless ambient flow
    this.pseoRoutes = [
      {
        slug: 'karakoy-kamondo-sessiz-hanlar',
        category: 'work',
        categoryLabel: 'SESSİZ ÇALIŞMA & KAHVE',
        district: 'Karaköy · Galata',
        title: 'Karaköy: 1870 Kamondo Merdivenleri & Sessiz Han Avluları',
        subtitle: 'Kalabalık caddelerden uzakta, yüksek tavanlı 19. yüzyıl hanlarında çalışma ve közde kahve rotası.',
        duration: '2.5 Saat',
        budget: '~165 ₺',
        bestHour: '17:45 Alacakaranlık',
        crowd: 'Düşük (%20)',
        image: '/assets/camondo_twilight.jpg',
        images: [
          '/assets/camondo_twilight.jpg',
          '/assets/istanbul_ticket_pass.jpg',
          '/assets/galata_bridge_fishermen.jpg',
          '/assets/galata_tower_vintage_poster.jpg',
          '/assets/istanbul_compass_screen.jpg'
        ],
        stops: ['Kamondo Merdivenleri', 'SALT Galata Kasa Daireleri', 'St. Pierre Han Taş Avlusu'],
        stopsData: [
          {
            name: 'Kamondo Merdivenleri',
            lat: 41.02395,
            lng: 28.97368,
            transit: 'T1 Karaköy Tramvay (210m)',
            walkMin: 3,
            hub: 'Karaköy Meydanı',
            notes: 'Bankalar Caddesi ile Bereketzade Medresesi Sokağı birleşimi.'
          },
          {
            name: 'SALT Galata Kasa Daireleri',
            lat: 41.02425,
            lng: 28.97395,
            transit: 'M2 Şişhane Metro (280m)',
            walkMin: 4,
            hub: 'Şişhane Çıkışı',
            notes: 'Bankalar Caddesi No:11, eski Osmanlı Bankası binası.'
          },
          {
            name: 'St. Pierre Han Taş Avlusu',
            lat: 41.02510,
            lng: 28.97310,
            transit: 'Karaköy İskelesi (350m)',
            walkMin: 5,
            hub: 'Eski Banka Sokak',
            notes: 'Eski Banka Sokak, Galata sur hattı bitişiği.'
          }
        ],
        metaDesc: 'Karaköy’ün en iyi sessiz çalışma mekanları, Kamondo Merdivenleri ve tarihi han avluları saatlik yürüyüş rehberi.',
        faqs: [
          { q: 'SALT Galata kütüphanesine giriş ücretsiz mi?', a: 'Evet, SALT Galata ve yeraltındaki Osmanlı Bankası Müzesi tamamen ücretsizdir.' },
          { q: 'St. Pierre Han’a nasıl ulaşılır?', a: 'Karaköy Tünel çıkışından Eski Banka Sokak aksına 3 dakika yürüyerek ulaşabilirsiniz.' }
        ]
      },
      {
        slug: 'balat-altin-saat-fotograf-rotasi',
        category: 'photo',
        categoryLabel: 'FOTOĞRAF & ALTIN SAAT',
        district: 'Fener · Balat',
        title: 'Fener-Balat: 07:30 Altın Saat & Kırmızı Mektep Fotoğraf Rotası',
        subtitle: 'Tur otobüsleri gelmeden önce, kızıl Marsilya tuğlaları ve cumbalı sokakların sinematik ışığı.',
        duration: '3.5 Saat',
        budget: '~140 ₺',
        bestHour: '07:30 Altın Saat',
        crowd: 'Çok Düşük (%10)',
        image: '/assets/balat_golden_arch.jpg',
        images: [
          '/assets/balat_golden_arch.jpg',
          '/assets/balat_vintage_poster.jpg',
          '/assets/balat_wooden_houses.jpg',
          '/assets/balat_cat_church.jpg',
          '/assets/chora_church_historic.jpg'
        ],
        stops: ['Kırmızı Mektep (Fener Rum Lisesi)', 'Sancaktar Yokuşu', 'Merdivenli Yokuş Pastel Evler', 'Tarihi Taş Fırın'],
        stopsData: [
          {
            name: 'Kırmızı Mektep (Fener Rum Lisesi)',
            lat: 41.03150,
            lng: 28.94970,
            transit: 'T5 Fener Tramvayı (140m)',
            walkMin: 2,
            hub: 'Fener Sahil',
            notes: 'Sancaktar Yokuşu tepesi, Haliç panoramik açısı.'
          },
          {
            name: 'Sancaktar Yokuşu',
            lat: 41.03080,
            lng: 28.94910,
            transit: 'Kırmızı Mektep Yanı (80m)',
            walkMin: 1,
            hub: 'Sancaktar Aksı',
            notes: 'Kırmızı tuğla duvarlar ve taş zemin aksı.'
          },
          {
            name: 'Merdivenli Yokuş Pastel Evler',
            lat: 41.03210,
            lng: 28.94820,
            transit: 'T5 Fener Tramvayı (200m)',
            walkMin: 3,
            hub: 'Balat Çarşı İçi',
            notes: 'Renkli cumbalı ahşap yapılar ve taş basamaklar.'
          },
          {
            name: 'Tarihi Taş Fırın',
            lat: 41.03260,
            lng: 28.94740,
            transit: 'Fener Haliç İskelesi (220m)',
            walkMin: 4,
            hub: 'Vodina Caddesi',
            notes: 'Vodina Caddesi, 1800’lerden kalma odun fırını.'
          }
        ],
        metaDesc: 'Sabah 07:30 Fener Balat fotoğraf çekim noktaları, lens önerileri ve en sakin yürüyüş rotası.',
        faqs: [
          { q: 'Balat’ta fotoğraf için en iyi saat hangisidir?', a: 'Sabah 07:15 ile 08:45 arası Haliç’ten vuran eğik sabah ışığı en kusursuz açıyı sunar.' },
          { q: 'Kırmızı Mektep içine girilebilir mi?', a: 'Eğitim devam ettiği için yalnızca özel günlerde açılır; en iyi dış kadraj Sancaktar Yokuşu köşesinden alınır.' }
        ]
      },
      {
        slug: 'moda-gun-batimi-vapur-turu',
        category: 'bosphorus',
        categoryLabel: '1.50€ VAPUR & GÜN BATIMI',
        district: 'Moda · Kadıköy',
        title: 'Moda: 1.50€ Şehir Hatları Vapuruyla Gün Batımı & İskele Kütüphanesi',
        subtitle: 'Pahalı tur teknelerine para vermeden, açık güvertede çay-simit ile Avrupa’dan Asya’ya geçiş.',
        duration: '2 Saat',
        budget: '~110 ₺',
        bestHour: '18:15 Gün Batımı',
        crowd: 'Orta (%45)',
        image: '/assets/moda_bosphorus_ferry.jpg',
        images: [
          '/assets/moda_bosphorus_ferry.jpg',
          '/assets/bosphorus_ferry_poster.jpg',
          '/assets/haydarpasa_vintage_poster.jpg',
          '/assets/red_tram_vintage_poster.jpg',
          '/assets/maidens_tower_poster.jpg'
        ],
        stops: ['Karaköy İskelesi Güverte', 'Kadıköy Balıkçılar Çarşısı', 'Tarihi Moda İskelesi Kütüphanesi', 'Moda Çay Bahçesi'],
        stopsData: [
          {
            name: 'Karaköy İskelesi Güverte',
            lat: 41.02210,
            lng: 28.97720,
            transit: 'T1 Karaköy Tramvayı (80m)',
            walkMin: 1,
            hub: 'Karaköy Sahil',
            notes: 'Şehir Hatları Karaköy ↔ Kadıköy Vapur İskelesi.'
          },
          {
            name: 'Kadıköy Balıkçılar Çarşısı',
            lat: 40.99040,
            lng: 29.02550,
            transit: 'Kadıköy Vapur İskelesi (120m)',
            walkMin: 2,
            hub: 'Kadıköy Meydan',
            notes: 'Güneşli Bahçe Sokak ve Tarihi Çarşı meydanı.'
          },
          {
            name: 'Tarihi Moda İskelesi Kütüphanesi',
            lat: 40.97850,
            lng: 29.02480,
            transit: 'T3 Moda Tramvayı (90m)',
            walkMin: 2,
            hub: 'Moda Sahil',
            notes: 'Moda Burnu, İBB Miras restore deniz kütüphanesi.'
          },
          {
            name: 'Moda Çay Bahçesi',
            lat: 40.97960,
            lng: 29.02310,
            transit: 'Moda Sahil Parkı Yanı (110m)',
            walkMin: 2,
            hub: 'Moda Park',
            notes: 'Park İçi Yolu, Adalar ve gün batımı seyir açısı.'
          }
        ],
        metaDesc: '1.50€ vapurla İstanbul Boğazı gün batımı turu, Tarihi Moda İskelesi ve Kadıköy sokak rehberi.',
        faqs: [
          { q: 'Vapurda kredi kartı geçerli mi?', a: 'Evet, İstanbulkart’ın yanı sıra tüm temassız kredi kartları doğrudan turnikede geçerlidir.' },
          { q: 'Moda İskelesi kütüphanesi açık mı?', a: 'Evet, İBB Miras tarafından restore edilen iskelenin üst katı deniz manzaralı kütüphanedir.' }
        ]
      },
      {
        slug: 'sultanahmet-bizans-sarniclari-rotasi',
        category: 'history',
        categoryLabel: 'BİZANS SARNIÇLARI & TARİH',
        district: 'Tarihi Yarımada',
        title: 'Tarihi Yarımada: 1600 Yıllık Şerefiye Sarnıcı & Süleymaniye Gizli Terası',
        subtitle: 'Yerebatan kuyruklarında beklemeden, Şerefiye’nin su yansımaları ve Mimar Sinan’ın Haliç panoraması.',
        duration: '3.5 Saat',
        budget: '~220 ₺',
        bestHour: '08:30 Sabah Sükuneti',
        crowd: 'Düşük (%25)',
        image: '/assets/sultanahmet_cistern_marble.jpg',
        images: [
          '/assets/sultanahmet_cistern_marble.jpg',
          '/assets/basilica_cistern_columns.jpg',
          '/assets/suleymaniye_courtyard.jpg',
          '/assets/grand_bazaar_vintage_poster.jpg',
          '/assets/istanbul_stamp_diorama.jpg'
        ],
        stops: ['Şerefiye Sarnıcı 360° Şov', 'Süleymaniye Arka Avlu Terası', 'Büyük Valide Han Avlusu'],
        stopsData: [
          {
            name: 'Şerefiye Sarnıcı 360° Şov',
            lat: 41.00840,
            lng: 28.97230,
            transit: 'T1 Çemberlitaş (140m)',
            walkMin: 2,
            hub: 'Divanyolu Aksı',
            notes: 'Piyer Loti Caddesi No:2/1, Fatih.'
          },
          {
            name: 'Süleymaniye Arka Avlu Terası',
            lat: 41.01630,
            lng: 28.96410,
            transit: 'M2 Vezneciler (450m)',
            walkMin: 6,
            hub: 'Vezneciler Metro',
            notes: 'Mimar Sinan Caddesi, Haliç ve Boğaz açısı.'
          },
          {
            name: 'Büyük Valide Han Avlusu',
            lat: 41.01520,
            lng: 28.96910,
            transit: 'T1 Beyazıt (320m)',
            walkMin: 4,
            hub: 'Mercan Yokuşu',
            notes: 'Mercan Yokuşu, Çakmakçılar Yokuşu köşesi.'
          }
        ],
        metaDesc: 'Sultanahmet ve Süleymaniye gizli seyir terasları, Bizans sarnıçları rehberi ve sıra beklemeden ziyaret taktikleri.',
        faqs: [
          { q: 'Şerefiye Sarnıcı Yerebatan’dan farklı mı?', a: 'MS 428 yapımı Şerefiye Sarnıcı daha sakindir ve her saat başı 360° su üstü projeksiyon gösterisi sunar.' }
        ]
      },
      {
        slug: 'kuzguncuk-bostan-ahsap-koskler',
        category: 'photo',
        categoryLabel: 'BOSTAN & YAŞAYAN MAHALLE',
        district: 'Kuzguncuk · Üsküdar',
        title: 'Kuzguncuk: 700 Yıllık Tarihi Bostan & İcadiye Cumbalı Köşkleri',
        subtitle: 'Boğaz kıyısında üç dinin ibadethanesinin yan yana durduğu, asırlık çınarlı masalsı köy.',
        duration: '2.5 Saat',
        budget: '~130 ₺',
        bestHour: '10:30 Kuşluk Işığı',
        crowd: 'Sakin (%20)',
        image: '/assets/direction_c.jpg',
        images: [
          '/assets/direction_c.jpg',
          '/assets/beylerbeyi_palace_poster.jpg',
          '/assets/ortakoy_mosque_poster.jpg',
          '/assets/rumeli_fortress_poster.jpg',
          '/assets/pierre_loti_poster.jpg'
        ],
        stops: ['İcadiye Caddesi Renkli Köşkler', '700 Yıllık Kuzguncuk Bostanı', 'Nail Kitabevi & Çınaraltı'],
        stopsData: [
          {
            name: 'İcadiye Caddesi Renkli Köşkler',
            lat: 41.03620,
            lng: 29.02880,
            transit: 'Kuzguncuk İskelesi (150m)',
            walkMin: 2,
            hub: 'İcadiye Girişi',
            notes: 'İcadiye Caddesi boyunca 19. yüzyıl ahşap sivil mimari.'
          },
          {
            name: '700 Yıllık Kuzguncuk Bostanı',
            lat: 41.03570,
            lng: 29.03010,
            transit: 'İcadiye Caddesi 4 dk (280m)',
            walkMin: 4,
            hub: 'Bostan Yolu',
            notes: 'İlya’nın Bostanı, kentsel tarım ve asırlık çınarlar.'
          },
          {
            name: 'Nail Kitabevi & Çınaraltı',
            lat: 41.03680,
            lng: 29.02820,
            transit: '15 Hatları Kuzguncuk Durağı (80m)',
            walkMin: 1,
            hub: 'Çınaraltı Meydanı',
            notes: 'İcadiye Cd. No:32, tarihi köşe bina & kafe.'
          }
        ],
        metaDesc: 'Kuzguncuk İcadiye Caddesi, tarihi bostan, ahşap köşkler ve en iyi fotoğraf açıları.',
        faqs: [
          { q: 'Kuzguncuk’a en hızlı nasıl gidilir?', a: 'Beşiktaş veya Eminönü’nden Üsküdar vapuruna binip kıyıdan 12 dakika yürüyebilirsiniz.' }
        ]
      },
      {
        slug: 'nisantasi-art-nouveau-tasarim',
        category: 'work',
        categoryLabel: 'ART NOUVEAU & PASAJLAR',
        district: 'Nişantaşı · Teşvikiye',
        title: 'Nişantaşı: Belle Époque Cepheleri & Teşvikiye Gizli Avluları',
        subtitle: 'Maçka Palas’tan Atiye Sokak’a, 19. yüzyıl sonu Art Nouveau mimarisi ve üçüncü dalga kahveciler.',
        duration: '3 Saat',
        budget: '~280 ₺',
        bestHour: '15:30 İkindi Işığı',
        crowd: 'Orta (%40)',
        image: '/assets/bankalar_twilight.jpg',
        images: [
          '/assets/bankalar_twilight.jpg',
          '/assets/dolmabahce_palace_poster.jpg',
          '/assets/palace_interior_vintage_poster.jpg',
          '/assets/grand_bazaar_lamps.jpg'
        ],
        stops: ['Teşvikiye Camii Taş Avlusu', 'Maçka Palas Rölyefleri', 'Atiye Sokak Tasarım Pasajları'],
        stopsData: [
          {
            name: 'Teşvikiye Camii Taş Avlusu',
            lat: 41.05020,
            lng: 28.99350,
            transit: 'M2 Osmanbey Metrosu (380m)',
            walkMin: 5,
            hub: 'Osmanbey Metro',
            notes: 'Teşvikiye Caddesi, Sultan Abdülmecid nişan taşları.'
          },
          {
            name: 'Maçka Palas Rölyefleri',
            lat: 41.04740,
            lng: 28.99380,
            transit: 'Maçka Teleferik (200m)',
            walkMin: 3,
            hub: 'Maçka Parkı Aksı',
            notes: 'Maçka Caddesi No:33, Giulio Mongeri Art Nouveau eseri.'
          },
          {
            name: 'Atiye Sokak Tasarım Pasajları',
            lat: 41.05120,
            lng: 28.99180,
            transit: 'Teşvikiye Caddesi Yanı (90m)',
            walkMin: 2,
            hub: 'Abdi İpekçi Aksı',
            notes: 'Yaya aksı, açık hava tasarım kafeleri ve avlular.'
          }
        ],
        metaDesc: 'Nişantaşı Art Nouveau apartmanları, Maçka Palas mimari yürüyüş rotası ve tasarım kafeleri.',
        faqs: [
          { q: 'Mimari binaları incelemek için en iyi sokak hangisi?', a: 'Vali Konağı Caddesi ve Hüsrev Gerede Sokak en zengin cephe rölyeflerine sahiptir.' }
        ]
      }
    ];

    this.trapsVsSecrets = [
      {
        category: 'BOĞAZİÇİ GEZİSİ',
        routeSlug: 'moda-gun-batimi-vapur-turu',
        trapTitle: '50€’luk Özel Turist Tekneleri',
        trapDesc: 'Eminönü iskelesinde yüksek sesli müzikli, fahiş fiyatlı ve kıyıdan uzak özel tur tekneleri.',
        secretTitle: '1.50€ Şehir Hatları Vapuru',
        secretDesc: 'Karaköy–Kadıköy veya Boğaz hattı vapuruyla açık güvertede çay-simit eşliğinde gerçek kıta geçişi.',
        saving: '%97 TASARRUF',
        images: [
          '/assets/ferries_golden_horn.jpg',
          '/assets/bosphorus_ferry_poster.jpg',
          '/assets/moda_bosphorus_ferry.jpg'
        ]
      },
      {
        category: 'MANZARA & SEYİR',
        routeSlug: 'karakoy-kamondo-sessiz-hanlar',
        trapTitle: '2 Saatlik Öğlen Kule Kuyruğu',
        trapDesc: 'Öğlen sıcağında Galata Kulesi önünde 90 dakika sıra bekleyip kalabalık balkonda sıkışmak.',
        secretTitle: 'St. Pierre Han & Süleymaniye Terası',
        secretDesc: '1771 tarihli hanın çatı açısı ve Mimar Sinan’ın Süleymaniye arka avlusundaki ücretsiz Haliç manzarası.',
        saving: 'SIFIR KUYRUK',
        images: [
          '/assets/suleymaniye_panorama.jpg',
          '/assets/galata_tower_vintage_poster.jpg',
          '/assets/suleymaniye_courtyard.jpg'
        ]
      },
      {
        category: 'YERALTI TARİHİ',
        routeSlug: 'sultanahmet-bizans-sarniclari-rotasi',
        trapTitle: 'Öğlen Saatinde Bilet Kuyruğu',
        trapDesc: 'Tur gruplarının en yoğun olduğu 11:00–15:00 arası uzun sarnıç kuyruklarında vakit kaybetmek.',
        secretTitle: '09:00 Şerefiye Sarnıcı (Theodosius)',
        secretDesc: '1600 yıllık mermer sütunlar üzerinde 360° su üstü ışık ve akustik şovuyla sabah sükuneti.',
        saving: 'VIP SÜKUNET',
        images: [
          '/assets/basilica_cistern_columns.jpg',
          '/assets/basilica_cistern_poster.jpg',
          '/assets/sultanahmet_cistern_marble.jpg'
        ]
      },
      {
        category: 'GERÇEK LEZZET',
        routeSlug: 'nisantasi-art-nouveau-tasarim',
        trapTitle: 'Meydandaki Fotoğraflı Menüler',
        trapDesc: 'Turistik meydanlarda kapıda müşteri çeviren, dondurulmuş ürün sunan pahalı restoranlar.',
        secretTitle: 'Kadıköy Çarşısı & Han İçi Esnaf',
        secretDesc: 'Güneşlibahçe Sokak ve Karaköy ara hanlarındaki 80 yıllık gerçek esnaf lokantaları.',
        saving: 'GERÇEK LEZZET',
        images: [
          '/assets/grand_bazaar_lamps.jpg',
          '/assets/grand_bazaar_vintage_poster.jpg',
          '/assets/istanbul_gastronomy_ritual.jpg'
        ]
      }
    ];
  }

  applyTheme(theme) {
    this.currentTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    document.body.setAttribute('data-theme', this.currentTheme);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('semt_portal_theme', this.currentTheme);
      } catch (_) {}
    }

    const label = document.getElementById('cap-theme-label');
    if (label) {
      label.textContent = this.currentTheme === 'dark' ? 'GÜNDÜZ' : 'GECE';
    }
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', this.currentTheme === 'dark' ? 'Aydınlık Temaya Geç' : 'Karanlık Temaya Geç');
      btn.classList.toggle('is-light-active', this.currentTheme === 'light');
    }
    const menuThemeBtn = document.getElementById('btn-menu-toggle-theme');
    if (menuThemeBtn) {
      menuThemeBtn.textContent = `TEMA: ${this.currentTheme === 'dark' ? 'KARANLIK' : 'AYDINLIK'}`;
    }
  }

  triggerHaptic(pattern = 10) {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (_) {}
  }

  updateMobilePassportBadge() {
    try {
      let totalVisited = 0;
      let totalStops = 0;
      for (const r of (this.pseoRoutes || [])) {
        totalStops += (r.stops || []).length;
        const v = this.getVisitedStops(r.slug);
        totalVisited += v.length;
      }
      const badge = document.getElementById('mob-passport-count');
      if (badge) {
        badge.textContent = `${totalVisited}/${totalStops || 24}`;
      }
    } catch (_) {}
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    this.playChime(nextTheme === 'light' ? 840 : 480, 0.08);
    this.triggerHaptic(15);
    if (this.analytics) {
      this.analytics.track('theme_toggle', { theme: nextTheme });
    }
  }

  init() {
    this.applyTheme(this.currentTheme);
    document.body.classList.add('web-portal-active');
    document.body.setAttribute('data-atmo', this.atmo);

    this.injectPwaModalReturnHeader();

    let root = document.getElementById('capitolium-web-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'capitolium-web-root';
      document.body.insertBefore(root, document.body.firstChild);
    }

    root.innerHTML = this.renderPortalHTML();
    this.bindEvents();
    this.initBosphorusCanvas();
    this.renderProgramme();
    this.startHeroSlider();
    this.renderPseoGrid();
    this.bindRouteMatcher();
    this.updateMobilePassportBadge();

    // Deep URL linking for pSEO landing pages (e.g. ?route=slug)
    this.checkUrlParams();

    // Studio Spatial Interactive Magnetic Cursor
    this.studioCursor = new SemtStudioCursor();
  }

  injectPwaModalReturnHeader() {
    const stage = document.querySelector('.studio-stage');
    if (!stage || document.getElementById('pwa-modal-header')) return;

    const header = document.createElement('div');
    header.id = 'pwa-modal-header';
    header.className = 'pwa-modal-header';
    header.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:8px;"><span class="cap-briefing-dot"></span> SEMT CANLI SAHA MODU · <strong id="pwa-modal-district-tag">KARAKÖY · GALATA</strong></span>
      <button class="pwa-modal-close-btn" id="btn-close-pwa-modal">← WEB PORTALINA DÖN</button>
    `;
    stage.insertBefore(header, stage.firstChild);

    header.querySelector('#btn-close-pwa-modal').addEventListener('click', () => {
      document.body.classList.remove('pwa-modal-open');
      if (window.semtApp && window.semtApp.mapEngine) {
        window.semtApp.mapEngine.pause();
      }
      this.playChime(440, 0.08);
    });
  }

  openFieldPwa(districtName = 'Karaköy · Galata') {
    if (window.initSemtAppLazy) {
      window.initSemtAppLazy();
    }
    if (window.semtApp && window.semtApp.mapEngine) {
      window.semtApp.mapEngine.resume();
    }
    const tag = document.getElementById('pwa-modal-district-tag');
    if (tag) tag.textContent = districtName.toUpperCase();
    const hudName = document.getElementById('hud-district-name');
    if (hudName) hudName.textContent = districtName;
    document.body.classList.add('pwa-modal-open');
    this.playChime(660, 0.12);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 120);
  }

  renderBtnCap(label, extraClass = '', dataAttr = '') {
    return `
      <button class="btn-cap ${extraClass}" ${dataAttr}>
        <span class="btn-cap__inner">
          ${this.starSvg}
          <span class="btn-cap__text">${label}</span>
          ${this.starSvg}
        </span>
      </button>
    `;
  }

  renderPortalHTML() {
    return `
      <!-- 1. TOP SCROLL PROGRESS BAR -->
      <div class="cap-progress-top">
        <div class="cap-progress-top__fill" id="cap-progress-fill"></div>
      </div>

      <!-- 2. TRANSLUCENT TOP HEADER WITH ATMOSPHERIC BOSPHORUS ARCH BACKGROUND -->
      <header class="cap-header">
        <div class="cap-cartouche" id="cap-cartouche">
          <div class="cap-cartouche__inner">
            <a class="cap-cartouche__brand" data-scroll-to="#hero-top">
              SEMT · <span>İSTANBUL</span>
            </a>
            <div class="cap-cartouche__divider"></div>
            <button class="cap-theme-toggle-btn" id="btn-theme-toggle" aria-label="Temayı Değiştir" title="Aydınlık / Karanlık Tema">
              <span class="cap-theme-icon-sun">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              </span>
              <span class="cap-theme-icon-moon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </span>
              <span class="cap-theme-toggle-label" id="cap-theme-label">GÜNDÜZ</span>
            </button>
            <div class="cap-cartouche__divider"></div>
            <button class="cap-burger-btn" id="btn-cartouche-menu" aria-label="Menüyü Aç">
              <div class="cap-burger-lines">
                <span></span><span></span><span></span>
              </div>
              <span id="cartouche-menu-label">BÖLÜMLER</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Curtain Menu Backdrop & Top-Down Marble Sheet -->
      <div class="cap-menu-overlay" id="cap-menu-overlay"></div>
      <nav class="cap-menu-curtain" id="cap-menu-curtain" aria-label="Bölümler Menüsü">
        <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:1.25rem;">
          <span style="font-family:var(--font-display);font-size:0.85rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">İSTANBUL KEŞİF KATALOĞU</span>
          <span style="font-family:var(--font-serif);font-size:1.6rem;font-style:italic;color:#8c6d3f;">İki Kıta, Bin Katman</span>
        </div>

        <div class="cap-menu-grid">
          <button class="cap-menu-item" data-scroll-to="#chapitre-1">
            <span class="cap-menu-item__chap">01 · AVRUPA YAKASI</span>
            <span class="cap-menu-item__title">Karaköy & Galata Kemerleri</span>
            <span class="cap-menu-item__sub">Kamondo Merdivenleri, Ceneviz Surları ve Tarihi Hanlar</span>
          </button>
          <button class="cap-menu-item" data-scroll-to="#chapitre-2">
            <span class="cap-menu-item__chap">02 · TARİHİ YARIMADA</span>
            <span class="cap-menu-item__title">Fener-Balat & Bizans Sarnıçları</span>
            <span class="cap-menu-item__sub">07:30 Altın Saat, Kırmızı Mektep ve Yeraltı Mermerleri</span>
          </button>
          <button class="cap-menu-item" data-scroll-to="#chapitre-3">
            <span class="cap-menu-item__chap">03 · BOĞAZİÇİ & ASYA</span>
            <span class="cap-menu-item__title">Moda, Kuzguncuk & 1.50€ Vapur</span>
            <span class="cap-menu-item__sub">Kıta Değiştiren Gün Batımı ve 700 Yıllık Bostan</span>
          </button>
          <button class="cap-menu-item" data-scroll-to="#chapitre-4">
            <span class="cap-menu-item__chap">04 · ANTİ-TURİST REHBERİ</span>
            <span class="cap-menu-item__title">Turist Tuzağı vs. İstanbullu Sırrı</span>
            <span class="cap-menu-item__sub">Gerçek Esnaf Lezzetleri ve Zaman Kazandıran Yerel Taktikler</span>
          </button>
          <button class="cap-menu-item" data-scroll-to="#pseo-library-section">
            <span class="cap-menu-item__chap">05 · KÜRASYON ARŞİVİ</span>
            <span class="cap-menu-item__title">İstanbul Niş Rota Kütüphanesi</span>
            <span class="cap-menu-item__sub">Fotoğraf, Sessiz Çalışma, Tarih ve Boğaz Parkurları</span>
          </button>
          <button class="cap-menu-item" data-scroll-to="#bosphorus-atlas-section">
            <span class="cap-menu-item__chap">CANLI HARİTA</span>
            <span class="cap-menu-item__title">Boğaz & 6 Semt Keşif Atlası</span>
            <span class="cap-menu-item__sub">Canlı Vapur Hatları ve Fotoğraf Kadraj Noktaları</span>
          </button>
        </div>

        <div class="cap-menu-controls">
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
            <span style="font-family:var(--font-tech);font-size:10px;font-weight:600;letter-spacing:0.12em;margin-right:4px;">IŞIK MODU:</span>
            <button class="cap-menu-pill-btn" data-set-atmo="golden">07:30 ALTIN SAAT</button>
            <button class="cap-menu-pill-btn active" data-set-atmo="twilight">18:45 ALACAKARANLIK</button>
            <button class="cap-menu-pill-btn" data-set-atmo="obsidian">22:30 GECE</button>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="cap-menu-pill-btn" id="btn-menu-toggle-theme">TEMA: KARANLIK</button>
            <button class="cap-menu-pill-btn" id="btn-toggle-sound">BOĞAZ SESİ: KAPALI</button>
            <button class="cap-menu-pill-btn" id="btn-toggle-lang">TR | EN</button>
            <button class="cap-menu-pill-btn active" data-open-pwa="Karaköy · Galata">CANLI SAHA UYGULAMASI</button>
          </div>
        </div>
      </nav>

      <!-- 3. HERO STAGE — BALANCED SPLIT STAGE: LEFT ARCH / RIGHT SEARCH & LIVE SLIDER -->
      <section class="cap-hero" id="hero-top">
        <!-- Atmospheric Istanbul Twilight Backdrop (Edited & Soft Masked) -->
        <div class="cap-hero__bg-backdrop" aria-hidden="true">
          <img src="/assets/istanbul_atmospheric_hero_bg.jpg" alt="" class="cap-hero__bg-img" fetchpriority="high" decoding="async" />
          <div class="cap-hero__bg-gradient-overlay"></div>
        </div>

        <div class="bg-marble"><img src="${this.marbleSvgDataUri}" alt="" class="bg-marble__svg"/></div>

        <div class="cap-hero__split-grid">
          <!-- Left Hero Column: Monumental Arch & Centered Architecture Presentation -->
          <div class="cap-hero__left">
            <div class="cap-hero__eyebrow-tag">
              <span class="cap-beacon-pulse"></span> CANLI EDİTÖRYAL ATLAS & ROTALAR
            </div>
            <h1 class="cap-hero__title" data-i18n="heroTitle">
              İKİ KITA, BİN KATMAN
            </h1>
            <div class="cap-hero__script">
              İstanbul’un Görünmeyen Taş Kemerleri
            </div>

            <!-- Centered Monumental Arch Showcase in Left Column -->
            <div class="cap-hero__center-showcase">
              <div class="cap-arch-window" id="hero-arch-window" data-open-route="karakoy-kamondo-sessiz-hanlar" role="button" tabindex="0" title="Karaköy Rotasını Keşfet">
                <div class="cap-arch-window__inner">
                  <img src="/assets/galata_twilight.jpg" alt="İstanbul Galata Alacakaranlık Kemeri" class="cap-arch-window__img" id="hero-dynamic-img" fetchpriority="high" decoding="async" />
                  <div class="cap-arch-hover-badge">ROTAYI AÇ ↗</div>
                </div>
              </div>
              <div class="cap-hero__center-content">
                <p class="cap-hero__manifesto" data-i18n="heroManifesto">
                  Ceneviz surlarının gölgesindeki Karaköy’den Haliç’in kızıl sabahına ve 1.50€’luk Şehir Hatları vapuruyla geçilen Moda’nın lodoslu gün batımına uzanan küratörlü keşif platformu.
                </p>
                <blockquote class="cap-arch-badge-quote">
                  "İki kıta arasında yürürken zamanın ritmini hissedersiniz."
                </blockquote>
                <div class="cap-hero__cta-group">
                  ${this.renderBtnCap('KEŞFE BAŞLA', 'btn-cap--gold-solid', 'data-scroll-to="#pseo-library-section"')}
                  <button class="cap-hero-pill-link" data-open-route="karakoy-kamondo-sessiz-hanlar" title="Öne Çıkan Karaköy Rotasını Aç">
                    ÖNE ÇIKAN ROTA ↗
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Hero Column: Minimalist Search & Editorial Route Showcase (Unboxed) -->
          <div class="cap-hero__right">
            <!-- Frameless Search & Minimalist Filter Tabs -->
            <div class="cap-hero-search-card">
              <div class="cap-search-input-wrap">
                <input
                  type="text"
                  id="hero-search-input"
                  class="cap-search-input"
                  placeholder="Semt, niyet veya durak ara... (örn: Karaköy kahve, Balat fotoğraf)"
                  aria-label="Rota Arama"
                />
                <span class="cap-search-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
              </div>

              <div class="cap-search-pills">
                <button class="cap-search-pill active" data-hero-filter="all">Tümü</button>
                <button class="cap-search-pill" data-hero-filter="photo">Altın Saat</button>
                <button class="cap-search-pill" data-hero-filter="work">Sessiz Çalışma</button>
                <button class="cap-search-pill" data-hero-filter="history">Sarnıçlar</button>
                <button class="cap-search-pill" data-hero-filter="bosphorus">Vapur</button>
              </div>
            </div>

            <!-- Stationary Editorial Route Showcase (Zero Borders, Clean Luxury) -->
            <div class="cap-hero-slider-card" id="hero-slider-card">
              <div class="cap-slider-progress-track">
                <div class="cap-slider-progress-bar" id="hero-slider-progress-bar"></div>
              </div>

              <div class="cap-slider-header">
                <span class="cap-slider-tag" id="slider-route-tag">KARAKÖY · GALATA</span>
                <span class="cap-slider-counter" id="slider-route-counter">01 / 06</span>
              </div>

              <div class="cap-slider-content-row" id="slider-content-row" data-open-route="karakoy-kamondo-sessiz-hanlar" role="button" tabindex="0" title="Rotayı İncele">
                <div class="cap-slider-thumb">
                  <img src="/assets/camondo_twilight.jpg" alt="Kamondo Merdivenleri" id="slider-route-img" decoding="async" />
                </div>
                <div class="cap-slider-card-body">
                  <h3 id="slider-route-title">Karaköy: 1870 Kamondo & Sessiz Han Avluları</h3>
                  <p id="slider-route-desc">Kalabalık caddelerden uzakta, yüksek tavanlı 19. yüzyıl hanlarında çalışma ve közde kahve rotası.</p>
                  <div class="cap-slider-stops-text" id="slider-route-stops">
                    Kamondo Merdivenleri · SALT Galata · St. Pierre Han
                  </div>
                </div>
              </div>

              <div class="cap-slider-footer">
                <div class="cap-slider-meta-pills" id="slider-route-meta">
                  <span class="cap-meta-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    2.5 Saat
                  </span>
                  <span class="cap-meta-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                    17:45
                  </span>
                  <span class="cap-meta-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    ~165 ₺
                  </span>
                </div>

                <!-- Minimalist Typographic Route Numbers (Zero Boxes) -->
                <div class="cap-slider-dots" id="slider-route-dots"></div>

                <div class="cap-slider-controls">
                  <button class="cap-slider-btn" id="btn-slider-prev" title="Önceki Rota">←</button>
                  <button class="cap-slider-btn" id="btn-slider-next" title="Sonraki Rota">→</button>
                  <button class="btn-cap btn-cap--gold-solid" id="btn-slider-open-route" style="padding:0;height:36px;">
                    <span class="btn-cap__inner" style="padding:0.45rem 1.4rem;font-size:0.78rem;">ROTAYI İNCELE →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. CALLIGRAPHIC MARQUEE -->
      <div class="cap-marquee" aria-hidden="true">
        <div class="cap-marquee__track">
          <div class="cap-marquee__item">
            <span class="cap-marquee__serif">İki Kıta, Tek Ruh</span>
            <span class="cap-marquee__bold">✦ KARAKÖY · FENER & BALAT · SULTANAHMET · MODA · KUZGUNCUK · NİŞANTAŞI ✦</span>
            <span class="cap-marquee__serif">Şehrin Görünmeyen Katmanları</span>
          </div>
          <div class="cap-marquee__item">
            <span class="cap-marquee__serif">İki Kıta, Tek Ruh</span>
            <span class="cap-marquee__bold">✦ KARAKÖY · FENER & BALAT · SULTANAHMET · MODA · KUZGUNCUK · NİŞANTAŞI ✦</span>
            <span class="cap-marquee__serif">Şehrin Görünmeyen Katmanları</span>
          </div>
        </div>
      </div>

      <!-- 4. INTERACTIVE ROUTE MATCHER STUDIO (HIGH-ENGAGEMENT HOOK) -->
      <section class="cap-matcher-section" id="cap-route-matcher-section">
        <div class="cap-matcher-card">
          <div class="cap-matcher-header">
            <div>
              <div class="cap-live-pulse-badge">
                <span class="pulse-dot-beacon"></span>
                <span>CANLI KEŞİF RADARI · İSTANBUL</span>
              </div>
              <h2 class="cap-matcher-title">Bugün Senin İçin En Doğru Rota Hangisi?</h2>
              <p style="font-family:var(--font-body);font-size:0.95rem;color:var(--text-dark-secondary);margin:4px 0 0;">
                3 editoryal tercihe göre günün ideal saatini, atmosferini ve yürüyüş ritmini eşleştirin.
              </p>
            </div>
            <div style="font-family:var(--font-tech);font-size:0.75rem;color:var(--cap-gold);letter-spacing:0.12em;">
              STÜDYO KÜRATÖRLÜĞÜ · 6 EDİTORYAL ROTA
            </div>
          </div>

          <div class="cap-matcher-steps-grid">
            <!-- Step 1: Vibe / Mood -->
            <div class="cap-matcher-step">
              <span class="cap-matcher-step-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                1. RUH HALİN &amp; ODAK
              </span>
              <div class="cap-matcher-options" id="matcher-options-mood">
                <button class="cap-matcher-btn is-selected" data-matcher-mood="photo">📸 Fotoğraf &amp; Sabah Işığı</button>
                <button class="cap-matcher-btn" data-matcher-mood="coffee">☕ Han Avlusu &amp; Kahve</button>
                <button class="cap-matcher-btn" data-matcher-mood="bosphorus">🌊 1.50€ Gün Batımı Vapuru</button>
                <button class="cap-matcher-btn" data-matcher-mood="history">🏛️ Bizans Sarnıçları</button>
                <button class="cap-matcher-btn" data-matcher-mood="boho">🌿 Bostan &amp; Mahalle Dinginliği</button>
              </div>
            </div>

            <!-- Step 2: Time Budget -->
            <div class="cap-matcher-step">
              <span class="cap-matcher-step-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                2. ZAMAN BÜTÇEN
              </span>
              <div class="cap-matcher-options" id="matcher-options-time">
                <button class="cap-matcher-btn is-selected" data-matcher-time="short">⚡ 1.5 - 2 Saat (Kompakt)</button>
                <button class="cap-matcher-btn" data-matcher-time="long">⏳ 3 - 4 Saat (Derin Keşif)</button>
              </div>
            </div>

            <!-- Step 3: Pace & Terrain -->
            <div class="cap-matcher-step">
              <span class="cap-matcher-step-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 4v16M17 8l-4-4-4 4M7 20l4 4 4-4"/></svg>
                3. YÜRÜYÜŞ ZEMİNİ &amp; EFOR
              </span>
              <div class="cap-matcher-options" id="matcher-options-pace">
                <button class="cap-matcher-btn is-selected" data-matcher-pace="coastal">🚶 Düz Ayak Sahil Aksı</button>
                <button class="cap-matcher-btn" data-matcher-pace="hills">🧗 Merdivenli Yokuş &amp; Taş</button>
              </div>
            </div>
          </div>

          <!-- Dynamic Result Box -->
          <div class="cap-matcher-result" id="cap-matcher-result-box">
            <!-- Dynamically populated by renderMatcherResult() -->
          </div>
        </div>
      </section>

      <!-- 5. PRODUCTION PROGRAMMATIC SEO (pSEO) LIBRARY & CRAWLABLE SITEMAP SECTION -->
      <section class="cap-pseo-section" id="pseo-library-section">
        <div class="cap-pseo-container">
          <div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.5rem;">
            <div>
              <div style="font-family:var(--font-tech);font-size:11px;font-weight:700;letter-spacing:0.2em;color:var(--cap-gold);text-transform:uppercase;">
                SEMT KÜRASYON ARŞİVİ · İSTANBUL MİMARİ VE KÜLTÜR ROTALARI
              </div>
              <h2 style="font-family:var(--font-display);font-size:clamp(2.1rem,3.8vw,3.2rem);font-weight:800;letter-spacing:-0.02em;margin:6px 0 0;">
                İSTANBUL NİŞ ROTA KÜTÜPHANESİ
              </h2>
            </div>
            <span style="font-family:var(--font-tech);font-size:11px;color:var(--text-dark-muted);">
              6 ÖZEL EDİTÖRYAL PARKUR · SESLİ REHBERLİ
            </span>
          </div>

          <!-- pSEO Category Filter Tabs -->
          <div class="cap-pseo-filter-bar">
            <div class="cap-pseo-tabs" id="pseo-tabs">
              <button class="cap-filter-btn active" data-pseo-cat="all">TÜM ROTALAR (${this.pseoRoutes.length})</button>
              <button class="cap-filter-btn" data-pseo-cat="photo">FOTOĞRAFÇILIK</button>
              <button class="cap-filter-btn" data-pseo-cat="work">SESSİZ ÇALIŞMA</button>
              <button class="cap-filter-btn" data-pseo-cat="history">BİZANS & TARİH</button>
              <button class="cap-filter-btn" data-pseo-cat="bosphorus">1.50€ VAPUR</button>
            </div>
            <div style="font-family:var(--font-tech);font-size:11px;color:var(--cap-gold);" id="pseo-count-label">
              6 ÖZEL ROTA LİSTELENİYOR
            </div>
          </div>

          <!-- Crawlable pSEO Grid (Googlebot can follow links directly) -->
          <div class="cap-pseo-grid" id="pseo-routes-grid">
            <!-- Dynamically populated by renderPseoGrid() -->
          </div>
        </div>
      </section>

      <!-- 6. BÖLÜM 01 — KARAKÖY & GALATA (WARM MARBLE) -->
      <section class="cap-chapter cap-chapter--marble" id="chapitre-1">
        <div class="bg-marble"><img src="${this.marbleSvgDataUri}" alt="" class="bg-marble__svg"/></div>

        <div class="cap-chapter-header">
          <div class="cap-chapter-header__bar">
            <span class="cap-chapter-header__pill">BÖLÜM 01</span>
            <span class="cap-chapter-header__title">Galata & Karaköy Taş Kemerleri</span>
          </div>
        </div>

        <div class="cap-chapter-hero">
          <div class="cap-chapter-hero__arch-frame" data-open-route="karakoy-kamondo-sessiz-hanlar">
            <div class="ambient-image-flow">
              <img src="/assets/camondo_twilight.jpg" alt="Kamondo Merdivenleri Alacakaranlık" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              <img src="/assets/galata_twilight.jpg" alt="Galata Kulesi" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              <img src="/assets/bankalar_twilight.jpg" alt="Bankalar Caddesi" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
            </div>
          </div>
          <div class="cap-chapter-hero__copy">
            <span class="cap-chapter-hero__eyebrow">41.0242° N, 28.9746° E · AVRUPA YAKASI</span>
            <h2 class="cap-chapter-hero__title">Taşa Kazınan Ceneviz & Levanten Mirası</h2>
            <span class="cap-chapter-hero__sub">Kamondo Merdivenleri, Bankalar Caddesi ve Hanlar</span>
            <p class="cap-chapter-hero__lead">
              1348 yılında Cenevizlilerin diktiği Galata Kulesi’nden aşağı süzülen taş sokaklar, Bankalar Caddesi’nin 19. yüzyıl finans saraylarıyla buluşur. Kalabalık caddelerin bir adım arkasındaki gizli han avlularına girin.
            </p>
            ${this.renderBtnCap('BÖLÜMÜ OKU & DİNLE', 'btn-cap--on-marble', 'data-open-route="karakoy-kamondo-sessiz-hanlar"')}
          </div>
        </div>

        <div class="cap-panels-grid">
          <article class="cap-panel-card" data-open-route="karakoy-kamondo-sessiz-hanlar">
            <div class="cap-panel-card__tag">01 · 1348 CENEVİZ MİRASI</div>
            <div class="cap-panel-card__media">
              <div class="ambient-image-flow">
                <img src="/assets/galata_twilight.jpg" alt="Galata Kulesi" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/galata_tower_vintage_poster.jpg" alt="Galata Afiş" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/galata_bridge_fishermen.jpg" alt="Galata Köprüsü" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              </div>
            </div>
            <h3 class="cap-panel-card__title">Galata Kulesi & Surlar</h3>
            <p class="cap-panel-card__desc">Kule kuyruğunda beklemek yerine Büyük Hendek Sokak kesişiminden Ceneviz taş kuşağını izleyin.</p>
            <div class="cap-panel-card__meta">17:45 Alacakaranlık · Büyük Hendek Sokak</div>
          </article>

          <article class="cap-panel-card cap-panel-card--offset" data-open-route="karakoy-kamondo-sessiz-hanlar">
            <div class="cap-panel-card__tag">02 · 1892 ALEXANDRE VALLAURI</div>
            <div class="cap-panel-card__media">
              <div class="ambient-image-flow">
                <img src="/assets/bankalar_twilight.jpg" alt="SALT Galata" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/camondo_1895.jpg" alt="Camondo Merdivenleri" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/camondo_twilight.jpg" alt="Bankalar Caddesi" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              </div>
            </div>
            <h3 class="cap-panel-card__title">SALT Galata & Kasa Daireleri</h3>
            <p class="cap-panel-card__desc">Osmanlı İmparatorluğu’nun eski merkez bankası binası ve yeraltındaki çelik zırhlı kasa daireleri.</p>
            <div class="cap-panel-card__meta">Ücretsiz Ziyaret · Bankalar Caddesi</div>
          </article>

          <article class="cap-panel-card" data-open-route="karakoy-kamondo-sessiz-hanlar">
            <div class="cap-panel-card__tag">03 · 1771 GİZLİ AVLU</div>
            <div class="cap-panel-card__media">
              <div class="ambient-image-flow">
                <img src="/assets/direction_a.jpg" alt="St. Pierre Han" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/palace_interior_vintage_poster.jpg" alt="Tarihi Avlu" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/istanbul_stamp_diorama.jpg" alt="Diorama" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              </div>
            </div>
            <h3 class="cap-panel-card__title">St. Pierre Han & Közde Kahve</h3>
            <p class="cap-panel-card__desc">Fransız Elçisi Comte de Saint-Priest tarafından yaptırılan taş handa dingin bir kahve molası.</p>
            <div class="cap-panel-card__meta">Asırlık Taş Avlu · Eski Fransız Elçiliği</div>
          </article>
        </div>
      </section>

      <!-- 7. BÖLÜM 02 — TARİHİ YARIMADA & FENER-BALAT (DEEP OBSIDIAN) -->
      <section class="cap-chapter cap-chapter--obsidian" id="chapitre-2">
        <div class="bg-marble"><img src="${this.marbleSvgDataUri}" alt="" class="bg-marble__svg"/></div>

        <div class="cap-chapter-header">
          <div class="cap-chapter-header__bar">
            <span class="cap-chapter-header__pill">BÖLÜM 02</span>
            <span class="cap-chapter-header__title" style="color:var(--cap-gold);">Fener-Balat & Bizans Sarnıçları</span>
          </div>
        </div>

        <div class="cap-chapter-hero cap-chapter-hero--reverse">
          <div class="cap-chapter-hero__copy">
            <span class="cap-chapter-hero__eyebrow">41.0318° N, 28.9489° E · HALİÇ & YARIMADA</span>
            <h2 class="cap-chapter-hero__title">07:30 Altın Saatinde Kızıl Tuğlalar & Sarnıçlar</h2>
            <span class="cap-chapter-hero__sub">Kırmızı Mektep, Fener Yokuşları ve Yeraltı Sarnıçları</span>
            <p class="cap-chapter-hero__lead">
              Tur otobüsleri henüz uyanmadan Fener sırtlarına vuran ilk sabah güneşi, Kırmızı Mektep’in Marsilya tuğlalarını ve cumbalı ahşap evleri sinematik bir tabloya dönüştürür.
            </p>
            ${this.renderBtnCap('BÖLÜMÜ OKU & DİNLE', 'btn-cap--gold-solid', 'data-open-route="balat-altin-saat-fotograf-rotasi"')}
          </div>
          <div class="cap-chapter-hero__arch-frame" data-open-route="balat-altin-saat-fotograf-rotasi">
            <div class="ambient-image-flow">
              <img src="/assets/balat_golden_arch.jpg" alt="Fener Balat Altın Saat" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              <img src="/assets/balat_wooden_houses.jpg" alt="Cumbalı Ahşap Evler" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              <img src="/assets/balat_vintage_poster.jpg" alt="Balat Nostalji" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
            </div>
          </div>
        </div>

        <div class="cap-panels-grid">
          <article class="cap-panel-card" data-open-route="balat-altin-saat-fotograf-rotasi">
            <div class="cap-panel-card__tag">01 · 07:30 ALTIN SAAT</div>
            <div class="cap-panel-card__media">
              <div class="ambient-image-flow">
                <img src="/assets/balat_golden_arch.jpg" alt="Kırmızı Mektep" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/balat_wooden_houses.jpg" alt="Ahşap Evler" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/balat_cat_church.jpg" alt="Fener Sokakları" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              </div>
            </div>
            <h3 class="cap-panel-card__title">Kırmızı Mektep & Merdivenli Yokuş</h3>
            <p class="cap-panel-card__desc">1881 yapımı Fener Rum Erkek Lisesi’nin şato mimarisi ve pastel renkli cumbalı evler.</p>
            <div class="cap-panel-card__meta">24mm Geniş Açı · Sancaktar Yokuşu</div>
          </article>

          <article class="cap-panel-card cap-panel-card--offset" data-open-route="sultanahmet-bizans-sarniclari-rotasi">
            <div class="cap-panel-card__tag">02 · MS 428 BİZANS MİRASI</div>
            <div class="cap-panel-card__media">
              <div class="ambient-image-flow">
                <img src="/assets/sultanahmet_cistern_marble.jpg" alt="Şerefiye Sarnıcı" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/basilica_cistern_columns.jpg" alt="Yerebatan Sarnıcı" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/basilica_cistern_poster.jpg" alt="Sarnıç İllüstrasyonu" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              </div>
            </div>
            <h3 class="cap-panel-card__title">Şerefiye & Yerebatan Sarnıçları</h3>
            <p class="cap-panel-card__desc">Karanlık su aynasında yükselen 1600 yıllık mermer sütunlar ve yeraltı akustiği.</p>
            <div class="cap-panel-card__meta">360° Su Üstü Işık Şovu · Çemberlitaş</div>
          </article>

          <article class="cap-panel-card" data-open-route="sultanahmet-bizans-sarniclari-rotasi">
            <div class="cap-panel-card__tag">03 · 1557 MİMAR SİNAN</div>
            <div class="cap-panel-card__media">
              <div class="ambient-image-flow">
                <img src="/assets/direction_b.jpg" alt="Süleymaniye Terası" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/suleymaniye_panorama.jpg" alt="Haliç Panoraması" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/suleymaniye_courtyard.jpg" alt="Sinan Avlusu" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              </div>
            </div>
            <h3 class="cap-panel-card__title">Süleymaniye Gizli Avlu Terası</h3>
            <p class="cap-panel-card__desc">Sabah sükunetinde Haliç, Galata ve Boğaziçi’ni tek bir kadrajda birleştiren seyir terası.</p>
            <div class="cap-panel-card__meta">Ücretsiz Giriş · Haliç Panoraması</div>
          </article>
        </div>
      </section>

      <!-- 8. BÖLÜM 03 — ASYA YAKASI & BOĞAZİÇİ (WARM MARBLE) -->
      <section class="cap-chapter cap-chapter--marble" id="chapitre-3">
        <div class="bg-marble"><img src="${this.marbleSvgDataUri}" alt="" class="bg-marble__svg"/></div>

        <div class="cap-chapter-header">
          <div class="cap-chapter-header__bar">
            <span class="cap-chapter-header__pill">BÖLÜM 03</span>
            <span class="cap-chapter-header__title">Boğaziçi & Asya Kıyıları</span>
          </div>
        </div>

        <div class="cap-chapter-hero">
          <div class="cap-chapter-hero__arch-frame" data-open-route="moda-gun-batimi-vapur-turu">
            <div class="ambient-image-flow">
              <img src="/assets/moda_bosphorus_ferry.jpg" alt="Moda İskelesi Gün Batımı" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              <img src="/assets/bosphorus_ferry_poster.jpg" alt="Boğaz Vapuru" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              <img src="/assets/ferries_golden_horn.jpg" alt="Haliç Vapurları" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
            </div>
          </div>
          <div class="cap-chapter-hero__copy">
            <span class="cap-chapter-hero__eyebrow">40.9862° N, 29.0254° E · ASYA YAKASI</span>
            <h2 class="cap-chapter-hero__title">1.50€’luk Vapurla Avrupa’dan Asya’ya Geçiş</h2>
            <span class="cap-chapter-hero__sub">Moda İskelesi, 700 Yıllık Bostan ve Yaşayan Mahalleler</span>
            <p class="cap-chapter-hero__lead">
              Karaköy İskelesi’nden kalkan Şehir Hatları vapurunun açık güvertesinde ince belli bardakta çayınızla kıta değiştirin; günü Tarihi Moda İskelesi’nde ve Kuzguncuk’ta tamamlayın.
            </p>
            ${this.renderBtnCap('BÖLÜMÜ OKU & DİNLE', 'btn-cap--on-marble', 'data-open-route="moda-gun-batimi-vapur-turu"')}
          </div>
        </div>

        <div class="cap-panels-grid">
          <article class="cap-panel-card" data-open-route="moda-gun-batimi-vapur-turu">
            <div class="cap-panel-card__tag">01 · 1917 MİMAR VEDAT TEK</div>
            <div class="cap-panel-card__media">
              <div class="ambient-image-flow">
                <img src="/assets/moda_bosphorus_ferry.jpg" alt="Moda İskelesi" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/haydarpasa_vintage_poster.jpg" alt="Haydarpaşa" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/maidens_tower_poster.jpg" alt="Kız Kulesi" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              </div>
            </div>
            <h3 class="cap-panel-card__title">Tarihi Moda İskelesi & Kütüphane</h3>
            <p class="cap-panel-card__desc">Neoklasik taş kemerli iskelenin üst kat kütüphanesinden Tarihi Yarımada silüetine karşı gün batımı.</p>
            <div class="cap-panel-card__meta">18:15 Gün Batımı · Kadıköy Moda</div>
          </article>

          <article class="cap-panel-card cap-panel-card--offset" data-open-route="kuzguncuk-bostan-ahsap-koskler">
            <div class="cap-panel-card__tag">02 · 700 YILLIK BOSTAN</div>
            <div class="cap-panel-card__media">
              <div class="ambient-image-flow">
                <img src="/assets/direction_c.jpg" alt="Kuzguncuk" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/beylerbeyi_palace_poster.jpg" alt="Beylerbeyi Sarayı" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/ortakoy_mosque_poster.jpg" alt="Ortaköy Sahili" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              </div>
            </div>
            <h3 class="cap-panel-card__title">Kuzguncuk & İcadiye Sokakları</h3>
            <p class="cap-panel-card__desc">Asırlık çınarlar altında ahşap cumbalı köşkler, tarihi fırınlar ve yaşayan mahalle kültürü.</p>
            <div class="cap-panel-card__meta">Mahalle Kültürü · Üsküdar Kuzguncuk</div>
          </article>

          <article class="cap-panel-card" data-open-route="nisantasi-art-nouveau-tasarim">
            <div class="cap-panel-card__tag">03 · ASIRLIK ESNAF RİTÜELİ</div>
            <div class="cap-panel-card__media">
              <div class="ambient-image-flow">
                <img src="/assets/istanbul_gastronomy_ritual.jpg" alt="Kadıköy Çarşısı" class="ambient-image-flow__slide is-active" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/grand_bazaar_lamps.jpg" alt="Kapalıçarşı Lambaları" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
                <img src="/assets/grand_bazaar_vintage_poster.jpg" alt="Tarihi Çarşı" class="ambient-image-flow__slide" loading="lazy" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src=(this.src.includes('/public/assets/')?this.src.replace('/public/assets/','/assets/'):this.src.replace('/assets/','/public/assets/'));}"/>
              </div>
            </div>
            <h3 class="cap-panel-card__title">Kadıköy Çarşısı & Nişantaşı Avluları</h3>
            <p class="cap-panel-card__desc">Güneşlibahçe Sokak’ın tarihi esnaf lokantalarından Teşvikiye’nin Art Nouveau pasajlarına.</p>
            <div class="cap-panel-card__meta">Gerçek Esnaf Lezzeti · Kadıköy & Teşvikiye</div>
          </article>
        </div>
      </section>

      <!-- 9. BÖLÜM 04 — TURİST TUZAĞI VS. YEREL KAŞİF SIRRI (DEEP OBSIDIAN) -->
      <section class="cap-chapter cap-chapter--obsidian" id="chapitre-4">
        <div class="bg-marble"><img src="${this.marbleSvgDataUri}" alt="" class="bg-marble__svg"/></div>

        <div class="cap-chapter-header">
          <div class="cap-chapter-header__bar">
            <span class="cap-chapter-header__pill">BÖLÜM 04</span>
            <span class="cap-chapter-header__title" style="color:var(--cap-gold);">Gerçek İstanbullu Sırları & Gastronomi</span>
          </div>
        </div>

        <div style="max-width:1200px;margin:0 auto 3.5rem;padding:0 2rem;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.5rem;position:relative;z-index:3;">
          <div>
            <h2 style="font-family:var(--font-display);font-size:clamp(2rem,3.6vw,3.2rem);font-weight:800;letter-spacing:-0.02em;margin:0;">
              TURİST TUZAĞI VS. YEREL KAŞİF SIRRI
            </h2>
          </div>
          ${this.renderBtnCap('GASTRONOMİ REHBERİNİ OKU', 'btn-cap--gold-solid', 'data-open-route="karakoy-kamondo-sessiz-hanlar"')}
        </div>

        <div class="cap-trap-grid">
          ${this.trapsVsSecrets.map((item) => `
            <div class="cap-trap-card" data-open-route="${item.routeSlug}" role="button" tabindex="0" title="${item.secretTitle} rotasını aç">
              <div class="cap-trap-side cap-trap-side--bad">
                <div style="font-family:var(--font-tech);font-size:11px;font-weight:700;letter-spacing:0.12em;color:#fb7185;display:flex;align-items:center;gap:6px;">
                  <span style="display:inline-flex;width:6px;height:6px;border-radius:50%;background:#fb7185;"></span>
                  TUZAK · ${item.category}
                </div>
                <h3>${item.trapTitle}</h3>
                <p style="color:var(--text-dark-secondary);">${item.trapDesc}</p>
              </div>
              <div class="cap-trap-side cap-trap-side--good" data-open-route="${item.routeSlug}">
                <div style="display:flex;align-items:center;justify-content:space-between;">
                  <span style="font-family:var(--font-tech);font-size:11px;font-weight:700;letter-spacing:0.12em;color:#34d399;display:flex;align-items:center;gap:6px;">
                    <span style="display:inline-flex;width:6px;height:6px;border-radius:50%;background:#34d399;"></span>
                    YEREL SIRRI
                  </span>
                  <span style="font-family:var(--font-tech);font-size:10px;font-weight:600;color:var(--cap-gold);">${item.saving}</span>
                </div>
                <h3 style="color:var(--cap-gold);">${item.secretTitle}</h3>
                <p style="color:var(--text-dark-primary);">${item.secretDesc}</p>
                ${item.images && item.images.length ? `
                  <div class="cap-trap-side__media" data-open-route="${item.routeSlug}">
                    <div class="ambient-image-flow">
                      ${item.images.map((img, idx) => `
                        <img src="${img}" alt="${item.secretTitle}" class="ambient-image-flow__slide ${idx === 0 ? 'is-active' : ''}" loading="lazy"/>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
                <div style="display:flex;align-items:center;justify-content:flex-end;margin-top:auto;padding-top:8px;">
                  <span class="cap-trap-open-cta">ROTAYI KEŞFET →</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 10. İNTERAKTİF BOĞAZ & 6 SEMT ATLASI -->
      <section class="cap-atlas-section" id="bosphorus-atlas-section">
        <div style="max-width:1200px;margin:0 auto;">
          <div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.5rem;">
            <div>
              <div style="font-family:var(--font-tech);font-size:11px;font-weight:600;letter-spacing:0.18em;color:var(--cap-gold);text-transform:uppercase;">
                CANLI MEKANSAL HARİTA · AVRUPA ↔ ASYA VAPUR HATLARI
              </div>
              <h2 style="font-family:var(--font-display);font-size:clamp(2rem,3.6vw,3.1rem);font-weight:800;letter-spacing:-0.02em;margin:6px 0 0;">
                BOĞAZ & 6 SEMT KEŞİF ATLASI
              </h2>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;" id="atlas-district-buttons">
              ${this.districts.map((d) => `
                <button class="cap-menu-pill-btn ${d.id === this.selectedDistrictId ? 'active' : ''}" data-select-atlas="${d.id}">
                  ${d.name}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="cap-atlas-layout">
            <div class="cap-atlas-canvas-wrap">
              <canvas id="bosphorus-atlas-canvas" width="820" height="520"></canvas>
            </div>
            <div class="cap-atlas-sidebar" id="atlas-sidebar-content"></div>
          </div>
        </div>
      </section>

      <!-- 11. "GÜNÜNÜZÜ PLANLAYIN" — SAATLİK İSTANBUL PLANI -->
      <section class="cap-programme-section panel--marble" id="votre-programme-section">
        <div class="bg-marble"><img src="${this.marbleSvgDataUri}" alt="" class="bg-marble__svg"/></div>

        <div class="cap-programme-container">
          <div style="font-family:var(--font-tech);font-size:11px;font-weight:600;letter-spacing:0.2em;color:#8c6d3f;text-transform:uppercase;">
            GÜNÜNÜZÜ PLANLAYIN · SAATLİK İSTANBUL ROTASI
          </div>
          <h2 style="font-family:var(--font-display);font-size:clamp(2.1rem,3.8vw,3.4rem);font-weight:800;letter-spacing:-0.02em;margin:6px 0 0;">
            RUH HALİNE GÖRE GÜNLÜK PROGRAMIN
          </h2>

          <div class="cap-vibe-tabs">
            <button class="cap-filter-btn active" data-prog-vibe="arch">MİMARİ & GİZLİ AVLULAR</button>
            <button class="cap-filter-btn" data-prog-vibe="photo">07:30 ALTIN SAAT FOTOĞRAF</button>
            <button class="cap-filter-btn" data-prog-vibe="food">GASTRONOMİ & 1.50€ VAPUR</button>
            <button class="cap-filter-btn" data-prog-vibe="night">GECE SARNIÇLARI & TERASLAR</button>
          </div>

          <div class="cap-timeline-list" id="cap-timeline-list"></div>

          <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:2.75rem;">
            ${this.renderBtnCap('9:16 STORY AFİŞİNİ İNDİR (PNG)', 'btn-cap--on-marble', 'id="btn-download-story-png"')}
            ${this.renderBtnCap('ROTAYI CANLI SAHA UYGULAMASINDA AÇ', 'btn-cap--gold-solid', 'data-open-pwa="Karaköy · Galata"')}
          </div>
          <canvas id="story-poster-canvas" width="540" height="960" style="display:none;"></canvas>
        </div>
      </section>

      <!-- 12. MONUMENTAL CAPITOLIUM FOOTER -->
      <footer class="cap-chapter cap-chapter--obsidian" style="padding:6rem 2rem;text-align:center;">
        <div class="bg-marble"><img src="${this.marbleSvgDataUri}" alt="" class="bg-marble__svg"/></div>
        <div style="position:relative;z-index:3;max-width:920px;margin:0 auto;">
          <div style="font-family:var(--font-serif);font-size:clamp(2rem,3.8vw,3.2rem);font-style:italic;color:var(--cap-gold);">
            İki Kıta, Tek Ruh · Şehrin Görünmeyen Katmanları
          </div>
          <div style="font-family:var(--font-display);font-size:clamp(2.2rem,5vw,4.4rem);font-weight:800;letter-spacing:0.12em;color:var(--text-dark-primary);margin:0.5rem 0 2rem;">
            SEMT · İSTANBUL
          </div>
          <div style="margin-bottom:2.5rem;">
            ${this.renderBtnCap('3B CANLI SAHA UYGULAMASINI BAŞLAT', 'btn-cap--gold-solid', 'data-open-pwa="Karaköy · Galata"')}
          </div>
          <p style="font-family:var(--font-tech);font-size:11px;letter-spacing:0.14em;color:#94a3b8;margin:0;">
            © 2026 SEMT İSTANBUL · KARAKÖY · BALAT · SULTANAHMET · MODA · KUZGUNCUK · NİŞANTAŞI
          </p>
        </div>
      </footer>

      <!-- 13. FLOATING MOBILE SMART HUD & ACTION BAR (MOBILE ONLY <= 768px) -->
      <nav class="cap-mobile-nav-bar" id="cap-mobile-nav-bar" aria-label="Mobil Hızlı Menü">
        <div class="cap-mobile-nav-inner">
          <button class="cap-mob-btn is-active" data-mob-action="hero" title="Giriş" aria-label="Giriş">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Keşif</span>
          </button>
          <button class="cap-mob-btn" data-mob-action="routes" title="Rotalar" aria-label="Rotalar">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
            <span>Rotalar</span>
          </button>
          <button class="cap-mob-btn cap-mob-btn--center" data-mob-action="matcher" title="Ruh Hali & Rota Bulucu" aria-label="Rota Bul">
            <div class="cap-mob-center-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            </div>
            <span>Rota Bul</span>
          </button>
          <button class="cap-mob-btn" data-mob-action="atlas" title="Canlı Boğaz Haritası" aria-label="Harita">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>Harita</span>
          </button>
          <button class="cap-mob-btn" data-mob-action="passport" title="Gezgin Pasaportu" aria-label="Pasaport">
            <div class="cap-mob-badge-wrap">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span class="cap-mob-passport-badge" id="mob-passport-count">0/24</span>
            </div>
            <span>Pasaport</span>
          </button>
        </div>
      </nav>

      <!-- 12. DEDICATED IMMERSIVE SECOND SCREEN / ROUTE EXPERIENCE STAGE -->
      <div class="cap-route-stage" id="cap-route-stage" role="dialog" aria-modal="true" aria-label="Semt Rota İkinci Ekranı">
        <div class="cap-route-stage__container" id="cap-route-stage-content"></div>
      </div>
      <!-- Backward compatibility hidden container -->
      <div id="cap-blog-reader-modal" style="display:none;"><div id="cap-blog-reader-content"></div></div>
    `;
  }

  // Render the crawlable Programmatic SEO grid
  renderPseoGrid() {
    const grid = document.getElementById('pseo-routes-grid');
    if (!grid) return;

    let routes = [...this.pseoRoutes];
    if (this.pseoActiveFilter !== 'all') {
      routes = routes.filter((r) => r.category === this.pseoActiveFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      routes = routes.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.stops.some((s) => s.toLowerCase().includes(q))
      );
    }

    const countLabel = document.getElementById('pseo-count-label');
    if (countLabel) {
      countLabel.textContent = `${routes.length} ÖZEL ROTA LİSTELENİYOR`;
    }

    grid.innerHTML = routes
      .map(
        (r) => `
        <a href="?route=${r.slug}" class="cap-pseo-card" data-open-route="${r.slug}" onclick="event.preventDefault(); window.semtPortal.openRouteBySlug('${r.slug}');">
          <div class="cap-pseo-card__media">
            <div class="ambient-image-flow">
              ${(r.images || [r.image]).map((img, idx) => `
                <img src="${img}" alt="${r.title}" class="ambient-image-flow__slide ${idx === 0 ? 'is-active' : ''}" loading="lazy"/>
              `).join('')}
            </div>
          </div>
          <div class="cap-pseo-card-header">
            <span class="cap-pseo-district-tag">${r.district}</span>
            <span class="cap-pseo-time-tag">${r.duration}</span>
          </div>
          <h3 class="cap-pseo-title">${r.title}</h3>
          <p class="cap-pseo-desc">${r.subtitle}</p>
          <div class="cap-pseo-stops-row">
            ${r.stops.map((s) => `<span class="cap-pseo-stop-pill">${s}</span>`).join('')}
          </div>
          <div class="cap-pseo-footer-meta">
            <span>${r.bestHour}</span>
            <span style="font-weight:700;color:var(--cap-gold);">ROTAYI İNCELE →</span>
          </div>
        </a>
      `
      )
      .join('');
  }

  // Stationary Hero Route Showcase & Ambient Flow Engine (Zero Timers Shown)
  startHeroSlider() {
    this.updateHeroRouteCard();
    this.initAmbientImageFlows();
  }

  // Pure Ambient Crossfade Image Engine (Görsellerin Yavaşça Aktığı Sistem)
  initAmbientImageFlows() {
    if (this.ambientFlowTimer) clearInterval(this.ambientFlowTimer);

    // Gently cycles all .ambient-image-flow containers every 4.2 seconds
    this.ambientFlowTimer = setInterval(() => {
      if (document.hidden) return;
      document.querySelectorAll('.ambient-image-flow').forEach((container) => {
        if (!container.offsetParent) return;
        const rect = container.getBoundingClientRect();
        if (rect.top > window.innerHeight + 150 || rect.bottom < -150) return;

        const slides = container.querySelectorAll('.ambient-image-flow__slide');
        if (slides.length <= 1) return;

        let activeIdx = 0;
        slides.forEach((sl, idx) => {
          if (sl.classList.contains('is-active')) activeIdx = idx;
        });

        slides[activeIdx].classList.remove('is-active');
        const nextIdx = (activeIdx + 1) % slides.length;
        slides[nextIdx].classList.add('is-active');

        // Synchronize modal thumbnail filmstrip if open
        if (container.id === 'reader-modal-ambient-flow') {
          document.querySelectorAll('.cap-reader-thumb-btn').forEach((btn, idx) => {
            btn.classList.toggle('is-active', idx === nextIdx);
          });
        }
      });
    }, 4200);
  }

  tickBackgroundTimer() {
    // Silent internal state without digital countdown numbers
    this.sessionElapsedSeconds = (this.sessionElapsedSeconds || 0) + 1;
  }

  updateHeroRouteCard() {
    const r = this.pseoRoutes[this.heroSliderIndex];
    if (!r) return;

    const titleEl = document.getElementById('slider-route-title');
    const descEl = document.getElementById('slider-route-desc');
    const counterEl = document.getElementById('slider-route-counter');
    const tagEl = document.getElementById('slider-route-tag');
    const stopsEl = document.getElementById('slider-route-stops');
    const metaEl = document.getElementById('slider-route-meta');
    const openBtn = document.getElementById('btn-slider-open-route');
    const bar = document.getElementById('hero-slider-progress-bar');
    const dotsEl = document.getElementById('slider-route-dots');
    const thumbEl = document.querySelector('.cap-slider-thumb');

    if (titleEl) titleEl.textContent = r.title;
    if (descEl) descEl.textContent = r.subtitle;
    if (counterEl) counterEl.textContent = `0${this.heroSliderIndex + 1} / 0${this.pseoRoutes.length}`;
    if (tagEl) tagEl.textContent = `${r.district.toUpperCase()} · ${r.categoryLabel}`;

    // Update thumb with flowing ambient images for the active route
    if (thumbEl) {
      const imgs = r.images || [r.image];
      thumbEl.innerHTML = `
        <div class="ambient-image-flow" id="hero-slider-ambient-flow">
          ${imgs.map((img, idx) => `
            <img src="${img}" alt="${r.title}" class="ambient-image-flow__slide ${idx === 0 ? 'is-active' : ''}" loading="lazy" decoding="async" />
          `).join('')}
        </div>
      `;
    }

    if (stopsEl) {
      stopsEl.textContent = r.stops.join('  ·  ');
    }
    if (metaEl) {
      metaEl.innerHTML = `
        <span class="cap-meta-chip">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${r.duration}
        </span>
        <span class="cap-meta-chip">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          ${r.bestHour}
        </span>
        <span class="cap-meta-chip">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          ${r.budget}
        </span>
      `;
    }
    if (openBtn) {
      openBtn.onclick = () => this.openRouteBySlug(r.slug);
    }

    const contentRow = document.getElementById('slider-content-row');
    if (contentRow) {
      contentRow.setAttribute('data-open-route', r.slug);
      contentRow.setAttribute('title', `${r.title} rotasını aç`);
      contentRow.onclick = () => this.openRouteBySlug(r.slug);
    }

    const heroArch = document.getElementById('hero-arch-window');
    if (heroArch) {
      heroArch.setAttribute('data-open-route', r.slug);
      heroArch.setAttribute('title', `${r.title} rotasını aç`);
      heroArch.onclick = () => this.openRouteBySlug(r.slug);
    }

    if (bar) {
      const pct = ((this.heroSliderIndex + 1) / this.pseoRoutes.length) * 100;
      bar.style.width = `${pct}%`;
    }

    if (dotsEl) {
      dotsEl.innerHTML = this.pseoRoutes.map((_, i) => `
        <button class="cap-slider-dot ${i === this.heroSliderIndex ? 'active' : ''}" data-slider-dot="${i}" title="Rota 0${i + 1}">
          0${i + 1}
        </button>
      `).join('');

      dotsEl.querySelectorAll('[data-slider-dot]').forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-slider-dot'), 10);
          this.setHeroSliderIndex(idx);
        };
      });
    }
  }

  setHeroSliderIndex(newIdx) {
    if (newIdx < 0) newIdx = this.pseoRoutes.length - 1;
    if (newIdx >= this.pseoRoutes.length) newIdx = 0;
    this.heroSliderIndex = newIdx;

    const row = document.getElementById('slider-content-row');
    if (row) {
      row.classList.add('is-switching');
      setTimeout(() => {
        this.updateHeroRouteCard();
        row.classList.remove('is-switching');
      }, 150);
    } else {
      this.updateHeroRouteCard();
    }

    this.playChime(540, 0.05);
  }

  nextHeroSlider() {
    this.setHeroSliderIndex(this.heroSliderIndex + 1);
  }

  prevHeroSlider() {
    this.setHeroSliderIndex(this.heroSliderIndex - 1);
  }

  // Open Route by slug and transition to dedicated full-screen Second Screen Stage
  openRouteBySlug(slug) {
    const r = this.pseoRoutes.find((x) => x.slug === slug) || this.pseoRoutes[0];
    this.activeOpenedRoute = r;
    this.currentPlayingStop = 0;
    this.isStageAudioPlaying = false;

    const stage = document.getElementById('cap-route-stage');
    const container = document.getElementById('cap-route-stage-content');
    if (!stage || !container) return;

    try {
      history.pushState({ route: r.slug }, '', `?route=${r.slug}`);
    } catch (_) {}

    this.injectJsonLd(r);

    const durationNum = parseFloat(r.duration) || 2.5;
    const steps = Math.round(durationNum * 2100).toLocaleString('tr-TR');
    const km = (durationNum * 1.8).toFixed(1);

    // Stop curated curatorial details
    const stopDetails = [
      {
        angle: '35mm · Sokak & Mimari Detay',
        history: 'Ceneviz ve Osmanlı taş işçiliğinin eğimli yamaçtaki neobarok sentezi.',
        secret: 'Erken sabah ışığında basamaklardaki döküm motifleri ve gölgeler.'
      },
      {
        angle: '50mm · Portre & Işık Hüzmesi',
        history: '19. yüzyıl finans merkezinin görkemli tonozları ve mermer atriumu.',
        secret: 'Yeraltı arşiv salonundaki sessiz çalışma masaları ve serinlik.'
      },
      {
        angle: '28mm · Geniş Açı & Han Avlusu',
        history: 'Ahşap koridor karkasları ve yüzyıllık el zanaatkarlarının taş odaları.',
        secret: 'İç avlunun süzülen tavan ışığı ve közde pişen kahve aroması.'
      },
      {
        angle: '85mm · Telefoto & Ufuk Çizgisi',
        history: 'Boğaz suyunun Marmara Denizi ile buluştuğu açık seyir noktası.',
        secret: 'İskele kütüphanesinin deniz seviyesindeki kemerli okuma köşesi.'
      }
    ];

    if (this.analytics) {
      this.analytics.track('route_view', {
        route_slug: r.slug,
        route_title: r.title,
        district: r.district,
        category: r.category
      });
    }

    container.innerHTML = `
      <!-- 1. STICKY TOP STUDIO BAR -->
      <header class="cap-route-stage__nav">
        <div class="cap-nav-left-group">
          <button class="cap-nav-back-btn" id="btn-close-route-stage" aria-label="Ana Portala Dön">
            ← SEMT PORTALINA DÖN
          </button>
          <div style="width:1px;height:18px;background:rgba(195,166,119,0.25);"></div>
          <div class="cap-nav-district-badge">
            <span class="cap-beacon-pulse"></span>
            <span id="route-stage-nav-district">${r.district.toUpperCase()}</span>
          </div>
        </div>

        <div class="cap-nav-right-group">
          <button class="cap-menu-pill-btn" id="btn-stage-offline-pass" title="Çevrimdışı Seyahat Kartını Görüntüle ve Yazdır">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-1px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>ÇEVRİMDİŞİ KART
          </button>
          <button class="cap-menu-pill-btn" id="btn-stage-share" title="Rota Bağlantısını Paylaş">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-1px;"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>PAYLAŞ
          </button>
          <button class="cap-menu-pill-btn" id="btn-stage-audio-toggle">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-1px;"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>SESLİ REHBER
          </button>
          <button class="btn-cap btn-cap--gold-solid" id="btn-stage-open-pwa" style="height:36px;padding:0 1.15rem;font-size:0.75rem;">
            <span class="btn-cap__inner">3B SAHADA AÇ →</span>
          </button>
        </div>
      </header>

      <!-- Studio Reading Progress Hairline -->
      <div class="cap-stage-reading-progress-track">
        <div class="cap-stage-reading-progress" id="stage-reading-progress"></div>
      </div>

      <!-- 2. CINEMATIC ROUTE HERO -->
      <section class="cap-stage-hero">
        <div class="cap-stage-hero__meta-top">
          <span>SEMT EDİTORYAL KEŞİF ARŞİVİ</span>
          <span>·</span>
          <span style="color:#fef08a;">${r.categoryLabel}</span>
          <span>·</span>
          <span>${r.district}</span>
        </div>

        <h1 class="cap-stage-hero__title">
          ${r.title}
        </h1>

        <p class="cap-stage-hero__subtitle">
          ${r.subtitle}
        </p>

        <!-- Curatorial Key Facts Snippet (Condé Nast / Monocle Luxury Travel Standard) -->
        <div class="cap-key-facts-grid">
          <div class="cap-fact-card">
            <div class="cap-fact-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </div>
            <div class="cap-fact-body">
              <span class="cap-fact-label">İDEAL IŞIK &amp; SAAT</span>
              <strong class="cap-fact-val">${r.bestHour}</strong>
              <span class="cap-fact-sub">Tavsiye edilen süre: ${r.duration}</span>
            </div>
          </div>

          <div class="cap-fact-card">
            <div class="cap-fact-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
            </div>
            <div class="cap-fact-body">
              <span class="cap-fact-label">BÜTÇE &amp; ULAŞIM</span>
              <strong class="cap-fact-val">${r.budget}</strong>
              <span class="cap-fact-sub">Müze Kart &amp; Şehir Hatları geçerli</span>
            </div>
          </div>

          <div class="cap-fact-card">
            <div class="cap-fact-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4v16M17 8l-4-4-4 4M7 20l4 4 4-4"/></svg>
            </div>
            <div class="cap-fact-body">
              <span class="cap-fact-label">YÜRÜYÜŞ &amp; EFOR</span>
              <strong class="cap-fact-val">~${km} km · ${steps} Adım</strong>
              <span class="cap-fact-sub">Tarihi arnavut kaldırımı &amp; merdiven</span>
            </div>
          </div>

          <div class="cap-fact-card">
            <div class="cap-fact-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <div class="cap-fact-body">
              <span class="cap-fact-label">FOTOĞRAFÇI KADRAJI</span>
              <strong class="cap-fact-val">35mm / 50mm Lens</strong>
              <span class="cap-fact-sub">Sabah eğik ışık açısı · Kalabalık: ${r.crowd}</span>
            </div>
          </div>
        </div>

        <!-- Hero Ambient Gallery -->
        <div class="cap-stage-hero-gallery">
          <div class="ambient-image-flow" id="stage-hero-ambient-flow">
            ${(r.images || [r.image]).map((img, idx) => `
              <img src="${img}" alt="${r.title}" class="ambient-image-flow__slide ${idx === 0 ? 'is-active' : ''}" loading="lazy" decoding="async" />
            `).join('')}
          </div>
        </div>

        <!-- Interactive Thumbnail Strip -->
        <div class="cap-stage-hero-thumbs">
          ${(r.images || [r.image]).map((img, idx) => `
            <button class="cap-stage-thumb-pill ${idx === 0 ? 'is-active' : ''}" data-stage-thumb="${idx}" aria-label="Görsel 0${idx + 1}">
              <img src="${img}" alt="" loading="lazy" decoding="async" />
            </button>
          `).join('')}
        </div>
      </section>

      <!-- 3. DUAL COLUMN SPATIAL BODY -->
      <section class="cap-stage-body">
        <!-- Left: Stops Timeline -->
        <div class="cap-stage-left">
          <div>
            <div class="cap-stage-section-tag">MİMARİ ROTA &amp; KADRAJ REHBERİ</div>
            <h2 class="cap-stage-section-title">Adım Adım Duraklar ve Mekansal İpuçları</h2>
          </div>

          <!-- Dual-Navigation Field Engine: Multi-Waypoint Itinerary Card -->
          <div class="cap-multi-nav-card" id="cap-multi-nav-card">
            <div class="cap-multi-nav-header">
              <div class="cap-multi-nav-title-group">
                <span class="cap-multi-nav-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  KESİNTİSİZ YÜRÜYÜŞ NAVİGASYONU
                </span>
                <h3 class="cap-multi-nav-heading">Tüm Rotayı Haritada Aç &amp; Adım Adım Takip Et</h3>
                <p class="cap-multi-nav-sub">
                  ${r.stops.length} durak sıralı yürüme güzergahında birleştirildi. Apple Haritalar veya Google Haritalar ile tek dokunuşla canlı navigasyon başlatın.
                </p>
              </div>
              <div class="cap-multi-nav-badge">
                <strong style="color:var(--cap-gold);font-size:1.15rem;font-family:var(--font-tech);">~${km} KM</strong>
                <span style="font-size:0.7rem;color:#94a3b8;letter-spacing:0.06em;">${r.stops.length} DURAK BİRLEŞİK</span>
              </div>
            </div>
            <div class="cap-multi-nav-actions">
              <button class="btn-cap btn-cap--gold-solid cap-nav-launch-btn" id="btn-launch-multi-nav">
                <span class="btn-cap__inner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  TAM ROTAYI HARİTADA AÇ (GOOGLE / APPLE) ↗
                </span>
              </button>
              <button class="cap-stop-btn cap-nav-copy-coords-btn" id="btn-copy-route-coords" title="Tüm durak koordinatlarını panoya kopyala">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span id="label-copy-route-coords">GPS KOORDİNATLARINI KOPYALA</span>
              </button>
            </div>
          </div>

          <!-- Gezgin Keşif Pasaportu & Canlı Durak Takibi -->
          <div class="cap-passport-hud" id="stage-passport-hud">
            <div>
              <div style="font-family:var(--font-tech);font-size:0.72rem;color:var(--cap-gold);letter-spacing:0.12em;font-weight:700;">
                ✦ GEZGİN SAHA PASAPORTU · DURAK TAKİBİ
              </div>
              <div style="font-family:var(--font-display);font-size:1.05rem;font-weight:700;margin-top:2px;" id="passport-status-text">
                0 / ${r.stops.length} Durak Tamamlandı (%0)
              </div>
            </div>
            <div class="cap-passport-progress-wrap">
              <div class="cap-passport-progress-track">
                <div class="cap-passport-progress-fill" id="passport-progress-bar"></div>
              </div>
            </div>
          </div>
          <div id="passport-congrats-container"></div>

          <div style="display:flex;flex-direction:column;gap:2rem;">
            ${r.stops.map((st, idx) => {
              const stopImg = (r.images && r.images[idx % r.images.length]) || r.image;
              const detail = stopDetails[idx % stopDetails.length];
              const stData = (r.stopsData && r.stopsData[idx]) || { name: st, lat: 41.0242, lng: 28.9746, transit: 'Merkez', walkMin: 3 };
              return `
                <article class="cap-stop-card ${idx === 0 ? 'is-active-stop' : ''}" id="stop-card-${idx}" data-stop-index="${idx}">
                  <div class="cap-stop-card__header" role="button" tabindex="0" title="${st} durağını seç">
                    <div class="cap-stop-index-pill">
                      <span class="cap-stop-index-circle">0${idx + 1}</span>
                      <span>DURAK ${idx + 1} / ${r.stops.length}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                      <span class="cap-stop-transit-pill" title="En yakın toplu taşıma durağı">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>
                        <span>${stData.transit}</span>
                      </span>
                      <span class="cap-stop-walk-time">~${(idx + 1) * 7} dk yürüyüş aksı</span>
                    </div>
                  </div>

                  <h3 class="cap-stop-card__name" role="button" tabindex="0" title="${st} durağını dinle">${st}</h3>

                  <!-- Live Spatial Proximity Telemetry Badge -->
                  <div class="cap-stop-proximity-badge" id="stop-proximity-badge-${idx}" data-stop-proximity="${idx}">
                    <svg class="cap-proximity-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                    <span class="cap-proximity-text">En yakın aktarma: ${stData.transit}</span>
                  </div>

                  <div class="cap-stop-card__media" role="button" tabindex="0" title="${st} durağını dinle">
                    <div class="cap-stop-media-blur-bg" style="background-image: url('${stopImg}');"></div>
                    <img src="${stopImg}" alt="${st}" class="cap-stop-media-fg" loading="lazy" />
                    <span class="cap-stop-photo-tag">✦ ${detail.angle}</span>
                    <span class="cap-stop-media-play-cue">♫ DİNLE</span>
                  </div>

                  <p class="cap-stop-card__desc">
                    ${detail.history}
                  </p>

                  <div class="cap-stop-notes-grid">
                    <div>
                      <strong>✦ FOTOĞRAF KADRAJI</strong>
                      <span>${detail.angle} ile sabah eğik açılı ışığı yakalayın.</span>
                    </div>
                    <div>
                      <strong>✦ GİZLİ SESSİZLİK</strong>
                      <span>${detail.secret}</span>
                    </div>
                  </div>

                  <div class="cap-stop-card__actions">
                    <button class="cap-stop-btn cap-stop-btn--gold" data-listen-stop="${idx}">
                      <span>BU DURAĞI DİNLE ♫</span>
                    </button>
                    <button class="cap-stop-btn cap-stop-btn--nav" data-navigate-stop="${idx}" title="${st} durağına navigasyon aç">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                      <span>YOL TARİFİ AL 🧭</span>
                    </button>
                    <button class="cap-stop-btn" data-focus-stop="${idx}">
                      <span>HARİTADA İŞARETLE ↗</span>
                    </button>
                    <button class="cap-stop-check-btn" data-toggle-visited="${idx}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                      <span class="visited-label">ZİYARET ETTİM</span>
                    </button>
                  </div>
                </article>
              `;
            }).join('')}
          </div>

          <!-- FAQ Accordion -->
          ${r.faqs && r.faqs.length ? `
            <div style="margin-top:2.5rem;">
              <div class="cap-stage-section-tag">SAHA REHBERİ</div>
              <h3 style="font-family:var(--font-display);font-size:1.6rem;font-weight:800;color:#f8fafc;margin:0 0 1.25rem;">Sıkça Sorulan Sorular</h3>
              <div style="display:flex;flex-direction:column;gap:12px;">
                ${r.faqs.map((f) => `
                  <div style="padding:1.4rem;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(195,166,119,0.16);">
                    <strong style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--cap-gold);display:block;margin-bottom:6px;">${f.q}</strong>
                    <p style="font-family:var(--font-body);font-size:0.95rem;color:#cbd5e1;line-height:1.6;margin:0;">${f.a}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Topluluk & Gezgin Canlı Saha Notları -->
          <div class="cap-community-notes-wrap">
            <div class="cap-stage-section-tag">TOPLULUK VE SAHA KEŞİFLERİ</div>
            <h3 style="font-family:var(--font-display);font-size:1.6rem;font-weight:800;color:#f8fafc;margin:0 0 0.5rem;">Gezgin Notları &amp; Canlı İpuçları</h3>
            <p style="font-family:var(--font-body);font-size:0.92rem;color:#94a3b8;margin-bottom:1.5rem;">
              Bu rotada yeni keşfettiğiniz bir detay, gizli kahveci veya fotoğraf kadrajı var mı? Diğer gezginlerle paylaşın.
            </p>

            <div class="cap-community-input-box">
              <textarea id="community-note-input" placeholder="Örn: İkinci duraktan sonra hanın sol üst katındaki çay ocağı açık, manzara harika..." maxlength="280"></textarea>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                <span style="font-family:var(--font-tech);font-size:0.72rem;color:#94a3b8;">Küratör Onaylı Saha Ağı</span>
                <button class="btn-cap btn-cap--gold-solid" id="btn-submit-community-note" style="height:32px;padding:0 1rem;font-size:0.75rem;">
                  <span class="btn-cap__inner">NOTU YAYINLA +</span>
                </button>
              </div>
            </div>

            <div class="cap-community-stream" id="community-notes-stream"></div>
          </div>
        </div>

        <!-- Right: Spatial Companion & Interactive Route Map Canvas (Minimalist Curatorial Layout) -->
        <aside class="cap-stage-right">
          <div class="cap-stage-companion-sticky">
            <!-- Canvas Map Card -->
            <div class="cap-stage-canvas-card">
              <div class="cap-stage-canvas-header">
                <span class="cap-stage-canvas-title">CANLI ROTA HARİTASI</span>
                <span class="cap-stage-canvas-beacon">
                  <span class="cap-briefing-dot"></span> SAHA NAVİGASYONU
                </span>
              </div>

              <div class="cap-stage-canvas-frame">
                <canvas id="route-stage-canvas" width="460" height="320"></canvas>
              </div>

              <div class="cap-stage-canvas-footer">
                <span id="route-canvas-active-label">DURAK 01: ${r.stops[0]}</span>
                <span>HARİTAYA TIKLA ↗</span>
              </div>
            </div>

            <!-- Curated Sensory Field Notes -->
            <div class="cap-stage-notes-card">
              <div class="cap-stage-section-tag">SEMTİN GİZLİ RİTİM NOTLARI</div>
              <div class="cap-note-row">
                <span class="cap-note-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--cap-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                </span>
                <div>
                  <strong style="color:#f8fafc;display:block;font-size:0.88rem;margin-bottom:2px;">Özel Közde Kahve & Avlu</strong>
                  <span style="color:#94a3b8;font-size:0.82rem;">İkinci durak sonrası han avlusundaki asırlık kahvecide mola verin.</span>
                </div>
              </div>
              <div class="cap-note-row">
                <span class="cap-note-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--cap-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                </span>
                <div>
                  <strong style="color:#f8fafc;display:block;font-size:0.88rem;margin-bottom:2px;">Işık & Boğaz Rüzgarı</strong>
                  <span style="color:#94a3b8;font-size:0.82rem;">${r.bestHour} saatlerinde binaların gölge kesişimleri altın tona ulaşır.</span>
                </div>
              </div>
              <div class="cap-note-row">
                <span class="cap-note-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--cap-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="20" x2="22" y2="20"></line><rect x="4" y="8" width="4" height="12"></rect><rect x="10" y="8" width="4" height="12"></rect><rect x="16" y="8" width="4" height="12"></rect><path d="M2 8l10-6 10 6"></path></svg>
                </span>
                <div>
                  <strong style="color:#f8fafc;display:block;font-size:0.88rem;margin-bottom:2px;">Mimari Katman</strong>
                  <span style="color:#94a3b8;font-size:0.82rem;">Taş kabartmalarda 19. yüzyıl Levanten armalarını arayın.</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <!-- 4. FLOATING LUXURY SOUNDSCAPE DOCK -->
      <div class="cap-route-dock" id="cap-route-dock">
        <div class="cap-dock-sound-info">
          <div class="cap-equalizer" id="stage-dock-equalizer">
            <span class="cap-equalizer__bar"></span>
            <span class="cap-equalizer__bar"></span>
            <span class="cap-equalizer__bar"></span>
            <span class="cap-equalizer__bar"></span>
          </div>
          <div class="cap-dock-text-group">
            <span class="cap-dock-title" id="stage-dock-title">SESLİ REHBER: ${r.title}</span>
            <span class="cap-dock-subtitle" id="stage-dock-subtitle">Durak 01 · Akustik Boğaz Ambiyansı</span>
          </div>
        </div>

        <div class="cap-dock-actions">
          <button class="cap-dock-play-btn" id="btn-dock-play-toggle">
            ▶ REHBERİ ÇAL
          </button>
          <button class="cap-dock-pwa-btn" id="btn-dock-to-pwa">
            3B SAHA HARİTASI →
          </button>
        </div>
      </div>
    `;

    // Activate second screen
    stage.classList.add('is-active');
    document.body.classList.add('route-stage-active');
    stage.scrollTop = 0;
    this.playChime(640, 0.1);

    // Reading progress tracking with hairline gold fill
    const updateProgress = () => {
      const maxScroll = stage.scrollHeight - stage.clientHeight;
      const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (stage.scrollTop / maxScroll) * 100)) : 0;
      const bar = document.getElementById('stage-reading-progress');
      if (bar) bar.style.width = `${pct}%`;
    };
    stage.onscroll = updateProgress;
    updateProgress();

    // Initialize interactive canvas map
    this.initRouteMapCanvas(r, 0);

    // Bind Gallery Thumbnails
    container.querySelectorAll('[data-stage-thumb]').forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-stage-thumb'), 10);
        const gallery = document.getElementById('stage-hero-ambient-flow');
        if (!gallery) return;
        const slides = gallery.querySelectorAll('.ambient-image-flow__slide');
        slides.forEach((sl, sIdx) => sl.classList.toggle('is-active', sIdx === idx));
        container.querySelectorAll('[data-stage-thumb]').forEach((b, bIdx) => b.classList.toggle('is-active', bIdx === idx));
      };
    });

    // Close Button
    document.getElementById('btn-close-route-stage')?.addEventListener('click', () => {
      this.closeRouteStage();
    });

    // Offline Travel Pass Button
    document.getElementById('btn-stage-offline-pass')?.addEventListener('click', () => {
      this.openOfflinePassModal(r);
    });

    // Share Button (Native Web Share with Fallback)
    document.getElementById('btn-stage-share')?.addEventListener('click', async (e) => {
      if (this.analytics) {
        this.analytics.track('route_share', {
          route_slug: r.slug,
          method: navigator.share ? 'native_share' : 'clipboard'
        });
      }
      const shareData = {
        title: `SEMT İstanbul — ${r.title}`,
        text: `${r.subtitle} | Küratörlü İstanbul Yürüyüş Rotası`,
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(window.location.href);
        const btn = e.currentTarget;
        const origText = btn.textContent;
        btn.textContent = 'BAĞLANTI KOPYALANDI ✓';
        btn.style.color = '#34d399';
        setTimeout(() => {
          btn.textContent = origText;
          btn.style.color = '';
        }, 2200);
      } catch (_) {}
    });

    // Top Audio Toggle
    document.getElementById('btn-stage-audio-toggle')?.addEventListener('click', () => {
      this.toggleStageAudio(r);
    });

    // Dock Audio Toggle
    document.getElementById('btn-dock-play-toggle')?.addEventListener('click', () => {
      this.toggleStageAudio(r);
    });

    // 3D Field Mode Launchers
    const launchPwa = () => {
      this.closeRouteStage();
      this.openFieldPwa(r.district);
    };
    document.getElementById('btn-stage-open-pwa')?.addEventListener('click', launchPwa);
    document.getElementById('btn-side-launch-pwa')?.addEventListener('click', launchPwa);
    document.getElementById('btn-dock-to-pwa')?.addEventListener('click', launchPwa);

    // Stop Card Interactive Targets
    container.querySelectorAll('[data-listen-stop]').forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-listen-stop'), 10);
        this.playStopAudio(idx, r.stops[idx], r);
      };
    });

    container.querySelectorAll('.cap-stop-card__media, .cap-stop-card__header, .cap-stop-card__name').forEach((el) => {
      el.addEventListener('click', () => {
        const card = el.closest('.cap-stop-card');
        if (!card) return;
        const idx = parseInt(card.getAttribute('data-stop-index'), 10);
        this.playStopAudio(idx, r.stops[idx], r);
      });
    });

    container.querySelectorAll('[data-focus-stop]').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-focus-stop'), 10);
        this.focusStopOnCanvasAndScroll(idx, r);
      };
    });

    // Multi-Waypoint Full Route Navigation Button
    document.getElementById('btn-launch-multi-nav')?.addEventListener('click', () => {
      this.triggerHaptic(15);
      this.playChime(640, 0.06);
      this.openMapPickerModal({
        title: r.title,
        subtitle: `${r.district} · ${r.stops.length} Durak Kesintisiz Yürüyüş Ağı`,
        stops: r.stopsData || [],
        isMulti: true,
        routeSlug: r.slug
      });
    });

    // Copy All GPS Coordinates
    document.getElementById('btn-copy-route-coords')?.addEventListener('click', async () => {
      this.triggerHaptic(20);
      this.playChime(700, 0.05);
      const stopsData = r.stopsData || [];
      const text = stopsData.map((s, i) => `${i + 1}. ${s.name}: ${s.lat}, ${s.lng} (Aktarma: ${s.transit})`).join('\n');
      try {
        await navigator.clipboard.writeText(text);
        const lbl = document.getElementById('label-copy-route-coords');
        if (lbl) {
          const orig = lbl.textContent;
          lbl.textContent = 'KOORDİNATLAR KOPYALANDI ✓';
          lbl.style.color = '#34d399';
          setTimeout(() => {
            lbl.textContent = orig;
            lbl.style.color = '';
          }, 2200);
        }
      } catch (_) {}
    });

    // Per-Stop 1-Tap Navigation Buttons
    container.querySelectorAll('[data-navigate-stop]').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-navigate-stop'), 10);
        const stData = (r.stopsData && r.stopsData[idx]) || { name: r.stops[idx], lat: 41.0242, lng: 28.9746, transit: 'Merkez', walkMin: 3 };
        this.triggerHaptic(15);
        this.playChime(640, 0.06);
        this.openMapPickerModal({
          title: stData.name,
          subtitle: `${r.district} · Durak 0${idx + 1} / ${r.stops.length} Yürüyüş Navigasyonu`,
          stops: [stData],
          isMulti: false,
          singleStopIndex: 0,
          transit: stData.transit,
          routeSlug: r.slug
        });
      };
    });

    // Initialize Live Proximity & Walk-Time Telemetry Engine
    this.initProximityEngine(r);

    // Bind Passport Checkbox toggles
    const updatePassportUI = () => {
      const visited = this.getVisitedStops(r.slug);
      const total = r.stops.length;
      const pct = Math.round((visited.length / total) * 100);

      const bar = document.getElementById('passport-progress-bar');
      if (bar) bar.style.width = `${pct}%`;

      const text = document.getElementById('passport-status-text');
      if (text) text.textContent = `${visited.length} / ${total} Durak Tamamlandı (%${pct})`;

      container.querySelectorAll('[data-toggle-visited]').forEach((btn) => {
        const idx = parseInt(btn.getAttribute('data-toggle-visited'), 10);
        const isDone = visited.includes(idx);
        btn.classList.toggle('is-checked', isDone);
        const lbl = btn.querySelector('.visited-label');
        if (lbl) lbl.textContent = isDone ? 'ZİYARET EDİLDİ ✓' : 'ZİYARET ETTİM';
      });

      const congrats = document.getElementById('passport-congrats-container');
      if (congrats) {
        if (visited.length === total && total > 0) {
          congrats.innerHTML = `
            <div class="cap-passport-congrats-modal">
              <div>
                <strong style="display:block;font-size:0.95rem;font-family:var(--font-display);">✦ TEBRİKLER! ${r.title} ROTASINI TAMAMLADINIZ</strong>
                <span style="font-size:0.82rem;opacity:0.9;">Saha Pasaportunuza İstanbul Keşif Rozeti eklendi.</span>
              </div>
              <button class="cap-menu-pill-btn" id="btn-share-achievement">ROZETİ PAYLAŞ ↗</button>
            </div>
          `;
          congrats.querySelector('#btn-share-achievement')?.addEventListener('click', () => {
            document.getElementById('btn-stage-share')?.click();
          });
        } else {
          congrats.innerHTML = '';
        }
      }
    };

    container.querySelectorAll('[data-toggle-visited]').forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-toggle-visited'), 10);
        this.toggleVisitedStop(r.slug, idx);
        updatePassportUI();
      };
    });
    updatePassportUI();

    // Community Field Notes stream
    const renderCommunityNotes = () => {
      const stream = document.getElementById('community-notes-stream');
      if (!stream) return;

      let customNotes = [];
      try {
        customNotes = JSON.parse(localStorage.getItem(`semt_notes_${r.slug}`) || '[]');
      } catch (_) {}

      const defaultCuratedNotes = [
        { author: 'Küratör Notu', text: `${r.bestHour} saatinde binaların vuran ışık açısı fotoğraf kadrajı için en sakin andır.` },
        { author: 'Gezgin · Arda T.', text: `İkinci durak sonrasında hanın avlusunda közde kahve içmeyi unutmayın, çok dingin bir atmosfer var.` }
      ];

      const allNotes = [...customNotes, ...defaultCuratedNotes];
      stream.innerHTML = allNotes.map((n) => `
        <div class="cap-community-note-item">
          <strong style="color:var(--cap-gold);display:block;font-size:0.75rem;margin-bottom:3px;font-family:var(--font-tech);">${n.author.toUpperCase()}</strong>
          <span>${n.text}</span>
        </div>
      `).join('');
    };

    renderCommunityNotes();

    const submitBtn = document.getElementById('btn-submit-community-note');
    const inputField = document.getElementById('community-note-input');
    if (submitBtn && inputField) {
      submitBtn.onclick = () => {
        const val = inputField.value.trim();
        if (!val) return;
        try {
          const existing = JSON.parse(localStorage.getItem(`semt_notes_${r.slug}`) || '[]');
          existing.unshift({ author: 'Gezgin (Siz)', text: val });
          localStorage.setItem(`semt_notes_${r.slug}`, JSON.stringify(existing));
          inputField.value = '';
          this.playChime(680, 0.08);
          renderCommunityNotes();
          if (this.analytics) {
            this.analytics.track('community_note_submit', { route_slug: r.slug });
          }
        } catch (_) {}
      };
    }
  }

  // Interactive Route Matcher Studio Engine
  bindRouteMatcher() {
    const section = document.getElementById('cap-route-matcher-section');
    if (!section) return;

    // Mood buttons
    section.querySelectorAll('[data-matcher-mood]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.matcherMood = btn.getAttribute('data-matcher-mood');
        section.querySelectorAll('[data-matcher-mood]').forEach((b) => b.classList.toggle('is-selected', b === btn));
        this.playChime(540, 0.06);
        this.triggerHaptic(12);
        this.renderMatcherResult();
      });
    });

    // Time buttons
    section.querySelectorAll('[data-matcher-time]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.matcherTime = btn.getAttribute('data-matcher-time');
        section.querySelectorAll('[data-matcher-time]').forEach((b) => b.classList.toggle('is-selected', b === btn));
        this.playChime(580, 0.06);
        this.triggerHaptic(12);
        this.renderMatcherResult();
      });
    });

    // Pace buttons
    section.querySelectorAll('[data-matcher-pace]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.matcherPace = btn.getAttribute('data-matcher-pace');
        section.querySelectorAll('[data-matcher-pace]').forEach((b) => b.classList.toggle('is-selected', b === btn));
        this.playChime(620, 0.06);
        this.triggerHaptic(12);
        this.renderMatcherResult();
      });
    });

    this.renderMatcherResult();
  }

  computeRouteMatch(mood, time, pace) {
    let matchedSlug = 'karakoy-kamondo-sessiz-hanlar';
    let matchPct = 98;

    if (mood === 'photo') {
      matchedSlug = 'balat-altin-saat-fotograf-rotasi';
      matchPct = 99;
    } else if (mood === 'bosphorus') {
      matchedSlug = 'moda-gun-batimi-vapur-turu';
      matchPct = 98;
    } else if (mood === 'history') {
      matchedSlug = 'sultanahmet-bizans-sarniclari-rotasi';
      matchPct = 97;
    } else if (mood === 'boho') {
      matchedSlug = 'kuzguncuk-bostan-cicekli-sokaklar';
      matchPct = 96;
    } else if (mood === 'coffee') {
      matchedSlug = pace === 'hills' ? 'karakoy-kamondo-sessiz-hanlar' : 'nisantasi-art-nouveau-apartmanlar';
      matchPct = 98;
    }

    const r = this.pseoRoutes.find((x) => x.slug === matchedSlug) || this.pseoRoutes[0];
    return { route: r, pct: matchPct };
  }

  renderMatcherResult() {
    const box = document.getElementById('cap-matcher-result-box');
    if (!box) return;

    const { route: r, pct } = this.computeRouteMatch(this.matcherMood, this.matcherTime, this.matcherPace);

    box.innerHTML = `
      <div class="cap-matcher-result-info">
        <div class="cap-matcher-result-thumb">
          <img src="${r.image}" alt="${r.title}" />
        </div>
        <div>
          <span class="cap-matcher-match-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            %${pct} KİŞİSEL EŞLEŞME · ${r.district.toUpperCase()}
          </span>
          <h3 class="cap-matcher-result-title">${r.title}</h3>
          <div class="cap-matcher-result-meta">
            <span>${r.bestHour}</span> · <span>${r.duration}</span> · <span>${r.budget}</span>
          </div>
        </div>
      </div>

      <div>
        <button class="btn-cap btn-cap--gold-solid" id="btn-matcher-open-route" style="height:40px;padding:0 1.25rem;font-size:0.78rem;">
          <span class="btn-cap__inner">ROTAYI KEŞFET &amp; BAŞLAT →</span>
        </button>
      </div>
    `;

    document.getElementById('btn-matcher-open-route')?.addEventListener('click', () => {
      this.openRouteBySlug(r.slug);
      if (this.analytics) {
        this.analytics.track('route_matcher_launch', {
          route_slug: r.slug,
          mood: this.matcherMood,
          time: this.matcherTime,
          pace: this.matcherPace
        });
      }
    });
  }

  // Traveler's Field Passport state
  getVisitedStops(slug) {
    try {
      const data = localStorage.getItem(`semt_visited_${slug}`);
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  toggleVisitedStop(slug, stopIdx) {
    try {
      let visited = this.getVisitedStops(slug);
      if (visited.includes(stopIdx)) {
        visited = visited.filter((x) => x !== stopIdx);
        this.triggerHaptic(10);
      } else {
        visited.push(stopIdx);
        this.playChime(760, 0.09);
        this.triggerHaptic([20, 35, 20]);
      }
      localStorage.setItem(`semt_visited_${slug}`, JSON.stringify(visited));
      this.updateMobilePassportBadge();
      if (this.analytics) {
        this.analytics.track('stop_visited_toggle', {
          route_slug: slug,
          stop_index: stopIdx,
          is_visited: visited.includes(stopIdx)
        });
      }
      return visited;
    } catch (_) {
      return [];
    }
  }

  // Haversine formula distance calculation in meters
  calculateDistanceMeters(lat1, lon1, lat2, lon2) {
    if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number') return 0;
    const R = 6371e3; // Earth radius in meters
    const rad = Math.PI / 180;
    const φ1 = lat1 * rad;
    const φ2 = lat2 * rad;
    const Δφ = (lat2 - lat1) * rad;
    const Δλ = (lon2 - lon1) * rad;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // Detect traveler device platform for contextual OS navigation guidance
  getDetectedPlatform() {
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isMac = /Macintosh|Mac OS X/.test(ua) && !isIOS;
    const isAndroid = /Android/.test(ua);
    return {
      isIOS,
      isMac,
      isApple: isIOS || isMac,
      isAndroid,
      name: isIOS ? 'iOS (iPhone)' : (isAndroid ? 'Android' : (isMac ? 'macOS' : 'Masaüstü / Web'))
    };
  }

  // Studio-grade Spatial Proximity Engine with live HTML5 Geolocation telemetry
  initProximityEngine(r) {
    if (this.proximityWatchId !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      try {
        navigator.geolocation.clearWatch(this.proximityWatchId);
      } catch (_) {}
      this.proximityWatchId = null;
    }

    const stops = r.stopsData || [];
    if (!stops.length) return;

    // Initial fallback state (shows closest transit hub)
    stops.forEach((st, idx) => {
      const badge = document.getElementById(`stop-proximity-badge-${idx}`);
      if (badge) {
        badge.innerHTML = `
          <svg class="cap-proximity-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          <span class="cap-proximity-text">En yakın aktarma: ${st.transit}</span>
        `;
      }
    });

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      return;
    }

    const onPos = (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      this.lastUserPosition = { lat: userLat, lng: userLng };
      this.updateProximityUI(userLat, userLng, r);
    };

    const onErr = () => {
      // Gracefully retain transit proximity without intrusive error popups
      stops.forEach((st, idx) => {
        const badge = document.getElementById(`stop-proximity-badge-${idx}`);
        if (badge && !badge.classList.contains('is-arrived')) {
          badge.innerHTML = `
            <svg class="cap-proximity-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="cap-proximity-text">Yakın Bağlantı: ${st.transit} · ~${st.walkMin || 3} dk yürüme</span>
          `;
        }
      });
    };

    try {
      // Request initial position
      navigator.geolocation.getCurrentPosition(onPos, onErr, {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 15000
      });
      // Watch for movement as traveler walks along the route
      this.proximityWatchId = navigator.geolocation.watchPosition(onPos, onErr, {
        enableHighAccuracy: true,
        maximumAge: 5000
      });
    } catch (_) {}
  }

  updateProximityUI(userLat, userLng, r) {
    const stops = r.stopsData || [];
    let closestIndex = -1;
    let minDistance = Infinity;

    stops.forEach((st, idx) => {
      const dist = this.calculateDistanceMeters(userLat, userLng, st.lat, st.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }

      const badge = document.getElementById(`stop-proximity-badge-${idx}`);
      const card = document.getElementById(`stop-card-${idx}`);
      if (!badge) return;

      if (dist <= 55) {
        // Stop reached threshold (< 55 meters)
        badge.classList.add('is-arrived');
        badge.innerHTML = `
          <span class="cap-beacon-pulse"></span>
          <span class="cap-proximity-text" style="color:var(--cap-gold-bright);font-weight:700;">✦ DURAĞA ULAŞTINIZ · DİNLENMEYE VE KEŞFE BAŞLAYIN</span>
        `;
        if (card) {
          card.classList.add('is-near-stop');
        }
        if (!this.arrivedNotifiedStops) this.arrivedNotifiedStops = {};
        const notifyKey = `${r.slug}_${idx}`;
        if (!this.arrivedNotifiedStops[notifyKey]) {
          this.arrivedNotifiedStops[notifyKey] = true;
          this.triggerHaptic([40, 60, 40]);
          this.playChime(880, 0.12);
        }
      } else {
        badge.classList.remove('is-arrived');
        if (card) card.classList.remove('is-near-stop');
        const distStr = dist >= 1000 ? `${(dist / 1000).toFixed(1)} km` : `${dist} m`;
        const walkMin = Math.max(1, Math.round(dist / 80));
        badge.innerHTML = `
          <svg class="cap-proximity-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="cap-proximity-text">Konumunuza ~${distStr} · ~${walkMin} dk yürüme (${st.transit})</span>
        `;
      }
    });

    // Update canvas map highlight if closest stop changed
    if (closestIndex !== -1 && this.currentPlayingStop !== closestIndex) {
      const label = document.getElementById('route-canvas-active-label');
      if (label && stops[closestIndex]) {
        label.textContent = `EN YAKIN DURAK 0${closestIndex + 1}: ${stops[closestIndex].name}`;
      }
    }
  }

  // Studio-grade Smart Map Picker Sheet Modal (Apple Maps / Google Maps / Yandex / GPS)
  openMapPickerModal({ title, subtitle, stops = [], isMulti = false, singleStopIndex = 0, transit = '', routeSlug = '' }) {
    let modal = document.getElementById('cap-map-picker-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cap-map-picker-modal';
      modal.className = 'cap-nav-modal';
      document.body.appendChild(modal);
    }

    const platform = this.getDetectedPlatform();
    const primaryStop = stops[singleStopIndex] || stops[0] || { name: title, lat: 41.0242, lng: 28.9746 };

    // Google Maps Walking URL
    let googleMapsUrl = '';
    if (isMulti && stops.length > 1) {
      const origin = `${stops[0].lat},${stops[0].lng}`;
      const dest = `${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}`;
      const waypoints = stops.slice(1, -1).map((s) => `${s.lat},${s.lng}`).join('|');
      googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}&travelmode=walking`;
    } else {
      googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${primaryStop.lat},${primaryStop.lng}&travelmode=walking`;
    }

    // Apple Maps Walking URL
    let appleMapsUrl = '';
    if (isMulti && stops.length > 1) {
      appleMapsUrl = `https://maps.apple.com/?saddr=${stops[0].lat},${stops[0].lng}&daddr=${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}&dirflg=w`;
    } else {
      appleMapsUrl = `https://maps.apple.com/?daddr=${primaryStop.lat},${primaryStop.lng}&dirflg=w`;
    }

    // Yandex Maps Walking URL
    let yandexMapsUrl = '';
    if (isMulti && stops.length > 1) {
      const pts = stops.map((s) => `${s.lat}%2C${s.lng}`).join('~');
      yandexMapsUrl = `https://yandex.com.tr/maps/?rtext=${pts}&rtt=pd`;
    } else {
      yandexMapsUrl = `https://yandex.com.tr/maps/?rtext=~${primaryStop.lat}%2C${primaryStop.lng}&rtt=pd`;
    }

    const rawCoordsText = isMulti 
      ? stops.map((s, i) => `${i + 1}. ${s.name}: ${s.lat}, ${s.lng}`).join('\n')
      : `${primaryStop.name}: ${primaryStop.lat}, ${primaryStop.lng}`;

    modal.innerHTML = `
      <div class="cap-nav-dialog" role="dialog" aria-modal="true" aria-label="Harita & Navigasyon Seçimi">
        <div class="cap-nav-dialog__header">
          <div>
            <div class="cap-nav-dialog__tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              <span>${isMulti ? 'ÇOKLU DURAK YÜRÜYÜŞ GÜZERGAHI' : 'NOKTASAL YOL TARİFİ'}</span>
            </div>
            <h3 class="cap-nav-dialog__title">${title}</h3>
            <p class="cap-nav-dialog__subtitle">${subtitle}</p>
          </div>
          <button class="cap-nav-dialog__close" id="btn-close-map-picker" aria-label="Kapat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        ${transit ? `
          <div class="cap-nav-transit-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cap-gold)" stroke-width="2.2"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>
            <span><strong>Toplu Taşıma Entegrasyonu:</strong> ${transit}</span>
          </div>
        ` : ''}

        <div class="cap-nav-options-list">
          <!-- Google Maps Option -->
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="cap-nav-option-btn ${!platform.isApple ? 'is-preferred' : ''}" data-nav-app="google">
            <div class="cap-nav-option-icon cap-nav-option-icon--google">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="cap-nav-option-body">
              <div class="cap-nav-option-row">
                <span class="cap-nav-option-name">Google Haritalar</span>
                ${!platform.isApple ? '<span class="cap-nav-choice-badge">✦ ÖNERİLEN</span>' : ''}
              </div>
              <span class="cap-nav-option-desc">Tüm cihazlar için adım adım yaya yürüyüş rehberi &amp; sokak görünümü</span>
            </div>
            <svg class="cap-nav-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </a>

          <!-- Apple Maps Option -->
          <a href="${appleMapsUrl}" target="_blank" rel="noopener noreferrer" class="cap-nav-option-btn ${platform.isApple ? 'is-preferred' : ''}" data-nav-app="apple">
            <div class="cap-nav-option-icon cap-nav-option-icon--apple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            </div>
            <div class="cap-nav-option-body">
              <div class="cap-nav-option-row">
                <span class="cap-nav-option-name">Apple Haritalar</span>
                ${platform.isApple ? '<span class="cap-nav-choice-badge">✦ iOS ÖNERİLEN</span>' : ''}
              </div>
              <span class="cap-nav-option-desc">iPhone, Apple Watch ve macOS yerel entegrasyonuyla sessiz rehberlik</span>
            </div>
            <svg class="cap-nav-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </a>

          <!-- Yandex Maps Option -->
          <a href="${yandexMapsUrl}" target="_blank" rel="noopener noreferrer" class="cap-nav-option-btn" data-nav-app="yandex">
            <div class="cap-nav-option-icon cap-nav-option-icon--yandex">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            </div>
            <div class="cap-nav-option-body">
              <div class="cap-nav-option-row">
                <span class="cap-nav-option-name">Yandex Haritalar</span>
              </div>
              <span class="cap-nav-option-desc">İstanbul toplu taşıma, füniküler ve dar sokak yaya ağı uyumlu</span>
            </div>
            <svg class="cap-nav-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        </div>

        <!-- Copy GPS Coordinates Bar -->
        <div class="cap-nav-coords-card">
          <div class="cap-nav-coords-text">
            <strong>GPS HASSAS KOORDİNAT:</strong>
            <code>${primaryStop.lat.toFixed(5)}, ${primaryStop.lng.toFixed(5)}</code>
          </div>
          <button class="cap-stop-btn" id="btn-modal-copy-coords">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span id="label-modal-copy-coords">KOPYALA</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.add('is-active');
    document.body.classList.add('cap-nav-modal-active');
    this.playChime(620, 0.08);

    const closeModal = () => {
      modal.classList.remove('is-active');
      document.body.classList.remove('cap-nav-modal-active');
      this.playChime(420, 0.06);
    };

    document.getElementById('btn-close-map-picker')?.addEventListener('click', closeModal);
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    // Close on Escape
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        window.removeEventListener('keydown', onKey);
      }
    };
    window.addEventListener('keydown', onKey);

    // Track launch clicks and give feedback
    modal.querySelectorAll('[data-nav-app]').forEach((a) => {
      a.addEventListener('click', () => {
        const app = a.getAttribute('data-nav-app');
        this.triggerHaptic(20);
        this.playChime(740, 0.08);
        if (this.analytics) {
          this.analytics.track('navigation_launch', {
            app,
            route_slug: routeSlug,
            stop_name: primaryStop.name,
            is_multi: isMulti
          });
        }
        setTimeout(closeModal, 450);
      });
    });

    // Copy coords button
    document.getElementById('btn-modal-copy-coords')?.addEventListener('click', async () => {
      this.triggerHaptic(15);
      this.playChime(680, 0.06);
      try {
        await navigator.clipboard.writeText(rawCoordsText);
        const lbl = document.getElementById('label-modal-copy-coords');
        if (lbl) {
          lbl.textContent = 'KOPYALANDI ✓';
          setTimeout(() => { lbl.textContent = 'KOPYALA'; }, 2200);
        }
      } catch (_) {}
    });
  }

  // Close the Second Screen and return cleanly to portal
  closeRouteStage() {
    if (this.proximityWatchId !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      try {
        navigator.geolocation.clearWatch(this.proximityWatchId);
      } catch (_) {}
      this.proximityWatchId = null;
    }
    const navModal = document.getElementById('cap-map-picker-modal');
    if (navModal) {
      navModal.classList.remove('is-active');
      document.body.classList.remove('cap-nav-modal-active');
    }
    const stage = document.getElementById('cap-route-stage');
    if (stage) stage.classList.remove('is-active');
    document.body.classList.remove('route-stage-active');
    this.activeOpenedRoute = null;
    this.isStageAudioPlaying = false;
    const eq = document.getElementById('stage-dock-equalizer');
    if (eq) eq.classList.remove('is-playing');
    try {
      history.pushState(null, '', window.location.pathname);
    } catch (_) {}
    this.playChime(460, 0.08);
  }

  // Curatorial Offline Travel Pass & Print Mode Modal
  openOfflinePassModal(r) {
    let modal = document.getElementById('cap-offline-pass-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cap-offline-pass-modal';
      modal.className = 'cap-offline-modal';
      document.body.appendChild(modal);
    }

    const durationNum = parseFloat(r.duration) || 2.5;
    const steps = Math.round(durationNum * 2100).toLocaleString('tr-TR');
    const km = (durationNum * 1.8).toFixed(1);

    modal.innerHTML = `
      <div class="cap-offline-dialog" role="dialog" aria-modal="true" aria-label="Çevrimdışı Seyahat Kartı">
        <div class="cap-offline-pass-print-area">
          <div class="cap-offline-pass-header">
            <div>
              <div class="cap-offline-pass-brand">SEMT · İSTANBUL</div>
              <div style="font-family:var(--font-tech);font-size:0.72rem;color:#c3a677;letter-spacing:0.1em;margin-top:2px;">
                ÇEVRİMDİŞİ SAHA REHBERİ &amp; SEYAHAT KARTI
              </div>
            </div>
            <span class="cap-offline-pass-badge">${r.district.toUpperCase()}</span>
          </div>

          <h2 class="cap-offline-pass-title">${r.title}</h2>
          <p class="cap-offline-pass-subtitle">${r.subtitle}</p>

          <div class="cap-offline-quick-meta">
            <div>
              <strong style="color:var(--cap-gold);display:block;margin-bottom:2px;">ÖNERİLEN SAAT:</strong>
              <span>${r.bestHour}</span>
            </div>
            <div>
              <strong style="color:var(--cap-gold);display:block;margin-bottom:2px;">PARKUR &amp; MESAFE:</strong>
              <span>~${km} km (${steps} Adım)</span>
            </div>
            <div>
              <strong style="color:var(--cap-gold);display:block;margin-bottom:2px;">TAHMİNİ BÜTÇE:</strong>
              <span>${r.budget}</span>
            </div>
            <div>
              <strong style="color:var(--cap-gold);display:block;margin-bottom:2px;">KALABALIK ORANI:</strong>
              <span>${r.crowd}</span>
            </div>
          </div>

          <div style="font-family:var(--font-tech);font-size:0.74rem;color:var(--cap-gold);letter-spacing:0.12em;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <span>DURAK KONTROL LİSTESİ (CHECKLIST)</span>
          </div>

          <div class="cap-offline-stops-list">
            ${r.stops.map((st, idx) => `
              <div class="cap-offline-stop-row">
                <div class="cap-offline-stop-checkbox">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div class="cap-offline-stop-details">
                  <div class="cap-offline-stop-name">0${idx + 1} · ${st}</div>
                  <div class="cap-offline-stop-sub">
                    ~${(idx + 1) * 7} dk yürüyüş aksı · 35mm mimari kadraj · Çevrimdışı GPS: ${r.district}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="cap-offline-survival-notes">
            <strong style="color:var(--cap-gold);display:block;margin-bottom:4px;font-family:var(--font-display);display:flex;align-items:center;gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>SAHADA İNTERNETSİZ KULLANIM İPUÇLARI</span>
            </strong>
            Bu kartı telefonunuza kaydedebilir veya yazdırarak yanınıza alabilirsiniz. Şehir Hatları vapurlarında tüm temassız kartlar geçerlidir. Han avlularında ve sarnıçlarda hücresel veri çekmediğinde bu durak sıralamasını takip edebilirsiniz.
          </div>

          <div style="font-family:var(--font-tech);font-size:0.68rem;color:#94a3b8;border-top:1px solid rgba(255,255,255,0.08);padding-top:12px;display:flex;justify-content:space-between;align-items:center;">
            <span>https://semt-istanbul.com/?route=${r.slug}</span>
            <span>SEMT SPATIAL STUDIO © 2026</span>
          </div>
        </div>

        <div class="cap-offline-modal-actions">
          <button class="cap-menu-pill-btn" id="btn-offline-copy-summary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-1px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>METNİ KOPYALA
          </button>
          <button class="btn-cap btn-cap--gold-solid" id="btn-offline-print" style="height:36px;padding:0 1.25rem;font-size:0.78rem;">
            <span class="btn-cap__inner">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-1px;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>YAZDIR / PDF KAYDET
            </span>
          </button>
          <button class="cap-menu-pill-btn" id="btn-offline-close">KAPAT (ESC)</button>
        </div>
      </div>
    `;

    modal.classList.add('is-open');
    this.playChime(560, 0.08);

    if (this.analytics) {
      this.analytics.track('offline_pass_open', { route_slug: r.slug, district: r.district });
    }

    const closeModal = () => {
      modal.classList.remove('is-open');
      document.removeEventListener('keydown', onKeyDown);
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKeyDown);

    modal.querySelector('#btn-offline-close').onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    modal.querySelector('#btn-offline-print').onclick = () => {
      if (this.analytics) {
        this.analytics.track('offline_pass_print', { route_slug: r.slug, district: r.district });
      }
      window.print();
    };

    modal.querySelector('#btn-offline-copy-summary').onclick = (e) => {
      if (this.analytics) {
        this.analytics.track('offline_pass_copy', { route_slug: r.slug, district: r.district });
      }
      const summaryText = `SEMT İSTANBUL — ${r.title}\nSemt: ${r.district}\nİdeal Saat: ${r.bestHour}\nBütçe: ${r.budget}\nMesafe: ~${km} km (~${steps} Adım)\n\nDuraklar:\n${r.stops.map((st, i) => `${i + 1}. ${st}`).join('\n')}\n\nDetaylar: https://semt-istanbul.com/?route=${r.slug}`;
      navigator.clipboard.writeText(summaryText);
      const btn = e.currentTarget;
      const oldHtml = btn.innerHTML;
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:5px;vertical-align:-1px;"><polyline points="20 6 9 17 4 12"/></svg><span style="color:#34d399;">KOPYALANDI</span>`;
      setTimeout(() => {
        btn.innerHTML = oldHtml;
      }, 2000);
    };
  }

  // Focus a stop in the timeline and update canvas waypoint
  focusStopOnCanvasAndScroll(idx, route) {
    this.currentPlayingStop = idx;
    document.querySelectorAll('.cap-stop-card').forEach((card, cIdx) => {
      card.classList.toggle('is-active-stop', cIdx === idx);
    });
    const targetCard = document.getElementById(`stop-card-${idx}`);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    this.initRouteMapCanvas(route, idx);
    const label = document.getElementById('route-canvas-active-label');
    if (label && route.stops[idx]) {
      label.textContent = `DURAK 0${idx + 1}: ${route.stops[idx]}`;
    }
    this.playChime(580 + idx * 40, 0.08);
  }

  // Play stop-specific atmospheric audio chord & update dock
  playStopAudio(idx, stopName, route) {
    try {
      this.ensureAudio();
      if (!this.audioCtx) return;

      this.currentPlayingStop = idx;
      this.isStageAudioPlaying = true;

      const eq = document.getElementById('stage-dock-equalizer');
      const title = document.getElementById('stage-dock-title');
      const subtitle = document.getElementById('stage-dock-subtitle');
      const playBtn = document.getElementById('btn-dock-play-toggle');

      if (eq) eq.classList.add('is-playing');
      if (title) title.textContent = `ÇALIYOR: Durak 0${idx + 1} — ${stopName}`;
      if (subtitle) subtitle.textContent = `Mimari Akustik Ses & Atmosfer · ${route.district}`;
      if (playBtn) playBtn.textContent = '⏸ DURDUR';

      if (this.analytics) {
        this.analytics.track('audio_stop_play', {
          route_slug: route.slug,
          stop_index: idx + 1,
          stop_name: stopName,
          district: route.district
        });
      }

      const stopChords = [
        [220.00, 277.18, 329.63, 440.00], // A Major
        [196.00, 246.94, 293.66, 392.00], // G Major
        [261.63, 329.63, 392.00, 523.25], // C Major
        [174.61, 220.00, 261.63, 349.23], // F Major
      ];
      const chord = stopChords[idx % stopChords.length];

      chord.forEach((freq, fIdx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = fIdx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + fIdx * 0.12);
        gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime + fIdx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0008, this.audioCtx.currentTime + 2.5);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(this.audioCtx.currentTime + fIdx * 0.12);
        osc.stop(this.audioCtx.currentTime + 2.6);
      });

      this.focusStopOnCanvasAndScroll(idx, route);
    } catch (_) {}
  }

  // Toggle stage audio play / pause
  toggleStageAudio(route) {
    if (this.isStageAudioPlaying) {
      this.isStageAudioPlaying = false;
      const eq = document.getElementById('stage-dock-equalizer');
      const playBtn = document.getElementById('btn-dock-play-toggle');
      if (eq) eq.classList.remove('is-playing');
      if (playBtn) playBtn.textContent = '▶ REHBERİ ÇAL';
      this.playChime(420, 0.08);
    } else {
      const idx = this.currentPlayingStop || 0;
      this.playStopAudio(idx, route.stops[idx], route);
    }
  }

  // Render Interactive 2D Route Canvas Map with waypoints and animated pulse
  initRouteMapCanvas(route, activeStopIdx = 0) {
    const canvas = document.getElementById('route-stage-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Blueprint dark gradient background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.4);
    bgGrad.addColorStop(0, '#0c1222');
    bgGrad.addColorStop(1, '#05070e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Architectural grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 30; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 30; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 3. Water coastline (Bosphorus curve)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.78);
    ctx.bezierCurveTo(w * 0.35, h * 0.65, w * 0.65, h * 0.95, w, h * 0.82);
    ctx.stroke();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // 4. Calculate Waypoint positions
    const stopsCount = route.stops.length;
    const points = [];
    const stepX = (w - 140) / Math.max(stopsCount - 1, 1);
    for (let i = 0; i < stopsCount; i++) {
      const px = 70 + i * stepX;
      const py = 70 + ((i % 2 === 0 ? 30 : 130) + (i * 20)) % (h - 140);
      points.push({ x: px, y: py, name: route.stops[i], idx: i });
    }

    // 5. Draw connecting walking trail (dashed gold line)
    if (points.length > 1) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
      ctx.lineWidth = 2.4;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const cpX = (points[i - 1].x + points[i].x) / 2;
        const cpY = points[i - 1].y + (i % 2 === 0 ? -30 : 30);
        ctx.quadraticCurveTo(cpX, cpY, points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 6. Draw Waypoint nodes
    points.forEach((pt, pIdx) => {
      const isActive = pIdx === activeStopIdx;

      if (isActive) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 16, 0, Math.PI * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#c3a677' : '#0f172a';
      ctx.fill();
      ctx.strokeStyle = isActive ? '#fef08a' : '#c3a677';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = isActive ? '#05070e' : '#f8fafc';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(pIdx + 1), pt.x, pt.y);

      ctx.fillStyle = isActive ? '#fef08a' : '#94a3b8';
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      const labelY = pt.y > h / 2 ? pt.y - 18 : pt.y + 22;
      const shortName = pt.name.length > 18 ? pt.name.slice(0, 16) + '..' : pt.name;
      ctx.fillText(shortName, pt.x, labelY);
    });

    // 7. North Compass in top right
    ctx.save();
    ctx.translate(w - 36, 36);
    ctx.strokeStyle = 'rgba(195, 166, 119, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(4, 3);
    ctx.lineTo(-4, 3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(4, 3);
    ctx.lineTo(-4, 3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 8px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('K', 0, -14);
    ctx.restore();

    // 8. Bind click on canvas waypoints
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      points.forEach((pt) => {
        const dist = Math.hypot(clickX - pt.x, clickY - pt.y);
        if (dist <= 26) {
          this.focusStopOnCanvasAndScroll(pt.idx, route);
        }
      });
    };
  }

  // Inject Schema.org JSON-LD structured data for Google Search rich results
  injectJsonLd(route) {
    const existing = document.getElementById('semt-pseo-jsonld');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'semt-pseo-jsonld';
    script.type = 'application/ld+json';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TouristTrip',
          name: route.title,
          description: route.subtitle,
          touristType: route.categoryLabel,
          estimatedDuration: route.duration,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'EUR'
          },
          itinerary: {
            '@type': 'ItemList',
            numberOfItems: route.stops.length,
            itemListElement: route.stops.map((s, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: s
            }))
          }
        },
        ...(route.faqs && route.faqs.length
          ? [
              {
                '@type': 'FAQPage',
                mainEntity: route.faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: f.a
                  }
                }))
              }
            ]
          : [])
      ]
    };

    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }

  // Deep URL Router Check: e.g. ?route=balat-altin-saat-fotograf-rotasi
  checkUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const routeSlug = params.get('route');
      if (routeSlug) {
        this.openRouteBySlug(routeSlug);
      }
    } catch (_) {}
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, scrollTop / docHeight));
      const fill = document.getElementById('cap-progress-fill');
      if (fill) fill.style.transform = `scaleX(${ratio})`;

      // Mobile Bottom HUD Active State Updater
      const scrollPos = scrollTop + window.innerHeight * 0.4;
      const matcherEl = document.getElementById('route-matcher-section');
      const pseoEl = document.getElementById('pseo-library-section');
      const atlasEl = document.getElementById('bosphorus-atlas-section');
      
      let currentMobAction = 'hero';
      if (atlasEl && scrollPos >= atlasEl.offsetTop) {
        currentMobAction = 'atlas';
      } else if (pseoEl && scrollPos >= pseoEl.offsetTop) {
        currentMobAction = 'routes';
      } else if (matcherEl && scrollPos >= matcherEl.offsetTop) {
        currentMobAction = 'matcher';
      }

      document.querySelectorAll('[data-mob-action]').forEach((b) => {
        b.classList.toggle('is-active', b.getAttribute('data-mob-action') === currentMobAction);
      });
    }, { passive: true });

    // Mobile Bottom Smart HUD Bar Actions
    document.querySelectorAll('[data-mob-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-mob-action');
        this.triggerHaptic(12);
        this.playChime(520, 0.06);

        document.querySelectorAll('[data-mob-action]').forEach((b) => b.classList.toggle('is-active', b === btn));

        if (action === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (action === 'routes') {
          const el = document.getElementById('pseo-library-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'matcher') {
          const el = document.getElementById('route-matcher-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            el.classList.add('pulse-highlight');
            setTimeout(() => el.classList.remove('pulse-highlight'), 1200);
          }
        } else if (action === 'atlas') {
          const el = document.getElementById('bosphorus-atlas-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'passport') {
          const hud = document.getElementById('stage-passport-hud');
          const stage = document.getElementById('cap-route-stage');
          if (hud && stage && stage.classList.contains('is-active')) {
            hud.scrollIntoView({ behavior: 'smooth' });
          } else {
            this.openRouteBySlug(this.pseoRoutes[0].slug);
          }
        }
      });
    });

    // Menu Curtain Toggle
    const menuBtn = document.getElementById('btn-cartouche-menu');
    const curtain = document.getElementById('cap-menu-curtain');
    const overlay = document.getElementById('cap-menu-overlay');
    const toggleMenu = (force) => {
      this.menuOpen = typeof force === 'boolean' ? force : !this.menuOpen;
      curtain?.classList.toggle('open', this.menuOpen);
      overlay?.classList.toggle('open', this.menuOpen);
      const lbl = document.getElementById('cartouche-menu-label');
      if (lbl) lbl.textContent = this.menuOpen ? 'KAPAT' : 'BÖLÜMLER';
      this.playChime(this.menuOpen ? 520 : 380, 0.08);
    };
    menuBtn?.addEventListener('click', () => toggleMenu());
    overlay?.addEventListener('click', () => toggleMenu(false));

    // Global click delegate (All visual cards, modules, and buttons)
    document.addEventListener('click', (e) => {
      const scrollBtn = e.target.closest('[data-scroll-to]');
      if (scrollBtn) {
        const sel = scrollBtn.getAttribute('data-scroll-to');
        toggleMenu(false);
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const pwaBtn = e.target.closest('[data-open-pwa]');
      if (pwaBtn) {
        toggleMenu(false);
        this.openFieldPwa(pwaBtn.getAttribute('data-open-pwa'));
        return;
      }

      const atlasBtn = e.target.closest('[data-select-atlas]');
      if (atlasBtn) {
        this.selectAtlasDistrict(atlasBtn.getAttribute('data-select-atlas'));
        return;
      }

      const routeBtn = e.target.closest('[data-open-route]');
      if (routeBtn) {
        toggleMenu(false);
        this.openRouteBySlug(routeBtn.getAttribute('data-open-route'));
        return;
      }
    });

    // Keyboard Accessibility for interactive route modules
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target && target.matches && target.matches('[data-open-route][role="button"]')) {
          e.preventDefault();
          this.openRouteBySlug(target.getAttribute('data-open-route'));
        }
      }
    });

    // Hero Live Search Input
    const searchInp = document.getElementById('hero-search-input');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderPseoGrid();
        const pSec = document.getElementById('pseo-library-section');
        if (pSec && this.searchQuery.length > 2) {
          pSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Hero Search Filter Pills
    document.querySelectorAll('[data-hero-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-hero-filter]').forEach((b) => b.classList.toggle('active', b === btn));
        this.pseoActiveFilter = btn.getAttribute('data-hero-filter');
        this.renderPseoGrid();

        // Also update the stationary hero route card to the first matching route
        if (this.pseoActiveFilter !== 'all') {
          const matchIdx = this.pseoRoutes.findIndex((r) => r.category === this.pseoActiveFilter);
          if (matchIdx !== -1) {
            this.setHeroSliderIndex(matchIdx);
          }
        }

        const pSec = document.getElementById('pseo-library-section');
        if (pSec) pSec.scrollIntoView({ behavior: 'smooth' });
        this.playChime(540, 0.07);
      });
    });

    // Hero Slider Controls
    document.getElementById('btn-slider-next')?.addEventListener('click', () => this.nextHeroSlider());
    document.getElementById('btn-slider-prev')?.addEventListener('click', () => this.prevHeroSlider());

    const sliderCard = document.getElementById('hero-slider-card');
    if (sliderCard) {
      sliderCard.addEventListener('mouseenter', () => {
        this.heroSliderPaused = true;
      });
      sliderCard.addEventListener('mouseleave', () => {
        this.heroSliderPaused = false;
      });
    }

    // pSEO Category Filter Tabs
    document.querySelectorAll('[data-pseo-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-pseo-cat]').forEach((b) => b.classList.toggle('active', b === btn));
        this.pseoActiveFilter = btn.getAttribute('data-pseo-cat');
        this.renderPseoGrid();
        this.playChime(520, 0.06);
        this.triggerHaptic(12);
      });
    });

    // Atmosphere modes inside menu
    document.querySelectorAll('[data-set-atmo]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.atmo = btn.getAttribute('data-set-atmo');
        document.body.setAttribute('data-atmo', this.atmo);
        document.querySelectorAll('[data-set-atmo]').forEach((b) => b.classList.toggle('active', b === btn));
        const heroImg = document.getElementById('hero-dynamic-img');
        if (this.atmo === 'golden' && heroImg) heroImg.src = '/assets/balat_golden_arch.jpg';
        if (this.atmo === 'twilight' && heroImg) heroImg.src = '/assets/galata_twilight.jpg';
        if (this.atmo === 'obsidian' && heroImg) heroImg.src = '/assets/sultanahmet_cistern_marble.jpg';
        toggleMenu(false);
        this.playChime(587, 0.1);
        this.triggerHaptic(15);
      });
    });

    // Theme Toggles (Header Cartouche & Menu Curtain)
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });
    document.getElementById('btn-menu-toggle-theme')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Sound toggle
    document.getElementById('btn-toggle-sound')?.addEventListener('click', (e) => {
      this.soundEnabled = !this.soundEnabled;
      e.currentTarget.textContent = this.soundEnabled ? 'BOĞAZ SESİ: AKTİF' : 'BOĞAZ SESİ: KAPALI';
      this.triggerHaptic(15);
      if (this.soundEnabled) this.playFerryChord();
    });

    // Language toggle
    document.getElementById('btn-toggle-lang')?.addEventListener('click', () => {
      this.lang = this.lang === 'tr' ? 'en' : 'tr';
      this.applyLanguage();
      toggleMenu(false);
    });

    // Programme Tabs
    document.querySelectorAll('[data-prog-vibe]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.progVibe = btn.getAttribute('data-prog-vibe');
        document.querySelectorAll('[data-prog-vibe]').forEach((b) => b.classList.toggle('active', b === btn));
        this.renderProgramme();
        this.playChime(520, 0.07);
      });
    });

    // Download 9:16 Story PNG
    document.getElementById('btn-download-story-png')?.addEventListener('click', () => {
      const canvas = document.getElementById('story-poster-canvas');
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `SEMT-Istanbul-${this.progVibe}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      this.playChime(784, 0.14);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const stage = document.getElementById('cap-route-stage');
        if (stage && stage.classList.contains('is-active')) {
          this.closeRouteStage();
        }
        document.getElementById('cap-blog-reader-modal')?.classList.remove('open');
        toggleMenu(false);
      }
    });

    window.addEventListener('popstate', (e) => {
      const stage = document.getElementById('cap-route-stage');
      if (e.state && e.state.route) {
        this.openRouteBySlug(e.state.route);
      } else if (stage && stage.classList.contains('is-active')) {
        this.closeRouteStage();
      }
    });
  }

  selectAtlasDistrict(id) {
    this.selectedDistrictId = id;
    document.querySelectorAll('#atlas-district-buttons [data-select-atlas]').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-select-atlas') === id);
    });
    this.renderAtlasSidebar();
    this.playChime(540, 0.07);
  }

  renderAtlasSidebar() {
    const d = this.districts.find((x) => x.id === this.selectedDistrictId) || this.districts[0];
    const container = document.getElementById('atlas-sidebar-content');
    if (!container) return;
    const routeSlug = d.routeSlug || 'karakoy-kamondo-sessiz-hanlar';
    container.innerHTML = `
      <div>
        ${d.images && d.images.length ? `
          <div class="cap-atlas-sidebar__media" data-open-route="${routeSlug}" role="button" tabindex="0" title="${d.name} rotasını aç">
            <div class="ambient-image-flow">
              ${d.images.map((img, idx) => `
                <img src="${img}" alt="${d.name}" class="ambient-image-flow__slide ${idx === 0 ? 'is-active' : ''}" loading="lazy"/>
              `).join('')}
            </div>
            <div class="cap-atlas-media-hint">ROTAYI İNCELE ↗</div>
          </div>
        ` : ''}
        <div style="font-family:var(--font-tech);font-size:10.5px;font-weight:600;letter-spacing:0.18em;color:var(--cap-gold);text-transform:uppercase;">
          ${d.chap} · ${d.continent}
        </div>
        <h3 style="font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--text-dark-primary);margin:6px 0 4px;">
          ${d.name}
        </h3>
        <div style="font-family:var(--font-serif);font-size:1.6rem;font-style:italic;color:var(--cap-gold);margin-bottom:12px;">
          ${d.scriptTitle}
        </div>
        <p style="font-family:var(--font-body);font-size:1.15rem;color:var(--text-dark-secondary);line-height:1.7;margin-bottom:18px;">
          ${d.tagline}
        </p>
        <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:10px;font-family:var(--font-tech);font-size:11.5px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cap-gold)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span><strong>İDEAL SAAT:</strong> ${d.bestHour}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cap-gold)" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <span><strong>KADRAJ:</strong> ${d.lensTip}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cap-gold)" stroke-width="2"><path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1"/><path d="M4 18L3 12h18l-1 6"/><path d="M12 4v8"/></svg>
            <span><strong>VAPUR HATTI:</strong> ${d.ferryLink}</span>
          </div>
        </div>
      </div>
      <div style="margin-top:2rem;display:flex;flex-direction:column;gap:10px;">
        ${this.renderBtnCap(`${d.name.toUpperCase()} ROTASINI AÇ`, 'btn-cap--gold-solid', `data-open-route="${routeSlug}"`)}
        <button class="btn-cap btn-cap--on-marble" style="background:rgba(255,255,255,0.06);color:var(--text-dark-primary);" data-open-pwa="${d.name}">
          <span class="btn-cap__inner" style="justify-content:center;padding:0.65rem 1.6rem;font-size:0.8rem;">CANLI 3B SAHA MOTORUNU BAŞLAT ↗</span>
        </button>
      </div>
    `;
  }

  initBosphorusCanvas() {
    this.renderAtlasSidebar();
    const canvas = document.getElementById('bosphorus-atlas-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;
    let isVisible = false;
    let animId = null;

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);
      for (const d of this.districts) {
        if (Math.hypot(d.coords.x * canvas.width - mx, d.coords.y * canvas.height - my) < 34) {
          this.selectAtlasDistrict(d.id);
          break;
        }
      }
    });

    const draw = () => {
      if (!isVisible) return;
      t += 0.015;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const waterGrad = ctx.createLinearGradient(0, 0, w, h);
      waterGrad.addColorStop(0, '#050811');
      waterGrad.addColorStop(0.5, '#091326');
      waterGrad.addColorStop(1, '#04070e');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#141722';
      ctx.strokeStyle = '#c3a677';
      ctx.lineWidth = 1.8;

      // European North
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.62, 0);
      ctx.quadraticCurveTo(w * 0.56, h * 0.25, w * 0.48, h * 0.48);
      ctx.quadraticCurveTo(w * 0.32, h * 0.44, w * 0.14, h * 0.30);
      ctx.lineTo(0, h * 0.24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Historical Peninsula
      ctx.beginPath();
      ctx.moveTo(0, h * 0.34);
      ctx.quadraticCurveTo(w * 0.24, h * 0.46, w * 0.44, h * 0.60);
      ctx.quadraticCurveTo(w * 0.47, h * 0.78, w * 0.32, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Asian Shore
      ctx.beginPath();
      ctx.moveTo(w * 0.76, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(w * 0.68, h);
      ctx.quadraticCurveTo(w * 0.64, h * 0.72, w * 0.68, h * 0.46);
      ctx.quadraticCurveTo(w * 0.70, h * 0.24, w * 0.76, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(195, 166, 119, 0.45)';
      ctx.fillText('BOĞAZİÇİ', w * 0.50, h * 0.28);
      ctx.fillText('HALİÇ', w * 0.18, h * 0.39);

      // Ferry Routes
      const ferryRoutes = [
        { from: this.districts[0].coords, to: this.districts[3].coords },
        { from: this.districts[0].coords, to: this.districts[1].coords },
        { from: this.districts[0].coords, to: this.districts[4].coords }
      ];

      ferryRoutes.forEach((route, i) => {
        const x1 = route.from.x * w, y1 = route.from.y * h;
        const x2 = route.to.x * w, y2 = route.to.y * h;
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -t * 25;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const prog = (Math.sin(t * 0.9 + i * 2) + 1) / 2;
        ctx.fillStyle = '#f0e3cf';
        ctx.beginPath();
        ctx.arc(x1 + (x2 - x1) * prog, y1 + (y2 - y1) * prog, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      this.districts.forEach((d) => {
        const x = d.coords.x * w;
        const y = d.coords.y * h;
        const isSel = d.id === this.selectedDistrictId;

        if (isSel) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 15 + Math.sin(t * 3) * 5, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = isSel ? '#f59e0b' : '#c3a677';
        ctx.strokeStyle = '#0b090a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, isSel ? 8.5 : 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = `${isSel ? '700 13px' : '600 12px'} "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = isSel ? '#f8fafc' : '#c3a677';
        ctx.fillText(d.name, x + 14, y + 4);
      });

      animId = requestAnimationFrame(draw);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const wasVisible = isVisible;
        isVisible = entries[0].isIntersecting;
        if (isVisible && !wasVisible) {
          animId = requestAnimationFrame(draw);
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
        }
      }, { threshold: 0.05 });
      observer.observe(canvas);
    } else {
      isVisible = true;
      draw();
    }
  }

  getProgrammeStops() {
    const db = {
      arch: [
        {
          hour: '08:30',
          routeSlug: 'sultanahmet-bizans-sarniclari-rotasi',
          title: 'Süleymaniye Arka Terası & Şerefiye Sarnıcı',
          desc: 'Haliç panoraması ve 1600 yıllık yeraltı mermer sütunlarında su üstü ışık gösterisi.',
          district: 'TARİHİ YARIMADA',
          images: ['/assets/suleymaniye_courtyard.jpg', '/assets/sultanahmet_cistern_marble.jpg', '/assets/suleymaniye_panorama.jpg']
        },
        {
          hour: '11:00',
          routeSlug: 'karakoy-kamondo-sessiz-hanlar',
          title: 'Galata Surları & Kamondo Merdivenleri',
          desc: '1348 Ceneviz taş kuşağı ve Abraham Kamondo’nun 1870 tarihli Art Nouveau sarmal merdiveni.',
          district: 'KARAKÖY · GALATA',
          images: ['/assets/camondo_1895.jpg', '/assets/camondo_twilight.jpg', '/assets/galata_tower_vintage_poster.jpg']
        },
        {
          hour: '13:30',
          routeSlug: 'karakoy-kamondo-sessiz-hanlar',
          title: 'St. Pierre Han Avlusu & SALT Galata',
          desc: '1771 tarihli taş handa közde kahve molası ve Osmanlı Bankası’nın çelik kasa daireleri.',
          district: 'KARAKÖY · GALATA',
          images: ['/assets/direction_a.jpg', '/assets/bankalar_twilight.jpg', '/assets/palace_interior_vintage_poster.jpg']
        },
        {
          hour: '16:30',
          routeSlug: 'moda-gun-batimi-vapur-turu',
          title: '1.50€ Şehir Hatları Vapuru ile Kıta Geçişi',
          desc: 'Karaköy İskelesi’nden Kadıköy vapuruna binip açık güvertede çayla Boğaz geçişi.',
          district: 'BOĞAZİÇİ',
          images: ['/assets/ferries_golden_horn.jpg', '/assets/bosphorus_ferry_poster.jpg', '/assets/galata_bridge_fishermen.jpg']
        },
        {
          hour: '18:15',
          routeSlug: 'moda-gun-batimi-vapur-turu',
          title: 'Tarihi Moda İskelesi’nde Gün Batımı',
          desc: '1917 yapımı taş iskelenin üst kat kütüphanesinden Tarihi Yarımada ardında batan güneş.',
          district: 'MODA · KADIKÖY',
          images: ['/assets/moda_bosphorus_ferry.jpg', '/assets/haydarpasa_vintage_poster.jpg', '/assets/maidens_tower_poster.jpg']
        }
      ],
      photo: [
        {
          hour: '07:30',
          routeSlug: 'balat-altin-saat-fotograf-rotasi',
          title: 'Fener Rum Lisesi (Kırmızı Mektep) & Sancaktar Yokuşu',
          desc: 'Sabah güneşinin Marsilya tuğlalarını kızıla boyadığı sıfır kalabalıklı altın saat kadrajı.',
          district: 'FENER · BALAT',
          images: ['/assets/balat_golden_arch.jpg', '/assets/balat_wooden_houses.jpg', '/assets/balat_cat_church.jpg']
        },
        {
          hour: '09:00',
          routeSlug: 'balat-altin-saat-fotograf-rotasi',
          title: 'Merdivenli Yokuş & Cumbalı Ahşap Evler',
          desc: 'Pastel renkli Osmanlı ahşap evlerinin diyagonal sokak kompozisyonu (24mm / 35mm lens).',
          district: 'FENER · BALAT',
          images: ['/assets/balat_wooden_houses.jpg', '/assets/balat_vintage_poster.jpg', '/assets/balat_golden_arch.jpg']
        },
        {
          hour: '14:30',
          routeSlug: 'kuzguncuk-bostan-ahsap-koskler',
          title: 'Kuzguncuk İcadiye Bostanı & Simitçi Tahir Sokak',
          desc: 'Asya yakasında 700 yıllık bostan ve renkli ahşap köşklerin dingin öğleden sonra ışığı.',
          district: 'KUZGUNCUK',
          images: ['/assets/direction_c.jpg', '/assets/beylerbeyi_palace_poster.jpg', '/assets/ortakoy_mosque_poster.jpg']
        },
        {
          hour: '17:45',
          routeSlug: 'karakoy-kamondo-sessiz-hanlar',
          title: 'Kamondo Merdivenleri Alacakaranlık Çekimi',
          desc: 'Sarı sokak lambaları yandığında 1895 tarihi perspektifinden derinlikli portre karesi.',
          district: 'KARAKÖY · GALATA',
          images: ['/assets/camondo_twilight.jpg', '/assets/galata_twilight.jpg', '/assets/bankalar_twilight.jpg']
        }
      ],
      food: [
        {
          hour: '09:30',
          routeSlug: 'balat-altin-saat-fotograf-rotasi',
          title: 'Balat Tarihi Taş Fırın & St. Pierre Han Közde Kahve',
          desc: 'Odun ateşinde pişmiş sıcak simit ve bakır cezvede kumda demlenen Türk kahvesi.',
          district: 'BALAT & GALATA',
          images: ['/assets/istanbul_gastronomy_ritual.jpg', '/assets/direction_a.jpg', '/assets/grand_bazaar_lamps.jpg']
        },
        {
          hour: '12:30',
          routeSlug: 'karakoy-kamondo-sessiz-hanlar',
          title: 'Karaköy Tarihi Esnaf Lokantası & Baklava Ritüeli',
          desc: '1843’ten gelen ustalıkla çıtır fıstıklı baklava tadımı ve ince belli bardakta çay.',
          district: 'KARAKÖY',
          images: ['/assets/istanbul_gastronomy_ritual.jpg', '/assets/grand_bazaar_vintage_poster.jpg', '/assets/direction_b.jpg']
        },
        {
          hour: '16:00',
          routeSlug: 'moda-gun-batimi-vapur-turu',
          title: 'Karaköy → Kadıköy Vapur Güvertesinde Çay & Simit',
          desc: 'Martılar eşliğinde kıta değiştirirken İstanbul’un en ikonik deniz üstü ritüeli.',
          district: 'BOĞAZİÇİ',
          images: ['/assets/bosphorus_ferry_poster.jpg', '/assets/ferries_golden_horn.jpg', '/assets/moda_bosphorus_ferry.jpg']
        },
        {
          hour: '18:00',
          routeSlug: 'moda-gun-batimi-vapur-turu',
          title: 'Kadıköy Tarihi Çarşı & Moda Kahvecileri',
          desc: 'Güneşlibahçe Sokak’ta asırlık çarşı esnafı ve Moda’nın butik kahve kavurmacıları.',
          district: 'MODA · KADIKÖY',
          images: ['/assets/istanbul_gastronomy_ritual.jpg', '/assets/moda_bosphorus_ferry.jpg', '/assets/istanbul_ticket_pass.jpg']
        }
      ],
      night: [
        {
          hour: '17:30',
          routeSlug: 'karakoy-kamondo-sessiz-hanlar',
          title: 'Bankalar Caddesi & SALT Galata Alacakaranlık',
          desc: 'Neoklasik taş cephelerin kehribar sokak aydınlatmalarıyla sinematik bir dekora dönüşümü.',
          district: 'KARAKÖY · GALATA',
          images: ['/assets/bankalar_twilight.jpg', '/assets/camondo_twilight.jpg', '/assets/galata_twilight.jpg']
        },
        {
          hour: '19:30',
          routeSlug: 'sultanahmet-bizans-sarniclari-rotasi',
          title: 'Yerebatan & Şerefiye Sarnıcı Gece Seansı',
          desc: 'Karanlık su aynasında yükselen mermer sütunlar ve Medusa başlarının gece akustiği.',
          district: 'TARİHİ YARIMADA',
          images: ['/assets/basilica_cistern_columns.jpg', '/assets/sultanahmet_cistern_marble.jpg', '/assets/basilica_cistern_poster.jpg']
        },
        {
          hour: '21:15',
          routeSlug: 'karakoy-kamondo-sessiz-hanlar',
          title: 'Galata & Haliç Gizli Han Çatı Terasları',
          desc: 'Süleymaniye ve Galata Kulesi’nin aydınlatılmış silüetine karşı gece kahvesi.',
          district: 'GALATA',
          images: ['/assets/suleymaniye_panorama.jpg', '/assets/galata_tower_vintage_poster.jpg', '/assets/galata_twilight.jpg']
        }
      ]
    };
    return db[this.progVibe] || db.arch;
  }

  renderProgramme() {
    const stops = this.getProgrammeStops();
    const listEl = document.getElementById('cap-timeline-list');
    if (listEl) {
      listEl.innerHTML = stops.map((s) => `
        <div class="cap-timeline-row" data-open-route="${s.routeSlug}" role="button" tabindex="0" title="${s.title} rotasını aç">
          <div class="cap-timeline-hour">${s.hour}</div>
          <div class="cap-timeline-media" data-open-route="${s.routeSlug}">
            <div class="ambient-image-flow">
              ${(s.images || []).map((img, idx) => `
                <img src="${img}" alt="${s.title}" class="ambient-image-flow__slide ${idx === 0 ? 'is-active' : ''}" loading="lazy"/>
              `).join('')}
            </div>
          </div>
          <div class="cap-timeline-info" data-open-route="${s.routeSlug}">
            <h4>${s.title}</h4>
            <p>${s.desc}</p>
          </div>
          <div class="cap-timeline-side" data-open-route="${s.routeSlug}">
            <span class="cap-timeline-district">${s.district}</span>
            <span class="cap-timeline-open-cue">ROTAYI AÇ →</span>
          </div>
        </div>
      `).join('');
    }
    this.drawStoryPosterCanvas(stops);
  }

  drawStoryPosterCanvas(stops) {
    const canvas = document.getElementById('story-poster-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#080709';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#c3a677';
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 24, w - 48, h - 48);
    ctx.lineWidth = 1;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    ctx.fillStyle = '#c3a677';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SEMT · İSTANBUL ROTASI', w / 2, 82);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('GÜNLÜK KEŞİF PROGRAMIM', w / 2, 126);

    ctx.textAlign = 'left';
    const startY = 220;
    const stepGap = 135;

    stops.forEach((s, idx) => {
      const y = startY + idx * stepGap;
      ctx.fillStyle = '#c3a677';
      ctx.beginPath();
      ctx.arc(76, y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#c3a677';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(`${s.hour}  ·  ${s.district}`, 102, y - 6);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(s.title.substring(0, 32), 102, y + 20);
    });
  }

  applyLanguage() {
    const isEn = this.lang === 'en';
    const heroTitle = document.querySelector('[data-i18n="heroTitle"]');
    const heroManifesto = document.querySelector('[data-i18n="heroManifesto"]');
    if (heroTitle) {
      heroTitle.textContent = isEn ? 'TWO CONTINENTS, A THOUSAND LAYERS' : 'İKİ KITA, BİN KATMAN';
    }
    if (heroManifesto) {
      heroManifesto.textContent = isEn
        ? 'A curated exhibition of Istanbul across two continents: from the Genoese vaults of Galata to the golden dawn of Balat and the €1.50 sunset ferry to Moda.'
        : 'Ceneviz surlarının gölgesindeki Karaköy’den Haliç’in kızıl sabahına ve 1.50€’luk Şehir Hatları vapuruyla geçilen Moda’nın lodoslu gün batımına uzanan küratörlü keşif platformu.';
    }
  }

  ensureAudio() {
    if (!this.audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) this.audioCtx = new Ctx();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playChime(freq = 520, dur = 0.09) {
    try {
      this.ensureAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + dur);
    } catch (_) {}
  }

  playFerryChord() {
    try {
      this.ensureAudio();
      if (!this.audioCtx) return;
      [146.83, 220, 293.66].forEach((f) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0008, this.audioCtx.currentTime + 1.8);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 1.8);
      });
    } catch (_) {}
  }
}

// ============================================================================
// SEMT STUDIO CURSOR SYSTEM — AWWWARDS SOTD LUXURY SPATIAL INTERACTIONS
// Replaces default browser cursor & pointer hand with magnetic follower ring,
// zero-latency golden reticle dot, tactile snap physics, and context-aware badges.
// ============================================================================

export class SemtStudioCursor {
  constructor() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Strict Mobile Protection: Disable completely on touchscreens or coarse pointers
    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    if (isTouch) return;

    this.cursorEl = null;
    this.pinWrap = null;
    this.targetX = -100;
    this.targetY = -100;
    this.hasMoved = false;

    this.init();
  }

  init() {
    this.buildDom();
    this.bindEvents();
  }

  buildDom() {
    if (document.getElementById('cap-studio-cursor')) {
      this.cursorEl = document.getElementById('cap-studio-cursor');
      this.pinWrap = document.getElementById('cap-cursor-pin-wrap');
      document.body.classList.add('has-custom-cursor');
      return;
    }

    const wrap = document.createElement('div');
    wrap.id = 'cap-studio-cursor';
    wrap.className = 'cap-cursor';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = `
      <div class="cap-cursor__pin-wrap" id="cap-cursor-pin-wrap">
        <svg class="cap-pin-svg" width="20" height="26" viewBox="-10 -25 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Subtle contact shadow -->
          <ellipse class="cap-pin-shadow" cx="0" cy="0" rx="3.5" ry="1.2" fill="rgba(0,0,0,0.5)" />

          <!-- Main Architectural Pin Body -->
          <g class="cap-pin-body">
            <!-- Pin silhouette -->
            <path class="cap-pin-shape"
              d="M 0 -1
                 C -1.8 -4.5, -6.8 -10.5, -6.8 -16.5
                 A 6.8 6.8 0 1 1 6.8 -16.5
                 C 6.8 -10.5, 1.8 -4.5, 0 -1 Z"
              fill="url(#capPinGoldGrad)"
              stroke="#0a0806"
              stroke-width="1.2"
              stroke-linejoin="round"
            />
            <!-- Center eye / locator beacon -->
            <circle class="cap-pin-eye" cx="0" cy="-16.5" r="2.4" fill="#06080e" stroke="#c3a677" stroke-width="0.8" />
            <circle class="cap-pin-core" cx="0" cy="-16.5" r="1.1" fill="#fef08a" />
          </g>

          <defs>
            <linearGradient id="capPinGoldGrad" x1="-6" y1="-24" x2="6" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#edd9a6" />
              <stop offset="50%" stop-color="#c3a677" />
              <stop offset="100%" stop-color="#8d6e3f" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    `;

    document.body.appendChild(wrap);
    document.body.classList.add('has-custom-cursor');

    this.cursorEl = wrap;
    this.pinWrap = wrap.querySelector('#cap-cursor-pin-wrap');
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;

      if (!this.hasMoved) {
        this.hasMoved = true;
        if (this.cursorEl) this.cursorEl.classList.add('is-visible');
      }

      // Instant 0ms latency tracking at exact tip coordinates
      if (this.pinWrap) {
        this.pinWrap.style.transform = `translate3d(${this.targetX}px, ${this.targetY}px, 0)`;
      }
    }, { passive: true });

    document.addEventListener('mousedown', () => {
      if (this.cursorEl) this.cursorEl.classList.add('is-down');
    });

    document.addEventListener('mouseup', () => {
      if (this.cursorEl) this.cursorEl.classList.remove('is-down');
    });

    document.addEventListener('mouseleave', () => {
      if (this.cursorEl) this.cursorEl.classList.remove('is-visible');
    });

    document.addEventListener('mouseenter', () => {
      if (this.cursorEl && this.hasMoved) this.cursorEl.classList.add('is-visible');
    });

    // Delegated context detection for subtle hover elevation & glow
    document.addEventListener('mouseover', (e) => {
      if (!this.cursorEl) return;
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      // 1. Text input / search / editable: hide custom pin completely to keep pristine native caret
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        this.cursorEl.classList.add('is-text-input');
        this.cursorEl.classList.remove('is-hovering');
        return;
      }
      this.cursorEl.classList.remove('is-text-input');

      // 2. Interactive elements (Buttons, links, cards, controls, map items, visual modules)
      const isInteractive = target.closest(
        'button, a, .btn-cap, .cap-menu-pill-btn, .cap-filter-btn, .cap-slider-btn, .cap-slider-dot, .cap-nav-back-btn, .cap-stop-btn, .cap-dock-play-btn, .cap-dock-pwa-btn, .cap-stage-thumb-pill, .cap-pseo-card, .cap-panel-card, .cap-trap-card, .cap-arch-window, .cap-stop-card, .cap-stop-card__media, .cap-timeline-row, .cap-atlas-sidebar__media, .cap-slider-content-row, canvas, [data-open-route], [data-open-pwa], [role="button"]'
      );
      if (isInteractive) {
        this.cursorEl.classList.add('is-hovering');
      } else {
        this.cursorEl.classList.remove('is-hovering');
      }
    });
  }

  destroy() {
    if (this.cursorEl && this.cursorEl.parentNode) {
      this.cursorEl.parentNode.removeChild(this.cursorEl);
    }
    document.body.classList.remove('has-custom-cursor');
  }
}

if (typeof window !== 'undefined') {
  window.SemtStudioCursor = SemtStudioCursor;
}
