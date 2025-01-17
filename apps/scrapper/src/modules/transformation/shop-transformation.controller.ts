import { logger } from "~/utils/logger";

import { PromptService } from "../shared/prompt.service";
import { StorageService } from "../shared/storage.service";
import { ShopTransformationService } from "./services/shop-transformation.service";

type ShopTransformationControllerDependencies = {
  promptService: PromptService;
  storageService: StorageService;
  shopTransformationService: ShopTransformationService;
};

export class ShopTransformationController {
  private promptService: PromptService;
  private storageService: StorageService;
  private shopTransformationService: ShopTransformationService;

  constructor({
    promptService,
    storageService,
    shopTransformationService,
  }: ShopTransformationControllerDependencies) {
    this.promptService = promptService;
    this.storageService = storageService;
    this.shopTransformationService = shopTransformationService;
  }

  private async transformSingleShop() {
    const shopSlug = await this.promptService.getText("Enter shop slug");

    const storedShop = await this.storageService.getShopDataBySlug(shopSlug);

    if (!storedShop) {
      throw new Error("Shop not found");
    }

    const shop = await this.shopTransformationService.transformShop(storedShop);

    return shop;
  }

  private async transformAllShops() {}

  public async selectTransformHandler() {
    // Define available actions
    const actions = [
      {
        name: "Scrap single store",
        type: "SINGLE_SCRAP",
        handler: async () => {
          const shop = await this.transformSingleShop();

          if (!shop) {
            logger.error("No shop data returned");
            return;
          }

          logger.info(`Single shop scraping completed ${shop.name}`);
        },
      },
      {
        name: "Full scrap",
        type: "FULL_SCRAP",
        handler: async () => {
          await this.transformAllShops();

          logger.info("Full scraping completed");
        },
      },
    ];

    // Get user selection
    const selectedAction = await this.promptService.selectAction(actions);

    return selectedAction.handler;
  }
}
