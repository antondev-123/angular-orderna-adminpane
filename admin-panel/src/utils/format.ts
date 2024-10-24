// Format the phone number
// +631234567891 => +63 123-456-7891;
export function formatPhilippinePhoneNumber(phone: string): string {
  const countryCode = phone.substring(0, 3); // "+63"
  const firstPart = phone.substring(3, 6); // "123"
  const middlePart = phone.substring(6, 9); // "456"
  const lastPart = phone.substring(9, 14); // "7891"

  // Join parts to create formatted phone number
  return `${countryCode} ${firstPart}-${middlePart}-${lastPart}`;
}
