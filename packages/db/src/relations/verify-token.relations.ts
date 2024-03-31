import { relations } from "drizzle-orm";

import { users } from "../tables";
import { verifyTokens } from "../tables/verify-tokens.table";

export const verifyTokenRelations = relations(verifyTokens, ({ one }) => ({
  user: one(users, {
    fields: [verifyTokens.userId],
    references: [users.id],
  }),
}));
