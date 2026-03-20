(function () {
  const state = {
    session: null,
    currentSection: "dashboard",
    dashboard: null,
    products: [],
    categories: [],
    orders: [],
    users: [],
    logs: []
  };

  const SECTION_CONFIG = {
    dashboard: {
      title: "Dashboard overview",
      subtitle: "Live overview of products, low stock alerts, and orders.",
      actionLabel: "+ Add product",
      action: openProductModal
    },
    products: {
      title: "Products",
      subtitle: "Manage catalog pricing, stock, tags, and storefront visibility.",
      actionLabel: "+ Add product",
      action: openProductModal
    },
    categories: {
      title: "Categories",
      subtitle: "Organize storefront collections without changing the public design.",
      actionLabel: "+ Add category",
      action: openCategoryModal
    },
    orders: {
      title: "Orders",
      subtitle: "Track live orders and update fulfillment status from one place.",
      actionLabel: "",
      action: null
    },
    "stock-logs": {
      title: "Stock logs",
      subtitle: "Every quantity change is recorded automatically for review.",
      actionLabel: "",
      action: null
    },
    users: {
      title: "Users",
      subtitle: "Customer accounts synced from the storefront sign up flow.",
      actionLabel: "",
      action: null
    },
    settings: {
      title: "Settings",
      subtitle: "Check backend health and export a backup snapshot anytime.",
      actionLabel: "Download backup",
      action: downloadBackup
    }
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatCurrency(value) {
    return "₹" + Number(value || 0).toLocaleString("en-IN");
  }

  function formatDate(value) {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function getStatusClass(value) {
    const normalized = String(value || "").toLowerCase();

    if (normalized === "paid" || normalized === "active") {
      return "paid";
    }

    if (normalized === "processing") {
      return "processing";
    }

    if (normalized === "shipped") {
      return "shipped";
    }

    if (normalized === "cancelled" || normalized === "inactive") {
      return "cancelled";
    }

    return "";
  }

  async function api(path, options) {
    const response = await fetch(path, {
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...(options && options.headers ? options.headers : {})
      },
      ...options
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && payload.message
          ? payload.message
          : "Request failed";
      const error = new Error(message);
      error.statusCode = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  }

  function setStatus(message, type) {
    const banner = document.getElementById("status-banner");
    if (!banner) {
      return;
    }

    banner.textContent = message || "";
    banner.className = "status-banner" + (message ? " show" : "");
    if (type) {
      banner.classList.add(type);
    }
  }

  function setSection(section) {
    state.currentSection = section;

    document.querySelectorAll(".nav-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.section === section);
    });

    document.querySelectorAll(".section").forEach((element) => {
      element.classList.toggle("active", element.id === section + "-section");
    });

    const config = SECTION_CONFIG[section];
    document.getElementById("page-title").textContent = config.title;
    document.getElementById("page-sub").textContent = config.subtitle;

    const actionButton = document.getElementById("primary-action-button");
    if (!config.actionLabel || !config.action) {
      actionButton.hidden = true;
      actionButton.onclick = null;
      return;
    }

    actionButton.hidden = false;
    actionButton.textContent = config.actionLabel;
    actionButton.onclick = config.action;
  }

  function openModal(id) {
    document.getElementById(id).classList.add("open");
  }

  function closeModal(id) {
    document.getElementById(id).classList.remove("open");
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function populateCategorySelect() {
    const select = document.getElementById("product-category");
    select.innerHTML = state.categories
      .map((category) => {
        return (
          '<option value="' +
          escapeHtml(category.id) +
          '">' +
          escapeHtml(category.name) +
          "</option>"
        );
      })
      .join("");
  }

  function openProductModal(product) {
    populateCategorySelect();
    document.getElementById("product-form").reset();
    document.getElementById("product-modal-title").textContent = product
      ? "Edit product"
      : "Add product";
    document.getElementById("product-id").value = product ? product.id : "";
    document.getElementById("product-name").value = product ? product.name : "";
    document.getElementById("product-brand").value = product ? product.brand : "WEARVIO";
    document.getElementById("product-category").value =
      product && product.category ? product.category.id : state.categories[0] ? state.categories[0].id : "";
    document.getElementById("product-sku").value = product ? product.sku || "" : "";
    document.getElementById("product-price").value = product ? Number(product.price || 0) : "";
    document.getElementById("product-compare-price").value = product
      ? product.compare_at_price || ""
      : "";
    document.getElementById("product-quantity").value = product ? Number(product.quantity || 0) : 0;
    document.getElementById("product-threshold").value = product
      ? Number(product.low_stock_threshold || 0)
      : 5;
    document.getElementById("product-image-url").value = product ? product.image_url || "" : "";
    document.getElementById("product-tag").value = product ? product.tag || "" : "";
    document.getElementById("product-sizes").value = product
      ? (product.sizes || []).join(", ")
      : "";
    document.getElementById("product-active").value =
      product && product.is_active === false ? "false" : "true";
    document.getElementById("product-description").value = product
      ? product.description || ""
      : "";
    openModal("product-modal");
  }

  function openCategoryModal(category) {
    document.getElementById("category-form").reset();
    document.getElementById("category-modal-title").textContent = category
      ? "Edit category"
      : "Add category";
    document.getElementById("category-id").value = category ? category.id : "";
    document.getElementById("category-name").value = category ? category.name : "";
    document.getElementById("category-slug").value = category ? category.slug : "";
    document.getElementById("category-description").value = category
      ? category.description || ""
      : "";
    openModal("category-modal");
  }

  function getProductPayloadFromForm() {
    return {
      id: document.getElementById("product-id").value.trim(),
      name: document.getElementById("product-name").value.trim(),
      brand: document.getElementById("product-brand").value.trim(),
      category_id: document.getElementById("product-category").value,
      sku: document.getElementById("product-sku").value.trim(),
      price: document.getElementById("product-price").value,
      compare_at_price: document.getElementById("product-compare-price").value,
      quantity: document.getElementById("product-quantity").value,
      low_stock_threshold: document.getElementById("product-threshold").value,
      image_url: document.getElementById("product-image-url").value.trim(),
      tag: document.getElementById("product-tag").value,
      sizes: document
        .getElementById("product-sizes")
        .value.split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      is_active: document.getElementById("product-active").value === "true",
      description: document.getElementById("product-description").value.trim(),
      slug: slugify(document.getElementById("product-name").value)
    };
  }

  function getCategoryPayloadFromForm() {
    const name = document.getElementById("category-name").value.trim();
    return {
      id: document.getElementById("category-id").value.trim(),
      name: name,
      slug: slugify(document.getElementById("category-slug").value || name),
      description: document.getElementById("category-description").value.trim()
    };
  }

  function renderSummary() {
    const grid = document.getElementById("summary-grid");
    const summary = state.dashboard ? state.dashboard.summary : null;

    if (!summary) {
      grid.innerHTML =
        '<div class="panel" style="grid-column:1/-1;"><div class="empty">Dashboard data abhi available nahi hai.</div></div>';
      return;
    }

    grid.innerHTML = [
      {
        label: "Total products",
        value: summary.totalProducts,
        meta: "Live catalog count",
        tone: "success"
      },
      {
        label: "Low stock alerts",
        value: summary.lowStockAlerts,
        meta: summary.lowStockAlerts ? "Action needed" : "All healthy",
        tone: summary.lowStockAlerts ? "danger" : "success"
      },
      {
        label: "Orders today",
        value: summary.ordersToday,
        meta: "Confirmed and processing orders",
        tone: "success"
      },
      {
        label: "Revenue today",
        value: formatCurrency(summary.revenueToday),
        meta: "Paid orders only",
        tone: "warning"
      }
    ]
      .map((card) => {
        return (
          '<div class="summary-card">' +
          '<div class="summary-label">' +
          escapeHtml(card.label) +
          "</div>" +
          '<div class="summary-value">' +
          escapeHtml(card.value) +
          "</div>" +
          '<div class="summary-meta ' +
          card.tone +
          '">' +
          escapeHtml(card.meta) +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderLowStock() {
    const root = document.getElementById("low-stock-list");
    const list = state.dashboard ? state.dashboard.lowStock || [] : [];

    if (!list.length) {
      root.innerHTML = '<div class="empty">No low stock alerts right now.</div>';
      return;
    }

    root.innerHTML = list
      .map((product) => {
        const tone = Number(product.quantity) <= 2 ? "low" : "mid";
        return (
          '<div class="list-row">' +
          "<div>" +
          '<div class="row-title">' +
          escapeHtml(product.name) +
          "</div>" +
          '<div class="row-sub">' +
          escapeHtml(product.sku || "No SKU") +
          " · " +
          escapeHtml(product.category ? product.category.name : "Uncategorized") +
          "</div>" +
          "</div>" +
          '<span class="pill ' +
          tone +
          '">' +
          escapeHtml(product.quantity) +
          " left</span>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderRecentOrders() {
    const root = document.getElementById("recent-orders-list");
    const list = state.dashboard ? state.dashboard.recentOrders || [] : [];

    if (!list.length) {
      root.innerHTML = '<div class="empty">No recent orders yet.</div>';
      return;
    }

    root.innerHTML = list
      .map((order) => {
        const customer = order.user
          ? order.user.full_name || order.user.email
          : "Guest checkout";
        return (
          '<div class="list-row">' +
          "<div>" +
          '<div class="row-title">Order #' +
          escapeHtml(order.id.slice(0, 8)) +
          " · " +
          escapeHtml(customer) +
          "</div>" +
          '<div class="row-sub">' +
          formatCurrency(order.total_amount) +
          " · " +
          escapeHtml(formatDate(order.created_at)) +
          "</div>" +
          "</div>" +
          '<span class="pill ' +
          getStatusClass(order.status) +
          '">' +
          escapeHtml(order.status) +
          "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderDashboardProducts() {
    const body = document.getElementById("dashboard-products-body");
    const list = state.dashboard ? state.dashboard.products || [] : [];

    if (!list.length) {
      body.innerHTML = '<tr><td colspan="6" class="empty">No products available.</td></tr>';
      return;
    }

    body.innerHTML = list
      .map((product) => {
        return (
          "<tr>" +
          "<td><strong>" +
          escapeHtml(product.name) +
          "</strong></td>" +
          "<td>" +
          escapeHtml(product.sku || "—") +
          "</td>" +
          "<td>" +
          formatCurrency(product.price) +
          "</td>" +
          "<td>" +
          escapeHtml(product.quantity) +
          "</td>" +
          "<td>" +
          escapeHtml(product.category ? product.category.name : "Uncategorized") +
          "</td>" +
          '<td><span class="pill ' +
          getStatusClass(product.is_active === false ? "inactive" : "active") +
          '">' +
          escapeHtml(product.is_active === false ? "inactive" : "active") +
          "</span></td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderProducts() {
    const body = document.getElementById("products-body");
    document.getElementById("products-count").textContent =
      state.products.length + " products";

    if (!state.products.length) {
      body.innerHTML = '<tr><td colspan="6" class="empty">No products available.</td></tr>';
      return;
    }

    body.innerHTML = state.products
      .map((product) => {
        return (
          "<tr>" +
          "<td><strong>" +
          escapeHtml(product.name) +
          "</strong><div class='muted'>" +
          escapeHtml(product.brand) +
          "</div></td>" +
          "<td>" +
          escapeHtml(product.sku || "—") +
          "</td>" +
          "<td>" +
          formatCurrency(product.price) +
          "</td>" +
          "<td>" +
          escapeHtml(product.quantity) +
          "</td>" +
          "<td>" +
          escapeHtml(product.category ? product.category.name : "Uncategorized") +
          "</td>" +
          '<td><div class="table-actions">' +
          '<button class="mini-button" data-edit-product="' +
          escapeHtml(product.id) +
          '">Edit</button>' +
          '<button class="mini-button" data-toggle-product="' +
          escapeHtml(product.id) +
          '">' +
          (product.is_active === false ? "Activate" : "Deactivate") +
          "</button>" +
          "</div></td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderCategories() {
    const root = document.getElementById("categories-grid");

    if (!state.categories.length) {
      root.innerHTML = '<div class="panel"><div class="empty">No categories created yet.</div></div>';
      return;
    }

    root.innerHTML = state.categories
      .map((category) => {
        return (
          '<div class="category-card">' +
          "<h3>" +
          escapeHtml(category.name) +
          "</h3>" +
          '<p>' +
          escapeHtml(category.description || "No description yet.") +
          "</p>" +
          '<div class="muted" style="margin-bottom:16px;">/' +
          escapeHtml(category.slug) +
          "</div>" +
          '<div class="table-actions">' +
          '<button class="mini-button" data-edit-category="' +
          escapeHtml(category.id) +
          '">Edit</button>' +
          '<button class="mini-button" data-delete-category="' +
          escapeHtml(category.id) +
          '">Delete</button>' +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderOrders() {
    const body = document.getElementById("orders-body");
    document.getElementById("orders-count").textContent =
      state.orders.length + " orders";

    if (!state.orders.length) {
      body.innerHTML = '<tr><td colspan="6" class="empty">No orders available yet.</td></tr>';
      return;
    }

    body.innerHTML = state.orders
      .map((order) => {
        const customer = order.user
          ? order.user.full_name || order.user.email
          : "Guest checkout";
        const itemCount = Array.isArray(order.items) ? order.items.length : 0;
        return (
          "<tr>" +
          "<td><strong>#" +
          escapeHtml(order.id.slice(0, 8)) +
          "</strong></td>" +
          "<td>" +
          escapeHtml(customer) +
          "</td>" +
          "<td>" +
          escapeHtml(itemCount) +
          " items</td>" +
          "<td>" +
          formatCurrency(order.total_amount) +
          "</td>" +
          '<td><select class="select" data-order-status="' +
          escapeHtml(order.id) +
          '">' +
          ["pending", "processing", "paid", "shipped", "cancelled"]
            .map((status) => {
              return (
                '<option value="' +
                status +
                '"' +
                (order.status === status ? " selected" : "") +
                ">" +
                status +
                "</option>"
              );
            })
            .join("") +
          "</select></td>" +
          "<td>" +
          escapeHtml(formatDate(order.created_at)) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderLogs() {
    const body = document.getElementById("logs-body");
    document.getElementById("logs-count").textContent = state.logs.length + " logs";

    if (!state.logs.length) {
      body.innerHTML = '<tr><td colspan="6" class="empty">No stock log entries yet.</td></tr>';
      return;
    }

    body.innerHTML = state.logs
      .map((log) => {
        return (
          "<tr>" +
          "<td><strong>" +
          escapeHtml(log.product ? log.product.name : "Deleted product") +
          "</strong><div class='muted'>" +
          escapeHtml(log.product ? log.product.sku || "—" : "—") +
          "</div></td>" +
          "<td>" +
          escapeHtml(log.quantity_before) +
          "</td>" +
          "<td>" +
          escapeHtml(log.quantity_after) +
          "</td>" +
          "<td>" +
          escapeHtml(log.delta) +
          "</td>" +
          "<td>" +
          escapeHtml(log.reason || "Inventory update") +
          "</td>" +
          "<td>" +
          escapeHtml(formatDate(log.created_at)) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderUsers() {
    const body = document.getElementById("users-body");
    document.getElementById("users-count").textContent = state.users.length + " users";

    if (!state.users.length) {
      body.innerHTML = '<tr><td colspan="4" class="empty">No users synced yet.</td></tr>';
      return;
    }

    body.innerHTML = state.users
      .map((user) => {
        return (
          "<tr>" +
          "<td><strong>" +
          escapeHtml(user.full_name || "No name") +
          "</strong></td>" +
          "<td>" +
          escapeHtml(user.email) +
          "</td>" +
          '<td><span class="pill ' +
          getStatusClass(user.role === "admin" ? "active" : "") +
          '">' +
          escapeHtml(user.role) +
          "</span></td>" +
          "<td>" +
          escapeHtml(formatDate(user.created_at)) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderSettings() {
    const root = document.getElementById("settings-status");
    const summary = state.dashboard ? state.dashboard.summary : null;

    root.innerHTML = [
      {
        title: "Admin email",
        value: state.session ? state.session.user.email : "—"
      },
      {
        title: "Catalog size",
        value: summary ? String(summary.totalProducts) : "—"
      },
      {
        title: "Low stock alerts",
        value: summary ? String(summary.lowStockAlerts) : "—"
      },
      {
        title: "Orders today",
        value: summary ? String(summary.ordersToday) : "—"
      }
    ]
      .map((item) => {
        return (
          '<div class="list-row">' +
          '<div class="row-title">' +
          escapeHtml(item.title) +
          "</div>" +
          '<div class="row-sub">' +
          escapeHtml(item.value) +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderAll() {
    renderSummary();
    renderLowStock();
    renderRecentOrders();
    renderDashboardProducts();
    renderProducts();
    renderCategories();
    renderOrders();
    renderLogs();
    renderUsers();
    renderSettings();
    populateCategorySelect();
  }

  async function refreshData(successMessage) {
    setStatus("Syncing live data...", "");

    try {
      const results = await Promise.all([
        api("/api/admin/dashboard"),
        api("/api/admin/products"),
        api("/api/admin/categories"),
        api("/api/admin/orders"),
        api("/api/admin/data")
      ]);

      state.dashboard = results[0];
      state.products = results[1].products || [];
      state.categories = results[2].categories || [];
      state.orders = results[3].orders || [];
      state.users = results[4].users || [];
      state.logs = results[4].logs || [];
      renderAll();
      setStatus(successMessage || "Live backend connected and synced.", "success");
    } catch (error) {
      renderAll();
      setStatus(error.message || "Failed to load admin data.", "error");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const button = document.getElementById("admin-login-button");
    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;

    try {
      button.disabled = true;
      button.textContent = "Logging in...";
      const payload = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password })
      });

      state.session = payload;
      document.getElementById("owner-email").textContent = payload.user.email;
      document.getElementById("login-screen").hidden = true;
      document.getElementById("admin-app").hidden = false;
      setSection(state.currentSection);
      await refreshData("Admin session active.");
    } catch (error) {
      alert(error.message || "Admin login failed");
    } finally {
      button.disabled = false;
      button.textContent = "Login";
    }
  }

  async function checkSession() {
    try {
      const payload = await api("/api/admin/session");
      state.session = payload;
      document.getElementById("owner-email").textContent = payload.user.email;
      document.getElementById("login-screen").hidden = true;
      document.getElementById("admin-app").hidden = false;
      setSection(state.currentSection);
      await refreshData("Existing admin session restored.");
    } catch (error) {
      document.getElementById("login-screen").hidden = false;
      document.getElementById("admin-app").hidden = true;
    }
  }

  async function logout() {
    await api("/api/admin/session", {
      method: "DELETE"
    });
    window.location.reload();
  }

  async function saveProduct(event) {
    event.preventDefault();
    const button = document.getElementById("product-save-button");
    const payload = getProductPayloadFromForm();

    try {
      button.disabled = true;
      button.textContent = "Saving...";
      await api("/api/admin/products", {
        method: payload.id ? "PATCH" : "POST",
        body: JSON.stringify(payload)
      });
      closeModal("product-modal");
      await refreshData("Product saved successfully.");
    } catch (error) {
      alert(error.message || "Product save failed");
    } finally {
      button.disabled = false;
      button.textContent = "Save product";
    }
  }

  async function saveCategory(event) {
    event.preventDefault();
    const button = document.getElementById("category-save-button");
    const payload = getCategoryPayloadFromForm();

    try {
      button.disabled = true;
      button.textContent = "Saving...";
      await api("/api/admin/categories", {
        method: payload.id ? "PATCH" : "POST",
        body: JSON.stringify(payload)
      });
      closeModal("category-modal");
      await refreshData("Category saved successfully.");
    } catch (error) {
      alert(error.message || "Category save failed");
    } finally {
      button.disabled = false;
      button.textContent = "Save category";
    }
  }

  async function toggleProduct(productId) {
    const product = state.products.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    await api("/api/admin/products", {
      method: "PATCH",
      body: JSON.stringify({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category_id: product.category ? product.category.id : null,
        sku: product.sku,
        price: product.price,
        compare_at_price: product.compare_at_price,
        quantity: product.quantity,
        low_stock_threshold: product.low_stock_threshold,
        image_url: product.image_url,
        tag: product.tag,
        sizes: product.sizes,
        is_active: product.is_active === false,
        description: product.description || "",
        slug: slugify(product.slug || product.name)
      })
    });

    await refreshData("Product visibility updated.");
  }

  async function deleteCategory(categoryId) {
    if (!window.confirm("Delete this category? Products linked to it should be moved first.")) {
      return;
    }

    await api("/api/admin/categories", {
      method: "DELETE",
      body: JSON.stringify({ id: categoryId })
    });
    await refreshData("Category deleted.");
  }

  async function updateOrderStatus(orderId, status) {
    await api("/api/admin/orders", {
      method: "PATCH",
      body: JSON.stringify({
        id: orderId,
        status: status
      })
    });
    await refreshData("Order status updated.");
  }

  function downloadBackup() {
    window.location.href = "/api/admin/export";
  }

  function bindEvents() {
    document
      .getElementById("admin-login-form")
      .addEventListener("submit", handleLogin);
    document.getElementById("logout-button").addEventListener("click", logout);
    document
      .getElementById("refresh-button")
      .addEventListener("click", function () {
        refreshData("Data refreshed.");
      });
    document
      .getElementById("product-form")
      .addEventListener("submit", saveProduct);
    document
      .getElementById("category-form")
      .addEventListener("submit", saveCategory);
    document
      .getElementById("backup-button")
      .addEventListener("click", downloadBackup);

    document.querySelectorAll(".nav-btn").forEach((button) => {
      button.addEventListener("click", function () {
        setSection(button.dataset.section);
      });
    });

    document.addEventListener("click", function (event) {
      const closeButton = event.target.closest("[data-close-modal]");
      if (closeButton) {
        closeModal(closeButton.dataset.closeModal);
      }

      const editProductButton = event.target.closest("[data-edit-product]");
      if (editProductButton) {
        const product = state.products.find(
          (item) => item.id === editProductButton.dataset.editProduct
        );
        openProductModal(product);
      }

      const toggleProductButton = event.target.closest("[data-toggle-product]");
      if (toggleProductButton) {
        toggleProduct(toggleProductButton.dataset.toggleProduct).catch((error) => {
          alert(error.message || "Product update failed");
        });
      }

      const editCategoryButton = event.target.closest("[data-edit-category]");
      if (editCategoryButton) {
        const category = state.categories.find(
          (item) => item.id === editCategoryButton.dataset.editCategory
        );
        openCategoryModal(category);
      }

      const deleteCategoryButton = event.target.closest("[data-delete-category]");
      if (deleteCategoryButton) {
        deleteCategory(deleteCategoryButton.dataset.deleteCategory).catch((error) => {
          alert(error.message || "Category delete failed");
        });
      }

      if (event.target.classList.contains("modal")) {
        event.target.classList.remove("open");
      }
    });

    document.addEventListener("change", function (event) {
      const select = event.target.closest("[data-order-status]");
      if (!select) {
        return;
      }

      updateOrderStatus(select.dataset.orderStatus, select.value).catch((error) => {
        alert(error.message || "Order status update failed");
      });
    });
  }

  bindEvents();
  checkSession();
})();
