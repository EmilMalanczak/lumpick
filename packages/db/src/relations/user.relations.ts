import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const userRelations = relations(tables.users, ({ one }) => ({
  profile: one(tables.profiles, {
    fields: [tables.users.id],
    references: [tables.profiles.userId],
  }),
  verifyToken: one(tables.verifyTokens, {
    fields: [tables.users.id],
    references: [tables.verifyTokens.userId],
  }),
}));
