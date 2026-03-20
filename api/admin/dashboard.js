const { isSupabaseConfigured } = require("../../lib/config");
const { requireAdmin } = require("../../lib/adminAuth");
const { methodNotAllowed, sendError, sendJson } = require("../../lib/http");
const { rest } = require("../../lib/supabase");

function isSameUtcDate(a, b) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

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
    const [products, orders, users] = await Promise.all([
      rest("products", {
        params: {
          select:
            "id,name,sku,price,quantity,low_stock_threshold,tag,is_active,category:categories(name,slug)",
          order: "created_at.desc"
        }
      }),
      rest("orders", {
        params: {
          select: "id,status,total_amount,created_at,user:users(full_name,email)",
          order: "created_at.desc"
        }
      }),
      rest("users", {
        params: {
          select: "id,email,full_name,role,created_at",
          order: "created_at.desc"
        }
      })
    ]);

    const now = new Date();
    const ordersToday = orders.filter((order) =>
      isSameUtcDate(new Date(order.created_at), now)
    );
    const revenueToday = ordersToday
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const lowStock = products.filter(
      (product) =>
        product.is_active && Number(product.quantity) <= Number(product.low_stock_threshold)
    );

    return sendJson(res, 200, {
      ok: true,
      summary: {
        totalProducts: products.filter((product) => product.is_active).length,
        lowStockAlerts: lowStock.length,
        ordersToday: ordersToday.length,
        revenueToday
      },
      lowStock,
      recentOrders: orders.slice(0, 6),
      users: users.slice(0, 8),
      products: products.slice(0, 8)
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};
