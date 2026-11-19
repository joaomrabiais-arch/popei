/* ========================== Treino ========================== */
const PROGRAMS = [
  { id:"zero", n:"Começar do zero", d:"Corpo inteiro, 3 dias por semana, 30 minutos. Ideal para quem está a começar.", lvl:1, days:[0,2,4], min:30,
    s:[{ n:"Corpo inteiro", e:[["Aquecimento: marcha no lugar","5 min"],["Agachamento com o peso do corpo","3 × 10"],["Flexões inclinadas (mãos num banco)","3 × 8"],["Remada com elástico ou garrafões","3 × 10"],["Ponte de glúteos","3 × 12"],["Prancha","3 × 20 s"],["Caminhada rápida","10 min"]] }] },
  { id:"casa", n:"Em casa, sem material", d:"Circuitos curtos de 25 minutos. Não precisas de nada.", lvl:2, days:[0,2,4], min:25,
    s:[{ n:"Circuito A", e:[["Aquecimento articular","5 min"],["Agachamento","4 × 12"],["Flexões (de joelhos, se precisares)","4 × 8"],["Lunges alternados","4 × 10"],["Mountain climbers","4 × 20 s"],["Alongamentos","5 min"]] },
       { n:"Circuito B", e:[["Aquecimento articular","5 min"],["Ponte de glúteos a uma perna","3 × 10 por perna"],["Dips numa cadeira","3 × 10"],["Superman","3 × 12"],["Prancha lateral","3 × 20 s por lado"],["Polichinelos","3 × 30 s"]] }] },
  { id:"forca", n:"Força no ginásio", d:"4 dias, divisão superior/inferior. Para quem já treina.", lvl:3, days:[0,1,3,4], min:55,
    s:[{ n:"Superior A", e:[["Supino com barra","4 × 8"],["Remada curvada","4 × 8"],["Press de ombros com halteres","3 × 10"],["Puxada à frente","3 × 10"],["Curl de bíceps","3 × 12"],["Extensão de tríceps","3 × 12"]] },
       { n:"Inferior A", e:[["Agachamento com barra","4 × 8"],["Peso morto romeno","3 × 10"],["Lunges com halteres","3 × 10 por perna"],["Elevação de gémeos","3 × 15"],["Prancha","3 × 30 s"]] },
       { n:"Superior B", e:[["Supino inclinado com halteres","4 × 10"],["Remada sentada","4 × 10"],["Elevações laterais","3 × 12"],["Flexões","3 × máximo"],["Face pull","3 × 15"]] },
       { n:"Inferior B", e:[["Leg press","4 × 10"],["Hip thrust","4 × 10"],["Curl femoral","3 × 12"],["Step-up num banco","3 × 10 por perna"],["Dead bug","3 × 10"]] }] },
  { id:"cardio", n:"Cardio e mobilidade", d:"3 dias de cardio leve a moderado e mobilidade. Bom para a energia do dia a dia.", lvl:1, days:[1,3,5], min:35,
    s:[{ n:"Cardio contínuo", e:[["Caminhada rápida ou corrida leve","25 min"],["Mobilidade de anca e ombros","10 min"]] },
       { n:"Intervalos leves", e:[["Aquecimento","5 min"],["1 min rápido + 2 min calmo","6 vezes"],["Retorno à calma","5 min"],["Alongamentos","5 min"]] }] }
];
/* ===== Plano de treino personalizado =====
   Depende de: local (ginásio, casa com material, casa sem material, rua), dias, minutos, experiência,
   objetivo, limitações (joelhos, costas, ombros), IMC e idade. Gera sessões a partir de padrões de movimento. */
const EXL = {
  squat:{ gym:["Agachamento com barra","Leg press"], equip:["Agachamento goblet com haltere","Agachamento com elástico"], casa:["Agachamento com o peso do corpo","Agachamento com pausa"], rua:["Agachamento com o peso do corpo","Agachamento com salto pequeno"], knee:["Sentar e levantar de um banco","Ponte de glúteos"] },
  hinge:{ gym:["Peso morto romeno","Hip thrust com barra"], equip:["Peso morto romeno com halteres","Ponte de glúteos com haltere"], casa:["Ponte de glúteos","Ponte de glúteos a uma perna"], rua:["Ponte de glúteos num banco","Hip thrust num banco"], back:["Hip thrust apoiado","Bird dog"] },
  push:{ gym:["Supino com halteres","Supino com barra"], equip:["Flexões","Press de peito com elástico"], casa:["Flexões (inclinadas, se precisares)","Flexões de joelhos"], rua:["Flexões num banco","Flexões"], shoulder:["Flexões inclinadas numa mesa","Press de peito leve com elástico"] },
  pull:{ gym:["Puxada à frente","Remada sentada"], equip:["Remada com haltere","Remada com elástico"], casa:["Remada com toalha numa porta","Superman"], rua:["Remada australiana numa barra baixa","Superman"] },
  press:{ gym:["Press de ombros com halteres","Elevações laterais"], equip:["Press de ombros com halteres","Elevações laterais com elástico"], casa:["Flexões pike","Elevações em Y deitado"], rua:["Flexões pike num banco","Elevações em Y"], shoulder:["Elevações laterais leves","Face pull com elástico"] },
  lunge:{ gym:["Lunges com halteres","Step-up num banco"], equip:["Lunges com halteres","Step-up num degrau"], casa:["Lunges alternados","Lunges para trás"], rua:["Step-up num banco","Lunges a andar"], knee:["Elevação de gémeos","Abdução de anca deitado"] },
  core:{ all:["Prancha","Dead bug","Prancha lateral"] },
  cardio:{ gym:["Bicicleta ou passadeira inclinada"], equip:["Marcha rápida no lugar"], casa:["Marcha rápida ou polichinelos"], rua:["Caminhada rápida ou corrida leve"], low:["Caminhada rápida","Bicicleta estática"] }
};
const SPLITS = {
  A:["squat","push","pull","hinge","core","lunge","press"],
  B:["hinge","press","pull","lunge","push","core","squat"],
  C:["lunge","pull","push","squat","core","hinge","press"],
  U:["push","pull","press","pull","push","core","press"],
  L:["squat","hinge","lunge","core","squat","hinge","lunge"]
};
const PLACE_L = { gym:"no ginásio", equip:"em casa com material", casa:"em casa, sem material", rua:"ao ar livre" };
const LVL_L = { zero:"Iniciação", algum:"Intermédio", regular:"Avançado" };
// Dicas de execução por exercício: [músculos, [dicas]]. Usadas no detalhe de cada exercício.
const EXINFO = {
  "Agachamento com barra":["Pernas e glúteos",["Pés à largura dos ombros, barra apoiada nos trapézios.","Desce como se te sentasses, joelhos na direção dos pés.","Mantém o peito alto e sobe a empurrar o chão."]],
  "Leg press":["Pernas e glúteos",["Costas bem apoiadas no encosto.","Desce até os joelhos fazerem cerca de 90°.","Não trancas os joelhos no topo."]],
  "Agachamento goblet com haltere":["Pernas e glúteos",["Segura o haltere junto ao peito.","Desce com os cotovelos por dentro dos joelhos.","Sobe devagar, sem arredondar as costas."]],
  "Agachamento com o peso do corpo":["Pernas e glúteos",["Braços à frente para equilibrar.","Desce até onde consegues sem levantar os calcanhares.","Sobe a contrair os glúteos."]],
  "Agachamento com pausa":["Pernas e glúteos",["Desce e fica 2 segundos em baixo.","Mantém o tronco firme.","Sobe com controlo."]],
  "Sentar e levantar de um banco":["Pernas e glúteos",["Senta-te de leve no banco e levanta-te sem impulso.","Joelhos alinhados com os pés.","Mais fácil para os joelhos do que o agachamento livre."]],
  "Ponte de glúteos":["Glúteos e posteriores",["Deitado, pés no chão perto dos glúteos.","Sobe a anca até alinhar com os joelhos.","Aperta os glúteos 1 segundo em cima."]],
  "Ponte de glúteos a uma perna":["Glúteos e posteriores",["Uma perna estendida no ar.","Sobe a anca sem rodar a bacia.","Faz as mesmas repetições dos dois lados."]],
  "Peso morto romeno":["Posteriores e glúteos",["Joelhos ligeiramente fletidos.","Leva a anca atrás com as costas direitas.","Desce até sentires a parte de trás das coxas e volta."]],
  "Peso morto romeno com halteres":["Posteriores e glúteos",["Halteres junto às coxas.","Leva a anca atrás, costas direitas.","Sobe a empurrar a anca para a frente."]],
  "Hip thrust apoiado":["Glúteos",["Costas apoiadas num banco ou sofá.","Sobe a anca até o tronco ficar paralelo ao chão.","Queixo encolhido, olhar em frente."]],
  "Bird dog":["Core e costas",["A quatro apoios, estende braço e perna opostos.","Mantém as costas paradas, como uma mesa.","Volta devagar e troca de lado."]],
  "Supino com halteres":["Peito, ombros e tríceps",["Omoplatas juntas e apoiadas no banco.","Desce os halteres até ao nível do peito.","Empurra para cima sem bater os halteres."]],
  "Supino com barra":["Peito, ombros e tríceps",["Pega um pouco mais larga do que os ombros.","Desce a barra até ao meio do peito.","Pés firmes no chão."]],
  "Flexões":["Peito, ombros e tríceps",["Corpo em linha, da cabeça aos pés.","Cotovelos a 45° do tronco.","Desce até o peito quase tocar no chão."]],
  "Flexões (inclinadas, se precisares)":["Peito, ombros e tríceps",["Mãos num banco ou mesa para facilitar.","Corpo em linha.","Quanto mais baixo o apoio, mais difícil."]],
  "Flexões de joelhos":["Peito, ombros e tríceps",["Joelhos no chão, anca em linha com o tronco.","Desce o peito entre as mãos.","Empurra o chão para subir."]],
  "Flexões num banco":["Peito, ombros e tríceps",["Mãos no banco, corpo em linha.","Desce o peito até ao banco.","Ótimo no parque."]],
  "Flexões inclinadas numa mesa":["Peito, com pouca carga nos ombros",["Mãos numa mesa estável.","Amplitude curta e sem dor.","Para se sentires o ombro."]],
  "Press de peito com elástico":["Peito e tríceps",["Elástico preso atrás de ti à altura do peito.","Empurra para a frente até esticar os braços.","Volta devagar."]],
  "Press de peito leve com elástico":["Peito, com pouca carga nos ombros",["Elástico leve.","Amplitude sem dor.","Movimento lento."]],
  "Puxada à frente":["Costas e bíceps",["Pega um pouco mais larga que os ombros.","Puxa a barra até ao queixo a levar os cotovelos para baixo.","Não balances o tronco."]],
  "Remada sentada":["Costas e bíceps",["Costas direitas, peito alto.","Puxa a pega até à barriga.","Junta as omoplatas no fim."]],
  "Remada com haltere":["Costas e bíceps",["Apoia uma mão e um joelho num banco.","Puxa o haltere até à anca.","Desce com controlo."]],
  "Remada com elástico":["Costas e bíceps",["Elástico preso à frente à altura do peito.","Puxa até às costelas.","Junta as omoplatas."]],
  "Remada com toalha numa porta":["Costas e bíceps",["Passa uma toalha pela maçaneta de uma porta fechada e trancada.","Inclina-te para trás e puxa o corpo.","Quanto mais inclinado, mais difícil."]],
  "Superman":["Costas e glúteos",["Deitado de barriga para baixo.","Levanta braços e pernas uns centímetros.","Segura 2 segundos e desce."]],
  "Remada australiana numa barra baixa":["Costas e bíceps",["Por baixo de uma barra baixa, corpo em linha.","Puxa o peito até à barra.","Pés mais à frente = mais difícil."]],
  "Elevações na barra (ou negativas)":["Costas e bíceps",["Se ainda não fazes uma, salta para cima e desce em 4 segundos.","Puxa os cotovelos para as costelas.","Sem balanço."]],
  "Press de ombros com halteres":["Ombros e tríceps",["Sentado ou de pé, halteres à altura das orelhas.","Empurra para cima sem arquear as costas.","Desce até à altura do queixo."]],
  "Elevações laterais":["Ombros",["Braços quase esticados.","Sobe até à altura dos ombros.","Peso leve, movimento lento."]],
  "Elevações laterais com elástico":["Ombros",["Pisa o elástico.","Sobe os braços para os lados até aos ombros.","Desce devagar."]],
  "Elevações laterais leves":["Ombros, sem carga pesada",["Peso muito leve ou sem peso.","Sobe só até onde não há dor.","Lento e controlado."]],
  "Face pull com elástico":["Ombros e parte alta das costas",["Elástico à altura da cara.","Puxa em direção à testa, cotovelos altos.","Bom para a postura."]],
  "Flexões pike":["Ombros e tríceps",["Anca alta, corpo em V invertido.","Desce a cabeça entre as mãos.","Empurra para cima."]],
  "Elevações em Y deitado":["Ombros e costas",["Deitado de barriga para baixo, braços em Y.","Levanta os braços com os polegares para cima.","Segura 1 segundo."]],
  "Lunges com halteres":["Pernas e glúteos",["Passo largo à frente.","Desce até o joelho de trás quase tocar no chão.","Empurra com o pé da frente para voltar."]],
  "Lunges alternados":["Pernas e glúteos",["Passo à frente, tronco direito.","Joelho da frente por cima do pé.","Alterna as pernas."]],
  "Lunges para trás":["Pernas e glúteos",["Dá o passo para trás: é mais fácil para os joelhos.","Desce com controlo.","Volta ao centro."]],
  "Step-up num banco":["Pernas e glúteos",["Sobe com o pé inteiro no banco.","Empurra com a perna de cima, sem impulso da de baixo.","Desce devagar."]],
  "Lunges a andar":["Pernas e glúteos",["Lunges seguidos a avançar.","Passos largos e tronco direito.","Bom ao ar livre."]],
  "Elevação de gémeos":["Gémeos",["Em pé, sobe na ponta dos pés.","Segura 1 segundo em cima.","Desce devagar."]],
  "Abdução de anca deitado":["Glúteo médio",["Deitado de lado, pernas esticadas.","Sobe a perna de cima sem rodar a anca.","Lento."]],
  "Prancha":["Core",["Antebraços no chão, corpo em linha.","Aperta abdominais e glúteos.","Respira normalmente."]],
  "Dead bug":["Core",["Deitado de costas, braços e joelhos no ar.","Estende braço e perna opostos sem arquear a lombar.","Alterna devagar."]],
  "Prancha lateral":["Core e oblíquos",["Apoia o antebraço e o lado do pé.","Anca alta, corpo em linha.","Faz os dois lados."]]
};
const PAT_OF = name => Object.keys(EXL).find(k => Object.values(EXL[k]).some(arr => arr.includes(name)));
const CARDIO_N = { caminhar:"Caminhada rápida", correr:"Corrida leve", bicicleta:"Bicicleta", nadar:"Natação", nenhum:"Mobilidade suave" };
function generatePlan({ place="casa", dayIdx, days, min=30, lvl="zero", goal="manter", lim=[], bmi=22, age=30, equip=[], focus="todo", cardio="caminhar" }){
  dayIdx = (Array.isArray(dayIdx) && dayIdx.length >= 2 ? dayIdx : ({ 2:[1,4], 3:[0,2,4], 4:[0,1,3,4], 5:[0,1,2,4,5], 6:[0,1,2,3,4,5] })[clamp(+days || 3, 2, 6)]).map(Number).sort((a,b) => a-b);
  const nd = dayIdx.length; min = +min || 30;
  const knee = lim.includes("Joelhos"), back = lim.includes("Costas"), shoulder = lim.includes("Ombros");
  const low = knee || bmi >= 30 || age >= 60;
  const kit = place === "casa" && equip.some(e => ["Halteres","Elásticos","Kettlebell"].includes(e)) ? "equip" : place;
  const hasBar = equip.includes("Barra de elevações");
  const n = { 20:4, 30:5, 45:6, 60:7 }[min] || 5;
  const sets = { zero:2, algum:3, regular:4 }[lvl] || 2;
  const reps = goal === "musculo" && lvl !== "zero" ? "8–10" : "10–12";
  const rest = goal === "musculo" && lvl !== "zero" ? "90 s" : "60 s";
  const hold = { zero:"20 s", algum:"30 s", regular:"45 s" }[lvl] || "20 s";
  const order = nd === 2 ? ["A","B"] : nd === 3 ? ["A","B","C"] : nd === 4 ? ["U","L","U","L"] : nd === 5 ? ["U","L","X","U","L"] : ["U","L","X","U","L","X"];
  const extra = { pernas:["lunge","hinge"], cima:["push","pull"], core:["core"], cardio:[], todo:[] }[focus] || [];
  const cardioName = () => { let c = CARDIO_N[cardio] || "Caminhada rápida"; if (low && c === "Corrida leve") c = "Caminhada rápida"; return c; };
  const pick = (pat, v) => { const L = EXL[pat];
    if (knee && L.knee && (pat === "squat" || pat === "lunge")) return L.knee[v % L.knee.length];
    if (back && L.back && pat === "hinge") return L.back[v % L.back.length];
    if (shoulder && L.shoulder && (pat === "push" || pat === "press")) return L.shoulder[v % L.shoulder.length];
    if (pat === "pull" && hasBar && v % 2 === 0) return "Elevações na barra (ou negativas)";
    const arr = L.all || L[kit] || L.casa; let ex = arr[v % arr.length];
    if (low && /salto/i.test(ex)) ex = arr.find(x => !/salto/i.test(x)) || "Agachamento com o peso do corpo";
    return ex; };
  const sessions = order.map((key, si) => {
    if (key === "X") return { n:"Cardio e mobilidade", e:[["Aquecimento articular","5 min",""],[cardioName(), lvl === "zero" ? "20 min, ritmo em que consegues falar" : "25–30 min, ritmo moderado",""],["Mobilidade de anca, costas e ombros","10 min",""]] };
    const seen = {}, e = [[cardio === "nenhum" ? "Aquecimento: mobilidade articular" : `Aquecimento: ${cardioName().toLowerCase()} leve`, "5 min", ""]];
    const pats = SPLITS[key].slice(0, n).concat(extra.filter(x => (key === "U" ? ["push","pull","press","core"] : key === "L" ? ["squat","hinge","lunge","core"] : Object.keys(EXL)).includes(x)));
    pats.forEach(pat => { seen[pat] = seen[pat] === undefined ? si : seen[pat] + 1;
      const name = pick(pat, seen[pat]); if (e.some(x => x[0] === name)) return;
      e.push([name, pat === "core" ? (/Prancha/.test(name) ? `${sets} × ${hold}` : `${sets} × 10`) : `${sets} × ${reps}${pat === "lunge" || /uma perna/.test(name) ? " por perna" : ""}`, pat === "core" ? "45 s" : rest]); });
    if ((goal === "perder" || focus === "cardio" || min >= 45) && cardio !== "nenhum") e.push([cardioName(), goal === "perder" || focus === "cardio" ? "10–15 min" : "10 min", ""]);
    return { n: { A:"Corpo inteiro A", B:"Corpo inteiro B", C:"Corpo inteiro C", U:"Parte de cima", L:"Pernas e core" }[key], e };
  });
  const notes = [];
  if (knee) notes.push("sem agachamentos profundos nem saltos, para proteger os joelhos");
  if (back) notes.push("sem peso morto, com exercícios que poupam as costas");
  if (shoulder) notes.push("cargas leves nos ombros");
  if (!knee && low) notes.push("sem impacto, para começar com segurança");
  if (focus !== "todo") notes.push("mais volume em " + ({ pernas:"pernas e glúteos", cima:"peito, costas e braços", core:"core", cardio:"resistência" }[focus] || focus));
  return { id:"custom", n:`Plano para ti · ${nd}× ${min} min`, lvl: lvl === "regular" ? 3 : lvl === "algum" ? 2 : 1, min, days:dayIdx, s:sessions,
    d:`${LVL_L[lvl] || "Iniciação"}, ${PLACE_L[place] || ""}, objetivo: ${goalName(goal).toLowerCase()}.` + (notes.length ? ` Adaptado: ${notes.join("; ")}.` : "") };
}
// Ciclo de 4 semanas: base, base, progressão, semana leve.
function weekPhase(k){ if (!S.wk) return null; const w = Math.max(0, Math.floor((parseK(k) - parseK(S.wk.start)) / (7*864e5))) % 4;
  return [{ n:"Semana 1 de 4 · base", t:"Aprende os movimentos com calma. Acaba cada série com 2 ou 3 repetições de reserva." },
          { n:"Semana 2 de 4 · base", t:"Mesmas séries. Se ficou fácil, sobe um pouco o peso." },
          { n:"Semana 3 de 4 · progressão", t:"Faz mais 1 ou 2 repetições por série, ou junta um pouco de peso." },
          { n:"Semana 4 de 4 · semana leve", t:"Faz menos 1 série em cada exercício. O corpo também evolui a descansar." }][w]; }
function exName(k, se, i){ const key = se.sess.n + "|" + i; return (S.wk.swap && S.wk.swap[key]) || se.sess.e[i][0]; }
function openExercise(k, i){
  const se = sessionFor(k); if (!se) return; const e = se.sess.e[i], name = exName(k, se, i), info = EXINFO[name];
  const pat = PAT_OF(se.sess.e[i][0]), alts = pat ? [...new Set(Object.values(EXL[pat]).flat())].filter(x => x !== name).slice(0, 4) : [];
  openSheet(name, `<p class="small muted">${esc(info ? info[0] : "Movimento geral")} · ${esc(e[1])}${e[2] ? " · descanso " + esc(e[2]) : ""}</p>
    ${info ? `<ol class="steps" style="margin-top:12px">${info[1].map(x => `<li>${esc(x)}</li>`).join("")}</ol>` : `<p style="margin-top:12px">Faz o movimento devagar e com controlo, sem dor.</p>`}
    <div class="note" style="margin-top:12px">${icon("info","sm")}<span>Se sentires dor (e não só esforço), para. Escolhe uma alternativa abaixo.</span></div>
    ${alts.length ? `<h3 style="margin-top:18px">Trocar por</h3><div class="list" style="margin-top:8px">${alts.map(a => `<button class="li" data-alt="${esc(a)}"><span class="lt"><b>${esc(a)}</b><small>${esc(EXINFO[a] ? EXINFO[a][0] : "")}</small></span>${icon("right","sm")}</button>`).join("")}</div>` : ""}`, b => {
    $$("[data-alt]", b).forEach(x => x.onclick = () => { S.wk.swap = S.wk.swap || {}; S.wk.swap[se.sess.n + "|" + i] = x.dataset.alt; save(); closeSheet(); renderTreino(); toast("Exercício trocado em todas as semanas"); });
  });
}
const progOf = () => S.wk && (S.wk.prog === "custom" ? S.wk.custom : PROGRAMS.find(p => p.id === S.wk.prog));
const workoutDone = k => !!((S.wk && S.wk.done && S.wk.done[k]) || (S.wkHist && S.wkHist[k]));
function sessionFor(k){ const p = progOf(); if (!p) return null; const days = S.wk.days, d = dow(k); if (!days.includes(d)) return null;
  const w = Math.round((parseK(mondayOf(k)) - parseK(mondayOf(S.wk.start))) / 864e5 / 7); // rotação contínua entre semanas
  const idx = (((w * days.length + days.indexOf(d)) % p.s.length) + p.s.length) % p.s.length; return { prog:p, sess:p.s[idx] }; }

