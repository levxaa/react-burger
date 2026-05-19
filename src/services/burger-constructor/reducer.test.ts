import { describe, it, expect } from 'vitest';

import {
  constructorSlice,
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './reducer';

import type { TIngredient } from '@utils/types';

describe('burgerConstructor reducer', () => {
  const initialState = {
    bun: undefined,
    ingredients: [],
  };

  const mockBun: TIngredient = {
    _id: 'bun-id',
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

  const mockIngredient: TIngredient = {
    _id: 'ingredient-id',
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
  };

  it('should return initial state', () => {
    expect(constructorSlice.reducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('setBun', () => {
    it('should set bun', () => {
      const result = constructorSlice.reducer(initialState, setBun(mockBun));
      expect(result.bun).toEqual(mockBun);
      expect(result.ingredients).toEqual([]);
    });

    it('should replace existing bun', () => {
      const stateWithBun = { ...initialState, bun: mockBun };
      const newBun = { ...mockBun, _id: 'new-bun-id', name: 'Новая булка' };
      const result = constructorSlice.reducer(stateWithBun, setBun(newBun));
      expect(result.bun).toEqual(newBun);
    });
  });

  describe('addIngredient', () => {
    it('should add ingredient with id', () => {
      const result = constructorSlice.reducer(
        initialState,
        addIngredient(mockIngredient)
      );
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].id).toBeDefined();
      expect(typeof result.ingredients[0].id).toBe('string');
      expect(result.ingredients[0].id).not.toBe('');
    });

    it('should add multiple ingredients with unique ids', () => {
      const anotherIngredient = { ...mockIngredient, _id: 'another-id' };
      let state = constructorSlice.reducer(initialState, addIngredient(mockIngredient));
      state = constructorSlice.reducer(state, addIngredient(anotherIngredient));
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by id', () => {
      let state = constructorSlice.reducer(initialState, addIngredient(mockIngredient));
      const ingredientId = state.ingredients[0].id;
      state = constructorSlice.reducer(state, removeIngredient(ingredientId));
      expect(state.ingredients).toHaveLength(0);
    });

    it('should not remove anything if id not found', () => {
      let state = constructorSlice.reducer(initialState, addIngredient(mockIngredient));
      state = constructorSlice.reducer(state, removeIngredient('non-existent-id'));
      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    it('should move ingredient from one index to another', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient({ ...mockIngredient, _id: 'ing-1' })
      );
      state = constructorSlice.reducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ing-2' })
      );
      state = constructorSlice.reducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'ing-3' })
      );

      expect(state.ingredients[0]._id).toBe('ing-1');
      expect(state.ingredients[2]._id).toBe('ing-3');

      state = constructorSlice.reducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(state.ingredients[0]._id).toBe('ing-2');
      expect(state.ingredients[2]._id).toBe('ing-1');
    });

    it('should handle moving to same index', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient({ ...mockIngredient, _id: 'ing-1' })
      );
      state = constructorSlice.reducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 0 })
      );
      expect(state.ingredients[0]._id).toBe('ing-1');
    });
  });

  describe('clearConstructor', () => {
    it('should reset to initial state', () => {
      let state = constructorSlice.reducer(initialState, setBun(mockBun));
      state = constructorSlice.reducer(state, addIngredient(mockIngredient));
      state = constructorSlice.reducer(state, clearConstructor());
      expect(state).toEqual(initialState);
    });
  });
});
