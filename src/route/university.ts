import { Router } from "express";
import { universityController } from "../controller";
import upload from "../lib/multer";
import { AuthMiddleware as AdminM } from "../middleware/auth/admin-authenticated";

const UniversityRoute = Router();

UniversityRoute.get("/", universityController.getAllUniversities);
UniversityRoute.get("/:slug", universityController.getUniversityBySlug);
UniversityRoute.post("/", AdminM, universityController.createUniversity);
UniversityRoute.put("/:slug", AdminM, universityController.updateUniversity);
UniversityRoute.put("/:slug/logo", AdminM, upload.single("file"), universityController.updateUniversityLogo);
UniversityRoute.delete("/:slug/logo", AdminM, universityController.deleteUniversityLogo);
UniversityRoute.delete("/:slug", AdminM, universityController.deleteUniversity);

export default UniversityRoute;