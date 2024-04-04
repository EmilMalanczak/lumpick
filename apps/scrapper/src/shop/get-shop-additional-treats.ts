import type { Page } from "puppeteer";

export const getShopAdditionalTreats = async (
  page: Page,
): Promise<string[]> => {
  const shopAdditionalTreats = await page.evaluate(() => {
    const termsElements = Array.from(
      document.querySelectorAll(".block-type-terms"),
    );

    const shopAdditionalTreatsElement = termsElements.find((termsElement) => {
      const termsElementTitle = termsElement.querySelector("h5");
      return termsElementTitle?.textContent === "Dodatkowe informacje";
    });

    if (!shopAdditionalTreatsElement) {
      return [];
    }

    const shopAdditionalTreatsTitleElements = Array.from(
      shopAdditionalTreatsElement.querySelectorAll("ul li .category-name"),
    );
    const shopAdditionalTreatsData = shopAdditionalTreatsTitleElements.map(
      (span) => span.textContent ?? "",
    );

    return shopAdditionalTreatsData;
  });

  return shopAdditionalTreats;
};
