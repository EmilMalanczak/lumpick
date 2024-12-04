import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";

import { createTableSchema } from "../../utils/create-table-schema";
import { shopFeatures } from "./shop-features.table";

export const shopFeaturesSchema = createTableSchema(shopFeatures);

export type ShopFeature<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof shopFeaturesSchema.insert>
  : TypeOf<typeof shopFeaturesSchema.select>;
