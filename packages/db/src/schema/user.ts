import { sql } from "drizzle-orm";
import { text, timestamp } from "drizzle-orm/pg-core";

import { lumpikTable } from "../_table";

export const users = lumpikTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`NOW()`),
});
