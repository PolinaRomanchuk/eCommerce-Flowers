const LIMIT_PRODUCTS_PER_PAGE = 6;

import type {
  Product,
  ProductProjection,
  ProductProjectionsResponse,
} from '../../types/catalog';
import { generalAuthFetch } from '../../utils/auth/general-fetch';
import { getFormatPrice } from '../../utils/format-attributes';

export async function fetchAllProducts(
  page: number,
  limit: number = LIMIT_PRODUCTS_PER_PAGE,
): Promise<{ products: Product[]; total: number }> {
  const offset = (page - 1) * limit;
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/product-projections?limit=${limit}&offset=${offset}`;
  try {
    const response = await generalAuthFetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    const transformed = transformResponse(data);
    return { products: transformed, total: data.total };
  } catch (error) {
    throw error;
  }
}

export async function fetchFilteredProducts(
  filter: {
    color?: string;
    occasion?: string;
    price?: string;
    type?: string;
    categoryId?: string;
  },
  sort: string,
  search: string,
  page: number = 1,
  limit: number = LIMIT_PRODUCTS_PER_PAGE,
): Promise<{ products: Product[]; total: number }> {
  const offset = (page - 1) * limit;

  const projectKey = process.env.REACT_APP_CT_PROJECT_KEY;
  const apiUrl = process.env.REACT_APP_CT_API_URL;

  const url = new URL(
    `${apiUrl}/${projectKey}/product-projections/search?limit=${limit}&offset=${offset}`,
  );
  if (filter.color) {
    url.searchParams.append(
      'filter',
      `variants.attributes.color:"${filter.color}"`,
    );
  }
  if (filter.occasion) {
    url.searchParams.append(
      'filter',
      `variants.attributes.occasion.key:"${filter.occasion}"`,
    );
  }
  if (filter.price) {
    const [fromString, toString_] = filter.price.split('-');
    const from = fromString ? Number(fromString) * 100 : undefined;
    const to = toString_ ? Number(toString_) * 100 : undefined;

    if (from !== undefined || to !== undefined) {
      const range = `range(${from ?? '*'} to ${to ?? '*'})`;
      url.searchParams.append('priceCurrency', 'USD');
      url.searchParams.append(
        'filter',
        `variants.scopedPrice.currentValue.centAmount:${range}`,
      );
    }
  }
  if (filter.type) {
    url.searchParams.append('filter', `productType.id:"${filter.type}"`);
  }
  if (sort) {
    url.searchParams.append('sort', `${sort}`);
  }
  if (filter.categoryId) {
    url.searchParams.append(
      'filter.query',
      `categories.id:"${filter.categoryId}"`,
    );
  }
  const response = await generalAuthFetch(url.toString(), { method: 'GET' });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await response.json();
  let transformed = transformResponse(data);
  let result = transformed.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase().trim()),
  );
  return { products: result, total: data.total };
}

export function transformResponse(data: ProductProjectionsResponse): Product[] {
  return data.results.map((item: ProductProjection) => {
    const priceEntry = item.masterVariant?.prices?.[0];
    let fullPrice = '';
    const originalPrice = priceEntry?.value.centAmount ?? 0;
    fullPrice = getFormatPrice(originalPrice);
    const discountedPrice = priceEntry?.discounted?.value.centAmount;

    return {
      id: item.id,
      name: item.name?.['en-US'] ?? 'No name',
      description: item.description?.['en-US'] ?? '',
      image: item.masterVariant?.images?.[0]?.url ?? '',
      prices: fullPrice,
      discountedPrice: getFormatPrice(discountedPrice),
      masterVariantId: item.masterVariant?.id,
    };
  });
}
