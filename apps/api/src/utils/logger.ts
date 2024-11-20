import pino from "pino";

import { env } from "../plugins/config/env";
import { loggerConfig } from "../plugins/config/logger.config";

export const logger = pino(loggerConfig[env.ENV]);
