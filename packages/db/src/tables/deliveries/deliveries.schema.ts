import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";

import { createTableSchema } from "../../utils/create-table-schema";
import { deliveries } from "./deliveries.table";

export const deliveriesSchema = createTableSchema(deliveries);

export type Delivery<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof deliveriesSchema.insert>
  : TypeOf<typeof deliveriesSchema.select>;
