import type { RegistrationValues } from '../types/registration';

export const initialValues: RegistrationValues = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  shippingAddress: {
    id: '',
    streetName: '',
    city: '',
    postalCode: '',
    country: '',
  },
  billingAddress: {
    id: '',
    streetName: '',
    city: '',
    postalCode: '',
    country: '',
  },
  useSameAddress: false,
  defaultShippingAddress: false,
  defaultBillingAddress: false,
};
