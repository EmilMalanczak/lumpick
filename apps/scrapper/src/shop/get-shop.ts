import type { Page } from "puppeteer";

import {
  getShopAdditionalTreats,
  getShopDeliveries,
  getShopLinkedDataJson,
  getShopPrices,
  getShopRelations,
  getShopStock,
  getShopWebsite,
  getShopWorkHours,
} from "./index.js";

export const getShop = async (url: string, page: Page) => {
  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    const shopLinkedDataJson = await getShopLinkedDataJson(page);
    const shopRelations = await getShopRelations(page);
    const shopUrl = await getShopWebsite(page);
    const shopPrices = await getShopPrices(page);
    const shopDeliveries = await getShopDeliveries(page);
    const shopHours = await getShopWorkHours(page);
    const shopStock = await getShopStock(page);
    const shopAdditionalTreats = await getShopAdditionalTreats(page);

    return {
      shopLinkedDataJson,
      shopRelations,
      shopUrl,
      shopPrices,
      shopDeliveries,
      shopHours,
      shopStock,
      shopAdditionalTreats,
    };
  } catch (error) {
    console.log("Problematic endpoint!", url);
  }
};
