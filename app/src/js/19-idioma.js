/* ========================== Idioma: português (base) e inglês ==========================
   A app é escrita em português. Em inglês, esta camada troca o texto que aparece no ecrã por um dicionário,
   frase a frase, e reconhece frases com números ou nomes (datas, "Remover X", "Faltam N produtos").
   shortcut: os nomes das receitas, ingredientes e passos ficam em português; para os traduzir, juntar um campo "en" a cada receita. */
const LANG = () => (S.lang === "en" ? "en" : "pt");
const EN_DOW = { "Segunda":"Monday", "Terça":"Tuesday", "Quarta":"Wednesday", "Quinta":"Thursday", "Sexta":"Friday", "Sábado":"Saturday", "Domingo":"Sunday" };
const EN_MON = { janeiro:"January", fevereiro:"February", "março":"March", abril:"April", maio:"May", junho:"June", julho:"July", agosto:"August", setembro:"September", outubro:"October", novembro:"November", dezembro:"December" };
const EN = {
  // navegação e geral
  "Hoje":"Today", "Planos":"Plans", "Receitas":"Recipes", "Perfil":"Profile", "Registar":"Log", "Fechar":"Close", "Voltar":"Back", "Guardar":"Save", "Cancelar":"Cancel", "Adicionar":"Add", "Ver":"View", "Principal":"Main", "Som":"Sound",
  "Seg":"Mon", "Ter":"Tue", "Qua":"Wed", "Qui":"Thu", "Sex":"Fri", "Sáb":"Sat", "Dom":"Sun", "Semana":"Week", "Mês":"Month", "Já passou.":"Already past.",
  "Pequeno-almoço":"Breakfast", "Peq.-almoço":"Breakfast", "Almoço":"Lunch", "Lanche":"Snack", "Jantar":"Dinner", "Refeição":"Meal", "Refeições":"Meals",
  "Hidratos":"Carbs", "Proteína":"Protein", "Gordura":"Fat", "proteína":"protein", "comido":"eaten", "kcal restam":"kcal left", "objetivo":"goal",
  // Hoje
  "Repetir dia anterior":"Repeat yesterday", "No plano:":"Planned:", "Comi isto":"I ate this", "Água":"Water", "Começa com um copo agora":"Start with a glass now", "Objetivo cumprido. Boa!":"Goal reached. Nice!",
  "Peso":"Weight", "Por registar":"Not logged", "Guardado":"Saved", "Guardar peso":"Save weight", "Desafios de hoje":"Today's challenges", "Marca-se sozinho":"Ticks itself", "Toca quando fizeres":"Tap when done", "Feito":"Done",
  "Regista o pequeno-almoço":"Log your breakfast", "Planeia uma refeição de amanhã":"Plan a meal for tomorrow", "Regista 3 refeições":"Log 3 meals", "Treino de hoje":"Today's workout", "Ver o dia em detalhe":"See the day in detail",
  "Bebe 6 copos de água":"Drink 6 glasses of water", "Come uma peça de fruta":"Eat a piece of fruit", "Come legumes a uma refeição":"Have vegetables with a meal", "Experimenta uma receita nova":"Try a new recipe", "Mexe-te 20 minutos":"Move for 20 minutes",
  "Toca num copo para o marcar":"Tap a glass to mark it", "Hoje é dia de descanso":"Today is a rest day", "O teu plano":"Your plan", "Tirar um copo":"Remove a glass", "Mais um copo":"One more glass", "Menos 100 gramas":"100 grams less", "Mais 100 gramas":"100 grams more", "Adicionar refeição":"Add meal",
  // Registar
  "Pesquisar":"Search", "Foto":"Photo", "Manual":"Manual", "Repetir":"Repeat", "Alimentos simples":"Basic foods", "Pesquisar alimento ou receita":"Search food or recipe",
  "Valores médios aproximados. Confirma sempre no rótulo.":"Approximate average values. Always check the label.", "Enquadra o prato inteiro":"Fit the whole plate", "De cima, com boa luz":"From above, in good light",
  "Análise por foto em breve":"Photo analysis coming soon", "Galeria":"Gallery", "Registar à mão":"Log manually", "Só o nome já conta":"Just the name counts",
  "A análise de fotos ainda não está ligada nesta versão. Entretanto, regista assim:":"Photo analysis isn't switched on in this version yet. Meanwhile, log like this:",
  "O que comeste?":"What did you eat?", "Porção":"Portion", "opcional":"optional", "Valores":"Values", "se souberes":"if you know them", "Não sabes os valores? Deixa em branco. Registar já conta.":"Don't know the values? Leave them blank. Logging still counts.",
  "Analisar a foto":"Analyse photo", "Algo que não se vê?":"Anything not visible?", "Opcional":"Optional", "Trocar":"Change", "Guardar no diário":"Save to diary", "Falta um alimento":"Add a missing food", "Corrigir valores":"Fix values",
  "Favoritas":"Favourites", "Recentes":"Recent", "Quanto comeste?":"How much did you eat?", "Meia porção":"Half portion", "1 porção":"1 portion", "1 e meia":"1.5 portions", "2 porções":"2 portions", "Refeição guardada":"Meal saved", "Adicionado":"Added",
  // Planos
  "Treino":"Workout", "Compras":"Shopping", "A tua semana":"Your week", "Preferências":"Preferences", "na semana":"per week", "aproximado":"approximate", "kcal/dia":"kcal/day", "proteína/dia":"protein/day",
  "Custos com preços médios aproximados, sem contar o que já tens em casa. Variam com a loja e a época.":"Costs use approximate average prices and leave out what you already have. They vary by shop and season.",
  "Ver a lista de compras da semana":"See this week's shopping list", "Semana anterior":"Previous week", "Semana seguinte":"Next week", "Planear refeição":"Plan a meal", "Planear":"Plan", "Dia":"Day", "O que vais comer":"What you'll eat", "Outras sugestões":"Other suggestions",
  "Escolhe o teu plano":"Choose your plan", "Recomendado":"Recommended", "Plano feito para ti":"Plan made for you", "Criar o meu plano":"Create my plan", "Ou começa por um destes":"Or start with one of these",
  "Começar do zero":"Start from zero", "Em casa, sem material":"At home, no equipment", "Força no ginásio":"Strength at the gym", "Cardio e mobilidade":"Cardio and mobility",
  "Começa pelo que te parece fácil. Podes mudar quando quiseres, sem perder o histórico.":"Start with what feels easy. You can switch anytime without losing your history.",
  "Se tens lesões, dores ou alguma condição de saúde, fala com um profissional antes de começar. Para de imediato se sentires dor.":"If you have injuries, pain or a health condition, talk to a professional before starting. Stop at once if you feel pain.",
  "Começar treino guiado":"Start guided workout", "Mudar":"Change", "O teu plano":"Your plan", "Hoje é dia de descanso":"Today is a rest day",
  "Lista da semana":"This week's list", "Custo estimado da semana":"Estimated cost this week", "Copiar lista":"Copy list", "Limpar comprados":"Clear bought", "Guardar e nova":"Save and start new", "No carrinho":"In the cart",
  "Juntar produto, ex.: café":"Add an item, e.g. coffee", "Produto":"Item", "Qtd.":"Qty", "Quantidade":"Quantity", "Tudo no carrinho":"Everything's in the cart", "Lista vazia":"Empty list", "· toca para juntar":"· tap to add",
  "Frutas e legumes":"Fruit and veg", "Carne e peixe":"Meat and fish", "Laticínios e ovos":"Dairy and eggs", "Mercearia":"Pantry", "Outros":"Other", "Para manter o peso":"To keep your weight", "Listas anteriores":"Previous lists", "Restaurar":"Restore",
  // Receitas
  "Todas":"All", "Vegetariano":"Vegetarian", "Vegan":"Vegan", "Sem lactose":"Lactose-free", "Sem glúten":"Gluten-free", "Até 15 min":"Up to 15 min", "Ricas em proteína":"High in protein", "Doces mais leves":"Lighter sweets",
  "Prontas em 15 minutos":"Ready in 15 minutes", "Até 400 kcal":"Up to 400 kcal", "Leves":"Light", "Sopas e caldos":"Soups and broths", "Sabores portugueses":"Portuguese flavours", "Para cozinhar em quantidade":"For batch cooking", "Todas as receitas":"All recipes",
  "Receita ou ingrediente que tens em casa":"A recipe or an ingredient you have at home", "Pesquisar receitas":"Search recipes", "Ingredientes":"Ingredients", "Preparação":"Method", "Fácil":"Easy", "Média":"Medium", "Difícil":"Hard", "Vegetariana":"Vegetarian",
  "Imagem ilustrativa, gerada por IA":"Illustrative image, AI-generated", "kcal por porção":"kcal per portion", "Comi":"I ate it",
  "Valores por porção: estimativa aproximada a partir dos ingredientes, não é análise laboratorial.":"Values per portion: an approximate estimate from the ingredients, not a lab analysis.",
  // Perfil
  "dias com registos":"days logged", "dia com registos":"day logged", "treinos feitos":"workouts done", "treino feito":"workout done", "conquistas":"achievements", "Gira a roda e ganha desconto":"Spin the wheel for a discount",
  "Plano alimentar":"Meal plan", "Refeições, cozinha, treino, orçamento":"Meals, cooking, workouts, budget", "Alimentação, alergias, calorias":"Diet, allergies, calories", "Falar com o Abi":"Talk to Abi", "Perguntas sobre alimentação":"Questions about food",
  "Progresso":"Progress", "Peso, energia, água e treinos":"Weight, energy, water and workouts", "Conquistas":"Achievements", "Bem-estar":"Wellbeing", "Sono, energia e humor":"Sleep, energy and mood", "Recompensas":"Rewards",
  "Roda de descontos":"Discount wheel", "Armário do Abi":"Abi's wardrobe", "Definições":"Settings", "Aparência e som":"Appearance and sound", "Tema, cores, animações":"Theme, colours, animations", "Como funciona a app":"How the app works",
  "Visita guiada de 1 minuto":"1-minute guided tour", "Dados e privacidade":"Data and privacy", "Exportar, importar, apagar":"Export, import, delete", "Manter o peso":"Maintain weight", "Perder peso":"Lose weight", "Ganhar massa":"Build muscle",
  "Tema":"Theme", "Automático":"Automatic", "Claro":"Light", "Escuro":"Dark", "Cor principal":"Main colour", "Sons":"Sounds", "Idioma":"Language",
  // Pro e roda
  "Mais tempo para comer bem, menos tempo a planear":"More time to eat well, less time planning", "Disponível em breve":"Coming soon", "Mensal":"Monthly", "por mês":"per month", "Comparar Grátis e Pro":"Compare Free and Pro",
  "Análise de fotos com IA":"AI photo analysis", "Planos de 4 semanas":"4-week plans", "Histórico completo":"Full history", "Cópia na nuvem":"Cloud backup", "Grátis":"Free", "Girar":"Spin", "Como funciona":"How it works",
  // Início
  "Comer bem não devia ser uma luta.":"Eating well shouldn't be a struggle.", "Começar o meu plano":"Start my plan", "Continuar":"Continue", "Saltar esta pergunta":"Skip this question", "Terminar depois":"Finish later",
  "Dietas que duram duas semanas, contas a cada refeição, culpa ao fim de semana. Já passámos todos por isso.":"Diets that last two weeks, counting every meal, guilt at the weekend. We've all been there.",
  "A tua semana de refeições feita para ti, à tua medida":"Your week of meals, made to fit you", "A lista de compras sai sozinha do plano":"The shopping list comes straight from the plan", "Sem dietas restritivas nem culpa: um passo de cada vez":"No restrictive diets, no guilt: one step at a time",
  // treino personalizado
  "Descanso":"Rest", "Recuperação. Caminhar ou alongar, se te apetecer.":"Recovery. Walk or stretch if you feel like it.", "Ficou por fazer":"Missed", "A seguir":"Up next", "Treino extra":"Extra workout", "Hoje recuperas.":"Today you recover.", "Dia de descanso.":"Rest day.", "Ajustar o plano":"Adjust the plan", "Mudar as respostas":"Change your answers", "Objetivo, nível, sítio, material e tempo":"Goal, level, place, equipment and time", "Mudar os dias":"Change days", "Gerar outra versão":"Generate another version", "Mesmos critérios, outros exercícios":"Same criteria, different exercises", "Escolher outro plano":"Choose another plan", "Os treinos feitos ficam no histórico":"Completed workouts stay in your history", "Histórico":"History", "Demonstração ilustrativa do movimento":"Illustrative demonstration of the movement", "séries":"sets", "série":"set", "repetições":"reps", "descanso":"rest", "duração":"duration", "Ajustar a dificuldade":"Adjust difficulty", "Mais fácil":"Easier", "Mais difícil":"Harder", "Já é a mais fácil":"Already the easiest", "Já é a mais difícil com o teu material":"Already the hardest with your equipment", "Trocar por outro":"Swap for another", "Marcar como feito":"Mark as done", "Feito · desmarcar":"Done · undo", "Uma troca fica em todas as semanas deste plano.":"A swap applies to every week of this plan.", "Esforço é normal; dor não. Se doer, para e escolhe a versão mais fácil ou outro exercício.":"Effort is normal; pain isn't. If it hurts, stop and pick the easier version or another exercise.", "O que queres ganhar com o treino?":"What do you want from training?", "Muda as séries, as repetições e os descansos.":"It changes sets, reps and rest.", "Forma física geral":"General fitness", "Um pouco de força, cardio e mobilidade":"A bit of strength, cardio and mobility", "Ganhar força":"Get stronger", "Menos repetições, mais descanso":"Fewer reps, more rest", "Mobilidade":"Mobility", "Mover-te melhor, com mais amplitude":"Move better, with more range", "Resistência":"Endurance", "Mais repetições e mais cardio":"More reps and more cardio", "Criar o hábito":"Build the habit", "Treinos curtos e fáceis de cumprir":"Short workouts that are easy to keep", "Que tipo de exercício preferes?":"What kind of exercise do you prefer?", "Escolho os exercícios a partir daqui.":"I'll pick the exercises from this.", "Um pouco de tudo":"A bit of everything", "Força, com peso ou máquinas":"Strength, with weights or machines", "Só com o peso do corpo":"Bodyweight only", "Mais mobilidade":"More mobility", "Mais cardio":"More cardio", "Plano de treino feito com as tuas respostas":"Training plan built from your answers", "Voltaste ao exercício original":"Back to the original exercise",
  "dá informação geral e estimativas. Não substitui médico, nutricionista nem personal trainer.":"gives general information and estimates. It doesn't replace a doctor, dietitian or personal trainer."
};
const EN_RX = [
  [/^Agora: (.+)$/, (m, x) => "Now: " + x.split(", ").map(d => EN[d] || d).join(", ")], [/^Voltar ao original: (.+)$/, "Back to the original: $1"], [/^Trocado por (.+)$/, "Swapped for $1"],
  [/^(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo), (\d+) de (\w+)(.*)$/, (m, d, n, mo, rest) => `${EN_DOW[d]}, ${EN_MON[mo] || mo} ${n}${rest}`],
  [/^(Hoje · )?(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo) (\d+)$/, (m, h, d, n) => `${h ? "Today · " : ""}${EN_DOW[d]} ${n}`],
  [/^Bom dia, (.+)$/, "Good morning, $1"], [/^Boa tarde, (.+)$/, "Good afternoon, $1"], [/^Boa noite, (.+)$/, "Good evening, $1"], [/^Bom dia$/, "Good morning"], [/^Boa tarde$/, "Good afternoon"], [/^Boa noite$/, "Good evening"],
  [/^Remover (.+)$/, "Remove $1"], [/^Trocar (.+)$/, "Swap $1"], [/^Planear (.+)$/, "Plan $1"], [/^Adicionar ao (.+)$/, (m, x) => "Add to " + (EN[x] || x).toLowerCase()],
  [/^Faltam (\d+) produtos?$/, (m, n) => `${n} item${n === "1" ? "" : "s"} left`], [/^Faltam (\d+) copos? de 250 ml$/, (m, n) => `${n} more glass${n === "1" ? "" : "es"} of 250 ml`],
  [/^de ([\d,]+) L$/, "of $1 L"], [/^(\d+) dias$/, "$1 days"], [/^(\d+) giros? na roda$/, (m, n) => `${n} spin${n === "1" ? "" : "s"} on the wheel`], [/^Copo (\d+) de 250 ml(.*)$/, "Glass $1 of 250 ml$2"],
  [/^(\d+) refeições em (\d+) dias?$/, (m, a, b) => `${a} meals over ${b} day${b === "1" ? "" : "s"}`], [/^Receitas para (.+)$/, (m, x) => "Recipes for " + (EN[x[0].toUpperCase() + x.slice(1)] || x).toLowerCase()],
  [/^(\d+) (porção|porções)$/, (m, n) => `${n} portion${n === "1" ? "" : "s"}`], [/^Nível (\d) de 3$/, "Level $1 of 3"], [/^(\d+) de (\d+)$/, "$1 of $2"],
  [/^Feita a partir de (\d+) refeições? planeadas?, com as quantidades somadas\.$/, "Built from $1 planned meals, with quantities added up."],
  [/^(\d+)% do dia$/, "$1% of the day"], [/^1 porção · (\d+) g proteína$/, "1 portion · $1 g protein"], [/^100 g · (\d+) g proteína$/, "100 g · $1 g protein"],
  [/^Bom dia! Já tomaste o pequeno-almoço\? Regista-o em 10 segundos\.$/, "Good morning! Had breakfast yet? Log it in 10 seconds."], [/^Hora de almoço\. O que vai ser hoje\?$/, "Lunchtime. What's it going to be?"],
  [/^E o jantar\? Regista para fechares o dia\.$/, "And dinner? Log it to close the day."], [/^Registar (almoço|lanche|jantar)$/, (m, x) => "Log " + (EN[x[0].toUpperCase() + x.slice(1)] || x).toLowerCase()],
  [/^Contém (.+)\. Confirma sempre os rótulos\.$/, "Contains $1. Always check the labels."], [/^Sobre ti · (\d+) de (\d+)$/, "About you · $1 of $2"]
];
function trText(t){
  const k = t.trim(); if (!k) return t;
  let out = EN[k];
  if (out === undefined) for (const [re, to] of EN_RX) if (re.test(k)) { out = k.replace(re, to); break; }
  return out === undefined ? t : t.replace(k, out);
}
function translateTree(root){
  if (LANG() !== "en" || !root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { if (n.parentElement && n.parentElement.closest("script,style,textarea,[contenteditable]")) continue; const v = trText(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  if (root.querySelectorAll) [root, ...root.querySelectorAll("[placeholder],[aria-label],[title]")].forEach(e => ["placeholder","aria-label","title"].forEach(a => { const v = e.getAttribute && e.getAttribute(a); if (v) { const t = trText(v); if (t !== v) e.setAttribute(a, t); } }));
}
// Corre depois do arranque (99-arranque.js carrega o estado guardado, onde está o idioma).
setTimeout(() => { if (LANG() !== "en") return;
  document.documentElement.lang = "en";
  let busy = false;
  new MutationObserver(ms => { if (busy) return; busy = true; try { for (const m of ms) { if (m.type === "characterData") { const v = trText(m.target.nodeValue); if (v !== m.target.nodeValue) m.target.nodeValue = v; } else m.addedNodes.forEach(x => x.nodeType === 1 ? translateTree(x) : x.nodeType === 3 && (x.nodeValue = trText(x.nodeValue))); } } finally { busy = false; } })
    .observe(document.body, { childList:true, subtree:true, characterData:true });
  translateTree(document.body);
}, 0);
const setLang = l => { S.lang = l === "en" ? "en" : "pt"; save(); location.reload(); };
