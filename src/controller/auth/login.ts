import type { Request, Response } from "express"
import accountUseCase from "../../usecase/account"
import jwt from "../../lib/jwt"
import { AsyncRoute } from "../../middleware/async-wrapper"

export const login = AsyncRoute(async (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string, password: string }
  const account = await accountUseCase.login(username, password)

  const token = jwt.sign({
    id: account.id,
  })
  res.send({
    message: "Login success",
    token,
  })
})
