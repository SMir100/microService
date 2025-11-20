// dbService.js (Streaming + Monitoring + Auto Cache Invalidate)
const pool = require("../db");
const { Query } = require("pg");
const preparedQueries = require("../queries/preparedQueries");
//const redis = require("./redis");

async function executePreparedQuery(queryName, params = {}) {
  const queryConfig = preparedQueries[queryName];
  if (!queryConfig) throw new Error("Query not allowed.");

  const { sql, params: requiredParams = [], cache = false, cacheTTL = 60, invalidateOn } = queryConfig;

  // Monitoring
  const start = Date.now();

  const cacheKey = `q:${queryName}:${JSON.stringify(params)}`;

  // Cache Check
  /*
  if (cache) {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }
  */
  // Parameter map
  const paramValues = requiredParams.map(p => {
    if (params[p] === undefined) throw new Error(`Missing required parameter: ${p}`);
    return params[p];
  });

  // Prepared statement name
  const statementName = `stmt_${queryName}`;

  // Streaming Query
  const client = await pool.connect();
  try {
    const query = client.query(
      new Query({
        name: statementName,
        text: sql,
        values: paramValues
      })
    );

    const rows = [];
    query.on("row", row => rows.push(row));

    await new Promise(resolve => query.on("end", resolve));

    /*
    // Cache Store
    if (cache) await redis.set(cacheKey, JSON.stringify(rows), "EX", cacheTTL);

    // Auto-Invalidation
    if (invalidateOn) redis.del(invalidateOn.map(key => `q:${key}`));
    */
    // Monitoring Log
    console.log(`Query ${queryName} executed in ${Date.now() - start}ms`);

    return rows;
  } finally {
    client.release();
  }
}

module.exports = { executePreparedQuery };


