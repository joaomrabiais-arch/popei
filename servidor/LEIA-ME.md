# IA grátis da Brota (Llama 3.2 Vision na Cloudflare)

A app usa a IA do Claude quando abre dentro do Claude. Fora dele, pode usar este servidor, que corre o modelo **Llama 3.2 11B Vision** na Cloudflare.

## Quanto custa

- A Cloudflare dá **10 000 "neurons" grátis por dia** ([preços](https://developers.cloudflare.com/workers-ai/platform/pricing/)).
- Pelas minhas contas, cada análise de foto gasta cerca de 30 a 40 neurons, o que dá **cerca de 250 a 300 fotos por dia** sem pagar. É uma estimativa: confirma no painel da Cloudflare depois de usares.
- Passado o limite, os pedidos falham até à meia-noite UTC. A app mostra "Muitas tentativas".
- Para mais do que isso, é preciso o plano pago da Cloudflare: mínimo de 5 $ por mês, mais o uso.

## Como pôr a funcionar (10 minutos)

1. Cria uma conta grátis em <https://dash.cloudflare.com>.
2. No computador, com o Node instalado, abre esta pasta e corre:

```bash
npx wrangler login
```

```bash
npx wrangler deploy
```

3. O comando mostra um endereço do tipo `https://brota-ia.<a-tua-conta>.workers.dev`.
4. Aceita a licença da Meta, uma só vez:

```bash
curl -X POST https://brota-ia.<a-tua-conta>.workers.dev -H "Content-Type: application/json" -d '{"prompt":"agree"}'
```

5. Em `app/index.html`, no objeto `BRAND`, põe o endereço em `aiEndpoint: "https://brota-ia.<a-tua-conta>.workers.dev"`.
6. Em `wrangler.toml`, troca `ALLOW_ORIGIN = "*"` pelo endereço da app quando ela estiver publicada. Corre o `npx wrangler deploy` outra vez.

## Limites que tens de conhecer

- **O Llama 3.2 11B é pior do que o Claude** a reconhecer pratos e a estimar porções. Vai errar mais vezes. A app mostra sempre a estimativa como estimativa, e a pessoa pode corrigir tudo.
- Sem `ALLOW_ORIGIN`, qualquer site pode usar o teu servidor e gastar a quota grátis.
- As fotos passam pela Cloudflare. A política de privacidade da app tem de dizer isso.
