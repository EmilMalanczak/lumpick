import type { LoggerOptions } from "pino";

import { env } from "./env";

// Define configs here based on NODE_ENV = "development" | "testing" | "production"
export const loggerConfig: Record<string, LoggerOptions> = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss.l",
      },
    },
    level: "debug",
    redact: {
      paths: Object.keys(env),
      censor: "SECRET",
    },
  },
  production: {
    level: "info",
    redact: {
      paths: Object.keys(env),
      censor: "SECRET",
    },
    transport: {
      targets: [
        {
          target: "pino/file",
          level: "info",
          options: {
            destination: `../../logs/production.log`,
            mkdir: true,
          },
        },
      ],
    },
  },
  testing: {
    enabled: false,
  },
};
