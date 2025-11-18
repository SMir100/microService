const pool = require("../db");
const preparedQueries = require("../queries/preparedQueries");
// const redis = require("../redis"); // Uncomment when Redis is ready

async function executePreparedQuery(queryName, params = {}) {
  const queryConfig = preparedQueries[queryName];

  if (!queryConfig) {
    throw new Error("Query not allowed or does not exist.");
  }

  const { sql, params: requiredParams = [], cacheKey /*, cacheTTL = 60*/ } = queryConfig;

  // Only use caching for queries without dynamic parameters
  // const useCache = cacheKey && requiredParams.length === 0;
  // if (useCache) {
  //   const cached = await redis.get(cacheKey);
  //   if (cached) return JSON.parse(cached);
  // }

  // Map required parameters from body
  const paramValues = requiredParams.map(p => {
    if (params[p] === undefined) {
      throw new Error(`Missing required parameter: ${p}`);
    }
    return params[p];
  });

  const result = await pool.query(sql, paramValues);
  const rows = result.rows;

  // Save to cache if enabled
  // if (useCache) {
  //   await redis.set(cacheKey, JSON.stringify(rows), "EX", cacheTTL);
  // }

  return rows;
}

module.exports = { executePreparedQuery };
