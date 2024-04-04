import type { Page } from "puppeteer";

export const getShopWorkHours = async (
  page: Page,
): Promise<
  {
    day: string;
    workHours: string;
  }[]
> => {
  const shopWorkHours = page.evaluate(() => {
    const shopWorkHoursElements = Array.from(
      document.querySelectorAll(".block-type-work_hours ul li"),
    );

    const shopWorkHoursMap = shopWorkHoursElements.map((element) => {
      const dayElement = element.querySelector(".item-attr");
      const workHoursElement = element.querySelector(".item-property");

      const day = dayElement?.textContent ? dayElement.textContent.trim() : "";
      const workHours = workHoursElement?.textContent
        ? workHoursElement.textContent.trim()
        : "";

      return { day, workHours };
    });

    return shopWorkHoursMap;
  });

  return shopWorkHours;
};
