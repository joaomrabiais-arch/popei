# Shedless no Lovable

O Lovable cria o aspeto da loja e liga-a à Shopify, que trata do checkout, dos pagamentos e das encomendas. Segundo o anúncio oficial do Lovable, a integração com a Shopify **cria uma loja nova** (ainda não liga a lojas que já existem). Confirma isso nas definições do Lovable.

## Como fazer (≈ 15 min)
1. Abre lovable.dev → New project.
2. Cola a mensagem abaixo, **toda**.
3. Quando o Lovable pedir, liga a Shopify ("Connect Shopify" / "Claim store") e cria a conta.
4. Na Shopify: instala a app **TeemDrop**, importa o rolo tira-pelos e associa-o ao produto "Shedless" (3 variantes).
5. Substitui as ilustrações pelas tuas fotos e vídeos da amostra.
6. Preenche o rodapé com os teus dados legais.

A pré-visualização do aspeto que a loja deve ter está em `loja-en/index.html`.

---

## Mensagem para colar no Lovable

```
Build a high-converting single-product dropshipping store called "Shedless" that sells a reusable pet hair remover roller. Connect it to Shopify for products, cart and checkout.

Market: Ireland. Language: English (UK/IE spelling). Currency: EUR. Prices include VAT.

Brand: clean, modern, friendly. Primary colour deep teal #1f6f68, soft mint #e2f0ec, warm accent #f2b544 for the "Most popular" badge only, off-white background #f6f7f4, near-black text #16201e. Headings in "Bricolage Grotesque", body in "Figtree". Rounded corners (14–20px), generous white space. Must support dark mode and look perfect on mobile (most traffic comes from Facebook/Instagram ads on phones).

Product (one product, 3 variants):
- "1 roller" – For the sofa – €24.90
- "2 rollers: home + car" – One for the house, one for the car – €39.90 – badge "Most popular" – show "Save €9.90" – selected by default
- "3 rollers" – Keep one, gift one – €49.90 – show "Save €24.80"

Page structure (top to bottom):
1. Announcement bar: "Free shipping to Ireland · 30-day money-back guarantee".
2. Sticky header: logo "Shedless" (teal dot + wordmark), links How it works / Why Shedless / FAQ, cart button with item count.
3. Hero, two columns on desktop, stacked on mobile:
   - Left: product image gallery with 4 thumbnails (main photo, lid open showing hair in the chamber, in use on a sofa, two rollers). Use placeholders I can replace.
   - Right: eyebrow "Reusable pet hair remover"; H1 "Dog hair off the sofa in 10 seconds."; subtitle "Roll it back and forth, open the lid, bin the fur. No sticky sheets, no refills, no batteries."; three check-mark bullets: "Works on sofas, beds, blankets, carpets and car seats", "Pulls out hair the vacuum leaves woven in the fabric", "Never buy lint roller refills again"; the 3 variants as large selectable cards (radio style); full-width "Add to cart" button; three trust tiles: Free shipping to Ireland / 30 days money back / Secure checkout.
4. "How it works": 3 cards — 1 Roll, 2 Open, 3 Empty, with one short sentence each.
5. Comparison table "Shedless vs sticky lint rollers": Refills (Never vs Every few uses), Waste (Just the fur vs Sheets of sticky paper), Large areas (Fast vs Slow, sheet fills up), Batteries (None vs None), Best on clothes (Not ideal for fine knits vs Good). Be honest — keep the row where the lint roller wins.
6. "Where it works best": 4 tiles — Sofas, Beds, Car seats, Carpets.
7. Reviews section: show only real reviews from verified buyers (connect a reviews app later). Until then show "Reviews from verified buyers will appear here once orders are delivered." Do NOT invent reviews, star ratings, "X people are viewing", fake countdown timers or fake stock counters.
8. FAQ accordion: delivery time (ships in 1–3 business days, arrives in 7–12 business days, tracking by email); works on cat hair; will it damage my sofa (no glue or blades, test on hidden area, not for silk/fine knits); what if it doesn't work (30-day refund + 14-day EU right of withdrawal); why buy 2 (home + car).
9. Footer: business name, VAT number, address, support email, EU responsible person (GPSR) — as editable placeholders; links to Refund policy, Privacy policy, Terms of service, Shipping policy.

Behaviour:
- Slide-in cart drawer from the right with quantity +/- per line, total, "Free shipping to Ireland included", and a Checkout button that goes to Shopify checkout.
- On mobile, show a sticky "Add to cart" bar at the bottom once the main button scrolls out of view.
- Fast: compress images, lazy-load everything below the hero.
- Add Meta (Facebook) Pixel placeholder for PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
- SEO title: "Shedless – Reusable Pet Hair Remover for Sofa, Bed & Car | Ireland". Meta description: "Remove dog and cat hair from sofas, beds and car seats in seconds. No refills, no batteries. Free shipping to Ireland."
- Create these pages: Refund policy, Shipping policy, Privacy policy, Terms of service, Contact.
```
