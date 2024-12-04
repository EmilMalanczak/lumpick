import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";

import { createTableSchema } from "../../utils/create-table-schema";
import { shops } from "./shops.table";

export const shopsSchema = createTableSchema(shops);

export type Shop<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof shopsSchema.insert>
  : TypeOf<typeof shopsSchema.select>;
