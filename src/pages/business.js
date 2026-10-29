// itDeal Business (B2B) landing -> page-business.php. Placeholder until the B2B portal launches.
import { html, icon } from '../components/html.js';
import { page } from '../components/layout.js';
import { productCard } from '../components/product.js';
import { sectionHead, twoTone, rail } from '../components/sections.js';
import { pick, img, IMG } from '../data/catalog.js';

const PERKS = [
  ['percent', 'Volume pricing', 'Tiered discounts from 5 units, quoted within 24 hours.'],
  ['ticket', 'GST tax invoices', 'Proper invoices under your company name and UEN.'],
  ['wallet', '30-day credit terms', 'Pay by invoice or PO once your account is approved.'],
  ['user', 'Dedicated account manager', 'One contact for quotes, orders and after-sales.'],
  ['settings', 'Setup & deployment', 'Imaging, asset tagging and on-site installation.'],
  ['shield', 'Extended warranty', 'Up to 3-year on-site cover for business fleets.'],
];

export function businessPage() {
  return page({
    title: 'itDeal Business — Tech for Singapore Companies | itDeal Sg', nav: 'home',
    body: html`
<section class="wrap pt-4">
  <div class="relative overflow-hidden rounded-3xl bg-ink text-white">
    <img src="${img(IMG.work, 1400, 600)}" alt="" class="absolute inset-0 size-full object-cover opacity-35">
    <div class="absolute inset-0" style="background:radial-gradient(70% 90% at 100% 0%, rgb(200 0 21 / .75), transparent 60%), linear-gradient(90deg, #0b0c0f 30%, transparent)"></div>
    <div class="relative max-w-2xl p-6 sm:p-10 lg:p-14">
      <span class="badge bg-white/10 text-white ring-1 ring-white/20">${icon('sparkles', 'size-3.5')} Launching soon</span>
      <h1 class="mt-4 text-[34px] font-extrabold italic leading-none tracking-tight sm:text-5xl">itDeal <span class="text-[#ff4d5e]">BUSINESS</span></h1>
      <p class="mt-3 text-lg font-semibold sm:text-2xl">Tech for teams of every size.</p>
      <p class="mt-2 max-w-lg text-[15px] leading-relaxed text-white/75">Laptops, phones, monitors and accessories for your company — with volume pricing, credit terms and a dedicated account manager.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="#register" class="btn btn-primary btn-lg">Register your interest ${icon('arrow-right', 'size-4')}</a>
        <a href="tel:+6560000000" class="btn btn-lg border border-white/25 text-white hover:bg-white/10">${icon('phone', 'size-4')} Talk to sales</a>
      </div>
    </div>
  </div>
</section>

<section class="wrap section">
  ${sectionHead({ title: twoTone('Why buy with', 'itDeal Business') })}
  <ul class="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
    ${PERKS.map(([ic, t, s]) => html`
    <li class="rounded-2xl bg-surface p-4 sm:p-5">
      <span class="grid size-10 place-items-center rounded-xl bg-white text-brand shadow-sm">${icon(ic, 'size-5')}</span>
      <p class="mt-3 text-[15px] font-semibold">${t}</p>
      <p class="mt-1 text-[13px] leading-snug text-muted">${s}</p>
    </li>`)}
  </ul>
</section>

<section class="wrap section">
  ${sectionHead({ title: twoTone('Popular with', 'businesses'), href: 'category-laptops.html' })}
  ${rail(pick(5, 2, 3, 45, 41, 43, 12, 22).map((p) => productCard(p)), 'w-[46%] sm:w-[31%] md:w-[23.5%] lg:w-[calc((100%-5*1rem)/6)] wide:w-[calc((100%-6*1rem)/7)]')}
</section>

<section id="register" class="wrap section scroll-mt-40">
  <div class="grid grid-cols-[minmax(0,1fr)] gap-6 rounded-3xl border border-line p-5 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
    <div>
      <h2 class="section-title">Be the first to know</h2>
      <p class="mt-2 text-[15px] text-muted">Leave your details and our business team will reach out before launch with early-access pricing for your company.</p>
      <ul class="mt-5 space-y-2.5 text-sm text-ink-2">
        ${['Free consultation for your IT setup', 'Early-access volume pricing', 'Priority onboarding for credit terms'].map((t) => html`<li class="flex items-center gap-2.5">${icon('check', 'size-4 text-success', 2.5)} ${t}</li>`)}
      </ul>
    </div>
    <form class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2" x-data="{ done: false }" @submit.prevent="done = true">
      <template x-if="!done">
        <div class="contents">
          <div class="sm:col-span-2"><label class="field-label" for="b-co">Company name</label><input id="b-co" class="input" required placeholder="e.g. Acme Pte. Ltd."></div>
          <div><label class="field-label" for="b-uen">UEN</label><input id="b-uen" class="input" placeholder="e.g. 201912345K"></div>
          <div><label class="field-label" for="b-size">Team size</label>
            <select id="b-size" class="input"><option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option></select></div>
          <div><label class="field-label" for="b-name">Your name</label><input id="b-name" class="input" required autocomplete="name"></div>
          <div><label class="field-label" for="b-email">Work email</label><input id="b-email" type="email" class="input" required autocomplete="email"></div>
          <div class="sm:col-span-2"><label class="field-label" for="b-need">What do you need? (optional)</label><input id="b-need" class="input" placeholder="e.g. 20 laptops and monitors for a new office"></div>
          <button class="btn btn-dark btn-lg sm:col-span-2">Register interest</button>
        </div>
      </template>
      <div x-show="done" x-cloak class="flex items-center gap-3 rounded-2xl bg-success-50 p-5 text-success sm:col-span-2">
        ${icon('check', 'size-6', 2.5)}<p class="text-[15px] font-medium">Thanks! Our business team will contact you within one working day.</p>
      </div>
    </form>
  </div>
</section>`,
  });
}
