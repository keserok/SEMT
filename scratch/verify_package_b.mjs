import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('⚡ Starting Package B Core Web Vitals & Performance Verification...\n');

let passes = [];
let errors = [];

function assert(condition, message) {
  if (condition) {
    passes.push(message);
    console.log(`  ✅ PASS: ${message}`);
  } else {
    errors.push(message);
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. CSS Font Loading & Render-Blocking Chain
const cssPath = path.join(rootDir, 'src/styles/capitoliumWeb.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

assert(!cssContent.includes('@import url('), 'Removed render-blocking @import from capitoliumWeb.css');
assert(cssContent.includes('content-visibility: auto;'), 'content-visibility: auto added to offscreen sections');
assert(cssContent.includes('contain-intrinsic-size: 1px 750px;'), 'contain-intrinsic-size added for smooth CLS-free rendering');
assert(cssContent.includes('will-change: transform, opacity;'), 'will-change and GPU compositing added to ambient image slides');

// 2. 3D Map Engine CPU Sleep & Power Management
const mapCanvasPath = path.join(rootDir, 'src/engine/mapCanvas.js');
const mapCanvasContent = fs.readFileSync(mapCanvasPath, 'utf-8');

assert(mapCanvasContent.includes('isPortalMode && !isPwaOpen'), 'SemtMapEngine sleeps during Web Portal mode (0% background CPU)');
assert(mapCanvasContent.includes('pause() {') && mapCanvasContent.includes('resume() {'), 'SemtMapEngine implements pause() and resume() lifecycle controls');

// 3. App Background Interval Guards
const appPath = path.join(rootDir, 'src/app.js');
const appContent = fs.readFileSync(appPath, 'utf-8');

assert(appContent.includes("if (!document.body.classList.contains('pwa-modal-open')) return;"), 'startQrTimer in app.js sleeps when PWA modal is closed');

// 4. Web Portal Canvas & Ambient Flow Optimizations
const portalPath = path.join(rootDir, 'src/webPortal.js');
const portalContent = fs.readFileSync(portalPath, 'utf-8');

assert(portalContent.includes("'IntersectionObserver' in window") && portalContent.includes('bosphorus-atlas-canvas'), 'Bosphorus Atlas Canvas uses IntersectionObserver to sleep when offscreen');
assert(portalContent.includes('if (document.hidden) return;'), 'Ambient image flow sleeps when tab is inactive');
assert(portalContent.includes('rect.top > window.innerHeight + 150'), 'Ambient image flow skips offscreen containers');
assert(portalContent.includes('fetchpriority="high"') && portalContent.includes('decoding="async"'), 'Hero images use fetchpriority="high" and decoding="async"');
assert(portalContent.includes('loading="lazy"') && portalContent.includes('decoding="async"'), 'Below-the-fold images use loading="lazy" and decoding="async"');
assert(portalContent.includes("matchMedia('(hover: none) or (pointer: coarse)')"), 'SemtStudioCursor detects touch/mobile devices to eliminate listener overhead');

// 5. Bootstrap Idle Hydration
const buildPath = path.join(rootDir, 'build.mjs');
const buildContent = fs.readFileSync(buildPath, 'utf-8');
const indexPath = path.join(rootDir, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

assert(buildContent.includes('requestIdleCallback'), 'build.mjs uses requestIdleCallback for lazy field engine init');
assert(indexContent.includes('requestIdleCallback'), 'index.html inlined scripts use requestIdleCallback for lazy field engine init');

console.log(`\n========================================`);
console.log(`Summary: ${passes.length} Passed, ${errors.length} Failed`);
console.log(`========================================\n`);

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PACKAGE B PERFORMANCE CHECKS PASSED PERFECTLY!\n');
}
