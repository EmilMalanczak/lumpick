import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { profiles } from "./profiles.table";

export const profilesSchema = {
  insert: createInsertSchema(profiles),
  select: createSelectSchema(profiles),
  update: createUpdateSchema(profiles),
};

export type ShopComment<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof profilesSchema
>;
