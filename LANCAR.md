# Lançar a AvocoraFit

Estado em novembro de 2026. O que está feito, o que falta e quem o faz.

## 1. O que já está pronto (no código)

- App completa num só ficheiro: `app/index.html` (gerado por `npm run build`).
- Instalável como app no telemóvel: `app/manifest.webmanifest`, ícones (`app/icone-*.png`, `app/apple-touch-icon.png`) e funcionamento sem internet (`app/sw.js`).
- Páginas obrigatórias para as lojas: `app/privacidade.html` e `app/termos.html` (português e inglês).
- Apagar a conta dentro da app (exigido pelas lojas): botão em Perfil → Conta, com a função `delete_my_account` em `servidor/supabase.sql`.
- Português e inglês (interface), escolhidos no fundo do Perfil.
- Publicação na Vercel: `vercel.json` e `.vercelignore` (os screenshots dos testes não ficam públicos).
- Servidor de IA grátis para as fotos: `servidor/worker.js` (Mistral Small 3.1 na Cloudflare). Ver `servidor/LEIA-ME.md`.

## 2. O que só tu podes fazer

| Passo | Onde | Custo | Notas |
|---|---|---|---|
| Preencher os campos amarelos em `privacidade.html` e `termos.html` | no código | 0 € | e-mail de contacto, nome ou empresa, data |
| Criar o projeto Supabase (região UE) e correr `servidor/supabase.sql` | supabase.com | 0 € no início | depois enviar o URL e a chave **anon** (nunca a service_role) |
| Publicar o servidor de IA | dash.cloudflare.com | 0 € até ~130 fotos/dia (estimativa) | `npx wrangler deploy` em `servidor/` |
| Ligar o GitHub à Vercel e publicar | vercel.com | 0 € (plano Hobby) | o Hobby é para uso não comercial; para cobrar o Pro, passar ao plano pago. Confirma as condições atuais |
| Conta Apple Developer | developer.apple.com | 99 $/ano | precisas de um Mac com Xcode, ou de um serviço de build na nuvem |
| Conta Google Play Console | play.google.com/console | 25 $ uma vez | contas pessoais novas: teste fechado com 12 pessoas durante 14 dias antes de publicar |
| Gerar as 113 fotos que faltam | higgsfield.ai | ~17 créditos | depois eu gero e embuto |

## 3. Do site para as lojas (Capacitor)

A app é web. Para as lojas embrulha-se com o Capacitor:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

```bash
npx cap init AvocoraFit pt.avocorafit.app --web-dir app
```

```bash
npx cap add android
```

```bash
npx cap add ios
```

```bash
npm run build && npx cap sync
```

Depois abre-se no Android Studio (`npx cap open android`) e no Xcode (`npx cap open ios`, só num Mac) para assinar e gerar o ficheiro final (AAB para a Google, IPA para a Apple). Isto precisa das tuas contas, das tuas chaves de assinatura e, para iOS, de um Mac.

### Riscos que tens de conhecer

- **Apple, regra 4.2 (funcionalidade mínima):** a Apple rejeita muitas apps que são só um site embrulhado. Antes de submeter, a app precisa de coisas que um site não faz bem: câmara nativa para a foto do prato, notificações para lembrar a água e as refeições, atalhos ou widget do iPhone. Sem isto, conta com rejeições.
- **Pagamentos:** o Pro vendido dentro da app tem de usar a compra integrada da Apple e da Google (as lojas ficam com 15% no programa de pequenas empresas). Confirma as regras atuais da UE antes de decidir.
- **Saúde:** a app diz que não é aconselhamento médico e não pode prometer resultados de peso.

## 4. O plano Pro

**Preço:** 2,00 € por mês (preço previsto, por confirmar). Sem plano anual até decidires o preço.

| | Grátis | Pro |
|---|---|---|
| Plano de refeições automático | 1 semana | 4 semanas seguidas |
| Lista de compras a partir do plano | Sim | Sim |
| Receitas | Todas | Todas |
| Registo por pesquisa, manual e repetir | Sim | Sim |
| Análise de fotos com IA | 3 por dia | 20 por dia |
| Treino guiado com progressão de cargas | Sim | Sim |
| Histórico e tendências | 30 dias | Sem limite |
| Cópia na nuvem e vários aparelhos | Não | Sim |

Regras: o que hoje é grátis continua grátis; os limites do grátis só se ligam quando o Pro estiver à venda; sem contagens decrescentes nem descontos falsos. A roda dá até 40% no 1.º ano do Pro, sem acumular.

**Contas por pessoa e por mês, a 2 €:** 2,00 € − IVA 23% = 1,63 € − 15% da loja = **cerca de 1,38 €**. A IA custa perto de 0,08 cêntimos por foto (estimativa); 20 fotos por dia durante um mês dão cerca de 0,50 €. **Sobra pouco.** Considera 2,99 € e um desconto máximo de 25% na roda.

## 5. Textos para as lojas

**Nome:** AvocoraFit
**Subtítulo (até 30 caracteres):** Refeições, compras e treino

**Descrição curta (PT):** Diz o que gostas e quanto tempo tens. A AvocoraFit monta a tua semana de refeições, a lista de compras e um treino à tua medida, sem dietas restritivas.

**Short description (EN):** Tell us what you like and how much time you have. AvocoraFit builds your week of meals, your shopping list and a workout that fits you, with no restrictive diets.

**Palavras-chave:** plano de refeições, receitas saudáveis, lista de compras, calorias, treino em casa, proteína

**Categoria:** Saúde e fitness.

## 6. Antes de submeter

- [ ] `npm run test:app` e `npm test` sem falhas
- [ ] Campos amarelos preenchidos em `privacidade.html` e `termos.html`
- [ ] Supabase ligado e "Apagar a minha conta" testado com uma conta real
- [ ] Servidor de IA publicado e testado com 5 fotos reais
- [ ] Todas as receitas com foto
- [ ] 5 pessoas reais usaram a app uma semana e corrigiste o que as fez desistir
- [ ] Screenshots das lojas (iPhone 6,7" e 6,5"; telemóvel Android)
