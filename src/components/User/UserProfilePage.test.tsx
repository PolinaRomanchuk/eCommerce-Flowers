import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserProfilePage } from './UserProfile';
import type { UserProfile } from '../../types/user-profile';
import * as service from '../../services/customer-data/customer-data-service';

jest.mock('../../../services/customer-data/customer-data-service');

const mockProfile: UserProfile = {
  version: 1,
  createdAt: '2020-01-01T00:00:00Z',
  lastModifiedAt: '2020-01-01T00:00:00Z',
  email: 'foo@bar.com',
  firstName: 'Foo',
  lastName: 'Bar',
  dateOfBirth: '1990-05-05T00:00:00Z',
  isEmailVerified: true,
  authenticationMode: 'password',
  addresses: [
    {
      id: 'a1',
      streetName: 'Main St',
      city: 'Town',
      postalCode: '12-345',
      country: 'PL',
    },
  ],
  defaultShippingAddress: 0,
  defaultBillingAddress: 0,
};

describe('UserProfilePage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows loader before loading profile', () => {
    (service.fetchCustomerProfile as jest.Mock).mockReturnValue(
      new Promise(() => {}),
    );
    render(<UserProfilePage size={0} />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('displays profile data after loading', async () => {
    (service.fetchCustomerProfile as jest.Mock).mockResolvedValue(mockProfile);
    render(<UserProfilePage size={0} />);
    expect(await screen.findByText(/Foo Bar/)).toBeInTheDocument();
    expect(screen.getByText(/foo@bar.com/)).toBeInTheDocument();
  });

  it('shows form and succses changes', async () => {
    (service.fetchCustomerProfile as jest.Mock).mockResolvedValue(mockProfile);
    (service.changeCustomerPassword as jest.Mock).mockResolvedValue(undefined);

    render(<UserProfilePage size={0} />);
    const togglePwd = await screen.findByRole('button', {
      name: /Change Password/,
    });
    fireEvent.click(togglePwd);

    const current = screen.getByLabelText(/Current Password/);
    fireEvent.change(current, { target: { value: 'Old1234' } });

    const newPwd = screen.getByLabelText(/^New Password/);
    fireEvent.change(newPwd, { target: { value: 'New123345' } });

    const confirm = screen.getByLabelText(/Confirm New Password/);
    fireEvent.change(confirm, { target: { value: 'New123345' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Password/ }));

    expect(
      await screen.findByText(/Your password has been changed successfully/),
    ).toBeInTheDocument();
  });

  it('shows profile loading problems', async () => {
    (service.fetchCustomerProfile as jest.Mock).mockRejectedValue(
      new service.CtError(500, {}),
    );
    render(<UserProfilePage size={0} />);
    expect(
      await screen.findByText(/Failed to load profile/),
    ).toBeInTheDocument();
  });
});
