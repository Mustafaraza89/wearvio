const { clearAdminCookie, requireAdmin } = require("../../lib/adminAuth");
const { methodNotAllowed, sendJson } = require("../../lib/http");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const session = await requireAdmin(req, res);

    if (!session) {
      return;
    }

    return sendJson(res, 200, {
      ok: true,
      user: {
        id: session.adminUserId,
        email: session.email,
        name: session.name
      }
    });
  }

  if (req.method === "DELETE") {
    clearAdminCookie(res, req);
    return sendJson(res, 200, {
      ok: true
    });
  }

  return methodNotAllowed(res, ["GET", "DELETE"]);
};
