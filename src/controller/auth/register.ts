import type { Request, Response } from "express"
import accountUseCase from "../../usecase/account"
import { registerSchema } from "../../schema"
import { AsyncRoute } from "../../middleware/async-wrapper"

export const register = AsyncRoute(async (req: Request, res: Response) => {
    const { email, username, password, univ_slug } = registerSchema.parse(req.body)

    const account = await accountUseCase.register(email, username, password, univ_slug);

    res.send({
        message: "Register success",
        account,
    })
})
