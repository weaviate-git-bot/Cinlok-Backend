import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import FastifyCors from "@fastify/cors";
import FastifyJWT from "@fastify/jwt";

import * as registerRoutes from "./route";

export const server = Fastify();

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            user_id: number;
            email: string;
            username: string;
            name: string;
            isAdmin: boolean;
        };
    }
}

server.register(FastifyJWT, {
    secret: "theonlysecret",
    sign: {
        expiresIn: "2h",
    }
});

// Allow CORS
server.register(FastifyCors, {
    origin: true,
    credentials: true,
});

server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (e) {
            return reply.send(e);
        }
    }
);

server.get("/healthcheck", async function () {
    return { status: "OK" };
});

// Register routes
Object.values(registerRoutes).forEach((route) => route(server));

async function main() {
    try {
        await server.listen({ host: "0.0.0.0", port: 3000 });

        console.log(`Server ready at http://localhost:3000`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
