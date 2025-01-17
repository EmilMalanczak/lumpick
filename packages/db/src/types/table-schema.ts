import type { z } from "zod";

export type DataType = "insert" | "select" | "update";

/**
 * TODO: back to this when drizzle-zod gets adjusted
 * due to functions overload there is not way to infer parameters
 * (because only function interfaces are exported)
 * temporary exporting just the type to preserve the API
 */
type TableSchema = Record<DataType, z.ZodType>;

export type TableSchemaData<
  TType extends DataType,
  TSchema extends TableSchema,
> = z.infer<
  TType extends "insert"
    ? TSchema["insert"]
    : TType extends "update"
      ? TSchema["update"]
      : TSchema["select"]
>;
