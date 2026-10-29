# itDeal Sg — E-commerce frontend

Minimal, mobile-first storefront for an electronics shop in Singapore (SGD, 9% GST).
Built with **Tailwind CSS v4.3** + **Alpine.js 3.17**. The output is plain static HTML, made to be split into a WordPress/WooCommerce theme.

## Run it

```bash
npm install
npm run dev     # http://localhost:5173 — rebuilds on save
npm run build   # production build into dist/ (minified CSS)
```

Open `dist/index.html` or the dev server.

### Live preview (GitHub Pages)

```bash
npm run deploy  # builds and publishes dist/ to the gh-pages branch
```

The site is served at https://surendra742.github.io/stagingtwo/ (Settings → Pages → Source: *Deploy from a branch* → `gh-pages` / root). `dist/styleguide.html` lists all design tokens and components.

## Pages (71 generated)

| Page | File |
|---|---|
| Home — Amazon-style deal wall, product rails, campaign banners | `index.html` |
| All categories (app-style browser) | `categories.html` |
| Category listing (9) — filters, sort, load more | `category-*.html` |
| Deals (11.11 sale) · New & Trending | `deals.html` · `new-trending.html` |
| Search results (`?q=`) | `search.html` |
| Product detail (46) — gallery + zoom, variants, delivery check, bundle, specs, photo reviews | `product-*.html` |
| Cart · Checkout · Order success | `cart.html` · `checkout.html` · `order-success.html` |
| Login / Register · Account · Wishlist · Compare | `login.html` · `account.html` · `wishlist.html` · `compare.html` |
| itDeal Business (B2B, coming soon) · Build Your PC (quote form) | `business.html` · `build-pc.html` |
| 404 · Design system | `404.html` · `styleguide.html` |

## Structure

```
src/
  css/app.css          Design tokens (@theme) + component classes (.btn, .chip, .badge, .input…)
  data/catalog.js      Demo products, categories, reviews (→ WooCommerce products/terms)
  components/          Shared markup: layout (header/footer/overlays), product card, sections
  pages/               One module per page template
  assets/js/app.js     Alpine stores: cart, wishlist, compare, recently viewed, search, filters, checkout
  assets/img/          Logo, favicon, campaign banners (banners/)
build.mjs              Static builder + dev server
```

## WordPress mapping

| Here | WordPress / WooCommerce |
|---|---|
| `layout.js` head, announcement, `siteHeader()` | `header.php` |
| `siteFooter()`, `bottomNav()`, overlays | `footer.php` |
| `productCard()` | `template-parts/product/card.php` (`content-product.php`) |
| `sections.js` | `template-parts/sections/*.php` |
| `home.js` | `front-page.php` |
| `listing.js` | `archive-product.php` / `taxonomy-product_cat.php` / `search.php` |
| `product.js` | `single-product.php` |
| `checkout.js` | `cart/cart.php`, `checkout/form-checkout.php`, `checkout/thankyou.php` |
| `account.js` | `myaccount/*.php`, `global/form-login.php` |
| `shop` store in `app.js` | Replace localStorage calls with the WooCommerce Store API (`/wp-json/wc/store/v1/cart`) |

## Notes

- Product photos are hot-linked from Unsplash for the demo; replace them with real product images in WordPress.
- Cart, wishlist, compare and recently viewed are stored in `localStorage` and pre-filled with demo data on the first visit.
- Promo codes for the demo: `ITDEAL10` (10% off, max S$50) and `MEGA11` (S$111 off orders over S$1,111).
- Postal-code lookup in checkout is mocked; try `238839` or `018956`. Hook it to the OneMap API in production.
