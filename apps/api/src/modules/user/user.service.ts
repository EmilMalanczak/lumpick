import { TRPCError } from "@trpc/server";

import type { User } from "@lumpik/db/types";
import { db, eq, tables } from "@lumpik/db";

import { isDbError } from "~utils/is-db-error";

export const findUserById = async (id: User["id"]) => {
  const user = await db.query.users.findFirst({
    where: eq(tables.users.id, id),
  });

  return user;
};

export const findUserByEmail = async (email: User["email"]) => {
  const user = await db.query.users.findFirst({
    where: eq(tables.users.email, email),
  });

  return user;
};

// eslint-disable-next-line @typescript-eslint/require-await
export const updateUser = async () => {
  return null;
};

export const verifyUserEmail = async (userId: number) => {
  try {
    await db
      .update(tables.users)
      .set({ verified: true })
      .where(eq(tables.users.id, userId));
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
