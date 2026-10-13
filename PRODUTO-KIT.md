# Kit de tosquia com aspiração: comparação de modelos e viabilidade

Estado: **modelo por escolher**. O site (`site/`) está preparado para este produto, mas só mostra como factos os dados com `confirmed: true` em `site/assets/js/config.js`.

## 1. O que consegui verificar

As páginas indicadas (neakasa.com e eprolo.com) estão **bloqueadas neste ambiente**: não consegui abri-las. Os dados abaixo vêm de pesquisa web noutras fontes (lojas e manuais). Confirma tudo na página do fornecedor antes de publicar.

| | A — Neakasa P2 Pro | B — EPROLO "7 em 1" | C — EPROLO "2,5 L" |
|---|---|---|---|
| Tipo | Marca registada, vendida pela própria Neakasa e por retalhistas | Produto genérico de catálogo de dropshipping | Produto genérico de catálogo de dropshipping |
| Página do fornecedor | Não acessível daqui | Não acessível daqui | Não acessível daqui |
| Sucção | 10 500 Pa (vários retalhistas); um manual indica 15 000 Pa (contradição) | **Não confirmado** (kits "7 em 1" semelhantes anunciam 11 000–12 000 Pa) | **Não confirmado** (kits de 2,5 L semelhantes anunciam 9 300–14 000 Pa) |
| Depósito | 2 L (não 2,5 L) | Não confirmado (1,2–2,5 L em kits semelhantes) | 2,5 L segundo o título |
| Ruído | 52 dB em modo eco segundo a marca; manual indica máximo de 74 dBA | Não confirmado | Não confirmado |
| Na caixa (segundo a página UE da Neakasa) | Aspirador, escova, ancinho, máquina de corte, escova de limpeza, bocal de fendas, 5 pentes-guia | Não confirmado | Não confirmado |
| Potência / mangueira / cabo | 400 W, mangueira 1,5 m, cabo 2,5 m | Não confirmado | Não confirmado |
| Versão UE | Há SKUs "EU" na loja da marca | Não confirmado | Não confirmado |
| Preço de referência | 159,99 € na Amazon.de (cinzento); a loja da marca mostra preços em USD | Não confirmado | Não confirmado |
| Stock na UE, portes, prazo, devoluções, garantia | Não confirmado | Não confirmado | Não confirmado |

### Diferenças importantes
- **A é um produto de marca.** Não o podes vender como "Popei", nem usar as fotografias da Neakasa, sem autorização da marca ou um acordo de revenda. Como referência de qualidade e de preço de mercado (~160 €) é útil.
- **B e C são genéricos.** As especificações variam muito entre vendedores de produtos que parecem iguais, por isso só valem os números da ficha do teu fornecedor, confirmados com uma amostra.
- **Nenhum dos três corresponde aos teus anúncios do Canva.** Esses anúncios mostram um **rolo tira-pelos manual** (sem fio, sem motor). Um aspirador de tosquia é outro produto: elétrico, mais caro, com outras regras. **Não os uses para este produto.**

## 2. Os teus anúncios no Canva

A integração com o Canva funciona: encontrei os designs deste projeto.
- "Shedless: all ads" (7 páginas: 4 verticais 9:16, 3 de feed 4:5)
- "Post para Instagram - Deixa de comprar recargas…", "Ad Comparing Pelinho with Traditional Rollers", "A sua história - Pelos do cão no sofá? 10 segundos.", "Before and After Dog Hair Cleaning Ad", "Vibrant Dog Hair Removal Advertisement", "Dynamic Comparison Ad for Pelinho", "Post para Instagram - Deixa de comprar recargas!", "A sua história - Pelinhos na Sofá? Resolva Rápido!"

Todos são do **rolo**. Os restantes designs da conta (apresentações sobre fotografia, cinema, etc.) não têm relação com o negócio e não lhes toquei.

Não consigo copiar os ficheiros do Canva para o projeto: os endereços de transferência do Canva estão bloqueados neste ambiente. Quando tiveres anúncios **do kit de tosquia**:
1. No Canva: **Partilhar → Transferir → PNG** (imagens) ou **MP4** (vídeos) → todas as páginas.
2. Copia os ficheiros para `site/assets/img/anuncios/` (ou anexa-os aqui na conversa).
3. Em `config.js`, acrescenta-os a `ads` (faixas 2:1 entre secções) ou a `product.images` (galeria quadrada). Não uses formatos verticais 9:16 como faixa: ficam melhor em `media.videos`.

## 3. Fotografias do produto
- Usa só fotografias **do modelo que vais vender**, com autorização do fornecedor (normalmente as da ficha do produto podem ser usadas por quem o revende; confirma por escrito).
- Guarda-as em `site/assets/img/kit/` (WebP ou JPG, 1200×1200, < 200 KB cada) e lista-as em `product.images`. Os espaços tracejados da galeria desaparecem sozinhos.
- Melhor ainda: fotografias tuas com a amostra.

## 4. Antes de vender: lista de verificação (tudo pendente)
- [ ] Envio direto para Portugal e armazém na UE (evita alfândega e atrasos)
- [ ] Preço por unidade, portes e custos extra (IVA de importação, se vier de fora da UE)
- [ ] Prazo de entrega real (medido com uma encomenda de teste)
- [ ] Política de devoluções do fornecedor (tu tens de aceitar 14 dias por lei)
- [ ] Garantia do fornecedor (tu respondes pela garantia legal perante o cliente)
- [ ] **230 V e ficha europeia (tipo F)**, não 110 V nem ficha americana
- [ ] **Marcação CE** com declaração de conformidade (diretivas de baixa tensão, compatibilidade eletromagnética e RoHS)
- [ ] Pessoa responsável na UE (GPSR) identificada na embalagem
- [ ] Manual e avisos de segurança em português
- [ ] Margem: com o preço de mercado de referência (~160 € para o modelo de marca), calcula a margem real em `calculadora/index.html`

Quando confirmares um modelo: preenche `specs`, `accessories`, `product.price`, `product.images` e `shipping` em `config.js` (mudando `confirmed` para `true`), retira `product.status` e põe `demo: false`.

## Fontes
- Neakasa P2 Pro (loja da marca): https://neakasa.com/products/neakasa-p2-pro-dog-grooming-kit-vacuum
- Amazon.de (preço UE): https://www.amazon.de/-/en/Neakasa-Clipper-Generation-Professional-Grooming/dp/B0BDF62D4V
- Best Buy: https://www.bestbuy.com/product/neakasa-p2-pro-pet-grooming-system/J3Q5QC3LPH
- Manual (device.report): https://device.report/manual/6842293
- SG Smart Paw: https://www.sgsmartpaw.com/products/neabot-pet-grooming-p2-pro
- Kits 7 em 1 semelhantes (Amazon): https://www.amazon.com/7-1-pet-grooming-vacuum-kit/s?k=7+in+1+pet+grooming+vacuum+kit
- Kits 2,5 L semelhantes (Walmart): https://www.walmart.com/ip/Dog-Cat-Grooming-Kit-Vacuum-Suction-99-Pet-Hair-Professional-Pet-Grooming-Vacuum-Kit-5-Grooming-Shedding-Tools-2-5L-Dust-Cup-Low-Noise-Clippers-Trimm/2596861641 · https://www.elspet.com/products/els-pet-groomdora
