import {
  DISTRICTS,
  NARRATORS,
  STOPS,
  ROUTES,
  PERSONA_QUESTIONS,
  HUB_ROOM,
  STAMPS,
  REWARDS,
  PRICING_TIERS
} from './data/karakoyData.js';
import { SemtMapEngine } from './engine/mapCanvas.js';

class SemtApp {
  constructor() {
    this.theme = 'obsidian';
    this.activeTab = 'kesfet'; // ONLY 'kesfet' or 'ayarlar'
    this.expandedSection = 'rotalar'; // Vertical section inside Ayarlar: 'rotalar' | 'hub' | 'pasaport' | 'cuzdan' | 'gorunum'
    this.explorerMode = 'visitor';
    this.activeDistrict = DISTRICTS[0];
    this.selectedStop = STOPS[1]; // Default: #02 Kamondo Merdivenleri
    this.activeStoryLayer = 'hikaye';
    this.activeNarrator = NARRATORS[0];

    this.isPlayingStory = false;
    this.activeKaraokeIndex = 0;
    this.karaokeTimer = null;
    this.timeMachineSplit = 50;

    this.xp = 1250;
    this.level = 4;
    this.mysteryBoxOpened = false;
    this.personaAnswers = { q1: 'secret' };
    this.hubMode = 'collaborative';
    this.activeReward = REWARDS[0];
    this.qrCountdown = 30;
    this.qrSeed = 1048;
    this.toastTimer = null;

    this.mapEngine = null;
  }

  init() {
    this.bindGlobalControls();
    this.initMap();
    this.renderStopDock();
    this.renderAyarlarVerticalIndex();
    this.startQrTimer();
  }

  initMap() {
    const canvas = document.getElementById('semt-map-canvas');
    if (!canvas) return;
    this.mapEngine = new SemtMapEngine(canvas, {
      stops: STOPS,
      hubMembers: HUB_ROOM.members,
      selectedStopId: this.selectedStop.id,
      theme: this.theme,
      districtAccent: this.activeDistrict.accent,
      onSelectStop: (stop) => {
        this.selectedStop = stop;
        this.renderStopDock();
      }
    });
    this.mapEngine.focusStop(this.selectedStop);
  }

  bindGlobalControls() {
    // 2-Button Bottom Bar: 'kesfet' & 'ayarlar'
    document.querySelectorAll('[data-nav-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.getAttribute('data-nav-tab'));
      });
    });

    // Fog of War Toggle on Map
    document.querySelectorAll('[data-toggle-fog]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fogOn = this.mapEngine.toggleFog();
        document.querySelectorAll('[data-toggle-fog]').forEach((b) => b.classList.toggle('active', !fogOn));
        if (!fogOn) {
          STOPS.forEach((s) => {
            if (s.state === 'hidden') s.state = 'close';
          });
          this.showToast('Keşif Sisi aralandı — Gizli Durak 07 ve 08 haritada açıldı.');
        } else {
          this.showToast('Keşif Sisi aktif edildi.');
        }
        this.renderStopDock();
      });
    });

    // 3D Pitch Toggle
    const pitchBtn = document.getElementById('btn-toggle-pitch');
    if (pitchBtn) {
      pitchBtn.addEventListener('click', () => {
        const is3D = this.mapEngine.togglePitch3D();
        pitchBtn.classList.toggle('active', is3D);
        this.showToast(is3D ? '3B İzometrik Perspektif' : '2B Harita Düzlemi');
      });
    }

    // District Selector
    const districtBtn = document.getElementById('btn-district-selector');
    if (districtBtn) {
      districtBtn.addEventListener('click', () => {
        this.cycleDistrict();
      });
    }
  }

  setTheme(themeName) {
    this.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    if (this.mapEngine) this.mapEngine.setTheme(themeName);
    this.renderAyarlarVerticalIndex();
    this.showToast(
      themeName === 'obsidian'
        ? 'Görünüm: Obsidian & Sıvı Kehribar'
        : 'Görünüm: Editorial Heritage & Bakır'
    );
  }

  cycleDistrict() {
    const idx = DISTRICTS.findIndex((d) => d.id === this.activeDistrict.id);
    const next = DISTRICTS[(idx + 1) % DISTRICTS.length];
    this.activeDistrict = next;
    document.documentElement.style.setProperty('--accent', next.accent);
    document.documentElement.style.setProperty('--accent-glow', next.accentGlow);
    if (this.mapEngine) this.mapEngine.setDistrictAccent(next.accent);
    const nameEl = document.getElementById('hud-district-name');
    if (nameEl) nameEl.textContent = next.name;
    this.showToast(`${next.name} — ${next.atmosphere}`);
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('[data-nav-tab]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-nav-tab') === tabId);
    });
    document.querySelectorAll('.app-screen').forEach((screen) => {
      screen.classList.toggle('active', screen.id === `tab-${tabId}`);
    });
    const topHud = document.getElementById('floating-top-hud');
    if (topHud) {
      topHud.style.opacity = tabId === 'kesfet' ? '1' : '0';
      topHud.style.pointerEvents = tabId === 'kesfet' ? 'none' : 'none';
    }
    if (tabId === 'kesfet' && this.mapEngine) {
      setTimeout(() => this.mapEngine.resize(), 40);
    }
  }

  stepStop(dir) {
    const visible = STOPS.filter((s) => !(s.state === 'hidden' && this.mapEngine && this.mapEngine.fogEnabled));
    const idx = visible.findIndex((s) => s.id === this.selectedStop.id);
    const nextIdx = (idx + dir + visible.length) % visible.length;
    this.selectedStop = visible[nextIdx];
    if (this.mapEngine) {
      this.mapEngine.selectedStopId = this.selectedStop.id;
      this.mapEngine.focusStop(this.selectedStop);
    }
    this.renderStopDock();
  }

  // ==========================================================================
  // SCREEN 1: KEŞFET — EDITORIAL STOP CARD (Zero Oval Badges)
  // ==========================================================================
  renderStopDock() {
    const dock = document.getElementById('stop-floating-dock');
    if (!dock) return;

    const visible = STOPS.filter((s) => !(s.state === 'hidden' && this.mapEngine && this.mapEngine.fogEnabled));
    const currentIndex = Math.max(0, visible.findIndex((s) => s.id === this.selectedStop.id)) + 1;
    const stop = this.selectedStop;
    const hookText = this.explorerMode === 'visitor' ? stop.visitorHook : stop.localHook;
    const isUnlocked = stop.state === 'listened';
    const isPaywall = !stop.isFree && stop.state === 'locked';

    const stateLabel = isUnlocked
      ? 'AÇIK · DİNLENDİ'
      : isPaywall
      ? 'KEŞİF KAPISI'
      : `${stop.distanceMeters}M MESAFEDE`;

    let primaryButton = '';
    if (isUnlocked) {
      primaryButton = `
        <button class="btn-editorial-primary" id="btn-dock-listen">
          <span>HİKÂYEYİ AÇ — ${stop.durationLabel}</span>
        </button>
      `;
    } else if (isPaywall) {
      primaryButton = `
        <button class="btn-editorial-primary" id="btn-dock-paywall">
          <span>KİLİDİ AÇ — SEMT PASS</span>
        </button>
      `;
    } else {
      primaryButton = `
        <button class="btn-editorial-primary" id="btn-dock-walk">
          <span>DURAĞA YÜRÜ & KİLİDİ AÇ</span>
        </button>
      `;
    }

    dock.innerHTML = `
      <div class="dock-editorial-top">
        <div class="dock-step-controls">
          <button class="minimal-arrow-btn" id="dock-prev-stop">←</button>
          <span class="kicker-line">0${currentIndex} / 0${visible.length} — ${stateLabel}</span>
          <button class="minimal-arrow-btn" id="dock-next-stop">→</button>
        </div>

        <div class="lens-text-switch">
          <button class="lens-link ${this.explorerMode === 'visitor' ? 'active' : ''}" data-lens="visitor">GEZGİN</button>
          <button class="lens-link ${this.explorerMode === 'local' ? 'active' : ''}" data-lens="local">YERLİ</button>
        </div>
      </div>

      <div class="dock-editorial-body">
        <div class="dock-numeral">${stop.number}</div>
        <div class="dock-text-col">
          <h3 class="dock-title">${stop.title.split('&')[0].trim()}</h3>
          <p class="dock-hook">${hookText}</p>
        </div>
        <div class="dock-thumb-mini" id="dock-thumb-trigger">
          <img src="${stop.heroImage}" alt="${stop.title}" />
        </div>
      </div>

      <div class="dock-action-bar">
        ${primaryButton}
        <button class="btn-editorial-ghost" id="btn-dock-tm">${stop.archiveYear} ARŞİVİ</button>
      </div>
    `;

    document.getElementById('dock-prev-stop').addEventListener('click', () => this.stepStop(-1));
    document.getElementById('dock-next-stop').addEventListener('click', () => this.stepStop(1));

    dock.querySelectorAll('[data-lens]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.explorerMode = btn.getAttribute('data-lens');
        this.renderStopDock();
      });
    });

    document.getElementById('dock-thumb-trigger').addEventListener('click', () => {
      this.openStoryModal(stop, 'hikaye');
    });

    const listenBtn = document.getElementById('btn-dock-listen');
    if (listenBtn) listenBtn.addEventListener('click', () => this.openStoryModal(stop, 'hikaye'));

    const walkBtn = document.getElementById('btn-dock-walk');
    if (walkBtn) walkBtn.addEventListener('click', () => this.simulateWalkAndUnlock(stop));

    const paywallBtn = document.getElementById('btn-dock-paywall');
    if (paywallBtn) paywallBtn.addEventListener('click', () => this.openPaywallModal(stop));

    const tmBtn = document.getElementById('btn-dock-tm');
    if (tmBtn) tmBtn.addEventListener('click', () => this.openStoryModal(stop, 'derinles'));
  }

  simulateWalkAndUnlock(stop) {
    if (this.mapEngine) this.mapEngine.walkUserToStop(stop);
    this.showToast(`${stop.title.split('&')[0]} konumuna ulaşıldı.`);

    setTimeout(() => {
      stop.state = 'listened';
      stop.distanceMeters = 0;
      this.xp += stop.xpReward;

      const camondoStamp = STAMPS.find((s) => s.id === 'stamp-camondo');
      if (camondoStamp) {
        camondoStamp.unlocked = true;
        camondoStamp.unlockedDate = 'Açıldı · Bugün';
      }

      this.renderStopDock();
      this.renderAyarlarVerticalIndex();
      this.openUnlockCeremonyModal(stop);
    }, 550);
  }

  openUnlockCeremonyModal(stop) {
    const modal = document.getElementById('ceremony-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="editorial-top-meta">DURAK ${stop.number} AÇILDI — +${stop.xpReward} XP</div>
      <div style="font-family: var(--font-serif); font-style: italic; font-size: 64px; color: var(--accent-light); line-height: 1; margin: 10px 0;">
        ${stop.number}
      </div>
      <h2 style="font-family: var(--font-serif); font-size: 30px; font-weight: 700;">${stop.title}</h2>
      <p style="font-size: 13px; color: var(--text-secondary); max-width: 290px; margin-top: 10px; line-height: 1.55;">
        Durak kilidi açıldı ve semt mührün Pasaport dizinine kaydedildi.
      </p>
      <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 280px; margin-top: 26px;">
        <button class="btn-editorial-primary" id="ceremony-listen-btn" style="width: 100%; flex: none;">
          HİKÂYEYİ AÇ
        </button>
        <button class="btn-editorial-ghost" id="ceremony-close-btn" style="width: 100%;">
          HARİTAYA DÖN
        </button>
      </div>
    `;

    modal.classList.add('open');

    document.getElementById('ceremony-listen-btn').addEventListener('click', () => {
      modal.classList.remove('open');
      this.openStoryModal(stop, 'hikaye');
    });
    document.getElementById('ceremony-close-btn').addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  openPaywallModal(stop) {
    const modal = document.getElementById('ceremony-modal');
    if (!modal) return;

    const rowsHtml = PRICING_TIERS.map(
      (t) => `
      <div class="editorial-surface-card" style="text-align: left; border-color: ${
        t.recommended ? 'var(--line-accent)' : 'var(--line-hairline)'
      };">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="editorial-top-meta" style="margin: 0;">${t.badge}</span>
          <span style="font-family: var(--font-mono); font-size: 15px; font-weight: 700; color: var(--accent-light);">${t.priceEur}</span>
        </div>
        <div style="font-family: var(--font-serif); font-size: 21px; font-weight: 700; margin-top: 4px;">${t.name}</div>
        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 3px;">${t.subtitle}</div>
      </div>
    `
    ).join('');

    modal.innerHTML = `
      <div style="width: 100%; max-width: 348px; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="editorial-top-meta" style="margin: 0;">DURAK ${stop.number} — KEŞİF KAPISI</span>
          <button class="minimal-arrow-btn" id="paywall-close-x">✕</button>
        </div>
        <h2 style="font-family: var(--font-serif); font-size: 27px; text-align: left;">${stop.title}</h2>
        <p style="font-size: 12.5px; color: var(--text-secondary); text-align: left; line-height: 1.5; margin-bottom: 6px;">
          İlk 2 durağı ücretsiz tamamladın. Bankalar Caddesi ve tüm semt arşivini açmak için bir erişim modeli seç:
        </p>
        ${rowsHtml}
        <button class="btn-editorial-primary" id="btn-demo-unlock-all" style="width: 100%; flex: none; margin-top: 4px;">
          PROTOTİP TESTİ — TÜM KİLİTLERİ AÇ
        </button>
      </div>
    `;

    modal.classList.add('open');
    document.getElementById('paywall-close-x').addEventListener('click', () => modal.classList.remove('open'));
    document.getElementById('btn-demo-unlock-all').addEventListener('click', () => {
      STOPS.forEach((s) => {
        s.isFree = true;
        if (s.state === 'locked') s.state = 'close';
      });
      REWARDS.forEach((r) => (r.isUnlocked = true));
      modal.classList.remove('open');
      this.simulateWalkAndUnlock(stop);
    });
  }

  // ==========================================================================
  // 3-LAYER STORY SHEET (Öz / Hikâye / Derinleş — Zero Oval Pills)
  // ==========================================================================
  openStoryModal(stop, initialLayer = 'hikaye') {
    this.selectedStop = stop;
    this.activeStoryLayer = initialLayer;
    this.activeKaraokeIndex = 0;

    const modal = document.getElementById('story-modal');
    if (!modal) return;
    modal.classList.add('open');
    this.renderStorySheet();
  }

  closeStoryModal() {
    this.stopStoryPlayback();
    const modal = document.getElementById('story-modal');
    if (modal) modal.classList.remove('open');
  }

  renderStorySheet() {
    const modal = document.getElementById('story-modal');
    if (!modal) return;

    const stop = this.selectedStop;
    const layer = this.activeStoryLayer;
    let bodyHtml = '';

    if (layer === 'oz') {
      const bullets = stop.oz
        .map(
          (text, i) => `
          <div class="editorial-block" style="display: flex; gap: 16px; align-items: baseline;">
            <span style="font-family: var(--font-serif); font-style: italic; font-size: 24px; color: var(--accent-light);">0${i + 1}</span>
            <p style="font-size: 14.5px; line-height: 1.6; color: var(--text-primary);">${text}</p>
          </div>
        `
        )
        .join('');

      bodyHtml = `
        <div class="editorial-surface-card" style="border-left: 2px solid var(--accent-cyan);">
          <div class="editorial-top-meta" style="color: var(--accent-cyan);">
            ŞİMDİ BAK — ${stop.lookNowPrompt.heading}
          </div>
          <p style="font-size: 13.5px; line-height: 1.55; color: var(--text-primary);">
            ${stop.lookNowPrompt.instruction}
          </p>
        </div>
        ${bullets}
        <button class="btn-editorial-primary" id="btn-oz-to-hikaye" style="width: 100%; margin-top: 12px;">
          HİKÂYE METNİNE GEÇ — ${stop.durationLabel}
        </button>
      `;
    } else if (layer === 'hikaye') {
      const narratorsHtml = NARRATORS.map(
        (n) => `
          <button class="lens-link ${n.id === this.activeNarrator.id ? 'active' : ''}" data-narrator="${n.id}">
            ${n.name}
          </button>
        `
      ).join('');

      const linesHtml = stop.hikaye
        .map(
          (line, idx) => `
          <div class="transcript-item ${idx === this.activeKaraokeIndex ? 'active' : ''}" data-line-idx="${idx}">
            <div class="editorial-top-meta" style="margin-bottom: 4px;">
              ${line.time} — ${this.activeNarrator.name}
            </div>
            <div>“${line.text}”</div>
          </div>
        `
        )
        .join('');

      bodyHtml = `
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid var(--line-hairline); margin-bottom: 8px;">
          <div style="display: flex; gap: 14px;">${narratorsHtml}</div>
          <button class="btn-editorial-ghost" id="btn-story-play" style="height: 32px; padding: 0 12px;">
            ${this.isPlayingStory ? 'DURAKLAT' : 'AKIŞI BAŞLAT'}
          </button>
        </div>
        ${linesHtml}
      `;
    } else if (layer === 'derinles') {
      bodyHtml = `
        <div class="editorial-top-meta">
          ZAMAN MAKİNESİ — ${stop.archiveYear} ARŞİVİ VE 2026 KARŞILAŞTIRMASI
        </div>

        <div class="tm-container">
          <img src="${stop.heroImage}" alt="2026" />
          <div class="tm-before-clip" id="tm-clip" style="width: ${this.timeMachineSplit}%;">
            <img src="${stop.archiveImage}" alt="${stop.archiveYear}" />
          </div>
          <div class="tm-handle-circle" id="tm-handle" style="left: ${this.timeMachineSplit}%;">↔</div>
          <input type="range" min="5" max="95" value="${this.timeMachineSplit}" class="tm-range" id="tm-slider" />
        </div>

        <div class="editorial-block">
          <div class="editorial-top-meta">MİMARİ & STRÜKTÜREL NOT</div>
          <p style="font-size: 14px; line-height: 1.6;">${stop.derinles.architecturalNote}</p>
        </div>

        <div class="editorial-block">
          <div class="editorial-top-meta" style="color: var(--accent-cyan);">ARŞİV KAYDI</div>
          <p style="font-size: 14px; line-height: 1.6;">${stop.derinles.secretFact}</p>
        </div>
      `;
    }

    modal.innerHTML = `
      <div class="sheet-hero">
        <img src="${stop.heroImage}" alt="${stop.title}" />
        <div class="sheet-hero-gradient"></div>
        <div class="sheet-top-actions">
          <button class="square-glass-btn" id="btn-close-sheet">←</button>
          <span class="kicker-line" style="background: rgba(5,7,14,0.75); padding: 6px 10px; border-radius: 6px;">${stop.era}</span>
        </div>
        <div class="sheet-hero-caption">
          <div class="editorial-top-meta">DURAK ${stop.number}</div>
          <h2>${stop.title}</h2>
        </div>
      </div>

      <div class="editorial-layer-tabs">
        <button class="ed-tab-btn ${layer === 'oz' ? 'active' : ''}" data-layer="oz">01 ÖZ</button>
        <button class="ed-tab-btn ${layer === 'hikaye' ? 'active' : ''}" data-layer="hikaye">02 HİKÂYE</button>
        <button class="ed-tab-btn ${layer === 'derinles' ? 'active' : ''}" data-layer="derinles">03 DERİNLEŞ (${stop.archiveYear})</button>
      </div>

      <div class="sheet-scroll-body">${bodyHtml}</div>
    `;

    document.getElementById('btn-close-sheet').addEventListener('click', () => this.closeStoryModal());

    modal.querySelectorAll('[data-layer]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeStoryLayer = btn.getAttribute('data-layer');
        this.renderStorySheet();
      });
    });

    const ozBtn = document.getElementById('btn-oz-to-hikaye');
    if (ozBtn) {
      ozBtn.addEventListener('click', () => {
        this.activeStoryLayer = 'hikaye';
        this.renderStorySheet();
        this.toggleStoryPlayback();
      });
    }

    modal.querySelectorAll('[data-narrator]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const found = NARRATORS.find((n) => n.id === btn.getAttribute('data-narrator'));
        if (found) {
          this.activeNarrator = found;
          this.renderStorySheet();
        }
      });
    });

    const playBtn = document.getElementById('btn-story-play');
    if (playBtn) playBtn.addEventListener('click', () => this.toggleStoryPlayback());

    modal.querySelectorAll('[data-line-idx]').forEach((el) => {
      el.addEventListener('click', () => {
        this.activeKaraokeIndex = parseInt(el.getAttribute('data-line-idx'), 10);
        this.renderStorySheet();
      });
    });

    const slider = document.getElementById('tm-slider');
    const clip = document.getElementById('tm-clip');
    const handle = document.getElementById('tm-handle');
    if (slider && clip && handle) {
      slider.addEventListener('input', (e) => {
        this.timeMachineSplit = e.target.value;
        clip.style.width = `${this.timeMachineSplit}%`;
        handle.style.left = `${this.timeMachineSplit}%`;
      });
    }
  }

  toggleStoryPlayback() {
    if (this.isPlayingStory) {
      this.stopStoryPlayback();
      this.renderStorySheet();
      return;
    }
    this.isPlayingStory = true;
    this.karaokeTimer = setInterval(() => {
      const lines = this.selectedStop.hikaye;
      if (this.activeKaraokeIndex < lines.length - 1) {
        this.activeKaraokeIndex++;
        this.renderStorySheet();
      } else {
        this.stopStoryPlayback();
        this.renderStorySheet();
      }
    }, 4200);
    this.renderStorySheet();
  }

  stopStoryPlayback() {
    this.isPlayingStory = false;
    if (this.karaokeTimer) {
      clearInterval(this.karaokeTimer);
      this.karaokeTimer = null;
    }
  }

  // ==========================================================================
  // SCREEN 2: AYARLAR — VERTICAL STACK OF ROTALAR, HUB, PASAPORT, CÜZDAN
  // (Zero Oval Capsules, Pure Editorial Typography)
  // ==========================================================================
  renderAyarlarVerticalIndex() {
    const container = document.getElementById('tab-ayarlar');
    if (!container) return;

    // 01 Rotalar Content (Zero oval badges!)
    const q1Obj = PERSONA_QUESTIONS[0].options.find((o) => o.id === this.personaAnswers.q1);
    const personaName = q1Obj ? q1Obj.tag : 'Gizem Avcısı';

    const routesHtml = ROUTES.map(
      (r, idx) => `
      <div class="editorial-block">
        <div class="editorial-top-meta">0${idx + 1} — ${r.type} · ${r.duration} · ${r.stopsCount} DURAK</div>
        <h3 style="font-family: var(--font-serif); font-size: 23px; font-weight: 700; margin-top: 2px;">${r.title}</h3>
        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-top: 4px;">${r.subtitle}</p>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px;">
          <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${r.priceTag}</span>
          <button class="btn-editorial-ghost" data-launch-route="${r.id}" style="height: 34px; padding: 0 12px;">
            HARİTADA BAŞLAT →
          </button>
        </div>
      </div>
    `
    ).join('');

    const personaLinks = PERSONA_QUESTIONS[0].options
      .map(
        (opt) => `
        <button class="lens-link ${this.personaAnswers.q1 === opt.id ? 'active' : ''}" data-persona="${opt.id}">
          ${opt.tag}
        </button>
      `
      )
      .join('');

    const rotalarBody = `
      <div class="editorial-surface-card">
        <div class="editorial-top-meta">KAŞİF DNA’SI — KİŞİSEL ROTA TONU</div>
        <div style="font-family: var(--font-serif); font-size: 22px; margin-top: 2px;">${personaName}</div>
        <div style="display: flex; gap: 16px; margin-top: 10px;">${personaLinks}</div>
      </div>
      ${routesHtml}
    `;

    // 02 HUB Content
    const membersHtml = HUB_ROOM.members
      .map(
        (m, i) => `
        <div style="display: flex; align-items: baseline; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--line-hairline);">
          <div>
            <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-light); margin-right: 8px;">0${i + 1}</span>
            <strong style="font-size: 14px;">${m.name}</strong>
            <div style="font-size: 11.5px; color: var(--text-secondary); margin-top: 2px; padding-left: 24px;">
              ${m.distance} — Pil %${m.battery}
            </div>
          </div>
          <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);">
            ${this.hubMode === 'competitive' ? `${m.points} XP` : m.status}
          </span>
        </div>
      `
      )
      .join('');

    const hubBody = `
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
        <div class="editorial-top-meta">ODA KODU: ${HUB_ROOM.code} — 4 KAŞİF AKTİF</div>
        <div style="display: flex; gap: 12px;">
          <button class="lens-link ${this.hubMode === 'collaborative' ? 'active' : ''}" data-hub-mode="collaborative">KOLEKTİF</button>
          <button class="lens-link ${this.hubMode === 'competitive' ? 'active' : ''}" data-hub-mode="competitive">SKOR</button>
        </div>
      </div>
      ${membersHtml}
      <div style="display: flex; gap: 8px; margin-top: 14px;">
        <button class="btn-editorial-primary" id="btn-hub-ptt">ODAYA KONUM & MESAJ GÖNDER</button>
      </div>
    `;

    // 03 Pasaport Content
    const stampsHtml = STAMPS.map(
      (st) => `
      <div class="editorial-surface-card" style="opacity: ${st.unlocked ? '1' : '0.45'};">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="editorial-top-meta" style="margin: 0;">${st.district} — ${st.year}</span>
          <span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-light);">
            ${st.unlocked ? 'AÇIK MÜHÜR' : 'KİLİTLİ'}
          </span>
        </div>
        <div style="font-family: var(--font-serif); font-size: 22px; font-weight: 700; margin-top: 4px;">${st.title}</div>
        <div style="font-family: var(--font-mono); font-size: 10.5px; color: var(--text-secondary); margin-top: 6px;">
          ${st.edition} · ${st.unlockedDate}
        </div>
      </div>
    `
    ).join('');

    const pasaportBody = `
      <div style="margin-bottom: 14px;">
        <div class="editorial-top-meta">SEVİYE 0${this.level} — ${this.xp} XP · ${STAMPS.filter((s) => s.unlocked).length}/${STAMPS.length} MÜHÜR</div>
        <div style="height: 2px; background: var(--line-strong); margin-top: 8px;">
          <div style="width: 75%; height: 100%; background: var(--accent);"></div>
        </div>
      </div>
      ${stampsHtml}
    `;

    // 04 Cüzdan Content
    const rew = this.activeReward;
    const qrSvg = this.generateDynamicQrSvg(this.qrSeed);

    const cuzdanBody = `
      <div class="editorial-surface-card" style="border-color: var(--line-accent);">
        <div class="editorial-top-meta">${rew.type} — ${rew.rating}</div>
        <h3 style="font-family: var(--font-serif); font-size: 23px; font-weight: 700; margin-top: 4px;">${rew.title}</h3>
        <p style="font-size: 12.5px; color: var(--text-secondary); margin-top: 4px;">${rew.partnerName} · ${rew.location}</p>

        <div style="border-top: 1px dashed var(--line-strong); margin: 14px 0;"></div>

        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="background: #FFF; padding: 8px; border-radius: 10px; width: 96px; height: 96px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
            ${qrSvg}
          </div>
          <div>
            <div class="editorial-top-meta" style="color: var(--accent-emerald);">
              CANLI QR KOD <span id="qr-countdown-label">(${this.qrCountdown}SN)</span>
            </div>
            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
              Esnaf Doğrulama PIN Kodu:
            </div>
            <div style="font-family: var(--font-mono); font-size: 20px; font-weight: 700; letter-spacing: 0.2em; color: var(--text-primary); margin-top: 4px;">
              ${rew.pinCode}
            </div>
          </div>
        </div>
      </div>

      <div class="editorial-block" style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div class="editorial-top-meta">SÜRPRİZ DENEYİM KUTUSU</div>
          <div style="font-family: var(--font-serif); font-size: 20px;">
            ${this.mysteryBoxOpened ? 'Galata Simit & Çay İkramı Eklendi' : 'Karaköy Sürpriz Kutusunu Aç'}
          </div>
        </div>
        <button class="btn-editorial-ghost" id="btn-mystery-box">
          ${this.mysteryBoxOpened ? 'AÇILDI' : 'KUTUYU AÇ'}
        </button>
      </div>
    `;

    // 05 Görünüm (Theme Switcher)
    const gorunumBody = `
      <div style="display: flex; gap: 10px; margin-top: 6px;">
        <button class="${this.theme === 'obsidian' ? 'btn-editorial-primary' : 'btn-editorial-ghost'}" data-set-theme="obsidian" style="flex: 1;">
          OBSIDIAN & AMBER
        </button>
        <button class="${this.theme === 'heritage' ? 'btn-editorial-primary' : 'btn-editorial-ghost'}" data-set-theme="heritage" style="flex: 1;">
          HERITAGE & BAKIR
        </button>
      </div>
    `;

    const sections = [
      { id: 'rotalar', num: '01', name: 'Rotalar', sub: 'Küratörlü yürüyüşler, gizem görevleri ve Kaşif DNA’sı', body: rotalarBody },
      { id: 'hub', num: '02', name: 'HUB', sub: `Canlı grup odası · ${HUB_ROOM.code} · 4 aktif kaşif`, body: hubBody },
      { id: 'pasaport', num: '03', name: 'Pasaport', sub: `Semt mühürleri ve koleksiyon · Seviye 0${this.level}`, body: pasaportBody },
      { id: 'cuzdan', num: '04', name: 'Cüzdan', sub: 'Deneyim kuponları, dinamik QR ve esnaf PIN kodu', body: cuzdanBody },
      { id: 'gorunum', num: '05', name: 'Atmosfer & Tema', sub: 'Obsidian Gece veya Editorial Heritage görünümü', body: gorunumBody }
    ];

    const listHtml = sections
      .map((sec) => {
        const isExp = this.expandedSection === sec.id;
        return `
          <div class="vertical-index-item ${isExp ? 'expanded' : ''}">
            <button class="vertical-index-trigger" data-expand-sec="${sec.id}">
              <div class="index-left">
                <span class="index-num">${sec.num}</span>
                <div>
                  <span class="index-name">${sec.name}</span>
                  <span class="index-sub">${sec.sub}</span>
                </div>
              </div>
              <span class="index-indicator">→</span>
            </button>
            <div class="vertical-index-body">${sec.body}</div>
          </div>
        `;
      })
      .join('');

    container.innerHTML = `
      <div class="ayarlar-container">
        <div class="editorial-top-meta">SEMT DİZİNİ — KARAKÖY · GALATA</div>
        <h1 class="editorial-page-title">Keşif & Hesap</h1>

        <div class="vertical-index-list">
          ${listHtml}
        </div>
      </div>
    `;

    // Bind vertical section accordion triggers
    container.querySelectorAll('[data-expand-sec]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.getAttribute('data-expand-sec');
        this.expandedSection = this.expandedSection === secId ? '' : secId;
        this.renderAyarlarVerticalIndex();
      });
    });

    // Bind Rotalar actions
    container.querySelectorAll('[data-persona]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.personaAnswers.q1 = btn.getAttribute('data-persona');
        this.renderAyarlarVerticalIndex();
      });
    });

    container.querySelectorAll('[data-launch-route]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.switchTab('kesfet');
        this.showToast('Rota haritaya yüklendi.');
      });
    });

    // Bind HUB actions
    container.querySelectorAll('[data-hub-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.hubMode = btn.getAttribute('data-hub-mode');
        this.renderAyarlarVerticalIndex();
      });
    });

    const pttBtn = document.getElementById('btn-hub-ptt');
    if (pttBtn) {
      pttBtn.addEventListener('click', () => {
        this.showToast('Grup odasına (4K7-29B) konum sinyali gönderildi.');
      });
    }

    // Bind Cüzdan Mystery Box
    const boxBtn = document.getElementById('btn-mystery-box');
    if (boxBtn) {
      boxBtn.addEventListener('click', () => {
        if (!this.mysteryBoxOpened) {
          this.mysteryBoxOpened = true;
          this.renderAyarlarVerticalIndex();
          this.showToast('Galata Simit & Çay ikram kuponu cüzdana eklendi.');
        }
      });
    }

    // Bind Theme buttons
    container.querySelectorAll('[data-set-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.setTheme(btn.getAttribute('data-set-theme'));
      });
    });
  }

  generateDynamicQrSvg(seed) {
    const size = 9;
    let rects = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const isCorner = (r < 2 && c < 2) || (r < 2 && c >= size - 2) || (r >= size - 2 && c < 2);
        if ((r * 13 + c * 7 + seed) % 3 === 0 || isCorner) {
          rects += `<rect x="${c * 10}" y="${r * 10}" width="8.5" height="8.5" rx="1" fill="#05070E"/>`;
        }
      }
    }
    return `<svg viewBox="0 0 90 90" width="80" height="80">${rects}</svg>`;
  }

  startQrTimer() {
    setInterval(() => {
      if (!document.body.classList.contains('pwa-modal-open')) return;
      this.qrCountdown--;
      if (this.qrCountdown <= 0) {
        this.qrCountdown = 30;
        this.qrSeed += 7;
        if (this.activeTab === 'ayarlar' && this.expandedSection === 'cuzdan') {
          this.renderAyarlarVerticalIndex();
        }
      }
      const el = document.getElementById('qr-countdown-label');
      if (el) el.textContent = `(${this.qrCountdown}SN)`;
    }, 1000);
  }

  showToast(message) {
    const toast = document.getElementById('floating-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }
}

