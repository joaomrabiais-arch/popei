/*
 * CONFIGURAÇÃO DO SITE — o único ficheiro a editar para adaptar a marca e o produto.
 *
 * Produto atual: rolo tira-pelos reutilizável (marca Popei).
 * Tudo o que está marcado com  // CONFIRMAR  depende de decisões ou dados que ainda não existem
 * (fornecedor, prazos, envio, fotografias reais). Não publiques sem confirmar.
 * Enquanto `demo` for true, o site mostra a faixa `demoMessage` no topo.
 * Secções com conteúdo vazio ([] ou "") não aparecem no site.
 *
 * O título e a descrição de cada página (SEO) estão no <head> de cada ficheiro .html,
 * porque as redes sociais e alguns motores de pesquisa não executam JavaScript.
 */
window.SITE = {
  demo: true,
  demoMessage: "Pré-lançamento · as imagens são ilustrações até termos as fotografias reais do produto",

  brand: {
    name: "Popei",
    tagline: "Pelos do cão e do gato fora do sofá, sem recargas.",
    logo: "",            // vazio = marca gerada (inicial + nome); ou "assets/img/logo.svg"
  },

  // Cor da marca = cor do produto e dos anúncios.
  theme: {
    accent: "#1f6f68",
    accentInk: "#ffffff",
    accentDark: "#5cc0b2",
    accentDarkInk: "#0b1715",
  },

  locale: "pt-PT",
  currency: "EUR",

  contact: {
    email: "",           // ex.: "ola@popei.pt"
    phone: "",
    instagram: "",
    tiktok: "",
  },

  // Sem endpoint, os formulários validam os dados mas NÃO enviam nada e dizem-no ao visitante.
  // Exemplo com Formspree: endpoint: "https://formspree.io/f/xxxxxxx"
  forms: {
    endpoint: "",
  },

  nav: [
    { label: "Produto", href: "index.html#produto" },
    { label: "Vê em ação", href: "index.html#demonstracao" },
    { label: "Como funciona", href: "index.html#como-funciona" },
    { label: "Perguntas", href: "index.html#perguntas" },
    { label: "Contacto", href: "contacto.html" },
  ],

  hero: {
    eyebrow: "Rolo tira-pelos reutilizável",
    title: "Pelos do cão no sofá? Fora em segundos.",
    subtitle: "Rola para a frente e para trás, abre o depósito e deita o pelo fora. Sem folhas autocolantes, sem recargas, sem pilhas.",
    primary: { label: "Ver as ofertas", href: "#produto" },
    secondary: { label: "Ver em ação", href: "#demonstracao" },
  },

  // Só coloca aqui o que vais mesmo cumprir.
  trust: [
    { icon: "truck",  text: "Envio grátis para Portugal" },  // CONFIRMAR com o fornecedor
    { icon: "lock",   text: "Pagamento seguro" },            // verdadeiro quando o checkout for Shopify/Stripe
    { icon: "chat",   text: "Apoio em português" },
    { icon: "return", text: "14 dias para devolver" },       // direito legal na UE
  ],

  product: {
    name: "Rolo Tira-Pelos Popei",
    description: "Um rolo mecânico que apanha o pelo de cão e de gato de sofás, camas, mantas, alcatifas e bancos do carro. Não usa cola nem folhas: o pelo fica guardado num depósito que abres e esvazias.",
    price: 24.90,
    compareAtPrice: null,      // só se já praticaste esse preço (Diretiva Omnibus)
    images: [
      "assets/img/produto/produto.jpg",
      "assets/img/produto/beneficios.jpg",
      "assets/img/produto/antes-depois.jpg",
      "assets/img/produto/deposito.jpg",
      "assets/img/produto/pack-3.jpg",
      "assets/img/produto/comparacao.jpg",
    ],
    imagesAreIllustrations: true,   // false quando puseres fotografias reais
    highlights: [
      "Sem recargas nem folhas autocolantes",
      "Sem pilhas: funciona só com o movimento",
      "Depósito que abres com um botão",
      "Para pelo de cão e de gato",
    ],
    // Ofertas: o desconto é calculado a partir do preço de 1 unidade (price × quantidade).
    offers: [
      { qty: 1, label: "1 rolo",            note: "Para experimentar",            price: 24.90 },
      { qty: 2, label: "2 rolos",           note: "O 2.º a metade do preço",      price: 37.35 },
      { qty: 3, label: "Leve 3, pague 2",   note: "Casa + carro + um para oferecer", price: 49.80, badge: "Melhor preço", default: true },
    ],
    checkoutUrl: "",           // link de compra (ex.: Shopify). Vazio = botão da lista de espera
  },

  value: {
    title: "Porque não um rolo de fita?",
    problem: "O rolo de fita gasta uma folha a cada poucas passagens. No sofá inteiro acabas com um monte de folhas no lixo e a comprar recargas todos os meses.",
    solution: "O Popei usa sempre a mesma superfície. Rolas, abres o depósito, deitas o pelo fora e está pronto para a próxima vez.",
  },

  benefits: [
    { icon: "return", title: "Reutilizável",       text: "Não há folhas para arrancar nem recargas para comprar." },
    { icon: "spark",  title: "Rápido no sofá",     text: "Pensado para áreas grandes: almofadas, mantas, camas." },
    { icon: "leaf",   title: "Menos lixo",         text: "No lixo vai só o pelo, não folhas de papel autocolante." },
    { icon: "box",    title: "Sem pilhas",         text: "Totalmente mecânico. Não há nada para carregar." },
  ],

  media: {
    title: "Vê em ação",
    subtitle: "Animações ilustrativas. Vamos substituí-las por vídeos reais com o produto.",  // CONFIRMAR
    videos: [
      { src: "assets/video/video-sofa.mp4",   poster: "assets/video/video-sofa.jpg",   label: "O teste do sofá" },
      { src: "assets/video/video-fita.mp4",   poster: "assets/video/video-fita.jpg",   label: "Rolo de fita vs Popei" },
      { src: "assets/video/video-sitios.mp4", poster: "assets/video/video-sitios.jpg", label: "Sofá · cama · carro" },
    ],
    video: "",
    poster: "",
    images: [],
    beforeAfter: { before: "assets/img/produto/antes.jpg", after: "assets/img/produto/depois.jpg", title: "Antes e depois", note: "Arrasta para comparar." },
  },

  // Faixas de anúncio espalhadas pela página inicial (posição definida em index.html com data-ad="N").
  ads: [
    { image: "assets/img/produto/anuncio-recargas.jpg", alt: "Chega de recargas. Rola, abre, esvazia, repete. Comprar.", href: "#produto" },
    { image: "assets/img/produto/anuncio-pelos.jpg",    alt: "Pelos do cão? Fora. Sofá, cama, carro. Ver como funciona.", href: "#como-funciona" },
    { image: "assets/img/produto/anuncio-pack.jpg",     alt: "Leve 3, pague 2. Casa, carro e oferta por 49,80 euros.", href: "#produto", offer: 3 },
  ],

  steps: [
    { title: "Rola", text: "Movimentos curtos para a frente e para trás sobre o tecido. O pelo fica preso e entra no depósito." },
    { title: "Abre", text: "Carrega no botão e o depósito abre. Vês todo o pelo que saiu." },
    { title: "Esvazia", text: "Deita o pelo no lixo e fecha. Está pronto a usar outra vez." },
  ],

  faq: [
    { q: "Em que superfícies funciona?", a: "Funciona melhor em tecidos com alguma textura: sofás, mantas, camas, alcatifas de pelo curto e bancos do carro." },
    { q: "Onde não funciona bem?", a: "Em roupa que enruga, superfícies lisas ou duras e cantos muito pequenos. Para roupa, um rolo de fita continua a ser melhor." },
    { q: "Funciona com pelo de gato?", a: "Sim, com pelo de cão e de gato em tecidos." },
    { q: "Estraga o sofá?", a: "Não usa cola nem lâminas. Em tecidos delicados, experimenta primeiro numa zona escondida." },
    { q: "Como funciona o \"Leve 3, pague 2\"?", a: "Escolhes o pack de 3 e pagas o preço de 2 rolos (49,80 €). Muita gente fica com um em casa, outro no carro e oferece o terceiro." },
    { q: "Quanto tempo demora a entrega?", a: "Vamos indicar aqui o prazo real assim que tivermos confirmado com o fornecedor." },   // CONFIRMAR
    { q: "Posso devolver?", a: "Sim. Na União Europeia tens 14 dias após a receção para desistir de uma compra online sem indicar o motivo." },
  ],

  interest: {
    title: "Avisamos-te no lançamento",
    text: "Ainda não estamos a vender. Deixa o teu email e recebes o aviso quando o Popei estiver disponível.",
    button: "Avisar-me",
  },

  legal: {
    company: "",
    nif: "",
    address: "",
    euResponsible: "",    // pessoa responsável na UE (GPSR): pede ao fornecedor
    adrEntity: "",
    lastUpdated: "",
  },

  footer: {
    columns: [
      { title: "Popei", links: [
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
