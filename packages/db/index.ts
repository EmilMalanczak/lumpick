import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { relations } from "./src/relations";
import { enums, tables } from "./src/tables";

export * from "drizzle-orm";

const __drizzleSchema = { ...tables, ...enums, ...relations };

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema: __drizzleSchema, logger: true });

export { db, __drizzleSchema, tables, enums };
