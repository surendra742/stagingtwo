// Page registry: every entry becomes a file in dist/
import { writeFileSync } from 'node:fs';
import { products, categories } from '../data/catalog.js';
import { tagFor } from '../components/product.js';
import { icon } from '../components/html.js';
import home from './home.js';
import { categoryPages, categoriesPage, dealsPage, searchPage, newTrendingPage } from './listing.js';
import { productPages } from './product.js';
import { cartPage, checkoutPage, successPage } from './checkout.js';
import { businessPage } from './business.js';
import { buildPcPage } from './build-pc.js';
import { loginPage, accountPage, wishlistPage, comparePage, notFoundPage, styleguidePage } from './account.js';

const pages = [
  ['index.html', home],
  ['categories.html', () => categoriesPage().html],
  [null, categoryPages],
  ['deals.html', () => dealsPage().html],
  ['new-trending.html', () => newTrendingPage().html],
  ['search.html', () => searchPage().html],
  [null, productPages],
  ['cart.html', cartPage],
  ['checkout.html', checkoutPage],
  ['order-success.html', successPage],
  ['login.html', loginPage],
  ['account.html', accountPage],
  ['wishlist.html', wishlistPage],
  ['compare.html', comparePage],
  ['business.html', businessPage],
  ['build-pc.html', buildPcPage],
  ['404.html', notFoundPage],
  ['styleguide.html', styleguidePage],
];

// Slim client-side catalogue for cart, wishlist, compare, search and recently viewed
function clientData() {
  const slim = products.map(({ id, slug, brand, name, title, feat, cat, sub, price, mrp, rating, reviews, img, short, stock, sold, badge, specs, colors }, i) => {
    const [ic, text, tone] = tagFor(products[i]);
    return { id, slug, brand, name, title, feat, cat, sub, price, mrp, rating, reviews, img, short, stock, sold, badge, specs,
      colors: colors.map((c) => c.hex), tag: [icon(ic, `size-3 ${tone}`, 2.4), text] };
  });
  return `window.ITDEAL=${JSON.stringify({ products: slim, categories: categories.map(({ slug, name }) => ({ slug, name })) })};`;
}

export async function renderSite() {
  writeFileSync(new URL('../../dist/assets/js/data.js', import.meta.url), clientData());
  const out = [];
  for (const [file, render] of pages) {
    const res = await render();
    if (Array.isArray(res)) out.push(...res);
    else out.push({ file, html: res });
  }
  return out;
}
