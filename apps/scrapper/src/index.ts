import puppeteer from "puppeteer";

import { getAllSecondHandEndpoints } from "./api/index.js";
import { getShopsStore } from "./shop/index.js";

(async () => {
  try {
    const browser = await puppeteer.launch({
      defaultViewport: null,
      headless: false,
    });

    const [page] = await browser.pages();

    if (!page) {
      throw new Error("Failed to create a new page");
    }

    const allSecondHandEndpoints = await getAllSecondHandEndpoints(page);

    await getShopsStore(allSecondHandEndpoints, page, 1000);

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
