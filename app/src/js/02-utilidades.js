/* ========================== Utilidades ========================== */
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dkey = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const parseK = k => { const [y,m,d] = k.split("-").map(Number); return new Date(y, m-1, d); };
const today = () => dkey(new Date());
const addDays = (k, n) => { const d = parseK(k); d.setDate(d.getDate()+n); return dkey(d); };
const dow = k => (parseK(k).getDay()+6)%7; // 0 = segunda-feira
const mondayOf = k => addDays(k, -dow(k));
const uid = () => Math.random().toString(36).slice(2,10);
const clamp = (v,a,b) => Math.min(b, Math.max(a, v));
const num = (v, max=5000) => clamp(Math.round(+v || 0), 0, max);
const icon = (n, cls="") => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const DOW = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const DOWL = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
const MONTHS = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const MEALS = [{ id:"Pequeno-almoço", ic:"coffee" },{ id:"Almoço", ic:"bowl" },{ id:"Lanche", ic:"apple" },{ id:"Jantar", ic:"moon" }];
const fmtDay = k => { const d = parseK(k); return `${DOWL[dow(k)]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`; };
const defMeal = () => { const h = new Date().getHours(); return MEALS[h < 11 ? 0 : h < 16 ? 1 : h < 19 ? 2 : 3].id; };
const rnd = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 2**32; }; // aleatório criptográfico (roda)
const lowMotion = () => S.mot || matchMedia("(prefers-reduced-motion:reduce)").matches;

