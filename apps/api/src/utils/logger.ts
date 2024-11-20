import { env } from "~config/env";
import { loggerConfig } from "~config/logger.config";
import pino from "pino";

export const logger = pino(loggerConfig[env.ENV]);
