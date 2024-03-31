import type { TypeOf } from "zod";
import { boolean, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import type { DataType } from "../types/table-data-type";
import { createDataColumns } from "../utils/create-data-columns";
import { lumpikTable } from "../utils/lumpik-table";

export const users = lumpikTable("users", {
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

export const insertUserSchema = createInsertSchema(users, {
  id: (schema) => schema.id.positive(),
  email: (schema) => schema.email.email(),
});

export const selectUserSchema = createSelectSchema(users);

export type User<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof insertUserSchema>
  : TypeOf<typeof selectUserSchema>;
