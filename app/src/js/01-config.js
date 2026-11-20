"use strict";
/* =========================================================
   CONFIGURAÇÃO — nome, mascotes, prémios e descontos.
   ========================================================= */
const BRAND = {
  name: "AvocoraFit",               // confirmar o registo da marca (INPI/EUIPO) antes de lançar
  tagline: "Come bem, mexe-te, sem pressão.",
  mascot: "Abi",                    // o abacate
  storageKey: "brota_v1",          // não mudar: é onde estão os dados das pessoas
  legacyKeys: ["nutrivida"],        // dados da NutriVida migrados automaticamente
  aiEndpoint: "",                   // URL do servidor grátis com Llama (ver servidor/LEIA-ME.md). Vazio = a IA só funciona dentro do Claude.
  // Conta e cópia na nuvem (Supabase, região UE). A chave "anon" é pública por desenho: a proteção está nas regras RLS de servidor/supabase.sql.
  // Vazio = sem contas; a app funciona só neste aparelho e o Perfil não mostra a opção.
  supabase: { url: "", anonKey: "" }
};
// AvocoraFit Pro: preço previsto pelo dono do projeto (por confirmar). Ainda não há pagamentos na app.
const PRO = { price: 2, note: "preço previsto, por confirmar" };
// Roda: descontos no primeiro ano do AvocoraFit Pro (produto nosso, sem parceiros). Fica o melhor desconto ganho; não acumulam.
// weight = peso relativo; a probabilidade real é calculada e mostrada na app.
const REWARDS = [
  { id:"pro10", type:"prodisc", pct:10, name:"10% no Pro", weight:30, color:"#56745E" },
  { id:"pro15", type:"prodisc", pct:15, name:"15% no Pro", weight:24, color:"#2F6B3A" },
  { id:"pro20", type:"prodisc", pct:20, name:"20% no Pro", weight:20, color:"#6C9471" },
  { id:"pro25", type:"prodisc", pct:25, name:"25% no Pro", weight:13, color:"#3E5C46" },
  { id:"pro30", type:"prodisc", pct:30, name:"30% no Pro", weight:8,  color:"#8A7451" },
  { id:"pro40", type:"prodisc", pct:40, name:"40% no Pro", weight:5,  color:"#B0684E" }
];
// Acessórios e temas que já saíram na roda antiga: continuam no armário de quem os ganhou.
const ACCESSORIES = [
  { id:"acc_chef",    type:"acc",     name:"Chapéu de chef",    desc:"Um chapéu para o Abi usar na cozinha.", weight:18, color:"#56745E" },
  { id:"acc_oculos",  type:"acc",     name:"Óculos de sol",     desc:"O Abi fica pronto para o verão.",       weight:18, color:"#2F6B3A" },
  { id:"acc_banda",   type:"acc",     name:"Fita desportiva",   desc:"Para os dias de treino.",               weight:16, color:"#6C9471" },
  { id:"acc_cachecol",type:"acc",     name:"Cachecol",          desc:"Para os dias frios.",                   weight:14, color:"#3E5C46" },
  { id:"tema_pessego",type:"theme",   name:"Tema Pêssego",      desc:"Muda a cor principal da app.",          weight:10, color:"#8A7451", accent:"pessego" },
  { id:"tema_mar",    type:"theme",   name:"Tema Mar",          desc:"Muda a cor principal da app.",          weight:10, color:"#B0684E", accent:"mar" },
  { id:"col_verao",   type:"recipes", name:"Receitas de verão", desc:"Desbloqueia 3 receitas frescas.",       weight:8,  color:"#4E7F57" },
  { id:"badge_sorte", type:"badge",   name:"Medalha da sorte",  desc:"Uma medalha para a tua coleção.",       weight:6,  color:"#73624A" }
];
// Prémio dourado: garantido no fim de cada ronda de 3 tentativas (por esta ordem).
const GOLDEN = [
  { id:"acc_coroa",  type:"acc",   name:"Coroa dourada",   desc:"O prémio dourado da primeira ronda." },
  { id:"tema_ouro",  type:"theme", name:"Tema Dourado",    desc:"Uma cor só para quem completa rondas.", accent:"ouro" },
  { id:"gold_badge", type:"badge", name:"Medalha dourada", desc:"Mais uma medalha dourada para a coleção." }
];
// Descontos de parceiros: adicionar SÓ com acordo real. Vazio = não aparecem na roda.
// Formato: { id:"desc_x", type:"discount", name:"10% na Loja X", partner:"Loja X", code:"CODIGO", expires:"2027-03-31", terms:"Compra mínima de 20 €.", desc:"Desconto oferecido pela Loja X.", weight:5, color:"#9B5DE5" }
const DISCOUNTS = [];

