/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { promises as fs } from "fs";
import { join, parse, resolve } from "path";

import type { ScrapedShop } from "~/modules/scraping/scraping.types";
import { logger } from "~/utils/logger";
import { getRoot } from "~/utils/storage";

const extractContactPoints = async () => {
  try {
    const files = await fs.readdir(`${resolve(getRoot(), "../")}/dump/shops`);

    const contacts = Object.fromEntries(
      await Promise.all(
        files
          .filter((file) => file.endsWith(".json"))
          .map(async (file) => {
            try {
              const filePath = join(
                `${resolve(getRoot(), "../")}/dump/shops`,
                file,
              );
              const fileContent = await fs.readFile(filePath, "utf8");
              const data = JSON.parse(fileContent) as ScrapedShop;
              const fileName = parse(file).name;

              if (data.prices.length === 0 || data?.deliveries.length === 0) {
                return null;
              }

              return [
                fileName,
                {
                  prices: data?.prices,
                  // hours: data?.hours,
                  deliveries: data?.deliveries,
                },
              ];
            } catch (error) {
              logger.error(`❌ Error processing ${file}:`, error);
              return null;
            }
          }),
      ).then((results) => results.filter((result) => result !== null)),
    );

    await fs.writeFile(
      `${resolve(getRoot(), "../")}/dump/shops-data.json`,
      JSON.stringify(contacts, null, 2),
      "utf8",
    );

    logger.info("✅ Successfully extracted contact points to /shops-data.json");
  } catch (error) {
    logger.error("❌ Error:", error);
    process.exit(1);
  }
};

// Run the script
void extractContactPoints();
