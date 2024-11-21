import { availableParallelism } from "node:os";
import { confirm, input } from "@inquirer/prompts";

export function createPromptService() {
  async function shouldUpdateUrls() {
    return confirm({
      default: true,
      message: "Do you want to update the shop urls?",
    });
  }

  async function getShopsAmountToScrap(limit: number) {
    return Number(
      await input({
        message: `How many shops do you want to scrap? (-1 for all) (max ${limit})`,
        validate: (value) => {
          const parsedValue = Number(value);
          return Number.isNaN(parsedValue)
            ? "You must provide a number"
            : parsedValue > limit
              ? `You must provide a number in range of 1-${limit + 1} or -1 for all`
              : true;
        },
        default: "-1",
      }),
    );
  }

  async function getThreadCount() {
    const maxThreads = availableParallelism();

    return Number(
      await input({
        message: `How many threads should be created? (max ${maxThreads})`,
        validate: (value) => {
          const parsedValue = Number(value);
          return Number.isNaN(parsedValue)
            ? "You must provide a number"
            : parsedValue > maxThreads
              ? `You must provide a number in range of 1-${maxThreads}`
              : true;
        },
        default: `1`,
      }),
    );
  }

  async function getShopUrl() {
    return input({
      message: "Enter shop url",
      validate: (url) => {
        try {
          new URL(url);
          return true;
        } catch (_) {
          return false;
        }
      },
    });
  }

  return {
    shouldUpdateUrls,
    getShopsAmountToScrap,
    getThreadCount,
    getShopUrl,
  };
}

export type PromptService = ReturnType<typeof createPromptService>;
