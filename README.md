# SEMT — İstanbul’un Görünmeyen Katmanları

> **Küratörlü Mimari ve Kültür Rotaları · Mekânsal Ses ve Çevrimdışı Seyahat Rehberi**  
> *Awwwards SOTD & Studio-grade Editorial Web Portal + Mobile Field PWA*

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100-success?style=for-the-badge&logo=lighthouse)](https://semt-istanbul.com)
[![Schema.org](https://img.shields.io/badge/Schema.org-Verified-blue?style=for-the-badge)](https://schema.org)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-gold?style=for-the-badge)](https://web.dev/progressive-web-apps/)

---

## 🏛️ Proje Özeti

**SEMT**, klasik turistik klişelerden ve yüzeysel rehberlerden uzak; Ceneviz surları, Levanten sarayları, Bizans sarnıçları ve yaşayan bohem mahallelerin tarihini, mimarisini ve ruhunu estetik bir editoryal deneyimle sunan yeni nesil bir kültür-turizm platformudur.

* **Editoryal Lüks Tasarım:** Condé Nast Traveler / Monocle standardında tipografi, mikro-etkileşimler ve sıfır emoji kuralı (`ui-ux-pro-max`).
* **Küratörlü Rota Deneyimi:** Her rotada 4'lü Hap Bilgi Şeridi (*İdeal Işık & Saat, Bütçe & Ulaşım, Yürüyüş & Efor, Fotoğrafçı Kadrajı*).
* **Çevrimdışı Seyahat Kartı & A4 Baskı Modu:** Hücresel verinin çekmediği sarnıçlarda veya yurt dışı gezilerinde kullanılmak üzere tasarlanmış A4 / Mobil seyahat kartı ve yazdırma şablonu.
* **Mekânsal Ses & 3B Saha Haritası:** Her durak için özel akorlar, akustik Boğaz ambiyansı ve interaktif harita projeksiyonu.
* **Çifte Analitik Altyapısı:** Google Analytics 4 (GA4) ve Vercel Web Analytics ile derinlemesine etkileşim ölçümü.

---

## 🧭 Küratörlü Rotalar

1. **Karaköy · Galata:** Kamondo Merdivenleri, Levanten Sarayları & SALT Galata
2. **Fener · Balat:** Sabah 07:30 Altın Saat, Kırmızı Mektep & Tarihi Fırınlar
3. **Moda · Kadıköy:** 1.50€ Şehir Hatları Vapuruyla Gün Batımı & İskele Kütüphanesi
4. **Tarihi Yarımada:** 1600 Yıllık Şerefiye Sarnıcı & Süleymaniye Gizli Terası
5. **Kuzguncuk:** Bostan Çıkmazı, Çınaraltı Çay Bahçesi & Musevi Sinagogu Aksı
6. **Nişantaşı · Teşvikiye:** 19. Yüzyıl Art Nouveau Apartmanları & Narmanlı Han Mirası

---

## ⚡ Hızlı Başlangıç

### Gereksinimler
* Node.js (v18 veya üzeri)

### Kurulum ve Çalıştırma
```bash
# Bağımlılık gerektirmez (Native Vanilla ES2026)
npm start
# http://127.0.0.1:3456 adresinden yayında!
```

### Derleme (Build & Bundle)
```bash
npm run build
```

### Vercel ile Canlıya Alma
```bash
npm run deploy
```

---

## 📊 Analitik & Etkileşim Takibi

Site şu editoryal etkileşimleri gerçek zamanlı olarak ölçer:
* `route_view`: İncelenen rota detayları
* `offline_pass_open`: Çevrimdışı kart görüntülemeleri
* `offline_pass_print`: PDF ve A4 yazdırma dönüşümleri
* `offline_pass_copy`: Durak listesi kopyalamaları (WhatsApp / Notes)
* `audio_stop_play`: Dinlenen durak sesli hikâyeleri
* `route_share`: Sosyal ve panoya paylaşım etkinlikleri

---

## 📄 Lisans
SEMT Spatial Studio © 2026. Tüm hakları saklıdır.
