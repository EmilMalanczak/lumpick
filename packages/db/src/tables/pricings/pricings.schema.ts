import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { pricings } from "./pricings.table";

export const pricingsSchema = {
  insert: createInsertSchema(pricings),
  select: createSelectSchema(pricings),
  update: createUpdateSchema(pricings),
};

export type ShopComment<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof pricingsSchema
>;
