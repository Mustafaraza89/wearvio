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
    const users = await rest("users", {
      params: {
        select: "id,email,full_name,role,created_at",
        order: "created_at.desc"
      }
    });

    return sendJson(res, 200, {
      ok: true,
      users
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};

