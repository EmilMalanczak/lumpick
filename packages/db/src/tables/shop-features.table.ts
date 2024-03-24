import { integer, primaryKey } from "drizzle-orm/pg-core";

import type { DataTableType, DataType } from "../types/table-data-type";
import { lumpikTable } from "../utils/lumpik-table";
import { features } from "./features.table";
import { shops } from "./shops.table";

export const shopFeatures = lumpikTable(
  "shop_features",
  {
    shopId: integer("shop_id")
      .notNull()
      .references(() => shops.id),
    featureId: integer("feature_id")
      .notNull()
      .references(() => features.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.shopId, table.featureId],
    }),
  }),
);

export type ShopFeature<T extends DataType = "select"> = DataTableType<
  typeof shopFeatures,
  T
>;
