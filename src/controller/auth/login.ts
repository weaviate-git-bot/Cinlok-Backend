import type { Request, Response } from "express"
import accountUseCase from "../../usecase/account"
import { AsyncRoute } from "../../middleware/async-wrapper"
import { loginSchema } from "../../schema"

export const login = AsyncRoute(async (req: Request, res: Response) => {
  const { username, password } = loginSchema.parse(req.body)
  const token = await accountUseCase.login(username, password)


  res.send({
    message: "Login success",
    token,
  })
})
