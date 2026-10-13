// Gera as imagens ilustrativas do kit em site/assets/img/kit/. Uso: node media-fonte/render-kit.js
const { chromium } = require("playwright");
const path = require("path");
const NAMES = { k1: "kit-1-produto", k2: "kit-2-acessorios", k3: "kit-3-deposito", k4: "kit-4-como-funciona", k5: "kit-5-casa" };
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const p = await b.newPage({ viewport: { width: 1200, height: 1200 } });
  await p.goto("file://" + path.join(__dirname, "kit-imagens.html"));
  await p.evaluate(() => document.fonts.ready);
  for (const [id, name] of Object.entries(NAMES))
    await p.locator("#" + id).screenshot({ path: path.join(__dirname, "..", "site", "assets", "img", "kit", name + ".jpg"), type: "jpeg", quality: 82 });
  await b.close();
})();
