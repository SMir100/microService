// src/services/dbService.js

const pool = require("../db");
const { Query } = require("pg");
const preparedQueries = require("../queries/preparedQueries");
const fs = require("fs");
const path = require("path");

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
    // ---------------------------------------------------------
    const slowThreshold = process.env.SLOW_QUERY_MS
      ? parseInt(process.env.SLOW_QUERY_MS, 10)
      : 300;

    if (execTime > slowThreshold) {
      const logPath = path.join(__dirname, "../../logs/slow-queries.log");

      const entry = `[${new Date().toISOString()}] Query="${queryName}" Params="${JSON.stringify(
        params
      )}" Time=${execTime}ms\n`;

      fs.mkdirSync(path.dirname(logPath), { recursive: true });
      fs.appendFileSync(logPath, entry);
    }

    console.log(`✔ Query [${queryName}] executed in ${execTime}ms`);

    return rows;

  } finally {
    client.release();
  }
}

module.exports = { executePreparedQuery };
