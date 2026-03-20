const { isSupabaseConfigured } = require("../_shared/config");
const { methodNotAllowed, sendError, sendJson } = require("../_shared/http");
const { rest } = require("../_shared/supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  if (!isSupabaseConfigured()) {
    return sendJson(res, 200, {
      ok: false,
      configured: false,
      categories: [],
      products: [],
      message: "Supabase env variables are not configured yet."
    });
  }

  try {
    const [categories, products] = await Promise.all([
      rest("categories", {
        params: {
          select: "id,name,slug,description",
          order: "created_at.asc"
        }
      }),
      rest("products", {
        params: {
          select:
            "id,name,slug,brand,sku,description,price,compare_at_price,quantity,low_stock_threshold,image_url,sizes,tag,is_active,category:categories(id,name,slug)",
          is_active: "eq.true",
          order: "created_at.desc"
        }
      })
    ]);

    return sendJson(res, 200, {
      ok: true,
      configured: true,
      categories,
      products
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};

