import type { CartInfo } from '../../types/cart';

export const getCart = async (): Promise<{
  data?: CartInfo;
  error?: string;
}> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/active-cart`;
  const token =
    localStorage.getItem('customer-token') ||
    localStorage.getItem('anonymous-token');

  if (token) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const rawData = await response.json();

      return response.ok
        ? {
            data: rawData,
          }
        : { error: rawData.errors };
    } catch {
      return { error: 'Error getting cart' };
    }
  } else {
    return { error: 'Error getting cart' };
  }
};

export const updateProductCount = async (
  id: string,
  version: number,
  quantity: number,
  lineItemId: string,
): Promise<{
  data?: CartInfo;
  error?: string;
}> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/carts/${id}`;
  const token =
    localStorage.getItem('customer-token') ||
    localStorage.getItem('anonymous-token');

  const actions = [
    {
      action: 'changeLineItemQuantity',
      lineItemId: lineItemId,
      quantity: quantity,
    },
  ];

  const body = { version, actions };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const rawData = await response.json();

    return response.ok
      ? {
          data: rawData,
        }
      : { error: rawData.errors };
  } catch {
    return { error: 'Error getting cart' };
  }
};

export const removeProduct = async (
  id: string,
  version: number,
  lineItemId: string,
): Promise<{
  data?: CartInfo;
  error?: string;
}> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/carts/${id}`;
  const token =
    localStorage.getItem('customer-token') ||
    localStorage.getItem('anonymous-token');

  const actions = [
    {
      action: 'removeLineItem',
      lineItemId: lineItemId,
    },
  ];

  const body = { version, actions };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const rawData = await response.json();

    return response.ok
      ? {
          data: rawData,
        }
      : { error: rawData.errors };
  } catch {
    return { error: 'Error getting cart' };
  }
};

export const removeCart = async (
  id: string,
  version: number,
): Promise<{
  data?: CartInfo;
  error?: string;
}> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/carts/${id}?version=${version}`;
  const token =
    localStorage.getItem('customer-token') ||
    localStorage.getItem('anonymous-token');

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const rawData = await response.json();

    return response.ok
      ? {
          data: rawData,
        }
      : { error: rawData.errors };
  } catch {
    return { error: 'Error getting cart' };
  }
};

export const addPromo = async (
  id: string,
  version: number,
  code: string,
): Promise<{
  data?: CartInfo;
  error?: string;
}> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/carts/${id}`;
  const token =
    localStorage.getItem('customer-token') ||
    localStorage.getItem('anonymous-token');

  const actions = [
    {
      action: 'addDiscountCode',
      code: code,
    },
  ];

  const body = { version, actions };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const rawData = await response.json();

    return response.ok
      ? {
          data: rawData,
        }
      : { error: rawData.errors };
  } catch {
    return { error: 'Error getting cart' };
  }
};

export const removePromo = async (
  id: string,
  version: number,
  typeId: string,
  promoId: string,
): Promise<{
  data?: CartInfo;
  error?: string;
}> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/carts/${id}`;
  const token =
    localStorage.getItem('customer-token') ||
    localStorage.getItem('anonymous-token');

  const actions = [
    {
      action: 'removeDiscountCode',
      discountCode: {
        typeId: typeId,
        id: promoId,
      },
    },
  ];

  const body = { version, actions };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const rawData = await response.json();

    return response.ok
      ? {
          data: rawData,
        }
      : { error: rawData.errors };
  } catch {
    return { error: 'Error getting cart' };
  }
};

export const checkIfCartExists = async (): Promise<{
  success: boolean;
}> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/active-cart`;
  const token =
    localStorage.getItem('customer-token') ||
    localStorage.getItem('anonymous-token');
  if (token) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch {
      return { success: false };
    }
  } else {
    return { success: false };
  }
};

export const addProductToCart = async (
  id: string,
  version: number,
  productId: string,
): Promise<{
  data?: CartInfo;
  error?: string;
}> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/carts/${id}`;
  const token =
    localStorage.getItem('customer-token') ||
    localStorage.getItem('anonymous-token');

  const actions = [
    {
      action: 'addLineItem',
      productId: productId,
      quantity: 1,
    },
  ];

  const body = { version, actions };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const rawData = await response.json();

    return response.ok
      ? {
          data: rawData,
        }
      : { error: rawData.errors };
  } catch {
    return { error: 'Error getting cart' };
  }
};

export const createNewCart = async (): Promise<{
  data?: CartInfo;
  error?: string;
}> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/carts`;
  const token =
    localStorage.getItem('customer-token') ||
    localStorage.getItem('anonymous-token');

  const body = { currency: 'USD' };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const rawData = await response.json();

    return response.ok
      ? {
          data: rawData,
        }
      : { error: rawData.errors };
  } catch {
    return { error: 'Error getting cart' };
  }
};
