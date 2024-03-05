import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as userSchemas from "./src/schema/user";

export const schema = { ...userSchemas };

export { lumpikTable } from "./src/_table";

export * from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
