/* ========================== Adicionar refeição ========================== */
let sample = null;
const aiReady = (async () => { try { sample = (window.claude && await window.claude.use("sample")) || (BRAND.aiEndpoint ? remoteAI(BRAND.aiEndpoint) : null); } catch(e) { sample = null; } })();
async function shrink(file){ const img = await createImageBitmap(file); const s = Math.min(1, 1024/Math.max(img.width, img.height));
  const c = document.createElement("canvas"); c.width = Math.round(img.width*s); c.height = Math.round(img.height*s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  return new Promise(r => c.toBlob(r, "image/jpeg", .82)); }
function addEntry(k, e){ setTimeout(() => say("meal"), 400); (S.days[k] = S.days[k] || []).push(Object.assign({ id:uid(), t:new Date().toLocaleTimeString("pt-PT", { hour:"2-digit", minute:"2-digit" }), q:"" }, e)); save(); ach("meal"); syncChallenges(); }
// Imagens no Registar: foto da receita, foto do alimento ou, sem nenhuma, o mosaico desenhado da refeição.
const MEAL_PIC = { "Pequeno-almoço":"Papas de aveia com banana", "Almoço":"Frango grelhado com arroz e salada", "Lanche":"Iogurte com frutos vermelhos e nozes", "Jantar":"Salmão no forno com brócolos" };
const recByName = n => { const k = norm(n).trim(); return RECIPES.find(r => norm(r.n) === k); };
const picOf = (name, meal) => { const r = recByName(name); return (r && photoOf(r)) || (typeof PHOTO_FOOD !== "undefined" && PHOTO_FOOD[name]) || ""; };
const thumb = (name, meal, size = 48) => { const src = picOf(name, meal); return src ? `<img class="th" src="${esc(src)}" alt="" loading="lazy" style="width:${size}px;height:${size}px">` : artTile(MEAL_ART[meal] || "almoco", size, "th"); };
const mealPic = m => { const r = recByName(MEAL_PIC[m] || "") || RECIPES.find(x => x.c === m && photoOf(x)); return r ? photoOf(r) : ""; };
function openAdd(meal, tab="foto"){
  let cur = MEALS.some(m => m.id === meal) ? meal : defMeal();
  openSheet("Registar", `<div class="mealchips" id="a-meals" role="radiogroup" aria-label="Refeição">${MEALS.map(m => { const src = mealPic(m.id), [c1, c2] = ART_BG[MEAL_ART[m.id]] || ART_BG.almoco;
      return `<button role="radio" data-m="${m.id}" aria-checked="${m.id === cur}" class="mc ${m.id === cur ? "on" : ""}" style="--a1:${c1};--a2:${c2}">${src ? `<img src="${esc(src)}" alt="">` : `<span class="mc-art">${artSVG(MEAL_ART[m.id], 40)}</span>`}<span class="mc-l">${m.id === "Pequeno-almoço" ? "Peq.-almoço" : m.id}</span><i class="mc-ok">${icon("check","xs")}</i></button>`; }).join("")}</div>
    <select id="a-meal" class="hide" aria-hidden="true" tabindex="-1">${MEALS.map(m => `<option ${m.id === cur ? "selected" : ""}>${m.id}</option>`).join("")}</select>
    <p class="tiny muted" style="margin-top:8px">${esc(fmtDay(curDay))}</p>
    <div class="seg" id="a-tabs" style="margin-top:12px" role="tablist"><button data-t="foto" role="tab">${icon("camera","xs")} Foto</button><button data-t="pesq" role="tab">${icon("search","xs")} Pesquisar</button><button data-t="manual" role="tab">${icon("brush","xs")} Manual</button><button data-t="rec" role="tab">${icon("copy","xs")} Repetir</button></div>
    <div id="a-body" style="margin-top:16px"></div>`, body => {
    $$("#a-meals button", body).forEach(b => b.onclick = () => { cur = b.dataset.m; $("#a-meal", body).value = cur; $$("#a-meals button", body).forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); }); });
    const show = (t, arg) => { $$("#a-tabs button", body).forEach(b => { b.classList.toggle("on", b.dataset.t === t); b.setAttribute("aria-selected", b.dataset.t === t); }); const el = $("#a-body", body); el.onclick = null; el.oninput = null; ADD[t](el, arg); };
    addTab = show;
    $$("#a-tabs button", body).forEach(b => b.onclick = () => show(b.dataset.t)); show(tab);
  });
}
let addTab = () => {};
const mealSel = () => $("#a-meal").value;
const AIERR = { offline:"Sem ligação à internet. Liga-te e tenta outra vez, ou regista à mão.", timeout:"A análise demorou demasiado. Tenta outra vez ou regista à mão.", error:"O servidor de IA falhou. Tenta outra vez.",
  not_granted:"Permissão negada para usar a IA.", rate_limited:"Atingiste o limite de análises por agora. Tenta mais tarde ou regista à mão.", images_unavailable:"Envio de imagens indisponível aqui.", bad:"A resposta da IA veio incompleta. Tenta outra foto ou regista à mão." };
// Números que a IA devolve como texto ("195 kcal", "0,5") passam a número; o resto fica 0.
const toN = (v, max = 5000) => { const m = String(v ?? "").replace(",", ".").match(/\d+(\.\d+)?/); return m ? clamp(Math.round(+m[0]), 0, max) : 0; };
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({ code:"timeout" }), ms))]);
const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function cleanAI(r){ // só aceita o formato pedido; nunca inventa itens
  if (!r || typeof r !== "object") throw { code:"bad" };
  const itens = (Array.isArray(r.itens) ? r.itens : []).filter(x => x && typeof x === "object" && String(x.nome || "").trim()).slice(0, 12).map(x => ({
    nome:String(x.nome).trim().slice(0, 60), porcao:String(x.porcao || "").slice(0, 30), confianca:["alta","media","baixa"].includes(x.confianca) ? x.confianca : "media", x:1,
    b:{ kcal:toN(x.kcal), proteina_g:toN(x.proteina_g, 500), carbo_g:toN(x.carbo_g, 1000), gordura_g:toN(x.gordura_g, 500) } }));
  return { refeicao:String(r.refeicao || "Refeição").slice(0, 60), clara:r.clara !== false && itens.length > 0, pergunta:String(r.pergunta || "").slice(0, 200), observacao:String(r.observacao || "").slice(0, 200), itens };
}
const ADD = {
  foto(el){
    let blob = null, cur = null, ctl = null;
    const TIPS = [["sparkle","Boa luz, de preferência natural"],["camera","De cima, com o prato inteiro"],["info","Diz o que não se vê (molhos, óleo)"]];
    const HINTS = ["Com azeite", "Sem óleo", "Frito", "Grelhado", "Integral", "Com molho"];
    const idle = () => { el.classList.remove("busy", "has-res"); el.innerHTML = `<div id="a-st"></div>
      <div class="cam" id="a-pick"><div class="cam-vf"><i class="cc tl"></i><i class="cc tr"></i><i class="cc bl"></i><i class="cc br"></i>
        <span class="cam-plate">${icon("bowl")}</span><b>Enquadra o prato inteiro</b><small>De cima, com boa luz</small></div>
        <div class="cam-bar"><label class="cam-side" for="f-gal">${icon("image","sm")}<span>Galeria</span></label>
          <label class="cam-shutter" for="f-cam" aria-label="Tirar foto"><i></i></label>
          <button class="cam-side" id="a-gopq2">${icon("search","sm")}<span>Pesquisar</span></button></div></div>
      <p class="tiny muted cam-note">${icon("info","xs")} O resultado é uma <b>estimativa</b>. Revês e corriges tudo antes de guardar.</p>`;
      $("#a-gopq2", el).onclick = () => addTab("pesq");
      aiReady.then(() => { if (sample || !el.isConnected) return; const st = $("#a-st", el); if (!st) return;
        st.innerHTML = `<div class="note warn" style="margin-bottom:12px">${icon("info","sm")}<span>A análise de fotos ainda não está ligada nesta versão, por isso não analisamos a imagem. Podes pesquisar o alimento ou registar à mão.</span></div>
          <div class="row" style="gap:8px;margin-bottom:14px"><button class="btn soft grow sm" id="a-gopq">${icon("search","sm")} Pesquisar</button><button class="btn soft grow sm" id="a-goman">Registar à mão</button></div>`;
        const pk = $("#a-pick", el); if (pk) pk.classList.add("off");
        $("#a-gopq", el).onclick = () => addTab("pesq"); $("#a-goman", el).onclick = () => addTab("manual"); }); };
    const picked = () => { el.classList.remove("busy", "has-res"); el.innerHTML = `<div class="shot"><img id="a-prev" alt="Fotografia da refeição" src="${URL.createObjectURL(blob)}"><div class="scan hide" id="a-scan"><i></i></div>
        <label class="shot-re" for="f-gal">${icon("image","xs")} Trocar</label></div>
      <div class="a-hintw"><p class="small" style="margin:14px 0 8px"><b>Algo que não se vê?</b> <span class="muted">Opcional</span></p>
        <div class="hchips" id="a-hc">${HINTS.map(h => `<button class="chip" data-h="${h}" aria-pressed="false">${h}</button>`).join("")}</div>
        <input id="a-hint" maxlength="120" placeholder="Ou escreve (ex.: arroz integral, meia dose)" style="margin-top:10px" aria-label="Pormenor opcional"></div>
      <button class="btn block" id="a-go" style="margin-top:14px;height:52px" ${sample ? "" : "disabled"}>${icon("sparkle","sm")} Analisar a foto</button>
      <div id="a-st" style="margin-top:12px"></div><div id="a-res"></div>`;
      $("#a-hc", el).onclick = e => { const b = e.target.closest("[data-h]"); if (!b) return; const on = b.getAttribute("aria-pressed") !== "true", inp = $("#a-hint", el);
        b.setAttribute("aria-pressed", on); b.classList.toggle("on", on);
        const parts = inp.value.split(",").map(x => x.trim()).filter(x => x && x !== b.dataset.h); if (on) parts.push(b.dataset.h); inp.value = parts.join(", ").slice(0, 120); };
      $("#a-go", el).onclick = () => run(); };
    const pick = async e => { const f = e.target.files[0]; e.target.value = ""; if (!f) return;
      if (!/^image\//.test(f.type)) { toast("Escolhe uma imagem"); return; }
      try { blob = await shrink(f); } catch(err) { toast("Não consegui ler essa imagem."); return; }
      cur = null; picked(); };
    $("#f-cam").onchange = pick; $("#f-gal").onchange = pick;
    const STEPS = ["A identificar os alimentos…","A estimar as porções…","A calcular os valores…"];
    const run = async extra => {
      if (!sample) return; if (navigator.onLine === false) { fail("offline"); return; }
      const hint = ($("#a-hint", el) || {}).value || "", st = $("#a-st", el), go = $("#a-go", el), sc = $("#a-scan", el), my = ctl = {};
      go.disabled = true; sc.classList.remove("hide"); $("#a-res", el).innerHTML = ""; el.classList.add("busy"); el.classList.remove("has-res");
      let si = 0; st.innerHTML = `<div class="ai-steps" role="status">${STEPS.map((s, i) => `<div class="ai-s ${i ? "" : "on"}"><i>${icon("check","xs")}</i><span>${s.replace("…", "")}</span></div>`).join("")}
        <div class="row between" style="margin-top:6px"><small class="muted" id="a-step">Costuma demorar uns segundos</small><button class="btn ghost sm" id="a-cancel">Cancelar</button></div></div>`;
      const tick = setInterval(() => { si++; $$(".ai-s", st).forEach((x, i) => { x.classList.toggle("dn", i < Math.min(si, STEPS.length - 1)); x.classList.toggle("on", i === Math.min(si, STEPS.length - 1)); });
        if (si >= 6) { const s = $("#a-step", el); if (s) s.textContent = "Está a demorar mais do que o normal…"; } }, 2200);
      $("#a-cancel", el).onclick = () => { ctl = null; clearInterval(tick); sc.classList.add("hide"); st.innerHTML = ""; go.disabled = false; el.classList.remove("busy"); };
      const al = (S.u && S.u.al || []).filter(x => x !== "Nenhuma");
      const prompt = "Analisa a fotografia de uma refeição e identifica só os alimentos VISÍVEIS. Estima porção, kcal e macronutrientes de cada um. Sê honesto sobre a incerteza: usa confianca 'alta', 'media' ou 'baixa' em cada item. "
        + "Se a imagem estiver pouco clara, não mostrar comida, ou se um alimento for impossível de identificar, NÃO inventes: põe clara=false e escreve uma pergunta curta ao utilizador em 'pergunta'. "
        + (al.length ? "O utilizador evita: " + al.join(", ") + ". Se algum alimento visível puder conter isso, refere em 'observacao'. " : "")
        + (hint.trim() ? "Informação do utilizador: " + hint.trim().slice(0,120) + ". " : "") + (extra ? "Resposta do utilizador à tua pergunta: " + extra + ". " : "")
        + 'Responde APENAS com JSON: {"refeicao":"nome curto","clara":true,"pergunta":"","itens":[{"nome":"","porcao":"ex.: 150 g","kcal":0,"proteina_g":0,"carbo_g":0,"gordura_g":0,"confianca":"alta"}],"observacao":"1 frase sobre a incerteza"}. Números sem unidades. Usa português europeu.';
      try { const raw = await withTimeout(sample.json(prompt, { images:[blob], modelTier:"default" }), 35000); if (ctl !== my) return; cur = cleanAI(raw); st.innerHTML = ""; renderRes.seen = 0; renderRes(); ach("photo"); }
      catch(e) { if (ctl !== my) return; fail(e && e.code); }
      finally { clearInterval(tick); if (ctl === my) { sc.classList.add("hide"); go.disabled = !(blob && sample); el.classList.remove("busy"); } } };
    const fail = code => { const st = $("#a-st", el); if (!st) return;
      st.innerHTML = `<div class="note warn">${icon("info","sm")}<span>${esc(AIERR[code] || "Não foi possível analisar. Tenta outra foto ou regista à mão.")}</span></div>
        <div class="row" style="gap:8px;margin-top:10px"><button class="btn soft grow sm" id="a-retry">Tentar outra vez</button><button class="btn ghost grow sm" id="a-man">Registar à mão</button></div>`;
      $("#a-retry", el).onclick = () => run(); $("#a-man", el).onclick = () => addTab("manual", { n: ($("#a-hint", el) || {}).value || "" }); };
    const val = (it, f) => Math.round(it.b[f] * it.x);
    function renderRes(){
      const r = cur, res = $("#a-res", el);
      const ask = !r.clara ? `<div class="card stack" style="margin-bottom:12px"><div class="row">${abi({ mood:"think", size:48 })}<p><b>Não tenho a certeza.</b> ${esc(r.pergunta || "Consegues dizer-me o que está no prato?")}</p></div>
        <input id="a-ans" maxlength="160" placeholder="Ex.: é arroz de pato com salada" aria-label="Resposta"><button class="btn soft block" id="a-ansb">Responder e analisar de novo</button></div>` : "";
      const sum = f => r.itens.reduce((a, x) => a + val(x, f), 0);
      const MC = [["proteina_g","Proteína","var(--prot)",4],["carbo_g","Hidratos","var(--carb)",4],["gordura_g","Gordura","var(--fat)",9]], mk = Math.max(1, MC.reduce((a, [f,,, m]) => a + sum(f) * m, 0));
      el.classList.toggle("has-res", r.itens.length > 0);
      res.innerHTML = ask + (r.itens.length ? `<div class="ai-total2"><div class="row between"><div><small class="muted">Total estimado · ${r.itens.length} alimento${r.itens.length > 1 ? "s" : ""}</small><b class="num" id="a-tot">${sum("kcal")} kcal</b></div><span class="tag-est">aprox.</span></div>
          <div class="sbar" style="margin-top:12px">${MC.map(([f,, c, m]) => `<i style="background:${c};flex:${sum(f) * m / mk || .001}"></i>`).join("")}</div>
          <div class="ai-mac2">${MC.map(([f, n, c]) => `<span><i style="background:${c}"></i>${n}<b class="num">${sum(f)} g</b></span>`).join("")}</div></div>
        <input id="a-name" maxlength="60" value="${esc(r.refeicao)}" aria-label="Nome da refeição" style="font-weight:700;margin-top:12px">
        <div id="a-items" style="margin-top:10px">${r.itens.map((it, i) => { const cf = it.confianca;
          return `<div class="ai-item"><div class="row"><input data-i="${i}" data-f="nome" maxlength="60" value="${esc(it.nome)}" aria-label="Alimento" style="font-weight:600"><button class="iconbtn" data-del="${i}" aria-label="Remover ${esc(it.nome)}">${icon("trash","sm")}</button></div>
            <div class="row between" style="margin-top:8px"><span class="conf ${cf}">${{ alta:"Confiança alta", media:"Confiança média", baixa:"Confiança baixa" }[cf]}</span><span class="small muted">${esc(it.porcao)}</span></div>
            <div class="row between" style="margin-top:10px"><div class="stepper"><button data-dx="-1" data-i="${i}" aria-label="Menos">${icon("minus","xs")}</button><b class="num">× ${String(it.x).replace(".", ",")}</b><button data-dx="1" data-i="${i}" aria-label="Mais">${icon("plus","xs")}</button></div>
              <span class="small num">${val(it, "kcal")} kcal · P ${val(it, "proteina_g")} · H ${val(it, "carbo_g")} · G ${val(it, "gordura_g")}</span></div>
            <details class="ai-edit"><summary>Corrigir valores</summary><div class="g4" style="margin-top:8px">${[["kcal","kcal"],["proteina_g","Prot. g"],["carbo_g","Hidr. g"],["gordura_g","Gord. g"]].map(([f,l]) => `<label class="field"><span>${l}</span><input type="number" inputmode="numeric" min="0" data-i="${i}" data-v="${f}" value="${val(it, f)}"></label>`).join("")}</div></details></div>`; }).join("")}</div>
        <button class="btn ghost block sm" id="a-more" style="margin-top:10px">${icon("plus","sm")} Falta um alimento</button>
        ${r.observacao ? `<p class="small muted" style="margin-top:10px">${esc(r.observacao)}</p>` : ""}
        <button class="btn block" id="a-save" style="margin-top:12px;height:52px">Guardar no diário</button>` : "");
      if (r.itens.length && !renderRes.seen) { renderRes.seen = 1; setTimeout(() => ($(".shot", el) || res).scrollIntoView({ behavior:"smooth", block:"start" }), 420); }
      const ab = $("#a-ansb", res); if (ab) ab.onclick = () => { const v = $("#a-ans", res).value.trim(); if (!v) { toast("Escreve o que está no prato"); return; } run(v.slice(0,160)); };
      if (!r.itens.length) return;
      const items = $("#a-items", res);
      items.oninput = e => { const i = +e.target.dataset.i, it = r.itens[i]; if (!it) return;
        if (e.target.dataset.f === "nome") it.nome = e.target.value;
        const f = e.target.dataset.v; if (f) { it.b[f] = toN(e.target.value) / it.x; $("#a-tot", res).textContent = sum("kcal") + " kcal"; } };
      items.onchange = e => { if (e.target.dataset.v) renderRes(); };
      items.onclick = e => { const d = e.target.closest("[data-del]"); if (d) { r.itens.splice(+d.dataset.del, 1); renderRes(); return; }
        const s = e.target.closest("[data-dx]"); if (s) { const it = r.itens[+s.dataset.i]; it.x = clamp(Math.round((it.x + .5 * +s.dataset.dx) * 2) / 2, .5, 3); renderRes(); } };
      $("#a-more", res).onclick = () => { r.itens.push({ nome:"", porcao:"", confianca:"alta", x:1, b:{ kcal:0, proteina_g:0, carbo_g:0, gordura_g:0 } }); renderRes(); };
      $("#a-save", res).onclick = () => { const L = r.itens.filter(x => String(x.nome || "").trim());
        if (!L.length) { toast("Junta pelo menos um alimento"); return; }
        const s2 = f => L.reduce((a, x) => a + val(x, f), 0);
        addEntry(curDay, { n:($("#a-name", res).value.trim() || "Refeição").slice(0,60), k:s2("kcal"), p:s2("proteina_g"), c:s2("carbo_g"), g:s2("gordura_g"), m:mealSel(), q:L.map(x => String(x.nome).trim()).join(", ").slice(0,80), src:"foto" });
        closeSheet(); renderHoje(); toast("Refeição guardada"); };
    }
    idle();
  },
  pesq(el){
    el.innerHTML = `<div class="row" style="position:relative"><svg class="ic sm" style="position:absolute;left:14px;color:var(--muted)"><use href="#i-search"/></svg><input id="a-q" type="search" maxlength="40" placeholder="Pesquisar alimento ou receita" style="padding-left:42px" aria-label="Pesquisar alimento ou receita"></div>
      <div id="a-fl" style="margin-top:8px"></div><p class="tiny muted" style="margin-top:10px">Valores médios aproximados. Confirma sempre no rótulo.</p>`;
    const m = mealSel();
    const list = () => { const raw = $("#a-q", el).value.trim(), q = norm(raw), words = q.split(/\s+/).filter(Boolean), hit = n => words.every(w => norm(n).includes(w));
      const R = RECIPES.filter(r => recipeAllowed(r) && (!q ? r.c === m || (isMain(m) && isMain(r.c)) : hit(r.n))).slice(0, q ? 8 : 6);
      const F = FOODS.filter(f => !q || hit(f.n)).slice(0, 30);
      $("#a-fl", el).innerHTML = (R.length ? `<p class="shop-cat">${q ? "Receitas" : "Receitas para " + m.toLowerCase()}</p>${R.map(r => `<button class="food rfood" data-r="${r.id}">${thumb(r.n, r.c, 52)}<span class="lt"><b>${esc(r.n)}</b><small>${kcalOn() ? r.k + " kcal · " : ""}P ${r.p} · H ${r.h} · G ${r.g} por porção</small></span>${icon("plus","sm")}</button>`).join("")}` : "")
        + (F.length ? `<p class="shop-cat">Alimentos simples</p>${F.map(f => `<button class="food rfood" data-f="${esc(f.n)}">${thumb(f.n, m, 52)}<span class="lt"><b>${esc(f.n)}</b><small>${kcalOn() ? f.k + " kcal · " : ""}P ${f.p} · H ${f.c} · G ${f.g} por 100 g</small></span>${icon("plus","sm")}</button>`).join("")}` : "")
        || `<div class="empty">Sem resultados para "${esc(raw)}". <button class="lnk" id="a-toman">Regista à mão</button>.</div>`;
      const tm = $("#a-toman", el); if (tm) tm.onclick = () => addTab("manual", { n:raw }); };
    $("#a-q", el).oninput = list; list();
    const facts = v => `<div><b>${v.k}</b><small>kcal</small></div><div><b>${v.p}</b><small>prot. g</small></div><div><b>${v.c}</b><small>hidr. g</small></div><div><b>${v.g}</b><small>gord. g</small></div>`;
    const back = () => { el.onclick = null; ADD.pesq(el); };
    const recPortion = r => { let x = 1; el.onclick = null; const draw = () => { const v = { k:Math.round(r.k * x), p:Math.round(r.p * x), c:Math.round(r.h * x), g:Math.round(r.g * x) };
      el.innerHTML = `<button class="btn ghost sm" id="a-bk">${icon("left","sm")} Voltar</button>
        <div class="rp-head">${photoOf(r) ? `<img src="${esc(photoOf(r))}" alt="">` : ""}<div><h3>${esc(r.n)}</h3><p class="small muted">${r.t} min · porção da receita</p></div></div>
        <p class="small" style="margin-top:14px"><b>Quanto comeste?</b></p><div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap">${[.5, 1, 1.5, 2].map(q => `<button class="chip ${q === x ? "on" : ""}" data-x="${q}">${{ .5:"Meia porção", 1:"1 porção", 1.5:"1 e meia", 2:"2 porções" }[q]}</button>`).join("")}</div>
        <div class="facts" style="margin-top:14px">${facts(v)}</div><button class="btn block" id="a-ok" style="margin-top:14px">Adicionar</button>`;
      $("#a-bk", el).onclick = back; $$("[data-x]", el).forEach(b => b.onclick = () => { x = +b.dataset.x; draw(); });
      $("#a-ok", el).onclick = () => { addEntry(curDay, Object.assign({ n:r.n, m:mealSel(), q:x === 1 ? "1 porção" : String(x).replace(".", ",") + " porções", src:"recipe" }, v)); closeSheet(); renderHoje(); toast("Adicionado"); }; };
      draw(); };
    const portion = f => { el.onclick = null; el.innerHTML = `<button class="btn ghost sm" id="a-bk">${icon("left","sm")} Voltar</button>
      <div class="rp-head">${thumb(f.n, mealSel(), 72)}<div><h3>${esc(f.n)}</h3><p class="small muted">${kcalOn() ? f.k + " kcal por 100 g · " : ""}valores médios</p></div></div>
      <div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap">${[[f.q, "1 porção (" + f.q + " g)"], [50, "50 g"], [100, "100 g"], [200, "200 g"]].filter((x, i, a) => a.findIndex(y => y[0] === x[0]) === i).map(([g, l]) => `<button class="chip" data-g="${g}">${l}</button>`).join("")}</div>
      <label class="field" style="margin-top:12px"><span>Quantidade (g ou ml)</span><input id="a-g" type="number" inputmode="numeric" min="1" max="2000" value="${f.q}"></label>
      <div class="facts" style="margin-top:12px" id="a-fx"></div><button class="btn block" id="a-ok" style="margin-top:14px">Adicionar</button>`;
      const calc = () => { const g = clamp(+$("#a-g", el).value || 0, 0, 2000)/100; return { k:Math.round(f.k*g), p:Math.round(f.p*g), c:Math.round(f.c*g), g:Math.round(f.g*g) }; };
      const upd = () => { $("#a-fx", el).innerHTML = facts(calc()); $$("[data-g]", el).forEach(b => b.classList.toggle("on", +b.dataset.g === +$("#a-g", el).value)); };
      $$("[data-g]", el).forEach(b => b.onclick = () => { $("#a-g", el).value = b.dataset.g; upd(); });
      $("#a-g", el).oninput = upd; upd(); $("#a-bk", el).onclick = back;
      $("#a-ok", el).onclick = () => { const gr = +$("#a-g", el).value; if (!(gr > 0 && gr <= 2000)) { toast("Indica uma quantidade entre 1 e 2000"); return; }
        addEntry(curDay, Object.assign({ n:f.n, m:mealSel(), q:gr + " g", src:"db" }, calc())); closeSheet(); renderHoje(); toast("Adicionado"); }; };
    $("#a-fl", el).onclick = e => { const b = e.target.closest("[data-f]"); if (b) { portion(FOODS.find(f => f.n === b.dataset.f)); return; } const r = e.target.closest("[data-r]"); if (r) recPortion(RECIPES.find(x => x.id === +r.dataset.r)); };
  },
  manual(el, arg){
    el.innerHTML = `<div class="stack"><div class="man-top">${artTile(MEAL_ART[mealSel()] || "almoco", 56)}<label class="field grow"><span>O que comeste?</span><input id="m-n" class="man-n" maxlength="60" placeholder="Ex.: Sopa da avó" value="${esc((arg && arg.n) || "")}"></label></div>
      <div><p class="small" style="margin-bottom:8px"><b>Porção</b> <span class="muted">opcional</span></p><div class="hchips" id="m-qc">${["1 prato", "Meio prato", "1 taça", "1 unidade", "1 fatia"].map(q => `<button class="chip" data-q="${q}">${q}</button>`).join("")}</div>
      <input id="m-q" maxlength="30" placeholder="Ou escreve (ex.: 2 colheres)" style="margin-top:8px" aria-label="Porção"></div>
      <div class="man-mac"><p class="small" style="margin-bottom:8px"><b>Valores</b> <span class="muted">se souberes</span></p><div class="g4">${[["k","kcal"],["p","Prot. g"],["c","Hidr. g"],["g","Gord. g"]].map(([f,l]) => `<label class="field"><span>${l}</span><input id="m-${f}" type="number" inputmode="numeric" min="0" max="5000"></label>`).join("")}</div>
</div>
      <p class="tiny muted">Não sabes os valores? Deixa em branco. Registar já conta.</p>
      <button class="btn block" id="m-ok">Adicionar</button></div>`;
    $("#m-qc", el).onclick = e => { const b = e.target.closest("[data-q]"); if (!b) return; $("#m-q", el).value = b.dataset.q; $$("#m-qc .chip", el).forEach(x => x.classList.toggle("on", x === b)); };
    $("#m-ok", el).onclick = () => { const n = $("#m-n", el).value.trim(); if (!n) { toast("Escreve o nome"); return; }
      addEntry(curDay, { n:n.slice(0,60), q:$("#m-q", el).value.trim().slice(0,30), k:num($("#m-k", el).value), p:num($("#m-p", el).value,500), c:num($("#m-c", el).value,1000), g:num($("#m-g", el).value,500), m:mealSel(), src:"manual" });
      closeSheet(); renderHoje(); toast("Adicionado"); };
  },
  rec(el){
    const seen = new Map(); Object.keys(S.days).sort().reverse().forEach(d => (S.days[d]||[]).slice().reverse().forEach(m => { const key = String(m.n).trim().toLowerCase(); if (!seen.has(key)) seen.set(key, m); }));
    const items = [], row = (m, fav) => { items.push({ n:m.n, k:m.k|0, p:m.p|0, c:m.c|0, g:m.g|0, q:m.q || "" });
      return `<button class="food rfood" data-j="${items.length-1}">${thumb(m.n, m.m, 52)}<span class="lt"><b>${fav ? icon("heart-f","xs") : ""}${esc(m.n)}</b><small>${kcalOn() ? (m.k|0) + " kcal" : esc(m.m || "")}${m.q ? " · " + esc(m.q) : ""}</small></span>${icon("plus","sm")}</button>`; };
    el.innerHTML = `<p class="small muted" style="margin-bottom:10px">Toca para repetir em ${esc(mealSel().toLowerCase())}, com as mesmas quantidades.</p>` + (S.favM.length ? `<h3>Favoritas</h3><div style="margin:6px 0 16px">${S.favM.map(m => row(m, 1)).join("")}</div>` : "")
      + `<h3>Recentes</h3><div style="margin-top:6px">${[...seen.values()].slice(0, 15).map(m => row(m)).join("") || `<div class="empty">${abi({ mood:"think", size:72 })}<p>Ainda não registaste refeições. Quando registares, aparecem aqui para repetir num toque.</p></div>`}</div>`;
    el.onclick = e => { const b = e.target.closest("[data-j]"); if (!b) return; const m = items[+b.dataset.j]; addEntry(curDay, Object.assign({}, m, { m:mealSel(), src:"repeat" })); closeSheet(); renderHoje(); toast("Repetido: " + m.n); };
  }
};
function openEdit(k, id){
  const m = (S.days[k]||[]).find(x => x.id === id); if (!m) return;
  const isFav = S.favM.some(f => f.n.toLowerCase() === String(m.n).toLowerCase());
  openSheet("Editar refeição", `<div class="stack"><label class="field"><span>Nome</span><input id="e-n" maxlength="60" value="${esc(m.n)}"></label>
    <label class="field"><span>Porção ou alimentos</span><input id="e-q" maxlength="80" value="${esc(m.q || "")}"></label>
    <label class="field"><span>Refeição</span><select id="e-m">${MEALS.map(x => `<option ${x.id === m.m ? "selected" : ""}>${x.id}</option>`).join("")}</select></label>
    <div class="g4">${[["k","kcal"],["p","Prot. g"],["c","Hidr. g"],["g","Gord. g"]].map(([f,l]) => `<label class="field"><span>${l}</span><input id="e-${f}" type="number" inputmode="numeric" min="0" value="${m[f] || 0}"></label>`).join("")}</div>
    ${m.src === "foto" ? `<p class="tiny muted">Valores estimados por IA a partir de uma foto.</p>` : ""}
    <button class="btn block" id="e-ok">Guardar alterações</button>
    <div class="row"><button class="btn ghost grow sm" id="e-fav">${icon(isFav ? "heart-f" : "heart","sm")} ${isFav ? "Favorita" : "Favoritar"}</button><button class="btn ghost grow sm" id="e-dup">${icon("copy","sm")} Duplicar</button><button class="btn ghost grow sm" id="e-del" style="color:var(--accent)">${icon("trash","sm")} Apagar</button></div></div>`, b => {
    $("#e-ok", b).onclick = () => { m.n = ($("#e-n", b).value.trim() || "Refeição").slice(0,60); m.q = $("#e-q", b).value.trim().slice(0,80); m.m = $("#e-m", b).value;
      m.k = num($("#e-k", b).value); m.p = num($("#e-p", b).value,500); m.c = num($("#e-c", b).value,1000); m.g = num($("#e-g", b).value,500); save(); closeSheet(); renderHoje(); toast("Alterações guardadas"); };
    $("#e-fav", b).onclick = () => { if (isFav) S.favM = S.favM.filter(f => f.n.toLowerCase() !== String(m.n).toLowerCase()); else S.favM.unshift({ n:m.n, k:m.k, p:m.p, c:m.c, g:m.g, q:m.q || "" }); S.favM = S.favM.slice(0,30); save(); closeSheet(); toast(isFav ? "Removida das favoritas" : "Guardada nas favoritas"); };
    $("#e-dup", b).onclick = () => { addEntry(k, { n:m.n, k:m.k, p:m.p, c:m.c, g:m.g, m:m.m, q:m.q }); closeSheet(); renderHoje(); toast("Duplicada"); };
    $("#e-del", b).onclick = async () => { if (!await confirmDlg("Apagar esta refeição?", "Apagar")) return; S.days[k] = S.days[k].filter(x => x.id !== id); save(); closeSheet(); renderHoje(); toast("Apagada"); };
  });
}
$("#h-repeat").onclick = async () => { const y = S.days[addDays(curDay,-1)] || []; if (!y.length) { toast("O dia anterior não tem refeições"); return; }
  if (!await confirmDlg(`Copiar as ${y.length} refeição(ões) do dia anterior para este dia?`, "Copiar")) return;
  y.forEach(m => addEntry(curDay, { n:m.n, k:m.k, p:m.p, c:m.c, g:m.g, m:m.m, q:m.q, src:"repeat" })); renderHoje(); toast("Refeições copiadas"); };

/* ========================== IA grátis (Llama na Cloudflare) ========================== */
// Se AI_ENDPOINT estiver preenchido, a análise de fotos e o chat usam esse servidor (ver servidor/LEIA-ME.md).
async function blobB64(b){ return new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(",")[1]); fr.onerror = rej; fr.readAsDataURL(b); }); }
function remoteAI(url){
  const call = async (prompt, opt = {}) => { const body = { prompt };
    if (opt.images && opt.images[0]) body.image = await blobB64(opt.images[0]);
    let r; try { r = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(body) }); } catch(e) { throw { code:"offline" }; }
    if (r.status === 429) throw { code:"rate_limited" }; if (!r.ok) throw { code:"error" }; return r.json(); };
  const f = async (prompt, opt) => ({ text: String((await call(prompt, opt)).text || "") });
  f.json = async (prompt, opt) => { const t = String((await call(prompt + "\nResponde só com um objeto JSON válido, sem texto à volta.", opt)).text || ""); const m = t.match(/\{[\s\S]*\}/); if (!m) throw { code:"error" }; return JSON.parse(m[0]); };
  return f;
}

