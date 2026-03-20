const crypto = require("crypto");
const { getServerConfig, isSupabaseConfigured } = require("./config");
const { parseCookies, sendError } = require("./http");
const { rest } = require("./supabase");

const COOKIE_NAME = "wearvio_admin_session";

function base64UrlEncode(value) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload) {
  const { adminSessionSecret } = getServerConfig();
  return crypto
    .createHmac("sha256", adminSessionSecret)
    .update(payload)
    .digest("hex");
}

function createSessionToken(payload) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = signPayload(encodedPayload);

  if (signature !== expectedSignature) {
    return null;
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));

  if (!payload.exp || Date.now() > payload.exp) {
    return null;
  }

  return payload;
}

function shouldUseSecureCookie(req) {
  const host = req && req.headers ? req.headers.host || "" : "";
  return process.env.NODE_ENV !== "development" && !/localhost|127\.0\.0\.1/.test(host);
}

function setAdminCookie(res, token, req) {
  const secure = shouldUseSecureCookie(req) ? " Secure;" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(
      token
    )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800;${secure}`
  );
}

function clearAdminCookie(res, req) {
  const secure = shouldUseSecureCookie(req) ? " Secure;" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;${secure}`
  );
}

async function ensureAdminUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const config = getServerConfig();
  const payload = [
    {
      email: config.adminEmail,
      full_name: config.adminName,
      role: "admin"
    }
  ];

  const records = await rest("users", {
    method: "POST",
    params: {
      on_conflict: "email",
      select: "id,email,full_name,role"
    },
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: payload
  });

  return records && records[0] ? records[0] : null;
}

async function requireAdmin(req, res) {
  const cookies = parseCookies(req);
  const payload = verifySessionToken(cookies[COOKIE_NAME]);

  if (!payload) {
    sendError(res, 401, "Admin session required");
    return null;
  }

  return payload;
}

module.exports = {
  clearAdminCookie,
  createSessionToken,
  ensureAdminUser,
  requireAdmin,
  setAdminCookie
};
