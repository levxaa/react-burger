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
    addIngredient: {
      reducer: (state, action: PayloadAction<ConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient): { payload: ConstructorIngredient } => {
        return {
          payload: {
            ...ingredient,
            id: nanoid(),
          },
        };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, removed);
    },
    clearConstructor: () => {
      return initialState;
    },
  },
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} = constructorSlice.actions;
export default constructorSlice.reducer;
