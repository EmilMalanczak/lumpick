import { relations } from "drizzle-orm";

import { features, shopFeatures, shops } from "../tables";

export const shopFeaturesRelations = relations(shopFeatures, ({ one }) => ({
  feature: one(features, {
    fields: [shopFeatures.featureId],
    references: [features.id],
  }),
  shop: one(shops, {
    fields: [shopFeatures.shopId],
    references: [shops.id],
  }),
}));
