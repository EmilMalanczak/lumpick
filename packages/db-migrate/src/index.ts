import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { schema } from "@lumpik/db";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(client, {
  schema,
  logger: true,
});

(async () => {
  const sourceDir = new URL("../migrations", import.meta.url);

  await migrate(db, { migrationsFolder: sourceDir.pathname });
  console.log("migrations successful.");

  await client.end();
  process.exit(0);
})().catch((e) => {
  // Deal with the fact the chain failed
  console.error("migration failed");
  console.error(e);
  process.exit(1);
});
