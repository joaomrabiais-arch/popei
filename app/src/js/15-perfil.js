/* ========================== PERFIL ========================== */
function renderPerfil(){
  const u = S.u || {}, days = Object.keys(S.days).filter(k => (S.days[k]||[]).length).length;
  const wks = Object.keys(Object.assign({}, S.wkHist || {}, (S.wk && S.wk.done) || {})).length;
  $("#pf-head").innerHTML = `<div class="pf-top">${abi({ mood:"happy", size:72, acc:S.equip })}<div class="grow"><h2>${esc(u.name || "Olá!")}</h2><p class="small muted">${esc(u.obj || goalName(u.goal) || "Sem objetivo definido")}</p></div></div>
    <div class="pf-stats"><div><b class="num">${days}</b><small>${days === 1 ? "dia com registos" : "dias com registos"}</small></div><div><b class="num">${wks}</b><small>${wks === 1 ? "treino feito" : "treinos feitos"}</small></div><div><b class="num">${Object.keys(S.ach).length}</b><small>conquistas</small></div></div>`;
  const M = [
    ["crown","gold",`${BRAND.name} Pro`, S.proDisc ? `Tens ${S.proDisc}% de desconto guardado` : "Gira a roda e ganha desconto", openPro],
    ["gift","gold","Roda de descontos",`${pl(S.spins, "giro disponível", "giros disponíveis")}`, () => go("roda")],
    ["sparkle","","Armário do " + BRAND.mascot, `${pl(S.owned.filter(id => id.startsWith("acc_")).length, "acessório ganho", "acessórios ganhos")}`, openCloset],
    ["chart","sky","Progresso","Peso, energia, água e treinos", openSummary],
    ["trophy","gold","Conquistas",`${Object.keys(S.ach).length} de ${ACH.length}`, openAch],
    ["leaf","","Bem-estar","Sono, energia e humor", openWell],
    ["chat","acc",`Falar com o ${BRAND.mascot}`,"Perguntas sobre alimentação", openChat],
    ["bowl","","Plano alimentar","Refeições, cozinha, treino, orçamento", openPlanPrefs],
    ["target","","Preferências","Alimentação, alergias, calorias", openPrefs],
    ["brush","","Aparência e som","Tema, cores, animações", openLook],
    ["info","","Como funciona a app","Visita guiada de 1 minuto", () => startTour()],
    ...(cloudOn() ? [["upload","","Conta e cópia na nuvem", cloudUser ? "Ligada: " + cloudUser.email : "Guarda os teus dados em segurança", openAccount]] : []),
    ["shield","","Dados e privacidade","Exportar, importar, apagar", openData]
  ];
  const item = i => { const m = M[i]; return `<button class="li" data-m="${i}"><span class="badge ${m[1]}">${icon(m[0])}</span><span class="lt"><b>${esc(m[2])}</b><small>${esc(m[3])}</small></span>${icon("right","sm")}</button>`; };
  const at = t => M.findIndex(m => m[2] === t), grp = (t, L) => { L = L.filter(i => i >= 0); return L.length ? `<p class="pf-g">${t}</p><div class="list">${L.map(item).join("")}</div>` : ""; };
  const cloudI = M.findIndex(m => m[0] === "upload"), dataI = M.length - 1;
  $("#pf-menu").innerHTML = `<button class="pf-pro" data-m="0"><span class="pf-pro-ic">${icon("crown","sm")}</span><span class="grow"><b>${esc(M[0][2])}</b><small>${esc(M[0][3])}</small></span><span class="pf-pro-go">Ver</span></button>`
    + grp("O teu plano", [at("Plano alimentar"), at("Preferências"), at(`Falar com o ${BRAND.mascot}`)])
    + grp("Progresso", [at("Progresso"), at("Conquistas"), at("Bem-estar")])
    + grp("Recompensas", [1, 2])
    + grp("Definições", [at("Aparência e som"), at("Como funciona a app"), cloudI, dataI]);
  $$("#pf-menu [data-m]").forEach(b => b.onclick = () => M[+b.dataset.m][4]());
}
function openCloset(){
  const accs = ACCESSORIES.filter(r => r.type === "acc").concat(GOLDEN.filter(g => g.type === "acc"));
  openSheet("Armário do " + BRAND.mascot, `<div style="display:grid;place-items:center">${abi({ mood:"wave", size:120 })}</div>
    <div class="closet" style="margin-top:14px"><button class="${!S.equip ? "on" : ""}" data-a="">${abi({ size:40, acc:null })}Nada</button>
    ${accs.map(a => { const own = S.owned.includes(a.id); return `<button class="${S.equip === a.id ? "on" : ""} ${own ? "" : "locked"}" data-a="${a.id}">${abi({ size:40, acc:a.id })}${esc(a.name)}${own ? "" : "<small class='muted'>Por ganhar</small>"}</button>`; }).join("")}</div>
    <p class="tiny muted" style="margin-top:12px">Os acessórios ganham-se na roda de prémios. Nunca se compram.</p>`, b => {
    $$(".closet button", b).forEach(x => x.onclick = () => { const id = x.dataset.a; if (id && !S.owned.includes(id)) { toast("Ainda não ganhaste este acessório"); return; } S.equip = id || null; save(); openCloset(); refreshAll(); });
  });
}

function openAch(){ openSheet("Conquistas", `<p class="small muted" style="margin-bottom:12px">Celebram curiosidade e hábitos, nunca peso nem restrição.</p><div class="ach">${ACH.map(a => `<div class="${S.ach[a[0]] ? "on" : ""}"><span class="medal">${icon(S.ach[a[0]] ? "trophy" : "star")}</span><b>${esc(a[1])}</b><small class="muted">${esc(S.ach[a[0]] ? "Obtida a " + S.ach[a[0]].split("-").reverse().join("/") : a[2])}</small></div>`).join("")}</div>`); }
function openWell(){
  const w = S.well[today()] || {};
  const scale = (id, v, lbl) => `<div class="field"><span>${lbl}</span><div class="seg" id="${id}">${[1,2,3,4,5].map(i => `<button data-v="${i}" class="${(v || 3) === i ? "on" : ""}">${i}</button>`).join("")}</div></div>`;
  const hist = Object.keys(S.well).sort().reverse().slice(0,7);
  openSheet("Bem-estar", `<div class="stack"><div class="g2"><label class="field"><span>Sono (horas)</span><input id="wl-s" type="number" min="0" max="16" step="0.5" value="${w.s ?? ""}"></label><label class="field"><span>Movimento (min)</span><input id="wl-a" type="number" min="0" max="600" value="${w.a ?? ""}"></label></div>
    ${scale("wl-e", w.e, "Energia, de 1 a 5")}${scale("wl-m", w.m, "Humor, de 1 a 5")}<button class="btn block" id="wl-ok">Guardar</button>
    <p class="tiny muted">Para te conheceres melhor. Sem metas nem pontuações.</p></div>
    ${hist.length ? `<h3 style="margin-top:20px">Últimos registos</h3><div class="list" style="margin-top:8px">${hist.map(d => { const x = S.well[d]; return `<div class="li"><div class="lt"><b>${esc(d.split("-").reverse().join("/"))}</b><small>Sono ${x.s ?? "–"} h · Movimento ${x.a ?? "–"} min · Energia ${x.e}/5 · Humor ${x.m}/5</small></div></div>`; }).join("")}</div>` : ""}`, b => {
    const st = { e:w.e || 3, m:w.m || 3 };
    ["e","m"].forEach(f => $$(`#wl-${f} button`, b).forEach(x => x.onclick = () => { st[f] = +x.dataset.v; $$(`#wl-${f} button`, b).forEach(y => y.classList.toggle("on", y === x)); }));
    $("#wl-ok", b).onclick = () => { const s = $("#wl-s", b).value, a = $("#wl-a", b).value;
      if ((s !== "" && !(+s >= 0 && +s <= 16)) || (a !== "" && !(+a >= 0 && +a <= 600))) { toast("Verifica o sono (0–16 h) e o movimento (0–600 min)"); return; }
      S.well[today()] = { s: s === "" ? undefined : +s, a: a === "" ? undefined : +a, e:st.e, m:st.m }; save(); ach("well"); closeSheet(); toast("Registo guardado"); };
  });
}
let chatHist = [];
function openChat(){
  const off = !sample;
  openSheet(`Falar com o ${BRAND.mascot}`, `<div class="row">${abi({ mood:"wave", size:56 })}<p class="small">Pergunta-me sobre alimentos, combinações, substituições ou receitas.</p></div>
    <div id="ch-l" style="margin-top:12px;min-height:60px">${chatHist.map(m => `<div class="msg ${m.r}">${esc(m.t)}</div>`).join("")}</div>
    <div class="row" style="margin-top:12px"><input id="ch-i" maxlength="500" placeholder="${off ? "Indisponível fora do Claude" : "Escreve a tua pergunta"}" ${off ? "disabled" : ""} aria-label="Pergunta"><button class="btn" id="ch-s" ${off ? "disabled" : ""}>Enviar</button></div>
    <p class="tiny muted" style="margin-top:10px">${off ? "O assistente usa a IA do Claude e só funciona quando a app abre como artefacto no Claude." : "Informação geral e educativa. Não diagnostica nem substitui um profissional de saúde."}</p>`, b => {
    const send = async () => { const q = $("#ch-i", b).value.trim(); if (!q || !sample) return; $("#ch-i", b).value = ""; chatHist.push({ r:"u", t:q }); ach("ask");
      const l = $("#ch-l", b); l.insertAdjacentHTML("beforeend", `<div class="msg u">${esc(q)}</div><div class="msg a" id="ch-w">A pensar…</div>`); $("#ch-s", b).disabled = true;
      const u = S.u || {}, al = (u.al||[]).filter(x => x !== "Nenhuma").join(", ") || "nada indicado";
      const sys = `És o ${BRAND.mascot}, a mascote abacate da app ${BRAND.name}. Respondes em português europeu, de forma curta, simpática e clara. Dás informação geral e educativa sobre alimentação. Não diagnostiques, não prescrevas dietas, restrições, jejum, défices calóricos nem perda de peso. Nunca classifiques alimentos como bons ou maus. Remete questões clínicas para médico ou nutricionista. ${isMinor() ? "A pessoa pode ser menor de idade: foca-te em refeições regulares e variadas e nunca fales em emagrecer. " : ""}Alimentação da pessoa: ${(u.diet||[]).join(", ") || "não indicada"}. Evita: ${al}.`;
      try { const r = await sample(sys + "\n\nConversa:\n" + chatHist.slice(-8).map(m => (m.r === "u" ? "Utilizador: " : "Assistente: ") + m.t).join("\n") + "\nAssistente:", { cache:false }); $("#ch-w", b).textContent = r.text; chatHist.push({ r:"a", t:r.text }); }
      catch(e) { $("#ch-w", b).textContent = AIERR[e && e.code] || "Não foi possível responder agora. Tenta novamente."; }
      finally { const w = $("#ch-w", b); if (w) w.removeAttribute("id"); $("#ch-s", b).disabled = false; } };
    $("#ch-s", b).onclick = send; $("#ch-i", b).onkeydown = e => { if (e.key === "Enter") send(); };
  });
}
/* ===== Referência de energia e macros =====
   Mifflin-St Jeor × atividade. Perder peso: défice de 15%, no máximo 500 kcal. Ganhar músculo: +10%, no máximo 300 kcal.
   Nunca abaixo de 1200 (F) / 1500 (M) kcal. Com IMC < 18,5 não se propõe perder peso. Menores: sem calorias. */
const GOALS = [["perder","Perder gordura"],["manter","Manter o peso"],["musculo","Ganhar músculo"],["rendimento","Render mais no desporto"],["livre","Comer melhor, sem contar calorias"]];
const ACTS = [["1.2","Pouco: passo o dia sentado"],["1.375","Às vezes: 1 a 3 treinos por semana"],["1.55","Bastante: 3 a 5 treinos por semana"],["1.725","Muito: 6 ou 7 treinos por semana"]];
const goalName = id => (GOALS.find(g => g[0] === id) || [,"–"])[1];
const validBody = p => p.age >= 10 && p.age <= 100 && p.h >= 120 && p.h <= 230 && p.w >= 30 && p.w <= 250;
function computeRef(p, goal, pace){
  const bmr = 10*p.w + 6.25*p.h - 5*p.age + (p.sex === "m" ? 5 : -161), tdee = bmr * (+p.act || 1.375);
  const bmi = p.w / ((p.h/100) ** 2);
  let g = goal, note = "";
  if (g === "perder" && bmi < 18.5) { g = "manter"; note = "O teu IMC está abaixo de 18,5, por isso a referência é de manutenção. Se queres perder peso, fala primeiro com um profissional de saúde."; }
  let k = tdee;
  const cap = Math.min(500, tdee * .15), want = (+pace || .5) * 7700 / 7;
  if (g === "perder") { k = tdee - Math.min(cap, want); if (want > cap) note = note || `Para a tua segurança, o défice fica limitado a ${Math.round(cap)} kcal por dia. O ritmo real pode ser um pouco mais lento.`; }
  if (g === "musculo") k = tdee + ((+pace || .5) >= .5 ? Math.min(300, tdee * .1) : Math.min(180, tdee * .07));
  k = clamp(Math.round(k / 50) * 50, p.sex === "m" ? 1500 : 1200, 5000);
  const prot = Math.round(clamp(p.w * ({ perder:1.6, musculo:1.8, rendimento:1.6 }[g] || 1.2), 50, 220)), fat = Math.round(k * .28 / 9);
  return { delta:Math.round(k - tdee), kcal:k, p:prot, g:fat, c:Math.max(0, Math.round((k - prot*4 - fat*9) / 4)), goal:g, note, bmi:Math.round(bmi*10)/10 };
}
function applyRef(){ // aplica a referência ao estado, a partir de S.prof e S.u.goal
  const u = S.u || {};
  if (isMinor() || u.goal === "livre" || !validBody(S.prof)) { S.macro = null; if (isMinor() || u.goal === "livre") S.showKcal = false; return null; }
  const r = computeRef(S.prof, u.goal || "manter", u.pace); S.goal = r.kcal; S.macro = { p:r.p, c:r.c, g:r.g }; S.showKcal = true; return r;
}
const refCard = r => `<div class="ref"><div><b>${r.kcal}</b><small>kcal</small></div><div><b>${r.p}</b><small>proteína g</small></div><div><b>${r.c}</b><small>hidratos g</small></div><div><b>${r.g}</b><small>gordura g</small></div></div>`;
function openPrefs(){
  const u = S.u || {}, p = S.prof;
  const rows = [["Objetivo", goalName(u.goal)],["Dados", validBody(p) && u.age !== "Prefiro não dizer" ? `${p.age} anos · ${p.h} cm · ${p.w} kg` : "Não indicados"],["Atividade", (ACTS.find(a => a[0] === String(p.act)) || [,"–"])[1]],
    ["Alimentação", (u.diet||[]).join(", ")],["A evitar", (u.al||[]).join(", ")],["Não gosto", (u.dislikes||[]).join(", ")],["Cozinha", u.cook]];
  openSheet("Preferências", `<div class="stack">
    <div class="list">${rows.map(([a,b2]) => `<div class="li"><div class="lt"><small>${a}</small><b>${esc(b2 || "–")}</b></div></div>`).join("")}</div>
    <div class="row"><button class="btn ghost grow" id="pr-calc">Dados e objetivo</button><button class="btn ghost grow" id="pr-redo">Alimentação</button></div>
    ${isMinor() ? `<div class="note">${icon("info","sm")}<span>Para menores de 18 anos (ou se não indicaste a idade), a app não mostra calorias nem metas. O foco são refeições regulares, variadas e água.</span></div>` : `
    <div class="card stack"><div class="row between"><div><b>Mostrar calorias e macros</b><p class="small muted">Podes usar a app sem contar nada.</p></div><input type="checkbox" id="pr-k" ${S.showKcal ? "checked" : ""} style="width:24px;height:24px;accent-color:var(--brand);flex:none" aria-label="Mostrar calorias"></div>
    ${S.macro ? `<p class="small muted">Referência atual: ${S.goal} kcal · P ${S.macro.p} g · H ${S.macro.c} g · G ${S.macro.g} g</p>` : ""}
    <label class="field"><span>Ajustar à mão (kcal)</span><input id="pr-g" type="number" min="1200" max="5000" step="50" value="${S.goal}"></label>
    <p class="tiny muted">É uma referência, não uma regra. Passar dela num dia não é falhar.</p></div>`}
    <label class="field"><span>Copos de água por dia (250 ml)</span><input id="pr-w" type="number" min="4" max="16" value="${S.wg}"></label>
    <button class="btn block" id="pr-ok">Guardar</button></div>`, b => {
    $("#pr-redo", b).onclick = () => { closeSheet(); openPlanPrefs(); };
    $("#pr-calc", b).onclick = openCalc;
    $("#pr-ok", b).onclick = () => { if (!isMinor()) { S.showKcal = $("#pr-k", b).checked; const g = clamp(Math.round(+$("#pr-g", b).value || 2000), 1200, 5000);
        if (S.macro && g !== S.goal) { const f = g / S.goal; S.macro = { p:S.macro.p, g:Math.round(S.macro.g*f), c:Math.max(0, Math.round((g - S.macro.p*4 - Math.round(S.macro.g*f)*9)/4)) }; } S.goal = g; }
      S.wg = clamp(Math.round(+$("#pr-w", b).value || 8), 4, 16); save(); closeSheet(); toast("Preferências guardadas"); refreshAll(); };
  });
}
function openCalc(){
  const p = S.prof, u = S.u || {}; let sex = p.sex;
  openSheet("Dados e objetivo", `<div class="stack"><div class="seg" id="c-s"><button data-v="f" class="${sex === "f" ? "on" : ""}">Feminino</button><button data-v="m" class="${sex === "m" ? "on" : ""}">Masculino</button></div>
    <div class="g2" style="grid-template-columns:repeat(3,1fr)"><label class="field"><span>Idade</span><input id="c-a" type="number" inputmode="numeric" min="10" max="100" value="${p.age}"></label><label class="field"><span>Altura (cm)</span><input id="c-h" type="number" inputmode="numeric" min="120" max="230" value="${p.h}"></label><label class="field"><span>Peso (kg)</span><input id="c-w" type="number" inputmode="decimal" min="30" max="250" step="0.1" value="${p.w}"></label></div>
    <label class="field"><span>Atividade</span><select id="c-x">${ACTS.map(a => `<option value="${a[0]}" ${String(p.act) === a[0] ? "selected" : ""}>${a[1]}</option>`).join("")}</select></label>
    <label class="field"><span>Objetivo</span><select id="c-g">${GOALS.filter(g => g[0] !== "perder" || !isMinor()).map(g => `<option value="${g[0]}" ${(u.goal || "manter") === g[0] ? "selected" : ""}>${g[1]}</option>`).join("")}</select></label>
    <div id="c-r"></div><button class="btn block" id="c-ok">Guardar</button>
    <p class="tiny muted">Estimativa geral (fórmula de Mifflin-St Jeor). Não serve para gravidez, amamentação nem condições de saúde. Para perder peso, o défice nunca passa de 15% nem de 500 kcal. Em caso de dúvida, fala com um nutricionista.</p></div>`, b => {
    $$("#c-s button", b).forEach(x => x.onclick = () => { sex = x.dataset.v; $$("#c-s button", b).forEach(y => y.classList.toggle("on", y === x)); prev(); });
    const read = () => ({ sex, age:+$("#c-a", b).value, h:+$("#c-h", b).value, w:+$("#c-w", b).value, act:$("#c-x", b).value });
    const prev = () => { const q = read(), g = $("#c-g", b).value, el = $("#c-r", b);
      if (!validBody(q)) { el.innerHTML = `<p class="small" style="color:var(--accent)">Verifica a idade (10–100), a altura (120–230 cm) e o peso (30–250 kg).</p>`; return; }
      if (q.age < 18) { el.innerHTML = `<div class="note">${icon("info","sm")}<span>Abaixo dos 18 anos a app não calcula calorias. O foco são refeições regulares e variadas.</span></div>`; return; }
      if (g === "livre") { el.innerHTML = `<p class="small muted">Sem contagem de calorias: o anel do dia mostra as refeições registadas.</p>`; return; }
      const r = computeRef(q, g); el.innerHTML = refCard(r) + (r.note ? `<div class="note warn" style="margin-top:10px">${icon("info","sm")}<span>${esc(r.note)}</span></div>` : ""); };
    $$("input,select", b).forEach(x => x.oninput = prev); prev();
    $("#c-ok", b).onclick = () => { const q = read(); if (!validBody(q)) { toast("Verifica os dados"); return; }
      S.prof = q; S.u = Object.assign(S.u || {}, { goal:$("#c-g", b).value, obj:goalName($("#c-g", b).value), age: q.age >= 18 ? "18 ou mais" : "Menos de 18" });
      applyRef(); save(); closeSheet(); toast("Referência atualizada"); refreshAll(); };
  });
}
function openLook(){
  const COL = { pessego:"#C4563A", mar:"#1F6F86", ouro:"#9A6A12" };
  const ACC = [["", "Abacate", "#2F6B3A", true]].concat(ACCESSORIES.concat(GOLDEN).filter(t => t.type === "theme").map(t => [t.accent, t.name.replace("Tema ",""), COL[t.accent], S.owned.includes(t.id)]));
  openSheet("Aparência e som", `<div class="stack"><div class="field"><span>Tema</span><div class="seg" id="lk-t">${[["","Automático"],["light","Claro"],["dark","Escuro"]].map(([v,l]) => `<button data-v="${v}" class="${(S.theme || "") === v ? "on" : ""}">${l}</button>`).join("")}</div></div>
    <div class="field"><span>Idioma</span><div class="seg" id="lk-l">${[["pt","Português"],["en","English"]].map(([v, l]) => `<button data-l="${v}" class="${LANG() === v ? "on" : ""}">${l}</button>`).join("")}</div></div>
    <div class="field"><span>Cor principal</span><div class="row" style="flex-wrap:wrap;gap:8px" id="lk-a">${ACC.map(([v, l, c, own]) => `<button class="chip ${(S.accent || "") === v ? "on" : ""}" data-v="${v}" data-own="${own ? 1 : 0}" style="${own ? "" : "opacity:.5"}"><span style="width:14px;height:14px;border-radius:50%;background:${c}"></span>${esc(l)}${own ? "" : " · por ganhar"}</button>`).join("")}</div><p class="tiny muted" style="margin-top:6px">Mais cores ganham-se na roda de prémios.</p></div>
    <div class="card stack"><label class="row between"><span>Sons</span><input type="checkbox" id="lk-s" ${S.snd ? "checked" : ""} style="width:24px;height:24px;accent-color:var(--brand);flex:none"></label><label class="row between"><span>O ${esc(BRAND.mascot)} fala comigo</span><input type="checkbox" id="lk-tk" ${S.talk === true ? "checked" : ""} style="width:24px;height:24px;accent-color:var(--brand);flex:none"></label><label class="row between"><span>Animações reduzidas</span><input type="checkbox" id="lk-m" ${S.mot ? "checked" : ""} style="width:24px;height:24px;accent-color:var(--brand);flex:none"></label></div></div>`, b => {
    $$("#lk-l button", b).forEach(x => x.onclick = () => { if (x.dataset.l !== LANG()) setLang(x.dataset.l); });
    $$("#lk-t button", b).forEach(x => x.onclick = () => { S.theme = x.dataset.v; save(); applyPrefs(); openLook(); });
    $$("#lk-a button", b).forEach(x => x.onclick = () => { if (x.dataset.own !== "1") { toast("Ganha esta cor na roda de prémios"); return; } S.accent = x.dataset.v; save(); applyPrefs(); openLook(); });
    $("#lk-s", b).onchange = e => { S.snd = e.target.checked; save(); if (S.snd) snd("ok"); };
    $("#lk-m", b).onchange = e => { S.mot = e.target.checked; save(); applyPrefs(); };
    $("#lk-tk", b).onchange = e => { S.talk = e.target.checked; save(); };
  });
}
async function download(name, text){ try { const d = window.claude && await window.claude.use("downloads"); if (!d) throw 0; await d.save({ filename:name, data:text }); toast("Ficheiro pronto"); }
  catch(e) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text])); a.download = name; a.click(); toast("Se o download não começar, abre a app fora da pré-visualização"); } }
function openData(){
  openSheet("Dados e privacidade", `<div class="stack"><div class="note">${icon("shield","sm")}<span>Os teus dados ficam só neste aparelho e não são enviados para servidores. As fotos só vão para a IA do Claude quando pedes uma análise.</span></div>
    <div class="g2"><button class="btn soft" id="d-j">${icon("download","sm")} Cópia JSON</button><button class="btn soft" id="d-c">${icon("download","sm")} Refeições CSV</button></div>
    <label class="btn ghost block" for="f-imp">${icon("upload","sm")} Importar cópia (JSON)</label>
    <button class="btn ghost block" id="d-t">Rever as perguntas iniciais</button>
    <button class="btn ghost block" id="d-x" style="color:var(--accent)">${icon("trash","sm")} Apagar todos os dados</button></div>`, b => {
    $("#d-j", b).onclick = () => download(BRAND.name.toLowerCase() + "-copia.json", JSON.stringify(S, null, 1));
    $("#d-c", b).onclick = () => { const q = v => '"' + String(v ?? "").replace(/"/g, '""') + '"', r = ["data,hora,refeicao,tipo,porcao,kcal,proteina_g,hidratos_g,gordura_g"];
      Object.keys(S.days).sort().forEach(d => S.days[d].forEach(m => r.push([d, m.t, q(m.n), q(m.m), q(m.q), m.k|0, m.p|0, m.c|0, m.g|0].join(",")))); download(BRAND.name.toLowerCase() + "-refeicoes.csv", r.join("\n")); };
    $("#d-t", b).onclick = () => { closeSheet(); openOnboarding(true); };
    $("#d-x", b).onclick = async () => { if (!await confirmDlg("Apagar todos os dados deste aparelho? Não dá para desfazer.", "Apagar tudo")) return; try { localStorage.removeItem(BRAND.storageKey); BRAND.legacyKeys.forEach(k => localStorage.removeItem(k)); } catch(e) {} location.reload(); };
  });
}
$("#f-imp").onchange = async e => { const f = e.target.files[0]; e.target.value = ""; if (!f) return; if (f.size > 3e6) { toast("Ficheiro demasiado grande"); return; }
  try { const o = JSON.parse(await f.text()); if (!o || typeof o !== "object" || Array.isArray(o) || typeof o.days !== "object" || o.days === null) throw 0;
    if (!await confirmDlg("Substituir os dados atuais pelos do ficheiro?", "Substituir")) return;
    if (o.v) localStorage.setItem(BRAND.storageKey, JSON.stringify(o)); else { localStorage.removeItem(BRAND.storageKey); localStorage.setItem(BRAND.legacyKeys[0], JSON.stringify(o)); }
    location.reload(); }
  catch(x) { toast("Ficheiro inválido: não é uma cópia desta app"); } };

