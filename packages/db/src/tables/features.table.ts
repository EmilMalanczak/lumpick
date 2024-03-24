import { pgEnum, serial, varchar } from "drizzle-orm/pg-core";

import type { DataTableType, DataType } from "../types/table-data-type";
import { lumpikTable } from "../utils/lumpik-table";

export const featuresTypeEnum = pgEnum("shop_features_type", [
  "assortment",
  "payment",
  "other",
]);

export const features = lumpikTable("features", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: featuresTypeEnum("type").notNull(),
});

export type Feature<T extends DataType = "select"> = DataTableType<
  typeof features,
  T
>;

const { enumValues } = featuresTypeEnum;

export type FeatureType = (typeof enumValues)[number];
