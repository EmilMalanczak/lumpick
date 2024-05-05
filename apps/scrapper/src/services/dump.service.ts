import type { SitemapItem } from "./sitemap.service";
import { readJson } from "../utils/json";

export const readScrappedShopUrls = () => readJson<SitemapItem[]>("dump/urls");
