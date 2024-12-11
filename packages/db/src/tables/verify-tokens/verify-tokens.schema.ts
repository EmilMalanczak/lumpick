import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { verifyTokens } from "./verify-tokens.table";

export const verifyTokensSchema = {
  insert: createInsertSchema(verifyTokens),
  select: createSelectSchema(verifyTokens),
  update: createUpdateSchema(verifyTokens),
};

export type VerifyToken<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof verifyTokensSchema
>;
