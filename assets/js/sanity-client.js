/**
 * Client Sanity (lecture seule) pour le front.
 * Utilise l’API GROQ publique (pas de token).
 */

const SANITY_PROJECT_ID = 'mkddilwp';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

const BASE_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

const CACHE_PREFIX = 'sanity:grok:v1:';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes (UX/perf) – safe for a portfolio site

function stableStringify(value) {
  if (value == null) return '';
  if (typeof value !== 'object') return String(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${k}:${stableStringify(value[k])}`).join(',')}}`;
}

function buildCacheKey(query, params) {
  return `${CACHE_PREFIX}${SANITY_PROJECT_ID}:${SANITY_DATASET}:${SANITY_API_VERSION}:${query}::${stableStringify(params)}`;
}

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (!payload || typeof payload !== 'object') return null;
    if (typeof payload.expiresAt !== 'number') return null;
    if (Date.now() > payload.expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }
    return payload.value ?? null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    const payload = { expiresAt: Date.now() + CACHE_TTL_MS, value };
    sessionStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore quota / privacy mode
  }
}

/**
 * Exécute une requête GROQ et retourne le résultat.
 * @param {string} query - Requête GROQ
 * @param {Record<string, string|number|boolean>} [params] - Paramètres GROQ ($slug, etc.)
 * @returns {Promise<any>}
 */
export async function fetchQuery(query, params = {}) {
  const cacheKey = buildCacheKey(query, params);
  const cached = readCache(cacheKey);
  if (cached !== null) return cached;

  let url = `${BASE_URL}?query=${encodeURIComponent(query)}`;
  for (const [key, value] of Object.entries(params)) {
    const groqValue = typeof value === 'string' ? `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : String(value);
    url += `&$${key}=${encodeURIComponent(groqValue)}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity: ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.description || 'Sanity query error');
  writeCache(cacheKey, json.result);
  return json.result;
}

export { SANITY_PROJECT_ID, SANITY_DATASET };
