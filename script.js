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
        try { analytics = getAnalytics(app); } catch (e) { console.log("Analytics loading skipped."); }
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
// MASTER PRODUCTS DATASET (DEFAULT STATIC)
// ==========================================
const DEFAULT_PRODUCTS = [
    {
        id: "prod_001",
        name: "Midnight Velvet Bouquet",
        category: "bouquets",
        price: 45.00,
        oldPrice: 55.00,
        discount: 18,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600",
        desc: "Lush signature deep crimson and black velvet roses accented with eucalyptus twigs.",
        featured: true
    },
    {
        id: "prod_002",
        name: "Ethereal Morning Peonies",
        category: "bouquets",
        price: 62.00,
        oldPrice: 75.00,
        discount: 17,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600",
        desc: "Scented luxury Dutch pink peonies matched perfectly with wild baby-breath clusters.",
        featured: true
    },
    {
        id: "prod_003",
        name: "Imperial Blossom Crown Set",
        category: "jewelry",
        price: 140.00,
        oldPrice: 180.00,
        discount: 22,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600",
        desc: "Bespoke rose gold plated floral accessories. Custom ring and matching flower-themed halo.",
        featured: true
    },
    {
        id: "prod_004",
        name: "Golden Twilight Hamper Basket",
        category: "gifts",
        price: 58.00,
        oldPrice: 70.00,
        discount: 17,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600",
        desc: "Artisanal woven gift hamper box featuring premium chocolates and curated floral accents.",
        featured: true
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
let maxPriceFilter = 1000;
let userProfile = JSON.parse(localStorage.getItem("g_canon_user")) || null;
let activeTestimonialIndex = 0;
let activeAdminTab = "dashboard";

// Default Testimonials
const DEFAULT_TESTIMONIALS = [
    {
        id: "testi_001",
        name: "Marcella Vance",
        role: "Event Coordinator",
        text: "Golap - Canon completely revolutionized our winter banquet layout. Their master florist transformed a sterile hall into a warm, gorgeous crimson paradise.",
        rating: 5
    },
    {
        id: "testi_002",
        name: "Nabila Rahman",
        role: "Luxury Bride",
        text: "I was stunned by the beauty of my Cascade Arch. Every single petal felt pristine. The convenience of WhatsApp checkout is fantastic.",
        rating: 5
    }
];
let TESTIMONIALS = JSON.parse(localStorage.getItem("g_canon_testimonials")) || DEFAULT_TESTIMONIALS;

// ==========================================
// APP INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initAppComponents();
    renderProducts();
    renderTrendingSlider();
    renderTestimonials();
    updateCartUI();
    updateWishlistUI();
    setupIntersectionObservers();
    
    // Auth State Listener
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
        priceVal.textContent = `$${maxPriceFilter}`;
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
    const cartDrawer = document.getElementById("cart-drawer");
    const cartAside = document.getElementById("cart-aside");

    const openCartDrawer = () => {
        cartDrawer.classList.remove("hidden");
        setTimeout(() => {
            cartOverlay.classList.remove("opacity-0");
            cartAside.classList.remove("translate-x-full");
        }, 10);
    };

    const closeCartDrawer = () => {
        cartOverlay.classList.add("opacity-0");
        cartAside.classList.add("translate-x-full");
        setTimeout(() => cartDrawer.classList.add("hidden"), 300);
    };

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

    let activeQvQty = 1;
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
                console.error("Firestore error saving order details.", err);
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

    const authTrigger = document.getElementById("auth-modal-trigger");
    const mobileAuthTrigger = document.getElementById("mobile-auth-trigger");
    const authClose = document.getElementById("auth-close");
    const authOverlay = document.getElementById("auth-overlay");
    const authModal = document.getElementById("auth-modal");
    const authContent = document.getElementById("auth-content");

    const openAuthModal = () => {
        if (userProfile) {
            if (confirm("Do you want to securely log out of your session?")) {
                performSecureLogout();
            }
            return;
        }
        authModal.classList.remove("hidden");
        setTimeout(() => {
            authOverlay.classList.remove("opacity-0");
            authContent.classList.remove("scale-95", "opacity-0");
        }, 10);
    };

    const closeAuthModal = () => {
        authOverlay.classList.add("opacity-0");
        authContent.classList.add("scale-95", "opacity-0");
        document.getElementById("auth-status-container").classList.add("hidden");
        setTimeout(() => authModal.classList.add("hidden"), 300);
    };

    authTrigger.addEventListener("click", openAuthModal);
    if (mobileAuthTrigger) mobileAuthTrigger.addEventListener("click", openAuthModal);
    authClose.addEventListener("click", closeAuthModal);
    authOverlay.addEventListener("click", closeAuthModal);

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

    const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener("click", performSecureLogout);
    }

    initTrendingSliderDragSupport();
}

// ==========================================
// SWIPABLE PRODUCT SLIDER SETUP
// ==========================================
function initTrendingSliderDragSupport() {
    const slider = document.getElementById("trending-slider-container");
    const prevBtn = document.getElementById("slide-left-btn");
    const nextBtn = document.getElementById("slide-right-btn");

    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
        isDown = false;
    });
    slider.addEventListener("mouseup", () => {
        isDown = false;
    });
    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    prevBtn.addEventListener("click", () => {
        slider.scrollBy({ left: -280, behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
        slider.scrollBy({ left: 280, behavior: "smooth" });
    });

    let autoplayTimer = setInterval(() => {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
            slider.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            slider.scrollBy({ left: 280, behavior: "smooth" });
        }
    }, 6000);

    slider.addEventListener("pointerdown", () => clearInterval(autoplayTimer));
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
                            <span class="text-primary font-black text-base">$${p.price.toFixed(2)}</span>
                            <span class="text-on-variant/40 line-through text-xs">$${p.oldPrice.toFixed(2)}</span>
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
                        <span class="text-primary font-bold text-sm">$${p.price.toFixed(2)}</span>
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
// INTERACTIVE COMPONENT LISTENERS
// ==========================================
function attachProductCardActionEvents() {
    document.querySelectorAll("#product-grid .add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            addToCart(id, 1);
        });
    });

    document.querySelectorAll("#product-grid .direct-wa-order-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            const prod = PRODUCTS.find(p => p.id === id);
            if (prod) openSingleProductCheckoutModal(prod, 1);
        });
    });

    document.querySelectorAll("#product-grid .wishlist-toggle-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            toggleWishlist(id);
        });
    });

    document.querySelectorAll("#product-grid .quick-view-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            openQuickViewModal(id);
        });
    });
}

function attachSliderActionEvents() {
    document.querySelectorAll("#trending-slider-container .add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            addToCart(id, 1);
        });
    });

    document.querySelectorAll("#trending-slider-container .quick-view-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            openQuickViewModal(id);
        });
    });
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

function updateCartUI() {
    const cartItemsWrapper = document.getElementById("cart-items");
    const cartBadge = document.getElementById("cart-badge");
    const mobCartBadge = document.getElementById("mobile-cart-badge");
    const cartSubtotal = document.getElementById("cart-subtotal");

    if (!cartItemsWrapper) return;

    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (totalQty > 0) {
        cartBadge.textContent = totalQty;
        cartBadge.classList.remove("scale-0");
        cartBadge.classList.add("scale-100");
        if (mobCartBadge) {
            mobCartBadge.textContent = totalQty;
            mobCartBadge.classList.remove("scale-0");
            mobCartBadge.classList.add("scale-100");
        }
    } else {
        cartBadge.classList.remove("scale-100");
        cartBadge.classList.add("scale-0");
        if (mobCartBadge) mobCartBadge.classList.add("scale-0");
    }

    if (cart.length === 0) {
        cartItemsWrapper.innerHTML = `
            <div class="py-16 text-center text-on-variant/50 flex flex-col items-center">
                <span class="material-symbols-outlined text-[36px]">shopping_basket</span>
                <p class="mt-4 text-xs font-bold uppercase">No items in basket</p>
            </div>
        `;
        cartSubtotal.textContent = "$0.00";
        return;
    }

    cartItemsWrapper.innerHTML = cart.map(item => {
        return `
            <div class="flex gap-4 p-3 bg-surface-low rounded-lg border border-white/5">
                <div class="h-16 w-16 bg-surface-container rounded overflow-hidden flex-shrink-0">
                    <img class="w-full h-full object-cover" src="${item.image}" alt="${item.name}"/>
                </div>
                <div class="flex-1 flex flex-col justify-between">
                    <div class="flex justify-between items-start">
                        <p class="font-bold text-xs truncate max-w-[160px] text-on-surface">${item.name}</p>
                        <button class="cart-remove-item text-on-variant hover:text-primary transition" data-id="${item.id}">
                            <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-primary font-bold text-xs">$${(item.price * item.quantity).toFixed(2)}</span>
                        <div class="flex items-center bg-surface-container border border-white/10 rounded-md p-0.5">
                            <button class="cart-qty-decrease px-1 hover:text-primary" data-id="${item.id}">
                                <span class="material-symbols-outlined text-xs">remove</span>
                            </button>
                            <span class="px-2 text-xs font-bold">${item.quantity}</span>
                            <button class="cart-qty-increase px-1 hover:text-primary" data-id="${item.id}">
                                <span class="material-symbols-outlined text-xs">add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    cartSubtotal.textContent = `$${calculateCartSubtotal().toFixed(2)}`;

    cartItemsWrapper.querySelectorAll(".cart-qty-increase").forEach(btn => {
        btn.addEventListener("click", (e) => updateCartQuantity(e.currentTarget.getAttribute("data-id"), "increase"));
    });
    cartItemsWrapper.querySelectorAll(".cart-qty-decrease").forEach(btn => {
        btn.addEventListener("click", (e) => updateCartQuantity(e.currentTarget.getAttribute("data-id"), "decrease"));
    });
    cartItemsWrapper.querySelectorAll(".cart-remove-item").forEach(btn => {
        btn.addEventListener("click", (e) => removeCartItem(e.currentTarget.getAttribute("data-id")));
    });
}

// ==========================================
// WISHLIST SELECTION HANDLERS
// ==========================================
function toggleWishlist(id) {
    const index = wishlist.indexOf(id);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast("Arrangement removed from wishlist.", "info");
    } else {
        wishlist.push(id);
        showToast("Arrangement saved to luxury wishlist.", "success");
    }
    localStorage.setItem("g_canon_wishlist", JSON.stringify(wishlist));
    updateWishlistUI();
    renderProducts();
}

function updateWishlistUI() {
    const badge = document.getElementById("wishlist-badge");
    if (!badge) return;

    if (wishlist.length > 0) {
        badge.textContent = wishlist.length;
        badge.classList.remove("scale-0");
        badge.classList.add("scale-100");
    } else {
        badge.classList.add("scale-0");
        badge.classList.remove("scale-100");
    }
}

// ==========================================
// MODAL DISPLAYS & CONTROLS
// ==========================================
function openQuickViewModal(id) {
    const p = PRODUCTS.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById("qv-image").src = p.image;
    document.getElementById("qv-category").textContent = p.category;
    document.getElementById("qv-name").textContent = p.name;
    document.getElementById("qv-desc").textContent = p.desc;
    document.getElementById("qv-price").textContent = `$${p.price.toFixed(2)}`;
    document.getElementById("qv-old-price").textContent = `$${p.oldPrice.toFixed(2)}`;
    document.getElementById("qv-rating").textContent = `(${p.rating} out of 5.0 rating)`;

    document.getElementById("qv-add-cart").setAttribute("data-id", p.id);
    document.getElementById("qv-order-whatsapp").setAttribute("data-id", p.id);

    activeQvQty = 1;
    document.getElementById("qv-qty-val").textContent = "1";

    const modal = document.getElementById("quick-view-modal");
    const overlay = document.getElementById("qv-overlay");
    const content = document.getElementById("qv-content");

    modal.classList.remove("hidden");
    setTimeout(() => {
        overlay.classList.remove("opacity-0");
        content.classList.remove("scale-95", "opacity-0");
    }, 10);
}

function closeQuickViewModal() {
    const overlay = document.getElementById("qv-overlay");
    const content = document.getElementById("qv-content");
    const modal = document.getElementById("quick-view-modal");

    overlay.classList.add("opacity-0");
    content.classList.add("scale-95", "opacity-0");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

function openCheckoutFormModal() {
    const modal = document.getElementById("checkout-modal");
    const overlay = document.getElementById("checkout-overlay");
    const content = document.getElementById("checkout-content");
    const totalDisplay = document.getElementById("wa-checkout-total");

    totalDisplay.textContent = `$${calculateCartSubtotal().toFixed(2)}`;

    const form = document.getElementById("whatsapp-checkout-form");
    form.setAttribute("data-mode", "cart");

    modal.classList.remove("hidden");
    setTimeout(() => {
        overlay.classList.remove("opacity-0");
        content.classList.remove("scale-95", "opacity-0");
    }, 10);
}

function openSingleProductCheckoutModal(prod, qty) {
    const modal = document.getElementById("checkout-modal");
    const overlay = document.getElementById("checkout-overlay");
    const content = document.getElementById("checkout-content");
    const totalDisplay = document.getElementById("wa-checkout-total");

    totalDisplay.textContent = `$${(prod.price * qty).toFixed(2)}`;

    const form = document.getElementById("whatsapp-checkout-form");
    form.setAttribute("data-mode", "single");
    form.setAttribute("data-single-id", prod.id);
    form.setAttribute("data-single-qty", qty);

    modal.classList.remove("hidden");
    setTimeout(() => {
        overlay.classList.remove("opacity-0");
        content.classList.remove("scale-95", "opacity-0");
    }, 10);
}

function closeCheckoutModal() {
    const overlay = document.getElementById("checkout-overlay");
    const content = document.getElementById("checkout-content");
    const modal = document.getElementById("checkout-modal");

    overlay.classList.add("opacity-0");
    content.classList.add("scale-95", "opacity-0");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

// ==========================================
// WHATSAPP API DATA GENERATION & REDIRECT
// ==========================================
function launchWhatsAppCheckoutMessage(order) {
    const studioPhone = "8801700000000"; 
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
            msg += `• 1x *${prod.name}* (Qty: ${singleQty}) — $${(prod.price * singleQty).toFixed(2)}%0A`;
            msg += `%0A*TOTAL PAYABLE:* $${(prod.price * singleQty).toFixed(2)}%0A`;
        }
    } else {
        order.items.forEach(item => {
            msg += `• *${item.name}* (Qty: ${item.quantity}) — $${(item.price * item.quantity).toFixed(2)}%0A`;
        });
        msg += `%0A*TOTAL PAYABLE:* $${order.subtotal.toFixed(2)}%0A`;
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
    const elements = document.querySelectorAll(".reveal-element");
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

function updateUserDisplayState(user) {
    userProfile = user;
    const nameDisplay = document.getElementById("user-display-name");
    const mobileUserStatus = document.getElementById("mobile-user-status");
    const mobileLogoutBtn = document.getElementById("mobile-logout-btn");

    if (nameDisplay) {
        // যদি লগইন করা ইউজার এডমিন হয়
        if (user.email === ADMIN_EMAIL) {
            nameDisplay.innerHTML = `Admin <span class="text-[9px] bg-primary px-1.5 py-0.5 rounded ml-1">Portal</span>`;
            nameDisplay.closest("button").onclick = openAdminModal;
        } else {
            nameDisplay.textContent = user.displayName ? user.displayName.split(" ")[0] : user.email.split("@")[0];
            nameDisplay.closest("button").onclick = () => {
                if (confirm("আপনি কি লগআউট করতে চান?")) performSecureLogout();
            };
        }
    }
    if (mobileUserStatus) {
        mobileUserStatus.textContent = `Signed in as: ${user.email}`;
    }
    if (mobileLogoutBtn) {
        mobileLogoutBtn.classList.remove("hidden");
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

function openAdminModal() {
    const modal = document.getElementById("admin-modal");
    const overlay = document.getElementById("admin-overlay");
    const content = document.getElementById("admin-content");

    // ডাটাবেজ থেকে ডেটা এনে ড্যাশবোর্ডে দেখাবে
    populateAdminDashboard();

    modal.classList.remove("hidden");
    setTimeout(() => {
        overlay.classList.remove("opacity-0");
        content.classList.remove("scale-95", "opacity-0");
    }, 10);
}

function closeAdminModal() {
    const modal = document.getElementById("admin-modal");
    const overlay = document.getElementById("admin-overlay");
    const content = document.getElementById("admin-content");

    overlay.classList.add("opacity-0");
    content.classList.add("scale-95", "opacity-0");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

// বাটনগুলোর সাথে ফাংশন কানেক্ট করা
document.getElementById("admin-close").addEventListener("click", closeAdminModal);
document.getElementById("admin-overlay").addEventListener("click", closeAdminModal);

async function populateAdminDashboard() {
    let orders = [];
    let queriesList = [];
    let newsletters = [];

    // ফায়ারবেস একটিভ থাকলে ফায়ারবেস থেকে আনবে, নয়তো লোকাল স্টোরেজ থেকে আনবে
    if (isFirebaseActive) {
        try {
            const ordersSnap = await getDocs(collection(db, "orders"));
            ordersSnap.forEach(doc => orders.push(doc.data()));

            const contactSnap = await getDocs(collection(db, "contact"));
            contactSnap.forEach(doc => queriesList.push(doc.data()));

            const newsletterSnap = await getDocs(collection(db, "newsletter"));
            newsletterSnap.forEach(doc => newsletters.push(doc.data()));
        } catch (err) {
            console.error("Firestore থেকে ডেটা আনতে ব্যর্থ", err);
        }
    } else {
        orders = JSON.parse(localStorage.getItem("g_canon_orders")) || [];
        queriesList = JSON.parse(localStorage.getItem("g_canon_queries")) || [];
        newsletters = JSON.parse(localStorage.getItem("g_canon_newsletter")) || [];
    }

    // ড্যাশবোর্ডের সংখ্যা আপডেট করা
    document.getElementById("admin-orders-count").textContent = orders.length;
    document.getElementById("admin-queries-count").textContent = queriesList.length;
    document.getElementById("admin-subscribers-count").textContent = newsletters.length;

    // অর্ডার লিস্ট রেন্ডার করা
    const ordersListEl = document.getElementById("admin-orders-list");
    if (orders.length === 0) {
        ordersListEl.innerHTML = `<p class="text-xs text-on-variant/50">এখনো কোনো অর্ডার নেই।</p>`;
    } else {
        ordersListEl.innerHTML = orders.map(o => `
            <div class="p-3 bg-surface border border-white/5 rounded-lg space-y-1">
                <div class="flex justify-between font-bold text-xs">
                    <span class="text-primary">${o.customerName}</span>
                    <span>$${o.subtotal ? o.subtotal.toFixed(2) : '0.00'}</span>
                </div>
                <p class="text-[10px] text-on-variant/70">মোবাইল: ${o.customerPhone} | ডেলিভারি তারিখ: ${o.deliveryDate}</p>
                <p class="text-[10px] text-on-variant/50 italic truncate">ঠিকানা: ${o.deliveryAddress}</p>
            </div>
        `).join("");
    }

    // মেসেজ লিস্ট রেন্ডার করা
    const queriesListEl = document.getElementById("admin-queries-list");
    if (queriesList.length === 0) {
        queriesListEl.innerHTML = `<p class="text-xs text-on-variant/50">কোনো ইনকোয়ারি বা মেসেজ নেই।</p>`;
    } else {
        queriesListEl.innerHTML = queriesList.map(q => `
            <div class="p-3 bg-surface border border-white/5 rounded-lg space-y-1">
                <div class="flex justify-between font-bold text-xs">
                    <span class="text-secondary">${q.name}</span>
                    <span class="text-[9px] uppercase tracking-wider bg-secondary/15 text-secondary px-1.5 rounded">${q.subject}</span>
                </div>
                <p class="text-[10px] text-on-variant/70">মোবাইল: ${q.phone || 'N/A'} | ইমেইল: ${q.email}</p>
                <p class="text-[11px] text-on-variant bg-surface-container/50 p-2 rounded mt-1.5 leading-relaxed">"${q.message}"</p>
            </div>
        `).join("");
    }
}