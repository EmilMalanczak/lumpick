import { integer, primaryKey } from "drizzle-orm/pg-core";

import { lumpikTable } from "../../utils/lumpik-table";
import { features } from "../features/features.table";
import { shops } from "../shops/shops.table";

export const shopFeatures = lumpikTable(
  "shop_features",
  {
    shopId: integer("shop_id")
      .notNull()
      .references(() => shops.id, {
        onDelete: "cascade",
      }),
    featureId: integer("feature_id")
      .notNull()
      .references(() => features.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    {
      pk: primaryKey({
        columns: [table.shopId, table.featureId],
      }),
    },
  ],
);
