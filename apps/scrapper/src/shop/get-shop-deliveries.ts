import type { Page } from "puppeteer";

export const getShopDeliveries = async (page: Page): Promise<string[]> => {
  const shopDeliveries = await page.evaluate(() => {
    const shopDeliveriesElements = Array.from(
      document.querySelectorAll(".upcoming-event-date span"),
    );

    return shopDeliveriesElements.map(
      (shopDeliveriesElement) =>
        shopDeliveriesElement?.textContent?.trim() ?? "",
    );
  });

  return shopDeliveries;
};
