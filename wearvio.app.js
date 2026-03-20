(function () {
  const FALLBACK_CATEGORIES = [
    {
      id: "fallback-streetwear",
      name: "Streetwear",
      slug: "streetwear",
      description: "Oversized fits, blazers, and urban layers."
    },
    {
      id: "fallback-y2k",
      name: "Y2K",
      slug: "y2k",
      description: "Retro-inspired silhouettes and throwback styling."
    },
    {
      id: "fallback-hoodies",
      name: "Hoodies",
      slug: "hoodies",
      description: "Statement hoodies and puffer layers."
    },
    {
      id: "fallback-accessories",
      name: "Accessories",
      slug: "accessories",
      description: "Mini bags, eyewear, and finishing pieces."
    },
    {
      id: "fallback-bottoms",
      name: "Bottoms",
      slug: "bottoms",
      description: "Cargo skirts, trousers, and utility fits."
    },
    {
      id: "fallback-shoes",
      name: "Shoes",
      slug: "shoes",
      description: "Chunky sneakers and statement footwear."
    }
  ];

  const FALLBACK_PRODUCTS = [
    {
      id: "fallback-1",
      name: "Oversized Acid Wash Tee",
      brand: "WEARVIO ORIGINALS",
      price: 1299,
      compare_at_price: null,
      image_url:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=85&fit=crop&crop=top",
      category: { slug: "streetwear", name: "Streetwear" },
      tag: "hot",
      sizes: ["XS", "S", "M", "L"],
      quantity: 48
    },
    {
      id: "fallback-2",
      name: "Y2K Low Rise Cargos",
      brand: "CARGO CULTURE",
      price: 2499,
      compare_at_price: 3199,
      image_url:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=85&fit=crop&crop=top",
      category: { slug: "y2k", name: "Y2K" },
      tag: "sale",
      sizes: ["XS", "S", "M", "L", "XL"],
      quantity: 12
    },
    {
      id: "fallback-3",
      name: "Cyber Zip Hoodie",
      brand: "TECHZONE",
      price: 3799,
      compare_at_price: null,
      image_url:
        "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=85&fit=crop&crop=top",
      category: { slug: "hoodies", name: "Hoodies" },
      tag: "new",
      sizes: ["S", "M", "L", "XL"],
      quantity: 2
    },
    {
      id: "fallback-4",
      name: "Mini Crossbody Bag",
      brand: "STRPD",
      price: 1899,
      compare_at_price: null,
      image_url:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=85&fit=crop",
      category: { slug: "accessories", name: "Accessories" },
      tag: "hot",
      sizes: ["ONE SIZE"],
      quantity: 17
    },
    {
      id: "fallback-5",
      name: "Chunky Platform Sneakers",
      brand: "SOLE THEORY",
      price: 4299,
      compare_at_price: 5499,
      image_url:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=85&fit=crop",
      category: { slug: "shoes", name: "Shoes" },
      tag: "sale",
      sizes: ["6", "7", "8", "9", "10"],
      quantity: 29
    },
    {
      id: "fallback-6",
      name: "Coquette Bow Mini Skirt",
      brand: "PASTEL RIOT",
      price: 1799,
      compare_at_price: null,
      image_url:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=85&fit=crop&crop=top",
      category: { slug: "y2k", name: "Y2K" },
      tag: "new",
      sizes: ["XS", "S", "M", "L"],
      quantity: 21
    },
    {
      id: "fallback-7",
      name: "Wide Leg Trousers",
      brand: "WRVIO STUDIO",
      price: 2299,
      compare_at_price: null,
      image_url:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=85&fit=crop&crop=top",
      category: { slug: "bottoms", name: "Bottoms" },
      tag: "hot",
      sizes: ["XS", "S", "M", "L", "XL"],
      quantity: 33
    },
    {
      id: "fallback-8",
      name: "Tinted Aviator Sunglasses",
      brand: "LENSCRAFT",
      price: 999,
      compare_at_price: 1499,
      image_url:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=85&fit=crop",
      category: { slug: "accessories", name: "Accessories" },
      tag: "sale",
      sizes: ["ONE SIZE"],
      quantity: 50
    },
    {
      id: "fallback-9",
      name: "Dark Academia Blazer",
      brand: "ACADEMIA CO.",
      price: 4599,
      compare_at_price: null,
      image_url:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=85&fit=crop&crop=top",
      category: { slug: "streetwear", name: "Streetwear" },
      tag: "new",
      sizes: ["XS", "S", "M", "L", "XL"],
      quantity: 11
    },
    {
      id: "fallback-10",
      name: "Puffer Vest Neon",
      brand: "ARCTIC DROP",
      price: 3199,
      compare_at_price: 3999,
      image_url:
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=85&fit=crop&crop=top",
      category: { slug: "hoodies", name: "Hoodies" },
      tag: "hot",
      sizes: ["S", "M", "L", "XL"],
      quantity: 9
    },
    {
      id: "fallback-11",
      name: "Vintage Band Tee",
      brand: "REWIND",
      price: 1499,
      compare_at_price: null,
      image_url:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=85&fit=crop&crop=top",
      category: { slug: "streetwear", name: "Streetwear" },
      tag: "ltd",
      sizes: ["XS", "S", "M", "L"],
      quantity: 41
    },
    {
      id: "fallback-12",
      name: "Utility Cargo Skirt",
      brand: "UTILITY GANG",
      price: 2099,
      compare_at_price: 2599,
      image_url:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=85&fit=crop&crop=top",
      category: { slug: "bottoms", name: "Bottoms" },
      tag: "sale",
      sizes: ["XS", "S", "M", "L"],
      quantity: 18
    }
  ];

  const TAG_CLASS = {
    hot: "t-hot",
    new: "t-new",
    ltd: "t-ltd",
    sale: "t-sale"
  };

  const AI_RESPONSES = {
    "Y2K aesthetic fits":
      "Love that vibe! Y2K Low Rise Cargos + Coquette Bow Skirt + chunky platform sneakers = perfect throwback moment.",
    "Streetwear under Rs 2000":
      "Oversized Acid Wash Tee and Vintage Band Tee are both great budget picks right now.",
    "Streetwear under ₹2000":
      "Oversized Acid Wash Tee and Vintage Band Tee are both great budget picks right now.",
    "Outfit for a concert":
      "Concert fit unlocked: Cyber Zip Hoodie + Utility Cargo Skirt + Chunky Platform Sneakers.",
    "Trending hoodies":
      "Cyber Zip Hoodie and Puffer Vest Neon are both trending hard right now."
  };

  const state = {
    products: FALLBACK_PRODUCTS.map(normalizeProduct),
    categories: FALLBACK_CATEGORIES.slice(),
    selectedCategory: "all",
    cart: [],
    cartOpen: false,
    aiOpen: false,
    supabase: null,
    user: null
  };

  let toastTimer;

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeProduct(product) {
    return {
      id: String(product.id),
      name: product.name,
      brand: product.brand || "WEARVIO",
      price: Number(product.price || 0),
      compare_at_price: product.compare_at_price
        ? Number(product.compare_at_price)
        : null,
      image_url: product.image_url || product.img || "",
      category: product.category || {
        slug: product.cat || "all",
        name: product.cat || "All"
      },
      tag: product.tag || null,
      sizes: Array.isArray(product.sizes) ? product.sizes : [],
      quantity: Number(product.quantity || 0),
      low_stock_threshold: Number(product.low_stock_threshold || 0),
      description: product.description || "",
      sku: product.sku || ""
    };
  }

  function getPublicConfig() {
    return window.WEARVIO_PUBLIC_CONFIG || {
      supabaseUrl: "",
      supabaseAnonKey: ""
    };
  }

  function showPage(id) {
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active");
    });

    const page = document.getElementById(id + "-page");
    if (page) {
      page.classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function gotoSection(id) {
    showPage("home");

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    const toast = document.getElementById("toast");
    const text = document.getElementById("toast-text");

    if (!toast || !text) {
      return;
    }

    text.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function initCursor() {
    const cursor = document.getElementById("cur");
    const ring = document.getElementById("cur-ring");

    if (!cursor || !ring) {
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.style.transform = "translate(" + (mouseX - 6) + "px," + (mouseY - 6) + "px)";
    });

    function animateRing() {
      ringX += (mouseX - ringX - 19) * 0.11;
      ringY += (mouseY - ringY - 19) * 0.11;
      ring.style.transform = "translate(" + ringX + "px," + ringY + "px)";
      window.requestAnimationFrame(animateRing);
    }

    animateRing();

    const interactiveSelector =
      "button,a,.prod-card,.drop-card,.cat-tab,.topic-chip,.ai-chip,.soc-btn,.wv-cart,.wish-btn,.sz";

    document.addEventListener("mouseover", (event) => {
      if (event.target.closest(interactiveSelector)) {
        ring.style.borderColor = "rgba(200,255,0,.75)";
        ring.style.width = "48px";
        ring.style.height = "48px";
      }
    });

    document.addEventListener("mouseout", (event) => {
      if (event.target.closest(interactiveSelector)) {
        ring.style.borderColor = "rgba(200,255,0,.35)";
        ring.style.width = "38px";
        ring.style.height = "38px";
      }
    });
  }

  function persistCart() {
    window.localStorage.setItem("wearvio-cart", JSON.stringify(state.cart));
  }

  function restoreCart() {
    try {
      const saved = JSON.parse(window.localStorage.getItem("wearvio-cart") || "[]");
      state.cart = Array.isArray(saved) ? saved : [];
    } catch (error) {
      state.cart = [];
    }
  }

  function getFilteredProducts() {
    if (state.selectedCategory === "all") {
      return state.products;
    }

    return state.products.filter((product) => {
      return product.category && product.category.slug === state.selectedCategory;
    });
  }

  function renderCategoryTabs() {
    const container = document.getElementById("category-tabs");
    if (!container) {
      return;
    }

    const tabs = [
      { name: "All", slug: "all" }
    ].concat(
      state.categories.map((category) => ({
        name: category.name,
        slug: category.slug
      }))
    );

    container.innerHTML = tabs
      .map((tab) => {
        const activeClass = state.selectedCategory === tab.slug ? " active" : "";
        return (
          '<div class="cat-tab' +
          activeClass +
          '" onclick="filterCat(this,\'' +
          escapeHtml(tab.slug) +
          "')\">" +
          escapeHtml(tab.name) +
          "</div>"
        );
      })
      .join("");
  }

  function renderProducts(list) {
    const grid = document.getElementById("product-grid");
    if (!grid) {
      return;
    }

    if (!list.length) {
      grid.innerHTML =
        '<div style="padding:1.2rem;border:1px solid rgba(255,255,255,.09);border-radius:14px;color:rgba(245,242,238,.6);font-family:var(--fu);">No products found in this category yet.</div>';
      return;
    }

    grid.innerHTML = list
      .map((product) => {
        const tag = product.tag
          ? '<span class="tag ' +
            (TAG_CLASS[product.tag] || "t-hot") +
            '">' +
            escapeHtml(product.tag.toUpperCase()) +
            "</span>"
          : "";
        const comparePrice = product.compare_at_price
          ? '<span class="prod-old">₹' +
            Number(product.compare_at_price).toLocaleString("en-IN") +
            "</span>"
          : "";
        const sizes = (product.sizes || [])
          .map((size) => '<div class="sz">' + escapeHtml(size) + "</div>")
          .join("");
        const disabled = product.quantity <= 0 ? " disabled" : "";
        const buttonLabel = product.quantity <= 0 ? "×" : "+";

        return (
          '<div class="prod-card">' +
          '<div class="prod-tags">' +
          tag +
          "</div>" +
          '<div class="wish-btn" onclick="toggleWish(this)">♡</div>' +
          '<div class="prod-img-wrap">' +
          '<img src="' +
          escapeHtml(product.image_url) +
          '" alt="' +
          escapeHtml(product.name) +
          '" loading="lazy" onerror="this.parentElement.style.background=\'#1a1a2e\';this.style.display=\'none\'">' +
          "</div>" +
          '<div class="prod-info">' +
          '<div class="prod-brand">' +
          escapeHtml(product.brand) +
          "</div>" +
          '<div class="prod-name">' +
          escapeHtml(product.name) +
          "</div>" +
          '<div class="prod-sizes">' +
          sizes +
          "</div>" +
          '<div class="prod-bottom">' +
          '<div class="prod-price">' +
          comparePrice +
          " ₹" +
          Number(product.price).toLocaleString("en-IN") +
          "</div>" +
          '<button class="add-btn" onclick="addToCart(\'' +
          product.id +
          "')" +
          disabled +
          ">" +
          buttonLabel +
          "</button>" +
          "</div>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function filterCat(clickedElement, categorySlug) {
    state.selectedCategory = categorySlug;
    document.querySelectorAll(".cat-tab").forEach((tab) => {
      tab.classList.remove("active");
    });

    if (clickedElement && clickedElement.classList) {
      clickedElement.classList.add("active");
    }

    renderProducts(getFilteredProducts());
  }

  function updateCart() {
    const badge = document.getElementById("cart-badge");
    const body = document.getElementById("cart-body");
    const footer = document.getElementById("cart-ft");
    const emptyState = document.getElementById("cart-empty");
    const total = document.getElementById("cart-total");
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);

    if (badge) {
      badge.textContent = String(count);
    }

    if (!body || !footer || !emptyState || !total) {
      return;
    }

    if (!state.cart.length) {
      body.innerHTML = "";
      body.appendChild(emptyState);
      emptyState.style.display = "flex";
      footer.style.display = "none";
      persistCart();
      return;
    }

    emptyState.style.display = "none";
    footer.style.display = "block";
    total.textContent =
      "₹" +
      state.cart
        .reduce((sum, item) => sum + item.price * item.qty, 0)
        .toLocaleString("en-IN");

    body.innerHTML = state.cart
      .map((item, index) => {
        return (
          '<div class="cart-item">' +
          '<div class="ci-img"><img src="' +
          escapeHtml(item.image_url) +
          '" alt="' +
          escapeHtml(item.name) +
          '" style="width:100%;height:100%;object-fit:cover;"></div>' +
          '<div style="flex:1;min-width:0;">' +
          '<div class="ci-name">' +
          escapeHtml(item.name) +
          "</div>" +
          '<div class="ci-sz">Qty linked to live stock · ' +
          escapeHtml(item.brand) +
          "</div>" +
          "</div>" +
          '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:.45rem;">' +
          '<div class="ci-price">₹' +
          (item.price * item.qty).toLocaleString("en-IN") +
          "</div>" +
          '<div class="qty-ctrl">' +
          '<button class="qty-btn" onclick="changeQty(' +
          index +
          ',-1)">−</button>' +
          '<span class="qty-n">' +
          item.qty +
          "</span>" +
          '<button class="qty-btn" onclick="changeQty(' +
          index +
          ',1)">+</button>' +
          "</div>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    persistCart();
  }

  function addToCart(productId) {
    const product = state.products.find((item) => item.id === String(productId));
    if (!product) {
      showToast("Product not found");
      return;
    }

    if (product.quantity <= 0) {
      showToast("This product is currently out of stock");
      return;
    }

    const existing = state.cart.find((item) => item.product_id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        product_id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image_url: product.image_url,
        qty: 1
      });
    }

    updateCart();
    showToast(product.name + " added to bag");
  }

  function changeQty(index, delta) {
    const item = state.cart[index];
    if (!item) {
      return;
    }

    item.qty += delta;
    if (item.qty <= 0) {
      state.cart.splice(index, 1);
    }

    updateCart();
  }

  function toggleCart(forceState) {
    if (typeof forceState === "boolean") {
      state.cartOpen = forceState;
    } else {
      state.cartOpen = !state.cartOpen;
    }

    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");

    if (drawer) {
      drawer.classList.toggle("open", state.cartOpen);
    }

    if (overlay) {
      overlay.classList.toggle("open", state.cartOpen);
    }
  }

  function toggleWish(element) {
    element.classList.toggle("liked");
    element.textContent = element.classList.contains("liked") ? "♥" : "♡";
    if (element.classList.contains("liked")) {
      showToast("Added to wishlist");
    }
  }

  function toggleAI() {
    state.aiOpen = !state.aiOpen;
    const panel = document.getElementById("ai-panel");
    if (panel) {
      panel.classList.toggle("open", state.aiOpen);
    }
  }

  function sendAI(message) {
    const list = document.getElementById("ai-msgs");
    if (!list) {
      return;
    }

    list.innerHTML += '<div class="ai-m usr">' + escapeHtml(message) + "</div>";
    list.scrollTop = list.scrollHeight;

    window.setTimeout(() => {
      const response =
        AI_RESPONSES[message] ||
        ("Great question! I found some strong " +
          String(message || "fashion").toLowerCase() +
          " picks that match the WEARVIO vibe.");
      list.innerHTML += '<div class="ai-m bot">' + escapeHtml(response) + "</div>";
      list.scrollTop = list.scrollHeight;
    }, 700);
  }

  function sendAIInput() {
    const input = document.getElementById("ai-inp");
    if (!input) {
      return;
    }

    const value = input.value.trim();
    if (!value) {
      return;
    }

    input.value = "";
    sendAI(value);
  }

  function toggleTopic(element) {
    element.classList.toggle("sel");
  }

  function setButtonLoading(button, loading, label) {
    if (!button) {
      return;
    }

    if (!button.dataset.defaultText) {
      button.dataset.defaultText = button.textContent;
    }

    button.disabled = loading;
    button.textContent = loading ? label : button.dataset.defaultText;
  }

  function updateAuthButton() {
    const button = document.getElementById("nav-auth-btn");
    if (!button) {
      return;
    }

    if (state.user) {
      button.textContent = "Sign Out";
      button.onclick = async function () {
        if (state.supabase) {
          await state.supabase.auth.signOut();
        }
        state.user = null;
        updateAuthButton();
        showToast("Signed out");
        showPage("home");
      };
      return;
    }

    button.textContent = "Sign In";
    button.onclick = function () {
      showPage("login");
    };
  }

  async function initSupabase() {
    const config = getPublicConfig();

    if (!config.supabaseUrl || !config.supabaseAnonKey || !window.supabase) {
      updateAuthButton();
      return;
    }

    state.supabase = window.supabase.createClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    const sessionResult = await state.supabase.auth.getSession();
    state.user = sessionResult.data.session
      ? sessionResult.data.session.user
      : null;
    updateAuthButton();

    state.supabase.auth.onAuthStateChange(function (_event, session) {
      state.user = session ? session.user : null;
      updateAuthButton();
    });
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    if (!state.supabase) {
      showToast("Supabase public config add karne ke baad login live hoga");
      return;
    }

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const button = document.getElementById("login-submit");

    if (!email || !password) {
      showToast("Email aur password required hai");
      return;
    }

    try {
      setButtonLoading(button, true, "Signing In...");
      const result = await state.supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (result.error) {
        throw result.error;
      }

      state.user = result.data.user || null;
      updateAuthButton();
      showPage("home");
      showToast("Welcome back");
    } catch (error) {
      showToast(error.message || "Login failed");
    } finally {
      setButtonLoading(button, false, "");
    }
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();

    if (!state.supabase) {
      showToast("Supabase public config add karne ke baad signup live hoga");
      return;
    }

    const firstName = document.getElementById("signup-first-name").value.trim();
    const lastName = document.getElementById("signup-last-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const vibe = document.getElementById("signup-vibe").value;
    const button = document.getElementById("signup-submit");
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

    if (!firstName || !email || !password) {
      showToast("Please fill the required signup fields");
      return;
    }

    try {
      setButtonLoading(button, true, "Creating...");
      const result = await state.supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName || firstName,
            vibe: vibe
          }
        }
      });

      if (result.error) {
        throw result.error;
      }

      if (result.data.session && result.data.user) {
        state.user = result.data.user;
        updateAuthButton();
        showPage("home");
        showToast("Account created");
      } else {
        showPage("login");
        showToast("Account created. Email confirmation off ho to aap ab login kar sakte ho.");
      }
    } catch (error) {
      showToast(error.message || "Signup failed");
    } finally {
      setButtonLoading(button, false, "");
    }
  }

  async function handleCheckout() {
    if (!state.cart.length) {
      showToast("Your bag is empty");
      return;
    }

    if (!state.supabase || !state.user) {
      showPage("login");
      showToast("Order place karne ke liye pehle sign in karein");
      return;
    }

    try {
      const sessionResult = await state.supabase.auth.getSession();
      const session = sessionResult.data.session;

      if (!session) {
        showPage("login");
        showToast("Session expired. Please sign in again.");
        return;
      }

      const response = await fetch("/api/public/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.access_token
        },
        body: JSON.stringify({
          items: state.cart.map((item) => ({
            product_id: item.product_id,
            quantity: item.qty
          }))
        })
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Checkout failed");
      }

      state.cart = [];
      updateCart();
      toggleCart(false);
      showToast("Order placed successfully");
      loadStorefront();
    } catch (error) {
      showToast(error.message || "Checkout failed");
    }
  }

  async function handleNewsletterSubmit(event) {
    event.preventDefault();

    const input = document.getElementById("newsletter-email");
    if (!input || !input.value.trim()) {
      showToast("Please enter your email");
      return;
    }

    try {
      const response = await fetch("/api/public/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "newsletter",
          email: input.value.trim()
        })
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Subscription failed");
      }

      input.value = "";
      showToast("You're on the list");
    } catch (error) {
      showToast(error.message || "Subscription failed");
    }
  }

  async function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    const topics = Array.from(document.querySelectorAll(".topic-chip.sel")).map(
      function (chip) {
        return chip.textContent.trim();
      }
    );

    if (!name || !email || !subject || !message) {
      showToast("Please fill all contact fields");
      return;
    }

    try {
      const response = await fetch("/api/public/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "contact",
          name: name,
          email: email,
          subject: subject,
          message: message,
          topics: topics
        })
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Message send failed");
      }

      document.getElementById("contact-form").reset();
      showToast("Message sent successfully");
    } catch (error) {
      showToast(error.message || "Message send failed");
    }
  }

  async function loadStorefront() {
    const grid = document.getElementById("product-grid");
    if (grid) {
      grid.innerHTML =
        '<div style="padding:1.2rem;border:1px solid rgba(255,255,255,.09);border-radius:14px;color:rgba(245,242,238,.6);font-family:var(--fu);">Loading live catalog...</div>';
    }

    try {
      const response = await fetch("/api/public/store");
      const payload = await response.json();

      if (payload.ok && payload.configured) {
        state.categories = payload.categories || FALLBACK_CATEGORIES.slice();
        state.products = (payload.products || []).map(normalizeProduct);
      } else {
        state.categories = FALLBACK_CATEGORIES.slice();
        state.products = FALLBACK_PRODUCTS.map(normalizeProduct);
      }
    } catch (error) {
      state.categories = FALLBACK_CATEGORIES.slice();
      state.products = FALLBACK_PRODUCTS.map(normalizeProduct);
    }

    if (
      state.selectedCategory !== "all" &&
      !state.categories.some((category) => category.slug === state.selectedCategory)
    ) {
      state.selectedCategory = "all";
    }

    renderCategoryTabs();
    renderProducts(getFilteredProducts());
  }

  function bindForms() {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const newsletterForm = document.getElementById("newsletter-form");
    const contactForm = document.getElementById("contact-form");
    const checkoutButton = document.getElementById("checkout-btn");

    if (loginForm) {
      loginForm.addEventListener("submit", handleLoginSubmit);
    }

    if (signupForm) {
      signupForm.addEventListener("submit", handleSignupSubmit);
    }

    if (newsletterForm) {
      newsletterForm.addEventListener("submit", handleNewsletterSubmit);
    }

    if (contactForm) {
      contactForm.addEventListener("submit", handleContactSubmit);
    }

    if (checkoutButton) {
      checkoutButton.addEventListener("click", handleCheckout);
    }
  }

  function init() {
    initCursor();
    restoreCart();
    updateCart();
    bindForms();
    initSupabase();
    loadStorefront();
    updateAuthButton();
  }

  window.showPage = showPage;
  window.gotoSection = gotoSection;
  window.showToast = showToast;
  window.filterCat = filterCat;
  window.addToCart = addToCart;
  window.changeQty = changeQty;
  window.toggleCart = toggleCart;
  window.toggleWish = toggleWish;
  window.toggleAI = toggleAI;
  window.sendAI = sendAI;
  window.sendAIInput = sendAIInput;
  window.toggleTopic = toggleTopic;

  init();
})();
