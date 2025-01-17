import type { DbClient } from "@lumpick/db";

import type { MailService } from "~modules/shared/mail.service";
import { env } from "~config/env";
import { tokenConfig } from "~config/token";
import { CrashReporterService } from "~modules/shared/crash-reporter.service";
import { InstrumentationService } from "~modules/shared/instrumentation.service";

import { UsersRepository } from "./repositories/users.repository";
import { VerifyTokensRepository } from "./repositories/verify-tokens.repository";
import { AuthService } from "./services/auth.service";
import { JWTTokenService } from "./services/jwt.service";
import { UsersService } from "./services/users.service";

type AuthModuleDependencies = {
  mailer: MailService;
  db: DbClient;
  crashReporter: CrashReporterService;
  instrumentator: InstrumentationService;
};

type AuthTokenPayload = {
  userId: number;
};

export const setupAuthModule = ({
  mailer,
  db,
  instrumentator,
  crashReporter,
}: AuthModuleDependencies) => {
  /* Repositories */
  const usersRepository = new UsersRepository({
    db,
    instrumentator,
    crashReporter,
  });
  const verifyTokensRepository = new VerifyTokensRepository({
    db,
    instrumentator,
    crashReporter,
  });

  /* Services */
  const accessTokenService = new JWTTokenService<AuthTokenPayload>(
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_PUBLIC,
    {
      algorithm: "RS256",
      subject: "user",
      expiresIn: tokenConfig.accessTokenExpiry,
    },
  );

  const refreshTokenService = new JWTTokenService<AuthTokenPayload>(
    env.REFRESH_TOKEN_SECRET,
    env.REFRESH_TOKEN_PUBLIC,
    {
      algorithm: "RS256",
      subject: "user",
      expiresIn: tokenConfig.refreshTokenExpiry,
    },
  );

  const usersService = new UsersService({
    usersRepository,
    instrumentator,
    crashReporter,
  });

  const authService = new AuthService({
    verifyTokensRepository,
    usersService,
    accessTokenService,
    refreshTokenService,
    mailerService: mailer,
    baseUrl: process.env.BASE_URL ?? "http://localhost:3003",
    instrumentator,
    crashReporter,
  });

  return {
    authService,
    usersService,
  };
};
