import { publicProcedure } from "~/procedures";
import { createTRPCRouter } from "~/trpc";
import {
  refreshTokenHandler,
  resendVerifyEmailHandler,
  verifyEmailHandler,
} from "./auth.controller";
import {
  refreshTokenSchema,
  resendVerifyEmailSchema,
  verifyEmailSchema,
} from "./auth.schema";

export const authRouter = createTRPCRouter({
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
