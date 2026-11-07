import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧭 --- STARTING VERIFICATION: SUGGESTION 1 (SPATIAL COMPASS & DUAL-NAVIGATION FIELD ENGINE) ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Load WebPortal from src/webPortal.js
const { SemtCapitoliumPortal } = await import('../src/webPortal.js');
const portal = new SemtCapitoliumPortal();

// Test 1: Route Matrix stopsData
assert(Array.isArray(portal.pseoRoutes) && portal.pseoRoutes.length === 6, 'pseoRoutes contains exactly 6 curated routes');

let allStopsValid = true;
let totalStopsCount = 0;

portal.pseoRoutes.forEach((route) => {
  assert(Array.isArray(route.stopsData) && route.stopsData.length === route.stops.length, `Route "${route.slug}" has matching stops (${route.stops.length}) and stopsData (${route.stopsData?.length})`);
  
  route.stopsData.forEach((st, idx) => {
    totalStopsCount++;
    const nameMatches = st.name === route.stops[idx];
    const latValid = typeof st.lat === 'number' && st.lat >= 40.5 && st.lat <= 41.5;
    const lngValid = typeof st.lng === 'number' && st.lng >= 28.5 && st.lng <= 29.5;
    const transitValid = typeof st.transit === 'string' && st.transit.length > 5;
    const walkMinValid = typeof st.walkMin === 'number' && st.walkMin > 0;

    if (!nameMatches || !latValid || !lngValid || !transitValid || !walkMinValid) {
      allStopsValid = false;
      console.error(`Invalid stop data in ${route.slug} stop ${idx}:`, st);
    }
  });
});

assert(allStopsValid, `All ${totalStopsCount} stops across all routes have valid GPS coordinates, transit badges, and walking estimates`);

// Test 2: Haversine distance formula accuracy
// Distance between Kamondo (41.02395, 28.97368) and SALT Galata (41.02425, 28.97395)
const kamondoSaltDist = portal.calculateDistanceMeters(41.02395, 28.97368, 41.02425, 28.97395);
assert(kamondoSaltDist >= 35 && kamondoSaltDist <= 65, `Haversine distance calculation is accurate (measured: ${kamondoSaltDist}m, expected ~40-60m)`);

// Distance between Karaköy and Moda
const karakoyModaDist = portal.calculateDistanceMeters(41.02210, 28.97720, 40.97850, 29.02480);
assert(karakoyModaDist >= 5500 && karakoyModaDist <= 7500, `Cross-Bosphorus distance calculation is accurate (measured: ${karakoyModaDist}m, expected ~6.5km)`);

// Test 3: Platform detection
const platform = portal.getDetectedPlatform();
assert(typeof platform === 'object' && 'isApple' in platform && 'name' in platform, `Platform detector returns contextual OS info (${platform.name})`);

// Test 4: Check CSS rules existence
const cssContent = fs.readFileSync(path.join(rootDir, 'src/styles/capitoliumWeb.css'), 'utf-8');
const requiredClasses = [
  'cap-multi-nav-card',
  'cap-multi-nav-heading',
  'cap-nav-launch-btn',
  'cap-stop-transit-pill',
  'cap-stop-proximity-badge',
  'cap-stop-btn--nav',
  'cap-nav-modal',
  'cap-nav-dialog',
  'cap-nav-option-btn',
  'cap-nav-coords-card'
];

requiredClasses.forEach((cls) => {
  assert(cssContent.includes(cls), `CSS includes class .${cls}`);
});

// Test 5: Check built bundle.js and index.html synchronization
const bundleContent = fs.readFileSync(path.join(rootDir, 'src/bundle.js'), 'utf-8');
const indexContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');

assert(bundleContent.includes('calculateDistanceMeters'), 'src/bundle.js contains calculateDistanceMeters');
assert(bundleContent.includes('openMapPickerModal'), 'src/bundle.js contains openMapPickerModal');
assert(bundleContent.includes('cap-multi-nav-card'), 'src/bundle.js contains cap-multi-nav-card markup');
assert(bundleContent.includes('cap-stop-proximity-badge'), 'src/bundle.js contains cap-stop-proximity-badge markup');
assert(bundleContent.includes('cap-stop-btn--nav'), 'src/bundle.js contains cap-stop-btn--nav markup');

assert(indexContent.includes('cap-multi-nav-card'), 'index.html inlined CSS includes cap-multi-nav-card');
assert(indexContent.includes('openMapPickerModal'), 'index.html inlined JS includes openMapPickerModal');

console.log(`\n🏁 --- VERIFICATION COMPLETED: ${passedTests}/${totalTests} TESTS PASSED ---`);
if (passedTests === totalTests) {
  console.log('✨ ALL TESTS PASSED SUCCESFULLY!\n');
} else {
  console.error('❌ SOME TESTS FAILED!\n');
  process.exit(1);
}
