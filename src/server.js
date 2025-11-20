// src/server.js
require("dotenv").config();
const fastify = require("fastify")({
  logger: true,
});

// ------------------------------
// Core Plugins
// ------------------------------
fastify.register(require("./plugins/logger"));
fastify.register(require("./plugins/errorHandler"));
fastify.register(require("./plugins/cors"));

// ------------------------------
// Circuit Breaker
// ------------------------------
fastify.register(require("@fastify/circuit-breaker"), {
  timeout: 5000,
  resetTimeout: 7000,
  onOpen: () => fastify.log.warn("🔴 Circuit OPENED"),
  onClose: () => fastify.log.info("🟢 Circuit CLOSED"),
});

// ------------------------------
// Routes
// ------------------------------
fastify.register(require("./routes/queryRoutes"), { prefix: "/query" });
fastify.register(require("./routes/queryDefinitionsRoutes"));
fastify.register(require("./routes/healthRoutes"), { prefix: "/health" });
fastify.register(require("./routes/metricsRoutes"), { prefix: "/metrics" });

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 3000;

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`🚀 Query Service running at: ${address}`);
});
