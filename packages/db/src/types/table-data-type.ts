import type { InferInsertModel, InferSelectModel, Table } from "drizzle-orm";

export type DataType = "insert" | "select";

export type DataTableType<
  T extends Table,
  D extends DataType,
> = D extends "insert" ? InferInsertModel<T> : InferSelectModel<T>;
