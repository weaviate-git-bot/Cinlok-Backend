import type { Request, Response } from "express"
import accountUseCase from "../../usecase/account"
import { registerSchema } from "../../schema"
import { AsyncRoute } from "../../middleware/async-wrapper"

export const register = AsyncRoute(async (req: Request, res: Response) => {
  const { email, username, password} = registerSchema.parse(req.body)
  const isRegistered = await accountUseCase.register(email, username, password)

    if (isRegistered) {
        res.send({
            message: "Register success",
        })
    }
    else {
        res.send({
            message: "Register failed",
        })
    }
})
