import type { Page } from "puppeteer";

export const getShopStock = async (page: Page): Promise<string[]> => {
  const shopStock = await page.evaluate(() => {
    const termsElements = Array.from(
      document.querySelectorAll(".block-type-terms"),
    );

    const shopStockElement = termsElements.find((termsElement) => {
      const termsElementTitle = termsElement.querySelector("h5");
      return termsElementTitle?.textContent === "Asortyment";
    });

    if (!shopStockElement) {
      return [];
    }

    const shopStockTitleElements = Array.from(
      shopStockElement.querySelectorAll("ul li .category-name"),
    );
    const shopStockData = shopStockTitleElements.map(
      (span) => span.textContent ?? "",
    );

    return shopStockData;
  });

  return shopStock;
};
