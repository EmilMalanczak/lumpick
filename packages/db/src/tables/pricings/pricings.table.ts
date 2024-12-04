import { decimal, integer, pgEnum, serial, varchar } from "drizzle-orm/pg-core";

import { createDataColumns } from "../../utils/create-data-columns";
import { lumpikTable } from "../../utils/lumpik-table";
import { shops } from "../shops/shops.table";

export const dayOfWeekEnum = pgEnum("day_of_week", [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

export const weekTypeEnum = pgEnum("week_type", [
  "WEEK_1",
  "WEEK_2",
  "WEEK_3",
  "WEEK_4",
]);

export const priceTypeEnum = pgEnum("price_type", [
  "per_weight", // e.g., "55 zł/kg"
  "per_piece", // e.g., "5 zł/szt"
  "percentage_off", // e.g., "-30%"
  "custom",
]);

export const pricings = lumpikTable("pricings", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id, {
      onDelete: "cascade",
    }),
  day: dayOfWeekEnum("day").notNull(),
  week: weekTypeEnum("week").notNull().default("WEEK_1"),
  type: priceTypeEnum("price_type").notNull(),
  currency: varchar("currency", { length: 5 }),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  percentageOff: decimal("percentage_off", { precision: 5, scale: 2 }),
  description: varchar("description", { length: 500 }),
  ...createDataColumns(),
});
