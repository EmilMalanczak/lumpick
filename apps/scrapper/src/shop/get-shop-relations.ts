import type { Page } from "puppeteer";

export const getShopRelations = async (page: Page): Promise<string[]> => {
  const hasShopRelations = await page.evaluate(() => {
    return !!document.querySelector("#listing_tab_powiazane-sklepy_toggle");
  });

  if (!hasShopRelations) {
    return [];
  }

  const shopRelations = await page.evaluate(() => {
    const shopElement = document.querySelector("#listing_tab_powiazane-sklepy");

    if (!shopElement) {
      return [];
    }

    const shopElementTitleElements = Array.from(
      shopElement.querySelectorAll(".listing-preview-title"),
    );
    const shopTitles = shopElementTitleElements.map(
      (shopElementTitleElement) =>
        shopElementTitleElement?.textContent?.trim() ?? "",
    );

    return shopTitles;
  });

  return shopRelations;
};
