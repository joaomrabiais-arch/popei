// Teste do servidor de IA com a IA da Cloudflare simulada: node servidor/worker.test.mjs
import assert from "node:assert/strict";
import worker from "./worker.js";

let last = null;
const env = { ALLOW_ORIGIN: "*", AI: { run: async (model, input) => { last = { model, input }; return { response: '{"refeicao":"Arroz","itens":[]}' }; } } };
const post = (body, ip = "1.1.1.1", type = "application/json") => worker.fetch(new Request("https://x.dev", { method: "POST", headers: { "Content-Type": type, "CF-Connecting-IP": ip }, body: typeof body === "string" ? body : JSON.stringify(body) }), env);

// Pedido com imagem: vai para o Mistral como parte da mensagem, em data URL.
let r = await post({ prompt: "Analisa", image: "QUJD" });
assert.equal(r.status, 200);
assert.equal((await r.json()).text, '{"refeicao":"Arroz","itens":[]}');
assert.equal(last.model, "@cf/mistralai/mistral-small-3.1-24b-instruct");
assert.deepEqual(last.input.messages[0].content[1], { type: "image_url", image_url: { url: "data:image/jpeg;base64,QUJD" } });

// Validação: sem prompt, imagem com caracteres estranhos, corpo que não é JSON.
assert.equal((await post({ image: "QUJD" }, "2.2.2.2")).status, 400);
assert.equal((await post({ prompt: "x", image: "<script>" }, "3.3.3.3")).status, 400);
assert.equal((await post("olá", "4.4.4.4", "text/plain")).status, 415);

// Limite: 20 pedidos por IP em 10 minutos; o 21.º recebe 429.
for (let i = 0; i < 20; i++) await post({ prompt: "x" }, "9.9.9.9");
assert.equal((await post({ prompt: "x" }, "9.9.9.9")).status, 429);

// Quota esgotada na Cloudflare vira 429 com mensagem clara; outra falha vira 502.
env.AI.run = async () => { throw new Error("daily neurons limit exceeded"); };
assert.equal((await post({ prompt: "x" }, "5.5.5.5")).status, 429);
env.AI.run = async () => { throw new Error("boom"); };
assert.equal((await post({ prompt: "x" }, "6.6.6.6")).status, 502);
console.log("servidor de IA: 9 verificações ok");
