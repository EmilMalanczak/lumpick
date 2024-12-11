import { integer, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { lumpickTable } from "../../utils/lumpick-table";
import { users } from "../users/users.table";

export const verifyTokens = lumpickTable("verify_tokens", {
  id: uuid("id").primaryKey(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
});
