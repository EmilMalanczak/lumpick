import "../sentry.config.js";

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import * as Sentry from "@sentry/node";
import {
  CreateFastifyContextOptions,
  fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { renderTrpcPanel } from "trpc-ui";

import { setupDb } from "@lumpick/db";

import { setupAuthModule } from "~modules/auth/setup-auth-module";
import { LoggerService } from "~modules/shared/logger.service";
import { MailService } from "~modules/shared/mail.service";

import type { AppRouter } from "./root";

import { env } from "./config/env";
import { createTRPCContext } from "./context";
import { appRouter } from "./root";
import { createCallerFactory } from "./trpc";

export { appRouter, type AppRouter } from "./root";

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

// const isDev = env.ENV !== "production";

const start = async () => {
  try {
    const db = setupDb();

    const logger = new LoggerService(env.ENV);

    logger.log(env, "ENV");

    const mailer = new MailService({
      author: "Lumpick <imgonnamissit123@gmail.com>",
      user: process.env.NODEMAILER_LOGIN!,
      password: process.env.NODEMAILER_PASSWORD!,
      host: "smtp.gmail.com",
      port: 465,
    });

    const { authService, usersService } = setupAuthModule({ mailer, db });

    const server = fastify();

    Sentry.setupFastifyErrorHandler(server);

    await server.register(cors, { origin: "*" });
    await server.register(sensible);

    const trpcContextCreator = createTRPCContext({
      mailer,
      logger,
      db,
      services: {
        auth: authService,
        users: usersService,
      },
    });

    await server.register(fastifyTRPCPlugin, {
      prefix: "/trpc",
      trpcOptions: {
        router: appRouter,
        createContext: trpcContextCreator,
      },
      onError: (err: unknown) => {
        logger.error("Error: ", err);
      },
    });

    server.get("/panel", async (_, res) => {
      await res
        .type("text/html")
        .status(200)
        .send(
          renderTrpcPanel(appRouter, {
            url: `http://localhost:${env.PORT}/trpc`,
            transformer: "superjson",
          }),
        );
    });

    const callerFactory = createCallerFactory(appRouter);

    server.get("/auth/verify-email", async (req, res) => {
      const caller = callerFactory(
        await trpcContextCreator({ req, res } as CreateFastifyContextOptions),
      );

      const searchParams = new URLSearchParams(
        req.query as Record<string, string>,
      );
      const token = searchParams.get("token");

      if (!token) {
        await res.status(400).send("Token is required");
        return;
      }

      const user = await caller.auth.verifyEmail({ token });

      return user;
    });

    await server.listen({ port: env.PORT, host: env.HOST });
    logger.log(`\nSwagger UI: http://localhost:${env.PORT}/panel\n`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

void start();
