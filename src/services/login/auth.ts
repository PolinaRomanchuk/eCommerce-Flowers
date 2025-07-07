import type { AuthResponse } from '../../types/auth';

export const getAnonymousToken = async (): Promise<{
  data?: AuthResponse;
  error?: string;
}> => {
  const url = `${process.env.REACT_APP_CT_AUTH_URL}/oauth/${process.env.REACT_APP_CT_PROJECT_KEY}/anonymous/token`;

  const scopes = [
    'view_published_products',
    'create_anonymous_token',
    'manage_my_business_units',
    'view_categories',
    'manage_my_payments',
    'manage_my_profile',
    'manage_my_quotes',
    'manage_my_orders',
    'manage_my_shopping_lists',
    'view_discount_codes',
    'view_products',
  ];
  const scopeString = scopes
    .map((scope) => `${scope}:${process.env.REACT_APP_CT_PROJECT_KEY}`)
    .join(' ');

  const authBody = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: scopeString,
  });

  const authHeader = `Basic ${btoa(
    `${process.env.REACT_APP_CT_CLIENT_ID}:${process.env.REACT_APP_CT_CLIENT_SECRET}`,
  )}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: authBody.toString(),
    });

    const data = await response.json();
    return response.ok ? { data } : { error: data.error_description };
  } catch {
    return { error: 'Could not get anonymous token' };
  }
};

export const authenticateCustomer = async (
  email: string,
  password: string,
): Promise<{ userId?: string; loginError?: string }> => {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/login`;
  const token = localStorage.getItem('anonymous-token');

  const authBody = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authBody),
    });
    const data = await response.json();

    return response.ok
      ? { userId: data.customer.id }
      : { loginError: data.error_description };
  } catch {
    return { loginError: 'Login failed' };
  }
};

export const getAuthenticationToken = async (
  email: string,
  password: string,
): Promise<{ data?: AuthResponse; error?: string }> => {
  const url = `${process.env.REACT_APP_CT_AUTH_URL}/oauth/${process.env.REACT_APP_CT_PROJECT_KEY}/customers/token`;

  const scopes = [
    'view_published_products',
    'create_anonymous_token',
    'manage_my_business_units',
    'view_categories',
    'manage_my_payments',
    'manage_my_profile',
    'manage_my_quotes',
    'manage_my_orders',
    'manage_my_shopping_lists',
    'view_discount_codes',
    'view_products',
  ];
  const scopeString = scopes
    .map((scope) => `${scope}:${process.env.REACT_APP_CT_PROJECT_KEY}`)
    .join(' ');

  const authBody = new URLSearchParams({
    grant_type: 'password',
    username: email,
    password: password,
    scope: scopeString,
  });

  const authHeader = `Basic ${btoa(
    `${process.env.REACT_APP_CT_CLIENT_ID}:${process.env.REACT_APP_CT_CLIENT_SECRET}`,
  )}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: authBody.toString(),
    });

    const data = await response.json();
    return response.ok ? { data } : { error: data.error_description };
  } catch {
    return { error: 'Login failed' };
  }
};

export const getRefreshToken = async (): Promise<{
  token?: string;
  error?: string;
}> => {
  const url = `${process.env.REACT_APP_CT_AUTH_URL}/oauth/token`;
  const token = localStorage.getItem('refresh-token');

  const authHeader = `Basic ${btoa(
    `${process.env.REACT_APP_CT_CLIENT_ID}:${process.env.REACT_APP_CT_CLIENT_SECRET}`,
  )}`;

  const authBody = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: token ?? '',
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: authBody.toString(),
    });

    const data = await response.json();
    if (response.ok && data.access_token) {
      localStorage.setItem('customer-token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh-token', data.refresh_token);
      }
      return { token: data.access_token };
    }

    return { error: data.error_description };
  } catch {
    return { error: 'Refresh token failed' };
  }
};
