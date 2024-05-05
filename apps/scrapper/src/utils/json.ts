import fs from "node:fs/promises";
import path from "path";

import { logger } from "./logger";

const getRoot = () => {
  return path.resolve(__dirname, "../");
};

const getFilePath = (filename: string) => {
  return `${getRoot()}/${filename}.json`;
};

export const storeJson = async (filename: string, json: string) => {
  try {
    return await fs.writeFile(getFilePath(filename), json);
  } catch (error) {
    logger.error(error);

    throw new Error(`Error while storing ${filename}`);
  }
};

export const readJson = async <T>(filename: string) => {
  try {
    const data = await fs.readFile(getFilePath(filename), "utf-8");

    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    logger.error(error);

    throw new Error(`Error while reading ${filename}.json`);
  }
};
