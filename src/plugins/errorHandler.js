// errorHandler.js (Fastify Plugin Style)
async function errorHandler(fastify) {
  fastify.setErrorHandler((error, req, reply) => {
    req.log.error(error);
    reply.status(500).send({ success: false, message: error.message || "Internal Server Error" });
  });
}
module.exports = errorHandler;

