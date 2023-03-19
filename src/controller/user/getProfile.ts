import { AsyncRoute } from "../../middleware/async-wrapper"
import { getProfileQuerySchema } from "../../schema"
import UserUseCase from "../../usecase/user"

export const getProfile = AsyncRoute(async (req, res) => {
    const { userId } = getProfileQuerySchema.parse(req.query)

    const user = await UserUseCase.getProfile(userId)

    res.send({
        message: "Get profile success",
        user,
    })
})
