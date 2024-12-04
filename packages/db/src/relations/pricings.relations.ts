import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const pricingsRelations = relations(tables.pricings, ({ one }) => ({
  shop: one(tables.shops, {
    fields: [tables.pricings.shopId],
    references: [tables.shops.id],
  }),
}));
