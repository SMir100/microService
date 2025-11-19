const express = require("express");
const logger = require(".//middlewares/logger");
const queryRoutes = require("./routes/queryRoutes");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();
//const cors = require("cors");
//const corsOptions = require("./config/cors");

const app = express();

//app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);


// Main API routes
app.use("/query", queryRoutes);

// Health Check endpoint
app.get("/health/", async (req, res) => {
  try {
    res.status(200).json({ api: "UP" });
  } catch {
    res.status(500).json({ api: "DOWN" });
  }
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
