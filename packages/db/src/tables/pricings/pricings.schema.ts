import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";
import type { priceTypeEnum } from "./pricings.table";

import { createTableSchema } from "../../utils/create-table-schema";
import { pricings } from "./pricings.table";

export const pricingsSchema = createTableSchema(pricings);

export type Pricing<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof pricingsSchema.insert>
  : TypeOf<typeof pricingsSchema.select>;

export type PricingType = (typeof priceTypeEnum.enumValues)[number];
