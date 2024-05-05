import { confirm, input } from "@inquirer/prompts";

import { readScrappedShopUrls } from "../services/dump.service";
import { getShopsData, saveShopsData } from "../services/shop.service";
import {
  getSitemapShopsUrls,
  saveSitemapShopUrls,
} from "../services/sitemap.service";
import { logger } from "../utils/logger";
import { sleep } from "../utils/sleep";
import { withTerminalLoader } from "../utils/terminal-loading";

export const scrapShops = async () => {
  let shopUrls = await readScrappedShopUrls();

  const shouldScrapUrls =
    !shopUrls ||
    (await confirm({
      default: true,
      message: "Do you want to update the shop urls?",
    }));

  if (shouldScrapUrls) {
    await withTerminalLoader(async () => {
      shopUrls = await getSitemapShopsUrls();

      await saveSitemapShopUrls(shopUrls);
    }, "Scrapping shop urls");
  }

  if (!shopUrls || shopUrls.length === 0) {
    throw new Error("No shops to scrap");
  }

  await sleep(1000);

  const urlsCount = shopUrls.length;

  const shopLimit = Number(
    await input({
      message: `How many shops do you want to scrap? (-1 for all) (max ${urlsCount})`,
      validate: (value) => {
        const parsedValue = Number(value);

        return Number.isNaN(parsedValue)
          ? "You must provide a number"
          : parsedValue > urlsCount
            ? `You must provide a number in range of 1-${urlsCount + 1} or -1 for all`
            : true;
      },
      default: "-1",
    }),
  );

  const urlsToScrap = shopLimit > 0 ? shopUrls.slice(0, shopLimit) : shopUrls;

  const shops = await withTerminalLoader(
    async () => await getShopsData(urlsToScrap),
    "Scrapping shops",
  );

  await saveShopsData(shops);

  logger.trace("Shops data saved");

  process.exit(0);
};
