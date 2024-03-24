import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: ["./src/tables", "./src/relations"],
  out: "../db-migrate/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  tablesFilter: ["lumpik_*"],
} satisfies Config;
