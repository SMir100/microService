const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    service: "Query Microservice",
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
