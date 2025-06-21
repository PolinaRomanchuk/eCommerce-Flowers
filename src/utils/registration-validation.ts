import * as Yup from 'yup';

const today = new Date();
const minBirthDate = new Date(
  today.getFullYear() - 13,
  today.getMonth(),
  today.getDate(),
);
export const minBirthDateString = minBirthDate.toISOString().split('T')[0];

const earliestYear = 1925;
const latestYear = minBirthDate.getFullYear();

export const registrationValidation = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number',
    ),

  firstName: Yup.string()
    .required('First name is required')
    .matches(/^[A-Za-z]+$/, 'First name should contain only letters'),

  lastName: Yup.string()
    .required('Last name is required')
    .matches(/^[A-Za-z]+$/, 'Last name should contain only letters'),

  dateOfBirth: Yup.string()
    .required('Date of birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .test(
      'year-range',
      `Year must be between ${earliestYear} and ${latestYear}`,
      (value) => {
        if (!value) {
          return false;
        }
        const year = parseInt(value.slice(0, 4), 10);
        if (year < earliestYear || year > latestYear) {
          return false;
        }
        return true;
      },
    )
    .test('age-min', 'You must be at least 13 years old', (value) => {
      if (!value) {
        return false;
      }
      const date = new Date(value);
      if (isNaN(date.getTime()) || date > minBirthDate) {
        return false;
      }
      return true;
    }),

  shippingAddress: Yup.object({
    streetName: Yup.string().required('Street is required'),
    city: Yup.string()
      .required('City is required')
      .matches(/^[A-Za-z\s]+$/, 'City should contain only letters'),
    country: Yup.string()
      .required('Country is required')
      .oneOf(['BY', 'PL', 'GE'], 'Must be BY, PL, or GE'),
    postalCode: Yup.string()
      .required('Postal code is required')
      .when('country', {
        is: 'BY',
        then: (schema) =>
          schema.matches(
            /^\d{6}$/,
            'Belarusian postal code must have 6 numbers',
          ),
      })
      .when('country', {
        is: 'PL',
        then: (schema) =>
          schema.matches(
            /^\d{2}-\d{3}$/,
            'Polish postal code must be in format 00-000',
          ),
      })
      .when('country', {
        is: 'GE',
        then: (schema) =>
          schema.matches(/^\d{4}$/, 'Georgian postal code must have 4 numbers'),
      }),
  }),

  useSameAddress: Yup.boolean(),

  billingAddress: Yup.object({
    streetName: Yup.string().required('Street is required'),
    city: Yup.string()
      .required('City is required')
      .matches(/^[A-Za-z\s]+$/, 'City should contain only letters'),
    country: Yup.string()
      .required('Country is required')
      .oneOf(['BY', 'PL', 'GE'], 'Must be BY, PL, or GE'),

    postalCode: Yup.string()
      .required('Postal code is required')
      .when('country', {
        is: 'BY',
        then: (schema) =>
          schema.matches(
            /^\d{6}$/,
            'Belarusian postal code must have 6 numbers',
          ),
      })
      .when('country', {
        is: 'PL',
        then: (schema) =>
          schema.matches(
            /^\d{2}-\d{3}$/,
            'Polish postal code must be in format 00-000',
          ),
      })
      .when('country', {
        is: 'GE',
        then: (schema) =>
          schema.matches(/^\d{4}$/, 'Georgian postal code must have 4 numbers'),
      }),
  }),

  defaultShippingAddress: Yup.boolean(),
  defaultBillingAddress: Yup.boolean(),
});
