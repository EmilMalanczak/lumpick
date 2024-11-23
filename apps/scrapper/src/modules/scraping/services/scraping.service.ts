import puppeteer from "puppeteer";

import { WorkerPool } from "~/utils/worker-pool";
import { logger } from "~utils/logger";
import { getRoot } from "~utils/storage";
import { createTerminalLoader } from "~utils/with-terminal-loading";

import type {
  ScrapedShop,
  ScrapWorkerData,
  ScrapWorkerResult,
} from "../scraping.types";
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
          failed: 0,
          total,
          activeUrls: [] as string[],
        },
      },
      {
        onTick: ({ state }) => {
          const { completed, total, failed, activeUrls } = state!;
          const percentage = ((completed / total) * 100).toFixed(1);

          const currentUrls = activeUrls
            .map((url) => {
              try {
                return new URL(url).pathname;
              } catch {
                return url;
              }
            })
            .join(", ");

          return `Scrapping: Success ${completed}, Failed ${failed}, Total: ${completed + failed}/${total} (${percentage}%) ${
            currentUrls ? ` Current: ${currentUrls}` : ""
          }`;
        },
      },
    );
  }

  async function scrapeShops(
    urls: string[],
    numberOfThreads: number,
  ): Promise<ScrapedShop[]> {
    const loader = createScrapeLoader(urls.length);

    const scrapWorkersPool = new WorkerPool<ScrapWorkerData, ScrapWorkerResult>(
      `${getRoot()}/dist/scrap-worker.js`,
      {
        numberOfThreads,
        retry: {
          maxRetries: 3,
          shouldRetry: (error: Error) => {
            return error.message.includes("Navigation timeout");
          },
          delayMs: (attempt: number) => Math.pow(2, attempt) * 1000,
        },
      },
    );

    scrapWorkersPool.on(
      "progress",
      ({ total, finished, failed, activeJobs }) => {
        loader.updateState({
          state: {
            completed: finished,
            failed,
            total,
            activeUrls: activeJobs.map((job) => job.url),
          },
        });
      },
    );

    scrapWorkersPool.on("success", ({ data }) => {
      void storageService
        .saveShopData(data)
        .then(() => {
          loader.log(`Scrapped shop: ${data.metadata.slug}`);
        })
        .catch((error) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          logger.error("Failed to save shops error", { error });
        });
    });

    scrapWorkersPool.on("failed", ({ input, error }) => {
      void storageService
        .saveShopError(
          input.url,
          error instanceof Error ? error.message : "Unknown error",
        )
        .finally(() => {
          loader.log(`Failed to scrap shop: ${input.url}`);
        });
    });

    loader.start();

    const results = await scrapWorkersPool.executeAll(
      urls.map((url) => ({ url })),
    );
    loader.stop();

    return results;
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

  return {
    scrapeShop,
    scrapeShops,
  };
};

export type ScrapingService = ReturnType<typeof createScrapingService>;
