import { BadRequestError } from "../../error/client-error";
import { AsyncRoute } from "../../middleware/async-wrapper";
import { updateUniversityLogoSchema } from "../../schema/university-schema";
import UniversityUseCase from "../../usecase/university";

export const updateUniversityLogo = AsyncRoute(async (req, res) => {
  const slug = updateUniversityLogoSchema.parse(req.params).slug;
  const file = req.file;
  if (!file) {
    throw new BadRequestError("File is required");
  }
  const university = await UniversityUseCase.updateUniversityLogo(slug, file);
  res.send({
    message: "Update university logo success",
    university,
  });
});