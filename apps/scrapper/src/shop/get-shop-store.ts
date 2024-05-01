import fs from "node:fs/promises";
import type { Page } from "puppeteer";

import { storeJson } from "../utils/json";
import { getShop } from "./get-shop";

export const getShopStore = async (
  url: string,
  page: Page,
  filename: string,
  dir: string,
) => {
  await fs.mkdir(dir, { recursive: true });

  const data = await getShop(url, page);

  const path = `${dir}/${filename}`;

  await storeJson(path, JSON.stringify(data));
};
