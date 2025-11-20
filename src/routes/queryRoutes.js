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
        body: { type: "object", additionalProperties: true }
      }
    },
    require("../controllers/queryController").handleQuery
  );
}

module.exports = queryRoutes;
