import { relations } from "drizzle-orm";

import { features, shopFeatures } from "../tables";

export const featuresRelations = relations(features, ({ many }) => ({
  features: many(shopFeatures),
}));
