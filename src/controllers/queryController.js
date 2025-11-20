// queryController.js (Fastify Stream Response)
const { executePreparedQuery } = require("../services/dbService");

async function handleQuery(req, reply) {
  try {
    const rows = await executePreparedQuery(req.params.queryName, req.body);
    reply.send({ success: true, data: rows });
  } catch (err) {
    reply.status(400).send({ success: false, error: err.message });
  }
}

module.exports = { handleQuery };
