import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { selectIngredient, clearIngredient } from './actions.ts';

import type { TIngredient } from '@utils/types';

type IngredientState = {
  selectedIngredient: TIngredient | undefined;
};

const initialState: IngredientState = {
  selectedIngredient: undefined,
};

export const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(selectIngredient, (state, action: PayloadAction<TIngredient>) => {
        state.selectedIngredient = action.payload;
      })
      .addCase(clearIngredient, (state) => {
        state.selectedIngredient = undefined;
      });
  },
});
