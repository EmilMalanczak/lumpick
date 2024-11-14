import { confirm, input } from "@inquirer/prompts";

import { readScrappedShopUrls } from "../services/dump.service";
import {
  getShopsData,
  getSingleShopData,
  saveShopData,
  saveShopsData,
} from "../services/shop.service";
import {
  getSitemapShopsUrls,
  saveSitemapShopUrls,
} from "../services/sitemap.service";
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

  return shops;
};

export const scrapSingleShop = async () => {
  const url = await input({
    message: "Enter shop url",
    validate: (url) => {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    },
  });

  const shopData = await withTerminalLoader(
    async () => await getSingleShopData(url),
    `Scraping ${url}`,
  );

  if (!shopData) {
    throw new Error(`Couldn't get data for shop: ${url}`);
  }

  await saveShopData(shopData);

  return shopData;
};
