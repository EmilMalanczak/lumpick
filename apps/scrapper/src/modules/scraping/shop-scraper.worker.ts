import { parentPort } from "node:worker_threads";
import puppeteer from "puppeteer";

import type { WorkerResult, WorkerTask } from "~/utils/worker-pool";

import type { ScrapedShop, ScrapWorkerData } from "./scraping.types";

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

if (parentPort) {
  parentPort.on("message", (task: WorkerTask<ScrapWorkerData>) => {
    void workerScrapeShop(task.data.url)
      .then((shopData) => {
        const result: WorkerResult<ScrapWorkerData, ScrapedShop> = {
          id: task.id,
          data: shopData,
          success: true,
        };

        parentPort?.postMessage(result);
      })
      .catch((error) => {
        const failedResult: WorkerResult<ScrapWorkerData, ScrapedShop> = {
          id: task.id,
          error: error instanceof Error ? error : new Error(String(error)),
          success: false,
          input: task.data,
        };
        parentPort?.postMessage(failedResult);
      });
  });
}
