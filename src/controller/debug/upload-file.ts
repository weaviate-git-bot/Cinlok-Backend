import type { Request, Response } from "express";
import { AsyncRoute } from "../../middleware/async-wrapper";
import DriveService from "../../service/drive"
import { BadRequestError } from "../../error/client-error";
import { uploadFileSchema } from "../../schema/debug-schema";

export const uploadFile = AsyncRoute(
  async (req: Request, res: Response) => {
    const { file } = req;
    const { folderName, filename } = uploadFileSchema.parse(req.body)
    if (!file) {
      throw new BadRequestError("File is required")
    }

    const fileId = await DriveService.uploadFile(file, folderName, filename);

    res.send({
      message: "Upload file success",
      fileUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
    });
  }
)
