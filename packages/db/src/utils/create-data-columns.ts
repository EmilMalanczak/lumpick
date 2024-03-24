import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const createDataColumns = () => ({
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`NOW()`),
  updatedAt: timestamp("updated_at").notNull(),
});
