// SEMT v4.0 — Hybrid Real-World Cartographic Engine (Leaflet Real Istanbul Tiles + High-Detail Cartographic Canvas)
// In Chrome: Renders real street-by-street Istanbul tiles with custom neighborhood character shaders & smooth flyTo.
// In Offline/Side-Pane: Renders high-contrast architectural cartography of Karaköy-Galata with real street names & parcels.

export class SemtMapEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stops = options.stops || [];
    this.selectedStopId = options.selectedStopId || 'stop-2';
    this.onSelectStop = options.onSelectStop || (() => {});
    this.theme = options.theme || 'obsidian';
    this.district = options.district || null;
    this.districtAccent = (options.district && options.district.accent) || '#F59E0B';
    this.fogEnabled = false;
    this.pitch3D = true;

    this.userPos = { x: 0.44, y: 0.48, lat: 41.0238, lng: 28.9739 };
    this.targetUserPos = { x: 0.44, y: 0.48, lat: 41.0238, lng: 28.9739 };

    this.cam = { x: 0, y: 0, zoom: 1.0, targetX: 0, targetY: 0, targetZoom: 1.0 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.pointerMoved = false;
    this.time = 0;

    this.leafletMap = null;
    this.leafletMarkers = [];
    this.routeLine = null;
    this.userMarker = null;

    // Dense, realistic Karaköy urban blocks for the architectural canvas layer
    this.urbanParcels = [
      // Galata Tower Surroundings
      { x: 0.24, y: 0.16, w: 0.08, d: 0.05, h: 18, label: '' },
      { x: 0.35, y: 0.14, w: 0.09, d: 0.05, h: 20, label: '' },
      { x: 0.47, y: 0.18, w: 0.08, d: 0.05, h: 17, label: '' },
      // Serdar-ı Ekrem & Tatar Beyi
      { x: 0.22, y: 0.26, w: 0.08, d: 0.055, h: 22, label: '' },
      { x: 0.44, y: 0.28, w: 0.10, d: 0.055, h: 24, label: 'SERDAR-I EKREM' },
      { x: 0.58, y: 0.30, w: 0.09, d: 0.05, h: 19, label: '' },
      // Kart Çınar & St. Pierre
      { x: 0.21, y: 0.38, w: 0.09, d: 0.06, h: 21, label: '' },
      { x: 0.34, y: 0.37, w: 0.08, d: 0.055, h: 25, label: '' },
      { x: 0.53, y: 0.40, w: 0.10, d: 0.055, h: 26, label: '' },
      { x: 0.67, y: 0.38, w: 0.09, d: 0.05, h: 20, label: '' },
      // Bankalar Caddesi (Voyvoda) Grand Blocks
      { x: 0.18, y: 0.50, w: 0.09, d: 0.06, h: 20, label: 'PERŞEMBE PAZARI' },
      { x: 0.31, y: 0.52, w: 0.08, d: 0.055, h: 28, label: '' },
      { x: 0.50, y: 0.53, w: 0.11, d: 0.06, h: 30, label: 'BANKALAR CD.' },
      { x: 0.65, y: 0.51, w: 0.10, d: 0.06, h: 26, label: '' },
      // Kemankeş & Waterfront Warehouses
      { x: 0.34, y: 0.64, w: 0.10, d: 0.055, h: 18, label: '' },
      { x: 0.48, y: 0.65, w: 0.11, d: 0.055, h: 20, label: 'KEMANKEŞ CD.' },
      { x: 0.64, y: 0.63, w: 0.10, d: 0.055, h: 22, label: '' },
      { x: 0.77, y: 0.52, w: 0.09, d: 0.055, h: 19, label: 'TOPHANE' }
    ];

    this.initRealMapIfAvailable();
    this.bindEvents();
    this.resize();
    this.start();
  }

  initRealMapIfAvailable() {
    const mapDiv = document.getElementById('real-leaflet-map');
    if (!mapDiv || typeof window.L === 'undefined') return;

    try {
      mapDiv.style.display = 'block';
      this.leafletMap = window.L.map('real-leaflet-map', {
        zoomControl: false,
        attributionControl: false,
        center: [41.0241, 28.9745],
        zoom: 16.2
      });

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.leafletMap);

      this.renderLeafletOverlays();
    } catch (_) {
      this.leafletMap = null;
    }
  }

  renderLeafletOverlays() {
    if (!this.leafletMap || typeof window.L === 'undefined') return;

    // Clear old markers & route
    this.leafletMarkers.forEach((m) => m.remove());
    this.leafletMarkers = [];
    if (this.routeLine) this.routeLine.remove();
    if (this.userMarker) this.userMarker.remove();

    const latLngs = this.stops.map((s) => [s.coords.lat, s.coords.lng]);

    // Glowing Route Polyline
    this.routeLine = window.L.polyline(latLngs, {
      color: this.districtAccent,
      weight: 3.5,
      opacity: 0.88,
      dashArray: '8, 8'
    }).addTo(this.leafletMap);

    // Custom HTML Stop Pins
    this.stops.forEach((stop) => {
      const isSelected = stop.id === this.selectedStopId;
      const isDone = stop.state === 'listened';
      const borderCol = isDone ? '#10B981' : isSelected ? '#FBBF24' : 'rgba(255,255,255,0.45)';
      const bgCol = isDone ? '#064E3B' : isSelected ? '#B45309' : '#0F172A';
      const size = isSelected ? 38 : 30;

      const html = `
        <div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${bgCol};
          border: 2.5px solid ${borderCol};
          color: #FFFFFF;
          font-family: 'JetBrains Mono', monospace;
          font-size: ${isSelected ? '13px' : '11px'};
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0,0,0,0.75), ${isSelected ? `0 0 22px ${this.districtAccent}` : 'none'};
          transition: transform 0.25s;
        ">
          ${stop.number}
          ${
            isSelected
              ? `<div style="
                  position: absolute;
                  bottom: ${size + 6}px;
                  left: 50%;
                  transform: translateX(-50%);
                  white-space: nowrap;
                  background: rgba(9, 14, 26, 0.95);
                  border: 1px solid ${borderCol};
                  color: #FFFFFF;
                  font-family: 'Plus Jakarta Sans', sans-serif;
                  font-size: 12px;
                  font-weight: 700;
                  padding: 4px 10px;
                  border-radius: 8px;
                  box-shadow: 0 8px 20px rgba(0,0,0,0.8);
                ">${stop.shortTitle}</div>`
              : ''
          }
        </div>
      `;

      const icon = window.L.divIcon({
        className: 'semt-custom-pin',
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = window.L.marker([stop.coords.lat, stop.coords.lng], { icon })
        .addTo(this.leafletMap)
        .on('click', () => {
          this.selectedStopId = stop.id;
          this.focusStop(stop);
          this.onSelectStop(stop);
          this.renderLeafletOverlays();
        });

      this.leafletMarkers.push(marker);
    });

    // User Live GPS Beacon
    const userHtml = `
      <div style="
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #38BDF8;
        border: 3px solid #FFFFFF;
        box-shadow: 0 0 18px #38BDF8;
      "></div>
    `;
    this.userMarker = window.L.marker([this.userPos.lat, this.userPos.lng], {
      icon: window.L.divIcon({
        className: 'semt-user-beacon',
        html: userHtml,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })
    }).addTo(this.leafletMap);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.pointerMoved = false;
      this.dragStart = { x: e.clientX - this.cam.targetX, y: e.clientY - this.cam.targetY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStart.x - this.cam.targetX;
      const dy = e.clientY - this.dragStart.y - this.cam.targetY;
      if (Math.hypot(dx, dy) > 5) this.pointerMoved = true;
      this.cam.targetX = Math.max(-130, Math.min(130, e.clientX - this.dragStart.x));
      this.cam.targetY = Math.max(-130, Math.min(130, e.clientY - this.dragStart.y));
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (!this.pointerMoved) this.handleTap(e);
    });
  }

  handleTap(e) {
    const rect = this.canvas.getBoundingClientRect();
    const tx = e.clientX - rect.left;
    const ty = e.clientY - rect.top;

    let closest = null;
    let minDist = 38;
    for (const stop of this.stops) {
      const pt = this.projectPoint(stop.mapPos.x, stop.mapPos.y);
      const d = Math.hypot(tx - pt.x, ty - pt.y);
      if (d < minDist) {
        minDist = d;
        closest = stop;
      }
    }

    if (closest) {
      this.selectedStopId = closest.id;
      this.focusStop(closest);
      this.onSelectStop(closest);
    }
  }

  focusStop(stop) {
    if (!stop) return;
    this.selectedStopId = stop.id;
    const w = this.width || 400;
    const h = this.height || 800;
    this.cam.targetX = (0.5 - stop.mapPos.x) * w * 0.36;
    this.cam.targetY = (0.4 - stop.mapPos.y) * h * 0.32;

    if (this.leafletMap && stop.coords) {
      this.leafletMap.flyTo([stop.coords.lat - 0.0007, stop.coords.lng], 16.6, {
        animate: true,
        duration: 0.85
      });
      this.renderLeafletOverlays();
    }
  }

  walkUserToStop(stop) {
    if (!stop) return;
    this.targetUserPos = {
      x: stop.mapPos.x - 0.01,
      y: stop.mapPos.y + 0.012,
      lat: stop.coords.lat - 0.00015,
      lng: stop.coords.lng + 0.00015
    };
    this.userPos.lat = this.targetUserPos.lat;
    this.userPos.lng = this.targetUserPos.lng;
    this.focusStop(stop);
  }

  setTheme(themeName) {
    this.theme = themeName;
  }

  setDistrict(districtObj) {
    this.district = districtObj;
    this.districtAccent = districtObj.accent;
    const mapDiv = document.getElementById('real-leaflet-map');
    if (mapDiv && districtObj.mapFilter) {
      mapDiv.style.filter = districtObj.mapFilter;
    }
    if (this.leafletMap && districtObj.center) {
      this.leafletMap.flyTo([districtObj.center.lat, districtObj.center.lng], districtObj.center.zoom, {
        animate: true,
        duration: 1.1
      });
      this.renderLeafletOverlays();
    }
  }

  togglePitch3D() {
    this.pitch3D = !this.pitch3D;
    const mapDiv = document.getElementById('real-leaflet-map');
    if (mapDiv) {
      mapDiv.style.transform = this.pitch3D
        ? 'perspective(1100px) rotateX(18deg) scale(1.08)'
        : 'none';
    }
    return this.pitch3D;
  }

  resize() {
    if (!this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width || 400;
    this.height = rect.height || 820;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.leafletMap) {
      setTimeout(() => this.leafletMap.invalidateSize(), 60);
    }
  }

  projectPoint(nx, ny) {
    const w = this.width || 400;
    const h = this.height || 800;
    const pitchFactor = this.pitch3D ? 0.85 : 1.0;
    const spread = this.pitch3D ? 1 + (ny - 0.44) * 0.2 : 1.0;

    const cx = w * 0.5 + this.cam.x;
    const cy = h * 0.42 + this.cam.y;

    return {
      x: cx + (nx - 0.5) * w * 0.92 * spread * this.cam.zoom,
      y: cy + (ny - 0.46) * h * 0.68 * pitchFactor * this.cam.zoom
    };
  }

  start() {
    this.isRunning = true;
    const tick = () => {
      if (!this.isRunning) return;

      // Core Web Vitals & Battery Saver: Skip canvas calculations and repaints when PWA modal is closed
      const isPortalMode = document.body.classList.contains('web-portal-active');
      const isPwaOpen = document.body.classList.contains('pwa-modal-open');
      if (isPortalMode && !isPwaOpen) {
        requestAnimationFrame(tick);
        return;
      }

      this.time += 0.016;
      this.cam.x += (this.cam.targetX - this.cam.x) * 0.1;
      this.cam.y += (this.cam.targetY - this.cam.y) * 0.1;
      this.cam.zoom += (this.cam.targetZoom - this.cam.zoom) * 0.1;

      this.userPos.x += (this.targetUserPos.x - this.userPos.x) * 0.08;
      this.userPos.y += (this.targetUserPos.y - this.userPos.y) * 0.08;

      this.render();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  pause() {
    this.isRunning = false;
  }

  resume() {
    if (!this.isRunning) {
      this.start();
    }
  }

  render() {
    // If Leaflet is active and loaded tiles, canvas doesn't need to cover it
    if (this.leafletMap) return;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    if (!w || !h) return;

    const isHeritage = this.theme === 'heritage';

    // 1. Rich Architectural Cartographic Background
    const bg = ctx.createRadialGradient(w * 0.46, h * 0.34, 20, w * 0.5, h * 0.5, Math.max(w, h) * 0.9);
    if (isHeritage) {
      bg.addColorStop(0, '#1E1712');
      bg.addColorStop(0.6, '#130E0B');
      bg.addColorStop(1, '#0A0705');
    } else {
      bg.addColorStop(0, '#132038');
      bg.addColorStop(0.6, '#0B1324');
      bg.addColorStop(1, '#060A12');
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // 2. Fine Cartographic Coordinate Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < w; gx += 44) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, h);
      ctx.stroke();
    }
    for (let gy = 0; gy < h; gy += 44) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Haliç & Bosphorus Coastline with Bathymetry Contours
    this.drawCoastline(ctx, isHeritage);

    // 4. Primary & Secondary Street Network of Karaköy
    this.drawStreetNetwork(ctx, isHeritage);

    // 5. Architectural Urban Parcels & Street Labels
    this.drawParcels(ctx, isHeritage);

    // 6. Galata Tower Landmark
    this.drawGalataLandmark(ctx, isHeritage);

    // 7. Smooth Spline Route
    this.drawRouteSpline(ctx);

    // 8. User Beacon & High-Visibility Stop Pins
    this.drawUserBeacon(ctx);
    this.drawStopPins(ctx);
  }

  drawCoastline(ctx, isHeritage) {
    const p0 = this.projectPoint(-0.15, 0.70);
    const p1 = this.projectPoint(0.26, 0.77);
    const p2 = this.projectPoint(0.62, 0.78);
    const p3 = this.projectPoint(0.92, 0.64);
    const p4 = this.projectPoint(1.15, 0.50);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
    ctx.quadraticCurveTo(p3.x, p3.y, p4.x, p4.y);
    ctx.lineTo(this.width + 40, this.height + 40);
    ctx.lineTo(-40, this.height + 40);
    ctx.closePath();

    const wg = ctx.createLinearGradient(0, this.height * 0.6, 0, this.height);
    wg.addColorStop(0, isHeritage ? '#0B1017' : '#061224');
    wg.addColorStop(1, '#030710');
    ctx.fillStyle = wg;
    ctx.fill();

    // Illuminated Quay Edge
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
    ctx.quadraticCurveTo(p3.x, p3.y, p4.x, p4.y);
    ctx.strokeStyle = this.districtAccent;
    ctx.lineWidth = 2.2;
    ctx.globalAlpha = 0.55;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Galata Bridge
    const b1 = this.projectPoint(0.28, 0.76);
    const b2 = this.projectPoint(0.16, 1.05);
    ctx.beginPath();
    ctx.moveTo(b1.x, b1.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 9;
    ctx.stroke();

    // Water Label
    const wl = this.projectPoint(0.52, 0.87);
    ctx.fillStyle = 'rgba(203, 213, 225, 0.45)';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HALİÇ · GOLDEN HORN', wl.x, wl.y);
    ctx.restore();
  }

  drawStreetNetwork(ctx, isHeritage) {
    const mainArteries = [
      // Voyvoda / Bankalar Caddesi
      [[0.12, 0.54], [0.31, 0.49], [0.45, 0.47], [0.62, 0.54], [0.62, 0.76]],
      // Büyük Hendek & Serdar-ı Ekrem
      [[0.15, 0.25], [0.36, 0.23], [0.54, 0.29], [0.74, 0.38]],
      // Kemankeş Caddesi (Waterfront avenue)
      [[0.28, 0.74], [0.62, 0.76], [0.78, 0.62], [0.92, 0.46]],
      // Tersane Caddesi & Cross streets
      [[0.36, 0.23], [0.45, 0.46], [0.42, 0.56], [0.34, 0.75]],
      [[0.54, 0.29], [0.50, 0.52], [0.62, 0.76]]
    ];

    ctx.save();
    mainArteries.forEach((road, idx) => {
      ctx.beginPath();
      road.forEach(([nx, ny], i) => {
        const pt = this.projectPoint(nx, ny);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = isHeritage ? 'rgba(255, 248, 235, 0.14)' : 'rgba(203, 213, 225, 0.16)';
      ctx.lineWidth = idx < 3 ? 6.5 : 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
    ctx.restore();
  }

  drawParcels(ctx, isHeritage) {
    const ext = this.pitch3D ? 1.0 : 0.2;
    ctx.save();
    for (const b of this.urbanParcels) {
      const p1 = this.projectPoint(b.x, b.y);
      const p2 = this.projectPoint(b.x + b.w, b.y - b.d * 0.28);
      const p3 = this.projectPoint(b.x + b.w * 0.88, b.y + b.d);
      const p4 = this.projectPoint(b.x - b.w * 0.12, b.y + b.d * 1.08);
      const hOff = b.h * ext * 0.58;

      // Side extrusion
      ctx.fillStyle = isHeritage ? 'rgba(28, 21, 16, 0.9)' : 'rgba(15, 24, 42, 0.9)';
      ctx.beginPath();
      ctx.moveTo(p4.x, p4.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p3.x, p3.y - hOff);
      ctx.lineTo(p4.x, p4.y - hOff);
      ctx.closePath();
      ctx.fill();

      // Roof
      ctx.fillStyle = isHeritage ? 'rgba(40, 31, 24, 0.94)' : 'rgba(23, 36, 60, 0.94)';
      ctx.strokeStyle = isHeritage ? 'rgba(251, 191, 36, 0.24)' : 'rgba(148, 163, 184, 0.24)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y - hOff);
      ctx.lineTo(p2.x, p2.y - hOff);
      ctx.lineTo(p3.x, p3.y - hOff);
      ctx.lineTo(p4.x, p4.y - hOff);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (b.label) {
        ctx.fillStyle = 'rgba(226, 232, 240, 0.52)';
        ctx.font = '600 9.5px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.label, (p1.x + p3.x) / 2, (p1.y + p3.y) / 2 - hOff);
      }
    }
    ctx.restore();
  }

  drawGalataLandmark(ctx, isHeritage) {
    const ext = this.pitch3D ? 1.0 : 0.35;
    const gp = this.projectPoint(0.36, 0.23);
    const th = 48 * ext;

    ctx.save();
    const glow = ctx.createRadialGradient(gp.x, gp.y, 4, gp.x, gp.y, 46);
    glow.addColorStop(0, 'rgba(245, 158, 11, 0.38)');
    glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(gp.x, gp.y, 46, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#D97706';
    ctx.strokeStyle = '#FEF3C7';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(gp.x - 11, gp.y - th, 22, th, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isHeritage ? '#F59E0B' : '#38BDF8';
    ctx.beginPath();
    ctx.moveTo(gp.x - 13, gp.y - th);
    ctx.lineTo(gp.x, gp.y - th - 22 * ext - 6);
    ctx.lineTo(gp.x + 13, gp.y - th);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawRouteSpline(ctx) {
    if (this.stops.length < 2) return;
    const pts = this.stops.map((s) => this.projectPoint(s.mapPos.x, s.mapPos.y));

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 0; i < pts.length - 1; i++) {
      const xc = (pts[i].x + pts[i + 1].x) / 2;
      const yc = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.strokeStyle = this.districtAccent;
    ctx.lineWidth = 2.6;
    ctx.setLineDash([7, 7]);
    ctx.lineDashOffset = -this.time * 22;
    ctx.stroke();
    ctx.restore();
  }

  drawUserBeacon(ctx) {
    const up = this.projectPoint(this.userPos.x, this.userPos.y);
    ctx.save();
    const phase = (this.time * 0.6) % 1;
    ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - phase) * 0.55})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(up.x, up.y, 8 + phase * 34, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(up.x, up.y, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawStopPins(ctx) {
    ctx.save();
    for (const stop of this.stops) {
      const pt = this.projectPoint(stop.mapPos.x, stop.mapPos.y);
      const isSelected = stop.id === this.selectedStopId;
      const isListened = stop.state === 'listened';

      if (isSelected) {
        const pulse = 22 + Math.sin(this.time * 4) * 4;
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      const r = isSelected ? 17 : 14;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      ctx.fillStyle = isListened ? '#065F46' : isSelected ? '#B45309' : '#0F172A';
      ctx.strokeStyle = isListened ? '#34D399' : isSelected ? '#FDE047' : 'rgba(226, 232, 240, 0.6)';
      ctx.lineWidth = isSelected ? 2.8 : 1.8;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${isSelected ? '700 12px' : '700 10.5px'} "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stop.number, pt.x, pt.y + 0.5);

      if (isSelected) {
        const label = stop.shortTitle || stop.title;
        ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
        const tw = ctx.measureText(label).width + 22;
        const px = pt.x - tw / 2;
        const py = pt.y - r - 32;

        ctx.fillStyle = 'rgba(9, 14, 26, 0.96)';
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(px, py, tw, 24, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(label, pt.x, py + 12.5);
      }
    }
    ctx.restore();
  }
}
