// cors.js (Fastify CORS Plugin)
const fp = require("fastify-plugin");

module.exports = fp(async function (fastify) {
  fastify.register(require("@fastify/cors"), {
    origin: (origin, cb) => {
      const allowed = [
        "http://localhost:3000",
        "http://localhost:4200",
        "http://your-frontend-domain.com",
        "https://your-frontend-domain.com"
      ];

      if (!origin || allowed.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("CORS blocked: Not allowed by server"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: false
  });
});
