// src/routes/queryRoutes.js
async function queryRoutes(fastify) {
  fastify.post(
    "/:queryName",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            queryName: { type: "string" }
          },
          required: ["queryName"]
        },
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1 },
            pageSize: { type: "integer", minimum: 1 }
          }
        },
        body: { type: "object", additionalProperties: true }
      }
    },
    require("../controllers/queryController").handleQuery
  );
}

module.exports = queryRoutes;
