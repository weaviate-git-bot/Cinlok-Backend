import { AsyncRoute } from "../../middleware/async-wrapper";
import { createUniversitySchema } from "../../schema/university-schema";
import UniversityUseCase from "../../usecase/university";

export const createUniversity = AsyncRoute(async (req, res) => {
  const data = createUniversitySchema.parse(req.body);
  const university = await UniversityUseCase.createUniversity(data.name, data.slug);
  res.send({
    message: "Create university success",
    university,
  });
});