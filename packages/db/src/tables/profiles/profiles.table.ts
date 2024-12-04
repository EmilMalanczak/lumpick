import { integer, serial, varchar } from "drizzle-orm/pg-core";

import { createDataColumns } from "../../utils/create-data-columns";
import { lumpikTable } from "../../utils/lumpik-table";
import { users } from "../users/users.table";

export const profiles = lumpikTable("profiles", {
  id: serial("id").primaryKey(),
  bio: varchar("name", { length: 500 }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  ...createDataColumns(),
});
