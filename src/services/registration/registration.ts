import type { UserDataRegistration } from '../../types/registration';
import type { CustomerResponse } from '../../types/auth';
import { anonymousAuthFetch } from '../../utils/auth/anonymous-fetch';

export class CtError extends Error {
  public status: number;
  public data: unknown;

  constructor(status: number, data: unknown) {
    super(`Commercetools API error: ${status}`);
    this.name = 'CtError';
    this.status = status;
    this.data = data;
  }
}

export async function registerCustomer(
  values: UserDataRegistration,
): Promise<CustomerResponse> {
  const signupUrl = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/signup`;
  const payload = {
    email: values.email,
    password: values.password,
    firstName: values.firstName,
    lastName: values.lastName,
    dateOfBirth: values.dateOfBirth,
    addresses: values.addresses,
    defaultShippingAddress: values.defaultShippingAddress,
    defaultBillingAddress: values.defaultBillingAddress,
  };

  const signupResponse = await anonymousAuthFetch(signupUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!signupResponse.ok) {
    const errorData = await signupResponse.json().catch(() => ({}));
    throw new CtError(signupResponse.status, errorData);
  }

  const responseJson = await signupResponse.json();

  return responseJson.customer;
}
