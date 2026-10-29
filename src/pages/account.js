// Login -> form-login.php, Account -> myaccount/*, Wishlist, Compare, 404, Style guide
import { html, icon, stars } from '../components/html.js';
import { page, logo } from '../components/layout.js';
import { productCard } from '../components/product.js';
import { sectionHead, rail, recentlyViewed, breadcrumb } from '../components/sections.js';
import { products, pick, img, money, IMG } from '../data/catalog.js';

const P = '$store.shop';

/* ---------------- Login / Register */
export function loginPage() {
  const google = '<svg class="size-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.35Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.5c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.59-4.12H3.07v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.91a6 6 0 0 1 0-3.82v-2.6H3.07a10 10 0 0 0 0 9.02l3.34-2.6Z"/><path fill="#EA4335" d="M12 5.97c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.97 9.97 0 0 0 3.07 7.49l3.34 2.6C7.2 7.73 9.4 5.97 12 5.97Z"/></svg>';
  const apple = '<svg class="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76a4.24 4.24 0 0 0-3.58 2.18c-1.53 2.65-.39 6.57 1.1 8.72.73 1.05 1.6 2.23 2.73 2.19 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13a9.4 9.4 0 0 0 1.2-2.47 3.83 3.83 0 0 1-2.3-3.47ZM14.2 6.13A3.82 3.82 0 0 0 15.1 3.4a3.9 3.9 0 0 0-2.52 1.3 3.64 3.64 0 0 0-.92 2.63 3.22 3.22 0 0 0 2.54-1.2Z"/></svg>';
  const perks = [['ticket', 'S$10 off your first order'], ['package', 'Track orders in real time'], ['heart', 'Sync your wishlist across devices'], ['zap', 'Early access to 11.11 & Black Friday']];
  return page({
    title: 'Sign in or create an account | itDeal Sg', nav: 'home',
    body: html`
<div class="wrap py-6 sm:py-12">
  <div class="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-5xl overflow-hidden rounded-[28px] lg:grid-cols-2 lg:border lg:border-line">
    <div class="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
      <img src="${img(IMG.setup, 800, 1000)}" alt="" class="absolute inset-0 size-full object-cover opacity-35">
      <div class="absolute inset-0" style="background:radial-gradient(80% 60% at 100% 0%, rgb(200 0 21 / .55), transparent 60%)"></div>
      <div class="relative"><span class="inline-block rounded-xl bg-white px-3 py-2">${logo('h-7')}</span></div>
      <div class="relative">
        <p class="text-3xl font-bold leading-tight tracking-tight">Members get more.<br>Every single day.</p>
        <ul class="mt-6 space-y-3.5">${perks.map(([ic, t]) => html`<li class="flex items-center gap-3 text-[15px] text-white/85"><span class="grid size-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">${icon(ic, 'size-[18px]')}</span>${t}</li>`)}</ul>
      </div>
    </div>

    <div class="p-1 sm:p-10" x-data="auth">
      <div class="grid grid-cols-2 rounded-full bg-surface p-1 text-sm font-semibold" role="tablist">
        <button type="button" role="tab" class="h-10 rounded-full transition" :class="mode === 'login' ? 'bg-white shadow-sm' : 'text-muted'" @click="mode = 'login'">Sign in</button>
        <button type="button" role="tab" class="h-10 rounded-full transition" :class="mode === 'register' ? 'bg-white shadow-sm' : 'text-muted'" @click="mode = 'register'">Create account</button>
      </div>
      <h1 class="mt-7 text-2xl font-bold tracking-tight" x-text="mode === 'login' ? 'Welcome back' : 'Create your account'">Welcome back</h1>
      <p class="mt-1 text-sm text-muted" x-text="mode === 'login' ? 'Sign in to track orders, save favourites and check out faster.' : 'It takes less than a minute — and you get S$10 off your first order.'"></p>

      <div class="mt-6 grid grid-cols-2 gap-2.5">
        <button type="button" class="btn btn-outline h-12 rounded-xl" @click="submit()">${google} Google</button>
        <button type="button" class="btn btn-outline h-12 rounded-xl" @click="submit()">${apple} Apple</button>
      </div>
      <div class="my-6 flex items-center gap-3 text-xs text-muted"><span class="h-px flex-1 bg-line"></span>or continue with<span class="h-px flex-1 bg-line"></span></div>

      <form class="space-y-4" @submit.prevent="submit()">
        <template x-if="mode === 'register'">
          <div><label for="r-name" class="field-label">Full name</label><input id="r-name" class="input" autocomplete="name" placeholder="e.g. Alex Tan" required></div>
        </template>
        <div class="flex gap-4 text-sm font-medium" x-show="mode === 'login'">
          <label class="flex items-center gap-2"><input type="radio" class="radio" value="email" x-model="via"> Email</label>
          <label class="flex items-center gap-2"><input type="radio" class="radio" value="phone" x-model="via"> Mobile (OTP)</label>
        </div>
        <div x-show="via === 'email' || mode === 'register'">
          <label for="l-email" class="field-label">Email</label>
          <input id="l-email" type="email" class="input" autocomplete="email" placeholder="you@example.com">
        </div>
        <div x-show="via === 'phone' && mode === 'login'" x-cloak>
          <label for="l-phone" class="field-label">Mobile number</label>
          <div class="flex"><span class="grid h-12 place-items-center rounded-l-xl border border-r-0 border-line-2 bg-surface px-3.5 font-medium">+65</span><input id="l-phone" inputmode="tel" class="input rounded-l-none" placeholder="8123 4567"></div>
          <div x-show="otpSent" x-collapse>
            <label class="field-label mt-4">Enter the 6-digit code</label>
            <div class="flex gap-2" x-data @input="$event.target.value && $event.target.nextElementSibling?.focus()">
              ${[...Array(6)].map(() => '<input inputmode="numeric" maxlength="1" class="input h-12 w-full px-0 text-center text-lg font-bold" aria-label="OTP digit">').join('')}
            </div>
            <p class="input-hint">Didn’t get it? <button type="button" class="font-semibold text-ink underline">Resend in 30s</button></p>
          </div>
        </div>
        <div x-show="via === 'email' || mode === 'register'" x-data="{ pw: '' }">
          <div class="flex items-center justify-between"><label for="l-pass" class="field-label">Password</label><a href="#" x-show="mode === 'login'" class="mb-1.5 text-[13px] font-medium text-muted hover:text-ink">Forgot password?</a></div>
          <div class="relative">
            <input id="l-pass" :type="show ? 'text' : 'password'" x-model="pw" class="input pr-12" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" placeholder="••••••••">
            <button type="button" class="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center text-muted" @click="show = !show" :aria-label="show ? 'Hide password' : 'Show password'"><span x-show="!show">${icon('eye', 'size-[18px]')}</span><span x-show="show">${icon('eye-off', 'size-[18px]')}</span></button>
          </div>
          <div x-show="mode === 'register'" class="mt-2">
            <div class="grid grid-cols-4 gap-1.5">${[1, 2, 3, 4].map((n) => html`<span class="h-1 rounded-full transition" :class="(pw.length >= ${n * 3} ? ['bg-brand','bg-warn','bg-success','bg-success'][Math.min(3, Math.floor(pw.length / 3) - 1)] : 'bg-line')"></span>`)}</div>
            <p class="input-hint">Use 8+ characters with a mix of letters and numbers.</p>
          </div>
        </div>
        <label x-show="mode === 'register'" class="flex items-start gap-2.5 text-[13px] text-ink-2"><input type="checkbox" class="check mt-0.5" checked> Send me exclusive deals and launch alerts. Unsubscribe anytime.</label>
        <button type="submit" class="btn btn-dark btn-lg w-full" :disabled="loading" x-show="!(via === 'phone' && mode === 'login' && !otpSent)">
          <span x-show="!loading" x-text="mode === 'login' ? 'Sign in' : 'Create account'"></span>
          <span x-show="loading" class="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
        </button>
        <button type="button" class="btn btn-dark btn-lg w-full" x-show="via === 'phone' && mode === 'login' && !otpSent" x-cloak @click="otpSent = true">Send code</button>
        <p class="text-center text-xs text-muted" x-show="mode === 'register'">By creating an account you agree to our <a href="#" class="underline">Terms</a> and <a href="#" class="underline">Privacy policy</a>.</p>
      </form>
      <ul class="mt-8 grid grid-cols-2 gap-2 lg:hidden">${perks.map(([ic, t]) => html`<li class="flex items-center gap-2 rounded-xl bg-surface p-3 text-xs font-medium">${icon(ic, 'size-4 shrink-0 text-brand')}${t}</li>`)}</ul>
    </div>
  </div>
</div>`,
  });
}

/* ---------------- Account */
const ORDERS = [
  { no: 'ITD28461937', date: '27 Oct 2026', status: 'Out for delivery', tone: 'bg-warn-50 text-warn', step: 3, total: 897, items: [20, 41], eta: 'Arriving today by 6pm' },
  { no: 'ITD27719254', date: '14 Oct 2026', status: 'Delivered', tone: 'bg-success-50 text-success', step: 4, total: 1399, items: [1], eta: 'Delivered on 16 Oct' },
  { no: 'ITD26104488', date: '2 Sep 2026', status: 'Delivered', tone: 'bg-success-50 text-success', step: 4, total: 448, items: [29, 44, 25], eta: 'Delivered on 4 Sep' },
];

function orderCard(o, open = false) {
  return html`
<article class="rounded-3xl border border-line" x-data="{ open: ${String(open)} }">
  <div class="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line px-5 py-4 text-[13px]">
    <div><p class="text-muted">Order</p><p class="font-mono font-semibold">${o.no}</p></div>
    <div><p class="text-muted">Placed</p><p class="font-medium">${o.date}</p></div>
    <div><p class="text-muted">Total</p><p class="price">${money(o.total)}</p></div>
    <span class="badge ${o.tone} ml-auto">${o.status}</span>
  </div>
  <div class="p-5">
    <p class="text-[15px] font-semibold">${o.eta}</p>
    <ul class="mt-4 space-y-3">
      ${pick(...o.items).map((p) => html`<li class="flex items-center gap-3"><img src="${img(p.img, 120)}" alt="" class="size-14 rounded-xl bg-surface object-cover"><a href="product-${p.slug}.html" class="line-clamp-1 flex-1 text-sm font-medium hover:underline">${p.title}</a></li>`)}
    </ul>
    <div x-show="open" x-collapse>
      <ol class="mt-5 space-y-0 border-l-2 border-line pl-5">
        ${['Order confirmed', 'Packed at HarbourFront warehouse', 'Out for delivery with Ninja Van', 'Delivered'].map((t, i) => html`
        <li class="relative pb-4 last:pb-0">
          <span class="absolute -left-[27px] top-0.5 grid size-3.5 place-items-center rounded-full ${i < o.step ? 'bg-success' : 'bg-line-2'} ring-4 ring-white"></span>
          <p class="text-sm font-medium ${i < o.step ? '' : 'text-muted'}">${t}</p>
        </li>`)}
      </ol>
    </div>
    <div class="mt-5 flex flex-wrap gap-2">
      <button type="button" class="btn btn-dark btn-sm" @click="open = !open"><span x-text="open ? 'Hide tracking' : 'Track order'"></span></button>
      <button type="button" class="btn btn-outline btn-sm">Tax invoice</button>
      ${o.step === 4 ? html`<button type="button" class="btn btn-outline btn-sm">Return item</button><button type="button" class="btn btn-ghost btn-sm" @click="${o.items.map((id) => `$store.shop.add(${id}, { silent: true })`).join('; ')}; $store.ui.cart = true">Buy again</button>` : ''}
    </div>
  </div>
</article>`;
}

export function accountPage() {
  const nav = [['overview', 'Overview', 'user'], ['orders', 'Orders', 'package'], ['addresses', 'Addresses', 'pin'], ['payments', 'Payment methods', 'card'], ['profile', 'Profile & security', 'settings']];
  return page({
    title: 'My Account | itDeal Sg', nav: 'home',
    body: html`
<div class="wrap pt-5 sm:pt-8" x-data="{ tab: (location.hash.slice(1) || 'overview') }" @hashchange.window="tab = location.hash.slice(1) || 'overview'">
  <div class="flex items-center gap-4 rounded-3xl bg-ink p-5 text-white sm:p-7">
    <span class="grid size-14 shrink-0 place-items-center rounded-full bg-brand text-lg font-bold sm:size-16">AT</span>
    <div class="min-w-0 flex-1">
      <p class="text-[13px] text-white/60">Good evening,</p>
      <h1 class="truncate text-xl font-bold tracking-tight sm:text-2xl">Alex Tan</h1>
      <p class="truncate text-[13px] text-white/60">alex.tan@example.com · Member since 2024</p>
    </div>
    <a href="login.html" class="hidden items-center gap-2 text-sm font-medium text-white/80 hover:text-white sm:flex">${icon('logout', 'size-4')} Sign out</a>
  </div>

  <div class="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
    <nav class="snap-rail gap-2 lg:mx-0 lg:block lg:space-y-1 lg:self-start lg:px-0" aria-label="Account sections">
      ${nav.map(([k, l, ic]) => html`
      <a href="#${k}" class="chip lg:flex lg:h-11 lg:w-full lg:rounded-xl lg:border-0 lg:px-3.5 lg:text-sm" :class="tab === '${k}' ? 'is-active lg:!bg-surface lg:!text-ink' : 'lg:hover:bg-surface'" >${icon(ic, 'size-4 lg:size-[18px]')} ${l}</a>`)}
      <a href="wishlist.html" class="chip lg:flex lg:h-11 lg:w-full lg:rounded-xl lg:border-0 lg:px-3.5 lg:text-sm lg:hover:bg-surface">${icon('heart', 'size-4 lg:size-[18px]')} Wishlist</a>
      <a href="login.html" class="chip lg:flex lg:h-11 lg:w-full lg:rounded-xl lg:border-0 lg:px-3.5 lg:text-sm lg:text-muted lg:hover:bg-surface">${icon('logout', 'size-4 lg:size-[18px]')} Sign out</a>
    </nav>

    <div class="min-w-0">
      <section x-show="tab === 'overview'">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          ${[['package', 'Orders', '3', '#orders'], ['heart', 'Wishlist', null, 'wishlist.html'], ['ticket', 'Vouchers', '2', '#overview'], ['pin', 'Addresses', null, '#addresses']].map(([ic, t, n, h]) => html`
          <a href="${h}" class="rounded-2xl border border-line p-4 transition hover:border-ink">
            ${icon(ic, 'size-5 text-muted', 1.6)}
            <p class="mt-3 text-2xl font-bold tnum" ${n ? '' : `x-text="${t === 'Addresses' ? P + '.addresses.length' : P + '.wish.length'}"`}>${n || ''}</p>
            <p class="text-[13px] text-muted">${t}</p>
          </a>`)}
        </div>
        <div class="mt-6 flex flex-col gap-4 rounded-3xl bg-brand-50 p-5 sm:flex-row sm:items-center">
          <span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-white">${icon('ticket', 'size-6')}</span>
          <div class="flex-1"><p class="font-semibold">You have 2 vouchers ready to use</p><p class="text-[13px] text-ink-2">MEGA11 — S$111 off orders above S$1,111 · expires 11 Nov</p></div>
          <a href="deals.html" class="btn btn-primary btn-sm">Use now</a>
        </div>
        <h2 class="mb-4 mt-8 text-lg font-bold">Latest order</h2>
        ${orderCard(ORDERS[0], true)}
      </section>

      <section x-show="tab === 'orders'" x-cloak>
        <h2 class="mb-4 text-xl font-bold">Your orders</h2>
        <div class="space-y-4">${ORDERS.map((o) => orderCard(o))}</div>
      </section>

      <!-- Addresses: WooCommerce My Account → Addresses (myaccount/my-address.php + form-edit-address.php) -->
      <section x-show="tab === 'addresses'" x-cloak x-data="{ form: null, blank() { return { id: 0, label: 'Home', name: '', line: '', postal: '', phone: '' } }, err: '' }">
        <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="text-xl font-bold">Delivery addresses</h2>
            <p class="mt-1 text-sm text-muted">Choose where your orders are delivered. Prices and delivery dates update for this address.</p>
          </div>
          <button type="button" class="btn btn-dark btn-sm" x-show="!form" @click="form = blank()">${icon('plus', 'size-4')} Add address</button>
        </div>

        <!-- add / edit form -->
        <form x-show="form" x-cloak x-collapse class="mb-5 rounded-3xl border border-ink p-5" @submit.prevent="err = ''; if (!/^[0-9]{6}$/.test(form.postal)) { err = 'Enter a valid 6-digit postal code'; return } const id = $store.shop.saveAddress(form); $store.shop.selectAddress(id); form = null">
          <template x-if="form">
            <div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <span class="field-label">Save as</span>
                <div class="flex gap-2">
                  <template x-for="l in ['Home', 'Office', 'Other']" :key="l">
                    <button type="button" class="chip" :aria-pressed="form.label === l" @click="form.label = l" x-text="l"></button>
                  </template>
                </div>
              </div>
              <div><label class="field-label" for="ad-name">Full name</label><input id="ad-name" class="input" x-model="form.name" required autocomplete="name"></div>
              <div><label class="field-label" for="ad-phone">Mobile</label><div class="flex"><span class="grid h-12 place-items-center rounded-l-xl border border-r-0 border-line-2 bg-surface px-3.5 font-medium">+65</span><input id="ad-phone" class="input rounded-l-none" x-model="form.phone" inputmode="tel" required></div></div>
              <div><label class="field-label" for="ad-postal">Postal code</label><input id="ad-postal" class="input" x-model="form.postal" inputmode="numeric" maxlength="6" required placeholder="e.g. 238839"></div>
              <div><label class="field-label" for="ad-line">Block, street, unit no.</label><input id="ad-line" class="input" x-model="form.line" required placeholder="e.g. Blk 290 Orchard Road, #12-34"></div>
              <p x-show="err" x-text="err" class="text-xs text-brand sm:col-span-2"></p>
              <div class="flex gap-2 sm:col-span-2">
                <button class="btn btn-dark">Save & deliver here</button>
                <button type="button" class="btn btn-outline" @click="form = null">Cancel</button>
              </div>
            </div>
          </template>
        </form>

        <div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
          <template x-for="a in $store.shop.addresses" :key="a.id">
            <div class="relative rounded-3xl border p-5 transition" :class="$store.shop.addressId === a.id ? 'border-ink ring-1 ring-ink' : 'border-line'">
              <div class="flex items-center gap-2">
                ${icon('pin', 'size-4 text-brand', 2)}
                <p class="font-semibold" x-text="a.label"></p>
                <span x-show="$store.shop.addressId === a.id" class="badge badge-success">Delivering here</span>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-ink-2"><span x-text="a.name"></span><br><span x-text="a.line"></span><br>Singapore <span x-text="a.postal"></span><br>+65 <span x-text="a.phone"></span></p>
              <div class="mt-4 flex flex-wrap items-center gap-4 text-[13px] font-semibold">
                <button type="button" class="btn btn-dark btn-sm" x-show="$store.shop.addressId !== a.id" @click="$store.shop.selectAddress(a.id)">Deliver here</button>
                <button type="button" class="underline underline-offset-4" @click="form = { ...a }; window.scrollTo({ top: $el.closest('section').offsetTop - 160, behavior: 'smooth' })">Edit</button>
                <button type="button" class="text-muted hover:text-brand" @click="$store.shop.removeAddress(a.id)">Remove</button>
              </div>
            </div>
          </template>
          <button type="button" class="grid min-h-[180px] place-items-center rounded-3xl border-2 border-dashed border-line-2 text-sm font-semibold text-muted transition hover:border-ink hover:text-ink" @click="form = blank(); window.scrollTo({ top: $el.closest('section').offsetTop - 160, behavior: 'smooth' })"><span class="flex flex-col items-center gap-2">${icon('plus', 'size-6')} Add new address</span></button>
        </div>
      </section>

      <section x-show="tab === 'payments'" x-cloak>
        <h2 class="mb-4 text-xl font-bold">Payment methods</h2>
        <div class="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
          <div class="relative aspect-[1.6] overflow-hidden rounded-3xl bg-ink p-6 text-white">
            <div class="absolute inset-0" style="background:radial-gradient(80% 80% at 100% 0%, rgb(200 0 21 / .7), transparent 60%)"></div>
            <div class="relative flex h-full flex-col justify-between"><div class="flex justify-between"><span class="text-sm font-bold italic">VISA</span><span class="badge bg-white/15 text-white">Default</span></div><div><p class="font-mono text-lg tracking-widest">•••• •••• •••• 4242</p><p class="mt-1 text-xs text-white/60">ALEX TAN · 09/28</p></div></div>
          </div>
          <div class="flex flex-col justify-between rounded-3xl border border-line p-6">
            <div class="flex items-center gap-3"><span class="grid size-11 place-items-center rounded-xl bg-[#7c1a78] text-white">${icon('qr', 'size-5')}</span><div><p class="font-semibold">PayNow</p><p class="text-[13px] text-muted">Linked to +65 •••• 4567</p></div></div>
            <button type="button" class="btn btn-outline btn-sm mt-6 w-fit">${icon('plus', 'size-4')} Add card</button>
          </div>
        </div>
      </section>

      <section x-show="tab === 'profile'" x-cloak>
        <h2 class="mb-4 text-xl font-bold">Profile & security</h2>
        <form class="grid grid-cols-[minmax(0,1fr)] max-w-2xl gap-4 sm:grid-cols-2" @submit.prevent="$store.ui.toast('Profile saved')">
          <div><label class="field-label" for="p-first">First name</label><input id="p-first" class="input" value="Alex"></div>
          <div><label class="field-label" for="p-last">Last name</label><input id="p-last" class="input" value="Tan"></div>
          <div class="sm:col-span-2"><label class="field-label" for="p-email">Email</label><input id="p-email" type="email" class="input" value="alex.tan@example.com"></div>
          <div class="sm:col-span-2"><label class="field-label" for="p-phone">Mobile</label><div class="flex"><span class="grid h-12 place-items-center rounded-l-xl border border-r-0 border-line-2 bg-surface px-3.5 font-medium">+65</span><input id="p-phone" class="input rounded-l-none" value="8123 4567"></div></div>
          <div class="space-y-3 rounded-2xl bg-surface p-4 sm:col-span-2">
            <p class="text-sm font-semibold">Notifications</p>
            ${[['Order & delivery updates (SMS)', true], ['Deals & launch alerts (email)', true], ['Price-drop alerts for wishlist items', false]].map(([t, on]) => html`
            <label class="flex items-center justify-between text-sm text-ink-2">${t}<span class="relative inline-flex"><input type="checkbox" class="peer sr-only" ${on ? 'checked' : ''}><span class="h-6 w-11 rounded-full bg-line-2 transition peer-checked:bg-ink"></span><span class="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"></span></span></label>`)}
          </div>
          <div class="flex gap-3 sm:col-span-2"><button class="btn btn-dark">Save changes</button><button type="button" class="btn btn-outline">Change password</button></div>
        </form>
      </section>
    </div>
  </div>
</div>
${recentlyViewed()}`,
  });
}

/* ---------------- Wishlist */
export function wishlistPage() {
  return page({
    title: 'Wishlist | itDeal Sg', nav: 'home',
    body: html`
<div class="wrap pt-5 sm:pt-8">
  ${breadcrumb([['Home', 'index.html'], ['Account', 'account.html'], ['Wishlist']])}
  <div class="mt-4 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Wishlist</h1>
      <p class="mt-1 text-sm text-muted"><span x-text="${P}.wish.length"></span> saved items · we’ll let you know when prices drop</p>
    </div>
    <div class="flex gap-2" x-show="${P}.wish.length">
      <button type="button" class="btn btn-outline btn-sm" @click="navigator.clipboard?.writeText(location.href); $store.ui.toast('Wishlist link copied', 'share')">${icon('share', 'size-4')} Share</button>
      <button type="button" class="btn btn-dark btn-sm" @click="${P}.wish.forEach((id, k) => ${P}.add(id, { silent: k < ${P}.wish.length - 1 }))">${icon('bag', 'size-4')} Add all to cart</button>
    </div>
  </div>
  <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 wide:grid-cols-6">
    ${products.map((p) => html`<div x-show="${P}.inWish(${p.id})" x-cloak :style="{ order: ${P}.wish.indexOf(${p.id}) }">${productCard(p)}</div>`)}
  </div>
  <div x-show="!${P}.wish.length" x-cloak class="mx-auto max-w-sm py-16 text-center">
    <span class="mx-auto grid size-20 place-items-center rounded-full bg-surface">${icon('heart', 'size-8 text-muted', 1.5)}</span>
    <h2 class="mt-5 text-xl font-bold tracking-tight">Nothing saved yet</h2>
    <p class="mt-2 text-[15px] text-muted">Tap the heart on any product to save it here. We’ll alert you when it goes on sale.</p>
    <a href="deals.html" class="btn btn-dark mt-6">Explore deals</a>
  </div>
</div>
<section class="wrap section">
  ${sectionHead({ title: 'Trending now', href: 'deals.html' })}
  ${rail(products.filter((p) => p.badge === 'Bestseller').map((p) => productCard(p)))}
</section>`,
  });
}

/* ---------------- Compare */
export function comparePage() {
  return page({
    title: 'Compare Products | itDeal Sg', nav: 'compare', tray: false,
    body: html`
<div class="wrap pt-5 sm:pt-8" x-data="comparePage">
  ${breadcrumb([['Home', 'index.html'], ['Compare']])}
  <div class="mt-4 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Compare products</h1>
      <p class="mt-1 text-sm text-muted" x-text="items.length ? items.length + ' of 4 selected · ' + (window.ITDEAL.categories.find(c => c.slug === $store.shop.compareCat)?.name || '') : 'Select up to 4 products from the same category'"></p>
    </div>
    <div class="flex items-center gap-4" x-show="items.length > 1">
      <label class="flex items-center gap-2.5 text-sm font-medium">
        <span class="relative inline-flex"><input type="checkbox" class="peer sr-only" x-model="diff"><span class="h-6 w-11 rounded-full bg-line-2 transition peer-checked:bg-ink"></span><span class="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"></span></span>
        Only show differences
      </label>
      <button type="button" class="text-sm font-medium text-muted hover:text-ink" @click="$store.shop.clearCompare()">Clear all</button>
    </div>
  </div>

  <div x-show="!items.length" x-cloak class="mx-auto max-w-md py-14 text-center">
    <span class="mx-auto grid size-20 place-items-center rounded-full bg-surface">${icon('compare', 'size-8 text-muted', 1.5)}</span>
    <h2 class="mt-5 text-xl font-bold tracking-tight">Nothing to compare yet</h2>
    <p class="mt-2 text-[15px] text-muted">Tap the ${icon('compare', 'inline size-4 align-[-3px]')} icon on any product, or add one below to start comparing specs side by side.</p>
  </div>

  <div x-show="items.length" class="no-scrollbar -mx-4 mt-6 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
    <div class="grid min-w-full gap-x-3" :style="'grid-template-columns: repeat(' + Math.max(items.length + (items.length < 4 ? 1 : 0), 2) + ', minmax(160px, 1fr))'">
      <!-- product heads -->
      <template x-for="p in items" :key="p.id">
        <div class="relative pb-5">
          <button type="button" class="absolute right-1.5 top-1.5 z-10 grid size-8 place-items-center rounded-full bg-white shadow-sm ring-1 ring-line" aria-label="Remove" @click="$store.shop.toggleCompare(p.id)">${icon('x', 'size-4')}</button>
          <a :href="'product-' + p.slug + '.html'" class="block aspect-square overflow-hidden rounded-2xl bg-surface"><img :src="$store.shop.img(p.img, 400)" :alt="p.name" class="size-full object-cover"></a>
          <p class="mt-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted" x-text="p.brand"></p>
          <a :href="'product-' + p.slug + '.html'" class="mt-0.5 line-clamp-2 min-h-[2.6em] text-sm font-medium leading-snug hover:underline" x-text="p.name"></a>
          <p class="mt-1.5 flex items-center gap-1 text-xs">${stars(5, 'size-3')}<b x-text="p.rating"></b></p>
          <p class="price mt-1.5 text-lg" x-text="$store.shop.money(p.price)"></p>
          <button type="button" class="btn btn-dark btn-sm mt-3 w-full" @click="$store.shop.add(p.id)">Add to cart</button>
        </div>
      </template>
      <a x-show="items.length < 4" :href="'category-' + ($store.shop.compareCat || 'laptops') + '.html'" class="mb-5 grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-line-2 text-center text-sm font-semibold text-muted transition hover:border-ink hover:text-ink">
        <span class="flex flex-col items-center gap-2">${icon('plus', 'size-6')} Add product</span>
      </a>

      <!-- spec rows: label spans the full width so it works on narrow screens -->
      <template x-for="g in groups" :key="g.name">
        <div class="contents">
          <p class="col-span-full mt-6 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-white" x-text="g.name"></p>
          <template x-for="k in g.keys" :key="g.name + k">
            <div class="contents" x-show="!diff || !same(g.name, k)">
              <p class="col-span-full px-1 pb-1 pt-4 text-xs font-semibold text-muted" x-text="k"></p>
              <template x-for="p in items" :key="p.id + k">
                <p class="border-b border-line px-1 pb-3 text-[14px] font-medium" :class="!same(g.name, k) && 'text-ink' || 'text-ink-2'" x-text="val(p, g.name, k)"></p>
              </template>
              <p x-show="items.length < 4" class="border-b border-line"></p>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</div>
<section class="wrap section" x-data="comparePage">
  ${sectionHead({ title: 'Add to compare', sub: 'Popular picks from the same category' })}
  <div class="snap-rail gap-3 lg:grid lg:grid-cols-6 lg:gap-4">
    <template x-for="p in suggestions" :key="p.id">
      <div class="w-[40%] shrink-0 snap-start sm:w-[26%] lg:w-auto">
        <a :href="'product-' + p.slug + '.html'" class="block aspect-square overflow-hidden rounded-2xl bg-surface"><img :src="$store.shop.img(p.img, 300)" :alt="p.name" loading="lazy" class="size-full object-cover"></a>
        <p class="mt-2 line-clamp-2 text-[13px] font-medium leading-snug" x-text="p.title"></p>
        <p class="price mt-1 text-sm" x-text="$store.shop.money(p.price)"></p>
        <button type="button" class="btn btn-outline btn-sm mt-2 w-full" @click="$store.shop.toggleCompare(p.id)">${icon('plus', 'size-4')} Compare</button>
      </div>
    </template>
  </div>
</section>`,
  });
}

/* ---------------- 404 */
export function notFoundPage() {
  return page({
    title: 'Page not found | itDeal Sg', nav: 'home',
    body: html`
<div class="wrap py-16 text-center sm:py-24">
  <p class="text-[96px] font-extrabold leading-none tracking-tighter text-surface-2 sm:text-[160px]">404</p>
  <h1 class="-mt-4 text-2xl font-bold tracking-tight sm:text-3xl">This page took a day off</h1>
  <p class="mx-auto mt-3 max-w-md text-[15px] text-muted">The link may be broken or the product is no longer available. Try searching, or head back home.</p>
  <form action="search.html" class="mx-auto mt-8 flex max-w-md gap-2"><input name="q" class="input" placeholder="Search products"><button class="btn btn-dark h-12">Search</button></form>
  <a href="index.html" class="btn btn-outline mt-4">Back to home</a>
</div>`,
  });
}

/* ---------------- Style guide (handoff for the WordPress build) */
export function styleguidePage() {
  const colors = [['brand', '#C80015'], ['brand-600', '#A90012'], ['brand-50', '#FFF1F2'], ['ink', '#0B0C0F'], ['ink-2', '#23252B'], ['muted', '#646872'], ['subtle', '#9A9EA7'], ['line', '#E6E7EA'], ['surface', '#F4F5F7'], ['success', '#0B7A3E'], ['warn', '#B45309'], ['star', '#F2A516']];
  const sw = { brand: 'bg-brand', 'brand-600': 'bg-brand-600', 'brand-50': 'bg-brand-50', ink: 'bg-ink', 'ink-2': 'bg-ink-2', muted: 'bg-muted', subtle: 'bg-subtle', line: 'bg-line', surface: 'bg-surface', success: 'bg-success', warn: 'bg-warn', star: 'bg-star' };
  return page({
    title: 'Design System | itDeal Sg', nav: 'home', tray: false,
    body: html`
<div class="wrap space-y-14 py-10">
  <header><p class="eyebrow">itDeal Sg</p><h1 class="mt-1 text-4xl font-bold tracking-tight">Design system</h1><p class="mt-2 max-w-xl text-muted">Tokens and components used across every page. Defined in <code class="rounded bg-surface px-1.5 py-0.5 text-sm">src/css/app.css</code> (Tailwind v4 <code class="rounded bg-surface px-1.5 py-0.5 text-sm">@theme</code>).</p></header>
  <section><h2 class="section-title mb-5">Colour</h2><div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">${colors.map(([n, hex]) => html`<div><div class="h-20 rounded-2xl ring-1 ring-black/5 ${sw[n]}"></div><p class="mt-2 text-sm font-semibold">${n}</p><p class="font-mono text-xs text-muted">${hex}</p></div>`)}</div></section>
  <section><h2 class="section-title mb-5">Typography — Inter</h2><div class="space-y-3">
    <p class="text-[56px] font-extrabold leading-none tracking-tight">Display 56</p><p class="text-4xl font-bold tracking-tight">Heading 36</p><p class="section-title">Section title 28</p><p class="text-lg font-semibold">Title 18</p><p class="text-[15px]">Body 15 — The quick brown fox jumps over the lazy dog.</p><p class="text-[13px] text-muted">Caption 13 — supporting text</p><p class="eyebrow">Eyebrow 11</p>
  </div></section>
  <section><h2 class="section-title mb-5">Buttons</h2><div class="flex flex-wrap items-center gap-3"><button class="btn btn-primary">Primary</button><button class="btn btn-dark">Dark</button><button class="btn btn-outline">Outline</button><button class="btn btn-ghost">Ghost</button><button class="btn btn-primary btn-lg">Large</button><button class="btn btn-dark btn-sm">Small</button><button class="btn btn-dark" disabled>Disabled</button></div></section>
  <section><h2 class="section-title mb-5">Chips & badges</h2><div class="flex flex-wrap items-center gap-2"><button class="chip">Default</button><button class="chip" aria-pressed="true">Active</button><span class="badge badge-sale">-27%</span><span class="badge badge-new">New</span><span class="badge badge-soft">Bestseller</span><span class="badge badge-success">In stock</span></div></section>
  <section><h2 class="section-title mb-5">Form controls</h2><div class="grid max-w-xl gap-4"><div><label class="field-label">Input</label><input class="input" placeholder="Placeholder"><p class="input-hint">Helper text</p></div><label class="flex items-center gap-2.5 text-sm"><input type="checkbox" class="check" checked> Checkbox</label><label class="flex items-center gap-2.5 text-sm"><input type="radio" class="radio" checked> Radio</label></div></section>
  <section><h2 class="section-title mb-5">Product card</h2><div class="grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">${pick(1, 20, 32).map((p, i) => productCard(p, { compare: i === 0, deal: i === 1 }))}</div></section>
</div>`,
  });
}
