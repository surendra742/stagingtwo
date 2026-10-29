// Global shell. WordPress mapping:
//   head()+announcement()+siteHeader() -> header.php
//   siteFooter()+bottomNav()+overlays() -> footer.php
import { html, icon, esc } from './html.js';
import { categories, img } from '../data/catalog.js';

const ANNOUNCEMENTS = [
  ['zap', '11.11 Mega Sale early access is live — up to 40% off'],
  ['truck', 'Free delivery on orders over S$49'],
  ['shield', 'Genuine local sets · 1-year Singapore warranty'],
];
const TRENDING = ['iPhone 17 Pro Max', 'MacBook Air M4', 'PS5 Pro', 'AirPods Pro 3', 'Galaxy S25 Ultra', 'Switch 2'];
const SEARCH_HINTS = ['“MacBook Air M4”', '“AirPods Pro 3”', '“Galaxy S25 Ultra”', '“PS5 Pro”', '“Sony WH-1000XM6”'];

export const logo = (cls = 'h-7 sm:h-8') =>
  html`<a href="index.html" class="inline-flex shrink-0 items-center" aria-label="itDeal Sg — home"><img src="assets/img/logo.png" alt="itDeal Sg" class="${cls} w-auto" width="314" height="86"></a>`;

function head({ title, desc }) {
  return html`<!doctype html>
<html lang="en-SG">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&display=swap">
<link rel="stylesheet" href="assets/css/app.css">
<script src="assets/js/data.js"></script>
<script defer src="assets/js/app.js"></script>
<script defer src="assets/js/vendor/alpine-focus.min.js"></script>
<script defer src="assets/js/vendor/alpine-collapse.min.js"></script>
<script defer src="assets/js/vendor/alpine.min.js"></script>
</head>`;
}

function announcement() {
  return html`
<div class="bg-ink text-white" x-data="{ i: 0 }" x-init="setInterval(() => i = (i + 1) % ${ANNOUNCEMENTS.length}, 4000)">
  <div class="wrap flex h-9 items-center justify-center text-[12px] font-medium lg:justify-between">
    <div class="relative h-full flex-1 overflow-hidden lg:max-w-xl">
      ${ANNOUNCEMENTS.map(([ic, t], k) => html`
      <p class="absolute inset-0 flex items-center justify-center gap-2 transition duration-500 lg:justify-start" :class="i === ${k} ? 'opacity-100 translate-y-0' : 'opacity-0 ${k ? 'translate-y-3' : '-translate-y-3'} pointer-events-none'">
        ${icon(ic, 'size-3.5 text-brand-100 shrink-0', 2)}<span class="truncate">${t}</span>
      </p>`)}
    </div>
    <nav class="hidden items-center gap-6 text-white/75 lg:flex" aria-label="Utility">
      <a href="account.html#orders" class="transition hover:text-white">Track order</a>
      <a href="#" class="transition hover:text-white" @click.prevent="$store.ui.chat = true">Help centre</a>
      <a href="tel:+6560000000" class="transition hover:text-white">+65 6000 0000</a>
    </nav>
  </div>
</div>`;
}

/* ---------- search: suggestion panel shared by mobile overlay + desktop dropdown */
function searchPanel() {
  return html`
<div>
  <template x-if="!q.trim()">
    <div class="space-y-6">
      <section x-show="$store.shop.searches.length">
        <div class="mb-2.5 flex items-center justify-between">
          <h3 class="eyebrow">Recent searches</h3>
          <button type="button" class="text-xs font-medium text-muted hover:text-ink" @click="$store.shop.clearSearches()">Clear</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <template x-for="s in $store.shop.searches" :key="s">
            <button type="button" class="chip" @click="go(s)">${icon('history', 'size-3.5 text-subtle')}<span x-text="s"></span></button>
          </template>
        </div>
      </section>
      <section>
        <h3 class="eyebrow mb-2.5">Trending in Singapore</h3>
        <div class="flex flex-wrap gap-2">
          ${TRENDING.map((t) => html`<button type="button" class="chip" @click="go('${t}')">${icon('flame', 'size-3.5 text-brand')}${t}</button>`)}
        </div>
      </section>
      <section>
        <h3 class="eyebrow mb-3">Popular categories</h3>
        <div class="grid grid-cols-4 gap-3 sm:grid-cols-5">
          ${categories.slice(0, 8).map((c) => html`
          <a href="category-${c.slug}.html" class="group flex flex-col items-center gap-1.5 text-center">
            <span class="grid size-14 place-items-center rounded-2xl bg-surface text-ink transition group-hover:bg-surface-2">${icon(c.icon, 'size-6', 1.5)}</span>
            <span class="text-[11.5px] font-medium leading-tight text-ink-2">${c.name}</span>
          </a>`)}
        </div>
      </section>
    </div>
  </template>
  <template x-if="q.trim()">
    <div>
      <ul class="-mx-2" role="listbox">
        <template x-for="p in results" :key="p.id">
          <li>
            <a :href="'product-' + p.slug + '.html'" class="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-surface">
              <img :src="$store.shop.img(p.img, 96)" alt="" class="size-12 shrink-0 rounded-lg bg-surface object-cover">
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-ink"><span x-text="p.title"></span></span>
                <span class="block truncate text-xs text-muted" x-text="p.short"></span>
              </span>
              <span class="price text-sm" x-text="$store.shop.money(p.price)"></span>
            </a>
          </li>
        </template>
      </ul>
      <p x-show="!results.length" class="py-6 text-center text-sm text-muted">No quick matches. Press enter to search everything.</p>
      <button type="button" class="mt-2 flex w-full items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm font-semibold" @click="go()">
        <span>See all results for “<span x-text="q"></span>”</span>${icon('arrow-right', 'size-4')}
      </button>
    </div>
  </template>
</div>`;
}

/* ---------- desktop mega menu */
function megaMenu() {
  return html`
<div class="relative" x-data="{ open: false, cat: 0, t: null }" @mouseenter="clearTimeout(t); open = true" @mouseleave="t = setTimeout(() => open = false, 120)" @keydown.escape="open = false">
  <button type="button" class="flex h-12 items-center gap-2 pr-2 text-sm font-semibold text-ink" :aria-expanded="open" @click="open = !open">
    ${icon('grid', 'size-4.5')} All categories ${icon('chevron-down', 'size-4 transition', 2)}
  </button>
  <div x-cloak x-show="open" x-transition.opacity.duration.150ms class="absolute left-0 top-full z-50 w-[min(1080px,calc(100vw-4rem))] pt-2">
    <div class="grid grid-cols-[240px_1fr_280px] overflow-hidden rounded-3xl border border-line bg-white shadow-pop">
      <ul class="border-r border-line bg-surface/60 p-3">
        ${categories.map((c, k) => html`
        <li>
          <a href="category-${c.slug}.html" @mouseenter="cat = ${k}" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition" :class="cat === ${k} ? 'bg-white text-ink shadow-sm' : 'text-ink-2 hover:text-ink'">
            ${icon(c.icon, 'size-[18px]', 1.6)} <span class="flex-1">${c.name}</span> ${icon('chevron-right', 'size-4 text-subtle')}
          </a>
        </li>`)}
      </ul>
      ${categories.map((c, k) => html`
      <div x-show="cat === ${k}" class="p-7" ${k ? 'x-cloak' : ''}>
        <p class="eyebrow">${c.name}</p>
        <h3 class="mt-1 text-xl font-bold tracking-tight">${c.blurb}</h3>
        <ul class="mt-5 grid grid-cols-2 gap-x-6 gap-y-1">
          ${c.subs.map((s) => html`<li><a href="category-${c.slug}.html" class="block rounded-lg py-1.5 text-sm text-ink-2 transition hover:text-brand">${s}</a></li>`)}
        </ul>
        <a href="category-${c.slug}.html" class="btn btn-outline btn-sm mt-6">Shop all ${c.name} ${icon('arrow-right', 'size-4')}</a>
      </div>`)}
      <a href="deals.html" class="relative m-3 overflow-hidden rounded-2xl bg-ink p-6 text-white">
        <img src="${img('1525547719571-a2d4ac8945e2', 560, 720)}" alt="" class="absolute inset-0 size-full object-cover opacity-60">
        <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"></div>
        <div class="relative flex h-full flex-col justify-end">
          <span class="badge badge-sale w-fit">11.11</span>
          <p class="mt-3 text-2xl font-bold leading-tight tracking-tight">Mega Sale early access</p>
          <p class="mt-1 text-sm text-white/75">Up to 40% off top brands</p>
          <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">Shop deals ${icon('arrow-right', 'size-4')}</span>
        </div>
      </a>
    </div>
  </div>
</div>`;
}

/* ---------- desktop "Customer Service" dropdown in the nav row */
function customerService() {
  const links = [['package', 'Track your order', 'account.html#orders'], ['returns', 'Returns & refunds', '#'], ['shield', 'Warranty & repairs', '#'], ['truck', 'Shipping & delivery', '#'], ['card', 'Payment options', '#']];
  return html`
<div class="relative shrink-0" x-data="{ open: false, t: null }" @mouseenter="clearTimeout(t); open = true" @mouseleave="t = setTimeout(() => open = false, 120)" @keydown.escape="open = false">
  <button type="button" class="flex items-center gap-1.5 whitespace-nowrap py-3.5 text-[13px] font-medium text-ink-2 transition hover:text-ink" :aria-expanded="open" @click="open = !open">
    ${icon('headset', 'size-4')} <span class="hidden min-[1380px]:inline">Customer Service</span><span class="min-[1380px]:hidden">Help</span> ${icon('chevron-down', 'size-3.5', 2)}
  </button>
  <div x-cloak x-show="open" x-transition.opacity.duration.150ms class="absolute right-0 top-full z-50 w-72 pt-1">
    <div class="rounded-2xl border border-line bg-white p-2 shadow-pop">
      <button type="button" class="flex w-full items-center gap-3 rounded-xl bg-surface px-3 py-3 text-left" @click="open = false; $store.ui.chat = true">
        <span class="grid size-9 place-items-center rounded-full bg-brand text-white">${icon('chat', 'size-[18px]')}</span>
        <span class="leading-tight"><span class="block text-sm font-semibold">Chat with us</span><span class="text-xs text-muted">Replies in under 2 minutes</span></span>
      </button>
      <ul class="mt-1">
        ${links.map(([ic, t, h]) => html`<li><a href="${h}" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-2 transition hover:bg-surface hover:text-ink">${icon(ic, 'size-[18px] text-muted')} ${t}</a></li>`)}
      </ul>
      <a href="tel:+6560000000" class="mt-1 flex items-center gap-3 border-t border-line px-3 pb-1.5 pt-3 text-sm">${icon('phone', 'size-[18px] text-muted')}<span><b>+65 6000 0000</b> <span class="text-xs text-muted">· 9am–9pm daily</span></span></a>
    </div>
  </div>
</div>`;
}

function siteHeader({ minimal = false } = {}) {
  if (minimal) {
    return html`
<header class="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
  <div class="wrap flex h-16 items-center justify-between">
    ${logo('h-7')}
    <p class="flex items-center gap-2 text-sm font-medium text-ink-2">${icon('lock', 'size-4 text-success', 2)} Secure checkout</p>
    <a href="cart.html" class="hidden text-sm font-medium text-muted hover:text-ink sm:block">Back to cart</a>
  </div>
</header>`;
  }
  return html`
<header class="sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow" x-data="header" :class="scrolled && 'shadow-[0_1px_0_var(--color-line),0_8px_24px_-12px_rgb(11_12_15/0.12)]'">
  <!-- mobile -->
  <div class="lg:hidden">
    <div class="wrap flex h-14 items-center gap-1">
      <button type="button" class="icon-btn -ml-2" aria-label="Open menu" @click="$store.ui.menu = true">${icon('menu', 'size-6')}</button>
      ${logo('h-[26px]')}
      <div class="ml-auto flex items-center">
        <a href="account.html" class="icon-btn" aria-label="Account">${icon('user', 'size-[22px]')}</a>
        <a href="cart.html" class="icon-btn -mr-2" aria-label="Cart">
          ${icon('bag', 'size-[22px]')}
          <span x-cloak x-show="$store.shop.count" class="count-dot" x-text="$store.shop.count"></span>
        </a>
      </div>
    </div>
    <div class="wrap pb-2.5">
      <button type="button" class="flex h-11 w-full items-center gap-2.5 rounded-xl bg-surface px-3.5 text-left text-[14px] text-muted" @click="$store.ui.search = true" x-data="typer(${esc(JSON.stringify(SEARCH_HINTS))})">
        ${icon('search', 'size-[18px] text-ink')}
        <span class="truncate">Search <span x-text="text" class="text-ink-2" x-transition>${SEARCH_HINTS[0]}</span></span>
      </button>
    </div>
  </div>

  <!-- desktop -->
  <div class="hidden lg:block">
    <div class="wrap flex h-[76px] items-center gap-6">
      ${logo('h-9')}
      <!-- delivery address (WooCommerce: customer shipping address / postcode) -->
      <a href="account.html#addresses" class="group flex shrink-0 items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-surface">
        ${icon('pin', 'size-[22px] text-brand', 1.9)}
        <span class="leading-tight">
          <span class="block text-[11px] text-muted" x-text="$store.shop.address ? 'Deliver to ' + $store.shop.address.name.split(' ')[0] : 'Hello'">Hello</span>
          <span class="block max-w-[150px] truncate text-[13px] font-semibold group-hover:underline" x-text="$store.shop.address ? $store.shop.address.label + ' · ' + $store.shop.address.postal : 'Select address'">Select address</span>
        </span>
      </a>
      <form action="search.html" class="relative flex-1" x-data="search" @submit.prevent="go()" @click.outside="$refs.panel && ($store.ui.search = false)" @keydown.escape="$store.ui.search = false">
        <label class="sr-only" for="q-desktop">Search products</label>
        <div class="flex h-12 items-center rounded-full border border-transparent bg-surface pl-5 pr-1.5 transition focus-within:border-ink focus-within:bg-white focus-within:ring-4 focus-within:ring-ink/5">
          ${icon('search', 'size-[18px] text-muted')}
          <input id="q-desktop" name="q" x-model="q" @focus="$store.ui.search = true" autocomplete="off" placeholder="Search laptops, phones, headphones and more" class="h-full flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-subtle">
          <button class="btn btn-dark btn-sm h-9 px-5">Search</button>
        </div>
        <div x-cloak x-ref="panel" x-show="$store.ui.search && window.innerWidth >= 1024" x-transition.opacity.duration.150ms class="absolute inset-x-0 top-[calc(100%+8px)] z-50 max-h-[70vh] overflow-y-auto rounded-3xl border border-line bg-white p-6 shadow-pop">
          ${searchPanel()}
        </div>
      </form>
      <nav class="flex items-center gap-1" aria-label="Account">
        <a href="account.html" class="flex items-center gap-2.5 rounded-full px-3 py-2 transition hover:bg-surface">
          ${icon('user', 'size-[22px]')}
          <span class="leading-tight"><span class="block text-[11px] text-muted">Hello, sign in</span><span class="block text-[13px] font-semibold">Account</span></span>
        </a>
        <a href="wishlist.html" class="icon-btn size-11" aria-label="Wishlist">
          ${icon('heart', 'size-[22px]')}
          <span x-cloak x-show="$store.shop.wish.length" class="count-dot" x-text="$store.shop.wish.length"></span>
        </a>
        <a href="cart.html" class="ml-1 flex items-center gap-2.5 rounded-full bg-ink py-2 pl-3.5 pr-4 text-white transition hover:bg-ink-2" aria-label="Cart">
          <span class="relative">${icon('bag', 'size-5')}<span x-cloak x-show="$store.shop.count" class="count-dot !ring-ink" x-text="$store.shop.count"></span></span>
          <span class="tnum text-[13px] font-semibold" x-text="$store.shop.money($store.shop.subtotal)">S$0</span>
        </a>
      </nav>
    </div>
    <div class="border-t border-line">
      <div class="wrap flex items-center gap-4">
        ${megaMenu()}
        <a href="build-pc.html" class="group flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-ink transition hover:text-brand"><svg class="size-[19px] shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2.5" stroke="#0b0c0f" stroke-width="2"/><circle cx="12" cy="14" r="4" fill="#c80015"/><path d="M12 11.6v4.8M9.6 14h4.8" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><path d="M8.5 6h7" stroke="#f2a516" stroke-width="2" stroke-linecap="round"/></svg> Build Your PC</a>
        <span class="h-5 w-px shrink-0 bg-line"></span>
        <!-- every link is fully visible (no scrolling). Narrow desktops drop the last few categories;
             they stay one click away in "All categories". Wider screens spread the links evenly. -->
        <nav class="flex min-w-0 flex-1 items-center justify-between gap-4 overflow-hidden text-[13px] font-medium text-ink-2" aria-label="Categories">
          ${categories.map((c, i) => html`<a href="category-${c.slug}.html" class="${i >= 6 ? 'hidden xl:block' : ''} whitespace-nowrap py-3.5 transition hover:text-ink">${c.name}</a>`)}
        </nav>
        ${customerService()}
        <a href="business.html" class="group flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line-2 py-1.5 pl-3.5 pr-3 text-[13px] italic tracking-tight transition hover:border-ink" aria-label="itDeal Business — B2B buying for companies">
          <span class="font-extrabold text-ink">itDeal</span><span class="font-extrabold text-brand">BUSINESS</span>${icon('arrow-up-right', 'size-3.5 text-ink transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5', 2.4)}
        </a>
      </div>
    </div>
  </div>
</header>`;
}

/* ---------- overlays */
function mobileMenu() {
  return html`
<div x-cloak x-show="$store.ui.menu" class="lg:hidden" @keydown.escape.window="$store.ui.menu = false">
  <div class="sheet-backdrop" x-show="$store.ui.menu" x-transition.opacity @click="$store.ui.menu = false"></div>
  <aside class="fixed inset-y-0 left-0 z-[70] flex w-[88%] max-w-sm flex-col bg-white" x-show="$store.ui.menu" x-trap.noscroll="$store.ui.menu"
    x-transition:enter="transition duration-300 ease-out-quint" x-transition:enter-start="-translate-x-full" x-transition:leave="transition duration-200" x-transition:leave-end="-translate-x-full" aria-label="Menu">
    <div class="flex h-14 items-center justify-between border-b border-line px-4">
      ${logo('h-6')}
      <button type="button" class="icon-btn -mr-2" aria-label="Close menu" @click="$store.ui.menu = false">${icon('x', 'size-6')}</button>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div class="m-4 rounded-2xl bg-surface p-4">
        <p class="text-[15px] font-semibold">Welcome to itDeal</p>
        <p class="mt-0.5 text-[13px] text-muted">Sign in for faster checkout, order tracking and member prices.</p>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <a href="login.html" class="btn btn-dark btn-sm">Sign in</a>
          <a href="login.html#register" class="btn btn-outline btn-sm">Create account</a>
        </div>
      </div>
      <a href="deals.html" class="mx-4 flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3 text-brand">
        ${icon('zap', 'size-5', 2)}<span class="flex-1 text-sm font-semibold">11.11 Mega Sale — up to 40% off</span>${icon('chevron-right', 'size-4')}
      </a>
      <p class="eyebrow px-4 pb-1 pt-6">Shop by category</p>
      <ul class="px-2">
        ${categories.map((c) => html`
        <li x-data="{ o: false }">
          <div class="flex items-center">
            <a href="category-${c.slug}.html" class="flex flex-1 items-center gap-3 rounded-xl px-2 py-2.5">
              <img src="${img(c.img, 80)}" alt="" class="size-10 rounded-xl bg-surface object-cover" loading="lazy">
              <span class="text-[15px] font-medium">${c.name}</span>
            </a>
            <button type="button" class="icon-btn" :aria-expanded="o" aria-label="Show ${c.name} sub-categories" @click="o = !o">${icon('chevron-down', 'size-5 transition', 1.75).replace('class="', ':class="o && \'rotate-180\'" class="')}</button>
          </div>
          <ul x-show="o" x-collapse class="mb-2 ml-[60px] space-y-0.5">
            ${c.subs.map((s) => html`<li><a href="category-${c.slug}.html" class="block py-1.5 text-sm text-muted">${s}</a></li>`)}
          </ul>
        </li>`)}
      </ul>
      <div class="mx-4 my-4 h-px bg-line"></div>
      <ul class="px-2 pb-6 text-[15px]">
        <li><a href="business.html" class="mb-1 flex items-center gap-3 rounded-xl bg-surface px-2 py-2.5">${icon('briefcase', 'size-5 text-muted')}<span class="flex-1 italic"><b>itDeal</b> <b class="text-brand">BUSINESS</b></span><span class="mr-1 text-xs text-muted">For companies</span></a></li>
        ${[['package', 'My orders', 'account.html#orders'], ['heart', 'Wishlist', 'wishlist.html'], ['compare', 'Compare products', 'compare.html'], ['shield', 'Warranty & repairs', '#'], ['returns', 'Returns & refunds', '#'], ['headset', 'Help centre', '#']].map(([ic, t, h]) => html`
        <li><a href="${h}" class="flex items-center gap-3 rounded-xl px-2 py-2.5">${icon(ic, 'size-5 text-muted')} ${t}</a></li>`)}
      </ul>
    </div>
    <div class="border-t border-line p-4 text-[13px] text-muted">Need help? Call <a href="tel:+6560000000" class="font-semibold text-ink">+65 6000 0000</a> · 9am–9pm daily</div>
  </aside>
</div>`;
}

function mobileSearch() {
  return html`
<div x-cloak x-show="$store.ui.search" class="fixed inset-0 z-[70] flex flex-col bg-white lg:hidden" x-transition.opacity.duration.150ms x-data="search" @keydown.escape.window="$store.ui.search = false">
  <form action="search.html" class="flex items-center gap-2 border-b border-line px-3 py-2.5" @submit.prevent="go()">
    <button type="button" class="icon-btn" aria-label="Close search" @click="$store.ui.search = false">${icon('arrow-left', 'size-5')}</button>
    <div class="flex h-11 flex-1 items-center rounded-xl bg-surface px-3">
      ${icon('search', 'size-[18px] text-muted')}
      <input name="q" x-model="q" x-effect="$store.ui.search && $nextTick(() => $el.focus())" enterkeyhint="search" autocomplete="off" placeholder="Search products, brands…" class="h-full flex-1 bg-transparent px-2.5 text-base outline-none placeholder:text-subtle">
      <button type="button" x-show="q" class="text-muted" @click="q = ''" aria-label="Clear">${icon('x', 'size-4')}</button>
    </div>
  </form>
  <div class="flex-1 overflow-y-auto px-4 py-5">${searchPanel()}</div>
</div>`;
}

function miniCart() {
  return html`
<div x-cloak x-show="$store.ui.cart" @keydown.escape.window="$store.ui.cart = false">
  <div class="sheet-backdrop" x-show="$store.ui.cart" x-transition.opacity @click="$store.ui.cart = false"></div>
  <aside class="fixed inset-x-0 bottom-0 z-[70] flex max-h-[88vh] flex-col rounded-t-3xl bg-white sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:max-h-none sm:w-[440px] sm:rounded-none sm:rounded-l-3xl"
    x-show="$store.ui.cart" x-trap.noscroll="$store.ui.cart" aria-label="Cart"
    x-transition:enter="transition duration-300 ease-out-quint" x-transition:enter-start="translate-y-full sm:translate-y-0 sm:translate-x-full" x-transition:leave="transition duration-200" x-transition:leave-end="translate-y-full sm:translate-y-0 sm:translate-x-full">
    <div class="mx-auto mt-2 h-1 w-10 rounded-full bg-line-2 sm:hidden"></div>
    <div class="flex items-center justify-between px-5 pb-3 pt-3 sm:pt-5">
      <h2 class="text-lg font-bold">Your cart <span class="font-medium text-muted" x-text="'(' + $store.shop.count + ')'"></span></h2>
      <button type="button" class="icon-btn -mr-2" aria-label="Close cart" @click="$store.ui.cart = false">${icon('x', 'size-5')}</button>
    </div>
    <template x-if="$store.ui.added && $store.shop.cart.length">
      <div class="mx-5 mb-3 flex items-center gap-2 rounded-xl bg-success-50 px-3 py-2.5 text-[13px] font-medium text-success">
        ${icon('check', 'size-4', 2.5)} Added to cart
      </div>
    </template>
    <div class="mx-5 mb-2 rounded-xl border border-line p-3" x-show="$store.shop.cart.length">
      <p class="text-[13px]" x-show="$store.shop.freeShipLeft > 0">Add <b class="tnum" x-text="$store.shop.money($store.shop.freeShipLeft, true)"></b> more for <b>free delivery</b></p>
      <p class="flex items-center gap-1.5 text-[13px] font-medium text-success" x-show="$store.shop.freeShipLeft <= 0">${icon('truck', 'size-4')} You’ve unlocked free delivery</p>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"><div class="h-full rounded-full bg-success transition-all duration-500" :style="'width:' + Math.min(100, $store.shop.subtotal / 49 * 100) + '%'"></div></div>
    </div>
    <div class="flex-1 overflow-y-auto px-5">
      <template x-for="line in $store.shop.cart" :key="line.key">
        <div class="flex gap-3 border-b border-line py-4 last:border-0">
          <a :href="'product-' + $store.shop.p(line.id).slug + '.html'" class="shrink-0"><img :src="$store.shop.img($store.shop.p(line.id).img, 160)" alt="" class="size-20 rounded-xl bg-surface object-cover"></a>
          <div class="min-w-0 flex-1">
            <p class="line-clamp-2 text-sm font-medium leading-snug"><span x-text="$store.shop.p(line.id).title"></span></p>
            <p class="mt-0.5 truncate text-xs text-muted" x-text="[line.variant, line.color].filter(Boolean).join(' · ')"></p>
            <div class="mt-2 flex items-center justify-between">
              <div class="flex h-8 items-center rounded-full border border-line">
                <button type="button" class="grid size-8 place-items-center" aria-label="Decrease" @click="line.qty > 1 ? $store.shop.setQty(line.key, line.qty - 1) : $store.shop.remove(line.key)">${icon('minus', 'size-3.5', 2)}</button>
                <span class="tnum w-6 text-center text-sm font-semibold" x-text="line.qty"></span>
                <button type="button" class="grid size-8 place-items-center" aria-label="Increase" @click="$store.shop.setQty(line.key, line.qty + 1)">${icon('plus', 'size-3.5', 2)}</button>
              </div>
              <span class="price text-sm" x-text="$store.shop.money($store.shop.unit(line) * line.qty)"></span>
            </div>
          </div>
        </div>
      </template>
      <div x-show="!$store.shop.cart.length" class="py-14 text-center">
        <span class="mx-auto grid size-16 place-items-center rounded-full bg-surface">${icon('bag', 'size-7 text-muted')}</span>
        <p class="mt-4 font-semibold">Your cart is empty</p>
        <p class="mt-1 text-sm text-muted">Find something you love in today’s deals.</p>
        <a href="deals.html" class="btn btn-dark mt-5">Shop deals</a>
      </div>
    </div>
    <div class="border-t border-line p-5 pb-safe" x-show="$store.shop.cart.length">
      <div class="flex items-baseline justify-between">
        <span class="text-sm text-muted">Subtotal <span class="text-xs">(incl. GST)</span></span>
        <span class="price text-xl" x-text="$store.shop.money($store.shop.subtotal, true)"></span>
      </div>
      <p class="mt-0.5 text-xs font-medium text-success" x-show="$store.shop.savings > 0">You save <span x-text="$store.shop.money($store.shop.savings)"></span> on this order</p>
      <div class="mt-4 grid grid-cols-2 gap-2.5 pb-3 sm:pb-0">
        <a href="cart.html" class="btn btn-outline">View cart</a>
        <a href="checkout.html" class="btn btn-primary">Checkout</a>
      </div>
    </div>
  </aside>
</div>`;
}

function chatPanel() {
  return html`
<div x-cloak x-show="$store.ui.chat" @keydown.escape.window="$store.ui.chat = false">
  <div class="sheet-backdrop sm:hidden" x-show="$store.ui.chat" x-transition.opacity @click="$store.ui.chat = false"></div>
  <section x-data="chat" x-show="$store.ui.chat" x-transition:enter="transition duration-300 ease-out-quint" x-transition:enter-start="translate-y-6 opacity-0" x-transition:leave="transition duration-150" x-transition:leave-end="translate-y-6 opacity-0"
    class="fixed inset-x-0 bottom-0 z-[70] flex h-[78vh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-pop sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-3xl sm:border sm:border-line" aria-label="Chat with us">
    <header class="flex items-center gap-3 bg-ink px-5 py-4 text-white">
      <span class="relative grid size-10 place-items-center rounded-full bg-brand text-sm font-bold">D<span class="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-[#22c55e] ring-2 ring-ink"></span></span>
      <div class="flex-1"><p class="text-[15px] font-semibold">Dee · itDeal Support</p><p class="text-xs text-white/65">Typically replies in under 2 min</p></div>
      <button type="button" class="grid size-9 place-items-center rounded-full hover:bg-white/10" aria-label="Close chat" @click="$store.ui.chat = false">${icon('x', 'size-5')}</button>
    </header>
    <div x-ref="log" class="flex-1 space-y-3 overflow-y-auto bg-surface/60 px-4 py-5">
      <template x-for="(m, k) in log" :key="k">
        <div class="flex" :class="m.me ? 'justify-end' : 'justify-start'">
          <p class="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed" :class="m.me ? 'rounded-br-md bg-ink text-white' : 'rounded-bl-md bg-white text-ink shadow-sm'" x-text="m.t"></p>
        </div>
      </template>
      <div x-show="typing" class="flex"><span class="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm"><i class="size-1.5 animate-bounce rounded-full bg-subtle"></i><i class="size-1.5 animate-bounce rounded-full bg-subtle [animation-delay:.15s]"></i><i class="size-1.5 animate-bounce rounded-full bg-subtle [animation-delay:.3s]"></i></span></div>
      <div class="flex flex-wrap gap-2 pt-1" x-show="log.length < 3">
        <template x-for="q in quick" :key="q"><button type="button" class="chip h-8 text-[12.5px]" @click="send(q)" x-text="q"></button></template>
      </div>
    </div>
    <form class="flex items-center gap-2 border-t border-line p-3 pb-safe" @submit.prevent="send()">
      <input x-model="msg" placeholder="Type your message…" class="h-11 flex-1 rounded-full bg-surface px-4 text-[15px] outline-none focus:ring-2 focus:ring-ink/10" aria-label="Message">
      <button class="grid size-11 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-600" aria-label="Send">${icon('send', 'size-[18px]')}</button>
    </form>
  </section>
</div>`;
}

function toast() {
  return html`
<div x-cloak x-show="$store.ui.toastOn" x-transition:enter="transition duration-300 ease-out-quint" x-transition:enter-start="translate-y-4 opacity-0" x-transition:leave="transition duration-200" x-transition:leave-end="translate-y-4 opacity-0"
  class="pointer-events-none fixed inset-x-0 bottom-[88px] z-[80] flex justify-center px-4 lg:bottom-8" role="status" aria-live="polite">
  <p class="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white shadow-pop">
    <span class="grid size-5 place-items-center rounded-full bg-white/15">${icon('check', 'size-3', 3)}</span><span x-text="$store.ui.toastMsg"></span>
  </p>
</div>`;
}

function compareTray(raised = false) {
  return html`
<div x-cloak x-show="$store.shop.compare.length" x-transition.opacity class="fixed inset-x-0 ${raised ? 'bottom-[92px]' : 'bottom-[76px]'} z-30 flex justify-center px-3 lg:bottom-6">
  <div class="flex items-center gap-2 rounded-full border border-line bg-white/95 p-1.5 pl-2 shadow-pop backdrop-blur">
    <div class="flex -space-x-2">
      <template x-for="id in $store.shop.compare" :key="id">
        <img :src="$store.shop.img($store.shop.p(id).img, 80)" alt="" class="size-9 rounded-full border-2 border-white bg-surface object-cover">
      </template>
    </div>
    <a href="compare.html" class="btn btn-dark btn-sm">${icon('compare', 'size-4')} Compare <span x-text="$store.shop.compare.length + '/4'"></span></a>
    <button type="button" class="icon-btn size-9 text-muted" aria-label="Clear compare" @click="$store.shop.clearCompare()">${icon('x', 'size-4')}</button>
  </div>
</div>`;
}

export function bottomNav(active = 'home') {
  const items = [
    ['home', 'Home', 'home', 'index.html'],
    ['categories', 'Categories', 'grid', 'categories.html'],
    ['deals', 'Deals', 'percent', 'deals.html'],
    ['compare', 'Compare', 'compare', 'compare.html'],
    ['chat', 'Chat', 'chat', '#chat'],
  ];
  return html`
<nav class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-safe backdrop-blur lg:hidden" aria-label="Primary">
  <ul class="grid h-16 grid-cols-5">
    ${items.map(([key, label, ic, href]) => {
      const on = key === active;
      const attrs = key === 'chat' ? `@click.prevent="$store.ui.chat = true"` : '';
      return html`
    <li>
      <a href="${href}" ${attrs} class="relative flex h-full flex-col items-center justify-center gap-1 text-[10.5px] font-medium ${on ? 'text-ink' : 'text-muted'}" ${on ? 'aria-current="page"' : ''}>
        ${on ? '<span class="absolute top-0 h-[3px] w-8 rounded-b-full bg-brand"></span>' : ''}
        <span class="relative">
          ${icon(ic, 'size-[22px]', on ? 2 : 1.6)}
          ${key === 'deals' ? '<span class="absolute -right-3 -top-1.5 rounded-full bg-brand px-1 text-[8.5px] font-bold leading-[14px] text-white">11.11</span>' : ''}
          ${key === 'compare' ? '<span x-cloak x-show="$store.shop.compare.length" class="count-dot !-right-2" x-text="$store.shop.compare.length"></span>' : ''}
        </span>
        ${label}
      </a>
    </li>`;
    })}
  </ul>
</nav>`;
}

/* ---------- footer */
const social = {
  Instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  Facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z"/>',
  TikTok: '<path d="M16 3c.3 2.3 1.8 3.8 4 4v3.2c-1.5 0-2.9-.4-4-1.2V15a6 6 0 1 1-6-6v3.3a2.7 2.7 0 1 0 2.7 2.7V3H16Z"/>',
  YouTube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3V9Z" fill="currentColor"/>',
};

const POLICIES = [['Privacy Policy', '#'], ['Terms of Use', '#'], ['Warranty Policy', '#'], ['Refund Policy', '#']];

function siteFooter() {
  const cols = [
    ['Shop', categories.slice(0, 7).map((c) => [c.name, `category-${c.slug}.html`]).concat([["Today's deals", 'deals.html']])],
    ['Help', [['Track your order', 'account.html#orders'], ['Shipping & delivery', '#'], ['Returns & refunds', '#'], ['Warranty & repairs', '#'], ['Payment options', '#'], ['FAQs', '#']]],
    ['itDeal', [['About us', '#'], ['Our store', '#'], ['Corporate & education', '#'], ['Careers', '#'], ['Press', '#']]],
  ];
  const pay = ['Visa', 'Mastercard', 'AMEX', 'PayNow', 'Apple Pay', 'Google Pay', 'GrabPay'];
  return html`
<footer class="mt-6 bg-surface lg:mt-10">
  <button type="button" class="block h-12 w-full bg-surface-2 text-[13px] font-semibold text-ink-2 transition hover:text-ink" @click="window.scrollTo({ top: 0, behavior: 'smooth' })">
    <span class="inline-flex items-center gap-1.5">${icon('arrow-up', 'size-4')} Back to top</span>
  </button>
  <div class="wrap py-10 lg:py-14" :class="$store.shop.compare.length && '!pb-24'">
    <div class="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[1.3fr_2fr]">
      <!-- centred on phones/tablets, left-aligned from lg -->
      <div class="flex flex-col items-center text-center lg:items-start lg:text-left">
        ${logo('h-8 mix-blend-multiply')}
        <p class="mt-4 max-w-sm text-sm leading-relaxed text-muted">Singapore’s home for genuine electronics. Local warranty, fast island-wide delivery and real humans when you need help.</p>
        <form class="mt-6 w-full max-w-md" x-data="newsletter" @submit.prevent="submit()">
          <p class="text-sm font-semibold">Get S$10 off your first order</p>
          <div x-show="!done" class="mt-2.5 flex gap-2">
            <label for="nl-email" class="sr-only">Email address</label>
            <input id="nl-email" type="email" x-model="email" placeholder="Your email address" class="input h-11 flex-1 bg-white">
            <button class="btn btn-dark h-11">Subscribe</button>
          </div>
          <p x-show="err" x-text="err" class="mt-1.5 text-xs text-brand"></p>
          <p x-cloak x-show="done" class="mt-2.5 flex items-center justify-center gap-2 rounded-xl bg-success-50 lg:justify-start px-3 py-2.5 text-sm font-medium text-success">${icon('check', 'size-4', 2.5)} You’re in! Check your inbox for code WELCOME10.</p>
          <p class="mt-2 text-xs text-subtle">Deals & launches only. Unsubscribe anytime.</p>
        </form>
        <div class="mt-6 hidden gap-2 lg:flex">
          ${Object.entries(social).map(([n, d]) => html`<a href="#" class="grid size-10 place-items-center rounded-full bg-white text-ink-2 ring-1 ring-line transition hover:text-ink hover:ring-ink" aria-label="${n}"><svg class="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg></a>`)}
        </div>
      </div>
      <div class="grid grid-cols-[minmax(0,1fr)] gap-0 sm:grid-cols-3 sm:gap-8">
        ${cols.map(([t, links]) => html`
        <div x-data="{ o: false }" class="border-b border-line sm:border-0">
          <button type="button" class="flex w-full items-center justify-between py-4 text-left text-sm font-semibold sm:pointer-events-none sm:py-0 sm:pb-4" @click="o = !o" :aria-expanded="o">
            ${t}<span class="sm:hidden transition" :class="o && 'rotate-180'">${icon('chevron-down', 'size-4')}</span>
          </button>
          <ul class="hidden space-y-2.5 pb-4 text-sm text-muted sm:block" :class="o && '!block'">
            ${links.map(([l, h]) => html`<li><a href="${h}" class="transition hover:text-ink">${l}</a></li>`)}
          </ul>
        </div>`)}
        <div class="hidden pt-2 text-sm text-muted lg:col-span-3 lg:block">
          <p class="font-semibold text-ink">Visit or call us</p>
          <p class="mt-2 flex items-start gap-2">${icon('pin', 'size-4 mt-0.5 shrink-0')} 1 HarbourFront Walk, #02-118, Singapore 098585 · 10am–10pm daily</p>
          <p class="mt-1.5 flex items-center gap-4">
            <a href="tel:+6560000000" class="flex items-center gap-2 hover:text-ink">${icon('phone', 'size-4 shrink-0')} +65 6000 0000</a>
            <a href="mailto:hello@itdeal.sg" class="flex items-center gap-2 hover:text-ink">${icon('mail', 'size-4 shrink-0')} hello@itdeal.sg</a>
          </p>
        </div>
      </div>
    </div>
    <!-- phones & tablets: boAt-style centred block -->
    <div class="mt-10 border-t border-line pt-8 text-center lg:hidden">
      <p class="text-[18px] font-medium text-ink sm:text-xl">Let’s get social</p>
      <div class="mt-4 flex items-center justify-center gap-7 sm:gap-9">
        ${Object.entries(social).map(([n, d]) => html`<a href="#" class="text-ink transition hover:text-brand" aria-label="${n}"><svg class="size-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg></a>`)}
      </div>
      <!-- one row on every screen; long names wrap inside their own slot (boAt-style) -->
      <ul class="mx-auto mt-8 flex max-w-3xl items-center justify-center text-[13px] leading-snug text-ink-2 sm:text-[13.5px]">
        ${POLICIES.map(([l, h], i) => html`${i ? '<li class="mx-2 size-1 shrink-0 rounded-full bg-ink-2 sm:mx-3" aria-hidden="true"></li>' : ''}<li class="min-w-0 flex-1 text-center sm:flex-none"><a href="${h}" class="transition hover:text-ink hover:underline">${l}</a></li>`)}
      </ul>
      <div class="mt-6 flex flex-wrap justify-center gap-1.5">
        ${pay.map((p) => html`<span class="inline-flex h-7 items-center rounded-md border border-line bg-white px-2.5 text-[11px] font-semibold text-ink-2">${p}</span>`)}
      </div>
      <p class="mt-6 text-[13px] text-subtle">© 2026 itDeal Sg Pte. Ltd. All Rights Reserved.<br class="sm:hidden"> All prices in SGD incl. 9% GST.</p>
      <p class="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-subtle">
        <span class="block">For queries contact us: itDeal Sg Pte. Ltd.</span>
        <span class="block">1 HarbourFront Walk, #02-118, Singapore 098585</span>
        <span class="block"><a href="tel:+6560000000" class="hover:text-ink">+65 6000 0000</a> · <a href="mailto:hello@itdeal.sg" class="hover:text-ink">hello@itdeal.sg</a></span>
        <span class="block">Open 10am–10pm daily</span>
      </p>
    </div>
    <!-- desktop: original bottom bar -->
    <div class="mt-10 hidden items-center justify-between gap-5 border-t border-line pt-6 lg:flex">
      <div class="flex flex-wrap gap-1.5">
        ${pay.map((p) => html`<span class="inline-flex h-7 items-center rounded-md border border-line bg-white px-2.5 text-[11px] font-semibold text-ink-2">${p}</span>`)}
      </div>
      <div class="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-xs text-muted">
        <span>© 2026 itDeal Sg Pte. Ltd. All prices in SGD incl. 9% GST.</span>
        <a href="#" class="hover:text-ink">Privacy</a><a href="#" class="hover:text-ink">Terms</a><a href="#" class="hover:text-ink">Sitemap</a>
      </div>
    </div>
  </div>
</footer>`;
}

/* ---------- page wrapper */
export function page({ title, desc = 'Shop genuine laptops, phones, audio and gaming at the best prices in Singapore. Free delivery over S$49 and 1-year local warranty.', body, nav = 'home', minimal = false, tray = true, bodyClass = '' }) {
  return html`${head({ title, desc })}
<body x-data class="${minimal || nav === null ? '' : 'pb-16 lg:pb-0'} ${bodyClass}">
<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
${!minimal && announcement()}
${siteHeader({ minimal })}
<main id="main">
${body}
</main>
${!minimal && siteFooter()}
${!minimal && nav !== null && bottomNav(nav)}
${!minimal && mobileMenu()}
${!minimal && mobileSearch()}
${!minimal && miniCart()}
${chatPanel()}
${!minimal && tray && compareTray(nav === null)}
${toast()}
</body>
</html>`;
}
