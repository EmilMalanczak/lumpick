import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const shopOwnersRelations = relations(
  tables.shopOwners,
  ({ many, one }) => ({
    shops: many(tables.shops),
    user: one(tables.users, {
      fields: [tables.shopOwners.userId],
      references: [tables.users.id],
    }),
  }),
);
