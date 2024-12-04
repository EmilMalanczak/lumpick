import { integer, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { lumpikTable } from "../../utils/lumpik-table";
import { users } from "../users/users.table";

export const verifyTokens = lumpikTable("verify_tokens", {
  id: uuid("id").primaryKey(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
});
