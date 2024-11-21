import path from "node:path";
import { Worker } from "node:worker_threads";
import puppeteer from "puppeteer";

import { logger } from "~utils/logger";
import { sleep } from "~utils/sleep";
import { getRoot } from "~utils/storage";
import { createTerminalLoader } from "~utils/with-terminal-loading";

import type { ScrapedShop, ScrapWorkerMessage } from "../scraping.types";
import type { StorageService } from "./storage.service";

import {
  scrapShopAdditionalTreats,
  scrapShopDeliveries,
  scrapShopMetadata,
  scrapShopPrices,
  scrapShopRelations,
  scrapShopStock,
  scrapShopWebsite,
  scrapShopWorkHours,
} from "../utils/scrapping.utils";

type ScrapingServiceDependencies = {
  storageService: StorageService;
};

export const createScrapingService = (deps: ScrapingServiceDependencies) => {
  const { storageService } = deps;

  async function scrapeShop(url: string): Promise<ScrapedShop | null> {
    const { page, browser } = await openBrowser();

    try {
      const data = await Promise.all([
        scrapShopMetadata(page),
        scrapShopRelations(page),
        scrapShopWebsite(page),
        scrapShopPrices(page),
        scrapShopDeliveries(page),
        scrapShopWorkHours(page),
        scrapShopStock(page),
        scrapShopAdditionalTreats(page),
      ]);

      const [
        metadata,
        relations,
        url,
        prices,
        deliveries,
        hours,
        stock,
        additionalTreats,
      ] = data;

      const shopData = {
        metadata,
        relations,
        url,
        prices,
        deliveries,
        hours,
        stock,
        additionalTreats,
      };

      await storageService.saveShopData(shopData);

      return shopData;
    } catch (error) {
      logger.error("Failed to scrape shop", { url, error });
      return null;
    } finally {
      await browser.close();
    }
  }

  function createScrapeLoader(total: number) {
    return createTerminalLoader(
      {
        text: "",
        state: {
          completed: 0,
          total,
          currentBatch: {
            number: 1,
            total: 1,
            urls: [] as string[],
          },
        },
      },
      {
        onTick: ({ state }) => {
          const { completed, total, currentBatch } = state!;
          const percentage = ((completed / total) * 100).toFixed(1);
          const progress = `${completed}/${total} - ${percentage}%`;
          const batch = `[Batch ${currentBatch.number}/${currentBatch.total}]`;

          const currentUrls = currentBatch.urls
            .map((url) => {
              try {
                return new URL(url).pathname;
              } catch {
                return url;
              }
            })
            .join(", ");

          return `Scrapping shops (${progress}) ${batch}${
            currentUrls ? ` Current: ${currentUrls}` : ""
          }`;
        },
      },
    );
  }

  async function scrapeShops(
    urls: string[],
    batchSize: number,
  ): Promise<{
    failedShops: { url: string; error: string }[];
    shops: ScrapedShop[];
  }> {
    const results: ScrapWorkerMessage[] = [];
    const totalBatches = Math.ceil(urls.length / batchSize);

    const loader = createScrapeLoader(urls.length);

    try {
      loader.start();

      for (
        let startIndex = 0;
        startIndex < urls.length;
        startIndex += batchSize
      ) {
        const batch = urls.slice(startIndex, startIndex + batchSize);
        const currentBatch = Math.floor(startIndex / batchSize) + 1;

        loader.updateState({
          state: {
            completed: startIndex,
            total: urls.length,
            currentBatch: {
              number: currentBatch,
              total: totalBatches,
              urls: batch,
            },
          },
        });

        const batchResults = await Promise.allSettled(
          batch.map(async (url) => {
            const workerResult = await createShopWorker(url);

            if (workerResult.success) {
              const { data } = workerResult;

              await storageService.saveShopData(data);

              loader.log(`Scrapped shop: ${data.metadata.slug}`);
            } else {
              loader.log(`Failed to scrap shop: ${url}`);
            }

            return workerResult;
          }),
        );

        batchResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            results.push(result.value);
          } else {
            results.push({
              success: false,
              url: batch[index]!,
              error:
                result.reason instanceof Error
                  ? result.reason.message
                  : String(result.reason),
            });
          }
        });

        if (startIndex + batchSize < urls.length) {
          await sleep(1000);
        }
      }

      // Update final state
      loader.updateState({
        state: {
          completed: urls.length,
          total: urls.length,
          currentBatch: {
            number: totalBatches,
            total: totalBatches,
            urls: [],
          },
        },
      });

      const shops = results
        .filter(
          (result): result is Extract<ScrapWorkerMessage, { success: true }> =>
            result.success,
        )
        .map((result) => result.data);

      const failedShops = results
        .filter(
          (result): result is Extract<ScrapWorkerMessage, { success: false }> =>
            !result.success,
        )
        .map(({ url, error }) => ({ url, error }));

      if (failedShops.length > 0) {
        logger.info("\nFailed to scrape the following shops:");
        failedShops.forEach(({ url, error }) => {
          logger.info(`- ${url}: ${error}`);
        });
      }

      return {
        shops,
        failedShops,
      };
    } finally {
      loader.stop();
    }
  }

  async function openBrowser() {
    const browser = await puppeteer.launch({
      defaultViewport: null,
      headless: false,
      // dumpio: true,
      args: [
        "--disable-extensions",
        "--enable-chrome-browser-cloud-management",
      ],
    });

    const [page] = await browser.pages();

    if (!page) {
      throw new Error("Failed to create a new page");
    }

    return { page, browser };
  }

  async function createShopWorker(url: string): Promise<ScrapWorkerMessage> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.resolve(`${getRoot()}/dist/scrap-worker.js`),
        {
          workerData: { url },
        },
      );

      worker.on("message", (message: ScrapWorkerMessage) => {
        resolve(message);
        void worker.terminate();
      });

      worker.on("error", (error) => {
        reject(error);
        void worker.terminate();
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  return {
    scrapeShop,
    scrapeShops,
  };
};

export type ScrapingService = ReturnType<typeof createScrapingService>;
