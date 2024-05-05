export const terminalLoading = (
  text = "",
  chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"],
  delay = 100,
) => {
  let x = 0;

  const intervalId = setInterval(() => {
    process.stdout.write("\r" + chars[x++] + " " + text + "\r");
    x = x % chars.length;
  }, delay);

  return () => {
    clearInterval(intervalId);
  };
};

export const withTerminalLoader = async <D>(
  callback: () => Promise<D>,
  loaderText = "Loading",
): Promise<D> => {
  const stopLoading = terminalLoading(loaderText);

  try {
    return await callback();
  } finally {
    stopLoading();
  }
};
