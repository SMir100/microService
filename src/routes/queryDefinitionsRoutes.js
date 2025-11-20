// src/routes/queryDefinitionsRoutes.js
const preparedQueries = require("../queries/preparedQueries");

async function queryDefinitionsRoutes(fastify) {
  fastify.get("/query-definitions", async (req, reply) => {
    let html = `
      <html>
      <head>
        <title>Query Definitions</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f3f3f3; }
          tr:nth-child(even) { background: #fafafa; }
        </style>
      </head>
      <body>
        <h2>Available Queries</h2>
        <table>
          <tr>
            <th>Query Name</th>
            <th>Parameters</th>
          </tr>
    `;

    for (const [name, config] of Object.entries(preparedQueries)) {
      const params = config.params?.length ? config.params.join(", ") : " ";
      html += `
        <tr>
          <td>${name}</td>
          <td>${params}</td>
        </tr>
      `;
    }

    html += `
        </table>
      </body>
      </html>
    `;

    reply.type("text/html").send(html);
  });
}

module.exports = queryDefinitionsRoutes;
