import type { TypeOf } from "zod";

import type { DataType } from "../../types/table-data-type";

import { createTableSchema } from "../../utils/create-table-schema";
import { users } from "./users.table";

export const usersSchema = createTableSchema(users, {
  insert: {
    id: (schema) => schema.id.positive(),
    email: (schema) => schema.email.email(),
  },
});

export type User<T extends DataType = "select"> = T extends "insert"
  ? TypeOf<typeof usersSchema.insert>
  : TypeOf<typeof usersSchema.select>;
