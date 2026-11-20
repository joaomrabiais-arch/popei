# popei

**Site (atual):** [`site/`](site/) — loja **Poupei**: página de produto do kit de escovagem com aspiração (fornecedor e dados por confirmar: ver [`PRODUTO-KIT.md`](PRODUTO-KIT.md)). Ver [`site/LEIA-ME.md`](site/LEIA-ME.md). Testes: `npm test`.
**App AvocoraFit (ex-Brota, ex-NutriVida):** [`app/index.html`](app/index.html) — app de nutrição e treino com as mascotes Abi e Pingo. Código em módulos em [`app/src/`](app/src/) (estilos em `css/`, lógica em `js/`, por ordem numérica); `npm run build` monta o ficheiro único `app/index.html`. Testes: `npm run test:app`. IA grátis (Llama na Cloudflare): [`servidor/LEIA-ME.md`](servidor/LEIA-ME.md).

**Auditoria da NutriVida:** [`munchi/AUDITORIA.md`](munchi/AUDITORIA.md) — auditoria da app de nutrição e plano por fases; original em [`munchi/nutrivida-original.html`](munchi/nutrivida-original.html).
**Auditoria da AvocoraFit (atual):** [`app/AUDITORIA.md`](app/AUDITORIA.md) — o que funciona, o que é simulado, bugs críticos e plano por fases.


Análise e kit de arranque a partir do vídeo TikTok "$12.5k this month — AI Dropshipping" (TeemDrop).

- [`ANALISE.md`](ANALISE.md) — o que o vídeo mostra, o que esconde, pesquisa e fontes.
- [`PRODUTO.md`](PRODUTO.md) — produto escolhido, contas, guiões de vídeo e o que tens de fazer.
- [`MERCADO.md`](MERCADO.md) — mercado (Irlanda), produto e anúncios em inglês.
- [`LOVABLE.md`](LOVABLE.md) — mensagem pronta para criar a loja no Lovable + Shopify.
- [`loja-en/index.html`](loja-en/index.html) — pré-visualização da loja Shedless em inglês.
- [`PLANO.md`](PLANO.md) — passos concretos, com orçamento e regras de corte.
- [`calculadora/index.html`](calculadora/index.html) — margem real por encomenda (IVA, comissões, reembolsos, anúncios).
- [`loja/index.html`](loja/index.html) — template de loja de produto único (editar o objeto `CONFIG`).

Abrir os `.html` diretamente no browser; não há dependências.

## Publicar e ligar contas

1. **Vercel:** em vercel.com, "Add New → Project" e escolhe este repositório. O `vercel.json` já diz como montar e publicar (pasta `app/`).
2. **Supabase:**
   - cria um projeto na região UE;
   - corre `servidor/supabase.sql` no SQL Editor;
   - copia o URL e a chave "anon" para `BRAND.supabase` em `app/src/js/01-config.js`;
   - em Authentication, põe o endereço da Vercel como Site URL.
3. A opção "Conta e cópia na nuvem" só aparece no Perfil depois do passo 2.
