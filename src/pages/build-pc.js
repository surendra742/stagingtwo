// Build Your PC landing -> page-build-pc.php. The interactive PC builder needs a PC-components
// catalogue (CPU, GPU, RAM…) first; until then this page collects custom-build requests.
import { html, icon } from '../components/html.js';
import { page } from '../components/layout.js';
import { productCard } from '../components/product.js';
import { sectionHead, twoTone, rail, breadcrumb } from '../components/sections.js';
import { pick } from '../data/catalog.js';

const PARTS = [
  ['cpu', 'Processor', 'Intel Core & AMD Ryzen'],
  ['grid', 'Motherboard', 'ATX, mATX, ITX'],
  ['list', 'Memory', 'DDR5 RGB kits'],
  ['monitor', 'Graphics card', 'NVIDIA RTX & AMD Radeon'],
  ['package', 'Storage', 'NVMe SSDs & HDDs'],
  ['zap', 'Power & cooling', 'PSUs, AIOs & fans'],
];
const STEPS = [
  ['Tell us your budget', 'And what you’ll use it for — gaming, editing, streaming or work.'],
  ['Get a parts list', 'Our builders pick compatible parts and send a quote within 24 hours.'],
  ['We build & test', 'Assembled, cable-managed and stress-tested in our HarbourFront lab.'],
  ['Delivered ready to play', 'Windows installed, 1-year local warranty on the full build.'],
];

export function buildPcPage() {
  return page({
    title: 'Build Your PC — Custom Gaming & Workstation PCs | itDeal Sg', nav: 'home',
    body: html`
<div class="wrap pt-4">
  ${breadcrumb([['Home', 'index.html'], ['Build Your PC']])}
  <div class="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[1.35fr_1fr]">
    <img src="assets/img/banners/build-your-pc-830.jpg" srcset="assets/img/banners/build-your-pc-830.jpg 830w, assets/img/banners/build-your-pc.jpg 1659w" sizes="(min-width:1024px) 58vw, 100vw"
      alt="Build your dream PC — CPUs, GPUs, memory and cooling" width="1659" height="948" class="aspect-[1659/948] w-full rounded-2xl object-cover">
    <div class="flex flex-col justify-center rounded-2xl bg-surface p-5 sm:p-7">
      <span class="badge badge-sale w-fit">${icon('sparkles', 'size-3.5')} PC Builder launching soon</span>
      <h1 class="mt-3 text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">Build Your PC</h1>
      <p class="mt-2 text-[15px] leading-relaxed text-muted">Pick your parts or let our experts spec it for you. Every build is compatibility-checked, assembled and tested in Singapore.</p>
      <ul class="mt-4 space-y-2 text-sm text-ink-2">
        ${['Free compatibility check', 'Pro assembly & cable management', '1-year warranty on the full build'].map((t) => html`<li class="flex items-center gap-2">${icon('check', 'size-4 text-success', 2.5)} ${t}</li>`)}
      </ul>
      <a href="#quote" class="btn btn-primary btn-lg mt-6 w-fit">Get a custom build quote ${icon('arrow-right', 'size-4')}</a>
    </div>
  </div>
</div>

<section class="wrap section">
  ${sectionHead({ title: twoTone('Choose your', 'parts') })}
  <ul class="grid grid-cols-3 gap-3 lg:grid-cols-6">
    ${PARTS.map(([ic, t, s]) => html`
    <li class="flex flex-col items-center rounded-2xl border border-line p-4 text-center">
      <span class="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand">${icon(ic, 'size-6', 1.7)}</span>
      <p class="mt-2.5 text-[13.5px] font-semibold leading-tight">${t}</p>
      <p class="mt-0.5 hidden text-xs text-muted sm:block">${s}</p>
      <span class="mt-2 rounded-full bg-surface px-2 py-0.5 text-[10.5px] font-semibold text-muted">Coming soon</span>
    </li>`)}
  </ul>
</section>

<section class="wrap section">
  ${sectionHead({ title: twoTone('How it', 'works') })}
  <ol class="grid grid-cols-2 gap-3 lg:grid-cols-4">
    ${STEPS.map(([t, s], i) => html`
    <li class="rounded-2xl bg-surface p-4 sm:p-5">
      <span class="grid size-8 place-items-center rounded-full bg-ink text-sm font-bold text-white">${i + 1}</span>
      <p class="mt-3 text-[15px] font-semibold">${t}</p>
      <p class="mt-1 text-[13px] leading-snug text-muted">${s}</p>
    </li>`)}
  </ol>
</section>

<section id="quote" class="wrap section scroll-mt-40">
  <div class="rounded-3xl border border-line p-5 sm:p-8" x-data="{ done: false, use: 'Gaming', budget: 'S$1,500 – S$2,500' }">
    <h2 class="section-title">Get a custom build quote</h2>
    <p class="mt-1.5 text-[15px] text-muted">Free, no obligation. A PC specialist replies within 24 hours.</p>
    <form x-show="!done" class="mt-5 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2" @submit.prevent="done = true">
      <div class="sm:col-span-2">
        <span class="field-label">What will you use it for?</span>
        <div class="flex flex-wrap gap-2">
          ${['Gaming', 'Video editing', 'Streaming', '3D & CAD', 'Office & study'].map((u) => html`<button type="button" class="chip" :aria-pressed="use === '${u}'" @click="use = '${u}'">${u}</button>`)}
        </div>
      </div>
      <div class="sm:col-span-2">
        <span class="field-label">Budget</span>
        <div class="flex flex-wrap gap-2">
          ${['Under S$1,500', 'S$1,500 – S$2,500', 'S$2,500 – S$4,000', 'S$4,000+'].map((b) => html`<button type="button" class="chip" :aria-pressed="budget === '${b}'" @click="budget = '${b}'">${b}</button>`)}
        </div>
      </div>
      <div><label class="field-label" for="pc-name">Name</label><input id="pc-name" class="input" required autocomplete="name"></div>
      <div><label class="field-label" for="pc-phone">Mobile</label><div class="flex"><span class="grid h-12 place-items-center rounded-l-xl border border-r-0 border-line-2 bg-surface px-3.5 font-medium">+65</span><input id="pc-phone" class="input rounded-l-none" inputmode="tel" required></div></div>
      <div class="sm:col-span-2"><label class="field-label" for="pc-notes">Anything specific? (optional)</label><input id="pc-notes" class="input" placeholder="e.g. RTX 5080, white case, quiet for streaming"></div>
      <button class="btn btn-dark btn-lg sm:col-span-2 sm:w-fit">Request my quote</button>
    </form>
    <p x-cloak x-show="done" class="mt-5 flex items-center gap-3 rounded-2xl bg-success-50 p-5 text-[15px] font-medium text-success">${icon('check', 'size-6', 2.5)} Got it! A PC specialist will WhatsApp you within 24 hours.</p>
  </div>
</section>

<section class="wrap section">
  ${sectionHead({ title: twoTone('Complete your', 'setup'), href: 'category-gaming.html' })}
  ${rail(pick(6, 36, 33, 42, 46, 34, 32, 41).map((p) => productCard(p)), 'w-[46%] sm:w-[31%] md:w-[23.5%] lg:w-[calc((100%-5*1rem)/6)] wide:w-[calc((100%-6*1rem)/7)]')}
</section>`,
  });
}
