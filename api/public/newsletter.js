const { isSupabaseConfigured } = require("../_shared/config");
const {
  methodNotAllowed,
  readJsonBody,
  sendError,
  sendJson
} = require("../_shared/http");
const { rest } = require("../_shared/supabase");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  if (!isSupabaseConfigured()) {
    return sendError(res, 503, "Supabase is not configured");
  }

  try {
    const body = await readJsonBody(req);
    const email = String(body.email || "").trim();

    if (!email) {
      return sendError(res, 400, "Email is required");
    }

    await rest("newsletter_subscribers", {
      method: "POST",
      params: {
        on_conflict: "email",
        select: "email"
      },
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: [{ email }]
    });

    return sendJson(res, 200, {
      ok: true,
      message: "Subscribed successfully"
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};

