import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

//TODO: .env should be handled by pnpm script and general environment
dotenv.config({
  path: "../../.env",
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./src/schema",
  out: "../db-migrate/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  tablesFilter: ["gadget_*"],
} satisfies Config;
