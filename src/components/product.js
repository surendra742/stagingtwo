// Product UI parts -> template-parts/product/*.php in WordPress
import { html, icon, esc, starFill } from './html.js';
import { img, money, off } from '../data/catalog.js';

export const url = (p) => `product-${p.slug}.html`;

const heart = (id) => html`
<button type="button" class="relative z-10 grid size-8 place-items-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:scale-105 active:scale-95"
  :class="$store.shop.inWish(${id}) ? 'text-brand' : 'text-ink'" :aria-pressed="$store.shop.inWish(${id})" aria-label="Save to wishlist" @click="$store.shop.toggleWish(${id})">
  <svg class="size-4" :class="$store.shop.inWish(${id}) && 'animate-pop'" viewBox="0 0 24 24" :fill="$store.shop.inWish(${id}) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
</button>`;

const compareBtn = (id) => html`
<button type="button" class="relative z-10 grid size-8 place-items-center rounded-full shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:scale-105 lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
  :class="$store.shop.inCompare(${id}) ? 'bg-ink text-white !opacity-100' : 'bg-white/90 text-ink'" :aria-pressed="$store.shop.inCompare(${id})" aria-label="Add to compare" @click="$store.shop.toggleCompare(${id})">
  ${icon('compare', 'size-3.5', 2)}
</button>`;

/* Offer tag on the image corner — the most useful thing to know about this product */
export const tagFor = (p) => {
  if (p.stock <= 5) return ['flame', `Only ${p.stock} left`, 'text-[#ff7a86]'];
  if (p.badge === 'New') return ['sparkles', 'New launch', 'text-[#ffd76a]'];
  if (p.badge === 'Bestseller') return ['verified', 'Bestseller', 'text-[#ffd76a]'];
  if (p.price >= 1111) return ['ticket', 'Extra S$111 off', 'text-[#7ee2a8]'];
  if (off(p) >= 15) return ['zap', 'Price drop', 'text-[#ffd76a]'];
  return ['truck', 'Free delivery', 'text-[#7ee2a8]'];
};

/* Overlapping colour dots + "+n", like the reference */
export const swatches = (p, max = 2) =>
  p.colors.length > 1
    ? html`<span class="flex shrink-0 items-center" aria-label="${p.colors.length} colours"><span class="flex -space-x-1.5">${p.colors.slice(0, max).map((c) => html`<i class="size-4 rounded-full ring-2 ring-white" style="background:${c.hex};box-shadow:inset 0 0 0 1px rgb(0 0 0/.12)" title="${c.name}"></i>`)}</span>${p.colors.length > max ? html`<span class="ml-1 text-[12px] font-medium text-ink-2">+${p.colors.length - max}</span>` : ''}</span>`
    : '';

/**
 * Compact product card (no add-to-cart — the whole card opens the product)
 *   tag strip on the image · red feature strip with rating · name · price + colours · MRP + % off
 * opts.compare  show the compare toggle (listing pages)
 * opts.eager    load image eagerly (above the fold)
 */
export function productCard(p, opts = {}) {
  const { compare = false, eager = false } = opts;
  const pct = off(p);
  const [tIcon, tText, tTone] = tagFor(p);
  return html`
<article class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-card">
  <div class="relative aspect-square overflow-hidden bg-surface">
    <img src="${img(p.img, 400)}" srcset="${img(p.img, 400)} 1x, ${img(p.img, 800, 800, 60)} 2x" alt="${esc(p.title)}" width="400" height="400" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" class="size-full object-cover transition duration-700 ease-out-quint group-hover:scale-[1.04]">
    <span class="pointer-events-none absolute left-0 top-0 flex items-center gap-1 rounded-br-xl bg-ink/90 py-1 pl-2 pr-2.5 text-[10.5px] font-semibold text-white backdrop-blur sm:text-[11px]">${icon(tIcon, `size-3 ${tTone}`, 2.4)}${tText}</span>
    <div class="absolute right-2 top-2 flex flex-col gap-1.5">${heart(p.id)}${compare && compareBtn(p.id)}</div>
  </div>
  <div class="card-strip flex h-8 items-center justify-between gap-1.5 px-2 sm:gap-2 sm:px-3">
    <span class="truncate text-[11px] font-semibold sm:text-[12px]">${p.feat}</span>
    <span class="flex shrink-0 items-center gap-0.5 rounded-md bg-white px-1 py-0.5 text-[10.5px] font-bold text-ink sm:px-1.5 sm:text-[11px]">${starFill('size-3 text-star')}${p.rating}</span>
  </div>
  <div class="flex flex-1 flex-col px-2.5 pb-3 pt-2.5 sm:px-3.5 sm:pt-3">
    <h3 class="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink sm:line-clamp-1 sm:text-[15px]">
      <a href="${url(p)}" class="after:absolute after:inset-0">${p.title}</a>
    </h3>
    <div class="mt-auto">
      <div class="mt-2.5 border-t border-dashed border-line-2 pt-2.5">
        <div class="flex items-center justify-between gap-2">
          <span class="price text-[16px] sm:text-[18px]">${money(p.price)}</span>${swatches(p)}
        </div>
        <p class="mt-0.5 flex items-baseline gap-1.5 text-[12px]">${pct ? html`<span class="mrp">${money(p.mrp)}</span><span class="font-semibold text-success">${pct}% off</span>` : html`<span class="text-muted">Incl. GST</span>`}</p>
      </div>
    </div>
  </div>
</article>`;
}

/* Client-rendered twin of productCard (Recently viewed reads ids from localStorage).
   Expects an Alpine variable `p` from window.ITDEAL.products; keep in sync with productCard. */
export const cardTpl = () => html`
<article class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-card">
  <div class="relative aspect-square overflow-hidden bg-surface">
    <img :src="$store.shop.img(p.img, 400)" :alt="p.title" loading="lazy" width="400" height="400" class="size-full object-cover transition duration-700 ease-out-quint group-hover:scale-[1.04]">
    <span class="pointer-events-none absolute left-0 top-0 flex items-center gap-1 rounded-br-xl bg-ink/90 py-1 pl-2 pr-2.5 text-[10.5px] font-semibold text-white backdrop-blur sm:text-[11px]"><span class="contents" x-html="p.tag[0]"></span><span x-text="p.tag[1]"></span></span>
    <div class="absolute right-2 top-2">
      <button type="button" class="relative z-10 grid size-8 place-items-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:scale-105" :class="$store.shop.inWish(p.id) ? 'text-brand' : 'text-ink'" aria-label="Save to wishlist" @click="$store.shop.toggleWish(p.id)">
        <svg class="size-4" viewBox="0 0 24 24" :fill="$store.shop.inWish(p.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      </button>
    </div>
  </div>
  <div class="card-strip flex h-8 items-center justify-between gap-1.5 px-2 sm:gap-2 sm:px-3">
    <span class="truncate text-[11px] font-semibold sm:text-[12px]" x-text="p.feat"></span>
    <span class="flex shrink-0 items-center gap-0.5 rounded-md bg-white px-1 py-0.5 text-[10.5px] font-bold text-ink sm:px-1.5 sm:text-[11px]">${starFill('size-3 text-star')}<span x-text="p.rating"></span></span>
  </div>
  <div class="flex flex-1 flex-col px-2.5 pb-3 pt-2.5 sm:px-3.5 sm:pt-3">
    <h3 class="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink sm:line-clamp-1 sm:text-[15px]"><a :href="'product-' + p.slug + '.html'" class="after:absolute after:inset-0" x-text="p.title"></a></h3>
    <div class="mt-auto">
      <div class="mt-2.5 border-t border-dashed border-line-2 pt-2.5">
        <div class="flex items-center justify-between gap-2">
          <span class="price text-[16px] sm:text-[18px]" x-text="$store.shop.money(p.price)"></span>
          <span class="flex shrink-0 items-center" x-show="p.colors.length > 1"><span class="flex -space-x-1.5"><template x-for="c in p.colors.slice(0, 2)" :key="c"><i class="size-4 rounded-full ring-2 ring-white" :style="'background:' + c + ';box-shadow:inset 0 0 0 1px rgb(0 0 0/.12)'"></i></template></span><span x-show="p.colors.length > 2" class="ml-1 text-[12px] font-medium text-ink-2" x-text="'+' + (p.colors.length - 2)"></span></span>
        </div>
        <p class="mt-0.5 flex items-baseline gap-1.5 text-[12px]">
          <span x-show="p.mrp > p.price" class="mrp" x-text="$store.shop.money(p.mrp)"></span>
          <span x-show="p.mrp > p.price" class="font-semibold text-success" x-text="Math.round((1 - p.price / p.mrp) * 100) + '% off'"></span>
          <span x-show="p.mrp <= p.price" class="text-muted">Incl. GST</span>
        </p>
      </div>
    </div>
  </div>
</article>`;
