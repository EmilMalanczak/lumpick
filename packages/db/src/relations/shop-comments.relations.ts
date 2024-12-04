import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const shopCommentsRelations = relations(
  tables.shopComments,
  ({ one }) => ({
    shop: one(tables.shops, {
      fields: [tables.shopComments.shopId],
      references: [tables.shops.id],
    }),
  }),
);
