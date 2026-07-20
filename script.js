/**
 * ==========================================================================
 * GOLAP-CANON LUXURY FLOWER ENGINE (MAIN APPLICATION MODULE)
 * ==========================================================================
 */
// ==========================================================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBb6LMkFaHnooQzCGxpQQosh_tyIbZiDHw",
  authDomain: "golap-canon.firebaseapp.com",
  databaseURL: "https://golap-canon-default-rtdb.firebaseio.com",
  projectId: "golap-canon",
  storageBucket: "golap-canon.firebasestorage.app",
  messagingSenderId: "993614491386",
  appId: "1:993614491386:web:04ccc121214e9b9d6ca343",
  measurementId: "G-XTXPE0TGN1"
};
// ফায়ারবেস ইনিশিয়ালাইজ করা
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// ফায়ারবেস সার্ভিসসমূহ ডিক্লেয়ার করা
const auth = firebase.auth();
const db = firebase.firestore();

// এরপর আপনার বাকি script.js কোড এখান থেকে শুরু হবে...
// Global System Configuration Fallback Defaults
const CONFIG = {
  adminWhatsApp: "+8801700000000", // Standard Admin Fallback Target Mobile Number
  deliveryFee: 150,
  defaultCurrency: "BDT"
};

// Application Global Client-side Memory Engine
const AppState = {
  user: null,
  cart: [],
  wishlist: [],
  products: [
    { id: "p1", name: "Classic Crimson Rose Ensemble", price: 2450, category: "Roses", stock: 12, rating: 5, banner: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80" },
    { id: "p2", name: "Premium Majestic White Lily Cascade", price: 3800, category: "Bespoke Arrangements", stock: 8, rating: 5, banner: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80" },
    { id: "p3", name: "Sublime Imperial Tulip Medley", price: 5400, category: "Luxury Glass Box", stock: 5, rating: 4.8, banner: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&auto=format&fit=crop&q=80" },
    { id: "p4", name: "Gold-Plated Autumnal Orchids Basket", price: 6200, category: "Luxury Glass Box", stock: 4, rating: 4.9, banner: "https://images.unsplash.com/photo-1562244970-13a8a3ee7c16?w=600&auto=format&fit=crop&q=80" },
    { id: "p5", name: "Blush Pink Hydrangea Cluster", price: 3100, category: "Bespoke Arrangements", stock: 15, rating: 4.7, banner: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600&auto=format&fit=crop&q=80" },
    { id: "p6", name: "Sunset Crimson Peony Bundle", price: 4200, category: "Roses", stock: 9, rating: 5, banner: "https://images.unsplash.com/photo-1508784932643-0834aa134a47?w=600&auto=format&fit=crop&q=80" }
  ],
  categories: ["Roses", "Bespoke Arrangements", "Luxury Glass Box", "Custom Event Design"],
  coupons: { "GOLAP2026": 15, "LOVEFLOWERS": 10 },
  activeCoupon: null,
  bookings: [],
  orders: []
};

// Initializing Local Storage Persistency
function initLocalStorageEngine() {
  if (!localStorage.getItem("g_cart")) localStorage.setItem("g_cart", JSON.stringify([]));
  if (!localStorage.getItem("g_wishlist")) localStorage.setItem("g_wishlist", JSON.stringify([]));
  if (!localStorage.getItem("g_bookings")) localStorage.setItem("g_bookings", JSON.stringify([]));
  if (!localStorage.getItem("g_orders")) localStorage.setItem("g_orders", JSON.stringify([]));

  AppState.cart = JSON.parse(localStorage.getItem("g_cart"));
  AppState.wishlist = JSON.parse(localStorage.getItem("g_wishlist"));
  AppState.bookings = JSON.parse(localStorage.getItem("g_bookings"));
  AppState.orders = JSON.parse(localStorage.getItem("g_orders"));
}

/**
 * ==========================================================================
 * REAL-TIME TOAST NOTIFICATION UTILITY
 * ==========================================================================
 */
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast-message ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/**
 * ==========================================================================
 * DECOUPLED DYNAMIC ROUTER
 * ==========================================================================
 */
const AppRouter = {
  routes: {
    home: renderHomeView,
    shop: renderShopView,
    events: renderEventsView,
    gallery: renderGalleryView,
    blog: renderBlogView,
    about: renderAboutView,
    contact: renderContactView,
    faq: renderFAQView,
    privacy: renderPrivacyView,
    terms: renderTermsView,
    checkout: renderCheckoutView,
    "admin-dashboard": renderAdminDashboardView
  },

  init() {
    window.addEventListener("hashchange", () => this.handleRouting());
    this.handleRouting();
  },

  handleRouting() {
    const hash = window.location.hash.slice(1) || "home";
    const routeHandler = this.routes[hash];
    
    // Update active navbar state indicators
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("href") === `#${hash}`) link.classList.add("active");
      else link.classList.remove("active");
    });

    if (routeHandler) {
      routeHandler();
      window.scrollTo(0, 0);
    } else {
      renderHomeView();
    }
  }
};

/**
 * ==========================================================================
 * CLIENT-SIDE RENDERED HTML TEMPLATES
 * ==========================================================================
 */

function renderHomeView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <!-- Immersive Interactive Hero Header -->
    <section class="hero-slider-section">
      <div class="hero-grid">
        <div class="hero-text-card">
          <span class="hero-label">Curated Florals • Est. 2026</span>
          <h1 class="hero-title">Elevate Moments with Artisanal Luxury</h1>
          <p class="hero-description">Immersive bespoke event decorations and master-crafted luxury arrangements built to celebrate life's most precious statements.</p>
          <div class="hero-btn-row">
            <a href="#shop" class="btn-primary"><i class="fa-solid fa-shopping-basket"></i> Browse Shop</a>
            <a href="#events" class="btn-secondary"><i class="fa-solid fa-calendar-check"></i> Book Design Team</a>
          </div>
        </div>
        <div class="hero-visual-card">
          <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9" alt="Golap-Canon Premium Flower Exhibit">
        </div>
      </div>
    </section>

    <!-- Promoted Collections Highlight -->
    <section class="catalog-container">
      <div class="section-header-box">
        <h2 class="section-title">Exclusive Collections</h2>
        <p class="section-subtitle">Specially curated Premium Rose bouquets & dynamic arrangements</p>
      </div>
      <div class="grid-layout" id="curated-home-grid"></div>
    </section>
  `;
  renderProductGrid("curated-home-grid", AppState.products.slice(0, 3));
}

function renderShopView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <section class="catalog-container">
      <div class="section-header-box">
        <h2 class="section-title">The Curated Shop</h2>
        <p class="section-subtitle">Exquisite high-end flora configurations & individual bouquets</p>
      </div>

      <div class="catalog-filter-row">
        <div class="filter-tabs">
          <button class="filter-tab active" data-cat="all">All Items</button>
          ${AppState.categories.map(cat => `<button class="filter-tab" data-cat="${cat}">${cat}</button>`).join('')}
        </div>
        <div class="filter-options">
          <select id="sort-filter" class="filter-select">
            <option value="default">Default Sort</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div class="grid-layout" id="shop-items-grid"></div>
    </section>
  `;
  
  renderProductGrid("shop-items-grid", AppState.products);
  setupShopFilters();
}

function renderEventsView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <section class="events-section">
      <div class="section-header-box">
        <h2 class="section-title">Artistic Event Orchestrations</h2>
        <p class="section-subtitle">Creating spectacular luxury transformations for life's legendary stories</p>
      </div>

      <div class="events-promo-grid">
        <div class="event-service-card">
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600" alt="Bespoke Royal Weddings">
          <div class="event-service-overlay">
            <h3>Royal Weddings</h3>
            <p>From ceiling flower installations to grand aisle stages designed down to the millimeter.</p>
            <button class="btn-primary open-evt-modal" data-type="Wedding">Inquire Dynamic Wedding Decor</button>
          </div>
        </div>
        <div class="event-service-card">
          <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600" alt="Executive Corporate Galas">
          <div class="event-service-overlay">
            <h3>Executive Galas</h3>
            <p>Sleek, luxury design patterns signaling status and elite hospitality formats.</p>
            <button class="btn-primary open-evt-modal" data-type="Corporate">Inquire Corporate Decor</button>
          </div>
        </div>
        <div class="event-service-card">
          <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600" alt="Custom Intimate Celebrations">
          <div class="event-service-overlay">
            <h3>Intimate Soirées</h3>
            <p>Cozy yet grand setups using unique, rare floral collections and beautiful structures.</p>
            <button class="btn-primary open-evt-modal" data-type="Custom">Inquire Custom Setup</button>
          </div>
        </div>
      </div>
    </section>
  `;
  setupEventButtonListeners();
}

function renderGalleryView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <section class="gallery-section">
      <div class="section-header-box">
        <h2 class="section-title">Our Visual Portfolio</h2>
        <p class="section-subtitle">Visual highlights of spectacular floral architecture curated in 2026</p>
      </div>
      <div class="gallery-grid">
        <div class="gallery-item"><img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9" alt="Exhibit"></div>
        <div class="gallery-item"><img src="https://images.unsplash.com/photo-1561181286-d3fee7d55364" alt="Exhibit"></div>
        <div class="gallery-item"><img src="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11" alt="Exhibit"></div>
        <div class="gallery-item"><img src="https://images.unsplash.com/photo-1508784932643-0834aa134a47" alt="Exhibit"></div>
        <div class="gallery-item"><img src="https://images.unsplash.com/photo-1596436889106-be35e843f974" alt="Exhibit"></div>
        <div class="gallery-item"><img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3" alt="Exhibit"></div>
      </div>
    </section>
  `;
}

function renderBlogView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <section class="blog-section">
      <div class="section-header-box">
        <h2 class="section-title">The Floral Journal</h2>
        <p class="section-subtitle">Expert guides, interior plant layouts, & 2026 wedding palette forecasts</p>
      </div>
      <div class="blog-grid">
        <article class="blog-post-card">
          <div class="blog-post-media"><img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9" alt="Post"></div>
          <div class="blog-post-body">
            <span class="blog-post-date">July 18, 2026</span>
            <h3 class="blog-post-title">2026 Luxury Floristry Design Paradigms</h3>
            <p>Unveiling the latest floral design aesthetics featuring rare multi-tone Ecuadorian roses.</p>
          </div>
        </article>
        <article class="blog-post-card">
          <div class="blog-post-media"><img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3" alt="Post"></div>
          <div class="blog-post-body">
            <span class="blog-post-date">July 10, 2026</span>
            <h3 class="blog-post-title">Selecting the Perfect Wedding Arch Layout</h3>
            <p>Our lead event architects dissect classic, modern, and asymmetrical flower setups.</p>
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderAboutView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <section class="catalog-container">
      <h2 class="section-title">The Golap-Canon Heritage</h2>
      <p class="hero-description mt-3">Established to challenge traditional flower delivery services, Golap-Canon merges fine luxury art with real-time digital eCommerce. Every hand-packaged stem is individually curated by certified botanical designers.</p>
    </section>
  `;
}

function renderContactView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <section class="catalog-container">
      <h2 class="section-title">Secure Support Portal</h2>
      <form class="glassmorphism p-5 mt-4" style="max-width: 600px; margin: 0 auto; border-radius: 16px;" id="sys-contact-form">
        <div class="form-group mb-3">
          <label>Full Name</label>
          <input type="text" required class="form-control">
        </div>
        <div class="form-group mb-3">
          <label>Email</label>
          <input type="email" required class="form-control">
        </div>
        <div class="form-group mb-3">
          <label>Inquiry Message</label>
          <textarea rows="4" required class="form-control"></textarea>
        </div>
        <button type="submit" class="btn-primary w-100 mt-2">Transmit Message</button>
      </form>
    </section>
  `;
  document.getElementById("sys-contact-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Message successfully logged!");
    e.target.reset();
  });
}

function renderFAQView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <section class="catalog-container">
      <h2 class="section-title">Frequently Answered Queries</h2>
      <div class="glassmorphism p-4 mt-4" style="border-radius: 16px; display: flex; flex-direction: column; gap: 1.5rem;">
        <div><h4>How do WhatsApp checkout orders function?</h4><p class="mt-1 text-secondary">Your order details are automatically compiled into a formatted text and opened in WhatsApp so you can instantly checkout with our concierge desk.</p></div>
        <div><h4>What payment channels do you offer?</h4><p class="mt-1 text-secondary">We fully support Cash-on-Delivery, bKash, Nagad, Rocket, and dynamic credit card integrations.</p></div>
      </div>
    </section>
  `;
}

function renderPrivacyView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `<section class="catalog-container"><h2 class="section-title">Privacy Policy</h2><p class="mt-3">Your transaction and customer contact records are strictly managed using secure Cloud Firebase protocols.</p></section>`;
}

function renderTermsView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `<section class="catalog-container"><h2 class="section-title">Terms & Conditions</h2><p class="mt-3">Product design specifications, availability, and delivery pricing may fluctuate according to botanical seasons.</p></section>`;
}

/**
 * ==========================================================================
 * CHECKOUT & SECURE BILLING VIEWS
 * ==========================================================================
 */
function renderCheckoutView() {
  const app = document.getElementById("app-view");
  if (AppState.cart.length === 0) {
    app.innerHTML = `
      <section class="catalog-container text-center">
        <h2>Your Cart is Currently Empty</h2>
        <a href="#shop" class="btn-primary mt-3">Go Shop</a>
      </section>
    `;
    return;
  }

  const subtotal = calculateCartSubtotal();
  const discount = AppState.activeCoupon ? (subtotal * (AppState.activeCoupon.discount / 100)) : 0;
  const grandTotal = subtotal - discount + CONFIG.deliveryFee;

  app.innerHTML = `
    <div class="checkout-view-layout">
      <div>
        <h2 class="section-title mb-4">Secure Checkout</h2>
        <form id="checkout-form" class="glassmorphism p-4" style="border-radius: var(--border-radius-md);">
          <div class="form-grid">
            <div class="form-group">
              <label>Recipient Name</label>
              <input type="text" id="chk-name" required placeholder="John Doe">
            </div>
            <div class="form-group">
              <label>Contact Phone Number</label>
              <input type="tel" id="chk-phone" required placeholder="01XXXXXXXXX">
            </div>
            <div class="form-group">
              <label>Recipient Email Address</label>
              <input type="email" id="chk-email" placeholder="name@example.com">
            </div>
            <div class="form-group">
              <label>Delivery Target Date</label>
              <input type="date" id="chk-date" required>
            </div>
            <div class="form-group flex-full">
              <label>Detailed Home / Venue Address</label>
              <input type="text" id="chk-address" required placeholder="Apartment, Street Name, City">
            </div>
            <div class="form-group flex-full">
              <label>Gift Greeting Card Note (Optional)</label>
              <textarea id="chk-message" rows="3" placeholder="Write a special card note to deliver with the flowers..."></textarea>
            </div>
          </div>

          <h3 class="mt-4 mb-2">Select Payment Method</h3>
          <div class="payment-selector">
            <div class="payment-card-option active" data-method="COD"><i class="fa-solid fa-hand-holding-dollar"></i><p>COD</p></div>
            <div class="payment-card-option" data-method="bKash"><i class="fa-solid fa-money-bill-transfer"></i><p>bKash</p></div>
            <div class="payment-card-option" data-method="Nagad"><i class="fa-solid fa-wallet"></i><p>Nagad</p></div>
            <div class="payment-card-option" data-method="Rocket"><i class="fa-solid fa-mobile-screen"></i><p>Rocket</p></div>
          </div>

          <button type="submit" class="btn-primary w-100 mt-4">Place Order via WhatsApp</button>
        </form>
      </div>

      <div>
        <div class="glassmorphism p-4" style="border-radius: var(--border-radius-md); position: sticky; top: 120px;">
          <h3 class="mb-3">Order Invoice</h3>
          <div style="max-height: 250px; overflow-y: auto;">
            ${AppState.cart.map(item => `
              <div style="display:flex; justify-content:space-between; margin-bottom:1rem; border-bottom:1px solid rgba(0,0,0,0.05); padding-bottom:0.5rem;">
                <div>
                  <p style="font-weight:600;">${item.name}</p>
                  <p style="font-size:0.85rem; color:var(--text-secondary)">Qty: ${item.qty}</p>
                </div>
                <span>${item.price * item.qty} BDT</span>
              </div>
            `).join('')}
          </div>
          <hr style="margin:1.5rem 0; border:none; border-top:1px solid var(--border-color);">
          <div class="summary-row"><span>Cart Subtotal</span><span>${subtotal} BDT</span></div>
          ${discount > 0 ? `<div class="summary-row" style="color:var(--primary)"><span>Promo Applied</span><span>-${discount} BDT</span></div>` : ''}
          <div class="summary-row"><span>Standard Flat Delivery Fee</span><span>${CONFIG.deliveryFee} BDT</span></div>
          <div class="summary-total-row"><span>Total Invoice</span><span>${grandTotal} BDT</span></div>
        </div>
      </div>
    </div>
  `;

  setupCheckoutMechanics();
}

/**
 * ==========================================================================
 * PRODUCT GRID & DISPLAY RENDERING
 * ==========================================================================
 */
function renderProductGrid(targetId, productList) {
  const container = document.getElementById(targetId);
  if (!container) return;
  if (productList.length === 0) {
    container.innerHTML = `<div class="text-center w-100 py-5"><p>No items found.</p></div>`;
    return;
  }

  container.innerHTML = productList.map(prod => `
    <div class="premium-card">
      <div class="card-media">
        <span class="badge-tag">${prod.category}</span>
        <img src="${prod.banner}" alt="${prod.name}">
        <div class="card-actions-overlay">
          <button class="overlay-action-btn quick-view-trigger" data-id="${prod.id}" title="Quick View"><i class="fa-solid fa-eye"></i></button>
          <button class="overlay-action-btn wishlist-add-trigger" data-id="${prod.id}" title="Wishlist"><i class="fa-solid fa-heart"></i></button>
        </div>
      </div>
      <div class="card-details">
        <span class="card-category">${prod.category}</span>
        <h3 class="card-title">${prod.name}</h3>
        <div class="rating-row">
          ${`<i class="fa-solid fa-star"></i>`.repeat(Math.floor(prod.rating))}
          <span>(${prod.rating})</span>
        </div>
        <div class="price-row">
          <span class="price">${prod.price} BDT</span>
          <button class="card-buy-btn add-to-cart-trigger" data-id="${prod.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  setupProductEventBindings(container);
}

/**
 * ==========================================================================
 * SHOP FILTERS SYSTEM
 * ==========================================================================
 */
function setupShopFilters() {
  const container = document.querySelector(".catalog-filter-row");
  if (!container) return;

  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-tab")) {
      document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.remove("active"));
      e.target.classList.add("active");
      applyCombinedFilters();
    }
  });

  document.getElementById("sort-filter")?.addEventListener("change", applyCombinedFilters);
}

function applyCombinedFilters() {
  const activeTab = document.querySelector(".filter-tab.active");
  const selectedCategory = activeTab ? activeTab.getAttribute("data-cat") : "all";
  const sortValue = document.getElementById("sort-filter")?.value || "default";

  let filtered = [...AppState.products];

  if (selectedCategory !== "all") {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }

  if (sortValue === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProductGrid("shop-items-grid", filtered);
}

/**
 * ==========================================================================
 * CART STATE & DOM SYNCHRONIZER
 * ==========================================================================
 */
function addToCart(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  const existing = AppState.cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    AppState.cart.push({ ...product, qty: 1 });
  }

  updateCartState();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  AppState.cart = AppState.cart.filter(item => item.id !== productId);
  updateCartState();
}

function updateQty(productId, increment) {
  const item = AppState.cart.find(i => i.id === productId);
  if (item) {
    item.qty += increment;
    if (item.qty <= 0) removeFromCart(productId);
    else updateCartState();
  }
}

function calculateCartSubtotal() {
  return AppState.cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

function updateCartState() {
  localStorage.setItem("g_cart", JSON.stringify(AppState.cart));
  
  // Refresh Badges
  const totalCount = AppState.cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-badge").innerText = totalCount;

  // Refresh Side Slide View
  const wrapper = document.getElementById("cart-items-wrapper");
  if (!wrapper) return;

  if (AppState.cart.length === 0) {
    wrapper.innerHTML = `<p class="text-center py-5">Your cart is empty.</p>`;
  } else {
    wrapper.innerHTML = AppState.cart.map(item => `
      <div class="cart-item">
        <img src="${item.banner}" alt="${item.name}">
        <div class="cart-item-details">
          <p class="cart-item-title">${item.name}</p>
          <p class="cart-item-price">${item.price} BDT</p>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="text-danger" onclick="removeFromCart('${item.id}')" style="align-self:center;"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');
  }

  // Update Calculations
  const subtotal = calculateCartSubtotal();
  const discount = AppState.activeCoupon ? (subtotal * (AppState.activeCoupon.discount / 100)) : 0;
  const grandTotal = subtotal - discount;

  document.getElementById("cart-subtotal").innerText = `${subtotal.toFixed(2)} BDT`;
  document.getElementById("cart-discount").innerText = `-${discount.toFixed(2)} BDT`;
  document.getElementById("cart-grand-total").innerText = `${grandTotal.toFixed(2)} BDT`;
}

/**
 * ==========================================================================
 * WISHLIST STATE & DOM SYNCHRONIZER
 * ==========================================================================
 */
function toggleWishlist(productId) {
  const item = AppState.products.find(p => p.id === productId);
  if (!item) return;

  const idx = AppState.wishlist.findIndex(w => w.id === productId);
  if (idx > -1) {
    AppState.wishlist.splice(idx, 1);
    showToast("Removed from wishlist.");
  } else {
    AppState.wishlist.push(item);
    showToast("Added to wishlist.");
  }

  localStorage.setItem("g_wishlist", JSON.stringify(AppState.wishlist));
  updateWishlistState();
}

function updateWishlistState() {
  document.getElementById("wishlist-badge").innerText = AppState.wishlist.length;
  const wrapper = document.getElementById("wishlist-items-wrapper");
  if (!wrapper) return;

  if (AppState.wishlist.length === 0) {
    wrapper.innerHTML = `<p class="text-center py-5">Your wishlist is empty.</p>`;
  } else {
    wrapper.innerHTML = AppState.wishlist.map(item => `
      <div class="cart-item">
        <img src="${item.banner}" alt="${item.name}">
        <div class="cart-item-details">
          <p class="cart-item-title">${item.name}</p>
          <p class="cart-item-price">${item.price} BDT</p>
          <button class="btn-primary py-1 px-2 mt-2" onclick="addToCart('${item.id}')" style="font-size:0.8rem;">Add to Cart</button>
        </div>
        <button class="text-danger" onclick="toggleWishlist('${item.id}')" style="align-self:center;"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `).join('');
  }
}

/**
 * ==========================================================================
 * PRODUCT DETAILS & QUICK VIEW
 * ==========================================================================
 */
function showQuickView(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  const content = document.getElementById("quickview-content-wrapper");
  content.innerHTML = `
    <div class="quickview-grid">
      <div class="quickview-gallery">
        <img src="${product.banner}" alt="${product.name}">
      </div>
      <div>
        <span class="card-category">${product.category}</span>
        <h2 class="section-title text-start mb-2" style="font-size:2rem;">${product.name}</h2>
        <div class="rating-row">
          ${`<i class="fa-solid fa-star"></i>`.repeat(Math.floor(product.rating))}
          <span>(${product.rating})</span>
        </div>
        <p class="text-secondary mb-4">Premium designer arrangement of freshest flowers handpicked and styled beautifully by master florists.</p>
        <div class="mb-4">
          <span style="font-size:1.8rem; font-weight:800; color:var(--primary);">${product.price} BDT</span>
        </div>
        <div style="display:flex; gap:1rem;">
          <button class="btn-primary w-100" onclick="addToCart('${product.id}')">Add to Cart</button>
          <button class="btn-outline" onclick="toggleWishlist('${product.id}')"><i class="fa-solid fa-heart"></i></button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("quickview-modal").classList.add("active");
}

/**
 * ==========================================================================
 * WHATSAPP CHECKOUT SYSTEM
 * ==========================================================================
 */
function setupCheckoutMechanics() {
  const checkoutForm = document.getElementById("checkout-form");
  if (!checkoutForm) return;

  // Active Selection logic for Payment Choices
  document.querySelectorAll(".payment-card-option").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".payment-card-option").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    });
  });

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("chk-name").value;
    const phone = document.getElementById("chk-phone").value;
    const email = document.getElementById("chk-email").value || "N/A";
    const date = document.getElementById("chk-date").value;
    const address = document.getElementById("chk-address").value;
    const message = document.getElementById("chk-message").value || "N/A";
    const payment = document.querySelector(".payment-card-option.active").getAttribute("data-method");

    const orderId = `GC-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = calculateCartSubtotal();
    const discount = AppState.activeCoupon ? (subtotal * (AppState.activeCoupon.discount / 100)) : 0;
    const grandTotal = subtotal - discount + CONFIG.deliveryFee;

    // Compile dynamic items description list
    const itemsDescription = AppState.cart.map(item => `• ${item.name} (Qty: ${item.qty})`).join("\n");

    // Dynamic order log registration
    const orderDetails = {
      orderId,
      customer: { name, phone, email, address },
      items: AppState.cart,
      subtotal,
      discount,
      grandTotal,
      deliveryDate: date,
      paymentMethod: payment,
      giftMessage: message,
      orderTime: new Date().toLocaleString()
    };

    AppState.orders.push(orderDetails);
    localStorage.setItem("g_orders", JSON.stringify(AppState.orders));

    // WhatsApp Message Encoding
    const textMsg = `*🚨 GOLAP-CANON LUXURY ORDER: ${orderId}* \n\n` +
                    `*Customer Details:*\n` +
                    `• Name: ${name}\n` +
                    `• Phone: ${phone}\n` +
                    `• Email: ${email}\n` +
                    `• Address: ${address}\n\n` +
                    `*Curated Items:*\n${itemsDescription}\n\n` +
                    `*Logistics:*\n` +
                    `• Delivery Date: ${date}\n` +
                    `• Payment Method: ${payment}\n` +
                    `• Greeting Note: ${message}\n\n` +
                    `*Financial Breakdown:*\n` +
                    `• Subtotal: ${subtotal} BDT\n` +
                    `• Discount: -${discount} BDT\n` +
                    `• Delivery: ${CONFIG.deliveryFee} BDT\n` +
                    `• *Grand Total: ${grandTotal} BDT*\n\n` +
                    `Thank you for ordering with Golap-Canon. Press send to launch your dispatch!`;

    const encodedText = encodeURIComponent(textMsg);
    const whatsappURL = `https://wa.me/${CONFIG.adminWhatsApp}?text=${encodedText}`;

    showToast("Processing order... Redirecting to WhatsApp", "success");
    
    setTimeout(() => {
      // Clear Cart state
      AppState.cart = [];
      updateCartState();
      window.open(whatsappURL, "_blank");
      window.location.hash = "home";
    }, 1500);
  });
}

/**
 * ==========================================================================
 * EVENT BOOKING ENGINE
 * ==========================================================================
 */
function setupEventButtonListeners() {
  document.querySelectorAll(".open-evt-modal").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const type = btn.getAttribute("data-type");
      const typeSelect = document.getElementById("evt-type");
      if (typeSelect) typeSelect.value = type;
      document.getElementById("event-booking-modal").classList.add("active");
    });
  });
}

function handleEventBookingSubmit(e) {
  e.preventDefault();
  
  const booking = {
    id: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
    name: document.getElementById("evt-name").value,
    phone: document.getElementById("evt-phone").value,
    type: document.getElementById("evt-type").value,
    date: document.getElementById("evt-date").value,
    venue: document.getElementById("evt-venue").value,
    notes: document.getElementById("evt-notes").value,
    timestamp: new Date().toLocaleString()
  };

  AppState.bookings.push(booking);
  localStorage.setItem("g_bookings", JSON.stringify(AppState.bookings));
  
  showToast("Inquiry submitted successfully!");
  document.getElementById("event-booking-modal").classList.remove("active");
  e.target.reset();
}

/**
 * ==========================================================================
 * SEARCH ENGINE
 * ==========================================================================
 */
function initSearchEngine() {
  const searchInput = document.getElementById("live-search-input");
  const dropdown = document.getElementById("search-results-dropdown");

  searchInput?.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase().trim();
    if (!val) {
      dropdown.innerHTML = "";
      return;
    }

    const matches = AppState.products.filter(p => p.name.toLowerCase().includes(val) || p.category.toLowerCase().includes(val));
    if (matches.length === 0) {
      dropdown.innerHTML = `<div class="p-3 text-center">No catalog items match search parameters</div>`;
    } else {
      dropdown.innerHTML = matches.map(prod => `
        <div class="search-result-item" onclick="showQuickView('${prod.id}'); document.getElementById('search-overlay-bar').style.display='none';">
          <img src="${prod.banner}" alt="${prod.name}">
          <div>
            <p style="font-weight:600; font-size:0.95rem;">${prod.name}</p>
            <p style="font-size:0.85rem; color:var(--primary);">${prod.price} BDT</p>
          </div>
        </div>
      `).join('');
    }
  });
}

/**
 * ==========================================================================
 * UTILITY HELPERS AND GENERAL DECORATIONS
 * ==========================================================================
 */
function setupProductEventBindings(parentContainer) {
  parentContainer.querySelectorAll(".add-to-cart-trigger").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.getAttribute("data-id")));
  });

  parentContainer.querySelectorAll(".wishlist-add-trigger").forEach(btn => {
    btn.addEventListener("click", () => toggleWishlist(btn.getAttribute("data-id")));
  });

  parentContainer.querySelectorAll(".quick-view-trigger").forEach(btn => {
    btn.addEventListener("click", () => showQuickView(btn.getAttribute("data-id")));
  });
}

/**
 * ==========================================================================
 * ADMIN PANEL VIEW GENERATION & ACTION INTERACTIVITY
 * ==========================================================================
 */
function renderAdminDashboardView() {
  const app = document.getElementById("app-view");
  
  app.innerHTML = `
    <div class="admin-layout">
      <!-- Sidebar navigation panel -->
      <aside class="admin-sidebar">
        <h2 style="font-family:var(--font-heading); color:var(--primary);"><i class="fa-solid fa-user-shield"></i> HQ Console</h2>
        <nav class="admin-nav">
          <button class="admin-nav-btn active" data-view="overview"><i class="fa-solid fa-chart-line"></i> Dashboard</button>
          <button class="admin-nav-btn" data-view="products"><i class="fa-solid fa-gift"></i> Products</button>
          <button class="admin-nav-btn" data-view="orders"><i class="fa-solid fa-receipt"></i> Orders (${AppState.orders.length})</button>
          <button class="admin-nav-btn" data-view="bookings"><i class="fa-solid fa-calendar-check"></i> Event Enquiries (${AppState.bookings.length})</button>
          <button class="admin-nav-btn" data-view="settings"><i class="fa-solid fa-sliders"></i> Configuration Settings</button>
        </nav>
      </aside>

      <!-- Main Data Control Area -->
      <section class="admin-content-area" id="admin-main-stage">
        <!-- Render views dynamically -->
      </section>
    </div>
  `;

  // Bind side menu navigation tabs
  document.querySelectorAll(".admin-nav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".admin-nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      switchAdminSubView(btn.getAttribute("data-view"));
    });
  });

  // Default Stage view
  switchAdminSubView("overview");
}

function switchAdminSubView(subview) {
  const stage = document.getElementById("admin-main-stage");
  if (!stage) return;

  if (subview === "overview") {
    const totalRev = AppState.orders.reduce((sum, o) => sum + o.grandTotal, 0);
    stage.innerHTML = `
      <div class="admin-action-bar">
        <h2>Corporate Performance Dashboard</h2>
      </div>
      <div class="dashboard-stat-grid">
        <div class="stat-card">
          <span>Gross Operations Revenue</span>
          <div class="stat-val">${totalRev} BDT</div>
        </div>
        <div class="stat-card" style="border-left-color:var(--secondary);">
          <span>Logged Transactions</span>
          <div class="stat-val">${AppState.orders.length}</div>
        </div>
        <div class="stat-card" style="border-left-color:var(--accent);">
          <span>Event Inquiries Registered</span>
          <div class="stat-val">${AppState.bookings.length}</div>
        </div>
      </div>
      
      <h3>Latest Transactions Activity</h3>
      <div class="admin-table-container mt-3">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date Priority</th>
              <th>Total Value</th>
              <th>Gateway</th>
            </tr>
          </thead>
          <tbody>
            ${AppState.orders.map(o => `
              <tr>
                <td>${o.orderId}</td>
                <td>${o.customer.name}</td>
                <td>${o.deliveryDate}</td>
                <td>${o.grandTotal} BDT</td>
                <td><span style="font-weight:700; color:var(--primary);">${o.paymentMethod}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } 
  
  else if (subview === "products") {
    stage.innerHTML = `
      <div class="admin-action-bar">
        <h2>Live Catalog Directory</h2>
        <button class="btn-primary" id="add-prod-admin-btn"><i class="fa-solid fa-plus"></i> Inject New Bouquet</button>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Product Name</th>
              <th>Operational Category</th>
              <th>Price Index</th>
              <th>Current Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${AppState.products.map(p => `
              <tr>
                <td><img src="${p.banner}" class="table-img" alt=""></td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.price} BDT</td>
                <td>${p.stock} units</td>
                <td>
                  <button onclick="removeProduct('${p.id}')" class="text-danger" style="font-size:1.1rem; padding:0.5rem;"><i class="fa-solid fa-trash-can"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("add-prod-admin-btn")?.addEventListener("click", () => {
      const name = prompt("Enter Product Name:");
      const price = parseFloat(prompt("Enter Selling Price (BDT):"));
      const category = prompt("Enter Category (Roses / Bespoke Arrangements / Luxury Glass Box):");
      const img = prompt("Enter Image URL:", "https://images.unsplash.com/photo-1526047932273-341f2a7631f9");

      if (name && price && category && img) {
        const newP = {
          id: `p${AppState.products.length + 1}`,
          name, price, category, stock: 10, rating: 5, banner: img
        };
        AppState.products.push(newP);
        showToast("Dynamic collection expanded!");
        switchAdminSubView("products");
      }
    });
  } 
  
  else if (subview === "bookings") {
    stage.innerHTML = `
      <div class="admin-action-bar">
        <h2>Registered Event Booking Queries</h2>
      </div>
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Target Date</th>
              <th>Venue Setup Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${AppState.bookings.map(b => `
              <tr>
                <td>${b.id}</td>
                <td>${b.name} (${b.phone})</td>
                <td><span style="background:rgba(var(--primary-rgb),0.1); color:var(--primary); padding:0.2rem 0.6rem; border-radius:5px; font-weight:700;">${b.type}</span></td>
                <td>${b.date}</td>
                <td>${b.venue}</td>
                <td>
                  <a href="https://wa.me/${b.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn-secondary py-1 px-2" style="font-size:0.8rem;"><i class="fa-brands fa-whatsapp"></i> Chat</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } 
  
  else if (subview === "settings") {
    stage.innerHTML = `
      <div class="admin-action-bar">
        <h2>Platform Configuration</h2>
      </div>
      <form id="hq-settings-form" class="glassmorphism p-4" style="max-width:600px; border-radius:12px;">
        <div class="form-group mb-3">
          <label>Target Admin WhatsApp Number (Country code required)</label>
          <input type="text" id="cfg-whatsapp" value="${CONFIG.adminWhatsApp}" required>
        </div>
        <div class="form-group mb-3">
          <label>Standard Courier Shipping Charge (BDT)</label>
          <input type="number" id="cfg-delivery" value="${CONFIG.deliveryFee}" required>
        </div>
        <button type="submit" class="btn-primary w-100 mt-2">Commit Settings Change</button>
      </form>
    `;

    document.getElementById("hq-settings-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      CONFIG.adminWhatsApp = document.getElementById("cfg-whatsapp").value;
      CONFIG.deliveryFee = parseFloat(document.getElementById("cfg-delivery").value);
      
      // Update dynamic floats
      const waWidget = document.getElementById("whatsapp-widget-anchor");
      if (waWidget) waWidget.href = `https://wa.me/${CONFIG.adminWhatsApp}`;

      showToast("Operational configuration updated successfully!");
    });
  }
}

window.removeProduct = function(prodId) {
  AppState.products = AppState.products.filter(p => p.id !== prodId);
  showToast("Product deleted from view");
  switchAdminSubView("products");
};

/**
 * ==========================================================================
 * THEME LIGHT-DARK TRANSITION CONTROLLER
 * ==========================================================================
 */
function initThemeController() {
  const themeToggle = document.getElementById("theme-toggle");
  const icon = themeToggle?.querySelector("i");

  themeToggle?.addEventListener("click", () => {
    if (document.body.classList.contains("light-theme")) {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      icon.className = "fa-solid fa-sun";
    } else {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      icon.className = "fa-solid fa-moon";
    }
  });
}

/**
 * ==========================================================================
 * MASTER APPLICATION ENTRANCE POINT
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Local Memory and Settings UI Elements
  initLocalStorageEngine();
  updateCartState();
  updateWishlistState();
  initThemeController();
  initSearchEngine();

  // Set the dynamic floating widget path
  const waWidget = document.getElementById("whatsapp-widget-anchor");
  if (waWidget) waWidget.href = `https://wa.me/${CONFIG.adminWhatsApp}`;

  // Launch Router Framework
  AppRouter.init();

  // Handle Hamburger Actions
  const hamburger = document.getElementById("hamburger-menu");
  const navbar = document.getElementById("navbar");
  hamburger?.addEventListener("click", () => navbar.classList.toggle("active"));

  // Event modal closing bindings
  document.getElementById("close-event-modal")?.addEventListener("click", () => {
    document.getElementById("event-booking-modal").classList.remove("active");
  });
  document.getElementById("event-booking-form")?.addEventListener("submit", handleEventBookingSubmit);

  // Cart Panel Slider bindings
  document.getElementById("cart-toggle-btn")?.addEventListener("click", () => {
    document.getElementById("cart-slide-overlay").classList.add("active");
  });
  document.getElementById("close-cart-btn")?.addEventListener("click", () => {
    document.getElementById("cart-slide-overlay").classList.remove("active");
  });

  // Wishlist Panel Slider bindings
  document.getElementById("wishlist-toggle-btn")?.addEventListener("click", () => {
    document.getElementById("wishlist-slide-overlay").classList.add("active");
  });
  document.getElementById("close-wishlist-btn")?.addEventListener("click", () => {
    document.getElementById("wishlist-slide-overlay").classList.remove("active");
  });

  // Coupon Engine bindings
  document.getElementById("apply-coupon-btn")?.addEventListener("click", () => {
    const code = document.getElementById("coupon-code-input").value.trim().toUpperCase();
    if (AppState.coupons[code]) {
      AppState.activeCoupon = { code, discount: AppState.coupons[code] };
      showToast(`Coupon ${code} applied successfully!`, "success");
      updateCartState();
    } else {
      showToast("Invalid promo code supplied", "error");
    }
  });

  // Route to checkout from cart slide
  document.getElementById("cart-checkout-trigger")?.addEventListener("click", () => {
    document.getElementById("cart-slide-overlay").classList.remove("active");
    window.location.hash = "checkout";
  });

  // Overlay closing setups
  document.getElementById("close-quickview-modal")?.addEventListener("click", () => {
    document.getElementById("quickview-modal").classList.remove("active");
  });

  // Auth Dialog setups
  const authModal = document.getElementById("auth-modal");
  document.getElementById("auth-toggle-btn")?.addEventListener("click", () => {
    if (AppState.user) {
      // Handle logout state transitions
      AppState.user = null;
      document.getElementById("auth-btn-txt").innerText = "Login";
      document.getElementById("nav-admin-link").style.display = "none";
      showToast("Safely logged out of central session");
      window.location.hash = "home";
    } else {
      authModal.classList.add("active");
    }
  });
  
  document.getElementById("close-auth-modal")?.addEventListener("click", () => authModal.classList.remove("active"));

  // Tab routing inside dynamic Auth Dialog
  const tabLogin = document.getElementById("tab-login-btn");
  const tabRegister = document.getElementById("tab-register-btn");
  const loginPanel = document.getElementById("login-form-panel");
  const registerPanel = document.getElementById("register-form-panel");

  tabLogin?.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginPanel.classList.add("active");
    registerPanel.classList.remove("active");
  });

  tabRegister?.addEventListener("click", () => {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    registerPanel.classList.add("active");
    loginPanel.classList.remove("active");
  });

  // Simulated Identity Provider Framework Mock (to function seamlessly prior to manual Firebase initialization)
  document.getElementById("login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    
    // Auto detect root administrator privileges
    if (email.startsWith("admin")) {
      AppState.user = { email, role: "admin" };
      document.getElementById("nav-admin-link").style.display = "flex";
      showToast("Admin session authenticated");
    } else {
      AppState.user = { email, role: "user" };
      showToast(`Welcome back, ${email}`);
    }

    document.getElementById("auth-btn-txt").innerText = "Logout";
    authModal.classList.remove("active");
  });

  // Visual Search Toggle Logic
  document.getElementById("search-toggle")?.addEventListener("click", () => {
    const searchBar = document.getElementById("search-overlay-bar");
    searchBar.style.display = searchBar.style.display === "block" ? "none" : "block";
  });
  document.getElementById("close-search")?.addEventListener("click", () => {
    document.getElementById("search-overlay-bar").style.display = "none";
  });
});