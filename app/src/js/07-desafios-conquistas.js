/* ========================== Desafios diários ========================== */
const CHALLENGES = [
  { id:"agua6", n:"Bebe 6 copos de água", h:"Marca-se sozinho", auto:k => (S.water[k]||0) >= 6 },
  { id:"peq", n:"Regista o pequeno-almoço", h:"Marca-se sozinho", auto:k => (S.days[k]||[]).some(m => m.m === "Pequeno-almoço") },
  { id:"3ref", n:"Regista 3 refeições", h:"Marca-se sozinho", auto:k => new Set((S.days[k]||[]).map(m => m.m)).size >= 3 },
  { id:"fruta", n:"Come uma peça de fruta", h:"Toca para marcar" },
  { id:"legume", n:"Junta um legume a uma refeição", h:"Toca para marcar" },
  { id:"calma", n:"Faz uma refeição sem ecrãs", h:"Toca para marcar" },
  { id:"mexer", n:"Mexe-te 20 minutos", h:"Caminhar também conta. Toca para marcar" },
  { id:"planear", n:"Planeia uma refeição de amanhã", h:"Marca-se sozinho", auto:k => S.plan.some(x => x.date === addDays(k,1)) },
  { id:"nova", n:"Experimenta uma receita nova", h:"Toca para marcar" }
];
function todaysChallenges(k){ let h = 7; for (const ch of k) h = (h*31 + ch.charCodeAt(0)) >>> 0;
  const pool = CHALLENGES.slice(), out = []; while (out.length < 3) { h = (Math.imul(h, 1103515245) + 12345) >>> 0; out.push(pool.splice(h % pool.length, 1)[0]); } return out; }
const challengeDone = (c, k) => (S.ch[k]||[]).includes(c.id) || (c.auto ? c.auto(k) : false);
function syncChallenges(){ // cada desafio concluído hoje dá 1 giro, uma única vez
  const k = today(); S.chPaid[k] = S.chPaid[k] || []; let gained = 0, done = 0;
  for (const c of todaysChallenges(k)) if (challengeDone(c,k) && !S.chPaid[k].includes(c.id)) { S.chPaid[k].push(c.id); done++; if (S.spins < 3) { S.spins++; gained++; } }
  const old = Object.keys(S.chPaid).sort().slice(0, -40); old.forEach(d => delete S.chPaid[d]);
  if (done) { save(); say("challenge"); toast(gained ? (gained > 1 ? `Ganhaste ${gained} giros na roda` : "Desafio concluído: +1 giro na roda") : "Desafio concluído. Já tens 3 giros guardados."); ach("ch1"); }
}

/* ========================== Conquistas ========================== */
const ACH = [
  ["meal","Primeira refeição","Registaste a primeira refeição."],["water","Bem hidratado","Registaste água."],["plan","Semana organizada","Planeaste uma refeição."],
  ["fav","Receita guardada","Guardaste uma receita."],["cook","Mãos na massa","Fizeste uma receita."],["rexp","Explorador","Abriste 5 receitas diferentes."],
  ["photo","Olho clínico","Analisaste uma refeição por foto."],["wk1","Primeiro treino","Concluíste um treino."],["ch1","Desafiado","Concluíste um desafio diário."],
  ["spin","Sorte grande","Giraste a roda."],["gold","Prémio dourado","Completaste uma ronda de 3 tentativas."],["well","Atenção a ti","Registaste o teu bem-estar."],
  ["ask","Curioso","Fizeste uma pergunta ao Abi."]
];
// Conquistas aparecem num aviso discreto, para não interromper (as celebrações grandes ficam para prémios).
function ach(id){ if (S.ach[id]) return; const a = ACH.find(x => x[0] === id); if (!a) return; S.ach[id] = today(); save(); setTimeout(() => { toast("Conquista desbloqueada: " + a[1]); snd("win"); }, 900); }

