import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  loginRequest,
  logoutRequest,
  registerRequest,
  setTokens,
  clearTokens,
} from '../../utils/api';

export type TUser = {
  email: string;
  name: string;
};

type AuthState = {
  user: TUser | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuth: false,
  isLoading: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    const data = await registerRequest(email, password, name);
    setTokens(data.accessToken, data.refreshToken);
    return data.user;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const data = await loginRequest(email, password);
    setTokens(data.accessToken, data.refreshToken);
    return data.user;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    await logoutRequest(refreshToken);
  }
  clearTokens();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка входа';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuth = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
