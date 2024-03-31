import type { OpenApiMeta } from "trpc-openapi";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import type { createTRPCContext } from "./context";

export const t = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createTRPCContext>()
  .create({
    transformer: superjson,
    errorFormatter: ({ shape, error }) => ({
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }),
  });

export const createTRPCRouter = t.router;
