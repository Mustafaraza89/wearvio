const { isSupabaseConfigured } = require("../_shared/config");
const { requireAdmin } = require("../_shared/adminAuth");
const { methodNotAllowed, sendError, sendJson } = require("../_shared/http");
const { rest } = require("../_shared/supabase");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  if (!isSupabaseConfigured()) {
    return sendError(res, 503, "Supabase is not configured");
  }

  const session = await requireAdmin(req, res);
  if (!session) {
    return;
  }

  try {
    const logs = await rest("stock_logs", {
      params: {
        select:
          "id,quantity_before,quantity_after,delta,reason,created_at,product:products(id,name,sku),changed_by_user:users(id,full_name,email)",
        order: "created_at.desc"
      }
    });

    return sendJson(res, 200, {
      ok: true,
      logs
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};

