import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";

import { createTableSchema } from "../../utils/create-table-schema";
import { shopFavourites } from "./shop-favourites.table";

export const shopFavouritesSchema = createTableSchema(shopFavourites);

export type ShopFavourite<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof shopFavouritesSchema.insert>
  : TypeOf<typeof shopFavouritesSchema.select>;
