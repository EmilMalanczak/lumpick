import { integer, primaryKey } from "drizzle-orm/pg-core";

import { lumpickTable } from "../../utils/lumpick-table";
import { shops } from "../shops/shops.table";
import { users } from "../users/users.table";

export const shopFavourites = lumpickTable(
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
