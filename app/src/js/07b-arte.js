/* ========================== Arte: ilustrações das refeições ==========================
   Ilustrações vetoriais próprias (planas, com sombra suave), usadas nas refeições do dia e como capa das receitas sem foto.
   Cada uma num quadrado 64 × 64. O fundo da capa muda com o tipo de prato. */
const ART = {
  cafe:`<circle cx="46" cy="16" r="9" fill="#FFD27A"/><path d="M14 30h28v12a12 12 0 0 1-12 12h-4a12 12 0 0 1-12-12z" fill="#fff"/><path d="M14 30h28v4H14z" fill="#E9E2D3"/>
    <path d="M42 34h4a6 6 0 0 1 0 12h-3" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M17 33h22v3a10 10 0 0 1-2 6H19a10 10 0 0 1-2-6z" fill="#8A5A3B"/>
    <path d="M22 20c-2 3 2 4 0 7M29 18c-2 3 2 4 0 7" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".85"/><ellipse cx="30" cy="57" rx="20" ry="3" fill="#000" opacity=".08"/>`,
  almoco:`<ellipse cx="32" cy="35" rx="25" ry="23" fill="#fff"/><ellipse cx="32" cy="35" rx="19" ry="17" fill="#F3EEE3"/><path d="M19 37c2-8 10-12 16-10 6 2 8 8 4 13-4 5-14 6-18 3" fill="#7DB65E"/>
    <path d="M22 33c4-2 9-2 12 1" stroke="#5E9443" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="40" cy="29" r="5.5" fill="#E8664F"/><circle cx="41.5" cy="27.5" r="1.4" fill="#fff" opacity=".6"/>
    <ellipse cx="36" cy="42" rx="7" ry="5" fill="#F2C14E"/><ellipse cx="36" cy="42" rx="3" ry="2.4" fill="#E79A2E"/><ellipse cx="32" cy="60" rx="20" ry="2.6" fill="#000" opacity=".08"/>`,
  lanche:`<path d="M32 22c-6-6-20-4-20 10 0 13 9 23 16 23 2 0 3-1 4-1s2 1 4 1c7 0 16-10 16-23 0-14-14-16-20-10z" fill="#E8664F"/><path d="M20 30c0-4 3-7 6-7" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>
    <path d="M32 22c0-5 2-9 5-11" stroke="#6B4A2E" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 15c5-6 12-5 14-2-4 5-10 6-14 2z" fill="#7DB65E"/><ellipse cx="32" cy="59" rx="16" ry="2.6" fill="#000" opacity=".08"/>`,
  jantar:`<path d="M48 8a10 10 0 1 0 8 14 8 8 0 0 1-8-14z" fill="#FFE29A"/><path d="M8 32h48a24 18 0 0 1-48 0z" fill="#fff"/><path d="M8 32h48v3H8z" fill="#E9E2D3"/>
    <path d="M12 32c4-6 10-8 14-6 3-4 9-5 13-2 4-2 10 0 13 8z" fill="#D9774F"/><circle cx="24" cy="29" r="3" fill="#7DB65E"/><circle cx="36" cy="27" r="3" fill="#F2C14E"/><circle cx="44" cy="30" r="2.6" fill="#7DB65E"/>
    <ellipse cx="32" cy="56" rx="18" ry="2.6" fill="#000" opacity=".08"/>`,
  sopa:`<path d="M8 30h48a24 20 0 0 1-48 0z" fill="#fff"/><ellipse cx="32" cy="30" rx="24" ry="5" fill="#F2A541"/><circle cx="24" cy="29" r="2.4" fill="#7DB65E"/><circle cx="36" cy="31" r="2" fill="#E8664F"/><circle cx="42" cy="28.5" r="1.8" fill="#7DB65E"/>
    <path d="M24 12c-3 4 3 6 0 10M32 10c-3 4 3 6 0 10M40 12c-3 4 3 6 0 10" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".9"/><path d="M50 22l8-12" stroke="#C9B79C" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="32" cy="57" rx="18" ry="2.6" fill="#000" opacity=".08"/>`
};
// Fundo de cada ilustração (claro e escuro usam o mesmo par; o desenho tem as suas próprias cores).
const ART_BG = { cafe:["#FFF1D6","#FBD9A0"], almoco:["#E6F2DC","#C5E1B0"], lanche:["#FFE4DC","#FBC1B0"], jantar:["#E2E6F7","#C3CBEF"], sopa:["#FFEBCF","#F8CF97"] };
const MEAL_ART = { "Pequeno-almoço":"cafe", "Almoço":"almoco", "Lanche":"lanche", "Jantar":"jantar" };
const artKind = r => /^(sopa|creme|canja|caldo|gaspacho)/i.test(r.n) ? "sopa" : r.c === "Pequeno-almoço" ? "cafe" : r.c === "Lanche" ? "lanche" : r.c === "Jantar" ? "jantar" : "almoco";
const artSVG = (kind, size = 44) => `<svg class="art" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">${ART[kind] || ART.almoco}</svg>`;
// Mosaico com fundo em degradê: usado nas refeições e nos cartões das receitas sem fotografia.
const artTile = (kind, size = 48, cls = "") => { const [a, b] = ART_BG[kind] || ART_BG.almoco;
  return `<span class="art-tile ${cls}" style="--a1:${a};--a2:${b};width:${size}px;height:${size}px">${artSVG(kind, Math.round(size * .82))}</span>`; };
