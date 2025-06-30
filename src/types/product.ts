export type AttributeEnum = {
  key: string;
  label: string;
};

export type RawProductInfo = {
  id: string;
  key?: string;
  productType: {
    typeId: 'product-type';
    id: string;
  };
  name: {
    [locale: string]: string;
  };
  description?: {
    [locale: string]: string;
  };
  slug: {
    [locale: string]: string;
  };
  categories: {
    typeId: 'category';
    id: string;
  }[];
  masterVariant: {
    id: number;
    sku?: string;
    key?: string;
    prices?: {
      discounted?: {
        discount: {
          typeId: 'product-discount';
          id: string;
        };
        value: {
          type: 'centPrecision';
          currencyCode: string;
          centAmount: number;
          fractionDigits: number;
        };
      };
      id?: string;
      value: {
        type: string;
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
      };
    }[];
    images?: {
      url: string;
      dimensions?: {
        w: number;
        h: number;
      };
      label?: string;
    }[];
    attributes?: {
      name: string;
      value: string | undefined | AttributeEnum;
    }[];
  };
  variants: {
    id: number;
    attributes: {
      name: string;
      value: string | AttributeEnum;
    }[];
    key: string;
  }[];
};

export type ProductInfo = {
  id: string;
  name: string;
  description: string;
  price: string;
  priceWithDiscount?: string;
  discountProcent?: string;
  currency: string;
  imageUrls?: string[];
  colorAttribute?: string;
  modelAttribute?: string;
  sizes: string[];
  masterVariant: {
    id: number;
    key?: string;
    attributes?: {
      name: string;
      value: string | undefined | AttributeEnum;
    }[];
  };
  variants: {
    id: number;
    attributes: {
      name: string;
      value: string | AttributeEnum;
    }[];
    key: string;
  }[];
  categories: {
    typeId: 'category';
    id: string;
  }[];
};
