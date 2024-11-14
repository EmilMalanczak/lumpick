import { select } from "@inquirer/prompts";

import {
  scrapShops,
  scrapSingleShop,
} from "./src/controllers/scrapping.controller";
import { readScrappedShops } from "./src/services/dump.service";
import { logger } from "./src/utils/logger";

const SCRAP_TYPES = {
  full: "Full",
  single: "Single",
  read: "Read",
};

void (async () => {
  try {
    const action = await select({
      message: "What do you want to do?",
      choices: [
        { name: "Scrap single store", value: SCRAP_TYPES.single },
        { name: "Full scrap", value: SCRAP_TYPES.full },
        { name: "Read data", value: SCRAP_TYPES.read },
      ],
    });

    switch (action) {
      case SCRAP_TYPES.full: {
        // TODO: add dto transformation
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const shops = await scrapShops();

        break;
      }

      case SCRAP_TYPES.single: {
        // TODO: add dto transformation
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const shop = await scrapSingleShop();
        break;
      }

      case SCRAP_TYPES.read: {
        const shops = await readScrappedShops();

        shops.forEach(({ shopLinkedDataJson, shopPrices }) => {
          console.log(`Shop: ${shopLinkedDataJson.name}`);
          console.log(shopPrices);
        });

        break;
      }

      default:
        throw new Error("Invalid action");
    }

    process.exit(0);
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
})();
