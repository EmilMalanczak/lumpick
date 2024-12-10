import { TRPCError } from "@trpc/server";
import { v4 as uuid } from "uuid";

import type { User, VerifyToken } from "@lumpick/db/types";

import type { MailService } from "~modules/shared/mail.service";
import { generateEmailConfirmationMail } from "~mails/email-confirmation";

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
};

export class AuthService {
  private readonly accessTokenService: JWTTokenService<TokenPayload>;
  private readonly refreshTokenService: JWTTokenService<TokenPayload>;
  private readonly mailerService: MailService;
  private readonly usersService: UsersService;
  private readonly baseUrl: string;
  private readonly verifyTokensRepository: VerifyTokensRepository;

  constructor({
    accessTokenService,
    refreshTokenService,
    mailerService,
    baseUrl,
    usersService,
    verifyTokensRepository,
  }: AuthServiceDependencies) {
    this.accessTokenService = accessTokenService;
    this.refreshTokenService = refreshTokenService;
    this.mailerService = mailerService;
    this.baseUrl = baseUrl;
    this.usersService = usersService;
    this.verifyTokensRepository = verifyTokensRepository;
  }

  public signTokens(userId: number) {
    const tokenPayload = { userId };
    const accessToken = this.accessTokenService.sign(tokenPayload);
    const refreshToken = this.refreshTokenService.sign(tokenPayload);

    return { accessToken, refreshToken };
  }

  public async verifyUserToken(token: string) {
    try {
      const decodedToken = this.accessTokenService.decode(token);

      if (!decodedToken) throw new Error("Token is invalid");

      const user = await this.usersService.findUserById(decodedToken.userId);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    } catch (err) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Could not authenticate user. Please try again.",
      });
    }
  }

  public async removeVerificationToken(token: string) {
    await this.verifyTokensRepository.remove(token);
  }

  public validateVerifyToken(token: VerifyToken) {
    // 1hour expiry
    return token.createdAt.getTime() > Date.now() - 60 * 60 * 1000;
  }

  public async getVerificationToken(token: string) {
    return await this.verifyTokensRepository.findByToken(token);
  }

  private async createVerificationToken(user: Pick<User, "id" | "email">) {
    const verifyToken = await this.verifyTokensRepository.create({
      userId: user.id,
      token: uuid(),
      id: uuid(),
    });

    return verifyToken;
  }

  private async getUserVerificationToken(userId: number) {
    return await this.verifyTokensRepository.findByUserId(userId);
  }

  private async updateUserVerificationToken(user: Pick<User, "id" | "email">) {
    const updatedToken = await this.verifyTokensRepository.update(user.id, {
      token: uuid(),
      createdAt: new Date(),
    });

    return updatedToken;
  }

  public async getOrUpdateUserVerificationToken(userId: number) {
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
  }

  public async sendVerificationEmail(
    user: Pick<User, "name" | "email" | "id">,
  ) {
    try {
      const verifyToken = await this.getOrUpdateUserVerificationToken(user.id);

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
  }

  public async refreshTokens(refreshToken: string) {
    const decodedToken = this.refreshTokenService.decode(refreshToken);

    if (!decodedToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
      });
    }

    const user = await this.usersService.findUserById(decodedToken.userId);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return this.signTokens(user.id);
  }

  public async verifyEmail(token: string) {
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
  }

  public async decodeUserToken(token: string) {
    try {
      const decodedPayload = this.accessTokenService.decode(token);

      if (!decodedPayload) throw new Error("Invalid token");

      const user = await this.usersService.findUserById(decodedPayload.userId);

      return user;
    } catch (err) {
      return null;
    }
  }
}
