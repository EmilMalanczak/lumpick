import type { TypeOf } from "zod";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import { DataType, TableSchemaData } from "../../types/table-schema";
import { shops } from "./shops.table";

export const shopsSchema = {
  insert: createInsertSchema(shops, {
    hours: z.array(
      z.object({
        day: z.enum([
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ]),
        from: z.string(),
        to: z.string().optional(),
        closed: z.boolean(),
      }),
    ),
  }),
  select: createSelectSchema(shops),
  update: createUpdateSchema(shops),
};

export type Shop<T extends DataType = "select"> = TableSchemaData<
  T,
  typeof shopsSchema
>;
