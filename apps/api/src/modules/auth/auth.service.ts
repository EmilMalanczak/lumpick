/* eslint-disable @typescript-eslint/require-await */
import { TRPCError } from "@trpc/server";
import { emailConfirmationEmailHtml } from "~mails/email-confirmation";
import { isDbError } from "~utils/is-db-error";
import { accessToken, refreshToken } from "~utils/jwt";
import { mailer } from "~utils/mailer";
import { v4 as uuid } from "uuid";

import type { User } from "@lumpik/db";
import { db, eq } from "@lumpik/db";

import type { VerifyToken } from "../../../../../packages/db/src/tables";
import { users, verifyTokens } from "../../../../../packages/db/src/tables";

export const createUser = async (input: User<"insert">) => {
  const [user] = await db.insert(users).values(input).returning({
    id: users.id,
    email: users.email,
    name: users.name,
    provider: users.provider,
  });

  return user;
};

// USER
export const verifyUserEmail = async (userId: number) => {
  try {
    await db.update(users).set({ verified: true }).where(eq(users.id, userId));
  } catch (err) {
    if (isDbError(err) && err.code === "23503") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User does not exist",
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};

export const findUserById = async (id: User["id"]) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  return user;
};

export const findUserByEmail = async (email: User["email"]) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
};

export const updateUser = async () => {
  return null;
};

export const signTokens = (userId: number) => {
  const tokenPayload = { userId };
  const access_token = accessToken.sign(tokenPayload);

  const refresh_token = refreshToken.sign(tokenPayload);

  return { access_token, refresh_token };
};

// VERIFY TOKENS
export const verifyUserToken = async (token: string) => {
  try {
    const decodedToken = accessToken.decode(token);

    if (!decodedToken) throw new Error("Token is invalid");

    const user = await findUserById(decodedToken.userId);

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
};

export const removeVerificationToken = async (token: string) => {
  await db.delete(verifyTokens).where(eq(verifyTokens.token, token));
};

export const validateVerifyToken = (token: VerifyToken) => {
  // 1hour expiry
  return token.createdAt.getTime() > Date.now() - 60 * 60 * 1000;
};

export const getVerificationToken = async (token: string) => {
  const verifyToken = await db.query.verifyTokens.findFirst({
    where: eq(verifyTokens.token, token),
  });

  return verifyToken;
};

export const createVerificationToken = async (
  user: Pick<User, "id" | "email">,
) => {
  const [verifyToken] = await db
    .insert(verifyTokens)
    .values({
      userId: user.id,
      token: uuid(),
      id: uuid(),
    })
    .returning();

  return verifyToken;
};

export const getUserVerificationToken = async (userId: number) => {
  const verifyToken = await db.query.verifyTokens.findFirst({
    where: eq(verifyTokens.userId, userId),
  });

  return verifyToken;
};

export const updateUserVerificationToken = async (
  user: Pick<User, "id" | "email">,
) => {
  const [updatedVerifyToken] = await db
    .update(verifyTokens)
    .set({
      createdAt: new Date(),
      token: uuid(),
    })
    .where(eq(verifyTokens.userId, user.id))
    .returning();

  return updatedVerifyToken;
};

export const sendVerificationEmail = async (
  token: string,
  user: Pick<User, "name" | "email">,
) => {
  const url = new URL("http://localhost:3000/api/auth/verify-email");
  url.searchParams.append("token", token);

  await mailer.sendMail({
    subject: "Welcome to Lumpik - Confirm Your Registration!",
    to: user.email,
    html: emailConfirmationEmailHtml({
      name: user.name,
      confirmUrl: url.toString(),
    }),
  });
};
