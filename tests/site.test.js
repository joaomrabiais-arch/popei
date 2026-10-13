// Testes de ponta a ponta do site/ com Playwright (Chromium). Uso: npm test
// Variável opcional: CHROMIUM_PATH para usar um Chromium já instalado.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const { start, ROOT } = require("./serve");

const PAGES = ["/", "/contacto.html", "/legal/privacidade.html", "/legal/termos.html", "/legal/envios.html", "/legal/devolucoes.html", "/pagina-que-nao-existe"];
const WIDTHS = [360, 768, 1280];
let failures = 0, passes = 0;
const ok = (cond, msg) => { if (cond) passes++; else { failures++; console.error("  ✗ " + msg); } };

(async () => {
  const server = await start(4173);
  const base = "http://localhost:4173";
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

  for (const pg of PAGES) {
    console.log("• " + pg);
    for (const w of WIDTHS) {
      const page = await browser.newPage({ viewport: { width: w, height: 800 } });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() !== "error" || /fonts\.(googleapis|gstatic)/.test(m.text())) return;
        if (pg === "/pagina-que-nao-existe" && /status of 404/.test(m.text()) && m.location().url === base + pg) return; // a própria página 404
        errors.push(m.text());
      });
      page.on("requestfailed", (r) => { if (!/fonts\.(googleapis|gstatic)/.test(r.url())) errors.push("falhou: " + r.url()); });
      const res = await page.goto(base + pg, { waitUntil: "load" });
      ok(pg === "/pagina-que-nao-existe" ? res.status() === 404 : res.status() === 200, `${pg} estado HTTP ${res.status()}`);
      await page.waitForTimeout(150);
      ok(errors.length === 0, `${pg} @${w}px erros: ${errors.join(" | ")}`);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      ok(sw <= w, `${pg} @${w}px scroll horizontal (${sw}px)`);
      if (w === 1280) {
        // links internos apontam para ficheiros e âncoras que existem
        const links = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
        for (const href of links) {
          if (/^(https?:|mailto:|tel:)/.test(href)) continue;
          if (href.startsWith("#")) { ok(await page.$(href) !== null, `${pg} âncora inexistente: ${href}`); continue; }
          const u = new URL(href, base + pg);
          let file = u.pathname.endsWith("/") ? u.pathname + "index.html" : u.pathname;
          ok(fs.existsSync(path.join(ROOT, file)), `${pg} link partido: ${href}`);
          if (u.hash && file === (pg === "/" ? "/index.html" : pg)) ok(await page.$(u.hash) !== null, `${pg} âncora inexistente: ${href}`);
        }
        const noAlt = await page.$$eval("img:not([alt])", (x) => x.length);
        ok(noAlt === 0, `${pg} imagens sem alt: ${noAlt}`);
        ok(await page.$("h1") !== null, `${pg} sem h1`);
        ok((await page.title()).length > 5, `${pg} sem <title>`);
      }
      await page.close();
    }
  }

  console.log("• menu móvel");
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    await page.goto(base + "/");
    await page.click("#menuBtn");
    ok(await page.getAttribute("#menuBtn", "aria-expanded") === "true", "menu não abre");
    await page.waitForTimeout(300);
    ok(await page.isVisible("#mobileMenu a"), "links do menu invisíveis");
    await page.keyboard.press("Escape");
    ok(await page.getAttribute("#menuBtn", "aria-expanded") === "false", "Esc não fecha o menu");
    await page.click("#menuBtn");
    await page.click("#mobileMenu a[href$='#perguntas']");
    ok(await page.getAttribute("#menuBtn", "aria-expanded") === "false", "clicar num link não fecha o menu");
    await page.close();
  }

  console.log("• perguntas frequentes");
  {
    const page = await browser.newPage();
    await page.goto(base + "/");
    const q = page.locator(".faq-q").first();
    await q.click();
    ok(await q.getAttribute("aria-expanded") === "true", "pergunta não abre");
    await q.click();
    ok(await q.getAttribute("aria-expanded") === "false", "pergunta não fecha");
    await page.close();
  }

  console.log("• lista de espera sem serviço ligado");
  {
    const page = await browser.newPage();
    let posted = 0;
    page.on("request", (r) => { if (r.method() === "POST") posted++; });
    await page.goto(base + "/");
    const form = page.locator("form[data-form=interesse]");
    await form.locator("[type=submit]").click();
    ok(await page.getAttribute("#int-email", "aria-invalid") === "true", "email vazio não dá erro");
    ok((await page.textContent("#int-consent-err")).length > 0, "consentimento em falta não dá erro");
    await page.fill("#int-email", "nao-e-email");
    await form.locator("[type=submit]").click();
    ok(/válido/.test(await page.textContent("#int-email-err")), "email inválido sem mensagem");
    await page.fill("#int-email", "teste@exemplo.pt");
    await form.locator("input[name=consent]").check();
    await form.locator("[type=submit]").click();
    ok(await form.locator(".status--warn").count() === 1, "sem endpoint devia avisar que não enviou");
    ok(posted === 0, "sem endpoint não devia haver pedido POST");
    await page.close();
  }

  console.log("• lista de espera com serviço ligado (simulado só no teste)");
  {
    const page = await browser.newPage();
    let body = "";
    await page.route("https://forms.test/**", async (route) => { body = route.request().postData() || ""; await route.fulfill({ status: 200, body: "{}", contentType: "application/json" }); });
    await page.addInitScript(() => { Object.defineProperty(window, "SITE", { configurable: true, set(v) { v.forms.endpoint = "https://forms.test/f"; Object.defineProperty(window, "SITE", { value: v, writable: true }); } }); });
    await page.goto(base + "/");
    await page.fill("#int-email", "teste@exemplo.pt");
    await page.check("form[data-form=interesse] input[name=consent]");
    await page.click("form[data-form=interesse] [type=submit]");
    await page.waitForSelector("form[data-form=interesse] .status--ok", { timeout: 3000 }).catch(() => {});
    ok(await page.locator("form[data-form=interesse] .status--ok").count() === 1, "envio bem-sucedido sem mensagem de sucesso");
    ok(body.includes("teste@exemplo.pt"), "o email não foi enviado no pedido");
    await page.close();
  }

  console.log("• ofertas e anúncios");
  {
    const page = await browser.newPage();
    await page.goto(base + "/");
    const n = await page.locator("input[name=offer]").count();
    if (n) {
      ok(/49,80/.test(await page.textContent("#priceBox")), "a oferta por defeito devia ser o pack de 3");
      await page.locator(".offer").first().click();
      ok(/24,90/.test(await page.textContent("#priceBox")), "mudar de oferta não atualiza o preço");
      await page.click("a[data-offer-qty='3']");
      ok(/49,80/.test(await page.textContent("#priceBox")), "o anúncio do pack não escolhe o pack de 3");
    }
    const ads = await page.$$eval(".ad-banner img", (x) => x.map((i) => i.getAttribute("alt")));
    ok(ads.every((a) => a && a.length > 10), "anúncios sem texto alternativo");
    await page.close();
  }

  console.log("• página de produto: galeria e separadores");
  {
    const page = await browser.newPage();
    await page.goto(base + "/");
    if (await page.$("#pdpMain")) {
      const onSrc = () => page.$eval("#pdpMain img.is-on", (i) => i.getAttribute("src"));
      const first = await onSrc();
      await page.click(".pdp-thumbs button:nth-child(3)");
      ok((await onSrc()) !== first, "a miniatura não muda a imagem principal");
      ok(/3 \//.test(await page.textContent("#pdpCount")), "o contador da galeria não atualiza");
      await page.focus("#pdpMain"); await page.keyboard.press("ArrowRight");
      ok(/4 \//.test(await page.textContent("#pdpCount")), "a seta do teclado não muda a imagem");
      const tab = page.locator(".tab-q").nth(1);
      await tab.click();
      ok(await tab.getAttribute("aria-expanded") === "true", "o separador não abre");
      const cta = await page.$(".pdp-buy a.btn, #addToCart");
      ok(cta !== null, "falta o botão de compra ou de lista de espera");
    }
    await page.close();
  }

  console.log("• carrinho (com preço e checkout simulados só no teste)");
  {
    const page = await browser.newPage();
    await page.addInitScript(() => { Object.defineProperty(window, "SITE", { configurable: true, set(v) { if (v.layout === "pdp") { v.product.price = 50; v.product.checkoutUrl = ""; } Object.defineProperty(window, "SITE", { value: v, writable: true }); } }); });
    await page.goto(base + "/");
    if (await page.$("#addToCart")) {
      await page.click("[data-qty='1']");
      await page.click("#addToCart");
      ok(await page.isVisible("#drawer"), "o carrinho não abre ao adicionar");
      ok(await page.textContent("#cartCount") === "2", "a quantidade no carrinho está errada");
      ok(/100,00/.test(await page.textContent("#drawerTotal")), "o total do carrinho está errado");
      await page.click("#checkoutBtn");
      ok(await page.locator("#checkoutStatus .status--warn").count() === 1, "sem checkout devia avisar que não cobrou nada");
      await page.keyboard.press("Escape");
      ok(await page.isHidden("#drawer"), "Esc não fecha o carrinho");
    }
    await page.close();
  }

  console.log("• formulário de contacto");
  {
    const page = await browser.newPage();
    await page.goto(base + "/contacto.html");
    await page.click("form[data-form=contacto] [type=submit]");
    const invalid = await page.$$eval("[aria-invalid=true]", (x) => x.length);
    ok(invalid === 5, `contacto vazio devia marcar 5 campos (marcou ${invalid})`);
    ok(await page.evaluate(() => document.activeElement.id) === "c-name", "o foco não vai para o primeiro erro");
    await page.fill("#c-name", "Ana"); await page.fill("#c-email", "ana@exemplo.pt");
    await page.selectOption("#c-subject", { index: 1 }); await page.fill("#c-msg", "curta");
    await page.check("form[data-form=contacto] input[name=consent]");
    await page.click("form[data-form=contacto] [type=submit]");
    ok(/10 caracteres/.test(await page.textContent("#c-msg-err")), "mensagem curta sem erro");
    await page.close();
  }

  console.log("• movimento reduzido: nada fica invisível");
  {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(base + "/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);
    const hidden = await page.$$eval("main *", (els) => els.filter((e) => !e.matches("input[type=range]") && !e.closest("svg") && !e.matches(".pdp-main img:not(.is-on), .story-frame img:not(.is-on), .pdp-nav") && getComputedStyle(e).opacity === "0").length);
    ok(hidden === 0, `${hidden} elementos com opacidade 0 com movimento reduzido`);
    await ctx.close();
  }

  await browser.close(); server.close();
  console.log(`\n${passes} verificações passaram, ${failures} falharam`);
  process.exit(failures ? 1 : 0);
})();
