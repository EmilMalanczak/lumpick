import fs from "fs";
import path from "path";

import type { DumpShop } from "./shop.service";
import type { SitemapItem } from "./sitemap.service";
import { readJson } from "../utils/json";

export const readScrappedShopUrls = () => readJson<SitemapItem[]>("dump/urls");

export const readScrappedShops = async (): Promise<DumpShop[]> => {
  const directoryPath = path.join(__dirname, "../dump/shops");

  const files = fs
    .readdirSync(directoryPath)
    .filter((file) => path.extname(file) === ".json");

  console.log(files);

  const shops = await Promise.all(
    files.map(async (file) =>
      readJson<DumpShop>(`dump/shops/${file}`, { addSuffix: false }),
    ),
  );

  return shops.filter(Boolean) as DumpShop[];
};
