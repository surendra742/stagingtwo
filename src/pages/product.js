// Product detail -> single-product.php
import { html, icon, esc, stars, starFill } from '../components/html.js';
import { page } from '../components/layout.js';
import { productCard, url } from '../components/product.js';
import { breadcrumb, sectionHead, rail, recentlyViewed } from '../components/sections.js';
import { trustIcon } from '../components/trust-icons.js';
import { products, byId, catOf, img, money, off, reviewsFor, ratingBreakdown } from '../data/catalog.js';

const BUNDLES = { laptops: [41, 44], phones: [22, 44], tablets: [22, 41], audio: [44, 25], wearables: [22, 44], gaming: [33, 36], cameras: [44, 1], accessories: [1, 42], 'tv-monitors': [33, 41] };
const IN_BOX = {
  laptops: ['Laptop', 'USB-C power adapter', 'USB-C charge cable', 'Quick start guide & warranty card'],
  phones: ['Phone', 'USB-C cable', 'SIM ejector tool', 'Documentation'],
  tablets: ['Tablet', 'USB-C charge cable', 'Documentation'],
  audio: ['Headphones / earbuds', 'Carrying case', 'USB-C cable', 'Quick start guide'],
  wearables: ['Watch', 'Band', 'Magnetic fast charger', 'Documentation'],
  gaming: ['Device', 'Charging cable', 'Quick start guide'],
  cameras: ['Camera body', 'Rechargeable battery', 'USB-C cable', 'Shoulder strap', 'Body cap'],
  accessories: ['Device', 'USB-C cable', 'Documentation'],
  'tv-monitors': ['Display', 'Stand', 'Power cable', 'Remote / cable', 'Documentation'],
};

function gallery(p, shots) {
  return html`
<div class="lg:sticky lg:top-[140px] lg:self-start">
  <!-- mobile: swipe -->
  <div class="relative -mx-4 sm:-mx-6 lg:hidden">
    <div x-ref="gallery" class="no-scrollbar flex snap-x snap-mandatory overflow-x-auto" style="overscroll-behavior-x:contain">
      ${shots.map((id, i) => html`<img src="${img(id, 780)}" alt="${esc(p.name)} — image ${i + 1}" class="aspect-square w-full shrink-0 snap-center bg-surface object-cover" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`)}
    </div>
    <span class="tnum absolute bottom-4 left-4 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur" x-text="(slide + 1) + ' / ${shots.length}'">1 / ${shots.length}</span>
    <div class="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">${shots.map((_, i) => html`<i class="h-1.5 rounded-full transition-all" :class="slide === ${i} ? 'w-5 bg-white' : 'w-1.5 bg-white/55'"></i>`)}</div>
  </div>
  <!-- desktop: thumbs + zoom -->
  <div class="hidden gap-4 lg:grid lg:grid-cols-[72px_minmax(0,1fr)]">
    <div class="space-y-2.5">
      ${shots.map((id, i) => html`<button type="button" class="block size-[72px] overflow-hidden rounded-xl bg-surface ring-offset-2 transition" :class="slide === ${i} ? 'ring-2 ring-ink' : 'ring-1 ring-line hover:ring-line-2'" @click="slide = ${i}" @mouseenter="slide = ${i}" aria-label="Show image ${i + 1}"><img src="${img(id, 144)}" alt="" class="size-full object-cover"></button>`)}
    </div>
    <div class="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-surface" @mouseenter="zoom = true" @mouseleave="zoom = false" @mousemove="move($event)">
      ${shots.map((id, i) => html`<img x-show="slide === ${i}" ${i ? 'x-cloak' : ''} src="${img(id, 1000)}" alt="${esc(p.name)}" class="absolute inset-0 size-full object-cover transition-transform duration-200" :style="zoom ? 'transform:scale(1.9);transform-origin:' + zx + '% ' + zy + '%' : ''">`)}
      <span class="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-ink-2 shadow-sm backdrop-blur" x-show="!zoom">${icon('search', 'size-3.5')} Hover to zoom</span>
    </div>
  </div>
</div>`;
}

function buyBox(p, c) {
  const multiV = p.variants.length > 1;
  return html`
<div class="pt-5 lg:pt-0">
  <a href="search.html?q=${encodeURIComponent(p.brand.toLowerCase())}" class="eyebrow transition hover:text-ink">${p.brand}</a>
  <h1 class="mt-1.5 text-[22px] font-bold leading-tight tracking-tight sm:text-3xl">${p.name}</h1>
  <div class="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
    <a href="#reviews" class="flex items-center gap-1.5">${stars(p.rating, 'size-4')}<b>${p.rating}</b><span class="text-muted underline underline-offset-2">${p.reviews.toLocaleString('en-SG')} ratings</span></a>
    <span class="text-line-2">|</span>
    <span class="flex items-center gap-1 text-muted">${icon('flame', 'size-3.5 text-brand', 2)} ${Math.round(p.reviews / 6)}+ bought in the past month</span>
  </div>

  <div class="mt-5 rounded-2xl bg-surface p-4">
    <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span class="price text-[30px] leading-none sm:text-[34px]" x-text="$store.shop.money(price)">${money(p.price)}</span>
      <span class="mrp text-[15px]" x-show="save > 0" x-text="$store.shop.money(mrpNow)">${money(p.mrp)}</span>
      <span class="badge badge-success !text-[12px]" x-show="save > 0" x-text="pct + '% off'">${off(p)}% off</span>
    </div>
    <p class="mt-1.5 text-xs text-muted">Inclusive of 9% GST <span x-show="save > 0">· <b class="font-semibold text-success">You save <span x-text="$store.shop.money(save)"></span></b></span></p>
    <div class="mt-3.5 space-y-2 border-t border-line pt-3.5">
      ${[['MEGA11', 'S$111 off orders above S$1,111'], ['ITDEAL10', '10% off for new members (max S$50)']].map(([code, t]) => html`
      <div class="flex items-center gap-2.5 text-[13px]">${icon('ticket', 'size-4 text-brand shrink-0')}<span class="flex-1 text-ink-2">${t}</span><button type="button" class="rounded-md border border-dashed border-brand/50 px-2 py-0.5 font-mono text-[11px] font-bold text-brand" @click="navigator.clipboard?.writeText('${code}'); $store.ui.toast('Code ${code} copied', 'ticket')">${code}</button></div>`)}
    </div>
  </div>

  ${p.colors.length > 1 || p.colors.length === 1 ? html`
  <div class="mt-6">
    <p class="text-sm"><span class="text-muted">Colour:</span> <b x-text="colors[c]">${p.colors[0].name}</b></p>
    <div class="mt-2.5 flex flex-wrap gap-2.5">
      ${p.colors.map((col, i) => html`<button type="button" class="size-10 rounded-full ring-offset-2 transition" style="background:${col.hex}" :class="c === ${i} ? 'ring-2 ring-ink' : 'ring-1 ring-black/10 hover:ring-line-2'" :aria-pressed="c === ${i}" aria-label="${col.name}" title="${col.name}" @click="c = ${i}"></button>`)}
    </div>
  </div>` : ''}

  ${multiV ? html`
  <div class="mt-6">
    <p class="text-sm"><span class="text-muted">Configuration:</span> <b x-text="variants[v][0]">${p.variants[0][0]}</b></p>
    <div class="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
      ${p.variants.map(([label, d], i) => html`
      <button type="button" class="rounded-xl border px-3 py-2.5 text-left transition" :class="v === ${i} ? 'border-ink bg-ink/[0.03] ring-1 ring-ink' : 'border-line-2 hover:border-ink-2'" :aria-pressed="v === ${i}" @click="v = ${i}">
        <span class="block text-[13px] font-semibold">${label}</span>
        <span class="tnum mt-0.5 block text-xs text-muted">${money(p.price + d)}</span>
      </button>`)}
    </div>
  </div>` : ''}

  <div class="mt-6 flex items-center gap-4">
    <div class="flex h-12 items-center rounded-full border border-line-2">
      <button type="button" class="grid size-12 place-items-center" aria-label="Decrease quantity" @click="qty = Math.max(1, qty - 1)">${icon('minus', 'size-4', 2)}</button>
      <span class="tnum w-8 text-center font-semibold" x-text="qty">1</span>
      <button type="button" class="grid size-12 place-items-center" aria-label="Increase quantity" @click="qty = Math.min(10, qty + 1)">${icon('plus', 'size-4', 2)}</button>
    </div>
    ${p.stock <= 5
      ? html`<p class="flex items-center gap-1.5 text-[13px] font-semibold text-brand"><span class="size-2 animate-pulse rounded-full bg-brand"></span>Only ${p.stock} left — order soon</p>`
      : html`<p class="flex items-center gap-1.5 text-[13px] font-semibold text-success"><span class="size-2 rounded-full bg-success"></span>In stock, ready to ship</p>`}
  </div>

  <div x-ref="cta" class="mt-5 hidden grid-cols-2 gap-3 lg:grid">
    <button type="button" class="btn btn-dark btn-lg" @click="add()">${icon('bag', 'size-5')} Add to cart</button>
    <button type="button" class="btn btn-primary btn-lg" @click="buy()">Buy now</button>
  </div>
  <div class="mt-3 flex flex-wrap gap-2">
    <button type="button" class="btn btn-ghost btn-sm -ml-2" @click="$store.shop.toggleWish(id)">
      <svg class="size-[18px]" :class="$store.shop.inWish(id) && 'text-brand'" viewBox="0 0 24 24" :fill="$store.shop.inWish(id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      <span x-text="$store.shop.inWish(id) ? 'Saved' : 'Wishlist'">Wishlist</span>
    </button>
    <button type="button" class="btn btn-ghost btn-sm" :class="$store.shop.inCompare(id) && 'bg-surface'" @click="$store.shop.toggleCompare(id)">${icon('compare', 'size-[18px]')} <span x-text="$store.shop.inCompare(id) ? 'In compare' : 'Compare'">Compare</span></button>
    <button type="button" class="btn btn-ghost btn-sm" @click="share()">${icon('share', 'size-[18px]')} Share</button>
  </div>

  <div class="mt-5 rounded-2xl border border-line">
    <form class="p-4" @submit.prevent="check()">
      <label for="postal" class="flex items-center gap-2 text-sm font-semibold">${icon('truck', 'size-[18px]')} Delivery</label>
      <div class="mt-2.5 flex gap-2">
        <input id="postal" x-model="postal" inputmode="numeric" maxlength="6" placeholder="Enter postal code, e.g. 238839" class="input h-11 flex-1 text-sm">
        <button class="btn btn-outline h-11">Check</button>
      </div>
      <p x-show="postalErr" x-text="postalErr" class="mt-1.5 text-xs text-brand"></p>
      <div x-show="eta" x-cloak class="mt-3 space-y-1.5 text-[13px]">
        <p class="flex items-center gap-2 text-ink">${icon('check', 'size-4 text-success', 2.5)} Free delivery by <b x-text="eta"></b></p>
        <p class="flex items-center gap-2 text-ink">${icon('zap', 'size-4 text-warn', 2)} Same-day delivery available — order before 2pm (S$14.90)</p>
      </div>
    </form>
    <div class="grid grid-cols-3 divide-x divide-line border-t border-line text-center">
      ${[['warranty', '1-year local warranty'], ['returns', '7-day free returns'], ['genuine', '100% genuine']].map(([ic, t]) => html`<div class="flex flex-col items-center gap-1.5 px-2 py-3.5">${trustIcon(ic, 'size-10')}<span class="text-[11.5px] font-medium leading-tight text-ink-2">${t}</span></div>`)}
    </div>
  </div>

  <div class="mt-6">
    <p class="text-sm font-semibold">Highlights</p>
    <ul class="mt-3 space-y-2.5">${p.highlights.map((h) => html`<li class="flex gap-2.5 text-[14px] leading-snug text-ink-2"><span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"></span>${h}</li>`)}</ul>
  </div>
</div>`;
}

function bundle(p) {
  const items = [p, ...(BUNDLES[p.cat] || []).filter((id) => id !== p.id).map((id) => byId[id])].slice(0, 3);
  const cfg = esc(JSON.stringify(items.map((x) => ({ id: x.id, price: x.price, mrp: x.mrp }))));
  return html`
<section class="wrap section" x-data="{ items: ${cfg}, on: [${items.map((x) => x.id).join(',')}], get total() { return this.items.filter(i => this.on.includes(i.id)).reduce((a, i) => a + i.price, 0) }, get was() { return this.items.filter(i => this.on.includes(i.id)).reduce((a, i) => a + i.mrp, 0) } }">
  ${sectionHead({ title: 'Frequently bought together' })}
  <div class="grid grid-cols-[minmax(0,1fr)] gap-6 rounded-3xl border border-line p-4 sm:p-6 lg:grid-cols-[1fr_300px] lg:items-center">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      ${items.map((x, i) => html`
      ${i ? html`<span class="grid place-items-center text-muted sm:px-1">${icon('plus', 'size-5', 2)}</span>` : ''}
      <label class="flex flex-1 items-center gap-3 rounded-2xl bg-surface p-3 transition sm:flex-col sm:items-start" :class="!on.includes(${x.id}) && 'opacity-50'">
        <img src="${img(x.img, 200)}" alt="" class="size-16 shrink-0 rounded-xl object-cover sm:aspect-square sm:size-auto sm:w-full" loading="lazy">
        <span class="min-w-0 flex-1">
          <span class="line-clamp-2 text-[13px] font-medium leading-snug">${i ? '' : '<b>This item:</b> '}${x.title}</span>
          <span class="price mt-1 block text-sm">${money(x.price)}</span>
        </span>
        <input type="checkbox" class="check sm:absolute sm:hidden" value="${x.id}" x-model.number="on" ${i ? '' : 'disabled'} aria-label="Include ${esc(x.name)}">
      </label>`)}
    </div>
    <div class="rounded-2xl bg-surface p-5">
      <p class="text-sm text-muted">Total for <span x-text="on.length"></span> items</p>
      <p class="mt-1 flex items-baseline gap-2"><span class="price text-2xl" x-text="$store.shop.money(total)"></span><span class="mrp text-sm" x-show="was > total" x-text="$store.shop.money(was)"></span></p>
      <button type="button" class="btn btn-dark mt-4 w-full" @click="on.forEach((id, k) => $store.shop.add(id, { silent: k < on.length - 1 }))"><span>Add <span x-text="on.length"></span> to cart</span></button>
      <div class="mt-3 hidden flex-wrap gap-3 sm:flex">
        ${items.slice(1).map((x) => html`<label class="flex items-center gap-2 text-xs text-ink-2"><input type="checkbox" class="check size-4" value="${x.id}" x-model.number="on"> Include ${x.brand}</label>`)}
      </div>
    </div>
  </div>
</section>`;
}

function details(p) {
  const rows = p.specs.flatMap(([, r]) => r).length;
  return html`
<section id="specs" class="wrap section">
  <div class="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
    <div x-data="{ all: ${String(rows <= 8)} }">
      ${sectionHead({ title: 'Specifications' })}
      <div class="relative overflow-hidden" :class="!all && 'max-h-[440px]'">
        ${p.specs.map(([g, r]) => html`
        <div class="mb-6">
          <p class="mb-2 text-[13px] font-semibold text-muted">${g}</p>
          <dl class="overflow-hidden rounded-2xl border border-line">
            ${r.map(([k, v], i) => html`<div class="grid grid-cols-[40%_1fr] gap-4 px-4 py-3 text-[14px] ${i % 2 ? '' : 'bg-surface/70'}"><dt class="text-muted">${k}</dt><dd class="font-medium text-ink">${v}</dd></div>`)}
          </dl>
        </div>`)}
        <div x-show="!all" class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      <button type="button" x-show="!all" class="btn btn-outline mt-2" @click="all = true">Show all specifications ${icon('chevron-down', 'size-4')}</button>
    </div>
    <div>
      <h2 class="section-title mb-5 sm:mb-6">What’s in the box</h2>
      <ul class="space-y-2.5 rounded-2xl bg-surface p-5">
        ${(IN_BOX[p.cat] || []).map((t) => html`<li class="flex items-center gap-3 text-[14px]">${icon('package', 'size-[18px] text-muted', 1.6)} ${t}</li>`)}
      </ul>
      <div class="mt-6 rounded-2xl border border-line p-5">
        <p class="flex items-center gap-2 font-semibold">${icon('shield', 'size-5')} itDeal Protect</p>
        <p class="mt-1.5 text-[13px] leading-relaxed text-muted">Every ${p.brand} product comes with the official 1-year Singapore warranty. Need a repair? We arrange free pick-up from your door.</p>
      </div>
    </div>
  </div>
</section>`;
}

function reviewsSection(p) {
  const list = reviewsFor(p);
  const dist = ratingBreakdown(p);
  const photos = list.flatMap((r) => r.photos);
  return html`
<section id="reviews" class="wrap section" x-data="reviews">
  ${sectionHead({ title: 'Ratings & reviews', extra: `<a href="#" class="btn btn-outline btn-sm" @click.prevent="$store.ui.toast('Thanks! Review form opens after sign in', 'info')">Write a review</a>` })}
  <div class="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
    <div class="lg:sticky lg:top-[140px] lg:self-start">
      <div class="flex items-center gap-4">
        <p class="text-5xl font-extrabold tracking-tight">${p.rating}</p>
        <div>${stars(p.rating, 'size-5')}<p class="mt-1 text-[13px] text-muted">${p.reviews.toLocaleString('en-SG')} verified ratings</p></div>
      </div>
      <ul class="mt-5 space-y-2">
        ${dist.map((pct, i) => html`<li class="flex items-center gap-3 text-[13px]"><span class="w-6 text-muted">${5 - i}★</span><span class="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"><span class="block h-full rounded-full bg-ink" style="width:${pct}%"></span></span><span class="tnum w-9 text-right text-muted">${pct}%</span></li>`)}
      </ul>
      ${photos.length ? html`
      <p class="mb-3 mt-7 text-sm font-semibold">Customer photos <span class="font-normal text-muted">(${photos.length})</span></p>
      <div class="grid grid-cols-4 gap-2">
        ${photos.slice(0, 8).map((id) => html`<button type="button" class="aspect-square overflow-hidden rounded-xl bg-surface" @click="lightbox = '${img(id, 1000)}'"><img src="${img(id, 160)}" alt="Customer photo" loading="lazy" class="size-full object-cover transition hover:scale-105"></button>`)}
      </div>` : ''}
    </div>
    <div>
      <div class="snap-rail mb-2 gap-2">
        ${[['all', 'All reviews'], ['photos', `With photos (${list.filter((r) => r.photos.length).length})`], ['5', '5 stars'], ['4', '4 stars']].map(([k, l]) => html`<button type="button" class="chip" :aria-pressed="filter === '${k}'" @click="filter = '${k}'">${k === 'photos' ? icon('image', 'size-3.5') : ''}${l}</button>`)}
      </div>
      <ul class="divide-y divide-line">
        ${list.map((r) => html`
        <li class="py-6" x-show="filter === 'all' || (filter === 'photos' && ${String(r.photos.length > 0)}) || filter === '${r.rating}'">
          <div class="flex items-center gap-3">
            <span class="grid size-10 place-items-center rounded-full bg-surface text-sm font-bold">${r.name[0]}</span>
            <div class="flex-1 leading-tight">
              <p class="text-sm font-semibold">${r.name}</p>
              <p class="mt-0.5 flex items-center gap-1 text-xs text-success">${icon('verified', 'size-3.5', 2)} Verified buyer <span class="text-subtle">· ${r.area}</span></p>
            </div>
            <span class="text-xs text-subtle">${r.date}</span>
          </div>
          <div class="mt-3 flex items-center gap-2">${stars(r.rating, 'size-3.5')}<p class="text-[15px] font-semibold">${r.title}</p></div>
          <p class="mt-2 text-[14.5px] leading-relaxed text-ink-2">${r.body}</p>
          ${r.photos.length ? html`<div class="mt-3 flex gap-2">${r.photos.map((id) => html`<button type="button" class="size-20 overflow-hidden rounded-xl bg-surface" @click="lightbox = '${img(id, 1000)}'"><img src="${img(id, 160)}" alt="Photo from ${r.name}" loading="lazy" class="size-full object-cover"></button>`)}</div>` : ''}
          <div class="mt-3 flex items-center gap-4 text-xs text-muted">
            <span>${p.variants.length > 1 ? 'Variant: ' + r.variant : 'Purchased on itDeal'}</span>
            <button type="button" class="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 transition hover:border-ink hover:text-ink" x-data="{ n: ${r.helpful}, on: false }" @click="on = !on; n += on ? 1 : -1" :class="on && '!border-ink text-ink'">${icon('thumbs', 'size-3.5')}<span>Helpful (<span x-text="n">${r.helpful}</span>)</span></button>
          </div>
        </li>`)}
      </ul>
      <a href="#" class="btn btn-outline mt-2" @click.prevent="$store.ui.toast('Showing all ${p.reviews.toLocaleString('en-SG')} reviews soon', 'info')">See all ${p.reviews.toLocaleString('en-SG')} reviews</a>
    </div>
  </div>
  <div x-cloak x-show="lightbox" x-transition.opacity class="fixed inset-0 z-[90] grid place-items-center bg-ink/90 p-4" @click="lightbox = null" @keydown.escape.window="lightbox = null">
    <img :src="lightbox" alt="Customer photo" class="max-h-[85vh] max-w-full rounded-2xl object-contain">
    <button type="button" class="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Close">${icon('x', 'size-6')}</button>
  </div>
</section>`;
}

function stickyBars(p) {
  return html`
<!-- desktop: slim bar once the main CTA scrolls away -->
<div x-cloak x-show="sticky" x-transition.opacity class="fixed inset-x-0 top-0 z-50 hidden border-b border-line bg-white/95 backdrop-blur lg:block">
  <div class="wrap flex h-[72px] items-center gap-4">
    <img src="${img(p.img, 96)}" alt="" class="size-12 rounded-xl bg-surface object-cover">
    <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold">${p.title}</p><p class="truncate text-xs text-muted" x-text="[variants.length > 1 ? variants[v][0] : '', colors[c]].filter(Boolean).join(' · ')"></p></div>
    <span class="price text-xl" x-text="$store.shop.money(price)"></span>
    <button type="button" class="btn btn-dark" @click="add()">Add to cart</button>
    <button type="button" class="btn btn-primary" @click="buy()">Buy now</button>
  </div>
</div>
<!-- mobile: always-on buy bar -->
<div class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-safe shadow-bar backdrop-blur lg:hidden">
  <div class="flex items-center gap-2.5 px-4 py-3">
    <div class="mr-1 min-w-0">
      <p class="price text-lg leading-none" x-text="$store.shop.money(price)">${money(p.price)}</p>
      <p class="mt-1 text-[11px] font-semibold text-brand" x-show="save > 0" x-text="'Save ' + $store.shop.money(save)"></p>
    </div>
    <button type="button" class="btn btn-outline h-12 flex-1 px-3" @click="add()">Add to cart</button>
    <button type="button" class="btn btn-primary h-12 flex-1 px-3" @click="buy()">Buy now</button>
  </div>
</div>`;
}

export function productPages() {
  return products.map((p) => {
    const c = catOf(p.cat);
    const shots = [p.img, ...p.gallery];
    const cfg = esc(JSON.stringify({ id: p.id, base: p.price, mrp: p.mrp, variants: p.variants, colors: p.colors.map((x) => x.name) }));
    const similar = products.filter((x) => x.cat === p.cat && x.id !== p.id).concat(products.filter((x) => x.cat !== p.cat && x.badge === 'Bestseller')).slice(0, 10);
    return {
      file: `product-${p.slug}.html`,
      html: page({
        title: `${p.brand} ${p.name} — ${money(p.price)} | itDeal Sg`,
        desc: `Buy ${p.brand} ${p.name} in Singapore at ${money(p.price)}. ${p.highlights[0]}. Free delivery, 1-year local warranty.`,
        nav: null, bodyClass: '!pb-[84px] lg:!pb-0',
        body: html`
<div x-data="pdp(${cfg})">
  <div class="wrap pt-3 sm:pt-5">
    ${breadcrumb([['Home', 'index.html'], [c.name, `category-${c.slug}.html`], [p.sub, `category-${c.slug}.html`], [p.name]])}
    <div class="mt-3 grid grid-cols-[minmax(0,1fr)] gap-x-12 lg:mt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      ${gallery(p, shots)}
      ${buyBox(p)}
    </div>
  </div>
  <nav class="wrap mt-10 lg:mt-14" aria-label="Product sections">
    <div class="snap-rail gap-2 border-b border-line pb-3">
      ${[['Frequently bought together', '#fbt'], ['Specifications', '#specs'], ['Reviews', '#reviews'], ['Similar products', '#similar']].map(([l, h]) => html`<a href="${h}" class="chip">${l}</a>`)}
    </div>
  </nav>
  <div id="fbt">${bundle(p)}</div>
  ${details(p)}
  ${reviewsSection(p)}
  <section id="similar" class="wrap section">
    ${sectionHead({ title: 'You may also like', href: `category-${c.slug}.html`, cta: `More ${c.name}` })}
    ${rail(similar.map((x) => productCard(x)))}
  </section>
  ${recentlyViewed(p.id)}
  ${stickyBars(p)}
</div>`,
      }),
    };
  });
}
