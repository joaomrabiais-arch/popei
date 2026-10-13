/*
 * CONFIGURAÇÃO DA LOJA POUPEI — o único ficheiro a editar para marca, produto, preço e textos.
 *
 * Produto: kit de escovagem com aspiração (fornecedor candidato: anúncio AliExpress 1005007620899124,
 * "Dog Grooming Kit Pet Vacuum Cleaner ... 2.3L"). Ver PRODUTO-KIT.md.
 *
 * Estados de cada dado:
 *   status: "verificado"  → confirmado por ti (amostra, documento do fornecedor)
 *   status: "fornecedor"  → só declarado no anúncio do fornecedor (aparece "segundo o fornecedor")
 *   status: "pendente"    → desconhecido (aparece "A confirmar")
 *
 * Para começar a vender: preço em product.price, link de compra em product.checkoutUrl,
 * fotografias do fornecedor em product.images e demo: false.
 * A loja anterior (rolo tira-pelos) está em config-rolo.js.
 */
window.SITE = {
  layout: "pdp",   // página de produto de loja online (galeria + compra no topo)
  demo: true,
  demoMessage: "Pré-lançamento · preço e prazos por confirmar · imagens ilustrativas até termos as fotografias do fornecedor",

  brand: {
    name: "Poupei",
    tagline: "Escova e aspira o pelo do teu cão ou gato.",
    logo: "",
  },

  theme: { accent: "#1f6f68", accentInk: "#ffffff", accentDark: "#5cc0b2", accentDarkInk: "#0b1715" },

  locale: "pt-PT",
  currency: "EUR",

  contact: { email: "", phone: "", instagram: "", tiktok: "" },
  forms: { endpoint: "" },   // ex.: "https://formspree.io/f/xxxxxxx"

  nav: [
    { label: "O kit", href: "index.html#produto" },
    { label: "Como funciona", href: "index.html#como-funciona" },
    { label: "Perguntas", href: "index.html#perguntas" },
    { label: "Contacto", href: "contacto.html" },
  ],

  trust: [
    { icon: "return", text: "14 dias para desistir" },
    { icon: "shield", text: "Garantia legal" },
    { icon: "chat",   text: "Apoio em português" },
  ],

  product: {
    name: "Kit de Escovagem com Aspiração",
    badge: "Pré-lançamento",
    pitch: "Escovas o teu cão ou gato e o pelo solto vai direto para o depósito, em vez de ficar no chão, no sofá e na roupa.",
    price: null,              // ex.: 89.90 — null = "Preço em breve"
    compareAtPrice: null,     // só se já praticaste esse preço
    checkoutUrl: "",          // link de compra (Shopify). Pode conter {qty} para a quantidade.
    images: [
      { src: "assets/img/kit/kit-1-produto.jpg",        alt: "Aspirador com depósito transparente, mangueira e escova" },
      { src: "assets/img/kit/kit-2-acessorios.jpg",     alt: "Escova de cerdas, pente e ferramenta tira-subpelo" },
      { src: "assets/img/kit/kit-3-deposito.jpg",       alt: "Depósito de pelo de 2,3 litros" },
      { src: "assets/img/kit/kit-4-como-funciona.jpg",  alt: "Escova, aspira e esvazia" },
      { src: "assets/img/kit/kit-5-casa.jpg",           alt: "Sofá e chão com pelo e sem pelo" },
    ],
    imagesAreIllustrations: true,   // false quando puseres as fotografias do fornecedor
    bullets: [
      "Escova e aspira ao mesmo tempo",
      "Depósito transparente de 2,3 L (segundo o fornecedor)",
      "Para cães e gatos",
    ],
    description: "Um aspirador compacto com mangueira, onde encaixas a escova ou o pente. Enquanto escovas, a sucção puxa o pelo solto para o depósito. No fim, abres o depósito e deitas o pelo fora.",
  },

  specs: [
    { label: "Capacidade do depósito", value: "2,3 L",                       status: "fornecedor" },
    { label: "Ficha",                  value: "Europeia (opção do fornecedor)", status: "fornecedor" },
    { label: "Potência de sucção",     value: "",                            status: "pendente" },
    { label: "Ruído",                  value: "",                            status: "pendente" },
    { label: "Níveis de sucção",       value: "",                            status: "pendente" },
    { label: "Comprimento da mangueira", value: "",                          status: "pendente" },
    { label: "Marcação CE",            value: "",                            status: "pendente" },   // pedir declaração de conformidade
  ],

  accessories: [
    { name: "Escova de cerdas",          status: "fornecedor" },
    { name: "Pente",                     status: "fornecedor" },
    { name: "Ferramenta tira-subpelo",   status: "fornecedor" },
  ],

  shipping: [
    { icon: "truck",  title: "Envio",        text: "Prazo e custo para Portugal por confirmar com o fornecedor.", status: "pendente" },
    { icon: "return", title: "Devoluções",   text: "14 dias após a receção para desistir da compra, sem indicar motivo.", status: "verificado" },
    { icon: "shield", title: "Garantia",     text: "Garantia legal de conformidade dos bens de consumo.", status: "verificado" },
  ],

  problem: {
    eyebrow: "O problema",
    title: "A escova tira o pelo do animal. E põe-no na tua casa.",
    points: [
      { icon: "home",  title: "Fica no chão e no sofá",     text: "O pelo solto que sai na escova cai à volta e espalha-se." },
      { icon: "shirt", title: "Agarra-se à roupa",          text: "Quem escova acaba coberto de pelo, sobretudo na muda." },
      { icon: "clock", title: "Duas tarefas em vez de uma", text: "Primeiro escovas, depois aspiras o que ficou para trás." },
    ],
  },

  story: {
    eyebrow: "Como funciona",
    title: "Escova. Aspira. Esvazia.",
    steps: [
      { image: "assets/img/kit/kit-2-acessorios.jpg",    title: "Encaixa o acessório",     text: "Escova de cerdas, pente ou tira-subpelo, na ponta da mangueira." },
      { image: "assets/img/kit/kit-4-como-funciona.jpg", title: "Escova como de costume",  text: "Enquanto escovas, a sucção puxa o pelo solto para dentro da mangueira." },
      { image: "assets/img/kit/kit-3-deposito.jpg",      title: "Esvazia o depósito",      text: "O pelo fica no depósito transparente. Quando enche, abres e esvazias." },
    ],
  },

  compare: {
    title: "Escova normal vs kit com aspiração",
    cols: ["Escova normal", "Kit Poupei"],
    rows: [
      ["Pelo solto depois de escovar", "Fica à volta", "Vai para o depósito"],
      ["Aspirar no fim",               "Sim",          "Menos necessário"],
      ["Precisa de tomada",            "Não",          "Sim"],
      ["Preço",                        "Mais barata",  "Mais cara"],
    ],
  },

  faq: [
    { q: "Quando começam as vendas?", a: "Assim que confirmarmos o preço, o prazo de entrega e a documentação com o fornecedor. Quem está na lista de espera sabe primeiro." },
    { q: "Serve para cães e gatos?", a: "Sim, o kit é anunciado para cães e gatos. Vamos indicar os tipos de pelo recomendados depois de testarmos a amostra." },
    { q: "O barulho assusta o animal?", a: "Ainda não confirmámos o nível de ruído. Em geral, ajuda habituar o animal aos poucos, começando no nível de sucção mais baixo." },
    { q: "A ficha é europeia?", a: "O fornecedor indica uma opção com ficha europeia. Só vendemos a versão para 230 V com ficha europeia." },
    { q: "Posso devolver?", a: "Sim. Na União Europeia tens 14 dias após a receção para desistir de uma compra online sem indicar o motivo." },
  ],

  interest: {
    title: "Avisamos-te quando abrir",
    text: "Deixa o teu email e recebes o aviso com o preço de lançamento e o prazo de entrega confirmados.",
    button: "Avisar-me",
  },

  legal: { company: "", nif: "", address: "", euResponsible: "", adrEntity: "", lastUpdated: "" },

  footer: {
    columns: [
      { title: "Poupei", links: [
        { label: "O kit", href: "index.html#produto" },
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
