import { pgTableCreator } from "drizzle-orm/pg-core";

export const TABLE_PREFIX = "lumpick_";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const lumpickTable = pgTableCreator((name) => `${TABLE_PREFIX}${name}`);
