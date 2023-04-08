import { AsyncRoute } from "../../middleware/async-wrapper";
import { getAllUniversityQuerySchema } from "../../schema/university-schema";
import UniversityUseCase from "../../usecase/university";

const filters = ["?"];

export const getAllUniversities = AsyncRoute(async (req, res) => {
  const name = getAllUniversityQuerySchema.parse(req.query).name;
  const universities = await UniversityUseCase.getAll(name);

  const filtered = universities.filter((university) => {
    return !filters.includes(university.slug);
  });

  res.send({
    message: "Get universities success",
    universities: filtered,
  });
});