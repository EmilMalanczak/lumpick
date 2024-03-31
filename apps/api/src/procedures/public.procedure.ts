import { t } from "../trpc";

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations
 */
export const publicProcedure = t.procedure;
