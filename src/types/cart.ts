export type AttributeEnum = {
  key: string;
  label: string;
};

export type Attributes = {
  name: string;
  value: string | AttributeEnum;
};

export type CartInfo = {
  id: string;
  version: number;
  lineItems: Item[];
  totalPrice: {
    type: 'centPrecision';
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  discountCodes: DiscountCode[];
  discountOnTotalPrice: {
    discountedAmount: {
      type: 'centPrecision';
      currencyCode: string;
      centAmount: number;
      fractionDigits: number;
    };
  };
  totalLineItemQuantity: number;
};

export type Item = {
  id: string;
  productId: string;
  name: {
    [locale: string]: string;
  };
  productType: { id: string; typeId: string };
  price: {
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
  };
  quantity: number;
  totalPrice: {
    type: 'centPrecision';
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };

  variant: {
    id: number;
    attributes: Attributes[];
    images: {
      url: string;
    }[];
    key: string;
    prices: {
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
  };

  discountedPricePerQuantity: {};
  taxedPricePortions: {};
  state: {};
};

export type DiscountCode = {
  discountCode: {
    typeId: string;
    id: string;
  };
  state: 'string';
};
