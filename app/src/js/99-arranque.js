/* ========================== Arranque ========================== */
function applyPrefs(){ const r = document.documentElement; if (S.theme) r.dataset.theme = S.theme; else r.removeAttribute("data-theme");
  if (S.accent) r.dataset.accent = S.accent; else r.removeAttribute("data-accent"); if (S.mot) r.dataset.motion = "low"; else r.removeAttribute("data-motion"); }
const RENDER = { hoje:renderHoje, planos:renderPlanos, receitas:renderReceitas, perfil:renderPerfil, roda:renderRoda };
function refreshAll(){ (RENDER[curTab] || renderHoje)(); }
load(); applyPrefs();
document.title = BRAND.name;
$$("[data-brand]").forEach(e => e.textContent = BRAND.name); $$("[data-tagline]").forEach(e => e.textContent = BRAND.tagline);
$("#sp-m").innerHTML = `<div class="mascots">${abi({ mood:"wave", size:120, acc:null })}${morango({ mood:"wink", size:130 })}</div>`;
ensurePlans(); syncChallenges(); renderHoje();
(() => { const sp = $("#splash");
  const end = () => { if (!sp.isConnected) return; sp.classList.add("out"); setTimeout(() => sp.remove(), 500); if (!S.ob) openOnboarding(false); else if (S.lastHello !== today()) { S.lastHello = today(); save(); setTimeout(() => say("hello", true), 900); } };
  const t = setTimeout(end, lowMotion() ? 200 : 1400); sp.onclick = () => { clearTimeout(t); end(); }; })();
// Se a app ficar aberta de um dia para o outro, passa para o dia novo.
let lastToday = today();
setInterval(() => { const t = today(); if (t !== lastToday) { if (curDay === lastToday) curDay = t; lastToday = t; syncChallenges(); refreshAll(); } }, 60000);