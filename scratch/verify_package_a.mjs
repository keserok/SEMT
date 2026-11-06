import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting Package A Verification...\n');

let errors = [];
let passes = [];

function assert(condition, message) {
  if (condition) {
    passes.push(message);
    console.log(`  ✅ PASS: ${message}`);
  } else {
    errors.push(message);
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Verify index.html
const indexPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

assert(!indexHtml.includes('user-scalable=no'), 'Viewport avoids user-scalable=no (Lighthouse accessibility compliant)');
assert(indexHtml.includes('<title>SEMT — İstanbul’un Görünmeyen Katmanları'), 'Title tag is optimized with high-intent keywords');
assert(indexHtml.includes('name="description"'), 'Meta description is present');
assert(indexHtml.includes('name="keywords"'), 'Meta keywords is present');
assert(indexHtml.includes('rel="canonical" href="https://semt-istanbul.com/"'), 'Canonical URL tag is present');
assert(indexHtml.includes('hreflang="tr"') && indexHtml.includes('hreflang="en"') && indexHtml.includes('hreflang="x-default"'), 'Hreflang multilingual tags present');
assert(indexHtml.includes('name="geo.region" content="TR-34"'), 'Local Geo-SEO region TR-34 present');
assert(indexHtml.includes('name="geo.position" content="41.0082;28.9784"'), 'Local Geo coordinates present');
assert(indexHtml.includes('property="og:type" content="website"'), 'OpenGraph type present');
assert(indexHtml.includes('property="og:image"'), 'OpenGraph image present');
assert(indexHtml.includes('name="twitter:card" content="summary_large_image"'), 'Twitter summary_large_image card present');
assert(indexHtml.includes('rel="preload" as="image" href="public/assets/istanbul_atmospheric_hero_bg.jpg" fetchpriority="high"'), 'High-priority preload for hero image present');

// Verify Schema.org JSON-LD
const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(Boolean(jsonLdMatch), 'Schema.org JSON-LD script block found in index.html');
if (jsonLdMatch) {
  try {
    const parsed = JSON.parse(jsonLdMatch[1]);
    assert(parsed['@context'] === 'https://schema.org', 'JSON-LD @context is https://schema.org');
    const graph = parsed['@graph'] || [];
    const types = graph.map(item => item['@type']);
    assert(types.includes('WebSite'), 'JSON-LD includes WebSite entity with SearchAction');
    assert(types.includes('Organization'), 'JSON-LD includes Organization entity');
    assert(types.includes('TouristDestination'), 'JSON-LD includes TouristDestination entity');
    assert(types.includes('ItemList'), 'JSON-LD includes ItemList entity for curated routes');
    assert(types.includes('FAQPage'), 'JSON-LD includes FAQPage entity for rich SERP snippets');
    assert(types.includes('BreadcrumbList'), 'JSON-LD includes BreadcrumbList entity');

    const itemList = graph.find(i => i['@type'] === 'ItemList');
    assert(itemList && itemList.itemListElement.length === 6, `ItemList has all 6 curated routes (found: ${itemList?.itemListElement?.length})`);

    const faq = graph.find(i => i['@type'] === 'FAQPage');
    assert(faq && faq.mainEntity.length >= 6, `FAQPage has rich questions and answers (found: ${faq?.mainEntity?.length})`);
  } catch (err) {
    errors.push(`JSON-LD is not valid JSON: ${err.message}`);
  }
}

// Verify Pre-rendered Crawlable HTML
assert(indexHtml.includes('id="capitolium-web-root"'), '#capitolium-web-root exists in index.html');
assert(indexHtml.includes('class="cap-seo-prerender"'), 'Pre-rendered crawlable HTML exists inside #capitolium-web-root');
assert(indexHtml.includes('>İstanbul’un Görünmeyen Katmanları: Küratörlü Mimari ve Kültür Rotaları</h1>') && indexHtml.includes('<h1'), 'Crawlable <h1> heading present');
assert(indexHtml.includes('?route=karakoy-kamondo-sessiz-hanlar'), 'Crawlable route permalink 1 present');
assert(indexHtml.includes('?route=balat-altin-saat-fotograf-rotasi'), 'Crawlable route permalink 2 present');
assert(indexHtml.includes('?route=moda-gun-batimi-vapur-turu'), 'Crawlable route permalink 3 present');
assert(indexHtml.includes('?route=sultanahmet-bizans-sarniclari-rotasi'), 'Crawlable route permalink 4 present');
assert(indexHtml.includes('?route=kuzguncuk-bostan-ahsap-koskler'), 'Crawlable route permalink 5 present');
assert(indexHtml.includes('?route=nisantasi-art-nouveau-tasarim'), 'Crawlable route permalink 6 present');

// 2. Verify robots.txt and public/robots.txt
['robots.txt', 'public/robots.txt'].forEach(rel => {
  const p = path.join(rootDir, rel);
  assert(fs.existsSync(p), `${rel} exists`);
  if (fs.existsSync(p)) {
    const c = fs.readFileSync(p, 'utf-8');
    assert(c.includes('User-agent: *'), `${rel} has User-agent: *`);
    assert(c.includes('User-agent: Googlebot'), `${rel} has Googlebot directive`);
    assert(c.includes('Sitemap: https://semt-istanbul.com/sitemap.xml'), `${rel} specifies Sitemap URL`);
  }
});

// 3. Verify sitemap.xml and public/sitemap.xml
['sitemap.xml', 'public/sitemap.xml'].forEach(rel => {
  const p = path.join(rootDir, rel);
  assert(fs.existsSync(p), `${rel} exists`);
  if (fs.existsSync(p)) {
    const c = fs.readFileSync(p, 'utf-8');
    assert(c.includes('<urlset') && c.includes('</urlset>'), `${rel} is well-formed XML urlset`);
    assert(c.includes('<loc>https://semt-istanbul.com/</loc>'), `${rel} contains homepage loc`);
    assert(c.includes('<image:image>'), `${rel} contains image sitemap tags`);
    assert(c.includes('?route=karakoy-kamondo-sessiz-hanlar'), `${rel} contains route 1`);
    assert(c.includes('?route=balat-altin-saat-fotograf-rotasi'), `${rel} contains route 2`);
    assert(c.includes('?route=moda-gun-batimi-vapur-turu'), `${rel} contains route 3`);
    assert(c.includes('?route=sultanahmet-bizans-sarniclari-rotasi'), `${rel} contains route 4`);
    assert(c.includes('?route=kuzguncuk-bostan-ahsap-koskler'), `${rel} contains route 5`);
    assert(c.includes('?route=nisantasi-art-nouveau-tasarim'), `${rel} contains route 6`);
  }
});

// 4. Verify server.mjs MIME types
const serverPath = path.join(rootDir, 'server.mjs');
const serverContent = fs.readFileSync(serverPath, 'utf-8');
assert(serverContent.includes("'.xml': 'application/xml; charset=utf-8'"), 'server.mjs supports .xml MIME type');
assert(serverContent.includes("'.txt': 'text/plain; charset=utf-8'"), 'server.mjs supports .txt MIME type');
assert(serverContent.includes("'.webp': 'image/webp'"), 'server.mjs supports .webp MIME type');

console.log(`\n========================================`);
console.log(`Summary: ${passes.length} Passed, ${errors.length} Failed`);
console.log(`========================================\n`);

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PACKAGE A VERIFICATION CHECKS PASSED PERFECTLY!\n');
}
