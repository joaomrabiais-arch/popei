/* ========================== Estado ========================== */
const DEFAULT = { v:1, ob:0, u:null, goal:2000, showKcal:true, wg:8, days:{}, water:{}, favM:[], fav:[], plan:[], shop:[], shopH:[],
  wk:null, wkHist:{}, ch:{}, chPaid:{}, spins:0, round:0, golden:0, owned:[], equip:null, accent:"", theme:"", snd:false, mot:false,
  ach:{}, well:{}, ropen:[], macro:null, prof:{ sex:"f", age:30, h:165, w:65, act:"1.375" } };
let S = structuredClone(DEFAULT);

function load(){
  let raw = null;
  try { raw = localStorage.getItem(BRAND.storageKey); } catch(e) {}
  if (raw) { try { S = Object.assign(structuredClone(DEFAULT), JSON.parse(raw)); return; } catch(e) {} }
  for (const key of BRAND.legacyKeys) { // migração sem perder dados
    let o = null; try { o = JSON.parse(localStorage.getItem(key) || "null"); } catch(e) {}
    if (!o || typeof o !== "object" || Array.isArray(o)) continue;
    const mon = mondayOf(today());
    Object.assign(S, {
      ob: o.ob ? 1 : 0, u: o.u || null, goal: +o.goal || 2000, wg: clamp(+o.wg || 8, 4, 16), water: o.water || {}, fav: Array.isArray(o.fav) ? o.fav : [],
      shop: Array.isArray(o.shop) ? o.shop : [], shopH: Array.isArray(o.shopH) ? o.shopH : [], well: o.well || {}, theme: o.theme || "", snd: !!o.snd, mot: !!o.mot,
      prof: Object.assign(structuredClone(DEFAULT.prof), o.prof || {}),
      days: Object.fromEntries(Object.entries(o.days || {}).map(([d, L]) => [d, (Array.isArray(L) ? L : []).map(m => ({ id:uid(), n:String(m.n||"Refeição"), k:m.k|0, p:m.p|0, c:m.c|0, g:m.g|0, m:m.m, t:m.t || "", q:"" }))])),
      plan: (Array.isArray(o.plan) ? o.plan : []).map(x => ({ id:uid(), date:addDays(mon, x.d|0), m:x.m, n:x.n, r:x.r }))
    });
    if (S.ob) S.spins = 3; // quem já usava a app também recebe os giros de boas-vindas
    save(); return;
  }
}
let saveT;
function save(){
  try { localStorage.setItem(BRAND.storageKey, JSON.stringify(S)); const s = $("#saving"); s.classList.add("on"); clearTimeout(saveT); saveT = setTimeout(() => s.classList.remove("on"), 900); }
  catch(e) { toast("Não foi possível guardar neste aparelho."); }
}
const isMinor = () => !(S.u && S.u.age === "18 ou mais");
const kcalOn = () => S.showKcal && !isMinor();

