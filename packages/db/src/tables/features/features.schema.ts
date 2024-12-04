import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";
import type { featuresTypeEnum } from "./features.table";

import { createTableSchema } from "../../utils/create-table-schema";
import { features } from "./features.table";

export const featuresSchema = createTableSchema(features);

export type Feature<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof featuresSchema.insert>
  : TypeOf<typeof featuresSchema.select>;

export type FeatureType = (typeof featuresTypeEnum.enumValues)[number];
