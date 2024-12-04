import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const verifyTokenRelations = relations(
  tables.verifyTokens,
  ({ one }) => ({
    user: one(tables.users, {
      fields: [tables.verifyTokens.userId],
      references: [tables.users.id],
    }),
  }),
);
