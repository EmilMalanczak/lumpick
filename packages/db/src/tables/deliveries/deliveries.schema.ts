import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { deliveries } from "./deliveries.table";

export const deliveriesSchema = {
  insert: createInsertSchema(deliveries),
  select: createSelectSchema(deliveries),
  update: createUpdateSchema(deliveries),
};

export type ShopComment<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof deliveriesSchema
>;
