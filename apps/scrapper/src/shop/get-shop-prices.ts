import type { Page } from "puppeteer";

export const getShopPrices = async (
  page: Page,
): Promise<
  {
    day: string;
    price: string;
  }[]
> => {
  const shopPrices = page.evaluate(() => {
    const shopPricesElements = Array.from(
      document.querySelectorAll(".block-type-table ul li"),
    );

    const shopPricesMap = shopPricesElements.map((element) => {
      const dayElement = element.querySelector(".item-attr");
      const priceElement = element.querySelector(".item-property");

      const day = dayElement?.textContent ? dayElement.textContent.trim() : "";
      const price = priceElement?.textContent
        ? priceElement.textContent.trim()
        : "";

      return { day, price };
    });

    return shopPricesMap;
  });

  return shopPrices;
};
