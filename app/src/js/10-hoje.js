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
    <div class="macros3">${[["Hidratos","c","var(--carb)"],["Proteína","p","var(--prot)"],["Gordura","g","var(--fat)"]].map(([n,x,col]) => { const tg = on && S.macro ? S.macro[x] : 0;
      return `<div class="mac"><div class="mh"><span>${n}</span><b>${Math.round(T[x])}${tg ? ` / ${tg} g` : " g"}</b></div><div class="bar"><i style="width:${Math.min(100, Math.round(T[x]/(tg || mTot)*100))}%;background:${col}"></i></div></div>`; }).join("")}</div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => { const f = $("#ringfg"); if (f) f.style.strokeDashoffset = (C*(1-frac)).toFixed(1); }));
  renderCoach();

  // 2) Refeições: nome + kcal (ou porção) e nada mais
  $("#h-meals").innerHTML = MEALS.map(M => { const it = L.filter(m => m.m === M.id), kc = it.reduce((a,m) => a+(+m.k||0), 0);
    return `<div class="mealw"><div class="meal"><div class="badge">${icon(M.ic)}</div><div class="lt"><b>${M.id}</b><small>${kcalOn() ? `${kc} / ${Math.round(S.goal * ({ "Pequeno-almoço":.25, "Almoço":.35, "Lanche":.1, "Jantar":.3 }[M.id]) / 10) * 10} kcal` : it.length ? it.length + (it.length > 1 ? " itens" : " item") : "Por registar"}</small></div>
      <button class="plus" data-add="${M.id}" aria-label="Adicionar ao ${M.id}">${icon("plus","sm")}</button></div>
      ${it.length ? `<div class="meal-items">${it.map(m => `<button data-edit="${m.id}" aria-label="Editar ${esc(m.n)}"><span>${esc(m.n)}${!kcalOn() && m.q ? ` <span class="q">${esc(m.q)}</span>` : ""}</span><span>${kcalOn() ? m.k + " kcal" : ""}</span></button>`).join("")}</div>` : ""}</div>`; }).join("");
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
  $("#h-ch").innerHTML = CH.map(c => { const dn = challengeDone(c, tk); return `<button class="challenge ${dn ? "done" : ""}" data-c="${c.id}" aria-pressed="${dn}"><span class="tick">${icon("check","xs")}</span><span class="lt"><b>${esc(c.n)}</b>${c.auto ? `<small>Marca-se sozinho</small>` : ""}</span></button>`; }).join("");
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
  if (w < Math.min(S.wg, Math.floor((hr - 7) / 2))) return { who:"morango", t:`Bebeste ${w} copo${w === 1 ? "" : "s"} de água. Que tal mais um agora?`, b:"Bebi um copo", fn:() => setWater(k, w + 1), m:"think" };
  if ((u.hard || []).includes("Petiscar entre refeições") && hr >= 15 && hr < 18 && !has("Lanche")) return { t:"Um lanche a horas ajuda a não petiscar ao fim da tarde. Já tens um?", b:"Registar lanche", fn:() => openAdd("Lanche"), m:"think" };
  if (se && !workoutDone(k)) return { who:"morango", t:`Hoje há treino: ${se.sess.n}, ${se.prog.min} minutos. Vamos?`, b:"Ver treino", fn:() => { planSub = "treino"; go("planos"); }, m:"wave" };
  if (!has("Jantar") && hr >= 19 && hr < 23) return { t:"E o jantar? Regista para fechares o dia.", b:"Registar jantar", fn:() => openAdd("Jantar"), m:"happy" };
  if (!S.plan.some(x => x.date === addDays(k, 1))) return { t:"Amanhã ainda não tem refeições planeadas. Faço-te um plano à medida?", b:"Criar plano", fn:() => { planSub = "ref"; go("planos"); }, m:"think" };
  const lw = Object.keys(S.weights || {}).sort().pop();
  if (kcalOn() && (!lw || lw < addDays(k, -7))) return { t:"Já não registas o peso há algum tempo. Queres atualizar?", b:"Registar peso", fn:openSummary, m:"think" };
  if (S.spins) return { who:"morango", t:`Tens ${S.spins} giro${S.spins > 1 ? "s" : ""} na roda à tua espera!`, b:"Girar a roda", fn:() => go("roda"), m:"party" };
  return { t: L.length >= 3 ? "Dia bem registado. Estou orgulhoso de ti." : "Bom ritmo. Um passo de cada vez.", m:"happy" };
}
let lastCoach = "";
// O coach: a mascote certa para o momento, num balão com o próximo passo e um botão para o fazer.
function renderCoach(){
  const c = coach(), who = c.who || "abi", el = $("#h-tip");
  el.className = `coach coach-${who}`;
  el.innerHTML = `<div class="coach-m">${face(who, { mood:c.m, size: who === "morango" ? 104 : 86 })}</div>${bubbleHTML(who, { action:c.b })}`;
  if (lastCoach === c.t) $(".bub-t", el).textContent = c.t; else { speak(el, c.t); lastCoach = c.t; }
  const b = $(".bub-act", el); if (b) b.onclick = () => { burst($(".mwrap", el), who === "morango" ? "spark" : "heart"); c.fn(); };
}

