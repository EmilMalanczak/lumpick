import { relations } from "drizzle-orm";

import { shops } from "../tables";
import { deliveries } from "../tables/deliveries.table";

export const deliveryRelations = relations(deliveries, ({ one }) => ({
  shop: one(shops, {
    fields: [deliveries.shopId],
    references: [shops.id],
  }),
}));
