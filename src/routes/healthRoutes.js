// healthRoutes.js (Fastify)
async function healthRoutes(fastify) {
  fastify.get("/", async () => ({ api: "UP" }));
}
module.exports = healthRoutes;
