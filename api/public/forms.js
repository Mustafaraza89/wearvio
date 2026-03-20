const { isSupabaseConfigured } = require("../../lib/config");
const {
  methodNotAllowed,
  readJsonBody,
  sendError,
  sendJson
} = require("../../lib/http");
const { rest } = require("../../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  if (!isSupabaseConfigured()) {
    return sendError(res, 503, "Supabase is not configured");
  }

  try {
    const body = await readJsonBody(req);
    const type = String(body.type || "").trim();

    if (type === "contact") {
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim();
      const subject = String(body.subject || "").trim();
      const message = String(body.message || "").trim();
      const topics = Array.isArray(body.topics) ? body.topics : [];

      if (!name || !email || !subject || !message) {
        return sendError(res, 400, "Please fill all contact form fields");
      }

      await rest("contact_messages", {
        method: "POST",
        headers: {
          Prefer: "return=representation"
        },
        body: [{ name, email, subject, message, topics }]
      });

      return sendJson(res, 200, {
        ok: true,
        message: "Message sent successfully"
      });
    }

    if (type === "newsletter") {
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
    }

    return sendError(res, 400, "Unknown form type");
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};

