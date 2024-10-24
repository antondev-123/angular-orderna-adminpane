// Utility function to check if a given string is a key of a specific type
export function isKeyOf<T extends object>(
  obj: T,
  key: string | number | symbol
): key is keyof T {
  return key in obj;
}
