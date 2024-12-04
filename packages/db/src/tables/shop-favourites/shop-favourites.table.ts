import { integer, primaryKey } from "drizzle-orm/pg-core";

import { lumpikTable } from "../../utils/lumpik-table";
import { shops } from "../shops/shops.table";
import { users } from "../users/users.table";

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
  (table) => [
    {
      pk: primaryKey({
        columns: [table.shopId, table.userId],
      }),
    },
  ],
);
