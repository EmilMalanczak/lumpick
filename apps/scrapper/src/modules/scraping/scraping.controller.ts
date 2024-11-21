import { withTerminalLoader } from "~utils/with-terminal-loading";

import type { PromptService } from "./services/prompt.service";
import type { ScrapingService } from "./services/scraping.service";
import type { SitemapService } from "./services/sitemap.service";

type ScrapingControllerDependencies = {
  scrapingService: ScrapingService;
  sitemapService: SitemapService;
  promptService: PromptService;
};

export const createScrapingController = (
  deps: ScrapingControllerDependencies,
) => {
  const { scrapingService, sitemapService, promptService } = deps;

  const scrapMultipleShops = async () => {
    const shouldUpdateUrls = await promptService.shouldUpdateUrls();

    const urls = await withTerminalLoader(
      async () => {
        const getSitemaps = shouldUpdateUrls
          ? sitemapService.updateUrls
          : sitemapService.getSavedUrls;

        const urlSitemaps = await getSitemaps();

        return urlSitemaps.map(({ url }) => url);
      },
      shouldUpdateUrls ? "Fetching urls" : "Loading saved urls",
    );

    if (!urls?.length) {
      throw new Error("No shops to scrap");
    }

    // Get thread count from user
    const threadCount = await promptService.getThreadCount();
    const shopsLimit = await promptService.getShopsAmountToScrap(urls.length);

    const urlsToScrap = urls.slice(0, shopsLimit);

    return await scrapingService.scrapeShops(urlsToScrap, threadCount);
  };

  const scrapSingleShop = async () => {
    const url = await promptService.getShopUrl();

    return await scrapingService.scrapeShop(url);
  };

  return {
    scrapMultipleShops,
    scrapSingleShop,
  };
};
