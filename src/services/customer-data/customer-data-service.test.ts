import {
  fetchCustomerProfile,
  changeCustomerPassword,
  addCustomerAddress,
  removeCustomerAddress,
  changeCustomerAddress,
  CtError,
} from './customer-data-service';
import type {
  UserProfile,
  ChangePasswordPayload,
} from '../../types/user-profile';
import type { Address } from '../../types/registration';

describe('customer-data-service', () => {
  const fakeToken = 'fake-jwt';
  const baseUrl = 'https://api.test';
  const projectKey = 'proj';

  beforeAll(() => {
    process.env.REACT_APP_CT_API_URL = baseUrl;
    process.env.REACT_APP_CT_PROJECT_KEY = projectKey;
  });

  beforeEach(() => {
    jest
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockImplementation((key) => {
        if (key === 'customer-token') {
          return fakeToken;
        }
        return null;
      });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const makeResponse = <T>(
    ok: boolean,
    status: number,
    data: T,
  ): Promise<Response> =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(data),
    } as Response);

  const sampleProfile: UserProfile = {
    version: 3,
    createdAt: '2021-01-01T00:00:00Z',
    lastModifiedAt: '2021-01-02T00:00:00Z',
    email: 'user@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    dateOfBirth: '1990-05-20T00:00:00Z',
    isEmailVerified: true,
    authenticationMode: 'Password',
    addresses: [
      {
        id: 'a1',
        streetName: 'St1',
        city: 'C1',
        postalCode: '111',
        country: 'X',
      },
      {
        id: 'a2',
        streetName: 'St2',
        city: 'C2',
        postalCode: '222',
        country: 'Y',
      },
    ],
    defaultShippingAddress: 0,
    defaultBillingAddress: 1,
  };

  it('fetchCustomerProfile success', async () => {
    (fetch as jest.Mock).mockReturnValueOnce(
      makeResponse(true, 200, sampleProfile),
    );

    const result = await fetchCustomerProfile();
    expect(fetch).toHaveBeenCalledWith(
      `${baseUrl}/${projectKey}/me`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${fakeToken}`,
        }),
      }),
    );
    expect(result).toEqual(sampleProfile);
  });

  it('fetchCustomerProfile throws CtError on missing token', async () => {
    jest
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockReturnValueOnce(null);
    await expect(fetchCustomerProfile()).rejects.toBeInstanceOf(CtError);
  });

  it('fetchCustomerProfile throws CtError on 4xx', async () => {
    (fetch as jest.Mock).mockReturnValueOnce(
      makeResponse(false, 403, { message: 'forbidden' }),
    );

    await expect(fetchCustomerProfile()).rejects.toMatchObject({
      status: 403,
      data: { message: 'forbidden' },
    });
  });

  it('changeCustomerPassword success', async () => {
    (fetch as jest.Mock).mockReturnValueOnce(makeResponse(true, 200, {}));
    const payload: ChangePasswordPayload = {
      version: sampleProfile.version,
      currentPassword: 'old',
      newPassword: 'new',
    };
    await expect(changeCustomerPassword(payload)).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      `${baseUrl}/${projectKey}/me/password`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  });

  it('changeCustomerPassword throws CtError on bad request', async () => {
    (fetch as jest.Mock).mockReturnValueOnce(
      makeResponse(false, 400, { error: 'bad' }),
    );
    await expect(
      changeCustomerPassword({
        version: sampleProfile.version,
        currentPassword: 'old',
        newPassword: 'new',
      }),
    ).rejects.toMatchObject({ status: 400 });
  });

  const address: Address = {
    id: '',
    streetName: 'S',
    city: 'C',
    postalCode: 'P',
    country: 'D',
  };

  it('addCustomerAddress success', async () => {
    (fetch as jest.Mock).mockReturnValueOnce(
      makeResponse(true, 200, sampleProfile),
    );
    const result = await addCustomerAddress(1, address);
    expect(result).toEqual(sampleProfile);
  });

  it('removeCustomerAddress success', async () => {
    (fetch as jest.Mock).mockReturnValueOnce(
      makeResponse(true, 200, sampleProfile),
    );
    const result = await removeCustomerAddress(1, 'a1');
    expect(result).toEqual(sampleProfile);
  });

  it('changeCustomerAddress success', async () => {
    (fetch as jest.Mock).mockReturnValueOnce(
      makeResponse(true, 200, sampleProfile),
    );
    const result = await changeCustomerAddress(1, 'a1', address);
    expect(result).toEqual(sampleProfile);
  });

});
