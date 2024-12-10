import { defineConfig } from "drizzle-kit";

import { TABLE_PREFIX } from "./src/utils/lumpick-table";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  schema: [
    "./src/**/*.table.ts",
    "./src/**/*.schema.ts",
    "./src/**/*.relations.ts",
  ],
  out: "../db-migrate/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  tablesFilter: [TABLE_PREFIX],
});
