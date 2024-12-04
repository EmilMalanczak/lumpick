import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";

import { createTableSchema } from "../../utils/create-table-schema";
import { shopComments } from "./shop-comments.table";

export const shopCommentsSchema = createTableSchema(shopComments);

export type ShopComment<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof shopCommentsSchema.insert>
  : TypeOf<typeof shopCommentsSchema.select>;
