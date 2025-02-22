import { boolean, serial, text, varchar } from "drizzle-orm/pg-core";

import { createDataColumns } from "../../utils/create-data-columns";
import { lumpickTable } from "../../utils/lumpick-table";

export const users = lumpickTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 128 }).notNull(),
  email: varchar("email", {
    length: 128,
  })
    .notNull()
    .unique(),
  verified: boolean("verified").notNull().default(false),
  provider: text("provider").notNull(),
  ...createDataColumns(),
});
