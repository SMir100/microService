// queryRoutes.js (Fastify + Validation)
async function queryRoutes(fastify) {
  fastify.post(
    "/:queryName",
    {
      schema: {
        body: { type: "object", additionalProperties: true },
        params: {
          type: "object",
          properties: {
            queryName: { type: "string" }
          },
          required: ["queryName"]
        }
      }
    },
    require("../controllers/queryController").handleQuery
  );
}
module.exports = queryRoutes;
