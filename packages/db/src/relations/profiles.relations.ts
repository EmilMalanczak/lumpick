import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const profileRelations = relations(tables.profiles, ({ one }) => ({
  profile: one(tables.users, {
    fields: [tables.profiles.userId],
    references: [tables.users.id],
  }),
}));
