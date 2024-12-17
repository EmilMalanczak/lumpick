import { confirm, input, select } from "@inquirer/prompts";

export class PromptService {
  public async confirmAction(message: string, defaultValue = true) {
    return confirm({
      message,
      default: defaultValue,
    });
  }

  public async getAmount(
    message: string,
    {
      defaultValue = 1,
      validate,
    }: {
      defaultValue?: number;
      validate?: (value: number) => string | boolean;
    } = {},
  ) {
    return Number(
      await input({
        message,
        validate: (value) => {
          const parsedValue = Number(value);

          return Number.isNaN(parsedValue)
            ? "You must provide a number"
            : validate
              ? validate(parsedValue)
              : true;
        },
        default: String(defaultValue),
      }),
    );
  }

  public async getUrl() {
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

  public async selectAction<T>(actions: Array<{ name: string; value: T }>) {
    return await select({
      message: "What do you want to do?",
      choices: actions,
    });
  }
}
