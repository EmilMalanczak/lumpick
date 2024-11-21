import type { Page } from "puppeteer";

import { slugify } from "../../../utils/slugify";

export type ShopMetadata = {
  "@context": string;
  "@type": string;
  "@id": string;
  name: string;
  legalName: string;
  description: string;
  logo: string[];
  url: string;
  telephone: string;
  email: string;
  openingHours: string[];
  photo: string[];
  image: string[];
  hasMap: string;
  sameAs: string[];
  address: Address;
  contactPoint: ContactPoint;
  geo: GeoCoordinates;
  aggregateRating: AggregateRating;
  slug: string;
};

export type Address = {
  address: string;
  lat: string;
  lng: string;
};

export type ContactPoint = {
  "@type": string;
  contactType: string;
  telephone: string;
  email: string;
};

export type GeoCoordinates = {
  "@type": string;
  latitude: string;
  longitude: string;
};

export type AggregateRating = {
  "@type": string;
  ratingValue: string;
  reviewCount: string;
  bestRating: string;
};

export type WorkHours = {
  day: string;
  closed?: boolean;
  from: string | null;
  to: string | null;
};

export type ShopPrice = {
  day: string;
  price: string;
};

export type ScrapedShop = {
  metadata: ShopMetadata;
  relations: string[];
  url: string;
  prices: ShopPrice[];
  deliveries: string[];
  hours: WorkHours[];
  stock: string[];
  additionalTreats: string[];
};

export function scrapShopAdditionalTreats(page: Page): Promise<string[]> {
  return page.evaluate(() => {
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
}

export function scrapShopDeliveries(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const shopDeliveriesElements = Array.from(
      document.querySelectorAll(".upcoming-event-date span"),
    );

    return shopDeliveriesElements.map(
      (shopDeliveriesElement) =>
        shopDeliveriesElement?.textContent?.trim() ?? "",
    );
  });
}

export async function scrapShopMetadata(page: Page): Promise<ShopMetadata> {
  const shopLinkedData = await page.evaluate(() => {
    const scriptElements = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    );
    const scriptContent = scriptElements.find((_, index) => index === 1);

    return scriptContent?.textContent ?? "{}";
  });

  const rawMetadata = (await JSON.parse(shopLinkedData)) as ShopMetadata;
  const slug = slugify(rawMetadata.name);

  return {
    ...rawMetadata,
    slug,
  };
}

export async function scrapShopPrices(page: Page): Promise<ShopPrice[]> {
  return page.evaluate(() => {
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
}

export async function scrapShopRelations(page: Page): Promise<string[]> {
  const hasShopRelations = await page.evaluate(() => {
    return !!document.querySelector("#listing_tab_powiazane-sklepy_toggle");
  });

  if (!hasShopRelations) {
    return [];
  }

  return await page.evaluate(() => {
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
}

export function scrapShopStock(page: Page): Promise<string[]> {
  return page.evaluate(() => {
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

    return shopStockTitleElements.map((span) => span.textContent ?? "");
  });
}

export function scrapShopWebsite(page: Page): Promise<string> {
  return page.evaluate(() => {
    const websiteElement = document.querySelector("#cta-55cd58 a");

    return websiteElement?.getAttribute("href") ?? "";
  });
}

export function scrapShopWorkHours(page: Page): Promise<WorkHours[]> {
  return page.evaluate(() => {
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

      switch (workHours) {
        case "Zamknięte":
          return { day, from: null, to: null, closed: true };
        case "N/A":
        case "Otwarte 24h":
        case "Tylko po wcześniejszym umówieniu":
          return { day, from: null, to: null, closed: undefined };

        default: {
          const [from, to] = workHours.split(" - ") as [string, string];

          return { day, from, to, closed: false };
        }
      }
    });

    return shopWorkHoursMap;
  });
}
