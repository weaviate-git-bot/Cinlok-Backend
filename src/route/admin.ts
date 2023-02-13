import { Router } from "express"
import { adminController } from "../controller";

const AdminRoute = Router();
AdminRoute.get("/users", adminController.getAllUser)

export default AdminRoute;
