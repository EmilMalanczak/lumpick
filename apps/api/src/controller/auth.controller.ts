import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import type { Context } from "../context";
import type {
  CreateUserInput,
  LoginUserInput,
  RefreshTokenInput,
  VerifyEmailInput,
} from "../schemas/auth.schema";
import {
  createUser,
  createVerificationToken,
  findUserByEmail,
  findUserById,
  getVerificationToken,
  removeVerificationToken,
  sendVerificationEmail,
  signTokens,
  validateVerifyToken,
  verifyUserEmail,
} from "../services/auth.service";
import { isDbError } from "../utils/is-db-error";
import { refreshToken } from "../utils/jwt";
import { logger } from "../utils/logger";

export const registerMutationHandler = async (input: CreateUserInput) => {
  try {
    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await createUser({
      email: input.email,
      name: input.name,
      password: hashedPassword,
      provider: "local",
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const verifyToken = await createVerificationToken(user);

    if (!verifyToken) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Failed to create verification token",
      });
    }

    await sendVerificationEmail(verifyToken.token, user);

    return {
      status: "success",
      data: user,
    };
  } catch (err) {
    logger.error(err);

    if (isDbError(err) && err.code === "23505") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already exists",
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create user",
    });
  }
};

export const loginMutationHandler = async (input: LoginUserInput) => {
  try {
    // Get the user from the collection
    const user = await findUserByEmail(input.email);

    // Check if user exist and password is correct
    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    // Create the Access and refresh Tokens
    const { access_token, refresh_token } = signTokens(user.id);

    // Send Access Token
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
      },
    };
  } catch (err) {
    logger.error(err);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to login",
    });
  }
};

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
    console.log("token", token);
    console.log("token", token);
    console.log("token", token);
    console.log("token", token);
    console.log("token", token);
    console.log("token", token);
    console.log("token", token);
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
