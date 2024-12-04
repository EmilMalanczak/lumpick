import { integer, numeric, serial, varchar } from "drizzle-orm/pg-core";

import { createDataColumns } from "../../utils/create-data-columns";
import { lumpikTable } from "../../utils/lumpik-table";
import { shops } from "../shops/shops.table";

export const addresses = lumpikTable("addresses", {
  id: serial("id").primaryKey(),
  longitude: numeric("longitude", { precision: 9, scale: 6 }),
  latitude: numeric("latitude", { precision: 8, scale: 6 }),
  street: varchar("street", { length: 255 }),
  city: varchar("city", { length: 63 }),
  country: varchar("country", { length: 63 }),
  postcode: varchar("postcode", { length: 63 }),
  shopId: integer("shop_id").references(() => shops.id),
  googleMapsLink: varchar("google_maps_link", { length: 255 }),
  ...createDataColumns(),
});
