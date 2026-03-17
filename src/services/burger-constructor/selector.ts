import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export const selectConstructorIngredients = (
  state: RootState
): typeof state.burgerConstructor.ingredients => state.burgerConstructor.ingredients;

export const selectConstructorBun = (
  state: RootState
): typeof state.burgerConstructor.bun => state.burgerConstructor.bun;

export const selectAvailableIngredients = (
  state: RootState
): typeof state.ingredients.ingredients => state.ingredients.ingredients;

export const selectIngredientCounts = createSelector(
  [selectAvailableIngredients, selectConstructorIngredients, selectConstructorBun],
  (availableIngredients, constructorIngredients, bun) => {
    const counts: Record<string, number> = {};
    console.log(availableIngredients);
    constructorIngredients.forEach((item) => {
      counts[item._id] = (counts[item._id] || 0) + 1;
    });

    if (bun) {
      counts[bun._id] = 2;
    }

    return counts;
  }
);
