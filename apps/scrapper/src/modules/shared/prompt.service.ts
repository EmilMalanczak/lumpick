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

  public async getText(message: string) {
    return input({
      message,
    });
  }

  public async selectAction<T>(
    actions: Array<{
      name: string;
      type: T;
      handler?: () => Promise<void>;
    }>,
  ) {
    const selectedAction = await await select({
      message: "What do you want to do?",
      choices: actions.map(({ name, type }) => ({ name, value: type })),
    });

    const action = actions.find(({ type }) => type === selectedAction);

    if (!action) {
      throw new Error("Action not found");
    }

    return action;
  }
}
