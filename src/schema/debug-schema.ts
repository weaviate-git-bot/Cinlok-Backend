import { z } from "zod";
import folderNameSchema from "./partial/folder-name";

export const uploadFileSchema = z.object({
  folderName: folderNameSchema,
  filename: z.string(),
});

export type UploadFileSchema = z.infer<typeof uploadFileSchema>