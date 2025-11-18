const express = require("express");
const logger = require("./utils/logger");
const queryRoutes = require("./routes/queryRoutes");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();


const app = express();

app.use(express.json());
app.use(logger);

// Main API routes
app.use("/query", queryRoutes);

// Health Check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

// Metrics endpoint (basic)
app.get("/metrics", async (req, res) => {
  // You can expand this with Prometheus metrics later
  res.json({
    service: "Query Microservice",
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Service running on port ${PORT} and accessible from other PCs`);
});
