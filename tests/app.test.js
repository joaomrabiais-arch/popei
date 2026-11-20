// Teste de ponta a ponta da app (app/index.html) com Playwright. Uso: npm run test:app
// Percorre os fluxos principais num ecrã de telemóvel e guarda capturas em app/capturas/.
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
const URL = "file://" + path.resolve(__dirname, "../app/index.html");
const OUT = path.resolve(__dirname, "../app/capturas");
let fails = 0, passes = 0;
const ok = (c, m) => { if (c) passes++; else { fails++; console.error("  ✗ " + m); } };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !/fonts\.(googleapis|gstatic)|fotos\.js|ERR_FILE_NOT_FOUND/.test(m.text())) errors.push(m.text()); });
  const shot = n => page.screenshot({ path: path.join(OUT, n + ".png") });
  const closeCel = async () => { while (await page.isVisible(".celebrate")) { await page.click(".celebrate [data-x]"); await page.waitForTimeout(450); } };
  const sheetClose = async () => { await page.click("#sheet-x"); await page.waitForTimeout(400); };
  const state = () => page.evaluate(() => JSON.parse(localStorage.getItem("brota_v1")));

  // 1. Primeira abertura: splash + onboarding
  await page.goto(URL); await page.waitForTimeout(500); await shot("01-abertura");
  await page.waitForTimeout(1500);
  ok(await page.isVisible("#ob"), "onboarding visível na primeira abertura");
  await page.fill("#ob-n", "Joana"); await shot("02-onboarding");
  await page.click("#ob-n2");
  await page.fill("#ob-age", "30"); await page.click("#ob-n2");
  await page.click('.opt[data-o="manter"]'); await page.click("#ob-n2");
  await page.fill("#ob-h", "170"); await page.fill("#ob-w", "70"); await shot("02b-dados"); await page.click("#ob-n2");
  ok(/kcal\/dia/.test(await page.textContent(".ob-week")), "faixa da semana mostra energia depois dos dados");
  // Refeições, porções, alimentação, cozinha, em casa, treino; orçamento e supermercado saltados
  const steps = ["1.375", "normal", "PEOPLE", "Nenhuma", "Como de tudo", "Cogumelos", ["Pequeno-almoço","Almoço","Lanche","Jantar"], "dobro", "30", "portuguesa", "equilibrado", "TASTE",
    "DIAS", "sim", "casa", "Nenhum", "30", "zero", "todo", "caminhar", "Joelhos", "SKIP", ["Arroz","Azeite"], "SKIP"];
  for (const opt of steps) {
    if (opt === "DIAS") { for (const d of [0, 2, 4]) await page.click(`#ob-days [data-i="${d}"]`); await shot("02d-dias"); }
    else if (opt === "SKIP") { await page.click("#ob-skip"); continue; }
    else if (opt === "PEOPLE") { await page.click('[data-pp="1"]'); await shot("02g-pessoas"); }
    else if (opt === "TASTE") { const tg = i => page.click(`.tgrid .tg >> nth=${i}`); await tg(0); await tg(0); await tg(1); await tg(2); await tg(2); await tg(2); await shot("02h-ensinar"); }
    else for (const o of [].concat(opt)) await page.click(`.opt[data-o="${o}"]`);
    if (opt === "dobro") await shot("02e-cozinha"); if (opt === "30") await shot("02i-tempo");
    await page.click("#ob-n2");
  }
  await page.waitForTimeout(200); await shot("02c-referencia");
  ok(/kcal/.test(await page.textContent("#ob-in")) && /Hoje no teu plano/.test(await page.textContent("#ob-in")), "ecrã final mostra a referência e o plano de hoje");
  await page.click("#ob-n2");
  await page.waitForTimeout(600);
  ok(await page.isVisible(".celebrate"), "presente de boas-vindas aparece");
  await shot("03-boas-vindas"); await closeCel();
  await page.waitForTimeout(1200); ok(await page.isVisible("#tour-skip"), "tutorial aparece depois do onboarding"); await shot("03b-tutorial"); await page.click("#tour-skip"); await page.waitForTimeout(200);
  let st = await state();
  ok(st.u.name === "Joana" && st.spins === 3, "perfil e 3 giros guardados");
  ok(st.goal >= 1800 && st.goal <= 2400 && st.macro && st.macro.p > 0 && st.u.age === "18 ou mais", "referência e macros calculados (" + st.goal + " kcal, " + JSON.stringify(st.macro) + ")");
  ok(JSON.stringify(st.u.tdays) === "[0,2,4]" && st.u.cstyle === "dobro" && st.u.pmeals.length === 4 && !st.u.budget && st.u.people === 2 && Object.keys(st.u.taste).length === 3, "respostas da personalização guardadas (pessoas e gosto incluídos)");
  ok(await page.evaluate(() => { const bad = +Object.keys(S.u.taste).find(k => S.u.taste[k] === -1); return !S.plan.some(x => x.r === bad); }), "o prato que a pessoa passou não aparece no plano");
  ok(st.plan.length >= 4 && st.plan.every(x => x.a) && (st.plan.some(x => x.lo) || new Set(st.plan.map(x => x.date)).size < 2), "plano criado logo, com sobras do jantar no almoço seguinte");
  ok(!st.plan.some(x => x.r === 9), "plano sem o que a pessoa não gosta (cogumelos)");
  ok(await page.evaluate(() => !CHALLENGES.find(c => c.id === "planear").auto(today())), "o plano automático não completa o desafio de planear");
  ok(await page.evaluate(() => { const P = planPrefs(), mon = mondayOf(today()), ref = refNow(), tr = dayTarget(P, mon, ref), rest = dayTarget(P, addDays(mon, 1), ref);
    return tr.tr && tr.kcal > rest.kcal && tr.p > rest.p; }), "dias de treino com mais energia e proteína");
  const fit = await page.evaluate(() => { const P = planPrefs(), mon = mondayOf(today()), ref = refNow(), E = genWeek(P, mon, addDays(mon, 6), { ref });
    const k = E.reduce((a, x) => a + planKcal(x), 0) / 7, p = E.reduce((a, x) => a + planProt(x), 0) / 7; return { k: k / ref.kcal, p: p / ref.p }; });
  ok(fit.k > .88 && fit.k < 1.12 && fit.p > .85 && fit.p < 1.45, "plano perto da referência de energia e proteína (" + JSON.stringify(fit) + ")");
  ok(await page.evaluate(() => { const P = planPrefs(), mon = mondayOf(today()), sun = addDays(mon, 6), ref = refNow(), free = planCost(genWeekFit(P, mon, sun, { ref }), P.home);
    const tight = planCost(genWeekFit(Object.assign({}, P, { budget: Math.round(free * .6) }), mon, sun, { ref }), P.home); return free > 10 && tight < free; }), "com orçamento apertado o plano fica mais barato");
  ok(await page.evaluate(() => { const P = Object.assign(planPrefs(), { style:"batch" }), E = genWeek(P, mondayOf(today()), addDays(mondayOf(today()), 6), { ref:refNow() });
    return E.filter(x => x.bt).length >= 10 && new Set(E.filter(x => x.bt).map(x => x.r)).size <= 4; }), "cozinhar em quantidade repete poucos pratos ao longo da semana");

  // 2. Adicionar por pesquisa e manual
  await page.click('[data-add="Pequeno-almoço"]'); await page.waitForTimeout(400);
  await page.click('#a-tabs [data-t="pesq"]'); await page.fill("#a-q", "aveia");
  await page.click('.food[data-f="Flocos de aveia"]'); await page.click("#a-ok"); await page.waitForTimeout(500); await closeCel();
  await page.click('[data-add="Almoço"]'); await page.waitForTimeout(400);
  await page.click('#a-tabs [data-t="manual"]'); await page.fill("#m-n", "Bacalhau com grão"); await page.fill("#m-k", "550"); await page.fill("#m-p", "40");
  await page.click("#m-ok"); await page.waitForTimeout(500); await closeCel();
  st = await state();
  const k = Object.keys(st.days)[0];
  ok(st.days[k].length === 2 && st.days[k][0].k === 156, "2 refeições guardadas, aveia 40 g = 156 kcal");

  // 3. Água
  for (let i = 0; i < 3; i++) { await page.click("#w-plus"); await page.waitForTimeout(150); await closeCel(); }
  st = await state();
  ok(st.water[k] === 3, "3 copos de água");
  await shot("04-hoje");
  await page.screenshot({ path: path.join(OUT, "04-hoje-completo.png"), fullPage: true });

  // 4. Editar refeição
  await page.click(".meal-items button >> nth=0"); await page.waitForTimeout(400);
  await page.fill("#e-k", "200"); await page.click("#e-ok"); await page.waitForTimeout(400);
  st = await state();
  ok(st.days[k].some(m => m.k === 200), "edição de refeição guardada");

  // 5. Foto sem IA: mostra aviso honesto
  await page.click("#nav-add"); await page.waitForTimeout(600);
  ok(/precisa do Claude ou do servidor/.test(await page.textContent("#a-body")), "aviso de IA indisponível fora do Claude");
  // 5b. Foto com IA simulada: números em texto, porções, estado de espera e tempo limite
  await shot("05-adicionar-foto"); await sheetClose();
  const foto = async impl => page.evaluate(async impl => { sample = eval(impl); document.querySelectorAll(".dialog,.celebrate").forEach(x => x.remove()); openAdd("Almoço"); await new Promise(r => setTimeout(r, 150));
    const c = document.createElement("canvas"); c.width = c.height = 20; const b = await new Promise(r => c.toBlob(r, "image/jpeg")); const dt = new DataTransfer(); dt.items.add(new File([b], "x.jpg", { type:"image/jpeg" }));
    const f = document.getElementById("f-gal"); f.files = dt.files; f.dispatchEvent(new Event("change")); await new Promise(r => setTimeout(r, 300)); document.getElementById("a-go").click(); }, impl);
  await foto(`(() => { const f = async () => ({ text:"" }); f.json = async () => ({ refeicao:"Arroz com frango", clara:true, itens:[{ nome:"Arroz", porcao:"150 g", kcal:"195 kcal", proteina_g:"4 g", carbo_g:"42", gordura_g:"0,5", confianca:"alta" }, { nome:"Frango", porcao:"120 g", kcal:198, proteina_g:37, carbo_g:0, gordura_g:4, confianca:"media" }] }); return f; })()`);
  await page.waitForTimeout(500); await shot("05b-foto-resultado");
  ok(/393 kcal/.test(await page.textContent("#a-tot")), "números em texto da IA viram números (195 kcal + 198)");
  await page.click('[data-dx="1"][data-i="0"]'); await page.waitForTimeout(150);
  ok(/491 kcal/.test(await page.textContent("#a-tot")), "mais meia porção recalcula o total");
  await sheetClose();
  await foto(`(() => { const f = async () => ({ text:"" }); f.json = () => new Promise(() => {}); return f; })()`);
  await page.waitForTimeout(400); await shot("05c-foto-a-analisar");
  ok(await page.isVisible("#a-cancel"), "análise mostra estado e botão de cancelar");
  await page.click("#a-cancel"); await sheetClose();
  ok(await page.evaluate(async () => { try { await withTimeout(new Promise(() => {}), 50); return false; } catch(e) { return e.code === "timeout"; } }), "a análise tem tempo limite");
  await page.evaluate(() => { sample = null; });
  // 5c. Pesquisa sem acentos e com receitas
  await page.click('[data-add="Lanche"]'); await page.waitForTimeout(400); await page.click('#a-tabs [data-t="pesq"]'); await page.fill("#a-q", "maca");
  ok(/Maçã/.test(await page.textContent("#a-fl")), "pesquisa sem acentos encontra maçã");
  await page.fill("#a-q", "sopa"); await page.waitForTimeout(100); ok((await page.$$("#a-fl [data-r]")).length >= 3, "pesquisa mostra receitas");
  await shot("05d-pesquisa"); await sheetClose();
  // (captura 05 tirada antes do bloco 5b)

  // 6. Receitas
  await page.click('.nav [data-tab="receitas"]'); await page.waitForTimeout(400); await shot("06-receitas");
  await page.click('#r-f [data-f="Vegan"]'); await page.waitForTimeout(200);
  ok((await page.$$("#r-l [data-r]")).length >= 3, "filtro vegan mostra receitas");
  await page.click('#r-f [data-f="Todas"]'); await page.click("#r-l [data-r] >> nth=0"); await page.waitForTimeout(400); await shot("07-receita");
  await page.click("#rc-shop"); await page.waitForTimeout(200); await sheetClose();

  // 7. Planos: semana, mês, treino, compras
  await page.click('.nav [data-tab="planos"]'); await page.waitForTimeout(300);
  await page.waitForTimeout(300); ok(!(await page.isVisible("#pl-auto")), "sem botão de criar plano: o plano faz-se sozinho");
  st = await state();
  const left = await page.evaluate(() => 7 - dow(today())); // o plano é feito de hoje até domingo
  ok(st.plan.length >= left * 3 && st.plan.some(x => x.x && x.x !== 1), "plano da semana à medida, com porções ajustadas (" + st.plan.length + " refeições, " + left + " dias)");
  await shot("08-plano-semana");
  await page.click('[data-v="mes"]'); await page.waitForTimeout(300); await shot("09-plano-mes");
  await page.click('#p-seg [data-s="treino"]'); await page.waitForTimeout(300); await shot("10-treino-escolher");
  const plan = await page.evaluate(() => S.wk && S.wk.custom);
  ok(plan && plan.s.length === 3 && plan.days.length === 3, "plano personalizado com 3 treinos por semana");
  const exs = plan ? plan.s.flatMap(x => x.e.map(e => e[0])).join("|") : "";
  ok(!/Lunges|Agachamento com|salto/i.test(exs) && /Ponte de glúteos|Sentar e levantar/.test(exs), "plano poupa os joelhos (" + exs + ")");
  ok(await page.evaluate(() => { const a = generatePlan({ place:"gym", days:4, min:60, lvl:"regular", goal:"musculo" }), b = generatePlan({ place:"casa", days:2, min:20, lvl:"zero", goal:"perder", bmi:32 });
    return a.s.length === 4 && a.s[0].e.length > b.s[0].e.length && /4 ×/.test(a.s[0].e[1][1]) && /2 ×/.test(b.s[0].e[1][1]) && b.s[0].e.some(e => /Caminhada/.test(e[0])); }), "planos diferentes para pessoas diferentes");
  await page.evaluate(() => { const d = (new Date().getDay()+6)%7; if (!S.wk.days.includes(d)) S.wk.days.push(d); save(); renderTreino(); }); await page.waitForTimeout(300);
  await page.click("[data-ex] >> nth=0"); await page.waitForTimeout(200);
  await page.click("[data-fin] >> nth=0"); await page.waitForTimeout(500); await closeCel();
  st = await state();
  ok(st.wk && Object.keys(st.wk.done).length === 1, "treino concluído guardado");
  // 7b. Treino guiado: séries, descanso e fim
  await page.evaluate(() => { delete S.wk.done[today()]; S.wk.ex = {}; save(); renderTreino(); }); await page.waitForTimeout(200);
  await shot("11b-treino-hoje");
  await page.click("[data-start]"); await page.waitForTimeout(300); await shot("11c-treino-guiado");
  await page.click("#wk-go"); await page.waitForTimeout(200);
  if (await page.isVisible("#wk-skip")) { await shot("11d-descanso"); await page.click("#wk-skip"); }
  for (let i = 0; i < 80 && await page.isVisible("#wk-go"); i++) { if (await page.isVisible("#wk-skip")) await page.click("#wk-skip"); else await page.click("#wk-go"); await page.waitForTimeout(40); }
  await page.waitForTimeout(400); await shot("11e-treino-fim");
  ok(await page.evaluate(() => !!S.wk.done[today()]), "treino guiado termina e fica concluído");
  await page.click("#wk-ok"); await page.waitForTimeout(300); await closeCel();
  await shot("11-treino");
  await page.click('#p-seg [data-s="compras"]'); await page.waitForTimeout(300); await shot("12-compras");
  ok((await page.$$(".shop-item")).length >= 3, "lista de compras com ingredientes da receita");

  // 7c. O dia em detalhe
  await page.click('.nav [data-tab="hoje"]'); await page.waitForTimeout(300); await page.click("#h-detail"); await page.waitForTimeout(400); await shot("04b-dia-detalhe");
  ok(await page.isVisible(".dtable") && (await page.$$(".split")).length === 2, "detalhe do dia com divisão da energia e tabela");
  await sheetClose();
  // 8. Roda: 3 tentativas e prémio dourado garantido
  await page.evaluate(() => { S.mot = true; save(); applyPrefs(); });
  await page.click('.nav [data-tab="hoje"]'); await page.click("#h-gift"); await page.waitForTimeout(400);
  await shot("13-roda");
  const t = await page.textContent("#w-odds");
  ok(/Garantido/.test(t) && /%/.test(t), "probabilidades e prémio garantido visíveis");
  for (let i = 0; i < 3; i++) {
    await page.click("#w-spin"); await page.waitForTimeout(700);
    if (i === 0) await shot("14-premio");
    await closeCel();
  }
  st = await state();
  ok(st.spins === 0 && st.round === 0 && st.golden === 1 && st.owned.includes("acc_coroa"), "3 giros gastos, coroa dourada atribuída (" + JSON.stringify({ s:st.spins, r:st.round, g:st.golden, o:st.owned }) + ")");

  // 9. Perfil e armário
  await page.click('.nav [data-tab="perfil"]'); await page.waitForTimeout(300); await shot("15-perfil");
  await page.click('#pf-menu [data-m="1"]'); await page.waitForTimeout(400);
  await page.click('.closet [data-a="acc_coroa"]'); await page.waitForTimeout(300); await shot("16-armario");
  ok(await page.evaluate(() => S.equip === "acc_coroa"), "coroa vestida no Abi"); await sheetClose();
  await page.click('#pf-menu [data-m="2"]'); await page.waitForTimeout(400); await shot("17-resumo"); await sheetClose();

  await page.click('#pf-menu [data-m="6"]'); await page.waitForTimeout(400); await shot("17b-preferencias-plano");
  await page.click('[data-ek="cstyle"]'); await page.waitForTimeout(400); await page.click('.opt[data-o="batch"]'); await page.click("#ob-n2"); await page.waitForTimeout(400);
  st = await state();
  ok(st.u.cstyle === "batch" && st.plan.some(x => x.bt), "editar a forma de cozinhar no Perfil refaz o plano");
  await page.click('.nav [data-tab="planos"]'); await page.click('#p-seg [data-s="ref"]'); await page.click('[data-v="semana"]'); await page.waitForTimeout(300);
  const before = await page.evaluate(() => S.plan.find(x => x.date >= today() && x.a && !x.lk && x.r));
  if (before) { await page.click(`[data-psw="${before.id}"]`); await page.waitForTimeout(200); ok(await page.evaluate(id => S.plan.find(x => x.id === id).r, before.id) !== before.r, "trocar um prato do plano");
    ok(await page.evaluate(id => planKcal(S.plan.find(x => x.id === id)) < S.goal * .6, before.id), "a troca mantém a porção da refeição, não a do dia inteiro"); }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(150); await shot("08c-plano-topo");
  await shot("08b-plano-semana-quantidade");

  // 10. Persistência após recarregar
  await page.reload(); await page.waitForTimeout(800);
  ok(!(await page.isVisible("#ob")), "sem onboarding após recarregar");
  ok(await page.evaluate(() => (S.days[Object.keys(S.days)[0]] || []).length === 2), "dados mantêm-se após recarregar");

  // 11. Modo escuro
  await page.evaluate(() => { S.theme = "dark"; applyPrefs(); go("hoje"); }); await page.waitForTimeout(400); await shot("18-escuro");

  // 11b. Menor de idade: nunca vê objetivos de peso, peso ou calorias
  const p3 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  p3.on("pageerror", e => errors.push("menor: " + e.message));
  await p3.goto(URL); await p3.evaluate(() => localStorage.clear()); await p3.reload(); await p3.waitForTimeout(2200);
  await p3.fill("#ob-n", "Tó"); await p3.click("#ob-n2"); await p3.fill("#ob-age", "15"); await p3.click("#ob-n2");
  ok(!(await p3.isVisible('.opt[data-o="perder"]')), "menor: sem opção de perder peso");
  await p3.click('.opt[data-o="manter"]'); await p3.click("#ob-n2");
  ok(!(await p3.isVisible("#ob-w")) && /sem contar calorias/i.test(await p3.textContent(".ob-week")), "menor: não pede peso nem mostra calorias");
  await p3.screenshot({ path: path.join(OUT, "02f-menor.png") });
  await p3.click("#ob-later"); await p3.waitForTimeout(700);
  const ms = await p3.evaluate(() => ({ kc:kcalOn(), goal:S.u.goal, later:S.u.later, plan:S.plan.length, age:S.u.age }));
  ok(!ms.kc && ms.goal === "manter" && ms.later && ms.plan > 0 && ms.age === "Menos de 18", "menor: terminar depois cria plano sem calorias (" + JSON.stringify(ms) + ")");
  await p3.evaluate(() => { document.querySelectorAll(".celebrate").forEach(x => x.remove()); openSummary(); });
  ok(!(await p3.isVisible("#pw-in")), "menor: sem registo de peso no Progresso");
  await p3.close();

  // 12. Migração a partir da NutriVida
  const p2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  p2.on("pageerror", e => errors.push("migração: " + e.message));
  await p2.goto(URL);
  await p2.evaluate(() => { localStorage.clear(); localStorage.setItem("nutrivida", JSON.stringify({ ob:1, u:{ name:"Rui", age:"18 ou mais", diet:["Como de tudo"], al:["Nenhuma"] }, goal:2100, days:{ "2026-01-05":[{ n:"Sopa", k:150, p:4, c:20, g:5, m:"Jantar", t:"20:00" }] }, water:{ "2026-01-05":4 }, plan:[{ d:2, m:"Almoço", n:"Salada", r:4 }] })); });
  await p2.reload(); await p2.waitForTimeout(800);
  const m = await p2.evaluate(() => JSON.parse(localStorage.getItem("brota_v1")));
  ok(m && m.u.name === "Rui" && m.days["2026-01-05"][0].n === "Sopa" && m.plan[0].date && m.goal === 2100, "migração da NutriVida preserva dados");

  // 13. Sem scroll horizontal
  for (const w of [320, 390, 768]) { await page.setViewportSize({ width: w, height: 800 }); await page.waitForTimeout(150);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth); ok(sw <= w, `sem scroll horizontal a ${w}px (${sw})`); }

  ok(errors.length === 0, "erros JS: " + errors.join(" | "));
  await browser.close();
  console.log(`\n${passes} ok, ${fails} falhas`);
  process.exit(fails ? 1 : 0);
})();
