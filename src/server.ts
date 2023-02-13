import express, { Express, Router } from "express";
import cors from "cors"
import * as routes from "./route";
import ErrorHandler from "./middleware/error-handler";
import Serializer from "./middleware/serializer";

import dotenv from "dotenv";

dotenv.config();

const server: Express = express();

// Allow CORS
server.use(cors())

server.use(Serializer)

// Register routes
Object.keys(routes).forEach((routeName) => {
    const route: Router = (routes as any)[routeName]["default"];
    server.use(`/${routeName.replace("Route", "").toLowerCase()}`, route);
});

// Error handler
server.use(ErrorHandler);

async function main() {
    try {
        server.listen(3000, () => {
            console.log(`Server ready at http://localhost:3000`);
        })
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
