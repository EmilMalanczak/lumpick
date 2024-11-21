export const tryOrDefault = async <T, D>(
  callback: () => Promise<T>,
  defaultValue: D,
): Promise<T | D> => {
  try {
    return await callback();
  } catch (_) {
    return defaultValue;
  }
};
