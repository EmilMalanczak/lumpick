import { parentPort } from "node:worker_threads";

import type { WorkerResult, WorkerTask } from "~/utils/worker-pool";

import type { ScrappedShop, ScrapWorkerData } from "./scraping.types";

import { BrowserService } from "./services/browser.service";
import { ShopScrapService } from "./services/shop-scrap.service";

if (parentPort) {
  const browserService = new BrowserService();
  const shopScrapService = new ShopScrapService({ browserService });

  parentPort.on("message", (task: WorkerTask<ScrapWorkerData>) => {
    void shopScrapService
      .scrapShop(task.data.url)
      .then((shopData) => {
        const result: WorkerResult<ScrapWorkerData, ScrappedShop> = {
          id: task.id,
          data: shopData,
          success: true,
        };

        parentPort?.postMessage(result);
      })
      .catch((error) => {
        const failedResult: WorkerResult<ScrapWorkerData, ScrappedShop> = {
          id: task.id,
          error: error instanceof Error ? error : new Error(String(error)),
          success: false,
          input: task.data,
        };
        parentPort?.postMessage(failedResult);
      });
  });
}
