# SEMT — BÜTÜNLEŞİK MASTER PROJE VE TASARIM BELGESİ (TEK DOSYA)
> **Sürüm:** 2.0 (Studio Grade — Sleek Urban Minimal)  
> **Derleme Tarihi:** Kasım 2026  
> **Kapsam:** Tüm Soru-Cevaplar, Revizyon Kararları, Master Design System (v2.0), 4 Semt Mimarisi, Durak İçerikleri, Ses ve Anlatıcılar, Oyunlaştırma (XP/Radar/Mühürler), HUB Canlı Grup Keşfi, Yerel Esnaf Ödül & Pasaport Sistemi, Monetizasyon Modeli ve Teknik Kod Mimarisi.

---

# İÇİNDEKİLER
1. [Tasarım Revizyonu Soru-Cevapları ve Alınan Kararlar](#1-tasarım-revizyonu-soru-cevapları-ve-alınan-kararlar)
2. [Master Design System 2.0 (Modern & Sleek Dark Architecture)](#2-master-design-system-20-modern--sleek-dark-architecture)
3. [Semt ve Bölge Mimarisi (4 Ana Semt)](#3-semt-ve-bölge-mimarisi-4-ana-semt)
4. [Anlatıcılar ve Ses Karakterleri](#4-anlatıcılar-ve-ses-karakterleri)
5. [Duraklar ve İçerik Derinliği (Karaköy Pilot Rotası)](#5-duraklar-ve-içerik-derinliği-karaköy-pilot-rotası)
6. [Rotalar, Kürasyon ve Kişisel AI Rota Sistemi](#6-rotalar-kürasyon-ve-kişisel-ai-rota-sistemi)
7. [Oyunlaştırma, Etkileşim ve Keşif Sisi (Fog of War)](#7-oyunlaştırma-etkileşim-ve-keşif-sisi-fog-of-war)
8. [Canlı Grup Keşif Odası (SEMT HUB)](#8-canlı-grup-keşif-odası-semt-hub)
9. [Yerel Esnaf Ödül Ağı ve Monetizasyon Modeli](#9-yerel-esnaf-ödül-ağı-ve-monetizasyon-modeli)
10. [Teknik ve Kod Mimarisi Kararları](#10-teknik-ve-kod-mimarisi-kararları)

---

## 1. TASARIM REVİZYONU SORU-CEVAPLARI VE ALINAN KARARLAR

### 1.1 Yaşanan Problem ve Revizyon İhtiyacı
Önceki `MASTER.md (v1.0)` belgesinde tanımlanan "Ağır Osmanlı Mirası", "Quiet Luxury / Müze Havası", "Serif Tipografi (Playfair Display)", "1.600ms'lik uzun kilit açma törenleri" ve karmaşık "Çoklu Tema Motoru (Theme A/B/C)", uygulamanın hem mobil performansını düşürüyor hem de kullanıcının arzu ettiği **"cool, dinamik, hızlı ve akıcı (fluid)"** deneyimle çelişiyordu.

### 1.2 Yapılan Anket / Soru-Cevap Seansı
Kullanıcı ile yapılan birebir interaktif görüşme sonucunda netleşen kararlar şunlardır:

* **Soru 1 (Görsel Stil):** *Uygulamanın 'cool' havasını tam olarak hangi görsel stilde yakalamak istiyorsun?*
  * **Verilen Karar:** **Modern & Sleek Dark Minimal (Satoshi / Inter, neon kehribar vurgular, ince buzlu cam, Spotify & Linear esintisi taşıyan çağdaş kentsel hava).**
  * *Elenen Seçenekler:* Ağır nostaljik müze teması, neon-cyberpunk aşırılıkları, sadece açık renkli VisionOS kopyası.

* **Soru 2 (Akış & Hız):** *'Akıcı' (fluid) deneyimden beklentin nedir, animasyon ve etkileşim ritmi nasıl olmalı?*
  * **Verilen Karar:** **Ağır törenler ve yavaş animasyonlar tamamen terk edildi; yerine 120–200ms snappy spring fiziklerine, sürükleme (swipe-to-dismiss) jestlerine ve sıfır gecikmeli kesintisiz geçişlere geçildi.**
  * *Elenen Seçenekler:* 1.6 saniye bekleten mühür kırma törenleri, ekranı kilitleyen ara sahneler.

* **Soru 3 (Elenen / Sadeleştirilen Unsurlar):** *Mevcut MASTER.md'de tasarımı kısıtlayan veya rahatsız eden unsurlar hangileri?*
  * **Alınan Kararlar:**
    1. **Ağır Serif (Tırnaklı) Fontların İptali:** Playfair Display kaldırıldı; yerine keskin, modern geometric sans-serif (Plus Jakarta Sans / Inter) getirildi.
    2. **Hantal Törenlerin Sadeleşmesi:** Mühür kırma/pul yapıştırma yerine 200ms mikro-burst (ışık halkası + ses başlangıcı) kuralı kondu.
    3. **Tema Karmaşasının Giderilmesi:** Kafa karıştıran Theme A, Theme B, İlçe Renk Modları kaldırıldı; tek ve kusursuz bir derin obsidyen karanlık kimlik (`#07090E`) standarda bağlandı.
    4. **Performans Optimizasyonu:** Mobil web performansını boğan aşırı 3D jiroskop takibi ve sürekli CPU tüketen fon sesleri temizlendi; hafif CSS hardware acceleration kuralı getirildi.

---

## 2. MASTER DESIGN SYSTEM 2.0 (MODERN & SLEEK DARK ARCHITECTURE)

### 2.1 Tasarım Felsefesi: "Sleek Urban Noir & Fluid Precision"
* **Keskin ve Çağdaş:** Linear ve Spotify kalitesinde, tipografisi güçlü, zemin kontrastı kusursuz kentsel sesli rehber arayüzü.
* **Tek Otoriter Kimlik:** Derin OLED-dostu zemin üzerinde yüzen cam elemanlar.
* **Jest Öncelikli (Gesture-First):** Bütün modallar yerini parmak ucuyla çekilip kapatılabilen akıcı alt çekmecelere (bottom sheets) bıraktı.
* **Anlık Ödül:** Kilidi açılan durağın sesi 0ms gecikmeyle kulaklığa akar.

### 2.2 CSS Token Mimarisi
```css
:root {
  /* Canvas & Zemin Katmanları */
  --bg-canvas: #07090E;                 /* Pitch-black & derin obsidyen canvas */
  --bg-surface: rgba(15, 20, 32, 0.78); /* %78 opaklıkta buzlu cam kart & sheet */
  --bg-elevated: rgba(24, 32, 50, 0.88);/* Yüzen kontrol hapları ve aktif butonlar */
  --bg-elevated-hover: rgba(34, 45, 70, 0.95);

  /* Kenarlıklar & Specular Işık Yakalayıcılar */
  --border-subtle: rgba(255, 255, 255, 0.08); /* 1px saç teli inceliğinde sınır */
  --border-specular: rgba(255, 255, 255, 0.16); /* Üst kenar ışık çizgisi */
  --border-active: rgba(245, 158, 11, 0.5);     /* Aktif kehribar odak çerçevesi */

  /* Tipografi & Kontrast Oranları */
  --fg-primary: #F8FAFC;    /* Ana başlık ve metinler (15.5:1 kontrast - WCAG AAA) */
  --fg-secondary: #94A3B8;  /* Mesafe, süre, alt başlıklar (6.2:1 kontrast - WCAG AA) */
  --fg-muted: #475569;      /* Pasif sayaçlar ve ikonlar */

  /* Vurgu & Durum Renkleri */
  --accent-primary: #F59E0B;        /* Elektrik Kehribar (Primary CTA, oynatıcı) */
  --accent-glow: rgba(245, 158, 11, 0.24); /* Neon halo ışıması */
  --accent-cyan: #06B6D4;           /* Canlı GPS ve radar nabzı */
  --accent-emerald: #10B981;        /* Tamamlanan kilitler ve başarı */

  /* Geometri & Filtreler */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-pill: 9999px;
  --blur-glass: blur(20px) saturate(180%);
}
```

### 2.3 Tipografi Standartları
* **Başlıklar (`--font-display`):** `'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif`
  * Hero Semt Başlığı: `clamp(1.75rem, 3.5vw, 2.25rem)`, `font-weight: 700`, `letter-spacing: -0.03em`.
  * Durak Başlıkları: `1.125rem (18px)`, `font-weight: 600`, `letter-spacing: -0.015em`.
* **Gövde & Karaoke Transkript (`--font-sans`):** `'Inter', 'Plus Jakarta Sans', sans-serif`
  * Metin Ölçüsü: `1rem (16px)`, `line-height: 1.6`, `font-weight: 400`.
  * UI Etiketleri: `0.875rem (14px)`, `font-weight: 600`.
* **Teknik Rozet & Koordinat (`--font-mono`):** `'JetBrains Mono', 'SF Mono', monospace`
  * Sayaçlar & GPS: `0.6875rem (11px)`, `letter-spacing: 0.08em`, `tabular-nums`.

### 2.4 Hız ve Etkileşim Kuralları (Snappy Physics)
* **Dokunma Tepkisi (Touch Response):** `100ms in / 180ms spring out`, `transform: scale(0.96)`.
* **Haptic:** `navigator.vibrate(8)` ile mikro tıklama hissi.
* **Alt Çekmece:** Parmağı 1:1 takip eden sürükleme fiziği (swipe-to-dismiss).
* **Mini Player:** Spotify tarzı altta yüzen ince hap, tıklandığında 220ms yaylanarak tam ekrana geçer.

---

## 3. SEMT VE BÖLGE MİMARİSİ (4 ANA SEMT)

Uygulama İstanbul'un tarihi, kültürel ve mimari karakteri en belirgin 4 semtini kapsar:

| Semt ID | Semt Adı | Tagline & Karakter | Vurgu Rengi | Merkez Koordinat | Atmosfer |
|---|---|---|---|---|---|
| `karakoy` | **Karaköy · Galata** | Ceneviz Surları, Levanten Bankerler ve Liman Ruhu. Taş cepheli banka sarayları, dik merdivenli sokaklar. | `#F59E0B` (Kehribar) | `41.0242, 28.9746` (Zoom: 16) | Alacakaranlık · 17°C |
| `balat` | **Fener · Balat** | Kırmızı Mektep, Cumbalı Evler ve Haliç Kıyısı. Bizans tuğlası, renkli ahşap cumbalar ve yüzyıllık taş avlular. | `#F43F5E` (Gül Kırmızı) | `41.0318, 28.9489` (Zoom: 16) | Haliç Esintisi · 16°C |
| `kadikoy` | **Moda · Kadıköy** | İskele, Art Nouveau Apartmanlar ve Plakçılar. Lodos dalgaları, tarihi tramvay hattı ve bohem sokak kültürü. | `#14B8A6` (Turkuaz) | `40.9862, 29.0254` (Zoom: 15.5) | Gün Batımı · 18°C |
| `sultanahmet` | **Tarihi Yarımada** | Sarnıçlar, Hipodrom ve İmparatorluk Katmanları. Yeraltı su sarnıçları, anıtsal kubbeler ve bin yıllık taş yollar. | `#EAB308` (İmparatorluk Altını) | `41.0086, 28.9802` (Zoom: 15.5) | Gece Kehribarı · 17°C |

---

## 4. ANLATICILAR VE SES KARAKTERLERİ

Her semt, hikayeyi farklı bir perspektiften aktaran profesyonel ses karakterlerine sahiptir:

1. **Rıfat Kaptan (`rifat`):**
   * *Rolü:* Karaköy’ün Sesi · Liman Kılavuzu.
   * *Tonu:* Tok, samimi, deniz görmüş, İstanbul'un sokak hafızasını ve liman rüzgarını taşıyan deneyimli ses.
2. **Dr. Leyla Soydan (`leyla`):**
   * *Rolü:* Mimari & Levanten Tarihçisi.
   * *Tonu:* Rafine, entelektüel, binaların taş işçiliğini, arşiv belgelerini ve aile hikayelerini açığa çıkaran derin anlatım.
3. **Mert Arslan (`mert`):**
   * *Rolü:* Sokak Kaşifi & Kent Efsaneleri.
   * *Tonu:* Genç, dinamik, gizli geçitleri, grafiti arkasında kalan hikayeleri ve gizemleri kovalayan flânör.

---

## 5. DURAKLAR VE İÇERİK DERİNLİĞİ (KARAKÖY PİLOT ROTASI)

Karaköy rotası 6 temel durak üzerinden 3 katmanlı mikro-içerik (Özet, Senkronize Hikaye, Derinleş) sunar:

### Durak 01: Galata Kulesi & Ceneviz Surları
* **Kod:** `stop-1` | **No:** `01` | **Kategori:** Mimari Miras | **Dönem:** 1348 Ceneviz Kolonisi
* **Erişim:** Ücretsiz (`isFree: true`) | **Mesafe:** 0m | **Süre:** 01:55 | **Ödül:** 150 XP
* **Koordinat:** `41.02565, 28.97415` | **Harita Konumu:** `(0.36, 0.23)`
* **Kanca (Hook):** İki kıtanın ve üç denizin birleştiği 676 yıllık Ceneviz gözetleme kulesinin şifresi.
* **Bak-Gör İpucu:** *Kuzeydoğu · Külah Altındaki Kemerlere Bak:* Kulenin konik çatısının hemen altındaki yuvarlak kemerli pencerelere odaklan. Açık renkli taş kuşağı, II. Mahmud döneminde eklenen kat sınırını gösterir.
* **Sesli Hikaye Akışı (Rıfat Kaptan):**
  * `00:00`: "Başını yukarı kaldır ve kulenin kesme taşlarına dikkatle bak. Cenevizlilerin 1348 yılında diktiği en cüretkâr gözetleme kulesinin tam altındasın."
  * `00:28`: "Galata, surlarla çevrili özerk bir limandı. Tüccarlar ipek ve baharat tartarken nöbetçiler Haliç'teki gemi fenerlerini sayardı."
  * `00:56`: "17. yüzyılda Evliya Çelebi, Hezârfen Ahmed Çelebi'nin lodoslu bir sabah tam bu korkuluklardan Üsküdar'a süzüldüğünü yazar."
  * `01:25`: "Kulenin asıl görevi yangınları haber vermekti; yükselen ilk duman davullarla bütün şehre ilan edilirdi."
* **Derinleş (Mimari & Gizli Bilgi):** Gövde çapı 16.45m, duvar kalınlığı 3.75m. Zemin altında eski Ceneviz sur hendeklerine açılan tahliye dehlizi vardır.

### Durak 02: Kamondo Merdivenleri
* **Kod:** `stop-2` | **No:** `02` | **Kategori:** Gizli Miras | **Dönem:** 1870 Levanten Dönemi
* **Erişim:** Ücretsiz (`isFree: true`) | **Mesafe:** 18m | **Süre:** 02:10 | **Ödül:** 200 XP
* **Görsel Arşiv:** `1895` Arşiv Fotoğrafı vs Günümüz Twilight Karşılaştırması (Zaman Makinesi Slider)
* **Kanca (Hook):** Abraham Salomon Kamondo’nun torunları okula giderken düşmesin diye hesaplanan çift sarmallı güvenlik mimarisi.
* **Bak-Gör İpucu:** *Güneybatı · Basamakların Birleştiği Boğuma Bak:* İki kolun birleşip ayrıldığı orta sahanlık, yukarıdan tökezleyen birini ilk virajda durdurmak için tasarlanmıştır.
* **Sesli Hikaye (Dr. Leyla Soydan):** "Bankalar Caddesi’nin ciddi binaları arasında su gibi akan bu merdiven, bir dedenin torunlarına duyduğu sevginin taşa kazınmış halidir..."
* **Derinleş:** Voyvoda Caddesi ile Kart Çınar Sokak arasındaki 14 metrelik kot farkını iki eliptik sahanlıkla çözer. Henri Cartier-Bresson 1927'de burada ikonik karesini çekmiştir.

### Durak 03: Bankalar Caddesi & Osmanlı Bankası
* **Kod:** `stop-3` | **No:** `03` | **Kategori:** Finans & Mimari | **Dönem:** 1892 Banka-i Osmanî-i Şahane
* **Erişim:** Kilitli (Pass / Bilet Gerekir) | **Mesafe:** 65m | **Süre:** 02:25 | **Ödül:** 250 XP
* **Öz:** Mimar Alexandre Vallauri’nin başyapıtı. Ön cephesi Neoklasik Londra bankası, Haliç cephesi kubbeli Osmanlı sarayıdır. Bodrumdaki çelik zırhlı imparatorluk kasaları günümüzde SALT Galata içinde gezilebilir.

### Durak 04: St. Pierre Han & Gizli Avlu
* **Kod:** `stop-4` | **No:** `04` | **Kategori:** Gizli Avlu | **Dönem:** 1771 Fransız Mirası
* **Öz:** Şair André Chénier’nin doğduğu, 1856’da ilk Osmanlı Bankası’nın kurulduğu tarihi han. Giriş kemerinde Fransız kraliyet zambakları (Fleur-de-lis) arması yer alır.

### Durak 05: Karaköy Rıhtımı & Vapur İskelesi
* **Kod:** `stop-5` | **No:** `05` | **Kategori:** Liman Belleği | **Dönem:** 1895 Liman Modernleşmesi
* **Öz:** Orient Express yolcularının Asya yakasına geçmek için kullandığı tarihi rıhtım. 1453’te Haliç’i kapatan dev demir zincirin kuzey kıyı ucudur.

### Durak 06: Kılıç Ali Paşa Külliyesi
* **Kod:** `stop-6` | **No:** `06` | **Kategori:** Klasik Osmanlı | **Dönem:** 1580 Mimar Sinan
* **Öz:** "Sen denizlerin kaptanısın, camini denize yap!" fermanı üzerine denizin doldurulmasıyla inşa edilmiştir. Mimar Sinan 92 yaşında Ayasofya planını revize etmiştir; Don Kişot’un yazarı Cervantes inşaatında çalışmıştır.

---

## 6. ROTALAR, KÜRASYON VE KİŞİSEL AI ROTA SİSTEMİ

1. **Levantenlerin ve Bankerlerin İzinde (Küratörlü Yürüyüş):**
   * *Güzergah:* Galata Kulesi → Kamondo Merdivenleri → Bankalar Caddesi → Karaköy Rıhtımı
   * *Metrikler:* 65 dakika, 2.4 km, 6 durak.
   * *Model:* İlk 2 Durak Ücretsiz, Sonrası 2,99 € veya SEMT Pass.
2. **Kamondo’nun Kayıp Anahtarı (Gizem & Bulmaca Görevi):**
   * *Konsept:* Taş cephelerdeki Levanten sembollerini bularak şifreleri çözme ve gizli geçitleri açma oyunu.
   * *Metrikler:* 45 dakika, 1.6 km, 4 durak. Anlatıcı: Mert Arslan.
3. **Haliç Rüzgârı, Kahve ve Arka Sokaklar (Kişisel AI Dinamik Rota):**
   * *Konsept:* Kullanıcının seçtiği ilgi alanına göre durakları yeniden sıralayan dinamik yapay zeka rotası.
   * *Persona Seçenekleri:*
     * `arch`: Tarihi Cepheler & Mimari (*Gece Mimarı*)
     * `secret`: Gizli Avlular & Sırlar (*Gizem Avcısı*)
     * `vibe`: Yaşayan Sokak & Esnaf (*Sokak Flânörü*)

---

## 7. OYUNLAŞTIRMA, ETKİLEŞİM VE KEŞİF SİSİ (FOG OF WAR)

* **Deneyim Puanı (XP) ve Seviye Mimarisi:**
  * Başlangıç: 1.250 XP (Seviye 4 — Usta Flânör).
  * Durak Tamamlama: +150 ile +250 XP arası kazanç.
  * Gizem Kutusu (Mystery Box): Rotayı tamamlayanlara özel rozet açılışı.
* **Keşif Sisi (Fog of War Engine):**
  * Harita ilk açılışta atmosferik bir sis perdesiyle örtülüdür.
  * Kullanıcı sahada yürüdükçe veya HUD üzerindeki bulut ikonuna bastıkça sis aralanır, haritadaki gizli noktalar (Durak 07, 08) görünür hale gelir.
* **Yakınlık Radarı ("Sıcak-Soğuk"):**
  * Kullanıcı durağa yaklaştıkça (150m → 30m) kehribar radar halkalarının nabız atışı hızlanır ve titreşim sıklığı artar.
* **Zaman Makinesi (Archive Time-Machine Slider):**
  * Kullanıcı kartın üzerindeki sürgüyü parmağıyla çekerek günümüz alacakaranlık çekimi ile 1895 yılı arşiv fotoğrafını birebir aynı perspektiften üst üste bindirir.
* **Koleksiyonluk Dijital Mühürler:**
  * Karaköy Levanten Mührü (Açık, No: 0142 / İlk 1000 Kaşif)
  * Kamondo & Altın Kasa Mührü (2. Durakta açılır)
  * Balat Kırmızı Mektep Mührü & Kadıköy Lodos Mührü (İlgili semt rotasında açılır)

---

## 8. CANLI GRUP KEŞİF ODASI (SEMT HUB)

Kullanıcıların arkadaşlarıyla aynı anda, harita üzerinde birbirlerini görerek ortak keşif yapmalarını sağlayan çok oyunculu (collaborative) oda motoru:

* **Aktif Oda Kodu:** `4K7-29B` (Boğaziçi Karaköy Keşif Ekibi)
* **Ortak İlerleme:** `%68`
* **Ekip Üyeleri:**
  1. `Kerem (Sen)` — Oda Kurucusu (Kamondo Merdivenleri - 0m, Pil: %92, Puan: 850, Durum: Hikâyede)
  2. `Elif Kaya` — Fotoğraf & Arşiv (14m Kuzeydoğuda, Pil: %78, Puan: 820, Durum: Zaman Makinesinde)
  3. `Can Demir` — Gizli Durak Avcısı (42m Güneyde / Bankalar Cd., Pil: %64, Puan: 790, Durum: İpucu Buldu)
  4. `Zeynep Arı` — Koleksiyoncu (19m Batıda, Pil: %85, Puan: 740, Durum: Yürüyüşte)
* **Ortak Hafıza Albümü:** Ekip üyelerinin çektiği arşiv karşılaştırma fotoğrafları ve keşif notları kronolojik olarak albüme eklenir.

---

## 9. YEREL ESNAF ÖDÜL AĞI VE MONETİZASYON MODELİ

### 9.1 Kültürel & Gastronomi Ödül Kuponları
SEMT, durakları keşfeden kullanıcılara semtin geleneksel yerel esnafında geçerli ayrıcalıklar sunar:
1. **Galata Geleneksel Ebru Atölyesi:**
   * *Ayrıcalık:* 15 Dakika Ücretsiz Ebru Deneyimi & Kendi Eserini Hediye Al.
   * *Konum:* Serdar-ı Ekrem Sokak No:18 (110m). Doğrulama PIN: `4829`.
2. **Karaköy Tarihi Fırın & Tatlıcısı (Güllüoğlu):**
   * *Ayrıcalık:* Tarihi Baklava Tadımı & Demleme Çay İkramı.
   * *Konum:* Kemankeş Caddesi (240m). Doğrulama PIN: `7310`.
* **Güvenlik Mimarisi:** Sahteciliği önlemek için her 30 saniyede bir dinamik olarak tohumlanan (`seed`) geri sayımlı QR kod motoru.

### 9.2 Biletleme ve Gelir Modeli
* **Tek Rota Bileti (2,99 €):** Karaköy rotasındaki tüm kilitli duraklara ve ses arşivine sınırsız tek seferlik erişim.
* **SEMT Pass - 7 Günlük (4,99 € — Önerilen):** Tüm İstanbul semtleri + Kişisel AI Rota + 3 Yerel Esnaf Deneyim Kuponu Dahil.
* **İstanbul Tam Keşif + HUB Plus (12,99 €):** Tüm semtler + 6 kişilik canlı grup keşif odası lisansı + Koleksiyonluk Pasaport.

---

## 10. TEKNİK VE KOD MİMARİSİ KARARLARI

### 10.1 UI / Ekran Düzeni (Saf 2 Sekmeli Minimal Navigasyon)
Ekran karmaşasını önlemek için geleneksel 5 sekmeli alt bar kaldırılmış, yerine **2 butonlu minimal HUD** uygulanmıştır:
1. **`Keşfet` Sekmesi (`#tab-kesfet`):**
   * Tam ekran interaktif HTML5 Canvas harita.
   * Üst yüzen HUD: Aktif Semt Değiştirici, 3B/2B Perspektif Butonu, Sis Aralama Butonu.
   * Alt yüzen dock: Seçili durak kartı, ses oynatıcı hapı ve mini dalga boyu.
2. **`Ayarlar & Keşif Kütüğü` Sekmesi (`#tab-ayarlar`):**
   * Dikey akordeon şeklinde organize edilmiş tek parça kontrol merkezi:
     * *Rotalar ve Kürasyon*
     * *Canlı HUB Grubu*
     * *SEMT Pasaportu & Mühürler*
     * *Esnaf Ödülleri & Biletleme (Cüzdan)*

### 10.2 Harita Motoru (`SemtMapEngine` Canvas)
* Vektör harita kütüphanelerine (Mapbox/Google Maps API maliyet ve ağırlığına) bağımlı kalmadan; özel bir `HTML5 Canvas 2D Context` üzerinde çalışan, **izometrik 3B projeksiyon**, su animasyonu, dalgalı radar pingleri ve dokunmatik jestleri destekleyen hafif motor.

### 10.3 Performans ve Donanım Hızlandırma
* Tüm animasyonlar yalnızca `transform` ve `opacity` üzerinden GPU hızlandırmalı (`translate3d(0,0,0)`) olarak yürütülür.
* Ekran yenileme hızı 120fps hedefine göre ayarlanmış, dokunmatik hedefler Apple HIG ve Google Material standardı gereği minimum `44×44px` olarak inşa edilmiştir.
