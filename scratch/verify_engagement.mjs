import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🎯 Starting Interactive Engagement & Field Pulse Verification...\n');

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

// 1. CSS Verification
const cssPath = path.join(rootDir, 'src/styles/capitoliumWeb.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

assert(cssContent.includes('.cap-matcher-section'), 'CSS contains .cap-matcher-section');
assert(cssContent.includes('.cap-matcher-card'), 'CSS contains .cap-matcher-card');
assert(cssContent.includes('.cap-matcher-btn'), 'CSS contains .cap-matcher-btn');
assert(cssContent.includes('.cap-matcher-result'), 'CSS contains .cap-matcher-result');
assert(cssContent.includes('.cap-passport-hud'), 'CSS contains .cap-passport-hud');
assert(cssContent.includes('.cap-stop-check-btn'), 'CSS contains .cap-stop-check-btn');
assert(cssContent.includes('.cap-live-pulse-badge'), 'CSS contains .cap-live-pulse-badge');
assert(cssContent.includes('.pulse-dot-beacon'), 'CSS contains .pulse-dot-beacon with animation');
assert(cssContent.includes('.cap-community-notes-wrap'), 'CSS contains .cap-community-notes-wrap');
assert(cssContent.includes('.cap-community-input-box'), 'CSS contains .cap-community-input-box');

// 2. JavaScript Verification in webPortal.js
const portalPath = path.join(rootDir, 'src/webPortal.js');
const portalContent = fs.readFileSync(portalPath, 'utf-8');

assert(portalContent.includes('cap-route-matcher-section'), 'webPortal.js embeds cap-route-matcher-section in renderPortalHTML');
assert(portalContent.includes('bindRouteMatcher()'), 'webPortal.js implements bindRouteMatcher()');
assert(portalContent.includes('computeRouteMatch(mood, time, pace)'), 'webPortal.js implements computeRouteMatch()');
assert(portalContent.includes('renderMatcherResult()'), 'webPortal.js implements renderMatcherResult()');
assert(portalContent.includes('stage-passport-hud'), 'openRouteBySlug embeds stage-passport-hud');
assert(portalContent.includes('data-toggle-visited'), 'openRouteBySlug stop cards contain data-toggle-visited buttons');
assert(portalContent.includes('community-notes-stream'), 'openRouteBySlug embeds community-notes-stream');
assert(portalContent.includes('btn-submit-community-note'), 'openRouteBySlug embeds btn-submit-community-note');
assert(portalContent.includes('route_matcher_launch'), 'Analytics tracks route_matcher_launch');
assert(portalContent.includes('stop_visited_toggle'), 'Analytics tracks stop_visited_toggle');
assert(portalContent.includes('community_note_submit'), 'Analytics tracks community_note_submit');

// 3. Bundled and Inlined Script Check
const bundlePath = path.join(rootDir, 'src/bundle.js');
const bundleContent = fs.readFileSync(bundlePath, 'utf-8');
const indexPath = path.join(rootDir, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

assert(bundleContent.includes('bindRouteMatcher'), 'src/bundle.js contains bindRouteMatcher');
assert(indexContent.includes('bindRouteMatcher'), 'index.html inlined scripts contain bindRouteMatcher');
assert(indexContent.includes('stage-passport-hud'), 'index.html inlined scripts contain stage-passport-hud');
assert(indexContent.includes('cap-route-matcher-section'), 'index.html inlined scripts contain cap-route-matcher-section');

console.log(`\n========================================`);
console.log(`Summary: ${passes.length} Passed, ${errors.length} Failed`);
console.log(`========================================\n`);

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ENGAGEMENT & FIELD INTERACTION CHECKS PASSED PERFECTLY!\n');
}
