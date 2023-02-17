import type { Request, Response } from "express"
import accountUseCase from "../../usecase/account"
import jwt from "../../lib/jwt"
import { AsyncRoute } from "../../middleware/async-wrapper"
import { loginSchema } from "../../schema"

export const login = AsyncRoute(async (req: Request, res: Response) => {
  const { username, password } = loginSchema.parse(req.body)
  const account = await accountUseCase.login(username, password)

  const token = jwt.sign({
    id: account.id,
  })
  res.send({
    message: "Login success",
    token,
  })
})
