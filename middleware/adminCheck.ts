import jwt from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify"
import type { JwtPayload } from "jsonwebtoken";

export const adminCheck = (request: FastifyRequest, reply: FastifyReply, done: ()=>void) => {
    const token = request.headers["authorization"]?.replace("Bearer ", "");

    if(!token){
        return reply.status(401).send({ error: "No token provided!"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if(decoded.role !== "ADMIN"){
            return reply.status(403).send({ error: "Forbidden! Admins only!"})
        }
    } catch (error) {
        console.log(error.name);
    }

    done()
}
