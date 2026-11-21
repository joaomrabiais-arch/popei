// Servidor de IA grátis da AvocoraFit: Cloudflare Worker com Mistral Small 3.1 24B (Workers AI), que lê imagens.
// Porquê este e não o Llama 3.2 Vision: a licença dos modelos multimodais da Meta não dá direitos a empresas e pessoas com sede na UE.
// O Mistral Small 3.1 é Apache 2.0. Recebe { prompt, image? (JPEG em base64) } e devolve { text }. A chave nunca sai da Cloudflare.
const MODEL = "@cf/mistralai/mistral-small-3.1-24b-instruct";
const HITS = new Map(), WINDOW_MS = 10 * 60 * 1000, MAX_HITS = 20; // até 20 pedidos por IP a cada 10 minutos

export default {
  async fetch(req, env) {
    const origin = env.ALLOW_ORIGIN || "*"; // em produção, põe aqui o domínio da app
    const cors = { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return json({ error: "Usa POST" }, 405);

    // Limite de pedidos por IP: sem isto, alguém chama o servidor 10 000 vezes e gasta a quota de todos.
    // shortcut: memória de cada instância do Worker (não é partilhada entre regiões); com contas, passar para Rate Limiting da Cloudflare ou KV por utilizador.
    const ip = req.headers.get("CF-Connecting-IP") || "?", now = Date.now(), win = HITS.get(ip) || [];
    const recent = win.filter(t => now - t < WINDOW_MS); if (recent.length >= MAX_HITS) return json({ error: "Muitos pedidos. Tenta daqui a uns minutos." }, 429);
    recent.push(now); HITS.set(ip, recent); if (HITS.size > 5000) HITS.clear();
    if (!/application\/json/i.test(req.headers.get("Content-Type") || "")) return json({ error: "Usa JSON" }, 415);

    let body;
    try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Pedido inválido" }, 400);
    const prompt = String(body.prompt || "").slice(0, 6000);
    if (!prompt) return json({ error: "Falta o prompt" }, 400);

    // A imagem vai como parte da mensagem (formato de mensagens com image_url em data URL).
    const content = [{ type: "text", text: prompt }];
    if (body.image) {
      const b64 = String(body.image);
      if (b64.length > 2_000_000) return json({ error: "Imagem demasiado grande" }, 413);
      if (!/^[A-Za-z0-9+/=]+$/.test(b64)) return json({ error: "Imagem inválida" }, 400);
      content.push({ type: "image_url", image_url: { url: "data:image/jpeg;base64," + b64 } });
    }
    const input = { messages: [{ role: "user", content }], max_tokens: 900, temperature: 0.2 };
    try {
      const out = await env.AI.run(MODEL, input);
      const text = typeof out.response === "string" ? out.response : JSON.stringify(out.response || "");
      return json({ text });
    } catch (e) {
      const lim = /limit|quota|neurons/i.test(String(e && e.message || e));
      return json({ error: lim ? "Limite diário grátis atingido" : "Falha no modelo" }, lim ? 429 : 502);
    }
  }
};
