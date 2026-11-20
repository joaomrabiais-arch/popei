/* ========================== Treino guiado ==========================
   Ecrã inteiro, exercício a exercício: séries a marcar, cronómetro de descanso, dicas de execução e o seguinte.
   Usa o plano já feito a partir das respostas iniciais; não pergunta nada. */
const setsOf = s => { const m = /^(\d+)\s*×/.exec(String(s)); return m ? +m[1] : 1; };
const restOf = s => { const m = /(\d+)\s*(s|min)/.exec(String(s || "")); return m ? +m[1] * (m[2] === "min" ? 60 : 1) : 0; };
// Progressão de cargas: o que fizeste da última vez e quanto tentar hoje (dupla progressão: primeiro repetições, depois peso).
const repsTop = s => { const m = /×\s*(\d+)(?:\s*[–-]\s*(\d+))?(?!\s*(s|min)\b)/.exec(String(s)); return m ? +(m[2] || m[1]) : 0; };
const isTimed = s => /\d+\s*(s|min)\b/.test(String(s)) && !repsTop(s);
const lastLog = n => { const L = ((S.wk && S.wk.log) || {})[n]; return L && L.length ? L[L.length - 1] : null; };
const fmtKg = v => String(v).replace(".", ",");
function lastTxt(n){ const l = lastLog(n); if (!l || !l.sets.length) return ""; const s = l.sets[0]; return s.kg ? `Última vez: ${fmtKg(s.kg)} kg × ${s.reps}` : `Última vez: ${l.sets.map(x => x.reps).join(" · ")} repetições`; }
function suggestLoad(n, reps, sets){
  const top = repsTop(reps), l = lastLog(n);
  if (!l || !l.sets.length) return { kg:"", reps:top || "", txt:"Primeira vez: escolhe um peso com que faças todas as repetições com boa técnica." };
  const kg = Math.max(...l.sets.map(s => +s.kg || 0)), allTop = top && l.sets.length >= sets && l.sets.every(s => s.reps >= top);
  if (kg > 0) return allTop ? { kg: kg + 2.5, reps: top, txt:`Da última vez fizeste tudo com ${fmtKg(kg)} kg. Hoje sobe para ${fmtKg(kg + 2.5)} kg.` }
    : { kg, reps: top, txt:`Mantém ${fmtKg(kg)} kg e tenta mais uma repetição do que da última vez.` };
  return allTop ? { kg:"", reps: top + 2, txt:"Peso do corpo: da última vez chegaste ao topo. Tenta mais 2 repetições ou a variante mais difícil." }
    : { kg:"", reps: top, txt:"Peso do corpo: tenta mais uma repetição do que da última vez." };
}
function startWorkout(k){
  const se = sessionFor(k); if (!se) return;
  const E = se.sess.e.map((e, i) => ({ i, n:exName(k, se, i), reps:e[1], rest:restOf(e[2]), sets:setsOf(e[1]), info:EXINFO[exName(k, se, i)] }));
  S.wk.ex = S.wk.ex || {}; const doneEx = S.wk.ex[k] = S.wk.ex[k] || [];
  let cur = Math.max(0, E.findIndex(e => !doneEx.includes(e.i))), set = 0, timer = null, restLeft = 0, t0 = Date.now();
  if (cur < 0 || cur >= E.length) cur = 0;
  const todayLog = {}, prs = []; // séries de hoje por exercício e recordes batidos
  const ov = document.createElement("div"); ov.className = "full wk-play"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Treino guiado"); document.body.appendChild(ov);
  const close = () => { clearInterval(timer); ov.remove(); renderTreino(); };
  const markEx = i => { if (!doneEx.includes(i)) doneEx.push(i); const ex = E.find(x => x.i === i), sets = ex && todayLog[ex.n];
    if (sets && sets.length) { S.wk.log = S.wk.log || {}; const L = (S.wk.log[ex.n] = (S.wk.log[ex.n] || []).filter(x => x.d !== k));
      const prev = Math.max(0, ...L.map(x => Math.max(0, ...x.sets.map(s => +s.kg || 0)))), now = Math.max(0, ...sets.map(s => +s.kg || 0));
      if (prev > 0 && now > prev) prs.push(`${ex.n}: ${fmtKg(now)} kg`);
      L.push({ d:k, sets: sets.filter(Boolean) }); S.wk.log[ex.n] = L.slice(-12); }
    save(); };
  const finish = () => { clearInterval(timer); S.wk.done = S.wk.done || {}; S.wk.done[k] = 1; save(); ach("wk1"); snd("win"); confetti();
    const min = Math.max(1, Math.round((Date.now() - t0) / 60000));
    ov.innerHTML = `<div class="in wk-end"><div class="mascots" style="justify-content:center">${abi({ mood:"party", size:120 })}</div>
      <h1>Treino feito!</h1><p class="muted">${esc(se.sess.n)} · ${E.length} exercícios · ${min} min</p>
      <div class="stat3" style="margin-top:22px"><div><b>${E.reduce((a, e) => a + e.sets, 0)}</b><small>séries</small></div><div><b>${min}</b><small>minutos</small></div><div><b>${DOW.filter((_, i) => workoutDone(addDays(mondayOf(k), i))).length}/${S.wk.days.length}</b><small>esta semana</small></div></div>
      ${(() => { const vol = Object.values(todayLog).flat().filter(Boolean).reduce((a, s) => a + (+s.kg || 0) * (+s.reps || 0), 0); return vol ? `<p class="small" style="margin-top:16px">Levantaste <b>${Math.round(vol).toLocaleString("pt-PT")} kg</b> no total hoje.</p>` : ""; })()}
      ${prs.length ? `<div class="wk-pr">${icon("trophy","sm")}<div><b>Recorde novo!</b><p class="small">${prs.map(esc).join("<br>")}</p></div></div>` : ""}
      <p class="small muted" style="margin-top:18px">Agora come uma refeição com proteína e bebe água. O teu plano de hoje já conta com o treino.</p>
      <div style="flex:1"></div><button class="btn block" id="wk-ok" style="height:54px">Fechar</button></div>`;
    $("#wk-ok", ov).onclick = () => { close(); say("workout", true); }; };
  const draw = () => { const e = E[cur], nx = E[cur + 1], resting = restLeft > 0;
    const R = 54, C = 2 * Math.PI * R, frac = resting && e.rest ? restLeft / e.rest : 0;
    ov.innerHTML = `<div class="in">
      <div class="row"><button class="iconbtn" id="wk-x" aria-label="Sair do treino">${icon("x")}</button>
        <div class="grow wk-steps" aria-label="Exercício ${cur + 1} de ${E.length}">${E.map((x, i) => `<i class="${doneEx.includes(x.i) ? "dn" : i === cur ? "on" : ""}"></i>`).join("")}</div>
        <span class="tiny muted num" style="width:44px;text-align:right">${cur + 1}/${E.length}</span></div>
      <p class="eyebrow" style="margin-top:26px">${esc(se.sess.n)}${e.info ? " · " + esc(e.info[0]) : ""}</p>
      <h1 class="wk-name">${esc(e.n)}</h1>
      <p class="wk-reps">${esc(e.reps)}${e.rest ? ` <span class="muted">· descanso ${e.rest} s</span>` : ""}</p>
      ${resting ? `<div class="wk-rest"><div class="ring big"><svg viewBox="0 0 124 124" aria-hidden="true"><circle class="tr" cx="62" cy="62" r="${R}"/><circle class="fg" cx="62" cy="62" r="${R}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - frac)).toFixed(1)}"/></svg>
          <div class="rv"><b class="num" id="wk-t">${restLeft}</b><small>descanso</small></div></div>
          <div class="row" style="justify-content:center;gap:10px;margin-top:14px"><button class="btn ghost sm" id="wk-p15">+15 s</button><button class="btn soft sm" id="wk-skip">Já descansei</button></div></div>`
        : `<div class="wk-sets">${Array.from({ length:e.sets }, (_, i) => `<span class="${i < set ? "dn" : i === set ? "on" : ""}">${i < set ? icon("check","xs") : i + 1}</span>`).join("")}</div>
          ${isTimed(e.reps) ? "" : (() => { const sug = suggestLoad(e.n, e.reps, e.sets), cs = (todayLog[e.n] || [])[set] || (todayLog[e.n] || [])[set - 1] || sug;
            return `<div class="wk-log"><label class="field"><span>Peso (kg)</span><input id="wk-kg" type="number" inputmode="decimal" step="0.5" min="0" max="400" value="${cs.kg ?? ""}" placeholder="peso do corpo"></label>
              <label class="field"><span>Repetições</span><input id="wk-rp" type="number" inputmode="numeric" min="0" max="100" value="${cs.reps ?? ""}"></label></div>
              <p class="small wk-sug">${icon("chart","xs")} ${esc(sug.txt)}</p>`; })()}
          ${e.info ? `<ol class="steps wk-tips">${e.info[1].map(x => `<li>${esc(x)}</li>`).join("")}</ol>` : `<p class="small muted" style="margin-top:14px">Movimento devagar e com controlo, sem dor.</p>`}`}
      <div style="flex:1;min-height:16px"></div>
      ${nx ? `<p class="small muted wk-next">A seguir: <b>${esc(nx.n)}</b> · ${esc(nx.reps)}</p>` : `<p class="small muted wk-next">Último exercício. Força!</p>`}
      <div class="row" style="gap:10px;margin-top:10px">${cur ? `<button class="btn ghost" id="wk-prev" aria-label="Exercício anterior">${icon("left","sm")}</button>` : ""}
        <button class="btn block grow" id="wk-go" style="height:56px" ${resting ? "disabled" : ""}>${set + 1 < e.sets ? `Série ${set + 1} feita` : nx ? "Exercício feito" : "Terminar treino"}</button>
        ${nx ? `<button class="btn ghost" id="wk-next" aria-label="Saltar exercício">${icon("right","sm")}</button>` : ""}</div>
      <p class="tiny muted" style="text-align:center;margin-top:10px">Se sentires dor (e não só esforço), para e troca o exercício no plano.</p></div>`;
    $("#wk-x", ov).onclick = async () => { if (await confirmDlg("Sair do treino? O que já fizeste fica guardado.", "Sair")) close(); };
    const p = $("#wk-prev", ov); if (p) p.onclick = () => { clearInterval(timer); restLeft = 0; cur--; set = 0; draw(); };
    const n = $("#wk-next", ov); if (n) n.onclick = () => { clearInterval(timer); restLeft = 0; cur++; set = 0; draw(); };
    const sk = $("#wk-skip", ov); if (sk) sk.onclick = () => { clearInterval(timer); restLeft = 0; draw(); };
    const p15 = $("#wk-p15", ov); if (p15) p15.onclick = () => { restLeft += 15; e.rest = Math.max(e.rest, restLeft); draw(); };
    $("#wk-go", ov).onclick = () => { snd("ok");
      const kgI = $("#wk-kg", ov), rpI = $("#wk-rp", ov);
      if (kgI && rpI) { const kg = clamp(Math.round((+kgI.value || 0) * 2) / 2, 0, 400), rp = clamp(Math.round(+rpI.value || 0), 0, 100);
        if (rp) (todayLog[e.n] = todayLog[e.n] || [])[set] = { kg, reps:rp }; }
      if (set + 1 < e.sets) { set++; if (e.rest) rest(e.rest); else draw(); return; }
      markEx(e.i); if (!nx) { finish(); return; } cur++; set = 0; if (e.rest) rest(e.rest); else draw(); };
  };
  const rest = s => { restLeft = s; draw(); clearInterval(timer);
    timer = setInterval(() => { restLeft--; if (restLeft <= 0) { clearInterval(timer); restLeft = 0; snd("ok"); if (navigator.vibrate) try { navigator.vibrate(200); } catch(e) {} draw(); return; }
      const t = $("#wk-t", ov); if (t) { t.textContent = restLeft; const fg = $(".wk-rest .fg", ov), C = 2 * Math.PI * 54; if (fg) fg.style.strokeDashoffset = (C * (1 - restLeft / Math.max(1, E[cur].rest))).toFixed(1); } }, 1000); };
  draw();
}

// Plano de treino a partir das respostas iniciais. Só pergunta o que falta (sítio do treino).
function customFromAnswers(){
  const u = S.u || {};
  if (!u.place) { openOnboarding(true, "gym"); return; }
  const d = Array.isArray(u.tdays) && u.tdays.length >= 2 && u.tdays.length <= 6 ? u.tdays : (u.gdaysSel && u.gdaysSel.length ? u.gdaysSel : [0, 2, 4]), p = S.prof;
  const pl = generatePlan({ place:u.place, days:d.length, dayIdx:d, equip:(u.equip || []).filter(x => x !== "Nenhum"), focus:u.focus || "todo", cardio:u.cardio || "caminhar", min:u.gmin || 30, lvl:u.lvl || "zero",
    goal:u.goal || "manter", lim:(u.lim || []).filter(x => x !== "Nenhuma"), bmi: validBody(p) && u.age === "18 ou mais" ? p.w / ((p.h / 100) ** 2) : 22, age: p.age || 30 });
  u.gym = "sim"; S.wk = { prog:"custom", custom:pl, days:pl.days.slice(), start:today(), done:{}, ex:{} }; save(); renderTreino(); toast("Plano de treino criado com as tuas respostas");
}
