import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import { verifyUserToken } from "./modules/auth/auth.service";

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */

export const createTRPCContext = async ({
  req,
  res,
}: CreateFastifyContextOptions) => {
  let token = "";

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]!;
  }

  const user = token ? await verifyUserToken(token) : null;

  return {
    user,
    req,
    res,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
