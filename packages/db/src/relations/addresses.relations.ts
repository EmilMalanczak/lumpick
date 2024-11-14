import { relations } from "drizzle-orm";

import { shops } from "../tables";
import { addresses } from "../tables/addresses.table";

export const addressesRelations = relations(addresses, ({ one }) => ({
  features: one(shops),
}));
