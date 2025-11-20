// src/services/dbService.js

const pool = require("../db");
const { Query } = require("pg");
const preparedQueries = require("../queries/preparedQueries");


// ---------------------------------------------------------
// Redis (Commented for future use)
// ---------------------------------------------------------
//
// const redis = require("../redis");
//
// function buildCacheKey(queryName, params) {
//   try {
//     return `q:${queryName}:${JSON.stringify(params)}`;
//   } catch {
//     return `q:${queryName}`;
//   }
// }
// ---------------------------------------------------------

async function executePreparedQuery(queryName, params = {}) {
  const queryConfig = preparedQueries[queryName];
  if (!queryConfig) throw new Error("Query not allowed.");

  const { sql, params: requiredParams = [] /*, cache = false, expireSeconds = 30 */ } = queryConfig;
  const start = Date.now();

  // ---------------------------------------------------------
  // Param binding
  // ---------------------------------------------------------
  const paramValues = requiredParams.map(p => {
    if (params[p] === undefined) {
      throw new Error(`Missing required parameter: ${p}`);
    }
    return params[p];
  });

  // ---------------------------------------------------------
  // Redis Cache Check (Commented, preserved)
  // ---------------------------------------------------------
  //
  // if (cache) {
  //   const cacheKey = buildCacheKey(queryName, params);
  //   const cached = await redis.get(cacheKey);
  //   if (cached) {
  //     console.log(`⚡ Cache HIT → ${cacheKey}`);
  //     return JSON.parse(cached);
  //   }
  //   console.log(`❌ Cache MISS → ${cacheKey}`);
  // }
  // ---------------------------------------------------------

  const client = await pool.connect();

  try {
    // ---------------------------------------------------------
    // ❌ Streaming Removed
    // ✔ Simple direct execution
    // ---------------------------------------------------------
    const { rows } = await client.query({
      name: statementName,
      text: sql,
      values: paramValues
    });

    const execTime = Date.now() - start;

    // ---------------------------------------------------------
    // Redis Store Result (Commented, preserved)
    // ---------------------------------------------------------
    //
    // if (cache) {
    //   const cacheKey = buildCacheKey(queryName, params);
    //   await redis.setEx(cacheKey, expireSeconds, JSON.stringify(rows));
    //   console.log(`🟢 Cached → ${cacheKey}`);
    // }
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // Slow Query Logging
    //await logSlowQuery(queryName, params, execTime);

    console.log(`✔ Query [${queryName}] executed in ${execTime}ms`);

    return rows;

  } finally {
    client.release();
  }
}

module.exports = { executePreparedQuery };
