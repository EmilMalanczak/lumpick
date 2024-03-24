import { relations } from "drizzle-orm";

import { profiles, users } from "../tables";

export const userRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
}));
