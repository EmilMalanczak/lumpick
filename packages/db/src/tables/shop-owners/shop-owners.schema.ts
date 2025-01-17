import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { shopOwners } from "./shop-owners.table";

export const shopOwnersSchema = {
  insert: createInsertSchema(shopOwners),
  select: createSelectSchema(shopOwners),
  update: createUpdateSchema(shopOwners),
};

export type ShopOwner<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof shopOwnersSchema
>;
