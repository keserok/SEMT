# SEMT — Master Design System (Modern & Sleek Dark Architecture)
> **Version:** 2.0 (Studio Grade — Sleek Urban Minimal)
> **Core Identity:** **"Obsidian Precision & Electric Amber" (Spotify × Linear Vibe)**
> **Framework & Standards:** `ui-ux-pro-max` + `pro-rules.md` (WCAG AA+, 44×44px touch targets, 120fps spring physics, zero-lag gestures)

---

## 1. Tasarım Felsefesi: "Sleek Urban Noir & Fluid Precision"

1. **Hafif, Keskin ve Modern (Cool & Snappy):** Ağır tarihi müze ve nostaljik mühür havası tamamen terk edildi. Linear ve Spotify standardında çağdaş, dinamik bir kentsel sesli rehber deneyimi.
2. **Tek ve Güçlü Kimlik (Zero Theme Bloat):** Karmaşık çoklu tema motorları (Theme A/B/C) yerine; tek, rafine, kusursuz optimize edilmiş derin obsidyen karanlık mod.
3. **Akıcı Jestler ve Sürükleme (Fluid Gestures):** Modalların yerini akıcı alt çekmeceler (interactive bottom sheets), kaydırarak kapatma (swipe-to-dismiss) ve parmak ucu mikro-fizikleri alır.
4. **Hızlı Ödül Mekaniği (Instant Gratification):** 1600ms'lik uzun ve hantal kilit açma törenleri yok. 180-220ms'lik anlık kehribar mikro-patlaması (amber ripple) ve doğrudan ses oynatma.

---

## 2. Renk ve Token Mimarisi (Obsidian & Electric Amber)

Uygulamanın tüm görsel dili tek ve tutarlı bir CSS token sistemi üzerinden çalışır:

```css
:root {
  /* Canvas & Zemin */
  --bg-canvas: #07090E;             /* Derin OLED-dostu obsidyen zemin */
  --bg-surface: rgba(15, 20, 32, 0.78); /* Buzlu cam kartlar ve alt çekmeceler */
  --bg-elevated: rgba(24, 32, 50, 0.88); /* Üst katman yüzen piller ve kontroller */
  --bg-elevated-hover: rgba(34, 45, 70, 0.95);

  /* Cam & Kenarlık Çizgileri */
  --border-subtle: rgba(255, 255, 255, 0.08); /* 1px ultra ince sınır */
  --border-specular: rgba(255, 255, 255, 0.16); /* Üst kenar ışık çizgisi */
  --border-active: rgba(245, 158, 11, 0.5);   /* Aktif odak sınırı */

  /* Tipografi & Kontrast */
  --fg-primary: #F8FAFC;            /* Kristal netliğinde başlık ve metin (15.5:1 kontrast) */
  --fg-secondary: #94A3B8;          /* Mesafe, süre ve meta veriler (6.2:1 kontrast) */
  --fg-muted: #475569;              /* İnaktif ikonlar ve ikincil ipuçları */

  /* Canlı Vurgu Renkleri */
  --accent-primary: #F59E0B;        /* Elektrik Kehribar (Primary CTA, oynatıcı, rota çizgisi) */
  --accent-glow: rgba(245, 158, 11, 0.24); /* Yüzen butonların arkasındaki neon halo */
  --accent-cyan: #06B6D4;           /* Radar nabzı & aktif GPS konumu */
  --accent-emerald: #10B981;        /* Tamamlanan / kilidi açılan duraklar */

  /* Geometri & Bulanıklık */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-pill: 9999px;
  --blur-glass: blur(20px) saturate(180%);
}
```

---

## 3. Tipografi Sistemi: Modern Geometrik Sans-Serif

Nostaljik/ağır tırnaklı (Serif) yazı tipleri tamamen kaldırılmıştır. Tüm arayüz modern, okunabilirliği yüksek sans-serif ailesiyle nefes alır:

- **Başlık & Hero Tipografisi (`--font-display`):** `'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif`
  - Hero Durak / Semt Başlığı: `font-weight: 700`, `letter-spacing: -0.03em`, sıkı ve vurucu.
  - Kart Başlıkları: `font-weight: 600`, `letter-spacing: -0.015em`, `font-size: 1.125rem (18px)`.
- **Gövde Metni & Senkronize Transkript (`--font-sans`):** `'Inter', 'Plus Jakarta Sans', sans-serif`
  - Transkript / Dinleme Metni: `font-size: 1rem (16px)`, `line-height: 1.6`, `font-weight: 400`.
  - UI Butonları ve Etiketler: `font-size: 0.875rem (14px)`, `font-weight: 600`, `letter-spacing: 0.01em`.
- **Koordinat, Sayaç & Teknik Rozetler (`--font-mono`):** `'JetBrains Mono', 'SF Mono', monospace`
  - `font-size: 0.6875rem (11px)`, `letter-spacing: 0.08em`, `text-transform: uppercase`, `tabular-nums`.

---

## 4. Akış, Mikro Fizikler ve Hız Standartları (Snappy Physics)

| Etkileşim | Süre & Eğri | Davranış & Geri Bildirim |
|---|---|---|
| **Hızlı Buton Dokunuşu** | `100ms` in / `180ms` spring out | `transform: scale(0.96)`, anlık `8ms` haptic titreşim (`navigator.vibrate(8)`). Gecikme 0ms. |
| **Yüzen Mini Player Açılışı** | `220ms` `cubic-bezier(0.16, 1, 0.3, 1)` | Harita altından tek hamlede yukarı kayar, haritayı engellemez. |
| **Alt Çekmece (Bottom Sheet)** | Jest tabanlı (swipe to dismiss) | Parmağı takip eden 1:1 sürükleme, bırakıldığında 180ms yay fizikli kapanma. |
| **Durak Kilit Açılışı (Micro-Burst)** | `200ms` anlık mikro animasyon | Uzun mühür/tören yerine: Kilit ikonu anında parlayıp tik işaretine döner, kehribar halka yayılır ve ses çalmaya başlar. |
| **Yakınlık Radarı ("Sıcak-Soğuk")** | `1.2s` yumuşak CSS nabzı | Kullanıcı durağa yaklaştıkça nabız frekansı ve kehribar ışıma yoğunluğu hafifçe artar. Aşırı GPU tüketmez. |

---

## 5. Kritik Bileşen Mimarisi (Cool & Studio Grade)

1. **Yüzen Cam Kontroller (Floating Glass Pills):**
   - Alt navigasyon veya filtre çubukları ekrana yapışık kaba bloklar değildir.
   - Saydam zemin (`--bg-surface`), `1px` ince kenarlık (`--border-subtle`) ve `var(--blur-glass)` ile haritanın üzerinde havada asılı durur.
2. **Spotify Tarzı Yüzen Mini Ses Oynatıcı:**
   - Harita keşfi sırasında altta ince bir hap şeklinde kalır.
   - Durak adı, oynat/durdur butonu, mini dalga boyu (equalizer waveform) ve kalan süre.
   - Dokunulduğunda akıcı şekilde genişleyip hikaye moduna geçer.
3. **Sıfır Donma, Yüksek Performans:**
   - Ağır 3D jiroskop ve sürekli CPU yoran ses döngüleri yerine; temiz CSS donanım hızlandırmalı (`transform: translate3d`) geçişler.
   - Dokunmatik alanlar daima minimum `44×44px`.
   - Çentik ve alt çubuklar için `env(safe-area-inset-bottom)` ve `env(safe-area-inset-top)` desteği.

---

## 6. Stüdyo Görsel / Fotoğraf İstem Kuralları (Modern Urban Aesthetic)

Gelecek semtler, kapak fotoğrafları ve durak illüstrasyonları için:
- **Anahtar Kelimeler:** Modern cinematic twilight, sleek Istanbul urban architecture, wet asphalt reflections, amber street illumination (`#F59E0B`), deep blue evening sky (`#07090E`), Leica Q2 28mm street photography, high-contrast, modern clean composition, no crowd, sharp details, Spotify editorial canvas aesthetic.
