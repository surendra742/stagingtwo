// Reusable page sections -> template-parts/sections/*.php
import { html, icon } from './html.js';
import { cardTpl } from './product.js';
import { trustIcon } from './trust-icons.js';

/* "Exclusive Offers" style heading: light word + bold word with a red underline */
export const twoTone = (light, bold) =>
  `<span class="font-normal">${light}</span> <span class="relative inline-block font-bold">${bold}<span class="absolute -bottom-1 right-0 h-[3px] w-3/5 rounded-full bg-brand"></span></span>`;

export const sectionHead = ({ title, sub = '', href = '', cta = 'View All', extra = '' }) => html`
<div class="mb-3 flex items-end justify-between gap-4 sm:mb-4">
  <div class="min-w-0">
    <h2 class="section-title">${title}</h2>
    ${sub && html`<p class="mt-1.5 text-sm text-muted sm:text-[15px]">${sub}</p>`}
  </div>
  <div class="flex shrink-0 items-center gap-3">
    ${extra}
    ${href && html`<a href="${href}" class="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">${cta}<span class="grid size-6 place-items-center rounded-full border-[1.5px] border-ink transition group-hover:bg-ink group-hover:text-white">${icon('arrow-right', 'size-3.5', 2.2)}</span></a>`}
  </div>
</div>`;

/* Horizontal scroller with desktop arrows. `items` are pre-rendered cells,
   or [attrs, html] pairs when a cell needs its own attributes (e.g. x-show). */
export const rail = (items, cell = 'w-[44%] sm:w-[31%] md:w-[23.5%] lg:w-[calc((100%-4*1rem)/5)] wide:w-[calc((100%-5*1rem)/6)]', gap = 'gap-3 lg:gap-4') => html`
<div class="relative" x-data="rail">
  <div x-ref="track" class="snap-rail ${gap}">
    ${items.map((it) => (Array.isArray(it) ? html`<div class="${cell} shrink-0 snap-start" ${it[0]}>${it[1]}</div>` : html`<div class="${cell} shrink-0 snap-start">${it}</div>`))}
  </div>
  <button type="button" x-show="!start" x-transition.opacity class="absolute -left-5 top-1/2 z-10 -translate-y-1/2 hidden size-11 place-items-center rounded-full bg-white shadow-pop ring-1 ring-line lg:grid" aria-label="Scroll left" @click="by(-1)">${icon('chevron-left', 'size-5', 2)}</button>
  <button type="button" x-show="!end" x-transition.opacity class="absolute -right-5 top-1/2 z-10 -translate-y-1/2 hidden size-11 place-items-center rounded-full bg-white shadow-pop ring-1 ring-line lg:grid" aria-label="Scroll right" @click="by(1)">${icon('chevron-right', 'size-5', 2)}</button>
</div>`;

export const breadcrumb = (items) => html`
<nav aria-label="Breadcrumb" class="no-scrollbar overflow-x-auto">
  <ol class="flex items-center gap-1.5 whitespace-nowrap text-[12.5px] text-muted">
    ${items.map(([label, href], i) => html`
    <li class="flex items-center gap-1.5">
      ${i ? icon('chevron-right', 'size-3.5 text-subtle') : ''}
      ${href ? html`<a href="${href}" class="transition hover:text-ink">${label}</a>` : html`<span class="font-medium text-ink" aria-current="page">${label}</span>`}
    </li>`)}
  </ol>
</nav>`;

export const trustStrip = () => {
  const items = [
    ['delivery', 'Free delivery', 'On orders over S$49'],
    ['warranty', 'Genuine local sets', '1-year SG warranty'],
    ['returns', '7-day returns', 'Free doorstep pick-up'],
    ['secure', 'Secure payments', 'PayNow, cards & wallets'],
  ];
  return html`
<ul class="grid grid-cols-4 gap-2 rounded-3xl bg-surface px-2 py-4 sm:gap-4 sm:px-6 lg:gap-6 lg:px-10 lg:py-6">
  ${items.map(([ic, t, s]) => html`
  <li class="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-left lg:justify-center">
    ${trustIcon(ic, 'size-10 shrink-0 sm:size-12')}
    <span class="min-w-0"><span class="block text-[11.5px] font-semibold leading-tight sm:text-[15px]">${t}</span><span class="mt-0.5 hidden text-[13px] leading-snug text-muted sm:block">${s}</span></span>
  </li>`)}
</ul>`;
};

export const recentlyViewed = (exclude = 0) => html`
<section class="wrap section" x-data="{ get items() { return $store.shop.recent.filter(id => id !== ${exclude}).map(id => $store.shop.p(id)).filter(Boolean).slice(0, 7) } }" x-show="items.length" x-cloak>
  ${sectionHead({ title: twoTone('Recently', 'Viewed'), extra: `<button type="button" class="text-sm font-medium text-muted hover:text-ink" @click="$store.shop.clearRecent()">Clear</button>` })}
  <div class="snap-rail gap-3 lg:grid lg:grid-cols-6 lg:gap-4 wide:grid-cols-7">
    <template x-for="(p, i) in items" :key="p.id"><div class="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-[23.5%] lg:w-auto" :class="i === 6 && 'lg:hidden wide:block'">${cardTpl()}</div></template>
  </div>
</section>`;

export const emptyState = ({ ic, title, text, cta, href }) => html`
<div class="mx-auto max-w-sm py-16 text-center">
  <span class="mx-auto grid size-20 place-items-center rounded-full bg-surface">${icon(ic, 'size-8 text-muted', 1.5)}</span>
  <h2 class="mt-5 text-xl font-bold tracking-tight">${title}</h2>
  <p class="mt-2 text-[15px] text-muted">${text}</p>
  <a href="${href}" class="btn btn-dark mt-6">${cta}</a>
</div>`;
