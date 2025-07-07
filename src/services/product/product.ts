import type { RawProductInfo, ProductInfo } from '../../types/product';
import { generalAuthFetch } from '../../utils/auth/general-fetch';

export const getProductById = async (
  id: string,
): Promise<{ data?: ProductInfo; error?: string }> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/product-projections/${id}`;
  try {
    const response = await generalAuthFetch(url, {
      method: 'GET',
    });
    const rawData = await response.json();

    return response.ok
      ? {
          data: getTypedResponse(rawData),
        }
      : { error: rawData.errors };
  } catch {
    return { error: 'Error getting product' };
  }
};

const getTypedResponse = (rawData: RawProductInfo): ProductInfo => {
  const fullPriceCent = rawData.masterVariant?.prices?.[0]?.value?.centAmount;
  let fullPrice = '';
  if (fullPriceCent) {
    fullPrice = getFormatPrice(fullPriceCent);
  }
  const discontedPriceCent =
    rawData.masterVariant?.prices?.[0].discounted?.value.centAmount;
  let discontedPrice = '';
  if (discontedPriceCent) {
    discontedPrice = getFormatPrice(discontedPriceCent);
  }

  const color = rawData.masterVariant?.attributes?.find(
    (att) => att.name === 'color',
  )?.value;

  const occasion = rawData.masterVariant?.attributes?.find(
    (att) => att.name === 'occasion',
  )?.value;

  return {
    id: rawData.id,
    name: rawData.name?.['en-US'] ?? 'No name',
    description: rawData.description?.['en-US'] ?? '',
    price: fullPrice,
    priceWithDiscount: discontedPrice,
    discountProcent: getDiscountPercent(fullPriceCent, discontedPriceCent),
    currency: rawData.masterVariant?.prices?.[0]?.value?.currencyCode ?? '',
    imageUrls:
      rawData.masterVariant?.images?.map((img: { url: string }) => img.url) ??
      [],
    colorAttribute: typeof color === 'string' ? color : '',
    occasionAttribute: typeof occasion === 'object' ? occasion.key : '',
    masterVariant: rawData.masterVariant,
    variants: rawData.variants,
    categories: rawData.categories,
  };
};

function getDiscountPercent(
  fullPrice: number | undefined,
  discountedPrice: number | undefined,
): string {
  if (fullPrice && discountedPrice) {
    const discountPercent = (
      ((fullPrice - discountedPrice) / fullPrice) *
      100
    ).toFixed();
    return `${discountPercent}%`;
  }
  return '';
}

function getFormatPrice(price: number): string {
  return (price / 100).toFixed(2);
}
