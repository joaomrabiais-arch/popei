/* ========================== UI comum ========================== */
let toastT;
function toast(m){ const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2600); }
let lastFocus = null;
function openSheet(title, html, mount){
  lastFocus = document.activeElement;
  $("#sheet-t").textContent = title; const b = $("#sheet-b"); b.innerHTML = html; b.scrollTop = 0; b.onclick = null;
  const sc = $("#scrim"); sc.classList.remove("hide"); requestAnimationFrame(() => { sc.classList.add("on"); $("#sheet").classList.add("on"); });
  if (mount) mount(b);
  setTimeout(() => $("#sheet-x").focus({ preventScroll:true }), 60);
}
function closeSheet(){ $("#sheet").classList.remove("on"); const sc = $("#scrim"); sc.classList.remove("on"); setTimeout(() => { if (!$("#sheet").classList.contains("on")) sc.classList.add("hide"); }, 300);
  if (lastFocus && lastFocus.isConnected && lastFocus.focus) lastFocus.focus({ preventScroll:true }); }
const sheetOpen = () => $("#sheet").classList.contains("on");
$("#scrim").onclick = closeSheet; $("#sheet-x").onclick = closeSheet;
document.addEventListener("keydown", e => { if (e.key === "Escape" && sheetOpen() && !$(".dialog") && !$(".celebrate")) closeSheet(); });
function confirmDlg(msg, yes="Confirmar"){ return new Promise(res => { const d = document.createElement("div"); d.className = "dialog";
  d.innerHTML = `<div class="card stack" role="alertdialog" aria-modal="true"><p>${esc(msg)}</p><div class="row"><button class="btn ghost grow" data-n>Cancelar</button><button class="btn grow" data-y>${esc(yes)}</button></div></div>`;
  document.body.appendChild(d); $("[data-y]", d).focus();
  d.onclick = e => { if (e.target.closest("[data-y]")) { d.remove(); res(true); } else if (e.target.closest("[data-n]") || e.target === d) { d.remove(); res(false); } }; }); }
function confetti(){ if (lowMotion()) return; const c = document.createElement("div"); c.className = "confetti"; c.setAttribute("aria-hidden","true");
  const cols = ["#2F6B3A","#F0734F","#D9A13B","#4FA7DC","#DCE9A9"];
  c.innerHTML = Array.from({ length:42 }, (_, i) => `<i style="left:${(rnd()*100).toFixed(1)}%;background:${cols[i%5]};animation-delay:${(rnd()*.5).toFixed(2)}s;animation-duration:${(1.8+rnd()).toFixed(2)}s"></i>`).join("");
  document.body.appendChild(c); setTimeout(() => c.remove(), 3500); }
function celebrate({ title, name, desc, mood="party", action, kind, onClose, who }){
  const d = document.createElement("div"); d.className = "celebrate";
  d.innerHTML = `<div class="card stack" role="alertdialog" aria-modal="true" aria-label="${esc(title)}">
    ${who === "abi" ? abi({ mood, size:150 }) : abi({ mood, size:100 })}<p class="small" style="font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:${kind === "gold" ? "var(--gold)" : "var(--brand)"}">${esc(title)}</p>
    <h2>${esc(name)}</h2><p class="muted">${esc(desc)}</p>
    ${action ? `<button class="btn block" data-a>${esc(action.label)}</button>` : ""}<button class="btn ${action ? "ghost" : ""} block" data-x>${action ? "Fechar" : "Boa!"}</button></div>`;
  document.body.appendChild(d); confetti(); setTimeout(() => burst($(".mwrap", d), who === "abi" ? "spark" : "heart"), 350); snd(kind === "gold" ? "gold" : "win"); $("[data-x]", d).focus();
  const close = () => { d.remove(); if (onClose) setTimeout(onClose, 200); };
  d.onclick = e => { if (e.target.closest("[data-a]")) { close(); action.fn(); } else if (e.target.closest("[data-x]") || e.target === d) close(); };
}
let ax;
function snd(kind){ if (!S.snd) return; try { ax = ax || new (window.AudioContext||window.webkitAudioContext)(); const t = ax.currentTime;
  const notes = { tick:[[1200,.03]], win:[[660,.12],[880,.2]], gold:[[660,.1],[880,.1],[1320,.3]], ok:[[700,.12]] }[kind] || [[600,.1]];
  let at = t; for (const [f, d] of notes) { const o = ax.createOscillator(), g = ax.createGain(); o.type = "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(.0001, at); g.gain.exponentialRampToValueAtTime(kind === "tick" ? .03 : .08, at+.01); g.gain.exponentialRampToValueAtTime(.0001, at+d);
    o.connect(g); g.connect(ax.destination); o.start(at); o.stop(at+d+.02); at += d*.8; } } catch(e) {} }

/* ========================== Navegação ========================== */
let curTab = "hoje", prevTab = "hoje";
function go(t){ if (t !== "roda") prevTab = t; curTab = t;
  $$(".view").forEach(v => v.classList.toggle("on", v.id === "v-"+t));
  $$(".nav .tab").forEach(b => b.classList.toggle("on", b.dataset.tab === (t === "roda" ? prevTab : t)));
  window.scrollTo(0,0); (RENDER[t] || (() => {}))(); }
document.addEventListener("click", e => {
  const t = e.target.closest("[data-tab]"); if (t) { if (t.dataset.sub) planSub = t.dataset.sub; if (sheetOpen()) closeSheet(); go(t.dataset.tab); return; }
  const g = e.target.closest("[data-go]"); if (g) { if (sheetOpen()) closeSheet(); go(g.dataset.go); return; }
  if (e.target.closest("[data-back]")) go(prevTab);
});
$("#nav-add").onclick = () => openAdd(defMeal());

/* ========================== Gráficos ========================== */
function lineChart(pts, { goal, unit="kg" } = {}){
  if (pts.length < 2) return `<div class="empty small">Regista o peso em pelo menos 2 dias para veres a evolução.</div>`;
  const W = 320, H = 150, P = 24, vals = pts.map(p => p[1]).concat(goal ? [goal] : []);
  const mn = Math.min(...vals) - .5, mx = Math.max(...vals) + .5, X = i => P + i * (W - 2*P) / (pts.length - 1), Y = v => H - P - (v - mn) / (mx - mn) * (H - 2*P);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(p[1]).toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução do peso">
    <path d="${d} L${X(pts.length-1).toFixed(1)} ${H-P} L${P} ${H-P}Z" fill="var(--brand-soft)" opacity=".8"/>
    ${goal ? `<line x1="${P}" x2="${W-P}" y1="${Y(goal).toFixed(1)}" y2="${Y(goal).toFixed(1)}" stroke="var(--accent)" stroke-dasharray="4 4" stroke-width="1.5"/><text x="${W-P}" y="${(Y(goal)-6).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--accent)">objetivo ${goal} ${unit}</text>` : ""}
    <path d="${d}" fill="none" stroke="var(--brand)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" class="draw"/>
    ${pts.map((p, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="${i === pts.length-1 ? 4.5 : 2.5}" fill="${i === pts.length-1 ? "var(--brand)" : "var(--surface)"}" stroke="var(--brand)" stroke-width="1.5"/>`).join("")}
    <text x="${P}" y="${H-6}" font-size="10" fill="var(--muted)">${pts[0][0].slice(8)}/${pts[0][0].slice(5,7)}</text><text x="${W-P}" y="${H-6}" text-anchor="end" font-size="10" fill="var(--muted)">${last[0].slice(8)}/${last[0].slice(5,7)}</text>
    <text x="${X(pts.length-1).toFixed(1)}" y="${(Y(last[1])-10).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink)">${String(last[1]).replace(".",",")}</text></svg>`;
}
function barChart(vals, labels, { goal, cls="" } = {}){
  const W = 320, H = 150, P = 18, mx = Math.max(...vals, goal || 0, 1) * 1.1, bw = (W - 2*P) / vals.length;
  const Y = v => H - 22 - v / mx * (H - 40);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">
    ${goal ? `<line x1="${P}" x2="${W-P}" y1="${Y(goal).toFixed(1)}" y2="${Y(goal).toFixed(1)}" stroke="var(--faint)" stroke-dasharray="4 4"/>` : ""}
    ${vals.map((v, i) => { const x = P + i*bw + bw*.18, w = bw*.64, y = Y(v); return `<rect class="grow-bar" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(2, H-22-y).toFixed(1)}" rx="5" fill="${cls === "soft" ? "var(--brand-2)" : (goal && v > goal * 1.15 ? "var(--brand-2)" : "var(--brand)")}" style="animation-delay:${i*40}ms"/>
      ${v ? `<text x="${(x + w/2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="9.5" fill="var(--muted)">${v}</text>` : ""}<text x="${(x + w/2).toFixed(1)}" y="${H-6}" text-anchor="middle" font-size="10" fill="var(--faint)">${labels[i]}</text>`; }).join("")}</svg>`;
}
function logWeight(kg){ kg = Math.round(clamp(+kg, 30, 250) * 10) / 10; if (!(+kg > 30)) return false; (S.weights = S.weights || {})[today()] = kg; S.prof.w = kg; applyRef(); save(); say("weight", true); return true; }
function openSummary(){
  const ds = Array.from({ length:7 }, (_, i) => addDays(today(), i-6)), lab = ds.map(k => DOW[dow(k)].slice(0,3));
  const kc = ds.map(k => dayTotals(k).k), wa = ds.map(k => S.water[k] || 0), logged = ds.filter(k => (S.days[k]||[]).length).length;
  const wk = ds.filter(workoutDone).length, chd = ds.reduce((a, k) => a + (S.chPaid[k] || []).length, 0);
  const tot = ds.reduce((a, k) => { const t = dayTotals(k); return { p:a.p+t.p, c:a.c+t.c, g:a.g+t.g }; }, { p:0, c:0, g:0 }), en = tot.p*4 + tot.c*4 + tot.g*9 || 1;
  const pc = [["Proteína", tot.p*4/en, "var(--brand)"], ["Hidratos", tot.c*4/en, "var(--brand-2)"], ["Gordura", tot.g*9/en, "var(--brand-3)"]];
  const W = Object.entries(S.weights || {}).sort(([a],[b]) => a < b ? -1 : 1).slice(-30), first = W[0], last = W[W.length-1];
  const line = logged >= 5 ? ["abi","Semana muito consistente. Estou orgulhoso!","party"] : logged >= 2 ? ["abi","Boa semana. Cada registo ajuda-te a conhecer-te melhor.","happy"] : ["abi","Uma semana mais calma também conta. Estou aqui quando quiseres.","happy"];
  openSheet("Progresso", `<div class="card row">${abi({ mood:line[2], size: line[0] === "abi" ? 60 : 44 })}<p>${line[1]}</p></div>
    <div class="stat3" style="margin-top:12px"><div><b>${logged}/7</b><small>dias com registo</small></div><div><b>${wk}</b><small>treinos</small></div><div><b>${chd}</b><small>desafios</small></div></div>
    ${isMinor() ? "" : `<div class="card" style="margin-top:16px"><div class="row between"><h3>Peso</h3>${last && first !== last ? `<span class="small muted">${(last[1]-first[1] > 0 ? "+" : "") + (last[1]-first[1]).toFixed(1).replace(".",",")} kg desde ${first[0].slice(8)}/${first[0].slice(5,7)}</span>` : ""}</div>
      <div style="margin-top:8px">${lineChart(W, { goal: S.u && S.u.tw ? +S.u.tw : null })}</div>
      <div class="row" style="margin-top:10px"><input id="pw-in" type="number" inputmode="decimal" step="0.1" min="30" max="250" placeholder="Peso de hoje (kg)" value="${(S.weights||{})[today()] || ""}" aria-label="Peso de hoje"><button class="btn" id="pw-ok">Registar</button></div>
      <p class="tiny muted" style="margin-top:8px">Pesa-te à mesma hora, uma ou duas vezes por semana. O peso varia de dia para dia, e é normal.</p></div>`}
    ${kcalOn() ? `<div class="card" style="margin-top:12px"><div class="row between"><h3>Energia</h3><span class="small muted">média ${Math.round(kc.reduce((a,b) => a+b, 0) / Math.max(1, kc.filter(Boolean).length))} kcal</span></div>${barChart(kc, lab, { goal:S.goal })}<p class="tiny muted">A linha tracejada é a tua referência.</p></div>` : ""}
    <div class="card" style="margin-top:12px"><h3>Equilíbrio da semana</h3><div class="stackbar" style="margin-top:12px">${pc.map(x => `<i style="width:${(x[1]*100).toFixed(1)}%;background:${x[2]}"></i>`).join("")}</div>
      <div class="row between small" style="margin-top:8px">${pc.map(x => `<span><span class="dot" style="background:${x[2]}"></span>${x[0]} ${Math.round(x[1]*100)}%</span>`).join("")}</div></div>
    <div class="card" style="margin-top:12px"><h3>Água (copos)</h3>${barChart(wa, lab, { goal:S.wg, cls:"soft" })}</div>
    <p class="tiny muted" style="margin-top:12px">Sem "bom" nem "mau": serve só para veres padrões.</p>`, b => {
    if ($("#pw-ok", b)) $("#pw-ok", b).onclick = () => { if (!logWeight($("#pw-in", b).value)) { toast("Indica um peso entre 30 e 250 kg"); return; } openSummary(); };
  });
}

