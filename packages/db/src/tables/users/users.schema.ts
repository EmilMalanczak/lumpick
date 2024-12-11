import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { users } from "./users.table";

export const usersSchema = {
  insert: createInsertSchema(users, {
    id: (schema) => schema.positive(),
    email: (schema) => schema.email(),
  }),
  select: createSelectSchema(users),
  update: createUpdateSchema(users),
};

export type User<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof usersSchema
>;
