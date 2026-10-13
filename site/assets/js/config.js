/*
 * CONFIGURAÇÃO DO SITE — o único ficheiro a editar para adaptar a marca e o produto.
 *
 * Produto: kit de tosquia/escovagem com aspiração para cães e gatos.
 * O MODELO AINDA NÃO ESTÁ ESCOLHIDO (ver PRODUTO-KIT.md na raiz do projeto).
 * Regra: só ficam visíveis como factos os campos com confirmed: true.
 * Campos com confirmed: false aparecem como "A confirmar". Não publiques valores do fornecedor sem os verificar.
 *
 * A loja anterior (rolo tira-pelos) está guardada em config-rolo.js.
 */
window.SITE = {
  demo: true,
  demoMessage: "Pré-lançamento · modelo, preço e prazos ainda por confirmar · as imagens são ilustrações",

  brand: {
    name: "Popei",
    tagline: "Tosquia e escovagem sem pelo espalhado pela casa.",
    logo: "",
  },

  theme: {
    accent: "#1f6f68",
    accentInk: "#ffffff",
    accentDark: "#5cc0b2",
    accentDarkInk: "#0b1715",
  },

  locale: "pt-PT",
  currency: "EUR",

  contact: { email: "", phone: "", instagram: "", tiktok: "" },

  forms: { endpoint: "" },   // ex.: "https://formspree.io/f/xxxxxxx"

  nav: [
    { label: "O kit", href: "index.html#produto" },
    { label: "Como funciona", href: "index.html#como-funciona" },
    { label: "Características", href: "index.html#caracteristicas" },
    { label: "Perguntas", href: "index.html#perguntas" },
    { label: "Contacto", href: "contacto.html" },
  ],

  hero: {
    visual: "kit",   // ilustração animada do kit (até haver fotografias oficiais)
    eyebrow: "Kit de tosquia com aspiração",
    title: "Escova e tosquia. O pelo vai direto para o depósito.",
    subtitle: "Um só aparelho para escovar, cortar e aspirar o pelo do teu cão ou gato enquanto o tratas. Menos pelo no chão, no sofá e na roupa.",
    primary: { label: "Avisar-me no lançamento", href: "#interesse" },
    secondary: { label: "Como funciona", href: "#como-funciona" },
  },

  // Só o que já é verdade hoje.
  trust: [
    { icon: "return", text: "14 dias para desistir da compra" },   // direito legal na UE
    { icon: "chat",   text: "Apoio em português" },
    { icon: "shield", text: "Garantia legal de conformidade" },   // lei portuguesa, bens de consumo
  ],

  problem: {
    eyebrow: "O problema",
    title: "Escovar resolve o pelo do animal. Não resolve o pelo da casa.",
    points: [
      { icon: "home",  title: "Fica no chão e no sofá",   text: "O pelo solto que sai na escova cai à volta e espalha-se pela casa." },
      { icon: "shirt", title: "Agarra-se à roupa",        text: "Quem escova acaba coberto de pelo, sobretudo na época de muda." },
      { icon: "clock", title: "Duas tarefas em vez de uma", text: "Primeiro escovas, depois aspiras tudo o que ficou para trás." },
    ],
  },

  story: {
    eyebrow: "Como funciona",
    title: "Trata do pelo e limpa ao mesmo tempo",
    steps: [
      { state: "brush", title: "Escolhe o acessório", text: "Escova, pente ou máquina de corte encaixam na ponta da mangueira. Tratas o pelo como de costume." },
      { state: "suck",  title: "A sucção recolhe o pelo", text: "Enquanto escovas ou cortas, o aspirador puxa o pelo solto para dentro da mangueira, antes de cair." },
      { state: "empty", title: "Esvazia o depósito", text: "O pelo fica guardado no depósito do aparelho. Quando estiver cheio, retiras e esvazias." },
    ],
  },

  product: {
    name: "Kit de tosquia com aspiração Popei",
    status: "Modelo em seleção",
    description: "Estamos a testar modelos de fornecedores. Só publicamos fotografias, especificações, acessórios e preço do modelo que escolhermos, depois de os confirmarmos.",
    price: null,          // CONFIRMAR: preço de venda
    compareAtPrice: null,
    images: [],           // fotografias oficiais/autorizadas do modelo escolhido, guardadas em assets/img/kit/
    imageSlots: ["Aparelho completo", "Acessórios incluídos", "Em utilização com um cão", "Depósito de pelo", "Escova na ponta da mangueira", "Dimensões"],
    highlights: [],       // só características confirmadas
    offers: [],
    checkoutUrl: "",
  },

  // Características do modelo escolhido. Preenche value e muda confirmed para true depois de confirmares.
  specs: [
    { label: "Potência de sucção",        value: "", confirmed: false },
    { label: "Níveis de sucção",          value: "", confirmed: false },
    { label: "Ruído",                     value: "", confirmed: false },
    { label: "Capacidade do depósito",    value: "", confirmed: false },
    { label: "Comprimento da mangueira",  value: "", confirmed: false },
    { label: "Comprimento do cabo",       value: "", confirmed: false },
    { label: "Alimentação e ficha",       value: "", confirmed: false },   // tem de ser 230 V, ficha europeia
    { label: "Filtragem",                 value: "", confirmed: false },
    { label: "Marcação CE",               value: "", confirmed: false },
  ],

  // Acessórios realmente incluídos no modelo escolhido: { name, text }
  accessories: [],

  shipping: [
    { icon: "truck",  title: "Envio",               text: "Prazo e custo de envio para Portugal por confirmar com o fornecedor.", confirmed: false },
    { icon: "return", title: "Devoluções",          text: "Tens 14 dias após a receção para desistir da compra, sem indicar motivo.", confirmed: true },
    { icon: "shield", title: "Garantia",            text: "Aplica-se a garantia legal de conformidade dos bens de consumo.", confirmed: true },
    { icon: "plug",   title: "Segurança elétrica",  text: "Marcação CE, ficha europeia e manual em português por confirmar antes do lançamento.", confirmed: false },
  ],

  faq: [
    { q: "Quando é o lançamento?", a: "Assim que tivermos o modelo testado e as condições de envio confirmadas. Quem está na lista de espera sabe primeiro." },
    { q: "Qual é o modelo?", a: "Ainda estamos a comparar modelos. Só publicamos especificações, acessórios e preço depois de os confirmarmos com o fornecedor e de testarmos o aparelho." },
    { q: "Serve para cães e gatos?", a: "Os kits deste tipo são feitos para cães e gatos. Vamos indicar os tipos de pelo recomendados para o modelo escolhido." },
    { q: "O barulho assusta o animal?", a: "O ruído varia entre modelos e vamos publicar o valor do modelo escolhido. Em geral, ajuda habituar o animal aos poucos, começando no nível de sucção mais baixo." },
    { q: "Posso devolver?", a: "Sim. Na União Europeia tens 14 dias após a receção para desistir de uma compra online sem indicar o motivo." },
  ],

  interest: {
    title: "Avisamos-te no lançamento",
    text: "Ainda não estamos a vender. Deixa o teu email e recebes o aviso, com o modelo, o preço e as condições de envio confirmadas.",
    button: "Avisar-me",
  },

  legal: { company: "", nif: "", address: "", euResponsible: "", adrEntity: "", lastUpdated: "" },

  footer: {
    columns: [
      { title: "Popei", links: [
        { label: "O kit", href: "index.html#produto" },
        { label: "Como funciona", href: "index.html#como-funciona" },
        { label: "Características", href: "index.html#caracteristicas" },
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
