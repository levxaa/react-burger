import { describe, it, expect } from 'vitest';

import {
  userOrdersSlice,
  connect,
  disconnect,
  onOpen,
  onMessage,
  onError,
  onClose,
} from './reducer';

import type { TOrdersResponse } from '@utils/types';

describe('userOrders reducer', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isConnected: false,
    error: null,
  };

  it('should return initial state', () => {
    expect(userOrdersSlice.reducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('connect', () => {
    it('should clear error when connecting', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const result = userOrdersSlice.reducer(stateWithError, connect('token'));
      expect(result.error).toBeNull();
    });
  });

  describe('disconnect', () => {
    it('should set isConnected to false', () => {
      const connectedState = { ...initialState, isConnected: true };
      const result = userOrdersSlice.reducer(connectedState, disconnect());
      expect(result.isConnected).toBe(false);
    });
  });

  describe('onOpen', () => {
    it('should set isConnected to true', () => {
      const result = userOrdersSlice.reducer(initialState, onOpen(true));
      expect(result.isConnected).toBe(true);
    });

    it('should clear error on open', () => {
      const stateWithError = { ...initialState, error: 'Connection error' };
      const result = userOrdersSlice.reducer(stateWithError, onOpen(true));
      expect(result.error).toBeNull();
    });
  });

  describe('onMessage', () => {
    it('should update orders, total and totalToday', () => {
      const mockOrders: TOrdersResponse = {
        success: true,
        orders: [
          {
            _id: 'order-1',
            ingredients: ['ing-1', 'ing-2'],
            status: 'done',
            number: 456,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        total: 200,
        totalToday: 5,
      };

      const result = userOrdersSlice.reducer(initialState, onMessage(mockOrders));

      expect(result.orders).toEqual(mockOrders.orders);
      expect(result.total).toBe(200);
      expect(result.totalToday).toBe(5);
      expect(result.error).toBeNull();
    });

    it('should clear error on message', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const mockOrders: TOrdersResponse = {
        success: true,
        orders: [],
        total: 0,
        totalToday: 0,
      };
      const result = userOrdersSlice.reducer(stateWithError, onMessage(mockOrders));
      expect(result.error).toBeNull();
    });
  });

  describe('onError', () => {
    it('should set error message', () => {
      const result = userOrdersSlice.reducer(initialState, onError('Auth failed'));
      expect(result.error).toBe('Auth failed');
    });

    it('should set isConnected to false on error', () => {
      const connectedState = { ...initialState, isConnected: true };
      const result = userOrdersSlice.reducer(connectedState, onError('Error'));
      expect(result.isConnected).toBe(false);
    });
  });

  describe('onClose', () => {
    it('should set isConnected to provided value', () => {
      const result = userOrdersSlice.reducer(initialState, onClose(false));
      expect(result.isConnected).toBe(false);
    });
  });
});
