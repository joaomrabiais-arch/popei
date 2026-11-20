# Brota: regras do projeto

A Brota é uma app de alimentação e treino em português de Portugal, para telemóvel, sem pressão. A mascote é o Abi, um abacate.

O código-fonte está em `app/src/`. A app final é um só ficheiro, `app/index.html`, gerado a partir dele.

## Comandos

- `npm run build`: monta `app/index.html` a partir de `app/src/` (CSS e JS por ordem alfabética).
- `npm run test:app`: monta a app e corre os testes de ponta a ponta com Playwright. As capturas ficam em `app/capturas/`.
- `npm test`: testes do site.

## Antes de mexer

1. Lê `DESIGN.md` (o guia de estilo) e `app/AUDITORIA.md` (o estado e o que falta).
2. Faz um plano curto e só depois o código.
3. Funcionalidades novas só depois de lançar e testar com pessoas reais. Primeiro corrige e simplifica.

## Critérios de "feito"

- `npm run test:app` sem falhas, e um teste novo para cada comportamento novo.
- Capturas revistas a 390 × 844, em modo claro e escuro, sem texto cortado nem sobreposições.
- Contraste AA: 4,5:1 no texto normal. As cores novas passam pelo validador de paletas.

## Regras que não se quebram

- **Honestidade:**
  - nada de botões que fingem funcionar;
  - nada de descontos, parceiros ou preços inventados;
  - a IA nunca inventa uma análise;
  - valores aproximados dizem-se aproximados;
  - imagens de IA dizem-se ilustrativas.
- **Menores de 18 anos:** sem objetivos de perder peso, sem peso, sem calorias e sem jejum.
- **Segurança:**
  - chaves de API só no servidor (`servidor/`), nunca no browser;
  - tudo o que a pessoa escreve é escapado com `esc()` antes de ir para o ecrã;
  - o servidor de IA tem limite de pedidos e valida o que recebe;
  - contas de utilizador só com uma plataforma pronta (Supabase), nunca feitas à mão.
- **Dados:** nunca perder os dados guardados (`brota_v1`, migração da chave antiga `nutrivida`).
- **Commits:** em português, no ramo de trabalho, com os testes a passar.

## Estrutura

| Pasta | O que tem |
|---|---|
| `app/src/js/` | Módulos numerados: 01 configuração · 05 receitas · 09 plano alimentar · 10 Hoje · 11 registar e IA · 13 planos e compras · 16 perguntas iniciais · 17 treino guiado |
| `app/src/css/` | Estilos; `08-guia-estilo.css` define os tokens finais |
| `servidor/` | Worker da Cloudflare com IA grátis (Llama) |
| `tests/app.test.js` | Testes de ponta a ponta |
