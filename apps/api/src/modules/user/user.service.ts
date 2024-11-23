/* eslint-disable @typescript-eslint/require-await */
import { TRPCError } from "@trpc/server";
import { isDbError } from "~utils/is-db-error";
import { users } from "node_modules/@lumpik/db/src/tables";

import type { User } from "@lumpik/db";
import { db, eq } from "@lumpik/db";

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
