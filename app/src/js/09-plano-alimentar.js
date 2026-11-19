/* ========================== Plano alimentar: preferências, custos e gerador ==========================
   Tudo o que as perguntas iniciais recolhem e que muda o plano vive em S.u:
     pmeals  refeições a planear        cstyle  forma de cozinhar       ctime  minutos por refeição (dias úteis)
     cuis    cozinhas preferidas        home    o que já há em casa     tdays  dias de treino (0 = segunda)
     budget  orçamento semanal (€)      market  supermercado (só fica guardado)   portion  tamanho das porções
   O gerador é puro (genWeek não mexe no estado) para poder pré-visualizar o plano durante as perguntas. */

const COOK_STYLES = [["diario","Cozinho quase todos os dias","Pratos diferentes todos os dias."],["dobro","Cozinho uma vez, como duas","O jantar de hoje é o almoço de amanhã."],
  ["batch","Cozinho em quantidade","2 sessões por semana (domingo e quarta) dão para os almoços e jantares."],["rapido","Quero cozinhar o mínimo","Receitas de 15 minutos ou menos nos dias úteis."]];
const CTIMES = [["15","Até 15 minutos"],["30","Até 30 minutos"],["45","Até 45 minutos"],["60","Até 1 hora, gosto de cozinhar"]];
const CUISINES = [["portuguesa","Portuguesa"],["mediterranica","Mediterrânica"],["italiana","Italiana"],["asiatica","Asiática e caril"],["mexicana","Mexicana"],["tudo","Gosto de tudo"]];
const PORTIONS = [["pequena","Pequenas"],["normal","Normais"],["grande","Grandes, tenho bom apetite"]];
const MARKETS = ["Continente","Pingo Doce","Lidl","Mercadona","Aldi","Intermarché","Auchan","Minipreço","Mercado ou mercearia"];
// Cozinha de cada prato principal (id da receita → cozinha). Pequenos-almoços e lanches não contam.
const CUISINE_OF = { 12:"portuguesa",13:"portuguesa",18:"portuguesa",23:"portuguesa",27:"portuguesa",28:"portuguesa",31:"portuguesa",33:"portuguesa",
  11:"mediterranica",15:"mediterranica",24:"mediterranica",32:"mediterranica",101:"mediterranica",25:"mediterranica",
  14:"italiana",20:"italiana",29:"italiana",34:"italiana", 19:"asiatica",21:"asiatica",26:"asiatica",30:"asiatica",103:"asiatica", 16:"mexicana",17:"mexicana",22:"mexicana",
  116:"portuguesa",117:"portuguesa",118:"portuguesa",119:"portuguesa",121:"portuguesa",122:"portuguesa",123:"portuguesa",124:"portuguesa",125:"portuguesa",126:"portuguesa",127:"portuguesa",
  128:"portuguesa",129:"portuguesa",130:"portuguesa",132:"portuguesa",134:"portuguesa",135:"portuguesa",141:"portuguesa",143:"portuguesa",
  120:"mediterranica",131:"mediterranica",144:"mediterranica",145:"mediterranica", 133:"italiana",136:"italiana",137:"italiana", 138:"mexicana", 139:"asiatica",140:"asiatica",146:"asiatica",147:"asiatica" };
// O que pode já haver em casa: [rótulo, expressão que apanha o ingrediente nas receitas]
const PANTRY = [["Arroz",/^arroz/i],["Massa",/^massa(?! de pizza)|esparguete|lasanha/i],["Flocos de aveia",/aveia(?! \S*bebida)|^flocos de aveia/i],["Ovos",/^ovos?\b|ovos cozidos/i],
  ["Leite ou bebida vegetal",/^leite(?! de coco)|^bebida/i],["Iogurte",/iogurte/i],["Atum em lata",/atum/i],["Grão-de-bico",/grão/i],["Feijão",/feijão(?!-verde)/i],["Lentilhas",/lentilhas/i],
  ["Tomate pelado ou polpa",/polpa de tomate|tomate pelado/i],["Batata",/^batata(?!-doce| palha)/i],["Cebola e alho",/^cebola|^alho/i],["Azeite",/^azeite/i],["Pão",/^pão(?! ralado| de hambúrguer)/i],
  ["Banana",/banana/i],["Frango",/frango/i],["Queijo",/queijo|mozzarella|ricota|requeijão/i],["Frutos secos",/nozes|amêndoas|frutos secos/i],["Especiarias e ervas",/caril|cominhos|canela|orégãos|pimentão|cúrcuma/i]];

/* ===== Preços de referência =====
   shortcut: preços médios aproximados de supermercado em Portugal, escritos à mão e não verificados; mudam com a loja e a época.
   Trocar por uma tabela com fonte (ou preços do supermercado escolhido) antes de prometer valores. [expressão, €/kg ou €/L, € por unidade] */
const PRICES = [[/manteiga de amendoim/i,9],[/pera\b/i,1.8,.3],[/kiwi/i,3,.3],[/pêssego/i,2.5,.35],[/sardinhas/i,0,.4],[/camarão/i,14],[/febras|lombo de porco/i,6.5],[/peru/i,8.5],
  [/fiambre/i,0,.3],[/carne de vaca|bife de vaca/i,11],[/carne picada de (peru|frango)/i,7],[/ervilhas/i,2.5],[/parmesão/i,20],[/pesto/i,14],[/noodles/i,4],[/arroz arbóreo/i,3.5],
  [/caldo de legumes/i,1.5],[/milho para pipocas/i,3],[/massa (pevide|cotovelinhos)/i,1.6],[/pão de centeio/i,4,.25],[/tomate cherry/i,4],[/louro|^sal$/i,0,0],[/leite de coco/i,4],[/^leite|^bebida/i,1.1],[/aveia/i,2.2,.1],[/banana/i,1.4,.2],[/pão ralado/i,3],[/pão de hambúrguer/i,0,.4],[/^pão|tortilha/i,3.5,.2],
  [/abacate/i,6,1],[/ovo/i,0,.25],[/lim(ão|a)/i,2,.3],[/frutos vermelhos/i,8],[/iogurte grego/i,5],[/iogurte/i,2.5,.35],[/granola/i,7],[/^mel/i,8],[/manteiga/i,9],[/chia/i,12],[/requeijão/i,7],
  [/polpa de tomate|tomate pelado/i,1.6],[/tomate/i,2.2,.3],[/^azeite/i,9],[/cogumelos/i,5],[/manga/i,3,1.4],[/grão/i,2.5],[/pepino/i,1.5,.5],[/cebola/i,1.2,.2],[/peito de frango/i,7.5],
  [/pernas de frango/i,0,1.1],[/^arroz/i,1.6],[/alface|rúcula/i,0,.5],[/bacalhau/i,14],[/batata palha/i,8],[/massa de pizza/i,0,1.5],[/^massa|esparguete/i,1.6],[/folhas de lasanha/i,0,.12],
  [/atum/i,0,1.2],[/^alho/i,6,.05],[/quinoa/i,7],[/batata-doce/i,2,.5],[/courgette/i,2,.6],[/pimento/i,3,.6],[/tahini|sésamo/i,12],[/feijão-verde/i,4],[/feijão/i,2.5],[/milho/i,3],
  [/salmão/i,16,2.5],[/edamame/i,7],[/espinafres/i,5],[/ricota|mozzarella/i,8],[/caril em pó/i,20],[/^cominhos/i,20],[/^batata/i,1.1,.15],[/cenoura/i,1,.12],[/abóbora/i,1.5],[/couve/i,2],
  [/brócolos/i,3],[/queijo fresco/i,7],[/feta/i,12],[/lentilhas/i,2.6],[/chouriço/i,12],[/dourada|robalo/i,12],[/carne picada/i,8],[/tofu/i,8],[/molho de soja/i,5],[/aipo/i,0,.3],
  [/nozes/i,15],[/amêndoas/i,12],[/húmus/i,8],[/maçã/i,1.8,.3],[/tâmaras/i,8],[/cacau/i,15],[/passas/i,6],[/tangerina/i,2,.25],[/vinagre/i,2],[/melancia/i,.9]];
const priceOf = n => PRICES.find(p => p[0].test(n)) || [null, 5, .5];
const isHome = (n, home) => (home || []).some(h => { const p = PANTRY.find(x => x[0] === h); return p && p[1].test(n); });
// Custo de um ingrediente na quantidade da receita. "q.b." e especiarias soltas contam como zero.
function ingCost(n, q){ const pq = parseQty(q); if (!pq) return 0; const [, kg, un] = priceOf(n);
  if (pq.u === "g" || pq.u === "ml") return pq.v / 1000 * kg;
  const sp = /^c\. (sopa|chá)/.exec(pq.rest); if (sp) return pq.v * (sp[1] === "sopa" ? 15 : 5) / 1000 * kg;
  return pq.v * (un || kg * .15); }
// € por dose, sem contar o que a pessoa já tem em casa.
const recipeCost = (r, home) => r.i.reduce((a, [n, q]) => a + (isHome(n, home) ? 0 : ingCost(n, q)), 0) / (r.srv || 1);
const eur = v => v.toLocaleString("pt-PT", { minimumFractionDigits: v < 10 ? 2 : 0, maximumFractionDigits: v < 10 ? 2 : 0 }) + " €";

function planPrefs(u = S.u || {}){
  const meals = (u.pmeals || []).filter(m => MEALS.some(x => x.id === m));
  return { meals: meals.length ? meals : MEALS.map(m => m.id), style: u.cstyle || "diario", time: +u.ctime || 30, cuis: (u.cuis || []).filter(x => x !== "tudo"),
    home: (u.home || []).filter(h => PANTRY.some(p => p[0] === h)), tdays: (u.tdays || []).filter(d => d >= 0 && d <= 6), budget: +u.budget > 0 ? +u.budget : 0, portion: u.portion || "normal", goal: u.goal || "manter" };
}
// Referência do dia: nos dias de treino mais 8 %, nos de descanso um pouco menos, para a média da semana ficar igual.
function dayTarget(P, k, ref){ if (!ref) return null; const nT = P.tdays.length, tr = P.tdays.includes(dow(k));
  const f = !nT || nT === 7 ? 1 : tr ? 1.08 : 1 - .08 * nT / (7 - nT);
  return { kcal: Math.round(ref.kcal * f / 10) * 10, p: Math.round(ref.p * (tr ? 1.1 : 1)), tr }; }
const SPLIT = { "Pequeno-almoço":.25, "Almoço":.35, "Lanche":.1, "Jantar":.3 };
const mealShares = P => { const t = P.meals.reduce((a, m) => a + SPLIT[m], 0); return Object.fromEntries(P.meals.map(m => [m, SPLIT[m] / t])); };
const isMain = m => m === "Almoço" || m === "Jantar";
const PORTION_X = { pequena:.75, normal:1, grande:1.5 };

// Gera as refeições de [from, to]. ctx: { ref:{kcal,p}|null, costW, recent:[ids] }. Devolve entradas no formato de S.plan.
function genWeek(P, from, to, ctx = {}){
  const R = RECIPES.filter(recipeAllowed), ref = ctx.ref || null, sh = ctx.sh || mealShares(P), out = [], used = (ctx.recent || []).slice();
  const days = []; for (let k = from; k <= to; k = addDays(k, 1)) days.push(k);
  const perMeal = P.budget ? P.budget / (7 * P.meals.length) : 0, pro = ["musculo","perder","rendimento"].includes(P.goal);
  const limit = k => { const we = dow(k) >= 5; let t = we ? Math.max(P.time, 45) : P.time; if (P.style === "rapido" && !we) t = Math.min(t, 15); return t; };
  const poolFor = m => R.filter(r => isMain(m) ? (r.c === "Almoço" || r.c === "Jantar") : r.c === m);
  const homeRatio = r => P.home.length ? r.i.filter(([n]) => isHome(n, P.home)).length / r.i.length : 0;
  const rank = (m, k, opt = {}) => { const tg = dayTarget(P, k, ref), T = tg ? tg.kcal * sh[m] : null, tl = limit(k);
    let pool = poolFor(m); if (opt.batch) pool = pool.filter(r => (r.srv || 1) >= 2);
    return pool.map(r => { const x = T ? clamp(Math.round(T / r.k * 2) / 2, .5, 2.5) : (PORTION_X[P.portion] || 1);
      let sc = T ? Math.abs(r.k * x - T) / T : 0;
      const pm = tg ? tg.p * sh[m] : 0, pp = r.p * x;                                           // proteína: chegar à quota da refeição, sem a ultrapassar muito
      sc -= pm && pp > pm * 1.25 ? -(pp - pm * 1.25) / pm * .5 : (r.p * 4 / r.k) * (pro ? .9 : .4) * (tg && tg.tr ? 1.4 : 1);
      if (tg && tg.tr && (P.goal === "musculo" || P.goal === "rendimento")) sc -= (r.h * 4 / r.k) * .3; // e hidratos para o treino
      if (r.t > tl) sc += .5 + (r.t - tl) / 60;
      if (isMain(m) && P.cuis.length) sc += P.cuis.includes(CUISINE_OF[r.id]) ? -.3 : .1;
      sc -= homeRatio(r) * .4;
      if (perMeal && ctx.costW) sc += ctx.costW * recipeCost(r, P.home) * x / perMeal * .3;
      const last = used.lastIndexOf(r.id); if (last >= 0 && used.length - last < (isMain(m) ? 12 : 6)) sc += 1;
      return { r, x, sc: sc + rnd() * .15 }; }).sort((a, b) => a.sc - b.sc); };
  const push = (k, m, r, x, extra) => { out.push(Object.assign({ id:uid(), date:k, m, n:r.n, r:r.id, x, a:1 }, extra)); used.push(r.id); };
  const portionFor = (r, m, k) => { const tg = dayTarget(P, k, ref); return tg ? clamp(Math.round(tg.kcal * sh[m] / r.k * 2) / 2, .5, 2.5) : (PORTION_X[P.portion] || 1); };
  const mains = P.meals.filter(isMain);

  // Pratos principais segundo a forma de cozinhar
  if (P.style === "batch" && mains.length) {
    const blocks = [[], []]; days.forEach(k => blocks[dow(k) <= 2 ? 0 : 1].push(k));
    blocks.forEach((B, bi) => { if (!B.length) return; const lk = uid(), when = bi ? "quarta" : "domingo";
      const picks = []; for (let j = 0; j < mains.length; j++) { const c = rank(mains[j], B[0], { batch:1 }).find(o => !picks.includes(o.r)); if (c) picks.push(c.r); }
      if (!picks.length) return;
      B.forEach((k, di) => mains.forEach((m, j) => { const r = picks[(j + di) % picks.length]; push(k, m, r, portionFor(r, m, k), { lk: lk + r.id, bt: when }); })); });
  } else if (P.style === "dobro" && mains.length === 2) {
    let prev = null;
    days.forEach(k => { if (prev) push(k, "Almoço", prev.r, portionFor(prev.r, "Almoço", k), { lk: prev.lk, lo:1 });
      else { const c = rank("Almoço", k)[0]; if (c) push(k, "Almoço", c.r, c.x); }
      const d = rank("Jantar", k)[0]; if (d) { const lk = uid(); push(k, "Jantar", d.r, d.x, { lk }); prev = { r:d.r, lk }; } });
  } else mains.forEach(m => days.forEach(k => { const c = rank(m, k)[0]; if (c) push(k, m, c.r, c.x); }));

  // Pequeno-almoço e lanche: escolhidos dia a dia
  P.meals.filter(m => !isMain(m)).forEach(m => days.forEach(k => { const c = rank(m, k)[0]; if (c) push(k, m, c.r, c.x); }));
  return out;
}
const entryCost = (x, home) => { const r = x.r && RECIPES.find(q => q.id === x.r); return r ? recipeCost(r, home) * (x.x || 1) : 0; };
const planCost = (E, home) => E.reduce((a, x) => a + entryCost(x, home), 0);

// Com orçamento, tenta outra vez dando mais peso ao preço até caber (3 tentativas, fica a mais barata).
function genWeekFit(P, from, to, ctx = {}){
  const share = (dow(to) - dow(from) + 1) / 7; let best = null;
  for (const costW of P.budget ? [0, 1.5, 4] : [0]) { const E = genWeek(P, from, to, Object.assign({}, ctx, { costW })), c = planCost(E, P.home);
    if (!best || c < best.c) best = { E, c }; if (!P.budget || c <= P.budget * share) break; }
  return best.E;
}
const refNow = () => S.macro && kcalOn() ? { kcal:S.goal, p:S.macro.p } : null;

// Preenche a semana de `mon` a partir de `from` (por omissão, segunda). Só substitui entradas automáticas; o que a pessoa planeou à mão fica.
function buildWeekPlan(mon, replace, from){
  const start = from && from > mon ? from : mon, end = addDays(mon, 6), P = planPrefs();
  if (replace) S.plan = S.plan.filter(x => x.date < start || x.date > end || !x.a);
  const busy = new Set(S.plan.filter(x => x.date >= start && x.date <= end).map(x => x.date + "|" + x.m));
  const recent = S.plan.filter(x => x.date < start && x.date >= addDays(start, -7) && x.r).map(x => x.r);
  const E = genWeekFit(P, start, end, { ref:refNow(), recent }).filter(x => !busy.has(x.date + "|" + x.m));
  E.forEach(x => { if (x.lo && !E.some(y => y !== x && y.lk === x.lk && !y.lo)) delete x.lo; }); // sobra cujo prato original não entrou
  S.plan.push(...E); return E.length;
}
// Troca um prato por outra opção com as mesmas regras. Sobras e pratos feitos em quantidade mudam em conjunto.
function swapPlanEntry(id){
  const e = S.plan.find(x => x.id === id); if (!e) return false;
  const group = e.lk ? S.plan.filter(x => x.lk === e.lk) : [e], P = planPrefs();
  const near = S.plan.filter(x => x.date >= addDays(e.date, -3) && x.date <= addDays(e.date, 3) && x.r).map(x => x.r).concat(e.r);
  let alt = genWeek(Object.assign({}, P, { meals:[e.m], style:"diario" }), e.date, e.date, { ref:refNow(), recent:near, sh:mealShares(P) })[0], r = alt && RECIPES.find(q => q.id === alt.r);
  if (!r || r.id === e.r || (group.length > 1 && (r.srv || 1) < 2)) {
    const pool = RECIPES.filter(q => recipeAllowed(q) && q.id !== e.r && (isMain(e.m) ? isMain(q.c) : q.c === e.m) && (group.length < 2 || (q.srv || 1) >= 2));
    if (!pool.length) return false; r = pool[Math.floor(rnd() * pool.length)]; alt = null; }
  group.forEach(x => { x.r = r.id; x.n = r.n; }); if (alt) e.x = alt.x; return true;
}
// Frases curtas com as escolhas, para os resumos.
function prefsSummary(u = S.u || {}){
  const P = planPrefs(u), L = [];
  L.push(P.meals.length === 4 ? "4 refeições por dia" : P.meals.join(", "));
  L.push((COOK_STYLES.find(c => c[0] === P.style) || [,""])[1]);
  L.push((CTIMES.find(c => c[0] === String(P.time)) || [,"Até 30 minutos"])[1]);
  if (P.cuis.length) L.push(P.cuis.map(c => (CUISINES.find(x => x[0] === c) || [,c])[1]).join(", "));
  L.push(P.tdays.length ? "Treino: " + P.tdays.map(d => DOW[d]).join(" ") : "Sem dias de treino");
  if (P.budget) L.push(`Até ${P.budget} € por semana`);
  if (P.home.length) L.push(`${P.home.length} básico(s) em casa`);
  if (u.market) L.push(u.market);
  return L;
}

// O plano faz-se sozinho: a semana atual (a partir de hoje) e, a partir de sexta, a seguinte. Cada semana só é preenchida uma vez,
// para não voltar a pôr o que a pessoa apagou; mudar as preferências refaz as sugestões (ver o onboarding).
function ensurePlans(){
  if (!S.ob) return false; S.planWk = S.planWk || {}; const mon = mondayOf(today()); let ch = false;
  for (const w of [mon].concat(dow(today()) >= 4 ? [addDays(mon, 7)] : [])) if (!S.planWk[w]) { buildWeekPlan(w, false, w === mon ? today() : w); S.planWk[w] = 1; ch = true; }
  if (ch) { Object.keys(S.planWk).sort().slice(0, -8).forEach(k => delete S.planWk[k]); save(); }
  return ch;
}
// A lista de compras segue o plano da semana: quando o plano muda, os produtos sugeridos são recalculados.
function syncShop(){ const mon = mondayOf(today()), sig = S.plan.filter(x => x.date >= mon && x.date <= addDays(mon, 6) && x.r).map(x => x.r + ":" + (x.x || 1)).sort().join(",");
  if (sig !== S.shopSig) { genShop(mon); S.shopSig = sig; save(); } }
