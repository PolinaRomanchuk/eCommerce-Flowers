import { getRefreshToken } from '../../services/login/auth';
import { logoutFromContext } from './logout-helper';

export const authFetch = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('customer-token');

  const response = await fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    const { token: newToken, error } = await getRefreshToken();

    if (newToken) {
      return fetch(input, {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    } else {
      logoutFromContext();
    }
  }

  return response;
};
