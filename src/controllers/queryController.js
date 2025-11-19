const { executePreparedQuery } = require("../services/dbService");
//const { Parser } = require("json2csv");

async function handleQuery(req, res) {
  const queryName = req.params.queryName;

  // ✔ parameters ONLY from Body
  const params = req.body;

  // ✔ output format ONLY from Accept header
  const accept = req.headers["accept"] || "application/json";

  if (!queryName) {
    return res.status(400).json({
      success: false,
      error: "Query name is required in URL."
    });
  }

  try {
    const rows = await executePreparedQuery(queryName, params);

    /* -------- CSV Output (Accept: text/csv) --------
    if (accept.includes("text/csv")) {
      if (!rows || rows.length === 0) return res.send("No data");

      const parser = new Parser();
      const csv = parser.parse(rows);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${queryName}.csv"`
      );

      return res.send(csv);
    }
    */
    // -------- Default JSON Output --------
    return res.json({ success: true, data: rows });

  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
}

module.exports = { handleQuery };
