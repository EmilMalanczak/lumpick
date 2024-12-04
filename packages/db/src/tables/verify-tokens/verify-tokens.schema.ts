import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";

import { createTableSchema } from "../../utils/create-table-schema";
import { verifyTokens } from "./verify-tokens.table";

export const verifyTokensSchema = createTableSchema(verifyTokens);

export type VerifyToken<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof verifyTokensSchema.insert>
  : TypeOf<typeof verifyTokensSchema.select>;
