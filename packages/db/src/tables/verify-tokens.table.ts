import type { TypeOf } from "zod";
import { integer, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import type { DataType } from "../types/table-data-type";
import { lumpikTable } from "../utils/lumpik-table";
import { users } from "./users.table";

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

export const insertVerifyTokensSchema = createInsertSchema(verifyTokens);

export const selectVerifyTokensSchema = createSelectSchema(verifyTokens);

export type VerifyToken<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof insertVerifyTokensSchema>
  : TypeOf<typeof selectVerifyTokensSchema>;
