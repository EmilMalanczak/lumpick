import {
  index,
  integer,
  jsonb,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import type { DataTableType, DataType } from "../types/table-data-type";

import { createDataColumns } from "../utils/create-data-columns";
import { lumpikTable } from "../utils/lumpik-table";
import { shopOwners } from "./shop-owners.table";

type WeekHours = {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  from: string;
  to?: string;
  closed: boolean;
};

export const shops = lumpikTable(
  "shops",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).unique().notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    description: text("description").notNull(),
    url: text("url"),
    telephone: varchar("telephone", { length: 15 }),
    email: varchar("email", { length: 255 }),
    image: text("image"),
    addressId: integer("address_id").notNull(),
    hours: jsonb("hours").$type<WeekHours[]>().notNull(),
    facebookUrl: text("facebook_url"),
    instagramUrl: text("instagram_url"),
    ownerId: integer("owner_id")
      .notNull()
      .references(() => shopOwners.id),
    ...createDataColumns(),
  },
  (table) => [
    {
      nameIdx: index("name_idx")
        .on(table.name, table.slug)
        .with({ fillfactor: "70" }),
    },
  ],
);

export type Shop<T extends DataType = "select"> = DataTableType<
  typeof shops,
  T
>;
