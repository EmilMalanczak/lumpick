import { boolean, integer, serial } from "drizzle-orm/pg-core";

import type { DataTableType, DataType } from "../types/table-data-type";
import { createDataColumns } from "../utils/create-data-columns";
import { lumpikTable } from "../utils/lumpik-table";
import { users } from "./users.table";

export const shopOwners = lumpikTable("shop_owners", {
  id: serial("id").primaryKey(),
  verified: boolean("verified").default(false),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  ...createDataColumns(),
});

export type ShopOwner<T extends DataType = "select"> = DataTableType<
  typeof shopOwners,
  T
>;
