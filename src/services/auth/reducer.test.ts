import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  authSlice,
  register,
  login,
  logout,
  checkAuth,
  updateUser,
  clearError,
} from './reducer';

describe('auth reducer', () => {
  const initialState = {
    user: null,
    isAuth: false,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(authSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const result = authSlice.reducer(stateWithError, clearError());
    expect(result.error).toBeNull();
  });

  describe('register', () => {
    it('should set loading on pending', () => {
      const action = { type: register.pending.type };
      const result = authSlice.reducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should set user and isAuth on fulfilled', () => {
      const mockUser = { email: 'test@test.com', name: 'Test User' };
      const action = { type: register.fulfilled.type, payload: mockUser };
      const result = authSlice.reducer({ ...initialState, isLoading: true }, action);
      expect(result.isLoading).toBe(false);
      expect(result.isAuth).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it('should set error on rejected', () => {
      const result = authSlice.reducer(
        { ...initialState, isLoading: true },
        {
          type: register.rejected.type,
          error: { message: 'Registration failed' },
        }
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Registration failed');
    });
  });

  describe('login', () => {
    it('should set loading on pending', () => {
      const action = { type: login.pending.type };
      const result = authSlice.reducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should set user and isAuth on fulfilled', () => {
      const mockUser = { email: 'test@test.com', name: 'Test User' };
      const action = { type: login.fulfilled.type, payload: mockUser };
      const result = authSlice.reducer({ ...initialState, isLoading: true }, action);
      expect(result.isLoading).toBe(false);
      expect(result.isAuth).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it('should set error on rejected', () => {
      const result = authSlice.reducer(
        { ...initialState, isLoading: true },
        { type: login.rejected.type, error: { message: 'Login failed' } }
      );
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Login failed');
    });
  });

  describe('logout', () => {
    it('should clear user and isAuth on fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: { email: 'test@test.com', name: 'Test' },
        isAuth: true,
      };
      const action = { type: logout.fulfilled.type };
      const result = authSlice.reducer(stateWithUser, action);
      expect(result.user).toBeNull();
      expect(result.isAuth).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('should set loading on pending', () => {
      const action = { type: checkAuth.pending.type };
      const result = authSlice.reducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('should set user and isAuth on fulfilled', () => {
      const mockUser = { email: 'test@test.com', name: 'Test User' };
      const action = { type: checkAuth.fulfilled.type, payload: mockUser };
      const result = authSlice.reducer({ ...initialState, isLoading: true }, action);
      expect(result.isLoading).toBe(false);
      expect(result.isAuth).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it('should clear user and isAuth on rejected', () => {
      const stateWithUser = {
        ...initialState,
        user: { email: 'test@test.com', name: 'Test' },
        isAuth: true,
      };
      const action = { type: checkAuth.rejected.type };
      const result = authSlice.reducer(stateWithUser, action);
      expect(result.isLoading).toBe(false);
      expect(result.isAuth).toBe(false);
      expect(result.user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user on fulfilled', () => {
      const initialUser = { email: 'old@test.com', name: 'Old Name' };
      const updatedUser = { email: 'new@test.com', name: 'New Name' };
      const state = { ...initialState, user: initialUser };
      const action = { type: updateUser.fulfilled.type, payload: updatedUser };
      const result = authSlice.reducer(state, action);
      expect(result.user).toEqual(updatedUser);
    });
  });
});
