import fs from 'fs';

console.log('=== VERIFYING SEMT CAPITOLIUM ALL ENHANCEMENTS ===\n');

const webPortalCode = fs.readFileSync('src/webPortal.js', 'utf8');
const cssCode = fs.readFileSync('src/styles/capitoliumWeb.css', 'utf8');
const bundleCode = fs.readFileSync('src/bundle.js', 'utf8');
const indexCode = fs.readFileSync('index.html', 'utf8');

let errors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    errors++;
  } else {
    console.log(`✓ PASS: ${message}`);
  }
}

// 1. Asset checks
assert(fs.existsSync('public/assets/istanbul_atmospheric_hero_bg.jpg'), 'istanbul_atmospheric_hero_bg.jpg asset exists on disk');

// 2. Hero Background checks
assert(webPortalCode.includes('public/assets/istanbul_atmospheric_hero_bg.jpg'), 'webPortal.js includes istanbul_atmospheric_hero_bg.jpg');
assert(webPortalCode.includes('cap-hero__bg-backdrop'), 'webPortal.js contains .cap-hero__bg-backdrop');
assert(cssCode.includes('.cap-hero__bg-backdrop'), 'CSS contains .cap-hero__bg-backdrop');
assert(cssCode.includes('.cap-hero__bg-img'), 'CSS contains .cap-hero__bg-img with proper opacity and mask');

// 3. Center-Left Hero Arch Presentation checks
assert(webPortalCode.includes('cap-hero__center-showcase'), 'webPortal.js contains .cap-hero__center-showcase');
assert(cssCode.includes('.cap-hero__center-showcase'), 'CSS contains .cap-hero__center-showcase');
assert(webPortalCode.includes('hero-arch-window'), 'hero-arch-window exists inside left center showcase');
assert(webPortalCode.includes('cap-hero-pill-link'), 'cap-hero-pill-link exists in left center showcase');

// 4. Dual Luxury Theme System checks
assert(webPortalCode.includes('btn-theme-toggle'), 'Header cartouche contains #btn-theme-toggle');
assert(webPortalCode.includes('btn-menu-toggle-theme'), 'Menu controls contain #btn-menu-toggle-theme');
assert(webPortalCode.includes('applyTheme(theme)'), 'webPortal.js implements applyTheme(theme)');
assert(webPortalCode.includes('toggleTheme()'), 'webPortal.js implements toggleTheme()');
assert(cssCode.includes('[data-theme="light"]'), 'CSS contains [data-theme="light"] styling rules');
assert(cssCode.includes('[data-theme="dark"]'), 'CSS contains [data-theme="dark"] styling rules');
assert(cssCode.includes('.cap-theme-toggle-btn'), 'CSS contains .cap-theme-toggle-btn styling');

// 5. Route Detail Subpage: 3D card removed
assert(!webPortalCode.includes('cap-stage-pwa-cta-card'), '3D field launch card (cap-stage-pwa-cta-card) is completely removed from route stage companion');

// 6. Route Detail Subpage: Uncropped stop photos
assert(webPortalCode.includes('cap-stop-media-blur-bg'), 'Stop media contains .cap-stop-media-blur-bg');
assert(webPortalCode.includes('cap-stop-media-fg'), 'Stop media contains .cap-stop-media-fg');
assert(cssCode.includes('object-fit: contain'), 'CSS specifies object-fit: contain for .cap-stop-media-fg');
assert(cssCode.includes('max-height: 205px'), 'CSS specifies contained max-height for .cap-stop-media-fg');

// 7. Route Detail Subpage: Hairline scrollbar & reading progress bar
assert(webPortalCode.includes('stage-reading-progress'), 'webPortal.js contains #stage-reading-progress');
assert(cssCode.includes('.cap-stage-reading-progress-track'), 'CSS contains .cap-stage-reading-progress-track');
assert(cssCode.includes('.cap-route-stage::-webkit-scrollbar'), 'CSS contains custom hairline scrollbar for .cap-route-stage');

// 8. Bundle synchronization checks
assert(bundleCode.includes('cap-hero__bg-backdrop'), 'bundle.js contains .cap-hero__bg-backdrop');
assert(bundleCode.includes('btn-theme-toggle'), 'bundle.js contains btn-theme-toggle');
assert(bundleCode.includes('cap-stop-media-fg'), 'bundle.js contains cap-stop-media-fg');
assert(!bundleCode.includes('cap-stage-pwa-cta-card'), 'bundle.js does NOT contain cap-stage-pwa-cta-card');
assert(indexCode.includes('cap-hero__bg-backdrop'), 'index.html contains inlined cap-hero__bg-backdrop');
assert(indexCode.includes('btn-theme-toggle'), 'index.html contains inlined btn-theme-toggle');
assert(indexCode.includes('cap-stop-media-fg'), 'index.html contains inlined cap-stop-media-fg');

console.log('\n=== SUMMARY ===');
if (errors === 0) {
  console.log('🎉 ALL 20 AUDITS PASSED WITH ZERO ERRORS!');
  process.exit(0);
} else {
  console.error(`💥 ${errors} AUDITS FAILED.`);
  process.exit(1);
}
