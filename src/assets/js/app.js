/* itDeal Sg — UI behaviour (Alpine.js 3)
 * Demo state (cart, wishlist, compare, recently viewed) lives in localStorage.
 * In WordPress, swap the `shop` store methods for WooCommerce Store API calls. */

(() => {
  const DATA = window.ITDEAL || { products: [] };
  const byId = Object.fromEntries(DATA.products.map((p) => [p.id, p]));
  const FREE_SHIP = 49;
  const SHIP_FEE = 4.99;
  const COUPONS = {
    ITDEAL10: { type: 'pct', value: 10, cap: 50, label: '10% off, up to S$50' },
    MEGA11: { type: 'flat', value: 111, min: 1111, label: 'S$111 off orders over S$1,111' },
  };

  const store = {
    get(k, d) {
      try { const v = localStorage.getItem('itdeal:' + k); return v ? JSON.parse(v) : d; } catch { return d; }
    },
    set(k, v) {
      try { localStorage.setItem('itdeal:' + k, JSON.stringify(v)); } catch { /* private mode */ }
    },
  };

  // First visit: seed a realistic demo state so every page has something to show
  if (!store.get('seeded', false)) {
    store.set('cart', [
      { key: '1|16GB · 256GB|Sky Blue', id: 1, qty: 1, variant: '16GB · 256GB', color: 'Sky Blue', delta: 0 },
      { key: '22||White', id: 22, qty: 1, variant: '', color: 'White', delta: 0 },
    ]);
    store.set('wish', [20, 32, 12, 39]);
    store.set('recent', [20, 10, 34, 6, 41, 28]);
    store.set('seeded', true);
  }

  const img = (id, w = 400, h = w) =>
    `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&q=75&auto=format`;
  const money = (n, cents = false) =>
    'S$' + Number(n).toLocaleString('en-SG', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
  window.itdeal = { img, money, byId, FREE_SHIP };

  document.addEventListener('alpine:init', () => {
    const Alpine = window.Alpine;

    /* ---------------- UI store: overlays, toasts */
    Alpine.store('ui', {
      menu: false, search: false, cart: false, chat: false, sheet: null,
      added: null, toastMsg: '', toastIcon: 'check', toastOn: false, _t: null,
      toast(msg, icon = 'check') {
        this.toastMsg = msg; this.toastIcon = icon; this.toastOn = true;
        clearTimeout(this._t); this._t = setTimeout(() => (this.toastOn = false), 2600);
      },
      lock() {
        // desktop search is an inline dropdown, so it must not lock scrolling
        return this.menu || (this.search && innerWidth < 1024) || this.cart || this.chat || !!this.sheet;
      },
    });

    /* ---------------- Shop store: cart, wishlist, compare, recent */
    Alpine.store('shop', {
      cart: store.get('cart', []),
      wish: store.get('wish', []),
      compare: store.get('compare', []),
      recent: store.get('recent', []),
      searches: store.get('searches', ['macbook air', 'airpods pro', 'ps5 pro']),
      coupon: store.get('coupon', null),
      // demo account has two saved addresses; none is selected until the visitor picks one
      addresses: store.get('addresses', [
        { id: 1, label: 'Home', name: 'Alex Tan', line: 'Blk 123 Ang Mo Kio Avenue 3, #08-1234', postal: '560123', phone: '8123 4567' },
        { id: 2, label: 'Office', name: 'Alex Tan', line: '290 Orchard Road, #14-01 Paragon', postal: '238859', phone: '8123 4567' },
      ]),
      addressId: store.get('addressId', null),

      p(id) { return byId[id]; },
      img, money,
      persist(k) { store.set(k, this[k]); },

      // cart
      get count() { return this.cart.reduce((a, i) => a + i.qty, 0); },
      unit(i) { return byId[i.id].price + (i.delta || 0); },
      unitMrp(i) { return Math.max(byId[i.id].mrp + (i.delta || 0), this.unit(i)); },
      get subtotal() { return this.cart.reduce((a, i) => a + this.unit(i) * i.qty, 0); },
      get mrpTotal() { return this.cart.reduce((a, i) => a + this.unitMrp(i) * i.qty, 0); },
      get savings() { return this.mrpTotal - this.subtotal; },
      get couponOff() {
        const c = this.coupon && COUPONS[this.coupon];
        if (!c) return 0;
        if (c.type === 'pct') return Math.min(this.subtotal * c.value / 100, c.cap);
        return this.subtotal >= c.min ? c.value : 0;
      },
      get couponLabel() { return this.coupon ? COUPONS[this.coupon]?.label : ''; },
      shipping(method = 'standard') {
        const fees = { standard: this.subtotal >= FREE_SHIP ? 0 : SHIP_FEE, express: 8.9, sameday: 14.9, collect: 0 };
        return this.cart.length ? fees[method] : 0;
      },
      get freeShipLeft() { return Math.max(0, FREE_SHIP - this.subtotal); },
      total(method = 'standard') { return Math.max(0, this.subtotal - this.couponOff + this.shipping(method)); },
      gst(method) { return this.total(method) * 9 / 109; },

      add(id, o = {}) {
        const key = [id, o.variant || '', o.color || ''].join('|');
        const line = this.cart.find((i) => i.key === key);
        if (line) line.qty = Math.min(line.qty + (o.qty || 1), 10);
        else this.cart.unshift({ key, id, qty: o.qty || 1, variant: o.variant || '', color: o.color || '', delta: o.delta || 0 });
        this.persist('cart');
        const ui = Alpine.store('ui');
        ui.added = id;
        if (!o.silent) ui.cart = true;
      },
      setQty(key, q) {
        const line = this.cart.find((i) => i.key === key);
        if (!line) return;
        line.qty = Math.max(1, Math.min(10, q));
        this.persist('cart');
      },
      remove(key) {
        this.cart = this.cart.filter((i) => i.key !== key);
        this.persist('cart');
        Alpine.store('ui').toast('Removed from cart', 'trash');
      },
      saveForLater(key) {
        const line = this.cart.find((i) => i.key === key);
        if (line && !this.wish.includes(line.id)) this.wish.unshift(line.id);
        this.cart = this.cart.filter((i) => i.key !== key);
        this.persist('cart'); this.persist('wish');
        Alpine.store('ui').toast('Moved to wishlist', 'heart');
      },
      applyCoupon(code) {
        code = (code || '').trim().toUpperCase();
        if (!COUPONS[code]) return 'That code isn’t valid. Try ITDEAL10 or MEGA11.';
        if (COUPONS[code].min && this.subtotal < COUPONS[code].min) return `Add ${money(COUPONS[code].min - this.subtotal)} more to use ${code}.`;
        this.coupon = code; this.persist('coupon');
        return '';
      },
      removeCoupon() { this.coupon = null; this.persist('coupon'); },
      clearCart() { this.cart = []; this.coupon = null; this.persist('cart'); this.persist('coupon'); },

      // delivery addresses (WooCommerce: My Account → Addresses; multiple addresses need a plugin)
      get address() { return this.addresses.find((a) => a.id === this.addressId) || null; },
      selectAddress(id) {
        this.addressId = id; this.persist('addressId');
        const a = this.address;
        Alpine.store('ui').toast(`Delivering to ${a.label} · ${a.postal}`, 'pin');
      },
      saveAddress(a) {
        if (a.id) this.addresses = this.addresses.map((x) => (x.id === a.id ? { ...a } : x));
        else { a.id = Date.now(); this.addresses = [...this.addresses, { ...a }]; }
        this.persist('addresses');
        if (!this.addressId) { this.addressId = a.id; this.persist('addressId'); }
        return a.id;
      },
      removeAddress(id) {
        this.addresses = this.addresses.filter((x) => x.id !== id); this.persist('addresses');
        if (this.addressId === id) { this.addressId = this.addresses[0]?.id ?? null; this.persist('addressId'); }
      },

      // wishlist
      inWish(id) { return this.wish.includes(id); },
      toggleWish(id) {
        const on = this.inWish(id);
        this.wish = on ? this.wish.filter((x) => x !== id) : [id, ...this.wish];
        this.persist('wish');
        Alpine.store('ui').toast(on ? 'Removed from wishlist' : 'Saved to wishlist', 'heart');
      },

      // compare (same category only, max 4)
      inCompare(id) { return this.compare.includes(id); },
      get compareCat() { return this.compare.length ? byId[this.compare[0]].cat : null; },
      toggleCompare(id) {
        const ui = Alpine.store('ui');
        if (this.inCompare(id)) {
          this.compare = this.compare.filter((x) => x !== id);
        } else if (this.compareCat && this.compareCat !== byId[id].cat) {
          this.compare = [id];
          ui.toast('Compare list restarted — compare items from one category', 'compare');
        } else if (this.compare.length >= 4) {
          return ui.toast('You can compare up to 4 products', 'info');
        } else {
          this.compare = [...this.compare, id];
          ui.toast('Added to compare', 'compare');
        }
        this.persist('compare');
      },
      clearCompare() { this.compare = []; this.persist('compare'); },

      // recently viewed
      addRecent(id) {
        this.recent = [id, ...this.recent.filter((x) => x !== id)].slice(0, 12);
        this.persist('recent');
      },
      clearRecent() { this.recent = []; this.persist('recent'); },

      addSearch(q) {
        q = q.trim().toLowerCase();
        if (!q) return;
        this.searches = [q, ...this.searches.filter((s) => s !== q)].slice(0, 6);
        this.persist('searches');
      },
      clearSearches() { this.searches = []; this.persist('searches'); },
    });

    // lock page scroll while any overlay is open
    Alpine.effect(() => {
      document.documentElement.classList.toggle('overflow-hidden', Alpine.store('ui').lock());
    });

    /* ---------------- Header: shrink + shadow on scroll */
    Alpine.data('header', () => ({
      scrolled: false,
      init() {
        const on = () => (this.scrolled = window.scrollY > 8);
        on();
        window.addEventListener('scroll', on, { passive: true });
      },
    }));

    /* ---------------- Rotating placeholder in the search field */
    Alpine.data('typer', (words) => ({
      words, i: 0, text: words[0],
      init() { setInterval(() => { this.i = (this.i + 1) % this.words.length; this.text = this.words[this.i]; }, 2800); },
    }));

    /* ---------------- Search with live suggestions */
    Alpine.data('search', () => ({
      q: '',
      get results() {
        const words = this.q.toLowerCase().split(/\s+/).filter(Boolean);
        if (!words.length) return [];
        return DATA.products
          .filter((p) => words.every((w) => (p.brand + ' ' + p.name + ' ' + p.cat + ' ' + p.short).toLowerCase().includes(w)))
          .slice(0, 6);
      },
      go(q = this.q) {
        q = q.trim();
        if (!q) return;
        Alpine.store('shop').addSearch(q);
        location.href = 'search.html?q=' + encodeURIComponent(q);
      },
    }));

    /* ---------------- Carousel (scroll-snap based, swipe friendly) */
    Alpine.data('carousel', (opts = {}) => ({
      i: 0, n: 0, paused: false,
      init() {
        const track = this.$refs.track;
        this.n = track.children.length;
        track.addEventListener('scroll', () => {
          const w = track.firstElementChild.getBoundingClientRect().width;
          this.i = Math.round(track.scrollLeft / (w + parseFloat(getComputedStyle(track).columnGap || 0)));
        }, { passive: true });
        if (opts.autoplay && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setInterval(() => { if (!this.paused && !document.hidden) this.go(this.i + 1 >= this.n ? 0 : this.i + 1); }, opts.autoplay);
        }
      },
      go(k) {
        const track = this.$refs.track;
        const el = track.children[k];
        if (el) track.scrollTo({ left: el.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      },
    }));

    /* ---------------- Horizontal rail arrows (desktop) */
    Alpine.data('rail', () => ({
      start: true, end: false,
      init() {
        const t = this.$refs.track;
        const upd = () => { this.start = t.scrollLeft < 8; this.end = t.scrollLeft + t.clientWidth >= t.scrollWidth - 8; };
        t.addEventListener('scroll', upd, { passive: true });
        new ResizeObserver(upd).observe(t);
        upd();
      },
      by(dir) { const t = this.$refs.track; t.scrollBy({ left: dir * t.clientWidth * 0.85, behavior: 'smooth' }); },
    }));

    /* ---------------- Countdown: target ISO string, or 'midnight' (Singapore time) */
    Alpine.data('countdown', (target) => ({
      d: '00', h: '00', m: '00', s: '00',
      init() { this.tick(); setInterval(() => this.tick(), 1000); },
      end() {
        if (target !== 'midnight') return new Date(target).getTime();
        const now = new Date();
        const sg = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
        const offset = sg.getTime() - now.getTime();
        sg.setHours(24, 0, 0, 0);
        return sg.getTime() - offset;
      },
      tick() {
        const left = Math.max(0, this.end() - Date.now());
        const pad = (n) => String(Math.floor(n)).padStart(2, '0');
        this.d = pad(left / 864e5); this.h = pad((left / 36e5) % 24); this.m = pad((left / 6e4) % 60); this.s = pad((left / 1e3) % 60);
      },
    }));

    /* ---------------- Tabs that filter a server-rendered list by data-tab */
    Alpine.data('tabs', (first = 'all') => ({ tab: first }));

    /* ---------------- Product listing: filter + sort server-rendered cards */
    Alpine.data('listing', (cfg) => ({
      ids: cfg.ids, search: !!cfg.search, q: '',
      brands: [], subs: [], min: '', max: '', rating: 0, discount: 0, inStock: false,
      sort: 'featured', limit: 12, view: 'grid',
      sorts: { featured: 'Featured', 'price-asc': 'Price: Low to High', 'price-desc': 'Price: High to Low', rating: 'Customer rating', discount: 'Biggest discount', newest: 'Newest first' },
      init() {
        if (this.search) this.q = new URLSearchParams(location.search).get('q') || '';
        const deal = new URLSearchParams(location.search).get('sort');
        if (deal && this.sorts[deal]) this.sort = deal;
      },
      text(p) { return (p.brand + ' ' + p.name + ' ' + p.cat + ' ' + p.sub + ' ' + p.short).toLowerCase(); },
      ok(id) {
        const p = byId[id];
        if (this.search) {
          const words = this.q.toLowerCase().split(/\s+/).filter(Boolean);
          if (words.length && !words.every((w) => this.text(p).includes(w))) return false;
        }
        if (this.brands.length && !this.brands.includes(p.brand)) return false;
        if (this.subs.length && !this.subs.includes(p.sub)) return false;
        if (this.min !== '' && p.price < +this.min) return false;
        if (this.max !== '' && p.price > +this.max) return false;
        if (this.rating && p.rating < this.rating) return false;
        if (this.discount && (1 - p.price / p.mrp) * 100 < this.discount) return false;
        if (this.inStock && p.stock < 1) return false;
        return true;
      },
      get matches() { return this.ids.filter((id) => this.ok(id)); },
      get sorted() {
        const off = (p) => 1 - p.price / p.mrp;
        const by = {
          featured: (a, b) => b.sold - a.sold,
          'price-asc': (a, b) => a.price - b.price,
          'price-desc': (a, b) => b.price - a.price,
          rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
          discount: (a, b) => off(b) - off(a),
          newest: (a, b) => (b.badge === 'New') - (a.badge === 'New') || b.id - a.id,
        }[this.sort];
        return this.matches.map((id) => byId[id]).sort(by).map((p) => p.id);
      },
      get order() { const m = {}; this.sorted.forEach((id, i) => (m[id] = i)); return m; },
      show(id) { const o = this.order[id]; return o !== undefined && o < this.limit; },
      pos(id) { return this.order[id] ?? 999; },
      get total() { return this.matches.length; },
      get chips() {
        const c = [];
        this.brands.forEach((b) => c.push({ label: b, clear: () => (this.brands = this.brands.filter((x) => x !== b)) }));
        this.subs.forEach((b) => c.push({ label: b, clear: () => (this.subs = this.subs.filter((x) => x !== b)) }));
        if (this.min !== '' || this.max !== '') c.push({ label: `${this.min !== '' ? money(this.min) : 'S$0'} – ${this.max !== '' ? money(this.max) : 'Any'}`, clear: () => { this.min = ''; this.max = ''; } });
        if (this.rating) c.push({ label: `${this.rating}★ & up`, clear: () => (this.rating = 0) });
        if (this.discount) c.push({ label: `${this.discount}%+ off`, clear: () => (this.discount = 0) });
        if (this.inStock) c.push({ label: 'In stock', clear: () => (this.inStock = false) });
        return c;
      },
      reset() { this.brands = []; this.subs = []; this.min = ''; this.max = ''; this.rating = 0; this.discount = 0; this.inStock = false; },
      setPrice(a, b) { this.min = a; this.max = b; },
    }));

    /* ---------------- Product detail page */
    Alpine.data('pdp', (cfg) => ({
      ...cfg, v: 0, c: 0, qty: 1, slide: 0, zoom: false, zx: 50, zy: 50,
      postal: '', eta: null, postalErr: '', sticky: false,
      init() {
        Alpine.store('shop').addRecent(this.id);
        const cta = this.$refs.cta;
        if (cta) new IntersectionObserver(([e]) => (this.sticky = !e.isIntersecting && e.boundingClientRect.top < 0)).observe(cta);
        const g = this.$refs.gallery;
        if (g) g.addEventListener('scroll', () => (this.slide = Math.round(g.scrollLeft / g.clientWidth)), { passive: true });
      },
      get delta() { return this.variants[this.v][1]; },
      get price() { return this.base + this.delta; },
      get mrpNow() { return Math.max(this.mrp + this.delta, this.price); },
      get save() { return this.mrpNow - this.price; },
      get pct() { return Math.round((this.save / this.mrpNow) * 100); },
      opts() { return { variant: this.variants.length > 1 ? this.variants[this.v][0] : '', color: this.colors[this.c] || '', delta: this.delta, qty: this.qty }; },
      add() { Alpine.store('shop').add(this.id, this.opts()); },
      buy() { Alpine.store('shop').add(this.id, { ...this.opts(), silent: true }); location.href = 'checkout.html'; },
      goSlide(k) { this.slide = k; const g = this.$refs.gallery; g?.scrollTo({ left: k * g.clientWidth, behavior: 'smooth' }); },
      move(e) { const r = e.currentTarget.getBoundingClientRect(); this.zx = ((e.clientX - r.left) / r.width) * 100; this.zy = ((e.clientY - r.top) / r.height) * 100; },
      check() {
        this.postalErr = ''; this.eta = null;
        if (!/^\d{6}$/.test(this.postal)) { this.postalErr = 'Enter a valid 6-digit Singapore postal code'; return; }
        const d = new Date(); d.setDate(d.getDate() + (this.price >= FREE_SHIP ? 2 : 3));
        this.eta = d.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' });
      },
      share() {
        if (navigator.share) navigator.share({ title: document.title, url: location.href }).catch(() => {});
        else navigator.clipboard?.writeText(location.href).then(() => Alpine.store('ui').toast('Link copied', 'share'));
      },
    }));

    /* ---------------- Reviews filter */
    Alpine.data('reviews', () => ({ filter: 'all', lightbox: null }));

    /* ---------------- Compare page */
    Alpine.data('comparePage', () => ({
      diff: false,
      get items() { return Alpine.store('shop').compare.map((id) => byId[id]).filter(Boolean); },
      get groups() {
        const groups = [];
        this.items.forEach((p) => p.specs.forEach(([g, rows]) => {
          let G = groups.find((x) => x.name === g);
          if (!G) groups.push((G = { name: g, keys: [] }));
          rows.forEach(([k]) => !G.keys.includes(k) && G.keys.push(k));
        }));
        return groups;
      },
      val(p, g, k) {
        const grp = p.specs.find(([n]) => n === g);
        const row = grp && grp[1].find(([kk]) => kk === k);
        return row ? row[1] : '—';
      },
      same(g, k) { const v = this.items.map((p) => this.val(p, g, k)); return v.every((x) => x === v[0]); },
      get suggestions() {
        const cat = Alpine.store('shop').compareCat || 'laptops';
        return DATA.products.filter((p) => p.cat === cat && !Alpine.store('shop').inCompare(p.id)).slice(0, 8);
      },
    }));

    /* ---------------- Checkout */
    Alpine.data('checkout', () => ({
      step: 1, ship: 'standard', pay: 'card', billingSame: true, placing: false, code: '', codeErr: '', summaryOpen: false,
      f: { email: '', phone: '', first: '', last: '', postal: '', block: '', street: '', unit: '', building: '', card: '', exp: '', cvc: '', name: '' },
      err: {},
      init() {
        // start from the delivery address picked in the header / account page
        const a = Alpine.store('shop').address;
        if (!a) return;
        const [first, ...rest] = a.name.split(' ');
        Object.assign(this.f, { first, last: rest.join(' '), postal: a.postal, street: a.line, phone: a.phone.replace(/\s/g, '') });
      },
      lookup() {
        // Demo OneMap-style postal lookup
        const demo = { '018956': ['10', 'Bayfront Avenue', 'Marina Bay Sands'], '238839': ['290', 'Orchard Road', 'Paragon'], '560123': ['123', 'Ang Mo Kio Avenue 3', ''] };
        const hit = demo[this.f.postal];
        if (hit) [this.f.block, this.f.street, this.f.building] = hit;
        else if (/^\d{6}$/.test(this.f.postal)) { this.f.block ||= '1'; this.f.street ||= 'Jurong West Street 41'; }
      },
      validate(step) {
        const e = {};
        const f = this.f;
        if (step === 1) {
          if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email';
          if (!/^[689]\d{7}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'Enter an 8-digit Singapore number';
        }
        if (step === 2) {
          if (!f.first.trim()) e.first = 'Required';
          if (!f.last.trim()) e.last = 'Required';
          if (!/^\d{6}$/.test(f.postal)) e.postal = '6-digit postal code';
          if (!f.street.trim()) e.street = 'Required';
        }
        if (step === 4 && this.pay === 'card') {
          if (f.card.replace(/\s/g, '').length < 15) e.card = 'Enter a valid card number';
          if (!/^\d{2}\s?\/\s?\d{2}$/.test(f.exp)) e.exp = 'MM / YY';
          if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = '3–4 digits';
        }
        this.err = e;
        return !Object.keys(e).length;
      },
      next(step) { if (this.validate(step)) { this.step = step + 1; this.$nextTick(() => document.getElementById('step-' + this.step)?.scrollIntoView({ behavior: 'smooth', block: 'start' })); } },
      edit(step) { this.step = step; },
      fmtCard() { this.f.card = this.f.card.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); },
      fmtExp() { const d = this.f.exp.replace(/\D/g, '').slice(0, 4); this.f.exp = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; },
      apply() { this.codeErr = Alpine.store('shop').applyCoupon(this.code); if (!this.codeErr) this.code = ''; },
      place() {
        if (this.step < 4 || !this.validate(4)) return;
        this.placing = true;
        const s = Alpine.store('shop');
        const order = { no: 'ITD' + String(Date.now()).slice(-8), items: s.cart, total: s.total(this.ship), ship: this.ship, pay: this.pay, email: this.f.email, name: this.f.first, address: `${this.f.block} ${this.f.street}${this.f.unit ? ', #' + this.f.unit : ''}, Singapore ${this.f.postal}`, at: Date.now() };
        store.set('lastOrder', order);
        setTimeout(() => { s.clearCart(); location.href = 'order-success.html'; }, 1100);
      },
    }));

    /* ---------------- Auth form */
    Alpine.data('auth', () => ({
      mode: location.hash === '#register' ? 'register' : 'login', via: 'email', show: false, otpSent: false, loading: false,
      submit() { this.loading = true; setTimeout(() => { this.loading = false; location.href = 'account.html'; }, 900); },
    }));

    /* ---------------- Chat (demo assistant) */
    Alpine.data('chat', () => ({
      msg: '', typing: false,
      log: [{ me: false, t: 'Hi there! 👋 I’m Dee from itDeal. How can I help you today?' }],
      quick: ['Track my order', 'Warranty & repairs', 'Return an item', 'Help me choose a laptop'],
      answers: {
        'Track my order': 'Sure! Share your order number (e.g. ITD12345678) and I’ll pull up the live delivery status. You can also see it under Account → Orders.',
        'Warranty & repairs': 'Every product we sell is a genuine local set with at least 1-year Singapore warranty. Need a repair? We arrange free pick-up from your door.',
        'Return an item': 'No problem — unopened items can be returned within 7 days. Go to Account → Orders → Return item, and we’ll schedule a free pick-up.',
        'Help me choose a laptop': 'Happy to help! What will you mainly use it for — study, work, gaming or creative work? And what’s your budget?',
      },
      send(text = this.msg) {
        text = text.trim();
        if (!text) return;
        this.log.push({ me: true, t: text });
        this.msg = ''; this.typing = true;
        this.$nextTick(() => this.scroll());
        setTimeout(() => {
          this.typing = false;
          this.log.push({ me: false, t: this.answers[text] || 'Thanks! A specialist will reply in under 2 minutes. Meanwhile, you can browse our 11.11 deals.' });
          this.$nextTick(() => this.scroll());
        }, 900);
      },
      scroll() { const el = this.$refs.log; if (el) el.scrollTop = el.scrollHeight; },
    }));

    /* ---------------- Hero: wishlist deals tile
       Always shows 4 discounted products; the title says honestly where they come from:
       4+ wishlist items on sale -> "Deals on your wishlist"
       some wishlist items       -> "Deals inspired by your wishlist" (sale items + deals from the same categories)
       empty wishlist            -> "Today's top deals" */
    Alpine.data('wishTile', () => ({
      get data() {
        const s = Alpine.store('shop');
        const pct = (p) => 1 - p.price / p.mrp;
        const deals = DATA.products.filter((p) => p.mrp > p.price).sort((a, b) => pct(b) - pct(a));
        const wish = s.wish.map((id) => byId[id]).filter(Boolean);
        const onSale = wish.filter((p) => p.mrp > p.price);
        if (onSale.length >= 4) return { title: 'Deals on your wishlist', items: onSale.slice(0, 4) };
        if (wish.length) {
          const cats = new Set(wish.map((p) => p.cat));
          const related = deals.filter((p) => cats.has(p.cat) && !onSale.includes(p));
          const rest = deals.filter((p) => !onSale.includes(p) && !related.includes(p));
          return { title: 'Deals inspired by your wishlist', items: [...onSale, ...related, ...rest].slice(0, 4) };
        }
        return { title: 'Today’s top deals', items: deals.slice(0, 4) };
      },
    }));

    /* ---------------- Hero: "Keep shopping for" tile
       Uses the n-th recently viewed product; without history it becomes a "Trending now" bestseller. */
    Alpine.data('keepTile', (n) => ({
      get p() {
        const recent = Alpine.store('shop').recent.map((id) => byId[id]).filter(Boolean);
        if (recent[n]) return recent[n];
        // fill with bestsellers the visitor hasn't just seen in the other tile
        const top = [...DATA.products].sort((a, b) => b.sold - a.sold).filter((p) => !recent.includes(p));
        return top[n - recent.length];
      },
      get title() { return Alpine.store('shop').recent.filter((id) => byId[id])[n] ? 'Keep shopping for' : 'Trending now'; },
    }));

    /* ---------------- Newsletter */
    Alpine.data('newsletter', () => ({
      email: '', done: false, err: '',
      submit() { if (!/^\S+@\S+\.\S+$/.test(this.email)) { this.err = 'Please enter a valid email'; return; } this.err = ''; this.done = true; },
    }));
  });
})();
