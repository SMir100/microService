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
    if (params[p] === undefined) throw new Error(`Missing required parameter: ${p}`);
    return params[p];
  });

  const statementName = `stmt_${queryName}`;

  // ---------------------------------------------------------
  // Redis Cache Check (Commented)
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
    // Streaming Prepared Statement
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // Redis Store Result (Commented)
    // ---------------------------------------------------------
    //
    // if (cache) {
    //   const cacheKey = buildCacheKey(queryName, params);
    //   await redis.setEx(cacheKey, expireSeconds, JSON.stringify(rows));
    //   console.log(`🟢 Cached → ${cacheKey}`);
    // }
    // ---------------------------------------------------------

    const execTime = Date.now() - start;

    // ------------------------------
    // Slow Query Logging
    // ------------------------------
    const slowThreshold = process.env.SLOW_QUERY_MS
      ? parseInt(process.env.SLOW_QUERY_MS, 10)
      : 300;

    if (execTime > slowThreshold) {
      const fs = require("fs");
      const path = require("path");

      const logPath = path.join(__dirname, "../../logs/slow-queries.log");

      const entry = `[${new Date().toISOString()}] Query="${queryName}" Params="${JSON.stringify(
        params
      )}" Time=${execTime}ms\n`;

      // ایجاد پوشه در صورت نبود
      fs.mkdirSync(path.dirname(logPath), { recursive: true });

      // اضافه کردن به فایل
      fs.appendFileSync(logPath, entry);
    }

    console.log(`✔ Query [${queryName}] executed in ${execTime}ms`);
    return rows;


  } finally {
    client.release();
  }
}

module.exports = { executePreparedQuery };
