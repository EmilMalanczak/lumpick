// src/index.ts
import { isMainThread } from "node:worker_threads";
import { select } from "@inquirer/prompts";

import { createScrapingController } from "./modules/scraping/scraping.controller";
import { createPromptService } from "./modules/scraping/services/prompt.service";
import { createScrapingService } from "./modules/scraping/services/scraping.service";
import { createSitemapService } from "./modules/scraping/services/sitemap.service";
import { createStorageService } from "./modules/scraping/services/storage.service";
import { logger } from "./utils/logger";

void (async () => {
  if (!isMainThread) return;

  try {
    const storageService = createStorageService();

    const scrapingService = createScrapingService({
      storageService,
    });
    const promptService = createPromptService();
    const sitemapService = createSitemapService();

    // Initialize scraping controller
    const scrapingController = createScrapingController({
      scrapingService,
      promptService,
      sitemapService,
    });

    // Define available actions
    const actions = [
      {
        name: "Scrap single store",
        type: "SINGLE_SCRAP",
        handler: async () => {
          const shop = await scrapingController.scrapSingleShop();

          if (!shop) {
            logger.error("No shop data returned");
            return;
          }

          logger.info("Single shop scraping completed", {
            shopName: shop.metadata.name,
          });
        },
      },
      {
        name: "Full scrap",
        type: "FULL_SCRAP",
        handler: async () => {
          const { shops, failedShops } =
            await scrapingController.scrapMultipleShops();

          logger.info("Full scraping completed", {
            success: shops.length,
            failed: failedShops.length,
          });
        },
      },
    ];

    // Get user selection
    const selectedAction = await select({
      message: "What do you want to do?",
      choices: actions.map(({ name, type }) => ({ name, value: type })),
    });

    // Execute selected action
    const action = actions.find((a) => a.type === selectedAction);
    if (!action) {
      throw new Error("Invalid action selected");
    }

    await action.handler();

    process.exit(0);
  } catch (error) {
    logger.error("Application failed:", (error as Error).message);

    process.exit(1);
  }
})();
