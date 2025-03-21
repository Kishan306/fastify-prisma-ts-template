import Joi from "joi";
import { FastifyRequest, FastifyReply } from "fastify";

const usernameSchema = Joi.string().alphanum().min(3).max(15).required();
const emailSchema = Joi.string().email().required();
const passwordSchema = Joi.string()
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
  )
  .required();

export const validateSignup = (
  req: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) => {
  const { username, email, password } = req.body as {
    username: string;
    email: string;
    password: string;
  };

  const { error: usernameError } = usernameSchema.validate(username);
  if (usernameError) {
    return reply.status(400).send({ error: "Invalid username" });
  }

  const { error: emailError } = emailSchema.validate(email);
  if (emailError) {
    return reply.status(400).send({ error: "Invalid email" });
  }

  const { error: passwordError } = passwordSchema.validate(password);
  if(passwordError){
    if(password.length < 8 || password.length > 20){
      return reply.status(400).send({
        error: "Password length must be between 8-20 characters!"
      })
    } else if ( password == password.toUpperCase() || password == password.toLowerCase()){
      return reply.status(400).send({
        error: "Password must have both uppercase and lowercase characters!"
      })
    } else if (!/[0-9]/.test(password)) {
      return reply.status(400).send({
        error: "Password must contain at least one digit!"
      })
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return reply.status(400).send({
        error: "Password must contain at least one special character!"
      })
    }
  }

  done();
};

export const validateLogin = (
  req: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) => {
  const { email, password } = req.body as { email: string; password: string };

  const { error: emailError } = emailSchema.validate(email);
  if (emailError) {
    return reply.status(400).send({ error: "Invalid email" });
  }

  const { error: passwordError } = passwordSchema.validate(password);
  if(passwordError){
    if(password.length < 8 || password.length > 20){
      return reply.status(400).send({
        error: "Password length must be between 8-20 characters!"
      })
    } else if ( password == password.toUpperCase() || password == password.toLowerCase()){
      return reply.status(400).send({
        error: "Password must have both uppercase and lowercase characters!"
      })
    } else if (!/[0-9]/.test(password)) {
      return reply.status(400).send({
        error: "Password must contain at least one digit!"
      })
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return reply.status(400).send({
        error: "Password must contain at least one special character!"
      })
    }
  }

  done();
};
