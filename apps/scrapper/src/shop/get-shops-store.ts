import type { Page } from "puppeteer";

import { sleep } from "../utils/sleep";
import { getShopStore } from "./get-shop-store";

export const getShopsStore = async (
  urls: string[],
  page: Page,
  rateLimit: number,
) => {
  for await (const [index, url] of urls.entries()) {
    await getShopStore(url, page, index.toString(), "dump");

    console.log(index, "/", urls.length);

    await sleep(rateLimit);
  }
};
