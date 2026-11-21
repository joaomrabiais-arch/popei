/* ========================== RECEITAS ========================== */
const RF = ["Todas","Pequeno-almoço","Almoço","Lanche","Jantar","Vegetariano","Vegan","Sem lactose","Sem glúten","Até 15 min","Favoritas"];
let rFilter = "Todas";
function recipeAllowed(r){ const u = S.u || {}, al = (u.al||[]).filter(x => x !== "Nenhuma"), dt = u.diet || [];
  if (r.al.some(a => al.includes(a))) return false;
  if (r.pk && dt.includes("Não como carne de porco")) return false;
  const SYN = { "leguminosas":["grão","feijão","lentilha"], "peixe":["salmão","atum","peixe","bacalhau","pescada"], "picante":["caril","malagueta","piri"] };
  const dl = (u.dislikes || []).flatMap(x => SYN[String(x).toLowerCase()] || [String(x).toLowerCase()]).filter(Boolean);
  if (dl.length && r.i.some(i => dl.some(d => i[0].toLowerCase().includes(d)))) return false;
  const lim = dt.includes("Vegan") ? 0 : dt.includes("Vegetariano") ? 1 : dt.some(x => String(x).startsWith("Pescetariano")) ? 2 : 3; return r.d <= lim; }
function suggestRecipes(){ const m = defMeal(); return RECIPES.filter(recipeAllowed).sort((a, b) => (b.c === m) - (a.c === m) || a.t - b.t); }
const recCard = r => `<div class="rwrap"><button class="rcard" data-r="${r.id}">${recipeCover(r)}<span class="rc-k">${kcalOn() ? r.k + " kcal" : r.p + " g proteína"}</span><span class="rb"><b>${esc(r.n)}</b><small>${icon("clock","xs")} ${r.t} min · ${r.f}</small></span></button>${S.fav.includes(r.id) ? `<span class="favdot" aria-label="Favorita">${icon("heart-f","xs")}</span>` : ""}</div>`;
const bindRecCards = el => $$("[data-r]", el).forEach(b => b.onclick = () => openRecipe(+b.dataset.r));
function renderReceitas(){
  $("#r-f").innerHTML = RF.map(f => `<button class="chip ${f === rFilter ? "on" : ""}" data-f="${f}" aria-pressed="${f === rFilter}">${f === "Favoritas" ? icon("heart","xs") : ""}${f}</button>`).join("");
  $$("#r-f button").forEach(b => b.onclick = () => { rFilter = b.dataset.f; renderReceitas(); });
  const q = $("#r-q").value.trim().toLowerCase(), ok = RECIPES.filter(recipeAllowed);
  const hid = RECIPES.length - ok.length;
  const L = ok.filter(r => (!q || (r.n + " " + r.ds + " " + r.i.map(x => x[0]).join(" ")).toLowerCase().includes(q)) && ({
    "Todas":true, "Vegetariano":r.d <= 1, "Vegan":r.d === 0, "Sem lactose":!r.al.includes("Lactose"), "Sem glúten":!r.al.includes("Glúten"), "Até 15 min":r.t <= 15, "Favoritas":S.fav.includes(r.id) }[rFilter] ?? r.c === rFilter));
  $("#r-n").textContent = `${L.length} receita${L.length === 1 ? "" : "s"}` + (hid ? ` · ${hid} escondida${hid > 1 ? "s" : ""} pelas tuas alergias ou preferências` : "");
  $("#r-l").innerHTML = L.map(recCard).join("") || `<div class="empty" style="grid-column:1/-1">${abi({ mood:"think", size:80 })}<p>Nada encontrado. Experimenta outro ingrediente ou filtro.</p></div>`;
  bindRecCards($("#r-l"));
  // Descobrir: filas temáticas por cima da lista completa (só sem pesquisa nem filtro).
  let disc = $("#r-disc"); if (!disc) { disc = document.createElement("div"); disc.id = "r-disc"; $("#r-n").before(disc); }
  const rows = !q && rFilter === "Todas" ? [
    ["Ricas em proteína", ok.filter(r => r.p * 4 / r.k >= .25)], ["Doces mais leves", ok.filter(r => r.c !== "Almoço" && r.c !== "Jantar" && /chocolate|bolo|brownie|doce|gelado|mousse|assada|bolinhas|panqueca|pudim|cacau|mel\b/i.test(r.n + " " + r.i.map(x => x[0]).join(" ")))], ["Prontas em 15 minutos", ok.filter(r => r.t <= 15)],
    [kcalOn() ? "Até 400 kcal" : "Leves", ok.filter(r => r.k <= 400 && r.c !== "Lanche")], ["Sopas e caldos", ok.filter(r => artKind(r) === "sopa")],
    ["Sabores portugueses", ok.filter(r => CUISINE_OF[r.id] === "portuguesa")], ["Para cozinhar em quantidade", ok.filter(r => (r.srv || 1) >= 4 && isMain(r.c))]
  ].filter(([, R]) => R.length >= 3) : [];
  disc.innerHTML = rows.map(([t, R]) => `<div class="rrow"><div class="sec-h"><h2>${t}</h2><span class="tiny muted">${R.length}</span></div><div class="rscroll">${R.slice().sort((a, b) => !!photoOf(b) - !!photoOf(a)).slice(0, 10).map(recCard).join("")}</div></div>`).join("")
    + (rows.length ? `<div class="sec-h" style="margin-top:22px"><h2>Todas as receitas</h2></div>` : "");
  bindRecCards(disc);
}
$("#r-q").oninput = renderReceitas;
function openRecipe(id){
  const r = RECIPES.find(x => x.id === id); if (!r) return;
  if (!S.ropen.includes(id)) { S.ropen.push(id); save(); if (S.ropen.length >= 5) ach("rexp"); }
  const fav = S.fav.includes(id), base = r.srv || 1; let n = base;
  const qty = q => { const pq = parseQty(q); return pq ? fmtQty(pq.v * n / base, pq.u, pq.rest) : q; };
  const mk = Math.max(1, r.p * 4 + r.h * 4 + r.g * 9), MC = [["Proteína", r.p, 4, "var(--prot)"], ["Hidratos", r.h, 4, "var(--carb)"], ["Gordura", r.g, 9, "var(--fat)"]];
  openSheet(r.n, `<div class="rx-cover">${recipeCover(r)}<button class="rx-fav ${fav ? "on" : ""}" id="rc-fav" aria-label="${fav ? "Remover das favoritas" : "Guardar nas favoritas"}">${icon(fav ? "heart-f" : "heart","sm")}</button></div>${photoCredit(r) ? `<p class="photo-credit">${esc(photoCredit(r))}</p>` : ""}
    <p class="rx-meta">${icon("clock","xs")} ${r.t} min <i></i> ${esc(r.f)} <i></i> ${esc(r.c)}${r.d === 0 ? " <i></i> Vegan" : r.d === 1 ? " <i></i> Vegetariana" : ""}</p>
    <p class="rx-ds">${esc(r.ds)}</p>
    <div class="rx-mac"><div class="rx-k">${kcalOn() ? `<b>${r.k}</b><small>kcal por porção</small>` : `<b>${r.p} g</b><small>proteína por porção</small>`}</div>
      <div class="grow"><div class="sbar">${MC.map(([, v, m, c]) => `<i style="background:${c};flex:${v * m / mk || .001}"></i>`).join("")}</div>
      <div class="rx-ml">${MC.map(([t, v, , c]) => `<span><i style="background:${c}"></i>${t} <b>${v} g</b></span>`).join("")}</div></div></div>
    ${r.al.length ? `<p class="rx-al">${icon("info","xs")} Contém ${r.al.map(a => esc(a.toLowerCase())).join(", ")}. Confirma sempre os rótulos.</p>` : ""}
    <div class="rx-h"><h3>Ingredientes</h3><div class="stepper" aria-label="Porções"><button id="rx-m" aria-label="Menos uma porção">${icon("minus","xs")}</button><b class="num" id="rx-n"></b><button id="rx-p" aria-label="Mais uma porção">${icon("plus","xs")}</button></div></div>
    <ul class="ing rx-ing" id="rx-ing"></ul>
    <h3 style="margin-top:22px">Preparação</h3><ol class="steps rx-steps" style="margin-top:8px">${r.s.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
    <p class="tiny muted" style="margin-top:12px">Valores por porção: estimativa aproximada a partir dos ingredientes, não é análise laboratorial.</p>
    <div class="rx-act"><button class="btn block" id="rc-plan">${icon("cal","sm")} Planear</button>
      <div class="rx-act2"><button class="btn ghost sm" id="rc-shop">${icon("cart","sm")} Compras</button><button class="btn ghost sm" id="rc-eat">${icon("check","sm")} Comi</button></div></div>`, b => {
    const done = new Set();
    const draw = () => { $("#rx-n", b).textContent = pl(n, "porção", "porções"); $("#rx-m", b).disabled = n <= 1;
      $("#rx-ing", b).innerHTML = r.i.map((x, i) => `<li class="${done.has(i) ? "dn" : ""}" data-i="${i}"><span class="rx-ck">${icon("check","xs")}</span><span class="grow">${esc(x[0])}</span><span>${esc(qty(x[1]))}</span></li>`).join(""); };
    $("#rx-m", b).onclick = () => { n = Math.max(1, n - 1); draw(); }; $("#rx-p", b).onclick = () => { n = Math.min(12, n + 1); draw(); };
    $("#rx-ing", b).onclick = e => { const li = e.target.closest("[data-i]"); if (!li) return; const i = +li.dataset.i; done.has(i) ? done.delete(i) : done.add(i); draw(); };
    draw();
    $("#rc-fav", b).onclick = () => { S.fav = fav ? S.fav.filter(x => x !== id) : S.fav.concat(id); save(); if (!fav) { ach("fav"); say("fav"); } closeSheet(); toast(fav ? "Removida das favoritas" : "Guardada nas favoritas"); refreshAll(); };
    $("#rc-shop", b).onclick = () => { const k = r.i.reduce((a, x) => a + addShop(x[0], qty(x[1]), x[2]), 0); save(); toast(k ? `${pl(k, "ingrediente", "ingredientes")} na lista de compras` : "Já estavam todos na lista"); };
    $("#rc-eat", b).onclick = () => { addEntry(curDay, { n:r.n, k:r.k, p:r.p, c:r.h, g:r.g, m:r.c, q:"1 porção", src:"recipe" }); ach("cook"); closeSheet(); go("hoje"); toast("Adicionado ao diário"); };
    $("#rc-plan", b).onclick = () => openPlanAdd(today(), r);
  });
}

