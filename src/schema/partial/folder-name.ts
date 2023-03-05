import { z } from "zod";
import DriveService from "../../service/drive";

const folderNameSchema = z.enum([...DriveService.folderNames]);

export default folderNameSchema;