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
      ${S.demo ? `<div class="demo-bar" role="note">Versão de demonstração · os textos e imagens são provisórios</div>` : ""}
      <header class="site-header" id="siteHeader">
        <div class="container header-row">
          <a class="brand" href="${esc(url("index.html"))}" aria-label="${esc(S.brand.name)}, página inicial">${brandHTML()}</a>
          <nav class="nav" aria-label="Principal">${navLinks}</nav>
          <a class="btn header-cta" href="${esc(ctaHref)}">${esc(S.interest.button || "Contactar")}</a>
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
  const placeholder = (label) => `<div class="placeholder-object">${'<div>' + icon("image") + esc(label) + "</div>"}</div>`;

  const R = {
    hero: () => {
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
        <div class="stage" data-enter style="--i:2" aria-hidden="${product.images?.length ? "false" : "true"}">
          <div class="stage-card"></div>
          <div class="stage-ring"></div>
          <div class="stage-plinth"></div>
          <div class="stage-product">${product.images?.length ? `<img src="${esc(url(product.images[0]))}" alt="${esc(product.name || S.brand.name)}" fetchpriority="high">` : placeholder("Imagem do produto")}</div>
          ${chips.map((c) => `<span class="stage-chip">${icon(c.icon)}${esc(c.text)}</span>`).join("")}
        </div>
      </div>`;
    },
    trust: () => S.trust?.length ? `<div class="container trust-row">${S.trust.map((c) => `<div class="trust-item">${icon(c.icon)}<span>${esc(c.text)}</span></div>`).join("")}</div>` : null,
    product: () => {
      const imgs = product.images || [];
      return `<div class="container">
        <div class="section-head"><span class="eyebrow">O produto</span><h2>${hasProduct ? esc(product.name) : "Produto em preparação"}</h2></div>
        <div class="product">
          <div class="gallery" data-reveal>
            <div class="gallery-main">${imgs.length ? `<img id="galleryMain" src="${esc(url(imgs[0]))}" alt="${esc(product.name)}" width="1200" height="1200">` : placeholder("As fotografias reais do produto entram aqui")}</div>
            ${imgs.length > 1 ? `<div class="gallery-thumbs" role="group" aria-label="Fotografias">${imgs.map((src, i) =>
              `<button type="button" data-src="${esc(url(src))}" aria-current="${i === 0}" aria-label="Fotografia ${i + 1}"><img src="${esc(url(src))}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
          </div>
          <div class="product-info" data-reveal>
            ${hasProduct ? "" : `<span class="tag">${icon("info")}Produto ainda não definido</span>`}
            <h3>${hasProduct ? esc(product.name) : "O teu produto aparece aqui"}</h3>
            ${product.price != null ? `<div class="price">${money(product.price)}${product.compareAtPrice ? `<s>${money(product.compareAtPrice)}</s>` : ""}</div>` : ""}
            <p class="product-desc">${hasProduct ? esc(product.description) : "Quando escolheres o produto, preenche o nome, a descrição, o preço e as fotografias em config.js. Esta secção monta-se sozinha."}</p>
            ${product.highlights?.length ? `<ul class="checklist">${product.highlights.map((h) => `<li>${icon("check")}${esc(h)}</li>`).join("")}</ul>` : ""}
            <a class="btn" href="${esc(buyHref)}"${product.checkoutUrl ? ' rel="noopener"' : ""}>${esc(buyLabel)} ${icon("arrow")}</a>
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
      const m = S.media || {};
      if (!m.video && !m.images?.length && !S.demo) return null;
      const body = m.video
        ? `<div class="media-frame"><video src="${esc(url(m.video))}" ${m.poster ? `poster="${esc(url(m.poster))}"` : ""} controls playsinline preload="metadata"></video></div>`
        : m.images?.length
          ? `<div class="media-grid">${m.images.map((src) => `<img src="${esc(url(src))}" alt="" loading="lazy">`).join("")}</div>`
          : `<div class="media-frame"><div class="media-placeholder"><div><div class="play">${icon("play")}</div>O vídeo de demonstração do produto entra aqui</div></div></div>`;
      return `<div class="container"><div class="section-head"><span class="eyebrow">Demonstração</span><h2>${esc(m.title)}</h2></div><div data-reveal>${body}</div></div>`;
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
    const html = R[el.dataset.render]?.();
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
