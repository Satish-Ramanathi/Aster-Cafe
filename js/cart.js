/* ==========================================================================
   ASTER CAFE — CART ENGINE v1.0
   Features: Cart drawer, dietary filters, stock tracking, upsell bundling,
             loyalty points, experience add-ons, checkout with payment UI,
             shoppable Instagram feed, catering portal
   ========================================================================== */

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// RAZORPAY CONFIGURATION
// Replace with your actual Razorpay Key ID from https://dashboard.razorpay.com
// Mode: 'rzp_test_...' for testing, 'rzp_live_...' for production
// NOTE: You MUST provide your Key ID — Aster Cafe cannot take live payments
// without a registered Razorpay account (razorpay.com/in/business-account).
// ─────────────────────────────────────────────────────────────────────────────
const RAZORPAY_KEY_ID = 'rzp_test_REPLACE_WITH_YOUR_KEY'; // ← PASTE YOUR KEY HERE

// ── PRODUCT CATALOG ──────────────────────────────────────────────────────────
const CATALOG = {
  /* ── Coffee & Drinks ── */
  'drk-001': { id:'drk-001', name:'Signature Rose Latte',    price:220, category:'drinks', img:'assets/images/menu-coffee.jpg', tags:['bestseller'],         stock:20, rating:4.9, ratingCount:142, points:22, description:'Velvety espresso blended with house-made rose syrup and oat milk.' },
  'drk-002': { id:'drk-002', name:'Golden Turmeric Latte',   price:195, category:'drinks', img:'assets/images/menu-coffee.jpg', tags:['vegan'],              stock:15, rating:4.7, ratingCount:89,  points:20, description:'Warming spiced turmeric, coconut milk, ginger.' },
  'drk-003': { id:'drk-003', name:'Iced Matcha Latte',       price:240, category:'drinks', img:'assets/images/menu-coffee.jpg', tags:['vegan','new'],        stock:12, rating:4.8, ratingCount:61,  points:24, description:'Ceremonial grade Japanese matcha over hand-chipped ice.' },
  'drk-004': { id:'drk-004', name:'24hr Cold Brew',          price:210, category:'drinks', img:'assets/images/menu-coffee.jpg', tags:['gf'],                 stock:8,  rating:4.9, ratingCount:97,  points:21, description:'Slow-steeped 24 hours. Smooth, bold, naturally sweet.' },
  'drk-005': { id:'drk-005', name:'Single Origin Espresso',  price:120, category:'drinks', img:'assets/images/menu-coffee.jpg', tags:[],                     stock:30, rating:5.0, ratingCount:203, points:12, description:'Coorg estate espresso. Rich chocolate and citrus notes.' },
  'drk-006': { id:'drk-006', name:'Garden Fizz Mocktail',    price:175, category:'drinks', img:'assets/images/menu-coffee.jpg', tags:['vegan'],              stock:18, rating:4.6, ratingCount:44,  points:18, description:'Hibiscus syrup, fresh lime, cucumber ribbons, sparkling water.' },
  /* ── Brunch & Mains ── */
  'fod-001': { id:'fod-001', name:'Aster Shakshuka',         price:380, category:'food',   img:'assets/images/menu-meals.jpg',  tags:['bestseller','vegan'], stock:10, rating:4.9, ratingCount:178, points:38, description:'Free-range eggs in spiced tomato sauce with sourdough.' },
  'fod-002': { id:'fod-002', name:'Smashed Avo Toast',       price:340, category:'food',   img:'assets/images/menu-meals.jpg',  tags:['vegan'],              stock:14, rating:4.7, ratingCount:122, points:34, description:'Hass avocado, microgreens, cherry tomatoes, chilli oil.' },
  'fod-003': { id:'fod-003', name:'Truffle Mushroom Pasta',  price:450, category:'food',   img:'assets/images/menu-meals.jpg',  tags:['new'],                stock:6,  rating:4.8, ratingCount:38,  points:45, description:'Hand-rolled tagliatelle, wild mushrooms, black truffle oil.' },
  'fod-004': { id:'fod-004', name:'Herb Grilled Chicken Bowl',price:420,category:'food',   img:'assets/images/menu-meals.jpg',  tags:['gf'],                 stock:9,  rating:4.6, ratingCount:55,  points:42, description:'Sumac chicken, herbed quinoa, tahini, pomegranate.' },
  'fod-005': { id:'fod-005', name:'Gourmet Grilled Cheese',  price:280, category:'food',   img:'assets/images/menu-meals.jpg',  tags:[],                     stock:16, rating:4.5, ratingCount:91,  points:28, description:'Aged cheddar, gruyère, caramelised onion, sourdough.' },
  'fod-006': { id:'fod-006', name:'Botanical Garden Salad',  price:295, category:'food',   img:'assets/images/menu-meals.jpg',  tags:['vegan','gf'],         stock:20, rating:4.4, ratingCount:47,  points:30, description:'Seasonal greens, edible flowers, candied walnuts, watermelon.' },
  /* ── Artisan Bakery ── */
  'bkr-001': { id:'bkr-001', name:'Classic Butter Croissant',price:120, category:'bakery', img:'assets/images/menu-pastries.jpg',tags:['bestseller'],        stock:3,  rating:5.0, ratingCount:234, points:12, description:'72-hour slow-fermented dough. AOP French butter.' },
  'bkr-002': { id:'bkr-002', name:'Cardamom Cinnamon Roll', price:165, category:'bakery', img:'assets/images/menu-pastries.jpg',tags:['new'],               stock:5,  rating:4.9, ratingCount:88,  points:17, description:'Pillowy brioche, cardamom and cinnamon, cream cheese glaze.' },
  'bkr-003': { id:'bkr-003', name:'Almond Frangipane Croissant',price:185,category:'bakery',img:'assets/images/menu-pastries.jpg',tags:['nuts'],            stock:4,  rating:4.8, ratingCount:63,  points:19, description:'Day-old croissant filled with almond cream, caramelised.' },
  'bkr-004': { id:'bkr-004', name:'Lavender Shortbread',    price:95,  category:'bakery', img:'assets/images/menu-pastries.jpg',tags:['vegan'],             stock:8,  rating:4.7, ratingCount:52,  points:10, description:'Buttery shortbread with culinary lavender, vanilla, purple sugar.' },
  'bkr-005': { id:'bkr-005', name:'Cardamom Streusel Muffin',price:130,category:'bakery', img:'assets/images/menu-pastries.jpg',tags:[],                    stock:6,  rating:4.6, ratingCount:71,  points:13, description:'Moist spiced muffin with oat streusel top.' },
  'bkr-006': { id:'bkr-006', name:'Walnut Banana Bread',    price:145, category:'bakery', img:'assets/images/menu-pastries.jpg',tags:['vegan','nuts'],      stock:7,  rating:4.8, ratingCount:96,  points:15, description:'Dense moist banana bread with toasted walnuts, dark chocolate.' },
  /* ── Experience Add-ons ── */
  'xtr-001': { id:'xtr-001', name:'Custom Celebration Cake', price:1200, category:'addon', img:'assets/images/service-birthday.jpg', tags:[], stock:99, rating:5.0, ratingCount:45, points:120, description:'3-tier custom cake with personalised decoration (48hr notice).' },
  'xtr-002': { id:'xtr-002', name:'Floral Centrepiece',      price:650,  category:'addon', img:'assets/images/service-bridal.jpg',   tags:[], stock:99, rating:4.9, ratingCount:31, points:65, description:'Fresh seasonal floral arrangement for your table or event.' },
  'xtr-003': { id:'xtr-003', name:'Photography Package',     price:1800, category:'addon', img:'assets/images/service-bridal.jpg',   tags:[], stock:99, rating:4.8, ratingCount:22, points:180, description:'2-hour event photography by our in-house photographer.' },
  'xtr-004': { id:'xtr-004', name:'Premium Coffee Bean Bag (250g)', price:480, category:'subscription', img:'assets/images/menu-coffee.jpg', tags:[], stock:50, rating:4.9, ratingCount:67, points:48, description:'Single-origin Coorg beans, freshly roasted. Free delivery.' },
};

/* Upsell pairing rules: key = added item category, value = suggested ids */
const UPSELL_RULES = {
  'drinks': ['bkr-001','bkr-002','bkr-004'],
  'food':   ['drk-001','drk-005'],
  'bakery': ['drk-001','drk-003'],
};

// ── STATE ────────────────────────────────────────────────────────────────────
const CartState = {
  items: [],          // { id, qty }
  loyaltyPoints: parseInt(localStorage.getItem('aster_loyalty') || '0', 10),
  activeFilters: [],  // ['vegan','gf','nuts','bestseller']
  cartOpen: false,
  checkoutStep: 1,    // 1=cart, 2=addons, 3=payment, 4=success
  selectedPayment: 'upi',
  lastAddedCategory: null,

  get total() {
    return this.items.reduce((sum, item) => {
      const p = CATALOG[item.id];
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  },
  get totalPoints() {
    return this.items.reduce((sum, item) => {
      const p = CATALOG[item.id];
      return sum + (p ? p.points * item.qty : 0);
    }, 0);
  },
  get itemCount() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  },

  addItem(id, qty = 1) {
    if (!CATALOG[id]) return false;
    const stock = CATALOG[id].stock;
    const existing = this.items.find(i => i.id === id);
    const currentQty = existing ? existing.qty : 0;
    if (currentQty + qty > stock) return false;

    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ id, qty });
    }
    this.lastAddedCategory = CATALOG[id].category;
    this.save();
    return true;
  },

  removeItem(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  },

  updateQty(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    const newQty = item.qty + delta;
    if (newQty <= 0) { this.removeItem(id); return; }
    const stock = CATALOG[id]?.stock || 99;
    item.qty = Math.min(newQty, stock);
    this.save();
  },

  clearCart() {
    this.items = [];
    this.save();
  },

  save() {
    localStorage.setItem('aster_cart', JSON.stringify(this.items));
    localStorage.setItem('aster_loyalty', this.loyaltyPoints);
  },

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem('aster_cart') || '[]');
      this.items = saved.filter(i => CATALOG[i.id]);
    } catch (_) { this.items = []; }
  },

  awardPoints(pts) {
    this.loyaltyPoints += pts;
    localStorage.setItem('aster_loyalty', this.loyaltyPoints);
  }
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) html += '<span class="mstar full">★</span>';
    else if (i === full && half) html += '<span class="mstar half">★</span>';
    else html += '<span class="mstar empty">★</span>';
  }
  return html;
}

function formatPrice(p) { return '₹' + p.toLocaleString('en-IN'); }

function getStockLabel(stock) {
  if (stock <= 3)  return `<span class="stock-badge stock-critical">Only ${stock} left!</span>`;
  if (stock <= 6)  return `<span class="stock-badge stock-low">Only ${stock} left</span>`;
  if (stock <= 10) return `<span class="stock-badge stock-med">${stock} available</span>`;
  return '';
}

function matchesFilters(tags, filters) {
  if (!filters.length) return true;
  return filters.every(f => tags.includes(f));
}

// ── CART DRAWER RENDERER ─────────────────────────────────────────────────────
function renderCartDrawer() {
  const list      = document.getElementById('cartItemsList');
  const emptyEl   = document.getElementById('cartEmpty');
  const footerEl  = document.getElementById('cartFooter');
  const badge     = document.getElementById('cartBadge');
  const cartCount = document.getElementById('cartItemCount');
  const totalEl   = document.getElementById('cartTotal');
  const pointsEl  = document.getElementById('cartPointsEarn');

  // ── Badge ─────────────────────────────────────────────────────────────────
  if (badge) {
    badge.textContent = CartState.itemCount > 0 ? CartState.itemCount : '';
    badge.style.display = CartState.itemCount > 0 ? 'flex' : 'none';
  }

  if (!list) return;

  // ── EMPTY STATE ───────────────────────────────────────────────────────────
  if (!CartState.items.length) {
    list.innerHTML = '';
    // Force show empty, force hide footer — override any inline styles
    if (emptyEl)  emptyEl.style.display  = 'flex';
    if (footerEl) footerEl.style.display = 'none';
    if (cartCount) cartCount.textContent = '0 items';
    return;
  }

  // ── HAS ITEMS ─────────────────────────────────────────────────────────────
  // Force hide empty state, force show footer
  if (emptyEl)  emptyEl.style.display  = 'none';
  if (footerEl) footerEl.style.display = '';
  if (cartCount) cartCount.textContent = `${CartState.itemCount} item${CartState.itemCount !== 1 ? 's' : ''}`;

  list.innerHTML = CartState.items.map(({ id, qty }) => {
    const p = CATALOG[id];
    if (!p) return '';
    const maxed = (p.stock - qty) <= 0;
    return `
    <div class="cart-item" data-id="${id}">
      <img src="${p.img}" alt="${p.name}" class="cart-item-img" loading="lazy">
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        ${p.stock <= 6 ? `<div class="cart-item-stock-warn">Only ${p.stock} in stock</div>` : ''}
        <div class="cart-item-rating">${renderStars(p.rating)} <span>(${p.ratingCount})</span></div>
        <div class="cart-item-price">${formatPrice(p.price * qty)}</div>
        <div class="cart-item-pts">+${p.points * qty} pts</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-qty-btn" data-action="dec" data-id="${id}" aria-label="Decrease">−</button>
        <span class="cart-qty-num">${qty}</span>
        <button class="cart-qty-btn${maxed ? ' disabled' : ''}" data-action="inc" data-id="${id}" aria-label="Increase"${maxed ? ' disabled' : ''}>+</button>
        <button class="cart-remove-btn" data-id="${id}" aria-label="Remove item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  if (totalEl)  totalEl.textContent  = formatPrice(CartState.total);
  if (pointsEl) pointsEl.textContent = `+${CartState.totalPoints} loyalty points on this order`;

  // Combo savings banner
  const savingsEl = document.getElementById('cartSavings');
  if (savingsEl) {
    const hasDrink  = CartState.items.some(i => CATALOG[i.id]?.category === 'drinks');
    const hasBakery = CartState.items.some(i => CATALOG[i.id]?.category === 'bakery');
    if (hasDrink && hasBakery) {
      savingsEl.textContent    = 'Combo discount applied: −₹30 🎉';
      savingsEl.style.display  = 'block';
    } else {
      savingsEl.style.display  = 'none';
    }
  }
}

// ── DIETARY FILTER RENDERER ──────────────────────────────────────────────────
function applyDietaryFilters() {
  const filters = CartState.activeFilters;
  document.querySelectorAll('.menu-card[data-item-id]').forEach(card => {
    const rawTags = card.dataset.tags || '';
    const tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);
    const visible = matchesFilters(tags, filters);
    card.classList.toggle('menu-card-hidden', !visible);
  });
}

// ── UPSELL POPUP ─────────────────────────────────────────────────────────────
let upsellShownThisSession = false;
function maybeShowUpsell(addedCategory) {
  if (upsellShownThisSession) return;
  const suggestions = UPSELL_RULES[addedCategory];
  if (!suggestions) return;

  // Don't upsell if we already have a suggested item in cart
  const alreadyHas = suggestions.some(id => CartState.items.find(i => i.id === id));
  if (alreadyHas) return;

  const pick = CATALOG[suggestions[Math.floor(Math.random() * suggestions.length)]];
  if (!pick) return;

  const popup = document.getElementById('upsellPopup');
  const img   = document.getElementById('upsellImg');
  const name  = document.getElementById('upsellName');
  const desc  = document.getElementById('upsellDesc');
  const price = document.getElementById('upsellPrice');
  const saveEl = document.getElementById('upsellSave');
  if (!popup) return;

  if (img)   img.src = pick.img;
  if (name)  name.textContent = pick.name;
  if (desc)  desc.textContent = pick.description;
  if (price) price.textContent = formatPrice(pick.price);
  if (saveEl) saveEl.textContent = addedCategory === 'drinks' ? 'Add to combo & save ₹30' : 'Add to your order';

  popup.dataset.suggestId = pick.id;
  popup.classList.add('active');
  upsellShownThisSession = true;

  setTimeout(() => { popup.classList.remove('active'); }, 8000);
}

// ── CHECKOUT RENDERER ─────────────────────────────────────────────────────────
function renderCheckoutSummary() {
  const summaryEl = document.getElementById('checkoutSummary');
  if (!summaryEl) return;
  summaryEl.innerHTML = CartState.items.map(({ id, qty }) => {
    const p = CATALOG[id]; if (!p) return '';
    return `<div class="chk-summary-row">
      <span>${p.name} × ${qty}</span>
      <span>${formatPrice(p.price * qty)}</span>
    </div>`;
  }).join('') + `
  <div class="chk-summary-row chk-summary-total">
    <span>Total</span>
    <span>${formatPrice(CartState.total)}</span>
  </div>`;
}

function openCheckout() {
  CartState.checkoutStep = 1;
  renderCheckoutSummary();
  showCheckoutStep(1);

  const modal = document.getElementById('checkoutModal');
  if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
}

function showCheckoutStep(step) {
  CartState.checkoutStep = step;
  [1,2,3,4].forEach(s => {
    const el = document.getElementById(`chkStep${s}`);
    if (el) el.classList.toggle('chk-step-active', s === step);
  });

  // Update step dots
  document.querySelectorAll('.chk-step-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i + 1 <= step);
    dot.classList.toggle('current', i + 1 === step);
  });

  const nextBtn = document.getElementById('chkNextBtn');
  const backBtn = document.getElementById('chkBackBtn');
  const foot    = document.getElementById('checkoutFoot');

  if (step === 4) {
    if (foot) foot.style.display = 'none';
  } else {
    if (foot) foot.style.display = '';
    if (nextBtn) nextBtn.textContent = step === 3 ? 'Place Order →' : 'Continue →';
    if (backBtn) backBtn.style.display = step === 1 ? 'none' : '';
  }
}

// ── LOYALTY TOAST ────────────────────────────────────────────────────────────
function showLoyaltyToast(pts) {
  const toast = document.getElementById('loyaltyToast');
  const toastPts = document.getElementById('toastPoints');
  const toastTotal = document.getElementById('toastTotalPoints');
  if (!toast) return;
  if (toastPts)   toastPts.textContent   = pts;
  if (toastTotal) toastTotal.textContent = CartState.loyaltyPoints;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 3500);
}

// ── ADD TO CART (main entry point) ────────────────────────────────────────────
function addToCart(id, qty = 1) {
  const product = CATALOG[id];
  if (!product) return;

  const success = CartState.addItem(id, qty);
  if (!success) {
    showStockToast(product.name, product.stock);
    return;
  }

  renderCartDrawer();
  updateMenuCardButton(id);
  showAddedFeedback(id);
  maybeShowUpsell(product.category);

  // Auto-open cart drawer briefly
  openCartDrawer();
}

function showStockToast(name, stock) {
  const el = document.getElementById('stockToast');
  const msg = document.getElementById('stockToastMsg');
  if (!el) return;
  if (msg) msg.textContent = stock === 0 ? `${name} is sold out today.` : `Only ${stock} of ${name} available.`;
  el.classList.add('active');
  setTimeout(() => el.classList.remove('active'), 3000);
}

function showAddedFeedback(id) {
  const btn = document.querySelector(`[data-add-id="${id}"]`);
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added!`;
  btn.style.background = 'var(--clr-sage)';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 1800);
}

function updateMenuCardButton(id) {
  const qty = CartState.items.find(i => i.id === id)?.qty || 0;
  const counter = document.querySelector(`[data-cart-counter="${id}"]`);
  if (counter) counter.textContent = qty > 0 ? `${qty} in cart` : '';
}

// ── CART DRAWER OPEN/CLOSE ────────────────────────────────────────────────────
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.add('open');
  backdrop?.classList.add('open');
  document.body.style.overflow = 'hidden';
  CartState.cartOpen = true;
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  drawer?.classList.remove('open');
  backdrop?.classList.remove('open');
  document.body.style.overflow = '';
  CartState.cartOpen = false;
}

// ── GENERATE ORDER FOR WHATSAPP ───────────────────────────────────────────────
function buildOrderWhatsApp(payment, chkName, chkPhone, chkTime) {
  const itemLines = CartState.items.map(({ id, qty }) => {
    const p = CATALOG[id]; if (!p) return '';
    return `  • ${p.name} × ${qty} — ${formatPrice(p.price * qty)}`;
  }).join('\n');

  const refCode = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  return {
    refCode,
    msg: encodeURIComponent(
      `🛍️ *New Aster Order* — ${refCode}\n\n` +
      `👤 Name: ${chkName}\n` +
      `📞 Phone: ${chkPhone}\n` +
      `🕐 Pickup: ${chkTime || 'ASAP'}\n` +
      `💳 Payment: ${payment}\n\n` +
      `📋 *Order Items:*\n${itemLines}\n\n` +
      `💰 *Total: ${formatPrice(CartState.total)}*\n` +
      `⭐ Points to earn: +${CartState.totalPoints}`
    )
  };
}

// ── EVENT SETUP ───────────────────────────────────────────────────────────────
function initCart() {
  CartState.load();
  renderCartDrawer();
  injectMenuCards();
  initDietaryFilters();
  initCartDrawerEvents();
  initCheckoutEvents();
  initUpsellEvents();
  initShoppableFeed();
  initLoyaltyDisplay();
  initExperienceAddons();
  renderCartDrawer();
}

// ── INJECT UPDATED MENU CARDS ─────────────────────────────────────────────────
function injectMenuCards() {
  const panels = [
    { panelId: 'coffeeTab',   items: ['drk-001','drk-002','drk-003','drk-004','drk-005','drk-006'] },
    { panelId: 'foodTab',     items: ['fod-001','fod-002','fod-003','fod-004','fod-005','fod-006'] },
    { panelId: 'pastriesTab', items: ['bkr-001','bkr-002','bkr-003','bkr-004','bkr-005','bkr-006'] },
  ];

  panels.forEach(({ panelId, items }) => {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    const grid = panel.querySelector('.menu-grid');
    if (!grid) return;

    grid.innerHTML = items.map((id, idx) => {
      const p = CATALOG[id];
      if (!p) return '';
      const delay = idx % 3 + 1;
      const stockLabel = getStockLabel(p.stock);
      const tagHtml = p.tags.slice(0, 2).map(t => {
        const labels = { vegan:'Vegan', gf:'Gluten-Free', nuts:'Contains Nuts', bestseller:'Best Seller', new:'New' };
        const cls    = { vegan:'tag-vegan', gf:'tag-gf', nuts:'tag-nuts', bestseller:'tag-bestseller', new:'tag-new' };
        return `<span class="menu-tag ${cls[t] || ''}">${labels[t] || t}</span>`;
      }).join('');

      return `
      <article class="menu-card fade-up-element delay-${delay}" data-item-id="${id}" data-tags="${p.tags.join(',')}">
        <div class="menu-card-img-wrapper">
          <img src="${p.img}" alt="${p.name}" class="menu-card-img" loading="lazy">
          <div class="menu-card-tags">${tagHtml}</div>
          ${stockLabel ? `<div class="stock-badge-wrapper">${stockLabel}</div>` : ''}
        </div>
        <div class="menu-card-body">
          <h3 class="menu-card-title">${p.name}</h3>
          <div class="menu-card-rating">${renderStars(p.rating)} <span class="menu-card-rating-count">(${p.ratingCount})</span></div>
          <p class="menu-card-desc">${p.description}</p>
          <div class="menu-card-footer">
            <div>
              <span class="menu-card-price">${formatPrice(p.price)}</span>
              <div class="menu-card-pts-badge">+${p.points} pts</div>
            </div>
            <button class="menu-card-add-btn" data-add-id="${id}" aria-label="Add ${p.name} to cart">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add to Cart
            </button>
          </div>
          <div class="cart-item-counter" data-cart-counter="${id}"></div>
        </div>
      </article>`;
    }).join('');

    // Re-attach scroll reveal
    grid.querySelectorAll('.fade-up-element').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  });

  // Delegate add-to-cart clicks
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add-id]');
    if (btn) { e.preventDefault(); addToCart(btn.dataset.addId); }
  });
}

// ── DIETARY FILTERS ───────────────────────────────────────────────────────────
function initDietaryFilters() {
  const bar = document.getElementById('dietaryFilterBar');
  if (!bar) return;

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.dietary-btn');
    if (!btn) return;
    const filter = btn.dataset.filter;
    const idx = CartState.activeFilters.indexOf(filter);
    if (idx === -1) {
      CartState.activeFilters.push(filter);
      btn.classList.add('active');
    } else {
      CartState.activeFilters.splice(idx, 1);
      btn.classList.remove('active');
    }
    applyDietaryFilters();
  });
}

// ── CART DRAWER EVENTS ────────────────────────────────────────────────────────
function initCartDrawerEvents() {
  document.getElementById('cartOpenBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartBackdrop')?.addEventListener('click', closeCartDrawer);

  const list = document.getElementById('cartItemsList');
  list?.addEventListener('click', e => {
    const dec = e.target.closest('[data-action="dec"]');
    const inc = e.target.closest('[data-action="inc"]');
    const rem = e.target.closest('.cart-remove-btn');
    if (dec) { CartState.updateQty(dec.dataset.id, -1); renderCartDrawer(); }
    if (inc) { CartState.updateQty(inc.dataset.id,  1); renderCartDrawer(); }
    if (rem) { CartState.removeItem(rem.dataset.id);    renderCartDrawer(); }
  });

  document.getElementById('cartCheckoutBtn')?.addEventListener('click', () => {
    if (!CartState.items.length) return;
    closeCartDrawer();
    openCheckout();
  });

  document.getElementById('cartClearBtn')?.addEventListener('click', () => {
    CartState.clearCart();
    renderCartDrawer();
  });
}

// ── RAZORPAY PAYMENT INTEGRATION ─────────────────────────────────────────────
function launchRazorpay({ chkName, chkPhone, chkTime }) {
  // Validate Razorpay is loaded
  if (typeof Razorpay === 'undefined') {
    showRazorpayFallback(chkName, chkPhone, chkTime);
    return;
  }

  const orderTotal   = CartState.total;
  const pointsToEarn = CartState.totalPoints;

  // Build order snapshot before clearing cart
  const { refCode, msg } = buildOrderWhatsApp(CartState.selectedPayment, chkName, chkPhone, chkTime);

  const options = {
    key:         RAZORPAY_KEY_ID,
    amount:      orderTotal * 100,   // Razorpay expects paise (1 INR = 100 paise)
    currency:    'INR',
    name:        'Aster Cafe & Kitchen',
    description: `Order ${refCode} — ${CartState.itemCount} item(s) · Pickup: ${chkTime || 'ASAP'}`,
    image:       'assets/images/logo.png',

    // ── Pre-fill customer details ──────────────────────────────────────────
    prefill: {
      name:    chkName,
      contact: chkPhone,
    },

    // ── Brand theming ──────────────────────────────────────────────────────
    theme: {
      color:       '#C9714B',    // Aster terracotta brand color
      backdrop_color: 'rgba(44,24,16,0.72)',
    },

    // ── Notes stored on Razorpay dashboard ────────────────────────────────
    notes: {
      ref_code:    refCode,
      pickup_time: chkTime || 'ASAP',
      items_count: CartState.itemCount,
    },

    // ── Modal settings ─────────────────────────────────────────────────────
    modal: {
      confirm_close: true,
      escape:        true,
      animation:     true,
      ondismiss: function() {
        // User closed Razorpay without paying — keep cart intact
        console.info('[Aster Cart] Razorpay payment dismissed by user.');
      },
    },

    // ── Payment methods to enable ──────────────────────────────────────────
    config: {
      display: {
        blocks: {
          banks: { name: 'UPI & Net Banking', instruments: [{ method: 'upi' }, { method: 'netbanking' }] },
          cards: { name: 'Cards',             instruments: [{ method: 'card' }] },
          wallets: { name: 'Wallets',         instruments: [{ method: 'wallet' }] },
        },
        sequence: ['block.banks', 'block.cards', 'block.wallets'],
        preferences: { show_default_blocks: true },
      },
    },

    // ── SUCCESS HANDLER ────────────────────────────────────────────────────
    handler: function(response) {
      const paymentId = response.razorpay_payment_id;

      // Show step 4 success
      showCheckoutStep(4);
      const refEl = document.getElementById('chkRefCode');
      const ptsEl = document.getElementById('chkEarnedPts');
      const payEl = document.getElementById('chkPaymentId');
      if (refEl) refEl.textContent = refCode;
      if (ptsEl) ptsEl.textContent = pointsToEarn;
      if (payEl) payEl.textContent = paymentId;

      // Award loyalty points
      CartState.awardPoints(pointsToEarn);
      initLoyaltyDisplay();
      showLoyaltyToast(pointsToEarn);

      // Wire WhatsApp confirmation button with payment ID added
      const enrichedMsg = msg + encodeURIComponent(`\n\n✅ Payment ID: ${paymentId}`);
      const waLink = document.getElementById('chkWhatsappBtn');
      if (waLink) waLink.href = `https://wa.me/918686745411?text=${enrichedMsg}`;

      // Clear cart
      CartState.clearCart();
      renderCartDrawer();
      updateAllCartCounters();
    },
  };

  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function(resp) {
      const errCode = resp.error?.code || 'PAYMENT_FAILED';
      const errDesc = resp.error?.description || 'Payment was not completed.';
      showPaymentErrorToast(`${errCode}: ${errDesc}`);
    });
    rzp.open();
  } catch (err) {
    console.error('[Aster Cart] Razorpay init error:', err);
    showPaymentErrorToast('Could not open payment window. Please try again.');
  }
}

// Fallback when Razorpay script hasn't loaded (e.g. ad-blocker / offline)
function showRazorpayFallback(chkName, chkPhone, chkTime) {
  const { refCode, msg } = buildOrderWhatsApp('WhatsApp Pay', chkName, chkPhone, chkTime);
  showCheckoutStep(4);
  const refEl = document.getElementById('chkRefCode');
  const ptsEl = document.getElementById('chkEarnedPts');
  if (refEl) refEl.textContent = refCode;
  if (ptsEl) ptsEl.textContent = CartState.totalPoints;

  const waLink = document.getElementById('chkWhatsappBtn');
  if (waLink) {
    waLink.href        = `https://wa.me/918686745411?text=${msg}`;
    waLink.textContent = '📲 Complete Order via WhatsApp';
  }

  // Show friendly notice
  const note = document.createElement('p');
  note.style.cssText = 'font-size:0.78rem;color:#8A7E78;margin-top:0.75rem;';
  note.textContent   = 'Online payment is temporarily unavailable. Your order will be confirmed via WhatsApp.';
  waLink?.parentElement?.appendChild(note);

  CartState.awardPoints(CartState.totalPoints);
  initLoyaltyDisplay();
  showLoyaltyToast(CartState.totalPoints);
  CartState.clearCart();
  renderCartDrawer();
  updateAllCartCounters();
}

function showPaymentErrorToast(message) {
  const el  = document.getElementById('stockToast');
  const msg = document.getElementById('stockToastMsg');
  if (!el) return;
  el.style.background = '#D32F2F';
  if (msg) msg.textContent = message;
  el.classList.add('active');
  setTimeout(() => el.classList.remove('active'), 5000);
}

// ── CHECKOUT EVENTS ───────────────────────────────────────────────────────────
function initCheckoutEvents() {
  const modal    = document.getElementById('checkoutModal');
  const closeBtn = document.getElementById('chkCloseBtn');
  const nextBtn  = document.getElementById('chkNextBtn');
  const backBtn  = document.getElementById('chkBackBtn');

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  });
  modal?.addEventListener('click', e => {
    if (e.target === modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
  });

  // Payment method selection
  document.querySelectorAll('.pay-method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      CartState.selectedPayment = btn.dataset.method;

      // Show/hide UPI hint
      const upiHint = document.getElementById('upiHint');
      if (upiHint) upiHint.classList.toggle('show', btn.dataset.method === 'upi');
    });
  });

  nextBtn?.addEventListener('click', () => {
    const step = CartState.checkoutStep;
    if (step === 1) {
      showCheckoutStep(2);
    } else if (step === 2) {
      showCheckoutStep(3);
    } else if (step === 3) {
      // ── Validate customer details first ─────────────────────────────────
      const chkName  = document.getElementById('chkName')?.value.trim();
      const chkPhone = document.getElementById('chkPhone')?.value.trim();
      const chkTime  = document.getElementById('chkPickupTime')?.value;

      if (!chkName || !chkPhone) {
        const errEl = document.getElementById('chkFormError');
        if (errEl) errEl.style.display = 'block';
        return;
      }
      const errEl = document.getElementById('chkFormError');
      if (errEl) errEl.style.display = 'none';

      // ── Launch Razorpay payment modal ────────────────────────────────────
      launchRazorpay({ chkName, chkPhone, chkTime });
    }
  });

  backBtn?.addEventListener('click', () => {
    if (CartState.checkoutStep > 1 && CartState.checkoutStep < 4) {
      showCheckoutStep(CartState.checkoutStep - 1);
    }
  });
}

// ── UPSELL EVENTS ─────────────────────────────────────────────────────────────
function initUpsellEvents() {
  const popup = document.getElementById('upsellPopup');
  if (!popup) return;

  document.getElementById('upsellAddBtn')?.addEventListener('click', () => {
    const id = popup.dataset.suggestId;
    if (id) addToCart(id);
    popup.classList.remove('active');
  });
  document.getElementById('upsellDismissBtn')?.addEventListener('click', () => {
    popup.classList.remove('active');
  });
}

// ── SHOPPABLE INSTAGRAM FEED ──────────────────────────────────────────────────
function initShoppableFeed() {
  const igGrid = document.getElementById('instagramGrid');
  if (!igGrid) return;

  // Map each IG item to a product
  const igMap = [
    { img:'assets/images/menu-coffee.jpg', alt:'Rose Latte',   productId:'drk-001' },
    { img:'assets/images/menu-meals.jpg',  alt:'Brunch Spread',productId:'fod-001' },
    { img:'assets/images/menu-pastries.jpg',alt:'Pastries',    productId:'bkr-001' },
    { img:'assets/images/service-birthday.jpg',alt:'Birthday', productId:null      },
    { img:'assets/images/latte.jpg',       alt:'Latte Art',    productId:'drk-001' },
    { img:'assets/images/service-bridal.jpg',alt:'Bridal',     productId:null      },
  ];

  igGrid.innerHTML = igMap.map((item, i) => {
    const prod = item.productId ? CATALOG[item.productId] : null;
    return `
    <div class="instagram-item ig-shoppable fade-up-element delay-${i % 3 + 1}" id="igItem${i+1}" data-ig-product="${item.productId || ''}">
      <img src="${item.img}" alt="${item.alt} at Aster Cafe" loading="lazy">
      <div class="instagram-overlay">
        ${prod ? `
        <div class="ig-shop-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3.5 6.5h17M16 10a4 4 0 01-8 0"/></svg>
          ${prod.name}
        </div>
        <button class="ig-add-to-cart" data-add-id="${item.productId}" aria-label="Add ${prod.name} to cart">
          ${formatPrice(prod.price)} — Add to Cart
        </button>
        ` : `
        <a href="#services" class="ig-event-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Book Event
        </a>`}
      </div>
    </div>`;
  }).join('');

  // Re-observe fade elements
  igGrid.querySelectorAll('.fade-up-element').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

// ── LOYALTY DISPLAY ───────────────────────────────────────────────────────────
function initLoyaltyDisplay() {
  const el = document.getElementById('loyaltyPointsDisplay');
  if (el) el.textContent = CartState.loyaltyPoints;

  const navEl = document.getElementById('navLoyaltyPts');
  if (navEl) navEl.textContent = CartState.loyaltyPoints + ' pts';
}

function updateAllCartCounters() {
  Object.keys(CATALOG).forEach(id => updateMenuCardButton(id));
}

// ── EXPERIENCE ADD-ONS IN RESERVATION ─────────────────────────────────────────
function initExperienceAddons() {
  // Listen for event type changes in reservation modal
  const eventTypeEl = document.getElementById('reserveEventType');
  const addonSection = document.getElementById('addonsSection');
  if (!eventTypeEl || !addonSection) return;

  const eventsThatShowAddons = ['Birthday party', 'Bridal shower', 'Catering & Events', 'Family Gathering'];

  function updateAddonsVisibility() {
    const show = eventsThatShowAddons.includes(eventTypeEl.value);
    addonSection.classList.toggle('hidden', !show);
  }

  eventTypeEl.addEventListener('change', updateAddonsVisibility);
  updateAddonsVisibility();

  // Addon checkboxes
  addonSection.querySelectorAll('.addon-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.addonId;
      if (cb.checked) {
        CartState.addItem(id, 1);
      } else {
        CartState.removeItem(id);
      }
      renderCartDrawer();
    });
  });
}

// ── SUBSCRIPTION FLOW ─────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-subscribe]');
  if (!btn) return;
  const id = btn.dataset.subscribe;
  const freq = btn.dataset.freq || 'monthly';
  addToCart(id);
  // show subscription note
  const note = document.getElementById('subscriptionNote');
  if (note) {
    note.textContent = `☕ Coffee beans subscription (${freq}) added! We'll deliver automatically.`;
    note.classList.remove('hidden');
    setTimeout(() => note.classList.add('hidden'), 4000);
  }
});

// ── BOOTSTRAP ─────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCart);
} else {
  initCart();
}
