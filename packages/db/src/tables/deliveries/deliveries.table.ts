import {
  boolean,
  integer,
  interval,
  pgEnum,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

import { createDataColumns } from "../../utils/create-data-columns";
import { lumpickTable } from "../../utils/lumpick-table";
import { shops } from "../shops/shops.table";

export const deliveryTypeEnum = pgEnum("delivery_type", [
  "general", // Regular delivery with mixed items
  "shoes", // Only shoes
  "clothes", // Only clothes
  "accessories", // Only accessories
  "seasonal", // Seasonal items
  "premium", // Premium/special items
]);

export const deliveries = lumpickTable("deliveries", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id),
  deliveryType: deliveryTypeEnum("delivery_type").notNull().default("general"),
  isPeriodic: boolean("is_periodic").notNull().default(false),
  repeatInterval: interval("repeat_interval"),
  deliveryDuration: integer("delivery_duration"),
  nextDelivery: timestamp("next_delivery").notNull(),
  ...createDataColumns(),
});
