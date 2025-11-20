// src/server.js
require("dotenv").config();
const fastify = require("fastify")({
  logger: true, // Fastify's built-in logger
});

// ------------------------------
// Register Global Plugins
// ------------------------------
fastify.register(require("./plugins/logger"));        // Request Logger
fastify.register(require("./plugins/errorHandler"));  // Unified Error Handler
fastify.register(require("./plugins/cors"));          // Secure CORS Control

// ------------------------------
// Register Routes
// ------------------------------
fastify.register(require("./routes/queryRoutes"), { prefix: "/query" });
fastify.register(require("./routes/healthRoutes"), { prefix: "/health" });
fastify.register(require("./routes/metricsRoutes"), { prefix: "/metrics" });

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 3000;

fastify.listen(
  { port: PORT, host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    fastify.log.info(`🚀 Query Service running at: ${address}`);
  }
);
