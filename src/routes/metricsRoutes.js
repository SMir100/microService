// metricsRoutes.js (Fastify)
async function metricsRoutes(fastify) {
  fastify.get("/", async () => ({
    service: "Query Microservice",
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  }));
}
module.exports = metricsRoutes;
