import { boolean, integer, serial } from "drizzle-orm/pg-core";

import { createDataColumns } from "../../utils/create-data-columns";
import { lumpikTable } from "../../utils/lumpik-table";
import { users } from "../users/users.table";

export const shopOwners = lumpikTable("shop_owners", {
  id: serial("id").primaryKey(),
  verified: boolean("verified").default(false),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  ...createDataColumns(),
});
