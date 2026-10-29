// Cart -> cart.php, Checkout -> form-checkout.php, Success -> thankyou.php
import { html, icon } from '../components/html.js';
import { page } from '../components/layout.js';
import { productCard } from '../components/product.js';
import { trustIcon } from '../components/trust-icons.js';
import { sectionHead, rail, recentlyViewed, emptyState } from '../components/sections.js';
import { pick } from '../data/catalog.js';

const P = '$store.shop';

const qtyStepper = (line = 'line') => html`
<div class="flex h-9 items-center rounded-full border border-line-2">
  <button type="button" class="grid size-9 place-items-center" aria-label="Decrease" @click="${line}.qty > 1 ? ${P}.setQty(${line}.key, ${line}.qty - 1) : ${P}.remove(${line}.key)">${icon('minus', 'size-3.5', 2)}</button>
  <span class="tnum w-6 text-center text-sm font-semibold" x-text="${line}.qty"></span>
  <button type="button" class="grid size-9 place-items-center" aria-label="Increase" @click="${P}.setQty(${line}.key, ${line}.qty + 1)">${icon('plus', 'size-3.5', 2)}</button>
</div>`;

const payBadges = () => html`
<div class="flex flex-wrap justify-center gap-1.5">${['Visa', 'Mastercard', 'AMEX', 'PayNow', 'Apple Pay', 'GrabPay'].map((p) => html`<span class="inline-flex h-6 items-center rounded border border-line bg-white px-2 text-[10px] font-semibold text-ink-2">${p}</span>`)}</div>`;

function coupon() {
  return html`
<div x-data="{ code: '', err: '', open: false }" class="border-b border-line pb-4">
  <template x-if="!${P}.coupon">
    <div>
      <button type="button" class="flex w-full items-center justify-between text-sm font-semibold" @click="open = !open" :aria-expanded="open">
        <span class="flex items-center gap-2">${icon('ticket', 'size-[18px] text-brand')} Apply a promo code</span>
        <span class="transition" :class="open && 'rotate-180'">${icon('chevron-down', 'size-4')}</span>
      </button>
      <div x-show="open" x-collapse>
        <form class="flex gap-2 pt-3" @submit.prevent="err = ${P}.applyCoupon(code); if (!err) { code = ''; $store.ui.toast('Promo code applied', 'ticket') }">
          <input x-model="code" placeholder="e.g. ITDEAL10" class="input h-11 flex-1 uppercase placeholder:normal-case" aria-label="Promo code">
          <button class="btn btn-dark h-11">Apply</button>
        </form>
        <p x-show="err" x-text="err" class="mt-1.5 text-xs text-brand"></p>
        <p class="mt-2 text-xs text-muted">Try <button type="button" class="font-mono font-bold text-ink" @click="code = 'ITDEAL10'">ITDEAL10</button> or <button type="button" class="font-mono font-bold text-ink" @click="code = 'MEGA11'">MEGA11</button></p>
      </div>
    </div>
  </template>
  <template x-if="${P}.coupon">
    <div class="flex items-center gap-3 rounded-xl bg-success-50 px-3 py-2.5 text-success">
      ${icon('ticket', 'size-[18px]')}
      <div class="flex-1 text-[13px] leading-tight"><b class="font-mono" x-text="${P}.coupon"></b> applied<br><span class="text-xs opacity-80" x-text="${P}.couponLabel"></span></div>
      <button type="button" class="text-xs font-semibold underline" @click="${P}.removeCoupon()">Remove</button>
    </div>
  </template>
</div>`;
}

const totals = (ship = "'standard'") => html`
<dl class="space-y-2.5 text-[14px]">
  <div class="flex justify-between"><dt class="text-muted">Price (<span x-text="${P}.count"></span> items)</dt><dd class="tnum" x-text="${P}.money(${P}.mrpTotal, true)"></dd></div>
  <div class="flex justify-between" x-show="${P}.savings > 0"><dt class="text-muted">Discount</dt><dd class="tnum font-medium text-success" x-text="'−' + ${P}.money(${P}.savings, true)"></dd></div>
  <div class="flex justify-between" x-show="${P}.couponOff > 0"><dt class="text-muted">Promo (<span x-text="${P}.coupon"></span>)</dt><dd class="tnum font-medium text-success" x-text="'−' + ${P}.money(${P}.couponOff, true)"></dd></div>
  <div class="flex justify-between"><dt class="text-muted">Delivery</dt><dd class="tnum" x-text="${P}.shipping(${ship}) ? ${P}.money(${P}.shipping(${ship}), true) : 'Free'" :class="!${P}.shipping(${ship}) && 'font-medium text-success'"></dd></div>
  <div class="flex items-baseline justify-between border-t border-line pt-3.5"><dt class="font-semibold">Total</dt><dd class="price text-2xl" x-text="${P}.money(${P}.total(${ship}), true)"></dd></div>
  <p class="text-right text-xs text-muted">Includes GST of <span class="tnum" x-text="${P}.money(${P}.gst(${ship}), true)"></span></p>
</dl>
<p class="mt-4 rounded-xl bg-success-50 px-3 py-2.5 text-center text-[13px] font-semibold text-success" x-show="${P}.savings + ${P}.couponOff > 0">🎉 You’re saving <span x-text="${P}.money(${P}.savings + ${P}.couponOff)"></span> on this order</p>`;

export function cartPage() {
  return page({
    title: 'Your Cart | itDeal Sg', nav: null, bodyClass: '!pb-[92px] lg:!pb-0',
    body: html`
<div class="wrap pt-5 sm:pt-8">
  <div class="flex items-end justify-between">
    <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Your cart <span class="font-medium text-muted" x-text="'(' + ${P}.count + ')'"></span></h1>
    <a href="index.html" class="hidden text-sm font-semibold underline underline-offset-4 sm:block">Continue shopping</a>
  </div>

  <div x-show="!${P}.cart.length" x-cloak>${emptyState({ ic: 'bag', title: 'Your cart is empty', text: 'Looks like you haven’t added anything yet. Today’s deals are a great place to start.', cta: 'Shop today’s deals', href: 'deals.html' })}</div>

  <div x-show="${P}.cart.length" class="mt-5 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
    <div>
      <div class="mb-4 rounded-2xl border border-line p-4">
        <p class="text-sm" x-show="${P}.freeShipLeft > 0">You’re <b class="tnum" x-text="${P}.money(${P}.freeShipLeft, true)"></b> away from <b>free delivery</b></p>
        <p class="flex items-center gap-2 text-sm font-semibold text-success" x-show="${P}.freeShipLeft <= 0">${icon('truck', 'size-[18px]')} Your order ships free</p>
        <div class="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-2"><div class="h-full rounded-full bg-success transition-all duration-500" :style="'width:' + Math.min(100, ${P}.subtotal / 49 * 100) + '%'"></div></div>
      </div>
      <ul class="divide-y divide-line rounded-2xl border border-line">
        <template x-for="line in ${P}.cart" :key="line.key">
          <li class="flex gap-4 p-4 sm:p-5">
            <a :href="'product-' + ${P}.p(line.id).slug + '.html'" class="shrink-0"><img :src="${P}.img(${P}.p(line.id).img, 240)" alt="" class="size-24 rounded-xl bg-surface object-cover sm:size-28"></a>
            <div class="flex min-w-0 flex-1 flex-col">
              <div class="flex gap-3">
                <div class="min-w-0 flex-1">
                  <p class="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted" x-text="${P}.p(line.id).brand"></p>
                  <a :href="'product-' + ${P}.p(line.id).slug + '.html'" class="mt-0.5 line-clamp-2 text-[15px] font-medium leading-snug hover:underline" x-text="${P}.p(line.id).name"></a>
                  <p class="mt-1 text-xs text-muted" x-text="[line.variant, line.color].filter(Boolean).join(' · ') || ${P}.p(line.id).short"></p>
                </div>
                <div class="hidden text-right sm:block">
                  <p class="price" x-text="${P}.money(${P}.unit(line) * line.qty)"></p>
                  <p class="mrp text-xs" x-show="${P}.unitMrp(line) > ${P}.unit(line)" x-text="${P}.money(${P}.unitMrp(line) * line.qty)"></p>
                </div>
              </div>
              <p class="mt-2 flex items-center gap-1.5 text-xs font-medium text-success">${icon('check', 'size-3.5', 2.5)} In stock · Free delivery in 2–3 days</p>
              <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                ${qtyStepper()}
                <p class="price sm:hidden" x-text="${P}.money(${P}.unit(line) * line.qty)"></p>
                <div class="flex w-full gap-4 text-[13px] font-medium text-muted sm:w-auto">
                  <button type="button" class="flex items-center gap-1.5 hover:text-ink" @click="${P}.saveForLater(line.key)">${icon('heart', 'size-4')} Save for later</button>
                  <button type="button" class="flex items-center gap-1.5 hover:text-brand" @click="${P}.remove(line.key)">${icon('trash', 'size-4')} Remove</button>
                </div>
              </div>
            </div>
          </li>
        </template>
      </ul>
      <div class="mt-4 grid grid-cols-3 gap-2 text-center">
        ${[['warranty', '1-year local warranty'], ['returns', '7-day free returns'], ['secure', 'Secure checkout']].map(([ic, t]) => html`<div class="flex flex-col items-center gap-1.5 rounded-2xl bg-surface px-2 py-3.5">${trustIcon(ic, 'size-10')}<span class="text-[11.5px] font-medium leading-tight text-ink-2">${t}</span></div>`)}
      </div>
    </div>

    <aside class="lg:sticky lg:top-[140px] lg:self-start">
      <div class="rounded-3xl border border-line p-5 sm:p-6">
        <h2 class="mb-4 text-lg font-bold">Order summary</h2>
        ${coupon()}
        <div class="pt-4">${totals()}</div>
        <a href="checkout.html" class="btn btn-primary btn-lg mt-5 hidden w-full lg:flex">Proceed to checkout ${icon('arrow-right', 'size-4')}</a>
        <p class="mt-3 hidden items-center justify-center gap-1.5 text-xs text-muted lg:flex">${icon('lock', 'size-3.5')} Encrypted & secure payments</p>
        <div class="mt-3 hidden lg:block">${payBadges()}</div>
      </div>
    </aside>
  </div>
</div>

<section class="wrap section">
  ${sectionHead({ title: 'Complete your setup', sub: 'Accessories that pair perfectly' })}
  ${rail(pick(41, 44, 22, 42, 33, 25, 43, 36).map((p) => productCard(p)))}
</section>
${recentlyViewed()}

<div x-show="${P}.cart.length" class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-safe shadow-bar backdrop-blur lg:hidden">
  <div class="flex items-center gap-3 px-4 py-3">
    <div class="min-w-0 flex-1"><p class="text-[11px] text-muted">Total (incl. GST)</p><p class="price text-xl leading-tight" x-text="${P}.money(${P}.total(), true)"></p></div>
    <a href="checkout.html" class="btn btn-primary h-12 px-7">Checkout ${icon('arrow-right', 'size-4')}</a>
  </div>
</div>`,
  });
}

/* ---------------- Checkout */
const field = (key, label, attrs = '', cls = '') => html`
<div class="${cls}">
  <label for="f-${key}" class="field-label">${label}</label>
  <input id="f-${key}" x-model="f.${key}" class="input" :class="err.${key} && '!border-brand ring-4 !ring-brand/10'" ${attrs}>
  <p x-show="err.${key}" x-text="err.${key}" class="mt-1 text-xs text-brand"></p>
</div>`;

const stepCard = (n, title, done, body) => html`
<section id="step-${n}" class="scroll-mt-24 rounded-3xl border p-5 transition sm:p-6" :class="step === ${n} ? 'border-ink' : 'border-line'">
  <div class="flex items-center gap-3">
    <span class="grid size-8 place-items-center rounded-full text-sm font-bold" :class="step > ${n} ? 'bg-success text-white' : step === ${n} ? 'bg-ink text-white' : 'bg-surface text-muted'">
      <span x-show="step <= ${n}">${n}</span><span x-show="step > ${n}">${icon('check', 'size-4', 3)}</span>
    </span>
    <h2 class="flex-1 text-[17px] font-bold" :class="step < ${n} && 'text-muted'">${title}</h2>
    <button type="button" x-show="step > ${n}" class="text-sm font-semibold underline underline-offset-4" @click="edit(${n})">Edit</button>
  </div>
  <div x-show="step > ${n}" class="mt-2 pl-11 text-sm text-muted">${done}</div>
  <div x-show="step === ${n}" x-collapse><div class="pt-5">${body}</div></div>
</section>`;

const option = (model, value, title, sub, right = '') => html`
<label class="flex cursor-pointer items-center gap-3.5 rounded-2xl border p-4 transition" :class="${model} === '${value}' ? 'border-ink bg-ink/[0.02] ring-1 ring-ink' : 'border-line-2 hover:border-ink-2'">
  <input type="radio" class="radio" value="${value}" x-model="${model}">
  <span class="flex-1"><span class="block text-[14.5px] font-semibold">${title}</span><span class="block text-xs text-muted">${sub}</span></span>
  ${right}
</label>`;

function summaryPanel() {
  return html`
<div class="rounded-3xl bg-surface p-5 sm:p-6">
  <h2 class="mb-4 text-lg font-bold">Order summary</h2>
  <ul class="mb-4 space-y-3 border-b border-line pb-4">
    <template x-for="line in ${P}.cart" :key="line.key">
      <li class="flex items-center gap-3">
        <span class="relative shrink-0"><img :src="${P}.img(${P}.p(line.id).img, 120)" alt="" class="size-14 rounded-xl bg-white object-cover"><span class="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-white" x-text="line.qty"></span></span>
        <span class="min-w-0 flex-1"><span class="line-clamp-1 text-[13px] font-medium" x-text="${P}.p(line.id).title"></span><span class="block truncate text-xs text-muted" x-text="[line.variant, line.color].filter(Boolean).join(' · ')"></span></span>
        <span class="price text-sm" x-text="${P}.money(${P}.unit(line) * line.qty)"></span>
      </li>
    </template>
  </ul>
  ${coupon()}
  <div class="pt-4">${totals('ship')}</div>
</div>`;
}

export function checkoutPage() {
  return page({
    title: 'Secure Checkout | itDeal Sg', minimal: true, nav: null,
    body: html`
<div x-data="checkout" class="pb-28 lg:pb-16">
  <!-- mobile summary toggle -->
  <div class="border-b border-line bg-surface lg:hidden">
    <button type="button" class="wrap flex h-14 items-center justify-between text-sm" @click="summaryOpen = !summaryOpen" :aria-expanded="summaryOpen">
      <span class="flex items-center gap-2 font-semibold">${icon('bag', 'size-[18px]')} <span x-text="summaryOpen ? 'Hide order summary' : 'Show order summary'"></span><span class="transition" :class="summaryOpen && 'rotate-180'">${icon('chevron-down', 'size-4')}</span></span>
      <span class="price text-base" x-text="${P}.money(${P}.total(ship), true)"></span>
    </button>
    <div x-show="summaryOpen" x-collapse><div class="wrap pb-5">${summaryPanel()}</div></div>
  </div>

  <template x-if="!${P}.cart.length">
    <div class="wrap">${emptyState({ ic: 'bag', title: 'Nothing to check out', text: 'Your cart is empty. Add a few things and come back.', cta: 'Back to shop', href: 'index.html' })}</div>
  </template>

  <div x-show="${P}.cart.length" class="wrap mt-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_420px]">
    <div class="space-y-4">
      <div>
        <p class="eyebrow mb-3 text-center">Express checkout</p>
        <div class="grid grid-cols-3 gap-2">
          <button type="button" class="btn h-12 rounded-xl bg-ink text-white hover:bg-ink-2"><svg class="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76a4.24 4.24 0 0 0-3.58 2.18c-1.53 2.65-.39 6.57 1.1 8.72.73 1.05 1.6 2.23 2.73 2.19 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13a9.4 9.4 0 0 0 1.2-2.47 3.83 3.83 0 0 1-2.3-3.47ZM14.2 6.13A3.82 3.82 0 0 0 15.1 3.4a3.9 3.9 0 0 0-2.52 1.3 3.64 3.64 0 0 0-.92 2.63 3.22 3.22 0 0 0 2.54-1.2Z"/></svg>Pay</button>
          <button type="button" class="btn h-12 rounded-xl border border-line-2 bg-white"><svg class="size-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.35Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.5c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.91a6 6 0 0 1 0-3.82v-2.6H3.07a10 10 0 0 0 0 9.02l3.34-2.6Z"/><path fill="#EA4335" d="M12 5.97c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.97 9.97 0 0 0 3.07 7.49l3.34 2.6C7.2 7.73 9.4 5.97 12 5.97Z"/></svg>Pay</button>
          <button type="button" class="btn h-12 rounded-xl bg-[#7c1a78] text-white hover:opacity-90">PayNow</button>
        </div>
        <div class="my-6 flex items-center gap-3 text-xs text-muted"><span class="h-px flex-1 bg-line"></span>or pay another way<span class="h-px flex-1 bg-line"></span></div>
      </div>

      ${stepCard(1, 'Contact', html`<span x-text="f.email"></span> · <span x-text="'+65 ' + f.phone"></span>`, html`
        <p class="mb-4 text-sm text-muted">Have an account? <a href="login.html" class="link">Sign in</a> for faster checkout.</p>
        <div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
          ${field('email', 'Email', 'type="email" autocomplete="email" placeholder="you@example.com"')}
          <div>
            <label for="f-phone" class="field-label">Mobile number</label>
            <div class="flex">
              <span class="grid h-12 place-items-center rounded-l-xl border border-r-0 border-line-2 bg-surface px-3.5 text-[15px] font-medium">+65</span>
              <input id="f-phone" x-model="f.phone" inputmode="tel" autocomplete="tel-national" placeholder="8123 4567" class="input rounded-l-none" :class="err.phone && '!border-brand'">
            </div>
            <p x-show="err.phone" x-text="err.phone" class="mt-1 text-xs text-brand"></p>
          </div>
        </div>
        <label class="mt-4 flex items-center gap-2.5 text-sm text-ink-2"><input type="checkbox" class="check" checked> Email me order updates and exclusive deals</label>
        <button type="button" class="btn btn-dark btn-lg mt-5 w-full sm:w-auto" @click="next(1)">Continue to delivery</button>`)}

      ${stepCard(2, 'Delivery address', html`<span x-text="f.first + ' ' + f.last"></span>, <span x-text="f.block + ' ' + f.street + (f.unit ? ', #' + f.unit : '') + ', Singapore ' + f.postal"></span>`, html`
        <div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
          ${field('first', 'First name', 'autocomplete="given-name"')}
          ${field('last', 'Last name', 'autocomplete="family-name"')}
          <div class="sm:col-span-2">
            <label for="f-postal" class="field-label">Postal code</label>
            <div class="flex gap-2">
              <input id="f-postal" x-model="f.postal" inputmode="numeric" maxlength="6" autocomplete="postal-code" placeholder="6-digit postal code" class="input flex-1" :class="err.postal && '!border-brand'" @input.debounce.400ms="f.postal.length === 6 && lookup()">
              <button type="button" class="btn btn-outline h-12" @click="lookup()">Find address</button>
            </div>
            <p x-show="err.postal" x-text="err.postal" class="mt-1 text-xs text-brand"></p>
            <p class="input-hint">We’ll fill in your street automatically. Try 238839.</p>
          </div>
          ${field('block', 'Block / House no.', 'placeholder="e.g. 290"')}
          ${field('street', 'Street name', 'autocomplete="address-line1"')}
          ${field('unit', 'Unit no. (optional)', 'placeholder="e.g. 12-345"')}
          ${field('building', 'Building name (optional)', 'autocomplete="address-line2"')}
        </div>
        <button type="button" class="btn btn-dark btn-lg mt-5 w-full sm:w-auto" @click="next(2)">Continue to shipping</button>`)}

      ${stepCard(3, 'Delivery method', html`<span x-text="{ standard: 'Standard delivery', express: 'Express — next working day', sameday: 'Same-day delivery', collect: 'Self-collect at HarbourFront' }[ship]"></span>`, html`
        <div class="space-y-2.5">
          ${option('ship', 'standard', 'Standard delivery', '2–3 working days', `<span class="text-sm font-semibold" x-text="${P}.subtotal >= 49 ? 'Free' : 'S$4.99'"></span>`)}
          ${option('ship', 'express', 'Express', 'Next working day', '<span class="text-sm font-semibold">S$8.90</span>')}
          ${option('ship', 'sameday', 'Same-day', 'Order before 2pm, delivered by 10pm', '<span class="text-sm font-semibold">S$14.90</span>')}
          ${option('ship', 'collect', 'Self-collect', 'itDeal HarbourFront · ready in 2 hours', '<span class="text-sm font-semibold text-success">Free</span>')}
        </div>
        <button type="button" class="btn btn-dark btn-lg mt-5 w-full sm:w-auto" @click="next(3)">Continue to payment</button>`)}

      ${stepCard(4, 'Payment', '', html`
        <div class="space-y-2.5">
          ${option('pay', 'card', 'Credit / debit card', 'Visa, Mastercard, AMEX', `<span class="flex gap-1">${['VISA', 'MC', 'AMEX'].map((c) => `<span class="rounded border border-line px-1.5 py-0.5 text-[9px] font-bold">${c}</span>`).join('')}</span>`)}
          <div x-show="pay === 'card'" x-collapse>
            <div class="grid grid-cols-2 gap-3 rounded-2xl bg-surface p-4">
              <div class="col-span-2">
                <label for="f-card" class="field-label">Card number</label>
                <div class="relative"><input id="f-card" x-model="f.card" @input="fmtCard()" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" class="input bg-white pr-11" :class="err.card && '!border-brand'"><span class="absolute right-4 top-1/2 -translate-y-1/2 text-muted">${icon('lock', 'size-4')}</span></div>
                <p x-show="err.card" x-text="err.card" class="mt-1 text-xs text-brand"></p>
              </div>
              <div><label for="f-exp" class="field-label">Expiry</label><input id="f-exp" x-model="f.exp" @input="fmtExp()" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" class="input bg-white" :class="err.exp && '!border-brand'"></div>
              <div><label for="f-cvc" class="field-label">CVC</label><input id="f-cvc" x-model="f.cvc" inputmode="numeric" maxlength="4" autocomplete="cc-csc" placeholder="123" class="input bg-white" :class="err.cvc && '!border-brand'"></div>
              <label class="col-span-2 flex items-center gap-2.5 text-sm text-ink-2"><input type="checkbox" class="check" x-model="billingSame"> Billing address same as delivery</label>
            </div>
          </div>
          ${option('pay', 'paynow', 'PayNow', 'Scan a QR with any Singapore banking app', icon('qr', 'size-5 text-[#7c1a78]'))}
          <p x-show="pay === 'paynow'" x-collapse class="rounded-2xl bg-surface p-4 text-[13px] text-ink-2">You’ll see a PayNow QR code after placing your order. It expires in 15 minutes.</p>
          ${option('pay', 'grabpay', 'GrabPay', 'Pay with your GrabPay wallet', '<span class="rounded bg-[#00b14f] px-1.5 py-0.5 text-[9px] font-bold text-white">Grab</span>')}
        </div>
        <p class="mt-4 flex items-center gap-2 text-xs text-muted">${icon('shield', 'size-4 text-success')} Payments are encrypted and processed securely. We never store your card details.</p>`)}

      <div class="hidden lg:block">
        <button type="button" class="btn btn-primary btn-lg w-full" :disabled="step < 4 || placing" @click="place()">
          <span x-show="!placing" class="flex items-center gap-2">${icon('lock', 'size-4')} Place order · <span x-text="${P}.money(${P}.total(ship), true)"></span></span>
          <span x-show="placing" class="flex items-center gap-2"><span class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span> Placing your order…</span>
        </button>
        <p class="mt-3 text-center text-xs text-muted">By placing your order you agree to our <a href="#" class="underline">Terms</a> and <a href="#" class="underline">Privacy policy</a>.</p>
      </div>
    </div>

    <aside class="hidden lg:sticky lg:top-24 lg:block lg:self-start">${summaryPanel()}</aside>
  </div>

  <div x-show="${P}.cart.length && step === 4" x-transition.opacity class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-safe shadow-bar backdrop-blur lg:hidden">
    <div class="px-4 py-3">
      <button type="button" class="btn btn-primary btn-lg w-full" :disabled="placing" @click="place()">
        <span x-show="!placing" class="flex items-center gap-2">${icon('lock', 'size-4')}<span x-text="'Place order · ' + ${P}.money(${P}.total(ship), true)"></span></span>
        <span x-show="placing" class="flex items-center gap-2"><span class="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span> Placing order…</span>
      </button>
    </div>
  </div>
</div>`,
  });
}

export function successPage() {
  return page({
    title: 'Order Confirmed | itDeal Sg', nav: null,
    body: html`
<div class="wrap max-w-2xl py-10 sm:py-16" x-data="{ o: (() => { try { return JSON.parse(localStorage.getItem('itdeal:lastOrder')) } catch { return null } })() }">
  <div class="text-center">
    <span class="mx-auto grid size-20 animate-pop place-items-center rounded-full bg-success text-white shadow-[0_0_0_10px_var(--color-success-50)]">${icon('check', 'size-10', 3)}</span>
    <h1 class="mt-6 text-3xl font-bold tracking-tight">Thank you<span x-show="o?.name" x-text="', ' + o?.name"></span>!</h1>
    <p class="mt-2 text-[15px] text-muted">Your order is confirmed. We’ve emailed the receipt to <b class="text-ink" x-text="o?.email || 'your inbox'"></b>.</p>
    <p class="mt-4 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm">Order no. <b class="font-mono" x-text="o?.no || 'ITD00000000'"></b></p>
  </div>
  <div class="mt-10 rounded-3xl border border-line p-5 sm:p-6">
    <ol class="grid grid-cols-4 gap-2 text-center text-[11.5px] font-medium">
      ${[['check', 'Confirmed', true], ['package', 'Packed', false], ['truck', 'On the way', false], ['home', 'Delivered', false]].map(([ic, t, on], i) => html`
      <li class="relative flex flex-col items-center gap-2 ${on ? 'text-ink' : 'text-muted'}">
        ${i ? `<span class="absolute right-1/2 top-5 -z-10 h-0.5 w-full ${on ? 'bg-success' : 'bg-line'}"></span>` : ''}
        <span class="grid size-10 place-items-center rounded-full ${on ? 'bg-success text-white' : 'bg-surface'}">${icon(ic, 'size-[18px]', 2)}</span>${t}
      </li>`)}
    </ol>
    <div class="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
      <div><p class="text-muted">Delivering to</p><p class="mt-1 font-medium" x-text="o?.address || '—'"></p></div>
      <div><p class="text-muted">Total paid</p><p class="price mt-1 text-lg" x-text="o ? $store.shop.money(o.total, true) : '—'"></p></div>
    </div>
    <ul class="mt-5 space-y-3 border-t border-line pt-5">
      <template x-for="line in (o?.items || [])" :key="line.key">
        <li class="flex items-center gap-3">
          <img :src="$store.shop.img($store.shop.p(line.id).img, 120)" alt="" class="size-14 rounded-xl bg-surface object-cover">
          <span class="flex-1 text-sm"><span class="line-clamp-1 font-medium" x-text="$store.shop.p(line.id).title"></span><span class="text-xs text-muted" x-text="'Qty ' + line.qty"></span></span>
        </li>
      </template>
    </ul>
  </div>
  <div class="mt-6 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
    <a href="account.html#orders" class="btn btn-outline btn-lg">Track order</a>
    <a href="index.html" class="btn btn-dark btn-lg">Continue shopping</a>
  </div>
</div>`,
  });
}
