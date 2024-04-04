import { Page } from "puppeteer";
import { API_ALL_SHOPS_ENDPOINT } from "../constants.js";

interface Mock {
  html: string;
  pagination: number | null;
  found_posts: number;
  showing: string;
  max_num_pages: number;
  posts_per_page: number;
}

async function getAllSecondHandEndpoints(page: Page): Promise<string[]> {
  const response = await fetch(API_ALL_SHOPS_ENDPOINT);
  const responseBody = await response.text();
  const responseBodyJson = (await JSON.parse(responseBody)) as Mock;

  await page.setContent(responseBodyJson.html);

  const allShops = await page.evaluate(() => {
    const shopsParentElement = Array.from(document.querySelectorAll(".ale-tu-jebie-skunem"));

    const urls = shopsParentElement.map((element: Element) => {
      const url = element.querySelector("a");
      return url?.href || "";
    });

    return urls;
  });

  return allShops;
}

export default getAllSecondHandEndpoints;
