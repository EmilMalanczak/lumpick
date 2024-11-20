import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { schema } from "./src/schema";

export type { User } from "./src/tables/users.table";
export type { VerifyToken } from "./src/tables";

export * from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema, logger: true });

export { db, schema };
