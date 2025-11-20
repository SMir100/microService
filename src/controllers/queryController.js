// src/controllers/queryController.js
const { executePreparedQuery } = require("../services/dbService");

async function handleQuery(req, reply) {
  try {
    let rows = await executePreparedQuery(req.params.queryName, req.body);

    // Pagination
    const page = parseInt(req.query.page || 1, 10);
    const pageSize = parseInt(req.query.pageSize || 50, 10);

    const start = (page - 1) * pageSize;
    const paged = rows.slice(start, start + pageSize);

    reply.send({
      success: true,
      total: rows.length,
      page,
      pageSize,
      data: paged
    });

  } catch (err) {
    reply.status(400).send({ success: false, error: err.message });
  }
}

module.exports = { handleQuery };
