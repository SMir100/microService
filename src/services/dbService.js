const pool = require("../db");
const preparedQueries = require("../queries/preparedQueries");
// const redis = require("./redis"); // Uncomment when Redis is ready

async function executePreparedQuery(queryName, params = {}) {
  const queryConfig = preparedQueries[queryName];

  if (!queryConfig) {
    throw new Error("Query not allowed or does not exist.");
  }

  const { sql, params: requiredParams = [], cacheKey /*, cacheTTL = 60*/ } = queryConfig;

  // if (cacheKey && requiredParams.length === 0) {
    // const cached = await redis.get(cacheKey);
    // if (cached) {
    //   return JSON.parse(cached);
    // }
  // }

  // Map required parameters from body
  const paramValues = requiredParams.map(p => {
    if (params[p] === undefined) {
      throw new Error(`Missing required parameter: ${p}`);
    }
    return params[p];
  });

  // ✅ Prepared statement added — name ensures PG caches the execution plan
  const statementName = `stmt_${queryName}`;

  const result = await pool.query({
    name: statementName,
    text: sql,
    values: paramValues
  });

  const rows = result.rows;

  // Save to cache if enabled
  // if (cacheKey && requiredParams.length === 0) {
  //  redis.set(cacheKey, JSON.stringify(rows), "EX", cacheTTL ?? 60);
  // }

  return rows;
}

module.exports = { executePreparedQuery };
