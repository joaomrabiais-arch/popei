// Servidor de IA grátis da Brota: Cloudflare Worker com Llama 3.2 11B Vision (Workers AI).
// Recebe { prompt, image? (JPEG em base64) } e devolve { text }. A chave nunca sai da Cloudflare.
const MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";

export default {
  async fetch(req, env) {
    const origin = env.ALLOW_ORIGIN || "*"; // em produção, põe aqui o domínio da app
    const cors = { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return json({ error: "Usa POST" }, 405);

    let body;
    try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
    const prompt = String(body.prompt || "").slice(0, 6000);
    if (!prompt) return json({ error: "Falta o prompt" }, 400);

    // Aceitar a licença da Meta (só é preciso uma vez): envia { "prompt": "agree" }.
    if (prompt === "agree") { await env.AI.run(MODEL, { prompt: "agree" }); return json({ text: "Licença aceite." }); }

    const input = { messages: [{ role: "user", content: prompt }], max_tokens: 900 };
    if (body.image) {
      if (String(body.image).length > 2_000_000) return json({ error: "Imagem demasiado grande" }, 413);
      try { input.image = [...Uint8Array.from(atob(body.image), c => c.charCodeAt(0))]; }
      catch { return json({ error: "Imagem inválida" }, 400); }
    }
    try {
      const out = await env.AI.run(MODEL, input);
      return json({ text: out.response || "" });
    } catch (e) {
      const lim = /limit|quota|neurons/i.test(String(e && e.message || e));
      return json({ error: lim ? "Limite diário grátis atingido" : "Falha no modelo" }, lim ? 429 : 502);
    }
  }
};
