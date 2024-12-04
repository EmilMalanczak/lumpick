import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

import {
  createUser,
  createVerificationToken,
  sendVerificationEmail,
  signTokens,
} from "~modules/auth/auth.service";
import { isDbError } from "~utils/is-db-error";
import { logger } from "~utils/logger";

import type { CreateUserInput, LoginUserInput } from "./user.schema";

import { findUserByEmail } from "./user.service";

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
