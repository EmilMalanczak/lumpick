import fs from "node:fs/promises";

import { logger } from "./logger";

export const storeJson = async (filename: string, json: string) => {
  try {
    logger.info(`Storing JSON in ${filename}.json`);

    await fs.writeFile(`${filename}.json`, json);

    logger.info(`JSON saved`);
  } catch (error) {
    logger.error(error);

    throw new Error(`Error while storing ${filename}`);
  }
};

export const readJson = async <T>(filename: string) => {
  try {
    const data = await fs.readFile(`${filename}.json`, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error(error);

    throw new Error(`Error while reading ${filename}.json`);
  }
};
