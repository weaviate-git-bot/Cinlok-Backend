import type { FastifyRequest, FastifyReply } from "fastify";
import userUseCase from "../../usecase/user";

const getAllUser = async (_: FastifyRequest, reply: FastifyReply) => {
  const users = await userUseCase.getAll();
  reply.send(users);
};


export default getAllUser;