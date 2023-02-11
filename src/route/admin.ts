import type { FastifyInstance } from "fastify";

import { adminController } from "../controller";

const registerAdminRoute = (server: FastifyInstance) => {
  server.get("/admin/users", adminController.getAllUser);
};

export default registerAdminRoute;
