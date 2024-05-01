import type { SitemapItem } from "./shop-urls.service";
import { readJson } from "../utils/json";

export const readScrappedShopUrls = async () => {
  try {
    return await readJson<SitemapItem[]>("dump/urls");
  } catch (error) {
    throw new Error("Error while reading scrapped urls");
  }
};
