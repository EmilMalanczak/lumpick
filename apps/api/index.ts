import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";

import type { AppRouter } from "./src/root";
import { env } from "./src/config/env";
import { appRouter } from "./src/root";
import { createTRPCContext } from "./src/trpc";
import { logger } from "./src/utils/logger";

export { appRouter, type AppRouter } from "./src/root";
export { createTRPCContext } from "./src/trpc";

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
const prefix = "/";
const server = fastify({ logger: isDev ? logger : false });

void server.register(fastifyTRPCPlugin, {
  prefix,
  trpcOptions: {
    router: appRouter,
    ctx: createTRPCContext,
    createContext: createTRPCContext,
  },
});

logger.debug(env, "ENV");

const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: env.HOST });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

void start();
