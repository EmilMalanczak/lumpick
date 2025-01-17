// src/index.ts
import { isMainThread } from "node:worker_threads";
import { select } from "@inquirer/prompts";

import { ScrappingController } from "./modules/scrapping/scraping.controller";
import { ScrappingService } from "./modules/scrapping/services/scraping.service";
import { SitemapService } from "./modules/scrapping/services/sitemap.service";
import { PromptService } from "./modules/shared/prompt.service";
import { StorageService } from "./modules/shared/storage.service";
import { ShopTransformationController } from "./modules/transformation/shop-transformation.controller";
import { logger } from "./utils/logger";

void (async () => {
  if (!isMainThread) return;

  try {
    const storageService = new StorageService();
    const scrappingService = new ScrappingService({
      storageService,
    });

    const promptService = new PromptService();
    const sitemapService = new SitemapService();

    const scrapingController = new ScrappingController({
      scrappingService,
      promptService,
      sitemapService,
    });

    const shopTransformationController = new ShopTransformationController({
      storageService,
    });

    const routes = [
      {
        name: "Scrap shops",
        value: "SCRAPPER",
        handler: async () => {
          const handler =
            await scrapingController.selectScrapingActionHandler();

          await handler();
        },
      },
      {
        name: "Transform shops data",
        value: "TRANSFORM_SHOPS",
        handler: async () => {
          const handler =
            shopTransformationController.selectTransformHandler();
          throw new Error("Not implemented");
        },
      },
    ];

    const selectedAction = await promptService.selectAction(routes);

    const action = routes.find((a) => a.value === selectedAction);

    if (action) {
      await action.handler();
    } else {
      throw new Error("Action not found");
    }

    process.exit(0);
  } catch (error) {
    logger.error("Application failed:", (error as Error).message);

    process.exit(1);
  }
})();
