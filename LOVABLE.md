# Shedless no Lovable

O Lovable cria o aspeto da loja e liga-a à Shopify, que trata do checkout, dos pagamentos e das encomendas. Segundo o anúncio oficial do Lovable, a integração com a Shopify **cria uma loja nova** (ainda não liga a lojas que já existem). Confirma isso nas definições do Lovable.

## Como fazer (≈ 15 min)
1. Abre lovable.dev → New project.
2. Cola a mensagem abaixo, **toda**.
3. Quando o Lovable pedir, liga a Shopify ("Connect Shopify" / "Claim store") e cria a conta.
4. Na Shopify: instala a app **TeemDrop**, importa o rolo tira-pelos e associa-o ao produto "Shedless" (3 variantes).
5. Substitui as ilustrações pelas tuas fotos e vídeos da amostra.
6. Preenche o rodapé com os teus dados legais.

A pré-visualização do aspeto que a loja deve ter está em `loja-en/index.html`. As imagens da galeria estão em `loja-en/img/` e os vídeos em `loja-en/video/`. Carrega-os no Lovable quando ele pedir imagens.

---

## Mensagem para colar no Lovable

```
Build a high-converting single-product dropshipping store called "Shedless" that sells a reusable pet hair remover roller. Connect it to Shopify for products, cart and checkout.

Market: Ireland. Language: English (UK/IE spelling). Currency: EUR. Prices include VAT.

Brand: clean, modern, friendly. Primary colour deep teal #1f6f68, soft mint #e2f0ec, warm accent #f2b544 for the "Most popular" badge only, off-white background #f6f7f4, near-black text #16201e. Headings in "Bricolage Grotesque", body in "Figtree". Rounded corners (14–20px), generous white space. Must support dark mode and look perfect on mobile (most traffic comes from Facebook/Instagram ads on phones).

Offer and variants (one product, 3 variants). Discounts are real, calculated from the single-roller price of €24.90. Do not show any made-up "was" price:
- "1 roller" – Try it out – €24.90
- "2 rollers" – 2nd roller 50% off – €37.35 (show €49.80 crossed out)
- "Buy 2, get 1 FREE" – 3 rollers: home + car + one to give – €49.80 (show €74.70 crossed out, red "1 FREE" label, gold ribbon "Best value") – SELECTED BY DEFAULT

Page structure (top to bottom). IMAGES FIRST: on mobile the gallery is the very first thing under the header, full width, before any text.
1. Dark announcement bar: "BUY 2, GET 1 FREE · Free shipping to Ireland · 30-day money-back guarantee" (offer in gold).
2. Header: logo "Shedless" (teal dot + wordmark) and a Cart button with item count.
3. Hero:
   - Gallery (left on desktop, sticky while scrolling; top and full-width on mobile): big square main image with left/right arrows, swipe on mobile, dots, and 6 thumbnails below. Images in this order: product hero with "BUY 2, GET 1 FREE" badge; benefits infographic ("No refills. No batteries. No mess."); before/after sofa; lid open with collected fur; 3-pack "Buy 2, get 1 FREE"; comparison vs sticky roller. I will upload these images (and later replace them with real product photos).
   - Buy box: eyebrow "Reusable pet hair remover"; H1 "Dog hair off the sofa in 10 seconds"; big price of the selected bundle + crossed-out full price + red "Save €X" tag; one-line description; 3 check bullets; "Choose your bundle" with the 3 variants as large cards; big "Add to cart" button; 3 assurance tiles (Free shipping to Ireland / 30 days money back / Tracked delivery); "Secure checkout · Visa · Mastercard · Apple Pay · Google Pay".
4. "See it in action": 3 vertical 9:16 videos side by side (horizontal swipe carousel on mobile), autoplay, muted, loop, playsinline. I will upload the 3 MP4 files.
5. "Before and after": interactive drag slider between a "before" image (sofa covered in hair) and an "after" image (clean sofa).
6. "Why pet owners switch": 4 benefit cards — Reusable, Fast on big areas, No batteries, Car friendly.
7. "How it works": image of the lid open on one side, 3 numbered steps (Roll, Open, Empty) on the other.
8. Comparison table "Shedless vs sticky rollers": Refills (Never vs Every few uses), Waste (Just the fur vs Sticky sheets), Whole sofa (Fast vs Slow), Fine knits and clothes (Not ideal vs Better). Keep the honest last row.
9. Guarantee banner (teal): round "30 DAY GUARANTEE" seal, "Try it on your sofa for 30 days", full refund + 14-day EU right to cancel.
10. FAQ accordion: how "Buy 2, get 1 free" works; delivery (ships 1–3 business days, arrives 7–12, tracking); cat hair; will it damage my sofa; refunds.
11. Final offer block (dark): 3-pack image + "Buy 2, get 1 FREE" + "3 rollers for €49.80 instead of €74.70. Free shipping to Ireland." + button "Get the 3-pack" that selects the 3-pack and adds it to the cart.
12. Footer: business name, VAT number, address, support email, EU responsible person (GPSR) as editable placeholders; links to Shipping, Refund, Privacy, Terms, Contact.

Never add: fake reviews or star ratings, "X people are viewing", fake countdown timers, fake low-stock counters, or invented "was" prices. Add a reviews app later and only show reviews from real buyers.

Behaviour:
- Slide-in cart drawer from the right: product thumbnail, quantity +/- per line, an upsell box "Upgrade to Buy 2, get 1 FREE" when the cart has the 1- or 2-roller option, "✓ Free shipping to Ireland", total, and a Checkout button that goes to Shopify checkout.
- On mobile, once the main Add to cart button scrolls past, show a sticky bottom bar with the selected bundle price + name and an "Add to cart" button.
- Fast: compress images, lazy-load everything below the hero.
- Add Meta (Facebook) Pixel placeholder for PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
- SEO title: "Shedless – Reusable Pet Hair Remover for Sofa, Bed & Car | Ireland". Meta description: "Remove dog and cat hair from sofas, beds and car seats in seconds. No refills, no batteries. Free shipping to Ireland."
- Create these pages: Refund policy, Shipping policy, Privacy policy, Terms of service, Contact.
```
