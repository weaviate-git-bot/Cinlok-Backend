import { AsyncRoute } from "../../middleware/async-wrapper";
import { deleteProfilePhotoSchema } from "../../schema";
import UserUseCase from "../../usecase/user";

export const deleteProfilePhoto = AsyncRoute(async (req, res) => {
  const account = res.locals["account"];
  const id = account.id;

  const { index } = deleteProfilePhotoSchema.parse(req.body);

  const userPhotos = await UserUseCase.deleteProfilePhoto(id, index);
  res.send({
    message: "Delete profile photo success",
    userPhotos,
  });
});