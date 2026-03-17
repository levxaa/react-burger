import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

type ConstructorIngredient = TIngredient & {
  id: string;
};

type ConstructorState = {
  bun: TIngredient | undefined;
  ingredients: ConstructorIngredient[];
};
const initialState: ConstructorState = {
  bun: undefined,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (!state.ingredients) {
        state.ingredients = [];
      }

      state.ingredients.push({
        ...action.payload,
        id: nanoid(),
      });
    },
  },
});

export const { setBun, addIngredient } = constructorSlice.actions;
export default constructorSlice.reducer;
