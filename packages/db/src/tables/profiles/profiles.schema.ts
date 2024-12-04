import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";

import { createTableSchema } from "../../utils/create-table-schema";
import { profiles } from "./profiles.table";

export const profilesSchema = createTableSchema(profiles);

export type Profile<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof profilesSchema.insert>
  : TypeOf<typeof profilesSchema.select>;
