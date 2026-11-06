export const DISTRICTS = [
  {
    id: 'karakoy',
    name: 'Karaköy · Galata',
    tagline: 'Ceneviz Surları, Levanten Bankerler ve Liman Ruhu',
    character: 'Taş cepheli banka sarayları, dik merdivenli sokaklar ve Haliç’in tuzlu rüzgârı.',
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    mapFilter: 'sepia(0.18) hue-rotate(-10deg) saturate(1.35) contrast(1.08)',
    center: { lat: 41.0242, lng: 28.9746, zoom: 16 },
    atmosphere: 'Alacakaranlık · 17°C',
    heroImage: './public/assets/galata_twilight.jpg'
  },
  {
    id: 'balat',
    name: 'Fener · Balat',
    tagline: 'Kırmızı Mektep, Cumbalı Evler ve Haliç Kıyısı',
    character: 'Bizans tuğlası, renkli ahşap cumbalar ve yüzyıllık taş avlular.',
    accent: '#F43F5E',
    accentLight: '#FB7185',
    mapFilter: 'sepia(0.22) hue-rotate(315deg) saturate(1.3) contrast(1.08)',
    center: { lat: 41.0318, lng: 28.9489, zoom: 16 },
    atmosphere: 'Haliç Esintisi · 16°C',
    heroImage: './public/assets/camondo_twilight.jpg'
  },
  {
    id: 'kadikoy',
    name: 'Moda · Kadıköy',
    tagline: 'İskele, Art Nouveau Apartmanlar ve Plakçılar',
    character: 'Lodos dalgaları, tarihi tramvay hattı ve bohem sokak kültürü.',
    accent: '#14B8A6',
    accentLight: '#2DD4BF',
    mapFilter: 'hue-rotate(155deg) saturate(1.25) contrast(1.06)',
    center: { lat: 40.9862, lng: 29.0254, zoom: 15.5 },
    atmosphere: 'Gün Batımı · 18°C',
    heroImage: './public/assets/bankalar_twilight.jpg'
  },
  {
    id: 'sultanahmet',
    name: 'Tarihi Yarımada',
    tagline: 'Sarnıçlar, Hipodrom ve İmparatorluk Katmanları',
    character: 'Yeraltı su sarnıçları, anıtsal kubbeler ve bin yıllık taş yollar.',
    accent: '#EAB308',
    accentLight: '#FDE047',
    mapFilter: 'sepia(0.28) saturate(1.4) contrast(1.1)',
    center: { lat: 41.0086, lng: 28.9802, zoom: 15.5 },
    atmosphere: 'Gece Kehribarı · 17°C',
    heroImage: './public/assets/camondo_1895.jpg'
  }
];

export const NARRATORS = [
  {
    id: 'rifat',
    name: 'Rıfat Kaptan',
    role: 'Karaköy’ün Sesi · Liman Kılavuzu'
  },
  {
    id: 'leyla',
    name: 'Dr. Leyla Soydan',
    role: 'Mimari & Levanten Tarihçisi'
  },
  {
    id: 'mert',
    name: 'Mert Arslan',
    role: 'Sokak Kaşifi & Kent Efsaneleri'
  }
];

export const STOPS = [
  {
    id: 'stop-1',
    number: '01',
    title: 'Galata Kulesi & Ceneviz Surları',
    shortTitle: 'Galata Kulesi',
    subtitle: '1348 · İsa Kulesi’nden Haliç Gözetleme Noktasına',
    category: 'Mimari Miras',
    era: '1348 Ceneviz Kolonisi',
    isFree: true,
    state: 'listened',
    distanceMeters: 0,
    durationLabel: '01:55',
    xpReward: 150,
    coords: { lat: 41.02565, lng: 28.97415 },
    mapPos: { x: 0.36, y: 0.23 },
    heroImage: './public/assets/galata_twilight.jpg',
    archiveImage: './public/assets/camondo_1895.jpg',
    archiveYear: '1892',
    visitorHook: 'İki kıtanın ve üç denizin birleştiği 676 yıllık Ceneviz gözetleme kulesinin şifresi.',
    localHook: 'Kulenin 4. katındaki taş kemerlerde gizlenen 1831 yangın izi ve Evliya Çelebi’nin Hezârfen kaydı.',
    lookNowPrompt: {
      heading: 'Kuzeydoğu · Külah Altındaki Kemerlere Bak',
      instruction: 'Kulenin konik çatısının hemen altındaki yuvarlak kemerli pencerelere odaklan. Açık renkli taş kuşağı, II. Mahmud döneminde eklenen kat sınırını gösterir.'
    },
    oz: [
      '1348 yılında Cenevizliler tarafından “Christea Turris” (İsa Kulesi) adıyla Galata surlarının zirve noktası olarak inşa edildi.',
      '1509 depremi ve 1831 yangınında yıkılıp yeniden yükseldi; her katmanında farklı bir dönemin taş işçiliği vardır.',
      'Haliç’in ağzını kapatan dev demir zincirin kuzey ucunu koruyan en önemli gözetleme merkeziydi.'
    ],
    hikaye: [
      {
        time: '00:00',
        speaker: 'Rıfat Kaptan',
        text: 'Başını yukarı kaldır ve kulenin kesme taşlarına dikkatle bak. Şu an Cenevizli denizcilerin 1348 yılında diktiği en cüretkâr gözetleme kulesinin tam altındasın.'
      },
      {
        time: '00:28',
        speaker: 'Rıfat Kaptan',
        text: 'O yıllarda Galata, surlarla çevrili özerk bir Akdeniz liman şehriydi. Tüccarlar gündüz ipek ve baharat tartarken, gece bu kulenin tepesindeki nöbetçiler Haliç’teki gemi fenerlerini sayardı.'
      },
      {
        time: '00:56',
        speaker: 'Rıfat Kaptan',
        text: 'Kulenin orta kuşağındaki kemerlere odaklan. 17. yüzyılda Evliya Çelebi, Hezârfen Ahmed Çelebi’nin lodoslu bir sabah tam bu korkuluklardan Üsküdar’a süzüldüğünü yazar.'
      },
      {
        time: '01:25',
        speaker: 'Rıfat Kaptan',
        text: 'Fakat kulenin asıl görevi yangınları haber vermekti. Külahın altında bekleyen gözcüler, İstanbul’da yükselen ilk dumanı buradan davullarla bütün şehre ilan ederdi.'
      }
    ],
    derinles: {
      architecturalNote: 'Gövde çapı dıştan 16.45 metre, duvar kalınlığı ise zeminde tam 3.75 metredir. 1967 restorasyonunda bugünkü konik külahına kavuşmuştur.',
      secretFact: 'Kulenin zemin katının altında, eski Ceneviz sur hendeklerine açılan taş örgülü bir tahliye dehlizi bulunmaktadır.',
      sources: ['Semavi Eyice — Galata ve Kulesi', 'Evliya Çelebi — Seyahatnâme']
    }
  },
  {
    id: 'stop-2',
    number: '02',
    title: 'Kamondo Merdivenleri',
    shortTitle: 'Kamondo Merdivenleri',
    subtitle: '1870 · Doğu’nun Rothschild’lerinden Neo-Barok Bir Miras',
    category: 'Gizli Miras',
    era: '1870 Levanten Dönemi',
    isFree: true,
    state: 'close',
    distanceMeters: 18,
    durationLabel: '02:10',
    xpReward: 200,
    coords: { lat: 41.02395, lng: 28.97368 },
    mapPos: { x: 0.45, y: 0.46 },
    heroImage: './public/assets/camondo_twilight.jpg',
    archiveImage: './public/assets/camondo_1895.jpg',
    archiveYear: '1895',
    visitorHook: 'Bankalar Caddesi’nin sert taş binaları arasında su dalgası gibi kıvrılan bu merdiven neden inşa edildi?',
    localHook: 'Abraham Salomon Kamondo’nun torunları okula giderken düşmesin diye hesaplanan çift sarmallı güvenlik mimarisi.',
    lookNowPrompt: {
      heading: 'Güneybatı · Basamakların Birleştiği Boğuma Bak',
      instruction: 'Merdivenin iki kolunun birleşip tekrar ayrıldığı orta sahanlığa dikkat et. Bu kıvrım, yukarıdan tökezleyen birini ilk virajda durdurmak için tasarlanmıştır.'
    },
    oz: [
      '1870’lerde Osmanlı’nın en büyük finansörü olan Kamondo Ailesi tarafından Neo-Barok ve erken Art Nouveau üslubunda yaptırıldı.',
      'Abraham Salomon Kamondo, Bankalar Caddesi’nden üst sokaktaki Avusturya Lisesi’ne çıkan torunlarının güvenle yürümesini istedi.',
      'Çift sarmallı kıvrımı hem dik yokuşun rüzgârını keser hem de olası bir düşmede insanı ilk sahanlıkta korur.'
    ],
    hikaye: [
      {
        time: '00:00',
        speaker: 'Dr. Leyla Soydan',
        text: 'Ayaklarının altındaki aşınmış taş basamaklara bak. Bankalar Caddesi’nin ciddi ve köşeli binaları arasında birdenbire su gibi akan bu merdiven, bir dedenin torunlarına duyduğu sevginin taşa kazınmış halidir.'
      },
      {
        time: '00:30',
        speaker: 'Dr. Leyla Soydan',
        text: 'İspanya’dan Venedik’e, oradan İstanbul’a göç eden Kamondo ailesi, 19. yüzyılda Galata’da ilk modern belediyeciliği ve finans kurumlarını başlatan aileydi.'
      },
      {
        time: '01:02',
        speaker: 'Dr. Leyla Soydan',
        text: 'Şimdi merdivenin iki kolunun birleşip tekrar ayrıldığı o zarif boğuma dikkat et. Torunları sabah okul yolunda dik yokuşu tırmanırken yorulmasın diye bu çift sarmallı form seçildi.'
      }
    ],
    derinles: {
      architecturalNote: 'Kesme taş merdiven, Voyvoda Caddesi ile Kart Çınar Sokak arasındaki 14 metrelik kot farkını iki eliptik sahanlıkla çözer.',
      secretFact: '1927 yılında ünlü fotoğrafçı Henri Cartier-Bresson’un burada çektiği ikonik kare, merdiveni dünya fotoğraf tarihine taşımıştır.',
      sources: ['Nora Şeni — Kamondolar', 'Osmanlı Bankası Arşivi (1895)']
    }
  },
  {
    id: 'stop-3',
    number: '03',
    title: 'Bankalar Caddesi & Osmanlı Bankası',
    shortTitle: 'Osmanlı Bankası',
    subtitle: '1892 · Alexandre Vallauri’nin İmparatorluk Kasası',
    category: 'Finans & Mimari',
    era: '1892 Banka-i Osmanî-i Şahane',
    isFree: false,
    state: 'locked',
    distanceMeters: 65,
    durationLabel: '02:25',
    xpReward: 250,
    coords: { lat: 41.02365, lng: 28.97345 },
    mapPos: { x: 0.42, y: 0.56 },
    heroImage: './public/assets/bankalar_twilight.jpg',
    archiveImage: './public/assets/camondo_1895.jpg',
    archiveYear: '1895',
    visitorHook: '19. yüzyılda Doğu Akdeniz’in finans kalbi olan bu binanın iki yüzü neden iki farklı mimari dilde yapıldı?',
    localHook: 'Mimar Alexandre Vallauri’nin cadde cephesini Neoklasik Avrupa, Haliç cephesini ise Oryantalist Osmanlı sarayı gibi tasarlamasının sırrı.',
    lookNowPrompt: {
      heading: 'Kuzey Cephe · Taş Alınlığa Bak',
      instruction: 'Binanın üst kornişindeki “BANKA-İ OSMANİ-İ ŞAHANE” yazısına bak. Cadde yüzü Avrupalı bankerlere güven vermek için Rönesans sarayı gibidir.'
    },
    oz: [
      '1892 yılında Levanten mimar Alexandre Vallauri tarafından Banka-i Osmanî-i Şahane merkezi olarak tasarlandı.',
      'Ön cephesi Neoklasik Avrupa, Haliç’e bakan arka cephesi ise Osmanlı kimliğini temsil eden çift ruhlu bir başyapıttır.',
      'Bodrum katındaki çelik zırhlı imparatorluk kasaları bugün SALT Galata içinde gezilebilmektedir.'
    ],
    hikaye: [
      {
        time: '00:00',
        speaker: 'Dr. Leyla Soydan',
        text: 'Üzerinde yürüdüğün granit parke taşlar, yüz otuz yıl önce telgraf kuryelerinin, bankerlerin ve diplomatların adımlarıyla çınlıyordu.'
      },
      {
        time: '00:34',
        speaker: 'Dr. Leyla Soydan',
        text: 'Karşındaki anıtsal yapı, Alexandre Vallauri’nin dehasıdır. Binaya buradan baktığında Londra’da bir merkez bankası görürsün; ama karşı kıyıdan bakanlar kubbeli bir Osmanlı sarayı görür.'
      }
    ],
    derinles: {
      architecturalNote: 'Yangına dayanıklı dökme demir kirişler ve Marsilya’dan özel getirilen kesme taş bloklar kullanılmıştır.',
      secretFact: 'Alt kattaki çelik kasa dairelerinde Osmanlı dış borç senetleri ve Levanten ailelerin mücevher envanterleri saklanıyordu.',
      sources: ['Edhem Eldem — Osmanlı Bankası Tarihi', 'SALT Araştırma Arşivi']
    }
  },
  {
    id: 'stop-4',
    number: '04',
    title: 'St. Pierre Han & Gizli Avlu',
    shortTitle: 'St. Pierre Han',
    subtitle: '1771 · İstanbul’un İlk Taş Ticaret Hanlarından Biri',
    category: 'Gizli Avlu',
    era: '1771 Fransız Mirası',
    isFree: false,
    state: 'locked',
    distanceMeters: 110,
    durationLabel: '01:50',
    xpReward: 180,
    coords: { lat: 41.02445, lng: 28.97265 },
    mapPos: { x: 0.31, y: 0.48 },
    heroImage: './public/assets/camondo_twilight.jpg',
    archiveImage: './public/assets/camondo_1895.jpg',
    archiveYear: '1888',
    visitorHook: 'Dar bir sokak kapısından girildiğinde zamanın 1771 yılında durduğu yüksek tavanlı taş avlu.',
    localHook: 'Fransız شairi André Chénier’nin doğduğu ve ilk Osmanlı Bankası’nın 1856’da kurulduğu tarihi han.',
    lookNowPrompt: {
      heading: 'Doğu Girişi · Taş Armaya Bak',
      instruction: 'Giriş kemerinin üzerindeki Fransız Kraliyet zambakları (Fleur-de-lis) işlenmiş taş armayı incele.'
    },
    oz: [
      '1771’de Fransız tüccar Louis Chénier tarafından yangınlara dayanıklı kesme küfeki taşıyla inşa ettirildi.',
      'Ünlü şair André Chénier bu handa dünyaya geldi.',
      'Osmanlı Bankası 1856’da ilk kurulduğunda faaliyetine bu hanın üst katında başladı.'
    ],
    hikaye: [
      {
        time: '00:00',
        speaker: 'Mert Arslan',
        text: 'Galata’nın en büyüleyici yanı, gösterişsiz bir kapıdan içeri adım attığında karşına çıkan o sessiz taş avlulardır. St. Pierre Han tam bir zaman kapsülüdür.'
      }
    ],
    derinles: {
      architecturalNote: 'İki katlı açık koridorlu revak sistemi, Osmanlı hanları ile İtalyan palazzo avlularının nadir bir sentezidir.',
      secretFact: 'Alt mahzenleri Saint Pierre ve Saint Paul Kilisesi’nin eski Dominiken manastır temelleriyle bağlantılıdır.',
      sources: ['Rinaldo Marmara — Galata’nın Latin Mirası']
    }
  },
  {
    id: 'stop-5',
    number: '05',
    title: 'Karaköy Rıhtımı & Vapur İskelesi',
    shortTitle: 'Karaköy Rıhtımı',
    subtitle: '1895 · Dersaadet Rıhtım Şirketi ve Boğaz’ın Kapısı',
    category: 'Liman Belleği',
    era: '1895 Liman Modernleşmesi',
    isFree: false,
    state: 'locked',
    distanceMeters: 190,
    durationLabel: '02:00',
    xpReward: 180,
    coords: { lat: 41.0221, lng: 28.9762 },
    mapPos: { x: 0.62, y: 0.76 },
    heroImage: './public/assets/galata_twilight.jpg',
    archiveImage: './public/assets/camondo_1895.jpg',
    archiveYear: '1902',
    visitorHook: 'Avrupa’dan gelen Orient Express yolcularının Asya yakasına geçmek için vapura bindiği tarihi rıhtım.',
    localHook: 'Denizin taş bloklarla doldurulmasıyla kazanılan rıhtım hattı ve eski yüzer iskelenin öyküsü.',
    lookNowPrompt: {
      heading: 'Güney · Haliç Ağzına Bak',
      instruction: 'Sarayburnu ile Karaköy arasındaki su hattına bak; 1453’te Haliç’i kapatan zincirin kuzey ucu tam bu kıyıdaydı.'
    },
    oz: [
      '1895’te Dersaadet Rıhtım Şirketi tarafından dev taş bloklarla modern bir limana dönüştürüldü.',
      'Şirket-i Hayriye vapurlarından bugüne İstanbul deniz ulaşımının kalbidir.'
    ],
    hikaye: [
      {
        time: '00:00',
        speaker: 'Rıfat Kaptan',
        text: 'Eskiden gemiler açığa demirler, yolcular sallanan sandallarla kıyıya taşınırdı. 1895’te bu taş rıhtım tamamlandığında Karaköy dünya limanlarıyla doğrudan kucaklaştı.'
      }
    ],
    derinles: {
      architecturalNote: 'Su altına bırakılan 25 tonluk hidrolik kireç bloklar dönemin en ileri deniz mühendisliğiydi.',
      secretFact: 'Meydanda yer alan D’Aronco imzalı Art Nouveau Mescit, 1958 yol genişletmelerinde sökülmüştür.',
      sources: ['Zeynep Çelik — Değişen İstanbul']
    }
  },
  {
    id: 'stop-6',
    number: '06',
    title: 'Kılıç Ali Paşa Külliyesi',
    shortTitle: 'Kılıç Ali Paşa',
    subtitle: '1580 · Mimar Sinan’ın “Deniz Üzerine” Kurduğu Külliye',
    category: 'Klasik Osmanlı',
    era: '1580 Mimar Sinan',
    isFree: false,
    state: 'locked',
    distanceMeters: 310,
    durationLabel: '02:15',
    xpReward: 220,
    coords: { lat: 41.0264, lng: 28.9806 },
    mapPos: { x: 0.84, y: 0.42 },
    heroImage: './public/assets/galata_twilight.jpg',
    archiveImage: './public/assets/camondo_1895.jpg',
    archiveYear: '1890',
    visitorHook: 'Padişahın “Sen denizlerin kaptanısın, camini denize yap!” sözü üzerine denizin doldurulmasıyla yapılan külliye.',
    localHook: '92 yaşındaki Mimar Sinan’ın bu camide Ayasofya’nın plan şemasını yeniden yorumlamasının mimari sırrı.',
    lookNowPrompt: {
      heading: 'Kuzeydoğu · Ana Kubbeye Bak',
      instruction: 'Yarım kubbelerle desteklenen merkez kubbeye bak; Ayasofya’nın 16. yüzyıl taş işçiliğiyle rafine edilmiş halini göreceksin.'
    },
    oz: [
      'Kaptan-ı Derya Kılıç Ali Paşa tarafından 1580’de Mimar Sinan’a yaptırıldı.',
      'Tophane kıyısı taşlarla doldurularak doğrudan deniz kıyısına inşa edildi.',
      'Don Kişot’un yazarı Cervantes, bu külliyenin inşaatında çalışmıştır.'
    ],
    hikaye: [
      {
        time: '00:00',
        speaker: 'Rıfat Kaptan',
        text: 'Karada yer vermediler, o da denizi taşla doldurup camisini dalgaların üzerine kondurdu! Kılıç Ali Paşa ile Koca Sinan’ın ustalığı tam burada buluştu.'
      }
    ],
    derinles: {
      architecturalNote: 'Mimar Sinan, Ayasofya’nın statik sistemini daha narin sütunlar ve dengeli kemerlerle çözmüştür.',
      secretFact: 'İspanyol yazar Miguel de Cervantes, esir düştüğü yıllarda bu caminin taş inşaatında çalışmış ve ardından özgürlüğüne kavuşmuştur.',
      sources: ['Gülru Necipoğlu — Sinan Çağı']
    }
  }
];

export const ROUTES = [
  {
    id: 'route-levantine',
    type: 'Küratörlü Rota',
    title: 'Levantenlerin ve Bankerlerin İzinde',
    subtitle: 'Galata Kulesi’nden Kamondo Merdivenleri’ne, Bankalar Caddesi’nin altın kasalarından Karaköy Rıhtımı’na uzanan yürüyüş.',
    duration: '65 dk',
    distance: '2.4 km',
    stopsCount: 6,
    priceTag: 'İlk 2 Durak Ücretsiz · Sonrası 2,99 €',
    narrator: 'Rıfat Kaptan & Dr. Leyla',
    heroImage: './public/assets/bankalar_twilight.jpg'
  },
  {
    id: 'route-mystery',
    type: 'Gizem & Bulmaca Görevi',
    title: 'Kamondo’nun Kayıp Anahtarı',
    subtitle: 'Taş cephelerdeki Levanten sembollerini bularak şifreleri çöz, gizli pasajları ve avluları keşfet.',
    duration: '45 dk',
    distance: '1.6 km',
    stopsCount: 4,
    priceTag: 'SEMT Pass Dahilinde (4,99 €)',
    narrator: 'Mert Arslan',
    heroImage: './public/assets/camondo_twilight.jpg'
  },
  {
    id: 'route-ai',
    type: 'Kişisel AI Rota',
    title: 'Haliç Rüzgârı, Kahve ve Arka Sokaklar',
    subtitle: 'Yürüyüş tempona ve merak profiline göre şekillenen, kalabalıktan uzak Karaköy arka sokakları.',
    duration: '50 dk',
    distance: '1.9 km',
    stopsCount: 5,
    priceTag: 'Ücretsiz Önizleme',
    narrator: 'Dr. Leyla Soydan',
    heroImage: './public/assets/galata_twilight.jpg'
  }
];

export const PERSONA_QUESTIONS = [
  {
    id: 'q1',
    question: 'Keşif Odak Noktan',
    options: [
      { id: 'arch', label: 'Tarihi Cepheler & Mimari', tag: 'Gece Mimarı' },
      { id: 'secret', label: 'Gizli Avlular & Sırlar', tag: 'Gizem Avcısı' },
      { id: 'vibe', label: 'Yaşayan Sokak & Esnaf', tag: 'Sokak Flânörü' }
    ]
  }
];

export const HUB_ROOM = {
  code: '4K7-29B',
  name: 'Boğaziçi Karaköy Keşif Ekibi',
  sharedProgress: 68,
  members: [
    {
      id: 'u1',
      name: 'Kerem (Sen)',
      role: 'Oda Kurucusu',
      avatar: 'K',
      color: '#F59E0B',
      distance: 'Kamondo Merdivenleri (0m)',
      battery: 92,
      points: 850,
      status: 'Hikâyede'
    },
    {
      id: 'u2',
      name: 'Elif Kaya',
      role: 'Fotoğraf & Arşiv',
      avatar: 'E',
      color: '#38BDF8',
      distance: '14m Kuzeydoğuda',
      battery: 78,
      points: 820,
      status: 'Zaman Makinesi’nde'
    },
    {
      id: 'u3',
      name: 'Can Demir',
      role: 'Gizli Durak Avcısı',
      avatar: 'C',
      color: '#10B981',
      distance: '42m Güneyde (Bankalar Cd.)',
      battery: 64,
      points: 790,
      status: 'Yeni İpucu Buldu'
    },
    {
      id: 'u4',
      name: 'Zeynep Arı',
      role: 'Koleksiyoner',
      avatar: 'Z',
      color: '#A855F7',
      distance: '19m Batıda',
      battery: 85,
      points: 740,
      status: 'Yürüyüşte'
    }
  ],
  memoryAlbum: [
    {
      id: 'm1',
      author: 'Elif Kaya',
      stop: 'Galata Kulesi',
      time: '18:42',
      caption: 'Ceneviz surlarının 1831 yangın kuşağını alacakaranlıkta yakaladık.',
      image: './public/assets/galata_twilight.jpg'
    },
    {
      id: 'm2',
      author: 'Kerem',
      stop: 'Kamondo Merdivenleri',
      time: '19:05',
      caption: '1895 arşiv fotoğrafıyla birebir aynı açıdan grup karesi.',
      image: './public/assets/camondo_twilight.jpg'
    }
  ]
};

export const STAMPS = [
  {
    id: 'stamp-karakoy',
    district: 'KARAKÖY · GALATA',
    year: '1348 · 1870',
    title: 'Ceneviz & Levanten Mührü',
    edition: 'No. 0142 / İlk 1000 Kaşif',
    unlocked: true,
    unlockedDate: 'Açıldı · 19:04',
    accent: '#F59E0B'
  },
  {
    id: 'stamp-camondo',
    district: 'VOYVODA · BANKALAR',
    year: '1870 · 1892',
    title: 'Kamondo & Altın Kasa Mührü',
    edition: 'No. 0089 / Nadir Seri',
    unlocked: false,
    unlockedDate: '2. Durakta Açılır',
    accent: '#38BDF8'
  },
  {
    id: 'stamp-balat',
    district: 'FENER · BALAT',
    year: '1453 · 1881',
    title: 'Kırmızı Mektep & Haliç Mührü',
    edition: 'Semt Koleksiyonu',
    unlocked: false,
    unlockedDate: 'Balat Rotasında Açılır',
    accent: '#F43F5E'
  },
  {
    id: 'stamp-kadikoy',
    district: 'MODA · KADIKÖY',
    year: '1857 · 1924',
    title: 'Lodos & İskele Mührü',
    edition: 'Semt Koleksiyonu',
    unlocked: false,
    unlockedDate: 'Kadıköy Rotasında Açılır',
    accent: '#14B8A6'
  }
];

export const REWARDS = [
  {
    id: 'rew-ebru',
    partnerName: 'Galata Geleneksel Ebru Atölyesi',
    location: 'Serdar-ı Ekrem Sokak No:18 (110m)',
    title: '15 Dk Ücretsiz Ebru Deneyimi & Kendi Eserini Al',
    description: 'Karaköy 2. durağını açan SEMT kaşiflerine özel; usta eşliğinde kitre üzerinde kendi Galata ebrunu yap.',
    type: 'Kültürel Deneyim Ödülü',
    pinCode: '4829',
    rating: '4.9 ★ (142 Yorum)'
  },
  {
    id: 'rew-gulluoglu',
    partnerName: 'Karaköy Tarihi Fırın & Tatlıcısı',
    location: 'Kemankeş Caddesi (240m)',
    title: 'Tarihi Baklava Tadımı & Demleme Çay İkramı',
    description: 'SEMT Pasaport sahiplerine özel geleneksel tadım ikramı.',
    type: 'Gastronomi Partneri',
    pinCode: '7310',
    rating: '4.9 ★ (310 Yorum)'
  }
];

export const PRICING_TIERS = [
  {
    id: 'single-route',
    name: 'Tek Rota Bileti',
    subtitle: 'Karaköy · Galata Tam Erişim (Tüm Duraklar & Arşiv)',
    priceEur: '2,99 €',
    badge: 'HIZLI BAŞLANGIÇ',
    recommended: false
  },
  {
    id: 'semt-pass',
    name: 'SEMT Pass (7 Günlük)',
    subtitle: 'Tüm Semtler + Kişisel AI Rota + 3 Esnaf Deneyim Kuponu',
    priceEur: '4,99 €',
    badge: 'ÖNERİLEN · KAHVE FİYATINA',
    recommended: true
  },
  {
    id: 'istanbul-pass',
    name: 'İstanbul Tam Keşif + HUB Plus',
    subtitle: 'Tüm İstanbul Semtleri + 6 Kişilik Canlı Grup Odası Dahil',
    priceEur: '12,99 €',
    badge: 'GRUP & KOLEKSİYONER',
    recommended: false
  }
];
