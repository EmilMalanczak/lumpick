import type { Browser } from "puppeteer";
import puppeteer from "puppeteer";

export type { Page } from "puppeteer";

export class BrowserService {
  private browser: Browser | null = null;

  public async init() {
    if (!this.browser) {
      const browser = await puppeteer.launch({
        defaultViewport: null,
        headless: false,
        // dumpio: true,
        args: [
          "--disable-extensions",
          "--enable-chrome-browser-cloud-management",
        ],
      });

      this.browser = browser;
    }

    return this.browser;
  }

  public async openBrowser() {
    if (!this.browser) {
      await this.init().catch(() => {
        throw new Error("Failed to initialize browser");
      });
    }

    const [page] = await this.browser!.pages();

    if (!page) {
      throw new Error("Failed to create a new page");
    }

    return {
      browser: this.browser,
      page,
    };
  }

  public async closeBrowser() {
    if (this.browser) {
      await this.browser.close();

      this.browser = null;
    } else {
      throw new Error("Browser is not open");
    }
  }
}
