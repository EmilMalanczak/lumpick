import type { Table } from "drizzle-orm";
import type { Refine } from "drizzle-zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

type CreateTableSchemaOptions<TTable extends Table> = {
  insert?: Refine<TTable, "insert">;
  select?: Refine<TTable, "select">;
};

export const createTableSchema = <TTable extends Table>(
  table: TTable,
  options?: CreateTableSchemaOptions<TTable>,
) => ({
  // Note: this is simplest way to pass partial options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  select: createSelectSchema(table, options?.select ?? ({} as any)),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
  insert: createInsertSchema(table, options?.insert ?? ({} as any)),
});
