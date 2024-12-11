import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { shopComments } from "./shop-comments.table";

export const shopCommentsSchema = {
  insert: createInsertSchema(shopComments),
  select: createSelectSchema(shopComments),
  update: createUpdateSchema(shopComments),
};

export type ShopComment<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof shopCommentsSchema
>;
