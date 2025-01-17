import fs from "node:fs";
import path from "node:path";

import {
  SCRAP_ERROR_DATA_FOLDER,
  SCRAP_SHOPS_DATA_FOLDER,
} from "~/config/constants";
import { getRoot, readJson, storeJson } from "~/utils/storage";

import type { ScrappedShop } from "../scrapping/scraping.types";

export class StorageService {
  public async getScrappedShops(): Promise<ScrappedShop[]> {
    const directoryPath = `${getRoot()}}/${SCRAP_SHOPS_DATA_FOLDER}`;

    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => path.extname(file) === ".json");

    const shops = await Promise.all(files.map(this.getShopData));

    return shops.filter(Boolean) as ScrappedShop[];
  }

  public getShopDataBySlug(slug: string) {
    return this.getShopData(slug);
  }

  public async saveShopData(shop: ScrappedShop) {
    const filePath = `${SCRAP_SHOPS_DATA_FOLDER}/${shop.metadata.slug}`;

    await storeJson(filePath, JSON.stringify(shop));
  }

  public async saveShopError(url: string, error: string) {
    const slug = new URL(url).pathname;

    const filePath = `${SCRAP_ERROR_DATA_FOLDER}/${slug}`;

    await storeJson(filePath, error);
  }

  private async getShopData(shopFilename: string) {
    const filePath = `${SCRAP_SHOPS_DATA_FOLDER}/${shopFilename}`;

    return readJson<ScrappedShop>(filePath, { addSuffix: false });
  }
}
