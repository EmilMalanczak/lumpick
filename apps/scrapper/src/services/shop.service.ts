import fs from "node:fs/promises";
import type { Page } from "puppeteer";
import puppeteer from "puppeteer";

import type { SitemapItem } from "./sitemap.service";
import {
  SCRAP_ERROR_DATA_FOLDER,
  SCRAP_SHOPS_DATA_FOLDER,
  SCRAPE_RATE_LIMIT,
} from "../config/constants";
import { readJson, storeJson } from "../utils/json";
import { logger } from "../utils/logger";
import { sleep } from "../utils/sleep";
import { slugify } from "../utils/slugify";

type ShopMetadata = {
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
};

type Address = {
  address: string;
  lat: string;
  lng: string;
};

type ContactPoint = {
  "@type": string;
  contactType: string;
  telephone: string;
  email: string;
};

type GeoCoordinates = {
  "@type": string;
  latitude: string;
  longitude: string;
};

type AggregateRating = {
  "@type": string;
  ratingValue: string;
  reviewCount: string;
  bestRating: string;
};

type WorkHours = {
  day: string;
  closed?: boolean;
  from: string | null;
  to: string | null;
};

export type DumpShop = {
  shopLinkedDataJson: ShopMetadata;
  shopRelations: string[];
  shopUrl: string;
  shopPrices: {
    day: string;
    price: string;
  }[];
  shopDeliveries: string[];
  shopHours: WorkHours[];
  shopStock: string[];
  shopAdditionalTreats: string[];
};

export const getShopAdditionalTreats = (page: Page): Promise<string[]> =>
  page.evaluate(() => {
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

export const getShopDeliveries = (page: Page): Promise<string[]> =>
  page.evaluate(() => {
    const shopDeliveriesElements = Array.from(
      document.querySelectorAll(".upcoming-event-date span"),
    );

    return shopDeliveriesElements.map(
      (shopDeliveriesElement) =>
        shopDeliveriesElement?.textContent?.trim() ?? "",
    );
  });

export const getShopMetadata = async (page: Page): Promise<ShopMetadata> => {
  const shopLinkedData = await page.evaluate(() => {
    const scriptElements = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    );
    const scriptContent = scriptElements.find((_, index) => index === 1);

    return scriptContent?.textContent ? scriptContent.textContent : "{}";
  });

  return (await JSON.parse(shopLinkedData)) as ShopMetadata;
};

export const getShopPrices = (
  page: Page,
): Promise<
  {
    day: string;
    price: string;
  }[]
> =>
  page.evaluate(() => {
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

export const getShopRelations = async (page: Page): Promise<string[]> => {
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
};

export const getShopStock = (page: Page): Promise<string[]> =>
  page.evaluate(() => {
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

export const getShopWebsite = (page: Page): Promise<string> =>
  page.evaluate(() => {
    const websiteElement = document.querySelector("#cta-55cd58 a");

    return websiteElement?.getAttribute("href") ?? "";
  });

export const getShopWorkHours = (page: Page): Promise<WorkHours[]> =>
  page.evaluate(() => {
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

export const getShop = async (
  url: string,
  page: Page,
): Promise<DumpShop | null> => {
  try {
    const data = await Promise.all([
      getShopMetadata(page),
      getShopRelations(page),
      getShopWebsite(page),
      getShopPrices(page),
      getShopDeliveries(page),
      getShopWorkHours(page),
      getShopStock(page),
      getShopAdditionalTreats(page),
    ]);

    const [
      shopLinkedDataJson,
      shopRelations,
      shopUrl,
      shopPrices,
      shopDeliveries,
      shopHours,
      shopStock,
      shopAdditionalTreats,
    ] = data;

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
    logger.error("Problematic endpoint!", url);

    const errors =
      (await readJson<{ url: string; error: string }[]>(
        SCRAP_ERROR_DATA_FOLDER,
      )) ?? [];

    await storeJson(
      SCRAP_ERROR_DATA_FOLDER,
      JSON.stringify([...errors, { url, error: JSON.stringify(error) }]),
    );

    return null;
  }
};

const openBrowser = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless: false,
    // dumpio: true,
    args: ["--disable-extensions", "--enable-chrome-browser-cloud-management"],
  });

  const [page] = await browser.pages();

  if (!page) {
    throw new Error("Failed to create a new page");
  }

  return { page, browser };
};

export const getShopsData = async (urls: SitemapItem[]) => {
  const { browser, page } = await openBrowser();

  await fs.mkdir(SCRAP_SHOPS_DATA_FOLDER, { recursive: true });

  const shops = [];

  try {
    for await (const { url } of urls) {
      await page.goto(url, { waitUntil: "networkidle2" });

      const data = await getShop(url, page);

      if (data) {
        shops.push(data);
      }

      await sleep(SCRAPE_RATE_LIMIT);
    }
  } catch (error) {
    logger.error(error);

    return shops;
  } finally {
    await browser.close();
  }

  return shops;
};

export const getSingleShopData = async (url: string) => {
  const { browser, page } = await openBrowser();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    return await getShop(url, page);
  } finally {
    await browser.close();
  }
};

export const saveShopData = async (shop: DumpShop) => {
  const fileName = slugify(shop.shopLinkedDataJson.name);
  const filePath = `${SCRAP_SHOPS_DATA_FOLDER}/${fileName}`;

  await storeJson(filePath, JSON.stringify(shop));
};

export const saveShopsData = async (shopsData: DumpShop[]) => {
  if (!shopsData.length) {
    logger.warn("No shops data to save");
    return;
  }

  await Promise.all(shopsData.map(saveShopData));
};
