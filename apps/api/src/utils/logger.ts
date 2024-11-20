import pino from "pino";

import { env } from "../config/env";
import { loggerConfig } from "../config/logger.config";

export const logger = pino(loggerConfig[env.ENV]);
