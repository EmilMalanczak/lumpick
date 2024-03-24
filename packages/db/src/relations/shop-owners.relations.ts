import { relations } from "drizzle-orm";

import { shopOwners, shops, users } from "../tables";

export const shopOwnersRelations = relations(shopOwners, ({ many, one }) => ({
  shops: many(shops),
  user: one(users, {
    fields: [shopOwners.userId],
    references: [users.id],
  }),
}));
