/* ========================== PLANOS ========================== */
let planSub = "ref", planView = "semana", planSel = today(), planMonth = today().slice(0,7);
function renderPlanos(){
  $$("#p-seg button").forEach(b => { b.classList.toggle("on", b.dataset.s === planSub); b.onclick = () => { planSub = b.dataset.s; renderPlanos(); }; });
  ["ref","treino","compras"].forEach(s => $("#p-"+s).classList.toggle("hide", s !== planSub));
  ({ ref:renderPlanRef, treino:renderTreino, compras:renderCompras })[planSub]();
}
function calendar(month, sel, dotsFn){
  const [y, m] = month.split("-").map(Number), start = mondayOf(dkey(new Date(y, m-1, 1)));
  let h = DOW.map(d => `<div class="dow">${d}</div>`).join("");
  for (let i = 0; i < 42; i++) { const k = addDays(start, i), d = parseK(k); if (i % 7 === 0 && i >= 28 && d.getMonth() !== m-1) break;
    h += `<button data-k="${k}" class="${d.getMonth() !== m-1 ? "out " : ""}${k === today() ? "today " : ""}${k === sel ? "on" : ""}" aria-label="${fmtDay(k)}">${d.getDate()}<span class="dots">${dotsFn(k)}</span></button>`; }
  return `<div class="row between" style="margin-bottom:8px"><button class="iconbtn" data-mo="-1" aria-label="Mês anterior">${icon("left","sm")}</button><b style="text-transform:capitalize">${MONTHS[m-1]} ${y}</b><button class="iconbtn" data-mo="1" aria-label="Mês seguinte">${icon("right","sm")}</button></div><div class="cal">${h}</div>`;
}
const shiftMonth = (mo, n) => { const [y, m] = mo.split("-").map(Number); return dkey(new Date(y, m-1+n, 1)).slice(0,7); };
const mealOrder = m => MEALS.findIndex(x => x.id === m);
function planSummaryCard(mon){
  const P = planPrefs(), ref = refNow(), sun = addDays(mon, 6), E = S.plan.filter(x => x.date >= mon && x.date <= sun), cost = planCost(E, P.home);
  const days = new Set(E.filter(x => x.r).map(x => x.date)).size, kc = E.reduce((a, x) => a + planKcal(x), 0), pr = E.reduce((a, x) => a + planProt(x), 0);
  const over = P.budget && cost > P.budget;
  return `<div class="card plan-sum" style="margin-top:18px"><div class="row between"><div><p class="eyebrow">A tua semana</p><h3>${E.length ? `${E.length} refeições em ${days} dia${days === 1 ? "" : "s"}` : "Ainda sem plano"}</h3></div><button class="btn ghost sm" id="pl-prefs">Preferências</button></div>
    ${E.length ? `<div class="stat3" style="margin-top:14px">${ref && days ? `<div><b>${Math.round(kc / days)}</b><small>kcal por dia (ref. ${ref.kcal})</small></div><div><b>${Math.round(pr / days)} g</b><small>proteína por dia (ref. ${ref.p} g)</small></div>` : `<div><b>${P.meals.length}</b><small>refeições por dia</small></div><div><b>${P.tdays.length}</b><small>dias de treino</small></div>`}
      <div class="${over ? "over" : ""}"><b>≈ ${eur(cost)}</b><small>${P.budget ? `estimativa, orçamento ${P.budget} €` : "custo estimado"}</small></div></div>` : ""}
    <div class="chips-sum">${prefsSummary().map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    ${over ? `<p class="small" style="margin-top:6px;color:var(--accent)">Fica acima do orçamento mesmo com as opções mais baratas. Indica o que já tens em casa ou planeia menos refeições.</p>` : ""}
    <p class="tiny muted" style="margin-top:8px">Custos com preços médios aproximados, sem contar o que já tens em casa. Variam com a loja e a época.</p></div>`;
}
function renderPlanRef(){
  const el = $("#p-ref"), mon = mondayOf(planSel), P = planPrefs(), ref = refNow();
  const dayList = k => { const it = S.plan.filter(x => x.date === k).sort((a,b) => mealOrder(a.m) - mealOrder(b.m)), tg = dayTarget(P, k, ref), tr = P.tdays.includes(dow(k));
    const kc = it.reduce((a, x) => a + planKcal(x), 0), pr = it.reduce((a, x) => a + planProt(x), 0);
    return `<div class="daycol"><div class="dh"><b>${k === today() ? "Hoje · " : ""}${DOWL[dow(k)]} ${parseK(k).getDate()}</b>${tr ? `<span class="pill-tr">${icon("dumbbell","xs")} Treino</span>` : ""}${kcalOn() && it.some(x => x.r) ? `<span class="tiny muted" style="margin-left:auto;margin-right:4px">${kc}${tg ? ` / ${tg.kcal}` : ""} kcal · ${pr} g prot.</span>` : `<span style="margin-left:auto"></span>`}<button class="iconbtn" data-padd="${k}" aria-label="Planear ${fmtDay(k)}">${icon("plus","sm")}</button></div>
      ${it.map(x => `<div class="pitem"><span class="mt">${esc(x.m)}</span><span class="nm">${x.r ? `<button class="lnk" data-prec="${x.r}">${esc(x.n)}</button>` : esc(x.n)}${x.x && x.x !== 1 ? ` <span class="muted">× ${String(x.x).replace(".", ",")}</span>` : ""}${x.lo ? `<span class="ptag">Sobras de ontem</span>` : x.bt ? `<span class="ptag">Cozinhado ${x.bt === "domingo" ? "ao domingo" : "à quarta"}</span>` : ""}</span>${kcalOn() && planKcal(x) ? `<span class="small muted num">${planKcal(x)}</span>` : ""}${x.r ? `<button class="iconbtn" data-psw="${x.id}" aria-label="Trocar ${esc(x.n)}" title="Trocar">${icon("copy","xs")}</button>` : ""}<button class="iconbtn" data-pdel="${x.id}" aria-label="Remover ${esc(x.n)}">${icon("x","xs")}</button></div>`).join("") || `<p class="small muted" style="margin-top:2px">${k < today() ? "Já passou." : "Nada planeado."}</p>`}</div>`; };
  const sun = addDays(mon, 6);
  el.innerHTML = planSummaryCard(mon) + `<div class="seg" style="margin-top:16px"><button data-v="semana" class="${planView === "semana" ? "on" : ""}">Semana</button><button data-v="mes" class="${planView === "mes" ? "on" : ""}">Mês</button></div>
    ${planView === "semana"
      ? `<div class="row between" style="margin-top:16px"><button class="iconbtn" data-wk="-7" aria-label="Semana anterior">${icon("left","sm")}</button><b>${parseK(mon).getDate()} de ${MONTHS[parseK(mon).getMonth()]} – ${parseK(sun).getDate()} de ${MONTHS[parseK(sun).getMonth()]}</b><button class="iconbtn" data-wk="7" aria-label="Semana seguinte">${icon("right","sm")}</button></div>
         <div class="list" style="margin-top:10px">${DOW.map((_, i) => dayList(addDays(mon, i))).join("")}</div>`
      : `<div class="card" style="margin-top:16px">${calendar(planMonth, planSel, k => S.plan.filter(x => x.date === k).slice(0,3).map(() => "<i></i>").join(""))}</div><div class="list" style="margin-top:12px">${dayList(planSel)}</div>`}
    <div class="stack" style="margin-top:16px"><button class="btn block" id="pl-auto">${icon("sparkle","sm")} ${S.plan.some(x => x.date >= mon && x.date <= sun && x.a) ? "Refazer o plano da semana" : "Criar o plano da semana"}</button><button class="btn soft block" id="pl-shop">${icon("cart","sm")} Gerar lista de compras da semana</button></div>
    <p class="tiny muted" style="margin:10px 4px 0">O plano segue as tuas preferências: refeições, forma de cozinhar, tempo, cozinhas, dias de treino, alergias, o que não gostas, o que tens em casa e o orçamento. Refazer só muda o que foi sugerido; o que planeaste à mão fica.</p>`;
  $$("[data-v]", el).forEach(b => b.onclick = () => { planView = b.dataset.v; planMonth = planSel.slice(0,7); renderPlanRef(); });
  $$("[data-wk]", el).forEach(b => b.onclick = () => { planSel = addDays(planSel, +b.dataset.wk); renderPlanRef(); });
  $$("[data-mo]", el).forEach(b => b.onclick = () => { planMonth = shiftMonth(planMonth, +b.dataset.mo); renderPlanRef(); });
  $$(".cal [data-k]", el).forEach(b => b.onclick = () => { planSel = b.dataset.k; renderPlanRef(); });
  $$("[data-padd]", el).forEach(b => b.onclick = () => openPlanAdd(b.dataset.padd));
  $$("[data-prec]", el).forEach(b => b.onclick = () => openRecipe(+b.dataset.prec));
  $$("[data-psw]", el).forEach(b => b.onclick = () => { if (swapPlanEntry(b.dataset.psw)) { save(); renderPlanRef(); toast("Trocado por outra opção"); } else toast("Não há outra opção compatível"); });
  $$("[data-pdel]", el).forEach(b => b.onclick = () => { S.plan = S.plan.filter(x => x.id !== b.dataset.pdel); save(); renderPlanRef(); });
  $("#pl-prefs", el).onclick = openPlanPrefs;
  $("#pl-auto").onclick = async () => { const from = mon < today() ? today() : mon; if (from > sun) { toast("Esta semana já passou"); return; }
    if (S.plan.some(x => x.date >= from && x.date <= sun && x.a) && !await confirmDlg("Refazer as sugestões desta semana? O que planeaste à mão fica igual.", "Refazer")) return;
    const n = buildWeekPlan(mon, true, from); save(); renderPlanRef(); toast(n ? `${n} refeições planeadas à tua medida` : "A semana já estava preenchida"); if (n) { ach("plan"); say("plan", true); } };
  $("#pl-shop").onclick = () => { const n = genShop(mon); save(); toast(n ? `${n} produtos na lista, com as quantidades somadas` : "Nada para adicionar. Planeia receitas primeiro."); if (n) { planSub = "compras"; renderPlanos(); } };
}
function openPlanAdd(k, recipe){
  const R = RECIPES.filter(recipeAllowed);
  openSheet("Planear refeição", `<div class="stack"><label class="field"><span>Dia</span><input id="pa-d" type="date" value="${k}"></label>
    <label class="field"><span>Refeição</span><select id="pa-m">${MEALS.map(m => `<option ${recipe && recipe.c === m.id ? "selected" : ""}>${m.id}</option>`).join("")}</select></label>
    <label class="field"><span>O que vais comer</span><input id="pa-n" list="pa-l" maxlength="80" value="${recipe ? esc(recipe.n) : ""}" placeholder="Receita ou refeição"><datalist id="pa-l">${R.map(r => `<option value="${esc(r.n)}">`).join("")}</datalist></label>
    <div class="row"><button class="btn ghost grow" id="pa-s">${icon("sparkle","sm")} Sugerir</button><button class="btn grow" id="pa-ok">Planear</button></div></div>`, b => {
    $("#pa-s", b).onclick = () => { if (!R.length) { toast("Sem receitas compatíveis"); return; } const m = $("#pa-m", b).value, L = R.filter(r => r.c === m), P = L.length ? L : R; $("#pa-n", b).value = P[Math.floor(rnd()*P.length)].n; };
    $("#pa-ok", b).onclick = () => { const n = $("#pa-n", b).value.trim().slice(0,80), d = $("#pa-d", b).value; if (!n || !/^\d{4}-\d{2}-\d{2}$/.test(d)) { toast("Escolhe o dia e escreve a refeição"); return; }
      const r = RECIPES.find(q => q.n === n); S.plan.push({ id:uid(), date:d, m:$("#pa-m", b).value, n, r:r ? r.id : undefined }); save(); ach("plan"); syncChallenges();
      closeSheet(); toast("Planeado para " + fmtDay(d).toLowerCase()); planSel = d; planMonth = d.slice(0,7); if (curTab === "planos") renderPlanos(); };
  });
}
function renderTreino(){
  const el = $("#p-treino"), p = progOf();
  const minorNote = isMinor() ? `<div class="note warn" style="margin-top:14px">${icon("info","sm")}<span>Se tens menos de 18 anos, mostra estes planos a um adulto ou treinador e começa sempre pela versão mais leve.</span></div>` : "";
  if (!p) { el.innerHTML = `<div class="card row" style="margin-top:18px;gap:14px">${morango({ mood:"happy", size:64 })}<div><h3>Escolhe um plano</h3><p class="small muted">Começa pelo que te parece fácil. Podes mudar quando quiseres.</p></div></div>${minorNote}
    <div class="list" style="margin-top:14px"><button class="prog" data-p="custom"><div class="badge">${icon("sparkle")}</div><div class="lt"><b>Plano feito para ti</b><small>Respondes a 5 perguntas e o ${esc(BRAND.mascot)} monta o plano com o teu sítio, tempo, experiência e objetivo.</small></div>${icon("right","sm")}</button>${PROGRAMS.map(x => `<button class="prog" data-p="${x.id}"><div class="badge acc">${icon("dumbbell")}</div><div class="lt"><b>${esc(x.n)}</b><small>${esc(x.d)}</small><small>${x.days.length}× por semana · ${x.min} min</small><span class="lvl" aria-label="Nível ${x.lvl} de 3">${[1,2,3].map(i => `<i class="${i <= x.lvl ? "on" : ""}"></i>`).join("")}</span></div>${icon("right","sm")}</button>`).join("")}</div>
    <p class="tiny muted" style="margin:12px 4px">Se tens lesões, dores ou alguma condição de saúde, fala com um profissional antes de começar. Para de imediato se sentires dor.</p>`;
    $$("[data-p]", el).forEach(b => b.onclick = () => b.dataset.p === "custom" ? openOnboarding(true, "gym") : openProgram(b.dataset.p)); return; }
  const k = today(), mon = mondayOf(k), se = sessionFor(k);
  const weekDone = DOW.filter((_, i) => workoutDone(addDays(mon, i))).length;
  el.innerHTML = `<div class="card" style="margin-top:18px"><div class="row between"><div><p class="tiny muted" style="font-weight:700;text-transform:uppercase;letter-spacing:.06em">O teu plano</p><h3>${esc(p.n)}</h3></div><button class="btn ghost sm" id="t-chg">Mudar</button></div>
      <div class="wstrip" style="margin-top:14px">${DOW.map((d, i) => { const dk = addDays(mon, i); return `<div class="${S.wk.days.includes(i) ? (workoutDone(dk) ? "dn" : "pl") : ""} ${dk === k ? "td" : ""}">${d}<b></b></div>`; }).join("")}</div>
      <p class="small muted" style="margin-top:10px">${weekDone} de ${S.wk.days.length} treinos esta semana. Falhaste um? Não faz mal, continua no seguinte.</p></div>
    <div class="sec"><div class="sec-h"><h2>${se ? "Treino de hoje" : "Hoje é dia de descanso"}</h2></div>${se ? sessionCard(k, se) : `<div class="card row">${abi({ mood:"sleepy", size:64 })}<p class="muted">Recupera bem. O próximo treino é ${esc(nextSessionTxt())}.</p></div>`}</div>
    <div class="sec"><div class="sec-h"><h2>Mês</h2><span class="tiny muted">○ planeado · ● feito</span></div><div class="card">${calendar(planMonth, planSel, k2 => sessionFor(k2) ? `<i class="${workoutDone(k2) ? "wd" : "wo"}"></i>` : (workoutDone(k2) ? `<i class="wd"></i>` : ""))}</div>
    ${planSel !== k && sessionFor(planSel) ? `<div style="margin-top:12px">${sessionCard(planSel, sessionFor(planSel))}</div>` : ""}</div>${minorNote}`;
  $("#t-chg", el).onclick = async () => { if (!await confirmDlg("Mudar de plano? Os treinos já feitos ficam no histórico.", "Mudar")) return; S.wkHist = Object.assign(S.wkHist || {}, S.wk.done || {}); S.wk = null; save(); renderTreino(); };
  $$("[data-mo]", el).forEach(b => b.onclick = () => { planMonth = shiftMonth(planMonth, +b.dataset.mo); renderTreino(); });
  $$(".cal [data-k]", el).forEach(b => b.onclick = () => { planSel = b.dataset.k; renderTreino(); });
  $$("[data-ex]", el).forEach(b => b.onclick = () => { const [kk, i] = b.dataset.ex.split("|"); S.wk.ex = S.wk.ex || {}; const a = S.wk.ex[kk] = S.wk.ex[kk] || []; const j = a.indexOf(+i); if (j >= 0) a.splice(j,1); else a.push(+i); save(); renderTreino(); });
  $$("[data-exi]", el).forEach(b => b.onclick = () => { const [kk, i] = b.dataset.exi.split("|"); openExercise(kk, +i); });
  $$("[data-fin]", el).forEach(b => b.onclick = () => { const kk = b.dataset.fin; S.wk.done = S.wk.done || {}; if (S.wk.done[kk]) delete S.wk.done[kk]; else { S.wk.done[kk] = 1; ach("wk1"); snd("win"); confetti(); toast("Treino concluído. Muito bem!"); say("workout", true); } save(); renderTreino(); });
}
function nextSessionTxt(){ for (let i = 1; i <= 7; i++) { const k = addDays(today(), i), s = sessionFor(k); if (s) return `${DOWL[dow(k)].toLowerCase()} (${s.sess.n})`; } return "em breve"; }
function sessionCard(k, se){ const st = (S.wk.ex && S.wk.ex[k]) || [], dn = workoutDone(k);
  return `<div class="card"><div class="row between"><div><b>${esc(se.sess.n)}</b><p class="small muted">${k === today() ? "Hoje" : esc(fmtDay(k))} · ${se.prog.min} min</p></div>${dn ? `<span class="conf alta">${icon("check","xs")} Feito</span>` : ""}</div>
    ${(() => { const ph = S.wk.prog === "custom" ? weekPhase(k) : null; return ph ? `<div class="note" style="margin-top:12px">${icon("chart","sm")}<span><b>${esc(ph.n)}.</b> ${esc(ph.t)}</span></div>` : ""; })()}
    <div style="margin-top:8px">${se.sess.e.map((e, i) => `<div class="exrow"><button class="ex ${st.includes(i) || dn ? "done" : ""}" data-ex="${k}|${i}" aria-pressed="${st.includes(i) || dn}"><span class="tick">${icon("check","xs")}</span><span class="lt"><b>${esc(exName(k, se, i))}</b><small>${esc(e[1])}${e[2] ? " · descanso " + esc(e[2]) : ""}</small></span></button>${i ? `<button class="iconbtn" data-exi="${k}|${i}" aria-label="Como fazer ${esc(exName(k, se, i))}">${icon("info","sm")}</button>` : ""}</div>`).join("")}</div>
    ${k <= today() ? `<button class="btn ${dn ? "ghost" : ""} block" data-fin="${k}" style="margin-top:12px">${dn ? "Desmarcar treino" : "Concluir treino"}</button>` : `<p class="tiny muted" style="margin-top:10px">Podes marcar este treino no próprio dia.</p>`}</div>`; }
function openProgram(id){
  const p = PROGRAMS.find(x => x.id === id); let days = p.days.slice();
  openSheet(p.n, `<p>${esc(p.d)}</p><div style="margin-top:10px"><span class="tag">${p.min} min</span><span class="tag">${p.s.length} treino${p.s.length > 1 ? "s" : ""} diferente${p.s.length > 1 ? "s" : ""}</span></div>
    <h3 style="margin-top:18px">Em que dias?</h3><p class="small muted">Recomendado: ${p.days.length} dias, com descanso entre eles.</p>
    <div class="row" style="flex-wrap:wrap;margin-top:10px;gap:8px" id="pg-d"></div>
    <h3 style="margin-top:18px">O que vais fazer</h3>${p.s.map(s => `<div class="card" style="margin-top:10px"><b>${esc(s.n)}</b><ul class="ing" style="margin-top:6px">${s.e.map(e => `<li><span>${esc(e[0])}</span><span>${esc(e[1])}</span></li>`).join("")}</ul></div>`).join("")}
    <button class="btn block" id="pg-ok" style="margin-top:16px">Começar este plano</button>
    <p class="tiny muted" style="margin-top:10px">Plano geral, não personalizado por um profissional. Escolhe cargas que te deixem fazer as repetições com boa técnica.</p>`, b => {
    const dr = () => { $("#pg-d", b).innerHTML = DOW.map((d, i) => `<button class="chip ${days.includes(i) ? "on" : ""}" data-i="${i}" aria-pressed="${days.includes(i)}">${d}</button>`).join("");
      $$("#pg-d button", b).forEach(x => x.onclick = () => { const i = +x.dataset.i; days = days.includes(i) ? days.filter(y => y !== i) : days.concat(i).sort((a,b2) => a-b2); dr(); }); };
    dr();
    $("#pg-ok", b).onclick = () => { if (!days.length) { toast("Escolhe pelo menos um dia"); return; } S.wk = { prog:p.id, days, start:today(), done:{}, ex:{} }; save(); closeSheet(); renderTreino(); toast("Plano ativado"); };
  });
}
const CATS = ["Frutas e legumes","Carne e peixe","Laticínios e ovos","Mercearia","Outros"];
const guessCat = n => /frango|peru|vaca|atum|salmão|pescada|carne/i.test(n) ? "Carne e peixe" : /ovo|iogurte|leite|queijo|requeijão/i.test(n) ? "Laticínios e ovos" : /legume|fruta|salada|banana|batata/i.test(n) ? "Frutas e legumes" : "Mercearia";
function shopHead(){ const st = staples(), mon = mondayOf(today()), n = S.plan.filter(x => x.date >= mon && x.date <= addDays(mon, 6) && x.r).length;
  return `<div class="card" style="margin-top:18px"><div class="row">${abi({ mood:"think", size:44 })}<div class="grow"><b>Lista feita a partir do teu plano</b><p class="small muted">${n ? `${n} refeições planeadas esta semana. As quantidades já vêm somadas.` : "Ainda não tens refeições planeadas esta semana."}</p></div></div>
    <button class="btn block" id="sh-gen" style="margin-top:12px">${icon("cart","sm")} ${n ? "Atualizar a lista com o plano" : "Criar plano e lista da semana"}</button></div>`
    + (st && st.L.length ? `<div class="card" style="margin-top:12px"><h3>${esc(st.t)}</h3><p class="small muted" style="margin-top:2px">${esc(st.why)}</p><div class="row" style="flex-wrap:wrap;gap:8px;margin-top:12px">${st.L.map(x => `<button class="chip" data-st="${esc(x)}">${icon("plus","xs")}${esc(x)}</button>`).join("")}</div></div>` : ""); }
function bindShopHead(el){ const g = $("#sh-gen", el); if (g) g.onclick = () => { const mon = mondayOf(today()); let made = 0; if (!S.plan.some(x => x.date >= mon && x.date <= addDays(mon, 6) && x.r)) made = buildWeekPlan(mon, false); const n = genShop(mon); save(); renderCompras(); toast(made ? `Plano criado e ${n} produtos na lista` : `${n} produtos na lista, com as quantidades da semana`); };
  $$("[data-st]", el).forEach(b => b.onclick = () => { if (addShop(b.dataset.st, "", guessCat(b.dataset.st))) { save(); renderCompras(); toast("Adicionado à lista"); } else toast("Já está na lista"); }); }
function addShop(n, q, c){ if (S.shop.some(x => x.n.toLowerCase() === n.toLowerCase())) return 0; S.shop.push({ n, q, c:CATS.includes(c) ? c : "Outros", k:0 }); return 1; }
function renderCompras(){
  const el = $("#p-compras");
  el.innerHTML = shopHead() + `<div class="card stack" style="margin-top:14px"><div class="g2"><input id="sh-n" maxlength="60" placeholder="Produto" aria-label="Produto"><input id="sh-q" maxlength="20" placeholder="Quantidade" aria-label="Quantidade"></div>
    <div class="row"><select id="sh-c" class="grow" aria-label="Categoria">${CATS.map(c => `<option>${c}</option>`).join("")}</select><button class="btn" id="sh-a">Adicionar</button></div></div>
    <div id="sh-l"></div>
    ${S.shop.length ? `<div class="row" style="margin-top:14px"><button class="btn ghost grow sm" id="sh-clr">Limpar comprados</button><button class="btn ghost grow sm" id="sh-sv">Guardar e nova lista</button></div>` : ""}
    ${S.shopH.length ? `<div class="sec"><div class="sec-h"><h2>Listas anteriores</h2></div><div class="list">${S.shopH.map((h, i) => `<div class="li"><div class="lt"><b>${esc(h.d)}</b><small>${(h.it||[]).length} produtos</small></div><button class="btn soft sm" data-h="${i}">Restaurar</button></div>`).join("")}</div></div>` : ""}`;
  $("#sh-l", el).innerHTML = S.shop.length ? CATS.map(c => { const it = S.shop.map((x, i) => [x, i]).filter(([x]) => (CATS.includes(x.c) ? x.c : "Outros") === c); if (!it.length) return "";
    return `<p class="shop-cat">${c}</p><div class="list">${it.map(([x, i]) => `<div class="shop-item ${x.k ? "k" : ""}"><input type="checkbox" id="si${i}" data-t="${i}" ${x.k ? "checked" : ""} style="width:22px;height:22px;accent-color:var(--brand);flex:none"><label for="si${i}" class="nm">${esc(x.n)}</label><span class="small muted">${esc(x.q || "")}</span><button class="iconbtn" data-del="${i}" aria-label="Remover ${esc(x.n)}">${icon("x","xs")}</button></div>`).join("")}</div>`; }).join("")
    : `<div class="empty">${abi({ mood:"think", size:80 })}<p>A lista está vazia. Junta produtos aqui ou gera a lista a partir do plano da semana.</p></div>`;
  $("#sh-a", el).onclick = () => { const n = $("#sh-n", el).value.trim().slice(0,60); if (!n) { toast("Escreve o produto"); return; } if (!addShop(n, $("#sh-q", el).value.trim().slice(0,20), $("#sh-c", el).value)) toast("Já está na lista"); save(); renderCompras(); };
  $("#sh-n", el).onkeydown = e => { if (e.key === "Enter") $("#sh-a", el).click(); };
  $$("[data-t]", el).forEach(c => c.onchange = () => { S.shop[+c.dataset.t].k = c.checked ? 1 : 0; save(); renderCompras(); });
  $$("[data-del]", el).forEach(b => b.onclick = () => { S.shop.splice(+b.dataset.del, 1); save(); renderCompras(); });
  const clr = $("#sh-clr", el); if (clr) clr.onclick = () => { S.shop = S.shop.filter(x => !x.k); save(); renderCompras(); };
  const sv = $("#sh-sv", el); if (sv) sv.onclick = async () => { if (!await confirmDlg("Guardar esta lista e começar uma nova?", "Guardar")) return; S.shopH.unshift({ d:new Date().toLocaleDateString("pt-PT"), it:S.shop }); S.shopH = S.shopH.slice(0,20); S.shop = []; save(); renderCompras(); };
  $$("[data-h]", el).forEach(b => b.onclick = async () => { if (!await confirmDlg("Substituir a lista atual por esta?", "Restaurar")) return; S.shop = structuredClone(S.shopH[+b.dataset.h].it || []); save(); renderCompras(); });
  bindShopHead(el);
}

const planKcal = x => { const r = x.r && RECIPES.find(q => q.id === x.r); return r ? Math.round(r.k * (x.x || 1)) : 0; };
const planProt = x => { const r = x.r && RECIPES.find(q => q.id === x.r); return r ? Math.round(r.p * (x.x || 1)) : 0; };

/* ========================== Compras a partir do plano ========================== */
function parseQty(q){ const m = String(q).trim().match(/^(\d+\/\d+|\d+(?:[.,]\d+)?)\s*(kg|g|ml|l)?(?![a-zà-ú])/i); if (!m) return null;
  let v = m[1].includes("/") ? m[1].split("/").reduce((a, b) => a / b) : +m[1].replace(",", "."), u = (m[2] || "").toLowerCase();
  if (u === "kg") { v *= 1000; u = "g"; } if (u === "l") { v *= 1000; u = "ml"; }
  return { v, u, rest: String(q).trim().slice(m[0].length).trim() }; }
function fmtQty(v, u, rest){ const f = x => x.toLocaleString("pt-PT", { maximumFractionDigits:1 });
  const base = u === "g" && v >= 1000 ? f(v/1000) + " kg" : u === "ml" && v >= 1000 ? f(v/1000) + " L" : u ? Math.round(v) + " " + u : f(Math.ceil(v * 2) / 2);
  return base + (rest ? " " + rest : ""); }
function genShop(mon){
  const agg = new Map(), end = addDays(mon, 6);
  S.plan.filter(x => x.date >= mon && x.date <= end && x.r).forEach(x => { const r = RECIPES.find(q => q.id === x.r); if (!r) return; const f = (x.x || 1) / (r.srv || 1);
    r.i.forEach(([n, q, c]) => { const pq = parseQty(q), key = n.toLowerCase() + "|" + (pq ? pq.u + pq.rest : "txt"); const cur = agg.get(key);
      if (pq) agg.set(key, { n, c, v:(cur ? cur.v : 0) + pq.v * f, u:pq.u, rest:pq.rest }); else if (!cur) agg.set(key, { n, c, txt:q }); }); });
  const keep = S.shop.filter(x => !x.auto), done = new Set(S.shop.filter(x => x.auto && x.k).map(x => x.n.toLowerCase()));
  S.shop = keep; let n = 0;
  const home = planPrefs().home; // o que já há em casa entra marcado, para confirmar
  for (const it of agg.values()) { if (keep.some(x => x.n.toLowerCase() === it.n.toLowerCase())) continue; const q = it.txt || fmtQty(it.v, it.u, it.rest), h = isHome(it.n, home);
    S.shop.push({ n:it.n, q: h ? "já tens? " + q : q, c:CATS.includes(it.c) ? it.c : "Outros", k: done.has(it.n.toLowerCase()) || h ? 1 : 0, auto:1 }); n++; }
  return n;
}
// Básicos para o objetivo, filtrados pela dieta, alergias e o que a pessoa não gosta.
function staples(){
  const u = S.u || {}, g = u.goal || "manter", dt = u.diet || [], vegan = dt.includes("Vegan"), veg = vegan || dt.includes("Vegetariano"), pesc = dt.some(x => String(x).startsWith("Pescetariano"));
  const prot = vegan ? ["Tofu","Lentilhas","Grão-de-bico","Feijão","Bebida de soja","Tempeh"] : veg ? ["Ovos","Iogurte grego","Requeijão","Lentilhas","Tofu","Grão-de-bico"]
    : pesc ? ["Atum ao natural","Salmão","Pescada","Ovos","Iogurte grego","Lentilhas"] : ["Peito de frango","Peito de peru","Ovos","Atum ao natural","Iogurte grego","Carne de vaca magra"];
  const P = { musculo:["Para ganhar músculo","Proteína em todas as refeições e hidratos para teres energia no treino.", prot.concat(["Arroz","Flocos de aveia","Batata-doce","Banana","Leite ou bebida vegetal","Manteiga de amendoim"])],
    perder:["Para perder peso","Proteína e legumes dão saciedade com menos calorias.", prot.slice(0,5).concat(["Legumes para sopa","Saladas","Fruta da época","Pão integral","Leguminosas"])],
    manter:["Para manter o peso","Variedade: um pouco de tudo, todas as semanas.", prot.slice(0,4).concat(["Legumes variados","Fruta da época","Arroz ou massa integral","Azeite","Frutos secos"])],
    livre:["Para comer melhor","Básicos que tornam fácil comer bem.", prot.slice(0,4).concat(["Legumes variados","Fruta da época","Pão integral","Azeite"])] }[g] || null;
  if (!P) return null;
  const AL = { "Lactose":/iogurte|leite(?! ou bebida)|requeijão|queijo/i, "Ovos":/ovo/i, "Peixe":/atum|salmão|pescada/i, "Soja":/tofu|soja|tempeh/i, "Glúten":/pão|aveia|massa/i, "Frutos secos":/frutos secos/i, "Amendoim":/amendoim/i };
  const al = (u.al || []).filter(a => AL[a]), dl = (u.dislikes || []).map(x => String(x).toLowerCase());
  return { t:P[0], why:P[1], L:P[2].filter(x => !al.some(a => AL[a].test(x)) && !dl.some(d => x.toLowerCase().includes(d))) };
}

