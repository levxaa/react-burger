import { describe, it, expect } from 'vitest';

import ingredientsReducer, { fetchIngredients, initialState } from './reducer';

describe('ingredients reducer', () => {
  it('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    it('should set loading on pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const result = ingredientsReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should set ingredients on fulfilled', () => {
      const mockIngredients = [
        {
          _id: 'ing-1',
          name: 'Булка',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 30,
          calories: 100,
          price: 50,
          image: 'bun.png',
          image_large: 'bun-large.png',
          image_mobile: 'bun-mobile.png',
          __v: 0,
        },
        {
          _id: 'ing-2',
          name: 'Котлета',
          type: 'main',
          proteins: 20,
          fat: 15,
          carbohydrates: 10,
          calories: 200,
          price: 100,
          image: 'cutlet.png',
          image_large: 'cutlet-large.png',
          image_mobile: 'cutlet-mobile.png',
          __v: 0,
        },
      ];

      const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients };
      const result = ingredientsReducer({ ...initialState, loading: true }, action);

      expect(result.loading).toBe(false);
      expect(result.ingredients).toEqual(mockIngredients);
    });

    it('should set error on rejected', () => {
      const result = ingredientsReducer(
        { ...initialState, loading: true },
        {
          type: fetchIngredients.rejected.type,
          payload: 'Failed to fetch ingredients',
        }
      );

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Failed to fetch ingredients');
    });
  });
});
