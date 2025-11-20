// logger.js (Fastify Plugin Style)
async function requestLogger(fastify) {
  fastify.addHook("onRequest", (req, reply, done) => {
    req.log.info({ method: req.method, url: req.url }, "Incoming request");
    done();
  });
}
module.exports = requestLogger;


