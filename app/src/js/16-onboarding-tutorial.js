/* ========================== Onboarding ========================== */
// Uma conversa curta com as mascotes. O Abi trata da comida e dos dados; o Morango do movimento e do treino.
// `when` esconde passos que não se aplicam (ex.: perguntas do ginásio só se a pessoa quiser um plano).
const nm = A => A.name ? `, ${A.name}` : "";
const OB = [
  { k:"name", who:"abi", m:"wave", q:() => `Olá! Eu sou o ${BRAND.mascot}. Como te chamo?`, s:"Só o primeiro nome chega. Não pedimos e-mail.", type:"text" },
  { k:"body", who:"abi", m:"happy", q:A => `Prazer${nm(A)}! Conta-me um pouco sobre ti.`, s:"Serve para calcular uma referência e adaptar o treino. Fica só neste aparelho.", type:"body" },
  { k:"act", who:"morango", m:"wink", one:1, q:() => "Quanto te mexes numa semana normal?", s:"Contam treinos, caminhadas e trabalho físico.", o:ACTS },
  { k:"goal", who:"morango", m:"happy", one:1, q:() => "Qual é o teu objetivo agora?", s:"Podes mudar quando quiseres.", o:GOALS },
  { k:"tw", who:"abi", m:"think", type:"target", when:A => (A.goal === "perder" || A.goal === "musculo") && !A._noBody, q:() => "Onde gostavas de chegar?", s:"Escolhe um ritmo realista. Devagar também lá chega, e dura mais." },
  { k:"hard", who:"abi", m:"think", ex:"Nada em especial", q:() => "O que te tem dificultado mais?", s:"Escolhe tudo o que se aplica. Vou ajustar as dicas.", o:["Falta de tempo","Petiscar entre refeições","Fins de semana","Comer fora","Stress ou ansiedade","Pouca motivação","Não sei o que cozinhar","Nada em especial"] },
  { k:"meals", who:"abi", m:"happy", one:1, q:() => "Quantas refeições costumas fazer por dia?", s:"Contam os lanches.", o:[["2","2 ou menos"],["3","3"],["4","4"],["5","5 ou mais"]] },
  { k:"sleep", who:"abi", m:"sleepy", one:1, q:() => "E quantas horas dormes, normalmente?", s:"O sono mexe com a fome e com a energia.", o:[["5","Menos de 6"],["6","6 a 7"],["7","7 a 8"],["8","Mais de 8"]] },
  { k:"dietq", who:"abi", m:"think", one:1, q:() => "Como descreves a tua alimentação hoje?", s:"Sem julgamentos. É só para saber por onde começar.", o:[["boa","Equilibrada, quase sempre"],["media","Razoável, com altos e baixos"],["caos","Desorganizada: salto refeições ou como à pressa"],["nsei","Não sei bem"]] },
  { k:"diet", who:"abi", m:"happy", ex:"Como de tudo", q:() => "Há alguma forma de comer que sigas?", s:"Podes escolher várias.", o:["Como de tudo","Vegetariano","Vegan","Pescetariano","Não como carne de porco"] },
  { k:"al", who:"abi", m:"think", ex:"Nenhuma", q:() => "Tens alergias ou intolerâncias?", s:"Escondo as receitas que as tenham. Confirma sempre os rótulos.", o:["Lactose","Glúten","Frutos secos","Amendoim","Marisco","Ovos","Soja","Peixe","Sésamo","Nenhuma"] },
  { k:"dislikes", who:"abi", m:"wow", ex:"Nada em especial", q:() => "E há coisas de que simplesmente não gostas?", s:"Também as tiro das sugestões.", o:["Cogumelos","Coentros","Cebola","Pimento","Peixe","Leguminosas","Picante","Nada em especial"], other:1 },
  { k:"cook", who:"abi", m:"happy", one:1, q:() => "E na cozinha, como te dás?", s:"Ajuda-me a sugerir receitas à tua medida.", o:["Estou a começar","Desenrasco-me","Adoro cozinhar"] },
  { k:"gym", who:"morango", m:"wow", one:1, q:A => `Queres que te monte um plano de treino${nm(A)}?`, s:"Feito à tua medida. Podes ativar mais tarde no separador Planos.", o:[["sim","Sim, quero treinar"],["nao","Agora não"]] },
  { k:"place", who:"morango", m:"think", one:1, when:A => A.gym === "sim", q:() => "Onde vais treinar?", s:"Escolhe o sítio onde treinas mais vezes.", o:[["gym","No ginásio"],["equip","Em casa, com halteres ou elásticos"],["casa","Em casa, sem material"],["rua","Na rua ou num parque"]] },
  { k:"equip", who:"morango", m:"think", ex:"Nenhum", when:A => A.gym === "sim" && A.place !== "gym", q:() => "Que material tens à mão?", s:"Escolhe tudo o que tens. Uso-o nos exercícios.", o:["Halteres","Elásticos","Kettlebell","Barra de elevações","Banco ou degrau","Tapete","Nenhum"] },
  { k:"gdaysSel", who:"morango", m:"happy", type:"days", when:A => A.gym === "sim", q:() => "Em que dias consegues treinar?", s:"Escolhe 2 a 6 dias. Pelo menos um dia de descanso por semana." },
  { k:"gmin", who:"morango", m:"wink", one:1, when:A => A.gym === "sim", q:() => "E quanto tempo tens por treino?", s:"Conta com o aquecimento.", o:[["20","20 minutos"],["30","30 minutos"],["45","45 minutos"],["60","1 hora"]] },
  { k:"lvl", who:"morango", m:"think", one:1, when:A => A.gym === "sim", q:() => "Que experiência tens a treinar?", s:"Ajusta as séries e a dificuldade.", o:[["zero","Nunca treinei ou parei há muito"],["algum","Já treinei um pouco"],["regular","Treino com regularidade"]] },
  { k:"focus", who:"morango", m:"wink", one:1, when:A => A.gym === "sim", q:() => "Queres dar mais atenção a alguma zona?", s:"O plano continua equilibrado, com mais volume aqui.", o:[["todo","Corpo todo, equilibrado"],["pernas","Pernas e glúteos"],["cima","Peito, costas e braços"],["core","Abdominais e core"],["cardio","Resistência e cardio"]] },
  { k:"cardio", who:"morango", m:"happy", one:1, when:A => A.gym === "sim", q:() => "Que cardio preferes?", s:"Uso-o no aquecimento e no fim dos treinos.", o:[["caminhar","Caminhar"],["correr","Correr"],["bicicleta","Bicicleta"],["nadar","Nadar"],["nenhum","Prefiro não fazer cardio"]] },
  { k:"lim", who:"morango", m:"think", ex:"Nenhuma", when:A => A.gym === "sim", q:() => "Tens alguma zona a poupar?", s:"Troco os exercícios que podem incomodar. Se tens dor, fala primeiro com um profissional.", o:["Joelhos","Costas","Ombros","Nenhuma"] },
  { k:"result", type:"result" }
];
function openOnboarding(edit, startKey){
  const A = Object.assign({ name:"", goal:"", act:String(S.prof.act || ""), dietq:"", diet:[], al:[], dislikes:[], cook:"", gym:"", place:"", gdays:"", gmin:"", lvl:"", lim:[], age:"", tw:"", pace:"0.5", hard:[], meals:"", sleep:"", equip:[], gdaysSel:[], focus:"", cardio:"" }, structuredClone(S.u || {}));
  const B = Object.assign({}, S.prof, { skip: A.age === "Prefiro não dizer" });
  const vis = () => OB.filter(s => !s.when || s.when(A));
  let n = Math.max(0, vis().findIndex(x => x.k === startKey)), mood = null;
  const ob = $("#ob"), inn = $("#ob-in"); ob.classList.remove("hide");
  const minor = () => !B.skip && B.age < 18;
  const opts = s => (s.k === "goal" && (minor() || B.skip) ? s.o.filter(o => o[0] !== "perder") : s.o).map(o => Array.isArray(o) ? o : [o, o]);
  const sel = (s, v) => s.one ? String(A[s.k]) === v : (A[s.k]||[]).includes(v);
  const tog = (s, v) => { if (s.one) { A[s.k] = v; return; } let a = A[s.k] || []; a = a.includes(v) ? a.filter(x => x !== v) : v === s.ex ? [v] : a.filter(x => x !== s.ex).concat(v); A[s.k] = a; };
  const readBody = () => { if (!$("#ob-age", inn)) return; B.age = +$("#ob-age", inn).value; B.h = +$("#ob-h", inn).value; B.w = +$("#ob-w", inn).value; };
  const validTarget = () => { const t = +A.tw, minW = 18.5 * (B.h / 100) ** 2; if (!(t >= 35 && t <= 250) || !A.pace) return false; return A.goal === "perder" ? (t < B.w && t >= minW) : t > B.w; };
  const twMsg = () => { const el = $("#ob-twn", inn); if (!el) return; const t = +A.tw, minW = Math.ceil(18.5 * (B.h / 100) ** 2);
    el.textContent = !t ? "" : A.goal === "perder" && t >= B.w ? "Para perder peso, escolhe um valor abaixo do atual." : A.goal === "perder" && t < minW ? `Esse peso fica abaixo de um IMC saudável. Escolhe ${minW} kg ou mais.` : A.goal === "musculo" && t <= B.w ? "Para ganhar músculo, escolhe um valor acima do atual." : ""; };
  const valid = s => s.type === "text" || s.type === "result" || (s.type === "target" ? validTarget() : s.type === "days" ? (A.gdaysSel || []).length >= 2 && (A.gdaysSel || []).length <= 6 : s.type === "body" ? (B.skip || validBody(B)) : s.one ? !!A[s.k] : (A[s.k]||[]).length > 0 || (s.other && !!(A.dislikesOther||"").trim()));
  const faceOf = s => face(s.who || "abi", { mood: mood || s.m, size: s.who === "morango" ? 104 : 86 });
  const save1 = s => { if (s.type === "text") A.name = $("#ob-n", inn).value.trim().slice(0,40); if (s.type === "body") readBody(); if (s.other) A.dislikesOther = $("#ob-o", inn).value.slice(0,80); if (s.type === "target") A.tw = $("#ob-tw", inn).value; };
  const planFor = prof => generatePlan({ place:A.place || "casa", days:(A.gdaysSel || []).length || 3, dayIdx:A.gdaysSel, equip:(A.equip || []).filter(x => x !== "Nenhum"), focus:A.focus || "todo", cardio:A.cardio || "caminhar", min:A.gmin || 30, lvl:A.lvl || "zero", goal:A.goal || "manter",
    lim:(A.lim||[]).filter(x => x !== "Nenhuma"), bmi: validBody(prof) ? prof.w / ((prof.h/100) ** 2) : 22, age: validBody(prof) ? prof.age : 30 });
  const finish = () => {
    const first = !S.ob;
    if (!B.skip) S.prof = { sex:B.sex, age:B.age, h:B.h, w:B.w, act:A.act || "1.375" }; else S.prof.act = A.act || S.prof.act;
    A.age = B.skip ? "Prefiro não dizer" : B.age >= 18 ? "18 ou mais" : "Menos de 18";
    if (A.goal === "perder" && (minor() || B.skip)) A.goal = "manter";
    const extra = (A.dislikesOther || "").split(",").map(x => x.trim()).filter(Boolean);
    A.dislikes = (A.dislikes || []).filter(x => x !== "Nada em especial").concat(extra).slice(0, 20); delete A.dislikesOther;
    delete A._noBody; A.obj = goalName(A.goal); S.u = A; S.ob = 1; applyRef();
    if (first || !S.plan.some(x => x.date >= mondayOf(today()))) buildWeekPlan(mondayOf(today()), false);
    if (A.gym === "sim") { const pl = planFor(S.prof); S.wkHist = Object.assign(S.wkHist || {}, (S.wk && S.wk.done) || {}); S.wk = { prog:"custom", custom:pl, days:pl.days.slice(), start:today(), done:{}, ex:{} }; }
    if (first) S.spins = 3; save(); ob.classList.add("hide"); refreshAll();
    if (first) setTimeout(() => celebrate({ who:"morango", title:"Presente de boas-vindas", name:"3 giros na roda de prémios", desc:`Gira a roda e ganha acessórios para o ${BRAND.mascot}. No fim das 3 tentativas, o prémio dourado é garantido.`, mood:"party", action:{ label:"Ir à roda", fn:() => go("roda") }, onClose:() => setTimeout(() => { if (!S.tourDone) startTour(); }, 300) }), 300);
    else say(A.gym === "sim" ? "plan" : "hello", true);
  };
  const draw = () => { const V = vis(); n = Math.min(n, V.length-1); const s = V[n];
    let body = "", q = s.q ? s.q(A) : "", sub = s.s || "", head = faceOf(s);
    if (s.type === "text") body = `<input id="ob-n" maxlength="40" autocomplete="given-name" placeholder="O teu nome" value="${esc(A.name)}" aria-label="Nome">`;
    else if (s.type === "body") body = `<div class="ob-form"><div class="seg" id="ob-sex"><button data-v="f" class="${B.sex === "f" ? "on" : ""}">Feminino</button><button data-v="m" class="${B.sex === "m" ? "on" : ""}">Masculino</button></div>
      <div class="g2" style="grid-template-columns:repeat(3,1fr)"><label class="field"><span>Idade</span><input id="ob-age" type="number" inputmode="numeric" min="10" max="100" value="${B.skip ? "" : B.age}"></label><label class="field"><span>Altura (cm)</span><input id="ob-h" type="number" inputmode="numeric" min="120" max="230" value="${B.skip ? "" : B.h}"></label><label class="field"><span>Peso (kg)</span><input id="ob-w" type="number" inputmode="decimal" step="0.1" min="30" max="250" value="${B.skip ? "" : B.w}"></label></div>
      <button class="skip" id="ob-skip">Prefiro não indicar</button></div>`;
    else if (s.type === "result") {
      const prof = { sex:B.sex, age:B.age, h:B.h, w:B.w, act:A.act || "1.375" };
      const noKcal = B.skip || minor() || A.goal === "livre", r = noKcal ? null : computeRef(prof, A.goal || "manter", A.pace);
      const pl = A.gym === "sim" ? planFor(B.skip ? {} : prof) : null;
      head = `<div class="mascots">${abi({ mood:"party", size:86 })}${morango({ mood:"party", size:104 })}</div>`;
      q = `Está tudo pronto${nm(A)}.`;
      sub = { caos:"Vamos começar pelo mais simples: refeições a horas e água. O resto vem depois.", boa:"Já tens uma boa base. Vamos ajudar-te a manter o ritmo.", media:"Vamos tornar os dias bons mais frequentes, sem pressão." }[A.dietq] || "Vamos devagar, um hábito de cada vez.";
      body = (r ? `<p class="small muted" style="margin-top:4px">A tua referência diária:</p>${refCard(r)}` + (A.tw && r.delta && (A.goal === "perder" || A.goal === "musculo") ? `<p class="small" style="margin-top:12px">Ao ritmo escolhido, chegas aos <b>${esc(A.tw)} kg</b> em cerca de <b>${Math.max(1, Math.round(Math.abs(B.w - A.tw) / (Math.abs(r.delta) * 7 / 7700)))} semanas</b>. Sem pressa: o importante é ir mantendo.</p>` : "") + (r.note ? `<div class="note warn" style="margin-top:12px">${icon("info","sm")}<span>${esc(r.note)}</span></div>` : "")
               : `<div class="note" style="margin-top:4px">${icon("info","sm")}<span>Sem contar calorias: o anel do dia mostra as refeições que registas.</span></div>`)
        + (pl ? `<div class="card" style="margin-top:14px"><div class="row"><span class="badge">${icon("dumbbell")}</span><div class="grow"><b>${esc(pl.n)}</b><p class="small muted">${pl.days.map(d => DOW[d]).join(" · ")} · ${pl.s.map(x => x.n).join(", ")}</p></div></div><p class="tiny muted" style="margin-top:10px">${esc(pl.d)}</p></div>` : "")
        + `<p class="tiny muted" style="margin-top:12px">Estimativas gerais. Não substituem um nutricionista nem um treinador e não servem para gravidez ou condições de saúde.</p>`;
    }
    else if (s.type === "target") { const lose = A.goal === "perder", P = lose ? [["0.25","Devagar","cerca de 0,25 kg por semana"],["0.5","Equilibrado","cerca de 0,5 kg por semana"],["0.75","Mais rápido","cerca de 0,75 kg por semana"]] : [["0.25","Devagar","menos gordura ganha"],["0.5","Equilibrado","o ritmo mais comum"]];
      body = `<label class="field"><span>Peso desejado (kg)</span><input id="ob-tw" type="number" inputmode="decimal" step="0.5" min="35" max="250" value="${esc(A.tw || "")}" placeholder="Agora: ${B.w} kg"></label><p class="small" id="ob-twn" style="margin-top:8px;color:var(--accent)"></p>
        <div class="opts" id="ob-pace" style="margin-top:10px">${P.map(([v,l,d]) => `<button class="opt ${String(A.pace) === v ? "on" : ""}" data-v="${v}"><span class="tick">${icon("check","xs")}</span><span><b style="display:block;font-weight:600">${l}</b><small class="muted">${d}</small></span></button>`).join("")}</div>`; }
    else if (s.type === "days") body = `<div class="row" id="ob-days" style="flex-wrap:wrap;gap:8px">${DOWL.map((d, i) => `<button class="chip ${(A.gdaysSel || []).includes(i) ? "on" : ""}" data-i="${i}" aria-pressed="${(A.gdaysSel || []).includes(i)}">${d}</button>`).join("")}</div><p class="small muted" style="margin-top:12px">${(A.gdaysSel || []).length} dia(s) escolhido(s).</p>`;
    else body = `<div class="opts">${opts(s).map(([v,l]) => `<button class="opt ${sel(s,v) ? "on" : ""}" data-o="${esc(v)}" aria-pressed="${sel(s,v)}"><span class="tick">${icon("check","xs")}</span>${esc(l)}</button>`).join("")}</div>`
      + (s.other ? `<input id="ob-o" maxlength="80" placeholder="Outros, separados por vírgulas" value="${esc(A.dislikesOther || "")}" style="margin-top:10px" aria-label="Outros alimentos">` : "");
    inn.innerHTML = `<div class="row">${n ? `<button class="iconbtn" id="ob-b" aria-label="Voltar">${icon("left")}</button>` : `<span style="width:40px"></span>`}<div class="obbar" role="progressbar" aria-valuemin="1" aria-valuemax="${V.length}" aria-valuenow="${n+1}"><i style="width:${(n+1)/V.length*100}%"></i></div>${edit ? `<button class="iconbtn" id="ob-x" aria-label="Fechar">${icon("x")}</button>` : `<span style="width:40px"></span>`}</div>
      <div class="ob-q">${head}<div class="speech bub-${s.who || "abi"}"><b>${esc(q)}</b><span>${esc(sub)}</span></div></div>
      ${body}<div style="flex:1;min-height:24px"></div><button class="btn block" id="ob-n2" ${valid(s) ? "" : "disabled"} style="height:54px">${s.type === "result" ? "Começar" : "Continuar"}</button>`;
    $$(".opt", inn).forEach(b => b.onclick = () => { save1(s); tog(s, b.dataset.o); mood = s.who === "morango" ? (s.k === "gym" && b.dataset.o === "nao" ? "think" : "party") : "happy"; draw(); });
    $$("#ob-sex button", inn).forEach(x => x.onclick = () => { readBody(); B.sex = x.dataset.v; draw(); });
    $$("#ob-age,#ob-h,#ob-w", inn).forEach(x => x.oninput = () => { readBody(); B.skip = false; $("#ob-n2", inn).disabled = !validBody(B); });
    $$("#ob-pace button", inn).forEach(x => x.onclick = () => { A.tw = $("#ob-tw", inn).value; A.pace = x.dataset.v; mood = "happy"; draw(); });
    $$("#ob-days button", inn).forEach(x => x.onclick = () => { const i = +x.dataset.i, a = A.gdaysSel || []; A.gdaysSel = a.includes(i) ? a.filter(y => y !== i) : a.concat(i).sort((p, q) => p - q); mood = "happy"; draw(); });
    const twi = $("#ob-tw", inn); if (twi) { twi.oninput = () => { A.tw = twi.value; twMsg(); $("#ob-n2", inn).disabled = !valid(s); }; twMsg(); }
    const oo = $("#ob-o", inn); if (oo) oo.oninput = () => { A.dislikesOther = oo.value.slice(0,80); $("#ob-n2", inn).disabled = !valid(s); };
    const sk = $("#ob-skip", inn); if (sk) sk.onclick = () => { B.skip = true; A._noBody = true; mood = null; n++; draw(); };
    const bb = $("#ob-b", inn); if (bb) bb.onclick = () => { save1(s); mood = null; n--; draw(); };
    const bx = $("#ob-x", inn); if (bx) bx.onclick = () => ob.classList.add("hide");
    const ni = $("#ob-n", inn); if (ni) { ni.focus(); ni.onkeydown = e => { if (e.key === "Enter") $("#ob-n2", inn).click(); }; }
    $("#ob-n2", inn).onclick = () => { save1(s); if (s.type === "body" && validBody(B)) { B.skip = false; A._noBody = false; } mood = null; if (n < vis().length-1) { n++; draw(); return; } finish(); };
  };
  draw();
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
        <div class="row" style="align-items:flex-end;gap:8px">${face(i % 3 === 2 ? "morango" : "abi", { mood: i === TOUR.length - 1 ? "party" : "wave", size: i % 3 === 2 ? 70 : 58 })}${bubbleHTML(i % 3 === 2 ? "morango" : "abi", { cls:"grow" })}</div>
        <div class="row between" style="margin-top:12px"><button class="skip" id="tour-skip" style="width:auto;padding:8px 0">Saltar</button><span class="tiny muted">${i + 1} de ${TOUR.length}</span><button class="btn sm" id="tour-next">${i === TOUR.length - 1 ? "Começar" : "Seguinte"}</button></div></div>`;
    speak(o, text, { fast:true });
    $("#tour-next", o).onclick = () => startTour(i + 1); $("#tour-skip", o).onclick = endTour;
  }, lowMotion() ? 30 : 380);
}
function endTour(){ const o = $("#tour"); if (o) o.remove(); S.tourDone = 1; save(); }

