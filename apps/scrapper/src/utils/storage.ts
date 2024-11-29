import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { logger } from "./logger";

export const getRoot = () => {
  const dir = path.dirname(fileURLToPath(import.meta.url));

  return path.resolve(dir, "../");
};

export const getFilePath = (
  filename: string,
  { addSuffix = true }: { addSuffix?: boolean } = {},
) => {
  return `${getRoot()}/${filename}${addSuffix ? ".json" : ""}`;
};

export const storeJson = async (filename: string, json: string) => {
  try {
    const filePath = getFilePath(filename);
    const dir = path.dirname(filePath);

    // Ensure the directory exists
    await fs.mkdir(dir, { recursive: true });

    // Write the file
    return await fs.writeFile(filePath, json);
  } catch (error) {
    logger.error(error);

    throw new Error(`Error while storing ${filename}`);
  }
};

export const readJson = async <T>(
  filename: string,
  { addSuffix = true }: { addSuffix?: boolean } = {},
) => {
  try {
    const data = await fs.readFile(
      getFilePath(filename, { addSuffix }),
      "utf-8",
    );

    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    logger.error(error);

    throw new Error(
      `Error while reading ${filename}${addSuffix ? ".json" : ""}`,
    );
  }
};
