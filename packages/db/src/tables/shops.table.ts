import { integer, serial, text, varchar } from "drizzle-orm/pg-core";

import type { DataTableType, DataType } from "../types/table-data-type";
import { createDataColumns } from "../utils/create-data-columns";
import { lumpikTable } from "../utils/lumpik-table";
import { shopOwners } from "./shop-owners.table";

export const shops = lumpikTable("shops", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  url: text("url"),
  telephone: varchar("telephone", { length: 63 }),
  email: varchar("email", { length: 255 }),
  avatar: text("avatar"),
  addressId: integer("address_id").notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => shopOwners.id),
  ...createDataColumns(),
});

export type Shop<T extends DataType = "select"> = DataTableType<
  typeof shops,
  T
>;
