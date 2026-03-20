const { isSupabaseConfigured } = require("../_shared/config");
const { requireAdmin } = require("../_shared/adminAuth");
const {
  methodNotAllowed,
  readJsonBody,
  sendError,
  sendJson
} = require("../_shared/http");
const { rest } = require("../_shared/supabase");

function normalizeProductInput(input) {
  const payload = {
    category_id: input.category_id || null,
    name: String(input.name || "").trim(),
    slug: String(input.slug || "")
      .trim()
      .toLowerCase(),
    brand: String(input.brand || "WEARVIO").trim(),
    sku: String(input.sku || "").trim(),
    description: String(input.description || "").trim(),
    price: Number(input.price || 0),
    compare_at_price: input.compare_at_price ? Number(input.compare_at_price) : null,
    quantity: Number(input.quantity || 0),
    low_stock_threshold: Number(input.low_stock_threshold || 0),
    image_url: String(input.image_url || "").trim(),
    sizes: Array.isArray(input.sizes)
      ? input.sizes
      : String(input.sizes || "")
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),
    tag: input.tag ? String(input.tag).trim().toLowerCase() : null,
    is_active: input.is_active !== false
  };

  if (!payload.slug && payload.name) {
    payload.slug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  return payload;
}

module.exports = async (req, res) => {
  if (!["GET", "POST", "PATCH"].includes(req.method)) {
    return methodNotAllowed(res, ["GET", "POST", "PATCH"]);
  }

  if (!isSupabaseConfigured()) {
    return sendError(res, 503, "Supabase is not configured");
  }

  const session = await requireAdmin(req, res);
  if (!session) {
    return;
  }

  try {
    if (req.method === "GET") {
      const products = await rest("products", {
        params: {
          select:
            "id,name,slug,brand,sku,description,price,compare_at_price,quantity,low_stock_threshold,image_url,sizes,tag,is_active,created_at,updated_at,category:categories(id,name,slug)",
          order: "created_at.desc"
        }
      });

      return sendJson(res, 200, {
        ok: true,
        products
      });
    }

    const body = await readJsonBody(req);

    if (req.method === "POST") {
      const product = normalizeProductInput(body);

      if (!product.name || !product.sku || !product.category_id) {
        return sendError(res, 400, "Name, SKU, and category are required");
      }

      const created = await rest("products", {
        method: "POST",
        params: {
          select:
            "id,name,slug,brand,sku,description,price,compare_at_price,quantity,low_stock_threshold,image_url,sizes,tag,is_active,category:categories(id,name,slug)"
        },
        headers: {
          Prefer: "return=representation"
        },
        body: [product]
      });

      return sendJson(res, 200, {
        ok: true,
        product: created[0]
      });
    }

    const id = String(body.id || "").trim();
    if (!id) {
      return sendError(res, 400, "Product id is required");
    }

    const updates = normalizeProductInput(body);
    const updated = await rest("products", {
      method: "PATCH",
      params: {
        id: `eq.${id}`,
        select:
          "id,name,slug,brand,sku,description,price,compare_at_price,quantity,low_stock_threshold,image_url,sizes,tag,is_active,category:categories(id,name,slug)"
      },
      headers: {
        Prefer: "return=representation"
      },
      body: updates
    });

    return sendJson(res, 200, {
      ok: true,
      product: updated[0]
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};

