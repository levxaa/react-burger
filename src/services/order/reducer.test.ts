import { describe, it, expect } from 'vitest';

import orderReducer, { createOrder, clearOrder } from './reducer';

describe('order reducer', () => {
  const initialState = {
    order: null,
    loading: false,
    error: null,
  };

  it('should return initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('createOrder', () => {
    it('should set loading on pending', () => {
      const action = { type: createOrder.pending.type };
      const result = orderReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should set order on fulfilled', () => {
      const mockOrder = { number: 12345, name: 'Бургер с говядиной' };
      const action = { type: createOrder.fulfilled.type, payload: mockOrder };
      const result = orderReducer({ ...initialState, loading: true }, action);

      expect(result.loading).toBe(false);
      expect(result.order).toEqual(mockOrder);
    });

    it('should set error on rejected', () => {
      const result = orderReducer(
        { ...initialState, loading: true },
        {
          type: createOrder.rejected.type,
          error: { message: 'Order creation failed' },
        }
      );

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Order creation failed');
    });

    it('should use default error message when no message provided', () => {
      const result = orderReducer(
        { ...initialState, loading: true },
        {
          type: createOrder.rejected.type,
          error: { message: undefined },
        }
      );

      expect(result.error).toBe('Unknown error');
    });
  });

  describe('clearOrder', () => {
    it('should set order to null', () => {
      const stateWithOrder = {
        ...initialState,
        order: { number: 12345, name: 'Test Order' },
      };
      const result = orderReducer(stateWithOrder, clearOrder());
      expect(result.order).toBeNull();
    });

    it('should preserve loading and error state', () => {
      const stateWithOrder = {
        ...initialState,
        order: { number: 12345, name: 'Test Order' },
        loading: false,
        error: null,
      };
      const result = orderReducer(stateWithOrder, clearOrder());
      expect(result.order).toBeNull();
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });
});
