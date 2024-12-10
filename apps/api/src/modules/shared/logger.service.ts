/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LogFn, Logger } from "pino";
import pino from "pino";

import { loggerConfig } from "~config/logger.config";

export class LoggerService {
  private logger: Logger;

  constructor(env: string) {
    this.logger = pino(loggerConfig[env]);
  }

  // Note: type overload was required to make this work for TS
  log<T extends object>(obj: T, msg?: string, ...args: any[]): void;
  log(obj: unknown, msg?: string, ...args: any[]): void;
  log(msg: string, ...args: any[]): void;
  public log(...params: Parameters<LogFn>) {
    return this.logger.info(...params);
  }

  error<T extends object>(obj: T, msg?: string, ...args: any[]): void;
  error(obj: unknown, msg?: string, ...args: any[]): void;
  error(msg: string, ...args: any[]): void;
  public error(...params: Parameters<LogFn>) {
    return this.logger.error(...params);
  }
}
