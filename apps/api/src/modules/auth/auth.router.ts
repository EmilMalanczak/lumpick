import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/rpc";

import { protectedProcedure, publicProcedure } from "~/procedures";
import { createTRPCRouter } from "~/trpc";
import { LumpickError } from "~utils/error";

import {
  createUserSchema,
  loginUserSchema,
  refreshTokenSchema,
  resendVerifyEmailSchema,
  verifyEmailSchema,
} from "./auth.schema";

export const authRouter = createTRPCRouter({
  refreshToken: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        summary: "Refresh token",
        path: "/auth/refresh-token",
        tags: ["auth"],
      },
    })
    .input(refreshTokenSchema.input)
    .output(refreshTokenSchema.output)
    .mutation(async ({ input, ctx }) => {
      const { refreshToken } = input;

      try {
        const updatedTokens =
          await ctx.services.auth.refreshTokens(refreshToken);

        return updatedTokens;
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "Invalid refresh token") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid refresh token",
            });
          }
        }

        ctx.logger.error(err);

        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Failed to refresh token",
        });
      }
    }),

  verifyEmail: publicProcedure
    // .meta({
    //   openapi: {
    //     method: "GET",
    //     summary: "Verify user email",
    //     path: "/auth/verify-email",
    //     tags: ["auth"],
    //   },
    // })
    .input(verifyEmailSchema.input)
    .output(verifyEmailSchema.output)
    .query(async ({ input, ctx }) => {
      const { token } = input;

      try {
        const verifyToken = await ctx.services.auth.getVerificationToken(token);

        if (!verifyToken) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Verification token not found",
          });
        }

        if (!ctx.services.auth.validateVerifyToken(verifyToken)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Verification token expired",
          });
        }

        const user = await ctx.services.users.findUserById(verifyToken.userId);

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User does not exist",
          });
        }

        await ctx.services.users.verifyUserEmail(user.id);
        await ctx.services.auth.removeVerificationToken(token);

        return {
          message: "Email verified successfully. You can now close this page.",
        };
      } catch (error) {
        ctx.logger.error(error);

        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Failed to verify email",
          cause: error,
        });
      }
    }),

  resendVerifyEmail: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        summary: "Resend verify user email",
        path: "/auth/verify-email/resend",
        tags: ["auth"],
      },
    })
    .input(resendVerifyEmailSchema.input)
    .output(resendVerifyEmailSchema.output)
    .query(async ({ input, ctx }) => {
      const user = await ctx.services.users.findUserByEmail(input.email);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      await ctx.services.auth.sendVerificationEmail(user);

      return {
        message:
          "Verification email sent successfully. Please check your email.",
      };
    }),

  register: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        summary: "Register a new user",
        path: "/auth/register",
        tags: ["auth"],
        example: {
          request: {
            email: "emil.malanczak@gmail.com",
            name: "test user",
            password: "password123",
            passwordConfirm: "password123",
          },
        },
      },
    })
    .input(createUserSchema.input)
    .output(createUserSchema.output)
    .mutation(async ({ input, ctx }) => {
      if (input.password !== input.passwordConfirm) {
        ctx.logger.error("Passwords do not match");

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }

      try {
        const userDto = {
          email: input.email,
          name: input.name,
          password: input.password,
        };

        const user = await ctx.services.users.createUser({
          email: userDto.email,
          password: userDto.password,
          name: userDto.name,
          provider: "local",
          verified: false,
        });

        await ctx.services.auth.sendVerificationEmail(user);

        return user;
      } catch (err) {
        ctx.logger.error(err);

        if (err instanceof LumpickError) {
          throw new TRPCError({
            code:
              err.code in TRPC_ERROR_CODES_BY_KEY ? err.code : "BAD_REQUEST",
            message: err.message,
            cause: err,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
          cause: err,
        });
      }
    }),
  login: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        summary: "Login",
        path: "/user/login",
        tags: ["user"],
        example: {
          request: {
            email: "emil.malanczak@gmail.com",
            password: "password123",
          },
        },
      },
    })
    .input(loginUserSchema.input)
    .output(loginUserSchema.output)
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.services.users.findUserByEmail(input.email);

        const invalidError = new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });

        if (!user) {
          throw invalidError;
        }

        const isValidPassword = await ctx.services.users.verifyUserPassword(
          input.password,
          user,
        );

        if (!isValidPassword) {
          throw invalidError;
        }

        if (!user.verified) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Email not verified",
          });
        }

        const { accessToken, refreshToken } = ctx.services.auth.signTokens(
          user.id,
        );

        return {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            provider: user.provider,
          },
        };
      } catch (err) {
        ctx.logger.error(err);

        if (err instanceof LumpickError) {
          throw new TRPCError({
            code:
              err.code in TRPC_ERROR_CODES_BY_KEY ? err.code : "BAD_REQUEST",
            message: err.message,
            cause: err,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to login",
          cause: err,
        });
      }
    }),
});
