import { describe, it, expect } from 'vitest';

import { selectIngredient, clearIngredient } from './actions';
import ingredientReducer, { initialState } from './reducer';

import type { TIngredient } from '@utils/types';

describe('selectedIngredient reducer', () => {
  const mockIngredient: TIngredient = {
    _id: 'ingredient-1',
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
  };

  it('should return initial state', () => {
    expect(ingredientReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('selectIngredient', () => {
    it('should set selectedIngredient', () => {
      const action = selectIngredient(mockIngredient);
      const result = ingredientReducer(initialState, action);
      expect(result.selectedIngredient).toEqual(mockIngredient);
    });

    it('should replace existing selected ingredient', () => {
      const firstIngredient = { ...mockIngredient, _id: 'first' };
      const secondIngredient = { ...mockIngredient, _id: 'second' };

      let state = ingredientReducer(initialState, selectIngredient(firstIngredient));
      expect(state.selectedIngredient?._id).toBe('first');

      state = ingredientReducer(state, selectIngredient(secondIngredient));
      expect(state.selectedIngredient?._id).toBe('second');
    });
  });

  describe('clearIngredient', () => {
    it('should set selectedIngredient to undefined', () => {
      const stateWithIngredient = {
        selectedIngredient: mockIngredient,
      };
      const result = ingredientReducer(stateWithIngredient, clearIngredient());
      expect(result.selectedIngredient).toBeUndefined();
    });

    it('should handle clearing when no ingredient selected', () => {
      const result = ingredientReducer(initialState, clearIngredient());
      expect(result.selectedIngredient).toBeUndefined();
    });
  });
});
