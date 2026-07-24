/**
 * ==========================================================================
 * 1. FIREBASE CONFIGURATION & INITIALIZATION
 * ==========================================================================
 */
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

let db, auth, storage;
let isFirebaseActive = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();
    isFirebaseActive = true;
    console.log("Firebase initialized.");
  } else {
    console.warn("Using Fallback Local Storage Mode. Set valid Firebase config keys to enable live synchronization.");
  }
} catch (error) {
  console.warn("Firebase startup failed; switching to local sandbox fallback mode.", error);
}

/**
 * ==========================================================================
 * 2. SEED DATA & LOCAL STORAGE LAYER
 * ==========================================================================
 */
const defaultSeedData = {
  products: [
    { id: "p1", name: "Modern Minimalist Vase", category: "decor", price: 85, salePrice: 65, image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=80", rating: 5, specs: "Handmade ceramic style, matte texture.", featured: true },
    { id: "p2", name: "Premium Scented Candle", category: "wellness", price: 40, salePrice: null, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80", rating: 4, specs: "Soy wax blend, organic cotton wick.", featured: true },
    { id: "p3", name: "Terracotta Flower Pot", category: "garden", price: 55, salePrice: 45, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80", rating: 5, specs: "Natural clay terracotta material.", featured: false },
    { id: "p4", name: "Abstract Canvas Set", category: "decor", price: 120, salePrice: 95, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80", rating: 5, specs: "Acrylic paints on custom framed canvas.", featured: true }
  ],
  categories: [
    { id: "c1", slug: "decor", name: "Home Decor", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=150&q=80" },
    { id: "c2", slug: "wellness", name: "Wellness & Fragrance", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=150&q=80" },
    { id: "c3", slug: "garden", name: "Garden Setup", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=150&q=80" }
  ],
  heroSlides: [
    { id: "s1", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80", heading: "Modern Living Redefined", subheading: "Premium organic home decorations customized for your taste.", link: "#shop" },
    { id: "s2", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80", heading: "Bespoke Spatial Design", subheading: "Turn your event venue into an artistic experience.", link: "#events" }
  ],
  offers: [
    { id: "o1", title: "Inaugural Seasonal Offer", subtitle: "Take benefit of discount on all home decor items", code: "WELCOME10", link: "#shop" }
  ],
  packages: [
    { id: "pk1", title: "Platinum Gala Setup", price: 1200, banner: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80", inclusion: "Full Stage Backdrop & Floral Arrangements", features: ["Up to 250 Guests Accommodation", "Premium Lighting System", "Digital Event Consultation Coordinator"] }
  ],
  gallery: [
    { id: "g1", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80", label: "Grand Ballroom Arrangement", tag: "events" },
    { id: "g2", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80", label: "Minimalist Pottery Display", tag: "decor" }
  ],
  blog: [
    { id: "b1", title: "Styling Your Dining Area", category: "Home Styling", content: "Dining spaces are central gathering points. Enhance them using earthy ceramic bases, dynamic candle clusters, and tailored tablescapes.", excerpt: "How to style beautiful contemporary spaces.", author: "Design Team", date: "2026-03-12", cover: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80" }
  ],
  reviews: [
    { id: "r1", author: "Sarah Jenkins", text: "The platinum gala arrangement was exceptional! Every guest admired the structural design and attention to floral selection.", rating: 5, date: "2026-04-10" }
  ],
  settings: {
    title: "Vivid Spaces",
    metaDesc: "Exclusive bespoke decorations and event arrangement services.",
    logoUrl: "https://placehold.co/200x60/4f46e5/ffffff?text=Vivid+Spaces",
    faviconUrl: "https://placehold.co/32x32/4f46e5/ffffff?text=VS",
    primaryColor: "#4f46e5",
    secondaryColor: "#06b6d4",
    whatsappNumber: "15550192834",
    currency: "$",
    address: "742 Evergreen Terrace, Springfield",
    phone: "+1 (555) 019-2834"
  },
  orders: [],
  bookings: []
};

const state = {
  products: [],
  categories: [],
  heroSlides: [],
  offers: [],
  packages: [],
  gallery: [],
  blog: [],
  reviews: [],
  settings: {},
  orders: [],
  bookings: [],
  cart: [],
  wishlist: [],
  currentUser: null,
  activeTheme: "light",
  activeView: "home",
  activeAdminTab: "stats",
  currentHeroIndex: 0,
  activeGalleryFilter: "all"
};

function fetchStorageCollection(key) {
  const localData = localStorage.getItem(`cms_data_${key}`);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {
      return defaultSeedData[key];
    }
  }
  localStorage.setItem(`cms_data_${key}`, JSON.stringify(defaultSeedData[key]));
  return defaultSeedData[key];
}

function updateStorageCollection(key, data) {
  localStorage.setItem(`cms_data_${key}`, JSON.stringify(data));
}

async function syncPlatformData() {
  if (isFirebaseActive) {
    try {
      state.products = await getFirestoreCollection("products");
      state.categories = await getFirestoreCollection("categories");
      state.heroSlides = await getFirestoreCollection("heroSlides");
      state.offers = await getFirestoreCollection("offers");
      state.packages = await getFirestoreCollection("packages");
      state.gallery = await getFirestoreCollection("gallery");
      state.blog = await getFirestoreCollection("blog");
      state.reviews = await getFirestoreCollection("reviews");
      state.orders = await getFirestoreCollection("orders");
      state.bookings = await getFirestoreCollection("bookings");
      
      const setDoc = await db.collection("settings").doc("global").get();
      if (setDoc.exists) {
        state.settings = setDoc.data();
      } else {
        state.settings = defaultSeedData.settings;
        await db.collection("settings").doc("global").set(state.settings);
      }
    } catch (err) {
      console.warn("Failed to retrieve live data from Firestore. Reverting to sandboxed LocalStorage.", err);
      fallbackToSandbox();
    }
  } else {
    fallbackToSandbox();
  }
  applySystemDesignSettings();
  renderApp();
}

function fallbackToSandbox() {
  state.products = fetchStorageCollection("products");
  state.categories = fetchStorageCollection("categories");
  state.heroSlides = fetchStorageCollection("heroSlides");
  state.offers = fetchStorageCollection("offers");
  state.packages = fetchStorageCollection("packages");
  state.gallery = fetchStorageCollection("gallery");
  state.blog = fetchStorageCollection("blog");
  state.reviews = fetchStorageCollection("reviews");
  state.settings = fetchStorageCollection("settings");
  state.orders = fetchStorageCollection("orders") || [];
  state.bookings = fetchStorageCollection("bookings") || [];
}

async function getFirestoreCollection(colName) {
  const snap = await db.collection(colName).get();
  const arr = [];
  snap.forEach(doc => {
    arr.push({ id: doc.id, ...doc.data() });
  });
  if (arr.length === 0) {
    for (let item of defaultSeedData[colName]) {
      const { id, ...dataNoId } = item;
      await db.collection(colName).doc(id).set(dataNoId);
      arr.push(item);
    }
  }
  return arr;
}

async function saveEntityItem(collectionKey, entityId, payload) {
  if (isFirebaseActive) {
    try {
      if (entityId) {
        await db.collection(collectionKey).doc(entityId).set(payload, { merge: true });
      } else {
        const docRef = await db.collection(collectionKey).add(payload);
        payload.id = docRef.id;
      }
    } catch (e) {
      console.error("Firestore Save Error", e);
    }
  }
  
  const collectionList = fetchStorageCollection(collectionKey);
  if (entityId) {
    const idx = collectionList.findIndex(x => x.id === entityId);
    if (idx !== -1) collectionList[idx] = { id: entityId, ...payload };
  } else {
    payload.id = "gen_" + Date.now();
    collectionList.push(payload);
  }
  updateStorageCollection(collectionKey, collectionList);
  await syncPlatformData();
}

async function removeEntityItem(collectionKey, entityId) {
  if (isFirebaseActive) {
    try {
      await db.collection(collectionKey).doc(entityId).delete();
    } catch (e) {
      console.error("Firestore Delete Error", e);
    }
  }
  const collectionList = fetchStorageCollection(collectionKey);
  const updated = collectionList.filter(x => x.id !== entityId);
  updateStorageCollection(collectionKey, updated);
  await syncPlatformData();
}

/**
 * ==========================================================================
 * 3. STYLE & SEO INJECTION HOOKS
 * ==========================================================================
 */
function applySystemDesignSettings() {
  const s = state.settings;
  if (!s) return;
  
  document.title = s.title || "Vivid Spaces Platform";
  const metaDescTag = document.querySelector('meta[name="description"]');
  if (metaDescTag) metaDescTag.setAttribute("content", s.metaDesc || "");
  
  const logoElements = ["site-logo", "mobile-site-logo", "footer-site-logo"];
  logoElements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = s.logoUrl || "https://placehold.co/150x50";
  });
  
  const fav = document.getElementById("favicon");
  if (fav) fav.href = s.faviconUrl || "https://placehold.co/32x32";

  const pCol = s.primaryColor || "#4f46e5";
  const sCol = s.secondaryColor || "#06b6d4";
  const customCss = `
    :root {
      --primary-color: ${pCol} !important;
      --secondary-color: ${sCol} !important;
    }
    .active-nav-border {
      border-color: ${pCol} !important;
    }
  `;
  document.getElementById("dynamic-accent-styles").innerHTML = customCss;

  const whatsAppAnchor = document.getElementById("floating-whatsapp-btn");
  if (whatsAppAnchor) {
    whatsAppAnchor.href = `https://wa.me/${s.whatsappNumber || "15550192834"}`;
  }

  const fAddress = document.getElementById("footer-address");
  if (fAddress) fAddress.textContent = s.address || "";
  const fPhone = document.getElementById("footer-phone");
  if (fPhone) fPhone.textContent = s.phone || "";
}

/**
 * ==========================================================================
 * 4. AUTHENTICATION & ROLE-BASED ACCESS CONTROL
 * ==========================================================================
 */
async function handleAuthSubmit(e, mode) {
  e.preventDefault();
  const email = document.getElementById(`${mode}-email`).value;
  const password = document.getElementById(`${mode}-password`).value;
  const name = mode === 'register' ? document.getElementById("register-name").value : null;
  const statusMsg = document.getElementById("auth-status-msg");
  statusMsg.style.display = "none";

  if (isFirebaseActive) {
    try {
      if (mode === 'register') {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection("users").doc(cred.user.uid).set({
          name: name,
          email: email,
          role: "user"
        });
        state.currentUser = { id: cred.user.uid, name, email, role: "user" };
      } else {
        const cred = await auth.signInWithEmailAndPassword(email, password);
        const userDoc = await db.collection("users").doc(cred.user.uid).get();
        if (userDoc.exists) {
          state.currentUser = { id: cred.user.uid, ...userDoc.data() };
        } else {
          state.currentUser = { id: cred.user.uid, email: cred.user.email, role: "admin" };
        }
      }
      showToast("Authentication Successful!", "success");
      navigateTo("home");
    } catch (err) {
      statusMsg.style.display = "block";
      statusMsg.textContent = err.message;
    }
  } else {
    if (mode === 'register') {
      const sandboxUser = { id: "sb_" + Date.now(), name, email, role: "user" };
      localStorage.setItem("sandbox_user", JSON.stringify(sandboxUser));
      state.currentUser = sandboxUser;
    } else {
      if (email.toLowerCase().includes("admin")) {
        state.currentUser = { id: "sb_admin", name: "Administrator", email, role: "admin" };
      } else {
        state.currentUser = { id: "sb_user", name: "Standard Guest", email, role: "user" };
      }
      localStorage.setItem("sandbox_user", JSON.stringify(state.currentUser));
    }
    showToast(`Logged In as ${state.currentUser.role.toUpperCase()}`, "success");
    navigateTo("home");
  }
}

function handleAuthLogout() {
  if (isFirebaseActive) auth.signOut();
  localStorage.removeItem("sandbox_user");
  state.currentUser = null;
  showToast("Logged out successfully.", "success");
  navigateTo("home");
}

function handleProfileNav() {
  if (state.currentUser) {
    if (state.currentUser.role === 'admin') {
      navigateTo("admin");
    } else {
      showToast(`Logged in: ${state.currentUser.name || state.currentUser.email}`, "success");
    }
  } else {
    navigateTo("auth");
  }
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById("auth-login-form");
  const registerForm = document.getElementById("auth-register-form");
  const tabBtns = document.querySelectorAll(".auth-tab-btn");
  
  if (tab === 'login') {
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    tabBtns[0].classList.add("active");
    tabBtns[1].classList.remove("active");
  } else {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
    tabBtns[0].classList.remove("active");
    tabBtns[1].classList.add("active");
  }
}

/**
 * ==========================================================================
 * 5. ROUTING SYSTEM & NAVIGATION
 * ==========================================================================
 */
function navigateTo(viewId) {
  state.activeView = viewId;
  
  // Toggle Visibility Classes
  document.querySelectorAll(".app-view").forEach(el => {
    el.classList.remove("active");
  });
  
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add("active");
  }

  // --- HEADER & FOOTER HIDING LOGIC FOR ADMIN VIEW ---
  const mainHeader = document.querySelector(".main-header");
  const mobileHeader = document.querySelector(".mobile-header");
  const mobileBottomNav = document.querySelector(".mobile-bottom-nav");
  const footer = document.querySelector(".footer-section");

  if (viewId === "admin") {
    if (mainHeader) mainHeader.style.setProperty("display", "none", "important");
    if (mobileHeader) mobileHeader.style.setProperty("display", "none", "important");
    if (mobileBottomNav) mobileBottomNav.style.setProperty("display", "none", "important");
    if (footer) footer.style.setProperty("display", "none", "important");
  } else {
    if (mainHeader) {
      if (window.innerWidth > 992) {
        mainHeader.style.setProperty("display", "block", "important");
      } else {
        mainHeader.style.setProperty("display", "none", "important");
      }
    }
    if (mobileHeader) {
      if (window.innerWidth <= 992) {
        mobileHeader.style.setProperty("display", "block", "important");
      } else {
        mobileHeader.style.setProperty("display", "none", "important");
      }
    }
    if (mobileBottomNav) {
      if (window.innerWidth <= 992) {
        mobileBottomNav.style.setProperty("display", "grid", "important");
      } else {
        mobileBottomNav.style.setProperty("display", "none", "important");
      }
    }
    if (footer) {
      footer.style.setProperty("display", "block", "important");
    }
  }
  // ----------------------------------------------------

  document.querySelectorAll(".nav-link").forEach(lnk => {
    if (lnk.getAttribute("href") === `#${viewId}`) {
      lnk.classList.add("active");
    } else {
      lnk.classList.remove("active");
    }
  });

  document.querySelectorAll(".mobile-nav-tab").forEach(tab => {
    if (tab.getAttribute("href") === `#${viewId}`) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * ==========================================================================
 * 6. THEME MANAGEMENT
 * ==========================================================================
 */
function toggleTheme() {
  const htmlTag = document.documentElement;
  const current = htmlTag.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  htmlTag.setAttribute("data-theme", next);
  state.activeTheme = next;

  const desktopIcon = document.querySelector("#theme-toggle-btn i");
  if (desktopIcon) {
    desktopIcon.className = next === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  const mobileIcon = document.getElementById("mobile-theme-icon");
  if (mobileIcon) {
    mobileIcon.className = next === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

/**
 * ==========================================================================
 * 7. HOME VIEW RENDERING
 * ==========================================================================
 */
function renderHomeView() {
  const slidesWrapper = document.getElementById("hero-slides-wrapper");
  const dotsContainer = document.getElementById("slider-dots-container");
  
  if (slidesWrapper && state.heroSlides.length > 0) {
    slidesWrapper.innerHTML = state.heroSlides.map(slide => `
      <div class="hero-slide-item" style="background-image: url('${slide.image}')">
        <div class="hero-slide-content">
          <h1>${slide.heading}</h1>
          <p>${slide.subheading}</p>
          <a href="${slide.link || '#shop'}" class="btn btn-primary">Discover More</a>
        </div>
      </div>
    `).join("");

    dotsContainer.innerHTML = state.heroSlides.map((_, idx) => `
      <span class="slider-dot ${idx === state.currentHeroIndex ? 'active' : ''}" onclick="setSliderItem(${idx})"></span>
    `).join("");
    
    slidesWrapper.style.transform = `translateX(-${state.currentHeroIndex * 100}%)`;
  }

  const catGrid = document.getElementById("categories-home-grid");
  if (catGrid) {
    catGrid.innerHTML = state.categories.map(c => `
      <div class="category-card" onclick="setShopCategoryAndNavigate('${c.slug}')">
        <img src="${c.image || 'https://placehold.co/150'}" alt="${c.name}" class="category-card-img">
        <h3>${c.name}</h3>
      </div>
    `).join("");
  }

  const offerSection = document.getElementById("offers-banner-container");
  if (offerSection && state.offers.length > 0) {
    const o = state.offers[0];
    offerSection.innerHTML = `
      <div class="offer-banner">
        <div class="offer-info">
          <h2>${o.title}</h2>
          <p>${o.subtitle}</p>
          <div class="coupon-tag">COUPON CODE: ${o.code}</div>
        </div>
        <a href="${o.link || '#shop'}" class="btn btn-secondary">Shop Promo Offer Now</a>
      </div>
    `;
  } else if (offerSection) {
    offerSection.innerHTML = "";
  }

  const featuredGrid = document.getElementById("featured-products-grid");
  if (featuredGrid) {
    const featured = state.products.filter(p => p.featured);
    featuredGrid.innerHTML = featured.map(p => renderSingleProductHTML(p)).join("");
  }

  const reviewsCont = document.getElementById("reviews-home-container");
  if (reviewsCont) {
    reviewsCont.innerHTML = state.reviews.map(r => `
      <div class="review-quote-card">
        <div class="product-rating">${"★".repeat(r.rating || 5)}</div>
        <p>"${r.text}"</p>
        <div class="review-user-row">
          <div class="review-avatar-text">${(r.author || "G").charAt(0)}</div>
          <div>
            <strong>${r.author || "Guest"}</strong>
            <div style="font-size:11px; color:var(--text-muted);">${r.date || "March 2026"}</div>
          </div>
        </div>
      </div>
    `).join("");
  }

  const blogHomeCont = document.getElementById("blog-home-container");
  if (blogHomeCont) {
    blogHomeCont.innerHTML = state.blog.slice(0, 3).map(b => `
      <div class="blog-card">
        <div class="blog-card-img" style="background-image: url('${b.cover || 'https://placehold.co/400x200'}')"></div>
        <div class="blog-card-body">
          <span class="blog-card-tag">${b.category || "Inspiration"}</span>
          <h3 class="blog-card-title" onclick="openBlogReader('${b.id}')">${b.title}</h3>
          <p class="blog-card-excerpt">${b.excerpt}</p>
          <div class="blog-card-meta">By ${b.author} | ${b.date}</div>
        </div>
      </div>
    `).join("");
  }
}

function setSliderItem(idx) {
  state.currentHeroIndex = idx;
  const slidesWrapper = document.getElementById("hero-slides-wrapper");
  const dots = document.querySelectorAll(".slider-dot");
  if (slidesWrapper) {
    slidesWrapper.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((dot, dIdx) => {
      if (dIdx === idx) dot.classList.add("active");
      else dot.classList.remove("active");
    });
  }
}

function moveSlider(direction) {
  let nextIdx = state.currentHeroIndex + direction;
  if (nextIdx < 0) nextIdx = state.heroSlides.length - 1;
  if (nextIdx >= state.heroSlides.length) nextIdx = 0;
  setSliderItem(nextIdx);
}

let selectedCategoryFilter = "all";
function setShopCategoryAndNavigate(categorySlug) {
  selectedCategoryFilter = categorySlug;
  navigateTo("shop");
  renderShopView();
}

/**
 * ==========================================================================
 * 8. SHOP & DYNAMIC FILTERING ENGINE
 * ==========================================================================
 */
function renderShopView() {
  const categoriesContainer = document.getElementById("shop-categories-list");
  if (categoriesContainer) {
    categoriesContainer.innerHTML = `
      <label class="filter-label">
        <input type="radio" name="shop-category" value="all" ${selectedCategoryFilter === 'all' ? 'checked' : ''} onchange="handleShopCategoryChange(this.value)">
        <span>All Categories</span>
      </label>
    ` + state.categories.map(c => `
      <label class="filter-label">
        <input type="radio" name="shop-category" value="${c.slug}" ${selectedCategoryFilter === c.slug ? 'checked' : ''} onchange="handleShopCategoryChange(this.value)">
        <span>${c.name}</span>
      </label>
    `).join("");
  }
  applyFilters();
}

function handleShopCategoryChange(val) {
  selectedCategoryFilter = val;
  applyFilters();
}

function updatePriceValue(val) {
  const priceValDisp = document.getElementById("price-range-val");
  if (priceValDisp) priceValDisp.textContent = `${state.settings.currency || "$"}${val}`;
  applyFilters();
}

function handleSearch(event) {
  applyFilters();
}

function applyFilters() {
  const searchQuery = (document.getElementById("desktop-search-input").value || document.getElementById("mobile-search-input").value || "").toLowerCase();
  const maxPriceInput = parseFloat(document.getElementById("price-range").value);
  const sortSelectValue = document.getElementById("shop-sort").value;
  
  let list = [...state.products];

  if (searchQuery.trim() !== "") {
    list = list.filter(p => p.name.toLowerCase().includes(searchQuery) || (p.specs && p.specs.toLowerCase().includes(searchQuery)));
  }

  if (selectedCategoryFilter !== "all") {
    list = list.filter(p => p.category === selectedCategoryFilter);
  }

  list = list.filter(p => {
    const finalPrice = p.salePrice ? p.salePrice : p.price;
    return finalPrice <= maxPriceInput;
  });

  if (sortSelectValue === "low-high") {
    list.sort((a, b) => {
      const pA = a.salePrice ? a.salePrice : a.price;
      const pB = b.salePrice ? b.salePrice : b.price;
      return pA - pB;
    });
  } else if (sortSelectValue === "high-low") {
    list.sort((a, b) => {
      const pA = a.salePrice ? a.salePrice : a.price;
      const pB = b.salePrice ? b.salePrice : b.price;
      return pB - pA;
    });
  } else if (sortSelectValue === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  const shopGrid = document.getElementById("shop-products-grid");
  const countDisp = document.getElementById("filtered-products-count");
  
  if (countDisp) countDisp.textContent = list.length;
  if (shopGrid) {
    if (list.length === 0) {
      shopGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
          <p style="color:var(--text-muted);">No products match your criteria.</p>
        </div>
      `;
    } else {
      shopGrid.innerHTML = list.map(p => renderSingleProductHTML(p)).join("");
    }
  }
}

function resetFilters() {
  selectedCategoryFilter = "all";
  document.getElementById("price-range").value = 5000;
  const priceValDisp = document.getElementById("price-range-val");
  if (priceValDisp) priceValDisp.textContent = `${state.settings.currency || "$"}${5000}`;
  document.getElementById("shop-sort").value = "default";
  document.getElementById("desktop-search-input").value = "";
  document.getElementById("mobile-search-input").value = "";
  applyFilters();
  renderShopView();
}

function toggleMobileFilters() {
  const sidebar = document.getElementById("shop-sidebar-filter");
  if (sidebar) sidebar.classList.toggle("active-mobile");
}

function toggleMobileSearch() {
  const searchBox = document.getElementById("mobile-search-bar-container");
  if (searchBox) {
    searchBox.style.display = searchBox.style.display === "none" ? "block" : "none";
  }
}

function renderSingleProductHTML(p) {
  const currencySymbol = state.settings.currency || "$";
  const isOnSale = p.salePrice && p.salePrice < p.price;
  const isWishlisted = state.wishlist.some(x => x.id === p.id);
  
  return `
    <div class="product-card">
      ${isOnSale ? `<div class="product-card-badge">Sale</div>` : ''}
      <button class="product-wishlist-action-btn" onclick="toggleWishlistItem('${p.id}')" style="color: ${isWishlisted ? 'var(--danger-color)' : 'var(--text-muted)'}">
        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
      </button>
      <div class="product-image-wrap" onclick="openProductReader('${p.id}')">
        <img src="${p.image || 'https://placehold.co/300x240'}" alt="${p.name}">
      </div>
      <div class="product-details">
        <span class="product-category">${p.category}</span>
        <h3 class="product-title" onclick="openProductReader('${p.id}')">${p.name}</h3>
        <div class="product-rating">${"★".repeat(p.rating || 5)}</div>
        <div class="product-price-row">
          ${isOnSale 
            ? `<span class="product-price">${currencySymbol}${p.salePrice}</span><span class="product-price-old">${currencySymbol}${p.price}</span>`
            : `<span class="product-price">${currencySymbol}${p.price}</span>`
          }
        </div>
        <div class="product-action-footer">
          <button class="btn btn-primary btn-full" onclick="addCartItem('${p.id}')"><i class="fa-solid fa-basket-shopping"></i> Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * ==========================================================================
 * 9. EVENTS BOOKING COMPONENT
 * ==========================================================================
 */
function renderEventsView() {
  const grid = document.getElementById("events-packages-grid");
  if (!grid) return;

  grid.innerHTML = state.packages.map(p => `
    <div class="package-card">
      <div class="package-banner" style="background-image: url('${p.banner || 'https://placehold.co/800x400'}')"></div>
      <div class="package-body">
        <h3>${p.title}</h3>
        <div class="package-price-tag">From ${state.settings.currency || "$"}${p.price}</div>
        <p style="font-weight: 500; color:var(--text-color);">${p.inclusion}</p>
        <ul class="package-features">
          ${(p.features || []).map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join("")}
        </ul>
        <button class="btn btn-primary btn-full" onclick="openEventBookingForm('${p.id}')">Schedule Booking</button>
      </div>
    </div>
  `).join("");
}

function openEventBookingForm(pkgId) {
  const pkg = state.packages.find(x => x.id === pkgId);
  if (!pkg) return;

  document.getElementById("booking-package-id").value = pkg.id;
  document.getElementById("booking-package-display-title").value = pkg.title;
  openModal("booking-modal");
}

async function processEventBooking(e) {
  e.preventDefault();
  const id = document.getElementById("booking-package-id").value;
  const name = document.getElementById("booking-name").value;
  const phone = document.getElementById("booking-phone").value;
  const date = document.getElementById("booking-date").value;
  const guests = document.getElementById("booking-guests").value;
  
  const pkg = state.packages.find(x => x.id === id);
  if (!pkg) return;

  const payload = {
    packageId: id,
    packageTitle: pkg.title,
    customerName: name,
    customerPhone: phone,
    eventDate: date,
    guestCount: parseInt(guests),
    timestamp: new Date().toISOString()
  };

  await saveEntityItem("bookings", null, payload);

  const message = `Hello, I want to reserve an Event Package.\n\n` + 
                  `Package: ${pkg.title}\n` + 
                  `Client: ${name}\n` + 
                  `Phone: ${phone}\n` + 
                  `Date: ${date}\n` + 
                  `Expected Guests: ${guests}\n` +
                  `Standard Price: ${state.settings.currency || "$"}${pkg.price}`;
  
  const targetNumber = state.settings.whatsappNumber || "15550192834";
  const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
  
  closeModal("booking-modal");
  showToast("Booking recorded! Dispatching WhatsApp link...", "success");
  
  setTimeout(() => {
    window.open(whatsappUrl, "_blank");
  }, 1000);
}

/**
 * ==========================================================================
 * 10. INSPIRATION GALLERY COMPONENT
 * ==========================================================================
 */
function renderGalleryView() {
  const filtersContainer = document.getElementById("gallery-filters-container");
  const galleryGrid = document.getElementById("gallery-images-grid");
  if (!galleryGrid) return;

  const tags = ["all", ...new Set(state.gallery.map(item => item.tag).filter(Boolean))];
  
  if (filtersContainer) {
    filtersContainer.innerHTML = tags.map(tag => `
      <span class="gallery-filter-chip ${state.activeGalleryFilter === tag ? 'active' : ''}" onclick="filterGalleryByTag('${tag}')">
        ${tag.charAt(0).toUpperCase() + tag.slice(1)}
      </span>
    `).join("");
  }

  const itemsToRender = state.activeGalleryFilter === "all" 
    ? state.gallery 
    : state.gallery.filter(item => item.tag === state.activeGalleryFilter);

  galleryGrid.innerHTML = itemsToRender.map(item => `
    <div class="gallery-item" onclick="openLightbox('${item.image}', '${item.label}')">
      <img src="${item.image || 'https://placehold.co/400x300'}" alt="${item.label}">
      <div class="gallery-item-overlay">
        <h4 style="font-weight:700;">${item.label}</h4>
        <span style="font-size:12px; opacity:0.85;">${item.tag || "Decor"}</span>
      </div>
    </div>
  `).join("");
}

function filterGalleryByTag(tag) {
  state.activeGalleryFilter = tag;
  renderGalleryView();
}

function openLightbox(imageUrl, caption) {
  const displayImage = document.getElementById("lightbox-display-image");
  const captionText = document.getElementById("lightbox-caption-text");
  
  if (displayImage && captionText) {
    displayImage.src = imageUrl;
    captionText.textContent = caption;
    openModal("lightbox-modal");
  }
}

/**
 * ==========================================================================
 * 11. BLOG VIEWS & READER POPUPS
 * ==========================================================================
 */
function renderBlogView() {
  const blogList = document.getElementById("blog-posts-list");
  if (!blogList) return;

  blogList.innerHTML = state.blog.map(b => `
    <div class="blog-card" style="flex-direction: row; gap: 2rem; margin-bottom: 2rem; padding: 1.5rem;">
      <div class="blog-card-img" style="background-image: url('${b.cover}'); width: 300px; height: 200px; border-radius:var(--border-radius-md);"></div>
      <div class="blog-card-body" style="padding:0;">
        <span class="blog-card-tag">${b.category}</span>
        <h2 class="blog-card-title" onclick="openBlogReader('${b.id}')" style="font-size:1.5rem; font-weight:800; margin: 0.5rem 0;">${b.title}</h2>
        <p class="blog-card-excerpt">${b.excerpt}</p>
        <div class="blog-card-meta">By ${b.author} | ${b.date}</div>
      </div>
    </div>
  `).join("");
}

function openBlogReader(blogId) {
  const post = state.blog.find(x => x.id === blogId);
  if (!post) return;

  const bodyContent = `
    <div class="blog-reader-view">
      <img src="${post.cover}" alt="${post.title}" style="width:100%; height:320px; object-fit:cover; border-radius:var(--border-radius-md); margin-bottom:2rem;">
      <span class="blog-card-tag">${post.category}</span>
      <p class="text-muted" style="font-size:13px; margin: 0.5rem 0 1.5rem;">Published by <strong>${post.author}</strong> on ${post.date}</p>
      <div style="font-size:1.1rem; line-height:1.8;">${post.content || post.excerpt}</div>
    </div>
  `;
  
  document.getElementById("reader-title").textContent = post.title;
  document.getElementById("reader-body-content").innerHTML = bodyContent;
  openModal("reader-modal");
}

function openProductReader(pId) {
  const p = state.products.find(x => x.id === pId);
  if (!p) return;

  const bodyContent = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
      <div>
        <img src="${p.image}" alt="${p.name}" style="width:100%; max-height:400px; object-fit:cover; border-radius:var(--border-radius-md);">
      </div>
      <div>
        <span class="product-category">${p.category}</span>
        <h1 style="font-size:2rem; font-weight:800; margin:0.5rem 0;">${p.name}</h1>
        <div class="product-rating" style="font-size:1.2rem; margin-bottom:1rem;">${"★".repeat(p.rating || 5)}</div>
        <div class="product-price-row" style="margin-bottom:1.5rem;">
          <span class="product-price" style="font-size:1.75rem;">${state.settings.currency || "$"}${p.salePrice || p.price}</span>
          ${p.salePrice ? `<span class="product-price-old" style="font-size:1.2rem;">${state.settings.currency || "$"}${p.price}</span>` : ""}
        </div>
        <p style="margin-bottom:2rem; color:var(--text-muted);">${p.specs || "No detailed specifications provided."}</p>
        <button class="btn btn-primary btn-full" onclick="addCartItem('${p.id}'); closeModal('reader-modal');"><i class="fa-solid fa-basket-shopping"></i> Add to Cart</button>
      </div>
    </div>
  `;

  document.getElementById("reader-title").textContent = "Product Information";
  document.getElementById("reader-body-content").innerHTML = bodyContent;
  openModal("reader-modal");
}

/**
 * ==========================================================================
 * 12. SHOPPING CART ENGINE & CHECKOUT
 * ==========================================================================
 */
function addCartItem(id) {
  const item = state.products.find(x => x.id === id);
  if (!item) return;

  const existing = state.cart.find(x => x.product.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ product: item, quantity: 1 });
  }

  showToast(`Added "${item.name}" to cart.`, "success");
  updateBadges();
  if (state.activeView === "cart") renderCartView();
}

function updateCartQty(idx, amt) {
  state.cart[idx].quantity += amt;
  if (state.cart[idx].quantity <= 0) {
    state.cart.splice(idx, 1);
  }
  updateBadges();
  renderCartView();
}

function updateBadges() {
  const totalQty = state.cart.reduce((acc, x) => acc + x.quantity, 0);
  
  const b1 = document.getElementById("cart-badge");
  const b2 = document.getElementById("mobile-cart-badge-bottom");
  const wishBadge = document.getElementById("wishlist-badge");
  const mWishBadge = document.getElementById("mobile-wishlist-badge");
  
  if (b1) b1.textContent = totalQty;
  if (b2) b2.textContent = totalQty;
  if (wishBadge) wishBadge.textContent = state.wishlist.length;
  if (mWishBadge) mWishBadge.textContent = state.wishlist.length;
}

let activeAppliedCoupon = null;

function renderCartView() {
  const layout = document.getElementById("cart-layout-container");
  if (!layout) return;

  if (state.cart.length === 0) {
    layout.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 5rem 1rem;">
        <i class="fa-solid fa-bag-shopping" style="font-size:4rem; color:var(--text-muted); margin-bottom:1.5rem;"></i>
        <h2>Your Cart is empty</h2>
        <button class="btn btn-primary mt-2" onclick="navigateTo('shop')">Go to shop</button>
      </div>
    `;
    return;
  }

  const currencySymbol = state.settings.currency || "$";
  let subtotal = 0;

  const itemsHTML = state.cart.map((item, idx) => {
    const itemPrice = item.product.salePrice ? item.product.salePrice : item.product.price;
    const lineTotal = itemPrice * item.quantity;
    subtotal += lineTotal;

    return `
      <div class="cart-item-row">
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h3>${item.product.name}</h3>
          <p style="color:var(--text-muted); font-size:13px;">Unit: ${currencySymbol}${itemPrice}</p>
        </div>
        <div class="cart-qty-ctrl">
          <button class="cart-qty-btn" onclick="updateCartQty(${idx}, -1)">-</button>
          <span class="cart-qty-num">${item.quantity}</span>
          <button class="cart-qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
        </div>
        <div style="font-weight:700; min-width:80px; text-align:right;">${currencySymbol}${lineTotal}</div>
      </div>
    `;
  }).join("");

  let discount = 0;
  if (activeAppliedCoupon) {
    discount = subtotal * activeAppliedCoupon.rate;
  }
  const grandTotal = subtotal - discount;

  layout.innerHTML = `
    <div class="cart-table-card">${itemsHTML}</div>
    <div class="cart-summary-card">
      <h3 style="margin-bottom:1.5rem;">Payment summary</h3>
      <div class="summary-row"><span>Items count</span><span>${state.cart.length}</span></div>
      <div class="summary-row"><span>Subtotal</span><span>${currencySymbol}${subtotal.toFixed(2)}</span></div>
      ${activeAppliedCoupon ? `<div class="summary-row" style="color:var(--success-color);"><span>Coupon Discount (${activeAppliedCoupon.code})</span><span>-${currencySymbol}${discount.toFixed(2)}</span></div>` : ""}
      <div class="summary-row total"><span>Order Total</span><span>${currencySymbol}${grandTotal.toFixed(2)}</span></div>
      <button class="btn btn-primary btn-full mt-3" onclick="openCheckoutModal()"><i class="fa-solid fa-lock"></i> Proceed to Checkout</button>
    </div>
  `;
}

function openCheckoutModal() {
  openModal("checkout-modal");
}

function applyCouponCode() {
  const code = document.getElementById("checkout-coupon").value.trim().toUpperCase();
  const statusMsg = document.getElementById("coupon-status-msg");
  
  if (!statusMsg) return;

  const validPromos = state.offers.filter(x => x.code && x.code.trim() !== "");
  const found = validPromos.find(x => x.code.toUpperCase() === code);
  
  if (found) {
    activeAppliedCoupon = { code: code, rate: 0.15 }; 
    statusMsg.style.color = "var(--success-color)";
    statusMsg.textContent = "Coupon Code Applied! 15% Discount calculated.";
    renderCartView();
  } else {
    statusMsg.style.color = "var(--danger-color)";
    statusMsg.textContent = "Invalid Coupon Code entered.";
  }
}

async function processCheckoutOrder(e) {
  e.preventDefault();
  const name = document.getElementById("checkout-name").value;
  const phone = document.getElementById("checkout-phone").value;
  const address = document.getElementById("checkout-address").value;
  const currencySymbol = state.settings.currency || "$";

  let subtotal = 0;
  const cartDesc = state.cart.map(item => {
    const pr = item.product.salePrice ? item.product.salePrice : item.product.price;
    subtotal += pr * item.quantity;
    return `${item.product.name} (Qty ${item.quantity}) - ${currencySymbol}${pr * item.quantity}`;
  }).join("\n");

  let discount = 0;
  if (activeAppliedCoupon) {
    discount = subtotal * activeAppliedCoupon.rate;
  }
  const grandTotal = subtotal - discount;

  const payload = {
    customerName: name,
    customerPhone: phone,
    deliveryAddress: address,
    itemsSummary: cartDesc,
    subtotal: subtotal,
    discount: discount,
    grandTotal: grandTotal,
    couponUsed: activeAppliedCoupon ? activeAppliedCoupon.code : "None",
    timestamp: new Date().toISOString()
  };

  await saveEntityItem("orders", null, payload);

  const message = `Hello, I'd like to place an order.\n\n` + 
                  `Client: ${name}\n` + 
                  `Phone: ${phone}\n` + 
                  `Address: ${address}\n\n` + 
                  `Order Details:\n${cartDesc}\n\n` + 
                  `Coupon Code: ${activeAppliedCoupon ? activeAppliedCoupon.code : 'None'}\n` + 
                  `Total Amount: ${currencySymbol}${grandTotal.toFixed(2)}`;

  const targetNumber = state.settings.whatsappNumber || "15550192834";
  const whatsAppUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
  
  state.cart = [];
  activeAppliedCoupon = null;
  updateBadges();
  closeModal("checkout-modal");
  
  showToast("Order logged successfully! Dispatching to WhatsApp...", "success");
  
  setTimeout(() => {
    window.open(whatsAppUrl, "_blank");
    navigateTo("home");
  }, 1000);
}

/**
 * ==========================================================================
 * 13. WISHLIST MANAGEMENT
 * ==========================================================================
 */
function toggleWishlistItem(id) {
  const item = state.products.find(x => x.id === id);
  if (!item) return;

  const idx = state.wishlist.findIndex(x => x.id === id);
  if (idx !== -1) {
    state.wishlist.splice(idx, 1);
    showToast(`Removed "${item.name}" from wishlist.`, "success");
  } else {
    state.wishlist.push(item);
    showToast(`Added "${item.name}" to wishlist.`, "success");
  }

  updateBadges();
  applyFilters(); 
  if (state.activeView === "wishlist") renderWishlistView();
}

function renderWishlistView() {
  const container = document.getElementById("wishlist-grid-container");
  if (!container) return;

  if (state.wishlist.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding: 4rem 1rem;">
        <i class="fa-regular fa-heart" style="font-size:4rem; color:var(--text-muted); margin-bottom:1.5rem;"></i>
        <h2>Wishlist is empty</h2>
        <button class="btn btn-primary mt-2" onclick="navigateTo('shop')">Explore Shop Catalog</button>
      </div>
    `;
    return;
  }
  container.innerHTML = state.wishlist.map(p => renderSingleProductHTML(p)).join("");
}

/**
 * ==========================================================================
 * 14. MODAL ASSISTANCE FUNCTIONS
 * ==========================================================================
 */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("active");
}

function toggleMobileDrawer() {
  const drawer = document.getElementById("mobile-menu-drawer");
  if (drawer) {
    drawer.classList.toggle("active");
  }
}

/**
 * ==========================================================================
 * 15. ADMINISTRATIVE PORTAL CMS WORKSPACES
 * ==========================================================================
 */
function switchAdminTab(tabName) {
  state.activeAdminTab = tabName;
  document.querySelectorAll(".admin-nav-item").forEach(item => {
    item.classList.remove("active");
  });
  
  const activeNav = Array.from(document.querySelectorAll(".admin-nav-item")).find(x => x.getAttribute("onclick").includes(tabName));
  if (activeNav) activeNav.classList.add("active");

  document.querySelectorAll(".admin-tab-view").forEach(v => {
    v.classList.remove("active");
  });
  document.getElementById(`admin-tab-${tabName}`).classList.add("active");

  renderAdminWorkspaceData();
}

function renderAdminWorkspaceData() {
  const tab = state.activeAdminTab;
  
  if (tab === 'stats') {
    const container = document.getElementById("stats-dashboard-grid");
    if (container) {
      container.innerHTML = `
        <div class="stat-box"><h4>Products Catalog</h4><div class="stat-num">${state.products.length}</div></div>
        <div class="stat-box"><h4>E-Commerce Orders</h4><div class="stat-num">${state.orders.length}</div></div>
        <div class="stat-box"><h4>Event Bookings</h4><div class="stat-num">${state.bookings.length}</div></div>
        <div class="stat-box"><h4>Articles Live</h4><div class="stat-num">${state.blog.length}</div></div>
      `;
    }
    const notice = document.getElementById("mode-notice-container");
    if (notice) {
      notice.innerHTML = isFirebaseActive 
        ? `<div style="background-color:rgba(34,197,94,0.1); color:var(--success-color); padding:1rem; border-radius:var(--border-radius-sm); font-weight:600;"><i class="fa-solid fa-cloud"></i> Firebase Cloud Firestore Connected successfully! Changes are real-time.</div>`
        : `<div style="background-color:rgba(239,68,68,0.1); color:var(--danger-color); padding:1rem; border-radius:var(--border-radius-sm); font-weight:600;"><i class="fa-solid fa-hard-drive"></i> Sandboxed Local Sandbox Active. Data resides inside Local Storage.</div>`;
    }
  }

  else if (tab === 'orders') {
    const tbody = document.getElementById("cms-orders-tbody");
    if (tbody) {
      tbody.innerHTML = state.orders.map(o => `
        <tr>
          <td><strong>${o.id || "GEN"}</strong></td>
          <td>${o.customerName}<br><span style="font-size:12px; color:var(--text-muted);">${o.customerPhone}</span></td>
          <td>${o.timestamp ? o.timestamp.substring(0,10) : "N/A"}</td>
          <td><strong>${state.settings.currency || "$"}${o.grandTotal}</strong></td>
          <td><span style="font-size:12px;">${o.itemsSummary.replace(/\n/g, ", ")}</span></td>
          <td><button class="btn btn-secondary btn-full" onclick="deleteCMSRow('orders', '${o.id}')"><i class="fa-solid fa-trash"></i> Delete</button></td>
        </tr>
      `).join("");
    }
  }

  else if (tab === 'bookings') {
    const tbody = document.getElementById("cms-bookings-tbody");
    if (tbody) {
      tbody.innerHTML = state.bookings.map(b => `
        <tr>
          <td><strong>${b.id || "GEN"}</strong></td>
          <td>${b.packageTitle}</td>
          <td>${b.customerName}<br><span style="font-size:12px; color:var(--text-muted);">${b.customerPhone}</span></td>
          <td>${b.eventDate}</td>
          <td>${b.guestCount} Guests</td>
          <td><button class="btn btn-secondary btn-full" onclick="deleteCMSRow('bookings', '${b.id}')"><i class="fa-solid fa-trash"></i> Delete</button></td>
        </tr>
      `).join("");
    }
  }

  else if (tab === 'products') {
    const tbody = document.getElementById("cms-products-tbody");
    if (tbody) {
      tbody.innerHTML = state.products.map(p => `
        <tr>
          <td class="thumbnail-cell"><img src="${p.image}" alt=""></td>
          <td><strong>${p.name}</strong></td>
          <td>${p.category}</td>
          <td>${state.settings.currency || "$"}${p.price}</td>
          <td>${p.salePrice ? state.settings.currency || "$" + p.salePrice : "No Sale"}</td>
          <td style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary" onclick="editCMSRow('products', '${p.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger" onclick="deleteCMSRow('products', '${p.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join("");
    }
  }

  else if (tab === 'categories') {
    const tbody = document.getElementById("cms-categories-tbody");
    if (tbody) {
      tbody.innerHTML = state.categories.map(c => `
        <tr>
          <td class="thumbnail-cell"><img src="${c.image}" alt=""></td>
          <td><strong>${c.slug}</strong></td>
          <td>${c.name}</td>
          <td style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary" onclick="editCMSRow('categories', '${c.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger" onclick="deleteCMSRow('categories', '${c.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join("");
    }
  }

  else if (tab === 'hero') {
    const tbody = document.getElementById("cms-hero-tbody");
    if (tbody) {
      tbody.innerHTML = state.heroSlides.map(slide => `
        <tr>
          <td class="thumbnail-cell"><img src="${slide.image}" alt=""></td>
          <td><strong>${slide.heading}</strong></td>
          <td>${slide.subheading}</td>
          <td>${slide.link}</td>
          <td style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary" onclick="editCMSRow('heroSlides', '${slide.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger" onclick="deleteCMSRow('heroSlides', '${slide.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join("");
    }
  }

  else if (tab === 'offers') {
    const tbody = document.getElementById("cms-offers-tbody");
    if (tbody) {
      tbody.innerHTML = state.offers.map(o => `
        <tr>
          <td><strong>${o.title}</strong></td>
          <td>${o.subtitle}</td>
          <td><span class="coupon-tag" style="margin-top:0; font-size:12px;">${o.code}</span></td>
          <td>${o.link}</td>
          <td style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary" onclick="editCMSRow('offers', '${o.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger" onclick="deleteCMSRow('offers', '${o.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join("");
    }
  }

  else if (tab === 'packages') {
    const tbody = document.getElementById("cms-packages-tbody");
    if (tbody) {
      tbody.innerHTML = state.packages.map(p => `
        <tr>
          <td class="thumbnail-cell"><img src="${p.banner}" alt=""></td>
          <td><strong>${p.title}</strong></td>
          <td>${state.settings.currency || "$"}${p.price}</td>
          <td>${p.inclusion}</td>
          <td style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary" onclick="editCMSRow('packages', '${p.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger" onclick="deleteCMSRow('packages', '${p.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join("");
    }
  }

  else if (tab === 'gallery') {
    const tbody = document.getElementById("cms-gallery-tbody");
    if (tbody) {
      tbody.innerHTML = state.gallery.map(item => `
        <tr>
          <td class="thumbnail-cell"><img src="${item.image}" alt=""></td>
          <td><strong>${item.label}</strong></td>
          <td>${item.tag}</td>
          <td style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary" onclick="editCMSRow('gallery', '${item.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger" onclick="deleteCMSRow('gallery', '${item.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join("");
    }
  }

  else if (tab === 'blog') {
    const tbody = document.getElementById("cms-blog-tbody");
    if (tbody) {
      tbody.innerHTML = state.blog.map(b => `
        <tr>
          <td class="thumbnail-cell"><img src="${b.cover}" alt=""></td>
          <td><strong>${b.title}</strong></td>
          <td>${b.category}</td>
          <td>${b.author}</td>
          <td>${b.date}</td>
          <td style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary" onclick="editCMSRow('blog', '${b.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger" onclick="deleteCMSRow('blog', '${b.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join("");
    }
  }

  else if (tab === 'reviews') {
    const tbody = document.getElementById("cms-reviews-tbody");
    if (tbody) {
      tbody.innerHTML = state.reviews.map(r => `
        <tr>
          <td><strong>${r.author}</strong></td>
          <td>${"★".repeat(r.rating || 5)}</td>
          <td>${r.text}</td>
          <td>${r.date}</td>
          <td style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary" onclick="editCMSRow('reviews', '${r.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-danger" onclick="deleteCMSRow('reviews', '${r.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join("");
    }
  }

  else if (tab === 'settings') {
    const s = state.settings;
    if (s) {
      document.getElementById("set-site-title").value = s.title || "";
      document.getElementById("set-meta-desc").value = s.metaDesc || "";
      document.getElementById("set-logo-url").value = s.logoUrl || "";
      document.getElementById("set-favicon-url").value = s.faviconUrl || "";
      document.getElementById("set-primary-color").value = s.primaryColor || "#4f46e5";
      document.getElementById("set-primary-color-pick").value = s.primaryColor || "#4f46e5";
      document.getElementById("set-secondary-color").value = s.secondaryColor || "#06b6d4";
      document.getElementById("set-secondary-color-pick").value = s.secondaryColor || "#06b6d4";
      document.getElementById("set-whatsapp-number").value = s.whatsappNumber || "";
      document.getElementById("set-currency-symbol").value = s.currency || "$";
      document.getElementById("set-footer-address").value = s.address || "";
      document.getElementById("set-footer-phone").value = s.phone || "";
    }
  }
}

async function handleSettingsUpdate(e) {
  e.preventDefault();
  const payload = {
    title: document.getElementById("set-site-title").value,
    metaDesc: document.getElementById("set-meta-desc").value,
    logoUrl: document.getElementById("set-logo-url").value,
    faviconUrl: document.getElementById("set-favicon-url").value,
    primaryColor: document.getElementById("set-primary-color").value,
    secondaryColor: document.getElementById("set-secondary-color").value,
    whatsappNumber: document.getElementById("set-whatsapp-number").value,
    currency: document.getElementById("set-currency-symbol").value,
    address: document.getElementById("set-footer-address").value,
    phone: document.getElementById("set-footer-phone").value
  };

  if (isFirebaseActive) {
    try {
      await db.collection("settings").doc("global").set(payload);
    } catch (e) {
      console.error(e);
    }
  }
  updateStorageCollection("settings", payload);
  await syncPlatformData();
  showToast("Global Settings Saved Successfully!", "success");
}

function openCMSModal(collectionToken) {
  document.getElementById("cms-form-action-type").value = collectionToken;
  document.getElementById("cms-form-entity-id").value = "";
  document.getElementById("cms-modal-header-title").textContent = `Add New ${collectionToken.toUpperCase()}`;
  
  const container = document.getElementById("cms-form-fields-container");
  container.innerHTML = generateFormFieldsForCollection(collectionToken, {});
  openModal("cms-editor-modal");
}

function generateFormFieldsForCollection(token, data) {
  const isEditing = Object.keys(data).length > 0;
  
  if (token === 'product') {
    return `
      <div class="form-group">
        <label>Product Display Name</label>
        <input type="text" id="field-name" required value="${data.name || ''}">
      </div>
      <div class="form-grid-two">
        <div class="form-group">
          <label>Category (Slug Match)</label>
          <input type="text" id="field-category" required value="${data.category || ''}" placeholder="decor">
        </div>
        <div class="form-group">
          <label>Inherent Rating (1-5 Stars)</label>
          <input type="number" id="field-rating" min="1" max="5" required value="${data.rating || 5}">
        </div>
        <div class="form-group">
          <label>Standard Price</label>
          <input type="number" id="field-price" required value="${data.price || ''}">
        </div>
        <div class="form-group">
          <label>Discounted Sale Price (Optional)</label>
          <input type="number" id="field-salePrice" value="${data.salePrice || ''}">
        </div>
      </div>
      <div class="form-group">
        <label>Image Resource Link (URL)</label>
        <input type="text" id="field-image" required value="${data.image || 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=80'}">
      </div>
      <div class="form-group">
        <label>Specifications Description / Highlights</label>
        <textarea id="field-specs" rows="3">${data.specs || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="filter-label">
          <input type="checkbox" id="field-featured" ${data.featured ? 'checked' : ''}>
          <span>Mark as Featured (Appears on Home Page Grid)</span>
        </label>
      </div>
    `;
  }
  
  else if (token === 'category') {
    return `
      <div class="form-group">
        <label>Category Tag/Slug Code (Lower Case)</label>
        <input type="text" id="field-slug" required value="${data.slug || ''}" placeholder="decor" ${isEditing ? 'disabled' : ''}>
      </div>
      <div class="form-group">
        <label>Display Label Title</label>
        <input type="text" id="field-name" required value="${data.name || ''}">
      </div>
      <div class="form-group">
        <label>Category Representative Image Link (URL)</label>
        <input type="text" id="field-image" required value="${data.image || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=150&q=80'}">
      </div>
    `;
  }

  else if (token === 'hero') {
    return `
      <div class="form-group">
        <label>Main Banner Heading Text</label>
        <input type="text" id="field-heading" required value="${data.heading || ''}">
      </div>
      <div class="form-group">
        <label>Subtitle / Slogan Details</label>
        <input type="text" id="field-subheading" required value="${data.subheading || ''}">
      </div>
      <div class="form-group">
        <label>High-Res Slide Background Image (URL)</label>
        <input type="text" id="field-image" required value="${data.image || ''}">
      </div>
      <div class="form-group">
        <label>Action Redirection Link Target</label>
        <input type="text" id="field-link" required value="${data.link || '#shop'}" placeholder="#shop or #events">
      </div>
    `;
  }

  else if (token === 'offer') {
    return `
      <div class="form-group">
        <label>Main Promo Title Text</label>
        <input type="text" id="field-title" required value="${data.title || ''}">
      </div>
      <div class="form-group">
        <label>Offer Details Description</label>
        <input type="text" id="field-subtitle" required value="${data.subtitle || ''}">
      </div>
      <div class="form-group">
        <label>Promo Code (For Cart Discounts)</label>
        <input type="text" id="field-code" required value="${data.code || ''}">
      </div>
      <div class="form-group">
        <label>Banner Redirection Path Link</label>
        <input type="text" id="field-link" required value="${data.link || '#shop'}">
      </div>
    `;
  }

  else if (token === 'package') {
    return `
      <div class="form-group">
        <label>Event Service Package Title</label>
        <input type="text" id="field-title" required value="${data.title || ''}">
      </div>
      <div class="form-group">
        <label>Base Budget Price</label>
        <input type="number" id="field-price" required value="${data.price || ''}">
      </div>
      <div class="form-group">
        <label>Primary Key Inclusion Highlight</label>
        <input type="text" id="field-inclusion" required value="${data.inclusion || ''}">
      </div>
      <div class="form-group">
        <label>Banner Decoration Image URL Link</label>
        <input type="text" id="field-banner" required value="${data.banner || ''}">
      </div>
      <div class="form-group">
        <label>Comma Separated Features Inclusions</label>
        <textarea id="field-features" rows="4" placeholder="Standard Backdrop setup, Buffet Area Layout, Full coordination service">${data.features ? data.features.join(", ") : ''}</textarea>
      </div>
    `;
  }

  else if (token === 'gallery') {
    return `
      <div class="form-group">
        <label>Media Display Label Text</label>
        <input type="text" id="field-label" required value="${data.label || ''}">
      </div>
      <div class="form-group">
        <label>Category Tag/Filter Group Identifier</label>
        <input type="text" id="field-tag" required value="${data.tag || ''}" placeholder="events or decor">
      </div>
      <div class="form-group">
        <label>Media Source Link URL Image</label>
        <input type="text" id="field-image" required value="${data.image || ''}">
      </div>
    `;
  }

  else if (token === 'blog') {
    return `
      <div class="form-group">
        <label>Article Headline Title</label>
        <input type="text" id="field-title" required value="${data.title || ''}">
      </div>
      <div class="form-grid-two">
        <div class="form-group">
          <label>Target Category</label>
          <input type="text" id="field-category" required value="${data.category || ''}">
        </div>
        <div class="form-group">
          <label>Author Display Name</label>
          <input type="text" id="field-author" required value="${data.author || 'Editorial Team'}">
        </div>
      </div>
      <div class="form-group">
        <label>Cover Photo Image URL Target</label>
        <input type="text" id="field-cover" required value="${data.cover || ''}">
      </div>
      <div class="form-group">
        <label>Short Snippet Summary</label>
        <input type="text" id="field-excerpt" required value="${data.excerpt || ''}">
      </div>
      <div class="form-group">
        <label>Detailed Markdown Content body</label>
        <textarea id="field-content" rows="6">${data.content || ''}</textarea>
      </div>
    `;
  }

  else if (token === 'review') {
    return `
      <div class="form-group">
        <label>Customer Name</label>
        <input type="text" id="field-author" required value="${data.author || ''}">
      </div>
      <div class="form-group">
        <label>Rating Scale Score (1-5 Stars)</label>
        <input type="number" id="field-rating" min="1" max="5" required value="${data.rating || 5}">
      </div>
      <div class="form-group">
        <label>Review Summary Text</label>
        <textarea id="field-text" required rows="3">${data.text || ''}</textarea>
      </div>
    `;
  }
}

async function saveCMSEntity(e) {
  e.preventDefault();
  const token = document.getElementById("cms-form-action-type").value;
  const id = document.getElementById("cms-form-entity-id").value;
  const payload = {};

  if (token === 'product') {
    payload.name = document.getElementById("field-name").value;
    payload.category = document.getElementById("field-category").value;
    payload.price = parseFloat(document.getElementById("field-price").value);
    const saleVal = document.getElementById("field-salePrice").value;
    payload.salePrice = saleVal ? parseFloat(saleVal) : null;
    payload.image = document.getElementById("field-image").value;
    payload.rating = parseInt(document.getElementById("field-rating").value);
    payload.specs = document.getElementById("field-specs").value;
    payload.featured = document.getElementById("field-featured").checked;
  }
  else if (token === 'category') {
    payload.slug = document.getElementById("field-slug").value;
    payload.name = document.getElementById("field-name").value;
    payload.image = document.getElementById("field-image").value;
  }
  else if (token === 'hero') {
    payload.heading = document.getElementById("field-heading").value;
    payload.subheading = document.getElementById("field-subheading").value;
    payload.image = document.getElementById("field-image").value;
    payload.link = document.getElementById("field-link").value;
  }
  else if (token === 'offer') {
    payload.title = document.getElementById("field-title").value;
    payload.subtitle = document.getElementById("field-subtitle").value;
    payload.code = document.getElementById("field-code").value;
    payload.link = document.getElementById("field-link").value;
  }
  else if (token === 'package') {
    payload.title = document.getElementById("field-title").value;
    payload.price = parseFloat(document.getElementById("field-price").value);
    payload.inclusion = document.getElementById("field-inclusion").value;
    payload.banner = document.getElementById("field-banner").value;
    const feats = document.getElementById("field-features").value;
    payload.features = feats ? feats.split(",").map(x => x.trim()) : [];
  }
  else if (token === 'gallery') {
    payload.label = document.getElementById("field-label").value;
    payload.tag = document.getElementById("field-tag").value;
    payload.image = document.getElementById("field-image").value;
  }
  else if (token === 'blog') {
    payload.title = document.getElementById("field-title").value;
    payload.category = document.getElementById("field-category").value;
    payload.author = document.getElementById("field-author").value;
    payload.cover = document.getElementById("field-cover").value;
    payload.excerpt = document.getElementById("field-excerpt").value;
    payload.content = document.getElementById("field-content").value;
    payload.date = new Date().toISOString().substring(0, 10);
  }
  else if (token === 'review') {
    payload.author = document.getElementById("field-author").value;
    payload.rating = parseInt(document.getElementById("field-rating").value);
    payload.text = document.getElementById("field-text").value;
    payload.date = new Date().toISOString().substring(0, 10);
  }

  const colMap = {
    product: "products",
    category: "categories",
    hero: "heroSlides",
    offer: "offers",
    package: "packages",
    gallery: "gallery",
    blog: "blog",
    review: "reviews"
  };

  await saveEntityItem(colMap[token], id || null, payload);
  closeModal("cms-editor-modal");
  showToast("Document Sync Complete", "success");
  renderAdminWorkspaceData();
}

function editCMSRow(colName, id) {
  const tokenMap = {
    products: "product",
    categories: "category",
    heroSlides: "hero",
    offers: "offer",
    packages: "package",
    gallery: "gallery",
    blog: "blog",
    reviews: "review"
  };

  const item = state[colName].find(x => x.id === id);
  if (!item) return;

  const token = tokenMap[colName];
  document.getElementById("cms-form-action-type").value = token;
  document.getElementById("cms-form-entity-id").value = id;
  document.getElementById("cms-modal-header-title").textContent = `Modify ${token.toUpperCase()}`;
  
  const container = document.getElementById("cms-form-fields-container");
  container.innerHTML = generateFormFieldsForCollection(token, item);
  openModal("cms-editor-modal");
}

async function deleteCMSRow(colName, id) {
  if (confirm("Verify database record absolute deletion? This cannot be undone.")) {
    await removeEntityItem(colName, id);
    showToast("Entity Document purged.", "danger");
    renderAdminWorkspaceData();
  }
}

/**
 * ==========================================================================
 * 16. ALERT TOAST SYSTEM
 * ==========================================================================
 */
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <span onclick="this.parentElement.remove()" style="cursor:pointer; margin-left:10px;">&times;</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function renderApp() {
  renderHomeView();
  renderShopView();
  renderEventsView();
  renderGalleryView();
  renderBlogView();
  renderCartView();
  renderWishlistView();
  updateBadges();
}

/**
 * ==========================================================================
 * 17. BOOTSTRAP EVENT LISTENERS
 * ==========================================================================
 */
window.addEventListener("DOMContentLoaded", async () => {
  const cachedUser = localStorage.getItem("sandbox_user");
  if (cachedUser) {
    try {
      state.currentUser = JSON.parse(cachedUser);
    } catch (e) {
      state.currentUser = null;
    }
  }

  await syncPlatformData();

  const hashRouter = () => {
    const raw = window.location.hash.replace("#", "");
    const cleanRoute = raw.split("-")[0]; 
    if (["home", "shop", "events", "gallery", "blog", "cart", "wishlist", "auth", "admin"].includes(cleanRoute)) {
      navigateTo(cleanRoute);
    } else {
      navigateTo("home");
    }
  };
  
  window.addEventListener("hashchange", hashRouter);
  hashRouter(); 
});