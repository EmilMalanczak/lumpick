import { relations } from "drizzle-orm";

import { shopComments, shops } from "../tables";

export const shopCommentsRelations = relations(shopComments, ({ one }) => ({
  shop: one(shops, {
    fields: [shopComments.shopId],
    references: [shops.id],
  }),
}));
