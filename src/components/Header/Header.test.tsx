import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { AuthContext } from '../../context/AuthContext';
import { MemoryRouter, type NavigateFunction } from 'react-router-dom';

const mockedNavigate = jest.fn() as jest.MockedFunction<NavigateFunction>;

import type * as RRDom from 'react-router-dom';

jest.mock(
  'react-router-dom',
  (): Partial<typeof RRDom> => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
  }),
);

const mockAuth = {
  isLogin: false,
  login: jest.fn(),
  logout: jest.fn(),
  customerId: '123',
  anonymousAccess: jest.fn(),
};

describe('Header', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  const renderHeader = (isLogin: boolean, size: number = 500): void => {
    const authValue = {
      ...mockAuth,
      isLogin,
    };

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Header size={size} />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
  };

  test('renders without crashing and shows "log in" when not logged in', () => {
    renderHeader(false);
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(screen.getByText(/registration/i)).toBeInTheDocument();
  });

  test('shows "log out" when user is logged in', () => {
    renderHeader(true);
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
    expect(screen.queryByText(/registration/i)).toBeNull();
  });

  test('clicking log in link triggers navigate to /login', () => {
    renderHeader(false);
    const loginLink = screen.getByText(/log in/i);
    fireEvent.click(loginLink);
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  test('clicking registration link triggers navigate to /registration', () => {
    renderHeader(false);
    const regLink = screen.getByText(/registration/i);
    fireEvent.click(regLink);
    expect(mockedNavigate).toHaveBeenCalledWith('/registration');
  });

  test('clicking catalog link triggers navigate to /catalog', () => {
    renderHeader(false);
    const catalogLink = screen.getByText(/catalog/i);
    fireEvent.click(catalogLink);
    expect(mockedNavigate).toHaveBeenCalledWith('/catalog');
  });

  test('menu button toggles menu-open class on documentElement', () => {
    renderHeader(false);
    const menuButton = screen.getByRole('button');
    // Initially, menu-open class should not be present
    expect(document.documentElement.classList.contains('menu-open')).toBe(
      false,
    );
    fireEvent.click(menuButton);
    expect(document.documentElement.classList.contains('menu-open')).toBe(true);
    fireEvent.click(menuButton);
    expect(document.documentElement.classList.contains('menu-open')).toBe(
      false,
    );
  });
});
