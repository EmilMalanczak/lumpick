import { serial, text, varchar } from "drizzle-orm/pg-core";

import type { DataTableType, DataType } from "../types/table-data-type";
import { createDataColumns } from "../utils/create-data-columns";
import { lumpikTable } from "../utils/lumpik-table";

export const users = lumpikTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  password: varchar("password", { length: 128 }).notNull(),
  email: varchar("email", {
    length: 128,
  }).notNull(),
  provider: text("provider").notNull(),
  ...createDataColumns(),
});

export type User<T extends DataType = "select"> = DataTableType<
  typeof users,
  T
>;
