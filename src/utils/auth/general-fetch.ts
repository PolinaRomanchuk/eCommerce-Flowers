import { authFetch } from './auth-fetch';
import { anonymousAuthFetch } from './anonymous-fetch';

export const generalAuthFetch = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  const customerToken = localStorage.getItem('customer-token');
  if (customerToken) {
    return authFetch(input, init);
  }
  return anonymousAuthFetch(input, init);
};
