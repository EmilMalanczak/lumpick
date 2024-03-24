import { relations } from "drizzle-orm";

import { profiles, users } from "../tables";

export const userRelations = relations(profiles, ({ one }) => ({
  profile: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));
