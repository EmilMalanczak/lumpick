import { Shop } from "@lumpick/db/types";

import { ScrappedShop } from "~/modules/scrapping/scraping.types";

export class ShopTransformationService {
  public async transformShop(
    scrappedShop: ScrappedShop,
  ): Promise<Shop<"insert">> {
    return {
      name: scrappedShop.metadata.name,
      slug: scrappedShop.metadata.slug,
      url: scrappedShop.url,
      prices: scrappedShop.prices.map((price) => ({
        price: price.price,
        size: price.size,
      })),
      deliveries: scrappedShop.deliveries,
      workHours: scrappedShop.hours.map((hour) => ({
        day: hour.day,
        open: hour.open,
        close: hour.close,
      })),
      stock: scrappedShop.stock,
      additionalTreats: scrappedShop.additionalTreats,
    };
  }
}
