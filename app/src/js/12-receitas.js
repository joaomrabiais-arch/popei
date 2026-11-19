/* ========================== RECEITAS ========================== */
const RF = ["Todas","Pequeno-almoço","Almoço","Lanche","Jantar","Vegetariano","Vegan","Sem lactose","Sem glúten","Até 15 min","Favoritas"];
let rFilter = "Todas";
function recipeAllowed(r){ const u = S.u || {}, al = (u.al||[]).filter(x => x !== "Nenhuma"), dt = u.diet || [];
  if (r.col_id && !S.owned.includes(r.col_id)) return false;
  if (r.al.some(a => al.includes(a))) return false;
  const SYN = { "leguminosas":["grão","feijão","lentilha"], "peixe":["salmão","atum","peixe","bacalhau","pescada"], "picante":["caril","malagueta","piri"] };
  const dl = (u.dislikes || []).flatMap(x => SYN[String(x).toLowerCase()] || [String(x).toLowerCase()]).filter(Boolean);
  if (dl.length && r.i.some(i => dl.some(d => i[0].toLowerCase().includes(d)))) return false;
  const lim = dt.includes("Vegan") ? 0 : dt.includes("Vegetariano") ? 1 : dt.some(x => String(x).startsWith("Pescetariano")) ? 2 : 3; return r.d <= lim; }
function suggestRecipes(){ const m = defMeal(); return RECIPES.filter(recipeAllowed).sort((a, b) => (b.c === m) - (a.c === m) || a.t - b.t); }
const recCard = r => `<div class="rwrap"><button class="rcard" data-r="${r.id}">${recipeCover(r)}<span class="rb"><b>${esc(r.n)}</b><small>${icon("clock","xs")} ${r.t} min · ${r.f}</small></span></button>${S.fav.includes(r.id) ? `<span class="favdot" aria-label="Favorita">${icon("heart-f","xs")}</span>` : ""}</div>`;
const bindRecCards = el => $$("[data-r]", el).forEach(b => b.onclick = () => openRecipe(+b.dataset.r));
function renderReceitas(){
  $("#r-f").innerHTML = RF.map(f => `<button class="chip ${f === rFilter ? "on" : ""}" data-f="${f}" aria-pressed="${f === rFilter}">${f === "Favoritas" ? icon("heart","xs") : ""}${f}</button>`).join("");
  $$("#r-f button").forEach(b => b.onclick = () => { rFilter = b.dataset.f; renderReceitas(); });
  const q = $("#r-q").value.trim().toLowerCase(), ok = RECIPES.filter(recipeAllowed);
  const hid = RECIPES.filter(r => !r.col_id || S.owned.includes(r.col_id)).length - ok.length;
  const L = ok.filter(r => (!q || (r.n + " " + r.ds + " " + r.i.map(x => x[0]).join(" ")).toLowerCase().includes(q)) && ({
    "Todas":true, "Vegetariano":r.d <= 1, "Vegan":r.d === 0, "Sem lactose":!r.al.includes("Lactose"), "Sem glúten":!r.al.includes("Glúten"), "Até 15 min":r.t <= 15, "Favoritas":S.fav.includes(r.id) }[rFilter] ?? r.c === rFilter));
  $("#r-n").textContent = `${L.length} receita${L.length === 1 ? "" : "s"}` + (hid ? ` · ${hid} escondida${hid > 1 ? "s" : ""} pelas tuas alergias ou preferências` : "");
  $("#r-l").innerHTML = L.map(recCard).join("") || `<div class="empty" style="grid-column:1/-1">${abi({ mood:"think", size:80 })}<p>Nada encontrado. Experimenta outro ingrediente ou filtro.</p></div>`;
  bindRecCards($("#r-l"));
}
$("#r-q").oninput = renderReceitas;
function openRecipe(id){
  const r = RECIPES.find(x => x.id === id); if (!r) return;
  if (!S.ropen.includes(id)) { S.ropen.push(id); save(); if (S.ropen.length >= 5) ach("rexp"); }
  const fav = S.fav.includes(id);
  openSheet(r.n, `<div style="border-radius:20px;overflow:hidden">${recipeCover(r)}</div>${photoCredit(r) ? `<p class="photo-credit">${esc(photoCredit(r))}</p>` : ""}
    <p style="margin-top:14px">${esc(r.ds)}</p>
    <div style="margin-top:12px"><span class="tag">${icon("clock","xs")} ${r.t} min</span><span class="tag">${r.f}</span><span class="tag">${r.c}</span>${r.d === 0 ? '<span class="tag">Vegan</span>' : r.d === 1 ? '<span class="tag">Vegetariana</span>' : ""}${r.al.map(a => `<span class="tag warn">Contém ${esc(a.toLowerCase())}</span>`).join("")}</div>
    <div class="facts" style="margin-top:8px"><div><b>${r.k}</b><small>kcal</small></div><div><b>${r.p} g</b><small>proteína</small></div><div><b>${r.h} g</b><small>hidratos</small></div><div><b>${r.g} g</b><small>gordura</small></div></div>
    <p class="tiny muted" style="margin-top:6px">Receita para ${r.srv || 1} ${(r.srv || 1) > 1 ? "porções" : "porção"}. Valores por porção: estimativa aproximada a partir dos ingredientes, não é análise laboratorial.</p>
    <h3 style="margin-top:20px">Ingredientes</h3><ul class="ing" style="margin-top:6px">${r.i.map(x => `<li><span>${esc(x[0])}</span><span>${esc(x[1])}</span></li>`).join("")}</ul>
    <h3 style="margin-top:20px">Preparação</h3><ol class="steps" style="margin-top:6px">${r.s.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
    <div class="stack" style="margin-top:18px"><button class="btn block" id="rc-plan">${icon("cal","sm")} Planear</button>
    <div class="row"><button class="btn ghost grow sm" id="rc-fav">${icon(fav ? "heart-f" : "heart","sm")} ${fav ? "Guardada" : "Guardar"}</button><button class="btn ghost grow sm" id="rc-shop">${icon("cart","sm")} Compras</button><button class="btn ghost grow sm" id="rc-eat">${icon("check","sm")} Comi</button></div></div>
    <p class="tiny muted" style="margin-top:14px">Se tens alergias, confirma sempre os rótulos dos ingredientes.</p>`, b => {
    $("#rc-fav", b).onclick = () => { S.fav = fav ? S.fav.filter(x => x !== id) : S.fav.concat(id); save(); if (!fav) { ach("fav"); say("fav"); } closeSheet(); toast(fav ? "Removida das favoritas" : "Guardada nas favoritas"); refreshAll(); };
    $("#rc-shop", b).onclick = () => { const n = r.i.reduce((a, x) => a + addShop(x[0], x[1], x[2]), 0); save(); toast(n ? `${n} ingrediente(s) na lista de compras` : "Já estavam todos na lista"); };
    $("#rc-eat", b).onclick = () => { addEntry(curDay, { n:r.n, k:r.k, p:r.p, c:r.h, g:r.g, m:r.c, q:"1 porção", src:"recipe" }); ach("cook"); closeSheet(); go("hoje"); toast("Adicionado ao diário"); };
    $("#rc-plan", b).onclick = () => openPlanAdd(today(), r);
  });
}

