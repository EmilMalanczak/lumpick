import { TRPCError } from "@trpc/server";
import {
  findUserByEmail,
  findUserById,
  verifyUserEmail,
} from "~modules/user/user.service";
import { refreshToken } from "~utils/jwt";
import { logger } from "~utils/logger";

import type {
  RefreshTokenInput,
  ResendVerifyEmailInput,
  VerifyEmailInput,
} from "./auth.schema";
import type { Context } from "~/context";
import {
  createVerificationToken,
  getUserVerificationToken,
  getVerificationToken,
  removeVerificationToken,
  sendVerificationEmail,
  signTokens,
  updateUserVerificationToken,
  validateVerifyToken,
} from "./auth.service";

export const refreshTokenHandler = async ({
  refreshToken: token,
}: RefreshTokenInput) => {
  try {
    const message = "Could not refresh access token";

    if (!token) {
      throw new TRPCError({ code: "FORBIDDEN", message });
    }

    // Validate the Refresh token
    const decoded = refreshToken.decode(token);

    if (!decoded) {
      throw new TRPCError({ code: "FORBIDDEN", message });
    }

    // Check if the user exist
    const user = await findUserById(decoded.userId);

    if (!user) {
      throw new TRPCError({ code: "FORBIDDEN", message });
    }

    const { access_token, refresh_token } = signTokens(user.id);

    // Send response
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  } catch (err) {
    logger.error(err);

    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Failed to refresh token",
    });
  }
};

// export const logoutHandler = async ({ ctx }: { ctx: Context }) => {
//   try {
//     const user = ctx.user;
//     await redisClient.del(user?.id as string);
//     logout({ ctx });
//     return { status: "success" };
//   } catch (err: any) {
//     throw err;
//   }
// };

export const verifyEmailHandler = async (
  { token }: VerifyEmailInput,
  { ctx }: { ctx: Context },
) => {
  try {
    if (!token) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Token is missing" });
    }

    const verifyToken = await getVerificationToken(token);

    if (!verifyToken) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Verification token not found",
      });
    }

    if (!validateVerifyToken(verifyToken)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Verification token expired",
      });
    }

    const user = await findUserById(verifyToken.userId);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User does not exist",
      });
    }

    // Update the user
    await verifyUserEmail(user.id);

    await removeVerificationToken(token);

    await ctx.res.send(
      "Email verified successfully. You can now close this tab.",
    );
    // Send response
  } catch (err) {
    logger.error(err);

    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Failed to verify email",
    });
  }
};

export const resendVerifyEmailHandler = async (
  input: ResendVerifyEmailInput,
) => {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  // Check if token already exists
  let verifyToken = await getUserVerificationToken(user.id);

  if (!verifyToken) {
    verifyToken = await createVerificationToken(user);
  } else if (!validateVerifyToken(verifyToken)) {
    verifyToken = await updateUserVerificationToken(user);
  }

  if (!verifyToken) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Failed to create verification token",
    });
  }

  await sendVerificationEmail(verifyToken.token, user);

  return {
    message: "Verification email sent successfully. Please check your email.",
  };
};
