import { integer, serial, smallint, varchar } from "drizzle-orm/pg-core";

import { createDataColumns } from "../../utils/create-data-columns";
import { lumpickTable } from "../../utils/lumpick-table";
import { shops } from "../shops/shops.table";

export const shopComments = lumpickTable("shop_comments", {
  id: serial("id").primaryKey(),
  rate: smallint("rate").notNull(),
  comment: varchar("comment", { length: 255 }).notNull(),
  shopId: integer("shop_id")
    .notNull()
    .references(() => shops.id, {
      onDelete: "cascade",
    }),
  ...createDataColumns(),
});
