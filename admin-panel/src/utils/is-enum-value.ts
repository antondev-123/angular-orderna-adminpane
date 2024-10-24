// Utility function to check if a given string is a valid value in an enum
export default function isEnumValue<T extends object>(
  enumObj: T,
  value: string
): boolean {
  // Get all values of the enum
  const enumValues = Object.values(enumObj);
  // Check if the input value is one of the enum values
  return enumValues.includes(value);
}
