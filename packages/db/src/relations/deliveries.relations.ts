import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const deliveryRelations = relations(tables.deliveries, ({ one }) => ({
  shop: one(tables.shops, {
    fields: [tables.deliveries.shopId],
    references: [tables.shops.id],
  }),
}));
