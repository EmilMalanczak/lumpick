import { relations } from "drizzle-orm";

import { tables } from "../tables";

export const featuresRelations = relations(tables.features, ({ many }) => ({
  features: many(tables.shopFeatures),
}));
