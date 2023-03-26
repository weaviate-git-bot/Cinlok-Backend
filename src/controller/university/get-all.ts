import { AsyncRoute } from "../../middleware/async-wrapper"
import { getAllUniversityQuerySchema } from "../../schema/university-schema"
import UniversityUseCase from "../../usecase/university"

export const getAllUniversities = AsyncRoute(async (req, res) => {
  const name = getAllUniversityQuerySchema.parse(req.query).name
  const universities = await UniversityUseCase.getAll(name)
  res.send({
    message: "Get universities success",
    universities,
  })
})