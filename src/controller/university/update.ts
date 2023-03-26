import { AsyncRoute } from "../../middleware/async-wrapper";
import { updateUniversityParamSchema, updateUniversitySchema } from "../../schema/university-schema";
import UniversityUseCase from "../../usecase/university";

export const updateUniversity = AsyncRoute(async (req, res) => {
  const slug = updateUniversityParamSchema.parse(req.params).slug;
  const name = updateUniversitySchema.parse(req.body).name;

  const university = await UniversityUseCase.updateUniversity(
    slug,
    name
  );
  res.send({
    message: "Update university success",
    university,
  });
});