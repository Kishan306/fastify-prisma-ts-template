import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { adminCheck } from "../middleware/adminCheck";
import { validateLogin, validateSignup } from "../middleware/userValidation";
import { getAllUsers, login, signUp } from "../controllers/authController";

async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get("/ping", {
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      console.log("Hello!!");
      reply.send({ message: "Hello!!" });
    },
  });

  fastify.get("/api/protected", {
    preHandler: adminCheck,
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ message: "Welcome to admins only route" });
    },
  });
  fastify.get("/api/allusers", {
    handler: getAllUsers
  });

  fastify.post("/api/user/signup", {
    preHandler: validateSignup,
    handler: signUp,
  });

  fastify.post("/api/user/login", {
    preHandler: validateLogin,
    handler: login,
  });
}

export default routes;
