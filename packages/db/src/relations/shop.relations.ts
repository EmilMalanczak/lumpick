import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const shopRelations = relations(tables.shops, ({ one, many }) => ({
  owner: one(tables.shopOwners, {
    fields: [tables.shops.ownerId],
    references: [tables.shopOwners.id],
  }),
  pricing: one(tables.pricings, {
    fields: [tables.shops.id],
    references: [tables.pricings.shopId],
  }),
  features: many(tables.shopFeatures),
  comments: many(tables.shopComments),
  address: one(tables.addresses, {
    fields: [tables.shops.addressId],
    references: [tables.addresses.id],
  }),
}));
