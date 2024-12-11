import type { TRPCPanelMeta } from "trpc-ui";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import type { TrpcContext } from "./context";

export const t = initTRPC
  .meta<TRPCPanelMeta>()
  .context<TrpcContext>()
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
export const createCallerFactory = t.createCallerFactory;
