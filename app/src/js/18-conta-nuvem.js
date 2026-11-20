/* ========================== Conta e cópia na nuvem (Supabase) ==========================
   Só existe se BRAND.supabase estiver preenchido. Entrada por ligação mágica no e-mail (sem palavras-passe feitas à mão).
   Guarda o estado inteiro numa linha por pessoa (tabela brota_state), protegida por RLS: cada pessoa só lê e escreve a sua.
   A app continua a funcionar sem rede: grava sempre no aparelho e envia para a nuvem quando pode. */
const cloudOn = () => !!(BRAND.supabase && BRAND.supabase.url && BRAND.supabase.anonKey);
let cloud = null, cloudUser = null, cloudT = null;
const SUPA_JS = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js";
function loadCloud(){
  if (!cloudOn()) return Promise.resolve(null); if (cloud) return Promise.resolve(cloud);
  return new Promise((ok, no) => { const sc = document.createElement("script"); sc.src = SUPA_JS; sc.crossOrigin = "anonymous";
    sc.onload = () => { cloud = window.supabase.createClient(BRAND.supabase.url, BRAND.supabase.anonKey, { auth:{ persistSession:true, detectSessionInUrl:true } });
      cloud.auth.onAuthStateChange((_e, sess) => { cloudUser = sess && sess.user ? sess.user : null; });
      cloud.auth.getSession().then(({ data }) => { cloudUser = data.session ? data.session.user : null; if (cloudUser) cloudPull(); ok(cloud); }); };
    sc.onerror = () => no(new Error("sem ligação")); document.head.appendChild(sc); });
}
// Envia o estado 3 s depois da última alteração (junta várias alterações num só pedido).
function cloudQueue(){ if (!cloudUser || !cloud) return; clearTimeout(cloudT); cloudT = setTimeout(cloudPush, 3000); }
async function cloudPush(){ if (!cloudUser || !cloud || navigator.onLine === false) return false;
  const { error } = await cloud.from("brota_state").upsert({ user_id:cloudUser.id, data:S, updated_at:new Date(S.updatedAt || Date.now()).toISOString() });
  if (error) { console.warn("nuvem:", error.message); return false; } return true; }
// Ao entrar: se a cópia na nuvem for mais recente do que a do aparelho, pergunta antes de a usar. Nunca apaga sem perguntar.
async function cloudPull(){ if (!cloudUser || !cloud) return;
  const { data, error } = await cloud.from("brota_state").select("data,updated_at").eq("user_id", cloudUser.id).maybeSingle();
  if (error) { toast("Não foi possível ler a cópia na nuvem."); return; }
  if (!data) { await cloudPush(); return; } // primeira vez: sobe o que está no aparelho (migração sem perder dados)
  const remoteAt = Date.parse(data.updated_at) || 0;
  if (remoteAt > (S.updatedAt || 0) + 1000 && data.data && typeof data.data === "object" && data.data.v) {
    if (S.ob && !await confirmDlg("Há uma cópia mais recente na nuvem (de outro aparelho). Usar essa? A deste aparelho é substituída.", "Usar a da nuvem")) { await cloudPush(); return; }
    S = Object.assign(structuredClone(DEFAULT), data.data); localStorage.setItem(BRAND.storageKey, JSON.stringify(S)); applyPrefs(); refreshAll(); toast("Dados da nuvem carregados");
  } else if ((S.updatedAt || 0) > remoteAt) await cloudPush();
}
function openAccount(){
  if (!cloudOn()) return;
  loadCloud().then(() => {
    const u = cloudUser;
    openSheet("Conta e cópia na nuvem", u ? `<div class="card"><p class="small muted">Ligada como</p><b>${esc(u.email || "")}</b>
        <p class="small muted" style="margin-top:8px">Os teus dados ficam guardados neste aparelho e numa cópia na nuvem (servidores na UE). Só tu os vês.</p></div>
        <div class="stack" style="margin-top:12px"><button class="btn block" id="ac-sync">${icon("upload","sm")} Sincronizar agora</button><button class="btn ghost block" id="ac-out">Terminar sessão</button>
        <button class="btn ghost block" id="ac-del" style="color:var(--accent)">Apagar a cópia na nuvem</button></div>
        <p class="tiny muted" style="margin-top:10px">Apagar a cópia não apaga os dados deste aparelho.</p>`
      : `<p class="small">Entra com o teu e-mail para guardares os dados e os usares noutro aparelho. Enviamos-te uma ligação; não há palavra-passe.</p>
        <label class="field" style="margin-top:12px"><span>E-mail</span><input id="ac-mail" type="email" inputmode="email" autocomplete="email" maxlength="120" placeholder="nome@exemplo.pt"></label>
        <label class="row" style="gap:10px;margin-top:12px;align-items:flex-start"><input type="checkbox" id="ac-ok" style="width:22px;height:22px;flex:none;accent-color:var(--brand)"><span class="small">Aceito que os meus dados de alimentação, peso e treino sejam guardados na nuvem (UE) para os poder recuperar. Posso apagá-los quando quiser.</span></label>
        <button class="btn block" id="ac-go" style="margin-top:14px">Enviar ligação</button>
        ${isMinor() ? `<p class="tiny muted" style="margin-top:10px">Se tens menos de 16 anos, pede a um adulto que te ajude a criar a conta.</p>` : ""}`, b => {
      const go = $("#ac-go", b); if (go) go.onclick = async () => { const m = $("#ac-mail", b).value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)) { toast("Escreve um e-mail válido"); return; } if (!$("#ac-ok", b).checked) { toast("Precisas de aceitar para guardar na nuvem"); return; }
        go.disabled = true; const { error } = await cloud.auth.signInWithOtp({ email:m, options:{ emailRedirectTo: location.href.split("#")[0] } });
        go.disabled = false; if (error) { toast(/rate/i.test(error.message) ? "Muitos pedidos. Espera um minuto." : "Não foi possível enviar. Tenta outra vez."); return; }
        closeSheet(); toast("Enviámos-te uma ligação. Abre o e-mail neste aparelho."); };
      const sy = $("#ac-sync", b); if (sy) sy.onclick = async () => { toast(await cloudPush() ? "Sincronizado" : "Sem ligação. Tento mais tarde."); };
      const out = $("#ac-out", b); if (out) out.onclick = async () => { await cloud.auth.signOut(); cloudUser = null; closeSheet(); renderPerfil(); toast("Sessão terminada. Os dados ficam neste aparelho."); };
      const del = $("#ac-del", b); if (del) del.onclick = async () => { if (!await confirmDlg("Apagar a cópia dos teus dados na nuvem? Os dados deste aparelho ficam.", "Apagar")) return;
        const { error } = await cloud.from("brota_state").delete().eq("user_id", cloudUser.id); toast(error ? "Não foi possível apagar. Tenta outra vez." : "Cópia na nuvem apagada"); };
    });
  }).catch(() => toast("Sem ligação. A conta precisa de internet."));
}
if (cloudOn()) loadCloud().catch(() => {});
