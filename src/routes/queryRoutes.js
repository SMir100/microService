const express = require("express");
const { handleQuery } = require("../controllers/queryController");

const router = express.Router();

// queryName in URL, parameters in BODY
router.post("/:queryName", handleQuery);

module.exports = router;
