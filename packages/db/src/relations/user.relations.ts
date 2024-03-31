import { relations } from "drizzle-orm";

import { profiles, users, verifyTokens } from "../tables";

export const userRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  verifyToken: one(verifyTokens, {
    fields: [users.id],
    references: [verifyTokens.userId],
  }),
}));
