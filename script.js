/**
 * ==========================================
 * GOLAP - CANON | PRODUCTION JS ENGINE 2026
 * ==========================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, deleteDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// ==========================================
// FIREBASE MODULE SYSTEM SETUP
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCcLS_42IQ8WraNJfSRF_UxhxxI1LOgkTU",
  authDomain: "golap-canon-4ecb9.firebaseapp.com",
  projectId: "golap-canon-4ecb9",
  storageBucket: "golap-canon-4ecb9.firebasestorage.app",
  messagingSenderId: "679554394144",
  appId: "1:679554394144:web:11b6e5b679615dd7f77445",
  measurementId: "G-C5YPF62JCE"
};

let app, auth, db, storage, analytics;
let isFirebaseActive = false;

// Attempt Firebase initialization
if (firebaseConfig.apiKey !== "") {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        try { analytics = getAnalytics(app); } catch (e) { console.log("Analytics skipped."); }
        isFirebaseActive = true;
        console.log("Firebase system initialized successfully.");
    } catch (err) {
        console.error("Firebase connection error. Falling back to local storage.", err);
    }
}

// ==========================================
// ADMIN CONFIGURATION
// ==========================================
const ADMIN_EMAIL = "admin@golapcanon.com"; 

// ==========================================
// MASTER PRODUCTS DATASET (In Taka - ৳)
// ==========================================
const DEFAULT_PRODUCTS = [
    {
        id: "prod_001",
        name: "Midnight Velvet Bouquet",
        category: "bouquets",
        price: 1500.00,
        oldPrice: 1800.00,
        discount: 18,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600",
        desc: "Lush signature deep crimson and black velvet roses accented with eucalyptus twigs and dark luxury wrapping paper.",
        featured: true
    },
    {
        id: "prod_002",
        name: "Ethereal Morning Peonies",
        category: "bouquets",
        price: 2500.00,
        oldPrice: 3000.00,
        discount: 17,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600",
        desc: "Scented luxury Dutch pink peonies matched perfectly with wild white baby-breath clusters for early morning deliveries.",
        featured: true
    },
    {
        id: "prod_003",
        name: "Imperial Blossom Crown & Ring Set",
        category: "jewelry",
        price: 4500.00,
        oldPrice: 5800.00,
        discount: 22,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
        desc: "Bespoke rose gold plated floral accessories. Delicate custom ring and matching flower-themed halo.",
        featured: true
    },
    {
        id: "prod_004",
        name: "Golden Twilight Hamper Basket",
        category: "gifts",
        price: 1800.00,
        oldPrice: 2200.00,
        discount: 17,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600",
        desc: "Artisanal woven gift hamper box featuring premium chocolates, signature rose-infused oil and curated floral accents.",
        featured: true
    },
    {
        id: "prod_005",
        name: "Bohemian Cascade Arch",
        category: "wedding",
        price: 25000.00,
        oldPrice: 30000.00,
        discount: 18,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1519225495810-7517c29a2e19?auto=format&fit=crop&q=80&w=600",
        desc: "Spectacular cascading wedding stage backdrop set. Hand-pinned eucalyptus branches, ivory silk roses, and sheer curtains.",
        featured: false
    }
];

let PRODUCTS = JSON.parse(localStorage.getItem("g_canon_products")) || DEFAULT_PRODUCTS;
if (!localStorage.getItem("g_canon_products")) {
    localStorage.setItem("g_canon_products", JSON.stringify(DEFAULT_PRODUCTS));
}

// ==========================================
// STATE MANAGEMENT DATA
// ==========================================
let cart = JSON.parse(localStorage.getItem("g_canon_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("g_canon_wishlist")) || [];
let activeCategory = "all";
let activeSort = "newest";
let activeSearchQuery = "";
let maxPriceFilter = 50000;
let userProfile = JSON.parse(localStorage.getItem("g_canon_user")) || null;
let activeTestimonialIndex = 0;
let activeAdminTab = "dashboard";
let activeQvQty = 1;

// Website Config Dynamic Settings
const DEFAULT_SETTINGS = {
    storeName: "GOLAP - CANON",
    storePhone: "+880 1711-223344",
    storeAddress: "Road 12, Banani, Dhaka, Bangladesh",
    whatsappNum: "8801700000000",
    deliveryFee: "150",
    heroTitle: "Vibrant Nature, Captured for You.",
    heroSubtitle: "Experience the energetic beauty of Golap - Canon. Hand-curated excellence for life's boldest moments.",
    heroImg: "https://images.unsplash.com/photo-1519225495810-7517c29a2e19?auto=format&fit=crop&q=80&w=1600"
};
let SETTINGS = JSON.parse(localStorage.getItem("g_canon_settings")) || DEFAULT_SETTINGS;

const DEFAULT_TESTIMONIALS = [
    {
        id: "t_001",
        name: "Marcella Vance",
        role: "Event Coordinator",
        text: "Golap - Canon completely revolutionized our winter banquet layout. Their master florist transformed a sterile hall into a warm, gorgeous crimson paradise.",
        rating: 5
    },
    {
        id: "t_002",
        name: "Nabila Rahman",
        role: "Luxury Bride",
        text: "I was stunned by the beauty of my Cascade Arch. Every single petal felt pristine. The convenience of their WhatsApp checkout is highly recommended.",
        rating: 5
    }
];
let TESTIMONIALS = JSON.parse(localStorage.getItem("g_canon_testimonials")) || DEFAULT_TESTIMONIALS;

// ==========================================
// APP INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initAppComponents();
    applyWebsiteSettings();
    renderProducts();
    renderTrendingSlider();
    renderTestimonials();
    updateCartUI();
    updateWishlistUI();
    setupIntersectionObservers();
    
    // Auth Listener
    if (isFirebaseActive) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                updateUserDisplayState(user);
            } else {
                clearUserDisplayState();
            }
        });
    } else if (userProfile) {
        updateUserDisplayState(userProfile);
    }
});

// ==========================================
// CORE ELEMENT BINDINGS & LOGIC SETUP
// ==========================================
function initAppComponents() {
    window.addEventListener("scroll", () => {
        const header = document.getElementById("main-header");
        if (window.scrollY > 40) {
            header.classList.add("shrinked");
        } else {
            header.classList.remove("shrinked");
        }
    });

    const menuBtn = document.getElementById("menu-btn");
    const closeMenuBtn = document.getElementById("close-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    menuBtn.addEventListener("click", () => mobileMenu.classList.remove("-translate-x-full"));
    closeMenuBtn.addEventListener("click", () => mobileMenu.classList.add("-translate-x-full"));
    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => mobileMenu.classList.add("-translate-x-full"));
    });

    const searchTrigger = document.getElementById("search-trigger-mobile");
    const closeSearch = document.getElementById("close-mobile-search");
    const searchOverlay = document.getElementById("mobile-search-overlay");
    const searchMobileInput = document.getElementById("search-input-mobile");

    searchTrigger.addEventListener("click", () => {
        searchOverlay.classList.toggle("hidden");
        if (!searchOverlay.classList.contains("hidden")) {
            searchMobileInput.focus();
        }
    });
    closeSearch.addEventListener("click", () => {
        searchOverlay.classList.add("hidden");
        searchMobileInput.value = "";
        activeSearchQuery = "";
        renderProducts();
    });

    const searchInput = document.getElementById("search-input");
    const inlineSearch = document.getElementById("inline-search");

    const handleSearchInput = (e) => {
        activeSearchQuery = e.target.value.toLowerCase().trim();
        renderProducts();
    };

    searchInput.addEventListener("input", handleSearchInput);
    inlineSearch.addEventListener("input", handleSearchInput);
    searchMobileInput.addEventListener("input", handleSearchInput);

    const tabs = document.querySelectorAll(".category-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            tabs.forEach(t => {
                t.classList.remove("active", "bg-primary", "text-white");
                t.classList.add("bg-surface-container", "text-on-variant");
            });
            e.currentTarget.classList.add("active", "bg-primary", "text-white");
            e.currentTarget.classList.remove("bg-surface-container", "text-on-variant");
            activeCategory = e.currentTarget.getAttribute("data-category");
            renderProducts();
        });
    });

    const priceRange = document.getElementById("price-range");
    const priceVal = document.getElementById("price-val");
    priceRange.addEventListener("input", (e) => {
        maxPriceFilter = parseFloat(e.target.value);
        priceVal.textContent = `৳${maxPriceFilter}`;
        renderProducts();
    });

    const sortSelect = document.getElementById("sort-select");
    sortSelect.addEventListener("change", (e) => {
        activeSort = e.target.value;
        renderProducts();
    });

    document.getElementById("prev-testi").addEventListener("click", () => {
        activeTestimonialIndex = (activeTestimonialIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
        renderTestimonials();
    });
    document.getElementById("next-testi").addEventListener("click", () => {
        activeTestimonialIndex = (activeTestimonialIndex + 1) % TESTIMONIALS.length;
        renderTestimonials();
    });

    const cartToggle = document.getElementById("cart-toggle");
    const mobileCartToggle = document.getElementById("mobile-cart-toggle");
    const cartClose = document.getElementById("cart-close");
    const cartOverlay = document.getElementById("cart-overlay");

    cartToggle.addEventListener("click", openCartDrawer);
    if (mobileCartToggle) mobileCartToggle.addEventListener("click", openCartDrawer);
    cartClose.addEventListener("click", closeCartDrawer);
    cartOverlay.addEventListener("click", closeCartDrawer);

    document.getElementById("clear-cart-btn").addEventListener("click", () => {
        cart = [];
        localStorage.setItem("g_canon_cart", JSON.stringify(cart));
        updateCartUI();
        showToast("Select bouquet basket emptied.", "info");
    });

    document.getElementById("checkout-btn").addEventListener("click", () => {
        if (cart.length === 0) {
            showToast("Your visual choice basket is currently empty.", "error");
            return;
        }
        closeCartDrawer();
        openCheckoutFormModal();
    });

    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const btn = item.querySelector("button");
        btn.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            faqItems.forEach(element => element.classList.remove("active"));
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });

    document.querySelectorAll(".consultation-trigger").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const serv = e.currentTarget.getAttribute("data-service");
            document.getElementById("contact-subject").value = serv || "Wedding Event Styling";
            document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
            showToast(`Setting planning requirements for: ${serv}`, "info");
        });
    });

    const contactForm = document.getElementById("contact-form");
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const contactData = {
            name: document.getElementById("contact-name").value,
            email: document.getElementById("contact-email").value,
            phone: document.getElementById("contact-phone").value,
            subject: document.getElementById("contact-subject").value,
            message: document.getElementById("contact-message").value,
            timestamp: new Date().toISOString()
        };

        if (isFirebaseActive) {
            try {
                await addDoc(collection(db, "contact"), contactData);
                showToast("Consultation details transmitted to planners.", "success");
            } catch (err) {
                console.error("Firestore transmission error.", err);
            }
        } else {
            const localQueries = JSON.parse(localStorage.getItem("g_canon_queries")) || [];
            localQueries.push(contactData);
            localStorage.setItem("g_canon_queries", JSON.stringify(localQueries));
            showToast("Details preserved locally.", "success");
        }
        contactForm.reset();
    });

    const newsForm = document.getElementById("newsletter-form");
    newsForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("news-email").value;
        const subData = { email, timestamp: new Date().toISOString() };

        if (isFirebaseActive) {
            try {
                await addDoc(collection(db, "newsletter"), subData);
                showToast("Subscribed to the VIP botanical feed.", "success");
            } catch (err) {
                console.error("Firestore database subscription error.", err);
            }
        } else {
            const newsletter = JSON.parse(localStorage.getItem("g_canon_newsletter")) || [];
            newsletter.push(subData);
            localStorage.setItem("g_canon_newsletter", JSON.stringify(newsletter));
            showToast("Successfully subjoined to our local news circle.", "success");
        }
        newsForm.reset();
    });

    const qtyVal = document.getElementById("qv-qty-val");
    document.getElementById("qv-qty-plus").addEventListener("click", () => {
        activeQvQty++;
        qtyVal.textContent = activeQvQty;
    });
    document.getElementById("qv-qty-minus").addEventListener("click", () => {
        if (activeQvQty > 1) {
            activeQvQty--;
            qtyVal.textContent = activeQvQty;
        }
    });

    document.getElementById("qv-add-cart").addEventListener("click", () => {
        const id = document.getElementById("qv-add-cart").getAttribute("data-id");
        addToCart(id, activeQvQty);
        closeQuickViewModal();
    });

    document.getElementById("qv-order-whatsapp").addEventListener("click", () => {
        const id = document.getElementById("qv-order-whatsapp").getAttribute("data-id");
        const prod = PRODUCTS.find(p => p.id === id);
        if (prod) {
            closeQuickViewModal();
            setTimeout(() => {
                openSingleProductCheckoutModal(prod, activeQvQty);
            }, 300);
        }
    });

    const checkoutForm = document.getElementById("whatsapp-checkout-form");
    checkoutForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const orderDetails = {
            customerName: document.getElementById("wa-cust-name").value,
            customerPhone: document.getElementById("wa-cust-phone").value,
            deliveryAddress: document.getElementById("wa-cust-address").value,
            deliveryDate: document.getElementById("wa-cust-date").value,
            items: cart,
            subtotal: calculateCartSubtotal(),
            orderDate: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString()
        };

        if (isFirebaseActive) {
            try {
                await addDoc(collection(db, "orders"), orderDetails);
            } catch (err) {
                console.error("Firestore connection failure saving order details.", err);
            }
        } else {
            const localOrders = JSON.parse(localStorage.getItem("g_canon_orders")) || [];
            localOrders.push(orderDetails);
            localStorage.setItem("g_canon_orders", JSON.stringify(localOrders));
        }

        launchWhatsAppCheckoutMessage(orderDetails);
        checkoutForm.reset();
        cart = [];
        localStorage.setItem("g_canon_cart", JSON.stringify(cart));
        updateCartUI();
        closeCheckoutModal();
    });

    // Integrated Dynamic Auth & Admin Portal Triggers
    const authTrigger = document.getElementById("auth-modal-trigger");
    const mobileAuthTrigger = document.getElementById("mobile-auth-trigger");
    const authClose = document.getElementById("auth-close");
    const authOverlay = document.getElementById("auth-overlay");

    const handleAuthClick = () => {
        if (userProfile) {
            if (userProfile.email === ADMIN_EMAIL) {
                openAdminModal();
            } else {
                if (confirm("আপনি কি লগআউট করতে চান?")) {
                    performSecureLogout();
                }
            }
        } else {
            openAuthModal();
        }
    };

    authTrigger.addEventListener("click", handleAuthClick);
    if (mobileAuthTrigger) mobileAuthTrigger.addEventListener("click", handleAuthClick);
    authClose.addEventListener("click", closeAuthModal);
    authOverlay.addEventListener("click", closeAuthModal);

    // Auth tab toggles
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const loginBox = document.getElementById("auth-login-box");
    const regBox = document.getElementById("auth-register-box");

    tabLogin.addEventListener("click", () => {
        tabLogin.className = "flex-1 py-4 font-headline font-bold text-center border-b-2 border-primary text-primary transition-all text-sm uppercase tracking-wider";
        tabRegister.className = "flex-1 py-4 font-headline font-bold text-center border-b-2 border-transparent text-on-variant/50 hover:text-on-surface transition-all text-sm uppercase tracking-wider";
        loginBox.classList.remove("hidden");
        regBox.classList.add("hidden");
    });

    tabRegister.addEventListener("click", () => {
        tabRegister.className = "flex-1 py-4 font-headline font-bold text-center border-b-2 border-primary text-primary transition-all text-sm uppercase tracking-wider";
        tabLogin.className = "flex-1 py-4 font-headline font-bold text-center border-b-2 border-transparent text-on-variant/50 hover:text-on-surface transition-all text-sm uppercase tracking-wider";
        regBox.classList.remove("hidden");
        loginBox.classList.add("hidden");
    });

    // Custom Login Form Handling
    document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const pass = document.getElementById("login-password").value;

        if (isFirebaseActive) {
            try {
                const cred = await signInWithEmailAndPassword(auth, email, pass);
                handleAuthResponse(cred.user);
            } catch (err) {
                showAuthError(err.message);
            }
        } else {
            if (pass.length >= 6) {
                handleAuthResponse({ displayName: email.split("@")[0], email });
            } else {
                showAuthError("Password security requires minimum 6 characters.");
            }
        }
    });

    // Custom Registration Form Handling
    document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const pass = document.getElementById("reg-password").value;

        if (isFirebaseActive) {
            try {
                const cred = await createUserWithEmailAndPassword(auth, email, pass);
                handleAuthResponse({ displayName: name, email });
            } catch (err) {
                showAuthError(err.message);
            }
        } else {
            handleAuthResponse({ displayName: name, email });
        }
    });

    // Reset password linkage
    document.getElementById("forgot-password-btn").addEventListener("click", async () => {
        const email = document.getElementById("login-email").value;
        if (!email) {
            showToast("Enter your registered email address to reset passkey.", "error");
            return;
        }
        if (isFirebaseActive) {
            try {
                await sendPasswordResetEmail(auth, email);
                showToast("Password reset link sent to your inbox.", "success");
            } catch (err) {
                showToast(err.message, "error");
            }
        } else {
            showToast("A reset password email has been simulated to your registered address.", "success");
        }
    });

    // Google Single Sign-On link
    document.getElementById("google-login-btn").addEventListener("click", async () => {
        if (isFirebaseActive) {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                handleAuthResponse(result.user);
            } catch (err) {
                showAuthError(err.message);
            }
        } else {
            handleAuthResponse({ displayName: "Google Guest", email: "google.guest@golapcanon.com" });
        }
    });

    // Mobile Logout element interaction
    const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener("click", performSecureLogout);
    }

    // Modal dismissals binds
    document.getElementById("qv-overlay").addEventListener("click", closeQuickViewModal);
    document.getElementById("qv-close").addEventListener("click", closeQuickViewModal);
    document.getElementById("checkout-overlay").addEventListener("click", closeCheckoutModal);
    document.getElementById("checkout-close").addEventListener("click", closeCheckoutModal);

    initTrendingSliderDragSupport();

    // Setup Admin Tab Toggles
    const adminTabBtns = document.querySelectorAll(".admin-tab-btn");
    adminTabBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            adminTabBtns.forEach(b => {
                b.classList.remove("active", "bg-primary/20", "text-primary");
                b.classList.add("text-on-variant/60", "hover:text-primary");
            });
            e.currentTarget.classList.add("active", "bg-primary/20", "text-primary");
            e.currentTarget.classList.remove("text-on-variant/60");

            activeAdminTab = e.currentTarget.getAttribute("data-tab");
            switchAdminTabWorkspace(activeAdminTab);
        });
    });

    document.getElementById("admin-close").addEventListener("click", closeAdminModal);
    document.getElementById("admin-overlay").addEventListener("click", closeAdminModal);
}

// ==========================================
// APPLY WEB METADATA CONFIG
// ==========================================
function applyWebsiteSettings() {
    const titleHeader = document.querySelector("#hero h2");
    const subHeader = document.querySelector("#hero p");
    const heroSlider = document.getElementById("hero-slider");

    if (titleHeader) titleHeader.innerHTML = SETTINGS.heroTitle;
    if (subHeader) subHeader.textContent = SETTINGS.heroSubtitle;
    if (heroSlider) heroSlider.style.backgroundImage = `url('${SETTINGS.heroImg}')`;
}

// ==========================================
// RENDER DYNAMIC PRODUCTS GRID
// ==========================================
function renderProducts() {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    let filtered = PRODUCTS.filter(p => {
        const matchesCategory = (activeCategory === "all" || p.category === activeCategory);
        const matchesSearch = (p.name.toLowerCase().includes(activeSearchQuery) || p.desc.toLowerCase().includes(activeSearchQuery));
        const matchesPrice = (p.price <= maxPriceFilter);
        return matchesCategory && matchesSearch && matchesPrice;
    });

    if (activeSort === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (activeSort === "popular") {
        filtered.sort((a, b) => b.rating - a.rating);
    } else {
        filtered.sort((a, b) => b.id.localeCompare(a.id));
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center text-on-variant/60">
                <span class="material-symbols-outlined text-4xl">nest_f_chat_input</span>
                <p class="mt-4 font-bold">No custom arrangements matched your exact selection criteria.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const isWished = wishlist.includes(p.id);
        const wishedClass = isWished ? "text-primary fill-current" : "text-on-variant";
        return `
            <div class="bg-surface-container border border-white/5 rounded-xl overflow-hidden group hover:border-primary/20 transition-all duration-300 hover-scale flex flex-col justify-between" data-id="${p.id}">
                <div class="aspect-square relative overflow-hidden bg-surface-low">
                    <img alt="${p.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${p.image}"/>
                    <span class="absolute top-3 left-3 bg-primary text-[10px] font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-wider">${p.discount}% OFF</span>
                    <button class="wishlist-toggle-btn absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full ${wishedClass} transition" data-id="${p.id}">
                        <span class="material-symbols-outlined text-[18px]">favorite</span>
                    </button>
                    <button class="quick-view-btn absolute inset-x-4 bottom-4 py-2.5 bg-surface-dim/90 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary" data-id="${p.id}">
                        Quick Vision View
                    </button>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <span class="text-xs text-secondary/80 font-bold uppercase tracking-wider">${p.category}</span>
                        <h4 class="font-bold text-sm text-on-surface truncate mt-1">${p.name}</h4>
                        <div class="flex items-center gap-1.5 mt-1.5">
                            <span class="text-xs text-yellow-500">★</span>
                            <span class="text-[11px] text-on-variant/70 font-semibold">${p.rating} / 5.0 Rating</span>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-white/5">
                        <div class="flex items-baseline gap-2 mb-3">
                            <span class="text-primary font-black text-base">৳${p.price.toFixed(2)}</span>
                            <span class="text-on-variant/40 line-through text-xs">৳${p.oldPrice.toFixed(2)}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-1.5">
                            <button class="add-to-cart-btn py-2 bg-secondary/20 hover:bg-secondary text-on-surface hover:text-white text-[10px] font-bold uppercase rounded transition" data-id="${p.id}">Add To Basket</button>
                            <button class="direct-wa-order-btn py-2 bg-[#25D366] hover:bg-[#1ebd54] text-white text-[10px] font-bold uppercase rounded transition flex items-center justify-center gap-1" data-id="${p.id}">WhatsApp</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    attachProductCardActionEvents();
}

// ==========================================
// RENDER TRENDING HORIZONTAL SLIDER
// ==========================================
function renderTrendingSlider() {
    const slider = document.getElementById("trending-slider-container");
    if (!slider) return;

    const featured = PRODUCTS.filter(p => p.featured);
    slider.innerHTML = featured.map(p => {
        return `
            <div class="flex-shrink-0 w-[240px] bg-surface-container rounded-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all hover-scale group snap-start" data-id="${p.id}">
                <div class="aspect-square relative overflow-hidden bg-surface-low">
                    <img alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${p.image}"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <button class="quick-view-btn w-full py-2 bg-primary text-white text-[10px] font-extrabold uppercase rounded" data-id="${p.id}">Quick View</button>
                    </div>
                </div>
                <div class="p-4">
                    <h4 class="font-bold text-xs text-on-surface truncate">${p.name}</h4>
                    <div class="flex justify-between items-center mt-3">
                        <span class="text-primary font-bold text-sm">৳${p.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn p-1.5 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white rounded-lg transition" data-id="${p.id}">
                            <span class="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    attachSliderActionEvents();
}

// ==========================================
// RENDER TESTIMONIAL CAROUSEL FRAME
// ==========================================
function renderTestimonials() {
    const viewport = document.getElementById("testimonial-slider");
    const dotsContainer = document.getElementById("testimonial-dots");
    if (!viewport) return;

    if (TESTIMONIALS.length === 0) {
        viewport.innerHTML = `<p class="text-center text-xs text-on-variant/50">No customer testimonials recorded.</p>`;
        return;
    }

    const active = TESTIMONIALS[activeTestimonialIndex];
    viewport.innerHTML = `
        <div class="text-center px-4 transition-all duration-500 ease-in-out transform scale-100 opacity-100">
            <p class="text-sm md:text-lg italic font-medium leading-relaxed text-on-surface">"${active.text}"</p>
            <div class="mt-6 flex flex-col items-center">
                <span class="font-headline font-bold text-base text-primary">${active.name}</span>
                <span class="text-xs text-on-variant/60 font-medium uppercase mt-1">${active.role}</span>
                <div class="flex text-yellow-500 text-xs mt-2">${"★".repeat(active.rating)}</div>
            </div>
        </div>
    `;

    dotsContainer.innerHTML = TESTIMONIALS.map((_, i) => {
        const dotStyle = i === activeTestimonialIndex ? "bg-primary w-6" : "bg-white/25 w-2";
        return `<button class="h-2 rounded-full transition-all duration-300 ${dotStyle}" data-index="${i}"></button>`;
    }).join("");

    dotsContainer.querySelectorAll("button").forEach(dot => {
        dot.addEventListener("click", (e) => {
            activeTestimonialIndex = parseInt(e.currentTarget.getAttribute("data-index"));
            renderTestimonials();
        });
    });
}

// ==========================================
// MODALS SYSTEM (RESILIENT EXPLICIT DOM LOCATORS)
// ==========================================
function openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    const aside = document.getElementById("cart-aside");
    if (drawer && overlay && aside) {
        drawer.classList.remove("hidden");
        setTimeout(() => {
            overlay.classList.remove("opacity-0");
            aside.classList.remove("translate-x-full");
        }, 10);
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    const aside = document.getElementById("cart-aside");
    if (drawer && overlay && aside) {
        overlay.classList.add("opacity-0");
        aside.classList.add("translate-x-full");
        setTimeout(() => drawer.classList.add("hidden"), 300);
    }
}

function openQuickViewModal(id) {
    const p = PRODUCTS.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById("qv-image").src = p.image;
    document.getElementById("qv-category").textContent = p.category;
    document.getElementById("qv-name").textContent = p.name;
    document.getElementById("qv-desc").textContent = p.desc;
    document.getElementById("qv-price").textContent = `৳${p.price.toFixed(2)}`;
    document.getElementById("qv-old-price").textContent = `৳${p.oldPrice.toFixed(2)}`;
    document.getElementById("qv-rating").textContent = `(${p.rating} / 5.0)`;

    document.getElementById("qv-add-cart").setAttribute("data-id", p.id);
    document.getElementById("qv-order-whatsapp").setAttribute("data-id", p.id);

    activeQvQty = 1;
    document.getElementById("qv-qty-val").textContent = "1";

    const modal = document.getElementById("quick-view-modal");
    const overlay = document.getElementById("qv-overlay");
    const content = document.getElementById("qv-content");

    if (modal && overlay && content) {
        modal.classList.remove("hidden");
        setTimeout(() => {
            overlay.classList.remove("opacity-0");
            content.classList.remove("scale-95", "opacity-0");
        }, 10);
    }
}

function closeQuickViewModal() {
    const modal = document.getElementById("quick-view-modal");
    const overlay = document.getElementById("qv-overlay");
    const content = document.getElementById("qv-content");

    if (modal && overlay && content) {
        overlay.classList.add("opacity-0");
        content.classList.add("scale-95", "opacity-0");
        setTimeout(() => modal.classList.add("hidden"), 300);
    }
}

function openCheckoutFormModal() {
    const modal = document.getElementById("checkout-modal");
    const overlay = document.getElementById("checkout-overlay");
    const content = document.getElementById("checkout-content");
    const totalDisplay = document.getElementById("wa-checkout-total");

    if (totalDisplay) {
        totalDisplay.textContent = `৳${calculateCartSubtotal().toFixed(2)}`;
    }

    const form = document.getElementById("whatsapp-checkout-form");
    if (form) {
        form.setAttribute("data-mode", "cart");
    }

    if (modal && overlay && content) {
        modal.classList.remove("hidden");
        setTimeout(() => {
            overlay.classList.remove("opacity-0");
            content.classList.remove("scale-95", "opacity-0");
        }, 10);
    }
}

function openSingleProductCheckoutModal(prod, qty) {
    const modal = document.getElementById("checkout-modal");
    const overlay = document.getElementById("checkout-overlay");
    const content = document.getElementById("checkout-content");
    const totalDisplay = document.getElementById("wa-checkout-total");

    if (totalDisplay) {
        totalDisplay.textContent = `৳${(prod.price * qty).toFixed(2)}`;
    }

    const form = document.getElementById("whatsapp-checkout-form");
    if (form) {
        form.setAttribute("data-mode", "single");
        form.setAttribute("data-single-id", prod.id);
        form.setAttribute("data-single-qty", qty);
    }

    if (modal && overlay && content) {
        modal.classList.remove("hidden");
        setTimeout(() => {
            overlay.classList.remove("opacity-0");
            content.classList.remove("scale-95", "opacity-0");
        }, 10);
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    const overlay = document.getElementById("checkout-overlay");
    const content = document.getElementById("checkout-content");

    if (modal && overlay && content) {
        overlay.classList.add("opacity-0");
        content.classList.add("scale-95", "opacity-0");
        setTimeout(() => modal.classList.add("hidden"), 300);
    }
}

function openAuthModal() {
    const modal = document.getElementById("auth-modal");
    const overlay = document.getElementById("auth-overlay");
    const content = document.getElementById("auth-content");

    if (modal && overlay && content) {
        modal.classList.remove("hidden");
        setTimeout(() => {
            overlay.classList.remove("opacity-0");
            content.classList.remove("scale-95", "opacity-0");
        }, 10);
    }
}

function closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    const overlay = document.getElementById("auth-overlay");
    const content = document.getElementById("auth-content");

    if (modal && overlay && content) {
        overlay.classList.add("opacity-0");
        content.classList.add("scale-95", "opacity-0");
        document.getElementById("auth-status-container").classList.add("hidden");
        setTimeout(() => modal.classList.add("hidden"), 300);
    }
}

function openAdminModal() {
    const modal = document.getElementById("admin-modal");
    const overlay = document.getElementById("admin-overlay");
    const content = document.getElementById("admin-content");

    if (modal && overlay && content) {
        activeAdminTab = "dashboard";
        switchAdminTabWorkspace(activeAdminTab);

        modal.classList.remove("hidden");
        setTimeout(() => {
            overlay.classList.remove("opacity-0");
            content.classList.remove("scale-95", "opacity-0");
        }, 10);
    }
}

function closeAdminModal() {
    const modal = document.getElementById("admin-modal");
    const overlay = document.getElementById("admin-overlay");
    const content = document.getElementById("admin-content");

    if (modal && overlay && content) {
        overlay.classList.add("opacity-0");
        content.classList.add("scale-95", "opacity-0");
        setTimeout(() => modal.classList.add("hidden"), 300);
    }
}

// ==========================================
// CORE SHOPPING CART CONTROLLER
// ==========================================
function addToCart(id, qty = 1) {
    const prod = PRODUCTS.find(p => p.id === id);
    if (!prod) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            image: prod.image,
            quantity: qty
        });
    }

    localStorage.setItem("g_canon_cart", JSON.stringify(cart));
    updateCartUI();
    showToast(`Added ${qty} x ${prod.name} to bouquet basket.`, "success");
}

function updateCartQuantity(id, action) {
    const target = cart.find(item => item.id === id);
    if (!target) return;

    if (action === "increase") {
        target.quantity++;
    } else if (action === "decrease") {
        if (target.quantity > 1) {
            target.quantity--;
        } else {
            cart = cart.filter(item => item.id !== id);
        }
    }

    localStorage.setItem("g_canon_cart", JSON.stringify(cart));
    updateCartUI();
}

function removeCartItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("g_canon_cart", JSON.stringify(cart));
    updateCartUI();
    showToast("Selected arrangement removed from basket.", "info");
}

function calculateCartSubtotal() {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}

// ==========================================
// WHATSAPP API DATA GENERATION (Taka Version)
// ==========================================
function launchWhatsAppCheckoutMessage(order) {
    const studioPhone = SETTINGS.whatsappNum; 
    let msg = `*GOLAP - CANON LUXURY ORDER*%0A`;
    msg += `_Date: ${order.orderDate}_%0A%0A`;
    msg += `*CUSTOMER DETAILS:*%0A`;
    msg += `• Name: ${order.customerName}%0A`;
    msg += `• Contact Phone: ${order.customerPhone}%0A`;
    msg += `• Venue Address: ${order.deliveryAddress}%0A`;
    msg += `• Delivery Target Date: ${order.deliveryDate}%0A%0A`;
    msg += `*ORDERED ARRANGEMENTS:*%0A`;

    const form = document.getElementById("whatsapp-checkout-form");
    const mode = form.getAttribute("data-mode");

    if (mode === "single") {
        const singleId = form.getAttribute("data-single-id");
        const singleQty = parseInt(form.getAttribute("data-single-qty"));
        const prod = PRODUCTS.find(p => p.id === singleId);
        if (prod) {
            msg += `• 1x *${prod.name}* (Qty: ${singleQty}) — ৳${(prod.price * singleQty).toFixed(2)}%0A`;
            msg += `%0A*TOTAL PAYABLE:* ৳${(prod.price * singleQty).toFixed(2)}%0A`;
        }
    } else {
        order.items.forEach(item => {
            msg += `• *${item.name}* (Qty: ${item.quantity}) — ৳${(item.price * item.quantity).toFixed(2)}%0A`;
        });
        msg += `%0A*TOTAL PAYABLE:* ৳${order.subtotal.toFixed(2)}%0A`;
    }

    msg += `_Checkout generated securely via Golap - Canon online store. Please verify target order._`;

    const url = `https://wa.me/${studioPhone}?text=${msg}`;
    window.open(url, "_blank");
}

// ==========================================
// TOAST NOTIFICATIONS UTILITY
// ==========================================
function showToast(text, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    let icon = "check_circle";
    let borderTheme = "border-secondary";
    if (type === "error") {
        icon = "error";
        borderTheme = "border-primary";
    } else if (type === "info") {
        icon = "info";
        borderTheme = "border-on-variant/30";
    }

    toast.className = `toast-node bg-surface-container border-l-4 ${borderTheme} text-on-surface p-4 rounded-lg shadow-2xl flex items-center gap-3 w-72 pointer-events-auto`;
    toast.innerHTML = `
        <span class="material-symbols-outlined text-[20px] text-primary">${icon}</span>
        <span class="text-xs font-bold leading-tight flex-1">${text}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = "translateY(-10px) scale(0.9)";
        toast.style.opacity = "0";
        toast.style.transition = "all 0.35s ease";
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ==========================================
// INTERSECTION OBSERVERS (SCROLL REVEALS)
// ==========================================
function setupIntersectionObservers() {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    elements.forEach(el => observer.observe(el));

    const counters = document.querySelectorAll("[data-target]");
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumericCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
}

function animateNumericCounter(element) {
    const target = parseFloat(element.getAttribute("data-target"));
    const duration = 2000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const stepVal = target / steps;
    let current = 0;

    const interval = setInterval(() => {
        current += stepVal;
        if (current >= target) {
            element.textContent = target % 1 === 0 ? target : target.toFixed(1);
            clearInterval(interval);
        } else {
            element.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
        }
    }, stepTime);
}

// ==========================================
// AUTHENTICATION STATE ACTIONS
// ==========================================
function handleAuthResponse(user) {
    userProfile = user;
    localStorage.setItem("g_canon_user", JSON.stringify(userProfile));
    updateUserDisplayState(userProfile);
    closeAuthModal();
    showToast(`Welcome back, ${userProfile.displayName || "Valued Patron"}!`, "success");
}

function performSecureLogout() {
    if (isFirebaseActive) {
        signOut(auth).then(() => {
            clearUserDisplayState();
            showToast("Successfully logged out.", "info");
        });
    } else {
        clearUserDisplayState();
        showToast("Session disconnected.", "info");
    }
}

function clearUserDisplayState() {
    userProfile = null;
    localStorage.removeItem("g_canon_user");
    const nameDisplay = document.getElementById("user-display-name");
    const mobileUserStatus = document.getElementById("mobile-user-status");
    const mobileLogoutBtn = document.getElementById("mobile-logout-btn");

    if (nameDisplay) {
        nameDisplay.textContent = "Sign In";
    }
    if (mobileUserStatus) {
        mobileUserStatus.textContent = "";
    }
    if (mobileLogoutBtn) {
        mobileLogoutBtn.classList.add("hidden");
    }
}

function showAuthError(message) {
    const container = document.getElementById("auth-status-container");
    container.classList.remove("hidden");
    container.textContent = message;
}

// ==========================================
// ADVANCED TABBED ADMIN SUITE (Taka Support)
// ==========================================
async function switchAdminTabWorkspace(tab) {
    const workspace = document.getElementById("admin-tab-workspace");
    const title = document.getElementById("admin-workspace-title");
    if (!workspace) return;

    workspace.innerHTML = `
        <div class="py-16 text-center text-on-variant flex flex-col items-center">
            <span class="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
            <p class="mt-4 text-xs font-bold uppercase tracking-widest">Constructing Workspace Panel...</p>
        </div>
    `;

    let orders = [];
    let queriesList = [];
    let newsletters = [];

    if (isFirebaseActive) {
        try {
            const ordersSnap = await getDocs(collection(db, "orders"));
            ordersSnap.forEach(doc => orders.push({ dbId: doc.id, ...doc.data() }));

            const contactSnap = await getDocs(collection(db, "contact"));
            contactSnap.forEach(doc => queriesList.push({ dbId: doc.id, ...doc.data() }));

            const newsletterSnap = await getDocs(collection(db, "newsletter"));
            newsletterSnap.forEach(doc => newsletters.push({ dbId: doc.id, ...doc.data() }));
        } catch (err) {
            console.error("Failed fetching admin details from Firestore", err);
        }
    } else {
        orders = JSON.parse(localStorage.getItem("g_canon_orders")) || [];
        queriesList = JSON.parse(localStorage.getItem("g_canon_queries")) || [];
        newsletters = JSON.parse(localStorage.getItem("g_canon_newsletter")) || [];
    }

    if (tab === "dashboard") {
        title.textContent = "Overview Dashboard";
        workspace.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="bg-surface-low border border-white/5 p-6 rounded-xl hover:border-primary/20 transition">
                    <p class="text-xs font-bold uppercase text-on-variant/60">Total Customer Orders</p>
                    <p class="text-3xl font-black text-primary mt-2">${orders.length}</p>
                </div>
                <div class="bg-surface-low border border-white/5 p-6 rounded-xl hover:border-secondary/20 transition">
                    <p class="text-xs font-bold uppercase text-on-variant/60">Design Consultation Inquiries</p>
                    <p class="text-3xl font-black text-secondary mt-2">${queriesList.length}</p>
                </div>
                <div class="bg-surface-low border border-white/5 p-6 rounded-xl hover:border-primary/20 transition">
                    <p class="text-xs font-bold uppercase text-on-variant/60">Newsletter Subscribers</p>
                    <p class="text-3xl font-black text-on-surface mt-2">${newsletters.length}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div class="bg-surface-low border border-white/5 p-6 rounded-xl space-y-4">
                    <h4 class="font-headline font-bold text-lg text-primary flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">receipt_long</span> Recent Orders
                    </h4>
                    <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        ${orders.length === 0 ? '<p class="text-xs text-on-variant/50">No customer orders recorded.</p>' : orders.map(o => `
                            <div class="p-3 bg-surface border border-white/5 rounded-lg space-y-1">
                                <div class="flex justify-between font-bold text-xs">
                                    <span class="text-primary">${o.customerName}</span>
                                    <span>৳${o.subtotal ? o.subtotal.toFixed(2) : '0.00'}</span>
                                </div>
                                <p class="text-[10px] text-on-variant/70">Phone: ${o.customerPhone} | Target: ${o.deliveryDate}</p>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="bg-surface-low border border-white/5 p-6 rounded-xl space-y-4">
                    <h4 class="font-headline font-bold text-lg text-secondary flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">mail</span> Dynamic Consultations
                    </h4>
                    <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        ${queriesList.length === 0 ? '<p class="text-xs text-on-variant/50">No design consultations submitted.</p>' : queriesList.map(q => `
                            <div class="p-3 bg-surface border border-white/5 rounded-lg space-y-1">
                                <div class="flex justify-between font-bold text-xs">
                                    <span class="text-secondary">${q.name}</span>
                                    <span class="text-[9px] uppercase tracking-wider bg-secondary/15 text-secondary px-1.5 rounded">${q.subject}</span>
                                </div>
                                <p class="text-[11px] text-on-variant bg-surface-container/50 p-2 rounded mt-1.5 leading-relaxed">"${q.message}"</p>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;
    }

    else if (tab === "products") {
        title.textContent = "Product & Category Inventory";
        workspace.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="bg-surface-low border border-white/5 p-6 rounded-xl h-fit">
                    <h4 class="font-headline font-bold text-lg text-primary mb-6">Add New Arrangement</h4>
                    <form id="admin-add-product-form" class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Arrangement Name</label>
                            <input id="adm-p-name" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" type="text" placeholder="Crimson Velvet Bouquet"/>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Price (৳)</label>
                                <input id="adm-p-price" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" type="number" step="0.01" placeholder="1500"/>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Discount (%)</label>
                                <input id="adm-p-disc" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" type="number" placeholder="15"/>
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Arrangement Image URL</label>
                            <input id="adm-p-img" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" type="text" placeholder="https://images.unsplash.com/..."/>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Collection Category</label>
                            <select id="adm-p-cat" class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface cursor-pointer">
                                <option value="bouquets">Flower Bouquets</option>
                                <option value="jewelry">Jewelry Sets</option>
                                <option value="gifts">Baskets &amp; Gifts</option>
                                <option value="wedding">Wedding Stages</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Stylistic Description</label>
                            <textarea id="adm-p-desc" required rows="3" class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" placeholder="Eucalyptus accents..."></textarea>
                        </div>
                        <button type="submit" class="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition shimmer-btn">Publish to Catalog</button>
                    </form>
                </div>

                <div class="lg:col-span-2 bg-surface-low border border-white/5 p-6 rounded-xl space-y-4">
                    <h4 class="font-headline font-bold text-lg text-secondary">Active Storefront Catalog</h4>
                    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        ${PRODUCTS.map(p => `
                            <div class="flex items-center justify-between p-3 bg-surface border border-white/5 rounded-lg gap-4">
                                <div class="flex items-center gap-3">
                                    <img class="w-12 h-12 object-cover rounded" src="${p.image}" alt="${p.name}"/>
                                    <div>
                                        <p class="text-xs font-bold text-on-surface">${p.name}</p>
                                        <p class="text-[10px] text-secondary font-semibold uppercase tracking-wider">${p.category} | ৳${p.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <button class="admin-del-product-btn p-2 hover:bg-primary/20 text-on-variant/60 hover:text-primary rounded-lg transition" data-id="${p.id}">
                                    <span class="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;

        const addProdForm = document.getElementById("admin-add-product-form");
        addProdForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("adm-p-name").value;
            const price = parseFloat(document.getElementById("adm-p-price").value);
            const discount = parseInt(document.getElementById("adm-p-disc").value);
            const image = document.getElementById("adm-p-img").value;
            const category = document.getElementById("adm-p-cat").value;
            const desc = document.getElementById("adm-p-desc").value;
            
            const newProduct = {
                id: `prod_${Date.now()}`,
                name,
                price,
                oldPrice: price * (1 + (discount / 100)),
                discount,
                rating: 5.0,
                image,
                category,
                desc,
                featured: false
            };

            if (isFirebaseActive) {
                try {
                    await addDoc(collection(db, "products"), newProduct);
                } catch (err) {
                    console.error("Firestore product creation error.", err);
                }
            }

            PRODUCTS.unshift(newProduct);
            localStorage.setItem("g_canon_products", JSON.stringify(PRODUCTS));
            showToast("New premium arrangement listed in catalog.", "success");
            renderProducts();
            switchAdminTabWorkspace("products");
        });

        document.querySelectorAll(".admin-del-product-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                if (confirm("Are you sure you want to delete this design arrangement?")) {
                    PRODUCTS = PRODUCTS.filter(p => p.id !== id);
                    localStorage.setItem("g_canon_products", JSON.stringify(PRODUCTS));

                    if (isFirebaseActive) {
                        try {
                            const q = query(collection(db, "products"), where("id", "==", id));
                            const querySnap = await getDocs(q);
                            querySnap.forEach(async (docRef) => {
                                await deleteDoc(doc(db, "products", docRef.id));
                            });
                        } catch (err) {
                            console.error("Firestore delete error", err);
                        }
                    }

                    showToast("Arrangement design removed from active catalog.", "info");
                    renderProducts();
                    switchAdminTabWorkspace("products");
                }
            });
        });
    }

    else if (tab === "orders") {
        title.textContent = "Customer Orders Center";
        workspace.innerHTML = `
            <div class="bg-surface-low border border-white/5 p-6 rounded-xl space-y-4">
                <h4 class="font-headline font-bold text-lg text-primary">Pending &amp; Executed WhatsApp Transmissions</h4>
                <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    ${orders.length === 0 ? '<p class="text-xs text-on-variant/50">No orders logged.</p>' : orders.map(o => `
                        <div class="p-4 bg-surface border border-white/5 rounded-lg space-y-2">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-xs font-bold text-primary">${o.customerName}</p>
                                    <p class="text-[10px] text-on-variant/70 font-medium">Phone: ${o.customerPhone} | Target: ${o.deliveryDate}</p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-black text-on-surface">৳${o.subtotal ? o.subtotal.toFixed(2) : '0.00'}</span>
                                    <button class="admin-del-order-btn p-1.5 hover:bg-primary/20 text-on-variant/60 hover:text-primary rounded transition" data-id="${o.dbId || ''}" data-local-idx="${orders.indexOf(o)}">
                                        <span class="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                            <p class="text-[10px] text-on-variant/50 italic leading-relaxed">Address Layout: ${o.deliveryAddress}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;

        document.querySelectorAll(".admin-del-order-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const dbId = e.currentTarget.getAttribute("data-id");
                const localIdx = parseInt(e.currentTarget.getAttribute("data-local-idx"));

                if (confirm("Archive/Delete this customer order?")) {
                    if (isFirebaseActive && dbId) {
                        try {
                            await deleteDoc(doc(db, "orders", dbId));
                        } catch (err) {
                            console.error("Firestore order deletion failure.", err);
                        }
                    } else {
                        const localOrders = JSON.parse(localStorage.getItem("g_canon_orders")) || [];
                        localOrders.splice(localIdx, 1);
                        localStorage.setItem("g_canon_orders", JSON.stringify(localOrders));
                    }
                    showToast("Customer order archived.", "info");
                    switchAdminTabWorkspace("orders");
                }
            });
        });
    }

    else if (tab === "reviews") {
        title.textContent = "Reviews & Banner Configuration";
        workspace.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-surface-low border border-white/5 p-6 rounded-xl space-y-4">
                    <h4 class="font-headline font-bold text-lg text-primary">Testimonial Curation</h4>
                    <div class="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                        ${TESTIMONIALS.map(t => `
                            <div class="p-3 bg-surface border border-white/5 rounded-lg space-y-1">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <p class="text-xs font-bold text-on-surface">${t.name}</p>
                                        <p class="text-[9px] uppercase tracking-wider text-secondary font-bold">${t.role}</p>
                                    </div>
                                    <button class="admin-del-testi-btn p-1.5 text-on-variant/60 hover:text-primary transition" data-id="${t.id}">
                                        <span class="material-symbols-outlined text-xs">delete</span>
                                    </button>
                                </div>
                                <p class="text-[11px] text-on-variant/80 italic leading-relaxed mt-2">"${t.text}"</p>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="bg-surface-low border border-white/5 p-6 rounded-xl space-y-4 h-fit">
                    <h4 class="font-headline font-bold text-lg text-secondary">Hero Banner Content Editor</h4>
                    <form id="admin-banner-form" class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Banner Title</label>
                            <input id="adm-b-title" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface font-semibold" type="text" value="${SETTINGS.heroTitle}"/>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Banner Subtitle / Description</label>
                            <textarea id="adm-b-sub" required rows="3" class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface leading-relaxed">${SETTINGS.heroSubtitle}</textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Background Image URL</label>
                            <input id="adm-b-img" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" type="text" value="${SETTINGS.heroImg}"/>
                        </div>
                        <button type="submit" class="w-full py-3 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition">Apply Creative Changes</button>
                    </form>
                </div>
            </div>
        `;

        const bannerForm = document.getElementById("admin-banner-form");
        bannerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            SETTINGS.heroTitle = document.getElementById("adm-b-title").value;
            SETTINGS.heroSubtitle = document.getElementById("adm-b-sub").value;
            SETTINGS.heroImg = document.getElementById("adm-b-img").value;

            localStorage.setItem("g_canon_settings", JSON.stringify(SETTINGS));
            applyWebsiteSettings();
            showToast("Creative hero configuration updated live.", "success");
            switchAdminTabWorkspace("reviews");
        });

        document.querySelectorAll(".admin-del-testi-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                if (confirm("Delete this client testimonial review?")) {
                    TESTIMONIALS = TESTIMONIALS.filter(t => t.id !== id);
                    localStorage.setItem("g_canon_testimonials", JSON.stringify(TESTIMONIALS));
                    showToast("Testimonial removed.", "info");
                    renderTestimonials();
                    switchAdminTabWorkspace("reviews");
                }
            });
        });
    }

    else if (tab === "settings") {
        title.textContent = "Website Metadata & Configuration";
        workspace.innerHTML = `
            <div class="max-w-2xl bg-surface-low border border-white/5 p-6 rounded-xl space-y-6">
                <h4 class="font-headline font-bold text-lg text-primary border-b border-white/5 pb-3 flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">settings_suggest</span> Metadata Workspace
                </h4>
                <form id="admin-settings-form" class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Company Studio Name</label>
                            <input id="adm-s-name" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" type="text" value="${SETTINGS.storeName}"/>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">WhatsApp Checkout Number</label>
                            <input id="adm-s-wa" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" type="text" value="${SETTINGS.whatsappNum}"/>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Studio Phone Number</label>
                            <input id="adm-s-phone" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" type="text" value="${SETTINGS.storePhone}"/>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Delivery Setup Fee (৳)</label>
                            <input id="adm-s-fee" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" type="number" value="${SETTINGS.deliveryFee}"/>
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold uppercase text-on-variant tracking-wider mb-1">Headquarters Physical Address</label>
                        <input id="adm-s-address" required class="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface" type="text" value="${SETTINGS.storeAddress}"/>
                    </div>
                    <button type="submit" class="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition shimmer-btn">Commit Config Updates</button>
                </form>
            </div>
        `;

        const settingsForm = document.getElementById("admin-settings-form");
        settingsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            SETTINGS.storeName = document.getElementById("adm-s-name").value;
            SETTINGS.storePhone = document.getElementById("adm-s-phone").value;
            SETTINGS.storeAddress = document.getElementById("adm-s-address").value;
            SETTINGS.whatsappNum = document.getElementById("adm-s-wa").value;
            SETTINGS.deliveryFee = document.getElementById("adm-s-fee").value;

            localStorage.setItem("g_canon_settings", JSON.stringify(SETTINGS));
            applyWebsiteSettings();
            showToast("System configurations committed successfully.", "success");
            switchAdminTabWorkspace("settings");
        });
    }
}