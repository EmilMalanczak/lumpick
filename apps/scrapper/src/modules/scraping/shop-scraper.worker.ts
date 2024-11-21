import { parentPort, workerData } from "node:worker_threads";
import puppeteer from "puppeteer";

import type { WorkerData, WorkerMessage } from "./services/scraping.service";
import type { ScrapedShop } from "./utils/scrapping.utils";
import {
  scrapShopAdditionalTreats,
  scrapShopDeliveries,
  scrapShopMetadata,
  scrapShopPrices,
  scrapShopRelations,
  scrapShopStock,
  scrapShopWebsite,
  scrapShopWorkHours,
} from "./utils/scrapping.utils";

async function workerScrapeShop(url: string): Promise<ScrapedShop> {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-extensions", "--enable-chrome-browser-cloud-management"],
  });

  try {
    const [page] = await browser.pages();
    if (!page) throw new Error("Failed to create page");

    await page.goto(url, { waitUntil: "networkidle0" });

    const [
      metadata,
      relations,
      shopUrl,
      prices,
      deliveries,
      hours,
      stock,
      additionalTreats,
    ] = await Promise.all([
      scrapShopMetadata(page),
      scrapShopRelations(page),
      scrapShopWebsite(page),
      scrapShopPrices(page),
      scrapShopDeliveries(page),
      scrapShopWorkHours(page),
      scrapShopStock(page),
      scrapShopAdditionalTreats(page),
    ]);

    return {
      metadata,
      relations,
      url: shopUrl,
      prices,
      deliveries,
      hours,
      stock,
      additionalTreats,
    };
  } finally {
    await browser.close();
  }
}

const { url } = workerData as WorkerData;

void (async () => {
  try {
    const shopData = await workerScrapeShop(url);
    parentPort?.postMessage({
      success: true,
      url,
      data: shopData,
    } as WorkerMessage);
  } catch (error) {
    parentPort?.postMessage({
      success: false,
      url,
      error: error instanceof Error ? error.message : "Unknown error",
    } as WorkerMessage);
  } finally {
    process.exit(0);
  }
})();
