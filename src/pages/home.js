import { html, icon } from '../components/html.js';
import { page } from '../components/layout.js';
import { productCard, url } from '../components/product.js';
import { sectionHead, twoTone, rail, trustStrip, recentlyViewed } from '../components/sections.js';
import { categories, products, pick, img, money, off, IMG, bySlug } from '../data/catalog.js';

// Home page order: deal wall (Amazon-style) → trust → Exclusive Offers → banners (laptops, console) → Top Deals →
// Shop by Categories → Hot Picks → banners (PC, gaming accessories) → Recently Viewed → Shop by Setup → Best of itDeal → footer

const SALE_END = '2026-11-12T00:00:00+08:00';

/* ---------------- Hero "deal wall" (Amazon-style): two rows of offer tiles */
const BG = {
  red: 'linear-gradient(160deg,#e3122b 0%,#9e0011 100%)',
  ink: 'linear-gradient(160deg,#30333c 0%,#0b0c0f 100%)',
  green: 'linear-gradient(160deg,#16a95f 0%,#05603a 100%)',
  plum: 'linear-gradient(160deg,#9333c9 0%,#4c0f6e 100%)',
  orange: 'linear-gradient(160deg,#ff8a1f 0%,#d9480f 100%)',
  blue: 'linear-gradient(160deg,#2f6bf0 0%,#1b3487 100%)',
  pink: 'linear-gradient(160deg,#ee4d9b 0%,#9d174d 100%)',
  teal: 'linear-gradient(160deg,#0fb5a6 0%,#0b5e63 100%)',
};
const maxOff = (cat) => Math.max(...products.filter((p) => p.cat === cat).map(off));
const minPrice = (cat) => Math.min(...products.filter((p) => p.cat === cat).map((p) => p.price));
const sparkle = `<svg class="pointer-events-none absolute right-3 top-3 size-7 text-white/35" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/><circle cx="19" cy="4" r="1.2"/><circle cx="5" cy="18" r="1"/></svg>`;

/* Big tile: headline, sub, product photo, offer strip */
const bigTile = ({ bg, big, sub, id, href, strip, stripIcon = 'ticket', extra = '' }) => html`
<a href="${href}" class="group relative flex h-full flex-col overflow-hidden rounded-2xl p-4 text-white ring-1 ring-black/5" style="background:${BG[bg]}">
  <span class="pointer-events-none absolute inset-1.5 rounded-xl border border-dashed border-white/25"></span>
  ${sparkle}
  <p class="relative pr-8 text-[26px] font-extrabold leading-[1.02] tracking-tight lg:text-[28px]">${big}</p>
  <p class="relative mt-1 text-[14px] font-medium leading-snug text-white/85">${sub}</p>
  ${extra}
  <span class="relative mt-3 block min-h-0 flex-1 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/20">
    <img src="${img(id, 520, 520)}" alt="" loading="lazy" class="size-full object-cover transition duration-700 ease-out-quint group-hover:scale-105">
  </span>
  <span class="relative mt-3 flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[11.5px] font-semibold text-ink shadow-sm">${icon(stripIcon, 'size-3.5 text-brand shrink-0', 2.2)}<span class="truncate">${strip}</span></span>
</a>`;

/* Small tile: two-line headline, photo, badge */
const smallTile = ({ bg, title, id, href, badge }) => html`
<a href="${href}" class="group relative flex h-full flex-col overflow-hidden rounded-2xl p-3 text-white ring-1 ring-black/5" style="background:${BG[bg]}">
  <p class="text-[17px] font-extrabold leading-[1.1] tracking-tight lg:text-[19px]">${title}</p>
  <span class="relative mt-2.5 block min-h-0 flex-1 overflow-hidden rounded-xl bg-white/10">
    <img src="${img(id, 360, 360)}" alt="" loading="lazy" class="size-full object-cover transition duration-700 ease-out-quint group-hover:scale-105">
    <span class="absolute bottom-2 left-2 rounded-md bg-white px-2 py-1 text-[11.5px] font-bold text-brand shadow-sm">${badge}</span>
  </span>
</a>`;

/* Quad tile from the visitor's wishlist (falls back to staff picks) */
const wishTile = () => html`
<div class="flex h-full flex-col rounded-2xl p-3.5 text-white ring-1 ring-black/5" style="background:${BG.green}" x-data="wishTile">
  <p class="text-[24px] font-extrabold leading-[1.05] tracking-tight lg:text-[26px]" x-text="data.title">Today’s top deals</p>
  <div class="mt-3 grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2">
    <template x-for="p in data.items" :key="p.id">
      <a :href="'product-' + p.slug + '.html'" class="group relative overflow-hidden rounded-xl bg-white">
        <img :src="$store.shop.img(p.img, 240)" :alt="p.title" loading="lazy" class="size-full object-cover transition duration-700 group-hover:scale-105">
        <span class="absolute bottom-1.5 left-1.5 rounded-md bg-brand px-1.5 py-0.5 text-[11px] font-bold text-white" x-text="Math.round((1 - p.price / p.mrp) * 100) + '% off'"></span>
        <span x-show="$store.shop.inWish(p.id)" class="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-white text-brand shadow-sm" title="In your wishlist"><svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></span>
      </a>
    </template>
  </div>
  <a :href="$store.shop.wish.length ? 'wishlist.html' : 'deals.html'" class="mt-2.5 text-[12.5px] font-semibold underline underline-offset-4" x-text="$store.shop.wish.length ? 'See your wishlist' : 'See all deals'">See all deals</a>
</div>`;

/* "Keep shopping for" — the n-th recently viewed product */
const keepTile = (n) => html`
<a class="group flex h-full flex-col rounded-2xl border border-line bg-white p-3" x-data="keepTile(${n})" :href="'product-' + p.slug + '.html'">
  <p class="text-[17px] font-extrabold leading-[1.1] tracking-tight text-ink lg:text-[19px]" x-text="title">Trending now</p>
  <span class="relative mt-2.5 block min-h-0 flex-1 overflow-hidden rounded-xl bg-surface">
    <img :src="$store.shop.img(p.img, 360)" :alt="p.title" loading="lazy" class="size-full object-cover transition duration-700 group-hover:scale-105">
    <span x-show="p.mrp > p.price" class="absolute bottom-2 left-2 rounded-md bg-brand px-2 py-1 text-[11.5px] font-bold text-white" x-text="Math.round((1 - p.price / p.mrp) * 100) + '% off'"></span>
  </span>
  <span class="mt-2 truncate text-[12.5px] font-medium text-ink-2" x-text="p.title"></span>
</a>`;

function hero() {
  const P = (s) => url(bySlug[s]);
  const row1 = [
    wishTile(),
    bigTile({ bg: 'red', big: 'Up to 40% off', sub: '11.11 Mega Sale — early access', id: IMG.macNeon, href: 'deals.html', strip: 'Extra S$111 off · code MEGA11',
      extra: `<p class="relative mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[11.5px] font-semibold" x-data="countdown('${SALE_END}')">${icon('clock', 'size-3.5', 2.2)}Ends in <span class="tnum" x-text="d + 'd ' + h + 'h ' + m + 'm'"></span></p>` }),
    bigTile({ bg: 'ink', big: `From ${money(1698)}`, sub: 'Galaxy S25 Ultra — Galaxy AI is here', id: '1610945265064-0e34e5519bbf', href: P('samsung-galaxy-s25-ultra'), strip: 'Built-in S Pen · 200MP camera', stripIcon: 'sparkles' }),
    bigTile({ bg: 'plum', big: `Up to ${maxOff('audio')}% off`, sub: 'Headphones, earbuds & speakers', id: IMG.heroAudio, href: 'category-audio.html', strip: 'Sony · Bose · Apple · Sennheiser', stripIcon: 'headphones' }),
    bigTile({ bg: 'blue', big: `Now ${money(1049)}`, sub: 'PlayStation 5 Pro — play has no limits', id: '1607853202273-797f1c22a38e', href: P('sony-playstation-5-pro'), strip: 'Only 11 left in stock', stripIcon: 'flame' }),
    bigTile({ bg: 'orange', big: 'Extra 8% off', sub: 'Student Week — laptops & tablets', id: IMG.students, href: 'category-laptops.html', strip: 'Show your student ID at checkout', stripIcon: 'cap' }),
    bigTile({ bg: 'pink', big: 'Just launched', sub: 'iPhone 17 Pro Max — A19 Pro chip', id: '1592750475338-74b7b21085ab', href: P('apple-iphone-17-pro-max'), strip: 'Free next-day delivery', stripIcon: 'truck' }),
    bigTile({ bg: 'teal', big: `Starting ${money(minPrice('accessories'))}`, sub: 'Power banks, keyboards & mice', id: '1609091839311-d5365f9ff1c5', href: 'category-accessories.html', strip: 'Fast-charge every device you own', stripIcon: 'zap' }),
  ];
  const row2 = [
    smallTile({ bg: 'red', title: 'Deals on<br>Laptops', id: '1525547719571-a2d4ac8945e2', href: 'category-laptops.html', badge: `Up to ${maxOff('laptops')}% off` }),
    keepTile(0),
    smallTile({ bg: 'orange', title: 'Deals on<br>Smartphones', id: '1610945265064-0e34e5519bbf', href: 'category-phones.html', badge: `Up to ${maxOff('phones')}% off` }),
    keepTile(1),
    smallTile({ bg: 'plum', title: 'Deals under<br>S$100', id: '1606144042614-b2417e99c4e3', href: 'deals.html', badge: `From ${money(45)}` }),
    smallTile({ bg: 'blue', title: 'Gaming<br>deals', id: '1578303512597-81e6cc155b3e', href: 'category-gaming.html', badge: `Up to ${maxOff('gaming')}% off` }),
    smallTile({ bg: 'green', title: 'Smart<br>watches', id: '1579586337278-3befd40fd17a', href: 'category-wearables.html', badge: `From ${money(minPrice('wearables'))}` }),
    smallTile({ bg: 'ink', title: 'Camera<br>deals', id: '1516035069371-29a1b244cc32', href: 'category-cameras.html', badge: `Up to ${maxOff('cameras')}% off` }),
    smallTile({ bg: 'pink', title: 'TV &<br>Monitors', id: '1593359677879-a4bb92f829d1', href: 'category-tv-monitors.html', badge: `Up to ${maxOff('tv-monitors')}% off` }),
    smallTile({ bg: 'teal', title: 'Keyboards<br>& mice', id: '1618384887929-16ec33fab9ef', href: 'category-accessories.html', badge: `From ${money(139)}` }),
  ];
  return html`
<section class="wrap space-y-3 pt-3 sm:pt-4" aria-label="Today's offers">
  ${rail(row1, 'h-[360px] w-[72%] sm:w-[40%] md:w-[31%] lg:h-[400px] lg:w-[calc((100%-4*0.75rem)/5)] wide:w-[calc((100%-5*0.75rem)/6)]', 'gap-3')}
  ${rail(row2, 'h-[220px] w-[42%] sm:w-[27%] md:w-[21%] lg:h-[250px] lg:w-[calc((100%-6*0.75rem)/7)] wide:w-[calc((100%-7*0.75rem)/8)]', 'gap-3')}
</section>`;
}

const CELL = 'w-[46%] sm:w-[31%] md:w-[23.5%] lg:w-[calc((100%-5*1rem)/6)] wide:w-[calc((100%-6*1rem)/7)]';

/* A product rail with optional text tabs. tabs: [[key, label, (p) => bool]] */
function productRail({ id, light, bold, href, items, tabs = null }) {
  const cells = items.map((p) => {
    const keys = tabs ? tabs.filter(([, , fn]) => fn(p)).map(([k]) => `'${k}'`).join(',') : '';
    return tabs ? [`x-show="[${keys}].includes(tab)"`, productCard(p)] : productCard(p);
  });
  return html`
<section class="wrap section" aria-labelledby="${id}" ${tabs ? `x-data="tabs('${tabs[0][0]}')"` : ''}>
  ${sectionHead({ title: `<span id="${id}">${twoTone(light, bold)}</span>`, href })}
  ${tabs ? html`
  <div class="snap-rail mb-3 gap-1 sm:mb-4" role="tablist">
    ${tabs.map(([k, label]) => html`<button type="button" role="tab" class="tab" :aria-pressed="tab === '${k}'" :aria-selected="tab === '${k}'" @click="tab = '${k}'; $el.closest('section').querySelector('[x-ref=track]').scrollTo({ left: 0 })">${label}</button>`)}
  </div>` : ''}
  ${rail(cells, CELL)}
</section>`;
}

/* Designed campaign banners (text is part of the artwork). Desktop shows two side by side,
   mobile swipes one at a time. WordPress: an ACF repeater of {image, mobile image, link, alt}. */
const BANNERS = {
  laptops: ['laptops-work-play', 'category-laptops.html', 'Laptops for work and play — gaming, business, student and everyday laptops. Shop now'],
  console: ['console-gaming', 'category-gaming.html', 'Console and gaming gear — consoles, headsets, controllers and accessories. Shop now'],
  pc: ['build-your-pc', 'build-pc.html', 'Build your dream PC — CPUs, GPUs, memory and cooling. Shop now'],
  accessories: ['gaming-accessories', 'category-gaming.html', 'Gaming accessories — headsets, keyboards, mice, controllers and gaming chairs. Shop now'],
};

function bannerRow(keys, label) {
  const cells = keys.map((k) => {
    const [file, href, alt] = BANNERS[k];
    return html`<a href="${href}" class="group block overflow-hidden rounded-2xl bg-ink ring-1 ring-black/5">
      <img src="assets/img/banners/${file}-830.jpg" srcset="assets/img/banners/${file}-830.jpg 830w, assets/img/banners/${file}.jpg 1659w" sizes="(min-width: 640px) 50vw, 92vw"
        alt="${alt}" width="1659" height="948" loading="lazy" decoding="async" class="aspect-[1659/948] w-full object-cover transition duration-700 ease-out-quint group-hover:scale-[1.02]">
    </a>`;
  });
  return html`<section class="wrap section" aria-label="${label}">${rail(cells, 'w-[92%] sm:w-[calc((100%-0.75rem)/2)]', 'gap-3')}</section>`;
}

function shopByCategories() {
  return html`
<section class="wrap section" aria-labelledby="cat-title">
  ${sectionHead({ title: `<span id="cat-title">${twoTone('Shop by', 'Categories')}</span>`, href: 'categories.html' })}
  <ul class="snap-rail gap-3 sm:gap-5 lg:grid lg:grid-cols-9">
    ${categories.map((c) => html`
    <li class="w-[76px] shrink-0 snap-start sm:w-[96px] lg:w-auto">
      <a href="category-${c.slug}.html" class="group flex flex-col items-center gap-2 text-center">
        <span class="block aspect-square w-full overflow-hidden rounded-full bg-surface ring-1 ring-line transition group-hover:ring-2 group-hover:ring-brand lg:mx-auto lg:max-w-[128px]">
          <img src="${img(c.img, 240)}" alt="" loading="lazy" class="size-full object-cover transition duration-700 ease-out-quint group-hover:scale-110">
        </span>
        <span class="text-[12px] font-semibold leading-tight text-ink sm:text-[13.5px]">${c.name}</span>
      </a>
    </li>`)}
  </ul>
</section>`;
}

/* Electronics-specific "lifestyle": shop by the setup you're building */
function shopBySetup() {
  const tiles = [
    ['Gaming Setup', 'Consoles, controllers, gaming laptops', IMG.gamers, 'category-gaming.html'],
    ['Work From Home', 'Laptops, monitors, keyboards & mice', IMG.work, 'category-laptops.html'],
    ['Creator Studio', 'Cameras, MacBooks, studio headphones', IMG.creators, 'category-cameras.html'],
    ['Campus Ready', 'Student laptops, tablets, earbuds', IMG.students, 'category-tablets.html'],
  ];
  return html`
<section class="wrap section" aria-labelledby="setup-title">
  ${sectionHead({ title: `<span id="setup-title">${twoTone('Shop by', 'Setup')}</span>` })}
  <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
    ${tiles.map(([t, s, id, href]) => html`
    <a href="${href}" class="group flex flex-col">
      <span class="relative block aspect-[4/3.6] overflow-hidden rounded-t-[160px] bg-surface lg:aspect-[4/3]">
        <img src="${img(id, 560, 460)}" alt="" loading="lazy" class="size-full object-cover transition duration-[1.2s] ease-out-quint group-hover:scale-105">
      </span>
      <span class="-mt-px flex flex-1 flex-col items-center rounded-b-2xl bg-surface px-2 py-3 text-center sm:py-4">
        <span class="text-[14px] font-bold sm:text-[17px]">${t}</span>
        <span class="mt-0.5 hidden text-[12.5px] text-muted sm:block">${s}</span>
        <span class="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink">View All ${icon('arrow-right', 'size-3.5', 2.2)}</span>
      </span>
    </a>`)}
  </div>
</section>`;
}

export default function home() {
  const deals = products.filter((p) => off(p) > 0).sort((a, b) => off(b) - off(a));
  const top = (cat) => (p) => p.cat === cat;
  const sold = [...products].sort((a, b) => b.sold - a.sold);
  return page({
    title: 'itDeal Sg — Laptops, Phones, Audio & Gaming at the Best Prices in Singapore',
    nav: 'home',
    body: html`
${hero()}
<section class="wrap pt-4" aria-label="Why shop with us">${trustStrip()}</section>

${productRail({ id: 'offers-title', light: 'Exclusive', bold: 'Offers', href: 'deals.html', items: pick(6, 12, 20, 32, 3, 26, 46, 37, 22, 29) })}

${bannerRow(['laptops', 'console'], 'Featured collections')}

${productRail({
  id: 'deals-title', light: 'Top', bold: 'Deals', href: 'deals.html', items: deals.slice(0, 24),
  tabs: [['all', 'All Deals', () => true], ['laptops', 'Laptops', top('laptops')], ['phones', 'Phones', top('phones')], ['audio', 'Audio', top('audio')], ['wearables', 'Wearables', top('wearables')], ['gaming', 'Gaming', top('gaming')], ['cameras', 'Cameras', top('cameras')]],
})}

${shopByCategories()}

${productRail({
  id: 'hot-title', light: 'Hot Picks', bold: 'For You', href: 'new-trending.html', items: products.filter((p) => p.badge === 'New' || p.price < 300 || p.sold > 85),
  tabs: [['new', 'New Launches', (p) => p.badge === 'New'], ['trending', 'Trending', (p) => p.sold > 85], ['under300', 'Under S$300', (p) => p.price < 300]],
})}

${bannerRow(['pc', 'accessories'], 'Gaming and PC collections')}

${recentlyViewed()}

${shopBySetup()}

${productRail({
  id: 'best-title', light: 'Best of', bold: 'itDeal', href: 'deals.html', items: sold.slice(0, 40),
  tabs: [['best', 'Best Sellers', (p) => p.sold >= 80], ['laptops', 'Top Laptops', top('laptops')], ['phones', 'Top Phones', top('phones')], ['audio', 'Top Audio', top('audio')], ['wearables', 'Top Wearables', top('wearables')], ['accessories', 'Accessories', top('accessories')]],
})}`,
  });
}
