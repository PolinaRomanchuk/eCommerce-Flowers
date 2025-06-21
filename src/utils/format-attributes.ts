import type { Attributes } from '../types/cart';

export const formatAttribute = (
  attributes: Attributes[],
  keyWord: string,
): string => {
  if (keyWord === 'size') {
    const result = attributes.find((x) => x.name === keyWord)?.value;
    return typeof result === 'object' ? result.label : '';
  }
  const result = attributes.find((x) => x.name === keyWord)?.value;
  return typeof result === 'string' ? result : '';
};

export function getFormatPrice(price: number | undefined): string {
  if (price) {
    return (price / 100).toFixed(2);
  }
  return '';
}
