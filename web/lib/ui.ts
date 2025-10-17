import { type ClassValue, clsx } from "clsx";

/**
 * Combines className strings using clsx
 */
export function cn(...classes: ClassValue[]): string {
  return clsx(classes);
}

/**
 * Formats a number with specified decimal places
 */
export function num(value: number, decimalPlaces: number = 2): string {
  return value.toFixed(decimalPlaces);
}

/**
 * Formats a timestamp (milliseconds) into a readable date string
 */
export function dateFmt(ms: number): string {
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
