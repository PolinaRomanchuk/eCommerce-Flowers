import type {
  RegistrationValues,
  UserDataRegistration,
} from '../types/registration';

export function formatValuesToRegistration(
  values: RegistrationValues,
): UserDataRegistration {
  const addresses = [];
  const shippingAddressIndex = 0;
  let billingAddressIndex = 0;
  addresses.push(values.shippingAddress);

  if (!values.useSameAddress) {
    addresses.push(values.billingAddress);
    billingAddressIndex = 1;
  }

  return {
    email: values.email,
    password: values.password,
    firstName: values.firstName,
    lastName: values.lastName,
    dateOfBirth: values.dateOfBirth,
    addresses,
    defaultShippingAddress: values.defaultShippingAddress
      ? shippingAddressIndex
      : undefined,
    defaultBillingAddress: values.defaultBillingAddress
      ? billingAddressIndex
      : undefined,
  };
}
