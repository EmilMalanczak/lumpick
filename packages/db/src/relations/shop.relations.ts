import { relations } from "drizzle-orm";

import {
  pricings,
  shopComments,
  shopFeatures,
  shopOwners,
  shops,
} from "../tables";
import { addresses } from "../tables/addresses.table";

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
  address: one(addresses, {
    fields: [shops.addressId],
    references: [addresses.id],
  }),
}));
