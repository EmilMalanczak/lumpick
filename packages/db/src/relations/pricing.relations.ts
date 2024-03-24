import { relations } from "drizzle-orm";

import { pricings, shops } from "../tables";

export const pricingRelations = relations(pricings, ({ one }) => ({
  shop: one(shops, {
    fields: [pricings.shopId],
    references: [shops.id],
  }),
}));
