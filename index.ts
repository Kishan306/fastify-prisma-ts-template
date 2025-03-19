import Fastify from "fastify";
const fastify = Fastify({
  logger: false,
});
import routes from "./routes";

fastify.setErrorHandler((error, request, reply) => {
  console.log(error);

  reply.status(500).send({
    message: "Something went wrong",
    error: error.message,
  });
});

fastify.register(routes);

try {
  fastify.listen({ port: 4000 });
  console.log("try http://localhost:4000/ping");
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
