import { scrapShopsUrls } from "./controllers/scrapping.controller";
import { logger } from "./utils/logger";

void (async () => {
  try {
    await scrapShopsUrls();
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
})();
