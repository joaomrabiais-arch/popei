# AvocoraFit — auditoria de 21/11/2026 (por cima da de 19/11, que fica abaixo)

**Como foi feita:** um script percorreu todas as perguntas iniciais a tocar como uma pessoa; outro abriu todos os ecrãs secundários (Progresso, Conquistas, Bem-estar, Aparência e som, Dados, Armário, Abi, visita guiada) com dados de exemplo; outro meteu código malicioso em todos os campos e nos dados. Erros na consola: nenhum.

## Encontrado e corrigido nesta ronda

| Problema (confirmado) | Correção |
|---|---|
| Perguntas iniciais: a atividade vinha marcada sem a pessoa escolher, na posição da opção da pergunta anterior | só usa a resposta guardada se a pessoa já respondeu antes; teste novo |
| Dados e privacidade dizia que as fotos iam "para a IA do Claude" (falso) | texto certo + ligação à política de privacidade |
| Conquistas: 13 cartões iguais, cinzentos, com a mesma estrela | medalha própria por conquista (ícone e cor), cadeado nas por ganhar, barra "x de 13", vista de detalhe |
| Progresso: a água estava no fundo, depois do peso | água no topo, com dias no objetivo e litros da semana |
| Aparência e som: caixas de seleção do browser, sem forma de ouvir os sons | interruptores, descrição e "Ouvir um exemplo" |
| "Roda de prémios" em três sítios | "Roda de descontos" |
| Falar com o Abi: ecrã morto sem IA | respostas rápidas com dados reais (receitas, alimentos, a tua água), marcadas "sem IA" |
| Pro: dois benefícios sem imagem | ilustrações próprias |

## O que funciona (verificado por teste)

Registar (pesquisa, manual, repetir, foto com IA simulada), Hoje (anel, macros, água, peso, desafios), plano de refeições automático e troca de pratos, compras a partir do plano, receitas com porções, treino guiado com cargas e recordes, perguntas iniciais, modo de menores, roda de descontos, Pro honesto, inglês na interface, segurança contra código malicioso. 69 testes.

## A meio ou em falta

1. **Fotos de 73 receitas e 40 alimentos** — à espera de ~17 créditos no Higgsfield.
2. **IA real** (fotos e Abi) — servidor pronto (`servidor/`), falta publicar na Cloudflare com a conta do dono.
3. **Inglês** — interface traduzida; receitas, ingredientes e parte das perguntas continuam em português.
4. **Notificações** e **e-mails** — ver abaixo. Não implementados.
5. **Visita guiada** — funciona e aponta para elementos reais, mas falta torná-la mais visual.
6. **Treino** — feito: perguntas só de treino (objetivo, nível, sítio, material, dias, tempo, preferência), semana com estado por dia, ecrã do exercício com demonstração ilustrativa, versão mais fácil e mais difícil conforme o material, troca, outra versão do plano. Falta: demonstrações reais (vídeo ou fotos) e testar com pessoas.
7. **Conquistas** — falta uma celebração grande ao ganhar (hoje é um aviso discreto).

## Notificações e e-mails: o que é possível com esta arquitetura

- **Lembretes com a app aberta:** possíveis já, com a API de notificações do browser e pedido de autorização.
- **Lembretes com a app fechada:** precisam de Web Push (o `sw.js` já existe), de um servidor que envie as mensagens (chaves VAPID, por exemplo num Worker com agendamento) e de guardar as subscrições (Supabase). No iPhone só funcionam com a app instalada no ecrã principal. Não estão feitos, e a app não diz que estão.
- **E-mails:** precisam de um fornecedor com escalão grátis limitado (confirmar condições antes de escolher), domínio próprio com SPF/DKIM, consentimento explícito e ligação para cancelar. Hoje só é enviada a ligação de entrada do Supabase, pedida pela própria pessoa.

## Ordem recomendada

1. Créditos para as fotos. 2. Publicar o servidor de IA. 3. Criar o Supabase. 4. Testar com 5 pessoas reais. 5. Lembretes de água com a app aberta. 6. Alternativas de exercícios. 7. Traduzir as receitas. 8. Push e e-mails, só se as pessoas os pedirem.

---

# Brota — auditoria completa e plano (fases 1 e 2)

Data: 19/11/2026. Código auditado: `app/src/` → `app/index.html` (398 KB, commit `84e3178`).

**Como foi feita:** leitura do código e um script automático que clicou em 55 botões e simulou a IA a falhar, a demorar e a devolver dados mal formatados. Também testou o modo de menores e mediu o contraste das cores.

**Sem a gravação da Yazio:** a gravação não chegou a esta sessão; só recebi a NutriVida original e as duas imagens das mascotes. A comparação com a Yazio usa a pesquisa anterior (análises públicas e as fichas nas lojas de apps), não o vídeo. Reenvia-o para eu rever animações e transições.

---

## 1. O que funciona de verdade

| Área | Estado | Notas |
|---|---|---|
| Diário (4 refeições, editar, apagar, duplicar, favoritas, recentes, repetir dia) | ✅ Funciona | Dados só neste aparelho |
| Registo manual e por pesquisa | ✅ Funciona | Base de alimentos fraca (ver 3.3) |
| Água, desafios, roda, conquistas | ✅ Funciona | Um bug nos desafios (C4) |
| Receitas (45), filtros, favoritas, "Comi", para a lista de compras | ✅ Funciona | Só 3 têm fotografia real |
| Plano semanal e mensal à medida, compras somadas | ✅ Funciona | |
| Plano de treino personalizado (v2) | ✅ Funciona | Não revisto por um treinador |
| Referência de kcal e macros, peso e gráficos | ✅ Funciona | Fórmula geral, não clínica |
| Perguntas iniciais, tutorial, mascotes, balões | ✅ Funciona | |
| Exportar, importar e apagar dados | ✅ Funciona | A importação valida pouco |
| Modo escuro, telemóvel (320–768 px) | ✅ Funciona | Contraste insuficiente (C5) |
| Erros de consola em 55 cliques | ✅ Zero | |

## 2. O que é simulado ou depende de configuração

| Área | Estado real |
|---|---|
| **Análise de fotos por IA** | Funciona **só dentro do Claude**. Fora dele, `aiEndpoint` está vazio: o botão aparece desativado, com explicação. O servidor Llama (`servidor/`) está escrito mas **nunca foi publicado nem testado** com um pedido real. |
| **Assistente (chat)** | Mesma situação. Desativado fora do Claude, com explicação. |
| **Contas e sincronização** | **Não existem.** Tudo fica no `localStorage` do browser: se a pessoa muda de telemóvel ou limpa o browser, perde tudo. |
| **Código de barras** | **Não existe.** E bem: nenhum botão finge que existe. |
| **Apple Saúde / Health Connect** | **Não existe** e não pode existir numa app web (ver 3.5). |
| **Premium e pagamentos** | Não existem. |
| **Fotografias das receitas** | 3 de 45. O Wikimedia bloqueou os pedidos deste servidor (erro 429). |

## 3. Problemas encontrados

### Críticos (corrigir já)

- **C1 — A IA pode ficar "a pensar" para sempre.** Não há tempo limite. Se o servidor não responder, o ecrã fica eternamente em "O Abi está a olhar para o teu prato…". *Confirmado no teste.*
- **C2 — A IA perde números em silêncio.** Se o modelo devolver `"195 kcal"` ou `"0,5"` em vez de `195`, a app mostra **0 kcal** sem avisar. *Confirmado no teste.* Com o Llama, que é menos obediente do que o Claude, isto vai acontecer muitas vezes.
- **C3 — Menores: a app mostra opções de peso.**
  - Em "Dados e objetivo", a opção **"Perder peso" aparece** a quem tem menos de 18 anos. A app não a aplica, mas mostrá-la já é errado. *Confirmado.*
  - Um menor que escolha "Ganhar músculo" recebe a pergunta **"peso desejado"**.
  - O ecrã Progresso mostra **o gráfico do peso** a menores.
  - As perguntas iniciais pedem **peso e altura a toda a gente**, antes de saberem a idade.
- **C4 — Os desafios dão giros sem esforço.** O plano semanal automático marca logo como feito o desafio "Planeia uma refeição de amanhã". *Confirmado.*
- **C5 — Contraste abaixo do mínimo WCAG AA (4,5:1).**
  - O texto `--faint` dá **2,36:1**. Está nos rótulos da barra de navegação, nos dias da semana e em textos pequenos.
  - O `--muted` dá **4,07:1**, e é o texto secundário de quase toda a app.
  - Texto branco sobre coral dá **3,26:1** (botões do Morango) e sobre azul dá **3,47:1**.
- **C6 — A base de alimentos não tem fonte.** São 40 alimentos com valores médios que escrevi de memória. Estão marcados como "aproximados", mas o teu briefing proíbe valores inventados. Têm de ser substituídos por uma tabela com fonte.

### Importantes

- **I1 — A pesquisa não aceita escrita sem acentos.** "maca" não encontra "Maçã". *Confirmado.* Também não tem sinónimos ("frango" ≠ "galinha") nem ordena por relevância.
- **I2 — Porções só em gramas.** Faltam medidas de casa: 1 colher, 1 chávena, 1 unidade, 1 fatia.
- **I3 — Uma falha da IA não dá caminho alternativo.** Diz "tenta outra vez", mas não oferece "Registar à mão com estes dados", e não distingue "sem internet" de "limite grátis atingido".
- **I4 — A importação de cópias aceita qualquer objeto** que tenha `days`. Um ficheiro estragado pode partir a app.
- **I5 — Não é instalável (PWA).** Não há manifest nem service worker: não abre sem internet nem fica como app no telemóvel.
- **I6 — Morango: licença por confirmar.** Parece imagem de banco de imagens. Sem licença comercial, não se pode lançar.
- **I7 — Fotos de receitas:** faltam 42.
- **I8 — Planos de treino e alimentação** sem revisão profissional.
- **I9 — Peso do ficheiro (398 KB):** quase tudo são as imagens embebidas. Aceitável, mas numa app a sério as imagens vão à parte.

## 4. Arquitetura de produção proposta

### 4.1 IA fiável (fotos e assistente)

```
App ──HTTPS──▶ Função no servidor (Supabase Edge Function ou Cloudflare Worker)
                ├─ confirma a sessão do utilizador (só contas autenticadas)
                ├─ limite por utilizador (ex.: 20 fotos/dia grátis)
                ├─ escolhe o modelo: Claude (melhor) ou Llama 3.2 Vision (grátis)
                ├─ tempo limite de 25 s, 1 nova tentativa com espera
                ├─ valida o JSON com um esquema; converte "195 kcal" → 195
                └─ não guarda as fotos (só o resultado, se a pessoa guardar)
```

- **A chave da IA vive só no servidor.** A app não contém segredos.
- **Na app:** estados de "a analisar", "a demorar mais do que o normal", erro com nova tentativa, "sem ligação" e "limite atingido", sempre com a opção "registar à mão".
- **Custo:** o Llama na Cloudflare é grátis até cerca de 10 000 neurons por dia, mas reconhece pior. Uma opção é usar o Claude Haiku nas contas Premium e o Llama nas grátis.

### 4.2 Contas e sincronização (recomendo Supabase, alojado na UE)

- Autenticação por e-mail ou com Apple/Google. Postgres com **Row Level Security**: cada utilizador só lê e escreve as suas próprias linhas.
- **Local primeiro:** a app continua a funcionar sem rede. Quando há ligação, sincroniza cada entidade (refeição, água, plano, peso) com `updated_at`. Em caso de conflito, ganha a alteração mais recente.
- **Migração sem perder dados:** no primeiro login, os dados atuais do `localStorage` (chaves `brota_v1` e `nutrivida`) são enviados uma vez e marcados como migrados.
- **RGPD:** peso, altura e alimentação são **dados de saúde** (art. 9.º). É preciso:
  - consentimento explícito;
  - alojamento na UE;
  - política de privacidade;
  - exportação e apagamento da conta feitos no servidor;
  - registo das atividades de tratamento.
  - Para menores: em Portugal, a idade de consentimento digital é de **13 anos**. **A confirmar com um jurista.** Abaixo disso, é preciso o consentimento dos pais.

### 4.3 Base de alimentos e código de barras

- **Tabela base com fonte:**
  - a tabela portuguesa do INSA (PortFIR);
  - ou a **CIQUAL** (França, licença aberta).
  - A licença e o formato de cada uma estão **por confirmar**.
- **Código de barras:** **Open Food Facts**. É gratuita e aberta (ODbL), mas os dados são da comunidade e a qualidade varia: mostrar a origem e a data.
  - Leitura no telemóvel: biblioteca ZXing em WebAssembly. O iPhone (Safari) não tem a função nativa de ler códigos de barras.
  - Se o código não for reconhecido, a app diz isso claramente. Nunca adivinha.
- **Pesquisa:** normalizar acentos, sinónimos, ordenar por relevância, porções de casa e "os teus alimentos" primeiro.

### 4.4 Apple Saúde e Google Health Connect

- **Não existe API web para nenhum dos dois.** O HealthKit só funciona numa app iOS nativa; o Health Connect só numa app Android nativa.
- Caminho: embrulhar a app web com **Capacitor** (ou reescrever em React Native) e usar os plugins nativos. São precisas permissões por tipo de dado (passos, energia ativa, peso) e a revisão das lojas.
- **Até lá, a app não mostra nenhum botão destas integrações.**

## 5. Plano por fases, com prioridade e complexidade

| # | Trabalho | Prioridade | Complexidade | Depende de |
|---|---|---|---|---|
| 3.1 | C1–C2: tempo limite, nova tentativa, conversão de números, ecrãs de erro e "registar à mão" | Crítico | Baixa | — |
| 3.2 | C3: proteções para menores (sem objetivo de peso, sem peso-alvo, sem gráfico de peso, idade antes do corpo) | Crítico | Baixa | — |
| 3.3 | C4: desafios só contam ações feitas pela pessoa | Crítico | Baixa | — |
| 3.4 | C5: contraste AA em claro e escuro | Crítico | Baixa | — |
| 3.5 | I1–I2: pesquisa sem acentos, sinónimos, relevância, porções de casa | Importante | Média | — |
| 3.6 | I4: validação da importação | Importante | Baixa | — |
| 4.x | UX: ecrã do scanner revisto, histórico de refeições, ajuste de porções nas receitas | Importante | Média | 3.1 |
| 4.y | PWA instalável e sem internet | Importante | Baixa | — |
| 5.1 | C6: base de alimentos com fonte (INSA/CIQUAL) | Crítico para lançar | Média | Licença |
| 5.2 | Backend Supabase: contas, sincronização, apagamento, migração | Crítico para lançar | Alta | Conta Supabase |
| 5.3 | IA no servidor com autenticação e limites | Crítico para lançar | Média | 5.2 + chave |
| 5.4 | Código de barras (ZXing + Open Food Facts) | Importante | Média | Rede |
| 5.5 | App nativa (Capacitor) + Apple Saúde / Health Connect | Depois | Alta | Contas de programador Apple e Google |
| — | Fotos das receitas, licença do Morango, revisão por nutricionista e treinador | Antes de lançar | — | Tu |

**O que preciso de ti para as fases 5.x:**
1. Uma conta Supabase (região UE).
2. Uma chave de IA no servidor, Claude ou a conta da Cloudflare.
3. Uma decisão sobre a tabela de alimentos.
4. A licença do Morango.
5. As fotografias, ou rede sem bloqueio para as ir buscar.

## Atualização (19/11/2026, personalização e plano semanal)

- **C3 resolvido:**
  - a idade é pedida antes do corpo;
  - menores não veem "Perder gordura", nem peso, nem peso-alvo, nem calorias;
  - o registo de peso sai do Progresso;
  - o ecrã "Dados e objetivo" também esconde "perder".
- **C4 resolvido:** o desafio "planear" só conta refeições planeadas à mão.
- **Novo:**
  - 5 secções de perguntas, todas com opção de saltar;
  - gerador do plano em `app/src/js/09-plano-alimentar.js`.
- **Por resolver:**
  - os custos usam preços de referência escritos à mão (por verificar);
  - o supermercado só fica guardado;
  - continua a haver só 45 receitas, por isso há pouca variedade quando há muitas restrições.

## Dicas dos vídeos de desenvolvimento (20/11/2026)

Vídeos de @pedromppinto, @maxcarrau.ia e @fabianocarvalhojr (lidos através das legendas automáticas).

**Aplicado:**
- **Guia de estilo único:** `DESIGN.md` e `app/src/css/08-guia-estilo.css`.
- **Menos "cara de IA":** sem fundo creme, letra do sistema no texto e títulos mais contidos.
- **Contraste AA (resolve o C5):**
  - texto secundário: 5,8:1;
  - texto discreto: pelo menos 4,5:1;
  - branco sobre azul da água: 4,7:1.
- **Hierarquia e simplicidade:** o ecrã Hoje perdeu a lista "Mais", que repetia os separadores.
- **Microinterações:** toques que encolhem, microvibração no Android e sons ligados por omissão.
- **Primeiro ecrã emocional:** a dor e a promessa antes das perguntas, com o plano personalizado no fim (já existia).
- **Segurança do servidor de IA:**
  - limite de 20 pedidos por IP a cada 10 minutos;
  - só aceita JSON e valida o pedido;
  - as chaves já ficavam no servidor.
- **`CLAUDE.md` com regras e critérios de "feito"**, para trabalhar sempre da mesma forma.

**Por fazer, e porquê:**
- **Pôr a app nas mãos de pessoas reais e testar se pagam.** O vídeo diz para lançar cedo em vez de juntar funcionalidades. É a próxima coisa a fazer.
- **Contas e base de dados (Supabase)**, com autenticação pronta: precisa de uma conta do dono do projeto.
- **Pagamentos:** testar um plano semanal com teste grátis (o vídeo cita um relatório da Adapty: mais receita por cliente; não verificado). Precisa de pagamentos reais; não há botões falsos.
- **Pentest com o Strix** antes de ir ao ar: corre no computador do dono e precisa de instalação.
- **Plugins de iPhone (simulador, Expo, Swift):** não se aplicam a uma app web.
- **Apagar marcas de IA dos ficheiros:** não se faz. As imagens geradas dizem que são ilustrativas.
