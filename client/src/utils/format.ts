export const priceFormat = (number: number) => {
  return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
