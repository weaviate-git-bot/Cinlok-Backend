import { AsyncRoute } from "../../middleware/async-wrapper";
import { deleteUniversityLogoSchema } from "../../schema/university-schema";
import UniversityUseCase from "../../usecase/university";

export const deleteUniversityLogo = AsyncRoute(async (req, res) => {
  const slug = deleteUniversityLogoSchema.parse(req.params).slug;
  const university = await UniversityUseCase.deleteUniversityLogo(slug);
  res.send({
    message: "Delete university logo success",
    university,
  });
});