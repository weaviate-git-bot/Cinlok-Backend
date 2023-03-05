import type { Request, Response } from "express"
import TagUseCase from "../../usecase/tag"
import { AsyncRoute } from "../../middleware/async-wrapper"
import { addTagSchema } from "../../schema/tag-schema"


export const addTag = AsyncRoute(async (req: Request, res: Response) => {
    const { tag: tagString } = addTagSchema.parse(req.body)
    const tag = await TagUseCase.addTag(tagString)

    res.send({
        message: "Add tag success",
        tag,
    })
})