const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.status(200).json({ api: "UP" });
  } catch {
    res.status(500).json({ api: "DOWN" });
  }
});

module.exports = router;
