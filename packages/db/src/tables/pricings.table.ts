import { integer, jsonb, pgEnum, serial, varchar } from "drizzle-orm/pg-core";

import type { DataTableType, DataType } from "../types/table-data-type";
import { createDataColumns } from "../utils/create-data-columns";
import { lumpikTable } from "../utils/lumpik-table";
import { shops } from "./shops.table";

type Price = {
  value: number;
  label: string;
};

export const pricingsTypeEnum = pgEnum("pricing_type", [
  "weight",
  "percentage",
  "piece",
]);

export const pricings = lumpikTable("pricings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  prices: jsonb("prices").$type<Price[]>().notNull(),
  type: pricingsTypeEnum("type").notNull(),
  currency: varchar("currency", { length: 4 }).notNull(),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id, {
      onDelete: "cascade",
    }),
  ...createDataColumns(),
});

export type Pricing<T extends DataType = "select"> = DataTableType<
  typeof pricings,
  T
>;

const { enumValues } = pricingsTypeEnum;

export type PricingType = (typeof enumValues)[number];
