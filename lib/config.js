const DEFAULT_ADMIN_EMAIL = "admin@wearvio.in";
const DEFAULT_ADMIN_PASSWORD = "Wearvio@2026!";
const DEFAULT_ADMIN_NAME = "Wearvio Owner";
const DEFAULT_ADMIN_SECRET = "wearvio-dev-secret-change-me";

function getEnv(name, fallback = "") {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getPublicRuntimeConfig() {
  return {
    supabaseUrl: getEnv("SUPABASE_URL"),
    supabaseAnonKey: getEnv("SUPABASE_ANON_KEY")
  };
}

function getServerConfig() {
  return {
    supabaseUrl: getEnv("SUPABASE_URL"),
    supabaseAnonKey: getEnv("SUPABASE_ANON_KEY"),
    supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    adminEmail: getEnv("WEARVIO_ADMIN_EMAIL", DEFAULT_ADMIN_EMAIL),
    adminPassword: getEnv("WEARVIO_ADMIN_PASSWORD", DEFAULT_ADMIN_PASSWORD),
    adminName: getEnv("WEARVIO_ADMIN_NAME", DEFAULT_ADMIN_NAME),
    adminSessionSecret: getEnv("WEARVIO_ADMIN_SESSION_SECRET", DEFAULT_ADMIN_SECRET)
  };
}

function isSupabaseConfigured() {
  const config = getServerConfig();
  return Boolean(
    config.supabaseUrl &&
      config.supabaseAnonKey &&
      config.supabaseServiceRoleKey
  );
}

module.exports = {
  getEnv,
  getPublicRuntimeConfig,
  getServerConfig,
  isSupabaseConfigured
};

