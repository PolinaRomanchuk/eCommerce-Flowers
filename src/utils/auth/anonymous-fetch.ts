import { getAnonymousToken } from '../../services/login/auth';

export const anonymousAuthFetch = async (
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> => {
  let token = localStorage.getItem('anonymous-token');

  const response = await fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    const { data, error } = await getAnonymousToken();

    if (data?.access_token) {
      localStorage.setItem('anonymous-token', data.access_token);

      return fetch(input, {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${data.access_token}`,
        },
      });
    }
  }

  return response;
};
