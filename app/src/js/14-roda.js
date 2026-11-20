/* ========================== RODA ========================== */
const wheelItems = () => REWARDS.concat(DISCOUNTS.filter(d => d.code && d.partner && d.expires));
function wheelSegments(mini){ const W = wheelItems(), n = W.length, a = 360/n;
  return W.map((w, i) => { const rad = deg => (deg - 90) * Math.PI/180, s = rad(i*a - a/2), e = rad(i*a + a/2);
    const x1 = 100+98*Math.cos(s), y1 = 100+98*Math.sin(s), x2 = 100+98*Math.cos(e), y2 = 100+98*Math.sin(e);
    const ic = { acc:"sparkle", theme:"brush", recipes:"book", badge:"star", discount:"gift", prodisc:"gift" }[w.type] || "gift";
    return `<path d="M100 100L${x1.toFixed(2)} ${y1.toFixed(2)}A98 98 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z" fill="${w.color}" stroke="#fff" stroke-width="${mini ? 3 : 2}"/>`
      + (mini ? "" : `<g transform="rotate(${i*a} 100 100)"><use href="#i-${ic}" x="89" y="16" width="22" height="22" stroke="#fff" fill="none" style="stroke-width:2.2"/><text x="100" y="52" ${(i*a) > 90 && (i*a) < 270 ? 'transform="rotate(180 100 49)" ' : ""}text-anchor="middle" font-family="DM Sans,sans-serif" font-weight="700" font-size="8.5" fill="#fff">${esc(w.name.split(" ")[0])}</text></g>`); }).join("")
    + `<circle cx="100" cy="100" r="98" fill="none" stroke="#F7F4ED" stroke-width="3"/>`; }
let wheelAngle = 0, spinning = false;
const nextGolden = () => GOLDEN[Math.min(S.golden, GOLDEN.length-1)];
function renderRoda(){
  const W = wheelItems(), tot = W.reduce((a, w) => a + w.weight, 0), g = nextGolden();
  const rot = $("#w-rot"); if (!rot.childElementCount) { rot.innerHTML = wheelSegments(false); rot.style.transform = `rotate(${wheelAngle}deg)`; }
  $("#w-hub").innerHTML = abi({ mood: spinning ? "wow" : "wink", size:50 });
  $("#w-tries").innerHTML = [0,1,2].map(i => `<i class="${i < S.round ? "on" : ""}"></i>`).join("") + `<span class="gp ${S.round >= 2 ? "lit" : ""}" title="Prémio dourado">${icon("crown","xs")}</span>`;
  $("#w-sub").innerHTML = `Tentativa <b>${Math.min(S.round+1, 3)} de 3</b> desta ronda · Giros disponíveis: <b>${S.spins}</b><br>No fim das 3 tentativas recebes, garantido: <b style="color:var(--gold)">${esc(g.name)}</b>`;
  $("#w-odds").innerHTML = W.map(w => `<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${w.color};margin-right:8px"></span>${esc(w.name)}</td><td>${(w.weight/tot*100).toLocaleString("pt-PT", { maximumFractionDigits:1 })}% por giro</td></tr>`).join("")
    + `<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--gold);margin-right:8px"></span><b>${esc(g.name)}</b> (no fim da ronda)</td><td><b style="color:var(--gold)">Garantido</b></td></tr>`;
  $("#w-disc").textContent = DISCOUNTS.length ? "Descontos de parceiros: válidos só nas condições e até à data indicadas em cada prémio." : "Ainda não há descontos de parceiros na roda. Só vão aparecer quando houver acordos reais, com condições e validade indicadas.";
  const sb = $("#w-spin"); sb.disabled = spinning || !S.spins; sb.textContent = spinning ? "A girar…" : S.spins ? "Girar" : "Sem giros · conclui desafios";
  $("#w-snd").innerHTML = icon(S.snd ? "sound" : "mute"); $("#w-snd").setAttribute("aria-label", S.snd ? "Desligar som" : "Ligar som");
}
$("#w-snd").onclick = () => { S.snd = !S.snd; save(); renderRoda(); if (S.snd) snd("ok"); };
$("#w-spin").onclick = () => {
  if (spinning || !S.spins) return;
  const W = wheelItems(), tot = W.reduce((a, w) => a + w.weight, 0), a = 360/W.length;
  // 1) Sorteio real, com as probabilidades mostradas.
  let r = rnd() * tot, idx = 0; for (; idx < W.length - 1; idx++) { r -= W[idx].weight; if (r < 0) break; }
  const prize = W[idx];
  // 2) A animação só mostra o resultado já sorteado (ponteiro no topo = 0°).
  const target = (360 - idx*a + (rnd() - .5) * a * .7) % 360;
  wheelAngle = wheelAngle - (((wheelAngle % 360) + 360) % 360) + 360*6 + target;
  spinning = true; S.spins--; S.round++; save(); renderRoda();
  const rot = $("#w-rot"); rot.style.transition = lowMotion() ? "none" : ""; requestAnimationFrame(() => rot.style.transform = `rotate(${wheelAngle}deg)`);
  let ticks = 0; const tk = setInterval(() => { if (++ticks > 28) clearInterval(tk); snd("tick"); }, 140);
  setTimeout(() => { clearInterval(tk); spinning = false;
    const goldNow = S.round >= 3 ? nextGolden() : null;
    if (goldNow) { S.round = 0; S.golden++; }
    save(); renderRoda(); renderRewardBanner(); ach("spin");
    grant(prize, false, goldNow ? () => { grant(goldNow, true); ach("gold"); } : null);
  }, lowMotion() ? 250 : 4750);
};
function grant(p, gold, after){
  if (p.type === "prodisc") { const better = p.pct > (S.proDisc || 0); if (better) S.proDisc = p.pct; save();
    celebrate({ who:"abi", title:"Saiu na roda", name:`${p.pct}% de desconto no ${BRAND.name} Pro`, desc: better ? `Fica guardado: no primeiro ano pagas ${eurPro(PRO.price * (1 - p.pct / 100))} por mês em vez de ${eurPro(PRO.price)} (${PRO.note}). Não expira e não precisas de fazer nada agora.` : `Já tinhas ${S.proDisc}%, que é melhor. Fica esse, porque os descontos não acumulam.`, mood:"party", action:{ label:"Ver o Pro", fn:openPro }, onClose: after || undefined }); return; }
  const repeatable = p.id === "gold_badge" || p.type === "discount";
  const dup = S.owned.includes(p.id) && !repeatable;
  if (!S.owned.includes(p.id)) S.owned.push(p.id);
  if (p.id === "gold_badge") S.goldBadges = (S.goldBadges || 0) + 1;
  save();
  const action = dup ? null : p.type === "acc" ? { label:`Vestir no ${BRAND.mascot}`, fn:() => { S.equip = p.id; save(); toast(`O ${BRAND.mascot} adorou`); refreshAll(); } }
    : p.type === "theme" ? { label:"Usar este tema", fn:() => { S.accent = p.accent; save(); applyPrefs(); toast("Tema aplicado"); } }
    : p.type === "recipes" ? { label:"Ver receitas", fn:() => { rFilter = "Todas"; go("receitas"); } } : null;
  const desc = dup ? "Repetido: já tinhas este prémio. Continua a jogar para completar a coleção."
    : p.desc + (p.type === "discount" ? ` Código: ${p.code}. Válido até ${p.expires}. ${p.terms || ""}` : "");
  celebrate({ who:"abi", title: gold ? "Prémio dourado · garantido" : "Saiu na roda", name:p.name, desc, mood:"party", kind: gold ? "gold" : "",
    action: action && after ? { label:action.label, fn:() => { action.fn(); setTimeout(after, 300); } } : action,
    onClose: after || undefined });
}


// AvocoraFit Pro: o que é, quanto vai custar e o desconto ganho. Ainda não há pagamentos: nada aqui finge que se pode comprar.
const eurPro = v => v.toLocaleString("pt-PT", { minimumFractionDigits:2, maximumFractionDigits:2 }) + " €";
function openPro(){
  const d = S.proDisc || 0, p = PRO.price, withD = p * (1 - d / 100);
  openSheet(`${BRAND.name} Pro`, `<div class="pro-hero">${abi({ mood:"party", size:84, acc:"acc_coroa" })}<div><b>Mais fotos, planos mais longos e os teus dados seguros</b><p class="small muted">O essencial continua grátis. O Pro é para quem quer mais.</p></div></div>
    <table class="pro-cmp" style="margin-top:14px"><thead><tr><th></th><th>Grátis</th><th>Pro</th></tr></thead><tbody>
      ${[["camera","Análise de fotos com IA","3 por dia","20 por dia"],["cal","Plano de refeições automático","1 semana","4 semanas"],["cart","Lista de compras","✓","✓"],
         ["dumbbell","Treino guiado com progressão","✓","✓"],["chart","Histórico e tendências","30 dias","Sempre"],["upload","Cópia na nuvem e vários aparelhos","—","✓"]]
        .map(([i, t, f, p]) => `<tr><td>${icon(i,"xs")}<span>${t}</span></td><td>${f}</td><td><b>${p}</b></td></tr>`).join("")}</tbody></table>
    <p class="tiny muted" style="margin-top:6px">Como vai ficar quando o Pro abrir (previsto). Os limites do plano grátis ainda não estão ativos.</p>
    <div class="pro-price"><div><small class="muted">Preço por mês</small>${d ? `<s class="muted">${eurPro(p)}</s> <b>${eurPro(withD)}</b>` : `<b>${eurPro(p)}</b>`}</div>${d ? `<span class="pro-tag">-${d}% no 1.º ano</span>` : ""}</div>
    <p class="tiny muted" style="margin-top:8px">${esc(PRO.note[0].toUpperCase() + PRO.note.slice(1))}. As funções gratuitas continuam gratuitas.</p>
    <div class="note" style="margin-top:14px">${icon("info","sm")}<span>Ainda não é possível subscrever: o Pro está a ser preparado. ${d ? `O teu desconto de ${d}% fica guardado neste aparelho e não expira.` : "Gira a roda para ganhar um desconto para quando abrir."}</span></div>
    <button class="btn soft block" id="pro-wheel" style="margin-top:14px">${icon("gift","sm")} Ir à roda de descontos</button>`, b => {
    $("#pro-wheel", b).onclick = () => { closeSheet(); go("roda"); };
  });
}
