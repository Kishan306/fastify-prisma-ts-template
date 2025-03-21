import jwt from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const { username, email, password } = request.body as {
    username: string;
    email: string;
    password: string;
  };

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return reply.status(400).send({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role || "BASIC",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    reply.status(201).send({ message: "User created successfully", token });
  } catch (error) {
    return reply.status(500).send({ error: "Internal server error" });
  }
};

const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return reply.status(400).send({ error: "No user with this email!" });
    }

    const isPasswordValid = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!isPasswordValid) {
      return reply.status(400).send({ error: "Email or password invalid!" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || "BASIC",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return reply.status(200).send({ message: "Logged in successfully", token });
  } catch (error) {
    return reply.status(500).send({ error: "Internal server error" });
  }
};

const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const allUsers = await prisma.user.findMany({});

    if (!allUsers) {
      return reply.status(404).send({ message: "No users found" });
    }

    return reply.status(200).send({ allUsers });
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
};

export { signUp, login, getAllUsers };
