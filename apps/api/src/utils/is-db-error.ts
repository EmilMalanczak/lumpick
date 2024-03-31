import postgres from "postgres";

export const isDbError = (err: unknown): err is postgres.PostgresError =>
  err instanceof postgres.PostgresError;
