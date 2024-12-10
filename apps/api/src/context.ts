import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import type { FastifyReply, FastifyRequest } from "fastify";

import type { DbClient } from "@lumpick/db";
import type { User } from "@lumpick/db/types";

import type { AuthService } from "~modules/auth/services/auth.service";
import type { UsersService } from "~modules/auth/services/users.service";
import type { LoggerService } from "~modules/shared/logger.service";
import type { MailService } from "~modules/shared/mail.service";

type TrpcContextDependencies = {
  mailer: MailService;
  logger: LoggerService;
  db: DbClient;
  services: {
    auth: AuthService;
    users: UsersService;
  };
};

export type TrpcContext = TrpcContextDependencies & {
  req: FastifyRequest;
  res: FastifyReply;
  user: User | null;
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext =
  ({ logger, mailer, db, services }: TrpcContextDependencies) =>
  async ({ req, res }: CreateFastifyContextOptions): Promise<TrpcContext> => {
    let token = "";

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]!;
    }

    const user = token ? await services.auth.decodeUserToken(token) : null;

    return {
      user,
      req,
      res,
      mailer,
      logger,
      db,
      services,
    };
  };
