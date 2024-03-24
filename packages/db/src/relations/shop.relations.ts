import { relations } from "drizzle-orm";

import {
  pricings,
  shopComments,
  shopFeatures,
  shopOwners,
  shops,
} from "../tables";

export const shopRelations = relations(shops, ({ one, many }) => ({
  owner: one(shopOwners, {
    fields: [shops.ownerId],
    references: [shopOwners.id],
  }),
  pricing: one(pricings, {
    fields: [shops.id], 
    references: [pricings.shopId],
  }),
  features: many(shopFeatures),
  comments: many(shopComments),
}));
