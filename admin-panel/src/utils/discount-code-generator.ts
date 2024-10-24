export function generateRandomDiscountCode(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let discountCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    discountCode += chars[randomIndex];
  }

  return discountCode;
}
