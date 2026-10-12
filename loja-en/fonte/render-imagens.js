// Gera loja-en/img/*.jpg a partir de imagens.html. Uso: node render-imagens.js
const { chromium } = require(process.env.PW || 'playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1200, height: 1200 } });
  await p.goto('file://' + path.join(__dirname, 'imagens.html'));
  await p.evaluate(() => document.fonts.ready);
  for (const id of ['s1','s2','s3','s4','s5','s6','s7','s8'])
    await p.locator('#' + id).screenshot({ path: path.join(__dirname, '..', 'img', ({s7:'before',s8:'after'})[id] || id) + '.jpg', type: 'jpeg', quality: 82 });
  await b.close();
})();
