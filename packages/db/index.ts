import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { __drizzleSchema } from "./src/drizzle-schema";
import {
  users,
  usersSchema,
  verifyTokens,
  verifyTokensSchema,
} from "./src/tables";

export type { User } from "./src/tables/users.table";
export type { VerifyToken } from "./src/tables";

export * from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema: __drizzleSchema, logger: true });

const schema = {
  users: usersSchema,
  verifyTokens: verifyTokensSchema,
};

export { db, __drizzleSchema, schema };
