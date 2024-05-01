import type { Page } from "puppeteer";

import { sleep } from "../utils/sleep";
import { getShop } from "./get-shop";

export const getShops = async (
  urls: string[],
  page: Page,
  rateLimit: number,
) => {
  const data = [];

  for await (const [index, url] of urls.entries()) {
    const shop = await getShop(url, page);

    data.push(shop);

    console.log(index, "/", urls.length);

    await sleep(rateLimit);
  }

  return data;
};
