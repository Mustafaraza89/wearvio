const { isSupabaseConfigured } = require("../../lib/config");
const { requireAdmin } = require("../../lib/adminAuth");
const {
  methodNotAllowed,
  readJsonBody,
  sendError,
  sendJson
} = require("../../lib/http");
const { rest } = require("../../lib/supabase");

module.exports = async (req, res) => {
  if (!["GET", "PATCH"].includes(req.method)) {
    return methodNotAllowed(res, ["GET", "PATCH"]);
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
      const orders = await rest("orders", {
        params: {
          select:
            "id,status,total_amount,created_at,updated_at,user:users(id,full_name,email),items:order_items(id,quantity,unit_price,product:products(id,name,sku,image_url))",
          order: "created_at.desc"
        }
      });

      return sendJson(res, 200, {
        ok: true,
        orders
      });
    }

    const body = await readJsonBody(req);
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim();

    if (!id || !status) {
      return sendError(res, 400, "Order id and status are required");
    }

    const updated = await rest("orders", {
      method: "PATCH",
      params: {
        id: `eq.${id}`,
        select: "id,status,total_amount,created_at,updated_at"
      },
      headers: {
        Prefer: "return=representation"
      },
      body: { status }
    });

    return sendJson(res, 200, {
      ok: true,
      order: updated[0]
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};
