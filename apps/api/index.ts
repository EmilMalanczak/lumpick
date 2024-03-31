import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { fastifyTRPCOpenApiPlugin } from "trpc-openapi";

import type { AppRouter } from "./src/root";
import { env } from "./src/config/env";
import { createTRPCContext } from "./src/context";
import { swaggerPlugin } from "./src/plugins/swagger.plugin";
import { appRouter } from "./src/root";
import { logger } from "./src/utils/logger";

export { appRouter, type AppRouter } from "./src/root";

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const isDev = env.ENV !== "production";
const server = fastify({ logger: isDev ? logger : false });

logger.debug(env, "ENV");

const start = async () => {
  try {
    await server.register(cors, { origin: "*" });
    await server.register(sensible);
    await server.register(fastifyTRPCPlugin, {
      prefix: "/trpc",
      trpcOptions: {
        router: appRouter,
        ctx: createTRPCContext,
        createContext: createTRPCContext,
      },
    });
    await server.register(fastifyTRPCOpenApiPlugin, {
      basePath: "/api",
      router: appRouter,
      createContext: createTRPCContext,
      onError: (err: unknown) => {
        logger.error(err);
      },
      responseMeta: (res: unknown) => res,
      maxBodySize: 1024 * 1024 * 10, // 10MB
    });

    await server.register(swaggerPlugin);

    await server.listen({ port: env.PORT, host: env.HOST });
    server.swagger();
    logger.info(`\nSwagger UI: http://localhost:3000/docs\n`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

void start();
