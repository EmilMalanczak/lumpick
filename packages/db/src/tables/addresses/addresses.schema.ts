import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { addresses } from "./addresses.table";

export const addressesSchema = {
  insert: createInsertSchema(addresses),
  select: createSelectSchema(addresses),
  update: createUpdateSchema(addresses),
};

export type ShopComment<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof addressesSchema
>;
