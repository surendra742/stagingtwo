// Category, Deals and Search all share this layout -> archive-product.php
import { html, icon, esc } from '../components/html.js';
import { page } from '../components/layout.js';
import { productCard } from '../components/product.js';
import { breadcrumb, recentlyViewed } from '../components/sections.js';
import { categories, products, inCat, img, money, IMG } from '../data/catalog.js';

const PRICE_RANGES = [['', 200, 'Under S$200'], [200, 500, 'S$200 – S$500'], [500, 1000, 'S$500 – S$1,000'], [1000, 2000, 'S$1,000 – S$2,000'], [2000, '', 'Above S$2,000']];

const group = (title, body, open = true) => html`
<div class="border-b border-line py-5 first:pt-0" x-data="{ o: ${String(open)} }">
  <button type="button" class="flex w-full items-center justify-between text-left text-sm font-semibold" @click="o = !o" :aria-expanded="o">
    ${title}<span class="transition" :class="o && 'rotate-180'">${icon('chevron-down', 'size-4 text-muted')}</span>
  </button>
  <div x-show="o" x-collapse><div class="pt-3.5">${body}</div></div>
</div>`;

function filters(items, { subs = [] } = {}) {
  const brands = [...new Set(items.map((p) => p.brand))].sort();
  const count = (b) => items.filter((p) => p.brand === b).length;
  return html`
${subs.length > 1 && group('Type', html`
  <div class="space-y-2.5">
    ${subs.map((s) => html`<label class="flex items-center gap-3 text-sm text-ink-2"><input type="checkbox" class="check" value="${s}" x-model="subs"> <span class="flex-1">${s}</span> <span class="text-xs text-subtle">${items.filter((p) => p.sub === s).length}</span></label>`)}
  </div>`)}
${group('Brand', html`
  <div class="space-y-2.5" x-data="{ all: false }">
    ${brands.map((b, i) => html`<label class="flex items-center gap-3 text-sm text-ink-2" ${i > 5 ? 'x-show="all"' : ''}><input type="checkbox" class="check" value="${b}" x-model="brands"> <span class="flex-1">${b}</span> <span class="text-xs text-subtle">${count(b)}</span></label>`)}
    ${brands.length > 6 ? html`<button type="button" class="text-[13px] font-semibold text-ink underline underline-offset-4" @click="all = !all" x-text="all ? 'Show less' : 'Show all ${brands.length} brands'"></button>` : ''}
  </div>`)}
${group('Price', html`
  <div class="flex items-center gap-2">
    <label class="relative flex-1"><span class="sr-only">Minimum price</span><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted">S$</span><input type="number" inputmode="numeric" min="0" placeholder="Min" x-model.lazy="min" class="input h-10 pl-8 text-sm"></label>
    <span class="text-subtle">–</span>
    <label class="relative flex-1"><span class="sr-only">Maximum price</span><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted">S$</span><input type="number" inputmode="numeric" min="0" placeholder="Max" x-model.lazy="max" class="input h-10 pl-8 text-sm"></label>
  </div>
  <div class="mt-3 flex flex-wrap gap-1.5">
    ${PRICE_RANGES.map(([a, b, l]) => html`<button type="button" class="chip h-8 px-3 text-xs" :aria-pressed="min === '${a}' && max === '${b}'" @click="setPrice('${a}', '${b}')">${l}</button>`)}
  </div>`)}
${group('Customer rating', html`
  <div class="space-y-2.5">
    ${[4.5, 4, 0].map((r) => html`<label class="flex items-center gap-3 text-sm text-ink-2"><input type="radio" class="radio" name="rating" value="${r}" x-model.number="rating"> ${r ? html`<span class="inline-flex items-center gap-1">${r} ${icon('star', 'size-3.5 text-star')} & up</span>` : 'Any rating'}</label>`)}
  </div>`)}
${group('Discount', html`
  <div class="space-y-2.5">
    ${[30, 20, 10, 0].map((d) => html`<label class="flex items-center gap-3 text-sm text-ink-2"><input type="radio" class="radio" name="discount" value="${d}" x-model.number="discount"> ${d ? `${d}% off or more` : 'Any'}</label>`)}
  </div>`, false)}
${group('Availability', html`
  <label class="flex items-center justify-between text-sm text-ink-2">In stock only
    <span class="relative inline-flex"><input type="checkbox" class="peer sr-only" x-model="inStock"><span class="h-6 w-11 rounded-full bg-line-2 transition peer-checked:bg-ink"></span><span class="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"></span></span>
  </label>`, false)}`;
}

function sortSelect() {
  return html`
<label class="relative hidden items-center gap-2 text-sm lg:flex">
  <span class="text-muted">Sort by</span>
  <select x-model="sort" class="h-10 appearance-none rounded-full border border-line-2 bg-white pl-4 pr-10 text-sm font-medium outline-none focus:border-ink">
    <template x-for="(label, key) in sorts" :key="key"><option :value="key" x-text="label" :selected="key === sort"></option></template>
  </select>
  <span class="pointer-events-none absolute right-3.5">${icon('chevron-down', 'size-4')}</span>
</label>`;
}

function mobileSheets(items, opts) {
  return html`
<template x-teleport="body">
  <div x-cloak x-show="$store.ui.sheet === 'filters' || $store.ui.sheet === 'sort'" class="lg:hidden" @keydown.escape.window="$store.ui.sheet = null">
    <div class="sheet-backdrop" x-transition.opacity @click="$store.ui.sheet = null"></div>
    <div x-show="$store.ui.sheet === 'sort'" x-transition:enter="transition duration-300 ease-out-quint" x-transition:enter-start="translate-y-full" x-transition:leave="transition duration-200" x-transition:leave-end="translate-y-full" class="fixed inset-x-0 bottom-0 z-[70] rounded-t-3xl bg-white pb-safe">
      <div class="mx-auto mt-2 h-1 w-10 rounded-full bg-line-2"></div>
      <p class="px-5 pb-2 pt-4 text-lg font-bold">Sort by</p>
      <ul class="px-2 pb-4">
        <template x-for="(label, key) in sorts" :key="key">
          <li><button type="button" class="flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left text-[15px]" :class="sort === key ? 'font-semibold text-ink' : 'text-ink-2'" @click="sort = key; $store.ui.sheet = null"><span x-text="label"></span><span x-show="sort === key">${icon('check', 'size-5 text-brand', 2.5)}</span></button></li>
        </template>
      </ul>
    </div>
    <div x-show="$store.ui.sheet === 'filters'" x-trap.noscroll="$store.ui.sheet === 'filters'" x-transition:enter="transition duration-300 ease-out-quint" x-transition:enter-start="translate-y-full" x-transition:leave="transition duration-200" x-transition:leave-end="translate-y-full" class="fixed inset-x-0 bottom-0 top-10 z-[70] flex flex-col rounded-t-3xl bg-white">
      <div class="flex items-center justify-between border-b border-line px-5 py-4">
        <p class="text-lg font-bold">Filters</p>
        <div class="flex items-center gap-2"><button type="button" class="text-sm font-medium text-muted" @click="reset()">Clear all</button><button type="button" class="icon-btn -mr-2" aria-label="Close filters" @click="$store.ui.sheet = null">${icon('x', 'size-5')}</button></div>
      </div>
      <div class="flex-1 overflow-y-auto px-5 py-5">${filters(items, opts)}</div>
      <div class="border-t border-line p-4 pb-safe"><button type="button" class="btn btn-dark btn-lg mb-2 w-full" @click="$store.ui.sheet = null"><span>Show <span x-text="total"></span> results</span></button></div>
    </div>
  </div>
</template>`;
}

export function listingPage({ file, title, h1, sub = '', crumbs, items, nav = 'categories', search = false, hero = '', subs = [], defaultSort = '' }) {
  const ids = items.map((p) => p.id);
  const cfg = esc(JSON.stringify({ ids, search }));
  return {
    file,
    html: page({
      title, nav,
      body: html`
<div x-data="listing(${cfg})" ${defaultSort ? `x-init="sort = '${defaultSort}'"` : ''}>
  <div class="wrap pt-4 sm:pt-6">
    ${breadcrumb(crumbs)}
    ${hero}
    <div class="mt-4 flex flex-wrap items-end justify-between gap-3 sm:mt-6">
      <div>
        ${search
          ? html`<h1 class="text-2xl font-bold tracking-tight sm:text-3xl"><span x-show="q">Results for “<span x-text="q"></span>”</span><span x-show="!q">All products</span></h1>`
          : html`<h1 class="text-2xl font-bold tracking-tight sm:text-[32px]">${h1}</h1>`}
        <p class="mt-1 text-sm text-muted"><span x-text="total">${items.length}</span> products${sub ? ` · ${sub}` : ''}</p>
      </div>
      ${sortSelect()}
    </div>
    ${subs.length > 1 ? html`
    <div class="snap-rail mt-4 gap-2">
      <button type="button" class="chip" :aria-pressed="!subs.length" @click="subs = []">All</button>
      ${subs.map((s) => html`<button type="button" class="chip" :aria-pressed="subs.includes('${s}')" @click="subs = subs.includes('${s}') ? subs.filter(x => x !== '${s}') : [...subs, '${s}']">${s}</button>`)}
    </div>` : ''}
  </div>

  <div class="wrap mt-5 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-8 lg:grid-cols-[260px_minmax(0,1fr)]">
    <aside class="hidden lg:block" aria-label="Filters">
      <div class="sticky top-[140px] max-h-[calc(100vh-160px)] overflow-y-auto pb-6 pr-2">
        <div class="mb-4 flex items-center justify-between"><p class="text-base font-bold">Filters</p><button type="button" class="text-[13px] font-medium text-muted hover:text-ink" x-show="chips.length" @click="reset()">Clear all</button></div>
        ${filters(items, { subs })}
      </div>
    </aside>
    <div class="min-w-0">
      <div class="mb-4 grid grid-cols-2 gap-2 lg:hidden">
        <button type="button" class="btn btn-outline h-11" @click="$store.ui.sheet = 'sort'">${icon('sort', 'size-4')} <span x-text="sort === 'featured' ? 'Sort' : sorts[sort]" class="truncate"></span></button>
        <button type="button" class="btn btn-outline h-11" @click="$store.ui.sheet = 'filters'">${icon('filter', 'size-4')} Filter <span x-show="chips.length" class="grid size-5 place-items-center rounded-full bg-brand text-[11px] text-white" x-text="chips.length"></span></button>
      </div>
      <div class="mb-5 flex flex-wrap items-center gap-2" x-show="chips.length" x-cloak>
        <template x-for="c in chips" :key="c.label">
          <button type="button" class="chip h-8 gap-1 bg-surface pl-3 pr-2 text-xs" @click="c.clear()"><span x-text="c.label"></span>${icon('x', 'size-3.5')}</button>
        </template>
        <button type="button" class="text-xs font-semibold text-ink underline underline-offset-4" @click="reset()">Clear all</button>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4 wide:grid-cols-5">
        ${items.map((p, i) => html`<div x-show="show(${p.id})" :style="{ order: pos(${p.id}) }">${productCard(p, { compare: true, eager: i < 4 })}</div>`)}
      </div>

      <div x-show="!total" x-cloak class="mx-auto max-w-sm py-16 text-center">
        <span class="mx-auto grid size-20 place-items-center rounded-full bg-surface">${icon('search', 'size-8 text-muted', 1.5)}</span>
        <h2 class="mt-5 text-xl font-bold tracking-tight">No matches found</h2>
        <p class="mt-2 text-[15px] text-muted">Try removing a filter or searching for something broader, like “laptop” or “headphones”.</p>
        <button type="button" class="btn btn-dark mt-6" @click="reset(); ${search ? "q = ''" : ''}">Clear filters</button>
      </div>

      <div x-show="total > limit" class="mx-auto mt-12 max-w-xs text-center">
        <p class="text-[13px] text-muted">Showing <span x-text="Math.min(limit, total)"></span> of <span x-text="total"></span></p>
        <div class="mt-2 h-1 overflow-hidden rounded-full bg-surface-2"><div class="h-full bg-ink transition-all" :style="'width:' + (Math.min(limit, total) / total * 100) + '%'"></div></div>
        <button type="button" class="btn btn-outline mt-5 w-full" @click="limit += 12">Load more</button>
      </div>
    </div>
  </div>
  ${mobileSheets(items, { subs })}
</div>
${recentlyViewed()}`,
    }),
  };
}

export function categoryPages() {
  return categories.map((c) =>
    listingPage({
      file: `category-${c.slug}.html`,
      title: `${c.name} — Buy ${c.name} Online in Singapore | itDeal Sg`,
      h1: c.name, sub: c.blurb,
      crumbs: [['Home', 'index.html'], ['Categories', 'categories.html'], [c.name]],
      items: inCat(c.slug),
      subs: [...new Set(inCat(c.slug).map((p) => p.sub))],
    }));
}

export function dealsPage() {
  const items = products.filter((p) => p.mrp > p.price);
  const hero = html`
<div class="relative mt-4 overflow-hidden rounded-3xl bg-ink p-6 text-white sm:p-10" x-data="countdown('2026-11-12T00:00:00+08:00')">
  <div class="absolute inset-0" style="background:radial-gradient(70% 90% at 100% 0%, rgb(200 0 21 / .9), transparent 60%)"></div>
  <img src="${img(IMG.flatlay, 900, 500)}" alt="" class="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-40 sm:block" style="mask-image:linear-gradient(90deg,transparent,#000 60%);-webkit-mask-image:linear-gradient(90deg,transparent,#000 60%)">
  <div class="relative">
    <span class="badge bg-white/10 text-white ring-1 ring-white/20">${icon('zap', 'size-3.5', 2)} 11.11 Mega Sale · Early access</span>
    <p class="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Up to 40% off.<br class="sm:hidden"> Ends in <span class="tnum" x-text="d + 'd ' + h + 'h ' + m + 'm'"></span></p>
    <p class="mt-2 max-w-md text-sm text-white/75 sm:text-[15px]">Stack it with code <b class="text-white">MEGA11</b> for S$111 off orders above S$1,111.</p>
  </div>
</div>`;
  return listingPage({
    file: 'deals.html', nav: 'deals', title: '11.11 Mega Sale — Today’s Deals | itDeal Sg', h1: 'Today’s deals', sub: 'Biggest discounts first',
    crumbs: [['Home', 'index.html'], ['Deals']], items, hero, defaultSort: 'discount',
  });
}

export function newTrendingPage() {
  // new launches first, then this week's bestsellers
  const items = products.filter((p) => p.badge === 'New' || p.sold >= 80);
  return listingPage({
    file: 'new-trending.html', nav: 'home', title: 'New & Trending — Latest Launches and Bestsellers | itDeal Sg',
    h1: 'New & Trending', sub: 'Latest launches and what Singapore is buying this week',
    crumbs: [['Home', 'index.html'], ['New & Trending']], items, defaultSort: 'newest',
  });
}

export function searchPage() {
  return listingPage({
    file: 'search.html', nav: 'home', title: 'Search | itDeal Sg', search: true,
    crumbs: [['Home', 'index.html'], ['Search']], items: products,
  });
}

export function categoriesPage() {
  const top = (slug) => inCat(slug).sort((a, b) => b.sold - a.sold).slice(0, 4);
  return {
    file: 'categories.html',
    html: page({
      title: 'All Categories | itDeal Sg', nav: 'categories',
      body: html`
<div class="wrap pt-4 sm:pt-6" x-data="{ c: 0 }">
  <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">All categories</h1>
  <div class="mt-4 grid grid-cols-[92px_minmax(0,1fr)] gap-3 sm:mt-6 sm:grid-cols-[240px_minmax(0,1fr)] sm:gap-8">
    <ul class="-ml-1 space-y-1 self-start sm:sticky sm:top-[140px]" role="tablist">
      ${categories.map((c, k) => html`
      <li>
        <button type="button" role="tab" :aria-selected="c === ${k}" @click="c = ${k}; window.scrollTo({ top: 0, behavior: 'smooth' })" class="relative flex w-full flex-col items-center gap-1.5 rounded-2xl px-1 py-3 text-center text-[11.5px] font-medium transition sm:flex-row sm:gap-3 sm:px-3 sm:text-left sm:text-sm" :class="c === ${k} ? 'bg-surface text-ink' : 'text-muted hover:text-ink'">
          <span x-show="c === ${k}" class="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-brand"></span>
          <span class="grid size-11 place-items-center rounded-xl sm:size-9" :class="c === ${k} ? 'bg-white' : 'bg-surface'">${icon(c.icon, 'size-5', 1.6)}</span>${c.name}
        </button>
      </li>`)}
    </ul>
    <div class="min-w-0">
      ${categories.map((c, k) => html`
      <section x-show="c === ${k}" ${k ? 'x-cloak' : ''} aria-label="${c.name}">
        <a href="category-${c.slug}.html" class="group relative block overflow-hidden rounded-3xl bg-ink p-5 text-white sm:p-8">
          <img src="${img(c.img, 900, 400)}" alt="" class="absolute inset-0 size-full object-cover opacity-70 transition duration-[1.2s] group-hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-black/10"></div>
          <div class="relative"><p class="text-xl font-bold tracking-tight sm:text-3xl">${c.name}</p><p class="mt-1 text-[13px] text-white/75 sm:text-[15px]">${c.blurb}</p><span class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">Shop all ${icon('arrow-right', 'size-4')}</span></div>
        </a>
        <p class="eyebrow mb-3 mt-6">Shop by type</p>
        <ul class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          ${c.subs.map((s) => html`<li><a href="category-${c.slug}.html" class="flex h-full items-center justify-between gap-2 rounded-2xl border border-line px-3.5 py-3 text-[13px] font-medium transition hover:border-ink">${s}${icon('chevron-right', 'size-4 text-subtle shrink-0')}</a></li>`)}
        </ul>
        <p class="eyebrow mb-3 mt-8">Bestsellers</p>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          ${top(c.slug).map((p) => productCard(p, { cta: false }))}
        </div>
      </section>`)}
    </div>
  </div>
</div>`,
    }),
  };
}
