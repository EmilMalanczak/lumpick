import { integer, serial, varchar } from "drizzle-orm/pg-core";

import type { DataTableType, DataType } from "../types/table-data-type";
import { createDataColumns } from "../utils/create-data-columns";
import { lumpikTable } from "../utils/lumpik-table";
import { users } from "./users.table";

export const profiles = lumpikTable("profiles", {
  id: serial("id").primaryKey(),
  bio: varchar("name", { length: 500 }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  ...createDataColumns(),
});

export type Profile<T extends DataType = "select"> = DataTableType<
  typeof profiles,
  T
>;
