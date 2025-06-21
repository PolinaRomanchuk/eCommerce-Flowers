import {
  authenticateCustomer,
  getAnonymousToken,
  getAuthenticationToken,
} from './auth';

global.fetch = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
});

test('authenticateCustomer returns customer ID if this customer exist in CommerceTools', async () => {
  const mockResponse = { customer: { id: 'test-id' } };
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  });

  const result = await authenticateCustomer('test@test.ru', 'Test12345');
  expect(result).toEqual({ userId: 'test-id' });
});

test('authenticateCustomer returns error if this customer does not exist in CommerceTools', async () => {
  const mockResponse = { error_description: 'Invalid credentials' };
  (fetch as jest.Mock).mockResolvedValue({
    ok: false,
    json: async () => mockResponse,
  });

  const result = await authenticateCustomer('wrongtest@test.ru', 'Test12345');
  expect(result).toEqual({ loginError: 'Invalid credentials' });
});

test('authenticateCustomer returns error when fetch throws', async () => {
  (fetch as jest.Mock).mockRejectedValue(new Error('Login failed'));
  const result = await authenticateCustomer('test@test.ru', 'tesT123456');
  expect(result).toEqual({ loginError: 'Login failed' });
});

test('getAnonymousToken returns anonymous token if user is not login', async () => {
  const mockResponse = {
    access_token: 'test-token',
    expires_in: 1,
    scope: 'test',
    refresh_token: 'test',
    token_type: 'test-type',
  };

  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  });

  const result = await getAnonymousToken();
  expect(result).toEqual({
    data: {
      access_token: 'test-token',
      expires_in: 1,
      scope: 'test',
      refresh_token: 'test',
      token_type: 'test-type',
    },
  });
});

test('getAnonymousToken returns error when fetch throws', async () => {
  (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
  const result = await getAnonymousToken();
  expect(result).toEqual({ error: 'Could not get anonymous token' });
});

test('getAuthenticationToken returns customer token if user is login', async () => {
  const mockResponse = {
    access_token: 'test-customer-token',
    expires_in: 1,
    scope: 'test',
    refresh_token: 'test',
    token_type: 'test-type',
  };

  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  });

  const result = await getAuthenticationToken('test@test.com', 'tesT12345');
  expect(result).toEqual({
    data: {
      access_token: 'test-customer-token',
      expires_in: 1,
      scope: 'test',
      refresh_token: 'test',
      token_type: 'test-type',
    },
  });
});

test('getAuthenticationToken returns error when fetch throws', async () => {
  (fetch as jest.Mock).mockRejectedValue(new Error('Login failed'));
  const result = await getAuthenticationToken('test@test.com', 'tesT123456');
  expect(result).toEqual({ error: 'Login failed' });
});
