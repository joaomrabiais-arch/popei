# Criar o produto na Shopify

## Opção 1 (recomendada): importar pelo TeemDrop
Assim o produto fica ligado ao fornecedor e as encomendas seguem sozinhas.
1. Na app TeemDrop, procura "pet hair remover roller", escolhe o fornecedor com mais avaliações e prazo para Portugal, e carrega em "Import"/"Push to store".
2. Na Shopify, abre o produto importado e substitui o título, a descrição, as variantes e os preços pelos de `produto-pelinho.csv` (abre-o no Excel ou no Google Sheets).

## Opção 2: importar o ficheiro CSV
Shopify → Produtos → Importar → escolhe `produto-pelinho.csv`.
Cria o produto como **rascunho**, com 3 variantes (1, 2 e 3 rolos), descrição e SEO.
Depois tens de o **associar ao fornecedor** dentro da app TeemDrop. Sem isso, as encomendas não são enviadas.

## Depois de importar
- Fotos: as tuas, com a amostra (mínimo 4) e 1 vídeo.
- Definições → Envio: "Envio grátis" para Portugal.
- Definições → Políticas: gera as políticas de reembolso, privacidade e termos e acrescenta o prazo de 14 dias.
- Rodapé: nome, NIF, morada, email, Livro de Reclamações Eletrónico e entidade RAL (ver `loja/index.html`).
- Só depois mudas o estado de "Rascunho" para "Ativo".
