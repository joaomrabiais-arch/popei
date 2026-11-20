# AvocoraFit: guia de estilo

Este é o guia único de design da app. Todas as alterações visuais seguem isto. Os valores vivem em `app/src/css/08-guia-estilo.css` (tokens) e `app/src/css/06-registo-treino.css` (macros).

## Ideia

**Uma horta, não um spa.** Verde de folha, comida a sério e um abacate simpático (o Abi). Calma, sem pressão e sem culpa.

**A marca do ecrã:** o Abi e as fotos da comida. O resto fica quieto.

## Evitar: a "cara de IA"

Nada disto entra na app:
- degradês roxos;
- emojis soltos;
- fundo creme com títulos serifados enormes (o "estilo Claude");
- botões a brilhar;
- faixas coloridas na lateral dos cartões;
- números gigantes por cima de etiquetas pequenas sem motivo;
- 01 / 02 / 03 em coisas que não são uma sequência.

## Cores

| Papel | Claro | Escuro | Contraste |
|---|---|---|---|
| Fundo | `#F4F6F3` | `#0F1411` | — |
| Superfície (cartões) | `#FFFFFF` | `#171D19` | — |
| Texto | `#142019` | `#EEF2EE` | 15,5:1 |
| Texto secundário | `#56635A` | `#9AA89F` | 5,8:1 / 7,4:1 |
| Texto discreto | `#646F68` | `#86948B` | ≥ 4,5:1 em branco |
| Marca (ações principais) | `#2F6B3A` | `#8FBF8A` | branco sobre marca 6,4:1 |
| Água | `#2F78B8` | `#6CB1E6` | branco sobre água 4,7:1 |
| Proteína / Hidratos / Gordura | `#D9546E` / `#D9A23B` / `#4F8FD6` | `#D65C74` / `#BB8A34` / `#5290D6` | validadas para daltonismo |

**Regras:**
- Cada cor tem um só significado.
- O verde da marca é só para a ação principal e o estado ativo.
- O texto nunca usa a cor de um macro; essa cor vai só no ponto ou na barra ao lado.

## Letra

- **Texto e controlos:** letra do sistema (SF no iPhone, Roboto no Android), 16 px no corpo e no mínimo 11 px.
- **Títulos e números:** Bricolage Grotesque, peso 600.
  - h1: 26 px, um por ecrã;
  - secções: 18 px;
  - números grandes: só no anel do dia.

## Espaço e forma

- Margem lateral de 20 px; espaços em múltiplos de 4 (8, 12, 16, 24).
- Cantos arredondados: 12 px nos controlos, 16 px nos cartões, 24 px nas folhas que sobem de baixo.
- Toque mínimo: 44 × 44 px.

## Hierarquia

- Cada ecrã responde a uma pergunta. Hoje: "o que como a seguir e como vai o meu dia".
- A ação principal é o único botão verde cheio. As outras ações são suaves ou só texto.
- Menos é mais: se uma secção repete o que outro separador já faz, sai.

## Personalidade e microinterações

- **O Abi** fala nos momentos-chave: início, fim, conquistas e o próximo passo. Nunca em todos os ecrãs.
- **Toques:** o que se toca encolhe ligeiramente (escala 0,97) e dá uma microvibração no Android. Os sons estão ligados por omissão e desligam-se no Perfil.
- **Animação:** curta (até 0,35 s) e com significado. Respeita "reduzir movimento".

## Imagens

- **Receitas:** foto real com licença livre e crédito, ou imagem gerada por IA assinalada como "ilustrativa".
- **Sem imagem:** a ilustração própria da refeição (`07b-arte.js`).
