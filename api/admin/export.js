const { isSupabaseConfigured } = require("../../lib/config");
const { requireAdmin } = require("../../lib/adminAuth");
const { methodNotAllowed, sendError } = require("../../lib/http");
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
    const [categories, products, orders, stockLogs, users, contacts, newsletter] =
      await Promise.all([
        rest("categories", { params: { select: "*" } }),
        rest("products", { params: { select: "*" } }),
        rest("orders", { params: { select: "*" } }),
        rest("stock_logs", { params: { select: "*" } }),
        rest("users", { params: { select: "*" } }),
        rest("contact_messages", { params: { select: "*" } }),
        rest("newsletter_subscribers", { params: { select: "*" } })
      ]);

    const payload = {
      exported_at: new Date().toISOString(),
      categories,
      products,
      orders,
      stock_logs: stockLogs,
      users,
      contact_messages: contacts,
      newsletter_subscribers: newsletter
    };

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="wearvio-backup-${Date.now()}.json"`
    );
    res.end(JSON.stringify(payload, null, 2));
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};
