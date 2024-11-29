import fs from "node:fs";
import path from "node:path";

import {
  SCRAP_ERROR_DATA_FOLDER,
  SCRAP_SHOPS_DATA_FOLDER,
} from "~/config/constants";
import { getRoot, readJson, storeJson } from "~/utils/storage";

import type { ScrapedShop } from "../scraping.types";

export function createStorageService() {
  async function getScrappedShops(): Promise<ScrapedShop[]> {
    const directoryPath = `${getRoot()}}/${SCRAP_SHOPS_DATA_FOLDER}`;

    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => path.extname(file) === ".json");

    console.log(files);

    const shops = await Promise.all(files.map(getShopData));

    return shops.filter(Boolean) as ScrapedShop[];
  }

  async function saveShopData(shop: ScrapedShop) {
    const filePath = `${SCRAP_SHOPS_DATA_FOLDER}/${shop.metadata.slug}`;

    await storeJson(filePath, JSON.stringify(shop));
  }

  async function getShopData(shopFilename: string) {
    const filePath = `${SCRAP_SHOPS_DATA_FOLDER}/${shopFilename}`;

    return readJson<ScrapedShop>(filePath, { addSuffix: false });
  }

  async function saveShopError(url: string, error: string) {
    const slug = new URL(url).pathname;

    const filePath = `${SCRAP_ERROR_DATA_FOLDER}/${slug}`;

    await storeJson(filePath, error);
  }

  return {
    getScrappedShops,
    saveShopData,
    getShopData,
    saveShopError,
  };
}

export type StorageService = ReturnType<typeof createStorageService>;
