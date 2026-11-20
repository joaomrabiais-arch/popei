/* ========================== Onboarding: personalização do plano ==========================
   Cinco secções curtas. Cada pergunta muda alguma coisa no plano; todas se podem saltar (fica um valor por omissão).
   Em cima: progresso por secção, estimativa ao vivo (energia, proteína, custo da semana) e o resumo das escolhas.
   As mascotes só aparecem nos momentos-chave: início, treino e fim. */
const nm = A => A.name ? `, ${A.name}` : "";
const OB_SECS = ["Sobre ti","A tua casa","Segurança","A tua semana","O teu gosto","Treino","As compras"];
const GOAL_D = { perder:"Devagar e sem dietas restritivas.", manter:"Comer bem e manter o peso.", musculo:"Mais proteína e um pequeno excedente.", rendimento:"Energia para treinar e recuperar.", livre:"Sem números: só refeições equilibradas." };
const DISLIKES = ["Cogumelos","Coentros","Cebola","Pimento","Peixe","Marisco","Leguminosas","Picante","Tofu","Ovos","Abacate","Beringela","Courgette","Brócolos","Espinafres","Azeitonas","Nada em especial"];
const OB = [
  { k:"hook", sec:0, who:"abi", m:"wave", type:"hook", q:() => "Comer bem não devia ser uma luta.", s:"Dietas que duram duas semanas, contas a cada refeição, culpa ao fim de semana. Já passámos todos por isso." },
  { k:"name", sec:0, type:"text", q:() => `Olá! Eu sou o ${BRAND.mascot}. Como te chamo?`, s:"São cerca de 3 minutos e depois não tens de responder a mais nada. Podes saltar qualquer pergunta." },
  { k:"agep", sec:0, type:"age", q:A => `Que idade tens${nm(A)}?`, s:"Abaixo dos 18 anos a app não mostra calorias nem metas de peso." },
  { k:"goal", sec:0, one:1, q:() => "Qual é o teu objetivo neste momento?", s:"Podes mudar quando quiseres.", o:A => GOALS.filter(g => g[0] !== "perder" || isAdultA(A)).map(g => [g[0], g[1], GOAL_D[g[0]]]),
    after:(A, pv) => pv.r ? `<div class="ob-hint">${icon("bowl","sm")}<span>O teu jantar, assim: <b>≈ ${Math.round(pv.r.p * (mealShares(pv.P).Jantar || .3))} g de proteína</b></span></div>` : "" },
  { k:"body", sec:0, type:"body", when:A => isAdultA(A) && A.goal !== "livre", q:() => "A tua altura e peso atuais", s:"Servem para a referência de energia e proteína. Ficam só neste aparelho." },
  { k:"tw", sec:0, type:"target", when:A => isAdultA(A) && !A._noBody && (A.goal === "perder" || A.goal === "musculo"), q:() => "Onde gostavas de chegar?", s:"Opcional. Escolhe um ritmo realista: devagar também lá chega, e dura mais." },
  { k:"act", sec:0, one:1, q:() => "Quanto te mexes numa semana normal?", s:"Contam treinos, caminhadas e trabalho físico.", o:ACTS },
  { k:"portion", sec:0, one:1, q:() => "E quanto comes, normalmente?", s:"É o teu prato de todos os dias.", o:PORTIONS,
    after:(A, pv) => `<div class="ob-hint">${icon("target","sm")}<span>${pv.r ? `Energia por dia: <b>≈ ${pv.r.kcal} kcal</b>. As porções das receitas ajustam-se a isto.` : "Sem contar calorias: ajusto a quantidade de cada receita ao teu apetite."}</span></div>` },
  { k:"people", sec:1, type:"people", q:() => "Para quantas pessoas cozinhas?", s:"Conta contigo. As quantidades da lista de compras e o custo ajustam-se. O plano de energia é só teu." },
  { k:"al", sec:2, ex:"Nenhuma", q:() => "Tens alergias ou intolerâncias?", s:"Tiro do plano tudo o que as tenha. Confirma sempre os rótulos.", o:["Lactose","Glúten","Frutos secos","Amendoim","Marisco","Ovos","Soja","Peixe","Sésamo","Nenhuma"] },
  { k:"diet", sec:2, ex:"Como de tudo", q:() => "Segues alguma forma de comer?", s:"Podes escolher várias.", o:["Como de tudo","Vegetariano","Vegan","Pescetariano","Não como carne de porco"] },
  { k:"dislikes", sec:2, ex:"Nada em especial", search:1, q:() => "O que preferes evitar?", s:"Escolhe o que não queres ver no prato.", o:DISLIKES, other:1 },
  { k:"pmeals", sec:3, q:() => "Que refeições queres planear?", s:"Escolhe os momentos do dia que queres incluir.", o:() => [["Pequeno-almoço","Pequeno-almoço","Começar bem o dia"],["Almoço","Almoço","Em casa, no trabalho ou para levar"],["Lanche","Lanches","A meio da manhã ou da tarde"],["Jantar","Jantar","Todos à mesa"]] },
  { k:"cstyle", sec:3, one:1, q:() => "Como gostas de cozinhar?", s:"Escolhe o que melhor se ajusta à tua semana.", o:COOK_STYLES, after:(A, pv) => rhythmHTML(pv) },
  { k:"ctime", sec:3, one:1, q:() => "Quanto tempo tens para cozinhar?", s:"Pensa nas noites da semana.", o:CTIMES,
    after:A => `<button class="opt tgl ${A.weMore !== false ? "on" : ""}" id="ob-we" aria-pressed="${A.weMore !== false}"><span class="tick">${icon("check","xs")}</span><span><b style="display:block;font-weight:600">E ao fim de semana tenho mais tempo</b><small class="muted">Sábado e domingo conto com até 1 hora</small></span></button>` },
  { k:"cuis", sec:4, ex:"tudo", q:() => "Que cozinhas gostas de comer?", s:"Escolhe quantas quiseres. Orientam o plano, nunca o bloqueiam.", o:CUISINES },
  { k:"novelty", sec:4, one:1, q:() => "Quantas receitas novas por semana?", s:"Do que já conheces ao mais aventureiro.", o:NOVELTY },
  { k:"taste", sec:4, type:"taste", q:() => `Ensina o ${BRAND.mascot}`, s:A => Object.keys(A.taste || {}).length >= 3 ? "Já chega. Continua se quiseres." : "Cozinhavas isto? Toca para passar, gostar ou adorar." },
  { k:"tdays", sec:5, type:"tdays", q:() => "Em que dias treinas?", s:"Nesses dias o plano leva mais proteína e hidratos. Não treinas? Tudo bem." },
  { k:"gym", sec:5, who:"abi", m:"wow", one:1, q:A => `Queres que te monte um plano de treino${nm(A)}?`, s:"Feito à tua medida, com treino guiado. Podes ativá-lo mais tarde em Planos.", o:[["sim","Sim, quero treinar"],["nao","Agora não"]] },
  { k:"place", sec:5, one:1, when:A => A.gym === "sim", q:() => "Onde vais treinar?", s:"Escolhe o sítio onde treinas mais vezes.", o:[["gym","No ginásio"],["equip","Em casa, com halteres ou elásticos"],["casa","Em casa, sem material"],["rua","Na rua ou num parque"]] },
  { k:"equip", sec:5, ex:"Nenhum", when:A => A.gym === "sim" && A.place !== "gym", q:() => "Que material tens à mão?", s:"Escolhe tudo o que tens.", o:["Halteres","Elásticos","Kettlebell","Barra de elevações","Banco ou degrau","Tapete","Nenhum"] },
  { k:"gdaysSel", sec:5, type:"days", when:A => A.gym === "sim" && !gymDaysOk(A.tdays), q:() => "Em que dias consegues treinar?", s:"Para o plano de treino, escolhe 2 a 6 dias." },
  { k:"gmin", sec:5, one:1, when:A => A.gym === "sim", q:() => "Quanto tempo tens por treino?", s:"Conta com o aquecimento.", o:[["20","20 minutos"],["30","30 minutos"],["45","45 minutos"],["60","1 hora"]] },
  { k:"lvl", sec:5, one:1, when:A => A.gym === "sim", q:() => "Que experiência tens a treinar?", s:"Ajusta as séries e a dificuldade.", o:[["zero","Nunca treinei ou parei há muito"],["algum","Já treinei um pouco"],["regular","Treino com regularidade"]] },
  { k:"focus", sec:5, one:1, when:A => A.gym === "sim", q:() => "Queres dar mais atenção a alguma zona?", s:"O plano continua equilibrado.", o:[["todo","Corpo todo, equilibrado"],["pernas","Pernas e glúteos"],["cima","Peito, costas e braços"],["core","Abdominais e core"],["cardio","Resistência e cardio"]] },
  { k:"cardio", sec:5, one:1, when:A => A.gym === "sim", q:() => "Que cardio preferes?", s:"Uso-o no aquecimento e no fim dos treinos.", o:[["caminhar","Caminhar"],["correr","Correr"],["bicicleta","Bicicleta"],["nadar","Nadar"],["nenhum","Prefiro não fazer cardio"]] },
  { k:"lim", sec:5, ex:"Nenhuma", when:A => A.gym === "sim", q:() => "Tens alguma zona a poupar?", s:"Troco os exercícios que podem incomodar. Se tens dor, fala primeiro com um profissional.", o:["Joelhos","Costas","Ombros","Nenhuma"] },
  { k:"market", sec:6, one:1, q:() => "Onde fazes as compras?", s:"Ainda não temos preços por loja: usamos preços médios. Fica guardado para quando tivermos.", o:() => MARKETS.concat("Sem preferência") },
  { k:"home", sec:6, ex:"Nada disto", search:1, q:() => "Já tens na cozinha?", s:"Uso primeiro o que tens e sai da lista de compras para confirmares.", o:() => PANTRY.map(p => p[0]).concat("Nada disto") },
  { k:"budget", sec:6, type:"budget", q:() => "Quanto por semana?", s:"Opcional. É só um guia para escolher receitas; os preços são estimativas." },
  { k:"strict", sec:6, one:1, when:A => +A.budget > 0, q:() => "E se não couber tudo?", s:"Um guia, nunca um limite.", o:STRICT },
  { k:"result", sec:6, type:"result" }
];
// Ritmo da semana: em que dias se cozinha e em que dias se come o que sobrou.
function rhythmHTML(pv){
  const mon = mondayOf(today()), M = pv.P.meals.filter(isMain); if (!M.length) return "";
  let cook = 0; const rows = M.map(m => `<div class="rh-row"><span>${m === "Almoço" ? "almoço" : "jantar"}</span>${DOW.map((_, i) => { const k = addDays(mon, i), e = pv.E.find(x => x.date === k && x.m === m);
    const lef = e && (e.lo || (e.bt && dow(k) !== 0 && dow(k) !== 3)); return `<i class="${!e ? "" : lef ? "s" : "c"}"></i>`; }).join("")}</div>`).join("");
  for (let i = 0; i < 7; i++) { const k = addDays(mon, i); if (pv.E.some(x => x.date === k && isMain(x.m) && !(x.lo || (x.bt && i !== 0 && i !== 3)))) cook++; }
  return `<div class="rhythm"><b>Cozinhas ${cook} ${cook === 1 ? "vez" : "vezes"} por semana</b><p class="tiny muted" style="margin-top:2px">● cozinhar · ○ comer o que sobrou</p>
    <div class="rh-row rh-h"><span></span>${DOW.map(d => `<em>${d[0]}</em>`).join("")}</div>${rows}</div>`;
}
const gymDaysOk = d => Array.isArray(d) && d.length >= 2 && d.length <= 6;
const isAdultA = A => A.ageN >= 18;
const obNoKcal = A => !isAdultA(A) || A.goal === "livre" || A._noBody || !validBody(Object.assign({}, A._b || {}, { age:A.ageN }));
// Corre fn como se S.u já fosse A (para pré-visualizar o plano com as respostas atuais).
function withU(A, fn){ const o = S.u; S.u = Object.assign({}, o || {}, A, { age: A.ageN >= 18 ? "18 ou mais" : A.ageN ? "Menos de 18" : "Prefiro não dizer" }); try { return fn(); } finally { S.u = o; } }

function openOnboarding(edit, startKey, single){
  const prevAge = S.u && S.u.age === "18 ou mais" ? (S.prof.age >= 18 ? S.prof.age : 30) : S.u && S.u.age === "Menos de 18" ? Math.min(S.prof.age, 17) : 0;
  const A = Object.assign({ name:"", goal:"", act:String(S.prof.act || ""), diet:[], al:[], dislikes:[], pmeals:[], portion:"", cstyle:"", ctime:"", cuis:[], home:[], tdays:null, budget:"", market:"", people:1, weMore:true, strict:"", novelty:"", taste:{},
    gym:"", place:"", gmin:"", lvl:"", lim:[], tw:"", pace:"0.5", equip:[], gdaysSel:[], focus:"", cardio:"" }, structuredClone(S.u || {}));
  A.ageN = S.ob ? prevAge : 0; A._b = Object.assign({}, S.prof);
  if (!S.ob || (S.u || {}).age !== "18 ou mais" || !validBody(A._b)) A._noBody = true; // na primeira vez o corpo por omissão não conta: só o que a pessoa indicar
  const B = A._b, vis = () => single ? OB.filter(s => s.k === startKey) : OB.filter(s => !s.when || s.when(A));
  let n = Math.max(0, vis().findIndex(x => x.k === startKey)), mood = null;
  const ob = $("#ob"), inn = $("#ob-in"); ob.classList.remove("hide");
  const optsOf = s => (typeof s.o === "function" ? s.o(A) : s.o).map(o => Array.isArray(o) ? o : [o, o]);
  const sel = (s, v) => s.one ? String(A[s.k]) === v : (A[s.k] || []).includes(v);
  const tog = (s, v) => { if (s.one) { A[s.k] = v; return; } let a = A[s.k] || []; a = a.includes(v) ? a.filter(x => x !== v) : v === s.ex ? [v] : a.filter(x => x !== s.ex).concat(v); A[s.k] = a; };
  const ageOk = () => A.ageN >= 10 && A.ageN <= 100;
  const validTarget = () => { const t = +A.tw, minW = 18.5 * (B.h / 100) ** 2; if (!(t >= 35 && t <= 250) || !A.pace) return false; return A.goal === "perder" ? (t < B.w && t >= minW) : t > B.w; };
  const twMsg = () => { const el = $("#ob-twn", inn); if (!el) return; const t = +A.tw, minW = Math.ceil(18.5 * (B.h / 100) ** 2);
    el.textContent = !t ? "" : A.goal === "perder" && t >= B.w ? "Para perder peso, escolhe um valor abaixo do atual." : A.goal === "perder" && t < minW ? `Esse peso fica abaixo de um IMC saudável. Escolhe ${minW} kg ou mais.` : A.goal === "musculo" && t <= B.w ? "Para ganhar músculo, escolhe um valor acima do atual." : ""; };
  const valid = s => ({ hook:1, text:1, result:1, tdays:Array.isArray(A.tdays), age:ageOk(), body:validBody(Object.assign({}, B, { age:A.ageN })), target:validTarget(), days:gymDaysOk(A.gdaysSel),
    budget:+A.budget >= 10 && +A.budget <= 1000, people:1, taste:Object.keys(A.taste || {}).length >= 3 })[s.type] ?? (s.one ? !!A[s.k] : (A[s.k] || []).length > 0 || (s.other && !!(A.dislikesOther || "").trim()));
  const readIn = s => { const v = id => { const e = $(id, inn); return e ? e.value : ""; };
    if (s.type === "text") A.name = v("#ob-n").trim().slice(0, 40);
    if (s.type === "age") A.ageN = Math.round(+v("#ob-age")) || 0;
    if (s.type === "body") { B.h = +v("#ob-h"); B.w = +v("#ob-w"); B.age = A.ageN; }
    if (s.type === "target") A.tw = v("#ob-tw");
    if (s.other) A.dislikesOther = v("#ob-o").slice(0, 80); };
  const planFor = () => generatePlan({ place:A.place || "casa", days:(gymDaysOk(A.tdays) ? A.tdays : A.gdaysSel || []).length || 3, dayIdx:gymDaysOk(A.tdays) ? A.tdays : A.gdaysSel, equip:(A.equip || []).filter(x => x !== "Nenhum"),
    focus:A.focus || "todo", cardio:A.cardio || "caminhar", min:A.gmin || 30, lvl:A.lvl || "zero", goal:A.goal || "manter", lim:(A.lim || []).filter(x => x !== "Nenhuma"),
    bmi: !obNoKcal(A) || validBody(B) ? B.w / ((B.h / 100) ** 2) : 22, age: A.ageN || 30 });
  const refOf = () => obNoKcal(A) ? null : computeRef(Object.assign({}, B, { age:A.ageN, act:A.act || "1.375" }), A.goal || "manter", A.pace);
  // Pré-visualização da semana com as respostas atuais (não toca no estado guardado).
  const preview = () => { const r = refOf(), mon = mondayOf(today());
    return withU(A, () => { const P = planPrefs(S.u), E = genWeekFit(P, mon, addDays(mon, 6), { ref: r ? { kcal:r.kcal, p:r.p } : null }); return { r, P, E, cost:planCost(E, P.home, P.people) }; }); };

  const finish = later => {
    const first = !S.ob;
    if (isAdultA(A) && !A._noBody && validBody(Object.assign({}, B, { age:A.ageN }))) S.prof = { sex:B.sex, age:A.ageN, h:B.h, w:B.w, act:A.act || "1.375" };
    else { if (A.ageN) S.prof.age = A.ageN; S.prof.act = A.act || S.prof.act; }
    A.age = A.ageN >= 18 ? "18 ou mais" : A.ageN ? "Menos de 18" : "Prefiro não dizer";
    if (!A.goal || (A.goal === "perder" && !isAdultA(A))) A.goal = "manter";
    if (!isAdultA(A)) A.tw = "";
    const extra = (A.dislikesOther || "").split(",").map(x => x.trim()).filter(Boolean);
    A.dislikes = (A.dislikes || []).filter(x => x !== "Nada em especial").concat(extra).filter((x, i, a) => a.indexOf(x) === i).slice(0, 20); delete A.dislikesOther;
    A.tdays = Array.isArray(A.tdays) ? A.tdays : []; if (gymDaysOk(A.tdays)) A.gdaysSel = A.tdays.slice();
    if (later) A.later = 1; else delete A.later;
    const keyChanged = startKey;
    delete A._noBody; delete A._b; delete A.ageN; delete A._note; delete A._ti; delete A._tl; delete A._q; A.obj = goalName(A.goal); S.u = A; S.ob = 1; applyRef();
    // Plano da semana: refeito a partir de hoje (só o que foi sugerido); perto do fim de semana, prepara também a seguinte.
    S.plan = S.plan.filter(x => !(x.a && x.date >= today())); S.planWk = {}; ensurePlans();
    if (A.gym === "sim" && (!single || keyChanged === "tdays" || keyChanged === "gym")) { const pl = planFor(); S.wkHist = Object.assign(S.wkHist || {}, (S.wk && S.wk.done) || {}); S.wk = { prog:"custom", custom:pl, days:pl.days.slice(), start:today(), done:{}, ex:{} }; }
    if (first) S.spins = 3; save(); ob.classList.add("hide"); refreshAll();
    if (first) setTimeout(() => celebrate({ who:"abi", title:"Presente de boas-vindas", name:"3 giros na roda de prémios", desc:`Gira a roda e ganha acessórios para o ${BRAND.mascot}. No fim das 3 tentativas, o prémio dourado é garantido.`, mood:"party", action:{ label:"Ir à roda", fn:() => go("roda") }, onClose:() => setTimeout(() => { if (!S.tourDone) startTour(); }, 300) }), 300);
    else { toast(single ? "Guardado. O plano desta semana foi atualizado." : "Preferências guardadas e plano atualizado"); if (!single) say(A.gym === "sim" ? "plan" : "hello", true); }
  };

  // Faixa da semana: os 7 jantares a encher à medida que respondes, pessoas, pratos e custo estimado.
  const weekStrip = pv => { const mon = mondayOf(today()), over = pv.P.budget && pv.cost > pv.P.budget * (pv.P.strict === "folga" ? 1.1 : 1);
    const days = DOW.map((d, i) => { const k = addDays(mon, i), e = pv.E.find(x => x.date === k && x.m === "Jantar") || pv.E.find(x => x.date === k && isMain(x.m)) || pv.E.find(x => x.date === k), r = e && RECIPES.find(q => q.id === e.r);
      return `<div class="ow-d"><span>${d[0]}</span><i class="${e ? "on" : ""}" title="${r ? esc(r.n) : ""}">${r && photoOf(r) ? `<img src="${esc(photoOf(r))}" alt="">` : r ? icon(CAT_IC[r.c] || "bowl","xs") : ""}</i></div>`; }).join("");
    const dishes = new Set(pv.E.filter(x => isMain(x.m)).map(x => x.r)).size;
    return `<div class="ob-week" aria-live="polite"><div class="ow-days">${days}</div><div class="ow-meta"><span>${pv.P.people} pessoa${pv.P.people > 1 ? "s" : ""} · ${dishes} pratos · ${pv.r ? `${pv.r.kcal} kcal/dia` : "sem contar calorias"}</span><b class="${over ? "over" : ""}">est. ${eur(pv.cost)}</b></div>
      ${A._note ? `<p class="ow-note">${icon("check","xs")} Anotado: ${esc(A._note)}</p>` : ""}</div>`; };
  const chosen = () => { const L = withU(A, () => prefsSummary(S.u)); const al = (A.al || []).filter(x => x !== "Nenhuma"), dt = (A.diet || []).filter(x => x !== "Como de tudo");
    if (A.goal) L.unshift(goalName(A.goal)); if (dt.length) L.push(dt.join(", ")); if (al.length) L.push("Sem " + al.join(", ").toLowerCase());
    return `<details class="ob-chosen"><summary>As tuas escolhas (${L.length})</summary><div>${L.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div></details>`; };
  const optBtn = (s, [v, l, d]) => `<button class="opt ${sel(s, v) ? "on" : ""}" data-o="${esc(v)}" aria-pressed="${sel(s, v)}"><span class="tick">${icon("check","xs")}</span>${d ? `<span><b style="display:block;font-weight:600">${esc(l)}</b><small class="muted">${esc(d)}</small></span>` : esc(l)}</button>`;

  const draw = () => { const V = vis(); n = Math.min(n, V.length - 1); const s = V[n], pv = preview();
    let body = "", q = s.q ? s.q(A) : "", sub = typeof s.s === "function" ? s.s(A) : s.s || "", head = s.who ? face(s.who, { mood: mood || s.m, size: s.who === "abi" ? 96 : 84 }) : "";
    if (s.type === "hook") body = `<ul class="hook">${[["cal","A tua semana de refeições feita por ti, à tua medida"],["cart","A lista de compras sai sozinha do plano"],["leaf","Sem dietas restritivas nem culpa: um passo de cada vez"]].map(([i, t]) => `<li><span>${icon(i,"sm")}</span>${t}</li>`).join("")}</ul>`;
    else if (s.type === "text") body = `<input id="ob-n" maxlength="40" autocomplete="given-name" placeholder="O teu nome" value="${esc(A.name)}" aria-label="Nome">`;
    else if (s.type === "age") body = `<label class="field"><span>Idade</span><input id="ob-age" type="number" inputmode="numeric" min="10" max="100" value="${A.ageN || ""}"></label><p class="small" id="ob-agen" style="margin-top:8px;color:var(--muted)"></p>`;
    else if (s.type === "body") body = `<div class="ob-form"><div class="seg" id="ob-sex"><button data-v="f" class="${B.sex === "f" ? "on" : ""}">Feminino</button><button data-v="m" class="${B.sex === "m" ? "on" : ""}">Masculino</button></div>
      <div class="g2"><label class="field"><span>Altura (cm)</span><input id="ob-h" type="number" inputmode="numeric" min="120" max="230" value="${A._noBody ? "" : B.h || ""}"></label><label class="field"><span>Peso atual (kg)</span><input id="ob-w" type="number" inputmode="decimal" step="0.1" min="30" max="250" value="${A._noBody ? "" : B.w || ""}"></label></div></div>`;
    else if (s.type === "target") { const lose = A.goal === "perder", P = lose ? [["0.25","Devagar","cerca de 0,25 kg por semana"],["0.5","Equilibrado","cerca de 0,5 kg por semana"],["0.75","Mais rápido","cerca de 0,75 kg por semana"]] : [["0.25","Devagar","menos gordura ganha"],["0.5","Equilibrado","o ritmo mais comum"]];
      body = `<label class="field"><span>Peso desejado (kg)</span><input id="ob-tw" type="number" inputmode="decimal" step="0.5" min="35" max="250" value="${esc(A.tw || "")}" placeholder="Agora: ${B.w} kg"></label><p class="small" id="ob-twn" style="margin-top:8px;color:var(--accent)"></p>
        <div class="opts" id="ob-pace" style="margin-top:10px">${P.map(([v,l,d]) => `<button class="opt ${String(A.pace) === v ? "on" : ""}" data-v="${v}"><span class="tick">${icon("check","xs")}</span><span><b style="display:block;font-weight:600">${l}</b><small class="muted">${d}</small></span></button>`).join("")}</div>`; }
    else if (s.type === "tdays" || s.type === "days") { const key = s.type === "tdays" ? "tdays" : "gdaysSel", D = A[key] || [];
      body = `<div class="row" id="ob-days" style="flex-wrap:wrap;gap:8px">${DOWL.map((d, i) => `<button class="chip ${D.includes(i) ? "on" : ""}" data-i="${i}" aria-pressed="${D.includes(i)}">${d}</button>`).join("")}</div>
        ${s.type === "tdays" ? `<button class="opt ${Array.isArray(A.tdays) && !A.tdays.length ? "on" : ""}" id="ob-notr" style="margin-top:12px;width:100%"><span class="tick">${icon("check","xs")}</span>Não treino, por agora</button>` : ""}
        <p class="small muted" style="margin-top:12px">${D.length === 1 ? "1 dia escolhido" : D.length + " dias escolhidos"}.</p>`; }
    else if (s.type === "people") body = `<div class="bigstep"><button class="iconbtn" data-pp="-1" aria-label="Menos uma pessoa" ${A.people <= 1 ? "disabled" : ""}>${icon("minus")}</button><b class="num">${A.people}</b><button class="iconbtn" data-pp="1" aria-label="Mais uma pessoa" ${A.people >= 8 ? "disabled" : ""}>${icon("plus")}</button></div>
      <p class="small muted" style="text-align:center;margin-top:6px">${A.people === 1 ? "Só eu" : `Eu e mais ${A.people - 1}`}</p>`;
    else if (s.type === "budget") { if (!(+A.budget > 0)) A.budget = String(Math.max(20, Math.ceil(pv.cost / 10) * 10));
      const B2 = +A.budget, f = Math.min(1, pv.cost / B2);
      body = `<div class="bigstep"><button class="iconbtn" data-bd="-5" aria-label="Menos 5 euros">${icon("minus")}</button><b class="num">${B2} €</b><button class="iconbtn" data-bd="5" aria-label="Mais 5 euros">${icon("plus")}</button></div>
        <p class="small muted" style="text-align:center;margin-top:4px">por semana · ${A.people} pessoa${A.people > 1 ? "s" : ""}</p>
        <div class="budbar"><i style="width:${(f * 100).toFixed(0)}%" class="${pv.cost > B2 ? "over" : ""}"></i></div>
        <div class="row between tiny muted" style="margin-top:6px"><span>Comida, estimada em ${eur(pv.cost)}</span><span>Orçamento ${B2} €</span></div>
        <p class="small muted" style="margin-top:10px">${pv.cost > B2 ? "Acima do orçamento: na próxima pergunta escolhes o que fazer." : "Cabe no orçamento, a contar com o que tens na cozinha."}</p>`; }
    else if (s.type === "taste") { if (!A._tl) A._tl = withU(A, () => { const R = RECIPES.filter(recipeAllowed), pick = (f, n2) => R.filter(f).sort(() => rnd() - .5).slice(0, n2); return pick(r => isMain(r.c), 6).concat(pick(r => r.c === "Pequeno-almoço", 2)).map(r => r.id); });
      const ST = { 1:["like","check","Gosto"], 2:["love","heart-f","Adoro"], "-1":["no","x","Não é para mim"] };
      body = `<div class="tgrid">${A._tl.map(id => { const r = RECIPES.find(x => x.id === id); if (!r) return ""; const v = ST[(A.taste || {})[id]];
        return `<button class="tg ${v ? v[0] : ""}" data-tg="${id}" aria-label="${esc(r.n)}${v ? ": " + v[2] : ""}">${photoOf(r) ? `<img src="${esc(photoOf(r))}" alt="">` : (() => { const kd = artKind(r), [c1, c2] = ART_BG[kd]; return `<span class="tg-art" style="--a1:${c1};--a2:${c2}">${artSVG(kd, 64)}</span>`; })()}
          <span class="tg-n">${esc(r.n)}</span><span class="tg-s">${v ? icon(v[1], "xs") + " " + v[2] : "Toca para avaliar"}</span></button>`; }).join("")}</div>
        <p class="tiny muted" style="margin-top:10px">Um toque: gosto · dois: adoro · três: não é para mim. O que adoras aparece mais vezes; o que não é para ti, quase nunca.</p>`; }

    else if (s.type === "result") { const r = pv.r, pl = A.gym === "sim" ? planFor() : null, k0 = today(), E0 = pv.E.filter(x => x.date === k0).sort((a, b) => mealOrder(a.m) - mealOrder(b.m));
      head = `<div class="mascots">${abi({ mood:"party", size:104 })}</div>`; q = `O plano está pronto${nm(A)}.`;
      const dishes = new Set(pv.E.filter(x => isMain(x.m)).map(x => x.r)).size;
      sub = `${pv.P.people} pessoa${pv.P.people > 1 ? "s" : ""} · ${dishes} pratos · ${pv.E.length} refeições esta semana, à medida da tua casa. Não tens de responder a mais nada.`;
      body = (r ? `<p class="small muted">A tua referência diária${pv.P.tdays.length ? " (nos dias de treino um pouco mais)" : ""}:</p>${refCard(r)}${r.note ? `<div class="note warn" style="margin-top:12px">${icon("info","sm")}<span>${esc(r.note)}</span></div>` : ""}`
               : `<div class="note">${icon("info","sm")}<span>Sem contar calorias: o plano equilibra as refeições e as porções por ti.</span></div>`)
        + `<div class="card" style="margin-top:14px"><div class="row between"><b>Hoje no teu plano</b><span class="small muted">≈ ${eur(pv.cost)} por semana</span></div>
           ${E0.length ? E0.map(x => `<div class="pitem"><span class="mt">${esc(x.m)}</span><span class="nm">${esc(x.n)}${x.lo ? `<span class="ptag">Sobras</span>` : x.bt ? `<span class="ptag">Em quantidade</span>` : ""}</span></div>`).join("") : `<p class="small muted" style="margin-top:6px">Sem receitas compatíveis com estas escolhas. Experimenta tirar uma restrição.</p>`}</div>`
        + (pl ? `<div class="card" style="margin-top:12px"><div class="row"><span class="badge">${icon("dumbbell")}</span><div class="grow"><b>${esc(pl.n)}</b><p class="small muted">${pl.days.map(d => DOW[d]).join(" · ")} · ${pl.s.map(x => x.n).join(", ")}</p></div></div></div>` : "")
        + `<p class="tiny muted" style="margin-top:12px">Estimativas gerais: os valores das receitas e os preços são aproximados. Não substitui um nutricionista e não serve para gravidez ou condições de saúde.</p>`; }
    else body = (s.search ? `<div class="row" style="position:relative;margin-bottom:10px"><svg class="ic sm" style="position:absolute;left:14px;color:var(--muted)"><use href="#i-search"/></svg><input id="ob-srch" type="search" maxlength="30" placeholder="Procura alimentos" style="padding-left:42px" aria-label="Procura alimentos"></div>` : "")
      + `<div class="opts${s.search ? " grid2" : ""}">${optsOf(s).map(o => optBtn(s, o)).join("")}</div>` + (s.other ? `<input id="ob-o" maxlength="80" placeholder="Outros, separados por vírgulas" value="${esc(A.dislikesOther || "")}" style="margin-top:10px" aria-label="Outros alimentos">` : "");
    const secI = s.sec, inSec = V.filter(x => x.sec === secI), posIn = inSec.indexOf(s) + 1;
    const bars = OB_SECS.map((_, i) => { const L = V.filter(x => x.sec === i), done = i < secI ? L.length : i === secI ? posIn : 0; return `<i><b style="width:${L.length ? done / L.length * 100 : 0}%"></b></i>`; }).join("");
    inn.innerHTML = `<div class="row">${n ? `<button class="iconbtn" id="ob-b" aria-label="Voltar">${icon("left")}</button>` : `<span style="width:40px"></span>`}
        <div class="grow">${single ? "" : `<div class="obsecs" role="progressbar" aria-valuemin="1" aria-valuemax="${V.length}" aria-valuenow="${n + 1}" aria-label="Progresso">${bars}</div><p class="tiny muted ob-where">${OB_SECS[secI]} · ${posIn} de ${inSec.length}</p>`}</div>
        ${edit ? `<button class="iconbtn" id="ob-x" aria-label="Fechar">${icon("x")}</button>` : s.type !== "result" && n > 0 ? `<button class="skip" id="ob-later" style="width:auto;padding:8px 0 8px 8px">Terminar depois</button>` : `<span style="width:40px"></span>`}</div>
      ${s.type !== "result" && n > 0 ? weekStrip(pv) + chosen() : ""}
      <div class="ob-q ${s.who ? "" : "plain"}">${head}<div class="speech ${s.who ? "bub-" + s.who : ""}"><b>${esc(q)}</b><span>${esc(sub)}</span></div></div>
      ${body}${s.after ? s.after(A, pv) : ""}<div style="flex:1;min-height:20px"></div>
      <button class="btn block" id="ob-n2" ${valid(s) ? "" : "disabled"} style="height:54px">${s.type === "result" ? "Ver o meu plano" : s.type === "hook" ? "Começar o meu plano" : single ? "Guardar" : "Continuar"}</button>
      ${s.type !== "result" && s.type !== "text" && s.type !== "hook" ? `<button class="skip" id="ob-skip">${single ? "Cancelar" : "Saltar esta pergunta"}</button>` : ""}`;
    const nextBtn = $("#ob-n2", inn), recheck = () => { nextBtn.disabled = !valid(s); };
    $$(".opts .opt", inn).forEach(b => b.onclick = () => { readIn(s); tog(s, b.dataset.o); A._note = b.textContent.trim().slice(0, 40); mood = s.who === "abi" ? (b.dataset.o === "nao" ? "think" : "party") : "happy"; draw(); });
    $$("#ob-sex button", inn).forEach(x => x.onclick = () => { readIn(s); B.sex = x.dataset.v; draw(); });
    $$("#ob-h,#ob-w", inn).forEach(x => x.oninput = () => { readIn(s); A._noBody = false; recheck(); });
    const ag = $("#ob-age", inn); if (ag) { const msg = () => { $("#ob-agen", inn).textContent = A.ageN && A.ageN < 18 && A.ageN >= 10 ? "Combinado: sem calorias nem metas de peso. Vamos focar-nos em refeições regulares e variadas." : ""; };
      ag.oninput = () => { readIn(s); msg(); recheck(); }; msg(); ag.focus(); ag.onkeydown = e => { if (e.key === "Enter" && !nextBtn.disabled) nextBtn.click(); }; }
    $$("#ob-pace button", inn).forEach(x => x.onclick = () => { A.tw = $("#ob-tw", inn).value; A.pace = x.dataset.v; mood = "happy"; draw(); });
    $$("#ob-days button", inn).forEach(x => x.onclick = () => { const key = s.type === "tdays" ? "tdays" : "gdaysSel", i = +x.dataset.i, a = A[key] || []; A[key] = a.includes(i) ? a.filter(y => y !== i) : a.concat(i).sort((p, q2) => p - q2); draw(); });
    $$("[data-pp]", inn).forEach(x => x.onclick = () => { A.people = clamp(A.people + +x.dataset.pp, 1, 8); A._note = A.people + (A.people > 1 ? " pessoas" : " pessoa"); draw(); });
    $$("[data-bd]", inn).forEach(x => x.onclick = () => { A.budget = String(clamp(+A.budget + +x.dataset.bd, 10, 1000)); A._note = "Orçamento " + A.budget + " €"; draw(); });
    $$("[data-tg]", inn).forEach(x => x.onclick = () => { const id = +x.dataset.tg, t = Object.assign({}, A.taste), nx = { undefined:1, 1:2, 2:-1, "-1":undefined }[t[id]];
      if (nx === undefined) delete t[id]; else t[id] = nx; A.taste = t; A._note = nx === undefined ? "Sem avaliação" : { 1:"Gosto", 2:"Adoro", "-1":"Não é para mim" }[nx] + " · " + (RECIPES.find(r => r.id === id) || {}).n; draw(); });
    const we = $("#ob-we", inn); if (we) we.onclick = () => { A.weMore = A.weMore === false; A._note = A.weMore ? "Mais tempo ao fim de semana" : "Igual ao fim de semana"; draw(); };
    const sr = $("#ob-srch", inn); if (sr) { sr.value = A._q || ""; const flt = () => { A._q = sr.value; const q = norm(sr.value); $$(".opts .opt", inn).forEach(o => o.classList.toggle("hide", !!q && !norm(o.textContent).includes(q))); }; sr.oninput = flt; flt(); }
    const nt = $("#ob-notr", inn); if (nt) nt.onclick = () => { A.tdays = []; draw(); };
    const twi = $("#ob-tw", inn); if (twi) { twi.oninput = () => { A.tw = twi.value; twMsg(); recheck(); }; twMsg(); }
    const bud = $("#ob-bud", inn); if (bud) bud.oninput = () => { A.budget = bud.value; recheck(); };
    const oo = $("#ob-o", inn); if (oo) oo.oninput = () => { A.dislikesOther = oo.value.slice(0, 80); recheck(); };
    const sk = $("#ob-skip", inn); if (sk) sk.onclick = () => { if (single) { ob.classList.add("hide"); return; }
      if (s.type === "body") A._noBody = true; if (s.type === "budget") A.budget = ""; if (s.type === "target") A.tw = "";
      mood = null; if (n < vis().length - 1) { n++; draw(); } else finish(); };
    const bb = $("#ob-b", inn); if (bb) bb.onclick = () => { readIn(s); mood = null; n--; draw(); };
    const bx = $("#ob-x", inn); if (bx) bx.onclick = () => ob.classList.add("hide");
    const lt = $("#ob-later", inn); if (lt) lt.onclick = () => { readIn(s); finish(true); };
    const ni = $("#ob-n", inn); if (ni) { if (!edit) ni.focus(); ni.onkeydown = e => { if (e.key === "Enter") nextBtn.click(); }; }
    nextBtn.onclick = () => { readIn(s); if (s.type === "body") A._noBody = false; if (s.type === "budget" && !valid(s)) A.budget = ""; mood = null;
      if (single || n >= vis().length - 1) { finish(); return; } n++; draw(); };
  };
  draw();
}

// Perfil e Planos: todas as respostas que mudam o plano, cada uma editável sozinha.
function openPlanPrefs(){
  const u = S.u || {}, P = planPrefs(), p = S.prof, lab = (L, v) => (L.find(x => x[0] === String(v)) || [,"–"])[1];
  const rows = [
    ["Sobre ti", [["goal","Objetivo", goalName(u.goal)], ["agep","Idade", u.age === "18 ou mais" ? `${p.age} anos` : u.age || "–"],
      ...(u.age === "18 ou mais" ? [["body","Altura e peso", validBody(p) ? `${p.h} cm · ${p.w} kg` : "Não indicados"]] : []), ["act","Atividade", lab(ACTS, p.act)]]],
    ["Casa e gosto", [["people","Pessoas", P.people === 1 ? "Só eu" : P.people + " pessoas"], ["novelty","Receitas novas", lab(NOVELTY, P.novelty)], ["taste","O que ensinaste ao " + BRAND.mascot, Object.keys(P.taste).length + " receitas avaliadas"]]],
    ["Refeições", [["pmeals","Refeições a planear", P.meals.join(", ")], ["portion","Apetite", lab(PORTIONS, P.portion)], ["diet","Alimentação", (u.diet || []).join(", ") || "Como de tudo"],
      ["al","Alergias e intolerâncias", (u.al || []).join(", ") || "Nenhuma"], ["dislikes","Não gosto", (u.dislikes || []).join(", ") || "–"]]],
    ["Cozinha", [["cstyle","Forma de cozinhar", lab(COOK_STYLES, P.style)], ["ctime","Tempo nos dias úteis", lab(CTIMES, P.time)], ["cuis","Cozinhas", P.cuis.map(c => lab(CUISINES, c)).join(", ") || "Gosto de tudo"],
      ["home","Em casa", P.home.join(", ") || "–"]]],
    ["Treino", [["tdays","Dias de treino", P.tdays.length ? P.tdays.map(d => DOWL[d]).join(", ") : "Não treino"]]],
    ["Extras", [["budget","Orçamento semanal", P.budget ? P.budget + " €" : "Sem orçamento"], ...(P.budget ? [["strict","Se não couber", lab(STRICT, P.strict)]] : []), ["market","Supermercado", u.market || "–"]]]];
  openSheet("Preferências do plano", `<p class="small muted">Cada resposta muda o plano. Ao guardar, as sugestões desta semana são refeitas a partir de hoje; o que planeaste à mão fica.</p>
    ${rows.map(([t, L]) => `<p class="shop-cat">${t}</p><div class="list">${L.map(([k, a, v]) => `<button class="li" data-ek="${k}"><span class="lt"><small>${a}</small><b>${esc(v || "–")}</b></span>${icon("right","sm")}</button>`).join("")}</div>`).join("")}
    <button class="btn ghost block" id="pp-all" style="margin-top:16px">Responder a tudo outra vez</button>
    ${isMinor() ? `<p class="tiny muted" style="margin-top:10px">Para menores de 18 anos a app não mostra calorias nem metas de peso.</p>` : ""}`, b => {
    $$("[data-ek]", b).forEach(x => x.onclick = () => { closeSheet(); openOnboarding(true, x.dataset.ek, true); });
    $("#pp-all", b).onclick = () => { closeSheet(); openOnboarding(true); };
  });
}

/* ========================== Tutorial rápido ========================== */
const TOUR = [
  ["#h-sum", "Este é o teu dia: o que já comeste, o que falta e os macros."],
  ["#h-tip", "Eu vou estar aqui a dizer-te o próximo passo. Toca no botão e eu trato do resto."],
  ["#h-meals", "Toca no + de cada refeição para registar. Podes pesquisar, tirar foto ou repetir."],
  ["#h-water", "Cada bloco é um copo de 250 ml. Toca para registar."],
  ["#h-ch", "Três desafios por dia. Cada um dá um giro na roda de prémios."],
  ['.nav [data-tab="planos"]', "Em Planos tens as refeições da semana, o treino e as compras, tudo feito para ti."],
  ["#nav-add", "E este botão regista qualquer coisa, a qualquer hora."]
];
function startTour(i = 0){
  if (curTab !== "hoje") go("hoje");
  if (i >= TOUR.length) { endTour(); return; }
  const [sel, text] = TOUR[i], t = $(sel); if (!t) { startTour(i + 1); return; }
  let o = $("#tour"); if (!o) { o = document.createElement("div"); o.id = "tour"; o.className = "tour"; document.body.appendChild(o); }
  t.scrollIntoView({ block:"center", behavior:"auto" }); // instantâneo: a posição do destaque tem de ser medida já no sítio certo
  setTimeout(() => {
    const r = t.getBoundingClientRect(), below = r.bottom < innerHeight * .55;
    o.innerHTML = `<div class="tour-spot" style="top:${r.top - 6}px;left:${r.left - 6}px;width:${r.width + 12}px;height:${r.height + 12}px"></div>
      <div class="tour-card" style="${below ? `top:${Math.min(innerHeight - 220, r.bottom + 14)}px` : `bottom:${Math.min(innerHeight - 220, innerHeight - r.top + 14)}px`}" role="dialog" aria-label="Como funciona">
        <div class="row" style="align-items:flex-end;gap:8px">${face(i % 3 === 2 ? "abi" : "abi", { mood: i === TOUR.length - 1 ? "party" : "wave", size: i % 3 === 2 ? 70 : 58 })}${bubbleHTML(i % 3 === 2 ? "abi" : "abi", { cls:"grow" })}</div>
        <div class="row between" style="margin-top:12px"><button class="skip" id="tour-skip" style="width:auto;padding:8px 0">Saltar</button><span class="tiny muted">${i + 1} de ${TOUR.length}</span><button class="btn sm" id="tour-next">${i === TOUR.length - 1 ? "Começar" : "Seguinte"}</button></div></div>`;
    speak(o, text, { fast:true });
    $("#tour-next", o).onclick = () => startTour(i + 1); $("#tour-skip", o).onclick = endTour;
  }, lowMotion() ? 30 : 380);
}
function endTour(){ const o = $("#tour"); if (o) o.remove(); S.tourDone = 1; save(); }

