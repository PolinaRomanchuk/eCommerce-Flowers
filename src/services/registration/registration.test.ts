import { CtError, registerCustomer } from './registration';
import type { CustomerResponse } from '../../types/auth';

global.fetch = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
});

test('registerCustomer returns customer if registration is successful', async () => {
  const mockResponse: CustomerResponse = {
    addresses: [],
    email: 'test-email',
    firstName: 'test-name',
    id: 'test-id',
    lastName: 'test-last-name',
    password: 'test-password',
    createdAt: 'test-create',
    lastModifiedAt: 'test-modified',
  };

  const address = {
    id: 'test',
    streetName: 'test-street',
    city: 'tet-city',
    postalCode: 'test-post',
    country: 'test-country',
  };

  const testValues = {
    email: 'test-email',
    password: 'test-password',
    firstName: 'test-name',
    lastName: 'test-last-name',
    dateOfBirth: 'test',
    addresses: [address],
    defaultShippingAddress: 1,
    defaultBillingAddress: 0,
  };

  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ customer: mockResponse }),
  });

  const result = await registerCustomer(testValues);
  expect(result).toEqual(mockResponse);
});

test('registerCustomer throws CtError if registration fails', async () => {
  const errorResponse = { message: 'Customer already exists' };

  const address = {
    id: 'test',
    streetName: 'test-street',
    city: 'tet-city',
    postalCode: 'test-post',
    country: 'test-country',
  };

  const testValues = {
    id: 'test',
    email: 'test-email',
    password: 'test-password',
    firstName: 'test-name',
    lastName: 'test-last-name',
    dateOfBirth: 'test',
    addresses: [address],
    defaultShippingAddress: 1,
    defaultBillingAddress: 0,
  };

  (fetch as jest.Mock).mockResolvedValue({
    ok: false,
    status: 400,
    json: async () => errorResponse,
  });

  await expect(registerCustomer(testValues)).rejects.toThrow(CtError);
});
