import { timestamp } from "drizzle-orm/pg-core";

export const createDataColumns = () => ({
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
