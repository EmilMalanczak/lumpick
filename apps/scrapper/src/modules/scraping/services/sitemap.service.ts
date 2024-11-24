import fs from "node:fs/promises";
import { parseStringPromise } from "xml2js";

import {
  API_ALL_SHOPS_ENDPOINT,
  SCRAP_DATA_FOLDER,
  SHOP_URLS_FILENAME,
} from "~config/constants";
import { getRoot, readJson, storeJson } from "~utils/storage";

type SitemapItemRaw = {
  loc: [string];
  lastmod: [string];
};

export type SitemapItem = {
  url: string;
  lastModified: Date;
};

type RootSitemap = {
  sitemapindex: {
    sitemap: SitemapItemRaw[];
  };
};

type SubpageSitemap = {
  urlset: {
    url: SitemapItemRaw[];
  };
};

export function createSitemapService() {
  const saveSitemapShopUrls = async (urls: SitemapItem[]) => {
    const file = `${SCRAP_DATA_FOLDER}/${SHOP_URLS_FILENAME}`;

    await storeJson(file, JSON.stringify(urls));
  };

  function parseSitemapItem(item: SitemapItemRaw): SitemapItem {
    return {
      url: item.loc[0],
      lastModified: new Date(item.lastmod[0]),
    };
  }

  async function getSubpagesFromSitemap(
    sitemap: string,
  ): Promise<SitemapItem[]> {
    const parsedXml = (await parseStringPromise(sitemap)) as RootSitemap;

    // console.log("sitemap: ", parsedXml.sitemapindex.sitemap);

    // eg. job_listing-sitemap.xml
    return parsedXml.sitemapindex.sitemap
      .filter((item) => item.loc[0].includes("job_listing-sitemap"))
      .map(parseSitemapItem);
  }

  async function getShopUrlsFromSitemaps(sitemaps: SitemapItem[]) {
    const allShopUrls: SitemapItem[] = [];

    for (const sitemap of sitemaps) {
      const response = await fetch(sitemap.url);
      const responseBody = await response.text();

      const parsedXml = (await parseStringPromise(
        responseBody,
      )) as SubpageSitemap;

      const shopUrls = parsedXml.urlset.url.filter((item) =>
        item.loc[0].includes("/sklep/"),
      );

      allShopUrls.push(...shopUrls.map(parseSitemapItem));
    }

    return allShopUrls;
  }

  async function updateUrls() {
    await fs.mkdir(`${getRoot()}/${SCRAP_DATA_FOLDER}`, { recursive: true });

    const response = await fetch(API_ALL_SHOPS_ENDPOINT);
    const responseBody = await response.text();

    if (
      responseBody.includes(
        "Please wait while your request is being verified...",
      )
    ) {
      throw new Error(
        "Cloudflare protection is blocking the request. Open manually the ENDPOINT in the browser and solve the captcha.",
      );
    }

    const subpages = await getSubpagesFromSitemap(responseBody);

    const urls = await getShopUrlsFromSitemaps(subpages);

    await saveSitemapShopUrls(urls);

    return urls;
  }

  async function getSavedUrls() {
    const urls = await readJson<SitemapItem[]>(
      `${SCRAP_DATA_FOLDER}/${SHOP_URLS_FILENAME}`,
    );

    if (!urls) {
      throw new Error("No saved urls found");
    }

    return urls;
  }

  return {
    updateUrls,
    getSavedUrls,
  };
}

export type SitemapService = ReturnType<typeof createSitemapService>;
