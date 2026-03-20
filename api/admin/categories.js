const { isSupabaseConfigured } = require("../_shared/config");
const { requireAdmin } = require("../_shared/adminAuth");
const {
  methodNotAllowed,
  readJsonBody,
  sendError,
  sendJson
} = require("../_shared/http");
const { rest } = require("../_shared/supabase");

function normalizeCategoryInput(input) {
  const name = String(input.name || "").trim();
  return {
    name,
    slug: String(input.slug || "")
      .trim()
      .toLowerCase() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    description: String(input.description || "").trim()
  };
}

module.exports = async (req, res) => {
  if (!["GET", "POST", "PATCH", "DELETE"].includes(req.method)) {
    return methodNotAllowed(res, ["GET", "POST", "PATCH", "DELETE"]);
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
      const categories = await rest("categories", {
        params: {
          select: "id,name,slug,description,created_at",
          order: "created_at.asc"
        }
      });

      return sendJson(res, 200, {
        ok: true,
        categories
      });
    }

    const body = await readJsonBody(req);

    if (req.method === "POST") {
      const category = normalizeCategoryInput(body);

      if (!category.name) {
        return sendError(res, 400, "Category name is required");
      }

      const created = await rest("categories", {
        method: "POST",
        params: {
          select: "id,name,slug,description,created_at"
        },
        headers: {
          Prefer: "return=representation"
        },
        body: [category]
      });

      return sendJson(res, 200, {
        ok: true,
        category: created[0]
      });
    }

    const id = String(body.id || "").trim();
    if (!id) {
      return sendError(res, 400, "Category id is required");
    }

    if (req.method === "PATCH") {
      const category = normalizeCategoryInput(body);
      const updated = await rest("categories", {
        method: "PATCH",
        params: {
          id: `eq.${id}`,
          select: "id,name,slug,description,created_at"
        },
        headers: {
          Prefer: "return=representation"
        },
        body: category
      });

      return sendJson(res, 200, {
        ok: true,
        category: updated[0]
      });
    }

    await rest("categories", {
      method: "DELETE",
      params: {
        id: `eq.${id}`
      }
    });

    return sendJson(res, 200, {
      ok: true
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};

