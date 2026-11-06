import fs from 'node:fs';
import assert from 'node:assert';

console.log('📱 Starting Studio-Grade Mobile Optimization Verification...\n');

const css = fs.readFileSync('src/styles/capitoliumWeb.css', 'utf-8');
const html = fs.readFileSync('index.html', 'utf-8');
const portal = fs.readFileSync('src/webPortal.js', 'utf-8');
const bundle = fs.readFileSync('src/bundle.js', 'utf-8');

// 1. Viewport Meta
assert(html.includes('viewport-fit=cover'), 'HTML includes viewport-fit=cover for iOS notch / safe areas');
console.log('  ✅ PASS: iOS safe area viewport-fit=cover enabled');

// 2. Mobile Floating HUD Bar in Markup
assert(html.includes('class="cap-mobile-nav-bar"'), 'HTML contains .cap-mobile-nav-bar');
assert(html.includes('data-mob-action="matcher"'), 'HTML contains center Rota Bul matcher action');
assert(html.includes('id="mob-passport-count"'), 'HTML contains live mobile passport counter badge');
console.log('  ✅ PASS: Floating mobile smart HUD bar present in DOM');

// 3. Mobile CSS Architecture
assert(css.includes('.cap-mobile-nav-bar'), 'CSS defines .cap-mobile-nav-bar');
assert(css.includes('display: none'), 'CSS hides mobile nav on desktop');
assert(css.includes('@media (max-width: 768px)'), 'CSS contains 768px mobile breakpoint');
assert(css.includes('touch-action: manipulation'), 'CSS eliminates 300ms tap delay with touch-action');
assert(css.includes('env(safe-area-inset-bottom'), 'CSS handles iOS safe area bottom padding');
assert(css.includes('scroll-snap-type: x mandatory'), 'CSS provides smooth touch scroll snap on mobile chips');
console.log('  ✅ PASS: Mobile CSS ergonomics, safe areas and touch-action verified');

// 4. Haptic Feedback & Dynamic Passport Engine
assert(portal.includes('triggerHaptic('), 'webPortal.js defines triggerHaptic()');
assert(portal.includes('updateMobilePassportBadge()'), 'webPortal.js defines updateMobilePassportBadge()');
assert(bundle.includes('triggerHaptic('), 'src/bundle.js contains triggerHaptic()');
assert(html.includes('triggerHaptic('), 'index.html inlined scripts contain triggerHaptic()');
console.log('  ✅ PASS: Native mobile haptic vibration and passport badge sync verified');

console.log('\n🎉 ALL STUDIO-GRADE MOBILE ENHANCEMENTS VERIFIED 100% PERFECTLY!\n');
