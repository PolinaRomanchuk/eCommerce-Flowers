import * as Yup from 'yup';
import type { UserProfileAddress } from '../types/user-profile';

export const userProfileValidation = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .matches(/^[A-Za-z]+$/, 'First name should contain only letters'),
  lastName: Yup.string()
    .required('Last name is required')
    .matches(/^[A-Za-z]+$/, 'Last name should contain only letters'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date cannot be in the future'),

  authenticationMode: Yup.string()
    .nullable()
    .oneOf(['Password', 'External'], 'Invalid authentication mode'),

  addresses: Yup.array<UserProfileAddress>()
    .of(
      Yup.object({
        id: Yup.string().required(),
        street: Yup.string().required('Street is required'),
        city: Yup.string()
          .required('City is required')
          .matches(/^[A-Za-z\s]+$/, 'City should contain only letters'),
        postalCode: Yup.string().required('Postal code is required'),
        country: Yup.string()
          .required('Country is required')
          .matches(/^[A-Z]{2}$/, 'Country must be in ISO format (e.g. US)'),
        isDefaultShipping: Yup.boolean(),
        isDefaultBilling: Yup.boolean(),
      }),
    )
    .required('Addresses are required'),
});
