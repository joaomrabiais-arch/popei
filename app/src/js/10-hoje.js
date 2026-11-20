/* ========================== HOJE ========================== */
let curDay = today();
const dayTotals = k => (S.days[k] || []).reduce((a, m) => ({ k:a.k+(+m.k||0), p:a.p+(+m.p||0), c:a.c+(+m.c||0), g:a.g+(+m.g||0) }), { k:0, p:0, c:0, g:0 });
function renderHoje(){
  const u = S.u || {}, k = curDay, hr = new Date().getHours();
  $("#h-date").textContent = fmtDay(k) + (k === today() ? "" : " · outro dia");
  $("#h-hi").textContent = (hr < 6 ? "Boa noite" : hr < 12 ? "Bom dia" : hr < 20 ? "Boa tarde" : "Boa noite") + (u.name ? ", " + u.name : "");
  const mon = mondayOf(k);
  $("#h-week").innerHTML = DOW.map((d, i) => { const dk = addDays(mon, i);
    return `<button class="${dk === k ? "on " : ""}${dk === today() ? "today " : ""}${(S.days[dk]||[]).length ? "has" : ""}" data-d="${dk}" aria-label="${fmtDay(dk)}" aria-pressed="${dk === k}"><span>${d}</span><b>${parseK(dk).getDate()}</b><i></i></button>`; }).join("");
  $$("#h-week button").forEach(b => b.onclick = () => { curDay = b.dataset.d; renderHoje(); });

  // 1) Resumo do dia: Comido · Restam (anel) · Objetivo, e macros "x / y g"
  const T = dayTotals(k), L = S.days[k] || [], md = new Set(L.map(m => m.m)).size, R = 68, C = 2*Math.PI*R;
  const on = kcalOn(), left = Math.max(0, S.goal - T.k), over = Math.max(0, T.k - S.goal);
  const frac = on ? clamp(T.k / S.goal, 0, 1) : md / 4, mTot = Math.max(T.p + T.c + T.g, 1);
  $("#h-sum").className = "card summary2";
  $("#h-sum").innerHTML = `<div class="sum-top">
      <div class="sum-side"><b>${on ? T.k : L.length}</b><small>${on ? "comido" : "registos"}</small></div>
      <div class="ring big"><svg viewBox="0 0 156 156" aria-hidden="true"><circle class="tr" cx="78" cy="78" r="${R}"/><circle class="fg" cx="78" cy="78" r="${R}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" id="ringfg"/></svg>
        <div class="rv"><b class="num">${on ? (over ? over : left) : md}</b><small>${on ? (over ? "kcal acima" : "kcal restam") : "de 4 refeições"}</small></div></div>
      <div class="sum-side"><b>${on ? S.goal : 4}</b><small>${on ? "objetivo" : "refeições"}</small></div></div>
    <div class="mrings">${MACROS.map(([n, x, col]) => { const tg = on && S.macro ? S.macro[x] : 0, v = Math.round(T[x]), f = tg ? Math.min(1, v / tg) : v / mTot, r = 19, c = 2 * Math.PI * r;
      const st = !tg ? `${Math.round(v / mTot * 100)}% do dia` : v < tg ? `faltam ${tg - v} g` : v > tg * 1.15 ? `+${v - tg} g` : "na meta";
      return `<div class="mr" aria-label="${n}: ${v} g${tg ? ` de ${tg} g` : ""}"><div class="mr-ring"><svg viewBox="0 0 48 48" aria-hidden="true"><circle class="tr" cx="24" cy="24" r="${r}"/><circle cx="24" cy="24" r="${r}" fill="none" stroke="${col}" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - f)).toFixed(1)}" transform="rotate(-90 24 24)"/></svg><b class="num">${v}<small>g</small></b></div>
        <span class="mr-n"><i style="background:${col}"></i>${n}</span><small class="mr-s">${st}</small>${tg ? `<small class="mr-of">de ${tg} g</small>` : ""}</div>`; }).join("")}</div>
    ${L.length ? `<button class="sum-more" id="h-detail">Ver o dia em detalhe ${icon("right","xs")}</button>` : ""}`;
  const hd = $("#h-detail"); if (hd) hd.onclick = () => openDayDetail(k);
  requestAnimationFrame(() => requestAnimationFrame(() => { const f = $("#ringfg"); if (f) f.style.strokeDashoffset = (C*(1-frac)).toFixed(1); }));
  renderCoach();

  // 2) Refeições: nome + kcal (ou porção) e nada mais
  // Cada refeição: ilustração (ou a foto do prato do plano), progresso e, se ainda não comeste, o prato planeado com "Comi isto".
  $("#h-meals").innerHTML = MEALS.map(M => { const it = L.filter(m => m.m === M.id), kc = it.reduce((a,m) => a+(+m.k||0), 0), tg = Math.round(S.goal * ({ "Pequeno-almoço":.25, "Almoço":.35, "Lanche":.1, "Jantar":.3 }[M.id]) / 10) * 10;
    const pl = S.plan.find(x => x.date === k && x.m === M.id && x.r), pr = pl && RECIPES.find(r => r.id === pl.r);
    return `<div class="mealw"><div class="meal">${pr && photoOf(pr) ? `<img class="meal-ph" src="${esc(photoOf(pr))}" alt="">` : artTile(MEAL_ART[M.id], 52)}
      <div class="lt"><b>${M.id}</b><small>${kcalOn() ? `${kc} / ${tg} kcal` : it.length ? it.length + (it.length > 1 ? " itens" : " item") : "Por registar"}</small>${kcalOn() ? `<span class="mbar"><i style="width:${Math.min(100, Math.round(kc / tg * 100))}%"></i></span>` : ""}</div>
      <button class="plus" data-add="${M.id}" aria-label="Adicionar ao ${M.id}">${icon("plus","sm")}</button></div>
      ${!it.length && pr && k === today() ? `<div class="meal-plan"><span class="small">No plano: <button class="lnk" data-prec="${pr.id}"><b>${esc(pr.n)}</b></button></span><button class="btn soft sm" data-ate="${pl.id}">Comi isto</button></div>` : ""}
      ${it.length ? `<div class="meal-items">${it.map(m => `<button data-edit="${m.id}" aria-label="Editar ${esc(m.n)}"><span>${esc(m.n)}${!kcalOn() && m.q ? ` <span class="q">${esc(m.q)}</span>` : ""}</span><span>${kcalOn() ? m.k + " kcal" : ""}</span></button>`).join("")}</div>` : ""}</div>`; }).join("");
  $$("#h-meals [data-prec]").forEach(b => b.onclick = () => openRecipe(+b.dataset.prec));
  $$("#h-meals [data-ate]").forEach(b => b.onclick = () => { const pl = S.plan.find(x => x.id === b.dataset.ate), r = pl && RECIPES.find(q => q.id === pl.r); if (!r) return; const x = pl.x || 1;
    addEntry(k, { n:r.n, k:Math.round(r.k * x), p:Math.round(r.p * x), c:Math.round(r.h * x), g:Math.round(r.g * x), m:pl.m, q:x === 1 ? "1 porção" : String(x).replace(".", ",") + " porções", src:"plan" }); renderHoje(); toast("Registado do plano"); });
  $$("#h-meals [data-add]").forEach(b => b.onclick = () => openAdd(b.dataset.add));
  $$("#h-meals [data-edit]").forEach(b => b.onclick = () => openEdit(k, b.dataset.edit));

  // 3) Água
  const w = S.water[k] || 0, Lt = v => (v*0.25).toLocaleString("pt-PT", { maximumFractionDigits:2 });
  $("#h-water").innerHTML = `<div class="water"><span class="wdrop">${icon("drop")}</span><div class="grow"><h3>Água</h3><p class="small muted"><span class="num" style="color:var(--ink)">${Lt(w)} L</span> de ${Lt(S.wg)} L</p></div>
    <button class="iconbtn" id="w-minus" aria-label="Tirar um copo" ${w ? "" : "disabled"}>${icon("minus","sm")}</button><button class="iconbtn wplus" id="w-plus" aria-label="Mais um copo">${icon("plus","sm")}</button></div>
    <div class="glasses">${Array.from({ length:S.wg }, (_, i) => `<button class="glass ${i < w ? "drunk" : ""}" data-g="${i}" aria-label="Copo ${i+1} de 250 ml${i < w ? ", bebido" : ""}"><i></i></button>`).join("")}</div>`;
  $$("#h-water .glass").forEach(b => b.onclick = () => { const i = +b.dataset.g; setWater(k, i < w ? i : i+1); });
  $("#w-minus").onclick = () => setWater(k, w-1); $("#w-plus").onclick = () => setWater(k, w+1);

  // 4) Desafios (sempre os de hoje) e giros disponíveis
  renderRewardBanner();
  const tk = today(), CH = todaysChallenges(tk);
  // Desafios em cartões: ícone, progresso quando há números, e o prémio (+1 giro) bem à vista.
  const CH_IC = { agua6:["drop","--water"], peq:["coffee","--sun"], "3ref":["bowl","--brand"], fruta:["apple","--coral"], legume:["leaf","--brand"], calma:["moon","--water"], mexer:["dumbbell","--coral"], planear:["cal","--sun"], nova:["book","--brand"] };
  const CH_PR = { agua6:() => [S.water[tk] || 0, 6], "3ref":() => [new Set((S.days[tk] || []).map(m => m.m)).size, 3] };
  $("#h-ch").className = "chcards";
  $("#h-ch").innerHTML = CH.map(c => { const dn = challengeDone(c, tk), [ic, col] = CH_IC[c.id] || ["star","--brand"], pr = CH_PR[c.id] && CH_PR[c.id]();
    return `<button class="chc ${dn ? "done" : ""}" data-c="${c.id}" aria-pressed="${dn}" style="--cc:var(${col})"><span class="chc-ic">${icon(dn ? "check" : ic, "sm")}</span><b>${esc(c.n)}</b>
      ${pr && !dn ? `<span class="chc-bar"><i style="width:${Math.min(100, pr[0] / pr[1] * 100)}%"></i></span><small>${Math.min(pr[0], pr[1])} de ${pr[1]}</small>` : `<small>${dn ? "Feito" : c.auto ? "Marca-se sozinho" : "Toca quando fizeres"}</small>`}
      <span class="chc-gift">${icon("gift","xs")} +1 giro</span></button>`; }).join("");
  $$("#h-ch [data-c]").forEach(b => b.onclick = () => { const c = CHALLENGES.find(x => x.id === b.dataset.c); if (c.auto) { toast("Este marca-se sozinho quando o fizeres."); return; }
    S.ch[tk] = S.ch[tk] || []; const i = S.ch[tk].indexOf(c.id); if (i >= 0) S.ch[tk].splice(i,1); else S.ch[tk].push(c.id); save(); syncChallenges(); renderHoje(); });

  // 5) Secundário: treino e receitas numa só lista discreta
  const se = sessionFor(k), rec = suggestRecipes()[0];
  const wkRow = !S.wk ? ["Treino", "Escolher um plano"] : !se ? ["Treino", "Hoje é dia de descanso"] : [se.sess.n, `${se.prog.min} min · ${workoutDone(k) ? "concluído" : se.sess.e.length + " exercícios"}`];
  $("#h-more").innerHTML = `<button class="li" data-tab="planos" data-sub="treino"><span class="badge">${icon("dumbbell")}</span><span class="lt"><b>${esc(wkRow[0])}</b><small>${esc(wkRow[1])}</small></span>${icon("right","sm")}</button>`
    + (rec ? `<button class="li" data-rec="${rec.id}"><span class="badge">${icon("book")}</span><span class="lt"><b>${esc(rec.n)}</b><small>Receita sugerida · ${rec.t} min</small></span>${icon("right","sm")}</button>` : "")
    + `<button class="li" id="h-prog"><span class="badge">${icon("chart")}</span><span class="lt"><b>Progresso</b><small>Peso, energia, água e treinos</small></span>${icon("right","sm")}</button>`
    + `<button class="li" data-tab="receitas"><span class="badge">${icon("search")}</span><span class="lt"><b>Ver receitas</b><small>${RECIPES.filter(recipeAllowed).length} compatíveis contigo</small></span>${icon("right","sm")}</button>`;
  const rb = $("#h-more [data-rec]"); if (rb) rb.onclick = () => openRecipe(+rb.dataset.rec); $("#h-prog").onclick = openSummary;
}
function setWater(k, v){ const before = S.water[k] || 0; S.water[k] = clamp(v, 0, 20); save(); if (S.water[k] > before) { ach("water"); snd("ok"); if (S.water[k] >= S.wg && before < S.wg) say("waterGoal", true); else say("water"); } syncChallenges(); renderHoje(); }
function renderRewardBanner(){ const b = $("#h-spins"); if (!b) return; b.textContent = S.spins ? `${S.spins} giro${S.spins > 1 ? "s" : ""} na roda` : `Roda · ronda ${S.round}/3`; }

/* ========================== Abi: o próximo passo ========================== */
function coach(){
  const k = today(), L = S.days[k] || [], hr = new Date().getHours(), has = m => L.some(x => x.m === m), w = S.water[k] || 0, se = sessionFor(k), u = S.u || {};
  if (curDay !== k) return { t:"Estás a ver outro dia. Queres voltar a hoje?", b:"Voltar a hoje", fn:() => { curDay = k; renderHoje(); }, m:"think" };
  if (!has("Pequeno-almoço") && hr >= 6 && hr < 11) return { t:"Bom dia! Já tomaste o pequeno-almoço? Regista-o em 10 segundos.", b:"Registar", fn:() => openAdd("Pequeno-almoço"), m:"wave" };
  if (!has("Almoço") && hr >= 12 && hr < 16) return { t:"Hora de almoço. O que vai ser hoje?", b:"Registar almoço", fn:() => openAdd("Almoço"), m:"happy" };
  if (w < Math.min(S.wg, Math.floor((hr - 7) / 2))) return { who:"abi", t:`Bebeste ${w} copo${w === 1 ? "" : "s"} de água. Que tal mais um agora?`, b:"Bebi um copo", fn:() => setWater(k, w + 1), m:"think" };
  if ((u.hard || []).includes("Petiscar entre refeições") && hr >= 15 && hr < 18 && !has("Lanche")) return { t:"Um lanche a horas ajuda a não petiscar ao fim da tarde. Já tens um?", b:"Registar lanche", fn:() => openAdd("Lanche"), m:"think" };
  if (se && !workoutDone(k)) return { who:"abi", t:`Hoje há treino: ${se.sess.n}, ${se.prog.min} minutos. Vamos?`, b:"Ver treino", fn:() => { planSub = "treino"; go("planos"); }, m:"wave" };
  if (!has("Jantar") && hr >= 19 && hr < 23) return { t:"E o jantar? Regista para fechares o dia.", b:"Registar jantar", fn:() => openAdd("Jantar"), m:"happy" };
  const pj = S.plan.find(x => x.date === k && x.m === "Jantar" && x.r); // o plano já está feito: o Abi lembra o que há para o jantar
  if (pj && !has("Jantar") && hr >= 16 && hr < 20) return { t:`Ao jantar tens ${pj.n} no plano. Queres ver a receita?`, b:"Ver receita", fn:() => openRecipe(pj.r), m:"happy" };
  const lw = Object.keys(S.weights || {}).sort().pop();
  if (kcalOn() && (!lw || lw < addDays(k, -7))) return { t:"Já não registas o peso há algum tempo. Queres atualizar?", b:"Registar peso", fn:openSummary, m:"think" };
  if (S.spins) return { who:"abi", t:`Tens ${S.spins} giro${S.spins > 1 ? "s" : ""} na roda à tua espera!`, b:"Girar a roda", fn:() => go("roda"), m:"party" };
  return { t: L.length >= 3 ? "Dia bem registado. Estou orgulhoso de ti." : "Bom ritmo. Um passo de cada vez.", m:"happy" };
}
let lastCoach = "";
// O coach: a mascote certa para o momento, num balão com o próximo passo e um botão para o fazer.
function renderCoach(){
  const c = coach(), who = c.who || "abi", el = $("#h-tip");
  el.className = `coach coach-${who}`;
  el.innerHTML = `<div class="coach-m">${face(who, { mood:c.m, size: who === "abi" ? 104 : 86 })}</div>${bubbleHTML(who, { action:c.b })}`;
  if (lastCoach === c.t) $(".bub-t", el).textContent = c.t; else { speak(el, c.t); lastCoach = c.t; }
  const b = $(".bub-act", el); if (b) b.onclick = () => { burst($(".mwrap", el), who === "abi" ? "spark" : "heart"); c.fn(); };
}


/* ========================== O dia em detalhe ========================== */
// Cores validadas para daltonismo (proteína, hidratos e gordura); o texto usa sempre as cores de texto, nunca a do macro.
const MACROS = [["Hidratos","c","var(--carb)"],["Proteína","p","var(--prot)"],["Gordura","g","var(--fat)"]];
const KCAL_G = { p:4, c:4, g:9 };
function openDayDetail(k){
  const L = S.days[k] || [], T = dayTotals(k), on = kcalOn(), en = T.p * 4 + T.c * 4 + T.g * 9 || 1;
  const ref = S.macro ? (() => { const e = S.macro.p * 4 + S.macro.c * 4 + S.macro.g * 9; return { p:S.macro.p * 4 / e, c:S.macro.c * 4 / e, g:S.macro.g * 9 / e }; })() : { p:.2, c:.5, g:.3 };
  const pct = x => Math.round(x * 100);
  const seg = (x, frac, grams, label) => `<i style="flex:${Math.max(frac, .001)};background:${MACROS.find(m => m[1] === x)[2]}" title="${label}"></i>`;
  const split = (P, label) => `<div class="split"><span class="split-l">${label}</span><div class="sbar">${MACROS.map(([n, x]) => seg(x, P[x], 0, `${n}: ${pct(P[x])}% da energia`)).join("")}</div>
    <div class="split-v">${MACROS.map(([n, x, col]) => `<span><i style="background:${col}"></i>${n} <b>${pct(P[x])}%</b></span>`).join("")}</div></div>`;
  const per = MACROS.reduce((o, [, x]) => (o[x] = T[x] * KCAL_G[x] / en, o), {});
  const byMeal = MEALS.map(M => { const it = L.filter(m => m.m === M.id), t = it.reduce((a, m) => ({ k:a.k + (+m.k || 0), p:a.p + (+m.p || 0), c:a.c + (+m.c || 0), g:a.g + (+m.g || 0) }), { k:0, p:0, c:0, g:0 }); return { M, it, t }; });
  const maxE = Math.max(1, ...byMeal.map(b => b.t.p * 4 + b.t.c * 4 + b.t.g * 9));
  openSheet(k === today() ? "O teu dia" : fmtDay(k), `
    <div class="legend">${MACROS.map(([n, , col]) => `<span><i style="background:${col}"></i>${n}</span>`).join("")}</div>
    <div class="card" style="margin-top:12px"><h3>De onde vem a energia</h3><p class="small muted" style="margin-top:2px">Percentagem da energia do dia que vem de cada macro.</p>
      ${split(per, "Hoje")}${split(ref, S.macro ? "A tua referência" : "Referência geral")}
      <p class="tiny muted" style="margin-top:10px">Proteína e hidratos dão 4 kcal por grama; gordura dá 9. ${S.macro ? "" : "Sem dados teus, compara com uma divisão equilibrada comum."}</p></div>
    <div class="card" style="margin-top:12px"><h3>Por refeição</h3>
      ${byMeal.map(({ M, it, t }) => { const e = t.p * 4 + t.c * 4 + t.g * 9;
        return `<div class="mealbar"><div class="row between"><span class="small"><b>${M.id}</b></span><span class="small muted num">${it.length ? (on ? `${t.k} kcal · ` : "") + `P ${Math.round(t.p)} · H ${Math.round(t.c)} · G ${Math.round(t.g)} g` : "Por registar"}</span></div>
          <div class="sbar thin" style="width:${Math.max(e ? 6 : 0, e / maxE * 100)}%">${e ? MACROS.map(([n, x]) => seg(x, t[x] * KCAL_G[x] / e, 0, `${n} ao ${M.id.toLowerCase()}: ${Math.round(t[x])} g`)).join("") : ""}</div></div>`; }).join("")}</div>
    <div class="card" style="margin-top:12px"><h3>O que comeste</h3>
      <table class="dtable"><thead><tr><th>Alimento</th>${on ? "<th>kcal</th>" : ""}<th>P</th><th>H</th><th>G</th></tr></thead><tbody>
      ${L.slice().sort((a, b) => (+b.k || 0) - (+a.k || 0)).map(m => `<tr><td>${esc(m.n)}<small>${esc(m.m)}${m.src === "foto" ? " · estimativa por foto" : ""}</small></td>${on ? `<td class="num">${m.k | 0}</td>` : ""}<td class="num">${Math.round(+m.p || 0)}</td><td class="num">${Math.round(+m.c || 0)}</td><td class="num">${Math.round(+m.g || 0)}</td></tr>`).join("")}
      <tr class="tot"><td>Total</td>${on ? `<td class="num">${T.k}</td>` : ""}<td class="num">${Math.round(T.p)}</td><td class="num">${Math.round(T.c)}</td><td class="num">${Math.round(T.g)}</td></tr></tbody></table>
      <p class="tiny muted" style="margin-top:8px">Gramas de proteína (P), hidratos (H) e gordura (G). Valores aproximados.</p></div>`);
}
