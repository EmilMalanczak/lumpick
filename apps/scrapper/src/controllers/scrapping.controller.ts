import fs from "node:fs/promises";
import puppeteer from "puppeteer";

import {
  SCRAP_DATA_FOLDER,
  SCRAP_SHOPS_DATA_FOLDER,
} from "../config/constants";
import { readScrappedShopUrls } from "../services/scrapped-data.service";
import { getShopsUrls, saveShopUrls } from "../services/shop-urls.service";
import { getShop } from "../shop";
import { storeJson } from "../utils/json";
import { logger } from "../utils/logger";
import { sleep } from "../utils/sleep";
import { slugify } from "../utils/slugify";

export const scrapShopsUrls = async () => {
  await fs.mkdir(SCRAP_DATA_FOLDER, { recursive: true });

  logger.info("Starting to scrap shop urls");

  const shopUrls = await getShopsUrls();

  logger.info("Saving urls...");

  await saveShopUrls(shopUrls);
};

export const scrapShopData = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless: false,
    dumpio: true,
    args: ["--disable-extensions", "--enable-chrome-browser-cloud-management"],
  });

  const [page] = await browser.pages();

  if (!page) {
    throw new Error("Failed to create a new page");
  }

  const shopUrls = await readScrappedShopUrls();

  await fs.mkdir(SCRAP_SHOPS_DATA_FOLDER, { recursive: true });

  for await (const { url } of shopUrls) {
    const data = await getShop(url, page);

    if (!data) throw new Error("Failed to get shop data");

    const serializedShopSlug = slugify(data?.shopLinkedDataJson.name);

    await storeJson(
      `${SCRAP_SHOPS_DATA_FOLDER}/${serializedShopSlug}`,
      JSON.stringify(data),
    );
    await sleep(1000);
  }

  logger.info("Finished scrapping shops");
  await browser.close();
};
