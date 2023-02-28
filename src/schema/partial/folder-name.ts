import { z } from "zod";
import driveService from "../../service/drive";

const folderNameSchema = z.enum([...driveService.folderNames]);

export default folderNameSchema;