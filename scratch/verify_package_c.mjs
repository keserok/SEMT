import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🏛️ Starting Package C Luxury Editorial & Offline Travel Pass Verification...\n');

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

// 1. CSS Verification for Key Facts, Offline Pass, and Print
const cssPath = path.join(rootDir, 'src/styles/capitoliumWeb.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

assert(cssContent.includes('.cap-key-facts-grid'), 'CSS contains .cap-key-facts-grid');
assert(cssContent.includes('.cap-fact-card'), 'CSS contains .cap-fact-card');
assert(cssContent.includes('.cap-fact-icon'), 'CSS contains .cap-fact-icon');
assert(cssContent.includes('.cap-fact-label'), 'CSS contains .cap-fact-label');
assert(cssContent.includes('.cap-fact-val'), 'CSS contains .cap-fact-val');
assert(cssContent.includes('.cap-offline-modal'), 'CSS contains .cap-offline-modal overlay styles');
assert(cssContent.includes('.cap-offline-dialog'), 'CSS contains .cap-offline-dialog container');
assert(cssContent.includes('.cap-offline-pass-print-area'), 'CSS contains .cap-offline-pass-print-area');
assert(cssContent.includes('.cap-offline-quick-meta'), 'CSS contains .cap-offline-quick-meta grid');
assert(cssContent.includes('.cap-offline-stop-row'), 'CSS contains .cap-offline-stop-row');
assert(cssContent.includes('.cap-offline-stop-checkbox'), 'CSS contains .cap-offline-stop-checkbox');
assert(cssContent.includes('@media print'), 'CSS contains @media print rules for paper and PDF export');
assert(cssContent.includes('page-break-inside: avoid;'), 'Print styles prevent awkward stop splits with page-break-inside: avoid');
assert(cssContent.includes('object-fit: contain;') || cssContent.includes('object-fit: cover;'), 'Photo container styles configured properly');

// 2. Web Portal JS Implementation Checks
const portalPath = path.join(rootDir, 'src/webPortal.js');
const portalContent = fs.readFileSync(portalPath, 'utf-8');

assert(portalContent.includes('id="btn-stage-offline-pass"'), 'Route stage header contains Çevrimdışı Kart button');
assert(portalContent.includes('id="btn-stage-share"'), 'Route stage header contains Web Share button');
assert(portalContent.includes('navigator.share'), 'Web Share API integration included with native device sheet');
assert(portalContent.includes('navigator.clipboard.writeText'), 'Pano (clipboard) fallback and itinerary copy included');
assert(portalContent.includes('cap-key-facts-grid'), 'Route stage template embeds 4-card Key Facts Grid');
assert(portalContent.includes('İDEAL IŞIK &amp; SAAT'), 'Key Fact 1: İdeal Işık & Saat present');
assert(portalContent.includes('BÜTÇE &amp; ULAŞIM'), 'Key Fact 2: Bütçe & Ulaşım present');
assert(portalContent.includes('YÜRÜYÜŞ &amp; EFOR'), 'Key Fact 3: Yürüyüş & Efor present');
assert(portalContent.includes('FOTOĞRAFÇI KADRAJI'), 'Key Fact 4: Fotoğrafçı Kadrajı present');
assert(portalContent.includes('openOfflinePassModal(r)'), 'SemtCapitoliumPortal implements openOfflinePassModal(r)');
assert(portalContent.includes('window.print()'), 'Offline modal triggers native window.print()');
assert(portalContent.includes('btn-offline-copy-summary'), 'Offline modal has plain-text itinerary copy for WhatsApp / Notes');
assert(portalContent.includes('Escape'), 'Offline modal supports keyboard ESC closing');

// 3. Bundled and Inlined Script Synchronization
const bundlePath = path.join(rootDir, 'src/bundle.js');
const bundleContent = fs.readFileSync(bundlePath, 'utf-8');
const indexPath = path.join(rootDir, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

assert(bundleContent.includes('openOfflinePassModal(r)'), 'src/bundle.js contains openOfflinePassModal');
assert(indexContent.includes('openOfflinePassModal(r)'), 'index.html inlined scripts contain openOfflinePassModal');
assert(indexContent.includes('cap-key-facts-grid'), 'index.html inlined scripts contain cap-key-facts-grid');

console.log(`\n========================================`);
console.log(`Summary: ${passes.length} Passed, ${errors.length} Failed`);
console.log(`========================================\n`);

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PACKAGE C EDITORIAL & UX CHECKS PASSED PERFECTLY!\n');
}
