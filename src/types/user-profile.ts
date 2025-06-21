export interface UserProfileAddress {
  id: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface UserProfile {
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  isEmailVerified: boolean;
  authenticationMode: string;
  addresses: UserProfileAddress[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
}

export interface ChangePasswordPayload {
  version: number;
  currentPassword: string;
  newPassword: string;
}
