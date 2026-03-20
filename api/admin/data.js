const { isSupabaseConfigured } = require("../../lib/config");
const { requireAdmin } = require("../../lib/adminAuth");
const { methodNotAllowed, sendError, sendJson } = require("../../lib/http");
const { rest } = require("../../lib/supabase");

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
    const [users, logs] = await Promise.all([
      rest("users", {
        params: {
          select: "id,email,full_name,role,created_at",
          order: "created_at.desc"
        }
      }),
      rest("stock_logs", {
        params: {
          select:
            "id,quantity_before,quantity_after,delta,reason,created_at,product:products(id,name,sku),changed_by_user:users(id,full_name,email)",
          order: "created_at.desc"
        }
      })
    ]);

    return sendJson(res, 200, {
      ok: true,
      users,
      logs
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};

