import { publicProcedure } from "~plugins/procedures";

import { createTRPCRouter } from "../../trpc";
import {
  loginMutationHandler,
  refreshTokenHandler,
  registerMutationHandler,
  resendVerifyEmailHandler,
  verifyEmailHandler,
} from "./auth.controller";
import {
  createUserSchema,
  loginUserSchema,
  refreshTokenSchema,
  resendVerifyEmailSchema,
  verifyEmailSchema,
} from "./auth.schema";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        summary: "Login",
        path: "/auth/login",
        tags: ["auth"],
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
    .mutation(({ input }) => loginMutationHandler(input)),

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
    .mutation(({ input }) => registerMutationHandler(input)),

  refreshToken: publicProcedure
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
    .mutation(({ input }) => refreshTokenHandler(input)),

  verifyEmail: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        summary: "Verify user email",
        path: "/auth/verify-email",
        tags: ["auth"],
      },
    })
    .input(verifyEmailSchema.input)
    .output(verifyEmailSchema.output)
    .mutation(({ input, ctx }) => {
      return verifyEmailHandler(input, { ctx });
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
    .mutation(({ input }) => resendVerifyEmailHandler(input)),
});
