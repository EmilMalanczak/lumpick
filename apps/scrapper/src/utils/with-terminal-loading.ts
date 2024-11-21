/* eslint-disable @typescript-eslint/no-explicit-any */
type LoaderState<TState extends Record<string, any>> = {
  text: string;
  state?: TState;
};

type LoaderOptions<TState extends Record<string, any>> = {
  chars?: string[];
  delay?: number;
  onTick?: (state: LoaderState<TState>) => string;
};

export const createTerminalLoader = <TData extends Record<string, any>>(
  defaultState: LoaderState<TData> = { text: "" },
  options: LoaderOptions<TData> = {},
) => {
  const {
    chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"],
    delay = 100,
    onTick = (state) => state.text,
  } = options;

  let spinnerIndex = 0;
  let intervalId: NodeJS.Timeout | null = null;
  let currentState = defaultState;
  let isActive = false;

  const updateState = (newState: Partial<LoaderState<TData>>) => {
    currentState = { ...currentState, ...newState };
  };

  const render = () => {
    const spinner = chars[spinnerIndex];
    spinnerIndex = (spinnerIndex + 1) % chars.length;

    const output = `${spinner} ${onTick(currentState)}`;
    process.stdout.write(`\r\x1b[2K${output}`);
  };

  const start = () => {
    if (isActive) return;

    isActive = true;
    process.stdout.write("\n"); // Ensure we start on a new line
    intervalId = setInterval(render, delay);
  };

  const pause = () => {
    if (!isActive) return;

    isActive = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const stop = () => {
    if (!isActive) return;

    pause();
    process.stdout.write("\n"); // Ensure we end with a new line
  };

  const log = (message: string) => {
    if (isActive) {
      pause();
      process.stdout.write(`\r\x1b[2K${message}`);
      start();
    } else {
      process.stdout.write(message);
    }
  };

  return {
    start,
    stop,
    updateState,
    log,
  };
};

export const withTerminalLoader = async <
  TData,
  TState extends Record<string, any>,
>(
  callback: () => Promise<TData>,
  text: string | (() => string) = "Loading",
  options: LoaderOptions<TState> = {},
): Promise<TData> => {
  const getMessage = () => (typeof text === "function" ? text() : text);

  const loader = createTerminalLoader<TState>(
    { text: getMessage() },
    {
      ...options,
      onTick: options.onTick ?? ((state) => state.text),
    },
  );

  loader.start();

  try {
    const result = await callback();

    return result;
  } finally {
    loader.stop();
  }
};
