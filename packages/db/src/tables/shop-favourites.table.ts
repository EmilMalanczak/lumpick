import { integer, primaryKey } from "drizzle-orm/pg-core";

import type { DataTableType, DataType } from "../types/table-data-type";
import { lumpikTable } from "../utils/lumpik-table";
import { shops } from "./shops.table";
import { users } from "./users.table";

export const shopFavourites = lumpikTable(
  "shop-favourites",
  {
    shopId: integer("shop_id")
      .notNull()
      .references(() => shops.id, {
        onDelete: "cascade",
      }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.shopId, table.userId],
    }),
  }),
);

export type ShopFavourite<T extends DataType = "select"> = DataTableType<
  typeof shopFavourites,
  T
>;
