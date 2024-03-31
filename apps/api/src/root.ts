import { z } from "zod";

import { publicProcedure } from "./procedures";
import { authRouter } from "./routers/auth.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  test: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        summary: "Register a new user",
        path: "/test",
        tags: ["auth"],
      },
      response: {
        default: {
          data: {
            name: "default",
          },
        },
      },
    })
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .output(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ input }) => {
      return input;
    }),
});

export type AppRouter = typeof appRouter;
