import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

import type { User, VerifyToken } from "@lumpick/db/types";

import type { MailService } from "~modules/shared/mail.service";
import { generateEmailConfirmationMail } from "~mails/email-confirmation";
import { CrashReporterService } from "~modules/shared/crash-reporter.service";
import { InstrumentationService } from "~modules/shared/instrumentation.service";

import type { VerifyTokensRepository } from "../repositories/verify-tokens.repository";
import type { JWTTokenService } from "./jwt.service";
import type { UsersService } from "./users.service";

type TokenPayload = {
  userId: number;
};

type AuthServiceDependencies = {
  accessTokenService: JWTTokenService<TokenPayload>;
  refreshTokenService: JWTTokenService<TokenPayload>;
  mailerService: MailService;
  usersService: UsersService;
  baseUrl: string;
  verifyTokensRepository: VerifyTokensRepository;
  instrumentator: InstrumentationService;
  crashReporter: CrashReporterService;
};

export class AuthService {
  private readonly accessTokenService: JWTTokenService<TokenPayload>;
  private readonly refreshTokenService: JWTTokenService<TokenPayload>;
  private readonly mailerService: MailService;
  private readonly usersService: UsersService;
  private readonly baseUrl: string;
  private readonly verifyTokensRepository: VerifyTokensRepository;
  private readonly instrumentator: InstrumentationService;
  private readonly crashReporter: CrashReporterService;

  constructor({
    accessTokenService,
    refreshTokenService,
    mailerService,
    baseUrl,
    usersService,
    verifyTokensRepository,
    instrumentator,
    crashReporter,
  }: AuthServiceDependencies) {
    this.accessTokenService = accessTokenService;
    this.refreshTokenService = refreshTokenService;
    this.mailerService = mailerService;
    this.baseUrl = baseUrl;
    this.usersService = usersService;
    this.verifyTokensRepository = verifyTokensRepository;
    this.instrumentator = instrumentator;
    this.crashReporter = crashReporter;
  }

  public signTokens(userId: number) {
    const tokenPayload = { userId };
    const accessToken = this.accessTokenService.sign(tokenPayload);
    const refreshToken = this.refreshTokenService.sign(tokenPayload);

    return { accessToken, refreshToken };
  }

  public verifyUserToken(token: string) {
    return this.instrumentator.startSpan(
      { name: "Verify user token", attributes: { token } },
      async () => {
        try {
          const decodedToken = this.accessTokenService.decode(token);

          if (!decodedToken) throw new Error("Token is invalid");

          const user = await this.usersService.findUserById(
            decodedToken.userId,
          );

          if (!user) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "User not found",
            });
          }

          return user;
        } catch (err) {
          this.crashReporter.report(err);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Could not authenticate user. Please try again.",
          });
        }
      },
    );
  }

  public removeVerificationToken(token: string) {
    return this.instrumentator.startSpan(
      {
        name: "Remove verification token",
      },
      async () => {
        try {
          await this.verifyTokensRepository.remove(token);
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  public validateVerifyToken(token: VerifyToken) {
    // 1hour expiry
    return token.createdAt.getTime() > Date.now() - 60 * 60 * 1000;
  }

  public getVerificationToken(token: string) {
    return this.instrumentator.startSpan(
      {
        name: "Get verification token",
        attributes: { token },
      },
      async () => {
        try {
          return this.verifyTokensRepository.findByToken(token);
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  private createVerificationToken(user: Pick<User, "id" | "email">) {
    return this.instrumentator.startSpan(
      {
        name: "Create verification token",
        attributes: { userId: user.id },
      },
      async () => {
        try {
          const verifyToken = await this.verifyTokensRepository.create({
            userId: user.id,
            token: uuid(),
            id: uuid(),
          });

          return verifyToken;
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  private getUserVerificationToken(userId: number) {
    return this.instrumentator.startSpan(
      {
        name: "Get user verification token",
        attributes: { userId },
      },
      async () => {
        try {
          return await this.verifyTokensRepository.findByUserId(userId);
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  private updateUserVerificationToken(user: Pick<User, "id" | "email">) {
    return this.instrumentator.startSpan(
      {
        name: "Update user verification token",
        attributes: { userId: user.id },
      },
      async () => {
        try {
          const updatedToken = await this.verifyTokensRepository.update(
            user.id,
            {
              token: uuid(),
              createdAt: new Date(),
            },
          );

          return updatedToken;
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  public getOrUpdateUserVerificationToken(userId: number) {
    return this.instrumentator.startSpan(
      {
        name: "Get or update user verification token",
        attributes: { userId },
      },
      async () => {
        try {
          let verifyToken = await this.getUserVerificationToken(userId);

          if (!verifyToken) {
            verifyToken = await this.createVerificationToken({
              id: userId,
              email: "",
            });
          } else if (!this.validateVerifyToken(verifyToken)) {
            verifyToken = await this.updateUserVerificationToken({
              id: userId,
              email: "",
            });
          }

          if (!verifyToken) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Failed to obtain verification token",
            });
          }

          return verifyToken;
        } catch (err) {
          this.crashReporter.report(err);

          throw err;
        }
      },
    );
  }

  public sendVerificationEmail(user: Pick<User, "name" | "email" | "id">) {
    return this.instrumentator.startSpan(
      {
        name: "Send verification email",
      },
      async () => {
        try {
          const verifyToken = await this.getOrUpdateUserVerificationToken(
            user.id,
          );

          const url = new URL(`${this.baseUrl}/auth/verify-email`);
          url.searchParams.append("token", verifyToken.token);

          await this.mailerService.sendMail({
            subject: "Welcome to Lumpick - Confirm Your Registration!",
            to: user.email,
            html: generateEmailConfirmationMail({
              name: user.name,
              confirmUrl: url.toString(),
            }),
          });
        } catch (err) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send verification email",
          });
        }
      },
    );
  }

  public refreshTokens(refreshToken: string) {
    return this.instrumentator.startSpan(
      {
        name: "Refresh tokens",
        attributes: { refreshToken },
      },
      async () => {
        try {
          const decodedToken = this.refreshTokenService.decode(refreshToken);

          if (!decodedToken) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid refresh token",
            });
          }

          const user = await this.usersService.findUserById(
            decodedToken.userId,
          );

          if (!user) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "User not found",
            });
          }

          return this.signTokens(user.id);
        } catch (err) {
          this.crashReporter.report(err);
          throw err;
        }
      },
    );
  }

  public verifyEmail(token: string) {
    return this.instrumentator.startSpan(
      {
        name: "Verify email",
        attributes: { token },
      },
      async () => {
        try {
          const verifyToken = await this.getVerificationToken(token);

          if (!verifyToken) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Verification token not found",
            });
          }

          if (!this.validateVerifyToken(verifyToken)) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Verification token expired",
            });
          }

          const user = await this.usersService.findUserById(verifyToken.userId);

          if (!user) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "User does not exist",
            });
          }

          await this.usersService.verifyUserEmail(user.id);
          await this.removeVerificationToken(token);

          return user;
        } catch (err) {
          this.crashReporter.report(err);
          throw err;
        }
      },
    );
  }

  public decodeUserToken(token: string) {
    return this.instrumentator.startSpan(
      {
        name: "Decode user token",
        attributes: { token },
      },
      async () => {
        try {
          const decodedPayload = this.accessTokenService.decode(token);

          if (!decodedPayload) throw new Error("Invalid token");

          const user = await this.usersService.findUserById(
            decodedPayload.userId,
          );

          return user;
        } catch (err) {
          this.crashReporter.report(err);
          return null;
        }
      },
    );
  }

  public async verifyUserPassword(password: string, user: User) {
    const isValidPassword = await bcrypt.compare(password, user.password);

    return isValidPassword;
  }

  public async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 12);

    return hashedPassword;
  }
}
