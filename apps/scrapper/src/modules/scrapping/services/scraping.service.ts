import { WorkerPool } from "~/utils/worker-pool";
import { logger } from "~utils/logger";
import { getRoot } from "~utils/storage";
import { createTerminalLoader } from "~utils/with-terminal-loading";

import type { StorageService } from "../../shared/storage.service";
import type {
  ScrappedShop,
  ScrapWorkerData,
  ScrapWorkerResult,
} from "../scraping.types";

type ScrapingServiceDependencies = {
  storageService: StorageService;
};

export class ScrappingService {
  private storageService: StorageService;

  constructor({ storageService }: ScrapingServiceDependencies) {
    this.storageService = storageService;
  }

  public async scrapeShop(url: string): Promise<ScrappedShop | null> {
    const [shop] = await this.scrapeShops([url], 1);

    return shop ?? null;
  }

  private createScrapeLoader(total: number) {
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

  public async scrapeShops(
    urls: string[],
    numberOfThreads: number,
  ): Promise<ScrappedShop[]> {
    const loader = this.createScrapeLoader(urls.length);

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
      void this.storageService
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
      void this.storageService
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
}
