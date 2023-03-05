import type { Request, Response } from "express"
import UserUseCase from "../../usecase/user"
import { AsyncRoute } from "../../middleware/async-wrapper"

export const getProfile = AsyncRoute(async (_: Request, res: Response) => {
    const account = res.locals['account'];
    const id = account.id
    const user = await UserUseCase.getProfile(id)

    res.send({
        message: "Get profile success",
        user,
    })
}
)
