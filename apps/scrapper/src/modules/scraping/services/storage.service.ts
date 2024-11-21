import fs from "node:fs";
import path from "node:path";

import type { ScrapedShop } from "../utils/scrapping.utils";
import { SCRAP_SHOPS_DATA_FOLDER } from "../../../config/constants";
import { getRoot, readJson, storeJson } from "../../../utils/storage";

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

  return {
    getScrappedShops,
    saveShopData,
    getShopData,
  };
}

export type StorageService = ReturnType<typeof createStorageService>;
