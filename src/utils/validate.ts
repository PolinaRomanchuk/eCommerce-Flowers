export const validatePassword = (
  password: string,
  previousPassword?: string,
): string => {
  const trimmedPassword = password.trim();
  if (previousPassword && password === previousPassword) {
    return 'Enter a new password different from the previous one';
  }
  if (password === '') {
    return 'Password is required';
  }
  if (trimmedPassword.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(trimmedPassword)) {
    return 'Password must contain at least one uppercase letter (A–Z)';
  }
  if (!/[a-z]/.test(trimmedPassword)) {
    return 'Password must contain at least one lowercase letter (a–z)';
  }
  if (!/[0-9]/.test(trimmedPassword)) {
    return 'Password must contain at least one digit (0–9)';
  }
  if (password !== trimmedPassword) {
    return 'Password must not contain leading or trailing whitespace';
  }

  return '';
};

export const validateOldPassword = (password: string): string => {
  if (password === '') {
    return 'This field is required';
  }

  return '';
};

export const validatePasswordConfirm = (
  confpassword: string,
  password: string,
): string => {
  if (confpassword !== password) {
    return `Passwords don't match`;
  }
  return '';
};

export const validateLogin = (login: string): string => {
  const trimmedLogin = login.trim();

  if (login === '') {
    return 'Email address is required';
  }
  if (login !== trimmedLogin) {
    return 'Email address must not contain leading or trailing whitespace';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedLogin)) {
    return 'Email address must be properly formatted (e.g., user@example.com)';
  }
  return '';
};

const today = new Date();
const minBirthDate = new Date(
  today.getFullYear() - 13,
  today.getMonth(),
  today.getDate(),
);
const earliestYear = 1925;
const latestYear = minBirthDate.getFullYear();

export const validateFirstName = (name: string): string => {
  if (!name.trim()) {
    return 'First name is required';
  }
  if (!/^[A-Za-z]+$/.test(name)) {
    return 'First name should contain only letters';
  }
  return '';
};

export const validateLastName = (name: string): string => {
  if (!name.trim()) {
    return 'Last name is required';
  }
  if (!/^[A-Za-z]+$/.test(name)) {
    return 'Last name should contain only letters';
  }
  return '';
};

export const validateDateOfBirth = (value: string): string => {
  if (!value) {
    return 'Date of birth is required';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return 'Date must be in YYYY-MM-DD format';
  }
  const year = parseInt(value.slice(0, 4), 10);
  if (year < earliestYear || year > latestYear) {
    return `Year must be between ${earliestYear} and ${latestYear}`;
  }
  const date = new Date(value);
  if (isNaN(date.getTime()) || date > minBirthDate) {
    return 'You must be at least 13 years old';
  }
  return '';
};

export const validateStreet = (street: string): string => {
  if (!street.trim()) {
    return 'Street is required';
  }
  return '';
};

export const validateCity = (city: string): string => {
  if (!city.trim()) {
    return 'City is required';
  }
  if (!/^[A-Za-z\s]+$/.test(city)) {
    return 'City should contain only letters';
  }
  return '';
};

export const validateCountry = (country: string): string => {
  if (!country) {
    return 'Country is required';
  }
  const allowed = ['BY', 'PL', 'GE'];
  if (!allowed.includes(country)) {
    return 'Must be BY, PL, or GE';
  }
  return '';
};

export const validatePostalCode = (
  postalCode: string,
  country: string,
): string => {
  if (!postalCode.trim()) {
    return 'Postal code is required';
  }
  switch (country) {
    case 'BY':
      if (!/^\d{6}$/.test(postalCode)) {
        return 'Belarusian postal code must have 6 numbers';
      }
      break;
    case 'PL':
      if (!/^\d{2}-\d{3}$/.test(postalCode)) {
        return 'Polish postal code must be in format 00-000';
      }
      break;
    case 'GE':
      if (!/^\d{4}$/.test(postalCode)) {
        return 'Georgian postal code must have 4 numbers';
      }
      break;
    default:
      break;
  }
  return '';
};
