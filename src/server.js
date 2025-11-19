const express = require("express");
const logger = require(".//middlewares/logger");
const queryRoutes = require("./routes/queryRoutes");
const errorHandler = require("./middlewares/errorHandler");
const healthRoutes = require("./routes/healthRoutes");
const metricsRoutes = require("./routes/metricsRoutes");
require("dotenv").config();
//const cors = require("cors");
//const corsOptions = require("./config/cors");

const app = express();

//app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);


// Main API routes
app.use("/query", queryRoutes);

app.use("/health", healthRoutes);
app.use("/metrics", metricsRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Service running on port ${PORT} and accessible from other PCs`);
});
