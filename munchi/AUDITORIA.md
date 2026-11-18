# NutriVida → Munchi: auditoria (fase 0)

Ficheiro auditado: [`nutrivida-original.html`](nutrivida-original.html). Um único HTML com cerca de 72 KB, sem dependências além das Google Fonts.

## 1. Arquitetura real

| Camada | O que existe |
|---|---|
| Framework | Nenhum. HTML, CSS e JS num só ficheiro, com código compactado à mão. |
| Dados | `localStorage`, chave `nutrivida`, um único objeto `S`. Só neste aparelho, sem sincronização. |
| Autenticação | Não existe. |
| Base de dados / servidor | Não existe. |
| IA | `claude.use("sample")`: o runtime dos artefactos do Claude. **Só funciona quando a app é aberta como artefacto no Claude.** Fora disso, a análise por foto e o assistente ficam desligados (o aviso já está implementado). |
| Base de dados de alimentos | Não existe. |
| Código de barras | Não existe. |
| Traduções | Não existem. Só pt-PT, com o texto escrito diretamente no HTML. |
| Testes | Nenhum. |

## 2. Funcionalidades: estado

**Funcionam (código lido; ainda não testado num browser):**
- Onboarding: nome, objetivo, alimentação, alergias e escalão de idade.
- Diário do dia por refeição: pequeno-almoço, almoço, lanche e jantar, com opção de remover.
- Foto → IA → itens editáveis (nome, porção, kcal) → guardar no diário. As macros são ajustadas na proporção das kcal editadas.
- Registo manual, só com kcal (sem macros).
- Água: copos e ml, com gráfico de 7, 14 ou 30 dias.
- 9 receitas fixas no código, com filtros (alergias, vegetariano, vegan, sem lactose, sem glúten), favoritos, "Preparei" e "Planear hoje".
- Planeador semanal → lista de compras gerada a partir das receitas planeadas, com histórico de listas.
- Bem-estar (sono, atividade, energia, humor, hábitos), assistente de chat, conquistas, notificações internas, tema, cor, sons e animações reduzidas.
- Exportação JSON/CSV, importação, apagar tudo.
- Para menores, já esconde as metas de kcal e a calculadora (`body.min`).

**Em falta face ao briefing:** pesquisa numa base de dados de alimentos, código de barras, editar refeições já guardadas, refeições favoritas e repetir refeições, fotografia nas receitas, lembretes de água, desafios diários, resumo semanal, roda de recompensas, mascote, premium, autenticação e traduções.

## 3. Problemas encontrados

1. **A app viola o teu próprio briefing de segurança.** A calculadora tem "Perder peso devagar" (−300 kcal), que é um défice calórico prescrito. A barra de kcal fica laranja de aviso quando se passa a meta, e a estatística "Perto da referência" pontua os dias por kcal. A secção 10 do briefing proíbe as três coisas.
2. **O "não é um contador de calorias" é contradito pelo ecrã principal.** O primeiro elemento do ecrã Hoje é um número grande de kcal com meta. Se a promessa é diferente, o herói tem de mudar.
3. **Os valores nutricionais das receitas não têm fonte.** Estão rotulados como "estimativa aproximada", o que é honesto, mas o briefing pede dados verificados ou estimativas claramente rotuladas com origem.
4. **A IA não sinaliza incerteza por alimento.** O pedido devolve uma única "observacao". Não há confiança por item nem um caminho de "foto pouco clara, diz-me o que é". O briefing pede as duas coisas.
5. **A IA depende do Claude.** Como produto real, fora do Claude, não há análise de fotos nem assistente. Para resolver isto, é preciso um servidor com uma chave de API protegida.
6. **O registo manual não tem macros nem porção.** É só "nome + kcal".
7. **Os emojis são a iconografia** (água 💧▫️, receitas, conquistas, splash). O briefing pede para evitar "random emojis".
8. **O código é compactado à mão**, com funções sobrepostas por wrappers (`{const o=uDraw;uDraw=function(){...}}`). Cada nova fase neste formato fica mais frágil. Funciona, mas não escala para a lista do briefing.

## 4. Riscos que o briefing não vê

- **O nome "Munchi" já está ocupado no mesmo nicho.** Existe uma app chamada [Munchi](https://meliann.notion.site/Privacy-Policy-for-Munchi-283476f8f04180fcb55bf04993b70679) que faz exatamente análise nutricional de fotos com IA (política de privacidade de outubro de 2025). Existe também a [MyMunchi – Macros & Calories](https://apps.apple.com/app/id6761280597) na App Store. Não encontrei registo de marca, mas isso não prova que não exista: falta pesquisar no EUIPO, no INPI e no WIPO. Investir em mascote e identidade sobre este nome, sem verificar, é um risco direto.
- **Roda com prémio final garantido.** Se o terceiro giro dá sempre o prémio dourado, a roda é teatro. Pode existir, mas tem de dizer "garantido" antes de girar, e os giros 1 e 2 têm de ser aleatórios a sério e mostrar as probabilidades. O briefing exige isto, e tenho de o implementar à letra. Com utilizadores menores de 18 na app, mantenho prémios só cosméticos, sem dinheiro e sem compras.
- **"Premium temporário" e "descontos de parceiros" não existem.** Não há sistema premium nem acordos com parceiros. Enquanto não existirem, não entram na roda, para não prometer o que não existe.
- **Código de barras no iPhone:** o Safari para iOS não suporta a `BarcodeDetector` de origem (só atrás de uma flag, e com bugs: [caniuse](https://caniuse.com/mdn-api_barcodedetector), [WebKit 281848](https://bugs.webkit.org/show_bug.cgi?id=281848)). Seria preciso uma biblioteca WASM (ZXing) e uma base como a Open Food Facts. Falta testar se o sandbox dos artefactos do Claude permite pedidos de rede para a API da Open Food Facts. Não testei, por isso não afirmo nem que sim nem que não.

## 5. Decisão que bloqueia tudo o resto: onde vive a app

| Opção | Dá | Não dá |
|---|---|---|
| **A. Continuar como artefacto do Claude (1 ficheiro)** | IA a funcionar já, custo zero, rapidez | Autenticação, sincronização entre aparelhos, premium/pagamentos, utilizadores fora do Claude |
| **B. App real (ex.: Vite + Supabase + função servidor para a IA)** | Autenticação, BD com permissões, chave de API protegida, premium, PWA | Semanas de trabalho, custos de API por foto, RGPD a sério (dados de saúde = categoria especial, art. 9.º) |

As secções 12 e 13 do briefing (premium, autenticação segura, permissões da BD) **só são possíveis com a opção B**. Com a opção A, prometê-las seria mentir.

## 6. Plano por fases (proposto)

0. ✅ Auditoria (este documento) e cópia do original no repositório.
1. Segurança e honestidade: remover o défice e a perda de peso, tornar a meta de kcal opcional e desligada por defeito, sem cor de aviso; incerteza por item na IA e pedido de clarificação; macros e porção no registo manual; editar e repetir refeições.
2. Marca configurável (objeto `BRAND`, migração da chave de armazenamento sem perder dados), mascote SVG original com estados (olá, curioso, celebra, a pensar, a dormir) e ícones SVG em vez de emojis.
3. Hábitos sem culpa, desafios diários, resumo semanal e roda de recompensas transparente e configurável (prémios cosméticos).
4. Só com a opção B: autenticação, BD, IA no servidor, código de barras, premium, i18n.
