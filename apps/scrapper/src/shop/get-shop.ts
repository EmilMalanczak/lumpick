import type { Page } from "puppeteer";

import { getShopAdditionalTreats } from "./get-shop-additional-treats";
import { getShopDeliveries } from "./get-shop-deliveries";
import { getShopLinkedDataJson } from "./get-shop-linked-data-json";
import { getShopPrices } from "./get-shop-prices";
import { getShopRelations } from "./get-shop-relations";
import { getShopStock } from "./get-shop-stock";
import { getShopWebsite } from "./get-shop-website";
import { getShopWorkHours } from "./get-shop-work-hours";

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
