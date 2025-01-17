import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { shopFavourites } from "./shop-favourites.table";

export const shopFavouritesSchema = {
  insert: createInsertSchema(shopFavourites),
  select: createSelectSchema(shopFavourites),
  update: createUpdateSchema(shopFavourites),
};

export type ShopFavourite<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof shopFavouritesSchema
>;
