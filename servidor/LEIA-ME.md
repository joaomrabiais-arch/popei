# IA grátis da AvocoraFit (Mistral Small 3.1 na Cloudflare)

A app analisa fotos de comida com este servidor, que corre o modelo **Mistral Small 3.1 24B** no Workers AI da Cloudflare. Funciona igual no browser, na App Store e no Google Play: a app só chama um endereço, e a chave fica na Cloudflare.

## Porquê o Mistral e não o Llama

A licença dos modelos de imagem do Llama 3.2 (e do 3.3 e do 4) não dá direitos de uso a pessoas e empresas com sede na União Europeia. A AvocoraFit é feita em Portugal, por isso não os pode usar. O Mistral Small 3.1 tem licença Apache 2.0, sem essa restrição.

## Quanto custa

- A Cloudflare dá **10 000 "neurons" grátis por dia** ([preços](https://developers.cloudflare.com/workers-ai/platform/pricing/)).
- O Mistral Small 3.1 custa cerca de 31 900 neurons por milhão de tokens de entrada e 50 500 por milhão de saída. Uma foto com o pedido deve dar perto de 2000 tokens de entrada e 300 de saída: **cerca de 75 neurons por análise, ou umas 130 fotos por dia grátis**. Isto é uma estimativa, porque não sei ao certo quantos tokens conta cada imagem. Confirma no painel da Cloudflare depois de usares.
- Passado o limite grátis, os pedidos falham até à meia-noite UTC e a app diz "Atingiste o limite de análises por agora".
- Com o plano pago da Cloudflare (a partir de 5 $ por mês), cada análise fica perto de 0,08 cêntimos.

## Como pôr a funcionar (10 minutos)

1. Cria uma conta grátis em <https://dash.cloudflare.com>.
2. No computador, com o Node instalado, abre esta pasta e corre:

```bash
npx wrangler login
```

```bash
npx wrangler deploy
```

3. O comando mostra um endereço do tipo `https://avocorafit-ia.<a-tua-conta>.workers.dev`.
4. Em `app/src/js/01-config.js`, no objeto `BRAND`, põe esse endereço em `aiEndpoint`. Depois corre `npm run build`.
5. Em `wrangler.toml`, troca `ALLOW_ORIGIN = "*"` pelo endereço da app quando ela estiver publicada, e corre `npx wrangler deploy` outra vez.

Para testar o servidor sem a Cloudflare: `node servidor/worker.test.mjs`.

## Limites que tens de conhecer

- **Ainda não foi testado com o modelo real.** O pedido usa o formato de mensagens com imagem do Workers AI; se a Cloudflare responder com erro na primeira foto, o problema está aí.
- Um modelo grátis erra mais do que os melhores modelos pagos a reconhecer pratos e porções. A app mostra sempre o resultado como estimativa e a pessoa pode corrigir tudo.
- Sem `ALLOW_ORIGIN`, qualquer site pode usar o teu servidor e gastar a quota grátis.
- As fotos passam pela Cloudflare. A política de privacidade da app tem de dizer isso.
