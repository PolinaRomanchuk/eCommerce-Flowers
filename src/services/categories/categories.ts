import type { ProductType, Category } from '../../types/categories';
import { generalAuthFetch } from '../../utils/auth/general-fetch';

export async function fetchCategoryName(id: string): Promise<string> {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/categories/${id}`;
  try {
    const response = await generalAuthFetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();

    return data.name['en-US'];
  } catch (error) {
    throw error;
  }
}
export async function fetchCategories(): Promise<{ data: Category[] }> {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/categories`;
  try {
    const response = await generalAuthFetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();

    return { data: data.results };
  } catch (error) {
    throw error;
  }
}

export async function fetchTypes(): Promise<{ data: ProductType[] }> {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/product-types`;
  try {
    const response = await generalAuthFetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();

    return { data: data.results };
  } catch (error) {
    throw error;
  }
}

export async function fetchColors(): Promise<string[]> {
  const projectKey = process.env.REACT_APP_CT_PROJECT_KEY;
  const apiUrl = process.env.REACT_APP_CT_API_URL;

  const url = `${apiUrl}/${projectKey}/product-projections`;

  const response = await generalAuthFetch(url, { method: 'GET' });
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await response.json();

  const colorValues = new Set<string>();

  for (const product of data.results) {
    const attributes = product.masterVariant?.attributes ?? [];
    for (const attribute of attributes) {
      if (
        attribute.name.toLowerCase().includes('color') &&
        typeof attribute.value === 'string'
      ) {
        colorValues.add(attribute.value);
      }
    }
  }

  return Array.from(colorValues);
}

export async function fetchOccasions(): Promise<string[]> {
  const projectKey = process.env.REACT_APP_CT_PROJECT_KEY;
  const apiUrl = process.env.REACT_APP_CT_API_URL;

  const url = `${apiUrl}/${projectKey}/product-projections`;

  const response = await generalAuthFetch(url, { method: 'GET' });
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data = await response.json();

  const occasionValues = new Set<string>();

  for (const product of data.results) {
    const attributes = product.masterVariant?.attributes ?? [];
    for (const attribute of attributes) {
      if (
        attribute.name.toLowerCase().includes('occasion') &&
        typeof attribute.value === 'object'
      ) {
        occasionValues.add(attribute.value.key);
      }
    }
  }

  return Array.from(occasionValues);
}