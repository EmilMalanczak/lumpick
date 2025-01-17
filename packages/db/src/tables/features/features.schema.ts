import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { features } from "./features.table";

export const featuresSchema = {
  insert: createInsertSchema(features),
  select: createSelectSchema(features),
  update: createUpdateSchema(features),
};

export type ShopComment<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof featuresSchema
>;
