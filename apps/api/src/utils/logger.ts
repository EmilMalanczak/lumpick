import pino from "pino";

export const logger = pino({
  level: "debug",
  redact: ["DATABASE_URL", "JWT_SECRET"],
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
