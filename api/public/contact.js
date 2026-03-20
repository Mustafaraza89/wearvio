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
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};

