import { createAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

export const selectIngredient = createAction<TIngredient>('SELECT_INGREDIENT');
export const clearIngredient = createAction('CLEAR_INGREDIENT');
