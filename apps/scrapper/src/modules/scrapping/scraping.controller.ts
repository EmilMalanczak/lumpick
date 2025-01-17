import { availableParallelism } from "node:os";

import { logger } from "~/utils/logger";
import { withTerminalLoader } from "~utils/with-terminal-loading";

import type { PromptService } from "../shared/prompt.service";
import type { ScrappingService } from "./services/scraping.service";
import type { SitemapService } from "./services/sitemap.service";

type ScrapingControllerDependencies = {
  scrappingService: ScrappingService;
  sitemapService: SitemapService;
  promptService: PromptService;
};

export class ScrappingController {
  private scrappingService: ScrappingService;
  private sitemapService: SitemapService;
  private promptService: PromptService;

  constructor({
    scrappingService,
    sitemapService,
    promptService,
  }: ScrapingControllerDependencies) {
    this.scrappingService = scrappingService;
    this.sitemapService = sitemapService;
    this.promptService = promptService;
  }

  private async scrapMultipleShops() {
    const shouldUpdateUrls = await this.promptService.confirmAction(
      "Do you want to update the shop urls?",
      false,
    );

    const urls = await withTerminalLoader(
      async () => {
        const getSitemaps = shouldUpdateUrls
          ? this.sitemapService.updateUrls
          : this.sitemapService.getSavedUrls;

        const urlSitemaps = await getSitemaps();

        return urlSitemaps.map(({ url }) => url);
      },
      shouldUpdateUrls ? "Fetching urls" : "Loading saved urls",
    );

    if (!urls?.length) {
      throw new Error("No shops to scrap");
    }

    // Get thread count from user
    const maxThreads = Math.min(availableParallelism(), 5);
    const threadCount = await this.promptService.getAmount(
      `How many threads should be created? (max ${maxThreads})`,
      {
        validate: (value) =>
          value > maxThreads
            ? `You must provide a number in range of 1-${maxThreads}`
            : true,
      },
    );
    const shopsLimit = await this.promptService.getAmount(
      `How many shops do you want to scrap? (-1 for all) (max ${urls.length})`,
      {
        defaultValue: -1,
        validate: (value) =>
          value > maxThreads
            ? `You must provide a number in range of 1-${urls.length + 1} or -1 for all`
            : true,
      },
    );

    const urlsToScrap = urls.slice(0, shopsLimit);

    return await this.scrappingService.scrapeShops(urlsToScrap, threadCount);
  }

  private async scrapSingleShop() {
    const shopUrl = await this.promptService.getUrl();

    return await this.scrappingService.scrapeShop(shopUrl);
  }

  public async selectScrapingActionHandler() {
    // Define available actions
    const actions = [
      {
        name: "Scrap single store",
        type: "SINGLE_SCRAP",
        handler: async () => {
          const shop = await this.scrapSingleShop();

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
          await this.scrapMultipleShops();

          logger.info("Full scraping completed");
        },
      },
    ];

    // Get user selection
    const selectedAction = await this.promptService.selectAction(
      actions.map(({ name, type }) => ({ name, value: type })),
    );

    // Execute selected action
    const action = actions.find((a) => a.type === selectedAction);

    // This is a guard clause
    if (!action) {
      throw new Error("Invalid action selected");
    }

    return action.handler;
  }
}
