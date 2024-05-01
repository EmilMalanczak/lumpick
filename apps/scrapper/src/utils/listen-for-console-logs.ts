import type { ConsoleMessage, JSHandle, Page } from "puppeteer";

import { logger } from "./logger";

export const listenPageConsole = (page: Page) => {
  const logElem = async (msg: ConsoleMessage, val: JSHandle<unknown>) => {
    logger.info(`CONSOLE ${msg.type()}: `, await val.jsonValue());
  };

  page.on("console", (message: ConsoleMessage) => {
    const args = message.args();

    args.forEach((value) => {
      void logElem(message, value);
    });
  });
};
