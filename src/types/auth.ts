export type AuthResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
  token_type: string;
};

export type CustomerResponse = {
  addresses: [];
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  password: string;
  createdAt: string;
  lastModifiedAt: string;
};

export type AuthContextType = {
  isLogin: boolean;
  login: (
    email: string,
    password: string,
    onError: (message: string) => void,
    onSuccess: () => void,
    afterRegistration?: boolean,
    customerId?: string,
  ) => void;
  logout: () => void;
  customerId: string;
  anonymousAccess: () => void;
};
