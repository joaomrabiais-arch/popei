/* ===== Treino: objetivos, variantes mais fácil e mais difícil, ecrã do exercício ===== */
const TOBJ = { geral:"Forma física geral", forca:"Ganhar força", mobilidade:"Mobilidade", resistencia:"Resistência", habito:"Criar o hábito" };
const TSTYLE = { forca:"Força com carga", corpo:"Peso do corpo", mobilidade:"Mobilidade", cardio:"Cardio", misto:"Um pouco de tudo" };
const MOB = ["Gato-vaca", "Rotação torácica a quatro apoios", "Alongamento do flexor da anca", "Círculos de ombros e anca"];
Object.assign(EXINFO, {
  "Gato-vaca":["Coluna e costas",["A quatro apoios, mãos por baixo dos ombros.","Arredonda as costas a olhar para o umbigo.","Depois desce a barriga e olha em frente, devagar."]],
  "Rotação torácica a quatro apoios":["Parte alta das costas",["A quatro apoios, uma mão atrás da cabeça.","Roda o cotovelo para o teto, a seguir o olhar.","Volta devagar. Faz os dois lados."]],
  "Alongamento do flexor da anca":["Anca e coxas",["Um joelho no chão, o outro pé à frente.","Leva a anca à frente com o tronco direito.","Sente a frente da coxa de trás. Troca de lado."]],
  "Círculos de ombros e anca":["Ombros e anca",["Em pé, faz círculos grandes com os ombros.","Depois mãos na cintura e círculos com a anca.","Sem pressa, nos dois sentidos."]],
  "Agachamento com elástico":["Pernas e glúteos",["Pisa o elástico, pontas à altura dos ombros.","Desce como no agachamento normal.","Sobe a empurrar o chão."]],
  "Agachamento com salto pequeno":["Pernas e glúteos",["Agacha um pouco e salta baixo.","Aterra suave, com os joelhos fletidos.","Só se não tens dor nos joelhos."]],
  "Ponte de glúteos num banco":["Glúteos e posteriores",["Pés em cima de um banco, costas no chão.","Sobe a anca até alinhar com os joelhos.","Desce devagar."]],
  "Hip thrust num banco":["Glúteos",["Costas apoiadas num banco, pés no chão.","Sobe a anca até o tronco ficar paralelo ao chão.","Aperta os glúteos em cima."]],
  "Ponte de glúteos com haltere":["Glúteos e posteriores",["Haltere em cima da anca, seguro com as mãos.","Sobe a anca e aperta os glúteos.","Desce devagar."]],
  "Hip thrust com barra":["Glúteos",["Costas num banco, barra na anca com proteção.","Sobe até o tronco ficar paralelo ao chão.","Queixo encolhido."]],
  "Step-up num degrau":["Pernas e glúteos",["Sobe um degrau com o pé inteiro.","Empurra com a perna de cima.","Desce devagar e troca."]],
  "Elevações em Y":["Ombros e costas",["Deitado de barriga para baixo, braços em Y.","Levanta os braços com os polegares para cima.","Segura 1 segundo."]],
  "Flexões pike num banco":["Ombros e tríceps",["Pés num banco, anca alta.","Desce a cabeça entre as mãos.","Mais difícil do que no chão."]]
});

/* Escadas de dificuldade por padrão, da mais fácil à mais difícil.
   Material: g ginásio, h halteres ou kettlebell, e elásticos, p barra de elevações, b barra baixa (rua ou barra). */
const LADDER = {
  squat:[["Sentar e levantar de um banco"],["Agachamento com o peso do corpo"],["Agachamento com pausa"],["Agachamento com elástico","e"],["Agachamento com salto pequeno"],["Agachamento goblet com haltere","h"],["Leg press","g"],["Agachamento com barra","g"]],
  hinge:[["Ponte de glúteos"],["Hip thrust apoiado"],["Ponte de glúteos num banco"],["Ponte de glúteos a uma perna"],["Hip thrust num banco"],["Ponte de glúteos com haltere","h"],["Peso morto romeno com halteres","h"],["Peso morto romeno","g"],["Hip thrust com barra","g"]],
  push:[["Flexões inclinadas numa mesa"],["Flexões (inclinadas, se precisares)"],["Flexões num banco"],["Flexões de joelhos"],["Press de peito leve com elástico","e"],["Press de peito com elástico","e"],["Flexões"],["Supino com halteres","g"],["Supino com barra","g"]],
  pull:[["Superman"],["Remada com toalha numa porta"],["Remada com elástico","e"],["Remada australiana numa barra baixa","b"],["Remada com haltere","h"],["Remada sentada","g"],["Puxada à frente","g"],["Elevações na barra (ou negativas)","p"]],
  press:[["Elevações em Y deitado"],["Elevações laterais leves"],["Face pull com elástico","e"],["Elevações laterais com elástico","e"],["Flexões pike"],["Flexões pike num banco"],["Elevações laterais","h"],["Press de ombros com halteres","h"]],
  lunge:[["Abdução de anca deitado"],["Elevação de gémeos"],["Step-up num degrau"],["Lunges para trás"],["Lunges alternados"],["Step-up num banco"],["Lunges a andar"],["Lunges com halteres","h"]],
  core:[["Dead bug"],["Prancha"],["Prancha lateral"]]
};
function kitNow(){ const u = S.u || {}, eq = u.equip || [], gym = u.place === "gym" || !!(S.wk && S.wk.prog === "forca"), rua = u.place === "rua";
  return { g:gym, h:gym || eq.includes("Halteres") || eq.includes("Kettlebell"), e:gym || eq.includes("Elásticos"), p:gym || rua || eq.includes("Barra de elevações"), b:gym || rua || eq.includes("Barra de elevações") }; }
// Variantes possíveis com o material e as zonas a poupar da pessoa.
function variantsOf(name, pat){
  const L = LADDER[pat]; if (!L) return { easier:null, harder:null, list:[] };
  const kit = kitNow(), lim = (S.u && S.u.lim) || [];
  const bad = [lim.includes("Joelhos") && "salto|Lunges a andar", lim.includes("Ombros") && "pike|Press de ombros|Supino com barra", lim.includes("Costas") && "Peso morto|com barra"].filter(Boolean).join("|");
  const ok = L.filter(([n, need]) => n === name || ((!need || kit[need]) && !(bad && new RegExp(bad).test(n)))).map(x => x[0]), i = ok.indexOf(name);
  return { easier: i > 0 ? ok[i - 1] : null, harder: i >= 0 && i < ok.length - 1 ? ok[i + 1] : null, list: ok.filter(x => x !== name) };
}

/* Demonstração: figura de traço vista de lado, entre duas posições. Pontos: cabeça, pescoço, meio do tronco (_ = a meio), anca,
   joelho e tornozelo de cada perna, cotovelo, pulso. É ilustrativa: mostra o movimento, não substitui um treinador. */
const ST = "80,16 80,30 _ 80,58 80,79 80,100 80,79 80,100";
const POSES = {
  squat:[ST + " 93,31 106,31", "86,40 80,50 _ 62,72 84,76 80,100 84,76 80,100 94,50 108,49"],
  hinge:[ST + " 82,44 83,57", "107,41 96,46 _ 70,58 76,79 80,100 76,79 80,100 97,59 97,72"],
  bridge:["28,92 40,95 _ 74,96 96,78 104,100 96,78 104,100 56,98 70,98", "28,92 40,95 _ 72,82 96,78 104,100 96,78 104,100 56,98 70,98"],
  push:["120,72 108,76 _ 76,86 52,93 28,100 52,93 28,100 108,88 108,100", "122,88 110,90 _ 78,94 53,97 28,100 53,97 28,100 100,92 108,100"],
  plank:["116,80 104,84 _ 72,90 50,95 28,100 50,95 28,100 104,100 120,100", "116,79 104,84 _ 72,87 50,94 28,100 50,94 28,100 104,100 120,100"],
  row:["110,35 99,42 _ 72,58 77,79 80,100 77,79 80,100 99,56 99,70", "110,35 99,42 _ 72,58 77,79 80,100 77,79 80,100 84,46 94,57"],
  press:[ST + " 90,42 90,28", ST + " 84,14 84,0"],
  pullv:[ST + " 84,14 84,0", ST + " 90,42 90,28"],
  lunge:[ST + " 80,44 80,57", "80,26 80,40 _ 80,68 100,76 102,100 72,90 52,98 80,54 80,67"],
  calf:[ST + " 80,44 80,57", "80,11 80,25 _ 80,53 80,74 80,96 80,74 80,96 80,39 80,52"],
  march:[ST + " 76,44 72,56", "80,16 80,30 _ 80,58 80,79 80,100 98,66 96,88 86,44 92,54"],
  deadbug:["30,90 42,94 _ 78,95 80,74 100,74 80,74 100,74 46,80 48,66", "30,90 42,94 _ 78,95 80,74 100,74 98,90 120,92 32,84 20,80"],
  birddog:["116,74 104,80 _ 70,80 68,100 48,100 68,100 48,100 104,90 104,100", "116,74 104,80 _ 70,80 68,100 48,100 48,80 26,80 118,78 132,76"],
  cat:["116,76 104,80 87,70 70,80 68,100 48,100 68,100 48,100 104,90 104,100", "116,74 104,80 87,88 70,80 68,100 48,100 68,100 48,100 104,90 104,100"],
  superman:["124,92 112,96 _ 78,97 56,98 34,98 56,98 34,98 126,97 140,97", "124,88 112,94 _ 78,97 56,96 34,92 56,96 34,92 126,92 140,88"],
  sidelift:["26,90 40,93 _ 78,95 98,97 120,98 98,97 120,98 56,96 70,96", "26,90 40,93 _ 78,95 98,97 120,98 98,88 118,80 56,96 70,96"],
  raise:[ST + " 80,44 80,57", ST + " 94,31 108,30"]
};
const demoKind = n => [[/Prancha/, "plank"], [/Dead bug/, "deadbug"], [/Bird dog/, "birddog"], [/Gato|torácica/, "cat"], [/Ponte|Hip thrust/, "bridge"], [/Superman|em Y/, "superman"],
  [/Abdução/, "sidelift"], [/gémeos/, "calf"], [/Lunge|Step-up|flexor/, "lunge"], [/Agachamento|Sentar|Leg press/, "squat"], [/Peso morto/, "hinge"],
  [/Flexões|Supino|Press de peito|Dips/, "push"], [/Remada|Face pull/, "row"], [/Puxada|Elevações na barra/, "pullv"], [/Press de ombros/, "press"], [/Elevações laterais/, "raise"]]
  .find(([re]) => re.test(n))?.[1] || "march";
function demoSVG(name){
  const parse = s => { const p = s.split(" ").map(x => x === "_" ? null : x.split(",").map(Number)); p[2] = p[2] || [(p[1][0] + p[3][0]) / 2, (p[1][1] + p[3][1]) / 2]; return p; };
  const [A, B] = POSES[demoKind(name)].map(parse), still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pts = (P, ix) => ix.map(i => P[i].join(",")).join(" ");
  const line = ix => { const a = pts(A, ix), b = pts(B, ix); return `<polyline points="${still ? b : a}">${still ? "" : `<animate attributeName="points" values="${a};${b};${a}" dur="3s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/>`}</polyline>`; };
  const hd = (c, i) => still ? "" : `<animate attributeName="${c}" values="${A[0][i]};${B[0][i]};${A[0][i]}" dur="3s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"/>`;
  const y0 = Math.min(...A.concat(B).map(q => q[1])) - 12; /* recorta por cima: figuras deitadas ficam maiores */
  return `<svg class="demo" viewBox="0 ${y0} 160 ${108 - y0}" role="img" aria-label="Demonstração de ${esc(name)}"><line class="gr" x1="8" y1="103" x2="152" y2="103"/>
    <g class="fig">${line([5, 4, 3, 6, 7])}${line([3, 2, 1])}${line([1, 8, 9])}<circle r="7" cx="${(still ? B : A)[0][0]}" cy="${(still ? B : A)[0][1]}">${hd("cx", 0)}${hd("cy", 1)}</circle></g></svg>`;
}

// Ecrã de um exercício: demonstração, séries, dicas, dificuldade, troca e marcar como feito.
function openExercise(k, i){
  const se = sessionFor(k); if (!se) return;
  const e = se.sess.e[i], orig = e[0], name = exName(k, se, i), info = EXINFO[name], key = se.sess.n + "|" + i, pat = PAT_OF(orig), V = variantsOf(name, pat);
  const sets = setsOf(e[1]), per = String(e[1]).replace(/^\d+\s*×\s*/, ""), st = (S.wk.ex && S.wk.ex[k]) || [], last = lastTxt(name);
  const vb = (n, lab, why) => n ? `<button class="ex-var" data-alt="${esc(n)}"><small>${lab}</small><b>${esc(n)}</b></button>`
    : `<div class="ex-var off"><small>${lab}</small><b>${why}</b></div>`;
  const others = V.list.filter(x => x !== V.easier && x !== V.harder && x !== orig).slice(0, 5);
  openSheet(name, `<figure class="ex-demo">${demoSVG(name)}<figcaption>Demonstração ilustrativa do movimento</figcaption></figure>
    <div class="ex-stats"><div><b class="num">${sets}</b><span>${sets === 1 ? "série" : "séries"}</span></div><div><b class="num">${esc(per)}</b><span>${isTimed(e[1]) ? "duração" : "repetições"}</span></div><div><b class="num">${esc(e[2] || "—")}</b><span>descanso</span></div></div>
    <p class="ex-mus">${esc(info ? info[0] : "Movimento geral")}${last ? ` · ${esc(last)}` : ""}</p>
    ${info ? `<ol class="steps">${info[1].map(x => `<li>${esc(x)}</li>`).join("")}</ol>` : `<p style="margin-top:10px">Faz o movimento devagar e com controlo, sem dor.</p>`}
    <div class="note" style="margin-top:14px">${icon("info","sm")}<span>Esforço é normal; dor não. Se doer, para e escolhe a versão mais fácil ou outro exercício.</span></div>
    ${LADDER[pat] ? `<h3 class="ex-h">Ajustar a dificuldade</h3><div class="ex-vars">${vb(V.easier, "Mais fácil", "Já é a mais fácil")}${vb(V.harder, "Mais difícil", "Já é a mais difícil com o teu material")}</div>` : ""}
    ${others.length ? `<h3 class="ex-h">Trocar por outro</h3><div class="list">${others.map(a => `<button class="li" data-alt="${esc(a)}"><span class="lt"><b>${esc(a)}</b><small>${esc(EXINFO[a] ? EXINFO[a][0] : "")}</small></span>${icon("right","sm")}</button>`).join("")}</div>` : ""}
    ${name !== orig ? `<button class="btn ghost block" data-alt="${esc(orig)}" style="margin-top:12px">Voltar ao original: ${esc(orig)}</button>` : ""}
    ${k <= today() && !workoutDone(k) ? `<button class="btn block" id="ex-done" style="margin-top:12px">${st.includes(i) ? "Feito · desmarcar" : "Marcar como feito"}</button>` : ""}
    <p class="tiny muted" style="margin-top:10px">Uma troca fica em todas as semanas deste plano.</p>`, b => {
    $$("[data-alt]", b).forEach(x => x.onclick = () => { S.wk.swap = S.wk.swap || {}; if (x.dataset.alt === orig) delete S.wk.swap[key]; else S.wk.swap[key] = x.dataset.alt;
      save(); closeSheet(); renderTreino(); toast(x.dataset.alt === orig ? "Voltaste ao exercício original" : "Trocado por " + x.dataset.alt); });
    const d = $("#ex-done", b); if (d) d.onclick = () => { S.wk.ex = S.wk.ex || {}; const a = S.wk.ex[k] = S.wk.ex[k] || [], j = a.indexOf(i); if (j >= 0) a.splice(j, 1); else a.push(i); save(); closeSheet(); renderTreino(); };
  });
}
