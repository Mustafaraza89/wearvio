const { getPublicRuntimeConfig } = require("../_shared/config");

module.exports = async (req, res) => {
  const config = getPublicRuntimeConfig();
  const nextConfig = {};

  if (config.supabaseUrl) {
    nextConfig.supabaseUrl = config.supabaseUrl;
  }

  if (config.supabaseAnonKey) {
    nextConfig.supabaseAnonKey = config.supabaseAnonKey;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.end(
    `window.WEARVIO_PUBLIC_CONFIG = Object.assign({}, window.WEARVIO_PUBLIC_CONFIG || {}, ${JSON.stringify(
      nextConfig,
      null,
      2
    )});`
  );
};
