import type { DbClient } from "@lumpick/db";

import type { MailService } from "~modules/shared/mail.service";
import { env } from "~config/env";
import { tokenConfig } from "~config/token";

import { UsersRepository } from "./repositories/users.repository";
import { VerifyTokensRepository } from "./repositories/verify-tokens.repository";
import { AuthService } from "./services/auth.service";
import { JWTTokenService } from "./services/jwt.service";
import { UsersService } from "./services/users.service";

type AuthModuleDependencies = {
  mailer: MailService;
  db: DbClient;
};

type AuthTokenPayload = {
  userId: number;
};

export const setupAuthModule = ({ mailer, db }: AuthModuleDependencies) => {
  /* Repositories */
  const usersRepository = new UsersRepository({ db });
  const verifyTokensRepository = new VerifyTokensRepository({ db });

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
  });

  const authService = new AuthService({
    usersService,
    verifyTokensRepository,
    accessTokenService,
    refreshTokenService,
    mailerService: mailer,
    baseUrl: process.env.BASE_URL ?? "http://localhost:3003",
  });

  return {
    authService,
    usersService,
  };
};
