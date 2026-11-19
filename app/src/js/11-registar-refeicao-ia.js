/* ========================== Adicionar refeição ========================== */
let sample = null;
const aiReady = (async () => { try { sample = (window.claude && await window.claude.use("sample")) || (BRAND.aiEndpoint ? remoteAI(BRAND.aiEndpoint) : null); } catch(e) { sample = null; } })();
async function shrink(file){ const img = await createImageBitmap(file); const s = Math.min(1, 1024/Math.max(img.width, img.height));
  const c = document.createElement("canvas"); c.width = Math.round(img.width*s); c.height = Math.round(img.height*s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  return new Promise(r => c.toBlob(r, "image/jpeg", .82)); }
function addEntry(k, e){ setTimeout(() => say("meal"), 400); (S.days[k] = S.days[k] || []).push(Object.assign({ id:uid(), t:new Date().toLocaleTimeString("pt-PT", { hour:"2-digit", minute:"2-digit" }), q:"" }, e)); save(); ach("meal"); syncChallenges(); }
function openAdd(meal, tab="foto"){
  openSheet("Adicionar", `<label class="field"><span>${esc(fmtDay(curDay))}</span><select id="a-meal" aria-label="Refeição">${MEALS.map(m => `<option ${m.id === meal ? "selected" : ""}>${m.id}</option>`).join("")}</select></label>
    <div class="seg" id="a-tabs" style="margin-top:14px" role="tablist"><button data-t="foto" role="tab">Foto</button><button data-t="pesq" role="tab">Pesquisar</button><button data-t="manual" role="tab">Manual</button><button data-t="rec" role="tab">Repetir</button></div>
    <div id="a-body" style="margin-top:16px"></div>`, body => {
    const show = t => { $$("#a-tabs button", body).forEach(b => { b.classList.toggle("on", b.dataset.t === t); b.setAttribute("aria-selected", b.dataset.t === t); }); const el = $("#a-body", body); el.onclick = null; el.oninput = null; ADD[t](el); };
    $$("#a-tabs button", body).forEach(b => b.onclick = () => show(b.dataset.t)); show(tab);
  });
}
const mealSel = () => $("#a-meal").value;
const AIERR = { offline:"Sem ligação ao servidor de IA.", error:"O servidor de IA falhou. Tenta outra vez.", not_granted:"Permissão negada para usar a IA.", rate_limited:"Muitas tentativas. Aguarda um instante.", images_unavailable:"Envio de imagens indisponível aqui." };
const ADD = {
  foto(el){
    let blob = null, cur = null;
    el.innerHTML = `<div class="pick"><label for="f-cam">${icon("camera")}Tirar foto</label><label for="f-gal">${icon("image")}Galeria</label></div>
      <img id="a-prev" class="preview hide" alt="Fotografia da refeição" style="margin-top:12px">
      <input id="a-hint" maxlength="120" placeholder="Pormenor opcional (ex.: arroz integral, sem óleo)" style="margin-top:12px" aria-label="Pormenor opcional">
      <button class="btn block" id="a-go" style="margin-top:12px" disabled>Analisar com IA</button>
      <div id="a-st" style="margin-top:12px"></div><div id="a-res"></div>
      <div class="note" style="margin-top:14px">${icon("info","sm")}<span>A análise por foto é uma <b>estimativa</b>, não uma medição. Podes corrigir tudo antes de guardar.</span></div>`;
    const st = $("#a-st", el), go = $("#a-go", el);
    aiReady.then(() => { if (!sample && el.isConnected) st.innerHTML = `<div class="note warn">${icon("info","sm")}<span>A análise por IA precisa do Claude ou do servidor grátis da Brota (servidor/LEIA-ME.md). Por agora, usa Pesquisar ou Manual.</span></div>`; });
    const pick = async e => { const f = e.target.files[0]; e.target.value = ""; if (!f) return;
      try { blob = await shrink(f); } catch(err) { toast("Não consegui ler essa imagem."); return; }
      const p = $("#a-prev", el); p.src = URL.createObjectURL(blob); p.classList.remove("hide"); $("#a-res", el).innerHTML = ""; go.disabled = !sample; };
    $("#f-cam").onchange = pick; $("#f-gal").onchange = pick;
    const run = async extra => {
      go.disabled = true; st.innerHTML = `<div class="row" style="justify-content:center">${abi({ mood:"think", size:56 })}<span class="muted">O ${esc(BRAND.mascot)} está a olhar para o teu prato…</span></div>`;
      const al = (S.u && S.u.al || []).filter(x => x !== "Nenhuma");
      const prompt = "Analisa a fotografia de uma refeição e identifica só os alimentos VISÍVEIS. Estima porção, kcal e macronutrientes de cada um. Sê honesto sobre a incerteza: usa confianca 'alta', 'media' ou 'baixa' em cada item. "
        + "Se a imagem estiver pouco clara, não mostrar comida, ou se um alimento for impossível de identificar, NÃO inventes: põe clara=false e escreve uma pergunta curta ao utilizador em 'pergunta'. "
        + (al.length ? "O utilizador evita: " + al.join(", ") + ". Se algum alimento visível puder conter isso, refere em 'observacao'. " : "")
        + ($("#a-hint", el).value.trim() ? "Informação do utilizador: " + $("#a-hint", el).value.trim().slice(0,120) + ". " : "") + (extra ? "Resposta do utilizador à tua pergunta: " + extra + ". " : "")
        + 'Responde APENAS com JSON: {"refeicao":"nome curto","clara":true,"pergunta":"","itens":[{"nome":"","porcao":"ex.: 150 g","kcal":0,"proteina_g":0,"carbo_g":0,"gordura_g":0,"confianca":"alta"}],"observacao":"1 frase sobre a incerteza"}. Usa português europeu.';
      try { cur = await sample.json(prompt, { images:[blob], modelTier:"default" }); st.innerHTML = ""; renderRes(); ach("photo"); }
      catch(e) { st.innerHTML = `<div class="note warn">${icon("info","sm")}<span>${esc(AIERR[e && e.code] || "Não foi possível analisar. Tenta outra foto ou regista à mão.")}</span></div>`; }
      finally { go.disabled = !(blob && sample); }
    };
    go.onclick = () => run();
    const itemRow = (it, i) => { const cf = ["alta","media","baixa"].includes(it.confianca) ? it.confianca : "media";
      return `<div class="ai-item"><div class="row"><input data-i="${i}" data-f="nome" maxlength="60" value="${esc(it.nome)}" aria-label="Alimento" style="font-weight:600"><span class="conf ${cf}">${{ alta:"Confiança alta", media:"Confiança média", baixa:"Confiança baixa" }[cf]}</span><button class="iconbtn" data-del="${i}" aria-label="Remover alimento">${icon("trash","sm")}</button></div>
        <input data-i="${i}" data-f="porcao" maxlength="30" value="${esc(it.porcao || "")}" placeholder="Porção" aria-label="Porção" style="margin-top:8px">
        <div class="g4" style="margin-top:8px">${[["kcal","kcal"],["proteina_g","Prot. g"],["carbo_g","Hidr. g"],["gordura_g","Gord. g"]].map(([f,l]) => `<label class="field"><span>${l}</span><input type="number" inputmode="numeric" min="0" data-i="${i}" data-f="${f}" value="${num(it[f])}"></label>`).join("")}</div></div>`; };
    function renderRes(){
      const r = cur && typeof cur === "object" ? cur : { itens:[] }; cur = r; r.itens = Array.isArray(r.itens) ? r.itens : [];
      const res = $("#a-res", el);
      const ask = (r.clara === false || !r.itens.length) ? `<div class="card stack" style="margin-bottom:12px"><div class="row">${abi({ mood:"think", size:48 })}<p><b>Não tenho a certeza.</b> ${esc(r.pergunta || "Consegues dizer-me o que está no prato?")}</p></div>
        <input id="a-ans" maxlength="160" placeholder="Ex.: é arroz de pato com salada" aria-label="Resposta"><button class="btn soft block" id="a-ansb">Responder e analisar de novo</button></div>` : "";
      res.innerHTML = ask + (r.itens.length ? `<input id="a-name" maxlength="60" value="${esc(r.refeicao || "Refeição")}" aria-label="Nome da refeição" style="font-weight:700">
        <div style="margin-top:12px" id="a-items">${r.itens.map(itemRow).join("")}</div>
        <button class="btn ghost block sm" id="a-more" style="margin-top:10px">${icon("plus","sm")} Alimento em falta</button>
        <div class="card row between" style="margin-top:12px"><b>Total estimado</b><b class="num" id="a-tot"></b></div>
        ${r.observacao ? `<p class="small muted" style="margin-top:10px">${esc(r.observacao)}</p>` : ""}
        <button class="btn block" id="a-save" style="margin-top:12px">Guardar no diário</button>` : "");
      const ab = $("#a-ansb", res); if (ab) ab.onclick = () => { const v = $("#a-ans", res).value.trim(); if (!v) { toast("Escreve o que está no prato"); return; } run(v.slice(0,160)); };
      if (!r.itens.length) return;
      const tot = () => { $("#a-tot", res).textContent = r.itens.reduce((a, x) => a + num(x.kcal), 0) + " kcal"; }; tot();
      $("#a-items", res).oninput = e => { const f = e.target.dataset.f, i = +e.target.dataset.i; if (!f || !r.itens[i]) return; r.itens[i][f] = (f === "nome" || f === "porcao") ? e.target.value : num(e.target.value); tot(); };
      $("#a-items", res).onclick = e => { const b = e.target.closest("[data-del]"); if (!b) return; r.itens.splice(+b.dataset.del, 1); renderRes(); };
      $("#a-more", res).onclick = () => { r.itens.push({ nome:"", porcao:"", kcal:0, proteina_g:0, carbo_g:0, gordura_g:0, confianca:"alta" }); renderRes(); };
      $("#a-save", res).onclick = () => { const items = r.itens.filter(x => String(x.nome||"").trim());
        if (!items.length) { toast("Junta pelo menos um alimento"); return; }
        const sum = f => items.reduce((a, x) => a + num(x[f]), 0);
        addEntry(curDay, { n:($("#a-name", res).value.trim() || "Refeição").slice(0,60), k:sum("kcal"), p:sum("proteina_g"), c:sum("carbo_g"), g:sum("gordura_g"), m:mealSel(), q:items.map(x => String(x.nome).trim()).join(", ").slice(0,80), src:"foto" });
        closeSheet(); renderHoje(); toast("Refeição guardada"); };
    }
  },
  pesq(el){
    el.innerHTML = `<div class="row" style="position:relative"><svg class="ic sm" style="position:absolute;left:14px;color:var(--muted)"><use href="#i-search"/></svg><input id="a-q" type="search" maxlength="40" placeholder="Pesquisar alimento" style="padding-left:42px" aria-label="Pesquisar alimento"></div>
      <div id="a-fl" style="margin-top:8px"></div><p class="tiny muted" style="margin-top:10px">Valores médios aproximados por 100 g, de tabelas de composição de alimentos. Confirma sempre no rótulo.</p>`;
    const list = () => { const q = $("#a-q", el).value.trim().toLowerCase(), L = FOODS.filter(f => !q || f.n.toLowerCase().includes(q)).slice(0, 40);
      $("#a-fl", el).innerHTML = L.map(f => `<button class="food" data-f="${esc(f.n)}"><span class="lt"><b>${esc(f.n)}</b><small>${f.k} kcal · P ${f.p} · H ${f.c} · G ${f.g} por 100 g</small></span>${icon("plus","sm")}</button>`).join("")
        || `<div class="empty">Sem resultados. Usa o separador Manual.</div>`; };
    $("#a-q", el).oninput = list; list();
    $("#a-fl", el).onclick = e => { const b = e.target.closest("[data-f]"); if (b) portion(FOODS.find(f => f.n === b.dataset.f)); };
    const portion = f => { el.innerHTML = `<button class="btn ghost sm" id="a-bk">${icon("left","sm")} Voltar</button>
      <h3 style="margin-top:14px">${esc(f.n)}</h3><label class="field" style="margin-top:12px"><span>Quantidade (g ou ml)</span><input id="a-g" type="number" inputmode="numeric" min="1" max="2000" value="${f.q}"></label>
      <div class="facts" style="margin-top:12px" id="a-fx"></div><button class="btn block" id="a-ok" style="margin-top:14px">Adicionar</button>`;
      const calc = () => { const g = clamp(+$("#a-g", el).value || 0, 0, 2000)/100; return { k:Math.round(f.k*g), p:Math.round(f.p*g), c:Math.round(f.c*g), g:Math.round(f.g*g) }; };
      const upd = () => { const v = calc(); $("#a-fx", el).innerHTML = `<div><b>${v.k}</b><small>kcal</small></div><div><b>${v.p}</b><small>prot. g</small></div><div><b>${v.c}</b><small>hidr. g</small></div><div><b>${v.g}</b><small>gord. g</small></div>`; };
      $("#a-g", el).oninput = upd; upd(); $("#a-bk", el).onclick = () => { el.onclick = null; ADD.pesq(el); };
      $("#a-ok", el).onclick = () => { const gr = +$("#a-g", el).value; if (!(gr > 0 && gr <= 2000)) { toast("Indica uma quantidade entre 1 e 2000"); return; }
        addEntry(curDay, Object.assign({ n:f.n, m:mealSel(), q:gr + " g", src:"db" }, calc())); closeSheet(); renderHoje(); toast("Adicionado"); }; };
  },
  manual(el){
    el.innerHTML = `<div class="stack"><label class="field"><span>Nome</span><input id="m-n" maxlength="60" placeholder="Ex.: Sopa da avó"></label>
      <label class="field"><span>Porção (opcional)</span><input id="m-q" maxlength="30" placeholder="Ex.: 1 prato"></label>
      <div class="g4">${[["k","kcal"],["p","Prot. g"],["c","Hidr. g"],["g","Gord. g"]].map(([f,l]) => `<label class="field"><span>${l}</span><input id="m-${f}" type="number" inputmode="numeric" min="0" max="5000"></label>`).join("")}</div>
      <p class="tiny muted">Não sabes os valores? Deixa em branco. Registar já conta.</p>
      <button class="btn block" id="m-ok">Adicionar</button></div>`;
    $("#m-ok", el).onclick = () => { const n = $("#m-n", el).value.trim(); if (!n) { toast("Escreve o nome"); return; }
      addEntry(curDay, { n:n.slice(0,60), q:$("#m-q", el).value.trim().slice(0,30), k:num($("#m-k", el).value), p:num($("#m-p", el).value,500), c:num($("#m-c", el).value,1000), g:num($("#m-g", el).value,500), m:mealSel(), src:"manual" });
      closeSheet(); renderHoje(); toast("Adicionado"); };
  },
  rec(el){
    const seen = new Map(); Object.keys(S.days).sort().reverse().forEach(d => (S.days[d]||[]).slice().reverse().forEach(m => { const key = String(m.n).trim().toLowerCase(); if (!seen.has(key)) seen.set(key, m); }));
    const items = [], row = (m, fav) => { items.push({ n:m.n, k:m.k|0, p:m.p|0, c:m.c|0, g:m.g|0, q:m.q || "" });
      return `<button class="food" data-j="${items.length-1}"><span class="lt"><b>${fav ? icon("heart-f","xs") : ""}${esc(m.n)}</b><small>${kcalOn() ? (m.k|0) + " kcal" : esc(m.m || "")}${m.q ? " · " + esc(m.q) : ""}</small></span>${icon("plus","sm")}</button>`; };
    el.innerHTML = (S.favM.length ? `<h3>Favoritas</h3><div style="margin:6px 0 16px">${S.favM.map(m => row(m, 1)).join("")}</div>` : "")
      + `<h3>Recentes</h3><div style="margin-top:6px">${[...seen.values()].slice(0, 15).map(m => row(m)).join("") || `<div class="empty">Ainda sem refeições registadas.</div>`}</div>`;
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

