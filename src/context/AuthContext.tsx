import {
  createContext,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { AuthContextType } from '../types/auth';
import {
  getAnonymousToken,
  getAuthenticationToken,
  authenticateCustomer,
} from '../services/login/auth';

export const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  login: () => {},
  logout: () => {},
  customerId: '',
  anonymousAccess: () => {},
});

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const [isLogin, setIsLogin] = useState(false);
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('customer-token');
    if (token) {
      setIsLogin(true);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    onError: (message: string) => void,
    onSuccess: () => void,
    afterRegistration?: boolean,
    customerId?: string,
  ): Promise<void> => {
    if (!afterRegistration) {
      const { userId, loginError } = await authenticateCustomer(
        email,
        password,
      );

      if (loginError || !userId) {
        onError('Wrong login or password or both');
        return;
      }

      setCustomerId(userId);
    }

    if (afterRegistration && customerId) {
      setCustomerId(customerId);
    }

    const { data, error } = await getAuthenticationToken(email, password);
    if (error) {
      new Error('Token receipt error');
      return;
    }
    if (data?.access_token && data?.refresh_token) {
      localStorage.setItem('customer-token', data.access_token);
      localStorage.setItem('refresh-token', data.refresh_token);

      setIsLogin(true);
      onSuccess();
      localStorage.removeItem('anonymous-token');
    }
  };

  const logout = (): void => {
    localStorage.removeItem('customer-token');
    localStorage.removeItem('promo-code-name');
    localStorage.removeItem('refresh-token');
    setIsLogin(false);
    setCustomerId('');
    anonymousAccess();
  };

  const anonymousAccess = async (): Promise<void> => {
    const { data, error } = await getAnonymousToken();
    if (error) {
      new Error('Error getting anonymous token');
      return;
    }
    if (data) {
      localStorage.setItem('anonymous-token', data?.access_token);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLogin, login, logout, customerId, anonymousAccess }}
    >
      {children}
    </AuthContext.Provider>
  );
};
