import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { shopFeatures } from "./shop-features.table";

export const shopFeaturesSchema = {
  insert: createInsertSchema(shopFeatures),
  select: createSelectSchema(shopFeatures),
  update: createUpdateSchema(shopFeatures),
};

export type ShopFeature<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof shopFeaturesSchema
>;
