/**
 * Client Sanity (lecture seule) pour le front.
 * Utilise l’API GROQ publique (pas de token).
 */

const SANITY_PROJECT_ID = 'mkddilwp';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

const BASE_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

/**
 * Exécute une requête GROQ et retourne le résultat.
 * @param {string} query - Requête GROQ
 * @param {Record<string, string|number|boolean>} [params] - Paramètres GROQ ($slug, etc.)
 * @returns {Promise<any>}
 */
export async function fetchQuery(query, params = {}) {
  let url = `${BASE_URL}?query=${encodeURIComponent(query)}`;
  for (const [key, value] of Object.entries(params)) {
    const groqValue = typeof value === 'string' ? `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : String(value);
    url += `&$${key}=${encodeURIComponent(groqValue)}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity: ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.description || 'Sanity query error');
  return json.result;
}

export { SANITY_PROJECT_ID, SANITY_DATASET };
