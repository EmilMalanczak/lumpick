import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const shopFeaturesRelations = relations(
  tables.shopFeatures,
  ({ one }) => ({
    feature: one(tables.features, {
      fields: [tables.shopFeatures.featureId],
      references: [tables.features.id],
    }),
    shop: one(tables.shops, {
      fields: [tables.shopFeatures.shopId],
      references: [tables.shops.id],
    }),
  }),
);
