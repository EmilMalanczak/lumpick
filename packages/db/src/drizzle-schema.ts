import * as relations from "./relations";
import * as tables from "./tables";

export const __drizzleSchema = { ...tables, ...relations };
