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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Global System Configuration
const CONFIG = {
  adminWhatsApp: "+8801700000000",
  deliveryFee: 150,
  defaultCurrency: "BDT"
};

// Central App Database Model (Loads from Storage or Defaults)
const AppState = {
  user: null,
  cart: [],
  wishlist: [],
  
  // Custom Dynamic Website Pages Content
  pages: {
    heroTitle: "Elevate Moments with Artisanal Luxury",
    heroDesc: "Immersive bespoke event decorations and master-crafted luxury arrangements built to celebrate life's most precious statements.",
    heroImg: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9",
    aboutText: "Established to challenge traditional flower delivery services, Golap-Canon merges fine luxury art with real-time digital eCommerce. Every hand-packaged stem is individually curated by certified botanical designers.",
    contactDesc: "Our dedicated event design managers and customer relationship desks are available around the clock to support your requests.",
    privacy: "Your transaction and customer contact records are strictly managed using secure Cloud Firebase protocols.",
    terms: "Product design specifications, availability, and delivery pricing may fluctuate according to botanical seasons.",
    faq: [
      { q: "How do WhatsApp checkout orders function?", a: "Your order details are automatically compiled into a formatted text and opened in WhatsApp so you can instantly checkout with our concierge desk." },
      { q: "What payment channels do you offer?", a: "We fully support Cash-on-Delivery, bKash, Nagad, Rocket, and dynamic credit card integrations." }
    ]
  },

  products: [
    { id: "p1", name: "Classic Crimson Rose Ensemble", price: 2450, category: "Roses", stock: 12, rating: 5, banner: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80" },
    { id: "p2", name: "Premium Majestic White Lily Cascade", price: 3800, category: "Bespoke Arrangements", stock: 8, rating: 5, banner: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80" },
    { id: "p3", name: "Sublime Imperial Tulip Medley", price: 5400, category: "Luxury Glass Box", stock: 5, rating: 4.8, banner: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&auto=format&fit=crop&q=80" },
    { id: "p4", name: "Gold-Plated Autumnal Orchids Basket", price: 6200, category: "Luxury Glass Box", stock: 4, rating: 4.9, banner: "https://images.unsplash.com/photo-1562244970-13a8a3ee7c16?w=600&auto=format&fit=crop&q=80" },
    { id: "p5", name: "Blush Pink Hydrangea Cluster", price: 3100, category: "Bespoke Arrangements", stock: 15, rating: 4.7, banner: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600&auto=format&fit=crop&q=80" },
    { id: "p6", name: "Sunset Crimson Peony Bundle", price: 4200, category: "Roses", stock: 9, rating: 5, banner: "https://images.unsplash.com/photo-1508784932643-0834aa134a47?w=600&auto=format&fit=crop&q=80" }
  ],

  events: [
    { id: "e1", title: "Royal Weddings", desc: "From ceiling flower installations to grand aisle stages designed down to the millimeter.", banner: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600" },
    { id: "e2", title: "Executive Galas", desc: "Sleek, luxury design patterns signaling status and elite hospitality formats.", banner: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600" },
    { id: "e3", title: "Intimate Soirées", desc: "Cozy yet grand setups using unique, rare floral collections and beautiful structures.", banner: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600" }
  ],

  gallery: [
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9",
    "https://images.unsplash.com/photo-1561181286-d3fee7d55364",
    "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11",
    "https://images.unsplash.com/photo-1508784932643-0834aa134a47",
    "https://images.unsplash.com/photo-1596436889106-be35e843f974",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3"
  ],

  blog: [
    { id: "b1", date: "July 18, 2026", title: "2026 Luxury Floristry Design Paradigms", desc: "Unveiling the latest floral design aesthetics featuring rare multi-tone Ecuadorian roses.", banner: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9" },
    { id: "b2", date: "July 10, 2026", title: "Selecting the Perfect Wedding Arch Layout", desc: "Our lead event architects dissect classic, modern, and asymmetrical flower setups.", banner: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3" }
  ],

  categories: ["Roses", "Bespoke Arrangements", "Luxury Glass Box"],
  coupons: { "GOLAP2026": 15, "LOVEFLOWERS": 10 },
  activeCoupon: null,
  bookings: [],
  orders: []
};

// Initializing Storage Persistency & Synchronization
function initLocalStorageEngine() {
  if (!localStorage.getItem("g_cart")) localStorage.setItem("g_cart", JSON.stringify([]));
  if (!localStorage.getItem("g_wishlist")) localStorage.setItem("g_wishlist", JSON.stringify([]));
  if (!localStorage.getItem("g_bookings")) localStorage.setItem("g_bookings", JSON.stringify([]));
  if (!localStorage.getItem("g_orders")) localStorage.setItem("g_orders", JSON.stringify([]));
  
  if (!localStorage.getItem("g_pages")) {
    localStorage.setItem("g_pages", JSON.stringify(AppState.pages));
  } else {
    AppState.pages = JSON.parse(localStorage.getItem("g_pages"));
  }

  if (!localStorage.getItem("g_events")) {
    localStorage.setItem("g_events", JSON.stringify(AppState.events));
  } else {
    AppState.events = JSON.parse(localStorage.getItem("g_events"));
  }

  if (!localStorage.getItem("g_categories")) {
    localStorage.setItem("g_categories", JSON.stringify(AppState.categories));
  } else {
    AppState.categories = JSON.parse(localStorage.getItem("g_categories"));
  }

  if (!localStorage.getItem("g_gallery")) {
    localStorage.setItem("g_gallery", JSON.stringify(AppState.gallery));
  } else {
    AppState.gallery = JSON.parse(localStorage.getItem("g_gallery"));
  }

  if (!localStorage.getItem("g_blog")) {
    localStorage.setItem("g_blog", JSON.stringify(AppState.blog));
  } else {
    AppState.blog = JSON.parse(localStorage.getItem("g_blog"));
  }

  if (!localStorage.getItem("g_products")) {
    localStorage.setItem("g_products", JSON.stringify(AppState.products));
  } else {
    AppState.products = JSON.parse(localStorage.getItem("g_products"));
  }

  AppState.cart = JSON.parse(localStorage.getItem("g_cart"));
  AppState.wishlist = JSON.parse(localStorage.getItem("g_wishlist"));
  AppState.bookings = JSON.parse(localStorage.getItem("g_bookings"));
  AppState.orders = JSON.parse(localStorage.getItem("g_orders"));
}

/**
 * ==========================================================================
 * REAL-TIME NOTIFICATION TOASTS
 * ==========================================================================
 */
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
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
 * SPA DECOUPLED DYNAMIC ROUTER
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
    
    document.getElementById("navbar").classList.remove("active");
  }
};

/**
 * ==========================================================================
 * DYNAMIC CLIENT RENDERS
 * ==========================================================================
 */
function renderHomeView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <section class="hero-slider-section">
      <div class="hero-grid">
        <div class="hero-text-card">
          <span class="hero-label">Curated Florals • Est. 2026</span>
          <h1 class="hero-title">${AppState.pages.heroTitle}</h1>
          <p class="hero-description">${AppState.pages.heroDesc}</p>
          <div class="hero-btn-row">
            <a href="#shop" class="btn-primary"><i class="fa-solid fa-shopping-basket"></i> Browse Shop</a>
            <a href="#events" class="btn-secondary"><i class="fa-solid fa-calendar-check"></i> Book Design Team</a>
          </div>
        </div>
        <div class="hero-visual-card">
          <img src="${AppState.pages.heroImg}" alt="Golap-Canon Premium Flower Exhibit">
        </div>
      </div>
    </section>

    <section class="catalog-container">
      <div class="section-header-box">
        <h2 class="section-title">Exclusive Collections</h2>
        <p class="section-subtitle">Specially curated Premium Rose bouquets & dynamic arrangements</p>
      </div>
      <div class="grid-layout" id="curated-home-grid"></div>
    </section>
  `;
  setupProductGrid("curated-home-grid", AppState.products.slice(0, 3));
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
  setupProductGrid("shop-items-grid", AppState.products);
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
        ${AppState.events.map(evt => `
          <div class="event-service-card">
            <img src="${evt.banner}" alt="${evt.title}">
            <div class="event-service-overlay">
              <h3>${evt.title}</h3>
              <p>${evt.desc}</p>
              <button class="btn-primary open-evt-modal" data-type="${evt.title}">Inquire Custom ${evt.title} Setup</button>
            </div>
          </div>
        `).join('')}
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
        ${AppState.gallery.map(img => `
          <div class="gallery-item"><img src="${img}" alt="Exhibit Visual"></div>
        `).join('')}
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
        ${AppState.blog.map(post => `
          <article class="blog-post-card">
            <div class="blog-post-media"><img src="${post.banner}" alt="${post.title}"></div>
            <div class="blog-post-body">
              <span class="blog-post-date">${post.date}</span>
              <h3 class="blog-post-title">${post.title}</h3>
              <p>${post.desc}</p>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAboutView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <section class="catalog-container">
      <h2 class="section-title">The Golap-Canon Heritage</h2>
      <p class="hero-description mt-3" style="font-size: 1.2rem; line-height: 1.8; text-align: center;">${AppState.pages.aboutText}</p>
    </section>
  `;
}

function renderContactView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <section class="catalog-container">
      <h2 class="section-title">Secure Support Portal</h2>
      <p class="text-center text-secondary mb-4" style="text-align: center; margin-bottom: 2rem;">${AppState.pages.contactDesc}</p>
      <form class="glassmorphism p-5 mt-4" style="max-width: 600px; margin: 0 auto; border-radius: 16px; padding: 2.5rem;" id="sys-contact-form">
        <div class="form-group mb-3" style="margin-bottom: 1rem;">
          <label>Full Name</label>
          <input type="text" required class="form-control" style="width: 100%;">
        </div>
        <div class="form-group mb-3" style="margin-bottom: 1rem;">
          <label>Email</label>
          <input type="email" required class="form-control" style="width: 100%;">
        </div>
        <div class="form-group mb-3" style="margin-bottom: 1.5rem;">
          <label>Inquiry Message</label>
          <textarea rows="4" required class="form-control" style="width: 100%; font-family: inherit;"></textarea>
        </div>
        <button type="submit" class="btn-primary w-100 mt-2" style="width: 100%;">Transmit Message</button>
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
      <div class="glassmorphism p-4 mt-4" style="border-radius: 16px; display: flex; flex-direction: column; gap: 1.5rem; padding: 2rem; max-width: 800px; margin: 2rem auto 0 auto;">
        ${AppState.pages.faq.map(item => `
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <h4 style="font-size: 1.15rem; color: var(--primary);"><i class="fa-solid fa-circle-question"></i> ${item.q}</h4>
            <p class="mt-1 text-secondary" style="margin-top: 0.5rem; line-height: 1.6;">${item.a}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderPrivacyView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `<section class="catalog-container" style="max-width: 800px; margin: 0 auto;"><h2 class="section-title">Privacy Policy</h2><p class="mt-3" style="line-height: 1.8; margin-top: 2rem;">${AppState.pages.privacy}</p></section>`;
}

function renderTermsView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `<section class="catalog-container" style="max-width: 800px; margin: 0 auto;"><h2 class="section-title">Terms & Conditions</h2><p class="mt-3" style="line-height: 1.8; margin-top: 2rem;">${AppState.pages.terms}</p></section>`;
}

function renderCheckoutView() {
  const app = document.getElementById("app-view");
  const subtotal = calculateCartSubtotal();
  const discount = AppState.activeCoupon ? (subtotal * (AppState.activeCoupon.discount / 100)) : 0;
  const grandTotal = subtotal - discount + CONFIG.deliveryFee;

  app.innerHTML = `
    <section class="checkout-view-layout">
      <div>
        <h2 class="section-title text-start mb-4" style="text-align: left; margin-bottom: 1.5rem;">Delivery & Checkout</h2>
        <form id="checkout-form" class="glassmorphism p-4" style="border-radius: 16px; padding: 2rem;">
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="chk-name" required placeholder="John Doe">
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" id="chk-phone" required placeholder="01XXXXXXXXX">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="chk-email" placeholder="name@example.com">
            </div>
            <div class="form-group">
              <label>Delivery Date</label>
              <input type="date" id="chk-date" required>
            </div>
            <div class="form-group flex-full">
              <label>Full Delivery Address</label>
              <textarea id="chk-address" rows="3" required placeholder="123 Road, Dhaka, Bangladesh"></textarea>
            </div>
            <div class="form-group flex-full">
              <label>Greeting Note / Custom Instructions</label>
              <textarea id="chk-message" rows="2" placeholder="Write your card message here..."></textarea>
            </div>
            <div class="form-group flex-full">
              <label>Payment Method</label>
              <div class="payment-selector">
                <div class="payment-card-option active" data-method="bKash">bKash</div>
                <div class="payment-card-option" data-method="Nagad">Nagad</div>
                <div class="payment-card-option" data-method="COD">Cash on Delivery</div>
              </div>
            </div>
          </div>
          <button type="submit" class="btn-primary w-100 mt-4" style="width: 100%; margin-top: 1.5rem;">Confirm order via WhatsApp</button>
        </form>
      </div>
      <div>
        <h2 class="section-title text-start mb-4" style="text-align: left; margin-bottom: 1.5rem;">Order Summary</h2>
        <div class="glassmorphism p-4" style="border-radius: 16px; padding: 2rem;">
          <div id="checkout-summary-items">
            ${AppState.cart.map(item => `
              <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                <span>${item.name} x ${item.qty}</span>
                <span>${item.price * item.qty} BDT</span>
              </div>
            `).join('')}
          </div>
          <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1rem 0;">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)} BDT</span>
          </div>
          <div class="summary-row">
            <span>Discount</span>
            <span>-${discount.toFixed(2)} BDT</span>
          </div>
          <div class="summary-row">
            <span>Delivery Fee</span>
            <span>${CONFIG.deliveryFee.toFixed(2)} BDT</span>
          </div>
          <div class="summary-total-row" style="font-size:1.4rem;">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)} BDT</span>
          </div>
        </div>
      </div>
    </section>
  `;

  setupCheckoutMechanics();
}

/**
 * ==========================================================================
 * REAL-TIME ADMIN INTERACTIVE HUB (EDIT & ADD MANAGEMENT SYSTEM)
 * ==========================================================================
 */
function renderAdminDashboardView() {
  const app = document.getElementById("app-view");
  app.innerHTML = `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2 style="font-family:var(--font-heading); color:var(--primary);"><i class="fa-solid fa-user-shield"></i> HQ Console</h2>
        <nav class="admin-nav">
          <button class="admin-nav-btn active" data-view="overview"><i class="fa-solid fa-chart-line"></i> Dashboard</button>
          <button class="admin-nav-btn" data-view="products"><i class="fa-solid fa-gift"></i> Products</button>
          <button class="admin-nav-btn" data-view="website-pages"><i class="fa-solid fa-file-pen"></i> Edit Web Pages</button>
          <button class="admin-nav-btn" data-view="orders"><i class="fa-solid fa-receipt"></i> Orders (${AppState.orders.length})</button>
          <button class="admin-nav-btn" data-view="bookings"><i class="fa-solid fa-calendar-check"></i> Events (${AppState.bookings.length})</button>
          <button class="admin-nav-btn" data-view="settings"><i class="fa-solid fa-sliders"></i> System Config</button>
        </nav>
      </aside>

      <section class="admin-content-area" id="admin-main-stage">
        <!-- Dashboard views inject here dynamically -->
      </section>
    </div>
  `;

  document.querySelectorAll(".admin-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      switchAdminSubView(btn.getAttribute("data-view"));
    });
  });

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
      const category = prompt("Enter Category (" + AppState.categories.join(' / ') + "):");
      const img = prompt("Enter Image URL:", "https://images.unsplash.com/photo-1526047932273-341f2a7631f9");

      if (name && price && category && img) {
        const newP = {
          id: `p${AppState.products.length + 1}`,
          name, price, category, stock: 10, rating: 5, banner: img
        };
        AppState.products.push(newP);
        localStorage.setItem("g_products", JSON.stringify(AppState.products));
        showToast("Catalog Expanded!");
        switchAdminSubView("products");
      }
    });
  } 
  
  else if (subview === "website-pages") {
    stage.innerHTML = `
      <div class="admin-action-bar">
        <h2>Website Content Orchestrator (Full Access)</h2>
      </div>

      <!-- Tab Selection System for Admin Workspace -->
      <div class="filter-tabs" style="margin-bottom: 2rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="filter-tab active editor-tab-btn" data-target="editor-core">Core Pages Copy</button>
        <button class="filter-tab editor-tab-btn" data-target="editor-categories">Shop Categories</button>
        <button class="filter-tab editor-tab-btn" data-target="editor-events">Event Packages</button>
        <button class="filter-tab editor-tab-btn" data-target="editor-faq">FAQ Q&As</button>
        <button class="filter-tab editor-tab-btn" data-target="editor-blogs-gallery">Blogs & Gallery</button>
      </div>

      <!-- TAB 1: CORE PAGES COPY -->
      <div class="admin-card-box editor-section-panel" id="editor-core" style="display: block;">
        <h3>Core System Layout & Text Controls</h3>
        <form id="edit-core-copy-form" class="mt-3">
          <div class="form-group mb-3">
            <label>Hero Title</label>
            <input type="text" id="adm-hero-title" value="${AppState.pages.heroTitle}" required style="width: 100%;">
          </div>
          <div class="form-group mb-3">
            <label>Hero Description</label>
            <textarea id="adm-hero-desc" rows="3" style="width: 100%; font-family:inherit; padding:0.8rem; border-radius:8px; border:1px solid var(--border-color);">${AppState.pages.heroDesc}</textarea>
          </div>
          <div class="form-group mb-3">
            <label>Hero Banner Image URL</label>
            <input type="text" id="adm-hero-img" value="${AppState.pages.heroImg}" required style="width: 100%;">
          </div>
          <hr style="margin: 2rem 0; border: 0; border-top: 1px solid var(--border-color);">
          <div class="form-group mb-3">
            <label>About Us Section Copy</label>
            <textarea id="adm-about-text" rows="4" style="width: 100%; padding:0.8rem; border-radius:8px; border:1px solid var(--border-color); font-family:inherit;">${AppState.pages.aboutText}</textarea>
          </div>
          <div class="form-group mb-3">
            <label>Contact Page Description Note</label>
            <textarea id="adm-contact-desc" rows="3" style="width: 100%; padding:0.8rem; border-radius:8px; border:1px solid var(--border-color); font-family:inherit;">${AppState.pages.contactDesc}</textarea>
          </div>
          <div class="form-group mb-3">
            <label>Privacy Policy Content</label>
            <textarea id="adm-privacy-text" rows="3" style="width: 100%; padding:0.8rem; border-radius:8px; border:1px solid var(--border-color); font-family:inherit;">${AppState.pages.privacy}</textarea>
          </div>
          <div class="form-group mb-3">
            <label>Terms & Conditions Content</label>
            <textarea id="adm-terms-text" rows="3" style="width: 100%; padding:0.8rem; border-radius:8px; border:1px solid var(--border-color); font-family:inherit;">${AppState.pages.terms}</textarea>
          </div>
          <button type="submit" class="btn-primary">Commit All Core Copy Changes</button>
        </form>
      </div>

      <!-- TAB 2: SHOP CATEGORIES -->
      <div class="admin-card-box editor-section-panel" id="editor-categories" style="display: none;">
        <h3>Manage Shop Filtering Categories</h3>
        <p class="text-secondary mb-3" style="margin-bottom: 1rem;">These match product category fields and dynamically populate filter tags on the shop page.</p>
        
        <div class="form-group inline-group mb-4" style="display:flex; gap:1rem; margin-bottom: 1.5rem;">
          <input type="text" id="new-category-input" placeholder="New Category Name (e.g. Orchids)..." style="flex:1; padding: 0.8rem;">
          <button class="btn-primary" id="adm-add-cat-btn">Create Category</button>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th style="width: 100px; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${AppState.categories.map((cat, index) => `
                <tr>
                  <td><strong>${cat}</strong></td>
                  <td style="text-align: right;">
                    <button onclick="removeCategory(${index})" class="text-danger" style="font-size:1.1rem; padding:0.5rem;"><i class="fa-solid fa-trash-can"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: EVENT PACKAGES -->
      <div class="admin-card-box editor-section-panel" id="editor-events" style="display: none;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
          <h3>Manage Event Solutions Portfolio</h3>
          <button class="btn-primary" id="adm-add-event-btn"><i class="fa-solid fa-plus"></i> Add Event Solution</button>
        </div>
        
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Description Summary</th>
                <th style="width: 100px; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${AppState.events.map(evt => `
                <tr>
                  <td><img src="${evt.banner}" class="table-img" alt=""></td>
                  <td><strong>${evt.title}</strong></td>
                  <td>${evt.desc}</td>
                  <td style="text-align: right;">
                    <button onclick="removeEventPackage('${evt.id}')" class="text-danger" style="font-size:1.1rem; padding:0.5rem;"><i class="fa-solid fa-trash-can"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: FAQ MANAGER -->
      <div class="admin-card-box editor-section-panel" id="editor-faq" style="display: none;">
        <h3>Frequently Asked Questions Manager</h3>
        
        <form id="adm-add-faq-form" class="mt-3 mb-4 p-3" style="background:rgba(var(--primary-rgb),0.02); border-radius:8px; border:1px solid var(--border-color); padding: 1.5rem; margin-bottom: 2rem;">
          <h4 class="mb-2">Add New Q&A Element</h4>
          <div class="form-group mb-2">
            <label>Question</label>
            <input type="text" id="new-faq-q" required placeholder="e.g. Do you ship outside Dhaka?">
          </div>
          <div class="form-group mb-2">
            <label>Detailed Answer</label>
            <textarea id="new-faq-a" required rows="2" style="font-family:inherit; width: 100%; padding:0.5rem; border-radius:8px; border:1px solid var(--border-color);"></textarea>
          </div>
          <button type="submit" class="btn-secondary py-1 px-3 mt-2" style="font-size:0.9rem;">Add FAQ Pair</button>
        </form>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th style="width: 100px; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${AppState.pages.faq.map((item, index) => `
                <tr>
                  <td><strong>${item.q}</strong></td>
                  <td>${item.a}</td>
                  <td style="text-align: right;">
                    <button onclick="removeFAQ(${index})" class="text-danger" style="font-size:1.1rem; padding:0.5rem;"><i class="fa-solid fa-trash-can"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 5: BLOGS & GALLERY -->
      <div class="editor-section-panel" id="editor-blogs-gallery" style="display: none;">
        <div class="admin-card-box">
          <div class="d-flex justify-content-between align-items-center mb-3" style="display:flex; justify-content:space-between;">
            <h3>Manage Journal Blogs</h3>
            <button class="btn-primary py-1 px-3" id="adm-add-blog-btn" style="font-size:0.85rem;"><i class="fa-solid fa-plus"></i> Add New Post</button>
          </div>
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Banner</th>
                  <th>Blog Title</th>
                  <th>Published Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${AppState.blog.map(post => `
                  <tr>
                    <td><img src="${post.banner}" class="table-img" alt=""></td>
                    <td>${post.title}</td>
                    <td>${post.date}</td>
                    <td>
                      <button onclick="removeBlogPost('${post.id}')" class="text-danger"><i class="fa-solid fa-trash"></i></button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="admin-card-box">
          <h3>Manage Visual Gallery Items</h3>
          <div class="form-group inline-group mt-3" style="display:flex; gap:1rem; margin-bottom: 1.5rem;">
            <input type="text" id="new-gallery-url" placeholder="Paste Image URL here..." style="flex:1;">
            <button class="btn-secondary" id="adm-add-gallery-btn">Add Image</button>
          </div>
          <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap:1rem;">
            ${AppState.gallery.map((img, index) => `
              <div style="position:relative; aspect-ratio:1;">
                <img src="${img}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                <button onclick="removeGalleryItem(${index})" style="position:absolute; top:5px; right:5px; background:rgba(255,255,255,0.9); color:red; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.2);"><i class="fa-solid fa-xmark"></i></button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setupWebsiteEditorListeners();
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
      
      const waWidget = document.getElementById("whatsapp-widget-anchor");
      if (waWidget) waWidget.href = `https://wa.me/${CONFIG.adminWhatsApp}`;

      showToast("Operational configuration updated successfully!");
    });
  }
}

/**
 * ==========================================================================
 * WEB EDIT & SYSTEM ACTION LISTENERS
 * ==========================================================================
 */
function setupWebsiteEditorListeners() {
  // Website Pages Admin Sub-Tabs Toggle Action
  document.querySelectorAll(".editor-tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".editor-tab-btn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-target");
      document.querySelectorAll(".editor-section-panel").forEach(p => p.style.display = "none");
      document.getElementById(target).style.display = "block";
    });
  });

  // Tab 1: Update Core App Copy
  document.getElementById("edit-core-copy-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    AppState.pages.heroTitle = document.getElementById("adm-hero-title").value;
    AppState.pages.heroDesc = document.getElementById("adm-hero-desc").value;
    AppState.pages.heroImg = document.getElementById("adm-hero-img").value;
    AppState.pages.aboutText = document.getElementById("adm-about-text").value;
    AppState.pages.contactDesc = document.getElementById("adm-contact-desc").value;
    AppState.pages.privacy = document.getElementById("adm-privacy-text").value;
    AppState.pages.terms = document.getElementById("adm-terms-text").value;
    
    localStorage.setItem("g_pages", JSON.stringify(AppState.pages));
    showToast("Core system layouts and content updated!");
  });

  // Tab 2: Create Shop Category
  document.getElementById("adm-add-cat-btn")?.addEventListener("click", () => {
    const input = document.getElementById("new-category-input");
    const catName = input.value.trim();
    if (catName) {
      if (AppState.categories.includes(catName)) {
        showToast("Category already exists!", "error");
        return;
      }
      AppState.categories.push(catName);
      localStorage.setItem("g_categories", JSON.stringify(AppState.categories));
      showToast("New category initialized successfully!");
      input.value = "";
      switchAdminSubView("website-pages");
    } else {
      showToast("Please enter a valid category name", "error");
    }
  });

  // Tab 3: Create Dynamic Event Package
  document.getElementById("adm-add-event-btn")?.addEventListener("click", () => {
    const title = prompt("Enter Event Category Title:");
    const desc = prompt("Enter Event Service Description Summary:");
    const banner = prompt("Enter Event Graphic Banner URL:", "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600");

    if (title && desc && banner) {
      const newEvt = {
        id: `e${AppState.events.length + 1}`,
        title,
        desc,
        banner
      };
      AppState.events.push(newEvt);
      localStorage.setItem("g_events", JSON.stringify(AppState.events));
      showToast("Event solution appended to dynamic packages!");
      switchAdminSubView("website-pages");
    }
  });

  // Tab 4: Add FAQ Pair
  document.getElementById("adm-add-faq-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("new-faq-q").value.trim();
    const a = document.getElementById("new-faq-a").value.trim();

    if (q && a) {
      AppState.pages.faq.push({ q, a });
      localStorage.setItem("g_pages", JSON.stringify(AppState.pages));
      showToast("Dynamic FAQ Element Added!");
      e.target.reset();
      switchAdminSubView("website-pages");
    }
  });

  // Tab 5: Add Blog Item
  document.getElementById("adm-add-blog-btn")?.addEventListener("click", () => {
    const title = prompt("Enter Blog Title:");
    const desc = prompt("Enter Blog Summary description:");
    const banner = prompt("Enter Blog Image URL:", "https://images.unsplash.com/photo-1526047932273-341f2a7631f9");
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (title && desc && banner) {
      const newPost = {
        id: `b${AppState.blog.length + 1}`,
        date,
        title,
        desc,
        banner
      };
      AppState.blog.push(newPost);
      localStorage.setItem("g_blog", JSON.stringify(AppState.blog));
      showToast("New article added to Journal!");
      switchAdminSubView("website-pages");
    }
  });

  // Tab 5: Add Gallery Link
  document.getElementById("adm-add-gallery-btn")?.addEventListener("click", () => {
    const input = document.getElementById("new-gallery-url");
    const url = input.value.trim();
    if (url) {
      AppState.gallery.push(url);
      localStorage.setItem("g_gallery", JSON.stringify(AppState.gallery));
      showToast("Gallery refreshed!");
      input.value = "";
      switchAdminSubView("website-pages");
    } else {
      showToast("Please enter a valid Image URL", "error");
    }
  });
}

// Global window functions for list deletions inside website editor
window.removeCategory = function(index) {
  AppState.categories.splice(index, 1);
  localStorage.setItem("g_categories", JSON.stringify(AppState.categories));
  showToast("Filtering category deleted");
  switchAdminSubView("website-pages");
};

window.removeEventPackage = function(id) {
  AppState.events = AppState.events.filter(e => e.id !== id);
  localStorage.setItem("g_events", JSON.stringify(AppState.events));
  showToast("Event package deleted!");
  switchAdminSubView("website-pages");
};

window.removeFAQ = function(index) {
  AppState.pages.faq.splice(index, 1);
  localStorage.setItem("g_pages", JSON.stringify(AppState.pages));
  showToast("FAQ dynamic Q&A deleted");
  switchAdminSubView("website-pages");
};

window.removeBlogPost = function(blogId) {
  AppState.blog = AppState.blog.filter(post => post.id !== blogId);
  localStorage.setItem("g_blog", JSON.stringify(AppState.blog));
  showToast("Article deleted from record");
  switchAdminSubView("website-pages");
};

window.removeGalleryItem = function(index) {
  AppState.gallery.splice(index, 1);
  localStorage.setItem("g_gallery", JSON.stringify(AppState.gallery));
  showToast("Image removed from exhibition");
  switchAdminSubView("website-pages");
};

window.removeProduct = function(prodId) {
  AppState.products = AppState.products.filter(p => p.id !== prodId);
  localStorage.setItem("g_products", JSON.stringify(AppState.products));
  showToast("Product deleted from view");
  switchAdminSubView("products");
};

/**
 * ==========================================================================
 * CART STATE & SYNC MECHANICS
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
  const totalCount = AppState.cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-badge").innerText = totalCount;

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
        <button class="text-danger" onclick="removeFromCart('${item.id}')" style="align-self:center; background:none; border:none; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');
  }

  const subtotal = calculateCartSubtotal();
  const discount = AppState.activeCoupon ? (subtotal * (AppState.activeCoupon.discount / 100)) : 0;
  const grandTotal = subtotal - discount;

  document.getElementById("cart-subtotal").innerText = `${subtotal.toFixed(2)} BDT`;
  document.getElementById("cart-discount").innerText = `-${discount.toFixed(2)} BDT`;
  document.getElementById("cart-grand-total").innerText = `${grandTotal.toFixed(2)} BDT`;
}

/**
 * ==========================================================================
 * WISHLIST STATE
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
          <button class="btn-primary py-1 px-2 mt-2" onclick="addToCart('${item.id}')" style="font-size:0.8rem; padding: 0.4rem 0.8rem;">Add to Cart</button>
        </div>
        <button class="text-danger" onclick="toggleWishlist('${item.id}')" style="align-self:center; background:none; border:none; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
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
        <h2 class="section-title text-start mb-2" style="font-size:2rem; text-align: left;">${product.name}</h2>
        <div class="rating-row" style="margin-bottom: 1rem;">
          ${`<i class="fa-solid fa-star"></i>`.repeat(Math.floor(product.rating))}
          <span>(${product.rating})</span>
        </div>
        <p class="text-secondary mb-4" style="margin-bottom: 1.5rem;">Premium designer arrangement of freshest flowers handpicked and styled beautifully by master florists.</p>
        <div class="mb-4" style="margin-bottom: 1.5rem;">
          <span style="font-size:1.8rem; font-weight:800; color:var(--primary);">${product.price} BDT</span>
        </div>
        <div style="display:flex; gap:1rem;">
          <button class="btn-primary w-100" onclick="addToCart('${product.id}')" style="width: 100%;">Add to Cart</button>
          <button class="btn-outline" onclick="toggleWishlist('${product.id}')"><i class="fa-solid fa-heart"></i></button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("quickview-modal").classList.add("active");
}

/**
 * ==========================================================================
 * WHATSAPP CHECKOUT LOGICS
 * ==========================================================================
 */
function setupCheckoutMechanics() {
  const checkoutForm = document.getElementById("checkout-form");
  if (!checkoutForm) return;

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
    const activePaymentOpt = document.querySelector(".payment-card-option.active");
    const payment = activePaymentOpt ? activePaymentOpt.getAttribute("data-method") : "COD";

    const orderId = `GC-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = calculateCartSubtotal();
    const discount = AppState.activeCoupon ? (subtotal * (AppState.activeCoupon.discount / 100)) : 0;
    const grandTotal = subtotal - discount + CONFIG.deliveryFee;

    const itemsDescription = AppState.cart.map(item => `• ${item.name} (Qty: ${item.qty})`).join("\n");

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
      AppState.cart = [];
      updateCartState();
      window.open(whatsappURL, "_blank");
      window.location.hash = "home";
    }, 1500);
  });
}

/**
 * ==========================================================================
 * EVENT BOOKINGS
 * ==========================================================================
 */
function setupEventButtonListeners() {
  document.querySelectorAll(".open-evt-modal").forEach(btn => {
    btn.addEventListener("click", () => {
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

function setupProductGrid(targetId, productList) {
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

  setupProductGrid("shop-items-grid", filtered);
}

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
  initLocalStorageEngine();
  updateCartState();
  updateWishlistState();
  initThemeController();
  initSearchEngine();

  const waWidget = document.getElementById("whatsapp-widget-anchor");
  if (waWidget) waWidget.href = `https://wa.me/${CONFIG.adminWhatsApp}`;

  AppRouter.init();

  // Mobile Drawer Toggle
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

  document.getElementById("close-quickview-modal")?.addEventListener("click", () => {
    document.getElementById("quickview-modal").classList.remove("active");
  });

  // Auth Dialog setups
  const authModal = document.getElementById("auth-modal");
  document.getElementById("auth-toggle-btn")?.addEventListener("click", () => {
    if (AppState.user) {
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

  // Tab routing inside Auth Dialog
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

  // Simulated Identity Provider Framework
  document.getElementById("login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    
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

  // Search Toggle Logic
  document.getElementById("search-toggle")?.addEventListener("click", () => {
    const searchBar = document.getElementById("search-overlay-bar");
    searchBar.style.display = searchBar.style.display === "block" ? "none" : "block";
  });
  document.getElementById("close-search")?.addEventListener("click", () => {
    document.getElementById("search-overlay-bar").style.display = "none";
  });
});