const { getServerConfig } = require("./config");

function buildUrl(prefix, path, params) {
  const { supabaseUrl } = getServerConfig();
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(`${supabaseUrl}/${prefix}/${cleanPath}`);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    url.searchParams.set(key, value);
  });

  return url.toString();
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

async function supabaseFetch(prefix, path, options = {}) {
  const config = getServerConfig();
  const useServiceRole = options.serviceRole !== false;
  const apiKey = useServiceRole
    ? config.supabaseServiceRoleKey
    : config.supabaseAnonKey;
  const url = buildUrl(prefix, path, options.params);
  const headers = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    ...options.headers
  };

  if (options.body === undefined || options.body === null) {
    delete headers["Content-Type"];
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body:
      options.body === undefined || options.body === null
        ? undefined
        : JSON.stringify(options.body)
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      (data && (data.message || data.error_description || data.error)) ||
      response.statusText ||
      "Supabase request failed";

    const error = new Error(message);
    error.statusCode = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

function rest(path, options = {}) {
  return supabaseFetch("rest/v1", path, options);
}

function auth(path, options = {}) {
  return supabaseFetch("auth/v1", path, {
    ...options,
    serviceRole: options.serviceRole || false
  });
}

function rpc(name, args, options = {}) {
  return rest(`rpc/${name}`, {
    method: "POST",
    body: args,
    ...options
  });
}

module.exports = {
  auth,
  rest,
  rpc
};

