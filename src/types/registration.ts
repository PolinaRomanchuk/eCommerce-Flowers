export interface Address {
  id: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface RegistrationValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  shippingAddress: Address;
  billingAddress: Address;
  useSameAddress: boolean;
  defaultShippingAddress: boolean;
  defaultBillingAddress: boolean;
}

export type UserDataRegistration = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  defaultShippingAddress: number | undefined;
  defaultBillingAddress: number | undefined;
};
