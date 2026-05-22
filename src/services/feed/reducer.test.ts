import { describe, it, expect } from 'vitest';

import {
  feedSlice,
  initialState,
  connect,
  disconnect,
  onOpen,
  onMessage,
  onError,
  onClose,
} from './reducer';

import type { TOrdersResponse } from '@utils/types';

describe('feed reducer', () => {
  it('should return initial state', () => {
    expect(feedSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('connect', () => {
    it('should clear error when connecting', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const result = feedSlice.reducer(stateWithError, connect());
      expect(result.error).toBeNull();
    });
  });

  describe('disconnect', () => {
    it('should set isConnected to false', () => {
      const connectedState = { ...initialState, isConnected: true };
      const result = feedSlice.reducer(connectedState, disconnect());
      expect(result.isConnected).toBe(false);
    });
  });

  describe('onOpen', () => {
    it('should set isConnected to true', () => {
      const result = feedSlice.reducer(initialState, onOpen(true));
      expect(result.isConnected).toBe(true);
    });

    it('should clear error on open', () => {
      const stateWithError = { ...initialState, error: 'Connection error' };
      const result = feedSlice.reducer(stateWithError, onOpen(true));
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
            number: 123,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        total: 100,
        totalToday: 10,
      };

      const result = feedSlice.reducer(initialState, onMessage(mockOrders));

      expect(result.orders).toEqual(mockOrders.orders);
      expect(result.total).toBe(100);
      expect(result.totalToday).toBe(10);
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
      const result = feedSlice.reducer(stateWithError, onMessage(mockOrders));
      expect(result.error).toBeNull();
    });
  });

  describe('onError', () => {
    it('should set error message', () => {
      const result = feedSlice.reducer(initialState, onError('Connection failed'));
      expect(result.error).toBe('Connection failed');
    });

    it('should set isConnected to false on error', () => {
      const connectedState = { ...initialState, isConnected: true };
      const result = feedSlice.reducer(connectedState, onError('Error'));
      expect(result.isConnected).toBe(false);
    });
  });

  describe('onClose', () => {
    it('should set isConnected to provided value', () => {
      const result = feedSlice.reducer(initialState, onClose(false));
      expect(result.isConnected).toBe(false);
    });
  });
});
