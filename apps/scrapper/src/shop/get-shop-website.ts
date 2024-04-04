import type { Page } from "puppeteer";

export const getShopWebsite = async (page: Page): Promise<string> => {
  const website = await page.evaluate(() => {
    const websiteElement = document.querySelector("#cta-55cd58 a");

    const websiteContent = websiteElement?.getAttribute("href") ?? "";

    return websiteContent;
  });

  return website;
};
