/* Lê window.SITE (config.js) e monta cabeçalho, rodapé e secções. Sem dependências. */
(function () {
  "use strict";
  const S = window.SITE;
  const doc = document.documentElement;
  doc.classList.add("js");
  if (!S) { console.error("config.js não carregou"); return; }

  // Páginas dentro de /legal usam data-root="../" no <html>.
  const ROOT = doc.dataset.root || "";
  const url = (href) => !href || /^(https?:|mailto:|tel:|#)/.test(href) ? href : ROOT + href;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const money = (n) => new Intl.NumberFormat(S.locale || "pt-PT", { style: "currency", currency: S.currency || "EUR" }).format(n);
  const fill = (v) => v ? esc(v) : `<span class="fill">[a preencher]</span>`;

  // ---------- ícones (traço 1.8, 24x24) ----------
  const P = {
    truck: '<path d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    return: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19 13 11"/>',
    box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11a4 4 0 1 1-4-4"/><path d="M14 3c.5 3 2.5 5 6 5"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    home: '<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
    shirt: '<path d="M8 4 4 7l2 4 2-1v10h8V10l2 1 2-4-4-3c0 2-2 3-4 3s-4-1-4-3z"/>',
    pending: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cart: '<path d="M3 4h2l2.4 11h10.6l2-8H6.3"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/>',
    minus: '<path d="M5 12h14"/>',
    chevl: '<path d="m15 6-6 6 6 6"/>',
    chevr: '<path d="m9 6 6 6-6 6"/>',
    chevd: '<path d="m6 9 6 6 6-6"/>',
  };
  const icon = (n, cls = "") => `<svg class="ic ${n === "arrow" ? "ic-arrow" : ""} ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.spark}</svg>`;

  // ---------- tema ----------
  const css = document.createElement("style");
  const t = S.theme || {};
  css.textContent = `:root{--accent:${t.accent};--accent-ink:${t.accentInk}}
    @media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--accent:${t.accentDark};--accent-ink:${t.accentDarkInk}}}
    :root[data-theme="dark"]{--accent:${t.accentDark};--accent-ink:${t.accentDarkInk}}`;
  document.head.appendChild(css);

  // ---------- marca ----------
  const brandMark = `<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--accent)"/><circle cx="17" cy="14" r="6.5" fill="none" stroke="var(--accent-ink)" stroke-width="3"/><path d="M10.5 14v11" stroke="var(--accent-ink)" stroke-width="3" stroke-linecap="round"/></svg>`;
  const brandHTML = () => S.brand.logo
    ? `<img src="${esc(url(S.brand.logo))}" alt="${esc(S.brand.name)}">`
    : `${brandMark}<span>${esc(S.brand.name)}</span>`;

  // ---------- cabeçalho ----------
  const header = $("[data-site-header]");
  if (header) {
    const here = location.pathname.split("/").pop() || "index.html";
    const navLinks = S.nav.map((l) => `<a href="${esc(url(l.href))}"${l.href.split("#")[0] === here && !l.href.includes("#") ? ' aria-current="page"' : ""}>${esc(l.label)}</a>`).join("");
    const ctaHref = url("index.html#interesse");
    header.outerHTML = `
      ${S.demo ? `<div class="demo-bar" role="note">${esc(S.demoMessage || "Versão de demonstração · os textos e imagens são provisórios")}</div>` : ""}
      <header class="site-header" id="siteHeader">
        <div class="container header-row">
          <a class="brand" href="${esc(url("index.html"))}" aria-label="${esc(S.brand.name)}, página inicial">${brandHTML()}</a>
          <nav class="nav" aria-label="Principal">${navLinks}</nav>
          ${S.product?.price != null ? `<button class="cart-btn" id="cartBtn" type="button" aria-label="Abrir carrinho">${icon("cart")}<span class="cart-count" id="cartCount">0</span></button>`
            : `<a class="btn header-cta" href="${esc(ctaHref)}">${esc(S.interest.button || "Contactar")}</a>`}
          <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="Abrir menu">${icon("menu")}</button>
        </div>
      </header>
      <div class="mobile-menu" id="mobileMenu" aria-label="Menu">${navLinks}<a class="btn btn--block" href="${esc(ctaHref)}">${esc(S.interest.button || "Contactar")}</a></div>`;
  }

  // ---------- rodapé ----------
  const footer = $("[data-site-footer]");
  if (footer) {
    const c = S.contact || {}, L = S.legal || {};
    const socials = [["instagram", c.instagram, "Instagram"], ["tiktok", c.tiktok, "TikTok"]].filter((s) => s[1])
      .map(([n, href, label]) => `<a href="${esc(href)}" target="_blank" rel="noopener" aria-label="${label}">${icon(n)}</a>`).join("");
    footer.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a class="brand" href="${esc(url("index.html"))}">${brandHTML()}</a>
              <p>${esc(S.brand.tagline)}</p>
              ${c.email ? `<p><a class="link" href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>` : ""}
              ${socials ? `<div class="socials">${socials}</div>` : ""}
            </div>
            ${S.footer.columns.map((col) => `<div class="footer-col"><h2>${esc(col.title)}</h2><ul>${col.links.map((l) =>
              `<li><a href="${esc(url(l.href))}"${l.external ? ' target="_blank" rel="noopener"' : ""}>${esc(l.label)}</a></li>`).join("")}</ul></div>`).join("")}
          </div>
          <div class="footer-legal">
            <span>© ${new Date().getFullYear()} ${esc(S.brand.name)} · ${fill(L.company)} · NIF ${fill(L.nif)}</span>
            <span>Preços com IVA incluído</span>
          </div>
        </div>
      </footer>`;
  }

  // ---------- secções da página inicial ----------
  const product = S.product || {};
  const hasProduct = !!product.name;
  const buyHref = product.checkoutUrl || "#interesse";
  const buyLabel = product.checkoutUrl ? "Comprar agora" : (S.interest.button || "Avisar-me");
  const offers = product.offers || [];
  let offerIdx = Math.max(0, offers.findIndex((o) => o.default));
  const placeholder = (label) => `<div class="placeholder-object">${'<div>' + icon("image") + esc(label) + "</div>"}</div>`;

  // estado de um dado: verificado / fornecedor / pendente
  const stOf = (x) => x.status || (x.confirmed ? "verificado" : "pendente");
  const stBadge = (x) => stOf(x) === "fornecedor" ? `<span class="pill-src">segundo o fornecedor</span>`
    : stOf(x) === "pendente" ? `<span class="pill-pending">${icon("pending")}A confirmar</span>` : "";
  const imgOf = (i) => typeof i === "string" ? { src: i, alt: "" } : i;

  // Ilustração genérica de um kit de tosquia com aspiração (não representa nenhum modelo concreto).
  function kitSVG(id) {
    let hairs = "", inside = "";
    for (let i = 0; i < 14; i++) {
      const x = 40 + (i * 37) % 120, y = 228 + (i * 23) % 70, r = (i * 47) % 360;
      hairs += `<path class="kit-hair" style="--d:${(i % 7) * .28}s;--x:${150 - x}px;--y:${178 - y}px" d="M${x} ${y} q6 -7 14 -2" transform="rotate(${r % 40 - 20} ${x} ${y})"/>`;
    }
    for (let i = 0; i < 70; i++) {
      const x = 392 + (i * 29) % 136, y = 372 + (i * 13) % 62;
      inside += `<path d="M${x} ${y} q5 -6 12 -1" transform="rotate(${(i * 53) % 180} ${x} ${y})"/>`;
    }
    return `<svg class="kit" id="${id}" viewBox="0 0 640 560" role="img" aria-label="Ilustração de um kit de tosquia com aspiração: aspirador, mangueira e escova">
      <defs>
        <linearGradient id="${id}-body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#eef2f1"/><stop offset="1" stop-color="#d5dddb"/></linearGradient>
        <linearGradient id="${id}-bin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".10"/><stop offset="1" stop-color="var(--accent)" stop-opacity=".28"/></linearGradient>
        <radialGradient id="${id}-sh"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
        <clipPath id="${id}-clip"><rect x="384" y="300" width="152" height="140" rx="22"/></clipPath>
      </defs>
      <ellipse cx="462" cy="500" rx="150" ry="20" fill="url(#${id}-sh)"/>
      <path class="kit-hose" d="M392 238 C 360 120, 240 70, 168 160" fill="none" stroke="#2b3432" stroke-width="30" stroke-linecap="round"/>
      <path class="kit-hose-ribs" d="M392 238 C 360 120, 240 70, 168 160" fill="none" stroke="#475351" stroke-width="30" stroke-dasharray="3 11" stroke-linecap="butt"/>
      <path class="kit-flow" d="M168 160 C 240 70, 360 120, 392 238" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" stroke-dasharray="10 26"/>
      <g class="kit-canister">
        <rect x="360" y="214" width="204" height="276" rx="64" fill="url(#${id}-body)" stroke="#c9d2d0" stroke-width="2"/>
        <rect x="360" y="262" width="204" height="18" fill="var(--accent)"/>
        <circle cx="400" cy="240" r="16" fill="#2b3432"/><circle cx="400" cy="240" r="7" fill="#475351"/>
        <circle cx="526" cy="240" r="9" fill="var(--accent)"/>
        <g class="kit-bin">
          <rect x="384" y="300" width="152" height="140" rx="22" fill="url(#${id}-bin)" stroke="var(--accent)" stroke-opacity=".45" stroke-width="2"/>
          <g clip-path="url(#${id}-clip)" stroke="#a3713e" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85">${inside}</g>
          <rect x="396" y="306" width="10" height="120" rx="5" fill="#fff" opacity=".55"/>
        </g>
        <rect x="380" y="474" width="40" height="18" rx="9" fill="#2b3432"/><rect x="504" y="474" width="40" height="18" rx="9" fill="#2b3432"/>
      </g>
      <g class="kit-head" transform="rotate(-38 150 172)">
        <rect x="128" y="150" width="46" height="84" rx="20" fill="#2b3432"/>
        <rect x="96" y="214" width="110" height="46" rx="18" fill="#f4f6f5" stroke="#c9d2d0" stroke-width="2"/>
        <g stroke="#2b3432" stroke-width="4" stroke-linecap="round">${Array.from({ length: 9 }, (_, k) => `<path d="M${106 + k * 11.5} 258 v14"/>`).join("")}</g>
        <rect x="140" y="176" width="22" height="34" rx="8" fill="var(--accent)"/>
      </g>
      <g class="kit-hairs" stroke="#a3713e" stroke-width="3.2" stroke-linecap="round" fill="none">${hairs}</g>
    </svg>`;
  }

const isPdp = S.layout === "pdp";
  const R = {
    hero: () => {
      if (!S.hero) return null;
      const h = S.hero, chips = (S.trust || []).slice(0, 3);
      return `<div class="container hero-grid">
        <div class="hero-copy">
          ${h.eyebrow ? `<span class="eyebrow" data-enter style="--i:0">${esc(h.eyebrow)}</span>` : ""}
          <h1 data-enter style="--i:1">${esc(h.title)}</h1>
          <p class="hero-sub" data-enter style="--i:2">${esc(h.subtitle)}</p>
          <div class="hero-actions" data-enter style="--i:3">
            <a class="btn" href="${esc(h.primary.href)}">${esc(h.primary.label)} ${icon("arrow")}</a>
            ${h.secondary ? `<a class="btn btn--ghost" href="${esc(h.secondary.href)}">${esc(h.secondary.label)}</a>` : ""}
          </div>
        </div>
        ${h.visual === "kit" && !product.images?.length ? `<div class="stage stage--kit" data-enter style="--i:2">
          <div class="stage-card"></div>
          <div class="kit-wrap">${kitSVG("kitHero")}</div>
          <span class="stage-note">Ilustração</span>
          ${chips.map((c) => `<span class="stage-chip">${icon(c.icon)}${esc(c.text)}</span>`).join("")}
        </div>` : `
        <div class="stage" data-enter style="--i:2" aria-hidden="${product.images?.length ? "false" : "true"}">
          <div class="stage-card"></div>
          <div class="stage-ring"></div>
          <div class="stage-plinth"></div>
          <div class="stage-product">${product.images?.length ? `<img src="${esc(url(product.images[0]))}" alt="${esc(product.name || S.brand.name)}" fetchpriority="high">` : placeholder("Imagem do produto")}</div>
          ${chips.map((c) => `<span class="stage-chip">${icon(c.icon)}${esc(c.text)}</span>`).join("")}
        </div>`}
      </div>`;
    },
    trust: () => !isPdp && S.trust?.length ? `<div class="container trust-row">${S.trust.map((c) => `<div class="trust-item">${icon(c.icon)}<span>${esc(c.text)}</span></div>`).join("")}</div>` : null,
    product: () => {
      if (isPdp) return null;
      const imgs = product.images || [];
      return `<div class="container">
        <div class="section-head"><span class="eyebrow">${product.status ? "O kit" : "O produto"}</span><h2>${hasProduct ? (offers.length ? "Escolhe a tua oferta" : product.status ? "Galeria e preço" : esc(product.name)) : "Produto em preparação"}</h2></div>
        <div class="product">
          <div class="gallery" data-reveal>
            ${!imgs.length && product.imageSlots?.length ? `<div class="slots">${product.imageSlots.map((t, i) => `<figure class="slot ${i === 0 ? "slot--big" : ""}"><div>${icon("image")}<figcaption>${esc(t)}</figcaption><small>Fotografia oficial em breve</small></div></figure>`).join("")}</div>` :
            `<div class="gallery-main">${imgs.length ? `<img id="galleryMain" src="${esc(url(imgs[0]))}" alt="${esc(product.name)}" width="1200" height="1200">` : placeholder("As fotografias reais do produto entram aqui")}</div>`}
            ${imgs.length > 1 ? `<div class="gallery-thumbs" role="group" aria-label="Fotografias">${imgs.map((src, i) =>
              `<button type="button" data-src="${esc(url(src))}" aria-current="${i === 0}" aria-label="Fotografia ${i + 1}"><img src="${esc(url(src))}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
          </div>
          <div class="product-info" data-reveal>
            ${hasProduct ? "" : `<span class="tag">${icon("info")}Produto ainda não definido</span>`}
            ${product.status ? `<span class="tag tag--pending">${icon("pending")}${esc(product.status)}</span>` : ""}
            ${product.imagesAreIllustrations ? `<span class="tag">${icon("image")}Imagens ilustrativas</span>` : ""}
            <h3>${hasProduct ? esc(product.name) : "O teu produto aparece aqui"}</h3>
            ${product.price == null && product.status ? `<div class="price price--pending">Preço por confirmar</div>` : ""}
            ${product.price != null ? `<div class="price" id="priceBox">${money(product.price)}${product.compareAtPrice ? `<s>${money(product.compareAtPrice)}</s>` : ""}</div>` : ""}
            <p class="product-desc">${hasProduct ? esc(product.description) : "Quando escolheres o produto, preenche o nome, a descrição, o preço e as fotografias em config.js. Esta secção monta-se sozinha."}</p>
            ${product.highlights?.length ? `<ul class="checklist">${product.highlights.map((h) => `<li>${icon("check")}${esc(h)}</li>`).join("")}</ul>` : ""}
            ${offers.length ? `<fieldset class="offers"><legend>Escolhe a oferta</legend>${offers.map((o, i) => {
              const full = o.qty * product.price, save = full - o.price;
              return `<label class="offer"><input type="radio" name="offer" value="${i}" ${i === offerIdx ? "checked" : ""}>
                <span class="offer-txt"><b>${esc(o.label)}</b><small>${esc(o.note || "")}</small></span>
                <span class="offer-price"><b>${money(o.price)}</b>${save > 0.009 ? `<s>${money(full)}</s>` : ""}</span>
                ${o.badge ? `<span class="offer-badge">${esc(o.badge)}</span>` : ""}</label>`; }).join("")}</fieldset>` : ""}
            <a class="btn" id="buyBtn" href="${esc(buyHref)}"${product.checkoutUrl ? ' rel="noopener"' : ""}>${esc(buyLabel)} ${icon("arrow")}</a>
            ${product.checkoutUrl ? "" : `<p class="note">Ainda não há vendas online. O botão leva à lista de espera.</p>`}
          </div>
        </div>
      </div>`;
    },
    value: () => S.value?.problem ? `<div class="container">
        <div class="section-head"><span class="eyebrow">Porquê</span><h2>${esc(S.value.title)}</h2></div>
        <div class="value">
          <div class="value-card" data-reveal><span class="label">Antes</span><p>${esc(S.value.problem)}</p></div>
          <div class="value-card value-card--accent" data-reveal><span class="label">Depois</span><p>${esc(S.value.solution)}</p></div>
        </div></div>` : null,
    benefits: () => S.benefits?.length ? `<div class="container">
        <div class="section-head section-head--center"><span class="eyebrow">Benefícios</span><h2>O que muda para ti</h2></div>
        <div class="cards">${S.benefits.map((b) => `<article class="card" data-reveal><div class="card-icon">${icon(b.icon)}</div><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></article>`).join("")}</div>
      </div>` : null,
    media: () => {
      if (!S.media) return null;
      const m = S.media;
      if (!m.video && !m.images?.length && !m.videos?.length && !S.demo) return null;
      const body = m.videos?.length
        ? `<div class="reels">${m.videos.map((v) => `<figure class="reel"><video src="${esc(url(v.src))}" ${v.poster ? `poster="${esc(url(v.poster))}"` : ""} muted loop playsinline preload="none" aria-label="${esc(v.label)}"></video><figcaption>${esc(v.label)}</figcaption></figure>`).join("")}</div>`
        : m.video
        ? `<div class="media-frame"><video src="${esc(url(m.video))}" ${m.poster ? `poster="${esc(url(m.poster))}"` : ""} controls playsinline preload="metadata"></video></div>`
        : m.images?.length
          ? `<div class="media-grid">${m.images.map((src) => `<img src="${esc(url(src))}" alt="" loading="lazy">`).join("")}</div>`
          : `<div class="media-frame"><div class="media-placeholder"><div><div class="play">${icon("play")}</div>O vídeo de demonstração do produto entra aqui</div></div></div>`;
      return `<div class="container"><div class="section-head"><span class="eyebrow">Demonstração</span><h2>${esc(m.title)}</h2>${m.subtitle ? `<p>${esc(m.subtitle)}</p>` : ""}</div><div data-reveal>${body}</div></div>`;
    },
    beforeAfter: () => {
      const ba = S.media?.beforeAfter;
      if (!ba?.before || !ba?.after) return null;
      return `<div class="container"><div class="section-head section-head--center"><span class="eyebrow">Resultado</span><h2>${esc(ba.title || "Antes e depois")}</h2>${ba.note ? `<p>${esc(ba.note)}</p>` : ""}</div>
        <div class="ba" data-reveal><img src="${esc(url(ba.before))}" alt="Antes: sofá com pelo" loading="lazy" width="1200" height="1200">
        <img class="ba-after" src="${esc(url(ba.after))}" alt="Depois: o mesmo sofá limpo" loading="lazy" width="1200" height="1200">
        <span class="ba-handle" aria-hidden="true"></span>
        <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois"></div></div>`;
    },
    pdp: () => {
      if (!isPdp) return null;
      const p = product, imgs = (p.images || []).map(imgOf);
      if (!imgs.length && !p.name) return null;
      const hasPrice = p.price != null;
      const tabs = [
        ["Descrição", `<p>${esc(p.description || "")}</p>`],
        S.specs?.length && ["Características", `<dl class="mini-specs">${S.specs.map((x) => `<div><dt>${esc(x.label)}</dt><dd>${stOf(x) !== "pendente" && x.value ? esc(x.value) + " " : ""}${stBadge(x)}</dd></div>`).join("")}</dl>`],
        S.accessories && ["Na caixa", S.accessories.length ? `<ul class="box-list">${S.accessories.map((a) => `<li>${icon("check")}<span>${esc(a.name)}</span> ${stBadge(a)}</li>`).join("")}</ul>` : `<p>Lista por confirmar.</p>`],
        S.shipping?.length && ["Envio e devoluções", `<ul class="box-list">${S.shipping.map((x) => `<li>${icon(x.icon)}<span><b>${esc(x.title)}.</b> ${esc(x.text)}</span> ${stBadge(x)}</li>`).join("")}</ul>`],
      ].filter(Boolean);
      return `<div class="container pdp">
        <div class="pdp-gallery" data-enter style="--i:0">
          <div class="pdp-main" id="pdpMain" tabindex="0" aria-roledescription="carrossel" aria-label="Imagens do produto">
            ${imgs.map((im, i) => `<img src="${esc(url(im.src))}" alt="${esc(im.alt)}" width="1200" height="1200" class="${i === 0 ? "is-on" : ""}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} data-i="${i}">`).join("")}
            ${imgs.length > 1 ? `<button class="pdp-nav pdp-prev" type="button" aria-label="Imagem anterior">${icon("chevl")}</button><button class="pdp-nav pdp-next" type="button" aria-label="Imagem seguinte">${icon("chevr")}</button>` : ""}
            ${p.imagesAreIllustrations ? `<span class="pdp-note">Imagem ilustrativa</span>` : ""}
            <span class="pdp-count" id="pdpCount">1 / ${imgs.length}</span>
          </div>
          ${imgs.length > 1 ? `<div class="pdp-thumbs" role="group" aria-label="Escolher imagem">${imgs.map((im, i) => `<button type="button" data-i="${i}" aria-current="${i === 0}" aria-label="Imagem ${i + 1}: ${esc(im.alt)}"><img src="${esc(url(im.src))}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
        </div>
        <div class="pdp-info">
          <div class="pdp-top" data-enter style="--i:1">
            ${p.badge ? `<span class="badge-soft">${esc(p.badge)}</span>` : ""}
            <h1>${esc(p.name)}</h1>
            <p class="pdp-pitch">${esc(p.pitch || "")}</p>
          </div>
          <div class="pdp-price" data-enter style="--i:2">${hasPrice ? `<span class="now">${money(p.price)}</span>${p.compareAtPrice ? `<s>${money(p.compareAtPrice)}</s><span class="save">-${Math.round((1 - p.price / p.compareAtPrice) * 100)}%</span>` : ""}<small>IVA incluído</small>` : `<span class="soon">Preço em breve</span>`}</div>
          ${p.bullets?.length ? `<ul class="pdp-bullets" data-enter style="--i:3">${p.bullets.map((b) => `<li>${icon("check")}${esc(b)}</li>`).join("")}</ul>` : ""}
          <div class="pdp-buy" data-enter style="--i:4">
            ${hasPrice ? `<div class="qty" role="group" aria-label="Quantidade"><button type="button" data-qty="-1" aria-label="Menos um">${icon("minus")}</button><output id="qtyOut" aria-live="polite">1</output><button type="button" data-qty="1" aria-label="Mais um">${icon("plus")}</button></div>
              <button class="btn btn--buy" id="addToCart" type="button">${icon("cart")}Adicionar ao carrinho</button>`
            : `<a class="btn btn--buy" href="#interesse">${esc(S.interest.button)} quando abrir ${icon("arrow")}</a>
              <p class="note">Ainda não estamos a vender. Deixa o email e recebes o preço de lançamento.</p>`}
          </div>
          ${S.trust?.length ? `<ul class="pdp-trust" data-enter style="--i:5">${S.trust.map((t) => `<li>${icon(t.icon)}<span>${esc(t.text)}</span></li>`).join("")}</ul>` : ""}
          <div class="tabs" data-enter style="--i:6">${tabs.map(([t, body], i) => `<div class="tab ${i === 0 ? "is-open" : ""}">
            <button class="tab-q" type="button" aria-expanded="${i === 0}" aria-controls="tab-${i}" id="tab-q-${i}">${esc(t)}${icon("chevd")}</button>
            <div class="tab-a" id="tab-${i}" role="region" aria-labelledby="tab-q-${i}"><div><div class="tab-body">${body}</div></div></div></div>`).join("")}</div>
        </div>
      </div>`;
    },
    storyImg: () => {
      const st = S.story; if (!st?.steps?.length || !st.steps[0].image) return null;
      return `<div class="container">
        <div class="section-head"><span class="eyebrow">${esc(st.eyebrow || "Como funciona")}</span><h2>${esc(st.title)}</h2></div>
        <div class="story story--img">
          <div class="story-visual"><div class="story-frame" id="storyFrame">${st.steps.map((x, i) => `<img src="${esc(url(x.image))}" alt="" loading="lazy" class="${i === 0 ? "is-on" : ""}" data-i="${i}">`).join("")}${product.imagesAreIllustrations ? `<span class="pdp-note">Imagem ilustrativa</span>` : ""}</div></div>
          <ol class="story-steps">${st.steps.map((x, i) => `<li class="story-step ${i === 0 ? "is-active" : ""}" data-i="${i}"><span class="story-n">${i + 1}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join("")}</ol>
        </div>
      </div>`;
    },
    compare: () => {
      const c = S.compare; if (!c?.rows?.length) return null;
      return `<div class="container">
        <div class="section-head section-head--center"><span class="eyebrow">Comparação</span><h2>${esc(c.title)}</h2></div>
        <div class="cmp" data-reveal><table><thead><tr><th></th>${c.cols.map((h, i) => `<th class="${i === c.cols.length - 1 ? "us" : ""}">${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${c.rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map((v, i) => `<td class="${i === r.length - 2 ? "us" : ""}">${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      </div>`;
    },
    problem: () => {
      const pb = S.problem; if (!pb?.points?.length) return null;
      return `<div class="container problem">
        <div class="problem-head" data-reveal><span class="eyebrow">${esc(pb.eyebrow || "O problema")}</span><h2>${esc(pb.title)}</h2></div>
        <div class="problem-list">${pb.points.map((p, i) => `<article class="problem-item" data-reveal><span class="problem-n">0${i + 1}</span><div class="problem-ic">${icon(p.icon)}</div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></article>`).join("")}</div>
      </div>`;
    },
    story: () => {
      const st = S.story; if (!st?.steps?.length || st.steps[0].image) return null;
      return `<div class="container">
        <div class="section-head"><span class="eyebrow">${esc(st.eyebrow || "Como funciona")}</span><h2>${esc(st.title)}</h2></div>
        <div class="story">
          <div class="story-visual"><div class="story-sticky" data-state="${esc(st.steps[0].state)}" id="storyVisual">${kitSVG("kitStory")}<span class="stage-note">Ilustração</span></div></div>
          <ol class="story-steps">${st.steps.map((x, i) => `<li class="story-step ${i === 0 ? "is-active" : ""}" data-state="${esc(x.state)}"><span class="story-n">${i + 1}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join("")}</ol>
        </div>
      </div>`;
    },
    specs: () => {
      if (isPdp || !S.specs?.length) return null;
      const done = S.specs.filter((x) => stOf(x) === "verificado" && x.value);
      return `<div class="container specs-wrap">
        <div class="section-head"><span class="eyebrow">Características</span><h2>${done.length ? "Características confirmadas" : "Características do modelo"}</h2>
          <p>${done.length === S.specs.length ? "Dados confirmados com o fabricante." : "Só mostramos valores depois de os confirmarmos com o fabricante e de testarmos o aparelho."}</p></div>
        <dl class="specs" data-reveal>${S.specs.map((x) => `<div class="spec"><dt>${esc(x.label)}</dt><dd>${stOf(x) !== "pendente" && x.value ? esc(x.value) + " " : ""}${stBadge(x)}</dd></div>`).join("")}</dl>
      </div>`;
    },
    accessories: () => {
      if (isPdp || !S.accessories) return null;
      return `<div class="container">
        <div class="section-head"><span class="eyebrow">Na caixa</span><h2>Acessórios incluídos</h2></div>
        ${S.accessories.length ? `<div class="acc-rail" data-reveal>${S.accessories.map((a) => `<article class="acc"><div class="acc-img">${a.image ? `<img src="${esc(url(a.image))}" alt="${esc(a.name)}" loading="lazy">` : icon("box")}</div><h3>${esc(a.name)}</h3>${a.text ? `<p>${esc(a.text)}</p>` : ""}</article>`).join("")}</div>`
        : `<div class="empty-state" data-reveal>${icon("box")}<div><h3>Lista por confirmar</h3><p>Publicamos a lista exata do que vem na caixa quando o modelo estiver escolhido. Não mostramos acessórios que não possamos garantir.</p></div></div>`}
      </div>`;
    },
    shipping: () => !isPdp && S.shipping?.length ? `<div class="container">
        <div class="section-head"><span class="eyebrow">Envio e devoluções</span><h2>Antes de comprares</h2></div>
        <div class="ship-grid">${S.shipping.map((x) => `<article class="ship" data-reveal><div class="ship-ic">${icon(x.icon)}</div><div><h3>${esc(x.title)} ${stBadge(x)}</h3><p>${esc(x.text)}</p></div></article>`).join("")}</div>
      </div>` : null,
    ad: (el) => {
      const a = S.ads?.[+el.dataset.ad];
      if (!a) return null;
      return `<div class="container"><a class="ad-banner" href="${esc(url(a.href))}" ${a.offer ? `data-offer-qty="${a.offer}"` : ""}><img src="${esc(url(a.image))}" alt="${esc(a.alt)}" loading="lazy" width="1600" height="800"></a></div>`;
    },
    steps: () => S.steps?.length ? `<div class="container">
        <div class="section-head"><span class="eyebrow">Como funciona</span><h2>Simples, do início ao fim</h2></div>
        <div class="steps">${S.steps.map((s) => `<div class="step" data-reveal><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("")}</div>
      </div>` : null,
    faq: () => S.faq?.length ? `<div class="container">
        <div class="section-head section-head--center"><span class="eyebrow">Perguntas</span><h2>Perguntas frequentes</h2></div>
        <div class="faq">${S.faq.map((f, i) => `<div class="faq-item">
          <h3><button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">${esc(f.q)}${icon("plus")}</button></h3>
          <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join("")}</div>
      </div>` : null,
    interest: () => `<div class="container"><div class="form-panel" data-reveal>
        <div><h2>${esc(S.interest.title)}</h2><p>${esc(S.interest.text)}</p></div>
        <form class="form" data-form="interesse" novalidate>
          <div class="field">
            <label for="int-email">Email</label>
            <div class="inline-form">
              <input class="input" id="int-email" name="email" type="email" autocomplete="email" required placeholder="o.teu@email.com" aria-describedby="int-email-err">
              <button class="btn" type="submit">${esc(S.interest.button)}</button>
            </div>
            <p class="field-error" id="int-email-err" aria-live="polite"></p>
          </div>
          <label class="check"><input type="checkbox" name="consent" required aria-describedby="int-consent-err"> <span>Aceito receber emails sobre o lançamento. Posso cancelar a qualquer momento. Ver <a class="link" href="${esc(url("legal/privacidade.html"))}">Privacidade</a>.</span></label>
          <p class="field-error" id="int-consent-err" aria-live="polite"></p>
          <div class="hp" aria-hidden="true"><label>Não preencher <input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
          <input type="hidden" name="form" value="lista-de-espera">
          <div data-status aria-live="polite"></div>
        </form>
      </div></div>`,
  };
  $$("[data-render]").forEach((el) => {
    const html = R[el.dataset.render]?.(el);
    if (html == null) el.hidden = true; else el.innerHTML = html;
  });
  // preenche dados de contacto/legais em páginas interiores
  $$("[data-fill]").forEach((el) => {
    const v = el.dataset.fill.split(".").reduce((o, k) => o?.[k], S);
    el.innerHTML = el.dataset.fill === "contact.email" && v ? `<a class="link" href="mailto:${esc(v)}">${esc(v)}</a>` : fill(v);
  });
  $$("[data-brand]").forEach((el) => el.textContent = S.brand.name);

  // ---------- menu móvel ----------
  const menuBtn = $("#menuBtn"), menu = $("#mobileMenu");
  if (menuBtn && menu) {
    const setMenu = (open) => {
      menu.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      menuBtn.innerHTML = icon(open ? "close" : "menu");
      document.body.classList.toggle("menu-open", open);
      if (open) menu.querySelector("a")?.focus();
    };
    menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); } });
    matchMedia("(min-width: 900px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  // ---------- cabeçalho com sombra ao fazer scroll ----------
  const sh = $("#siteHeader");
  if (sh) { const onScroll = () => sh.classList.toggle("is-scrolled", scrollY > 8); addEventListener("scroll", onScroll, { passive: true }); onScroll(); }

  // ---------- perguntas ----------
  $$(".faq-q").forEach((b) => b.addEventListener("click", () => {
    const item = b.closest(".faq-item"), open = !item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    b.setAttribute("aria-expanded", open);
  }));

  // ---------- galeria ----------
  $$(".gallery-thumbs button").forEach((b) => b.addEventListener("click", () => {
    $("#galleryMain").src = b.dataset.src;
    $$(".gallery-thumbs button").forEach((x) => x.setAttribute("aria-current", x === b));
  }));

  // ---------- ofertas ----------
  function selectOffer(i) {
    offerIdx = i;
    const o = offers[i]; if (!o) return;
    const full = o.qty * product.price, box = $("#priceBox");
    if (box) box.innerHTML = money(o.price) + (full - o.price > 0.009 ? `<s>${money(full)}</s>` : "");
    $$("input[name=offer]").forEach((r) => { r.checked = +r.value === i; r.closest(".offer").classList.toggle("is-on", r.checked); });
    const btn = $("#buyBtn");
    if (btn) btn.href = o.checkoutUrl || product.checkoutUrl || "#interesse";
  }
  $$("input[name=offer]").forEach((r) => r.addEventListener("change", () => selectOffer(+r.value)));
  if (offers.length) selectOffer(offerIdx);
  $$("[data-offer-qty]").forEach((a) => a.addEventListener("click", () => {
    const i = offers.findIndex((o) => o.qty === +a.dataset.offerQty);
    if (i >= 0) selectOffer(i);
  }));

  // ---------- galeria da página de produto ----------
  const pdpMain = $("#pdpMain");
  if (pdpMain) {
    const imgs = $$("img", pdpMain), thumbs = $$(".pdp-thumbs button");
    let cur = 0;
    const show = (i) => {
      cur = (i + imgs.length) % imgs.length;
      imgs.forEach((im, k) => im.classList.toggle("is-on", k === cur));
      thumbs.forEach((t, k) => t.setAttribute("aria-current", k === cur));
      const c = $("#pdpCount"); if (c) c.textContent = `${cur + 1} / ${imgs.length}`;
    };
    thumbs.forEach((t) => t.addEventListener("click", () => show(+t.dataset.i)));
    $(".pdp-prev", pdpMain)?.addEventListener("click", () => show(cur - 1));
    $(".pdp-next", pdpMain)?.addEventListener("click", () => show(cur + 1));
    pdpMain.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });
    let sx = null;
    pdpMain.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    pdpMain.addEventListener("touchend", (e) => { if (sx == null) return; const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) show(cur + (d < 0 ? 1 : -1)); sx = null; });
    // zoom ao passar o rato (só em ecrãs com rato)
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      pdpMain.addEventListener("mousemove", (e) => {
        if (e.target.closest("button")) return;
        const r = pdpMain.getBoundingClientRect();
        pdpMain.style.setProperty("--zx", ((e.clientX - r.left) / r.width * 100) + "%");
        pdpMain.style.setProperty("--zy", ((e.clientY - r.top) / r.height * 100) + "%");
        pdpMain.classList.add("is-zoom");
      });
      pdpMain.addEventListener("mouseleave", () => pdpMain.classList.remove("is-zoom"));
    }
  }

  // ---------- separadores (acordeão) ----------
  $$(".tab-q").forEach((b) => b.addEventListener("click", () => {
    const t = b.closest(".tab"), open = !t.classList.contains("is-open");
    t.classList.toggle("is-open", open); b.setAttribute("aria-expanded", open);
  }));

  // ---------- carrinho (só existe quando há preço) ----------
  if (product.price != null) {
    let qty = 1, cart = 0;
    try { cart = +localStorage.getItem("poupei-cart") || 0; } catch (e) {}
    const saveCart = () => { try { localStorage.setItem("poupei-cart", cart); } catch (e) {} };
    const drawer = document.createElement("div");
    drawer.innerHTML = `<div class="drawer-bg" id="drawerBg" hidden></div>
      <aside class="drawer" id="drawer" aria-label="Carrinho" hidden tabindex="-1">
        <div class="drawer-head"><h2>Carrinho</h2><button class="icon-btn" id="drawerClose" type="button" aria-label="Fechar carrinho">${icon("close")}</button></div>
        <div class="drawer-body" id="drawerBody"></div>
        <div class="drawer-foot"><div class="drawer-total"><span>Total</span><b id="drawerTotal"></b></div>
          <button class="btn btn--buy" id="checkoutBtn" type="button">Finalizar compra</button>
          <div data-status id="checkoutStatus" aria-live="polite"></div></div>
      </aside>`;
    document.body.append(...drawer.children);
    const firstImg = imgOf(product.images?.[0] || "");
    const renderCart = () => {
      $("#cartCount") && ($("#cartCount").textContent = cart);
      $("#drawerBody").innerHTML = cart ? `<div class="line">${firstImg.src ? `<img src="${esc(url(firstImg.src))}" alt="">` : ""}
        <div><b>${esc(product.name)}</b><small>${money(product.price)}</small>
        <div class="qty qty--sm"><button type="button" data-cart="-1" aria-label="Menos um">${icon("minus")}</button><output>${cart}</output><button type="button" data-cart="1" aria-label="Mais um">${icon("plus")}</button></div></div></div>`
        : `<p class="note">O carrinho está vazio.</p>`;
      $("#drawerTotal").textContent = money(cart * product.price);
      $("#checkoutBtn").disabled = !cart;
      saveCart();
    };
    const openCart = (o) => { $("#drawer").hidden = !o; $("#drawerBg").hidden = !o; document.body.classList.toggle("menu-open", o); if (o) { renderCart(); $("#drawer").focus(); } };
    $$("[data-qty]").forEach((b) => b.addEventListener("click", () => { qty = Math.max(1, Math.min(9, qty + +b.dataset.qty)); $("#qtyOut").textContent = qty; }));
    $("#addToCart")?.addEventListener("click", (e) => {
      cart = Math.min(9, cart + qty); renderCart();
      const b = e.currentTarget; b.classList.add("is-added"); setTimeout(() => b.classList.remove("is-added"), 900);
      openCart(true);
    });
    $("#cartBtn")?.addEventListener("click", () => openCart(true));
    $("#drawerClose").addEventListener("click", () => openCart(false));
    $("#drawerBg").addEventListener("click", () => openCart(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#drawer").hidden) openCart(false); });
    $("#drawerBody").addEventListener("click", (e) => { const b = e.target.closest("[data-cart]"); if (!b) return; cart = Math.max(0, Math.min(9, cart + +b.dataset.cart)); renderCart(); });
    $("#checkoutBtn").addEventListener("click", () => {
      const box = $("#checkoutStatus");
      if (!product.checkoutUrl) { box.innerHTML = `<div class="status status--warn">${icon("info")}<span>O pagamento ainda não está ligado. Nada foi cobrado.</span></div>`; return; }
      location.href = product.checkoutUrl.replace("{qty}", cart);
    });
    renderCart();
  }

  // ---------- "como funciona" com imagens ----------
  const sframe = $("#storyFrame");
  if (sframe && "IntersectionObserver" in window) {
    const simgs = $$("img", sframe), ssteps = $$(".story--img .story-step");
    const sio2 = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = +e.target.dataset.i;
      ssteps.forEach((x) => x.classList.toggle("is-active", x === e.target));
      simgs.forEach((im, k) => im.classList.toggle("is-on", k === i));
    }), { rootMargin: "-45% 0px -45% 0px" });
    ssteps.forEach((x) => sio2.observe(x));
  }

  // ---------- "como funciona": o passo visível muda a ilustração ----------
  const steps = $$(".story-step"), storyVisual = $("#storyVisual");
  if (steps.length && storyVisual && "IntersectionObserver" in window) {
    const sio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      steps.forEach((x) => x.classList.toggle("is-active", x === e.target));
      storyVisual.dataset.state = e.target.dataset.state;
    }), { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach((x) => sio.observe(x));
  }

  // ---------- vídeos: só tocam quando estão visíveis ----------
  const vids = $$(".reel video");
  if (vids.length && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const vio = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.preload = "auto"; e.target.play().catch(() => {}); } else e.target.pause();
    }), { threshold: 0.35 });
    vids.forEach((v) => vio.observe(v));
  } else vids.forEach((v) => v.setAttribute("controls", ""));

  // ---------- antes / depois ----------
  $$(".ba").forEach((ba) => {
    const r = $(".ba-range", ba), after = $(".ba-after", ba), h = $(".ba-handle", ba);
    const set = () => { after.style.clipPath = `inset(0 0 0 ${r.value}%)`; h.style.left = r.value + "%"; };
    r.addEventListener("input", set); set();
  });

  // ---------- formulários ----------
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const MSG = {
    required: "Este campo é obrigatório.",
    email: "Escreve um email válido, por exemplo nome@exemplo.pt.",
    consent: "Para continuar, aceita a política de privacidade.",
    min: (n) => `Escreve pelo menos ${n} caracteres.`,
  };
  function errorFor(input) {
    const v = input.type === "checkbox" ? input.checked : input.value.trim();
    if (input.required && !v) return input.type === "checkbox" ? MSG.consent : MSG.required;
    if (input.type === "email" && v && !EMAIL.test(v)) return MSG.email;
    if (input.minLength > 0 && v && v.length < input.minLength) return MSG.min(input.minLength);
    return "";
  }
  function showError(input, msg) {
    const target = document.getElementById(input.getAttribute("aria-describedby")?.split(" ")[0]);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (target) target.textContent = msg;
  }
  function status(form, kind, text) {
    const box = form.querySelector("[data-status]");
    const ic = { ok: "check", warn: "info", err: "alert" }[kind];
    box.innerHTML = text ? `<div class="status status--${kind}">${icon(ic)}<span>${text}</span></div>` : "";
  }
  $$("form[data-form]").forEach((form) => {
    const fields = $$("input:not([type=hidden]):not([name=_gotcha]), textarea, select", form);
    fields.forEach((f) => {
      f.addEventListener("blur", () => { if (f.value || f.type === "checkbox") showError(f, errorFor(f)); });
      f.addEventListener("input", () => { if (f.getAttribute("aria-invalid") === "true") showError(f, errorFor(f)); });
      f.addEventListener("change", () => { if (f.type === "checkbox") showError(f, errorFor(f)); });
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status(form, "", "");
      let first = null;
      fields.forEach((f) => { const m = errorFor(f); showError(f, m); if (m && !first) first = f; });
      if (first) { first.focus(); return; }
      if (form._gotcha?.value) return; // spam
      const endpoint = S.forms?.endpoint;
      if (!endpoint) {
        status(form, "warn", S.demo
          ? "Os dados estão corretos, mas este formulário ainda não está ligado a nenhum serviço, por isso nada foi enviado. Configura <code>forms.endpoint</code> em config.js."
          : `Não foi possível enviar: o formulário ainda não está ativo.${S.contact?.email ? ` Escreve-nos para <a class="link" href="mailto:${esc(S.contact.email)}">${esc(S.contact.email)}</a>.` : ""}`);
        return;
      }
      const btn = form.querySelector("[type=submit]");
      btn.setAttribute("aria-busy", "true"); btn.disabled = true;
      try {
        const res = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.status);
        form.reset(); fields.forEach((f) => f.removeAttribute("aria-invalid"));
        status(form, "ok", form.dataset.form === "contacto" ? "Mensagem enviada. Respondemos assim que possível." : "Estás na lista. Avisamos-te por email quando houver novidades.");
      } catch (err) {
        status(form, "err", "Não foi possível enviar agora. Verifica a ligação à internet e tenta outra vez.");
      } finally {
        btn.removeAttribute("aria-busy"); btn.disabled = false;
      }
    });
  });

  // ---------- animações de entrada e de scroll ----------
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  requestAnimationFrame(() => doc.classList.add("is-loaded"));
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    // só esconde o que ainda está abaixo do ecrã: o que já se vê aparece logo
    $$("[data-reveal]").forEach((el, i) => {
      if (el.getBoundingClientRect().top > innerHeight * 0.92) {
        el.style.setProperty("--i", i % 4);
        el.classList.add("will-reveal");
        io.observe(el);
      }
    });
  }
})();
