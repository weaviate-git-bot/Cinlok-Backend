import type { Request, Response } from "express"
import TagUseCase from "../../usecase/tag"
import { AsyncRoute } from "../../middleware/async-wrapper"

export const getTags = AsyncRoute(async (_: Request, res: Response) => {
    const tags = await TagUseCase.getAll()

    res.send({
        message: "Get tags success",
        tags,
    })
}
)
