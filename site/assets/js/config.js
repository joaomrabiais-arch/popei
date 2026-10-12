/*
 * CONFIGURAÇÃO DO SITE — o único ficheiro a editar para adaptar a marca e o produto.
 *
 * Tudo o que está marcado com  // DEMO  é conteúdo provisório de demonstração.
 * Enquanto `demo` for true, o site mostra uma faixa "Versão de demonstração" no topo.
 * Secções cujo conteúdo esteja vazio ([] ou "") não aparecem no site.
 *
 * O título e a descrição de cada página (SEO) estão no <head> de cada ficheiro .html,
 * porque as redes sociais e alguns motores de pesquisa não executam JavaScript.
 */
window.SITE = {
  demo: true,

  brand: {
    name: "Popei",                                   // nome provisório (nome do repositório)
    tagline: "Produtos simples que resolvem problemas reais.", // DEMO
    // Logótipo: deixa vazio para usar a marca gerada (inicial + nome). Ou indica um ficheiro, ex.: "assets/img/logo.svg"
    logo: "",
  },

  // Cores principais. O resto da paleta (fundos, linhas, texto) é neutro e adapta-se ao modo escuro.
  theme: {
    accent: "#2a49d6",       // cor da marca: botões, links, destaques
    accentInk: "#ffffff",    // cor do texto por cima da cor da marca
    accentDark: "#7d93ff",   // versão da cor da marca para o modo escuro
    accentDarkInk: "#0b1020",
  },

  locale: "pt-PT",
  currency: "EUR",

  contact: {
    email: "",               // ex.: "ola@popei.pt" — aparece no rodapé e na página de contacto
    phone: "",
    instagram: "",           // URL completo
    tiktok: "",              // URL completo
  },

  // Formulários (lista de espera e contacto).
  // Sem endpoint, os formulários validam os dados mas NÃO enviam nada e dizem-no ao visitante.
  // Exemplo com Formspree: endpoint: "https://formspree.io/f/xxxxxxx"  (cria a conta em formspree.io)
  forms: {
    endpoint: "",
  },

  nav: [
    { label: "Produto", href: "index.html#produto" },
    { label: "Como funciona", href: "index.html#como-funciona" },
    { label: "Perguntas", href: "index.html#perguntas" },
    { label: "Contacto", href: "contacto.html" },
  ],

  hero: {
    eyebrow: "Em breve",                                                   // DEMO
    title: "Um produto pensado para o teu dia a dia.",                       // DEMO
    subtitle: "Estamos a preparar o lançamento. Entra na lista de espera e és dos primeiros a saber quando estiver disponível.", // DEMO
    primary: { label: "Entrar na lista de espera", href: "#interesse" },
    secondary: { label: "Ver como funciona", href: "#como-funciona" },
  },

  // Garantias e serviços mostrados em faixa. Só coloca aqui o que vais mesmo cumprir.
  trust: [
    { icon: "truck",  text: "Envio com seguimento" },        // DEMO
    { icon: "lock",   text: "Pagamento seguro" },            // DEMO
    { icon: "chat",   text: "Apoio em português" },          // DEMO
    { icon: "return", text: "Devolução em 14 dias" },        // direito legal na UE para compras online
  ],

  product: {
    name: "",                 // ex.: "Nome do produto"  — vazio = "Produto em preparação"
    description: "",          // uma ou duas frases
    price: null,              // número, ex.: 24.90  — null = sem preço visível
    compareAtPrice: null,     // só se já praticaste esse preço (Diretiva Omnibus)
    images: [],               // ex.: ["assets/img/produto-1.webp", "assets/img/produto-2.webp"]
    highlights: [],           // ex.: ["Sem pilhas", "Lavável"]
    checkoutUrl: "",          // link de compra (Shopify, Stripe Payment Link…). Vazio = botão da lista de espera
  },

  value: {
    title: "O problema que queremos resolver",                                       // DEMO
    problem: "Descreve aqui, em duas ou três frases, a frustração concreta do teu cliente antes de ter o produto.", // DEMO
    solution: "E aqui, como o produto a resolve. Usa a linguagem do cliente, não a do fornecedor.",               // DEMO
  },

  benefits: [
    { icon: "spark",  title: "Benefício principal",  text: "O resultado mais importante que o cliente obtém." },  // DEMO
    { icon: "clock",  title: "Poupa tempo",          text: "Exemplo: quanto tempo ou esforço o produto evita." },  // DEMO
    { icon: "leaf",   title: "Feito para durar",     text: "Exemplo: materiais, reutilização ou durabilidade." },  // DEMO
    { icon: "box",    title: "Pronto a usar",        text: "Exemplo: o que vem na caixa e como se começa." },      // DEMO
  ],

  media: {
    title: "Vê em ação",                 // DEMO
    video: "",                           // ex.: "assets/video/demo.mp4"
    poster: "",
    images: [],                          // imagens de demonstração (aparecem se não houver vídeo)
  },

  steps: [
    { title: "Escolhe", text: "Explica o primeiro passo do cliente." },        // DEMO
    { title: "Recebe",  text: "Explica como e quando recebe a encomenda." },   // DEMO
    { title: "Usa",     text: "Explica o momento em que o produto resolve o problema." }, // DEMO
  ],

  faq: [
    { q: "Quando é o lançamento?", a: "Ainda não há data. Quem estiver na lista de espera recebe a informação primeiro." },          // DEMO
    { q: "Para onde enviam?", a: "Define aqui os países e os prazos reais de entrega." },                                              // DEMO
    { q: "Posso devolver?", a: "Sim. Na União Europeia tens 14 dias para desistir de uma compra online sem indicar o motivo." },
    { q: "Como entro em contacto?", a: "Pela página de contacto. Respondemos em português." },                                       // DEMO
  ],

  interest: {
    title: "Sê dos primeiros a saber",                                                  // DEMO
    text: "Deixa o teu email e avisamos-te quando o produto estiver disponível. Sem spam.", // DEMO
    button: "Avisar-me",
  },

  // Dados legais obrigatórios para vender online em Portugal. Vazio = aparece "[a preencher]".
  legal: {
    company: "",          // nome ou empresa
    nif: "",
    address: "",
    euResponsible: "",    // pessoa responsável na UE (GPSR), se vendes produtos importados
    adrEntity: "",        // entidade de Resolução Alternativa de Litígios
    lastUpdated: "",      // data da última revisão das páginas legais, ex.: "2026-10-12"
  },

  footer: {
    columns: [
      { title: "Site", links: [
        { label: "Produto", href: "index.html#produto" },
        { label: "Como funciona", href: "index.html#como-funciona" },
        { label: "Perguntas", href: "index.html#perguntas" },
      ]},
      { title: "Ajuda", links: [
        { label: "Contacto", href: "contacto.html" },
        { label: "Envios", href: "legal/envios.html" },
        { label: "Devoluções", href: "legal/devolucoes.html" },
      ]},
      { title: "Legal", links: [
        { label: "Privacidade", href: "legal/privacidade.html" },
        { label: "Termos e condições", href: "legal/termos.html" },
        { label: "Livro de Reclamações", href: "https://www.livroreclamacoes.pt", external: true },
      ]},
    ],
  },
};
