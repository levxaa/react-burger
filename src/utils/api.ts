import { BASE_URL } from './constants';

export type TAuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
  };
};

export type TUser = {
  email: string;
  name: string;
};

const checkResponse = <T>(res: Response): Promise<T> => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(new Error(`Ошибка ${res.status}`));
};

const checkSuccess = <T>(res: T): Promise<T> => {
  if (
    res &&
    typeof res === 'object' &&
    'success' in res &&
    (res as { success?: boolean }).success
  ) {
    return Promise.resolve(res);
  }
  return Promise.reject(new Error(`Ответ не success`));
};

export const request = <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  return fetch(`${BASE_URL}${endpoint}`, options)
    .then((res) => checkResponse<T>(res))
    .then((res) => checkSuccess<T>(res));
};

export const registerRequest = (
  email: string,
  password: string,
  name: string
): Promise<TAuthResponse> =>
  request<TAuthResponse>(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

export const loginRequest = (email: string, password: string): Promise<TAuthResponse> =>
  request<TAuthResponse>(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

export const logoutRequest = (
  refreshToken: string
): Promise<{ success: boolean; message: string }> =>
  request<{ success: boolean; message: string }>(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });

export const refreshTokenRequest = (refreshToken: string): Promise<TAuthResponse> =>
  request<TAuthResponse>(`${BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const fetchWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const accessToken = getAccessToken();
  if (accessToken) {
    (defaultHeaders as Record<string, string>).Authorization = accessToken;
  }

  try {
    return await request<T>(endpoint, { ...options, headers: defaultHeaders });
  } catch (err) {
    if (err instanceof Error && err.message.includes('401')) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const newTokens = await refreshTokenRequest(refreshToken);
        setTokens(newTokens.accessToken, newTokens.refreshToken);

        (defaultHeaders as Record<string, string>).Authorization = newTokens.accessToken;
        return await request<T>(endpoint, { ...options, headers: defaultHeaders });
      }
    }
    throw err;
  }
};

export const resetPasswordRequest = (
  email: string
): Promise<{ success: boolean; message: string }> =>
  request<{ success: boolean; message: string }>(`${BASE_URL}/password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

export const setNewPasswordRequest = (
  password: string,
  token: string
): Promise<{ success: boolean; message: string }> =>
  request<{ success: boolean; message: string }>(`${BASE_URL}/password-reset/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, token }),
  });
