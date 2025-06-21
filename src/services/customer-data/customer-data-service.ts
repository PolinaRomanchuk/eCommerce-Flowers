import type {
  UserProfile,
  ChangePasswordPayload,
} from '../../types/user-profile';
import type { Address } from '../../types/registration';
import { authFetch } from '../../utils/auth/auth-fetch';
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
export async function fetchCustomerProfile(): Promise<UserProfile> {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me`;
  const response = await authFetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new CtError(response.status, data);
  }
  return data as UserProfile;
}

export async function changeCustomerPassword(
  payload: ChangePasswordPayload,
): Promise<{ data?: UserProfile; error?: string }> {
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me/password`;
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  return response.ok ? { data } : { error: data.errors[0].code };
}

export async function addCustomerAddress(
  version: number,
  address: Address,
): Promise<UserProfile> {
  const actions = [{ action: 'addAddress', address }];
  const body = { version, actions };
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me`;
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new CtError(response.status, data);
  }
  return data as UserProfile;
}

export async function removeCustomerAddress(
  version: number,
  addressId: string,
): Promise<UserProfile> {
  const actions = [{ action: 'removeAddress', addressId }];
  const body = { version, actions };
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me`;
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new CtError(response.status, data);
  }
  return data as UserProfile;
}

export async function changeCustomerAddress(
  version: number,
  addressId: string,
  address: Address,
): Promise<UserProfile> {
  const actions = [{ action: 'changeAddress', addressId, address }];
  const body = { version, actions };
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me`;
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new CtError(response.status, data);
  }
  return data as UserProfile;
}

export async function setDefaultAddress(
  version: number,
  addressId: string,
  addressType: string,
): Promise<UserProfile> {
  const actions = [{ action: `setDefault${addressType}Address`, addressId }];
  const body = { version, actions };
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me`;
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new CtError(response.status, data);
  }
  return data as UserProfile;
}

export async function removeDefaultAddress(
  version: number,
  addressId: string,
  addressType: string,
): Promise<UserProfile> {
  const actions = [{ action: `remove${addressType}AddressId`, addressId }];
  const body = { version, actions };
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me`;
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new CtError(response.status, data);
  }
  return data as UserProfile;
}

export async function updateCustomerProfileWithoutAddresses(
  version: number,
  updates: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  },
): Promise<{ data?: UserProfile; error?: string }> {
  const actions = [
    { action: 'setFirstName', firstName: updates.firstName },
    { action: 'setLastName', lastName: updates.lastName },
    { action: 'changeEmail', email: updates.email },
    { action: 'setDateOfBirth', dateOfBirth: updates.dateOfBirth },
  ];
  const body = { version, actions };
  const url = `${process.env.REACT_APP_CT_API_URL}/${process.env.REACT_APP_CT_PROJECT_KEY}/me`;
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return response.ok ? { data } : { error: data.errors[0].code };
}
