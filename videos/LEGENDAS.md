# Vídeos para TikTok e Instagram Reels

Três vídeos animados (1080×1920, 12–13 s) **sem música**, para pores tu o **som em tendência** dentro da app do TikTok ou do Instagram. Não pus música: as músicas com direitos de autor bloqueiam os vídeos de contas comerciais.

| Ficheiro | Ideia | Legenda para colar |
|---|---|---|
| `1-sofa-cheio-de-pelos.mp4` | Sofá cheio de pelos, o rolo limpa, abre e esvazia | O sofá de quem tem cão, todos os dias 🐶 10 segundos e sem fita. #cão #gato #pelosdecão #limpeza #dicasdecasa #portugal |
| `2-fita-vs-pelinho.mp4` | 12 folhas de fita no lixo vs 0 | Quantas folhas de rolo de fita gastas por semana? 👀 #pelosdegato #cão #poupar #dicasdecasa #portugal |
| `3-tres-sitios.mp4` | Sofá, cama, banco do carro | Os 3 sítios onde os pelos do teu cão se escondem. O 3.º é o pior 🚗 #cão #carro #pelos #limpeza #portugal |

## Como publicar
1. Publica um vídeo por dia, entre as 19h e as 22h.
2. Escolhe um som em tendência com volume baixo.
3. Fixa nos comentários: "Link na bio 👆".
4. **Estes vídeos animados são para arrancar.** Quando a amostra chegar, grava vídeos reais (guiões em `PRODUTO.md`). Os vídeos reais convencem muito mais do que animações.

## Vídeos de referência no TikTok (para te inspirares, NÃO para publicar)
Republicar vídeos de outras pessoas é violação de direitos de autor: dá queixa e suspensão da conta. Vê como filmam e faz o teu.
- Pesquisa "pet hair remover roller": https://www.tiktok.com/discover/pet-hair-remover-roller
- Como usar o rolo: https://www.tiktok.com/discover/how-to-use-a-pet-hair-removal-roller
- Rolo no sofá: https://www.tiktok.com/discover/pet-hair-removal-tool-couch
- Exemplo de vídeo de marca (FurViking): https://www.tiktok.com/@furviking_usa/video/7206733367843441966

O que se repete nos vídeos que funcionam: **mostrar o depósito cheio de pelos** no fim, filmar de perto no sofá real e fazer comparações lado a lado com outras ferramentas.

## Editar ou gerar de novo
`fonte/animacao.html` desenha as animações (abre no browser com `#sofa`, `#fita` ou `#sitios` para ver em loop). `fonte/render.js` gera os MP4 com Playwright e ffmpeg.
