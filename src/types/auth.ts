export type AuthUser = {
  id: string;
  email: string | null;
  fullName: string;
  role: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type VerifyAccountRequest = {
  email: string;
  code: string;
};

export type ApiValidationError = {
  internalCode?: number;
  field?: string;
  message: string;
};

export type ApiErrorResponse = {
  message: string;
  status: number;
  timestamp: string;
  errors?: ApiValidationError[];
};
