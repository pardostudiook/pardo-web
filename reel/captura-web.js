// Captura la web en tamaño celular, sirviendo los archivos del repo desde el disco.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'public');
fs.mkdirSync(OUT, { recursive: true });
const tipos = { '.html': 'text/html', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.css': 'text/css', '.js': 'text/javascript' };

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.route('http://pardo.local/**', async (route) => {
    let rel = decodeURIComponent(new URL(route.request().url()).pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const f = path.join(ROOT, rel);
    if (!fs.existsSync(f)) return route.fulfill({ status: 404, body: '' });
    route.fulfill({ status: 200, body: fs.readFileSync(f), contentType: tipos[path.extname(f)] || 'application/octet-stream' });
  });
  const fallas = new Set();
  p.on('requestfailed', (r) => fallas.add(new URL(r.url()).host));
  await p.goto('http://pardo.local/', { waitUntil: 'load', timeout: 30000 });
  await p.waitForTimeout(3000);
  const secs = await p.evaluate(() => [...document.querySelectorAll('section,header,footer')].map((s) => [s.tagName, s.id, s.className, Math.round(s.getBoundingClientRect().top + scrollY), Math.round(s.offsetHeight), s.hidden]));
  console.log(JSON.stringify(secs));
  console.log('hosts que fallaron:', [...fallas].join(', '));
  // Fuerza la aparición de elementos animados al hacer scroll
  await p.evaluate(() => document.querySelectorAll('.aparecer').forEach((e) => e.classList.add('visible', 'activo', 'mostrar', 'is-visible', 'en-vista')));
  await p.waitForTimeout(800);
  await p.screenshot({ path: path.join(OUT, 'web.png'), fullPage: true });
  await b.close();
})();
