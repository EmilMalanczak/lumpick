import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";

import { createTableSchema } from "../../utils/create-table-schema";
import { addresses } from "./addresses.table";

export const addressesSchema = createTableSchema(addresses);

export type Address<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof addressesSchema.insert>
  : TypeOf<typeof addressesSchema.select>;
