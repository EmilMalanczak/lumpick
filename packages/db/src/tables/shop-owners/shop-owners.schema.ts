import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";

import { createTableSchema } from "../../utils/create-table-schema";
import { shopOwners } from "./shop-owners.table";

export const shopOwnersSchema = createTableSchema(shopOwners);

export type ShopOwner<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof shopOwnersSchema.insert>
  : TypeOf<typeof shopOwnersSchema.select>;
