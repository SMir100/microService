const { executePreparedQuery } = require("../services/dbService");

async function handleQuery(req, res) {
  const { queryName, ...params } = req.body;

  if (!queryName) {
    return res.status(400).json({ success: false, error: "queryName is required." });
  }

  try {
    // Pass all other properties in the body as parameters
    const result = await executePreparedQuery(queryName, params);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Query Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
}

module.exports = { handleQuery };
