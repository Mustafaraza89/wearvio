const { getServerConfig } = require("../../lib/config");
const {
  methodNotAllowed,
  readJsonBody,
  sendError,
  sendJson
} = require("../../lib/http");
const {
  createSessionToken,
  ensureAdminUser,
  setAdminCookie
} = require("../../lib/adminAuth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const body = await readJsonBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const config = getServerConfig();

    if (!config.adminEmail || !config.adminPassword || !config.adminSessionSecret) {
      return sendError(
        res,
        503,
        "Admin environment variables are not configured on the server"
      );
    }

    if (
      email !== config.adminEmail.toLowerCase() ||
      password !== config.adminPassword
    ) {
      return sendError(res, 401, "Invalid admin credentials");
    }

    const adminUser = await ensureAdminUser();
    const sessionToken = createSessionToken({
      adminUserId: adminUser ? adminUser.id : null,
      email: config.adminEmail,
      name: config.adminName,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    setAdminCookie(res, sessionToken, req);

    return sendJson(res, 200, {
      ok: true,
      user: {
        email: config.adminEmail,
        name: config.adminName,
        id: adminUser ? adminUser.id : null
      }
    });
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message, error.details);
  }
};
