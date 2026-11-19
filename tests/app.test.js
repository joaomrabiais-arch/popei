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
  await page.fill("#ob-age", "30"); await page.fill("#ob-h", "170"); await page.fill("#ob-w", "70"); await shot("02b-dados");
  await page.click("#ob-n2");
  for (const opt of ["1.375", "manter", "Falta de tempo", "4", "7", "media", "Como de tudo", "Nenhuma", "Cogumelos", "Desenrasco-me", "sim", "casa", "Nenhum", "DIAS", "30", "zero", "todo", "caminhar", "Joelhos"]) {
    if (opt === "DIAS") { for (const d of [0, 2, 4]) await page.click(`#ob-days [data-i="${d}"]`); await shot("02d-dias"); }
    else await page.click(`.opt[data-o="${opt}"]`);
    await page.click("#ob-n2");
  }
  await page.waitForTimeout(200); await shot("02c-referencia");
  ok(/kcal/.test(await page.textContent("#ob-in")), "ecrã final mostra a referência calculada");
  await page.click("#ob-n2");
  await page.waitForTimeout(600);
  ok(await page.isVisible(".celebrate"), "presente de boas-vindas aparece");
  await shot("03-boas-vindas"); await closeCel();
  await page.waitForTimeout(1200); ok(await page.isVisible("#tour-skip"), "tutorial aparece depois do onboarding"); await shot("03b-tutorial"); await page.click("#tour-skip"); await page.waitForTimeout(200);
  let st = await state();
  ok(st.u.name === "Joana" && st.spins === 3, "perfil e 3 giros guardados");
  ok(st.goal >= 1800 && st.goal <= 2400 && st.macro && st.macro.p > 0 && st.u.age === "18 ou mais", "referência e macros calculados (" + st.goal + " kcal, " + JSON.stringify(st.macro) + ")");

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
  await shot("05-adicionar-foto"); await sheetClose();

  // 6. Receitas
  await page.click('.nav [data-tab="receitas"]'); await page.waitForTimeout(400); await shot("06-receitas");
  await page.click('#r-f [data-f="Vegan"]'); await page.waitForTimeout(200);
  ok((await page.$$("#r-l [data-r]")).length >= 3, "filtro vegan mostra receitas");
  await page.click('#r-f [data-f="Todas"]'); await page.click("#r-l [data-r] >> nth=0"); await page.waitForTimeout(400); await shot("07-receita");
  await page.click("#rc-shop"); await page.waitForTimeout(200); await sheetClose();

  // 7. Planos: semana, mês, treino, compras
  await page.click('.nav [data-tab="planos"]'); await page.waitForTimeout(300);
  await page.click("#pl-auto"); await page.waitForTimeout(400); if (await page.isVisible(".dialog [data-y]")) await page.click(".dialog [data-y]"); await page.waitForTimeout(300); await closeCel();
  st = await state();
  ok(st.plan.length >= 20 && st.plan.some(x => x.x && x.x !== 1), "plano da semana à medida, com porções ajustadas (" + st.plan.length + ")");
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
  await shot("11-treino");
  await page.click('#p-seg [data-s="compras"]'); await page.waitForTimeout(300); await shot("12-compras");
  ok((await page.$$(".shop-item")).length >= 3, "lista de compras com ingredientes da receita");

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

  // 10. Persistência após recarregar
  await page.reload(); await page.waitForTimeout(800);
  ok(!(await page.isVisible("#ob")), "sem onboarding após recarregar");
  ok(await page.evaluate(() => (S.days[Object.keys(S.days)[0]] || []).length === 2), "dados mantêm-se após recarregar");

  // 11. Modo escuro
  await page.evaluate(() => { S.theme = "dark"; applyPrefs(); go("hoje"); }); await page.waitForTimeout(400); await shot("18-escuro");

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
