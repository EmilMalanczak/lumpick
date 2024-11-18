import type { ClassValue } from "clsx";
import { clsx } from "clsx";

export { cva as variants } from "class-variance-authority";
export * from "class-variance-authority";

// TODO: add twMerge equivalent
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
