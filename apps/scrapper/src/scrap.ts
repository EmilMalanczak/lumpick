import { scrapShopsUrls } from "./controllers/scrapping.controller";

void (async () => {
  try {
    await scrapShopsUrls();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
})();
