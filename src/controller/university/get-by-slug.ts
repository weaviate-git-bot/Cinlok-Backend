import { AsyncRoute } from "../../middleware/async-wrapper";
import { getUniversityQuerySchema } from "../../schema/university-schema";
import UniversityUseCase from "../../usecase/university";

export const getUniversityBySlug = AsyncRoute(async (req, res) => {
  const slug = getUniversityQuerySchema.parse(req.params).slug;
  const university = await UniversityUseCase.getUniversityBySlug(slug);
  res.send({
    message: "Get university success",
    university,
  });
});