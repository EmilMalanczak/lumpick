import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import type { DataType, TableSchemaData } from "../../types/table-schema";

import { shops } from "./shops.table";

const base = createInsertSchema(shops, {
  hours: z.never(),
});

export const shopsSchema = {
  /**
   * Note: some weird stuff is happening here related to internal types of drizzle-zod
   * sometimes it displays error sometimes not with spread of base.
   * However this is required OTHERWISE every field will inherit the schema of 'hours' field
   */
  // @ts-ignore,
  insert: createInsertSchema(shops, {
    ...base,
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

type InsertUser = z.infer<typeof shopsSchema.insert>;
// type InsertUser = Shop<"insert">;
