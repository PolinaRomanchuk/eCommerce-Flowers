export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  prices: string;
  discountedPrice?: string;
  masterVariantId: number;
};
export type Price = {
  value: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  discounted?: {
    value: {
      type: string;
      currencyCode: string;
      centAmount: number;
      fractionDigits: number;
    };
    discount: {
      typeId: string;
      id: string;
    };
  };
};

export interface ProductProjection {
  id: string;
  name?: { [locale: string]: string };
  description?: { [locale: string]: string };
  masterVariant: {
    id: number;
    images?: { url: string }[];
    prices?: Price[];
  };
}

export interface ProductProjectionsResponse {
  results: ProductProjection[];
  limit: number;
  offset: number;
  count: number;
  total: number;
}
