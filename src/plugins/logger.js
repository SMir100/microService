// logger.js (Fastify Plugin Style)
const fs = require("fs");
const path = require("path");

async function requestLogger(fastify) {
  fastify.addHook("onRequest", (req, reply, done) => {
    req.log.info({ method: req.method, url: req.url }, "Incoming request");
    done();
  });
}
async function logSlowQuery(queryName, params, execTime) {
  const slowThreshold = parseInt(process.env.SLOW_QUERY_MS || "300", 10);

  if (execTime <= slowThreshold) return;

  const logPath = path.join(__dirname, "../../logs/slow-queries.log");

  const logEntry =
    `[${new Date().toISOString()}] ` +
    `Query="${queryName}" ` +
    `Params=${JSON.stringify(params)} ` +
    `Time=${execTime}ms\n`;

  try {
    await fs.promises.mkdir(path.dirname(logPath), { recursive: true });
    await fs.promises.appendFile(logPath, logEntry);
  } catch (err) {
    console.error("❌ Failed to write slow query log:", err.message);
  }
}

module.exports = requestLogger;


