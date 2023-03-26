import { AsyncRoute } from "../../middleware/async-wrapper";
import { deleteUniversitySchema } from "../../schema/university-schema";
import UniversityUseCase from "../../usecase/university";

export const deleteUniversity = AsyncRoute(async (req, res) => {
  const slug = deleteUniversitySchema.parse(req.params).slug;
  const university = await UniversityUseCase.deleteUniversity(slug);
  res.send({
    message: "Delete university success",
    university,
  });
});