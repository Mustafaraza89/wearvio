const { getServerConfig, isSupabaseConfigured } = require("../../lib/config");
const {
  methodNotAllowed,
  readJsonBody,
  sendError,
  sendJson
} = require("../../lib/http");
const { auth, rpc } = require("../../lib/supabase");

async function resolveUser(accessToken) {
  const { supabaseAnonKey } = getServerConfig();

  return auth("user", {
    method: "GET",
    serviceRole: false,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`
    }
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  if (!isSupabaseConfigured()) {
    return sendError(res, 503, "Supabase is not configured");
  }

  try {
    const authorizationHeader = req.headers.authorization || "";
    const accessToken = authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.slice("Bearer ".length)
      : "";

    if (!accessToken) {
      return sendError(res, 401, "Please sign in before placing an order");
    }

    const body = await readJsonBody(req);
    const items = Array.isArray(body.items) ? body.items : [];

    if (!items.length) {
      return sendError(res, 400, "Your cart is empty");
    }

    const user = await resolveUser(accessToken);
    const order = await rpc("create_order_with_items", {
      p_user_id: user.id,
      p_items: items.map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity) || 1
      }))
    });

    return sendJson(res, 200, {
      ok: true,
      order,
      message: "Order placed successfully"
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};
