import { UnauthenticatedError } from "../../error";
import jwt from "../../lib/jwt";
import prisma from "../../repository";
import { AsyncMiddleware } from "../async-wrapper";

export const AuthMiddleware = AsyncMiddleware(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new UnauthenticatedError();
  }
  const { id } = jwt.verify(token) as { id: number };
  const user = await prisma.account.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new UnauthenticatedError();
  }

  res.locals.account = user;

  next();
});