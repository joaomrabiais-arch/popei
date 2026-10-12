# Site base

Site estático (HTML, CSS e JavaScript, sem bibliotecas nem passo de compilação) da marca **Popei**, configurado para o rolo tira-pelos reutilizável. Para mudar de produto, basta editar `assets/js/config.js`.

As imagens (`assets/img/produto/`) e os vídeos (`assets/video/`) são ilustrações geradas a partir de `media-fonte/` (`node media-fonte/render.js`). Substitui-os pelas fotografias e vídeos reais do produto e põe `product.imagesAreIllustrations: false`.

## Estrutura
```
site/
├── index.html            página inicial (secções montadas a partir de config.js)
├── contacto.html         formulário de contacto
├── 404.html              página de erro (usa caminhos absolutos: o site tem de estar na raiz do domínio)
├── legal/                privacidade, termos, envios, devoluções (rascunhos para rever)
├── assets/
│   ├── css/site.css      sistema visual: cores, tipografia, componentes, animações, modo escuro
│   ├── js/config.js      ← O ÚNICO FICHEIRO A EDITAR para marca, cores, textos, produto, FAQ, contactos, dados legais
│   ├── js/main.js        monta cabeçalho, rodapé e secções; menu; FAQ; galeria; formulários; animações
│   └── img/              favicon.svg, apple-touch-icon.png, og.png (imagem para partilhas)
├── robots.txt, sitemap.xml, site.webmanifest
```

## Como adaptar ao produto
1. Em `assets/js/config.js`, preenche `product` (nome, descrição, preço, imagens, destaques, `checkoutUrl`).
2. Substitui todo o conteúdo marcado `// DEMO` por conteúdo real, ou apaga-o. Uma secção com a lista vazia (`[]`) deixa de aparecer.
3. Muda `brand.name`, `brand.tagline`, `theme.accent` (e `accentDark`) para a identidade final. Para um logótipo próprio, põe o ficheiro em `assets/img/` e indica-o em `brand.logo`.
4. Põe `demo: false` quando já não houver conteúdo provisório. Isso remove a faixa amarela "Versão de demonstração".
5. Atualiza o `<title>` e a `<meta name="description">` de cada página .html, o `og.png`, o `favicon.svg` e o domínio em `robots.txt` e `sitemap.xml`.

## O que funciona de verdade
- Navegação, menu móvel (Esc fecha, foco gerido), perguntas frequentes acessíveis, galeria de imagens.
- Validação dos formulários com mensagens de erro claras, foco no primeiro erro e proteção simples contra spam (campo escondido).
- Envio real dos formulários **assim que configurares `forms.endpoint`** (por exemplo Formspree: cria a conta, cria um formulário e cola o URL). Até lá, o formulário diz explicitamente que nada foi enviado.
- Ofertas (1 rolo / 2 rolos / Leve 3, pague 2): o preço e o botão mudam com a escolha; os preços riscados são calculados a partir do preço real de 1 unidade.
- Botão de compra: se `product.checkoutUrl` (ou `checkoutUrl` de cada oferta) estiver preenchido, leva ao checkout; caso contrário, leva à lista de espera.
- Faixas de anúncio espalhadas pela página (`ads` em config.js); a do pack de 3 escolhe essa oferta.
- Vídeos que só tocam quando estão visíveis (sem som), e comparação antes/depois que se arrasta.
- Animações de entrada e de scroll, que respeitam `prefers-reduced-motion`. Modo escuro automático.

## O que ainda NÃO existe (depende de decisões tuas)
- Produto, fotografias, preço e checkout (Shopify, Stripe Payment Links, etc.).
- Serviço de envio dos formulários (`forms.endpoint`).
- Dados legais (empresa, NIF, morada, entidade RAL, responsável na UE) e revisão jurídica das páginas legais.
- Domínio e alojamento. Qualquer alojamento estático serve (Netlify, Vercel, Cloudflare Pages, GitHub Pages na raiz do domínio): basta publicar a pasta `site/`.
- Cookies e análise (Meta Pixel, Google Analytics): se os ativares, é obrigatório pedir consentimento antes.

## Pré-visualizar e testar
```
npm install            # instala o Playwright (só é usado nos testes)
npx playwright install chromium
npm start              # http://localhost:4173
npm test               # abre cada página num browser real e verifica links, menu, FAQ, formulários, consola e responsividade
```
