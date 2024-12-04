import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const addressesRelations = relations(tables.addresses, ({ one }) => ({
  features: one(tables.shops),
}));
